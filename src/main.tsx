import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx'; // Import the new App component
import { ThemeProvider } from './shared/contexts/ThemeContext';
import { ScrollToTop } from './components/ScrollToTop';
import { initializeEnvironmentValidation } from './services/environmentValidationService';
import { preloadCriticalComponents } from './components/LazyComponents';
import { securityMiddleware } from './services/securityMiddleware';
import { performanceMonitoring } from './services/performanceMonitoring';
import './index.css';

// Initialize environment validation and security checks
initializeEnvironmentValidation();

// Initialize security middleware
securityMiddleware.logSecurityEvent('info', 'Application starting up', 'Main');

// Initialize performance monitoring
if (performanceMonitoring.isMonitoringEnabled()) {
  performanceMonitoring.recordCustomMetric('App Start', performance.now(), 'app-start');
}

// Preload critical components for better performance
preloadCriticalComponents();

// Register service worker for offline capabilities
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        // Service worker registered successfully
        securityMiddleware.logSecurityEvent('info', 'Service worker registered successfully', 'ServiceWorker');
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker?.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Show update notification
              if (window.confirm('New version available. Reload to update?')) {
                window.location.reload();
              }
            }
          });
        });
      })
      .catch((error) => {
        // Service worker registration failed - continue without offline support
        securityMiddleware.logSecurityEvent('warning', 'Service worker registration failed', 'ServiceWorker', { error: error.message });
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <ThemeProvider>
        <App /> {/* Render the new App component */}
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);