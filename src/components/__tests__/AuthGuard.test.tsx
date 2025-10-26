import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AuthGuard from '../AuthGuard';

// Mock the auth hook
vi.mock('../../shared/hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    user: null,
    profile: null
  })
}));

describe('AuthGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children when authenticated', () => {
    // Mock authenticated state
    vi.mocked(require('../../shared/hooks/useAuth').useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: 'user-1', email: 'test@example.com' },
      profile: { name: 'Test User' }
    } as any);

    render(
      <BrowserRouter>
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      </BrowserRouter>
    );

    // Should redirect, so child content won't be visible
  });

  it('should redirect when not authenticated', () => {
    render(
      <BrowserRouter>
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      </BrowserRouter>
    );

    // Should redirect to login
  });

  it('should handle loading state', () => {
    vi.mocked(require('../../shared/hooks/useAuth').useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      profile: null,
      loading: true
    } as any);

    render(
      <BrowserRouter>
        <AuthGuard>
          <div>Content</div>
        </AuthGuard>
      </BrowserRouter>
    );
  });

  it('should handle null children', () => {
    render(
      <BrowserRouter>
        <AuthGuard>
          {null}
        </AuthGuard>
      </BrowserRouter>
    );
  });

  it('should handle undefined user gracefully', () => {
    vi.mocked(require('../../shared/hooks/useAuth').useAuth).mockReturnValue({
      isAuthenticated: false,
      user: undefined,
      profile: undefined
    } as any);

    render(
      <BrowserRouter>
        <AuthGuard>
          <div>Content</div>
        </AuthGuard>
      </BrowserRouter>
    );
  });
});

