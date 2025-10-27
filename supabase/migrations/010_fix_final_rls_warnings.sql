-- =============================================================================
-- Final RLS Fix - Separate Policies by Operation Type
-- This eliminates multiple permissive warnings by splitting ALL into separate operations
-- =============================================================================

-- =============================================================================
-- FIX: project_templates - Separate policies by operation
-- =============================================================================

-- Drop all existing policies
DROP POLICY IF EXISTS "Authenticated users can read public templates" ON project_templates;
DROP POLICY IF EXISTS "Template owners can manage their templates" ON project_templates;
DROP POLICY IF EXISTS "Template members can view their templates" ON project_templates;
DROP POLICY IF EXISTS "combined_template_select" ON project_templates;
DROP POLICY IF EXISTS "template_owner_management" ON project_templates;
DROP POLICY IF EXISTS "single_template_policy" ON project_templates;
DROP POLICY IF EXISTS "template_modify_access" ON project_templates;
DROP POLICY IF EXISTS "template_insert_access" ON project_templates;
DROP POLICY IF EXISTS "template_update_access" ON project_templates;
DROP POLICY IF EXISTS "template_delete_access" ON project_templates;
DROP POLICY IF EXISTS "template_select_access" ON project_templates;

-- Create ONLY a SELECT policy (no ALL policy)
CREATE POLICY "template_select_only" ON project_templates
    FOR SELECT
    USING (
        -- Owners can always read their templates
        created_by = (SELECT auth.uid())
        OR
        -- Members can read templates they're assigned to
        id IN (
            SELECT template_id FROM project_template_members 
            WHERE user_id = (SELECT auth.uid())
        )
        OR
        -- Public templates can be read by authenticated users
        (is_public = TRUE AND (SELECT auth.role()) = 'authenticated')
    );

-- Create INSERT policy
CREATE POLICY "template_insert_only" ON project_templates
    FOR INSERT
    WITH CHECK (created_by = (SELECT auth.uid()));

-- Create UPDATE policy
CREATE POLICY "template_update_only" ON project_templates
    FOR UPDATE
    USING (created_by = (SELECT auth.uid()))
    WITH CHECK (created_by = (SELECT auth.uid()));

-- Create DELETE policy
CREATE POLICY "template_delete_only" ON project_templates
    FOR DELETE
    USING (created_by = (SELECT auth.uid()));

-- =============================================================================
-- FIX: project_template_members - Use optimized auth calls
-- =============================================================================

-- Drop and recreate with optimized auth call
DROP POLICY IF EXISTS "Users can view template membership" ON project_template_members;

CREATE POLICY "Users can view template membership" ON project_template_members
    FOR SELECT USING (
        template_id IN (
            SELECT id FROM project_templates 
            WHERE is_public = TRUE OR created_by = (SELECT auth.uid())
        )
    );

-- =============================================================================
-- VERIFICATION
-- =============================================================================

-- Check policies for project_templates
SELECT 
    tablename,
    policyname,
    cmd,
    permissive
FROM pg_policies
WHERE tablename = 'project_templates'
ORDER BY cmd, policyname;

-- Summary
SELECT 
    'RLS Fix Complete' as status,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'project_templates') as project_templates_policies,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'project_template_members') as membership_policies;

