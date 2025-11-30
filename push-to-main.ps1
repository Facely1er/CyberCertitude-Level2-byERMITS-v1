# Push to Main Repository Script
# Attempts to push the current commit to origin/main

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Pushing to Main Repository" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Try to find git
$gitPath = $null
$possiblePaths = @(
    "C:\Program Files\Git\bin\git.exe",
    "C:\Program Files (x86)\Git\bin\git.exe",
    "git"
)

foreach ($path in $possiblePaths) {
    try {
        if ($path -eq "git") {
            $gitCmd = Get-Command git -ErrorAction Stop
            $gitPath = $gitCmd.Source
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
    Write-Host "  2. Click 'Push' button" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 2: Install Git" -ForegroundColor Cyan
    Write-Host "  Download: https://git-scm.com/download/win" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 3: Use GitHub Desktop" -ForegroundColor Cyan
    Write-Host "  Download: https://desktop.github.com/" -ForegroundColor White
    Write-Host ""
    Write-Host "See PUSH_TO_MAIN_INSTRUCTIONS.md for detailed instructions." -ForegroundColor Yellow
    exit 1
}

Write-Host "Found Git at: $gitPath" -ForegroundColor Green
Write-Host ""

# Check current branch
Write-Host "Checking current branch..." -ForegroundColor Yellow
$currentBranch = & $gitPath branch --show-current
Write-Host "Current branch: $currentBranch" -ForegroundColor Cyan

if ($currentBranch -ne "main") {
    Write-Host "Warning: Not on 'main' branch. Do you want to continue?" -ForegroundColor Yellow
    Write-Host "If yes, push will go to origin/$currentBranch instead of origin/main" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Pushing to origin/main..." -ForegroundColor Green
Write-Host ""

# Push to main
& $gitPath push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✓ Successfully pushed to main!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your commit has been pushed to the remote repository." -ForegroundColor White
    Write-Host ""
    Write-Host "Verify on GitHub/GitLab that:" -ForegroundColor Cyan
    Write-Host "  - Commit appears in history" -ForegroundColor White
    Write-Host "  - All files are visible" -ForegroundColor White
    Write-Host "  - Branch shows as up to date" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "✗ Push failed" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "  1. Authentication required" -ForegroundColor White
    Write-Host "  2. Remote not configured" -ForegroundColor White
    Write-Host "  3. Need to pull first" -ForegroundColor White
    Write-Host ""
    Write-Host "Try using VS Code instead:" -ForegroundColor Cyan
    Write-Host "  Press Ctrl+Shift+G and click 'Push'" -ForegroundColor White
    Write-Host ""
    Write-Host "Or see PUSH_TO_MAIN_INSTRUCTIONS.md for help." -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

