# 🔧 Fix Current Database Counts

## Current Problem

You have:
- 34 Level 1 controls (should be 17)
- 127 Level 2 controls (should be 110)
- 161 total controls (should be 127)

**Issue:** Duplicate controls from previous migrations weren't properly cleaned.

## Solution: Start Fresh

Run these steps to get the CORRECT counts:

### Step 1: Clear Everything

Run this in SQL Editor:

```sql
-- Delete ALL existing data
DELETE FROM cmmc_practices;
DELETE FROM cmmc_controls;
DELETE FROM cmmc_domains;

-- Verify it's empty
SELECT 
    (SELECT COUNT(*) FROM cmmc_controls WHERE level = 1) as level1,
    (SELECT COUNT(*) FROM cmmc_controls WHERE level = 2) as level2,
    (SELECT COUNT(*) FROM cmmc_controls) as total;
-- Should show: level1=0, level2=0, total=0
```

### Step 2: Add ONLY Level 2 Domains and Controls

Run migration `006_complete_110_cmmc_level2_controls.sql` from start to finish.

**Expected after this step:**
- 16 domains
- 110 Level 2 controls  
- 0 Level 1 controls

**Verify:**
```sql
SELECT 
    (SELECT COUNT(*) FROM cmmc_controls WHERE level = 1) as level1,
    (SELECT COUNT(*) FROM cmmc_controls WHERE level = 2) as level2,
    (SELECT COUNT(*) FROM cmmc_controls) as total,
    (SELECT COUNT(*) FROM cmmc_domains) as domains;
-- Should show: level1=0, level2=110, total=110, domains=16
```

### Step 3: Add ONLY Level 1 Controls

Run migration `007_add_level1_controls_clean.sql` from start to finish.

**Expected after this step:**
- 16 domains
- 110 Level 2 controls
- 17 Level 1 controls
- Total: 127 controls

**Verify:**
```sql
SELECT 
    (SELECT COUNT(*) FROM cmmc_controls WHERE level = 1) as level1,
    (SELECT COUNT(*) FROM cmmc_controls WHERE level = 2) as level2,
    (SELECT COUNT(*) FROM cmmc_controls) as total,
    (SELECT COUNT(*) FROM cmmc_domains) as domains;
-- Should show: level1=17, level2=110, total=127, domains=16
```

---

## Expected Final Result

| Metric | Count | Status |
|--------|-------|--------|
| Level 1 Controls | 17 | ✅ |
| Level 2 Controls | 110 | ✅ |
| Total Controls | 127 | ✅ |
| Domains | 16 | ✅ |

---

## Why This Happened

Your previous migration 006 likely included Level 1 controls mixed in (17 of them), making your Level 2 count 127 instead of 110. Then migration 007 added another 17 Level 1 controls, giving you 34 total Level 1 controls.

**The Fix:** Start completely fresh and add ONLY Level 2 controls first, then ONLY Level 1 controls.

---

## Quick Fix Script

Run this complete script in SQL Editor:

```sql
-- 1. Delete everything
DELETE FROM cmmc_practices;
DELETE FROM cmmc_controls;
DELETE FROM cmmc_domains;

-- 2. Verify empty
SELECT 'After delete:' as status,
    (SELECT COUNT(*) FROM cmmc_controls) as total_controls,
    (SELECT COUNT(*) FROM cmmc_domains) as total_domains;

-- Then run full migration 006 (110 Level 2 controls)
-- Then run full migration 007 (17 Level 1 controls)

-- 3. Final verification
SELECT 'Final result:' as status,
    (SELECT COUNT(*) FROM cmmc_controls WHERE level = 1) as level1,
    (SELECT COUNT(*) FROM cmmc_controls WHERE level = 2) as level2,
    (SELECT COUNT(*) FROM cmmc_controls) as total,
    (SELECT COUNT(*) FROM cmmc_domains) as domains;
```

---

**Run these steps and you'll have exactly 127 controls (17 Level 1 + 110 Level 2)!**

