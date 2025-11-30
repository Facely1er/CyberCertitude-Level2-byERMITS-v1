/**
 * Identification and Authentication Policy Template
 * Comprehensive identification and authentication policy for CMMC 2.0 compliance
 */

export interface IdentificationAndAuthenticationPolicyTemplate {
  id: string;
  name: string;
  category: 'policy';
  type: 'identification-authentication-policy';
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

export const identificationAndAuthenticationPolicy: IdentificationAndAuthenticationPolicyTemplate = {
  id: 'identification-authentication-policy',
  name: 'Identification and Authentication Policy',
  category: 'policy',
  type: 'identification-authentication-policy',
  controls: ['IA.1.076', 'IA.2.077', 'IA.2.078'],
  content: `# IDENTIFICATION AND AUTHENTICATION POLICY
## CMMC 2.0 Level 2 Compliance

**Organization:** {{companyName}}
**Effective Date:** {{effectiveDate}}
**Review Date:** {{reviewDate}}
**Version:** 1.0
**Classification:** Internal Use Only

---

## POLICY STATEMENT

{{companyName}} is committed to ensuring the security and integrity of information systems through robust identification and authentication mechanisms. This policy establishes requirements for user identification, authentication methods, password management, and multi-factor authentication to protect Controlled Unclassified Information (CUI).

**Controls Addressed:** IA.1.076, IA.2.077, IA.2.078

---

## SCOPE

This policy applies to:
- All information systems processing CUI
- All users accessing organizational systems
- All authentication mechanisms
- All credential management systems
- Remote access systems
- Mobile and portable devices

---

## ROLES AND RESPONSIBILITIES

**Chief Information Security Officer (CISO)**
- Overall responsibility for authentication policy
- Approval of authentication methods
- Security standards development
- Policy compliance oversight

**Information System Security Officer (ISSO)**
- Day-to-day authentication management
- User account management oversight
- Authentication system monitoring
- Policy compliance validation

**System Administrators**
- Authentication system administration
- User account provisioning
- Credential management
- System configuration

**Users**
- Password protection
- MFA enrollment and use
- Credential security
- Security reporting

---

## IDENTIFICATION REQUIREMENTS

### 1. USER IDENTIFICATION

**Unique Identification**
- Unique user identifier required
- No shared user accounts
- Personal accountability
- Individual authentication
- Identity verification
- Background screening

**Account Management**
- Automated account provisioning
- Timely account deprovisioning
- Regular account reviews
- Access rights verification
- Account status monitoring
- Documentation requirements

### 2. IDENTIFIER REQUIREMENTS

**Identifier Format**
- Minimum length requirements
- Character requirements
- Uniqueness requirements
- Readability requirements
- Security considerations
- Naming conventions

**Identifier Administration**
- Automated generation preferred
- Consistent naming standards
- Registration procedures
- Verification processes
- Maintenance procedures
- Archive procedures

---

## AUTHENTICATION REQUIREMENTS

### 1. AUTHENTICATION METHODS

**Single-Factor Authentication**
- For low-risk access only
- Minimum security requirements
- Password requirements
- Session management
- Monitoring and logging
- Limited to approved systems

**Multi-Factor Authentication (MFA)**
- Required for privileged accounts
- Required for remote access
- Required for CUI system access
- Required for administrative functions
- Approved MFA methods only
- Backup authentication available

### 2. PASSWORD MANAGEMENT

**Password Requirements**
- Minimum 12 characters
- Complex character mix
- Uppercase and lowercase letters
- Numbers and special characters
- No dictionary words
- No personal information

**Password Policy**
- Change every 90 days
- No reuse of last 12 passwords
- Cannot share passwords
- Cannot write down passwords
- Password manager encouraged
- Secure storage required

### 3. MULTI-FACTOR AUTHENTICATION

**MFA Requirements**
- Factor 1: Something you know (password)
- Factor 2: Something you have (token/device)
- Factor 3: Something you are (biometric)
- Hardware tokens preferred
- Software tokens acceptable
- Backup codes required

**MFA Methods**
- Smart card with PIN
- Hardware tokens (OTP)
- Mobile authenticator apps
- Biometric authentication
- SMS/Email (less secure)
- Phone-based authentication

---

## AUTHENTICATION SYSTEM MANAGEMENT

### 1. AUTHENTICATION SYSTEMS

**System Requirements**
- Centralized authentication
- Single sign-on (SSO) capability
- Integration capabilities
- Secure transmission
- Session management
- Audit logging

**System Configuration**
- Secure default settings
- Lockout policies enforced
- Session timeout configured
- Concurrent session limits
- Password policy enforcement
- MFA integration

### 2. AUTHENTICATION SESSIONS

**Session Management**
- Automatic timeout after 30 minutes
- Concurrent session limits
- Session monitoring
- Secure session handling
- Session termination procedures
- Re-authentication requirements

**Remote Sessions**
- VPN requirement
- MFA enforcement
- Session encryption
- Secure channels
- Monitoring and logging
- Automatic disconnection

### 3. CREDENTIAL MANAGEMENT

**Credential Storage**
- Encrypted credential storage
- Hashed passwords (bcrypt/Argon2)
- Secure credential transmission
- Credential vault for privileged accounts
- Rotation procedures
- Secure disposal

**Credential Lifecycle**
- Initial credential issuance
- Credential updates
- Credential reset procedures
- Credential revocation
- Emergency access procedures
- Credential recovery

---

## PASSWORD AND AUTHENTICATION INCIDENTS

### 1. INCIDENT RESPONSE

**Compromised Credentials**
- Immediate account suspension
- Password reset required
- Security review initiated
- Notification to ISSO
- Investigation procedures
- Remediation actions

**Authentication Failures**
- Account lockout after failed attempts
- Monitoring for brute force
- Alert generation
- Investigation procedures
- Incident response coordination
- Documentation requirements

### 2. PASSWORD RESET

**Password Reset Procedures**
- Identity verification required
- Secure reset process
- Temporary password policy
- Forced change on first login
- Notification to user
- Audit logging

**Emergency Access**
- Emergency account procedures
- Management approval required
- Time-limited access
- Full audit logging
- Immediate review
- Documentation requirements

---

## COMPLIANCE AND MONITORING

**Compliance Requirements**
- CMMC 2.0 Level 2 compliance
- Regular compliance assessments
- Audit preparation and support
- Documentation maintenance
- Continuous improvement

**Monitoring and Reporting**
- Authentication event logging
- Failed authentication monitoring
- Account activity tracking
- Suspicious activity detection
- Regular access reviews
- Management reporting

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
    estimatedPages: 15,
    complexity: 'high',
    targetAudience: ['CISO', 'ISSO', 'System Administrators', 'All Users', 'HR Personnel']
  }
};
