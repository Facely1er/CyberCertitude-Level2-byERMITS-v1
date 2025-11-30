-- =============================================================================
-- Fix Function Search Path Using ALTER FUNCTION
-- This uses ALTER FUNCTION instead of recreating to ensure search_path is set
-- =============================================================================

-- Set search_path on the existing function using ALTER FUNCTION
ALTER FUNCTION create_project_from_template(UUID, VARCHAR(255), VARCHAR(100), VARCHAR(255))
SET search_path = public, pg_temp;

-- =============================================================================
-- VERIFICATION - Using pg_proc catalog
-- =============================================================================

-- Check pg_proc catalog for search_path setting (more accurate)
SELECT 
    p.proname as routine_name,
    n.nspname as routine_schema,
    CASE 
        WHEN p.proconfig IS NOT NULL AND 
             array_to_string(p.proconfig, ', ') LIKE '%search_path%' 
        THEN '✅ Search path is set'
        ELSE '❌ Search path NOT set'
    END as search_path_status,
    p.proconfig as function_config
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'create_project_from_template'
  AND n.nspname = 'public';

-- Alternative verification query
SELECT 
    proname,
    nspname as schema_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM unnest(proconfig) AS config
            WHERE config::text LIKE '%search_path%'
        ) THEN '✅ Search path found in proconfig'
        ELSE '❌ Search path NOT in proconfig'
    END as search_path_status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE proname = 'create_project_from_template'
  AND nspname = 'public';

