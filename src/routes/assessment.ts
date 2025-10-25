import { AssessmentIntroScreen, CMMCControlAssessor } from '../components/LazyComponents';
import { AssessmentRoute } from './AssessmentRoute';

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
    element: () => (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ComplianceGapAnalyzer
          onNavigate={navigate}
          onSave={(_analyzer) => addNotification('success', 'Gap analysis saved successfully')}
          onExport={(_analyzer) => addNotification('info', 'Gap analysis exported successfully')}
        />
      </div>
    ),
    title: "Gap Analysis"
  }
];
