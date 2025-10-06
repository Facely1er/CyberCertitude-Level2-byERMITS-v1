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
    if (ENV.SENTRY_DSN && typeof window !== "undefined") {
      try {
        const Sentry = await import("@sentry/react");
        
        Sentry.init({
          dsn: ENV.SENTRY_DSN,
          environment: ENV.NODE_ENV,
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
          tracesSampleRate: ENV.NODE_ENV === 'production' ? 0.1 : 1.0,
        });

        this.sentryInstance = Sentry;
        this.isInitialized = true;
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
