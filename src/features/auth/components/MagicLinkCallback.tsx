import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react';
import { LoadingSpinner } from '../../../shared/components/ui/LoadingSpinner';
import { useAuth } from '../../../shared/hooks/useAuth';

const MagicLinkCallback: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');
  const { handleMagicLinkCallback } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const processCallback = async () => {
      try {
        const result = await handleMagicLinkCallback();
        
        if (result.success) {
          setStatus('success');
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          setStatus('error');
          setError(result.error || 'Authentication failed');
        }
      } catch (err) {
        setStatus('error');
        setError('An unexpected error occurred during authentication');
      }
    };

    processCallback();
  }, [handleMagicLinkCallback, navigate]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background-light to-accent-50 dark:from-background-dark dark:via-background-dark dark:to-background-dark flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg p-8">
            <div className="text-center">
              <LoadingSpinner size="lg" message="Authenticating... Please wait while we complete your authentication" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-success-50 via-background-light to-accent-50 dark:from-background-dark dark:via-background-dark dark:to-background-dark flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg p-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-success-600 dark:text-success-400" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
                Authentication Successful!
              </h2>
              <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
                You have been successfully signed in to CyberCertitude™
              </p>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                Redirecting to dashboard...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-error-50 via-background-light to-accent-50 dark:from-background-dark dark:via-background-dark dark:to-background-dark flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-error-100 dark:bg-error-900/30 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-error-600 dark:text-error-400" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
              Authentication Failed
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
              {error || 'There was an error processing your authentication request'}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/auth')}
                className="w-full btn-primary py-3 px-4 rounded-lg  transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full border border-support-light dark:border-support-dark text-text-secondary-light dark:text-text-secondary-dark py-2 px-4 rounded-lg hover:bg-support-light dark:hover:bg-support-dark transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagicLinkCallback;