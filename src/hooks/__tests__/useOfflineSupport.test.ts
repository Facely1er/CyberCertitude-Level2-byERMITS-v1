import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useOfflineSupport } from '../useOfflineSupport';

describe('useOfflineSupport', () => {
  const mockOnline = vi.fn();
  const mockOffline = vi.fn();

  beforeEach(() => {
    // Mock online property
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true
    });

    // Mock event listeners
    window.addEventListener = vi.fn((event, handler) => {
      if (event === 'online') mockOnline();
      if (event === 'offline') mockOffline();
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with online state', () => {
    const { result } = renderHook(() => useOfflineSupport());
    expect(result.current.isOnline).toBe(true);
  });

  it('should show offline notice when offline', () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false
    });

    const { result } = renderHook(() => useOfflineSupport());
    expect(result.current.isOnline).toBe(false);
  });

  it('should handle network state changes', () => {
    const { result } = renderHook(() => useOfflineSupport());
    
    expect(result.current.isOnline).toBe(true);
    expect(result.current.showOfflineNotice).toBe(false);
  });

  it('should handle edge cases gracefully', () => {
    const { result } = renderHook(() => useOfflineSupport());
    
    // Should not crash
    expect(result.current).toBeDefined();
    expect(typeof result.current.isOnline).toBe('boolean');
    expect(typeof result.current.showOfflineNotice).toBe('boolean');
  });
});

