import { Framework } from '../../shared/types';
import { cmmcFramework } from './cmmc';

// Default fallback framework to prevent undefined errors
const defaultFramework: Framework = {
  id: 'cmmc-fallback',
  name: 'CMMC 2.0 Level 2 (Loading...)',
  description: 'Loading CMMC framework...',
  version: '2.0',
  categories: [],
  sections: [],
  maturityLevels: [],
  assessmentQuestions: []
};

// CMMC 2.0 Level 2 focused platform - single framework
const frameworks: Framework[] = [
  cmmcFramework || defaultFramework
];

// Assessment frameworks for the platform
const assessmentFrameworks: Framework[] = [
  cmmcFramework || defaultFramework
];

// Export CMMC framework
export { cmmcFramework };

// Helper to get framework by ID - defaults to CMMC
export const getFramework = (frameworkId?: string) => {
  // Always return CMMC framework as this is a CMMC-only platform
  return cmmcFramework || defaultFramework;
};

// Helper to get all available frameworks