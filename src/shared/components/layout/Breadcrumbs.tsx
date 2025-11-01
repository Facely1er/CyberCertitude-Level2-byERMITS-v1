import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Hop as Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
  onClick?: () => void;
  isActive?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
  homeLabel?: string;
  separator?: React.ReactNode;
  showLogo?: boolean;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ 
  items, 
  className = '', 
  showHome = true,
  homeLabel = 'Dashboard',
  separator = <ChevronRight className="w-4 h-4 text-text-muted-light dark:text-text-muted-dark" />,
  showLogo = true
}) => {
  return (
    <nav 
      className={`flex items-center space-x-2 text-sm ${className}`} 
      aria-label="Breadcrumb navigation"
      role="navigation"
    >
      {showLogo && (
        <>
          <Link
            to="/"
            className="flex items-center flex-shrink-0 hover:opacity-80 transition-opacity"
            aria-label="Go to home"
          >
            <img 
              src="/cybercertitude.png" 
              alt="CyberCertitude" 
              className="w-8 h-8 flex-shrink-0 mr-2" 
            />
          </Link>
          {items.length > 0 && separator}
        </>
      )}
      {showHome && (
        <>
          <Link
            to="/dashboard"
            className="flex items-center text-text-muted-light dark:text-text-muted-dark hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            aria-label="Go to dashboard"
          >
            <Home className="w-4 h-4" />
            <span className="ml-2 sr-only sm:not-sr-only">{homeLabel}</span>
          </Link>
          {items.length > 0 && separator}
        </>
      )}
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.path && !item.isActive ? (
            <Link
              to={item.path}
              className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium"
              aria-label={`Go to ${item.label}`}
            >
              {item.label}
            </Link>
          ) : item.onClick && !item.isActive ? (
            <button
              onClick={item.onClick}
              className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium"
              aria-label={`Go to ${item.label}`}
            >
              {item.label}
            </button>
          ) : (
            <span 
              className={`font-medium ${
                item.isActive 
                  ? 'text-primary-500 dark:text-primary-400' 
                  : 'text-text-primary-light dark:text-text-primary-dark'
              }`}
              aria-current={item.isActive ? 'page' : undefined}
            >
              {item.label}
            </span>
          )}
          {index < items.length - 1 && separator}
        </React.Fragment>
      ))}
    </nav>
  );
};