import { describe, it, expect, beforeEach, vi } from 'vitest';
import { securityAssessmentReportService } from '../securityAssessmentReportService';

vi.mock('../data/frameworks/cmmc', () => ({
  cmmcFramework: {
    sections: [
      {
        name: 'Access Control',
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

describe('SecurityAssessmentReportService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = securityAssessmentReportService;
      const instance2 = securityAssessmentReportService;
      expect(instance1).toBe(instance2);
    });
  });

  describe('SAR generation', () => {
    it('should generate security assessment report', () => {
      const mockAssessment = {
        id: 'test-1',
        frameworkId: 'cmmc',
        responses: { 'AC.1.001': 3 },
        createdAt: new Date(),
        lastModified: new Date()
      };

      const assessorInfo = {
        name: 'Test Assessor',
        organization: 'Test Org',
        credentials: ['CISA'],
        contactInfo: 'assessor@example.com'
      };

      const sar = securityAssessmentReportService.generateSAR(
        mockAssessment as any,
        assessorInfo
      );

      expect(sar).toBeDefined();
      expect(sar.id).toBeDefined();
      expect(sar.title).toBeDefined();
      expect(sar.assessor.name).toBe('Test Assessor');
      expect(sar.executiveSummary).toBeDefined();
      expect(sar.findings).toBeInstanceOf(Array);
      expect(sar.domainAnalysis).toBeInstanceOf(Array);
    });

    it('should generate executive summary', () => {
      const mockAssessment = {
        id: 'test-1',
        frameworkId: 'cmmc',
        responses: { 'AC.1.001': 3 },
        createdAt: new Date(),
        lastModified: new Date()
      };

      const assessorInfo = {
        name: 'Test Assessor',
        organization: 'Test Org',
        credentials: [],
        contactInfo: 'assessor@example.com'
      };

      const sar = securityAssessmentReportService.generateSAR(
        mockAssessment as any,
        assessorInfo
      );

      expect(sar.executiveSummary).toBeDefined();
      expect(sar.executiveSummary.overallScore).toBeGreaterThanOrEqual(0);
      expect(sar.executiveSummary.overallScore).toBeLessThanOrEqual(100);
    });

    it('should generate findings', () => {
      const mockAssessment = {
        id: 'test-1',
        frameworkId: 'cmmc',
        responses: { 'AC.1.001': 1 }, // Not compliant
        createdAt: new Date(),
        lastModified: new Date()
      };

      const assessorInfo = {
        name: 'Test Assessor',
        organization: 'Test Org',
        credentials: [],
        contactInfo: 'assessor@example.com'
      };

      const sar = securityAssessmentReportService.generateSAR(
        mockAssessment as any,
        assessorInfo
      );

      expect(sar.findings).toBeInstanceOf(Array);
    });

    it('should generate domain analysis', () => {
      const mockAssessment = {
        id: 'test-1',
        frameworkId: 'cmmc',
        responses: {},
        createdAt: new Date(),
        lastModified: new Date()
      };

      const assessorInfo = {
        name: 'Test Assessor',
        organization: 'Test Org',
        credentials: [],
        contactInfo: 'assessor@example.com'
      };

      const sar = securityAssessmentReportService.generateSAR(
        mockAssessment as any,
        assessorInfo
      );

      expect(sar.domainAnalysis).toBeInstanceOf(Array);
    });

    it('should generate risk assessment', () => {
      const mockAssessment = {
        id: 'test-1',
        frameworkId: 'cmmc',
        responses: {},
        createdAt: new Date(),
        lastModified: new Date()
      };

      const assessorInfo = {
        name: 'Test Assessor',
        organization: 'Test Org',
        credentials: [],
        contactInfo: 'assessor@example.com'
      };

      const sar = securityAssessmentReportService.generateSAR(
        mockAssessment as any,
        assessorInfo
      );

      expect(sar.riskAssessment).toBeDefined();
      expect(['critical', 'high', 'medium', 'low']).toContain(sar.riskAssessment.overallRiskLevel);
    });
  });

  describe('SAR export', () => {
    it('should export SAR to HTML', () => {
      const mockSAR = {
        id: 'sar-1',
        title: 'Test SAR',
        version: '1.0',
        organization: 'Test Org',
        assessmentDate: new Date(),
        generatedDate: new Date(),
        assessor: {} as any,
        executiveSummary: {} as any,
        scopeAndMethodology: {} as any,
        findings: [],
        domainAnalysis: [],
        riskAssessment: {} as any,
        recommendations: [],
        complianceStatus: {} as any,
        nextSteps: [],
        appendices: []
      };

      const html = securityAssessmentReportService.exportToHTML(mockSAR as any);
      expect(html).toBeDefined();
    });

    it('should export SAR to PDF', async () => {
      const mockSAR = {
        id: 'sar-1',
        title: 'Test SAR',
        version: '1.0',
        organization: 'Test Org',
        assessmentDate: new Date(),
        generatedDate: new Date(),
        assessor: {} as any,
        executiveSummary: {} as any,
        scopeAndMethodology: {} as any,
        findings: [],
        domainAnalysis: [],
        riskAssessment: {} as any,
        recommendations: [],
        complianceStatus: {} as any,
        nextSteps: [],
        appendices: []
      };

      const pdf = await securityAssessmentReportService.exportToPDF(mockSAR as any);
      expect(pdf).toBeDefined();
    });
  });
});
