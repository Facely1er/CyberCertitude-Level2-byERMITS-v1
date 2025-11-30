import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AssessmentData, UserProfile, NotificationMessage } from '../../../shared/types';
import { CMMCLevel1EnhancedAssessmentView } from './CMMCLevel1EnhancedAssessmentView';
import { cmmc2Level1Framework } from '../../../data/frameworks/cmmc-2.0-level1';

interface CMMCLevel1AssessmentRouteProps {
  savedAssessments: AssessmentData[];
  saveAssessment: (assessment: AssessmentData) => Promise<AssessmentData>;
  userProfile: UserProfile | null;
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
  navigate: (path: string) => void;
  onGenerateReport: (assessment: AssessmentData) => void;
}

export const CMMCLevel1AssessmentRoute: React.FC<CMMCLevel1AssessmentRouteProps> = ({
  savedAssessments,
  saveAssessment,
  userProfile,
  addNotification,
  navigate,
  onGenerateReport
}) => {
  const { id } = useParams<{ id: string }>();
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundAssessment = savedAssessments.find(a => a.id === id);
      if (foundAssessment) {
        setAssessment(foundAssessment);
      } else {
        addNotification('error', 'Assessment not found');
        navigate('/dashboard');
      }
    }
    setLoading(false);
  }, [id, savedAssessments, addNotification, navigate]);

  const handleSave = async (updatedAssessment: AssessmentData) => {
    try {
      const savedAssessment = await saveAssessment(updatedAssessment);
      setAssessment(savedAssessment);
      return savedAssessment;
    } catch (error) {
      addNotification('error', 'Failed to save assessment');
      throw error;
    }
  };

  const handleComplete = () => {
    if (assessment) {
      const completedAssessment = {
        ...assessment,
        isComplete: true,
        completedAt: new Date(),
        lastModified: new Date()
      };
      
      handleSave(completedAssessment).then(() => {
        addNotification('success', 'CMMC Level 1 assessment completed successfully!');
        navigate('/dashboard');
      });
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading assessment...</p>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Assessment Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          The requested CMMC Level 1 assessment could not be found.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <CMMCLevel1EnhancedAssessmentView
      assessment={assessment}
      framework={cmmc2Level1Framework}
      onSave={handleSave}
      onComplete={handleComplete}
      onBack={handleBack}
      userProfile={userProfile}
      addNotification={addNotification}
      onGenerateReport={onGenerateReport}
    />
  );
};

export default CMMCLevel1AssessmentRoute;