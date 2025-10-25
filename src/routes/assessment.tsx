import { AssessmentIntroScreen, CMMCControlAssessor, ComplianceGapAnalyzer } from '../components/LazyComponents';
import { AssessmentRoute } from './AssessmentRoute';
import { useNavigate } from 'react-router-dom';

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
    element: () => {
      const navigate = useNavigate();
      const addNotification = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
        console.log(`${type}: ${message}`);
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
    },
    title: "Gap Analysis"
  }
];
