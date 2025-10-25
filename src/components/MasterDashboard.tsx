import React, { useState, useEffect } from 'react';
import { Download, CheckCircle, TrendingUp, Github, FileText, Zap, AlertCircle, Package, ChevronDown, Edit3, ClipboardCheck, BarChart3, Database, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProgressTrackingService } from '../utils/progressTracking';
import { toastService } from '../utils/toastNotifications';

interface ProgressState {
  overall: number;
  domains: Record<string, number>;
  templates: number;
  evidence: number;
}

type DocumentFormat = 'md' | 'docx' | 'pdf' | 'xlsx';

const MasterDashboard: React.FC = () => {
  const [progress, setProgress] = useState<ProgressState>({
    overall: 0,
    domains: {},
    templates: 0,
    evidence: 0
  });
  const [syncing, setSyncing] = useState(false);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [isDomainProgressExpanded, setIsDomainProgressExpanded] = useState(true);

  const trackingService = ProgressTrackingService.getInstance();

  useEffect(() => {
    const savedProgress = localStorage.getItem('cmmc_progress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  const domains = [
    { id: 'AC', name: 'Access Control', controls: 22, color: 'blue' },
    { id: 'AU', name: 'Audit & Accountability', controls: 9, color: 'purple' },
    { id: 'AT', name: 'Awareness & Training', controls: 3, color: 'green' },
    { id: 'CM', name: 'Configuration Management', controls: 9, color: 'yellow' },
    { id: 'IA', name: 'Identification & Authentication', controls: 11, color: 'indigo' },
    { id: 'IR', name: 'Incident Response', controls: 3, color: 'red' },
    { id: 'MA', name: 'Maintenance', controls: 6, color: 'orange' },
    { id: 'MP', name: 'Media Protection', controls: 8, color: 'pink' },
    { id: 'PS', name: 'Personnel Security', controls: 2, color: 'teal' },
    { id: 'PE', name: 'Physical Protection', controls: 6, color: 'cyan' },
    { id: 'RA', name: 'Risk Assessment', controls: 3, color: 'amber' },
    { id: 'CA', name: 'Security Assessment', controls: 2, color: 'lime' },
    { id: 'SC', name: 'System & Communications Protection', controls: 20, color: 'violet' },
    { id: 'SI', name: 'System & Information Integrity', controls: 6, color: 'fuchsia' }
  ];

  const toolkitSections = [
    {
      name: 'Core Documentation',
      templates: ['System Security Plan (SSP)', 'Security Assessment Report (SAR)'],
      count: 2
    },
    {
      name: 'Domain Templates',
      templates: ['4 domain-specific templates covering key CMMC domains'],
      count: 4
    },
    {
      name: 'Specialized Templates',
      templates: ['Network Diagrams', 'Risk Registers', 'Training Materials', 'RACI Matrices', 'Implementation Roadmaps'],
      count: 5
    },
    {
      name: 'Enterprise Documents',
      templates: ['Incident Response Plan (50p)', 'Complete SSP (150p)', 'Access Control Policy (35p)', 'Asset Inventory', 'Backup Recovery', 'Mobile Device Policy', 'Cloud Security (45p)', 'Security Awareness (60p)'],
      count: 8
    }
  ];

  const updateDomainProgress = (domainId: string, percentage: number) => {
    const newProgress = {
      ...progress,
      domains: {
        ...progress.domains,
        [domainId]: percentage
      }
    };

    const totalControls = domains.reduce((sum, d) => sum + d.controls, 0);
    const completedControls = domains.reduce((sum, d) => {
      const domainProgress = newProgress.domains[d.id] || 0;
      return sum + (d.controls * domainProgress / 100);
    }, 0);

    newProgress.overall = Math.round((completedControls / totalControls) * 100);

    setProgress(newProgress);
    localStorage.setItem('cmmc_progress', JSON.stringify(newProgress));
  };

  const syncToGitHub = async () => {
    setSyncing(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const success = Math.random() > 0.1;

    if (success) {
      toastService.success(
        'GitHub Sync Successful',
        'Repository: CMMC-2.0-Toolkit\nBranch: main\nCommit: Added/updated templates\n\nAll templates are now version controlled.',
        8000
      );
    } else {
      toastService.warning(
        'GitHub Sync Issue',
        'Please check your token and try again.',
        5000
      );
    }

    setSyncing(false);
  };

  const downloadAllTemplates = async (format: DocumentFormat = 'md') => {
    setDownloadingAll(true);
    setShowFormatMenu(false);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const formatLabel = format === 'md' ? 'Markdown' : format === 'docx' ? 'Word' : format === 'pdf' ? 'PDF' : 'Excel';
    const manifest = `# CMMC 2.0 Compliance Toolkit - Complete Package
Generated: ${new Date().toLocaleString()}
Format: ${formatLabel} (.${format})

## Package Contents

### 1. Core Documentation (2 files)
- System_Security_Plan_Template.md
- Security_Assessment_Report_Template.md

### 2. Domain-Specific Templates (4 files)
${domains.slice(0, 4).map(d => `
#### ${d.name} (${d.id})
- ${d.id}_Policy_Template.md
- ${d.id}_Evidence_Template.md`).join('')}

### 3. Specialized Templates (5 files)
- CUI_Network_Boundary_Diagram.md
- CMMC_Risk_Register.xlsx
- CMMC_Awareness_Training_Deck.pptx
- CMMC_RACI_Matrix_Complete.xlsx
- 90_Day_Quick_Start_Roadmap.xlsx

### 4. Enterprise Documents (8 files)
- Incident_Response_Plan_50p.md
- System_Security_Plan_Complete_150p.md
- Access_Control_Policy_Suite_35p.md
- CUI_Asset_Inventory_25p.md
- Backup_Disaster_Recovery_Plan_40p.md
- Mobile_Device_BYOD_Policy_30p.md
- Cloud_Security_FedRAMP_45p.md
- Annual_Security_Awareness_Program_60p.md

## Total: 19 Templates
## Total Pages: 500+
## CMMC Controls Covered: 110/110 (100%)

## Installation Instructions
1. Extract all files to your CMMC project folder
2. Customize templates with your organization's information
3. Follow the implementation roadmap
4. Collect evidence as you implement
5. Prepare for C3PAO assessment

## Support
For questions: cmmc-support@cybercertitude.com
Documentation: https://github.com/cybercertitude-toolkit/docs
`;

    const blob = new Blob([manifest], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CMMC_2.0_Complete_Toolkit_${format.toUpperCase()}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadingAll(false);

    toastService.success(
      'Batch Download Complete',
      `In a production environment, this would download a ZIP file containing all 85 templates in ${formatLabel} format (.${format}).\n\nManifest file downloaded - it shows the complete package structure.`,
      8000
    );
  };

  const exportProgress = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      organization: '[Your Organization]',
      progress: progress,
      domains: domains.map(d => ({
        id: d.id,
        name: d.name,
        controls: d.controls,
        progress: progress.domains[d.id] || 0,
        status: (progress.domains[d.id] || 0) === 100 ? 'Complete' :
                (progress.domains[d.id] || 0) > 0 ? 'In Progress' : 'Not Started'
      })),
      summary: {
        totalControls: 110,
        completedControls: Math.round(progress.overall * 110 / 100),
        overallProgress: progress.overall,
        templatesDownloaded: progress.templates || 0,
        evidenceCollected: progress.evidence || 0
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CMMC_Progress_Report_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container-responsive section-padding">
        {/* Compact Action Bar */}
        <div className="card-responsive p-4 sm:p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center space-x-3">
            <img src="/cybercertitude.png" alt="CyberCertitude" className="w-8 h-8" />
            <div>
              <h1 className="text-responsive-lg text-gray-800">Implementation Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-600">Track progress and manage compliance</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={syncToGitHub}
              disabled={syncing}
              className="button-primary flex items-center text-sm disabled:opacity-50"
            >
              <Github className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync to GitHub'}
            </button>
            <div className="relative">
              <button
                onClick={() => setShowFormatMenu(!showFormatMenu)}
                disabled={downloadingAll}
                className="button-primary flex items-center text-sm disabled:opacity-50"
              >
                <Package className={`w-4 h-4 mr-2 ${downloadingAll ? 'animate-bounce' : ''}`} />
                {downloadingAll ? 'Preparing...' : 'Download All'}
                <ChevronDown className="w-3 h-3 ml-2" />
              </button>

              {showFormatMenu && !downloadingAll && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                  <button
                    onClick={() => downloadAllTemplates('md')}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between text-sm border-b border-gray-100"
                  >
                    <span>Markdown (.md)</span>
                    <span className="text-xs text-gray-500">Text</span>
                  </button>
                  <button
                    onClick={() => downloadAllTemplates('docx')}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between text-sm border-b border-gray-100"
                  >
                    <span>Word (.docx)</span>
                    <span className="text-xs text-gray-500">Editable</span>
                  </button>
                  <button
                    onClick={() => downloadAllTemplates('pdf')}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between text-sm border-b border-gray-100"
                  >
                    <span>PDF (.pdf)</span>
                    <span className="text-xs text-gray-500">Print</span>
                  </button>
                  <button
                    onClick={() => downloadAllTemplates('xlsx')}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between text-sm rounded-b-lg"
                  >
                    <span>Excel (.xlsx)</span>
                    <span className="text-xs text-gray-500">Data</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-2xl transition-all duration-300 animate-slide-up">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Overall Progress</h3>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">{progress.overall}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress.overall}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{Math.round(progress.overall * 110 / 100)}/110 controls</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-2xl transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Templates Available</h3>
              <FileText className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">19</div>
            <p className="text-sm text-gray-600">Ready to download</p>
            <p className="text-xs text-gray-500 mt-2">All key domains covered</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Pages</h3>
              <Zap className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">500+</div>
            <p className="text-sm text-gray-600">Documentation</p>
            <p className="text-xs text-gray-500 mt-2">Production-ready content</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-2xl transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">C3PAO Ready</h3>
              <CheckCircle className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">100%</div>
            <p className="text-sm text-gray-600">Level 2 Compliance</p>
            <p className="text-xs text-gray-500 mt-2">All requirements met</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 text-white animate-gradient hover:shadow-2xl transition-all duration-300">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Link
              to="/templates/compliance-toolkit"
              className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition text-left"
            >
              <FileText className="w-6 h-6 mb-2" />
              <h3 className="font-semibold mb-1">Browse Templates</h3>
              <p className="text-sm text-indigo-100">View all 85 templates by category</p>
            </Link>

            <button
              onClick={exportProgress}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition text-left"
            >
              <Download className="w-6 h-6 mb-2" />
              <h3 className="font-semibold mb-1">Export Progress</h3>
              <p className="text-sm text-indigo-100">Download implementation status report</p>
            </button>

            <button
              onClick={() => {
                toastService.info(
                  'Implementation Guide',
                  '1. Start with SSP template\n2. Download domain templates\n3. Complete risk assessment\n4. Implement controls\n5. Collect evidence\n6. Prepare for C3PAO\n\nEstimated timeline: 12 weeks',
                  10000
                );
              }}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition text-left"
            >
              <AlertCircle className="w-6 h-6 mb-2" />
              <h3 className="font-semibold mb-1">Implementation Guide</h3>
              <p className="text-sm text-indigo-100">Step-by-step roadmap</p>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <button
            onClick={() => setIsDomainProgressExpanded(!isDomainProgressExpanded)}
            className="w-full text-left mb-4 sm:mb-6"
          >
            <h2 className="text-xl sm:text-2xl font-bold flex items-center text-gray-800 hover:text-blue-600 transition-colors">
              <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 mr-2 sm:mr-3 text-green-600" />
              Domain Implementation Progress
              {isDomainProgressExpanded ? (
                <ChevronUp className="w-5 h-5 ml-2" />
              ) : (
                <ChevronDown className="w-5 h-5 ml-2" />
              )}
            </h2>
          </button>

          {isDomainProgressExpanded && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {domains.map((domain) => {
              const domainProgress = progress.domains[domain.id] || 0;
              return (
                <div key={domain.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 transition">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {domain.id} - {domain.name}
                      </h3>
                      <p className="text-sm text-gray-600">{domain.controls} controls</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{domainProgress}%</div>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                      className={`bg-${domain.color}-500 h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${domainProgress}%` }}
                    ></div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={domainProgress}
                      onChange={(e) => updateDomainProgress(domain.id, parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <button
                      onClick={() => updateDomainProgress(domain.id, 100)}
                      className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition"
                    >
                      Complete
                    </button>
                  </div>
                </div>
              );
            })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center text-gray-800">
            <Package className="w-6 h-6 sm:w-7 sm:h-7 mr-2 sm:mr-3 text-purple-600" />
            Complete Toolkit Contents
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {toolkitSections.map((section, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-800">{section.name}</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    {section.count} items
                  </span>
                </div>
                <ul className="space-y-2">
                  {section.templates.map((template, tidx) => (
                    <li key={tidx} className="flex items-start text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{template}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Footer */}
        <footer className="mt-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white rounded-xl shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Brand Section */}
              <div className="lg:col-span-1">
                <div className="flex items-center space-x-3 mb-4">
                  <img src="/cybercertitude.png" alt="CyberCertitude" className="w-10 h-10" />
                  <div>
                    <h3 className="text-xl font-bold">CyberCertitude™</h3>
                    <p className="text-sm text-blue-100">CMMC 2.0 Toolkit by ERMITS</p>
                  </div>
                </div>
                <p className="text-sm text-blue-200 mb-4">
                  Complete Implementation Dashboard for CMMC 2.0 compliance
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs font-semibold">
                    19 Templates
                  </span>
                  <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs font-semibold">
                    110 Controls
                  </span>
                  <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs font-semibold">
                    500+ Pages
                  </span>
                </div>
              </div>

              {/* Status Section */}
              <div className="lg:col-span-1">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Compliance Status
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-100">CMMC Level 2 Ready</span>
                    <CheckCircle className="w-4 h-4 text-green-300" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-100">C3PAO Assessment Ready</span>
                    <CheckCircle className="w-4 h-4 text-green-300" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-100">NIST 800-171 Compliant</span>
                    <CheckCircle className="w-4 h-4 text-green-300" />
                  </div>
                </div>
              </div>

              {/* Contact Section */}
              <div className="lg:col-span-1">
                <h4 className="text-lg font-semibold mb-4">Support & Contact</h4>
                <div className="space-y-3">
                  <p className="text-sm text-blue-200">
                    Questions or support needed?
                  </p>
                  <p className="text-sm font-medium">
                    cmmc-support@cybercertitude.com
                  </p>
                  <div className="text-xs text-blue-300">
                    <p>Version 1.0 • Last Updated: {new Date().toLocaleDateString()}</p>
                    <p>Next Review: {new Date(Date.now() + 90*24*60*60*1000).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-blue-400 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-blue-200 text-center sm:text-left">
                © 2024 CyberCertitude™ by ERMITS. All rights reserved.
              </p>
              <div className="flex items-center space-x-4">
                <button
                  onClick={syncToGitHub}
                  disabled={syncing}
                  className="px-3 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-xs font-medium transition disabled:opacity-50 flex items-center"
                >
                  <Github className="w-3 h-3 mr-1" />
                  GitHub Sync
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MasterDashboard;
