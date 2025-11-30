import { useState, useCallback, useRef } from 'react';

interface UseButtonInteractionOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  debounceMs?: number;
}

export const useButtonInteraction = (options: UseButtonInteractionOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { onSuccess, onError, debounceMs = 300 } = options;

  const execute = useCallback(async (action: () => Promise<void> | void) => {
    // Clear any existing debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Prevent rapid successive clicks
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await action();
      onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      // Add a small delay to prevent rapid successive clicks
      debounceTimeoutRef.current = setTimeout(() => {
        setIsLoading(false);
      }, debounceMs);
    }
  }, [isLoading, onSuccess, onError, debounceMs]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    execute,
    clearError,
    isDisabled: isLoading
  };
};