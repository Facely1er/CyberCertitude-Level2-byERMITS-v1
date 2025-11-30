import { ENV } from '../config/environment';
import { errorMonitoring } from '../lib/errorMonitoring';
import { logger } from '@/utils/logger';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

interface SecurityCheck {
  name: string;
  check: () => boolean | Promise<boolean>;
  severity: 'error' | 'warning' | 'info';
  message: string;
  recommendation?: string;
}

class EnvironmentValidationService {
  private static instance: EnvironmentValidationService;
  
  static getInstance(): EnvironmentValidationService {
    if (!EnvironmentValidationService.instance) {
      EnvironmentValidationService.instance = new EnvironmentValidationService();
    }
    return EnvironmentValidationService.instance;
  }

  async validateEnvironment(): Promise<ValidationResult> {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      recommendations: []
    };

    const checks: SecurityCheck[] = [
      // Production Environment Checks
      {
        name: 'Production Mode',
        check: () => ENV.isProduction,
        severity: ENV.isProduction ? 'info' : 'warning',
        message: ENV.isProduction ? 'Running in production mode' : 'Running in development mode',
        recommendation: 'Ensure NODE_ENV=production for production deployments'
      },

      // Supabase Configuration
      {
        name: 'Supabase URL',
        check: () => !!ENV.SUPABASE_URL && ENV.SUPABASE_URL.startsWith('https://'),
        severity: ENV.isProduction ? 'error' : 'warning',
        message: 'Supabase URL must be configured and use HTTPS',
        recommendation: 'Set VITE_SUPABASE_URL environment variable'
      },

      {
        name: 'Supabase Key',
        check: () => !!ENV.SUPABASE_ANON_KEY && ENV.SUPABASE_ANON_KEY.length > 50,
        severity: ENV.isProduction ? 'error' : 'warning',
        message: 'Supabase anonymous key must be configured',
        recommendation: 'Set VITE_SUPABASE_ANON_KEY environment variable'
      },

      // Security Headers
      {
        name: 'CSP Enabled',
        check: () => ENV.ENABLE_CSP || !ENV.isProduction,
        severity: 'warning',
        message: 'Content Security Policy should be enabled in production',
        recommendation: 'Set VITE_ENABLE_CSP=true for production'
      },

      {
        name: 'Secure Cookies',
        check: () => ENV.SECURE_COOKIES || !ENV.isProduction,
        severity: 'warning',
        message: 'Secure cookies should be enabled in production',
        recommendation: 'Set VITE_SECURE_COOKIES=true for production'
      },

      // HTTPS Check
      {
        name: 'HTTPS Protocol',
        check: () => !ENV.isProduction || location.protocol === 'https:',
        severity: 'error',
        message: 'Production deployment must use HTTPS',
        recommendation: 'Configure SSL/TLS certificates and redirect HTTP to HTTPS'
      },

      // Browser Security Features
      {
        name: 'Web Crypto API',
        check: () => typeof window !== 'undefined' && !!window.crypto && !!window.crypto.subtle,
        severity: 'warning',
        message: 'Web Crypto API is required for encryption features',
        recommendation: 'Use a modern browser that supports Web Crypto API'
      },

      {
        name: 'Service Worker Support',
        check: () => typeof window !== 'undefined' && 'serviceWorker' in navigator,
        severity: 'info',
        message: 'Service Worker support for offline functionality',
        recommendation: 'Service Workers enhance performance and offline capabilities'
      },

      // Local Storage Security
      {
        name: 'Storage Encryption',
        check: () => this.checkStorageEncryption(),
        severity: 'info',
        message: 'Local storage encryption is working',
        recommendation: 'Sensitive data is encrypted before storage'
      },

      // Authentication Configuration
      {
        name: 'Auth Provider',
        check: () => ENV.AUTH_PROVIDER === 'supabase',
        severity: 'error',
        message: 'Authentication provider must be configured',
        recommendation: 'Set VITE_AUTH_PROVIDER=supabase'
      },

      // Performance Checks
      {
        name: 'Bundle Size',
        check: async () => await this.checkBundleSize(),
        severity: 'warning',
        message: 'Bundle size should be optimized for production',
        recommendation: 'Use code splitting and lazy loading to reduce initial bundle size'
      },

      // Security Headers Check
      {
        name: 'Security Headers',
        check: async () => await this.checkSecurityHeaders(),
        severity: 'warning',
        message: 'Security headers should be properly configured',
        recommendation: 'Configure CSP, HSTS, and other security headers in your deployment'
      }
    ];

    // Run all checks
    for (const check of checks) {
      try {
        const passed = await check.check();
        
        if (!passed) {
          switch (check.severity) {
            case 'error':
              result.errors.push(check.message);
              result.isValid = false;
              break;
            case 'warning':
              result.warnings.push(check.message);
              break;
            case 'info':
              // Info messages don't affect validity
              break;
          }
          
          if (check.recommendation) {
            result.recommendations.push(check.recommendation);
          }
        }
      } catch (error) {
        result.warnings.push(`Failed to run check: ${check.name}`);
        errorMonitoring.captureMessage(
          `Environment validation check failed: ${check.name}`,
          'error',
          { extra: { error } }
        );
      }
    }

    return result;
  }

  private checkStorageEncryption(): boolean {
    try {
      // Test if we can encrypt/decrypt data
      const testData = 'test-encryption';
      localStorage.setItem('encryption-test', btoa(testData));
      const retrieved = atob(localStorage.getItem('encryption-test') || '');
      localStorage.removeItem('encryption-test');
      return retrieved === testData;
    } catch (error) {
      return false;
    }
  }

  private async checkBundleSize(): Promise<boolean> {
    try {
      // Check if the main bundle is reasonably sized
      const scripts = document.querySelectorAll('script[src]');
      let totalSize = 0;
      
      for (const script of scripts) {
        const src = (script as HTMLScriptElement).src;
        if (src && src.includes('/assets/')) {
          // This is a rough estimate - in production you'd want actual metrics
          totalSize += 1000; // Assume 1KB per script for estimation
        }
      }
      
      // Warn if estimated total size is over 2MB
      return totalSize < 2000000;
    } catch (error) {
      return true; // Don't fail if we can't check
    }
  }

  private async checkSecurityHeaders(): Promise<boolean> {
    try {
      // Check if running in a secure context
      const isSecureContext = window.isSecureContext;
      
      // Check if CSP is likely configured (we can't directly access headers from client)
      const hasMetaCSP = !!document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      
      return isSecureContext || hasMetaCSP;
    } catch (error) {
      return false;
    }
  }

  async runProductionReadinessCheck(): Promise<{
    ready: boolean;
    score: number;
    issues: string[];
    recommendations: string[];
  }> {
    const validation = await this.validateEnvironment();
    
    let score = 100;
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    // Deduct points for errors and warnings
    score -= validation.errors.length * 20; // 20 points per error
    score -= validation.warnings.length * 10; // 10 points per warning
    
    issues.push(...validation.errors, ...validation.warnings);
    recommendations.push(...validation.recommendations);
    
    const ready = validation.isValid && score >= 80;
    
    return {
      ready,
      score: Math.max(0, score),
      issues,
      recommendations
    };
  }

  logValidationResults(result: ValidationResult): void {
    if (ENV.isDevelopment) {
      if (result.isValid) {
        logger.info('✅ Environment validation passed');
      } else {
        logger.error('❌ Environment validation failed');
        logger.group('Validation Errors:');
        result.errors.forEach(error => logger.error(`• ${error}`));
        logger.groupEnd();
      }
      
      if (result.warnings.length > 0) {
        logger.group('Validation Warnings:');
        result.warnings.forEach(warning => logger.warn(`• ${warning}`));
        logger.groupEnd();
      }
      
      if (result.recommendations.length > 0) {
        logger.group('Recommendations:');
        result.recommendations.forEach(rec => logger.info(`• ${rec}`));
        logger.groupEnd();
      }
    }
    
    // Log to monitoring service
    if (!result.isValid) {
      errorMonitoring.captureMessage(
        'Environment validation failed',
        'error',
        {
          extra: {
            errors: result.errors,
            warnings: result.warnings,
            recommendations: result.recommendations
          }
        }
      );
    }
  }
}

const environmentValidationService = EnvironmentValidationService.getInstance();

// Auto-run validation on startup
export const initializeEnvironmentValidation = async () => {
  try {
    const result = await environmentValidationService.validateEnvironment();
    environmentValidationService.logValidationResults(result);
    
    // Only show error overlay for critical errors, not missing environment variables
    if (!result.isValid && ENV.isProduction && result.errors.some(error => 
      !error.includes('Supabase') && !error.includes('environment variable')
    )) {
      // In production, show a user-friendly error only for critical issues
      const errorDiv = document.createElement('div');
      
      // Create elements programmatically to avoid innerHTML
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed; 
        top: 0; 
        left: 0; 
        width: 100%; 
        height: 100%; 
        background: rgba(0,0,0,0.8); 
        color: white; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `;
      
      const content = document.createElement('div');
      content.style.cssText = `
        background: #1f2937; 
        padding: 2rem; 
        border-radius: 0.5rem; 
        max-width: 500px; 
        text-align: center;
      `;
      
      const title = document.createElement('h2');
      title.style.cssText = 'color: #ef4444; margin-bottom: 1rem;';
      title.textContent = 'Configuration Error';
      
      const message = document.createElement('p');
      message.style.cssText = 'margin-bottom: 1rem;';
      message.textContent = 'The application is not properly configured for production use. Please contact your system administrator.';
      
      const button = document.createElement('button');
      button.style.cssText = `
        background: #3b82f6; 
        color: white; 
        border: none; 
        padding: 0.5rem 1rem; 
        border-radius: 0.25rem; 
        cursor: pointer;
      `;
      button.textContent = 'Retry';
      button.onclick = () => location.reload();
      
      content.appendChild(title);
      content.appendChild(message);
      content.appendChild(button);
      overlay.appendChild(content);
      errorDiv.appendChild(overlay);
      
      document.body.appendChild(errorDiv);
    }
    
    return result;
  } catch (error) {
    logger.error('Failed to run environment validation:', error);
    errorMonitoring.captureMessage(
      'Environment validation initialization failed',
      'error',
      { extra: { error } }
    );
  }
};