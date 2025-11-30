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
    Write-Host ""
    Write-Host "Please use one of these methods:" -ForegroundColor Yellow
    Write-Host "  1. Open VS Code and use Source Control panel (Ctrl+Shift+G)" -ForegroundColor Yellow
    Write-Host "  2. Install Git from https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "  3. Use GitHub Desktop application" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Or run these commands manually in Git Bash or terminal:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "# Stage all changes" -ForegroundColor Green
    Write-Host "git add -A" -ForegroundColor White
    Write-Host ""
    Write-Host "# Commit" -ForegroundColor Green
    Get-Content "COMMIT_RUNTIME_ERROR_FIXES.txt" | ForEach-Object {
        Write-Host "git commit -m `"$_`"" -ForegroundColor White
    }
    Write-Host ""
    Write-Host "# Push" -ForegroundColor Green
    Write-Host "git push origin main" -ForegroundColor White
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

$commitMessage = Get-Content "COMMIT_RUNTIME_ERROR_FIXES.txt" -Raw

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
    Write-Host "❌ Commit failed. Please check the error above." -ForegroundColor Red
    exit 1
}

