export type WorkflowPhase = 'assessment' | 'implementation' | 'validation' | 'preparation' | 'certification';
export type WorkflowStatus = 'not_started' | 'in_progress' | 'completed' | 'blocked' | 'cancelled';
export type TaskCategory = 'policy_development' | 'technical_controls' | 'training' | 'incident_response' | 'evidence_collection' | 'assessment_prep' | 'documentation' | 'testing' | 'remediation';

export interface WorkflowPhaseData {
  id: string;
  assessment_id: string;
  phase_id: WorkflowPhase;
  phase_name: string;
  status: WorkflowStatus;
  started_at?: Date;
  completed_at?: Date;
  assigned_roles: string[];
  phase_data: Record<string, any>;
  progress_percentage: number;
  estimated_duration_days?: number;
  actual_duration_days?: number;
  dependencies: string[];
  deliverables: string[];
  tools_required: string[];
  created_at: Date;
  updated_at: Date;
}

export interface WorkflowStepData {
  id: string;
  workflow_phase_id: string;
  step_id: string;
  step_name: string;
  description?: string;
  status: WorkflowStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimated_time_hours?: number;
  actual_time_hours?: number;
  started_at?: Date;
  completed_at?: Date;
  assigned_to?: string;
  dependencies: string[];
  deliverables: string[];
  tools_required: string[];
  step_data: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface WorkflowTemplate {
  id: string;
  template_name: string;
  template_description?: string;
  framework_id: string;
  framework_name: string;
  phases: WorkflowPhaseTemplate[];
  default_roles: string[];
  estimated_duration_days?: number;
  is_active: boolean;
  created_by?: string;
  created_at: Date;
  updated_at: Date;
}

export interface WorkflowPhaseTemplate {
  phase_id: WorkflowPhase;
  phase_name: string;
  estimated_duration_days: number;
  steps: WorkflowStepTemplate[];
}

export interface WorkflowStepTemplate {
  step_id: string;
  step_name: string;
  estimated_time_hours: number;
  dependencies?: string[];
  deliverables?: string[];
  tools_required?: string[];
}

export interface WorkflowProgress {
  id: string;
  assessment_id: string;
  overall_progress: number;
  phase_progress: Record<string, number>;
  last_activity_at: Date;
  milestones_completed: number;
  total_milestones: number;
  risk_factors: string[];
  blockers: string[];
  next_actions: string[];
  created_at: Date;
  updated_at: Date;
}

export interface WorkflowNotification {
  id: string;
  assessment_id: string;
  workflow_phase_id?: string;
  notification_type: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  is_read: boolean;
  assigned_to?: string;
  due_date?: Date;
  action_required?: string;
  notification_data: Record<string, any>;
  created_at: Date;
  read_at?: Date;
}

export interface WorkflowAnalytics {
  assessment_id: string;
  framework_name: string;
  phase_id?: WorkflowPhase;
  phase_name?: string;
  phase_status?: WorkflowStatus;
  progress_percentage?: number;
  started_at?: Date;
  completed_at?: Date;
  estimated_duration_days?: number;
  actual_duration_days?: number;
  total_steps: number;
  completed_steps: number;
  in_progress_steps: number;
  blocked_steps: number;
}

export interface TaskWorkflowView {
  task_id: string;
  title: string;
  description?: string;
  task_status: string;
  priority: string;
  assigned_to?: string;
  due_date?: Date;
  phase_id?: WorkflowPhase;
  task_category?: TaskCategory;
  phase_name?: string;
  phase_status?: WorkflowStatus;
  step_name?: string;
  step_status?: WorkflowStatus;
  framework_name: string;
  user_id: string;
}

export interface WorkflowPhaseUpdate {
  phase_id: WorkflowPhase;
  status: WorkflowStatus;
  progress_percentage?: number;
  started_at?: Date;
  completed_at?: Date;
  assigned_roles?: string[];
  phase_data?: Record<string, any>;
}

export interface WorkflowStepUpdate {
  step_id: string;
  status: WorkflowStatus;
  started_at?: Date;
  completed_at?: Date;
  assigned_to?: string;
  actual_time_hours?: number;
  step_data?: Record<string, any>;
}

export interface WorkflowCreationRequest {
  assessment_id: string;
  template_id?: string;
  custom_phases?: WorkflowPhaseTemplate[];
  assigned_roles?: string[];
}

export interface WorkflowProgressUpdate {
  overall_progress?: number;
  phase_progress?: Record<string, number>;
  milestones_completed?: number;
  risk_factors?: string[];
  blockers?: string[];
  next_actions?: string[];
}