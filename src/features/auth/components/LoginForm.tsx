import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, User, Send, CheckCircle } from 'lucide-react';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useRateLimit, RATE_LIMITS, getBrowserFingerprint, generateRateLimitKey } from '../../../utils/rateLimiting';
import { validateEmail, sanitizeInput } from '../../../utils/validation';

interface LoginFormProps {
  onSwitchToSignUp: () => void;
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  onSwitchToSignUp, 
  onSuccess 
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [linkSent, setLinkSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const [lastSentTime, setLastSentTime] = useState<Date | null>(null);
  
  const { signIn, resendMagicLink } = useAuth();
  const navigate = useNavigate();
  
  // Rate limiting
  const browserFingerprint = getBrowserFingerprint();
  const rateLimitKey = generateRateLimitKey.fingerprint(browserFingerprint, 'auth:login');
  const rateLimit = useRateLimit(rateLimitKey, RATE_LIMITS.API_AUTH);

  // Auto-clear error after 5 seconds
  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Prevent double submission
    if (isLoading) {
      return;
    }
    
    setIsLoading(true);

    // Validate inputs
    try {
      const sanitizedEmail = sanitizeInput(email.trim().toLowerCase());
      const emailValidation = validateEmail(sanitizedEmail);
      
      if (!emailValidation.isValid) {
        setError(emailValidation.error || 'Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      // Check rate limit
      const rateLimitCheck = rateLimit.isAllowed();
      if (!rateLimitCheck.allowed) {
        setError(`Too many login attempts. Please try again in ${rateLimitCheck.retryAfter} seconds.`);
        setIsLoading(false);
        return;
      }

      const result = await signIn(sanitizedEmail);
      
      if (result.success) {
        // Reset rate limit on successful request
        rateLimit.reset();
        
        if (result.requiresEmailConfirmation) {
          setLinkSent(true);
          setSentEmail(sanitizedEmail);
          setLastSentTime(new Date());
          setError('');
        } else {
          // Direct sign in (shouldn't happen with magic links, but handle just in case)
          onSuccess?.();
          navigate('/dashboard');
        }
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login form error:', err);
      setError('Please enter a valid email address');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendLink = async () => {
    if (!sentEmail) return;
    
    // Prevent spam resending (minimum 30 second wait)
    if (lastSentTime && Date.now() - lastSentTime.getTime() < 30000) {
      setError('Please wait at least 30 seconds before resending');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      const result = await resendMagicLink(sentEmail, 'signin');
      if (result.success) {
        setLastSentTime(new Date());
        setError('');
        // Show success feedback
        setError(''); // Clear any existing errors
        // You could add a success state here if needed
      } else {
        setError(result.error || 'Failed to resend magic link');
      }
    } catch (err) {
      setError('Failed to resend magic link');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateResendCooldown = (): number => {
    if (!lastSentTime) return 0;
    const elapsed = Date.now() - lastSentTime.getTime();
    return Math.max(0, 30 - Math.floor(elapsed / 1000));
  };

  if (linkSent) {
    const cooldown = calculateResendCooldown();
    
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Check Your Email
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              We've sent a magic link to <strong>{sentEmail}</strong>
            </p>
            {lastSentTime && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Sent {Math.floor((Date.now() - lastSentTime.getTime()) / 1000)} seconds ago
              </p>
            )}
          </div>

          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                What to do next:
              </h3>
              <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>1. Check your email inbox for a message from CyberCertitude™</li>
                <li>2. Click the "Sign In" link in the email</li>
                <li>3. You'll be automatically signed in</li>
                <li>4. If not received in 5 minutes, check your spam folder</li>
              </ol>
            </div>

            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Didn't receive the email? Check your spam folder or
              </p>
              
              <button
                onClick={handleResendLink}
                disabled={isLoading || cooldown > 0}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 
                 cooldown > 0 ? `Resend in ${cooldown}s` : 
                 'Resend magic link'}
              </button>
              
              <button
                onClick={() => {
                  setLinkSent(false);
                  setSentEmail('');
                  setEmail('');
                  setLastSentTime(null);
                  setError('');
                }}
                className="block w-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm"
              >
                ← Use a different email address
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
            <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Sign in to your CyberCertitude™ account with a magic link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter your email"
                autoComplete="email"
                autoFocus
                required
              />
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
              Passwordless Authentication
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              We'll send a secure magic link to your email. Click the link to sign in instantly - no password required!
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Sending magic link...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Magic Link</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToSignUp}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            🔐 Secure passwordless authentication • No passwords to remember • Enterprise-grade security
          </p>
        </div>
      </div>
    </div>
  );
};