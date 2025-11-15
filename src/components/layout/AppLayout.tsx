import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Shield, BarChart3, CheckCircle, FileText, Database, FileBarChart, CheckSquare, Users, Settings, Scale } from 'lucide-react';
import { AccessibleNavigation } from '../AccessibleNavigation';
import { AccountDropdown } from '../AccountDropdown';
import { ThemeToggle } from '../../shared/components/ui/ThemeToggle';
import { NotificationSystem } from '../../shared/components/ui/NotificationSystem';
import { OfflineNotice } from '../OfflineNotice';
import { CMMCOnboardingFlow } from '../CMMCOnboardingFlow';
import { ProductionReadinessWidget } from '../ProductionReadinessWidget';
import KeyboardShortcutsHelp from '../KeyboardShortcutsHelp';
import { AssetManagementModal } from '../AssetManagementModal';
import { TemplateManagementModal } from '../TemplateManagementModal';
import { MobileMenu } from '../MobileMenu';
import PWAInstallPrompt from '../PWAInstallPrompt';
import { ContextualHelp } from '../ContextualHelp';
import { NavigationItem } from '../../config/navigation';
import { UserProfile, NotificationMessage } from '../../shared/types';
import { Asset } from '../../shared/types/assets';

export interface AppLayoutProps {
  children: React.ReactNode;
  navItems: NavigationItem[];
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  onSignOut: () => void;
  notifications: NotificationMessage[];
  removeNotification: (id: string) => void;
  isOnline: boolean;
  showOfflineNotice: boolean;
  isFirstVisit: boolean;
  setIsFirstVisit: (value: boolean) => void;
  showMobileMenu: boolean;
  setShowMobileMenu: (value: boolean) => void;
  showAssetModal: boolean;
  setShowAssetModal: (value: boolean) => void;
  editingAsset: Asset | null;
  setEditingAsset: (asset: Asset | null) => void;
  showTemplateModal: boolean;
  setShowTemplateModal: (value: boolean) => void;
  selectedFramework: string;
  shortcuts: Array<{ key: string; ctrlKey: boolean; description: string }>;
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
  handleSaveAsset: (asset: Asset) => Promise<Asset>;
  handleSelectTemplate: (templateId: string) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  navItems,
  userProfile,
  isAuthenticated,
  onSignOut,
  notifications,
  removeNotification,
  isOnline,
  showOfflineNotice,
  isFirstVisit,
  setIsFirstVisit,
  showMobileMenu,
  setShowMobileMenu,
  showAssetModal,
  setShowAssetModal,
  editingAsset,
  setEditingAsset,
  showTemplateModal,
  setShowTemplateModal,
  selectedFramework,
  shortcuts,
  addNotification,
  handleSaveAsset,
  handleSelectTemplate
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="sticky-footer-container bg-background-light dark:bg-background-dark">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-md border-b border-support-light dark:border-support-dark z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section - Branding */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="flex items-center space-x-3 min-w-0 hover:opacity-80 transition-opacity duration-200">
                <img src="/cybercertitude.png" alt="CyberCertitude" className="w-10 h-10 flex-shrink-0" />
                <div className="flex flex-col min-w-0">
                  <h1 className="text-base font-bold text-text-primary-light dark:text-text-primary-dark leading-tight tracking-tight">
                    CyberCertitude™
                  </h1>
                  <span className="text-[0.70rem] font-medium text-text-secondary-light dark:text-text-secondary-dark leading-tight tracking-wider hidden sm:block">
                    CMMC 2.0 Compliance
                  </span>
                  <span className="text-[0.65rem] text-text-muted-light dark:text-text-muted-dark leading-tight tracking-wide hidden sm:block">
                    by ERMITS
                  </span>
                </div>
              </Link>
            </div>
            
            {/* Center Section - Navigation Menu */}
            <nav className="hidden lg:flex items-center justify-center flex-1 mx-8">
              <AccessibleNavigation items={navItems} />
            </nav>
            
            {/* Right Section - User Controls */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setShowMobileMenu(true)}
                className="lg:hidden p-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-500 dark:hover:text-primary-400 hover:bg-support-light dark:hover:bg-surface-dark rounded-lg transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {/* Desktop Menu Toggle for smaller screens */}
              <button
                onClick={() => setShowMobileMenu(true)}
                className="md:hidden lg:flex xl:hidden p-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-500 dark:hover:text-primary-400 hover:bg-support-light dark:hover:bg-surface-dark rounded-lg transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <ThemeToggle />
              
              {/* User Authentication Section */}
              <AccountDropdown
                isAuthenticated={isAuthenticated}
                userProfile={userProfile}
                onSignOut={onSignOut}
                className="flex-shrink-0"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 min-h-screen sticky-footer-content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-light dark:bg-surface-dark border-t border-support-light dark:border-support-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="md:col-span-1">
              <div className="flex items-start space-x-2 mb-4">
                <img src="/cybercertitude.png" alt="CyberCertitude" className="w-8 h-8 flex-shrink-0 mt-1" />
                <div className="flex flex-col leading-tight">
                  <span className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark leading-tight">
                    CyberCertitude™
                  </span>
                  <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark tracking-wider leading-tight">
                    CMMC 2.0 Compliance
                  </span>
                  <span className="text-xs text-text-muted-light dark:text-text-muted-dark leading-tight">
                    by ERMITS
                  </span>
                </div>
              </div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
                Comprehensive CMMC 2.0 Level 2 compliance platform designed to streamline your cybersecurity certification journey.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => navigate('/help')}
                  className="text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  Help
                </button>
                <button
                  onClick={() => navigate('/settings')}
                  className="text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  Settings
                </button>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
                Quick Links
              </h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => navigate('/assessment-intro')}
                    className="flex items-center space-x-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    <span>New Assessment</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center space-x-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Dashboard</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/compliance')}
                    className="flex items-center space-x-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Compliance</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/evidence')}
                    className="flex items-center space-x-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Evidence</span>
                  </button>
                </li>
              </ul>
            </div>
            
            {/* Resources */}
            <div>
              <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
                Resources
              </h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => navigate('/assets')}
                    className="flex items-center space-x-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    <Database className="w-4 h-4" />
                    <span>Assets</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/reports')}
                    className="flex items-center space-x-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    <FileBarChart className="w-4 h-4" />
                    <span>Reports</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/tasks')}
                    className="flex items-center space-x-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    <CheckSquare className="w-4 h-4" />
                    <span>Tasks</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/policies')}
                    className="flex items-center space-x-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Policies</span>
                  </button>
                </li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
                Legal
              </h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => navigate('/legal/terms-of-service')}
                    className="flex items-center space-x-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    <Scale className="w-4 h-4" />
                    <span>Terms of Service</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/legal/privacy-policy')}
                    className="flex items-center space-x-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Privacy Policy</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/legal/cookie-policy')}
                    className="flex items-center space-x-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Cookie Policy</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/legal/acceptable-use-policy')}
                    className="flex items-center space-x-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Acceptable Use</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/legal/disclaimer')}
                    className="flex items-center space-x-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Disclaimer</span>
                  </button>
                </li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
                Support
              </h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => navigate('/team')}
                    className="flex items-center space-x-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    <span>Team</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/settings')}
                    className="flex items-center space-x-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                </li>
              </ul>
            </div>
            
            {/* Mobile Navigation */}
            <div className="md:hidden mt-8 pt-8 border-t border-support-light dark:border-support-dark">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/assessment-intro')}
                  className="flex items-center space-x-2 p-3 text-left bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800/30 transition-colors"
                >
                  <Shield className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                  <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                    New Assessment
                  </span>
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center space-x-2 p-3 text-left bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800/30 transition-colors"
                >
                  <BarChart3 className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                  <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                    Dashboard
                  </span>
                </button>
                <button
                  onClick={() => navigate('/compliance')}
                  className="flex items-center space-x-2 p-3 text-left bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800/30 transition-colors"
                >
                  <CheckCircle className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                  <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                    Compliance
                  </span>
                </button>
                <button
                  onClick={() => navigate('/evidence')}
                  className="flex items-center space-x-2 p-3 text-left bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800/30 transition-colors"
                >
                  <FileText className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                  <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                    Evidence
                  </span>
                </button>
                <button
                  onClick={() => navigate('/assets')}
                  className="flex items-center space-x-2 p-3 text-left bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800/30 transition-colors"
                >
                  <Database className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                  <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                    Assets
                  </span>
                </button>
                <button
                  onClick={() => navigate('/reports')}
                  className="flex items-center space-x-2 p-3 text-left bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800/30 transition-colors"
                >
                  <FileBarChart className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                  <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                    Reports
                  </span>
                </button>
                <button
                  onClick={() => navigate('/tasks')}
                  className="flex items-center space-x-2 p-3 text-left bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800/30 transition-colors"
                >
                  <CheckSquare className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                  <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                    Tasks
                  </span>
                </button>
                <button
                  onClick={() => navigate('/policies')}
                  className="flex items-center space-x-2 p-3 text-left bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800/30 transition-colors"
                >
                  <FileText className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                  <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                    Policies
                  </span>
                </button>
                <button
                  onClick={() => navigate('/team')}
                  className="flex items-center space-x-2 p-3 text-left bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800/30 transition-colors"
                >
                  <Users className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                  <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                    Team
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Global Components */}
      <NotificationSystem 
        notifications={notifications}
        onRemove={removeNotification}
      />

      <OfflineNotice 
        isOnline={isOnline}
        showNotice={showOfflineNotice}
      />

      {isFirstVisit && (
        <CMMCOnboardingFlow
          onComplete={() => setIsFirstVisit(false)}
          onSkip={() => setIsFirstVisit(false)}
          onNavigate={navigate}
        />
      )}

      <ProductionReadinessWidget />
      
      <KeyboardShortcutsHelp 
        isOpen={false}
        onClose={() => {}}
        shortcuts={shortcuts.map(s => ({
          keys: s.ctrlKey ? ['Ctrl', s.key.toUpperCase()] : [s.key.toUpperCase()],
          description: s.description,
          category: 'Navigation'
        }))} 
      />
      
      {/* Asset Management Modal */}
      <AssetManagementModal
        isOpen={showAssetModal}
        onClose={() => {
          setShowAssetModal(false);
          setEditingAsset(null);
        }}
        onSave={handleSaveAsset}
        asset={editingAsset}
      />
      
      {/* Template Management Modal */}
      <TemplateManagementModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSelectTemplate={(template) => handleSelectTemplate(template.id)}
        frameworkId={selectedFramework}
      />
      
      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        navItems={navItems}
      />
      
      {/* PWA Installation Prompt */}
      <PWAInstallPrompt 
        onInstall={() => {
          addNotification('success', 'CMMC 2.0 Platform installed successfully!');
        }}
        onDismiss={() => {
          // Store dismissal preference
          localStorage.setItem('pwa-install-dismissed', Date.now().toString());
        }}
      />

      {/* Contextual Help */}
      <ContextualHelp 
        currentPage={location.pathname}
        userRole="compliance-officer"
        onNavigate={navigate}
      />
    </div>
  );
};
