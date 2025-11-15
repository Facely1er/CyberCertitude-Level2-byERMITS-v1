/**
 * 📱 Responsive Design System
 * Comprehensive mobile-first responsive design utilities
 */

import { useEffect, useState } from 'react';

// Breakpoint definitions
export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

// Device type detection
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface DeviceInfo {
  type: DeviceType;
  width: number;
  height: number;
  isTouch: boolean;
  isRetina: boolean;
  orientation: 'portrait' | 'landscape';
}

// Hook for responsive design
export const useResponsive = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    type: 'desktop',
    width: 0,
    height: 0,
    isTouch: false,
    isRetina: false,
    orientation: 'landscape'
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      let type: DeviceType = 'desktop';
      if (width < 768) {
        type = 'mobile';
      } else if (width < 1024) {
        type = 'tablet';
      }
      
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isRetina = window.devicePixelRatio > 1;
      const orientation = width > height ? 'landscape' : 'portrait';
      
      setDeviceInfo({
        type,
        width,
        height,
        isTouch,
        isRetina,
        orientation
      });
    };

    updateDeviceInfo();
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);

  return deviceInfo;
};

// Responsive component wrapper
export const ResponsiveWrapper: React.FC<{
  children: React.ReactNode;
  mobile?: React.ReactNode;
  tablet?: React.ReactNode;
  desktop?: React.ReactNode;
}> = ({ children, mobile, tablet, desktop }) => {
  const { type } = useResponsive();
  
  switch (type) {
    case 'mobile':
      return <>{mobile || children}</>;
    case 'tablet':
      return <>{tablet || children}</>;
    case 'desktop':
      return <>{desktop || children}</>;
    default:
      return <>{children}</>;
  }
};

// Responsive grid system
export const ResponsiveGrid: React.FC<{
  children: React.ReactNode;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: string;
  className?: string;
}> = ({ 
  children, 
  cols = { mobile: 1, tablet: 2, desktop: 3 }, 
  gap = '1rem',
  className = '' 
}) => {
  const { type } = useResponsive();
  
  const getCols = () => {
    switch (type) {
      case 'mobile':
        return cols.mobile || 1;
      case 'tablet':
        return cols.tablet || 2;
      case 'desktop':
        return cols.desktop || 3;
      default:
        return 3;
    }
  };
  
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${getCols()}, 1fr)`,
    gap,
    width: '100%'
  };
  
  return (
    <div style={gridStyle} className={className}>
      {children}
    </div>
  );
};

// Responsive text component
export const ResponsiveText: React.FC<{
  children: React.ReactNode;
  mobile?: string;
  tablet?: string;
  desktop?: string;
  className?: string;
}> = ({ children, mobile, tablet, desktop, className = '' }) => {
  const { type } = useResponsive();
  
  const getTextSize = () => {
    switch (type) {
      case 'mobile':
        return mobile || 'text-sm';
      case 'tablet':
        return tablet || 'text-base';
      case 'desktop':
        return desktop || 'text-lg';
      default:
        return 'text-base';
    }
  };
  
  return (
    <span className={`${getTextSize()} ${className}`}>
      {children}
    </span>
  );
};

// Responsive spacing component
export const ResponsiveSpacing: React.FC<{
  children: React.ReactNode;
  padding?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
  margin?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
  className?: string;
}> = ({ children, padding, margin, className = '' }) => {
  const { type } = useResponsive();
  
  const getPadding = () => {
    switch (type) {
      case 'mobile':
        return padding?.mobile || 'p-4';
      case 'tablet':
        return padding?.tablet || 'p-6';
      case 'desktop':
        return padding?.desktop || 'p-8';
      default:
        return 'p-6';
    }
  };
  
  const getMargin = () => {
    switch (type) {
      case 'mobile':
        return margin?.mobile || 'm-2';
      case 'tablet':
        return margin?.tablet || 'm-4';
      case 'desktop':
        return margin?.desktop || 'm-6';
      default:
        return 'm-4';
    }
  };
  
  return (
    <div className={`${getPadding()} ${getMargin()} ${className}`}>
      {children}
    </div>
  );
};

// Mobile-first utility classes
export const responsiveClasses = {
  // Display
  hidden: {
    mobile: 'block sm:hidden',
    tablet: 'hidden sm:block md:hidden',
    desktop: 'hidden md:block'
  },
  
  // Text sizes
  text: {
    xs: 'text-xs sm:text-sm md:text-base',
    sm: 'text-sm sm:text-base md:text-lg',
    base: 'text-base sm:text-lg md:text-xl',
    lg: 'text-lg sm:text-xl md:text-2xl',
    xl: 'text-xl sm:text-2xl md:text-3xl',
    '2xl': 'text-2xl sm:text-3xl md:text-4xl'
  },
  
  // Spacing
  padding: {
    sm: 'p-2 sm:p-4 md:p-6',
    base: 'p-4 sm:p-6 md:p-8',
    lg: 'p-6 sm:p-8 md:p-12'
  },
  
  margin: {
    sm: 'm-2 sm:m-4 md:m-6',
    base: 'm-4 sm:m-6 md:m-8',
    lg: 'm-6 sm:m-8 md:m-12'
  },
  
  // Grid columns
  grid: {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  }
};

// Touch-friendly component wrapper
export const TouchFriendly: React.FC<{
  children: React.ReactNode;
  minTouchSize?: number;
  className?: string;
}> = ({ children, minTouchSize = 44, className = '' }) => {
  const { isTouch } = useResponsive();
  
  if (!isTouch) {
    return <>{children}</>;
  }
  
  return (
    <div 
      className={className}
      style={{
        minHeight: `${minTouchSize}px`,
        minWidth: `${minTouchSize}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {children}
    </div>
  );
};

// Responsive image component
export const ResponsiveImage: React.FC<{
  src: string;
  alt: string;
  mobileSrc?: string;
  tabletSrc?: string;
  desktopSrc?: string;
  className?: string;
}> = ({ src, alt, mobileSrc, tabletSrc, desktopSrc, className = '' }) => {
  const { type } = useResponsive();
  
  const getImageSrc = () => {
    switch (type) {
      case 'mobile':
        return mobileSrc || src;
      case 'tablet':
        return tabletSrc || src;
      case 'desktop':
        return desktopSrc || src;
      default:
        return src;
    }
  };
  
  return (
    <img
      src={getImageSrc()}
      alt={alt}
      className={`w-full h-auto ${className}`}
      loading="lazy"
    />
  );
};

// Responsive navigation component
export const ResponsiveNavigation: React.FC<{
  children: React.ReactNode;
  mobileMenu?: React.ReactNode;
  className?: string;
}> = ({ children, mobileMenu, className = '' }) => {
  const { type } = useResponsive();
  
  if (type === 'mobile') {
    return (
      <nav className={`mobile-nav ${className}`}>
        {mobileMenu || children}
      </nav>
    );
  }
  
  return (
    <nav className={`desktop-nav ${className}`}>
      {children}
    </nav>
  );
};

// Responsive modal component
export const ResponsiveModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}> = ({ isOpen, onClose, children, title, className = '' }) => {
  const { type } = useResponsive();
  
  if (!isOpen) return null;
  
  const modalClasses = type === 'mobile' 
    ? 'fixed inset-0 z-50 bg-surface-light' 
    : 'fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center';
  
  const contentClasses = type === 'mobile'
    ? 'h-full overflow-y-auto p-4'
    : 'bg-surface-light rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto';
  
  return (
    <div className={modalClasses}>
      <div className={contentClasses}>
        {title && (
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="text-text-muted-light hover:text-text-primary-light"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        )}
        <div className={className}>
          {children}
        </div>
      </div>
    </div>
  );
};

// Responsive table component
export const ResponsiveTable: React.FC<{
  data: any[];
  columns: Array<{
    key: string;
    label: string;
    mobile?: boolean;
  }>;
  className?: string;
}> = ({ data, columns, className = '' }) => {
  const { type } = useResponsive();
  
  if (type === 'mobile') {
    // Show as cards on mobile
    return (
      <div className={`space-y-4 ${className}`}>
        {data.map((row, index) => (
          <div key={index} className="bg-surface-light p-4 rounded-lg shadow">
            {columns.filter(col => col.mobile !== false).map(column => (
              <div key={column.key} className="flex justify-between py-2 border-b last:border-b-0">
                <span className="font-medium">{column.label}:</span>
                <span>{row[column.key]}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
  
  // Show as table on tablet/desktop
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full bg-surface-light shadow rounded-lg">
        <thead>
          <tr className="bg-background-light">
            {columns.map(column => (
              <th key={column.key} className="px-4 py-3 text-left text-xs font-medium text-text-muted-light uppercase tracking-wider">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-background-light">
              {columns.map(column => (
                <td key={column.key} className="px-4 py-3 text-sm text-text-primary-light">
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Export all utilities
export default {
  useResponsive,
  ResponsiveWrapper,
  ResponsiveGrid,
  ResponsiveText,
  ResponsiveSpacing,
  TouchFriendly,
  ResponsiveImage,
  ResponsiveNavigation,
  ResponsiveModal,
  ResponsiveTable,
  responsiveClasses,
  breakpoints
};
