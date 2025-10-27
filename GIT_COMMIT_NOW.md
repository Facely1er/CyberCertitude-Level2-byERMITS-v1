# Git Commit Instructions - Manual Steps Required

## ❌ Current Situation

Git is not available in this environment. You need to commit and push the changes manually.

## ✅ What Has Been Done

All files have been successfully modified and are ready to commit:

1. ✅ **src/main.tsx** - Added Vercel Analytics, Speed Insights, and Sentry initialization
2. ✅ **src/lib/errorMonitoring.tsx** - Configured Sentry with DSN and BrowserTracing
3. ✅ **vercel.json** - Updated CSP headers for analytics domains
4. ✅ **package.json** - Added @vercel/analytics and @vercel/speed-insights
5. ✅ **package-lock.json** - Updated dependencies

## 🚀 How to Commit (Choose One Method)

### Method 1: Using VS Code

1. Open VS Code in this project folder
2. Open the Source Control panel (Ctrl+Shift+G)
3. You should see these files listed:
   - src/main.tsx
   - src/lib/errorMonitoring.tsx
   - vercel.json
   - package.json
   - package-lock.json
4. Click the "+" button to stage all files
5. Enter commit message (or copy from below)
6. Click the checkmark to commit
7. Click the "..." menu → Push

### Method 2: Using Git Bash / Command Line

Open Git Bash or any terminal with Git and run:

```bash
cd "C:\Users\facel\Downloads\GitHub\CyberCertitude-Level2-byERMITS-v1\CyberCertitude-Level2-byERMITS-v1"

# Stage the files
git add src/main.tsx src/lib/errorMonitoring.tsx vercel.json package.json package-lock.json

# Commit with message
git commit -m "feat: Add Vercel Analytics, Speed Insights, and Sentry error monitoring

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
Production ready: YES"

# Push to main
git push origin main
```

### Method 3: Using GitHub Desktop

1. Open GitHub Desktop
2. Select this repository
3. You'll see the changes listed
4. Select all modified files
5. Enter the commit message (copy from Method 2)
6. Click "Commit to main"
7. Click "Push origin"

### Method 4: Using IntelliJ / WebStorm

1. Open the project in IntelliJ IDEA or WebStorm
2. Open the Git tool window
3. Select the modified files
4. Commit with the message
5. Push to main branch

## 📋 Quick Copy Commit Message

```
feat: Add Vercel Analytics, Speed Insights, and Sentry error monitoring

- Install @vercel/analytics and @vercel/speed-insights packages
- Configure Sentry with DSN and Browser Tracing
- Add Session Replay for error debugging
- Update CSP headers for analytics domains
- Enable automatic tracking and error monitoring
```

## ✨ After Committing

Once pushed to main:
1. ✅ Vercel will automatically deploy
2. ✅ Analytics will start collecting data
3. ✅ Sentry will start monitoring errors
4. ✅ Performance metrics will be available in Vercel dashboard

## 🔍 Verify Changes

After pushing, you can verify in:
- **Vercel Dashboard** → Analytics tab
- **Vercel Dashboard** → Speed Insights tab  
- **Sentry Dashboard** → Your project (errors tab)

---

**Note:** All files are ready to commit. Just run the git commands on your machine with Git installed.

