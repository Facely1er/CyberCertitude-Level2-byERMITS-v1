/**
 * Personnel Security Policy Template
 */

export const personnelSecurityPolicy = {
  id: 'personnel-security-policy',
  name: 'Personnel Security Policy',
  category: 'policy',
  type: 'personnel-security-policy',
  controls: ['PS.1.110', 'PS.2.111'],
  content: `# PERSONNEL SECURITY POLICY - CMMC 2.0 Level 2 Compliance

**Organization:** {{companyName}}
**Effective Date:** {{effectiveDate}}

Establishes requirements for personnel screening, role-based access, personnel termination, and access revocation. Covers background checks, security clearances, personnel actions, and access control.

Controls: PS.1.110, PS.2.111`,
  interactiveFields: { companyInfo: {}, policyInfo: {}, sections: [] },
  metadata: { version: '1.0', lastUpdated: '2025-01-07', estimatedPages: 14, complexity: 'medium', targetAudience: ['HR', 'CISO', 'Management'] }
};
