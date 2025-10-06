import React, { useState, useEffect } from 'react';
import { CircleCheck as CheckCircle, Circle as XCircle, TriangleAlert as AlertTriangle, Clock, Shield, ChartBar as BarChart3, TrendingUp, TrendingDown, RefreshCw, Download, Eye, Settings, Users, FileText, Database, Target, Calendar, ExternalLink, Play, Pause, Store as Stop } from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/layout';
import { useInternalLinking } from '@/shared/hooks/useInternalLinking';

interface ComplianceMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'excellent' | 'good' | 'warning' | 'critical';
  lastUpdated: Date;
  description: string;
}

interface ComplianceControl {
  id: string;
  practice: string;
  title: string;
  domain: string;
  status: 'compliant' | 'partially-compliant' | 'non-compliant' | 'not-assessed';
  priority: 'critical' | 'high' | 'medium' | 'low';
  lastAssessed: Date;
  nextReview: Date;
  evidenceCount: number;
  implementationProgress: number;
}

interface ComplianceAlert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionRequired: boolean;
  controlId?: string;
}

interface CMMCComplianceDashboardProps {
  onNavigate?: (path: string) => void;
  onSave?: (dashboard: any) => void;
  onExport?: (dashboard: any) => void;
}

const COMPLIANCE_METRICS: ComplianceMetric[] = [
  {
    id: 'overall-compliance',
    name: 'Overall Compliance',
    value: 78,
    target: 100,
    unit: '%',
    trend: 'up',
    status: 'good',
    lastUpdated: new Date(),
    description: 'Percentage of CMMC 2.0 Level 2 controls that are fully compliant'
  },
  {
    id: 'controls-assessed',
    name: 'Controls Assessed',
    value: 89,
    target: 110,
    unit: 'controls',
    trend: 'up',
    status: 'good',
    lastUpdated: new Date(),
    description: 'Number of CMMC 2.0 Level 2 controls that have been assessed'
  },
  {
    id: 'evidence-collected',
    name: 'Evidence Collected',
    value: 156,
    target: 200,
    unit: 'items',
    trend: 'up',
    status: 'warning',
    lastUpdated: new Date(),
    description: 'Number of evidence items collected for compliance documentation'
  },
  {
    id: 'days-to-assessment',
    name: 'Days to C3PAO Assessment',
    value: 45,
    target: 0,
    unit: 'days',
    trend: 'down',
    status: 'warning',
    lastUpdated: new Date(),
    description: 'Days remaining until scheduled C3PAO assessment'
  },
  {
    id: 'team-training',
    name: 'Team Training Completion',
    value: 92,
    target: 100,
    unit: '%',
    trend: 'up',
    status: 'excellent',
    lastUpdated: new Date(),
    description: 'Percentage of team members who have completed security awareness training'
  },
  {
    id: 'incident-response',
    name: 'Incident Response Readiness',
    value: 85,
    target: 100,
    unit: '%',
    trend: 'stable',
    status: 'good',
    lastUpdated: new Date(),
    description: 'Readiness level for incident response procedures'
  }
];

const COMPLIANCE_CONTROLS: ComplianceControl[] = [
  {
    id: 'AC.1.001',
    practice: 'AC.1.001',
    title: 'Establish system access requirements',
    domain: 'Access Control',
    status: 'compliant',
    priority: 'critical',
    lastAssessed: new Date('2024-01-15'),
    nextReview: new Date('2024-04-15'),
    evidenceCount: 5,
    implementationProgress: 100
  },
  {
    id: 'AC.1.002',
    practice: 'AC.1.002',
    title: 'Control information system access',
    domain: 'Access Control',
    status: 'partially-compliant',
    priority: 'critical',
    lastAssessed: new Date('2024-01-10'),
    nextReview: new Date('2024-02-10'),
    evidenceCount: 3,
    implementationProgress: 75
  },
  {
    id: 'AT.1.001',
    practice: 'AT.1.001',
    title: 'Conduct security awareness training',
    domain: 'Awareness and Training',
    status: 'compliant',
    priority: 'high',
    lastAssessed: new Date('2024-01-20'),
    nextReview: new Date('2024-07-20'),
    evidenceCount: 8,
    implementationProgress: 100
  },
  {
    id: 'AU.1.001',
    practice: 'AU.1.001',
    title: 'Create audit records',
    domain: 'Audit and Accountability',
    status: 'non-compliant',
    priority: 'critical',
    lastAssessed: new Date('2024-01-05'),
    nextReview: new Date('2024-01-25'),
    evidenceCount: 1,
    implementationProgress: 25
  },
  {
    id: 'CM.1.001',
    practice: 'CM.1.001',
    title: 'Establish configuration baselines',
    domain: 'Configuration Management',
    status: 'compliant',
    priority: 'high',
    lastAssessed: new Date('2024-01-18'),
    nextReview: new Date('2024-04-18'),
    evidenceCount: 6,
    implementationProgress: 100
  },
  {
    id: 'IA.1.001',
    practice: 'IA.1.001',
    title: 'Identify information system users',
    domain: 'Identification and Authentication',
    status: 'not-assessed',
    priority: 'critical',
    lastAssessed: new Date('2023-12-01'),
    nextReview: new Date('2024-01-30'),
    evidenceCount: 0,
    implementationProgress: 0
  }
];

const COMPLIANCE_ALERTS: ComplianceAlert[] = [
  {
    id: 'alert-1',
    type: 'warning',
    title: 'Control Assessment Overdue',
    message: 'AC.1.002 control assessment is overdue and requires immediate attention',
    timestamp: new Date('2024-01-22'),
    isRead: false,
    actionRequired: true,
    controlId: 'AC.1.002'
  },
  {
    id: 'alert-2',
    type: 'error',
    title: 'Critical Control Non-Compliant',
    message: 'AU.1.001 audit logging control is non-compliant and needs immediate remediation',
    timestamp: new Date('2024-01-21'),
    isRead: false,
    actionRequired: true,
    controlId: 'AU.1.001'
  },
  {
    id: 'alert-3',
    type: 'info',
    title: 'Evidence Collection Progress',
    message: 'Evidence collection is 78% complete. 44 more items needed for full compliance',
    timestamp: new Date('2024-01-20'),
    isRead: true,
    actionRequired: false
  },
  {
    id: 'alert-4',
    type: 'success',
    title: 'Training Program Complete',
    message: 'Security awareness training program has been completed for all team members',
    timestamp: new Date('2024-01-19'),
    isRead: true,
    actionRequired: false
  }
];

const CMMCComplianceDashboard: React.FC<CMMCComplianceDashboardProps> = ({
  onNavigate,
  onSave,
  onExport
}) => {
  const { breadcrumbs } = useInternalLinking();
  const [metrics, setMetrics] = useState<ComplianceMetric[]>(COMPLIANCE_METRICS);
  const [controls, setControls] = useState<ComplianceControl[]>(COMPLIANCE_CONTROLS);
  const [alerts, setAlerts] = useState<ComplianceAlert[]>(COMPLIANCE_ALERTS);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleAlertDismiss = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const handleAlertRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getControlStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-100';
      case 'partially-compliant': return 'text-yellow-600 bg-yellow-100';
      case 'non-compliant': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'info': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const overallCompliance = metrics.find(m => m.id === 'overall-compliance')?.value || 0;
  const controlsAssessed = metrics.find(m => m.id === 'controls-assessed')?.value || 0;
  const evidenceCollected = metrics.find(m => m.id === 'evidence-collected')?.value || 0;
  const daysToAssessment = metrics.find(m => m.id === 'days-to-assessment')?.value || 0;


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                CMMC Compliance Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Real-time compliance status and progress monitoring
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => onSave?.({ metrics, controls, alerts })}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={() => onExport?.({ metrics, controls, alerts })}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Range:</span>
            <div className="flex gap-2">
              {[
                { value: '7d', label: '7 Days' },
                { value: '30d', label: '30 Days' },
                { value: '90d', label: '90 Days' },
                { value: '1y', label: '1 Year' }
              ].map((range) => (
                <button
                  key={range.value}
                  onClick={() => setSelectedTimeRange(range.value as any)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedTimeRange === range.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric) => (
            <div key={metric.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {metric.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {metric.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(metric.trend)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                    {metric.status.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {metric.value}
                </span>
                <span className="text-lg text-gray-500 dark:text-gray-400">
                  {metric.unit}
                </span>
                {metric.target > 0 && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    / {metric.target}
                  </span>
                )}
              </div>

              {metric.target > 0 && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      metric.status === 'excellent' ? 'bg-green-500' :
                      metric.status === 'good' ? 'bg-blue-500' :
                      metric.status === 'warning' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, (metric.value / metric.target) * 100)}%` }}
                  />
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                <span>Last updated: {metric.lastUpdated.toLocaleDateString()}</span>
                <span>{metric.trend === 'up' ? '+' : metric.trend === 'down' ? '-' : ''} 5%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Alerts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Compliance Alerts
            </h2>
            <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded-full">
              {alerts.filter(alert => !alert.isRead).length} Unread
            </span>
          </div>

          <div className="space-y-4">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No alerts at this time
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    alert.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400' :
                    alert.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 border-red-400' :
                    alert.type === 'info' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-400' :
                    'bg-green-50 dark:bg-green-900/20 border-green-400'
                  } ${!alert.isRead ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {alert.title}
                        </h4>
                        {!alert.isRead && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                        {alert.actionRequired && (
                          <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded-full">
                            Action Required
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {alert.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>{alert.timestamp.toLocaleString()}</span>
                        {alert.controlId && (
                          <button
                            onClick={() => onNavigate?.(`/control-assessor`)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            View Control
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!alert.isRead && (
                        <button
                          onClick={() => handleAlertRead(alert.id)}
                          className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                          title="Mark as Read"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleAlertDismiss(alert.id)}
                        className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                        title="Dismiss"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Controls Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Control Status Overview
            </h2>
            <button
              onClick={() => onNavigate?.('/control-assessor')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Target className="w-4 h-4" />
              View All Controls
            </button>
          </div>

          <div className="space-y-4">
            {controls.map((control) => (
              <div
                key={control.id}
                className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-gray-300 dark:hover:border-gray-500 transition-colors cursor-pointer"
                onClick={() => onNavigate?.(`/control-assessor`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
                        {control.practice}
                      </span>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {control.title}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getControlStatusColor(control.status)}`}>
                        {control.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300 mb-3">
                      <span>Domain: {control.domain}</span>
                      <span>Priority: {control.priority}</span>
                      <span>Evidence: {control.evidenceCount} items</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-300">Implementation Progress</span>
                          <span className="font-medium text-gray-900 dark:text-white">{control.implementationProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              control.status === 'compliant' ? 'bg-green-500' :
                              control.status === 'partially-compliant' ? 'bg-yellow-500' :
                              control.status === 'non-compliant' ? 'bg-red-500' :
                              'bg-gray-400'
                            }`}
                            style={{ width: `${control.implementationProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                      <div>Last: {control.lastAssessed.toLocaleDateString()}</div>
                      <div>Next: {control.nextReview.toLocaleDateString()}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Start Assessment',
              description: 'Begin CMMC 2.0 Level 2 assessment',
              icon: <Play className="w-6 h-6" />,
              color: 'blue',
              path: '/assessment-intro'
            },
            {
              title: 'View Journey',
              description: 'Follow CMMC compliance journey',
              icon: <Target className="w-6 h-6" />,
              color: 'green',
              path: '/cmmc-journey'
            },
            {
              title: 'Collect Evidence',
              description: 'Manage compliance evidence',
              icon: <FileText className="w-6 h-6" />,
              color: 'purple',
              path: '/evidence'
            },
            {
              title: 'Generate Reports',
              description: 'Create compliance reports',
              icon: <BarChart3 className="w-6 h-6" />,
              color: 'orange',
              path: '/reports'
            }
          ].map((action, index) => (
            <button
              key={index}
              onClick={() => onNavigate?.(action.path)}
              className={`p-6 bg-${action.color}-50 dark:bg-${action.color}-900/20 rounded-xl hover:bg-${action.color}-100 dark:hover:bg-${action.color}-900/30 transition-colors text-left`}
            >
              <div className={`w-12 h-12 bg-${action.color}-100 dark:bg-${action.color}-900/30 rounded-lg flex items-center justify-center text-${action.color}-600 mb-4`}>
                {action.icon}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {action.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {action.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CMMCComplianceDashboard;
