import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EvidenceCollectionDashboard from '../EvidenceCollectionDashboard';
import { dataService } from '@/services/dataService';

// Mock the data service
const mockDataService = {
  saveEvidence: vi.fn(),
  getEvidence: vi.fn(() => []),
  deleteEvidence: vi.fn(),
  updateEvidence: vi.fn()
};

vi.mock('@/services/dataService', () => ({
  dataService: mockDataService
}));

// Mock the file upload service
vi.mock('@/services/fileUploadService', () => ({
  fileUploadService: {
    uploadFile: vi.fn(() => Promise.resolve({ url: 'test-url', filename: 'test.pdf' })),
    validateFile: vi.fn(() => ({ valid: true, errors: [] }))
  }
}));

// Mock the security middleware
vi.mock('@/services/securityMiddleware', () => ({
  securityMiddleware: {
    validateFileUpload: vi.fn(() => ({ valid: true, errors: [] })),
    logSecurityEvent: vi.fn()
  }
}));

const mockEvidence = [
  {
    id: '1',
    title: 'Security Policy Document',
    description: 'Organization security policy',
    type: 'policy',
    status: 'approved',
    uploadDate: '2024-01-15',
    tags: ['security', 'policy'],
    fileUrl: 'https://example.com/policy.pdf',
    fileName: 'security-policy.pdf',
    fileSize: 1024000,
    uploadedBy: 'John Doe',
    reviewStatus: 'approved',
    reviewDate: '2024-01-16',
    reviewer: 'Jane Smith'
  },
  {
    id: '2',
    title: 'Access Control Procedures',
    description: 'User access control procedures',
    type: 'procedure',
    status: 'pending',
    uploadDate: '2024-01-14',
    tags: ['access-control', 'procedures'],
    fileUrl: 'https://example.com/procedures.pdf',
    fileName: 'access-control-procedures.pdf',
    fileSize: 512000,
    uploadedBy: 'John Doe',
    reviewStatus: 'pending',
    reviewDate: null,
    reviewer: null
  }
];

const renderEvidenceDashboard = () => {
  return render(
    <BrowserRouter>
      <EvidenceCollectionDashboard
        onBack={() => {}}
        addNotification={() => {}}
      />
    </BrowserRouter>
  );
};

describe('EvidenceCollectionDashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderEvidenceDashboard();
    expect(screen.getByText(/Evidence Collection Dashboard/i)).toBeInTheDocument();
  });

  it('displays dashboard header and description', () => {
    renderEvidenceDashboard();
    
    expect(screen.getByText(/Manage Compliance Documentation/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload, organize, and track evidence for CMMC compliance/i)).toBeInTheDocument();
  });

  it('shows evidence upload form', () => {
    renderEvidenceDashboard();
    
    expect(screen.getByText(/Upload New Evidence/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tags/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/File/i)).toBeInTheDocument();
  });

  it('handles evidence upload with valid data', async () => {
    renderEvidenceDashboard();
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: 'Test Evidence' }
    });
    
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: 'Test evidence description' }
    });
    
    fireEvent.change(screen.getByLabelText(/Type/i), {
      target: { value: 'policy' }
    });
    
    fireEvent.change(screen.getByLabelText(/Tags/i), {
      target: { value: 'test, evidence' }
    });
    
    // Mock file input
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText(/File/i);
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Submit form
    const uploadButton = screen.getByRole('button', { name: /Upload Evidence/i });
    fireEvent.click(uploadButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Evidence uploaded successfully/i)).toBeInTheDocument();
    });
  });

  it('validates required fields during upload', async () => {
    renderEvidenceDashboard();
    
    // Try to submit without filling required fields
    const uploadButton = screen.getByRole('button', { name: /Upload Evidence/i });
    fireEvent.click(uploadButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Description is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Type is required/i)).toBeInTheDocument();
      expect(screen.getByText(/File is required/i)).toBeInTheDocument();
    });
  });

  it('shows evidence type options', () => {
    renderEvidenceDashboard();
    
    const typeSelect = screen.getByLabelText(/Type/i);
    fireEvent.click(typeSelect);
    
    expect(screen.getByText(/Policy/i)).toBeInTheDocument();
    expect(screen.getByText(/Procedure/i)).toBeInTheDocument();
    expect(screen.getByText(/Training Material/i)).toBeInTheDocument();
    expect(screen.getByText(/Incident Report/i)).toBeInTheDocument();
    expect(screen.getByText(/Audit Report/i)).toBeInTheDocument();
    expect(screen.getByText(/Other/i)).toBeInTheDocument();
  });

  it('displays evidence list when available', () => {
    // Mock the data service to return evidence
    mockDataService.getEvidence.mockReturnValue(mockEvidence);
    renderEvidenceDashboard();
    
    expect(screen.getByText(/Security Policy Document/i)).toBeInTheDocument();
    expect(screen.getByText(/Access Control Procedures/i)).toBeInTheDocument();
  });

  it('shows evidence details in list', () => {
    mockDataService.getEvidence.mockReturnValue(mockEvidence);
    renderEvidenceDashboard();
    
    // Check for evidence details
    expect(screen.getByText(/Organization security policy/i)).toBeInTheDocument();
    expect(screen.getByText(/User access control procedures/i)).toBeInTheDocument();
    expect(screen.getByText(/security, policy/i)).toBeInTheDocument();
    expect(screen.getByText(/access-control, procedures/i)).toBeInTheDocument();
  });

  it('shows evidence status indicators', () => {
    mockDataService.getEvidence.mockReturnValue(mockEvidence);
    renderEvidenceDashboard();
    
    expect(screen.getByText(/Approved/i)).toBeInTheDocument();
    expect(screen.getByText(/Pending/i)).toBeInTheDocument();
  });

  it('handles evidence filtering by type', () => {
    mockDataService.getEvidence.mockReturnValue(mockEvidence);
    renderEvidenceDashboard();
    
    const filterSelect = screen.getByLabelText(/Filter by Type/i);
    fireEvent.change(filterSelect, { target: { value: 'policy' } });
    
    // Should only show policy evidence
    expect(screen.getByText(/Security Policy Document/i)).toBeInTheDocument();
    expect(screen.queryByText(/Access Control Procedures/i)).not.toBeInTheDocument();
  });

  it('handles evidence search', () => {
    mockDataService.getEvidence.mockReturnValue(mockEvidence);
    renderEvidenceDashboard();
    
    const searchInput = screen.getByPlaceholderText(/Search evidence.../i);
    fireEvent.change(searchInput, { target: { value: 'Security' } });
    
    // Should only show evidence containing "Security"
    expect(screen.getByText(/Security Policy Document/i)).toBeInTheDocument();
    expect(screen.queryByText(/Access Control Procedures/i)).not.toBeInTheDocument();
  });

  it('handles evidence sorting', () => {
    mockDataService.getEvidence.mockReturnValue(mockEvidence);
    renderEvidenceDashboard();
    
    const sortSelect = screen.getByLabelText(/Sort by/i);
    fireEvent.change(sortSelect, { target: { value: 'uploadDate' } });
    
    // Should sort by upload date
    expect(screen.getByText(/Access Control Procedures/i)).toBeInTheDocument();
    expect(screen.getByText(/Security Policy Document/i)).toBeInTheDocument();
  });

  it('handles evidence deletion', async () => {
    mockDataService.getEvidence.mockReturnValue(mockEvidence);
    renderEvidenceDashboard();
    
    // Find delete button for first evidence item
    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButtons[0]);
    
    // Should show confirmation dialog
    expect(screen.getByText(/Are you sure you want to delete this evidence?/i)).toBeInTheDocument();
    
    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /Delete/i });
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(mockDataService.deleteEvidence).toHaveBeenCalledWith('1');
    });
  });

  it('handles evidence editing', async () => {
    mockDataService.getEvidence.mockReturnValue(mockEvidence);
    renderEvidenceDashboard();
    
    // Find edit button for first evidence item
    const editButtons = screen.getAllByRole('button', { name: /Edit/i });
    fireEvent.click(editButtons[0]);
    
    // Should show edit form
    expect(screen.getByText(/Edit Evidence/i)).toBeInTheDocument();
    
    // Update title
    const titleInput = screen.getByLabelText(/Title/i);
    fireEvent.change(titleInput, { target: { value: 'Updated Security Policy' } });
    
    // Save changes
    const saveButton = screen.getByRole('button', { name: /Save Changes/i });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(mockDataService.updateEvidence).toHaveBeenCalled();
    });
  });

  it('shows evidence statistics', () => {
    mockDataService.getEvidence.mockReturnValue(mockEvidence);
    renderEvidenceDashboard();
    
    expect(screen.getByText(/Total Evidence/i)).toBeInTheDocument();
    expect(screen.getByText(/2/i)).toBeInTheDocument();
    
    expect(screen.getByText(/Approved/i)).toBeInTheDocument();
    expect(screen.getByText(/1/i)).toBeInTheDocument();
    
    expect(screen.getByText(/Pending/i)).toBeInTheDocument();
    expect(screen.getByText(/1/i)).toBeInTheDocument();
  });

  it('handles file validation', async () => {
    renderEvidenceDashboard();
    
    // Try to upload invalid file type
    const file = new File(['test content'], 'test.exe', { type: 'application/x-msdownload' });
    const fileInput = screen.getByLabelText(/File/i);
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Should show validation error
    expect(screen.getByText(/Invalid file type. Please upload a supported file format./i)).toBeInTheDocument();
  });

  it('handles file size validation', async () => {
    renderEvidenceDashboard();
    
    // Create a large file (over 10MB)
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText(/File/i);
    fireEvent.change(fileInput, { target: { files: [largeFile] } });
    
    // Should show size validation error
    expect(screen.getByText(/File size exceeds maximum limit of 10MB./i)).toBeInTheDocument();
  });

  it('shows evidence review workflow', () => {
    mockDataService.getEvidence.mockReturnValue(mockEvidence);
    renderEvidenceDashboard();
    
    // Should show review status for each evidence
    expect(screen.getByText(/Review Status/i)).toBeInTheDocument();
    expect(screen.getByText(/Approved/i)).toBeInTheDocument();
    expect(screen.getByText(/Pending/i)).toBeInTheDocument();
  });

  it('handles evidence approval', async () => {

    mockDataService.getEvidence.mockReturnValue(mockEvidence);

    renderEvidenceDashboard();
    
    // Find approve button for pending evidence
    const approveButtons = screen.getAllByRole('button', { name: /Approve/i });
    fireEvent.click(approveButtons[0]);
    

    await waitFor(() => {
      expect(mockDataService.updateEvidence).toHaveBeenCalledWith(

        expect.objectContaining({
          id: '2',
          reviewStatus: 'approved'
        })
      );
    });
  });

  it('handles evidence rejection', async () => {

    mockDataService.getEvidence.mockReturnValue(mockEvidence);

    renderEvidenceDashboard();
    
    // Find reject button for pending evidence
    const rejectButtons = screen.getAllByRole('button', { name: /Reject/i });
    fireEvent.click(rejectButtons[0]);
    
    // Should show rejection reason input
    expect(screen.getByLabelText(/Rejection Reason/i)).toBeInTheDocument();
    
    // Enter reason and submit
    const reasonInput = screen.getByLabelText(/Rejection Reason/i);
    fireEvent.change(reasonInput, { target: { value: 'Insufficient detail' } });
    
    const submitButton = screen.getByRole('button', { name: /Submit Rejection/i });
    fireEvent.click(submitButton);
    

    await waitFor(() => {
      expect(mockDataService.updateEvidence).toHaveBeenCalledWith(

        expect.objectContaining({
          id: '2',
          reviewStatus: 'rejected',
          rejectionReason: 'Insufficient detail'
        })
      );
    });
  });

  it('exports evidence data', async () => {

    mockDataService.getEvidence.mockReturnValue(mockEvidence);

    renderEvidenceDashboard();
    
    const exportButton = screen.getByRole('button', { name: /Export/i });
    fireEvent.click(exportButton);
    
    // Should show export options
    expect(screen.getByText(/Export Format/i)).toBeInTheDocument();
    expect(screen.getByText(/CSV/i)).toBeInTheDocument();
    expect(screen.getByText(/JSON/i)).toBeInTheDocument();
    expect(screen.getByText(/PDF/i)).toBeInTheDocument();
  });

  it('shows evidence tags management', () => {
    renderEvidenceDashboard();
    
    expect(screen.getByText(/Manage Tags/i)).toBeInTheDocument();
    
    const manageTagsButton = screen.getByRole('button', { name: /Manage Tags/i });
    fireEvent.click(manageTagsButton);
    
    // Should show tag management interface
    expect(screen.getByText(/Tag Management/i)).toBeInTheDocument();
  });

  it('handles bulk evidence operations', () => {

    mockDataService.getEvidence.mockReturnValue(mockEvidence);

    renderEvidenceDashboard();
    
    // Select multiple evidence items
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]); // Select first evidence
    fireEvent.click(checkboxes[2]); // Select second evidence
    
    // Should show bulk operations
    expect(screen.getByText(/Bulk Operations/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Bulk Delete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Bulk Approve/i })).toBeInTheDocument();
  });
});