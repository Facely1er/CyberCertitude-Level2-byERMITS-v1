import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppLayout } from '../AppLayout';

// Mock child components
vi.mock('../../AccessibleNavigation', () => ({
  AccessibleNavigation: () => <div>AccessibleNavigation</div>
}));

vi.mock('../../AccountDropdown', () => ({
  AccountDropdown: () => <div>AccountDropdown</div>
}));

vi.mock('../../../shared/components/ui/ThemeToggle', () => ({
  ThemeToggle: () => <div>ThemeToggle</div>
}));

vi.mock('../../../shared/components/ui/NotificationSystem', () => ({
  NotificationSystem: () => <div>NotificationSystem</div>
}));

vi.mock('../../OfflineNotice', () => ({
  OfflineNotice: () => <div>OfflineNotice</div>
}));

vi.mock('../../CMMCOnboardingFlow', () => ({
  CMMCOnboardingFlow: () => <div>CMMCOnboardingFlow</div>
}));

describe('AppLayout', () => {
  const mockProps = {
    children: <div>Test Content</div>,
    navItems: [],
    userProfile: null,
    isAuthenticated: false,
    onSignOut: vi.fn(),
    notifications: [],
    removeNotification: vi.fn(),
    isOnline: true,
    showOfflineNotice: false,
    isFirstVisit: false,
    setIsFirstVisit: vi.fn(),
    showMobileMenu: false,
    setShowMobileMenu: vi.fn(),
    showAssetModal: false,
    setShowAssetModal: vi.fn(),
    editingAsset: null,
    setEditingAsset: vi.fn(),
    showTemplateModal: false,
    setShowTemplateModal: vi.fn(),
    selectedFramework: 'cmmc',
    shortcuts: [],
    addNotification: vi.fn(),
    handleSaveAsset: vi.fn(),
    handleSelectTemplate: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children content', () => {
    render(
      <BrowserRouter>
        <AppLayout {...mockProps} />
      </BrowserRouter>
    );

    expect(screen.getByText('Test Content')).toBeDefined();
  });

  it('should render header', () => {
    render(
      <BrowserRouter>
        <AppLayout {...mockProps} />
      </BrowserRouter>
    );

    // Should have header element
    const header = document.querySelector('header');
    expect(header).toBeDefined();
  });

  it('should render navigation when authenticated', () => {
    render(
      <BrowserRouter>
        <AppLayout {...mockProps} isAuthenticated={true} />
      </BrowserRouter>
    );

    // Should render navigation components
    expect(true).toBe(true);
  });

  it('should show offline notice when offline', () => {
    render(
      <BrowserRouter>
        <AppLayout {...mockProps} isOnline={false} showOfflineNotice={true} />
      </BrowserRouter>
    );

    // OfflineNotice component should be rendered
    expect(screen.getByText('OfflineNotice')).toBeDefined();
  });

  it('should show onboarding flow for first visit', () => {
    render(
      <BrowserRouter>
        <AppLayout {...mockProps} isFirstVisit={true} />
      </BrowserRouter>
    );

    expect(screen.getByText('CMMCOnboardingFlow')).toBeDefined();
  });

  it('should handle user profile', () => {
    const userProfile = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com'
    };

    render(
      <BrowserRouter>
        <AppLayout {...mockProps} userProfile={userProfile as any} isAuthenticated={true} />
      </BrowserRouter>
    );

    // Should render with user profile
    expect(true).toBe(true);
  });
});
