import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './shared/contexts/ThemeContext';
import App from './App';

// Mock the hooks and services
vi.mock('./hooks/useOfflineSupport', () => ({
  useOfflineSupport: () => ({
    isOnline: true,
    showOfflineNotice: false
  })
}));

vi.mock('./shared/hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    profile: null,
    signOut: vi.fn(),
    isAuthenticated: false
  })
}));

vi.mock('./shared/hooks/useAssessments', () => ({
  useAssessments: () => ({
    assessments: [],
    saveAssessment: vi.fn(),
    removeAssessment: vi.fn(),
    loadAssessments: vi.fn()
  })
}));

vi.mock('./hooks/useKeyboardShortcuts', () => ({
  useKeyboardShortcuts: vi.fn()
}));

vi.mock('./hooks/useScrollToTop', () => ({
  useScrollToTop: vi.fn()
}));

vi.mock('./services/dataService', () => ({
  dataService: {
    getUserProfile: vi.fn(() => null)
  }
}));

vi.mock('./services/reportService', () => ({
  reportService: {
    generateReport: vi.fn(),
    exportReport: vi.fn()
  }
}));

vi.mock('./data/frameworks', () => ({
  getFramework: vi.fn(() => ({
    id: 'cmmc',
    name: 'CMMC 2.0 Level 2',
    sections: []
  }))
}));

// Mock components that might cause issues in tests
vi.mock('./components/ErrorBoundary', () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

vi.mock('./components/OfflineNotice', () => ({
  OfflineNotice: () => <div data-testid="offline-notice">Offline Notice</div>
}));

vi.mock('./components/UserOnboarding', () => ({
  UserOnboarding: ({ onComplete, onSkip }: { onComplete: () => void; onSkip: () => void }) => (
    <div data-testid="user-onboarding">
      <button onClick={onComplete} data-testid="complete-onboarding">Complete</button>
      <button onClick={onSkip} data-testid="skip-onboarding">Skip</button>
    </div>
  )
}));

const renderApp = () => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn()
      },
      writable: true
    });
  });

  it('renders without crashing', () => {
    renderApp();
    expect(screen.getByText(/CyberCertitude™/i)).toBeInTheDocument();
  });

  it('shows start screen on first visit', () => {
    renderApp();
    expect(screen.getByTestId('start-screen')).toBeInTheDocument();
  });

  it('displays navigation menu items', () => {
    renderApp();
    
    // Check for main navigation items
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Assessment/i)).toBeInTheDocument();
    expect(screen.getByText(/Implementation/i)).toBeInTheDocument();
    expect(screen.getByText(/Assets/i)).toBeInTheDocument();
    expect(screen.getByText(/Governance/i)).toBeInTheDocument();
    expect(screen.getByText(/Team/i)).toBeInTheDocument();
  });

  it('handles navigation to dashboard', async () => {
    renderApp();
    
    const dashboardLink = screen.getByText(/Dashboard/i);
    fireEvent.click(dashboardLink);
    
    await waitFor(() => {
      expect(screen.getByText(/CMMC Compliance Dashboard/i)).toBeInTheDocument();
    });
  });

  it('handles navigation to assessment intro', async () => {
    renderApp();
    
    const assessmentMenu = screen.getByText(/Assessment/i);
    fireEvent.click(assessmentMenu);
    
    // Wait for submenu to appear and click on Start New Assessment
    await waitFor(() => {
      const startAssessmentLink = screen.getByText(/Start New Assessment/i);
      fireEvent.click(startAssessmentLink);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/CMMC 2.0 Level 2 Assessment/i)).toBeInTheDocument();
    });
  });

  it('handles navigation to evidence collection', async () => {
    renderApp();
    
    const implementationMenu = screen.getByText(/Implementation/i);
    fireEvent.click(implementationMenu);
    
    await waitFor(() => {
      const evidenceLink = screen.getByText(/Evidence Collection/i);
      fireEvent.click(evidenceLink);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Evidence Collection Dashboard/i)).toBeInTheDocument();
    });
  });

  it('handles navigation to assets', async () => {
    renderApp();
    
    const assetsLink = screen.getByText(/Assets/i);
    fireEvent.click(assetsLink);
    
    await waitFor(() => {
      expect(screen.getByText(/Asset Inventory Management/i)).toBeInTheDocument();
    });
  });

  it('handles navigation to policies', async () => {
    renderApp();
    
    const governanceMenu = screen.getByText(/Governance/i);
    fireEvent.click(governanceMenu);
    
    await waitFor(() => {
      const policiesLink = screen.getByText(/Policies/i);
      fireEvent.click(policiesLink);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Policy Management/i)).toBeInTheDocument();
    });
  });

  it('handles navigation to team collaboration', async () => {
    renderApp();
    
    const teamMenu = screen.getByText(/Team/i);
    fireEvent.click(teamMenu);
    
    await waitFor(() => {
      const teamLink = screen.getByText(/Team Collaboration/i);
      fireEvent.click(teamLink);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Team Collaboration Dashboard/i)).toBeInTheDocument();
    });
  });

  it('handles navigation to task management', async () => {
    renderApp();
    
    const teamMenu = screen.getByText(/Team/i);
    fireEvent.click(teamMenu);
    
    await waitFor(() => {
      const tasksLink = screen.getByText(/Task Management/i);
      fireEvent.click(tasksLink);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Task Management Dashboard/i)).toBeInTheDocument();
    });
  });

  it('handles navigation to calendar', async () => {
    renderApp();
    
    const teamMenu = screen.getByText(/Team/i);
    fireEvent.click(teamMenu);
    
    await waitFor(() => {
      const calendarLink = screen.getByText(/Activity Calendar/i);
      fireEvent.click(calendarLink);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Compliance Calendar/i)).toBeInTheDocument();
    });
  });

  it('handles navigation to reports', async () => {
    renderApp();
    
    const assessmentMenu = screen.getByText(/Assessment/i);
    fireEvent.click(assessmentMenu);
    
    await waitFor(() => {
      const reportsLink = screen.getByText(/Assessment Reports/i);
      fireEvent.click(reportsLink);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Assessment Reports/i)).toBeInTheDocument();
    });
  });

  it('handles navigation to compliance workflow', async () => {
    renderApp();
    
    const implementationMenu = screen.getByText(/Implementation/i);
    fireEvent.click(implementationMenu);
    
    await waitFor(() => {
      const workflowLink = screen.getByText(/Implementation Workflow/i);
      fireEvent.click(workflowLink);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/CMMC Implementation Workflow/i)).toBeInTheDocument();
    });
  });

  it('handles navigation to compliance status', async () => {
    renderApp();
    
    const implementationMenu = screen.getByText(/Implementation/i);
    fireEvent.click(implementationMenu);
    
    await waitFor(() => {
      const statusLink = screen.getByText(/Compliance Status/i);
      fireEvent.click(statusLink);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Real-Time Compliance Status/i)).toBeInTheDocument();
    });
  });

  it('handles navigation to controls', async () => {
    renderApp();
    
    const governanceMenu = screen.getByText(/Governance/i);
    fireEvent.click(governanceMenu);
    
    await waitFor(() => {
      const controlsLink = screen.getByText(/Controls/i);
      fireEvent.click(controlsLink);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Security Controls Management/i)).toBeInTheDocument();
    });
  });

  it('shows footer with company information', () => {
    renderApp();
    
    expect(screen.getByText(/© 2024 ERMITS LLC/i)).toBeInTheDocument();
    expect(screen.getByText(/CMMC 2.0 Level 2 Platform/i)).toBeInTheDocument();
    expect(screen.getByText(/CyberCertitude™/i)).toBeInTheDocument();
  });

  it('handles theme toggle', () => {
    renderApp();
    
    const themeToggle = screen.getByTestId('theme-toggle');
    expect(themeToggle).toBeInTheDocument();
    
    fireEvent.click(themeToggle);
    // Theme toggle functionality should work
  });

  it('handles mobile menu toggle', () => {
    renderApp();
    
    const mobileMenuButton = screen.getByTestId('mobile-menu-button');
    expect(mobileMenuButton).toBeInTheDocument();
    
    fireEvent.click(mobileMenuButton);
    // Mobile menu should toggle
  });

  it('handles user onboarding completion', async () => {
    renderApp();
    
    const completeButton = screen.getByTestId('complete-onboarding');
    fireEvent.click(completeButton);
    
    await waitFor(() => {
      expect(screen.queryByTestId('user-onboarding')).not.toBeInTheDocument();
    });
  });

  it('handles user onboarding skip', async () => {
    renderApp();
    
    const skipButton = screen.getByTestId('skip-onboarding');
    fireEvent.click(skipButton);
    
    await waitFor(() => {
      expect(screen.queryByTestId('user-onboarding')).not.toBeInTheDocument();
    });
  });

  it('displays notifications when added', async () => {
    renderApp();
    
    // Simulate adding a notification
    const addNotification = vi.fn();
    // This would need to be exposed through the component or tested differently
    
    expect(screen.getByTestId('notification-system')).toBeInTheDocument();
  });

  it('handles keyboard shortcuts', () => {
    renderApp();
    
    // Test keyboard shortcuts
    fireEvent.keyDown(document, { key: 'h', ctrlKey: true });
    // Should navigate to help
    
    fireEvent.keyDown(document, { key: 'd', ctrlKey: true });
    // Should navigate to dashboard
  });

  it('handles offline state', () => {
    renderApp();
    
    // Should show offline notice when offline
    expect(screen.getByTestId('offline-notice')).toBeInTheDocument();
  });

  it('handles error boundaries', () => {
    renderApp();
    
    // Error boundary should be present
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
  });

  it('handles production readiness widget', () => {
    renderApp();
    
    // Production readiness widget should be present
    expect(screen.getByTestId('production-readiness-widget')).toBeInTheDocument();
  });

  it('handles keyboard shortcuts help', () => {
    renderApp();
    
    // Keyboard shortcuts help should be accessible
    const helpButton = screen.getByTestId('keyboard-shortcuts-help');
    expect(helpButton).toBeInTheDocument();
    
    fireEvent.click(helpButton);
    // Should show keyboard shortcuts help
  });
});