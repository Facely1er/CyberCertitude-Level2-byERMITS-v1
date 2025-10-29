import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useProductionMonitoring } from '../useProductionMonitoring';

vi.mock('../../lib/errorMonitoring', () => ({
  errorMonitoring: {
    captureMessage: vi.fn()
  }
}));

vi.mock('../../lib/performanceMonitoring', () => ({
  performanceMonitoring: {
    start: vi.fn(),
    stop: vi.fn()
  }
}));

vi.mock('../../config/environment', () => ({
  ENV: {
    isProduction: true
  }
}));

describe('useProductionMonitoring', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock performance API
    Object.defineProperty(global, 'performance', {
      value: {
        now: () => Date.now(),
        mark: vi.fn(),
        measure: vi.fn()
      },
      configurable: true
    });
    
    // Mock window.fetch
    global.fetch = vi.fn() as any;
  });

  it('should initialize with monitoring off in development', async () => {
    vi.mocked(require('../../config/environment').ENV.isProduction).mockValue(false);
    
    const { result } = renderHook(() => useProductionMonitoring());
    
    expect(result.current.isMonitoring).toBe(false);
  });

  it('should provide metrics', async () => {
    vi.mocked(require('../../config/environment').ENV.isProduction).mockValue(true);
    
    const { result } = renderHook(() => useProductionMonitoring());
    
    expect(result.current.metrics).toBeDefined();
    expect(result.current.metrics).toHaveProperty('uptime');
    expect(result.current.metrics).toHaveProperty('errorRate');
    expect(result.current.metrics).toHaveProperty('averageResponseTime');
  });

  it('should toggle monitoring', async () => {
    vi.mocked(require('../../config/environment').ENV.isProduction).mockValue(true);
    
    const { result } = renderHook(() => useProductionMonitoring());
    
    const initialMonitoring = result.current.isMonitoring;
    
    act(() => {
      result.current.toggleMonitoring();
    });
    
    expect(result.current.isMonitoring).toBe(!initialMonitoring);
  });

  it('should provide health status color', async () => {
    vi.mocked(require('../../config/environment').ENV.isProduction).mockValue(true);
    
    const { result } = renderHook(() => useProductionMonitoring());
    
    const color = result.current.getHealthStatusColor('healthy');
    expect(color).toContain('green');
    
    const degradedColor = result.current.getHealthStatusColor('degraded');
    expect(degradedColor).toContain('yellow');
    
    const unhealthyColor = result.current.getHealthStatusColor('unhealthy');
    expect(unhealthyColor).toContain('red');
  });

  it('should report health metrics', async () => {
    vi.mocked(require('../../config/environment').ENV.isProduction).mockValue(true);
    
    const { result } = renderHook(() => useProductionMonitoring());
    
    result.current.reportHealthMetrics();
    
    await waitFor(() => {
      expect(require('../../lib/errorMonitoring').errorMonitoring.captureMessage).toHaveBeenCalled();
    });
  });
});
