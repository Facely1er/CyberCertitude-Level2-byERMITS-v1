import React, { useState, useEffect } from 'react';
import { Shield, Smartphone, Mail, Key, Copy, Check } from 'lucide-react';
import { mfaService, MFAStatus, MFASetup as MFASetupData } from '../../../services/mfaService';
import { logger } from '../../../utils/logger';

interface MFASetupProps {
  userId: string;
  userRole: string;
  onComplete?: () => void;
  onCancel?: () => void;
}

type SetupStep = 'method-selection' | 'setup' | 'verification' | 'complete';

export const MFASetup: React.FC<MFASetupProps> = ({ 
  userId, 
  userRole, 
  onComplete, 
  onCancel 
}) => {
  const [currentStep, setCurrentStep] = useState<SetupStep>('method-selection');
  const [selectedMethod, setSelectedMethod] = useState<'totp' | 'email' | null>(null);
  const [mfaStatus, setMfaStatus] = useState<MFAStatus | null>(null);
  const [setupData, setSetupData] = useState<MFASetupData | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCode, setBackupCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);

  useEffect(() => {
    checkMFAStatus();
  }, [userId, userRole]);

  const checkMFAStatus = async () => {
    try {
      const status = await mfaService.getMFAStatus(userId, userRole);
      setMfaStatus(status);
      
      if (status.isEnabled) {
        setCurrentStep('complete');
      }
    } catch (error) {
      logger.error('Failed to check MFA status:', error);
      setError('Failed to check MFA status');
    }
  };

  const handleMethodSelection = async (method: 'totp' | 'email') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const setup = await mfaService.setupMFA(userId, method);
      setSelectedMethod(method);
      setSetupData(setup);
      setCurrentStep('setup');
    } catch (error) {
      logger.error('Failed to setup MFA:', error);
      setError('Failed to setup MFA. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async () => {
    if (!verificationCode && !backupCode) {
      setError('Please enter a verification code or backup code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const isValid = await mfaService.verifyMFA(userId, {
        token: verificationCode,
        method: selectedMethod!,
        backupCode: backupCode || undefined
      });

      if (isValid) {
        await mfaService.enableMFA(userId);
        setCurrentStep('complete');
        onComplete?.();
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (error) {
      logger.error('Failed to verify MFA:', error);
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copySecretToClipboard = async () => {
    if (!setupData?.secret) return;

    try {
      await navigator.clipboard.writeText(setupData.secret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    } catch (error) {
      logger.error('Failed to copy secret:', error);
    }
  };

  const handleSkip = () => {
    onCancel?.();
  };

  // MFA Already Enabled
  if (mfaStatus?.isEnabled) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">MFA Already Enabled</h2>
          <p className="text-gray-600 mt-2">
            Multi-factor authentication is already configured for your account.
          </p>
        </div>
        <button
          onClick={onComplete}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue
        </button>
      </div>
    );
  }

  // Method Selection Step
  if (currentStep === 'method-selection') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <Shield className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Enable Multi-Factor Authentication</h2>
          <p className="text-gray-600 mt-2">
            Choose your preferred MFA method to enhance account security.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-4 mb-6">
          <button
            onClick={() => handleMethodSelection('totp')}
            disabled={isLoading}
            className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left disabled:opacity-50"
          >
            <div className="flex items-center">
              <Smartphone className="w-6 h-6 text-blue-500 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Authenticator App</h3>
                <p className="text-sm text-gray-600">
                  Use an app like Google Authenticator or Authy
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleMethodSelection('email')}
            disabled={isLoading}
            className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left disabled:opacity-50"
          >
            <div className="flex items-center">
              <Mail className="w-6 h-6 text-blue-500 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Email Verification</h3>
                <p className="text-sm text-gray-600">
                  Receive verification codes via email
                </p>
              </div>
            </div>
          </button>
        </div>

        <button
          onClick={handleSkip}
          className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Skip for Now
        </button>
      </div>
    );
  }

  // Setup Step
  if (currentStep === 'setup') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <Shield className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedMethod === 'totp' ? 'Setup Authenticator App' : 'Setup Email Verification'}
          </h2>
          <p className="text-gray-600 mt-2">
            {selectedMethod === 'totp' 
              ? 'Scan the QR code with your authenticator app' 
              : 'A verification email has been sent to your email address'
            }
          </p>
        </div>

        {selectedMethod === 'totp' && setupData && (
          <div className="mb-6">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Secret Key</h3>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-white p-2 rounded border text-sm font-mono">
                  {setupData.secret}
                </code>
                <button
                  onClick={copySecretToClipboard}
                  className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  title="Copy secret"
                >
                  {copiedSecret ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">QR Code</h3>
              <div className="text-center">
                <div className="inline-block bg-white p-4 rounded border">
                  <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-500 text-sm">QR Code</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedMethod === 'email' && (
          <div className="mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Verification Email Sent</h3>
              <p className="text-sm text-blue-700">
                Check your email for a verification code. The code will expire in 10 minutes.
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => setCurrentStep('verification')}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {selectedMethod === 'totp' ? 'Add to Authenticator App' : 'Continue to Verification'}
        </button>

        <button
          onClick={handleSkip}
          className="w-full mt-2 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  // Verification Step
  if (currentStep === 'verification') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <Shield className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Verify Setup</h2>
          <p className="text-gray-600 mt-2">
            Enter the verification code from your {selectedMethod === 'totp' ? 'authenticator app' : 'email'} to complete setup.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or use Backup Code
            </label>
            <input
              type="text"
              placeholder="Backup code"
              value={backupCode}
              onChange={(e) => setBackupCode(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={handleVerification}
          disabled={isLoading || (!verificationCode && !backupCode)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Verifying...' : 'Verify & Enable MFA'}
        </button>

        <button
          onClick={() => setCurrentStep('setup')}
          className="w-full mt-2 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Back
        </button>
      </div>
    );
  }

  // Complete Step
  if (currentStep === 'complete') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">MFA Setup Complete</h2>
          <p className="text-gray-600 mt-2">
            Multi-factor authentication has been successfully configured.
          </p>
        </div>

        {setupData?.backupCodes && setupData.backupCodes.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Backup Codes</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                Save these backup codes in a secure location:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {setupData.backupCodes.map((code, index) => (
                  <div key={index} className="font-mono text-sm bg-white p-2 rounded border">
                    {code}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onComplete}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Complete Setup
          </button>
          <button
            onClick={handleSkip}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Skip for Now
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default MFASetup;