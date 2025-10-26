import React from 'react';
import { AssessmentIntroScreen, CMMCControlAssessor, ComplianceGapAnalyzer } from '../components/LazyComponents';
import { AssessmentRoute } from './AssessmentRoute';
import { useNavigate } from 'react-router-dom';
import { logger } from '../utils/logger';
import { CMMCAssessmentPage, PrivacyAssessmentPage } from '../components/PlaceholderPages';

// Gap Analysis Component
const GapAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const addNotification = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    logger.info(`${type}: ${message}`);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ComplianceGapAnalyzer
        savedAssessments={[]}
        onStartAssessment={() => navigate('/assessment-intro')}
        addNotification={addNotification}
      />
    </div>
  );
};

export const assessmentRoutes = [
  {
    path: "/assessment-intro",
    element: AssessmentIntroScreen,
    title: "Assessment Introduction"
  },
  {
    path: "/assessment/:id",
    element: AssessmentRoute,
    title: "Assessment View"
  },
  {
    path: "/control-assessor",
    element: CMMCControlAssessor,
    title: "Control Assessor"
  },
  {
    path: "/gap-analysis",
    element: GapAnalysisPage,
    title: "Gap Analysis"
  },
  {
    path: "/cmmc-assessment",
    element: CMMCAssessmentPage,
    title: "CMMC Assessment"
  },
  {
    path: "/privacy-assessment",
    element: PrivacyAssessmentPage,
    title: "Privacy Assessment"
  }
];
