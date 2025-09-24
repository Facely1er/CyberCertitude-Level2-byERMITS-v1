/*
  # Create additional support tables

  1. New Tables
    - `reports` - Generated reports storage
    - `templates` - Assessment and report templates
    - `settings` - Organization and user settings
    - `integrations` - Third-party integrations

  2. Security
    - Enable RLS on all tables
    - Add appropriate access policies
*/

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  
  -- Report details
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('assessment', 'compliance', 'gap-analysis', 'executive', 'technical', 'audit', 'custom')),
  format text NOT NULL CHECK (format IN ('pdf', 'docx', 'xlsx', 'json', 'html')),
  
  -- Related entities
  assessment_id uuid REFERENCES assessments(id) ON DELETE SET NULL,
  framework text,
  
  -- Report data
  content jsonb NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  
  -- File storage
  file_path text,
  file_size bigint,
  
  -- Status
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'final', 'archived')),
  
  -- Metadata
  tags text[] DEFAULT '{}',
  generated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Timestamps
  generated_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Template details
  name text NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('assessment', 'report', 'policy', 'procedure', 'evidence-request', 'checklist')),
  category text,
  
  -- Template content
  content jsonb NOT NULL,
  schema jsonb,
  variables jsonb DEFAULT '{}'::jsonb,
  
  -- Usage
  is_public boolean DEFAULT false,
  is_default boolean DEFAULT false,
  usage_count integer DEFAULT 0,
  
  -- Metadata
  version text DEFAULT '1.0.0',
  tags text[] DEFAULT '{}',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Scope
  scope text NOT NULL CHECK (scope IN ('system', 'organization', 'user')),
  scope_id uuid, -- organization_id or user_id depending on scope
  
  -- Setting details
  category text NOT NULL,
  key text NOT NULL,
  value jsonb NOT NULL,
  
  -- Metadata
  description text,
  is_sensitive boolean DEFAULT false,
  is_public boolean DEFAULT false,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Unique constraint
  UNIQUE(scope, scope_id, category, key)
);

-- Create integrations table
CREATE TABLE IF NOT EXISTS integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  
  -- Integration details
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('sso', 'siem', 'ticketing', 'storage', 'monitoring', 'communication', 'custom')),
  provider text NOT NULL,
  
  -- Configuration
  config jsonb DEFAULT '{}'::jsonb, -- Encrypted sensitive data
  credentials jsonb, -- Encrypted API keys, tokens, etc.
  
  -- Status
  status text DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'error', 'configuring')),
  last_sync timestamptz,
  last_error text,
  
  -- Permissions
  permissions text[] DEFAULT '{}',
  
  -- Metadata
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_reports_organization_id ON reports(organization_id);
CREATE INDEX idx_reports_type ON reports(type);
CREATE INDEX idx_reports_assessment_id ON reports(assessment_id);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);

CREATE INDEX idx_templates_organization_id ON templates(organization_id);
CREATE INDEX idx_templates_type ON templates(type);
CREATE INDEX idx_templates_is_public ON templates(is_public);

CREATE INDEX idx_settings_scope ON settings(scope, scope_id);
CREATE INDEX idx_settings_category ON settings(category);

CREATE INDEX idx_integrations_organization_id ON integrations(organization_id);
CREATE INDEX idx_integrations_type ON integrations(type);
CREATE INDEX idx_integrations_status ON integrations(status);

-- Enable RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reports
CREATE POLICY "Organization members can view reports"
  ON reports FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = reports.organization_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.status = 'active'
    )
  );

CREATE POLICY "Authorized users can create reports"
  ON reports FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = reports.organization_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.role IN ('owner', 'admin', 'editor')
      AND organization_members.status = 'active'
    )
  );

-- RLS Policies for templates
CREATE POLICY "Users can view public templates or org templates"
  ON templates FOR SELECT
  TO authenticated
  USING (
    is_public = true
    OR (
      organization_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM organization_members
        WHERE organization_members.organization_id = templates.organization_id
        AND organization_members.user_id = auth.uid()
        AND organization_members.status = 'active'
      )
    )
  );

CREATE POLICY "Authorized users can manage templates"
  ON templates FOR ALL
  TO authenticated
  USING (
    created_by = auth.uid()
    OR (
      organization_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM organization_members
        WHERE organization_members.organization_id = templates.organization_id
        AND organization_members.user_id = auth.uid()
        AND organization_members.role IN ('owner', 'admin')
        AND organization_members.status = 'active'
      )
    )
  );

-- RLS Policies for settings
CREATE POLICY "Users can view their settings"
  ON settings FOR SELECT
  TO authenticated
  USING (
    (scope = 'user' AND scope_id = auth.uid())
    OR (scope = 'organization' AND EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = settings.scope_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.status = 'active'
    ))
    OR (scope = 'system' AND is_public = true)
  );

CREATE POLICY "Users can manage their own settings"
  ON settings FOR ALL
  TO authenticated
  USING (
    (scope = 'user' AND scope_id = auth.uid())
    OR (scope = 'organization' AND EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = settings.scope_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.role IN ('owner', 'admin')
      AND organization_members.status = 'active'
    ))
  );

-- RLS Policies for integrations
CREATE POLICY "Admins can manage integrations"
  ON integrations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = integrations.organization_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.role IN ('owner', 'admin')
      AND organization_members.status = 'active'
    )
  );

-- Create updated_at triggers
CREATE TRIGGER handle_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER handle_templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER handle_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER handle_integrations_updated_at
  BEFORE UPDATE ON integrations
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

-- Helpful views
CREATE OR REPLACE VIEW user_organizations AS
SELECT 
  o.*,
  om.role as user_role,
  om.joined_at as user_joined_at
FROM organizations o
JOIN organization_members om ON om.organization_id = o.id
WHERE om.status = 'active';

-- Grant access to views
GRANT SELECT ON user_organizations TO authenticated;