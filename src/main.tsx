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
import { storageMigration } from './utils/storageMigration';
import { serviceWorkerManager } from './utils/serviceWorker';
import './index.css';

// Initialize environment validation and security checks
initializeEnvironmentValidation();

// Run storage migration
storageMigration.migrate().then(success => {
  if (success) {
    console.log('Storage migration completed successfully');
  } else {
    console.warn('Storage migration completed with errors');
  }
});

// Initialize security middleware
securityMiddleware.logSecurityEvent('info', 'Application starting up', 'Main');

// Initialize performance monitoring
if (performanceMonitoring.isMonitoringEnabled()) {
  performanceMonitoring.recordCustomMetric('App Start', performance.now(), 'app-start');
}

// Preload critical components for better performance
preloadCriticalComponents();

// Register service worker for offline capabilities
if (import.meta.env.PROD) {
  window.addEventListener('load', async () => {
    try {
      const success = await serviceWorkerManager.register();
      if (success) {
        console.log('Service worker registered successfully');
      } else {
        console.warn('Service worker registration failed, continuing without offline support');
      }
    } catch (error) {
      console.error('Service worker initialization error:', error);
    }
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