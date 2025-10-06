import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AssessmentIntroScreen from '../AssessmentIntroScreen';

// Mock the navigation hook
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// Mock the data service
vi.mock('@/services/dataService', () => ({
  dataService: {
    saveOrganizationInfo: vi.fn(),
    getOrganizationInfo: vi.fn(() => null)
  }
}));

// Mock the framework data
vi.mock('@/data/frameworks', () => ({
  getFramework: vi.fn(() => ({
    id: 'cmmc',
    name: 'CMMC 2.0 Level 2',
    description: 'Cybersecurity Maturity Model Certification Level 2',
    sections: []
  })),
  getAvailableFrameworks: vi.fn(() => [
    {
      id: 'cmmc',
      name: 'CMMC 2.0 Level 2',
      description: 'Cybersecurity Maturity Model Certification Level 2'
    },
    {
      id: 'nist',
      name: 'NIST SP 800-171',
      description: 'NIST Special Publication 800-171'
    }
  ])
}));

const renderAssessmentIntro = () => {
  return render(
    <BrowserRouter>
      <AssessmentIntroScreen
        onBack={() => {}}
        userProfile={null}
      />
    </BrowserRouter>
  );
};

describe('AssessmentIntroScreen Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderAssessmentIntro();
    expect(screen.getByText(/CMMC 2.0 Level 2 Assessment/i)).toBeInTheDocument();
  });

  it('displays assessment introduction content', () => {
    renderAssessmentIntro();
    
    expect(screen.getByText(/Begin Your CMMC 2.0 Level 2 Journey/i)).toBeInTheDocument();
    expect(screen.getByText(/This assessment will help you evaluate your organization's compliance with CMMC 2.0 Level 2 requirements/i)).toBeInTheDocument();
  });

  it('shows organization information form', () => {
    renderAssessmentIntro();
    
    expect(screen.getByLabelText(/Organization Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Industry/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Size/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Primary Contact Email/i)).toBeInTheDocument();
  });

  it('shows framework selection options', () => {
    renderAssessmentIntro();
    
    expect(screen.getByText(/Select Framework/i)).toBeInTheDocument();
    expect(screen.getByText(/CMMC 2.0 Level 2/i)).toBeInTheDocument();
    expect(screen.getByText(/NIST SP 800-171/i)).toBeInTheDocument();
  });

  it('handles form submission with valid data', async () => {
    renderAssessmentIntro();
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Organization Name/i), {
      target: { value: 'Test Organization' }
    });
    
    fireEvent.change(screen.getByLabelText(/Industry/i), {
      target: { value: 'Technology' }
    });
    
    fireEvent.change(screen.getByLabelText(/Size/i), {
      target: { value: '50-200' }
    });
    
    fireEvent.change(screen.getByLabelText(/Primary Contact Email/i), {
      target: { value: 'test@example.com' }
    });
    
    // Select framework
    const frameworkSelect = screen.getByLabelText(/Select Framework/i);
    fireEvent.change(frameworkSelect, { target: { value: 'cmmc' } });
    
    // Submit form
    const startButton = screen.getByRole('button', { name: /Start Assessment/i });
    fireEvent.click(startButton);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/assessment/new', {
        state: {
          organizationInfo: {
            name: 'Test Organization',
            industry: 'Technology',
            size: '50-200',
            primaryContactEmail: 'test@example.com'
          },
          selectedFramework: 'cmmc'
        }
      });
    });
  });

  it('validates required fields', async () => {
    renderAssessmentIntro();
    
    // Try to submit without filling required fields
    const startButton = screen.getByRole('button', { name: /Start Assessment/i });
    fireEvent.click(startButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Organization name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Industry is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Organization size is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Primary contact email is required/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    renderAssessmentIntro();
    
    // Fill out form with invalid email
    fireEvent.change(screen.getByLabelText(/Organization Name/i), {
      target: { value: 'Test Organization' }
    });
    
    fireEvent.change(screen.getByLabelText(/Industry/i), {
      target: { value: 'Technology' }
    });
    
    fireEvent.change(screen.getByLabelText(/Size/i), {
      target: { value: '50-200' }
    });
    
    fireEvent.change(screen.getByLabelText(/Primary Contact Email/i), {
      target: { value: 'invalid-email' }
    });
    
    // Submit form
    const startButton = screen.getByRole('button', { name: /Start Assessment/i });
    fireEvent.click(startButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('handles back navigation', () => {
    const mockOnBack = vi.fn();
    
    render(
      <BrowserRouter>
        <AssessmentIntroScreen
          onBack={mockOnBack}
          userProfile={null}
        />
      </BrowserRouter>
    );
    
    const backButton = screen.getByRole('button', { name: /Back/i });
    fireEvent.click(backButton);
    
    expect(mockOnBack).toHaveBeenCalled();
  });

  it('shows assessment benefits', () => {
    renderAssessmentIntro();
    
    expect(screen.getByText(/Assessment Benefits/i)).toBeInTheDocument();
    expect(screen.getByText(/Identify compliance gaps/i)).toBeInTheDocument();
    expect(screen.getByText(/Track implementation progress/i)).toBeInTheDocument();
    expect(screen.getByText(/Prepare for C3PAO assessment/i)).toBeInTheDocument();
  });

  it('shows estimated completion time', () => {
    renderAssessmentIntro();
    
    expect(screen.getByText(/Estimated Time/i)).toBeInTheDocument();
    expect(screen.getByText(/30-45 minutes/i)).toBeInTheDocument();
  });

  it('shows framework descriptions', () => {
    renderAssessmentIntro();
    
    expect(screen.getByText(/CMMC 2.0 Level 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Cybersecurity Maturity Model Certification Level 2/i)).toBeInTheDocument();
    
    expect(screen.getByText(/NIST SP 800-171/i)).toBeInTheDocument();
    expect(screen.getByText(/NIST Special Publication 800-171/i)).toBeInTheDocument();
  });

  it('handles framework selection change', () => {
    renderAssessmentIntro();
    
    const frameworkSelect = screen.getByLabelText(/Select Framework/i);
    
    // Select CMMC
    fireEvent.change(frameworkSelect, { target: { value: 'cmmc' } });
    expect(frameworkSelect).toHaveValue('cmmc');
    
    // Select NIST
    fireEvent.change(frameworkSelect, { target: { value: 'nist' } });
    expect(frameworkSelect).toHaveValue('nist');
  });

  it('shows organization size options', () => {
    renderAssessmentIntro();
    
    const sizeSelect = screen.getByLabelText(/Size/i);
    fireEvent.click(sizeSelect);
    
    expect(screen.getByText(/1-50/i)).toBeInTheDocument();
    expect(screen.getByText(/50-200/i)).toBeInTheDocument();
    expect(screen.getByText(/200-1000/i)).toBeInTheDocument();
    expect(screen.getByText(/1000+/i)).toBeInTheDocument();
  });

  it('shows industry options', () => {
    renderAssessmentIntro();
    
    const industrySelect = screen.getByLabelText(/Industry/i);
    fireEvent.click(industrySelect);
    
    expect(screen.getByText(/Technology/i)).toBeInTheDocument();
    expect(screen.getByText(/Healthcare/i)).toBeInTheDocument();
    expect(screen.getByText(/Manufacturing/i)).toBeInTheDocument();
    expect(screen.getByText(/Financial Services/i)).toBeInTheDocument();
    expect(screen.getByText(/Other/i)).toBeInTheDocument();
  });

  it('handles form reset', () => {
    renderAssessmentIntro();
    
    // Fill out some fields
    fireEvent.change(screen.getByLabelText(/Organization Name/i), {
      target: { value: 'Test Organization' }
    });
    
    // Reset form
    const resetButton = screen.getByRole('button', { name: /Reset/i });
    fireEvent.click(resetButton);
    
    // Fields should be cleared
    expect(screen.getByLabelText(/Organization Name/i)).toHaveValue('');
  });

  it('shows loading state during submission', async () => {
    renderAssessmentIntro();
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Organization Name/i), {
      target: { value: 'Test Organization' }
    });
    
    fireEvent.change(screen.getByLabelText(/Industry/i), {
      target: { value: 'Technology' }
    });
    
    fireEvent.change(screen.getByLabelText(/Size/i), {
      target: { value: '50-200' }
    });
    
    fireEvent.change(screen.getByLabelText(/Primary Contact Email/i), {
      target: { value: 'test@example.com' }
    });
    
    // Submit form
    const startButton = screen.getByRole('button', { name: /Start Assessment/i });
    fireEvent.click(startButton);
    
    // Should show loading state
    expect(screen.getByText(/Starting Assessment/i)).toBeInTheDocument();
  });

  it('handles user profile data when available', () => {
    const mockUserProfile = {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      organization: 'Test Org',
      role: 'Security Manager'
    };
    
    render(
      <BrowserRouter>
        <AssessmentIntroScreen
          onBack={() => {}}
          userProfile={mockUserProfile}
        />
      </BrowserRouter>
    );
    
    // Should pre-fill organization name if available
    if (mockUserProfile.organization) {
      expect(screen.getByLabelText(/Organization Name/i)).toHaveValue(mockUserProfile.organization);
    }
  });
});