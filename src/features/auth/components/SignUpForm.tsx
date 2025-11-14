import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, User, Building, Shield, CircleCheck as CheckCircle, Send } from 'lucide-react';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useRateLimit, RATE_LIMITS, getBrowserFingerprint, generateRateLimitKey } from '../../../utils/rateLimiting';
import { validateEmail, validateName, sanitizeInput } from '../../../utils/validation';

interface SignUpFormProps {
  onSwitchToLogin: () => void;
  onSuccess?: () => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ 
  onSwitchToLogin, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    organization: '',
    industry: 'Technology',
    role: 'compliance-manager'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [linkSent, setLinkSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const [lastSentTime, setLastSentTime] = useState<Date | null>(null);
  
  const { signUp, resendMagicLink } = useAuth();
  const navigate = useNavigate();
  
  // Rate limiting
  const browserFingerprint = getBrowserFingerprint();
  const rateLimitKey = generateRateLimitKey.fingerprint(browserFingerprint, 'auth:signup');
  const rateLimit = useRateLimit(rateLimitKey, RATE_LIMITS.API_AUTH);

  // Auto-clear error after 5 seconds
  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    // Validate first name
    const firstNameValidation = validateName(formData.firstName);
    if (!firstNameValidation.isValid) {
      setError(`First name: ${firstNameValidation.error}`);
      return false;
    }
    
    // Validate last name
    const lastNameValidation = validateName(formData.lastName);
    if (!lastNameValidation.isValid) {
      setError(`Last name: ${lastNameValidation.error}`);
      return false;
    }
    
    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      setError(`Email: ${emailValidation.error}`);
      return false;
    }
    
    // Validate organization
    if (!formData.organization.trim()) {
      setError('Organization name is required');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    // Check rate limit
    const rateLimitCheck = rateLimit.isAllowed();
    if (!rateLimitCheck.allowed) {
      setError(`Too many sign up attempts. Please try again in ${rateLimitCheck.retryAfter} seconds.`);
      return;
    }
    
    setIsLoading(true);

    try {
      // Sanitize all form data
      const sanitizedEmail = sanitizeInput(formData.email.trim().toLowerCase());
      const sanitizedFirstName = sanitizeInput(formData.firstName.trim());
      const sanitizedLastName = sanitizeInput(formData.lastName.trim());
      const sanitizedOrganization = sanitizeInput(formData.organization.trim());
      const sanitizedIndustry = sanitizeInput(formData.industry);
      const sanitizedRole = sanitizeInput(formData.role);
      
      const userData = {
        name: `${sanitizedFirstName} ${sanitizedLastName}`,
        first_name: sanitizedFirstName,
        last_name: sanitizedLastName,
        organization: sanitizedOrganization,
        industry: sanitizedIndustry,
        role: sanitizedRole
      };

      const result = await signUp(sanitizedEmail, userData.name);
      
      if (result.success) {
        // Reset rate limit on successful signup request
        rateLimit.reset();
        
        if (result.requiresEmailConfirmation) {
          setLinkSent(true);
          setSentEmail(sanitizedEmail);
          setLastSentTime(new Date());
          setError('');
        } else {
          // Direct sign up success (shouldn't happen with magic links, but handle just in case)
          onSuccess?.();
          navigate('/dashboard');
        }
      } else {
        setError(result.error || 'Sign up failed');
      }
    } catch (err) {
      logger.error('Sign up form error:', err);
      setError('Please check your form inputs and try again');
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
      const result = await resendMagicLink(sentEmail, 'signup');
      if (result.success) {
        setLastSentTime(new Date());
        setError('');
        // Show success feedback
        const successMessage = 'Magic link sent again! Please check your email.';
        setError(''); // Clear any existing errors
      } else {
        setError(result.error || 'Failed to resend magic link');
      }
    } catch (err) {
      logger.error('Resend magic link error:', err);
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
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">
                Sent {Math.floor((Date.now() - lastSentTime.getTime()) / 1000)} seconds ago
              </p>
            )}
          </div>

          <div className="space-y-6">
            {error && (
              <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg p-4">
                <p className="text-sm text-error-600 dark:text-error-400">{error}</p>
              </div>
            )}
            
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">
                Complete your registration:
              </h3>
              <ol className="text-sm text-green-800 dark:text-green-200 space-y-1">
                <li>1. Check your email inbox for a message from CyberCertitude™</li>
                <li>2. Click the "Complete Registration" link</li>
                <li>3. You'll be signed in automatically</li>
                <li>4. If not received in 5 minutes, check your spam folder</li>
              </ol>
            </div>

            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Didn't receive the email?
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
                  setLastSentTime(null);
                  setError('');
                  setFormData(prev => ({ ...prev, email: '' }));
                }}
                className="block w-full text-text-muted-light dark:text-text-muted-dark hover:text-gray-700 dark:hover:text-gray-300 text-sm"
              >
                ← Use a different email address
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const industries = [
    'Military & Aerospace',
    'Technology',
    'Manufacturing',
    'Healthcare',
    'Financial Services',
    'Government',
    'Energy & Utilities',
    'Telecommunications',
    'Transportation',
    'Other'
  ];

  const roles = [
    { value: 'ciso', label: 'Chief Information Security Officer (CISO)' },
    { value: 'compliance-manager', label: 'Compliance Manager' },
    { value: 'security-manager', label: 'Security Manager' },
    { value: 'it-manager', label: 'IT Manager' },
    { value: 'security-analyst', label: 'Security Analyst' },
    { value: 'auditor', label: 'Auditor' },
    { value: 'consultant', label: 'Consultant' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create Your Account
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Join CyberCertitude™ for CMMC compliance
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="First name"
                  autoComplete="given-name"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Last name"
                autoComplete="family-name"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="organization" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Organization
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="organization"
                name="organization"
                type="text"
                value={formData.organization}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Your organization"
                autoComplete="organization"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Industry
              </label>
              <select
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h3 className="font-medium text-green-900 dark:text-green-100 mb-1">
              🪄 Passwordless Registration
            </h3>
            <p className="text-sm text-green-800 dark:text-green-200">
              Create your account securely without a password. We'll send you a magic link to complete registration instantly.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                <span>Sending magic link...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2 inline-block" />
                <span>Send Magic Link</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
            🔐 Secure passwordless registration • No passwords to manage • Enterprise-grade security
          </p>
        </div>
      </div>
    </div>
  );
};