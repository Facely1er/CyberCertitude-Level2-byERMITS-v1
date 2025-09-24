import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Mail } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSwitchToSignUp = () => setIsLogin(false);
  const handleSwitchToLogin = () => setIsLogin(true);
  const handleAuthSuccess = () => {
    // Redirect to dashboard or intended page
    navigate('/dashboard');
  };

  return (
    <div className="flex-grow bg-gradient-brand-subtle dark:bg-gradient-dark-brand flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Back to Home Button */}
        <div className="mb-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary-gold/20 dark:bg-dark-primary/30 rounded-full flex items-center justify-center mb-4">
            <img src="/cybercertitude.png" alt="CyberCertitude" className="w-12 h-12 rounded-full" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            CyberCertitude™
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            CMMC Level 1 Compliance Platform
          </p>
          <div className="mt-4 inline-flex items-center space-x-2 bg-primary-gold/20 dark:bg-dark-primary/30 text-primary-gold dark:text-dark-primary px-4 py-2 rounded-full text-sm font-medium">
            <Mail className="w-4 h-4" />
            <span>Magic Link Authentication</span>
          </div>
        </div>

        {/* Auth Forms */}
        {isLogin ? (
          <LoginForm 
            onSwitchToSignUp={handleSwitchToSignUp}
            onSuccess={handleAuthSuccess}
          />
        ) : (
          <SignUpForm 
            onSwitchToLogin={handleSwitchToLogin}
            onSuccess={handleAuthSuccess}
          />
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            🔐 Enterprise-grade security with passwordless authentication<br/>
            By continuing, you agree to our{' '}
            <button className="text-primary-gold dark:text-dark-primary hover:underline">
              Terms of Service
            </button>{' '}
            and{' '}
            <button className="text-primary-gold dark:text-dark-primary hover:underline">
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;