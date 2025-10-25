import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  TrendingUp,
  Shield,
  Clock,
  Users,
  Target,
  BarChart3,
  FileCheck,
  AlertCircle
} from 'lucide-react';

interface SecurityAssessmentReportProps {
  assessmentData?: any;
  onExport?: (format: 'html' | 'pdf') => void;
  onNavigate?: (path: string) => void;
}

interface ControlFinding {
  controlId: string;
  title: string;
  domain: string;
  status: 'compliant' | 'partially-compliant' | 'non-compliant' | 'not-assessed';
  score: number;
  findings: string[];
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  evidence: string[];
  remediationTimeline: string;
}

interface DomainSummary {
  domain: string;
  totalControls: number;
  compliantControls: number;
  partiallyCompliantControls: number;
  nonCompliantControls: number;
  notAssessedControls: number;
  complianceRate: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  keyFindings: string[];
  recommendations: string[];
}

export const SecurityAssessmentReportGenerator: React.FC<SecurityAssessmentReportProps> = ({
  assessmentData,
  onExport,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'findings' | 'recommendations' | 'executive'>('overview');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [reportTitle, setReportTitle] = useState('CMMC 2.0 Level 2 Security Assessment Report');
  const [organizationName, setOrganizationName] = useState('Your Organization');
  const [assessmentDate, setAssessmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [assessorName, setAssessorName] = useState('Security Assessor');

  // Generate mock assessment data if none provided
  const mockAssessmentData = useMemo(() => {
    if (assessmentData) return assessmentData;
    
    return {
      organizationName: 'Sample Organization',
      assessmentDate: new Date().toISOString(),
      assessorName: 'John Doe, CISSP',
      overallScore: 72,
      totalControls: 110,
      compliantControls: 68,
      partiallyCompliantControls: 28,
      nonCompliantControls: 14,
      domains: [
        { name: 'Access Control', compliance: 85, controls: 22 },
        { name: 'Awareness and Training', compliance: 90, controls: 3 },
        { name: 'Audit and Accountability', compliance: 75, controls: 9 },
        { name: 'Configuration Management', compliance: 70, controls: 9 },
        { name: 'Identification and Authentication', compliance: 80, controls: 11 },
        { name: 'Incident Response', compliance: 65, controls: 3 },
        { name: 'Maintenance', compliance: 60, controls: 6 },
        { name: 'Media Protection', compliance: 55, controls: 9 },
        { name: 'Personnel Security', compliance: 85, controls: 2 },
        { name: 'Physical Protection', compliance: 70, controls: 6 },
        { name: 'Risk Assessment', compliance: 60, controls: 3 },
        { name: 'Security Assessment', compliance: 65, controls: 4 },
        { name: 'System and Communications Protection', compliance: 50, controls: 16 },
        { name: 'System and Information Integrity', compliance: 70, controls: 7 }
      ],
      findings: [
        {
          controlId: 'AC.3.1.1',
          title: 'Limit system access to authorized users',
          domain: 'Access Control',
          status: 'compliant',
          score: 3,
          findings: ['Access control policies are documented and implemented'],
          recommendations: ['Continue monitoring access control effectiveness'],
          riskLevel: 'low',
          evidence: ['Access Control Policy', 'User Access Review Logs'],
          remediationTimeline: 'N/A - Compliant'
        },
        {
          controlId: 'SC.3.13.1',
          title: 'Protect information at rest',
          domain: 'System and Communications Protection',
          status: 'non-compliant',
          score: 1,
          findings: ['Encryption not implemented on all data storage systems', 'Key management procedures not documented'],
          recommendations: ['Implement full disk encryption on all systems', 'Develop key management procedures', 'Conduct encryption training'],
          riskLevel: 'critical',
          evidence: ['System Inventory', 'Encryption Assessment Report'],
          remediationTimeline: '90 days'
        }
      ]
    };
  }, [assessmentData]);

  const domainSummaries: DomainSummary[] = useMemo(() => {
    return mockAssessmentData.domains.map(domain => ({
      domain: domain.name,
      totalControls: domain.controls,
      compliantControls: Math.floor(domain.controls * domain.compliance / 100),
      partiallyCompliantControls: Math.floor(domain.controls * 0.2),
      nonCompliantControls: Math.floor(domain.controls * 0.1),
      notAssessedControls: domain.controls - Math.floor(domain.controls * domain.compliance / 100) - Math.floor(domain.controls * 0.2) - Math.floor(domain.controls * 0.1),
      complianceRate: domain.compliance,
      riskLevel: domain.compliance >= 80 ? 'low' : domain.compliance >= 60 ? 'medium' : domain.compliance >= 40 ? 'high' : 'critical',
      keyFindings: [
        `${domain.compliance}% compliance rate`,
        `${Math.floor(domain.controls * 0.1)} controls need immediate attention`
      ],
      recommendations: [
        'Implement missing controls',
        'Enhance existing controls',
        'Conduct regular assessments'
      ]
    }));
  }, [mockAssessmentData]);

  const criticalFindings = mockAssessmentData.findings.filter(f => f.riskLevel === 'critical');
  const highRiskFindings = mockAssessmentData.findings.filter(f => f.riskLevel === 'high');
  const mediumRiskFindings = mockAssessmentData.findings.filter(f => f.riskLevel === 'medium');

  const generateHTMLReport = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${reportTitle}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 20px; }
        .header h1 { color: #2563eb; margin: 0; font-size: 28px; }
        .header p { color: #666; margin: 5px 0; }
        .executive-summary { background: #f8fafc; padding: 20px; border-radius: 6px; margin-bottom: 30px; }
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metric-card { background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #2563eb; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .metric-value { font-size: 24px; font-weight: bold; color: #2563eb; }
        .metric-label { color: #666; font-size: 14px; margin-top: 5px; }
        .domain-summary { margin-bottom: 30px; }
        .domain-card { background: white; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; margin-bottom: 15px; }
        .domain-header { display: flex; justify-content: between; align-items: center; margin-bottom: 15px; }
        .domain-name { font-size: 18px; font-weight: bold; color: #1f2937; }
        .compliance-rate { font-size: 16px; font-weight: bold; }
        .compliance-high { color: #059669; }
        .compliance-medium { color: #d97706; }
        .compliance-low { color: #dc2626; }
        .findings-section { margin-bottom: 30px; }
        .finding-card { background: white; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; margin-bottom: 15px; }
        .finding-header { display: flex; justify-content: between; align-items: center; margin-bottom: 15px; }
        .finding-title { font-size: 16px; font-weight: bold; color: #1f2937; }
        .risk-badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .risk-critical { background: #fef2f2; color: #dc2626; }
        .risk-high { background: #fff7ed; color: #ea580c; }
        .risk-medium { background: #fffbeb; color: #d97706; }
        .risk-low { background: #f0fdf4; color: #059669; }
        .recommendations { background: #f8fafc; padding: 20px; border-radius: 6px; margin-bottom: 30px; }
        .recommendation-item { margin-bottom: 10px; padding-left: 20px; position: relative; }
        .recommendation-item::before { content: "•"; position: absolute; left: 0; color: #2563eb; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${reportTitle}</h1>
            <p><strong>Organization:</strong> ${organizationName}</p>
            <p><strong>Assessment Date:</strong> ${assessmentDate}</p>
            <p><strong>Assessor:</strong> ${assessorName}</p>
        </div>

        <div class="executive-summary">
            <h2>Executive Summary</h2>
            <p>This security assessment report provides a comprehensive evaluation of ${organizationName}'s compliance with CMMC 2.0 Level 2 requirements. The assessment covered all 110 required controls across 14 security domains.</p>
            <p><strong>Overall Compliance Score:</strong> ${mockAssessmentData.overallScore}%</p>
            <p><strong>Key Findings:</strong></p>
            <ul>
                <li>${mockAssessmentData.compliantControls} controls are fully compliant</li>
                <li>${mockAssessmentData.partiallyCompliantControls} controls are partially compliant</li>
                <li>${mockAssessmentData.nonCompliantControls} controls require immediate attention</li>
                <li>${criticalFindings.length} critical findings identified</li>
            </ul>
        </div>

        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-value">${mockAssessmentData.overallScore}%</div>
                <div class="metric-label">Overall Compliance</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${mockAssessmentData.compliantControls}</div>
                <div class="metric-label">Compliant Controls</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${mockAssessmentData.nonCompliantControls}</div>
                <div class="metric-label">Non-Compliant Controls</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${criticalFindings.length}</div>
                <div class="metric-label">Critical Findings</div>
            </div>
        </div>

        <div class="domain-summary">
            <h2>Domain Compliance Summary</h2>
            ${domainSummaries.map(domain => `
                <div class="domain-card">
                    <div class="domain-header">
                        <div class="domain-name">${domain.domain}</div>
                        <div class="compliance-rate ${domain.complianceRate >= 80 ? 'compliance-high' : domain.complianceRate >= 60 ? 'compliance-medium' : 'compliance-low'}">
                            ${domain.complianceRate}% Compliance
                        </div>
                    </div>
                    <p><strong>Controls:</strong> ${domain.compliantControls}/${domain.totalControls} compliant</p>
                    <p><strong>Risk Level:</strong> <span class="risk-badge risk-${domain.riskLevel}">${domain.riskLevel.toUpperCase()}</span></p>
                </div>
            `).join('')}
        </div>

        <div class="findings-section">
            <h2>Critical Findings</h2>
            ${criticalFindings.map(finding => `
                <div class="finding-card">
                    <div class="finding-header">
                        <div class="finding-title">${finding.controlId}: ${finding.title}</div>
                        <span class="risk-badge risk-critical">CRITICAL</span>
                    </div>
                    <p><strong>Domain:</strong> ${finding.domain}</p>
                    <p><strong>Findings:</strong></p>
                    <ul>
                        ${finding.findings.map(f => `<li>${f}</li>`).join('')}
                    </ul>
                    <p><strong>Recommendations:</strong></p>
                    <ul>
                        ${finding.recommendations.map(r => `<li>${r}</li>`).join('')}
                    </ul>
                    <p><strong>Remediation Timeline:</strong> ${finding.remediationTimeline}</p>
                </div>
            `).join('')}
        </div>

        <div class="recommendations">
            <h2>Priority Recommendations</h2>
            <div class="recommendation-item">Address all critical findings within 90 days</div>
            <div class="recommendation-item">Implement comprehensive encryption strategy</div>
            <div class="recommendation-item">Enhance incident response procedures</div>
            <div class="recommendation-item">Conduct regular security awareness training</div>
            <div class="recommendation-item">Establish continuous monitoring program</div>
        </div>

        <div class="footer">
            <p>Report generated on ${new Date().toLocaleDateString()} | CMMC 2.0 Level 2 Security Assessment</p>
        </div>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${organizationName.replace(/\s+/g, '_')}_Security_Assessment_Report_${assessmentDate}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'partially-compliant': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'non-compliant': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              Security Assessment Report Generator
            </h1>
            <p className="text-gray-600 mt-2">
              Generate comprehensive CMMC 2.0 Level 2 security assessment reports for C3PAO preparation
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onNavigate?.('/reports')}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Reports
            </button>
            <button
              onClick={generateHTMLReport}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Report Configuration */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Report Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Title</label>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assessment Date</label>
              <input
                type="date"
                value={assessmentDate}
                onChange={(e) => setAssessmentDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assessor Name</label>
              <input
                type="text"
                value={assessorName}
                onChange={(e) => setAssessorName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'findings', label: 'Findings', icon: AlertTriangle },
              { id: 'recommendations', label: 'Recommendations', icon: Target },
              { id: 'executive', label: 'Executive Summary', icon: FileCheck }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Overall Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overall Compliance</p>
                    <p className="text-3xl font-bold text-blue-600">{mockAssessmentData.overallScore}%</p>
                  </div>
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Compliant Controls</p>
                    <p className="text-3xl font-bold text-green-600">{mockAssessmentData.compliantControls}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Non-Compliant</p>
                    <p className="text-3xl font-bold text-red-600">{mockAssessmentData.nonCompliantControls}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Critical Findings</p>
                    <p className="text-3xl font-bold text-red-600">{criticalFindings.length}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </div>

            {/* Domain Compliance */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Domain Compliance Summary</h3>
              <div className="space-y-4">
                {domainSummaries.map((domain, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{domain.domain}</h4>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(domain.riskLevel)}`}>
                          {domain.riskLevel.toUpperCase()}
                        </span>
                        <span className="text-sm font-medium text-gray-600">
                          {domain.complianceRate}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          domain.complianceRate >= 80 ? 'bg-green-500' :
                          domain.complianceRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${domain.complianceRate}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {domain.compliantControls}/{domain.totalControls} controls compliant
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'findings' && (
          <div className="space-y-6">
            {/* Critical Findings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Critical Findings ({criticalFindings.length})
              </h3>
              <div className="space-y-4">
                {criticalFindings.map((finding, index) => (
                  <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{finding.controlId}: {finding.title}</h4>
                        <p className="text-sm text-gray-600">{finding.domain}</p>
                      </div>
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        CRITICAL
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Findings:</p>
                        <ul className="text-sm text-gray-600 list-disc list-inside">
                          {finding.findings.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Recommendations:</p>
                        <ul className="text-sm text-gray-600 list-disc list-inside">
                          {finding.recommendations.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                      <p className="text-sm text-gray-600">
                        <strong>Timeline:</strong> {finding.remediationTimeline}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* High Risk Findings */}
            {highRiskFindings.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  High Risk Findings ({highRiskFindings.length})
                </h3>
                <div className="space-y-4">
                  {highRiskFindings.map((finding, index) => (
                    <div key={index} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{finding.controlId}: {finding.title}</h4>
                          <p className="text-sm text-gray-600">{finding.domain}</p>
                        </div>
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                          HIGH
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Findings:</p>
                          <ul className="text-sm text-gray-600 list-disc list-inside">
                            {finding.findings.map((f, i) => (
                              <li key={i}>{f}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Recommendations:</p>
                          <ul className="text-sm text-gray-600 list-disc list-inside">
                            {finding.recommendations.map((r, i) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Priority Recommendations
              </h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Immediate Actions (0-30 days)</h4>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                    <li>Address all critical findings identified in the assessment</li>
                    <li>Implement emergency security controls for high-risk vulnerabilities</li>
                    <li>Conduct immediate security awareness training for all personnel</li>
                    <li>Establish incident response team and procedures</li>
                  </ul>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Short-term Actions (30-90 days)</h4>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                    <li>Implement comprehensive encryption strategy for all CUI</li>
                    <li>Enhance access control mechanisms and user provisioning</li>
                    <li>Develop and implement security policies and procedures</li>
                    <li>Conduct vulnerability assessments and penetration testing</li>
                  </ul>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Long-term Actions (90+ days)</h4>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                    <li>Establish continuous monitoring and security operations center</li>
                    <li>Implement advanced threat detection and response capabilities</li>
                    <li>Develop comprehensive security training and awareness program</li>
                    <li>Conduct regular security assessments and compliance audits</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'executive' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                Executive Summary
              </h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-4">
                  This comprehensive security assessment of {organizationName} evaluated compliance with CMMC 2.0 Level 2 requirements, 
                  covering all 110 required controls across 14 security domains. The assessment was conducted on {assessmentDate} 
                  by {assessorName}.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Key Results</h4>
                  <ul className="text-blue-800 space-y-1">
                    <li>• Overall compliance score: <strong>{mockAssessmentData.overallScore}%</strong></li>
                    <li>• {mockAssessmentData.compliantControls} controls are fully compliant</li>
                    <li>• {mockAssessmentData.partiallyCompliantControls} controls require enhancement</li>
                    <li>• {mockAssessmentData.nonCompliantControls} controls need immediate attention</li>
                    <li>• {criticalFindings.length} critical findings identified</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">Risk Assessment</h4>
                  <p className="text-yellow-800">
                    The assessment identified several areas requiring immediate attention to achieve full CMMC 2.0 Level 2 compliance. 
                    Critical findings primarily relate to encryption implementation, access control mechanisms, and incident response procedures. 
                    Addressing these findings is essential for maintaining eligibility for Department of Defense contracts.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Recommendations</h4>
                  <p className="text-green-800">
                    To achieve full CMMC 2.0 Level 2 compliance, the organization should prioritize addressing critical findings within 90 days, 
                    implement comprehensive security controls, and establish ongoing monitoring and assessment processes. 
                    Regular training and awareness programs should be implemented to maintain compliance posture.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};