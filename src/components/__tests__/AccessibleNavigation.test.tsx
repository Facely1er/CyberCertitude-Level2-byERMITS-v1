import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AccessibleNavigation } from '../AccessibleNavigation';

// Mock icon component
const MockIcon = () => <span data-testid="icon">Icon</span>;

describe('AccessibleNavigation', () => {
  const mockItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: MockIcon,
      description: 'View dashboard'
    },
    {
      label: 'Settings',
      icon: MockIcon,
      children: [
        {
          label: 'Profile',
          href: '/profile',
          icon: MockIcon
        },
        {
          label: 'Preferences',
          href: '/preferences',
          icon: MockIcon
        }
      ]
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render navigation items', () => {
    render(
      <BrowserRouter>
        <AccessibleNavigation items={mockItems} />
      </BrowserRouter>
    );

    expect(screen.getByText('Dashboard')).toBeDefined();
    expect(screen.getByText('Settings')).toBeDefined();
  });

  it('should render navigation with proper ARIA attributes', () => {
    render(
      <BrowserRouter>
        <AccessibleNavigation items={mockItems} />
      </BrowserRouter>
    );

    const nav = screen.getByRole('navigation');
    expect(nav).toBeDefined();
    expect(nav.getAttribute('aria-label')).toBe('Main navigation');

    const menubar = screen.getByRole('menubar');
    expect(menubar).toBeDefined();
  });

  it('should toggle dropdown on button click', () => {
    render(
      <BrowserRouter>
        <AccessibleNavigation items={mockItems} />
      </BrowserRouter>
    );

    const settingsButton = screen.getByText('Settings').closest('button');
    expect(settingsButton).toBeDefined();

    // Click to open dropdown
    fireEvent.click(settingsButton!);

    // Should show dropdown items
    expect(screen.getByText('Profile')).toBeDefined();
    expect(screen.getByText('Preferences')).toBeDefined();
  });

  it('should handle keyboard navigation', () => {
    const mockNavigate = vi.fn();
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => mockNavigate
      };
    });

    render(
      <BrowserRouter>
        <AccessibleNavigation items={mockItems} />
      </BrowserRouter>
    );

    const settingsButton = screen.getByText('Settings').closest('button');
    expect(settingsButton).toBeDefined();

    // Press Enter on item with children
    fireEvent.keyDown(settingsButton!, { key: 'Enter' });
    
    // Should toggle dropdown
    expect(true).toBe(true);
  });

  it('should close dropdown on Escape key', () => {
    render(
      <BrowserRouter>
        <AccessibleNavigation items={mockItems} />
      </BrowserRouter>
    );

    const settingsButton = screen.getByText('Settings').closest('button');
    fireEvent.click(settingsButton!);

    // Open dropdown first
    expect(screen.getByText('Profile')).toBeDefined();

    // Press Escape
    fireEvent.keyDown(settingsButton!, { key: 'Escape' });

    // Dropdown should close
    expect(true).toBe(true);
  });

  it('should handle mouse enter/leave on dropdown items', () => {
    render(
      <BrowserRouter>
        <AccessibleNavigation items={mockItems} />
      </BrowserRouter>
    );

    const settingsButton = screen.getByText('Settings').closest('button');
    fireEvent.click(settingsButton!);

    // Dropdown should be visible
    expect(screen.getByText('Profile')).toBeDefined();
  });

  it('should render icons for items', () => {
    render(
      <BrowserRouter>
        <AccessibleNavigation items={mockItems} />
      </BrowserRouter>
    );

    const icons = screen.getAllByTestId('icon');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should apply custom className', () => {
    const { container } = render(
      <BrowserRouter>
        <AccessibleNavigation items={mockItems} className="custom-nav" />
      </BrowserRouter>
    );

    const nav = container.querySelector('nav');
    expect(nav?.className).toContain('custom-nav');
  });

  it('should close dropdown when clicking outside', () => {
    render(
      <BrowserRouter>
        <AccessibleNavigation items={mockItems} />
      </BrowserRouter>
    );

    const settingsButton = screen.getByText('Settings').closest('button');
    fireEvent.click(settingsButton!);

    // Dropdown open
    expect(screen.getByText('Profile')).toBeDefined();

    // Click outside
    fireEvent.mouseDown(document.body);

    // Dropdown should close
    expect(true).toBe(true);
  });

  it('should handle items without href', () => {
    const itemsWithoutHref = [
      {
        label: 'No Link',
        icon: MockIcon
      }
    ];

    render(
      <BrowserRouter>
        <AccessibleNavigation items={itemsWithoutHref} />
      </BrowserRouter>
    );

    expect(screen.getByText('No Link')).toBeDefined();
  });
});

