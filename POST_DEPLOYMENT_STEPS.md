# ✅ Post-Deployment Steps

Once your deployment completes, follow these steps:

---

## Step 1: Verify Deployment (5 minutes)

1. Check workflow status: https://github.com/Facely1er/CyberCertitude-Level2-byERMITS-v1/actions
2. Look for green checkmark ✅
3. Click on the completed workflow run
4. Find your deployment URL

**Your platform will be at:**
- Vercel: `https://cyber-certitude-level2-by-ermits-v1.vercel.app`
- Or Netlify: (check Netlify dashboard)

---

## Step 2: Test the Deployment (10 minutes)

Visit your deployment URL and test:

### Basic Functionality
- [ ] Homepage loads
- [ ] No console errors (press F12 to check)
- [ ] Navigation works
- [ ] Can see all pages

### Authentication
- [ ] Can sign up
- [ ] Can log in
- [ ] Session persists

### Core Features
- [ ] Can create new project
- [ ] See 3 project templates (Small, Medium, Enterprise)
- [ ] Can start CMMC assessment
- [ ] All 110 controls load

---

## Step 3: Add Custom Domain (if Vercel, 10 minutes)

### If Vercel Deployment Succeeded:

1. Go to: https://vercel.com/dashboard
2. Select project: `cyber-certitude-level2-by-ermits-v1`
3. Go to **Settings** → **Domains**
4. Click **"Add"**
5. Enter: `cmmc.cybercertitude.com`
6. Configure DNS as shown by Vercel

### If Netlify Fallback:

1. Go to Netlify dashboard
2. Add custom domain there
3. Configure DNS

---

## Step 4: Update Landing Page (15 minutes)

### Update Auth Bridge

**File:** `C:\Users\facel\Downloads\GitHub\cybercertitude-landingpage\cybercertitude-landingpage\public\auth-bridge.html`

**Find:**
```javascript
const ALLOWED_ORIGINS = new Set([
  // existing entries...
]);
```

**Add:**
```javascript
const ALLOWED_ORIGINS = new Set([
  'https://cmmc.cybercertitude.com',  // ✅ Add this
  'https://your-actual-vercel-url.vercel.app',  // Or Netlify URL
  // ... existing entries
]);
```

### Test Landing Page Connection
1. Visit landing page
2. Click "Access Platform"
3. Should redirect to `cmmc.cybercertitude.com`
4. Should be automatically authenticated

---

## Step 5: Configure Supabase Redirects (5 minutes)

Go to: https://supabase.com/dashboard/project/rjyyicattwrqtjiqwwvv/auth/url-configuration

**Add Redirect URLs:**
```
https://cmmc.cybercertitude.com/**
https://www.cybercertitude.com/**
```

**Update Site URL:**
```
https://www.cybercertitude.com
```

---

## Step 6: Final Testing (15 minutes)

Test complete user journey:

1. **Landing Page:**
   - [ ] Visit www.cybercertitude.com
   - [ ] Browse pricing
   - [ ] Click "Access Platform"

2. **Main Platform:**
   - [ ] Redirects to cmmc.cybercertitude.com
   - [ ] Automatically authenticated
   - [ ] Can create project
   - [ ] Can start assessment

3. **Cross-Domain:**
   - [ ] Log out from main platform
   - [ ] Log back in from landing page
   - [ ] Return to main platform
   - [ ] Still authenticated

---

## 🎉 SUCCESS!

Once all tests pass:

- ✅ **Platform is live!**
- ✅ **Users can access it**
- ✅ **Integration works**
- ✅ **Ready for customers!**

---

## 📊 Deployment URL Locations

**To find your URLs:**

**Vercel:**
- Dashboard: https://vercel.com/dashboard
- Project: `cyber-certitude-level2-by-ermits-v1`
- Domains section shows all URLs

**Netlify:**
- Dashboard: https://app.netlify.com
- Project: Your project name
- Domain settings show URL

**GitHub Actions:**
- Link: https://github.com/Facely1er/CyberCertitude-Level2-byERMITS-v1/actions
- Shows deployment URL when complete

---

## 🆘 Troubleshooting

### Can't Find Deployment URL
- Check GitHub Actions logs
- Check Vercel/Netlify dashboard
- Look for environment variable issues

### Platform Shows Errors
- Check browser console (F12)
- Verify Supabase credentials
- Ensure database migrations complete

### Auth Not Working
- Check Supabase redirect URLs
- Verify auth bridge origins
- Check session sharing

---

## ✅ Completion Checklist

- [ ] Deployment complete
- [ ] Platform accessible via URL
- [ ] Basic functionality works
- [ ] Authentication works
- [ ] Custom domain configured
- [ ] Landing page connected
- [ ] End-to-end test successful

**Once all checked:** You're live! 🚀

