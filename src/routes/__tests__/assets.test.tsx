import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { assetRoutes } from '../assets';
import { assetService } from '../../services/assetService';

// Mock the asset service
vi.mock('../../services/assetService', () => ({
  assetService: {
    getAllAssets: vi.fn(() => [
      { id: '1', name: 'Test Asset', type: 'Server' }
    ])
  }
}));

// Mock the LazyComponents
vi.mock('../../components/LazyComponents', () => ({
  AssetDashboard: ({ assets, onViewInventory }: any) => (
    <div data-testid="asset-dashboard">
      <div>Assets: {assets?.length}</div>
      <button onClick={onViewInventory}>View Inventory</button>
    </div>
  ),
  AssetInventoryView: ({ assets }: any) => (
    <div data-testid="asset-inventory">
      <div>Inventory: {assets?.length}</div>
    </div>
  )
}));

describe('Asset Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render asset dashboard route', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter initialEntries={["/assets"]}>{children}</MemoryRouter>
    );

    const RouteComponent = assetRoutes[0].element as React.ComponentType;
    const { getByTestId, getByText } = render(<RouteComponent />, { wrapper });

    expect(getByTestId('asset-dashboard')).toBeInTheDocument();
    expect(getByText(/Assets: 1/)).toBeInTheDocument();
  });

  it('should render asset inventory route', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter initialEntries={["/assets/inventory"]}>{children}</MemoryRouter>
    );

    const RouteComponent = assetRoutes[1].element as React.ComponentType;
    const { getByTestId } = render(<RouteComponent />, { wrapper });

    expect(getByTestId('asset-inventory')).toBeInTheDocument();
  });

  it('should have correct route configuration', () => {
    expect(assetRoutes).toBeInstanceOf(Array);
    expect(assetRoutes.length).toBeGreaterThan(0);
    
    // Check first route
    expect(assetRoutes[0].path).toBe('/assets');
    expect(assetRoutes[0].title).toBe('Asset Dashboard');
    
    // Check second route
    expect(assetRoutes[1].path).toBe('/assets/inventory');
    expect(assetRoutes[1].title).toBe('Asset Inventory');
  });
});

