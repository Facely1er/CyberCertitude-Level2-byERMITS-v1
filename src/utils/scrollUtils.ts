/**
 * Utility functions for handling scroll behavior consistently across the application
 */

/**
 * Scrolls to the top of the page with smooth animation
 * Respects user's reduced motion preferences
 */
export const scrollToTop = (): void => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';
  
  try {
    // Try window scrolling first
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: scrollBehavior
    });
  } catch (_error) {
    // Fallback for browsers that don't support smooth scrolling
    window.scrollTo(0, 0);
  }
};

/**
 * Scrolls to a specific element with smooth animation
 * @param element - The element to scroll to
 * @param offset - Optional offset from the top (useful for fixed headers)
 */
const scrollToElement = (element: HTMLElement, offset: number = 0): void => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';
  
  const elementPosition = element.offsetTop - offset;
  
  try {
    window.scrollTo({
      top: elementPosition,
      left: 0,
      behavior: scrollBehavior
    });
  } catch (_error) {
    // Fallback for browsers that don't support smooth scrolling
    window.scrollTo(0, elementPosition);
  }
};

/**
 * Scrolls to a specific position with smooth animation
 * @param top - The vertical position to scroll to
 * @param left - The horizontal position to scroll to (defaults to 0)
 */
const scrollToPosition = (top: number, left: number = 0): void => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';
  
  try {
    window.scrollTo({
      top,
      left,
      behavior: scrollBehavior
    });
  } catch (_error) {
    // Fallback for browsers that don't support smooth scrolling
    window.scrollTo(left, top);
  }
};

/**
 * Gets the current scroll position
 * @returns Object with top and left scroll positions
 */
const getScrollPosition = (): { top: number; left: number } => {
  return {
    top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
    left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0
  };
};

/**
 * Checks if the page is scrolled to the top
 * @returns True if scrolled to top, false otherwise
 */
const isScrolledToTop = (): boolean => {
  return getScrollPosition().top === 0;
};

/**
 * Checks if the page is scrolled to the bottom
 * @returns True if scrolled to bottom, false otherwise
 */
const isScrolledToBottom = (): boolean => {
  const { top } = getScrollPosition();
  const documentHeight = document.documentElement.scrollHeight;
  const windowHeight = window.innerHeight;
  
  return top + windowHeight >= documentHeight;
};