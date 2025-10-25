import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, Eye, Settings, Shield, CheckCircle, 
  AlertTriangle, Clock, Users, Building, Database, 
  ArrowRight, RefreshCw, Save, Upload, BookOpen, X
} from 'lucide-react';
import { AssessmentData } from '../shared/types';
import { sspGenerationService, SSPDocument } from '../services/sspGenerationService';
import { poamGenerationService, POAMDocument } from '../services/poamGenerationService';
import { raciMatrixService, RACIMatrix } from '../services/raciMatrixService';
import { templateService } from '../services/templateService';
import { TemplateContent } from '../data/templates';
import { TemplateCustomizationModal } from './TemplateCustomizationModal';

interface SSPGeneratorProps {
  savedAssessments: AssessmentData[];
  onBack: () => void;
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

export const SSPGenerator: React.FC<SSPGeneratorProps> = ({
  savedAssessments,
  onBack,
  addNotification
}) => {
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentData | null>(null);
  const [organizationInfo, setOrganizationInfo] = useState({
    name: '',
    address: '',
    contact: '',
    systemName: '',
    systemDescription: ''
  });
  const [generatedSSP, setGeneratedSSP] = useState<SSPDocument | null>(null);
  const [generatedPOAM, setGeneratedPOAM] = useState<POAMDocument | null>(null);
  const [generatedRACI, setGeneratedRACI] = useState<RACIMatrix | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'ssp' | 'poam' | 'raci'>('ssp');
  const [useTemplate, setUseTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateContent | null>(null);
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);
  const [customizationTemplate, setCustomizationTemplate] = useState<TemplateContent | null>(null);

  const handleGenerate = async () => {
    if (!selectedAssessment) {
      addNotification('error', 'Please select an assessment first');
      return;
    }

    if (!organizationInfo.name || !organizationInfo.systemName) {
      addNotification('error', 'Please fill in organization and system information');
      return;
    }

    setIsGenerating(true);
    try {
      if (useTemplate && selectedTemplate) {
        // Generate SSP using template with auto-population
        const userData = {
          companyInfo: {
            name: organizationInfo.name,
            address: organizationInfo.address,
            contact: organizationInfo.contact
          },
          systemInfo: {
            name: organizationInfo.systemName,
            description: organizationInfo.systemDescription
          },
          assessmentData: selectedAssessment
        };

        const customizedContent = templateService.customizeContentTemplate(selectedTemplate.id, userData);
        const ssp = sspGenerationService.generateSSPFromTemplate(selectedTemplate, customizedContent, organizationInfo);
        setGeneratedSSP(ssp);
      } else {
        // Generate SSP using traditional method
        const ssp = sspGenerationService.generateSSP(selectedAssessment, organizationInfo);
        setGeneratedSSP(ssp);
      }

      // Generate POAM
      const poam = poamGenerationService.generatePOAM(selectedAssessment, {
        name: organizationInfo.name,
        systemName: organizationInfo.systemName,
        responsibleParties: ['CISO', 'Compliance Officer', 'IT Security Team', 'IT Operations']
      });
      setGeneratedPOAM(poam);

      // Generate RACI Matrix
      const raci = raciMatrixService.generateRACIMatrix(selectedAssessment, {
        name: organizationInfo.name,
        roles: [
          { id: 'ciso', name: 'CISO', department: 'Security', skills: ['Security Strategy'], level: 'executive' },
          { id: 'compliance', name: 'Compliance Officer', department: 'Compliance', skills: ['CMMC'], level: 'management' },
          { id: 'it-security', name: 'IT Security Team', department: 'IT', skills: ['Technical Security'], level: 'technical' }
        ]
      });
      setGeneratedRACI(raci);

      addNotification('success', 'Documents generated successfully!');
    } catch (error) {
      addNotification('error', 'Error generating documents: ' + (error as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectTemplate = (template: TemplateContent) => {
    setSelectedTemplate(template);
    setUseTemplate(true);
    setShowTemplatePreview(true);
  };

  const handleCustomizeTemplate = (template: TemplateContent) => {
    setCustomizationTemplate(template);
  };

  const handleSaveCustomization = (templateId: string, customizations: any) => {
    // Auto-populate organization info from customizations
    if (customizations.companyInfo) {
      setOrganizationInfo(prev => ({
        ...prev,
        name: customizations.companyInfo.name || prev.name,
        address: customizations.companyInfo.address || prev.address,
        contact: customizations.companyInfo.contact || prev.contact
      }));
    }
    if (customizations.systemInfo) {
      setOrganizationInfo(prev => ({
        ...prev,
        systemName: customizations.systemInfo.name || prev.systemName,
        systemDescription: customizations.systemInfo.description || prev.systemDescription
      }));
    }
    setCustomizationTemplate(null);
    addNotification('success', 'Template customizations saved and applied!');
  };

  const handleExportCustomization = async (templateId: string, customizations: any, format: string) => {
    try {
      const content = await templateService.exportContentTemplate(templateId, customizations, format as any);
      const template = templateService.getContentTemplate(templateId);
      downloadContent(content, `${template?.name || 'ssp-template'}.${format}`);
    } catch (error) {
      addNotification('error', 'Failed to export customized template: ' + (error as Error).message);
    }
  };

  const downloadContent = (content: string | Blob, filename: string) => {
    const blob = typeof content === 'string' ? new Blob([content], { type: 'text/plain' }) : content;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = (type: 'ssp' | 'poam' | 'raci', format: 'html' | 'pdf' | 'word') => {
    try {
      let content = '';
      let filename = '';

      switch (type) {
        case 'ssp':
          if (!generatedSSP) return;
          content = sspGenerationService.generateHTML(generatedSSP);
          filename = `SSP-${organizationInfo.systemName}-${new Date().toISOString().split('T')[0]}.html`;
          break;
        case 'poam':
          if (!generatedPOAM) return;
          content = poamGenerationService.generateHTML(generatedPOAM);
          filename = `POAM-${organizationInfo.systemName}-${new Date().toISOString().split('T')[0]}.html`;
          break;
        case 'raci':
          if (!generatedRACI) return;
          content = raciMatrixService.generateHTML(generatedRACI);
          filename = `RACI-${organizationInfo.systemName}-${new Date().toISOString().split('T')[0]}.html`;
          break;
      }

      const blob = new Blob([content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addNotification('success', `${type.toUpperCase()} exported successfully!`);
    } catch (error) {
      addNotification('error', 'Error exporting document: ' + (error as Error).message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Document Generator</h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Generate SSP, POAM, and RACI Matrix from your CMMC assessment
                </p>
              </div>
            </div>
            
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div className="space-y-6">
          {/* Assessment Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Select Assessment</h3>
            {savedAssessments.length === 0 ? (
              <div className="text-center py-8">
                <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300 mb-4">No assessments found</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Complete a CMMC assessment first to generate documents
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedAssessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedAssessment?.id === assessment.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedAssessment(assessment)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{assessment.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {assessment.framework} • {new Date(assessment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <CheckCircle className={`w-5 h-5 ${
                        selectedAssessment?.id === assessment.id ? 'text-blue-500' : 'text-gray-400'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Organization Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Organization Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Organization Name *
                </label>
                <input
                  type="text"
                  value={organizationInfo.name}
                  onChange={(e) => setOrganizationInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter organization name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  System Name *
                </label>
                <input
                  type="text"
                  value={organizationInfo.systemName}
                  onChange={(e) => setOrganizationInfo(prev => ({ ...prev, systemName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter system name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  System Description
                </label>
                <textarea
                  value={organizationInfo.systemDescription}
                  onChange={(e) => setOrganizationInfo(prev => ({ ...prev, systemDescription: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Describe the system and its purpose"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Information
                </label>
                <input
                  type="text"
                  value={organizationInfo.contact}
                  onChange={(e) => setOrganizationInfo(prev => ({ ...prev, contact: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter contact information"
                />
              </div>
            </div>
          </div>

          {/* Template Options */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">SSP Generation Options</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="traditional"
                  name="generationMethod"
                  checked={!useTemplate}
                  onChange={() => setUseTemplate(false)}
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="traditional" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Generate from Assessment Data
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="template"
                  name="generationMethod"
                  checked={useTemplate}
                  onChange={() => setUseTemplate(true)}
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="template" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Use Complete SSP Template
                </label>
              </div>
              
              {useTemplate && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">SSP Template</h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowTemplatePreview(true)}
                        className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors flex items-center space-x-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Preview</span>
                      </button>
                      <button
                        onClick={() => handleCustomizeTemplate(selectedTemplate!)}
                        disabled={!selectedTemplate}
                        className="px-3 py-1 text-xs bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 rounded hover:bg-green-200 dark:hover:bg-green-700 transition-colors flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Settings className="w-3 h-3" />
                        <span>Customize</span>
                      </button>
                    </div>
                  </div>
                  
                  {selectedTemplate ? (
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                      <p><strong>Selected:</strong> {selectedTemplate.name}</p>
                      <p className="text-xs mt-1">{selectedTemplate.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedTemplate.controls.slice(0, 3).map(control => (
                          <span key={control} className="px-2 py-1 bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-100 text-xs rounded">
                            {control}
                          </span>
                        ))}
                        {selectedTemplate.controls.length > 3 && (
                          <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs rounded">
                            +{selectedTemplate.controls.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                      <p>No template selected. Click "Browse Templates" to choose a complete SSP template.</p>
                      <button
                        onClick={() => {
                          const sspTemplate = templateService.getContentTemplate('ssp-complete');
                          if (sspTemplate) {
                            setSelectedTemplate(sspTemplate);
                          }
                        }}
                        className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors flex items-center space-x-1"
                      >
                        <Template className="w-3 h-3" />
                        <span>Use Default SSP Template</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!selectedAssessment || !organizationInfo.name || !organizationInfo.systemName || isGenerating}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>Generate Documents</span>
              </>
            )}
          </button>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {generatedSSP || generatedPOAM || generatedRACI ? (
            <>
              {/* Document Tabs */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex space-x-1 mb-6">
                  {[
                    { id: 'ssp', label: 'SSP', icon: FileText, available: !!generatedSSP },
                    { id: 'poam', label: 'POAM', icon: Clock, available: !!generatedPOAM },
                    { id: 'raci', label: 'RACI', icon: Users, available: !!generatedRACI }
                  ].map(({ id, label, icon: Icon, available }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id as any)}
                      disabled={!available}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        activeTab === id
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : available
                          ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>

                {/* Document Content */}
                <div className="space-y-4">
                  {activeTab === 'ssp' && generatedSSP && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        System Security Plan
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Generated on {generatedSSP.generatedDate.toLocaleDateString()} for {generatedSSP.organization}
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleExport('ssp', 'html')}
                          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>Export HTML</span>
                        </button>
                        <button
                          onClick={() => handleExport('ssp', 'pdf')}
                          className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>Export PDF</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'poam' && generatedPOAM && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Plan of Actions and Milestones
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {generatedPOAM.summary.totalMilestones} milestones • 
                        ${generatedPOAM.summary.estimatedTotalCost.toLocaleString()} estimated cost
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleExport('poam', 'html')}
                          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>Export HTML</span>
                        </button>
                        <button
                          onClick={() => handleExport('poam', 'pdf')}
                          className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>Export PDF</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'raci' && generatedRACI && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        RACI Matrix
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {generatedRACI.summary.totalRoles} roles • {generatedRACI.summary.totalControls} controls
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleExport('raci', 'html')}
                          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>Export HTML</span>
                        </button>
                        <button
                          onClick={() => handleExport('raci', 'pdf')}
                          className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>Export PDF</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Documents Generated
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Select an assessment and fill in organization information, then click "Generate Documents" to create your SSP, POAM, and RACI Matrix.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Template Preview Modal */}
      {showTemplatePreview && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Template Preview</h2>
              <button
                onClick={() => setShowTemplatePreview(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{selectedTemplate.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedTemplate.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedTemplate.controls.map(control => (
                    <span key={control} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                      {control}
                    </span>
                  ))}
                </div>
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: templateService.getTemplatePreview(selectedTemplate.id) }} />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowTemplatePreview(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowTemplatePreview(false);
                  handleCustomizeTemplate(selectedTemplate);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Customize Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Customization Modal */}
      {customizationTemplate && (
        <TemplateCustomizationModal
          template={customizationTemplate}
          isOpen={!!customizationTemplate}
          onClose={() => setCustomizationTemplate(null)}
          onSave={handleSaveCustomization}
          onExport={handleExportCustomization}
        />
      )}
    </div>
  );
};