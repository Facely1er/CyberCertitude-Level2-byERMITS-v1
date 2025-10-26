import React from 'react';
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
  PlaceholderPage
} from '../components/PlaceholderPages';
import { SSPGenerator } from '../components/SSPGenerator';
import { CuiDataFlowMapper } from '../components/CuiDataFlowMapper';
import { POAMGenerator } from '../components/POAMGenerator';
import { Activity, AlertTriangle, FileText, GraduationCap } from 'lucide-react';

// Reusable placeholder components using PlaceholderPage
const ImplementationOverviewPage: React.FC = () => (
  <PlaceholderPage
    title="CMMC Implementation Overview"
    description="Comprehensive overview of CMMC implementation progress and status"
    icon={Activity}
    features={[
      'Implementation progress tracking',
      'Milestone management and reporting',
      'Team coordination and task assignment',
      'Compliance status monitoring'
    ]}
    nextSteps={[
      'Review current implementation status',
      'Assign implementation tasks',
      'Track progress and milestones',
      'Generate compliance reports'
    ]}
  />
);

const AuditTrackerPage: React.FC = () => (
  <PlaceholderPage
    title="Audit Tracker"
    description="Track and manage audit activities and findings"
    icon={AlertTriangle}
    features={[
      'Audit scheduling and planning',
      'Finding tracking and remediation',
      'Evidence collection and management',
      'Audit report generation'
    ]}
    nextSteps={[
      'Schedule upcoming audits',
      'Track open findings and remediation',
      'Generate audit reports',
      'Update compliance status'
    ]}
  />
);

const PolicyGeneratorPage: React.FC = () => (
  <PlaceholderPage
    title="Policy Generator"
    description="Generate and manage compliance policies and procedures"
    icon={FileText}
    features={[
      'Policy template library',
      'Automated policy generation',
      'Version control and tracking',
      'Distribution and training'
    ]}
    nextSteps={[
      'Select policy templates',
      'Customize policy content',
      'Review and approve policies',
      'Distribute and train staff'
    ]}
  />
);

const TrainingTrackerPage: React.FC = () => (
  <PlaceholderPage
    title="Training Tracker"
    description="Track training completion and certifications"
    icon={GraduationCap}
    features={[
      'Training schedule management',
      'Completion tracking and reporting',
      'Certification management',
      'Skills gap analysis'
    ]}
    nextSteps={[
      'Schedule training sessions',
      'Track staff completion',
      'Generate training reports',
      'Identify training gaps'
    ]}
  />
);

export const implementationRoutes = [
  {
    path: "/overview",
    element: ImplementationOverviewPage,
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
    element: AuditTrackerPage,
    title: "Audit Tracker"
  },
  {
    path: "/policy-generator",
    element: PolicyGeneratorPage,
    title: "Policy Generator"
  },
  {
    path: "/training-tracker",
    element: TrainingTrackerPage,
    title: "Training Tracker"
  }
];
