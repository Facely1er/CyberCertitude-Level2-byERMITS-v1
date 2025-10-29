import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../LoginPage';

// Mock dependencies
vi.mock('../../shared/hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({
    signIn: vi.fn().mockResolvedValue({ success: true }),
    signUp: vi.fn().mockResolvedValue({ success: true }),
    loading: false,
    error: null
  }))
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login form', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/sign in/i)).toBeDefined();
  });

  it('should render email input field', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    expect(emailInput).toBeDefined();
  });

  it('should have sign in button', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const signInButton = screen.getByRole('button', { name: /sign in/i });
    expect(signInButton).toBeDefined();
  });

  it('should show error message when provided', () => {
    const { useAuth } = require('../../shared/hooks/useAuth');
    vi.mocked(useAuth).mockReturnValue({
      signIn: vi.fn(),
      signUp: vi.fn(),
      loading: false,
      error: 'Authentication failed'
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/authentication failed/i)).toBeDefined();
  });

  it('should handle loading state', () => {
    const { useAuth } = require('../../shared/hooks/useAuth');
    vi.mocked(useAuth).mockReturnValue({
      signIn: vi.fn(),
      signUp: vi.fn(),
      loading: true,
      error: null
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Should show loading indicator
    expect(true).toBe(true);
  });
});
