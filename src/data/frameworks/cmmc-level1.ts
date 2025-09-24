import { Framework } from '../../shared/types';

export const cmmcLevel1Framework: Framework = {
  id: 'cmmc-level1',
  name: 'CMMC Level 1 - Basic Cyber Hygiene',
  description: 'CMMC Level 1 focuses on basic cyber hygiene practices for Federal Contract Information (FCI) protection. Includes 17 practices across 6 domains.',
  version: '2.0',
  complexity: 'basic',
  estimatedTime: 40, // Reduced from Level 2's 240 hours (for reference)
  industry: ['Government', 'Defense'],
  certificationBody: 'Self-Assessment',
  applicableRegulations: ['NIST SP 800-171', 'DFARS 252.204-7012'],
  maturityLevels: [
    { 
      level: 1, 
      name: 'Basic Cyber Hygiene', 
      description: 'Protect Federal Contract Information (FCI) with basic cybersecurity practices', 
      color: '#22c55e', 
      minScore: 0, 
      maxScore: 100,
      characteristics: [
        'Self-assessment annually',
        'Basic cybersecurity practices',
        'FCI protection focus',
        'No formal processes required'
      ],
      typicalOrganizations: [
        'Small defense contractors',
        'Organizations handling FCI only',
        'Entry-level DoD suppliers'
      ],
      nextSteps: [
        'Consider upgrading to Level 2 for CUI handling in the future',
        'Implement formal security processes',
        'Conduct regular security training'
      ]
    }
  ],
  sections: [
    {
      id: 'access-control',
      name: 'Access Control (AC)',
      description: 'Limit information system access to authorized users, processes, and devices',
      weight: 20,
      priority: 'high',
      estimatedTime: 8,
      categories: [
        {
          id: 'access-control',
          name: 'Access Control',
          description: 'Control access to systems and information',
          weight: 100,
          questions: [
            {
              id: 'ac.l1-3.1.1',
              text: 'Limit system access to authorized users, processes acting on behalf of authorized users, and devices (including other systems).',
              guidance: 'Implement user access controls to ensure only authorized personnel can access systems containing Federal Contract Information (FCI). This includes user accounts, authentication systems, and access reviews.',
              priority: 'high',
              references: ['NIST SP 800-171 3.1.1'],
              examples: [
                'User account management system',
                'Password-based authentication',
                'Regular access reviews',
                'User access provisioning/deprovisioning'
              ],
              options: [
                { value: 0, label: 'Not implemented', description: 'No access controls in place', riskLevel: 'critical' },
                { value: 1, label: 'Partially implemented', description: 'Basic access controls for some systems', riskLevel: 'high' },
                { value: 2, label: 'Largely implemented', description: 'Most systems have proper access controls', riskLevel: 'medium' },
                { value: 3, label: 'Fully implemented', description: 'Complete access control framework', riskLevel: 'low' }
              ],
              evidenceRequirements: [
                { type: 'document', description: 'User access control policy', required: true },
                { type: 'procedure', description: 'User account management procedures', required: true },
                { type: 'screenshot', description: 'System access control settings', required: false }
              ],
              improvementSuggestions: [
                {
                  priority: 'high',
                  effort: 'medium',
                  timeframe: '2-4 weeks',
                  description: 'Implement centralized user account management system',
                  resources: ['IT Administrator', 'Security Policy Template']
                }
              ]
            },
            {
              id: 'ac.l1-3.1.2',
              text: 'Limit system access to the types of transactions and functions that authorized users are permitted to execute.',
              guidance: 'Control what actions users can perform once they have access to systems. Implement role-based access control to limit functions based on job responsibilities.',
              priority: 'high',
              references: ['NIST SP 800-171 3.1.2'],
              examples: [
                'Role-based access control (RBAC)',
                'Function-based restrictions',
                'Transaction controls',
                'Privilege management'
              ],
              options: [
                { value: 0, label: 'Not implemented', description: 'No transaction/function restrictions', riskLevel: 'critical' },
                { value: 1, label: 'Partially implemented', description: 'Basic restrictions for some functions', riskLevel: 'high' },
                { value: 2, label: 'Largely implemented', description: 'Most transactions properly restricted', riskLevel: 'medium' },
                { value: 3, label: 'Fully implemented', description: 'Complete transaction and function controls', riskLevel: 'low' }
              ],
              evidenceRequirements: [
                { type: 'document', description: 'Role-based access control policy', required: true },
                { type: 'procedure', description: 'User privilege management procedures', required: true }
              ],
              improvementSuggestions: [
                {
                  priority: 'high',
                  effort: 'medium',
                  timeframe: '3-4 weeks',
                  description: 'Define user roles and implement RBAC system',
                  resources: ['HR Department', 'IT Administrator', 'Business Process Documentation']
                }
              ]
            },
            {
              id: 'ac.l1-3.1.3',
              text: 'Control the flow of CUI in accordance with approved authorizations.',
              guidance: 'Implement information flow controls to regulate where Federal Contract Information (FCI) can travel within and between systems.',
              priority: 'high',
              references: ['NIST SP 800-171 3.1.3'],
              examples: [
                'Information flow controls',
                'Data flow restrictions',
                'Network segmentation',
                'Content filtering'
              ],
              options: [
                { value: 0, label: 'Not implemented', description: 'No information flow controls', riskLevel: 'critical' },
                { value: 1, label: 'Partially implemented', description: 'Basic flow controls for some data', riskLevel: 'high' },
                { value: 2, label: 'Largely implemented', description: 'Most information flows controlled', riskLevel: 'medium' },
                { value: 3, label: 'Fully implemented', description: 'Complete information flow control', riskLevel: 'low' }
              ],
              evidenceRequirements: [
                { type: 'document', description: 'Information flow control policy', required: true },
                { type: 'procedure', description: 'Data flow management procedures', required: true }
              ],
              improvementSuggestions: [
                {
                  priority: 'high',
                  effort: 'medium',
                  timeframe: '2-3 weeks',
                  description: 'Implement network segmentation and data flow controls',
                  resources: ['Network Administrator', 'Security Officer', 'Network Segmentation Tools']
                }
              ]
            },
            {
              id: 'ac.l1-3.1.4',
              text: 'Separate the duties of individuals to reduce the risk of malevolent activity without collusion.',
              guidance: 'Implement separation of duties to prevent any single individual from having complete control over critical functions involving Federal Contract Information (FCI).',
              priority: 'medium',
              references: ['NIST SP 800-171 3.1.4'],
              examples: [
                'Segregation of duties',
                'Dual approval processes',
                'Role separation',
                'Check and balance controls'
              ],
              options: [
                { value: 0, label: 'Not implemented', description: 'No separation of duties', riskLevel: 'high' },
                { value: 1, label: 'Partially implemented', description: 'Basic separation for critical functions', riskLevel: 'medium' },
                { value: 2, label: 'Largely implemented', description: 'Most duties properly separated', riskLevel: 'low' },
                { value: 3, label: 'Fully implemented', description: 'Complete separation of duties framework', riskLevel: 'low' }
              ],
              evidenceRequirements: [
                { type: 'document', description: 'Separation of duties policy', required: true },
                { type: 'procedure', description: 'Role assignment procedures', required: true }
              ],
              improvementSuggestions: [
                {
                  priority: 'medium',
                  effort: 'low',
                  timeframe: '1-2 weeks',
                  description: 'Define role separation matrix and implement dual controls',
                  resources: ['HR Department', 'Security Officer', 'Role Matrix Template']
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'identification-authentication',
      name: 'Identification and Authentication (IA)',
      description: 'Identify information system users, processes acting on behalf of users, and devices',
      weight: 20,
      priority: 'high',
      estimatedTime: 8,
      categories: [
        {
          id: 'identification-authentication',
          name: 'Identification and Authentication',
          description: 'Ensure users are identified and authenticated before accessing systems',
          weight: 100,
          questions: [
            {
              id: 'ia.l1-3.5.1',
              text: 'Identify information system users, processes acting on behalf of users, and devices.',
              guidance: 'Maintain a system to identify all users, processes, and devices that access systems containing Federal Contract Information (FCI).',
              priority: 'high',
              references: ['NIST SP 800-171 3.5.1'],
              examples: [
                'User identification system',
                'Device inventory management',
                'Process identification logs',
                'Unique identifiers for all entities'
              ],
              options: [
                { value: 0, label: 'Not implemented', description: 'No identification system in place', riskLevel: 'critical' },
                { value: 1, label: 'Partially implemented', description: 'Basic user identification only', riskLevel: 'high' },
                { value: 2, label: 'Largely implemented', description: 'Most users and devices identified', riskLevel: 'medium' },
                { value: 3, label: 'Fully implemented', description: 'Complete identification system', riskLevel: 'low' }
              ],
              evidenceRequirements: [
                { type: 'document', description: 'User identification policy', required: true },
                { type: 'procedure', description: 'Device inventory procedures', required: true },
                { type: 'screenshot', description: 'User directory listing', required: false }
              ],
              improvementSuggestions: [
                {
                  priority: 'high',
                  effort: 'low',
                  timeframe: '1-2 weeks',
                  description: 'Create comprehensive user and device inventory',
                  resources: ['IT Administrator', 'Asset Management Spreadsheet']
                }
              ]
            },
            {
              id: 'ia.l1-3.5.2',
              text: 'Authenticate (or verify) the identities of users, processes, or devices before allowing access to organizational information systems.',
              guidance: 'Implement authentication mechanisms to verify the identity of users, processes, and devices before granting access to systems containing FCI.',
              priority: 'high',
              references: ['NIST SP 800-171 3.5.2'],
              examples: [
                'Password authentication',
                'Multi-factor authentication (MFA)',
                'Device certificates',
                'Biometric authentication'
              ],
              options: [
                { value: 0, label: 'Not implemented', description: 'No authentication required', riskLevel: 'critical' },
                { value: 1, label: 'Partially implemented', description: 'Basic password authentication', riskLevel: 'high' },
                { value: 2, label: 'Largely implemented', description: 'Strong authentication for most systems', riskLevel: 'medium' },
                { value: 3, label: 'Fully implemented', description: 'Comprehensive authentication framework', riskLevel: 'low' }
              ],
              evidenceRequirements: [
                { type: 'document', description: 'Authentication policy', required: true },
                { type: 'procedure', description: 'Password management procedures', required: true },
                { type: 'screenshot', description: 'Authentication system configuration', required: false }
              ],
              improvementSuggestions: [
                {
                  priority: 'high',
                  effort: 'medium',
                  timeframe: '2-3 weeks',
                  description: 'Implement strong password policies and consider MFA',
                  resources: ['IT Administrator', 'Security Policy Templates', 'MFA Solution']
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'media-protection',
      name: 'Media Protection (MP)',
      description: 'Protect system media, both paper and digital',
      weight: 15,
      priority: 'medium',
      estimatedTime: 6,
      categories: [
        {
          id: 'media-protection',
          name: 'Media Protection',
          description: 'Safeguard media containing Federal Contract Information',
          weight: 100,
          questions: [
            {
              id: 'mp.l1-3.8.3',
              text: 'Protect (i.e., physically control and securely store, sanitize for disposal, or destroy) system media containing CUI, both paper and digital.',
              guidance: 'Implement physical and digital controls to protect media containing Federal Contract Information (FCI) throughout its lifecycle.',
              priority: 'medium',
              references: ['NIST SP 800-171 3.8.1'],
              examples: [
                'Secure storage for physical media',
                'Digital media encryption',
                'Media sanitization procedures',
                'Secure disposal processes'
              ],
              options: [
                { value: 0, label: 'Not implemented', description: 'No media protection controls', riskLevel: 'high' },
                { value: 1, label: 'Partially implemented', description: 'Basic physical media protection', riskLevel: 'medium' },
                { value: 2, label: 'Largely implemented', description: 'Most media properly protected', riskLevel: 'low' },
                { value: 3, label: 'Fully implemented', description: 'Complete media protection framework', riskLevel: 'low' }
              ],
              evidenceRequirements: [
                { type: 'document', description: 'Media protection policy', required: true },
                { type: 'procedure', description: 'Media handling procedures', required: true },
                { type: 'document', description: 'Media disposal procedures', required: true }
              ],
              improvementSuggestions: [
                {
                  priority: 'medium',
                  effort: 'low',
                  timeframe: '1-2 weeks',
                  description: 'Implement secure storage and disposal procedures for media',
                  resources: ['Physical Security Officer', 'IT Administrator', 'Media Handling Procedures']
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'physical-protection',
      name: 'Physical Protection (PE)',
      description: 'Limit physical access to organizational information systems, equipment, and operating environments',
      weight: 15,
      priority: 'medium',
      estimatedTime: 6,
      categories: [
        {
          id: 'physical-protection',
          name: 'Physical Protection',
          description: 'Control physical access to systems and facilities',
          weight: 100,
          questions: [
            {
              id: 'pe.l1-3.10.1',
              text: 'Limit physical access to organizational information systems, equipment, and the respective operating environments to authorized individuals.',
              guidance: 'Implement physical security controls to restrict access to systems and equipment containing Federal Contract Information (FCI).',
              priority: 'medium',
              references: ['NIST SP 800-171 3.10.1'],
              examples: [
                'Locked server rooms',
                'Access control systems',
                'Visitor management',
                'Security cameras'
              ],
              options: [
                { value: 0, label: 'Not implemented', description: 'No physical access controls', riskLevel: 'high' },
                { value: 1, label: 'Partially implemented', description: 'Basic locks and keys', riskLevel: 'medium' },
                { value: 2, label: 'Largely implemented', description: 'Most areas properly secured', riskLevel: 'low' },
                { value: 3, label: 'Fully implemented', description: 'Comprehensive physical security', riskLevel: 'low' }
              ],
              evidenceRequirements: [
                { type: 'document', description: 'Physical security policy', required: true },
                { type: 'procedure', description: 'Access control procedures', required: true },
                { type: 'document', description: 'Visitor management procedures', required: true }
              ],
              improvementSuggestions: [
                {
                  priority: 'medium',
                  effort: 'medium',
                  timeframe: '2-4 weeks',
                  description: 'Implement comprehensive physical security controls',
                  resources: ['Facilities Manager', 'Security Officer', 'Access Control System']
                }
              ]
            },
            {
              id: 'pe.l1-3.10.2',
              text: 'Escort visitors and monitor visitor activity.',
              guidance: 'Implement visitor management procedures to ensure all visitors are properly escorted and monitored when accessing areas containing Federal Contract Information (FCI).',
              priority: 'medium',
              references: ['NIST SP 800-171 3.10.2'],
              examples: [
                'Visitor escort procedures',
                'Visitor log books',
                'Badge systems',
                'Monitoring cameras'
              ],
              options: [
                { value: 0, label: 'Not implemented', description: 'No visitor management', riskLevel: 'high' },
                { value: 1, label: 'Partially implemented', description: 'Basic visitor logging', riskLevel: 'medium' },
                { value: 2, label: 'Largely implemented', description: 'Most visitors properly managed', riskLevel: 'low' },
                { value: 3, label: 'Fully implemented', description: 'Comprehensive visitor management', riskLevel: 'low' }
              ],
              evidenceRequirements: [
                { type: 'document', description: 'Visitor management policy', required: true },
                { type: 'procedure', description: 'Visitor escort procedures', required: true },
                { type: 'document', description: 'Visitor log templates', required: true }
              ],
              improvementSuggestions: [
                {
                  priority: 'medium',
                  effort: 'low',
                  timeframe: '1-2 weeks',
                  description: 'Implement visitor management and escort procedures',
                  resources: ['Reception Staff', 'Security Officer', 'Visitor Management System']
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'system-communications-protection',
      name: 'System and Communications Protection (SC)',
      description: 'Monitor, control, and protect organizational communications',
      weight: 15,
      priority: 'medium',
      estimatedTime: 6,
      categories: [
        {
          id: 'system-communications-protection',
          name: 'System and Communications Protection',
          description: 'Monitor and protect communications and systems',
          weight: 100,
          questions: [
            {
              id: 'sc.l1-3.13.1',
              text: 'Monitor, control, and protect organizational communications (i.e., information transmitted or received by organizational information systems) at the external boundaries and key internal boundaries of the information systems.',
              guidance: 'Implement network monitoring and protection controls to safeguard communications containing Federal Contract Information (FCI).',
              priority: 'medium',
              references: ['NIST SP 800-171 3.13.1'],
              examples: [
                'Firewall configuration',
                'Network monitoring tools',
                'Intrusion detection systems',
                'Email security controls'
              ],
              options: [
                { value: 0, label: 'Not implemented', description: 'No communication protection', riskLevel: 'high' },
                { value: 1, label: 'Partially implemented', description: 'Basic firewall protection', riskLevel: 'medium' },
                { value: 2, label: 'Largely implemented', description: 'Most communications protected', riskLevel: 'low' },
                { value: 3, label: 'Fully implemented', description: 'Comprehensive communication protection', riskLevel: 'low' }
              ],
              evidenceRequirements: [
                { type: 'document', description: 'Network security policy', required: true },
                { type: 'procedure', description: 'Firewall management procedures', required: true },
                { type: 'screenshot', description: 'Firewall configuration', required: false }
              ],
              improvementSuggestions: [
                {
                  priority: 'medium',
                  effort: 'medium',
                  timeframe: '2-3 weeks',
                  description: 'Implement network monitoring and firewall protection',
                  resources: ['Network Administrator', 'Firewall Solution', 'Network Monitoring Tools']
                }
              ]
            },
            {
              id: 'sc.l1-3.13.8',
              text: 'Implement subnetworks for publicly accessible system components that are physically or logically separated from internal networks.',
              guidance: 'Create separate network segments for systems that need to be accessible from the internet to isolate them from internal systems containing Federal Contract Information (FCI).',
              priority: 'medium',
              references: ['NIST SP 800-171 3.13.8'],
              examples: [
                'DMZ (Demilitarized Zone)',
                'Network segmentation',
                'Public-facing server isolation',
                'Web server separation'
              ],
              options: [
                { value: 0, label: 'Not implemented', description: 'No network segmentation', riskLevel: 'high' },
                { value: 1, label: 'Partially implemented', description: 'Basic network separation', riskLevel: 'medium' },
                { value: 2, label: 'Largely implemented', description: 'Most public systems isolated', riskLevel: 'low' },
                { value: 3, label: 'Fully implemented', description: 'Complete network segmentation', riskLevel: 'low' }
              ],
              evidenceRequirements: [
                { type: 'document', description: 'Network architecture policy', required: true },
                { type: 'procedure', description: 'Network segmentation procedures', required: true },
                { type: 'screenshot', description: 'Network diagram', required: false }
              ],
              improvementSuggestions: [
                {
                  priority: 'medium',
                  effort: 'high',
                  timeframe: '4-6 weeks',
                  description: 'Implement DMZ and network segmentation',
                  resources: ['Network Administrator', 'Security Architect', 'Network Equipment']
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'system-information-integrity',
      name: 'System and Information Integrity (SI)',
      description: 'Identify, report, and correct information and information system flaws',
      weight: 15,
      priority: 'medium',
      estimatedTime: 6,
      categories: [
        {
          id: 'system-information-integrity',
          name: 'System and Information Integrity',
          description: 'Identify and manage system vulnerabilities',
          weight: 100,
          questions: [
            {
              id: 'si.l1-3.14.1',
              text: 'Identify, report, and correct information and information system flaws in a timely manner.',
              guidance: 'Implement processes to identify, report, and remediate vulnerabilities in systems containing Federal Contract Information (FCI).',
              priority: 'medium',
              references: ['NIST SP 800-171 3.14.1'],
              examples: [
                'Vulnerability scanning',
                'Patch management process',
                'Security incident reporting',
                'System monitoring'
              ],
              options: [
                { value: 0, label: 'Not implemented', description: 'No vulnerability management', riskLevel: 'high' },
                { value: 1, label: 'Partially implemented', description: 'Basic patch management', riskLevel: 'medium' },
                { value: 2, label: 'Largely implemented', description: 'Most vulnerabilities addressed', riskLevel: 'low' },
                { value: 3, label: 'Fully implemented', description: 'Comprehensive vulnerability management', riskLevel: 'low' }
              ],
              evidenceRequirements: [
                { type: 'document', description: 'Vulnerability management policy', required: true },
                { type: 'procedure', description: 'Patch management procedures', required: true },
                { type: 'document', description: 'Incident reporting procedures', required: true }
              ],
              improvementSuggestions: [
                {
                  priority: 'medium',
                  effort: 'medium',
                  timeframe: '2-3 weeks',
                  description: 'Implement vulnerability scanning and patch management',
                  resources: ['IT Administrator', 'Vulnerability Scanner', 'Patch Management System']
                }
              ]
            },
            {
              id: 'si.l1-3.14.2',
              text: 'Protect information at rest.',
              guidance: 'Implement encryption or other protective measures for Federal Contract Information (FCI) stored on systems and media.',
              priority: 'medium',
              references: ['NIST SP 800-171 3.14.2'],
              examples: [
                'Disk encryption',
                'Database encryption',
                'File-level encryption',
                'Secure storage systems'
              ],
              options: [
                { value: 0, label: 'Not implemented', description: 'No data encryption', riskLevel: 'high' },
                { value: 1, label: 'Partially implemented', description: 'Basic encryption for some data', riskLevel: 'medium' },
                { value: 2, label: 'Largely implemented', description: 'Most data encrypted', riskLevel: 'low' },
                { value: 3, label: 'Fully implemented', description: 'Complete data encryption', riskLevel: 'low' }
              ],
              evidenceRequirements: [
                { type: 'document', description: 'Data encryption policy', required: true },
                { type: 'procedure', description: 'Encryption key management procedures', required: true },
                { type: 'screenshot', description: 'Encryption configuration', required: false }
              ],
              improvementSuggestions: [
                {
                  priority: 'medium',
                  effort: 'medium',
                  timeframe: '3-4 weeks',
                  description: 'Implement disk and database encryption',
                  resources: ['IT Administrator', 'Encryption Software', 'Key Management System']
                }
              ]
            },
            {
              id: 'si.l1-3.14.4',
              text: 'Detect malicious code at organizational information system entry and exit points.',
              guidance: 'Implement antivirus and anti-malware solutions to detect malicious code at system entry and exit points to protect Federal Contract Information (FCI).',
              priority: 'medium',
              references: ['NIST SP 800-171 3.14.4'],
              examples: [
                'Antivirus software',
                'Email scanning',
                'Web content filtering',
                'Malware detection systems'
              ],
              options: [
                { value: 0, label: 'Not implemented', description: 'No malware protection', riskLevel: 'high' },
                { value: 1, label: 'Partially implemented', description: 'Basic antivirus on some systems', riskLevel: 'medium' },
                { value: 2, label: 'Largely implemented', description: 'Most systems protected', riskLevel: 'low' },
                { value: 3, label: 'Fully implemented', description: 'Comprehensive malware protection', riskLevel: 'low' }
              ],
              evidenceRequirements: [
                { type: 'document', description: 'Malware protection policy', required: true },
                { type: 'procedure', description: 'Antivirus management procedures', required: true },
                { type: 'screenshot', description: 'Antivirus configuration', required: false }
              ],
              improvementSuggestions: [
                {
                  priority: 'medium',
                  effort: 'low',
                  timeframe: '1-2 weeks',
                  description: 'Deploy comprehensive antivirus and malware protection',
                  resources: ['IT Administrator', 'Antivirus Software', 'Email Security Gateway']
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};