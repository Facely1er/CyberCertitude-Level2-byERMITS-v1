import React, { useState, useEffect } from 'react';

interface TextCarouselProps {
  texts: string[];
  interval?: number;
  className?: string;
}

export const TextCarousel: React.FC<TextCarouselProps> = ({
  texts,
  interval = 3000,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (texts.length <= 1) return;

    const timer = setInterval(() => {
      setIsAnimating(true);
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setIsAnimating(false);
      }, 150);
    }, interval);

    return () => clearInterval(timer);
  }, [texts.length, interval]);

  if (texts.length === 0) return null;

  return (
    <div className={`relative overflow-hidden flex flex-col items-center ${className}`}>
      <div
        className={`min-h-[4rem] flex items-center justify-center transition-all duration-300 ease-in-out ${
          isAnimating ? 'opacity-0 transform translate-y-2' : 'opacity-100 transform translate-y-0'
        }`}
      >
        {texts[currentIndex]}
      </div>
      
      {texts.length > 1 && (
        <div className="flex space-x-2 mt-4">
          {texts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-teal-600 dark:bg-teal-400'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};