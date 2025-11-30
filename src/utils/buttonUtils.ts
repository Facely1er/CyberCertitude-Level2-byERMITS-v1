/**
 * Utility functions for handling button interactions and preventing common issues
 */

export const buttonUtils = {
  /**
   * Safely executes a button click handler with error handling
   */
  safeClick: async (
    handler: () => void | Promise<void>,
    onError?: (error: Error) => void
  ): Promise<void> => {
    try {
      await handler();
    } catch (error) {
      console.error('Button click error:', error);
      onError?.(error instanceof Error ? error : new Error('Unknown error'));
    }
  },

  /**
   * Prevents double-clicking by debouncing the handler
   */
  debounceClick: (
    handler: () => void,
    delay: number = 300
  ): (() => void) => {
    let timeoutId: NodeJS.Timeout | null = null;
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        handler();
        timeoutId = null;
      }, delay);
    };
  },

  /**
   * Creates a loading state handler for async operations
   */
  createLoadingHandler: (
    asyncHandler: () => Promise<void>,
    setLoading: (loading: boolean) => void,
    onError?: (error: Error) => void
  ) => {
    return async () => {
      setLoading(true);
      try {
        await asyncHandler();
      } catch (error) {
        console.error('Async button handler error:', error);
        onError?.(error instanceof Error ? error : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };
  },

  /**
   * Validates that a button click is valid (not disabled, not loading)
   */
  isValidClick: (isDisabled: boolean, isLoading: boolean): boolean => {
    return !isDisabled && !isLoading;
  },

  /**
   * Gets appropriate ARIA attributes for buttons
   */
  getAriaAttributes: (options: {
    isLoading?: boolean;
    isDisabled?: boolean;
    ariaLabel?: string;
    ariaDescribedBy?: string;
  }) => {
    const { isLoading, isDisabled, ariaLabel, ariaDescribedBy } = options;
    
    return {
      'aria-disabled': isDisabled || isLoading,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      ...(isLoading && { 'aria-busy': 'true' })
    };
  }
};