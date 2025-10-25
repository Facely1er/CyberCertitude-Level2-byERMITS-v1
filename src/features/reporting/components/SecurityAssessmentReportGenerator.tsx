import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Settings, 
  User, 
  Calendar, 
  Building, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Target,
  ChevronLeft,
  ChevronRight,
  Save,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Users,
  Database,
  FileCheck,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { AssessmentData, UserProfile } from '../../../shared/types';
import { securityAssessmentReportService, SecurityAssessmentReport, AssessorInfo } from '../../../services/securityAssessmentReportService';
import { Breadcrumbs } from '../../../shared/components/layout/Breadcrumbs';
import { useInternalLinking } from '../../../shared/hooks/useInternalLinking';
import { BarChart } from '../../../shared/components/charts/BarChart';
import { PieChart } from '../../../shared/components/charts/PieChart';
import { LineChart } from '../../../shared/components/charts/LineChart';

interface SecurityAssessmentReportGeneratorProps {
  assessments: AssessmentData[];
  userProfile: UserProfile | null;
  onSaveReport?: (report: SecurityAssessmentReport) => void;
  onExportReport?: (report: SecurityAssessmentReport, format: 'html' | 'pdf' | 'docx') => void;
  onBack?: () => void;
}

const SecurityAssessmentReportGenerator: React.FC<SecurityAssessmentReportGeneratorProps> = ({
  assessments,
  userProfile,
  onSaveReport,
  onExportReport,
  onBack
}) => {
  const { breadcrumbs } = useInternalLinking();
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentData | null>(null);
  const [assessorInfo, setAssessorInfo] = useState<AssessorInfo>({
    name: userProfile?.name || '',
    organization: userProfile?.organization || '',
    credentials: ['CISSP', 'CISM', 'CISA'],
    contactInfo: userProfile?.email || ''
  });
  const [scopeInfo, setScopeInfo] = useState({
    assessmentType: 'Gap Analysis' as const,
    assessmentScope: ['Information Systems', 'Network Infrastructure', 'CUI Processing'],
    methodology: 'NIST SP 800-171 based assessment aligned with CMMC Level 2 requirements',
    systemsAssessed: ['Primary Business Systems', 'CUI Storage Systems', 'Network Infrastructure'],
    documentationReviewed: ['System Security Plan', 'Policies and Procedures', 'Configuration Documentation'],
    interviewsConducted: ['IT Leadership', 'Security Team', 'System Administrators']
  });
  const [generatedReport, setGeneratedReport] = useState<SecurityAssessmentReport | null>(null);
  const [activeTab, setActiveTab] = useState<'setup' | 'preview' | 'export'>('setup');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const generateReport = async () => {
    if (!selectedAssessment) return;

    setIsGenerating(true);
    try {
      const report = securityAssessmentReportService.generateReport(
        selectedAssessment,
        assessorInfo,
        scopeInfo
      );
      setGeneratedReport(report);
      setActiveTab('preview');
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveReport = () => {
    if (generatedReport && onSaveReport) {
      onSaveReport(generatedReport);
    }
  };

  const handleExportReport = (format: 'html' | 'pdf' | 'docx') => {
    if (generatedReport && onExportReport) {
      onExportReport(generatedReport, format);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-600 bg-green-50 border-green-200';
      case 'near-ready': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'significant-work-needed': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'not-ready': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: 'CMMC Platform', path: '/dashboard' },
        { label: 'Reporting', path: '/reports' },
        { label: 'Security Assessment Report', isActive: true }
      ]} />

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Security Assessment Report Generator</h1>
                <p className="text-gray-600 dark:text-gray-300">Generate comprehensive CMMC Level 2 security assessment reports</p>
              </div>
            </div>
            
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'setup', label: 'Setup', icon: Settings },
              { id: 'preview', label: 'Preview', icon: Eye },
              { id: 'export', label: 'Export', icon: Download }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Setup Tab */}
          {activeTab === 'setup' && (
            <div className="space-y-8">
              {/* Assessment Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Select Assessment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {assessments.map((assessment) => (
                    <div
                      key={assessment.id}
                      onClick={() => setSelectedAssessment(assessment)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        selectedAssessment?.id === assessment.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <h4 className="font-medium text-gray-900 dark:text-white">{assessment.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {assessment.organizationInfo?.name || 'Organization'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Last modified: {new Date(assessment.lastModified).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assessor Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Assessor Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Assessor Name
                    </label>
                    <input
                      type="text"
                      value={assessorInfo.name}
                      onChange={(e) => setAssessorInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Organization
                    </label>
                    <input
                      type="text"
                      value={assessorInfo.organization}
                      onChange={(e) => setAssessorInfo(prev => ({ ...prev, organization: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contact Information
                    </label>
                    <input
                      type="text"
                      value={assessorInfo.contactInfo}
                      onChange={(e) => setAssessorInfo(prev => ({ ...prev, contactInfo: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Credentials
                    </label>
                    <input
                      type="text"
                      value={assessorInfo.credentials.join(', ')}
                      onChange={(e) => setAssessorInfo(prev => ({ ...prev, credentials: e.target.value.split(', ') }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Assessment Scope */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Assessment Scope</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Assessment Type
                    </label>
                    <select
                      value={scopeInfo.assessmentType}
                      onChange={(e) => setScopeInfo(prev => ({ ...prev, assessmentType: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="Self-Assessment">Self-Assessment</option>
                      <option value="Gap Analysis">Gap Analysis</option>
                      <option value="Pre-Assessment">Pre-Assessment</option>
                      <option value="C3PAO Assessment">C3PAO Assessment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Methodology
                    </label>
                    <textarea
                      value={scopeInfo.methodology}
                      onChange={(e) => setScopeInfo(prev => ({ ...prev, methodology: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <div className="flex justify-center">
                <button
                  onClick={generateReport}
                  disabled={!selectedAssessment || isGenerating}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  {isGenerating ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                  <span>{isGenerating ? 'Generating Report...' : 'Generate Report'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Preview Tab */}
          {activeTab === 'preview' && generatedReport && (
            <div className="space-y-8">
              {/* Report Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
                <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                  {generatedReport.title}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-blue-800 dark:text-blue-200">Generated:</span>
                    <p className="text-blue-700 dark:text-blue-300">{generatedReport.generatedDate.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800 dark:text-blue-200">Assessment Date:</span>
                    <p className="text-blue-700 dark:text-blue-300">{generatedReport.assessmentDate.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800 dark:text-blue-200">Assessor:</span>
                    <p className="text-blue-700 dark:text-blue-300">{generatedReport.assessor.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800 dark:text-blue-200">Version:</span>
                    <p className="text-blue-700 dark:text-blue-300">{generatedReport.version}</p>
                  </div>
                </div>
              </div>

              {/* Executive Summary */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Executive Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-5 h-5 text-blue-500" />
                      <span className="font-medium text-gray-900 dark:text-white">Overall Score</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {generatedReport.executiveSummary.overallScore.toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-gray-900 dark:text-white">Compliance Level</span>
                    </div>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                      {generatedReport.executiveSummary.complianceLevel}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <span className="font-medium text-gray-900 dark:text-white">Critical Findings</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {generatedReport.executiveSummary.criticalFindings}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-5 h-5 text-orange-500" />
                      <span className="font-medium text-gray-900 dark:text-white">Remediation Time</span>
                    </div>
                    <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                      {generatedReport.executiveSummary.estimatedRemediationTime}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300">
                    {generatedReport.executiveSummary.readinessAssessment}
                  </p>
                </div>
              </div>

              {/* Findings Summary */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Key Findings</h3>
                <div className="space-y-4">
                  {generatedReport.findings.slice(0, 5).map((finding) => (
                    <div key={finding.id} className={`p-4 rounded-lg border-l-4 ${getSeverityColor(finding.severity)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{finding.id}: {finding.controlTitle}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(finding.severity)}`}>
                          {finding.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        <strong>Domain:</strong> {finding.domain} | <strong>Status:</strong> {finding.status}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {finding.gapDescription}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Domain Analysis */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Domain Analysis</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700">
                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Domain</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center">Total</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center">Compliant</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center">Partial</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center">Non-Compliant</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generatedReport.domainAnalysis.map((domain) => (
                        <tr key={domain.domain}>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-medium">
                            {domain.domain}
                          </td>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center">
                            {domain.totalControls}
                          </td>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-green-600 dark:text-green-400">
                            {domain.compliantControls}
                          </td>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-yellow-600 dark:text-yellow-400">
                            {domain.partiallyCompliantControls}
                          </td>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-red-600 dark:text-red-400">
                            {domain.nonCompliantControls}
                          </td>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center font-semibold">
                            {domain.overallScore.toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Compliance Status */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Compliance Status</h3>
                <div className={`p-4 rounded-lg border-2 ${getComplianceStatusColor(generatedReport.complianceStatus.certificationReadiness)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Certification Readiness</h4>
                    <span className="px-3 py-1 rounded-full text-sm font-medium">
                      {generatedReport.complianceStatus.certificationReadiness.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Current Readiness:</span>
                      <p className="text-lg font-semibold">{generatedReport.complianceStatus.currentReadiness.toFixed(1)}%</p>
                    </div>
                    <div>
                      <span className="font-medium">Time to Readiness:</span>
                      <p>{generatedReport.complianceStatus.estimatedTimeToReadiness}</p>
                    </div>
                    <div>
                      <span className="font-medium">Required Investment:</span>
                      <p>{generatedReport.complianceStatus.requiredInvestment}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleSaveReport}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Report</span>
                </button>
                <button
                  onClick={() => setActiveTab('export')}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span>Export Report</span>
                </button>
              </div>
            </div>
          )}

          {/* Export Tab */}
          {activeTab === 'export' && generatedReport && (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Export Security Assessment Report</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Choose your preferred format to export the comprehensive security assessment report
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-center hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">HTML Report</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Interactive web-based report with full formatting and navigation
                  </p>
                  <button
                    onClick={() => handleExportReport('html')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Export HTML
                  </button>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-center hover:border-red-300 dark:hover:border-red-600 transition-colors">
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">PDF Report</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Professional PDF document ready for printing and sharing
                  </p>
                  <button
                    onClick={() => handleExportReport('pdf')}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Export PDF
                  </button>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-center hover:border-green-300 dark:hover:border-green-600 transition-colors">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Word Document</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Editable Word document for further customization and review
                  </p>
                  <button
                    onClick={() => handleExportReport('docx')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Export DOCX
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Report Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-blue-800 dark:text-blue-200">Total Findings:</span>
                    <p className="text-blue-700 dark:text-blue-300">{generatedReport.findings.length}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800 dark:text-blue-200">Domains Analyzed:</span>
                    <p className="text-blue-700 dark:text-blue-300">{generatedReport.domainAnalysis.length}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800 dark:text-blue-200">Recommendations:</span>
                    <p className="text-blue-700 dark:text-blue-300">{generatedReport.recommendations.length}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800 dark:text-blue-200">Next Steps:</span>
                    <p className="text-blue-700 dark:text-blue-300">{generatedReport.nextSteps.length}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityAssessmentReportGenerator;