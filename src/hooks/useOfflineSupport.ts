import { useState, useEffect, useRef } from 'react';

export const useOfflineSupport = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineNotice, setShowOfflineNotice] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineNotice(false);
      // Clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineNotice(true);
      // Auto-hide offline notice after 5 seconds
      timeoutRef.current = setTimeout(() => setShowOfflineNotice(false), 5000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      // Clean up timeout on unmount
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return {
    isOnline,
    showOfflineNotice
  };
};