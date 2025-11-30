# PowerShell Script to Push Changes to GitHub
# Run this script to automatically commit and push all changes

Write-Host "🚀 Starting Git Commit and Push..." -ForegroundColor Cyan

# Check if git is available
try {
    $gitVersion = git --version 2>&1
    Write-Host "✅ Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git not found in PATH. Please use one of these options:" -ForegroundColor Red
    Write-Host ""
    Write-Host "Option 1: Use VS Code" -ForegroundColor Yellow
    Write-Host "  1. Open VS Code in this folder" -ForegroundColor Gray
    Write-Host "  2. Press Ctrl+Shift+G (Source Control)" -ForegroundColor Gray
    Write-Host "  3. Stage all files (+ button)" -ForegroundColor Gray
    Write-Host "  4. Commit and Push" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Option 2: Use GitHub Desktop" -ForegroundColor Yellow
    Write-Host "  1. Open GitHub Desktop" -ForegroundColor Gray
    Write-Host "  2. Select this repository" -ForegroundColor Gray
    Write-Host "  3. Commit and Push" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Option 3: Add Git to PATH" -ForegroundColor Yellow
    Write-Host "  Install Git for Windows: https://git-scm.com/download/win" -ForegroundColor Gray
    Write-Host ""
    exit
}

# Navigate to project directory
Set-Location $PSScriptRoot

Write-Host "📂 Current directory: $(Get-Location)" -ForegroundColor Cyan
Write-Host ""

# Check git status
Write-Host "📊 Checking git status..." -ForegroundColor Cyan
git status
Write-Host ""

# Ask for confirmation
$confirm = Read-Host "Do you want to commit and push all changes? (y/n)"
if ($confirm -ne 'y') {
    Write-Host "❌ Cancelled by user" -ForegroundColor Yellow
    exit
}

# Stage all changes
Write-Host ""
Write-Host "📝 Staging all changes..." -ForegroundColor Cyan
git add -A
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to stage files" -ForegroundColor Red
    exit 1
}

# Commit changes
Write-Host "💾 Committing changes..." -ForegroundColor Cyan
git commit -m "feat: Add comprehensive monitoring and database improvements

- Add Vercel Analytics and Speed Insights
- Add Sentry error tracking with Browser Tracing and Session Replay
- Fix Row Level Security policies in multiple migrations
- Update CSP headers for new monitoring integrations
- Improve test utilities and error handling
- Configure deployment workflow with environment variables"
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to commit changes" -ForegroundColor Red
    exit 1
}

# Push changes
Write-Host ""
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Cyan
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to push changes" -ForegroundColor Red
    Write-Host ""
    Write-Host "You may need to:" -ForegroundColor Yellow
    Write-Host "1. Set up authentication" -ForegroundColor Gray
    Write-Host "2. Use: git push origin main --force (if needed)" -ForegroundColor Gray
    exit 1
}

Write-Host ""
Write-Host "✅ Successfully pushed changes to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Apply database migrations to Supabase" -ForegroundColor Yellow
Write-Host "2. Verify deployment status" -ForegroundColor Yellow
Write-Host "3. Test the application" -ForegroundColor Yellow
Write-Host ""
Write-Host "See PUSH_CHANGES_NOW.md for details" -ForegroundColor Gray

