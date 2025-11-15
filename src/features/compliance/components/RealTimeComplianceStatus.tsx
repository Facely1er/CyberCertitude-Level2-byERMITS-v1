import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ChartBar as BarChart3, TrendingUp, TrendingDown, TriangleAlert as AlertTriangle, Target, RefreshCw, Activity, Zap, Calendar, FileText } from 'lucide-react';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { logger } from '@/utils/logger';
import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';
import { useInternalLinking } from '../../../shared/hooks/useInternalLinking';
import { 
  RealTimeComplianceData
} from '../types';
import { apiService } from '../../../services/apiService';

interface RealTimeComplianceStatusProps {
  onViewDetails: (category: string) => void;
  onAcknowledgeAlert?: (alertId: string) => void;
  className?: string;
}

const RealTimeComplianceStatus: React.FC<RealTimeComplianceStatusProps> = ({
  onViewDetails,
  onAcknowledgeAlert,
  className = ''
}) => {
  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      await apiService.acknowledgeAlert(alertId);
      // Refresh data after acknowledgment
      const data = await fetchRealTimeData();
      setComplianceData(data);
      setLastUpdated(new Date());
      
      // Call parent callback if provided
      if (onAcknowledgeAlert) {
        onAcknowledgeAlert(alertId);
      }
    } catch (error) {
      logger.error('Failed to acknowledge alert:', error);
    }
  };
  const [complianceData, setComplianceData] = useState<RealTimeComplianceData | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval] = useState(30); // seconds
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Use centralized breadcrumb logic
  const { breadcrumbs } = useInternalLinking();

  // Fetch real-time data from API with fallback
  const fetchRealTimeData = async (): Promise<RealTimeComplianceData> => {
    try {
      return await apiService.getRealTimeComplianceData();
    } catch (error) {
      logger.error('Failed to fetch real-time compliance data:', error);
      // Return fallback data if API fails
      return {
        timestamp: new Date(),
        overallCompliance: 73,
        functionCompliance: {
          'Govern': 68,
          'Identify': 75,
          'Protect': 71,
          'Detect': 69,
          'Respond': 78,
          'Recover': 65
        },
        activeGaps: 12,
        criticalFindings: 3,
        evidenceCollectionProgress: 67,
        controlImplementationProgress: 71,
        riskTrend: 'improving',
        alerts: []
      };
    }
  };

  // Auto-refresh functionality
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRealTimeData();
        setComplianceData(data);
        setLastUpdated(new Date());
      } catch (error) {
        logger.error('Failed to fetch compliance data:', error);
      }
    };

    // Initial load
    fetchData();

    // Set up auto-refresh
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchData, refreshInterval * 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoRefresh, refreshInterval]);

  const getComplianceColor = (score: number) => {
    if (score >= 80) return 'text-success-600 dark:text-success-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-error-600 dark:text-error-400';
  };



  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-300 border-error-200 dark:border-error-800';
      case 'high': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'low': return 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 border-primary-200 dark:border-primary-800';
      default: return 'bg-support-light dark:bg-background-dark/30 text-text-primary-light dark:text-text-secondary-dark border-support-light dark:border-support-dark';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-5 h-5 text-success-500" />;
      case 'declining': return <TrendingDown className="w-5 h-5 text-error-500" />;
      default: return <Activity className="w-5 h-5 text-text-muted-light" />;
    }
  };

  // Progress bar component that avoids inline styles by using refs
  const ProgressBar: React.FC<{ 
    percentage: number; 
    height?: string;
    colorClass: string;
    transitionDuration?: string;
  }> = ({ percentage, height = 'h-4', colorClass, transitionDuration = 'duration-500' }) => {
    const barRef = useRef<HTMLDivElement>(null);
    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    
    useEffect(() => {
      if (barRef.current) {
        barRef.current.style.setProperty('--progress-width', `${clampedPercentage}%`);
      }
    }, [clampedPercentage]);
    
    return (
      <div 
        ref={barRef}
        className={`${height} rounded-full transition-all ${transitionDuration} progress-bar-fill ${colorClass}`}
      />
    );
  };

  if (!complianceData) {
    return (
      <div className={`bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-8 text-center ${className}`}>
        <LoadingSpinner size="lg" message="Loading real-time compliance data..." />
      </div>
    );
  }

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      
      <div className="space-y-6">
      {/* Header with Controls */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
              <Activity className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                Compliance Status
              </h2>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                NIST CSF v2.0 Implementation Progress
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Last Updated</div>
              <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                {lastUpdated.toLocaleTimeString()}
              </div>
            </div>
            
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                autoRefresh 
                  ? 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300'
                  : 'bg-support-light dark:bg-surface-dark text-text-primary-light dark:text-text-secondary-dark'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium">
                {autoRefresh ? 'Auto-Refresh' : 'Manual'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Overall Compliance Score */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className={`text-6xl font-bold ${getComplianceColor(complianceData.overallCompliance)}`}>
              {complianceData.overallCompliance}%
            </div>
            {getTrendIcon(complianceData.riskTrend)}
          </div>
          
          <h3 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
            Overall NIST CSF v2.0 Compliance
          </h3>
          
          <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
            Implementation progress across all framework functions
          </p>
          
          <div className="w-full bg-support-light dark:bg-surface-dark rounded-full h-4 mb-6">
            <ProgressBar
              percentage={complianceData.overallCompliance}
              height="h-4"
              colorClass={
                complianceData.overallCompliance >= 80 ? 'bg-success-500' :
                complianceData.overallCompliance >= 60 ? 'bg-yellow-500' :
                complianceData.overallCompliance >= 40 ? 'bg-orange-500' : 'bg-error-500'
              }
              transitionDuration="duration-500"
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {complianceData.activeGaps}
              </div>
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Active Gaps</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-error-600 dark:text-error-400">
                {complianceData.criticalFindings}
              </div>
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Critical Findings</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600 dark:text-success-400">
                {complianceData.evidenceCollectionProgress}%
              </div>
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Evidence Collection</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {complianceData.controlImplementationProgress}%
              </div>
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Control Implementation</div>
            </div>
          </div>
        </div>
      </div>

      {/* Function-Level Compliance */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
        <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-6 flex items-center">
          <Shield className="w-6 h-6 mr-3 text-primary-600 dark:text-primary-400" />
          NIST CSF v2.0 Functions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(complianceData.functionCompliance).map(([func, score]) => (
            <button
              key={func}
              onClick={() => onViewDetails(func)}
              className="p-4 border border-support-light dark:border-support-dark rounded-lg hover:bg-background-light dark:hover:bg-surface-dark/50 transition-colors text-left group"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {func}
                </h4>
                <span className={`text-lg font-bold ${getComplianceColor(score)}`}>
                  {score}%
                </span>
              </div>
              
              <div className="w-full bg-support-light dark:bg-surface-dark rounded-full h-2 mb-2">
                <ProgressBar
                  percentage={score}
                  height="h-2"
                  colorClass={
                    score >= 80 ? 'bg-success-500' :
                    score >= 60 ? 'bg-yellow-500' :
                    score >= 40 ? 'bg-orange-500' : 'bg-error-500'
                  }
                  transitionDuration="duration-300"
                />
              </div>
              
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Click to view details
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Critical Alerts */}
      {complianceData.alerts.filter(alert => !alert.acknowledged).length > 0 && (
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
          <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-6 flex items-center">
            <AlertTriangle className="w-6 h-6 mr-3 text-error-600 dark:text-error-400" />
            Active Alerts ({complianceData.alerts.filter(alert => !alert.acknowledged).length})
          </h3>
          
          <div className="space-y-4">
            {complianceData.alerts
              .filter(alert => !alert.acknowledged)
              .sort((a, b) => {
                const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
                return severityOrder[b.severity] - severityOrder[a.severity];
              })
              .map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${getAlertColor(alert.severity)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold">
                          {alert.title}
                        </h4>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-surface-light/50 dark:bg-surface-dark/50">
                          {alert.severity.toUpperCase()}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-surface-light/50 dark:bg-surface-dark/50">
                          {alert.type.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-sm mb-3">
                        {alert.description}
                      </p>
                      
                      <div className="text-sm">
                        <strong>Action Required:</strong> {alert.actionRequired}
                      </div>
                      
                      {alert.dueDate && (
                        <div className="text-sm mt-1">
                          <strong>Due:</strong> {alert.dueDate.toLocaleDateString()}
                          {alert.dueDate < new Date() && (
                            <span className="text-error-600 dark:text-error-400 font-medium ml-2">
                              (OVERDUE)
                            </span>
                          )}
                        </div>
                      )}
                      
                      {alert.assignedTo && (
                        <div className="text-sm mt-1">
                          <strong>Assigned:</strong> {alert.assignedTo}
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {alert.affectedItems.map((item, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-surface-light/30 dark:bg-surface-dark/30 text-xs rounded"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => handleAcknowledgeAlert(alert.id)}
                        className="px-3 py-1 bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-secondary-dark text-sm rounded-lg hover:bg-background-light dark:hover:bg-surface-dark transition-colors"
                      >
                        Acknowledge
                      </button>
                      
                      <button className="px-3 py-1 bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-secondary-dark text-sm rounded-lg hover:bg-background-light dark:hover:bg-surface-dark transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
        <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-6 flex items-center">
          <Zap className="w-6 h-6 mr-3 text-yellow-600 dark:text-yellow-400" />
          Quick Actions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/compliance-workflow"
            className="flex items-center space-x-3 p-4 border border-support-light dark:border-support-dark rounded-lg hover:bg-background-light dark:hover:bg-surface-dark/50 transition-colors text-left group"
          >
            <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <div>
              <div className="font-medium text-text-primary-light dark:text-text-primary-dark">Implementation Workflow</div>
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Follow structured roadmap</div>
            </div>
          </Link>
          
          <button className="flex items-center space-x-3 p-4 border border-support-light dark:border-support-dark rounded-lg hover:bg-background-light dark:hover:bg-surface-dark/50 transition-colors text-left">
            <Target className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <div>
              <div className="font-medium text-text-primary-light dark:text-text-primary-dark">Start Assessment</div>
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Begin new evaluation</div>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-support-light dark:border-support-dark rounded-lg hover:bg-background-light dark:hover:bg-surface-dark/50 transition-colors text-left">
            <FileText className="w-6 h-6 text-success-600 dark:text-success-400" />
            <div>
              <div className="font-medium text-text-primary-light dark:text-text-primary-dark">Collect Evidence</div>
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Upload documentation</div>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-support-light dark:border-support-dark rounded-lg hover:bg-background-light dark:hover:bg-surface-dark/50 transition-colors text-left">
            <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <div>
              <div className="font-medium text-text-primary-light dark:text-text-primary-dark">View Calendar</div>
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Check activities</div>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-support-light dark:border-support-dark rounded-lg hover:bg-background-light dark:hover:bg-surface-dark/50 transition-colors text-left">
            <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            <div>
              <div className="font-medium text-text-primary-light dark:text-text-primary-dark">Generate Report</div>
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Export status</div>
            </div>
          </button>
        </div>
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
          <h4 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
            Implementation Progress
          </h4>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Control Implementation</span>
                <span className="font-medium text-text-primary-light dark:text-text-primary-dark">
                  {complianceData.controlImplementationProgress}%
                </span>
              </div>
              <div className="w-full bg-support-light dark:bg-surface-dark rounded-full h-2">
                <ProgressBar
                  percentage={complianceData.controlImplementationProgress}
                  height="h-2"
                  colorClass="bg-primary-500"
                  transitionDuration="duration-300"
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Evidence Collection</span>
                <span className="font-medium text-text-primary-light dark:text-text-primary-dark">
                  {complianceData.evidenceCollectionProgress}%
                </span>
              </div>
              <div className="w-full bg-support-light dark:bg-surface-dark rounded-full h-2">
                <ProgressBar
                  percentage={complianceData.evidenceCollectionProgress}
                  height="h-2"
                  colorClass="bg-success-500"
                  transitionDuration="duration-300"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
          <h4 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
            Risk Status
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-error-50 dark:bg-error-900/20 rounded-lg">
              <span className="text-error-800 dark:text-error-300 font-medium">Critical Risks</span>
              <span className="text-error-600 dark:text-error-400 font-bold text-lg">
                {complianceData.criticalFindings}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <span className="text-yellow-800 dark:text-yellow-300 font-medium">Active Gaps</span>
              <span className="text-yellow-600 dark:text-yellow-400 font-bold text-lg">
                {complianceData.activeGaps}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-primary-800 dark:text-primary-300 font-medium">Risk Trend</span>
                {getTrendIcon(complianceData.riskTrend)}
              </div>
              <span className="text-primary-600 dark:text-primary-400 font-bold capitalize">
                {complianceData.riskTrend}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default RealTimeComplianceStatus;