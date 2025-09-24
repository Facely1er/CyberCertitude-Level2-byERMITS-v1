export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  nistFunction: 'Govern' | 'Identify' | 'Protect' | 'Detect' | 'Respond' | 'Recover';
  nistCategory: string;
  nistSubcategory: string;
  relatedControlId: string;
  assignedTo: string[];
  assignedBy: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date;
  startDate?: Date;
  completedAt?: Date;
  estimatedHours: number;
  actualHours?: number;
  progress: number;
  dependencies: TaskDependency[];
  subtasks: SubTask[];
  attachments: TaskAttachment[];
  comments: TaskComment[];
  evidence: string[];
  approvalRequired: boolean;
  approvedBy?: string;
  approvedAt?: Date;
  tags: string[];
  workflowId?: string;
  stageId?: string;
  producedEvidenceIds: string[]; // Evidence items this task will generate
  requiredEvidenceIds: string[]; // Evidence items this task depends on
  cmmcDomain?: string; // CMMC domain this task relates to
  cmmcControl?: string; // Specific CMMC control being implemented
  cuiImpact?: 'low' | 'medium' | 'high' | 'critical'; // Impact on CUI protection
  deliverables: string[]; // List of expected deliverables
  segregationOfDuties: boolean; // Whether this task requires segregation of duties
  sspSection?: string; // Related SSP section
  nistSP800171Mapping: string[]; // NIST SP 800-171 control mapping
  metadata: {
    businessImpact: 'low' | 'medium' | 'high' | 'critical';
    technicalComplexity: 'low' | 'medium' | 'high';
    riskReduction: number;
    complianceImpact: string[];
    successCriteria: string[];
    cmmcImpact: string[]; // CMMC domains/controls affected
    selfAssessmentRequired: boolean; // Whether self-assessment validation is required
  };
}

export type TaskType = 
  | 'assessment'
  | 'evidence-collection'
  | 'policy-development'
  | 'control-implementation'
  | 'testing-validation'
  | 'documentation'
  | 'training'
  | 'review-approval'
  | 'monitoring'
  | 'remediation'
  | 'cmmc-implementation'
  | 'cui-protection'
  | 'ssp-development'
  | 'poam-creation'
  | 'c3pao-preparation'
  | 'audit-preparation'
  | 'compliance-validation';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export type TaskStatus = 
  | 'not-started'
  | 'in-progress'
  | 'blocked'
  | 'review'
  | 'approved'
  | 'completed'
  | 'cancelled'
  | 'overdue';

export interface CMMCTaskRelationship {
  taskId: string;
  type: 'blocks' | 'precedes' | 'related';
  description: string;
}

export interface SubTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: TaskStatus;
  dueDate: Date;
  completedAt?: Date;
  estimatedHours: number;
  actualHours?: number;
}

export interface TaskAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: string;
  description?: string;
  url: string;
}

export interface TaskComment {
  id: string;
  content: string;
  createdAt: Date;
  createdBy: string;
  mentions: string[];
  attachments: string[];
  isSystemGenerated: boolean;
}

export interface TaskFilter {
  cmmcDomain?: string[];
  type?: TaskType[];
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assignedTo?: string[];
  assignedBy?: string[];
  dueDateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  overdue?: boolean;
}

export interface TaskMetrics {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  tasksByStatus: Record<TaskStatus, number>;
  tasksByPriority: Record<TaskPriority, number>;
  tasksByFunction: Record<string, number>;
  tasksByAssignee: Record<string, number>;
  averageCompletionTime: number;
  upcomingDeadlines: number;
  blockedTasks: number;
  cuiRelatedTasks: number;
  sspTasks: number;
  poamTasks: number;
}

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  type: TaskType;
  nistFunction: string;
  nistCategory: string;
    cuiImpact: 'low' | 'medium' | 'high' | 'critical';
  priority: TaskPriority;
  checklist: TaskChecklistItem[];
    cmmcImpact: string[];
  cmmcControl: string;
    deliverables: string[];
    segregationOfDuties: boolean;
  tags: string[];
}

// Maintain backward compatibility
export type CMMCTask = CMMCTaskRelationship;

export interface TaskChecklistItem {
  id: string;
  title: string;
  description: string;
  required: boolean;
  completed: boolean;
  completedBy?: string;
  completedAt?: Date;
}