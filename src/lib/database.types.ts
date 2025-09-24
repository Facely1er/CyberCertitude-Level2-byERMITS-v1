export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  cmmc_compliance: {
    Tables: {
      cmmc_workflow_phases: {
        Row: {
          id: string
          assessment_id: string
          phase_id: string
          phase_name: string
          status: string
          started_at: string | null
          completed_at: string | null
          assigned_roles: string[]
          phase_data: Json
          progress_percentage: number
          estimated_duration_days: number | null
          actual_duration_days: number | null
          dependencies: string[]
          deliverables: string[]
          tools_required: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          assessment_id: string
          phase_id: string
          phase_name: string
          status?: string
          started_at?: string | null
          completed_at?: string | null
          assigned_roles?: string[]
          phase_data?: Json
          progress_percentage?: number
          estimated_duration_days?: number | null
          actual_duration_days?: number | null
          dependencies?: string[]
          deliverables?: string[]
          tools_required?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          assessment_id?: string
          phase_id?: string
          phase_name?: string
          status?: string
          started_at?: string | null
          completed_at?: string | null
          assigned_roles?: string[]
          phase_data?: Json
          progress_percentage?: number
          estimated_duration_days?: number | null
          actual_duration_days?: number | null
          dependencies?: string[]
          deliverables?: string[]
          tools_required?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      cmmc_workflow_steps: {
        Row: {
          id: string
          workflow_phase_id: string
          step_id: string
          step_name: string
          description: string | null
          status: string
          priority: string
          estimated_time_hours: number | null
          actual_time_hours: number | null
          started_at: string | null
          completed_at: string | null
          assigned_to: string | null
          dependencies: string[]
          deliverables: string[]
          tools_required: string[]
          step_data: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workflow_phase_id: string
          step_id: string
          step_name: string
          description?: string | null
          status?: string
          priority?: string
          estimated_time_hours?: number | null
          actual_time_hours?: number | null
          started_at?: string | null
          completed_at?: string | null
          assigned_to?: string | null
          dependencies?: string[]
          deliverables?: string[]
          tools_required?: string[]
          step_data?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workflow_phase_id?: string
          step_id?: string
          step_name?: string
          description?: string | null
          status?: string
          priority?: string
          estimated_time_hours?: number | null
          actual_time_hours?: number | null
          started_at?: string | null
          completed_at?: string | null
          assigned_to?: string | null
          dependencies?: string[]
          deliverables?: string[]
          tools_required?: string[]
          step_data?: Json
          created_at?: string
          updated_at?: string
        }
      }
      cmmc_workflow_templates: {
        Row: {
          id: string
          template_name: string
          template_description: string | null
          framework_id: string
          framework_name: string
          phases: Json
          default_roles: string[]
          estimated_duration_days: number | null
          is_active: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          template_name: string
          template_description?: string | null
          framework_id: string
          framework_name: string
          phases?: Json
          default_roles?: string[]
          estimated_duration_days?: number | null
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          template_name?: string
          template_description?: string | null
          framework_id?: string
          framework_name?: string
          phases?: Json
          default_roles?: string[]
          estimated_duration_days?: number | null
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cmmc_workflow_progress: {
        Row: {
          id: string
          assessment_id: string
          overall_progress: number
          phase_progress: Json
          last_activity_at: string
          milestones_completed: number
          total_milestones: number
          risk_factors: string[]
          blockers: string[]
          next_actions: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          assessment_id: string
          overall_progress?: number
          phase_progress?: Json
          last_activity_at?: string
          milestones_completed?: number
          total_milestones?: number
          risk_factors?: string[]
          blockers?: string[]
          next_actions?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          assessment_id?: string
          overall_progress?: number
          phase_progress?: Json
          last_activity_at?: string
          milestones_completed?: number
          total_milestones?: number
          risk_factors?: string[]
          blockers?: string[]
          next_actions?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      cmmc_workflow_notifications: {
        Row: {
          id: string
          assessment_id: string
          workflow_phase_id: string | null
          notification_type: string
          title: string
          message: string
          priority: string
          is_read: boolean
          assigned_to: string | null
          due_date: string | null
          action_required: string | null
          notification_data: Json
          created_at: string
          read_at: string | null
        }
        Insert: {
          id?: string
          assessment_id: string
          workflow_phase_id?: string | null
          notification_type: string
          title: string
          message: string
          priority?: string
          is_read?: boolean
          assigned_to?: string | null
          due_date?: string | null
          action_required?: string | null
          notification_data?: Json
          created_at?: string
          read_at?: string | null
        }
        Update: {
          id?: string
          assessment_id?: string
          workflow_phase_id?: string | null
          notification_type?: string
          title?: string
          message?: string
          priority?: string
          is_read?: boolean
          assigned_to?: string | null
          due_date?: string | null
          action_required?: string | null
          notification_data?: Json
          created_at?: string
          read_at?: string | null
        }
      }
      cmmc_profiles: {
        Row: {
          id: string
          email: string
          name: string
          organization: string
          role: string
          industry: string
          certifications: string[]
          preferences: Json
          avatar: string | null
          timezone: string | null
          phone_number: string | null
          department: string | null
          manager: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string
          organization?: string
          role?: string
          industry?: string
          certifications?: string[]
          preferences?: Json
          avatar?: string | null
          timezone?: string | null
          phone_number?: string | null
          department?: string | null
          manager?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          organization?: string
          role?: string
          industry?: string
          certifications?: string[]
          preferences?: Json
          avatar?: string | null
          timezone?: string | null
          phone_number?: string | null
          department?: string | null
          manager?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cmmc_assessments: {
        Row: {
          id: string
          user_id: string
          framework_id: string
          framework_name: string
          responses: Json
          organization_info: Json
          is_complete: boolean
          version: string
          template_id: string | null
          tags: string[]
          notes: string
          reviewers: string[]
          approval_status: string
          bookmarks: string[]
          time_spent: number
          question_notes: Json
          question_evidence: Json
          evidence_library: Json
          risk_rating: string | null
          business_impact: string | null
          compliance_requirements: string[]
          assessment_version: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          framework_id: string
          framework_name: string
          responses?: Json
          organization_info?: Json
          is_complete?: boolean
          version?: string
          template_id?: string | null
          tags?: string[]
          notes?: string
          reviewers?: string[]
          approval_status?: string
          bookmarks?: string[]
          time_spent?: number
          question_notes?: Json
          question_evidence?: Json
          evidence_library?: Json
          risk_rating?: string | null
          business_impact?: string | null
          compliance_requirements?: string[]
          assessment_version?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          framework_id?: string
          framework_name?: string
          responses?: Json
          organization_info?: Json
          is_complete?: boolean
          version?: string
          template_id?: string | null
          tags?: string[]
          notes?: string
          reviewers?: string[]
          approval_status?: string
          bookmarks?: string[]
          time_spent?: number
          question_notes?: Json
          question_evidence?: Json
          evidence_library?: Json
          risk_rating?: string | null
          business_impact?: string | null
          compliance_requirements?: string[]
          assessment_version?: string
          created_at?: string
          updated_at?: string
        }
      }
      cmmc_assessment_versions: {
        Row: {
          id: string
          assessment_id: string
          version_number: string
          version_type: string
          description: string
          changes: Json
          responses_snapshot: Json
          metadata: Json
          tags: string[]
          is_baseline: boolean
          approval_status: string
          approved_by: string | null
          approved_at: string | null
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          assessment_id: string
          version_number: string
          version_type?: string
          description: string
          changes?: Json
          responses_snapshot?: Json
          metadata?: Json
          tags?: string[]
          is_baseline?: boolean
          approval_status?: string
          approved_by?: string | null
          approved_at?: string | null
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          assessment_id?: string
          version_number?: string
          version_type?: string
          description?: string
          changes?: Json
          responses_snapshot?: Json
          metadata?: Json
          tags?: string[]
          is_baseline?: boolean
          approval_status?: string
          approved_by?: string | null
          approved_at?: string | null
          created_by?: string
          created_at?: string
        }
      }
      cmmc_organizations: {
        Row: {
          id: string
          name: string
          domain: string | null
          industry: string | null
          size_category: string | null
          compliance_framework: string[]
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          domain?: string | null
          industry?: string | null
          size_category?: string | null
          compliance_framework?: string[]
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          domain?: string | null
          industry?: string | null
          size_category?: string | null
          compliance_framework?: string[]
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      cmmc_evidence: {
        Row: {
          id: string
          assessment_id: string
          file_name: string
          file_path: string
          file_url: string
          file_size: number
          file_type: string
          status: string
          uploaded_by: string
          control_id: string | null
          description: string | null
          tags: string[]
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          assessment_id: string
          file_name: string
          file_path: string
          file_url: string
          file_size: number
          file_type: string
          status?: string
          uploaded_by: string
          control_id?: string | null
          description?: string | null
          tags?: string[]
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          assessment_id?: string
          file_name?: string
          file_path?: string
          file_url?: string
          file_size?: number
          file_type?: string
          status?: string
          uploaded_by?: string
          control_id?: string | null
          description?: string | null
          tags?: string[]
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      cmmc_tasks: {
        Row: {
          id: string
          assessment_id: string
          title: string
          description: string | null
          status: string
          priority: string
          assigned_to: string | null
          due_date: string | null
          control_id: string | null
          action_required: string | null
          workflow_phase_id: string | null
          workflow_step_id: string | null
          task_category: string | null
          phase_id: string | null
          workflow_metadata: Json
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          assessment_id: string
          title: string
          description?: string | null
          status?: string
          priority?: string
          assigned_to?: string | null
          due_date?: string | null
          control_id?: string | null
          action_required?: string | null
          workflow_phase_id?: string | null
          workflow_step_id?: string | null
          task_category?: string | null
          phase_id?: string | null
          workflow_metadata?: Json
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          assessment_id?: string
          title?: string
          description?: string | null
          status?: string
          priority?: string
          assigned_to?: string | null
          due_date?: string | null
          control_id?: string | null
          action_required?: string | null
          workflow_phase_id?: string | null
          workflow_step_id?: string | null
          task_category?: string | null
          phase_id?: string | null
          workflow_metadata?: Json
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      cmmc_audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          resource_type: string
          resource_id: string
          details: Json
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          resource_type: string
          resource_id: string
          details?: Json
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          resource_type?: string
          resource_id?: string
          details?: Json
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      cmmc_alerts: {
        Row: {
          id: string
          type: string
          severity: string
          title: string
          description: string | null
          affected_items: string[]
          action_required: string | null
          due_date: string | null
          assigned_to: string | null
          acknowledged: boolean
          acknowledged_by: string | null
          acknowledged_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: string
          severity: string
          title: string
          description?: string | null
          affected_items?: string[]
          action_required?: string | null
          due_date?: string | null
          assigned_to?: string | null
          acknowledged?: boolean
          acknowledged_by?: string | null
          acknowledged_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: string
          severity?: string
          title?: string
          description?: string | null
          affected_items?: string[]
          action_required?: string | null
          due_date?: string | null
          assigned_to?: string | null
          acknowledged?: boolean
          acknowledged_by?: string | null
          acknowledged_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      user_profiles_with_org: {
        Row: {
          id: string
          user_id: string | null
          email: string
          name: string | null
          organization: string | null
          role: string
          industry: string | null
          certifications: string[]
          preferences: Json
          avatar: string | null
          timezone: string | null
          phone_number: string | null
          department: string | null
          manager: string | null
          created_at: string
          updated_at: string
          organization_name: string | null
          organization_industry: string | null
          organization_size: string | null
        }
      }
      workflow_analytics: {
        Row: {
          assessment_id: string
          framework_name: string
          phase_id: string | null
          phase_name: string | null
          phase_status: string | null
          progress_percentage: number | null
          started_at: string | null
          completed_at: string | null
          estimated_duration_days: number | null
          actual_duration_days: number | null
          total_steps: number
          completed_steps: number
          in_progress_steps: number
          blocked_steps: number
        }
      }
      task_workflow_view: {
        Row: {
          task_id: string
          title: string
          description: string | null
          task_status: string
          priority: string
          assigned_to: string | null
          due_date: string | null
          phase_id: string | null
          task_category: string | null
          phase_name: string | null
          phase_status: string | null
          step_name: string | null
          step_status: string | null
          framework_name: string
          user_id: string
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}