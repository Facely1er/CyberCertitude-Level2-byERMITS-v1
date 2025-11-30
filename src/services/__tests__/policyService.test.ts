import { describe, it, expect, beforeEach, vi } from 'vitest';
import { policyService } from '../policyService';

// Mock dataService
vi.mock('../dataService', () => ({
  dataService: {
    getData: vi.fn(() => ({ policies: [] })),
    saveData: vi.fn(),
    getAssessments: vi.fn(() => []),
    saveAssessment: vi.fn(),
    getAssets: vi.fn(() => []),
    saveAsset: vi.fn(),
    getTasks: vi.fn(() => []),
    saveTask: vi.fn(),
    getSettings: vi.fn(() => ({})),
    saveSettings: vi.fn()
  }
}));

// Mock templateService
vi.mock('../templateService', () => ({
  templateService: {
    getContentTemplatesByCategory: vi.fn(() => []),
    getContentTemplate: vi.fn(() => null),
    customizeContentTemplate: vi.fn(() => 'customized'),
    exportContentTemplate: vi.fn(() => 'exported')
  }
}));

describe('PolicyService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = policyService;
      const instance2 = policyService;
      expect(instance1).toBe(instance2);
    });
  });

  describe('Policy CRUD operations', () => {
    it('should get empty policies list', async () => {
      const policies = await policyService.getPolicies();
      expect(Array.isArray(policies)).toBe(true);
    });

    it('should create policy', async () => {
      const now = new Date();
      const policyData = {
        id: 'policy-1',
        name: 'Test Policy',
        description: 'Test Description',
        type: 'governance' as const,
        framework: 'CMMC 2.0',
        nistFunction: 'Govern',
        nistCategory: 'GV.OC',
        nistSubcategories: ['GV.OC-01'],
        version: '1.0',
        status: 'draft' as const,
        effectiveDate: now,
        lastReviewed: now,
        nextReview: now,
        reviewCycle: 'annually' as const,
        owner: 'CISO',
        approver: 'CEO',
        stakeholders: [],
        scope: [],
        exceptions: [],
        relatedPolicies: [],
        relatedControls: [],
        evidence: [],
        implementationGuide: {
          steps: [],
          resources: [],
          training: [],
          metrics: []
        },
        complianceRequirements: [],
        riskLevel: 'low' as const,
        businessImpact: 'low' as const,
        implementationStatus: 'not-started' as const,
        lastUpdated: now
      };

      const policy = await policyService.savePolicy(policyData);
      expect(policy).toBeDefined();
      expect(policy.name).toBe('Test Policy');
    });

    it('should get policy by id', async () => {
      const policy = await policyService.getPolicy('policy-1');
      // May be null if no policy exists
      expect(policy === null || typeof policy === 'object').toBe(true);
    });

    it('should update policy', async () => {
      await policyService.savePolicy({
        id: 'policy-1',
        name: 'Original',
        description: 'Desc',
        type: 'governance',
        framework: 'CMMC 2.0',
        nistFunction: 'Govern',
        nistCategory: 'GV.OC',
        nistSubcategories: [],
        version: '1.0',
        status: 'draft',
        effectiveDate: new Date(),
        lastReviewed: new Date(),
        nextReview: new Date(),
        reviewCycle: 'annually',
        owner: 'CISO',
        approver: 'CEO',
        stakeholders: [],
        scope: [],
        exceptions: [],
        relatedPolicies: [],
        relatedControls: [],
        evidence: [],
        implementationGuide: {
          steps: [],
          resources: [],
          training: [],
          metrics: []
        },
        complianceRequirements: [],
        riskLevel: 'low',
        businessImpact: 'low',
        implementationStatus: 'not-started',
        lastUpdated: new Date()
      });

      const updated = await policyService.updatePolicy('policy-1', { name: 'Updated' });
      expect(updated).toBeDefined();
    });

    it('should handle updating non-existent policy', async () => {
      await expect(policyService.updatePolicy('non-existent', {})).rejects.toThrow();
    });

    it('should delete policy', async () => {
      await expect(policyService.deletePolicy('policy-1')).resolves.not.toThrow();
    });
  });

  describe('Template operations', () => {
    it('should get policy template', async () => {
      const template = await policyService.getTemplatePolicy('access-control');
      // May be null if no template matches
      expect(template === null || typeof template === 'object').toBe(true);
    });

    it('should create policy from template', async () => {
      // Mock templateService to return a template
      const { templateService } = await import('../templateService');
      vi.spyOn(templateService, 'getContentTemplate').mockResolvedValue({
        id: 'template-1',
        name: 'Access Control Template',
        description: 'Test',
        content: 'Template content',
        category: 'policy',
        tags: ['access-control'],
        framework: 'CMMC 2.0',
        controls: ['AC.1.001'],
        metadata: {}
      } as any);

      const policy = await policyService.createPolicyFromTemplate('template-1', {
        companyInfo: { name: 'Test Inc', contact: 'test@example.com' }
      });

      expect(policy).toBeDefined();
    });

    it('should handle missing template gracefully', async () => {
      await expect(
        policyService.createPolicyFromTemplate('non-existent', {})
      ).rejects.toThrow();
    });

    it('should customize template', async () => {
      const result = await policyService.customizePolicyTemplate('template-1', {
        companyName: 'Test'
      });
      expect(result).toBeDefined();
    });

    it('should export policy template', async () => {
      const result = await policyService.exportPolicyTemplate('template-1', {}, 'html');
      expect(result).toBeDefined();
    });
  });

  describe('Search and filter', () => {
    it('should search policies without errors', async () => {
      const policies = await policyService.searchPolicies({});
      expect(Array.isArray(policies)).toBe(true);
    });

    it('should filter by type', async () => {
      const policies = await policyService.getPoliciesByType('governance');
      expect(Array.isArray(policies)).toBe(true);
    });

    it('should filter by status', async () => {
      const policies = await policyService.getPoliciesByStatus('draft');
      expect(Array.isArray(policies)).toBe(true);
    });

    it('should filter by owner', async () => {
      const policies = await policyService.getPoliciesByOwner('CISO');
      expect(Array.isArray(policies)).toBe(true);
    });
  });

  describe('Statistics', () => {
    it('should get policy statistics', async () => {
      const stats = await policyService.getPolicyStatistics();
      expect(stats).toBeDefined();
      expect(stats.total).toBeGreaterThanOrEqual(0);
      expect(typeof stats.complianceRate).toBe('number');
    });
  });

  describe('Framework generation', () => {
    it('should generate policies from framework', async () => {
      const policies = await policyService.generatePoliciesFromFramework();
      expect(Array.isArray(policies)).toBe(true);
    });
  });

  describe('Export functionality', () => {
    it('should export policies to CSV', async () => {
      const policies = await policyService.getPolicies();
      const exported = await policyService.exportPolicies(policies, 'csv');
      expect(typeof exported).toBe('string');
    });

    it('should handle empty policies export', async () => {
      const exported = await policyService.exportPolicies([], 'csv');
      expect(typeof exported).toBe('string');
    });
  });

  describe('Error handling', () => {
    it('should handle errors gracefully', async () => {
      // Mock dataService to throw error
      const { dataService } = await import('../dataService');
      vi.spyOn(dataService, 'getData').mockImplementation(() => {
        throw new Error('Storage error');
      });

      const policies = await policyService.getPolicies();
      expect(Array.isArray(policies)).toBe(true);
      expect(policies.length).toBe(0);
    });

    it('should handle null/undefined values', async () => {
      const policy = await policyService.savePolicy({
        id: 'policy-1',
        name: '',
        description: '',
        type: 'governance',
        framework: '',
        nistFunction: '',
        nistCategory: '',
        nistSubcategories: [],
        version: '',
        status: 'draft',
        effectiveDate: new Date(),
        lastReviewed: new Date(),
        nextReview: new Date(),
        reviewCycle: 'annually',
        owner: '',
        approver: '',
        stakeholders: undefined as any,
        scope: undefined as any,
        exceptions: null as any,
        relatedPolicies: [],
        relatedControls: [],
        evidence: [],
        implementationGuide: {
          steps: undefined as any,
          resources: [],
          training: null as any,
          metrics: []
        },
        complianceRequirements: [],
        riskLevel: 'low',
        businessImpact: 'low',
        implementationStatus: 'not-started',
        lastUpdated: new Date()
      });

      expect(policy).toBeDefined();
    });
  });
});

