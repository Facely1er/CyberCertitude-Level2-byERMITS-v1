interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  blockDurationMs?: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
  blocked?: boolean;
  blockUntil?: number;
}

class RateLimiter {
  private static instance: RateLimiter;
  private limits: Map<string, RateLimitEntry> = new Map();
  private readonly cleanupInterval: number = 60000; // 1 minute

  static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  constructor() {
    // Clean up expired entries periodically
    setInterval(() => this.cleanup(), this.cleanupInterval);
  }

  /**
   * Check if a request is allowed under the rate limit
   * @param key - Unique identifier for the rate limit (e.g., IP, user ID, action type)
   * @param config - Rate limit configuration
   * @returns Object with allowed status and remaining requests
   */
  isAllowed(key: string, config: RateLimitConfig): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
    retryAfter?: number;
  } {
    const now = Date.now();
    const entry = this.limits.get(key);

    // Check if currently blocked
    if (entry?.blocked && entry.blockUntil && now < entry.blockUntil) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
        retryAfter: Math.ceil((entry.blockUntil - now) / 1000)
      };
    }

    // Initialize or reset if window expired
    if (!entry || now >= entry.resetTime) {
      this.limits.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
        blocked: false
      });
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime: now + config.windowMs
      };
    }

    // Check if limit exceeded
    if (entry.count >= config.maxRequests) {
      // Block if configured
      if (config.blockDurationMs) {
        entry.blocked = true;
        entry.blockUntil = now + config.blockDurationMs;
      }
      
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
        retryAfter: config.blockDurationMs 
          ? Math.ceil(config.blockDurationMs / 1000)
          : Math.ceil((entry.resetTime - now) / 1000)
      };
    }

    // Increment and allow
    entry.count++;
    this.limits.set(key, entry);

    return {
      allowed: true,
      remaining: config.maxRequests - entry.count,
      resetTime: entry.resetTime
    };
  }

  /**
   * Reset rate limit for a specific key
   */
  reset(key: string): void {
    this.limits.delete(key);
  }

  /**
   * Get current status for a key
   */
  getStatus(key: string): RateLimitEntry | null {
    return this.limits.get(key) || null;
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now >= entry.resetTime && (!entry.blocked || !entry.blockUntil || now >= entry.blockUntil)) {
        this.limits.delete(key);
      }
    }
  }
}

// Predefined rate limit configurations
export const RATE_LIMITS = {
  // API requests
  API_GENERAL: { maxRequests: 100, windowMs: 60000 }, // 100 requests per minute
  API_AUTH: { maxRequests: 5, windowMs: 60000, blockDurationMs: 300000 }, // 5 auth attempts per minute, block for 5 minutes
  
  // User actions
  FILE_UPLOAD: { maxRequests: 10, windowMs: 60000 }, // 10 file uploads per minute
  REPORT_GENERATION: { maxRequests: 5, windowMs: 300000 }, // 5 reports per 5 minutes
  DATA_EXPORT: { maxRequests: 3, windowMs: 600000 }, // 3 exports per 10 minutes
  
  // Form submissions
  FORM_SUBMISSION: { maxRequests: 20, windowMs: 60000 }, // 20 form submissions per minute
  SEARCH_QUERIES: { maxRequests: 50, windowMs: 60000 }, // 50 searches per minute
  
  // Security-sensitive actions
  PASSWORD_CHANGE: { maxRequests: 3, windowMs: 3600000, blockDurationMs: 1800000 }, // 3 password changes per hour, block for 30 minutes
  PROFILE_UPDATE: { maxRequests: 10, windowMs: 300000 }, // 10 profile updates per 5 minutes
  
  // Bulk operations
  BULK_IMPORT: { maxRequests: 1, windowMs: 300000 }, // 1 bulk import per 5 minutes
  BULK_DELETE: { maxRequests: 2, windowMs: 600000 }, // 2 bulk deletes per 10 minutes
};

// Rate limiting decorator for functions
function rateLimit(key: string, config: RateLimitConfig) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const rateLimiter = RateLimiter.getInstance();

    descriptor.value = function (...args: any[]) {
      const result = rateLimiter.isAllowed(key, config);
      
      if (!result.allowed) {
        const error = new Error(`Rate limit exceeded. Try again in ${result.retryAfter} seconds.`);
        (error as any).rateLimitExceeded = true;
        (error as any).retryAfter = result.retryAfter;
        throw error;
      }

      return method.apply(this, args);
    };
  };
}

// React hook for rate limiting
export function useRateLimit(key: string, config: RateLimitConfig) {
  const rateLimiter = RateLimiter.getInstance();

  return {
    isAllowed: () => rateLimiter.isAllowed(key, config),
    reset: () => rateLimiter.reset(key),
    getStatus: () => rateLimiter.getStatus(key)
  };
}

// Utility functions
export const rateLimiter = RateLimiter.getInstance();

const checkRateLimit = (key: string, config: RateLimitConfig) => {
  return rateLimiter.isAllowed(key, config);
};

const resetRateLimit = (key: string) => {
  rateLimiter.reset(key);
};

// Generate rate limit key for different contexts
export const generateRateLimitKey = {
  user: (userId: string, action: string) => `user:${userId}:${action}`,
  ip: (ip: string, action: string) => `ip:${ip}:${action}`,
  session: (sessionId: string, action: string) => `session:${sessionId}:${action}`,
  global: (action: string) => `global:${action}`,
  fingerprint: (fingerprint: string, action: string) => `fp:${fingerprint}:${action}`
};

// Browser fingerprint for rate limiting
export const getBrowserFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx!.textBaseline = 'top';
  ctx!.font = '14px Arial';
  ctx!.fillText('Browser fingerprint', 2, 2);
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|');
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
};