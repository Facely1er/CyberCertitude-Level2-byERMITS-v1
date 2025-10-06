interface ComplianceStatus {
  id: string;
  framework: 'cmmc';
  domain: string;
  control: string;
  cmmcLevel: number;
  controlId: string;
  controlName: string;
  implementationStatus: ImplementationStatus;
  effectivenessRating: EffectivenessRating;
  lastAssessed: Date;
  nextAssessment: Date;
  assessedBy: string;
  evidence: string[]; // Evidence IDs
  gaps: ComplianceGap[];
  riskRating: RiskRating;
  priorityLevel: PriorityLevel;
  owner: string;
  assignees: string[];
  dueDate?: Date;
  completionPercentage: number;
  notes: string;
  cuiApplicability: boolean;
  c3paoValidation: boolean;
  metadata: {
    cuiImpact: 'low' | 'medium' | 'high' | 'critical';
    technicalComplexity: 'low' | 'medium' | 'high';
    resourceRequirement: 'low' | 'medium' | 'high';
    dependencies: string[];
    milestones: Milestone[];
    sspSection: string;
    nistSP800171Mapping: string[];
  };
}

type ImplementationStatus = 
  | 'not-started'
  | 'planning'
  | 'in-progress'
  | 'testing'
  | 'implemented'
  | 'monitored'
  | 'optimized';

type EffectivenessRating = 
  | 'not-effective'
  | 'partially-effective'
  | 'largely-effective'
  | 'fully-effective';

type RiskRating = 
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

type PriorityLevel = 
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

interface ComplianceGap {
  id: string;
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  effort: 'low' | 'medium' | 'high';
  timeframe: string;
  remediation: string;
  assignedTo?: string;
  dueDate?: Date;
  dependencies: string[];
  cost?: number;
}

interface Milestone {
  id: string;
  name: string;
  description: string;
  dueDate: Date;
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
  dependencies: string[];
  deliverables: string[];
  assignedTo: string;
}

interface ComplianceReport {
  id: string;
  title: string;
  type: 'real-time' | 'scheduled' | 'ad-hoc';
  framework: 'nist-csf-v2';
  scope: string[];
  generatedAt: Date;
  generatedBy: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
  metrics: ComplianceMetrics;
  findings: ComplianceFinding[];
  recommendations: ComplianceRecommendation[];
  nextActions: NextAction[];
  status: 'draft' | 'final' | 'distributed';
  recipients: string[];
  confidentialityLevel: 'public' | 'internal' | 'confidential';
}

interface ComplianceMetrics {
  overallScore: number;
  functionScores: Record<string, number>;
  categoryScores: Record<string, number>;
  implementationProgress: number;
  evidenceCompleteness: number;
  riskReduction: number;
  gapCount: number;
  criticalGaps: number;
  trends: {
    scoreChange: number;
    gapReduction: number;
    implementationVelocity: number;
  };
}

interface ComplianceFinding {
  id: string;
  type: 'gap' | 'risk' | 'improvement' | 'non-compliance';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  affectedControls: string[];
  recommendation: string;
  dueDate: Date;
  assignedTo: string;
  evidenceRequired: string[];
}

interface ComplianceRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  timeframe: string;
  expectedImpact: string;
  cost?: number;
  resources: string[];
  dependencies: string[];
}

interface NextAction {
  id: string;
  action: string;
  owner: string;
  dueDate: Date;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  dependencies: string[];
}

export interface RealTimeComplianceData {
  timestamp: Date;
  overallCompliance: number;
  functionCompliance: Record<string, number>;
  activeGaps: number;
  criticalFindings: number;
  evidenceCollectionProgress: number;
  controlImplementationProgress: number;
  riskTrend: 'improving' | 'stable' | 'declining';
  alerts: ComplianceAlert[];
}

export interface ComplianceAlert {
  id: string;
  type: 'gap' | 'overdue' | 'risk' | 'evidence' | 'assessment';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  affectedItems: string[];
  actionRequired: string;
  dueDate?: Date;
  assignedTo?: string;
  createdAt: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
}