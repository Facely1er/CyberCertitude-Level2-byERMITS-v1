import { describe, it, expect, beforeEach, vi } from 'vitest';
import { sspGenerationService } from '../sspGenerationService';

vi.mock('../data/frameworks/cmmc', () => ({
  cmmcFramework: {
    sections: []
  }
}));

vi.mock('../data/templates', () => ({
  TemplateContent: {}
}));

describe('SSPGenerationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = sspGenerationService;
      const instance2 = sspGenerationService;
      expect(instance1).toBe(instance2);
    });
  });

  describe('SSP generation', () => {
    it('should generate SSP from assessment', () => {
      const mockAssessment = {
        id: 'test-1',
        frameworkId: 'cmmc',
        responses: { 'AC.1.001': 3 },
        createdAt: new Date(),
        lastModified: new Date()
      };

      const organizationInfo = {
        name: 'Test Org',
        address: '123 Test St',
        contact: 'test@example.com',
        systemName: 'Test System',
        systemDescription: 'Test Description'
      };

      const ssp = sspGenerationService.generateSSP(mockAssessment as any, organizationInfo);

      expect(ssp).toBeDefined();
      expect(ssp.id).toBeDefined();
      expect(ssp.title).toContain('Test System');
      expect(ssp.organization).toBe('Test Org');
      expect(ssp.sections).toBeInstanceOf(Array);
      expect(ssp.controls).toBeInstanceOf(Array);
      expect(ssp.appendices).toBeInstanceOf(Array);
    });

    it('should generate SSP from template', () => {
      const mockTemplate = {
        id: 'template-1',
        content: 'Template content'
      };

      const organizationInfo = {
        name: 'Test Org',
        address: '123 Test St',
        contact: 'test@example.com',
        systemName: 'Test System',
        systemDescription: 'Test Description'
      };

      const ssp = sspGenerationService.generateSSPFromTemplate(
        mockTemplate as any,
        'Customized content',
        organizationInfo
      );

      expect(ssp).toBeDefined();
      expect(ssp.title).toContain('Test System');
    });
  });

  describe('SSP export', () => {
    it('should export SSP to HTML', () => {
      const mockSSP = {
        id: 'ssp-1',
        title: 'Test SSP',
        version: '1.0',
        organization: 'Test Org',
        generatedDate: new Date(),
        sections: [],
        controls: [],
        appendices: []
      };

      const html = sspGenerationService.exportToHTML(mockSSP as any);
      expect(html).toBeDefined();
      expect(html).toContain('Test SSP');
    });

    it('should export SSP to DOCX', async () => {
      const mockSSP = {
        id: 'ssp-1',
        title: 'Test SSP',
        version: '1.0',
        organization: 'Test Org',
        generatedDate: new Date(),
        sections: [],
        controls: [],
        appendices: []
      };

      const docx = await sspGenerationService.exportToDOCX(mockSSP as any);
      expect(docx).toBeDefined();
    });
  });

  describe('Error handling', () => {
    it('should handle missing assessment data', () => {
      const organizationInfo = {
        name: 'Test Org',
        address: '123 Test St',
        contact: 'test@example.com',
        systemName: 'Test System',
        systemDescription: 'Test Description'
      };

      const mockAssessment = {
        id: 'test-1',
        frameworkId: 'cmmc',
        responses: {},
        createdAt: new Date(),
        lastModified: new Date()
      };

      expect(() => {
        sspGenerationService.generateSSP(mockAssessment as any, organizationInfo);
      }).not.toThrow();
    });
  });
});
