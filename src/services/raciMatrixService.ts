/**
 * 👥 RACI Matrix Service
 * Generates RACI (Responsible, Accountable, Consulted, Informed) matrices from CMMC assessment data
 */

import { AssessmentData } from '../shared/types/assessment';
import { logger } from '../utils/logger';

export interface OrganizationRole {
  id: string;
  name: string;
  department: string;
  skills: string[];
  level: 'executive' | 'management' | 'technical' | 'operational';
}

export interface OrganizationInfo {
  name: string;
  roles: OrganizationRole[];
}

export interface RACIMatrix {
  id: string;
  organization: string;
  generatedDate: Date;
  version: string;
  roles: OrganizationRole[];
  controls: RACIControl[];
  summary: RACISummary;
}

export interface RACIControl {
  id: string;
  name: string;
  description: string;
  domain: string;
  assignments: RACIAssignment[];
}

export interface RACIAssignment {
  roleId: string;
  roleName: string;
  responsibility: 'R' | 'A' | 'C' | 'I';
  justification: string;
}

export interface RACISummary {
  totalRoles: number;
  totalControls: number;
  totalAssignments: number;
  roleDistribution: {
    roleId: string;
    roleName: string;
    responsibleCount: number;
    accountableCount: number;
    consultedCount: number;
    informedCount: number;
  }[];
}

class RACIMatrixService {
  private static instance: RACIMatrixService;

  private constructor() {}

  public static getInstance(): RACIMatrixService {
    if (!RACIMatrixService.instance) {
      RACIMatrixService.instance = new RACIMatrixService();
    }
    return RACIMatrixService.instance;
  }

  public generateRACIMatrix(assessment: AssessmentData, organizationInfo: OrganizationInfo): RACIMatrix {
    try {
      const matrixId = `raci_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const generatedDate = new Date();

      // Generate control assignments
      const controls = this.generateControlAssignments(assessment, organizationInfo.roles);

      // Calculate summary
      const summary = this.calculateSummary(organizationInfo.roles, controls);

      const matrix: RACIMatrix = {
        id: matrixId,
        organization: organizationInfo.name,
        generatedDate,
        version: '1.0',
        roles: organizationInfo.roles,
        controls,
        summary
      };

      logger.info('RACI Matrix generated successfully', { 
        matrixId, 
        organization: organizationInfo.name,
        controls: controls.length,
        roles: organizationInfo.roles.length
      });

      return matrix;
    } catch (error) {
      logger.error('Failed to generate RACI Matrix:', error);
      throw new Error(`Failed to generate RACI Matrix: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private generateControlAssignments(assessment: AssessmentData, roles: OrganizationRole[]): RACIControl[] {
    const responses = assessment.responses || {};
    const controls: RACIControl[] = [];

    // Map controls to domains and generate assignments
    Object.entries(responses).forEach(([controlId, response]) => {
      const domain = this.getControlDomain(controlId);
      const controlName = this.getControlName(controlId);
      const controlDescription = this.getControlDescription(controlId);

      const assignments = this.generateAssignmentsForControl(controlId, domain, roles);

      controls.push({
        id: controlId,
        name: controlName,
        description: controlDescription,
        domain,
        assignments
      });
    });

    return controls;
  }

  private generateAssignmentsForControl(controlId: string, domain: string, roles: OrganizationRole[]): RACIAssignment[] {
    const assignments: RACIAssignment[] = [];

    // Define role assignments based on control domain and type
    const assignmentRules = this.getAssignmentRules(domain, controlId);

    roles.forEach(role => {
      const responsibility = assignmentRules[role.id] || assignmentRules[role.level] || assignmentRules['default'];
      
      if (responsibility) {
        assignments.push({
          roleId: role.id,
          roleName: role.name,
          responsibility: responsibility.type,
          justification: responsibility.justification
        });
      }
    });

    return assignments;
  }

  private getAssignmentRules(domain: string, controlId: string): Record<string, { type: 'R' | 'A' | 'C' | 'I'; justification: string }> {
    // Define assignment rules based on domain and control characteristics
    const rules: Record<string, Record<string, { type: 'R' | 'A' | 'C' | 'I'; justification: string }>> = {
      'Access Control': {
        'ciso': { type: 'A', justification: 'Accountable for access control policy and oversight' },
        'it-security': { type: 'R', justification: 'Responsible for implementing and maintaining access controls' },
        'compliance': { type: 'C', justification: 'Consulted on compliance requirements' },
        'it-operations': { type: 'I', justification: 'Informed of access control changes and incidents' }
      },
      'Awareness and Training': {
        'ciso': { type: 'A', justification: 'Accountable for security awareness program' },
        'compliance': { type: 'R', justification: 'Responsible for developing and delivering training' },
        'hr': { type: 'C', justification: 'Consulted on training requirements and scheduling' },
        'all': { type: 'I', justification: 'All personnel must be informed of security requirements' }
      },
      'Audit and Accountability': {
        'ciso': { type: 'A', justification: 'Accountable for audit program oversight' },
        'it-security': { type: 'R', justification: 'Responsible for implementing audit logging and monitoring' },
        'compliance': { type: 'C', justification: 'Consulted on audit requirements and findings' },
        'it-operations': { type: 'I', justification: 'Informed of audit findings and remediation requirements' }
      },
      'Configuration Management': {
        'it-security': { type: 'A', justification: 'Accountable for configuration management policy' },
        'it-operations': { type: 'R', justification: 'Responsible for implementing configuration controls' },
        'ciso': { type: 'C', justification: 'Consulted on security configuration requirements' },
        'compliance': { type: 'I', justification: 'Informed of configuration changes for compliance tracking' }
      },
      'Incident Response': {
        'ciso': { type: 'A', justification: 'Accountable for incident response program' },
        'it-security': { type: 'R', justification: 'Responsible for incident detection and response' },
        'compliance': { type: 'C', justification: 'Consulted on incident reporting requirements' },
        'it-operations': { type: 'I', justification: 'Informed of incidents and response actions' }
      },
      'Risk Management': {
        'ciso': { type: 'A', justification: 'Accountable for risk management program' },
        'compliance': { type: 'R', justification: 'Responsible for risk assessment and mitigation' },
        'executive': { type: 'C', justification: 'Consulted on risk tolerance and business impact' },
        'management': { type: 'I', justification: 'Informed of risk status and mitigation progress' }
      }
    };

    // Default rules for unmatched domains
    const defaultRules = {
      'ciso': { type: 'A', justification: 'Accountable for overall security program' },
      'it-security': { type: 'R', justification: 'Responsible for technical implementation' },
      'compliance': { type: 'C', justification: 'Consulted on compliance requirements' },
      'it-operations': { type: 'I', justification: 'Informed of security requirements' }
    };

    return rules[domain] || defaultRules;
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

  private getControlName(controlId: string): string {
    // Simplified mapping - in real implementation, this would be more comprehensive
    const controlNames: Record<string, string> = {
      'AC.1.001': 'Limit information system access to authorized users',
      'AC.1.002': 'Limit information system access to authorized processes',
      'AC.1.003': 'Control information posted or processed on publicly accessible information systems',
      'AT.1.001': 'Provide basic security awareness training',
      'AT.1.002': 'Provide role-based security training',
      'AU.1.001': 'Create and retain system audit logs',
      'AU.1.002': 'Ensure audit logs are reviewed and analyzed',
      'CM.1.001': 'Establish and maintain baseline configurations',
      'CM.1.002': 'Establish and maintain configuration change control',
      'IA.1.001': 'Identify information system users and processes',
      'IA.1.002': 'Authenticate information system users and processes',
      'IR.1.001': 'Establish an incident response capability',
      'IR.1.002': 'Track and document information system security incidents',
      'MA.1.001': 'Maintain information system components',
      'MA.1.002': 'Manage maintenance, repair, and replacement of information system components',
      'MP.1.001': 'Protect information at rest',
      'MP.1.002': 'Sanitize or destroy information system media',
      'PS.1.001': 'Screen individuals prior to authorizing access',
      'PS.1.002': 'Ensure that organizational personnel are adequately trained',
      'PE.1.001': 'Limit physical access to information systems',
      'PE.1.002': 'Protect and monitor the physical facility',
      'CP.1.001': 'Establish, maintain, and test recovery procedures',
      'CP.1.002': 'Provide protection from malicious code',
      'RA.1.001': 'Identify and document information system vulnerabilities',
      'RA.1.002': 'Assess the risk associated with identified vulnerabilities',
      'CA.1.001': 'Develop, document, and periodically update system security plans',
      'CA.1.002': 'Develop, document, and periodically update system security plans',
      'SC.1.001': 'Monitor, control, and protect organizational communications',
      'SC.1.002': 'Employ architectural designs, software development techniques, and systems engineering principles',
      'SI.1.001': 'Identify, report, and correct information and information system flaws',
      'SI.1.002': 'Provide protection from malicious code at appropriate locations'
    };

    return controlNames[controlId] || `Control ${controlId}`;
  }

  private getControlDescription(controlId: string): string {
    // Simplified descriptions - in real implementation, this would be more comprehensive
    return `This control addresses ${controlId} requirements for CMMC compliance.`;
  }

  private calculateSummary(roles: OrganizationRole[], controls: RACIControl[]): RACISummary {
    const roleDistribution = roles.map(role => {
      let responsibleCount = 0;
      let accountableCount = 0;
      let consultedCount = 0;
      let informedCount = 0;

      controls.forEach(control => {
        control.assignments.forEach(assignment => {
          if (assignment.roleId === role.id) {
            switch (assignment.responsibility) {
              case 'R': responsibleCount++; break;
              case 'A': accountableCount++; break;
              case 'C': consultedCount++; break;
              case 'I': informedCount++; break;
            }
          }
        });
      });

      return {
        roleId: role.id,
        roleName: role.name,
        responsibleCount,
        accountableCount,
        consultedCount,
        informedCount
      };
    });

    const totalAssignments = controls.reduce((sum, control) => sum + control.assignments.length, 0);

    return {
      totalRoles: roles.length,
      totalControls: controls.length,
      totalAssignments,
      roleDistribution
    };
  }

  public generateHTML(matrix: RACIMatrix): string {
    try {
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RACI Matrix - ${matrix.organization}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; color: #333; }
        .header { border-bottom: 2px solid #0066cc; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #0066cc; margin: 0; }
        .header .meta { color: #666; font-size: 14px; margin-top: 10px; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .summary h3 { margin-top: 0; }
        .summary-item { margin: 10px 0; }
        .matrix-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .matrix-table th, .matrix-table td { border: 1px solid #ddd; padding: 8px; text-align: center; }
        .matrix-table th { background-color: #f2f2f2; font-weight: bold; }
        .raci-r { background-color: #e8f5e8; font-weight: bold; }
        .raci-a { background-color: #fff2cc; font-weight: bold; }
        .raci-c { background-color: #e1f5fe; }
        .raci-i { background-color: #f3e5f5; }
        .control-section { margin: 30px 0; }
        .control-section h3 { color: #0066cc; }
        .assignments { margin: 10px 0; }
        .assignment { margin: 5px 0; padding: 5px; background: #f9f9f9; border-radius: 3px; }
        .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>RACI Matrix</h1>
        <div class="meta">
            <strong>Organization:</strong> ${matrix.organization}<br>
            <strong>Generated:</strong> ${matrix.generatedDate.toLocaleDateString()}<br>
            <strong>Version:</strong> ${matrix.version}
        </div>
    </div>

    <div class="summary">
        <h3>Matrix Summary</h3>
        <div class="summary-item"><strong>Total Roles:</strong> ${matrix.summary.totalRoles}</div>
        <div class="summary-item"><strong>Total Controls:</strong> ${matrix.summary.totalControls}</div>
        <div class="summary-item"><strong>Total Assignments:</strong> ${matrix.summary.totalAssignments}</div>
    </div>

    <div class="summary">
        <h3>Role Distribution</h3>
        <table class="matrix-table">
            <thead>
                <tr>
                    <th>Role</th>
                    <th>Responsible</th>
                    <th>Accountable</th>
                    <th>Consulted</th>
                    <th>Informed</th>
                </tr>
            </thead>
            <tbody>
                ${matrix.summary.roleDistribution.map(role => `
                    <tr>
                        <td><strong>${role.roleName}</strong></td>
                        <td>${role.responsibleCount}</td>
                        <td>${role.accountableCount}</td>
                        <td>${role.consultedCount}</td>
                        <td>${role.informedCount}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>

    <div class="control-section">
        <h2>Control Assignments</h2>
        ${matrix.controls.map(control => `
            <div class="control-section">
                <h3>${control.name} (${control.id})</h3>
                <p><strong>Domain:</strong> ${control.domain}</p>
                <p><strong>Description:</strong> ${control.description}</p>
                <div class="assignments">
                    <h4>Role Assignments:</h4>
                    ${control.assignments.map(assignment => `
                        <div class="assignment">
                            <strong>${assignment.roleName}</strong> - 
                            <span class="raci-${assignment.responsibility.toLowerCase()}">${assignment.responsibility}</span>
                            <br><em>${assignment.justification}</em>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('')}
    </div>

    <div class="footer">
        <p>This document was automatically generated by the CMMC Assessment Tool on ${new Date().toLocaleString()}.</p>
        <p>RACI Legend: R = Responsible, A = Accountable, C = Consulted, I = Informed</p>
    </div>
</body>
</html>`;

      logger.info('RACI Matrix HTML generated successfully', { matrixId: matrix.id });
      return html;
    } catch (error) {
      logger.error('Failed to generate RACI Matrix HTML:', error);
      throw new Error(`Failed to generate RACI Matrix HTML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const raciMatrixService = RACIMatrixService.getInstance();