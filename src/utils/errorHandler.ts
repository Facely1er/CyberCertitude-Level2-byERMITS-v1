/**
 * Enhanced Error Handling Utility
 * Provides consistent error handling patterns across the application
 */

import { logger } from './logger';
import { errorMonitoring } from '../lib/errorMonitoring';

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  timestamp?: Date;
  metadata?: Record<string, any>;
}

export interface ErrorHandlingOptions {
  showToast?: boolean;
  logError?: boolean;
  reportError?: boolean;
  fallbackValue?: any;
  retryable?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

export interface ErrorResult<T = any> {
  success: boolean;
  data?: T;
  error?: Error;
  message?: string;
  retryable?: boolean;
}

class ErrorHandler {
  private static instance: ErrorHandler;
  private retryAttempts = new Map<string, number>();

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Handle errors with consistent patterns
   */
  handleError<T = any>(
    error: Error | unknown,
    context: ErrorContext = {},
    options: ErrorHandlingOptions = {}
  ): ErrorResult<T> {
    const {
      showToast = true,
      logError = true,
      reportError = true,
      fallbackValue = null,
      retryable = false,
      maxRetries = 3,
      retryDelay = 1000
    } = options;

    const errorInstance = this.normalizeError(error);
    const errorId = this.generateErrorId();
    const timestamp = new Date();

    // Enhanced context
    const enhancedContext: ErrorContext = {
      ...context,
      timestamp,
      metadata: {
        ...context.metadata,
        errorId,
        userAgent: navigator.userAgent,
        url: window.location.href,
        retryable
      }
    };

    // Log error
    if (logError) {
      this.logError(errorInstance, enhancedContext);
    }

    // Report to monitoring service
    if (reportError) {
      this.reportError(errorInstance, enhancedContext);
    }

    // Show user notification
    if (showToast) {
      this.showUserNotification(errorInstance, enhancedContext);
    }

    return {
      success: false,
      data: fallbackValue,
      error: errorInstance,
      message: this.getUserFriendlyMessage(errorInstance),
      retryable
    };
  }

  /**
   * Execute async operations with error handling
   */
  async executeWithErrorHandling<T>(
    operation: () => Promise<T>,
    context: ErrorContext = {},
    options: ErrorHandlingOptions = {}
  ): Promise<ErrorResult<T>> {
    const operationKey = `${context.component}-${context.action}`;
    const retryCount = this.retryAttempts.get(operationKey) || 0;
    const maxRetries = options.maxRetries || 3;

    try {
      const result = await operation();
      
      // Reset retry count on success
      this.retryAttempts.delete(operationKey);
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      const errorResult = this.handleError(error, context, options);

      // Handle retry logic
      if (options.retryable && retryCount < maxRetries) {
        this.retryAttempts.set(operationKey, retryCount + 1);
        
        logger.info(`Retrying operation ${operationKey} (${retryCount + 1}/${maxRetries})`);
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, options.retryDelay || 1000));
        
        return this.executeWithErrorHandling(operation, context, options);
      }

      return errorResult;
    }
  }

  /**
   * Handle API errors specifically
   */
  handleApiError(
    error: any,
    context: ErrorContext = {},
    options: ErrorHandlingOptions = {}
  ): ErrorResult {
    const apiError = this.normalizeApiError(error);
    
    return this.handleError(apiError, {
      ...context,
      action: context.action || 'api-request',
      metadata: {
        ...context.metadata,
        statusCode: error.status || error.statusCode,
        response: error.response?.data || error.data,
        url: error.config?.url || error.url
      }
    }, options);
  }

  /**
   * Handle validation errors
   */
  handleValidationError(
    errors: Record<string, string[]> | string[],
    context: ErrorContext = {},
    options: ErrorHandlingOptions = {}
  ): ErrorResult {
    const validationError = new Error('Validation failed');
    validationError.name = 'ValidationError';
    
    return this.handleError(validationError, {
      ...context,
      action: context.action || 'validation',
      metadata: {
        ...context.metadata,
        validationErrors: errors
      }
    }, {
      ...options,
      showToast: true,
      fallbackValue: null
    });
  }

  /**
   * Handle network errors
   */
  handleNetworkError(
    error: any,
    context: ErrorContext = {},
    options: ErrorHandlingOptions = {}
  ): ErrorResult {
    const networkError = this.normalizeNetworkError(error);
    
    return this.handleError(networkError, {
      ...context,
      action: context.action || 'network-request',
      metadata: {
        ...context.metadata,
        online: navigator.onLine,
        connectionType: (navigator as any).connection?.effectiveType
      }
    }, {
      ...options,
      retryable: true,
      showToast: true
    });
  }

  /**
   * Create a safe async wrapper for React components
   */
  createSafeAsyncHandler<T extends any[], R>(
    handler: (...args: T) => Promise<R>,
    context: ErrorContext = {},
    options: ErrorHandlingOptions = {}
  ) {
    return async (...args: T): Promise<R | null> => {
      const result = await this.executeWithErrorHandling(
        () => handler(...args),
        context,
        options
      );
      
      return result.success ? result.data : null;
    };
  }

  /**
   * Create a safe sync wrapper for React components
   */
  createSafeSyncHandler<T extends any[], R>(
    handler: (...args: T) => R,
    context: ErrorContext = {},
    options: ErrorHandlingOptions = {}
  ) {
    return (...args: T): R | null => {
      try {
        return handler(...args);
      } catch (error) {
        this.handleError(error, context, options);
        return options.fallbackValue || null;
      }
    };
  }

  private normalizeError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    
    if (typeof error === 'string') {
      return new Error(error);
    }
    
    if (typeof error === 'object' && error !== null) {
      return new Error(JSON.stringify(error));
    }
    
    return new Error('Unknown error occurred');
  }

  private normalizeApiError(error: any): Error {
    if (error.response) {
      // Axios error
      const message = error.response.data?.message || 
                    error.response.data?.error || 
                    `HTTP ${error.response.status}: ${error.response.statusText}`;
      const apiError = new Error(message);
      apiError.name = 'ApiError';
      return apiError;
    }
    
    if (error.request) {
      // Network error
      const networkError = new Error('Network request failed');
      networkError.name = 'NetworkError';
      return networkError;
    }
    
    return this.normalizeError(error);
  }

  private normalizeNetworkError(error: any): Error {
    if (!navigator.onLine) {
      const offlineError = new Error('You are currently offline');
      offlineError.name = 'OfflineError';
      return offlineError;
    }
    
    if (error.code === 'NETWORK_ERROR' || error.message?.includes('network')) {
      const networkError = new Error('Network connection failed');
      networkError.name = 'NetworkError';
      return networkError;
    }
    
    return this.normalizeError(error);
  }

  private logError(error: Error, context: ErrorContext): void {
    const logMessage = `Error in ${context.component || 'Unknown'}: ${error.message}`;
    
    logger.error(logMessage, {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      context
    });
  }

  private reportError(error: Error, context: ErrorContext): void {
    try {
      errorMonitoring.captureException(error, {
        extra: context,
        tags: {
          component: context.component || 'unknown',
          action: context.action || 'unknown'
        }
      });
    } catch (reportingError) {
      logger.error('Failed to report error to monitoring service:', reportingError);
    }
  }

  private showUserNotification(error: Error, context: ErrorContext): void {
    // This would integrate with your notification system
    const message = this.getUserFriendlyMessage(error);
    
    // For now, we'll use a simple alert, but in production you'd use a toast system
    if (import.meta.env.DEV) {
      console.error('User notification:', message);
    }
    
    // In production, dispatch to notification system
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('show-notification', {
        detail: {
          type: 'error',
          message,
          context
        }
      }));
    }
  }

  private getUserFriendlyMessage(error: Error): string {
    switch (error.name) {
      case 'ValidationError':
        return 'Please check your input and try again.';
      case 'NetworkError':
        return 'Network connection failed. Please check your internet connection.';
      case 'OfflineError':
        return 'You are currently offline. Please check your connection.';
      case 'ApiError':
        return 'A server error occurred. Please try again later.';
      case 'TimeoutError':
        return 'The request timed out. Please try again.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clear retry attempts for a specific operation
   */
  clearRetryAttempts(operationKey: string): void {
    this.retryAttempts.delete(operationKey);
  }

  /**
   * Clear all retry attempts
   */
  clearAllRetryAttempts(): void {
    this.retryAttempts.clear();
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Export utility functions for common use cases
export const withErrorHandling = <T extends any[], R>(
  handler: (...args: T) => Promise<R>,
  context: ErrorContext = {},
  options: ErrorHandlingOptions = {}
) => errorHandler.createSafeAsyncHandler(handler, context, options);

export const withSyncErrorHandling = <T extends any[], R>(
  handler: (...args: T) => R,
  context: ErrorContext = {},
  options: ErrorHandlingOptions = {}
) => errorHandler.createSafeSyncHandler(handler, context, options);

export default errorHandler;