import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  lines = 1,
}) => {
  const baseClasses = 'animate-pulse bg-support-light dark:bg-support-dark';
  
  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  // Convert width/height to CSS values
  const getWidthValue = (w?: string | number, defaultVal = '100%') => {
    if (!w) return defaultVal;
    return typeof w === 'number' ? `${w}px` : w;
  };

  const getHeightValue = (h?: string | number, defaultVal = '1rem') => {
    if (!h) return defaultVal;
    return typeof h === 'number' ? `${h}px` : h;
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => {
          const lineWidth = i === lines - 1 ? '75%' : getWidthValue(width);
          const lineHeight = getHeightValue(height);
          return (
            <div
              key={i}
              className={`${baseClasses} ${variantClasses.text}`}
              data-width={lineWidth}
              data-height={lineHeight}
            />
          );
        })}
        <style>{`
          .space-y-2 > div[data-width] {
            width: var(--skeleton-width, 100%);
            height: var(--skeleton-height, 1rem);
          }
          ${Array.from({ length: lines }).map((_, i) => {
            const lineWidth = i === lines - 1 ? '75%' : getWidthValue(width);
            const lineHeight = getHeightValue(height);
            return `
              .space-y-2 > div[data-width]:nth-child(${i + 1}) {
                --skeleton-width: ${lineWidth};
                --skeleton-height: ${lineHeight};
              }
            `;
          }).join('')}
        `}</style>
      </div>
    );
  }

  const skeletonWidth = getWidthValue(width);
  const skeletonHeight = getHeightValue(height);

  return (
    <>
      <div
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        data-skeleton-width={skeletonWidth}
        data-skeleton-height={skeletonHeight}
      />
      <style>{`
        div[data-skeleton-width] {
          width: var(--skeleton-width, 100%);
          height: var(--skeleton-height, 1rem);
        }
        div[data-skeleton-width="${skeletonWidth}"][data-skeleton-height="${skeletonHeight}"] {
          --skeleton-width: ${skeletonWidth};
          --skeleton-height: ${skeletonHeight};
        }
      `}</style>
    </>
  );
};

// Skeleton variants for common use cases
export const SkeletonCard = () => (
  <div className="p-6 space-y-4">
    <Skeleton variant="rectangular" height="2rem" />
    <Skeleton variant="text" lines={3} />
    <Skeleton variant="rectangular" height="3rem" />
  </div>
);

export const SkeletonTable = ({ rows = 5 }: { rows?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex space-x-4">
        <Skeleton variant="rectangular" width="3rem" height="3rem" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
    ))}
  </div>
);

