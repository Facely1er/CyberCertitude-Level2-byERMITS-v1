import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { performanceMonitoringService } from '../performanceMonitoringService';

// Mock React
vi.mock('react', () => ({
  default: {
    createElement: vi.fn((...args) => args),
    useEffect: vi.fn((fn) => fn()),
    forwardRef: vi.fn((fn) => fn)
  }
}));

// Mock window APIs
const mockPerformanceObserver = vi.fn();
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

beforeEach(() => {
  global.window = {
    ...global.window,
    PerformanceObserver: mockPerformanceObserver,
    performance: {
      now: vi.fn(() => Date.now()),
      getEntriesByType: vi.fn(() => []),
      memory: {
        usedJSHeapSize: 10 * 1024 * 1024 // 10MB
      }
    } as any,
    crypto: {
      subtle: {}
    },
    navigator: {
      serviceWorker: {
        register: vi.fn()
      }
    } as any,
    gtag: vi.fn()
  } as any;

  mockPerformanceObserver.mockImplementation((callback: any) => ({
    observe: mockObserve,
    disconnect: mockDisconnect
  }));
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('PerformanceMonitoringService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = performanceMonitoringService;
      const instance2 = performanceMonitoringService;
      expect(instance1).toBe(instance2);
    });
  });

  describe('generatePerformanceReport', () => {
    it('should generate a performance report', () => {
      const report = performanceMonitoringService.generatePerformanceReport();

      expect(report).toBeDefined();
      expect(report.score).toBeGreaterThanOrEqual(0);
      expect(report.score).toBeLessThanOrEqual(100);
      expect(report.metrics).toBeDefined();
      expect(report.issues).toBeInstanceOf(Array);
      expect(report.recommendations).toBeInstanceOf(Array);
      expect(report.timestamp).toBeInstanceOf(Date);
    });

    it('should include all performance metrics', () => {
      const report = performanceMonitoringService.generatePerformanceReport();

      expect(report.metrics.fcp).toBeDefined();
      expect(report.metrics.lcp).toBeDefined();
      expect(report.metrics.fid).toBeDefined();
      expect(report.metrics.cls).toBeDefined();
      expect(report.metrics.ttfb).toBeDefined();
      expect(report.metrics.bundleSize).toBeDefined();
      expect(report.metrics.loadTime).toBeDefined();
    });

    it('should identify performance issues', () => {
      // Mock metrics that exceed thresholds
      const service = performanceMonitoringService as any;
      service.metrics = {
        fcp: 3000, // Exceeds 1800ms threshold
        lcp: 4000, // Exceeds 2500ms threshold
        fid: 150, // Exceeds 100ms threshold
        cls: 0.2, // Exceeds 0.1 threshold
        ttfb: 800, // Exceeds 600ms threshold
        bundleSize: 600000, // Exceeds 500KB threshold
        loadTime: 5000 // Exceeds 3000ms threshold
      };

      const report = service.generatePerformanceReport();

      expect(report.issues.length).toBeGreaterThan(0);
      report.issues.forEach(issue => {
        expect(issue.id).toBeDefined();
        expect(issue.type).toBeDefined();
        expect(issue.metric).toBeDefined();
        expect(issue.value).toBeDefined();
        expect(issue.threshold).toBeDefined();
        expect(issue.impact).toBeDefined();
        expect(issue.fix).toBeDefined();
      });
    });

    it('should calculate score based on issues', () => {
      const service = performanceMonitoringService as any;
      
      // Test with no issues
      service.metrics = {
        fcp: 1000,
        lcp: 2000,
        fid: 50,
        cls: 0.05,
        ttfb: 400,
        bundleSize: 300000,
        loadTime: 2000
      };

      let report = service.generatePerformanceReport();
      expect(report.score).toBeGreaterThanOrEqual(80);

      // Test with critical issues
      service.metrics = {
        fcp: 3000,
        lcp: 4000,
        fid: 200,
        cls: 0.3,
        ttfb: 1000,
        bundleSize: 1000000,
        loadTime: 6000
      };

      report = service.generatePerformanceReport();
      expect(report.score).toBeLessThan(50);
    });

    it('should generate recommendations based on issues', () => {
      const service = performanceMonitoringService as any;
      service.metrics = {
        fcp: 3000,
        lcp: 4000,
        fid: 150,
        cls: 0.2,
        ttfb: 800,
        bundleSize: 600000,
        loadTime: 5000
      };

      const report = service.generatePerformanceReport();

      expect(report.recommendations.length).toBeGreaterThan(0);
      expect(report.recommendations).toEqual(
        expect.arrayContaining([
          expect.stringContaining('optimize'),
          expect.stringContaining('reduce')
        ])
      );
    });
  });

  describe('getPerformanceScore', () => {
    it('should return performance score', () => {
      const score = performanceMonitoringService.getPerformanceScore();

      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should return 100 if no reports generated', () => {
      const service = performanceMonitoringService as any;
      service.reports = [];

      const score = service.getPerformanceScore();
      expect(score).toBe(100);
    });
  });

  describe('optimizePerformance', () => {
    it('should optimize performance', () => {
      expect(() => {
        performanceMonitoringService.optimizePerformance();
      }).not.toThrow();
    });

    it('should enable resource hints', () => {
      const documentHead = document.createElement('div');
      document.head.appendChild = vi.fn();

      performanceMonitoringService.optimizePerformance();

      // Should attempt to create preload links
      expect(document.head.appendChild).toHaveBeenCalled();
    });
  });

  describe('measureComponentPerformance', () => {
    it('should wrap component with performance measurement', () => {
      const MockComponent = vi.fn(() => null);
      const service = performanceMonitoringService as any;

      const WrappedComponent = service.measureComponentPerformance(
        MockComponent,
        'TestComponent'
      );

      expect(WrappedComponent).toBeDefined();
    });
  });

  describe('cleanup', () => {
    it('should cleanup observers', () => {
      const service = performanceMonitoringService as any;
      service.observers = [
        { disconnect: mockDisconnect },
        { disconnect: mockDisconnect }
      ];

      performanceMonitoringService.cleanup();

      expect(mockDisconnect).toHaveBeenCalled();
      expect(service.observers).toHaveLength(0);
    });
  });

  describe('threshold validation', () => {
    it('should have appropriate thresholds', () => {
      const service = performanceMonitoringService as any;
      const thresholds = service.thresholds;

      expect(thresholds.fcp).toBe(1800);
      expect(thresholds.lcp).toBe(2500);
      expect(thresholds.fid).toBe(100);
      expect(thresholds.cls).toBe(0.1);
      expect(thresholds.ttfb).toBe(600);
      expect(thresholds.bundleSize).toBe(500000);
      expect(thresholds.loadTime).toBe(3000);
    });
  });
});

