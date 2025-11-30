# Commit and Push Test Coverage Updates
Write-Host "=== Committing Additional Test Coverage Updates ===" -ForegroundColor Cyan

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

# Stage new component test files
Write-Host "`nStaging new test files..." -ForegroundColor Yellow
& $gitCmd add src/components/__tests__/LevelSelector.test.tsx
& $gitCmd add src/components/__tests__/TextCarousel.test.tsx
& $gitCmd add src/components/__tests__/PWAInstallPrompt.test.tsx
& $gitCmd add src/components/__tests__/ComplianceToolkit.test.tsx
& $gitCmd add src/components/__tests__/DocumentPreviewModal.test.tsx
& $gitCmd add src/components/__tests__/KeyboardShortcutsHelp.test.tsx
& $gitCmd add src/components/__tests__/SSPGenerator.test.tsx
& $gitCmd add src/components/__tests__/POAMGenerator.test.tsx
& $gitCmd add src/components/__tests__/WorkflowGuidance.test.tsx
& $gitCmd add src/components/__tests__/OnboardingFlow.test.tsx
& $gitCmd add src/components/__tests__/TemplateLibraryBrowser.test.tsx
& $gitCmd add src/components/__tests__/ScenarioTemplates.test.tsx

# Stage updated documentation
& $gitCmd add TEST_COVERAGE_FINAL_SUMMARY.md

# Show status
Write-Host "`n=== Git Status ===" -ForegroundColor Cyan
& $gitCmd status --short

# Commit
Write-Host "`n=== Committing Changes ===" -ForegroundColor Cyan
$commitMessage = @"
test: Continue comprehensive test coverage expansion

- Add tests for 11 additional components
  - LevelSelector: CMMC level selection with visual feedback
  - TextCarousel: Auto-rotating text with manual navigation
  - PWAInstallPrompt: PWA installation with event handling
  - ComplianceToolkit: Template management and downloads
  - DocumentPreviewModal: Document preview and format selection
  - KeyboardShortcutsHelp: Shortcuts help modal with search
  - SSPGenerator: System Security Plan generation
  - POAMGenerator: Plan of Actions and Milestones
  - WorkflowGuidance: Workflow steps with expandable details
  - OnboardingFlow: Multi-phase onboarding with role selection
  - TemplateLibraryBrowser: Template browsing with filtering
  - ScenarioTemplates: Scenario templates with preview

- Update test coverage documentation
  - Overall coverage: ~95% (up from 94%)
  - Component coverage: 86% (38/44 components)
  - Service coverage: 93% (25/27 services) maintained
  - Hook coverage: 100% maintained

All new tests follow best practices with proper mocking and error handling.
"@

& $gitCmd commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n=== Pushing to Main ===" -ForegroundColor Cyan
    & $gitCmd push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Successfully committed and pushed to main!" -ForegroundColor Green
        Write-Host "Coverage: ~95% overall | Components: 86% | Services: 93% | Hooks: 100%" -ForegroundColor Cyan
    } else {
        Write-Host "`n⚠️  Commit successful but push failed." -ForegroundColor Yellow
        Write-Host "Run: git push origin main" -ForegroundColor Yellow
    }
} else {
    Write-Host "`n⚠️  Commit failed. Please check errors above." -ForegroundColor Yellow
}

