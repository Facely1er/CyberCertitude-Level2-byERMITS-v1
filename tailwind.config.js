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
        // Primary brand colors (aligned with logo)
        'primary-gold': '#D4B26F',
        'secondary-gold': '#E6C47A',
        'accent-red': '#E53935',
        'surface': '#FFFFFF',
        'support-gray': '#E0E5E9',
        'alert-coral': '#FF6B6B',
        'success-green': '#4CAF50',
        'premium-gold': '#D4B26F',
        
        // Enhanced brand color palette
        'brand-warm': '#F4E4BC', // Light warm tone
        'brand-neutral': '#8B7355', // Muted gold
        'brand-deep': '#B8956A', // Deep gold
        'brand-accent': '#C4A484', // Soft accent
        
        // Dark mode variants (enhanced for better contrast)
        'dark-primary': '#E6C47A',
        'dark-bg': '#1A1A1A',
        'dark-surface': '#2D2D2D',
        'dark-text': '#F5F5F5',
        'dark-support': '#404040',
        'dark-alert': '#FF6B6B',
        'dark-success': '#10B981',
        'dark-premium': '#D4B26F',
        'dark-accent': '#FF5252',
        
        // Enhanced dark mode brand colors
        'dark-brand-warm': '#2A2520',
        'dark-brand-neutral': '#3D3429',
        'dark-brand-deep': '#4A3F32',
        'dark-brand-accent': '#5A4F42',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(90deg, #D4B26F 0%, #E6C47A 100%)',
        'gradient-accent': 'linear-gradient(90deg, #E6C47A 0%, #E53935 100%)',
        'gradient-dark': 'linear-gradient(90deg, #E6C47A 0%, #D4B26F 100%)',
        'gradient-brand': 'linear-gradient(135deg, #D4B26F 0%, #E6C47A 50%, #B8956A 100%)',
        'gradient-brand-subtle': 'linear-gradient(135deg, #F4E4BC 0%, #E6C47A 100%)',
        'gradient-dark-brand': 'linear-gradient(135deg, #2A2520 0%, #4A3F32 50%, #3D3429 100%)'
      },
      boxShadow: {
        'enhanced': '0 10px 25px -5px rgba(212, 178, 111, 0.2), 0 8px 10px -6px rgba(212, 178, 111, 0.1)',
        'glow': '0 0 20px rgba(212, 178, 111, 0.6)',
      },
      transitionProperty: {
        'theme': 'background-color, border-color, color, fill, stroke',
      }
    },
  },
  plugins: [],
};