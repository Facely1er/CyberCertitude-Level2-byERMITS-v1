-- Migration: Create subscription management tables for Stripe integration
-- Created: 2025-01-27
-- Purpose: Store user subscription data from Stripe

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id TEXT NOT NULL,
  subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'inactive',
  plan_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one subscription per user
  CONSTRAINT unique_user_subscription UNIQUE (user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id 
  ON public.user_subscriptions(user_id);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_customer_id 
  ON public.user_subscriptions(customer_id);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_subscription_id 
  ON public.user_subscriptions(subscription_id);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status 
  ON public.user_subscriptions(status);

-- Enable RLS
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can view their own subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON public.user_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can manage all subscriptions (for webhooks)
CREATE POLICY "Service role can manage subscriptions"
  ON public.user_subscriptions
  FOR ALL
  USING (
    auth.role() = 'service_role' OR
    auth.uid() = user_id
  );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create view for active subscribers (useful for reporting)
CREATE OR REPLACE VIEW public.active_subscribers AS
SELECT 
  us.id,
  us.user_id,
  us.customer_id,
  us.subscription_id,
  us.status,
  us.plan_id,
  us.current_period_start,
  us.current_period_end,
  us.created_at,
  us.updated_at,
  u.email,
  u.email_confirmed_at IS NOT NULL as email_verified
FROM public.user_subscriptions us
LEFT JOIN auth.users u ON us.user_id = u.id
WHERE us.status IN ('active', 'trialing');

-- Add helpful comment
COMMENT ON TABLE public.user_subscriptions IS 
  'Stores user subscription information from Stripe payments';

COMMENT ON COLUMN public.user_subscriptions.status IS 
  'Subscription status: inactive, active, cancelled, past_due, trialing';

COMMENT ON COLUMN public.user_subscriptions.plan_id IS 
  'Stripe Price ID for the subscription plan';
