/**
 * CUI Network Boundary Diagram Template
 * Comprehensive network architecture documentation for CMMC 2.0 compliance
 */

export interface NetworkZone {
  id: string;
  name: string;
  subnet: string;
  vlan: string;
  securityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  systems: string[];
  description: string;
}

export interface BoundaryProtection {
  firewallRules: string[];
  networkSegmentation: string[];
  accessControls: string[];
}

export interface NetworkDiagramTemplate {
  id: string;
  name: string;
  category: 'specialized';
  type: 'network-diagram';
  controls: string[];
  content: string;
  interactiveFields: {
    companyInfo: {
      name: { required: true; type: 'text'; placeholder: string };
      address: { required: false; type: 'text'; placeholder: string };
      contact: { required: false; type: 'email'; placeholder: string };
    };
    systemInfo: {
      networkName: { required: true; type: 'text'; placeholder: string };
      description: { required: true; type: 'textarea'; placeholder: string };
      classification: { required: true; type: 'select'; options: string[] };
    };
    networkZones: NetworkZone[];
    boundaryProtections: BoundaryProtection;
  };
  metadata: {
    version: string;
    lastUpdated: string;
    estimatedPages: number;
    complexity: 'medium';
    targetAudience: string[];
  };
}

export const cuiNetworkBoundaryDiagram: NetworkDiagramTemplate = {
  id: 'cui-network-boundary-diagram',
  name: 'CUI Network Boundary Diagram',
  category: 'specialized',
  type: 'network-diagram',
  controls: ['SC.1.175', 'SC.2.179'],
  content: `# CUI NETWORK BOUNDARY DIAGRAM
## Network Architecture Documentation

**Document Owner:** Network Engineering
**Last Updated:** {{today}}
**Version:** 1.0

---

## DIAGRAM PURPOSE

This document provides visual representation of the CUI environment network boundaries, showing how CUI systems are segregated and protected from non-CUI systems and external networks.

**Controls Addressed:** SC.1.175, SC.2.179

---

## NETWORK ZONES

**Zone 1: CUI Production Environment**
- Subnet: {{cuiSubnet}}
- VLAN: {{cuiVlan}}
- Security Level: HIGH
- Systems: File servers, application servers, databases processing CUI

**Zone 2: Management Network**
- Subnet: {{mgmtSubnet}}
- VLAN: {{mgmtVlan}}
- Security Level: HIGH
- Systems: Administrative jump boxes, management tools

**Zone 3: Corporate Network (Non-CUI)**
- Subnet: {{corpSubnet}}
- VLAN: {{corpVlan}}
- Security Level: MEDIUM
- Systems: General business systems

**Zone 4: DMZ**
- Subnet: {{dmzSubnet}}
- VLAN: {{dmzVlan}}
- Security Level: MEDIUM
- Systems: Public-facing web servers, email gateway

**Zone 5: Guest Network**
- Subnet: {{guestSubnet}}
- VLAN: {{guestVlan}}
- Security Level: LOW
- Systems: Visitor wireless access

---

## BOUNDARY PROTECTIONS

**Firewall Rules:**
- CUI Zone → Corporate: Deny All (except approved services)
- Corporate → CUI Zone: Authenticated VPN only
- CUI Zone → Internet: Proxy only, logged
- Internet → CUI Zone: Deny All
- DMZ → CUI Zone: Deny All
- CUI Zone → DMZ: Allow specific services only

**Network Segmentation:**
- Physical separation where possible
- VLAN segmentation for logical separation
- ACLs enforced on all inter-zone traffic
- Stateful inspection at all boundaries

---

## NETWORK DIAGRAM

\`\`\`
                    INTERNET
                        |
                  [Edge Firewall]
                        |
        +---------------+---------------++
        |               |               |
    [DMZ Zone]    [VPN Gateway]   [Email Gateway]
        |               |
        |        +------+------+
        |        |             |
    [Internal Firewall - Primary]  [Internal Firewall - Secondary]
        |                      |
        +----------+-----------+----------+
                   |
        +----------+----------+----------+----------+
        |          |          |          |          |
   [CUI Zone]  [Corp Zone] [Mgmt Zone] [Guest] [Other]
     VLAN100    VLAN300     VLAN200    VLAN500
        |          |          |          |
   [CUI Systems] [Business] [Admin] [Wireless]
\`\`\`

**Detailed Network Map:** See attached Visio diagram
**Last Security Audit:** {{today}}
**Next Review:** {{nextReview}}

---

**Approval:**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Network Engineer | {{networkEngineer}} | _____________ | {{today}} |
| CISO | {{ciso}} | _____________ | {{today}} |`,
  interactiveFields: {
    companyInfo: {
      name: { required: true, type: 'text', placeholder: 'Enter company name' },
      address: { required: false, type: 'text', placeholder: 'Enter company address' },
      contact: { required: false, type: 'email', placeholder: 'contact@company.com' }
    },
    systemInfo: {
      networkName: { required: true, type: 'text', placeholder: 'Enter network name' },
      description: { required: true, type: 'textarea', placeholder: 'Describe the network architecture' },
      classification: { required: true, type: 'select', options: ['PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'CUI', 'RESTRICTED'] }
    },
    networkZones: [
      {
        id: 'cui-zone',
        name: 'CUI Production Environment',
        subnet: '10.10.0.0/16',
        vlan: '100',
        securityLevel: 'HIGH',
        systems: ['File servers', 'Application servers', 'Databases processing CUI'],
        description: 'Primary CUI processing environment'
      },
      {
        id: 'mgmt-zone',
        name: 'Management Network',
        subnet: '10.20.0.0/24',
        vlan: '200',
        securityLevel: 'HIGH',
        systems: ['Administrative jump boxes', 'Management tools'],
        description: 'Network management and administration'
      },
      {
        id: 'corp-zone',
        name: 'Corporate Network (Non-CUI)',
        subnet: '192.168.0.0/16',
        vlan: '300',
        securityLevel: 'MEDIUM',
        systems: ['General business systems'],
        description: 'Standard business operations'
      },
      {
        id: 'dmz-zone',
        name: 'DMZ',
        subnet: '10.30.0.0/24',
        vlan: '400',
        securityLevel: 'MEDIUM',
        systems: ['Public-facing web servers', 'Email gateway'],
        description: 'Demilitarized zone for external services'
      },
      {
        id: 'guest-zone',
        name: 'Guest Network',
        subnet: '172.16.0.0/24',
        vlan: '500',
        securityLevel: 'LOW',
        systems: ['Visitor wireless access'],
        description: 'Guest and visitor access'
      }
    ],
    boundaryProtections: {
      firewallRules: [
        'CUI Zone → Corporate: Deny All (except approved services)',
        'Corporate → CUI Zone: Authenticated VPN only',
        'CUI Zone → Internet: Proxy only, logged',
        'Internet → CUI Zone: Deny All',
        'DMZ → CUI Zone: Deny All',
        'CUI Zone → DMZ: Allow specific services only'
      ],
      networkSegmentation: [
        'Physical separation where possible',
        'VLAN segmentation for logical separation',
        'ACLs enforced on all inter-zone traffic',
        'Stateful inspection at all boundaries'
      ],
      accessControls: [
        'Multi-factor authentication for CUI zone access',
        'Privileged access management',
        'Network monitoring and logging',
        'Regular access reviews'
      ]
    }
  },
  metadata: {
    version: '1.0',
    lastUpdated: '2025-01-07',
    estimatedPages: 8,
    complexity: 'medium',
    targetAudience: ['Network Engineers', 'CISO', 'Security Team', 'C3PAO Assessors']
  }
};

export function customizeNetworkDiagram(template: NetworkDiagramTemplate, customizations: any): string {
  let content = template.content;
  
  // Replace placeholders with customizations
  const replacements = {
    '{{today}}': new Date().toLocaleDateString(),
    '{{nextReview}}': new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    '{{cuiSubnet}}': customizations.cuiSubnet || '10.10.0.0/16',
    '{{cuiVlan}}': customizations.cuiVlan || '100',
    '{{mgmtSubnet}}': customizations.mgmtSubnet || '10.20.0.0/24',
    '{{mgmtVlan}}': customizations.mgmtVlan || '200',
    '{{corpSubnet}}': customizations.corpSubnet || '192.168.0.0/16',
    '{{corpVlan}}': customizations.corpVlan || '300',
    '{{dmzSubnet}}': customizations.dmzSubnet || '10.30.0.0/24',
    '{{dmzVlan}}': customizations.dmzVlan || '400',
    '{{guestSubnet}}': customizations.guestSubnet || '172.16.0.0/24',
    '{{guestVlan}}': customizations.guestVlan || '500',
    '{{networkEngineer}}': customizations.networkEngineer || '[Name]',
    '{{ciso}}': customizations.ciso || '[Name]'
  };
  
  Object.entries(replacements).forEach(([placeholder, value]) => {
    content = content.replace(new RegExp(placeholder, 'g'), value);
  });
  
  return content;
}
