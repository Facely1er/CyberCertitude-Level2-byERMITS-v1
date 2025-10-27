import React, { useState, useMemo } from 'react';
import { FileText, Download, Eye, Search, BookOpen } from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  controls: number;
  lastUpdated: Date;
  downloads: number;
  framework: string;
}

const PolicyTemplates: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const templates: Template[] = [
    {
      id: '1',
      name: 'Access Control Policy',
      category: 'Security',
      description: 'Comprehensive access control policy aligned with NIST SP 800-171 and CMMC 2.0',
      controls: 13,
      lastUpdated: new Date('2024-01-15'),
      downloads: 245,
      framework: 'CMMC Level 2'
    },
    {
      id: '2',
      name: 'Incident Response Policy',
      category: 'Operations',
      description: 'Incident response procedures and escalation workflows',
      controls: 6,
      lastUpdated: new Date('2024-01-10'),
      downloads: 189,
      framework: 'CMMC Level 2'
    },
    {
      id: '3',
      name: 'Acceptable Use Policy',
      category: 'User Management',
      description: 'User responsibilities and acceptable use guidelines',
      controls: 3,
      lastUpdated: new Date('2024-01-12'),
      downloads: 312,
      framework: 'CMMC Level 2'
    },
    {
      id: '4',
      name: 'Data Classification Policy',
      category: 'Data Protection',
      description: 'Data classification schema and handling procedures',
      controls: 8,
      lastUpdated: new Date('2024-01-08'),
      downloads: 278,
      framework: 'CMMC Level 2'
    },
    {
      id: '5',
      name: 'Configuration Management Policy',
      category: 'Configuration',
      description: 'System configuration management and change control procedures',
      controls: 11,
      lastUpdated: new Date('2024-01-05'),
      downloads: 156,
      framework: 'CMMC Level 2'
    },
    {
      id: '6',
      name: 'Security Assessment Policy',
      category: 'Assessment',
      description: 'Security assessment and authorization procedures',
      controls: 5,
      lastUpdated: new Date('2024-01-20'),
      downloads: 203,
      framework: 'CMMC Level 2'
    }
  ];

  // Memoized filtered templates for performance
  const filteredTemplates = useMemo(() => {
    if (!templates || templates.length === 0) return [];
    
    return templates.filter(t => {
      // Safety checks for template properties
      if (!t || !t.name || !t.description || !t.category) return false;
      
      // React automatically escapes user input for XSS protection
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = t.name.toLowerCase().includes(searchLower) ||
                            t.description.toLowerCase().includes(searchLower);
      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [templates, searchTerm, selectedCategory]);

  const breadcrumbs = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Implementation', path: '/implementation/overview' },
    { label: 'Policy Templates', isActive: true }
  ];

  return (
    <div className="container-responsive section-padding">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Policy Templates</h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Pre-formatted policies aligned with NIST SP 800-171 and CMMC 2.0
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search policy templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Categories</option>
              <option value="Security">Security</option>
              <option value="Operations">Operations</option>
              <option value="User Management">User Management</option>
              <option value="Data Protection">Data Protection</option>
              <option value="Configuration">Configuration</option>
              <option value="Assessment">Assessment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-medium">
                  {template.framework || 'CMMC 2.0'}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{template.name || 'Unnamed Template'}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{template.description || 'No description available'}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{template.controls} controls</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Download className="w-4 h-4" />
                    <span>{template.downloads}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>
                <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
          <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No templates found</h3>
          <p className="text-gray-600 dark:text-gray-300">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default PolicyTemplates;

