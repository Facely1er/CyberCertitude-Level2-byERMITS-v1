import React from 'react';
import { useParams } from 'react-router-dom';
import ReportView from '../features/reporting/components/ReportView';
import { getFramework } from '../data/frameworks';
import { AssessmentData, UserProfile } from '../shared/types';

export interface ReportRouteProps {
  savedAssessments: AssessmentData[];
  userProfile: UserProfile | null;
  handleExportAssessment: (assessment: AssessmentData, format: 'json' | 'csv' | 'pdf') => Promise<void>;
  navigate: (path: string) => void;
}

export const ReportRoute: React.FC<ReportRouteProps> = ({ 
  savedAssessments, 
  userProfile, 
  handleExportAssessment, 
  navigate 
}) => {
  const { id } = useParams();
  
  if (!id) {
    return <div>No report ID provided</div>;
  }
  
  const assessment = savedAssessments.find(a => a.id === id);
  
  if (!assessment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="card-standard p-8">
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            Assessment Not Found
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
            The assessment you're looking for could not be found.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary px-6 py-3"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  const framework = getFramework(assessment.frameworkId);
  
  if (!framework) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="card-standard p-8">
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            Framework Not Found
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
            The assessment framework could not be loaded.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary px-6 py-3"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <ReportView
      assessment={assessment}
      framework={framework}
      onExport={handleExportAssessment}
      onBack={() => navigate('/dashboard')}
      userProfile={userProfile}
    />
  );
};
