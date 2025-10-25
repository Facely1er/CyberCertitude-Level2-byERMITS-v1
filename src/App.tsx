import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { 
  Shield, 
  ChartBar as BarChart3, 
  CircleCheck as CheckCircle, 
  FileText, 
  SquareCheck as CheckSquare, 
  Target, 
  Activity, 
  Database, 
  Users, 
  Settings, 
  Circle as HelpCircle, 
  Lock, 
  Menu, 
  Play, 
  BookOpen, 
  ExternalLink, 
  TriangleAlert as AlertTriangle, 
  FileBarChart,
  Wrench,
  Tag,
  GitBranch,
  Workflow,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { OfflineNotice } from './components/OfflineNotice';
import { CMMCOnboardingFlow } from './components/CMMCOnboardingFlow';
import { ProductionReadinessWidget } from './components/ProductionReadinessWidget';
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp';
import { AssetManagementModal } from './components/AssetManagementModal';
import { SSPGenerator } from './components/SSPGenerator';
import { TemplateManagementModal } from './components/TemplateManagementModal';
import { TemplateLibraryBrowser } from './components/TemplateLibraryBrowser';
import { TemplateCustomizationModal } from './components/TemplateCustomizationModal';
import { WorkflowGuidance } from './components/WorkflowGuidance';
import { ContextualHelp } from './components/ContextualHelp';
import { 
  ProjectCharterPage, 
  CUIScopePage, 
  DataFlowPage, 
  TeamRolesPage, 
  ImplementationWorkbookPage,
  PolicyTemplatesPage,
  DocumentRepositoryPage,
  ControlValidationPage,
  ComplianceTrackingPage,
  AuditPackagePage,
  C3PAOPrepPage,
  MetricsDashboardPage,
  CertificationTrackingPage
} from './components/PlaceholderPages';
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
import { getFramework } from './data/frameworks';
import { AssessmentData, UserProfile, NotificationMessage } from './shared/types';
import { Asset } from './shared/types/assets';
import { AssessmentTemplate } from './shared/types/documentation';
import { dataService } from './services/dataService';
import { reportService } from './services/reportService';
import { assetService } from './services/assetService';
import { logger } from '@/utils/logger';

// Template Customization Route Component
const TemplateCustomizationRoute: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const [template, setTemplate] = useState<any>(null);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);

  useEffect(() => {
    if (templateId) {
      // Load template data
      // This would integrate with templateService
      setTemplate({ id: templateId, name: 'Template', description: 'Template description' });
    }
  }, [templateId]);

  const handleSaveCustomization = (templateId: string, customizations: any) => {
    logger.info('Template customizations saved', { templateId, customizationsCount: Object.keys(customizations).length });
  };

  const handleExportCustomization = async (templateId: string, customizations: any, format: string) => {
    try {
      logger.info('Exporting customized template', { templateId, format, customizationsCount: Object.keys(customizations).length });
      // Export logic would be handled here
    } catch (error) {
      logger.error('Failed to export customized template:', error);
    }
  };

  if (!template) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <TemplateCustomizationModal
        template={template}
        isOpen={showCustomizationModal}
        onClose={() => setShowCustomizationModal(false)}
        onSave={handleSaveCustomization}
        onExport={handleExportCustomization}
      />
      
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Template Customization
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Template customization functionality will be available here.
        </p>
        <button
          onClick={() => setShowCustomizationModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Open Customization Modal
        </button>
      </div>
    </>
  );
};

// Import lazy-loaded components
import {
  AuthPage,
  EnhancedAssessmentView,
  AdvancedDashboard,
  ReportView,
  AssetDashboard,
  AssetInventoryView,
  TaskManagementDashboard,
  TeamCollaborationDashboard,
  PolicyManagementView,
  ControlsManagementView,
  ComplianceGapAnalyzer,
  SecurityAssessmentReportGenerator,
  ComplianceCalendarView,
  AssessmentReportsPage,
  AdvancedReportingDashboard,
  TeamTrackingReport,
  AssessmentIntroScreen,
  ComplianceWorkflow,
  RealTimeComplianceStatus,
  ProfileView,
  SettingsView,
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
  EvidenceCollector,
  AuditLogsView,
  // Technical Tools Components
  SecurityControlMapper,
  ConfigurationBaselineGenerator,
  IncidentResponsePlanner,
  EnhancedIncidentResponsePlanGenerator,
  // CMMC Journey Workflow
  CMMCJourneyWorkflow,
  // CMMC Control Assessor
  CMMCControlAssessor,
  // CMMC Evidence Collector
  CMMCEvidenceCollector,
  // CMMC Compliance Dashboard
  CMMCComplianceDashboard,
  // C3PAO Preparation Tool
  C3PAOPreparationTool,
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
        <div className="card-standard p-8">
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            Assessment Not Found
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
            The assessment you're looking for could not be found.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary px-6 py-3"
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
        <div className="card-standard p-8">
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            Framework Not Found
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
            The assessment framework could not be loaded.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary px-6 py-3"
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
        const savedAssessment = await saveAssessment(updatedAssessment);
        addNotification('success', 'Assessment saved successfully');
        return savedAssessment;
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
        <div className="card-standard p-8">
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            Assessment Not Found
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
            The assessment you're looking for could not be found.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary px-6 py-3"
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
        <div className="card-standard p-8">
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            Framework Not Found
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
            The assessment framework could not be loaded.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary px-6 py-3"
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
  const { user, signOut, isAuthenticated } = useAuth();
  
  // Ensure page scrolls to top on route changes
  useScrollToTop();

  // CMMC 2.0 Level 2 Implementation Navigation - Reorganized for Better UX
  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: BarChart3,
      description: 'Overview and quick access to key features'
    },
    {
      label: 'Assessment',
      icon: Target,
      children: [
        {
          label: 'Start Assessment',
          href: '/assessment-intro',
          icon: Play,
          description: 'Begin CMMC 2.0 Level 2 assessment'
        },
        {
          label: 'Gap Analysis',
          href: '/gap-analysis',
          icon: AlertTriangle,
          description: 'Identify compliance gaps and requirements'
        },
        {
          label: 'Risk Assessment',
          href: '/risk-assessment',
          icon: Shield,
          description: 'Assess security risks and vulnerabilities'
        },
        {
          label: 'Control Assessor',
          href: '/control-assessor',
          icon: CheckCircle,
          description: 'Review all 110 security controls'
        }
      ]
    },
    {
      label: 'Implementation',
      icon: Wrench,
      children: [
        {
          label: 'Project Setup',
          href: '/project-charter',
          icon: FileText,
          description: 'Define scope, team, and objectives'
        },
        {
          label: 'CUI Scope',
          href: '/cui-scope',
          icon: Target,
          description: 'Identify systems and assets under CUI scope'
        },
        {
          label: 'Data Flow Mapping',
          href: '/data-flow',
          icon: Activity,
          description: 'Map CUI data flows and system boundaries'
        },
        {
          label: 'Team Roles',
          href: '/team-roles',
          icon: Users,
          description: 'Designate compliance team roles'
        },
        {
          label: 'Implementation Workbook',
          href: '/implementation-workbook',
          icon: BookOpen,
          description: 'Control-level tasks and evidence checklist'
        },
        {
          label: 'CMMC Journey',
          href: '/cmmc-journey',
          icon: Activity,
          description: 'Guided step-by-step implementation workflow'
        },
        {
          label: 'Template Library',
          href: '/templates/library',
          icon: FileText,
          description: 'Browse and customize CMMC compliance templates'
        }
      ]
    },
    {
      label: 'Compliance',
      icon: Shield,
      children: [
        {
          label: 'Real-time Status',
          href: '/compliance',
          icon: Activity,
          description: 'Monitor compliance progress'
        },
        {
          label: 'Evidence Collection',
          href: '/evidence',
          icon: FileBarChart,
          description: 'Collect and organize compliance evidence'
        },
        {
          label: 'Policy Management',
          href: '/policies',
          icon: FileText,
          description: 'Create and manage required policies'
        },
        {
          label: 'Controls Management',
          href: '/controls',
          icon: Settings,
          description: 'Manage CMMC control implementation'
        },
        {
          label: 'POA&M Manager',
          href: '/poam-manager',
          icon: CheckSquare,
          description: 'Track action plans for gaps'
        }
      ]
    },
    {
      label: 'Assets',
      icon: Database,
      children: [
        {
          label: 'Asset Inventory',
          href: '/assets/inventory',
          icon: Database,
          description: 'Catalog systems and assets'
        },
        {
          label: 'Asset Categories',
          href: '/assets/categories',
          icon: Tag,
          description: 'Organize assets by category'
        },
        {
          label: 'Dependencies',
          href: '/assets/dependencies',
          icon: GitBranch,
          description: 'Map asset relationships'
        },
        {
          label: 'Workflow',
          href: '/assets/workflow',
          icon: Workflow,
          description: 'Asset management workflows'
        }
      ]
    },
    {
      label: 'Team & Tools',
      icon: Users,
      children: [
        {
          label: 'Team Collaboration',
          href: '/team',
          icon: Users,
          description: 'Coordinate team activities'
        },
        {
          label: 'Task Management',
          href: '/tasks',
          icon: CheckSquare,
          description: 'Track implementation tasks'
        },
        {
          label: 'Calendar',
          href: '/calendar',
          icon: Calendar,
          description: 'Schedule compliance activities'
        },
        {
          label: 'Reports',
          href: '/reports',
          icon: FileText,
          description: 'Generate compliance reports'
        },
        {
          label: 'SSP Generator',
          href: '/ssp-generator',
          icon: FileText,
          description: 'Generate System Security Plans'
        },
        {
          label: 'Workflow Guidance',
          href: '/workflow-guidance',
          icon: BookOpen,
          description: 'Step-by-step implementation guidance'
        }
      ]
    }
  ];
  
  // State management
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState<string>('cmmc');
  const [selectedCMMCLevel] = useState<number>(2);

  // Assessment management
  const { 
    assessments: savedAssessments,
    saveAssessment,
    removeAssessment,
    loadAssessments
  } = useAssessments();


  // Load user profile on mount
  useEffect(() => {
    const profile = dataService.getUserProfile();
    setUserProfile(profile);
    
    // Check if first visit
    const hasVisited = localStorage.getItem('has-visited');
    if (!hasVisited) {
      setIsFirstVisit(true);
      localStorage.setItem('has-visited', 'true');
    }

    // Set initial view based on profile and assessments
    if (location.pathname === '/' || location.pathname === '/dashboard') {
      // Navigation is handled by React Router, no need to set view state
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
  const addNotification = useCallback((type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    try {
      const notification: NotificationMessage = {
        id: Date.now().toString(),
        type,
        message,
        timestamp: new Date()
      };
      
      setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Keep only last 5 notifications
      
      // Auto-remove success notifications after 5 seconds
      if (type === 'success') {
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, 5000);
      }
    } catch (error) {
      console.error('Failed to add notification:', error);
    }
  }, []);

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
        includeRecommendations: true,
        branding: {
          organizationName: userProfile?.organization || 'Organization',
          logo: undefined
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
      status: 'in-progress',
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
        location: 'United States',
        assessor: userProfile.name || 'Assessor',
        regulatoryRequirements: ['CMMC 2.0 Level 2']
      } : undefined,
      questionNotes: {},
      questionEvidence: {},
      templateId: template.id,
      templateMetadata: {
        industry: template.industry,
        organizationSize: template.organizationSize?.[0] || 'medium',
        complexity: 'intermediate',
        prefilledQuestions: 0
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

  const handleLoadAssessment = (assessment: AssessmentData) => {
    navigate(`/assessment/${assessment.id}`);
  };

  const handleUpdateProfile = (profile: UserProfile) => {
    // Check authentication only when saving preferences
    if (!user) {
      addNotification('warning', 'Please sign in to save profile changes');
      return;
    }
    
    setUserProfile(profile);
    dataService.saveUserProfile(profile);
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
        dataService.importAllData(importedData);
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
      <div className="sticky-footer-container bg-background-light dark:bg-background-dark">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-sm border-b border-support-light dark:border-support-dark z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              {/* Left Section - Branding */}
              <Link to="/" className="flex items-center space-x-2 flex-shrink-0 min-w-0 hover:opacity-80 transition-opacity duration-200">
                <img src="/cybercertitude.png" alt="CyberCertitude" className="w-12 h-12" />
                <div className="flex flex-col min-w-0">
                  <h1 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark leading-tight">
                    CyberCertitude™
                  </h1>
                  <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark leading-tight hidden sm:block">
                    CMMC 2.0 Compliance 
                  </span>
                  <span className="text-xs text-text-muted-light dark:text-text-muted-dark leading-tight hidden md:block">
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
                  className="md:hidden p-1.5 sm:p-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-500 dark:hover:text-primary-400 hover:bg-primary-500/10 dark:hover:bg-primary-400/20 rounded-lg transition-colors"
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
                <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background-light to-secondary-50 dark:from-background-dark dark:via-surface-dark dark:to-background-dark flex items-center justify-center px-4 py-12">
                  <div className="w-full max-w-md">
                    <div className="card-standard p-8">
                      <div className="text-center mb-8">
                        <div className="mx-auto w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
                          <Lock className="w-6 h-6 text-primary-500 dark:text-primary-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                          Reset Password
                        </h2>
                        <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2">
                          Enter your email to receive reset instructions
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
                          Password reset functionality is available through the authentication system.
                        </p>
                        <button
                          onClick={() => navigate('/auth')}
                          className="btn-primary px-6 py-3"
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
                <AdvancedDashboard
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

            {/* Workflow Guidance */}
            <Route 
              path="/workflow-guidance" 
              element={
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <WorkflowGuidance 
                    currentPage="/workflow-guidance"
                    userRole="compliance-officer"
                    onNavigate={navigate}
                    className="mb-8"
                  />
                </div>
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
                    onSave={(_dashboard) => addNotification('success', 'Compliance dashboard saved successfully')}
                    onExport={(_dashboard) => addNotification('info', 'Compliance dashboard exported successfully')}
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
                  selectedLevel={selectedCMMCLevel}
                  onNavigate={navigate}
                  onSave={(_workflow) => addNotification('success', 'CMMC journey progress saved')}
                  onExport={(_workflow) => addNotification('info', 'CMMC journey exported successfully')}
                />
              } 
            />

            {/* Evidence */}
            <Route 
              path="/evidence" 
              element={
                <CMMCEvidenceCollector
                  onNavigate={navigate}
                  onSave={(_evidence) => addNotification('success', 'Evidence collection saved successfully')}
                  onExport={(_evidence) => addNotification('info', 'Evidence collection exported successfully')}
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
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">IT Assets</h3>
                        <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">Servers, workstations, network devices</p>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">24</div>
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
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Asset Discovery</h3>
                          <p className="text-sm text-blue-700 dark:text-blue-300">Automated scanning and identification</p>
                          <div className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">24</div>
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
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">Phase 1</div>
                          <div className="text-sm text-blue-700 dark:text-blue-300">Discovery & Inventory</div>
                          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Q1 2024</div>
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
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Medium Priority</h3>
                          <p className="text-sm text-blue-700 dark:text-blue-300">Address within 90 days</p>
                          <div className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">18</div>
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
                            <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">Medium</span>
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
                  onExportReport={(format: 'pdf' | 'excel' | 'json') => {
                    if (savedAssessments.length > 0) {
                      // Map 'excel' to 'csv' since handleExportReport doesn't support 'excel'
                      const exportFormat = format === 'excel' ? 'csv' : format;
                      handleExportReport(savedAssessments[0], exportFormat);
                    }
                  }}
                />
              } 
            />

            <Route 
              path="/reports/team" 
              element={
                <TeamTrackingReport
                  onBack={() => navigate('/reports')}
                  addNotification={addNotification}
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

            <Route
              path="/reports/security-assessment"
              element={
                <SecurityAssessmentReportGenerator
                  assessments={savedAssessments}
                  userProfile={userProfile}
                  onSaveReport={(report) => {
                    addNotification('success', 'Security Assessment Report saved successfully');
                  }}
                  onExportReport={(report, format) => {
                    addNotification('success', `Security Assessment Report exported as ${format.toUpperCase()}`);
                  }}
                  onBack={() => navigate('/reports')}
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
                  onSave={(_assessment) => addNotification('success', 'Risk assessment saved successfully')}
                  onExport={(_assessment) => addNotification('info', 'Risk assessment exported successfully')}
                />
              } 
            />

            <Route 
              path="/threat-modeling" 
              element={
                <ThreatModelingTool
                  onSave={(_model) => addNotification('success', 'Threat model saved successfully')}
                  onExport={(_model) => addNotification('info', 'Threat model exported successfully')}
                />
              } 
            />

            <Route 
              path="/vulnerability-scanner" 
              element={
                <VulnerabilityScanner
                  onSave={(_scan) => addNotification('success', 'Vulnerability scan saved successfully')}
                  onExport={(_scan) => addNotification('info', 'Vulnerability scan exported successfully')}
                />
              } 
            />

            {/* Training Routes */}
            <Route 
              path="/training-modules" 
              element={
                <TrainingModuleGenerator
                  onSave={(_module) => addNotification('success', 'Training module saved successfully')}
                  onExport={(_module) => addNotification('info', 'Training module exported successfully')}
                />
              } 
            />

            <Route 
              path="/awareness-campaigns" 
              element={
                <AwarenessCampaignPlanner
                  onSave={(_campaign) => addNotification('success', 'Awareness campaign saved successfully')}
                  onExport={(_campaign) => addNotification('info', 'Awareness campaign exported successfully')}
                />
              } 
            />

            {/* Audit Routes */}
            <Route 
              path="/audit-checklists" 
              element={
                <AuditChecklistGenerator
                  onSave={(_checklist) => addNotification('success', 'Audit checklist saved successfully')}
                  onExport={(_checklist) => addNotification('info', 'Audit checklist exported successfully')}
                />
              } 
            />


            {/* Technical Tools Routes */}
            <Route 
              path="/security-controls" 
              element={
                <SecurityControlMapper
                  onSave={(_mapper) => addNotification('success', 'Control mapping saved successfully')}
                  onExport={(_mapper) => addNotification('info', 'Control mapping exported successfully')}
                />
              } 
            />

            <Route 
              path="/config-baselines" 
              element={
                <ConfigurationBaselineGenerator
                  onSave={(_baseline) => addNotification('success', 'Configuration baseline saved successfully')}
                  onExport={(_baseline) => addNotification('info', 'Configuration baseline exported successfully')}
                />
              } 
            />

            <Route
              path="/incident-response"
              element={
                <IncidentResponsePlanner
                  onSave={(_plan) => addNotification('success', 'Incident response plan saved successfully')}
                  onExport={(_plan) => addNotification('info', 'Incident response plan exported successfully')}
                />
              }
            />

            <Route
              path="/incident-response-plan-generator"
              element={
                <EnhancedIncidentResponsePlanGenerator />
              }
            />

            {/* Phase 1: Initiation Routes */}
            <Route 
              path="/overview" 
              element={
                <div className="max-w-7xl mx-auto p-6">
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">CMMC Implementation Overview</h1>
                    <p className="text-gray-600 mb-6">
                      CyberCertitude provides a guided, auditable implementation workflow for organizations seeking CMMC Level 1 or Level 2 certification.
                      It functions as an interactive compliance project manager, tracking readiness, implementation, and verification for every control.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Scope Coverage</h3>
                        <p className="text-gray-600">Covers all CMMC 2.0 Level 1 (17 practices) and Level 2 (110 practices)</p>
                      </div>
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Standards Mapping</h3>
                        <p className="text-gray-600">Mapped to NIST SP 800-171 Rev 2, NIST SP 800-53 Rev 5, and ISO/IEC 27001:2022</p>
                      </div>
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Implementation Phases</h3>
                        <p className="text-gray-600">7 structured phases from initiation to certification support</p>
                      </div>
                    </div>
                  </div>
                </div>
              } 
            />

            <Route 
              path="/project-charter" 
              element={
                <ProjectCharterPage onBack={() => navigate('/dashboard')} />
              } 
            />

            <Route 
              path="/cui-scope" 
              element={
                <CUIScopePage onBack={() => navigate('/dashboard')} />
              } 
            />

            <Route 
              path="/data-flow" 
              element={
                <DataFlowPage onBack={() => navigate('/dashboard')} />
              } 
            />

            <Route 
              path="/team-roles" 
              element={
                <TeamRolesPage onBack={() => navigate('/dashboard')} />
              } 
            />

            {/* Phase 3: Implementation Routes */}
            <Route 
              path="/implementation-workbook" 
              element={
                <ImplementationWorkbookPage onBack={() => navigate('/dashboard')} />
              } 
            />

            {/* Phase 4: Policy Development Routes */}
            <Route 
              path="/policy-templates" 
              element={
                <PolicyTemplatesPage onBack={() => navigate('/dashboard')} />
              } 
            />

            <Route 
              path="/document-repository" 
              element={
                <DocumentRepositoryPage onBack={() => navigate('/dashboard')} />
              } 
            />

            {/* Phase 5: Validation Routes */}
            <Route 
              path="/control-validation" 
              element={
                <ControlValidationPage onBack={() => navigate('/dashboard')} />
              } 
            />

            <Route 
              path="/compliance-tracking" 
              element={
                <ComplianceTrackingPage onBack={() => navigate('/dashboard')} />
              } 
            />

            {/* Phase 7: Certification Support Routes */}
            <Route 
              path="/audit-package" 
              element={
                <AuditPackagePage onBack={() => navigate('/dashboard')} />
              } 
            />

            <Route 
              path="/c3pao-prep" 
              element={
                <C3PAOPrepPage onBack={() => navigate('/dashboard')} />
              } 
            />

            <Route 
              path="/metrics-dashboard" 
              element={
                <MetricsDashboardPage onBack={() => navigate('/dashboard')} />
              } 
            />

            <Route 
              path="/certification-tracking" 
              element={
                <CertificationTrackingPage onBack={() => navigate('/dashboard')} />
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
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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
                    selectedLevel={selectedCMMCLevel}
                    onNavigate={navigate}
                    onSave={(_assessment) => addNotification('success', 'Control assessment saved successfully')}
                    onExport={(_assessment) => addNotification('info', 'Control assessment exported successfully')}
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
                <ErrorBoundary>
                  <C3PAOPreparationTool
                    onNavigate={navigate}
                    onSave={(_preparation) => addNotification('success', 'C3PAO preparation saved successfully')}
                    onExport={(_preparation) => addNotification('info', 'C3PAO preparation exported successfully')}
                  />
                </ErrorBoundary>
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
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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
                  selectedLevel={selectedCMMCLevel}
                  onStartAssessment={() => navigate('/assessment-intro')}
                  onBack={() => navigate('/reports')}
                />
              } 
            />

            <Route 
              path="/privacy-assessment" 
              element={
                <AssessmentIntroScreen
                  selectedLevel={selectedCMMCLevel}
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
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
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

            {/* Template Library Routes */}
            <Route 
              path="/templates/library" 
              element={
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Template Library</h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Browse and customize CMMC compliance templates including SSPs, policies, incident response plans, and more.
                    </p>
                  </div>
                  <TemplateLibraryBrowser
                    onSelectTemplate={(template) => {
                      addNotification('success', `Template "${template.name}" selected`);
                      navigate(`/templates/customize/${template.id}`);
                    }}
                    onCustomizeTemplate={(template) => {
                      navigate(`/templates/customize/${template.id}`);
                    }}
                    onExportTemplate={async (template, format) => {
                      try {
                        addNotification('info', `Exporting ${template.name} as ${format}...`);
                        // Export logic would be handled by the component
                      } catch (error) {
                        addNotification('error', 'Export failed');
                      }
                    }}
                  />
                </div>
              } 
            />

            <Route 
              path="/templates/customize/:templateId" 
              element={
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <div className="mb-8">
                    <button
                      onClick={() => navigate('/templates/library')}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors mb-4"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>Back to Template Library</span>
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Customize Template</h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Customize template fields and preview the final document before export.
                    </p>
                  </div>
                  <TemplateCustomizationRoute />
                </div>
              } 
            />
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
                  Complete CMMC 2.0 Level 2 compliance platform for Military contractors protecting
                  Controlled Unclassified Information with comprehensive assessment, evidence 
                  collection, and C3PAO preparation.
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>© 2025 ERMITS LLC</span>
                  <span>•</span>
                  <span>CMMC 2.0 Level 2 Platform</span>
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
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      <span>Start CMMC Assessment</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate('/compliance')}
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Compliance Status</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate('/evidence')}
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Database className="w-4 h-4" />
                      <span>Evidence Collection</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate('/reports')}
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>Help & Support</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => addNotification('info', 'CMMC documentation links would be available in production')}
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>CMMC Documentation</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => addNotification('info', 'Military contractor resources would be available in production')}
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Military Contractor Resources</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate('/settings')}
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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

        {/* Contextual Help */}
        <ContextualHelp 
          currentPage={location.pathname}
          userRole="compliance-officer"
          onNavigate={navigate}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;