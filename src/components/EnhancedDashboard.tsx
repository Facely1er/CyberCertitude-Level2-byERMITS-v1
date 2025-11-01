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
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-100';
    if (percentage >= 20) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading compliance progress...</p>
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load progress data</p>
        </div>
      </div>
    );
  }

  const domains = Object.values(progress.domainProgress);
  const overallProgress = Math.round(
    domains.reduce((sum, domain) => sum + domain.percentage, 0) / domains.length
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
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
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Enhanced Compliance Dashboard</h1>
                <p className="text-gray-600">Track progress, manage templates, and get smart recommendations</p>
              </div>
            </div>
            <button
              onClick={loadProgress}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
            >
              <Zap className="w-4 h-4 mr-2" />
              Refresh Progress
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Overall Progress</h3>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">{overallProgress}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Across all domains</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Templates Downloaded</h3>
              <FileText className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">{progress.downloadHistory.length}</div>
            <p className="text-sm text-gray-600">Ready for implementation</p>
            <p className="text-xs text-gray-500 mt-2">Last 30 days</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Evidence Items</h3>
              <Database className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {Object.values(progress.templateProgress).reduce(
                (sum, template) => sum + template.evidenceItems.length, 0
              )}
            </div>
            <p className="text-sm text-gray-600">Collected</p>
            <p className="text-xs text-gray-500 mt-2">Supporting compliance</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Compliance Score</h3>
              <Target className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {overallProgress >= 80 ? 'A' : overallProgress >= 60 ? 'B' : overallProgress >= 40 ? 'C' : 'D'}
            </div>
            <p className="text-sm text-gray-600">Grade</p>
            <p className="text-xs text-gray-500 mt-2">C3PAO readiness</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Domain Progress */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Domain Progress</h2>
              
              <div className="space-y-4">
                {domains.map((domain) => (
                  <div key={domain.domainId} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {domain.domainId} - {domain.domainName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {domain.completedControls}/{domain.totalControls} controls • {domain.completedTemplates}/{domain.totalTemplates} templates
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getDomainColor(domain.percentage)}`}>
                          {domain.percentage}%
                        </div>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${domain.percentage}%` }}
                      ></div>
                    </div>

                    {domain.nextMilestone && (
                      <p className="text-xs text-gray-500">Next: {domain.nextMilestone}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Smart Recommendations */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Smart Recommendations</h2>
              
              <div className="space-y-4">
                {recommendations.slice(0, 5).map((rec, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(rec.priority)}`}>
                        {rec.priority.toUpperCase()}
                      </div>
                      <span className="text-xs text-gray-500">{rec.estimatedTime}</span>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">{rec.reason}</h4>
                    <p className="text-sm text-gray-600 mb-3">{rec.impact}</p>
                    
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition">
                        View Details
                      </button>
                      {rec.templateId && (
                        <button className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded hover:bg-green-200 transition">
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
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Template Progress - {selectedDomain}</h2>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  <div key={template.templateId} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-800">{template.templateName}</h3>
                      <div className={`px-2 py-1 rounded text-xs font-semibold ${
                        template.status === 'completed' ? 'bg-green-100 text-green-700' :
                        template.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                        template.status === 'downloaded' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {template.status.replace('-', ' ')}
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${template.progress}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <span>{template.progress}% complete</span>
                      <span>{template.evidenceItems.length} evidence items</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownloadTemplate(template.templateId, template.templateName, template.domainId)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition flex items-center"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </button>
                      <button
                        onClick={() => handleMarkCompleted(template.templateId)}
                        className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded hover:bg-green-200 transition flex items-center"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Complete
                      </button>
                      <button
                        onClick={() => handleAddEvidence(template.templateId, `${template.domainId}.1.001`)}
                        className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded hover:bg-purple-200 transition flex items-center"
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
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition text-left">
                <Download className="w-6 h-6 mb-2" />
                <h3 className="font-semibold mb-1">Download History</h3>
                <p className="text-sm text-blue-100">View all downloaded templates</p>
              </button>
              
              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition text-left">
                <Eye className="w-6 h-6 mb-2" />
                <h3 className="font-semibold mb-1">Interactive Templates</h3>
                <p className="text-sm text-blue-100">Customize templates online</p>
              </button>
              
              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition text-left">
                <Target className="w-6 h-6 mb-2" />
                <h3 className="font-semibold mb-1">Compliance Assessment</h3>
                <p className="text-sm text-blue-100">Run compliance check</p>
              </button>
              
              <button
                onClick={loadProgress}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition text-left"
              >
                <Zap className="w-6 h-6 mb-2" />
                <h3 className="font-semibold mb-1">Refresh Progress</h3>
                <p className="text-sm text-blue-100">Update all metrics</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
