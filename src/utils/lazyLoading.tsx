import React, { Suspense, ComponentType } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { ErrorState } from '@/shared/components/ui/LoadingStates';
import { logger } from '@/utils/logger';

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
          <div className="flex items-center justify-center min-h-[400px]">
            <ErrorState 
              error={`The ${componentName} component could not be loaded. ${error instanceof Error ? error.message : 'Unknown error'}`}
              onRetry={() => window.location.reload()}
            />
          </div>
        )
      };
    }
  });

  // Create a wrapper component to ensure proper React context
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => {
    return (
      <ErrorBoundary>
        <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><LoadingSpinner size="lg" message="Loading..." /></div>}>
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