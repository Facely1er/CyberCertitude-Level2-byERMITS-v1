import React from 'react';
import { useParams } from 'react-router-dom';
import EnhancedAssessmentView from '../features/assessment/components/EnhancedAssessmentView';
import { getFramework } from '../data/frameworks';
import { AssessmentData, UserProfile } from '../shared/types';

export interface AssessmentRouteProps {
  savedAssessments: AssessmentData[];
  saveAssessment: (assessment: AssessmentData) => Promise<AssessmentData>;
  userProfile: UserProfile | null;
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
  navigate: (path: string) => void;
  onGenerateReport: (assessment: AssessmentData) => void;
}

export const AssessmentRoute: React.FC<AssessmentRouteProps> = ({ 
  savedAssessments, 
  saveAssessment, 
  userProfile, 
  addNotification, 
  navigate, 
  onGenerateReport 
}) => {
  const { id } = useParams();
  
  if (!id) {
    return <div>No assessment ID provided</div>;
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
  
  if (!framework || !framework.sections) {
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
    <EnhancedAssessmentView
      assessment={assessment}
      framework={framework}
      onSave={async (updatedAssessment) => {
        const savedAssessment = await saveAssessment(updatedAssessment);
        addNotification('success', 'Assessment saved successfully');
        return savedAssessment;
      }}
      onComplete={() => {
        addNotification('success', 'Assessment completed!');
        navigate('/dashboard');
      }}
      onBack={() => navigate('/dashboard')}
      userProfile={userProfile}
      addNotification={addNotification}
      onGenerateReport={onGenerateReport}
    />
  );
};
