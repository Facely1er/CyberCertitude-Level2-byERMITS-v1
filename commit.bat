@echo off
echo ================================================================================
echo COMMIT RUNTIME ERROR FIXES
echo ================================================================================
echo.

REM Check if git is available
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not found in PATH.
    echo.
    echo Please either:
    echo 1. Install Git for Windows from https://git-scm.com/download/win
    echo 2. Use VS Code Source Control panel (Ctrl+Shift+G)
    echo 3. Use GitHub Desktop application
    echo.
    echo See COMMIT_NOW.txt for detailed instructions.
    pause
    exit /b 1
)

echo Git found. Proceeding with commit...
echo.

REM Show current status
echo Current changes:
git status --short
echo.

REM Stage all changes
echo Staging all changes...
git add .
if %errorlevel% neq 0 (
    echo ERROR: Failed to stage changes.
    pause
    exit /b 1
)

REM Commit with message
echo.
echo Committing changes...
git commit -m "fix: resolve critical runtime errors and improve null safety

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
- src/utils/dateUtils.ts (comprehensive date validation)"

if %errorlevel% neq 0 (
    echo ERROR: Failed to commit changes.
    pause
    exit /b 1
)

echo.
echo Commit successful!
echo.

REM Ask about push
set /p PUSH="Push to origin/main? (y/n): "
if /i "%PUSH%"=="y" (
    echo.
    echo Pushing to origin/main...
    git push origin main
    if %errorlevel% equ 0 (
        echo.
        echo SUCCESS! Changes pushed to origin/main
        echo Deployment should trigger automatically if connected to Vercel/Netlify
    ) else (
        echo.
        echo ERROR: Failed to push. Please check your remote configuration.
    )
) else (
    echo.
    echo Changes committed locally. Push manually when ready:
    echo   git push origin main
)

echo.
pause

