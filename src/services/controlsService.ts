import { dataService } from './dataService';
import { logger } from '../utils/logger';

export interface Control {
  id: string;
  name: string;
  description: string;
  framework: string;
  nistFunction: string;
  nistCategory: string;
  status: 'not-implemented' | 'planned' | 'in-progress' | 'implemented' | 'tested';
  priority: 'low' | 'medium' | 'high' | 'critical';
  owner: string;
  lastAssessed: Date;
  nextAssessment: Date;
  effectiveness: 'not-effective' | 'partially-effective' | 'largely-effective' | 'fully-effective';
  implementationNotes: string;
  evidence: string[];
  relatedControls: string[];
  complianceStatus: 'compliant' | 'partially-compliant' | 'non-compliant' | 'not-assessed';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  cost: number;
  effort: 'low' | 'medium' | 'high';
  timeline: string;
  dependencies: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ControlFilters {
  status?: string;
  function?: string;
  priority?: string;
  owner?: string;
  search?: string;
}

export class ControlsService {
  private static instance: ControlsService;
  private readonly STORAGE_KEY = 'cybersecurity-controls';

  static getInstance(): ControlsService {
    if (!ControlsService.instance) {
      ControlsService.instance = new ControlsService();
    }
    return ControlsService.instance;
  }

  async getControls(): Promise<Control[]> {
    try {
      const data = dataService.getData();
      return data.controls || [];
    } catch (error) {
      logger.error('Error fetching controls:', error);
      return [];
    }
  }

  async getControl(id: string): Promise<Control | null> {
    try {
      const controls = await this.getControls();
      return controls.find(control => control.id === id) || null;
    } catch (error) {
      logger.error('Error fetching control:', error);
      return null;
    }
  }

  async saveControl(control: Omit<Control, 'createdAt' | 'updatedAt'>): Promise<Control> {
    try {
      const controls = await this.getControls();
      const now = new Date();
      
      const newControl: Control = {
        ...control,
        createdAt: now,
        updatedAt: now
      };

      const existingIndex = controls.findIndex(c => c.id === control.id);
      
      if (existingIndex >= 0) {
        controls[existingIndex] = { ...newControl, createdAt: controls[existingIndex].createdAt };
      } else {
        controls.push(newControl);
      }

      await this.saveControls(controls);
      return newControl;
    } catch (error) {
      logger.error('Error saving control:', error);
      throw error;
    }
  }

  async updateControl(id: string, updates: Partial<Control>): Promise<Control> {
    try {
      const controls = await this.getControls();
      const index = controls.findIndex(c => c.id === id);
      
      if (index === -1) {
        throw new Error('Control not found');
      }

      controls[index] = {
        ...controls[index],
        ...updates,
        updatedAt: new Date()
      };

      await this.saveControls(controls);
      return controls[index];
    } catch (error) {
      logger.error('Error updating control:', error);
      throw error;
    }
  }

  async deleteControl(id: string): Promise<void> {
    try {
      const controls = await this.getControls();
      const filteredControls = controls.filter(c => c.id !== id);
      await this.saveControls(filteredControls);
    } catch (error) {
      logger.error('Error deleting control:', error);
      throw error;
    }
  }

  async searchControls(filters: ControlFilters): Promise<Control[]> {
    try {
      let controls = await this.getControls();

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        controls = controls.filter(control =>
          control.name.toLowerCase().includes(searchTerm) ||
          control.description.toLowerCase().includes(searchTerm) ||
          control.framework.toLowerCase().includes(searchTerm)
        );
      }

      if (filters.status && filters.status !== 'all') {
        controls = controls.filter(control => control.status === filters.status);
      }

      if (filters.function && filters.function !== 'all') {
        controls = controls.filter(control => control.nistFunction === filters.function);
      }

      if (filters.priority && filters.priority !== 'all') {
        controls = controls.filter(control => control.priority === filters.priority);
      }

      if (filters.owner && filters.owner !== 'all') {
        controls = controls.filter(control => control.owner === filters.owner);
      }

      return controls;
    } catch (error) {
      logger.error('Error searching controls:', error);
      return [];
    }
  }

  async getControlsByStatus(status: Control['status']): Promise<Control[]> {
    try {
      const controls = await this.getControls();
      return controls.filter(control => control.status === status);
    } catch (error) {
      logger.error('Error fetching controls by status:', error);
      return [];
    }
  }

  async getControlsByOwner(owner: string): Promise<Control[]> {
    try {
      const controls = await this.getControls();
      return controls.filter(control => control.owner === owner);
    } catch (error) {
      logger.error('Error fetching controls by owner:', error);
      return [];
    }
  }

  async getControlsByPriority(priority: Control['priority']): Promise<Control[]> {
    try {
      const controls = await this.getControls();
      return controls.filter(control => control.priority === priority);
    } catch (error) {
      logger.error('Error fetching controls by priority:', error);
      return [];
    }
  }

  async getControlStatistics(): Promise<{
    total: number;
    byStatus: Record<Control['status'], number>;
    byPriority: Record<Control['priority'], number>;
    byOwner: Record<string, number>;
    byFunction: Record<string, number>;
    complianceRate: number;
    averageEffectiveness: number;
  }> {
    try {
      const controls = await this.getControls();
      
      const byStatus = controls.reduce((acc, control) => {
        acc[control.status] = (acc[control.status] || 0) + 1;
        return acc;
      }, {} as Record<Control['status'], number>);

      const byPriority = controls.reduce((acc, control) => {
        acc[control.priority] = (acc[control.priority] || 0) + 1;
        return acc;
      }, {} as Record<Control['priority'], number>);

      const byOwner = controls.reduce((acc, control) => {
        acc[control.owner] = (acc[control.owner] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const byFunction = controls.reduce((acc, control) => {
        acc[control.nistFunction] = (acc[control.nistFunction] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const compliantControls = controls.filter(c => c.complianceStatus === 'compliant').length;
      const complianceRate = controls.length > 0 ? (compliantControls / controls.length) * 100 : 0;

      const effectivenessScores = {
        'not-effective': 0,
        'partially-effective': 1,
        'largely-effective': 2,
        'fully-effective': 3
      };

      const averageEffectiveness = controls.length > 0 
        ? controls.reduce((sum, control) => sum + effectivenessScores[control.effectiveness], 0) / controls.length
        : 0;

      return {
        total: controls.length,
        byStatus,
        byPriority,
        byOwner,
        byFunction,
        complianceRate,
        averageEffectiveness
      };
    } catch (error) {
      logger.error('Error calculating control statistics:', error);
      return {
        total: 0,
        byStatus: {} as Record<Control['status'], number>,
        byPriority: {} as Record<Control['priority'], number>,
        byOwner: {},
        byFunction: {},
        complianceRate: 0,
        averageEffectiveness: 0
      };
    }
  }

  async generateControlsFromAssessment(assessmentData: any): Promise<Control[]> {
    try {
      const controls: Control[] = [];
      const now = new Date();
      
      // Generate controls based on CMMC framework
      const cmmcFramework = await import('../data/frameworks/cmmc');
      
      cmmcFramework.cmmcFramework.sections.forEach(section => {
        section.categories.forEach(category => {
          category.questions.forEach(question => {
            const response = assessmentData.responses[question.id] || 0;
            const status = this.mapResponseToStatus(response);
            const priority = this.determinePriority(question.priority, status);
            
            controls.push({
              id: question.id,
              name: question.text,
              description: question.guidance,
              framework: 'CMMC 2.0 Level 2',
              nistFunction: this.mapDomainToNISTFunction(section.name),
              nistCategory: section.name,
              status,
              priority,
              owner: this.assignOwner(section.name),
              lastAssessed: now,
              nextAssessment: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000), // 90 days
              effectiveness: this.mapResponseToEffectiveness(response),
              implementationNotes: this.generateImplementationNotes(question, response),
              evidence: this.generateEvidenceRequirements(question),
              relatedControls: this.findRelatedControls(question.id, cmmcFramework.cmmcFramework),
              complianceStatus: this.mapResponseToComplianceStatus(response),
              riskLevel: this.determineRiskLevel(priority, status),
              cost: this.estimateCost(priority, status),
              effort: this.estimateEffort(priority, status),
              timeline: this.estimateTimeline(priority, status),
              dependencies: this.identifyDependencies(question, section.name),
              createdAt: now,
              updatedAt: now
            });
          });
        });
      });

      return controls;
    } catch (error) {
      logger.error('Error generating controls from assessment:', error);
      return [];
    }
  }

  private mapResponseToStatus(response: number): Control['status'] {
    if (response >= 3) return 'implemented';
    if (response >= 2) return 'in-progress';
    if (response >= 1) return 'planned';
    return 'not-implemented';
  }

  private mapResponseToEffectiveness(response: number): Control['effectiveness'] {
    if (response >= 3) return 'fully-effective';
    if (response >= 2) return 'largely-effective';
    if (response >= 1) return 'partially-effective';
    return 'not-effective';
  }

  private mapResponseToComplianceStatus(response: number): Control['complianceStatus'] {
    if (response >= 3) return 'compliant';
    if (response >= 1) return 'partially-compliant';
    return 'non-compliant';
  }

  private determinePriority(questionPriority: string, status: Control['status']): Control['priority'] {
    if (status === 'not-implemented' && questionPriority === 'high') return 'critical';
    if (questionPriority === 'high') return 'high';
    if (questionPriority === 'medium') return 'medium';
    return 'low';
  }

  private determineRiskLevel(priority: Control['priority'], status: Control['status']): Control['riskLevel'] {
    if (priority === 'critical' || status === 'not-implemented') return 'critical';
    if (priority === 'high' || status === 'planned') return 'high';
    if (priority === 'medium' || status === 'in-progress') return 'medium';
    return 'low';
  }

  private estimateCost(priority: Control['priority'], status: Control['status']): number {
    const baseCost = {
      'low': 1000,
      'medium': 5000,
      'high': 15000,
      'critical': 30000
    }[priority];

    const statusMultiplier = {
      'not-implemented': 1.0,
      'planned': 0.8,
      'in-progress': 0.5,
      'implemented': 0.2,
      'tested': 0.1
    }[status];

    return Math.round(baseCost * statusMultiplier);
  }

  private estimateEffort(priority: Control['priority'], status: Control['status']): Control['effort'] {
    if (priority === 'critical' || status === 'not-implemented') return 'high';
    if (priority === 'high' || status === 'planned') return 'medium';
    return 'low';
  }

  private estimateTimeline(priority: Control['priority'], status: Control['status']): string {
    const days = {
      'low': 7,
      'medium': 14,
      'high': 30,
      'critical': 60
    }[priority];

    const statusMultiplier = {
      'not-implemented': 1.0,
      'planned': 0.8,
      'in-progress': 0.5,
      'implemented': 0.1,
      'tested': 0.05
    }[status];

    const totalDays = Math.ceil(days * statusMultiplier);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + totalDays);
    
    return `${totalDays} days (by ${endDate.toLocaleDateString()})`;
  }

  private mapDomainToNISTFunction(domain: string): string {
    const mapping: Record<string, string> = {
      'Access Control': 'Protect',
      'Audit and Accountability': 'Detect',
      'Awareness and Training': 'Protect',
      'Configuration Management': 'Protect',
      'Identification and Authentication': 'Protect',
      'Incident Response': 'Respond',
      'Maintenance': 'Protect',
      'Media Protection': 'Protect',
      'Personnel Security': 'Protect',
      'Physical Protection': 'Protect',
      'Risk Assessment': 'Identify',
      'Security Assessment': 'Detect',
      'System and Communications Protection': 'Protect',
      'System and Information Integrity': 'Protect'
    };
    
    return mapping[domain] || 'Protect';
  }

  private assignOwner(domain: string): string {
    const owners: Record<string, string> = {
      'Access Control': 'IT Security Team',
      'Audit and Accountability': 'IT Security Team',
      'Awareness and Training': 'HR Team',
      'Configuration Management': 'IT Operations',
      'Identification and Authentication': 'IT Security Team',
      'Incident Response': 'Security Operations',
      'Maintenance': 'IT Operations',
      'Media Protection': 'IT Security Team',
      'Personnel Security': 'HR Team',
      'Physical Protection': 'Facilities Team',
      'Risk Assessment': 'Risk Management',
      'Security Assessment': 'IT Security Team',
      'System and Communications Protection': 'Network Team',
      'System and Information Integrity': 'IT Security Team'
    };
    
    return owners[domain] || 'IT Security Team';
  }

  private generateImplementationNotes(question: any, response: number): string {
    const status = this.mapResponseToStatus(response);
    
    switch (status) {
      case 'implemented':
        return `Control is fully implemented. ${question.examples?.join(', ')} are in place and functioning as required.`;
      case 'in-progress':
        return `Control implementation is in progress. Some ${question.examples?.join(', ')} are in place but additional work is needed.`;
      case 'planned':
        return `Control implementation is planned. ${question.examples?.join(', ')} need to be implemented.`;
      default:
        return `Control has not been implemented. Implementation of ${question.examples?.join(', ')} is required for compliance.`;
    }
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

  private findRelatedControls(controlId: string, framework: any): string[] {
    // Find controls in the same domain
    const relatedControls: string[] = [];
    
    framework.sections.forEach((section: any) => {
      section.categories.forEach((category: any) => {
        category.questions.forEach((question: any) => {
          if (question.id !== controlId && question.id.startsWith(controlId.split('.')[0])) {
            relatedControls.push(question.id);
          }
        });
      });
    });
    
    return relatedControls.slice(0, 3); // Limit to 3 related controls
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

  private async saveControls(controls: Control[]): Promise<void> {
    try {
      const data = dataService.getData();
      data.controls = controls;
      await dataService.saveData(data);
    } catch (error) {
      logger.error('Error saving controls:', error);
      throw error;
    }
  }
}

export const controlsService = ControlsService.getInstance();