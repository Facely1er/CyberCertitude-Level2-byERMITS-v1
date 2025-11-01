# PowerShell script to commit and push runtime error testing changes

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Committing Runtime Error Testing Changes" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Try to find git
$gitPath = $null
$possiblePaths = @(
    "C:\Program Files\Git\bin\git.exe",
    "C:\Program Files (x86)\Git\bin\git.exe",
    "C:\Program Files\Git\cmd\git.exe",
    "git"
)

foreach ($path in $possiblePaths) {
    try {
        if ($path -eq "git") {
            $gitCmd = Get-Command git -ErrorAction Stop
            $gitPath = $gitCmd.Source
            break
        } else {
            if (Test-Path $path) {
                $gitPath = $path
                break
            }
        }
    } catch {
        continue
    }
}

if ($null -eq $gitPath) {
    Write-Host "Git not found in PATH. Please use one of these options:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option 1: VS Code (Easiest)" -ForegroundColor Cyan
    Write-Host "  1. Press Ctrl+Shift+G" -ForegroundColor White
    Write-Host "  2. Stage all changes (Ctrl+A in Source Control)" -ForegroundColor White
    Write-Host "  3. Enter commit message and click 'Commit'" -ForegroundColor White
    Write-Host "  4. Click 'Push' button" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 2: Install Git" -ForegroundColor Cyan
    Write-Host "  Download: https://git-scm.com/download/win" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 3: Use GitHub Desktop" -ForegroundColor Cyan
    Write-Host "  Download: https://desktop.github.com/" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "Found Git at: $gitPath" -ForegroundColor Green
Write-Host ""

# Show current status
Write-Host "Checking current status..." -ForegroundColor Yellow
& $gitPath status --short
Write-Host ""

# Stage all changes
Write-Host "Staging all changes..." -ForegroundColor Yellow
& $gitPath add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to stage changes." -ForegroundColor Red
    exit 1
}

# Commit with message
Write-Host ""
Write-Host "Committing changes..." -ForegroundColor Yellow
$commitMessage = @"
test: Add comprehensive runtime error testing suite

- Add 36 runtime error tests covering all edge cases
- Create date utility functions for safe date operations
- Fix date operations in AssessmentReportsPage.tsx
- Add null safety checks for date, array, and object operations
- Test async error handling, DOM operations, and service errors
- Test type safety, calculations, and edge cases

Test Coverage:
- Date Operations: 6 tests (null/undefined, invalid dates, sorting)
- Array Operations: 5 tests (undefined/null arrays, filtering)
- Object Operations: 5 tests (nested properties, null checks)
- Async Operations: 4 tests (promise rejections, error handling)
- DOM Operations: 3 tests (element validation)
- Service Operations: 3 tests (service failures, response validation)
- Type Safety: 2 tests (structure validation, type mismatches)
- Calculation Operations: 4 tests (division by zero, NaN handling)
- Edge Cases: 4 tests (empty states, nested nulls, large arrays)

Files added:
- src/test/__tests__/runtimeErrors.test.ts (36 tests)
- src/utils/dateUtils.ts (date utility functions)
- RUNTIME_ERROR_TESTS_SUMMARY.md (documentation)

Files modified:
- src/features/reporting/components/AssessmentReportsPage.tsx (fixed date null checks)

All 36 tests passing ✅
"@

& $gitPath commit -m $commitMessage
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to commit changes." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✓ Commit successful!" -ForegroundColor Green
Write-Host ""

# Push to main
Write-Host "Pushing to origin/main..." -ForegroundColor Yellow
& $gitPath push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✓ Successfully pushed to main!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your runtime error testing changes have been pushed." -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "✗ Push failed" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Try using VS Code instead:" -ForegroundColor Cyan
    Write-Host "  Press Ctrl+Shift+G and click 'Push'" -ForegroundColor White
    Write-Host ""
    exit 1
}

