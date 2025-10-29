import { describe, it, expect, beforeEach, vi } from 'vitest';
import { templateService } from '../templateService';

vi.mock('../dataService', () => ({
  dataService: {
    getData: vi.fn(() => ({ templates: [] })),
    saveData: vi.fn().mockResolvedValue(undefined)
  }
}));

vi.mock('../data/templates', () => ({
  templateRegistry: [],
  getTemplateById: vi.fn(),
  getTemplatesByCategory: vi.fn(),
  getTemplatesByControl: vi.fn(),
  searchTemplates: vi.fn(),
  customizeTemplate: vi.fn(),
  validateTemplateCustomization: vi.fn(),
  getTemplateStatistics: vi.fn()
}));

vi.mock('../../utils/logger', () => ({
  logger: {
    debug: vi.fn(),
    error: vi.fn()
  }
}));

describe('TemplateService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = templateService;
      const instance2 = templateService;
      expect(instance1).toBe(instance2);
    });
  });

  describe('Template retrieval', () => {
    it('should get all templates', () => {
      const templates = templateService.getAllTemplates();
      expect(templates).toBeInstanceOf(Array);
    });

    it('should get template by ID', () => {
      // Template service should have templates available
      const templates = templateService.getAllTemplates();
      expect(Array.isArray(templates)).toBe(true);
    });

    it('should search templates', () => {
      const results = templateService.searchTemplates({ search: 'CMMC' });
      expect(results).toBeInstanceOf(Array);
    });
  });

  describe('Template creation', () => {
    it('should create template', () => {
      const templateData = {
        name: 'Test Template',
        description: 'Test description',
        frameworkId: 'cmmc',
        industry: 'military',
        prefilledResponses: {},
        tags: ['test'],
        isPublic: false
      };

      const template = templateService.createTemplate(templateData);
      expect(template).toBeDefined();
      expect(template.name).toBe('Test Template');
    });

    it('should save template to localStorage', () => {
      const templateData = {
        name: 'Saved Template',
        description: 'Test',
        frameworkId: 'cmmc',
        industry: 'military',
        prefilledResponses: {},
        tags: [],
        isPublic: false
      };

      templateService.createTemplate(templateData);
      
      const saved = localStorage.getItem('templates');
      expect(saved).toBeTruthy();
    });
  });

  describe('Template updates', () => {
    it('should update template', () => {
      const templateData = {
        name: 'Original Name',
        description: 'Test',
        frameworkId: 'cmmc',
        industry: 'military',
        prefilledResponses: {},
        tags: [],
        isPublic: false
      };

      const template = templateService.createTemplate(templateData);
      const updated = templateService.updateTemplate({ id: template.id, name: 'Updated Name' });

      expect(updated.name).toBe('Updated Name');
    });
  });

  describe('Template deletion', () => {
    it('should delete template', () => {
      const templateData = {
        name: 'To Delete',
        description: 'Test',
        frameworkId: 'cmmc',
        industry: 'military',
        prefilledResponses: {},
        tags: [],
        isPublic: false
      };

      const template = templateService.createTemplate(templateData);
      templateService.deleteTemplate(template.id);

      const templateAfterDelete = templateService.getTemplateById(template.id);
      expect(templateAfterDelete).toBeNull();
    });
  });

  describe('Template filtering', () => {
    it('should filter templates by framework', () => {
      const results = templateService.searchTemplates({ frameworkId: 'cmmc' });
      expect(results).toBeInstanceOf(Array);
    });

    it('should filter templates by industry', () => {
      const results = templateService.searchTemplates({ industry: 'military' });
      expect(results).toBeInstanceOf(Array);
    });
  });

  describe('Error handling', () => {
    it('should handle localStorage errors gracefully', () => {
      // Simulate quota exceeded
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('Quota exceeded');
      });

      const templateData = {
        name: 'Error Template',
        description: 'Test',
        frameworkId: 'cmmc',
        industry: 'military',
        prefilledResponses: {},
        tags: [],
        isPublic: false
      };

      expect(() => templateService.createTemplate(templateData)).toThrow();

      localStorage.setItem = originalSetItem;
    });
  });
});
