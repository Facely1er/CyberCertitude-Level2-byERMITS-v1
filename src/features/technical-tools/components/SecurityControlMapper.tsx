import React, { useState, useEffect } from 'react';
import { Target, Plus, Edit, Trash2, Save, Download, Search, Filter, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Breadcrumbs } from '../../../shared/components/layout/Breadcrumbs';
import { logger } from '../../../utils/logger';

interface SecurityControlMapperProps {
  onSave?: (mapper: any) => void;
  onExport?: (mapper: any) => void;
}

interface ControlMapping {
  id: string;
  sourceControl: string;
  sourceFramework: string;
  targetControl: string;
  targetFramework: string;
  mappingType: 'direct' | 'partial' | 'equivalent' | 'custom';
  confidence: 'high' | 'medium' | 'low';
  description: string;
  implementation: string;
  evidence: string[];
  notes: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedDate?: Date;
}

const FRAMEWORKS = ['CMMC', 'NIST 800-171', 'NIST 800-53', 'ISO 27001', 'SOC 2', 'Custom'];
const MAPPING_TYPES = ['direct', 'partial', 'equivalent', 'custom'] as const;
const CONFIDENCE_LEVELS = ['high', 'medium', 'low'] as const;

export const SecurityControlMapper: React.FC<SecurityControlMapperProps> = ({
  onSave,
  onExport
}) => {
  // Add debugging to help identify hook issues
  useEffect(() => {
    logger.info('SecurityControlMapper component mounted');
    return () => {
      logger.info('SecurityControlMapper component unmounted');
    };
  }, []);
  const [mappings, setMappings] = useState<ControlMapping[]>([
    {
      id: '1',
      sourceControl: 'AC.1.001',
      sourceFramework: 'CMMC',
      targetControl: 'AC-1',
      targetFramework: 'NIST 800-53',
      mappingType: 'direct',
      confidence: 'high',
      description: 'Direct mapping between CMMC access control and NIST 800-53 access control',
      implementation: 'Implement access control policies and procedures',
      evidence: ['Policy document', 'Implementation guide', 'Training records'],
      notes: 'This is a direct 1:1 mapping',
      verified: true,
      verifiedBy: 'Security Team',
      verifiedDate: new Date('2024-01-15')
    },
    {
      id: '2',
      sourceControl: 'AT.1.001',
      sourceFramework: 'CMMC',
      targetControl: 'AT-2',
      targetFramework: 'NIST 800-53',
      mappingType: 'equivalent',
      confidence: 'medium',
      description: 'CMMC awareness training maps to NIST awareness training with some differences',
      implementation: 'Develop and deliver security awareness training program',
      evidence: ['Training materials', 'Completion records', 'Assessment results'],
      notes: 'Requires additional technical training components',
      verified: false
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMapping, setEditingMapping] = useState<string | null>(null);
  const [filterSource, setFilterSource] = useState<string>('all');
  const [filterTarget, setFilterTarget] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [newMapping, setNewMapping] = useState<Partial<ControlMapping>>({
    sourceControl: '',
    sourceFramework: 'CMMC',
    targetControl: '',
    targetFramework: 'NIST 800-53',
    mappingType: 'direct',
    confidence: 'high',
    description: '',
    implementation: '',
    evidence: [],
    notes: '',
    verified: false
  });

  const [newEvidence, setNewEvidence] = useState('');

  // Add error boundary for this component
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      if (error.message.includes('Invalid hook call') || 
          error.message.includes('Minified React error #306')) {
        setHasError(true);
        logger.error('React hook error detected:', error);
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Move all hooks to the top before any conditional returns
  const filteredMappings = React.useMemo(() => {
    return mappings.filter(mapping => {
      const matchesSource = filterSource === 'all' || mapping.sourceFramework === filterSource;
      const matchesTarget = filterTarget === 'all' || mapping.targetFramework === filterTarget;
      const matchesSearch = searchTerm === '' || 
        mapping.sourceControl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mapping.targetControl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mapping.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSource && matchesTarget && matchesSearch;
    });
  }, [mappings, filterSource, filterTarget, searchTerm]);

  const addMapping = React.useCallback(() => {
    if (!newMapping.sourceControl || !newMapping.targetControl || !newMapping.description) {
      return;
    }

    const mapping: ControlMapping = {
      id: Date.now().toString(),
      sourceControl: newMapping.sourceControl!,
      sourceFramework: newMapping.sourceFramework!,
      targetControl: newMapping.targetControl!,
      targetFramework: newMapping.targetFramework!,
      mappingType: newMapping.mappingType!,
      confidence: newMapping.confidence!,
      description: newMapping.description!,
      implementation: newMapping.implementation || '',
      evidence: newMapping.evidence || [],
      notes: newMapping.notes || '',
      verified: newMapping.verified || false
    };

    setMappings(prev => [...prev, mapping]);
    setNewMapping({
      sourceControl: '',
      sourceFramework: 'CMMC',
      targetControl: '',
      targetFramework: 'NIST 800-53',
      mappingType: 'direct',
      confidence: 'high',
      description: '',
      implementation: '',
      evidence: [],
      notes: '',
      verified: false
    });
    setShowAddForm(false);
  }, [newMapping]);

  const updateMapping = React.useCallback((id: string, updates: Partial<ControlMapping>) => {
    setMappings(prev => prev.map(mapping =>
      mapping.id === id ? { ...mapping, ...updates } : mapping
    ));
    setEditingMapping(null);
  }, []);

  const deleteMapping = React.useCallback((id: string) => {
    setMappings(prev => prev.filter(mapping => mapping.id !== id));
  }, []);

  const addEvidence = React.useCallback(() => {
    if (newEvidence.trim()) {
      setNewMapping(prev => ({
        ...prev,
        evidence: [...(prev.evidence || []), newEvidence.trim()]
      }));
      setNewEvidence('');
    }
  }, [newEvidence]);

  const removeEvidence = React.useCallback((index: number) => {
    setNewMapping(prev => ({
      ...prev,
      evidence: prev.evidence?.filter((_, i) => i !== index) || []
    }));
  }, []);

  const getMappingTypeColor = React.useCallback((type: string) => {
    switch (type) {
      case 'direct': return 'text-green-600 bg-green-100';
      case 'partial': return 'text-yellow-600 bg-yellow-100';
      case 'equivalent': return 'text-blue-600 bg-blue-100';
      case 'custom': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }, []);

  const getConfidenceColor = React.useCallback((confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }, []);

  // Conditional return after all hooks
  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            React Hook Error Detected
          </h3>
          <p className="text-red-600 dark:text-red-300 mb-4">
            This component encountered a React hook error. Please try refreshing the page or disabling browser extensions.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  const breadcrumbs = [
    { label: 'Technical Tools', path: '/security-controls' },
    { label: 'Security Control Mapper', isActive: true }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Target className="w-6 h-6 text-blue-600" />
                Security Control Mapper
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Map security controls across different frameworks for CMMC compliance
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onSave?.(mappings)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Mappings
              </button>
              <button
                onClick={() => onExport?.(mappings)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Search control mappings..."
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Source Frameworks</option>
                {FRAMEWORKS.map(framework => (
                  <option key={framework} value={framework}>{framework}</option>
                ))}
              </select>
              <select
                value={filterTarget}
                onChange={(e) => setFilterTarget(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Target Frameworks</option>
                {FRAMEWORKS.map(framework => (
                  <option key={framework} value={framework}>{framework}</option>
                ))}
              </select>
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Mapping
              </button>
            </div>
          </div>
        </div>

        {/* Mappings List */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Control Mappings ({filteredMappings.length})
          </h2>

          {filteredMappings.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No control mappings found. Click "Add Mapping" to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMappings.map((mapping) => (
                <div key={mapping.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Target className="w-5 h-5 text-blue-500" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {mapping.sourceControl} → {mapping.targetControl}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMappingTypeColor(mapping.mappingType || 'direct')}`}>
                          {(mapping.mappingType || 'direct').toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(mapping.confidence || 'high')}`}>
                          {(mapping.confidence || 'high').toUpperCase()}
                        </span>
                        {mapping.verified && (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            VERIFIED
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">
                        {mapping.description}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div>
                          <span className="font-medium">Source:</span> {mapping.sourceFramework} - {mapping.sourceControl}
                        </div>
                        <div>
                          <span className="font-medium">Target:</span> {mapping.targetFramework} - {mapping.targetControl}
                        </div>
                        <div>
                          <span className="font-medium">Implementation:</span> {mapping.implementation || 'Not specified'}
                        </div>
                        <div>
                          <span className="font-medium">Verified:</span> {mapping.verified ? `Yes (${mapping.verifiedBy || 'Unknown'})` : 'No'}
                        </div>
                      </div>
                      {mapping.evidence.length > 0 && (
                        <div className="mt-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Evidence:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {mapping.evidence.map((evidence, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                                {evidence}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {mapping.notes && (
                        <div className="mt-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes:</span>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{mapping.notes}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingMapping(mapping.id)}
                        className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteMapping(mapping.id)}
                        className="p-2 text-gray-500 hover:text-red-600 transition-colors"
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

        {/* Add Mapping Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Add Control Mapping
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Source Control *
                    </label>
                    <input
                      type="text"
                      value={newMapping.sourceControl}
                      onChange={(e) => setNewMapping(prev => ({ ...prev, sourceControl: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., AC.1.001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Source Framework
                    </label>
                    <select
                      value={newMapping.sourceFramework}
                      onChange={(e) => setNewMapping(prev => ({ ...prev, sourceFramework: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      {FRAMEWORKS.map(framework => (
                        <option key={framework} value={framework}>{framework}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target Control *
                    </label>
                    <input
                      type="text"
                      value={newMapping.targetControl}
                      onChange={(e) => setNewMapping(prev => ({ ...prev, targetControl: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., AC-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target Framework
                    </label>
                    <select
                      value={newMapping.targetFramework}
                      onChange={(e) => setNewMapping(prev => ({ ...prev, targetFramework: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      {FRAMEWORKS.map(framework => (
                        <option key={framework} value={framework}>{framework}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mapping Type
                    </label>
                    <select
                      value={newMapping.mappingType || 'direct'}
                      onChange={(e) => setNewMapping(prev => ({ ...prev, mappingType: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      {MAPPING_TYPES.map(type => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confidence Level
                    </label>
                    <select
                      value={newMapping.confidence || 'high'}
                      onChange={(e) => setNewMapping(prev => ({ ...prev, confidence: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      {CONFIDENCE_LEVELS.map(level => (
                        <option key={level} value={level}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={newMapping.description}
                    onChange={(e) => setNewMapping(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Describe the mapping relationship..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Implementation
                  </label>
                  <textarea
                    value={newMapping.implementation}
                    onChange={(e) => setNewMapping(prev => ({ ...prev, implementation: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Implementation guidance..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Evidence
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newEvidence}
                      onChange={(e) => setNewEvidence(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addEvidence()}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter evidence item"
                    />
                    <button
                      onClick={addEvidence}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(newMapping.evidence || []).map((evidence, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                      >
                        {evidence}
                        <button
                          onClick={() => removeEvidence(index)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <XCircle className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={newMapping.notes}
                    onChange={(e) => setNewMapping(prev => ({ ...prev, notes: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Additional notes..."
                  />
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addMapping}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Mapping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityControlMapper;