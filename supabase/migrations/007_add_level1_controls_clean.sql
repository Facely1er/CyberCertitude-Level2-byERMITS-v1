-- =============================================================================
-- CMMC Level 1 Controls - Clean Implementation
-- Adds the 17 official CMMC Level 1 controls
-- =============================================================================

-- Insert Level 1 domains (if not already present from migration 006)
INSERT INTO cmmc_domains (domain_id, name, description, level) VALUES
('AC', 'Access Control', 'Controls that limit access to information systems and resources', 1),
('IA', 'Identification and Authentication', 'Controls for user identification and authentication', 1),
('MP', 'Media Protection', 'Controls for media protection and handling', 1),
('PE', 'Physical Protection', 'Controls for physical security measures', 1),
('SC', 'System and Communications Protection', 'Controls for system and communications protection', 1),
('SI', 'System and Information Integrity', 'Controls for system and information integrity', 1)
ON CONFLICT (domain_id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- =============================================================================
-- INSERT CMMC LEVEL 1 CONTROLS (17 Controls)
-- =============================================================================

INSERT INTO cmmc_controls (control_id, domain_id, title, description, level, assessment_objective, discussion) VALUES
-- Access Control Domain (AC) - 4 controls
('AC.1.1.1', 'AC', 'Limit information system access', 'Limit information system access to authorized users, processes acting on behalf of authorized users, and devices (including other information systems).', 1, 'Determine if the organization limits system access to authorized users, processes, and devices.', 'Access control policies control access between active entities (users, processes, devices) and passive entities (information, resources).'),
('AC.1.1.2', 'AC', 'Control information system access', 'Control information system access by establishing, documenting, and enforcing access control policies and procedures.', 1, 'Determine if the organization has established, documented, and enforced access control policies and procedures.', 'Access control policies define who can access what information systems under what conditions.'),
('AC.1.1.3', 'AC', 'Employ the principle of least privilege', 'Employ the principle of least privilege, including for specific security functions and privileged accounts.', 1, 'Determine if the organization employs least privilege for users and processes.', 'Least privilege grants only the minimum access necessary to perform job functions.'),
('AC.1.1.4', 'AC', 'Control information system access using authenticators', 'Control information system access using authenticators.', 1, 'Determine if the organization uses authenticators to control system access.', 'Authenticators verify identity before granting access.'),

-- Identification and Authentication Domain (IA) - 2 controls
('IA.1.1.1', 'IA', 'Identify information system users', 'Identify information system users, processes acting on behalf of users, and devices.', 1, 'Determine if the organization identifies information system users, processes, and devices.', 'User identification is essential for access control and accountability.'),
('IA.1.1.2', 'IA', 'Authenticate information system users', 'Authenticate (or verify) the identities of those users, processes, or devices before allowing them to access organizational information systems.', 1, 'Determine if the organization authenticates information system users, processes, and devices.', 'Authentication verifies the identity of users, processes, and devices.'),

-- Media Protection Domain (MP) - 2 controls
('MP.1.1.1', 'MP', 'Sanitize information system media', 'Sanitize information system media containing Federal Contract Information (FCI) before disposal or release for reuse.', 1, 'Determine if the organization sanitizes information system media containing FCI before disposal or reuse.', 'Media sanitization ensures that FCI is not compromised through discarded or reused media.'),
('MP.1.1.2', 'MP', 'Protect information system media', 'Protect information system media containing Federal Contract Information (FCI) and limit access to authorized users.', 1, 'Determine if the organization protects information system media containing FCI.', 'Media protection ensures that FCI is not compromised through unauthorized access to storage media.'),

-- Physical Protection Domain (PE) - 4 controls
('PE.1.1.1', 'PE', 'Limit physical access to information systems', 'Limit physical access to organizational information systems, equipment, and the respective operating environments.', 1, 'Determine if the organization limits physical access to information systems and equipment.', 'Physical access controls prevent unauthorized physical access to information systems.'),
('PE.1.1.2', 'PE', 'Protect information system media', 'Protect information system media containing Federal Contract Information (FCI) and limit access to authorized users.', 1, 'Determine if the organization protects information system media containing FCI.', 'Media protection ensures that FCI is not compromised through unauthorized access to storage media.'),
('PE.1.1.3', 'PE', 'Escort visitors and monitor visitor activity', 'Escort visitors and monitor visitor activity.', 1, 'Determine if the organization escorts visitors and monitors visitor activity.', 'Visitor escort and monitoring prevents unauthorized access and potential security incidents.'),
('PE.1.1.4', 'PE', 'Maintain audit logs of physical access', 'Maintain audit logs of physical access.', 1, 'Determine if the organization maintains audit logs of physical access.', 'Physical access audit logs provide accountability and support incident investigation.'),

-- System and Communications Protection Domain (SC) - 3 controls
('SC.1.1.1', 'SC', 'Control communications at system boundaries', 'Control communications at system boundaries.', 1, 'Determine if the organization controls communications at system boundaries.', 'Communication controls at system boundaries help prevent unauthorized access and data exfiltration.'),
('SC.1.1.2', 'SC', 'Separate user functionality from system management functionality', 'Separate user functionality from system management functionality.', 1, 'Determine if the organization separates user functionality from system management functionality.', 'Separation of user and system management functionality helps prevent unauthorized system access.'),
('SC.1.1.3', 'SC', 'Employ boundary protections', 'Employ boundary protections to control communications between information systems and physical systems.', 1, 'Determine if the organization employs boundary protections to control communications.', 'Boundary protections prevent unauthorized access and data flows at system boundaries.'),

-- System and Information Integrity Domain (SI) - 2 controls
('SI.1.1.1', 'SI', 'Identify and report information system flaws', 'Identify and report information system flaws.', 1, 'Determine if the organization identifies and reports information system flaws.', 'Identifying and reporting system flaws helps maintain system security and integrity.'),
('SI.1.1.2', 'SI', 'Protect information system media', 'Protect information system media containing Federal Contract Information (FCI).', 1, 'Determine if the organization protects information system media containing FCI.', 'Media protection ensures that FCI is not compromised through unauthorized access to storage media.')

ON CONFLICT (control_id) DO NOTHING;

-- =============================================================================
-- VERIFICATION
-- =============================================================================

-- Count total controls by level
SELECT 
    'Level 1 Controls: ' || COUNT(*) as level1_count
FROM cmmc_controls WHERE level = 1;

-- Count total Level 2 controls  
SELECT 
    'Level 2 Controls: ' || COUNT(*) as level2_count
FROM cmmc_controls WHERE level = 2;

-- Total controls
SELECT 
    'Total Controls: ' || COUNT(*) as total_count
FROM cmmc_controls;

-- Summary
SELECT 
    (SELECT COUNT(*) FROM cmmc_controls WHERE level = 1) as level1_controls,
    (SELECT COUNT(*) FROM cmmc_controls WHERE level = 2) as level2_controls,
    (SELECT COUNT(*) FROM cmmc_controls) as total_controls,
    (SELECT COUNT(*) FROM cmmc_domains) as total_domains;

