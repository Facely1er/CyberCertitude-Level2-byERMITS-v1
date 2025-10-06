import React, { useState } from 'react';
import { Shield, Download, Save, FileText, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, RefreshCw, ArrowLeft, Eye, Users, Calendar, TrendingUp, ChartBar as BarChart3, Target, Award } from 'lucide-react';
import { AssessmentData } from '../../../shared/types';
import { securityAssessmentReportService, SecurityAssessmentReport } from '../../../services/securityAssessmentReportService';
import { Breadcrumbs } from '../../../shared/components/layout/Breadcrumbs';

interface SecurityAssessmentReportGeneratorProps {
  savedAssessments?: AssessmentData[];
  onSave?: (report: SecurityAssessmentReport) => void;
  onBack?: () => void;
  addNotification?: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

export const SecurityAssessmentReportGenerator: React.FC<SecurityAssessmentReportGeneratorProps> = ({
  savedAssessments = [],
  onSave,
  onBack,
  addNotification
}) => {
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentData | null>(null);
  const [assessorInfo, setAssessorInfo] = useState({
    name: '',
    organization: '',
    credentials: '',
    contactInfo: ''
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerate = () => {
    if (!selectedAssessment) {
      addNotification?.('error', 'Please select an assessment');
      return;
    }

    if (!assessorInfo.name || !assessorInfo.organization) {
      addNotification?.('error', 'Please fill in assessor information');
      return;
    }

    setIsGenerating(true);
    try {
      const report = securityAssessmentReportService.generateReport(
        selectedAssessment,
        {
          name: assessorInfo.name,
          organization: assessorInfo.organization,
          credentials: assessorInfo.credentials.split(',').map(c => c.trim()),
          contactInfo: assessorInfo.contactInfo
        },
        scopeInfo
      );
      setGeneratedReport(report);
      setShowPreview(true);
      addNotification?.('success', 'Security Assessment Report generated successfully!');
    } catch (error) {
      addNotification?.('error', `Failed to generate report: ${(error as Error).message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = () => {
    if (!generatedReport) {
      addNotification?.('error', 'No report to export');
      return;
    }

    try {
      const html = securityAssessmentReportService.generateHTML(generatedReport);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Security-Assessment-Report-${generatedReport.organization}-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addNotification?.('success', 'Security Assessment Report exported successfully!');
    } catch (error) {
      addNotification?.('error', `Failed to export report: ${(error as Error).message}`);
    }
  };

  const handleSave = () => {
    if (!generatedReport) {
      addNotification?.('error', 'No report to save');
      return;
    }

    onSave?.(generatedReport);
    addNotification?.('success', 'Security Assessment Report saved successfully!');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-error-light dark:text-error-dark';
      case 'high': return 'text-warning-light dark:text-warning-dark';
      case 'medium': return 'text-info-light dark:text-info-dark';
      case 'low': return 'text-success-light dark:text-success-dark';
      default: return 'text-text-secondary-light dark:text-text-secondary-dark';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-error-light/10 dark:bg-error-dark/10 border-error-light dark:border-error-dark';
      case 'high': return 'bg-warning-light/10 dark:bg-warning-dark/10 border-warning-light dark:border-warning-dark';
      case 'medium': return 'bg-info-light/10 dark:bg-info-dark/10 border-info-light dark:border-info-dark';
      case 'low': return 'bg-success-light/10 dark:bg-success-dark/10 border-success-light dark:border-success-dark';
      default: return 'bg-surface-light dark:bg-surface-dark border-support-light dark:border-support-dark';
    }
  };

  const getReadinessColor = (readiness: string) => {
    switch (readiness) {
      case 'ready': return 'text-success-light dark:text-success-dark';
      case 'near-ready': return 'text-info-light dark:text-info-dark';
      case 'significant-work-needed': return 'text-warning-light dark:text-warning-dark';
      case 'not-ready': return 'text-error-light dark:text-error-dark';
      default: return 'text-text-secondary-light dark:text-text-secondary-dark';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: 'Reports', path: '/reports' },
        { label: 'Security Assessment Report', isActive: true }
      ]} />

      {/* Header */}
      <div className="card-standard mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                Security Assessment Report Generator
              </h1>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                Generate comprehensive CMMC security assessment reports with findings and recommendations
              </p>
            </div>
          </div>

          {generatedReport && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>{showPreview ? 'Hide' : 'Preview'}</span>
              </button>
              <button
                onClick={handleExport}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button
                onClick={handleSave}
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card-standard">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
              Comprehensive Analysis
            </h3>
          </div>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Detailed findings, risk assessment, and domain-by-domain compliance analysis
          </p>
        </div>

        <div className="card-standard">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
              C3PAO Ready
            </h3>
          </div>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Professional format suitable for C3PAO assessment preparation
          </p>
        </div>

        <div className="card-standard">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
              Actionable Insights
            </h3>
          </div>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Prioritized recommendations with cost estimates and timelines
          </p>
        </div>
      </div>

      {/* Configuration Form */}
      {!generatedReport && (
        <div className="space-y-6">
          {/* Assessment Selection */}
          <div className="card-standard">
            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
              Select Assessment
            </h3>
            <select
              value={selectedAssessment?.id || ''}
              onChange={e => {
                const assessment = savedAssessments.find(a => a.id === e.target.value);
                setSelectedAssessment(assessment || null);
              }}
              className="input-standard w-full"
            >
              <option value="">Choose an assessment...</option>
              {savedAssessments.map(assessment => (
                <option key={assessment.id} value={assessment.id}>
                  {assessment.frameworkName} - {assessment.organizationInfo?.name || 'Unknown'} - {new Date(assessment.createdAt).toLocaleDateString()}
                </option>
              ))}
            </select>
            {selectedAssessment && (
              <div className="mt-4 p-4 bg-surface-light dark:bg-surface-dark rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-text-secondary-light dark:text-text-secondary-dark">Framework</div>
                    <div className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                      {selectedAssessment.frameworkName}
                    </div>
                  </div>
                  <div>
                    <div className="text-text-secondary-light dark:text-text-secondary-dark">Created</div>
                    <div className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                      {new Date(selectedAssessment.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-text-secondary-light dark:text-text-secondary-dark">Last Modified</div>
                    <div className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                      {new Date(selectedAssessment.lastModified).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-text-secondary-light dark:text-text-secondary-dark">Status</div>
                    <div className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                      {selectedAssessment.isComplete ? 'Complete' : 'In Progress'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Assessor Information */}
          <div className="card-standard">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="w-5 h-5 text-primary-500 dark:text-primary-400" />
              <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                Assessor Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  Assessor Name *
                </label>
                <input
                  type="text"
                  value={assessorInfo.name}
                  onChange={e => setAssessorInfo({ ...assessorInfo, name: e.target.value })}
                  placeholder="Full Name"
                  className="input-standard w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  Organization *
                </label>
                <input
                  type="text"
                  value={assessorInfo.organization}
                  onChange={e => setAssessorInfo({ ...assessorInfo, organization: e.target.value })}
                  placeholder="Organization Name"
                  className="input-standard w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  Credentials
                </label>
                <input
                  type="text"
                  value={assessorInfo.credentials}
                  onChange={e => setAssessorInfo({ ...assessorInfo, credentials: e.target.value })}
                  placeholder="CISSP, CISM, CCP (comma-separated)"
                  className="input-standard w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  Contact Information
                </label>
                <input
                  type="text"
                  value={assessorInfo.contactInfo}
                  onChange={e => setAssessorInfo({ ...assessorInfo, contactInfo: e.target.value })}
                  placeholder="email@example.com, (555) 123-4567"
                  className="input-standard w-full"
                />
              </div>
            </div>
          </div>

          {/* Scope and Methodology */}
          <div className="card-standard">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="w-5 h-5 text-primary-500 dark:text-primary-400" />
              <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                Scope and Methodology
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  Assessment Type
                </label>
                <select
                  value={scopeInfo.assessmentType}
                  onChange={e => setScopeInfo({ ...scopeInfo, assessmentType: e.target.value as any })}
                  className="input-standard w-full"
                >
                  <option value="Self-Assessment">Self-Assessment</option>
                  <option value="Gap Analysis">Gap Analysis</option>
                  <option value="Pre-Assessment">Pre-Assessment</option>
                  <option value="C3PAO Assessment">C3PAO Assessment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  Assessment Methodology
                </label>
                <textarea
                  value={scopeInfo.methodology}
                  onChange={e => setScopeInfo({ ...scopeInfo, methodology: e.target.value })}
                  rows={3}
                  className="input-standard w-full"
                />
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="btn-primary flex items-center space-x-2 px-8 py-3"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Generating Report...</span>
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  <span>Generate Security Assessment Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Preview */}
      {generatedReport && showPreview && (
        <div className="space-y-6">
          {/* Executive Summary */}
          <div className="card-standard">
            <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
              Executive Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {generatedReport.executiveSummary.overallScore.toFixed(1)}%
                </div>
                <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">Overall Score</div>
              </div>
              <div className={`p-4 rounded-lg text-center border-2 ${getSeverityBg('critical')}`}>
                <div className={`text-3xl font-bold ${getSeverityColor('critical')}`}>
                  {generatedReport.executiveSummary.criticalFindings}
                </div>
                <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">Critical</div>
              </div>
              <div className={`p-4 rounded-lg text-center border-2 ${getSeverityBg('high')}`}>
                <div className={`text-3xl font-bold ${getSeverityColor('high')}`}>
                  {generatedReport.executiveSummary.highFindings}
                </div>
                <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">High</div>
              </div>
              <div className={`p-4 rounded-lg text-center border-2 ${getSeverityBg('medium')}`}>
                <div className={`text-3xl font-bold ${getSeverityColor('medium')}`}>
                  {generatedReport.executiveSummary.mediumFindings}
                </div>
                <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">Medium</div>
              </div>
              <div className={`p-4 rounded-lg text-center border-2 ${getSeverityBg('low')}`}>
                <div className={`text-3xl font-bold ${getSeverityColor('low')}`}>
                  {generatedReport.executiveSummary.lowFindings}
                </div>
                <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">Low</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">Readiness Assessment</h4>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  {generatedReport.executiveSummary.readinessAssessment}
                </p>
              </div>

              {generatedReport.executiveSummary.keyStrengths.length > 0 && (
                <div>
                  <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-success-light dark:text-success-dark" />
                    <span>Key Strengths</span>
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-text-secondary-light dark:text-text-secondary-dark">
                    {generatedReport.executiveSummary.keyStrengths.map((strength, idx) => (
                      <li key={idx}>{strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {generatedReport.executiveSummary.keyWeaknesses.length > 0 && (
                <div>
                  <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-warning-light dark:text-warning-dark" />
                    <span>Key Weaknesses</span>
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-text-secondary-light dark:text-text-secondary-dark">
                    {generatedReport.executiveSummary.keyWeaknesses.map((weakness, idx) => (
                      <li key={idx}>{weakness}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Critical Findings */}
          {generatedReport.findings.filter(f => f.severity === 'critical').length > 0 && (
            <div className="card-standard">
              <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4 flex items-center space-x-2">
                <AlertTriangle className="w-6 h-6 text-error-light dark:text-error-dark" />
                <span>Critical Findings</span>
              </h3>
              <div className="space-y-4">
                {generatedReport.findings.filter(f => f.severity === 'critical').slice(0, 5).map(finding => (
                  <div key={finding.id} className={`p-4 rounded-lg border-l-4 ${getSeverityBg(finding.severity)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                        {finding.id}: {finding.controlTitle}
                      </h4>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(finding.severity)}`}>
                        {finding.severity.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm space-y-1">
                      <p className="text-text-secondary-light dark:text-text-secondary-dark">
                        <strong>Domain:</strong> {finding.domain}
                      </p>
                      <p className="text-text-secondary-light dark:text-text-secondary-dark">
                        <strong>Gap:</strong> {finding.gapDescription}
                      </p>
                      <p className="text-text-secondary-light dark:text-text-secondary-dark">
                        <strong>Impact:</strong> {finding.impactAnalysis}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-support-light dark:border-support-dark">
                        <span className="text-text-muted-light dark:text-text-muted-dark">
                          Effort: {finding.remediationEffort} | Cost: {finding.estimatedCost}
                        </span>
                        <span className="text-text-muted-light dark:text-text-muted-dark">
                          Due: {finding.dueDate.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Domain Analysis */}
          <div className="card-standard">
            <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4 flex items-center space-x-2">
              <BarChart3 className="w-6 h-6 text-primary-500 dark:text-primary-400" />
              <span>Domain Analysis</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-support-light dark:border-support-dark">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">Domain</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">Total</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">Compliant</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">Partial</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">Non-Compliant</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {generatedReport.domainAnalysis.map((domain, idx) => (
                    <tr key={idx} className="border-b border-support-light dark:border-support-dark">
                      <td className="py-3 px-4 text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                        {domain.domainCode} - {domain.domain}
                      </td>
                      <td className="text-center py-3 px-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        {domain.totalControls}
                      </td>
                      <td className="text-center py-3 px-4 text-sm text-success-light dark:text-success-dark font-semibold">
                        {domain.compliantControls}
                      </td>
                      <td className="text-center py-3 px-4 text-sm text-warning-light dark:text-warning-dark font-semibold">
                        {domain.partiallyCompliantControls}
                      </td>
                      <td className="text-center py-3 px-4 text-sm text-error-light dark:text-error-dark font-semibold">
                        {domain.nonCompliantControls}
                      </td>
                      <td className="text-center py-3 px-4">
                        <div className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold ${
                          domain.overallScore >= 90 ? 'bg-success-light/20 dark:bg-success-dark/20 text-success-light dark:text-success-dark' :
                          domain.overallScore >= 70 ? 'bg-info-light/20 dark:bg-info-dark/20 text-info-light dark:text-info-dark' :
                          domain.overallScore >= 50 ? 'bg-warning-light/20 dark:bg-warning-dark/20 text-warning-light dark:text-warning-dark' :
                          'bg-error-light/20 dark:bg-error-dark/20 text-error-light dark:text-error-dark'
                        }`}>
                          {domain.overallScore.toFixed(0)}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Compliance Status */}
          <div className="card-standard">
            <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4 flex items-center space-x-2">
              <Award className="w-6 h-6 text-primary-500 dark:text-primary-400" />
              <span>Compliance Status</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">Current Readiness</div>
                    <div className="text-3xl font-bold text-primary-500 dark:text-primary-400">
                      {generatedReport.complianceStatus.currentReadiness.toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">Certification Readiness</div>
                    <div className={`text-xl font-semibold ${getReadinessColor(generatedReport.complianceStatus.certificationReadiness)}`}>
                      {generatedReport.complianceStatus.certificationReadiness.split('-').map(word =>
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">Estimated Time to Readiness</div>
                    <div className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                      {generatedReport.complianceStatus.estimatedTimeToReadiness}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">Required Investment</div>
                    <div className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                      {generatedReport.complianceStatus.requiredInvestment}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-3">Gap Analysis</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-error-light/10 dark:bg-error-dark/10 rounded-lg">
                    <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">Critical Gaps</span>
                    <span className="text-lg font-bold text-error-light dark:text-error-dark">
                      {generatedReport.complianceStatus.gapAnalysis.criticalGaps}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-warning-light/10 dark:bg-warning-dark/10 rounded-lg">
                    <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">High Priority Gaps</span>
                    <span className="text-lg font-bold text-warning-light dark:text-warning-dark">
                      {generatedReport.complianceStatus.gapAnalysis.highPriorityGaps}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-info-light/10 dark:bg-info-dark/10 rounded-lg">
                    <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">Medium Priority Gaps</span>
                    <span className="text-lg font-bold text-info-light dark:text-info-dark">
                      {generatedReport.complianceStatus.gapAnalysis.mediumPriorityGaps}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-success-light/10 dark:bg-success-dark/10 rounded-lg">
                    <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">Low Priority Gaps</span>
                    <span className="text-lg font-bold text-success-light dark:text-success-dark">
                      {generatedReport.complianceStatus.gapAnalysis.lowPriorityGaps}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Recommendations */}
          <div className="card-standard">
            <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4 flex items-center space-x-2">
              <Target className="w-6 h-6 text-primary-500 dark:text-primary-400" />
              <span>Top Recommendations</span>
            </h3>
            <div className="space-y-4">
              {generatedReport.recommendations.slice(0, 5).map((rec, idx) => (
                <div key={rec.id} className="p-4 bg-surface-light dark:bg-surface-dark rounded-lg border border-support-light dark:border-support-dark">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                      {idx + 1}. {rec.title}
                    </h4>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      rec.priority === 'immediate' ? 'bg-error-light/20 dark:bg-error-dark/20 text-error-light dark:text-error-dark' :
                      rec.priority === 'short-term' ? 'bg-warning-light/20 dark:bg-warning-dark/20 text-warning-light dark:text-warning-dark' :
                      'bg-info-light/20 dark:bg-info-dark/20 text-info-light dark:text-info-dark'
                    }`}>
                      {rec.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2">
                    {rec.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-text-muted-light dark:text-text-muted-dark">
                    <span>Category: {rec.category}</span>
                    <span>Effort: {rec.estimatedEffort}</span>
                    <span>Cost: {rec.estimatedCost}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex justify-end">
            <button
              onClick={() => {
                setGeneratedReport(null);
                setShowPreview(false);
              }}
              className="btn-secondary"
            >
              Generate New Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
