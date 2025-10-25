import React, { useState, useEffect } from 'react';
import { X, Save, Download, Star, Eye, Edit3, Trash2, Plus, Search, Filter, FileText, Settings } from 'lucide-react';
import { AssessmentTemplate } from '../shared/types/documentation';
import { templateService, TemplateCreateData } from '../services/templateService';
import { TemplateContent } from '../data/templates';
import { TemplateLibraryBrowser } from './TemplateLibraryBrowser';
import { TemplateCustomizationModal } from './TemplateCustomizationModal';
import { logger } from '../utils/logger';

interface TemplateManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: AssessmentTemplate) => void;
  onSelectContentTemplate?: (template: TemplateContent) => void;
  frameworkId?: string;
}

export const TemplateManagementModal: React.FC<TemplateManagementModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  onSelectContentTemplate,
  frameworkId
}) => {
  const [templates, setTemplates] = useState<AssessmentTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<AssessmentTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'assessment' | 'content'>('assessment');
  const [customizationTemplate, setCustomizationTemplate] = useState<TemplateContent | null>(null);

  // Load templates on mount
  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen, frameworkId]);

  // Filter templates when search or filters change
  useEffect(() => {
    let filtered = templates;

    if (frameworkId) {
      filtered = filtered.filter(t => t.frameworkId === frameworkId);
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(searchLower) ||
        t.description.toLowerCase().includes(searchLower) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (selectedIndustry) {
      filtered = filtered.filter(t => t.industry === selectedIndustry);
    }

    if (selectedSize) {
      filtered = filtered.filter(t => t.organizationSize?.includes(selectedSize));
    }

    setFilteredTemplates(filtered);
  }, [templates, searchTerm, selectedIndustry, selectedSize, frameworkId]);

  const loadTemplates = () => {
    setLoading(true);
    try {
      const allTemplates = templateService.getAllTemplates();
      setTemplates(allTemplates);
    } catch (error) {
      logger.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = (template: AssessmentTemplate) => {
    templateService.incrementDownloadCount(template.id);
    onSelectTemplate(template);
    onClose();
  };

  const handleCreateTemplate = (templateData: TemplateCreateData) => {
    try {
      const newTemplate = templateService.createTemplate(templateData);
      setTemplates(prev => [...prev, newTemplate]);
      setShowCreateForm(false);
    } catch (error) {
      logger.error('Failed to create template:', error);
    }
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        templateService.deleteTemplate(templateId);
        setTemplates(prev => prev.filter(t => t.id !== templateId));
      } catch (error) {
        logger.error('Failed to delete template:', error);
      }
    }
  };

  const handleContentTemplateSelect = (template: TemplateContent) => {
    if (onSelectContentTemplate) {
      onSelectContentTemplate(template);
    }
    onClose();
  };

  const handleContentTemplateCustomize = (template: TemplateContent) => {
    setCustomizationTemplate(template);
  };

  const handleContentTemplateExport = async (template: TemplateContent, format: string) => {
    try {
      const content = await templateService.exportContentTemplate(template.id, {}, format as any);
      downloadContent(content, `${template.name}.${format}`);
    } catch (error) {
      logger.error('Failed to export template:', error);
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

  const handleSaveCustomization = (templateId: string, customizations: any) => {
    logger.info('Template customizations saved', { templateId, customizationsCount: Object.keys(customizations).length });
    setCustomizationTemplate(null);
  };

  const handleExportCustomization = async (templateId: string, customizations: any, format: string) => {
    try {
      const content = await templateService.exportContentTemplate(templateId, customizations, format as any);
      const template = templateService.getContentTemplate(templateId);
      downloadContent(content, `${template?.name || 'template'}.${format}`);
    } catch (error) {
      logger.error('Failed to export customized template:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Template Management</h2>
            <p className="text-gray-600">Select or create assessment templates</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('assessment')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'assessment'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Assessment Templates
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'content'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Content Templates
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'assessment' ? (
            <div className="p-6">
              {/* Search and Filters */}
              <div className="mb-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search templates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Industries</option>
                    <option value="military">Military</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance</option>
                    <option value="government">Government</option>
                    <option value="education">Education</option>
                  </select>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Sizes</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Template</span>
                  </button>
                </div>
              </div>

              {/* Assessment Templates Grid */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {template.name}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">
                            {template.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {template.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {template.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {template.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{template.tags.length - 3}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>{template.industry}</span>
                        <span>{template.downloadCount} downloads</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleSelectTemplate(template)}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Download className="w-4 h-4" />
                          <span>Use Template</span>
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredTemplates.length === 0 && !loading && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <FileText className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No templates found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search criteria or create a new template.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <TemplateLibraryBrowser
              onSelectTemplate={handleContentTemplateSelect}
              onCustomizeTemplate={handleContentTemplateCustomize}
              onExportTemplate={handleContentTemplateExport}
            />
          )}
        </div>
      </div>

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