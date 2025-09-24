import { AssessmentData, Framework } from '../shared/types';
import { cmmc2Level1Framework } from '../data/frameworks/cmmc-2.0-level1';

export interface POAMDocument {
  id: string;
  title: string;
  version: string;
  organization: string;
  generatedDate: Date;
  milestones: POAMMilestone[];
  summary: POAMSummary;
}

export interface POAMMilestone {
  id: string;
  controlId: string;
  controlTitle: string;
  domain: string;
  description: string;
  currentStatus: 'not-implemented' | 'partially-implemented' | 'implemented';
  targetStatus: 'implemented';
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedEffort: 'low' | 'medium' | 'high';
  estimatedCost: number;
  estimatedDuration: number; // in days
  startDate: Date;
  targetDate: Date;
  responsibleParty: string;
  resources: string[];
  dependencies: string[];
  risks: POAMRisk[];
  actions: POAMAction[];
  evidence: string[];
  status: 'planned' | 'in-progress' | 'completed' | 'delayed' | 'cancelled';
}

export interface POAMRisk {
  id: string;
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  probability: 'low' | 'medium' | 'high';
  mitigation: string;
}

export interface POAMAction {
  id: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: Date;
  assignedTo: string;
}

export interface POAMSummary {
  totalMilestones: number;
  completedMilestones: number;
  inProgressMilestones: number;
  plannedMilestones: number;
  criticalMilestones: number;
  highPriorityMilestones: number;
  estimatedTotalCost: number;
  estimatedTotalDuration: number;
  overallProgress: number;
}

export class POAMGenerationService {
  private static instance: POAMGenerationService;

  static getInstance(): POAMGenerationService {
    if (!POAMGenerationService.instance) {
      POAMGenerationService.instance = new POAMGenerationService();
    }
    return POAMGenerationService.instance;
  }

  generatePOAM(assessment: AssessmentData, organizationInfo: {
    name: string;
    systemName: string;
    responsibleParties: string[];
  }): POAMDocument {
    const milestones = this.generateMilestones(assessment, organizationInfo);
    const summary = this.generateSummary(milestones);

    return {
      id: `poam-${Date.now()}`,
      title: `Plan of Actions and Milestones - ${organizationInfo.systemName}`,
      version: '1.0',
      organization: organizationInfo.name,
      generatedDate: new Date(),
      milestones,
      summary
    };
  }

  private generateMilestones(assessment: AssessmentData, organizationInfo: any): POAMMilestone[] {
    const milestones: POAMMilestone[] = [];
    let milestoneCounter = 1;

    cmmc2Level1Framework.sections.forEach(section => {
      section.categories.forEach(category => {
        category.questions.forEach(question => {
          const response = assessment.responses[question.id];
          const currentStatus = this.mapResponseToStatus(response);
          
          if (currentStatus !== 'implemented') {
            const milestone = this.createMilestone(
              milestoneCounter++,
              question,
              section.name,
              currentStatus,
              organizationInfo
            );
            milestones.push(milestone);
          }
        });
      });
    });

    return milestones;
  }

  private mapResponseToStatus(response: number): 'not-implemented' | 'partially-implemented' | 'implemented' {
    if (response >= 3) return 'implemented';
    if (response >= 1) return 'partially-implemented';
    return 'not-implemented';
  }

  private createMilestone(
    id: number,
    question: any,
    domain: string,
    currentStatus: 'not-implemented' | 'partially-implemented',
    organizationInfo: any
  ): POAMMilestone {
    const priority = this.determinePriority(question.priority, currentStatus);
    const effort = this.estimateEffort(question, currentStatus);
    const duration = this.estimateDuration(effort, priority);
    const cost = this.estimateCost(effort, duration);
    
    const startDate = new Date();
    const targetDate = new Date();
    targetDate.setDate(startDate.getDate() + duration);

    return {
      id: `milestone-${id}`,
      controlId: question.id,
      controlTitle: question.text,
      domain,
      description: this.generateMilestoneDescription(question, currentStatus),
      currentStatus,
      targetStatus: 'implemented',
      priority,
      estimatedEffort: effort,
      estimatedCost: cost,
      estimatedDuration: duration,
      startDate,
      targetDate,
      responsibleParty: this.assignResponsibleParty(domain, organizationInfo.responsibleParties),
      resources: this.identifyResources(question, effort),
      dependencies: this.identifyDependencies(question, domain),
      risks: this.identifyRisks(question, priority),
      actions: this.generateActions(question, currentStatus, duration),
      evidence: this.generateEvidenceRequirements(question),
      status: 'planned'
    };
  }

  private determinePriority(questionPriority: string, currentStatus: string): 'critical' | 'high' | 'medium' | 'low' {
    if (currentStatus === 'not-implemented' && questionPriority === 'high') return 'critical';
    if (questionPriority === 'high') return 'high';
    if (questionPriority === 'medium') return 'medium';
    return 'low';
  }

  private estimateEffort(question: any, currentStatus: string): 'low' | 'medium' | 'high' {
    const complexity = question.examples?.length || 3;
    const statusMultiplier = currentStatus === 'not-implemented' ? 1.5 : 1.0;
    
    if (complexity * statusMultiplier >= 6) return 'high';
    if (complexity * statusMultiplier >= 3) return 'medium';
    return 'low';
  }

  private estimateDuration(effort: string, priority: string): number {
    const baseDuration = {
      'low': 7,
      'medium': 14,
      'high': 30
    }[effort];

    const priorityMultiplier = {
      'critical': 0.8,
      'high': 1.0,
      'medium': 1.2,
      'low': 1.5
    }[priority];

    return Math.ceil(baseDuration * priorityMultiplier);
  }

  private estimateCost(effort: string, duration: number): number {
    const hourlyRate = 150; // Average hourly rate for security professionals
    const hoursPerDay = 8;
    
    const totalHours = duration * hoursPerDay;
    const effortMultiplier = {
      'low': 0.5,
      'medium': 1.0,
      'high': 1.5
    }[effort];

    return Math.ceil(totalHours * hourlyRate * effortMultiplier);
  }

  private generateMilestoneDescription(question: any, currentStatus: string): string {
    const statusText = currentStatus === 'not-implemented' ? 'not implemented' : 'partially implemented';
    return `Implement ${question.text}. Currently ${statusText}. ${question.guidance}`;
  }

  private assignResponsibleParty(domain: string, responsibleParties: string[]): string {
    const domainAssignments: Record<string, string> = {
      'Access Control': 'IT Security Team',
      'Audit and Accountability': 'IT Security Team',
      'Awareness and Training': 'HR and Training Team',
      'Configuration Management': 'IT Operations Team',
      'Identification and Authentication': 'IT Security Team',
      'Incident Response': 'Security Operations Team',
      'Maintenance': 'IT Operations Team',
      'Media Protection': 'IT Security Team',
      'Personnel Security': 'HR Team',
      'Physical Protection': 'Facilities Team',
      'Risk Assessment': 'Risk Management Team',
      'Security Assessment': 'IT Security Team',
      'System and Communications Protection': 'Network Team',
      'System and Information Integrity': 'IT Security Team'
    };

    return domainAssignments[domain] || responsibleParties[0] || 'IT Security Team';
  }

  private identifyResources(question: any, effort: string): string[] {
    const baseResources = ['Security personnel', 'IT staff', 'Management oversight'];
    
    if (effort === 'high') {
      return [...baseResources, 'External consultants', 'Additional budget', 'Project management'];
    }
    
    return baseResources;
  }

  private identifyDependencies(question: any, domain: string): string[] {
    const dependencies: string[] = [];
    
    if (domain.includes('Access Control')) {
      dependencies.push('Identity Management System', 'User Directory');
    }
    
    if (domain.includes('Audit')) {
      dependencies.push('Logging Infrastructure', 'SIEM System');
    }
    
    if (domain.includes('Training')) {
      dependencies.push('Training Platform', 'Content Development');
    }
    
    return dependencies;
  }

  private identifyRisks(question: any, priority: string): POAMRisk[] {
    const risks: POAMRisk[] = [
      {
        id: `risk-${Date.now()}-1`,
        description: 'Implementation delays due to resource constraints',
        impact: priority === 'critical' ? 'high' : 'medium',
        probability: 'medium',
        mitigation: 'Allocate dedicated resources and establish clear timelines'
      },
      {
        id: `risk-${Date.now()}-2`,
        description: 'Technical complexity exceeding initial estimates',
        impact: 'medium',
        probability: 'low',
        mitigation: 'Conduct detailed technical assessment and engage subject matter experts'
      }
    ];

    if (priority === 'critical') {
      risks.push({
        id: `risk-${Date.now()}-3`,
        description: 'Compliance deadline pressure',
        impact: 'high',
        probability: 'high',
        mitigation: 'Prioritize critical controls and consider phased implementation'
      });
    }

    return risks;
  }

  private generateActions(question: any, currentStatus: string, duration: number): POAMAction[] {
    const actions: POAMAction[] = [];
    const startDate = new Date();
    
    actions.push({
      id: `action-${Date.now()}-1`,
      description: 'Conduct detailed assessment of current implementation',
      status: 'pending',
      dueDate: new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days
      assignedTo: 'Security Analyst'
    });

    if (currentStatus === 'not-implemented') {
      actions.push({
        id: `action-${Date.now()}-2`,
        description: 'Develop implementation plan and design',
        status: 'pending',
        dueDate: new Date(startDate.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days
        assignedTo: 'Security Architect'
      });
    }

    actions.push({
      id: `action-${Date.now()}-3`,
      description: 'Implement required controls and configurations',
      status: 'pending',
      dueDate: new Date(startDate.getTime() + Math.floor(duration * 0.7) * 24 * 60 * 60 * 1000),
      assignedTo: 'Implementation Team'
    });

    actions.push({
      id: `action-${Date.now()}-4`,
      description: 'Test and validate implementation',
      status: 'pending',
      dueDate: new Date(startDate.getTime() + Math.floor(duration * 0.9) * 24 * 60 * 60 * 1000),
      assignedTo: 'QA Team'
    });

    return actions;
  }

  private generateEvidenceRequirements(question: any): string[] {
    return [
      'Implementation documentation',
      'Configuration screenshots',
      'Test results',
      'Policy updates',
      'Training records'
    ];
  }

  private generateSummary(milestones: POAMMilestone[]): POAMSummary {
    const totalMilestones = milestones.length;
    const completedMilestones = milestones.filter(m => m.status === 'completed').length;
    const inProgressMilestones = milestones.filter(m => m.status === 'in-progress').length;
    const plannedMilestones = milestones.filter(m => m.status === 'planned').length;
    const criticalMilestones = milestones.filter(m => m.priority === 'critical').length;
    const highPriorityMilestones = milestones.filter(m => m.priority === 'high').length;
    
    const estimatedTotalCost = milestones.reduce((sum, m) => sum + m.estimatedCost, 0);
    const estimatedTotalDuration = Math.max(...milestones.map(m => m.estimatedDuration));
    const overallProgress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

    return {
      totalMilestones,
      completedMilestones,
      inProgressMilestones,
      plannedMilestones,
      criticalMilestones,
      highPriorityMilestones,
      estimatedTotalCost,
      estimatedTotalDuration,
      overallProgress
    };
  }

  exportToExcel(poam: POAMDocument): string {
    // This would generate an Excel file - for now return CSV
    return this.generateCSV(poam);
  }

  exportToPDF(poam: POAMDocument): string {
    // This would generate a PDF - for now return HTML
    return this.generateHTML(poam);
  }

  private generateCSV(poam: POAMDocument): string {
    let csv = 'Milestone ID,Control ID,Control Title,Domain,Priority,Status,Start Date,Target Date,Responsible Party,Estimated Cost,Estimated Duration\n';
    
    poam.milestones.forEach(milestone => {
      csv += `"${milestone.id}","${milestone.controlId}","${milestone.controlTitle}","${milestone.domain}","${milestone.priority}","${milestone.status}","${milestone.startDate.toLocaleDateString()}","${milestone.targetDate.toLocaleDateString()}","${milestone.responsibleParty}","${milestone.estimatedCost}","${milestone.estimatedDuration}"\n`;
    });

    return csv;
  }

  private generateHTML(poam: POAMDocument): string {
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${poam.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #2c3e50; border-bottom: 2px solid #3498db; }
          h2 { color: #34495e; margin-top: 30px; }
          h3 { color: #7f8c8d; }
          .header { text-align: center; margin-bottom: 40px; }
          .summary { background: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 30px; }
          .milestone { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
          .priority-critical { border-left: 5px solid #e74c3c; }
          .priority-high { border-left: 5px solid #f39c12; }
          .priority-medium { border-left: 5px solid #f1c40f; }
          .priority-low { border-left: 5px solid #27ae60; }
          .status-planned { background-color: #ecf0f1; }
          .status-in-progress { background-color: #fff3cd; }
          .status-completed { background-color: #d4edda; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${poam.title}</h1>
          <p>Organization: ${poam.organization}</p>
          <p>Version: ${poam.version} | Generated: ${poam.generatedDate.toLocaleDateString()}</p>
        </div>

        <div class="summary">
          <h2>Executive Summary</h2>
          <p><strong>Total Milestones:</strong> ${poam.summary.totalMilestones}</p>
          <p><strong>Completed:</strong> ${poam.summary.completedMilestones} | <strong>In Progress:</strong> ${poam.summary.inProgressMilestones} | <strong>Planned:</strong> ${poam.summary.plannedMilestones}</p>
          <p><strong>Critical Milestones:</strong> ${poam.summary.criticalMilestones} | <strong>High Priority:</strong> ${poam.summary.highPriorityMilestones}</p>
          <p><strong>Estimated Total Cost:</strong> $${poam.summary.estimatedTotalCost.toLocaleString()}</p>
          <p><strong>Estimated Duration:</strong> ${poam.summary.estimatedTotalDuration} days</p>
          <p><strong>Overall Progress:</strong> ${poam.summary.overallProgress.toFixed(1)}%</p>
        </div>

        <h2>Milestones</h2>
    `;

    poam.milestones.forEach(milestone => {
      const priorityClass = `priority-${milestone.priority}`;
      const statusClass = `status-${milestone.status}`;
      
      html += `
        <div class="milestone ${priorityClass} ${statusClass}">
          <h3>${milestone.controlId} - ${milestone.controlTitle}</h3>
          <p><strong>Domain:</strong> ${milestone.domain} | <strong>Priority:</strong> ${milestone.priority} | <strong>Status:</strong> ${milestone.status}</p>
          <p><strong>Description:</strong> ${milestone.description}</p>
          <p><strong>Responsible Party:</strong> ${milestone.responsibleParty}</p>
          <p><strong>Timeline:</strong> ${milestone.startDate.toLocaleDateString()} - ${milestone.targetDate.toLocaleDateString()} (${milestone.estimatedDuration} days)</p>
          <p><strong>Estimated Cost:</strong> $${milestone.estimatedCost.toLocaleString()}</p>
          <p><strong>Resources:</strong> ${milestone.resources.join(', ')}</p>
          <p><strong>Evidence Required:</strong> ${milestone.evidence.join(', ')}</p>
          
          <h4>Actions</h4>
          <ul>
            ${milestone.actions.map(action => `<li>${action.description} (Due: ${action.dueDate.toLocaleDateString()}, Assigned: ${action.assignedTo})</li>`).join('')}
          </ul>
          
          <h4>Risks</h4>
          <ul>
            ${milestone.risks.map(risk => `<li><strong>${risk.description}</strong> (Impact: ${risk.impact}, Probability: ${risk.probability}) - ${risk.mitigation}</li>`).join('')}
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

export const poamGenerationService = POAMGenerationService.getInstance();