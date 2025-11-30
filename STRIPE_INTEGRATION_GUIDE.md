# 🎯 Stripe Integration Guide for CMMC Platform

This guide walks you through setting up Stripe payments and webhooks for your CMMC platform.

---

## 📋 Overview

The Stripe integration consists of:
1. **Webhook Handler** - Receives events from Stripe (payment success, subscription changes, etc.)
2. **Checkout Creator** - Creates checkout sessions for users to purchase subscriptions
3. **Database Tables** - Stores subscription information
4. **Frontend Integration** - React hooks and components for payment processing

---

## 🚀 Setup Steps

### Step 1: Install Dependencies

```bash
npm install stripe @stripe/stripe-js
```

### Step 2: Get Your Stripe API Keys

1. Go to https://dashboard.stripe.com/register
2. Create or access your Stripe account
3. Navigate to **Developers → API keys**
4. Copy your keys:
   - **Publishable Key** (starts with `pk_test_` for test mode)
   - **Secret Key** (starts with `sk_test_` for test mode)

---

### Step 3: Configure Supabase Edge Functions

Add these environment variables to your Supabase project:

**In Supabase Dashboard → Project Settings → Edge Functions:**

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
APP_URL=https://cmmc.cybercertitude.com
```

**Where to find each key:**
- `STRIPE_SECRET_KEY`: Developers → API keys → Secret key
- `STRIPE_WEBHOOK_SECRET`: See Step 6 below
- `APP_URL`: Your production domain

---

### Step 4: Deploy Edge Functions

Deploy both functions to Supabase:

```bash
# Deploy webhook handler
supabase functions deploy stripe-webhook

# Deploy checkout creator
supabase functions deploy create-checkout
```

---

### Step 5: Run Database Migration

```bash
# Apply the subscription tables migration
supabase db push

# Or via Supabase CLI
supabase migration up
```

This creates:
- `user_subscriptions` table
- RLS policies for user access
- Helper views for active subscribers

---

### Step 6: Configure Stripe Webhook

1. **Install Stripe CLI** (for testing):
   ```bash
   # Windows (via Scoop)
   scoop install stripe
   
   # Or download from https://stripe.com/docs/stripe-cli
   ```

2. **In Stripe Dashboard:**
   - Go to **Developers → Webhooks**
   - Click **Add endpoint**
   - URL: `https://YOUR_PROJECT_ID.supabase.co/functions/v1/stripe-webhook`
   - Select these events:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

3. **Copy the webhook signing secret** from the endpoint details

4. **Add it to Supabase environment variables** (from Step 3)

---

### Step 7: Add Stripe Keys to Frontend

In your `.env.local` or Vercel environment variables:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

---

### Step 8: Create Products & Prices in Stripe

1. Go to **Stripe Dashboard → Products**
2. Create your subscription products:
   - Example: "CMMC Level 2 Subscription"
   - Pricing: $X/month or $Y/year
3. Copy the **Price ID** (starts with `price_`)
4. Use this in your frontend checkout flow

---

## 💻 Frontend Integration

### Example: Create a Checkout Button

```typescript
// src/hooks/useStripe.ts
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { createClient } from '@supabase/supabase-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const createCheckoutSession = async (
  priceId: string,
  userId: string
) => {
  try {
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: {
        priceId,
        userId,
        successUrl: `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/pricing`,
      },
    });

    if (error) throw error;

    // Redirect to Stripe Checkout
    const stripe = await stripePromise;
    if (stripe && data.sessionId) {
      const { error: redirectError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });
      if (redirectError) throw redirectError;
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};
```

### Example: Use in Component

```typescript
// src/components/PricingCard.tsx
import { createCheckoutSession } from '@/hooks/useStripe';
import { useAuth } from '@/contexts/AuthContext';

export const PricingCard = () => {
  const { user } = useAuth();

  const handleSubscribe = async () => {
    if (!user) {
      // Redirect to login first
      return;
    }

    try {
      await createCheckoutSession('price_1234567890', user.id);
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Failed to start checkout. Please try again.');
    }
  };

  return (
    <button onClick={handleSubscribe}>
      Subscribe Now
    </button>
  );
};
```

---

## 🧪 Testing

### Local Testing with Stripe CLI

1. **Login to Stripe CLI:**
   ```bash
   stripe login
   ```

2. **Forward webhooks to local:**
   ```bash
   stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook
   ```

3. **Copy the webhook signing secret** from the CLI output

4. **Update your `.env` for local development:**
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_local_secret_from_cli
   ```

5. **Test a checkout:**
   - Use test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any CVC
   - Any ZIP

---

### Production Testing

1. **Switch to live mode** in Stripe Dashboard
2. **Update environment variables** with live keys
3. **Redeploy functions:**
   ```bash
   supabase functions deploy stripe-webhook --no-verify-jwt
   supabase functions deploy create-checkout --no-verify-jwt
   ```
4. **Configure webhook endpoint** to your production URL
5. **Test with a real card** (use low amount!)

---

## 📊 Database Schema

The migration creates `user_subscriptions` with:

```sql
- id: UUID
- user_id: UUID (references auth.users)
- customer_id: TEXT (Stripe customer ID)
- subscription_id: TEXT (Stripe subscription ID)
- status: TEXT (active, cancelled, past_due, etc.)
- plan_id: TEXT (Stripe price ID)
- current_period_start: TIMESTAMPTZ
- current_period_end: TIMESTAMPTZ
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

### Query User Subscription

```typescript
const { data: subscription } = await supabase
  .from('user_subscriptions')
  .select('*')
  .eq('user_id', userId)
  .single();

if (subscription?.status === 'active') {
  // User has active subscription
}
```

---

## 🔒 Security Considerations

1. **Never expose secret keys** in frontend code
2. **Always validate webhook signatures** (handled in Edge Function)
3. **Use HTTPS** for all checkout URLs
4. **Enable RLS** (Row Level Security) on subscription tables
5. **Sanitize user inputs** before creating checkout sessions

---

## 🐛 Troubleshooting

### "No stripe-signature header found"
- **Problem:** Webhook secret not configured
- **Solution:** Add `STRIPE_WEBHOOK_SECRET` to Supabase environment variables

### "Invalid signature"
- **Problem:** Webhook secret mismatch
- **Solution:** Verify the secret in Stripe Dashboard matches Supabase

### Checkout doesn't redirect
- **Problem:** Publishable key not set or invalid
- **Solution:** Check `VITE_STRIPE_PUBLISHABLE_KEY` in environment

### Subscription not updating in database
- **Problem:** Webhook not receiving events
- **Solution:** 
  - Check Stripe Dashboard → Webhooks → Test webhook
  - Verify endpoint URL is correct
  - Check Supabase Edge Function logs

---

## 📝 Event Flow

1. **User clicks Subscribe** → Frontend calls `create-checkout` function
2. **Function creates session** → Returns checkout URL
3. **User redirected to Stripe** → Enters payment details
4. **Payment succeeds** → Stripe sends webhook to `stripe-webhook`
5. **Webhook handler** → Updates `user_subscriptions` table
6. **User redirected back** → Access granted based on subscription status

---

## ✅ Checklist

- [ ] Stripe account created
- [ ] API keys obtained
- [ ] Edge functions deployed
- [ ] Database migration run
- [ ] Webhook endpoint configured
- [ ] Environment variables set (both Supabase and frontend)
- [ ] Products/prices created in Stripe
- [ ] Test checkout successful
- [ ] Test webhook receiving events
- [ ] Production webhook configured (if using live mode)

---

## 📚 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Stripe Checkout Demo](https://stripe.com/docs/payments/checkout)

---

## 🎉 You're Ready!

Your Stripe integration is now set up. Users can:
- Subscribe to your service
- Manage their subscription status
- Receive automatic access based on payment

Happy coding! 🚀
