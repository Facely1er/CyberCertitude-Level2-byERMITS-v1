# 🔗 Final Integration Steps - Connect Your Sites

**Status:** Domain configured ✅ | Platform live at `cmmc.cybercertitude.com`  
**Next:** Connect landing page and test  
**Time Remaining:** 15-20 minutes

---

## 📋 Remaining Tasks

1. ⏳ **Update Landing Page Auth Bridge** (5 min)
2. ⏳ **Configure Supabase Redirect URLs** (3 min)
3. ⏳ **Final Testing** (10 min)

**Total:** ~15 minutes until fully integrated!

---

## 🔧 Step 1: Update Landing Page Auth Bridge

### File to Edit
**Path:** `C:\Users\facel\Downloads\GitHub\cybercertitude-landingpage\cybercertitude-landingpage\public\auth-bridge.html`

### Find This Section (around lines 10-20):
```javascript
const ALLOWED_ORIGINS = new Set([
  'https://level1.cybercertitude.com',
  'https://level2.cybercertitude.com',
  // ... existing entries
]);
```

### Replace With:
```javascript
const ALLOWED_ORIGINS = new Set([
  'https://cmmc.cybercertitude.com',      // ✅ Main CMMC platform (ADD THIS)
  'https://www.cybercertitude.com',      // Landing page
  'https://cybercertitude-landingpage.vercel.app',  // If different
  'http://localhost:5173',                // Landing page dev
  'http://localhost:5174',                 // Platform dev
]);
```

### After Making Changes:
1. Save the file
2. Commit and deploy to Vercel/Netlify

---

## 🔧 Step 2: Add Redirect After Purchase

### Add Platform Redirect

**File:** Your checkout success handler (look for where checkout completes)

**Add this redirect:**

```typescript
// After successful checkout
const redirectToPlatform = () => {
  setTimeout(() => {
    window.location.href = 'https://cmmc.cybercertitude.com';
  }, 2000); // 2 second delay to show success message
};

// Call after checkout session created
redirectToPlatform();
```

---

## 🔧 Step 3: Add "Access Platform" Button

**File:** `C:\Users\facel\Downloads\GitHub\cybercertitude-landingpage\cybercertitude-landingpage\src\pages\UserDashboard.tsx` (or wherever user dashboard is)

**Add this button where users land after login:**

```tsx
<button
  onClick={() => window.location.href = 'https://cmmc.cybercertitude.com'}
  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
>
  🚀 Access Your CMMC Platform
  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
</button>
```

---

## 🔧 Step 4: Configure Supabase Redirect URLs

**Go to:** https://supabase.com/dashboard/project/rjyyicattwrqtjiqwwvv/auth/url-configuration

### Add These URLs to "Redirect URLs":

```
https://cmmc.cybercertitude.com/**
https://www.cybercertitude.com/**
https://cyber-certitude-level2-by-ermits-v1.vercel.app/**
```

### Update "Site URL":

Set to:
```
https://www.cybercertitude.com
```

**Or:**
```
https://cmmc.cybercertitude.com
```

---

## 🧪 Step 5: Test Everything

### Test 1: Visit Main Platform
1. Go to: **`https://cmmc.cybercertitude.com`**
2. Check: Page loads without errors
3. Try: Sign up or log in
4. Verify: Can create project
5. Check: See 3 templates

### Test 2: Landing Page → Platform
1. Go to: Landing page (www.cybercertitude.com)
2. Sign in (or sign up)
3. Click "Access Platform" button
4. Verify: Redirects to cmmc.cybercertitude.com
5. Check: Automatically authenticated

### Test 3: After Purchase
1. Go to: Landing page
2. Complete: Purchase flow
3. Wait: Should redirect to platform
4. Verify: Already logged in on platform

### Test 4: Cross-Domain Auth
1. Log in on: Landing page
2. Visit: cmmc.cybercertitude.com
3. Verify: Still authenticated
4. Test: Can access all features

### Test 5: Platform Features
- [ ] Create new project
- [ ] Select from 3 templates
- [ ] Start CMMC assessment
- [ ] See all 110 controls
- [ ] Save data
- [ ] Verify persistence

---

## ✅ Success Indicators

**You'll know it's working when:**

✅ Main platform accessible at `https://cmmc.cybercertitude.com`  
✅ Landing page redirects to platform after login/purchase  
✅ Users automatically authenticated on platform  
✅ Can create projects and start assessments  
✅ All 110 CMMC controls load  
✅ Data saves successfully

---

## 🎉 Once Testing Passes

**Your platform is fully integrated and ready for:**
- ✅ End users
- ✅ Customer signups
- ✅ Purchases and billing
- ✅ Full CMMC 2.0 compliance work

---

## 📝 Quick Reference

**Main Platform:** https://cmmc.cybercertitude.com  
**Landing Page:** www.cybercertitude.com  
**Database:** rjyyicattwrqtjiqwwvv.supabase.co  
**GitHub:** https://github.com/Facely1er/CyberCertitude-Level2-byERMITS-v1

**Files to Edit:**
- Landing page: `public/auth-bridge.html`
- Landing page: Checkout success handler
- Landing page: User dashboard

**Dashboards:**
- Supabase: https://supabase.com/dashboard/project/rjyyicattwrqtjiqwwvv/auth/url-configuration
- Vercel: https://vercel.com/dashboard

---

## 🚀 You're Almost Done!

Complete these final steps and you're **100% live**!

**Remaining Time:** ~15 minutes  
**Current Progress:** 90% complete

