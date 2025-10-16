# Quick Start Deployment Guide

## 🚀 Deploy in 5 Steps

### Step 1: Get Supabase Credentials (5 min)

1. Go to https://supabase.com → Create new project
2. Copy your credentials:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon Key** → `VITE_SUPABASE_ANON_KEY`

### Step 2: Set Environment Variables (2 min)

#### For Vercel:
```bash
vercel env add VITE_SUPABASE_URL production
# Paste your project URL
vercel env add VITE_SUPABASE_ANON_KEY production
# Paste your anon key
```

#### For Netlify:
```bash
netlify env:set VITE_SUPABASE_URL "your-project-url"
netlify env:set VITE_SUPABASE_ANON_KEY "your-anon-key"
```

### Step 3: Run Database Migrations (3 min)

```bash
cd supabase
supabase link --project-ref your-project-ref
supabase db push
```

### Step 4: Deploy (2 min)

```bash
# Vercel
vercel --prod

# OR Netlify
netlify deploy --prod
```

### Step 5: Verify (3 min)

```bash
# Check health
curl https://your-domain.com/health

# Test login through UI
# Create a test assessment
```

---

## ✅ Pre-Deployment Checklist

Before deploying, verify:

- [ ] Supabase project created
- [ ] Environment variables set in platform
- [ ] Database migrations run
- [ ] No secrets in git (`git status`)
- [ ] Build succeeds locally (`npm run build`)

---

## ⚠️ Common Issues

### "Supabase client not configured"
→ Check environment variables are set correctly in your deployment platform

### "Failed to fetch"
→ Verify Supabase project is active and credentials are correct

### Build fails
→ Run `npm ci && npm run build` locally to debug

---

## 📚 Full Documentation

- **Complete Guide:** DEPLOYMENT-RUNBOOK.md
- **Environment Setup:** ENVIRONMENT-SETUP.md
- **Security Checklist:** SECURITY-CHECKLIST.md
- **Production Summary:** PRODUCTION-READINESS-SUMMARY.md

---

## 🆘 Need Help?

1. Check DEPLOYMENT-RUNBOOK.md for detailed procedures
2. Review troubleshooting section in documentation
3. Verify all environment variables are set
4. Check Supabase dashboard for errors

---

## 📊 Monitoring After Deployment

### First 24 Hours - Watch These:
- [ ] Health endpoint responding: `/health`
- [ ] Error rate < 1% (check Sentry if configured)
- [ ] Users can log in
- [ ] Assessments can be created
- [ ] Reports can be generated

### Week 1 - Monitor:
- Uptime (target: 99.9%+)
- Response times (target: < 500ms)
- Error logs
- User feedback

---

**Total Time: ~15 minutes** ⏱️

Ready to deploy? Start with Step 1! 🚀
