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
        className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors whitespace-nowrap"
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
          className="absolute top-full right-0 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 mt-2"
          role="menu"
          aria-label="Account menu"
        >
          {isAuthenticated && userProfile ? (
            <>
              {/* User info section */}
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {userProfile.name || 'User'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {userProfile.email || 'user@example.com'}
                </div>
              </div>
              
              {/* Menu items */}
              <button
                onClick={() => handleItemClick(() => navigate('/profile'))}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                role="menuitem"
              >
                <User className="w-4 h-4" aria-hidden="true" />
                <div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">Profile</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Manage user profile
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => handleItemClick(() => navigate('/settings'))}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                role="menuitem"
              >
                <Settings className="w-4 h-4" aria-hidden="true" />
                <div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">Settings</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Application settings
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => handleItemClick(() => navigate('/help'))}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                role="menuitem"
              >
                <HelpCircle className="w-4 h-4" aria-hidden="true" />
                <div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">Help</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Help and support
                  </div>
                </div>
              </button>
              
              <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                  role="menuitem"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  <div>
                    <div className="font-medium text-gray-700 dark:text-gray-300">Sign Out</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
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
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                role="menuitem"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                <div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">Sign In</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Sign in to your account
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => handleItemClick(() => navigate('/help'))}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                role="menuitem"
              >
                <HelpCircle className="w-4 h-4" aria-hidden="true" />
                <div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">Help</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
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