export interface PolicyTemplate {
  id: string;
  name: string;
  domain: string;
  practiceId: string;
  description: string;
  template: string;
  requiredFields: string[];
  optionalFields: string[];
  version: string;
  lastUpdated: string;
}

export const cmmc2Level1PolicyTemplates: PolicyTemplate[] = [
  {
    id: 'ac-access-control-policy',
    name: 'Access Control Policy',
    domain: 'Access Control (AC)',
    practiceId: 'ac.l1-3.1.1',
    description: 'Policy for controlling access to systems and information containing Federal Contract Information (FCI)',
    template: `# Access Control Policy

## 1. Purpose
This policy establishes requirements for controlling access to organizational information systems and information containing Federal Contract Information (FCI) to ensure only authorized users, processes, and devices can access sensitive data.

## 2. Scope
This policy applies to all organizational information systems, users, processes, and devices that handle Federal Contract Information (FCI).

## 3. Policy Statement
The organization shall implement access controls to limit system access to authorized users, processes acting on behalf of authorized users, and devices.

## 4. Access Control Requirements

### 4.1 User Access Management
- All users must have unique user accounts
- User accounts must be created only for authorized personnel
- User access must be reviewed regularly (at least annually)
- User accounts must be disabled immediately upon termination
- User access must be based on job responsibilities and need-to-know

### 4.2 Process Access Management
- Processes must be identified and documented
- Processes must have appropriate access controls
- Process access must be monitored and logged

### 4.3 Device Access Management
- All devices must be identified and documented
- Device access must be controlled and monitored
- Unauthorized devices must be prevented from accessing systems

## 5. Implementation Requirements

### 5.1 User Account Management
- Implement centralized user account management system
- Establish procedures for user account creation, modification, and deletion
- Implement regular access reviews
- Document all user access decisions

### 5.2 Access Control Systems
- Implement technical controls to enforce access policies
- Use strong authentication mechanisms
- Implement session management controls
- Monitor and log all access attempts

## 6. Responsibilities

### 6.1 IT Administrator
- Implement and maintain access control systems
- Conduct regular access reviews
- Manage user account lifecycle
- Monitor access control effectiveness

### 6.2 Security Officer
- Develop and maintain access control policies
- Oversee access control implementation
- Investigate access control violations
- Ensure compliance with requirements

### 6.3 Users
- Use only authorized accounts
- Protect account credentials
- Report suspicious access attempts
- Follow access control procedures

## 7. Compliance and Monitoring
- Access control effectiveness must be monitored regularly
- Violations must be investigated and reported
- Access control policies must be reviewed annually
- Compliance must be documented and maintained

## 8. Policy Review
This policy shall be reviewed annually and updated as necessary to ensure continued effectiveness and compliance with CMMC 2.0 Level 1 requirements.

**Policy Owner:** {{policyOwner}}
**Effective Date:** {{effectiveDate}}
**Review Date:** {{reviewDate}}
**Approved By:** {{approvedBy}}`,
    requiredFields: ['policyOwner', 'effectiveDate', 'reviewDate', 'approvedBy'],
    optionalFields: ['organizationName', 'contactEmail'],
    version: '2.0',
    lastUpdated: '2025-01-01'
  },
  {
    id: 'ac-rbac-policy',
    name: 'Role-Based Access Control Policy',
    domain: 'Access Control (AC)',
    practiceId: 'ac.l1-3.1.2',
    description: 'Policy for implementing role-based access control to limit system access to authorized transactions and functions',
    template: `# Role-Based Access Control Policy

## 1. Purpose
This policy establishes requirements for implementing role-based access control (RBAC) to limit system access to the types of transactions and functions that authorized users are permitted to execute.

## 2. Scope
This policy applies to all organizational information systems and users who access systems containing Federal Contract Information (FCI).

## 3. Policy Statement
The organization shall implement role-based access control to ensure users can only access the transactions and functions necessary for their job responsibilities.

## 4. Role-Based Access Control Requirements

### 4.1 Role Definition
- Roles must be defined based on job responsibilities
- Roles must be documented and approved
- Roles must be reviewed regularly
- Role assignments must be based on least privilege principle

### 4.2 Transaction Controls
- Users must only access transactions necessary for their role
- Transaction access must be logged and monitored
- Unauthorized transaction attempts must be prevented
- Transaction access must be reviewed regularly

### 4.3 Function Controls
- Users must only access functions necessary for their role
- Function access must be controlled and monitored
- Privileged functions must require additional authorization
- Function access must be documented

## 5. Implementation Requirements

### 5.1 Role Management
- Define organizational roles and responsibilities
- Create role-based access control matrix
- Implement role assignment procedures
- Establish role review processes

### 5.2 Access Control Implementation
- Implement technical controls to enforce role-based access
- Use strong authentication for role-based access
- Implement session management for role-based access
- Monitor and log all role-based access attempts

## 6. Responsibilities

### 6.1 HR Department
- Define job roles and responsibilities
- Provide role information for access control
- Notify IT of role changes
- Participate in access reviews

### 6.2 IT Administrator
- Implement role-based access control systems
- Manage role assignments
- Conduct regular role reviews
- Monitor role-based access effectiveness

### 6.3 Security Officer
- Develop and maintain RBAC policies
- Oversee RBAC implementation
- Investigate RBAC violations
- Ensure compliance with requirements

## 7. Compliance and Monitoring
- RBAC effectiveness must be monitored regularly
- Violations must be investigated and reported
- RBAC policies must be reviewed annually
- Compliance must be documented and maintained

## 8. Policy Review
This policy shall be reviewed annually and updated as necessary to ensure continued effectiveness and compliance with CMMC 2.0 Level 1 requirements.

**Policy Owner:** {{policyOwner}}
**Effective Date:** {{effectiveDate}}
**Review Date:** {{reviewDate}}
**Approved By:** {{approvedBy}}`,
    requiredFields: ['policyOwner', 'effectiveDate', 'reviewDate', 'approvedBy'],
    optionalFields: ['organizationName', 'contactEmail'],
    version: '2.0',
    lastUpdated: '2025-01-01'
  },
  {
    id: 'ac-information-flow-policy',
    name: 'Information Flow Control Policy',
    domain: 'Access Control (AC)',
    practiceId: 'ac.l1-3.1.3',
    description: 'Policy for controlling the flow of Federal Contract Information (FCI) in accordance with approved authorizations',
    template: `# Information Flow Control Policy

## 1. Purpose
This policy establishes requirements for controlling the flow of Federal Contract Information (FCI) in accordance with approved authorizations to prevent unauthorized disclosure or modification.

## 2. Scope
This policy applies to all information systems, networks, and communication channels that handle Federal Contract Information (FCI).

## 3. Policy Statement
The organization shall implement information flow controls to regulate where FCI can travel within and between systems in accordance with approved authorizations.

## 4. Information Flow Control Requirements

### 4.1 Data Classification
- All FCI must be properly classified and labeled
- Data classification must be based on sensitivity and impact
- Classification labels must be visible and persistent
- Data classification must be reviewed regularly

### 4.2 Flow Control Implementation
- Information flow must be controlled at system boundaries
- Network segmentation must be implemented
- Content filtering must be used
- Data loss prevention controls must be implemented

### 4.3 Authorization Requirements
- Information flow must be based on approved authorizations
- Flow authorizations must be documented
- Authorization changes must be approved
- Flow authorizations must be reviewed regularly

## 5. Implementation Requirements

### 5.1 Network Controls
- Implement network segmentation
- Configure firewalls and routers
- Use content filtering systems
- Implement data loss prevention

### 5.2 System Controls
- Implement access controls at system boundaries
- Use encryption for data in transit
- Implement monitoring and logging
- Establish incident response procedures

## 6. Responsibilities

### 6.1 Network Administrator
- Implement network segmentation
- Configure network security controls
- Monitor network traffic
- Maintain network security documentation

### 6.2 Security Officer
- Develop information flow control policies
- Oversee flow control implementation
- Investigate flow control violations
- Ensure compliance with requirements

### 6.3 Users
- Follow information flow procedures
- Report unauthorized information flow
- Protect FCI during transmission
- Use approved communication channels

## 7. Compliance and Monitoring
- Information flow must be monitored regularly
- Violations must be investigated and reported
- Flow control policies must be reviewed annually
- Compliance must be documented and maintained

## 8. Policy Review
This policy shall be reviewed annually and updated as necessary to ensure continued effectiveness and compliance with CMMC 2.0 Level 1 requirements.

**Policy Owner:** {{policyOwner}}
**Effective Date:** {{effectiveDate}}
**Review Date:** {{reviewDate}}
**Approved By:** {{approvedBy}}`,
    requiredFields: ['policyOwner', 'effectiveDate', 'reviewDate', 'approvedBy'],
    optionalFields: ['organizationName', 'contactEmail'],
    version: '2.0',
    lastUpdated: '2025-01-01'
  },
  {
    id: 'ac-separation-of-duties-policy',
    name: 'Separation of Duties Policy',
    domain: 'Access Control (AC)',
    practiceId: 'ac.l1-3.1.4',
    description: 'Policy for implementing separation of duties to reduce the risk of malevolent activity without collusion',
    template: `# Separation of Duties Policy

## 1. Purpose
This policy establishes requirements for implementing separation of duties to reduce the risk of malevolent activity without collusion and ensure no single individual has complete control over critical functions.

## 2. Scope
This policy applies to all organizational functions involving Federal Contract Information (FCI) and critical business processes.

## 3. Policy Statement
The organization shall implement separation of duties to ensure no single individual has complete control over critical functions involving FCI.

## 4. Separation of Duties Requirements

### 4.1 Critical Function Identification
- Critical functions must be identified and documented
- Functions involving FCI must be considered critical
- Risk assessment must be conducted for each critical function
- Separation requirements must be defined for each function

### 4.2 Duty Separation Implementation
- Critical functions must be separated among multiple individuals
- Dual approval must be required for critical transactions
- Check and balance controls must be implemented
- Segregation must be documented and monitored

### 4.3 Collusion Prevention
- Individuals with conflicting duties must be separated
- Regular rotation of duties must be implemented
- Monitoring and oversight must be established
- Violations must be investigated and reported

## 5. Implementation Requirements

### 5.1 Duty Assignment
- Define roles and responsibilities for critical functions
- Assign duties to different individuals
- Implement dual approval processes
- Establish check and balance controls

### 5.2 Monitoring and Oversight
- Implement monitoring of critical functions
- Conduct regular reviews of duty assignments
- Establish oversight procedures
- Document all duty assignments and changes

## 6. Responsibilities

### 6.1 Management
- Approve duty separation assignments
- Oversee implementation of separation of duties
- Ensure compliance with requirements
- Investigate violations

### 6.2 HR Department
- Assist in defining roles and responsibilities
- Implement duty rotation programs
- Maintain duty assignment records
- Participate in compliance reviews

### 6.3 Security Officer
- Develop separation of duties policies
- Oversee implementation
- Investigate violations
- Ensure compliance with requirements

## 7. Compliance and Monitoring
- Separation of duties must be monitored regularly
- Violations must be investigated and reported
- Policies must be reviewed annually
- Compliance must be documented and maintained

## 8. Policy Review
This policy shall be reviewed annually and updated as necessary to ensure continued effectiveness and compliance with CMMC 2.0 Level 1 requirements.

**Policy Owner:** {{policyOwner}}
**Effective Date:** {{effectiveDate}}
**Review Date:** {{reviewDate}}
**Approved By:** {{approvedBy}}`,
    requiredFields: ['policyOwner', 'effectiveDate', 'reviewDate', 'approvedBy'],
    optionalFields: ['organizationName', 'contactEmail'],
    version: '2.0',
    lastUpdated: '2025-01-01'
  },
  {
    id: 'ia-user-identification-policy',
    name: 'User Identification Policy',
    domain: 'Identification and Authentication (IA)',
    practiceId: 'ia.l1-3.5.1',
    description: 'Policy for identifying information system users, processes acting on behalf of users, and devices',
    template: `# User Identification Policy

## 1. Purpose
This policy establishes requirements for identifying information system users, processes acting on behalf of users, and devices to ensure proper accountability and access control.

## 2. Scope
This policy applies to all organizational information systems, users, processes, and devices that access systems containing Federal Contract Information (FCI).

## 3. Policy Statement
The organization shall implement a comprehensive identification system to identify all users, processes, and devices that access organizational information systems.

## 4. Identification Requirements

### 4.1 User Identification
- All users must have unique identifiers
- User identifiers must be linked to individual users
- User identification must be documented and maintained
- User identification must be reviewed regularly

### 4.2 Process Identification
- All processes must be identified and documented
- Process identifiers must be unique and traceable
- Process identification must be maintained
- Process identification must be reviewed regularly

### 4.3 Device Identification
- All devices must be identified and documented
- Device identifiers must be unique and traceable
- Device identification must be maintained
- Device identification must be reviewed regularly

## 5. Implementation Requirements

### 5.1 Identification System
- Implement centralized identification system
- Establish unique identifier format
- Create identification procedures
- Implement identification monitoring

### 5.2 Documentation Requirements
- Maintain user directory
- Document all processes
- Maintain device inventory
- Create identification reports

## 6. Responsibilities

### 6.1 IT Administrator
- Implement identification system
- Maintain user directory
- Manage device inventory
- Conduct identification reviews

### 6.2 Security Officer
- Develop identification policies
- Oversee identification implementation
- Investigate identification violations
- Ensure compliance with requirements

### 6.3 Users
- Use only assigned identifiers
- Protect identifier information
- Report identifier issues
- Follow identification procedures

## 7. Compliance and Monitoring
- Identification system must be monitored regularly
- Violations must be investigated and reported
- Identification policies must be reviewed annually
- Compliance must be documented and maintained

## 8. Policy Review
This policy shall be reviewed annually and updated as necessary to ensure continued effectiveness and compliance with CMMC 2.0 Level 1 requirements.

**Policy Owner:** {{policyOwner}}
**Effective Date:** {{effectiveDate}}
**Review Date:** {{reviewDate}}
**Approved By:** {{approvedBy}}`,
    requiredFields: ['policyOwner', 'effectiveDate', 'reviewDate', 'approvedBy'],
    optionalFields: ['organizationName', 'contactEmail'],
    version: '2.0',
    lastUpdated: '2025-01-01'
  },
  {
    id: 'ia-authentication-policy',
    name: 'Authentication Policy',
    domain: 'Identification and Authentication (IA)',
    practiceId: 'ia.l1-3.5.2',
    description: 'Policy for authenticating users, processes, and devices before allowing access to organizational information systems',
    template: `# Authentication Policy

## 1. Purpose
This policy establishes requirements for authenticating users, processes, and devices before allowing access to organizational information systems containing Federal Contract Information (FCI).

## 2. Scope
This policy applies to all organizational information systems, users, processes, and devices that access systems containing FCI.

## 3. Policy Statement
The organization shall implement authentication mechanisms to verify the identity of users, processes, and devices before granting access to organizational information systems.

## 4. Authentication Requirements

### 4.1 User Authentication
- All users must be authenticated before system access
- Strong authentication mechanisms must be used
- Authentication must be required for all system access
- Authentication must be monitored and logged

### 4.2 Process Authentication
- Processes must be authenticated before system access
- Process authentication must be automated
- Process authentication must be monitored
- Process authentication must be documented

### 4.3 Device Authentication
- Devices must be authenticated before system access
- Device authentication must be automated
- Device authentication must be monitored
- Device authentication must be documented

## 5. Implementation Requirements

### 5.1 Authentication Mechanisms
- Implement strong password requirements
- Consider multi-factor authentication
- Use secure authentication protocols
- Implement session management

### 5.2 Authentication Systems
- Deploy centralized authentication system
- Implement single sign-on where appropriate
- Use encryption for authentication data
- Monitor authentication attempts

## 6. Responsibilities

### 6.1 IT Administrator
- Implement authentication systems
- Manage authentication policies
- Monitor authentication effectiveness
- Maintain authentication documentation

### 6.2 Security Officer
- Develop authentication policies
- Oversee authentication implementation
- Investigate authentication violations
- Ensure compliance with requirements

### 6.3 Users
- Use strong passwords
- Protect authentication credentials
- Report authentication issues
- Follow authentication procedures

## 7. Compliance and Monitoring
- Authentication must be monitored regularly
- Violations must be investigated and reported
- Authentication policies must be reviewed annually
- Compliance must be documented and maintained

## 8. Policy Review
This policy shall be reviewed annually and updated as necessary to ensure continued effectiveness and compliance with CMMC 2.0 Level 1 requirements.

**Policy Owner:** {{policyOwner}}
**Effective Date:** {{effectiveDate}}
**Review Date:** {{reviewDate}}
**Approved By:** {{approvedBy}}`,
    requiredFields: ['policyOwner', 'effectiveDate', 'reviewDate', 'approvedBy'],
    optionalFields: ['organizationName', 'contactEmail'],
    version: '2.0',
    lastUpdated: '2025-01-01'
  },
  {
    id: 'mp-media-protection-policy',
    name: 'Media Protection Policy',
    domain: 'Media Protection (MP)',
    practiceId: 'mp.l1-3.8.3',
    description: 'Policy for protecting system media containing Federal Contract Information (FCI)',
    template: `# Media Protection Policy

## 1. Purpose
This policy establishes requirements for protecting system media containing Federal Contract Information (FCI) through physical control, secure storage, sanitization for disposal, and destruction.

## 2. Scope
This policy applies to all system media, both paper and digital, that contain or have contained Federal Contract Information (FCI).

## 3. Policy Statement
The organization shall implement comprehensive media protection controls to safeguard FCI throughout the media lifecycle.

## 4. Media Protection Requirements

### 4.1 Physical Control
- Media must be physically controlled and secured
- Access to media must be restricted to authorized personnel
- Media must be stored in secure locations
- Media must be tracked and inventoried

### 4.2 Secure Storage
- Media must be stored in secure, controlled environments
- Storage areas must be protected from unauthorized access
- Environmental controls must be implemented
- Media must be protected from damage

### 4.3 Sanitization and Disposal
- Media must be sanitized before disposal
- Sanitization methods must be appropriate for media type
- Disposal must be documented and verified
- Destruction must be complete and irreversible

## 5. Implementation Requirements

### 5.1 Media Inventory
- Maintain comprehensive media inventory
- Track media location and status
- Conduct regular media audits
- Document all media movements

### 5.2 Storage Controls
- Implement secure storage facilities
- Use appropriate storage containers
- Control access to storage areas
- Monitor storage environment

### 5.3 Disposal Procedures
- Establish media disposal procedures
- Implement sanitization processes
- Document disposal activities
- Verify complete destruction

## 6. Responsibilities

### 6.1 Physical Security Officer
- Implement physical security controls
- Manage secure storage facilities
- Oversee media disposal procedures
- Conduct security assessments

### 6.2 IT Administrator
- Maintain media inventory
- Implement technical controls
- Manage media lifecycle
- Monitor media protection

### 6.3 Users
- Follow media handling procedures
- Protect media from unauthorized access
- Report media security incidents
- Participate in media audits

## 7. Compliance and Monitoring
- Media protection must be monitored regularly
- Violations must be investigated and reported
- Media protection policies must be reviewed annually
- Compliance must be documented and maintained

## 8. Policy Review
This policy shall be reviewed annually and updated as necessary to ensure continued effectiveness and compliance with CMMC 2.0 Level 1 requirements.

**Policy Owner:** {{policyOwner}}
**Effective Date:** {{effectiveDate}}
**Review Date:** {{reviewDate}}
**Approved By:** {{approvedBy}}`,
    requiredFields: ['policyOwner', 'effectiveDate', 'reviewDate', 'approvedBy'],
    optionalFields: ['organizationName', 'contactEmail'],
    version: '2.0',
    lastUpdated: '2025-01-01'
  },
  {
    id: 'pe-physical-protection-policy',
    name: 'Physical Protection Policy',
    domain: 'Physical Protection (PE)',
    practiceId: 'pe.l1-3.10.1',
    description: 'Policy for limiting physical access to organizational information systems, equipment, and operating environments',
    template: `# Physical Protection Policy

## 1. Purpose
This policy establishes requirements for limiting physical access to organizational information systems, equipment, and operating environments to authorized individuals.

## 2. Scope
This policy applies to all organizational facilities, information systems, equipment, and operating environments that handle Federal Contract Information (FCI).

## 3. Policy Statement
The organization shall implement physical security controls to restrict access to systems and equipment containing FCI to authorized individuals only.

## 4. Physical Protection Requirements

### 4.1 Access Control
- Physical access must be restricted to authorized individuals
- Access control systems must be implemented
- Access must be monitored and logged
- Unauthorized access must be prevented

### 4.2 Facility Security
- Facilities must be secured and protected
- Security barriers must be implemented
- Surveillance systems must be deployed
- Environmental controls must be maintained

### 4.3 Equipment Protection
- Equipment must be physically secured
- Equipment must be protected from damage
- Equipment must be monitored
- Equipment must be inventoried

## 5. Implementation Requirements

### 5.1 Access Control Systems
- Implement physical access control systems
- Use locks, keys, and access cards
- Deploy surveillance cameras
- Establish access procedures

### 5.2 Security Measures
- Install security barriers
- Implement lighting controls
- Deploy alarm systems
- Establish security procedures

## 6. Responsibilities

### 6.1 Facilities Manager
- Implement physical security controls
- Manage access control systems
- Oversee facility security
- Conduct security assessments

### 6.2 Security Officer
- Develop physical security policies
- Oversee security implementation
- Investigate security violations
- Ensure compliance with requirements

### 6.3 IT Administrator
- Secure IT equipment
- Implement equipment controls
- Monitor equipment security
- Maintain equipment inventory

## 7. Compliance and Monitoring
- Physical security must be monitored regularly
- Violations must be investigated and reported
- Physical security policies must be reviewed annually
- Compliance must be documented and maintained

## 8. Policy Review
This policy shall be reviewed annually and updated as necessary to ensure continued effectiveness and compliance with CMMC 2.0 Level 1 requirements.

**Policy Owner:** {{policyOwner}}
**Effective Date:** {{effectiveDate}}
**Review Date:** {{reviewDate}}
**Approved By:** {{approvedBy}}`,
    requiredFields: ['policyOwner', 'effectiveDate', 'reviewDate', 'approvedBy'],
    optionalFields: ['organizationName', 'contactEmail'],
    version: '2.0',
    lastUpdated: '2025-01-01'
  },
  {
    id: 'pe-visitor-management-policy',
    name: 'Visitor Management Policy',
    domain: 'Physical Protection (PE)',
    practiceId: 'pe.l1-3.10.2',
    description: 'Policy for escorting visitors and monitoring visitor activity',
    template: `# Visitor Management Policy

## 1. Purpose
This policy establishes requirements for escorting visitors and monitoring visitor activity to ensure security and protect Federal Contract Information (FCI).

## 2. Scope
This policy applies to all visitors to organizational facilities that handle FCI and all personnel responsible for visitor management.

## 3. Policy Statement
The organization shall implement comprehensive visitor management procedures to ensure all visitors are properly escorted and monitored when accessing areas containing FCI.

## 4. Visitor Management Requirements

### 4.1 Visitor Identification
- All visitors must be identified and documented
- Visitor identification must be verified
- Visitor information must be recorded
- Visitor access must be authorized

### 4.2 Visitor Escort
- Visitors must be escorted at all times
- Escorts must be authorized personnel
- Escort procedures must be documented
- Escort responsibilities must be defined

### 4.3 Visitor Monitoring
- Visitor activity must be monitored
- Monitoring must be documented
- Suspicious activity must be reported
- Visitor access must be logged

## 5. Implementation Requirements

### 5.1 Visitor Registration
- Implement visitor registration system
- Create visitor log forms
- Establish visitor check-in procedures
- Implement visitor identification system

### 5.2 Escort Procedures
- Define escort responsibilities
- Establish escort procedures
- Train escort personnel
- Monitor escort effectiveness

### 5.3 Monitoring Systems
- Deploy surveillance systems
- Implement monitoring procedures
- Establish reporting procedures
- Document monitoring activities

## 6. Responsibilities

### 6.1 Reception Staff
- Register all visitors
- Verify visitor identification
- Issue visitor badges
- Maintain visitor logs

### 6.2 Escort Personnel
- Escort visitors at all times
- Monitor visitor activity
- Report suspicious behavior
- Ensure visitor compliance

### 6.3 Security Officer
- Develop visitor management policies
- Oversee visitor management implementation
- Investigate visitor violations
- Ensure compliance with requirements

## 7. Compliance and Monitoring
- Visitor management must be monitored regularly
- Violations must be investigated and reported
- Visitor management policies must be reviewed annually
- Compliance must be documented and maintained

## 8. Policy Review
This policy shall be reviewed annually and updated as necessary to ensure continued effectiveness and compliance with CMMC 2.0 Level 1 requirements.

**Policy Owner:** {{policyOwner}}
**Effective Date:** {{effectiveDate}}
**Review Date:** {{reviewDate}}
**Approved By:** {{approvedBy}}`,
    requiredFields: ['policyOwner', 'effectiveDate', 'reviewDate', 'approvedBy'],
    optionalFields: ['organizationName', 'contactEmail'],
    version: '2.0',
    lastUpdated: '2025-01-01'
  },
  {
    id: 'sc-network-security-policy',
    name: 'Network Security Policy',
    domain: 'System and Communications Protection (SC)',
    practiceId: 'sc.l1-3.13.1',
    description: 'Policy for monitoring, controlling, and protecting organizational communications',
    template: `# Network Security Policy

## 1. Purpose
This policy establishes requirements for monitoring, controlling, and protecting organizational communications at external boundaries and key internal boundaries of information systems.

## 2. Scope
This policy applies to all organizational information systems, networks, and communication channels that handle Federal Contract Information (FCI).

## 3. Policy Statement
The organization shall implement network security controls to monitor, control, and protect organizational communications containing FCI.

## 4. Network Security Requirements

### 4.1 Communication Monitoring
- All communications must be monitored
- Monitoring must be automated where possible
- Monitoring must be documented
- Suspicious activity must be reported

### 4.2 Communication Control
- Communications must be controlled at system boundaries
- Access controls must be implemented
- Traffic filtering must be used
- Unauthorized communications must be prevented

### 4.3 Communication Protection
- Communications must be protected from interception
- Encryption must be used for sensitive communications
- Secure protocols must be implemented
- Communication integrity must be maintained

## 5. Implementation Requirements

### 5.1 Network Controls
- Implement firewalls and routers
- Deploy intrusion detection systems
- Use content filtering systems
- Implement network monitoring

### 5.2 Security Measures
- Use encryption for sensitive communications
- Implement secure protocols
- Deploy security gateways
- Establish incident response procedures

## 6. Responsibilities

### 6.1 Network Administrator
- Implement network security controls
- Configure firewalls and routers
- Monitor network traffic
- Maintain network security documentation

### 6.2 Security Officer
- Develop network security policies
- Oversee network security implementation
- Investigate network security violations
- Ensure compliance with requirements

### 6.3 Users
- Follow network security procedures
- Report network security incidents
- Use secure communication methods
- Protect network credentials

## 7. Compliance and Monitoring
- Network security must be monitored regularly
- Violations must be investigated and reported
- Network security policies must be reviewed annually
- Compliance must be documented and maintained

## 8. Policy Review
This policy shall be reviewed annually and updated as necessary to ensure continued effectiveness and compliance with CMMC 2.0 Level 1 requirements.

**Policy Owner:** {{policyOwner}}
**Effective Date:** {{effectiveDate}}
**Review Date:** {{reviewDate}}
**Approved By:** {{approvedBy}}`,
    requiredFields: ['policyOwner', 'effectiveDate', 'reviewDate', 'approvedBy'],
    optionalFields: ['organizationName', 'contactEmail'],
    version: '2.0',
    lastUpdated: '2025-01-01'
  },
  {
    id: 'sc-network-segmentation-policy',
    name: 'Network Segmentation Policy',
    domain: 'System and Communications Protection (SC)',
    practiceId: 'sc.l1-3.13.8',
    description: 'Policy for implementing subnetworks for publicly accessible system components',
    template: `# Network Segmentation Policy

## 1. Purpose
This policy establishes requirements for implementing subnetworks for publicly accessible system components that are physically or logically separated from internal networks.

## 2. Scope
This policy applies to all organizational networks, publicly accessible systems, and internal systems that handle Federal Contract Information (FCI).

## 3. Policy Statement
The organization shall implement network segmentation to isolate publicly accessible systems from internal networks containing FCI.

## 4. Network Segmentation Requirements

### 4.1 DMZ Implementation
- Demilitarized Zone (DMZ) must be implemented
- Public systems must be placed in DMZ
- DMZ must be isolated from internal networks
- DMZ security must be maintained

### 4.2 Network Isolation
- Public systems must be isolated from internal systems
- Network segmentation must be implemented
- Access controls must be enforced
- Traffic flow must be controlled

### 4.3 Security Controls
- Firewalls must be implemented at boundaries
- Access controls must be enforced
- Monitoring must be implemented
- Incident response must be established

## 5. Implementation Requirements

### 5.1 Network Architecture
- Design segmented network architecture
- Implement DMZ infrastructure
- Configure network boundaries
- Establish security controls

### 5.2 Security Implementation
- Deploy firewalls at boundaries
- Implement access control lists
- Configure network monitoring
- Establish incident response procedures

## 6. Responsibilities

### 6.1 Network Administrator
- Implement network segmentation
- Configure DMZ infrastructure
- Manage network security controls
- Monitor network segmentation

### 6.2 Security Architect
- Design network architecture
- Oversee segmentation implementation
- Ensure security requirements
- Conduct security assessments

### 6.3 Security Officer
- Develop network segmentation policies
- Oversee implementation
- Investigate violations
- Ensure compliance with requirements

## 7. Compliance and Monitoring
- Network segmentation must be monitored regularly
- Violations must be investigated and reported
- Network segmentation policies must be reviewed annually
- Compliance must be documented and maintained

## 8. Policy Review
This policy shall be reviewed annually and updated as necessary to ensure continued effectiveness and compliance with CMMC 2.0 Level 1 requirements.

**Policy Owner:** {{policyOwner}}
**Effective Date:** {{effectiveDate}}
**Review Date:** {{reviewDate}}
**Approved By:** {{approvedBy}}`,
    requiredFields: ['policyOwner', 'effectiveDate', 'reviewDate', 'approvedBy'],
    optionalFields: ['organizationName', 'contactEmail'],
    version: '2.0',
    lastUpdated: '2025-01-01'
  },
  {
    id: 'si-vulnerability-management-policy',
    name: 'Vulnerability Management Policy',
    domain: 'System and Information Integrity (SI)',
    practiceId: 'si.l1-3.14.1',
    description: 'Policy for identifying, reporting, and correcting information and information system flaws',
    template: `# Vulnerability Management Policy

## 1. Purpose
This policy establishes requirements for identifying, reporting, and correcting information and information system flaws in a timely manner to protect Federal Contract Information (FCI).

## 2. Scope
This policy applies to all organizational information systems, applications, and infrastructure that handle FCI.

## 3. Policy Statement
The organization shall implement comprehensive vulnerability management processes to identify, report, and remediate vulnerabilities in systems containing FCI.

## 4. Vulnerability Management Requirements

### 4.1 Vulnerability Identification
- Vulnerabilities must be identified through scanning
- Vulnerability assessments must be conducted regularly
- Vulnerabilities must be documented
- Vulnerability tracking must be implemented

### 4.2 Vulnerability Reporting
- Vulnerabilities must be reported promptly
- Reporting procedures must be established
- Vulnerability reports must be documented
- Reporting must be tracked

### 4.3 Vulnerability Correction
- Vulnerabilities must be corrected in a timely manner
- Patch management must be implemented
- Correction procedures must be established
- Correction must be verified

## 5. Implementation Requirements

### 5.1 Vulnerability Scanning
- Implement automated vulnerability scanning
- Conduct regular vulnerability assessments
- Use multiple scanning tools
- Document scanning results

### 5.2 Patch Management
- Implement patch management process
- Prioritize patches based on risk
- Test patches before deployment
- Document patch deployment

### 5.3 Incident Response
- Establish vulnerability incident response
- Implement reporting procedures
- Create escalation procedures
- Document incident response

## 6. Responsibilities

### 6.1 IT Administrator
- Implement vulnerability scanning
- Manage patch deployment
- Monitor vulnerability status
- Maintain vulnerability documentation

### 6.2 Security Officer
- Develop vulnerability management policies
- Oversee vulnerability management
- Investigate vulnerability incidents
- Ensure compliance with requirements

### 6.3 Users
- Report suspected vulnerabilities
- Follow patch management procedures
- Participate in vulnerability assessments
- Report security incidents

## 7. Compliance and Monitoring
- Vulnerability management must be monitored regularly
- Violations must be investigated and reported
- Vulnerability management policies must be reviewed annually
- Compliance must be documented and maintained

## 8. Policy Review
This policy shall be reviewed annually and updated as necessary to ensure continued effectiveness and compliance with CMMC 2.0 Level 1 requirements.

**Policy Owner:** {{policyOwner}}
**Effective Date:** {{effectiveDate}}
**Review Date:** {{reviewDate}}
**Approved By:** {{approvedBy}}`,
    requiredFields: ['policyOwner', 'effectiveDate', 'reviewDate', 'approvedBy'],
    optionalFields: ['organizationName', 'contactEmail'],
    version: '2.0',
    lastUpdated: '2025-01-01'
  },
  {
    id: 'si-data-encryption-policy',
    name: 'Data Encryption Policy',
    domain: 'System and Information Integrity (SI)',
    practiceId: 'si.l1-3.14.2',
    description: 'Policy for protecting information at rest',
    template: `# Data Encryption Policy

## 1. Purpose
This policy establishes requirements for protecting information at rest through encryption and other protective measures to safeguard Federal Contract Information (FCI).

## 2. Scope
This policy applies to all organizational information systems, storage devices, and media that contain FCI.

## 3. Policy Statement
The organization shall implement encryption and other protective measures for FCI stored on systems and media.

## 4. Data Encryption Requirements

### 4.1 Encryption Implementation
- FCI must be encrypted at rest
- Strong encryption algorithms must be used
- Encryption keys must be managed securely
- Encryption must be verified

### 4.2 Key Management
- Encryption keys must be managed securely
- Key rotation must be implemented
- Key access must be controlled
- Key backup must be implemented

### 4.3 Encryption Monitoring
- Encryption status must be monitored
- Encryption violations must be reported
- Encryption effectiveness must be assessed
- Encryption must be documented

## 5. Implementation Requirements

### 5.1 Disk Encryption
- Implement full disk encryption
- Use strong encryption algorithms
- Manage encryption keys securely
- Monitor encryption status

### 5.2 Database Encryption
- Implement database encryption
- Encrypt sensitive data fields
- Use transparent data encryption
- Monitor database encryption

### 5.3 File Encryption
- Implement file-level encryption
- Encrypt sensitive files
- Use encryption for file transfers
- Monitor file encryption

## 6. Responsibilities

### 6.1 IT Administrator
- Implement encryption systems
- Manage encryption keys
- Monitor encryption status
- Maintain encryption documentation

### 6.2 Security Officer
- Develop encryption policies
- Oversee encryption implementation
- Investigate encryption violations
- Ensure compliance with requirements

### 6.3 Users
- Follow encryption procedures
- Protect encryption keys
- Report encryption issues
- Use encrypted systems

## 7. Compliance and Monitoring
- Data encryption must be monitored regularly
- Violations must be investigated and reported
- Data encryption policies must be reviewed annually
- Compliance must be documented and maintained

## 8. Policy Review
This policy shall be reviewed annually and updated as necessary to ensure continued effectiveness and compliance with CMMC 2.0 Level 1 requirements.

**Policy Owner:** {{policyOwner}}
**Effective Date:** {{effectiveDate}}
**Review Date:** {{reviewDate}}
**Approved By:** {{approvedBy}}`,
    requiredFields: ['policyOwner', 'effectiveDate', 'reviewDate', 'approvedBy'],
    optionalFields: ['organizationName', 'contactEmail'],
    version: '2.0',
    lastUpdated: '2025-01-01'
  },
  {
    id: 'si-malware-protection-policy',
    name: 'Malware Protection Policy',
    domain: 'System and Information Integrity (SI)',
    practiceId: 'si.l1-3.14.4',
    description: 'Policy for detecting malicious code at organizational information system entry and exit points',
    template: `# Malware Protection Policy

## 1. Purpose
This policy establishes requirements for detecting malicious code at organizational information system entry and exit points to protect Federal Contract Information (FCI).

## 2. Scope
This policy applies to all organizational information systems, endpoints, and communication channels that handle FCI.

## 3. Policy Statement
The organization shall implement comprehensive malware protection to detect malicious code at system entry and exit points.

## 4. Malware Protection Requirements

### 4.1 Malware Detection
- Malware must be detected at system entry points
- Malware must be detected at system exit points
- Detection must be automated where possible
- Detection must be documented

### 4.2 Malware Prevention
- Malware must be prevented from entering systems
- Malware must be prevented from spreading
- Prevention measures must be implemented
- Prevention must be monitored

### 4.3 Malware Response
- Malware incidents must be responded to promptly
- Response procedures must be established
- Incident response must be documented
- Response must be verified

## 5. Implementation Requirements

### 5.1 Antivirus Software
- Deploy antivirus software on all endpoints
- Keep antivirus signatures updated
- Configure real-time scanning
- Monitor antivirus effectiveness

### 5.2 Email Security
- Implement email security scanning
- Use content filtering
- Block malicious attachments
- Monitor email security

### 5.3 Web Security
- Implement web content filtering
- Block malicious websites
- Scan downloads
- Monitor web security

## 6. Responsibilities

### 6.1 IT Administrator
- Deploy malware protection systems
- Manage malware protection software
- Monitor malware protection effectiveness
- Maintain malware protection documentation

### 6.2 Security Officer
- Develop malware protection policies
- Oversee malware protection implementation
- Investigate malware incidents
- Ensure compliance with requirements

### 6.3 Users
- Follow malware protection procedures
- Report suspected malware
- Use approved software
- Participate in security training

## 7. Compliance and Monitoring
- Malware protection must be monitored regularly
- Violations must be investigated and reported
- Malware protection policies must be reviewed annually
- Compliance must be documented and maintained

## 8. Policy Review
This policy shall be reviewed annually and updated as necessary to ensure continued effectiveness and compliance with CMMC 2.0 Level 1 requirements.

**Policy Owner:** {{policyOwner}}
**Effective Date:** {{effectiveDate}}
**Review Date:** {{reviewDate}}
**Approved By:** {{approvedBy}}`,
    requiredFields: ['policyOwner', 'effectiveDate', 'reviewDate', 'approvedBy'],
    optionalFields: ['organizationName', 'contactEmail'],
    version: '2.0',
    lastUpdated: '2025-01-01'
  }
];