/**
 * ⚡ Performance Monitoring Service
 * Comprehensive performance tracking and optimization
 */

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  fmp: number; // First Meaningful Paint
  si: number; // Speed Index
  tti: number; // Time to Interactive
  bundleSize: number;
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
}

interface PerformanceThresholds {
  fcp: number;
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
  bundleSize: number;
  loadTime: number;
}

interface PerformanceReport {
  score: number;
  metrics: PerformanceMetrics;
  issues: PerformanceIssue[];
  recommendations: string[];
  timestamp: Date;
}

interface PerformanceIssue {
  id: string;
  type: 'critical' | 'warning' | 'info';
  metric: keyof PerformanceMetrics;
  value: number;
  threshold: number;
  impact: string;
  fix: string;
}

class PerformanceMonitoringService {
  private static instance: PerformanceMonitoringService;
  private metrics: PerformanceMetrics;
  private thresholds: PerformanceThresholds;
  private reports: PerformanceReport[] = [];
  private observers: PerformanceObserver[] = [];

  private constructor() {
    this.metrics = this.initializeMetrics();
    this.thresholds = this.initializeThresholds();
    this.initializeMonitoring();
  }

  public static getInstance(): PerformanceMonitoringService {
    if (!PerformanceMonitoringService.instance) {
      PerformanceMonitoringService.instance = new PerformanceMonitoringService();
    }
    return PerformanceMonitoringService.instance;
  }

  private initializeMetrics(): PerformanceMetrics {
    return {
      fcp: 0,
      lcp: 0,
      fid: 0,
      cls: 0,
      ttfb: 0,
      fmp: 0,
      si: 0,
      tti: 0,
      bundleSize: 0,
      loadTime: 0,
      renderTime: 0,
      memoryUsage: 0
    };
  }

  private initializeThresholds(): PerformanceThresholds {
    return {
      fcp: 1800, // 1.8s
      lcp: 2500, // 2.5s
      fid: 100, // 100ms
      cls: 0.1, // 0.1
      ttfb: 600, // 600ms
      bundleSize: 500000, // 500KB
      loadTime: 3000 // 3s
    };
  }

  private initializeMonitoring(): void {
    // Monitor Web Vitals
    this.setupWebVitalsMonitoring();
    
    // Monitor bundle size
    this.monitorBundleSize();
    
    // Monitor memory usage
    this.monitorMemoryUsage();
    
    // Monitor render performance
    this.monitorRenderPerformance();
    
    // Monitor network performance
    this.monitorNetworkPerformance();
    
    // Monitor user interactions
    this.monitorUserInteractions();
  }

  private setupWebVitalsMonitoring(): void {
    // First Contentful Paint
    if ('PerformanceObserver' in window) {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          this.metrics.fcp = fcpEntry.startTime;
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          this.metrics.lcp = lastEntry.startTime;
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.fid = entry.processingStart - entry.startTime;
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.metrics.cls = clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      this.observers.push(fcpObserver, lcpObserver, fidObserver, clsObserver);
    }
  }

  private monitorBundleSize(): void {
    // Estimate bundle size from loaded resources
    const resources = performance.getEntriesByType('resource');
    let totalSize = 0;
    
    resources.forEach((resource: any) => {
      if (resource.transferSize) {
        totalSize += resource.transferSize;
      }
    });
    
    this.metrics.bundleSize = totalSize;
  }

  private monitorMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
    }
  }

  private monitorRenderPerformance(): void {
    const startTime = performance.now();
    
    // Monitor component render times
    const originalCreateElement = React.createElement;
    React.createElement = function(...args: any[]) {
      const componentStart = performance.now();
      const result = originalCreateElement.apply(this, args);
      const componentEnd = performance.now();
      
      if (componentEnd - componentStart > 16) { // More than one frame
        console.warn(`Slow component render: ${args[0]?.name || 'Unknown'} took ${componentEnd - componentStart}ms`);
      }
      
      return result;
    };
    
    // Monitor overall render time
    requestAnimationFrame(() => {
      this.metrics.renderTime = performance.now() - startTime;
    });
  }

  private monitorNetworkPerformance(): void {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      this.metrics.ttfb = navigation.responseStart - navigation.requestStart;
      this.metrics.loadTime = navigation.loadEventEnd - navigation.navigationStart;
    }
  }

  private monitorUserInteractions(): void {
    let interactionCount = 0;
    let totalInteractionDelay = 0;
    
    ['click', 'keydown', 'touchstart'].forEach(eventType => {
      document.addEventListener(eventType, (e) => {
        const interactionStart = performance.now();
        
        requestAnimationFrame(() => {
          const interactionDelay = performance.now() - interactionStart;
          interactionCount++;
          totalInteractionDelay += interactionDelay;
          
          // Update FID metric
          this.metrics.fid = totalInteractionDelay / interactionCount;
        });
      }, { passive: true });
    });
  }

  public measureComponentPerformance<T extends React.ComponentType<any>>(
    Component: T,
    componentName: string
  ): T {
    return React.forwardRef<any, React.ComponentProps<T>>((props, ref) => {
      const startTime = performance.now();
      
      React.useEffect(() => {
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        
        if (renderTime > 16) { // More than one frame
          console.warn(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
        }
        
        // Track slow components
        if (renderTime > 100) {
          this.reportSlowComponent(componentName, renderTime);
        }
      });
      
      return React.createElement(Component, { ...props, ref });
    }) as T;
  }

  private reportSlowComponent(componentName: string, renderTime: number): void {
    console.warn(`Slow component detected: ${componentName} took ${renderTime.toFixed(2)}ms to render`);
    
    // Send to analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'slow_component', {
        component_name: componentName,
        render_time: renderTime
      });
    }
  }

  public generatePerformanceReport(): PerformanceReport {
    const issues: PerformanceIssue[] = [];
    
    // Check FCP
    if (this.metrics.fcp > this.thresholds.fcp) {
      issues.push({
        id: 'slow-fcp',
        type: 'critical',
        metric: 'fcp',
        value: this.metrics.fcp,
        threshold: this.thresholds.fcp,
        impact: 'Poor perceived performance',
        fix: 'Optimize critical rendering path, reduce render-blocking resources'
      });
    }
    
    // Check LCP
    if (this.metrics.lcp > this.thresholds.lcp) {
      issues.push({
        id: 'slow-lcp',
        type: 'critical',
        metric: 'lcp',
        value: this.metrics.lcp,
        threshold: this.thresholds.lcp,
        impact: 'Poor perceived loading performance',
        fix: 'Optimize largest content element, improve server response times'
      });
    }
    
    // Check FID
    if (this.metrics.fid > this.thresholds.fid) {
      issues.push({
        id: 'high-fid',
        type: 'warning',
        metric: 'fid',
        value: this.metrics.fid,
        threshold: this.thresholds.fid,
        impact: 'Poor interactivity',
        fix: 'Reduce JavaScript execution time, optimize event handlers'
      });
    }
    
    // Check CLS
    if (this.metrics.cls > this.thresholds.cls) {
      issues.push({
        id: 'high-cls',
        type: 'warning',
        metric: 'cls',
        value: this.metrics.cls,
        threshold: this.thresholds.cls,
        impact: 'Poor visual stability',
        fix: 'Reserve space for dynamic content, avoid layout shifts'
      });
    }
    
    // Check bundle size
    if (this.metrics.bundleSize > this.thresholds.bundleSize) {
      issues.push({
        id: 'large-bundle',
        type: 'warning',
        metric: 'bundleSize',
        value: this.metrics.bundleSize,
        threshold: this.thresholds.bundleSize,
        impact: 'Slow initial load',
        fix: 'Implement code splitting, remove unused code, optimize assets'
      });
    }
    
    // Calculate score
    const score = this.calculatePerformanceScore(issues);
    
    const report: PerformanceReport = {
      score,
      metrics: { ...this.metrics },
      issues,
      recommendations: this.generateRecommendations(issues),
      timestamp: new Date()
    };
    
    this.reports.push(report);
    return report;
  }

  private calculatePerformanceScore(issues: PerformanceIssue[]): number {
    let score = 100;
    
    issues.forEach(issue => {
      switch (issue.type) {
        case 'critical':
          score -= 20;
          break;
        case 'warning':
          score -= 10;
          break;
        case 'info':
          score -= 5;
          break;
      }
    });
    
    return Math.max(0, score);
  }

  private generateRecommendations(issues: PerformanceIssue[]): string[] {
    const recommendations: string[] = [];
    
    if (issues.some(i => i.id === 'slow-fcp')) {
      recommendations.push('Optimize critical rendering path');
    }
    
    if (issues.some(i => i.id === 'slow-lcp')) {
      recommendations.push('Optimize largest contentful paint');
    }
    
    if (issues.some(i => i.id === 'high-fid')) {
      recommendations.push('Reduce JavaScript execution time');
    }
    
    if (issues.some(i => i.id === 'high-cls')) {
      recommendations.push('Prevent layout shifts');
    }
    
    if (issues.some(i => i.id === 'large-bundle')) {
      recommendations.push('Implement code splitting');
    }
    
    return recommendations;
  }

  public getPerformanceScore(): number {
    const latestReport = this.reports[this.reports.length - 1];
    return latestReport ? latestReport.score : 100;
  }

  public optimizePerformance(): void {
    // Implement performance optimizations
    this.enableResourceHints();
    this.optimizeImages();
    this.enableServiceWorker();
    this.implementLazyLoading();
  }

  private enableResourceHints(): void {
    // Add preload hints for critical resources
    const criticalResources = [
      '/assets/index.css',
      '/assets/vendor-react-core.js',
      '/assets/index.js'
    ];
    
    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.css') ? 'style' : 'script';
      document.head.appendChild(link);
    });
  }

  private optimizeImages(): void {
    // Convert images to WebP format
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (img.src && !img.src.includes('.webp')) {
        const webpSrc = img.src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        img.src = webpSrc;
      }
    });
  }

  private enableServiceWorker(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  }

  private implementLazyLoading(): void {
    // Implement intersection observer for lazy loading
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }

  public cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

export const performanceMonitoringService = PerformanceMonitoringService.getInstance();
export type { PerformanceMetrics, PerformanceReport, PerformanceIssue };
