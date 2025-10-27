-- =============================================================================
-- Final Verification Queries - Run these to confirm everything works
-- =============================================================================

-- 1. Count CMMC Data (should show loaded data)
SELECT 'CMMC Data Verification' as check_type;
SELECT 
    (SELECT COUNT(*) FROM cmmc_domains) as domains,
    (SELECT COUNT(*) FROM cmmc_controls) as controls,
    (SELECT COUNT(*) FROM cmmc_practices) as practices;

-- Expected: domains > 0, controls = 127, practices > 300

-- 2. Check Project Templates (should show 3 templates)
SELECT 'Project Templates' as check_type;
SELECT COUNT(*) as template_count FROM project_templates;
-- Expected: Should return 3

-- 3. Verify RLS is Enabled on Critical Tables
SELECT 'RLS Security Status' as check_type;
SELECT 
    tablename,
    CASE WHEN rowsecurity THEN '✅ RLS Enabled' 
         ELSE '❌ RLS Disabled' END as security_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('projects', 'profiles', 'assessments', 'assets')
ORDER BY tablename;

-- Expected: All should show "✅ RLS Enabled"

-- 4. Summary Report
SELECT 'Migration Status' as report;
SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM cmmc_controls) >= 100 
         AND (SELECT COUNT(*) FROM project_templates) >= 3
         AND (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = true) >= 9
        THEN '✅ ALL MIGRATIONS COMPLETE - READY FOR PRODUCTION'
        ELSE '⚠️ SOME CHECKS FAILED - Review above'
    END as final_status;

