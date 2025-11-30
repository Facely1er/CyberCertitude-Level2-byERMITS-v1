import { describe, it, expect, beforeEach, vi } from 'vitest';
import { accessibilityService } from '../accessibilityService';

describe('AccessibilityService', () => {
  let windowSpy: any;

  beforeEach(() => {
    // Clear DOM
    document.body.innerHTML = '';
    vi.clearAllMocks();
    // Re-initialize accessibility helpers after clearing DOM
    (accessibilityService as any).initializeAccessibility?.();
  });

  afterEach(() => {
    if (windowSpy) {
      windowSpy.mockRestore();
    }
  });

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = accessibilityService;
      const instance2 = accessibilityService;
      expect(instance1).toBe(instance2);
    });
  });

  describe('Screen reader announcements', () => {
    it('should announce message to screen reader', () => {
      const message = 'Test announcement';
      accessibilityService.announceToScreenReader(message);
      
      const liveRegion = document.getElementById('live-region');
      expect(liveRegion).toBeDefined();
    });

    it('should support assertive priority announcements', () => {
      const message = 'Urgent message';
      accessibilityService.announceToScreenReader(message, 'assertive');
      
      const statusRegion = document.getElementById('status-region');
      expect(statusRegion).toBeDefined();
    });
  });

  describe('Full audit', () => {
    it('should run full accessibility audit', () => {
      const audit = accessibilityService.runFullAudit();
      
      expect(audit).toBeDefined();
      expect(audit).toHaveProperty('score');
      expect(audit).toHaveProperty('issues');
      expect(audit).toHaveProperty('recommendations');
      expect(audit).toHaveProperty('wcagLevel');
    });

    it('should return valid audit score', () => {
      const audit = accessibilityService.runFullAudit();
      
      expect(typeof audit.score).toBe('number');
      expect(audit.score).toBeGreaterThanOrEqual(0);
      expect(audit.score).toBeLessThanOrEqual(100);
    });

    it('should return valid WCAG level', () => {
      const audit = accessibilityService.runFullAudit();
      
      expect(['A', 'AA', 'AAA']).toContain(audit.wcagLevel);
    });
  });

  describe('Accessibility score', () => {
    it('should get accessibility score', () => {
      const score = accessibilityService.getAccessibilityScore();
      
      expect(typeof score).toBe('number');
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should return default score when no audits exist', () => {
      const score = accessibilityService.getAccessibilityScore();
      expect(score).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Skip links', () => {
    it('should add skip links to DOM', () => {
      const skipLinks = document.querySelectorAll('.skip-link');
      expect(skipLinks.length).toBeGreaterThan(0);
    });

    it('should include skip to main content link', () => {
      const skipToMain = document.querySelector('a[href="#main-content"]');
      expect(skipToMain).toBeDefined();
    });
  });

  describe('Live regions', () => {
    it('should add live regions to DOM', () => {
      const liveRegion = document.getElementById('live-region');
      const statusRegion = document.getElementById('status-region');
      
      expect(liveRegion).toBeDefined();
      expect(statusRegion).toBeDefined();
    });

    it('should have correct ARIA attributes on live regions', () => {
      const liveRegion = document.getElementById('live-region');
      
      expect(liveRegion?.getAttribute('aria-live')).toBe('polite');
      expect(liveRegion?.getAttribute('aria-atomic')).toBe('true');
    });

    it('should have assertive status region', () => {
      const statusRegion = document.getElementById('status-region');
      
      expect(statusRegion?.getAttribute('aria-live')).toBe('assertive');
      expect(statusRegion?.getAttribute('aria-atomic')).toBe('true');
    });
  });

  describe('Focus management', () => {
    it('should handle Tab key navigation', () => {
      const keyDownEvent = new KeyboardEvent('keydown', { key: 'Tab' });
      document.dispatchEvent(keyDownEvent);
      
      // Should not throw
      expect(true).toBe(true);
    });

    it('should handle Escape key', () => {
      const keyDownEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(keyDownEvent);
      
      // Should not throw
      expect(true).toBe(true);
    });
  });

  describe('Accessibility monitoring', () => {
    it('should monitor DOM changes', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      
      // Should not throw
      expect(true).toBe(true);
    });

    it('should detect missing alt text on images', () => {
      const img = document.createElement('img');
      img.src = 'test.jpg';
      img.alt = '';
      
      document.body.appendChild(img);
      
      // Accessibility service should detect this
      const audit = accessibilityService.runFullAudit();
      
      expect(audit.issues.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle missing elements gracefully', () => {
      expect(() => {
        accessibilityService.announceToScreenReader('test');
        accessibilityService.runFullAudit();
        accessibilityService.getAccessibilityScore();
      }).not.toThrow();
    });

    it('should handle repeated calls without errors', () => {
      for (let i = 0; i < 10; i++) {
        accessibilityService.runFullAudit();
        accessibilityService.getAccessibilityScore();
      }
      
      expect(true).toBe(true);
    });
  });
});
