import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppLayout } from './components/layout/AppLayout';
import { RouteRenderer } from './routes/RouteRenderer';
import { useAppState } from './hooks/useAppState';
import { useNotifications } from './hooks/useNotifications';
import { useAssetManagement } from './hooks/useAssetManagement';
import { useAssessmentActions } from './hooks/useAssessmentActions';
import { useOfflineSupport } from './hooks/useOfflineSupport';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useAuth } from './shared/hooks/useAuth';
import { useAssessments } from './shared/hooks/useAssessments';
import { useScrollToTop } from './hooks/useScrollToTop';
import { navigationItems } from './config/navigation';
import { allRoutes } from './routes/index.tsx';
import { AssessmentRoute } from './routes/AssessmentRoute';
import { ReportRoute } from './routes/ReportRoute';
import { AssessmentData, UserProfile } from './shared/types';

// Enhanced Assessment Route Component
const EnhancedAssessmentRoute: React.FC<{
  savedAssessments: AssessmentData[];
  saveAssessment: (assessment: AssessmentData) => Promise<AssessmentData>;
  userProfile: UserProfile | null;
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
  navigate: (path: string) => void;
  onGenerateReport: (assessment: AssessmentData) => Promise<any>;
}> = ({ savedAssessments, saveAssessment, userProfile, addNotification, navigate, onGenerateReport }) => (
  <AssessmentRoute
    savedAssessments={savedAssessments}
    saveAssessment={saveAssessment}
    userProfile={userProfile}
    addNotification={addNotification}
    navigate={navigate}
    onGenerateReport={onGenerateReport}
  />
);

// Enhanced Report Route Component
const EnhancedReportRoute: React.FC<{
  savedAssessments: AssessmentData[];
  userProfile: UserProfile | null;
  handleExportAssessment: (assessment: AssessmentData, format: 'json' | 'csv' | 'pdf') => Promise<void>;
  navigate: (path: string) => void;
}> = ({ savedAssessments, userProfile, handleExportAssessment, navigate }) => (
  <ReportRoute
    savedAssessments={savedAssessments}
    userProfile={userProfile}
    handleExportAssessment={handleExportAssessment}
    navigate={navigate}
  />
);

function App() {
  const navigate = useNavigate();
  
  // Custom hooks for state management
  const appState = useAppState();
  const notifications = useNotifications(appState.setNotifications);
  const assetManagement = useAssetManagement(
    appState.setAssets,
    notifications.addNotification
  );
  const assessmentActions = useAssessmentActions(notifications.addNotification);
  
  // External hooks
  const { isOnline, showOfflineNotice } = useOfflineSupport();
  const { signOut, isAuthenticated } = useAuth();
  const { 
    assessments: savedAssessments,
    saveAssessment
  } = useAssessments();
  
  // Ensure page scrolls to top on route changes
  useScrollToTop();

  // Keyboard shortcuts
  const shortcuts = [
    { key: 's', ctrlKey: true, action: () => {
      notifications.addNotification('success', 'Assessment auto-saved');
    }, description: 'Save progress' },
    { key: 'n', ctrlKey: true, action: () => {
      navigate('/assessment-intro');
    }, description: 'New assessment' },
    { key: 'h', ctrlKey: true, action: () => {
      navigate('/help');
    }, description: 'Show help' },
    { key: 'd', ctrlKey: true, action: () => {
      navigate('/dashboard');
    }, description: 'Go to dashboard' }
  ];

  useKeyboardShortcuts(shortcuts);

  // Template selection handler
  const handleSelectTemplate = (templateId: string) => {
    notifications.addNotification('info', `Template ${templateId} selected`);
  };

  // Enhanced route configuration with proper props
  const enhancedRoutes = allRoutes.map((route: any) => {
    if (route.path === '/assessment/:id') {
      return {
        ...route,
        element: () => (
          <EnhancedAssessmentRoute
            savedAssessments={savedAssessments}
            saveAssessment={saveAssessment}
            userProfile={appState.userProfile}
            addNotification={notifications.addNotification}
            navigate={navigate}
            onGenerateReport={assessmentActions.handleGenerateReport}
          />
        )
      };
    }
    
    if (route.path === '/report/:id') {
      return {
        ...route,
        element: () => (
          <EnhancedReportRoute
            savedAssessments={savedAssessments}
            userProfile={appState.userProfile}
            handleExportAssessment={assessmentActions.handleExportAssessment}
            navigate={navigate}
          />
        )
      };
    }
    
    return route;
  });

  return (
    <AppLayout
      navItems={navigationItems}
      userProfile={appState.userProfile}
      isAuthenticated={isAuthenticated}
      onSignOut={signOut}
      notifications={appState.notifications}
      removeNotification={notifications.removeNotification}
      isOnline={isOnline}
      showOfflineNotice={showOfflineNotice}
      isFirstVisit={appState.isFirstVisit}
      setIsFirstVisit={appState.setIsFirstVisit}
      showMobileMenu={appState.showMobileMenu}
      setShowMobileMenu={appState.setShowMobileMenu}
      showAssetModal={appState.showAssetModal}
      setShowAssetModal={appState.setShowAssetModal}
      editingAsset={appState.editingAsset}
      setEditingAsset={appState.setEditingAsset}
      showTemplateModal={appState.showTemplateModal}
      setShowTemplateModal={appState.setShowTemplateModal}
      selectedFramework={appState.selectedFramework}
      shortcuts={shortcuts}
      addNotification={notifications.addNotification}
      handleSaveAsset={assetManagement.handleSaveAsset}
      handleSelectTemplate={handleSelectTemplate}
    >
      <RouteRenderer routes={enhancedRoutes} />
    </AppLayout>
  );
}

// Wrap with ErrorBoundary for production error handling
const AppWithErrorBoundary = () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

export default AppWithErrorBoundary;