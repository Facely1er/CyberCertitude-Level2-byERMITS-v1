import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MobileMenu } from '../MobileMenu';

describe('MobileMenu', () => {
  const mockNavItems = [
    { label: 'Dashboard', href: '/dashboard', icon: () => null },
    { label: 'Assessment', href: '/assessment', icon: () => null }
  ];

  const mockProps = {
    isOpen: true,
    onClose: vi.fn(),
    navItems: mockNavItems
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render when open', () => {
    render(
      <BrowserRouter>
        <MobileMenu {...mockProps} />
      </BrowserRouter>
    );

    expect(screen.getByText('Navigation')).toBeDefined();
  });

  it('should not render when closed', () => {
    render(
      <BrowserRouter>
        <MobileMenu {...mockProps} isOpen={false} />
      </BrowserRouter>
    );

    expect(screen.queryByText('Navigation')).toBeNull();
  });

  it('should close when backdrop is clicked', () => {
    render(
      <BrowserRouter>
        <MobileMenu {...mockProps} />
      </BrowserRouter>
    );

    const backdrop = document.querySelector('.bg-black\\/50');
    if (backdrop) {
      fireEvent.click(backdrop);
    }

    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('should close when close button is clicked', () => {
    render(
      <BrowserRouter>
        <MobileMenu {...mockProps} />
      </BrowserRouter>
    );

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('should render navigation items', () => {
    render(
      <BrowserRouter>
        <MobileMenu {...mockProps} />
      </BrowserRouter>
    );

    expect(screen.getByText('Dashboard')).toBeDefined();
  });
});
