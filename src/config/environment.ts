// Environment Configuration with enhanced validation
export const ENV = {
  NODE_ENV: import.meta.env.MODE || 'development',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '2.0.0',
  
  // Authentication
  AUTH_PROVIDER: import.meta.env.VITE_AUTH_PROVIDER || 'supabase',
  JWT_SECRET: import.meta.env.VITE_JWT_SECRET,
  SESSION_TIMEOUT: parseInt(import.meta.env.VITE_SESSION_TIMEOUT || '28800000'), // 8 hours
  
  // Database
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  
  // Security
  ENABLE_CSP: import.meta.env.VITE_ENABLE_CSP === 'true',
  SECURE_COOKIES: import.meta.env.VITE_SECURE_COOKIES === 'true',
  
  // Monitoring
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
  ANALYTICS_ID: import.meta.env.VITE_ANALYTICS_ID,
  
  // Feature Flags
  ENABLE_OFFLINE_MODE: import.meta.env.VITE_ENABLE_OFFLINE_MODE === 'true',
  ENABLE_ADVANCED_FEATURES: import.meta.env.VITE_ENABLE_ADVANCED_FEATURES === 'true',
  ENABLE_MULTI_TENANT: import.meta.env.VITE_ENABLE_MULTI_TENANT === 'true',
  
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'), // 30 seconds
  
  // Validation
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
  isTest: import.meta.env.MODE === 'test',
} as const;

// Enhanced environment validation with better error handling
export const validateEnvironment = () => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Required variables for production
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];
  
  // Critical variables that should be present
  const criticalVars = [
    'VITE_AUTH_PROVIDER',
    'VITE_API_BASE_URL'
  ];
  
  // Check required variables
  const missing = requiredVars.filter(varName => !import.meta.env[varName]);
  if (missing.length > 0) {
    if (ENV.isProduction) {
      errors.push(`Missing required environment variables: ${missing.join(', ')}`);
    } else {
      warnings.push(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }
  
  // Check critical variables
  const missingCritical = criticalVars.filter(varName => !import.meta.env[varName]);
  if (missingCritical.length > 0) {
    warnings.push(`Missing critical environment variables: ${missingCritical.join(', ')}`);
  }
  
  // Validate URL formats
  if (ENV.SUPABASE_URL && !isValidUrl(ENV.SUPABASE_URL)) {
    errors.push('VITE_SUPABASE_URL must be a valid URL');
  }
  
  if (ENV.API_BASE_URL && !isValidUrl(ENV.API_BASE_URL) && !ENV.API_BASE_URL.startsWith('/')) {
    errors.push('VITE_API_BASE_URL must be a valid URL or start with /');
  }
  
  // Validate numeric values
  if (ENV.SESSION_TIMEOUT && (isNaN(ENV.SESSION_TIMEOUT) || ENV.SESSION_TIMEOUT <= 0)) {
    errors.push('VITE_SESSION_TIMEOUT must be a positive number');
  }
  
  if (ENV.API_TIMEOUT && (isNaN(ENV.API_TIMEOUT) || ENV.API_TIMEOUT <= 0)) {
    errors.push('VITE_API_TIMEOUT must be a positive number');
  }
  
  // Security warnings
  if (ENV.isProduction && !ENV.ENABLE_CSP) {
    warnings.push('Content Security Policy should be enabled in production');
  }
  
  if (ENV.isProduction && !ENV.SECURE_COOKIES) {
    warnings.push('Secure cookies should be enabled in production');
  }
  
  if (ENV.isProduction && location.protocol !== 'https:') {
    errors.push('Production deployment must use HTTPS');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Helper function to validate URLs
function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

// Runtime environment validation
export const validateRuntimeEnvironment = (): boolean => {
  try {
    const validation = validateEnvironment();
    
    if (!validation.isValid) {
      console.error('Environment validation failed:', validation.errors);
      if (ENV.isProduction) {
        throw new Error(`Environment validation failed: ${validation.errors.join(', ')}`);
      }
    }
    
    if (validation.warnings.length > 0) {
      console.warn('Environment validation warnings:', validation.warnings);
    }
    
    return validation.isValid;
  } catch (error) {
    console.error('Environment validation error:', error);
    return false;
  }
};

// Initialize environment validation
if (ENV.isProduction) {
  validateRuntimeEnvironment();
}