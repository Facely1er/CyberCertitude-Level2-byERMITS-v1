import React from 'react';
import { 
  FileText, 
  Download, 
  Play, 
  Calendar, 
  BarChart3, 
  Plus,
  Eye,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { AssessmentData, UserProfile, NotificationMessage } from '../shared/types';
import { Breadcrumbs } from '../shared/components/layout/Breadcrumbs';
import { useInternalLinking } from '../shared/hooks/useInternalLinking';

interface AssessmentReportsPageProps {
  savedAssessments: AssessmentData[];
  onGenerateReport: (assessment: AssessmentData) => void;
  onExportReport: (assessment: AssessmentData, format: 'json' | 'csv' | 'pdf') => Promise<void>;
  onStartAssessment: () => void;
  userProfile: UserProfile | null;
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

export const AssessmentReportsPage: React.FC<AssessmentReportsPageProps> = ({
  savedAssessments,
  onGenerateReport,
  onExportReport,
  onStartAssessment,
  userProfile,
  addNotification
}) => {
  const { breadcrumbs } = useInternalLinking();

  const handleExport = async (assessment: AssessmentData, format: 'json' | 'csv' | 'pdf') => {
    try {
      await onExportReport(assessment, format);
      addNotification('success', `Report exported as ${format.toUpperCase()}`);
    } catch (error) {
      addNotification('error', 'Failed to export report');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCompletionPercentage = (assessment: AssessmentData) => {
    const totalQuestions = Object.keys(assessment.responses).length;
    const completedQuestions = Object.values(assessment.responses).filter(value => value !== null && value !== undefined).length;
    return totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Breadcrumbs items={breadcrumbs} />
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Assessment Reports
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              View and manage your assessment reports and analytics
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onStartAssessment}
                className="flex items-center justify-center px-6 py-3 bg-primary-gold text-white rounded-lg hover:bg-primary-gold/90 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Start New Assessment
              </button>
              <button
                onClick={() => window.location.href = '/reports/advanced'}
                className="flex items-center justify-center px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Advanced Analytics
              </button>
              <button
                onClick={() => window.location.href = '/reports/team'}
                className="flex items-center justify-center px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Team Tracking
              </button>
            </div>
          </div>
        </div>

        {/* Assessments List */}
        <div className="space-y-6">
          {savedAssessments.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Assessments Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Get started by creating your first assessment to generate reports and insights.
              </p>
              <button
                onClick={onStartAssessment}
                className="bg-primary-gold text-white px-6 py-3 rounded-lg hover:bg-primary-gold/90 transition-colors"
              >
                Start Your First Assessment
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {savedAssessments.map((assessment) => {
                const completionPercentage = getCompletionPercentage(assessment);
                const overallScore = assessment.overallScore || 0;
                
                return (
                  <div
                    key={assessment.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {assessment.name || 'Untitled Assessment'}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {assessment.frameworkId.toUpperCase()} Framework
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-medium ${getScoreColor(overallScore)}`}>
                              {overallScore}%
                            </span>
                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  overallScore >= 80 ? 'bg-green-500' :
                                  overallScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${overallScore}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatDate(assessment.createdAt)}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            {completionPercentage}% Complete
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <FileText className="w-4 h-4 mr-2" />
                            {Object.keys(assessment.responses).length} Questions
                          </div>
                        </div>

                        {assessment.lastModifiedAt !== assessment.createdAt && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                            Last modified: {formatDate(assessment.lastModifiedAt)}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 mt-4 lg:mt-0 lg:ml-6">
                        <button
                          onClick={() => onGenerateReport(assessment)}
                          className="flex items-center justify-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Report
                        </button>
                        <div className="relative group">
                          <button className="flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            <Download className="w-4 h-4 mr-2" />
                            Export
                          </button>
                          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                            <div className="py-2">
                              <button
                                onClick={() => handleExport(assessment, 'pdf')}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                Export as PDF
                              </button>
                              <button
                                onClick={() => handleExport(assessment, 'csv')}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                Export as CSV
                              </button>
                              <button
                                onClick={() => handleExport(assessment, 'json')}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                Export as JSON
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentReportsPage;