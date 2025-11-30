import React, { useState, useEffect } from 'react';
import { SquareCheck as CheckSquare, Plus, CreditCard as Edit, Trash2, Save, Download, Eye, Target, FileText, Shield, Circle as XCircle } from 'lucide-react';
import { AuditChecklist, AuditSection, AuditItem, AuditCategory } from '../types';
import { Breadcrumbs } from '../../../shared/components/layout/Breadcrumbs';
import { useInternalLinking } from '../../../shared/hooks/useInternalLinking';

interface AuditChecklistGeneratorProps {
  onSave?: (checklist: AuditChecklist) => void;
  onExport?: (checklist: AuditChecklist) => void;
  initialChecklist?: AuditChecklist;
}

const AUDIT_CATEGORIES: AuditCategory[] = [
  'Access Control', 'Awareness and Training', 'Audit and Accountability',
  'Configuration Management', 'Identification and Authentication', 'Incident Response',
  'Maintenance', 'Media Protection', 'Personnel Security', 'Physical Protection',
  'Recovery', 'Risk Assessment', 'Security Assessment', 'System and Communications Protection',
  'System and Information Integrity'
];

const FRAMEWORKS = ['CMMC', 'NIST', 'ISO', 'Custom'] as const;
const LEVELS = ['Level 1', 'Level 2', 'Level 3', 'All Levels'] as const;

const CMMC_PRACTICES = [
  'AC.1.001', 'AC.1.002', 'AC.2.001', 'AC.2.002', 'AC.2.003',
  'AT.1.001', 'AT.1.002', 'AT.2.001', 'AT.2.002', 'AT.2.003',
  'AU.1.001', 'AU.1.002', 'AU.2.001', 'AU.2.002', 'AU.2.003',
  'CA.1.001', 'CA.1.002', 'CA.2.001', 'CA.2.002', 'CA.2.003',
  'CM.1.001', 'CM.1.002', 'CM.2.001', 'CM.2.002', 'CM.2.003'
];

const AuditChecklistGenerator: React.FC<AuditChecklistGeneratorProps> = ({
  onSave,
  onExport,
  initialChecklist
}) => {
  const { breadcrumbs } = useInternalLinking();
  const [checklist, setChecklist] = useState<AuditChecklist>(
    initialChecklist || {
      id: '',
      title: '',
      description: '',
      framework: 'CMMC',
      level: 'Level 2',
      category: 'Access Control',
      sections: [],
      createdDate: new Date(),
      lastUpdated: new Date(),
      status: 'draft',
      version: '1.0',
      author: '',
      tags: []
    }
  );

  const [activeTab, setActiveTab] = useState<'overview' | 'sections' | 'items' | 'settings'>('overview');
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const [newSection, setNewSection] = useState<Partial<AuditSection>>({
    title: '',
    description: '',
    items: [],
    order: 0,
    weight: 0
  });

  const [newItem, setNewItem] = useState<Partial<AuditItem>>({
    question: '',
    description: '',
    category: 'Access Control',
    cmmcPractice: '',
    evidenceRequired: [],
    assessmentCriteria: [],
    weight: 1,
    order: 0,
    sectionId: ''
  });

  const [newEvidence, setNewEvidence] = useState('');
  const [newCriteria, setNewCriteria] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    calculateTotalWeight();
  }, [checklist.sections]);

  const calculateTotalWeight = () => {
    const totalWeight = checklist.sections.reduce((sum, section) => sum + section.weight, 0);
    if (totalWeight !== 100) {
      // Auto-adjust weights if they don't sum to 100
      const adjustedSections = checklist.sections.map(section => ({
        ...section,
        weight: totalWeight > 0 ? Math.round((section.weight / totalWeight) * 100) : Math.round(100 / checklist.sections.length)
      }));
      setChecklist(prev => ({ ...prev, sections: adjustedSections }));
    }
  };

  const addSection = () => {
    if (!newSection.title || !newSection.description) return;

    const section: AuditSection = {
      id: Date.now().toString(),
      title: newSection.title!,
      description: newSection.description!,
      items: [],
      order: checklist.sections.length + 1,
      weight: newSection.weight || 0
    };

    setChecklist(prev => ({
      ...prev,
      sections: [...prev.sections, section],
      lastUpdated: new Date()
    }));

    setNewSection({
      title: '',
      description: '',
      items: [],
      order: 0,
      weight: 0
    });
    setShowSectionForm(false);
  };

  const updateSection = (sectionId: string, updates: Partial<AuditSection>) => {
    setChecklist(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      ),
      lastUpdated: new Date()
    }));
    setEditingSection(null);
  };

  const deleteSection = (sectionId: string) => {
    setChecklist(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId),
      lastUpdated: new Date()
    }));
  };

  const addItem = () => {
    if (!newItem.question || !newItem.description || !selectedSection) return;

    const item: AuditItem = {
      id: Date.now().toString(),
      question: newItem.question!,
      description: newItem.description!,
      category: newItem.category!,
      cmmcPractice: newItem.cmmcPractice!,
      evidenceRequired: newItem.evidenceRequired || [],
      assessmentCriteria: newItem.assessmentCriteria || [],
      weight: newItem.weight!,
      order: checklist.sections.find(s => s.id === selectedSection)?.items.length || 0,
      sectionId: selectedSection
    };

    setChecklist(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === selectedSection
          ? { ...section, items: [...section.items, item] }
          : section
      ),
      lastUpdated: new Date()
    }));

    setNewItem({
      question: '',
      description: '',
      category: 'Access Control',
      cmmcPractice: '',
      evidenceRequired: [],
      assessmentCriteria: [],
      weight: 1,
      order: 0,
      sectionId: ''
    });
    setShowItemForm(false);
  };

  const updateItem = (itemId: string, updates: Partial<AuditItem>) => {
    setChecklist(prev => ({
      ...prev,
      sections: prev.sections.map(section => ({
        ...section,
        items: section.items.map(item =>
          item.id === itemId ? { ...item, ...updates } : item
        )
      })),
      lastUpdated: new Date()
    }));
    setEditingItem(null);
  };

  const deleteItem = (itemId: string) => {
    setChecklist(prev => ({
      ...prev,
      sections: prev.sections.map(section => ({
        ...section,
        items: section.items.filter(item => item.id !== itemId)
      })),
      lastUpdated: new Date()
    }));
  };

  const addEvidence = () => {
    if (newEvidence.trim()) {
      setNewItem(prev => ({
        ...prev,
        evidenceRequired: [...(prev.evidenceRequired || []), newEvidence.trim()]
      }));
      setNewEvidence('');
    }
  };

  const removeEvidence = (index: number) => {
    setNewItem(prev => ({
      ...prev,
      evidenceRequired: prev.evidenceRequired?.filter((_, i) => i !== index) || []
    }));
  };

  const addCriteria = () => {
    if (newCriteria.trim()) {
      setNewItem(prev => ({
        ...prev,
        assessmentCriteria: [...(prev.assessmentCriteria || []), newCriteria.trim()]
      }));
      setNewCriteria('');
    }
  };

  const removeCriteria = (index: number) => {
    setNewItem(prev => ({
      ...prev,
      assessmentCriteria: prev.assessmentCriteria?.filter((_, i) => i !== index) || []
    }));
  };

  const addTag = () => {
    if (newTag.trim()) {
      setChecklist(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setChecklist(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const getCategoryIcon = (category: AuditCategory) => {
    switch (category) {
      case 'Access Control': return <Shield className="w-4 h-4 text-primary-500" />;
      case 'Awareness and Training': return <Target className="w-4 h-4 text-success-500" />;
      case 'Audit and Accountability': return <CheckSquare className="w-4 h-4 text-purple-500" />;
      case 'Configuration Management': return <FileText className="w-4 h-4 text-orange-500" />;
      default: return <CheckSquare className="w-4 h-4 text-text-muted-light" />;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Checklist Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
            Checklist Title
          </label>
          <input
            type="text"
            value={checklist.title}
            onChange={(e) => setChecklist(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
            placeholder="Enter checklist title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
            Author
          </label>
          <input
            type="text"
            value={checklist.author}
            onChange={(e) => setChecklist(prev => ({ ...prev, author: e.target.value }))}
            className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
            placeholder="Enter author name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
            Framework
          </label>
          <select
            value={checklist.framework}
            onChange={(e) => setChecklist(prev => ({ ...prev, framework: e.target.value as any }))}
            className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
          >
            {FRAMEWORKS.map(framework => (
              <option key={framework} value={framework}>{framework}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
            Level
          </label>
          <select
            value={checklist.level}
            onChange={(e) => setChecklist(prev => ({ ...prev, level: e.target.value as any }))}
            className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
          >
            {LEVELS.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
            Category
          </label>
          <select
            value={checklist.category}
            onChange={(e) => setChecklist(prev => ({ ...prev, category: e.target.value as AuditCategory }))}
            className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
          >
            {AUDIT_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
            Version
          </label>
          <input
            type="text"
            value={checklist.version}
            onChange={(e) => setChecklist(prev => ({ ...prev, version: e.target.value }))}
            className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
            placeholder="Enter version"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
            Description
          </label>
          <textarea
            value={checklist.description}
            onChange={(e) => setChecklist(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
            placeholder="Enter checklist description"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
          Tags
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTag()}
            className="flex-1 px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
            placeholder="Enter tag"
          />
          <button
            onClick={addTag}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {checklist.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-sm rounded-full"
            >
              {tag}
              <button
                onClick={() => removeTag(index)}
                className="ml-1 text-primary-600 hover:text-primary-800"
              >
                <XCircle className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-background-light dark:bg-surface-dark rounded-lg p-4">
        <h4 className="font-medium text-text-primary-light dark:text-text-primary-dark mb-2">Checklist Statistics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium text-text-primary-light dark:text-text-secondary-dark">Sections:</span>
            <p className="text-text-secondary-light dark:text-text-muted-dark">{checklist.sections.length}</p>
          </div>
          <div>
            <span className="font-medium text-text-primary-light dark:text-text-secondary-dark">Total Items:</span>
            <p className="text-text-secondary-light dark:text-text-muted-dark">
              {checklist.sections.reduce((sum, section) => sum + section.items.length, 0)}
            </p>
          </div>
          <div>
            <span className="font-medium text-text-primary-light dark:text-text-secondary-dark">Total Weight:</span>
            <p className="text-text-secondary-light dark:text-text-muted-dark">
              {checklist.sections.reduce((sum, section) => sum + section.weight, 0)}%
            </p>
          </div>
          <div>
            <span className="font-medium text-text-primary-light dark:text-text-secondary-dark">CMMC Practices:</span>
            <p className="text-text-secondary-light dark:text-text-muted-dark">
              {new Set(checklist.sections.flatMap(s => s.items.map(i => i.cmmcPractice))).size}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSections = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
          Sections ({checklist.sections.length} sections)
        </h3>
        <button
          onClick={() => setShowSectionForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Section
        </button>
      </div>

      {checklist.sections.length === 0 ? (
        <div className="text-center py-8 text-text-muted-light dark:text-text-muted-dark">
          No sections added yet. Click "Add Section" to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {checklist.sections.map((section) => (
            <div key={section.id} className="border border-support-light dark:border-support-dark rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckSquare className="w-5 h-5 text-primary-500" />
                    <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                      {section.title}
                    </h4>
                    <span className="px-2 py-1 bg-support-light dark:bg-surface-dark text-text-primary-light dark:text-text-secondary-dark text-xs rounded">
                      {section.items.length} items
                    </span>
                    <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs rounded">
                      {section.weight}% weight
                    </span>
                  </div>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark mb-2">
                    {section.description}
                  </p>
                  <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
                    Order: {section.order}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingSection(section.id)}
                    className="p-2 text-text-muted-light hover:text-primary-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteSection(section.id)}
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
  );

  const renderItems = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
          Audit Items
        </h3>
        <div className="flex gap-2">
          <select
            value={selectedSection || ''}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
          >
            <option value="">Select Section</option>
            {checklist.sections.map(section => (
              <option key={section.id} value={section.id}>{section.title}</option>
            ))}
          </select>
          <button
            onClick={() => setShowItemForm(true)}
            disabled={!selectedSection}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      </div>

      {checklist.sections.length === 0 ? (
        <div className="text-center py-8 text-text-muted-light dark:text-text-muted-dark">
          No sections available. Please add sections first.
        </div>
      ) : (
        <div className="space-y-4">
          {checklist.sections.map((section) => (
            <div key={section.id} className="border border-support-light dark:border-support-dark rounded-lg p-4">
              <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-4 flex items-center gap-2">
                {getCategoryIcon(section.title as AuditCategory)}
                {section.title}
                <span className="px-2 py-1 bg-support-light dark:bg-surface-dark text-text-primary-light dark:text-text-secondary-dark text-xs rounded">
                  {section.items.length} items
                </span>
              </h4>
              {section.items.length === 0 ? (
                <div className="text-center py-4 text-text-muted-light dark:text-text-muted-dark">
                  No items in this section.
                </div>
              ) : (
                <div className="space-y-3">
                  {section.items.map((item) => (
                    <div key={item.id} className="bg-background-light dark:bg-surface-dark rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h5 className="font-medium text-text-primary-light dark:text-text-primary-dark">
                              {item.question}
                            </h5>
                            <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs rounded">
                              {item.cmmcPractice}
                            </span>
                            <span className="px-2 py-1 bg-success-100 dark:bg-success-900 text-success-800 dark:text-success-200 text-xs rounded">
                              {item.weight} pts
                            </span>
                          </div>
                          <p className="text-text-secondary-light dark:text-text-secondary-dark mb-2">
                            {item.description}
                          </p>
                          {item.evidenceRequired.length > 0 && (
                            <div className="mb-2">
                              <span className="text-sm font-medium text-text-primary-light dark:text-text-secondary-dark">Evidence Required:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {item.evidenceRequired.map((evidence, index) => (
                                  <span key={index} className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded">
                                    {evidence}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {item.assessmentCriteria.length > 0 && (
                            <div>
                              <span className="text-sm font-medium text-text-primary-light dark:text-text-secondary-dark">Assessment Criteria:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {item.assessmentCriteria.map((criteria, index) => (
                                  <span key={index} className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded">
                                    {criteria}
                                  </span>
                                ))}
                              </div>
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
                            onClick={() => deleteItem(item.id)}
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
          ))}
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
            Status
          </label>
          <select
            value={checklist.status}
            onChange={(e) => setChecklist(prev => ({ ...prev, status: e.target.value as any }))}
            className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
            Version
          </label>
          <input
            type="text"
            value={checklist.version}
            onChange={(e) => setChecklist(prev => ({ ...prev, version: e.target.value }))}
            className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
          />
        </div>
      </div>

      <div className="bg-background-light dark:bg-surface-dark rounded-lg p-4">
        <h4 className="font-medium text-text-primary-light dark:text-text-primary-dark mb-2">Checklist Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium text-text-primary-light dark:text-text-secondary-dark">Framework:</span>
            <p className="text-text-secondary-light dark:text-text-muted-dark">{checklist.framework}</p>
          </div>
          <div>
            <span className="font-medium text-text-primary-light dark:text-text-secondary-dark">Level:</span>
            <p className="text-text-secondary-light dark:text-text-muted-dark">{checklist.level}</p>
          </div>
          <div>
            <span className="font-medium text-text-primary-light dark:text-text-secondary-dark">Category:</span>
            <p className="text-text-secondary-light dark:text-text-muted-dark">{checklist.category}</p>
          </div>
          <div>
            <span className="font-medium text-text-primary-light dark:text-text-secondary-dark">Status:</span>
            <p className="text-text-secondary-light dark:text-text-muted-dark">{checklist.status}</p>
          </div>
        </div>
      </div>
    </div>
  );

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
                <CheckSquare className="w-6 h-6 text-success-600" />
                Audit Checklist Generator
              </h1>
              <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
                Create comprehensive audit checklists for CMMC compliance
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onSave?.(checklist)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Checklist
              </button>
              <button
                onClick={() => onExport?.(checklist)}
                className="flex items-center gap-2 px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-support-light dark:border-support-dark">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: Eye },
              { id: 'sections', label: 'Sections', icon: FileText },
              { id: 'items', label: 'Items', icon: CheckSquare },
              { id: 'settings', label: 'Settings', icon: Target }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-text-muted-light hover:text-text-primary-light hover:border-support-light dark:text-text-muted-dark dark:hover:text-text-secondary-dark'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'sections' && renderSections()}
          {activeTab === 'items' && renderItems()}
          {activeTab === 'settings' && renderSettings()}
        </div>

        {/* Section Form Modal */}
        {showSectionForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-support-light dark:border-support-dark">
                <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                  Add Section
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newSection.title}
                    onChange={(e) => setNewSection(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                    Description
                  </label>
                  <textarea
                    value={newSection.description}
                    onChange={(e) => setNewSection(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                    Weight (%)
                  </label>
                  <input
                    type="number"
                    value={newSection.weight}
                    onChange={(e) => setNewSection(prev => ({ ...prev, weight: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-support-light dark:border-support-dark flex justify-end gap-3">
                <button
                  onClick={() => setShowSectionForm(false)}
                  className="px-4 py-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addSection}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Add Section
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Item Form Modal */}
        {showItemForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-support-light dark:border-support-dark">
                <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                  Add Audit Item
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                      Question
                    </label>
                    <input
                      type="text"
                      value={newItem.question}
                      onChange={(e) => setNewItem(prev => ({ ...prev, question: e.target.value }))}
                      className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                      Category
                    </label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value as AuditCategory }))}
                      className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                    >
                      {AUDIT_CATEGORIES.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                    Description
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
                  <div>
                    <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                      Weight (points)
                    </label>
                    <input
                      type="number"
                      value={newItem.weight}
                      onChange={(e) => setNewItem(prev => ({ ...prev, weight: parseInt(e.target.value) || 1 }))}
                      className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                    Evidence Required
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newEvidence}
                      onChange={(e) => setNewEvidence(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addEvidence()}
                      className="flex-1 px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                      placeholder="Enter evidence requirement"
                    />
                    <button
                      onClick={addEvidence}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newItem.evidenceRequired?.map((evidence, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm rounded-full"
                      >
                        {evidence}
                        <button
                          onClick={() => removeEvidence(index)}
                          className="ml-1 text-yellow-600 hover:text-yellow-800"
                        >
                          <XCircle className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                    Assessment Criteria
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newCriteria}
                      onChange={(e) => setNewCriteria(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCriteria()}
                      className="flex-1 px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                      placeholder="Enter assessment criteria"
                    />
                    <button
                      onClick={addCriteria}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newItem.assessmentCriteria?.map((criteria, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm rounded-full"
                      >
                        {criteria}
                        <button
                          onClick={() => removeCriteria(index)}
                          className="ml-1 text-purple-600 hover:text-purple-800"
                        >
                          <XCircle className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-support-light dark:border-support-dark flex justify-end gap-3">
                <button
                  onClick={() => setShowItemForm(false)}
                  className="px-4 py-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addItem}
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

export default AuditChecklistGenerator;