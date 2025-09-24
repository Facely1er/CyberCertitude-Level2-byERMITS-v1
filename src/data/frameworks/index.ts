import { Framework } from '../../shared/types';
import { cmmc2Level1Framework } from './cmmc-2.0-level1';

// Default fallback framework to prevent undefined errors
const defaultFramework: Framework = {
  id: 'cmmc-2.0-level1-fallback',
  name: 'CMMC 2.0 Level 1 (Loading...)',
  description: 'Loading CMMC 2.0 Level 1 framework...',
  version: '2.0',
  categories: [],
  sections: [],
  maturityLevels: [],
  assessmentQuestions: []
};

// CMMC 2.0 Level 1 focused platform - simplified implementation
export const frameworks: Framework[] = [
  cmmc2Level1Framework || defaultFramework
];

// Assessment frameworks for the platform
export const assessmentFrameworks: Framework[] = [
  cmmc2Level1Framework || defaultFramework
];

// Export CMMC 2.0 Level 1 framework
export { cmmc2Level1Framework };

// Helper to get framework by ID - defaults to CMMC 2.0 Level 1
export const getFramework = (frameworkId?: string) => {
  // Return Level 1 framework for simplified implementation
  if (frameworkId === 'cmmc-2.0-level1' || frameworkId === 'cmmc-level1') {
    return cmmc2Level1Framework || defaultFramework;
  }
  // Default to Level 1 for simplified implementation
  return cmmc2Level1Framework || defaultFramework;
};

// Helper to get all available frameworks