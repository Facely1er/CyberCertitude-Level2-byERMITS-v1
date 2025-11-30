import { describe, it, expect, vi, beforeEach } from 'vitest';
import { securityMiddleware } from '../securityMiddleware';

describe('SecurityMiddleware Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset any internal state
    if (typeof securityMiddleware.clearData === 'function') {
      securityMiddleware.clearData();
    }
  });

  describe('validateInput', () => {
    it('validates safe input correctly', () => {
      const result = securityMiddleware.validateInput('safe input text');
      
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('safe input text');
      expect(result.errors).toHaveLength(0);
    });

    it('detects SQL injection attempts', () => {
      const result = securityMiddleware.validateInput("'; DROP TABLE users; --");
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('SQL injection detected');
    });

    it('detects XSS attempts', () => {
      const result = securityMiddleware.validateInput('<script>alert("xss")</script>');
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('XSS detected');
    });

    it('detects command injection attempts', () => {
      const result = securityMiddleware.validateInput('$(rm -rf /)');
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Command injection detected');
    });

    it('sanitizes HTML content', () => {
      const result = securityMiddleware.validateInput('<p>Safe content</p>');
      
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('Safe content');
    });

    it('handles empty input', () => {
      const result = securityMiddleware.validateInput('');
      
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('');
      expect(result.errors).toHaveLength(0);
    });

    it('handles null input', () => {
      const result = securityMiddleware.validateInput(null as any);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Input cannot be null or undefined');
    });

    it('handles undefined input', () => {
      const result = securityMiddleware.validateInput(undefined as any);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Input cannot be null or undefined');
    });

    it('detects path traversal attempts', () => {
      const result = securityMiddleware.validateInput('../../../etc/passwd');
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Path traversal detected');
    });

    it('detects LDAP injection attempts', () => {
      const result = securityMiddleware.validateInput('*)(uid=*))(|(uid=*');
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('LDAP injection detected');
    });
  });

  describe('validateFileUpload', () => {
    it('validates safe file uploads', () => {
      const safeFile = new File(['content'], 'document.pdf', { type: 'application/pdf' });
      const result = securityMiddleware.validateFileUpload(safeFile);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('detects executable files', () => {
      const executableFile = new File(['content'], 'malware.exe', { type: 'application/x-msdownload' });
      const result = securityMiddleware.validateFileUpload(executableFile);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Executable files are not allowed');
    });

    it('detects files with double extensions', () => {
      const doubleExtFile = new File(['content'], 'document.pdf.exe', { type: 'application/pdf' });
      const result = securityMiddleware.validateFileUpload(doubleExtFile);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Files with double extensions are not allowed');
    });

    it('validates file size limits', () => {
      // Create a large file (over 10MB)
      const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' });
      const result = securityMiddleware.validateFileUpload(largeFile);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('File size exceeds maximum limit');
    });

    it('detects suspicious file names', () => {
      const suspiciousFile = new File(['content'], '..\\..\\windows\\system32\\config\\sam', { type: 'text/plain' });
      const result = securityMiddleware.validateFileUpload(suspiciousFile);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Suspicious filename detected');
    });

    it('validates allowed file types', () => {
      const allowedTypes = [
        { file: new File(['content'], 'document.pdf', { type: 'application/pdf' }), expected: true },
        { file: new File(['content'], 'document.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }), expected: true },
        { file: new File(['content'], 'document.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), expected: true },
        { file: new File(['content'], 'image.jpg', { type: 'image/jpeg' }), expected: true },
        { file: new File(['content'], 'image.png', { type: 'image/png' }), expected: true }
      ];

      allowedTypes.forEach(({ file, expected }) => {
        const result = securityMiddleware.validateFileUpload(file);
        expect(result.valid).toBe(expected);
      });
    });

    it('rejects dangerous file types', () => {
      const dangerousTypes = [
        { file: new File(['content'], 'script.js', { type: 'application/javascript' }), reason: 'JavaScript files' },
        { file: new File(['content'], 'script.vbs', { type: 'text/vbscript' }), reason: 'VBScript files' },
        { file: new File(['content'], 'script.bat', { type: 'application/x-msdownload' }), reason: 'Batch files' },
        { file: new File(['content'], 'script.cmd', { type: 'application/x-msdownload' }), reason: 'Command files' }
      ];

      dangerousTypes.forEach(({ file, reason }) => {
        const result = securityMiddleware.validateFileUpload(file);
        expect(result.valid).toBe(false);
        expect(result.errors.some(error => error.includes(reason))).toBe(true);
      });
    });
  });

  describe('checkRateLimit', () => {
    it('allows requests within rate limit', () => {
      const result = securityMiddleware.checkRateLimit('test-identifier', 'action');
      
      expect(result.allowed).toBe(true);
      expect(result.retryAfter).toBeUndefined();
    });

    it('blocks requests exceeding rate limit', () => {
      // Make multiple rapid requests to trigger rate limiting
      for (let i = 0; i < 100; i++) {
        securityMiddleware.checkRateLimit('test-identifier', 'action');
      }
      
      const result = securityMiddleware.checkRateLimit('test-identifier', 'action');
      
      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBeGreaterThan(0);
    });

    it('handles different identifiers separately', () => {
      // Exhaust rate limit for one identifier
      for (let i = 0; i < 100; i++) {
        securityMiddleware.checkRateLimit('identifier-1', 'action');
      }
      
      // Check that other identifier is still allowed
      const result = securityMiddleware.checkRateLimit('identifier-2', 'action');
      
      expect(result.allowed).toBe(true);
    });

    it('handles different actions separately', () => {
      // Exhaust rate limit for one action
      for (let i = 0; i < 100; i++) {
        securityMiddleware.checkRateLimit('identifier', 'action-1');
      }
      
      // Check that other action is still allowed
      const result = securityMiddleware.checkRateLimit('identifier', 'action-2');
      
      expect(result.allowed).toBe(true);
    });

    it('resets rate limit after timeout', async () => {
      // Exhaust rate limit
      for (let i = 0; i < 100; i++) {
        securityMiddleware.checkRateLimit('test-identifier', 'action');
      }
      
      // Wait for rate limit to reset (test config has 200ms block duration)
      await new Promise(resolve => setTimeout(resolve, 250));
      
      const result = securityMiddleware.checkRateLimit('test-identifier', 'action');
      
      expect(result.allowed).toBe(true);
    });
  });

  describe('detectSuspiciousActivity', () => {
    it('detects normal activity as safe', () => {
      const result = securityMiddleware.detectSuspiciousActivity();
      
      expect(result.suspicious).toBe(false);
      expect(result.risk).toBe('low');
      expect(result.reasons).toHaveLength(0);
    });

    it('detects rapid successive requests', () => {
      // Make rapid requests
      for (let i = 0; i < 50; i++) {
        securityMiddleware.checkRateLimit('test-identifier', 'action');
      }
      
      const result = securityMiddleware.detectSuspiciousActivity();
      
      expect(result.suspicious).toBe(true);
      expect(result.risk).toBe('medium');
      expect(result.reasons).toContain('High request frequency');
    });

    it('detects multiple failed validations', () => {
      // Make multiple failed validations
      for (let i = 0; i < 10; i++) {
        securityMiddleware.validateInput('<script>alert("xss")</script>');
      }
      
      const result = securityMiddleware.detectSuspiciousActivity();
      
      expect(result.suspicious).toBe(true);
      expect(result.risk).toBe('high');
      expect(result.reasons).toContain('Multiple security violations');
    });

    it('provides risk assessment levels', () => {
      const result = securityMiddleware.detectSuspiciousActivity();
      
      expect(['low', 'medium', 'high', 'critical']).toContain(result.risk);
    });

    it('provides detailed reasons for suspicious activity', () => {
      // Trigger some suspicious activity
      for (let i = 0; i < 20; i++) {
        securityMiddleware.validateInput('../../../etc/passwd');
      }
      
      const result = securityMiddleware.detectSuspiciousActivity();
      
      if (result.suspicious) {
        expect(result.reasons.length).toBeGreaterThan(0);
        expect(typeof result.reasons[0]).toBe('string');
      }
    });
  });

  describe('logSecurityEvent', () => {
    it('logs security events successfully', () => {
      expect(() => {
        securityMiddleware.logSecurityEvent('info', 'Test security event', 'TestComponent');
      }).not.toThrow();
    });

    it('logs different event levels', () => {
      const levels = ['info', 'warning', 'error', 'critical'];
      
      levels.forEach(level => {
        expect(() => {
          securityMiddleware.logSecurityEvent(level as any, `Test ${level} event`, 'TestComponent');
        }).not.toThrow();
      });
    });

    it('logs events with metadata', () => {
      expect(() => {
        securityMiddleware.logSecurityEvent('warning', 'Test event with metadata', 'TestComponent', {
          userId: 'user-123',
          ipAddress: '192.168.1.1',
          userAgent: 'Test Browser'
        });
      }).not.toThrow();
    });

    it('handles missing metadata gracefully', () => {
      expect(() => {
        securityMiddleware.logSecurityEvent('info', 'Test event without metadata', 'TestComponent');
      }).not.toThrow();
    });
  });

  describe('getMetrics', () => {
    it('returns security metrics', () => {
      const metrics = securityMiddleware.getMetrics();
      
      expect(metrics).toHaveProperty('totalRequests');
      expect(metrics).toHaveProperty('blockedRequests');
      expect(metrics).toHaveProperty('suspiciousActivities');
      expect(metrics).toHaveProperty('lastIncident');
      
      expect(typeof metrics.totalRequests).toBe('number');
      expect(typeof metrics.blockedRequests).toBe('number');
      expect(typeof metrics.suspiciousActivities).toBe('number');
    });

    it('tracks request counts accurately', () => {
      // Make some requests
      securityMiddleware.checkRateLimit('test-1', 'action');
      securityMiddleware.checkRateLimit('test-2', 'action');
      
      const metrics = securityMiddleware.getMetrics();
      
      expect(metrics.totalRequests).toBeGreaterThan(0);
    });

    it('tracks blocked requests', () => {
      // Trigger some blocked requests
      for (let i = 0; i < 100; i++) {
        securityMiddleware.checkRateLimit('test-identifier', 'action');
      }
      
      const metrics = securityMiddleware.getMetrics();
      
      expect(metrics.blockedRequests).toBeGreaterThan(0);
    });

    it('tracks suspicious activities', () => {
      // Trigger some suspicious activity by calling detectSuspiciousActivity
      for (let i = 0; i < 10; i++) {
        securityMiddleware.detectSuspiciousActivity('<script>alert("xss")</script>');
      }
      
      const metrics = securityMiddleware.getMetrics();
      
      expect(metrics.suspiciousActivities).toBeGreaterThan(0);
    });
  });

  describe('getRecentEvents', () => {
    it('returns recent security events', () => {
      const events = securityMiddleware.getRecentEvents();
      
      expect(Array.isArray(events)).toBe(true);
    });

    it('returns events with proper structure', () => {
      const events = securityMiddleware.getRecentEvents();
      
      if (events.length > 0) {
        const event = events[0];
        expect(event).toHaveProperty('timestamp');
        expect(event).toHaveProperty('level');
        expect(event).toHaveProperty('message');
        expect(event).toHaveProperty('component');
      }
    });

    it('limits the number of returned events', () => {
      const events = securityMiddleware.getRecentEvents();
      
      // Assuming there's a reasonable limit (e.g., 100 events)
      expect(events.length).toBeLessThanOrEqual(100);
    });
  });

  describe('getBlockedIdentifiers', () => {
    it('returns blocked identifiers', () => {
      const blocked = securityMiddleware.getBlockedIdentifiers();
      
      expect(Array.isArray(blocked)).toBe(true);
    });

    it('returns identifiers with proper structure', () => {
      const blocked = securityMiddleware.getBlockedIdentifiers();
      
      if (blocked.length > 0) {
        const identifier = blocked[0];
        expect(identifier).toHaveProperty('identifier');
        expect(identifier).toHaveProperty('action');
        expect(identifier).toHaveProperty('blockedUntil');
        expect(identifier).toHaveProperty('reason');
      }
    });

    it('includes currently blocked identifiers', () => {
      // Trigger rate limiting to create a blocked identifier
      for (let i = 0; i < 100; i++) {
        securityMiddleware.checkRateLimit('test-identifier', 'action');
      }
      
      const blocked = securityMiddleware.getBlockedIdentifiers();
      
      const blockedEntry = blocked.find(b => b.identifier === 'test-identifier');
      expect(blockedEntry).toBeDefined();
      expect(blockedEntry?.action).toBe('action');
    });
  });

  describe('clearData', () => {
    it('clears security data successfully', () => {
      if (typeof securityMiddleware.clearData === 'function') {
        expect(() => {
          securityMiddleware.clearData();
        }).not.toThrow();
      }
    });

    it('resets metrics after clearing', () => {
      if (typeof securityMiddleware.clearData === 'function') {
        // Make some activity
        securityMiddleware.checkRateLimit('test', 'action');
        securityMiddleware.validateInput('<script>alert("xss")</script>');
        
        // Clear data
        securityMiddleware.clearData();
        
        // Check that metrics are reset
        const metrics = securityMiddleware.getMetrics();
        expect(metrics.totalRequests).toBe(0);
        expect(metrics.blockedRequests).toBe(0);
        expect(metrics.suspiciousActivities).toBe(0);
      }
    });

    it('resets blocked identifiers after clearing', () => {
      if (typeof securityMiddleware.clearData === 'function') {
        // Trigger rate limiting
        for (let i = 0; i < 100; i++) {
          securityMiddleware.checkRateLimit('test', 'action');
        }
        
        // Clear data
        securityMiddleware.clearData();
        
        // Check that blocked identifiers are cleared
        const blocked = securityMiddleware.getBlockedIdentifiers();
        expect(blocked.length).toBe(0);
      }
    });
  });

  describe('Integration Tests', () => {
    it('handles complete security workflow', () => {
      // 1. Start with clean state
      const initialMetrics = securityMiddleware.getMetrics();
      expect(initialMetrics.totalRequests).toBe(0);
      
      // 2. Make normal requests (within rate limit)
      for (let i = 0; i < 3; i++) {
        const result = securityMiddleware.checkRateLimit('user-123', 'login');
        expect(result.allowed).toBe(true);
      }
      
      // 3. Check metrics updated
      const updatedMetrics = securityMiddleware.getMetrics();
      expect(updatedMetrics.totalRequests).toBeGreaterThan(0);
      
      // 4. Validate safe input
      const safeResult = securityMiddleware.validateInput('normal text input');
      expect(safeResult.valid).toBe(true);
      
      // 5. Validate malicious input
      const maliciousResult = securityMiddleware.validateInput('<script>alert("xss")</script>');
      expect(maliciousResult.valid).toBe(false);
      
      // 6. Check suspicious activity detection
      const suspiciousResult = securityMiddleware.detectSuspiciousActivity();
      expect(typeof suspiciousResult.suspicious).toBe('boolean');
      
      // 7. Get final metrics
      const finalMetrics = securityMiddleware.getMetrics();
      expect(finalMetrics.totalRequests).toBeGreaterThan(0);
    });

    it('maintains security state across operations', () => {
      // Make some requests and validations
      securityMiddleware.checkRateLimit('user-456', 'api-call');
      securityMiddleware.validateInput('safe input');
      securityMiddleware.validateInput('../../../etc/passwd');
      
      // Check that state is maintained
      const metrics = securityMiddleware.getMetrics();
      const events = securityMiddleware.getRecentEvents();
      const blocked = securityMiddleware.getBlockedIdentifiers();
      
      expect(metrics.totalRequests).toBeGreaterThan(0);
      expect(Array.isArray(events)).toBe(true);
      expect(Array.isArray(blocked)).toBe(true);
    });
  });
});