import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
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

    const nav = screen.getByRole('navigation', { name: /breadcrumb/i });
    // There can be multiple Dashboard strings (sr-only + link); assert links and current item
    const dashboardLinks = within(nav).getAllByRole('link', { name: /dashboard/i });
    expect(dashboardLinks.length).toBeGreaterThanOrEqual(1);
    expect(within(nav).getByRole('link', { name: /assets/i })).toBeInTheDocument();
    expect(within(nav).getByText('Current Page')).toBeInTheDocument();
  });

  it('should show active item', () => {
    render(
      <BrowserRouter>
        <Breadcrumbs items={mockItems} />
      </BrowserRouter>
    );

    const nav = screen.getByRole('navigation', { name: /breadcrumb/i });
    const activeItem = within(nav).getByText('Current Page');
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

    const nav = screen.getByRole('navigation', { name: /breadcrumb/i });
    expect(within(nav).getByText('Clickable')).toBeInTheDocument();
    expect(within(nav).getByText('Current')).toBeInTheDocument();
  });
});

