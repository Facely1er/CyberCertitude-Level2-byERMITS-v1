import { ENV } from '../config/environment';
import { logger } from '@/utils/logger';

interface ErrorContext {
  tags?: Record<string, string>;
  extra?: Record<string, any>;
  level?: 'error' | 'warning' | 'info' | 'debug';
}

class ErrorMonitoring {
  private isInitialized = false;
  private sentryInstance: any = null;

  constructor() {
    this.initializeSentry();
  }

  private async initializeSentry() {
    const sentryDsn = ENV.SENTRY_DSN || 'https://722dc05ba75fe578e5ea83522b4314b2@o4510171368259585.ingest.us.sentry.io/4510260330627072';
    
    if (typeof window !== "undefined") {
      try {
        const Sentry = await import("@sentry/react");
        
        Sentry.init({
          dsn: sentryDsn,
          environment: ENV.NODE_ENV,
          integrations: [
            new Sentry.BrowserTracing({
              // Set sampling rate for performance monitoring
              tracesSampleRate: ENV.NODE_ENV === 'production' ? 0.1 : 1.0,
            }),
            new Sentry.Replay({
              maskAllText: true,
              blockAllMedia: true,
            }),
          ],
          beforeSend(event, hint) {
            // Filter out noisy errors
            if (event.exception) {
              const error = event.exception.values?.[0];
              if (error?.value?.includes('ChunkLoadError') || 
                  error?.value?.includes('Loading chunk')) {
                return null;
              }
            }
            return event;
          },
          // Capture 100% of the transactions for performance monitoring
          tracesSampleRate: ENV.NODE_ENV === 'production' ? 0.1 : 1.0,
          // Session Replay sampling
          replaysSessionSampleRate: ENV.NODE_ENV === 'production' ? 0.1 : 1.0,
          replaysOnErrorSampleRate: 1.0, // Capture 100% of sessions with an error
        });

        this.sentryInstance = Sentry;
        this.isInitialized = true;
        console.log('Sentry initialized successfully');
      } catch (error) {
        logger.warn('Failed to initialize Sentry:', { error });
      }
    }
  }

  captureException(error: Error, context?: ErrorContext) {
    // Log for development
    logger.error('Error captured', { error, context });

    if (this.isInitialized && this.sentryInstance) {
      try {
        this.sentryInstance.withScope((scope: any) => {
          if (context?.tags) {
            Object.entries(context.tags).forEach(([key, value]) => {
              scope.setTag(key, value);
            });
          }

          if (context?.extra) {
            Object.entries(context.extra).forEach(([key, value]) => {
              scope.setExtra(key, value);
            });
          }

          if (context?.level) {
            scope.setLevel(context.level);
          }

          this.sentryInstance.captureException(error);
        });
      } catch (sentryError) {
        logger.warn('Failed to send error to Sentry', { error: sentryError });
      }
    }
  }

  captureMessage(message: string, level: 'error' | 'warning' | 'info' | 'debug' = 'info', context?: ErrorContext) {
    logger.log(`[${level.toUpperCase()}] ${message}`, context);

    if (this.isInitialized && this.sentryInstance) {
      try {
        this.sentryInstance.withScope((scope: any) => {
          if (context?.tags) {
            Object.entries(context.tags).forEach(([key, value]) => {
              scope.setTag(key, value);
            });
          }

          if (context?.extra) {
            Object.entries(context.extra).forEach(([key, value]) => {
              scope.setExtra(key, value);
            });
          }

          scope.setLevel(level);
          this.sentryInstance.captureMessage(message);
        });
      } catch (sentryError) {
        logger.warn('Failed to send message to Sentry', { error: sentryError });
      }
    }
  }

  addBreadcrumb(message: string, category?: string, data?: Record<string, any>) {
    if (this.isInitialized && this.sentryInstance) {
      try {
        this.sentryInstance.addBreadcrumb({
          message,
          category: category || 'custom',
          data,
          level: 'info'
        });
      } catch (error) {
        logger.warn('Failed to add breadcrumb', { error });
      }
    }
  }

  setUser(user: { id?: string; email?: string; [key: string]: any }) {
    if (this.isInitialized && this.sentryInstance) {
      try {
        this.sentryInstance.setUser(user);
      } catch (error) {
        logger.warn('Failed to set user context', { error });
      }
    }
  }

  setContext(key: string, context: Record<string, any>) {
    if (this.isInitialized && this.sentryInstance) {
      try {
        this.sentryInstance.setContext(key, context);
      } catch (error) {
        logger.warn('Failed to set context', { error });
      }
    }
  }
}

export const errorMonitoring = new ErrorMonitoring();
