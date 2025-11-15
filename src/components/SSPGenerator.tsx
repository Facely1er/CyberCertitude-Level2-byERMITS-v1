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
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
                <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Document Generator</h1>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  Generate SSP, POAM, and RACI Matrix from your CMMC assessment
                </p>
              </div>
            </div>
            
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-white transition-colors"
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
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-lg border border-support-light dark:border-support-dark">
            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">Select Assessment</h3>
            {savedAssessments.length === 0 ? (
              <div className="text-center py-8">
                <Database className="w-12 h-12 text-text-muted-dark mx-auto mb-4" />
                <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">No assessments found</p>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
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
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-support-light dark:border-support-dark hover:border-support-light dark:hover:border-support-dark'
                    }`}
                    onClick={() => setSelectedAssessment(assessment)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-text-primary-light dark:text-text-primary-dark">{assessment.name}</h4>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          {assessment.framework} • {new Date(assessment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <CheckCircle className={`w-5 h-5 ${
                        selectedAssessment?.id === assessment.id ? 'text-primary-500' : 'text-text-muted-dark'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Organization Information */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-lg border border-support-light dark:border-support-dark">
            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">Organization Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                  Organization Name *
                </label>
                <input
                  type="text"
                  value={organizationInfo.name}
                  onChange={(e) => setOrganizationInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                  placeholder="Enter organization name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                  System Name *
                </label>
                <input
                  type="text"
                  value={organizationInfo.systemName}
                  onChange={(e) => setOrganizationInfo(prev => ({ ...prev, systemName: e.target.value }))}
                  className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                  placeholder="Enter system name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                  System Description
                </label>
                <textarea
                  value={organizationInfo.systemDescription}
                  onChange={(e) => setOrganizationInfo(prev => ({ ...prev, systemDescription: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                  placeholder="Describe the system and its purpose"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                  Contact Information
                </label>
                <input
                  type="text"
                  value={organizationInfo.contact}
                  onChange={(e) => setOrganizationInfo(prev => ({ ...prev, contact: e.target.value }))}
                  className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                  placeholder="Enter contact information"
                />
              </div>
            </div>
          </div>

          {/* Template Options */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-lg border border-support-light dark:border-support-dark">
            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">SSP Generation Options</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="traditional"
                  name="generationMethod"
                  checked={!useTemplate}
                  onChange={() => setUseTemplate(false)}
                  className="w-4 h-4 text-primary-600"
                />
                <label htmlFor="traditional" className="text-sm font-medium text-text-primary-light dark:text-text-secondary-dark">
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
                  className="w-4 h-4 text-primary-600"
                />
                <label htmlFor="template" className="text-sm font-medium text-text-primary-light dark:text-text-secondary-dark">
                  Use Complete SSP Template
                </label>
              </div>
              
              {useTemplate && (
                <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-primary-900 dark:text-primary-100">SSP Template</h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowTemplatePreview(true)}
                        className="px-3 py-1 text-xs bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-200 rounded hover:bg-primary-200 dark:hover:bg-primary-700 transition-colors flex items-center space-x-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Preview</span>
                      </button>
                      <button
                        onClick={() => handleCustomizeTemplate(selectedTemplate!)}
                        disabled={!selectedTemplate}
                        className="px-3 py-1 text-xs bg-success-100 dark:bg-success-800 text-success-700 dark:text-success-200 rounded hover:bg-success-200 dark:hover:bg-success-700 transition-colors flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Settings className="w-3 h-3" />
                        <span>Customize</span>
                      </button>
                    </div>
                  </div>
                  
                  {selectedTemplate ? (
                    <div className="text-sm text-primary-800 dark:text-primary-200">
                      <p><strong>Selected:</strong> {selectedTemplate.name}</p>
                      <p className="text-xs mt-1">{selectedTemplate.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedTemplate.controls.slice(0, 3).map(control => (
                          <span key={control} className="px-2 py-1 bg-primary-200 dark:bg-primary-700 text-primary-800 dark:text-primary-100 text-xs rounded">
                            {control}
                          </span>
                        ))}
                        {selectedTemplate.controls.length > 3 && (
                          <span className="px-2 py-1 bg-support-light dark:bg-primary-600 text-text-secondary-light dark:text-text-secondary-dark text-xs rounded">
                            +{selectedTemplate.controls.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-primary-800 dark:text-primary-200">
                      <p>No template selected. Click "Browse Templates" to choose a complete SSP template.</p>
                      <button
                        onClick={() => {
                          const sspTemplate = templateService.getContentTemplate('ssp-complete');
                          if (sspTemplate) {
                            setSelectedTemplate(sspTemplate);
                          }
                        }}
                        className="mt-2 px-3 py-1 bg-primary-600 text-white text-xs rounded hover:bg-primary-700 transition-colors flex items-center space-x-1"
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
            className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:bg-support-light disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
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
              <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-lg border border-support-light dark:border-support-dark">
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
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : available
                          ? 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-support-light dark:hover:bg-surface-dark'
                          : 'text-text-muted-dark dark:text-text-secondary-light cursor-not-allowed'
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
                      <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
                        System Security Plan
                      </h3>
                      <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
                        Generated on {generatedSSP.generatedDate.toLocaleDateString()} for {generatedSSP.organization}
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleExport('ssp', 'html')}
                          className="flex items-center space-x-2 bg-success-600 text-white px-4 py-2 rounded-lg hover:bg-success-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>Export HTML</span>
                        </button>
                        <button
                          onClick={() => handleExport('ssp', 'pdf')}
                          className="flex items-center space-x-2 bg-error-600 text-white px-4 py-2 rounded-lg hover:bg-error-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>Export PDF</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'poam' && generatedPOAM && (
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
                        Plan of Actions and Milestones
                      </h3>
                      <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
                        {generatedPOAM.summary.totalMilestones} milestones • 
                        ${generatedPOAM.summary.estimatedTotalCost.toLocaleString()} estimated cost
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleExport('poam', 'html')}
                          className="flex items-center space-x-2 bg-success-600 text-white px-4 py-2 rounded-lg hover:bg-success-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>Export HTML</span>
                        </button>
                        <button
                          onClick={() => handleExport('poam', 'pdf')}
                          className="flex items-center space-x-2 bg-error-600 text-white px-4 py-2 rounded-lg hover:bg-error-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>Export PDF</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'raci' && generatedRACI && (
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
                        RACI Matrix
                      </h3>
                      <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
                        {generatedRACI.summary.totalRoles} roles • {generatedRACI.summary.totalControls} controls
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleExport('raci', 'html')}
                          className="flex items-center space-x-2 bg-success-600 text-white px-4 py-2 rounded-lg hover:bg-success-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>Export HTML</span>
                        </button>
                        <button
                          onClick={() => handleExport('raci', 'pdf')}
                          className="flex items-center space-x-2 bg-error-600 text-white px-4 py-2 rounded-lg hover:bg-error-700 transition-colors"
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
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-8 shadow-lg border border-support-light dark:border-support-dark text-center">
              <FileText className="w-16 h-16 text-text-muted-dark mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
                No Documents Generated
              </h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                Select an assessment and fill in organization information, then click "Generate Documents" to create your SSP, POAM, and RACI Matrix.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Template Preview Modal */}
      {showTemplatePreview && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-support-light dark:border-support-dark">
              <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Template Preview</h2>
              <button
                onClick={() => setShowTemplatePreview(false)}
                className="text-text-muted-dark hover:text-text-secondary-light dark:hover:text-text-secondary-dark"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">{selectedTemplate.name}</h3>
                <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">{selectedTemplate.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedTemplate.controls.map(control => (
                    <span key={control} className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs rounded">
                      {control}
                    </span>
                  ))}
                </div>
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: templateService.getTemplatePreview(selectedTemplate.id) }} />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-support-light dark:border-support-dark">
              <button
                onClick={() => setShowTemplatePreview(false)}
                className="px-4 py-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-white transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowTemplatePreview(false);
                  handleCustomizeTemplate(selectedTemplate);
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
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