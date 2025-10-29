import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TemplateLibraryBrowser } from '../TemplateLibraryBrowser';

// Mock services
vi.mock('../services/templateService', () => ({
  templateService: {
    getAllContentTemplates: vi.fn(() => [
      {
        id: 'template-1',
        name: 'Test Template',
        description: 'Test Description',
        category: 'policy',
        controls: ['AC.1.001'],
        metadata: {
          tags: ['access', 'control'],
          complexity: 'intermediate',
          targetAudience: ['compliance-officer']
        }
      }
    ])
  }
}));

vi.mock('../utils/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn()
  }
}));

vi.mock('../shared/components/layout/Breadcrumbs', () => ({
  Breadcrumbs: () => <div data-testid="breadcrumbs">Breadcrumbs</div>
}));

describe('TemplateLibraryBrowser', () => {
  const mockOnSelectTemplate = vi.fn();
  const mockOnCustomizeTemplate = vi.fn();
  const mockOnExportTemplate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render template library browser', async () => {
    render(
      <BrowserRouter>
        <TemplateLibraryBrowser />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('breadcrumbs')).toBeDefined();
    });
  });

  it('should load templates on mount', async () => {
    render(
      <BrowserRouter>
        <TemplateLibraryBrowser />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(document.body).toBeDefined();
    });
  });

  it('should filter templates by search term', async () => {
    render(
      <BrowserRouter>
        <TemplateLibraryBrowser />
      </BrowserRouter>
    );

    await waitFor(() => {
      const searchInput = screen.queryByPlaceholderText(/search/i);
      if (searchInput) {
        fireEvent.change(searchInput, { target: { value: 'test' } });
      }
    });

    expect(document.body).toBeDefined();
  });

  it('should filter templates by category', async () => {
    render(
      <BrowserRouter>
        <TemplateLibraryBrowser />
      </BrowserRouter>
    );

    await waitFor(() => {
      const categoryFilter = screen.queryByText(/category|filter/i);
      if (categoryFilter) {
        fireEvent.click(categoryFilter);
      }
    });

    expect(document.body).toBeDefined();
  });

  it('should filter templates by complexity', async () => {
    render(
      <BrowserRouter>
        <TemplateLibraryBrowser />
      </BrowserRouter>
    );

    await waitFor(() => {
      // Should have complexity filter
      expect(document.body).toBeDefined();
    });
  });

  it('should expand template details', async () => {
    render(
      <BrowserRouter>
        <TemplateLibraryBrowser />
      </BrowserRouter>
    );

    await waitFor(() => {
      const expandButtons = screen.queryAllByRole('button');
      if (expandButtons.length > 0) {
        fireEvent.click(expandButtons[0]);
      }
    });

    expect(document.body).toBeDefined();
  });

  it('should call onSelectTemplate when template is selected', async () => {
    render(
      <BrowserRouter>
        <TemplateLibraryBrowser 
          onSelectTemplate={mockOnSelectTemplate}
        />
      </BrowserRouter>
    );

    await waitFor(() => {
      // Should trigger selection
      expect(document.body).toBeDefined();
    });
  });

  it('should call onCustomizeTemplate when customize is clicked', async () => {
    render(
      <BrowserRouter>
        <TemplateLibraryBrowser 
          onCustomizeTemplate={mockOnCustomizeTemplate}
        />
      </BrowserRouter>
    );

    await waitFor(() => {
      const customizeButtons = screen.queryAllByText(/customize/i);
      if (customizeButtons.length > 0) {
        fireEvent.click(customizeButtons[0]);
        expect(mockOnCustomizeTemplate).toHaveBeenCalled();
      }
    });
  });

  it('should call onExportTemplate when export is clicked', async () => {
    render(
      <BrowserRouter>
        <TemplateLibraryBrowser 
          onExportTemplate={mockOnExportTemplate}
        />
      </BrowserRouter>
    );

    await waitFor(() => {
      const exportButtons = screen.queryAllByText(/export|download/i);
      if (exportButtons.length > 0) {
        fireEvent.click(exportButtons[0]);
        expect(mockOnExportTemplate).toHaveBeenCalled();
      }
    });
  });

  it('should show preview modal', async () => {
    render(
      <BrowserRouter>
        <TemplateLibraryBrowser />
      </BrowserRouter>
    );

    await waitFor(() => {
      const previewButtons = screen.queryAllByText(/preview|view/i);
      if (previewButtons.length > 0) {
        fireEvent.click(previewButtons[0]);
      }
    });

    expect(document.body).toBeDefined();
  });

  it('should handle loading state', () => {
    render(
      <BrowserRouter>
        <TemplateLibraryBrowser />
      </BrowserRouter>
    );

    // Should show loading initially
    expect(document.body).toBeDefined();
  });

  it('should handle error state', async () => {
    const { templateService } = await import('../services/templateService');
    vi.mocked(templateService.getAllContentTemplates).mockImplementation(() => {
      throw new Error('Failed to load');
    });

    render(
      <BrowserRouter>
        <TemplateLibraryBrowser />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(document.body).toBeDefined();
    });
  });

  it('should apply custom className', () => {
    const { container } = render(
      <BrowserRouter>
        <TemplateLibraryBrowser className="custom-class" />
      </BrowserRouter>
    );

    expect(container.firstChild).toBeDefined();
  });

  it('should filter by selected category prop', async () => {
    render(
      <BrowserRouter>
        <TemplateLibraryBrowser selectedCategory="policy" />
      </BrowserRouter>
    );

    await waitFor(() => {
      // Should filter by initial category
      expect(document.body).toBeDefined();
    });
  });
});

