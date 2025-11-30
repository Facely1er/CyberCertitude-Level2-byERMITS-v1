import { 
  RiskAssessmentGenerator,
  ThreatModelingTool,
  VulnerabilityScanner,
  TrainingModuleGenerator,
  AwarenessCampaignPlanner,
  AuditChecklistGenerator,
  SecurityControlMapper,
  ConfigurationBaselineGenerator,
  IncidentResponsePlanner,
  EnhancedIncidentResponsePlanGenerator
} from '../components/LazyComponents';

export const toolsRoutes = [
  {
    path: "/risk-assessment",
    element: RiskAssessmentGenerator,
    title: "Risk Assessment"
  },
  {
    path: "/threat-modeling",
    element: ThreatModelingTool,
    title: "Threat Modeling"
  },
  {
    path: "/vulnerability-scanner",
    element: VulnerabilityScanner,
    title: "Vulnerability Scanner"
  },
  {
    path: "/training-modules",
    element: TrainingModuleGenerator,
    title: "Training Modules"
  },
  {
    path: "/awareness-campaigns",
    element: AwarenessCampaignPlanner,
    title: "Awareness Campaigns"
  },
  {
    path: "/audit-checklists",
    element: AuditChecklistGenerator,
    title: "Audit Checklists"
  },
  {
    path: "/security-controls",
    element: SecurityControlMapper,
    title: "Security Controls"
  },
  {
    path: "/config-baselines",
    element: ConfigurationBaselineGenerator,
    title: "Configuration Baselines"
  },
  {
    path: "/incident-response",
    element: IncidentResponsePlanner,
    title: "Incident Response"
  },
  {
    path: "/incident-response-plan-generator",
    element: EnhancedIncidentResponsePlanGenerator,
    title: "Incident Response Plan Generator"
  }
];
