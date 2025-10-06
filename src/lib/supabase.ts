import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';
import { ENV } from '../config/environment';
import { logger } from '@/utils/logger';

// Supabase client configuration
const supabaseUrl = ENV.SUPABASE_URL;
const supabaseAnonKey = ENV.SUPABASE_ANON_KEY;

// Check if Supabase is properly configured
export const isSupabaseReady = Boolean(supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' && 
  supabaseAnonKey !== 'your-anon-key-here');

// Create Supabase client with enhanced configuration
export const supabase = isSupabaseReady ? createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce' // Use PKCE flow for better security
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'cmmc-compliance-platform@2.0.0'
    }
  }
}) : null;

// Authentication interfaces
interface AuthResponse {
  data: any;
  error: any;
}

interface UserMetadata {
  name?: string;
  first_name?: string;
  last_name?: string;
  organization?: string;
  industry?: string;
  role?: string;
  [key: string]: any;
}

interface MagicLinkOptions {
  redirectTo?: string;
  shouldCreateUser?: boolean;
  data?: UserMetadata;
}

// Magic Link Authentication Functions

/**
 * Sign in with magic link
 */
export const signInWithMagicLink = async (
  email: string, 
  options: MagicLinkOptions = {}
): Promise<AuthResponse> => {
  if (!isSupabaseReady || !supabase) {
    logger.warn('Supabase not configured, using mock authentication');
    return {
      data: { user: null, session: null },
      error: null
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: options.redirectTo || `${window.location.origin}/auth/callback`,
        shouldCreateUser: options.shouldCreateUser || false,
        data: options.data || {}
      }
    });

    if (error) {
      logger.error('Magic link sign in error:', error);
      return { data: null, error };
    }

    logger.info('Magic link sent successfully for sign in');
    return { data, error: null };
  } catch (error: any) {
    logger.error('Magic link sign in exception:', error);
    return { 
      data: null, 
      error: { message: error.message || 'Failed to send magic link' }
    };
  }
};

/**
 * Sign up with magic link
 */
export const signUpWithMagicLink = async (
  email: string, 
  options: MagicLinkOptions = {}
): Promise<AuthResponse> => {
  if (!isSupabaseReady || !supabase) {
    logger.warn('Supabase not configured, using mock authentication');
    return {
      data: { user: null, session: null },
      error: null
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: options.redirectTo || `${window.location.origin}/auth/callback`,
        shouldCreateUser: true,
        data: options.data || {}
      }
    });

    if (error) {
      logger.error('Magic link sign up error:', error);
      return { data: null, error };
    }

    logger.info('Magic link sent successfully for sign up');
    return { data, error: null };
  } catch (error: any) {
    logger.error('Magic link sign up exception:', error);
    return { 
      data: null, 
      error: { message: error.message || 'Failed to send magic link' }
    };
  }
};

/**
 * Handle magic link callback
 */
const handleMagicLinkCallback = async (): Promise<AuthResponse> => {
  if (!isSupabaseReady || !supabase) {
    logger.warn('Supabase not configured');
    return {
      data: { session: null, user: null },
      error: { message: 'Supabase not configured' }
    };
  }

  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      logger.error('Failed to get session after callback:', error);
      return { data: null, error };
    }

    if (data.session) {
      logger.info('Magic link authentication successful');
      return { data, error: null };
    }

    return {
      data: null,
      error: { message: 'No active session found' }
    };
  } catch (error: any) {
    logger.error('Magic link callback exception:', error);
    return { 
      data: null, 
      error: { message: error.message || 'Authentication callback failed' }
    };
  }
};

/**
 * Sign out user
 */
export const signOut = async (): Promise<{ error: any }> => {
  if (!isSupabaseReady || !supabase) {
    return { error: null };
  }

  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      logger.error('Sign out error:', error);
      return { error };
    }

    logger.info('User signed out successfully');
    return { error: null };
  } catch (error: any) {
    logger.error('Sign out exception:', error);
    return { error: { message: error.message || 'Sign out failed' } };
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async (): Promise<{ user: any; error: any }> => {
  if (!isSupabaseReady || !supabase) {
    return {
      user: null,
      error: { message: 'Supabase not configured' }
    };
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      logger.error('Get current user error:', error);
      return { user: null, error };
    }

    return { user, error: null };
  } catch (error: any) {
    logger.error('Get current user exception:', error);
    return { 
      user: null, 
      error: { message: error.message || 'Failed to get current user' }
    };
  }
};

/**
 * Get current session
 */
export const getCurrentSession = async (): Promise<{ session: any; error: any }> => {
  if (!isSupabaseReady || !supabase) {
    return {
      session: null,
      error: { message: 'Supabase not configured' }
    };
  }

  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      logger.error('Get current session error:', error);
      return { session: null, error };
    }

    return { session, error: null };
  } catch (error: any) {
    logger.error('Get current session exception:', error);
    return { 
      session: null, 
      error: { message: error.message || 'Failed to get current session' }
    };
  }
};

/**
 * Get user profile
 */
const getProfile = async (userId: string): Promise<{ data: any; error: any }> => {
  if (!isSupabaseReady || !supabase) {
    return {
      data: null,
      error: { message: 'Supabase not configured' }
    };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      logger.error('Get profile error:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error: any) {
    logger.error('Get profile exception:', error);
    return { 
      data: null, 
      error: { message: error.message || 'Failed to get profile' }
    };
  }
};

/**
 * Update user profile
 */
const updateProfile = async (
  userId: string, 
  updates: Partial<any>
): Promise<{ data: any; error: any }> => {
  if (!isSupabaseReady || !supabase) {
    return {
      data: null,
      error: { message: 'Supabase not configured' }
    };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      logger.error('Update profile error:', error);
      return { data: null, error };
    }

    logger.info('Profile updated successfully');
    return { data, error: null };
  } catch (error: any) {
    logger.error('Update profile exception:', error);
    return { 
      data: null, 
      error: { message: error.message || 'Failed to update profile' }
    };
  }
};

/**
 * Create or update user profile
 */
const upsertProfile = async (profileData: any): Promise<{ data: any; error: any }> => {
  if (!isSupabaseReady || !supabase) {
    return {
      data: null,
      error: { message: 'Supabase not configured' }
    };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profileData, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      logger.error('Upsert profile error:', error);
      return { data: null, error };
    }

    logger.info('Profile upserted successfully');
    return { data, error: null };
  } catch (error: any) {
    logger.error('Upsert profile exception:', error);
    return { 
      data: null, 
      error: { message: error.message || 'Failed to upsert profile' }
    };
  }
};

/**
 * Check authentication status
 */
const checkAuthStatus = (): boolean => {
  return isSupabaseReady;
};

/**
 * Refresh authentication session
 */
const refreshSession = async (): Promise<{ data: any; error: any }> => {
  if (!isSupabaseReady || !supabase) {
    return {
      data: null,
      error: { message: 'Supabase not configured' }
    };
  }

  try {
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      logger.error('Session refresh error:', error);
      return { data: null, error };
    }

    logger.info('Session refreshed successfully');
    return { data, error: null };
  } catch (error: any) {
    logger.error('Session refresh exception:', error);
    return { 
      data: null, 
      error: { message: error.message || 'Failed to refresh session' }
    };
  }
};

/**
 * Reset password with magic link
 */
const resetPassword = async (email: string): Promise<AuthResponse> => {
  if (!isSupabaseReady || !supabase) {
    return {
      data: null,
      error: { message: 'Supabase not configured' }
    };
  }

  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });

    if (error) {
      logger.error('Password reset error:', error);
      return { data: null, error };
    }

    logger.info('Password reset email sent');
    return { data, error: null };
  } catch (error: any) {
    logger.error('Password reset exception:', error);
    return { 
      data: null, 
      error: { message: error.message || 'Failed to send password reset email' }
    };
  }
};

// Export the configuration check for other components
export const getSupabaseConfig = () => ({
  url: supabaseUrl,
  anonKey: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : null,
  isReady: isSupabaseReady
});

// Development helper
if (ENV.isDevelopment) {
  logger.info('Supabase configuration:', {
    url: supabaseUrl,
    anonKeyLength: supabaseAnonKey?.length || 0,
    isReady: isSupabaseReady
  });
}

