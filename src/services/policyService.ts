/**
 * 📋 Policy Service
 * Manages security policies and documentation for CMMC compliance
 */

import { SecurityPolicy } from '../shared/types/documentation';
import { logger } from '../utils/logger';

export interface Policy {
  id: string;
  name: string;
  description: string;
  type: 'governance' | 'operational' | 'technical' | 'compliance' | 'incident-response' | 'data-protection' | 'access-control' | 'risk-management';
  status: 'draft' | 'review' | 'approved' | 'effective' | 'archived' | 'superseded';
  version: string;
  owner: string;
  framework: string;
  nistFunction: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  businessImpact: 'low' | 'medium' | 'high' | 'critical';
  effectiveDate: Date;
  lastReviewed: Date;
  nextReview: Date;
  reviewCycle: string;
  stakeholders?: string[];
  complianceRequirements?: string[];
}

export interface PolicyCreateData {
  name: string;
  description: string;
  category: SecurityPolicy['category'];
  priority: SecurityPolicy['priority'];
  spanOfUse: SecurityPolicy['spanOfUse'];
  frequencyOfUse: SecurityPolicy['frequencyOfUse'];
  reviewFrequency: SecurityPolicy['reviewFrequency'];
  documentType: SecurityPolicy['documentType'];
  owner: string;
  approver: string;
  tags: string[];
  relatedPolicies: string[];
  implementationGuidance: string;
  complianceRequirements: SecurityPolicy['complianceRequirements'];
  businessImpact: SecurityPolicy['businessImpact'];
  technicalComplexity: SecurityPolicy['technicalComplexity'];
  estimatedImplementationTime: string;
}

export interface PolicyFilters {
  search?: string;
  status?: Policy['status'];
  type?: Policy['type'];
  function?: string;
  owner?: string;
}

export interface PolicyStatistics {
  total: number;
  byStatus: Record<string, number>;
  byOwner: Record<string, number>;
}

class PolicyService {
  private static instance: PolicyService;
  private policies: SecurityPolicy[] = [];

  private constructor() {
    this.loadPolicies();
  }

  private convertSecurityPolicyToPolicy(securityPolicy: SecurityPolicy): Policy {
    const effectiveDate = new Date(securityPolicy.lastUpdated.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    const nextReview = new Date(securityPolicy.lastUpdated.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year from now
    
    return {
      id: securityPolicy.id,
      name: securityPolicy.name,
      description: securityPolicy.description,
      type: this.mapCategoryToType(securityPolicy.category),
      status: this.determineStatus(securityPolicy),
      version: securityPolicy.version,
      owner: securityPolicy.owner,
      framework: 'CMMC Level 1',
      nistFunction: this.mapCategoryToNistFunction(securityPolicy.category),
      riskLevel: this.mapPriorityToRiskLevel(securityPolicy.priority),
      businessImpact: securityPolicy.businessImpact,
      effectiveDate,
      lastReviewed: securityPolicy.lastUpdated,
      nextReview,
      reviewCycle: securityPolicy.reviewFrequency,
      stakeholders: ['CISO', 'IT Security Team', 'Data Protection Officer'],
      complianceRequirements: securityPolicy.complianceRequirements.map(req => req.framework)
    };
  }

  private mapCategoryToType(category: SecurityPolicy['category']): Policy['type'] {
    const mapping: Record<SecurityPolicy['category'], Policy['type']> = {
      'access-control': 'access-control',
      'data-protection': 'data-protection',
      'incident-response': 'incident-response',
      'risk-management': 'risk-management',
      'governance': 'governance',
      'physical-security': 'operational',
      'network-security': 'technical',
      'business-continuity': 'operational',
      'vendor-management': 'operational',
      'training-awareness': 'operational'
    };
    return mapping[category] || 'governance';
  }

  private determineStatus(securityPolicy: SecurityPolicy): Policy['status'] {
    const daysSinceUpdate = (Date.now() - securityPolicy.lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate < 7) return 'draft';
    if (daysSinceUpdate < 30) return 'review';
    if (daysSinceUpdate < 365) return 'effective';
    return 'archived';
  }

  private mapCategoryToNistFunction(category: SecurityPolicy['category']): string {
    const mapping: Record<SecurityPolicy['category'], string> = {
      'access-control': 'Protect',
      'data-protection': 'Protect',
      'incident-response': 'Respond',
      'risk-management': 'Identify',
      'governance': 'Govern',
      'physical-security': 'Protect',
      'network-security': 'Protect',
      'business-continuity': 'Recover',
      'vendor-management': 'Govern',
      'training-awareness': 'Protect'
    };
    return mapping[category] || 'Govern';
  }

  private mapPriorityToRiskLevel(priority: SecurityPolicy['priority']): Policy['riskLevel'] {
    const mapping: Record<SecurityPolicy['priority'], Policy['riskLevel']> = {
      'critical': 'critical',
      'high': 'high',
      'medium': 'medium',
      'low': 'low'
    };
    return mapping[priority] || 'medium';
  }

  public static getInstance(): PolicyService {
    if (!PolicyService.instance) {
      PolicyService.instance = new PolicyService();
    }
    return PolicyService.instance;
  }

  private loadPolicies(): void {
    try {
      const policiesData = localStorage.getItem('cmc_policies');
      if (policiesData) {
        this.policies = JSON.parse(policiesData).map((policy: any) => ({
          ...policy,
          lastUpdated: new Date(policy.lastUpdated)
        }));
      } else {
        this.initializeDefaultPolicies();
      }

      logger.debug('Policies loaded successfully', { count: this.policies.length });
    } catch (error) {
      logger.error('Failed to load policies:', error);
      this.policies = [];
      this.initializeDefaultPolicies();
    }
  }

  private savePolicies(): void {
    try {
      localStorage.setItem('cmc_policies', JSON.stringify(this.policies));
      logger.debug('Policies saved successfully', { count: this.policies.length });
    } catch (error) {
      logger.error('Failed to save policies:', error);
      throw new Error('Failed to save policies');
    }
  }

  private initializeDefaultPolicies(): void {
    const now = new Date();
    const defaultPolicies: SecurityPolicy[] = [
      {
        id: 'policy_access_control_001',
        name: 'Access Control Policy',
        description: 'Policy governing access control mechanisms and user authentication',
        category: 'access-control',
        complianceMapping: ['AC.1.001', 'AC.1.002', 'AC.1.003'],
        priority: 'critical',
        spanOfUse: 'organization-wide',
        frequencyOfUse: 'daily',
        reviewFrequency: 'annually',
        documentType: 'policy',
        version: '1.0',
        lastUpdated: now,
        owner: 'CISO',
        approver: 'CEO',
        tags: ['access-control', 'authentication', 'authorization'],
        relatedPolicies: ['policy_user_management_001'],
        implementationGuidance: 'Implement role-based access control (RBAC) and multi-factor authentication',
        complianceRequirements: [
          {
            framework: 'CMMC Level 1',
            controls: ['AC.1.001', 'AC.1.002', 'AC.1.003'],
            mandatory: true
          }
        ],
        documentUrl: '/policies/access-control-policy.pdf',
        templateAvailable: true,
        estimatedImplementationTime: '2-4 weeks',
        businessImpact: 'high',
        technicalComplexity: 'medium'
      },
      {
        id: 'policy_data_protection_001',
        name: 'Data Protection Policy',
        description: 'Policy for protecting sensitive data and information assets',
        category: 'data-protection',
        complianceMapping: ['MP.1.001', 'MP.1.002'],
        priority: 'critical',
        spanOfUse: 'organization-wide',
        frequencyOfUse: 'daily',
        reviewFrequency: 'annually',
        documentType: 'policy',
        version: '1.0',
        lastUpdated: now,
        owner: 'Data Protection Officer',
        approver: 'CISO',
        tags: ['data-protection', 'encryption', 'privacy'],
        relatedPolicies: ['policy_access_control_001'],
        implementationGuidance: 'Implement data classification, encryption, and secure data handling procedures',
        complianceRequirements: [
          {
            framework: 'CMMC Level 1',
            controls: ['MP.1.001', 'MP.1.002'],
            mandatory: true
          }
        ],
        documentUrl: '/policies/data-protection-policy.pdf',
        templateAvailable: true,
        estimatedImplementationTime: '3-6 weeks',
        businessImpact: 'critical',
        technicalComplexity: 'high'
      },
      {
        id: 'policy_incident_response_001',
        name: 'Incident Response Policy',
        description: 'Policy for responding to security incidents and breaches',
        category: 'incident-response',
        complianceMapping: ['IR.1.001', 'IR.1.002'],
        priority: 'high',
        spanOfUse: 'organization-wide',
        frequencyOfUse: 'as-needed',
        reviewFrequency: 'annually',
        documentType: 'policy',
        version: '1.0',
        lastUpdated: now,
        owner: 'CISO',
        approver: 'CEO',
        tags: ['incident-response', 'security', 'breach'],
        relatedPolicies: ['policy_data_protection_001'],
        implementationGuidance: 'Establish incident response team and procedures for security incidents',
        complianceRequirements: [
          {
            framework: 'CMMC Level 1',
            controls: ['IR.1.001', 'IR.1.002'],
            mandatory: true
          }
        ],
        documentUrl: '/policies/incident-response-policy.pdf',
        templateAvailable: true,
        estimatedImplementationTime: '2-3 weeks',
        businessImpact: 'high',
        technicalComplexity: 'medium'
      }
    ];

    this.policies = defaultPolicies;
    this.savePolicies();
  }

  public async getPolicies(): Promise<Policy[]> {
    return this.policies.map(policy => this.convertSecurityPolicyToPolicy(policy));
  }

  public async getPolicyById(id: string): Promise<SecurityPolicy | null> {
    return this.policies.find(policy => policy.id === id) || null;
  }

  public async searchPolicies(filters: PolicyFilters): Promise<Policy[]> {
    const policies = this.policies.map(policy => this.convertSecurityPolicyToPolicy(policy));
    
    return policies.filter(policy => {
      if (filters.status && policy.status !== filters.status) return false;
      if (filters.type && policy.type !== filters.type) return false;
      if (filters.function && policy.nistFunction !== filters.function) return false;
      if (filters.owner && !policy.owner.toLowerCase().includes(filters.owner.toLowerCase())) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = policy.name.toLowerCase().includes(searchLower) ||
                             policy.description.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      return true;
    });
  }

  public async getPoliciesByCategory(category: string): Promise<SecurityPolicy[]> {
    return this.policies.filter(policy => policy.category === category);
  }

  public async getPoliciesByFramework(framework: string): Promise<SecurityPolicy[]> {
    return this.policies.filter(policy => 
      policy.complianceRequirements.some(req => 
        req.framework.toLowerCase().includes(framework.toLowerCase())
      )
    );
  }

  public async createPolicy(policyData: PolicyCreateData): Promise<SecurityPolicy> {
    const now = new Date();
    const newPolicy: SecurityPolicy = {
      id: `policy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: policyData.name,
      description: policyData.description,
      category: policyData.category,
      complianceMapping: policyData.complianceRequirements.map(req => req.controls).flat(),
      priority: policyData.priority,
      spanOfUse: policyData.spanOfUse,
      frequencyOfUse: policyData.frequencyOfUse,
      reviewFrequency: policyData.reviewFrequency,
      documentType: policyData.documentType,
      version: '1.0',
      lastUpdated: now,
      owner: policyData.owner,
      approver: policyData.approver,
      tags: policyData.tags,
      relatedPolicies: policyData.relatedPolicies,
      implementationGuidance: policyData.implementationGuidance,
      complianceRequirements: policyData.complianceRequirements,
      templateAvailable: true,
      estimatedImplementationTime: policyData.estimatedImplementationTime,
      businessImpact: policyData.businessImpact,
      technicalComplexity: policyData.technicalComplexity
    };

    this.policies.push(newPolicy);
    this.savePolicies();

    logger.info('Policy created successfully', { 
      policyId: newPolicy.id, 
      name: newPolicy.name 
    });

    return newPolicy;
  }


  public async getStatistics(): Promise<PolicyStatistics> {
    const policies = this.policies.map(policy => this.convertSecurityPolicyToPolicy(policy));
    const total = policies.length;
    
    const byStatus = policies.reduce((acc, policy) => {
      acc[policy.status] = (acc[policy.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byOwner = policies.reduce((acc, policy) => {
      acc[policy.owner] = (acc[policy.owner] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      byStatus,
      byOwner
    };
  }

  public async getPolicyStatistics(): Promise<PolicyStatistics> {
    return this.getStatistics();
  }

  public async updatePolicy(id: string, updates: Partial<Policy>): Promise<Policy> {
    const policyIndex = this.policies.findIndex(policy => policy.id === id);
    if (policyIndex === -1) {
      throw new Error(`Policy with id ${id} not found`);
    }

    const securityPolicy = this.policies[policyIndex];
    const updatedSecurityPolicy: SecurityPolicy = {
      ...securityPolicy,
      owner: updates.owner || securityPolicy.owner,
      lastUpdated: new Date()
    };

    this.policies[policyIndex] = updatedSecurityPolicy;
    this.savePolicies();

    logger.info('Policy updated successfully', { 
      policyId: id, 
      name: updatedSecurityPolicy.name 
    });

    return this.convertSecurityPolicyToPolicy(updatedSecurityPolicy);
  }

  public async deletePolicy(id: string): Promise<void> {
    const policyIndex = this.policies.findIndex(policy => policy.id === id);
    if (policyIndex === -1) {
      throw new Error(`Policy with id ${id} not found`);
    }

    const deletedPolicy = this.policies[policyIndex];
    this.policies.splice(policyIndex, 1);
    this.savePolicies();

    logger.info('Policy deleted successfully', { 
      policyId: id, 
      name: deletedPolicy.name 
    });
  }

  public async generatePoliciesFromFramework(): Promise<Policy[]> {
    // Return existing policies as generated ones for now
    return this.getPolicies();
  }

  public async savePolicy(policy: Policy): Promise<Policy> {
    // Convert Policy back to SecurityPolicy for storage
    const securityPolicy: SecurityPolicy = {
      id: policy.id,
      name: policy.name,
      description: policy.description,
      category: this.mapTypeToCategory(policy.type),
      complianceMapping: [],
      priority: this.mapRiskLevelToPriority(policy.riskLevel),
      spanOfUse: 'organization-wide',
      frequencyOfUse: 'daily',
      reviewFrequency: policy.reviewCycle as SecurityPolicy['reviewFrequency'],
      documentType: 'policy',
      version: policy.version,
      lastUpdated: policy.lastReviewed,
      owner: policy.owner,
      approver: 'CEO',
      tags: [policy.type],
      relatedPolicies: [],
      implementationGuidance: '',
      complianceRequirements: [{
        framework: policy.framework,
        controls: [],
        mandatory: true
      }],
      templateAvailable: true,
      estimatedImplementationTime: '2-4 weeks',
      businessImpact: policy.businessImpact,
      technicalComplexity: 'medium'
    };

    this.policies.push(securityPolicy);
    this.savePolicies();

    return policy;
  }

  private mapTypeToCategory(type: Policy['type']): SecurityPolicy['category'] {
    const mapping: Record<Policy['type'], SecurityPolicy['category']> = {
      'access-control': 'access-control',
      'data-protection': 'data-protection',
      'incident-response': 'incident-response',
      'risk-management': 'risk-management',
      'governance': 'governance',
      'operational': 'physical-security',
      'technical': 'network-security',
      'compliance': 'governance'
    };
    return mapping[type] || 'governance';
  }

  private mapRiskLevelToPriority(riskLevel: Policy['riskLevel']): SecurityPolicy['priority'] {
    const mapping: Record<Policy['riskLevel'], SecurityPolicy['priority']> = {
      'critical': 'critical',
      'high': 'high',
      'medium': 'medium',
      'low': 'low'
    };
    return mapping[riskLevel] || 'medium';
  }

  public async exportPolicies(policies: Policy[], format: string): Promise<string> {
    try {
      if (format === 'csv') {
        const headers = ['ID', 'Name', 'Description', 'Type', 'Status', 'Version', 'Owner', 'Framework', 'Risk Level', 'Business Impact'];
        const rows = policies.map(policy => [
          policy.id,
          policy.name,
          policy.description,
          policy.type,
          policy.status,
          policy.version,
          policy.owner,
          policy.framework,
          policy.riskLevel,
          policy.businessImpact
        ]);
        
        const csvContent = [headers, ...rows]
          .map(row => row.map(field => `"${field}"`).join(','))
          .join('\n');
        
        return csvContent;
      }
      
      const exportData = {
        policies,
        exportedAt: new Date().toISOString(),
        version: '1.0.0'
      };
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      logger.error('Failed to export policies:', error);
      throw new Error('Failed to export policies');
    }
  }

  public async importPolicies(data: string): Promise<{ success: number; errors: string[] }> {
    try {
      const importedData = JSON.parse(data);
      const results = { success: 0, errors: [] as string[] };

      if (importedData.policies && Array.isArray(importedData.policies)) {
        importedData.policies.forEach((policyData: any) => {
          try {
            const policy: SecurityPolicy = {
              ...policyData,
              id: `policy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              lastUpdated: new Date()
            };

            this.policies.push(policy);
            results.success++;
          } catch (error) {
            results.errors.push(`Policy ${policyData.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        });

        this.savePolicies();
      }

      logger.info('Policies import completed', { 
        success: results.success, 
        errors: results.errors.length 
      });

      return results;
    } catch (error) {
      logger.error('Failed to import policies:', error);
      throw new Error(`Failed to import policies: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const policyService = PolicyService.getInstance();