/*
  # Create audit logs, tasks, and supporting tables

  1. New Tables
    - `audit_logs` - System audit trail
    - `tasks` - Task management
    - `task_assignments` - Task assignment tracking
    - `compliance_calendar` - Compliance deadlines
    - `notifications` - System notifications

  2. Security
    - Enable RLS on all tables
    - Add appropriate access policies
*/

-- Create audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Actor information
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email text,
  user_name text,
  
  -- Action details
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  entity_name text,
  
  -- Change tracking
  old_values jsonb,
  new_values jsonb,
  changes jsonb,
  
  -- Context
  ip_address inet,
  user_agent text,
  session_id text,
  
  -- Classification
  severity text DEFAULT 'info' CHECK (severity IN ('debug', 'info', 'warning', 'error', 'critical')),
  category text CHECK (category IN ('authentication', 'authorization', 'data-access', 'data-modification', 'configuration', 'security', 'compliance')),
  
  -- Metadata
  metadata jsonb DEFAULT '{}'::jsonb,
  
  -- Timestamp
  created_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  
  -- Task details
  title text NOT NULL,
  description text,
  type text DEFAULT 'general' CHECK (type IN ('general', 'assessment', 'remediation', 'evidence-collection', 'review', 'audit-prep')),
  
  -- Priority and status
  priority text DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'blocked', 'completed', 'cancelled')),
  
  -- Related entities
  related_entity_type text CHECK (related_entity_type IN ('assessment', 'asset', 'control', 'evidence', 'finding')),
  related_entity_id text,
  
  -- Assignment
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  team_id uuid REFERENCES teams(id) ON DELETE SET NULL,
  
  -- Timing
  due_date date,
  start_date date,
  completed_date date,
  estimated_hours numeric(5,2),
  actual_hours numeric(5,2),
  
  -- Progress tracking
  progress_percentage numeric(5,2) DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  subtasks jsonb DEFAULT '[]'::jsonb,
  
  -- Dependencies
  blocked_by uuid[] DEFAULT '{}',
  blocks uuid[] DEFAULT '{}',
  
  -- Metadata
  tags text[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create task assignments table
CREATE TABLE IF NOT EXISTS task_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Assignment details
  role text DEFAULT 'assignee' CHECK (role IN ('assignee', 'reviewer', 'approver', 'observer')),
  assigned_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Status
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'declined', 'reassigned')),
  
  -- Timestamps
  assigned_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  
  -- Prevent duplicate assignments
  UNIQUE(task_id, user_id, role)
);

-- Create compliance calendar table
CREATE TABLE IF NOT EXISTS compliance_calendar (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  
  -- Event details
  title text NOT NULL,
  description text,
  event_type text NOT NULL CHECK (event_type IN ('assessment-due', 'audit', 'certification-renewal', 'evidence-collection', 'training', 'review', 'filing-deadline')),
  
  -- Framework/compliance
  framework text,
  requirement_id text,
  
  -- Timing
  due_date date NOT NULL,
  reminder_date date,
  recurring boolean DEFAULT false,
  recurrence_pattern text CHECK (recurrence_pattern IN ('annual', 'semi-annual', 'quarterly', 'monthly', 'custom')),
  recurrence_config jsonb,
  
  -- Assignment
  assigned_to uuid[] DEFAULT '{}',
  responsible_team uuid REFERENCES teams(id) ON DELETE SET NULL,
  
  -- Status
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'in-progress', 'completed', 'overdue', 'cancelled')),
  completion_date date,
  
  -- Metadata
  priority text DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  tags text[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Notification details
  type text NOT NULL CHECK (type IN ('info', 'warning', 'error', 'success', 'task', 'deadline', 'mention')),
  title text NOT NULL,
  message text NOT NULL,
  
  -- Related entity
  related_entity_type text,
  related_entity_id text,
  action_url text,
  
  -- Status
  read boolean DEFAULT false,
  archived boolean DEFAULT false,
  
  -- Priority
  priority text DEFAULT 'normal' CHECK (priority IN ('urgent', 'high', 'normal', 'low')),
  
  -- Delivery
  delivered_via text[] DEFAULT '{in-app}',
  email_sent boolean DEFAULT false,
  
  -- Metadata
  metadata jsonb DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  read_at timestamptz,
  expires_at timestamptz DEFAULT (now() + interval '30 days')
);

-- Create indexes for performance
CREATE INDEX idx_audit_logs_organization_id ON audit_logs(organization_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_category ON audit_logs(category);

CREATE INDEX idx_tasks_organization_id ON tasks(organization_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);

CREATE INDEX idx_task_assignments_task_id ON task_assignments(task_id);
CREATE INDEX idx_task_assignments_user_id ON task_assignments(user_id);

CREATE INDEX idx_compliance_calendar_organization_id ON compliance_calendar(organization_id);
CREATE INDEX idx_compliance_calendar_due_date ON compliance_calendar(due_date);
CREATE INDEX idx_compliance_calendar_status ON compliance_calendar(status);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for audit_logs
CREATE POLICY "Organization members can view audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (
    organization_id IS NULL AND user_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = audit_logs.organization_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.status = 'active'
      AND organization_members.role IN ('owner', 'admin', 'auditor')
    )
  );

-- System can insert audit logs
CREATE POLICY "System can create audit logs"
  ON audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for tasks
CREATE POLICY "Organization members can view tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = tasks.organization_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.status = 'active'
    )
    OR assigned_to = auth.uid()
  );

CREATE POLICY "Members can create tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = tasks.organization_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.status = 'active'
    )
  );

CREATE POLICY "Task owners and assignees can update"
  ON tasks FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() 
    OR assigned_to = auth.uid()
    OR EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = tasks.organization_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.role IN ('owner', 'admin')
      AND organization_members.status = 'active'
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Create updated_at triggers
CREATE TRIGGER handle_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER handle_compliance_calendar_updated_at
  BEFORE UPDATE ON compliance_calendar
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

-- Function to automatically update task status
CREATE OR REPLACE FUNCTION update_task_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update parent task blocked status
  IF array_length(NEW.blocked_by, 1) > 0 THEN
    -- Check if any blocking tasks are not completed
    IF EXISTS (
      SELECT 1 FROM tasks 
      WHERE id = ANY(NEW.blocked_by) 
      AND status != 'completed'
    ) THEN
      NEW.status = 'blocked';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update task status
CREATE TRIGGER update_task_status_trigger
  BEFORE INSERT OR UPDATE OF blocked_by ON tasks
  FOR EACH ROW
  EXECUTE PROCEDURE update_task_status();

-- Function to create notifications
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_message text,
  p_related_type text DEFAULT NULL,
  p_related_id text DEFAULT NULL,
  p_organization_id uuid DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  v_notification_id uuid;
BEGIN
  INSERT INTO notifications (
    user_id,
    organization_id,
    type,
    title,
    message,
    related_entity_type,
    related_entity_id
  ) VALUES (
    p_user_id,
    p_organization_id,
    p_type,
    p_title,
    p_message,
    p_related_type,
    p_related_id
  ) RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;