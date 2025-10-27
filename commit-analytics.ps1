# PowerShell script to commit and push Vercel Analytics and Sentry integration

Write-Host "=== Staging Analytics and Sentry Integration ===" -ForegroundColor Cyan

# Stage the analytics and monitoring-related files
Write-Host "`nStaging files..." -ForegroundColor Yellow
git add src/main.tsx src/lib/errorMonitoring.tsx vercel.json package.json package-lock.json

Write-Host "`n=== Showing Status ===" -ForegroundColor Cyan
git status

Write-Host "`n=== Committing Changes ===" -ForegroundColor Cyan
$commitMessage = @"
feat: Add Vercel Analytics, Speed Insights, and Sentry error monitoring

- Install @vercel/analytics package for page view tracking
- Install @vercel/speed-insights package for performance monitoring
- Configure Sentry error tracking with DSN integration
- Add Analytics and SpeedInsights components to main.tsx
- Update errorMonitoring.tsx with Sentry BrowserTracing and Replay
- Update CSP headers to allow Vercel Analytics domains
- Enable automatic tracking of page views and Web Vitals
- Enable real-time performance metrics collection
- Enable session replay for error debugging

Analytics features:
- Page view tracking
- Unique visitor metrics
- Performance monitoring (CLS, FID, LCP)
- Real-time speed insights

Sentry features:
- Error tracking and reporting
- Browser tracing for performance monitoring
- Session replay (masked for privacy)
- Automatic breadcrumb collection
- User context tracking

Files changed: 5 files
  - src/main.tsx: Added Analytics, SpeedInsights, and Sentry initialization
  - src/lib/errorMonitoring.tsx: Configured Sentry with BrowserTracing and Replay
  - vercel.json: Updated CSP for analytics domains
  - package.json: Added @vercel/analytics and @vercel/speed-insights
  - package-lock.json: Updated dependencies

Environment: Sentry DSN configured
Build: Successful ✓
Production ready: YES
"@

git commit -m $commitMessage

Write-Host "`n=== Pushing to Main ===" -ForegroundColor Cyan
git push origin main

Write-Host "`n✅ Successfully committed and pushed monitoring integration to main repository!" -ForegroundColor Green

