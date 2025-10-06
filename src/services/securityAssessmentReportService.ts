import { AssessmentData, Framework } from '../shared/types';
import { cmmcFramework } from '../data/frameworks/cmmc';

export interface SecurityAssessmentReport {
  id: string;
  title: string;
  version: string;
  organization: string;
  assessmentDate: Date;
  generatedDate: Date;
  assessor: AssessorInfo;
  executiveSummary: ExecutiveSummary;
  scopeAndMethodology: ScopeAndMethodology;
  findings: Finding[];
  domainAnalysis: DomainAnalysis[];
  riskAssessment: RiskAssessment;
  recommendations: Recommendation[];
  complianceStatus: ComplianceStatus;
  nextSteps: NextStep[];
  appendices: SARAppendix[];
}

interface AssessorInfo {
  name: string;
  organization: string;
  credentials: string[];
  contactInfo: string;
}

interface ExecutiveSummary {
  overallScore: number;
  complianceLevel: 'Level 1' | 'Level 2' | 'Level 3' | 'Non-Compliant';
  criticalFindings: number;
  highFindings: number;
  mediumFindings: number;
  lowFindings: number;
  readinessAssessment: string;
  keyStrengths: string[];
  keyWeaknesses: string[];
  estimatedRemediationTime: string;
}

interface ScopeAndMethodology {
  assessmentType: 'Self-Assessment' | 'Gap Analysis' | 'Pre-Assessment' | 'C3PAO Assessment';
  assessmentScope: string[];
  methodology: string;
  standards: string[];
  assessmentPeriod: {
    startDate: Date;
    endDate: Date;
  };
  systemsAssessed: string[];
  documentationReviewed: string[];
  interviewsConducted: string[];
}

interface Finding {
  id: string;
  controlId: string;
  controlTitle: string;
  domain: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'compliant' | 'partially-compliant' | 'non-compliant' | 'not-applicable';
  currentState: string;
  requiredState: string;
  gapDescription: string;
  evidence: string[];
  impactAnalysis: string;
  remediationEffort: 'low' | 'medium' | 'high';
  estimatedCost: string;
  priority: number;
  assignedTo: string;
  dueDate: Date;
}

interface DomainAnalysis {
  domain: string;
  domainCode: string;
  totalControls: number;
  compliantControls: number;
  partiallyCompliantControls: number;
  nonCompliantControls: number;
  notApplicableControls: number;
  overallScore: number;
  maturityLevel: 1 | 2 | 3 | 4 | 5;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

interface RiskAssessment {
  overallRiskLevel: 'critical' | 'high' | 'medium' | 'low';
  riskCategories: RiskCategory[];
  riskMatrix: RiskMatrixEntry[];
  mitigationStrategy: string;
}

interface RiskCategory {
  category: string;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  potentialImpact: string;
  likelihood: 'very-high' | 'high' | 'medium' | 'low' | 'very-low';
  affectedControls: string[];
}

interface RiskMatrixEntry {
  controlId: string;
  likelihood: number; // 1-5
  impact: number; // 1-5
  riskScore: number; // likelihood * impact
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
}

interface Recommendation {
  id: string;
  priority: 'immediate' | 'short-term' | 'medium-term' | 'long-term';
  category: 'technical' | 'policy' | 'process' | 'training' | 'documentation';
  title: string;
  description: string;
  rationale: string;
  affectedControls: string[];
  estimatedEffort: string;
  estimatedCost: string;
  expectedBenefit: string;
  dependencies: string[];
}

interface ComplianceStatus {
  targetLevel: 'Level 1' | 'Level 2' | 'Level 3';
  currentReadiness: number; // percentage
  gapAnalysis: {
    totalGaps: number;
    criticalGaps: number;
    highPriorityGaps: number;
    mediumPriorityGaps: number;
    lowPriorityGaps: number;
  };
  certificationReadiness: 'ready' | 'near-ready' | 'significant-work-needed' | 'not-ready';
  estimatedTimeToReadiness: string;
  requiredInvestment: string;
}

interface NextStep {
  id: string;
  phase: 'immediate' | 'phase-1' | 'phase-2' | 'phase-3';
  title: string;
  description: string;
  owner: string;
  dueDate: Date;
  dependencies: string[];
  deliverables: string[];
  successCriteria: string[];
}

interface SARAppendix {
  id: string;
  title: string;
  type: 'evidence-list' | 'control-matrix' | 'interview-notes' | 'technical-findings' | 'reference';
  content: string;
}

export class SecurityAssessmentReportService {
  private static instance: SecurityAssessmentReportService;

  static getInstance(): SecurityAssessmentReportService {
    if (!SecurityAssessmentReportService.instance) {
      SecurityAssessmentReportService.instance = new SecurityAssessmentReportService();
    }
    return SecurityAssessmentReportService.instance;
  }

  generateReport(
    assessment: AssessmentData,
    assessorInfo: AssessorInfo,
    scopeInfo: Partial<ScopeAndMethodology>
  ): SecurityAssessmentReport {
    const findings = this.generateFindings(assessment);
    const domainAnalysis = this.generateDomainAnalysis(assessment);
    const executiveSummary = this.generateExecutiveSummary(findings, domainAnalysis);
    const riskAssessment = this.generateRiskAssessment(findings);
    const recommendations = this.generateRecommendations(findings, domainAnalysis);
    const complianceStatus = this.generateComplianceStatus(findings, domainAnalysis);
    const nextSteps = this.generateNextSteps(recommendations);
    const appendices = this.generateAppendices(findings, assessment);

    const scope: ScopeAndMethodology = {
      assessmentType: scopeInfo.assessmentType || 'Gap Analysis',
      assessmentScope: scopeInfo.assessmentScope || ['Information Systems', 'Network Infrastructure', 'CUI Processing'],
      methodology: scopeInfo.methodology || 'NIST SP 800-171 based assessment aligned with CMMC Level 2 requirements',
      standards: ['CMMC 2.0 Level 2', 'NIST SP 800-171 Rev 2', 'NIST SP 800-171A'],
      assessmentPeriod: scopeInfo.assessmentPeriod || {
        startDate: new Date(assessment.createdAt),
        endDate: new Date()
      },
      systemsAssessed: scopeInfo.systemsAssessed || ['Primary Business Systems', 'CUI Storage Systems', 'Network Infrastructure'],
      documentationReviewed: scopeInfo.documentationReviewed || ['System Security Plan', 'Policies and Procedures', 'Configuration Documentation'],
      interviewsConducted: scopeInfo.interviewsConducted || ['IT Leadership', 'Security Team', 'System Administrators']
    };

    return {
      id: `sar-${Date.now()}`,
      title: `Security Assessment Report - ${assessment.organizationInfo?.name || 'Organization'}`,
      version: '1.0',
      organization: assessment.organizationInfo?.name || 'Organization',
      assessmentDate: new Date(assessment.lastModified),
      generatedDate: new Date(),
      assessor: assessorInfo,
      executiveSummary,
      scopeAndMethodology: scope,
      findings,
      domainAnalysis,
      riskAssessment,
      recommendations,
      complianceStatus,
      nextSteps,
      appendices
    };
  }

  private generateFindings(assessment: AssessmentData): Finding[] {
    const findings: Finding[] = [];
    let findingCounter = 1;

    cmmcFramework.sections.forEach(section => {
      section.categories.forEach(category => {
        category.questions.forEach(question => {
          const response = assessment.responses[question.id];

          if (!response || response === 'no' || response === 'partial') {
            const status: Finding['status'] =
              !response || response === 'no' ? 'non-compliant' :
              response === 'partial' ? 'partially-compliant' :
              'compliant';

            const severity = this.determineSeverity(question.priority as string, status);

            findings.push({
              id: `F-${findingCounter.toString().padStart(3, '0')}`,
              controlId: question.id,
              controlTitle: question.text,
              domain: section.name,
              severity,
              status,
              currentState: this.describeCurrentState(response),
              requiredState: question.guidance,
              gapDescription: this.generateGapDescription(question, response),
              evidence: assessment.questionEvidence?.[question.id] || [],
              impactAnalysis: this.generateImpactAnalysis(question, severity),
              remediationEffort: this.estimateRemediationEffort(severity),
              estimatedCost: this.estimateCost(severity),
              priority: findingCounter,
              assignedTo: 'Compliance Team',
              dueDate: this.calculateDueDate(severity)
            });

            findingCounter++;
          }
        });
      });
    });

    return findings.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  private generateDomainAnalysis(assessment: AssessmentData): DomainAnalysis[] {
    const domainMap = new Map<string, {
      controls: number;
      compliant: number;
      partial: number;
      nonCompliant: number;
      notApplicable: number;
    }>();

    cmmcFramework.sections.forEach(section => {
      const domainStats = {
        controls: 0,
        compliant: 0,
        partial: 0,
        nonCompliant: 0,
        notApplicable: 0
      };

      section.categories.forEach(category => {
        category.questions.forEach(question => {
          domainStats.controls++;
          const response = assessment.responses[question.id];

          if (response === 'yes') domainStats.compliant++;
          else if (response === 'partial') domainStats.partial++;
          else if (response === 'na') domainStats.notApplicable++;
          else domainStats.nonCompliant++;
        });
      });

      domainMap.set(section.name, domainStats);
    });

    return Array.from(domainMap.entries()).map(([domain, stats]) => {
      const score = ((stats.compliant + stats.partial * 0.5) / stats.controls) * 100;
      const maturityLevel = this.calculateMaturityLevel(score);

      return {
        domain,
        domainCode: this.getDomainCode(domain),
        totalControls: stats.controls,
        compliantControls: stats.compliant,
        partiallyCompliantControls: stats.partial,
        nonCompliantControls: stats.nonCompliant,
        notApplicableControls: stats.notApplicable,
        overallScore: score,
        maturityLevel,
        strengths: this.identifyDomainStrengths(domain, stats),
        weaknesses: this.identifyDomainWeaknesses(domain, stats),
        recommendations: this.generateDomainRecommendations(domain, stats)
      };
    });
  }

  private generateExecutiveSummary(findings: Finding[], domains: DomainAnalysis[]): ExecutiveSummary {
    const criticalFindings = findings.filter(f => f.severity === 'critical').length;
    const highFindings = findings.filter(f => f.severity === 'high').length;
    const mediumFindings = findings.filter(f => f.severity === 'medium').length;
    const lowFindings = findings.filter(f => f.severity === 'low').length;

    const avgScore = domains.reduce((sum, d) => sum + d.overallScore, 0) / domains.length;

    const complianceLevel: ExecutiveSummary['complianceLevel'] =
      avgScore >= 95 ? 'Level 2' :
      avgScore >= 80 ? 'Level 1' :
      'Non-Compliant';

    const strongDomains = domains.filter(d => d.overallScore >= 90).slice(0, 5);
    const weakDomains = domains.filter(d => d.overallScore < 70).slice(0, 5);

    return {
      overallScore: avgScore,
      complianceLevel,
      criticalFindings,
      highFindings,
      mediumFindings,
      lowFindings,
      readinessAssessment: this.generateReadinessAssessment(avgScore, criticalFindings, highFindings),
      keyStrengths: strongDomains.map(d => `Strong ${d.domain} implementation with ${d.overallScore.toFixed(0)}% compliance`),
      keyWeaknesses: weakDomains.map(d => `${d.domain} requires significant improvement (${d.overallScore.toFixed(0)}% compliant)`),
      estimatedRemediationTime: this.estimateOverallRemediationTime(criticalFindings, highFindings, mediumFindings)
    };
  }

  private generateRiskAssessment(findings: Finding[]): RiskAssessment {
    const riskMatrix = findings.map(finding => {
      const likelihood = this.calculateLikelihood(finding.severity);
      const impact = this.calculateImpact(finding.severity);
      const riskScore = likelihood * impact;

      return {
        controlId: finding.controlId,
        likelihood,
        impact,
        riskScore,
        riskLevel: this.mapRiskScore(riskScore)
      };
    });

    const criticalRisks = riskMatrix.filter(r => r.riskLevel === 'critical').length;
    const highRisks = riskMatrix.filter(r => r.riskLevel === 'high').length;

    const overallRiskLevel: RiskAssessment['overallRiskLevel'] =
      criticalRisks > 5 ? 'critical' :
      criticalRisks > 0 || highRisks > 10 ? 'high' :
      highRisks > 0 ? 'medium' :
      'low';

    return {
      overallRiskLevel,
      riskCategories: this.generateRiskCategories(findings),
      riskMatrix,
      mitigationStrategy: this.generateMitigationStrategy(overallRiskLevel, findings)
    };
  }

  private generateRecommendations(findings: Finding[], domains: DomainAnalysis[]): Recommendation[] {
    const recommendations: Recommendation[] = [];
    let recId = 1;

    // Critical findings recommendations
    findings.filter(f => f.severity === 'critical').forEach(finding => {
      recommendations.push({
        id: `REC-${recId.toString().padStart(3, '0')}`,
        priority: 'immediate',
        category: 'technical',
        title: `Implement ${finding.controlTitle}`,
        description: `Address critical security gap in ${finding.domain}`,
        rationale: finding.gapDescription,
        affectedControls: [finding.controlId],
        estimatedEffort: finding.remediationEffort === 'high' ? '4-8 weeks' : '2-4 weeks',
        estimatedCost: finding.estimatedCost,
        expectedBenefit: 'Significantly reduces security risk and improves CMMC readiness',
        dependencies: []
      });
      recId++;
    });

    // Domain-specific recommendations
    domains.filter(d => d.overallScore < 70).forEach(domain => {
      recommendations.push({
        id: `REC-${recId.toString().padStart(3, '0')}`,
        priority: 'short-term',
        category: 'process',
        title: `Comprehensive ${domain.domain} Improvement Program`,
        description: `Systematic improvement of ${domain.domain} controls and processes`,
        rationale: `Domain currently at ${domain.overallScore.toFixed(0)}% compliance, requiring structured improvement`,
        affectedControls: [`${domain.domainCode}.*`],
        estimatedEffort: '3-6 months',
        estimatedCost: '$25,000 - $75,000',
        expectedBenefit: `Brings ${domain.domain} to compliance and improves overall security posture`,
        dependencies: []
      });
      recId++;
    });

    return recommendations;
  }

  private generateComplianceStatus(findings: Finding[], domains: DomainAnalysis[]): ComplianceStatus {
    const avgScore = domains.reduce((sum, d) => sum + d.overallScore, 0) / domains.length;
    const criticalGaps = findings.filter(f => f.severity === 'critical').length;
    const highGaps = findings.filter(f => f.severity === 'high').length;
    const mediumGaps = findings.filter(f => f.severity === 'medium').length;
    const lowGaps = findings.filter(f => f.severity === 'low').length;

    const readiness: ComplianceStatus['certificationReadiness'] =
      avgScore >= 95 && criticalGaps === 0 ? 'ready' :
      avgScore >= 85 && criticalGaps === 0 && highGaps <= 3 ? 'near-ready' :
      avgScore >= 70 ? 'significant-work-needed' :
      'not-ready';

    return {
      targetLevel: 'Level 2',
      currentReadiness: avgScore,
      gapAnalysis: {
        totalGaps: findings.length,
        criticalGaps,
        highPriorityGaps: highGaps,
        mediumPriorityGaps: mediumGaps,
        lowPriorityGaps: lowGaps
      },
      certificationReadiness: readiness,
      estimatedTimeToReadiness: this.estimateTimeToReadiness(avgScore, criticalGaps, highGaps),
      requiredInvestment: this.estimateInvestment(criticalGaps, highGaps, mediumGaps)
    };
  }

  private generateNextSteps(recommendations: Recommendation[]): NextStep[] {
    return recommendations.slice(0, 10).map((rec, index) => ({
      id: `NS-${(index + 1).toString().padStart(3, '0')}`,
      phase: rec.priority === 'immediate' ? 'immediate' :
             rec.priority === 'short-term' ? 'phase-1' :
             rec.priority === 'medium-term' ? 'phase-2' : 'phase-3',
      title: rec.title,
      description: rec.description,
      owner: 'To Be Assigned',
      dueDate: this.calculateNextStepDueDate(rec.priority),
      dependencies: rec.dependencies,
      deliverables: this.generateDeliverables(rec),
      successCriteria: this.generateSuccessCriteria(rec)
    }));
  }

  private generateAppendices(findings: Finding[], assessment: AssessmentData): SARAppendix[] {
    return [
      {
        id: 'app-a',
        title: 'Complete Control Matrix',
        type: 'control-matrix',
        content: this.generateControlMatrixContent(findings)
      },
      {
        id: 'app-b',
        title: 'Evidence Documentation List',
        type: 'evidence-list',
        content: this.generateEvidenceListContent(assessment)
      },
      {
        id: 'app-c',
        title: 'Technical Findings Details',
        type: 'technical-findings',
        content: this.generateTechnicalFindingsContent(findings)
      },
      {
        id: 'app-d',
        title: 'Reference Standards',
        type: 'reference',
        content: 'CMMC 2.0 Level 2, NIST SP 800-171 Rev 2, NIST SP 800-171A, NIST SP 800-53 Rev 5'
      }
    ];
  }

  // Helper methods
  private determineSeverity(priority: string, status: Finding['status']): Finding['severity'] {
    if (status === 'non-compliant') {
      return priority === 'critical' ? 'critical' : priority === 'high' ? 'high' : 'medium';
    }
    return priority === 'critical' ? 'high' : 'medium';
  }

  private describeCurrentState(response: string | undefined): string {
    if (!response || response === 'no') return 'Control not implemented';
    if (response === 'partial') return 'Control partially implemented';
    return 'Control implemented';
  }

  private generateGapDescription(question: any, response: string | undefined): string {
    if (!response || response === 'no') {
      return `The organization has not implemented ${question.text}. This represents a compliance gap that must be addressed.`;
    }
    return `The organization has partially implemented ${question.text}. Additional work is required to achieve full compliance.`;
  }

  private generateImpactAnalysis(question: any, severity: Finding['severity']): string {
    const impacts = {
      critical: 'poses significant security risk and prevents CMMC certification',
      high: 'increases security risk and may prevent CMMC certification',
      medium: 'presents moderate security risk and should be addressed before assessment',
      low: 'presents minimal security risk but should be remediated for full compliance'
    };
    return `This gap ${impacts[severity]}.`;
  }

  private estimateRemediationEffort(severity: Finding['severity']): 'low' | 'medium' | 'high' {
    return severity === 'critical' || severity === 'high' ? 'high' : severity === 'medium' ? 'medium' : 'low';
  }

  private estimateCost(severity: Finding['severity']): string {
    const costs = {
      critical: '$10,000 - $50,000',
      high: '$5,000 - $25,000',
      medium: '$2,500 - $10,000',
      low: '$1,000 - $5,000'
    };
    return costs[severity];
  }

  private calculateDueDate(severity: Finding['severity']): Date {
    const days = severity === 'critical' ? 30 : severity === 'high' ? 60 : severity === 'medium' ? 90 : 180;
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  }

  private calculateMaturityLevel(score: number): 1 | 2 | 3 | 4 | 5 {
    if (score >= 95) return 5;
    if (score >= 85) return 4;
    if (score >= 70) return 3;
    if (score >= 50) return 2;
    return 1;
  }

  private getDomainCode(domain: string): string {
    const codes: Record<string, string> = {
      'Access Control': 'AC',
      'Audit and Accountability': 'AU',
      'Awareness and Training': 'AT',
      'Configuration Management': 'CM',
      'Identification and Authentication': 'IA',
      'Incident Response': 'IR',
      'Maintenance': 'MA',
      'Media Protection': 'MP',
      'Personnel Security': 'PS',
      'Physical Protection': 'PE',
      'Risk Assessment': 'RA',
      'Security Assessment': 'CA',
      'System and Communications Protection': 'SC',
      'System and Information Integrity': 'SI'
    };
    return codes[domain] || 'XX';
  }

  private identifyDomainStrengths(domain: string, stats: any): string[] {
    const strengths: string[] = [];
    const complianceRate = (stats.compliant / stats.controls) * 100;

    if (complianceRate >= 90) {
      strengths.push('Strong overall compliance posture');
    }
    if (stats.notApplicable > 0) {
      strengths.push('Appropriate control scoping and tailoring');
    }
    if (stats.compliant > stats.nonCompliant * 2) {
      strengths.push('Majority of controls properly implemented');
    }

    return strengths.length > 0 ? strengths : ['Foundation established for improvement'];
  }

  private identifyDomainWeaknesses(domain: string, stats: any): string[] {
    const weaknesses: string[] = [];
    const nonComplianceRate = (stats.nonCompliant / stats.controls) * 100;

    if (nonComplianceRate > 30) {
      weaknesses.push('Significant compliance gaps requiring immediate attention');
    }
    if (stats.partial > stats.compliant) {
      weaknesses.push('Many controls only partially implemented');
    }
    if (stats.nonCompliant > 5) {
      weaknesses.push('Multiple controls not yet implemented');
    }

    return weaknesses.length > 0 ? weaknesses : ['Minor improvements needed'];
  }

  private generateDomainRecommendations(domain: string, stats: any): string[] {
    const recommendations: string[] = [];

    if (stats.nonCompliant > 0) {
      recommendations.push(`Prioritize implementation of ${stats.nonCompliant} non-compliant controls`);
    }
    if (stats.partial > 0) {
      recommendations.push(`Complete implementation of ${stats.partial} partially implemented controls`);
    }
    recommendations.push('Establish regular review and monitoring process');
    recommendations.push('Document all control implementations with evidence');

    return recommendations;
  }

  private generateReadinessAssessment(score: number, critical: number, high: number): string {
    if (score >= 95 && critical === 0) {
      return 'Organization demonstrates strong readiness for CMMC Level 2 certification with comprehensive security controls implemented.';
    } else if (score >= 80 && critical === 0) {
      return 'Organization shows good progress toward CMMC Level 2 certification. Addressing high-priority gaps will significantly improve readiness.';
    } else if (score >= 70) {
      return 'Organization has established foundation for CMMC compliance but requires focused effort on critical and high-priority gaps.';
    } else {
      return 'Organization requires significant remediation effort across multiple domains to achieve CMMC Level 2 certification readiness.';
    }
  }

  private estimateOverallRemediationTime(critical: number, high: number, medium: number): string {
    const totalWeeks = critical * 4 + high * 2 + medium * 1;
    if (totalWeeks <= 12) return '3-6 months';
    if (totalWeeks <= 24) return '6-9 months';
    if (totalWeeks <= 36) return '9-12 months';
    return '12-18 months';
  }

  private calculateLikelihood(severity: Finding['severity']): number {
    return severity === 'critical' ? 5 : severity === 'high' ? 4 : severity === 'medium' ? 3 : 2;
  }

  private calculateImpact(severity: Finding['severity']): number {
    return severity === 'critical' ? 5 : severity === 'high' ? 4 : severity === 'medium' ? 3 : 2;
  }

  private mapRiskScore(score: number): 'critical' | 'high' | 'medium' | 'low' {
    if (score >= 20) return 'critical';
    if (score >= 12) return 'high';
    if (score >= 6) return 'medium';
    return 'low';
  }

  private generateRiskCategories(findings: Finding[]): RiskCategory[] {
    const categories = [
      {
        category: 'Data Breach Risk',
        riskLevel: 'high' as const,
        description: 'Potential unauthorized access to CUI',
        potentialImpact: 'Loss of contract, regulatory penalties, reputation damage',
        likelihood: 'high' as const,
        affectedControls: findings.filter(f => f.domain.includes('Access Control')).map(f => f.controlId)
      },
      {
        category: 'Compliance Risk',
        riskLevel: 'high' as const,
        description: 'Failure to achieve CMMC certification',
        potentialImpact: 'Unable to bid on or maintain DoD contracts',
        likelihood: 'medium' as const,
        affectedControls: findings.map(f => f.controlId)
      }
    ];
    return categories;
  }

  private generateMitigationStrategy(riskLevel: string, findings: Finding[]): string {
    return 'Implement a phased remediation approach prioritizing critical and high-severity findings, establish continuous monitoring, and maintain comprehensive documentation throughout the implementation process.';
  }

  private estimateTimeToReadiness(score: number, critical: number, high: number): string {
    if (score >= 95 && critical === 0) return '1-2 months for final preparation';
    if (score >= 85 && critical === 0) return '3-6 months with focused remediation';
    if (score >= 70) return '6-12 months with comprehensive program';
    return '12-18 months with significant investment';
  }

  private estimateInvestment(critical: number, high: number, medium: number): string {
    const totalCost = critical * 30000 + high * 15000 + medium * 7500;
    if (totalCost <= 100000) return '$50,000 - $100,000';
    if (totalCost <= 250000) return '$100,000 - $250,000';
    if (totalCost <= 500000) return '$250,000 - $500,000';
    return '$500,000+';
  }

  private calculateNextStepDueDate(priority: Recommendation['priority']): Date {
    const days = priority === 'immediate' ? 30 : priority === 'short-term' ? 90 : priority === 'medium-term' ? 180 : 365;
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  }

  private generateDeliverables(rec: Recommendation): string[] {
    return [
      'Implementation documentation',
      'Configuration evidence',
      'Testing results',
      'Updated policies/procedures'
    ];
  }

  private generateSuccessCriteria(rec: Recommendation): string[] {
    return [
      'Control implemented per CMMC requirements',
      'Evidence documented and verified',
      'Staff trained on new procedures',
      'Control effectiveness validated'
    ];
  }

  private generateControlMatrixContent(findings: Finding[]): string {
    return findings.map(f => `${f.controlId}: ${f.status} (${f.severity})`).join('\n');
  }

  private generateEvidenceListContent(assessment: AssessmentData): string {
    const evidence = Object.entries(assessment.questionEvidence || {})
      .filter(([_, items]) => items && items.length > 0)
      .map(([controlId, items]) => `${controlId}: ${items.join(', ')}`)
      .join('\n');
    return evidence || 'No evidence documented';
  }

  private generateTechnicalFindingsContent(findings: Finding[]): string {
    return findings
      .filter(f => f.severity === 'critical' || f.severity === 'high')
      .map(f => `${f.id} - ${f.controlTitle}: ${f.gapDescription}`)
      .join('\n\n');
  }

  generateHTML(report: SecurityAssessmentReport): string {
    // Generate comprehensive HTML report (truncated for brevity - full implementation would be extensive)
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${report.title}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 1200px; margin: 0 auto; padding: 20px; }
    h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
    h2 { color: #1e40af; margin-top: 30px; border-bottom: 2px solid #60a5fa; padding-bottom: 8px; }
    .header { background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; padding: 30px; border-radius: 8px; margin-bottom: 30px; }
    .executive-summary { background: #eff6ff; border-left: 4px solid #2563eb; padding: 20px; margin: 20px 0; }
    .finding { border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; margin: 10px 0; }
    .finding.critical { border-left: 4px solid #dc2626; }
    .finding.high { border-left: 4px solid #ea580c; }
    .finding.medium { border-left: 4px solid #f59e0b; }
    .finding.low { border-left: 4px solid #3b82f6; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border: 1px solid #e5e7eb; }
    th { background: #2563eb; color: white; }
    .metric { display: inline-block; background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 10px; min-width: 150px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${report.title}</h1>
    <p>Generated: ${report.generatedDate.toLocaleDateString()}</p>
    <p>Assessment Date: ${report.assessmentDate.toLocaleDateString()}</p>
  </div>

  <div class="executive-summary">
    <h2>Executive Summary</h2>
    <div class="metric">
      <strong>Overall Score:</strong> ${report.executiveSummary.overallScore.toFixed(1)}%
    </div>
    <div class="metric">
      <strong>Compliance Level:</strong> ${report.executiveSummary.complianceLevel}
    </div>
    <div class="metric">
      <strong>Critical Findings:</strong> ${report.executiveSummary.criticalFindings}
    </div>
    <div class="metric">
      <strong>High Findings:</strong> ${report.executiveSummary.highFindings}
    </div>
    <p><strong>Readiness Assessment:</strong> ${report.executiveSummary.readinessAssessment}</p>
  </div>

  <h2>Findings Summary</h2>
  ${report.findings.slice(0, 10).map(f => `
    <div class="finding ${f.severity}">
      <h3>${f.id}: ${f.controlTitle}</h3>
      <p><strong>Domain:</strong> ${f.domain} | <strong>Severity:</strong> ${f.severity} | <strong>Status:</strong> ${f.status}</p>
      <p><strong>Gap:</strong> ${f.gapDescription}</p>
      <p><strong>Impact:</strong> ${f.impactAnalysis}</p>
      <p><strong>Remediation Effort:</strong> ${f.remediationEffort} | <strong>Estimated Cost:</strong> ${f.estimatedCost}</p>
    </div>
  `).join('')}

  <h2>Domain Analysis</h2>
  <table>
    <thead>
      <tr>
        <th>Domain</th>
        <th>Total Controls</th>
        <th>Compliant</th>
        <th>Partial</th>
        <th>Non-Compliant</th>
        <th>Score</th>
      </tr>
    </thead>
    <tbody>
      ${report.domainAnalysis.map(d => `
        <tr>
          <td>${d.domain}</td>
          <td>${d.totalControls}</td>
          <td>${d.compliantControls}</td>
          <td>${d.partiallyCompliantControls}</td>
          <td>${d.nonCompliantControls}</td>
          <td>${d.overallScore.toFixed(1)}%</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>Recommendations</h2>
  ${report.recommendations.slice(0, 5).map((r, i) => `
    <div class="finding">
      <h3>${r.id}: ${r.title}</h3>
      <p><strong>Priority:</strong> ${r.priority} | <strong>Category:</strong> ${r.category}</p>
      <p>${r.description}</p>
      <p><strong>Expected Benefit:</strong> ${r.expectedBenefit}</p>
    </div>
  `).join('')}

  <h2>Compliance Status</h2>
  <p><strong>Current Readiness:</strong> ${report.complianceStatus.currentReadiness.toFixed(1)}%</p>
  <p><strong>Certification Readiness:</strong> ${report.complianceStatus.certificationReadiness}</p>
  <p><strong>Estimated Time to Readiness:</strong> ${report.complianceStatus.estimatedTimeToReadiness}</p>
  <p><strong>Required Investment:</strong> ${report.complianceStatus.requiredInvestment}</p>
</body>
</html>`;
  }
}

export const securityAssessmentReportService = SecurityAssessmentReportService.getInstance();
