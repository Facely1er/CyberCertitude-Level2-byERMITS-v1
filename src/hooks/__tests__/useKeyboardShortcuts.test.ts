import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts } from '../useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
  let shortcuts: Array<{ key: string; action: () => void; description: string }>;

  beforeEach(() => {
    shortcuts = [
      { key: 'k', ctrlKey: true, action: vi.fn(), description: 'Search' },
      { key: 's', ctrlKey: true, action: vi.fn(), description: 'Save' }
    ];
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should register keyboard shortcuts', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    
    renderHook(() => useKeyboardShortcuts(shortcuts));
    
    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    
    addEventListenerSpy.mockRestore();
  });

  it('should trigger action on shortcut match', () => {
    const { rerender } = renderHook(() => useKeyboardShortcuts(shortcuts));
    
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true
    });
    
    window.dispatchEvent(event);
    
    expect(shortcuts[0].action).toHaveBeenCalled();
  });

  it('should ignore non-matching keys', () => {
    renderHook(() => useKeyboardShortcuts(shortcuts));
    
    const event = new KeyboardEvent('keydown', {
      key: 'z',
      ctrlKey: true
    });
    
    window.dispatchEvent(event);
    
    expect(shortcuts[0].action).not.toHaveBeenCalled();
  });

  it('should handle modifier keys', () => {
    renderHook(() => useKeyboardShortcuts(shortcuts));
    
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      shiftKey: false
    });
    
    window.dispatchEvent(event);
    
    expect(shortcuts[0].action).toHaveBeenCalledTimes(1);
  });

  it('should clean up event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useKeyboardShortcuts(shortcuts));
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    
    removeEventListenerSpy.mockRestore();
  });

  it('should update when shortcuts change', () => {
    const { rerender } = renderHook(
      ({ shortcuts }) => useKeyboardShortcuts(shortcuts),
      { initialProps: { shortcuts } }
    );
    
    const newShortcuts = [
      { key: 'x', action: vi.fn(), description: 'Exit' }
    ];
    
    rerender({ shortcuts: newShortcuts });
    
    const event = new KeyboardEvent('keydown', { key: 'x' });
    window.dispatchEvent(event);
    
    expect(newShortcuts[0].action).toHaveBeenCalled();
  });
});
