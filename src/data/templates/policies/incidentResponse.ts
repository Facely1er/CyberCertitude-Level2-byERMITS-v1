/**
 * Incident Response Policy Template
 * Comprehensive incident response policy for CMMC 2.0 compliance
 */

export interface IncidentResponsePolicyTemplate {
  id: string;
  name: string;
  category: 'policy';
  type: 'incident-response-policy';
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

export const incidentResponsePolicy: IncidentResponsePolicyTemplate = {
  id: 'incident-response-policy',
  name: 'Incident Response Policy',
  category: 'policy',
  type: 'incident-response-policy',
  controls: ['IR.1.094', 'IR.2.095', 'IR.2.096'],
  content: `# INCIDENT RESPONSE POLICY
## CMMC 2.0 Level 2 Compliance

**Organization:** {{companyName}}
**Effective Date:** {{effectiveDate}}
**Review Date:** {{reviewDate}}
**Version:** 1.0
**Classification:** Internal Use Only

---

## POLICY STATEMENT

{{companyName}} is committed to protecting Controlled Unclassified Information (CUI) and organizational assets by establishing a comprehensive incident response capability. This policy establishes requirements for detecting, analyzing, containing, eradicating, and recovering from cybersecurity incidents.

**Controls Addressed:** IR.1.094, IR.2.095, IR.2.096

---

## SCOPE

This policy applies to:
- All cybersecurity incidents affecting CUI systems
- All information security incidents
- All personnel and departments
- All information systems and networks
- External third-party incidents
- Supply chain security incidents

---

## ROLES AND RESPONSIBILITIES

**Chief Information Security Officer (CISO)**
- Overall incident response authority
- Major incident declaration
- External reporting coordination
- Management communication
- Strategic response decisions

**Incident Response Team (IRT)**
- Incident detection and analysis
- Incident containment and eradication
- Evidence collection and preservation
- Recovery and lessons learned
- Documentation and reporting

**System Administrators**
- Technical incident support
- System remediation
- Evidence collection assistance
- System restoration
- System monitoring

**All Personnel**
- Report suspected incidents immediately
- Preserve potential evidence
- Follow incident response procedures
- Cooperate with IRT
- Participate in post-incident reviews

---

## INCIDENT CLASSIFICATION

### 1. INCIDENT CATEGORIES

**Unauthorized Access**
- Successful unauthorized access
- Failed unauthorized access attempts
- Account compromise
- Privilege escalation
- Unauthorized system changes

**Malware**
- Virus infections
- Ransomware incidents
- Trojan horses
- Rootkits and backdoors
- Advanced persistent threats

**Data Breach**
- Unauthorized data access
- Data exfiltration
- Data corruption or loss
- Unauthorized data modification
- CUI exposure

**Denial of Service**
- System unavailability
- Service interruption
- Resource exhaustion
- Network flooding
- Application crashes

**Policy Violations**
- Acceptable use violations
- Security procedure violations
- Access control violations
- Data handling violations
- Configuration violations

### 2. INCIDENT SEVERITY LEVELS

**Critical (Level 1)**
- Data breach with CUI exposure
- Ransomware affecting production
- Complete system compromise
- Nation-state actor involvement
- Immediate CISO involvement required

**High (Level 2)**
- Significant system impact
- Potential CUI exposure
- Privileged account compromise
- Advanced malware presence
- Requires IRT activation

**Medium (Level 3)**
- Limited system impact
- No confirmed CUI exposure
- Isolated malware incidents
- Policy violations
- ISSO manages with IRT support

**Low (Level 4)**
- Minimal system impact
- Single endpoint affected
- No CUI exposure risk
- Standard remediation
- Routine handling

---

## INCIDENT RESPONSE PHASES

### 1. PREPARATION

**Organizational Preparation**
- IRT established and trained
- Incident response plan documented
- Contact information current
- Tools and resources available
- Communication channels established
- Legal and law enforcement contacts

**Technical Preparation**
- Monitoring and logging enabled
- Backup and recovery procedures
- Forensic capabilities available
- Isolation capabilities ready
- Documentation templates prepared
- Training completed

### 2. DETECTION AND ANALYSIS

**Incident Detection**
- Automated detection systems
- User reports
- Security monitoring alerts
- Log analysis
- Vulnerability assessments
- Threat intelligence

**Incident Analysis**
- Timeline development
- Impact assessment
- Scope determination
- Root cause analysis
- Threat intelligence correlation
- Attribution analysis

### 3. CONTAINMENT

**Short-Term Containment**
- Immediate isolation
- Disconnect affected systems
- Preserve evidence
- Block malicious communications
- Initial assessment
- Notification procedures

**Long-Term Containment**
- System isolation
- Access restrictions
- Network segmentation
- System hardening
- Monitoring enhancement
- Recovery planning

### 4. ERADICATION

**Malware Removal**
- Complete malware removal
- System disinfection
- Backdoor elimination
- System hardening
- Configuration updates
- Patch application

**System Remediation**
- Vulnerability remediation
- Configuration changes
- Access control updates
- Security control enhancement
- Documentation updates
- Testing and validation

### 5. RECOVERY

**System Restoration**
- From clean backups
- System testing
- Security validation
- Performance verification
- Functionality confirmation
- Monitoring enhanced

**Service Restoration**
- Gradual service restoration
- Monitoring for recurrence
- User communication
- Status reporting
- Documentation
- Lessons learned

### 6. POST-INCIDENT ACTIVITY

**Lessons Learned**
- Post-incident review meeting
- Incident timeline review
- Response effectiveness evaluation
- Process improvement identification
- Training needs assessment
- Documentation compilation

**Documentation**
- Incident report completion
- Evidence archiving
- Timeline documentation
- Lessons learned documented
- Process improvements
- Recommendations for management

---

## INCIDENT COMMUNICATION

### 1. INTERNAL COMMUNICATION

**Immediate Communication**
- IRT notification within 1 hour
- Management notification within 4 hours
- Stakeholder notification as appropriate
- Status updates every 24 hours
- Regular management briefings
- User notifications as needed

**Communication Content**
- Incident description
- Impact assessment
- Containment status
- Expected resolution time
- User actions required
- Contact information

### 2. EXTERNAL COMMUNICATION

**Regulatory Reporting**
- Notification requirements assessment
- Regulatory notification timelines
- Required notifications submitted
- Follow-up information provided
- Documentation maintained
- Compliance verification

**Law Enforcement**
- Law enforcement notification when appropriate
- FBI/Secret Service coordination
- Evidence preservation for legal proceedings
- Legal counsel involvement
- Documentation for prosecution
- Witness protection

---

## EVIDENCE COLLECTION AND PRESERVATION

**Evidence Requirements**
- Chain of custody documentation
- Log collection
- Memory capture
- Disk imaging
- Network traffic capture
- Application logs
- User activity logs

**Preservation Procedures**
- Secure evidence storage
- Access controls on evidence
- Documentation requirements
- Integrity verification
- Legal admissibility
- Long-term retention

---

## POLICY APPROVAL

| Role | Name | Signature | Date |
|------|------|-----------|------|
| CISO | {{approver}} | _____________ | {{effectiveDate}} |
| Legal Counsel | {{legal}} | _____________ | {{effectiveDate}} |
| CEO | {{ceo}} | _____________ | {{effectiveDate}} |

---

**Document Control:**
- Version: 1.0
- Effective Date: {{effectiveDate}}
- Next Review: {{reviewDate}}
- Classification: Internal Use Only
- Distribution: All Personnel`,
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
    estimatedPages: 22,
    complexity: 'high',
    targetAudience: ['CISO', 'IRT', 'All Personnel', 'Management', 'Legal Counsel']
  }
};
