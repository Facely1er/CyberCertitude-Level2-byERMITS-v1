// Lazy-loaded components for better performance
import { createLazyRoute } from '../utils/lazyLoading';

// Dashboard and Assessment Components
export const AdvancedDashboard = createLazyRoute(
  () => import('../features/assessment/components/AdvancedDashboard'),
  'AdvancedDashboard'
);

export const AssessmentIntroScreen = createLazyRoute(
  () => import('../features/assessment/components/AssessmentIntroScreen'),
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
  () => import('../features/reporting/components/AssessmentReportsPage'),
  'AssessmentReportsPage'
);

export const AdvancedReportingDashboard = createLazyRoute(
  () => import('../features/reporting/components/AdvancedReportingDashboard'),
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

export const SecurityAssessmentReportGenerator = createLazyRoute(
  () => import('../features/reporting/components/SecurityAssessmentReportGenerator'),
  'SecurityAssessmentReportGenerator'
);

// Compliance Components
export const RealTimeComplianceStatus = createLazyRoute(
  () => import('../features/compliance/components/RealTimeComplianceStatus'),
  'RealTimeComplianceStatus'
);

export const ComplianceWorkflow = createLazyRoute(
  () => import('../components/ComplianceWorkflow'),
  'ComplianceWorkflow'
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
const CalendarView = createLazyRoute(
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

export const ProfileView = createLazyRoute(
  () => import('../shared/components/ui/ProfileView'),
  'ProfileView'
);

const UserProfileView = createLazyRoute(
  () => import('../shared/components/ui/ProfileView'),
  'ProfileView'
);

export const HelpView = createLazyRoute(
  () => import('../shared/components/ui/HelpView'),
  'HelpView'
);

const UserManual = createLazyRoute(
  () => import('../shared/components/ui/UserManual'),
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
const AuthGuard = createLazyRoute(
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
  () => import('../features/audit/components/AuditChecklistGenerator'),
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

export const EnhancedIncidentResponsePlanGenerator = createLazyRoute(
  () => import('../features/technical-tools/components/EnhancedIncidentResponsePlanGenerator'),
  'EnhancedIncidentResponsePlanGenerator'
);

// CMMC Journey Workflow
export const CMMCJourneyWorkflow = createLazyRoute(
  () => import('../features/compliance/components/CMMCJourneyWorkflow'),
  'CMMCJourneyWorkflow'
);

// CMMC Control Assessor
export const CMMCControlAssessor = createLazyRoute(
  () => import('../features/compliance/components/CMMCControlAssessor'),
  'CMMCControlAssessor'
);

// CMMC Evidence Collector
export const CMMCEvidenceCollector = createLazyRoute(
  () => import('../features/evidence/components/CMMCEvidenceCollector'),
  'CMMCEvidenceCollector'
);

// CMMC Compliance Dashboard
export const CMMCComplianceDashboard = createLazyRoute(
  () => import('../features/compliance/components/CMMCComplianceDashboard'),
  'CMMCComplianceDashboard'
);

// C3PAO Preparation Tool
export const C3PAOPreparationTool = createLazyRoute(
  () => import('../features/audit/components/C3PAOPreparationTool'),
  'C3PAOPreparationTool'
);

// Utility function to preload critical components
export const preloadCriticalComponents = () => {
  // Preload components that are likely to be accessed soon
  import('../features/assessment/components/AdvancedDashboard').catch(() => {});
  import('../features/assessment/components/AssessmentIntroScreen').catch(() => {});
  import('../features/reporting/components/ReportView').catch(() => {});
  import('../features/compliance/components/RealTimeComplianceStatus').catch(() => {});
};