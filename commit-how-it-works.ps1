# Commit and Push How It Works Page Implementation
Write-Host "=== Committing How It Works Page Updates ===" -ForegroundColor Cyan

# Try to find git
$gitCmd = $null
$gitPaths = @(
    "C:\Program Files\Git\bin\git.exe",
    "${env:ProgramFiles}\Git\bin\git.exe",
    "${env:ProgramFiles(x86)}\Git\bin\git.exe",
    "C:\Program Files\Git\cmd\git.exe"
)

foreach ($path in $gitPaths) {
    if (Test-Path $path) {
        $gitCmd = $path
        Write-Host "Found git at: $gitCmd" -ForegroundColor Green
        break
    }
}

if (-not $gitCmd) {
    try {
        $null = Get-Command git -ErrorAction Stop
        $gitCmd = "git"
        Write-Host "Using git from PATH" -ForegroundColor Green
    } catch {
        Write-Host "Git not found. Please commit manually using your IDE." -ForegroundColor Yellow
        exit 1
    }
}

# Stage changed files
Write-Host "`nStaging changed files..." -ForegroundColor Yellow
& $gitCmd add src/components/HowItWorks.tsx
& $gitCmd add src/components/WorkflowGuidance.tsx
& $gitCmd add src/routes/index.tsx
& $gitCmd add src/config/navigation.ts
& $gitCmd add CONTENT_REDUNDANCY_ANALYSIS.md

# Show status
Write-Host "`n=== Git Status ===" -ForegroundColor Cyan
& $gitCmd status --short

# Commit
Write-Host "`n=== Committing Changes ===" -ForegroundColor Cyan
$commitMessage = @"
feat: Complete How It Works page with clear content differentiation

- Add comprehensive How It Works page at /how-it-works
  - High-level marketing/overview focused content
  - Platform capabilities and benefits sections
  - Quick start guide for new users
  - 8-step journey overview with summaries
  - Call-to-action sections

- Reduce content redundancy with WorkflowGuidance
  - Simplified process steps to high-level summaries
  - Removed detailed activities/deliverables (moved to WorkflowGuidance)
  - Added cross-references between pages
  - Clear differentiation: overview vs. implementation guide

- Update WorkflowGuidance component
  - Add cross-reference to How It Works page
  - Maintain detailed implementation guidance with tips/prerequisites

- Navigation updates
  - Add How It Works to main navigation menu
  - Add route configuration

- Documentation
  - Add CONTENT_REDUNDANCY_ANALYSIS.md with detailed comparison
  - Clarify purpose and audience for each page

Content differentiation:
- How It Works: Marketing/overview for prospects and new users
- WorkflowGuidance: Detailed implementation guide for active users
- Redundancy reduced from ~85% to ~30%

All linting errors resolved.
"@

& $gitCmd commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n=== Pushing to Main ===" -ForegroundColor Cyan
    & $gitCmd push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Successfully committed and pushed to main!" -ForegroundColor Green
        Write-Host "Commit includes: How It Works page + redundancy reduction + navigation updates" -ForegroundColor Cyan
    } else {
        Write-Host "`n⚠️  Commit successful but push failed." -ForegroundColor Yellow
        Write-Host "Run: git push origin main" -ForegroundColor Yellow
    }
} else {
    Write-Host "`n⚠️  Commit failed. Please check errors above." -ForegroundColor Yellow
}

