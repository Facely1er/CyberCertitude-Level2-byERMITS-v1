-- =============================================================================
-- CMMC 2.0 Level 2 Framework Data Migration
-- Populates the database with CMMC 2.0 Level 2 controls and requirements
-- =============================================================================

-- =============================================================================
-- CMMC FRAMEWORK TABLES
-- =============================================================================

-- CMMC domains (control families)
CREATE TABLE IF NOT EXISTS cmmc_domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    domain_id VARCHAR(10) UNIQUE NOT NULL, -- AC, AT, AU, CA, CM, CP, IA, IR, MA, MP, PS, PE, RA, SA, SC, SI
    name VARCHAR(255) NOT NULL,
    description TEXT,
    level INTEGER NOT NULL DEFAULT 2, -- 1, 2, or 3
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CMMC controls
CREATE TABLE IF NOT EXISTS cmmc_controls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    control_id VARCHAR(20) UNIQUE NOT NULL, -- AC.2.001, AT.2.001, etc.
    domain_id VARCHAR(10) NOT NULL REFERENCES cmmc_domains(domain_id),
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    level INTEGER NOT NULL DEFAULT 2,
    assessment_objective TEXT,
    discussion TEXT,
    related_controls TEXT[],
    references TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CMMC practices (specific requirements)
CREATE TABLE IF NOT EXISTS cmmc_practices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    practice_id VARCHAR(20) UNIQUE NOT NULL,
    control_id VARCHAR(20) NOT NULL REFERENCES cmmc_controls(control_id),
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    level INTEGER NOT NULL DEFAULT 2,
    assessment_objective TEXT,
    discussion TEXT,
    references TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- INSERT CMMC DOMAINS (Level 2)
-- =============================================================================

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
('SI', 'System and Information Integrity', 'Controls for system and information integrity', 2)
ON CONFLICT (domain_id) DO NOTHING;

-- =============================================================================
-- INSERT CMMC CONTROLS (Level 2 - Sample of key controls)
-- =============================================================================

INSERT INTO cmmc_controls (control_id, domain_id, title, description, level, assessment_objective, discussion) VALUES
-- Access Control Domain
('AC.2.001', 'AC', 'Control information system access', 'Control information system access by establishing, documenting, and enforcing access control policies and procedures.', 2, 'Determine if the organization has established, documented, and enforced access control policies and procedures.', 'Access control policies and procedures should define who can access what information systems and under what conditions.'),

('AC.2.002', 'AC', 'Control information system access by establishing, documenting, and enforcing access control policies and procedures', 'Control information system access by establishing, documenting, and enforcing access control policies and procedures.', 2, 'Determine if the organization has established, documented, and enforced access control policies and procedures.', 'Access control policies and procedures should define who can access what information systems and under what conditions.'),

('AC.2.003', 'AC', 'Control information system access by establishing, documenting, and enforcing access control policies and procedures', 'Control information system access by establishing, documenting, and enforcing access control policies and procedures.', 2, 'Determine if the organization has established, documented, and enforced access control policies and procedures.', 'Access control policies and procedures should define who can access what information systems and under what conditions.'),

-- Awareness and Training Domain
('AT.2.001', 'AT', 'Provide security awareness training', 'Provide security awareness training to all users before authorizing access to organizational information systems.', 2, 'Determine if the organization provides security awareness training to all users before authorizing access.', 'Security awareness training should cover basic security concepts, threats, and user responsibilities.'),

('AT.2.002', 'AT', 'Provide role-based security training', 'Provide role-based security training to personnel with assigned security roles and responsibilities.', 2, 'Determine if the organization provides role-based security training to personnel with security roles.', 'Role-based training should be tailored to specific security responsibilities and requirements.'),

-- Audit and Accountability Domain
('AU.2.001', 'AU', 'Create and retain audit logs', 'Create and retain audit logs of information system access, use, and modification.', 2, 'Determine if the organization creates and retains audit logs of system access and use.', 'Audit logs should capture sufficient information to support security monitoring and incident investigation.'),

('AU.2.002', 'AU', 'Review audit logs', 'Review audit logs regularly for indications of inappropriate or unusual activity.', 2, 'Determine if the organization reviews audit logs regularly for unusual activity.', 'Regular review of audit logs helps identify security incidents and policy violations.'),

-- Configuration Management Domain
('CM.2.001', 'CM', 'Establish baseline configurations', 'Establish and maintain baseline configurations for information systems.', 2, 'Determine if the organization establishes and maintains baseline configurations.', 'Baseline configurations provide a known good state for system recovery and change management.'),

('CM.2.002', 'CM', 'Control configuration changes', 'Control configuration changes to information systems.', 2, 'Determine if the organization controls configuration changes to information systems.', 'Configuration change control ensures that changes are authorized, tested, and documented.'),

-- Incident Response Domain
('IR.2.001', 'IR', 'Establish incident response capability', 'Establish an operational incident response capability.', 2, 'Determine if the organization has established an operational incident response capability.', 'Incident response capability should include procedures for detecting, analyzing, and responding to security incidents.'),

('IR.2.002', 'IR', 'Track and document incidents', 'Track and document security incidents.', 2, 'Determine if the organization tracks and documents security incidents.', 'Incident tracking and documentation supports analysis and improvement of security posture.'),

-- Risk Assessment Domain
('RA.2.001', 'RA', 'Conduct risk assessments', 'Conduct risk assessments to identify and prioritize risks to organizational operations.', 2, 'Determine if the organization conducts risk assessments to identify and prioritize risks.', 'Risk assessments should identify threats, vulnerabilities, and potential impacts to organizational operations.'),

('RA.2.002', 'RA', 'Update risk assessments', 'Update risk assessments regularly or when significant changes occur.', 2, 'Determine if the organization updates risk assessments regularly or when changes occur.', 'Regular updates ensure risk assessments remain current and relevant.'),

-- System and Communications Protection Domain
('SC.2.001', 'SC', 'Protect information at rest', 'Protect information at rest using encryption or other effective methods.', 2, 'Determine if the organization protects information at rest using encryption or other methods.', 'Information at rest should be protected using strong encryption or other effective security measures.'),

('SC.2.002', 'SC', 'Protect information in transit', 'Protect information in transit using encryption or other effective methods.', 2, 'Determine if the organization protects information in transit using encryption or other methods.', 'Information in transit should be protected using strong encryption or other effective security measures.'),

-- System and Information Integrity Domain
('SI.2.001', 'SI', 'Identify and report system flaws', 'Identify and report information system flaws.', 2, 'Determine if the organization identifies and reports information system flaws.', 'System flaws should be identified through testing, monitoring, and vulnerability assessments.'),

('SI.2.002', 'SI', 'Correct system flaws', 'Correct information system flaws in a timely manner.', 2, 'Determine if the organization corrects information system flaws in a timely manner.', 'System flaws should be corrected promptly to reduce security risks.')
ON CONFLICT (control_id) DO NOTHING;

-- =============================================================================
-- INSERT CMMC PRACTICES (Level 2 - Sample practices)
-- =============================================================================

INSERT INTO cmmc_practices (practice_id, control_id, title, description, level, assessment_objective, discussion) VALUES
-- Access Control Practices
('AC.2.001.1', 'AC.2.001', 'Establish access control policies', 'Establish, document, and enforce access control policies and procedures.', 2, 'Determine if the organization has established, documented, and enforced access control policies.', 'Access control policies should define roles, responsibilities, and procedures for managing access.'),

('AC.2.001.2', 'AC.2.001', 'Implement access control mechanisms', 'Implement access control mechanisms to enforce access control policies.', 2, 'Determine if the organization has implemented access control mechanisms.', 'Access control mechanisms should include authentication, authorization, and accounting capabilities.'),

-- Awareness and Training Practices
('AT.2.001.1', 'AT.2.001', 'Develop security awareness training program', 'Develop a security awareness training program for all users.', 2, 'Determine if the organization has developed a security awareness training program.', 'Security awareness training should cover organizational policies, procedures, and security best practices.'),

('AT.2.001.2', 'AT.2.001', 'Deliver security awareness training', 'Deliver security awareness training to all users before granting access.', 2, 'Determine if the organization delivers security awareness training before granting access.', 'Training should be delivered before users are granted access to organizational information systems.'),

-- Audit and Accountability Practices
('AU.2.001.1', 'AU.2.001', 'Configure audit logging', 'Configure information systems to generate audit logs.', 2, 'Determine if the organization has configured systems to generate audit logs.', 'Audit logging should capture relevant security events and system activities.'),

('AU.2.001.2', 'AU.2.001', 'Protect audit logs', 'Protect audit logs from unauthorized access, modification, or deletion.', 2, 'Determine if the organization protects audit logs from unauthorized access.', 'Audit logs should be protected using appropriate security controls and access restrictions.'),

-- Configuration Management Practices
('CM.2.001.1', 'CM.2.001', 'Document baseline configurations', 'Document baseline configurations for information systems.', 2, 'Determine if the organization has documented baseline configurations.', 'Baseline configurations should be documented and maintained as the standard configuration.'),

('CM.2.001.2', 'CM.2.001', 'Implement baseline configurations', 'Implement baseline configurations on information systems.', 2, 'Determine if the organization has implemented baseline configurations.', 'Baseline configurations should be implemented and maintained on all information systems.'),

-- Incident Response Practices
('IR.2.001.1', 'IR.2.001', 'Develop incident response procedures', 'Develop incident response procedures for security incidents.', 2, 'Determine if the organization has developed incident response procedures.', 'Incident response procedures should define roles, responsibilities, and response steps.'),

('IR.2.001.2', 'IR.2.001', 'Establish incident response team', 'Establish an incident response team with defined roles and responsibilities.', 2, 'Determine if the organization has established an incident response team.', 'Incident response team should include personnel with appropriate skills and authority.'),

-- Risk Assessment Practices
('RA.2.001.1', 'RA.2.001', 'Identify threats and vulnerabilities', 'Identify threats and vulnerabilities to organizational operations.', 2, 'Determine if the organization identifies threats and vulnerabilities.', 'Risk assessment should identify internal and external threats and system vulnerabilities.'),

('RA.2.001.2', 'RA.2.001', 'Assess risk likelihood and impact', 'Assess the likelihood and impact of identified risks.', 2, 'Determine if the organization assesses risk likelihood and impact.', 'Risk assessment should evaluate the probability and potential impact of identified risks.'),

-- System and Communications Protection Practices
('SC.2.001.1', 'SC.2.001', 'Encrypt sensitive data at rest', 'Encrypt sensitive data stored on information systems.', 2, 'Determine if the organization encrypts sensitive data at rest.', 'Sensitive data should be encrypted using strong encryption algorithms and key management.'),

('SC.2.001.2', 'SC.2.001', 'Implement access controls for encrypted data', 'Implement access controls for encrypted data at rest.', 2, 'Determine if the organization implements access controls for encrypted data.', 'Access to encrypted data should be controlled through authentication and authorization mechanisms.'),

-- System and Information Integrity Practices
('SI.2.001.1', 'SI.2.001', 'Perform vulnerability assessments', 'Perform vulnerability assessments on information systems.', 2, 'Determine if the organization performs vulnerability assessments.', 'Vulnerability assessments should identify security weaknesses in information systems.'),

('SI.2.001.2', 'SI.2.001', 'Report identified vulnerabilities', 'Report identified vulnerabilities to appropriate personnel.', 2, 'Determine if the organization reports identified vulnerabilities.', 'Vulnerabilities should be reported promptly to enable timely remediation.')
ON CONFLICT (practice_id) DO NOTHING;

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_cmmc_domains_level ON cmmc_domains(level);
CREATE INDEX IF NOT EXISTS idx_cmmc_controls_domain_id ON cmmc_controls(domain_id);
CREATE INDEX IF NOT EXISTS idx_cmmc_controls_level ON cmmc_controls(level);
CREATE INDEX IF NOT EXISTS idx_cmmc_practices_control_id ON cmmc_practices(control_id);
CREATE INDEX IF NOT EXISTS idx_cmmc_practices_level ON cmmc_practices(level);

-- =============================================================================
-- ROW LEVEL SECURITY FOR CMMC TABLES
-- =============================================================================

-- CMMC framework data is read-only for all authenticated users
ALTER TABLE cmmc_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE cmmc_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE cmmc_practices ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read CMMC framework data
CREATE POLICY "Authenticated users can read CMMC domains" ON cmmc_domains
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read CMMC controls" ON cmmc_controls
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read CMMC practices" ON cmmc_practices
    FOR SELECT USING (auth.role() = 'authenticated');

-- =============================================================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE cmmc_domains IS 'CMMC 2.0 domains (control families) for Level 2 compliance';
COMMENT ON TABLE cmmc_controls IS 'CMMC 2.0 controls for Level 2 compliance assessments';
COMMENT ON TABLE cmmc_practices IS 'CMMC 2.0 practices (specific requirements) for Level 2 compliance';