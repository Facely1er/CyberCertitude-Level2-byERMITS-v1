-- =============================================================================
-- Fix Multiple Permissive Policies Performance Issue
-- Consolidates multiple permissive policies into single efficient policies
-- =============================================================================

-- =============================================================================
-- FIX: project_templates table - Multiple SELECT policies
-- =============================================================================

-- Drop ALL existing policies on project_templates to start fresh
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

-- Create a single SELECT policy that covers all read scenarios
CREATE POLICY "template_select_access" ON project_templates
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

-- Create policies for modifications (INSERT, UPDATE, DELETE only)
-- Only owners can insert
CREATE POLICY "template_insert_access" ON project_templates
    FOR INSERT
    WITH CHECK (created_by = (SELECT auth.uid()));

-- Only owners can update  
CREATE POLICY "template_update_access" ON project_templates
    FOR UPDATE
    USING (created_by = (SELECT auth.uid()))
    WITH CHECK (created_by = (SELECT auth.uid()));

-- Only owners can delete
CREATE POLICY "template_delete_access" ON project_templates
    FOR DELETE
    USING (created_by = (SELECT auth.uid()));

-- =============================================================================
-- FIX: cmmc.tool_purchases table - Multiple policies for different roles
-- =============================================================================

-- Note: If the tool_purchases table exists, we need to address its policies
-- First, check if table exists and what policies it has
DO $$
BEGIN
    -- Check if cmmc schema exists
    IF EXISTS (
        SELECT 1 FROM pg_namespace WHERE nspname = 'cmmc'
    ) THEN
        -- Check if table exists
        IF EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'cmmc' AND table_name = 'tool_purchases'
        ) THEN
            -- Drop existing policies if they exist (including any that might have been created before)
            EXECUTE 'DROP POLICY IF EXISTS cmmc_service_role_full_access ON cmmc.tool_purchases';
            EXECUTE 'DROP POLICY IF EXISTS cmmc_users_can_view_own_purchases ON cmmc.tool_purchases';
            EXECUTE 'DROP POLICY IF EXISTS cmmc_users_can_update_own_downloads ON cmmc.tool_purchases';
            EXECUTE 'DROP POLICY IF EXISTS combined_tool_purchases_select ON cmmc.tool_purchases';
            EXECUTE 'DROP POLICY IF EXISTS combined_tool_purchases_update ON cmmc.tool_purchases';
            
            -- Create single consolidated SELECT policy
            EXECUTE '
                CREATE POLICY "combined_tool_purchases_select" ON cmmc.tool_purchases
                    FOR SELECT
                    USING (
                        -- Service role has full access
                        (SELECT auth.role()) = ''service_role''
                        OR
                        -- Authenticated users can view their own purchases
                        (user_id = (SELECT auth.uid()) AND (SELECT auth.role()) = ''authenticated'')
                    )
            ';
            
            -- Create single consolidated UPDATE policy
            EXECUTE '
                CREATE POLICY "combined_tool_purchases_update" ON cmmc.tool_purchases
                    FOR UPDATE
                    USING (
                        -- Service role has full access
                        (SELECT auth.role()) = ''service_role''
                        OR
                        -- Users can update their own downloads
                        (user_id = (SELECT auth.uid()) AND (SELECT auth.role()) = ''authenticated'')
                    )
                    WITH CHECK (
                        -- Service role has full access
                        (SELECT auth.role()) = ''service_role''
                        OR
                        -- Users can update their own downloads
                        (user_id = (SELECT auth.uid()) AND (SELECT auth.role()) = ''authenticated'')
                    )
            ';
        END IF;
    END IF;
END $$;

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

-- Check policies for project_templates (should have only 1 SELECT and 1 ALL policy)
SELECT 
    tablename,
    policyname,
    cmd,
    permissive
FROM pg_policies
WHERE tablename = 'project_templates'
ORDER BY policyname;

-- Check if cmmc.tool_purchases exists and its policies
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'cmmc' AND table_name = 'tool_purchases'
    ) THEN
        RAISE NOTICE 'Checking policies on cmmc.tool_purchases...';
    END IF;
END $$;

-- Summary
SELECT 
    'RLS Performance Fix Applied' as status,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'project_templates') as project_templates_policies,
    (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'cmmc' AND tablename = 'tool_purchases') as tool_purchases_policies;

