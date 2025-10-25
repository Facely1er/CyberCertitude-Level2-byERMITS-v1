import { 
  RealTimeComplianceStatus, 
  CMMCComplianceDashboard, 
  ComplianceWorkflow,
  CMMCJourneyWorkflow,
  CMMCEvidenceCollector
} from '../components/LazyComponents';

export const complianceRoutes = [
  {
    path: "/compliance",
    element: RealTimeComplianceStatus,
    title: "Compliance Dashboard"
  },
  {
    path: "/compliance/cmmc",
    element: CMMCComplianceDashboard,
    title: "CMMC Compliance"
  },
  {
    path: "/compliance-workflow",
    element: ComplianceWorkflow,
    title: "Compliance Workflow"
  },
  {
    path: "/cmmc-journey",
    element: CMMCJourneyWorkflow,
    title: "CMMC Journey"
  },
  {
    path: "/evidence",
    element: CMMCEvidenceCollector,
    title: "Evidence Collection"
  }
];
