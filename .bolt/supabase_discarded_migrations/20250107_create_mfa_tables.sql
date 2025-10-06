/*
  # Create MFA (Multi-Factor Authentication) tables

  1. New Tables
    - `user_mfa_settings` - User MFA configuration and status
    - `mfa_email_tokens` - Email-based MFA tokens
    - `mfa_backup_codes` - Backup codes for MFA recovery

  2. Security
    - Enable RLS on all MFA tables
    - Add policies for users to manage their own MFA settings
    - Secure token storage with expiration
*/

-- Create user MFA settings table
CREATE TABLE IF NOT EXISTS user_mfa_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  enabled boolean NOT NULL DEFAULT false,
  methods text[] NOT NULL DEFAULT '{}',
  secret text, -- TOTP secret (encrypted)
  backup_codes text[], -- Encrypted backup codes
  recovery_codes text[], -- Encrypted recovery codes
  grace_period_ends timestamptz, -- Grace period for new privileged users
  last_used timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create MFA email tokens table
CREATE TABLE IF NOT EXISTS mfa_email_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token text NOT NULL,
  expires_at timestamptz NOT NULL,
  used boolean NOT NULL DEFAULT false,
  used_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create MFA backup codes table (for audit trail)
CREATE TABLE IF NOT EXISTS mfa_backup_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code_hash text NOT NULL, -- Hashed backup code
  used boolean NOT NULL DEFAULT false,
  used_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_mfa_settings_user_id ON user_mfa_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_mfa_email_tokens_user_id ON mfa_email_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_mfa_email_tokens_token ON mfa_email_tokens(token);
CREATE INDEX IF NOT EXISTS idx_mfa_email_tokens_expires_at ON mfa_email_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_mfa_backup_codes_user_id ON mfa_backup_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_mfa_backup_codes_code_hash ON mfa_backup_codes(code_hash);

-- Enable RLS
ALTER TABLE user_mfa_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE mfa_email_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE mfa_backup_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_mfa_settings
CREATE POLICY "Users can view their own MFA settings" ON user_mfa_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own MFA settings" ON user_mfa_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own MFA settings" ON user_mfa_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own MFA settings" ON user_mfa_settings
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for mfa_email_tokens
CREATE POLICY "Users can view their own MFA email tokens" ON mfa_email_tokens
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own MFA email tokens" ON mfa_email_tokens
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own MFA email tokens" ON mfa_email_tokens
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for mfa_backup_codes
CREATE POLICY "Users can view their own MFA backup codes" ON mfa_backup_codes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own MFA backup codes" ON mfa_backup_codes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own MFA backup codes" ON mfa_backup_codes
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to clean up expired tokens
CREATE OR REPLACE FUNCTION cleanup_expired_mfa_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM mfa_email_tokens 
  WHERE expires_at < now() AND used = false;
  
  DELETE FROM mfa_backup_codes 
  WHERE created_at < now() - interval '1 year';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check MFA requirements
CREATE OR REPLACE FUNCTION is_mfa_required(user_role text)
RETURNS boolean AS $$
BEGIN
  RETURN user_role IN ('admin', 'ciso', 'compliance-officer', 'auditor');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get MFA status
CREATE OR REPLACE FUNCTION get_user_mfa_status(user_uuid uuid, user_role text)
RETURNS json AS $$
DECLARE
  mfa_settings record;
  result json;
BEGIN
  SELECT * INTO mfa_settings 
  FROM user_mfa_settings 
  WHERE user_id = user_uuid;
  
  IF NOT FOUND THEN
    result := json_build_object(
      'isEnabled', false,
      'isRequired', is_mfa_required(user_role),
      'methods', '[]'::json,
      'gracePeriodEnds', null
    );
  ELSE
    result := json_build_object(
      'isEnabled', mfa_settings.enabled,
      'isRequired', is_mfa_required(user_role),
      'methods', mfa_settings.methods,
      'lastUsed', mfa_settings.last_used,
      'gracePeriodEnds', mfa_settings.grace_period_ends
    );
  END IF;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_mfa_settings_updated_at
  BEFORE UPDATE ON user_mfa_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE user_mfa_settings IS 'User MFA configuration and status';
COMMENT ON TABLE mfa_email_tokens IS 'Email-based MFA verification tokens';
COMMENT ON TABLE mfa_backup_codes IS 'Backup codes for MFA recovery (audit trail)';
COMMENT ON FUNCTION cleanup_expired_mfa_tokens() IS 'Clean up expired MFA tokens';
COMMENT ON FUNCTION is_mfa_required(text) IS 'Check if MFA is required for a user role';
COMMENT ON FUNCTION get_user_mfa_status(uuid, text) IS 'Get comprehensive MFA status for a user';