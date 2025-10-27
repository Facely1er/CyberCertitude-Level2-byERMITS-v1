# Git Commit Instructions

## Current Status

### Modified Files (Ready to Commit):
- `.env.example`
- `.github/workflows/deploy.yml`
- `COMMIT_NOW.md`
- `netlify.toml`
- `package-lock.json`
- `package.json`
- `src/features/assessment/components/AdvancedDashboard.tsx`
- `src/features/assets/components/AssetDetailView.tsx`
- `src/features/assets/components/AssetInventoryView.tsx`
- `src/features/reporting/components/AssessmentReportsPage.tsx`
- `src/features/tasks/components/TaskManagementDashboard.tsx`
- `src/features/technical-tools/components/SecurityControlMapper.tsx`
- `src/lib/errorMonitoring.tsx`
- `src/main.tsx`
- `src/shared/types/assets.ts`
- `supabase/migrations/002_cmmc_framework_data.sql`
- `supabase/migrations/003_project_templates.sql`
- `tsconfig.app.json`
- `vercel.json`

### Deleted Files:
- `src/test/testUtils.ts`

### Untracked Files (Need to Add):
- Migration files in `supabase/migrations/`
- New test utilities: `src/test/testUtils.tsx`
- Various documentation files
- Several status and instruction markdown files

## Recommended Commit Strategy

### Option 1: Single Commit (Recommended)

Stage everything and commit with a comprehensive message:

```bash
# Stage all modified, deleted, and new files
git add -A

# Create a comprehensive commit
git commit -m "feat: Add comprehensive monitoring and database improvements

- Add Vercel Analytics and Speed Insights for performance monitoring
- Add Sentry error tracking with Browser Tracing and Session Replay
- Fix Row Level Security policies and performance issues
- Add multiple database migrations for controls and subscriptions
- Update test utilities with accessibility and security testing
- Configure deployment workflow with proper environment variables
- Update CSP headers for new monitoring integrations

All critical monitoring and database fixes are complete."

# Push to GitHub
git push origin main
```

### Option 2: Separate Commits (More Granular)

```bash
# 1. Commit monitoring improvements
git add src/main.tsx src/lib/errorMonitoring.tsx package.json package-lock.json vercel.json netlify.toml
git commit -m "feat: Add comprehensive monitoring (Analytics, Speed Insights, Sentry)"

# 2. Commit database migrations
git add supabase/migrations/*.sql
git commit -m "feat: Add database migrations for controls and RLS improvements"

# 3. Commit test improvements
git add src/test/
git commit -m "refactor: Improve test utilities with accessibility and security testing"

# 4. Commit deployment configuration
git add .github/workflows/deploy.yml
git commit -m "ci: Update deployment workflow with environment variables"

# 5. Push all commits
git push origin main
```

## What Happens After Commit

### Automatic Deployments:
1. **GitHub Actions** will trigger (if configured)
2. **Netlify** will deploy automatically (if connected)
3. **Vercel** will deploy automatically (if connected via GitHub integration)

### Manual Steps Required:

#### 1. Apply Database Migrations ⚠️ CRITICAL

Go to Supabase Dashboard and run these migrations in order:

```sql
-- Run via Supabase SQL Editor
-- Files to apply (in order):
1. supabase/migrations/006_complete_110_cmmc_level2_controls.sql
2. supabase/migrations/006_fix_rls_performance.sql
3. supabase/migrations/007_add_level1_controls_clean.sql
4. supabase/migrations/008_clean_and_fix_counts.sql
5. supabase/migrations/009_fix_multiple_permissive_policies.sql
6. supabase/migrations/010_fix_final_rls_warnings.sql
7. supabase/migrations/011_fix_function_search_path.sql
8. supabase/migrations/012_fix_search_path_with_alter.sql
9. supabase/migrations/013_create_subscription_tables.sql
```

#### 2. Verify Environment Variables

Ensure these are set in your deployment platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `NODE_ENV=production`

#### 3. Monitor Deployment

After pushing:
- Check GitHub Actions status
- Monitor deployment in Netlify/Vercel dashboard
- Watch for any build errors
- Test production application

## Quick Commit (PowerShell)

If you're running PowerShell in the project directory:

```powershell
# Stage all changes
git add -A

# Commit with comprehensive message
git commit -m "feat: Add comprehensive monitoring and database improvements" -m "- Add Vercel Analytics and Speed Insights" -m "- Add Sentry error tracking" -m "- Fix RLS policies and migrations" -m "- Update test utilities and deployment config"

# Push to GitHub
git push origin main
```

## Troubleshooting

### Issue: "git is not recognized"
**Solution:** Git needs to be in your PATH. Either:
- Use Git Bash instead of PowerShell
- Use VS Code's integrated terminal
- Use GitHub Desktop GUI

### Issue: Merge Conflicts
**Solution:**
```bash
# Pull latest changes first
git pull origin main

# If conflicts occur, resolve them manually
# Then commit and push
git push origin main
```

### Issue: Deployment Fails
**Solution:** Check:
1. Environment variables are set correctly
2. Build command matches package.json
3. Node version matches `.nvmrc` or package.json
4. No syntax errors in code

## Summary

✅ **Ready to Commit:**
- All code changes reviewed and tested
- No linting errors
- Monitoring integrated
- Deployment configured

⏭️ **Next Steps:**
1. Run the git commands above
2. Apply database migrations to Supabase
3. Verify deployment succeeds
4. Test production application

**Estimated Time:** 5-10 minutes for commit + 10 minutes for migrations

