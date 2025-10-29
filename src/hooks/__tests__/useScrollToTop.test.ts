import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useScrollToTop } from '../useScrollToTop';
import { useLocation } from 'react-router-dom';

vi.mock('react-router-dom', () => ({
  useLocation: vi.fn()
}));

vi.mock('../../utils/scrollUtils', () => ({
  scrollToTop: vi.fn()
}));

describe('useScrollToTop', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should call scrollToTop when pathname changes', () => {
    const mockScrollToTop = vi.fn();
    vi.mocked(require('../../utils/scrollUtils').scrollToTop).mockImplementation(mockScrollToTop);
    
    vi.mocked(useLocation).mockReturnValue({ pathname: '/dashboard' } as any);
    
    renderHook(() => useScrollToTop());
    
    expect(mockScrollToTop).toHaveBeenCalled();
  });

  it('should scroll on initial mount', () => {
    const mockScrollToTop = vi.fn();
    vi.mocked(require('../../utils/scrollUtils').scrollToTop).mockImplementation(mockScrollToTop);
    
    vi.mocked(useLocation).mockReturnValue({ pathname: '/initial' } as any);
    
    renderHook(() => useScrollToTop());
    
    expect(mockScrollToTop).toHaveBeenCalledTimes(1);
  });

  it('should scroll again when pathname changes', () => {
    const mockScrollToTop = vi.fn();
    vi.mocked(require('../../utils/scrollUtils').scrollToTop).mockImplementation(mockScrollToTop);
    
    vi.mocked(useLocation).mockReturnValue({ pathname: '/initial-path' } as any);
    
    const { rerender } = renderHook(() => useScrollToTop());
    
    vi.mocked(useLocation).mockReturnValue({ pathname: '/new-path' } as any);
    rerender();
    
    expect(mockScrollToTop).toHaveBeenCalled();
  });
});
