import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  icon?: LucideIcon;
  subtitle?: string;
  showLogo?: boolean;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  icon: Icon,
  subtitle,
  showLogo = true,
  className = ''
}) => {
  return (
    <div className={`flex items-center space-x-4 mb-6 ${className}`}>
      {showLogo && (
        <Link to="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
          <img 
            src="/cybercertitude.png" 
            alt="CyberCertitude" 
            className="w-12 h-12 flex-shrink-0" 
          />
        </Link>
      )}
      <div className="flex-1">
        <div className="flex items-center space-x-3 mb-2">
          {Icon && (
            <Icon className="w-8 h-8 text-primary-500 dark:text-primary-400 flex-shrink-0" />
          )}
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {title}
          </h1>
        </div>
        {subtitle && (
          <div className="flex items-center space-x-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
            <span className="font-medium">CyberCertitude™</span>
            <span>•</span>
            <span>CMMC 2.0 Compliance</span>
            <span>•</span>
            <span>by ERMITS</span>
            {subtitle && (
              <>
                <span>•</span>
                <span>{subtitle}</span>
              </>
            )}
          </div>
        )}
        {!subtitle && (
          <div className="flex items-center space-x-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
            <span className="font-medium">CyberCertitude™</span>
            <span>•</span>
            <span>CMMC 2.0 Compliance</span>
            <span>•</span>
            <span>by ERMITS</span>
          </div>
        )}
      </div>
    </div>
  );
};

