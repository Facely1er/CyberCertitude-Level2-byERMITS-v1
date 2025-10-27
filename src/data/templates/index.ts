/**
 * Template Registry System
 * Central registry for all CMMC 2.0 compliance templates
 */

import { cuiNetworkBoundaryDiagram } from './specialized/networkDiagrams';
import { cmmcRiskRegister } from './specialized/riskRegister';
import { cmmcAwarenessTrainingDeck } from './specialized/trainingDeck';
import { implementationRoadmap } from './specialized/implementationRoadmap';
import { accessControlPolicy } from './policies/accessControl';
import { auditAndAccountabilityPolicy } from './policies/auditAndAccountability';
import { awarenessAndTrainingPolicy } from './policies/awarenessAndTraining';
import { configurationManagementPolicy } from './policies/configurationManagement';
import { identificationAndAuthenticationPolicy } from './policies/identificationAndAuthentication';
import { incidentResponsePolicy } from './policies/incidentResponse';
import { riskAssessmentPolicy } from './policies/riskAssessment';
import { systemAndCommunicationsProtectionPolicy } from './policies/systemAndCommunicationsProtection';
import { systemAndInformationIntegrityPolicy } from './policies/systemAndInformationIntegrity';
import { systemSecurityPlan } from './policies/systemSecurityPlan';
import { maintenancePolicy } from './policies/maintenance';
import { mediaProtectionPolicy } from './policies/mediaProtection';
import { personnelSecurityPolicy } from './policies/personnelSecurity';
import { physicalProtectionPolicy } from './policies/physicalProtection';
import { securityAssessmentPolicy } from './policies/securityAssessment';

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
  },
  {
    id: auditAndAccountabilityPolicy.id,
    name: auditAndAccountabilityPolicy.name,
    category: auditAndAccountabilityPolicy.category as 'policy',
    type: auditAndAccountabilityPolicy.type,
    description: 'Comprehensive audit and accountability policy covering AU domain requirements',
    content: auditAndAccountabilityPolicy.content,
    controls: auditAndAccountabilityPolicy.controls,
    interactiveFields: auditAndAccountabilityPolicy.interactiveFields,
    metadata: {
      ...auditAndAccountabilityPolicy.metadata,
      tags: ['policy', 'audit', 'accountability', 'logging', 'monitoring'],
      framework: 'CMMC 2.0',
      complianceLevel: 'Level 2'
    }
  },
  {
    id: awarenessAndTrainingPolicy.id,
    name: awarenessAndTrainingPolicy.name,
    category: awarenessAndTrainingPolicy.category as 'policy',
    type: awarenessAndTrainingPolicy.type,
    description: 'Comprehensive awareness and training policy covering AT domain requirements',
    content: awarenessAndTrainingPolicy.content,
    controls: awarenessAndTrainingPolicy.controls,
    interactiveFields: awarenessAndTrainingPolicy.interactiveFields,
    metadata: {
      ...awarenessAndTrainingPolicy.metadata,
      tags: ['policy', 'training', 'awareness', 'education', 'personnel'],
      framework: 'CMMC 2.0',
      complianceLevel: 'Level 2'
    }
  },
  {
    id: configurationManagementPolicy.id,
    name: configurationManagementPolicy.name,
    category: configurationManagementPolicy.category as 'policy',
    type: configurationManagementPolicy.type,
    description: 'Comprehensive configuration management policy covering CM domain requirements',
    content: configurationManagementPolicy.content,
    controls: configurationManagementPolicy.controls,
    interactiveFields: configurationManagementPolicy.interactiveFields,
    metadata: {
      ...configurationManagementPolicy.metadata,
      tags: ['policy', 'configuration', 'management', 'baselines', 'change-control'],
      framework: 'CMMC 2.0',
      complianceLevel: 'Level 2'
    }
  },
  {
    id: identificationAndAuthenticationPolicy.id,
    name: identificationAndAuthenticationPolicy.name,
    category: identificationAndAuthenticationPolicy.category as 'policy',
    type: identificationAndAuthenticationPolicy.type,
    description: 'Comprehensive identification and authentication policy covering IA domain requirements',
    content: identificationAndAuthenticationPolicy.content,
    controls: identificationAndAuthenticationPolicy.controls,
    interactiveFields: identificationAndAuthenticationPolicy.interactiveFields,
    metadata: {
      ...identificationAndAuthenticationPolicy.metadata,
      tags: ['policy', 'authentication', 'identification', 'MFA', 'passwords'],
      framework: 'CMMC 2.0',
      complianceLevel: 'Level 2'
    }
  },
  {
    id: incidentResponsePolicy.id,
    name: incidentResponsePolicy.name,
    category: incidentResponsePolicy.category as 'policy',
    type: incidentResponsePolicy.type,
    description: 'Comprehensive incident response policy covering IR domain requirements',
    content: incidentResponsePolicy.content,
    controls: incidentResponsePolicy.controls,
    interactiveFields: incidentResponsePolicy.interactiveFields,
    metadata: {
      ...incidentResponsePolicy.metadata,
      tags: ['policy', 'incident', 'response', 'cybersecurity', 'emergency'],
      framework: 'CMMC 2.0',
      complianceLevel: 'Level 2'
    }
  },
  {
    id: riskAssessmentPolicy.id,
    name: riskAssessmentPolicy.name,
    category: riskAssessmentPolicy.category as 'policy',
    type: riskAssessmentPolicy.type,
    description: 'Comprehensive risk assessment policy covering RA domain requirements',
    content: riskAssessmentPolicy.content,
    controls: riskAssessmentPolicy.controls,
    interactiveFields: riskAssessmentPolicy.interactiveFields,
    metadata: {
      ...riskAssessmentPolicy.metadata,
      tags: ['policy', 'risk', 'assessment', 'management', 'evaluation'],
      framework: 'CMMC 2.0',
      complianceLevel: 'Level 2'
    }
  },
  {
    id: systemAndCommunicationsProtectionPolicy.id,
    name: systemAndCommunicationsProtectionPolicy.name,
    category: systemAndCommunicationsProtectionPolicy.category as 'policy',
    type: systemAndCommunicationsProtectionPolicy.type,
    description: 'Comprehensive system and communications protection policy covering SC domain requirements',
    content: systemAndCommunicationsProtectionPolicy.content,
    controls: systemAndCommunicationsProtectionPolicy.controls,
    interactiveFields: systemAndCommunicationsProtectionPolicy.interactiveFields,
    metadata: {
      ...systemAndCommunicationsProtectionPolicy.metadata,
      tags: ['policy', 'system-protection', 'communications', 'network', 'encryption'],
      framework: 'CMMC 2.0',
      complianceLevel: 'Level 2'
    }
  },
  {
    id: systemAndInformationIntegrityPolicy.id,
    name: systemAndInformationIntegrityPolicy.name,
    category: systemAndInformationIntegrityPolicy.category as 'policy',
    type: systemAndInformationIntegrityPolicy.type,
    description: 'Comprehensive system and information integrity policy covering SI domain requirements',
    content: systemAndInformationIntegrityPolicy.content,
    controls: systemAndInformationIntegrityPolicy.controls,
    interactiveFields: systemAndInformationIntegrityPolicy.interactiveFields,
    metadata: {
      ...systemAndInformationIntegrityPolicy.metadata,
      tags: ['policy', 'system-integrity', 'information-integrity', 'monitoring', 'malware'],
      framework: 'CMMC 2.0',
      complianceLevel: 'Level 2'
    }
  },
  {
    id: systemSecurityPlan.id,
    name: systemSecurityPlan.name,
    category: systemSecurityPlan.category as 'policy',
    type: systemSecurityPlan.type,
    description: 'Comprehensive System Security Plan covering all 110 CMMC 2.0 Level 2 controls',
    content: systemSecurityPlan.content,
    controls: systemSecurityPlan.controls,
    interactiveFields: systemSecurityPlan.interactiveFields,
    metadata: {
      ...systemSecurityPlan.metadata,
      tags: ['policy', 'SSP', 'comprehensive', 'system-security-plan', 'all-controls'],
      framework: 'CMMC 2.0',
      complianceLevel: 'Level 2'
    }
  },
  {
    id: maintenancePolicy.id,
    name: maintenancePolicy.name,
    category: 'policy',
    type: maintenancePolicy.type,
    description: 'Maintenance policy covering MA domain requirements',
    content: maintenancePolicy.content,
    controls: maintenancePolicy.controls,
    interactiveFields: maintenancePolicy.interactiveFields,
    metadata: {
      ...maintenancePolicy.metadata,
      tags: ['policy', 'maintenance', 'system', 'hardware'],
      framework: 'CMMC 2.0',
      complianceLevel: 'Level 2'
    }
  },
  {
    id: mediaProtectionPolicy.id,
    name: mediaProtectionPolicy.name,
    category: 'policy',
    type: mediaProtectionPolicy.type,
    description: 'Media protection policy covering MP domain requirements',
    content: mediaProtectionPolicy.content,
    controls: mediaProtectionPolicy.controls,
    interactiveFields: mediaProtectionPolicy.interactiveFields,
    metadata: {
      ...mediaProtectionPolicy.metadata,
      tags: ['policy', 'media', 'protection', 'sanitization'],
      framework: 'CMMC 2.0',
      complianceLevel: 'Level 2'
    }
  },
  {
    id: personnelSecurityPolicy.id,
    name: personnelSecurityPolicy.name,
    category: 'policy',
    type: personnelSecurityPolicy.type,
    description: 'Personnel security policy covering PS domain requirements',
    content: personnelSecurityPolicy.content,
    controls: personnelSecurityPolicy.controls,
    interactiveFields: personnelSecurityPolicy.interactiveFields,
    metadata: {
      ...personnelSecurityPolicy.metadata,
      tags: ['policy', 'personnel', 'security', 'background'],
      framework: 'CMMC 2.0',
      complianceLevel: 'Level 2'
    }
  },
  {
    id: physicalProtectionPolicy.id,
    name: physicalProtectionPolicy.name,
    category: 'policy',
    type: physicalProtectionPolicy.type,
    description: 'Physical protection policy covering PE domain requirements',
    content: physicalProtectionPolicy.content,
    controls: physicalProtectionPolicy.controls,
    interactiveFields: physicalProtectionPolicy.interactiveFields,
    metadata: {
      ...physicalProtectionPolicy.metadata,
      tags: ['policy', 'physical', 'security', 'access-control'],
      framework: 'CMMC 2.0',
      complianceLevel: 'Level 2'
    }
  },
  {
    id: securityAssessmentPolicy.id,
    name: securityAssessmentPolicy.name,
    category: 'policy',
    type: securityAssessmentPolicy.type,
    description: 'Security assessment policy covering CA domain requirements',
    content: securityAssessmentPolicy.content,
    controls: securityAssessmentPolicy.controls,
    interactiveFields: securityAssessmentPolicy.interactiveFields,
    metadata: {
      ...securityAssessmentPolicy.metadata,
      tags: ['policy', 'assessment', 'security', 'testing'],
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
  accessControlPolicy,
  auditAndAccountabilityPolicy,
  awarenessAndTrainingPolicy,
  configurationManagementPolicy,
  identificationAndAuthenticationPolicy,
  incidentResponsePolicy,
  riskAssessmentPolicy,
  systemAndCommunicationsProtectionPolicy,
  systemAndInformationIntegrityPolicy,
  systemSecurityPlan,
  maintenancePolicy,
  mediaProtectionPolicy,
  personnelSecurityPolicy,
  physicalProtectionPolicy,
  securityAssessmentPolicy
};
