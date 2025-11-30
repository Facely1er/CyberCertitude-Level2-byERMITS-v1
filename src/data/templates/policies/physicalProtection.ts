/**
 * Physical Protection Policy Template
 */

export const physicalProtectionPolicy = {
  id: 'physical-protection-policy',
  name: 'Physical Protection Policy',
  category: 'policy',
  type: 'physical-protection-policy',
  controls: ['PE.1.112', 'PE.2.113'],
  content: `# PHYSICAL PROTECTION POLICY - CMMC 2.0 Level 2 Compliance

**Organization:** {{companyName}}
**Effective Date:** {{effectiveDate}}

Establishes requirements for physical access controls, visitor management, video surveillance, and environmental controls. Covers badge systems, locked storage, environmental monitoring, and emergency procedures.

Controls: PE.1.112, PE.2.113`,
  interactiveFields: { companyInfo: {}, policyInfo: {}, sections: [] },
  metadata: { version: '1.0', lastUpdated: '2025-01-07', estimatedPages: 16, complexity: 'medium', targetAudience: ['Facilities', 'CISO', 'Physical Security'] }
};
