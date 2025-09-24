/**
 * 📋 Template Service
 * Manages assessment templates for CMMC compliance
 */

import { AssessmentTemplate, TemplateCreateData } from '../shared/types/documentation';
import { logger } from '../utils/logger';

class TemplateService {
  private static instance: TemplateService;
  private templates: AssessmentTemplate[] = [];

  private constructor() {
    this.loadTemplates();
  }

  public static getInstance(): TemplateService {
    if (!TemplateService.instance) {
      TemplateService.instance = new TemplateService();
    }
    return TemplateService.instance;
  }

  private loadTemplates(): void {
    try {
      const templatesData = localStorage.getItem('cmc_templates');
      if (templatesData) {
        this.templates = JSON.parse(templatesData).map((template: any) => ({
          ...template,
          createdAt: new Date(template.createdAt),
          lastModified: new Date(template.lastModified)
        }));
      } else {
        // Initialize with default templates
        this.initializeDefaultTemplates();
      }

      logger.debug('Templates loaded successfully', { count: this.templates.length });
    } catch (error) {
      logger.error('Failed to load templates:', error);
      this.templates = [];
      this.initializeDefaultTemplates();
    }
  }

  private saveTemplates(): void {
    try {
      localStorage.setItem('cmc_templates', JSON.stringify(this.templates));
      logger.debug('Templates saved successfully', { count: this.templates.length });
    } catch (error) {
      logger.error('Failed to save templates:', error);
      throw new Error('Failed to save templates');
    }
  }

  private initializeDefaultTemplates(): void {
    const defaultTemplates: AssessmentTemplate[] = [
      {
        id: 'template_defense_small',
        name: 'Defense Contractor - Small Business',
        description: 'CMMC Level 1 template optimized for small defense contractors',
        frameworkId: 'cmmc-level1',
        industry: 'defense',
        prefilledResponses: {
          'AC.1.001': 3,
          'AC.1.002': 3,
          'AC.1.003': 2,
          'AT.1.001': 3,
          'AT.1.002': 2,
          'AU.1.001': 3,
          'AU.1.002': 2,
          'CM.1.001': 3,
          'CM.1.002': 2,
          'IA.1.001': 3,
          'IA.1.002': 3,
          'IR.1.001': 2,
          'IR.1.002': 2,
          'MA.1.001': 3,
          'MA.1.002': 2,
          'MP.1.001': 3,
          'MP.1.002': 2,
          'PS.1.001': 3,
          'PS.1.002': 3,
          'PE.1.001': 3,
          'PE.1.002': 2,
          'CP.1.001': 2,
          'CP.1.002': 3,
          'RA.1.001': 2,
          'RA.1.002': 2,
          'CA.1.001': 2,
          'CA.1.002': 2,
          'SC.1.001': 3,
          'SC.1.002': 2,
          'SI.1.001': 3,
          'SI.1.002': 3
        },
        tags: ['defense', 'small-business', 'cmmc-level1', 'baseline'],
        isPublic: true,
        createdBy: 'system',
        createdAt: new Date(),
        lastModified: new Date(),
        version: '1.0.0',
        downloadCount: 0,
        rating: 4.5,
        organizationSize: ['small'],
        complianceMapping: {
          'AC.1.001': 'NIST SP 800-171 AC-1',
          'AC.1.002': 'NIST SP 800-171 AC-2',
          'AC.1.003': 'NIST SP 800-171 AC-3'
        }
      },
      {
        id: 'template_healthcare_medium',
        name: 'Healthcare - Medium Organization',
        description: 'CMMC Level 1 template for medium-sized healthcare organizations',
        frameworkId: 'cmmc-level1',
        industry: 'healthcare',
        prefilledResponses: {
          'AC.1.001': 3,
          'AC.1.002': 3,
          'AC.1.003': 3,
          'AT.1.001': 3,
          'AT.1.002': 3,
          'AU.1.001': 3,
          'AU.1.002': 3,
          'CM.1.001': 3,
          'CM.1.002': 3,
          'IA.1.001': 3,
          'IA.1.002': 3,
          'IR.1.001': 3,
          'IR.1.002': 3,
          'MA.1.001': 3,
          'MA.1.002': 3,
          'MP.1.001': 3,
          'MP.1.002': 3,
          'PS.1.001': 3,
          'PS.1.002': 3,
          'PE.1.001': 3,
          'PE.1.002': 3,
          'CP.1.001': 3,
          'CP.1.002': 3,
          'RA.1.001': 3,
          'RA.1.002': 3,
          'CA.1.001': 3,
          'CA.1.002': 3,
          'SC.1.001': 3,
          'SC.1.002': 3,
          'SI.1.001': 3,
          'SI.1.002': 3
        },
        tags: ['healthcare', 'medium-business', 'cmmc-level1', 'hipaa'],
        isPublic: true,
        createdBy: 'system',
        createdAt: new Date(),
        lastModified: new Date(),
        version: '1.0.0',
        downloadCount: 0,
        rating: 4.8,
        organizationSize: ['medium'],
        complianceMapping: {
          'AC.1.001': 'HIPAA 164.312(a)(1)',
          'AC.1.002': 'HIPAA 164.312(a)(2)',
          'AC.1.003': 'HIPAA 164.312(a)(3)'
        }
      },
      {
        id: 'template_finance_large',
        name: 'Financial Services - Large Organization',
        description: 'CMMC Level 1 template for large financial services organizations',
        frameworkId: 'cmmc-level1',
        industry: 'finance',
        prefilledResponses: {
          'AC.1.001': 3,
          'AC.1.002': 3,
          'AC.1.003': 3,
          'AT.1.001': 3,
          'AT.1.002': 3,
          'AU.1.001': 3,
          'AU.1.002': 3,
          'CM.1.001': 3,
          'CM.1.002': 3,
          'IA.1.001': 3,
          'IA.1.002': 3,
          'IR.1.001': 3,
          'IR.1.002': 3,
          'MA.1.001': 3,
          'MA.1.002': 3,
          'MP.1.001': 3,
          'MP.1.002': 3,
          'PS.1.001': 3,
          'PS.1.002': 3,
          'PE.1.001': 3,
          'PE.1.002': 3,
          'CP.1.001': 3,
          'CP.1.002': 3,
          'RA.1.001': 3,
          'RA.1.002': 3,
          'CA.1.001': 3,
          'CA.1.002': 3,
          'SC.1.001': 3,
          'SC.1.002': 3,
          'SI.1.001': 3,
          'SI.1.002': 3
        },
        tags: ['finance', 'large-business', 'cmmc-level1', 'sox'],
        isPublic: true,
        createdBy: 'system',
        createdAt: new Date(),
        lastModified: new Date(),
        version: '1.0.0',
        downloadCount: 0,
        rating: 4.7,
        organizationSize: ['large'],
        complianceMapping: {
          'AC.1.001': 'SOX 404',
          'AC.1.002': 'SOX 404',
          'AC.1.003': 'SOX 404'
        }
      }
    ];

    this.templates = defaultTemplates;
    this.saveTemplates();
  }

  public getAllTemplates(): AssessmentTemplate[] {
    return [...this.templates];
  }

  public getTemplateById(id: string): AssessmentTemplate | null {
    return this.templates.find(template => template.id === id) || null;
  }

  public getTemplatesByFramework(frameworkId: string): AssessmentTemplate[] {
    return this.templates.filter(template => template.frameworkId === frameworkId);
  }

  public getTemplatesByIndustry(industry: string): AssessmentTemplate[] {
    return this.templates.filter(template => template.industry === industry);
  }

  public getPublicTemplates(): AssessmentTemplate[] {
    return this.templates.filter(template => template.isPublic);
  }

  public searchTemplates(query: string): AssessmentTemplate[] {
    const searchLower = query.toLowerCase();
    return this.templates.filter(template => 
      template.name.toLowerCase().includes(searchLower) ||
      template.description.toLowerCase().includes(searchLower) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      template.industry.toLowerCase().includes(searchLower)
    );
  }

  public createTemplate(templateData: TemplateCreateData): AssessmentTemplate {
    const now = new Date();
    const newTemplate: AssessmentTemplate = {
      id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: templateData.name,
      description: templateData.description,
      frameworkId: templateData.frameworkId,
      industry: templateData.industry,
      prefilledResponses: templateData.prefilledResponses || {},
      tags: templateData.tags || [],
      isPublic: templateData.isPublic || false,
      createdBy: templateData.createdBy || 'user',
      createdAt: now,
      lastModified: now,
      version: '1.0.0',
      downloadCount: 0,
      rating: 0,
      organizationSize: templateData.organizationSize || [],
      complianceMapping: templateData.complianceMapping || {}
    };

    this.templates.push(newTemplate);
    this.saveTemplates();

    logger.info('Template created successfully', { 
      templateId: newTemplate.id, 
      name: newTemplate.name 
    });

    return newTemplate;
  }

  public updateTemplate(id: string, updates: Partial<AssessmentTemplate>): AssessmentTemplate {
    const templateIndex = this.templates.findIndex(template => template.id === id);
    if (templateIndex === -1) {
      throw new Error(`Template with id ${id} not found`);
    }

    const updatedTemplate: AssessmentTemplate = {
      ...this.templates[templateIndex],
      ...updates,
      lastModified: new Date()
    };

    this.templates[templateIndex] = updatedTemplate;
    this.saveTemplates();

    logger.info('Template updated successfully', { 
      templateId: id, 
      name: updatedTemplate.name 
    });

    return updatedTemplate;
  }

  public deleteTemplate(id: string): void {
    const templateIndex = this.templates.findIndex(template => template.id === id);
    if (templateIndex === -1) {
      throw new Error(`Template with id ${id} not found`);
    }

    const deletedTemplate = this.templates[templateIndex];
    this.templates.splice(templateIndex, 1);
    this.saveTemplates();

    logger.info('Template deleted successfully', { 
      templateId: id, 
      name: deletedTemplate.name 
    });
  }

  public incrementDownloadCount(id: string): void {
    const template = this.getTemplateById(id);
    if (template) {
      template.downloadCount++;
      this.saveTemplates();
    }
  }

  public addTemplateReview(id: string, review: { userId: string; userName: string; rating: number; comment: string }): void {
    const template = this.getTemplateById(id);
    if (template) {
      if (!template.reviews) {
        template.reviews = [];
      }

      const newReview = {
        id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...review,
        createdAt: new Date(),
        helpful: 0
      };

      template.reviews.push(newReview);

      // Recalculate average rating
      const totalRating = template.reviews.reduce((sum, r) => sum + r.rating, 0);
      template.rating = totalRating / template.reviews.length;

      this.saveTemplates();

      logger.info('Template review added successfully', { 
        templateId: id, 
        reviewId: newReview.id 
      });
    }
  }

  public exportTemplates(): string {
    try {
      const exportData = {
        templates: this.templates,
        exportedAt: new Date().toISOString(),
        version: '1.0.0'
      };
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      logger.error('Failed to export templates:', error);
      throw new Error('Failed to export templates');
    }
  }

  public importTemplates(data: string): { success: number; errors: string[] } {
    try {
      const importedData = JSON.parse(data);
      const results = { success: 0, errors: [] as string[] };

      if (importedData.templates && Array.isArray(importedData.templates)) {
        importedData.templates.forEach((templateData: any) => {
          try {
            const template: AssessmentTemplate = {
              ...templateData,
              id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              createdAt: new Date(),
              lastModified: new Date(),
              downloadCount: 0,
              rating: 0
            };

            this.templates.push(template);
            results.success++;
          } catch (error) {
            results.errors.push(`Template ${templateData.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        });

        this.saveTemplates();
      }

      logger.info('Templates import completed', { 
        success: results.success, 
        errors: results.errors.length 
      });

      return results;
    } catch (error) {
      logger.error('Failed to import templates:', error);
      throw new Error(`Failed to import templates: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const templateService = TemplateService.getInstance();