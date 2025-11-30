import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TemplateCustomizationModal } from '../components/TemplateCustomizationModal';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
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
        <LoadingSpinner size="lg" message="Loading template..." />
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
        <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
          Template Customization
        </h2>
        <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
          Template customization functionality will be available here.
        </p>
        <button
          onClick={() => setShowCustomizationModal(true)}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Open Customization Modal
        </button>
      </div>
    </>
  );
};
