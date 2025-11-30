# 📋 Complete Database Setup Instructions

## ✅ Already Completed

- ✅ 127 CMMC controls (17 Level 1 + 110 Level 2)
- ✅ 16 CMMC domains
- ✅ Clean data (no samples)

## 🔧 Still Need to Run

### 1. Project Templates (RECOMMENDED)

**Run:** `003_project_templates.sql`

**Why:** Adds pre-configured project templates (Small, Medium, Enterprise)

**How:**
1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/migrations/003_project_templates.sql`
3. Run it

**Expected:** 3 project templates created

---

### 2. Fix RLS Performance Warnings (RECOMMENDED)

**Run:** `009_fix_multiple_permissive_policies.sql`

**Why:** Fixes multiple permissive policies performance warnings

**How:**
1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/migrations/009_fix_multiple_permissive_policies.sql`
3. Run it

**Expected:**
- No more performance warnings
- Faster query performance
- Consolidated RLS policies

---

### 3. RLS Performance Optimization (OPTIONAL)

**Run:** `006_fix_rls_performance.sql`

**Why:** Optimizes RLS policy calls for better performance

**How:**
1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/migrations/006_fix_rls_performance.sql`
3. Run it

**Expected:** Optimized auth function calls in all RLS policies

---

### 4. Sample Data (OPTIONAL - For Testing Only)

**Run:** `seed.sql`

**Why:** Adds sample projects, assessments, evidence for testing

**How:**
1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/seed.sql`
3. Run it

**Expected:** Sample data for testing the application

**Warning:** Only run in development/testing environments!

---

## 📊 Recommended Migration Order

### For Production (Minimum Required):

```bash
1. ✅ Already done: 006_complete_110_cmmc_level2_controls.sql
2. ✅ Already done: 007_add_level1_controls_clean.sql
3. ⏭️ Run now: 003_project_templates.sql
4. ⏭️ Run now: 009_fix_multiple_permissive_policies.sql
```

### For Complete Optimization (Optional):

```bash
1-2. Already done (CMMC controls)
3. Project templates
4. Fix RLS performance warnings
5. RLS performance optimization (006_fix_rls_performance.sql)
```

### For Testing Only (Development):

```bash
1-4. All production migrations
5. seed.sql (sample data)
```

---

## 🎯 Quick Start

### Just Fix the Performance Warnings

Run only: `009_fix_multiple_permissive_policies.sql`

This addresses the warnings you're seeing.

---

## ✅ After Running These Migrations

You'll have:

| Component | Status |
|-----------|--------|
| CMMC Framework | ✅ Complete (127 controls, 16 domains) |
| Project Templates | ✅ Complete (3 templates) |
| RLS Performance | ✅ Optimized (no warnings) |
| Database Schema | ✅ Production Ready |

---

## 🚀 Ready to Deploy

Once you run the essential migrations:
1. ✅ Database complete
2. ✅ CMMC framework loaded
3. ✅ Project templates available
4. ✅ RLS performance optimized
5. ✅ Ready for production deployment

**Your application is ready!** 🎉

