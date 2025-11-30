import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-support-light/50 dark:bg-surface-dark text-text-secondary-light dark:text-text-secondary-dark hover:bg-primary-500/10 dark:hover:bg-primary-400/20 hover:text-primary-500 dark:hover:text-primary-400 transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};