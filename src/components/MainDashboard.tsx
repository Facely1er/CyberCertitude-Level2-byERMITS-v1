import React from 'react';
import { BarChart3, FileText, Play, Upload, Trash2, User } from 'lucide-react';
import { AssessmentData, UserProfile } from '../shared/types';

interface MainDashboardProps {
  savedAssessments: AssessmentData[];
  onStartAssessment: () => void;
  onLoadAssessment: (assessment: AssessmentData) => void;
  onDeleteAssessment: (assessment: AssessmentData) => void;
  onGenerateReport: (assessment: AssessmentData) => void;
  onExportAssessment: (assessment: AssessmentData) => void;
  onImportAssessment: () => void;
  userProfile: UserProfile | null;
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  savedAssessments,
  onStartAssessment,
  onLoadAssessment,
  onDeleteAssessment,
  onGenerateReport,
  onExportAssessment,
  onImportAssessment,
  userProfile
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            CMMC 2.0 Level 1 Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your compliance assessments and track your progress
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <button
            onClick={onStartAssessment}
            className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-lg shadow-md transition-colors flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Start a new CMMC assessment"
          >
            <Play className="h-6 w-6" />
            <span className="font-medium">Start New Assessment</span>
          </button>

          <button
            onClick={onImportAssessment}
            className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-lg shadow-md transition-colors flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Import an existing assessment"
          >
            <Upload className="h-6 w-6" />
            <span className="font-medium">Import Assessment</span>
          </button>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Total Assessments
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {savedAssessments.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Completed
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {savedAssessments.filter((a: AssessmentData) => a.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Assessments */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Recent Assessments
            </h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {savedAssessments.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No assessments yet. Start your first assessment to get started.
                </p>
              </div>
            ) : (
              savedAssessments.slice(0, 5).map((assessment: AssessmentData) => (
                <div key={assessment.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {assessment.name || `Assessment ${assessment.id}`}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Created: {new Date(assessment.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Status: <span className={`capitalize ${assessment.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {assessment.status}
                      </span>
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onLoadAssessment(assessment)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded px-1 py-0.5"
                      aria-label={`Open assessment ${assessment.name || assessment.id}`}
                    >
                      Open
                    </button>
                    <button
                      onClick={() => onGenerateReport(assessment)}
                      className="text-green-600 hover:text-green-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 rounded px-1 py-0.5"
                      aria-label={`Generate report for ${assessment.name || assessment.id}`}
                    >
                      Report
                    </button>
                    <button
                      onClick={() => onExportAssessment(assessment)}
                      className="text-gray-600 hover:text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 rounded px-1 py-0.5"
                      aria-label={`Export assessment ${assessment.name || assessment.id}`}
                    >
                      Export
                    </button>
                    <button
                      onClick={() => onDeleteAssessment(assessment)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 rounded px-1 py-0.5"
                      aria-label={`Delete assessment ${assessment.name || assessment.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* User Profile Info */}
        {userProfile && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3">
              <User className="h-6 w-6 text-gray-600" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Welcome, {userProfile.name || 'User'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {userProfile.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainDashboard;