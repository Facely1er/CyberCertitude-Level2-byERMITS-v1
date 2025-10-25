import { useCallback } from 'react';
import { NotificationMessage } from '../shared/types';

export const useNotifications = (
  notifications: NotificationMessage[],
  setNotifications: React.Dispatch<React.SetStateAction<NotificationMessage[]>>
) => {
  const addNotification = useCallback((type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    try {
      const notification: NotificationMessage = {
        id: Date.now().toString(),
        type,
        message,
        timestamp: new Date()
      };
      
      setNotifications(prev => [...prev, notification]);
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 5000);
    } catch (error) {
      console.error('Failed to add notification:', error);
    }
  }, [setNotifications]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, [setNotifications]);

  return {
    addNotification,
    removeNotification
  };
};
