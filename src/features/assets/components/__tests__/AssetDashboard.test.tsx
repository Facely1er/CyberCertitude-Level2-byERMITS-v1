import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AssetDashboard from '../AssetDashboard';

import { dataService } from '@/services/dataService';

// Mock the data service
vi.mock('@/services/dataService', () => ({
  dataService: {
    saveAsset: vi.fn(),
    getAssets: vi.fn(() => []),
    deleteAsset: vi.fn(),
    updateAsset: vi.fn(),
    getAssetCategories: vi.fn(() => ['servers', 'workstations', 'network', 'software', 'data'])
  }
}));

// Mock the security middleware
vi.mock('@/services/securityMiddleware', () => ({
  securityMiddleware: {
    validateInput: vi.fn(() => ({ valid: true, sanitized: 'test', errors: [] })),
    logSecurityEvent: vi.fn()
  }
}));

const mockAssets = [
  {
    id: '1',
    name: 'Web Server 01',
    type: 'server',
    category: 'servers',
    description: 'Primary web application server',
    location: 'Data Center A',
    status: 'active',
    criticality: 'high',
    dataTypes: ['PII', 'CUI'],
    regulatoryRequirements: ['CMMC', 'HIPAA'],
    lastUpdated: '2024-01-15',
    owner: 'IT Department',
    tags: ['web', 'production', 'critical']
  },
  {
    id: '2',
    name: 'Workstation 001',
    type: 'workstation',
    category: 'workstations',
    description: 'Development workstation',
    location: 'Office Floor 2',
    status: 'active',
    criticality: 'medium',
    dataTypes: ['development'],
    regulatoryRequirements: ['CMMC'],
    lastUpdated: '2024-01-14',
    owner: 'Development Team',
    tags: ['development', 'office']
  }
];

const renderAssetDashboard = () => {
  return render(
    <BrowserRouter>
      <AssetDashboard
        onBack={() => {}}
        addNotification={() => {}}
      />
    </BrowserRouter>
  );
};

describe('AssetDashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderAssetDashboard();
    expect(screen.getByText(/Asset Inventory Management/i)).toBeInTheDocument();
  });

  it('displays dashboard header and description', () => {
    renderAssetDashboard();
    
    expect(screen.getByText(/Manage Your Organization's Assets/i)).toBeInTheDocument();
    expect(screen.getByText(/Track and manage assets for CMMC compliance/i)).toBeInTheDocument();
  });

  it('shows asset creation form', () => {
    renderAssetDashboard();
    
    expect(screen.getByText(/Add New Asset/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Asset Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Asset Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
  });

  it('handles asset creation with valid data', async () => {
    renderAssetDashboard();
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Asset Name/i), {
      target: { value: 'Test Server' }
    });
    
    fireEvent.change(screen.getByLabelText(/Asset Type/i), {
      target: { value: 'server' }
    });
    
    fireEvent.change(screen.getByLabelText(/Category/i), {
      target: { value: 'servers' }
    });
    
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: 'Test server description' }
    });
    
    fireEvent.change(screen.getByLabelText(/Location/i), {
      target: { value: 'Test Location' }
    });
    
    fireEvent.change(screen.getByLabelText(/Criticality/i), {
      target: { value: 'high' }
    });
    
    // Submit form
    const addButton = screen.getByRole('button', { name: /Add Asset/i });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(require('@/services/dataService').dataService.saveAsset).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Server',
          type: 'server',
          category: 'servers',
          description: 'Test server description',
          location: 'Test Location',
          criticality: 'high'
        })
      );
    });
  });

  it('validates required fields during asset creation', async () => {
    renderAssetDashboard();
    
    // Try to submit without filling required fields
    const addButton = screen.getByRole('button', { name: /Add Asset/i });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Asset name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Asset type is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Category is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Description is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Location is required/i)).toBeInTheDocument();
    });
  });

  it('shows asset type options', () => {
    renderAssetDashboard();
    
    const typeSelect = screen.getByLabelText(/Asset Type/i);
    fireEvent.click(typeSelect);
    
    expect(screen.getByText(/Server/i)).toBeInTheDocument();
    expect(screen.getByText(/Workstation/i)).toBeInTheDocument();
    expect(screen.getByText(/Network Device/i)).toBeInTheDocument();
    expect(screen.getByText(/Software/i)).toBeInTheDocument();
    expect(screen.getByText(/Data/i)).toBeInTheDocument();
  });

  it('shows asset category options', () => {
    renderAssetDashboard();
    
    const categorySelect = screen.getByLabelText(/Category/i);
    fireEvent.click(categorySelect);
    
    expect(screen.getByText(/Servers/i)).toBeInTheDocument();
    expect(screen.getByText(/Workstations/i)).toBeInTheDocument();
    expect(screen.getByText(/Network/i)).toBeInTheDocument();
    expect(screen.getByText(/Software/i)).toBeInTheDocument();
    expect(screen.getByText(/Data/i)).toBeInTheDocument();
  });

  it('shows criticality levels', () => {
    renderAssetDashboard();
    
    const criticalitySelect = screen.getByLabelText(/Criticality/i);
    fireEvent.click(criticalitySelect);
    
    expect(screen.getByText(/Low/i)).toBeInTheDocument();
    expect(screen.getByText(/Medium/i)).toBeInTheDocument();
    expect(screen.getByText(/High/i)).toBeInTheDocument();
    expect(screen.getByText(/Critical/i)).toBeInTheDocument();
  });

  it('displays asset list when available', () => {
    // Mock the data service to return assets
    vi.mocked(dataService.getAssets).mockReturnValue(mockAssets);
    
    renderAssetDashboard();
    
    expect(screen.getByText(/Web Server 01/i)).toBeInTheDocument();
    expect(screen.getByText(/Workstation 001/i)).toBeInTheDocument();
  });

  it('shows asset details in list', () => {
    vi.mocked(dataService.getAssets).mockReturnValue(mockAssets);
    
    renderAssetDashboard();
    
    // Check for asset details
    expect(screen.getByText(/Primary web application server/i)).toBeInTheDocument();
    expect(screen.getByText(/Development workstation/i)).toBeInTheDocument();
    expect(screen.getByText(/Data Center A/i)).toBeInTheDocument();
    expect(screen.getByText(/Office Floor 2/i)).toBeInTheDocument();
  });

  it('shows asset status indicators', () => {
    vi.mocked(dataService.getAssets).mockReturnValue(mockAssets);
    
    renderAssetDashboard();
    
    expect(screen.getByText(/Active/i)).toBeInTheDocument();
    expect(screen.getByText(/High/i)).toBeInTheDocument();
    expect(screen.getByText(/Medium/i)).toBeInTheDocument();
  });

  it('handles asset filtering by type', () => {
    vi.mocked(dataService.getAssets).mockReturnValue(mockAssets);
    
    renderAssetDashboard();
    
    const filterSelect = screen.getByLabelText(/Filter by Type/i);
    fireEvent.change(filterSelect, { target: { value: 'server' } });
    
    // Should only show server assets
    expect(screen.getByText(/Web Server 01/i)).toBeInTheDocument();
    expect(screen.queryByText(/Workstation 001/i)).not.toBeInTheDocument();
  });

  it('handles asset filtering by category', () => {
    vi.mocked(dataService.getAssets).mockReturnValue(mockAssets);
    
    renderAssetDashboard();
    
    const filterSelect = screen.getByLabelText(/Filter by Category/i);
    fireEvent.change(filterSelect, { target: { value: 'workstations' } });
    
    // Should only show workstation assets
    expect(screen.getByText(/Workstation 001/i)).toBeInTheDocument();
    expect(screen.queryByText(/Web Server 01/i)).not.toBeInTheDocument();
  });

  it('handles asset filtering by criticality', () => {
    vi.mocked(dataService.getAssets).mockReturnValue(mockAssets);
    
    renderAssetDashboard();
    
    const filterSelect = screen.getByLabelText(/Filter by Criticality/i);
    fireEvent.change(filterSelect, { target: { value: 'high' } });
    
    // Should only show high criticality assets
    expect(screen.getByText(/Web Server 01/i)).toBeInTheDocument();
    expect(screen.queryByText(/Workstation 001/i)).not.toBeInTheDocument();
  });

  it('handles asset search', () => {
    vi.mocked(dataService.getAssets).mockReturnValue(mockAssets);
    
    renderAssetDashboard();
    
    const searchInput = screen.getByPlaceholderText(/Search assets.../i);
    fireEvent.change(searchInput, { target: { value: 'Web Server' } });
    
    // Should only show assets containing "Web Server"
    expect(screen.getByText(/Web Server 01/i)).toBeInTheDocument();
    expect(screen.queryByText(/Workstation 001/i)).not.toBeInTheDocument();
  });

  it('handles asset sorting', () => {
    vi.mocked(dataService.getAssets).mockReturnValue(mockAssets);
    
    renderAssetDashboard();
    
    const sortSelect = screen.getByLabelText(/Sort by/i);
    fireEvent.change(sortSelect, { target: { value: 'name' } });
    
    // Should sort by name
    expect(screen.getByText(/Web Server 01/i)).toBeInTheDocument();
    expect(screen.getByText(/Workstation 001/i)).toBeInTheDocument();
  });

  it('handles asset deletion', async () => {
    vi.mocked(dataService.getAssets).mockReturnValue(mockAssets);
    
    renderAssetDashboard();
    
    // Find delete button for first asset
    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButtons[0]);
    
    // Should show confirmation dialog
    expect(screen.getByText(/Are you sure you want to delete this asset?/i)).toBeInTheDocument();
    
    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /Delete/i });
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(require('@/services/dataService').dataService.deleteAsset).toHaveBeenCalledWith('1');
    });
  });

  it('handles asset editing', async () => {
    vi.mocked(dataService.getAssets).mockReturnValue(mockAssets);
    
    renderAssetDashboard();
    
    // Find edit button for first asset
    const editButtons = screen.getAllByRole('button', { name: /Edit/i });
    fireEvent.click(editButtons[0]);
    
    // Should show edit form
    expect(screen.getByText(/Edit Asset/i)).toBeInTheDocument();
    
    // Update name
    const nameInput = screen.getByLabelText(/Asset Name/i);
    fireEvent.change(nameInput, { target: { value: 'Updated Web Server' } });
    
    // Save changes
    const saveButton = screen.getByRole('button', { name: /Save Changes/i });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(require('@/services/dataService').dataService.updateAsset).toHaveBeenCalled();
    });
  });

  it('shows asset statistics', () => {
    vi.mocked(dataService.getAssets).mockReturnValue(mockAssets);
    
    renderAssetDashboard();
    
    expect(screen.getByText(/Total Assets/i)).toBeInTheDocument();
    expect(screen.getByText(/2/i)).toBeInTheDocument();
    
    expect(screen.getByText(/Servers/i)).toBeInTheDocument();
    expect(screen.getByText(/1/i)).toBeInTheDocument();
    
    expect(screen.getByText(/Workstations/i)).toBeInTheDocument();
    expect(screen.getByText(/1/i)).toBeInTheDocument();
  });

  it('shows asset criticality distribution', () => {
    vi.mocked(dataService.getAssets).mockReturnValue(mockAssets);
    
    renderAssetDashboard();
    
    expect(screen.getByText(/Criticality Distribution/i)).toBeInTheDocument();
    expect(screen.getByText(/High/i)).toBeInTheDocument();
    expect(screen.getByText(/Medium/i)).toBeInTheDocument();
  });

  it('handles data types input', () => {
    renderAssetDashboard();
    
    const dataTypesInput = screen.getByLabelText(/Data Types/i);
    fireEvent.change(dataTypesInput, { target: { value: 'PII, CUI, PHI' } });
    
    expect(dataTypesInput).toHaveValue('PII, CUI, PHI');
  });

  it('handles regulatory requirements input', () => {
    renderAssetDashboard();
    
    const regRequirementsInput = screen.getByLabelText(/Regulatory Requirements/i);
    fireEvent.change(regRequirementsInput, { target: { value: 'CMMC, HIPAA, SOX' } });
    
    expect(regRequirementsInput).toHaveValue('CMMC, HIPAA, SOX');
  });

  it('handles tags input', () => {
    renderAssetDashboard();
    
    const tagsInput = screen.getByLabelText(/Tags/i);
    fireEvent.change(tagsInput, { target: { value: 'production, critical, web' } });
    
    expect(tagsInput).toHaveValue('production, critical, web');
  });

  it('shows asset owner information', () => {
    vi.mocked(dataService.getAssets).mockReturnValue(mockAssets);
    
    renderAssetDashboard();
    
    expect(screen.getByText(/IT Department/i)).toBeInTheDocument();
    expect(screen.getByText(/Development Team/i)).toBeInTheDocument();
  });

  it('shows last updated information', () => {
    vi.mocked(dataService.getAssets).mockReturnValue(mockAssets);
    
    renderAssetDashboard();
    
    expect(screen.getByText(/2024-01-15/i)).toBeInTheDocument();
    expect(screen.getByText(/2024-01-14/i)).toBeInTheDocument();
  });

  it('exports asset data', async () => {
    vi.mocked(dataService.getAssets).mockReturnValue(mockAssets);
    
    renderAssetDashboard();
    
    const exportButton = screen.getByRole('button', { name: /Export/i });
    fireEvent.click(exportButton);
    
    // Should show export options
    expect(screen.getByText(/Export Format/i)).toBeInTheDocument();
    expect(screen.getByText(/CSV/i)).toBeInTheDocument();
    expect(screen.getByText(/JSON/i)).toBeInTheDocument();
    expect(screen.getByText(/PDF/i)).toBeInTheDocument();
  });

  it('shows asset risk assessment', () => {
    vi.mocked(dataService.getAssets).mockReturnValue(mockAssets);
    
    renderAssetDashboard();
    
    expect(screen.getByText(/Risk Assessment/i)).toBeInTheDocument();
    
    const riskButton = screen.getByRole('button', { name: /Assess Risk/i });
    fireEvent.click(riskButton);
    
    // Should show risk assessment interface
    expect(screen.getByText(/Asset Risk Assessment/i)).toBeInTheDocument();
  });

  it('handles bulk asset operations', () => {
    vi.mocked(dataService.getAssets).mockReturnValue(mockAssets);
    
    renderAssetDashboard();
    
    // Select multiple assets
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]); // Select first asset
    fireEvent.click(checkboxes[2]); // Select second asset
    
    // Should show bulk operations
    expect(screen.getByText(/Bulk Operations/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Bulk Delete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Bulk Update/i })).toBeInTheDocument();
  });

  it('shows asset compliance status', () => {
    vi.mocked(dataService.getAssets).mockReturnValue(mockAssets);
    
    renderAssetDashboard();
    
    expect(screen.getByText(/Compliance Status/i)).toBeInTheDocument();
    
    // Should show compliance indicators for each asset
    expect(screen.getByText(/CMMC/i)).toBeInTheDocument();
    expect(screen.getByText(/HIPAA/i)).toBeInTheDocument();
  });

  it('handles asset location management', () => {
    renderAssetDashboard();
    
    expect(screen.getByText(/Location Management/i)).toBeInTheDocument();
    
    const locationButton = screen.getByRole('button', { name: /Manage Locations/i });
    fireEvent.click(locationButton);
    
    // Should show location management interface
    expect(screen.getByText(/Asset Locations/i)).toBeInTheDocument();
  });

  it('shows asset lifecycle management', () => {
    vi.mocked(dataService.getAssets).mockReturnValue(mockAssets);
    
    renderAssetDashboard();
    
    expect(screen.getByText(/Lifecycle Management/i)).toBeInTheDocument();
    
    // Should show lifecycle stages
    expect(screen.getByText(/Active/i)).toBeInTheDocument();
    expect(screen.getByText(/Retired/i)).toBeInTheDocument();
    expect(screen.getByText(/Maintenance/i)).toBeInTheDocument();
  });
});