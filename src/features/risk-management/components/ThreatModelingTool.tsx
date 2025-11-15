import React, { useState, useEffect } from 'react';
import { Shield, Target, TriangleAlert as AlertTriangle, Network, Database, Eye, Plus, CreditCard as Edit, Trash2, Save, Download } from 'lucide-react';
import { ThreatModel, Threat, AttackVector, SecurityBoundary, DataFlow, ThreatCategory, RiskLevel } from '../types';
import { Breadcrumbs } from '../../../shared/components/layout/Breadcrumbs';

interface ThreatModelingToolProps {
  onSave?: (threatModel: ThreatModel) => void;
  onExport?: (threatModel: ThreatModel) => void;
  initialThreatModel?: ThreatModel;
}

const THREAT_CATEGORIES: ThreatCategory[] = [
  'Malware', 'Insider Threat', 'Social Engineering', 'Physical Attack',
  'Network Attack', 'Data Breach', 'System Compromise', 'Denial of Service',
  'Supply Chain', 'Cloud Security'
];

const RISK_LEVELS: RiskLevel[] = ['very-low', 'low', 'medium', 'high', 'very-high'];

const CMMC_PRACTICES = [
  'AC.1.001', 'AC.1.002', 'AC.2.001', 'AC.2.002', 'AC.2.003',
  'AT.1.001', 'AT.1.002', 'AT.2.001', 'AT.2.002', 'AT.2.003',
  'AU.1.001', 'AU.1.002', 'AU.2.001', 'AU.2.002', 'AU.2.003',
  'CA.1.001', 'CA.1.002', 'CA.2.001', 'CA.2.002', 'CA.2.003',
  'CM.1.001', 'CM.1.002', 'CM.2.001', 'CM.2.002', 'CM.2.003'
];

const ThreatModelingTool: React.FC<ThreatModelingToolProps> = ({
  onSave,
  onExport,
  initialThreatModel
}) => {
  const [threatModel, setThreatModel] = useState<ThreatModel>(
    initialThreatModel || {
      id: '',
      title: '',
      description: '',
      systemId: '',
      systemName: '',
      threats: [],
      attackVectors: [],
      securityBoundaries: [],
      dataFlows: [],
      createdDate: new Date(),
      lastUpdated: new Date(),
      status: 'draft',
      version: '1.0'
    }
  );

  const [activeTab, setActiveTab] = useState<'threats' | 'vectors' | 'boundaries' | 'flows'>('threats');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const [newThreat, setNewThreat] = useState<Partial<Threat>>({
    title: '',
    description: '',
    category: 'Malware',
    likelihood: 'medium',
    impact: 'medium',
    mitigationControls: [],
    cmmcPractices: [],
    attackVectors: []
  });

  const [newAttackVector, setNewAttackVector] = useState<Partial<AttackVector>>({
    name: '',
    description: '',
    entryPoint: '',
    target: '',
    techniques: [],
    mitigations: []
  });

  const [newBoundary, setNewBoundary] = useState<Partial<SecurityBoundary>>({
    name: '',
    type: 'network',
    description: '',
    controls: []
  });

  const [newDataFlow, setNewDataFlow] = useState<Partial<DataFlow>>({
    name: '',
    source: '',
    destination: '',
    dataType: 'CUI',
    protectionLevel: 'high',
    controls: []
  });

  const calculateRiskScore = (likelihood: RiskLevel, impact: RiskLevel): number => {
    const scores = { 'very-low': 1, 'low': 2, 'medium': 3, 'high': 4, 'very-high': 5 };
    return scores[likelihood] * scores[impact];
  };

  const getRiskLevelFromScore = (score: number): RiskLevel => {
    if (score <= 4) return 'very-low';
    if (score <= 6) return 'low';
    if (score <= 12) return 'medium';
    if (score <= 16) return 'high';
    return 'very-high';
  };

  const addThreat = () => {
    if (!newThreat.title || !newThreat.description) return;

    const riskScore = calculateRiskScore(newThreat.likelihood!, newThreat.impact!);
    const threat: Threat = {
      id: Date.now().toString(),
      title: newThreat.title!,
      description: newThreat.description!,
      category: newThreat.category!,
      likelihood: newThreat.likelihood!,
      impact: newThreat.impact!,
      riskScore,
      mitigationControls: newThreat.mitigationControls || [],
      cmmcPractices: newThreat.cmmcPractices || [],
      attackVectors: newThreat.attackVectors || []
    };

    setThreatModel(prev => ({
      ...prev,
      threats: [...prev.threats, threat],
      lastUpdated: new Date()
    }));

    setNewThreat({
      title: '',
      description: '',
      category: 'Malware',
      likelihood: 'medium',
      impact: 'medium',
      mitigationControls: [],
      cmmcPractices: [],
      attackVectors: []
    });
    setShowForm(false);
  };

  const addAttackVector = () => {
    if (!newAttackVector.name || !newAttackVector.description) return;

    const attackVector: AttackVector = {
      id: Date.now().toString(),
      name: newAttackVector.name!,
      description: newAttackVector.description!,
      entryPoint: newAttackVector.entryPoint!,
      target: newAttackVector.target!,
      techniques: newAttackVector.techniques || [],
      mitigations: newAttackVector.mitigations || []
    };

    setThreatModel(prev => ({
      ...prev,
      attackVectors: [...prev.attackVectors, attackVector],
      lastUpdated: new Date()
    }));

    setNewAttackVector({
      name: '',
      description: '',
      entryPoint: '',
      target: '',
      techniques: [],
      mitigations: []
    });
    setShowForm(false);
  };

  const addSecurityBoundary = () => {
    if (!newBoundary.name || !newBoundary.description) return;

    const boundary: SecurityBoundary = {
      id: Date.now().toString(),
      name: newBoundary.name!,
      type: newBoundary.type!,
      description: newBoundary.description!,
      controls: newBoundary.controls || []
    };

    setThreatModel(prev => ({
      ...prev,
      securityBoundaries: [...prev.securityBoundaries, boundary],
      lastUpdated: new Date()
    }));

    setNewBoundary({
      name: '',
      type: 'network',
      description: '',
      controls: []
    });
    setShowForm(false);
  };

  const addDataFlow = () => {
    if (!newDataFlow.name || !newDataFlow.source || !newDataFlow.destination) return;

    const dataFlow: DataFlow = {
      id: Date.now().toString(),
      name: newDataFlow.name!,
      source: newDataFlow.source!,
      destination: newDataFlow.destination!,
      dataType: newDataFlow.dataType!,
      protectionLevel: newDataFlow.protectionLevel!,
      controls: newDataFlow.controls || []
    };

    setThreatModel(prev => ({
      ...prev,
      dataFlows: [...prev.dataFlows, dataFlow],
      lastUpdated: new Date()
    }));

    setNewDataFlow({
      name: '',
      source: '',
      destination: '',
      dataType: 'CUI',
      protectionLevel: 'high',
      controls: []
    });
    setShowForm(false);
  };

  const getRiskLevelColor = (level: RiskLevel): string => {
    const colors = {
      'very-low': 'text-success-600 bg-success-100',
      'low': 'text-success-700 bg-success-200',
      'medium': 'text-yellow-600 bg-yellow-100',
      'high': 'text-orange-600 bg-orange-100',
      'very-high': 'text-error-600 bg-error-100'
    };
    return colors[level];
  };

  const renderThreats = () => (
    <div className="space-y-4">
      {threatModel.threats.map((threat) => (
        <div key={threat.id} className="border border-support-light dark:border-support-dark rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-error-500" />
                <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                  {threat.title}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(getRiskLevelFromScore(threat.riskScore))}`}>
                  {getRiskLevelFromScore(threat.riskScore).toUpperCase()}
                </span>
                <span className="text-sm text-text-muted-light dark:text-text-muted-dark">
                  Score: {threat.riskScore}
                </span>
              </div>
              <p className="text-text-secondary-light dark:text-text-secondary-dark mb-2">
                {threat.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-text-muted-light dark:text-text-muted-dark">
                <span>Category: {threat.category}</span>
                <span>Likelihood: {threat.likelihood}</span>
                <span>Impact: {threat.impact}</span>
              </div>
              {threat.cmmcPractices.length > 0 && (
                <div className="mt-2">
                  <span className="text-sm font-medium text-text-primary-light dark:text-text-secondary-dark">CMMC Practices:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {threat.cmmcPractices.map((practice, index) => (
                      <span key={index} className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs rounded">
                        {practice}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingItem(threat.id)}
                className="p-2 text-text-muted-light hover:text-primary-600 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => setThreatModel(prev => ({
                  ...prev,
                  threats: prev.threats.filter(t => t.id !== threat.id),
                  lastUpdated: new Date()
                }))}
                className="p-2 text-text-muted-light hover:text-error-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAttackVectors = () => (
    <div className="space-y-4">
      {threatModel.attackVectors.map((vector) => (
        <div key={vector.id} className="border border-support-light dark:border-support-dark rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                  {vector.name}
                </h3>
              </div>
              <p className="text-text-secondary-light dark:text-text-secondary-dark mb-2">
                {vector.description}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-text-primary-light dark:text-text-secondary-dark">Entry Point:</span>
                  <p className="text-text-secondary-light dark:text-text-muted-dark">{vector.entryPoint}</p>
                </div>
                <div>
                  <span className="font-medium text-text-primary-light dark:text-text-secondary-dark">Target:</span>
                  <p className="text-text-secondary-light dark:text-text-muted-dark">{vector.target}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingItem(vector.id)}
                className="p-2 text-text-muted-light hover:text-primary-600 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => setThreatModel(prev => ({
                  ...prev,
                  attackVectors: prev.attackVectors.filter(v => v.id !== vector.id),
                  lastUpdated: new Date()
                }))}
                className="p-2 text-text-muted-light hover:text-error-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSecurityBoundaries = () => (
    <div className="space-y-4">
      {threatModel.securityBoundaries.map((boundary) => (
        <div key={boundary.id} className="border border-support-light dark:border-support-dark rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-primary-500" />
                <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                  {boundary.name}
                </h3>
                <span className="px-2 py-1 bg-support-light dark:bg-surface-dark text-text-primary-light dark:text-text-secondary-dark text-xs rounded">
                  {boundary.type.toUpperCase()}
                </span>
              </div>
              <p className="text-text-secondary-light dark:text-text-secondary-dark mb-2">
                {boundary.description}
              </p>
              {boundary.controls.length > 0 && (
                <div className="mt-2">
                  <span className="text-sm font-medium text-text-primary-light dark:text-text-secondary-dark">Controls:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {boundary.controls.map((control, index) => (
                      <span key={index} className="px-2 py-1 bg-success-100 dark:bg-success-900 text-success-800 dark:text-success-200 text-xs rounded">
                        {control}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingItem(boundary.id)}
                className="p-2 text-text-muted-light hover:text-primary-600 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => setThreatModel(prev => ({
                  ...prev,
                  securityBoundaries: prev.securityBoundaries.filter(b => b.id !== boundary.id),
                  lastUpdated: new Date()
                }))}
                className="p-2 text-text-muted-light hover:text-error-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderDataFlows = () => (
    <div className="space-y-4">
      {threatModel.dataFlows.map((flow) => (
        <div key={flow.id} className="border border-support-light dark:border-support-dark rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Database className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                  {flow.name}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  flow.protectionLevel === 'high' ? 'bg-error-100 text-error-800' :
                  flow.protectionLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-success-100 text-success-800'
                }`}>
                  {flow.protectionLevel.toUpperCase()}
                </span>
                <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs rounded">
                  {flow.dataType}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-text-primary-light dark:text-text-secondary-dark">Source:</span>
                  <p className="text-text-secondary-light dark:text-text-muted-dark">{flow.source}</p>
                </div>
                <div>
                  <span className="font-medium text-text-primary-light dark:text-text-secondary-dark">Destination:</span>
                  <p className="text-text-secondary-light dark:text-text-muted-dark">{flow.destination}</p>
                </div>
              </div>
              {flow.controls.length > 0 && (
                <div className="mt-2">
                  <span className="text-sm font-medium text-text-primary-light dark:text-text-secondary-dark">Controls:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {flow.controls.map((control, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded">
                        {control}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingItem(flow.id)}
                className="p-2 text-text-muted-light hover:text-primary-600 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => setThreatModel(prev => ({
                  ...prev,
                  dataFlows: prev.dataFlows.filter(f => f.id !== flow.id),
                  lastUpdated: new Date()
                }))}
                className="p-2 text-text-muted-light hover:text-error-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderForm = () => {
    switch (activeTab) {
      case 'threats':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                  Threat Title
                </label>
                <input
                  type="text"
                  value={newThreat.title}
                  onChange={(e) => setNewThreat(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                  Category
                </label>
                <select
                  value={newThreat.category}
                  onChange={(e) => setNewThreat(prev => ({ ...prev, category: e.target.value as ThreatCategory }))}
                  className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                >
                  {THREAT_CATEGORIES.map(category => (
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
                value={newThreat.description}
                onChange={(e) => setNewThreat(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                  Likelihood
                </label>
                <select
                  value={newThreat.likelihood}
                  onChange={(e) => setNewThreat(prev => ({ ...prev, likelihood: e.target.value as RiskLevel }))}
                  className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                >
                  {RISK_LEVELS.map(level => (
                    <option key={level} value={level}>{level.replace('-', ' ').toUpperCase()}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                  Impact
                </label>
                <select
                  value={newThreat.impact}
                  onChange={(e) => setNewThreat(prev => ({ ...prev, impact: e.target.value as RiskLevel }))}
                  className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                >
                  {RISK_LEVELS.map(level => (
                    <option key={level} value={level}>{level.replace('-', ' ').toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addThreat}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add Threat
              </button>
            </div>
          </div>
        );
      // Add similar forms for other tabs...
      default:
        return null;
    }
  };

  const breadcrumbs = [
    { label: 'Risk Management', path: '/threat-modeling' },
    { label: 'Threat Modeling Tool', isActive: true }
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
                <Target className="w-6 h-6 text-orange-600" />
                Threat Modeling Tool
              </h1>
              <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
                Analyze and model security threats for CMMC compliance
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onSave?.(threatModel)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Model
              </button>
              <button
                onClick={() => onExport?.(threatModel)}
                className="flex items-center gap-2 px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* System Details */}
        <div className="p-6 border-b border-support-light dark:border-support-dark">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                System Name
              </label>
              <input
                type="text"
                value={threatModel.systemName}
                onChange={(e) => setThreatModel(prev => ({ ...prev, systemName: e.target.value }))}
                className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                placeholder="Enter system name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                System ID
              </label>
              <input
                type="text"
                value={threatModel.systemId}
                onChange={(e) => setThreatModel(prev => ({ ...prev, systemId: e.target.value }))}
                className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                placeholder="Enter system ID"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                Description
              </label>
              <textarea
                value={threatModel.description}
                onChange={(e) => setThreatModel(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                placeholder="Enter system description"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-support-light dark:border-support-dark">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'threats', label: 'Threats', icon: AlertTriangle, count: threatModel.threats.length },
              { id: 'vectors', label: 'Attack Vectors', icon: Target, count: threatModel.attackVectors.length },
              { id: 'boundaries', label: 'Security Boundaries', icon: Shield, count: threatModel.securityBoundaries.length },
              { id: 'flows', label: 'Data Flows', icon: Database, count: threatModel.dataFlows.length }
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
                <span className="bg-support-light dark:bg-surface-dark text-text-secondary-light dark:text-text-secondary-dark px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
              {activeTab === 'threats' && 'Security Threats'}
              {activeTab === 'vectors' && 'Attack Vectors'}
              {activeTab === 'boundaries' && 'Security Boundaries'}
              {activeTab === 'flows' && 'Data Flows'}
            </h2>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add {activeTab === 'threats' ? 'Threat' : activeTab === 'vectors' ? 'Attack Vector' : activeTab === 'boundaries' ? 'Boundary' : 'Data Flow'}
            </button>
          </div>

          {showForm ? (
            <div className="bg-background-light dark:bg-surface-dark rounded-lg p-6 mb-6">
              {renderForm()}
            </div>
          ) : null}

          {activeTab === 'threats' && renderThreats()}
          {activeTab === 'vectors' && renderAttackVectors()}
          {activeTab === 'boundaries' && renderSecurityBoundaries()}
          {activeTab === 'flows' && renderDataFlows()}
        </div>
      </div>
    </div>
  );
};

export default ThreatModelingTool;