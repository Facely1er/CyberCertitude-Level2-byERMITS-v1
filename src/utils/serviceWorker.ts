/**
 * Service Worker Utility
 * Handles service worker registration, updates, and error recovery
 */

import { logger } from './logger';
import { securityMiddleware } from '../services/securityMiddleware';

interface ServiceWorkerConfig {
  scriptURL: string;
  scope: string;
  updateCheckInterval: number;
  maxRetries: number;
  retryDelay: number;
}

interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isInstalling: boolean;
  isUpdating: boolean;
  registration: ServiceWorkerRegistration | null;
  error: string | null;
}

class ServiceWorkerManager {
  private static instance: ServiceWorkerManager;
  private config: ServiceWorkerConfig;
  private state: ServiceWorkerState;
  private updateCheckTimer: NodeJS.Timeout | null = null;
  private retryCount = 0;

  constructor() {
    this.config = {
      scriptURL: '/sw.js',
      scope: '/',
      updateCheckInterval: 60000, // 1 minute
      maxRetries: 3,
      retryDelay: 5000 // 5 seconds
    };

    this.state = {
      isSupported: 'serviceWorker' in navigator,
      isRegistered: false,
      isInstalling: false,
      isUpdating: false,
      registration: null,
      error: null
    };
  }

  static getInstance(): ServiceWorkerManager {
    if (!ServiceWorkerManager.instance) {
      ServiceWorkerManager.instance = new ServiceWorkerManager();
    }
    return ServiceWorkerManager.instance;
  }

  async register(): Promise<boolean> {
    if (!this.state.isSupported) {
      logger.warn('Service Worker not supported in this browser');
      return false;
    }

    try {
      logger.info('Registering service worker...');
      
      const registration = await navigator.serviceWorker.register(
        this.config.scriptURL,
        { scope: this.config.scope }
      );

      this.state.registration = registration;
      this.state.isRegistered = true;
      this.state.error = null;

      // Set up event listeners
      this.setupEventListeners(registration);

      // Start update checking
      this.startUpdateChecking();

      securityMiddleware.logSecurityEvent('info', 'Service worker registered successfully', 'ServiceWorker');
      logger.info('Service worker registered successfully');

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.state.error = errorMessage;
      
      logger.error('Service worker registration failed:', error);
      securityMiddleware.logSecurityEvent('warning', 'Service worker registration failed', 'ServiceWorker', { error: errorMessage });
      
      // Retry registration if we haven't exceeded max retries
      if (this.retryCount < this.config.maxRetries) {
        this.retryCount++;
        logger.info(`Retrying service worker registration (${this.retryCount}/${this.config.maxRetries})...`);
        
        setTimeout(() => {
          this.register();
        }, this.config.retryDelay);
      }
      
      return false;
    }
  }

  private setupEventListeners(registration: ServiceWorkerRegistration): void {
    // Handle updates
    registration.addEventListener('updatefound', () => {
      logger.info('Service worker update found');
      this.state.isUpdating = true;
      
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          switch (newWorker.state) {
            case 'installed':
              if (navigator.serviceWorker.controller) {
                logger.info('New service worker installed, waiting for activation');
                this.handleUpdateAvailable();
              } else {
                logger.info('Service worker installed for the first time');
                this.state.isInstalling = false;
                this.state.isUpdating = false;
              }
              break;
            case 'activated':
              logger.info('Service worker activated');
              this.state.isInstalling = false;
              this.state.isUpdating = false;
              break;
            case 'redundant':
              logger.warn('Service worker became redundant');
              this.state.isInstalling = false;
              this.state.isUpdating = false;
              break;
          }
        });
      }
    });

    // Handle controller change
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      logger.info('Service worker controller changed');
      window.location.reload();
    });

    // Handle messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      this.handleServiceWorkerMessage(event);
    });
  }

  private handleUpdateAvailable(): void {
    // Show update notification to user
    const shouldUpdate = window.confirm(
      'A new version of the application is available. Would you like to reload to get the latest features and fixes?'
    );

    if (shouldUpdate) {
      this.update();
    } else {
      logger.info('User declined service worker update');
    }
  }

  private handleServiceWorkerMessage(event: MessageEvent): void {
    const { type, data } = event.data;

    switch (type) {
      case 'CACHE_UPDATED':
        logger.info('Cache updated:', data);
        break;
      case 'CACHE_ERROR':
        logger.error('Cache error:', data);
        break;
      case 'OFFLINE_DETECTED':
        logger.warn('Offline mode detected');
        break;
      case 'ONLINE_DETECTED':
        logger.info('Online mode detected');
        break;
      default:
        logger.debug('Unknown service worker message:', { type, data });
    }
  }

  private startUpdateChecking(): void {
    if (this.updateCheckTimer) {
      clearInterval(this.updateCheckTimer);
    }

    this.updateCheckTimer = setInterval(async () => {
      await this.checkForUpdates();
    }, this.config.updateCheckInterval);
  }

  private async checkForUpdates(): Promise<void> {
    if (!this.state.registration) return;

    try {
      await this.state.registration.update();
    } catch (error) {
      logger.error('Failed to check for service worker updates:', error);
    }
  }

  async update(): Promise<boolean> {
    if (!this.state.registration) {
      logger.warn('No service worker registration found for update');
      return false;
    }

    try {
      logger.info('Updating service worker...');
      
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration?.waiting) {
        // Tell the waiting service worker to skip waiting
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        return true;
      }

      // Force update check
      await registration.update();
      return true;
    } catch (error) {
      logger.error('Service worker update failed:', error);
      return false;
    }
  }

  async unregister(): Promise<boolean> {
    try {
      if (this.updateCheckTimer) {
        clearInterval(this.updateCheckTimer);
        this.updateCheckTimer = null;
      }

      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const success = await registration.unregister();
        if (success) {
          this.state.isRegistered = false;
          this.state.registration = null;
          logger.info('Service worker unregistered');
        }
        return success;
      }
      return true;
    } catch (error) {
      logger.error('Service worker unregistration failed:', error);
      return false;
    }
  }

  getState(): ServiceWorkerState {
    return { ...this.state };
  }

  isOnline(): boolean {
    return navigator.onLine;
  }

  // Send message to service worker
  async sendMessage(message: any): Promise<void> {
    if (!this.state.registration?.active) {
      logger.warn('No active service worker to send message to');
      return;
    }

    try {
      this.state.registration.active.postMessage(message);
    } catch (error) {
      logger.error('Failed to send message to service worker:', error);
    }
  }

  // Clear all caches
  async clearCaches(): Promise<void> {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      logger.info('All caches cleared');
    } catch (error) {
      logger.error('Failed to clear caches:', error);
    }
  }

  // Get cache information
  async getCacheInfo(): Promise<{ name: string; size: number }[]> {
    try {
      const cacheNames = await caches.keys();
      const cacheInfo = await Promise.all(
        cacheNames.map(async (name) => {
          const cache = await caches.open(name);
          const keys = await cache.keys();
          return { name, size: keys.length };
        })
      );
      return cacheInfo;
    } catch (error) {
      logger.error('Failed to get cache info:', error);
      return [];
    }
  }
}

// Export singleton instance
export const serviceWorkerManager = ServiceWorkerManager.getInstance();
export default serviceWorkerManager;