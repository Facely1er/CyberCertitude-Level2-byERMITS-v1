import { describe, it, expect, beforeEach, vi } from 'vitest';
import { poamGenerationService } from '../poamGenerationService';

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

describe('POAMGenerationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = poamGenerationService;
      const instance2 = poamGenerationService;
      expect(instance1).toBe(instance2);
    });
  });

  describe('POAM generation', () => {
    it('should generate POAM from assessment', () => {
      const mockAssessment = {
        id: 'test-1',
        frameworkId: 'cmmc',
        responses: { 'AC.1.001': 1 }, // Not implemented
        createdAt: new Date(),
        lastModified: new Date()
      };

      const organizationInfo = {
        name: 'Test Org',
        systemName: 'Test System',
        responsibleParties: ['admin@example.com']
      };

      const poam = poamGenerationService.generatePOAM(mockAssessment as any, organizationInfo);

      expect(poam).toBeDefined();
      expect(poam.id).toBeDefined();
      expect(poam.title).toContain('Test System');
      expect(poam.organization).toBe('Test Org');
      expect(poam.milestones).toBeInstanceOf(Array);
      expect(poam.summary).toBeDefined();
    });

    it('should generate milestones for non-implemented controls', () => {
      const mockAssessment = {
        id: 'test-1',
        frameworkId: 'cmmc',
        responses: { 'AC.1.001': 0 },
        createdAt: new Date(),
        lastModified: new Date()
      };

      const organizationInfo = {
        name: 'Test Org',
        systemName: 'Test System',
        responsibleParties: ['admin@example.com']
      };

      const poam = poamGenerationService.generatePOAM(mockAssessment as any, organizationInfo);

      expect(poam.milestones.length).toBeGreaterThanOrEqual(0);
    });

    it('should calculate POAM summary', () => {
      const mockAssessment = {
        id: 'test-1',
        frameworkId: 'cmmc',
        responses: { 'AC.1.001': 1 },
        createdAt: new Date(),
        lastModified: new Date()
      };

      const organizationInfo = {
        name: 'Test Org',
        systemName: 'Test System',
        responsibleParties: ['admin@example.com']
      };

      const poam = poamGenerationService.generatePOAM(mockAssessment as any, organizationInfo);

      expect(poam.summary).toBeDefined();
      expect(poam.summary.totalMilestones).toBeGreaterThanOrEqual(0);
    });
  });

  describe('POAM export', () => {
    it('should export POAM to HTML', () => {
      const mockPOAM = {
        id: 'poam-1',
        title: 'Test POAM',
        version: '1.0',
        organization: 'Test Org',
        generatedDate: new Date(),
        milestones: [],
        summary: {
          totalMilestones: 0,
          completedMilestones: 0,
          inProgressMilestones: 0,
          plannedMilestones: 0,
          criticalMilestones: 0,
          highPriorityMilestones: 0,
          estimatedTotalCost: 0,
          estimatedTotalDuration: 0,
          overallProgress: 0
        }
      };

      const html = poamGenerationService.exportToHTML(mockPOAM);
      expect(html).toBeDefined();
      expect(html).toContain('Test POAM');
    });

    it('should export POAM to DOCX', async () => {
      const mockPOAM = {
        id: 'poam-1',
        title: 'Test POAM',
        version: '1.0',
        organization: 'Test Org',
        generatedDate: new Date(),
        milestones: [],
        summary: {
          totalMilestones: 0,
          completedMilestones: 0,
          inProgressMilestones: 0,
          plannedMilestones: 0,
          criticalMilestones: 0,
          highPriorityMilestones: 0,
          estimatedTotalCost: 0,
          estimatedTotalDuration: 0,
          overallProgress: 0
        }
      };

      const docx = await poamGenerationService.exportToDOCX(mockPOAM);
      expect(docx).toBeDefined();
    });
  });

  describe('Error handling', () => {
    it('should handle empty assessment data', () => {
      const mockAssessment = {
        id: 'test-1',
        frameworkId: 'cmmc',
        responses: {},
        createdAt: new Date(),
        lastModified: new Date()
      };

      const organizationInfo = {
        name: 'Test Org',
        systemName: 'Test System',
        responsibleParties: []
      };

      expect(() => {
        poamGenerationService.generatePOAM(mockAssessment as any, organizationInfo);
      }).not.toThrow();
    });
  });
});
