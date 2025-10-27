export interface Asset {
  id: string;
  name: string;
  description: string;
  category: 'hardware' | 'software' | 'data' | 'personnel' | 'facilities' | 'services';
  subcategory?: string;
  type: string;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'inactive' | 'maintenance' | 'quarantined' | 'disposed' | 'decommissioned';
  informationClassification: 'public' | 'internal' | 'confidential' | 'restricted' | 'top-secret';
  owner: string;
  custodian?: string;
  department: string;
  location: AssetLocation | string;
  businessValue: 'low' | 'medium' | 'high' | 'critical';
  riskAssessment: RiskAssessment;
  controls?: AssetControl[];
  vulnerabilities?: AssetVulnerability[];
  lifecycle: AssetLifecycle;
  compliance: ComplianceInfo;
  dependencies?: AssetDependency[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  lastReviewed: Date;
  nextReview: Date;
  version: string;
  notes?: string;
  attachments?: AssetAttachment[];
  customFields?: Record<string, any>;
  metadata?: AssetMetadata;
  handlesCUI?: boolean;
  cuiCategory?: CUICategory[];
  cmmcApplicability?: CMMCApplicability;
  cuiScope?: CUIScope;
}

export interface AssetLocation {
  type?: 'physical' | 'cloud' | 'hybrid';
  building?: string;
  floor?: string;
  room?: string;
  address?: string;
  rack?: string;
  slot?: string;
}

export interface CUICategory {
  category: string;
  description?: string;
}

export interface CMMCApplicability {
  level: number;
  domains?: string[];
  controls?: string[];
  maturityProcesses?: string[];
  assessmentScope: 'full' | 'partial' | 'not-applicable';
}

export interface CUIScope {
  inScope: boolean;
  scopeJustification?: string;
  boundaryDefinition?: string;
  dataTypes?: string[];
  systems?: string[];
  networks?: string[];
}

interface RiskAssessment {
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: RiskFactor[];
  impact: RiskImpactAssessment | 'low' | 'medium' | 'high' | 'critical';
  likelihood: 'low' | 'medium' | 'high' | 'critical';
  lastAssessed: Date;
  lastAssessment?: Date;
  nextAssessment?: Date;
  assessedBy: string;
  mitigationStrategies: string[];
  residualRisk: 'low' | 'medium' | 'high' | 'critical';
}

interface RiskImpactAssessment {
  confidentiality: 'low' | 'medium' | 'high' | 'critical';
  integrity: 'low' | 'medium' | 'high' | 'critical';
  availability: 'low' | 'medium' | 'high' | 'critical';
  financialImpact?: string;
  operationalImpact?: string;
}

interface RiskFactor {
  id: string;
  name: string;
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  likelihood: 'low' | 'medium' | 'high' | 'critical';
  category: 'technical' | 'operational' | 'business' | 'regulatory';
  mitigation: string;
  status: 'open' | 'mitigated' | 'accepted';
}

interface AssetControl {
  id: string;
  name: string;
  description: string;
  type: 'preventive' | 'detective' | 'corrective' | 'compensating';
  implementationStatus: 'not-implemented' | 'planned' | 'in-progress' | 'implemented' | 'tested' | 'partially-implemented' | 'not-applicable';
  effectiveness: 'low' | 'medium' | 'high';
  lastTested: Date;
  nextTest: Date;
  responsible?: string;
  complianceMapping: string[];
  evidence: string[];
  notes?: string;
  framework?: string;
  controlFamily?: string;
}

interface AssetVulnerability {
  id: string;
  name: string;
  title?: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'accepted';
  discovered: Date;
  discoveredDate?: Date;
  lastUpdated: Date;
  assignedTo: string;
  remediation: string | VulnerabilityRemediation;
  dueDate?: Date;
  cveId?: string;
  cvssScore?: number;
  affectedSystems: string[];
  evidence: string[];
}

interface VulnerabilityRemediation {
  priority: string;
  targetDate: Date;
  description?: string;
}

interface AssetLifecycle {
  stage: 'planning' | 'development' | 'deployment' | 'operation' | 'maintenance' | 'retirement';
  deploymentDate?: Date;
  retirementDate?: Date;
  maintenanceSchedule: MaintenanceSchedule;
  warranty?: WarrantyInfo;
  supportLevel: 'basic' | 'standard' | 'premium' | 'enterprise';
  endOfLife?: Date;
  migrationPlan?: string;
}

interface MaintenanceSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  nextMaintenance: Date;
  lastMaintenance?: Date;
  responsible: string;
  tasks: MaintenanceTask[];
  criticality: 'low' | 'medium' | 'high' | 'critical';
}

interface MaintenanceTask {
  id: string;
  name: string;
  description: string;
  frequency: string;
  estimatedDuration: number; // hours
  responsible: string;
  lastCompleted?: Date;
  nextDue: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
}

interface WarrantyInfo {
  provider: string;
  startDate: Date;
  endDate: Date;
  coverage: string[];
  contact: string;
  terms: string;
}

interface ComplianceInfo {
  frameworks: ComplianceFramework[];
  certifications: Certification[];
  auditHistory: AuditRecord[];
  complianceScore: number;
  lastAudit: Date;
  nextAudit: Date;
  auditor: string;
  findings: ComplianceFinding[];
  recommendations: ComplianceRecommendation[];
}

interface ComplianceFramework {
  name: string;
  version: string;
  level: number;
  applicableControls: string[];
  complianceStatus: 'not-applicable' | 'not-implemented' | 'partially-implemented' | 'fully-implemented';
  lastAssessed: Date;
  assessor: string;
  evidence: string[];
}

interface Certification {
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate: Date;
  status: 'active' | 'expired' | 'suspended' | 'revoked';
  certificateNumber: string;
  scope: string[];
  requirements: string[];
}

interface AuditRecord {
  id: string;
  type: 'internal' | 'external' | 'compliance' | 'security';
  auditor: string;
  auditDate: Date;
  scope: string[];
  findings: number;
  recommendations: number;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  reportUrl?: string;
  followUpRequired: boolean;
  followUpDate?: Date;
}

interface ComplianceFinding {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
  status: 'open' | 'in-progress' | 'resolved' | 'accepted';
  assignedTo: string;
  dueDate: Date;
  evidence: string[];
}

interface ComplianceRecommendation {
  id: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  effort: 'low' | 'medium' | 'high';
  timeframe: string;
  expectedImpact: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  assignedTo: string;
  dueDate: Date;
}

export interface AssetDependency {
  id: string;
  assetId: string;
  dependentAssetId?: string;
  assetName: string;
  dependencyType: 'prerequisite' | 'dependent' | 'related' | 'conflicting';
  description: string;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  criticalityImpact?: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'inactive' | 'deprecated';
  lastUpdated: Date;
}

interface AssetAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
  description?: string;
  tags: string[];
}

interface AssetMetadata {
  source: string;
  importDate: Date;
  originalId?: string;
  version: string;
  checksum: string;
  lastSync?: Date;
  syncStatus: 'success' | 'failed' | 'pending';
  customAttributes: Record<string, any>;
}

export interface AssetMetrics {
  totalAssets: number;
  assetsByCategory: Record<string, number>;
  assetsByCriticality: Record<string, number>;
  assetsByStatus: Record<string, number>;
  assetsByClassification: Record<string, number>;
  riskDistribution: Record<string, number>;
  complianceRate: number;
  averageAge: number;
  maintenanceOverdue: number;
  vulnerabilityCount: number;
  controlCoverage: number;
}

interface AssetFilter {
  category?: string[];
  criticality?: string[];
  status?: string[];
  classification?: string[];
  owner?: string[];
  department?: string[];
  tags?: string[];
  riskLevel?: string[];
  complianceStatus?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface AssetInventoryFilter {
  categories?: string[];
  criticality?: string[];
  status?: string[];
  classification?: string[];
  owner?: string[];
  department?: string[];
}

interface AssetSearchResult {
  assets: Asset[];
  totalCount: number;
  page: number;
  pageSize: number;
  filters: AssetFilter;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface AssetImportData {
  timestamp: string;
  version: string;
  assets: Asset[];
  categories: [string, number][];
  classifications: [string, number][];
  summary: {
    totalAssets: number;
    criticalAssets: number;
    categories: number;
    classifications: number;
  };
}

interface AssetExportOptions {
  format: 'json' | 'csv' | 'xlsx';
  includeMetadata: boolean;
  includeAttachments: boolean;
  includeCompliance: boolean;
  includeDependencies: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  filters?: AssetFilter;
}

// Type aliases for common Asset types
export type AssetCategory = 'hardware' | 'software' | 'data' | 'personnel' | 'facilities' | 'services';
export type CriticalityLevel = 'low' | 'medium' | 'high' | 'critical';
export type AssetStatus = 'active' | 'inactive' | 'maintenance' | 'quarantined' | 'disposed' | 'decommissioned';
export type InformationClassification = 'public' | 'internal' | 'confidential' | 'restricted' | 'top-secret';