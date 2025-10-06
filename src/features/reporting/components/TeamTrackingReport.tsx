import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Clock, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Download, RefreshCw, Plus, Search, ListFilter as Filter, FileText, Activity, Target, Shield, Calendar } from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';
import { useInternalLinking } from '@/shared/hooks/useInternalLinking';
import { reportingService, ReportData, ReportFilters } from '@/services/reportingService';
import { logger } from '@/utils/logger';

interface TeamTrackingReportProps {
  onBack: () => void;
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

const TeamTrackingReport: React.FC<TeamTrackingReportProps> = ({
  onBack: _onBack,
  addNotification
}) => {
  const { breadcrumbs } = useInternalLinking();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [reports, setReports] = useState<ReportData[]>([]);
  const [filteredReports, setFilteredReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateForm, setGenerateForm] = useState({
    title: '',
    description: '',
    type: 'compliance' as ReportData['type'],
    dataRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      end: new Date()
    }
  });

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [reports, searchTerm, filterType, filterStatus]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const reportsData = await reportingService.getReports();
      setReports(reportsData);
    } catch (error) {
      addNotification('error', 'Failed to load reports');
      logger.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      const filters: ReportFilters = {
        search: searchTerm || undefined,
        type: filterType !== 'all' ? filterType as ReportData['type'] : undefined,
        status: filterStatus !== 'all' ? filterStatus as ReportData['status'] : undefined
      };
      
      const filtered = await reportingService.searchReports(filters);
      setFilteredReports(filtered);
    } catch (error) {
      logger.error('Error applying filters:', error);
      setFilteredReports(reports);
    }
  };

  const handleGenerateReport = async () => {
    if (!generateForm.title.trim()) {
      addNotification('error', 'Please enter a report title');
      return;
    }

    try {
      let newReport: ReportData;
      
      switch (generateForm.type) {
        case 'compliance':
          newReport = await reportingService.generateComplianceReport(
            generateForm.title,
            generateForm.description,
            generateForm.dataRange,
            'Current User' // In real app, get from auth context
          );
          break;
        case 'assessment':
          newReport = await reportingService.generateAssessmentReport(
            generateForm.title,
            generateForm.description,
            'assessment-001', // In real app, get from selected assessment
            'Current User'
          );
          break;
        case 'progress':
          newReport = await reportingService.generateProgressReport(
            generateForm.title,
            generateForm.description,
            generateForm.dataRange,
            'Current User'
          );
          break;
        default:
          throw new Error('Unsupported report type');
      }

      await loadReports();
      setShowGenerateModal(false);
      setGenerateForm({
        title: '',
        description: '',
        type: 'compliance',
        dataRange: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          end: new Date()
        }
      });
      addNotification('success', 'Report generated successfully');
    } catch (error) {
      addNotification('error', 'Failed to generate report');
      logger.error('Error generating report:', error);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await reportingService.deleteReport(reportId);
        await loadReports();
        addNotification('success', 'Report deleted successfully');
      } catch (error) {
        addNotification('error', 'Failed to delete report');
        logger.error('Error deleting report:', error);
      }
    }
  };

  const handleExportReport = async (report: ReportData, format: 'pdf' | 'html' | 'csv' | 'xlsx') => {
    try {
      const content = await reportingService.exportReport(report, format);
      
      if (format === 'html') {
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${report.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (format === 'csv') {
        const blob = new Blob([content], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${report.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // For PDF and XLSX, show placeholder
        addNotification('info', `${format.toUpperCase()} export would be generated here`);
      }
      
      addNotification('success', `Report exported as ${format.toUpperCase()}`);
    } catch (error) {
      addNotification('error', 'Failed to export report');
      logger.error('Error exporting report:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-300">Loading reports...</span>
        </div>
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'compliance': return 'text-blue-600 dark:text-blue-400';
      case 'assessment': return 'text-green-600 dark:text-green-400';
      case 'progress': return 'text-purple-600 dark:text-purple-400';
      case 'risk': return 'text-red-600 dark:text-red-400';
      case 'team': return 'text-orange-600 dark:text-orange-400';
      case 'evidence': return 'text-indigo-600 dark:text-indigo-400';
      case 'calendar': return 'text-pink-600 dark:text-pink-400';
      case 'executive': return 'text-yellow-600 dark:text-yellow-400';
      case 'audit': return 'text-cyan-600 dark:text-cyan-400';
      case 'custom': return 'text-teal-600 dark:text-teal-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'generating': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'draft': return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
      case 'failed': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-600 dark:text-red-400';
      case 'high': return 'text-orange-600 dark:text-orange-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Team Performance
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Generate and manage compliance and team performance reports
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowGenerateModal(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Generate Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reports</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{reports.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {reports.filter(r => r.status === 'completed').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Generating</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {reports.filter(r => r.status === 'generating').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Failed</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                {reports.filter(r => r.status === 'failed').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="compliance">Compliance</option>
              <option value="assessment">Assessment</option>
              <option value="progress">Progress</option>
              <option value="risk">Risk</option>
              <option value="team">Team</option>
              <option value="evidence">Evidence</option>
              <option value="calendar">Calendar</option>
              <option value="executive">Executive</option>
              <option value="audit">Audit</option>
              <option value="custom">Custom</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="generating">Generating</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Reports ({filteredReports.length})
          </h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {filteredReports.map((report) => (
              <div key={report.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {report.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                      <span className={`font-medium ${getTypeColor(report.type)}`}>
                        {report.type}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {report.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Generated By:</span>
                        <div className="font-medium text-gray-900 dark:text-white">{report.generatedBy}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Generated At:</span>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {report.generatedAt.toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Data Range:</span>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {report.dataRange.start.toLocaleDateString()} - {report.dataRange.end.toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Access Level:</span>
                        <div className="font-medium text-gray-900 dark:text-white">{report.accessLevel}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Overall Score:</span>
                        <div className="font-medium text-gray-900 dark:text-white">{report.summary.overallScore}%</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Compliance Rate:</span>
                        <div className="font-medium text-gray-900 dark:text-white">{report.summary.complianceRate.toFixed(1)}%</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Risk Level:</span>
                        <div className={`font-medium ${getRiskColor(report.summary.riskLevel)}`}>
                          {report.summary.riskLevel}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Sections:</span>
                        <div className="font-medium text-gray-900 dark:text-white">{report.sections.length}</div>
                      </div>
                    </div>

                    {report.recommendations && report.recommendations.length > 0 && (
                      <div className="mb-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Key Recommendations:</span>
                        <ul className="mt-1 list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                          {report.recommendations.slice(0, 3).map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                          {report.recommendations.length > 3 && (
                            <li>... and {report.recommendations.length - 3} more</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      const reportDetails = `Report Details:

Title: ${report.title}
Description: ${report.description}
Type: ${report.type}
Status: ${report.status}
Generated By: ${report.generatedBy}
Generated At: ${report.generatedAt.toLocaleDateString()}
Data Range: ${report.dataRange.start.toLocaleDateString()} - ${report.dataRange.end.toLocaleDateString()}
Overall Score: ${report.summary.overallScore}%
Compliance Rate: ${report.summary.complianceRate.toFixed(1)}%
Risk Level: ${report.summary.riskLevel}
Sections: ${report.sections.length}
Recommendations: ${report.recommendations.length}`;
                      
                      addNotification('info', reportDetails);
                    }}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  
                  <div className="relative group">
                    <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      <div className="py-2">
                        <button
                          onClick={() => handleExportReport(report, 'pdf')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          Export as PDF
                        </button>
                        <button
                          onClick={() => handleExportReport(report, 'html')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          Export as HTML
                        </button>
                        <button
                          onClick={() => handleExportReport(report, 'csv')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          Export as CSV
                        </button>
                        <button
                          onClick={() => handleExportReport(report, 'xlsx')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          Export as XLSX
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => addNotification('info', 'Report editing is available through the report editor')}
                    className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  
                  <button
                    onClick={() => handleDeleteReport(report.id)}
                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Reports Found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                  ? 'No reports match your current search and filter criteria. Try adjusting your filters.'
                  : 'No reports have been generated yet. Create your first report to get started.'}
              </p>
              {!searchTerm && filterType === 'all' && filterStatus === 'all' && (
                <button
                  onClick={() => setShowGenerateModal(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Generate First Report
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Generate New Report</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Report Title *
                </label>
                <input
                  type="text"
                  value={generateForm.title}
                  onChange={(e) => setGenerateForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter report title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={generateForm.description}
                  onChange={(e) => setGenerateForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter report description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Report Type
                </label>
                <select
                  value={generateForm.type}
                  onChange={(e) => setGenerateForm(prev => ({ ...prev, type: e.target.value as ReportData['type'] }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="compliance">Compliance Report</option>
                  <option value="assessment">Assessment Report</option>
                  <option value="progress">Progress Report</option>
                  <option value="risk">Risk Report</option>
                  <option value="team">Team Report</option>
                  <option value="evidence">Evidence Report</option>
                  <option value="calendar">Calendar Report</option>
                  <option value="executive">Executive Report</option>
                  <option value="audit">Audit Report</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={generateForm.dataRange.start.toISOString().split('T')[0]}
                    onChange={(e) => setGenerateForm(prev => ({ 
                      ...prev, 
                      dataRange: { ...prev.dataRange, start: new Date(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={generateForm.dataRange.end.toISOString().split('T')[0]}
                    onChange={(e) => setGenerateForm(prev => ({ 
                      ...prev, 
                      dataRange: { ...prev.dataRange, end: new Date(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateReport}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamTrackingReport;