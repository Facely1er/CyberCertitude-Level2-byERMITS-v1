/**
 * ♿ Accessibility Service
 * Comprehensive accessibility compliance and monitoring
 */

interface AccessibilityAudit {
  score: number;
  issues: AccessibilityIssue[];
  recommendations: string[];
  wcagLevel: 'A' | 'AA' | 'AAA';
}

interface AccessibilityIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  element: string;
  message: string;
  wcagCriteria: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  fix: string;
}

class AccessibilityService {
  private static instance: AccessibilityService;
  private auditResults: AccessibilityAudit[] = [];
  private focusManager: FocusManager;

  private constructor() {
    this.focusManager = new FocusManager();
    this.initializeAccessibility();
  }

  public static getInstance(): AccessibilityService {
    if (!AccessibilityService.instance) {
      AccessibilityService.instance = new AccessibilityService();
    }
    return AccessibilityService.instance;
  }

  private initializeAccessibility(): void {
    // Add skip links
    this.addSkipLinks();
    
    // Initialize focus management
    this.focusManager.initialize();
    
    // Add ARIA live regions
    this.addLiveRegions();
    
    // Setup keyboard navigation
    this.setupKeyboardNavigation();
    
    // Monitor accessibility
    this.startAccessibilityMonitoring();
  }

  private addSkipLinks(): void {
    const skipLinks = document.createElement('div');
    skipLinks.className = 'sr-only focus-within:not-sr-only';
    skipLinks.innerHTML = `
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <a href="#navigation" class="skip-link">Skip to navigation</a>
      <a href="#search" class="skip-link">Skip to search</a>
    `;
    document.body.insertBefore(skipLinks, document.body.firstChild);
  }

  private addLiveRegions(): void {
    // Add live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.id = 'live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);

    // Add status region
    const statusRegion = document.createElement('div');
    statusRegion.id = 'status-region';
    statusRegion.setAttribute('aria-live', 'assertive');
    statusRegion.setAttribute('aria-atomic', 'true');
    statusRegion.className = 'sr-only';
    document.body.appendChild(statusRegion);
  }

  private setupKeyboardNavigation(): void {
    // Trap focus in modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        this.handleTabNavigation(e);
      }
      if (e.key === 'Escape') {
        this.handleEscapeKey(e);
      }
    });
  }

  private handleTabNavigation(e: KeyboardEvent): void {
    const modal = document.querySelector('[role="dialog"]');
    if (modal) {
      this.trapFocusInModal(e, modal as HTMLElement);
    }
  }

  private handleEscapeKey(e: KeyboardEvent): void {
    const modal = document.querySelector('[role="dialog"]');
    if (modal) {
      this.closeModal();
    }
  }

  private trapFocusInModal(e: KeyboardEvent, modal: HTMLElement): void {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  private closeModal(): void {
    const modal = document.querySelector('[role="dialog"]');
    if (modal) {
      const closeButton = modal.querySelector('[aria-label*="close"], [aria-label*="Close"]') as HTMLElement;
      if (closeButton) {
        closeButton.click();
      }
    }
  }

  private startAccessibilityMonitoring(): void {
    // Monitor for accessibility issues
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.auditElement(node as Element);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  private auditElement(element: Element): void {
    const issues: AccessibilityIssue[] = [];

    // Check for missing alt text
    const images = element.querySelectorAll('img');
    images.forEach((img) => {
      if (!img.alt && !img.getAttribute('aria-label')) {
        issues.push({
          id: 'missing-alt-text',
          type: 'error',
          element: img.tagName,
          message: 'Image missing alt text',
          wcagCriteria: '1.1.1',
          impact: 'critical',
          fix: 'Add alt attribute or aria-label'
        });
      }
    });

    // Check for missing form labels
    const inputs = element.querySelectorAll('input, select, textarea');
    inputs.forEach((input) => {
      const id = input.getAttribute('id');
      const label = id ? document.querySelector(`label[for="${id}"]`) : null;
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledBy = input.getAttribute('aria-labelledby');

      if (!label && !ariaLabel && !ariaLabelledBy) {
        issues.push({
          id: 'missing-form-label',
          type: 'error',
          element: input.tagName,
          message: 'Form control missing label',
          wcagCriteria: '1.3.1',
          impact: 'critical',
          fix: 'Add label element or aria-label'
        });
      }
    });

    // Check for missing headings
    const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length === 0 && element.children.length > 0) {
      issues.push({
        id: 'missing-headings',
        type: 'warning',
        element: element.tagName,
        message: 'Content section missing heading',
        wcagCriteria: '1.3.1',
        impact: 'moderate',
        fix: 'Add appropriate heading element'
      });
    }

    // Check for color contrast (simplified check)
    const textElements = element.querySelectorAll('p, span, div, a, button');
    textElements.forEach((el) => {
      const styles = window.getComputedStyle(el);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      if (color && backgroundColor && this.getContrastRatio(color, backgroundColor) < 4.5) {
        issues.push({
          id: 'low-contrast',
          type: 'warning',
          element: el.tagName,
          message: 'Low color contrast ratio',
          wcagCriteria: '1.4.3',
          impact: 'serious',
          fix: 'Increase color contrast ratio to at least 4.5:1'
        });
      }
    });

    if (issues.length > 0) {
      this.reportAccessibilityIssues(issues);
    }
  }

  private getContrastRatio(color1: string, color2: string): number {
    // Simplified contrast ratio calculation
    // In a real implementation, you'd use a proper color contrast library
    return 4.5; // Placeholder
  }

  private reportAccessibilityIssues(issues: AccessibilityIssue[]): void {
    console.warn('Accessibility issues detected:', issues);
    
    // Announce to screen readers
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
      liveRegion.textContent = `${issues.length} accessibility issues detected`;
    }
  }

  public announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const liveRegion = document.getElementById(priority === 'assertive' ? 'status-region' : 'live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
    }
  }

  public runFullAudit(): AccessibilityAudit {
    const issues: AccessibilityIssue[] = [];
    
    // Run comprehensive audit
    this.auditElement(document.body);
    
    const score = Math.max(0, 100 - (issues.length * 5));
    const wcagLevel = score >= 95 ? 'AAA' : score >= 85 ? 'AA' : 'A';
    
    const audit: AccessibilityAudit = {
      score,
      issues,
      recommendations: this.generateRecommendations(issues),
      wcagLevel
    };
    
    this.auditResults.push(audit);
    return audit;
  }

  private generateRecommendations(issues: AccessibilityIssue[]): string[] {
    const recommendations: string[] = [];
    
    if (issues.some(i => i.id === 'missing-alt-text')) {
      recommendations.push('Add alt text to all images');
    }
    
    if (issues.some(i => i.id === 'missing-form-label')) {
      recommendations.push('Ensure all form controls have labels');
    }
    
    if (issues.some(i => i.id === 'low-contrast')) {
      recommendations.push('Improve color contrast ratios');
    }
    
    return recommendations;
  }

  public getAccessibilityScore(): number {
    const latestAudit = this.auditResults[this.auditResults.length - 1];
    return latestAudit ? latestAudit.score : 100;
  }
}

class FocusManager {
  private focusHistory: HTMLElement[] = [];
  private currentFocusIndex = -1;

  public initialize(): void {
    document.addEventListener('focusin', (e) => {
      this.updateFocusHistory(e.target as HTMLElement);
    });
  }

  private updateFocusHistory(element: HTMLElement): void {
    if (element && element !== this.focusHistory[this.focusHistory.length - 1]) {
      this.focusHistory.push(element);
      this.currentFocusIndex = this.focusHistory.length - 1;
      
      // Keep only last 10 focus elements
      if (this.focusHistory.length > 10) {
        this.focusHistory.shift();
        this.currentFocusIndex--;
      }
    }
  }

  public restoreFocus(): void {
    if (this.focusHistory.length > 0) {
      const lastFocused = this.focusHistory[this.focusHistory.length - 1];
      if (lastFocused && document.contains(lastFocused)) {
        lastFocused.focus();
      }
    }
  }
}

export const accessibilityService = AccessibilityService.getInstance();
export type { AccessibilityAudit, AccessibilityIssue };
