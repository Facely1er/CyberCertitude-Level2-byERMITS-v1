import React, { useEffect, useState } from 'react';
import { useAuth } from '../shared/hooks/useAuth';
import { isSupabaseReady } from '../lib/supabase';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * AuthGuard Component
 * 
 * Protects routes and components by ensuring user authentication.
 * In production, this will require proper Supabase authentication.
 * In development without Supabase, it will show a setup warning.
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  fallback 
}) => {
  const authState = useAuth();
  const [showSetupWarning, setShowSetupWarning] = useState(false);

  useEffect(() => {
    // In production, require proper authentication
    if (import.meta.env.PROD && !isSupabaseReady) {
      setShowSetupWarning(true);
    }
  }, []);
  
  // Safety check for auth state
  if (!authState) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-500 mx-auto mb-4"></div>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">Initializing authentication...</p>
        </div>
      </div>
    );
  }
  
  const { user, isLoading, isAuthenticated } = authState;

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-500 mx-auto mb-4"></div>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">Loading...</p>
        </div>
      </div>
    );
  }

  // Show setup warning in production if Supabase is not configured
  if (showSetupWarning) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-error-50 dark:bg-error-900/20">
        <div className="max-w-md mx-auto p-6 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg border border-error-200 dark:border-error-800">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-error-100 dark:bg-error-900/30 mb-4">
              <svg className="h-6 w-6 text-error-600 dark:text-error-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
              Authentication Setup Required
            </h3>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
              This application requires Supabase authentication to be configured for production use.
            </p>
            <div className="text-left bg-support-light dark:bg-support-dark p-3 rounded text-xs mb-4">
              <p className="font-medium mb-2 text-text-primary-light dark:text-text-primary-dark">Required environment variables:</p>
              <ul className="space-y-1 text-text-secondary-light dark:text-text-secondary-dark">
                <li>• VITE_SUPABASE_URL</li>
                <li>• VITE_SUPABASE_ANON_KEY</li>
              </ul>
            </div>
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
              See .env.example for configuration details.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show authentication required message
  if (!isAuthenticated) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md mx-auto p-6 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-4">
              <svg className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
              Authentication Required
            </h3>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
              Please sign in to access the CMMC compliance platform.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated, render children
  return <>{children}</>;
};

export default AuthGuard;