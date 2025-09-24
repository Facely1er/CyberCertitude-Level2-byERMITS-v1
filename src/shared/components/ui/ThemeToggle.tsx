import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-brand-warm/50 dark:bg-dark-brand-neutral text-brand-neutral dark:text-dark-primary hover:bg-primary-gold/10 dark:hover:bg-dark-primary/20 hover:text-primary-gold dark:hover:text-dark-primary transition-all duration-300 hover:scale-105"
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};