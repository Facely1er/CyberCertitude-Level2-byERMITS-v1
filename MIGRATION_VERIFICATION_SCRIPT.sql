-- =============================================================================
-- COMPREHENSIVE MIGRATION VERIFICATION SCRIPT
-- Run this in Supabase SQL Editor to verify all migrations are applied correctly
-- =============================================================================

-- ============================================
-- 1. VERIFY CORE TABLES EXIST
-- ============================================
SELECT 
    '1. Core Tables' as verification_section,
    table_name,
    CASE 
        WHEN table_name IN ('projects', 'profiles', 'assessments', 'assets', 'tasks') 
        THEN '✅ Core Table'
        WHEN table_name IN ('cmmc_domains', 'cmmc_controls', 'cmmc_practices')
        THEN '✅ CMMC Framework'
        WHEN table_name IN ('evidence_items', 'policies', 'audit_logs')
        THEN '✅ Management'
        WHEN table_name IN ('project_templates', 'project_members')
        THEN '✅ Project Management'
        ELSE '✅ Additional'
    END as table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- ============================================
-- 2. COUNT ALL TABLES
-- ============================================
SELECT 
    '2. Total Tables' as check_type,
    COUNT(*)::text as result,
    CASE 
        WHEN COUNT(*) >= 14 THEN '✅ PASS'
        ELSE '❌ FAIL - Expected at least 14 tables'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE';

-- ============================================
-- 3. VERIFY CMMC CONTROLS
-- ============================================
SELECT 
    '3. CMMC Controls' as check_type,
    (SELECT COUNT(*) FROM cmmc_controls WHERE level = 1)::text as level1_controls,
    (SELECT COUNT(*) FROM cmmc_controls WHERE level = 2)::text as level2_controls,
    (SELECT COUNT(*) FROM cmmc_controls)::text as total_controls,
    CASE 
        WHEN (SELECT COUNT(*) FROM cmmc_controls WHERE level = 2) = 110 
         AND (SELECT COUNT(*) FROM cmmc_controls WHERE level = 1) = 17
        THEN '✅ PASS - Expected: 17 Level 1, 110 Level 2, 127 Total'
        ELSE '⚠️ WARNING - Check control counts'
    END as status;

-- ============================================
-- 4. VERIFY CMMC DOMAINS
-- ============================================
SELECT 
    '4. CMMC Domains' as check_type,
    (SELECT COUNT(*) FROM cmmc_domains)::text as domain_count,
    CASE 
        WHEN (SELECT COUNT(*) FROM cmmc_domains) >= 14 THEN '✅ PASS - Expected: 14-16 domains'
        ELSE '❌ FAIL - Expected at least 14 domains'
    END as status;

-- ============================================
-- 5. VERIFY PROJECT TEMPLATES
-- ============================================
SELECT 
    '5. Project Templates' as check_type,
    (SELECT COUNT(*) FROM project_templates)::text as template_count,
    CASE 
        WHEN (SELECT COUNT(*) FROM project_templates) = 3 THEN '✅ PASS - Expected: 3 templates'
        ELSE '❌ FAIL - Expected 3 templates'
    END as status;

-- ============================================
-- 6. VERIFY ROW LEVEL SECURITY (RLS)
-- ============================================
SELECT 
    '6. RLS Status' as check_type,
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

-- ============================================
-- 7. COUNT RLS POLICIES
-- ============================================
SELECT 
    '7. RLS Policies' as check_type,
    COUNT(*)::text as policy_count,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ PASS - RLS policies exist'
        ELSE '⚠️ WARNING - No RLS policies found'
    END as status
FROM pg_policies 
WHERE schemaname = 'public';

-- ============================================
-- 8. VERIFY DATABASE FUNCTIONS
-- ============================================
SELECT 
    '8. Database Functions' as check_type,
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public'
  AND routine_type = 'FUNCTION'
ORDER BY routine_name;

-- ============================================
-- 9. FINAL SUMMARY CHECK
-- ============================================
SELECT 
    '9. VERIFICATION SUMMARY' as check_type,
    CASE 
        WHEN (SELECT COUNT(*) FROM cmmc_controls WHERE level = 2) = 110 THEN '✅ Level 2 Controls (110)'
        ELSE '❌ Level 2 Controls MISSING or INCORRECT'
    END as level2_status,
    CASE 
        WHEN (SELECT COUNT(*) FROM cmmc_controls WHERE level = 1) = 17 THEN '✅ Level 1 Controls (17)'
        ELSE '❌ Level 1 Controls MISSING or INCORRECT'
    END as level1_status,
    CASE 
        WHEN (SELECT COUNT(*) FROM cmmc_domains) >= 14 THEN '✅ Domains (' || (SELECT COUNT(*) FROM cmmc_domains)::text || ')'
        ELSE '❌ Domains MISSING'
    END as domain_status,
    CASE 
        WHEN (SELECT COUNT(*) FROM project_templates) = 3 THEN '✅ Templates (3)'
        ELSE '❌ Templates MISSING'
    END as template_status,
    CASE 
        WHEN (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE') >= 14 
        THEN '✅ Schema (' || (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE')::text || ' tables)'
        ELSE '❌ Schema INCOMPLETE'
    END as schema_status;

-- ============================================
-- 10. DETAILED TABLE LIST WITH ROW COUNTS
-- ============================================
SELECT 
    '10. Table Details' as section,
    t.table_name,
    CASE 
        WHEN t.table_name = 'cmmc_controls' THEN (SELECT COUNT(*)::text FROM cmmc_controls)
        WHEN t.table_name = 'cmmc_domains' THEN (SELECT COUNT(*)::text FROM cmmc_domains)
        WHEN t.table_name = 'cmmc_practices' THEN (SELECT COUNT(*)::text FROM cmmc_practices)
        WHEN t.table_name = 'project_templates' THEN (SELECT COUNT(*)::text FROM project_templates)
        WHEN t.table_name = 'projects' THEN (SELECT COUNT(*)::text FROM projects)
        WHEN t.table_name = 'profiles' THEN (SELECT COUNT(*)::text FROM profiles)
        WHEN t.table_name = 'assessments' THEN (SELECT COUNT(*)::text FROM assessments)
        ELSE 'N/A'
    END as row_count,
    CASE 
        WHEN pt.rowsecurity THEN '✅ RLS'
        ELSE '❌ No RLS'
    END as rls_enabled
FROM information_schema.tables t
LEFT JOIN pg_tables pt ON pt.tablename = t.table_name AND pt.schemaname = 'public'
WHERE t.table_schema = 'public' 
  AND t.table_type = 'BASE TABLE'
ORDER BY t.table_name;

