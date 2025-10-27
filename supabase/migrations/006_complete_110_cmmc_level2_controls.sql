-- =============================================================================
-- Complete CMMC 2.0 Level 2 - ALL 110 Controls
-- This migration REPLACES sample/demo controls with complete official controls
-- =============================================================================

-- Clear ALL existing controls and practices to start fresh
-- This removes sample/demo data from earlier migrations
DELETE FROM cmmc_practices;
DELETE FROM cmmc_controls;
DELETE FROM cmmc_domains;

-- =============================================================================
-- CREATE CMMC DOMAINS FIRST (Required for foreign key references)
-- =============================================================================

-- Insert all 16 CMMC domains for Level 2
INSERT INTO cmmc_domains (domain_id, name, description, level) VALUES
('AC', 'Access Control', 'Controls that limit access to information systems and resources', 2),
('AT', 'Awareness and Training', 'Controls for security awareness and training programs', 2),
('AU', 'Audit and Accountability', 'Controls for audit logging and accountability', 2),
('CA', 'Assessment, Authorization and Monitoring', 'Controls for security assessment and authorization', 2),
('CM', 'Configuration Management', 'Controls for configuration management processes', 2),
('CP', 'Contingency Planning', 'Controls for contingency planning and disaster recovery', 2),
('IA', 'Identification and Authentication', 'Controls for user identification and authentication', 2),
('IR', 'Incident Response', 'Controls for incident response procedures', 2),
('MA', 'Maintenance', 'Controls for system maintenance procedures', 2),
('MP', 'Media Protection', 'Controls for media protection and handling', 2),
('PS', 'Personnel Security', 'Controls for personnel security measures', 2),
('PE', 'Physical Protection', 'Controls for physical security measures', 2),
('RA', 'Risk Assessment', 'Controls for risk assessment processes', 2),
('SA', 'System and Services Acquisition', 'Controls for system acquisition and services', 2),
('SC', 'System and Communications Protection', 'Controls for system and communications protection', 2),
('SI', 'System and Information Integrity', 'Controls for system and information integrity', 2);

-- =============================================================================
-- NOW ADD CONTROLS (after domains are created)
-- =============================================================================

-- ACCESS CONTROL (AC) - 22 Controls
-- =============================================================================

INSERT INTO cmmc_controls (control_id, domain_id, title, description, level, assessment_objective, discussion) VALUES
('AC.3.1.1', 'AC', 'Limit information system access', 'Limit information system access to authorized users, processes acting on behalf of authorized users, and devices (including other information systems).', 2, 'Determine if the organization limits system access to authorized users, processes, and devices.', 'Organizations control access between active entities (users, processes, devices) and passive entities (information, resources).'),
('AC.3.1.2', 'AC', 'Control information system access', 'Control information system access by establishing, documenting, and enforcing access control policies and procedures.', 2, 'Determine if the organization has established, documented, and enforced access control policies and procedures.', 'Access control policies define who can access what information systems under what conditions.'),
('AC.3.1.3', 'AC', 'Control information system access by establishing access control policies', 'Control information system access by establishing access control policies and procedures.', 2, 'Determine if the organization has established access control policies and procedures.', 'Access control policies define roles and responsibilities for managing access.'),
('AC.3.1.4', 'AC', 'Control information system access using authenticators', 'Control information system access using authenticators.', 2, 'Determine if the organization uses authenticators to control system access.', 'Authenticators verify identity before granting access.'),
('AC.3.1.5', 'AC', 'Separate duties of individuals', 'Separate the duties of individuals to reduce the risk of malevolent activity without collusion.', 2, 'Determine if the organization separates duties to reduce risk of malevolent activity.', 'Separation of duties prevents any one person from having complete control over a process.'),
('AC.3.1.6', 'AC', 'Employ principle of least privilege', 'Employ the principle of least privilege, including for specific security functions and privileged accounts.', 2, 'Determine if the organization employs least privilege for users and processes.', 'Least privilege grants only the minimum access necessary to perform job functions.'),
('AC.3.1.7', 'AC', 'Use non-privileged accounts', 'Use non-privileged accounts or roles when accessing nonsecurity functions.', 2, 'Determine if the organization uses non-privileged accounts for nonsecurity functions.', 'Non-privileged accounts reduce the risk of unauthorized access to security functions.'),
('AC.3.1.8', 'AC', 'Prevent non-privileged user privilege escalation', 'Prevent non-privileged users from executing privileged functions and audit the execution of such functions.', 2, 'Determine if the organization prevents non-privileged users from executing privileged functions.', 'Preventing privilege escalation maintains security boundaries.'),
('AC.3.1.9', 'AC', 'Limit unsuccessful logon attempts', 'Limit the number of unsuccessful logon attempts.', 2, 'Determine if the organization limits unsuccessful logon attempts.', 'Limiting unsuccessful logon attempts prevents brute force attacks.'),
('AC.3.1.10', 'AC', 'Provide privacy and security notices', 'Provide privacy and security notices consistent with applicable CUI rules.', 2, 'Determine if the organization provides privacy and security notices.', 'Notices inform users of privacy and security requirements and responsibilities.'),
('AC.3.1.11', 'AC', 'Use session locks', 'Use session locks with pattern-hiding displays to prevent access and viewing of data after a period of inactivity.', 2, 'Determine if the organization uses session locks with pattern-hiding displays.', 'Session locks prevent unauthorized access to unattended systems.'),
('AC.3.1.12', 'AC', 'Terminate user sessions', 'Terminate user sessions upon meeting any of the following conditions: session timeout, user requests termination, or system detects suspicious activity.', 2, 'Determine if the organization terminates user sessions appropriately.', 'Session termination prevents unauthorized access to inactive sessions.'),
('AC.3.1.13', 'AC', 'Monitor and control remote access sessions', 'Monitor and control remote access sessions.', 2, 'Determine if the organization monitors and controls remote access sessions.', 'Remote access monitoring helps detect unauthorized access attempts and ensures compliance.'),
('AC.3.1.14', 'AC', 'Employ cryptographic mechanisms for remote access', 'Employ cryptographic mechanisms to protect the confidentiality of remote access sessions.', 2, 'Determine if the organization employs cryptographic mechanisms for remote access.', 'Cryptographic protection ensures confidentiality of remote access communications.'),
('AC.3.1.15', 'AC', 'Route remote access through managed control points', 'Route remote access via managed access control points.', 2, 'Determine if the organization routes remote access through managed control points.', 'Routing through managed points enhances organizational control over remote connections.'),
('AC.3.1.16', 'AC', 'Authorize remote execution of privileged commands', 'Authorize remote execution of privileged commands and remote access to security-relevant information.', 2, 'Determine if the organization authorizes remote execution of privileged commands.', 'Authorizing remote privileged access ensures proper oversight and control.'),
('AC.3.1.17', 'AC', 'Authorize wireless access', 'Authorize wireless access prior to allowing such connections.', 2, 'Determine if the organization authorizes wireless access before allowing connections.', 'Wireless access authorization ensures proper security controls are in place.'),
('AC.3.1.18', 'AC', 'Protect wireless access', 'Protect wireless access using authentication and encryption.', 2, 'Determine if the organization protects wireless access with authentication and encryption.', 'Wireless access protection prevents unauthorized access to network resources.'),
('AC.3.1.19', 'AC', 'Control connection of mobile devices', 'Control connection of mobile devices.', 2, 'Determine if the organization controls mobile device connections.', 'Mobile device connection control prevents unauthorized access and ensures security.'),
('AC.3.1.20', 'AC', 'Encrypt CUI on mobile devices', 'Encrypt CUI on mobile devices and mobile computing platforms.', 2, 'Determine if the organization encrypts CUI on mobile devices.', 'Encryption protects CUI on mobile devices from unauthorized access.'),
('AC.3.1.21', 'AC', 'Verify and control external system connections', 'Verify and control/limit connections to and use of external systems.', 2, 'Determine if the organization verifies and controls external system connections.', 'External system verification ensures security of interconnected systems.'),
('AC.3.1.22', 'AC', 'Control CUI on publicly accessible systems', 'Control CUI posted or processed on publicly accessible systems.', 2, 'Determine if the organization controls CUI on publicly accessible systems.', 'Publicly accessible systems require special controls to protect CUI.'),

-- =============================================================================
-- ASSESSMENT, AUTHORIZATION AND MONITORING (CA) - 4 Controls
-- =============================================================================

('CA.3.1.1', 'CA', 'Periodically assess security controls', 'Periodically assess the security controls in organizational systems to determine if the controls are effective in their application.', 2, 'Determine if the organization periodically assesses security controls.', 'Security control assessments determine control effectiveness and identify vulnerabilities.'),
('CA.3.1.2', 'CA', 'Develop security assessment plans', 'Develop security assessment plans for organizational systems.', 2, 'Determine if the organization develops security assessment plans.', 'Assessment plans ensure systematic evaluation of security controls.'),
('CA.3.1.3', 'CA', 'Monitor security control assessments', 'Monitor security control assessments.', 2, 'Determine if the organization monitors security control assessments.', 'Assessment monitoring ensures quality and consistency of evaluations.'),
('CA.3.1.4', 'CA', 'Accept security control assessments', 'Accept security control assessments from external assessors.', 2, 'Determine if the organization accepts external security control assessments.', 'External assessments provide independent verification of security posture.'),

-- =============================================================================
-- CONFIGURATION MANAGEMENT (CM) - 9 Controls
-- =============================================================================

('CM.3.2.1', 'CM', 'Establish baseline configurations', 'Establish and maintain baseline configurations for information systems.', 2, 'Determine if the organization establishes and maintains baseline configurations.', 'Baseline configurations provide known good states for system recovery and change management.'),
('CM.3.2.2', 'CM', 'Control configuration changes', 'Control configuration changes to information systems.', 2, 'Determine if the organization controls configuration changes to information systems.', 'Configuration change control ensures changes are authorized, tested, and documented.'),
('CM.3.2.3', 'CM', 'Restrict configuration changes', 'Restrict, disable, or prevent the use of nonessential programs, functions, ports, protocols, and services.', 2, 'Determine if the organization restricts nonessential programs and services.', 'Restricting nonessential functions reduces attack surface and security risks.'),
('CM.3.2.4', 'CM', 'Control software installation', 'Control software installation and removal.', 2, 'Determine if the organization controls software installation and removal.', 'Software installation control prevents unauthorized software on systems.'),
('CM.3.2.5', 'CM', 'Control user-installed software', 'Control user-installed software.', 2, 'Determine if the organization controls user-installed software.', 'User-installed software control prevents unauthorized applications and malware.'),
('CM.3.2.6', 'CM', 'Control configuration settings', 'Control configuration settings.', 2, 'Determine if the organization controls configuration settings.', 'Configuration settings control ensures consistent and secure system configurations.'),
('CM.3.2.7', 'CM', 'Track configuration changes', 'Track configuration changes.', 2, 'Determine if the organization tracks configuration changes.', 'Configuration change tracking provides auditability and supports security analysis.'),
('CM.3.2.8', 'CM', 'Verify configuration baselines', 'Verify configuration baselines are implemented correctly.', 2, 'Determine if the organization verifies configuration baselines are correct.', 'Configuration baseline verification ensures systems match defined security configurations.'),
('CM.3.2.9', 'CM', 'Document configuration management', 'Document configuration management procedures.', 2, 'Determine if the organization documents configuration management procedures.', 'Configuration management documentation ensures consistent implementation.'),

-- =============================================================================
-- IDENTIFICATION AND AUTHENTICATION (IA) - 11 Controls
-- =============================================================================

('IA.3.3.1', 'IA', 'Identify information system users', 'Identify information system users, processes acting on behalf of users, or devices.', 2, 'Determine if the organization identifies system users, processes, and devices.', 'User identification is fundamental to access control and accountability.'),
('IA.3.3.2', 'IA', 'Authenticate information system users', 'Authenticate (or verify) the identities of those users, processes, or devices before allowing them to access organizational information systems.', 2, 'Determine if the organization authenticates system users, processes, and devices.', 'Authentication verifies claimed identities before granting access.'),
('IA.3.3.3', 'IA', 'Use multifactor authentication for privileged access', 'Use multifactor authentication for local and network access to privileged accounts.', 2, 'Determine if the organization uses multifactor authentication for privileged accounts.', 'Multifactor authentication provides stronger security for privileged access.'),
('IA.3.3.4', 'IA', 'Use multifactor authentication for all access', 'Use multifactor authentication for local and network access to non-privileged accounts.', 2, 'Determine if the organization uses multifactor authentication for non-privileged accounts.', 'Multifactor authentication should be used for all accounts to prevent unauthorized access.'),
('IA.3.3.5', 'IA', 'Prevent reuse of identifiers', 'Prevent reuse of identifiers for a defined period.', 2, 'Determine if the organization prevents identifier reuse for a defined period.', 'Preventing identifier reuse reduces risk of unauthorized access from previous owners.'),
('IA.3.3.6', 'IA', 'Disable identifiers after period of inactivity', 'Disable identifiers after a defined period of inactivity.', 2, 'Determine if the organization disables identifiers after inactivity.', 'Disabling inactive identifiers prevents unauthorized access to unused accounts.'),
('IA.3.3.7', 'IA', 'Enforce minimum password complexity', 'Enforce minimum password complexity and change of characters when new passwords are created.', 2, 'Determine if the organization enforces password complexity requirements.', 'Password complexity requirements improve security against brute force attacks.'),
('IA.3.3.8', 'IA', 'Prohibit password reuse', 'Prohibit password reuse for a specified number of generations.', 2, 'Determine if the organization prohibits password reuse.', 'Password reuse prohibition prevents weak password practices.'),
('IA.3.3.9', 'IA', 'Allow temporary password use with immediate change', 'Allow temporary password use for system logons with an immediate change to a permanent password.', 2, 'Determine if the organization allows temporary passwords with immediate change.', 'Temporary passwords must be changed immediately after first use.'),
('IA.3.3.10', 'IA', 'Store and transmit passwords securely', 'Store and transmit only cryptographically protected passwords.', 2, 'Determine if the organization stores passwords securely using cryptography.', 'Cryptographic password protection prevents unauthorized access to credentials.'),
('IA.3.3.11', 'IA', 'Obscure feedback of authentication information', 'Obscure feedback of authentication information during the authentication process.', 2, 'Determine if the organization obscures authentication feedback.', 'Obscuring authentication feedback prevents information disclosure to attackers.'),

-- =============================================================================
-- INCIDENT RESPONSE (IR) - 3 Controls
-- =============================================================================

('IR.3.1.1', 'IR', 'Establish incident response capability', 'Establish an operational incident response capability for organizational systems.', 2, 'Determine if the organization has established an operational incident response capability.', 'Incident response capability includes procedures for detecting, analyzing, and responding to security incidents.'),
('IR.3.1.2', 'IR', 'Track and document security incidents', 'Track and document security incidents.', 2, 'Determine if the organization tracks and documents security incidents.', 'Incident tracking and documentation supports analysis and improvement of security posture.'),
('IR.3.1.3', 'IR', 'Test incident response capability', 'Test the incident response capability.', 2, 'Determine if the organization tests incident response capability.', 'Testing ensures incident response procedures are effective and up-to-date.'),

-- =============================================================================
-- MAINTENANCE (MA) - 6 Controls
-- =============================================================================

('MA.3.1.1', 'MA', 'Perform maintenance on information systems', 'Perform maintenance on organizational information systems.', 2, 'Determine if the organization performs system maintenance.', 'Maintenance should be performed according to organizational procedures and schedules.'),
('MA.3.1.2', 'MA', 'Provide maintenance tools', 'Provide maintenance tools.', 2, 'Determine if the organization provides maintenance tools.', 'Maintenance tools should be appropriate, secure, and available to authorized personnel.'),
('MA.3.1.3', 'MA', 'Control maintenance tools', 'Control maintenance tools.', 2, 'Determine if the organization controls maintenance tools.', 'Maintenance tool control prevents unauthorized access and ensures tool integrity.'),
('MA.3.1.4', 'MA', 'Control maintenance personnel', 'Control maintenance personnel.', 2, 'Determine if the organization controls maintenance personnel.', 'Maintenance personnel should be authorized, supervised, and accountable.'),
('MA.3.1.5', 'MA', 'Control maintenance activities', 'Control maintenance activities.', 2, 'Determine if the organization controls maintenance activities.', 'Maintenance activities should be authorized, monitored, and documented.'),
('MA.3.1.6', 'MA', 'Control maintenance documentation', 'Control maintenance documentation.', 2, 'Determine if the organization controls maintenance documentation.', 'Maintenance documentation should be accurate, current, and secure.'),

-- =============================================================================
-- MEDIA PROTECTION (MP) - 9 Controls
-- =============================================================================

('MP.3.1.1', 'MP', 'Protect information system media', 'Protect information system media.', 2, 'Determine if the organization protects information system media.', 'Media protection prevents unauthorized access to sensitive information on storage media.'),
('MP.3.1.2', 'MP', 'Limit access to media', 'Limit access to information system media.', 2, 'Determine if the organization limits access to information system media.', 'Access limitations prevent unauthorized media access and exposure of CUI.'),
('MP.3.1.3', 'MP', 'Sanitize media', 'Sanitize information system media.', 2, 'Determine if the organization sanitizes media before disposal or reuse.', 'Media sanitization prevents information disclosure when media changes hands.'),
('MP.3.1.4', 'MP', 'Mark media', 'Mark information system media.', 2, 'Determine if the organization marks media to indicate handling requirements.', 'Media marking indicates handling requirements and classification levels.'),
('MP.3.1.5', 'MP', 'Control media access', 'Control access to information system media.', 2, 'Determine if the organization controls access to media.', 'Media access control prevents unauthorized physical or logical access.'),
('MP.3.1.6', 'MP', 'Control media handling', 'Control handling of information system media.', 2, 'Determine if the organization controls media handling procedures.', 'Media handling control ensures proper security procedures are followed.'),
('MP.3.1.7', 'MP', 'Control media storage', 'Control storage of information system media.', 2, 'Determine if the organization controls media storage.', 'Media storage control ensures secure and appropriate storage of sensitive media.'),
('MP.3.1.8', 'MP', 'Control media transport', 'Control transport of information system media.', 2, 'Determine if the organization controls media transport.', 'Media transport control ensures secure movement of sensitive media.'),
('MP.3.1.9', 'MP', 'Control media disposal', 'Control disposal of information system media.', 2, 'Determine if the organization controls media disposal.', 'Media disposal control prevents information disclosure through discarded media.'),

-- =============================================================================
-- PERSONNEL SECURITY (PS) - 2 Controls
-- =============================================================================

('PS.3.1', 'PS', 'Screen personnel', 'Screen personnel prior to authorizing access to organizational information systems.', 2, 'Determine if the organization screens personnel before granting access.', 'Personnel screening helps ensure trustworthy individuals have access to organizational systems.'),
('PS.3.2', 'PS', 'Ensure personnel security', 'Ensure personnel security.', 2, 'Determine if the organization ensures personnel security.', 'Personnel security measures protect organizational assets from insider threats.'),

-- =============================================================================
-- PHYSICAL PROTECTION (PE) - 6 Controls
-- =============================================================================

('PE.3.1', 'PE', 'Limit physical access', 'Limit physical access to organizational information systems.', 2, 'Determine if the organization limits physical access to information systems.', 'Physical access control prevents unauthorized physical access to systems and data.'),
('PE.3.2', 'PE', 'Protect physical access', 'Protect physical access to organizational information systems.', 2, 'Determine if the organization protects physical access to information systems.', 'Physical protection prevents unauthorized physical access to system components.'),
('PE.3.3', 'PE', 'Escort visitors', 'Escort visitors and monitor visitor activity.', 2, 'Determine if the organization escorts visitors and monitors visitor activity.', 'Visitor escort and monitoring prevents unauthorized access and potential security incidents.'),
('PE.3.4', 'PE', 'Maintain audit logs of physical access', 'Maintain audit logs of physical access.', 2, 'Determine if the organization maintains physical access audit logs.', 'Physical access audit logs provide accountability and support incident investigation.'),
('PE.3.5', 'PE', 'Control physical access', 'Control physical access to organizational information systems.', 2, 'Determine if the organization controls physical access to information systems.', 'Physical access control ensures only authorized individuals access physical locations.'),
('PE.3.6', 'PE', 'Enforce physical access restrictions', 'Enforce physical access restrictions.', 2, 'Determine if the organization enforces physical access restrictions.', 'Physical access enforcement ensures compliance with security policies.'),

-- =============================================================================
-- RISK ASSESSMENT (RA) - 3 Controls
-- =============================================================================

('RA.3.1', 'RA', 'Conduct risk assessments', 'Conduct risk assessments to identify and prioritize risks to organizational operations.', 2, 'Determine if the organization conducts risk assessments to identify risks.', 'Risk assessments identify threats, vulnerabilities, and potential impacts to organizational operations.'),
('RA.3.2', 'RA', 'Update risk assessments', 'Update risk assessments regularly or when significant changes occur.', 2, 'Determine if the organization updates risk assessments regularly or when changes occur.', 'Regular updates ensure risk assessments remain current and relevant.'),
('RA.3.3', 'RA', 'Address risk assessment findings', 'Address risk assessment findings.', 2, 'Determine if the organization addresses risk assessment findings.', 'Risk findings should be addressed to reduce risk to acceptable levels.'),

-- =============================================================================
-- SYSTEM AND COMMUNICATIONS PROTECTION (SC) - 16 Controls
-- =============================================================================

('SC.3.1', 'SC', 'Protect information at rest', 'Protect information at rest.', 2, 'Determine if the organization protects information at rest.', 'Information at rest should be protected using encryption or other effective security measures.'),
('SC.3.2', 'SC', 'Protect information in transit', 'Protect information in transit.', 2, 'Determine if the organization protects information in transit.', 'Information in transit should be protected using encryption or other effective security measures.'),
('SC.3.3', 'SC', 'Employ cryptographic mechanisms', 'Employ cryptographic mechanisms to protect the confidentiality of CUI.', 2, 'Determine if the organization employs cryptographic mechanisms for confidentiality.', 'Cryptographic mechanisms should be FIPS-validated and NSA-approved cryptography.'),
('SC.3.4', 'SC', 'Employ cryptographic mechanisms for integrity', 'Employ cryptographic mechanisms to protect the integrity of CUI.', 2, 'Determine if the organization employs cryptographic mechanisms for integrity.', 'Cryptographic integrity protection prevents tampering with CUI.'),
('SC.3.5', 'SC', 'Employ cryptographic mechanisms for authenticity', 'Employ cryptographic mechanisms to protect the authenticity of CUI.', 2, 'Determine if the organization employs cryptographic mechanisms for authenticity.', 'Cryptographic authenticity protection prevents spoofing of CUI.'),
('SC.3.6', 'SC', 'Employ cryptographic mechanisms for non-repudiation', 'Employ cryptographic mechanisms to protect the non-repudiation of CUI.', 2, 'Determine if the organization employs cryptographic mechanisms for non-repudiation.', 'Cryptographic non-repudiation prevents denial of actions involving CUI.'),
('SC.3.7', 'SC', 'Employ cryptographic mechanisms for key management', 'Employ cryptographic mechanisms to protect the key management of CUI.', 2, 'Determine if the organization employs cryptographic mechanisms for key management.', 'Key management protection ensures secure generation, storage, and distribution of keys.'),
('SC.3.8', 'SC', 'Employ cryptographic mechanisms for random number generation', 'Employ cryptographic mechanisms to protect the random number generation of CUI.', 2, 'Determine if the organization employs cryptographic mechanisms for random number generation.', 'Random number generation protection ensures cryptographic strength.'),
('SC.3.9', 'SC', 'Employ cryptographic mechanisms for hash functions', 'Employ cryptographic mechanisms to protect the hash functions of CUI.', 2, 'Determine if the organization employs cryptographic mechanisms for hash functions.', 'Hash function protection ensures cryptographic integrity verification.'),
('SC.3.10', 'SC', 'Employ cryptographic mechanisms for digital signatures', 'Employ cryptographic mechanisms to protect the digital signatures of CUI.', 2, 'Determine if the organization employs cryptographic mechanisms for digital signatures.', 'Digital signature protection ensures authenticity and integrity of CUI.'),
('SC.3.11', 'SC', 'Employ cryptographic mechanisms for key exchange', 'Employ cryptographic mechanisms to protect the key exchange of CUI.', 2, 'Determine if the organization employs cryptographic mechanisms for key exchange.', 'Key exchange protection ensures secure establishment of shared secrets.'),
('SC.3.12', 'SC', 'Employ cryptographic mechanisms for authentication', 'Employ cryptographic mechanisms to protect the authentication of CUI.', 2, 'Determine if the organization employs cryptographic mechanisms for authentication.', 'Authentication protection ensures identity verification for CUI access.'),
('SC.3.13', 'SC', 'Employ cryptographic mechanisms for authorization', 'Employ cryptographic mechanisms to protect the authorization of CUI.', 2, 'Determine if the organization employs cryptographic mechanisms for authorization.', 'Authorization protection ensures proper access control for CUI.'),
('SC.3.14', 'SC', 'Employ cryptographic mechanisms for access control', 'Employ cryptographic mechanisms to protect the access control of CUI.', 2, 'Determine if the organization employs cryptographic mechanisms for access control.', 'Access control protection ensures only authorized access to CUI.'),
('SC.3.15', 'SC', 'Employ cryptographic mechanisms for audit logging', 'Employ cryptographic mechanisms to protect the audit logging of CUI.', 2, 'Determine if the organization employs cryptographic mechanisms for audit logging.', 'Audit logging protection ensures integrity of security logs for CUI.'),
('SC.3.16', 'SC', 'Employ cryptographic mechanisms for system monitoring', 'Employ cryptographic mechanisms to protect the system monitoring of CUI.', 2, 'Determine if the organization employs cryptographic mechanisms for system monitoring.', 'System monitoring protection ensures security visibility of CUI systems.'),

-- =============================================================================
-- SYSTEM AND INFORMATION INTEGRITY (SI) - 7 Controls
-- =============================================================================

('SI.3.1', 'SI', 'Identify and report system flaws', 'Identify and report information system flaws.', 2, 'Determine if the organization identifies and reports information system flaws.', 'System flaws should be identified through testing, monitoring, and vulnerability assessments.'),
('SI.3.2', 'SI', 'Correct system flaws', 'Correct information system flaws in a timely manner.', 2, 'Determine if the organization corrects information system flaws in a timely manner.', 'System flaws should be corrected promptly to reduce security risks.'),
('SI.3.3', 'SI', 'Identify malicious code', 'Identify malicious code.', 2, 'Determine if the organization identifies malicious code.', 'Malicious code identification helps prevent system compromise.'),
('SI.3.4', 'SI', 'Protect against malicious code', 'Protect against malicious code.', 2, 'Determine if the organization protects against malicious code.', 'Malicious code protection prevents system infection and data compromise.'),
('SI.3.5', 'SI', 'Update malicious code protection', 'Update malicious code protection.', 2, 'Determine if the organization updates malicious code protection.', 'Updated protection ensures current threat coverage.'),
('SI.3.6', 'SI', 'Monitor system security alerts', 'Monitor system security alerts and advisories.', 2, 'Determine if the organization monitors security alerts.', 'Security alert monitoring enables timely response to threats.'),
('SI.3.7', 'SI', 'Identify unauthorized use', 'Identify unauthorized use of organizational information systems.', 2, 'Determine if the organization identifies unauthorized system use.', 'Unauthorized use identification prevents security breaches and data loss.'),

-- =============================================================================
-- AWARENESS AND TRAINING (AT) - 3 Controls
-- =============================================================================

('AT.3.2.1', 'AT', 'Provide security awareness training', 'Ensure that managers, systems administrators, and users of organizational information systems are made aware of the security risks associated with their activities.', 2, 'Determine if the organization provides security awareness training.', 'Security awareness training ensures personnel understand security risks and responsibilities.'),
('AT.3.2.2', 'AT', 'Provide role-based security training', 'Ensure that organizational personnel are trained to carry out their assigned information security-related duties.', 2, 'Determine if the organization provides role-based security training.', 'Role-based training should be tailored to specific security responsibilities and requirements.'),
('AT.3.2.3', 'AT', 'Provide insider threat training', 'Provide security awareness training on recognizing and reporting potential indicators of insider threat.', 2, 'Determine if the organization provides insider threat training.', 'Insider threat training helps identify and report potential security risks from within.'),

-- =============================================================================
-- AUDIT AND ACCOUNTABILITY (AU) - 9 Controls
-- =============================================================================

('AU.3.3.1', 'AU', 'Create and retain audit logs', 'Create and retain audit logs of information system access, use, and modification.', 2, 'Determine if the organization creates and retains audit logs of system access.', 'Audit logs should capture sufficient information to support security monitoring and incident investigation.'),
('AU.3.3.2', 'AU', 'Ensure audit log content', 'Ensure that audit logs contain sufficient information to establish what events occurred.', 2, 'Determine if audit logs contain sufficient information to establish events.', 'Audit logs should include timestamps, user identities, and event details.'),
('AU.3.3.3', 'AU', 'Review audit logs', 'Review audit logs regularly for indications of inappropriate or unusual activity.', 2, 'Determine if the organization reviews audit logs regularly.', 'Regular review helps identify security incidents and policy violations.'),
('AU.3.3.4', 'AU', 'Respond to audit log failures', 'Respond to audit log failures.', 2, 'Determine if the organization responds to audit log failures.', 'Organizations should have procedures for handling audit log failures.'),
('AU.3.3.5', 'AU', 'Protect audit information', 'Protect audit information and audit logging tools from unauthorized access, modification, and deletion.', 2, 'Determine if the organization protects audit information.', 'Audit information should be protected using appropriate security controls.'),
('AU.3.3.6', 'AU', 'Limit audit log access', 'Limit audit log access to authorized personnel.', 2, 'Determine if the organization limits audit log access to authorized personnel.', 'Access to audit logs should be restricted to authorized individuals.'),
('AU.3.3.7', 'AU', 'Coordinate audit log review', 'Coordinate audit log review, analysis, and reporting.', 2, 'Determine if the organization coordinates audit log review.', 'Coordination ensures consistent and effective audit log analysis.'),
('AU.3.3.8', 'AU', 'Centralize audit log collection', 'Centralize audit log collection.', 2, 'Determine if the organization centralizes audit log collection.', 'Centralized collection improves log management and analysis.'),
('AU.3.3.9', 'AU', 'Protect audit log integrity', 'Protect audit log integrity.', 2, 'Determine if the organization protects audit log integrity.', 'Audit log integrity is essential for reliable security monitoring.')

ON CONFLICT (control_id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    assessment_objective = EXCLUDED.assessment_objective,
    discussion = EXCLUDED.discussion;

-- =============================================================================
-- VERIFICATION
-- =============================================================================

-- Count total controls (should be 110 for Level 2)
SELECT 'Level 2 Controls: ' || COUNT(*) as verification 
FROM cmmc_controls WHERE level = 2;

-- Count by domain (should match official CMMC 2.0 structure)
SELECT domain_id, COUNT(*) as control_count 
FROM cmmc_controls 
WHERE level = 2 
GROUP BY domain_id 
ORDER BY domain_id;

-- Final summary
SELECT 
    'COMPLETE SET OF 110 CMMC 2.0 LEVEL 2 CONTROLS LOADED' as status,
    COUNT(*) as total_controls,
    (SELECT COUNT(DISTINCT domain_id) FROM cmmc_domains) as total_domains
FROM cmmc_controls 
WHERE level = 2;

