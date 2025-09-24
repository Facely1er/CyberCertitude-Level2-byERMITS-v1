import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Activity,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { AssessmentData, UserProfile } from '../shared/types';
import { Breadcrumbs } from '../shared/components/layout/Breadcrumbs';
import { useInternalLinking } from '../shared/hooks/useInternalLinking';
import { logger } from '../utils/logger';

interface AdvancedReportingDashboardProps {
  savedAssessments: AssessmentData[];
  userProfile: UserProfile | null;
  onExportReport: (assessment: AssessmentData, format: 'json' | 'csv' | 'pdf') => Promise<void>;
}

export const AdvancedReportingDashboard: React.FC<AdvancedReportingDashboardProps> = ({
  savedAssessments,
  userProfile,
  onExportReport
}) => {
  const { breadcrumbs } = useInternalLinking();

  const handleExport = async (assessment: AssessmentData, format: 'json' | 'csv' | 'pdf') => {
    try {
      await onExportReport(assessment, format);
    } catch (error) {
      logger.error('Export failed:', error);
    }
  };

  const getCompletionStats = () => {
    const total = savedAssessments.length;
    const completed = savedAssessments.filter(a => (a.overallScore || 0) >= 80).length;
    const inProgress = savedAssessments.filter(a => {
      const score = a.overallScore || 0;
      return score > 0 && score < 80;
    }).length;
    const notStarted = savedAssessments.filter(a => (a.overallScore || 0) === 0).length;

    return { total, completed, inProgress, notStarted };
  };

  const getAverageScore = () => {
    if (savedAssessments.length === 0) return 0;
    const total = savedAssessments.reduce((sum, a) => sum + (a.overallScore || 0), 0);
    return Math.round(total / savedAssessments.length);
  };

  const stats = getCompletionStats();
  const averageScore = getAverageScore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Breadcrumbs items={breadcrumbs} />
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Advanced Reporting Dashboard
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Comprehensive analytics and insights for your assessments
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Assessments</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Activity className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">In Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.inProgress}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <PieChart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Average Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{averageScore}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Completion Status Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Assessment Completion Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Completed</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">In Progress</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Not Started</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gray-500 h-2 rounded-full" 
                      style={{ width: `${stats.total > 0 ? (stats.notStarted / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {stats.total > 0 ? Math.round((stats.notStarted / stats.total) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Score Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Score Distribution
            </h3>
            <div className="space-y-4">
              {savedAssessments.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No assessments available for analysis
                </p>
              ) : (
                savedAssessments.slice(0, 5).map((assessment, index) => (
                  <div key={assessment.id} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {assessment.name || `Assessment ${index + 1}`}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            (assessment.overallScore || 0) >= 80 ? 'bg-green-500' :
                            (assessment.overallScore || 0) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${assessment.overallScore || 0}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                        {assessment.overallScore || 0}%
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Assessments */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Assessments
              </h3>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <Filter className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            {savedAssessments.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No assessments available for reporting
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {savedAssessments.slice(0, 10).map((assessment) => (
                  <div key={assessment.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {assessment.name || 'Untitled Assessment'}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {assessment.frameworkId.toUpperCase()} • {new Date(assessment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {assessment.overallScore || 0}%
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Score</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleExport(assessment, 'pdf')}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          title="Export as PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedReportingDashboard;