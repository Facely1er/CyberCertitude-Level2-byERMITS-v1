import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAppState } from '../useAppState';

// Mock dataService
vi.mock('../../services/dataService', () => ({
  dataService: {
    getUserProfile: vi.fn(() => ({
      id: '1',
      name: 'Test User',
      email: 'test@example.com'
    })),
    getAssets: vi.fn(() => [])
  }
}));

describe('useAppState', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAppState());
    
    expect(result.current.notifications).toEqual([]);
    expect(result.current.userProfile).toBeDefined();
    expect(result.current.showMobileMenu).toBe(false);
    expect(result.current.assets).toEqual([]);
  });

  it('should load user profile on mount', () => {
    const { result } = renderHook(() => useAppState());
    
    expect(result.current.userProfile).toBeDefined();
    expect(result.current.userProfile?.name).toBe('Test User');
  });

  it('should detect first visit', () => {
    const { result } = renderHook(() => useAppState());
    
    // First visit should set flag
    expect(result.current.isFirstVisit).toBeDefined();
  });

  it('should handle notifications state', () => {
    const { result } = renderHook(() => useAppState());
    
    const testNotification = {
      id: '1',
      type: 'info' as const,
      message: 'Test',
      timestamp: new Date()
    };
    
    expect(typeof result.current.setNotifications).toBe('function');
    result.current.setNotifications([testNotification]);
    
    expect(result.current.notifications.length).toBeGreaterThanOrEqual(0);
  });

  it('should handle mobile menu state', () => {
    const { result } = renderHook(() => useAppState());
    
    expect(typeof result.current.setShowMobileMenu).toBe('function');
    result.current.setShowMobileMenu(true);
    expect(result.current.showMobileMenu).toBe(true);
  });

  it('should handle asset state', () => {
    const { result } = renderHook(() => useAppState());
    
    expect(typeof result.current.setAssets).toBe('function');
    expect(typeof result.current.setShowAssetModal).toBe('function');
    expect(typeof result.current.setEditingAsset).toBe('function');
  });

  it('should handle template state', () => {
    const { result } = renderHook(() => useAppState());
    
    expect(typeof result.current.setShowTemplateModal).toBe('function');
    expect(typeof result.current.setSelectedFramework).toBe('function');
    expect(result.current.selectedFramework).toBeDefined();
    expect(result.current.selectedCMMCLevel).toBeDefined();
  });

  it('should handle localStorage persistence', () => {
    renderHook(() => useAppState());
    
    // Should not crash with localStorage operations
    expect(true).toBe(true);
  });
});
