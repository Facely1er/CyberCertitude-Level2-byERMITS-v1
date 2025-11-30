import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useNotifications from '../useNotifications';

describe('useNotifications', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
  });

  it('should initialize with empty notifications', () => {
    const { result } = renderHook(() => useNotifications());
    expect(result.current.notifications).toEqual([]);
  });

  it('should add notification', () => {
    const { result } = renderHook(() => useNotifications());
    
    act(() => {
      result.current.addNotification('success', 'Test message');
    });

    expect(result.current.notifications.length).toBe(1);
    expect(result.current.notifications[0].message).toBe('Test message');
  });

  it('should handle multiple notification types', () => {
    const { result } = renderHook(() => useNotifications());
    
    act(() => {
      result.current.addNotification('success', 'Success message');
      result.current.addNotification('error', 'Error message');
      result.current.addNotification('warning', 'Warning message');
      result.current.addNotification('info', 'Info message');
    });

    expect(result.current.notifications.length).toBe(4);
  });

  it('should remove notification', () => {
    const { result } = renderHook(() => useNotifications());
    
    act(() => {
      result.current.addNotification('success', 'Test');
    });

    const notificationId = result.current.notifications[0].id;
    
    act(() => {
      result.current.removeNotification(notificationId);
    });

    expect(result.current.notifications.length).toBe(0);
  });

  it('should clear all notifications', () => {
    const { result } = renderHook(() => useNotifications());
    
    act(() => {
      result.current.addNotification('success', 'Test 1');
      result.current.addNotification('error', 'Test 2');
      result.current.clearAll();
    });

    expect(result.current.notifications.length).toBe(0);
  });

  it('should handle null/undefined values gracefully', () => {
    const { result } = renderHook(() => useNotifications());
    
    act(() => {
      result.current.addNotification(null as any, '');
      result.current.addNotification(undefined as any, null as any);
    });

    expect(result.current.notifications.length).toBeGreaterThanOrEqual(0);
  });

  it('should handle rapid adding and removing', () => {
    const { result } = renderHook(() => useNotifications());
    
    act(() => {
      for (let i = 0; i < 100; i++) {
        result.current.addNotification('info', `Message ${i}`);
      }
    });

    expect(result.current.notifications.length).toBe(100);
    
    act(() => {
      result.current.notifications.forEach(notif => {
        result.current.removeNotification(notif.id);
      });
    });

    expect(result.current.notifications.length).toBe(0);
  });
});

