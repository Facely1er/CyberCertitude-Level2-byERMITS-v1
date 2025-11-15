import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor, CheckCircle } from 'lucide-react';
import { logger } from '../utils/logger';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAInstallPromptProps {
  onInstall?: () => void;
  onDismiss?: () => void;
}

const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ onInstall, onDismiss }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installPlatform, setInstallPlatform] = useState<string>('');

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return;
      }
      
      // Check for iOS Safari
      if ((window.navigator as any).standalone === true) {
        setIsInstalled(true);
        return;
      }
    };

    checkInstalled();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      
      // Show install prompt after a delay
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 3000);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      onInstall?.();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [onInstall]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setInstallPlatform(choiceResult.platform);
        onInstall?.();
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      logger.error('Error installing PWA:', error);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    onDismiss?.();
    
    // Store dismissal in localStorage to avoid showing again immediately
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  const handleManualInstall = () => {
    // Show manual installation instructions
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    if (isIOS) {
      alert('To install this app on iOS:\n1. Tap the Share button\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add"');
    } else if (isAndroid) {
      alert('To install this app on Android:\n1. Tap the menu button (three dots)\n2. Tap "Add to Home Screen" or "Install App"\n3. Tap "Install"');
    } else {
      alert('To install this app:\n1. Look for the install icon in your browser\'s address bar\n2. Click it and follow the prompts\n3. Or use the browser menu to install the app');
    }
  };

  // Don't show if already installed or recently dismissed
  if (isInstalled || !showInstallPrompt) {
    return null;
  }

  // Check if recently dismissed
  const dismissedTime = localStorage.getItem('pwa-install-dismissed');
  if (dismissedTime && Date.now() - parseInt(dismissedTime) < 24 * 60 * 60 * 1000) { // 24 hours
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg border border-support-light dark:border-support-dark p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-text-primary-light dark:text-text-primary-light">
              Install CMMC Platform
            </h3>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">
              Get quick access to your compliance tools with our app
            </p>
            
            <div className="flex items-center space-x-2 mt-3">
              <button
                onClick={handleInstallClick}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Download className="w-3 h-3 mr-1" />
                Install
              </button>
              
              <button
                onClick={handleManualInstall}
                className="inline-flex items-center px-3 py-1.5 border border-support-light dark:border-support-dark text-xs font-medium rounded-md text-text-primary-light dark:text-text-secondary-dark bg-surface-light dark:bg-surface-dark hover:bg-background-light dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Manual Install
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-text-muted-dark hover:text-text-secondary-light dark:hover:text-text-secondary-dark"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="mt-3 pt-3 border-t border-support-light dark:border-support-dark">
          <div className="flex items-center space-x-4 text-xs text-text-muted-light dark:text-text-muted-dark">
            <div className="flex items-center">
              <Smartphone className="w-3 h-3 mr-1" />
              Mobile App
            </div>
            <div className="flex items-center">
              <Monitor className="w-3 h-3 mr-1" />
              Desktop App
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-3 h-3 mr-1" />
              Offline Access
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;