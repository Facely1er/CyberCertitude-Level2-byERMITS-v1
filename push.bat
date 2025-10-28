@echo off
echo ========================================
echo   Completing Commit and Pushing to Main
echo ========================================
echo.

REM Check if we're in a git repository
if not exist ".git" (
    echo ERROR: Not in a git repository!
    echo Please navigate to the project folder first.
    pause
    exit /b 1
)

REM Show current status
echo Checking current status...
git status

echo.
echo ========================================
echo   Attempting to push to origin/main
echo ========================================
echo.

git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   SUCCESS! Changes pushed to main
    echo ========================================
    echo.
    git status
) else (
    echo.
    echo ========================================
    echo   Failed to push. Possible reasons:
    echo ========================================
    echo 1. You need to complete the commit first
    echo 2. No internet connection
    echo 3. Need to authenticate
    echo.
    echo If you're in the commit editor:
    echo - Press Esc, type :wq, press Enter
    echo - Then run: git push origin main
    echo.
)

pause

