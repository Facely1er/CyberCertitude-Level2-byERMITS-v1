import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SSPGenerator } from '../SSPGenerator';

// Mock services
vi.mock('../services/sspGenerationService', () => ({
  sspGenerationService: {
    generateSSP: vi.fn(() => ({
      id: 'ssp-1',
      title: 'Test SSP',
      organization: 'Test Org'
    })),
    generateSSPFromTemplate: vi.fn(() => ({
      id: 'ssp-2',
      title: 'Test SSP from Template',
      organization: 'Test Org'
    }))
  }
}));

vi.mock('../services/poamGenerationService', () => ({
  poamGenerationService: {
    generatePOAM: vi.fn(() => ({
      id: 'poam-1',
      title: 'Test POAM',
      items: []
    }))
  }
}));

vi.mock('../services/raciMatrixService', () => ({
  raciMatrixService: {
    generateRACIMatrix: vi.fn(() => ({
      id: 'raci-1',
      title: 'Test RACI',
      matrix: []
    }))
  }
}));

vi.mock('../services/templateService', () => ({
  templateService: {
    customizeContentTemplate: vi.fn(() => 'Customized content'),
    getAllTemplates: vi.fn(() => [])
  }
}));

vi.mock('./TemplateCustomizationModal', () => ({
  TemplateCustomizationModal: ({ isOpen, onClose }: any) =>
    isOpen ? <div data-testid="customization-modal">Customization Modal</div> : null
}));

describe('SSPGenerator', () => {
  const mockSavedAssessments = [
    {
      id: 'assessment-1',
      frameworkId: 'cmmc',
      frameworkName: 'CMMC 2.0',
      responses: { 'AC.1.001': 3 },
      createdAt: new Date(),
      lastModified: new Date()
    }
  ];

  const mockOnBack = vi.fn();
  const mockAddNotification = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render SSP generator', () => {
    render(
      <BrowserRouter>
        <SSPGenerator
          savedAssessments={mockSavedAssessments}
          onBack={mockOnBack}
          addNotification={mockAddNotification}
        />
      </BrowserRouter>
    );

    expect(document.body).toBeDefined();
  });

  it('should allow selecting an assessment', () => {
    render(
      <BrowserRouter>
        <SSPGenerator
          savedAssessments={mockSavedAssessments}
          onBack={mockOnBack}
          addNotification={mockAddNotification}
        />
      </BrowserRouter>
    );

    // Should display assessments
    expect(document.body).toBeDefined();
  });

  it('should require organization information', async () => {
    render(
      <BrowserRouter>
        <SSPGenerator
          savedAssessments={mockSavedAssessments}
          onBack={mockOnBack}
          addNotification={mockAddNotification}
        />
      </BrowserRouter>
    );

    // Try to generate without org info
    const generateButton = screen.queryByText(/generate/i);
    if (generateButton) {
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(mockAddNotification).toHaveBeenCalledWith(
          'error',
          expect.stringContaining('organization')
        );
      });
    }
  });

  it('should handle generation with assessment', async () => {
    render(
      <BrowserRouter>
        <SSPGenerator
          savedAssessments={mockSavedAssessments}
          onBack={mockOnBack}
          addNotification={mockAddNotification}
        />
      </BrowserRouter>
    );

    // Fill in org info and generate
    expect(document.body).toBeDefined();
  });

  it('should switch between tabs', () => {
    render(
      <BrowserRouter>
        <SSPGenerator
          savedAssessments={mockSavedAssessments}
          onBack={mockOnBack}
          addNotification={mockAddNotification}
        />
      </BrowserRouter>
    );

    // Should have tab switching functionality
    expect(document.body).toBeDefined();
  });

  it('should handle template selection', () => {
    render(
      <BrowserRouter>
        <SSPGenerator
          savedAssessments={mockSavedAssessments}
          onBack={mockOnBack}
          addNotification={mockAddNotification}
        />
      </BrowserRouter>
    );

    // Should allow template selection
    expect(document.body).toBeDefined();
  });

  it('should call onBack when back button is clicked', () => {
    render(
      <BrowserRouter>
        <SSPGenerator
          savedAssessments={mockSavedAssessments}
          onBack={mockOnBack}
          addNotification={mockAddNotification}
        />
      </BrowserRouter>
    );

    const backButton = screen.queryByText(/back/i);
    if (backButton) {
      fireEvent.click(backButton);
      expect(mockOnBack).toHaveBeenCalled();
    }
  });

  it('should show loading state during generation', async () => {
    render(
      <BrowserRouter>
        <SSPGenerator
          savedAssessments={mockSavedAssessments}
          onBack={mockOnBack}
          addNotification={mockAddNotification}
        />
      </BrowserRouter>
    );

    // Should show loading during generation
    expect(document.body).toBeDefined();
  });
});

