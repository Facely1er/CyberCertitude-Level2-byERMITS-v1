# Commit Instructions for Visual Balance Fix

## Summary of Changes

All visual balance and header layout improvements have been completed. The following 9 files have been modified:

1. ✅ `src/components/PlaceholderPages.tsx` - Removed onBack props, added Coming Soon badges
2. ✅ `src/features/assets/components/AssetDashboard.tsx` - Removed Back link
3. ✅ `src/routes/assets.tsx` - Added Coming Soon badges to all 5 placeholder pages
4. ✅ `src/features/reporting/components/AssessmentReportsPage.tsx` - Fixed header balance
5. ✅ `src/features/reporting/components/AdvancedReportingDashboard.tsx` - Fixed header balance
6. ✅ `src/features/reporting/components/ReportView.tsx` - Improved header structure
7. ✅ `src/features/audit/components/ComplianceDashboard.tsx` - Removed back button
8. ✅ `src/features/audit/components/EvidenceCollector.tsx` - Removed back button
9. ✅ `src/features/assessment/components/EnhancedAssessmentView.tsx` - Fixed error state

## To Commit These Changes

Open your Git client (GitHub Desktop, VS Code, or command terminal) and run:

```bash
git add .
git commit -m "fix: standardize header layouts for visual balance across all pages

- Remove 'Back to Dashboard' links from all page headers
- Add 'Coming Soon' badges to placeholder pages for visual completeness
- Standardize header layout to icon + title on left, actions/badge on right
- Fix visual imbalance issues with consistent flex layouts
- Remove unused imports (ChevronLeft, ArrowLeft)
- Update 9 files for consistent header design pattern"

git push origin main
```

## What Changed

### Visual Improvements
- ✅ Consistent header layout across all pages
- ✅ Icon + Title/Description on left, actions/badge on right
- ✅ Removed all "Back to Dashboard" links (breadcrumbs handle navigation)
- ✅ Added "Coming Soon" badges to placeholder pages
- ✅ Proper visual balance with `justify-between` layout
- ✅ All changes maintain dark mode support

### Technical Changes
- ✅ Removed unused imports (ChevronLeft, ArrowLeft, Link where not needed)
- ✅ Fixed all linter warnings
- ✅ No breaking changes - component interfaces maintained for backward compatibility

## Files Ready for Review

All modified files are in your working directory and ready to commit:
- `src/components/PlaceholderPages.tsx`
- `src/features/assets/components/AssetDashboard.tsx`
- `src/routes/assets.tsx`
- `src/features/reporting/components/AssessmentReportsPage.tsx`
- `src/features/reporting/components/AdvancedReportingDashboard.tsx`
- `src/features/reporting/components/ReportView.tsx`
- `src/features/audit/components/ComplianceDashboard.tsx`
- `src/features/audit/components/EvidenceCollector.tsx`
- `src/features/assessment/components/EnhancedAssessmentView.tsx`

## Reference Documentation

See `VISUAL_BALANCE_FIX_SUMMARY.md` for detailed implementation notes and patterns applied.

