-- Database Migration Verification Queries
-- Run these in Supabase SQL Editor to verify your database is ready

-- ============================================
-- QUERY 1: Verify CMMC Controls
-- ============================================
SELECT 
    'CMMC Controls' as component,
    (SELECT COUNT(*) FROM cmmc_controls WHERE level = 1) as level1_controls,
    (SELECT COUNT(*) FROM cmmc_controls WHERE level = 2) as level2_controls,
    (SELECT COUNT(*) FROM cmmc_controls) as total_controls;

-- EXPECTED: level1_controls = 17, level2_controls = 110, total = 127

-- ============================================
-- QUERY 2: Verify CMMC Domains
-- ============================================
SELECT 
    'CMMC Domains' as component,
    (SELECT COUNT(*) FROM cmmc_domains) as domain_count;

-- EXPECTED: domain_count = 16

-- ============================================
-- QUERY 3: Verify Project Templates
-- ============================================
SELECT 
    'Project Templates' as component,
    (SELECT COUNT(*) FROM project_templates) as template_count;

-- EXPECTED: template_count = 3

-- ============================================
-- QUERY 4: List All Tables
-- ============================================
SELECT 
    table_name,
    CASE 
        WHEN table_name IN ('projects', 'profiles', 'assessments', 'assets', 'tasks') 
        THEN '✅ Core Table'
        WHEN table_name IN ('cmmc_domains', 'cmmc_controls', 'cmmc_practices')
        THEN '✅ CMMC Framework'
        WHEN table_name IN ('evidence_items', 'policies', 'audit_logs')
        THEN '✅ Management'
        ELSE '✅ Additional'
    END as table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- EXPECTED: Should see 14+ tables

-- ============================================
-- QUERY 5: Verify RLS Policies
-- ============================================
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- EXPECTED: Should see RLS policies on key tables

-- ============================================
-- QUERY 6: Verify Functions
-- ============================================
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- ============================================
-- SUMMARY CHECK
-- ============================================
SELECT 
    'VERIFICATION SUMMARY' as check_type,
    CASE 
        WHEN (SELECT COUNT(*) FROM cmmc_controls WHERE level = 2) = 110 THEN '✅ Level 2 Controls'
        ELSE '❌ Level 2 Controls MISSING'
    END as level2_status,
    CASE 
        WHEN (SELECT COUNT(*) FROM cmmc_controls WHERE level = 1) = 17 THEN '✅ Level 1 Controls'
        ELSE '❌ Level 1 Controls MISSING'
    END as level1_status,
    CASE 
        WHEN (SELECT COUNT(*) FROM cmmc_domains) = 16 THEN '✅ Domains'
        ELSE '❌ Domains MISSING'
    END as domain_status,
    CASE 
        WHEN (SELECT COUNT(*) FROM project_templates) = 3 THEN '✅ Templates'
        ELSE '❌ Templates MISSING'
    END as template_status,
    CASE 
        WHEN (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public') >= 14 THEN '✅ Schema'
        ELSE '❌ Schema INCOMPLETE'
    END as schema_status;

