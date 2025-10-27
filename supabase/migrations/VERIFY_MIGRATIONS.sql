-- =============================================================================
-- Migration Verification Script
-- Run this after completing all 5 migrations to verify everything is working
-- =============================================================================

-- 1. Check if all required tables exist
SELECT 
    table_name,
    '✅ Table exists' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
  AND table_name IN (
    'projects',
    'project_members',
    'profiles',
    'assessments',
    'assessment_versions',
    'cmmc_domains',
    'cmmc_controls',
    'cmmc_practices',
    'evidence_items',
    'assets',
    'policies',
    'tasks',
    'audit_logs',
    'project_templates'
  )
ORDER BY table_name;

-- 2. Count tables that were created
SELECT 
    COUNT(*) as total_tables_created
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE';

-- 3. Verify CMMC Domains exist (should have data)
SELECT 
    COUNT(*) as cmmc_domains_count
FROM cmmc_domains;

-- Expected: Should return a count > 0

-- 4. Verify CMMC Controls exist
SELECT 
    COUNT(*) as cmmc_controls_count
FROM cmmc_controls;

-- Expected: Should return 110 controls (Level 2) + 17 controls (Level 1) = 127

-- 5. Verify CMMC Practices exist
SELECT 
    COUNT(*) as cmmc_practices_count
FROM cmmc_practices;

-- Expected: Should return > 0

-- 6. Check if Row Level Security (RLS) is enabled on critical tables
SELECT 
    schemaname,
    tablename,
    CASE 
        WHEN rowsecurity THEN '✅ RLS Enabled'
        ELSE '❌ RLS NOT Enabled'
    END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'projects',
    'project_members',
    'profiles',
    'assessments',
    'evidence_items',
    'assets',
    'policies',
    'tasks',
    'audit_logs'
  )
ORDER BY tablename;

-- 7. Verify RLS Policies exist
SELECT 
    schemaname,
    tablename,
    policyname,
    CASE 
        WHEN permissive = 'PERMISSIVE' THEN 'Allow'
        ELSE 'Restrict'
    END as policy_type,
    roles,
    cmd as operation
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 8. Check if extensions were installed
SELECT 
    extname as extension_name,
    '✅ Installed' as status
FROM pg_extension
WHERE extname IN ('uuid-ossp', 'pgcrypto');

-- 9. Verify Project Templates exist
SELECT 
    COUNT(*) as project_templates_count
FROM project_templates;

-- Expected: Should return 3 (Small Business, Medium Business, Enterprise)

-- 10. Summary Report
SELECT 
    '📊 MIGRATION VERIFICATION SUMMARY' as report;

-- Count all public tables
SELECT 
    COUNT(*) || ' tables created' as summary
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE';

-- Count CMMC data
SELECT 
    'CMMC Framework: ' || 
    (SELECT COUNT(*) FROM cmmc_domains) || ' domains, ' ||
    (SELECT COUNT(*) FROM cmmc_controls) || ' controls, ' ||
    (SELECT COUNT(*) FROM cmmc_practices) || ' practices loaded' as cmmc_summary;

-- Check RLS status
SELECT 
    COUNT(*) || ' tables with RLS enabled' as rls_summary
FROM pg_tables
WHERE schemaname = 'public' 
  AND rowsecurity = true;

-- Final Status
SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public') >= 14 
        THEN '✅ All migrations completed successfully!'
        ELSE '❌ Some migrations may have failed'
    END as final_status;

