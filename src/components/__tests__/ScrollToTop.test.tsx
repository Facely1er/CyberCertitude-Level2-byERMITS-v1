import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { ScrollToTop } from '../ScrollToTop';

// Mock window.scrollTo
const mockScrollTo = vi.fn();
global.window.scrollTo = mockScrollTo;

// Mock document.querySelector
const mockScrollIntoView = vi.fn();
const mockQuerySelector = vi.fn(() => ({
  scrollIntoView: mockScrollIntoView
}));
global.document.querySelector = mockQuerySelector as any;

describe('ScrollToTop', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(
      <MemoryRouter>
        <ScrollToTop />
      </MemoryRouter>
    );

    // Component returns null but should render without errors
    expect(true).toBe(true);
  });

  it('should scroll to top when pathname changes', () => {
    const { rerender } = render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <ScrollToTop />
      </MemoryRouter>
    );

    // Change route
    rerender(
      <MemoryRouter initialEntries={['/assessment']}>
        <ScrollToTop />
      </MemoryRouter>
    );

    // Should scroll to top
    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  });

  it('should scroll to hash element when hash is present', () => {
    const mockElement = {
      scrollIntoView: mockScrollIntoView
    };

    mockQuerySelector.mockReturnValue(mockElement as any);

    render(
      <MemoryRouter initialEntries={['/page#section']}>
        <ScrollToTop />
      </MemoryRouter>
    );

    // Should query for the hash element
    expect(mockQuerySelector).toHaveBeenCalledWith('#section');
    
    // Should scroll into view if element exists
    expect(mockScrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start'
    });
  });

  it('should not scroll when hash element is not found', () => {
    mockQuerySelector.mockReturnValue(null);

    render(
      <MemoryRouter initialEntries={['/page#nonexistent']}>
        <ScrollToTop />
      </MemoryRouter>
    );

    expect(mockQuerySelector).toHaveBeenCalledWith('#nonexistent');
    expect(mockScrollIntoView).not.toHaveBeenCalled();
  });

  it('should handle location changes', () => {
    const { rerender } = render(
      <MemoryRouter initialEntries={['/initial']}>
        <ScrollToTop />
      </MemoryRouter>
    );

    mockScrollTo.mockClear();

    rerender(
      <MemoryRouter initialEntries={['/updated']}>
        <ScrollToTop />
      </MemoryRouter>
    );

    // Should call scrollTo on pathname change
    expect(mockScrollTo).toHaveBeenCalled();
  });
});

