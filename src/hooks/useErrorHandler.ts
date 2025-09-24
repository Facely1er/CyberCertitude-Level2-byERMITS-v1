/**
 * React Hook for Error Handling
 * Provides error handling utilities for React components
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { errorHandler, ErrorContext, ErrorHandlingOptions, ErrorResult } from '../utils/errorHandler';
import { logger } from '../utils/logger';

interface UseErrorHandlerOptions extends ErrorHandlingOptions {
  component?: string;
  onError?: (error: Error, context: ErrorContext) => void;
  onSuccess?: (data: any) => void;
}

interface ErrorState {
  hasError: boolean;
  error: Error | null;
  message: string | null;
  isRetrying: boolean;
  retryCount: number;
}

export const useErrorHandler = (options: UseErrorHandlerOptions = {}) => {
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: null,
    message: null,
    isRetrying: false,
    retryCount: 0
  });

  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      message: null,
      isRetrying: false,
      retryCount: 0
    });
  }, []);

  const handleError = useCallback((
    error: Error | unknown,
    context: ErrorContext = {},
    errorOptions: ErrorHandlingOptions = {}
  ): ErrorResult => {
    const result = errorHandler.handleError(error, {
      ...context,
      component: options.component || context.component
    }, {
      ...options,
      ...errorOptions
    });

    setErrorState(prev => ({
      ...prev,
      hasError: true,
      error: result.error || null,
      message: result.message || null,
      isRetrying: false,
      retryCount: 0
    }));

    if (options.onError && result.error) {
      options.onError(result.error, context);
    }

    return result;
  }, [options]);

  const executeWithErrorHandling = useCallback(async <T>(
    operation: () => Promise<T>,
    context: ErrorContext = {},
    errorOptions: ErrorHandlingOptions = {}
  ): Promise<ErrorResult<T>> => {
    setErrorState(prev => ({ ...prev, isRetrying: true }));

    const result = await errorHandler.executeWithErrorHandling(
      operation,
      {
        ...context,
        component: options.component || context.component
      },
      {
        ...options,
        ...errorOptions
      }
    );

    if (result.success) {
      setErrorState(prev => ({
        ...prev,
        hasError: false,
        error: null,
        message: null,
        isRetrying: false,
        retryCount: 0
      }));

      if (options.onSuccess) {
        options.onSuccess(result.data);
      }
    } else {
      setErrorState(prev => ({
        ...prev,
        hasError: true,
        error: result.error || null,
        message: result.message || null,
        isRetrying: false,
        retryCount: prev.retryCount + 1
      }));

      if (options.onError && result.error) {
        options.onError(result.error, context);
      }
    }

    return result;
  }, [options]);

  const retry = useCallback(async <T>(
    operation: () => Promise<T>,
    context: ErrorContext = {},
    errorOptions: ErrorHandlingOptions = {}
  ): Promise<ErrorResult<T>> => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }

    return new Promise((resolve) => {
      retryTimeoutRef.current = setTimeout(async () => {
        const result = await executeWithErrorHandling(operation, context, errorOptions);
        resolve(result);
      }, errorOptions.retryDelay || 1000);
    });
  }, [executeWithErrorHandling]);

  const handleApiError = useCallback((
    error: any,
    context: ErrorContext = {},
    errorOptions: ErrorHandlingOptions = {}
  ): ErrorResult => {
    return errorHandler.handleApiError(error, {
      ...context,
      component: options.component || context.component
    }, {
      ...options,
      ...errorOptions
    });
  }, [options]);

  const handleValidationError = useCallback((
    errors: Record<string, string[]> | string[],
    context: ErrorContext = {},
    errorOptions: ErrorHandlingOptions = {}
  ): ErrorResult => {
    return errorHandler.handleValidationError(errors, {
      ...context,
      component: options.component || context.component
    }, {
      ...options,
      ...errorOptions
    });
  }, [options]);

  const handleNetworkError = useCallback((
    error: any,
    context: ErrorContext = {},
    errorOptions: ErrorHandlingOptions = {}
  ): ErrorResult => {
    return errorHandler.handleNetworkError(error, {
      ...context,
      component: options.component || context.component
    }, {
      ...options,
      ...errorOptions
    });
  }, [options]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  return {
    // State
    ...errorState,
    
    // Actions
    handleError,
    executeWithErrorHandling,
    retry,
    clearError,
    
    // Specific error handlers
    handleApiError,
    handleValidationError,
    handleNetworkError,
    
    // Utilities
    isRetryable: errorState.error?.name !== 'ValidationError',
    canRetry: errorState.retryCount < (options.maxRetries || 3)
  };
};

// Hook for async operations with loading states
export const useAsyncOperation = <T>(
  operation: () => Promise<T>,
  options: UseErrorHandlerOptions = {}
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const errorHandler = useErrorHandler(options);

  const execute = useCallback(async (context: ErrorContext = {}) => {
    setIsLoading(true);
    
    const result = await errorHandler.executeWithErrorHandling(
      async () => {
        const result = await operation();
        setData(result);
        return result;
      },
      context
    );
    
    setIsLoading(false);
    return result;
  }, [operation, errorHandler]);

  return {
    ...errorHandler,
    isLoading,
    data,
    execute
  };
};

// Hook for form validation errors
export const useValidationErrors = () => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const errorHandler = useErrorHandler();

  const setError = useCallback((field: string, message: string) => {
    setValidationErrors(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), message]
    }));
  }, []);

  const setErrors = useCallback((errors: Record<string, string[]>) => {
    setValidationErrors(errors);
  }, []);

  const clearError = useCallback((field: string) => {
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setValidationErrors({});
  }, []);

  const hasErrors = Object.keys(validationErrors).length > 0;
  const getFieldError = (field: string) => validationErrors[field]?.[0];

  return {
    validationErrors,
    hasErrors,
    setError,
    setErrors,
    clearError,
    clearAllErrors,
    getFieldError,
    handleValidationError: errorHandler.handleValidationError
  };
};

export default useErrorHandler;