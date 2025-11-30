import React from 'react';

interface StatusIndicatorProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'pending' | 'completed' | 'in-progress' | 'not-started';
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const statusClasses = {
  success: 'status-success',
  warning: 'status-warning',
  error: 'status-error',
  info: 'status-info',
  pending: 'status-warning',
  completed: 'status-success',
  'in-progress': 'status-info',
  'not-started': 'bg-support-light dark:bg-support-dark text-text-secondary-light dark:text-text-secondary-dark border border-support-light dark:border-support-dark',
};

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  children,
  className = '',
  size = 'md',
}) => {
  const baseClasses = statusClasses[status];
  const sizeClass = sizeClasses[size];
  
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${baseClasses} ${sizeClass} ${className}`}>
      {children}
    </span>
  );
};