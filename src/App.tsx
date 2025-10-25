import { BrowserRouter } from 'react-router-dom';
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
import { allRoutes } from './routes';
import { AssessmentRoute } from './routes/AssessmentRoute';
import { ReportRoute } from './routes/ReportRoute';

function App() {
  // Custom hooks for state management
  const appState = useAppState();
  const notifications = useNotifications(appState.notifications, appState.setNotifications);
  const assetManagement = useAssetManagement(
    appState.assets,
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
      // Navigate to assessment intro
      window.location.href = '/assessment-intro';
    }, description: 'New assessment' },
    { key: 'h', ctrlKey: true, action: () => {
      window.location.href = '/help';
    }, description: 'Show help' },
    { key: 'd', ctrlKey: true, action: () => {
      window.location.href = '/dashboard';
    }, description: 'Go to dashboard' }
  ];

  useKeyboardShortcuts(shortcuts);

  // Template selection handler
  const handleSelectTemplate = (templateId: string) => {
    notifications.addNotification('info', `Template ${templateId} selected`);
  };

  // Enhanced route configuration with proper props
  const enhancedRoutes = allRoutes.map(route => {
    if (route.path === '/assessment/:id') {
      return {
        ...route,
        element: () => (
          <AssessmentRoute
            savedAssessments={savedAssessments}
            saveAssessment={saveAssessment}
            userProfile={appState.userProfile}
            addNotification={notifications.addNotification}
            navigate={(path: string) => window.location.href = path}
            onGenerateReport={assessmentActions.handleGenerateReport}
          />
        )
      };
    }
    
    if (route.path === '/report/:id') {
      return {
        ...route,
        element: () => (
          <ReportRoute
            savedAssessments={savedAssessments}
            userProfile={appState.userProfile}
            handleExportAssessment={assessmentActions.handleExportAssessment}
            navigate={(path: string) => window.location.href = path}
          />
        )
      };
    }
    
    return route;
  });

  return (
    <ErrorBoundary>
      <BrowserRouter>
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
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;