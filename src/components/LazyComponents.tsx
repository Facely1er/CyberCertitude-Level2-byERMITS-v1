// Lazy-loaded components for better performance
import { createLazyRoute } from '../utils/lazyLoading';

// Dashboard and Assessment Components

export const AssessmentIntroScreen = createLazyRoute(
  () => import('../features/assessment/components/CMMCLevel1AssessmentIntroScreen'),
  'AssessmentIntroScreen'
);

export const EnhancedAssessmentView = createLazyRoute(
  () => import('../features/assessment/components/EnhancedAssessmentView'),
  'EnhancedAssessmentView'
);

// Reporting Components
export const ReportView = createLazyRoute(
  () => import('../features/reporting/components/ReportView'),
  'ReportView'
);

export const AssessmentReportsPage = createLazyRoute(
  () => import('./AssessmentReportsPage'),
  'AssessmentReportsPage'
);

export const AdvancedReportingDashboard = createLazyRoute(
  () => import('./AdvancedReportingDashboard'),
  'AdvancedReportingDashboard'
);



export const TeamTrackingReport = createLazyRoute(
  () => import('../features/reporting/components/TeamTrackingReport'),
  'TeamTrackingReport'
);

export const ComplianceGapAnalyzer = createLazyRoute(
  () => import('../features/reporting/components/ComplianceGapAnalyzer'),
  'ComplianceGapAnalyzer'
);

// Compliance Components
export const RealTimeComplianceStatus = createLazyRoute(
  () => import('../features/compliance/components/RealTimeComplianceStatus'),
  'RealTimeComplianceStatus'
);

export const ComplianceWorkflow = createLazyRoute(
  () => import('../features/compliance/components/RealTimeComplianceStatus'),
  'ComplianceWorkflow'
);

export const CMMCComplianceDashboard = createLazyRoute(
  () => import('../features/compliance/components/RealTimeComplianceStatus'),
  'CMMCComplianceDashboard'
);

export const CMMCJourneyWorkflow = createLazyRoute(
  () => import('../features/compliance/components/RealTimeComplianceStatus'),
  'CMMCJourneyWorkflow'
);

export const CMMCEvidenceCollector = createLazyRoute(
  () => import('../features/assessment/components/EvidenceManager'),
  'CMMCEvidenceCollector'
);

// Evidence Components
export const EvidenceCollectionDashboard = createLazyRoute(
  () => import('../features/evidence/components/EvidenceCollectionDashboard'),
  'EvidenceCollectionDashboard'
);

// Asset Management Components
export const AssetDashboard = createLazyRoute(
  () => import('../features/assets/components/AssetDashboard'),
  'AssetDashboard'
);

export const AssetInventoryView = createLazyRoute(
  () => import('../features/assets/components/AssetInventoryView'),
  'AssetInventoryView'
);

export const AssetDetailView = createLazyRoute(
  () => import('../features/assets/components/AssetDetailView'),
  'AssetDetailView'
);

export const AssetCreationForm = createLazyRoute(
  () => import('../features/assets/components/AssetCreationForm'),
  'AssetCreationForm'
);

export const AssetEditForm = createLazyRoute(
  () => import('../features/assets/components/AssetEditForm'),
  'AssetEditForm'
);

// Task Management Components
export const TaskManagementDashboard = createLazyRoute(
  () => import('../features/tasks/components/TaskManagementDashboard'),
  'TaskManagementDashboard'
);

// Calendar Components
export const CalendarView = createLazyRoute(
  () => import('../features/calendar/components/CalendarView'),
  'CalendarView'
);

export const ComplianceCalendarView = createLazyRoute(
  () => import('../features/calendar/components/ComplianceCalendarView'),
  'ComplianceCalendarView'
);

// Policy and Controls Components
export const PolicyManagementView = createLazyRoute(
  () => import('../features/policies/components/PolicyManagementView'),
  'PolicyManagementView'
);

export const ControlsManagementView = createLazyRoute(
  () => import('../features/controls/ControlsManagementView'),
  'ControlsManagementView'
);

// Team Collaboration Components
export const TeamCollaborationDashboard = createLazyRoute(
  () => import('../features/collaboration/components/TeamCollaborationDashboard'),
  'TeamCollaborationDashboard'
);

// Settings and Profile Components
export const SettingsView = createLazyRoute(
  () => import('../shared/components/ui/SettingsView'),
  'SettingsView'
);

export const BillingView = createLazyRoute(
  () => import('../shared/components/ui/BillingView'),
  'BillingView'
);

export const ProfileView = createLazyRoute(
  () => import('../shared/components/ui/ProfileView'),
  'ProfileView'
);

export const UserProfileView = createLazyRoute(
  () => import('../shared/components/ui/ProfileView'),
  'ProfileView'
);

export const HelpView = createLazyRoute(
  () => import('../shared/components/ui/SettingsView'),
  'HelpView'
);

export const UserManual = createLazyRoute(
  () => import('../shared/components/ui/SettingsView'),
  'UserManual'
);

// Authentication Components
export const LoginPage = createLazyRoute(
  () => import('../components/LoginPage'),
  'LoginPage'
);

export const AuthPage = createLazyRoute(
  () => import('../features/auth/components/AuthPage'),
  'AuthPage'
);

export const MagicLinkCallback = createLazyRoute(
  () => import('../features/auth/components/MagicLinkCallback'),
  'MagicLinkCallback'
);
export const AuthGuard = createLazyRoute(
  () => import('../components/AuthGuard'),
  'AuthGuard'
);

// Risk Management Components
export const RiskAssessmentGenerator = createLazyRoute(
  () => import('../features/risk-management/components/RiskAssessmentGenerator'),
  'RiskAssessmentGenerator'
);

export const ThreatModelingTool = createLazyRoute(
  () => import('../features/risk-management/components/ThreatModelingTool'),
  'ThreatModelingTool'
);

export const VulnerabilityScanner = createLazyRoute(
  () => import('../features/risk-management/components/VulnerabilityScanner'),
  'VulnerabilityScanner'
);

// Training Components
export const TrainingModuleGenerator = createLazyRoute(
  () => import('../features/training/components/TrainingModuleGenerator'),
  'TrainingModuleGenerator'
);

export const AwarenessCampaignPlanner = createLazyRoute(
  () => import('../features/training/components/AwarenessCampaignPlanner'),
  'AwarenessCampaignPlanner'
);

// Audit Components
export const AuditChecklistGenerator = createLazyRoute(
  () => import('../features/audit/components/ComplianceDashboard'),
  'AuditChecklistGenerator'
);

export const ComplianceDashboard = createLazyRoute(
  () => import('../features/audit/components/ComplianceDashboard'),
  'ComplianceDashboard'
);

export const EvidenceCollector = createLazyRoute(
  () => import('../features/audit/components/EvidenceCollector'),
  'EvidenceCollector'
);

export const AuditLogsView = createLazyRoute(
  () => import('../features/audit/components/AuditLogsView'),
  'AuditLogsView'
);

export const SelfAssessmentPreparation = createLazyRoute(
  () => import('../features/audit/components/SelfAssessmentPreparation'),
  'SelfAssessmentPreparation'
);

// Technical Tools Components
export const SecurityControlMapper = createLazyRoute(
  () => import('../features/technical-tools/components/SecurityControlMapper'),
  'SecurityControlMapper'
);

export const ConfigurationBaselineGenerator = createLazyRoute(
  () => import('../features/technical-tools/components/ConfigurationBaselineGenerator'),
  'ConfigurationBaselineGenerator'
);

export const IncidentResponsePlanner = createLazyRoute(
  () => import('../features/technical-tools/components/IncidentResponsePlanner'),
  'IncidentResponsePlanner'
);

// CMMC Journey Workflow

// CMMC Control Assessor
export const CMMCControlAssessor = createLazyRoute(
  () => import('../features/assessment/components/CMMCControlAssessor'),
  'CMMCControlAssessor'
);

// CMMC Evidence Collector

// CMMC Compliance Dashboard


// Utility function to preload critical components
export const preloadCriticalComponents = () => {
  // Preload components that are likely to be accessed soon
  import('../features/assessment/components/CMMCLevel1AssessmentIntroScreen').catch(() => {});
  import('../features/reporting/components/ReportView').catch(() => {});
  import('../features/compliance/components/RealTimeComplianceStatus').catch(() => {});
};