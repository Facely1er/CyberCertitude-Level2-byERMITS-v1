# 🔧 Quick Fix for Migration Order Issue

## The Problem

The error occurs because migration 006 tries to insert controls before the domains exist. The foreign key constraint requires domains to exist before controls can reference them.

## Solution: Run This Corrected Migration

Copy and run this complete migration that creates domains FIRST, then adds controls:

```sql
-- Clear everything first
DELETE FROM cmmc_practices;
DELETE FROM cmmc_controls;
DELETE FROM cmmc_domains;

-- =============================================================================
-- CREATE CMMC DOMAINS FIRST (Required before controls)
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
('SI', 'System and Information Integrity', 'Controls for system and information integrity', 2);

-- Now run the full migration 006_complete_110_cmmc_level2_controls.sql
-- (It already creates domains, but domains need to exist BEFORE the INSERT statements)
```

## Updated Migration File

The migration file `006_complete_110_cmmc_level2_controls.sql` has been fixed to:
1. ✅ Delete everything
2. ✅ Create domains FIRST
3. ✅ Then add controls

**Re-run the migration file** - it should work now!

## Or Use This Simplified Approach

If the full migration still has issues, run this simplified version:

1. **First**: Just create the domains
2. **Then**: Copy just the INSERT statements from migration 006 (starting from the controls, skipping the domain creation part since they'll already exist)

The file is already updated - try running migration 006 again!

