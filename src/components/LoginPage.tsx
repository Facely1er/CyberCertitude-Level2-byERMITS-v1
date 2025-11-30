import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, User, Building, Send, CheckCircle } from 'lucide-react';
import { useAuth } from '../shared/hooks/useAuth';

interface LoginPageProps {
  onBack?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [linkSent, setLinkSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    organization: '',
    role: 'user'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (isSignUp) {
      if (!formData.name.trim() || !formData.organization.trim()) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }
      
      const result = await signUp(formData.email, {
        name: formData.name,
        organization: formData.organization,
        role: formData.role,
        industry: 'Technology'
      });
      
      if (result.success && result.requiresEmailConfirmation) {
        setLinkSent(true);
        setSentEmail(formData.email);
      } else if (result.error) {
        setError(result.error);
      }
    } else {
      const result = await signIn(formData.email);
      if (result.success && result.requiresEmailConfirmation) {
        setLinkSent(true);
        setSentEmail(formData.email);
      } else if (result.error) {
        setError(result.error);
      }
    }
    
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 dark:from-background-dark dark:to-surface-dark flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <img src="/cybercertitude.png" alt="CyberCertitude" className="w-12 h-12" />
            <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
              CyberCertitude™
            </h1>
          </div>
          <h2 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            {isSignUp 
              ? 'Join the CMMC compliance platform' 
              : 'Sign in to your CMMC compliance account'
            }
          </p>
        </div>

        {/* Form */}
        <div className="bg-surface-light dark:bg-surface-dark py-8 px-6 shadow-xl rounded-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg p-4">
                <p className="text-error-800 dark:text-error-300 text-sm">{error}</p>
              </div>
            )}

            {isSignUp && (
              <>
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted-light dark:text-text-muted-dark" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required={isSignUp}
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark placeholder-text-muted-light dark:placeholder-text-muted-dark"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Organization */}
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                    Organization
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted-light dark:text-text-muted-dark" />
                    <input
                      id="organization"
                      name="organization"
                      type="text"
                      required={isSignUp}
                      value={formData.organization}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark placeholder-text-muted-light dark:placeholder-text-muted-dark"
                      placeholder="Enter your organization name"
                    />
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark"
                  >
                    <option value="user">User</option>
                    <option value="admin">Administrator</option>
                    <option value="compliance_officer">Compliance Officer</option>
                    <option value="security_manager">Security Manager</option>
                  </select>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted-light dark:text-text-muted-dark" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark placeholder-text-muted-light dark:placeholder-text-muted-dark"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {/* Magic Link Info */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
              <h3 className="font-medium text-primary-900 dark:text-primary-100 mb-1">
                🪄 Passwordless Authentication
              </h3>
              <p className="text-sm text-primary-800 dark:text-primary-200">
                {isSignUp 
                  ? 'Create your account securely without a password. We\'ll send you a magic link to complete registration.'
                  : 'Sign in securely with a magic link sent to your email - no password required!'
                }
              </p>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Sending magic link...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{isSignUp ? 'Send Magic Link' : 'Send Magic Link'}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Toggle Sign Up/Sign In */}
          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>

          {/* Back Button */}
          {onBack && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={onBack}
                className="text-sm text-text-muted-light hover:text-text-primary-light dark:text-text-muted-dark dark:hover:text-text-primary-dark transition-colors"
              >
                ← Back to app
              </button>
            </div>
          )}
        </div>

        {/* Demo Notice */}
        <div className="text-center">
          <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
            Demo mode: Magic link authentication for secure access
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;