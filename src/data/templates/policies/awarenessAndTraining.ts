/**
 * Awareness and Training Policy Template
 * Comprehensive security awareness and training policy for CMMC 2.0 compliance
 */

export interface AwarenessAndTrainingPolicyTemplate {
  id: string;
  name: string;
  category: 'policy';
  type: 'awareness-training-policy';
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

export const awarenessAndTrainingPolicy: AwarenessAndTrainingPolicyTemplate = {
  id: 'awareness-training-policy',
  name: 'Awareness and Training Policy',
  category: 'policy',
  type: 'awareness-training-policy',
  controls: ['AT.2.056', 'AT.2.057'],
  content: `# AWARENESS AND TRAINING POLICY
## CMMC 2.0 Level 2 Compliance

**Organization:** {{companyName}}
**Effective Date:** {{effectiveDate}}
**Review Date:** {{reviewDate}}
**Version:** 1.0
**Classification:** Internal Use Only

---

## POLICY STATEMENT

{{companyName}} is committed to protecting Controlled Unclassified Information (CUI) through comprehensive security awareness and training programs. This policy establishes requirements for security awareness training, role-based training, and ongoing security education to ensure all personnel understand their responsibilities and the security measures protecting organizational information systems.

**Controls Addressed:** AT.2.056, AT.2.057

---

## SCOPE

This policy applies to:
- All employees and contractors
- All personnel with access to CUI systems
- Management and executive personnel
- IT staff and system administrators
- Security personnel
- Third-party contractors and vendors

---

## ROLES AND RESPONSIBILITIES

**Chief Information Security Officer (CISO)**
- Overall responsibility for awareness and training program
- Approval of training content and materials
- Program effectiveness evaluation
- Budget allocation for security training

**Security Training Manager**
- Day-to-day program management
- Training material development and updates
- Training delivery coordination
- Training records maintenance
- Compliance tracking and reporting

**Department Managers**
- Ensure staff complete required training
- Promote security awareness in daily operations
- Identify role-specific training needs
- Provide resources for training activities

**Employees and Contractors**
- Complete all required security training
- Participate in awareness activities
- Report security concerns and incidents
- Apply security knowledge in daily work
- Stay current on security procedures

---

## TRAINING REQUIREMENTS

### 1. INITIAL SECURITY TRAINING

**New Employee Orientation**
- Security awareness basics during orientation
- Acceptable use policy training
- Password and authentication requirements
- Incident reporting procedures
- Physical security requirements
- Email and internet security
- Data handling procedures

**Training Completion Requirements**
- Must complete before system access
- Timeframe: within 30 days of hire
- Documentation and attestation required
- Knowledge verification assessment
- Records maintained in HR system

### 2. ANNUAL SECURITY TRAINING

**Comprehensive Security Training**
- Annual refresher training for all personnel
- Updated content on current threats
- Policy and procedure changes
- New security tools and technologies
- Lessons learned from security incidents
- Compliance requirements updates

**Training Delivery Methods**
- Online training modules
- In-person classroom sessions
- Webinar presentations
- Video-based training
- Interactive simulations
- Hands-on workshops

### 3. ROLE-BASED TRAINING

**System Administrators**
- Advanced security controls
- System hardening procedures
- Secure configuration management
- Vulnerability management
- Incident response procedures
- Security tool administration

**Security Personnel**
- Security operations procedures
- Threat intelligence and analysis
- Advanced incident response
- Security assessment techniques
- Security architecture and design
- Compliance requirements

**Developers and Programmers**
- Secure coding practices
- Application security testing
- Vulnerability remediation
- Secure SDLC requirements
- Static and dynamic analysis
- Security code review

**Management Personnel**
- Security risk management
- Compliance requirements
- Security governance
- Incident response leadership
- Security reporting
- Budget and resource allocation

### 4. CONTINUOUS AWARENESS

**Monthly Awareness Activities**
- Security awareness newsletters
- Threat briefings
- Phishing simulation exercises
- Security tips and best practices
- Incident case studies
- Recognition for security excellence

**Quarterly Activities**
- Security awareness campaigns
- Poster and signage updates
- Department security briefings
- Management updates
- Metrics and statistics sharing
- Open forums and Q&A sessions

---

## TRAINING CONTENT

### 1. SECURITY AWARENESS TOPICS

**Basic Security Concepts**
- CUI identification and handling
- Classified information vs. CUI
- Marking and labeling requirements
- Secure storage and transmission
- Proper disposal procedures
- Social engineering awareness

**Threat Landscape**
- Current threat landscape
- Common attack vectors
- Malware and ransomware
- Phishing and spear-phishing
- Insider threats
- Advanced persistent threats

**Security Controls**
- Access controls and authentication
- Password security
- Multi-factor authentication
- Encryption basics
- Network security
- Physical security

### 2. COMPLIANCE TOPICS

**CMMC Requirements**
- CMMC 2.0 Level 2 overview
- Personal responsibilities
- Compliance requirements
- Audit and assessment process
- Certification maintenance
- Continuous monitoring

**NIST SP 800-171 Requirements**
- Security control families
- Control implementation
- Assessment procedures
- Evidence requirements
- Continuous improvement
- Framework alignment

### 3. PROCEDURAL TOPICS

**Incident Response**
- How to recognize security incidents
- Incident reporting procedures
- First responder actions
- Evidence preservation
- Containment procedures
- Communication protocols

**Business Continuity**
- Disaster recovery procedures
- Emergency response plans
- Alternate work locations
- Backup and restoration
- Communication during emergencies
- Recovery testing

---

## TRAINING DELIVERY

### 1. DELIVERY METHODS

**Online Training**
- Learning management system
- Self-paced modules
- Interactive content
- Progress tracking
- Completion certificates
- Accessibility compliance

**In-Person Training**
- Classroom sessions
- Hands-on workshops
- Vendor training events
- Conference attendance
- Tabletop exercises
- Red team exercises

**Virtual Training**
- Webinar presentations
- Video conferences
- Remote desktop sessions
- Online collaboration tools
- Recorded sessions
- Interactive Q&A

### 2. TRAINING DEVELOPMENT

**Content Development**
- Subject matter expert input
- Current threat intelligence
- Industry best practices
- Organizational requirements
- Adult learning principles
- Accessibility standards

**Content Updates**
- Quarterly content reviews
- Annual comprehensive updates
- Incident-driven updates
- Regulatory change updates
- Technology change updates
- Continuous improvement

### 3. TRAINING RECORDS

**Record Management**
- Training completion tracking
- Attendance records
- Assessment scores
- Certificates and credentials
- Training history
- Audit trail maintenance

**Reporting**
- Completion rates by department
- Training effectiveness metrics
- Compliance status reports
- Trend analysis
- Management dashboards
- Audit support

---

## POLICY VIOLATIONS AND ENFORCEMENT

**Training Compliance**
- Mandatory training requirement
- Completion deadlines enforced
- Access suspension for non-compliance
- Manager notification
- Progressive discipline
- Training completion verification

**Consequences**
- Temporary access restrictions
- Required remediation training
- Performance evaluation impact
- Written warnings
- Corrective action plans
- Termination for repeated violations

---

## POLICY APPROVAL

| Role | Name | Signature | Date |
|------|------|-----------|------|
| CISO | {{approver}} | _____________ | {{effectiveDate}} |
| HR Director | {{hr}} | _____________ | {{effectiveDate}} |
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
    estimatedPages: 18,
    complexity: 'medium',
    targetAudience: ['All Personnel', 'CISO', 'HR', 'Department Managers', 'Security Training Manager']
  }
};
