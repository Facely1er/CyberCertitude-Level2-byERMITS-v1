import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug, Mail, ExternalLink } from 'lucide-react';
import { errorMonitoring } from '../lib/errorMonitoring';
import { ENV } from '../config/environment';
import { logger } from '@/utils/logger';
import { navigation } from '@/utils/navigation';


interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showErrorDetails?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if this is a React hook error
    const isHookError = error.message.includes('Invalid hook call') || 
                       error.message.includes('Minified React error #306') ||
                       error.message.includes('Rules of Hooks');
    
    // Check if this is an illegal constructor error
    const isConstructorError = error.message.includes('Illegal constructor') ||
                              error.message.includes('TypeError: Illegal constructor');
    
    return { 
      hasError: true, 
      error,
      errorId: Date.now().toString()
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    logger.error('Error caught by boundary:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Send to error monitoring
    errorMonitoring.captureException(error, {
      extra: errorInfo,
      tags: { type: 'reactError', boundary: 'ErrorBoundary' },
      level: 'error'
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    navigation.goHome();
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReportError = () => {
    const errorReport = {
      error: {
        message: this.state.error?.message,
        stack: this.state.error?.stack,
        name: this.state.error?.name
      },
      context: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        errorId: this.state.errorId
      },
      componentStack: this.state.errorInfo?.componentStack
    };

    // Copy to clipboard for easy reporting
    navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2))
      .then(() => alert('Error details copied to clipboard'))
      .catch(() => {
        // Log error details only in development
        if (import.meta.env.DEV) {
          logger.log('Error details:', errorReport);
        }
      });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-4">
          <div className="max-w-lg w-full bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-error-100 dark:bg-error-900/30 rounded-full">
              <AlertTriangle className="w-8 h-8 text-error-600 dark:text-error-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
              Something went wrong
            </h1>
            
            {this.state.error && (
              this.state.error.message.includes('Invalid hook call') || 
              this.state.error.message.includes('Minified React error #306') ||
              this.state.error.message.includes('Rules of Hooks')
            ) ? (
              <div className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
                <p className="mb-4">
                  <strong>React Hook Error Detected</strong>
                </p>
                <p className="mb-4">
                  This error typically occurs when React hooks are called outside of a function component or when there are multiple React instances running.
                </p>
                <p className="mb-4">
                  <strong>Common solutions:</strong>
                </p>
                <ul className="text-sm text-left list-disc list-inside space-y-1 mb-4">
                  <li>Disable browser extensions (especially React DevTools, Loom, or other development tools)</li>
                  <li>Clear your browser cache and reload the page</li>
                  <li>Try opening the page in an incognito/private window</li>
                  <li>Check if you have multiple React versions installed</li>
                </ul>
              </div>
            ) : this.state.error && (
              this.state.error.message.includes('Illegal constructor') ||
              this.state.error.message.includes('TypeError: Illegal constructor')
            ) ? (
              <div className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
                <p className="mb-4">
                  <strong>Constructor Error Detected</strong>
                </p>
                <p className="mb-4">
                  This error typically occurs due to browser compatibility issues or conflicts with browser extensions.
                </p>
                <p className="mb-4">
                  <strong>Common solutions:</strong>
                </p>
                <ul className="text-sm text-left list-disc list-inside space-y-1 mb-4">
                  <li>Clear your browser cache and reload the page</li>
                  <li>Disable browser extensions temporarily</li>
                  <li>Try opening the page in an incognito/private window</li>
                  <li>Update your browser to the latest version</li>
                  <li>Try a different browser (Chrome, Firefox, Safari)</li>
                </ul>
              </div>
            ) : (
              <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
                We're sorry, but something unexpected happened. Our team has been notified and is working on a fix.
              </p>
            )}

            {this.props.showErrorDetails && ENV.isDevelopment && this.state.error && (
              <details className="mb-6 text-left bg-support-light dark:bg-surface-dark rounded-lg p-4">
                <summary className="cursor-pointer text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                  Error Details (Development Mode)
                </summary>
                <div className="text-xs font-mono text-text-primary-light dark:text-text-primary-light overflow-auto max-h-40 bg-background-light dark:bg-surface-dark p-3 rounded border">
                  <div className="mb-2">
                    <strong>Error ID:</strong> {this.state.errorId}
                  </div>
                  <div className="mb-2">
                    <strong>Message:</strong> {this.state.error.message}
                  </div>
                  <div className="mb-2">
                    <strong>Stack:</strong>
                    <pre className="whitespace-pre-wrap mt-1">{this.state.error.stack}</pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="whitespace-pre-wrap mt-1">{this.state.errorInfo.componentStack}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}
            
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={this.handleReload}
                  className="border border-support-light dark:border-support-dark text-text-primary-light dark:text-text-secondary-dark py-2 px-4 rounded-lg hover:bg-background-light dark:hover:bg-surface-dark transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reload</span>
                </button>
                
                <button
                  onClick={this.handleGoHome}
                  className="border border-support-light dark:border-support-dark text-text-primary-light dark:text-text-secondary-dark py-2 px-4 rounded-lg hover:bg-background-light dark:hover:bg-surface-dark transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </button>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={this.handleReportError}
                  className="flex-1 border border-support-light dark:border-support-dark text-text-primary-light dark:text-text-secondary-dark py-2 px-4 rounded-lg hover:bg-background-light dark:hover:bg-surface-dark transition-colors font-medium flex items-center justify-center space-x-2 text-sm"
                >
                  <Bug className="w-4 h-4" />
                  <span>Copy Error Details</span>
                </button>
                
                <a
                  href="mailto:support@ermits.com?subject=Application Error&body=Error ID: ${this.state.errorId}"
                  className="flex-1 border border-support-light dark:border-support-dark text-text-primary-light dark:text-text-secondary-dark py-2 px-4 rounded-lg hover:bg-background-light dark:hover:bg-surface-dark transition-colors font-medium flex items-center justify-center space-x-2 text-sm"
                >
                  <Mail className="w-4 h-4" />
                  <span>Report</span>
                </a>
              </div>
            </div>
            
            {this.state.errorId && (
              <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-6">
                Error ID: {this.state.errorId}
              </p>
            )}

            {ENV.isProduction && (
              <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                <p className="text-sm text-primary-800 dark:text-primary-200">
                  Our monitoring systems have been automatically notified. 
                  If this issue persists, please contact support with the Error ID above.
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for wrapping routes with error boundary
const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorFallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary 
      fallback={errorFallback}
      onError={onError}
      showErrorDetails={ENV.isDevelopment}
    >
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};