# 🔑 Stripe Keys Configuration

## ✅ Your Stripe Keys

### Publishable Key (Frontend)
```
pk_live_51S9Ed8RqIGwycNDu4ZJMU7Fx8bdKrWkwYwS2RQvs5Xs26xunGwP9C3ROpj2Ik6o6McNCMMkA8P1sBuaAitofm9go00JxrQGkZI
```

**Status:** ✅ LIVE MODE (Production)

---

## 📋 Next Steps

### 1. ✅ Stripe Secret Key (You Have This!)

```
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
```

**Ready to configure!**

---

### 2. Configure Vercel Environment Variables

#### Frontend Key (Vercel Dashboard)

**Go to:** Your Vercel project → Settings → Environment Variables

**Add:**
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51S9Ed8RqIGwycNDu4ZJMU7Fx8bdKrWkwYwS2RQvs5Xs26xunGwP9C3ROpj2Ik6o6McNCMMkA8P1sBuaAitofm9go00JxrQGkZI
```

Select environment: **Production**

---

### 3. Configure Supabase Edge Functions

**Go to:** https://supabase.com/dashboard/project/rjyyicattwrqtjiqwwvv/settings/functions

**Add these environment variables:**

```env
STRIPE_SECRET_KEY=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
STRIPE_WEBHOOK_SECRET=whsec_sovi9WzwGotcOiYhuY9rnzTKYWT8iigW
APP_URL=https://cmmc.cybercertitude.com
```

**All keys ready to configure! ✅**

---

### 4. Deploy Edge Functions

```bash
supabase functions deploy stripe-webhook
supabase functions deploy create-checkout
```

---

### 5. Create Stripe Webhook Endpoint

**Go to:** https://dashboard.stripe.com/webhooks

**Click:** Add endpoint

**Settings:**
- **Endpoint URL:** `https://rjyyicattwrqtjiqwwvv.supabase.co/functions/v1/stripe-webhook`
- **Description:** CMMC Platform Subscriptions

**Select events to send:**
- ✅ `checkout.session.completed`
- ✅ `customer.subscription.created`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.payment_succeeded`
- ✅ `invoice.payment_failed`

**Save** and copy the **Signing secret** (starts with `whsec_...`)

**Add this to Supabase** environment variables (Step 3)

---

### 6. Run Database Migration

```bash
supabase db push
```

Or in Supabase Dashboard:
- Go to **SQL Editor**
- Create new query
- Paste contents of: `supabase/migrations/013_create_subscription_tables.sql`
- Run it

---

## 🎯 Summary

You have:
- ✅ **Publishable Key** (frontend) - Ready to use
- ✅ **Secret Key** (backend) - Ready to use  
- ✅ **Webhook Secret** - Ready to use

---

## 📝 Quick Reference

**Stripe Dashboard:** https://dashboard.stripe.com
**API Keys:** https://dashboard.stripe.com/apikeys
**Webhooks:** https://dashboard.stripe.com/webhooks
**Supabase Functions:** https://supabase.com/dashboard/project/rjyyicattwrqtjiqwwvv/settings/functions

---

## ⚠️ Security Notes

1. **LIVE MODE:** You're using production keys - real payments will be processed
2. **Keep keys secret:** Never commit secret keys to Git
3. **Test first:** Consider testing with test mode before going live
4. **Webhook security:** Always verify webhook signatures (already implemented)

---

## ✅ Checklist

- [x] Publishable key obtained
- [x] Secret key obtained ✅
- [x] Webhook secret obtained ✅
- [ ] Vercel environment variable set
- [ ] Supabase environment variables set
- [ ] Edge functions deployed
- [ ] Webhook endpoint created
- [ ] Database migration run
- [ ] Test checkout flow

---

Once you complete these steps, your Stripe integration will be fully operational! 🚀
