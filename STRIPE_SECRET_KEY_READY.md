# ✅ Stripe Secret Key Ready

## Your Keys

### Frontend Key (Already Configured)
```
Publishable Key: pk_live_51S9Ed8RqIGwycNDu4ZJMU7Fx8bdKrWkwYwS2RQvs5Xs26xunGwP9C3ROpj2Ik6o6McNCMMkA8P1sBuaAitofm9go00JxrQGkZI
```

### Backend Key (Just Added)
```
Secret Key: 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
```

---

## ⏳ Next Steps

### Step 1: Add Keys to Supabase (NOW - 5 minutes)

**Go to:** https://supabase.com/dashboard/project/rjyyicattwrqtjiqwwvv/settings/functions

**Add these environment variables:**

1. **STRIPE_SECRET_KEY**
   ```
   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
   ```

2. **APP_URL**
   ```
   https://cmmc.cybercertitude.com
   ```

3. **STRIPE_WEBHOOK_SECRET** (Get this from Step 2 below)
   ```
   whsec_... (you'll add this after creating the webhook)
   ```

Click **Save**.

---

### Step 2: Deploy Edge Functions (2 minutes)

Open terminal in your project directory and run:

```bash
supabase functions deploy stripe-webhook
supabase functions deploy create-checkout
```

---

### Step 3: Run Database Migration (1 minute)

```bash
supabase db push
```

Or if you prefer in Supabase Dashboard:
1. Go to SQL Editor
2. New query
3. Open: `supabase/migrations/013_create_subscription_tables.sql`
4. Copy contents and paste
5. Run query

---

### Step 4: Create Stripe Webhook (10 minutes)

**Go to:** https://dashboard.stripe.com/webhooks

1. Click **"Add endpoint"**
2. **Endpoint URL:**
   ```
   https://rjyyicattwrqtjiqwwvv.supabase.co/functions/v1/stripe-webhook
   ```
3. **Description:**
   ```
   CMMC Platform Subscription Webhooks
   ```
4. **Select events to listen to:**
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
5. Click **"Add endpoint"**
6. **Copy the Signing secret** - it starts with `whsec_...`
7. **Go back to Supabase** (Step 1) and add `STRIPE_WEBHOOK_SECRET` with the value you copied

---

### Step 5: Add Frontend Key to Vercel (2 minutes)

**Go to:** https://vercel.com/dashboard → Your Project → Settings → Environment Variables

**Add variable:**

**Name:**
```
VITE_STRIPE_PUBLISHABLE_KEY
```

**Value:**
```
pk_live_51S9Ed8RqIGwycNDu4ZJMU7Fx8bdKrWkwYwS2RQvs5Xs26xunGwP9C3ROpj2Ik6o6McNCMMkA8P1sBuaAitofm9go00JxrQGkZI
```

**Environment:** Production and Preview

Click **Save**.

Then **redeploy** your Vercel project.

---

### Step 6: Create a Product in Stripe (5 minutes)

**Go to:** https://dashboard.stripe.com/products

1. Click **"Add product"**
2. **Name:** "CMMC Level 2 Platform Access" (or your choice)
3. **Description:** Describe what customers get
4. **Set pricing** - monthly or yearly
5. **Pricing mode:** Standard
6. **Price:** Enter your desired price (e.g., $99/month)
7. Click **"Save product"**
8. **Copy the Price ID** (looks like `price_1234567890`)

You'll use this Price ID in your frontend checkout code.

---

### Step 7: Test the Integration (Optional)

#### Option A: Test with Stripe CLI (Local)

```bash
# Install Stripe CLI if you haven't
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook

# The CLI will give you a webhook secret - use this for local testing
```

#### Option B: Test in Production

1. Use Stripe test card: `4242 4242 4242 4242`
2. Any future expiry date
3. Any CVC
4. Any ZIP code

---

## ✅ Completion Checklist

- [x] Frontend publishable key obtained
- [x] Backend secret key obtained
- [ ] Secret key added to Supabase environment variables
- [ ] App URL added to Supabase environment variables
- [ ] Edge functions deployed
- [ ] Database migration run
- [ ] Stripe webhook created in Stripe Dashboard
- [ ] Webhook secret added to Supabase environment variables
- [ ] Publishable key added to Vercel
- [ ] Vercel project redeployed
- [ ] Product created in Stripe
- [ ] Ready to accept payments! 🎉

---

## 🎯 After All Steps Complete

Your Stripe integration will be fully operational:
- ✅ Checkout sessions will be created
- ✅ Payments will process
- ✅ Webhooks will update your database
- ✅ Subscription status will control access

---

## 📚 Reference Documents

- **Complete Setup:** `STRIPE_INTEGRATION_GUIDE.md`
- **Quick Start:** `QUICK_STRIPE_SETUP.md`
- **Keys Reference:** `STRIPE_KEYS_CONFIGURATION.md`
- **Vercel Setup:** `VERCEL_STRIPE_ENV_VARS.md`

---

**Status:** 🔑 Both keys ready | ⏳ Awaiting configuration
