import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';

// Mock dependencies
vi.mock('../../services/authService', () => ({
  authService: {
    subscribe: vi.fn(() => () => {}),
    getAuthState: vi.fn(() => ({
      user: null,
      loading: false,
      error: null
    })),
    login: vi.fn(),
    signUp: vi.fn(),
    logout: vi.fn(),
    handleMagicLinkCallback: vi.fn(),
    isAdmin: vi.fn(() => false),
    isCISO: vi.fn(() => false),
    isAuditor: vi.fn(() => false)
  }
}));

vi.mock('../../services/organizationService', () => ({
  organizationService: {
    getUserOrganizations: vi.fn().mockResolvedValue([])
  }
}));

vi.mock('@/utils/logger', () => ({
  logger: {
    error: vi.fn()
  }
}));

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default auth state', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should subscribe to auth state changes', () => {
    const { authService } = require('../../services/authService');
    
    renderHook(() => useAuth());
    
    expect(authService.subscribe).toHaveBeenCalled();
  });

  it('should sign in user', async () => {
    const { result } = renderHook(() => useAuth());
    const { authService } = require('../../services/authService');
    
    vi.mocked(authService.login).mockResolvedValue(undefined);
    
    await act(async () => {
      const authResult = await result.current.signIn('test@example.com');
      expect(authResult.success).toBe(true);
    });
  });

  it('should handle sign in errors', async () => {
    const { result } = renderHook(() => useAuth());
    const { authService } = require('../../services/authService');
    
    vi.mocked(authService.login).mockRejectedValue(new Error('Login failed'));
    
    await act(async () => {
      const authResult = await result.current.signIn('test@example.com');
      expect(authResult.success).toBe(false);
      expect(authResult.error).toBeDefined();
    });
  });

  it('should sign up user', async () => {
    const { result } = renderHook(() => useAuth());
    const { authService } = require('../../services/authService');
    
    vi.mocked(authService.signUp).mockResolvedValue({ success: true });
    
    await act(async () => {
      const authResult = await result.current.signUp('test@example.com', 'Test User');
      expect(authResult.success).toBe(true);
    });
  });

  it('should sign out user', async () => {
    const { result } = renderHook(() => useAuth());
    const { authService } = require('../../services/authService');
    
    vi.mocked(authService.logout).mockResolvedValue(undefined);
    
    await act(async () => {
      await result.current.signOut();
    });

    expect(authService.logout).toHaveBeenCalled();
  });

  it('should handle magic link callback', async () => {
    const { result } = renderHook(() => useAuth());
    const { authService } = require('../../services/authService');
    
    const mockUser = { id: 'user-1', email: 'test@example.com' };
    vi.mocked(authService.handleMagicLinkCallback).mockResolvedValue(mockUser as any);
    
    await act(async () => {
      const authResult = await result.current.handleMagicLinkCallback();
      expect(authResult.success).toBe(true);
    });
  });

  it('should resend magic link', async () => {
    const { result } = renderHook(() => useAuth());
    const { authService } = require('../../services/authService');
    
    vi.mocked(authService.login).mockResolvedValue(undefined);
    
    await act(async () => {
      const authResult = await result.current.resendMagicLink('test@example.com');
      expect(authResult.success).toBe(true);
    });
  });

  it('should check permissions', () => {
    const { result } = renderHook(() => useAuth());
    
    const hasPermission = result.current.hasPermission('read');
    expect(typeof hasPermission).toBe('boolean');
  });

  it('should check roles', () => {
    const { result } = renderHook(() => useAuth());
    
    const hasRole = result.current.hasRole('admin');
    expect(typeof hasRole).toBe('boolean');
  });

  it('should provide computed auth state', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(typeof result.current.isAdmin).toBe('boolean');
    expect(typeof result.current.isCISO).toBe('boolean');
    expect(typeof result.current.isAuditor).toBe('boolean');
  });
});
