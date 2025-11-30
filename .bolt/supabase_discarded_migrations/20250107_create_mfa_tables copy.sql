-- Create MFA tables migration
-- This migration creates the Multi-Factor Authentication system tables

-- Create MFA settings table
CREATE TABLE IF NOT EXISTS public.user_mfa_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  is_enabled BOOLEAN DEFAULT false,
  totp_secret TEXT,
  backup_codes TEXT[] DEFAULT '{}',
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create MFA email tokens table
CREATE TABLE IF NOT EXISTS public.mfa_email_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create MFA backup codes table
CREATE TABLE IF NOT EXISTS public.mfa_backup_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_mfa_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mfa_email_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mfa_backup_codes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own MFA settings" ON public.user_mfa_settings
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own MFA settings" ON public.user_mfa_settings
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view their own MFA email tokens" ON public.mfa_email_tokens
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own MFA email tokens" ON public.mfa_email_tokens
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view their own MFA backup codes" ON public.mfa_backup_codes
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own MFA backup codes" ON public.mfa_backup_codes
  FOR ALL USING (user_id = auth.uid());

-- Create indexes
CREATE INDEX idx_user_mfa_settings_user_id ON public.user_mfa_settings(user_id);
CREATE INDEX idx_mfa_email_tokens_user_id ON public.mfa_email_tokens(user_id);
CREATE INDEX idx_mfa_email_tokens_token ON public.mfa_email_tokens(token);
CREATE INDEX idx_mfa_email_tokens_expires_at ON public.mfa_email_tokens(expires_at);
CREATE INDEX idx_mfa_backup_codes_user_id ON public.mfa_backup_codes(user_id);
CREATE INDEX idx_mfa_backup_codes_code ON public.mfa_backup_codes(code);

-- Grant permissions
GRANT ALL ON public.user_mfa_settings TO authenticated;
GRANT ALL ON public.mfa_email_tokens TO authenticated;
GRANT ALL ON public.mfa_backup_codes TO authenticated;