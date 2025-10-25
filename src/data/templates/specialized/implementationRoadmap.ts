/**
 * 26-Week Implementation Roadmap Template
 * Detailed project plan with budget estimates and milestones for CMMC 2.0 implementation
 */

export interface ImplementationTask {
  id: string;
  week: number;
  title: string;
  description: string;
  objectives: string[];
  deliverables: string[];
  dependencies: string[];
  resources: string[];
  estimatedHours: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
}

export interface BudgetItem {
  category: string;
  item: string;
  cost: number;
  justification: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface Milestone {
  id: string;
  name: string;
  week: number;
  description: string;
  deliverables: string[];
  successCriteria: string[];
  dependencies: string[];
}

export interface ImplementationRoadmapTemplate {
  id: string;
  name: string;
  category: 'specialized';
  type: 'implementation-roadmap';
  controls: string[];
  content: string;
  interactiveFields: {
    companyInfo: {
      name: { required: true; type: 'text'; placeholder: string };
      size: { required: true; type: 'select'; options: string[] };
      industry: { required: true; type: 'text'; placeholder: string };
    };
    projectInfo: {
      projectManager: { required: true; type: 'text'; placeholder: string };
      ciso: { required: true; type: 'text'; placeholder: string };
      startDate: { required: true; type: 'date'; placeholder: string };
      budget: { required: true; type: 'number'; placeholder: string };
    };
    tasks: ImplementationTask[];
    budget: BudgetItem[];
    milestones: Milestone[];
  };
  metadata: {
    version: string;
    lastUpdated: string;
    estimatedPages: number;
    complexity: 'high';
    targetAudience: string[];
  };
}

export const implementationRoadmap: ImplementationRoadmapTemplate = {
  id: '26-week-implementation-roadmap',
  name: '26-Week Implementation Roadmap',
  category: 'specialized',
  type: 'implementation-roadmap',
  controls: ['CA.2.062', 'CA.5.066', 'CM.2.061'],
  content: `# 26-WEEK CMMC 2.0 LEVEL 2 IMPLEMENTATION ROADMAP
## Comprehensive Project Plan for CMMC Certification

**Project Manager:** {{projectManager}}
**CISO:** {{ciso}}
**Start Date:** {{startDate}}
**Estimated Budget:** $50,000
**Organization:** {{companyName}}
**Organization Size:** {{companySize}}

---

## PROJECT OVERVIEW

This roadmap provides a structured 26-week approach to achieving CMMC 2.0 Level 2 certification, covering all 110 controls across 14 domains with detailed task breakdown, resource allocation, and milestone tracking.

**Controls Addressed:** CA.2.062, CA.5.066, CM.2.061

---

## WEEK 1-2: PROJECT INITIATION

**Objectives:** Establish project foundation and team

- [ ] Form CMMC implementation team
- [ ] Define roles and responsibilities
- [ ] Establish project governance
- [ ] Create project charter
- [ ] Set up project management tools
- [ ] Deliverable: Project charter and team structure

---

## WEEK 3-4: CURRENT STATE ASSESSMENT

**Objectives:** Assess existing security posture

- [ ] Conduct gap analysis
- [ ] Inventory existing controls
- [ ] Identify compliance gaps
- [ ] Assess technical infrastructure
- [ ] Review existing policies
- [ ] Deliverable: Gap analysis report

---

## WEEK 5-6: RISK ASSESSMENT

**Objectives:** Identify and prioritize risks

- [ ] Conduct comprehensive risk assessment
- [ ] Identify critical risks
- [ ] Develop risk treatment strategies
- [ ] Create risk register
- [ ] Prioritize remediation efforts
- [ ] Deliverable: Risk register and treatment plan

---

## WEEK 7-8: POLICY DEVELOPMENT

**Objectives:** Develop required policies

- [ ] Create access control policy
- [ ] Develop incident response policy
- [ ] Establish data protection policy
- [ ] Create awareness training policy
- [ ] Develop configuration management policy
- [ ] Deliverable: Complete policy suite

---

## WEEK 9-10: TECHNICAL CONTROLS IMPLEMENTATION

**Objectives:** Implement technical security controls

- [ ] Deploy endpoint detection and response (EDR)
- [ ] Implement network segmentation
- [ ] Configure firewalls and access controls
- [ ] Set up security monitoring
- [ ] Implement backup systems
- [ ] Deliverable: Technical controls operational

---

## WEEK 11-12: ACCESS MANAGEMENT

**Objectives:** Implement access control systems

- [ ] Deploy privileged access management (PAM)
- [ ] Implement multi-factor authentication
- [ ] Configure identity and access management
- [ ] Establish access review processes
- [ ] Implement account management procedures
- [ ] Deliverable: Access management system

---

## WEEK 13-14: MONITORING AND LOGGING

**Objectives:** Establish security monitoring

- [ ] Deploy security information and event management (SIEM)
- [ ] Configure log collection and analysis
- [ ] Implement security monitoring dashboards
- [ ] Establish incident detection capabilities
- [ ] Create monitoring procedures
- [ ] Deliverable: Security monitoring system

---

## WEEK 15-16: INCIDENT RESPONSE CAPABILITY

**Objectives:** Build incident response capability

- [ ] Establish incident response team
- [ ] Develop incident response procedures
- [ ] Create communication plans
- [ ] Implement incident tracking system
- [ ] Conduct tabletop exercises
- [ ] Deliverable: Incident response capability

---

## WEEK 17-18: TRAINING AND AWARENESS

**Objectives:** Implement security training program

- [ ] Develop training materials
- [ ] Conduct security awareness training
- [ ] Implement role-based training
- [ ] Create training tracking system
- [ ] Establish training metrics
- [ ] Deliverable: Training program operational

---

## WEEK 19-20: EVIDENCE COLLECTION

**Objectives:** Gather compliance evidence

- [ ] Organize evidence repository
- [ ] Collect evidence for each control
- [ ] Screenshot all configurations
- [ ] Export logs and reports
- [ ] Document all procedures
- [ ] Deliverable: Complete evidence package

---

## WEEK 21: TESTING AND VALIDATION

**Objectives:** Validate all controls

- [ ] Test sample of controls (20%)
- [ ] Conduct penetration testing
- [ ] Perform vulnerability assessment
- [ ] Review all documentation
- [ ] Fix identified issues
- [ ] Deliverable: Test results and remediation

---

## WEEK 22: SYSTEM SECURITY PLAN

**Objectives:** Complete comprehensive SSP

- [ ] Finalize all SSP sections
- [ ] Document all 110 controls
- [ ] Obtain management approval
- [ ] Create executive summary
- [ ] Prepare for C3PAO review
- [ ] Deliverable: Complete SSP (150 pages)

---

## WEEK 23: SELF-ASSESSMENT

**Objectives:** Conduct internal assessment

- [ ] Self-assess all 110 controls
- [ ] Document findings
- [ ] Create POA&M for gaps
- [ ] Prioritize remediation
- [ ] Update risk register
- [ ] Deliverable: Self-assessment report

---

## WEEK 24: C3PAO PREPARATION

**Objectives:** Prepare for formal assessment

- [ ] Organize all documentation
- [ ] Prepare evidence binder
- [ ] Brief all stakeholders
- [ ] Schedule C3PAO engagement
- [ ] Final readiness review
- [ ] Deliverable: Ready for C3PAO

---

## WEEK 25-26: FINAL REMEDIATION

**Objectives:** Address any remaining gaps

- [ ] Remediate POA&M items
- [ ] Retest controls
- [ ] Update documentation
- [ ] Final evidence review
- [ ] Executive certification
- [ ] Deliverable: 100% ready

---

## BUDGET ESTIMATE

**Technology:**
- SIEM: $50,000
- EDR: $30,000
- PAM: $25,000
- MDM: $15,000
- Backup: $20,000
- Vulnerability Scanner: $10,000
- **Subtotal Technology:** $150,000

**Services:**
- Gap Assessment: $15,000
- C3PAO Assessment: $25,000
- Penetration Testing: $15,000
- Training: $10,000
- **Subtotal Services:** $65,000

**Internal Resources:**
- Project Manager (25% x 6 months): $40,000
- ISSO (50% x 6 months): $60,000
- System Admin (25% x 6 months): $30,000
- **Subtotal Internal:** $130,000

**TOTAL ESTIMATED BUDGET:** $345,000

---

## SUCCESS METRICS

**Weekly Tracking:**
- Controls implemented (target: 4-5 per week)
- Evidence collected (target: 100% by week 20)
- Open findings (target: 0 by week 26)
- Budget burn rate

**Go/No-Go Decision Points:**
- Week 6: Assess progress, adjust plan
- Week 12: Mid-point review
- Week 18: Evidence completeness check
- Week 24: C3PAO readiness decision

---

**Project Status:** 🟢 On Track | 🟡 At Risk | 🔴 Delayed

**Next Milestone:** [Milestone Name] - [Date]
**Overall Progress:** [%]%

---

**Approved By:**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Project Sponsor | {{projectSponsor}} | _____________ | {{today}} |
| CISO | {{ciso}} | _____________ | {{today}} |
| CFO | {{cfo}} | _____________ | {{today}} |`,
  interactiveFields: {
    companyInfo: {
      name: { required: true, type: 'text', placeholder: 'Enter company name' },
      size: { required: true, type: 'select', options: ['Small (1-50)', 'Medium (51-200)', 'Large (201-1000)', 'Enterprise (1000+)'] },
      industry: { required: true, type: 'text', placeholder: 'Enter industry' }
    },
    projectInfo: {
      projectManager: { required: true, type: 'text', placeholder: 'Project Manager Name' },
      ciso: { required: true, type: 'text', placeholder: 'CISO Name' },
      startDate: { required: true, type: 'date', placeholder: 'Project Start Date' },
      budget: { required: true, type: 'number', placeholder: 'Total Budget' }
    },
    tasks: [
      {
        id: 'task-1',
        week: 1,
        title: 'Project Initiation',
        description: 'Establish project foundation and team',
        objectives: ['Form implementation team', 'Define roles', 'Establish governance'],
        deliverables: ['Project charter', 'Team structure'],
        dependencies: [],
        resources: ['Project Manager', 'CISO', 'Executive Sponsor'],
        estimatedHours: 40,
        status: 'not-started'
      },
      {
        id: 'task-2',
        week: 3,
        title: 'Current State Assessment',
        description: 'Assess existing security posture',
        objectives: ['Conduct gap analysis', 'Inventory controls', 'Identify gaps'],
        deliverables: ['Gap analysis report'],
        dependencies: ['task-1'],
        resources: ['Security Team', 'IT Team'],
        estimatedHours: 60,
        status: 'not-started'
      }
    ],
    budget: [
      {
        category: 'Technology',
        item: 'SIEM',
        cost: 50000,
        justification: 'Security monitoring and incident detection',
        priority: 'critical'
      },
      {
        category: 'Technology',
        item: 'EDR',
        cost: 30000,
        justification: 'Endpoint protection and response',
        priority: 'critical'
      },
      {
        category: 'Services',
        item: 'C3PAO Assessment',
        cost: 25000,
        justification: 'Required third-party assessment',
        priority: 'critical'
      }
    ],
    milestones: [
      {
        id: 'milestone-1',
        name: 'Project Initiation Complete',
        week: 2,
        description: 'Project team formed and governance established',
        deliverables: ['Project charter', 'Team structure', 'Governance framework'],
        successCriteria: ['All team members assigned', 'Roles defined', 'Charter approved'],
        dependencies: []
      },
      {
        id: 'milestone-2',
        name: 'Gap Analysis Complete',
        week: 4,
        description: 'Current state assessment completed',
        deliverables: ['Gap analysis report', 'Control inventory', 'Risk assessment'],
        successCriteria: ['All controls assessed', 'Gaps identified', 'Priorities set'],
        dependencies: ['milestone-1']
      }
    ]
  },
  metadata: {
    version: '1.0',
    lastUpdated: '2025-01-07',
    estimatedPages: 15,
    complexity: 'high',
    targetAudience: ['Project Managers', 'CISO', 'Executive Leadership', 'Implementation Teams']
  }
};

export function customizeImplementationRoadmap(template: ImplementationRoadmapTemplate, customizations: any): string {
  let content = template.content;
  
  // Replace placeholders with customizations
  const replacements = {
    '{{today}}': new Date().toLocaleDateString(),
    '{{projectManager}}': customizations.projectManager || '[Project Manager Name]',
    '{{ciso}}': customizations.ciso || '[CISO Name]',
    '{{startDate}}': customizations.startDate || '[Start Date]',
    '{{budget}}': customizations.budget || '345000',
    '{{companyName}}': customizations.companyName || '[Company Name]',
    '{{companySize}}': customizations.companySize || '[Company Size]',
    '{{projectSponsor}}': customizations.projectSponsor || '[Project Sponsor]',
    '{{cfo}}': customizations.cfo || '[CFO Name]'
  };
  
  Object.entries(replacements).forEach(([placeholder, value]) => {
    content = content.replace(new RegExp(placeholder, 'g'), value);
  });
  
  return content;
}
