/**
 * Configuration Management Policy Template
 * Comprehensive configuration management policy for CMMC 2.0 compliance
 */

export interface ConfigurationManagementPolicyTemplate {
  id: string;
  name: string;
  category: 'policy';
  type: 'configuration-management-policy';
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

export const configurationManagementPolicy: ConfigurationManagementPolicyTemplate = {
  id: 'configuration-management-policy',
  name: 'Configuration Management Policy',
  category: 'policy',
  type: 'configuration-management-policy',
  controls: ['CM.2.061', 'CM.2.062'],
  content: `# CONFIGURATION MANAGEMENT POLICY
## CMMC 2.0 Level 2 Compliance

**Organization:** {{companyName}}
**Effective Date:** {{effectiveDate}}
**Review Date:** {{reviewDate}}
**Version:** 1.0
**Classification:** Internal Use Only

---

## POLICY STATEMENT

{{companyName}} is committed to maintaining secure and compliant configurations for all information systems processing Controlled Unclassified Information (CUI). This policy establishes requirements for baseline configurations, change management, configuration control, and security configuration management.

**Controls Addressed:** CM.2.061, CM.2.062

---

## SCOPE

This policy applies to:
- All information systems processing CUI
- Hardware and software components
- Network devices and infrastructure
- Security controls and tools
- Cloud and virtualized systems
- Mobile devices and endpoints

---

## ROLES AND RESPONSIBILITIES

**Chief Information Security Officer (CISO)**
- Overall responsibility for configuration management
- Approval of baseline configurations
- Security configuration standards
- Policy compliance oversight

**Change Control Board (CCB)**
- Review and approve configuration changes
- Risk assessment of proposed changes
- Prioritization of change requests
- Emergency change authorization

**System Administrators**
- Baseline configuration development
- Change implementation and testing
- Configuration documentation
- Security control implementation

**Configuration Management Team**
- Baseline maintenance
- Change tracking and control
- Configuration auditing
- Compliance verification

---

## BASELINE CONFIGURATION MANAGEMENT

### 1. BASELINE ESTABLISHMENT

**Baseline Requirements**
- Document initial secure configuration
- Security hardening standards applied
- Industry best practices followed
- Vendor hardening guides referenced
- Security benchmarks implemented
- Compliance requirements integrated

**Baseline Components**
- Operating system configurations
- Application settings
- Security control settings
- Network configurations
- System documentation
- Security documentation

### 2. BASELINE MAINTENANCE

**Baseline Updates**
- Regular security updates applied
- Patch management procedures
- Vulnerability remediation
- Configuration improvements
- Compliance requirement updates
- Documentation updates

**Baseline Documentation**
- Configuration documentation
- Change history
- Security settings
- Compliance mappings
- Implementation guides
- Testing procedures

### 3. BASELINE ENFORCEMENT

**Configuration Monitoring**
- Automated configuration checking
- Drift detection
- Compliance verification
- Continuous monitoring
- Alert generation
- Remediation tracking

**Baseline Verification**
- Periodic audits
- Automated scanning
- Compliance checking
- Documentation reviews
- Security assessments
- Continuous improvement

---

## CHANGE MANAGEMENT

### 1. CHANGE REQUEST PROCESS

**Change Request Submission**
- Formal change request required
- Business justification provided
- Security impact assessment
- Risk assessment completed
- Testing plan developed
- Rollback plan documented

**Change Review and Approval**
- Change Control Board review
- Security review
- Management approval
- Configuration team coordination
- Scheduling coordination
- Stakeholder notification

### 2. CHANGE IMPLEMENTATION

**Pre-Implementation**
- Backup current configuration
- Testing in isolated environment
- Security testing completed
- Documentation prepared
- Rollback plan ready
- Stakeholder notification

**Implementation**
- Authorized change window
- Change implementation
- Verification testing
- Security validation
- Documentation updates
- Incident response ready

**Post-Implementation**
- Change verification
- Security validation
- Performance monitoring
- Issue resolution
- Documentation completion
- Lessons learned review

### 3. EMERGENCY CHANGES

**Emergency Change Criteria**
- Critical security vulnerability
- System availability issues
- Data integrity concerns
- Regulatory compliance needs
- Business continuity requirements

**Emergency Change Process**
- Expedited approval
- Notification to CCB
- Implementation with oversight
- Documentation within 24 hours
- Post-implementation review
- Regular change control review

---

## SECURITY CONFIGURATION

### 1. SECURITY HARDENING

**Operating System Hardening**
- Remove unnecessary services
- Disable unnecessary features
- Configure security settings
- Enable security controls
- Configure logging
- Install security patches

**Application Hardening**
- Secure configuration settings
- Least privilege principles
- Input validation
- Output encoding
- Error handling
- Logging and monitoring

**Network Hardening**
- Secure network configurations
- Firewall rule implementation
- Segmentation requirements
- Intrusion detection
- Network monitoring
- Access controls

### 2. CONFIGURATION STANDARDS

**Industry Standards**
- Center for Internet Security (CIS) benchmarks
- National Institute of Standards and Technology (NIST) guidelines
- Defense Information Systems Agency (DISA) STIGs
- Vendor-specific hardening guides
- Security best practices
- Compliance frameworks

**Organization Standards**
- Approved configuration baselines
- Security configuration guides
- Implementation procedures
- Testing requirements
- Documentation standards
- Compliance requirements

### 3. CONFIGURATION COMPLIANCE

**Compliance Monitoring**
- Automated compliance checking
- Configuration scanning
- Drift detection
- Policy enforcement
- Remediation tracking
- Reporting and metrics

**Compliance Reporting**
- Monthly compliance reports
- Quarterly assessments
- Annual comprehensive audits
- Management dashboards
- Audit support
- Continuous improvement

---

## POLICY APPROVAL

| Role | Name | Signature | Date |
|------|------|-----------|------|
| CISO | {{approver}} | _____________ | {{effectiveDate}} |
| IT Director | {{it}} | _____________ | {{effectiveDate}} |
| CEO | {{ceo}} | _____________ | {{effectiveDate}} |

---

**Document Control:**
- Version: 1.0
- Effective Date: {{effectiveDate}}
- Next Review: {{reviewDate}}
- Classification: Internal Use Only
- Distribution: All IT and Security Personnel`,
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
    estimatedPages: 20,
    complexity: 'high',
    targetAudience: ['CISO', 'System Administrators', 'Configuration Management Team', 'Change Control Board']
  }
};
