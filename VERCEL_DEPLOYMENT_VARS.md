# Vercel Production Deployment - Environment Variables

## 🚀 Complete Environment Variable List for Vercel

Copy and paste these into your Vercel project settings:

---

## **Environment: Production**

Add these variables in **Settings → Environment Variables → Production**

### 1. **Core Configuration**

```
VITE_SUPABASE_URL=https://rjyyicattwrqtjiqwwvv.supabase.co
```

```
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqeXlpY2F0dHdycXRqaXF3d3Z2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NDA2NjMsImV4cCI6MjA3NzExNjY2M30.GMVCQ3Gx9roGV652YvAn6aYJ-q_ET-CDrsvAypBrk_Y
```

```
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51S9Ed8RqIGwycNDu4ZJMU7Fx8bdKrWkwYwS2RQvs5Xs26xunGwP9C3ROpj2Ik6o6McNCMMkA8P1sBuaAitofm9go00JxrQGkZI
```

```
NODE_ENV=production
```

```
VITE_APP_VERSION=2.0.0
```

### 2. **Security Settings**

```
VITE_ENABLE_CSP=true
```

```
VITE_SECURE_COOKIES=true
```

```
VITE_SESSION_TIMEOUT=28800000
```

### 3. **Feature Flags**

```
VITE_ENABLE_MFA=true
```

```
VITE_ENABLE_OFFLINE_MODE=true
```

```
VITE_ENABLE_PERFORMANCE_MONITORING=true
```

---

## 📋 Quick Setup Steps in Vercel

1. **Go to Vercel Dashboard**
   - Navigate to your project
   - Click **Settings**
   - Click **Environment Variables**

2. **Add Each Variable**
   - Click **Add New**
   - Paste the variable name (e.g., `NODE_ENV`)
   - Paste the value (e.g., `production`)
   - Select **Production** environment
   - Click **Save**
   - Repeat for each variable

3. **Redeploy**
   - After adding all variables, go to **Deployments**
   - Click **Redeploy** (or push a new commit)

---

## ✅ Production Checklist

- [ ] All 10 environment variables added to Vercel
- [ ] `NODE_ENV` set to `production`
- [ ] `VITE_SUPABASE_URL` is correct
- [ ] `VITE_SUPABASE_ANON_KEY` is correct
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY` is set (Stripe payments)
- [ ] All security flags set to `true`
- [ ] Redeployed after adding variables

---

## 🔧 Testing Production Build Locally

To test production mode locally, temporarily change your `.env`:

```bash
NODE_ENV=production
```

Then build and preview:
```bash
npm run build
npm run preview
```

**Remember to change it back to `development` after testing!**

---

## 📝 Notes

- **Local `.env`**: Keep `NODE_ENV=development` for local development
- **Vercel**: Set `NODE_ENV=production` for deployed apps
- **Never commit `.env`**: It's already in `.gitignore`
- **Vercel variables are secure**: Only accessible to your deployment

---

## 🎯 What Happens Next

After adding these variables to Vercel:

1. **Production build** will use `NODE_ENV=production`
2. **All security features** will be enabled
3. **Supabase connection** will work in production
4. **Feature flags** will be active
5. **Session timeout** will be 8 hours (28,800,000 ms)

---

## 🆘 Troubleshooting

### "Supabase client not configured"
- Verify `VITE_SUPABASE_URL` is set in Vercel
- Verify `VITE_SUPABASE_ANON_KEY` is set in Vercel
- Check for typos in variable names

### "Environment variables not working"
- Variables must start with `VITE_` to be exposed to client
- Ensure variables are set for the correct environment
- Redeploy after adding variables

### "Authentication not working"
- Verify Supabase project is active
- Check Site URL in Supabase settings
- Verify redirect URLs are correct

---

**Ready to deploy! 🚀**
