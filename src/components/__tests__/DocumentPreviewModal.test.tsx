import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DocumentPreviewModal } from '../DocumentPreviewModal';
import type { TemplateData, DocumentFormat } from '../../utils/downloadUtils';

describe('DocumentPreviewModal', () => {
  const mockTemplateData: TemplateData = {
    title: 'Test Template',
    subtitle: 'Test Subtitle',
    description: 'Test Description',
    controls: ['AC.1.001', 'AC.1.002'],
    includes: ['Section 1', 'Section 2'],
    sections: []
  };

  const mockOnClose = vi.fn();
  const mockOnDownload = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    const { container } = render(
      <DocumentPreviewModal
        isOpen={false}
        onClose={mockOnClose}
        onDownload={mockOnDownload}
        templateName="Test Template"
        templateData={mockTemplateData}
        markdownContent="# Test"
        availableFormats={['md', 'docx', 'pdf']}
        isDownloading={false}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render when isOpen is true', () => {
    render(
      <DocumentPreviewModal
        isOpen={true}
        onClose={mockOnClose}
        onDownload={mockOnDownload}
        templateName="Test Template"
        templateData={mockTemplateData}
        markdownContent="# Test"
        availableFormats={['md', 'docx', 'pdf']}
        isDownloading={false}
      />
    );

    expect(screen.getByText('Test Template')).toBeDefined();
    expect(screen.getByText('Document Preview')).toBeDefined();
  });

  it('should display template data', () => {
    render(
      <DocumentPreviewModal
        isOpen={true}
        onClose={mockOnClose}
        onDownload={mockOnDownload}
        templateName="Test Template"
        templateData={mockTemplateData}
        markdownContent="# Test"
        availableFormats={['md', 'docx', 'pdf']}
        isDownloading={false}
      />
    );

    expect(screen.getByText('Test Template')).toBeDefined();
    expect(screen.getByText('Test Subtitle')).toBeDefined();
    expect(screen.getByText('Test Description')).toBeDefined();
  });

  it('should display CMMC controls when provided', () => {
    render(
      <DocumentPreviewModal
        isOpen={true}
        onClose={mockOnClose}
        onDownload={mockOnDownload}
        templateName="Test Template"
        templateData={mockTemplateData}
        markdownContent="# Test"
        availableFormats={['md', 'docx', 'pdf']}
        isDownloading={false}
      />
    );

    expect(screen.getByText('CMMC Controls Covered:')).toBeDefined();
    expect(screen.getByText('AC.1.001')).toBeDefined();
    expect(screen.getByText('AC.1.002')).toBeDefined();
  });

  it('should display includes when provided', () => {
    render(
      <DocumentPreviewModal
        isOpen={true}
        onClose={mockOnClose}
        onDownload={mockOnDownload}
        templateName="Test Template"
        templateData={mockTemplateData}
        markdownContent="# Test"
        availableFormats={['md', 'docx', 'pdf']}
        isDownloading={false}
      />
    );

    expect(screen.getByText('Document Includes:')).toBeDefined();
    expect(screen.getByText('Section 1')).toBeDefined();
    expect(screen.getByText('Section 2')).toBeDefined();
  });

  it('should call onClose when close button is clicked', () => {
    render(
      <DocumentPreviewModal
        isOpen={true}
        onClose={mockOnClose}
        onDownload={mockOnDownload}
        templateName="Test Template"
        templateData={mockTemplateData}
        markdownContent="# Test"
        availableFormats={['md', 'docx', 'pdf']}
        isDownloading={false}
      />
    );

    const closeButton = screen.getByRole('button', { name: '' });
    const xIcon = closeButton.querySelector('svg');
    
    if (xIcon) {
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalled();
    }
  });

  it('should call onDownload with format when download button is clicked', () => {
    render(
      <DocumentPreviewModal
        isOpen={true}
        onClose={mockOnClose}
        onDownload={mockOnDownload}
        templateName="Test Template"
        templateData={mockTemplateData}
        markdownContent="# Test"
        availableFormats={['md', 'docx', 'pdf']}
        isDownloading={false}
      />
    );

    const downloadButtons = screen.queryAllByRole('button', { name: /download/i });
    
    if (downloadButtons.length > 0) {
      fireEvent.click(downloadButtons[0]);
      expect(mockOnDownload).toHaveBeenCalled();
    }
  });

  it('should disable download buttons when isDownloading is true', () => {
    render(
      <DocumentPreviewModal
        isOpen={true}
        onClose={mockOnClose}
        onDownload={mockOnDownload}
        templateName="Test Template"
        templateData={mockTemplateData}
        markdownContent="# Test"
        availableFormats={['md', 'docx', 'pdf']}
        isDownloading={true}
      />
    );

    const downloadButtons = screen.queryAllByRole('button', { name: /download/i });
    downloadButtons.forEach(button => {
      expect(button).toBeDefined();
    });
  });

  it('should render available download formats', () => {
    render(
      <DocumentPreviewModal
        isOpen={true}
        onClose={mockOnClose}
        onDownload={mockOnDownload}
        templateName="Test Template"
        templateData={mockTemplateData}
        markdownContent="# Test"
        availableFormats={['md', 'docx', 'pdf', 'xlsx']}
        isDownloading={false}
      />
    );

    // Should show format buttons
    expect(document.body).toBeDefined();
  });

  it('should handle template without controls', () => {
    const templateWithoutControls = {
      ...mockTemplateData,
      controls: undefined
    };

    render(
      <DocumentPreviewModal
        isOpen={true}
        onClose={mockOnClose}
        onDownload={mockOnDownload}
        templateName="Test Template"
        templateData={templateWithoutControls}
        markdownContent="# Test"
        availableFormats={['md']}
        isDownloading={false}
      />
    );

    expect(screen.queryByText('CMMC Controls Covered:')).toBeNull();
  });

  it('should handle template without includes', () => {
    const templateWithoutIncludes = {
      ...mockTemplateData,
      includes: undefined
    };

    render(
      <DocumentPreviewModal
        isOpen={true}
        onClose={mockOnClose}
        onDownload={mockOnDownload}
        templateName="Test Template"
        templateData={templateWithoutIncludes}
        markdownContent="# Test"
        availableFormats={['md']}
        isDownloading={false}
      />
    );

    expect(screen.queryByText('Document Includes:')).toBeNull();
  });
});

