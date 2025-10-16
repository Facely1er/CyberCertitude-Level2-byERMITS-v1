# Environment Setup Guide

## Quick Reference for Production Deployment

### Required Environment Variables

These MUST be set in your deployment platform (Vercel, Netlify, etc.):

```bash
# Supabase Configuration (REQUIRED)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here

# Application Configuration
NODE_ENV=production
VITE_APP_VERSION=2.0.0
```

### Recommended Environment Variables

```bash
# Error Monitoring
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Analytics
VITE_ANALYTICS_ID=your-analytics-id
VITE_ANALYTICS_ENABLED=true

# Feature Flags
VITE_ENABLE_MFA=true
VITE_ENABLE_OFFLINE_MODE=true
VITE_ENABLE_PERFORMANCE_MONITORING=true

# Security
VITE_ENABLE_CSP=true
VITE_SECURE_COOKIES=true
VITE_SESSION_TIMEOUT=28800000
```

---

## Platform-Specific Instructions

### Vercel

#### Using Vercel CLI:
```bash
# Add environment variables
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
vercel env add VITE_SENTRY_DSN production

# List environment variables
vercel env ls

# Deploy
vercel --prod
```

#### Using Vercel Dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable with the appropriate value
4. Select "Production" environment
5. Save and redeploy

---

### Netlify

#### Using Netlify CLI:
```bash
# Add environment variables
netlify env:set VITE_SUPABASE_URL "your-value"
netlify env:set VITE_SUPABASE_ANON_KEY "your-value"
netlify env:set VITE_SENTRY_DSN "your-value"

# List environment variables
netlify env:list

# Deploy
netlify deploy --prod
```

#### Using Netlify Dashboard:
1. Go to Site Settings
2. Navigate to "Build & Deploy" → "Environment"
3. Click "Edit variables"
4. Add each variable
5. Save and trigger a new deploy

---

## Supabase Setup

### 1. Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Enter project details:
   - Name: CMMC Compliance Platform
   - Database Password: (use strong password)
   - Region: (choose closest to users)

### 2. Get API Keys

1. Go to Project Settings → API
2. Copy the following:
   - **Project URL** → Use as `VITE_SUPABASE_URL`
   - **anon/public key** → Use as `VITE_SUPABASE_ANON_KEY`

⚠️ **IMPORTANT:** Never commit these keys to version control!

### 3. Configure Authentication

1. Go to Authentication → Providers
2. Enable Email provider
3. Configure email templates (optional)
4. Set Site URL to your production domain

### 4. Set Up Database

Run migrations:
```bash
cd supabase
supabase link --project-ref your-project-ref
supabase db push
```

### 5. Configure Row Level Security (RLS)

Verify RLS is enabled:
```sql
-- Check if RLS is enabled on tables
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

---

## Security Best Practices

### ✅ DO:
- Use environment variables for all secrets
- Set different keys for production/staging
- Rotate keys regularly (quarterly)
- Use Supabase project-specific keys
- Enable MFA for Supabase account
- Monitor access logs

### ❌ DON'T:
- Commit secrets to git
- Use same keys across environments
- Share keys via email/chat
- Use weak database passwords
- Disable security headers
- Skip environment variable validation

---

## Verification Steps

After setting environment variables, verify they're working:

### 1. Local Testing
```bash
# Copy production env vars to .env.local (DO NOT COMMIT)
cp .env.example .env.local
# Edit .env.local with your values

# Test build
npm run build

# Test production mode
npm run preview
```

### 2. Production Verification
```bash
# Check if app loads
curl https://your-domain.com/health

# Check if Supabase connection works
# Login to your app and verify authentication

# Check error monitoring
# Trigger a test error and verify it appears in Sentry
```

---

## Troubleshooting

### "Supabase client not configured" error
- Verify `VITE_SUPABASE_URL` is set
- Verify `VITE_SUPABASE_ANON_KEY` is set
- Check for typos in variable names
- Verify variables are set for the correct environment
- Redeploy after adding variables

### Environment variables not working
- Variable names must start with `VITE_` to be exposed to client
- Restart dev server after changing .env files
- Clear build cache and rebuild
- Verify platform-specific environment variable syntax

### Authentication not working
- Verify Supabase project is active
- Check Site URL in Supabase settings
- Verify redirect URLs are correct
- Check CORS settings in Supabase

---

## Environment Variable Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_SUPABASE_URL` | ✅ Yes | - | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | ✅ Yes | - | Supabase anonymous key |
| `VITE_SENTRY_DSN` | ⚠️ Recommended | - | Sentry error tracking DSN |
| `VITE_ANALYTICS_ID` | ⚠️ Recommended | - | Analytics tracking ID |
| `VITE_ENABLE_MFA` | Optional | `true` | Enable multi-factor auth |
| `VITE_ENABLE_OFFLINE_MODE` | Optional | `true` | Enable offline support |
| `VITE_SESSION_TIMEOUT` | Optional | `28800000` | Session timeout (ms) |
| `VITE_ENABLE_CSP` | Optional | `true` | Enable Content Security Policy |

---

## Quick Commands

```bash
# Install dependencies
npm ci

# Run type checking
npm run type-check

# Build for production
npm run build

# Check bundle sizes
npm run perf:build-size

# Run security audit
npm audit

# Preview production build
npm run preview
```

---

## Support

For issues related to:
- **Environment setup:** Check this guide and DEPLOYMENT-RUNBOOK.md
- **Supabase:** https://supabase.com/docs
- **Vercel:** https://vercel.com/docs
- **Netlify:** https://docs.netlify.com

---

**Last Updated:** 2025-10-16
