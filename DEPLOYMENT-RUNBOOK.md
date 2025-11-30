# Production Deployment Runbook

## CMMC 2.0 Level 2 Compliance Platform

**Version:** 2.0.0
**Last Updated:** 2025-10-16

---

## Pre-Deployment Checklist

### 1. Environment Variables Configuration

**CRITICAL:** Set these environment variables in your deployment platform (Vercel/Netlify):

#### Required Variables
```bash
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

#### Recommended Variables
```bash
VITE_SENTRY_DSN=your-sentry-dsn
VITE_ANALYTICS_ID=your-analytics-id
VITE_ENABLE_MFA=true
VITE_ENABLE_PERFORMANCE_MONITORING=true
```

### 2. Platform-Specific Setup

#### Vercel Deployment

1. **Set Environment Variables:**
   ```bash
   vercel env add VITE_SUPABASE_URL production
   vercel env add VITE_SUPABASE_ANON_KEY production
   vercel env add VITE_SENTRY_DSN production
   ```

2. **Configure Build Settings:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm ci`
   - Node Version: 18.x

3. **Deploy:**
   ```bash
   vercel --prod
   ```

#### Netlify Deployment

1. **Set Environment Variables:**
   - Go to Site Settings → Build & Deploy → Environment
   - Add required environment variables
   - Save changes

2. **Configure Build Settings:**
   - Build Command: `npm ci && npm run build`
   - Publish Directory: `dist`
   - Node Version: 18

3. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

### 3. Database Setup

#### Supabase Configuration

1. **Create Supabase Project:**
   - Go to https://supabase.com
   - Create new project
   - Copy project URL and anon key

2. **Run Migrations:**
   ```bash
   cd supabase
   supabase db push
   ```

3. **Enable Row Level Security:**
   - Verify RLS is enabled on all tables
   - Test policies with different user roles

4. **Configure Authentication:**
   - Enable email/password authentication
   - Configure email templates
   - Set up OAuth providers (if needed)

### 4. Security Verification

#### Pre-Flight Security Checks

```bash
# 1. Verify no secrets in git
git grep -E 'SUPABASE_URL|SUPABASE_ANON_KEY|SENTRY_DSN' -- ':!.env.example'

# 2. Run security audit
npm audit

# 3. Check for vulnerable dependencies
npm audit fix

# 4. Verify CSP headers
curl -I https://your-domain.com | grep -i "content-security-policy"
```

---

## Deployment Process

### Step 1: Pre-Deployment Testing

```bash
# 1. Clean install dependencies
npm ci

# 2. Run type checking
npm run type-check

# 3. Run linting
npm run lint

# 4. Run tests
npm run test:run

# 5. Run security tests
npm run test:security

# 6. Build for production
npm run build

# 7. Check bundle sizes
npm run perf:build-size

# 8. Preview production build
npm run preview
```

### Step 2: Deploy to Staging (Recommended)

```bash
# Deploy to staging environment first
netlify deploy --alias=staging

# Or for Vercel
vercel --env=preview
```

### Step 3: Verify Staging Deployment

1. **Functional Tests:**
   - [ ] Login/Authentication works
   - [ ] Assessment creation works
   - [ ] Evidence upload works
   - [ ] Report generation works
   - [ ] Data persists correctly

2. **Performance Tests:**
   - [ ] Page load time < 3s
   - [ ] Time to Interactive < 5s
   - [ ] First Contentful Paint < 1.8s
   - [ ] Cumulative Layout Shift < 0.1

3. **Security Tests:**
   - [ ] CSP headers present
   - [ ] HSTS enabled
   - [ ] No mixed content warnings
   - [ ] Authentication tokens secure
   - [ ] RLS policies working

### Step 4: Deploy to Production

```bash
# Deploy to production
netlify deploy --prod

# Or for Vercel
vercel --prod
```

### Step 5: Post-Deployment Verification

```bash
# 1. Health check
curl https://your-domain.com/health

# 2. Verify service worker
curl https://your-domain.com/sw.js

# 3. Check error monitoring
# Log into Sentry and verify events are coming through

# 4. Verify performance monitoring
# Check performance dashboard for metrics
```

---

## Monitoring & Alerting

### 1. Error Monitoring (Sentry)

- **Dashboard:** https://sentry.io/your-project
- **Alert Thresholds:**
  - Error rate > 5% → Page team immediately
  - Error count > 100/hour → Investigate within 1 hour

### 2. Performance Monitoring

- **Core Web Vitals Targets:**
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1

### 3. Uptime Monitoring

- **Setup:** Configure uptime monitor (e.g., UptimeRobot)
- **Endpoint:** https://your-domain.com/health
- **Check Interval:** 5 minutes
- **Alert:** Email/SMS on downtime

### 4. Database Monitoring

- **Supabase Dashboard:** Monitor connection pool, query performance
- **Alerts:** Set up alerts for high CPU/memory usage

---

## Rollback Procedures

### Quick Rollback (< 5 minutes)

#### Vercel
```bash
# List recent deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

#### Netlify
```bash
# List recent deployments
netlify sites:list

# Restore previous deployment from UI
# Or use CLI:
netlify deploy --prod --alias=production-backup
```

### Database Rollback

```bash
# 1. Stop application (set maintenance mode)
# 2. Restore database from backup
supabase db dump --data-only > backup.sql
supabase db reset
psql -h your-db-host -U postgres -d postgres < backup.sql

# 3. Verify data integrity
# 4. Resume application
```

---

## Troubleshooting Guide

### Common Issues

#### 1. "Failed to fetch" errors

**Symptoms:** API calls failing, network errors

**Solution:**
1. Check CORS configuration in Supabase
2. Verify environment variables are set
3. Check CSP headers allow Supabase domain
4. Verify Supabase project is active

#### 2. Authentication failures

**Symptoms:** Users cannot login, infinite redirect loops

**Solution:**
1. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
2. Check Supabase authentication settings
3. Verify redirect URLs are configured
4. Clear browser cache and cookies

#### 3. Slow performance

**Symptoms:** Long load times, sluggish UI

**Solution:**
1. Check bundle sizes: `npm run perf:build-size`
2. Review performance metrics in monitoring dashboard
3. Verify CDN is working correctly
4. Check database query performance

#### 4. Service Worker issues

**Symptoms:** Caching problems, stale content

**Solution:**
1. Force service worker update: Clear browser data
2. Verify sw.js is accessible
3. Check service worker registration in DevTools
4. Update cache version in sw.js

---

## Maintenance Procedures

### Weekly Tasks

- [ ] Review error logs in Sentry
- [ ] Check performance metrics
- [ ] Verify automated backups are running
- [ ] Review security alerts

### Monthly Tasks

- [ ] Update dependencies: `npm update`
- [ ] Run security audit: `npm audit`
- [ ] Review and optimize bundle sizes
- [ ] Database performance optimization
- [ ] Review and update documentation

### Quarterly Tasks

- [ ] Major dependency updates
- [ ] Security penetration testing
- [ ] Disaster recovery drill
- [ ] Performance optimization review
- [ ] Infrastructure cost optimization

---

## Emergency Contacts

### Technical Team
- **On-Call Engineer:** [Contact Info]
- **DevOps Lead:** [Contact Info]
- **Security Lead:** [Contact Info]

### External Services
- **Vercel Support:** https://vercel.com/support
- **Netlify Support:** https://www.netlify.com/support/
- **Supabase Support:** https://supabase.com/support

---

## Disaster Recovery

### Data Backup Strategy

1. **Database Backups:**
   - Automated daily backups via Supabase
   - Retention: 30 days
   - Location: Supabase managed storage

2. **Code Repository:**
   - GitHub repository
   - All commits tagged with deployment versions

3. **Configuration Backup:**
   - Environment variables documented
   - Infrastructure as Code in repository

### Recovery Time Objectives (RTO)

- **RTO:** 4 hours
- **RPO (Recovery Point Objective):** 24 hours

### Disaster Recovery Steps

1. **Assess the situation:**
   - Determine scope of outage
   - Identify affected services
   - Estimate impact

2. **Communicate:**
   - Notify stakeholders
   - Update status page
   - Provide regular updates

3. **Execute recovery:**
   - Deploy from last known good state
   - Restore database from backup
   - Verify functionality

4. **Post-mortem:**
   - Document incident
   - Identify root cause
   - Implement preventive measures

---

## Performance Optimization

### Bundle Size Optimization

```bash
# Analyze bundle
npm run build:analyze

# Check specific bundles
npm run perf:build-size
```

**Targets:**
- Main bundle: < 500KB
- Vendor bundles: < 300KB each
- Total initial load: < 1.5MB

### Caching Strategy

- **Static Assets:** 1 year cache
- **API Responses:** No cache
- **Service Worker:** Cache-first for assets, network-first for data

---

## Security Hardening

### Regular Security Tasks

1. **Dependency Updates:**
   ```bash
   npm audit
   npm audit fix
   npm update
   ```

2. **Security Headers Verification:**
   ```bash
   curl -I https://your-domain.com | grep -E "(X-Frame-Options|Content-Security-Policy|Strict-Transport-Security)"
   ```

3. **SSL Certificate Monitoring:**
   - Verify HTTPS is enforced
   - Check certificate expiration
   - Test SSL configuration

4. **Access Control Review:**
   - Review RLS policies
   - Audit user permissions
   - Verify MFA is working

---

## Compliance & Audit

### CMMC Compliance Documentation

- All deployment activities are logged
- Changes are version controlled
- Security controls are documented
- Incident response procedures are in place

### Audit Trail

- Git commits provide code change history
- Deployment logs in platform dashboard
- Database audit logs in Supabase
- Error monitoring in Sentry

---

## Success Metrics

### Key Performance Indicators (KPIs)

1. **Uptime:** > 99.9%
2. **Error Rate:** < 1%
3. **Page Load Time:** < 3s
4. **Time to Interactive:** < 5s
5. **User Satisfaction:** > 4.5/5

### Monitoring Dashboard

Set up dashboards to track:
- Response times
- Error rates
- User engagement
- Database performance
- Infrastructure costs

---

## Notes

- Always test in staging before production
- Keep this runbook updated with any changes
- Document all incidents and resolutions
- Regular backup verification is critical
- Security is everyone's responsibility

---

**Document Version:** 1.0
**Next Review Date:** 2025-11-16
