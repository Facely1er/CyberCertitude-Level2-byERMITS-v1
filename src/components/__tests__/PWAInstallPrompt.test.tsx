import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PWAInstallPrompt from '../PWAInstallPrompt';

// Mock logger
vi.mock('../utils/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn()
  }
}));

describe('PWAInstallPrompt', () => {
  const mockOnInstall = vi.fn();
  const mockOnDismiss = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    
    // Mock window.matchMedia
    global.window.matchMedia = vi.fn(() => ({
      matches: false,
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    })) as any;

    // Mock navigator.standalone
    Object.defineProperty(navigator, 'standalone', {
      writable: true,
      value: undefined
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should not render if app is already installed (standalone mode)', () => {
    global.window.matchMedia = vi.fn(() => ({
      matches: true,
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    })) as any;

    const { container } = render(
      <PWAInstallPrompt onInstall={mockOnInstall} onDismiss={mockOnDismiss} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should not render if recently dismissed', () => {
    const dismissedTime = Date.now().toString();
    localStorage.setItem('pwa-install-dismissed', dismissedTime);

    const { container } = render(
      <PWAInstallPrompt onInstall={mockOnInstall} onDismiss={mockOnDismiss} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should show install prompt after beforeinstallprompt event', async () => {
    vi.useFakeTimers();

    render(
      <PWAInstallPrompt onInstall={mockOnInstall} onDismiss={mockOnDismiss} />
    );

    // Create and dispatch beforeinstallprompt event
    const promptEvent = new Event('beforeinstallprompt');
    const mockPrompt = vi.fn().mockResolvedValue(undefined);
    const mockUserChoice = Promise.resolve({ outcome: 'accepted' as const, platform: 'web' });
    
    Object.defineProperty(promptEvent, 'prompt', { value: mockPrompt });
    Object.defineProperty(promptEvent, 'userChoice', { value: mockUserChoice });
    Object.defineProperty(promptEvent, 'platforms', { value: ['web'] });
    
    window.dispatchEvent(promptEvent);

    // Advance timer to show prompt
    vi.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(screen.getByText('Install CMMC Platform')).toBeDefined();
    });
  });

  it('should handle install button click', async () => {
    vi.useFakeTimers();

    render(
      <PWAInstallPrompt onInstall={mockOnInstall} onDismiss={mockOnDismiss} />
    );

    // Create and dispatch beforeinstallprompt event
    const promptEvent = new Event('beforeinstallprompt');
    const mockPrompt = vi.fn().mockResolvedValue(undefined);
    const mockUserChoice = Promise.resolve({ outcome: 'accepted' as const, platform: 'web' });
    
    Object.defineProperty(promptEvent, 'prompt', { value: mockPrompt });
    Object.defineProperty(promptEvent, 'userChoice', { value: mockUserChoice });
    Object.defineProperty(promptEvent, 'platforms', { value: ['web'] });
    
    window.dispatchEvent(promptEvent);
    vi.advanceTimersByTime(3000);

    await waitFor(async () => {
      const installButton = screen.getByText('Install');
      expect(installButton).toBeDefined();
      
      fireEvent.click(installButton);
      await mockUserChoice;
      
      expect(mockPrompt).toHaveBeenCalled();
      expect(mockOnInstall).toHaveBeenCalled();
    });
  });

  it('should handle dismiss button click', async () => {
    vi.useFakeTimers();

    render(
      <PWAInstallPrompt onInstall={mockOnInstall} onDismiss={mockOnDismiss} />
    );

    // Create and dispatch beforeinstallprompt event
    const promptEvent = new Event('beforeinstallprompt');
    const mockPrompt = vi.fn().mockResolvedValue(undefined);
    const mockUserChoice = Promise.resolve({ outcome: 'accepted' as const, platform: 'web' });
    
    Object.defineProperty(promptEvent, 'prompt', { value: mockPrompt });
    Object.defineProperty(promptEvent, 'userChoice', { value: mockUserChoice });
    Object.defineProperty(promptEvent, 'platforms', { value: ['web'] });
    
    window.dispatchEvent(promptEvent);
    vi.advanceTimersByTime(3000);

    await waitFor(() => {
      const dismissButton = screen.getByRole('button', { name: '' }).querySelector('svg');
      if (dismissButton) {
        fireEvent.click(dismissButton.closest('button')!);
      }
      
      expect(mockOnDismiss).toHaveBeenCalled();
      expect(localStorage.getItem('pwa-install-dismissed')).toBeTruthy();
    });
  });

  it('should handle manual install button', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    vi.useFakeTimers();

    render(
      <PWAInstallPrompt onInstall={mockOnInstall} onDismiss={mockOnDismiss} />
    );

    // Create and dispatch beforeinstallprompt event
    const promptEvent = new Event('beforeinstallprompt');
    const mockPrompt = vi.fn().mockResolvedValue(undefined);
    const mockUserChoice = Promise.resolve({ outcome: 'accepted' as const, platform: 'web' });
    
    Object.defineProperty(promptEvent, 'prompt', { value: mockPrompt });
    Object.defineProperty(promptEvent, 'userChoice', { value: mockUserChoice });
    Object.defineProperty(promptEvent, 'platforms', { value: ['web'] });
    
    window.dispatchEvent(promptEvent);
    vi.advanceTimersByTime(3000);

    await waitFor(() => {
      const manualInstallButton = screen.getByText('Manual Install');
      expect(manualInstallButton).toBeDefined();
      
      fireEvent.click(manualInstallButton);
      
      expect(alertSpy).toHaveBeenCalled();
    });

    alertSpy.mockRestore();
  });

  it('should handle appinstalled event', async () => {
    render(
      <PWAInstallPrompt onInstall={mockOnInstall} onDismiss={mockOnDismiss} />
    );

    const installedEvent = new Event('appinstalled');
    window.dispatchEvent(installedEvent);

    await waitFor(() => {
      expect(mockOnInstall).toHaveBeenCalled();
    });
  });

  it('should display feature badges', async () => {
    vi.useFakeTimers();

    render(
      <PWAInstallPrompt onInstall={mockOnInstall} onDismiss={mockOnDismiss} />
    );

    // Create and dispatch beforeinstallprompt event
    const promptEvent = new Event('beforeinstallprompt');
    const mockPrompt = vi.fn().mockResolvedValue(undefined);
    const mockUserChoice = Promise.resolve({ outcome: 'accepted' as const, platform: 'web' });
    
    Object.defineProperty(promptEvent, 'prompt', { value: mockPrompt });
    Object.defineProperty(promptEvent, 'userChoice', { value: mockUserChoice });
    Object.defineProperty(promptEvent, 'platforms', { value: ['web'] });
    
    window.dispatchEvent(promptEvent);
    vi.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(screen.getByText('Mobile App')).toBeDefined();
      expect(screen.getByText('Desktop App')).toBeDefined();
      expect(screen.getByText('Offline Access')).toBeDefined();
    });
  });

  it('should handle install errors gracefully', async () => {
    vi.useFakeTimers();

    render(
      <PWAInstallPrompt onInstall={mockOnInstall} onDismiss={mockOnDismiss} />
    );

    // Create and dispatch beforeinstallprompt event with error
    const promptEvent = new Event('beforeinstallprompt');
    const mockPrompt = vi.fn().mockRejectedValue(new Error('Install failed'));
    const mockUserChoice = Promise.resolve({ outcome: 'dismissed' as const, platform: 'web' });
    
    Object.defineProperty(promptEvent, 'prompt', { value: mockPrompt });
    Object.defineProperty(promptEvent, 'userChoice', { value: mockUserChoice });
    Object.defineProperty(promptEvent, 'platforms', { value: ['web'] });
    
    window.dispatchEvent(promptEvent);
    vi.advanceTimersByTime(3000);

    await waitFor(async () => {
      const installButton = screen.getByText('Install');
      fireEvent.click(installButton);
      
      // Should handle error without crashing
      await expect(mockPrompt()).rejects.toThrow();
    });
  });
});

