// Navigation utility for both class and functional components
// This provides a consistent way to navigate without depending on React Router hooks

export const navigation = {
  // Navigate to a path using React Router's history API
  navigate: (path: string) => {
    // Check if we're in a React Router context
    if (window.history && window.history.pushState) {
      // Use pushState to navigate without page reload
      window.history.pushState({}, '', path);
      
      // Dispatch a popstate event to notify React Router
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else {
      // Fallback to window.location for non-SPA environments
      window.location.href = path;
    }
  },

  // Basic navigation methods
  goHome: () => navigation.navigate('/'),
  goToDashboard: () => navigation.navigate('/dashboard'),
  goToAssessment: () => navigation.navigate('/assessment-intro'),
  goToEvidence: () => navigation.navigate('/evidence'),
  goToReports: () => navigation.navigate('/reports'),
  goToCompliance: () => navigation.navigate('/compliance'),
  goToSettings: () => navigation.navigate('/settings'),
  goToHelp: () => navigation.navigate('/help'),
  goToTeam: () => navigation.navigate('/team'),
  goToTasks: () => navigation.navigate('/tasks'),
  goToAssets: () => navigation.navigate('/assets'),
  goToPolicies: () => navigation.navigate('/policies'),
  goToControls: () => navigation.navigate('/controls'),
  goToAuditLogs: () => navigation.navigate('/audit-logs'),
  goToCalendar: () => navigation.navigate('/calendar'),
  goToProfile: () => navigation.navigate('/profile'),
  goToAuth: () => navigation.navigate('/auth'),
  goToLogin: () => navigation.navigate('/login'),
  goToForgotPassword: () => navigation.navigate('/forgot-password'),

  // Compliance and CMMC navigation
  goToComplianceWorkflow: () => navigation.navigate('/compliance-workflow'),
  goToCMMCJourney: () => navigation.navigate('/cmmc-journey'),
  goToCMMCAssessment: () => navigation.navigate('/cmmc-assessment'),
  goToPrivacyAssessment: () => navigation.navigate('/privacy-assessment'),

  // Risk management navigation
  goToRiskAssessment: () => navigation.navigate('/risk-assessment'),
  goToThreatModeling: () => navigation.navigate('/threat-modeling'),
  goToVulnerabilityScanner: () => navigation.navigate('/vulnerability-scanner'),

  // Training navigation
  goToTrainingModules: () => navigation.navigate('/training-modules'),
  goToAwarenessCampaigns: () => navigation.navigate('/awareness-campaigns'),
  goToTrainingTracker: () => navigation.navigate('/training-tracker'),

  // Audit navigation
  goToAuditChecklists: () => navigation.navigate('/audit-checklists'),
  goToComplianceDashboard: () => navigation.navigate('/compliance-dashboard'),
  goToEvidenceCollector: () => navigation.navigate('/evidence-collector'),
  goToAuditTracker: () => navigation.navigate('/audit-tracker'),

  // Technical tools navigation
  goToSecurityControls: () => navigation.navigate('/security-controls'),
  goToConfigBaselines: () => navigation.navigate('/config-baselines'),
  goToIncidentResponse: () => navigation.navigate('/incident-response'),

  // CMMC tools navigation
  goToSSPGenerator: () => navigation.navigate('/ssp-generator'),
  goToPOAMManager: () => navigation.navigate('/poam-manager'),
  goToControlAssessor: () => navigation.navigate('/control-assessor'),
  goToGapAnalysis: () => navigation.navigate('/gap-analysis'),
  goToPolicyGenerator: () => navigation.navigate('/policy-generator'),

  // Asset management navigation
  goToAssetInventory: () => navigation.navigate('/assets/inventory'),
  goToAssetCategories: () => navigation.navigate('/assets/categories'),
  goToAssetDependencies: () => navigation.navigate('/assets/dependencies'),
  goToAssetWorkflow: () => navigation.navigate('/assets/workflow'),
  goToAssetRoadmap: () => navigation.navigate('/assets/roadmap'),
  goToAssetActionPlan: () => navigation.navigate('/assets/action-plan'),

  // Reporting navigation
  goToAdvancedReporting: () => navigation.navigate('/reports/advanced'),
  goToTeamTrackingReport: () => navigation.navigate('/reports/team'),
  goToComplianceGapAnalyzer: () => navigation.navigate('/reports/compliance'),

  // CMMC specific navigation
  goToCMMCJourneyWorkflow: () => navigation.navigate('/cmmc-journey'),
  goToCMMCControlAssessor: () => navigation.navigate('/control-assessor'),
  goToCMMCEvidenceCollector: () => navigation.navigate('/evidence'),
  goToCMMCComplianceDashboard: () => navigation.navigate('/compliance'),
  goToC3PAOPreparation: () => navigation.navigate('/audit-tracker'),

  // Component-specific navigation (for lazy loading)
  goToAdvancedDashboard: () => navigation.navigate('/dashboard'),
  goToAssessmentIntroScreen: () => navigation.navigate('/assessment-intro'),
  goToEnhancedAssessmentView: () => navigation.navigate('/assessment'),
  goToReportView: () => navigation.navigate('/report'),
  goToAssessmentReportsPage: () => navigation.navigate('/reports'),
  goToAdvancedReportingDashboard: () => navigation.navigate('/reports/advanced'),
  goToRealTimeComplianceStatus: () => navigation.navigate('/compliance'),
  goToEvidenceCollectionDashboard: () => navigation.navigate('/evidence'),
  goToAssetDashboard: () => navigation.navigate('/assets'),
  goToAssetInventoryView: () => navigation.navigate('/assets/inventory'),
  goToAssetDetailView: () => navigation.navigate('/assets'),
  goToAssetCreationForm: () => navigation.navigate('/assets'),
  goToAssetEditForm: () => navigation.navigate('/assets'),
  goToTaskManagementDashboard: () => navigation.navigate('/tasks'),
  goToCalendarView: () => navigation.navigate('/calendar'),
  goToComplianceCalendarView: () => navigation.navigate('/calendar'),
  goToPolicyManagementView: () => navigation.navigate('/policies'),
  goToControlsManagementView: () => navigation.navigate('/controls'),
  goToTeamCollaborationDashboard: () => navigation.navigate('/team'),
  goToSettingsView: () => navigation.navigate('/settings'),
  goToProfileView: () => navigation.navigate('/profile'),
  goToHelpView: () => navigation.navigate('/help'),
  goToUserManual: () => navigation.navigate('/help'),
  goToLoginPage: () => navigation.navigate('/login'),
  goToAuthPage: () => navigation.navigate('/auth'),
  goToMagicLinkCallback: () => navigation.navigate('/auth/callback'),
  goToAuthGuard: () => navigation.navigate('/auth'),
  goToRiskAssessmentGenerator: () => navigation.navigate('/risk-assessment'),
  goToThreatModelingTool: () => navigation.navigate('/threat-modeling'),
  goToTrainingModuleGenerator: () => navigation.navigate('/training-modules'),
  goToAwarenessCampaignPlanner: () => navigation.navigate('/awareness-campaigns'),
  goToAuditChecklistGenerator: () => navigation.navigate('/audit-checklists'),
  goToAuditLogsView: () => navigation.navigate('/audit-logs'),
  goToSecurityControlMapper: () => navigation.navigate('/security-controls'),
  goToConfigurationBaselineGenerator: () => navigation.navigate('/config-baselines'),
  goToIncidentResponsePlanner: () => navigation.navigate('/incident-response'),
  goToC3PAOPreparationTool: () => navigation.navigate('/audit-tracker')
};

