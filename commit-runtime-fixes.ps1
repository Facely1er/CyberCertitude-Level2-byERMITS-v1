# PowerShell script to commit runtime error fixes
# Run this script from the project root directory

Write-Host "🚀 Committing Runtime Error Fixes" -ForegroundColor Cyan
Write-Host ""

# Check if git is available
try {
    $gitVersion = git --version
    Write-Host "✅ Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git not found. Please install Git or use Git GUI/VS Code" -ForegroundColor Red
    exit 1
}

# Check if we're in a git repository
if (-not (Test-Path .git)) {
    Write-Host "❌ Not a git repository. Please run from project root." -ForegroundColor Red
    exit 1
}

# Show current status
Write-Host "📊 Current Git Status:" -ForegroundColor Yellow
git status --short

Write-Host ""
Write-Host "📝 Staging all changes..." -ForegroundColor Yellow
git add .

# Check if there are changes to commit
$changes = git diff --cached --name-only
if ($changes.Count -eq 0) {
    Write-Host "⚠️  No changes to commit." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "✅ Changes staged:" -ForegroundColor Green
git diff --cached --name-only | ForEach-Object { Write-Host "   - $_" }

Write-Host ""
Write-Host "💾 Committing changes..." -ForegroundColor Yellow

$commitMessage = @"
fix: resolve critical runtime errors and improve null safety

- Add date validation utilities and fix date operations
- Add null checks for responses, statistics, and riskDistribution objects
- Fix DOM element validation in main.tsx
- Remove unused variables and imports
- Improve defensive programming patterns across components

Fixes runtime errors in:
- AdvancedDashboard.tsx (date operations, null checks)
- EvidenceCollectionDashboard.tsx (statistics null checks)
- main.tsx (DOM element validation)

Adds new utility:
- src/utils/dateUtils.ts (comprehensive date validation)
"@

git commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Commit successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📤 Push to remote?" -ForegroundColor Yellow
    $push = Read-Host "Push to origin/main? (y/n)"
    
    if ($push -eq "y" -or $push -eq "Y") {
        Write-Host ""
        Write-Host "🚀 Pushing to origin/main..." -ForegroundColor Yellow
        git push origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Successfully pushed to origin/main!" -ForegroundColor Green
            Write-Host ""
            Write-Host "🎉 Deployment should trigger automatically if connected to Vercel/Netlify" -ForegroundColor Cyan
        } else {
            Write-Host ""
            Write-Host "❌ Push failed. Please check your remote configuration." -ForegroundColor Red
        }
    } else {
        Write-Host ""
        Write-Host "⚠️  Changes committed locally. Push manually when ready:" -ForegroundColor Yellow
        Write-Host "   git push origin main" -ForegroundColor Cyan
    }
} else {
    Write-Host ""
    Write-Host "Commit failed. Please check the error above." -ForegroundColor Red
    exit 1
}

