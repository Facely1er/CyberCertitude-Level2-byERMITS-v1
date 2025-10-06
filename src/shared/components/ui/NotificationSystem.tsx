import React, { useEffect } from 'react';
import { X, CircleCheck as CheckCircle, CircleAlert as AlertCircle, TriangleAlert as AlertTriangle, Info } from 'lucide-react';
import { NotificationMessage } from '../../types';

interface NotificationSystemProps {
  notifications: NotificationMessage[];
  onRemove: (id: string) => void;
}

export const NotificationSystem: React.FC<NotificationSystemProps> = ({
  notifications,
  onRemove
}) => {
  useEffect(() => {
    notifications.forEach(notification => {
      const timer = setTimeout(() => {
        onRemove(notification.id);
      }, 5000); // Auto-remove after 5 seconds

      return () => clearTimeout(timer);
    });
  }, [notifications, onRemove]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-error-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-primary-500" />;
      default:
        return <Info className="w-5 h-5 text-primary-500" />;
    }
  };

  const getStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'status-success';
      case 'error':
        return 'status-error';
      case 'warning':
        return 'status-warning';
      case 'info':
        return 'status-info';
      default:
        return 'status-info';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`max-w-sm w-full border rounded-lg p-4 shadow-lg animate-slide-up ${getStyles(notification.type)}`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {getIcon(notification.type)}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium">
                {notification.message}
              </p>
              {notification.action && (
                <button
                  onClick={notification.action.onClick}
                  className="mt-2 text-sm underline hover:no-underline"
                >
                  {notification.action.label}
                </button>
              )}
            </div>
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={() => onRemove(notification.id)}
                className="inline-flex rounded-md p-1.5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};