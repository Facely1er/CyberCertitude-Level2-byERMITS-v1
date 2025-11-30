/**
 * Async Operations Utility
 * Provides robust async operation handling with proper error management and cancellation
 */

import { logger } from './logger';
import { errorHandler } from './errorHandler';

interface AsyncOperationOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  abortSignal?: AbortSignal;
  onProgress?: (progress: number) => void;
  onRetry?: (attempt: number, error: Error) => void;
}

interface AsyncResult<T> {
  data: T | null;
  error: Error | null;
  success: boolean;
  cancelled: boolean;
  retryCount: number;
}

class AsyncUtils {
  private static instance: AsyncUtils;
  private activeOperations = new Map<string, AbortController>();

  static getInstance(): AsyncUtils {
    if (!AsyncUtils.instance) {
      AsyncUtils.instance = new AsyncUtils();
    }
    return AsyncUtils.instance;
  }

  /**
   * Execute an async operation with comprehensive error handling
   */
  async execute<T>(
    operation: (signal: AbortSignal) => Promise<T>,
    options: AsyncOperationOptions = {}
  ): Promise<AsyncResult<T>> {
    const {
      timeout = 30000,
      retries = 3,
      retryDelay = 1000,
      abortSignal,
      onProgress,
      onRetry
    } = options;

    const operationId = this.generateOperationId();
    const controller = new AbortController();
    const combinedSignal = this.combineAbortSignals(controller.signal, abortSignal);

    // Track active operation
    this.activeOperations.set(operationId, controller);

    try {
      // Set up timeout
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, timeout);

      // Execute with retries
      const result = await this.executeWithRetries(
        operation,
        combinedSignal,
        retries,
        retryDelay,
        onRetry,
        onProgress
      );

      clearTimeout(timeoutId);
      this.activeOperations.delete(operationId);

      return {
        data: result,
        error: null,
        success: true,
        cancelled: false,
        retryCount: 0
      };
    } catch (error) {
      this.activeOperations.delete(operationId);
      
      const isCancelled = error instanceof Error && error.name === 'AbortError';
      
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error'),
        success: false,
        cancelled: isCancelled,
        retryCount: 0
      };
    }
  }

  /**
   * Execute multiple async operations in parallel with proper error handling
   */
  async executeAll<T>(
    operations: Array<(signal: AbortSignal) => Promise<T>>,
    options: AsyncOperationOptions = {}
  ): Promise<AsyncResult<T>[]> {
    const abortController = new AbortController();
    const combinedSignal = this.combineAbortSignals(abortController.signal, options.abortSignal);

    try {
      const promises = operations.map(operation => 
        this.execute(operation, { ...options, abortSignal: combinedSignal })
      );

      const results = await Promise.allSettled(promises);
      
      return results.map(result => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          return {
            data: null,
            error: result.reason instanceof Error ? result.reason : new Error('Unknown error'),
            success: false,
            cancelled: false,
            retryCount: 0
          };
        }
      });
    } catch (error) {
      logger.error('Parallel execution failed:', error);
      throw error;
    }
  }

  /**
   * Execute async operations with a concurrency limit
   */
  async executeWithConcurrency<T>(
    operations: Array<(signal: AbortSignal) => Promise<T>>,
    concurrency: number,
    options: AsyncOperationOptions = {}
  ): Promise<AsyncResult<T>[]> {
    const results: AsyncResult<T>[] = [];
    const executing: Promise<void>[] = [];

    for (let i = 0; i < operations.length; i++) {
      const operation = operations[i];
      
      const promise = this.execute(operation, options).then(result => {
        results[i] = result;
      });

      executing.push(promise);

      if (executing.length >= concurrency) {
        await Promise.race(executing);
        executing.splice(executing.findIndex(p => p === promise), 1);
      }
    }

    await Promise.all(executing);
    return results;
  }

  /**
   * Create a debounced async operation
   */
  createDebounced<T>(
    operation: (signal: AbortSignal) => Promise<T>,
    delay: number,
    options: AsyncOperationOptions = {}
  ) {
    let timeoutId: NodeJS.Timeout | null = null;
    let abortController: AbortController | null = null;

    return (signal?: AbortSignal): Promise<AsyncResult<T>> => {
      return new Promise((resolve) => {
        // Cancel previous operation
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (abortController) {
          abortController.abort();
        }

        // Create new abort controller
        abortController = new AbortController();
        const combinedSignal = this.combineAbortSignals(abortController.signal, signal);

        // Set up debounced execution
        timeoutId = setTimeout(async () => {
          try {
            const result = await this.execute(operation, {
              ...options,
              abortSignal: combinedSignal
            });
            resolve(result);
          } catch (error) {
            resolve({
              data: null,
              error: error instanceof Error ? error : new Error('Unknown error'),
              success: false,
              cancelled: false,
              retryCount: 0
            });
          }
        }, delay);
      });
    };
  }

  /**
   * Create a throttled async operation
   */
  createThrottled<T>(
    operation: (signal: AbortSignal) => Promise<T>,
    interval: number,
    options: AsyncOperationOptions = {}
  ) {
    let lastExecution = 0;
    let pendingExecution: Promise<AsyncResult<T>> | null = null;

    return (signal?: AbortSignal): Promise<AsyncResult<T>> => {
      const now = Date.now();
      
      if (now - lastExecution < interval) {
        // Return pending execution if available
        if (pendingExecution) {
          return pendingExecution;
        }
        
        // Schedule execution after interval
        return new Promise((resolve) => {
          setTimeout(async () => {
            try {
              const result = await this.execute(operation, { ...options, abortSignal: signal });
              lastExecution = Date.now();
              pendingExecution = null;
              resolve(result);
            } catch (error) {
              pendingExecution = null;
              resolve({
                data: null,
                error: error instanceof Error ? error : new Error('Unknown error'),
                success: false,
                cancelled: false,
                retryCount: 0
              });
            }
          }, interval - (now - lastExecution));
        });
      }

      // Execute immediately
      lastExecution = now;
      pendingExecution = this.execute(operation, { ...options, abortSignal: signal });
      return pendingExecution;
    };
  }

  /**
   * Create a cache for async operations
   */
  createCache<T>(
    operation: (signal: AbortSignal) => Promise<T>,
    ttl: number = 300000, // 5 minutes
    options: AsyncOperationOptions = {}
  ) {
    const cache = new Map<string, { data: T; timestamp: number; promise: Promise<AsyncResult<T>> }>();

    return (key: string, signal?: AbortSignal): Promise<AsyncResult<T>> => {
      const now = Date.now();
      const cached = cache.get(key);

      // Return cached data if still valid
      if (cached && now - cached.timestamp < ttl) {
        return Promise.resolve({
          data: cached.data,
          error: null,
          success: true,
          cancelled: false,
          retryCount: 0
        });
      }

      // Return existing promise if operation is in progress
      if (cached && cached.promise) {
        return cached.promise;
      }

      // Execute new operation
      const promise = this.execute(operation, { ...options, abortSignal: signal });
      
      promise.then(result => {
        if (result.success && result.data) {
          cache.set(key, {
            data: result.data,
            timestamp: now,
            promise: Promise.resolve(result)
          });
        }
      });

      cache.set(key, {
        data: cached?.data || null as T,
        timestamp: now,
        promise
      });

      return promise;
    };
  }

  /**
   * Cancel all active operations
   */
  cancelAllOperations(): void {
    this.activeOperations.forEach(controller => {
      controller.abort();
    });
    this.activeOperations.clear();
  }

  /**
   * Get active operations count
   */
  getActiveOperationsCount(): number {
    return this.activeOperations.size;
  }

  private async executeWithRetries<T>(
    operation: (signal: AbortSignal) => Promise<T>,
    signal: AbortSignal,
    retries: number,
    retryDelay: number,
    onRetry?: (attempt: number, error: Error) => void,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        if (signal.aborted) {
          throw new Error('Operation aborted');
        }

        if (onProgress) {
          onProgress((attempt / (retries + 1)) * 100);
        }

        const result = await operation(signal);
        
        if (onProgress) {
          onProgress(100);
        }

        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt < retries && !signal.aborted) {
          if (onRetry) {
            onRetry(attempt + 1, lastError);
          }
          
          await this.delay(retryDelay * Math.pow(2, attempt)); // Exponential backoff
        } else {
          throw lastError;
        }
      }
    }

    throw lastError || new Error('Operation failed');
  }

  private combineAbortSignals(...signals: (AbortSignal | undefined)[]): AbortSignal {
    const validSignals = signals.filter((signal): signal is AbortSignal => signal !== undefined);
    
    if (validSignals.length === 0) {
      return new AbortController().signal;
    }
    
    if (validSignals.length === 1) {
      return validSignals[0];
    }

    const controller = new AbortController();
    
    validSignals.forEach(signal => {
      if (signal.aborted) {
        controller.abort();
      } else {
        signal.addEventListener('abort', () => controller.abort());
      }
    });

    return controller.signal;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateOperationId(): string {
    return `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const asyncUtils = AsyncUtils.getInstance();

// Utility functions for common async patterns
export const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage: string = 'Operation timed out'
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs)
    )
  ]);
};

export const withRetry = <T>(
  operation: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  return asyncUtils.execute(
    () => operation(),
    { retries, retryDelay: delay }
  ).then(result => {
    if (result.success && result.data) {
      return result.data;
    }
    throw result.error || new Error('Operation failed');
  });
};

export const withCancellation = <T>(
  operation: (signal: AbortSignal) => Promise<T>,
  signal?: AbortSignal
): Promise<T> => {
  return asyncUtils.execute(operation, { abortSignal: signal }).then(result => {
    if (result.success && result.data) {
      return result.data;
    }
    throw result.error || new Error('Operation failed');
  });
};

export default asyncUtils;