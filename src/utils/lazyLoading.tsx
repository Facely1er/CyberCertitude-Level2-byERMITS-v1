import React, { Suspense, ComponentType } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { logger } from '@/utils/logger';


// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-gray-600 dark:text-gray-300">Loading...</span>
  </div>
);

// Enhanced lazy loading with error boundary
const lazyWithErrorBoundary = <P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallback?: React.ComponentType
) => {
  const LazyComponent = React.lazy(importFunc);
  
  return React.forwardRef<any, P>((props, ref) => (
    <ErrorBoundary>
      <Suspense fallback={fallback ? <fallback /> : <LoadingSpinner />}>
        <LazyComponent {...props} ref={ref} />
      </Suspense>
    </ErrorBoundary>
  ));
};

// Preload utility for critical components
const preloadComponent = (importFunc: () => Promise<any>) => {
  // Start loading the component in the background
  importFunc().catch(() => {
    // Ignore errors during preload
  });
};

// Route-based lazy loading with better error handling
export const createLazyRoute = <P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  componentName: string
) => {
  const LazyComponent = React.lazy(async () => {
    try {
      const module = await importFunc();
      // Ensure the component is properly exported
      if (!module.default) {
        throw new Error(`Component ${componentName} does not have a default export`);
      }
      return module;
    } catch (error) {
      logger.error(`Failed to load ${componentName}:`, error);
      // Return a fallback component
      return {
        default: () => (
          <div className="flex items-center justify-center min-h-[400px] text-center">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                Failed to Load Component
              </h3>
              <p className="text-red-600 dark:text-red-300 mb-4">
                The {componentName} component could not be loaded.
              </p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reload Page
              </button>
            </div>
          </div>
        )
      };
    }
  });

  // Create a wrapper component to ensure proper React context
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => {
    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <LazyComponent {...props} ref={ref} />
        </Suspense>
      </ErrorBoundary>
    );
  });

  // Set display name for better debugging
  WrappedComponent.displayName = `LazyRoute(${componentName})`;
  
  return WrappedComponent;
};

// Performance monitoring for lazy components
const withLoadTimeTracking = <P extends object>(
  Component: ComponentType<P>,
  componentName: string
) => {
  return React.forwardRef<any, P>((props, ref) => {
    React.useEffect(() => {
      const startTime = performance.now();
      
      return () => {
        const loadTime = performance.now() - startTime;
        if (loadTime > 100) { // Only log if component took more than 100ms
          logger.warn(`${componentName} took ${loadTime.toFixed(2)}ms to render`);
        }
      };
    }, []);

    return <Component {...props} ref={ref} />;
  });
};