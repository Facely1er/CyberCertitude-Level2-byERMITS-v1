/**
 * 📋 Template Management Service
 * Handles all template-related operations including CRUD, validation, and usage tracking
 */

import { AssessmentTemplate, TemplateReview, TemplateCustomization } from '../shared/types/documentation';
import { dataService } from './dataService';
import { logger } from '../utils/logger';
import { 
  templateRegistry, 
  TemplateContent, 
  getTemplateById, 
  getTemplatesByCategory, 
  getTemplatesByControl,
  searchTemplates,
  customizeTemplate,
  validateTemplateCustomization,
  getTemplateStatistics
} from '../data/templates';

export interface TemplateCreateData {
  name: string;
  description: string;
  frameworkId: string;
  industry: string;
  prefilledResponses: Record<string, number>;
  tags: string[];
  isPublic: boolean;
  organizationSize?: string[];
  complianceMapping?: Record<string, string>;
}

interface TemplateUpdateData extends Partial<TemplateCreateData> {
  id: string;
}

interface TemplateFilter {
  frameworkId?: string;
  industry?: string;
  isPublic?: boolean;
  tags?: string[];
  organizationSize?: string[];
  search?: string;
}

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
      // Load from localStorage for now - in production this would be from API
      const stored = localStorage.getItem('templates');
      if (stored) {
        this.templates = JSON.parse(stored).map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          lastModified: new Date(t.lastModified)
        }));
      } else {
        // Initialize with default templates
        this.initializeDefaultTemplates();
      }
      logger.debug('Templates loaded successfully', { count: this.templates.length });
    } catch (error) {
      logger.error('Failed to load templates:', error);
      this.templates = [];
    }
  }

  private saveTemplates(): void {
    try {
      localStorage.setItem('templates', JSON.stringify(this.templates));
      logger.debug('Templates saved successfully', { count: this.templates.length });
    } catch (error) {
      logger.error('Failed to save templates:', error);
      throw new Error('Failed to save templates');
    }
  }

  private initializeDefaultTemplates(): void {
    const defaultTemplates: AssessmentTemplate[] = [
      {
        id: 'cmmc-military-contractor',

        name: 'CMMC 2.0 Level 2 - Military Contractor Template',
        description: 'Comprehensive CMMC 2.0 Level 2 assessment template specifically designed for Government contractors handling CUI.',
        frameworkId: 'cmmc',
        industry: 'military',
        prefilledResponses: {
          'ac-1': 3, // Access Control Policy
          'ac-2': 2, // Account Management
          'ac-3': 3, // Access Enforcement
          'ac-4': 2, // Information Flow Enforcement
          'ac-5': 3, // Separation of Duties
          'ac-6': 3, // Least Privilege
          'ac-7': 2, // Unsuccessful Logon Attempts
          'ac-8': 3, // System Use Notification
          'ac-9': 3, // Previous Logon Notification
          'ac-10': 3, // Concurrent Session Control
          'ac-11': 3, // Session Lock
          'ac-12': 3, // Session Termination
          'ac-13': 2, // Supervision and Review
          'ac-14': 3, // Permitted Actions Without Identification
          'ac-15': 2, // Automated Marking
          'ac-16': 3, // Security Attributes
          'ac-17': 2, // Remote Access
          'ac-18': 2, // Wireless Access
          'ac-19': 2, // Access Control for Mobile Devices
          'ac-20': 2, // Use of External Systems
          'ac-21': 2, // Information Sharing
          'ac-22': 2, // Publicly Accessible Content
          'at-1': 3, // Security Awareness and Training Policy
          'at-2': 2, // Security Awareness Training
          'at-3': 2, // Role-Based Security Training
          'at-4': 2, // Security Training Records
          'au-1': 3, // Audit and Accountability Policy
          'au-2': 2, // Audit Events
          'au-3': 2, // Content of Audit Records
          'au-4': 2, // Audit Storage Capacity
          'au-5': 2, // Response to Audit Processing Failures
          'au-6': 2, // Audit Review, Analysis, and Reporting
          'au-7': 2, // Audit Reduction and Report Generation
          'au-8': 2, // Time Stamps
          'au-9': 2, // Protection of Audit Information
          'au-10': 2, // Non-Repudiation
          'au-11': 2, // Audit Record Retention
          'au-12': 2, // Audit Generation
          'ca-1': 3, // Security Assessment and Authorization Policy
          'ca-2': 2, // Security Assessments
          'ca-3': 2, // System Interconnections
          'ca-4': 2, // Security Certification
          'ca-5': 2, // Plan of Action and Milestones
          'ca-6': 2, // Security Authorization
          'ca-7': 2, // Continuous Monitoring
          'ca-8': 2, // Penetration Testing
          'ca-9': 2, // Internal System Connections
          'cm-1': 3, // Configuration Management Policy
          'cm-2': 2, // Baseline Configuration
          'cm-3': 2, // Configuration Change Control
          'cm-4': 2, // Security Impact Analysis
          'cm-5': 2, // Access Restrictions for Change
          'cm-6': 2, // Configuration Settings
          'cm-7': 2, // Least Functionality
          'cm-8': 2, // Information System Component Inventory
          'cm-9': 2, // Configuration Management Plan
          'cm-10': 2, // Software Usage Restrictions
          'cm-11': 2, // User-Installed Software
          'cp-1': 3, // Contingency Planning Policy
          'cp-2': 2, // Contingency Plan
          'cp-3': 2, // Contingency Training
          'cp-4': 2, // Contingency Plan Testing
          'cp-5': 2, // Contingency Plan Update
          'cp-6': 2, // Alternate Storage Sites
          'cp-7': 2, // Alternate Processing Sites
          'cp-8': 2, // Telecommunications Services
          'cp-9': 2, // Information System Backup
          'cp-10': 2, // Information System Recovery
          'cp-11': 2, // Alternate Communications Protocols
          'cp-12': 2, // Safe Mode
          'cp-13': 2, // Alternative Security Mechanisms
          'ia-1': 3, // Identification and Authentication Policy
          'ia-2': 2, // Identification and Authentication
          'ia-3': 2, // Device Identification and Authentication
          'ia-4': 2, // Identifier Management
          'ia-5': 2, // Authenticator Management
          'ia-6': 2, // Authenticator Feedback
          'ia-7': 2, // Cryptographic Module Authentication
          'ia-8': 2, // Identification and Authentication
          'ia-9': 2, // Service Identification and Authentication
          'ia-10': 2, // Adaptive Authentication
          'ia-11': 2, // Re-Authentication
          'ir-1': 3, // Incident Response Policy
          'ir-2': 2, // Incident Response Training
          'ir-3': 2, // Incident Response Testing
          'ir-4': 2, // Incident Handling
          'ir-5': 2, // Incident Monitoring
          'ir-6': 2, // Incident Reporting
          'ir-7': 2, // Incident Response Assistance
          'ir-8': 2, // Incident Response Plan
          'ir-9': 2, // Information Spillage Response
          'ir-10': 2, // Integrated Information Security Analysis Team
          'ma-1': 3, // Maintenance Policy
          'ma-2': 2, // Controlled Maintenance
          'ma-3': 2, // Maintenance Tools
          'ma-4': 2, // Nonlocal Maintenance
          'ma-5': 2, // Maintenance Personnel
          'ma-6': 2, // Timely Maintenance
          'mp-1': 3, // Media Protection Policy
          'mp-2': 2, // Media Access
          'mp-3': 2, // Media Marking
          'mp-4': 2, // Media Storage
          'mp-5': 2, // Media Transport
          'mp-6': 2, // Media Sanitization
          'mp-7': 2, // Media Use
          'pe-1': 3, // Physical and Environmental Protection Policy
          'pe-2': 2, // Physical Access Authorizations
          'pe-3': 2, // Physical Access Control
          'pe-4': 2, // Access Control for Transmission Medium
          'pe-5': 2, // Access Control for Output Devices
          'pe-6': 2, // Monitoring Physical Access
          'pe-7': 2, // Visitor Control
          'pe-8': 2, // Access Logs
          'pe-9': 2, // Power Equipment and Cabling
          'pe-10': 2, // Emergency Shutoff
          'pe-11': 2, // Emergency Power
          'pe-12': 2, // Emergency Lighting
          'pe-13': 2, // Fire Protection
          'pe-14': 2, // Temperature and Humidity Controls
          'pe-15': 2, // Water Damage Protection
          'pe-16': 2, // Delivery and Removal
          'pe-17': 2, // Alternate Work Site
          'pe-18': 2, // Location of Information System Components
          'pe-19': 2, // Information Leakage
          'pe-20': 2, // Asset Monitoring and Tracking
          'ps-1': 3, // Personnel Security Policy
          'ps-2': 2, // Position Risk Designation
          'ps-3': 2, // Personnel Screening
          'ps-4': 2, // Personnel Termination
          'ps-5': 2, // Personnel Transfer
          'ps-6': 2, // Access Agreements
          'ps-7': 2, // Third-Party Personnel Security
          'ps-8': 2, // Personnel Sanctions
          'ra-1': 3, // Risk Assessment Policy
          'ra-2': 2, // Security Categorization
          'ra-3': 2, // Risk Assessment
          'ra-4': 2, // Risk Assessment Update
          'ra-5': 2, // Vulnerability Scanning
          'sa-1': 3, // System and Services Acquisition Policy
          'sa-2': 2, // Allocation of Resources
          'sa-3': 2, // System Development Life Cycle
          'sa-4': 2, // Acquisition Process
          'sa-5': 2, // Information System Documentation
          'sa-6': 2, // Software Usage Restrictions
          'sa-7': 2, // User-Installed Software
          'sa-8': 2, // Security Engineering Principles
          'sa-9': 2, // External Information System Services
          'sa-10': 2, // Developer Configuration Management
          'sa-11': 2, // Developer Security Testing
          'sa-12': 2, // Supply Chain Protection
          'sa-13': 2, // Trustworthiness
          'sa-14': 2, // Critical Information System Components
          'sa-15': 2, // Development Process, Standards, and Tools
          'sa-16': 2, // Developer-Provided Training
          'sa-17': 2, // Developer Security Architecture
          'sa-18': 2, // Tamper Resistance and Detection
          'sa-19': 2, // Component Authenticity
          'sa-20': 2, // Customized Development of Critical Components
          'sa-21': 2, // Developer Screening
          'sa-22': 2, // Unsupported System Components
          'sc-1': 3, // System and Communications Protection Policy
          'sc-2': 2, // Application Partitioning
          'sc-3': 2, // Security Function Isolation
          'sc-4': 2, // Information in Shared Resources
          'sc-5': 2, // Denial of Service Protection
          'sc-6': 2, // Resource Availability
          'sc-7': 2, // Boundary Protection
          'sc-8': 2, // Transmission Confidentiality
          'sc-9': 2, // Transmission Integrity
          'sc-10': 2, // Network Disconnect
          'sc-11': 2, // Trusted Path
          'sc-12': 2, // Cryptographic Key Establishment
          'sc-13': 2, // Cryptographic Protection
          'sc-14': 2, // Public Key Infrastructure Certificates
          'sc-15': 2, // Collaborative Computing Devices
          'sc-16': 2, // Transmission of Security Attributes
          'sc-17': 2, // Public Key Infrastructure Certificates
          'sc-18': 2, // Mobile Code
          'sc-19': 2, // Voice Over Internet Protocol
          'sc-20': 2, // Secure Name/Address Resolution Service
          'sc-21': 2, // Secure Name/Address Resolution Service
          'sc-22': 2, // Architecture and Provisioning for Name/Address Resolution Service
          'sc-23': 2, // Session Authenticity
          'sc-24': 2, // Fail in Known State
          'sc-25': 2, // Thin Nodes
          'sc-26': 2, // Honeypots
          'sc-27': 2, // Platform-Independent Applications
          'sc-28': 2, // Protection of Information at Rest
          'sc-29': 2, // Heterogeneity
          'sc-30': 2, // Concealment and Misdirection
          'sc-31': 2, // Covert Channel Analysis
          'sc-32': 2, // Information System Partitioning
          'sc-33': 2, // Transmission Security
          'sc-34': 2, // Non-Modifiable Executable Programs
          'sc-35': 2, // Honeyclients
          'sc-36': 2, // Distributed Processing and Storage
          'sc-37': 2, // Out-of-Band Channels
          'sc-38': 2, // Operations Security
          'sc-39': 2, // Process Isolation
          'sc-40': 2, // Wireless Link Protection
          'sc-41': 2, // Port and I/O Device Access
          'sc-42': 2, // Sensor Capabilities and Data
          'sc-43': 2, // Usage Restrictions
          'sc-44': 2, // Detachable Media
          'sc-45': 2, // Portable Storage Devices
          'sc-46': 2, // Cross-Domain Policy Violations
          'sc-47': 2, // Alternative Communications Paths
          'sc-48': 2, // Application Partitioning
          'sc-49': 2, // Voice Over Internet Protocol
          'sc-50': 2, // Secure Name/Address Resolution Service
          'sc-51': 2, // Secure Name/Address Resolution Service
          'sc-52': 2, // Architecture and Provisioning for Name/Address Resolution Service
          'si-1': 3, // System and Information Integrity Policy
          'si-2': 2, // Flaw Remediation
          'si-3': 2, // Malicious Code Protection
          'si-4': 2, // Information System Monitoring
          'si-5': 2, // Security Alerts, Advisories, and Directives
          'si-6': 2, // Security Function Verification
          'si-7': 2, // Software, Firmware, and Information Integrity
          'si-8': 2, // Spam Protection
          'si-9': 2, // Information Input Restrictions
          'si-10': 2, // Information Input Validation
          'si-11': 2, // Error Handling
          'si-12': 2, // Information Output Handling and Retention
          'si-13': 2, // Predictable Failure Prevention
          'si-14': 2, // Non-Persistence
          'si-15': 2, // Information Output Filtering
          'si-16': 2, // Memory Protection
          'si-17': 2, // Fail-Safe Procedures
          'si-18': 2, // Personally Identifiable Information Processing
          'si-19': 2, // De-Identification
          'si-20': 2, // Tainting
          'si-21': 2, // Information System Monitoring
          'si-22': 2, // Information System Monitoring
        },
        tags: ['cmmc', 'military', 'contractor', 'cui', 'military'],
        isPublic: true,
        createdBy: 'system',
        createdAt: new Date(),
        lastModified: new Date(),
        version: '1.0.0',
        downloadCount: 0,
        rating: 4.8,
        organizationSize: ['small', 'medium', 'large'],
        complianceMapping: {
          'nist-800-171': 'CMMC 2.0 Level 2',
          'dfars': 'DFARS 252.204-7012',
          'cui': 'CUI Security Requirements'
        }
      },
      {
        id: 'cmmc-small-business',
        name: 'CMMC 2.0 Level 2 - Small Business Template',
        description: 'Streamlined CMMC 2.0 Level 2 assessment template designed for small businesses entering the military supply chain.',
        frameworkId: 'cmmc',
        industry: 'military',
        prefilledResponses: {
          'ac-1': 2,
          'ac-2': 1,
          'ac-3': 2,
          'ac-4': 1,
          'ac-5': 2,
          'ac-6': 2,
          'ac-7': 1,
          'ac-8': 2,
          'ac-9': 2,
          'ac-10': 2,
          'ac-11': 2,
          'ac-12': 2,
          'ac-13': 1,
          'ac-14': 2,
          'ac-15': 1,
          'ac-16': 2,
          'ac-17': 1,
          'ac-18': 1,
          'ac-19': 1,
          'ac-20': 1,
          'ac-21': 1,
          'ac-22': 1,
          'at-1': 2,
          'at-2': 1,
          'at-3': 1,
          'at-4': 1,
          'au-1': 2,
          'au-2': 1,
          'au-3': 1,
          'au-4': 1,
          'au-5': 1,
          'au-6': 1,
          'au-7': 1,
          'au-8': 1,
          'au-9': 1,
          'au-10': 1,
          'au-11': 1,
          'au-12': 1,
          'ca-1': 2,
          'ca-2': 1,
          'ca-3': 1,
          'ca-4': 1,
          'ca-5': 1,
          'ca-6': 1,
          'ca-7': 1,
          'ca-8': 1,
          'ca-9': 1,
          'ca-10': 1,
          'cm-1': 2,
          'cm-2': 1,
          'cm-3': 1,
          'cm-4': 1,
          'cm-5': 1,
          'cm-6': 1,
          'cm-7': 1,
          'cm-8': 1,
          'cm-9': 1,
          'cm-10': 1,
          'cm-11': 1,
          'cp-1': 2,
          'cp-2': 1,
          'cp-3': 1,
          'cp-4': 1,
          'cp-5': 1,
          'cp-6': 1,
          'cp-7': 1,
          'cp-8': 1,
          'cp-9': 1,
          'cp-10': 1,
          'cp-11': 1,
          'cp-12': 1,
          'cp-13': 1,
          'ia-1': 2,
          'ia-2': 1,
          'ia-3': 1,
          'ia-4': 1,
          'ia-5': 1,
          'ia-6': 1,
          'ia-7': 1,
          'ia-8': 1,
          'ia-9': 1,
          'ia-10': 1,
          'ia-11': 1,
          'ir-1': 2,
          'ir-2': 1,
          'ir-3': 1,
          'ir-4': 1,
          'ir-5': 1,
          'ir-6': 1,
          'ir-7': 1,
          'ir-8': 1,
          'ir-9': 1,
          'ir-10': 1,
          'ma-1': 2,
          'ma-2': 1,
          'ma-3': 1,
          'ma-4': 1,
          'ma-5': 1,
          'ma-6': 1,
          'mp-1': 2,
          'mp-2': 1,
          'mp-3': 1,
          'mp-4': 1,
          'mp-5': 1,
          'mp-6': 1,
          'mp-7': 1,
          'pe-1': 2,
          'pe-2': 1,
          'pe-3': 1,
          'pe-4': 1,
          'pe-5': 1,
          'pe-6': 1,
          'pe-7': 1,
          'pe-8': 1,
          'pe-9': 1,
          'pe-10': 1,
          'pe-11': 1,
          'pe-12': 1,
          'pe-13': 1,
          'pe-14': 1,
          'pe-15': 1,
          'pe-16': 1,
          'pe-17': 1,
          'pe-18': 1,
          'pe-19': 1,
          'pe-20': 1,
          'ps-1': 2,
          'ps-2': 1,
          'ps-3': 1,
          'ps-4': 1,
          'ps-5': 1,
          'ps-6': 1,
          'ps-7': 1,
          'ps-8': 1,
          'ra-1': 2,
          'ra-2': 1,
          'ra-3': 1,
          'ra-4': 1,
          'ra-5': 1,
          'sa-1': 2,
          'sa-2': 1,
          'sa-3': 1,
          'sa-4': 1,
          'sa-5': 1,
          'sa-6': 1,
          'sa-7': 1,
          'sa-8': 1,
          'sa-9': 1,
          'sa-10': 1,
          'sa-11': 1,
          'sa-12': 1,
          'sa-13': 1,
          'sa-14': 1,
          'sa-15': 1,
          'sa-16': 1,
          'sa-17': 1,
          'sa-18': 1,
          'sa-19': 1,
          'sa-20': 1,
          'sa-21': 1,
          'sa-22': 1,
          'sc-1': 2,
          'sc-2': 1,
          'sc-3': 1,
          'sc-4': 1,
          'sc-5': 1,
          'sc-6': 1,
          'sc-7': 1,
          'sc-8': 1,
          'sc-9': 1,
          'sc-10': 1,
          'sc-11': 1,
          'sc-12': 1,
          'sc-13': 1,
          'sc-14': 1,
          'sc-15': 1,
          'sc-16': 1,
          'sc-17': 1,
          'sc-18': 1,
          'sc-19': 1,
          'sc-20': 1,
          'sc-21': 1,
          'sc-22': 1,
          'sc-23': 1,
          'sc-24': 1,
          'sc-25': 1,
          'sc-26': 1,
          'sc-27': 1,
          'sc-28': 1,
          'sc-29': 1,
          'sc-30': 1,
          'sc-31': 1,
          'sc-32': 1,
          'sc-33': 1,
          'sc-34': 1,
          'sc-35': 1,
          'sc-36': 1,
          'sc-37': 1,
          'sc-38': 1,
          'sc-39': 1,
          'sc-40': 1,
          'sc-41': 1,
          'sc-42': 1,
          'sc-43': 1,
          'sc-44': 1,
          'sc-45': 1,
          'sc-46': 1,
          'sc-47': 1,
          'sc-48': 1,
          'sc-49': 1,
          'sc-50': 1,
          'sc-51': 1,
          'sc-52': 1,
          'si-1': 2,
          'si-2': 1,
          'si-3': 1,
          'si-4': 1,
          'si-5': 1,
          'si-6': 1,
          'si-7': 1,
          'si-8': 1,
          'si-9': 1,
          'si-10': 1,
          'si-11': 1,
          'si-12': 1,
          'si-13': 1,
          'si-14': 1,
          'si-15': 1,
          'si-16': 1,
          'si-17': 1,
          'si-18': 1,
          'si-19': 1,
          'si-20': 1,
          'si-21': 1,
          'si-22': 1,
        },
        tags: ['cmmc', 'small-business', 'military', 'simplified'],
        isPublic: true,
        createdBy: 'system',
        createdAt: new Date(),
        lastModified: new Date(),
        version: '1.0.0',
        downloadCount: 0,
        rating: 4.5,
        organizationSize: ['small'],
        complianceMapping: {
          'nist-800-171': 'CMMC 2.0 Level 2',
          'dfars': 'DFARS 252.204-7012'
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

  public getTemplatesByFilter(filter: TemplateFilter): AssessmentTemplate[] {
    return this.templates.filter(template => {
      if (filter.frameworkId && template.frameworkId !== filter.frameworkId) return false;
      if (filter.industry && template.industry !== filter.industry) return false;
      if (filter.isPublic !== undefined && template.isPublic !== filter.isPublic) return false;
      if (filter.tags && filter.tags.length > 0) {
        const hasMatchingTag = filter.tags.some(tag => template.tags.includes(tag));
        if (!hasMatchingTag) return false;
      }
      if (filter.organizationSize && filter.organizationSize.length > 0) {
        const hasMatchingSize = filter.organizationSize.some(size => 
          template.organizationSize?.includes(size)
        );
        if (!hasMatchingSize) return false;
      }
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        const matchesSearch = template.name.toLowerCase().includes(searchLower) ||
                             template.description.toLowerCase().includes(searchLower) ||
                             template.tags.some(tag => tag.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }
      return true;
    });
  }

  public createTemplate(templateData: TemplateCreateData): AssessmentTemplate {
    const now = new Date();
    const newTemplate: AssessmentTemplate = {
      id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...templateData,
      createdBy: 'user', // In a real app, this would be the current user ID
      createdAt: now,
      lastModified: now,
      version: '1.0.0',
      downloadCount: 0,
      rating: 0,
      reviews: [],
      customizations: []
    };

    this.templates.push(newTemplate);
    this.saveTemplates();

    logger.info('Template created successfully', { 
      templateId: newTemplate.id, 
      name: newTemplate.name 
    });

    return newTemplate;
  }

  public updateTemplate(templateData: TemplateUpdateData): AssessmentTemplate {
    const templateIndex = this.templates.findIndex(template => template.id === templateData.id);
    if (templateIndex === -1) {
      throw new Error(`Template with id ${templateData.id} not found`);
    }

    const updatedTemplate: AssessmentTemplate = {
      ...this.templates[templateIndex],
      ...templateData,
      lastModified: new Date()
    };

    this.templates[templateIndex] = updatedTemplate;
    this.saveTemplates();

    logger.info('Template updated successfully', { 
      templateId: updatedTemplate.id, 
      name: updatedTemplate.name 
    });

    return updatedTemplate;
  }

  public deleteTemplate(templateId: string): void {
    const templateIndex = this.templates.findIndex(template => template.id === templateId);
    if (templateIndex === -1) {
      throw new Error(`Template with id ${templateId} not found`);
    }

    const deletedTemplate = this.templates[templateIndex];
    this.templates.splice(templateIndex, 1);
    this.saveTemplates();

    logger.info('Template deleted successfully', { 
      templateId: deletedTemplate.id, 
      name: deletedTemplate.name 
    });
  }

  public incrementDownloadCount(templateId: string): void {
    const template = this.getTemplateById(templateId);
    if (template) {
      template.downloadCount++;
      this.saveTemplates();
    }
  }

  public addReview(templateId: string, review: Omit<TemplateReview, 'id' | 'createdAt'>): void {
    const template = this.getTemplateById(templateId);
    if (template) {
      const newReview: TemplateReview = {
        ...review,
        id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date()
      };

      if (!template.reviews) {
        template.reviews = [];
      }
      template.reviews.push(newReview);

      // Update average rating
      const totalRating = template.reviews.reduce((sum, r) => sum + r.rating, 0);
      template.rating = totalRating / template.reviews.length;

      this.saveTemplates();

      logger.info('Review added successfully', { 
        templateId, 
        reviewId: newReview.id 
      });
    }
  }

  public getTemplatesByFramework(frameworkId: string): AssessmentTemplate[] {
    return this.templates.filter(template => template.frameworkId === frameworkId);
  }

  public getPopularTemplates(limit: number = 10): AssessmentTemplate[] {
    return this.templates
      .sort((a, b) => b.downloadCount - a.downloadCount)
      .slice(0, limit);
  }

  public getRecentTemplates(limit: number = 10): AssessmentTemplate[] {
    return this.templates
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  // ========================================================================
  // ENHANCED TEMPLATE CONTENT METHODS
  // ========================================================================

  /**
   * Get content template by ID from the template registry
   */
  public getContentTemplate(templateId: string): TemplateContent | null {
    try {
      const template = getTemplateById(templateId);
      logger.debug('Content template retrieved', { templateId, found: !!template });
      return template;
    } catch (error) {
      logger.error('Failed to get content template:', error);
      return null;
    }
  }

  /**
   * Get all content templates from the registry
   */
  public getAllContentTemplates(): TemplateContent[] {
    try {
      logger.debug('All content templates retrieved', { count: templateRegistry.length });
      return [...templateRegistry];
    } catch (error) {
      logger.error('Failed to get all content templates:', error);
      return [];
    }
  }

  /**
   * Get content templates by category
   */
  public getContentTemplatesByCategory(category: string): TemplateContent[] {
    try {
      const templates = getTemplatesByCategory(category);
      logger.debug('Content templates retrieved by category', { category, count: templates.length });
      return templates;
    } catch (error) {
      logger.error('Failed to get content templates by category:', error);
      return [];
    }
  }

  /**
   * Get content templates by CMMC control
   */
  public getContentTemplatesByControl(controlId: string): TemplateContent[] {
    try {
      const templates = getTemplatesByControl(controlId);
      logger.debug('Content templates retrieved by control', { controlId, count: templates.length });
      return templates;
    } catch (error) {
      logger.error('Failed to get content templates by control:', error);
      return [];
    }
  }

  /**
   * Search content templates
   */
  public searchContentTemplates(query: string): TemplateContent[] {
    try {
      const templates = searchTemplates(query);
      logger.debug('Content templates searched', { query, count: templates.length });
      return templates;
    } catch (error) {
      logger.error('Failed to search content templates:', error);
      return [];
    }
  }

  /**
   * Customize template with user data
   */
  public customizeContentTemplate(templateId: string, customizations: any): string {
    try {
      const customizedContent = customizeTemplate(templateId, customizations);
      logger.info('Content template customized', { templateId, customizationsCount: Object.keys(customizations).length });
      return customizedContent;
    } catch (error) {
      logger.error('Failed to customize content template:', error);
      throw new Error(`Failed to customize template: ${(error as Error).message}`);
    }
  }

  /**
   * Validate template customization
   */
  public validateContentTemplateCustomization(templateId: string, customizations: any): { valid: boolean; errors: string[] } {
    try {
      const validation = validateTemplateCustomization(templateId, customizations);
      logger.debug('Content template customization validated', { templateId, valid: validation.valid, errors: validation.errors.length });
      return validation;
    } catch (error) {
      logger.error('Failed to validate content template customization:', error);
      return { valid: false, errors: ['Validation failed'] };
    }
  }

  /**
   * Get template statistics
   */
  public getContentTemplateStatistics() {
    try {
      const stats = getTemplateStatistics();
      logger.debug('Content template statistics retrieved', stats);
      return stats;
    } catch (error) {
      logger.error('Failed to get content template statistics:', error);
      return null;
    }
  }

  /**
   * Export template to different formats
   */
  public async exportContentTemplate(templateId: string, customizations: any, format: 'markdown' | 'html' | 'pdf' | 'docx'): Promise<string | Blob> {
    try {
      const customizedContent = this.customizeContentTemplate(templateId, customizations);
      
      switch (format) {
        case 'markdown':
          logger.info('Content template exported to markdown', { templateId });
          return customizedContent;
          
        case 'html':
          const htmlContent = this.convertMarkdownToHTML(customizedContent);
          logger.info('Content template exported to HTML', { templateId });
          return htmlContent;
          
        case 'pdf':
          const pdfBlob = await this.convertHTMLToPDF(customizedContent);
          logger.info('Content template exported to PDF', { templateId });
          return pdfBlob;
          
        case 'docx':
          const docxBlob = await this.convertHTMLToDOCX(customizedContent);
          logger.info('Content template exported to DOCX', { templateId });
          return docxBlob;
          
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }
    } catch (error) {
      logger.error('Failed to export content template:', error);
      throw new Error(`Failed to export template: ${(error as Error).message}`);
    }
  }

  /**
   * Convert markdown to HTML
   */
  private convertMarkdownToHTML(markdown: string): string {
    // Basic markdown to HTML conversion
    let html = markdown
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/`(.*)`/gim, '<code>$1</code>')
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
      .replace(/\n\n/gim, '</p><p>')
      .replace(/\n/gim, '<br>');

    // Wrap in proper HTML structure
    html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>CMMC Template</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
          h1, h2, h3, h4 { color: #333; }
          table { border-collapse: collapse; width: 100%; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          code { background-color: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
          li { margin: 5px 0; }
        </style>
      </head>
      <body>
        <p>${html}</p>
      </body>
      </html>
    `;

    return html;
  }

  /**
   * Convert HTML to PDF (placeholder - would use a library like Puppeteer in production)
   */
  private async convertHTMLToPDF(html: string): Promise<Blob> {
    // This is a placeholder implementation
    // In production, you would use a library like Puppeteer or jsPDF
    logger.warn('PDF conversion not implemented - returning HTML as text');
    return new Blob([html], { type: 'text/html' });
  }

  /**
   * Convert HTML to DOCX (placeholder - would use a library like docx in production)
   */
  private async convertHTMLToDOCX(html: string): Promise<Blob> {
    // This is a placeholder implementation
    // In production, you would use a library like docx or mammoth
    logger.warn('DOCX conversion not implemented - returning HTML as text');
    return new Blob([html], { type: 'text/html' });
  }

  /**
   * Auto-populate template fields from user data
   */
  public autoPopulateTemplateFields(templateId: string, userData: any): any {
    try {
      const template = this.getContentTemplate(templateId);
      if (!template) {
        throw new Error(`Template with id ${templateId} not found`);
      }

      const autoPopulated = { ...userData };

      // Auto-populate common fields
      if (userData.userProfile) {
        autoPopulated.companyName = userData.userProfile.companyName || userData.userProfile.organization;
        autoPopulated.ciso = userData.userProfile.ciso || userData.userProfile.securityOfficer;
        autoPopulated.contact = userData.userProfile.email || userData.userProfile.contactEmail;
      }

      // Auto-populate from assessment data
      if (userData.assessmentData) {
        autoPopulated.systemName = userData.assessmentData.systemName || 'CMMC System';
        autoPopulated.systemDescription = userData.assessmentData.description || 'CMMC 2.0 Level 2 System';
      }

      // Auto-populate dates
      autoPopulated.effectiveDate = new Date().toLocaleDateString();
      autoPopulated.reviewDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString();

      logger.info('Template fields auto-populated', { templateId, fieldsCount: Object.keys(autoPopulated).length });
      return autoPopulated;
    } catch (error) {
      logger.error('Failed to auto-populate template fields:', error);
      return userData;
    }
  }

  /**
   * Get template preview (first 500 characters)
   */
  public getTemplatePreview(templateId: string): string {
    try {
      const template = this.getContentTemplate(templateId);
      if (!template) {
        return '';
      }

      // Remove markdown formatting for preview
      const preview = template.content
        .replace(/#{1,6}\s+/g, '') // Remove headers
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
        .replace(/\*(.*?)\*/g, '$1') // Remove italic
        .replace(/`(.*?)`/g, '$1') // Remove code
        .replace(/\|.*\|/g, '') // Remove tables
        .substring(0, 500);

      return preview + (template.content.length > 500 ? '...' : '');
    } catch (error) {
      logger.error('Failed to get template preview:', error);
      return '';
    }
  }
}

export const templateService = TemplateService.getInstance();