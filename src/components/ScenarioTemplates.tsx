import React, { useState } from 'react';
import { Download, AlertCircle, Lock, Server, HardDrive, Smartphone, Cloud, Users, FileText, FileSpreadsheet, File, ChevronDown, Eye } from 'lucide-react';
import { downloadMarkdown, downloadWord, downloadPDF, downloadExcel, convertMarkdownToTemplateData, downloadWithFallback, DocumentFormat, DownloadResult, TemplateData } from '../utils/downloadUtils';
import { getTemplateContent } from '../data/templateContent';
import DocumentPreviewModal from './DocumentPreviewModal';
import { Breadcrumbs } from '../shared/components/layout/Breadcrumbs';

interface Scenario {
  id: string;
  title: string;
  icon: React.ElementType | string;
  color: string;
  controls: string[];
  description: string;
  pages: number;
  includes: string[];
}

const ScenarioTemplates: React.FC = () => {
  const [showFormatMenu, setShowFormatMenu] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    scenario: Scenario | null;
    templateData: TemplateData | null;
    markdownContent: string;
  }>({
    isOpen: false,
    scenario: null,
    templateData: null,
    markdownContent: ''
  });

  const scenarios: Scenario[] = [
    {
      id: 'incident-response-plan',
      title: 'Complete Incident Response Plan',
      icon: AlertCircle,
      color: 'red',
      controls: ['IR.1.076', 'IR.2.092', 'IR.2.093', 'IR.2.094', 'IR.2.095'],
      description: 'Comprehensive 50-page incident response plan with playbooks',
      pages: 50,
      includes: [
        'IR team structure and contacts',
        'Step-by-step response procedures',
        'Communication templates',
        'Evidence collection guides',
        'Post-incident review templates'
      ]
    },
    {
      id: 'ssp-complete',
      title: 'System Security Plan (SSP) - Complete',
      icon: '/cybercertitude.png',
      color: 'blue',
      controls: ['All 110 Controls'],
      description: 'Full 150-page SSP template with all sections required for CMMC Level 2',
      pages: 150,
      includes: [
        'System description and architecture',
        'All 110 control implementation statements',
        'CUI categorization and flow diagrams',
        'Security control baseline',
        'Continuous monitoring strategy'
      ]
    },
    {
      id: 'access-control-policy',
      title: 'Access Control Policy Suite',
      icon: Lock,
      color: 'purple',
      controls: ['AC.1.001', 'AC.1.002', 'AC.1.003', 'AC.2.007', 'AC.2.008'],
      description: 'Complete access control policies covering all AC domain requirements',
      pages: 35,
      includes: [
        'Account management procedures',
        'Least privilege implementation guide',
        'Remote access policy and VPN procedures',
        'Privileged account management',
        'Access request and approval forms'
      ]
    },
    {
      id: 'asset-inventory',
      title: 'CUI Asset Inventory & Management',
      icon: Server,
      color: 'green',
      controls: ['CM.2.061', 'CM.2.062', 'SC.1.175', 'AC.1.001'],
      description: 'Complete asset management system for tracking all CUI-related assets',
      pages: 25,
      includes: [
        'Hardware inventory template',
        'Software license tracking',
        'CUI data flow mapping',
        'Asset classification matrix',
        'Disposal and sanitization procedures'
      ]
    },
    {
      id: 'backup-recovery',
      title: 'Backup & Disaster Recovery Plan',
      icon: HardDrive,
      color: 'indigo',
      controls: ['CP.2.046', 'CP.2.047', 'CP.2.048', 'SI.1.212'],
      description: 'Comprehensive backup strategy and disaster recovery procedures',
      pages: 40,
      includes: [
        'Backup schedule and retention policy',
        'Recovery Time Objectives (RTO)',
        'Recovery Point Objectives (RPO)',
        'Backup testing procedures',
        'Disaster recovery playbooks'
      ]
    },
    {
      id: 'mobile-device-policy',
      title: 'Mobile Device & BYOD Policy',
      icon: Smartphone,
      color: 'pink',
      controls: ['AC.2.015', 'MP.2.120', 'SC.2.179', 'SC.3.191'],
      description: 'Mobile device management policy for CUI access on mobile devices',
      pages: 30,
      includes: [
        'BYOD enrollment procedures',
        'Mobile device security requirements',
        'Remote wipe capabilities',
        'Lost/stolen device procedures',
        'VPN and secure access requirements'
      ]
    },
    {
      id: 'cloud-security',
      title: 'Cloud Security & FedRAMP Compliance',
      icon: Cloud,
      color: 'cyan',
      controls: ['SC.2.179', 'AC.2.013', 'CM.2.065', 'IA.2.081'],
      description: 'Cloud service provider assessment and CUI cloud hosting requirements',
      pages: 45,
      includes: [
        'CSP assessment questionnaire',
        'FedRAMP Moderate requirement mapping',
        'Shared responsibility matrix',
        'Cloud configuration baselines',
        'Data encryption requirements'
      ]
    },
    {
      id: 'security-awareness',
      title: 'Annual Security Awareness Program',
      icon: Users,
      color: 'yellow',
      controls: ['AT.2.056', 'AT.3.057', 'AT.3.058', 'PS.1.127'],
      description: 'Complete 12-month security awareness program with monthly themes',
      pages: 60,
      includes: [
        '12 monthly training modules',
        'Phishing simulation campaigns',
        'Security awareness posters',
        'Newsletter templates',
        'Training effectiveness metrics'
      ]
    }
  ];

  const showPreview = (scenario: Scenario) => {
    const markdownContent = getTemplateContent(scenario.title, scenario.id, 'scenario');
    const templateData = convertMarkdownToTemplateData(
      scenario.title,
      markdownContent,
      {
        version: '1.0',
        date: new Date().toLocaleDateString(),
        pages: scenario.pages,
        includes: scenario.includes,
      }
    );
    templateData.subtitle = scenario.description;
    templateData.controls = scenario.controls;
    templateData.description = `This ${scenario.pages}-page enterprise document provides comprehensive guidance for ${scenario.title}.`;

    setPreviewModal({
      isOpen: true,
      scenario,
      templateData,
      markdownContent
    });
    setShowFormatMenu(null);
  };

  const downloadScenario = async (scenario: Scenario, format: DocumentFormat) => {
    setDownloading(scenario.id);
    setPreviewModal(prev => ({ ...prev, isOpen: false }));

    try {
      const markdownContent = getTemplateContent(scenario.title, scenario.id, 'scenario');
      const filename = `${scenario.id}_${new Date().toISOString().split('T')[0]}`;

      let result: DownloadResult;

      if (format === 'md') {
        result = downloadMarkdown(markdownContent, filename);
      } else {
        const templateData = convertMarkdownToTemplateData(
          scenario.title,
          markdownContent,
          {
            version: '1.0',
            date: new Date().toLocaleDateString(),
            pages: scenario.pages,
            includes: scenario.includes,
          }
        );
        templateData.subtitle = scenario.description;
        templateData.controls = scenario.controls;
        templateData.description = `This ${scenario.pages}-page enterprise document provides comprehensive guidance for ${scenario.title}.`;

        if (format === 'docx') {
          result = await downloadWord(templateData, filename);
        } else if (format === 'pdf') {
          result = downloadPDF(templateData, filename);
        } else if (format === 'xlsx') {
          result = await downloadExcel(templateData, filename);
        } else {
          result = await downloadWithFallback(templateData, filename, format, markdownContent);
        }

        if (!result.success) {
          console.warn(`${format} download failed, trying fallback...`);
          const fallbackResult = await downloadWithFallback(templateData, filename, format, markdownContent);

          if (fallbackResult.success) {
            alert(`Note: Downloaded as ${fallbackResult.format?.toUpperCase()} format (${format.toUpperCase()} format had issues).\n\nFile: ${fallbackResult.filename}`);
          } else {
            throw new Error(fallbackResult.error || 'All download formats failed');
          }
        }
      }
    } catch (error) {
      console.error('Download error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to generate document: ${errorMessage}\n\nPlease try:\n1. A different format\n2. Refreshing the page\n3. Using a different browser`);
    } finally {
      setDownloading(null);
    }
  };

  const ActionButtons = ({ scenario }: { scenario: Scenario }) => {
    const isOpen = showFormatMenu === scenario.id;
    const isDownloading = downloading === scenario.id;

    return (
      <div className="flex gap-2 flex-wrap sm:flex-nowrap">
        <button
          onClick={() => showPreview(scenario)}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold flex items-center shadow-md text-sm sm:text-base flex-shrink-0"
        >
          <Eye className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Preview
        </button>
        <div className="relative">
          <button
            onClick={() => setShowFormatMenu(isOpen ? null : scenario.id)}
            disabled={isDownloading}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center shadow-md disabled:opacity-50 text-sm sm:text-base flex-shrink-0"
          >
            <Download className="w-5 h-5 mr-2" />
            {isDownloading ? 'Generating...' : 'Download'}
            <ChevronDown className="w-4 h-4 ml-1" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
              <button
                onClick={() => downloadScenario(scenario, 'md')}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center text-sm border-b border-gray-100"
              >
                <FileText className="w-4 h-4 mr-3 text-gray-600" />
                Markdown (.md)
              </button>
              <button
                onClick={() => downloadScenario(scenario, 'docx')}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center text-sm border-b border-gray-100"
              >
                <File className="w-4 h-4 mr-3 text-blue-600" />
                Word (.docx)
              </button>
              <button
                onClick={() => downloadScenario(scenario, 'pdf')}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center text-sm border-b border-gray-100"
              >
                <File className="w-4 h-4 mr-3 text-red-600" />
                PDF (.pdf)
              </button>
              <button
                onClick={() => downloadScenario(scenario, 'xlsx')}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center text-sm rounded-b-lg"
              >
                <FileSpreadsheet className="w-4 h-4 mr-3 text-green-600" />
                Excel (.xlsx)
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6">
          <Breadcrumbs items={[
            { label: 'CMMC 2.0 Platform', path: '/dashboard' },
            { label: 'Templates', path: '/templates/library' },
            { label: 'Scenario Templates', isActive: true }
          ]} />
        </div>
      </div>
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white py-8 sm:py-12 px-4 sm:px-6 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 flex items-center">
            <img src="/cybercertitude.png" alt="CyberCertitude" className="w-8 h-8 sm:w-10 sm:h-10 mr-2 sm:mr-4 flex-shrink-0" />
            <span className="break-words">CMMC 2.0 Enterprise Documents</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-blue-100">Complete, Production-Ready Documentation</p>
          <p className="text-xs sm:text-sm text-blue-200 mt-2">50-150 page comprehensive templates with real content</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 hover:shadow-2xl transition-all duration-300 animate-slide-up">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">🎯 Enterprise-Grade Templates</h2>
          <p className="text-gray-600 mb-6">
            Each template is a complete, detailed document ranging from 25-150 pages with actual implementation
            content, procedures, forms, and examples. These are production-ready documents used by CMMC-certified organizations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
              <h3 className="font-semibold text-green-800 mb-2">✓ What You Get</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Complete procedures and workflows</li>
                <li>• Pre-filled forms and checklists</li>
                <li>• Real examples and scenarios</li>
                <li>• Evidence collection guides</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <h3 className="font-semibold text-blue-800 mb-2">✓ Ready for C3PAO</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• All 110 controls addressed</li>
                <li>• NIST 800-171 aligned</li>
                <li>• Evidence-ready structure</li>
                <li>• Approval signatures included</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6">
          {scenarios.map((scenario) => {
            const IconComponent = scenario.icon;
            const isImageIcon = typeof IconComponent === 'string';
            return (
              <div
                key={scenario.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition overflow-hidden border border-gray-200"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 mb-4">
                    <div className="flex items-start flex-1 min-w-0">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-blue-100 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                        {isImageIcon ? (
                          <img src={IconComponent} alt="Icon" className="w-6 h-6 sm:w-8 sm:h-8" />
                        ) : (
                          <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2 break-words">{scenario.title}</h3>
                        <p className="text-gray-600 mb-3">{scenario.description}</p>

                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full bg-blue-100 text-blue-700 font-medium">
                            {scenario.pages} pages
                          </span>
                          <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full bg-gray-100 text-gray-700 font-medium">
                            {scenario.controls.length} controls
                          </span>
                        </div>
                      </div>
                    </div>

                    <ActionButtons scenario={scenario} />
                  </div>

                  <div className="border-t border-gray-200 pt-3 sm:pt-4">
                    <h4 className="font-semibold text-gray-700 mb-2 text-xs sm:text-sm uppercase tracking-wide">Includes:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {scenario.includes.map((item, idx) => (
                        <div key={idx} className="flex items-start text-sm text-gray-600">
                          <span className="text-blue-500 mr-2">▸</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 sm:mt-12 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl shadow-xl p-4 sm:p-6 lg:p-8 text-white animate-gradient hover:shadow-2xl transition-all duration-300">
          <h3 className="text-xl sm:text-2xl font-bold mb-4">💡 Implementation Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <h4 className="font-semibold mb-2">Start with SSP</h4>
              <p className="text-sm text-purple-100">
                The System Security Plan is your foundation. Download and customize it first.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Evidence-First Approach</h4>
              <p className="text-sm text-purple-100">
                Each template includes evidence collection sections. Start gathering immediately.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">C3PAO Ready</h4>
              <p className="text-sm text-purple-100">
                All templates are structured for assessment with approval signatures and version control.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal(prev => ({ ...prev, isOpen: false }))}
        onDownload={(format) => previewModal.scenario && downloadScenario(previewModal.scenario, format)}
        templateName={previewModal.scenario?.title || ''}
        templateData={previewModal.templateData!}
        markdownContent={previewModal.markdownContent}
        availableFormats={['md', 'docx', 'pdf', 'xlsx']}
        isDownloading={downloading !== null}
      />
    </div>
  );
};

export default ScenarioTemplates;
