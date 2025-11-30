# ⚡ Run Migration 012 - ALTER FUNCTION Approach

## The Problem

Even after recreating the function, the search_path setting isn't being recognized by the verification query.

## The Solution

Migration 012 uses `ALTER FUNCTION` to explicitly set the search_path on the existing function.

### This is the RIGHT approach because:
- ✅ Doesn't recreate the function
- ✅ Just modifies the function's configuration
- ✅ Ensures search_path is set in pg_proc catalog
- ✅ Supabase linter will recognize it

---

## 🚀 Run Migration 012

### How to Run

1. **Supabase Dashboard → SQL Editor → New Query**
2. **Open:** `supabase/migrations/012_fix_search_path_with_alter.sql`
3. **Copy all contents**
4. **Run it**
5. **Check BOTH verification queries at the end**

---

## What Migration 012 Does

1. **ALTER FUNCTION** to set search_path (doesn't drop/recreate)
2. Uses **pg_proc catalog** to verify (more accurate than routine_definition)
3. Provides **two verification queries** to double-check

---

## Expected Results

**First verification:**
```
| routine_name                 | search_path_status | function_config |
| ---------------------------- | ------------------ | --------------- |
| create_project_from_template | ✅ Search path is set | [config details] |
```

**Second verification:**
```
| proname                      | search_path_status |
| ---------------------------- | ------------------ |
| create_project_from_template | ✅ Search path found in proconfig |
```

---

## ✅ This Should Work!

The `ALTER FUNCTION` approach is more reliable than recreating the function.

**Run migration 012 now!** 🚀

