import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TemplateCustomizationModal } from '../components/TemplateCustomizationModal';
import { logger } from '@/utils/logger';

export const TemplateCustomizationRoute: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const [template, setTemplate] = useState<any>(null);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);

  useEffect(() => {
    if (templateId) {
      // Load template data
      // This would integrate with templateService
      setTemplate({ id: templateId, name: 'Template', description: 'Template description' });
    }
  }, [templateId]);

  const handleSaveCustomization = (templateId: string, customizations: any) => {
    logger.info('Template customizations saved', { templateId, customizationsCount: Object.keys(customizations).length });
  };

  const handleExportCustomization = async (templateId: string, customizations: any, format: string) => {
    try {
      logger.info('Exporting customized template', { templateId, format, customizationsCount: Object.keys(customizations).length });
      // Export logic would be handled here
    } catch (error) {
      logger.error('Failed to export customized template:', error);
    }
  };

  if (!template) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <TemplateCustomizationModal
        template={template}
        isOpen={showCustomizationModal}
        onClose={() => setShowCustomizationModal(false)}
        onSave={handleSaveCustomization}
        onExport={handleExportCustomization}
      />
      
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Template Customization
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Template customization functionality will be available here.
        </p>
        <button
          onClick={() => setShowCustomizationModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Open Customization Modal
        </button>
      </div>
    </>
  );
};
