import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, HelpCircle, LogIn, LogOut, ChevronDown } from 'lucide-react';

interface AccountDropdownProps {
  isAuthenticated: boolean;
  userProfile: any;
  onSignOut: () => void;
  className?: string;
}

export const AccountDropdown: React.FC<AccountDropdownProps> = ({ 
  isAuthenticated, 
  userProfile, 
  onSignOut,
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  const handleSignOut = () => {
    onSignOut();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors whitespace-nowrap"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={isAuthenticated && userProfile ? "Account menu" : "Sign in to your account"}
      >
        <User className="w-5 h-5" />
        <span className="hidden xs:inline">Account</span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          aria-hidden="true"
        />
      </button>
      
      {isOpen && (
        <div 
          className="absolute top-full right-0 w-64 bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark py-2 z-50 mt-2"
          role="menu"
          aria-label="Account menu"
        >
          {isAuthenticated && userProfile ? (
            <>
              {/* User info section */}
              <div className="px-4 py-3 border-b border-support-light dark:border-support-dark">
                <div className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                  {userProfile.name || 'User'}
                </div>
                <div className="text-xs text-text-muted-light dark:text-text-muted-dark">
                  {userProfile.email || 'user@example.com'}
                </div>
              </div>
              
              {/* Menu items */}
              <button
                onClick={() => handleItemClick(() => navigate('/profile'))}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-background-light dark:hover:bg-surface-dark/50 transition-colors text-left"
                role="menuitem"
              >
                <User className="w-4 h-4" aria-hidden="true" />
                <div>
                  <div className="font-medium text-text-primary-light dark:text-text-secondary-dark">Profile</div>
                  <div className="text-xs text-text-muted-light dark:text-text-muted-dark">
                    Manage user profile
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => handleItemClick(() => navigate('/settings'))}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-background-light dark:hover:bg-surface-dark/50 transition-colors text-left"
                role="menuitem"
              >
                <Settings className="w-4 h-4" aria-hidden="true" />
                <div>
                  <div className="font-medium text-text-primary-light dark:text-text-secondary-dark">Settings</div>
                  <div className="text-xs text-text-muted-light dark:text-text-muted-dark">
                    Application settings
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => handleItemClick(() => navigate('/help'))}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-background-light dark:hover:bg-surface-dark/50 transition-colors text-left"
                role="menuitem"
              >
                <HelpCircle className="w-4 h-4" aria-hidden="true" />
                <div>
                  <div className="font-medium text-text-primary-light dark:text-text-secondary-dark">Help</div>
                  <div className="text-xs text-text-muted-light dark:text-text-muted-dark">
                    Help and support
                  </div>
                </div>
              </button>
              
              <div className="border-t border-support-light dark:border-support-dark mt-2 pt-2">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-background-light dark:hover:bg-surface-dark/50 transition-colors text-left"
                  role="menuitem"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  <div>
                    <div className="font-medium text-text-primary-light dark:text-text-secondary-dark">Sign Out</div>
                    <div className="text-xs text-text-muted-light dark:text-text-muted-dark">
                      Sign out of your account
                    </div>
                  </div>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Not authenticated - show login and help options */}
              <button
                onClick={() => handleItemClick(() => navigate('/login'))}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-background-light dark:hover:bg-surface-dark/50 transition-colors text-left"
                role="menuitem"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                <div>
                  <div className="font-medium text-text-primary-light dark:text-text-secondary-dark">Sign In</div>
                  <div className="text-xs text-text-muted-light dark:text-text-muted-dark">
                    Sign in to your account
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => handleItemClick(() => navigate('/help'))}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-background-light dark:hover:bg-surface-dark/50 transition-colors text-left"
                role="menuitem"
              >
                <HelpCircle className="w-4 h-4" aria-hidden="true" />
                <div>
                  <div className="font-medium text-text-primary-light dark:text-text-secondary-dark">Help</div>
                  <div className="text-xs text-text-muted-light dark:text-text-muted-dark">
                    Help and support
                  </div>
                </div>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};