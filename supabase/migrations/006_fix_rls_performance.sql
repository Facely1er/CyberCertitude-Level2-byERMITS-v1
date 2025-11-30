-- =============================================================================
-- Fix RLS Performance Issues
-- Replaces auth.uid() and auth.role() with (select auth.uid()) and (select auth.role())
-- =============================================================================

-- =============================================================================
-- DROP AND RECREATE FUNCTIONS WITH SET search_path
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SET search_path = public, pg_temp
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, created_at, updated_at)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name', NOW(), NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create project from template
CREATE OR REPLACE FUNCTION create_project_from_template(
    template_id UUID,
    project_name VARCHAR(255),
    project_slug VARCHAR(100),
    organization_name VARCHAR(255)
)
RETURNS UUID
SET search_path = public, pg_temp
AS $$
DECLARE
    new_project_id UUID;
    template_data RECORD;
BEGIN
    -- Get template data
    SELECT * INTO template_data FROM project_templates WHERE id = template_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Template not found';
    END IF;
    
    -- Create new project
    INSERT INTO projects (
        name, 
        slug, 
        description, 
        organization_name, 
        industry, 
        compliance_framework, 
        project_type, 
        settings, 
        metadata, 
        created_by
    ) VALUES (
        project_name,
        project_slug,
        template_data.description,
        organization_name,
        template_data.industry,
        template_data.compliance_framework,
        template_data.template_type,
        template_data.default_settings,
        jsonb_build_object('created_from_template', template_id),
        auth.uid()
    ) RETURNING id INTO new_project_id;
    
    -- Add creator as project admin
    INSERT INTO project_members (project_id, user_id, role, permissions)
    VALUES (new_project_id, auth.uid(), 'admin', '{"all": true}');
    
    RETURN new_project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- DROP EXISTING RLS POLICIES
-- =============================================================================

DROP POLICY IF EXISTS "Users can access their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view projects they're members of" ON projects;
DROP POLICY IF EXISTS "Users can view project members" ON project_members;
DROP POLICY IF EXISTS "Users can access assessments from their projects" ON assessments;
DROP POLICY IF EXISTS "Users can access evidence from their projects" ON evidence_items;
DROP POLICY IF EXISTS "Users can access assets from their projects" ON assets;
DROP POLICY IF EXISTS "Users can access policies from their projects" ON policies;
DROP POLICY IF EXISTS "Users can access tasks from their projects" ON tasks;
DROP POLICY IF EXISTS "Users can access audit logs from their projects" ON audit_logs;
DROP POLICY IF EXISTS "Authenticated users can read CMMC domains" ON cmmc_domains;
DROP POLICY IF EXISTS "Authenticated users can read CMMC controls" ON cmmc_controls;
DROP POLICY IF EXISTS "Authenticated users can read CMMC practices" ON cmmc_practices;
DROP POLICY IF EXISTS "Authenticated users can read public templates" ON project_templates;
DROP POLICY IF EXISTS "Template owners can manage their templates" ON project_templates;
DROP POLICY IF EXISTS "Template members can view their templates" ON project_templates;
DROP POLICY IF EXISTS "Users can view template membership" ON project_template_members;

-- =============================================================================
-- RECREATE RLS POLICIES WITH OPTIMIZED AUTH CALLS
-- =============================================================================

-- Profiles: Users can only access their own profile
CREATE POLICY "Users can access their own profile" ON profiles
    FOR ALL USING (id = (select auth.uid()));

-- Projects: Users can only see projects they're members of
CREATE POLICY "Users can view projects they're members of" ON projects
    FOR SELECT USING (
        id IN (
            SELECT project_id FROM project_members 
            WHERE user_id = (select auth.uid()) AND status = 'active'
        )
    );

-- Project members: Users can view members of their projects
CREATE POLICY "Users can view project members" ON project_members
    FOR SELECT USING (
        project_id IN (
            SELECT project_id FROM project_members 
            WHERE user_id = (select auth.uid()) AND status = 'active'
        )
    );

-- Assessments: Users can only access assessments from their projects
CREATE POLICY "Users can access assessments from their projects" ON assessments
    FOR ALL USING (
        project_id IN (
            SELECT project_id FROM project_members 
            WHERE user_id = (select auth.uid()) AND status = 'active'
        )
    );

-- Evidence items: Users can only access evidence from their projects
CREATE POLICY "Users can access evidence from their projects" ON evidence_items
    FOR ALL USING (
        project_id IN (
            SELECT project_id FROM project_members 
            WHERE user_id = (select auth.uid()) AND status = 'active'
        )
    );

-- Assets: Users can only access assets from their projects
CREATE POLICY "Users can access assets from their projects" ON assets
    FOR ALL USING (
        project_id IN (
            SELECT project_id FROM project_members 
            WHERE user_id = (select auth.uid()) AND status = 'active'
        )
    );

-- Policies: Users can only access policies from their projects
CREATE POLICY "Users can access policies from their projects" ON policies
    FOR ALL USING (
        project_id IN (
            SELECT project_id FROM project_members 
            WHERE user_id = (select auth.uid()) AND status = 'active'
        )
    );

-- Tasks: Users can only access tasks from their projects
CREATE POLICY "Users can access tasks from their projects" ON tasks
    FOR ALL USING (
        project_id IN (
            SELECT project_id FROM project_members 
            WHERE user_id = (select auth.uid()) AND status = 'active'
        )
    );

-- Audit logs: Users can only access audit logs from their projects
CREATE POLICY "Users can access audit logs from their projects" ON audit_logs
    FOR SELECT USING (
        project_id IN (
            SELECT project_id FROM project_members 
            WHERE user_id = (select auth.uid()) AND status = 'active'
        )
    );

-- CMMC Domains: Allow all authenticated users to read
CREATE POLICY "Authenticated users can read CMMC domains" ON cmmc_domains
    FOR SELECT USING ((select auth.role()) = 'authenticated');

-- CMMC Controls: Allow all authenticated users to read
CREATE POLICY "Authenticated users can read CMMC controls" ON cmmc_controls
    FOR SELECT USING ((select auth.role()) = 'authenticated');

-- CMMC Practices: Allow all authenticated users to read
CREATE POLICY "Authenticated users can read CMMC practices" ON cmmc_practices
    FOR SELECT USING ((select auth.role()) = 'authenticated');

-- Project Templates: Authenticated users can read public templates
CREATE POLICY "Authenticated users can read public templates" ON project_templates
    FOR SELECT USING (is_public = TRUE AND (select auth.role()) = 'authenticated');

-- Project Templates: Template owners can manage their templates
CREATE POLICY "Template owners can manage their templates" ON project_templates
    FOR ALL USING (created_by = (select auth.uid()));

-- Project Templates: Template members can view their templates
CREATE POLICY "Template members can view their templates" ON project_templates
    FOR SELECT USING (
        id IN (
            SELECT template_id FROM project_template_members 
            WHERE user_id = (select auth.uid())
        )
    );

-- Project Template Members: Users can view template membership
CREATE POLICY "Users can view template membership" ON project_template_members
    FOR SELECT USING (
        template_id IN (
            SELECT id FROM project_templates 
            WHERE is_public = TRUE OR created_by = (select auth.uid())
        )
    );
