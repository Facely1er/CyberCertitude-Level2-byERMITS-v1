import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, CheckCircle, TrendingUp, AlertCircle, FileText, Users, Clock, Target, ChevronRight, ChevronDown, BarChart3, Zap, Database, Eye } from 'lucide-react';
import { ProgressTrackingService, EnhancedProgress, SmartRecommendation } from '../utils/progressTracking';
import { enhancedDownloadService } from '../utils/enhancedDownload';
import { toastService } from '../utils/toastNotifications';

const EnhancedDashboard: React.FC = () => {
  const [progress, setProgress] = useState<EnhancedProgress | null>(null);
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>('AC');
  const [isLoading, setIsLoading] = useState(true);

  const trackingService = ProgressTrackingService.getInstance();

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = () => {
    setIsLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      const progressData = trackingService.getProgress();
      const recommendationsData = trackingService.generateRecommendations();
      
      setProgress(progressData);
      setRecommendations(recommendationsData);
      setIsLoading(false);
    }, 1000);
  };

  const handleDownloadTemplate = async (templateId: string, templateName: string, domainId: string) => {
    try {
      const result = await enhancedDownloadService.downloadTemplateWithTracking(
        templateName,
        domainId,
        'md',
        'domain'
      );

      if (result.success) {
        toastService.success(
          'Template Downloaded',
          `${templateName} has been downloaded successfully. Progress has been updated.`
        );
        loadProgress(); // Refresh progress
      } else {
        toastService.error(
          'Download Failed',
          result.error || 'Failed to download template'
        );
      }
    } catch (error) {
      toastService.error(
        'Download Error',
        'An unexpected error occurred while downloading the template'
      );
    }
  };

  const handleMarkCompleted = (templateId: string) => {
    trackingService.updateTemplateProgress(templateId, 'completed', 100);
    toastService.success(
      'Template Completed',
      'Template marked as completed. Progress updated.'
    );
    loadProgress();
  };

  const handleAddEvidence = (templateId: string, controlId: string) => {
    trackingService.addEvidence(
      templateId,
      controlId,
      'document',
      `/evidence/${templateId}/${controlId}_evidence.pdf`,
      'Evidence document uploaded'
    );
    
    toastService.success(
      'Evidence Added',
      'Evidence has been added to the template. Progress updated.'
    );
    loadProgress();
  };

  const getDomainColor = (percentage: number) => {
    if (percentage >= 80) return 'text-success-600 dark:text-success-400 bg-success-100 dark:bg-success-900/30';
    if (percentage >= 50) return 'text-warning-600 dark:text-warning-400 bg-warning-100 dark:bg-warning-900/30';
    if (percentage >= 20) return 'text-warning-500 dark:text-warning-400 bg-warning-100 dark:bg-warning-900/30';
    return 'text-error-600 dark:text-error-400 bg-error-100 dark:bg-error-900/30';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-error-600 dark:text-error-400 bg-error-100 dark:bg-error-900/30';
      case 'medium': return 'text-warning-600 dark:text-warning-400 bg-warning-100 dark:bg-warning-900/30';
      case 'low': return 'text-success-600 dark:text-success-400 bg-success-100 dark:bg-success-900/30';
      default: return 'text-text-secondary-light dark:text-text-secondary-dark bg-background-light dark:bg-background-dark border border-support-light dark:border-support-dark';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background-light to-accent-50 dark:from-primary-950 dark:via-background-dark dark:to-accent-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">Loading compliance progress...</p>
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background-light to-accent-50 dark:from-primary-950 dark:via-background-dark dark:to-accent-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-error-500 mx-auto mb-4" />
          <p className="text-text-secondary-light dark:text-text-secondary-dark">Failed to load progress data</p>
        </div>
      </div>
    );
  }

  const domains = Object.values(progress.domainProgress);
  const overallProgress = Math.round(
    domains.reduce((sum, domain) => sum + domain.percentage, 0) / domains.length
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background-light to-accent-50 dark:from-primary-950 dark:via-background-dark dark:to-accent-950">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="card-standard p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
                <img 
                  src="/cybercertitude.png" 
                  alt="CyberCertitude" 
                  className="w-12 h-12 flex-shrink-0" 
                />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">Enhanced Compliance Dashboard</h1>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">Track progress, manage templates, and get smart recommendations</p>
              </div>
            </div>
            <button
              onClick={loadProgress}
              className="btn-primary px-4 py-2 rounded-xl transition flex items-center"
            >
              <Zap className="w-4 h-4 mr-2" />
              Refresh Progress
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card-standard p-6 border-l-4 border-primary-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Overall Progress</h3>
              <TrendingUp className="w-5 h-5 text-primary-500" />
            </div>
            <div className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">{overallProgress}%</div>
            <div className="w-full bg-support-light dark:bg-support-dark rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-2">Across all domains</p>
          </div>

          <div className="card-standard p-6 border-l-4 border-success-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Templates Downloaded</h3>
              <FileText className="w-5 h-5 text-success-500" />
            </div>
            <div className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">{progress.downloadHistory.length}</div>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Ready for implementation</p>
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-2">Last 30 days</p>
          </div>

          <div className="card-standard p-6 border-l-4 border-secondary-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Evidence Items</h3>
              <Database className="w-5 h-5 text-secondary-500" />
            </div>
            <div className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
              {Object.values(progress.templateProgress).reduce(
                (sum, template) => sum + template.evidenceItems.length, 0
              )}
            </div>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Collected</p>
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-2">Supporting compliance</p>
          </div>

          <div className="card-standard p-6 border-l-4 border-warning-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Compliance Score</h3>
              <Target className="w-5 h-5 text-warning-500" />
            </div>
            <div className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
              {overallProgress >= 80 ? 'A' : overallProgress >= 60 ? 'B' : overallProgress >= 40 ? 'C' : 'D'}
            </div>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Grade</p>
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-2">C3PAO readiness</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Domain Progress */}
          <div className="lg:col-span-2">
            <div className="card-standard p-6">
              <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">Domain Progress</h2>
              
              <div className="space-y-4">
                {domains.map((domain) => (
                  <div key={domain.domainId} className="border border-support-light dark:border-support-dark rounded-xl p-4 bg-background-light dark:bg-background-dark">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                          {domain.domainId} - {domain.domainName}
                        </h3>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          {domain.completedControls}/{domain.totalControls} controls • {domain.completedTemplates}/{domain.totalTemplates} templates
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getDomainColor(domain.percentage)}`}>
                          {domain.percentage}%
                        </div>
                      </div>
                    </div>

                    <div className="w-full bg-support-light dark:bg-support-dark rounded-full h-2 mb-3">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${domain.percentage}%` }}
                      ></div>
                    </div>

                    {domain.nextMilestone && (
                      <p className="text-xs text-text-muted-light dark:text-text-muted-dark">Next: {domain.nextMilestone}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Smart Recommendations */}
          <div className="lg:col-span-1">
            <div className="card-standard p-6">
              <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">Smart Recommendations</h2>
              
              <div className="space-y-4">
                {recommendations.slice(0, 5).map((rec, index) => (
                  <div key={index} className="border border-support-light dark:border-support-dark rounded-xl p-4 bg-background-light dark:bg-background-dark">
                    <div className="flex items-start justify-between mb-2">
                      <div className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(rec.priority)}`}>
                        {rec.priority.toUpperCase()}
                      </div>
                      <span className="text-xs text-text-muted-light dark:text-text-muted-dark">{rec.estimatedTime}</span>
                    </div>
                    
                    <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">{rec.reason}</h4>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-3">{rec.impact}</p>
                    
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded hover:bg-primary-200 dark:hover:bg-primary-900/50 transition">
                        View Details
                      </button>
                      {rec.templateId && (
                        <button className="px-3 py-1 bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300 text-xs rounded hover:bg-success-200 dark:hover:bg-success-900/50 transition">
                          Download
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Template Progress for Selected Domain */}
        <div className="mt-8">
          <div className="card-standard p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Template Progress - {selectedDomain}</h2>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="input-standard"
              >
                {domains.map((domain) => (
                  <option key={domain.domainId} value={domain.domainId}>
                    {domain.domainId} - {domain.domainName}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.values(progress.templateProgress)
                .filter(template => template.domainId === selectedDomain)
                .map((template) => (
                  <div key={template.templateId} className="border border-support-light dark:border-support-dark rounded-xl p-4 bg-background-light dark:bg-background-dark">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">{template.templateName}</h3>
                      <div className={`px-2 py-1 rounded text-xs font-semibold ${
                        template.status === 'completed' ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300' :
                        template.status === 'in-progress' ? 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300' :
                        template.status === 'downloaded' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' :
                        'bg-background-light dark:bg-background-dark text-text-secondary-light dark:text-text-secondary-dark border border-support-light dark:border-support-dark'
                      }`}>
                        {template.status.replace('-', ' ')}
                      </div>
                    </div>

                    <div className="w-full bg-support-light dark:bg-support-dark rounded-full h-2 mb-3">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${template.progress}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-text-secondary-light dark:text-text-secondary-dark mb-3">
                      <span>{template.progress}% complete</span>
                      <span>{template.evidenceItems.length} evidence items</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownloadTemplate(template.templateId, template.templateName, template.domainId)}
                        className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded hover:bg-primary-200 dark:hover:bg-primary-900/50 transition flex items-center"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </button>
                      <button
                        onClick={() => handleMarkCompleted(template.templateId)}
                        className="px-3 py-1 bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300 text-xs rounded hover:bg-success-200 dark:hover:bg-success-900/50 transition flex items-center"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Complete
                      </button>
                      <button
                        onClick={() => handleAddEvidence(template.templateId, `${template.domainId}.1.001`)}
                        className="px-3 py-1 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 text-xs rounded hover:bg-secondary-200 dark:hover:bg-secondary-900/50 transition flex items-center"
                      >
                        <Database className="w-3 h-3 mr-1" />
                        Evidence
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-primary-500 to-secondary-400 rounded-xl shadow-lg p-6 text-white">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="bg-surface-light bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition text-left">
                <Download className="w-6 h-6 mb-2" />
                <h3 className="font-semibold mb-1">Download History</h3>
                <p className="text-sm text-primary-100">View all downloaded templates</p>
              </button>
              
              <button className="bg-surface-light bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition text-left">
                <Eye className="w-6 h-6 mb-2" />
                <h3 className="font-semibold mb-1">Interactive Templates</h3>
                <p className="text-sm text-primary-100">Customize templates online</p>
              </button>
              
              <button className="bg-surface-light bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition text-left">
                <Target className="w-6 h-6 mb-2" />
                <h3 className="font-semibold mb-1">Compliance Assessment</h3>
                <p className="text-sm text-primary-100">Run compliance check</p>
              </button>
              
              <button
                onClick={loadProgress}
                className="bg-surface-light bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition text-left"
              >
                <Zap className="w-6 h-6 mb-2" />
                <h3 className="font-semibold mb-1">Refresh Progress</h3>
                <p className="text-sm text-primary-100">Update all metrics</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
