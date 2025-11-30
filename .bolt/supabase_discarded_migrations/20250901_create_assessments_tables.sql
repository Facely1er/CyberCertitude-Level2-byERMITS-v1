/*
  # Create assessments and related tables

  1. New Tables
    - `assessments` - Main assessment data
    - `assessment_versions` - Version history tracking
    - `assessment_sessions` - Auto-save session data
    - `workflow_phase_tracking` - Workflow progress tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for user access control
*/

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  framework_id text NOT NULL,
  framework_name text NOT NULL,
  framework_version text DEFAULT '1.0.0',
  assessment_version text DEFAULT '1.0.0',
  
  -- Status and metadata
  status text NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'archived')),
  completion_percentage numeric(5,2) DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  maturity_level integer DEFAULT 0,
  score numeric(5,2) DEFAULT 0,
  
  -- Organization info
  organization_info jsonb DEFAULT '{}'::jsonb,
  
  -- Response data
  responses jsonb DEFAULT '{}'::jsonb,
  scores jsonb DEFAULT '{}'::jsonb,
  comments jsonb DEFAULT '{}'::jsonb,
  notes jsonb DEFAULT '{}'::jsonb,
  
  -- Evidence tracking
  question_evidence jsonb DEFAULT '{}'::jsonb,
  evidence_library jsonb DEFAULT '[]'::jsonb,
  
  -- Control tracking
  reviewed_controls text[] DEFAULT '{}',
  flagged_questions text[] DEFAULT '{}',
  
  -- Timestamps
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  last_modified timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create assessment versions table
CREATE TABLE IF NOT EXISTS assessment_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid REFERENCES assessments(id) ON DELETE CASCADE NOT NULL,
  version_number text NOT NULL,
  
  -- Snapshot of assessment state
  responses jsonb NOT NULL,
  scores jsonb NOT NULL,
  comments jsonb DEFAULT '{}'::jsonb,
  notes jsonb DEFAULT '{}'::jsonb,
  question_evidence jsonb DEFAULT '{}'::jsonb,
  
  -- Version metadata
  change_summary text,
  changed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  
  -- Ensure unique version per assessment
  UNIQUE(assessment_id, version_number)
);

-- Create assessment sessions table for auto-save
CREATE TABLE IF NOT EXISTS assessment_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  assessment_id uuid REFERENCES assessments(id) ON DELETE CASCADE,
  
  -- Session data
  assessment_data jsonb NOT NULL,
  session_metadata jsonb DEFAULT '{}'::jsonb,
  
  -- Timestamps
  last_saved timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- One active session per user
  UNIQUE(user_id, assessment_id)
);

-- Create workflow phase tracking
CREATE TABLE IF NOT EXISTS workflow_phase_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  assessment_id uuid REFERENCES assessments(id) ON DELETE CASCADE,
  
  -- Phase tracking
  current_phase text NOT NULL,
  phase_progress jsonb DEFAULT '{}'::jsonb,
  completed_phases text[] DEFAULT '{}',
  
  -- Timestamps
  phase_started_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- One workflow per assessment
  UNIQUE(user_id, assessment_id)
);

-- Create indexes for performance
CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_organization_id ON assessments(organization_id);
CREATE INDEX idx_assessments_framework_id ON assessments(framework_id);
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_assessments_created_at ON assessments(created_at DESC);

CREATE INDEX idx_assessment_versions_assessment_id ON assessment_versions(assessment_id);
CREATE INDEX idx_assessment_versions_created_at ON assessment_versions(created_at DESC);

CREATE INDEX idx_assessment_sessions_user_id ON assessment_sessions(user_id);
CREATE INDEX idx_assessment_sessions_assessment_id ON assessment_sessions(assessment_id);

-- Enable RLS
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_phase_tracking ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for assessments
CREATE POLICY "Users can view own assessments"
  ON assessments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own assessments"
  ON assessments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assessments"
  ON assessments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own assessments"
  ON assessments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for assessment_versions
CREATE POLICY "Users can view versions of own assessments"
  ON assessment_versions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM assessments 
      WHERE assessments.id = assessment_versions.assessment_id 
      AND assessments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create versions of own assessments"
  ON assessment_versions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM assessments 
      WHERE assessments.id = assessment_versions.assessment_id 
      AND assessments.user_id = auth.uid()
    )
  );

-- Create RLS policies for assessment_sessions
CREATE POLICY "Users can manage own sessions"
  ON assessment_sessions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for workflow_phase_tracking
CREATE POLICY "Users can manage own workflow tracking"
  ON workflow_phase_tracking FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at triggers
CREATE TRIGGER handle_assessments_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER handle_assessment_sessions_updated_at
  BEFORE UPDATE ON assessment_sessions
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER handle_workflow_phase_tracking_updated_at
  BEFORE UPDATE ON workflow_phase_tracking
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();