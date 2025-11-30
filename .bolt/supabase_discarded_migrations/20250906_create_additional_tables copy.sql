-- Create additional tables migration
-- This migration creates additional supporting tables for the CMMC platform

-- Create assessments table (referenced by other tables)
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  framework_id TEXT NOT NULL,
  framework_name TEXT NOT NULL,
  responses JSONB DEFAULT '{}',
  organization_info JSONB DEFAULT '{}',
  is_complete BOOLEAN DEFAULT FALSE,
  version TEXT DEFAULT '1.0.0',
  template_id TEXT,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  reviewers TEXT[] DEFAULT '{}',
  approval_status TEXT DEFAULT 'draft' CHECK (approval_status IN ('draft', 'in_progress', 'under_review', 'approved', 'rejected', 'archived')),
  bookmarks TEXT[] DEFAULT '{}',
  time_spent INTEGER DEFAULT 0,
  question_notes JSONB DEFAULT '{}',
  question_evidence JSONB DEFAULT '{}',
  evidence_library JSONB DEFAULT '{}',
  risk_rating TEXT,
  business_impact TEXT,
  compliance_requirements TEXT[] DEFAULT '{}',
  assessment_version TEXT DEFAULT '1.0.0',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create MFA tables
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

CREATE TABLE IF NOT EXISTS public.mfa_email_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mfa_backup_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create analytics tables
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  session_id TEXT,
  page_url TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.analytics_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT NOT NULL UNIQUE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  page_views INTEGER DEFAULT 0,
  events_count INTEGER DEFAULT 0,
  user_agent TEXT,
  ip_address INET
);

CREATE TABLE IF NOT EXISTS public.analytics_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  page_url TEXT NOT NULL,
  load_time_ms INTEGER,
  dom_content_loaded_ms INTEGER,
  first_contentful_paint_ms INTEGER,
  largest_contentful_paint_ms INTEGER,
  cumulative_layout_shift REAL,
  first_input_delay_ms INTEGER,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.analytics_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  page_url TEXT,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mfa_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mfa_email_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mfa_backup_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_errors ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for assessments
CREATE POLICY "Users can view their own assessments" ON public.assessments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own assessments" ON public.assessments
  FOR ALL USING (user_id = auth.uid());

-- Create RLS policies for MFA settings
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

-- Create RLS policies for analytics (more permissive for data collection)
CREATE POLICY "Users can insert their own analytics events" ON public.analytics_events
  FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can view their own analytics events" ON public.analytics_events
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own analytics sessions" ON public.analytics_sessions
  FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can view their own analytics sessions" ON public.analytics_sessions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own analytics performance" ON public.analytics_performance
  FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can view their own analytics performance" ON public.analytics_performance
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own analytics errors" ON public.analytics_errors
  FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can view their own analytics errors" ON public.analytics_errors
  FOR SELECT USING (user_id = auth.uid());

-- Create indexes
CREATE INDEX idx_assessments_user_id ON public.assessments(user_id);
CREATE INDEX idx_assessments_organization_id ON public.assessments(organization_id);
CREATE INDEX idx_assessments_framework_id ON public.assessments(framework_id);
CREATE INDEX idx_user_mfa_settings_user_id ON public.user_mfa_settings(user_id);
CREATE INDEX idx_mfa_email_tokens_user_id ON public.mfa_email_tokens(user_id);
CREATE INDEX idx_mfa_email_tokens_token ON public.mfa_email_tokens(token);
CREATE INDEX idx_mfa_backup_codes_user_id ON public.mfa_backup_codes(user_id);
CREATE INDEX idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_events_event_type ON public.analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at);
CREATE INDEX idx_analytics_sessions_user_id ON public.analytics_sessions(user_id);
CREATE INDEX idx_analytics_sessions_session_id ON public.analytics_sessions(session_id);
CREATE INDEX idx_analytics_performance_user_id ON public.analytics_performance(user_id);
CREATE INDEX idx_analytics_performance_page_url ON public.analytics_performance(page_url);
CREATE INDEX idx_analytics_errors_user_id ON public.analytics_errors(user_id);
CREATE INDEX idx_analytics_errors_error_type ON public.analytics_errors(error_type);

-- Grant permissions
GRANT ALL ON public.assessments TO authenticated;
GRANT ALL ON public.user_mfa_settings TO authenticated;
GRANT ALL ON public.mfa_email_tokens TO authenticated;
GRANT ALL ON public.mfa_backup_codes TO authenticated;
GRANT ALL ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_sessions TO authenticated;
GRANT ALL ON public.analytics_performance TO authenticated;
GRANT ALL ON public.analytics_errors TO authenticated;