# 🚀 Production Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the CMMC Level 2 Compliance Platform to production.

## Pre-Deployment Checklist

### 1. Security Fixes Applied ✅

- **npm vulnerabilities fixed**: Updated artillery, bundlesize, and vite to secure versions
- **Console logs removed**: Created logger utility that disables logs in production
- **CSP headers configured**: Strict Content Security Policy without unsafe-inline/eval
- **Security headers added**: X-Frame-Options, X-Content-Type-Options, HSTS, etc.
- **Secure storage implemented**: Using encryption for sensitive data in localStorage
- **API keys protected**: Environment variables used, no hardcoded secrets

### 2. Performance Optimizations ✅

- **Lazy loading implemented**: All routes use code splitting with retry logic
- **Bundle optimization**: 
  - Vendor chunks for better caching
  - Compression enabled (gzip & brotli)
  - Tree shaking configured
  - Minification with terser
- **Service worker enhanced**: 
  - Multiple cache strategies (network-first, cache-first, stale-while-revalidate)
  - Offline support with fallback page
  - Smart cache management
- **Asset optimization**:
  - Long-term caching for static assets
  - Preconnect/prefetch for external resources

### 3. Production Configuration ✅

- **Environment variables template**: `.env.production.example` created
- **Error boundaries**: Production-ready error handling with monitoring
- **Build configuration**: Optimized for production with source maps disabled

## Deployment Steps

### Step 1: Environment Setup

1. Copy the environment template:
   ```bash
   cp .env.production.example .env.production
   ```

2. Fill in all required environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `VITE_JWT_SECRET`: Strong secret for JWT signing
   - Other variables as needed

### Step 2: Pre-deployment Checks

Run the production checklist:
```bash
npm run check:production
```

This will verify:
- No console.log statements
- Environment variables set
- TypeScript compilation
- Bundle size
- Security headers
- No exposed API keys

### Step 3: Build for Production

```bash
# Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# Run production build
npm run build:production
```

### Step 4: Test Production Build Locally

```bash
npm run preview
```

Test critical flows:
- Authentication
- Assessment creation/editing
- Evidence upload
- Report generation
- Offline functionality

### Step 5: Deploy to Netlify

#### Option A: Git-based Deployment (Recommended)

1. Push to your git repository:
   ```bash
   git add .
   git commit -m "Production deployment - security and performance optimizations"
   git push origin main
   ```

2. Netlify will automatically build and deploy

#### Option B: Manual Deploy

```bash
# Install Netlify CLI if needed
npm install -g netlify-cli

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

### Step 6: Post-Deployment Verification

1. **Security Headers**: Check at https://securityheaders.com
2. **SSL Configuration**: Verify HTTPS and HSTS
3. **Performance**: Run Lighthouse audit
4. **Functionality**: Test core features
5. **Error Monitoring**: Verify error tracking works

## Configuration Files

### netlify.toml
- Security headers configured
- Caching rules set
- SPA routing configured
- Build settings optimized

### vite.config.ts
- Production minification
- Code splitting
- Compression plugins
- Security settings

### Service Worker (sw.js)
- Offline support
- Smart caching strategies
- Background sync for assessments

## Monitoring and Maintenance

### 1. Setup Monitoring

- Configure error tracking (Sentry or similar)
- Setup uptime monitoring
- Configure performance monitoring

### 2. Regular Updates

- Run `npm audit` weekly
- Update dependencies monthly
- Review security headers quarterly

### 3. Backup Strategy

- Database backups (Supabase handles this)
- Configuration backups
- Assessment data exports

## Troubleshooting

### Build Failures

1. Clear cache:
   ```bash
   rm -rf node_modules dist .cache
   npm install
   ```

2. Check Node version (should be 18+)

3. Verify all environment variables are set

### Performance Issues

1. Run bundle analyzer:
   ```bash
   npm run build:analyze
   ```

2. Check for large dependencies

3. Verify lazy loading is working

### Security Warnings

1. Run security audit:
   ```bash
   npm run audit:security
   ```

2. Update vulnerable dependencies

3. Review CSP violations in browser console

## Security Best Practices

1. **Environment Variables**:
   - Never commit `.env` files
   - Use strong, unique secrets
   - Rotate keys regularly

2. **Access Control**:
   - Enable 2FA on Netlify account
   - Limit deployment permissions
   - Use environment-specific API keys

3. **Updates**:
   - Enable Dependabot or similar
   - Review and test updates before deploying
   - Keep framework versions current

## Performance Targets

- **Lighthouse Score**: 90+ for all categories
- **Bundle Size**: < 1MB for initial load
- **Time to Interactive**: < 3 seconds on 3G
- **First Contentful Paint**: < 1.5 seconds

## Support

For deployment issues:
1. Check the deployment logs in Netlify
2. Review browser console for errors
3. Verify all environment variables are set correctly
4. Check the [troubleshooting section](#troubleshooting)

---

Last Updated: 2024
Version: 2.0.0