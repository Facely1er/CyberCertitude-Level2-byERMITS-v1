import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTop } from '../utils/scrollUtils';

/**
 * Custom hook that scrolls to the top of the page whenever the route changes.
 * This ensures users don't have to manually scroll up after navigation.
 * 
 * Features:
 * - Smooth scrolling for better UX
 * - Fallback to instant scroll if smooth scrolling is not supported
 * - Handles both window and document scrolling
 * - Respects user's reduced motion preferences
 * - Uses centralized scroll utilities for consistency
 */
export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when pathname changes
    scrollToTop();
  }, [pathname]);
};