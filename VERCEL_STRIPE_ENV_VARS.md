# 🚀 Vercel Environment Variables - Stripe Configuration

## Frontend Environment Variable

Add this to your Vercel project's environment variables:

### Navigate to:
Vercel Dashboard → Your Project → Settings → Environment Variables

### Add Variable:

**Variable Name:**
```
VITE_STRIPE_PUBLISHABLE_KEY
```

**Variable Value:**
```
pk_live_51S9Ed8RqIGwycNDu4ZJMU7Fx8bdKrWkwYwS2RQvs5Xs26xunGwP9C3ROpj2Ik6o6McNCMMkA8P1sBuaAitofm9go00JxrQGkZI
```

**Environment:** Production

**Save** the variable.

---

## Full Environment Variables List

Make sure these are also set in Vercel:

```env
# Supabase
VITE_SUPABASE_URL=https://rjyyicattwrqtjiqwwvv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqeXlpY2F0dHdycXRqaXF3d3Z2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NDA2NjMsImV4cCI6MjA3NzExNjY2M30.GMVCQ3Gx9roGV652YvAn6aYJ-q_ET-CDrsvAypBrk_Y

# Stripe (NEW)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51S9Ed8RqIGwycNDu4ZJMU7Fx8bdKrWkwYwS2RQvs5Xs26xunGwP9C3ROpj2Ik6o6McNCMMkA8P1sBuaAitofm9go00JxrQGkZI

# App
VITE_APP_VERSION=2.0.0
NODE_ENV=production
```

---

## ✅ After Adding

1. **Redeploy** your Vercel project
2. **Test** the Stripe integration
3. The publishable key will be available to your frontend code

---

## 🔗 Where Stripe Key is Used

The publishable key is used in your React components:

```typescript
import { loadStripe } from '@stripe/stripe-js';

const stripe = await loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);
```

This will automatically use the key from Vercel environment variables in production.
