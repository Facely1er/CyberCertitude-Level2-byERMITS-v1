import { useState, useCallback, useEffect } from 'react';
import { authService, AuthUser } from '../../services/authService';
import { organizationService } from '../../services/organizationService';
import { logger } from '@/utils/logger';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  organization: string;
  role: string;
  industry: string;
  certifications?: string[];
  preferences: Record<string, any>;
  currentOrganizationId?: string;
}

interface AuthState {
  user: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  permissions: string[];
  role: string;
  organizations: any[];
  currentOrganization: any | null;
}

interface AuthResult {
  success: boolean;
  error?: string;
  message?: string;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null,
    permissions: [],
    role: 'viewer',
    organizations: [],
    currentOrganization: null
  });

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = authService.subscribe((authServiceState) => {
      setAuthState(prev => ({
        ...prev,
        user: authServiceState.user,
        loading: authServiceState.loading,
        error: authServiceState.error,
        permissions: authServiceState.user?.permissions || [],
        role: authServiceState.user?.role || 'viewer'
      }));
    });

    // Load initial auth state
    const initialAuthState = authService.getAuthState();
    setAuthState(prev => ({
      ...prev,
      user: initialAuthState.user,
      loading: initialAuthState.loading,
      error: initialAuthState.error,
      permissions: initialAuthState.user?.permissions || [],
      role: initialAuthState.user?.role || 'viewer'
    }));

    return unsubscribe;
  }, []);

  const signIn = useCallback(async (email: string): Promise<AuthResult> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      await authService.login({ email, password: '' });
      
      // For magic link, we return success but require email confirmation
      return { success: true, message: 'Magic link sent to your email', requiresEmailConfirmation: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const signUp = useCallback(async (email: string, name: string): Promise<AuthResult> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await authService.signUp(email, name);
      
      if (result.success) {
        return { success: true, message: 'Magic link sent to your email', requiresEmailConfirmation: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const handleMagicLinkCallback = useCallback(async (): Promise<AuthResult> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const user = await authService.handleMagicLinkCallback();
      
      if (user) {
        // Load user profile and organizations
        await loadUserData(user.id);
        return { success: true, message: 'Authentication successful' };
      } else {
        return { success: false, error: 'Authentication failed' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const resendMagicLink = useCallback(async (email: string, type: 'signin' | 'signup' = 'signin'): Promise<AuthResult> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      if (type === 'signup') {
        const result = await authService.signUp(email, 'User');
        return result;
      } else {
        await authService.login({ email, password: '' });
        return { success: true, message: 'Magic link sent to your email' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend magic link';
      setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    try {
      await authService.logout();
      setAuthState({
        user: null,
        profile: null,
        loading: false,
        error: null,
        permissions: [],
        role: 'viewer',
        organizations: [],
        currentOrganization: null
      });
    } catch (error) {
      logger.error('Sign out failed:', error);
    }
  }, []);

  const loadUserData = useCallback(async (userId: string) => {
    try {
      // Load user profile
      const profile = await organizationService.getUserProfile(userId);
      
      // Load organizations
      const organizations = await organizationService.getUserOrganizations(userId);
      
      setAuthState(prev => ({
        ...prev,
        profile,
        organizations,
        currentOrganization: organizations[0] || null,
        loading: false
      }));
    } catch (error) {
      logger.error('Failed to load user data:', error);
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>): Promise<AuthResult> => {
    try {
      if (!authState.user) {
        return { success: false, error: 'User not authenticated' };
      }

      const updatedProfile = await authService.updateProfile(updates);
      
      setAuthState(prev => ({
        ...prev,
        profile: updatedProfile
      }));
      
      return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
      return { success: false, error: errorMessage };
    }
  }, [authState.user]);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<AuthResult> => {
    try {
      if (!authState.user) {
        return { success: false, error: 'User not authenticated' };
      }

      await authService.changePassword(currentPassword, newPassword);
      return { success: true, message: 'Password changed successfully' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password change failed';
      return { success: false, error: errorMessage };
    }
  }, [authState.user]);

  const resetPassword = useCallback(async (email: string): Promise<AuthResult> => {
    try {
      await authService.resetPassword(email);
      return { success: true, message: 'Password reset email sent' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
      return { success: false, error: errorMessage };
    }
  }, []);

  const hasPermission = useCallback((permission: Permission): boolean => {
    return authService.hasPermission(permission);
  }, []);

  const hasRole = useCallback((role: string): boolean => {
    return authService.hasRole(role);
  }, []);

  const isAuthenticated = authState.user !== null;
  const isAdmin = authService.isAdmin();
  const isCISO = authService.isCISO();
  const isAuditor = authService.isAuditor();

  return {
    // State
    user: authState.user,
    profile: authState.profile,
    loading: authState.loading,
    error: authState.error,
    permissions: authState.permissions,
    role: authState.role,
    organizations: authState.organizations,
    currentOrganization: authState.currentOrganization,
    
    // Computed
    isAuthenticated,
    isAdmin,
    isCISO,
    isAuditor,
    
    // Actions
    signIn,
    signUp,
    signOut,
    handleMagicLinkCallback,
    resendMagicLink,
    updateProfile,
    changePassword,
    resetPassword,
    hasPermission,
    hasRole,
    loadUserData
  };
}