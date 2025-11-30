# Visual Balance Fix - Commit Script
# This script commits the visual balance improvements

Write-Host "=" -Repeat 60
Write-Host "Visual Balance and Header Layout Fix"
Write-Host "=" -Repeat 60
Write-Host ""

# Check if git is available
$gitCmd = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitCmd) {
    Write-Host "Git is not available in PATH"
    Write-Host ""
    Write-Host "Please run these commands manually in your Git client or terminal:"
    Write-Host ""
    Write-Host 'git add .'
    Write-Host 'git commit -m "fix: standardize header layouts for visual balance across all pages"'
    Write-Host 'git commit -m ""'
    Write-Host '- Remove Back to Dashboard links from all page headers'
    Write-Host '- Add Coming Soon badges to placeholder pages for visual completeness'
    Write-Host '- Standardize header layout to icon + title on left, actions/badge on right'
    Write-Host '- Fix visual imbalance issues with consistent flex layouts'
    Write-Host '- Remove unused imports (ChevronLeft, ArrowLeft)'
    Write-Host '- Update 9 files for consistent header design pattern"'
    Write-Host 'git push origin main'
    Write-Host ""
    exit 0
}

Write-Host "Staging changes..."
& git add .

Write-Host ""
Write-Host "Files to be committed:"
& git status --short

Write-Host ""
Write-Host "Creating commit..."
& git commit -m "fix: standardize header layouts for visual balance across all pages

- Remove 'Back to Dashboard' links from all page headers
- Add 'Coming Soon' badges to placeholder pages for visual completeness
- Standardize header layout to icon + title on left, actions/badge on right
- Fix visual imbalance issues with consistent flex layouts
- Remove unused imports (ChevronLeft, ArrowLeft)
- Update 9 files for consistent header design pattern"

Write-Host ""
Write-Host "Commit created successfully!"
Write-Host ""
Write-Host "To push to remote, run:"
Write-Host "  git push origin main"

