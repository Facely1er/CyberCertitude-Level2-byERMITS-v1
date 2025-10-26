import { 
  ProjectCharterPage,
  CUIScopePage,
  TeamRolesPage,
  ImplementationWorkbookPage,
  PolicyTemplatesPage,
  DocumentRepositoryPage,
  ControlValidationPage,
  ComplianceTrackingPage,
  AuditPackagePage,
  C3PAOPrepPage,
  MetricsDashboardPage,
  CertificationTrackingPage,
  PoliciesPage,
  AuditLogsPage,
  ControlsManagementPage
} from '../components/PlaceholderPages';
import { SSPGenerator } from '../components/SSPGenerator';
import { CuiDataFlowMapper } from '../components/CuiDataFlowMapper';
import { POAMGenerator } from '../components/POAMGenerator';
import ImplementationOverview from '../features/implementation/components/ImplementationOverview';
import AuditTracker from '../features/audit/components/AuditTracker';
import PolicyGenerator from '../features/policies/components/PolicyGenerator';
import TrainingTracker from '../features/training/components/TrainingTracker';

export const implementationRoutes = [
  {
    path: "/overview",
    element: ImplementationOverview,
    title: "Implementation Overview"
  },
  {
    path: "/project-charter",
    element: ProjectCharterPage,
    title: "Project Charter"
  },
  {
    path: "/cui-scope",
    element: CUIScopePage,
    title: "CUI Scope"
  },
  {
    path: "/data-flow",
    element: CuiDataFlowMapper,
    title: "CUI Data Flow Mapping"
  },
  {
    path: "/team-roles",
    element: TeamRolesPage,
    title: "Team Roles"
  },
  {
    path: "/implementation-workbook",
    element: ImplementationWorkbookPage,
    title: "Implementation Workbook"
  },
  {
    path: "/policy-templates",
    element: PolicyTemplatesPage,
    title: "Policy Templates"
  },
  {
    path: "/document-repository",
    element: DocumentRepositoryPage,
    title: "Document Repository"
  },
  {
    path: "/control-validation",
    element: ControlValidationPage,
    title: "Control Validation"
  },
  {
    path: "/compliance-tracking",
    element: ComplianceTrackingPage,
    title: "Compliance Tracking"
  },
  {
    path: "/audit-package",
    element: AuditPackagePage,
    title: "Audit Package"
  },
  {
    path: "/c3pao-prep",
    element: C3PAOPrepPage,
    title: "C3PAO Preparation"
  },
  {
    path: "/metrics-dashboard",
    element: MetricsDashboardPage,
    title: "Metrics Dashboard"
  },
  {
    path: "/certification-tracking",
    element: CertificationTrackingPage,
    title: "Certification Tracking"
  },
  {
    path: "/ssp-generator",
    element: SSPGenerator,
    title: "SSP Generator"
  },
  {
    path: "/poam-manager",
    element: POAMGenerator,
    title: "POAM Manager"
  },
  {
    path: "/audit-tracker",
    element: AuditTracker,
    title: "Audit Tracker"
  },
  {
    path: "/policy-generator",
    element: PolicyGenerator,
    title: "Policy Generator"
  },
  {
    path: "/training-tracker",
    element: TrainingTracker,
    title: "Training Tracker"
  },
  {
    path: "/policies",
    element: PoliciesPage,
    title: "Policy Management"
  },
  {
    path: "/audit-logs",
    element: AuditLogsPage,
    title: "Audit Logs"
  },
  {
    path: "/controls",
    element: ControlsManagementPage,
    title: "Controls Management"
  }
];
