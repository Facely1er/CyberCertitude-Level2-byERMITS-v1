import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Breadcrumbs } from '../Breadcrumbs';

describe('Breadcrumbs', () => {
  const mockItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Assets', path: '/assets' },
    { label: 'Current Page', isActive: true }
  ];

  it('should render breadcrumbs', () => {
    render(
      <BrowserRouter>
        <Breadcrumbs items={mockItems} />
      </BrowserRouter>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Assets')).toBeInTheDocument();
    expect(screen.getByText('Current Page')).toBeInTheDocument();
  });

  it('should show active item', () => {
    render(
      <BrowserRouter>
        <Breadcrumbs items={mockItems} />
      </BrowserRouter>
    );

    const activeItem = screen.getByText('Current Page');
    expect(activeItem).toBeInTheDocument();
  });

  it('should render with home link', () => {
    render(
      <BrowserRouter>
        <Breadcrumbs items={mockItems} showHome={true} />
      </BrowserRouter>
    );

    // Home icon should be present
    expect(screen.getByLabelText('Go to dashboard')).toBeInTheDocument();
  });

  it('should render without home link', () => {
    render(
      <BrowserRouter>
        <Breadcrumbs items={mockItems} showHome={false} />
      </BrowserRouter>
    );

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  it('should handle empty items array', () => {
    render(
      <BrowserRouter>
        <Breadcrumbs items={[]} />
      </BrowserRouter>
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should handle custom className', () => {
    const { container } = render(
      <BrowserRouter>
        <Breadcrumbs items={mockItems} className="custom-class" />
      </BrowserRouter>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should handle items with onClick', () => {
    const itemsWithOnClick = [
      { label: 'Clickable', onClick: vi.fn() },
      { label: 'Current', isActive: true }
    ];

    render(
      <BrowserRouter>
        <Breadcrumbs items={itemsWithOnClick} />
      </BrowserRouter>
    );

    expect(screen.getByText('Clickable')).toBeInTheDocument();
    expect(screen.getByText('Current')).toBeInTheDocument();
  });
});

