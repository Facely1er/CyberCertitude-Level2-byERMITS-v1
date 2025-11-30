@echo off
echo Adding files...
git add .github/workflows/deploy.yml
git add netlify.toml
git add package.json
git add .nvmrc
git add *.md

echo.
echo Committing changes...
git commit -m "Fix Node 20 requirement for Netlify deployment"

echo.
echo Pushing to main...
git push origin main

echo.
echo Done! Check GitHub Actions for deployment status.
pause
