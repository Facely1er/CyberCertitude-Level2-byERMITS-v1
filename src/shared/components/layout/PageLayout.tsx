import React from 'react';
import { Breadcrumbs } from './Breadcrumbs';

interface BreadcrumbItem {
  label: string;
  path?: string;
  onClick?: () => void;
  isActive?: boolean;
}

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '7xl' | 'full';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  showBreadcrumbs?: boolean;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
};

const paddingClasses = {
  sm: 'px-4 py-4',
  md: 'px-4 sm:px-6 py-6',
  lg: 'px-4 sm:px-6 lg:px-8 py-8',
  xl: 'px-4 sm:px-6 lg:px-8 py-12',
};

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  subtitle,
  breadcrumbs = [],
  className = '',
  maxWidth = '7xl',
  padding = 'lg',
  showBreadcrumbs = true,
}) => {
  return (
    <div className={`${maxWidthClasses[maxWidth]} mx-auto ${paddingClasses[padding]} ${className}`}>
      {/* Breadcrumbs */}
      {showBreadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} className="mb-6" />
      )}
      
      {/* Page Header */}
      {(title || subtitle) && (
        <div className="mb-8">
          {title && (
            <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      {/* Page Content */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};