import React, { useState, useMemo } from 'react';
import { TriangleAlert as AlertTriangle, Target, CircleCheck as CheckCircle, Clock, ChartBar as BarChart3, Plus, Lightbulb, Star } from 'lucide-react';
import { AssessmentData } from '../../../shared/types';
import { cmmcFramework } from '../../../data/frameworks';
import { BarChart } from '../../../shared/components/charts/BarChart';
import { Breadcrumbs } from '../../../shared/components/layout/Breadcrumbs';
import { useInternalLinking } from '../../../shared/hooks/useInternalLinking';

interface ComplianceGapAnalyzerProps {
  savedAssessments: AssessmentData[];
  onStartAssessment: () => void;
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

interface GapAnalysis {
  functionName: string;
  currentScore: number;
  targetScore: number;
  gap: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  recommendations: string[];
  estimatedEffort: 'low' | 'medium' | 'high';
  timeframe: string;
  businessImpact: string;
  requiredActions: string[];
}

const generateRecommendations = (functionId: string, _gap: number): string[] => {
  const recommendations: Record<string, string[]> = {
    'govern': [
      'Establish formal cybersecurity governance framework',
      'Define clear roles and responsibilities for cybersecurity',
      'Implement risk management strategy and procedures',
      'Develop cybersecurity policies aligned with business objectives'
    ],
    'identify': [
      'Complete comprehensive asset inventory and classification',
      'Conduct thorough risk assessments across all business functions',
      'Implement continuous asset discovery and monitoring',
      'Establish risk tolerance and acceptance criteria'
    ],
    'protect': [
      'Deploy identity and access management controls',
      'Implement data protection and encryption measures',
      'Establish security awareness training programs',
      'Deploy protective technologies and monitoring tools'
    ],
    'detect': [
      'Implement continuous monitoring capabilities',
      'Deploy security event detection and analysis tools',
      'Establish security operations center (SOC) capabilities',
      'Implement threat intelligence and anomaly detection'
    ],
    'respond': [
      'Develop comprehensive incident response plans',
      'Establish incident response team and procedures',
      'Implement communication and coordination protocols',
      'Conduct regular incident response exercises'
    ],
    'recover': [
      'Develop business continuity and disaster recovery plans',
      'Implement backup and recovery procedures',
      'Establish recovery time and point objectives',
      'Conduct regular recovery testing and validation'
    ]
  };

  return recommendations[functionId] || [];
};

const getBusinessImpact = (functionId: string, _gap: number): string => {
  const impacts: Record<string, string> = {
    'govern': 'Lack of governance increases regulatory compliance risks and reduces executive oversight of cybersecurity initiatives',
    'identify': 'Poor asset and risk visibility increases likelihood of undetected vulnerabilities and compliance gaps',
    'protect': 'Inadequate protective measures significantly increase risk of successful cyberattacks and data breaches',
    'detect': 'Limited detection capabilities result in longer dwell time for threats and increased incident impact',
    'respond': 'Ineffective response capabilities lead to extended downtime and greater business disruption during incidents',
    'recover': 'Poor recovery capabilities result in prolonged business disruption and potential revenue loss'
  };

  return impacts[functionId] || 'Implementation gap increases overall cybersecurity risk exposure';
};

const getRequiredActions = (functionId: string, _gap: number): string[] => {
  const actions: Record<string, string[]> = {
    'govern': [
      'Appoint cybersecurity governance committee',
      'Develop cybersecurity strategy document',
      'Establish policy review and approval process',
      'Implement governance metrics and reporting'
    ],
    'identify': [
      'Deploy automated asset discovery tools',
      'Conduct comprehensive risk assessment',
      'Implement vulnerability management program',
      'Establish threat intelligence capabilities'
    ],
    'protect': [
      'Deploy multi-factor authentication',
      'Implement data loss prevention (DLP)',
      'Establish security training program',
      'Deploy endpoint protection platforms'
    ],
    'detect': [
      'Deploy SIEM/SOAR platforms',
      'Implement network monitoring tools',
      'Establish 24/7 monitoring capabilities',
      'Deploy threat hunting capabilities'
    ],
    'respond': [
      'Create incident response playbooks',
      'Establish incident response team',
      'Implement crisis communication plan',
      'Conduct tabletop exercises'
    ],
    'recover': [
      'Develop business continuity plans',
      'Implement backup and recovery systems',
      'Establish recovery testing schedule',
      'Create communication and coordination procedures'
    ]
  };

  return actions[functionId] || [];
};

const ComplianceGapAnalyzer: React.FC<ComplianceGapAnalyzerProps> = ({
  savedAssessments,
  onStartAssessment,
  addNotification
}) => {
  const { breadcrumbs } = useInternalLinking();
  const [selectedAssessment, setSelectedAssessment] = useState<string>('latest');
  const [targetMaturityLevel, setTargetMaturityLevel] = useState<number>(3); // Repeatable level

  const gapAnalysis = useMemo(() => {
    if (savedAssessments.length === 0) return [];

    const assessment = selectedAssessment === 'latest' 
      ? savedAssessments.sort((a, b) => {
          const aTime = a.lastModified ? new Date(a.lastModified).getTime() : 0;
          const bTime = b.lastModified ? new Date(b.lastModified).getTime() : 0;
          if (isNaN(aTime) || isNaN(bTime)) {
            return isNaN(aTime) && isNaN(bTime) ? 0 : (isNaN(aTime) ? 1 : -1);
          }
          return bTime - aTime;
        })[0]
      : savedAssessments.find(a => a.id === selectedAssessment);

    if (!assessment) return [];

    const framework = cmmcFramework;
    return framework.sections.map(section => {
      // Calculate current score for this function
      const sectionQuestions = section.categories.reduce((questions, category) => {
        return [...questions, ...category.questions];
      }, [] as any[]);
      
      const sectionResponses = sectionQuestions
        .map(q => assessment.responses[q.id])
        .filter(r => r !== undefined);
      
      const currentScore = sectionResponses.length > 0
        ? Math.round((sectionResponses.reduce((sum, value) => sum + value, 0) / sectionResponses.length) * 25)
        : 0;

      const targetScore = targetMaturityLevel * 25; // Convert maturity level to percentage
      const gap = Math.max(0, targetScore - currentScore);

      const priority = gap > 50 ? 'critical' : gap > 30 ? 'high' : gap > 15 ? 'medium' : 'low';
      const estimatedEffort = gap > 40 ? 'high' : gap > 20 ? 'medium' : 'low';
      const timeframe = gap > 40 ? '6-12 months' : gap > 20 ? '3-6 months' : '1-3 months';

      return {
        functionName: section.name,
        currentScore,
        targetScore,
        gap,
        priority,
        recommendations: generateRecommendations(section.id, gap),
        estimatedEffort,
        timeframe,
        businessImpact: getBusinessImpact(section.id, gap),
        requiredActions: getRequiredActions(section.id, gap)
      } as GapAnalysis;
    }).filter(analysis => analysis.gap > 0);
  }, [savedAssessments, selectedAssessment, targetMaturityLevel]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-300 border-error-200 dark:border-error-800';
      case 'high': return 'bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-300 border-warning-200 dark:border-warning-800';
      case 'medium': return 'bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-300 border-warning-200 dark:border-warning-800';
      case 'low': return 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300 border-success-200 dark:border-success-800';
      default: return 'bg-support-light dark:bg-support-dark/30 text-text-primary-light dark:text-text-primary-dark border-support-light dark:border-support-dark';
    }
  };

  const getEffortIcon = (effort: string) => {
    switch (effort) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-error-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-warning-500" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-success-500" />;
      default: return <Clock className="w-4 h-4 text-text-muted-light dark:text-text-muted-dark" />;
    }
  };

  if (savedAssessments.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-12 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-2xl">
              <Target className="w-12 h-12 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            Start Your NIST CSF v2.0 Assessment
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mb-8 max-w-2xl mx-auto">
            Complete a NIST CSF v2.0 assessment to generate comprehensive gap analysis and implementation recommendations.
          </p>
          <button
            onClick={onStartAssessment}
            className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 inline-flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Start Assessment</span>
          </button>
        </div>
      </div>
    );
  }

  const totalGapScore = gapAnalysis.reduce((sum, analysis) => sum + analysis.gap, 0);
  const avgGap = gapAnalysis.length > 0 ? Math.round(totalGapScore / gapAnalysis.length) : 0;
  const criticalGaps = gapAnalysis.filter(a => a.priority === 'critical').length;
  const highGaps = gapAnalysis.filter(a => a.priority === 'high').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      
      {/* Header */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-warning-100 to-error-100 dark:from-warning-900/30 dark:to-error-900/30 rounded-xl">
                <Target className="w-8 h-8 text-warning-600 dark:text-warning-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  NIST CSF v2.0 Gap Analysis
                </h1>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  Comprehensive analysis of implementation gaps and recommendations
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={selectedAssessment}
                onChange={(e) => setSelectedAssessment(e.target.value)}
                className="px-4 py-2 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="latest">Latest Assessment</option>
                {savedAssessments.map(assessment => (
                  <option key={assessment.id} value={assessment.id}>
                    {new Date(assessment.lastModified).toLocaleDateString()}
                  </option>
                ))}
              </select>
              
              <select
                value={targetMaturityLevel}
                onChange={(e) => setTargetMaturityLevel(Number(e.target.value))}
                className="px-4 py-2 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value={2}>Target: Risk Informed (50%)</option>
                <option value={3}>Target: Repeatable (75%)</option>
                <option value={4}>Target: Adaptive (100%)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Gap Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-lg border border-support-light dark:border-support-dark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Average Gap</p>
              <p className="text-3xl font-bold text-warning-600 dark:text-warning-400">{avgGap}%</p>
            </div>
            <Target className="w-8 h-8 text-warning-600 dark:text-warning-400" />
          </div>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-lg border border-support-light dark:border-support-dark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Critical Gaps</p>
              <p className="text-3xl font-bold text-error-600 dark:text-error-400">{criticalGaps}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-error-600 dark:text-error-400" />
          </div>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-lg border border-support-light dark:border-support-dark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">High Priority</p>
              <p className="text-3xl font-bold text-warning-600 dark:text-warning-400">{highGaps}</p>
            </div>
            <Clock className="w-8 h-8 text-warning-600 dark:text-warning-400" />
          </div>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-lg border border-support-light dark:border-support-dark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Functions Analyzed</p>
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{gapAnalysis.length}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
      </div>

      {/* Gap Analysis Chart */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6 mb-8">
        <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-6">
          NIST CSF v2.0 Function Gap Analysis
        </h3>
        
        <div className="h-80">
          <BarChart
            data={{
              labels: gapAnalysis.map(analysis => analysis.functionName),
              datasets: [
                {
                  label: 'Current Score',
                  data: gapAnalysis.map(analysis => analysis.currentScore),
                  backgroundColor: 'rgba(59, 130, 246, 0.8)',
                  borderColor: 'rgba(59, 130, 246, 1)',
                  borderWidth: 2
                },
                {
                  label: 'Target Score',
                  data: gapAnalysis.map(analysis => analysis.targetScore),
                  backgroundColor: 'rgba(34, 197, 94, 0.8)',
                  borderColor: 'rgba(34, 197, 94, 1)',
                  borderWidth: 2
                },
                {
                  label: 'Gap',
                  data: gapAnalysis.map(analysis => analysis.gap),
                  backgroundColor: 'rgba(239, 68, 68, 0.8)',
                  borderColor: 'rgba(239, 68, 68, 1)',
                  borderWidth: 2
                }
              ]
            }}
            height={320}
            title="NIST CSF v2.0 Implementation Gaps by Function"
          />
        </div>
      </div>

      {/* Detailed Gap Analysis */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
          Detailed Gap Analysis & Recommendations
        </h2>
        
        {gapAnalysis.map((analysis, index) => (
          <div key={index} className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    {analysis.functionName}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(analysis.priority)}`}>
                    {analysis.priority.toUpperCase()} PRIORITY
                  </span>
                </div>
                <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
                  {analysis.businessImpact}
                </p>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold text-error-600 dark:text-error-400 mb-1">
                  {analysis.gap}%
                </div>
                <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Gap to Target</div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {analysis.currentScore}%
                </div>
                <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Current Score</div>
              </div>
              
              <div className="text-center p-4 bg-success-50 dark:bg-success-900/20 rounded-lg">
                <div className="text-2xl font-bold text-success-600 dark:text-success-400">
                  {analysis.targetScore}%
                </div>
                <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Target Score</div>
              </div>
              
              <div className="flex items-center justify-center space-x-2 p-4 bg-support-light dark:bg-support-dark/50 rounded-lg">
                {getEffortIcon(analysis.estimatedEffort)}
                <div className="text-center">
                  <div className="font-medium text-text-primary-light dark:text-text-primary-dark capitalize">
                    {analysis.estimatedEffort}
                  </div>
                  <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Effort</div>
                </div>
              </div>
              
              <div className="text-center p-4 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg">
                <div className="text-lg font-bold text-secondary-600 dark:text-secondary-400">
                  {analysis.timeframe}
                </div>
                <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Timeframe</div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="mb-6">
              <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-3 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-warning-500" />
                Key Recommendations
              </h4>
              <div className="grid md:grid-cols-2 gap-3">
                {analysis.recommendations.map((rec, recIndex) => (
                  <div key={recIndex} className="flex items-start space-x-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                    <Star className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                    <span className="text-primary-800 dark:text-primary-200 text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Required Actions */}
            <div>
              <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-success-500" />
                Required Actions
              </h4>
              <div className="grid md:grid-cols-2 gap-2">
                {analysis.requiredActions.map((action, actionIndex) => (
                  <div key={actionIndex} className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-6 h-6 bg-success-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      {actionIndex + 1}
                    </div>
                    <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Implementation Summary */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl p-8 mt-8 border border-primary-200 dark:border-primary-800">
        <h3 className="text-2xl font-bold text-primary-900 dark:text-primary-100 mb-4">
          Implementation Summary
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">{gapAnalysis.length}</div>
            <div className="text-primary-800 dark:text-primary-200">Functions Requiring Improvement</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-warning-600 dark:text-warning-400 mb-2">
              {gapAnalysis.filter(a => a.estimatedEffort === 'high').length}
            </div>
            <div className="text-primary-800 dark:text-primary-200">High Effort Implementations</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-success-600 dark:text-success-400 mb-2">6-12</div>
            <div className="text-primary-800 dark:text-primary-200">Months Estimated Timeline</div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-primary-200 dark:border-primary-700">
          <p className="text-primary-800 dark:text-primary-200 mb-4">
            <strong>Next Steps:</strong> Prioritize critical and high-priority gaps, develop implementation plans for each NIST function, 
            and begin systematic evidence collection to support control implementation.
          </p>
          <button
            onClick={() => addNotification('info', 'Implementation planning feature coming soon')}
            className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            Create Implementation Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceGapAnalyzer;