-- =============================================================================
-- Fix Function Search Path Security Warning
-- Sets search_path for create_project_from_template function
-- =============================================================================

-- Drop existing function (use CASCADE to ensure it's completely removed)
DROP FUNCTION IF EXISTS create_project_from_template(UUID, VARCHAR(255), VARCHAR(100), VARCHAR(255)) CASCADE;

-- Also drop any other variants just in case
DROP FUNCTION IF EXISTS create_project_from_template CASCADE;

-- Create function WITH explicit SET search_path BEFORE AS $$
CREATE FUNCTION create_project_from_template(
    template_id UUID,
    project_name VARCHAR(255),
    project_slug VARCHAR(100),
    organization_name VARCHAR(255)
)
RETURNS UUID 
LANGUAGE plpgsql
SECURITY DEFINER
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
$$;

-- =============================================================================
-- VERIFICATION
-- =============================================================================

-- Check that function has SET search_path
SELECT 
    routine_name,
    routine_schema,
    CASE 
        WHEN routine_definition LIKE '%SET search_path%' THEN '✅ Search path is set'
        ELSE '❌ Search path NOT set'
    END as search_path_status
FROM information_schema.routines
WHERE routine_name = 'create_project_from_template'
  AND routine_schema = 'public';

