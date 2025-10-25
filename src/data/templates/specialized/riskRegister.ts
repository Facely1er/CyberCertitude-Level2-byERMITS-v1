/**
 * CMMC Risk Register Template
 * Comprehensive risk tracking and management for CMMC 2.0 compliance
 */

export interface RiskItem {
  id: string;
  description: string;
  category: 'Technical' | 'Operational' | 'Compliance' | 'Third-Party' | 'Physical' | 'Personnel';
  likelihood: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';
  impact: 'Low' | 'Medium' | 'High' | 'Critical';
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  treatment: 'Mitigate' | 'Transfer' | 'Accept' | 'Avoid';
  owner: string;
  status: 'Open' | 'In Progress' | 'Closed';
  reviewDate: string;
  currentControls: string[];
  additionalControls: string[];
  cost: number;
  timeline: string;
  residualRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface RiskScoringMatrix {
  likelihood: {
    'Very Low': number;
    'Low': number;
    'Medium': number;
    'High': number;
    'Very High': number;
  };
  impact: {
    'Low': string;
    'Medium': string;
    'High': string;
    'Critical': string;
  };
  riskScore: {
    'LOW': string;
    'MEDIUM': string;
    'HIGH': string;
    'CRITICAL': string;
  };
}

export interface RiskRegisterTemplate {
  id: string;
  name: string;
  category: 'specialized';
  type: 'risk-register';
  controls: string[];
  content: string;
  interactiveFields: {
    companyInfo: {
      name: { required: true; type: 'text'; placeholder: string };
      address: { required: false; type: 'text'; placeholder: string };
      contact: { required: false; type: 'email'; placeholder: string };
    };
    riskManagement: {
      riskManager: { required: true; type: 'text'; placeholder: string };
      ciso: { required: true; type: 'text'; placeholder: string };
      reviewFrequency: { required: true; type: 'select'; options: string[] };
    };
    risks: RiskItem[];
    scoringMatrix: RiskScoringMatrix;
  };
  metadata: {
    version: string;
    lastUpdated: string;
    estimatedPages: number;
    complexity: 'high';
    targetAudience: string[];
  };
}

export const cmmcRiskRegister: RiskRegisterTemplate = {
  id: 'cmmc-risk-register',
  name: 'CMMC Risk Register',
  category: 'specialized',
  type: 'risk-register',
  controls: ['RA.2.141', 'RA.2.142'],
  content: `# CMMC RISK REGISTER
## Comprehensive Risk Tracking

**Document Owner:** Risk Management Lead / CISO
**Last Updated:** {{today}}
**Version:** 1.0

---

## RISK REGISTER OVERVIEW

This risk register tracks all identified cybersecurity risks related to CMMC compliance, their assessment, treatment, and ongoing monitoring.

**Controls Addressed:** RA.2.141, RA.2.142

---

## RISK IDENTIFICATION

**Risk Categories:**
1. Technical Risks
2. Operational Risks
3. Compliance Risks
4. Third-Party Risks
5. Physical Risks
6. Personnel Risks

---

## RISK REGISTER

| Risk ID | Risk Description | Category | Likelihood | Impact | Risk Score | Treatment | Owner | Status | Review Date |
|---------|------------------|----------|------------|--------|------------|-----------|-------|--------|-------------|
| RISK-001 | Ransomware attack on CUI systems | Technical | Medium | Critical | HIGH | Mitigate | IT Director | Open | {{nextReview}} |
| RISK-002 | Insider threat data exfiltration | Personnel | Low | High | MEDIUM | Mitigate | CISO | Open | {{nextReview}} |
| RISK-003 | Unpatched vulnerabilities in servers | Technical | High | High | CRITICAL | Mitigate | Sys Admin | Open | {{today}} |
| RISK-004 | Third-party vendor data breach | Third-Party | Medium | High | HIGH | Transfer | Procurement | Open | {{nextReview}} |
| RISK-005 | Phishing attack compromising credentials | Technical | High | Medium | HIGH | Mitigate | Security Team | Open | {{nextReview}} |
| RISK-006 | Physical breach of data center | Physical | Low | High | MEDIUM | Mitigate | Facilities | Open | {{nextReview}} |
| RISK-007 | Inadequate backup coverage | Operational | Medium | Critical | HIGH | Mitigate | IT Director | Closed | [Past Date] |
| RISK-008 | Non-compliant CMMC controls | Compliance | Medium | Critical | HIGH | Mitigate | CISO | In Progress | {{today}} |

---

## RISK SCORING MATRIX

**Likelihood:**
- Very Low: <10%
- Low: 10-30%
- Medium: 30-60%
- High: 60-80%
- Very High: >80%

**Impact:**
- Low: Minor disruption, <$10K
- Medium: Moderate disruption, $10K-$100K
- High: Significant disruption, $100K-$1M, CUI potentially compromised
- Critical: Mission failure, >$1M, confirmed CUI breach

**Risk Score = Likelihood × Impact**
- LOW: Score 1-4
- MEDIUM: Score 5-9
- HIGH: Score 10-16
- CRITICAL: Score 17-25

---

## RISK TREATMENT STRATEGIES

**For Each Risk:**

**RISK-001: Ransomware Attack**
- Current Controls:
  - EDR on all endpoints
  - Email filtering and scanning
  - Daily backups
  - User awareness training
- Additional Controls Needed:
  - Anti-ransomware specific tools
  - Network segmentation improvement
  - Enhanced monitoring
- Cost: $50,000
- Timeline: 90 days
- Residual Risk: MEDIUM

**RISK-003: Unpatched Vulnerabilities**
- Current Controls:
  - Monthly patching cycle
  - Vulnerability scanning
- Gaps:
  - Patches delayed due to change control
  - Some systems can't be patched (legacy)
- Treatment Plan:
  - Implement emergency patching process
  - Isolate legacy systems
  - Virtual patching via IPS
- Cost: $20,000
- Timeline: 30 days
- Residual Risk: LOW

[Continue for all risks...]

---

## RISK MONITORING

**Review Frequency:**
- Critical/High Risks: Monthly
- Medium Risks: Quarterly
- Low Risks: Semi-annually
- New Risks: As identified

**Risk Reporting:**
- Monthly risk dashboard to leadership
- Quarterly risk committee meeting
- Annual comprehensive risk assessment
- Board presentation: Annually

---

**Next Risk Assessment:** {{nextReview}}
**Responsible:** CISO / Risk Management Team`,
  interactiveFields: {
    companyInfo: {
      name: { required: true, type: 'text', placeholder: 'Enter company name' },
      address: { required: false, type: 'text', placeholder: 'Enter company address' },
      contact: { required: false, type: 'email', placeholder: 'contact@company.com' }
    },
    riskManagement: {
      riskManager: { required: true, type: 'text', placeholder: 'Risk Management Lead' },
      ciso: { required: true, type: 'text', placeholder: 'CISO Name' },
      reviewFrequency: { required: true, type: 'select', options: ['Monthly', 'Quarterly', 'Semi-annually', 'Annually'] }
    },
    risks: [
      {
        id: 'RISK-001',
        description: 'Ransomware attack on CUI systems',
        category: 'Technical',
        likelihood: 'Medium',
        impact: 'Critical',
        riskScore: 'HIGH',
        treatment: 'Mitigate',
        owner: 'IT Director',
        status: 'Open',
        reviewDate: '2025-04-07',
        currentControls: ['EDR on all endpoints', 'Email filtering and scanning', 'Daily backups', 'User awareness training'],
        additionalControls: ['Anti-ransomware specific tools', 'Network segmentation improvement', 'Enhanced monitoring'],
        cost: 50000,
        timeline: '90 days',
        residualRisk: 'MEDIUM'
      },
      {
        id: 'RISK-002',
        description: 'Insider threat data exfiltration',
        category: 'Personnel',
        likelihood: 'Low',
        impact: 'High',
        riskScore: 'MEDIUM',
        treatment: 'Mitigate',
        owner: 'CISO',
        status: 'Open',
        reviewDate: '2025-04-07',
        currentControls: ['Background checks', 'Access controls', 'Monitoring'],
        additionalControls: ['Enhanced monitoring', 'Behavioral analytics', 'Regular access reviews'],
        cost: 25000,
        timeline: '60 days',
        residualRisk: 'LOW'
      },
      {
        id: 'RISK-003',
        description: 'Unpatched vulnerabilities in servers',
        category: 'Technical',
        likelihood: 'High',
        impact: 'High',
        riskScore: 'CRITICAL',
        treatment: 'Mitigate',
        owner: 'Sys Admin',
        status: 'Open',
        reviewDate: '2025-01-07',
        currentControls: ['Monthly patching cycle', 'Vulnerability scanning'],
        additionalControls: ['Emergency patching process', 'Legacy system isolation', 'Virtual patching'],
        cost: 20000,
        timeline: '30 days',
        residualRisk: 'LOW'
      }
    ],
    scoringMatrix: {
      likelihood: {
        'Very Low': 1,
        'Low': 2,
        'Medium': 3,
        'High': 4,
        'Very High': 5
      },
      impact: {
        'Low': 'Minor disruption, <$10K',
        'Medium': 'Moderate disruption, $10K-$100K',
        'High': 'Significant disruption, $100K-$1M, CUI potentially compromised',
        'Critical': 'Mission failure, >$1M, confirmed CUI breach'
      },
      riskScore: {
        'LOW': 'Score 1-4',
        'MEDIUM': 'Score 5-9',
        'HIGH': 'Score 10-16',
        'CRITICAL': 'Score 17-25'
      }
    }
  },
  metadata: {
    version: '1.0',
    lastUpdated: '2025-01-07',
    estimatedPages: 12,
    complexity: 'high',
    targetAudience: ['CISO', 'Risk Management Team', 'Executive Leadership', 'C3PAO Assessors']
  }
};

export function customizeRiskRegister(template: RiskRegisterTemplate, customizations: any): string {
  let content = template.content;
  
  // Replace placeholders with customizations
  const replacements = {
    '{{today}}': new Date().toLocaleDateString(),
    '{{nextReview}}': new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    '{{riskManager}}': customizations.riskManager || '[Risk Management Lead]',
    '{{ciso}}': customizations.ciso || '[CISO Name]',
    '{{companyName}}': customizations.companyName || '[Company Name]'
  };
  
  Object.entries(replacements).forEach(([placeholder, value]) => {
    content = content.replace(new RegExp(placeholder, 'g'), value);
  });
  
  return content;
}
