export interface AuditChecklist {
  id: string;
  title: string;
  description: string;
  framework: 'CMMC' | 'NIST' | 'ISO' | 'Custom';
  level: 'Level 1' | 'Level 2' | 'Level 3' | 'All Levels';
  category: AuditCategory;
  sections: AuditSection[];
  createdDate: Date;
  lastUpdated: Date;
  status: 'draft' | 'published' | 'archived';
  version: string;
  author: string;
  tags: string[];
}

export type AuditCategory = 
  | 'Access Control'
  | 'Awareness and Training'
  | 'Audit and Accountability'
  | 'Configuration Management'
  | 'Identification and Authentication'
  | 'Incident Response'
  | 'Maintenance'
  | 'Media Protection'
  | 'Personnel Security'
  | 'Physical Protection'
  | 'Recovery'
  | 'Risk Assessment'
  | 'Security Assessment'
  | 'System and Communications Protection'
  | 'System and Information Integrity';

export interface AuditSection {
  id: string;
  title: string;
  description: string;
  items: AuditItem[];
  order: number;
  weight: number; // percentage of total score
}

export interface AuditItem {
  id: string;
  question: string;
  description: string;
  category: AuditCategory;
  cmmcPractice: string;
  evidenceRequired: string[];
  assessmentCriteria: string[];
  weight: number; // points for this item
  order: number;
  sectionId: string;
}

interface AuditExecution {
  id: string;
  checklistId: string;
  title: string;
  organizationId: string;
  auditorId: string;
  startDate: Date;
  endDate?: Date;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  findings: AuditFinding[];
  score: number;
  maxScore: number;
  percentage: number;
  evidence: AuditEvidence[];
  notes: string;
  recommendations: string[];
}

interface AuditFinding {
  id: string;
  itemId: string;
  status: 'compliant' | 'non-compliant' | 'partially-compliant' | 'not-applicable';
  evidence: string[];
  notes: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  remediation: string;
  dueDate?: Date;
  owner: string;
  score: number;
  maxScore: number;
}

interface AuditEvidence {
  id: string;
  itemId: string;
  type: 'document' | 'screenshot' | 'configuration' | 'test-result' | 'interview' | 'observation';
  title: string;
  description: string;
  filePath?: string;
  url?: string;
  uploadedDate: Date;
  uploadedBy: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedDate?: Date;
}

interface ComplianceDashboard {
  id: string;
  organizationId: string;
  framework: string;
  level: string;
  overallScore: number;
  maxScore: number;
  percentage: number;
  status: 'compliant' | 'partially-compliant' | 'non-compliant';
  lastUpdated: Date;
  sections: ComplianceSection[];
  trends: ComplianceTrend[];
  alerts: ComplianceAlert[];
  milestones: ComplianceMilestone[];
}

interface ComplianceSection {
  id: string;
  title: string;
  score: number;
  maxScore: number;
  percentage: number;
  status: 'compliant' | 'partially-compliant' | 'non-compliant';
  items: ComplianceItem[];
  lastAudited: Date;
  nextAudit?: Date;
}

interface ComplianceItem {
  id: string;
  title: string;
  status: 'compliant' | 'partially-compliant' | 'non-compliant' | 'not-applicable';
  lastChecked: Date;
  nextCheck?: Date;
  evidence: string[];
  notes: string;
  owner: string;
}

interface ComplianceTrend {
  id: string;
  date: Date;
  score: number;
  maxScore: number;
  percentage: number;
  sectionId?: string;
  notes?: string;
}

interface ComplianceAlert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  sectionId?: string;
  itemId?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved';
  createdDate: Date;
  dueDate?: Date;
  owner?: string;
}

interface ComplianceMilestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  sectionId?: string;
  progress: number; // percentage
  notes: string;
  owner: string;
}

interface EvidenceCollection {
  id: string;
  title: string;
  description: string;
  framework: string;
  level: string;
  organizationId: string;
  createdDate: Date;
  lastUpdated: Date;
  status: 'draft' | 'active' | 'completed' | 'archived';
  evidence: EvidenceItem[];
  requirements: EvidenceRequirement[];
  collectors: EvidenceCollector[];
}

interface EvidenceItem {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'screenshot' | 'configuration' | 'test-result' | 'interview' | 'observation';
  category: string;
  cmmcPractice: string;
  status: 'pending' | 'collected' | 'verified' | 'rejected';
  filePath?: string;
  url?: string;
  uploadedDate?: Date;
  uploadedBy?: string;
  verifiedBy?: string;
  verifiedDate?: Date;
  notes: string;
  tags: string[];
}

interface EvidenceRequirement {
  id: string;
  title: string;
  description: string;
  category: string;
  cmmcPractice: string;
  required: boolean;
  evidenceType: string[];
  instructions: string;
  examples: string[];
  order: number;
}

interface EvidenceCollectorConfig {
  id: string;
  name: string;
  type: 'automated' | 'manual' | 'scheduled';
  description: string;
  configuration: Record<string, any>;
  status: 'active' | 'inactive' | 'error';
  lastRun?: Date;
  nextRun?: Date;
  results: EvidenceCollectionResult[];
}

interface EvidenceCollectionResult {
  id: string;
  collectorId: string;
  runDate: Date;
  status: 'success' | 'partial' | 'failed';
  itemsCollected: number;
  errors: string[];
  evidence: EvidenceItem[];
}