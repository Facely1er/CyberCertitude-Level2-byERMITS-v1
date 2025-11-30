import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authService } from '../authService';

// Mock the supabase lib
vi.mock('../../lib/supabase', () => ({
  signInWithMagicLink: vi.fn(),
  signUpWithMagicLink: vi.fn(),
  signOut: vi.fn(),
  getCurrentUser: vi.fn(),
  getCurrentSession: vi.fn(),
  isSupabaseReady: true,
  getSupabaseConfig: vi.fn()
}));

// Mock the mfaService
vi.mock('../mfaService', () => ({
  mfaService: {
    getMFAStatus: vi.fn(),
    setupMFA: vi.fn(),
    verifyMFA: vi.fn(),
    enableMFA: vi.fn(),
    disableMFA: vi.fn(),
    isMFARequired: vi.fn()
  }
}));

describe('AuthService', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    
    // Reset auth state
    authService.logout();
  });

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = authService;
      const instance2 = authService;
      expect(instance1).toBe(instance2);
    });
  });

  describe('Authentication state', () => {
    it('should have initial unauthenticated state', () => {
      const state = authService.getAuthState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.loading).toBe(false);
    });

    it('should subscribe to auth state changes', () => {
      let stateReceived = false;
      const unsubscribe = authService.subscribe((state) => {
        stateReceived = true;
      });

      authService.subscribe((state) => {
        // Do nothing
      });

      expect(typeof unsubscribe).toBe('function');
    });
  });

  describe('Token management', () => {
    it('should return null token when not authenticated', () => {
      expect(authService.getToken()).toBeNull();
    });

    it('should check if token is expired', () => {
      expect(authService.isTokenExpired()).toBe(true);
    });

    it('should handle token refresh gracefully', async () => {
      const result = await authService.refreshToken();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('Permission checks', () => {
    it('should return false for permissions when not authenticated', () => {
      expect(authService.hasPermission('read')).toBe(false);
    });

    it('should return false for roles when not authenticated', () => {
      expect(authService.hasRole('admin')).toBe(false);
      expect(authService.isAdmin()).toBe(false);
      expect(authService.isCISO()).toBe(false);
      expect(authService.isAuditor()).toBe(false);
    });
  });

  describe('MFA management', () => {
    it('should handle MFA status request without errors', async () => {
      // Should throw because no user is authenticated
      await expect(authService.getMFAStatus()).rejects.toThrow('User not authenticated');
    });

    it('should handle MFA setup gracefully', async () => {
      await expect(authService.setupMFA('totp')).rejects.toThrow('User not authenticated');
    });

    it('should check if MFA is required', () => {
      expect(authService.isMFARequired()).toBe(false);
    });
  });

  describe('Login errors', () => {
    it('should handle login with invalid credentials gracefully', async () => {
      await expect(authService.login({
        email: 'invalid@example.com',
        password: 'wrong'
      })).rejects.toThrow();
    });

    it('should handle network errors during login', async () => {
      await expect(authService.login({
        email: 'test@example.com',
        password: 'password'
      })).rejects.toThrow();
    });
  });

  describe('Sign up errors', () => {
    it('should handle sign up failures gracefully', async () => {
      const result = await authService.signUp('test@example.com', 'Test User');
      expect(result.success).toBe(false);
    });
  });

  describe('Magic link callback', () => {
    it('should handle magic link callback without errors', async () => {
      const user = await authService.handleMagicLinkCallback();
      // Should return null when no session
      expect(user).toBeNull();
    });
  });

  describe('Logout', () => {
    it('should logout without errors', async () => {
      await expect(authService.logout()).resolves.not.toThrow();
    });

    it('should clear auth state on logout', async () => {
      await authService.logout();
      const state = authService.getAuthState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
    });
  });

  describe('Profile management', () => {
    it('should reject profile update when not authenticated', async () => {
      await expect(authService.updateProfile({})).rejects.toThrow('User not authenticated');
    });

    it('should reject password change when not authenticated', async () => {
      await expect(authService.changePassword('old', 'new')).rejects.toThrow('User not authenticated');
    });

    it('should handle password reset', async () => {
      await expect(authService.resetPassword('test@example.com')).resolves.not.toThrow();
    });
  });

  describe('Error scenarios', () => {
    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage to throw errors
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = vi.fn(() => {
        throw new Error('localStorage unavailable');
      });

      // Should not crash
      expect(() => authService.getAuthState()).not.toThrow();

      localStorage.getItem = originalGetItem;
    });

    it('should handle corrupted user data', () => {
      localStorage.setItem('auth-token', 'valid-token');
      localStorage.setItem('auth-user', 'invalid json {{{');

      // Should not crash
      expect(() => authService.getAuthState()).not.toThrow();
    });

    it('should handle null/undefined tokens', () => {
      localStorage.setItem('auth-token', 'null');

      const state = authService.getAuthState();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('State persistence', () => {
    it('should persist auth state in localStorage', async () => {
      // Set up mock user
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        organization: 'Test Org',
        permissions: ['read'],
        lastLogin: new Date()
      };

      // Simulate authenticated state
      localStorage.setItem('auth-token', 'mock-token');
      localStorage.setItem('auth-user', JSON.stringify(mockUser));

      const state = authService.getAuthState();
      expect(state.user?.email).toBe('test@example.com');
    });
  });
});

