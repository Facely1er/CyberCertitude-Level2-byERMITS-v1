-- =============================================================================
-- CMMC 2.0 Level 2 Compliance Platform - Initial Schema Migration
-- Multi-Project Support with Differentiated Schemas
-- =============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- PROJECT MANAGEMENT SCHEMA
-- =============================================================================

-- Projects table for multi-tenancy
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    organization_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    compliance_framework VARCHAR(100) DEFAULT 'CMMC 2.0 Level 2',
    project_type VARCHAR(50) DEFAULT 'compliance',
    status VARCHAR(50) DEFAULT 'active',
    settings JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Project members with role-based access
CREATE TABLE IF NOT EXISTS project_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'member', -- admin, ciso, compliance_officer, auditor, member
    permissions JSONB DEFAULT '{}',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    invited_by UUID REFERENCES auth.users(id),
    status VARCHAR(50) DEFAULT 'active', -- active, pending, suspended
    UNIQUE(project_id, user_id)
);

-- =============================================================================
-- USER PROFILES WITH PROJECT CONTEXT
-- =============================================================================

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    organization VARCHAR(255),
    role VARCHAR(100),
    industry VARCHAR(100),
    certifications TEXT[],
    preferences JSONB DEFAULT '{}',
    avatar TEXT,
    timezone VARCHAR(50) DEFAULT 'UTC',
    phone_number VARCHAR(20),
    department VARCHAR(100),
    manager VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- ASSESSMENT MANAGEMENT WITH PROJECT ISOLATION
-- =============================================================================

CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    framework_id VARCHAR(100) NOT NULL,
    framework_name VARCHAR(255) NOT NULL,
    framework_version VARCHAR(50) DEFAULT '1.0',
    responses JSONB DEFAULT '{}',
    organization_info JSONB DEFAULT '{}',
    is_complete BOOLEAN DEFAULT FALSE,
    version VARCHAR(50) DEFAULT '1.0',
    template_id UUID,
    tags TEXT[] DEFAULT '{}',
    notes TEXT,
    reviewers UUID[] DEFAULT '{}',
    approval_status VARCHAR(50) DEFAULT 'draft', -- draft, in_review, approved, rejected
    bookmarks TEXT[] DEFAULT '{}',
    time_spent INTEGER DEFAULT 0, -- in minutes
    question_notes JSONB DEFAULT '{}',
    question_evidence JSONB DEFAULT '{}',
    evidence_library JSONB DEFAULT '{}',
    risk_rating VARCHAR(50), -- low, medium, high, critical
    business_impact VARCHAR(50), -- low, medium, high, critical
    compliance_requirements TEXT[] DEFAULT '{}',
    assessment_version VARCHAR(50) DEFAULT '1.0',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Assessment versions for audit trail
CREATE TABLE IF NOT EXISTS assessment_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    version_number VARCHAR(50) NOT NULL,
    version_type VARCHAR(50) DEFAULT 'revision', -- baseline, revision, snapshot
    description TEXT,
    changes JSONB DEFAULT '{}',
    responses_snapshot JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    is_baseline BOOLEAN DEFAULT FALSE,
    approval_status VARCHAR(50) DEFAULT 'draft',
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- EVIDENCE MANAGEMENT WITH PROJECT ISOLATION
-- =============================================================================

CREATE TABLE IF NOT EXISTS evidence_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    evidence_type VARCHAR(100) NOT NULL, -- document, screenshot, configuration, policy, procedure
    file_path TEXT,
    file_size INTEGER,
    file_type VARCHAR(100),
    file_hash VARCHAR(255),
    control_id VARCHAR(100),
    control_family VARCHAR(100),
    tags TEXT[] DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'draft', -- draft, submitted, approved, rejected
    review_notes TEXT,
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- =============================================================================
-- ASSET MANAGEMENT WITH PROJECT ISOLATION
-- =============================================================================

CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    asset_type VARCHAR(100) NOT NULL, -- system, application, network, data, physical
    description TEXT,
    classification VARCHAR(50) DEFAULT 'internal', -- public, internal, confidential, restricted
    owner VARCHAR(255),
    custodian VARCHAR(255),
    location VARCHAR(255),
    ip_address INET,
    hostname VARCHAR(255),
    operating_system VARCHAR(100),
    version VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active', -- active, inactive, decommissioned
    criticality VARCHAR(50) DEFAULT 'medium', -- low, medium, high, critical
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- =============================================================================
-- POLICY MANAGEMENT WITH PROJECT ISOLATION
-- =============================================================================

CREATE TABLE IF NOT EXISTS policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    policy_type VARCHAR(100) NOT NULL, -- security, data, access, incident_response, etc.
    content TEXT NOT NULL,
    version VARCHAR(50) DEFAULT '1.0',
    status VARCHAR(50) DEFAULT 'draft', -- draft, review, approved, active, retired
    effective_date DATE,
    review_date DATE,
    approval_status VARCHAR(50) DEFAULT 'pending',
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- =============================================================================
-- AUDIT LOGGING WITH PROJECT CONTEXT
-- =============================================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- TASK MANAGEMENT WITH PROJECT ISOLATION
-- =============================================================================

CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    task_type VARCHAR(100) NOT NULL, -- remediation, evidence_collection, policy_review, etc.
    priority VARCHAR(50) DEFAULT 'medium', -- low, medium, high, critical
    status VARCHAR(50) DEFAULT 'todo', -- todo, in_progress, review, completed, cancelled
    assigned_to UUID REFERENCES auth.users(id),
    created_by UUID NOT NULL REFERENCES auth.users(id),
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Project-based indexes
CREATE INDEX IF NOT EXISTS idx_assessments_project_id ON assessments(project_id);
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_status ON assessments(approval_status);
CREATE INDEX IF NOT EXISTS idx_evidence_project_id ON evidence_items(project_id);
CREATE INDEX IF NOT EXISTS idx_evidence_assessment_id ON evidence_items(assessment_id);
CREATE INDEX IF NOT EXISTS idx_assets_project_id ON assets(project_id);
CREATE INDEX IF NOT EXISTS idx_policies_project_id ON policies(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_audit_logs_project_id ON audit_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_assessments_project_user ON assessments(project_id, user_id);
CREATE INDEX IF NOT EXISTS idx_evidence_project_assessment ON evidence_items(project_id, assessment_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_status ON tasks(project_id, status);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Projects: Users can only see projects they're members of
CREATE POLICY "Users can view projects they're members of" ON projects
    FOR SELECT USING (
        id IN (
            SELECT project_id FROM project_members 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

-- Project members: Users can view members of their projects
CREATE POLICY "Users can view project members" ON project_members
    FOR SELECT USING (
        project_id IN (
            SELECT project_id FROM project_members 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

-- Assessments: Users can only access assessments from their projects
CREATE POLICY "Users can access assessments from their projects" ON assessments
    FOR ALL USING (
        project_id IN (
            SELECT project_id FROM project_members 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

-- Evidence items: Users can only access evidence from their projects
CREATE POLICY "Users can access evidence from their projects" ON evidence_items
    FOR ALL USING (
        project_id IN (
            SELECT project_id FROM project_members 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

-- Assets: Users can only access assets from their projects
CREATE POLICY "Users can access assets from their projects" ON assets
    FOR ALL USING (
        project_id IN (
            SELECT project_id FROM project_members 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

-- Policies: Users can only access policies from their projects
CREATE POLICY "Users can access policies from their projects" ON policies
    FOR ALL USING (
        project_id IN (
            SELECT project_id FROM project_members 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

-- Tasks: Users can only access tasks from their projects
CREATE POLICY "Users can access tasks from their projects" ON tasks
    FOR ALL USING (
        project_id IN (
            SELECT project_id FROM project_members 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

-- Audit logs: Users can only access audit logs from their projects
CREATE POLICY "Users can access audit logs from their projects" ON audit_logs
    FOR SELECT USING (
        project_id IN (
            SELECT project_id FROM project_members 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

-- Profiles: Users can only access their own profile
CREATE POLICY "Users can access their own profile" ON profiles
    FOR ALL USING (id = auth.uid());

-- =============================================================================
-- FUNCTIONS AND TRIGGERS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_evidence_items_updated_at BEFORE UPDATE ON evidence_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_policies_updated_at BEFORE UPDATE ON policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, created_at, updated_at)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name', NOW(), NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- INITIAL DATA SETUP
-- =============================================================================

-- Insert default project for existing users (if any)
INSERT INTO projects (id, name, slug, description, organization_name, created_by)
VALUES (
    uuid_generate_v4(),
    'Default CMMC Project',
    'default-cmmc-project',
    'Default project for CMMC 2.0 Level 2 compliance assessments',
    'Your Organization',
    (SELECT id FROM auth.users LIMIT 1)
) ON CONFLICT DO NOTHING;

-- =============================================================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE projects IS 'Multi-tenant projects for CMMC compliance assessments';
COMMENT ON TABLE project_members IS 'Role-based access control for project members';
COMMENT ON TABLE assessments IS 'CMMC 2.0 Level 2 compliance assessments with project isolation';
COMMENT ON TABLE evidence_items IS 'Evidence collection with project isolation';
COMMENT ON TABLE assets IS 'Asset inventory with project isolation';
COMMENT ON TABLE policies IS 'Policy management with project isolation';
COMMENT ON TABLE tasks IS 'Task management with project isolation';
COMMENT ON TABLE audit_logs IS 'Audit trail with project context';