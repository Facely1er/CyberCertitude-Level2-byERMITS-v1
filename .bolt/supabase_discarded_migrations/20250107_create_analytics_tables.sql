/*
  # Create Analytics tables

  1. New Tables
    - `analytics_events` - User interaction and system events
    - `analytics_sessions` - User session tracking
    - `analytics_performance` - Performance metrics
    - `analytics_errors` - Error tracking and monitoring

  2. Security
    - Enable RLS on all analytics tables
    - Add policies for data collection and analysis
    - Anonymize sensitive data
*/

-- Create analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id text PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  event_category text NOT NULL,
  event_action text NOT NULL,
  event_label text,
  event_value numeric,
  properties jsonb DEFAULT '{}',
  timestamp timestamptz NOT NULL DEFAULT now(),
  session_id text NOT NULL,
  user_agent text,
  ip_address inet,
  created_at timestamptz DEFAULT now()
);

-- Create analytics sessions table
CREATE TABLE IF NOT EXISTS analytics_sessions (
  id text PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  duration_seconds integer,
  page_views integer DEFAULT 0,
  events_count integer DEFAULT 0,
  user_agent text,
  ip_address inet,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  created_at timestamptz DEFAULT now()
);

-- Create analytics performance table
CREATE TABLE IF NOT EXISTS analytics_performance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id text,
  metric_name text NOT NULL,
  metric_value numeric NOT NULL,
  metric_unit text,
  page_url text,
  component_name text,
  properties jsonb DEFAULT '{}',
  timestamp timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create analytics errors table
CREATE TABLE IF NOT EXISTS analytics_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id text,
  error_type text NOT NULL,
  error_message text NOT NULL,
  error_stack text,
  error_url text,
  error_line integer,
  error_column integer,
  user_agent text,
  ip_address inet,
  properties jsonb DEFAULT '{}',
  timestamp timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_category ON analytics_events(event_category);
CREATE INDEX IF NOT EXISTS idx_analytics_events_properties ON analytics_events USING GIN(properties);

CREATE INDEX IF NOT EXISTS idx_analytics_sessions_user_id ON analytics_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_started_at ON analytics_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_ended_at ON analytics_sessions(ended_at);

CREATE INDEX IF NOT EXISTS idx_analytics_performance_user_id ON analytics_performance(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_performance_timestamp ON analytics_performance(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_performance_metric_name ON analytics_performance(metric_name);
CREATE INDEX IF NOT EXISTS idx_analytics_performance_page_url ON analytics_performance(page_url);

CREATE INDEX IF NOT EXISTS idx_analytics_errors_user_id ON analytics_errors(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_errors_timestamp ON analytics_errors(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_errors_error_type ON analytics_errors(error_type);
CREATE INDEX IF NOT EXISTS idx_analytics_errors_session_id ON analytics_errors(session_id);

-- Enable RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_errors ENABLE ROW LEVEL SECURITY;

-- RLS Policies for analytics_events
CREATE POLICY "Users can view their own analytics events" ON analytics_events
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "System can insert analytics events" ON analytics_events
  FOR INSERT WITH CHECK (true);

-- RLS Policies for analytics_sessions
CREATE POLICY "Users can view their own analytics sessions" ON analytics_sessions
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "System can insert analytics sessions" ON analytics_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update analytics sessions" ON analytics_sessions
  FOR UPDATE USING (true);

-- RLS Policies for analytics_performance
CREATE POLICY "Users can view their own performance data" ON analytics_performance
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "System can insert performance data" ON analytics_performance
  FOR INSERT WITH CHECK (true);

-- RLS Policies for analytics_errors
CREATE POLICY "Users can view their own error data" ON analytics_errors
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "System can insert error data" ON analytics_errors
  FOR INSERT WITH CHECK (true);

-- Create function to anonymize old analytics data
CREATE OR REPLACE FUNCTION anonymize_old_analytics_data()
RETURNS void AS $$
BEGIN
  -- Anonymize events older than 1 year
  UPDATE analytics_events 
  SET 
    user_id = NULL,
    ip_address = NULL,
    user_agent = 'anonymized'
  WHERE created_at < now() - interval '1 year';
  
  -- Anonymize sessions older than 1 year
  UPDATE analytics_sessions 
  SET 
    user_id = NULL,
    ip_address = NULL,
    user_agent = 'anonymized'
  WHERE created_at < now() - interval '1 year';
  
  -- Anonymize performance data older than 1 year
  UPDATE analytics_performance 
  SET 
    user_id = NULL
  WHERE created_at < now() - interval '1 year';
  
  -- Anonymize error data older than 1 year
  UPDATE analytics_errors 
  SET 
    user_id = NULL,
    ip_address = NULL,
    user_agent = 'anonymized'
  WHERE created_at < now() - interval '1 year';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get analytics metrics
CREATE OR REPLACE FUNCTION get_analytics_metrics(start_date timestamptz, end_date timestamptz)
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'totalUsers', (
      SELECT COUNT(DISTINCT user_id) 
      FROM analytics_events 
      WHERE timestamp BETWEEN start_date AND end_date 
      AND user_id IS NOT NULL
    ),
    'totalSessions', (
      SELECT COUNT(DISTINCT session_id) 
      FROM analytics_events 
      WHERE timestamp BETWEEN start_date AND end_date
    ),
    'totalEvents', (
      SELECT COUNT(*) 
      FROM analytics_events 
      WHERE timestamp BETWEEN start_date AND end_date
    ),
    'pageViews', (
      SELECT COUNT(*) 
      FROM analytics_events 
      WHERE timestamp BETWEEN start_date AND end_date 
      AND event_type = 'page_view'
    ),
    'uniquePageViews', (
      SELECT COUNT(DISTINCT event_label) 
      FROM analytics_events 
      WHERE timestamp BETWEEN start_date AND end_date 
      AND event_type = 'page_view'
    ),
    'averageSessionDuration', (
      SELECT COALESCE(AVG(duration_seconds), 0) 
      FROM analytics_sessions 
      WHERE started_at BETWEEN start_date AND end_date 
      AND ended_at IS NOT NULL
    ),
    'bounceRate', (
      SELECT COALESCE(
        (COUNT(*) FILTER (WHERE page_views = 1)::float / COUNT(*)::float) * 100, 
        0
      ) 
      FROM analytics_sessions 
      WHERE started_at BETWEEN start_date AND end_date
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get compliance analytics
CREATE OR REPLACE FUNCTION get_compliance_analytics(start_date timestamptz, end_date timestamptz)
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'totalAssessments', (
      SELECT COUNT(*) 
      FROM assessments 
      WHERE created_at BETWEEN start_date AND end_date
    ),
    'completedAssessments', (
      SELECT COUNT(*) 
      FROM assessments 
      WHERE created_at BETWEEN start_date AND end_date 
      AND status = 'completed'
    ),
    'averageComplianceScore', (
      SELECT COALESCE(AVG(compliance_score), 0) 
      FROM assessments 
      WHERE created_at BETWEEN start_date AND end_date
    ),
    'totalEvidence', (
      SELECT COUNT(*) 
      FROM evidence 
      WHERE created_at BETWEEN start_date AND end_date
    ),
    'complianceEvents', (
      SELECT COUNT(*) 
      FROM analytics_events 
      WHERE timestamp BETWEEN start_date AND end_date 
      AND event_category = 'compliance'
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to clean up old analytics data
CREATE OR REPLACE FUNCTION cleanup_old_analytics_data()
RETURNS void AS $$
BEGIN
  -- Delete events older than 2 years
  DELETE FROM analytics_events 
  WHERE created_at < now() - interval '2 years';
  
  -- Delete sessions older than 2 years
  DELETE FROM analytics_sessions 
  WHERE created_at < now() - interval '2 years';
  
  -- Delete performance data older than 1 year
  DELETE FROM analytics_performance 
  WHERE created_at < now() - interval '1 year';
  
  -- Delete error data older than 6 months
  DELETE FROM analytics_errors 
  WHERE created_at < now() - interval '6 months';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update session duration
CREATE OR REPLACE FUNCTION update_session_duration()
RETURNS trigger AS $$
BEGIN
  IF NEW.ended_at IS NOT NULL AND OLD.ended_at IS NULL THEN
    NEW.duration_seconds = EXTRACT(EPOCH FROM (NEW.ended_at - NEW.started_at));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_analytics_sessions_duration
  BEFORE UPDATE ON analytics_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_session_duration();

-- Add comments
COMMENT ON TABLE analytics_events IS 'User interaction and system events for analytics';
COMMENT ON TABLE analytics_sessions IS 'User session tracking and metrics';
COMMENT ON TABLE analytics_performance IS 'Performance metrics and monitoring data';
COMMENT ON TABLE analytics_errors IS 'Error tracking and monitoring data';
COMMENT ON FUNCTION anonymize_old_analytics_data() IS 'Anonymize analytics data older than 1 year';
COMMENT ON FUNCTION get_analytics_metrics(timestamptz, timestamptz) IS 'Get comprehensive analytics metrics for a date range';
COMMENT ON FUNCTION get_compliance_analytics(timestamptz, timestamptz) IS 'Get compliance-specific analytics for a date range';
COMMENT ON FUNCTION cleanup_old_analytics_data() IS 'Clean up old analytics data to manage storage';