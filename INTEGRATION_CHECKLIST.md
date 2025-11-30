# 🔗 Integration Checklist - Connect Landing Page & Main Platform

**Status:** Waiting for deployment completion  
**Next:** Configure domain and connect sites

---

## ✅ Completed So Far

- [x] Database ready (3 templates)
- [x] GitHub secrets configured
- [x] Deployment triggered
- [ ] Deployment complete
- [ ] Custom domain configured
- [ ] Landing page connected
- [ ] Final testing

---

## 📋 Step 1: Get Deployment URL (When Ready)

After deployment completes, find your URL:

**Check GitHub Actions:**
- Go to: https://github.com/Facely1er/CyberCertitude-Level2-byERMITS-v1/actions
- Click on latest workflow run
- Look for "Deploy to Vercel" step
- Find deployment URL in logs

**Or Check Vercel:**
- Go to: https://vercel.com/dashboard
- Project: `cyber-certitude-level2-by-ermits-v1`
- Click on latest deployment
- Copy the URL

---

## 📋 Step 2: Configure Custom Domain in Vercel

### Add Domain: cmmc.cybercertitude.com

1. **Go to Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Select project: `cyber-certitude-level2-by-ermits-v1`

2. **Add Custom Domain:**
   - Click **"Settings"** → **"Domains"**
   - Click **"Add Domain"**
   - Enter: `cmmc.cybercertitude.com`
   - Click **"Add"**

3. **Configure DNS:**
   - Vercel will show DNS instructions
   - Add these DNS records to your domain provider:
     - Record type: `CNAME`
     - Name: `cmmc` (or `@` if root)
     - Value: [shown by Vercel]
   - Wait for DNS propagation (5-15 minutes)

4. **Verify:**
   - Vercel will show "Valid Configuration" when DNS propagates
   - Your platform will be live at `cmmc.cybercertitude.com`

---

## 📋 Step 3: Update Landing Page Auth Bridge

### File to Edit:
`C:\Users\facel\Downloads\GitHub\cybercertitude-landingpage\cybercertitude-landingpage\public\auth-bridge.html`

### What to Change:

Find this section (around line 10-20):
```javascript
const ALLOWED_ORIGINS = new Set([
  'https://level1.cybercertitude.com',
  'https://level2.cybercertitude.com',
  'https://your-landing-page-domain.com',
  'http://localhost:5173',
  'http://localhost:5174'
]);
```

**Replace with:**
```javascript
const ALLOWED_ORIGINS = new Set([
  'https://cmmc.cybercertitude.com',      // ✅ Main CMMC platform
  'https://www.cybercertitude.com',       // Landing page
  'http://localhost:5173',                // Landing page dev
  'http://localhost:5174'                 // Platform dev
]);
```

### How to Edit:
1. Open file in VS Code
2. Find ALLOWED_ORIGINS
3. Replace with code above
4. Save file
5. Commit and deploy landing page

---

## 📋 Step 4: Add Redirect After Purchase

### File to Edit:
Landing page checkout success handler

**Find checkout success handler** (likely in `src/hooks/usePayment.ts` or `src/components/CheckoutModal.tsx`)

**Add after successful checkout:**
```typescript
// After checkout session creation
window.location.href = 'https://cmmc.cybercertitude.com';
```

Or add as final step in checkout flow:
```typescript
const handleCheckoutSuccess = (sessionId: string) => {
  // Show success message
  setSuccessMessage('Payment successful! Redirecting...');
  
  // Redirect to main platform after 2 seconds
  setTimeout(() => {
    window.location.href = 'https://cmmc.cybercertitude.com';
  }, 2000);
};
```

---

## 📋 Step 5: Add "Access Platform" Button

Add to your landing page (User Dashboard or Pricing page):

```tsx
<div className="mt-8 text-center">
  <button
    onClick={() => window.location.href = 'https://cmmc.cybercertitude.com'}
    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
  >
    Access Your CMMC Platform
    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  </button>
</div>
```

---

## 📋 Step 6: Configure Supabase Redirect URLs

**Go to:** https://supabase.com/dashboard/project/rjyyicattwrqtjiqwwvv/auth/url-configuration

### Add These Redirect URLs:

```
https://cmmc.cybercertitude.com/**
https://www.cybercertitude.com/**
https://cyber-certitude-level2-by-ermits-v1.vercel.app/** (if using Vercel)
```

### Update Site URL:

Set to: `https://www.cybercertitude.com`

---

## 📋 Step 7: Final Testing

### Test Complete User Journey:

1. **Visit Landing Page:**
   - Go to: `www.cybercertitude.com`
   - Browse pricing
   - Sign up or log in

2. **Access Main Platform:**
   - Click "Access Platform" button
   - Or complete a purchase
   - Should redirect to `cmmc.cybercertitude.com`

3. **Verify Authentication:**
   - Should be automatically logged in
   - Session shared via auth bridge
   - Can access all features

4. **Test Platform Features:**
   - [ ] Create new project
   - [ ] See 3 project templates
   - [ ] Start CMMC assessment
   - [ ] Verify 110 controls load
   - [ ] Data saves correctly

5. **Test Cross-Domain:**
   - [ ] Log out from main platform
   - [ ] Log in from landing page
   - [ ] Return to main platform
   - [ ] Should still be authenticated

---

## 🎯 Success Criteria

You'll know integration is successful when:

✅ **Deployment:**
- Platform accessible at `cmmc.cybercertitude.com`
- No errors in browser console
- All pages load correctly

✅ **Integration:**
- Landing page redirects to platform
- Users automatically authenticated
- Session persists across domains

✅ **Functionality:**
- Can create projects
- All 3 templates visible
- Can start CMMC assessments
- All 110 controls load
- Data saves and persists

✅ **User Experience:**
- Smooth navigation between sites
- Single login for both domains
- No authentication issues
- Fast page loads

---

## 📝 Quick Reference

### Files to Edit (Landing Page):
1. `public/auth-bridge.html` - Add domain to ALLOWED_ORIGINS
2. `src/hooks/usePayment.ts` - Add redirect after checkout
3. `src/pages/UserDashboard.tsx` - Add "Access Platform" button

### Dashboard Links:
- **GitHub:** https://github.com/Facely1er/CyberCertitude-Level2-byERMITS-v1/actions
- **Vercel:** https://vercel.com/dashboard
- **Supabase:** https://supabase.com/dashboard/project/rjyyicattwrqtjiqwwvv

---

## ⏱️ Estimated Time

- **Step 1:** Get deployment URL - 1 minute
- **Step 2:** Configure domain - 10 minutes
- **Step 3:** Update auth bridge - 5 minutes
- **Step 4:** Add redirect - 5 minutes
- **Step 5:** Add button - 5 minutes
- **Step 6:** Configure Supabase - 3 minutes
- **Step 7:** Test - 15 minutes

**Total:** 44 minutes

---

## 🚀 You're Almost There!

Complete these 7 steps and your platform will be fully integrated and ready for users!

**Current Status:** Deployment running ⏳  
**Next:** Wait for URL, then configure domain

