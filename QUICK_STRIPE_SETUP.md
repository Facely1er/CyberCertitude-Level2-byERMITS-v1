# ⚡ Quick Stripe Setup - 35 Minutes to Payments

## 🎯 What You Have

✅ **Webhook Handler** - Receives Stripe events and updates database  
✅ **Checkout Creator** - Creates payment sessions  
✅ **Database Tables** - Stores subscription data  
✅ **Documentation** - Complete setup guides  

---

## 🚀 Quick Start (35 minutes)

### 1️⃣ Get Stripe Keys (5 min)
Go to https://dashboard.stripe.com → Copy:
- Publishable Key (pk_test_...)
- Secret Key (sk_test_...)

### 2️⃣ Configure Supabase (10 min)
**Dashboard → Project Settings → Edge Functions:**

```env
STRIPE_SECRET_KEY=sk_test_YOUR_KEY
STRIPE_WEBHOOK_SECRET=whsec_TEMP_BELOW
APP_URL=https://cmmc.cybercertitude.com
```

### 3️⃣ Deploy Functions (5 min)
```bash
supabase functions deploy stripe-webhook
supabase functions deploy create-checkout
```

### 4️⃣ Run Migration (2 min)
```bash
supabase db push
```

### 5️⃣ Configure Webhook (10 min)
**Stripe Dashboard → Developers → Webhooks:**
- Add endpoint: `https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook`
- Select events: `checkout.session.completed`, `customer.subscription.*`, `invoice.*`
- Copy signing secret → Update Step 2

### 6️⃣ Frontend Key (2 min)
**Vercel or `.env.local`:**
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
```

### 7️⃣ Create Product (1 min)
**Stripe → Products:** Create subscription & copy Price ID

---

## 🧪 Test It

```bash
# Install Stripe CLI
stripe login

# Forward webhooks
stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook

# Test card: 4242 4242 4242 4242
```

---

## 📚 Full Documentation

- **Setup Guide:** `STRIPE_INTEGRATION_GUIDE.md`
- **Reference:** `STRIPE_SETUP_COMPLETE.md`
- **Summary:** `STRIPE_IMPLEMENTATION_SUMMARY.md`

---

## ✅ That's It!

Everything is coded and ready. Just configure the keys above and deploy! 🚀
