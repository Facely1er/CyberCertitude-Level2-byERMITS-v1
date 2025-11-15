import React, { useState } from 'react';
import { ChartBar as BarChart3, TrendingUp, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, Target } from 'lucide-react';
import { Breadcrumbs } from '../../../shared/components/layout/Breadcrumbs';
import { useInternalLinking } from '../../../shared/hooks/useInternalLinking';

interface ComplianceDashboardProps {
  onBack: () => void;
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

const ComplianceDashboard: React.FC<ComplianceDashboardProps> = ({
  onBack,
  addNotification
}) => {
  const { breadcrumbs } = useInternalLinking();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const complianceData = {
    overall: {
      score: 78,
      maxScore: 100,
      status: 'partially-compliant',
      trend: 'up',
      change: '+5%'
    },
    sections: [
      {
        id: 'access-control',
        title: 'Access Control',
        score: 85,
        maxScore: 100,
        status: 'compliant',
        trend: 'up',
        change: '+3%',
        lastAudited: '2024-01-15',
        nextAudit: '2024-04-15'
      },
      {
        id: 'awareness-training',
        title: 'Awareness & Training',
        score: 72,
        maxScore: 100,
        status: 'partially-compliant',
        trend: 'up',
        change: '+8%',
        lastAudited: '2024-01-10',
        nextAudit: '2024-04-10'
      },
      {
        id: 'audit-accountability',
        title: 'Audit & Accountability',
        score: 90,
        maxScore: 100,
        status: 'compliant',
        trend: 'stable',
        change: '0%',
        lastAudited: '2024-01-20',
        nextAudit: '2024-04-20'
      },
      {
        id: 'configuration-management',
        title: 'Configuration Management',
        score: 65,
        maxScore: 100,
        status: 'partially-compliant',
        trend: 'down',
        change: '-2%',
        lastAudited: '2024-01-05',
        nextAudit: '2024-04-05'
      }
    ],
    alerts: [
      {
        id: '1',
        type: 'warning',
        title: 'Configuration Management Score Declining',
        message: 'Recent changes have reduced compliance score by 2%',
        priority: 'medium',
        status: 'active',
        createdDate: '2024-01-25',
        dueDate: '2024-02-01'
      },
      {
        id: '2',
        type: 'info',
        title: 'Quarterly Audit Scheduled',
        message: 'Next comprehensive audit is scheduled for April 15, 2024',
        priority: 'low',
        status: 'active',
        createdDate: '2024-01-20',
        dueDate: '2024-04-15'
      }
    ],
    milestones: [
      {
        id: '1',
        title: 'Complete Access Control Implementation',
        targetDate: '2024-03-01',
        status: 'in-progress',
        progress: 75,
        owner: 'Security Team'
      },
      {
        id: '2',
        title: 'Staff Security Training Completion',
        targetDate: '2024-02-15',
        status: 'pending',
        progress: 30,
        owner: 'HR Department'
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-success-600 bg-success-100';
      case 'partially-compliant': return 'text-yellow-600 bg-yellow-100';
      case 'non-compliant': return 'text-error-600 bg-error-100';
      default: return 'text-text-secondary-light bg-support-light';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-error-500" />;
      case 'info': return <CheckCircle className="w-4 h-4 text-primary-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-success-500" />;
      default: return <CheckCircle className="w-4 h-4 text-text-muted-light" />;
    }
  };

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-success-600 bg-success-100';
      case 'in-progress': return 'text-primary-600 bg-primary-100';
      case 'pending': return 'text-text-secondary-light bg-support-light';
      case 'overdue': return 'text-error-600 bg-error-100';
      default: return 'text-text-secondary-light bg-support-light';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-primary-600" />
          Compliance Dashboard
        </h1>
        <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2">
          Monitor your CMMC 2.0 compliance status and track progress over time
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6">
        <div className="flex gap-2">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-primary-600 text-white'
                  : 'bg-support-light dark:bg-surface-dark text-text-primary-light dark:text-text-secondary-dark hover:bg-support-light dark:hover:bg-primary-600'
              }`}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Overall Compliance Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
            Overall Compliance Score
          </h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-support-light dark:bg-surface-dark flex items-center justify-center">
                <div className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  {complianceData.overall.score}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-surface-light dark:bg-surface-dark rounded-full p-2 shadow-lg">
                <TrendingUp className="w-6 h-6 text-success-500" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complianceData.overall.status)}`}>
                  {complianceData.overall.status.replace('-', ' ').toUpperCase()}
                </span>
                <span className="text-sm text-success-600 dark:text-success-400 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {complianceData.overall.change}
                </span>
              </div>
              <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
                Your organization is making steady progress toward full CMMC 2.0 compliance.
              </p>
              <div className="w-full bg-support-light dark:bg-surface-dark rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${complianceData.overall.score}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => addNotification('info', 'Starting new assessment...')}
              className="w-full flex items-center gap-3 p-3 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
            >
              <Target className="w-5 h-5" />
              Start New Assessment
            </button>
            <button
              onClick={() => addNotification('info', 'Generating compliance report...')}
              className="w-full flex items-center gap-3 p-3 bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300 rounded-lg hover:bg-success-100 dark:hover:bg-success-900/30 transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
              Generate Report
            </button>
            <button
              onClick={() => addNotification('info', 'Scheduling audit...')}
              className="w-full flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            >
              <Clock className="w-5 h-5" />
              Schedule Audit
            </button>
          </div>
        </div>
      </div>

      {/* Compliance Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
            Compliance by Section
          </h3>
          <div className="space-y-4">
            {complianceData.sections.map((section) => (
              <div key={section.id} className="border border-support-light dark:border-support-dark rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-text-primary-light dark:text-text-primary-dark">
                    {section.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(section.status)}`}>
                      {section.status.replace('-', ' ').toUpperCase()}
                    </span>
                    <span className={`text-sm flex items-center gap-1 ${
                      section.trend === 'up' ? 'text-success-600' : section.trend === 'down' ? 'text-error-600' : 'text-text-secondary-light'
                    }`}>
                      {section.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : 
                       section.trend === 'down' ? <TrendingUp className="w-3 h-3 rotate-180" /> : null}
                      {section.change}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-text-secondary-light dark:text-text-muted-dark">
                  <span>Score: {section.score}/{section.maxScore}</span>
                  <span>Last Audited: {section.lastAudited}</span>
                </div>
                <div className="w-full bg-support-light dark:bg-surface-dark rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      section.status === 'compliant' ? 'bg-success-500' :
                      section.status === 'partially-compliant' ? 'bg-yellow-500' : 'bg-error-500'
                    }`}
                    style={{ width: `${(section.score / section.maxScore) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
            Recent Alerts
          </h3>
          <div className="space-y-3">
            {complianceData.alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 bg-background-light dark:bg-surface-dark rounded-lg">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <h4 className="font-medium text-text-primary-light dark:text-text-primary-dark text-sm">
                    {alert.title}
                  </h4>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mt-1">
                    {alert.message}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-text-muted-light dark:text-text-muted-dark">
                    <span>Due: {alert.dueDate}</span>
                    <span className={`px-2 py-1 rounded ${
                      alert.priority === 'high' ? 'bg-error-100 text-error-800' :
                      alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-primary-100 text-primary-800'
                    }`}>
                      {alert.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
          Compliance Milestones
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {complianceData.milestones.map((milestone) => (
            <div key={milestone.id} className="border border-support-light dark:border-support-dark rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-text-primary-light dark:text-text-primary-dark">
                  {milestone.title}
                </h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMilestoneStatusColor(milestone.status)}`}>
                  {milestone.status.toUpperCase()}
                </span>
              </div>
              <div className="text-sm text-text-secondary-light dark:text-text-muted-dark mb-3">
                <div>Target: {milestone.targetDate}</div>
                <div>Owner: {milestone.owner}</div>
              </div>
              <div className="w-full bg-support-light dark:bg-surface-dark rounded-full h-2 mb-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${milestone.progress}%` }}
                ></div>
              </div>
              <div className="text-sm text-text-secondary-light dark:text-text-muted-dark">
                {milestone.progress}% Complete
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComplianceDashboard;