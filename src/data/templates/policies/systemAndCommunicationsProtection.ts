/**
 * System and Communications Protection Policy Template
 * Comprehensive system and communications protection policy for CMMC 2.0 compliance
 */

export interface SystemAndCommunicationsProtectionPolicyTemplate {
  id: string;
  name: string;
  category: 'policy';
  type: 'system-communications-protection-policy';
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

export const systemAndCommunicationsProtectionPolicy: SystemAndCommunicationsProtectionPolicyTemplate = {
  id: 'system-communications-protection-policy',
  name: 'System and Communications Protection Policy',
  category: 'policy',
  type: 'system-communications-protection-policy',
  controls: ['SC.1.175', 'SC.2.179', 'SC.2.180'],
  content: `# SYSTEM AND COMMUNICATIONS PROTECTION POLICY
## CMMC 2.0 Level 2 Compliance

**Organization:** {{companyName}}
**Effective Date:** {{effectiveDate}}
**Review Date:** {{reviewDate}}
**Version:** 1.0
**Classification:** Internal Use Only

---

## POLICY STATEMENT

{{companyName}} is committed to protecting Controlled Unclassified Information (CUI) through comprehensive system and communications protection measures. This policy establishes requirements for network security, encryption, boundary protection, and secure communication protocols.

**Controls Addressed:** SC.1.175, SC.2.179, SC.2.180

---

## SCOPE

This policy applies to:
- All information systems processing CUI
- Network infrastructure and communications
- Boundary protection devices
- Cryptographic systems
- Wireless communications
- Remote access systems

---

## ROLES AND RESPONSIBILITIES

**Chief Information Security Officer (CISO)**
- Overall network security responsibility
- Architecture approval
- Security standards development
- Policy compliance oversight

**Network Security Team**
- Network security implementation
- Firewall management
- Intrusion detection
- Network monitoring
- Incident response

**System Administrators**
- Network device configuration
- Security control implementation
- Monitoring and maintenance
- Documentation and reporting

---

## BOUNDARY PROTECTION

### 1. NETWORK SEGMENTATION

**Network Zones**
- Demilitarized zone (DMZ)
- Internal network zones
- CUI environments
- Management networks
- Guest networks
- Isolation requirements

**Segmentation Requirements**
- Physical and logical segmentation
- Firewall enforcement
- Access control lists
- VLAN separation
- Network monitoring
- Traffic inspection

### 2. FIREWALL AND NETWORK DEVICES

**Firewall Requirements**
- Stateful inspection enabled
- Default deny policy
- Explicit allow rules
- Logging enabled
- Regular rule reviews
- Configuration management

**Network Device Security**
- Vendor hardening applied
- Default passwords changed
- Unnecessary services disabled
- SNMP secure configuration
- Management access restricted
- Regular security updates

### 3. NETWORK MONITORING

**Intrusion Detection/Prevention**
- IDS/IPS systems deployed
- Signature-based detection
- Anomaly-based detection
- Behavioral analysis
- Real-time alerting
- Incident response integration

**Traffic Monitoring**
- Network traffic analysis
- Protocol analysis
- Packet inspection
- Flow analysis
- Anomaly detection
- Threat intelligence integration

---

## CRYPTOGRAPHIC PROTECTION

### 1. ENCRYPTION REQUIREMENTS

**Data at Rest**
- AES-256 encryption minimum
- Full disk encryption
- Database encryption
- File-level encryption
- Key management
- Key rotation procedures

**Data in Transit**
- TLS 1.2 minimum
- Strong cipher suites
- Certificate management
- Perfect forward secrecy
- VPN encryption
- Secure protocols only

**CUI Encryption**
- Mandatory encryption
- FIPS 140-2 validated
- Approved algorithms only
- Key escrow prohibited
- Key recovery procedures
- Documentation requirements

### 2. KEY MANAGEMENT

**Key Lifecycle Management**
- Secure key generation
- Secure key distribution
- Key storage and protection
- Key rotation schedules
- Key destruction procedures
- Key recovery procedures

**Key Management Systems**
- Hardware security modules (HSM)
- Certificate authority
- Key management infrastructure
- Access controls
- Audit logging
- Compliance verification

---

## NETWORK SECURITY

### 1. NETWORK ACCESS CONTROL

**Access Control Lists**
- Least privilege principles
- Time-based restrictions
- Source/destination filtering
- Port and protocol restrictions
- Application filtering
- Regular reviews

**Network Authentication**
- 802.1X authentication
- Network Access Control (NAC)
- Device authentication
- Certificate-based authentication
- Multi-factor authentication
- Guest access controls

### 2. SECURE COMMUNICATIONS

**Remote Access**
- VPN requirement
- Strong authentication
- Encrypted tunnels
- Session timeout
- Traffic inspection
- Monitoring and logging

**Wireless Communications**
- WPA3 encryption minimum
- Strong passphrases
- Guest network isolation
- Rogue AP detection
- Monitoring and auditing
- Regular assessments

### 3. PROTOCOL SECURITY

**Approved Protocols**
- TLS for HTTPS
- SSH for remote access
- IPSec for VPN
- SNMPv3 for management
- S/MIME for email encryption
- Approved protocols list maintained

**Protocol Configuration**
- Secure configurations
- Disable insecure protocols
- Regular protocol updates
- Vulnerability management
- Security assessments
- Documentation requirements

---

## SYSTEM PROTECTION

### 1. ENDPOINT SECURITY

**Endpoint Protection**
- Antivirus/antimalware
- Host-based firewall
- Device encryption
- Application whitelisting
- Behavioral monitoring
- Security updates

**Mobile Device Security**
- Mobile device management
- Containerization for CUI
- Remote wipe capability
- Encryption requirements
- Access controls
- Compliance verification

### 2. SERVER SECURITY

**Server Hardening**
- CIS benchmarks applied
- Unnecessary services disabled
- Strong authentication
- Regular patching
- Logging enabled
- Monitoring configured

**Virtualization Security**
- Hypervisor hardening
- VM isolation
- Network segmentation
- Resource allocation
- Access controls
- Monitoring and auditing

### 3. APPLICATION SECURITY

**Secure Application Development**
- Security in SDLC
- Secure coding practices
- Code reviews
- Security testing
- Vulnerability scanning
- Penetration testing

**Application Controls**
- Input validation
- Output encoding
- Session management
- Error handling
- Logging and monitoring
- Access controls

---

## COMMUNICATIONS SECURITY

### 1. EMAIL SECURITY

**Email Protection**
- SPF, DKIM, DMARC
- Anti-spam filtering
- Anti-phishing protection
- Malware scanning
- URL rewriting
- Attachment scanning

**Secure Email**
- Email encryption for CUI
- S/MIME or PGP
- Certificate management
- Key exchange procedures
- Secure transmission
- Monitoring and logging

### 2. MESSAGING SECURITY

**Secure Messaging**
- Encrypted messaging platforms
- Authentication required
- Message integrity
- Non-repudiation
- Secure storage
- Auditing capabilities

**Collaboration Tools**
- Secure platforms only
- Authentication required
- Access controls
- Encryption in transit and at rest
- Monitoring and logging
- Policy compliance

---

## POLICY APPROVAL

| Role | Name | Signature | Date |
|------|------|-----------|------|
| CISO | {{approver}} | _____________ | {{effectiveDate}} |
| Network Manager | {{network}} | _____________ | {{effectiveDate}} |
| CEO | {{ceo}} | _____________ | {{effectiveDate}} |

---

**Document Control:**
- Version: 1.0
- Effective Date: {{effectiveDate}}
- Next Review: {{reviewDate}}
- Classification: Internal Use Only
- Distribution: IT and Security Personnel`,
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
    estimatedPages: 24,
    complexity: 'high',
    targetAudience: ['CISO', 'Network Security Team', 'System Administrators', 'Network Engineers']
  }
};
