/**
 * Memory Leak Detection Utility
 * Helps identify and prevent memory leaks in React applications
 */

import { logger } from './logger';

interface MemorySnapshot {
  timestamp: number;
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  componentCount: number;
  eventListeners: number;
  timers: number;
}

interface LeakDetectionConfig {
  enabled: boolean;
  checkInterval: number;
  maxMemoryGrowth: number; // percentage
  maxComponentCount: number;
  maxEventListeners: number;
  maxTimers: number;
}

class MemoryLeakDetector {
  private static instance: MemoryLeakDetector;
  private config: LeakDetectionConfig;
  private snapshots: MemorySnapshot[] = [];
  private checkInterval: NodeJS.Timeout | null = null;
  private componentCount = 0;
  private eventListenerCount = 0;
  private timerCount = 0;
  private isMonitoring = false;

  constructor() {
    this.config = {
      enabled: import.meta.env.DEV,
      checkInterval: 30000, // 30 seconds
      maxMemoryGrowth: 50, // 50% growth
      maxComponentCount: 1000,
      maxEventListeners: 100,
      maxTimers: 50
    };
  }

  static getInstance(): MemoryLeakDetector {
    if (!MemoryLeakDetector.instance) {
      MemoryLeakDetector.instance = new MemoryLeakDetector();
    }
    return MemoryLeakDetector.instance;
  }

  startMonitoring(): void {
    if (!this.config.enabled || this.isMonitoring) {
      return;
    }

    this.isMonitoring = true;
    logger.info('Memory leak detection started');

    this.checkInterval = setInterval(() => {
      this.takeSnapshot();
      this.analyzeSnapshots();
    }, this.config.checkInterval);

    // Initial snapshot
    this.takeSnapshot();
  }

  stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.isMonitoring = false;
    logger.info('Memory leak detection stopped');
  }

  private takeSnapshot(): void {
    if (!('memory' in performance)) {
      return;
    }

    const memory = (performance as any).memory;
    const snapshot: MemorySnapshot = {
      timestamp: Date.now(),
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      componentCount: this.componentCount,
      eventListeners: this.eventListenerCount,
      timers: this.timerCount
    };

    this.snapshots.push(snapshot);

    // Keep only last 20 snapshots
    if (this.snapshots.length > 20) {
      this.snapshots = this.snapshots.slice(-20);
    }
  }

  private analyzeSnapshots(): void {
    if (this.snapshots.length < 2) {
      return;
    }

    const latest = this.snapshots[this.snapshots.length - 1];
    const previous = this.snapshots[this.snapshots.length - 2];

    // Check memory growth
    const memoryGrowth = ((latest.usedJSHeapSize - previous.usedJSHeapSize) / previous.usedJSHeapSize) * 100;
    if (memoryGrowth > this.config.maxMemoryGrowth) {
      this.reportLeak('Memory', `Memory usage increased by ${memoryGrowth.toFixed(2)}%`);
    }

    // Check component count
    if (latest.componentCount > this.config.maxComponentCount) {
      this.reportLeak('Components', `Component count exceeded limit: ${latest.componentCount}`);
    }

    // Check event listeners
    if (latest.eventListeners > this.config.maxEventListeners) {
      this.reportLeak('Event Listeners', `Event listener count exceeded limit: ${latest.eventListeners}`);
    }

    // Check timers
    if (latest.timers > this.config.maxTimers) {
      this.reportLeak('Timers', `Timer count exceeded limit: ${latest.timers}`);
    }

    // Check for continuous growth
    if (this.snapshots.length >= 5) {
      const recent = this.snapshots.slice(-5);
      const isGrowing = recent.every((snapshot, index) => 
        index === 0 || snapshot.usedJSHeapSize > recent[index - 1].usedJSHeapSize
      );

      if (isGrowing) {
        this.reportLeak('Continuous Growth', 'Memory usage is continuously growing');
      }
    }
  }

  private reportLeak(type: string, message: string): void {
    const latest = this.snapshots[this.snapshots.length - 1];
    
    logger.warn(`Memory Leak Detected - ${type}:`, {
      message,
      memory: {
        used: latest.usedJSHeapSize,
        total: latest.totalJSHeapSize,
        limit: latest.jsHeapSizeLimit
      },
      counts: {
        components: latest.componentCount,
        eventListeners: latest.eventListeners,
        timers: latest.timers
      }
    });

    // In production, you might want to send this to a monitoring service
    if (import.meta.env.PROD) {
      // Send to monitoring service
      this.sendToMonitoringService(type, message, latest);
    }
  }

  private sendToMonitoringService(type: string, message: string, snapshot: MemorySnapshot): void {
    // This would integrate with your monitoring service
    console.warn('Memory leak report:', { type, message, snapshot });
  }

  // Component tracking
  incrementComponentCount(): void {
    this.componentCount++;
  }

  decrementComponentCount(): void {
    this.componentCount = Math.max(0, this.componentCount - 1);
  }

  // Event listener tracking
  incrementEventListenerCount(): void {
    this.eventListenerCount++;
  }

  decrementEventListenerCount(): void {
    this.eventListenerCount = Math.max(0, this.eventListenerCount - 1);
  }

  // Timer tracking
  incrementTimerCount(): void {
    this.timerCount++;
  }

  decrementTimerCount(): void {
    this.timerCount = Math.max(0, this.timerCount - 1);
  }

  // Get current memory usage
  getCurrentMemoryUsage(): MemorySnapshot | null {
    if (!('memory' in performance)) {
      return null;
    }

    const memory = (performance as any).memory;
    return {
      timestamp: Date.now(),
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      componentCount: this.componentCount,
      eventListeners: this.eventListenerCount,
      timers: this.timerCount
    };
  }

  // Force garbage collection (if available)
  forceGarbageCollection(): void {
    if ('gc' in window) {
      (window as any).gc();
      logger.info('Forced garbage collection');
    } else {
      logger.warn('Garbage collection not available');
    }
  }

  // Get memory usage statistics
  getMemoryStats(): {
    current: MemorySnapshot | null;
    average: Partial<MemorySnapshot>;
    peak: Partial<MemorySnapshot>;
    growth: number;
  } {
    const current = this.getCurrentMemoryUsage();
    
    if (this.snapshots.length === 0) {
      return { current, average: {}, peak: {}, growth: 0 };
    }

    const first = this.snapshots[0];
    const latest = this.snapshots[this.snapshots.length - 1];
    const growth = ((latest.usedJSHeapSize - first.usedJSHeapSize) / first.usedJSHeapSize) * 100;

    const average = {
      usedJSHeapSize: this.snapshots.reduce((sum, s) => sum + s.usedJSHeapSize, 0) / this.snapshots.length,
      componentCount: this.snapshots.reduce((sum, s) => sum + s.componentCount, 0) / this.snapshots.length,
      eventListeners: this.snapshots.reduce((sum, s) => sum + s.eventListeners, 0) / this.snapshots.length,
      timers: this.snapshots.reduce((sum, s) => sum + s.timers, 0) / this.snapshots.length
    };

    const peak = {
      usedJSHeapSize: Math.max(...this.snapshots.map(s => s.usedJSHeapSize)),
      componentCount: Math.max(...this.snapshots.map(s => s.componentCount)),
      eventListeners: Math.max(...this.snapshots.map(s => s.eventListeners)),
      timers: Math.max(...this.snapshots.map(s => s.timers))
    };

    return { current, average, peak, growth };
  }

  // Update configuration
  updateConfig(newConfig: Partial<LeakDetectionConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Get configuration
  getConfig(): LeakDetectionConfig {
    return { ...this.config };
  }
}

// Export singleton instance
export const memoryLeakDetector = MemoryLeakDetector.getInstance();

// React hook for memory leak detection
export const useMemoryLeakDetection = () => {
  const startMonitoring = () => memoryLeakDetector.startMonitoring();
  const stopMonitoring = () => memoryLeakDetector.stopMonitoring();
  const getMemoryStats = () => memoryLeakDetector.getMemoryStats();
  const forceGC = () => memoryLeakDetector.forceGarbageCollection();

  return {
    startMonitoring,
    stopMonitoring,
    getMemoryStats,
    forceGC,
    isMonitoring: memoryLeakDetector['isMonitoring']
  };
};

export default memoryLeakDetector;