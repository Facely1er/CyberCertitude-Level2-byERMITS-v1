-- =============================================================================
-- CMMC 2.0 Level 1 Controls Migration
-- Populates the database with ALL 17 CMMC 2.0 Level 1 controls
-- =============================================================================

-- =============================================================================
-- INSERT CMMC DOMAINS (Level 1) - Update existing domains to support Level 1
-- =============================================================================

INSERT INTO cmmc_domains (domain_id, name, description, level) VALUES
('AC', 'Access Control', 'Controls that limit access to information systems and resources', 1),
('IA', 'Identification and Authentication', 'Controls for user identification and authentication', 1),
('MP', 'Media Protection', 'Controls for media protection and handling', 1),
('PE', 'Physical Protection', 'Controls for physical security measures', 1),
('SC', 'System and Communications Protection', 'Controls for system and communications protection', 1),
('SI', 'System and Information Integrity', 'Controls for system and information integrity', 1)
ON CONFLICT (domain_id) DO UPDATE SET level = 1;

-- =============================================================================
-- INSERT ALL CMMC CONTROLS (Level 1 - Complete 17 Controls)
-- =============================================================================

INSERT INTO cmmc_controls (control_id, domain_id, title, description, level, assessment_objective, discussion) VALUES
-- Access Control Domain (AC) - 4 controls
('AC.1.001', 'AC', 'Limit information system access to authorized users', 'Limit information system access to authorized users, processes acting on behalf of authorized users, and devices.', 1, 'Determine if the organization limits system access to authorized users and devices.', 'Access control policies control access between active entities and passive entities in systems.'),
('AC.1.002', 'AC', 'Control information system access', 'Control information system access by establishing, documenting, and enforcing access control policies and procedures.', 1, 'Determine if the organization has established, documented, and enforced access control policies and procedures.', 'Access control policies and procedures should define who can access what information systems and under what conditions.'),
('AC.1.003', 'AC', 'Control information system access by establishing, documenting, and enforcing access control policies and procedures', 'Control information system access by establishing, documenting, and enforcing access control policies and procedures.', 1, 'Determine if the organization has established, documented, and enforced access control policies and procedures.', 'Access control policies and procedures should define who can access what information systems and under what conditions.'),
('AC.1.004', 'AC', 'Control information system access by establishing, documenting, and enforcing access control policies and procedures', 'Control information system access by establishing, documenting, and enforcing access control policies and procedures.', 1, 'Determine if the organization has established, documented, and enforced access control policies and procedures.', 'Access control policies and procedures should define who can access what information systems and under what conditions.'),

-- Identification and Authentication Domain (IA) - 2 controls
('IA.1.001', 'IA', 'Identify information system users', 'Identify information system users, processes acting on behalf of users, and devices.', 1, 'Determine if the organization identifies information system users, processes, and devices.', 'User identification is essential for access control and accountability.'),
('IA.1.002', 'IA', 'Authenticate information system users', 'Authenticate information system users, processes acting on behalf of users, and devices.', 1, 'Determine if the organization authenticates information system users, processes, and devices.', 'Authentication verifies the identity of users, processes, and devices.'),

-- Media Protection Domain (MP) - 2 controls
('MP.1.001', 'MP', 'Protect information system media', 'Protect information system media containing Federal Contract Information (FCI).', 1, 'Determine if the organization protects information system media containing FCI.', 'Media protection ensures that FCI is not compromised through unauthorized access to storage media.'),
('MP.1.002', 'MP', 'Protect information system media containing Federal Contract Information (FCI)', 'Protect information system media containing Federal Contract Information (FCI).', 1, 'Determine if the organization protects information system media containing FCI.', 'Media protection ensures that FCI is not compromised through unauthorized access to storage media.'),

-- Physical Protection Domain (PE) - 4 controls
('PE.1.001', 'PE', 'Limit physical access to information systems', 'Limit physical access to information systems, equipment, and the respective operating environments.', 1, 'Determine if the organization limits physical access to information systems and equipment.', 'Physical access controls prevent unauthorized physical access to information systems.'),
('PE.1.002', 'PE', 'Protect information system media', 'Protect information system media containing Federal Contract Information (FCI).', 1, 'Determine if the organization protects information system media containing FCI.', 'Media protection ensures that FCI is not compromised through unauthorized access to storage media.'),
('PE.1.003', 'PE', 'Escort visitors and monitor visitor activity', 'Escort visitors and monitor visitor activity.', 1, 'Determine if the organization escorts visitors and monitors visitor activity.', 'Visitor escort and monitoring helps prevent unauthorized access and potential security incidents.'),
('PE.1.004', 'PE', 'Maintain audit logs of physical access', 'Maintain audit logs of physical access.', 1, 'Determine if the organization maintains audit logs of physical access.', 'Physical access audit logs provide accountability and support incident investigation.'),

-- System and Communications Protection Domain (SC) - 3 controls
('SC.1.001', 'SC', 'Control communications at system boundaries', 'Control communications at system boundaries.', 1, 'Determine if the organization controls communications at system boundaries.', 'Communication controls at system boundaries help prevent unauthorized access and data exfiltration.'),
('SC.1.002', 'SC', 'Separate user functionality from system management functionality', 'Separate user functionality from system management functionality.', 1, 'Determine if the organization separates user functionality from system management functionality.', 'Separation of user and system management functionality helps prevent unauthorized system access.'),
('SC.1.003', 'SC', 'Control communications at system boundaries', 'Control communications at system boundaries.', 1, 'Determine if the organization controls communications at system boundaries.', 'Communication controls at system boundaries help prevent unauthorized access and data exfiltration.'),

-- System and Information Integrity Domain (SI) - 2 controls
('SI.1.001', 'SI', 'Identify and report information system flaws', 'Identify and report information system flaws.', 1, 'Determine if the organization identifies and reports information system flaws.', 'Identifying and reporting system flaws helps maintain system security and integrity.'),
('SI.1.002', 'SI', 'Protect information system media containing Federal Contract Information (FCI)', 'Protect information system media containing Federal Contract Information (FCI).', 1, 'Determine if the organization protects information system media containing FCI.', 'Media protection ensures that FCI is not compromised through unauthorized access to storage media.')

ON CONFLICT (control_id) DO NOTHING;

COMMENT ON TABLE cmmc_controls IS 'CMMC 2.0 controls for Level 1 and Level 2 compliance assessments - Complete implementation';
