# 🔗 Landing Page Integration Code

## Update Auth Bridge

**File:** `C:\Users\facel\Downloads\GitHub\cybercertitude-landingpage\cybercertitude-landingpage\public\auth-bridge.html`

**Find (around line 10-20):**
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
  'https://cmmc.cybercertitude.com',     // ✅ Main CMMC platform
  'https://www.cybercertitude.com',      // Landing page (if different)
  'http://localhost:5173',               // Landing page dev
  'http://localhost:5174'                // Platform dev
]);
```

---

## Add Platform Access Button

**File:** `src/pages/Pricing.tsx` or `src/pages/UserDashboard.tsx`

**Add button after pricing section:**
```tsx
<div className="mt-8 text-center">
  <button
    onClick={() => window.location.href = 'https://cmmc.cybercertitude.com'}
    className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
  >
    Access Your CMMC Platform
    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  </button>
</div>
```

---

## Update Checkout Success Redirect

**File:** `src/hooks/usePayment.ts` or wherever checkout success is handled

**Find checkout success handler and add:**
```typescript
const handleCheckoutSuccess = async (sessionId: string) => {
  // Update local state
  setIsProcessing(false);
  setCheckoutSessionId(sessionId);
  
  // Redirect to main CMMC platform
  setTimeout(() => {
    window.location.href = 'https://cmmc.cybercertitude.com';
  }, 2000); // Small delay to show success message
};
```

---

## Update Supabase Redirect URLs

**Go to:** https://supabase.com/dashboard/project/rjyyicattwrqtjiqwwvv/auth/url-configuration

**Add to "Redirect URLs":**
```
https://cmmc.cybercertitude.com/**
https://www.cybercertitude.com/**
```

**Update "Site URL" to:**
```
https://www.cybercertitude.com
```

---

## Test After Changes

1. Deploy landing page changes
2. Test auth bridge communication
3. Test redirect after purchase
4. Verify cross-domain auth works

---

## Files to Update Summary

| File | Action | Location |
|------|--------|----------|
| `public/auth-bridge.html` | Update ALLOWED_ORIGINS | Landing page project |
| `src/pages/Pricing.tsx` | Add access button | Landing page project |
| `src/hooks/usePayment.ts` | Add redirect | Landing page project |
| Supabase Dashboard | Add redirect URL | https://supabase.com/dashboard |

---

After these changes, both sites will be fully integrated! ✅

