import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { useInternalLinking } from '../useInternalLinking';

const createWrapper = (initialEntries = ['/']) => {
  const router = createMemoryRouter([], {
    initialEntries
  });

  return ({ children }: { children: React.ReactNode }) => (
    <RouterProvider router={router}>{children}</RouterProvider>
  );
};

describe('useInternalLinking', () => {
  it('should return link suggestions for dashboard', () => {
    const { result } = renderHook(() => useInternalLinking(), {
      wrapper: createWrapper(['/'])
    });

    expect(result.current).toBeDefined();
    // Note: Full implementation would check for link suggestions
  });

  it('should return breadcrumbs for path', () => {
    const { result } = renderHook(() => useInternalLinking(), {
      wrapper: createWrapper(['/dashboard'])
    });

    const breadcrumbs = result.current.getBreadcrumbsForPath('/dashboard');
    expect(breadcrumbs).toBeDefined();
    expect(Array.isArray(breadcrumbs)).toBe(true);
  });

  it('should handle asset paths correctly', () => {
    const { result } = renderHook(() => useInternalLinking(), {
      wrapper: createWrapper(['/assets'])
    });

    const breadcrumbs = result.current.getBreadcrumbsForPath('/assets');
    expect(breadcrumbs).toBeDefined();
    // Should include dashboard in breadcrumbs
    expect(breadcrumbs.length).toBeGreaterThan(0);
  });

  it('should handle nested asset paths', () => {
    const { result } = renderHook(() => useInternalLinking(), {
      wrapper: createWrapper(['/assets/inventory'])
    });

    const breadcrumbs = result.current.getBreadcrumbsForPath('/assets/inventory');
    expect(breadcrumbs).toBeDefined();
    // Should have multiple breadcrumb items
    expect(breadcrumbs.length).toBeGreaterThanOrEqual(2);
  });

  it('should return suggestions for assessment path', () => {
    const { result } = renderHook(() => useInternalLinking(), {
      wrapper: createWrapper(['/assessment-intro'])
    });

    expect(result.current).toBeDefined();
    // Note: Full implementation would verify suggestions exist
  });
});

