import { SSPGenerator } from '../components/SSPGenerator';
import { CuiDataFlowMapper } from '../components/CuiDataFlowMapper';
import { POAMGenerator } from '../components/POAMGenerator';
import ImplementationOverview from '../features/implementation/components/ImplementationOverview';
import AuditTracker from '../features/audit/components/AuditTracker';
import PolicyGenerator from '../features/policies/components/PolicyGenerator';
import TrainingTracker from '../features/training/components/TrainingTracker';
import PolicyTemplates from '../features/policies/components/PolicyTemplates';
import ProjectCharter from '../features/implementation/components/ProjectCharter';
import CUIScope from '../features/implementation/components/CUIScope';
import TeamRoles from '../features/implementation/components/TeamRoles';
import ImplementationWorkbook from '../features/implementation/components/ImplementationWorkbook';
import DocumentRepository from '../features/implementation/components/DocumentRepository';
import ControlValidation from '../features/implementation/components/ControlValidation';
import ComplianceTracking from '../features/implementation/components/ComplianceTracking';
import AuditPackage from '../features/implementation/components/AuditPackage';
import C3PAOPrep from '../features/implementation/components/C3PAOPrep';
import MetricsDashboard from '../features/implementation/components/MetricsDashboard';
import CertificationTracking from '../features/implementation/components/CertificationTracking';
import PoliciesPage from '../features/reporting/components/PoliciesPage';
import AuditLogsPage from '../features/audit/components/AuditLogsPage';
import ControlsManagement from '../features/compliance/components/ControlsManagement';

export const implementationRoutes = [
  {
    path: "/overview",
    element: ImplementationOverview,
    title: "Implementation Overview"
  },
  {
    path: "/project-charter",
    element: ProjectCharter,
    title: "Project Charter"
  },
  {
    path: "/cui-scope",
    element: CUIScope,
    title: "CUI Scope"
  },
  {
    path: "/data-flow",
    element: CuiDataFlowMapper,
    title: "CUI Data Flow Mapping"
  },
  {
    path: "/team-roles",
    element: TeamRoles,
    title: "Team Roles"
  },
  {
    path: "/implementation-workbook",
    element: ImplementationWorkbook,
    title: "Implementation Workbook"
  },
  {
    path: "/policy-templates",
    element: PolicyTemplates,
    title: "Policy Templates"
  },
  {
    path: "/document-repository",
    element: DocumentRepository,
    title: "Document Repository"
  },
  {
    path: "/control-validation",
    element: ControlValidation,
    title: "Control Validation"
  },
  {
    path: "/compliance-tracking",
    element: ComplianceTracking,
    title: "Compliance Tracking"
  },
  {
    path: "/audit-package",
    element: AuditPackage,
    title: "Audit Package"
  },
  {
    path: "/c3pao-prep",
    element: C3PAOPrep,
    title: "C3PAO Preparation"
  },
  {
    path: "/metrics-dashboard",
    element: MetricsDashboard,
    title: "Metrics Dashboard"
  },
  {
    path: "/certification-tracking",
    element: CertificationTracking,
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
    element: ControlsManagement,
    title: "Controls Management"
  }
];
