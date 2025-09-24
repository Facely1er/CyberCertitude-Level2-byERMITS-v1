/**
 * Test Setup Configuration
 * Global test setup and mocks
 */

import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock environment variables for tests
vi.mock('../config/environment', () => ({
  ENV: {
    NODE_ENV: 'test',
    APP_VERSION: '2.0.0',
    AUTH_PROVIDER: 'supabase',
    JWT_SECRET: 'test-secret',
    SESSION_TIMEOUT: 28800000,
    SUPABASE_URL: 'https://test.supabase.co',
    SUPABASE_ANON_KEY: 'test-anon-key',
    ENABLE_CSP: false,
    SECURE_COOKIES: false,
    SENTRY_DSN: '',
    ANALYTICS_ID: '',
    ENABLE_OFFLINE_MODE: true,
    ENABLE_ADVANCED_FEATURES: true,
    ENABLE_MULTI_TENANT: false,
    API_BASE_URL: '/api',
    API_TIMEOUT: 30000,
    isProduction: false,
    isDevelopment: true,
    isTest: true,
  },
  validateEnvironment: () => ({
    isValid: true,
    errors: [],
    warnings: []
  }),
  validateRuntimeEnvironment: () => true
}));

// Mock Supabase client
vi.mock('../lib/supabase', () => ({
  isSupabaseReady: true,
  supabase: {
    auth: {
      signInWithOtp: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn(),
      getSession: vi.fn(),
      refreshSession: vi.fn(),
      resetPasswordForEmail: vi.fn()
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn()
    }))
  },
  signInWithMagicLink: vi.fn(),
  signUpWithMagicLink: vi.fn(),
  signOut: vi.fn(),
  getCurrentUser: vi.fn(),
  getCurrentSession: vi.fn(),
  getSupabaseConfig: vi.fn(() => ({
    url: 'https://test.supabase.co',
    anonKey: 'test-anon-key...',
    isReady: true
  }))
}));

// Mock logger
vi.mock('../utils/logger', () => ({
  logger: {
    log: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    group: vi.fn(),
    groupEnd: vi.fn()
  }
}));

// Mock error monitoring
vi.mock('../lib/errorMonitoring', () => ({
  errorMonitoring: {
    captureException: vi.fn(),
    captureMessage: vi.fn(),
    setUser: vi.fn(),
    addBreadcrumb: vi.fn()
  }
}));

// Mock performance monitoring
vi.mock('../lib/performanceMonitoring', () => ({
  performanceMonitoring: {
    measurePerformance: vi.fn(),
    startTiming: vi.fn(() => vi.fn()),
    getAverageTime: vi.fn(() => 0),
    getMetrics: vi.fn(() => ({})),
    getVitalMetrics: vi.fn(() => ({})),
    getMemoryUsage: vi.fn(() => ({})),
    analyzeBundlePerformance: vi.fn(() => ({})),
    cleanup: vi.fn(),
    isMonitoringEnabled: vi.fn(() => false)
  }
}));

// Mock service worker
Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    register: vi.fn(),
    getRegistration: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  },
  writable: true
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock,
  writable: true
});

// Mock crypto
Object.defineProperty(window, 'crypto', {
  value: {
    subtle: {
      encrypt: vi.fn(),
      decrypt: vi.fn(),
      generateKey: vi.fn(),
      importKey: vi.fn(),
      exportKey: vi.fn()
    },
    getRandomValues: vi.fn((arr) => arr.map(() => Math.floor(Math.random() * 256)))
  },
  writable: true
});

// Mock fetch
global.fetch = vi.fn();

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock performance
Object.defineProperty(window, 'performance', {
  value: {
    now: vi.fn(() => Date.now()),
    getEntriesByType: vi.fn(() => []),
    mark: vi.fn(),
    measure: vi.fn(),
    clearMarks: vi.fn(),
    clearMeasures: vi.fn()
  },
  writable: true
});

// Mock URL
global.URL = class URL {
  constructor(public href: string, public origin?: string) {}
  toString() { return this.href; }
};

// Mock console methods to reduce noise in tests
const originalConsole = { ...console };
beforeEach(() => {
  console.log = vi.fn();
  console.warn = vi.fn();
  console.error = vi.fn();
});

afterEach(() => {
  console.log = originalConsole.log;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
  vi.clearAllMocks();
});

// Global test utilities
declare global {
  interface ViGlobalThis {
    mockFetch: typeof fetch;
  }
  
  var Vi: {
    GlobalThis: ViGlobalThis;
  };
}

// Make fetch mock available globally
globalThis.mockFetch = global.fetch as any;