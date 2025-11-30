# 🗄️ Database Migration Guide - Supabase Project

**Date:** October 27, 2025  
**Status:** Ready for Migration

---

## 📋 Overview

This guide will help you complete the database migration for your new Supabase project. The migration consists of **5 SQL files** that need to be applied in a specific order.

---

## 🗂️ Migration Files

Your project contains **5 migration files** located in `supabase/migrations/`:

1. ✅ `001_initial_schema.sql` - Core multi-project schema
2. ✅ `002_cmmc_framework_data.sql` - CMMC 2.0 Level 2 framework data
3. ✅ `003_project_templates.sql` - Pre-configured project templates
4. ✅ `004_complete_cmmc_controls.sql` - Complete CMMC controls
5. ✅ `005_cmmc_level1_controls.sql` - CMMC Level 1 controls

---

## 🚀 How to Run the Migrations

### Option 1: Using Supabase Dashboard (Recommended for Windows)

This is the easiest way to run migrations on Windows without installing additional tools.

#### Step 1: Access Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Log in to your account
3. Select your project (the one with the environment variables you set up)

#### Step 2: Navigate to SQL Editor
1. In the left sidebar, click on **"SQL Editor"**
2. Click **"New Query"** to create a new SQL query

#### Step 3: Run Migrations in Order

**Run `001_initial_schema.sql`:**
1. Open `supabase/migrations/001_initial_schema.sql`
2. Copy **ALL** the content from the file
3. Paste it into the SQL Editor
4. Click **"Run"** button (or press Ctrl+Enter)
5. Wait for success message ✅

**Run `002_cmmc_framework_data.sql`:**
1. Clear the editor (or click New Query)
2. Open `supabase/migrations/002_cmmc_framework_data.sql`
3. Copy ALL content and paste into editor
4. Click **"Run"**
5. Wait for success message ✅

**Run `003_project_templates.sql`:**
1. Clear the editor
2. Open `supabase/migrations/003_project_templates.sql`
3. Copy ALL content and paste into editor
4. Click **"Run"**
5. Wait for success message ✅

**Run `004_complete_cmmc_controls.sql`:**
1. Clear the editor
2. Open `supabase/migrations/004_complete_cmmc_controls.sql`
3. Copy ALL content and paste into editor
4. Click **"Run"**
5. Wait for success message ✅

**Run `005_cmmc_level1_controls.sql`:**
1. Clear the editor
2. Open `supabase/migrations/005_cmmc_level1_controls.sql`
3. Copy ALL content and paste into editor
4. Click **"Run"**
5. Wait for success message ✅

### Step 4: Verify Tables Were Created

Run this query to verify all tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

**Expected Tables:**
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

---

## ✅ Verification Checklist

After running all migrations, verify:

- [ ] All 5 migration files ran successfully
- [ ] No error messages in the SQL Editor
- [ ] All 14 tables exist (use the query above)
- [ ] Can access "Table Editor" in Supabase dashboard
- [ ] RLS (Row Level Security) is enabled on all tables

---

## 🎯 What These Migrations Create

### Core Tables:
- **projects** - Multi-tenant project containers
- **project_members** - Role-based access control
- **profiles** - User profile management
- **assessments** - CMMC assessment data
- **assessment_versions** - Audit trail for assessments

### CMMC Framework Tables:
- **cmmc_domains** - CMMC control families (AC, AT, AU, etc.)
- **cmmc_controls** - All CMMC 2.0 Level 2 controls
- **cmmc_practices** - Specific CMMC practices

### Management Tables:
- **assets** - Asset inventory
- **evidence_items** - Evidence collection
- **policies** - Policy management
- **tasks** - Task management
- **audit_logs** - Comprehensive audit trail
- **project_templates** - Pre-configured project templates

---

## 🔒 Security Features Included

✅ **Row Level Security (RLS)** enabled on all tables  
✅ **Data encryption** at rest and in transit  
✅ **Multi-project isolation** - each project's data is separate  
✅ **Role-based access control** - admin, ciso, compliance_officer, auditor, member  
✅ **Audit logging** - comprehensive tracking of all actions

---

## 📊 Expected Outcome

After successfully running all migrations:

1. ✅ **14 database tables** created
2. ✅ **RLS policies** enabled for data security
3. ✅ **CMMC framework data** loaded (110 Level 2 controls, 17 Level 1 controls)
4. ✅ **Project templates** available (Small, Medium, Enterprise)
5. ✅ **Multi-project support** ready

---

## 🎉 Next Steps After Migration

Once migrations are complete:

1. **Verify environment variables** are set in your hosting platform
2. **Test the application** by deploying and accessing it
3. **Create your first project** through the application UI
4. **Add team members** to your project
5. **Start your first assessment**

---

## 📞 Troubleshooting

### If you get an error:
- Check the error message in SQL Editor
- Common issues:
  - Table already exists (this is OK - skip that migration)
  - Missing extension (manually enable it)
  - Permission issues (check your Supabase project access)

### Common Solutions:
- If a table already exists, that's fine - the migration uses `CREATE TABLE IF NOT EXISTS`
- If you get permission errors, ensure you're logged in as project owner
- If migrations fail midway, check which migration failed and re-run it

---

## 🎯 Final Status

Once all 5 migrations run successfully:

✅ Database schema ready  
✅ Environment variables configured  
✅ Application ready for production deployment  
✅ Ready for end users

---

**Migration Files Location:** `supabase/migrations/`  
**Status:** Ready to execute  
**Time Required:** 5-10 minutes

