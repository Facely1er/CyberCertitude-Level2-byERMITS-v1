import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';

interface OfflineNoticeProps {
  isOnline: boolean;
  showNotice: boolean;
}

export const OfflineNotice: React.FC<OfflineNoticeProps> = ({ isOnline, showNotice }) => {
  if (!showNotice && isOnline) return null;

  return (
    <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
      showNotice ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    }`}>
      <div className={`px-6 py-3 rounded-full shadow-lg border ${
        isOnline 
          ? 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800 text-success-800 dark:text-success-200'
          : 'bg-error-50 dark:bg-error-900/20 border-error-200 dark:border-error-800 text-error-800 dark:text-error-200'
      }`}>
        <div className="flex items-center space-x-2">
          {isOnline ? (
            <Wifi className="w-4 h-4" />
          ) : (
            <WifiOff className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">
            {isOnline ? 'Back online' : 'You are offline - changes saved locally'}
          </span>
        </div>
      </div>
    </div>
  );
};