/**
 * Access Control Policy Template
 * Comprehensive access control policy for CMMC 2.0 compliance
 */

export interface PolicySection {
  id: string;
  title: string;
  content: string;
  subsections: PolicySubsection[];
}

export interface PolicySubsection {
  id: string;
  title: string;
  content: string;
}

export interface AccessControlPolicyTemplate {
  id: string;
  name: string;
  category: 'policy';
  type: 'access-control-policy';
  controls: string[];
  content: string;
  interactiveFields: {
    companyInfo: {
      name: { required: true; type: 'text'; placeholder: string };
      address: { required: false; type: 'text'; placeholder: string };
      contact: { required: false; type: 'email'; placeholder: string };
    };
    policyInfo: {
      effectiveDate: { required: true; type: 'date'; placeholder: string };
      reviewDate: { required: true; type: 'date'; placeholder: string };
      approver: { required: true; type: 'text'; placeholder: string };
      owner: { required: true; type: 'text'; placeholder: string };
    };
    sections: PolicySection[];
  };
  metadata: {
    version: string;
    lastUpdated: string;
    estimatedPages: number;
    complexity: 'high';
    targetAudience: string[];
  };
}

export const accessControlPolicy: AccessControlPolicyTemplate = {
  id: 'access-control-policy',
  name: 'Access Control Policy',
  category: 'policy',
  type: 'access-control-policy',
  controls: ['AC.1.001', 'AC.1.002', 'AC.1.003', 'AC.2.007', 'AC.2.008'],
  content: `# ACCESS CONTROL POLICY
## CMMC 2.0 Level 2 Compliance

**Organization:** {{companyName}}
**Effective Date:** {{effectiveDate}}
**Review Date:** {{reviewDate}}
**Version:** 1.0
**Classification:** Internal Use Only

---

## POLICY STATEMENT

{{companyName}} is committed to protecting Controlled Unclassified Information (CUI) and organizational information systems by implementing comprehensive access control measures. This policy establishes requirements for controlling access to information systems, ensuring that only authorized users, processes, and devices can access organizational resources.

**Controls Addressed:** AC.1.001, AC.1.002, AC.1.003, AC.2.007, AC.2.008

---

## SCOPE

This policy applies to:
- All information systems that process, store, or transmit CUI
- All users, including employees, contractors, and third parties
- All devices connected to organizational networks
- All applications and data repositories
- All physical and logical access points

---

## ROLES AND RESPONSIBILITIES

**Chief Information Security Officer (CISO)**
- Overall responsibility for access control policy implementation
- Approval of access control exceptions
- Regular review and update of this policy
- Incident response coordination

**Information System Security Officer (ISSO)**
- Day-to-day implementation of access control measures
- User access provisioning and deprovisioning
- Access control monitoring and reporting
- Policy compliance validation

**System Administrators**
- Technical implementation of access controls
- User account management
- System configuration and maintenance
- Security control implementation

**Users**
- Compliance with access control requirements
- Protection of authentication credentials
- Reporting of security incidents
- Regular access reviews

---

## ACCESS CONTROL REQUIREMENTS

### 1. USER ACCESS MANAGEMENT

**Account Provisioning**
- All user accounts must be approved by appropriate management
- Access requests must include business justification
- Accounts must be created with minimum necessary privileges
- Default passwords must be changed on first login
- Account creation must be logged and audited

**Account Management**
- User accounts must be reviewed quarterly
- Inactive accounts must be disabled after 90 days of inactivity
- Terminated user accounts must be disabled immediately
- Account modifications must be approved and logged
- Privileged accounts require additional approval

**Access Reviews**
- Quarterly access reviews for all user accounts
- Annual comprehensive access review
- Manager certification required for all access
- Unused access must be identified and removed
- Review results must be documented and retained

### 2. AUTHENTICATION REQUIREMENTS

**Password Requirements**
- Minimum 12 characters in length
- Must contain uppercase and lowercase letters
- Must contain numbers and special characters
- Cannot reuse last 12 passwords
- Must be changed every 90 days
- Cannot be shared or written down

**Multi-Factor Authentication (MFA)**
- Required for all privileged accounts
- Required for remote access
- Required for CUI system access
- Must use approved MFA methods
- Backup authentication methods must be available

**Session Management**
- Automatic session timeout after 30 minutes of inactivity
- Concurrent session limits enforced
- Session monitoring and logging
- Secure session handling
- Session termination procedures

### 3. AUTHORIZATION REQUIREMENTS

**Principle of Least Privilege**
- Users granted minimum necessary access
- Access reviewed regularly
- Business justification required
- Temporary access with expiration dates
- Regular privilege reviews

**Role-Based Access Control (RBAC)**
- Access based on job functions
- Predefined roles with specific permissions
- Role assignments reviewed quarterly
- Separation of duties enforced
- Privilege escalation procedures

**Access Control Lists (ACLs)**
- File and folder permissions defined
- Regular ACL reviews
- Principle of least privilege applied
- Access logging enabled
- Regular permission audits

### 4. NETWORK ACCESS CONTROL

**Remote Access**
- VPN required for remote connections
- MFA required for VPN access
- Approved devices only
- Network segmentation enforced
- Remote access monitoring

**Wireless Access**
- WPA3 encryption required
- Guest network isolation
- Wireless access monitoring
- Approved wireless devices only
- Regular security assessments

**Network Segmentation**
- CUI systems isolated from general network
- Firewall rules enforced
- Network monitoring enabled
- Regular security reviews
- Incident response procedures

---

## ACCESS CONTROL IMPLEMENTATION

### 1. TECHNICAL CONTROLS

**Identity and Access Management (IAM)**
- Centralized user management system
- Single sign-on (SSO) implementation
- Automated provisioning and deprovisioning
- Integration with HR systems
- Regular system updates

**Privileged Access Management (PAM)**
- Privileged account vault
- Session recording and monitoring
- Just-in-time access provisioning
- Regular password rotation
- Audit trail maintenance

**Network Access Control (NAC)**
- Device authentication and authorization
- Network policy enforcement
- Quarantine capabilities
- Regular compliance checks
- Integration with security systems

### 2. ADMINISTRATIVE CONTROLS

**Access Control Policies**
- Written policies and procedures
- Regular policy reviews
- Training and awareness programs
- Compliance monitoring
- Incident response procedures

**Access Control Procedures**
- Standardized access request process
- Approval workflows
- Documentation requirements
- Regular procedure updates
- Training materials

**Monitoring and Auditing**
- Access logging enabled
- Regular log reviews
- Anomaly detection
- Incident investigation
- Compliance reporting

---

## INCIDENT RESPONSE

**Access Control Incidents**
- Unauthorized access attempts
- Privilege escalation attempts
- Account compromise
- Policy violations
- System breaches

**Response Procedures**
1. Immediate containment
2. Investigation and analysis
3. Evidence preservation
4. Notification procedures
5. Recovery and remediation
6. Lessons learned

**Reporting Requirements**
- Security incidents reported within 1 hour
- Management notification within 4 hours
- Documentation within 24 hours
- Follow-up actions tracked
- Regular incident reviews

---

## COMPLIANCE AND MONITORING

**Compliance Requirements**
- CMMC 2.0 Level 2 compliance
- Regular compliance assessments
- Audit preparation and support
- Documentation maintenance
- Continuous improvement

**Monitoring and Metrics**
- Access control effectiveness
- Policy compliance rates
- Incident response times
- User satisfaction surveys
- Security posture assessments

**Audit Requirements**
- Regular internal audits
- External audit support
- Documentation requirements
- Evidence collection
- Remediation tracking

---

## POLICY MAINTENANCE

**Review Schedule**
- Annual policy review
- Quarterly procedure updates
- Incident-driven updates
- Regulatory change updates
- Technology change updates

**Approval Process**
- CISO approval required
- Legal review as needed
- Management notification
- User communication
- Implementation planning

**Version Control**
- Version numbering system
- Change tracking
- Approval documentation
- Distribution control
- Archive maintenance

---

## EXCEPTIONS AND WAIVERS

**Exception Process**
- Written justification required
- Risk assessment mandatory
- Management approval needed
- Time-limited exceptions
- Regular exception reviews

**Waiver Requirements**
- Business justification
- Risk acceptance documentation
- Compensating controls
- Regular waiver reviews
- Documentation requirements

---

## TRAINING AND AWARENESS

**Training Requirements**
- New user orientation
- Annual refresher training
- Role-specific training
- Incident response training
- Policy update training

**Awareness Programs**
- Security awareness campaigns
- Policy communication
- Best practice sharing
- Incident lessons learned
- Regular communications

---

## POLICY VIOLATIONS

**Violation Categories**
- Unauthorized access attempts
- Policy non-compliance
- Security procedure violations
- Documentation failures
- Training deficiencies

**Disciplinary Actions**
- Progressive discipline
- Training requirements
- Access restrictions
- Termination procedures
- Legal considerations

---

**Policy Approval:**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| CISO | {{ciso}} | _____________ | {{effectiveDate}} |
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
    sections: [
      {
        id: 'section-1',
        title: 'Policy Statement',
        content: 'Establishes the purpose and scope of the access control policy',
        subsections: [
          {
            id: 'subsection-1-1',
            title: 'Purpose',
            content: 'Defines the purpose of access control measures'
          },
          {
            id: 'subsection-1-2',
            title: 'Scope',
            content: 'Identifies what systems and users are covered'
          }
        ]
      },
      {
        id: 'section-2',
        title: 'Roles and Responsibilities',
        content: 'Defines who is responsible for access control implementation',
        subsections: [
          {
            id: 'subsection-2-1',
            title: 'CISO Responsibilities',
            content: 'CISO role in access control management'
          },
          {
            id: 'subsection-2-2',
            title: 'ISSO Responsibilities',
            content: 'ISSO role in day-to-day operations'
          }
        ]
      }
    ]
  },
  metadata: {
    version: '1.0',
    lastUpdated: '2025-01-07',
    estimatedPages: 25,
    complexity: 'high',
    targetAudience: ['CISO', 'ISSO', 'System Administrators', 'All Personnel', 'C3PAO Assessors']
  }
};

export function customizeAccessControlPolicy(template: AccessControlPolicyTemplate, customizations: any): string {
  let content = template.content;
  
  // Replace placeholders with customizations
  const replacements = {
    '{{companyName}}': customizations.companyName || '[Company Name]',
    '{{effectiveDate}}': customizations.effectiveDate || new Date().toLocaleDateString(),
    '{{reviewDate}}': customizations.reviewDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    '{{ciso}}': customizations.ciso || '[CISO Name]',
    '{{legal}}': customizations.legal || '[Legal Counsel]',
    '{{ceo}}': customizations.ceo || '[CEO Name]'
  };
  
  Object.entries(replacements).forEach(([placeholder, value]) => {
    content = content.replace(new RegExp(placeholder, 'g'), value);
  });
  
  return content;
}
