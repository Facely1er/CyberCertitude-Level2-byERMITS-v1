-- CMMC Level 1 Compliance Platform - Isolated Schema Setup
-- This migration creates a Level 1 specific schema to prevent conflicts with Level 2 projects
-- Focus: 17 practices across 6 domains for Federal Contract Information (FCI) protection

-- Create a distinctive schema for the CMMC Level 1 platform
CREATE SCHEMA IF NOT EXISTS cmmc_level1;

-- Set search path to include our Level 1 schema
SET search_path TO cmmc_level1, public;

-- Create custom types for the CMMC Level 1 platform
CREATE TYPE cmmc_level1.user_role AS ENUM (
  'compliance_officer',
  'security_manager', 
  'assessor',
  'reviewer',
  'admin'
);

CREATE TYPE cmmc_level1.assessment_status AS ENUM (
  'draft',
  'in_progress',
  'under_review',
  'approved',
  'rejected',
  'archived'
);

CREATE TYPE cmmc_level1.evidence_status AS ENUM (
  'uploaded',
  'under_review',
  'approved',
  'rejected',
  'archived'
);

CREATE TYPE cmmc_level1.task_status AS ENUM (
  'pending',
  'in_progress',
  'completed',
  'overdue',
  'cancelled'
);

CREATE TYPE cmmc_level1.level1_domain AS ENUM (
  'access_control',
  'identification_authentication',
  'media_protection',
  'physical_protection',
  'system_communications_protection',
  'system_information_integrity'
);

CREATE TYPE cmmc_level1.practice_status AS ENUM (
  'not_implemented',
  'partially_implemented',
  'fully_implemented',
  'needs_review'
);

-- Create Level 1 specific tables with distinctive naming
CREATE TABLE cmmc_level1.level1_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  organization TEXT,
  role cmmc_level1.user_role DEFAULT 'assessor',
  industry TEXT,
  fci_handling BOOLEAN DEFAULT false,
  organization_size TEXT,
  certifications TEXT[] DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  avatar TEXT,
  timezone TEXT DEFAULT 'UTC',
  phone_number TEXT,
  department TEXT,
  manager TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cmmc_level1.level1_organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT UNIQUE,
  industry TEXT,
  size_category TEXT,
  fci_handling BOOLEAN DEFAULT false,
  dod_contractor BOOLEAN DEFAULT false,
  compliance_framework TEXT[] DEFAULT '{"CMMC Level 1"}',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cmmc_level1.level1_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES cmmc_level1.level1_organizations(id) ON DELETE CASCADE,
  framework_id TEXT NOT NULL DEFAULT 'cmmc-level1',
  framework_name TEXT NOT NULL DEFAULT 'CMMC Level 1 - Basic Cyber Hygiene',
  responses JSONB DEFAULT '{}',
  organization_info JSONB DEFAULT '{}',
  is_complete BOOLEAN DEFAULT FALSE,
  version TEXT DEFAULT '1.0.0',
  template_id TEXT,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  reviewers TEXT[] DEFAULT '{}',
  approval_status cmmc_level1.assessment_status DEFAULT 'draft',
  bookmarks TEXT[] DEFAULT '{}',
  time_spent INTEGER DEFAULT 0,
  question_notes JSONB DEFAULT '{}',
  question_evidence JSONB DEFAULT '{}',
  evidence_library JSONB DEFAULT '{}',
  risk_rating TEXT,
  business_impact TEXT,
  compliance_requirements TEXT[] DEFAULT '{"FCI Protection"}',
  assessment_version TEXT DEFAULT '1.0.0',
  fci_classification TEXT,
  self_assessment_ready BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cmmc_level1.level1_practices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES cmmc_level1.level1_assessments(id) ON DELETE CASCADE,
  practice_id TEXT NOT NULL,
  practice_name TEXT NOT NULL,
  domain cmmc_level1.level1_domain NOT NULL,
  status cmmc_level1.practice_status DEFAULT 'not_implemented',
  implementation_notes TEXT,
  evidence_required TEXT[] DEFAULT '{}',
  evidence_provided TEXT[] DEFAULT '{}',
  implementation_date DATE,
  review_date DATE,
  next_review_date DATE,
  assigned_to UUID REFERENCES auth.users(id),
  priority TEXT DEFAULT 'medium',
  estimated_effort_hours INTEGER,
  actual_effort_hours INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(assessment_id, practice_id)
);

CREATE TABLE cmmc_level1.level1_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES cmmc_level1.level1_assessments(id) ON DELETE CASCADE,
  practice_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  status cmmc_level1.evidence_status DEFAULT 'uploaded',
  uploaded_by UUID REFERENCES auth.users(id) NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  fci_classification TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cmmc_level1.level1_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES cmmc_level1.level1_assessments(id) ON DELETE CASCADE,
  practice_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  status cmmc_level1.task_status DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  assigned_to UUID REFERENCES auth.users(id),
  due_date TIMESTAMPTZ,
  action_required TEXT,
  fci_related BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cmmc_level1.level1_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  fci_access BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cmmc_level1.level1_domain_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES cmmc_level1.level1_assessments(id) ON DELETE CASCADE,
  domain cmmc_level1.level1_domain NOT NULL,
  total_practices INTEGER NOT NULL,
  implemented_practices INTEGER DEFAULT 0,
  score_percentage INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(assessment_id, domain)
);

-- Create indexes for better performance
CREATE INDEX idx_level1_profiles_user_id ON cmmc_level1.level1_profiles(user_id);
CREATE INDEX idx_level1_profiles_email ON cmmc_level1.level1_profiles(email);
CREATE INDEX idx_level1_profiles_fci_handling ON cmmc_level1.level1_profiles(fci_handling);
CREATE INDEX idx_level1_assessments_user_id ON cmmc_level1.level1_assessments(user_id);
CREATE INDEX idx_level1_assessments_org_id ON cmmc_level1.level1_assessments(organization_id);
CREATE INDEX idx_level1_assessments_framework ON cmmc_level1.level1_assessments(framework_id);
CREATE INDEX idx_level1_practices_assessment_id ON cmmc_level1.level1_practices(assessment_id);
CREATE INDEX idx_level1_practices_domain ON cmmc_level1.level1_practices(domain);
CREATE INDEX idx_level1_practices_status ON cmmc_level1.level1_practices(status);
CREATE INDEX idx_level1_evidence_assessment_id ON cmmc_level1.level1_evidence(assessment_id);
CREATE INDEX idx_level1_evidence_practice_id ON cmmc_level1.level1_evidence(practice_id);
CREATE INDEX idx_level1_tasks_assessment_id ON cmmc_level1.level1_tasks(assessment_id);
CREATE INDEX idx_level1_tasks_assigned_to ON cmmc_level1.level1_tasks(assigned_to);
CREATE INDEX idx_level1_audit_logs_user_id ON cmmc_level1.level1_audit_logs(user_id);
CREATE INDEX idx_level1_audit_logs_fci_access ON cmmc_level1.level1_audit_logs(fci_access);
CREATE INDEX idx_level1_domain_scores_assessment_id ON cmmc_level1.level1_domain_scores(assessment_id);

-- Enable Row Level Security on all tables
ALTER TABLE cmmc_level1.level1_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cmmc_level1.level1_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cmmc_level1.level1_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cmmc_level1.level1_practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE cmmc_level1.level1_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE cmmc_level1.level1_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE cmmc_level1.level1_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cmmc_level1.level1_domain_scores ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for Level 1 project isolation
-- Profiles: Users can only see their own profile
CREATE POLICY "Users can view own Level 1 profile" ON cmmc_level1.level1_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own Level 1 profile" ON cmmc_level1.level1_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own Level 1 profile" ON cmmc_level1.level1_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Organizations: Users can only see organizations they belong to
CREATE POLICY "Users can view own Level 1 organization" ON cmmc_level1.level1_organizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM cmmc_level1.level1_profiles 
      WHERE user_id = auth.uid() AND organization = name
    )
  );

-- Assessments: Users can only see their own Level 1 assessments
CREATE POLICY "Users can view own Level 1 assessments" ON cmmc_level1.level1_assessments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own Level 1 assessments" ON cmmc_level1.level1_assessments
  FOR ALL USING (auth.uid() = user_id);

-- Practices: Users can only see practices for their own assessments
CREATE POLICY "Users can view own Level 1 practices" ON cmmc_level1.level1_practices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM cmmc_level1.level1_assessments 
      WHERE id = assessment_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own Level 1 practices" ON cmmc_level1.level1_practices
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM cmmc_level1.level1_assessments 
      WHERE id = assessment_id AND user_id = auth.uid()
    )
  );

-- Evidence: Users can only see evidence for their own assessments
CREATE POLICY "Users can view own Level 1 evidence" ON cmmc_level1.level1_evidence
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM cmmc_level1.level1_assessments 
      WHERE id = assessment_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own Level 1 evidence" ON cmmc_level1.level1_evidence
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM cmmc_level1.level1_assessments 
      WHERE id = assessment_id AND user_id = auth.uid()
    )
  );

-- Tasks: Users can only see tasks for their own assessments
CREATE POLICY "Users can view own Level 1 tasks" ON cmmc_level1.level1_tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM cmmc_level1.level1_assessments 
      WHERE id = assessment_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own Level 1 tasks" ON cmmc_level1.level1_tasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM cmmc_level1.level1_assessments 
      WHERE id = assessment_id AND user_id = auth.uid()
    )
  );

-- Audit Logs: Users can only see their own audit logs
CREATE POLICY "Users can view own Level 1 audit logs" ON cmmc_level1.level1_audit_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own Level 1 audit logs" ON cmmc_level1.level1_audit_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Domain Scores: Users can only see scores for their own assessments
CREATE POLICY "Users can view own Level 1 domain scores" ON cmmc_level1.level1_domain_scores
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM cmmc_level1.level1_assessments 
      WHERE id = assessment_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own Level 1 domain scores" ON cmmc_level1.level1_domain_scores
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM cmmc_level1.level1_assessments 
      WHERE id = assessment_id AND user_id = auth.uid()
    )
  );

-- Create storage bucket for Level 1 evidence files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cmmc-level1-evidence',
  'cmmc-level1-evidence',
  false,
  52428800, -- 50MB limit
  ARRAY['image/*', 'application/pdf', 'text/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Create storage policies for Level 1 evidence bucket
CREATE POLICY "Users can upload Level 1 evidence" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'cmmc-level1-evidence' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own Level 1 evidence" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'cmmc-level1-evidence' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own Level 1 evidence" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'cmmc-level1-evidence' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own Level 1 evidence" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'cmmc-level1-evidence' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION cmmc_level1.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_level1_profiles_updated_at
  BEFORE UPDATE ON cmmc_level1.level1_profiles
  FOR EACH ROW EXECUTE FUNCTION cmmc_level1.update_updated_at_column();

CREATE TRIGGER update_level1_organizations_updated_at
  BEFORE UPDATE ON cmmc_level1.level1_organizations
  FOR EACH ROW EXECUTE FUNCTION cmmc_level1.update_updated_at_column();

CREATE TRIGGER update_level1_assessments_updated_at
  BEFORE UPDATE ON cmmc_level1.level1_assessments
  FOR EACH ROW EXECUTE FUNCTION cmmc_level1.update_updated_at_column();

CREATE TRIGGER update_level1_practices_updated_at
  BEFORE UPDATE ON cmmc_level1.level1_practices
  FOR EACH ROW EXECUTE FUNCTION cmmc_level1.update_updated_at_column();

CREATE TRIGGER update_level1_evidence_updated_at
  BEFORE UPDATE ON cmmc_level1.level1_evidence
  FOR EACH ROW EXECUTE FUNCTION cmmc_level1.update_updated_at_column();

CREATE TRIGGER update_level1_tasks_updated_at
  BEFORE UPDATE ON cmmc_level1.level1_tasks
  FOR EACH ROW EXECUTE FUNCTION cmmc_level1.update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA cmmc_level1 TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA cmmc_level1 TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA cmmc_level1 TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA cmmc_level1 TO authenticated;

-- Create views for Level 1 analytics
CREATE VIEW cmmc_level1.level1_compliance_summary AS
SELECT 
  a.id as assessment_id,
  a.framework_name,
  a.fci_classification,
  a.self_assessment_ready,
  COUNT(p.id) as total_practices,
  COUNT(CASE WHEN p.status = 'fully_implemented' THEN 1 END) as implemented_practices,
  COUNT(CASE WHEN p.status = 'partially_implemented' THEN 1 END) as partially_implemented_practices,
  COUNT(CASE WHEN p.status = 'not_implemented' THEN 1 END) as not_implemented_practices,
  COUNT(CASE WHEN p.status = 'needs_review' THEN 1 END) as needs_review_practices,
  ROUND(
    (COUNT(CASE WHEN p.status = 'fully_implemented' THEN 1 END)::decimal / COUNT(p.id)) * 100, 
    2
  ) as compliance_percentage,
  a.created_at,
  a.updated_at
FROM cmmc_level1.level1_assessments a
LEFT JOIN cmmc_level1.level1_practices p ON a.id = p.assessment_id
GROUP BY a.id, a.framework_name, a.fci_classification, a.self_assessment_ready, a.created_at, a.updated_at;

CREATE VIEW cmmc_level1.level1_domain_progress AS
SELECT 
  a.id as assessment_id,
  ds.domain,
  ds.total_practices,
  ds.implemented_practices,
  ds.score_percentage,
  ds.last_updated,
  COUNT(p.id) as practices_in_domain,
  COUNT(CASE WHEN p.status = 'fully_implemented' THEN 1 END) as implemented_in_domain
FROM cmmc_level1.level1_assessments a
LEFT JOIN cmmc_level1.level1_domain_scores ds ON a.id = ds.assessment_id
LEFT JOIN cmmc_level1.level1_practices p ON a.id = p.assessment_id AND ds.domain = p.domain
GROUP BY a.id, ds.domain, ds.total_practices, ds.implemented_practices, ds.score_percentage, ds.last_updated;

-- Grant access to views
GRANT SELECT ON cmmc_level1.level1_compliance_summary TO authenticated;
GRANT SELECT ON cmmc_level1.level1_domain_progress TO authenticated;

-- Insert default Level 1 practices data
INSERT INTO cmmc_level1.level1_practices (practice_id, practice_name, domain, estimated_effort_hours) VALUES
-- Access Control Domain (3 practices)
('ac.l1-3.1.1', 'Limit system access to authorized users, processes acting on behalf of authorized users, and devices', 'access_control', 8),
('ac.l1-3.1.3', 'Control the flow of CUI in accordance with approved authorizations', 'access_control', 6),
('ac.l1-3.1.4', 'Separate the duties of individuals to reduce the risk of malevolent activity without collusion', 'access_control', 4),

-- Identification & Authentication Domain (2 practices)
('ia.l1-3.5.1', 'Identify information system users, processes acting on behalf of users, and devices', 'identification_authentication', 6),
('ia.l1-3.5.2', 'Authenticate (or verify) the identities of users, processes, or devices before allowing access', 'identification_authentication', 8),

-- Media Protection Domain (1 practice)
('mp.l1-3.8.3', 'Protect system media containing CUI, both paper and digital', 'media_protection', 4),

-- Physical Protection Domain (2 practices)
('pe.l1-3.10.1', 'Limit physical access to organizational information systems, equipment, and operating environments', 'physical_protection', 6),
('pe.l1-3.10.2', 'Escort visitors and monitor visitor activity', 'physical_protection', 4),

-- System & Communications Protection Domain (2 practices)
('sc.l1-3.13.1', 'Monitor, control, and protect organizational communications at external and key internal boundaries', 'system_communications_protection', 8),
('sc.l1-3.13.8', 'Implement subnetworks for publicly accessible system components', 'system_communications_protection', 6),

-- System & Information Integrity Domain (7 practices)
('si.l1-3.14.1', 'Identify, report, and correct information and information system flaws in a timely manner', 'system_information_integrity', 4),
('si.l1-3.14.2', 'Provide protection from malicious code at appropriate locations', 'system_information_integrity', 6),
('si.l1-3.14.3', 'Monitor information system security alerts and advisories', 'system_information_integrity', 4),
('si.l1-3.14.4', 'Update malicious code protection mechanisms when new releases are available', 'system_information_integrity', 4),
('si.l1-3.14.5', 'Perform periodic scans of the information system and real-time scans of files', 'system_information_integrity', 6),
('si.l1-3.14.6', 'Monitor the information system including inbound and outbound communications traffic', 'system_information_integrity', 8),
('si.l1-3.14.7', 'Implement a policy and procedures to address information system vulnerabilities', 'system_information_integrity', 6);

-- Add comment to identify this as CMMC Level 1 Compliance Platform schema
COMMENT ON SCHEMA cmmc_level1 IS 'CMMC Level 1 Compliance Platform - Isolated schema for 17 practices across 6 domains focusing on FCI protection';