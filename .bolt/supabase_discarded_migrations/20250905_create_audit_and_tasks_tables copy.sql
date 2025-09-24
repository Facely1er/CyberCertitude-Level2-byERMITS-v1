-- Create audit and tasks tables migration
-- This migration creates the audit logging and task management system

-- Create audit logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL, -- Will reference assessments table when created
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  assigned_to UUID REFERENCES auth.users(id),
  due_date TIMESTAMPTZ,
  control_id TEXT,
  action_required TEXT,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create task comments table
CREATE TABLE IF NOT EXISTS public.task_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create task attachments table
CREATE TABLE IF NOT EXISTS public.task_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for audit logs
CREATE POLICY "Users can view their own audit logs" ON public.audit_logs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create RLS policies for tasks
CREATE POLICY "Users can view tasks for their assessments" ON public.tasks
  FOR SELECT USING (
    assigned_to = auth.uid() OR
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.organization_members om
      JOIN public.organizations o ON om.organization_id = o.id
      WHERE o.id = (
        SELECT organization_id FROM public.assessments WHERE id = tasks.assessment_id
      )
      AND om.user_id = auth.uid()
      AND om.is_active = true
    )
  );

CREATE POLICY "Users can manage tasks for their assessments" ON public.tasks
  FOR ALL USING (
    created_by = auth.uid() OR
    assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.organization_members om
      JOIN public.organizations o ON om.organization_id = o.id
      WHERE o.id = (
        SELECT organization_id FROM public.assessments WHERE id = tasks.assessment_id
      )
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
      AND om.is_active = true
    )
  );

-- Create RLS policies for task comments
CREATE POLICY "Users can view comments for tasks they can access" ON public.task_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tasks t
      WHERE t.id = task_comments.task_id
      AND (
        t.assigned_to = auth.uid() OR
        t.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.organization_members om
          JOIN public.organizations o ON om.organization_id = o.id
          WHERE o.id = (
            SELECT organization_id FROM public.assessments WHERE id = t.assessment_id
          )
          AND om.user_id = auth.uid()
          AND om.is_active = true
        )
      )
    )
  );

CREATE POLICY "Users can create comments for tasks they can access" ON public.task_comments
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.tasks t
      WHERE t.id = task_comments.task_id
      AND (
        t.assigned_to = auth.uid() OR
        t.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.organization_members om
          JOIN public.organizations o ON om.organization_id = o.id
          WHERE o.id = (
            SELECT organization_id FROM public.assessments WHERE id = t.assessment_id
          )
          AND om.user_id = auth.uid()
          AND om.is_active = true
        )
      )
    )
  );

-- Create RLS policies for task attachments
CREATE POLICY "Users can view attachments for tasks they can access" ON public.task_attachments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tasks t
      WHERE t.id = task_attachments.task_id
      AND (
        t.assigned_to = auth.uid() OR
        t.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.organization_members om
          JOIN public.organizations o ON om.organization_id = o.id
          WHERE o.id = (
            SELECT organization_id FROM public.assessments WHERE id = t.assessment_id
          )
          AND om.user_id = auth.uid()
          AND om.is_active = true
        )
      )
    )
  );

CREATE POLICY "Users can manage attachments for tasks they can access" ON public.task_attachments
  FOR ALL USING (
    uploaded_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.tasks t
      WHERE t.id = task_attachments.task_id
      AND (
        t.assigned_to = auth.uid() OR
        t.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.organization_members om
          JOIN public.organizations o ON om.organization_id = o.id
          WHERE o.id = (
            SELECT organization_id FROM public.assessments WHERE id = t.assessment_id
          )
          AND om.user_id = auth.uid()
          AND om.is_active = true
        )
      )
    )
  );

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Create indexes
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX idx_tasks_assessment_id ON public.tasks(assessment_id);
CREATE INDEX idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX idx_task_comments_task_id ON public.task_comments(task_id);
CREATE INDEX idx_task_attachments_task_id ON public.task_attachments(task_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- Grant permissions
GRANT ALL ON public.audit_logs TO authenticated;
GRANT ALL ON public.tasks TO authenticated;
GRANT ALL ON public.task_comments TO authenticated;
GRANT ALL ON public.task_attachments TO authenticated;
GRANT ALL ON public.notifications TO authenticated;