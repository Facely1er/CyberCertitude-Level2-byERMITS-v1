/**
 * Production-safe logger utility
 * Wraps console methods to prevent logs in production
 */

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

interface LogLevel {
  log: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  debug: (...args: any[]) => void;
}

class Logger implements LogLevel {
  private safeStringify(obj: any): string {
    try {
      if (obj === null) return 'null';
      if (obj === undefined) return 'undefined';
      if (typeof obj === 'string') return obj;
      if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);
      if (obj instanceof Error) return obj.message;
      if (obj instanceof Date) return obj.toISOString();
      if (Array.isArray(obj)) return JSON.stringify(obj);
      if (typeof obj === 'object') {
        // Handle circular references and complex objects
        const seen = new WeakSet();
        return JSON.stringify(obj, (key, value) => {
          if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
              return '[Circular Reference]';
            }
            seen.add(value);
          }
          return value;
        });
      }
      return String(obj);
    } catch (error) {
      return '[Object that could not be stringified]';
    }
  }

  private safeLog(level: string, args: any[]): void {
    try {
      const safeArgs = args.map(arg => {
        if (typeof arg === 'object' && arg !== null) {
          return this.safeStringify(arg);
        }
        return arg;
      });
      
      if (level === 'error') {
        console.error(`[${level.toUpperCase()}]`, ...safeArgs);
      } else {
        console.warn(`[${level.toUpperCase()}]`, ...safeArgs);
      }
    } catch (error) {
      // Fallback if even the safe logging fails
      console.error('[LOGGER ERROR]', 'Failed to log message safely');
    }
  }

  log(...args: any[]): void {
    if (isDevelopment) {
      this.safeLog('log', args);
    }
  }

  info(...args: any[]): void {
    if (isDevelopment) {
      this.safeLog('info', args);
    }
  }

  warn(...args: any[]): void {
    // Allow warnings in production for important issues
    this.safeLog('warn', args);
  }

  error(...args: any[]): void {
    // Always log errors, even in production
    this.safeLog('error', args);
  }

  debug(...args: any[]): void {
    if (isDevelopment) {
      this.safeLog('debug', args);
    }
  }

  // Production-safe group methods
  group(label?: string): void {
    if (isDevelopment && console.group) {
      console.group(label);
    }
  }

  groupEnd(): void {
    if (isDevelopment && console.groupEnd) {
      console.groupEnd();
    }
  }

  // Production-safe table method
  table(data: any): void {
    if (isDevelopment && console.table) {
      console.table(data);
    }
  }

  // Production-safe time methods
  time(label: string): void {
    if (isDevelopment && console.time) {
      console.time(label);
    }
  }

  timeEnd(label: string): void {
    if (isDevelopment && console.timeEnd) {
      console.timeEnd(label);
    }
  }
}

export const logger = new Logger();

// Export a function to force enable logging (useful for debugging production issues)
const enableProductionLogging = () => {
  if (isProduction) {
    (window as any).__FORCE_LOGGING__ = true;
    const safeLogger = new Logger();
    Object.assign(logger, {
      log: safeLogger.log.bind(safeLogger),
      info: safeLogger.info.bind(safeLogger),
      debug: safeLogger.debug.bind(safeLogger),
      warn: safeLogger.warn.bind(safeLogger),
      error: safeLogger.error.bind(safeLogger),
    });
  }
};