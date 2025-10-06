# 🚀 Production Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the CMMC 2.0 Level 2 Compliance Platform to production. The platform is now **100% production-ready** with all mock data removed and comprehensive features implemented.

## ✅ Pre-Deployment Checklist

### 1. Environment Setup
- [ ] Supabase project created and configured
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] Domain and SSL certificate ready
- [ ] CDN configured (optional)

### 2. Security Configuration
- [ ] Security headers configured
- [ ] CORS settings updated
- [ ] Rate limiting enabled
- [ ] Input validation enabled
- [ ] XSS protection enabled

### 3. Performance Optimization
- [ ] Build optimizations enabled
- [ ] Code splitting configured
- [ ] Asset optimization enabled
- [ ] Caching configured
- [ ] CDN configured

## 🗄️ Database Setup

### Step 1: Create Supabase Project
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `cmmc-compliance-platform`
   - Database Password: Generate strong password
   - Region: Choose closest to your users

### Step 2: Apply Database Migrations
Run the following migrations in order:

```sql
-- 1. User profiles and authentication
-- File: supabase/migrations/20250730115425_falling_castle.sql

-- 2. Fix user signup flow
-- File: supabase/migrations/20250801073850_gentle_fog.sql

-- 3. Organization management
-- File: supabase/migrations/20250902_create_organizations_tables.sql

-- 4. Evidence collection
-- File: supabase/migrations/20250904_create_evidence_tables.sql

-- 5. Audit logs and tasks
-- File: supabase/migrations/20250905_create_audit_and_tasks_tables.sql

-- 6. Additional features
-- File: supabase/migrations/20250906_create_additional_tables.sql

-- 7. MFA tables
-- File: supabase/migrations/20250107_create_mfa_tables.sql

-- 8. Analytics tables
-- File: supabase/migrations/20250107_create_analytics_tables.sql
```

### Step 3: Configure Row Level Security (RLS)
All tables have RLS enabled by default. Review and adjust policies as needed for your organization.

## 🔧 Environment Configuration

### Required Environment Variables

Create a `.env.production` file with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# API Configuration
VITE_API_BASE_URL=https://your-api-domain.com/api

# Analytics
VITE_ANALYTICS_ENABLED=true
VITE_EXTERNAL_ANALYTICS_URL=https://your-analytics-endpoint.com

# Security
VITE_AUTH_ENABLED=true
VITE_ENABLE_REAL_TIME_MONITORING=true
VITE_ENABLE_PERFORMANCE_MONITORING=true

# Feature Flags
VITE_ENABLE_MFA=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_COLLABORATION=true
```

### Optional Environment Variables

```env
# Sentry Error Tracking
VITE_SENTRY_DSN=https://your-sentry-dsn

# Vercel Analytics
VITE_VERCEL_ANALYTICS_ID=your-vercel-analytics-id

# Custom Branding
VITE_APP_NAME=CyberCertitude™
VITE_APP_VERSION=2.0.0
VITE_COMPANY_NAME=Your Company Name
```

## 🚀 Deployment Options

### Option 1: Netlify (Recommended)

#### Step 1: Connect Repository
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click "New site from Git"
3. Connect your GitHub/GitLab repository
4. Select the repository containing this project

#### Step 2: Configure Build Settings
```yaml
Build command: npm run build
Publish directory: dist
Node version: 18
```

#### Step 3: Set Environment Variables
1. Go to Site settings > Environment variables
2. Add all required environment variables from the list above

#### Step 4: Configure Custom Domain
1. Go to Domain management
2. Add your custom domain
3. Configure SSL certificate (automatic with Let's Encrypt)

### Option 2: Vercel

#### Step 1: Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com)
2. Click "New Project"
3. Import your repository

#### Step 2: Configure Build Settings
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

#### Step 3: Set Environment Variables
Add all required environment variables in the Vercel dashboard.

### Option 3: AWS S3 + CloudFront

#### Step 1: Build the Application
```bash
npm run build
```

#### Step 2: Upload to S3
```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

#### Step 3: Configure CloudFront
1. Create CloudFront distribution
2. Set S3 bucket as origin
3. Configure custom error pages for SPA routing
4. Set up SSL certificate

## 🔒 Security Configuration

### 1. Content Security Policy (CSP)
The platform includes comprehensive CSP headers. Review and adjust in `netlify.toml`:

```toml
Content-Security-Policy = "default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://*.supabase.co wss://*.supabase.co; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none';"
```

### 2. Security Headers
All security headers are configured in `netlify.toml`:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

### 3. Rate Limiting
Configure rate limiting at the CDN level or use a service like Cloudflare.

## 📊 Monitoring and Analytics

### 1. Error Tracking
The platform includes Sentry integration for error tracking:
1. Create a Sentry project
2. Add `VITE_SENTRY_DSN` to environment variables
3. Errors will be automatically tracked

### 2. Performance Monitoring
Built-in performance monitoring tracks:
- Page load times
- API response times
- User interactions
- Error rates

### 3. Analytics Dashboard
Access the analytics dashboard at `/analytics` to view:
- User behavior metrics
- Compliance analytics
- Performance metrics
- System health

## 🔐 Multi-Factor Authentication (MFA)

### MFA is automatically enabled for privileged roles:
- Admin
- CISO
- Compliance Officer
- Auditor

### MFA Methods Supported:
- TOTP (Google Authenticator, Authy)
- Email verification
- Backup codes

### Configuration:
MFA settings are stored in the `user_mfa_settings` table and managed through the Supabase dashboard.

## 📈 Performance Optimization

### 1. Build Optimizations
- Code splitting by feature
- Tree shaking enabled
- Minification with Terser
- Asset optimization
- Gzip compression

### 2. Runtime Optimizations
- Lazy loading of components
- Virtual scrolling for large lists
- Memoization of expensive calculations
- Debounced user inputs

### 3. Caching Strategy
- Static assets: 1 year
- API responses: 5 minutes
- User data: Session-based

## 🧪 Testing

### Run Production Readiness Check
```bash
node scripts/production-readiness-check.js
```

### Run Tests
```bash
npm run test
npm run test:coverage
npm run test:security
```

### Performance Testing
```bash
npm run perf:lighthouse
npm run perf:build-size
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run build
      - run: node scripts/production-readiness-check.js
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: './dist'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
```

## 📋 Post-Deployment Checklist

### 1. Verify Deployment
- [ ] Application loads correctly
- [ ] Authentication works
- [ ] Database connections established
- [ ] All features functional
- [ ] SSL certificate valid

### 2. Security Verification
- [ ] Security headers present
- [ ] HTTPS enforced
- [ ] CORS configured correctly
- [ ] Input validation working
- [ ] MFA functional

### 3. Performance Verification
- [ ] Page load times < 3 seconds
- [ ] Lighthouse score > 90
- [ ] No console errors
- [ ] Analytics tracking working

### 4. User Acceptance Testing
- [ ] Complete CMMC assessment flow
- [ ] Evidence collection workflow
- [ ] Report generation
- [ ] Team collaboration features
- [ ] MFA setup and verification

## 🆘 Troubleshooting

### Common Issues

#### 1. Database Connection Errors
- Verify Supabase URL and key
- Check RLS policies
- Ensure migrations are applied

#### 2. Authentication Issues
- Verify Supabase auth configuration
- Check CORS settings
- Verify redirect URLs

#### 3. Build Failures
- Check Node.js version (18+)
- Verify all dependencies installed
- Check for TypeScript errors

#### 4. Performance Issues
- Enable CDN
- Check bundle size
- Optimize images
- Enable compression

### Support
For technical support:
1. Check the logs in your hosting platform
2. Review the error tracking dashboard
3. Contact your system administrator
4. Refer to the troubleshooting section in the user manual

## 📚 Additional Resources

- [User Manual](./USER_MANUAL_AND_ONBOARDING.md)
- [API Documentation](./docs/api.md)
- [Security Guide](./docs/security.md)
- [Performance Guide](./docs/performance.md)
- [Troubleshooting Guide](./docs/troubleshooting.md)

---

**The CMMC 2.0 Level 2 Compliance Platform is now ready for production deployment!** 🎉

All mock data has been removed, comprehensive features have been implemented, and the platform is fully production-ready with enterprise-grade security, performance, and reliability.