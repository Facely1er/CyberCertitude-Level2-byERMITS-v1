# 🎨 Automated Color Replacement Script Guide

## Quick Start

### Preview Changes (Dry Run)
```bash
npm run fix:colors:dry-run
```

### Apply Changes
```bash
npm run fix:colors
```

### Target Specific Directory
```bash
# Components only
node scripts/fix-hardcoded-colors.js --path=src/components

# Features only
node scripts/fix-hardcoded-colors.js --path=src/features

# Single file
node scripts/fix-hardcoded-colors.js --path=src/components/ErrorBoundary.tsx
```

## What the Script Does

Automatically replaces **2,450+ hardcoded color instances** with design tokens:

### Color Mappings

| Hardcoded | Design Token | Usage |
|-----------|--------------|-------|
| `bg-white` | `bg-surface-light` | Light backgrounds |
| `bg-gray-800` | `bg-surface-dark` | Dark backgrounds |
| `bg-blue-600` | `bg-primary-600` | Primary buttons/accents |
| `text-gray-900` | `text-text-primary-light` | Primary text |
| `text-gray-600` | `text-text-secondary-light` | Secondary text |
| `border-gray-300` | `border-support-light` | Borders |
| `focus:ring-blue-500` | `focus:ring-primary-500` | Focus states |
| `bg-red-500` | `bg-error-500` | Error states |
| `bg-green-600` | `bg-success-600` | Success states |

## Current Status

### ✅ Already Fixed (Manual)
- `TemplateCustomizationModal.tsx` - Complete
- `LoginPage.tsx` - Complete (23 instances)
- `AuthGuard.tsx` - Complete (14 instances)

### 📊 Script Results (Dry Run)
- **Components Directory**: 2,450 replacements across 34 files
- **Top Files to Fix**:
  - `ComplianceWorkflow.tsx`: 294 replacements
  - `InteractiveUserManual.tsx`: 217 replacements
  - `CMMCOnboardingFlow.tsx`: 205 replacements
  - `AssetManagementModal.tsx`: 192 replacements
  - `SSPGenerator.tsx`: 189 replacements

### 📈 Remaining Work
- **Components**: ~2,450 instances (ready to fix)
- **Features**: ~2,950 instances (ready to fix)
- **Total**: ~5,400 instances

## Recommended Workflow

### Step 1: Preview Changes
```bash
npm run fix:colors:dry-run
```

### Step 2: Review Output
Check the summary to see what will be changed.

### Step 3: Commit Current Work
```bash
git add .
git commit -m "WIP: Before automated color fixes"
```

### Step 4: Apply Changes
```bash
# Fix components first
node scripts/fix-hardcoded-colors.js --path=src/components

# Then fix features
node scripts/fix-hardcoded-colors.js --path=src/features
```

### Step 5: Verify
```bash
npm run type-check
npm run lint
npm run build
```

### Step 6: Test
- Test the application in both light and dark modes
- Verify all components render correctly
- Check for any visual regressions

## Safety Features

✅ **Dry Run Mode**: Preview before applying  
✅ **Selective Processing**: Target specific directories  
✅ **Detailed Reporting**: See exactly what changed  
✅ **Idempotent**: Safe to run multiple times  

## Example Output

```
🎨 Automated Color Replacement Script

Mode: DRY RUN (no files will be modified)
Target path: src/components

Found 67 files to process...

============================================================
📊 Results Summary
============================================================
Files processed: 67
Files modified: 34
Total replacements: 2450

📝 Modified Files:
  src/components/ComplianceWorkflow.tsx: 294 replacements
  src/components/InteractiveUserManual.tsx: 217 replacements
  ...
```

## Next Steps

1. **Run dry-run** to see what will change
2. **Commit your work** before running
3. **Apply fixes** to components directory
4. **Test thoroughly** after changes
5. **Apply fixes** to features directory
6. **Final verification** and commit

## Notes

- The script is **safe to run multiple times** (idempotent)
- Always **test after running** the script
- Some **edge cases may need manual review**
- **Dark mode** will work better after fixes

