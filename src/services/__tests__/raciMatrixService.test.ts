import { describe, it, expect, beforeEach, vi } from 'vitest';
import { raciMatrixService } from '../raciMatrixService';

vi.mock('../data/frameworks/cmmc', () => ({
  cmmcFramework: {
    sections: [
      {
        categories: [
          {
            questions: [
              { id: 'AC.1.001', text: 'Access Control Policy', priority: 'high' }
            ]
          }
        ]
      }
    ]
  }
}));

describe('RACIMatrixService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = raciMatrixService;
      const instance2 = raciMatrixService;
      expect(instance1).toBe(instance2);
    });
  });

  describe('RACI matrix generation', () => {
    it('should generate RACI matrix from assessment', () => {
      const mockAssessment = {
        id: 'test-1',
        frameworkId: 'cmmc',
        responses: { 'AC.1.001': 3 },
        createdAt: new Date(),
        lastModified: new Date()
      };

      const organizationInfo = {
        name: 'Test Org',
        roles: [
          {
            id: 'role-1',
            name: 'Security Manager',
            department: 'IT',
            skills: ['security', 'compliance'],
            level: 'management' as const
          }
        ]
      };

      const raciMatrix = raciMatrixService.generateRACIMatrix(mockAssessment as any, organizationInfo);

      expect(raciMatrix).toBeDefined();
      expect(raciMatrix.id).toBeDefined();
      expect(raciMatrix.title).toBeDefined();
      expect(raciMatrix.organization).toBe('Test Org');
      expect(raciMatrix.roles).toBeInstanceOf(Array);
      expect(raciMatrix.controls).toBeInstanceOf(Array);
      expect(raciMatrix.matrix).toBeInstanceOf(Array);
      expect(raciMatrix.summary).toBeDefined();
    });

    it('should generate roles from organization info', () => {
      const mockAssessment = {
        id: 'test-1',
        frameworkId: 'cmmc',
        responses: {},
        createdAt: new Date(),
        lastModified: new Date()
      };

      const organizationInfo = {
        name: 'Test Org',
        roles: [
          {
            id: 'role-1',
            name: 'CISO',
            department: 'Security',
            skills: ['leadership'],
            level: 'executive' as const
          }
        ]
      };

      const raciMatrix = raciMatrixService.generateRACIMatrix(mockAssessment as any, organizationInfo);

      expect(raciMatrix.roles.length).toBeGreaterThan(0);
    });

    it('should generate controls from assessment', () => {
      const mockAssessment = {
        id: 'test-1',
        frameworkId: 'cmmc',
        responses: { 'AC.1.001': 2 },
        createdAt: new Date(),
        lastModified: new Date()
      };

      const organizationInfo = {
        name: 'Test Org',
        roles: []
      };

      const raciMatrix = raciMatrixService.generateRACIMatrix(mockAssessment as any, organizationInfo);

      expect(raciMatrix.controls).toBeInstanceOf(Array);
    });

    it('should calculate RACI summary', () => {
      const mockAssessment = {
        id: 'test-1',
        frameworkId: 'cmmc',
        responses: {},
        createdAt: new Date(),
        lastModified: new Date()
      };

      const organizationInfo = {
        name: 'Test Org',
        roles: []
      };

      const raciMatrix = raciMatrixService.generateRACIMatrix(mockAssessment as any, organizationInfo);

      expect(raciMatrix.summary).toBeDefined();
      expect(raciMatrix.summary.totalRoles).toBeGreaterThanOrEqual(0);
      expect(raciMatrix.summary.totalControls).toBeGreaterThanOrEqual(0);
    });
  });

  describe('RACI matrix export', () => {
    it('should export RACI matrix to HTML', () => {
      const mockRACI = {
        id: 'raci-1',
        title: 'Test RACI',
        organization: 'Test Org',
        generatedDate: new Date(),
        roles: [],
        controls: [],
        matrix: [],
        summary: {
          totalRoles: 0,
          totalControls: 0,
          responsibleCount: 0,
          accountableCount: 0,
          consultedCount: 0,
          informedCount: 0,
          roleDistribution: {},
          workloadAnalysis: []
        }
      };

      const html = raciMatrixService.exportToHTML(mockRACI as any);
      expect(html).toBeDefined();
    });

    it('should export RACI matrix to CSV', () => {
      const mockRACI = {
        id: 'raci-1',
        title: 'Test RACI',
        organization: 'Test Org',
        generatedDate: new Date(),
        roles: [],
        controls: [],
        matrix: [],
        summary: {
          totalRoles: 0,
          totalControls: 0,
          responsibleCount: 0,
          accountableCount: 0,
          consultedCount: 0,
          informedCount: 0,
          roleDistribution: {},
          workloadAnalysis: []
        }
      };

      const csv = raciMatrixService.exportToCSV(mockRACI as any);
      expect(csv).toBeDefined();
    });
  });
});
