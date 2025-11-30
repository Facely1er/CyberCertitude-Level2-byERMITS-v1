import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, AlertTriangle, Clock, Target, 
  FileText, Download, Calendar, Users, Shield,
  BarChart3, TrendingUp, AlertCircle, CheckSquare
} from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';
import { useInternalLinking } from '@/shared/hooks/useInternalLinking';
import { logger } from '@/utils/logger';

interface SelfAssessmentPreparationProps {
  onBack: () => void;
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

export const SelfAssessmentPreparation: React.FC<SelfAssessmentPreparationProps> = ({
  onBack,
  addNotification
}) => {
  const { breadcrumbs } = useInternalLinking();
  const [preparationStatus, setPreparationStatus] = useState({
    documentationComplete: false,
    evidenceCollected: false,
    controlsAssessed: false,
    gapsIdentified: false,
    remediationPlanned: false,
    teamTrained: false
  });

  const [readinessScore, setReadinessScore] = useState(0);

  useEffect(() => {
    calculateReadinessScore();
  }, [preparationStatus]);

  const calculateReadinessScore = () => {
    const statuses = Object.values(preparationStatus);
    const completedCount = statuses.filter(status => status).length;
    const score = Math.round((completedCount / statuses.length) * 100);
    setReadinessScore(score);
  };

  const toggleStatus = (key: keyof typeof preparationStatus) => {
    setPreparationStatus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const preparationSteps = [
    {
      id: 'documentationComplete',
      title: 'Documentation Review',
      description: 'Review and organize all security policies, procedures, and documentation',
      icon: FileText,
      status: preparationStatus.documentationComplete,
      priority: 'high'
    },
    {
      id: 'evidenceCollected',
      title: 'Evidence Collection',
      description: 'Gather evidence for each security control implementation',
      icon: Shield,
      status: preparationStatus.evidenceCollected,
      priority: 'high'
    },
    {
      id: 'controlsAssessed',
      title: 'Control Assessment',
      description: 'Assess current implementation status of all required controls',
      icon: CheckSquare,
      status: preparationStatus.controlsAssessed,
      priority: 'high'
    },
    {
      id: 'gapsIdentified',
      title: 'Gap Analysis',
      description: 'Identify gaps between current state and required controls',
      icon: AlertTriangle,
      status: preparationStatus.gapsIdentified,
      priority: 'medium'
    },
    {
      id: 'remediationPlanned',
      title: 'Remediation Planning',
      description: 'Develop action plans to address identified gaps',
      icon: Target,
      status: preparationStatus.remediationPlanned,
      priority: 'medium'
    },
    {
      id: 'teamTrained',
      title: 'Team Training',
      description: 'Ensure team members are trained on assessment procedures',
      icon: Users,
      status: preparationStatus.teamTrained,
      priority: 'low'
    }
  ];

  const getReadinessColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getReadinessStatus = (score: number) => {
    if (score >= 80) return 'Ready for Assessment';
    if (score >= 60) return 'Nearly Ready';
    return 'Needs Preparation';
  };

  return (
    <div className="min-h-screen bg-gradient-brand-subtle dark:bg-gradient-dark-brand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={breadcrumbs} />
        
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Self-Assessment Preparation
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Prepare your organization for CMMC Level 1 self-assessment
              </p>
            </div>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Readiness Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Assessment Readiness
              </h2>
              <div className={`text-2xl font-bold ${getReadinessColor(readinessScore)}`}>
                {readinessScore}%
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  readinessScore >= 80 ? 'bg-green-500' : 
                  readinessScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${readinessScore}%` }}
              />
            </div>
            <p className={`text-sm font-medium ${getReadinessColor(readinessScore)}`}>
              {getReadinessStatus(readinessScore)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => addNotification('info', 'Opening evidence collection dashboard')}
                className="w-full flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-blue-900 dark:text-blue-100 font-medium">Collect Evidence</span>
              </button>
              <button
                onClick={() => addNotification('info', 'Opening control assessment')}
                className="w-full flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                <CheckSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-green-900 dark:text-green-100 font-medium">Assess Controls</span>
              </button>
              <button
                onClick={() => addNotification('info', 'Generating readiness report')}
                className="w-full flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                <Download className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-purple-900 dark:text-purple-100 font-medium">Export Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Preparation Steps */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Preparation Checklist
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {preparationSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    step.status
                      ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => toggleStatus(step.id as keyof typeof preparationStatus)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      step.status 
                        ? 'bg-green-100 dark:bg-green-900/30' 
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      {step.status ? (
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`font-medium ${
                          step.status 
                            ? 'text-green-900 dark:text-green-100' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {step.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          step.priority === 'high' 
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                            : step.priority === 'medium'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                        }`}>
                          {step.priority}
                        </span>
                      </div>
                      <p className={`text-sm ${
                        step.status 
                          ? 'text-green-700 dark:text-green-300' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Assessment Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Assessment Timeline
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <div>
                <h3 className="font-medium text-blue-900 dark:text-blue-100">Pre-Assessment Phase</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">Complete all preparation steps</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              <div>
                <h3 className="font-medium text-yellow-900 dark:text-yellow-100">Assessment Phase</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">Conduct self-assessment evaluation</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              <div>
                <h3 className="font-medium text-green-900 dark:text-green-100">Post-Assessment Phase</h3>
                <p className="text-sm text-green-700 dark:text-green-300">Review results and plan improvements</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelfAssessmentPreparation;