/**
 * 🔄 Workflow API Service
 * Manages workflow operations for CMMC compliance assessments
 */

import { logger } from '../utils/logger';

export interface Workflow {
  id: string;
  assessmentId: string;
  templateId: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  phases: WorkflowPhase[];
  currentPhaseId?: string;
  progress: number;
  estimatedDuration: number; // in days
  actualDuration?: number; // in days
  metadata: Record<string, any>;
}

export interface WorkflowPhase {
  id: string;
  workflowId: string;
  name: string;
  description: string;
  order: number;
  status: 'pending' | 'in-progress' | 'completed' | 'skipped';
  startDate?: Date;
  endDate?: Date;
  estimatedDuration: number; // in days
  actualDuration?: number; // in days
  assignedTo: string[];
  tasks: WorkflowTask[];
  dependencies: string[];
  completionCriteria: string[];
  deliverables: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowTask {
  id: string;
  phaseId: string;
  name: string;
  description: string;
  type: 'assessment' | 'review' | 'approval' | 'documentation' | 'training' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  assignedTo: string[];
  dueDate?: Date;
  completedDate?: Date;
  estimatedEffort: number; // in hours
  actualEffort?: number; // in hours
  dependencies: string[];
  deliverables: string[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowProgress {
  workflowId: string;
  overallProgress: number;
  phaseProgress: Array<{
    phaseId: string;
    phaseName: string;
    progress: number;
    status: string;
  }>;
  taskProgress: Array<{
    taskId: string;
    taskName: string;
    progress: number;
    status: string;
  }>;
  completedTasks: number;
  totalTasks: number;
  completedPhases: number;
  totalPhases: number;
  estimatedCompletionDate?: Date;
  actualCompletionDate?: Date;
  isOnTrack: boolean;
  delays: Array<{
    phaseId: string;
    taskId?: string;
    reason: string;
    impact: 'low' | 'medium' | 'high' | 'critical';
  }>;
}

export interface WorkflowAnalytics {
  workflowId: string;
  totalDuration: number;
  averagePhaseDuration: number;
  averageTaskDuration: number;
  efficiency: number;
  bottlenecks: Array<{
    phaseId: string;
    taskId?: string;
    delay: number;
    reason: string;
  }>;
  teamPerformance: Array<{
    userId: string;
    userName: string;
    tasksCompleted: number;
    averageCompletionTime: number;
    efficiency: number;
  }>;
  qualityMetrics: {
    firstTimeCompletionRate: number;
    reworkRate: number;
    approvalRate: number;
  };
}

class WorkflowApiService {
  private static instance: WorkflowApiService;
  private workflows: Workflow[] = [];

  private constructor() {
    this.loadWorkflows();
  }

  public static getInstance(): WorkflowApiService {
    if (!WorkflowApiService.instance) {
      WorkflowApiService.instance = new WorkflowApiService();
    }
    return WorkflowApiService.instance;
  }

  private loadWorkflows(): void {
    try {
      const workflowsData = localStorage.getItem('cmc_workflows');
      if (workflowsData) {
        this.workflows = JSON.parse(workflowsData).map((workflow: any) => ({
          ...workflow,
          createdAt: new Date(workflow.createdAt),
          updatedAt: new Date(workflow.updatedAt),
          phases: workflow.phases.map((phase: any) => ({
            ...phase,
            startDate: phase.startDate ? new Date(phase.startDate) : undefined,
            endDate: phase.endDate ? new Date(phase.endDate) : undefined,
            createdAt: new Date(phase.createdAt),
            updatedAt: new Date(phase.updatedAt),
            tasks: phase.tasks.map((task: any) => ({
              ...task,
              dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
              completedDate: task.completedDate ? new Date(task.completedDate) : undefined,
              createdAt: new Date(task.createdAt),
              updatedAt: new Date(task.updatedAt)
            }))
          }))
        }));
      }

      logger.debug('Workflows loaded successfully', { count: this.workflows.length });
    } catch (error) {
      logger.error('Failed to load workflows:', error);
      this.workflows = [];
    }
  }

  private saveWorkflows(): void {
    try {
      localStorage.setItem('cmc_workflows', JSON.stringify(this.workflows));
      logger.debug('Workflows saved successfully', { count: this.workflows.length });
    } catch (error) {
      logger.error('Failed to save workflows:', error);
      throw new Error('Failed to save workflows');
    }
  }

  public async createWorkflow(assessmentId: string, templateId: string): Promise<Workflow> {
    try {
      const now = new Date();
      const workflowId = `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create default workflow phases based on template
      const phases = this.createDefaultPhases(workflowId, templateId);

      const workflow: Workflow = {
        id: workflowId,
        assessmentId,
        templateId,
        name: `Workflow for Assessment ${assessmentId}`,
        description: `Automated workflow for CMMC assessment ${assessmentId}`,
        status: 'draft',
        createdAt: now,
        updatedAt: now,
        createdBy: 'system',
        phases,
        currentPhaseId: phases[0]?.id,
        progress: 0,
        estimatedDuration: phases.reduce((sum, phase) => sum + phase.estimatedDuration, 0),
        metadata: {}
      };

      this.workflows.push(workflow);
      this.saveWorkflows();

      logger.info('Workflow created successfully', { 
        workflowId, 
        assessmentId, 
        templateId 
      });

      return workflow;
    } catch (error) {
      logger.error('Failed to create workflow:', error);
      throw new Error(`Failed to create workflow: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private createDefaultPhases(workflowId: string, templateId: string): WorkflowPhase[] {
    const now = new Date();
    const phases: WorkflowPhase[] = [
      {
        id: `phase_${Date.now()}_1`,
        workflowId,
        name: 'Assessment Preparation',
        description: 'Prepare for CMMC assessment by gathering documentation and resources',
        order: 1,
        status: 'pending',
        estimatedDuration: 7,
        assignedTo: ['IT Security Team'],
        tasks: [
          {
            id: `task_${Date.now()}_1`,
            phaseId: `phase_${Date.now()}_1`,
            name: 'Gather Documentation',
            description: 'Collect all required documentation for assessment',
            type: 'documentation',
            priority: 'high',
            status: 'pending',
            assignedTo: ['IT Security Team'],
            estimatedEffort: 16,
            dependencies: [],
            deliverables: ['Documentation Inventory'],
            notes: '',
            createdAt: now,
            updatedAt: now
          }
        ],
        dependencies: [],
        completionCriteria: ['All documentation gathered', 'Team assigned'],
        deliverables: ['Documentation Inventory', 'Team Assignment'],
        createdAt: now,
        updatedAt: now
      },
      {
        id: `phase_${Date.now()}_2`,
        workflowId,
        name: 'Assessment Execution',
        description: 'Execute the CMMC assessment according to the framework',
        order: 2,
        status: 'pending',
        estimatedDuration: 14,
        assignedTo: ['Assessment Team'],
        tasks: [
          {
            id: `task_${Date.now()}_2`,
            phaseId: `phase_${Date.now()}_2`,
            name: 'Conduct Assessment',
            description: 'Perform the actual CMMC assessment',
            type: 'assessment',
            priority: 'critical',
            status: 'pending',
            assignedTo: ['Assessment Team'],
            estimatedEffort: 40,
            dependencies: ['task_1'],
            deliverables: ['Assessment Results'],
            notes: '',
            createdAt: now,
            updatedAt: now
          }
        ],
        dependencies: ['phase_1'],
        completionCriteria: ['Assessment completed', 'Results documented'],
        deliverables: ['Assessment Results', 'Evidence Collection'],
        createdAt: now,
        updatedAt: now
      },
      {
        id: `phase_${Date.now()}_3`,
        workflowId,
        name: 'Review and Approval',
        description: 'Review assessment results and obtain necessary approvals',
        order: 3,
        status: 'pending',
        estimatedDuration: 5,
        assignedTo: ['CISO', 'Compliance Team'],
        tasks: [
          {
            id: `task_${Date.now()}_3`,
            phaseId: `phase_${Date.now()}_3`,
            name: 'Review Results',
            description: 'Review assessment results for accuracy and completeness',
            type: 'review',
            priority: 'high',
            status: 'pending',
            assignedTo: ['CISO'],
            estimatedEffort: 8,
            dependencies: ['task_2'],
            deliverables: ['Review Report'],
            notes: '',
            createdAt: now,
            updatedAt: now
          }
        ],
        dependencies: ['phase_2'],
        completionCriteria: ['Review completed', 'Approvals obtained'],
        deliverables: ['Review Report', 'Approval Documentation'],
        createdAt: now,
        updatedAt: now
      }
    ];

    return phases;
  }

  public async getWorkflowPhases(assessmentId: string): Promise<WorkflowPhase[]> {
    try {
      const workflow = this.workflows.find(w => w.assessmentId === assessmentId);
      if (!workflow) {
        throw new Error(`Workflow not found for assessment ${assessmentId}`);
      }

      return workflow.phases;
    } catch (error) {
      logger.error('Failed to get workflow phases:', error);
      throw new Error(`Failed to get workflow phases: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async updateWorkflowPhase(phaseId: string, updates: Partial<WorkflowPhase>): Promise<WorkflowPhase> {
    try {
      const workflow = this.workflows.find(w => w.phases.some(p => p.id === phaseId));
      if (!workflow) {
        throw new Error(`Workflow not found for phase ${phaseId}`);
      }

      const phaseIndex = workflow.phases.findIndex(p => p.id === phaseId);
      if (phaseIndex === -1) {
        throw new Error(`Phase ${phaseId} not found`);
      }

      const updatedPhase: WorkflowPhase = {
        ...workflow.phases[phaseIndex],
        ...updates,
        updatedAt: new Date()
      };

      workflow.phases[phaseIndex] = updatedPhase;
      workflow.updatedAt = new Date();
      this.saveWorkflows();

      logger.info('Workflow phase updated successfully', { phaseId });

      return updatedPhase;
    } catch (error) {
      logger.error('Failed to update workflow phase:', error);
      throw new Error(`Failed to update workflow phase: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async getWorkflowProgress(assessmentId: string): Promise<WorkflowProgress> {
    try {
      const workflow = this.workflows.find(w => w.assessmentId === assessmentId);
      if (!workflow) {
        throw new Error(`Workflow not found for assessment ${assessmentId}`);
      }

      const totalTasks = workflow.phases.reduce((sum, phase) => sum + phase.tasks.length, 0);
      const completedTasks = workflow.phases.reduce((sum, phase) => 
        sum + phase.tasks.filter(task => task.status === 'completed').length, 0
      );

      const totalPhases = workflow.phases.length;
      const completedPhases = workflow.phases.filter(phase => phase.status === 'completed').length;

      const overallProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      const phaseProgress = workflow.phases.map(phase => {
        const phaseTaskCount = phase.tasks.length;
        const completedPhaseTasks = phase.tasks.filter(task => task.status === 'completed').length;
        const progress = phaseTaskCount > 0 ? (completedPhaseTasks / phaseTaskCount) * 100 : 0;

        return {
          phaseId: phase.id,
          phaseName: phase.name,
          progress,
          status: phase.status
        };
      });

      const taskProgress = workflow.phases.flatMap(phase => 
        phase.tasks.map(task => ({
          taskId: task.id,
          taskName: task.name,
          progress: task.status === 'completed' ? 100 : task.status === 'in-progress' ? 50 : 0,
          status: task.status
        }))
      );

      const isOnTrack = overallProgress >= 80; // Simplified on-track calculation

      const progress: WorkflowProgress = {
        workflowId: workflow.id,
        overallProgress,
        phaseProgress,
        taskProgress,
        completedTasks,
        totalTasks,
        completedPhases,
        totalPhases,
        isOnTrack,
        delays: []
      };

      return progress;
    } catch (error) {
      logger.error('Failed to get workflow progress:', error);
      throw new Error(`Failed to get workflow progress: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async getWorkflowAnalytics(assessmentId: string): Promise<WorkflowAnalytics> {
    try {
      const workflow = this.workflows.find(w => w.assessmentId === assessmentId);
      if (!workflow) {
        throw new Error(`Workflow not found for assessment ${assessmentId}`);
      }

      const totalDuration = workflow.actualDuration || workflow.estimatedDuration;
      const averagePhaseDuration = totalDuration / workflow.phases.length;
      const averageTaskDuration = workflow.phases.reduce((sum, phase) => 
        sum + phase.tasks.reduce((taskSum, task) => taskSum + (task.actualEffort || task.estimatedEffort), 0), 0
      ) / workflow.phases.reduce((sum, phase) => sum + phase.tasks.length, 0);

      const efficiency = 85; // Simplified efficiency calculation

      const analytics: WorkflowAnalytics = {
        workflowId: workflow.id,
        totalDuration,
        averagePhaseDuration,
        averageTaskDuration,
        efficiency,
        bottlenecks: [],
        teamPerformance: [],
        qualityMetrics: {
          firstTimeCompletionRate: 90,
          reworkRate: 5,
          approvalRate: 95
        }
      };

      return analytics;
    } catch (error) {
      logger.error('Failed to get workflow analytics:', error);
      throw new Error(`Failed to get workflow analytics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async getTasksWithWorkflow(assessmentId: string): Promise<WorkflowTask[]> {
    try {
      const workflow = this.workflows.find(w => w.assessmentId === assessmentId);
      if (!workflow) {
        return [];
      }

      return workflow.phases.flatMap(phase => phase.tasks);
    } catch (error) {
      logger.error('Failed to get tasks with workflow:', error);
      throw new Error(`Failed to get tasks with workflow: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const workflowApiService = WorkflowApiService.getInstance();