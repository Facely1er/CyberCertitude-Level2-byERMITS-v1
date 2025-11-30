/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'xs': '480px',
      },
      colors: {
        // Primary brand colors
        'primary': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#2A6F7F', // primary-teal
          600: '#1e5a6b',
          700: '#1a4d5a',
          800: '#164049',
          900: '#133338',
          950: '#0a1a1d',
        },
        'secondary': {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#3A9CA8', // secondary-teal
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        'accent': {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#00E5FF', // accent-cyan
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        // Status colors
        'success': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#4CAF50', // success-green
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        'warning': {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#FFD166', // premium-gold
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        'error': {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#FF6B6B', // alert-coral
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        // Surface colors
        'surface': {
          light: '#FFFFFF',
          dark: '#1C2128',
        },
        'background': {
          light: '#FFFFFF',
          dark: '#0F1419',
        },
        'support': {
          light: '#E0E5E9',
          dark: '#374151',
        },
        'text': {
          primary: {
            light: '#111827',
            dark: '#E5E7EB',
          },
          secondary: {
            light: '#6B7280',
            dark: '#9CA3AF',
          },
          muted: {
            light: '#9CA3AF',
            dark: '#6B7280',
          },
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(90deg, #2A6F7F 0%, #3A9CA8 100%)',
        'gradient-secondary': 'linear-gradient(90deg, #3A9CA8 0%, #00E5FF 100%)',
        'gradient-dark': 'linear-gradient(90deg, #3A9CA8 0%, #63B3B3 100%)'
      },
      boxShadow: {
        'enhanced': '0 10px 25px -5px rgba(42, 111, 127, 0.2), 0 8px 10px -6px rgba(42, 111, 127, 0.1)',
        'glow': '0 0 20px rgba(58, 156, 168, 0.6)',
      },
      transitionProperty: {
        'theme': 'background-color, border-color, color, fill, stroke',
      }
    },
  },
  plugins: [],
};