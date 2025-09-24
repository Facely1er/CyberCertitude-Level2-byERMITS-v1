/**
 * React Hook for Async Operations
 * Provides state management and error handling for async operations
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { asyncUtils, AsyncOperationOptions, AsyncResult } from '../utils/asyncUtils';
import { useMemoryTracking } from './useMemoryTracking';

interface UseAsyncOperationState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  success: boolean;
  cancelled: boolean;
  retryCount: number;
}

interface UseAsyncOperationOptions extends AsyncOperationOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
}

export const useAsyncOperation = <T>(
  operation: (signal: AbortSignal) => Promise<T>,
  options: UseAsyncOperationOptions = {}
) => {
  const {
    immediate = false,
    onSuccess,
    onError,
    onCancel,
    ...asyncOptions
  } = options;

  const [state, setState] = useState<UseAsyncOperationState<T>>({
    data: null,
    error: null,
    loading: false,
    success: false,
    cancelled: false,
    retryCount: 0
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const { safeAsync } = useMemoryTracking();

  const execute = useCallback(async (customOptions?: Partial<AsyncOperationOptions>) => {
    // Cancel previous operation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      cancelled: false
    }));

    try {
      const result = await safeAsync(async (signal) => {
        return await asyncUtils.execute(operation, {
          ...asyncOptions,
          ...customOptions,
          abortSignal: signal
        });
      });

      if (result) {
        setState({
          data: result.data,
          error: result.error,
          loading: false,
          success: result.success,
          cancelled: result.cancelled,
          retryCount: result.retryCount
        });

        if (result.success && result.data && onSuccess) {
          onSuccess(result.data);
        }

        if (result.error && onError) {
          onError(result.error);
        }

        if (result.cancelled && onCancel) {
          onCancel();
        }
      }
    } catch (error) {
      const errorInstance = error instanceof Error ? error : new Error('Unknown error');
      
      setState({
        data: null,
        error: errorInstance,
        loading: false,
        success: false,
        cancelled: false,
        retryCount: 0
      });

      if (onError) {
        onError(errorInstance);
      }
    }
  }, [operation, asyncOptions, onSuccess, onError, onCancel, safeAsync]);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setState(prev => ({
        ...prev,
        loading: false,
        cancelled: true
      }));
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      loading: false,
      success: false,
      cancelled: false,
      retryCount: 0
    });
  }, []);

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    ...state,
    execute,
    cancel,
    reset
  };
};

// Hook for multiple async operations
export const useAsyncOperations = <T>(
  operations: Array<(signal: AbortSignal) => Promise<T>>,
  options: UseAsyncOperationOptions = {}
) => {
  const [state, setState] = useState<{
    results: AsyncResult<T>[];
    loading: boolean;
    completed: number;
    total: number;
  }>({
    results: [],
    loading: false,
    completed: 0,
    total: operations.length
  });

  const { safeAsync } = useMemoryTracking();

  const executeAll = useCallback(async (customOptions?: Partial<AsyncOperationOptions>) => {
    setState(prev => ({
      ...prev,
      loading: true,
      completed: 0
    }));

    try {
      const results = await safeAsync(async () => {
        return await asyncUtils.executeAll(operations, {
          ...options,
          ...customOptions,
          onProgress: (progress) => {
            setState(prev => ({
              ...prev,
              completed: Math.floor((progress / 100) * operations.length)
            }));
          }
        });
      });

      if (results) {
        setState(prev => ({
          ...prev,
          results,
          loading: false,
          completed: operations.length
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false
      }));
    }
  }, [operations, options, safeAsync]);

  const executeWithConcurrency = useCallback(async (
    concurrency: number,
    customOptions?: Partial<AsyncOperationOptions>
  ) => {
    setState(prev => ({
      ...prev,
      loading: true,
      completed: 0
    }));

    try {
      const results = await safeAsync(async () => {
        return await asyncUtils.executeWithConcurrency(operations, concurrency, {
          ...options,
          ...customOptions
        });
      });

      if (results) {
        setState(prev => ({
          ...prev,
          results,
          loading: false,
          completed: operations.length
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false
      }));
    }
  }, [operations, options, safeAsync]);

  return {
    ...state,
    executeAll,
    executeWithConcurrency
  };
};

// Hook for debounced async operations
export const useDebouncedAsync = <T>(
  operation: (signal: AbortSignal) => Promise<T>,
  delay: number,
  options: UseAsyncOperationOptions = {}
) => {
  const debouncedOperation = useRef(
    asyncUtils.createDebounced(operation, delay, options)
  );

  const [state, setState] = useState<UseAsyncOperationState<T>>({
    data: null,
    error: null,
    loading: false,
    success: false,
    cancelled: false,
    retryCount: 0
  });

  const execute = useCallback(async (signal?: AbortSignal) => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null
    }));

    try {
      const result = await debouncedOperation.current(signal);
      
      setState({
        data: result.data,
        error: result.error,
        loading: false,
        success: result.success,
        cancelled: result.cancelled,
        retryCount: result.retryCount
      });

      if (result.success && result.data && options.onSuccess) {
        options.onSuccess(result.data);
      }

      if (result.error && options.onError) {
        options.onError(result.error);
      }
    } catch (error) {
      const errorInstance = error instanceof Error ? error : new Error('Unknown error');
      
      setState({
        data: null,
        error: errorInstance,
        loading: false,
        success: false,
        cancelled: false,
        retryCount: 0
      });
    }
  }, [options]);

  return {
    ...state,
    execute
  };
};

// Hook for throttled async operations
export const useThrottledAsync = <T>(
  operation: (signal: AbortSignal) => Promise<T>,
  interval: number,
  options: UseAsyncOperationOptions = {}
) => {
  const throttledOperation = useRef(
    asyncUtils.createThrottled(operation, interval, options)
  );

  const [state, setState] = useState<UseAsyncOperationState<T>>({
    data: null,
    error: null,
    loading: false,
    success: false,
    cancelled: false,
    retryCount: 0
  });

  const execute = useCallback(async (signal?: AbortSignal) => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null
    }));

    try {
      const result = await throttledOperation.current(signal);
      
      setState({
        data: result.data,
        error: result.error,
        loading: false,
        success: result.success,
        cancelled: result.cancelled,
        retryCount: result.retryCount
      });

      if (result.success && result.data && options.onSuccess) {
        options.onSuccess(result.data);
      }

      if (result.error && options.onError) {
        options.onError(result.error);
      }
    } catch (error) {
      const errorInstance = error instanceof Error ? error : new Error('Unknown error');
      
      setState({
        data: null,
        error: errorInstance,
        loading: false,
        success: false,
        cancelled: false,
        retryCount: 0
      });
    }
  }, [options]);

  return {
    ...state,
    execute
  };
};

export default useAsyncOperation;