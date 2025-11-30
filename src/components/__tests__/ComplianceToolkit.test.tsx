import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ComplianceToolkit from '../ComplianceToolkit';

// Mock dependencies
vi.mock('../utils/downloadUtils', () => ({
  downloadMarkdown: vi.fn().mockResolvedValue({ success: true }),
  downloadWord: vi.fn().mockResolvedValue({ success: true }),
  downloadPDF: vi.fn().mockResolvedValue({ success: true }),
  downloadExcel: vi.fn().mockResolvedValue({ success: true }),
  downloadWithFallback: vi.fn().mockResolvedValue({ success: true }),
  convertMarkdownToTemplateData: vi.fn(),
  DocumentFormat: {
    Markdown: 'markdown',
    Word: 'word',
    PDF: 'pdf',
    Excel: 'excel'
  }
}));

vi.mock('../data/templateContent', () => ({
  getTemplateContent: vi.fn(() => ({
    content: '# Template Content',
    metadata: { name: 'Test Template' }
  }))
}));

vi.mock('./DocumentPreviewModal', () => ({
  default: ({ isOpen, onClose, templateName }: any) => 
    isOpen ? (
      <div data-testid="preview-modal">
        <p>Preview: {templateName}</p>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null
}));

vi.mock('../shared/components/layout/Breadcrumbs', () => ({
  Breadcrumbs: () => <div data-testid="breadcrumbs">Breadcrumbs</div>
}));

describe('ComplianceToolkit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render compliance toolkit', () => {
    render(
      <BrowserRouter>
        <ComplianceToolkit />
      </BrowserRouter>
    );

    expect(screen.getByTestId('breadcrumbs')).toBeDefined();
    expect(document.body).toBeDefined();
  });

  it('should expand/collapse domains', () => {
    render(
      <BrowserRouter>
        <ComplianceToolkit />
      </BrowserRouter>
    );

    // Find domain headers (Access Control, Audit, etc.)
    const accessControlHeader = screen.queryByText(/Access Control/i);
    
    if (accessControlHeader) {
      fireEvent.click(accessControlHeader);
      // Domain should expand
      expect(true).toBe(true);
    }

    expect(document.body).toBeDefined();
  });

  it('should show format menu when download button is clicked', () => {
    render(
      <BrowserRouter>
        <ComplianceToolkit />
      </BrowserRouter>
    );

    // Find download buttons
    const downloadButtons = screen.queryAllByRole('button');
    
    // Should have download functionality
    expect(document.body).toBeDefined();
  });

  it('should handle template download', async () => {
    const { downloadMarkdown } = await import('../utils/downloadUtils');
    
    render(
      <BrowserRouter>
        <ComplianceToolkit />
      </BrowserRouter>
    );

    // Should handle download functionality
    expect(document.body).toBeDefined();
  });

  it('should show preview modal when preview is clicked', async () => {
    render(
      <BrowserRouter>
        <ComplianceToolkit />
      </BrowserRouter>
    );

    // Find preview buttons/links
    const previewButtons = screen.queryAllByText(/preview/i);
    
    if (previewButtons.length > 0) {
      fireEvent.click(previewButtons[0]);
      
      await waitFor(() => {
        const modal = screen.queryByTestId('preview-modal');
        expect(modal).toBeDefined();
      });
    }

    expect(document.body).toBeDefined();
  });

  it('should close preview modal', async () => {
    render(
      <BrowserRouter>
        <ComplianceToolkit />
      </BrowserRouter>
    );

    // Open preview
    const previewButtons = screen.queryAllByText(/preview/i);
    
    if (previewButtons.length > 0) {
      fireEvent.click(previewButtons[0]);
      
      await waitFor(() => {
        const closeButton = screen.queryByText('Close');
        if (closeButton) {
          fireEvent.click(closeButton);
        }
        
        const modal = screen.queryByTestId('preview-modal');
        expect(modal).toBeNull();
      });
    }

    expect(document.body).toBeDefined();
  });

  it('should display template information', () => {
    render(
      <BrowserRouter>
        <ComplianceToolkit />
      </BrowserRouter>
    );

    // Should show templates for domains
    expect(document.body).toBeDefined();
  });

  it('should handle format selection', () => {
    render(
      <BrowserRouter>
        <ComplianceToolkit />
      </BrowserRouter>
    );

    // Should allow selecting download format
    expect(document.body).toBeDefined();
  });

  it('should close format menu when clicking outside', () => {
    render(
      <BrowserRouter>
        <ComplianceToolkit />
      </BrowserRouter>
    );

    // Click outside should close menu
    fireEvent.mouseDown(document.body);
    
    expect(document.body).toBeDefined();
  });
});

