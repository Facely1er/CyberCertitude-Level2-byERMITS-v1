/**
 * Memory Tracking Hook
 * Automatically tracks component lifecycle and prevents memory leaks
 */

import { useEffect, useRef, useCallback } from 'react';
import { memoryLeakDetector } from '../utils/memoryLeakDetector';

interface UseMemoryTrackingOptions {
  componentName?: string;
  trackEventListeners?: boolean;
  trackTimers?: boolean;
  trackIntervals?: boolean;
}

export const useMemoryTracking = (options: UseMemoryTrackingOptions = {}) => {
  const {
    componentName = 'Unknown',
    trackEventListeners = true,
    trackTimers = true,
    trackIntervals = true
  } = options;

  const eventListenersRef = useRef<Array<{ element: EventTarget; event: string; handler: EventListener }>>([]);
  const timersRef = useRef<Array<NodeJS.Timeout>>([]);
  const intervalsRef = useRef<Array<NodeJS.Timeout>>([]);
  const isMountedRef = useRef(true);

  // Track component mount
  useEffect(() => {
    memoryLeakDetector.incrementComponentCount();
    isMountedRef.current = true;

    return () => {
      memoryLeakDetector.decrementComponentCount();
      isMountedRef.current = false;
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up event listeners
      eventListenersRef.current.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
        memoryLeakDetector.decrementEventListenerCount();
      });
      eventListenersRef.current = [];

      // Clean up timers
      timersRef.current.forEach(timer => {
        clearTimeout(timer);
        memoryLeakDetector.decrementTimerCount();
      });
      timersRef.current = [];

      // Clean up intervals
      intervalsRef.current.forEach(interval => {
        clearInterval(interval);
        memoryLeakDetector.decrementTimerCount();
      });
      intervalsRef.current = [];
    };
  }, []);

  // Safe event listener adder
  const addEventListener = useCallback((
    element: EventTarget,
    event: string,
    handler: EventListener,
    options?: AddEventListenerOptions
  ) => {
    if (!isMountedRef.current) return;

    element.addEventListener(event, handler, options);
    eventListenersRef.current.push({ element, event, handler });
    
    if (trackEventListeners) {
      memoryLeakDetector.incrementEventListenerCount();
    }
  }, [trackEventListeners]);

  // Safe event listener remover
  const removeEventListener = useCallback((
    element: EventTarget,
    event: string,
    handler: EventListener
  ) => {
    element.removeEventListener(event, handler);
    
    const index = eventListenersRef.current.findIndex(
      listener => listener.element === element && listener.event === event && listener.handler === handler
    );
    
    if (index !== -1) {
      eventListenersRef.current.splice(index, 1);
      
      if (trackEventListeners) {
        memoryLeakDetector.decrementEventListenerCount();
      }
    }
  }, [trackEventListeners]);

  // Safe setTimeout
  const safeSetTimeout = useCallback((callback: () => void, delay: number) => {
    if (!isMountedRef.current) return;

    const timer = setTimeout(() => {
      if (isMountedRef.current) {
        callback();
      }
      
      // Remove from tracking
      const index = timersRef.current.indexOf(timer);
      if (index !== -1) {
        timersRef.current.splice(index, 1);
        if (trackTimers) {
          memoryLeakDetector.decrementTimerCount();
        }
      }
    }, delay);

    timersRef.current.push(timer);
    
    if (trackTimers) {
      memoryLeakDetector.incrementTimerCount();
    }

    return timer;
  }, [trackTimers]);

  // Safe setInterval
  const safeSetInterval = useCallback((callback: () => void, delay: number) => {
    if (!isMountedRef.current) return;

    const interval = setInterval(() => {
      if (isMountedRef.current) {
        callback();
      }
    }, delay);

    intervalsRef.current.push(interval);
    
    if (trackIntervals) {
      memoryLeakDetector.incrementTimerCount();
    }

    return interval;
  }, [trackIntervals]);

  // Safe clearTimeout
  const safeClearTimeout = useCallback((timer: NodeJS.Timeout) => {
    clearTimeout(timer);
    
    const index = timersRef.current.indexOf(timer);
    if (index !== -1) {
      timersRef.current.splice(index, 1);
      if (trackTimers) {
        memoryLeakDetector.decrementTimerCount();
      }
    }
  }, [trackTimers]);

  // Safe clearInterval
  const safeClearInterval = useCallback((interval: NodeJS.Timeout) => {
    clearInterval(interval);
    
    const index = intervalsRef.current.indexOf(interval);
    if (index !== -1) {
      intervalsRef.current.splice(index, 1);
      if (trackIntervals) {
        memoryLeakDetector.decrementTimerCount();
      }
    }
  }, [trackIntervals]);

  // Check if component is still mounted
  const isMounted = useCallback(() => isMountedRef.current, []);

  // Get current tracking stats
  const getTrackingStats = useCallback(() => ({
    eventListeners: eventListenersRef.current.length,
    timers: timersRef.current.length,
    intervals: intervalsRef.current.length,
    isMounted: isMountedRef.current
  }), []);

  return {
    // Event listeners
    addEventListener,
    removeEventListener,
    
    // Timers
    safeSetTimeout,
    safeSetInterval,
    safeClearTimeout,
    safeClearInterval,
    
    // Utilities
    isMounted,
    getTrackingStats
  };
};

// Hook for automatic cleanup of async operations
export const useAsyncCleanup = () => {
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const createAbortController = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    return abortControllerRef.current;
  }, []);

  const isMounted = useCallback(() => isMountedRef.current, []);

  const safeAsync = useCallback(async <T>(
    asyncOperation: (signal: AbortSignal) => Promise<T>
  ): Promise<T | null> => {
    if (!isMountedRef.current) return null;

    const controller = createAbortController();
    
    try {
      const result = await asyncOperation(controller.signal);
      return isMountedRef.current ? result : null;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return null;
      }
      throw error;
    }
  }, [createAbortController]);

  return {
    createAbortController,
    isMounted,
    safeAsync
  };
};

export default useMemoryTracking;