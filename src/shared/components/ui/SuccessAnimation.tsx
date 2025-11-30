import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessAnimationProps {
  message?: string;
  className?: string;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ 
  message = 'Success!',
  className = '' 
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <CheckCircle className="w-6 h-6 text-success-500 animate-checkmark" />
      {message && (
        <span className="text-success-600 dark:text-success-400 font-medium">
          {message}
        </span>
      )}
    </div>
  );
};

