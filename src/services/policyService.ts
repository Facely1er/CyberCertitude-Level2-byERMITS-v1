import { dataService } from './dataService';
import { logger } from '../utils/logger';

export interface Policy {
  id: string;
  name: string;
  description: string;
  type: 'governance' | 'operational' | 'technical' | 'compliance' | 'incident-response' | 'data-protection' | 'access-control' | 'risk-management';
  framework: string;
  nistFunction: string;
  nistCategory: string;
  nistSubcategories: string[];
  version: string;
  status: 'draft' | 'review' | 'approved' | 'effective' | 'archived' | 'superseded';
  effectiveDate: Date;
  lastReviewed: Date;
  nextReview: Date;
  reviewCycle: 'monthly' | 'quarterly' | 'annually' | 'biannually' | 'as-needed';
  owner: string;
  approver: string;
  stakeholders: string[];
  scope: string[];
  exceptions: string[];
  relatedPolicies: string[];
  relatedControls: string[];
  evidence: string[];
  implementationGuide: {
    steps: string[];
    resources: string[];
    training: string[];
    metrics: string[];
  };
  complianceRequirements: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  businessImpact: 'low' | 'medium' | 'high' | 'critical';
  implementationStatus: 'not-started' | 'in-progress' | 'completed' | 'maintenance';
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PolicyFilters {
  type?: string;
  status?: string;
  function?: string;
  owner?: string;
  search?: string;
}

export class PolicyService {
  private static instance: PolicyService;
  private readonly STORAGE_KEY = 'cybersecurity-policies';

  static getInstance(): PolicyService {
    if (!PolicyService.instance) {
      PolicyService.instance = new PolicyService();
    }
    return PolicyService.instance;
  }

  async getPolicies(): Promise<Policy[]> {
    try {
      const data = dataService.getData();
      return data.policies || [];
    } catch (error) {
      logger.error('Error fetching policies:', error);
      return [];
    }
  }

  async getPolicy(id: string): Promise<Policy | null> {
    try {
      const policies = await this.getPolicies();
      return policies.find(policy => policy.id === id) || null;
    } catch (error) {
      logger.error('Error fetching policy:', error);
      return null;
    }
  }

  async savePolicy(policy: Omit<Policy, 'createdAt' | 'updatedAt'>): Promise<Policy> {
    try {
      const policies = await this.getPolicies();
      const now = new Date();
      
      const newPolicy: Policy = {
        ...policy,
        createdAt: now,
        updatedAt: now
      };

      const existingIndex = policies.findIndex(p => p.id === policy.id);
      
      if (existingIndex >= 0) {
        policies[existingIndex] = { ...newPolicy, createdAt: policies[existingIndex].createdAt };
      } else {
        policies.push(newPolicy);
      }

      await this.savePolicies(policies);
      return newPolicy;
    } catch (error) {
      logger.error('Error saving policy:', error);
      throw error;
    }
  }

  async updatePolicy(id: string, updates: Partial<Policy>): Promise<Policy> {
    try {
      const policies = await this.getPolicies();
      const index = policies.findIndex(p => p.id === id);
      
      if (index === -1) {
        throw new Error('Policy not found');
      }

      policies[index] = {
        ...policies[index],
        ...updates,
        updatedAt: new Date()
      };

      await this.savePolicies(policies);
      return policies[index];
    } catch (error) {
      logger.error('Error updating policy:', error);
      throw error;
    }
  }

  async deletePolicy(id: string): Promise<void> {
    try {
      const policies = await this.getPolicies();
      const filteredPolicies = policies.filter(p => p.id !== id);
      await this.savePolicies(filteredPolicies);
    } catch (error) {
      logger.error('Error deleting policy:', error);
      throw error;
    }
  }

  async searchPolicies(filters: PolicyFilters): Promise<Policy[]> {
    try {
      let policies = await this.getPolicies();

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        policies = policies.filter(policy =>
          policy.name.toLowerCase().includes(searchTerm) ||
          policy.description.toLowerCase().includes(searchTerm) ||
          policy.framework.toLowerCase().includes(searchTerm)
        );
      }

      if (filters.type && filters.type !== 'all') {
        policies = policies.filter(policy => policy.type === filters.type);
      }

      if (filters.status && filters.status !== 'all') {
        policies = policies.filter(policy => policy.status === filters.status);
      }

      if (filters.function && filters.function !== 'all') {
        policies = policies.filter(policy => policy.nistFunction === filters.function);
      }

      if (filters.owner && filters.owner !== 'all') {
        policies = policies.filter(policy => policy.owner === filters.owner);
      }

      return policies;
    } catch (error) {
      logger.error('Error searching policies:', error);
      return [];
    }
  }

  async getPoliciesByStatus(status: Policy['status']): Promise<Policy[]> {
    try {
      const policies = await this.getPolicies();
      return policies.filter(policy => policy.status === status);
    } catch (error) {
      logger.error('Error fetching policies by status:', error);
      return [];
    }
  }

  async getPoliciesByType(type: Policy['type']): Promise<Policy[]> {
    try {
      const policies = await this.getPolicies();
      return policies.filter(policy => policy.type === type);
    } catch (error) {
      logger.error('Error fetching policies by type:', error);
      return [];
    }
  }

  async getPoliciesByOwner(owner: string): Promise<Policy[]> {
    try {
      const policies = await this.getPolicies();
      return policies.filter(policy => policy.owner === owner);
    } catch (error) {
      logger.error('Error fetching policies by owner:', error);
      return [];
    }
  }

  async getPolicyStatistics(): Promise<{
    total: number;
    byStatus: Record<Policy['status'], number>;
    byType: Record<Policy['type'], number>;
    byOwner: Record<string, number>;
    byFunction: Record<string, number>;
    complianceRate: number;
    averageRiskLevel: number;
  }> {
    try {
      const policies = await this.getPolicies();
      
      const byStatus = policies.reduce((acc, policy) => {
        acc[policy.status] = (acc[policy.status] || 0) + 1;
        return acc;
      }, {} as Record<Policy['status'], number>);

      const byType = policies.reduce((acc, policy) => {
        acc[policy.type] = (acc[policy.type] || 0) + 1;
        return acc;
      }, {} as Record<Policy['type'], number>);

      const byOwner = policies.reduce((acc, policy) => {
        acc[policy.owner] = (acc[policy.owner] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const byFunction = policies.reduce((acc, policy) => {
        acc[policy.nistFunction] = (acc[policy.nistFunction] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const effectivePolicies = policies.filter(p => p.status === 'effective').length;
      const complianceRate = policies.length > 0 ? (effectivePolicies / policies.length) * 100 : 0;

      const riskScores = {
        'low': 1,
        'medium': 2,
        'high': 3,
        'critical': 4
      };

      const averageRiskLevel = policies.length > 0 
        ? policies.reduce((sum, policy) => sum + riskScores[policy.riskLevel], 0) / policies.length
        : 0;

      return {
        total: policies.length,
        byStatus,
        byType,
        byOwner,
        byFunction,
        complianceRate,
        averageRiskLevel
      };
    } catch (error) {
      logger.error('Error calculating policy statistics:', error);
      return {
        total: 0,
        byStatus: {} as Record<Policy['status'], number>,
        byType: {} as Record<Policy['type'], number>,
        byOwner: {},
        byFunction: {},
        complianceRate: 0,
        averageRiskLevel: 0
      };
    }
  }

  async generatePoliciesFromFramework(): Promise<Policy[]> {
    try {
      const policies: Policy[] = [];
      const now = new Date();
      
      // Generate policies based on CMMC framework
      const cmmcFramework = await import('../data/frameworks/cmmc');
      
      const policyTemplates = [
        {
          id: 'pol-001',
          name: 'Cybersecurity Governance Policy',
          description: 'Establishes the organizational cybersecurity governance framework and strategic direction',
          type: 'governance' as Policy['type'],
          nistFunction: 'Govern',
          nistCategory: 'Organizational Context',
          nistSubcategories: ['GV.OC-01', 'GV.OC-02'],
          riskLevel: 'high' as Policy['riskLevel'],
          businessImpact: 'high' as Policy['businessImpact'],
          owner: 'CISO',
          approver: 'CEO',
          stakeholders: ['Executive Team', 'Board of Directors', 'Security Team'],
          scope: ['Organization-wide'],
          complianceRequirements: ['CMMC 2.0 Level 2', 'NIST CSF v2.0'],
          implementationGuide: {
            steps: [
              'Define cybersecurity governance structure',
              'Establish roles and responsibilities',
              'Create governance committee',
              'Develop governance processes',
              'Implement monitoring and reporting'
            ],
            resources: ['Governance framework template', 'Role definition matrix', 'Committee charter template'],
            training: ['Governance training for executives', 'Security awareness for all staff'],
            metrics: ['Governance effectiveness', 'Committee meeting frequency', 'Policy compliance rate']
          }
        },
        {
          id: 'pol-002',
          name: 'Access Control Policy',
          description: 'Defines requirements for managing user access to information systems and resources',
          type: 'access-control' as Policy['type'],
          nistFunction: 'Protect',
          nistCategory: 'Identity Management',
          nistSubcategories: ['PR.AC-01', 'PR.AC-02', 'PR.AC-03'],
          riskLevel: 'critical' as Policy['riskLevel'],
          businessImpact: 'critical' as Policy['businessImpact'],
          owner: 'IT Security Team',
          approver: 'CISO',
          stakeholders: ['IT Team', 'HR Team', 'All Users'],
          scope: ['All information systems', 'All users', 'All data'],
          complianceRequirements: ['CMMC 2.0 Level 2', 'NIST CSF v2.0', 'SOC 2'],
          implementationGuide: {
            steps: [
              'Define access control principles',
              'Implement user provisioning processes',
              'Establish access review procedures',
              'Configure system access controls',
              'Monitor and audit access'
            ],
            resources: ['Access control matrix', 'User provisioning checklist', 'Access review template'],
            training: ['Access control training for IT staff', 'User access awareness training'],
            metrics: ['Access control violations', 'User provisioning time', 'Access review completion rate']
          }
        },
        {
          id: 'pol-003',
          name: 'Incident Response Policy',
          description: 'Establishes procedures for detecting, responding to, and recovering from security incidents',
          type: 'incident-response' as Policy['type'],
          nistFunction: 'Respond',
          nistCategory: 'Incident Response',
          nistSubcategories: ['RS.IN-01', 'RS.IN-02', 'RS.IN-03'],
          riskLevel: 'high' as Policy['riskLevel'],
          businessImpact: 'high' as Policy['businessImpact'],
          owner: 'Security Operations',
          approver: 'CISO',
          stakeholders: ['Security Team', 'IT Team', 'Legal Team', 'Communications Team'],
          scope: ['All security incidents', 'All systems', 'All personnel'],
          complianceRequirements: ['CMMC 2.0 Level 2', 'NIST CSF v2.0', 'Incident reporting requirements'],
          implementationGuide: {
            steps: [
              'Define incident classification',
              'Establish response team',
              'Create response procedures',
              'Implement monitoring systems',
              'Conduct regular exercises'
            ],
            resources: ['Incident response playbook', 'Communication templates', 'Forensic procedures'],
            training: ['Incident response training for security team', 'Awareness training for all staff'],
            metrics: ['Incident response time', 'Incident resolution time', 'False positive rate']
          }
        },
        {
          id: 'pol-004',
          name: 'Data Protection Policy',
          description: 'Defines requirements for protecting sensitive data throughout its lifecycle',
          type: 'data-protection' as Policy['type'],
          nistFunction: 'Protect',
          nistCategory: 'Data Security',
          nistSubcategories: ['PR.DS-01', 'PR.DS-02', 'PR.DS-03'],
          riskLevel: 'critical' as Policy['riskLevel'],
          businessImpact: 'critical' as Policy['businessImpact'],
          owner: 'Data Protection Officer',
          approver: 'CISO',
          stakeholders: ['All Users', 'IT Team', 'Legal Team', 'Compliance Team'],
          scope: ['All sensitive data', 'All data processing systems', 'All personnel'],
          complianceRequirements: ['CMMC 2.0 Level 2', 'NIST CSF v2.0', 'GDPR', 'CCPA'],
          implementationGuide: {
            steps: [
              'Classify data by sensitivity',
              'Implement data encryption',
              'Establish data handling procedures',
              'Configure access controls',
              'Monitor data usage'
            ],
            resources: ['Data classification guide', 'Encryption standards', 'Data handling procedures'],
            training: ['Data protection training for all staff', 'Specialized training for data handlers'],
            metrics: ['Data breach incidents', 'Encryption coverage', 'Data access violations']
          }
        },
        {
          id: 'pol-005',
          name: 'Risk Management Policy',
          description: 'Establishes the framework for identifying, assessing, and managing cybersecurity risks',
          type: 'risk-management' as Policy['type'],
          nistFunction: 'Identify',
          nistCategory: 'Risk Assessment',
          nistSubcategories: ['ID.RA-01', 'ID.RA-02', 'ID.RA-03'],
          riskLevel: 'high' as Policy['riskLevel'],
          businessImpact: 'high' as Policy['businessImpact'],
          owner: 'Risk Management',
          approver: 'CISO',
          stakeholders: ['Executive Team', 'Security Team', 'Business Units', 'Compliance Team'],
          scope: ['All business processes', 'All information systems', 'All personnel'],
          complianceRequirements: ['CMMC 2.0 Level 2', 'NIST CSF v2.0', 'Enterprise risk management'],
          implementationGuide: {
            steps: [
              'Define risk management framework',
              'Identify and assess risks',
              'Develop risk treatment plans',
              'Implement risk controls',
              'Monitor and review risks'
            ],
            resources: ['Risk assessment templates', 'Risk register', 'Risk treatment plans'],
            training: ['Risk management training for managers', 'Risk awareness for all staff'],
            metrics: ['Risk assessment completion', 'Risk treatment progress', 'Risk reduction achieved']
          }
        }
      ];

      policyTemplates.forEach(template => {
        policies.push({
          ...template,
          framework: 'CMMC 2.0 Level 2',
          version: '1.0',
          status: 'draft' as Policy['status'],
          effectiveDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          lastReviewed: now,
          nextReview: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
          reviewCycle: 'annually' as Policy['reviewCycle'],
          exceptions: [],
          relatedPolicies: [],
          relatedControls: template.nistSubcategories,
          evidence: [],
          implementationStatus: 'not-started' as Policy['implementationStatus'],
          lastUpdated: now,
          createdAt: now,
          updatedAt: now
        });
      });

      return policies;
    } catch (error) {
      logger.error('Error generating policies from framework:', error);
      return [];
    }
  }

  async exportPolicies(policies: Policy[], format: 'csv' | 'pdf' | 'xlsx'): Promise<string> {
    try {
      if (format === 'csv') {
        const headers = ['ID', 'Name', 'Description', 'Type', 'Status', 'Owner', 'Version', 'Effective Date', 'Last Reviewed', 'Next Review', 'Risk Level', 'Business Impact'];
        const rows = policies.map(policy => [
          policy.id,
          policy.name,
          policy.description,
          policy.type,
          policy.status,
          policy.owner,
          policy.version,
          policy.effectiveDate.toLocaleDateString(),
          policy.lastReviewed.toLocaleDateString(),
          policy.nextReview.toLocaleDateString(),
          policy.riskLevel,
          policy.businessImpact
        ]);
        
        return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
      }
      
      // For PDF and XLSX, return a placeholder
      return `Generated ${format.toUpperCase()} export for ${policies.length} policies`;
    } catch (error) {
      logger.error('Error exporting policies:', error);
      throw error;
    }
  }

  private async savePolicies(policies: Policy[]): Promise<void> {
    try {
      const data = dataService.getData();
      data.policies = policies;
      await dataService.saveData(data);
    } catch (error) {
      logger.error('Error saving policies:', error);
      throw error;
    }
  }
}

export const policyService = PolicyService.getInstance();