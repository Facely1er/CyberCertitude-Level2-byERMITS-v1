/**
 * Template Registry System
 * Central registry for all CMMC 2.0 compliance templates
 */

import { cuiNetworkBoundaryDiagram } from './specialized/networkDiagrams';
import { cmmcRiskRegister } from './specialized/riskRegister';
import { cmmcAwarenessTrainingDeck } from './specialized/trainingDeck';
import { implementationRoadmap } from './specialized/implementationRoadmap';
import { accessControlPolicy } from './policies/accessControl';

export interface FieldDefinition {
  id: string;
  name: string;
  required: boolean;
  type: 'text' | 'textarea' | 'email' | 'tel' | 'date' | 'number' | 'select' | 'file';
  placeholder: string;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    custom?: string;
  };
}

export interface InteractiveFields {
  companyInfo: Record<string, FieldDefinition>;
  systemInfo?: Record<string, FieldDefinition>;
  customFields?: Record<string, FieldDefinition>;
  [key: string]: any;
}

export interface TemplateMetadata {
  version: string;
  lastUpdated: string;
  estimatedPages?: number;
  estimatedSlides?: number;
  complexity: 'low' | 'medium' | 'high';
  targetAudience: string[];
  tags: string[];
  framework: string;
  complianceLevel: string;
}

export interface TemplateContent {
  id: string;
  name: string;
  category: 'specialized' | 'policy' | 'scenario' | 'core';
  type: string;
  description: string;
  content: string;
  controls: string[];
  interactiveFields: InteractiveFields;
  metadata: TemplateMetadata;
}

// Template registry containing all available templates
export const templateRegistry: TemplateContent[] = [
  {
    id: cuiNetworkBoundaryDiagram.id,
    name: cuiNetworkBoundaryDiagram.name,
    category: cuiNetworkBoundaryDiagram.category as 'specialized',
    type: cuiNetworkBoundaryDiagram.type,
    description: 'Comprehensive network architecture documentation for CUI environment boundaries and protections',
    content: cuiNetworkBoundaryDiagram.content,
    controls: cuiNetworkBoundaryDiagram.controls,
    interactiveFields: cuiNetworkBoundaryDiagram.interactiveFields,
    metadata: {
      ...cuiNetworkBoundaryDiagram.metadata,
      tags: ['network', 'architecture', 'security', 'boundary', 'diagram'],
      framework: 'CMMC 2.0',
      complianceLevel: 'Level 2'
    }
  },
  {
    id: cmmcRiskRegister.id,
    name: cmmcRiskRegister.name,
    category: cmmcRiskRegister.category as 'specialized',
    type: cmmcRiskRegister.type,
    description: 'Comprehensive risk tracking and management system for CMMC compliance',
    content: cmmcRiskRegister.content,
    controls: cmmcRiskRegister.controls,
    interactiveFields: cmmcRiskRegister.interactiveFields,
    metadata: {
      ...cmmcRiskRegister.metadata,
      tags: ['risk', 'management', 'assessment', 'tracking', 'compliance'],
      framework: 'CMMC 2.0',
      complianceLevel: 'Level 2'
    }
  },
  {
    id: cmmcAwarenessTrainingDeck.id,
    name: cmmcAwarenessTrainingDeck.name,
    category: cmmcAwarenessTrainingDeck.category as 'specialized',
    type: cmmcAwarenessTrainingDeck.type,
    description: '17-slide comprehensive presentation for CMMC 2.0 awareness training',
    content: cmmcAwarenessTrainingDeck.content,
    controls: cmmcAwarenessTrainingDeck.controls,
    interactiveFields: cmmcAwarenessTrainingDeck.interactiveFields,
    metadata: {
      ...cmmcAwarenessTrainingDeck.metadata,
      tags: ['training', 'awareness', 'presentation', 'education', 'compliance'],
      framework: 'CMMC 2.0',
      complianceLevel: 'Level 2'
    }
  },
  {
    id: implementationRoadmap.id,
    name: implementationRoadmap.name,
    category: implementationRoadmap.category as 'specialized',
    type: implementationRoadmap.type,
    description: '26-week detailed project plan with budget estimates and milestones for CMMC implementation',
    content: implementationRoadmap.content,
    controls: implementationRoadmap.controls,
    interactiveFields: implementationRoadmap.interactiveFields,
    metadata: {
      ...implementationRoadmap.metadata,
      tags: ['project', 'planning', 'roadmap', 'implementation', 'budget'],
      framework: 'CMMC 2.0',
      complianceLevel: 'Level 2'
    }
  },
  {
    id: accessControlPolicy.id,
    name: accessControlPolicy.name,
    category: accessControlPolicy.category as 'policy',
    type: accessControlPolicy.type,
    description: 'Comprehensive access control policy covering all AC domain requirements',
    content: accessControlPolicy.content,
    controls: accessControlPolicy.controls,
    interactiveFields: accessControlPolicy.interactiveFields,
    metadata: {
      ...accessControlPolicy.metadata,
      tags: ['policy', 'access-control', 'authentication', 'authorization', 'security'],
      framework: 'CMMC 2.0',
      complianceLevel: 'Level 2'
    }
  }
];

// Helper functions for template management
export function getTemplateById(id: string): TemplateContent | null {
  return templateRegistry.find(template => template.id === id) || null;
}

export function getTemplatesByCategory(category: string): TemplateContent[] {
  return templateRegistry.filter(template => template.category === category);
}

export function getTemplatesByControl(controlId: string): TemplateContent[] {
  return templateRegistry.filter(template => template.controls.includes(controlId));
}

export function getTemplatesByTag(tag: string): TemplateContent[] {
  return templateRegistry.filter(template => template.metadata.tags.includes(tag));
}

export function searchTemplates(query: string): TemplateContent[] {
  const searchLower = query.toLowerCase();
  return templateRegistry.filter(template => 
    template.name.toLowerCase().includes(searchLower) ||
    template.description.toLowerCase().includes(searchLower) ||
    template.metadata.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
    template.controls.some(control => control.toLowerCase().includes(searchLower))
  );
}

export function getTemplatesByComplexity(complexity: 'low' | 'medium' | 'high'): TemplateContent[] {
  return templateRegistry.filter(template => template.metadata.complexity === complexity);
}

export function getTemplatesByAudience(audience: string): TemplateContent[] {
  return templateRegistry.filter(template => template.metadata.targetAudience.includes(audience));
}

// Template customization function
export function customizeTemplate(templateId: string, customizations: any): string {
  const template = getTemplateById(templateId);
  if (!template) {
    throw new Error(`Template with id ${templateId} not found`);
  }

  let content = template.content;
  
  // Replace common placeholders
  const commonReplacements = {
    '{{today}}': new Date().toLocaleDateString(),
    '{{nextReview}}': new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    '{{companyName}}': customizations.companyName || '[Company Name]',
    '{{ciso}}': customizations.ciso || '[CISO Name]',
    '{{effectiveDate}}': customizations.effectiveDate || new Date().toLocaleDateString(),
    '{{reviewDate}}': customizations.reviewDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()
  };
  
  Object.entries(commonReplacements).forEach(([placeholder, value]) => {
    content = content.replace(new RegExp(placeholder, 'g'), value);
  });
  
  // Replace custom placeholders
  Object.entries(customizations).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    content = content.replace(new RegExp(placeholder, 'g'), String(value));
  });
  
  return content;
}

// Template validation function
export function validateTemplateCustomization(templateId: string, customizations: any): { valid: boolean; errors: string[] } {
  const template = getTemplateById(templateId);
  if (!template) {
    return { valid: false, errors: [`Template with id ${templateId} not found`] };
  }

  const errors: string[] = [];
  
  // Validate required fields
  Object.entries(template.interactiveFields.companyInfo).forEach(([fieldName, fieldDef]) => {
    if (fieldDef.required && (!customizations[fieldName] || customizations[fieldName].trim() === '')) {
      errors.push(`Required field '${fieldName}' is missing`);
    }
  });
  
  if (template.interactiveFields.systemInfo) {
    Object.entries(template.interactiveFields.systemInfo).forEach(([fieldName, fieldDef]) => {
      if (fieldDef.required && (!customizations[fieldName] || customizations[fieldName].trim() === '')) {
        errors.push(`Required field '${fieldName}' is missing`);
      }
    });
  }
  
  return { valid: errors.length === 0, errors };
}

// Template statistics
export function getTemplateStatistics() {
  const stats = {
    total: templateRegistry.length,
    byCategory: {} as Record<string, number>,
    byComplexity: {} as Record<string, number>,
    byAudience: {} as Record<string, number>,
    totalControls: new Set<string>(),
    totalTags: new Set<string>()
  };
  
  templateRegistry.forEach(template => {
    // Count by category
    stats.byCategory[template.category] = (stats.byCategory[template.category] || 0) + 1;
    
    // Count by complexity
    stats.byComplexity[template.metadata.complexity] = (stats.byComplexity[template.metadata.complexity] || 0) + 1;
    
    // Count by audience
    template.metadata.targetAudience.forEach(audience => {
      stats.byAudience[audience] = (stats.byAudience[audience] || 0) + 1;
    });
    
    // Collect controls and tags
    template.controls.forEach(control => stats.totalControls.add(control));
    template.metadata.tags.forEach(tag => stats.totalTags.add(tag));
  });
  
  return {
    ...stats,
    totalControls: stats.totalControls.size,
    totalTags: stats.totalTags.size
  };
}

// Export all templates for easy importing
export {
  cuiNetworkBoundaryDiagram,
  cmmcRiskRegister,
  cmmcAwarenessTrainingDeck,
  implementationRoadmap,
  accessControlPolicy
};
