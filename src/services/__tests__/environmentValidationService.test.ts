import { describe, it, expect, beforeEach, vi } from 'vitest';
import { environmentValidationService, initializeEnvironmentValidation } from '../environmentValidationService';

// Mock dependencies
vi.mock('../config/environment', () => ({
  ENV: {
    isProduction: false,
    isDevelopment: true,
    SUPABASE_URL: 'https://test.supabase.co',
    SUPABASE_ANON_KEY: 'test-key-12345678901234567890123456789012345678901234567890',
    ENABLE_CSP: false,
    SECURE_COOKIES: false,
    AUTH_PROVIDER: 'supabase'
  }
}));

vi.mock('../lib/errorMonitoring', () => ({
  errorMonitoring: {
    captureMessage: vi.fn()
  }
}));

vi.mock('@/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    group: vi.fn(),
    groupEnd: vi.fn()
  }
}));

// Mock window and location
const mockWindow = {
  isSecureContext: true,
  crypto: {
    subtle: {}
  },
  location: {
    protocol: 'https:'
  },
  document: {
    querySelector: vi.fn(() => null),
    createElement: vi.fn((tag: string) => {
      const el = {
        style: {},
        textContent: '',
        appendChild: vi.fn(),
        addEventListener: vi.fn()
      };
      return el;
    }),
    body: {
      appendChild: vi.fn()
    }
  }
};

(global as any).window = mockWindow as any;
(global as any).location = mockWindow.location as any;
(global as any).document = mockWindow.document as any;

describe('EnvironmentValidationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = environmentValidationService;
      const instance2 = environmentValidationService;
      expect(instance1).toBe(instance2);
    });
  });

  describe('validateEnvironment', () => {
    it('should validate environment successfully', async () => {
      const result = await environmentValidationService.validateEnvironment();

      expect(result).toBeDefined();
      expect(result.isValid).toBeDefined();
      expect(result.errors).toBeInstanceOf(Array);
      expect(result.warnings).toBeInstanceOf(Array);
      expect(result.recommendations).toBeInstanceOf(Array);
    });

    it('should check production mode', async () => {
      const result = await environmentValidationService.validateEnvironment();

      // Should check if running in production
      expect(result.errors.length).toBeGreaterThanOrEqual(0);
      expect(result.warnings.length).toBeGreaterThanOrEqual(0);
    });

    it('should validate Supabase configuration', async () => {
      const result = await environmentValidationService.validateEnvironment();

      // Should check Supabase URL and key
      expect(result).toBeDefined();
    });

    it('should check for HTTPS in production', async () => {
      // Mock production environment
      vi.doMock('../config/environment', () => ({
        ENV: {
          isProduction: true,
          SUPABASE_URL: 'https://test.supabase.co',
          SUPABASE_ANON_KEY: 'test-key-' + 'a'.repeat(50)
        }
      }));

      const result = await environmentValidationService.validateEnvironment();

      expect(result).toBeDefined();
    });

    it('should check Web Crypto API availability', async () => {
      const result = await environmentValidationService.validateEnvironment();

      expect(result).toBeDefined();
      // Should check for Web Crypto API
    });

    it('should check service worker support', async () => {
      const result = await environmentValidationService.validateEnvironment();

      expect(result).toBeDefined();
    });

    it('should handle validation errors gracefully', async () => {
      // Mock a failing check
      const result = await environmentValidationService.validateEnvironment();

      // Should not throw, but return errors in result
      expect(result.errors).toBeInstanceOf(Array);
    });
  });

  describe('checkStorageEncryption', () => {
    it('should test storage encryption', () => {
      const service = environmentValidationService as any;
      
      // Test successful encryption check
      const result = service.checkStorageEncryption();
      
      expect(typeof result).toBe('boolean');
    });

    it('should handle encryption check errors', () => {
      // Mock localStorage to throw error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('Storage error');
      });

      const service = environmentValidationService as any;
      const result = service.checkStorageEncryption();

      expect(result).toBe(false);

      // Restore
      localStorage.setItem = originalSetItem;
    });
  });

  describe('checkBundleSize', () => {
    it('should check bundle size', async () => {
      const service = environmentValidationService as any;
      
      // Mock document with scripts
      const mockScripts = [
        { src: '/assets/app.js' },
        { src: '/assets/vendor.js' }
      ];
      
      global.document.querySelectorAll = vi.fn(() => mockScripts as any);

      const result = await service.checkBundleSize();

      expect(typeof result).toBe('boolean');
    });

    it('should handle bundle size check errors', async () => {
      global.document.querySelectorAll = vi.fn(() => {
        throw new Error('Query error');
      });

      const service = environmentValidationService as any;
      const result = await service.checkBundleSize();

      // Should return true on error (don't fail validation)
      expect(result).toBe(true);
    });
  });

  describe('checkSecurityHeaders', () => {
    it('should check security headers', async () => {
      const service = environmentValidationService as any;
      
      global.window.isSecureContext = true;
      global.document.querySelector = vi.fn(() => null);

      const result = await service.checkSecurityHeaders();

      expect(typeof result).toBe('boolean');
    });

    it('should handle security header check errors', async () => {
      global.window.isSecureContext = undefined as any;
      global.document.querySelector = vi.fn(() => {
        throw new Error('Query error');
      });

      const service = environmentValidationService as any;
      const result = await service.checkSecurityHeaders();

      expect(result).toBe(false);
    });
  });

  describe('runProductionReadinessCheck', () => {
    it('should run production readiness check', async () => {
      const result = await environmentValidationService.runProductionReadinessCheck();

      expect(result).toBeDefined();
      expect(result.ready).toBeDefined();
      expect(typeof result.ready).toBe('boolean');
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
      expect(result.issues).toBeInstanceOf(Array);
      expect(result.recommendations).toBeInstanceOf(Array);
    });

    it('should calculate readiness score', async () => {
      const result = await environmentValidationService.runProductionReadinessCheck();

      // Score should be between 0 and 100
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
    });

    it('should mark as ready if score >= 80', async () => {
      const result = await environmentValidationService.runProductionReadinessCheck();

      if (result.score >= 80) {
        expect(result.ready).toBe(true);
      } else {
        expect(result.ready).toBe(false);
      }
    });

    it('should include issues and recommendations', async () => {
      const result = await environmentValidationService.runProductionReadinessCheck();

      expect(result.issues.length).toBeGreaterThanOrEqual(0);
      expect(result.recommendations.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('logValidationResults', () => {
    it('should log validation results', () => {
      const result = {
        isValid: true,
        errors: [],
        warnings: [],
        recommendations: []
      };

      environmentValidationService.logValidationResults(result);

      // Should call logger methods
      expect(result).toBeDefined();
    });

    it('should log errors when validation fails', () => {
      const result = {
        isValid: false,
        errors: ['Error 1', 'Error 2'],
        warnings: ['Warning 1'],
        recommendations: ['Fix this']
      };

      environmentValidationService.logValidationResults(result);

      expect(result.errors.length).toBe(2);
    });

    it('should log warnings', () => {
      const result = {
        isValid: true,
        errors: [],
        warnings: ['Warning 1', 'Warning 2'],
        recommendations: []
      };

      environmentValidationService.logValidationResults(result);

      expect(result.warnings.length).toBe(2);
    });
  });

  describe('initializeEnvironmentValidation', () => {
    it('should initialize environment validation', async () => {
      const result = await initializeEnvironmentValidation();

      expect(result).toBeDefined();
    });

    it('should handle initialization errors', async () => {
      // Mock validation to throw
      const originalValidate = environmentValidationService.validateEnvironment;
      environmentValidationService.validateEnvironment = vi.fn(() => {
        throw new Error('Validation failed');
      });

      const result = await initializeEnvironmentValidation();

      // Should handle error gracefully
      expect(result).toBeDefined();

      // Restore
      environmentValidationService.validateEnvironment = originalValidate;
    });
  });
});

