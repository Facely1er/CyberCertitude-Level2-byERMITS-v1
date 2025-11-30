@echo off
echo ========================================
echo Committing Runtime Error Fixes
echo ========================================
echo.

REM Try to find git.exe in common locations
set "GIT_EXE="
if exist "C:\Program Files\Git\bin\git.exe" (
    set "GIT_EXE=C:\Program Files\Git\bin\git.exe"
) else if exist "C:\Program Files (x86)\Git\bin\git.exe" (
    set "GIT_EXE=C:\Program Files (x86)\Git\bin\git.exe"
) else (
    echo Git not found in common locations.
    echo.
    echo Please use VS Code Source Control (Ctrl+Shift+G) or install Git.
    echo.
    echo Manual commands to run:
    echo   git add -A
    echo   git commit -F COMMIT_RUNTIME_ERROR_FIXES.txt
    echo   git push origin main
    pause
    exit /b 1
)

echo Found Git at: %GIT_EXE%
echo.

echo Staging all changes...
"%GIT_EXE%" add -A
if %ERRORLEVEL% neq 0 (
    echo Failed to stage changes
    pause
    exit /b 1
)

echo.
echo Files to be committed:
"%GIT_EXE%" status --short
echo.

echo Committing changes...
"%GIT_EXE%" commit -F COMMIT_RUNTIME_ERROR_FIXES.txt
if %ERRORLEVEL% neq 0 (
    echo Commit failed
    pause
    exit /b 1
)

echo.
echo Commit successful!
echo.

echo Pushing to origin/main...
"%GIT_EXE%" push origin main
if %ERRORLEVEL% neq 0 (
    echo Push failed. Check your remote configuration.
    pause
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS! Changes pushed to main
echo ========================================
pause

