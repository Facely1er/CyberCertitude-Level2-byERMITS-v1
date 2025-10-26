import React, { useState, useEffect, useRef } from 'react';
import { Download, CheckCircle, ChevronDown, ChevronRight, FileText, FileSpreadsheet, File, Eye } from 'lucide-react';
import { downloadMarkdown, downloadWord, downloadPDF, downloadExcel, convertMarkdownToTemplateData, downloadWithFallback, DocumentFormat, DownloadResult, TemplateData } from '../utils/downloadUtils';
import { getTemplateContent } from '../data/templateContent';
import DocumentPreviewModal from './DocumentPreviewModal';
import { Breadcrumbs } from '../shared/components/layout/Breadcrumbs';

const ComplianceToolkit: React.FC = () => {
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const [showFormatMenu, setShowFormatMenu] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    templateName: string;
    domainId: string;
    templateData: TemplateData | null;
    markdownContent: string;
  }>({
    isOpen: false,
    templateName: '',
    domainId: '',
    templateData: null,
    markdownContent: ''
  });

  // Handle clicks outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowFormatMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const domains = [
    {
      id: 'AC',
      name: 'Access Control',
      controls: 22,
      templates: [
        { name: 'Access Control Policy', type: 'policy', description: 'User access management and authentication requirements' },
        { name: 'User Access Matrix', type: 'evidence', description: 'Document user roles and permissions' },
        { name: 'Access Review Log', type: 'evidence', description: 'Quarterly access review documentation' }
      ]
    },
    {
      id: 'AU',
      name: 'Audit and Accountability',
      controls: 9,
      templates: [
        { name: 'Audit Policy', type: 'policy', description: 'System auditing and logging requirements' },
        { name: 'Audit Log Review Template', type: 'evidence', description: 'Regular audit log analysis documentation' },
        { name: 'Audit Retention Schedule', type: 'evidence', description: 'Log retention and archival procedures' }
      ]
    },
    {
      id: 'AT',
      name: 'Awareness and Training',
      controls: 3,
      templates: [
        { name: 'Security Awareness Policy', type: 'policy', description: 'Security training program requirements' },
        { name: 'Training Completion Tracker', type: 'evidence', description: 'Staff training records and certifications' },
        { name: 'Annual Training Plan', type: 'evidence', description: 'Scheduled security awareness activities' }
      ]
    },
    {
      id: 'CM',
      name: 'Configuration Management',
      controls: 9,
      templates: [
        { name: 'Configuration Management Plan', type: 'policy', description: 'System configuration and change control' },
        { name: 'Baseline Configuration Template', type: 'evidence', description: 'Documented system baselines' },
        { name: 'Change Request Form', type: 'evidence', description: 'Formal change management process' }
      ]
    },
    {
      id: 'IA',
      name: 'Identification and Authentication',
      controls: 11,
      templates: [
        { name: 'Authentication Policy', type: 'policy', description: 'User identification and authentication standards' },
        { name: 'MFA Implementation Guide', type: 'evidence', description: 'Multi-factor authentication deployment' },
        { name: 'Password Policy Compliance', type: 'evidence', description: 'Password requirements documentation' }
      ]
    },
    {
      id: 'IR',
      name: 'Incident Response',
      controls: 3,
      templates: [
        { name: 'Incident Response Plan', type: 'policy', description: 'Incident detection, response, and recovery' },
        { name: 'Incident Report Template', type: 'evidence', description: 'Standardized incident documentation' },
        { name: 'IR Team Contact List', type: 'evidence', description: 'Emergency response team roster' }
      ]
    },
    {
      id: 'MA',
      name: 'Maintenance',
      controls: 6,
      templates: [
        { name: 'Maintenance Policy', type: 'policy', description: 'System maintenance and updates' },
        { name: 'Maintenance Schedule', type: 'evidence', description: 'Planned maintenance activities' },
        { name: 'Maintenance Log', type: 'evidence', description: 'Completed maintenance documentation' }
      ]
    },
    {
      id: 'MP',
      name: 'Media Protection',
      controls: 8,
      templates: [
        { name: 'Media Protection Policy', type: 'policy', description: 'CUI media handling and sanitization' },
        { name: 'Media Sanitization Log', type: 'evidence', description: 'Media disposal documentation' },
        { name: 'CUI Marking Guide', type: 'evidence', description: 'CUI identification and labeling' }
      ]
    },
    {
      id: 'PS',
      name: 'Personnel Security',
      controls: 2,
      templates: [
        { name: 'Personnel Security Policy', type: 'policy', description: 'Background screening and access management' },
        { name: 'Background Check Log', type: 'evidence', description: 'Personnel screening records' },
        { name: 'Termination Checklist', type: 'evidence', description: 'Access revocation procedures' }
      ]
    },
    {
      id: 'PE',
      name: 'Physical Protection',
      controls: 6,
      templates: [
        { name: 'Physical Security Policy', type: 'policy', description: 'Physical access and environmental controls' },
        { name: 'Visitor Access Log', type: 'evidence', description: 'Physical access tracking' },
        { name: 'Facility Security Assessment', type: 'evidence', description: 'Physical security evaluation' }
      ]
    },
    {
      id: 'RA',
      name: 'Risk Assessment',
      controls: 3,
      templates: [
        { name: 'Risk Assessment Policy', type: 'policy', description: 'Risk identification and assessment processes' },
        { name: 'Risk Assessment Template', type: 'evidence', description: 'Comprehensive risk analysis' },
        { name: 'Risk Register', type: 'evidence', description: 'Ongoing risk tracking and mitigation' }
      ]
    },
    {
      id: 'CA',
      name: 'Security Assessment',
      controls: 2,
      templates: [
        { name: 'Assessment Policy', type: 'policy', description: 'Security control assessment and testing' },
        { name: 'POA&M Template', type: 'evidence', description: 'Plan of Actions and Milestones' },
        { name: 'Vulnerability Scan Results', type: 'evidence', description: 'Regular security scan documentation' }
      ]
    },
    {
      id: 'SC',
      name: 'System and Communications Protection',
      controls: 20,
      templates: [
        { name: 'System Protection Policy', type: 'policy', description: 'System and network protection requirements' },
        { name: 'Network Boundary Diagram', type: 'evidence', description: 'Network architecture documentation' },
        { name: 'Encryption Implementation', type: 'evidence', description: 'Data encryption controls' }
      ]
    },
    {
      id: 'SI',
      name: 'System and Information Integrity',
      controls: 6,
      templates: [
        { name: 'Information Integrity Policy', type: 'policy', description: 'Information and system integrity requirements' },
        { name: 'Malware Protection Log', type: 'evidence', description: 'Anti-malware deployment and updates' },
        { name: 'Security Alert Response', type: 'evidence', description: 'Security alert tracking and resolution' }
      ]
    }
  ];

  const coreDocuments = [
    { name: 'System Security Plan (SSP)', description: 'Complete SSP with NIST SP 800-171 mapping' },
    { name: 'Security Assessment Report (SAR)', description: 'Detailed assessment findings and recommendations' },
    { name: 'POAM Master Template', description: 'Plan of Actions and Milestones for gap remediation' },
    { name: 'Evidence Collection Guide', description: 'Systematic approach to gathering compliance evidence' }
  ];

  const showPreview = (templateName: string, domainId: string) => {
    const markdownContent = getTemplateContent(templateName, domainId);
    const templateData = convertMarkdownToTemplateData(
      templateName,
      markdownContent,
      {
        version: '1.0',
        date: new Date().toLocaleDateString(),
        domain: domainId,
      }
    );

    setPreviewModal({
      isOpen: true,
      templateName,
      domainId,
      templateData,
      markdownContent
    });
    setShowFormatMenu(null);
  };

  const downloadTemplate = async (templateName: string, domainId: string, format: DocumentFormat) => {
    const downloadId = `${templateName}-${domainId}`;
    setDownloading(downloadId);
    setPreviewModal(prev => ({ ...prev, isOpen: false }));

    try {
      const markdownContent = getTemplateContent(templateName, domainId);
      const filename = `${templateName.replace(/\s+/g, '_')}_${domainId}_Template`;

      let result: DownloadResult;

      if (format === 'md') {
        result = downloadMarkdown(markdownContent, filename);
      } else {
        const templateData = convertMarkdownToTemplateData(
          templateName,
          markdownContent,
          {
            version: '1.0',
            date: new Date().toLocaleDateString(),
            domain: domainId,
          }
        );

        if (format === 'docx') {
          result = await downloadWord(templateData, filename);
        } else if (format === 'pdf') {
          result = downloadPDF(templateData, filename);
        } else if (format === 'xlsx') {
          result = await downloadExcel(templateData, filename);
        } else {
          result = await downloadWithFallback(templateData, filename, format, markdownContent);
        }
      }

      if (!result.success) {
        console.warn(`${format} download failed, trying fallback...`);
        const templateData = convertMarkdownToTemplateData(
          templateName,
          markdownContent,
          {
            version: '1.0',
            date: new Date().toLocaleDateString(),
            domain: domainId,
          }
        );
        const fallbackResult = await downloadWithFallback(templateData, filename, format, markdownContent);

        if (fallbackResult.success) {
          alert(`Note: Downloaded as ${fallbackResult.format?.toUpperCase()} format (${format.toUpperCase()} format had issues).\n\nFile: ${fallbackResult.filename}`);
        } else {
          throw new Error(fallbackResult.error || 'All download formats failed');
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

  const ActionButtons = ({ templateName, domainId }: { templateName: string; domainId: string }) => {
    const menuId = `${templateName}-${domainId}`;
    const isOpen = showFormatMenu === menuId;
    const isDownloading = downloading === menuId;

    return (
      <div className="flex gap-2" ref={isOpen ? dropdownRef : null}>
        <button
          onClick={() => showPreview(templateName, domainId)}
          className="px-3 sm:px-4 py-2 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition flex items-center text-xs sm:text-sm font-medium flex-shrink-0"
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </button>
        <div className="relative">
          <button
            onClick={() => setShowFormatMenu(isOpen ? null : menuId)}
            disabled={isDownloading}
            className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center text-xs sm:text-sm font-medium disabled:opacity-50 flex-shrink-0"
          >
            <Download className="w-4 h-4 mr-2" />
            {isDownloading ? 'Generating...' : 'Download'}
            <ChevronDown className="w-3 h-3 ml-1" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
              <button
                onClick={() => {
                  downloadTemplate(templateName, domainId, 'md');
                  setShowFormatMenu(null);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-sm border-b border-gray-100"
              >
                <FileText className="w-4 h-4 mr-2 text-gray-600" />
                Markdown (.md)
              </button>
              <button
                onClick={() => {
                  downloadTemplate(templateName, domainId, 'docx');
                  setShowFormatMenu(null);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-sm border-b border-gray-100"
              >
                <File className="w-4 h-4 mr-2 text-blue-600" />
                Word (.docx)
              </button>
              <button
                onClick={() => {
                  downloadTemplate(templateName, domainId, 'pdf');
                  setShowFormatMenu(null);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-sm border-b border-gray-100"
              >
                <File className="w-4 h-4 mr-2 text-red-600" />
                PDF (.pdf)
              </button>
              <button
                onClick={() => {
                  downloadTemplate(templateName, domainId, 'xlsx');
                  setShowFormatMenu(null);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-sm rounded-b-lg"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2 text-green-600" />
                Excel (.xlsx)
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-6">
          <Breadcrumbs items={[
            { label: 'CMMC 2.0 Platform', path: '/dashboard' },
            { label: 'Templates', path: '/templates/library' },
            { label: 'Compliance Toolkit', isActive: true }
          ]} />
        </div>
      </div>
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-8 sm:py-12 px-4 sm:px-6 shadow-xl">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 flex items-center">
            <img src="/cybercertitude.png" alt="CyberCertitude" className="w-8 h-8 sm:w-10 sm:h-10 mr-2 sm:mr-3 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="break-words">CyberCertitude™</span>
              <span className="text-lg sm:text-xl lg:text-2xl font-semibold text-blue-100">CMMC 2.0 Toolkit</span>
              <span className="text-sm sm:text-base text-blue-200">by ERMITS</span>
            </div>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-blue-100">Complete Templates for Evidence Collection & Documentation</p>
          <p className="text-xs sm:text-sm text-blue-200 mt-2">110 Controls • 14 Domains • Level 2 Certification Ready</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">Core Documentation Templates</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {coreDocuments.map((doc, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition">
                <h3 className="font-semibold text-gray-800 mb-1">{doc.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{doc.description}</p>
                <ActionButtons templateName={doc.name} domainId="Core" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">Domain-Specific Templates (14 CMMC Domains)</h2>

          <div className="space-y-3">
            {domains.map((domain) => (
              <div key={domain.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedDomain(expandedDomain === domain.id ? null : domain.id)}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <div className="flex items-center flex-1 min-w-0">
                    {expandedDomain === domain.id ? (
                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 mr-2 sm:mr-3 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 mr-2 sm:mr-3 flex-shrink-0" />
                    )}
                    <div className="text-left min-w-0 flex-1">
                      <div className="font-semibold text-gray-800 text-sm sm:text-base break-words">
                        {domain.id} - {domain.name}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 mt-1">
                        {domain.controls} controls • {domain.templates.length} templates
                      </div>
                    </div>
                  </div>
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 ml-2" />
                </button>

                {expandedDomain === domain.id && (
                  <div className="px-5 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="space-y-3">
                      {domain.templates.map((template, idx) => (
                        <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <h4 className="font-semibold text-gray-800">{template.name}</h4>
                                <span className={`ml-3 px-2 py-1 text-xs rounded-full ${
                                  template.type === 'policy'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-green-100 text-green-700'
                                }`}>
                                  {template.type}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{template.description}</p>
                            </div>
                            <ActionButtons templateName={template.name} domainId={domain.id} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-4 sm:p-6 mt-6 sm:mt-8 text-white">
          <h3 className="text-xl sm:text-2xl font-bold mb-4">Quick Start Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h4 className="font-semibold mb-2">Phase 1: Assessment (Week 1-2)</h4>
              <ul className="text-sm space-y-1 text-blue-100">
                <li>• Download and complete SSP template</li>
                <li>• Conduct gap analysis using assessment templates</li>
                <li>• Document current control implementation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Phase 2: Evidence Collection (Week 3-6)</h4>
              <ul className="text-sm space-y-1 text-blue-100">
                <li>• Use domain templates to gather evidence</li>
                <li>• Complete policy documentation</li>
                <li>• Implement missing controls per POAM</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal(prev => ({ ...prev, isOpen: false }))}
        onDownload={(format) => downloadTemplate(previewModal.templateName, previewModal.domainId, format)}
        templateName={previewModal.templateName}
        templateData={previewModal.templateData!}
        markdownContent={previewModal.markdownContent}
        availableFormats={['md', 'docx', 'pdf', 'xlsx']}
        isDownloading={downloading !== null}
      />
    </div>
  );
};

export default ComplianceToolkit;
