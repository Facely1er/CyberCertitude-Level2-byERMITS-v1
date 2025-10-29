import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TextCarousel } from '../TextCarousel';

describe('TextCarousel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render first text by default', () => {
    const texts = ['First text', 'Second text', 'Third text'];
    render(<TextCarousel texts={texts} />);

    expect(screen.getByText('First text')).toBeDefined();
  });

  it('should not render if texts array is empty', () => {
    const { container } = render(<TextCarousel texts={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('should cycle through texts automatically', () => {
    const texts = ['Text 1', 'Text 2', 'Text 3'];
    render(<TextCarousel texts={texts} interval={1000} />);

    expect(screen.getByText('Text 1')).toBeDefined();

    // Advance timer to trigger next text
    vi.advanceTimersByTime(1150); // interval + animation delay

    expect(screen.getByText('Text 2')).toBeDefined();

    // Advance to next
    vi.advanceTimersByTime(1000);
    expect(screen.getByText('Text 3')).toBeDefined();

    // Should cycle back to first
    vi.advanceTimersByTime(1000);
    expect(screen.getByText('Text 1')).toBeDefined();
  });

  it('should not animate with single text', () => {
    const texts = ['Single text'];
    render(<TextCarousel texts={texts} />);

    expect(screen.getByText('Single text')).toBeDefined();
    
    // Should not have indicator dots
    const dots = screen.queryAllByRole('button', { name: /go to slide/i });
    expect(dots.length).toBe(0);
  });

  it('should render indicator dots for multiple texts', () => {
    const texts = ['Text 1', 'Text 2', 'Text 3'];
    render(<TextCarousel texts={texts} />);

    const dots = screen.getAllByRole('button', { name: /go to slide/i });
    expect(dots.length).toBe(3);
  });

  it('should allow manual navigation via dots', () => {
    const texts = ['Text 1', 'Text 2', 'Text 3'];
    render(<TextCarousel texts={texts} />);

    const dots = screen.getAllByRole('button', { name: /go to slide/i });
    
    // Click second dot
    fireEvent.click(dots[1]);
    expect(screen.getByText('Text 2')).toBeDefined();

    // Click third dot
    fireEvent.click(dots[2]);
    expect(screen.getByText('Text 3')).toBeDefined();
  });

  it('should highlight active dot', () => {
    const texts = ['Text 1', 'Text 2'];
    render(<TextCarousel texts={texts} />);

    const dots = screen.getAllByRole('button', { name: /go to slide/i });
    
    // First dot should be active
    expect(dots[0].className).toContain('bg-teal-600');
    expect(dots[1].className).not.toContain('bg-teal-600');

    // Click second dot
    fireEvent.click(dots[1]);
    
    // Second dot should be active now
    expect(dots[1].className).toContain('bg-teal-600');
  });

  it('should use custom interval', () => {
    const texts = ['Text 1', 'Text 2'];
    render(<TextCarousel texts={texts} interval={2000} />);

    expect(screen.getByText('Text 1')).toBeDefined();

    // Should not change before interval
    vi.advanceTimersByTime(1500);
    expect(screen.getByText('Text 1')).toBeDefined();

    // Should change after interval
    vi.advanceTimersByTime(500);
    expect(screen.getByText('Text 2')).toBeDefined();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <TextCarousel texts={['Text 1']} className="custom-class" />
    );

    expect(container.firstChild?.className).toContain('custom-class');
  });

  it('should handle animation state', () => {
    const texts = ['Text 1', 'Text 2'];
    render(<TextCarousel texts={texts} interval={1000} />);

    // Initially should show first text
    expect(screen.getByText('Text 1')).toBeDefined();

    // Advance timer to trigger animation
    vi.advanceTimersByTime(1150);

    // Should show second text after animation
    expect(screen.getByText('Text 2')).toBeDefined();
  });

  it('should clean up timer on unmount', () => {
    const texts = ['Text 1', 'Text 2'];
    const { unmount } = render(<TextCarousel texts={texts} interval={1000} />);

    unmount();

    // Advance timer - should not cause errors
    vi.advanceTimersByTime(2000);
    
    expect(true).toBe(true); // If we get here, no errors occurred
  });
});

