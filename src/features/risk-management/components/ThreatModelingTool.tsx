import React, { useState, useEffect } from 'react';
import { Shield, Target, AlertTriangle, Network, Database, Eye, Plus, Edit, Trash2, Save, Download } from 'lucide-react';
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

export const ThreatModelingTool: React.FC<ThreatModelingToolProps> = ({
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
      'very-low': 'text-green-600 bg-green-100',
      'low': 'text-green-700 bg-green-200',
      'medium': 'text-yellow-600 bg-yellow-100',
      'high': 'text-orange-600 bg-orange-100',
      'very-high': 'text-red-600 bg-red-100'
    };
    return colors[level];
  };

  const renderThreats = () => (
    <div className="space-y-4">
      {threatModel.threats.map((threat) => (
        <div key={threat.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {threat.title}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(getRiskLevelFromScore(threat.riskScore))}`}>
                  {getRiskLevelFromScore(threat.riskScore).toUpperCase()}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Score: {threat.riskScore}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                {threat.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>Category: {threat.category}</span>
                <span>Likelihood: {threat.likelihood}</span>
                <span>Impact: {threat.impact}</span>
              </div>
              {threat.cmmcPractices.length > 0 && (
                <div className="mt-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">CMMC Practices:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {threat.cmmcPractices.map((practice, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
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
                className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => setThreatModel(prev => ({
                  ...prev,
                  threats: prev.threats.filter(t => t.id !== threat.id),
                  lastUpdated: new Date()
                }))}
                className="p-2 text-gray-500 hover:text-red-600 transition-colors"
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
        <div key={vector.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {vector.name}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                {vector.description}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Entry Point:</span>
                  <p className="text-gray-600 dark:text-gray-400">{vector.entryPoint}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Target:</span>
                  <p className="text-gray-600 dark:text-gray-400">{vector.target}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingItem(vector.id)}
                className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => setThreatModel(prev => ({
                  ...prev,
                  attackVectors: prev.attackVectors.filter(v => v.id !== vector.id),
                  lastUpdated: new Date()
                }))}
                className="p-2 text-gray-500 hover:text-red-600 transition-colors"
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
        <div key={boundary.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {boundary.name}
                </h3>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                  {boundary.type.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                {boundary.description}
              </p>
              {boundary.controls.length > 0 && (
                <div className="mt-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Controls:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {boundary.controls.map((control, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded">
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
                className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => setThreatModel(prev => ({
                  ...prev,
                  securityBoundaries: prev.securityBoundaries.filter(b => b.id !== boundary.id),
                  lastUpdated: new Date()
                }))}
                className="p-2 text-gray-500 hover:text-red-600 transition-colors"
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
        <div key={flow.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Database className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {flow.name}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  flow.protectionLevel === 'high' ? 'bg-red-100 text-red-800' :
                  flow.protectionLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {flow.protectionLevel.toUpperCase()}
                </span>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                  {flow.dataType}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Source:</span>
                  <p className="text-gray-600 dark:text-gray-400">{flow.source}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Destination:</span>
                  <p className="text-gray-600 dark:text-gray-400">{flow.destination}</p>
                </div>
              </div>
              {flow.controls.length > 0 && (
                <div className="mt-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Controls:</span>
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
                className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => setThreatModel(prev => ({
                  ...prev,
                  dataFlows: prev.dataFlows.filter(f => f.id !== flow.id),
                  lastUpdated: new Date()
                }))}
                className="p-2 text-gray-500 hover:text-red-600 transition-colors"
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Threat Title
                </label>
                <input
                  type="text"
                  value={newThreat.title}
                  onChange={(e) => setNewThreat(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={newThreat.category}
                  onChange={(e) => setNewThreat(prev => ({ ...prev, category: e.target.value as ThreatCategory }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {THREAT_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={newThreat.description}
                onChange={(e) => setNewThreat(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Likelihood
                </label>
                <select
                  value={newThreat.likelihood}
                  onChange={(e) => setNewThreat(prev => ({ ...prev, likelihood: e.target.value as RiskLevel }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {RISK_LEVELS.map(level => (
                    <option key={level} value={level}>{level.replace('-', ' ').toUpperCase()}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Impact
                </label>
                <select
                  value={newThreat.impact}
                  onChange={(e) => setNewThreat(prev => ({ ...prev, impact: e.target.value as RiskLevel }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addThreat}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Target className="w-6 h-6 text-orange-600" />
                Threat Modeling Tool
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Analyze and model security threats for CMMC compliance
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onSave?.(threatModel)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Model
              </button>
              <button
                onClick={() => onExport?.(threatModel)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* System Details */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                System Name
              </label>
              <input
                type="text"
                value={threatModel.systemName}
                onChange={(e) => setThreatModel(prev => ({ ...prev, systemName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter system name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                System ID
              </label>
              <input
                type="text"
                value={threatModel.systemId}
                onChange={(e) => setThreatModel(prev => ({ ...prev, systemId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter system ID"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={threatModel.description}
                onChange={(e) => setThreatModel(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter system description"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
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
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {activeTab === 'threats' && 'Security Threats'}
              {activeTab === 'vectors' && 'Attack Vectors'}
              {activeTab === 'boundaries' && 'Security Boundaries'}
              {activeTab === 'flows' && 'Data Flows'}
            </h2>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add {activeTab === 'threats' ? 'Threat' : activeTab === 'vectors' ? 'Attack Vector' : activeTab === 'boundaries' ? 'Boundary' : 'Data Flow'}
            </button>
          </div>

          {showForm ? (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
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