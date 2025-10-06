import { AssessmentData, Framework } from '../shared/types';
import { cmmcFramework } from '../data/frameworks/cmmc';

export interface RACIMatrix {
  id: string;
  title: string;
  organization: string;
  generatedDate: Date;
  roles: RACIRole[];
  controls: RACIControl[];
  matrix: RACIMatrixEntry[][];
  summary: RACISummary;
}

interface RACIRole {
  id: string;
  name: string;
  description: string;
  department: string;
  responsibilities: string[];
  skills: string[];
  level: 'executive' | 'management' | 'technical' | 'operational';
}

interface RACIControl {
  id: string;
  title: string;
  domain: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  complexity: 'low' | 'medium' | 'high';
  requiredSkills: string[];
}

interface RACIMatrixEntry {
  roleId: string;
  controlId: string;
  responsibility: 'R' | 'A' | 'C' | 'I' | '';
  justification: string;
  effort: 'low' | 'medium' | 'high';
  timeline: string;
}

interface RACISummary {
  totalRoles: number;
  totalControls: number;
  responsibleCount: number;
  accountableCount: number;
  consultedCount: number;
  informedCount: number;
  roleDistribution: Record<string, number>;
  workloadAnalysis: WorkloadAnalysis[];
}

interface WorkloadAnalysis {
  roleId: string;
  roleName: string;
  totalResponsibilities: number;
  highPriorityResponsibilities: number;
  estimatedEffort: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export class RACIMatrixService {
  private static instance: RACIMatrixService;

  static getInstance(): RACIMatrixService {
    if (!RACIMatrixService.instance) {
      RACIMatrixService.instance = new RACIMatrixService();
    }
    return RACIMatrixService.instance;
  }

  generateRACIMatrix(assessment: AssessmentData, organizationInfo: {
    name: string;
    roles: Array<{
      id: string;
      name: string;
      department: string;
      skills: string[];
      level: 'executive' | 'management' | 'technical' | 'operational';
    }>;
  }): RACIMatrix {
    const roles = this.generateRoles(organizationInfo.roles);
    const controls = this.generateControls(assessment);
    const matrix = this.generateMatrix(roles, controls);
    const summary = this.generateSummary(roles, controls, matrix);

    return {
      id: `raci-${Date.now()}`,
      title: `RACI Matrix - CMMC 2.0 Level 2 Implementation`,
      organization: organizationInfo.name,
      generatedDate: new Date(),
      roles,
      controls,
      matrix,
      summary
    };
  }

  private generateRoles(organizationRoles: any[]): RACIRole[] {
    const defaultRoles: RACIRole[] = [
      {
        id: 'ciso',
        name: 'Chief Information Security Officer (CISO)',
        description: 'Overall responsibility for information security strategy and CMMC compliance',
        department: 'Information Security',
        responsibilities: ['Strategic oversight', 'Risk management', 'Compliance governance'],
        skills: ['Security strategy', 'Risk management', 'Compliance', 'Leadership'],
        level: 'executive'
      },
      {
        id: 'compliance-officer',
        name: 'Compliance Officer',
        description: 'Responsible for CMMC compliance implementation and monitoring',
        department: 'Compliance',
        responsibilities: ['Compliance monitoring', 'Policy development', 'Audit coordination'],
        skills: ['CMMC', 'NIST SP 800-171', 'Compliance', 'Documentation'],
        level: 'management'
      },
      {
        id: 'security-architect',
        name: 'Security Architect',
        description: 'Designs and implements security controls and architectures',
        department: 'Information Security',
        responsibilities: ['Security design', 'Control implementation', 'Technical oversight'],
        skills: ['Security architecture', 'System design', 'Technical implementation'],
        level: 'technical'
      },
      {
        id: 'it-security-team',
        name: 'IT Security Team',
        description: 'Implements and maintains technical security controls',
        department: 'Information Technology',
        responsibilities: ['Control implementation', 'System administration', 'Monitoring'],
        skills: ['System administration', 'Security tools', 'Network security'],
        level: 'technical'
      },
      {
        id: 'it-operations',
        name: 'IT Operations Team',
        description: 'Manages IT infrastructure and operational systems',
        department: 'Information Technology',
        responsibilities: ['System maintenance', 'Infrastructure management', 'Backup and recovery'],
        skills: ['System administration', 'Infrastructure', 'Backup systems'],
        level: 'operational'
      },
      {
        id: 'hr-team',
        name: 'Human Resources Team',
        description: 'Manages personnel security and training programs',
        department: 'Human Resources',
        responsibilities: ['Personnel security', 'Training coordination', 'Background checks'],
        skills: ['Personnel management', 'Training', 'Compliance'],
        level: 'operational'
      },
      {
        id: 'facilities-team',
        name: 'Facilities Team',
        description: 'Manages physical security and environmental controls',
        department: 'Facilities',
        responsibilities: ['Physical security', 'Environmental controls', 'Access management'],
        skills: ['Physical security', 'Facilities management', 'Access control'],
        level: 'operational'
      },
      {
        id: 'legal-team',
        name: 'Legal Team',
        description: 'Provides legal guidance on compliance and contracts',
        department: 'Legal',
        responsibilities: ['Legal compliance', 'Contract review', 'Risk assessment'],
        skills: ['Legal compliance', 'Contract law', 'Risk management'],
        level: 'management'
      }
    ];

    // Merge with organization-specific roles
    const mergedRoles = [...defaultRoles];
    organizationRoles.forEach(orgRole => {
      if (!mergedRoles.find(r => r.id === orgRole.id)) {
        mergedRoles.push({
          id: orgRole.id,
          name: orgRole.name,
          description: `${orgRole.name} role for CMMC implementation`,
          department: orgRole.department,
          responsibilities: ['CMMC implementation', 'Compliance support'],
          skills: orgRole.skills,
          level: orgRole.level
        });
      }
    });

    return mergedRoles;
  }

  private generateControls(assessment: AssessmentData): RACIControl[] {
    const controls: RACIControl[] = [];
    
    cmmcFramework.sections.forEach(section => {
      section.categories.forEach(category => {
        category.questions.forEach(question => {
          const response = assessment.responses[question.id];
          const priority = this.determineControlPriority(question, response);
          const complexity = this.determineControlComplexity(question);
          
          controls.push({
            id: question.id,
            title: question.text,
            domain: section.name,
            description: question.guidance,
            priority,
            complexity,
            requiredSkills: this.identifyRequiredSkills(question, section.name)
          });
        });
      });
    });

    return controls;
  }

  private determineControlPriority(question: any, response: number): 'critical' | 'high' | 'medium' | 'low' {
    if (question.priority === 'high' && response < 2) return 'critical';
    if (question.priority === 'high') return 'high';
    if (question.priority === 'medium') return 'medium';
    return 'low';
  }

  private determineControlComplexity(question: any): 'low' | 'medium' | 'high' {
    const exampleCount = question.examples?.length || 0;
    if (exampleCount >= 5) return 'high';
    if (exampleCount >= 3) return 'medium';
    return 'low';
  }

  private identifyRequiredSkills(question: any, domain: string): string[] {
    const skills: string[] = [];
    
    if (domain.includes('Access Control')) {
      skills.push('Identity Management', 'Access Control Systems');
    }
    if (domain.includes('Audit')) {
      skills.push('Logging', 'SIEM', 'Audit Tools');
    }
    if (domain.includes('Training')) {
      skills.push('Training Development', 'Content Creation');
    }
    if (domain.includes('Physical')) {
      skills.push('Physical Security', 'Facilities Management');
    }
    if (domain.includes('Personnel')) {
      skills.push('HR Management', 'Background Checks');
    }
    
    // Add general skills based on complexity
    if (question.examples?.length >= 4) {
      skills.push('Project Management', 'Technical Implementation');
    }
    
    return skills;
  }

  private generateMatrix(roles: RACIRole[], controls: RACIControl[]): RACIMatrixEntry[][] {
    const matrix: RACIMatrixEntry[][] = [];
    
    roles.forEach(role => {
      const roleEntries: RACIMatrixEntry[] = [];
      
      controls.forEach(control => {
        const responsibility = this.assignResponsibility(role, control);
        const justification = this.generateJustification(role, control, responsibility);
        const effort = this.estimateEffort(role, control, responsibility);
        const timeline = this.estimateTimeline(control, effort);
        
        roleEntries.push({
          roleId: role.id,
          controlId: control.id,
          responsibility,
          justification,
          effort,
          timeline
        });
      });
      
      matrix.push(roleEntries);
    });
    
    return matrix;
  }

  private assignResponsibility(role: RACIRole, control: RACIControl): 'R' | 'A' | 'C' | 'I' | '' {
    // CISO gets Accountable for high-priority controls
    if (role.id === 'ciso' && control.priority === 'critical') {
      return 'A';
    }
    
    // Compliance Officer gets Responsible for compliance-related controls
    if (role.id === 'compliance-officer' && control.domain.includes('Assessment')) {
      return 'R';
    }
    
    // Security Architect gets Responsible for technical controls
    if (role.id === 'security-architect' && control.complexity === 'high') {
      return 'R';
    }
    
    // IT Security Team gets Responsible for most technical controls
    if (role.id === 'it-security-team' && this.isTechnicalControl(control)) {
      return 'R';
    }
    
    // IT Operations gets Responsible for operational controls
    if (role.id === 'it-operations' && control.domain.includes('Maintenance')) {
      return 'R';
    }
    
    // HR Team gets Responsible for personnel controls
    if (role.id === 'hr-team' && control.domain.includes('Personnel')) {
      return 'R';
    }
    
    // Facilities Team gets Responsible for physical controls
    if (role.id === 'facilities-team' && control.domain.includes('Physical')) {
      return 'R';
    }
    
    // Legal Team gets Consulted for policy controls
    if (role.id === 'legal-team' && control.domain.includes('Policy')) {
      return 'C';
    }
    
    // Default assignments based on skills match
    const skillMatch = this.calculateSkillMatch(role, control);
    if (skillMatch >= 0.7) return 'R';
    if (skillMatch >= 0.4) return 'C';
    if (skillMatch >= 0.2) return 'I';
    
    return '';
  }

  private isTechnicalControl(control: RACIControl): boolean {
    const technicalDomains = [
      'Access Control', 'Audit and Accountability', 'Configuration Management',
      'Identification and Authentication', 'System and Communications Protection',
      'System and Information Integrity'
    ];
    
    return technicalDomains.some(domain => control.domain.includes(domain));
  }

  private calculateSkillMatch(role: RACIRole, control: RACIControl): number {
    if (control.requiredSkills.length === 0) return 0;
    
    const matchingSkills = control.requiredSkills.filter(skill =>
      role.skills.some(roleSkill => 
        roleSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(roleSkill.toLowerCase())
      )
    );
    
    return matchingSkills.length / control.requiredSkills.length;
  }

  private generateJustification(role: RACIRole, control: RACIControl, responsibility: string): string {
    if (!responsibility) return 'No direct involvement required';
    
    const justifications: Record<string, string> = {
      'R': `Responsible for implementing and maintaining this control based on ${role.name} expertise in ${role.skills.join(', ')}`,
      'A': `Accountable for ensuring this control is properly implemented and maintained as part of overall security governance`,
      'C': `Consulted during implementation due to expertise in ${role.skills.join(', ')} and ${control.domain} domain knowledge`,
      'I': `Informed of implementation progress and outcomes for coordination and awareness purposes`
    };
    
    return justifications[responsibility] || 'Role involvement based on organizational structure and expertise';
  }

  private estimateEffort(role: RACIRole, control: RACIControl, responsibility: string): 'low' | 'medium' | 'high' {
    if (!responsibility || responsibility === 'I') return 'low';
    
    if (responsibility === 'R') {
      if (control.complexity === 'high') return 'high';
      if (control.complexity === 'medium') return 'medium';
      return 'low';
    }
    
    if (responsibility === 'A') {
      return control.priority === 'critical' ? 'high' : 'medium';
    }
    
    return 'low';
  }

  private estimateTimeline(control: RACIControl, effort: string): string {
    const baseDays = {
      'low': 7,
      'medium': 14,
      'high': 30
    }[effort];
    
    const priorityMultiplier = {
      'critical': 0.8,
      'high': 1.0,
      'medium': 1.2,
      'low': 1.5
    }[control.priority];
    
    const days = Math.ceil(baseDays * priorityMultiplier);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);
    
    return `${days} days (by ${endDate.toLocaleDateString()})`;
  }

  private generateSummary(roles: RACIRole[], controls: RACIControl[], matrix: RACIMatrixEntry[][]): RACISummary {
    const totalRoles = roles.length;
    const totalControls = controls.length;
    
    let responsibleCount = 0;
    let accountableCount = 0;
    let consultedCount = 0;
    let informedCount = 0;
    
    const roleDistribution: Record<string, number> = {};
    
    matrix.forEach(roleEntries => {
      const roleId = roleEntries[0]?.roleId || '';
      const roleName = roles.find(r => r.id === roleId)?.name || '';
      roleDistribution[roleName] = 0;
      
      roleEntries.forEach(entry => {
        if (entry.responsibility === 'R') {
          responsibleCount++;
          roleDistribution[roleName]++;
        } else if (entry.responsibility === 'A') {
          accountableCount++;
        } else if (entry.responsibility === 'C') {
          consultedCount++;
        } else if (entry.responsibility === 'I') {
          informedCount++;
        }
      });
    });
    
    const workloadAnalysis = roles.map(role => {
      const roleEntries = matrix.find(entries => entries[0]?.roleId === role.id) || [];
      const totalResponsibilities = roleEntries.filter(entry => entry.responsibility === 'R').length;
      const highPriorityResponsibilities = roleEntries.filter(entry => 
        entry.responsibility === 'R' && controls.find(c => c.id === entry.controlId)?.priority === 'critical'
      ).length;
      
      const estimatedEffort = this.calculateRoleEffort(roleEntries);
      const recommendations = this.generateRecommendations(role, totalResponsibilities, highPriorityResponsibilities);
      
      return {
        roleId: role.id,
        roleName: role.name,
        totalResponsibilities,
        highPriorityResponsibilities,
        estimatedEffort,
        recommendations
      };
    });
    
    return {
      totalRoles,
      totalControls,
      responsibleCount,
      accountableCount,
      consultedCount,
      informedCount,
      roleDistribution,
      workloadAnalysis
    };
  }

  private calculateRoleEffort(roleEntries: RACIMatrixEntry[]): 'low' | 'medium' | 'high' {
    const responsibilities = roleEntries.filter(entry => entry.responsibility === 'R');
    const highEffortCount = responsibilities.filter(entry => entry.effort === 'high').length;
    const mediumEffortCount = responsibilities.filter(entry => entry.effort === 'medium').length;
    
    if (highEffortCount >= 3) return 'high';
    if (highEffortCount >= 1 || mediumEffortCount >= 5) return 'medium';
    return 'low';
  }

  private generateRecommendations(role: RACIRole, totalResponsibilities: number, highPriorityResponsibilities: number): string[] {
    const recommendations: string[] = [];
    
    if (totalResponsibilities > 10) {
      recommendations.push('Consider delegating some responsibilities to other team members');
    }
    
    if (highPriorityResponsibilities > 3) {
      recommendations.push('Prioritize critical responsibilities and consider additional resources');
    }
    
    if (role.level === 'operational' && totalResponsibilities > 5) {
      recommendations.push('Provide additional training and support for operational staff');
    }
    
    if (role.level === 'technical' && totalResponsibilities > 8) {
      recommendations.push('Consider technical specialization or team expansion');
    }
    
    return recommendations;
  }

  exportToExcel(raci: RACIMatrix): string {
    // This would generate an Excel file - for now return CSV
    return this.generateCSV(raci);
  }

  exportToPDF(raci: RACIMatrix): string {
    // This would generate a PDF - for now return HTML
    return this.generateHTML(raci);
  }

  private generateCSV(raci: RACIMatrix): string {
    let csv = 'Role,Control ID,Control Title,Domain,Responsibility,Justification,Effort,Timeline\n';
    
    raci.matrix.forEach(roleEntries => {
      const roleName = raci.roles.find(r => r.id === roleEntries[0]?.roleId)?.name || '';
      
      roleEntries.forEach(entry => {
        const control = raci.controls.find(c => c.id === entry.controlId);
        csv += `"${roleName}","${entry.controlId}","${control?.title}","${control?.domain}","${entry.responsibility}","${entry.justification}","${entry.effort}","${entry.timeline}"\n`;
      });
    });
    
    return csv;
  }

  private generateHTML(raci: RACIMatrix): string {
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${raci.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #2c3e50; border-bottom: 2px solid #3498db; }
          h2 { color: #34495e; margin-top: 30px; }
          h3 { color: #7f8c8d; }
          .header { text-align: center; margin-bottom: 40px; }
          .summary { background: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .responsibility-R { background-color: #d4edda; }
          .responsibility-A { background-color: #fff3cd; }
          .responsibility-C { background-color: #cce5ff; }
          .responsibility-I { background-color: #f8f9fa; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${raci.title}</h1>
          <p>Organization: ${raci.organization}</p>
          <p>Generated: ${raci.generatedDate.toLocaleDateString()}</p>
        </div>

        <div class="summary">
          <h2>Summary</h2>
          <p><strong>Total Roles:</strong> ${raci.summary.totalRoles}</p>
          <p><strong>Total Controls:</strong> ${raci.summary.totalControls}</p>
          <p><strong>Responsible:</strong> ${raci.summary.responsibleCount} | <strong>Accountable:</strong> ${raci.summary.accountableCount} | <strong>Consulted:</strong> ${raci.summary.consultedCount} | <strong>Informed:</strong> ${raci.summary.informedCount}</p>
        </div>

        <h2>RACI Matrix</h2>
        <table>
          <thead>
            <tr>
              <th>Role</th>
              <th>Control ID</th>
              <th>Control Title</th>
              <th>Domain</th>
              <th>Responsibility</th>
              <th>Effort</th>
              <th>Timeline</th>
            </tr>
          </thead>
          <tbody>
    `;

    raci.matrix.forEach(roleEntries => {
      const roleName = raci.roles.find(r => r.id === roleEntries[0]?.roleId)?.name || '';
      
      roleEntries.forEach(entry => {
        const control = raci.controls.find(c => c.id === entry.controlId);
        const responsibilityClass = entry.responsibility ? `responsibility-${entry.responsibility}` : '';
        
        html += `
          <tr class="${responsibilityClass}">
            <td>${roleName}</td>
            <td>${entry.controlId}</td>
            <td>${control?.title}</td>
            <td>${control?.domain}</td>
            <td>${entry.responsibility || '-'}</td>
            <td>${entry.effort}</td>
            <td>${entry.timeline}</td>
          </tr>
        `;
      });
    });

    html += `
          </tbody>
        </table>

        <h2>Workload Analysis</h2>
    `;

    raci.summary.workloadAnalysis.forEach(analysis => {
      html += `
        <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
          <h3>${analysis.roleName}</h3>
          <p><strong>Total Responsibilities:</strong> ${analysis.totalResponsibilities}</p>
          <p><strong>High Priority Responsibilities:</strong> ${analysis.highPriorityResponsibilities}</p>
          <p><strong>Estimated Effort:</strong> ${analysis.estimatedEffort}</p>
          <p><strong>Recommendations:</strong></p>
          <ul>
            ${analysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
      `;
    });

    html += `
      </body>
      </html>
    `;

    return html;
  }
}

export const raciMatrixService = RACIMatrixService.getInstance();