# 🧪 Testing Documentation - CMMC Level 1 Compliance Platform

## Overview

This document provides comprehensive testing documentation for the CMMC Level 1 Compliance Platform, including testing strategies, procedures, and guidelines.

## Table of Contents

- [Testing Strategy](#testing-strategy)
- [Test Environment Setup](#test-environment-setup)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [End-to-End Testing](#end-to-end-testing)
- [Security Testing](#security-testing)
- [Performance Testing](#performance-testing)
- [Accessibility Testing](#accessibility-testing)
- [Test Automation](#test-automation)
- [Test Data Management](#test-data-management)
- [CI/CD Testing](#cicd-testing)
- [Test Reporting](#test-reporting)

---

## Testing Strategy

### Testing Pyramid

```
                    /\
                   /  \
                  / E2E \     ← Few, High-level
                 /______\
                /        \
               /Integration\  ← Some, Medium-level
              /____________\
             /              \
            /    Unit Tests   \  ← Many, Low-level
           /__________________\
```

### Testing Levels

1. **Unit Tests (70%)**
   - Component testing
   - Function testing
   - Service testing
   - Hook testing

2. **Integration Tests (20%)**
   - API integration
   - Database integration
   - Service integration
   - Component integration

3. **End-to-End Tests (10%)**
   - User workflows
   - Complete user journeys
   - Cross-browser testing
   - Performance testing

### Testing Types

| Test Type | Coverage | Frequency | Tools |
|-----------|----------|-----------|-------|
| Unit | 90%+ | Every commit | Vitest, Jest |
| Integration | 80%+ | Every PR | Vitest, Supertest |
| E2E | Critical paths | Daily | Playwright, Cypress |
| Security | All endpoints | Weekly | OWASP ZAP, Snyk |
| Performance | Key workflows | Weekly | Lighthouse, K6 |
| Accessibility | All pages | Every PR | axe-core, WAVE |

---

## Test Environment Setup

### Prerequisites

```bash
# Node.js version
node --version  # v18.0.0 or higher

# Package manager
npm --version   # v8.0.0 or higher

# Database
# PostgreSQL 14+ or Supabase
```

### Environment Configuration

#### Test Environment Variables

```env
# .env.test
NODE_ENV=test
VITE_API_BASE_URL=http://localhost:3001/api
VITE_SUPABASE_URL=https://test-project.supabase.co
VITE_SUPABASE_ANON_KEY=test-anon-key
VITE_TEST_MODE=true
VITE_DISABLE_ANALYTICS=true
```

#### Test Database Setup

```bash
# Create test database
createdb cmmc_test_db

# Run migrations
npm run db:migrate:test

# Seed test data
npm run db:seed:test
```

### Test Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:run": "vitest run",
    "test:watch": "vitest --watch",
    "test:unit": "vitest --run unit",
    "test:integration": "vitest --run integration",
    "test:e2e": "playwright test",
    "test:security": "vitest run --config vitest.security.config.ts",
    "test:performance": "lighthouse-ci autorun",
    "test:a11y": "axe-core --tags wcag2a,wcag2aa"
  }
}
```

---

## Unit Testing

### Testing Framework

**Primary**: Vitest (Vite-native testing)
**Assertions**: Vitest built-in assertions
**Mocking**: Vitest mocking utilities
**Coverage**: c8 (V8 coverage)

### Component Testing

#### Example: AssessmentView Component

```typescript
// src/components/AssessmentView.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AssessmentView } from './AssessmentView';

describe('AssessmentView', () => {
  const mockProps = {
    controlId: 'AC.3.1.1',
    controlTitle: 'Access Control',
    priority: 'HIGH' as const,
    estimatedTime: '2-4 weeks',
    question: 'Test question?',
    description: 'Test description',
    implementationGuidance: 'Test guidance',
    evidenceRequired: ['Policy', 'Procedure'],
    onStatusChange: vi.fn(),
    initialStatus: 'not-implemented' as const
  };

  it('renders control information correctly', () => {
    render(<AssessmentView {...mockProps} />);
    
    expect(screen.getByText('AC.3.1.1')).toBeInTheDocument();
    expect(screen.getByText('Access Control')).toBeInTheDocument();
    expect(screen.getByText('HIGH')).toBeInTheDocument();
  });

  it('calls onStatusChange when status is updated', () => {
    render(<AssessmentView {...mockProps} />);
    
    const implementedButton = screen.getByText('Fully Implemented');
    fireEvent.click(implementedButton);
    
    expect(mockProps.onStatusChange).toHaveBeenCalledWith('implemented');
  });

  it('displays evidence requirements', () => {
    render(<AssessmentView {...mockProps} />);
    
    expect(screen.getByText('Policy')).toBeInTheDocument();
    expect(screen.getByText('Procedure')).toBeInTheDocument();
  });
});
```

### Service Testing

#### Example: AuthService

```typescript
// src/services/authService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from './authService';

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn()
    }
  }))
}));

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  it('should login with valid credentials', async () => {
    const mockResponse = {
      data: { user: { id: '1', email: 'test@example.com' } },
      error: null
    };

    vi.mocked(authService.supabase.auth.signInWithPassword)
      .mockResolvedValue(mockResponse);

    const result = await authService.login('test@example.com', 'password');
    
    expect(result.success).toBe(true);
    expect(result.data.user.email).toBe('test@example.com');
  });

  it('should handle login errors', async () => {
    const mockError = { message: 'Invalid credentials' };
    
    vi.mocked(authService.supabase.auth.signInWithPassword)
      .mockResolvedValue({ data: null, error: mockError });

    const result = await authService.login('test@example.com', 'wrong');
    
    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid credentials');
  });
});
```

### Hook Testing

#### Example: useAuth Hook

```typescript
// src/hooks/useAuth.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useAuth } from './useAuth';

describe('useAuth', () => {
  it('should initialize with no user', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should login user successfully', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });
    
    expect(result.current.user).toBeTruthy();
    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

---

## Integration Testing

### API Integration Tests

#### Example: Assessment API

```typescript
// tests/integration/assessment.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { AssessmentApiService } from '../../src/services/assessmentApiService';
import { setupTestDatabase, cleanupTestDatabase } from '../helpers/database';

describe('Assessment API Integration', () => {
  let assessmentService: AssessmentApiService;
  let testUserId: string;

  beforeAll(async () => {
    await setupTestDatabase();
    assessmentService = new AssessmentApiService();
    testUserId = await createTestUser();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  it('should create assessment', async () => {
    const assessmentData = {
      name: 'Test Assessment',
      description: 'Test Description',
      organizationId: testUserId
    };

    const result = await assessmentService.createAssessment(assessmentData);
    
    expect(result.success).toBe(true);
    expect(result.data.name).toBe('Test Assessment');
    expect(result.data.id).toBeDefined();
  });

  it('should retrieve assessment by ID', async () => {
    const assessment = await assessmentService.createAssessment({
      name: 'Test Assessment',
      description: 'Test Description',
      organizationId: testUserId
    });

    const result = await assessmentService.getAssessment(assessment.data.id);
    
    expect(result.success).toBe(true);
    expect(result.data.name).toBe('Test Assessment');
  });

  it('should update assessment', async () => {
    const assessment = await assessmentService.createAssessment({
      name: 'Test Assessment',
      description: 'Test Description',
      organizationId: testUserId
    });

    const updateData = { name: 'Updated Assessment' };
    const result = await assessmentService.updateAssessment(
      assessment.data.id, 
      updateData
    );
    
    expect(result.success).toBe(true);
    expect(result.data.name).toBe('Updated Assessment');
  });
});
```

### Database Integration Tests

#### Example: Database Operations

```typescript
// tests/integration/database.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { DatabaseService } from '../../src/services/databaseService';
import { setupTestDatabase, cleanupTestDatabase } from '../helpers/database';

describe('Database Integration', () => {
  let dbService: DatabaseService;

  beforeAll(async () => {
    await setupTestDatabase();
    dbService = new DatabaseService();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  it('should create and retrieve user profile', async () => {
    const profileData = {
      id: 'test-user-1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'compliance_officer'
    };

    // Create profile
    await dbService.createProfile(profileData);
    
    // Retrieve profile
    const profile = await dbService.getProfile('test-user-1');
    
    expect(profile).toBeDefined();
    expect(profile.email).toBe('test@example.com');
    expect(profile.role).toBe('compliance_officer');
  });

  it('should handle database transactions', async () => {
    const assessmentData = {
      id: 'test-assessment-1',
      name: 'Test Assessment',
      organizationId: 'test-org-1'
    };

    const controlData = {
      id: 'AC.3.1.1',
      assessmentId: 'test-assessment-1',
      status: 'implemented'
    };

    // Test transaction
    await dbService.transaction(async (tx) => {
      await tx.createAssessment(assessmentData);
      await tx.createControl(controlData);
    });

    // Verify both records exist
    const assessment = await dbService.getAssessment('test-assessment-1');
    const control = await dbService.getControl('AC.3.1.1');
    
    expect(assessment).toBeDefined();
    expect(control).toBeDefined();
  });
});
```

---

## End-to-End Testing

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    }
  ],
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI
  }
});
```

### E2E Test Examples

#### Example: Complete Assessment Workflow

```typescript
// tests/e2e/assessment-workflow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Assessment Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should complete full assessment workflow', async ({ page }) => {
    // Navigate to assessments
    await page.click('[data-testid="assessments-link"]');
    await expect(page).toHaveURL('/assessments');

    // Create new assessment
    await page.click('[data-testid="create-assessment-button"]');
    await page.fill('[data-testid="assessment-name"]', 'E2E Test Assessment');
    await page.fill('[data-testid="assessment-description"]', 'End-to-end test assessment');
    await page.click('[data-testid="save-assessment"]');

    // Verify assessment created
    await expect(page.locator('[data-testid="assessment-list"]')).toContainText('E2E Test Assessment');

    // Start assessment
    await page.click('[data-testid="start-assessment"]');
    await expect(page).toHaveURL(/\/assessment\/\d+/);

    // Complete first control
    await page.click('[data-testid="control-AC-3-1-1"]');
    await page.selectOption('[data-testid="status-select"]', 'implemented');
    await page.fill('[data-testid="notes"]', 'E2E test implementation notes');
    await page.click('[data-testid="save-control"]');

    // Verify control saved
    await expect(page.locator('[data-testid="control-status"]')).toHaveText('Implemented');

    // Upload evidence
    await page.click('[data-testid="upload-evidence"]');
    await page.setInputFiles('[data-testid="file-input"]', 'tests/fixtures/test-document.pdf');
    await page.fill('[data-testid="evidence-title"]', 'Test Evidence');
    await page.click('[data-testid="upload-button"]');

    // Verify evidence uploaded
    await expect(page.locator('[data-testid="evidence-list"]')).toContainText('Test Evidence');

    // Complete assessment
    await page.click('[data-testid="complete-assessment"]');
    await page.click('[data-testid="confirm-complete"]');

    // Verify completion
    await expect(page.locator('[data-testid="assessment-status"]')).toHaveText('Completed');
  });

  test('should handle assessment errors gracefully', async ({ page }) => {
    // Test network error handling
    await page.route('**/api/assessments', route => route.abort());
    
    await page.click('[data-testid="assessments-link"]');
    await page.click('[data-testid="create-assessment-button"]');
    
    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });
});
```

#### Example: User Authentication Flow

```typescript
// tests/e2e/auth-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should handle invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('[data-testid="email"]', 'invalid@example.com');
    await page.fill('[data-testid="password"]', 'wrongpassword');
    await page.click('[data-testid="login-button"]');
    
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid credentials');
    await expect(page).toHaveURL('/login');
  });

  test('should setup MFA', async ({ page }) => {
    // Login as admin user
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'admin@example.com');
    await page.fill('[data-testid="password"]', 'admin123');
    await page.click('[data-testid="login-button"]');
    
    // Navigate to MFA setup
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="security-settings"]');
    await page.click('[data-testid="setup-mfa"]');
    
    // Verify MFA setup page
    await expect(page.locator('[data-testid="mfa-setup"]')).toBeVisible();
    await expect(page.locator('[data-testid="qr-code"]')).toBeVisible();
  });
});
```

---

## Security Testing

### OWASP ZAP Integration

```bash
# Install OWASP ZAP
npm install -g @zaproxy/zap-cli

# Run security scan
zap-baseline.py -t https://your-app.com -r security-report.html
```

### Security Test Suite

```typescript
// tests/security/security.test.ts
import { describe, it, expect } from 'vitest';
import { SecurityTestSuite } from '../helpers/securityTestSuite';

describe('Security Tests', () => {
  let securitySuite: SecurityTestSuite;

  beforeEach(() => {
    securitySuite = new SecurityTestSuite();
  });

  it('should prevent SQL injection', async () => {
    const maliciousInput = "'; DROP TABLE users; --";
    
    const result = await securitySuite.testSqlInjection(maliciousInput);
    
    expect(result.vulnerable).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should prevent XSS attacks', async () => {
    const maliciousScript = '<script>alert("XSS")</script>';
    
    const result = await securitySuite.testXSS(maliciousScript);
    
    expect(result.sanitized).toBe(true);
    expect(result.output).not.toContain('<script>');
  });

  it('should enforce authentication', async () => {
    const protectedEndpoint = '/api/assessments';
    
    const result = await securitySuite.testAuthentication(protectedEndpoint);
    
    expect(result.requiresAuth).toBe(true);
    expect(result.unauthorizedResponse).toBe(401);
  });

  it('should validate file uploads', async () => {
    const maliciousFile = {
      name: 'malware.exe',
      content: 'malicious content',
      mimeType: 'application/x-executable'
    };
    
    const result = await securitySuite.testFileUpload(maliciousFile);
    
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('Invalid file type');
  });
});
```

### Authentication Security Tests

```typescript
// tests/security/auth-security.test.ts
import { describe, it, expect } from 'vitest';
import { AuthSecurityTester } from '../helpers/authSecurityTester';

describe('Authentication Security', () => {
  let authTester: AuthSecurityTester;

  beforeEach(() => {
    authTester = new AuthSecurityTester();
  });

  it('should enforce password complexity', async () => {
    const weakPasswords = ['123', 'password', 'abc123'];
    
    for (const password of weakPasswords) {
      const result = await authTester.testPasswordStrength(password);
      expect(result.valid).toBe(false);
    }
  });

  it('should implement rate limiting', async () => {
    const result = await authTester.testRateLimiting();
    
    expect(result.limited).toBe(true);
    expect(result.limit).toBe(5);
    expect(result.window).toBe(60000); // 1 minute
  });

  it('should handle session management securely', async () => {
    const result = await authTester.testSessionManagement();
    
    expect(result.secure).toBe(true);
    expect(result.httpOnly).toBe(true);
    expect(result.secure).toBe(true);
    expect(result.sameSite).toBe('strict');
  });

  it('should implement proper MFA', async () => {
    const result = await authTester.testMFAImplementation();
    
    expect(result.required).toBe(true);
    expect(result.methods).toContain('totp');
    expect(result.methods).toContain('email');
    expect(result.backupCodes).toBe(true);
  });
});
```

---

## Performance Testing

### Lighthouse CI Configuration

```javascript
// lighthouse.config.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:4173'],
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
```

### Performance Test Suite

```typescript
// tests/performance/performance.test.ts
import { describe, it, expect } from 'vitest';
import { PerformanceTester } from '../helpers/performanceTester';

describe('Performance Tests', () => {
  let perfTester: PerformanceTester;

  beforeEach(() => {
    perfTester = new PerformanceTester();
  });

  it('should load dashboard within 2 seconds', async () => {
    const result = await perfTester.measurePageLoad('/dashboard');
    
    expect(result.loadTime).toBeLessThan(2000);
    expect(result.firstContentfulPaint).toBeLessThan(1500);
    expect(result.largestContentfulPaint).toBeLessThan(2500);
  });

  it('should handle large datasets efficiently', async () => {
    const largeDataset = perfTester.generateLargeDataset(10000);
    
    const result = await perfTester.measureDataProcessing(largeDataset);
    
    expect(result.processingTime).toBeLessThan(1000);
    expect(result.memoryUsage).toBeLessThan(100 * 1024 * 1024); // 100MB
  });

  it('should maintain performance under load', async () => {
    const concurrentUsers = 100;
    
    const result = await perfTester.loadTest(concurrentUsers);
    
    expect(result.averageResponseTime).toBeLessThan(500);
    expect(result.errorRate).toBeLessThan(0.01);
    expect(result.throughput).toBeGreaterThan(50);
  });
});
```

### Bundle Size Testing

```typescript
// tests/performance/bundle-size.test.ts
import { describe, it, expect } from 'vitest';
import { BundleAnalyzer } from '../helpers/bundleAnalyzer';

describe('Bundle Size Tests', () => {
  let bundleAnalyzer: BundleAnalyzer;

  beforeEach(() => {
    bundleAnalyzer = new BundleAnalyzer();
  });

  it('should have reasonable bundle size', async () => {
    const analysis = await bundleAnalyzer.analyzeBundle();
    
    expect(analysis.totalSize).toBeLessThan(1024 * 1024); // 1MB
    expect(analysis.gzipSize).toBeLessThan(512 * 1024); // 512KB
  });

  it('should not have duplicate dependencies', async () => {
    const analysis = await bundleAnalyzer.analyzeBundle();
    
    expect(analysis.duplicates).toHaveLength(0);
  });

  it('should have optimized chunks', async () => {
    const analysis = await bundleAnalyzer.analyzeBundle();
    
    expect(analysis.chunks).toHaveLength(10); // Expected number of chunks
    expect(analysis.largestChunk).toBeLessThan(200 * 1024); // 200KB
  });
});
```

---

## Accessibility Testing

### axe-core Integration

```typescript
// tests/accessibility/a11y.test.ts
import { describe, it, expect } from 'vitest';
import { injectAxe, checkA11y } from 'axe-playwright';
import { test as base } from '@playwright/test';

const test = base.extend({
  page: async ({ page }, use) => {
    await injectAxe(page);
    await use(page);
  }
});

describe('Accessibility Tests', () => {
  test('should be accessible on dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: { html: true }
    });
  });

  test('should be accessible on assessment page', async ({ page }) => {
    await page.goto('/assessment/1');
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: { html: true }
    });
  });

  test('should be accessible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard');
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: { html: true }
    });
  });
});
```

### Keyboard Navigation Tests

```typescript
// tests/accessibility/keyboard.test.ts
import { test, expect } from '@playwright/test';

test.describe('Keyboard Navigation', () => {
  test('should navigate with Tab key', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
    
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
  });

  test('should activate buttons with Enter key', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Focus on button and activate with Enter
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    
    // Verify button action was triggered
    await expect(page.locator('[data-testid="button-action"]')).toBeVisible();
  });

  test('should navigate forms with keyboard', async ({ page }) => {
    await page.goto('/login');
    
    // Tab through form fields
    await page.keyboard.press('Tab');
    await page.keyboard.type('test@example.com');
    
    await page.keyboard.press('Tab');
    await page.keyboard.type('password123');
    
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    
    // Verify form submission
    await expect(page).toHaveURL('/dashboard');
  });
});
```

---

## Test Automation

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      - run: npx playwright install
      - run: npm run test:e2e
      
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

  security-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test:security
      - run: npm audit --audit-level high

  performance-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      - run: npm run test:performance
```

### Test Data Management

```typescript
// tests/helpers/testDataFactory.ts
export class TestDataFactory {
  static createUser(overrides: Partial<User> = {}): User {
    return {
      id: `user-${Date.now()}`,
      email: `test-${Date.now()}@example.com`,
      firstName: 'Test',
      lastName: 'User',
      role: 'compliance_officer',
      organizationId: `org-${Date.now()}`,
      ...overrides
    };
  }

  static createAssessment(overrides: Partial<Assessment> = {}): Assessment {
    return {
      id: `assessment-${Date.now()}`,
      name: `Test Assessment ${Date.now()}`,
      description: 'Test assessment description',
      status: 'in_progress',
      progressPercentage: 0,
      organizationId: `org-${Date.now()}`,
      ...overrides
    };
  }

  static createControl(overrides: Partial<Control> = {}): Control {
    return {
      id: 'AC.3.1.1',
      title: 'Access Control',
      description: 'Test control description',
      status: 'not_implemented',
      maturityScore: 1,
      assessmentId: `assessment-${Date.now()}`,
      ...overrides
    };
  }
}
```

---

## Test Reporting

### Coverage Reports

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'c8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/test/**'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
});
```

### Test Reports

```typescript
// tests/helpers/reportGenerator.ts
export class ReportGenerator {
  static generateTestReport(results: TestResults): string {
    const report = {
      summary: {
        total: results.total,
        passed: results.passed,
        failed: results.failed,
        skipped: results.skipped,
        duration: results.duration
      },
      coverage: results.coverage,
      performance: results.performance,
      security: results.security,
      accessibility: results.accessibility
    };

    return JSON.stringify(report, null, 2);
  }

  static generateHTMLReport(results: TestResults): string {
    // Generate HTML report with charts and details
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Test Report</title>
          <style>
            /* Report styles */
          </style>
        </head>
        <body>
          <h1>Test Report</h1>
          <div class="summary">
            <p>Total: ${results.total}</p>
            <p>Passed: ${results.passed}</p>
            <p>Failed: ${results.failed}</p>
          </div>
          <!-- More report content -->
        </body>
      </html>
    `;
  }
}
```

---

## Best Practices

### Test Organization

1. **File Naming**: Use descriptive names (`component.test.tsx`, `service.test.ts`)
2. **Test Structure**: Arrange, Act, Assert pattern
3. **Test Isolation**: Each test should be independent
4. **Mocking**: Mock external dependencies appropriately
5. **Data Cleanup**: Clean up test data after each test

### Test Maintenance

1. **Regular Updates**: Keep tests updated with code changes
2. **Refactoring**: Refactor tests when code is refactored
3. **Performance**: Keep tests fast and efficient
4. **Documentation**: Document complex test scenarios
5. **Review**: Regular test code reviews

### Quality Gates

1. **Coverage Thresholds**: Maintain minimum coverage levels
2. **Performance Benchmarks**: Set performance expectations
3. **Security Standards**: Enforce security testing requirements
4. **Accessibility Compliance**: Ensure WCAG compliance
5. **Code Quality**: Maintain high code quality standards

---

*Last Updated: January 2025*  
*Testing Version: 2.0.0*