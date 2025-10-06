import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MFASetup } from '../MFASetup';

// Mock the MFA service
vi.mock('../../../../services/mfaService', () => ({
  mfaService: {
    getMFAStatus: vi.fn(),
    setupMFA: vi.fn(),
    verifyMFA: vi.fn(),
    enableMFA: vi.fn()
  }
}));

// Mock logger
vi.mock('../../../utils/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn()
  }
}));

describe('MFASetup', () => {
  const mockProps = {
    userId: 'user-123',
    userRole: 'admin',
    onComplete: vi.fn(),
    onCancel: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render method selection step initially', () => {
    render(<MFASetup {...mockProps} />);
    
    expect(screen.getByText('Enable Multi-Factor Authentication')).toBeInTheDocument();
    expect(screen.getByText('Authenticator App')).toBeInTheDocument();
    expect(screen.getByText('Email Verification')).toBeInTheDocument();
  });

  it('should show MFA already enabled message when MFA is enabled', async () => {
    const { mfaService } = await import('../../../../services/mfaService');
    vi.mocked(mfaService.getMFAStatus).mockResolvedValue({
      isEnabled: true,
      isRequired: true,
      methods: ['totp']
    });

    render(<MFASetup {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('MFA Already Enabled')).toBeInTheDocument();
    });
  });

  it('should handle method selection for TOTP', async () => {
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

    render(<MFASetup {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Authenticator App')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Authenticator App'));

    await waitFor(() => {
      expect(screen.getByText('Setup Authenticator App')).toBeInTheDocument();
      expect(screen.getByText('Add to Authenticator App')).toBeInTheDocument();
    });
  });

  it('should handle method selection for email', async () => {
    const { mfaService } = await import('../../../../services/mfaService');
    vi.mocked(mfaService.getMFAStatus).mockResolvedValue({
      isEnabled: false,
      isRequired: true,
      methods: []
    });

    vi.mocked(mfaService.setupMFA).mockResolvedValue({
      secret: '',
      qrCode: '',
      backupCodes: ['ABC12345', 'DEF67890'],
      recoveryCodes: ['RECOVERY123']
    });

    render(<MFASetup {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Email Verification')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Email Verification'));

    await waitFor(() => {
      expect(screen.getByText('Setup Email Verification')).toBeInTheDocument();
      expect(screen.getByText('Verification Email Sent')).toBeInTheDocument();
    });
  });

  it('should handle verification code input', async () => {
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

    render(<MFASetup {...mockProps} />);
    
    // Select TOTP method
    await waitFor(() => {
      expect(screen.getByText('Authenticator App')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Authenticator App'));

    await waitFor(() => {
      expect(screen.getByText('Enter verification code')).toBeInTheDocument();
    });

    // Enter verification code
    const codeInput = screen.getByPlaceholderText('000000');
    fireEvent.change(codeInput, { target: { value: '123456' } });

    // Click verify button
    fireEvent.click(screen.getByText('Verify & Enable MFA'));

    await waitFor(() => {
      expect(mfaService.verifyMFA).toHaveBeenCalledWith('user-123', {
        token: '123456',
        method: 'totp',
        backupCode: undefined
      });
      expect(mfaService.enableMFA).toHaveBeenCalledWith('user-123');
    });
  });

  it('should handle backup code verification', async () => {
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

    render(<MFASetup {...mockProps} />);
    
    // Select TOTP method
    await waitFor(() => {
      expect(screen.getByText('Authenticator App')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Authenticator App'));

    await waitFor(() => {
      expect(screen.getByText('Enter verification code')).toBeInTheDocument();
    });

    // Enter backup code
    const backupInput = screen.getByPlaceholderText('Backup code');
    fireEvent.change(backupInput, { target: { value: 'ABC12345' } });

    // Click verify button
    fireEvent.click(screen.getByText('Verify & Enable MFA'));

    await waitFor(() => {
      expect(mfaService.verifyMFA).toHaveBeenCalledWith('user-123', {
        token: '',
        method: 'totp',
        backupCode: 'ABC12345'
      });
    });
  });

  it('should handle verification errors', async () => {
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

    vi.mocked(mfaService.verifyMFA).mockResolvedValue(false);

    render(<MFASetup {...mockProps} />);
    
    // Select TOTP method
    await waitFor(() => {
      expect(screen.getByText('Authenticator App')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Authenticator App'));

    await waitFor(() => {
      expect(screen.getByText('Enter verification code')).toBeInTheDocument();
    });

    // Enter verification code
    const codeInput = screen.getByPlaceholderText('000000');
    fireEvent.change(codeInput, { target: { value: '123456' } });

    // Click verify button
    fireEvent.click(screen.getByText('Verify & Enable MFA'));

    await waitFor(() => {
      expect(screen.getByText('Invalid verification code. Please try again.')).toBeInTheDocument();
    });
  });

  it('should handle setup errors', async () => {
    const { mfaService } = await import('../../../../services/mfaService');
    vi.mocked(mfaService.getMFAStatus).mockResolvedValue({
      isEnabled: false,
      isRequired: true,
      methods: []
    });

    vi.mocked(mfaService.setupMFA).mockRejectedValue(new Error('Setup failed'));

    render(<MFASetup {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Authenticator App')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Authenticator App'));

    await waitFor(() => {
      expect(screen.getByText('Failed to setup MFA. Please try again.')).toBeInTheDocument();
    });
  });

  it('should copy secret to clipboard', async () => {
    const { mfaService } = await import('../../../../services/mfaService');
    vi.mocked(mfaService.getMFAStatus).mockResolvedValue({
      isEnabled: false,
      isRequired: true,
      methods: []
    });

    vi.mocked(mfaService.setupMFA).mockResolvedValue({
      secret: 'test-secret-key',
      qrCode: 'otpauth://totp/test',
      backupCodes: ['ABC12345', 'DEF67890'],
      recoveryCodes: ['RECOVERY123']
    });

    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined)
      }
    });

    render(<MFASetup {...mockProps} />);
    
    // Select TOTP method
    await waitFor(() => {
      expect(screen.getByText('Authenticator App')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Authenticator App'));

    await waitFor(() => {
      expect(screen.getByText('test-secret-key')).toBeInTheDocument();
    });

    // Click copy button
    const copyButton = screen.getByRole('button', { name: /copy/i });
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test-secret-key');
  });
});