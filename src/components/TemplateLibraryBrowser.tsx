import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Settings, 
  FileText, 
  Shield, 
  Users, 
  Calendar,
  Tag,
  Star,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Copy,
  CheckCircle
} from 'lucide-react';
import { TemplateContent } from '../data/templates';
import { templateService } from '../services/templateService';
import { logger } from '../utils/logger';
import { Breadcrumbs } from '../shared/components/layout/Breadcrumbs';

interface TemplateLibraryBrowserProps {
  onSelectTemplate?: (template: TemplateContent) => void;
  onCustomizeTemplate?: (template: TemplateContent) => void;
  onExportTemplate?: (template: TemplateContent, format: string) => void;
  selectedCategory?: string;
  className?: string;
}

export const TemplateLibraryBrowser: React.FC<TemplateLibraryBrowserProps> = ({
  onSelectTemplate,
  onCustomizeTemplate,
  onExportTemplate,
  selectedCategory,
  className = ''
}) => {
  const [templates, setTemplates] = useState<TemplateContent[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<TemplateContent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(selectedCategory || 'all');
  const [selectedComplexityFilter, setSelectedComplexityFilter] = useState('all');
  const [selectedAudienceFilter, setSelectedAudienceFilter] = useState('all');
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateContent | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [templates, searchTerm, selectedCategoryFilter, selectedComplexityFilter, selectedAudienceFilter]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const allTemplates = templateService.getAllContentTemplates();
      setTemplates(allTemplates);
    } catch (error) {
      logger.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...templates];

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchLower) ||
        template.description.toLowerCase().includes(searchLower) ||
        template.metadata.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        template.controls.some(control => control.toLowerCase().includes(searchLower))
      );
    }

    // Category filter
    if (selectedCategoryFilter !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategoryFilter);
    }

    // Complexity filter
    if (selectedComplexityFilter !== 'all') {
      filtered = filtered.filter(template => template.metadata.complexity === selectedComplexityFilter);
    }

    // Audience filter
    if (selectedAudienceFilter !== 'all') {
      filtered = filtered.filter(template => 
        template.metadata.targetAudience.includes(selectedAudienceFilter)
      );
    }

    setFilteredTemplates(filtered);
  };

  const handleTemplateSelect = (template: TemplateContent) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
    }
  };

  const handleTemplateCustomize = (template: TemplateContent) => {
    if (onCustomizeTemplate) {
      onCustomizeTemplate(template);
    }
  };

  const handleTemplateExport = async (template: TemplateContent, format: string) => {
    try {
      if (onExportTemplate) {
        onExportTemplate(template, format);
      } else {
        // Default export behavior
        const content = await templateService.exportContentTemplate(template.id, {}, format as any);
        downloadContent(content, `${template.name}.${format}`);
      }
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

  const toggleTemplateExpansion = (templateId: string) => {
    setExpandedTemplate(expandedTemplate === templateId ? null : templateId);
  };

  const showPreview = (template: TemplateContent) => {
    setPreviewTemplate(template);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'specialized': return <Shield className="w-4 h-4" />;
      case 'policy': return <FileText className="w-4 h-4" />;
      case 'scenario': return <Users className="w-4 h-4" />;
      case 'core': return <Settings className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const categories = ['all', 'specialized', 'policy', 'scenario', 'core'];
  const complexities = ['all', 'low', 'medium', 'high'];
  const audiences = ['all', 'CISO', 'Security Team', 'All Personnel', 'C3PAO Assessors', 'Project Managers'];

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading templates...</span>
      </div>
    );
  }

  return (
    <div className={`container-responsive section-padding ${className}`}>
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={[
          { label: 'CMMC 2.0 Platform', path: '/dashboard' },
          { label: 'Template Library', isActive: true }
        ]} />
      </div>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Template Library</h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Browse and use CMMC 2.0 compliance templates
                </p>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
              {filteredTemplates.length} of {templates.length} templates
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 space-y-4 mb-6">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="min-w-32">
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Complexity Filter */}
          <div className="min-w-32">
            <select
              value={selectedComplexityFilter}
              onChange={(e) => setSelectedComplexityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {complexities.map(complexity => (
                <option key={complexity} value={complexity}>
                  {complexity === 'all' ? 'All Complexity' : complexity.charAt(0).toUpperCase() + complexity.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Audience Filter */}
          <div className="min-w-40">
            <select
              value={selectedAudienceFilter}
              onChange={(e) => setSelectedAudienceFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {audiences.map(audience => (
                <option key={audience} value={audience}>
                  {audience === 'all' ? 'All Audiences' : audience}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            {/* Template Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(template.category)}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{template.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(template.metadata.complexity)}`}>
                        {template.metadata.complexity}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {template.metadata.estimatedPages || template.metadata.estimatedSlides || 'N/A'} pages
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleTemplateExpansion(template.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {expandedTemplate === template.id ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Template Description */}
            <div className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{template.description}</p>
              
              {/* Controls */}
              <div className="mb-3">
                <div className="text-xs font-medium text-gray-500 mb-1">CMMC Controls:</div>
                <div className="flex flex-wrap gap-1">
                  {template.controls.slice(0, 3).map(control => (
                    <span key={control} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {control}
                    </span>
                  ))}
                  {template.controls.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{template.controls.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {template.metadata.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Template Actions */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button
                    onClick={() => showPreview(template)}
                    className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={() => handleTemplateCustomize(template)}
                    className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Customize</span>
                  </button>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleTemplateExport(template, 'markdown')}
                    className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                    title="Export as Markdown"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleTemplateExport(template, 'html')}
                    className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                    title="Export as HTML"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedTemplate === template.id && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Audience:</div>
                    <div className="flex flex-wrap gap-1">
                      {template.metadata.targetAudience.map(audience => (
                        <span key={audience} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {audience}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">All CMMC Controls:</div>
                    <div className="flex flex-wrap gap-1">
                      {template.controls.map(control => (
                        <span key={control} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          {control}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleTemplateSelect(template)}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredTemplates.length === 0 && !loading && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No templates found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your search criteria or filters</p>
        </div>
      )}

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{previewTemplate.name}</h3>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="prose max-w-none dark:prose-invert">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                  {templateService.getTemplatePreview(previewTemplate.id)}
                </pre>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleTemplateCustomize(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Customize Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
