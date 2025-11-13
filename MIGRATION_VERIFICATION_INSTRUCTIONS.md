# 🔍 Migration Verification Instructions

## Quick Start

To verify your database migrations are complete, follow these steps:

### Step 1: Open Supabase SQL Editor

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: `rjyyicattwrqtjiqwwvv`
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New Query"**

### Step 2: Run Verification Script

1. Open the file: `MIGRATION_VERIFICATION_SCRIPT.sql`
2. Copy **ALL** the contents
3. Paste into the Supabase SQL Editor
4. Click **"Run"** (or press `Ctrl+Enter`)

### Step 3: Review Results

The script will show you 10 verification sections:

1. **Core Tables** - Lists all tables that should exist
2. **Total Tables** - Count of all tables (should be 14+)
3. **CMMC Controls** - Should show 17 Level 1, 110 Level 2, 127 Total
4. **CMMC Domains** - Should show 14-16 domains
5. **Project Templates** - Should show 3 templates
6. **RLS Status** - Shows which tables have Row Level Security enabled
7. **RLS Policies** - Count of security policies
8. **Database Functions** - Lists all custom functions
9. **Verification Summary** - Overall status of all checks
10. **Table Details** - Detailed view with row counts

---

## Expected Results

### ✅ All Checks Should Show:

| Check | Expected Value | Status |
|-------|---------------|--------|
| **Total Tables** | 14+ | ✅ |
| **Level 1 Controls** | 17 | ✅ |
| **Level 2 Controls** | 110 | ✅ |
| **Total Controls** | 127 | ✅ |
| **CMMC Domains** | 14-16 | ✅ |
| **Project Templates** | 3 | ✅ |
| **RLS Enabled Tables** | 9+ | ✅ |
| **RLS Policies** | Multiple | ✅ |

---

## What to Do If Verification Fails

### ❌ Missing Tables

If tables are missing, you need to run the migrations:

1. Go to SQL Editor
2. Run migrations in this order:
   - `001_initial_schema.sql`
   - `002_cmmc_framework_data.sql`
   - `003_project_templates.sql`
   - `004_complete_cmmc_controls.sql`
   - `005_cmmc_level1_controls.sql`
   - `006_complete_110_cmmc_level2_controls.sql`
   - `007_add_level1_controls_clean.sql`
   - `008_clean_and_fix_counts.sql`
   - `009_fix_multiple_permissive_policies.sql`
   - `010_fix_final_rls_warnings.sql`
   - `011_fix_function_search_path.sql`
   - `012_fix_search_path_with_alter.sql`
   - `013_create_subscription_tables.sql`

### ❌ Missing CMMC Data

If controls/domains are missing:

1. Re-run `002_cmmc_framework_data.sql`
2. Re-run `004_complete_cmmc_controls.sql`
3. Re-run `005_cmmc_level1_controls.sql`
4. Re-run `006_complete_110_cmmc_level2_controls.sql`

### ❌ Missing RLS Policies

If RLS is not enabled:

1. Check if tables exist
2. Re-run `001_initial_schema.sql` (it includes RLS setup)
3. Re-run `009_fix_multiple_permissive_policies.sql`
4. Re-run `010_fix_final_rls_warnings.sql`

---

## Quick Verification (Single Query)

If you want a quick check, run this single query:

```sql
SELECT 
    'Tables' as check_type,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE')::text as result,
    CASE WHEN (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE') >= 14 THEN '✅' ELSE '❌' END as status
UNION ALL
SELECT 
    'Level 2 Controls',
    (SELECT COUNT(*)::text FROM cmmc_controls WHERE level = 2),
    CASE WHEN (SELECT COUNT(*) FROM cmmc_controls WHERE level = 2) = 110 THEN '✅' ELSE '❌' END
UNION ALL
SELECT 
    'Level 1 Controls',
    (SELECT COUNT(*)::text FROM cmmc_controls WHERE level = 1),
    CASE WHEN (SELECT COUNT(*) FROM cmmc_controls WHERE level = 1) = 17 THEN '✅' ELSE '❌' END
UNION ALL
SELECT 
    'Domains',
    (SELECT COUNT(*)::text FROM cmmc_domains),
    CASE WHEN (SELECT COUNT(*) FROM cmmc_domains) >= 14 THEN '✅' ELSE '❌' END
UNION ALL
SELECT 
    'Templates',
    (SELECT COUNT(*)::text FROM project_templates),
    CASE WHEN (SELECT COUNT(*) FROM project_templates) = 3 THEN '✅' ELSE '❌' END;
```

---

## Alternative: Use Supabase CLI

If you have Supabase CLI installed:

```bash
# Link to your project
supabase link --project-ref rjyyicattwrqtjiqwwvv

# Check migration status
supabase db diff

# Verify migrations
supabase migration list
```

---

## Need Help?

If verification fails:

1. **Check Error Messages** - Look for specific error messages in SQL Editor
2. **Review Migration Files** - Ensure all migration files are in `supabase/migrations/`
3. **Check Permissions** - Ensure you're logged in as project owner
4. **Review Logs** - Check Supabase dashboard logs for errors

---

## Security Note

⚠️ **IMPORTANT:** The connection string you shared contains your database password. 

**Immediate Actions Required:**
1. **Rotate your database password** in Supabase dashboard
2. **Never share connection strings** publicly
3. **Use environment variables** for all credentials
4. **Verify `.gitignore`** excludes `.env` files

To rotate password:
1. Go to Supabase Dashboard → Settings → Database
2. Click "Reset Database Password"
3. Update your connection strings/environment variables

---

**Last Updated:** December 2024

