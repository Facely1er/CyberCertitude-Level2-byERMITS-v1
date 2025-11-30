import React, { useState } from 'react';
import { Settings, Plus, CreditCard as Edit, Trash2, Save, Download, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Shield } from 'lucide-react';
import { Breadcrumbs } from '../../../shared/components/layout/Breadcrumbs';

interface ConfigurationBaselineGeneratorProps {
  onSave?: (baseline: any) => void;
  onExport?: (baseline: any) => void;
}

interface BaselineItem {
  id: string;
  category: string;
  title: string;
  description: string;
  setting: string;
  value: string;
  required: boolean;
  severity: 'critical' | 'high' | 'medium' | 'low';
  cmmcPractice: string;
  implementation: string;
  verification: string;
  notes: string;
  order: number;
}

const SYSTEM_TYPES = [
  'Windows Server', 'Windows Workstation', 'Linux Server', 'Linux Workstation',
  'Network Device', 'Security Appliance', 'Database Server', 'Web Server',
  'Application Server', 'Cloud Instance'
] as const;

const BASELINE_CATEGORIES = [
  'Authentication', 'Authorization', 'Encryption', 'Logging', 'Network Security',
  'System Hardening', 'Patch Management', 'Backup and Recovery', 'Monitoring', 'Compliance'
] as const;

const CMMC_PRACTICES = [
  'AC.1.001', 'AC.1.002', 'AC.2.001', 'AC.2.002', 'AC.2.003',
  'AT.1.001', 'AT.1.002', 'AT.2.001', 'AT.2.002', 'AT.2.003',
  'AU.1.001', 'AU.1.002', 'AU.2.001', 'AU.2.002', 'AU.2.003',
  'CA.1.001', 'CA.1.002', 'CA.2.001', 'CA.2.002', 'CA.2.003',
  'CM.1.001', 'CM.1.002', 'CM.2.001', 'CM.2.002', 'CM.2.003'
];

const ConfigurationBaselineGenerator: React.FC<ConfigurationBaselineGeneratorProps> = ({
  onSave,
  onExport
}) => {
  const [baseline, setBaseline] = useState({
    id: '',
    title: '',
    description: '',
    systemType: 'Windows Server' as const,
    platform: '',
    version: '',
    baselineItems: [] as BaselineItem[],
    createdDate: new Date(),
    lastUpdated: new Date(),
    status: 'draft' as const,
    author: '',
    organizationId: '',
    tags: [] as string[]
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [newItem, setNewItem] = useState<Partial<BaselineItem>>({
    category: 'System Hardening',
    title: '',
    description: '',
    setting: '',
    value: '',
    required: true,
    severity: 'medium',
    cmmcPractice: '',
    implementation: '',
    verification: '',
    notes: '',
    order: 0
  });

  const [newTag, setNewTag] = useState('');

  const filteredItems = baseline.baselineItems.filter(item => {
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.setting.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const addBaselineItem = () => {
    if (!newItem.title || !newItem.description || !newItem.setting || !newItem.value) {
      return;
    }

    const item: BaselineItem = {
      id: Date.now().toString(),
      category: newItem.category!,
      title: newItem.title!,
      description: newItem.description!,
      setting: newItem.setting!,
      value: newItem.value!,
      required: newItem.required!,
      severity: newItem.severity!,
      cmmcPractice: newItem.cmmcPractice!,
      implementation: newItem.implementation || '',
      verification: newItem.verification || '',
      notes: newItem.notes || '',
      order: baseline.baselineItems.length + 1
    };

    setBaseline(prev => ({
      ...prev,
      baselineItems: [...prev.baselineItems, item],
      lastUpdated: new Date()
    }));

    setNewItem({
      category: 'System Hardening',
      title: '',
      description: '',
      setting: '',
      value: '',
      required: true,
      severity: 'medium',
      cmmcPractice: '',
      implementation: '',
      verification: '',
      notes: '',
      order: 0
    });
    setShowAddForm(false);
  };

  const updateBaselineItem = (id: string, updates: Partial<BaselineItem>) => {
    setBaseline(prev => ({
      ...prev,
      baselineItems: prev.baselineItems.map(item =>
        item.id === id ? { ...item, ...updates } : item
      ),
      lastUpdated: new Date()
    }));
    setEditingItem(null);
  };

  const deleteBaselineItem = (id: string) => {
    setBaseline(prev => ({
      ...prev,
      baselineItems: prev.baselineItems.filter(item => item.id !== id),
      lastUpdated: new Date()
    }));
  };

  const addTag = () => {
    if (newTag.trim()) {
      setBaseline(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setBaseline(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-error-600 bg-error-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-success-600 bg-success-100';
      default: return 'text-text-secondary-light bg-support-light';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Authentication': return <Shield className="w-4 h-4 text-primary-500" />;
      case 'Encryption': return <Settings className="w-4 h-4 text-success-500" />;
      case 'Logging': return <CheckCircle className="w-4 h-4 text-purple-500" />;
      case 'Network Security': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default: return <Settings className="w-4 h-4 text-text-muted-light" />;
    }
  };

  const breadcrumbs = [
    { label: 'Technical Tools', path: '/config-baselines' },
    { label: 'Configuration Baseline Generator', isActive: true }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-support-light dark:border-support-dark">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark flex items-center gap-2">
                <Settings className="w-6 h-6 text-primary-600" />
                Configuration Baseline Generator
              </h1>
              <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
                Generate secure configuration baselines for CMMC compliance
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onSave?.(baseline)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Baseline
              </button>
              <button
                onClick={() => onExport?.(baseline)}
                className="flex items-center gap-2 px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Baseline Details */}
        <div className="p-6 border-b border-support-light dark:border-support-dark">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                Baseline Title
              </label>
              <input
                type="text"
                value={baseline.title}
                onChange={(e) => setBaseline(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                placeholder="Enter baseline title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                System Type
              </label>
              <select
                value={baseline.systemType}
                onChange={(e) => setBaseline(prev => ({ ...prev, systemType: e.target.value as any }))}
                className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
              >
                {SYSTEM_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                Platform
              </label>
              <input
                type="text"
                value={baseline.platform}
                onChange={(e) => setBaseline(prev => ({ ...prev, platform: e.target.value }))}
                className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                placeholder="e.g., Windows Server 2019, Ubuntu 20.04"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                Version
              </label>
              <input
                type="text"
                value={baseline.version}
                onChange={(e) => setBaseline(prev => ({ ...prev, version: e.target.value }))}
                className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                placeholder="e.g., 1.0"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                Description
              </label>
              <textarea
                value={baseline.description}
                onChange={(e) => setBaseline(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                placeholder="Enter baseline description"
              />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="p-6 border-b border-support-light dark:border-support-dark">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                placeholder="Search baseline items..."
              />
            </div>
            <div className="flex gap-4">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
              >
                <option value="all">All Categories</option>
                {BASELINE_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>
          </div>
        </div>

        {/* Baseline Items */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
            Baseline Items ({filteredItems.length})
          </h2>

          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-text-muted-light dark:text-text-muted-dark">
              No baseline items found. Click "Add Item" to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div key={item.id} className="border border-support-light dark:border-support-dark rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getCategoryIcon(item.category)}
                        <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                          {item.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(item.severity)}`}>
                          {item.severity.toUpperCase()}
                        </span>
                        {item.required && (
                          <span className="px-2 py-1 bg-error-100 dark:bg-error-900 text-error-800 dark:text-error-200 text-xs rounded-full">
                            REQUIRED
                          </span>
                        )}
                      </div>
                      <p className="text-text-secondary-light dark:text-text-secondary-dark mb-2">
                        {item.description}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-text-muted-light dark:text-text-muted-dark">
                        <div>
                          <span className="font-medium">Setting:</span> {item.setting}
                        </div>
                        <div>
                          <span className="font-medium">Value:</span> {item.value}
                        </div>
                        <div>
                          <span className="font-medium">CMMC Practice:</span> {item.cmmcPractice}
                        </div>
                        <div>
                          <span className="font-medium">Order:</span> {item.order}
                        </div>
                      </div>
                      {item.implementation && (
                        <div className="mt-2">
                          <span className="text-sm font-medium text-text-primary-light dark:text-text-secondary-dark">Implementation:</span>
                          <p className="text-sm text-text-secondary-light dark:text-text-muted-dark mt-1">{item.implementation}</p>
                        </div>
                      )}
                      {item.verification && (
                        <div className="mt-2">
                          <span className="text-sm font-medium text-text-primary-light dark:text-text-secondary-dark">Verification:</span>
                          <p className="text-sm text-text-secondary-light dark:text-text-muted-dark mt-1">{item.verification}</p>
                        </div>
                      )}
                      {item.notes && (
                        <div className="mt-2">
                          <span className="text-sm font-medium text-text-primary-light dark:text-text-secondary-dark">Notes:</span>
                          <p className="text-sm text-text-secondary-light dark:text-text-muted-dark mt-1">{item.notes}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingItem(item.id)}
                        className="p-2 text-text-muted-light hover:text-primary-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteBaselineItem(item.id)}
                        className="p-2 text-text-muted-light hover:text-error-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Item Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-support-light dark:border-support-dark">
                <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                  Add Baseline Item
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={newItem.title}
                      onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                      Category
                    </label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                    >
                      {BASELINE_CATEGORIES.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                    Description *
                  </label>
                  <textarea
                    value={newItem.description}
                    onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                      Setting *
                    </label>
                    <input
                      type="text"
                      value={newItem.setting}
                      onChange={(e) => setNewItem(prev => ({ ...prev, setting: e.target.value }))}
                      className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                      Value *
                    </label>
                    <input
                      type="text"
                      value={newItem.value}
                      onChange={(e) => setNewItem(prev => ({ ...prev, value: e.target.value }))}
                      className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                      Severity
                    </label>
                    <select
                      value={newItem.severity}
                      onChange={(e) => setNewItem(prev => ({ ...prev, severity: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                    >
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                      CMMC Practice
                    </label>
                    <select
                      value={newItem.cmmcPractice}
                      onChange={(e) => setNewItem(prev => ({ ...prev, cmmcPractice: e.target.value }))}
                      className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                    >
                      <option value="">Select Practice</option>
                      {CMMC_PRACTICES.map(practice => (
                        <option key={practice} value={practice}>{practice}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newItem.required}
                        onChange={(e) => setNewItem(prev => ({ ...prev, required: e.target.checked }))}
                        className="rounded border-support-light text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-text-primary-light dark:text-text-secondary-dark">Required</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                    Implementation
                  </label>
                  <textarea
                    value={newItem.implementation}
                    onChange={(e) => setNewItem(prev => ({ ...prev, implementation: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                    Verification
                  </label>
                  <textarea
                    value={newItem.verification}
                    onChange={(e) => setNewItem(prev => ({ ...prev, verification: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                    Notes
                  </label>
                  <textarea
                    value={newItem.notes}
                    onChange={(e) => setNewItem(prev => ({ ...prev, notes: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-support-light dark:border-support-dark flex justify-end gap-3">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addBaselineItem}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigurationBaselineGenerator;