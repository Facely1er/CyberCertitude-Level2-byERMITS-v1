/**
 * System Security Plan (SSP) Template
 * Comprehensive System Security Plan for CMMC 2.0 Level 2 compliance
 */

export interface SystemSecurityPlanTemplate {
  id: string;
  name: string;
  category: 'policy';
  type: 'system-security-plan';
  controls: string[];
  content: string;
  interactiveFields: {
    companyInfo: {
      name: { required: boolean; type: string; placeholder: string };
      address: { required: boolean; type: string; placeholder: string };
      contact: { required: boolean; type: string; placeholder: string };
    };
    policyInfo: {
      effectiveDate: { required: boolean; type: string; placeholder: string };
      reviewDate: { required: boolean; type: string; placeholder: string };
      approver: { required: boolean; type: string; placeholder: string };
      owner: { required: boolean; type: string; placeholder: string };
    };
    sections: any[];
  };
  metadata: {
    version: string;
    lastUpdated: string;
    estimatedPages: number;
    complexity: string;
    targetAudience: string[];
  };
}

export const systemSecurityPlan: SystemSecurityPlanTemplate = {
  id: 'system-security-plan',
  name: 'System Security Plan (SSP)',
  category: 'policy',
  type: 'system-security-plan',
  controls: ['All CMMC 2.0 Level 2 Controls'],
  content: `# SYSTEM SECURITY PLAN (SSP)
## CMMC 2.0 Level 2 Compliance

**Organization:** {{companyName}}
**System Name:** {{systemName}}
**Effective Date:** {{effectiveDate}}
**Classification:** Internal Use Only

---

## EXECUTIVE SUMMARY

This System Security Plan (SSP) provides a comprehensive description of the security controls implemented to protect Controlled Unclassified Information (CUI) processed by {{companyName}} information systems. This SSP addresses all 110 CMMC 2.0 Level 2 security controls across 14 control families.

**System Scope:** {{systemDescription}}

---

## SYSTEM DESCRIPTION

### 1. SYSTEM OVERVIEW

**System Purpose:** {{systemPurpose}}

**System Boundaries:** {{systemBoundaries}}

**System Components:**
- Servers and workstations
- Network infrastructure
- Security controls
- Applications and databases
- Cloud services and virtualization

**CUI Information Types:** {{cuiTypes}}

### 2. AUTHORIZATION INFORMATION

**Authorizing Official:** {{authorizingOfficial}}
**Authorization Date:** {{effectiveDate}}
**Authorization Expiration:** {{reviewDate}}

---

## SECURITY CONTROL IMPLEMENTATION

### Access Control (AC)
**Implementation:** Access controls implemented via Active Directory, role-based access control, and MFA.
**Evidence:** Access control policies, user accounts, MFA configuration.

### Awareness and Training (AT)
**Implementation:** Annual security training, role-based training, and monthly awareness activities.
**Evidence:** Training records, awareness materials, completion certificates.

### Audit and Accountability (AU)
**Implementation:** Centralized logging, SIEM monitoring, and regular log reviews.
**Evidence:** Audit logs, review reports, SIEM configuration.

### Configuration Management (CM)
**Implementation:** Baseline configurations, change control board, and configuration scanning.
**Evidence:** Baselines, change logs, scan reports.

### Identification and Authentication (IA)
**Implementation:** Multi-factor authentication, strong password requirements, and SSO.
**Evidence:** MFA configuration, password policy, authentication logs.

### Incident Response (IR)
**Implementation:** Incident response team, documented procedures, and tabletop exercises.
**Evidence:** Incident response plan, team charter, exercise reports.

### Maintenance (MA)
**Implementation:** Maintenance procedures, vendor maintenance, and approved tools.
**Evidence:** Maintenance logs, vendor agreements, tool documentation.

### Media Protection (MP)
**Implementation:** Media marking, encrypted media, and secure destruction procedures.
**Evidence:** Media inventory, encryption configuration, destruction certificates.

### Personnel Security (PS)
**Implementation:** Background screening, role-based access, and termination procedures.
**Evidence:** Screening records, access approvals, termination checklists.

### Physical Protection (PE)
**Implementation:** Access badges, video surveillance, and environmental controls.
**Evidence:** Badge logs, video recordings, environmental monitoring.

### Risk Assessment (RA)
**Implementation:** Annual risk assessments and ongoing risk monitoring.
**Evidence:** Risk assessments, risk register, treatment plans.

### Security Assessment (CA)
**Implementation:** Annual security assessments and continuous monitoring.
**Evidence:** Assessment reports, POAM, remediation tracking.

### System and Communications Protection (SC)
**Implementation:** Network segmentation, firewalls, encryption, and VPN.
**Evidence:** Network diagrams, firewall rules, encryption configuration.

### System and Information Integrity (SI)
**Implementation:** File integrity monitoring, malware protection, and patch management.
**Evidence:** FIM logs, antivirus configuration, patch records.

---

## CONTROL CONTENT DESCRIPTION

{{controlNarratives}}

---

## SECURITY ASSESSMENT PLAN

### Assessment Frequency
- Annual comprehensive assessments
- Quarterly security reviews
- Continuous monitoring
- Incident-driven assessments

### Assessment Scope
- All CMMC Level 2 controls
- Physical security
- Personnel security
- Technical controls
- Operational procedures

---

## POLICY APPROVAL

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Authorizing Official | {{approver}} | _____________ | {{effectiveDate}} |
| System Owner | {{owner}} | _____________ | {{effectiveDate}} |
| CISO | {{ciso}} | _____________ | {{effectiveDate}} |

---

**Document Control:**
- Version: 1.0
- Effective Date: {{effectiveDate}}
- Next Review: {{reviewDate}}
- Classification: Internal Use Only
- Distribution: Authorized Personnel Only`,
  interactiveFields: {
    companyInfo: {
      name: { required: true, type: 'text', placeholder: 'Enter company name' },
      address: { required: false, type: 'text', placeholder: 'Enter company address' },
      contact: { required: false, type: 'email', placeholder: 'contact@company.com' }
    },
    policyInfo: {
      effectiveDate: { required: true, type: 'date', placeholder: 'Policy Effective Date' },
      reviewDate: { required: true, type: 'date', placeholder: 'Next Review Date' },
      approver: { required: true, type: 'text', placeholder: 'Policy Approver' },
      owner: { required: true, type: 'text', placeholder: 'Policy Owner' }
    },
    sections: []
  },
  metadata: {
    version: '1.0',
    lastUpdated: '2025-01-07',
    estimatedPages: 45,
    complexity: 'high',
    targetAudience: ['Authorizing Official', 'CISO', 'System Owner', 'C3PAO Assessors']
  }
};
