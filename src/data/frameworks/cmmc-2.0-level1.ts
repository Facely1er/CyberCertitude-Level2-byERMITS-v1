import { Framework } from '../../shared/types';

export const cmmc2Level1Framework: Framework = {
  id: 'cmmc-2.0-level1',
  name: 'CMMC 2.0 Level 1 - Basic Cyber Hygiene',
  description: 'CMMC 2.0 Level 1 focuses on basic cyber hygiene practices for Federal Contract Information (FCI) protection. Includes 17 practices across 6 domains with comprehensive implementation guidance.',
  version: '2.0',
  complexity: 'basic',
  estimatedTime: 40, // Hours for complete implementation
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
        'No formal processes required',
        'Small business friendly'
      ],
      typicalOrganizations: [
        'Small defense contractors',
        'Organizations handling FCI only',
        'Entry-level DoD suppliers',
        'Micro-enterprises (1-10 employees)',
        'Startup defense contractors'
      ],
      nextSteps: [
        'Consider upgrading to Level 2 for CUI handling in the future',
        'Implement formal security processes',
        'Conduct regular security training',
        'Develop documented procedures'
      ]
    }
  ],
  sections: [
    {
      id: 'access-control',
      name: 'Access Control (AC)',
      description: 'Limit information system access to authorized users, processes, and devices',
      weight: 25,
      priority: 'high',
      estimatedTime: 10,
      categories: [
        {
          id: 'access-control',
          name: 'Access Control',
          description: 'Control access to systems and information containing FCI',
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
                'User access provisioning/deprovisioning',
                'Device access controls'
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
                { type: 'screenshot', description: 'System access control settings', required: false },
                { type: 'document', description: 'User access review documentation', required: true }
              ],
              improvementSuggestions: [
                {
                  priority: 'high',
                  effort: 'medium',
                  timeframe: '2-4 weeks',
                  description: 'Implement centralized user account management system',
                  resources: ['IT Administrator', 'Security Policy Template', 'User Directory System'],
                  steps: [
                    'Create user access control policy',
                    'Implement user account management procedures',
                    'Set up user directory system',
                    'Conduct regular access reviews',
                    'Document access control implementation'
                  ]
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
                'Privilege management',
                'User role assignments'
              ],
              options: [
                { value: 0, label: 'Not implemented', description: 'No transaction/function restrictions', riskLevel: 'critical' },
                { value: 1, label: 'Partially implemented', description: 'Basic restrictions for some functions', riskLevel: 'high' },
                { value: 2, label: 'Largely implemented', description: 'Most transactions properly restricted', riskLevel: 'medium' },
                { value: 3, label: 'Fully implemented', description: 'Complete transaction and function controls', riskLevel: 'low' }
              ],
              evidenceRequirements: [
                { type: 'document', description: 'Role-based access control policy', required: true },
                { type: 'procedure', description: 'User privilege management procedures', required: true },
                { type: 'document', description: 'User role matrix', required: true }
              ],
              improvementSuggestions: [
                {
                  priority: 'high',
                  effort: 'medium',
                  timeframe: '3-4 weeks',
                  description: 'Define user roles and implement RBAC system',
                  resources: ['HR Department', 'IT Administrator', 'Business Process Documentation'],
                  steps: [
                    'Define user roles and responsibilities',
                    'Create role-based access control policy',
                    'Implement user privilege management procedures',
                    'Set up role-based access controls',
                    'Document user role assignments'
                  ]
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
                'Content filtering',
                'Data classification labels'
              ],
              options: [
                { value: 0, label: 'Not implemented', description: 'No information flow controls', riskLevel: 'critical' },
                { value: 1, label: 'Partially implemented', description: 'Basic flow controls for some data', riskLevel: 'high' },
                { value: 2, label: 'Largely implemented', description: 'Most information flows controlled', riskLevel: 'medium' },
                { value: 3, label: 'Fully implemented', description: 'Complete information flow control', riskLevel: 'low' }
              ],
              evidenceRequirements: [
                { type: 'document', description: 'Information flow control policy', required: true },
                { type: 'procedure', description: 'Data flow management procedures', required: true },
                { type: 'document', description: 'Data classification guide', required: true }
              ],
              improvementSuggestions: [
                {
                  priority: 'high',
                  effort: 'medium',
                  timeframe: '2-3 weeks',
                  description: 'Implement network segmentation and data flow controls',
                  resources: ['Network Administrator', 'Security Officer', 'Network Segmentation Tools'],
                  steps: [
                    'Create information flow control policy',
                    'Implement data flow management procedures',
                    'Set up network segmentation',
                    'Configure content filtering',
                    'Document data flow controls'
                  ]
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
                'Check and balance controls',
                'Approval workflows'
              ],
              options: [
                { value: 0, label: 'Not implemented', description: 'No separation of duties', riskLevel: 'high' },
                { value: 1, label: 'Partially implemented', description: 'Basic separation for critical functions', riskLevel: 'medium' },
                { value: 2, label: 'Largely implemented', description: 'Most duties properly separated', riskLevel: 'low' },
                { value: 3, label: 'Fully implemented', description: 'Complete separation of duties framework', riskLevel: 'low' }
              ],
              evidenceRequirements: [
                { type: 'document', description: 'Separation of duties policy', required: true },
                { type: 'procedure', description: 'Role assignment procedures', required: true },
                { type: 'document', description: 'Duty separation matrix', required: true }
              ],
              improvementSuggestions: [
                {
                  priority: 'medium',
                  effort: 'low',
                  timeframe: '1-2 weeks',
                  description: 'Define role separation matrix and implement dual controls',
                  resources: ['HR Department', 'Security Officer', 'Role Matrix Template'],
                  steps: [
                    'Create separation of duties policy',
                    'Define role separation matrix',
                    'Implement dual approval processes',
                    'Set up check and balance controls',
                    'Document duty separation implementation'
                  ]
                }
              ]
            },
            {
              id: 'ac.l1-3.1.5',
              text: 'Employ the principle of least privilege, including for specific security functions and privileged accounts.',
              guidance: 'Implement least privilege access controls to ensure users and systems have only the minimum access necessary to perform their functions.',
              priority: 'high',
              references: ['NIST SP 800-171 3.1.5'],
              examples: [
                'Role-based access control',
                'Privileged account management',
                'Regular access reviews',
                'Administrative account restrictions',
                'Function-specific permissions'
              ],
              options: [
                { value: 0, label: 'Not implemented', description: 'No least privilege controls', riskLevel: 'critical' },
                { value: 1, label: 'Partially implemented', description: 'Basic privilege restrictions', riskLevel: 'high' },
                { value: 2, label: 'Largely implemented', description: 'Most accounts follow least privilege', riskLevel: 'medium' },
                { value: 3, label: 'Fully implemented', description: 'Complete least privilege framework', riskLevel: 'low' }
              ],
              evidenceRequirements: [
                { type: 'document', description: 'Least privilege policy', required: true },
                { type: 'procedure', description: 'Privileged account management procedures', required: true },
                { type: 'document', description: 'Access review documentation', required: true }
              ],
              improvementSuggestions: [
                {
                  priority: 'high',
                  effort: 'medium',
                  timeframe: '2-3 weeks',
                  description: 'Implement least privilege access controls',
                  resources: ['IT Administrator', 'Security Policy Template', 'Access Management System'],
                  steps: [
                    'Create least privilege policy',
                    'Implement role-based access control',
                    'Set up privileged account management',
                    'Conduct regular access reviews',
                    'Document privilege assignments'
                  ]
                }
              ]
            },
            {
              id: 'ac.l1-3.1.6',
              text: 'Use non-privileged accounts or roles when accessing nonsecurity functions.',
              guidance: 'Ensure that administrative and privileged accounts are only used for security-related functions, while using standard user accounts for regular business operations.',
              priority: 'medium',
              references: ['NIST SP 800-171 3.1.6'],
              examples: [
                'Separate admin and user accounts',
                'Privileged account restrictions',
                'Regular account usage',
                'Account segregation',
                'Function-based account usage'
              ],
              options: [
                { value: 0, label: 'Not implemented', description: 'No account separation', riskLevel: 'high' },
                { value: 1, label: 'Partially implemented', description: 'Basic account separation', riskLevel: 'medium' },
                { value: 2, label: 'Largely implemented', description: 'Most accounts properly separated', riskLevel: 'low' },
                { value: 3, label: 'Fully implemented', description: 'Complete account separation framework', riskLevel: 'low' }
              ],
              evidenceRequirements: [
                { type: 'document', description: 'Account usage policy', required: true },
                { type: 'procedure', description: 'Account management procedures', required: true },
                { type: 'document', description: 'Account usage audit logs', required: false }
              ],
              improvementSuggestions: [
                {
                  priority: 'medium',
                  effort: 'low',
                  timeframe: '1-2 weeks',
                  description: 'Implement account separation controls',
                  resources: ['IT Administrator', 'Account Management System'],
                  steps: [
                    'Create account usage policy',
                    'Separate admin and user accounts',
                    'Implement account restrictions',
                    'Train users on proper account usage',
                    'Monitor account usage patterns'
                  ]
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
                'Unique identifiers for all entities',
                'User directory services'
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
                { type: 'screenshot', description: 'User directory listing', required: false },
                { type: 'document', description: 'Device inventory report', required: true }
              ],
              improvementSuggestions: [
                {
                  priority: 'high',
                  effort: 'low',
                  timeframe: '1-2 weeks',
                  description: 'Create comprehensive user and device inventory',
                  resources: ['IT Administrator', 'Asset Management Spreadsheet', 'User Directory System'],
                  steps: [
                    'Create user identification policy',
                    'Implement device inventory procedures',
                    'Set up user directory system',
                    'Create device inventory report',
                    'Document identification system'
                  ]
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
                'Biometric authentication',
                'Single sign-on (SSO)'
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
                { type: 'screenshot', description: 'Authentication system configuration', required: false },
                { type: 'document', description: 'Authentication system documentation', required: true }
              ],
              improvementSuggestions: [
                {
                  priority: 'high',
                  effort: 'medium',
                  timeframe: '2-3 weeks',
                  description: 'Implement strong password policies and consider MFA',
                  resources: ['IT Administrator', 'Security Policy Templates', 'MFA Solution'],
                  steps: [
                    'Create authentication policy',
                    'Implement password management procedures',
                    'Set up strong password requirements',
                    'Consider implementing MFA',
                    'Document authentication system'
                  ]
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
                'Secure disposal processes',
                'Media inventory tracking'
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
                { type: 'document', description: 'Media disposal procedures', required: true },
                { type: 'document', description: 'Media inventory log', required: true }
              ],
              improvementSuggestions: [
                {
                  priority: 'medium',
                  effort: 'low',
                  timeframe: '1-2 weeks',
                  description: 'Implement secure storage and disposal procedures for media',
                  resources: ['Physical Security Officer', 'IT Administrator', 'Media Handling Procedures'],
                  steps: [
                    'Create media protection policy',
                    'Implement media handling procedures',
                    'Set up secure storage for physical media',
                    'Implement media disposal procedures',
                    'Create media inventory tracking system'
                  ]
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
                'Security cameras',
                'Physical barriers'
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
                { type: 'document', description: 'Visitor management procedures', required: true },
                { type: 'document', description: 'Physical security assessment', required: true }
              ],
              improvementSuggestions: [
                {
                  priority: 'medium',
                  effort: 'medium',
                  timeframe: '2-4 weeks',
                  description: 'Implement comprehensive physical security controls',
                  resources: ['Facilities Manager', 'Security Officer', 'Access Control System'],
                  steps: [
                    'Create physical security policy',
                    'Implement access control procedures',
                    'Set up visitor management procedures',
                    'Install physical security controls',
                    'Conduct physical security assessment'
                  ]
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
                'Monitoring cameras',
                'Visitor identification'
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
                { type: 'document', description: 'Visitor log templates', required: true },
                { type: 'document', description: 'Visitor log records', required: true }
              ],
              improvementSuggestions: [
                {
                  priority: 'medium',
                  effort: 'low',
                  timeframe: '1-2 weeks',
                  description: 'Implement visitor management and escort procedures',
                  resources: ['Reception Staff', 'Security Officer', 'Visitor Management System'],
                  steps: [
                    'Create visitor management policy',
                    'Implement visitor escort procedures',
                    'Set up visitor log system',
                    'Train staff on visitor management',
                    'Document visitor management implementation'
                  ]
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
                'Email security controls',
                'Network segmentation'
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
                { type: 'screenshot', description: 'Firewall configuration', required: false },
                { type: 'document', description: 'Network security assessment', required: true }
              ],
              improvementSuggestions: [
                {
                  priority: 'medium',
                  effort: 'medium',
                  timeframe: '2-3 weeks',
                  description: 'Implement network monitoring and firewall protection',
                  resources: ['Network Administrator', 'Firewall Solution', 'Network Monitoring Tools'],
                  steps: [
                    'Create network security policy',
                    'Implement firewall management procedures',
                    'Configure firewall rules',
                    'Set up network monitoring',
                    'Conduct network security assessment'
                  ]
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
                'Web server separation',
                'Network isolation'
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
                { type: 'screenshot', description: 'Network diagram', required: false },
                { type: 'document', description: 'Network segmentation documentation', required: true }
              ],
              improvementSuggestions: [
                {
                  priority: 'medium',
                  effort: 'high',
                  timeframe: '4-6 weeks',
                  description: 'Implement DMZ and network segmentation',
                  resources: ['Network Administrator', 'Security Architect', 'Network Equipment'],
                  steps: [
                    'Create network architecture policy',
                    'Implement network segmentation procedures',
                    'Design DMZ architecture',
                    'Implement network segmentation',
                    'Document network segmentation'
                  ]
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
                'System monitoring',
                'Vulnerability tracking'
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
                { type: 'document', description: 'Incident reporting procedures', required: true },
                { type: 'document', description: 'Vulnerability scan reports', required: true }
              ],
              improvementSuggestions: [
                {
                  priority: 'medium',
                  effort: 'medium',
                  timeframe: '2-3 weeks',
                  description: 'Implement vulnerability scanning and patch management',
                  resources: ['IT Administrator', 'Vulnerability Scanner', 'Patch Management System'],
                  steps: [
                    'Create vulnerability management policy',
                    'Implement patch management procedures',
                    'Set up vulnerability scanning',
                    'Implement incident reporting procedures',
                    'Document vulnerability management'
                  ]
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
                'Secure storage systems',
                'Encryption key management'
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
                { type: 'screenshot', description: 'Encryption configuration', required: false },
                { type: 'document', description: 'Encryption implementation report', required: true }
              ],
              improvementSuggestions: [
                {
                  priority: 'medium',
                  effort: 'medium',
                  timeframe: '3-4 weeks',
                  description: 'Implement disk and database encryption',
                  resources: ['IT Administrator', 'Encryption Software', 'Key Management System'],
                  steps: [
                    'Create data encryption policy',
                    'Implement encryption key management procedures',
                    'Set up disk encryption',
                    'Implement database encryption',
                    'Document encryption implementation'
                  ]
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
                'Malware detection systems',
                'Endpoint protection'
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
                { type: 'screenshot', description: 'Antivirus configuration', required: false },
                { type: 'document', description: 'Malware protection report', required: true }
              ],
              improvementSuggestions: [
                {
                  priority: 'medium',
                  effort: 'low',
                  timeframe: '1-2 weeks',
                  description: 'Deploy comprehensive antivirus and malware protection',
                  resources: ['IT Administrator', 'Antivirus Software', 'Email Security Gateway'],
                  steps: [
                    'Create malware protection policy',
                    'Implement antivirus management procedures',
                    'Deploy antivirus software',
                    'Set up email security scanning',
                    'Document malware protection implementation'
                  ]
                }
              ]
            },
            {
              id: 'si.l1-3.14.5',
              text: 'Monitor organizational information systems to detect attacks and indicators of attacks.',
              guidance: 'Implement monitoring and detection capabilities to identify potential security attacks and indicators of compromise on systems containing Federal Contract Information (FCI).',
              priority: 'high',
              references: ['NIST SP 800-171 3.14.5'],
              examples: [
                'Security monitoring tools',
                'Log analysis systems',
                'Intrusion detection systems',
                'Network monitoring',
                'Endpoint detection and response'
              ],
              options: [
                { value: 0, label: 'Not implemented', description: 'No monitoring capabilities', riskLevel: 'critical' },
                { value: 1, label: 'Partially implemented', description: 'Basic monitoring on some systems', riskLevel: 'high' },
                { value: 2, label: 'Largely implemented', description: 'Most systems monitored', riskLevel: 'medium' },
                { value: 3, label: 'Fully implemented', description: 'Comprehensive monitoring framework', riskLevel: 'low' }
              ],
              evidenceRequirements: [
                { type: 'document', description: 'Security monitoring policy', required: true },
                { type: 'procedure', description: 'Incident detection procedures', required: true },
                { type: 'screenshot', description: 'Monitoring dashboard', required: false },
                { type: 'document', description: 'Monitoring configuration documentation', required: true }
              ],
              improvementSuggestions: [
                {
                  priority: 'high',
                  effort: 'medium',
                  timeframe: '3-4 weeks',
                  description: 'Implement comprehensive security monitoring',
                  resources: ['IT Administrator', 'Security Monitoring Tools', 'Log Management System'],
                  steps: [
                    'Create security monitoring policy',
                    'Implement incident detection procedures',
                    'Deploy monitoring tools',
                    'Set up log analysis',
                    'Document monitoring implementation'
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};