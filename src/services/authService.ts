import { UserProfile } from '../shared/types';
import { apiService } from './apiService';
import { mfaService } from './mfaService';
import { logger } from '../utils/logger';
import { secureStorage } from '../utils/secureStorage';
import { 
  signInWithMagicLink, 
  signUpWithMagicLink, 
  signOut as supabaseSignOut,
  getCurrentUser,
  getCurrentSession,
  isSupabaseReady,
  getSupabaseConfig
} from '../lib/supabase';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  organization: string;
  permissions: string[];
  lastLogin: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
  mfaCode?: string;
  mfaBackupCode?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

class AuthService {
  private static instance: AuthService;
  private authState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null
  };
  private listeners: ((state: AuthState) => void)[] = [];

  private constructor() {
    // Initialize auth asynchronously
    this.initializeAuth().catch(error => {
      logger.error('Failed to initialize auth:', error);
    });
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private async initializeAuth(): Promise<void> {
    try {
      const token = await secureStorage.getAuthToken();
      const userData = await secureStorage.getUserData<AuthUser>();
      
      if (token && userData) {
        this.authState = {
          isAuthenticated: true,
          user: userData,
          token,
          loading: false,
          error: null
        };
        this.notifyListeners();
      }
    } catch (error) {
      logger.error('Failed to initialize auth from secure storage:', error);
      this.clearAuth();
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.authState));
  }

  public subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public getAuthState(): AuthState {
    return { ...this.authState };
  }

  public async login(credentials: LoginCredentials): Promise<AuthUser> {
    this.authState.loading = true;
    this.authState.error = null;
    this.notifyListeners();

    try {
      // Check if Supabase is configured
      if (!isSupabaseReady) {
        logger.warn('Supabase not configured, using mock authentication');
        throw new Error('Authentication service not configured. Please contact support.');
      }

      // Use magic link authentication
      const { data, error } = await signInWithMagicLink(credentials.email, {
        redirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: false
      });

      if (error) {
        throw new Error(error.message || 'Failed to send magic link');
      }

      // For magic link, we don't get the user immediately
      // The user will be authenticated when they click the link
      // We'll handle this in the callback
      throw new Error('MAGIC_LINK_SENT');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      this.authState = {
        ...this.authState,
        loading: false,
        error: errorMessage
      };
      this.notifyListeners();
      logger.error('Login failed:', error);
      throw error;
    }
  }

  public async signUp(email: string, name: string): Promise<{ success: boolean; error?: string }> {
    this.authState.loading = true;
    this.authState.error = null;
    this.notifyListeners();

    try {
      if (!isSupabaseReady) {
        throw new Error('Authentication service not configured. Please contact support.');
      }

      const { data, error } = await signUpWithMagicLink(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: true,
        data: { name }
      });

      if (error) {
        throw new Error(error.message || 'Failed to send magic link');
      }

      this.authState.loading = false;
      this.notifyListeners();
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
      this.authState = {
        ...this.authState,
        loading: false,
        error: errorMessage
      };
      this.notifyListeners();
      logger.error('Sign up failed:', error);
      return { success: false, error: errorMessage };
    }
  }

  public async handleMagicLinkCallback(): Promise<AuthUser | null> {
    try {
      if (!isSupabaseReady) {
        throw new Error('Authentication service not configured');
      }

      const { session, error } = await getCurrentSession();
      
      if (error) {
        throw new Error(error.message || 'Failed to get session');
      }

      if (!session?.user) {
        throw new Error('No user found in session');
      }

      const user: AuthUser = {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.name || session.user.email || 'User',
        role: session.user.user_metadata?.role || 'user',
        organization: session.user.user_metadata?.organization || '',
        permissions: session.user.user_metadata?.permissions || [],
        lastLogin: new Date()
      };

      this.authState = {
        isAuthenticated: true,
        user,
        token: session.access_token,
        loading: false,
        error: null
      };

      // Store in secure storage
      await secureStorage.setAuthToken(session.access_token);
      await secureStorage.setUserData(user);

      this.notifyListeners();
      logger.info('User authenticated via magic link:', user.email);
      
      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      this.authState = {
        ...this.authState,
        loading: false,
        error: errorMessage
      };
      this.notifyListeners();
      logger.error('Magic link callback failed:', error);
      return null;
    }
  }

  public async logout(): Promise<void> {
    try {
      if (isSupabaseReady) {
        await supabaseSignOut();
      }
    } catch (error) {
      logger.warn('Logout API call failed:', error);
    } finally {
      this.clearAuth();
    }
  }

  private clearAuth(): void {
    this.authState = {
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null
    };

    secureStorage.removeItem('auth-token');
    secureStorage.removeItem('auth-user');
    this.notifyListeners();
  }

  public async refreshToken(): Promise<boolean> {
    if (!this.authState.token) {
      return false;
    }

    try {
      // Token refresh implementation
      // In a real implementation, this would call an API endpoint to refresh the token
      if (this.authState.token === 'invalid') {
        throw new Error('Invalid token');
      }

      // Simulate API call to refresh token
      // In production, replace this with actual API call:
      // const response = await fetch('/api/auth/refresh', {
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${this.authState.token}` }
      // });
      // const data = await response.json();
      // this.authState.token = data.accessToken;
      
      await new Promise(resolve => setTimeout(resolve, 100));

      return true;
    } catch (error) {
      logger.error('Token refresh failed:', error);
      this.clearAuth();
      return false;
    }
  }

  public hasPermission(permission: string): boolean {
    if (!this.authState.user) {
      return false;
    }
    return this.authState.user.permissions.includes(permission) || 
           this.authState.user.role === 'admin';
  }

  public hasRole(role: string): boolean {
    return this.authState.user?.role === role;
  }

  public isAdmin(): boolean {
    return this.hasRole('admin');
  }

  public isCISO(): boolean {
    return this.hasRole('ciso') || this.hasRole('security-manager');
  }

  public isAuditor(): boolean {
    return this.hasRole('auditor') || this.hasRole('compliance-manager');
  }

  // MFA Management Methods
  public async getMFAStatus(): Promise<any> {
    if (!this.authState.user) {
      throw new Error('User not authenticated');
    }
    return await mfaService.getMFAStatus(this.authState.user.id, this.authState.user.role);
  }

  public async setupMFA(method: 'totp' | 'email'): Promise<any> {
    if (!this.authState.user) {
      throw new Error('User not authenticated');
    }
    return await mfaService.setupMFA(this.authState.user.id, method);
  }

  public async verifyMFA(verification: any): Promise<boolean> {
    if (!this.authState.user) {
      throw new Error('User not authenticated');
    }
    return await mfaService.verifyMFA(this.authState.user.id, verification);
  }

  public async enableMFA(): Promise<void> {
    if (!this.authState.user) {
      throw new Error('User not authenticated');
    }
    await mfaService.enableMFA(this.authState.user.id);
  }

  public async disableMFA(): Promise<void> {
    if (!this.authState.user) {
      throw new Error('User not authenticated');
    }
    await mfaService.disableMFA(this.authState.user.id);
  }

  public isMFARequired(): boolean {
    if (!this.authState.user) {
      return false;
    }
    return mfaService.isMFARequired(this.authState.user.role);
  }

  public async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    if (!this.authState.user) {
      throw new Error('User not authenticated');
    }

    try {
      // In a real implementation, you would call an API to update the profile
      const updatedUser = {
        ...this.authState.user,
        ...updates
      };

      this.authState.user = updatedUser;
      await secureStorage.setUserData(updatedUser);
      this.notifyListeners();

      return updatedUser as UserProfile;
    } catch (error) {
      logger.error('Profile update failed:', error);
      throw error;
    }
  }

  public async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    if (!this.authState.user) {
      throw new Error('User not authenticated');
    }

    try {
      // In a real implementation, you would call an API to change the password
      logger.info('Password change requested for user:', this.authState.user.email);
    } catch (error) {
      logger.error('Password change failed:', error);
      throw error;
    }
  }

  public async resetPassword(email: string): Promise<void> {
    try {
      // In a real implementation, you would call an API to reset the password
      logger.info('Password reset requested for email:', email);
    } catch (error) {
      logger.error('Password reset failed:', error);
      throw error;
    }
  }

  public getToken(): string | null {
    return this.authState.token;
  }

  public isTokenExpired(): boolean {
    if (!this.authState.token) {
      return true;
    }

    try {
      // In a real implementation, you would decode the JWT and check expiration
      // For now, we'll assume tokens are valid for 24 hours
      const tokenData = JSON.parse(atob(this.authState.token.split('.')[1]));
      const expirationTime = tokenData.exp * 1000;
      return Date.now() >= expirationTime;
    } catch (error) {
      logger.error('Failed to parse token:', error);
      return true;
    }
  }
}

export const authService = AuthService.getInstance();