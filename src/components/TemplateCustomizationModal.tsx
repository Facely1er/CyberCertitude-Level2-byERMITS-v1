import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Download, 
  Eye, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  Settings,
  Building
} from 'lucide-react';
import { TemplateContent, FieldDefinition } from '../data/templates';
import { templateService } from '../services/templateService';
import { logger } from '../utils/logger';

interface TemplateCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: TemplateContent | null;
  initialData?: any;
  onSave?: (templateId: string, customizations: any) => void;
  onExport?: (templateId: string, customizations: any, format: string) => void;
}

export const TemplateCustomizationModal: React.FC<TemplateCustomizationModalProps> = ({
  isOpen,
  onClose,
  template,
  initialData = {},
  onSave,
  onExport
}) => {
  const [customizations, setCustomizations] = useState<any>({});
  const [preview, setPreview] = useState<string>('');
  const [validation, setValidation] = useState<{ valid: boolean; errors: string[] }>({ valid: true, errors: [] });
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && template) {
      initializeCustomizations();
    }
  }, [isOpen, template]);

  useEffect(() => {
    if (template && Object.keys(customizations).length > 0) {
      updatePreview();
      validateCustomizations();
    }
  }, [customizations, template]);

  const initializeCustomizations = () => {
    if (!template) return;

    // Auto-populate with initial data
    const autoPopulated = templateService.autoPopulateTemplateFields(template.id, initialData);
    
    // Merge with any existing customizations
    setCustomizations({ ...autoPopulated, ...initialData });
  };

  const updatePreview = () => {
    if (!template) return;

    try {
      const customizedContent = templateService.customizeContentTemplate(template.id, customizations);
      setPreview(customizedContent);
    } catch (error) {
      logger.error('Failed to update preview:', error);
      setPreview('Error generating preview');
    }
  };

  const validateCustomizations = () => {
    if (!template) return;

    const validation = templateService.validateContentTemplateCustomization(template.id, customizations);
    setValidation(validation);
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    setCustomizations((prev: any) => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSave = async () => {
    if (!template || !validation.valid) return;

    setSaving(true);
    try {
      if (onSave) {
        onSave(template.id, customizations);
      } else {
        // Default save behavior - store in localStorage
        const savedCustomizations = JSON.parse(localStorage.getItem('templateCustomizations') || '{}');
        savedCustomizations[template.id] = customizations;
        localStorage.setItem('templateCustomizations', JSON.stringify(savedCustomizations));
      }
      
      logger.info('Template customizations saved', { templateId: template.id });
    } catch (error) {
      logger.error('Failed to save customizations:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async (format: string) => {
    if (!template || !validation.valid) return;

    setLoading(true);
    try {
      if (onExport) {
        onExport(template.id, customizations, format);
      } else {
        // Default export behavior
        const content = await templateService.exportContentTemplate(template.id, customizations, format as any);
        downloadContent(content, `${template.name}.${format}`);
      }
    } catch (error) {
      logger.error('Failed to export template:', error);
    } finally {
      setLoading(false);
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

  const renderField = (fieldName: string, fieldDef: FieldDefinition) => {
    const value = customizations[fieldName] || '';

    switch (fieldDef.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            placeholder={fieldDef.placeholder}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark ${
              fieldDef.required && !value ? 'border-error-300 dark:border-error-700' : 'border-support-light dark:border-support-dark'
            }`}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            placeholder={fieldDef.placeholder}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark ${
              fieldDef.required && !value ? 'border-error-300 dark:border-error-700' : 'border-support-light dark:border-support-dark'
            }`}
          />
        );

      case 'email':
        return (
          <input
            type="email"
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            placeholder={fieldDef.placeholder}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark ${
              fieldDef.required && !value ? 'border-error-300 dark:border-error-700' : 'border-support-light dark:border-support-dark'
            }`}
          />
        );

      case 'tel':
        return (
          <input
            type="tel"
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            placeholder={fieldDef.placeholder}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark ${
              fieldDef.required && !value ? 'border-error-300 dark:border-error-700' : 'border-support-light dark:border-support-dark'
            }`}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            aria-label={fieldDef.placeholder || fieldName}
            title={fieldDef.placeholder || fieldName}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark ${
              fieldDef.required && !value ? 'border-error-300 dark:border-error-700' : 'border-support-light dark:border-support-dark'
            }`}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            placeholder={fieldDef.placeholder}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark ${
              fieldDef.required && !value ? 'border-error-300 dark:border-error-700' : 'border-support-light dark:border-support-dark'
            }`}
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            aria-label={fieldDef.placeholder || fieldName}
            title={fieldDef.placeholder || fieldName}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark ${
              fieldDef.required && !value ? 'border-error-300 dark:border-error-700' : 'border-support-light dark:border-support-dark'
            }`}
          >
            <option value="">Select an option</option>
            {fieldDef.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'file':
        return (
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleFieldChange(fieldName, file.name);
              }
            }}
            aria-label={fieldDef.placeholder || fieldName}
            title={fieldDef.placeholder || fieldName}
            className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark"
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            placeholder={fieldDef.placeholder}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark ${
              fieldDef.required && !value ? 'border-error-300 dark:border-error-700' : 'border-support-light dark:border-support-dark'
            }`}
          />
        );
    }
  };

  const renderFieldGroup = (title: string, fields: Record<string, FieldDefinition>, icon: React.ReactNode) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-support-light dark:border-support-dark">
          {icon}
          <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">{title}</h3>
        </div>
        <div className="space-y-4">
          {Object.entries(fields).map(([fieldName, fieldDef]) => (
            <div key={fieldName}>
              <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
                {fieldDef.placeholder}
                {fieldDef.required && <span className="text-error-500 ml-1">*</span>}
              </label>
              {renderField(fieldName, fieldDef)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!isOpen || !template) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-light dark:bg-surface-dark rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-support-light dark:border-support-dark">
          <div>
            <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">{template.name}</h2>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{template.description}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            title="Close modal"
            className="text-text-muted-light dark:text-text-muted-dark hover:text-text-secondary-light dark:hover:text-text-secondary-dark"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-support-light dark:border-support-dark">
          <button
            onClick={() => setActiveTab('form')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'form'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                : 'text-text-muted-light dark:text-text-muted-dark hover:text-text-primary-light dark:hover:text-text-primary-dark'
            }`}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Customize
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'preview'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                : 'text-text-muted-light dark:text-text-muted-dark hover:text-text-primary-light dark:hover:text-text-primary-dark'
            }`}
          >
            <Eye className="w-4 h-4 inline mr-2" />
            Preview
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'form' ? (
            <div className="p-6 space-y-6">
              {/* Validation Errors */}
              {!validation.valid && validation.errors.length > 0 && (
                <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-error-600 dark:text-error-400" />
                    <h4 className="text-sm font-medium text-error-800 dark:text-error-300">Please fix the following errors:</h4>
                  </div>
                  <ul className="text-sm text-error-700 dark:text-error-400 space-y-1">
                    {validation.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Company Information */}
              {template.interactiveFields.companyInfo && (
                renderFieldGroup(
                  'Company Information',
                  template.interactiveFields.companyInfo,
                  <Building className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                )
              )}

              {/* System Information */}
              {template.interactiveFields.systemInfo && (
                renderFieldGroup(
                  'System Information',
                  template.interactiveFields.systemInfo,
                  <Settings className="w-5 h-5 text-success-600 dark:text-success-400" />
                )
              )}

              {/* Custom Fields */}
              {template.interactiveFields.customFields && (
                renderFieldGroup(
                  'Additional Information',
                  template.interactiveFields.customFields,
                  <FileText className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                )
              )}

              {/* Template Metadata */}
              <div className="bg-support-light dark:bg-support-dark rounded-lg p-4">
                <h4 className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">Template Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Category:</span> {template.category}
                  </div>
                  <div>
                    <span className="font-medium">Complexity:</span> {template.metadata.complexity}
                  </div>
                  <div>
                    <span className="font-medium">Controls:</span> {template.controls.length}
                  </div>
                  <div>
                    <span className="font-medium">Pages:</span> {template.metadata.estimatedPages || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="bg-surface-light dark:bg-surface-dark border border-support-light dark:border-support-dark rounded-lg p-4 max-h-[60vh] overflow-y-auto">
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-text-primary-light dark:text-text-primary-dark font-mono">
                    {preview}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-support-light dark:border-support-dark bg-support-light dark:bg-support-dark">
          <div className="flex items-center space-x-2">
            {validation.valid ? (
              <CheckCircle className="w-5 h-5 text-success-600 dark:text-success-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-error-600 dark:text-error-400" />
            )}
            <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              {validation.valid ? 'Ready to export' : `${validation.errors.length} validation errors`}
            </span>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
            >
              Cancel
            </button>
            
            <button
              onClick={handleSave}
              disabled={saving || !validation.valid}
              className="px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors duration-200"
            >
              {saving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{saving ? 'Saving...' : 'Save'}</span>
            </button>

            <div className="flex space-x-1">
              <button
                onClick={() => handleExport('markdown')}
                disabled={loading || !validation.valid}
                className="px-3 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 transition-colors duration-200"
              >
                <Download className="w-4 h-4" />
                <span>MD</span>
              </button>
              
              <button
                onClick={() => handleExport('html')}
                disabled={loading || !validation.valid}
                className="px-3 py-2 bg-success-600 dark:bg-success-500 text-white rounded-lg hover:bg-success-700 dark:hover:bg-success-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 transition-colors duration-200"
              >
                <Download className="w-4 h-4" />
                <span>HTML</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
