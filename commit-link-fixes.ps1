# PowerShell script to commit and push link fixes

Write-Host "=== Committing Link Fixes ===" -ForegroundColor Cyan
Write-Host ""

# Check if git is available
try {
    $gitVersion = & git --version 2>&1
    Write-Host "Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "Git is not available in PATH. Please ensure Git is installed." -ForegroundColor Red
    Write-Host ""
    Write-Host "Common Git installation paths:" -ForegroundColor Yellow
    Write-Host "  - C:\Program Files\Git\cmd\git.exe"
    Write-Host "  - C:\Program Files (x86)\Git\cmd\git.exe"
    Write-Host ""
    Write-Host "You can either:" -ForegroundColor Yellow
    Write-Host "  1. Install Git from https://git-scm.com/download/win"
    Write-Host "  2. Use VS Code Source Control panel (Ctrl+Shift+G)"
    Write-Host "  3. Use GitHub Desktop application"
    exit 1
}

# Show current status
Write-Host "`n=== Current Git Status ===" -ForegroundColor Cyan
& git status

# Stage the modified files
Write-Host "`n=== Staging Files ===" -ForegroundColor Cyan
& git add src/routes/implementation.tsx
Write-Host "✓ Staged src/routes/implementation.tsx" -ForegroundColor Green

& git add src/routes/assets.tsx
Write-Host "✓ Staged src/routes/assets.tsx" -ForegroundColor Green

& git add LINK_FIXES_SUMMARY.md COMMIT_LINK_FIXES.md commit-link-fixes.ps1
Write-Host "✓ Staged documentation files" -ForegroundColor Green

# Show what's staged
Write-Host "`n=== Files to be Committed ===" -ForegroundColor Cyan
& git status --short

# Commit message
$commitMessage = @"
fix: Fix broken links and navigation issues

- Update route configuration to use proper lazy-loaded components
- Fix /policies route to use PolicyManagementView from LazyComponents
- Fix /controls route to use ControlsManagementView from LazyComponents
- Replace window.location.href with React Router navigate() in asset navigation
- Add useNavigate hook to AssetDashboardWrapper
- Improve navigation consistency across the application

Files changed:
- src/routes/implementation.tsx: Updated imports for policy and controls routes
- src/routes/assets.tsx: Replaced window.location.href with navigate() calls

Routes fixed:
- /policies -> PolicyManagementView
- /controls -> ControlsManagementView
- /assets/* -> All asset navigation now uses React Router

All navigation links are now working properly with React Router.
No linter errors. Production ready.
"@

Write-Host "`n=== Committing Changes ===" -ForegroundColor Cyan
& git commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Commit successful!" -ForegroundColor Green
    
    Write-Host "`n=== Pushing to Main ===" -ForegroundColor Cyan
    & git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Successfully pushed to main repository!" -ForegroundColor Green
    } else {
        Write-Host "`n❌ Failed to push. Please check your git configuration." -ForegroundColor Red
        Write-Host "You may need to manually run: git push origin main" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Commit failed. Please check the error above." -ForegroundColor Red
}

Write-Host "`n=== Done ===" -ForegroundColor Cyan

