/**
 * 🛡️ Controls Service
 * Manages security controls for CMMC compliance
 */

import { logger } from '../utils/logger';

export interface Control {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  framework: string;
  controlId: string;
  status: 'implemented' | 'partially-implemented' | 'not-implemented' | 'not-applicable';
  priority: 'low' | 'medium' | 'high' | 'critical';
  owner: string;
  lastReviewed: Date;
  nextReview: Date;
  evidence: string[];
  notes: string;
  tags: string[];
  dependencies: string[];
  relatedControls: string[];
  implementationGuidance: string;
  testingProcedures: string;
  remediationSteps: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  businessImpact: 'low' | 'medium' | 'high' | 'critical';
  technicalComplexity: 'low' | 'medium' | 'high';
  estimatedEffort: number; // in hours
  actualEffort?: number; // in hours
  costEstimate?: number;
  actualCost?: number;
  completionDate?: Date;
  assignedTo?: string;
  reviewer?: string;
  approvalStatus: 'draft' | 'pending' | 'approved' | 'rejected';
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ControlFilters {
  category?: string;
  status?: string;
  priority?: string;
  owner?: string;
  framework?: string;
  search?: string;
  tags?: string[];
  riskLevel?: string;
}

export interface ControlStatistics {
  total: number;
  implemented: number;
  partiallyImplemented: number;
  notImplemented: number;
  notApplicable: number;
  byPriority: Record<string, number>;
  byCategory: Record<string, number>;
  byRiskLevel: Record<string, number>;
  overdueReviews: number;
  upcomingReviews: number;
}

class ControlsService {
  private static instance: ControlsService;
  private controls: Control[] = [];

  private constructor() {
    this.loadControls();
  }

  public static getInstance(): ControlsService {
    if (!ControlsService.instance) {
      ControlsService.instance = new ControlsService();
    }
    return ControlsService.instance;
  }

  private loadControls(): void {
    try {
      const controlsData = localStorage.getItem('cmc_controls');
      if (controlsData) {
        this.controls = JSON.parse(controlsData).map((control: any) => ({
          ...control,
          lastReviewed: new Date(control.lastReviewed),
          nextReview: new Date(control.nextReview),
          completionDate: control.completionDate ? new Date(control.completionDate) : undefined,
          createdAt: new Date(control.createdAt),
          updatedAt: new Date(control.updatedAt)
        }));
      } else {
        this.initializeDefaultControls();
      }

      logger.debug('Controls loaded successfully', { count: this.controls.length });
    } catch (error) {
      logger.error('Failed to load controls:', error);
      this.controls = [];
      this.initializeDefaultControls();
    }
  }

  private saveControls(): void {
    try {
      localStorage.setItem('cmc_controls', JSON.stringify(this.controls));
      logger.debug('Controls saved successfully', { count: this.controls.length });
    } catch (error) {
      logger.error('Failed to save controls:', error);
      throw new Error('Failed to save controls');
    }
  }

  private initializeDefaultControls(): void {
    const defaultControls: Control[] = [
      {
        id: 'control_ac_001',
        name: 'Limit information system access to authorized users',
        description: 'The organization limits information system access to authorized users, processes acting on behalf of authorized users, or devices (including other information systems).',
        category: 'Access Control',
        subcategory: 'Access Control Policy and Procedures',
        framework: 'CMMC Level 1',
        controlId: 'AC.1.001',
        status: 'not-implemented',
        priority: 'high',
        owner: 'IT Security Team',
        lastReviewed: new Date(),
        nextReview: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        evidence: [],
        notes: '',
        tags: ['access-control', 'authentication', 'authorization'],
        dependencies: [],
        relatedControls: ['AC.1.002', 'AC.1.003'],
        implementationGuidance: 'Implement user access controls including user accounts, authentication mechanisms, and authorization policies.',
        testingProcedures: 'Test user access controls by attempting unauthorized access and verifying proper access restrictions.',
        remediationSteps: [
          'Implement user account management system',
          'Configure authentication mechanisms',
          'Establish authorization policies',
          'Test access controls'
        ],
        riskLevel: 'high',
        businessImpact: 'high',
        technicalComplexity: 'medium',
        estimatedEffort: 40,
        costEstimate: 5000,
        approvalStatus: 'draft',
        version: '1.0',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'control_at_001',
        name: 'Provide basic security awareness training',
        description: 'The organization provides basic security awareness training to information system users (including managers, senior executives, and contractors).',
        category: 'Awareness and Training',
        subcategory: 'Security Awareness and Training Policy and Procedures',
        framework: 'CMMC Level 1',
        controlId: 'AT.1.001',
        status: 'implemented',
        priority: 'medium',
        owner: 'HR Department',
        lastReviewed: new Date(),
        nextReview: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 180 days from now
        evidence: ['training-certificate-001', 'training-attendance-001'],
        notes: 'Annual security awareness training completed for all employees',
        tags: ['training', 'awareness', 'education'],
        dependencies: [],
        relatedControls: ['AT.1.002'],
        implementationGuidance: 'Develop and deliver security awareness training program covering basic security concepts and organizational policies.',
        testingProcedures: 'Verify training completion through attendance records and assessment scores.',
        remediationSteps: [],
        riskLevel: 'medium',
        businessImpact: 'medium',
        technicalComplexity: 'low',
        estimatedEffort: 20,
        actualEffort: 18,
        costEstimate: 2000,
        actualCost: 1800,
        completionDate: new Date(),
        approvalStatus: 'approved',
        version: '1.0',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    this.controls = defaultControls;
    this.saveControls();
  }

  public async getControls(): Promise<Control[]> {
    return [...this.controls];
  }

  public async getControlById(id: string): Promise<Control | null> {
    return this.controls.find(control => control.id === id) || null;
  }

  public async searchControls(filters: ControlFilters): Promise<Control[]> {
    return this.controls.filter(control => {
      if (filters.category && control.category !== filters.category) return false;
      if (filters.status && control.status !== filters.status) return false;
      if (filters.priority && control.priority !== filters.priority) return false;
      if (filters.owner && !control.owner.toLowerCase().includes(filters.owner.toLowerCase())) return false;
      if (filters.framework && control.framework !== filters.framework) return false;
      if (filters.riskLevel && control.riskLevel !== filters.riskLevel) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = control.name.toLowerCase().includes(searchLower) ||
                             control.description.toLowerCase().includes(searchLower) ||
                             control.controlId.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => control.tags.includes(tag));
        if (!hasMatchingTag) return false;
      }
      return true;
    });
  }

  public async getControlStatistics(): Promise<ControlStatistics> {
    const total = this.controls.length;
    const implemented = this.controls.filter(c => c.status === 'implemented').length;
    const partiallyImplemented = this.controls.filter(c => c.status === 'partially-implemented').length;
    const notImplemented = this.controls.filter(c => c.status === 'not-implemented').length;
    const notApplicable = this.controls.filter(c => c.status === 'not-applicable').length;

    const byPriority = this.controls.reduce((acc, control) => {
      acc[control.priority] = (acc[control.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byCategory = this.controls.reduce((acc, control) => {
      acc[control.category] = (acc[control.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byRiskLevel = this.controls.reduce((acc, control) => {
      acc[control.riskLevel] = (acc[control.riskLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const now = new Date();
    const overdueReviews = this.controls.filter(c => c.nextReview < now).length;
    const upcomingReviews = this.controls.filter(c => {
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      return c.nextReview > now && c.nextReview < thirtyDaysFromNow;
    }).length;

    return {
      total,
      implemented,
      partiallyImplemented,
      notImplemented,
      notApplicable,
      byPriority,
      byCategory,
      byRiskLevel,
      overdueReviews,
      upcomingReviews
    };
  }

  public async createControl(controlData: Partial<Control>): Promise<Control> {
    const now = new Date();
    const newControl: Control = {
      id: `control_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: controlData.name || '',
      description: controlData.description || '',
      category: controlData.category || '',
      subcategory: controlData.subcategory || '',
      framework: controlData.framework || 'CMMC Level 1',
      controlId: controlData.controlId || '',
      status: controlData.status || 'not-implemented',
      priority: controlData.priority || 'medium',
      owner: controlData.owner || '',
      lastReviewed: now,
      nextReview: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
      evidence: controlData.evidence || [],
      notes: controlData.notes || '',
      tags: controlData.tags || [],
      dependencies: controlData.dependencies || [],
      relatedControls: controlData.relatedControls || [],
      implementationGuidance: controlData.implementationGuidance || '',
      testingProcedures: controlData.testingProcedures || '',
      remediationSteps: controlData.remediationSteps || [],
      riskLevel: controlData.riskLevel || 'medium',
      businessImpact: controlData.businessImpact || 'medium',
      technicalComplexity: controlData.technicalComplexity || 'medium',
      estimatedEffort: controlData.estimatedEffort || 0,
      costEstimate: controlData.costEstimate,
      assignedTo: controlData.assignedTo,
      reviewer: controlData.reviewer,
      approvalStatus: controlData.approvalStatus || 'draft',
      version: '1.0',
      createdAt: now,
      updatedAt: now,
      ...controlData
    };

    this.controls.push(newControl);
    this.saveControls();

    logger.info('Control created successfully', { 
      controlId: newControl.id, 
      name: newControl.name 
    });

    return newControl;
  }

  public async updateControl(id: string, updates: Partial<Control>): Promise<Control> {
    const controlIndex = this.controls.findIndex(control => control.id === id);
    if (controlIndex === -1) {
      throw new Error(`Control with id ${id} not found`);
    }

    const updatedControl: Control = {
      ...this.controls[controlIndex],
      ...updates,
      updatedAt: new Date()
    };

    this.controls[controlIndex] = updatedControl;
    this.saveControls();

    logger.info('Control updated successfully', { 
      controlId: id, 
      name: updatedControl.name 
    });

    return updatedControl;
  }

  public async deleteControl(id: string): Promise<void> {
    const controlIndex = this.controls.findIndex(control => control.id === id);
    if (controlIndex === -1) {
      throw new Error(`Control with id ${id} not found`);
    }

    const deletedControl = this.controls[controlIndex];
    this.controls.splice(controlIndex, 1);
    this.saveControls();

    logger.info('Control deleted successfully', { 
      controlId: id, 
      name: deletedControl.name 
    });
  }

  public async exportControls(): Promise<string> {
    try {
      const exportData = {
        controls: this.controls,
        exportedAt: new Date().toISOString(),
        version: '1.0.0'
      };
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      logger.error('Failed to export controls:', error);
      throw new Error('Failed to export controls');
    }
  }

  public async importControls(data: string): Promise<{ success: number; errors: string[] }> {
    try {
      const importedData = JSON.parse(data);
      const results = { success: 0, errors: [] as string[] };

      if (importedData.controls && Array.isArray(importedData.controls)) {
        importedData.controls.forEach((controlData: any) => {
          try {
            const control: Control = {
              ...controlData,
              id: `control_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              lastReviewed: new Date(controlData.lastReviewed),
              nextReview: new Date(controlData.nextReview),
              completionDate: controlData.completionDate ? new Date(controlData.completionDate) : undefined,
              createdAt: new Date(),
              updatedAt: new Date()
            };

            this.controls.push(control);
            results.success++;
          } catch (error) {
            results.errors.push(`Control ${controlData.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        });

        this.saveControls();
      }

      logger.info('Controls import completed', { 
        success: results.success, 
        errors: results.errors.length 
      });

      return results;
    } catch (error) {
      logger.error('Failed to import controls:', error);
      throw new Error(`Failed to import controls: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const controlsService = ControlsService.getInstance();