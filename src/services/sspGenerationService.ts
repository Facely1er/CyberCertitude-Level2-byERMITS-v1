/**
 * 📄 SSP Generation Service
 * Generates System Security Plans from CMMC assessment data
 */

import { AssessmentData } from '../shared/types/assessment';
import { logger } from '../utils/logger';

export interface OrganizationInfo {
  name: string;
  address: string;
  contact: string;
  systemName: string;
  systemDescription: string;
}

export interface SSPDocument {
  id: string;
  organization: string;
  systemName: string;
  generatedDate: Date;
  version: string;
  sections: SSPSection[];
  summary: SSPSummary;
}

export interface SSPSection {
  id: string;
  title: string;
  content: string;
  subsections: SSPSubsection[];
}

export interface SSPSubsection {
  id: string;
  title: string;
  content: string;
  controls: string[];
}

export interface SSPSummary {
  totalControls: number;
  implementedControls: number;
  partiallyImplementedControls: number;
  notImplementedControls: number;
  complianceLevel: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

class SSPGenerationService {
  private static instance: SSPGenerationService;

  private constructor() {}

  public static getInstance(): SSPGenerationService {
    if (!SSPGenerationService.instance) {
      SSPGenerationService.instance = new SSPGenerationService();
    }
    return SSPGenerationService.instance;
  }

  public generateSSP(assessment: AssessmentData, organizationInfo: OrganizationInfo): SSPDocument {
    try {
      const sspId = `ssp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const generatedDate = new Date();

      // Calculate summary statistics
      const summary = this.calculateSummary(assessment);

      // Generate sections based on assessment data
      const sections = this.generateSections(assessment, organizationInfo);

      const ssp: SSPDocument = {
        id: sspId,
        organization: organizationInfo.name,
        systemName: organizationInfo.systemName,
        generatedDate,
        version: '1.0',
        sections,
        summary
      };

      logger.info('SSP generated successfully', { 
        sspId, 
        organization: organizationInfo.name,
        controls: summary.totalControls 
      });

      return ssp;
    } catch (error) {
      logger.error('Failed to generate SSP:', error);
      throw new Error(`Failed to generate SSP: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private calculateSummary(assessment: AssessmentData): SSPSummary {
    const responses = assessment.responses || {};
    const totalControls = Object.keys(responses).length;
    
    let implementedControls = 0;
    let partiallyImplementedControls = 0;
    let notImplementedControls = 0;

    Object.values(responses).forEach(response => {
      if (response === 3) {
        implementedControls++;
      } else if (response === 2) {
        partiallyImplementedControls++;
      } else {
        notImplementedControls++;
      }
    });

    const complianceLevel = totalControls > 0 ? (implementedControls / totalControls) * 100 : 0;
    
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (complianceLevel < 25) {
      riskLevel = 'critical';
    } else if (complianceLevel < 50) {
      riskLevel = 'high';
    } else if (complianceLevel < 75) {
      riskLevel = 'medium';
    }

    return {
      totalControls,
      implementedControls,
      partiallyImplementedControls,
      notImplementedControls,
      complianceLevel,
      riskLevel
    };
  }

  private generateSections(assessment: AssessmentData, organizationInfo: OrganizationInfo): SSPSection[] {
    return [
      {
        id: 'executive_summary',
        title: 'Executive Summary',
        content: `This System Security Plan (SSP) documents the security controls implemented for the ${organizationInfo.systemName} system at ${organizationInfo.name}. The system is designed to meet CMMC Level ${assessment.framework.includes('2.0') ? '2' : '1'} requirements and protect Controlled Unclassified Information (CUI) in accordance with applicable federal regulations.`,
        subsections: [
          {
            id: 'system_overview',
            title: 'System Overview',
            content: organizationInfo.systemDescription || 'System description not provided.',
            controls: []
          }
        ]
      },
      {
        id: 'system_description',
        title: 'System Description',
        content: `The ${organizationInfo.systemName} system is a critical component of ${organizationInfo.name}'s information technology infrastructure. This section provides detailed information about the system's purpose, architecture, and security boundaries.`,
        subsections: [
          {
            id: 'system_purpose',
            title: 'System Purpose',
            content: organizationInfo.systemDescription || 'System purpose not specified.',
            controls: []
          },
          {
            id: 'system_architecture',
            title: 'System Architecture',
            content: 'System architecture details would be documented here based on the organization\'s specific implementation.',
            controls: []
          }
        ]
      },
      {
        id: 'security_controls',
        title: 'Security Controls Implementation',
        content: 'This section documents the implementation of security controls required for CMMC compliance.',
        subsections: this.generateControlSections(assessment)
      },
      {
        id: 'risk_assessment',
        title: 'Risk Assessment',
        content: 'This section provides an overview of the risk assessment conducted for the system and the risk mitigation strategies implemented.',
        subsections: [
          {
            id: 'threat_landscape',
            title: 'Threat Landscape',
            content: 'Analysis of current threats and vulnerabilities affecting the system.',
            controls: []
          },
          {
            id: 'risk_mitigation',
            title: 'Risk Mitigation Strategies',
            content: 'Documentation of risk mitigation strategies and controls implemented.',
            controls: []
          }
        ]
      },
      {
        id: 'incident_response',
        title: 'Incident Response',
        content: 'This section outlines the incident response procedures and capabilities for the system.',
        subsections: [
          {
            id: 'response_procedures',
            title: 'Response Procedures',
            content: 'Detailed procedures for responding to security incidents.',
            controls: []
          }
        ]
      }
    ];
  }

  private generateControlSections(assessment: AssessmentData): SSPSubsection[] {
    const responses = assessment.responses || {};
    const controlSections: SSPSubsection[] = [];

    // Group controls by domain (simplified mapping)
    const controlDomains = {
      'Access Control': [],
      'Awareness and Training': [],
      'Audit and Accountability': [],
      'Configuration Management': [],
      'Identification and Authentication': [],
      'Incident Response': [],
      'Maintenance': [],
      'Media Protection': [],
      'Personnel Security': [],
      'Physical Protection': [],
      'Recovery': [],
      'Risk Management': [],
      'Security Assessment': [],
      'System and Communications Protection': [],
      'System and Information Integrity': []
    };

    // Map controls to domains (simplified - in real implementation, this would be more comprehensive)
    Object.entries(responses).forEach(([controlId, response]) => {
      const domain = this.getControlDomain(controlId);
      if (controlDomains[domain]) {
        controlDomains[domain].push(controlId);
      }
    });

    // Generate subsections for each domain
    Object.entries(controlDomains).forEach(([domain, controls]) => {
      if (controls.length > 0) {
        const implementedCount = controls.filter(controlId => responses[controlId] === 3).length;
        const partiallyImplementedCount = controls.filter(controlId => responses[controlId] === 2).length;
        const notImplementedCount = controls.length - implementedCount - partiallyImplementedCount;

        controlSections.push({
          id: domain.toLowerCase().replace(/\s+/g, '_'),
          title: domain,
          content: `This section covers the implementation of ${domain} controls. Status: ${implementedCount} fully implemented, ${partiallyImplementedCount} partially implemented, ${notImplementedCount} not implemented.`,
          controls
        });
      }
    });

    return controlSections;
  }

  private getControlDomain(controlId: string): string {
    // Simplified mapping - in real implementation, this would be more comprehensive
    if (controlId.includes('AC') || controlId.includes('access')) return 'Access Control';
    if (controlId.includes('AT') || controlId.includes('awareness')) return 'Awareness and Training';
    if (controlId.includes('AU') || controlId.includes('audit')) return 'Audit and Accountability';
    if (controlId.includes('CM') || controlId.includes('configuration')) return 'Configuration Management';
    if (controlId.includes('IA') || controlId.includes('identification')) return 'Identification and Authentication';
    if (controlId.includes('IR') || controlId.includes('incident')) return 'Incident Response';
    if (controlId.includes('MA') || controlId.includes('maintenance')) return 'Maintenance';
    if (controlId.includes('MP') || controlId.includes('media')) return 'Media Protection';
    if (controlId.includes('PS') || controlId.includes('personnel')) return 'Personnel Security';
    if (controlId.includes('PE') || controlId.includes('physical')) return 'Physical Protection';
    if (controlId.includes('CP') || controlId.includes('recovery')) return 'Recovery';
    if (controlId.includes('RA') || controlId.includes('risk')) return 'Risk Management';
    if (controlId.includes('CA') || controlId.includes('assessment')) return 'Security Assessment';
    if (controlId.includes('SC') || controlId.includes('communications')) return 'System and Communications Protection';
    if (controlId.includes('SI') || controlId.includes('integrity')) return 'System and Information Integrity';
    
    return 'Other';
  }

  public generateHTML(ssp: SSPDocument): string {
    try {
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>System Security Plan - ${ssp.systemName}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; color: #333; }
        .header { border-bottom: 2px solid #0066cc; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #0066cc; margin: 0; }
        .header .meta { color: #666; font-size: 14px; margin-top: 10px; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #0066cc; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
        .section h3 { color: #333; margin-top: 20px; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .summary h3 { margin-top: 0; }
        .summary-item { margin: 10px 0; }
        .controls-list { margin: 10px 0; }
        .controls-list li { margin: 5px 0; }
        .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>System Security Plan (SSP)</h1>
        <div class="meta">
            <strong>Organization:</strong> ${ssp.organization}<br>
            <strong>System:</strong> ${ssp.systemName}<br>
            <strong>Generated:</strong> ${ssp.generatedDate.toLocaleDateString()}<br>
            <strong>Version:</strong> ${ssp.version}
        </div>
    </div>

    <div class="summary">
        <h3>Compliance Summary</h3>
        <div class="summary-item"><strong>Total Controls:</strong> ${ssp.summary.totalControls}</div>
        <div class="summary-item"><strong>Implemented:</strong> ${ssp.summary.implementedControls}</div>
        <div class="summary-item"><strong>Partially Implemented:</strong> ${ssp.summary.partiallyImplementedControls}</div>
        <div class="summary-item"><strong>Not Implemented:</strong> ${ssp.summary.notImplementedControls}</div>
        <div class="summary-item"><strong>Compliance Level:</strong> ${ssp.summary.complianceLevel.toFixed(1)}%</div>
        <div class="summary-item"><strong>Risk Level:</strong> ${ssp.summary.riskLevel.toUpperCase()}</div>
    </div>

    ${ssp.sections.map(section => `
        <div class="section">
            <h2>${section.title}</h2>
            <p>${section.content}</p>
            ${section.subsections.map(subsection => `
                <h3>${subsection.title}</h3>
                <p>${subsection.content}</p>
                ${subsection.controls.length > 0 ? `
                    <div class="controls-list">
                        <strong>Related Controls:</strong>
                        <ul>
                            ${subsection.controls.map(control => `<li>${control}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            `).join('')}
        </div>
    `).join('')}

    <div class="footer">
        <p>This document was automatically generated by the CMMC Assessment Tool on ${new Date().toLocaleString()}.</p>
        <p>For questions or concerns about this SSP, please contact your organization's security team.</p>
    </div>
</body>
</html>`;

      logger.info('SSP HTML generated successfully', { sspId: ssp.id });
      return html;
    } catch (error) {
      logger.error('Failed to generate SSP HTML:', error);
      throw new Error(`Failed to generate SSP HTML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const sspGenerationService = SSPGenerationService.getInstance();