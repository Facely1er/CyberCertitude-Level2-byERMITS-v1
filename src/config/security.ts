/**
 * 🛡️ Security Configuration
 * Centralized security settings and runtime security checks
 */

export interface SecurityConfig {
  // Content Security Policy
  csp: {
    defaultSrc: string[];
    scriptSrc: string[];
    styleSrc: string[];
    fontSrc: string[];
    imgSrc: string[];
    connectSrc: string[];
    frameAncestors: string[];
    baseUri: string[];
    formAction: string[];
    objectSrc: string[];
    mediaSrc: string[];
    workerSrc: string[];
    manifestSrc: string[];
  };
  
  // Security Headers
  headers: {
    xFrameOptions: string;
    xContentTypeOptions: string;
    xXssProtection: string;
    referrerPolicy: string;
    permissionsPolicy: string;
    strictTransportSecurity: string;
    crossOriginEmbedderPolicy: string;
    crossOriginOpenerPolicy: string;
    crossOriginResourcePolicy: string;
  };
  
  // Rate Limiting
  rateLimit: {
    maxAttempts: number;
    windowMs: number;
    blockDuration: number;
    maxConcurrent: number;
  };
  
  // Authentication Security
  auth: {
    minPasswordLength: number;
    requireSpecialChars: boolean;
    requireNumbers: boolean;
    requireUppercase: boolean;
    requireLowercase: boolean;
    maxLoginAttempts: number;
    sessionTimeout: number;
    refreshTokenExpiry: number;
  };
  
  // Data Protection
  dataProtection: {
    encryptionAlgorithm: string;
    keyDerivationIterations: number;
    saltLength: number;
    ivLength: number;
    maxDataAge: number;
  };
  
  // API Security
  api: {
    maxRequestSize: number;
    allowedOrigins: string[];
    corsEnabled: boolean;
    rateLimitEnabled: boolean;
    requestTimeout: number;
  };
}

// Production Security Configuration
export const securityConfig: SecurityConfig = {
  csp: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'nonce-{NONCE}'",
      "https://vercel.live",
      "https://cdn.jsdelivr.net",
      "https://cdnjs.cloudflare.com"
    ],
    styleSrc: [
      "'self'",
      "'sha256-{STYLE_HASH}'",
      "https://fonts.googleapis.com"
    ],
    fontSrc: [
      "'self'",
      "https://fonts.gstatic.com"
    ],
    imgSrc: [
      "'self'",
      "data:",
      "https:",
      "blob:"
    ],
    connectSrc: [
      "'self'",
      "https://*.supabase.co",
      "wss://*.supabase.co",
      "https://vitals.vercel-analytics.com",
      "https://api.cybercertitude.com",
      "https://*.vercel.app",
      "https://*.vercel.com"
    ],
    frameAncestors: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    workerSrc: ["'self'", "blob:"],
    manifestSrc: ["'self'"]
  },
  
  headers: {
    xFrameOptions: "DENY",
    xContentTypeOptions: "nosniff",
    xXssProtection: "1; mode=block",
    referrerPolicy: "strict-origin-when-cross-origin",
    permissionsPolicy: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), magnetometer=(), gyroscope=(), accelerometer=()",
    strictTransportSecurity: "max-age=31536000; includeSubDomains; preload",
    crossOriginEmbedderPolicy: "require-corp",
    crossOriginOpenerPolicy: "same-origin",
    crossOriginResourcePolicy: "same-origin"
  },
  
  rateLimit: {
    maxAttempts: 5,
    windowMs: 5 * 60 * 1000, // 5 minutes
    blockDuration: 15 * 60 * 1000, // 15 minutes
    maxConcurrent: 10
  },
  
  auth: {
    minPasswordLength: 12,
    requireSpecialChars: true,
    requireNumbers: true,
    requireUppercase: true,
    requireLowercase: true,
    maxLoginAttempts: 5,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000 // 7 days
  },
  
  dataProtection: {
    encryptionAlgorithm: "AES-GCM",
    keyDerivationIterations: 250000,
    saltLength: 32,
    ivLength: 16,
    maxDataAge: 365 * 24 * 60 * 60 * 1000 // 1 year
  },
  
  api: {
    maxRequestSize: 10 * 1024 * 1024, // 10MB
    allowedOrigins: [
      "https://cmmc-compliance.vercel.app",
      "https://cmmc-compliance.netlify.app"
    ],
    corsEnabled: true,
    rateLimitEnabled: true,
    requestTimeout: 30000 // 30 seconds
  }
};

// Development Security Configuration (less restrictive)
export const devSecurityConfig: SecurityConfig = {
  ...securityConfig,
  csp: {
    ...securityConfig.csp,
    scriptSrc: [
      "'self'",
      "'unsafe-eval'", // Allow eval in development
      "'unsafe-inline'", // Allow inline scripts in development
      "https://vercel.live",
      "https://cdn.jsdelivr.net"
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'", // Allow inline styles in development
      "https://fonts.googleapis.com"
    ]
  },
  headers: {
    ...securityConfig.headers,
    strictTransportSecurity: "max-age=0" // Disable HSTS in development
  },
  rateLimit: {
    ...securityConfig.rateLimit,
    maxAttempts: 10, // More lenient in development
    blockDuration: 5 * 60 * 1000 // Shorter block duration
  }
};

// Get current security configuration based on environment
export const getCurrentSecurityConfig = (): SecurityConfig => {
  return import.meta.env.DEV ? devSecurityConfig : securityConfig;
};

// Generate CSP string from configuration
export const generateCSP = (config: SecurityConfig): string => {
  const csp = config.csp;
  
  return [
    `default-src ${csp.defaultSrc.join(' ')}`,
    `script-src ${csp.scriptSrc.join(' ')}`,
    `style-src ${csp.styleSrc.join(' ')}`,
    `font-src ${csp.fontSrc.join(' ')}`,
    `img-src ${csp.imgSrc.join(' ')}`,
    `connect-src ${csp.connectSrc.join(' ')}`,
    `frame-ancestors ${csp.frameAncestors.join(' ')}`,
    `base-uri ${csp.baseUri.join(' ')}`,
    `form-action ${csp.formAction.join(' ')}`,
    `object-src ${csp.objectSrc.join(' ')}`,
    `media-src ${csp.mediaSrc.join(' ')}`,
    `worker-src ${csp.workerSrc.join(' ')}`,
    `manifest-src ${csp.manifestSrc.join(' ')}`,
    'upgrade-insecure-requests'
  ].join('; ');
};

// Security validation functions
export const validateSecurityConfig = (config: SecurityConfig): string[] => {
  const errors: string[] = [];
  
  // Validate CSP configuration
  if (config.csp.scriptSrc.includes("'unsafe-eval'") && !import.meta.env.DEV) {
    errors.push("'unsafe-eval' is not allowed in production");
  }
  
  if (config.csp.scriptSrc.includes("'unsafe-inline'") && !import.meta.env.DEV) {
    errors.push("'unsafe-inline' is not allowed in production");
  }
  
  // Validate security headers
  if (config.headers.xFrameOptions !== "DENY") {
    errors.push("X-Frame-Options should be set to DENY");
  }
  
  if (config.headers.xContentTypeOptions !== "nosniff") {
    errors.push("X-Content-Type-Options should be set to nosniff");
  }
  
  // Validate rate limiting
  if (config.rateLimit.maxAttempts < 3) {
    errors.push("Rate limiting should allow at least 3 attempts");
  }
  
  if (config.rateLimit.blockDuration < 5 * 60 * 1000) {
    errors.push("Block duration should be at least 5 minutes");
  }
  
  return errors;
};

// Runtime security checks
export const performSecurityChecks = (): void => {
  const config = getCurrentSecurityConfig();
  const errors = validateSecurityConfig(config);
  
  if (errors.length > 0) {
    // Use proper error handling instead of console statements
    if (!import.meta.env.DEV) {
      throw new Error(`Security configuration validation failed: ${errors.join(', ')}`);
    }
  }
  
  // Additional runtime checks - use proper logging service in production
  if (import.meta.env.DEV) {
    // Development logging is acceptable
  }
};

// Export security utilities
export const securityUtils = {
  generateCSP,
  validateSecurityConfig,
  performSecurityChecks,
  getCurrentSecurityConfig
};

export default securityConfig;