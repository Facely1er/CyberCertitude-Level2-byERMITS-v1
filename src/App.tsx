import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { Shield, BarChart3, CheckCircle, FileText, FileBarChart, CheckSquare, Target, Activity, Calendar, Database, Users, Settings, HelpCircle, Lock, Menu, LogIn, LogOut, Play, BookOpen, ExternalLink, Megaphone, AlertTriangle } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { OfflineNotice } from './components/OfflineNotice';
import { ProductionReadinessWidget } from './components/ProductionReadinessWidget';
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp';
import { AssetManagementModal } from './components/AssetManagementModal';
import { SSPGenerator } from './components/SSPGenerator';
import { TemplateManagementModal } from './components/TemplateManagementModal';
import { MainDashboard } from './components/MainDashboard';
import { NotificationSystem } from './shared/components/ui/NotificationSystem';
import { ThemeToggle } from './shared/components/ui/ThemeToggle';
import { StartScreen } from './shared/components/layout/StartScreen';
import { Breadcrumbs } from './shared/components/layout/Breadcrumbs';
import { AccessibleNavigation } from './components/AccessibleNavigation';
import { MobileMenu } from './components/MobileMenu';
import { AccountDropdown } from './components/AccountDropdown';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { useOfflineSupport } from './hooks/useOfflineSupport';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useAuth } from './shared/hooks/useAuth';
import { useAssessments } from './shared/hooks/useAssessments';
import { useScrollToTop } from './hooks/useScrollToTop';
import { cmmc2Level1Framework } from './data/frameworks';
import CMMCLevel1GuidedImplementation from './components/CMMCLevel1GuidedImplementation';
import CMMC2Level1PolicyGenerator from './components/CMMC2Level1PolicyGenerator';
import { CMMCLevel1AssessmentIntroScreen } from './features/assessment/components/CMMCLevel1AssessmentIntroScreen';
import { CMMCLevel1EnhancedAssessmentView } from './features/assessment/components/CMMCLevel1EnhancedAssessmentView';
import { CMMCLevel1AssessmentRoute } from './features/assessment/components/CMMCLevel1AssessmentRoute';
import { AssessmentData, UserProfile, NotificationMessage, OrganizationInfo } from './shared/types';
import { reportService } from './services/reportService';
import { assetService } from './services/assetService';
import { dataService } from './services/dataService';
import { getFramework } from './data/frameworks';
import { logger } from '@/utils/logger';
import { Asset } from './shared/types/assets';
import { AssessmentTemplate } from './shared/types/documentation';
import { CMMCOnboardingFlow } from './components/CMMCOnboardingFlow';

// Import lazy-loaded components
import {
  AuthPage,
  AssessmentIntroScreen,
  EnhancedAssessmentView,
  ReportView,
  AssessmentReportsPage,
  AdvancedReportingDashboard,
  AssetDashboard,
  AssetEditForm,
  AssetInventoryView,
  AssetCreationForm,
  AssetDetailView,
  TaskManagementDashboard,
  TeamCollaborationDashboard,
  PolicyManagementView,
  ControlsManagementView,
  ComplianceGapAnalyzer,
  ComplianceCalendarView,
  TeamTrackingReport,
  RealTimeComplianceStatus,
  ComplianceWorkflow,
  CMMCComplianceDashboard,
  CMMCJourneyWorkflow,
  CMMCEvidenceCollector,
  CMMCControlAssessor,
  EvidenceCollector,
  EvidenceCollectionDashboard,
  ProfileView,
  SettingsView,
  BillingView,
  HelpView,
  LoginPage,
  // Risk Management Components
  RiskAssessmentGenerator,
  ThreatModelingTool,
  VulnerabilityScanner,
  // Training Components
  TrainingModuleGenerator,
  AwarenessCampaignPlanner,
  // Audit Components
  AuditChecklistGenerator,
  ComplianceDashboard,
  AuditLogsView,
  SelfAssessmentPreparation,
  // Technical Tools Components
  SecurityControlMapper,
  ConfigurationBaselineGenerator,
  IncidentResponsePlanner,
  // Auth Components
  MagicLinkCallback
} from './components/LazyComponents';


// Assessment Route Component
const AssessmentRoute: React.FC<{
  savedAssessments: AssessmentData[];
  saveAssessment: (assessment: AssessmentData) => Promise<AssessmentData>;
  userProfile: UserProfile | null;
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
  navigate: (path: string) => void;
  onGenerateReport: (assessment: AssessmentData) => void;
}> = ({ savedAssessments, saveAssessment, userProfile, addNotification, navigate, onGenerateReport }) => {
  const { id } = useParams();
  
  if (!id) {
    return <div>No assessment ID provided</div>;
  }
  
  const assessment = savedAssessments.find(a => a.id === id);
  
  if (!assessment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Assessment Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The assessment you're looking for could not be found.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-primary-gold text-white px-6 py-3 rounded-lg hover:bg-primary-gold/90 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  const framework = getFramework(assessment.frameworkId);
  
  if (!framework || !framework.sections) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Framework Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The assessment framework could not be loaded.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-primary-gold text-white px-6 py-3 rounded-lg hover:bg-primary-gold/90 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <EnhancedAssessmentView
      assessment={assessment}
      framework={framework}
      onSave={async (updatedAssessment) => {
        await saveAssessment(updatedAssessment);
        addNotification('success', 'Assessment saved successfully');
      }}
      onComplete={() => {
        addNotification('success', 'Assessment completed!');
        navigate('/dashboard');
      }}
      onBack={() => navigate('/dashboard')}
      userProfile={userProfile}
      addNotification={addNotification}
      onGenerateReport={onGenerateReport}
    />
  );
};

// Report Route Component
const ReportRoute: React.FC<{
  savedAssessments: AssessmentData[];
  userProfile: UserProfile | null;
  handleExportAssessment: (assessment: AssessmentData, format: 'json' | 'csv' | 'pdf') => Promise<void>;
  navigate: (path: string) => void;
}> = ({ savedAssessments, userProfile, handleExportAssessment, navigate }) => {
  const { id } = useParams();
  
  if (!id) {
    return <div>No report ID provided</div>;
  }
  
  const assessment = savedAssessments.find(a => a.id === id);
  
  if (!assessment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Assessment Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The assessment you're looking for could not be found.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-primary-gold text-white px-6 py-3 rounded-lg hover:bg-primary-gold/90 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  const framework = getFramework(assessment.frameworkId);
  
  if (!framework) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Framework Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The assessment framework could not be loaded.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-primary-gold text-white px-6 py-3 rounded-lg hover:bg-primary-gold/90 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <ReportView
      assessment={assessment}
      framework={framework}
      onExport={handleExportAssessment}
      onBack={() => navigate('/dashboard')}
      userProfile={userProfile}
    />
  );
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOnline, showOfflineNotice } = useOfflineSupport();
  // Authentication is optional - only required for saving preferences
  const { user, profile, signOut, isAuthenticated } = useAuth();
  
  // Ensure page scrolls to top on route changes
  useScrollToTop();

  // CMMC Level 1 User-Centric Navigation
  const navItems = [
    {
      label: 'Overview',
      href: '/dashboard',
      icon: BarChart3,
      description: 'Your compliance dashboard and progress'
    },
    {
      label: 'Get Started',
      icon: Play,
      children: [
        {
          label: 'CMMC 2.0 Level 1 Guide',
          href: '/cmmc-level1',
          icon: Shield,
          description: 'Guided implementation for basic cyber hygiene'
        },
        {
          label: 'Level 1 Policy Generator',
          href: '/cmmc-level1-policies',
          icon: FileText,
          description: 'Generate policies for all 17 Level 1 practices'
        },
        {
          label: 'CMMC Level 1 Assessment',
          href: '/cmmc-level1-assessment-intro',
          icon: Target,
          description: 'Start your CMMC 2.0 Level 1 assessment'
        },
        {
          label: 'New Assessment',
          href: '/assessment-intro',
          icon: Target,
          description: 'Start your CMMC Level 1 journey'
        },
        {
          label: 'Find Gaps',
          href: '/gap-analysis',
          icon: BarChart3,
          description: 'See what needs to be fixed'
        },
        {
          label: 'Check Controls',
          href: '/control-assessor',
          icon: Shield,
          description: 'Review all 17 Level 1 security controls'
        }
      ]
    },
    {
      label: 'Build & Fix',
      icon: CheckCircle,
      children: [
        {
          label: 'CMMC Journey',
          href: '/cmmc-journey',
          icon: Activity,
          description: 'Complete CMMC Level 1 journey workflow'
        },
        {
          label: 'Implementation Plan',
          href: '/compliance-workflow',
          icon: Activity,
          description: 'Step-by-step roadmap to Level 1 compliance'
        },
        {
          label: 'Manage Assets',
          href: '/assets',
          icon: Database,
          description: 'Track your systems and data'
        },
        {
          label: 'Fix Controls',
          href: '/controls',
          icon: Shield,
          description: 'Implement missing Level 1 security measures'
        },
        {
          label: 'Work with Team',
          href: '/team',
          icon: Users,
          description: 'Coordinate with your team'
        }
      ]
    },
    {
      label: 'Create Documents',
      icon: FileText,
      children: [
        {
          label: 'System Security Plan',
          href: '/ssp-generator',
          icon: FileText,
          description: 'Generate your SSP automatically'
        },
        {
          label: 'Action Plan',
          href: '/poam-manager',
          icon: CheckSquare,
          description: 'Track what needs to be done'
        },
        {
          label: 'Policies & Procedures',
          href: '/policies',
          icon: FileText,
          description: 'Create required policies'
        },
        {
          label: 'Gather Evidence',
          href: '/evidence',
          icon: FileBarChart,
          description: 'Collect proof of compliance'
        }
      ]
    },
    {
      label: 'Prepare for Audit',
      icon: CheckCircle,
      children: [
        {
          label: 'Compliance Status',
          href: '/compliance',
          icon: CheckCircle,
          description: 'See your current compliance level'
        },
        {
          label: 'Audit Readiness',
          href: '/audit-tracker',
          icon: CheckCircle,
          description: 'Get ready for self-assessment'
        },
        {
          label: 'Generate Reports',
          href: '/reports',
          icon: FileBarChart,
          description: 'Create reports and analytics'
        },
        {
          label: 'Training Program',
          href: '/training-tracker',
          icon: BookOpen,
          description: 'Track staff Level 1 training progress'
        }
      ]
    },
    {
      label: 'Advanced Tools',
      icon: Settings,
      children: [
        {
          label: 'Risk Assessment',
          href: '/risk-assessment',
          icon: AlertTriangle,
          description: 'Comprehensive risk analysis and mitigation'
        },
        {
          label: 'Threat Modeling',
          href: '/threat-modeling',
          icon: Shield,
          description: 'Security threat analysis and modeling'
        },
        {
          label: 'Security Controls',
          href: '/security-controls',
          icon: Shield,
          description: 'Map and manage security controls'
        },
        {
          label: 'Configuration Baselines',
          href: '/config-baselines',
          icon: Settings,
          description: 'Generate security configuration baselines'
        }
      ]
    }
  ];
  
  // State management
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<string>('start');
  const [currentAssessment, setCurrentAssessment] = useState<AssessmentData | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState<string>('cmmc');

  // Assessment management
  const { 
    assessments: savedAssessments,
    saveAssessment,
    removeAssessment,
    loadAssessments
  } = useAssessments();

  // Load user profile on mount
  useEffect(() => {
    // Load user profile from localStorage
    const profileData = localStorage.getItem('cmc_user_profile');
    if (profileData) {
      const profile = JSON.parse(profileData);
      setUserProfile(profile);
    }
    
    // Check if first visit
    const hasVisited = localStorage.getItem('has-visited');
    if (!hasVisited) {
      setIsFirstVisit(true);
      localStorage.setItem('has-visited', 'true');
    }

    // Set initial view based on profile and assessments
    if (location.pathname === '/' || location.pathname === '/dashboard') {
      if (profile && savedAssessments.length > 0) {
        setCurrentView('dashboard');
      } else {
        setCurrentView('start');
      }
    }
  }, [location.pathname, savedAssessments.length]);

  // Keyboard shortcuts
  const shortcuts = [
    { key: 's', ctrlKey: true, action: () => {
      // Auto-save is handled by the assessment hooks
      addNotification('success', 'Assessment auto-saved');
    }, description: 'Save progress' },
    { key: 'n', ctrlKey: true, action: () => navigate('/assessment-intro'), description: 'New assessment' },
    { key: 'h', ctrlKey: true, action: () => navigate('/help'), description: 'Show help' },
    { key: 'd', ctrlKey: true, action: () => navigate('/dashboard'), description: 'Go to dashboard' }
  ];

  useKeyboardShortcuts(shortcuts);

  // Notification management
  const addNotification = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    const notification: NotificationMessage = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date()
    };
    setNotifications(prev => [...prev, notification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Asset management functions
  const loadAssets = () => {
    try {
      const loadedAssets = assetService.getAllAssets();
      setAssets(loadedAssets);
    } catch (error) {
      logger.error('Failed to load assets:', error);
      addNotification('error', 'Failed to load assets');
    }
  };

  const handleViewAsset = (asset: Asset) => {
    setEditingAsset(asset);
    setShowAssetModal(true);
  };

  const handleEditAsset = (asset: Asset) => {
    setEditingAsset(asset);
    setShowAssetModal(true);
  };

  const handleSaveAsset = (asset: Asset) => {
    loadAssets();
    addNotification('success', asset.id === editingAsset?.id ? 'Asset updated successfully' : 'Asset created successfully');
  };

  const handleDeleteAsset = (assetId: string) => {
    try {
      assetService.deleteAsset(assetId);
      loadAssets();
      addNotification('success', 'Asset deleted successfully');
    } catch (error) {
      logger.error('Failed to delete asset:', error);
      addNotification('error', 'Failed to delete asset');
    }
  };

  const handleCreateAsset = () => {
    setEditingAsset(null);
    setShowAssetModal(true);
  };

  const handleExportAssets = async () => {
    try {
      const blob = await assetService.exportAssets({ format: 'csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `assets-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addNotification('success', 'Assets exported successfully');
    } catch (error) {
      logger.error('Failed to export assets:', error);
      addNotification('error', 'Failed to export assets');
    }
  };

  const handleImportAssets = async (file: File) => {
    try {
      const result = await assetService.importAssets(file);
      loadAssets();
      if (result.errors.length > 0) {
        addNotification('warning', `Imported ${result.success} assets with ${result.errors.length} errors`);
      } else {
        addNotification('success', `Successfully imported ${result.success} assets`);
      }
    } catch (error) {
      logger.error('Failed to import assets:', error);
      addNotification('error', 'Failed to import assets');
    }
  };

  // Load assets on mount
  useEffect(() => {
    loadAssets();
  }, []);

  // Report export functions
  const handleExportReport = async (assessment: AssessmentData, format: string) => {
    try {
      const framework = getFramework(assessment.frameworkId);
      await reportService.exportReport(assessment, framework, {
        format: format as 'pdf' | 'json' | 'csv',
        includeCharts: true,
        includeRecommendations: true,
        branding: {
          organizationName: userProfile?.organization || 'Organization',
          logo: null
        }
      });
      addNotification('success', `Report exported successfully as ${format.toUpperCase()}`);
    } catch (error) {
      logger.error('Failed to export report:', error);
      addNotification('error', `Failed to export report as ${format.toUpperCase()}`);
    }
  };

  // Template functions
  const handleSelectTemplate = (template: AssessmentTemplate) => {
    setSelectedFramework(template.frameworkId);
    setShowTemplateModal(false);
    
    // Create assessment from template
    const framework = getFramework(template.frameworkId);
    const newAssessment: AssessmentData = {
      id: Date.now().toString(),
      frameworkId: template.frameworkId,
      frameworkName: framework.name,
      responses: template.prefilledResponses,
      createdAt: new Date(),
      lastModified: new Date(),
      isComplete: false,
      version: framework.version,
      organizationInfo: userProfile ? {
        name: userProfile.organization || 'Organization',
        industry: template.industry,
        size: template.organizationSize?.[0] || 'medium',
        complianceRequirements: ['CMMC Level 1']
      } : undefined,
      questionNotes: {},
      questionEvidence: {},
      templateId: template.id,
      templateMetadata: {
        name: template.name,
        version: template.version,
        industry: template.industry
      }
    };

    saveAssessment(newAssessment);
    navigate(`/assessment/${newAssessment.id}`);
    addNotification('success', `Assessment created from template: ${template.name}`);
  };

  const handleShowTemplates = (frameworkId: string = 'cmmc') => {
    setSelectedFramework(frameworkId);
    setShowTemplateModal(true);
  };

  // Assessment handlers
  const handleStartAssessment = () => {
    navigate('/assessment-intro');
  };

  const handleStartAssessmentWithInfo = (organizationInfo?: OrganizationInfo, selectedFramework?: string) => {
    const frameworkId = selectedFramework || 'cmmc';
    const framework = getFramework(frameworkId);
    
    const newAssessment: AssessmentData = {
      id: Date.now().toString(),
      frameworkId,
      frameworkName: framework.name,
      responses: {},
      createdAt: new Date(),
      lastModified: new Date(),
      isComplete: false,
      version: framework.version,
      organizationInfo,
      questionNotes: {},
      questionEvidence: {},
      evidenceLibrary: [],
      assessmentVersion: '1.0.0',
      versionHistory: [],
      changeLog: [],
      tags: []
    };

    // Save assessment before navigating to it
    saveAssessment(newAssessment);
    setCurrentAssessment(newAssessment);
    
    // Route to appropriate assessment component based on framework
    if (frameworkId === 'cmmc-2.0-level1') {
      navigate(`/cmmc-level1-assessment/${newAssessment.id}`);
    } else {
      navigate(`/assessment/${newAssessment.id}`);
    }
  };

  const handleLoadAssessment = (assessment: AssessmentData) => {
    setCurrentAssessment(assessment);
    
    // Route to appropriate assessment component based on framework
    if (assessment.frameworkId === 'cmmc-2.0-level1') {
      navigate(`/cmmc-level1-assessment/${assessment.id}`);
    } else {
      navigate(`/assessment/${assessment.id}`);
    }
  };

  const handleUpdateProfile = (profile: UserProfile) => {
    // Check authentication only when saving preferences
    if (!user) {
      addNotification('warning', 'Please sign in to save profile changes');
      return;
    }
    
    setUserProfile(profile);
    localStorage.setItem('cmc_user_profile', JSON.stringify(profile));
    addNotification('success', 'Profile updated successfully');
  };

  const handleDeleteAssessment = async (assessmentId: string) => {
    try {
      if (!window.confirm('Are you sure you want to delete this assessment? This action cannot be undone.')) {
        return;
      }
      
      await removeAssessment(assessmentId);
      addNotification('success', 'Assessment deleted successfully');
    } catch (error) {
      logger.error('Delete assessment error:', error);
      addNotification('error', 'Failed to delete assessment');
    }
  };

  const handleGenerateReport = (assessment: AssessmentData) => {
    navigate(`/report/${assessment.id}`);
  };

  const handleExportAssessment = async (assessment: AssessmentData, format: 'json' | 'csv' | 'pdf') => {
    try {
      const framework = getFramework(assessment.frameworkId);
      await reportService.exportReport(assessment, framework, {
        format,
        includeExecutiveSummary: true,
        includeDetailedAnalysis: true,
        includeRecommendations: true,
        includeGapAnalysis: true,
        includeNextSteps: true
      });
      addNotification('success', `Assessment exported as ${format.toUpperCase()}`);
    } catch (error) {
      addNotification('error', `Failed to export assessment: ${(error as Error).message}`);
    }
  };

  const handleImportAssessment = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        dataService.importData(JSON.stringify(importedData));
        addNotification('success', 'Assessment imported successfully');
        loadAssessments();
      } catch (error) {
        addNotification('error', 'Failed to import assessment');
      }
    };
    reader.readAsText(file);
  };

  return (
    <ErrorBoundary>
      <div className="sticky-footer-container bg-gradient-brand-subtle dark:bg-gradient-dark-brand">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm border-b border-primary-gold/20 dark:border-dark-primary/30 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              {/* Left Section - Branding */}
              <Link to="/" className="flex items-center space-x-2 flex-shrink-0 min-w-0 hover:opacity-80 transition-opacity duration-200">
                <img src="/cybercertitude.png" alt="CyberCertitude" className="w-12 h-12" />
                <div className="flex flex-col min-w-0">
                  <h1 className="text-xl font-bold text-brand-neutral dark:text-dark-primary leading-tight">
                    CyberCertitude™
                  </h1>
                  <span className="text-sm font-medium text-brand-deep dark:text-dark-primary/80 leading-tight hidden sm:block">
                    CMMC 2.0 Level 1 Compliance 
                  </span>
                  <span className="text-xs text-brand-accent dark:text-dark-primary/60 leading-tight hidden md:block">
                    by ERMITS
                  </span>
                </div>
              </Link>
              
              {/* Center Section - Navigation Menu */}
              <div className="hidden md:flex flex-1 justify-center px-12">
                <AccessibleNavigation items={navItems} />
              </div>
              
              {/* Right Section - User Controls */}
              <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0 ml-auto">
                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setShowMobileMenu(true)}
                  className="md:hidden p-1.5 sm:p-2 text-brand-neutral dark:text-dark-primary/80 hover:text-primary-gold dark:hover:text-dark-primary hover:bg-primary-gold/10 dark:hover:bg-dark-primary/20 rounded-lg transition-colors"
                  aria-label="Open navigation menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <ThemeToggle />
                
                {/* User Authentication Section */}
                <AccountDropdown
                  isAuthenticated={isAuthenticated}
                  userProfile={userProfile}
                  onSignOut={signOut}
                  className="flex-shrink-0"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-16 sticky-footer-content">
          <Routes>
            {/* Start/Landing Page */}
            <Route 
              path="/" 
              element={
                <StartScreen
                  userProfile={userProfile}
                  onStartAssessment={handleStartAssessment}
                  onContinue={() => navigate('/dashboard')}
                />
              } 
            />

            {/* Authentication */}
            <Route 
              path="/auth" 
              element={<AuthPage />} 
            />
            <Route 
              path="/auth/callback" 
              element={<MagicLinkCallback />} 
            />
            <Route 
              path="/forgot-password" 
              element={
                <div className="min-h-screen bg-gradient-brand-subtle dark:bg-gradient-dark-brand flex items-center justify-center px-4 py-12">
                  <div className="w-full max-w-md">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                      <div className="text-center mb-8">
                        <div className="mx-auto w-12 h-12 bg-primary-gold/20 dark:bg-dark-primary/30 rounded-full flex items-center justify-center mb-4">
                          <Lock className="w-6 h-6 text-primary-gold dark:text-dark-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          Reset Password
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                          Enter your email to receive reset instructions
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                          Password reset functionality is available through the authentication system.
                        </p>
                        <button
                          onClick={() => navigate('/auth')}
                          className="bg-primary-gold text-white px-6 py-3 rounded-lg hover:bg-primary-gold/90 transition-colors"
                        >
                          Back to Sign In
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              } 
            />

            {/* Dashboard */}
            <Route 
              path="/dashboard" 
              element={
                <MainDashboard
                  savedAssessments={savedAssessments}
                  onStartAssessment={handleStartAssessment}
                  onLoadAssessment={handleLoadAssessment}
                  onDeleteAssessment={handleDeleteAssessment}
                  onGenerateReport={handleGenerateReport}
                  onExportAssessment={handleExportAssessment}
                  onImportAssessment={handleImportAssessment}
                  userProfile={userProfile}
                  addNotification={addNotification}
                />
              } 
            />

            {/* CMMC Level 1 Guided Implementation */}
            <Route 
              path="/cmmc-level1" 
              element={<CMMCLevel1GuidedImplementation />} 
            />

            {/* CMMC 2.0 Level 1 Policy Generator */}
            <Route 
              path="/cmmc-level1-policies" 
              element={<CMMC2Level1PolicyGenerator />} 
            />

            {/* Assessment Flow */}
            <Route 
              path="/assessment-intro" 
              element={
                <AssessmentIntroScreen
                  frameworks={[cmmc2Level1Framework]}
                  onStartAssessment={handleStartAssessmentWithInfo}
                  onShowTemplates={handleShowTemplates}
                  onBack={() => navigate('/dashboard')}
                />
              } 
            />

            {/* CMMC Level 1 Assessment Flow */}
            <Route 
              path="/cmmc-level1-assessment-intro" 
              element={
                <CMMCLevel1AssessmentIntroScreen
                  frameworks={[cmmc2Level1Framework]}
                  onStartAssessment={handleStartAssessmentWithInfo}
                  onShowTemplates={handleShowTemplates}
                  onBack={() => navigate('/dashboard')}
                />
              } 
            />

            <Route 
              path="/assessment/:id" 
              element={
                <AssessmentRoute
                  savedAssessments={savedAssessments}
                  saveAssessment={saveAssessment}
                  userProfile={userProfile}
                  addNotification={addNotification}
                  navigate={navigate}
                  onGenerateReport={handleGenerateReport}
                />
              } 
            />

            {/* CMMC Level 1 Assessment Route */}
            <Route 
              path="/cmmc-level1-assessment/:id" 
              element={
                <CMMCLevel1AssessmentRoute
                  savedAssessments={savedAssessments}
                  saveAssessment={saveAssessment}
                  userProfile={userProfile}
                  addNotification={addNotification}
                  navigate={navigate}
                  onGenerateReport={handleGenerateReport}
                />
              } 
            />

            <Route 
              path="/report/:id" 
              element={
                <ReportRoute
                  savedAssessments={savedAssessments}
                  userProfile={userProfile}
                  handleExportAssessment={handleExportAssessment}
                  navigate={navigate}
                />
              } 
            />

            {/* Compliance */}
            <Route 
              path="/compliance" 
              element={
                <ErrorBoundary>
                  <RealTimeComplianceStatus
                    onViewDetails={(category) => {
                      addNotification('info', `Viewing details for ${category}`);
                      navigate(`/compliance/${category.toLowerCase()}`);
                    }}
                    onAcknowledgeAlert={(alertId) => {
                      addNotification('success', `Alert ${alertId} acknowledged`);
                    }}
                  />
                </ErrorBoundary>
              } 
            />

            {/* CMMC Compliance Dashboard */}
            <Route 
              path="/compliance/cmmc" 
              element={
                <ErrorBoundary>
                  <CMMCComplianceDashboard
                    onNavigate={navigate}
                    onSave={(dashboard) => addNotification('success', 'Compliance dashboard saved successfully')}
                    onExport={(dashboard) => addNotification('info', 'Compliance dashboard exported successfully')}
                  />
                </ErrorBoundary>
              } 
            />

            {/* Compliance Workflow */}
            <Route 
              path="/compliance-workflow" 
              element={<ComplianceWorkflow />} 
            />

            {/* CMMC Journey Workflow */}
            <Route 
              path="/cmmc-journey" 
              element={
                <CMMCJourneyWorkflow
                  onNavigate={navigate}
                  onSave={(workflow) => addNotification('success', 'CMMC journey progress saved')}
                  onExport={(workflow) => addNotification('info', 'CMMC journey exported successfully')}
                />
              } 
            />

            {/* Evidence */}
            <Route 
              path="/evidence" 
              element={
                <EvidenceCollectionDashboard
                  onEvidenceSelect={(evidence) => addNotification('info', `Selected evidence: ${evidence.title}`)}
                />
              } 
            />

            {/* Assets */}
            <Route 
              path="/assets" 
              element={
                <AssetDashboard 
                  assets={[]} 
                  onViewAsset={() => {}} 
                  onCreateAsset={() => {}} 
                  onViewInventory={() => navigate('/assets/inventory')} 
                  onViewCategories={() => navigate('/assets/categories')} 
                  onViewDependencies={() => navigate('/assets/dependencies')} 
                  onViewWorkflow={() => navigate('/assets/workflow')} 
                  onViewRoadmap={() => navigate('/assets/roadmap')} 
                  onViewActionPlan={() => navigate('/assets/action-plan')} 
                />
              } 
            />

            {/* Asset Sub-routes */}
            <Route 
              path="/assets/inventory" 
              element={
                <AssetInventoryView
                  assets={assets}
                  onViewAsset={handleViewAsset}
                  onEditAsset={handleEditAsset}
                  onDeleteAsset={handleDeleteAsset}
                  onCreateAsset={handleCreateAsset}
                  onExportAssets={handleExportAssets}
                  onImportAssets={handleImportAssets}
                  onBack={() => navigate('/assets')}
                />
              } 
            />
            <Route 
              path="/assets/categories" 
              element={
                <div className="max-w-6xl mx-auto px-4 py-8">
                  <Breadcrumbs items={[
                    { label: 'Assets', path: '/assets' },
                    { label: 'Asset Categories', isActive: true }
                  ]} />
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Asset Categories
                      </h2>
                      <button
                        onClick={() => navigate('/assets')}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Back to Assets
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="bg-primary-gold/10 dark:bg-dark-primary/20 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-primary-gold dark:text-dark-primary mb-2">IT Assets</h3>
                        <p className="text-primary-gold/80 dark:text-dark-primary/80 text-sm mb-4">Servers, workstations, network devices</p>
                        <div className="text-2xl font-bold text-primary-gold dark:text-dark-primary">24</div>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">Software</h3>
                        <p className="text-green-700 dark:text-green-300 text-sm mb-4">Applications, operating systems, tools</p>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">156</div>
                      </div>
                      
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">Data Assets</h3>
                        <p className="text-purple-700 dark:text-purple-300 text-sm mb-4">Databases, files, documents</p>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">89</div>
                      </div>
                      
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-2">Physical Assets</h3>
                        <p className="text-orange-700 dark:text-orange-300 text-sm mb-4">Hardware, equipment, facilities</p>
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">12</div>
                      </div>
                      
                      <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">Critical Assets</h3>
                        <p className="text-red-700 dark:text-red-300 text-sm mb-4">High-value, sensitive systems</p>
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">8</div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Other</h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">Miscellaneous assets</p>
                        <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">23</div>
                      </div>
                    </div>
                  </div>
                </div>
              } 
            />

            <Route 
              path="/assets/dependencies" 
              element={
                <div className="max-w-6xl mx-auto px-4 py-8">
                  <Breadcrumbs items={[
                    { label: 'Assets', path: '/assets' },
                    { label: 'Asset Dependencies', isActive: true }
                  ]} />
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Asset Dependencies
                      </h2>
                      <button
                        onClick={() => navigate('/assets')}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Back to Assets
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Critical Dependencies</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <div>
                              <div className="font-medium text-red-900 dark:text-red-100">Database Server</div>
                              <div className="text-sm text-red-700 dark:text-red-300">Depends on: Network, Storage, Power</div>
                            </div>
                            <div className="text-red-600 dark:text-red-400 font-bold">Critical</div>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <div>
                              <div className="font-medium text-yellow-900 dark:text-yellow-100">Web Application</div>
                              <div className="text-sm text-yellow-700 dark:text-yellow-300">Depends on: Database, Load Balancer</div>
                            </div>
                            <div className="text-yellow-600 dark:text-yellow-400 font-bold">High</div>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div>
                              <div className="font-medium text-green-900 dark:text-green-100">Monitoring System</div>
                              <div className="text-sm text-green-700 dark:text-green-300">Depends on: Network, Database</div>
                            </div>
                            <div className="text-green-600 dark:text-green-400 font-bold">Medium</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Dependency Map</h3>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
                          <div className="text-gray-500 dark:text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300">Interactive dependency visualization is available in the asset management section</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              } 
            />

            <Route 
              path="/assets/workflow" 
              element={
                <div className="max-w-6xl mx-auto px-4 py-8">
                  <Breadcrumbs items={[
                    { label: 'Assets', path: '/assets' },
                    { label: 'Asset Workflow', isActive: true }
                  ]} />
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Asset Workflow
                      </h2>
                      <button
                        onClick={() => navigate('/assets')}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Back to Assets
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-primary-gold/10 dark:bg-dark-primary/20 p-4 rounded-lg">
                          <h3 className="font-semibold text-primary-gold dark:text-dark-primary mb-2">Asset Discovery</h3>
                          <p className="text-sm text-primary-gold/80 dark:text-dark-primary/80">Automated scanning and identification</p>
                          <div className="mt-2 text-2xl font-bold text-primary-gold dark:text-dark-primary">24</div>
                        </div>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                          <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Classification</h3>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300">Categorizing and tagging assets</p>
                          <div className="mt-2 text-2xl font-bold text-yellow-600 dark:text-yellow-400">18</div>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                          <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Validation</h3>
                          <p className="text-sm text-green-700 dark:text-green-300">Verification and approval</p>
                          <div className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">12</div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Workflow Steps</h3>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                            <span className="text-gray-900 dark:text-white">Asset Discovery & Inventory</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                            <span className="text-gray-900 dark:text-white">Classification & Tagging</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                            <span className="text-gray-900 dark:text-white">Risk Assessment</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                            <span className="text-gray-900 dark:text-white">Compliance Mapping</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              } 
            />

            <Route 
              path="/assets/roadmap" 
              element={
                <div className="max-w-6xl mx-auto px-4 py-8">
                  <Breadcrumbs items={[
                    { label: 'Assets', path: '/assets' },
                    { label: 'Asset Implementation Roadmap', isActive: true }
                  ]} />
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Asset Implementation Roadmap
                      </h2>
                      <button
                        onClick={() => navigate('/assets')}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Back to Assets
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-primary-gold/10 dark:bg-dark-primary/20 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-primary-gold dark:text-dark-primary mb-1">Phase 1</div>
                          <div className="text-sm text-primary-gold/80 dark:text-dark-primary/80">Discovery & Inventory</div>
                          <div className="text-xs text-primary-gold dark:text-dark-primary mt-1">Q1 2024</div>
                        </div>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">Phase 2</div>
                          <div className="text-sm text-yellow-700 dark:text-yellow-300">Classification & Risk</div>
                          <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">Q2 2024</div>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">Phase 3</div>
                          <div className="text-sm text-green-700 dark:text-green-300">Compliance Mapping</div>
                          <div className="text-xs text-green-600 dark:text-green-400 mt-1">Q3 2024</div>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">Phase 4</div>
                          <div className="text-sm text-purple-700 dark:text-purple-300">Monitoring & Maintenance</div>
                          <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">Q4 2024</div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Implementation Timeline</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <span className="text-gray-900 dark:text-white">Asset Discovery & Inventory</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{width: '100%'}}></div>
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">100%</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <span className="text-gray-900 dark:text-white">Risk Assessment & Classification</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                <div className="bg-yellow-500 h-2 rounded-full" style={{width: '75%'}}></div>
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">75%</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <span className="text-gray-900 dark:text-white">Compliance Mapping</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{width: '50%'}}></div>
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">50%</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <span className="text-gray-900 dark:text-white">Monitoring & Maintenance</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                <div className="bg-purple-500 h-2 rounded-full" style={{width: '25%'}}></div>
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">25%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              } 
            />

            <Route 
              path="/assets/action-plan" 
              element={
                <div className="max-w-6xl mx-auto px-4 py-8">
                  <Breadcrumbs items={[
                    { label: 'Assets', path: '/assets' },
                    { label: 'Asset Action Plan', isActive: true }
                  ]} />
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Asset Action Plan
                      </h2>
                      <button
                        onClick={() => navigate('/assets')}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Back to Assets
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                          <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">Critical Actions</h3>
                          <p className="text-sm text-red-700 dark:text-red-300">Immediate attention required</p>
                          <div className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">5</div>
                        </div>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                          <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">High Priority</h3>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300">Address within 30 days</p>
                          <div className="mt-2 text-2xl font-bold text-yellow-600 dark:text-yellow-400">12</div>
                        </div>
                        <div className="bg-primary-gold/10 dark:bg-dark-primary/20 p-4 rounded-lg">
                          <h3 className="font-semibold text-primary-gold dark:text-dark-primary mb-2">Medium Priority</h3>
                          <p className="text-sm text-primary-gold/80 dark:text-dark-primary/80">Address within 90 days</p>
                          <div className="mt-2 text-2xl font-bold text-primary-gold dark:text-dark-primary">18</div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Action Items</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <span className="text-gray-900 dark:text-white">Update firewall rules for critical servers</span>
                            </div>
                            <span className="text-sm text-red-600 dark:text-red-400 font-medium">Critical</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                              <span className="text-gray-900 dark:text-white">Implement asset tagging system</span>
                            </div>
                            <span className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">High</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <span className="text-gray-900 dark:text-white">Document asset dependencies</span>
                            </div>
                            <span className="text-sm text-primary-gold dark:text-dark-primary font-medium">Medium</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="text-gray-900 dark:text-white">Schedule regular asset audits</span>
                            </div>
                            <span className="text-sm text-green-600 dark:text-green-400 font-medium">Low</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              } 
            />

            {/* Team */}
            <Route 
              path="/team" 
              element={
                <TeamCollaborationDashboard
                  onBack={() => navigate('/dashboard')}
                  addNotification={addNotification}
                />
              } 
            />

            {/* Tasks */}
            <Route 
              path="/tasks" 
              element={
                <TaskManagementDashboard
                  onBack={() => navigate('/dashboard')}
                  addNotification={addNotification}
                />
              } 
            />

            {/* Calendar */}
            <Route 
              path="/calendar" 
              element={
                <ComplianceCalendarView
                  onBack={() => navigate('/dashboard')}
                  addNotification={addNotification}
                />
              } 
            />

            {/* Additional routes for tools */}
            <Route 
              path="/compliance-dashboard" 
              element={
                <ComplianceDashboard
                  onBack={() => navigate('/dashboard')}
                  addNotification={addNotification}
                />
              } 
            />
            <Route 
              path="/evidence-collector" 
              element={
                <EvidenceCollector
                  onBack={() => navigate('/dashboard')}
                  addNotification={addNotification}
                />
              } 
            />

            <Route 
              path="/audit-logs" 
              element={
                <AuditLogsView
                  onBack={() => navigate('/dashboard')}
                  addNotification={addNotification}
                />
              } 
            />

            {/* Policies */}
            <Route 
              path="/policies" 
              element={
                <PolicyManagementView
                  onBack={() => navigate('/dashboard')}
                  addNotification={addNotification}
                />
              } 
            />

            {/* Controls */}
            <Route 
              path="/controls" 
              element={
                <ControlsManagementView
                  onBack={() => navigate('/dashboard')}
                  addNotification={addNotification}
                />
              } 
            />

            {/* Reports */}
            <Route 
              path="/reports" 
              element={
                <AssessmentReportsPage
                  savedAssessments={savedAssessments}
                  onGenerateReport={handleGenerateReport}
                  onExportReport={handleExportAssessment}
                  onStartAssessment={handleStartAssessment}
                  userProfile={userProfile}
                  addNotification={addNotification}
                />
              } 
            />

            <Route 
              path="/reports/advanced" 
              element={
                <AdvancedReportingDashboard
                  savedAssessments={savedAssessments}
                  userProfile={userProfile}
                  onExportReport={(assessment, format) => handleExportReport(assessment, format)}
                />
              } 
            />

            <Route 
              path="/reports/team" 
              element={
                <TeamTrackingReport
                  onBack={() => navigate('/reports')}
                  onExportReport={(assessment, format) => handleExportReport(assessment, format)}
                />
              } 
            />

            <Route 
              path="/reports/compliance" 
              element={
                <ComplianceGapAnalyzer
                  savedAssessments={savedAssessments}
                  onStartAssessment={handleStartAssessment}
                  addNotification={addNotification}
                />
              } 
            />

            {/* User Management */}
            <Route 
              path="/profile" 
              element={
                <ProfileView
                  userProfile={userProfile}
                  onUpdateProfile={handleUpdateProfile}
                  onBack={() => navigate('/dashboard')}
                />
              } 
            />

            <Route 
              path="/settings" 
              element={
                <SettingsView
                  onBack={() => navigate('/dashboard')}
                />
              } 
            />

            <Route 
              path="/billing" 
              element={
                <BillingView
                  onBack={() => navigate('/dashboard')}
                />
              } 
            />

            <Route 
              path="/help" 
              element={
                <HelpView
                  onBack={() => navigate('/dashboard')}
                  addNotification={addNotification}
                  onShowTemplates={() => handleShowTemplates()}
                />
              } 
            />

            {/* Risk Management Routes */}
            <Route 
              path="/risk-assessment" 
              element={
                <RiskAssessmentGenerator
                  onSave={(assessment) => addNotification('success', 'Risk assessment saved successfully')}
                  onExport={(assessment) => addNotification('info', 'Risk assessment exported successfully')}
                />
              } 
            />

            <Route 
              path="/threat-modeling" 
              element={
                <ThreatModelingTool
                  onSave={(model) => addNotification('success', 'Threat model saved successfully')}
                  onExport={(model) => addNotification('info', 'Threat model exported successfully')}
                />
              } 
            />

            <Route 
              path="/vulnerability-scanner" 
              element={
                <VulnerabilityScanner
                  onSave={(scan) => addNotification('success', 'Vulnerability scan saved successfully')}
                  onExport={(scan) => addNotification('info', 'Vulnerability scan exported successfully')}
                />
              } 
            />

            {/* Training Routes */}
            <Route 
              path="/training-modules" 
              element={
                <TrainingModuleGenerator
                  onSave={(module) => addNotification('success', 'Training module saved successfully')}
                  onExport={(module) => addNotification('info', 'Training module exported successfully')}
                />
              } 
            />

            <Route 
              path="/awareness-campaigns" 
              element={
                <AwarenessCampaignPlanner
                  onSave={(campaign) => addNotification('success', 'Awareness campaign saved successfully')}
                  onExport={(campaign) => addNotification('info', 'Awareness campaign exported successfully')}
                />
              } 
            />

            {/* Audit Routes */}
            <Route 
              path="/audit-checklists" 
              element={
                <AuditChecklistGenerator
                  onSave={(checklist) => addNotification('success', 'Audit checklist saved successfully')}
                  onExport={(checklist) => addNotification('info', 'Audit checklist exported successfully')}
                />
              } 
            />


            {/* Technical Tools Routes */}
            <Route 
              path="/security-controls" 
              element={
                <SecurityControlMapper
                  onSave={(mapper) => addNotification('success', 'Control mapping saved successfully')}
                  onExport={(mapper) => addNotification('info', 'Control mapping exported successfully')}
                />
              } 
            />

            <Route 
              path="/config-baselines" 
              element={
                <ConfigurationBaselineGenerator
                  onSave={(baseline) => addNotification('success', 'Configuration baseline saved successfully')}
                  onExport={(baseline) => addNotification('info', 'Configuration baseline exported successfully')}
                />
              } 
            />

            <Route 
              path="/incident-response" 
              element={
                <IncidentResponsePlanner
                  onSave={(plan) => addNotification('success', 'Incident response plan saved successfully')}
                  onExport={(plan) => addNotification('info', 'Incident response plan exported successfully')}
                />
              } 
            />

            {/* CMMC Tools Routes - Functional Implementations */}
            <Route 
              path="/ssp-generator" 
              element={
                <SSPGenerator 
                  savedAssessments={savedAssessments}
                  onBack={() => navigate('/dashboard')}
                  addNotification={addNotification}
                />
              } 
            />
            <Route 
              path="/poam-manager" 
              element={
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <Breadcrumbs items={[
                    { label: 'CMMC Tools', path: '/poam-manager' },
                    { label: 'POAM Manager', isActive: true }
                  ]} />
                  {/* Header */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl">
                            <CheckSquare className="w-8 h-8 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Plan of Action and Milestones Manager</h1>
                            <p className="text-gray-600 dark:text-gray-300">
                              Track and manage your CMMC implementation progress
                            </p>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => navigate('/gap-analysis')}
                          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <BarChart3 className="w-4 h-4" />
                          <span>Start Gap Analysis</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Features Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <CheckSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Automated Generation</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Generate POA&Ms automatically from gap analysis and assessment results
                      </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-primary-gold/20 dark:bg-dark-primary/30 rounded-lg">
                          <Target className="w-6 h-6 text-primary-gold dark:text-dark-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Milestone Tracking</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Monitor progress with detailed milestone tracking and timeline management
                      </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <AlertTriangle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Risk Prioritization</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Prioritize actions based on risk assessment and compliance requirements
                      </p>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <CheckSquare className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Ready to Create Your POA&M?
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                        Start by running a gap analysis to identify compliance gaps and automatically 
                        generate a comprehensive Plan of Action and Milestones for CMMC implementation.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                          onClick={() => navigate('/gap-analysis')}
                          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                          Start Gap Analysis
                        </button>
                        <button 
                          onClick={() => navigate('/dashboard')}
                          className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                        >
                          View Dashboard
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              } 
            />
            <Route 
              path="/control-assessor" 
              element={
                <ErrorBoundary>
                  <CMMCControlAssessor
                    onNavigate={navigate}
                    onSave={(assessment) => addNotification('success', 'Control assessment saved successfully')}
                    onExport={(assessment) => addNotification('info', 'Control assessment exported successfully')}
                  />
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/gap-analysis" 
              element={
                <ErrorBoundary>
                  <ComplianceGapAnalyzer
                    savedAssessments={savedAssessments}
                    onStartAssessment={handleStartAssessment}
                    addNotification={addNotification}
                  />
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/audit-tracker" 
              element={
                <SelfAssessmentPreparation
                  onBack={() => navigate('/dashboard')}
                  addNotification={addNotification}
                />
              } 
            />
            <Route 
              path="/policy-generator" 
              element={
                <PolicyManagementView
                  onBack={() => navigate('/dashboard')}
                  addNotification={addNotification}
                />
              } 
            />
            <Route 
              path="/training-tracker" 
              element={
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <Breadcrumbs items={[
                    { label: 'Training', path: '/training-tracker' },
                    { label: 'Security Training Tracker', isActive: true }
                  ]} />
                  {/* Header */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-xl">
                            <BookOpen className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                          </div>
                          <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Security Training Tracker</h1>
                            <p className="text-gray-600 dark:text-gray-300">
                              Track and manage security awareness training programs
                            </p>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => navigate('/team')}
                          className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                          <Users className="w-4 h-4" />
                          <span>Manage Team</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Features Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                          <BookOpen className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">CMMC Training</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Track CMMC awareness training completion and compliance requirements
                      </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-primary-gold/20 dark:bg-dark-primary/30 rounded-lg">
                          <Users className="w-6 h-6 text-primary-gold dark:text-dark-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Employee Tracking</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Monitor individual employee training progress and completion status
                      </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <FileBarChart className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Compliance Reporting</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Generate compliance reports and analytics for audit preparation
                      </p>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Ready to Track Training?
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                        Manage your team's security awareness training progress and ensure 
                        CMMC compliance with comprehensive tracking and reporting tools.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                          onClick={() => navigate('/team')}
                          className="bg-yellow-600 text-white px-8 py-3 rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                        >
                          Manage Team Training
                        </button>
                        <button 
                          onClick={() => navigate('/dashboard')}
                          className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                        >
                          View Dashboard
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              } 
            />

            {/* Assessment Types */}
            <Route 
              path="/cmmc-assessment" 
              element={
                <AssessmentIntroScreen
                  onStartAssessment={() => navigate('/assessment-intro')}
                  onBack={() => navigate('/reports')}
                />
              } 
            />

            <Route 
              path="/privacy-assessment" 
              element={
                <AssessmentIntroScreen
                  onStartAssessment={() => navigate('/assessment-intro')}
                  onBack={() => navigate('/reports')}
                />
              } 
            />

            {/* Login/Auth */}
            <Route 
              path="/login" 
              element={
                <LoginPage 
                  onBack={() => navigate('/')}
                />
              } 
            />

            {/* Fallback route */}
            <Route path="*" element={
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Page Not Found
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    The page you're looking for doesn't exist or has been moved.
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="w-full bg-primary-gold text-white py-3 px-4 rounded-lg hover:bg-primary-gold/90 transition-colors font-medium"
                    >
                      Go to Dashboard
                    </button>
                    <button
                      onClick={() => navigate('/')}
                      className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                    >
                      Go Home
                    </button>
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="sticky-footer bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <img src="/cybercertitude.png" alt="CyberCertitude" className="w-12 h-12" />
                  <div className="flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                      CyberCertitude™
                    </h3>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-tight">
                      CMMC 2.0 Compliance 
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                      by ERMITS
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-md">
                  Complete CMMC Level 1 compliance platform for DoD contractors protecting
                  Federal Contract Information with comprehensive assessment, evidence 
                  collection, and self-assessment preparation.
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>© 2025 ERMITS LLC</span>
                  <span>•</span>
                  <span>CMMC Level 1 Platform</span>
                  <span>•</span>
                  <span>Version 2.0.0</span>
                </div>
              </div>
              
              {/* Quick Links */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Links
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <button
                      onClick={() => navigate('/assessment-intro')}
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-gold dark:hover:text-dark-primary transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      <span>Start CMMC Assessment</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate('/compliance')}
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-gold dark:hover:text-dark-primary transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Compliance Status</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate('/evidence')}
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-gold dark:hover:text-dark-primary transition-colors"
                    >
                      <Database className="w-4 h-4" />
                      <span>Evidence Collection</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate('/reports')}
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-gold dark:hover:text-dark-primary transition-colors"
                    >
                      <FileBarChart className="w-4 h-4" />
                      <span>Assessment Reports</span>
                    </button>
                  </li>
                </ul>
              </div>
              
              {/* Resources */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Resources
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <button
                      onClick={() => navigate('/help')}
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-gold dark:hover:text-dark-primary transition-colors"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>Help & Support</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => addNotification('info', 'CMMC documentation links would be available in production')}
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-gold dark:hover:text-dark-primary transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>CMMC Documentation</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => addNotification('info', 'DoD contractor resources would be available in production')}
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-gold dark:hover:text-dark-primary transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>DoD Contractor Resources</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate('/settings')}
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-gold dark:hover:text-dark-primary transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Mobile Navigation */}
            <div className="md:hidden mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/assessment-intro')}
                  className="flex items-center space-x-2 p-3 text-left bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <Shield className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    New Assessment
                  </span>
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center space-x-2 p-3 text-left bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <BarChart3 className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Dashboard
                  </span>
                </button>
                <button
                  onClick={() => navigate('/compliance')}
                  className="flex items-center space-x-2 p-3 text-left bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <CheckCircle className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Compliance
                  </span>
                </button>
                <button
                  onClick={() => navigate('/evidence')}
                  className="flex items-center space-x-2 p-3 text-left bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Evidence
                  </span>
                </button>
                <button
                  onClick={() => navigate('/assets')}
                  className="flex items-center space-x-2 p-3 text-left bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <Database className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Assets
                  </span>
                </button>
                <button
                  onClick={() => navigate('/reports')}
                  className="flex items-center space-x-2 p-3 text-left bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <FileBarChart className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Reports
                  </span>
                </button>
                <button
                  onClick={() => navigate('/tasks')}
                  className="flex items-center space-x-2 p-3 text-left bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <CheckSquare className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tasks
                  </span>
                </button>
                <button
                  onClick={() => navigate('/policies')}
                  className="flex items-center space-x-2 p-3 text-left bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Policies
                  </span>
                </button>
                <button
                  onClick={() => navigate('/team')}
                  className="flex items-center space-x-2 p-3 text-left bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Team
                  </span>
                </button>
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
        
        <KeyboardShortcutsHelp shortcuts={shortcuts} />
        
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
          onSelectTemplate={handleSelectTemplate}
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
            addNotification('success', 'CMMC Platform installed successfully!');
          }}
          onDismiss={() => {
            // Store dismissal preference
            localStorage.setItem('pwa-install-dismissed', Date.now().toString());
          }}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;