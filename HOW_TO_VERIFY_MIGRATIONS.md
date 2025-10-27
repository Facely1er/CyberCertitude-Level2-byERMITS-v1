# ✅ How to Verify All Migrations Completed Successfully

## Quick Verification Method

After running all 5 migration files in the Supabase SQL Editor, run this verification query:

---

## 📋 Step-by-Step Verification

### Step 1: Go to Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New Query"**

### Step 2: Run the Verification Script

Open the file **`supabase/migrations/VERIFY_MIGRATIONS.sql`** and copy ALL its contents into the SQL Editor, then click **"Run"**.

This will show you:
- ✅ All tables that were created
- ✅ Count of CMMC data loaded
- ✅ RLS security status
- ✅ Overall migration status

---

## 🔍 Manual Verification (Quick Check)

If you want to verify manually, run these queries one by one:

### 1. Check All Tables Exist
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

**Expected Result:** You should see at least these 14 tables:
- assets
- assessments
- assessment_versions
- audit_logs
- cmmc_controls
- cmmc_domains
- cmmc_practices
- evidence_items
- policies
- profiles
- project_members
- project_templates
- projects
- tasks

### 2. Verify CMMC Data Loaded
```sql
-- Count CMMC Domains (should be > 0)
SELECT COUNT(*) as domains FROM cmmc_domains;

-- Count CMMC Controls (should be 127 total: 110 Level 2 + 17 Level 1)
SELECT COUNT(*) as controls FROM cmmc_controls;

-- Count CMMC Practices (should be > 0)
SELECT COUNT(*) as practices FROM cmmc_practices;
```

**Expected Results:**
- Domains: Usually 14 (CMMC domains like AC, AT, AU, etc.)
- Controls: 127 total (110 for Level 2, 17 for Level 1)
- Practices: 300+ individual CMMC practices

### 3. Verify Project Templates
```sql
SELECT COUNT(*) as templates FROM project_templates;
```

**Expected Result:** Should return `3` (Small Business, Medium Business, Enterprise templates)

### 4. Verify RLS Security
```sql
SELECT tablename, 
       CASE WHEN rowsecurity THEN '✅ Enabled' 
            ELSE '❌ Disabled' END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('projects', 'profiles', 'assessments', 'assets')
ORDER BY tablename;
```

**Expected Result:** All tables should show "✅ Enabled"

---

## ✅ Success Indicators

Your migrations completed successfully if you see:

| Check | Expected | Status |
|-------|----------|--------|
| Total Tables | ≥ 14 tables | ✅ |
| CMMC Domains | > 0 domains | ✅ |
| CMMC Controls | 127 controls | ✅ |
| CMMC Practices | > 0 practices | ✅ |
| Project Templates | 3 templates | ✅ |
| RLS Enabled | All critical tables | ✅ |

---

## ❌ Troubleshooting

### If migrations failed:

**Common Issues:**

1. **"relation already exists"**
   - ✅ This is OK - it means the table was already created
   - Continue with the next migration

2. **"extension already exists"**
   - ✅ This is OK - extensions are installed
   - Continue with the next migration

3. **"permission denied"**
   - ❌ You need admin access to the Supabase project
   - Check your project permissions

4. **Missing tables**
   - ❌ Run the migration that creates those tables again
   - Check for error messages in the SQL output

---

## 📊 What Each Migration Creates

### Migration 1: `001_initial_schema.sql`
Creates:
- projects, project_members, profiles
- assessments, assessment_versions
- assets, policies, tasks
- audit_logs
- Basic RLS policies

### Migration 2: `002_cmmc_framework_data.sql`
Creates:
- cmmc_domains (14 domains)
- cmmc_controls (110 Level 2 controls)
- cmmc_practices (300+ practices)

### Migration 3: `003_project_templates.sql`
Creates:
- project_templates table
- 3 pre-configured templates
- Task templates and workflows

### Migration 4: `004_complete_cmmc_controls.sql`
Adds:
- Complete CMMC control data
- Additional CMMC practices
- Control mappings

### Migration 5: `005_cmmc_level1_controls.sql`
Adds:
- CMMC Level 1 controls (17 controls)
- Level 1 specific practices

---

## 🎯 Final Verification

Run this one final query to confirm everything:

```sql
SELECT 
    'Total Tables' as check_type,
    COUNT(*)::text as result
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'

UNION ALL

SELECT 
    'CMMC Domains',
    COUNT(*)::text
FROM cmmc_domains

UNION ALL

SELECT 
    'CMMC Controls',
    COUNT(*)::text
FROM cmmc_controls

UNION ALL

SELECT 
    'Project Templates',
    COUNT(*)::text
FROM project_templates

UNION ALL

SELECT 
    'RLS Enabled Tables',
    COUNT(*)::text
FROM pg_tables
WHERE schemaname = 'public' AND rowsecurity = true;
```

**Expected Output:**
```
check_type          | result
--------------------|-------
Total Tables        | 14 (or more)
CMMC Domains        | > 0
CMMC Controls       | 127
Project Templates   | 3
RLS Enabled Tables  | 9+
```

---

## ✅ You're Done!

If all checks pass, your database is ready! 🎉

You can now:
1. Deploy your application
2. Start using the platform
3. Create your first project
4. Begin assessments

---

**Need Help?**
- Check the error message in SQL Editor
- Verify you're logged in as project owner
- Ensure environment variables are set
- See `DATABASE_MIGRATION_GUIDE.md` for full instructions

