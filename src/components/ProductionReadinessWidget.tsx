import React, { useState, useEffect } from 'react';
import { 
  Shield, AlertTriangle, CheckCircle, Info, X, 
  Monitor, Database, Lock, Zap, BarChart3, Clock
} from 'lucide-react';
import { productionReadinessChecker } from '../lib/productionReadiness';
import { useProductionMonitoring } from '../hooks/useProductionMonitoring';
import { ENV } from '../config/environment';
import { logger } from '@/utils/logger';


interface ReadinessCheck {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  critical: boolean;
}

export const ProductionReadinessWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [checks, setChecks] = useState<ReadinessCheck[]>([]);
  const [readinessScore, setReadinessScore] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const { metrics, isMonitoring, getHealthStatusColor } = useProductionMonitoring();

  useEffect(() => {
    if (ENV.isDevelopment) {
      performReadinessCheck();
    }
  }, []);

  const performReadinessCheck = async () => {
    try {
      const result = await productionReadinessChecker.performReadinessCheck();
      setChecks(result.checks);
      setReadinessScore(result.score);
      setIsReady(result.ready);
    } catch (error) {
      logger.error('Failed to perform readiness check:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4 text-success-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'fail': return <AlertTriangle className="w-4 h-4 text-error-500" />;
      default: return <Info className="w-4 h-4 text-text-muted-light" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success-600 dark:text-success-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-error-600 dark:text-error-400';
  };

  if (!ENV.isDevelopment && !ENV.isProduction) {
    return null; // Only show in development or production
  }

  return (
    <>
      {/* Floating Widget */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-20 right-4 p-3 rounded-full shadow-lg transition-all duration-300 z-40 ${
          isReady 
            ? 'bg-success-600 hover:bg-success-700 text-white' 
            : 'bg-error-600 hover:bg-error-700 text-white animate-pulse'
        }`}
        title={`Production Readiness: ${readinessScore}/100`}
      >
        <Shield className="w-5 h-5" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-8 max-w-4xl w-full mx-4 shadow-2xl border border-support-light dark:border-support-dark max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Shield className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                <div>
                  <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    Production Readiness Status
                  </h2>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark">
                    Comprehensive health check for deployment readiness
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-text-muted-dark hover:text-text-secondary-light dark:hover:text-text-secondary-dark"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Overall Score */}
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-primary-200 dark:border-primary-800">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(readinessScore)} mb-2`}>
                  {readinessScore}/100
                </div>
                <div className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
                  Production Readiness Score
                </div>
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  isReady 
                    ? 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300'
                    : 'bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-300'
                }`}>
                  {isReady ? '✅ Ready for Production' : '⚠️ Needs Attention'}
                </div>
              </div>
            </div>

            {/* Live Metrics (Production Only) */}
            {ENV.isProduction && isMonitoring && (
              <div className="mb-8 bg-surface-light dark:bg-surface-dark rounded-xl p-6 border border-support-light dark:border-support-dark">
                <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4 flex items-center">
                  <Monitor className="w-5 h-5 mr-2 text-primary-500" />
                  Live Production Metrics
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getHealthStatusColor(metrics.healthStatus)}`}>
                      {metrics.healthStatus.toUpperCase()}
                    </div>
                    <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Health Status</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {(metrics.uptime / (1000 * 60 * 60)).toFixed(1)}h
                    </div>
                    <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Uptime</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {metrics.errorRate.toFixed(2)}%
                    </div>
                    <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Error Rate</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {metrics.memoryUsage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Memory Usage</div>
                  </div>
                </div>
              </div>
            )}

            {/* Readiness Checks */}
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                Readiness Checks
              </h3>
              
              {checks.map((check, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-background-light dark:bg-surface-dark/50 rounded-lg">
                  {getStatusIcon(check.status)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-text-primary-light dark:text-text-primary-dark">
                        {check.name}
                      </h4>
                      {check.critical && (
                        <span className="px-2 py-1 bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-300 text-xs rounded-full font-medium">
                          Critical
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
                      {check.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={performReadinessCheck}
                className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Shield className="w-4 h-4" />
                <span>Recheck Status</span>
              </button>
              
              <button
                onClick={async () => {
                  const report = await productionReadinessChecker.generateReport();
                  const blob = new Blob([report], { type: 'text/markdown' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `production-readiness-${new Date().toISOString().split('T')[0]}.md`;
                  link.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center space-x-2 border border-support-light dark:border-support-dark text-text-primary-light dark:text-text-secondary-dark px-6 py-3 rounded-lg hover:bg-background-light dark:hover:bg-surface-dark transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Export Report</span>
              </button>
              
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-3 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-light transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};