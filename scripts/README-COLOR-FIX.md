# Automated Color Replacement Script

## Overview

This script automatically replaces hardcoded Tailwind color classes with design tokens to ensure consistency across the codebase.

## Usage

### Dry Run (Preview Changes)
```bash
npm run fix:colors:dry-run
```

### Apply Changes to All Files
```bash
npm run fix:colors
```

### Target Specific Directory
```bash
# Dry run on specific directory
node scripts/fix-hardcoded-colors.js --dry-run --path=src/components

# Apply changes to specific directory
node scripts/fix-hardcoded-colors.js --path=src/features
```

## What It Does

The script replaces:
- **Gray colors** → Design tokens (surface, background, support, text)
- **Blue colors** → Primary design tokens
- **Red colors** → Error design tokens
- **Green colors** → Success design tokens
- **Dark mode variants** → Proper dark mode design tokens

## Color Mappings

### Background Colors
- `bg-white` → `bg-surface-light`
- `bg-gray-800` → `bg-surface-dark`
- `bg-blue-600` → `bg-primary-600`
- `bg-red-500` → `bg-error-500`
- `bg-green-600` → `bg-success-600`

### Text Colors
- `text-gray-900` → `text-text-primary-light`
- `text-gray-600` → `text-text-secondary-light`
- `text-blue-600` → `text-primary-600`
- `text-red-500` → `text-error-500`

### Border Colors
- `border-gray-300` → `border-support-light`
- `border-gray-700` → `border-support-dark`
- `border-blue-500` → `border-primary-500`

### Focus States
- `focus:ring-blue-500` → `focus:ring-primary-500`

## Safety Features

1. **Dry Run Mode**: Preview changes before applying
2. **Backup Recommended**: Always commit before running
3. **Selective Processing**: Target specific directories
4. **Detailed Reporting**: Shows exactly what was changed

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

## Best Practices

1. **Always run dry-run first** to see what will change
2. **Commit your work** before running the script
3. **Review changes** after running the script
4. **Test your application** to ensure everything works
5. **Run TypeScript check**: `npm run type-check`
6. **Run linter**: `npm run lint`

## Limitations

- The script uses pattern matching, so review complex cases manually
- Some edge cases may need manual adjustment
- Always test after running the script

## Troubleshooting

If you encounter issues:
1. Check that Node.js is installed
2. Ensure you're in the project root directory
3. Verify the target path exists
4. Review the script output for errors

