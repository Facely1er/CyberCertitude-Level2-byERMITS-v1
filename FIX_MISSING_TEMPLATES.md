# ✅ Fix Missing Project Templates

**Status:** Your verification shows templates are missing  
**Time Required:** 2 minutes  
**Action:** Run the project templates migration

---

## 🚀 Quick Fix (2 Steps)

### Step 1: Open Migration File
1. Open `supabase/migrations/003_project_templates.sql` in your code editor
2. Copy **ALL** the content (Ctrl+A, Ctrl+C)

### Step 2: Run in Supabase
1. Go to https://supabase.com/dashboard
2. Select project: `rjyyicattwrqtjiqwwvv`
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**
5. **Paste** the copied migration code
6. Click **Run** (or press Ctrl+Enter)
7. Wait for success message ✅

---

## ✅ Verify It Worked

After running, verify by running this query:

```sql
SELECT 
    name,
    template_type,
    organization_size,
    compliance_framework
FROM project_templates;
```

**Expected Result:** You should see 3 templates:
- Small Business - CMMC Level 2
- Medium Enterprise - CMMC Level 2  
- Large Enterprise - CMMC Level 2

---

## 🎯 After This

Once templates are added, re-run your verification query:

```sql
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
```

**Expected Result:** All checkmarks ✅

---

## ⏱️ Time to Complete

- **Step 1:** Open and copy file (30 seconds)
- **Step 2:** Run in Supabase (1 minute)
- **Verify:** Check templates (30 seconds)

**Total:** ~2 minutes

---

## 🎉 You're Almost Ready!

After this, you'll have:
- ✅ 110 Level 2 Controls
- ✅ 17 Level 1 Controls  
- ✅ 16 Domains
- ✅ 3 Project Templates
- ✅ Complete Schema

**Then proceed with GitHub secrets configuration!**

