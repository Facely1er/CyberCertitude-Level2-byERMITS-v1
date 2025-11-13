import React, { useRef, useEffect } from 'react';

interface ProgressBarProps {
  percentage: number;
  height?: 'h-2' | 'h-3' | 'h-4';
  backgroundColor?: string;
  progressColor?: string;
  className?: string;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  height = 'h-2',
  backgroundColor = 'bg-gray-200 dark:bg-gray-700',
  progressColor = 'bg-blue-500',
  className = '',
  showLabel = false
}) => {
  const progressRef = useRef<HTMLDivElement>(null);
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  const ariaLabel = `Progress: ${clampedPercentage.toFixed(0)}%`;
  
  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.width = `${clampedPercentage}%`;
    }
  }, [clampedPercentage]);
  
  return (
    <div className={`w-full ${backgroundColor} rounded-full overflow-hidden ${className}`}>
      <div
        ref={progressRef}
        className={`${progressColor} ${height} rounded-full transition-all duration-500`}
        role="progressbar"
        {...({
          'aria-valuenow': clampedPercentage,
          'aria-valuemin': 0,
          'aria-valuemax': 100,
        } as React.AriaAttributes)}
        aria-label={ariaLabel}
      >
        {showLabel && (
          <span className="text-xs text-white px-2">{clampedPercentage.toFixed(0)}%</span>
        )}
      </div>
    </div>
  );
};

