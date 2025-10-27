# 🔧 How to Fix RLS Performance Warnings

## The Problem

You have **multiple permissive policies** on these tables:
- `public.project_templates` - 3 SELECT policies (performance issue)
- `cmmc.tool_purchases` - Multiple policies for different roles (performance issue)

**Impact:** Each policy gets evaluated separately for every query, causing performance degradation.

---

## The Solution

I've created **migration 009** that consolidates these policies into single, efficient policies using OR conditions.

### What Migration 009 Does

1. **project_templates:**
   - Drops 3 separate SELECT policies
   - Creates 1 combined SELECT policy
   - Creates 1 management policy for INSERT/UPDATE/DELETE
   
2. **cmmc.tool_purchases:**
   - Checks if table exists
   - Drops conflicting policies
   - Creates 1 combined SELECT policy
   - Creates 1 combined UPDATE policy

---

## How to Run

### Step 1: Run Migration 009

1. Go to Supabase Dashboard → SQL Editor → New Query
2. Open `supabase/migrations/009_fix_multiple_permissive_policies.sql`
3. Copy ALL content
4. Paste into SQL Editor
5. Click **"Run"**
6. Wait for success ✅

### Step 2: Verify Results

Run this query to check:

```sql
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    cmd
FROM pg_policies
WHERE tablename IN ('project_templates', 'tool_purchases')
ORDER BY tablename, policyname;
```

**Expected Results:**

For `project_templates`:
- ✅ `combined_template_select` (1 policy instead of 3)
- ✅ `template_owner_management` (1 policy for modifications)

For `cmmc.tool_purchases` (if exists):
- ✅ `combined_tool_purchases_select` (1 policy instead of multiple)
- ✅ `combined_tool_purchases_update` (1 policy instead of multiple)

---

## Benefits

✅ **Performance:** Queries evaluate fewer policies (single policy with OR conditions)  
✅ **Security:** Same security behavior maintained  
✅ **Maintenance:** Easier to understand and manage  
✅ **Supabase Linter:** No more warnings about multiple permissive policies  

---

## After Running Migration 009

### Expected Changes

**Before:**
- ❌ 3 policies on `project_templates` (performance warning)
- ❌ Multiple policies on `cmmc.tool_purchases` (performance warning)
- ❌ Slow queries due to multiple policy evaluations

**After:**
- ✅ 2 policies on `project_templates` (1 SELECT + 1 management)
- ✅ 2 policies on `cmmc.tool_purchases` (1 SELECT + 1 UPDATE)
- ✅ Faster queries due to consolidated policy evaluation

---

## Verification

Run this final check:

```sql
SELECT 
    'RLS Performance Check' as check_type,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'project_templates') as project_templates_policies,
    (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'cmmc' AND tablename = 'tool_purchases') as tool_purchases_policies;
```

**Expected:**
- `project_templates_policies`: **2**
- `tool_purchases_policies`: **2** (or 0 if table doesn't exist in your schema)

---

## Ready to Fix

Run migration `009_fix_multiple_permissive_policies.sql` to fix the RLS performance warnings! 🚀

