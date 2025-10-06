export interface RiskAssessment {
  id: string;
  title: string;
  description: string;
  organizationId: string;
  assessmentDate: Date;
  lastUpdated: Date;
  status: 'draft' | 'in-progress' | 'completed' | 'reviewed';
  risks: Risk[];
  overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
  assessor: string;
  reviewer?: string;
  framework: 'CMMC' | 'NIST' | 'ISO' | 'Custom';
  version: string;
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  category: RiskCategory;
  likelihood: RiskLevel;
  impact: RiskLevel;
  riskScore: number;
  status: 'identified' | 'assessed' | 'mitigated' | 'accepted' | 'transferred';
  mitigationStrategy?: string;
  mitigationActions?: string[];
  residualRisk: RiskLevel;
  owner: string;
  dueDate?: Date;
  evidence?: string[];
  controls: string[];
  cmmcPractices: string[];
}

export type RiskCategory = 
  | 'Technical'
  | 'Operational'
  | 'Physical'
  | 'Environmental'
  | 'Legal/Compliance'
  | 'Financial'
  | 'Reputation'
  | 'Strategic';

export type RiskLevel = 'very-low' | 'low' | 'medium' | 'high' | 'very-high';

export interface ThreatModel {
  id: string;
  title: string;
  description: string;
  systemId: string;
  systemName: string;
  threats: Threat[];
  attackVectors: AttackVector[];
  securityBoundaries: SecurityBoundary[];
  dataFlows: DataFlow[];
  createdDate: Date;
  lastUpdated: Date;
  status: 'draft' | 'review' | 'approved' | 'deprecated';
  version: string;
}

export interface Threat {
  id: string;
  title: string;
  description: string;
  category: ThreatCategory;
  likelihood: RiskLevel;
  impact: RiskLevel;
  riskScore: number;
  mitigationControls: string[];
  cmmcPractices: string[];
  attackVectors: string[];
}

export type ThreatCategory = 
  | 'Malware'
  | 'Insider Threat'
  | 'Social Engineering'
  | 'Physical Attack'
  | 'Network Attack'
  | 'Data Breach'
  | 'System Compromise'
  | 'Denial of Service'
  | 'Supply Chain'
  | 'Cloud Security';

export interface AttackVector {
  id: string;
  name: string;
  description: string;
  entryPoint: string;
  target: string;
  techniques: string[];
  mitigations: string[];
}

export interface SecurityBoundary {
  id: string;
  name: string;
  type: 'network' | 'physical' | 'logical' | 'data';
  description: string;
  controls: string[];
}

export interface DataFlow {
  id: string;
  name: string;
  source: string;
  destination: string;
  dataType: 'CUI' | 'PII' | 'Public' | 'Internal';
  protectionLevel: 'high' | 'medium' | 'low';
  controls: string[];
}

export interface Vulnerability {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  cvssScore?: number;
  cveId?: string;
  affectedSystems: string[];
  discoveredDate: Date;
  status: 'open' | 'in-progress' | 'resolved' | 'accepted';
  remediation: string;
  dueDate?: Date;
  owner: string;
  evidence: string[];
  cmmcPractices: string[];
}

export interface VulnerabilityScan {
  id: string;
  scanDate: Date;
  scanType: 'automated' | 'manual' | 'penetration';
  targetSystems: string[];
  vulnerabilities: Vulnerability[];
  totalVulnerabilities: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  status: 'running' | 'completed' | 'failed';
  scanner: string;
  reportPath?: string;
}