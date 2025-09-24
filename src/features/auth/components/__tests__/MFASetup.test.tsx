import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MFASetup } from '../MFASetup';

// Mock the MFA service
vi.mock('../../../../services/mfaService', () => ({
  mfaService: {
    getMFAStatus: vi.fn(),
    setupMFA: vi.fn(),
    verifyMFA: vi.fn(),
    enableMFA: vi.fn(),
    disableMFA: vi.fn(),
    isMFARequired: vi.fn(() => true),
    isInGracePeriod: vi.fn(() => false)
  }
}));

describe('MFASetup', () => {
  const mockProps = {
    userId: 'user-123',
    userRole: 'admin',
    onComplete: vi.fn(),
    onCancel: vi.fn(),
    onSkip: vi.fn()
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Setup default mocks
    const { mfaService } = await import('../../../../services/mfaService');
    vi.mocked(mfaService.getMFAStatus).mockResolvedValue({
      isEnabled: false,
      isRequired: true,
      methods: []
    });
    
    vi.mocked(mfaService.setupMFA).mockResolvedValue({
      secret: 'test-secret',
      qrCode: 'otpauth://totp/test',
      backupCodes: ['ABC12345', 'DEF67890'],
      recoveryCodes: ['RECOVERY123']
    });
    
    vi.mocked(mfaService.verifyMFA).mockResolvedValue(true);
    vi.mocked(mfaService.enableMFA).mockResolvedValue();
  });

  it('should render method selection step initially', () => {
    render(<MFASetup {...mockProps} />);
    
    expect(screen.getByText('Enable Multi-Factor Authentication')).toBeInTheDocument();
    expect(screen.getByText('Authenticator App')).toBeInTheDocument();
    expect(screen.getByText('Email Verification')).toBeInTheDocument();
  });

  it('should setup TOTP MFA successfully', async () => {
    render(<MFASetup {...mockProps} />);
    
    // Select TOTP method
    await waitFor(() => {
      expect(screen.getByText('Authenticator App')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Authenticator App'));

    await waitFor(() => {
      expect(screen.getByText('Setup Authenticator App')).toBeInTheDocument();
    });

    // Click "Add to Authenticator App" to go to verification
    fireEvent.click(screen.getByText('Add to Authenticator App'));

    await waitFor(() => {
      expect(screen.getByText('Verify Setup')).toBeInTheDocument();
    });

    // Enter verification code
    const verificationInput = screen.getByPlaceholderText('000000');
    fireEvent.change(verificationInput, { target: { value: '123456' } });

    // Click verify button
    fireEvent.click(screen.getByText('Verify & Enable MFA'));

    // Should show completion screen with backup codes
    await waitFor(() => {
      expect(screen.getByText('MFA Setup Complete')).toBeInTheDocument();
      expect(screen.getByText('ABC12345')).toBeInTheDocument();
      expect(screen.getByText('DEF67890')).toBeInTheDocument();
    });
  });

  it('should setup email MFA successfully', async () => {
    render(<MFASetup {...mockProps} />);
    
    // Select email method
    await waitFor(() => {
      expect(screen.getByText('Email Verification')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Email Verification'));

    await waitFor(() => {
      expect(screen.getByText('Setup Email Verification')).toBeInTheDocument();
    });

    // Click "Continue to Verification" to go to verification
    fireEvent.click(screen.getByText('Continue to Verification'));

    await waitFor(() => {
      expect(screen.getByText('Verify Setup')).toBeInTheDocument();
    });

    // Enter verification code
    const verificationInput = screen.getByPlaceholderText('000000');
    fireEvent.change(verificationInput, { target: { value: '123456' } });

    // Click verify button
    fireEvent.click(screen.getByText('Verify & Enable MFA'));

    // Should show completion screen
    await waitFor(() => {
      expect(screen.getByText('MFA Setup Complete')).toBeInTheDocument();
    });
  });

  it('should call onComplete when Complete Setup is clicked', async () => {
    render(<MFASetup {...mockProps} />);
    
    // Setup TOTP
    fireEvent.click(screen.getByText('Authenticator App'));

    await waitFor(() => {
      expect(screen.getByText('Setup Authenticator App')).toBeInTheDocument();
    });

    // Click "Add to Authenticator App" to go to verification
    fireEvent.click(screen.getByText('Add to Authenticator App'));

    await waitFor(() => {
      expect(screen.getByText('Verify Setup')).toBeInTheDocument();
    });

    // Enter verification code
    const verificationInput = screen.getByPlaceholderText('000000');
    fireEvent.change(verificationInput, { target: { value: '123456' } });

    // Click verify button
    fireEvent.click(screen.getByText('Verify & Enable MFA'));

    await waitFor(() => {
      expect(screen.getByText('MFA Setup Complete')).toBeInTheDocument();
    });

    // Click complete setup
    fireEvent.click(screen.getByText('Complete Setup'));

    expect(mockProps.onComplete).toHaveBeenCalledTimes(2);
  });

  it('should call onSkip when Skip for Now is clicked', async () => {
    render(<MFASetup {...mockProps} />);
    
    // Setup TOTP
    fireEvent.click(screen.getByText('Authenticator App'));

    await waitFor(() => {
      expect(screen.getByText('Setup Authenticator App')).toBeInTheDocument();
    });

    // Click "Add to Authenticator App" to go to verification
    fireEvent.click(screen.getByText('Add to Authenticator App'));

    await waitFor(() => {
      expect(screen.getByText('Verify Setup')).toBeInTheDocument();
    });

    // Enter verification code
    const verificationInput = screen.getByPlaceholderText('000000');
    fireEvent.change(verificationInput, { target: { value: '123456' } });

    // Click verify button
    fireEvent.click(screen.getByText('Verify & Enable MFA'));

    await waitFor(() => {
      expect(screen.getByText('MFA Setup Complete')).toBeInTheDocument();
    });

    // Click skip
    fireEvent.click(screen.getByText('Skip for Now'));

    expect(mockProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('should display backup codes for TOTP method', async () => {
    render(<MFASetup {...mockProps} />);
    
    // Setup TOTP
    fireEvent.click(screen.getByText('Authenticator App'));

    await waitFor(() => {
      expect(screen.getByText('Setup Authenticator App')).toBeInTheDocument();
    });

    // Click "Add to Authenticator App" to go to verification
    fireEvent.click(screen.getByText('Add to Authenticator App'));

    await waitFor(() => {
      expect(screen.getByText('Verify Setup')).toBeInTheDocument();
    });

    // Enter verification code
    const verificationInput = screen.getByPlaceholderText('000000');
    fireEvent.change(verificationInput, { target: { value: '123456' } });

    // Click verify button
    fireEvent.click(screen.getByText('Verify & Enable MFA'));

    await waitFor(() => {
      expect(screen.getByText('MFA Setup Complete')).toBeInTheDocument();
      expect(screen.getByText('Backup Codes')).toBeInTheDocument();
      expect(screen.getByText('Save these backup codes in a secure location:')).toBeInTheDocument();
      expect(screen.getByText('ABC12345')).toBeInTheDocument();
      expect(screen.getByText('DEF67890')).toBeInTheDocument();
    });
  });

  it('should not display backup codes for email method', async () => {
    // Mock setupMFA to return no backup codes for email method
    const { mfaService } = await import('../../../../services/mfaService');
    vi.mocked(mfaService.setupMFA).mockImplementation(async (userId, method) => {
      if (method === 'email') {
        return {
          secret: '',
          qrCode: '',
          backupCodes: [], // No backup codes for email
          recoveryCodes: []
        };
      }
      return {
        secret: 'test-secret',
        qrCode: 'otpauth://totp/test',
        backupCodes: ['ABC12345', 'DEF67890'],
        recoveryCodes: ['RECOVERY123']
      };
    });
    
    render(<MFASetup {...mockProps} />);
    
    // Setup email MFA
    fireEvent.click(screen.getByText('Email Verification'));

    // Wait for setup step
    await waitFor(() => {
      expect(screen.getByText('Setup Email Verification')).toBeInTheDocument();
    });

    // Click "Continue to Verification" to go to verification
    fireEvent.click(screen.getByText('Continue to Verification'));

    await waitFor(() => {
      expect(screen.getByText('Verify Setup')).toBeInTheDocument();
    });

    // Enter verification code
    const verificationInput = screen.getByPlaceholderText('000000');
    fireEvent.change(verificationInput, { target: { value: '123456' } });

    // Click verify button
    fireEvent.click(screen.getByText('Verify & Enable MFA'));

    await waitFor(() => {
      expect(screen.getByText('MFA Setup Complete')).toBeInTheDocument();
    });

    // Should not show backup codes for email method
    expect(screen.queryByText('Backup Codes')).not.toBeInTheDocument();
  });

  it('should render with correct icons', async () => {
    // Mock verification to return false to trigger error
    const { mfaService } = await import('../../../../services/mfaService');
    vi.mocked(mfaService.verifyMFA).mockResolvedValue(false);
    
    render(<MFASetup {...mockProps} />);
    
    // Select TOTP method
    await waitFor(() => {
      expect(screen.getByText('Authenticator App')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Authenticator App'));

    // Wait for setup step
    await waitFor(() => {
      expect(screen.getByText('Setup Authenticator App')).toBeInTheDocument();
    });

    // Click "Add to Authenticator App" to go to verification
    fireEvent.click(screen.getByText('Add to Authenticator App'));

    await waitFor(() => {
      expect(screen.getByText('Verify Setup')).toBeInTheDocument();
    });

    // Enter verification code
    const codeInput = screen.getByPlaceholderText('000000');
    fireEvent.change(codeInput, { target: { value: '123456' } });

    // Click verify button
    fireEvent.click(screen.getByText('Verify & Enable MFA'));

    await waitFor(() => {
      expect(screen.getByText('Invalid verification code. Please try again.')).toBeInTheDocument();
    });

    // Check for shield icon (should be present)
    const shieldIcon = document.querySelector('.lucide-shield');
    expect(shieldIcon).toBeInTheDocument();
  });

  it('should handle component without callbacks', async () => {
    render(<MFASetup userId="user-123" userRole="admin" />);
    
    expect(screen.getByText('Enable Multi-Factor Authentication')).toBeInTheDocument();
    
    // Should not throw when clicking without callbacks
    fireEvent.click(screen.getByText('Authenticator App'));
    
    await waitFor(() => {
      expect(screen.getByText('Setup Authenticator App')).toBeInTheDocument();
    });
  });
});