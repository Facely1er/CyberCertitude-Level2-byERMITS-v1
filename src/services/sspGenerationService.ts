import { AssessmentData, Framework } from '../shared/types';
import { cmmcFramework } from '../data/frameworks/cmmc';
import { TemplateContent } from '../data/templates';

export interface SSPDocument {
  id: string;
  title: string;
  version: string;
  organization: string;
  generatedDate: Date;
  sections: SSPSection[];
  controls: SSPControl[];
  appendices: SSPAppendix[];
}

interface SSPSection {
  id: string;
  title: string;
  content: string;
  subsections: SSPSubsection[];
}

interface SSPSubsection {
  id: string;
  title: string;
  content: string;
}

interface SSPControl {
  id: string;
  title: string;
  domain: string;
  description: string;
  implementation: string;
  evidence: string[];
  status: 'implemented' | 'partially-implemented' | 'not-implemented';
  priority: 'critical' | 'high' | 'medium' | 'low';
}

interface SSPAppendix {
  id: string;
  title: string;
  content: string;
  type: 'policy' | 'procedure' | 'template' | 'reference';
}

export class SSPGenerationService {
  private static instance: SSPGenerationService;

  static getInstance(): SSPGenerationService {
    if (!SSPGenerationService.instance) {
      SSPGenerationService.instance = new SSPGenerationService();
    }
    return SSPGenerationService.instance;
  }

  generateSSP(assessment: AssessmentData, organizationInfo: {
    name: string;
    address: string;
    contact: string;
    systemName: string;
    systemDescription: string;
  }): SSPDocument {
    const controls = this.generateControlImplementations(assessment);
    const sections = this.generateSSPSections(organizationInfo, controls);
    const appendices = this.generateAppendices(controls);

    return {
      id: `ssp-${Date.now()}`,
      title: `System Security Plan - ${organizationInfo.systemName}`,
      version: '1.0',
      organization: organizationInfo.name,
      generatedDate: new Date(),
      sections,
      controls,
      appendices
    };
  }

  generateSSPFromTemplate(template: TemplateContent, customizedContent: string, organizationInfo: {
    name: string;
    address: string;
    contact: string;
    systemName: string;
    systemDescription: string;
  }): SSPDocument {
    // Parse the customized template content to extract sections
    const sections = this.parseTemplateContent(customizedContent);
    const controls = this.generateControlImplementationsFromTemplate(template);
    const appendices = this.generateAppendicesFromTemplate(template);

    return {
      id: `ssp-template-${Date.now()}`,
      title: `System Security Plan - ${organizationInfo.systemName}`,
      version: '1.0',
      organization: organizationInfo.name,
      generatedDate: new Date(),
      sections,
      controls,
      appendices
    };
  }

  private generateControlImplementations(assessment: AssessmentData): SSPControl[] {
    const controls: SSPControl[] = [];
    
    cmmcFramework.sections.forEach(section => {
      section.categories.forEach(category => {
        category.questions.forEach(question => {
          const response = assessment.responses[question.id];
          const status = this.mapResponseToStatus(response);
          
          controls.push({
            id: question.id,
            title: question.text,
            domain: section.name,
            description: question.guidance,
            implementation: this.generateImplementationDescription(question, response),
            evidence: this.generateEvidenceRequirements(question, response),
            status,
            priority: question.priority as 'critical' | 'high' | 'medium' | 'low'
          });
        });
      });
    });

    return controls;
  }

  private mapResponseToStatus(response: number): 'implemented' | 'partially-implemented' | 'not-implemented' {
    if (response >= 3) return 'implemented';
    if (response >= 1) return 'partially-implemented';
    return 'not-implemented';
  }

  private generateImplementationDescription(question: any, response: number): string {
    const status = this.mapResponseToStatus(response);
    
    switch (status) {
      case 'implemented':
        return `This control has been fully implemented. ${question.examples?.join(', ')} are in place and functioning as required.`;
      case 'partially-implemented':
        return `This control has been partially implemented. Some ${question.examples?.join(', ')} are in place but additional work is needed for full compliance.`;
      default:
        return `This control has not been implemented. Implementation of ${question.examples?.join(', ')} is required for compliance.`;
    }
  }

  private generateEvidenceRequirements(question: any, response: number): string[] {
    const evidenceTypes = [
      'Policy documentation',
      'Procedure documentation',
      'System configuration screenshots',
      'Training records',
      'Assessment reports',
      'Audit logs',
      'Test results'
    ];

    const status = this.mapResponseToStatus(response);
    if (status === 'not-implemented') {
      return ['Implementation plan', 'Risk assessment', ...evidenceTypes.slice(0, 2)];
    }
    
    return evidenceTypes.slice(0, 3);
  }

  private generateSSPSections(organizationInfo: any, controls: SSPControl[]): SSPSection[] {
    return [
      {
        id: 'executive-summary',
        title: 'Executive Summary',
        content: `This System Security Plan (SSP) documents the security controls implemented for ${organizationInfo.systemName} at ${organizationInfo.organization}. The system is designed to protect Controlled Unclassified Information (CUI) in accordance with CMMC 2.0 Level 2 requirements and NIST SP 800-171 guidelines.`,
        subsections: [
          {
            id: 'system-overview',
            title: 'System Overview',
            content: organizationInfo.systemDescription
          },
          {
            id: 'security-objectives',
            title: 'Security Objectives',
            content: 'The primary security objectives are to protect CUI, ensure system availability, maintain data integrity, and support business operations while meeting CMMC 2.0 Level 2 compliance requirements.'
          }
        ]
      },
      {
        id: 'system-description',
        title: 'System Description',
        content: `The ${organizationInfo.systemName} is a critical information system that processes, stores, and transmits Controlled Unclassified Information (CUI) for ${organizationInfo.organization}.`,
        subsections: [
          {
            id: 'system-boundary',
            title: 'System Boundary',
            content: 'The system boundary includes all hardware, software, and network components that process, store, or transmit CUI.'
          },
          {
            id: 'system-architecture',
            title: 'System Architecture',
            content: 'The system architecture follows a layered security approach with multiple security controls implemented at various levels.'
          }
        ]
      },
      {
        id: 'security-controls',
        title: 'Security Controls Implementation',
        content: 'This section details the implementation of security controls in accordance with CMMC 2.0 Level 2 requirements.',
        subsections: this.generateControlSections(controls)
      },
      {
        id: 'risk-assessment',
        title: 'Risk Assessment',
        content: 'A comprehensive risk assessment has been conducted to identify and mitigate security risks to the system and CUI.',
        subsections: [
          {
            id: 'threat-landscape',
            title: 'Threat Landscape',
            content: 'The system faces various threats including cyber attacks, insider threats, and natural disasters.'
          },
          {
            id: 'vulnerability-assessment',
            title: 'Vulnerability Assessment',
            content: 'Regular vulnerability assessments are conducted to identify and remediate security weaknesses.'
          }
        ]
      },
      {
        id: 'incident-response',
        title: 'Incident Response',
        content: 'Procedures are in place to detect, respond to, and recover from security incidents.',
        subsections: [
          {
            id: 'incident-response-plan',
            title: 'Incident Response Plan',
            content: 'A formal incident response plan has been developed and is regularly tested and updated.'
          },
          {
            id: 'communication-procedures',
            title: 'Communication Procedures',
            content: 'Clear communication procedures are established for reporting and responding to security incidents.'
          }
        ]
      }
    ];
  }

  private generateControlSections(controls: SSPControl[]): SSPSubsection[] {
    const sections: SSPSubsection[] = [];
    const domainGroups = controls.reduce((groups, control) => {
      if (!groups[control.domain]) {
        groups[control.domain] = [];
      }
      groups[control.domain].push(control);
      return groups;
    }, {} as Record<string, SSPControl[]>);

    Object.entries(domainGroups).forEach(([domain, domainControls]) => {
      sections.push({
        id: `controls-${domain.toLowerCase().replace(/\s+/g, '-')}`,
        title: `${domain} Controls`,
        content: `Implementation details for ${domain} controls:`,
        subsections: domainControls.map(control => ({
          id: control.id,
          title: control.title,
          content: `${control.description}\n\nImplementation: ${control.implementation}\n\nEvidence Required: ${control.evidence.join(', ')}`
        }))
      });
    });

    return sections;
  }

  private generateAppendices(controls: SSPControl[]): SSPAppendix[] {
    return [
      {
        id: 'appendix-a',
        title: 'Control Implementation Matrix',
        content: 'Detailed matrix showing the implementation status of all CMMC 2.0 Level 2 controls.',
        type: 'reference'
      },
      {
        id: 'appendix-b',
        title: 'Policy Templates',
        content: 'Templates for required security policies including access control, incident response, and data protection policies.',
        type: 'template'
      },
      {
        id: 'appendix-c',
        title: 'Evidence Collection Guide',
        content: 'Guidance for collecting and organizing evidence to support CMMC 2.0 Level 2 compliance.',
        type: 'procedure'
      },
      {
        id: 'appendix-d',
        title: 'Risk Assessment Methodology',
        content: 'Methodology used for conducting risk assessments and identifying security risks.',
        type: 'procedure'
      }
    ];
  }

  exportToWord(ssp: SSPDocument): string {
    // This would generate a Word document - for now return HTML
    return this.generateHTML(ssp);
  }

  exportToPDF(ssp: SSPDocument): string {
    // This would generate a PDF - for now return HTML
    return this.generateHTML(ssp);
  }

  private generateHTML(ssp: SSPDocument): string {
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${ssp.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #2c3e50; border-bottom: 2px solid #3498db; }
          h2 { color: #34495e; margin-top: 30px; }
          h3 { color: #7f8c8d; }
          .header { text-align: center; margin-bottom: 40px; }
          .section { margin-bottom: 30px; }
          .control { margin: 15px 0; padding: 10px; border-left: 3px solid #3498db; }
          .status-implemented { border-left-color: #27ae60; }
          .status-partially-implemented { border-left-color: #f39c12; }
          .status-not-implemented { border-left-color: #e74c3c; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${ssp.title}</h1>
          <p>Organization: ${ssp.organization}</p>
          <p>Version: ${ssp.version} | Generated: ${ssp.generatedDate.toLocaleDateString()}</p>
        </div>
    `;

    ssp.sections.forEach(section => {
      html += `<div class="section"><h2>${section.title}</h2><p>${section.content}</p>`;
      section.subsections.forEach(subsection => {
        html += `<h3>${subsection.title}</h3><p>${subsection.content}</p>`;
      });
      html += '</div>';
    });

    html += `
        <div class="section">
          <h2>Security Controls Implementation</h2>
    `;

    ssp.controls.forEach(control => {
      const statusClass = `status-${control.status}`;
      html += `
        <div class="control ${statusClass}">
          <h3>${control.id} - ${control.title}</h3>
          <p><strong>Domain:</strong> ${control.domain}</p>
          <p><strong>Status:</strong> ${control.status}</p>
          <p><strong>Priority:</strong> ${control.priority}</p>
          <p><strong>Description:</strong> ${control.description}</p>
          <p><strong>Implementation:</strong> ${control.implementation}</p>
          <p><strong>Evidence Required:</strong> ${control.evidence.join(', ')}</p>
        </div>
      `;
    });

    html += `
        </div>
        <div class="section">
          <h2>Appendices</h2>
    `;

    ssp.appendices.forEach(appendix => {
      html += `<h3>${appendix.title}</h3><p>${appendix.content}</p>`;
    });

    html += `
        </div>
      </body>
      </html>
    `;

    return html;
  }

  private parseTemplateContent(content: string): SSPSection[] {
    const sections: SSPSection[] = [];
    const lines = content.split('\n');
    let currentSection: SSPSection | null = null;
    let currentSubsection: SSPSubsection | null = null;

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Check for main section headers (##)
      if (trimmedLine.startsWith('## ') && !trimmedLine.startsWith('### ')) {
        if (currentSection) {
          if (currentSubsection) {
            currentSection.subsections.push(currentSubsection);
            currentSubsection = null;
          }
          sections.push(currentSection);
        }
        
        currentSection = {
          id: trimmedLine.substring(3).toLowerCase().replace(/\s+/g, '-'),
          title: trimmedLine.substring(3),
          content: '',
          subsections: []
        };
      }
      // Check for subsection headers (###)
      else if (trimmedLine.startsWith('### ')) {
        if (currentSection && currentSubsection) {
          currentSection.subsections.push(currentSubsection);
        }
        
        currentSubsection = {
          id: trimmedLine.substring(4).toLowerCase().replace(/\s+/g, '-'),
          title: trimmedLine.substring(4),
          content: ''
        };
      }
      // Add content to current section or subsection
      else if (trimmedLine && currentSection) {
        if (currentSubsection) {
          currentSubsection.content += (currentSubsection.content ? '\n' : '') + trimmedLine;
        } else {
          currentSection.content += (currentSection.content ? '\n' : '') + trimmedLine;
        }
      }
    }

    // Add the last section and subsection
    if (currentSection) {
      if (currentSubsection) {
        currentSection.subsections.push(currentSubsection);
      }
      sections.push(currentSection);
    }

    return sections;
  }

  private generateControlImplementationsFromTemplate(template: TemplateContent): SSPControl[] {
    const controls: SSPControl[] = [];
    
    template.controls.forEach(controlId => {
      // Find the control in the CMMC framework
      let controlInfo = null;
      cmmcFramework.sections.forEach(section => {
        section.categories.forEach(category => {
          category.questions.forEach(question => {
            if (question.id === controlId) {
              controlInfo = question;
            }
          });
        });
      });

      if (controlInfo) {
        controls.push({
          id: controlId,
          title: controlInfo.text,
          domain: template.category,
          description: controlInfo.guidance,
          implementation: this.generateTemplateImplementationDescription(controlInfo),
          evidence: this.generateTemplateEvidenceRequirements(controlInfo),
          status: 'implemented', // Template-based assumes implementation
          priority: controlInfo.priority as 'critical' | 'high' | 'medium' | 'low'
        });
      }
    });

    return controls;
  }

  private generateAppendicesFromTemplate(template: TemplateContent): SSPAppendix[] {
    const appendices: SSPAppendix[] = [];
    
    // Add template-specific appendices
    if (template.category === 'core') {
      appendices.push({
        id: 'template-reference',
        title: 'Template Reference',
        content: `This SSP was generated using the ${template.name} template.`,
        type: 'reference'
      });
    }

    return appendices;
  }

  private generateTemplateImplementationDescription(control: any): string {
    return `Implementation details for ${control.text} based on template guidance. This control has been customized according to organizational requirements and industry best practices.`;
  }

  private generateTemplateEvidenceRequirements(control: any): string[] {
    return [
      'Policy documentation',
      'Implementation evidence',
      'Testing results',
      'Audit reports'
    ];
  }
}

export const sspGenerationService = SSPGenerationService.getInstance();