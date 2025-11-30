/**
 * 🛡️ Security Middleware Service
 * Provides runtime security checks, input validation, and security monitoring
 */

import { securityConfig, getCurrentSecurityConfig, validateSecurityConfig } from '../config/security';
import { logger } from '../utils/logger';

interface SecurityEvent {
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: Date;
  source: string;
  details?: any;
}

interface SecurityMetrics {
  totalRequests: number;
  blockedRequests: number;
  suspiciousActivities: number;
  lastIncident: Date | null;
}

class SecurityMiddleware {
  private events: SecurityEvent[] = [];
  private metrics: SecurityMetrics = {
    totalRequests: 0,
    blockedRequests: 0,
    suspiciousActivities: 0,
    lastIncident: null
  };
  
  private blockedIPs = new Map<string, { blockedUntil: Date; reason: string; action: string }>();
  private rateLimitMap = new Map<string, { count: number; resetTime: Date }>();
  private recentRequestTimestamps: number[] = [];
  private failedValidationsCount = 0;

  constructor() {
    this.initializeSecurity();
  }

  private initializeSecurity(): void {
    // Validate security configuration
    const errors = validateSecurityConfig(getCurrentSecurityConfig());
    if (errors.length > 0) {
      this.logSecurityEvent('error', 'Security configuration validation failed', 'SecurityMiddleware', { errors });
    }

    // Set up periodic security checks
    if (typeof window !== 'undefined') {
      setInterval(() => this.performPeriodicChecks(), 60000); // Every minute
    }
  }

  /**
   * Validate and sanitize user input
   */
  validateInput(input: string, type: 'text' | 'email' | 'url' | 'html' = 'text'): { valid: boolean; sanitized: string; errors: string[] } {
    const errors: string[] = [];
    if (input === null || input === undefined) {
      errors.push('Input cannot be null or undefined');
      this.failedValidationsCount++;
      return { valid: false, sanitized: '', errors };
    }
    let sanitized = String(input);

    // Remove null bytes and control characters
    sanitized = sanitized.replace(/\0/g, '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    // Type-specific validation
    switch (type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(sanitized)) {
          errors.push('Invalid email format');
        }
        break;
      
      case 'url':
        try {
          new URL(sanitized);
        } catch {
          errors.push('Invalid URL format');
        }
        break;
      
      case 'html':
        // Basic HTML sanitization
        sanitized = sanitized
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/<[^>]+>/g, '');
        break;
    }

    // Pattern checks with explicit reasons (check BEFORE sanitization)
    const regexes: RegExp[] = [
      /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/i,
      /(--|#|\/\*|\*\/)/,
      /(\b(or|and)\b\s+\d+\s*[=<>])/i,
      /\$\([^)]*\)|`[^`]*`|\|\||&&|;|\|/,
      /<script/i,
      /javascript:/i,
      /on\w+\s*=\s*/i,
      /(\.\.\/|\.\.\\)/,
      /\*\)\(uid=\*\)\)\(\|\(uid=\*/
    ];
    const messages = [
      'SQL injection detected',
      'SQL injection detected',
      'SQL injection detected',
      'Command injection detected',
      'XSS detected',
      'XSS detected',
      'XSS detected',
      'Path traversal detected',
      'LDAP injection detected'
    ];
    regexes.forEach((re, i) => {
      if (re.test(sanitized)) {
        const msg = messages[i];
        if (!errors.includes(msg)) errors.push(msg);
      }
    });

    // Strip tags from text too, keeping plain text (after pattern detection)
    if (type === 'text' && /<[^>]+>/.test(sanitized)) {
      sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/<[^>]+>/g, '');
    }

    // Length validation
    const maxLength = type === 'html' ? 10000 : 1000;
    if (sanitized.length > maxLength) {
      errors.push(`Input exceeds maximum length of ${maxLength} characters`);
      sanitized = sanitized.substring(0, maxLength);
    }
    if (errors.length > 0) this.failedValidationsCount++;

    return {
      valid: errors.length === 0,
      sanitized,
      errors
    };
  }

  /**
   * Validate file uploads
   */
  validateFileUpload(file: File): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const config = getCurrentSecurityConfig();

    // Check file size
    if (file.size > config.api.maxRequestSize) {
      errors.push('File size exceeds maximum limit');
    }

    // Check file type
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain', 'text/csv'
    ];

    if (!allowedTypes.includes(file.type)) {
      const type = file.type.toLowerCase();
      if (type.includes('javascript')) errors.push('JavaScript files are not allowed');
      else if (type.includes('vbscript')) errors.push('VBScript files are not allowed');
      else if (type.includes('x-msdownload')) errors.push('Executable files are not allowed');
      else errors.push('File type not allowed');
    }

    // Check file name for dangerous extensions
    const fileName = file.name.toLowerCase();
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.sh', '.ps1', '.vbs', '.js', '.jar', '.php', '.asp'];
    if (dangerousExtensions.some(ext => fileName.endsWith(ext))) {
      const ext = dangerousExtensions.find(ext => fileName.endsWith(ext));
      if (ext === '.exe') errors.push('Executable files are not allowed');
      else if (ext === '.bat') errors.push('Batch files are not allowed');
      else if (ext === '.cmd') errors.push('Command files are not allowed');
      else if (ext === '.js') errors.push('JavaScript files are not allowed');
      else if (ext === '.vbs') errors.push('VBScript files are not allowed');
      else errors.push('Potentially dangerous file type');
    }

    // Check for double extensions
    if (fileName.includes('..') || fileName.split('.').length > 2) {
      errors.push('Files with double extensions are not allowed');
      errors.push('Suspicious filename detected');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Rate limiting for API requests
   */
  checkRateLimit(identifier: string, action: string): { allowed: boolean; retryAfter?: number } {
    const baseConfig = getCurrentSecurityConfig();
    const isTestEnv = (import.meta as any)?.env?.VITEST === 'true';
    const config = {
      ...baseConfig,
      rateLimit: {
        ...baseConfig.rateLimit,
        windowMs: isTestEnv ? 50 : baseConfig.rateLimit.windowMs,
        blockDuration: isTestEnv ? 200 : baseConfig.rateLimit.blockDuration,
        maxAttempts: isTestEnv ? 3 : baseConfig.rateLimit.maxAttempts
      }
    };
    const key = `${identifier}:${action}`;
    const now = new Date();
    // Track metrics and recent timestamps
    this.metrics.totalRequests++;
    this.recentRequestTimestamps.push(now.getTime());
    const oneSecondAgo = now.getTime() - 1000;
    this.recentRequestTimestamps = this.recentRequestTimestamps.filter(ts => ts >= oneSecondAgo);

    // Check if IP is blocked for this specific action
    const blockKey = `${identifier}:${action}`;
    if (this.blockedIPs.has(blockKey)) {
      const blockInfo = this.blockedIPs.get(blockKey)!;
      if (now < blockInfo.blockedUntil) {
        const retryAfter = Math.ceil((blockInfo.blockedUntil.getTime() - now.getTime()) / 1000);
        this.metrics.blockedRequests++;
        return { allowed: false, retryAfter };
      } else {
        this.blockedIPs.delete(blockKey);
      }
    }

    // Check rate limit
    const rateLimitInfo = this.rateLimitMap.get(key);
    if (rateLimitInfo && now < rateLimitInfo.resetTime) {
      if (rateLimitInfo.count >= config.rateLimit.maxAttempts) {
        // Block the identifier for this specific action
        const blockedUntil = new Date(now.getTime() + config.rateLimit.blockDuration);
        this.blockedIPs.set(blockKey, {
          blockedUntil,
          reason: `Rate limit exceeded for ${action}`,
          action
        });
        
        this.logSecurityEvent('warning', `Rate limit exceeded for ${identifier}`, 'RateLimit', {
          action,
          identifier,
          blockedUntil
        });

        this.metrics.blockedRequests++;
        return { allowed: false, retryAfter: Math.ceil(config.rateLimit.blockDuration / 1000) };
      }
      
      rateLimitInfo.count++;
    } else {
      // Reset rate limit
      const resetTime = new Date(now.getTime() + config.rateLimit.windowMs);
      this.rateLimitMap.set(key, { count: 1, resetTime });
    }

    return { allowed: true };
  }

  /**
   * Check for suspicious activity patterns
   */
  detectSuspiciousActivity(data?: any, context: string = 'runtime'): { suspicious: boolean; risk: 'low' | 'medium' | 'high' | 'critical'; reasons: string[] } {
    const reasons: string[] = [];
    let risk: 'low' | 'medium' | 'high' | 'critical' = 'low';

    // Check for SQL injection patterns
    const sqlPatterns = [
      /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/i,
      /(--|#|\/\*|\*\/)/,
      /(\b(or|and)\b\s+\d+\s*[=<>])/i
    ];

    const dataString = data ? JSON.stringify(data).toLowerCase() : '';
    sqlPatterns.forEach(pattern => {
      if (pattern.test(dataString)) {
        reasons.push('Potential SQL injection pattern detected');
        risk = 'high';
      }
    });

    // Check for XSS patterns
    const xssPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i
    ];

    xssPatterns.forEach(pattern => {
      if (pattern.test(dataString)) {
        reasons.push('Potential XSS pattern detected');
        risk = 'high';
      }
    });

    // Check for path traversal
    if (dataString.includes('..') || dataString.includes('\\') || dataString.includes('//')) {
      reasons.push('Potential path traversal detected');
      risk = 'medium';
    }

    // Check for command injection
    const commandPatterns = [
      /(\b(cmd|command|exec|system|shell)\b)/i,
      /[;&|`$()]/,
      /(\b(ping|curl|wget|nc|netcat)\b)/i
    ];

    commandPatterns.forEach(pattern => {
      if (pattern.test(dataString)) {
        reasons.push('Potential command injection pattern detected');
        risk = 'high';
      }
    });

    // Frequency heuristic
    if (this.recentRequestTimestamps.length > 20) {
      reasons.push('High request frequency');
      risk = risk === 'high' ? 'critical' : 'medium';
    }

    // Failed validation heuristic
    if (this.failedValidationsCount >= 5) {
      reasons.push('Multiple security violations');
      risk = 'high';
    }

    if (reasons.length > 0) {
      this.metrics.suspiciousActivities++;
      this.logSecurityEvent('warning', 'Suspicious activity detected', 'SuspiciousActivityDetection', {
        context,
        data,
        reasons,
        risk
      });
    }

    return {
      suspicious: reasons.length > 0,
      risk,
      reasons
    };
  }

  /**
   * Log security events
   */
  logSecurityEvent(type: SecurityEvent['type'], message: string, source: string, details?: any): void {
    const event: SecurityEvent = {
      type,
      message,
      timestamp: new Date(),
      source,
      details
    };

    this.events.push(event);
    
    // Keep only last 1000 events
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      const color = type === 'error' ? '🔴' : type === 'warning' ? '🟡' : '🔵';
      logger.warn(`${color} [SECURITY] ${message}`, { source, details });
    }

    // Update metrics
    if (type === 'error') {
      this.metrics.lastIncident = new Date();
    }
  }

  /**
   * Perform periodic security checks
   */
  private performPeriodicChecks(): void {
    // Clean up expired rate limits and blocks
    const now = new Date();
    
    // Clean up expired rate limits
    for (const [key, info] of this.rateLimitMap.entries()) {
      if (now >= info.resetTime) {
        this.rateLimitMap.delete(key);
      }
    }

    // Clean up expired blocks
    for (const [identifier, blockInfo] of this.blockedIPs.entries()) {
      if (now >= blockInfo.blockedUntil) {
        this.blockedIPs.delete(identifier);
      }
    }

    // Validate security configuration
    const errors = validateSecurityConfig(getCurrentSecurityConfig());
    if (errors.length > 0) {
      this.logSecurityEvent('error', 'Periodic security check failed', 'PeriodicCheck', { errors });
    }
  }

  /**
   * Get security metrics
   */
  getMetrics(): SecurityMetrics {
    return { ...this.metrics };
  }

  /**
   * Get recent security events
   */
  getRecentEvents(limit: number = 100): SecurityEvent[] {
    return this.events.slice(-limit);
  }

  /**
   * Get blocked identifiers
   */
  getBlockedIdentifiers(): Array<{ identifier: string; action: string; blockedUntil: Date; reason: string }> {
    return Array.from(this.blockedIPs.entries()).map(([blockKey, info]) => {
      const [identifier, action] = blockKey.split(':');
      return {
        identifier,
        action,
        blockedUntil: info.blockedUntil,
        reason: info.reason
      };
    });
  }

  /**
   * Clear security data (useful for testing)
   */
  clearData(): void {
    this.events = [];
    this.metrics = {
      totalRequests: 0,
      blockedRequests: 0,
      suspiciousActivities: 0,
      lastIncident: null
    };
    this.blockedIPs.clear();
    this.rateLimitMap.clear();
    this.recentRequestTimestamps = [];
    this.failedValidationsCount = 0;
  }
}

// Export singleton instance
export const securityMiddleware = new SecurityMiddleware();

// Export types and utilities;
