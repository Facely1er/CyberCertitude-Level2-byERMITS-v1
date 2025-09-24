/**
 * Performance Monitoring Service
 * Tracks Core Web Vitals, errors, and performance metrics
 */

import { logger } from '../utils/logger';

interface PerformanceMetric {
  name: string;
  value: number;
  delta: number;
  id: string;
  navigationType: string;
  timestamp: number;
}

interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  line?: number;
  column?: number;
  timestamp: number;
  userAgent: string;
  userId?: string;
}

interface PerformanceReport {
  metrics: PerformanceMetric[];
  errors: ErrorReport[];
  sessionId: string;
  timestamp: number;
  url: string;
  userAgent: string;
}

class PerformanceMonitoringService {
  private sessionId: string;
  private metrics: PerformanceMetric[] = [];
  private errors: ErrorReport[] = [];
  private isEnabled: boolean;
  private reportEndpoint: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.isEnabled = this.shouldEnableMonitoring();
    this.reportEndpoint = this.getReportEndpoint();
    
    if (this.isEnabled) {
      this.initializeMonitoring();
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private shouldEnableMonitoring(): boolean {
    // Enable in production or when explicitly enabled
    return import.meta.env.PROD || 
           import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true';
  }

  private getReportEndpoint(): string {
    return import.meta.env.VITE_PERFORMANCE_ENDPOINT || '/api/performance';
  }

  private initializeMonitoring(): void {
    this.setupCoreWebVitals();
    this.setupErrorTracking();
    this.setupPerformanceObserver();
    this.setupResourceTiming();
    this.setupNavigationTiming();
    
    // Report data periodically
    this.setupPeriodicReporting();
    
    logger.info('Performance monitoring initialized', { sessionId: this.sessionId });
  }

  private setupCoreWebVitals(): void {
    // LCP - Largest Contentful Paint
    this.observeLCP();
    
    // FID - First Input Delay
    this.observeFID();
    
    // CLS - Cumulative Layout Shift
    this.observeCLS();
    
    // FCP - First Contentful Paint
    this.observeFCP();
    
    // TTFB - Time to First Byte
    this.observeTTFB();
  }

  private observeLCP(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & { value: number };
        
        this.recordMetric({
          name: 'LCP',
          value: lastEntry.value,
          delta: lastEntry.value,
          id: lastEntry.name,
          navigationType: 'navigation',
          timestamp: Date.now()
        });
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  private observeFID(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const fidEntry = entry as PerformanceEventTiming;
          this.recordMetric({
            name: 'FID',
            value: fidEntry.processingStart - fidEntry.startTime,
            delta: fidEntry.processingStart - fidEntry.startTime,
            id: fidEntry.name,
            navigationType: 'navigation',
            timestamp: Date.now()
          });
        });
      });
      
      observer.observe({ entryTypes: ['first-input'] });
    }
  }

  private observeCLS(): void {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        });
        
        this.recordMetric({
          name: 'CLS',
          value: clsValue,
          delta: clsValue,
          id: 'cls',
          navigationType: 'navigation',
          timestamp: Date.now()
        });
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }

  private observeFCP(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.recordMetric({
            name: 'FCP',
            value: entry.startTime,
            delta: entry.startTime,
            id: entry.name,
            navigationType: 'navigation',
            timestamp: Date.now()
          });
        });
      });
      
      observer.observe({ entryTypes: ['paint'] });
    }
  }

  private observeTTFB(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.recordMetric({
              name: 'TTFB',
              value: navEntry.responseStart - navEntry.requestStart,
              delta: navEntry.responseStart - navEntry.requestStart,
              id: 'ttfb',
              navigationType: 'navigation',
              timestamp: Date.now()
            });
          }
        });
      });
      
      observer.observe({ entryTypes: ['navigation'] });
    }
  }

  private setupErrorTracking(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.recordError({
        message: event.message,
        stack: event.error?.stack,
        url: event.filename,
        line: event.lineno,
        column: event.colno,
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.recordError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        url: window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      });
    });

    // React error boundary integration
    window.addEventListener('react-error', (event: CustomEvent) => {
      this.recordError({
        message: event.detail.message,
        stack: event.detail.stack,
        url: window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      });
    });
  }

  private setupPerformanceObserver(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          // Track long tasks
          if (entry.entryType === 'longtask') {
            this.recordMetric({
              name: 'Long Task',
              value: entry.duration,
              delta: entry.duration,
              id: entry.name,
              navigationType: 'navigation',
              timestamp: Date.now()
            });
          }
        });
      });
      
      observer.observe({ entryTypes: ['longtask'] });
    }
  }

  private setupResourceTiming(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const resourceEntry = entry as PerformanceResourceTiming;
          
          // Track slow resources
          if (resourceEntry.duration > 1000) { // > 1 second
            this.recordMetric({
              name: 'Slow Resource',
              value: resourceEntry.duration,
              delta: resourceEntry.duration,
              id: resourceEntry.name,
              navigationType: 'navigation',
              timestamp: Date.now()
            });
          }
        });
      });
      
      observer.observe({ entryTypes: ['resource'] });
    }
  }

  private setupNavigationTiming(): void {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        // DOM Content Loaded
        this.recordMetric({
          name: 'DOM Content Loaded',
          value: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          delta: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          id: 'dom-content-loaded',
          navigationType: 'navigation',
          timestamp: Date.now()
        });

        // Page Load
        this.recordMetric({
          name: 'Page Load',
          value: navigation.loadEventEnd - navigation.loadEventStart,
          delta: navigation.loadEventEnd - navigation.loadEventStart,
          id: 'page-load',
          navigationType: 'navigation',
          timestamp: Date.now()
        });
      }
    });
  }

  private setupPeriodicReporting(): void {
    // Report every 30 seconds
    setInterval(() => {
      this.reportData();
    }, 30000);

    // Report on page unload
    window.addEventListener('beforeunload', () => {
      this.reportData(true);
    });
  }

  private recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);
    logger.debug('Performance metric recorded', metric);
  }

  private recordError(error: ErrorReport): void {
    this.errors.push(error);
    logger.error('Error recorded', error);
  }

  private async reportData(isSync = false): Promise<void> {
    if (this.metrics.length === 0 && this.errors.length === 0) {
      return;
    }

    const report: PerformanceReport = {
      metrics: [...this.metrics],
      errors: [...this.errors],
      sessionId: this.sessionId,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Clear local data
    this.metrics = [];
    this.errors = [];

    try {
      if (isSync) {
        // Use sendBeacon for synchronous reporting
        if ('sendBeacon' in navigator) {
          navigator.sendBeacon(
            this.reportEndpoint,
            JSON.stringify(report)
          );
        }
      } else {
        // Use fetch for asynchronous reporting
        await fetch(this.reportEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(report)
        });
      }
      
      logger.debug('Performance data reported', { 
        metricsCount: report.metrics.length,
        errorsCount: report.errors.length 
      });
    } catch (error) {
      logger.error('Failed to report performance data', error);
    }
  }

  // Public API
  public recordCustomMetric(name: string, value: number, id?: string): void {
    this.recordMetric({
      name,
      value,
      delta: value,
      id: id || name,
      navigationType: 'navigation',
      timestamp: Date.now()
    });
  }

  public recordCustomError(message: string, error?: Error): void {
    this.recordError({
      message,
      stack: error?.stack,
      url: window.location.href,
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    });
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public isMonitoringEnabled(): boolean {
    return this.isEnabled;
  }
}

// Export singleton instance
export const performanceMonitoring = new PerformanceMonitoringService();
export default performanceMonitoring;