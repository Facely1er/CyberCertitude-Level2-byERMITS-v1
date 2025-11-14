import React, { useState } from 'react';
import { FileText, Download, ChartBar as BarChart3, TrendingUp, Shield, Target, Award, CircleCheck as CheckCircle, Settings } from 'lucide-react';
import { AssessmentData, UserProfile } from '../../../shared/types';
import { cmmcFramework } from '../../../data/frameworks';
import { PieChart } from '../../../shared/components/charts/PieChart';
import { BarChart } from '../../../shared/components/charts/BarChart';
import { LineChart as LineChartComponent } from '../../../shared/components/charts/LineChart';
import { Breadcrumbs } from '../../../shared/components/layout/Breadcrumbs';
import { useInternalLinking } from '../../../shared/hooks/useInternalLinking';

interface AdvancedReportingDashboardProps {
  savedAssessments: AssessmentData[];
  userProfile: UserProfile | null;
  onExportReport: (format: 'pdf' | 'excel' | 'json') => void;
}

const AdvancedReportingDashboard: React.FC<AdvancedReportingDashboardProps> = ({
  savedAssessments,
  onExportReport
}) => {
  const { breadcrumbs } = useInternalLinking();
  // const [selectedTimeframe, setSelectedTimeframe] = useState<'30d' | '90d' | '1y'>('90d');
  // const [selectedMetric, setSelectedMetric] = useState<'score' | 'progress' | 'compliance'>('score');
  const [reportType, setReportType] = useState<'executive' | 'detailed' | 'compliance'>('executive');

  const calculateAssessmentScore = (assessment: AssessmentData) => {
    if (!assessment || !assessment.responses || typeof assessment.responses !== 'object') {
      return 0;
    }
    const responses = Object.values(assessment.responses);
    if (responses.length === 0) return 0;
    return Math.round((responses.reduce((a, b) => a + b, 0) / responses.length) * 25);
  };

  // Generate trend data for the last 6 months
  const trendData = React.useMemo(() => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const monthAssessments = savedAssessments.filter(a => {
        const assessmentDate = new Date(a.lastModified);
        return assessmentDate >= monthDate && assessmentDate < nextMonthDate;
      });

      const avgScore = monthAssessments.length > 0
        ? Math.round(monthAssessments.map(calculateAssessmentScore).reduce((sum, score) => sum + score, 0) / monthAssessments.length)
        : 0;

      months.push({
        month: monthDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        score: avgScore,
        assessments: monthAssessments.length,
        compliance: avgScore >= 75 ? 100 : Math.round((avgScore / 75) * 100)
      });
    }
    
    return months;
  }, [savedAssessments]);

  // Function-level analysis
  const functionAnalysis = React.useMemo(() => {
    if (savedAssessments.length === 0) return [];

    const latestAssessment = savedAssessments.sort((a, b) => {
      const aTime = a.lastModified ? new Date(a.lastModified).getTime() : 0;
      const bTime = b.lastModified ? new Date(b.lastModified).getTime() : 0;
      if (isNaN(aTime) || isNaN(bTime)) {
        return isNaN(aTime) && isNaN(bTime) ? 0 : (isNaN(aTime) ? 1 : -1);
      }
      return bTime - aTime;
    })[0];

    if (!latestAssessment || !latestAssessment.responses) return [];

    return cmmcFramework.sections.map(section => {
      const sectionQuestions = section.categories.reduce((questions, category) => {
        return [...questions, ...category.questions];
      }, [] as any[]);
      
      const sectionResponses = sectionQuestions
        .map(q => latestAssessment.responses?.[q.id])
        .filter(r => r !== undefined);
      
      const score = sectionResponses.length > 0
        ? Math.round((sectionResponses.reduce((sum, value) => sum + value, 0) / sectionResponses.length) * 25)
        : 0;

      return {
        name: section.name,
        score,
        weight: section.weight,
        questionsAnswered: sectionResponses.length,
        totalQuestions: sectionQuestions.length,
        completionRate: Math.round((sectionResponses.length / sectionQuestions.length) * 100)
      };
    });
  }, [savedAssessments]);

  const overallMetrics = React.useMemo(() => {
    const totalAssessments = savedAssessments.length;
    const completedAssessments = savedAssessments.filter(a => a.isComplete).length;
    const avgScore = savedAssessments.length > 0 
      ? Math.round(savedAssessments.reduce((sum, assessment) => sum + calculateAssessmentScore(assessment), 0) / savedAssessments.length)
      : 0;
    
    const complianceRate = avgScore >= 75 ? 100 : Math.round((avgScore / 75) * 100);
    
    return {
      totalAssessments,
      completedAssessments,
      avgScore,
      complianceRate,
      improvementTrend: trendData.length >= 2 ? trendData[trendData.length - 1].score - trendData[trendData.length - 2].score : 0
    };
  }, [savedAssessments, trendData]);

  if (savedAssessments.length === 0) {
    return (
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-12 text-center">
        <FileText className="w-16 h-16 text-text-muted-light dark:text-text-muted-dark mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
          No Assessment Data Available
        </h3>
        <p className="text-text-secondary-light dark:text-text-secondary-dark">
          Complete a NIST CSF v2.0 assessment to generate comprehensive reports and analytics.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      
      {/* Header */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl">
                <BarChart3 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  Advanced Analytics
                </h2>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  Comprehensive reporting and trend analysis for implementation tracking
                </p>
              </div>
            </div>
          
          <div className="flex items-center space-x-3">
            <label htmlFor="report-type-select" className="sr-only">
              Select report type
            </label>
            <select
              id="report-type-select"
              aria-label="Select report type"
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="px-4 py-2 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="executive">Executive Summary</option>
              <option value="detailed">Detailed Analysis</option>
              <option value="compliance">Compliance Report</option>
            </select>
            
            <button
              onClick={() => onExportReport('pdf')}
              className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-lg border border-support-light dark:border-support-dark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Overall Score</p>
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{overallMetrics.avgScore}%</p>
              <div className="flex items-center space-x-1 mt-1">
                {overallMetrics.improvementTrend > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : overallMetrics.improvementTrend < 0 ? (
                  <TrendingUp className="w-4 h-4 text-error-500 rotate-180" />
                ) : null}
                <span className="text-xs text-text-muted-light dark:text-text-muted-dark">
                  Comprehensive CMMC reporting and compliance tracking
                </span>
              </div>
            </div>
            <Target className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-lg border border-support-light dark:border-support-dark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Compliance Rate</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{overallMetrics.complianceRate}%</p>
              <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
                Target: 75% (Repeatable)
              </p>
            </div>
            <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-lg border border-support-light dark:border-support-dark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Completed Assessments</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{overallMetrics.completedAssessments}</p>
              <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
                of {overallMetrics.totalAssessments} total
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-lg border border-support-light dark:border-support-dark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Maturity Level</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {overallMetrics.avgScore >= 76 ? '4' : overallMetrics.avgScore >= 51 ? '3' : overallMetrics.avgScore >= 26 ? '2' : '1'}
              </p>
              <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
                {overallMetrics.avgScore >= 76 ? 'Adaptive' : overallMetrics.avgScore >= 51 ? 'Repeatable' : overallMetrics.avgScore >= 26 ? 'Risk Informed' : 'Partial'}
              </p>
            </div>
            <Award className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Function Scores */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
          <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-6">
            NIST CSF v2.0 Function Scores
          </h3>
          <div className="h-80">
            <BarChart
              data={{
                labels: functionAnalysis.map(func => func.name.split(' ')[0]), // Short names
                datasets: [{
                  label: 'Current Score (%)',
                  data: functionAnalysis.map(func => func.score),
                  backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',   // Govern - Blue
                    'rgba(34, 197, 94, 0.8)',    // Identify - Green
                    'rgba(147, 51, 234, 0.8)',   // Protect - Purple
                    'rgba(249, 115, 22, 0.8)',   // Detect - Orange
                    'rgba(239, 68, 68, 0.8)',    // Respond - Red
                    'rgba(234, 179, 8, 0.8)'     // Recover - Yellow
                  ],
                  borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(34, 197, 94, 1)',
                    'rgba(147, 51, 234, 1)',
                    'rgba(249, 115, 22, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(234, 179, 8, 1)'
                  ],
                  borderWidth: 2
                }]
              }}
              height={320}
              showLegend={false}
            />
          </div>
        </div>

        {/* Trend Analysis */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
          <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-6">
            Implementation Progress Trend
          </h3>
          <div className="h-80">
            <LineChartComponent
              data={{
                labels: trendData.map(d => d.month),
                datasets: [{
                  label: 'Average Score (%)',
                  data: trendData.map(d => d.score),
                  borderColor: 'rgba(59, 130, 246, 1)',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  fill: true,
                  tension: 0.4
                }, {
                  label: 'Compliance Rate (%)',
                  data: trendData.map(d => d.compliance),
                  borderColor: 'rgba(34, 197, 94, 1)',
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  fill: true,
                  tension: 0.4
                }]
              }}
              height={320}
            />
          </div>
        </div>

        {/* Compliance Distribution */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
          <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-6">
            Compliance Distribution
          </h3>
          <div className="h-80">
            <PieChart
              labels={[
                'Adaptive (80%+)',
                'Repeatable (60-79%)',
                'Risk Informed (40-59%)',
                'Partial (<40%)'
              ]}
              data={[
                functionAnalysis.filter(f => f.score >= 80).length,
                functionAnalysis.filter(f => f.score >= 60 && f.score < 80).length,
                functionAnalysis.filter(f => f.score >= 40 && f.score < 60).length,
                functionAnalysis.filter(f => f.score < 40).length
              ]}
              backgroundColor={[
                '#10B981',
                '#F59E0B',
                '#F97316',
                '#EF4444'
              ]}
              title="Compliance Distribution"
            />
          </div>
        </div>
      </div>

      {/* Function Details Table */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
        <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-6">
          CMMC Domain Scores
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-support-light dark:border-support-dark">
                <th className="text-left py-3 px-4 font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
                  Function
                </th>
                <th className="text-center py-3 px-4 font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
                  Score
                </th>
                <th className="text-center py-3 px-4 font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
                  Weight
                </th>
                <th className="text-center py-3 px-4 font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
                  Progress
                </th>
                <th className="text-center py-3 px-4 font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {functionAnalysis.map((func, index) => (
                <tr key={index} className="hover:bg-support-light dark:hover:bg-support-dark/50">
                  <td className="py-4 px-4">
                    <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                      {func.name}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`text-lg font-bold ${
                      func.score >= 80 ? 'text-green-600 dark:text-green-400' :
                      func.score >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                      func.score >= 40 ? 'text-orange-600 dark:text-orange-400' :
                      'text-error-600 dark:text-error-400'
                    }`}>
                      {func.score}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center text-text-primary-light dark:text-text-primary-dark">
                    {func.weight}%
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="text-sm text-text-primary-light dark:text-text-primary-dark">
                      {func.questionsAnswered}/{func.totalQuestions}
                    </div>
                    <div className="text-xs text-text-muted-light dark:text-text-muted-dark">
                      {func.completionRate}% complete
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      func.score >= 80 ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                      func.score >= 60 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                      func.score >= 40 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' :
                      'bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-300'
                    }`}>
                      {func.score >= 80 ? 'Adaptive' :
                       func.score >= 60 ? 'Repeatable' :
                       func.score >= 40 ? 'Risk Informed' : 'Partial'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Executive Summary */}
      {reportType === 'executive' && (
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl p-8 border border-primary-200 dark:border-primary-800">
          <h3 className="text-2xl font-bold text-primary-900 dark:text-primary-100 mb-6">
            Executive Summary - NIST CSF v2.0 Implementation
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-primary-800 dark:text-primary-200 mb-3">
                Current State Assessment
              </h4>
              <ul className="space-y-2 text-primary-700 dark:text-primary-300">
                <li>• Overall maturity score: {overallMetrics.avgScore}%</li>
                <li>• {overallMetrics.completedAssessments} assessments completed</li>
                <li>• Current maturity level: {
                  overallMetrics.avgScore >= 76 ? 'Adaptive (Level 4)' :
                  overallMetrics.avgScore >= 51 ? 'Repeatable (Level 3)' :
                  overallMetrics.avgScore >= 26 ? 'Risk Informed (Level 2)' : 'Partial (Level 1)'
                }</li>
                <li>• Compliance rate: {overallMetrics.complianceRate}%</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-primary-800 dark:text-primary-200 mb-3">
                Key Recommendations
              </h4>
              <ul className="space-y-2 text-primary-700 dark:text-primary-300">
                <li>• Focus on functions scoring below 75%</li>
                <li>• Prioritize evidence collection for implemented controls</li>
                <li>• Establish continuous monitoring capabilities</li>
                <li>• Regular reassessment every 6-12 months</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
        <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
          Export & Sharing Options
        </h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => onExportReport('pdf')}
            className="flex items-center space-x-3 p-4 border border-support-light dark:border-support-dark rounded-lg hover:bg-support-light dark:hover:bg-support-dark/50 transition-colors"
          >
            <FileText className="w-6 h-6 text-error-600 dark:text-error-400" />
            <div className="text-left">
              <div className="font-medium text-text-primary-light dark:text-text-primary-dark">PDF Report</div>
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Executive summary and detailed analysis</div>
            </div>
          </button>
          
          <button
            onClick={() => onExportReport('excel')}
            className="flex items-center space-x-3 p-4 border border-support-light dark:border-support-dark rounded-lg hover:bg-support-light dark:hover:bg-support-dark/50 transition-colors"
          >
            <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
            <div className="text-left">
              <div className="font-medium text-text-primary-light dark:text-text-primary-dark">Excel Workbook</div>
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Data analysis and pivot tables</div>
            </div>
          </button>
          
          <button
            onClick={() => onExportReport('json')}
            className="flex items-center space-x-3 p-4 border border-support-light dark:border-support-dark rounded-lg hover:bg-support-light dark:hover:bg-support-dark/50 transition-colors"
          >
            <Settings className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <div className="text-left">
              <div className="font-medium text-text-primary-light dark:text-text-primary-dark">JSON Data</div>
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Raw data for integration</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedReportingDashboard;