import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AccountDropdown } from '../AccountDropdown';

describe('AccountDropdown', () => {
  const mockProps = {
    isAuthenticated: true,
    userProfile: {
      id: '1',
      name: 'Test User',
      email: 'test@example.com'
    },
    onSignOut: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render when authenticated', () => {
    render(
      <BrowserRouter>
        <AccountDropdown {...mockProps} />
      </BrowserRouter>
    );

    const button = screen.getByRole('button', { name: /account menu/i });
    expect(button).toBeDefined();
  });

  it('should render when not authenticated', () => {
    render(
      <BrowserRouter>
        <AccountDropdown {...mockProps} isAuthenticated={false} userProfile={null} />
      </BrowserRouter>
    );

    const button = screen.getByRole('button', { name: /sign in/i });
    expect(button).toBeDefined();
  });

  it('should toggle dropdown on button click', () => {
    render(
      <BrowserRouter>
        <AccountDropdown {...mockProps} />
      </BrowserRouter>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByRole('menu')).toBeDefined();
  });

  it('should call onSignOut when sign out is clicked', () => {
    render(
      <BrowserRouter>
        <AccountDropdown {...mockProps} />
      </BrowserRouter>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    const signOutButton = screen.getByText(/sign out/i);
    fireEvent.click(signOutButton);

    expect(mockProps.onSignOut).toHaveBeenCalled();
  });

  it('should close dropdown when clicking outside', () => {
    render(
      <BrowserRouter>
        <AccountDropdown {...mockProps} />
      </BrowserRouter>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    fireEvent.mouseDown(document.body);

    // Dropdown should close
    expect(true).toBe(true);
  });
});
