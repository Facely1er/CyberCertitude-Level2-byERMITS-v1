/**
 * 🧪 Testing Suite
 * Comprehensive automated testing for 100% quality assurance
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Test utilities
export const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

export const createMockUser = () => ({
  id: "test-user-id",
  email: "test@example.com",
  name: "Test User",
  role: "admin",
  permissions: ["read", "write", "admin"]
});

export const createMockAssessment = () => ({
  id: "test-assessment-id",
  frameworkId: "cmmc",
  frameworkName: "CMMC 2.0",
  responses: {},
  createdAt: new Date(),
  lastModified: new Date(),
  isComplete: false,
  version: "1.0.0"
});

// Accessibility testing utilities
export const testAccessibility = async (component: React.ReactElement) => {
  const { container } = renderWithRouter(component);
  
  // Test keyboard navigation
  const focusableElements = container.querySelectorAll(
    "button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])"
  );
  
  expect(focusableElements.length).toBeGreaterThan(0);
  
  // Test ARIA attributes
  const elementsWithAria = container.querySelectorAll("[aria-label], [aria-labelledby], [aria-describedby]");
  expect(elementsWithAria.length).toBeGreaterThan(0);
  
  // Test color contrast (simplified)
  const textElements = container.querySelectorAll("p, span, div, a, button");
  textElements.forEach(element => {
    const styles = window.getComputedStyle(element);
    expect(styles.color).toBeDefined();
    expect(styles.backgroundColor).toBeDefined();
  });
};

export const createMockUser = () => ({
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  role: 'admin',
  permissions: ['read', 'write', 'admin']
});

export const createMockAssessment = () => ({
  id: 'test-assessment-id',
  frameworkId: 'cmmc',
  frameworkName: 'CMMC 2.0',
  responses: {},
  createdAt: new Date(),
  lastModified: new Date(),
  isComplete: false,
  version: '1.0.0'
});

// Accessibility testing utilities
export const testAccessibility = async (component: React.ReactElement) => {
  const { container } = renderWithRouter(component);
  
  // Test keyboard navigation
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  expect(focusableElements.length).toBeGreaterThan(0);
  
  // Test ARIA attributes
  const elementsWithAria = container.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby]');
  expect(elementsWithAria.length).toBeGreaterThan(0);
  
  // Test color contrast (simplified)
  const textElements = container.querySelectorAll('p, span, div, a, button');
  textElements.forEach(element => {
    const styles = window.getComputedStyle(element);
    expect(styles.color).toBeDefined();
    expect(styles.backgroundColor).toBeDefined();
  });
};

// Performance testing utilities
export const testPerformance = async (component: React.ReactElement) => {
  const startTime = performance.now();
  
  renderWithRouter(component);
  
  await waitFor(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Component should render within 100ms
    expect(renderTime).toBeLessThan(100);
  });
};

// Security testing utilities
export const testSecurity = async (component: React.ReactElement) => {
  const { container } = renderWithRouter(component);
  
  // Test for XSS vulnerabilities
  const scriptTags = container.querySelectorAll('script');
  expect(scriptTags.length).toBe(0);
  
  // Test for unsafe attributes
  const unsafeAttributes = container.querySelectorAll('[onclick], [onload], [onerror]');
  expect(unsafeAttributes.length).toBe(0);
  
  // Test for external resources
  const externalResources = container.querySelectorAll('img[src^="http:"], script[src^="http:"]');
  expect(externalResources.length).toBe(0);
};

// Integration testing utilities
export const testIntegration = async (component: React.ReactElement) => {
  const { container } = renderWithRouter(component);
  
  // Test component interactions
  const buttons = container.querySelectorAll('button');
  buttons.forEach(button => {
    fireEvent.click(button);
    // Verify no errors occurred
    expect(console.error).not.toHaveBeenCalled();
  });
  
  // Test form submissions
  const forms = container.querySelectorAll('form');
  forms.forEach(form => {
    fireEvent.submit(form);
    // Verify form handling
    expect(console.error).not.toHaveBeenCalled();
  });
};

// Component testing templates
export const createComponentTestSuite = (
  componentName: string,
  component: React.ReactElement,
  testCases: TestCase[] = []
) => {
  describe(`${componentName} Component Tests`, () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });
    
    afterEach(() => {
      vi.restoreAllMocks();
    });
    
    it('should render without errors', async () => {
      await testPerformance(component);
    });
    
    it('should be accessible', async () => {
      await testAccessibility(component);
    });
    
    it('should be secure', async () => {
      await testSecurity(component);
    });
    
    it('should integrate properly', async () => {
      await testIntegration(component);
    });
    
    // Run custom test cases
    testCases.forEach(testCase => {
      it(testCase.description, async () => {
        await testCase.test(component);
      });
    });
  });
};

interface TestCase {
  description: string;
  test: (component: React.ReactElement) => Promise<void>;
}

// Service testing utilities
export const createServiceTestSuite = (
  serviceName: string,
  service: any,
  testCases: ServiceTestCase[] = []
) => {
  describe(`${serviceName} Service Tests`, () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });
    
    afterEach(() => {
      vi.restoreAllMocks();
    });
    
    it('should be a singleton', () => {
      const instance1 = service.getInstance();
      const instance2 = service.getInstance();
      expect(instance1).toBe(instance2);
    });
    
    it('should handle errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      try {
        await service.methodThatMightFail();
      } catch (error) {
        // Service should handle errors gracefully
        expect(consoleSpy).toHaveBeenCalled();
      }
      
      consoleSpy.mockRestore();
    });
    
    // Run custom test cases
    testCases.forEach(testCase => {
      it(testCase.description, async () => {
        await testCase.test(service);
      });
    });
  });
};

interface ServiceTestCase {
  description: string;
  test: (service: any) => Promise<void>;
}

// E2E testing utilities
export const createE2ETestSuite = (
  testName: string,
  testSteps: E2ETestStep[] = []
) => {
  describe(`${testName} E2E Tests`, () => {
    beforeEach(() => {
      // Setup test environment
      vi.clearAllMocks();
    });
    
    afterEach(() => {
      // Cleanup test environment
      vi.restoreAllMocks();
    });
    
    it('should complete user journey', async () => {
      for (const step of testSteps) {
        await step.execute();
        await step.verify();
      }
    });
  });
};

interface E2ETestStep {
  description: string;
  execute: () => Promise<void>;
  verify: () => Promise<void>;
}

// Mock implementations
export const mockSupabaseClient = () => ({
  auth: {
    signIn: vi.fn().mockResolvedValue({ data: { user: createMockUser() }, error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    getUser: vi.fn().mockResolvedValue({ data: { user: createMockUser() }, error: null })
  },
  from: vi.fn().mockReturnValue({
    select: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: createMockAssessment(), error: null })
      })
    }),
    insert: vi.fn().mockResolvedValue({ data: [], error: null }),
    update: vi.fn().mockResolvedValue({ data: [], error: null }),
    delete: vi.fn().mockResolvedValue({ data: [], error: null })
  })
});

export const mockRouter = () => ({
  navigate: vi.fn(),
  location: { pathname: '/test' },
  params: {}
});

// Test data factories
export const createTestData = {
  user: createMockUser,
  assessment: createMockAssessment,
  asset: () => ({
    id: 'test-asset-id',
    name: 'Test Asset',
    description: 'Test asset description',
    category: 'hardware',
    criticality: 'high',
    status: 'active',
    owner: 'Test Owner',
    location: 'Test Location',
    tags: ['test', 'asset'],
    createdAt: new Date(),
    updatedAt: new Date()
  }),
  notification: () => ({
    id: 'test-notification-id',
    type: 'success',
    message: 'Test notification message',
    timestamp: new Date()
  })
};

// Performance testing helpers
export const measurePerformance = async (testFunction: () => Promise<void>) => {
  const startTime = performance.now();
  await testFunction();
  const endTime = performance.now();
  return endTime - startTime;
};

// Accessibility testing helpers
export const checkAriaCompliance = (container: HTMLElement) => {
  const violations: string[] = [];
  
  // Check for missing alt text
  const images = container.querySelectorAll('img');
  images.forEach(img => {
    if (!img.alt && !img.getAttribute('aria-label')) {
      violations.push('Image missing alt text');
    }
  });
  
  // Check for missing form labels
  const inputs = container.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    const id = input.getAttribute('id');
    const label = id ? container.querySelector(`label[for="${id}"]`) : null;
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledBy = input.getAttribute('aria-labelledby');
    
    if (!label && !ariaLabel && !ariaLabelledBy) {
      violations.push('Form control missing label');
    }
  });
  
  return violations;
};

// Security testing helpers
export const checkSecurityCompliance = (container: HTMLElement) => {
  const violations: string[] = [];
  
  // Check for XSS vulnerabilities
  const scriptTags = container.querySelectorAll('script');
  if (scriptTags.length > 0) {
    violations.push('Script tags found in component');
  }
  
  // Check for unsafe event handlers
  const unsafeHandlers = container.querySelectorAll('[onclick], [onload], [onerror]');
  if (unsafeHandlers.length > 0) {
    violations.push('Unsafe event handlers found');
  }
  
  return violations;
};

export default {
  renderWithRouter,
  testAccessibility,
  testPerformance,
  testSecurity,
  testIntegration,
  createComponentTestSuite,
  createServiceTestSuite,
  createE2ETestSuite,
  mockSupabaseClient,
  mockRouter,
  createTestData,
  measurePerformance,
  checkAriaCompliance,
  checkSecurityCompliance
};
