# Push to GitHub Script
Write-Host "🚀 Preparing to push changes..." -ForegroundColor Cyan

# Check git status
Write-Host "`n📋 Checking git status..." -ForegroundColor Yellow
git status --short

Write-Host "`n📝 Staging changes..." -ForegroundColor Yellow
git add .github/workflows/deploy.yml
git add netlify.toml
git add package.json
git add .nvmrc

Write-Host "`n📄 Creating commit..." -ForegroundColor Yellow
git commit -m "Fix Node 20 requirement for Netlify deployment"

Write-Host "`n🚀 Pushing to main branch..." -ForegroundColor Yellow
git push origin main

Write-Host "Done! Check GitHub Actions for deployment status." -ForegroundColor Green
Write-Host "https://github.com/Facely1er/CyberCertitude-Level2-byERMITS-v1/actions" -ForegroundColor Cyan
