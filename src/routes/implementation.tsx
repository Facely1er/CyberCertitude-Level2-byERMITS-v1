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
  CertificationTrackingPage
} from '../components/PlaceholderPages';
import { SSPGenerator } from '../components/SSPGenerator';
import { CuiDataFlowMapper } from '../components/CuiDataFlowMapper';
import { POAMGenerator } from '../components/POAMGenerator';

// Implementation Overview Page Component
const ImplementationOverviewPage: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="card-standard p-8">
      <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">
        CMMC Implementation Overview
      </h1>
      <p className="text-text-secondary-light dark:text-text-secondary-dark">
        Implementation overview functionality will be implemented here.
      </p>
    </div>
  </div>
);

// POAM Manager Page Component
const POAMManagerPage: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="card-standard p-8">
      <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">
        POAM Manager
      </h1>
      <p className="text-text-secondary-light dark:text-text-secondary-dark">
        POAM (Plan of Action and Milestones) management functionality will be implemented here.
      </p>
    </div>
  </div>
);

// Audit Tracker Page Component
const AuditTrackerPage: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="card-standard p-8">
      <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">
        Audit Tracker
      </h1>
      <p className="text-text-secondary-light dark:text-text-secondary-dark">
        Audit tracking functionality will be implemented here.
      </p>
    </div>
  </div>
);

// Policy Generator Page Component
const PolicyGeneratorPage: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="card-standard p-8">
      <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">
        Policy Generator
      </h1>
      <p className="text-text-secondary-light dark:text-text-secondary-dark">
        Policy generation functionality will be implemented here.
      </p>
    </div>
  </div>
);

// Training Tracker Page Component
const TrainingTrackerPage: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="card-standard p-8">
      <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">
        Training Tracker
      </h1>
      <p className="text-text-secondary-light dark:text-text-secondary-dark">
        Training tracking functionality will be implemented here.
      </p>
    </div>
  </div>
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
