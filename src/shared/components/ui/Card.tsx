import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'standard' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  onClick?: () => void;
}

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-12',
};

const variantClasses = {
  standard: 'card-standard',
  elevated: 'card-elevated',
  outlined: 'bg-transparent border-2 border-support-light dark:border-support-dark',
};

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'standard',
  padding = 'md',
  hover = true,
  onClick,
}) => {
  const baseClasses = variantClasses[variant];
  const paddingClass = paddingClasses[padding];
  const hoverClass = hover && variant !== 'outlined' ? 'hover:shadow-enhanced hover:-translate-y-2' : '';
  const clickableClass = onClick ? 'cursor-pointer' : '';
  
  return (
    <div
      className={`${baseClasses} ${paddingClass} ${hoverClass} ${clickableClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};