import React, { useState, useEffect } from 'react';
import { Shield, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Circle as XCircle, Plus, CreditCard as Edit, Trash2, Download, Save, Eye } from 'lucide-react';
import { RiskAssessment, Risk, RiskCategory, RiskLevel } from '../types';
import { Breadcrumbs } from '../../../shared/components/layout/Breadcrumbs';

interface RiskAssessmentGeneratorProps {
  onSave?: (assessment: RiskAssessment) => void;
  onExport?: (assessment: RiskAssessment) => void;
  initialAssessment?: RiskAssessment;
}

const RISK_CATEGORIES: RiskCategory[] = [
  'Technical', 'Operational', 'Physical', 'Environmental',
  'Legal/Compliance', 'Financial', 'Reputation', 'Strategic'
];

const RISK_LEVELS: RiskLevel[] = ['very-low', 'low', 'medium', 'high', 'very-high'];

const RISK_SCORES = {
  'very-low': 1,
  'low': 2,
  'medium': 3,
  'high': 4,
  'very-high': 5
};

const CMMC_PRACTICES = [
  'AC.1.001', 'AC.1.002', 'AC.2.001', 'AC.2.002', 'AC.2.003',
  'AT.1.001', 'AT.1.002', 'AT.2.001', 'AT.2.002', 'AT.2.003',
  'AU.1.001', 'AU.1.002', 'AU.2.001', 'AU.2.002', 'AU.2.003',
  'CA.1.001', 'CA.1.002', 'CA.2.001', 'CA.2.002', 'CA.2.003',
  'CM.1.001', 'CM.1.002', 'CM.2.001', 'CM.2.002', 'CM.2.003'
];

const RiskAssessmentGenerator: React.FC<RiskAssessmentGeneratorProps> = ({
  onSave,
  onExport,
  initialAssessment
}) => {
  const [assessment, setAssessment] = useState<RiskAssessment>(
    initialAssessment || {
      id: '',
      title: '',
      description: '',
      organizationId: '',
      assessmentDate: new Date(),
      lastUpdated: new Date(),
      status: 'draft',
      risks: [],
      overallRiskLevel: 'low',
      assessor: '',
      framework: 'CMMC',
      version: '1.0'
    }
  );

  const [newRisk, setNewRisk] = useState<Partial<Risk>>({
    title: '',
    description: '',
    category: 'Technical',
    likelihood: 'medium',
    impact: 'medium',
    status: 'identified',
    owner: '',
    controls: [],
    cmmcPractices: []
  });

  const [showRiskForm, setShowRiskForm] = useState(false);
  const [editingRisk, setEditingRisk] = useState<string | null>(null);

  useEffect(() => {
    calculateOverallRiskLevel();
  }, [assessment.risks]);

  const calculateRiskScore = (likelihood: RiskLevel, impact: RiskLevel): number => {
    return RISK_SCORES[likelihood] * RISK_SCORES[impact];
  };

  const getRiskLevelFromScore = (score: number): RiskLevel => {
    if (score <= 4) return 'very-low';
    if (score <= 6) return 'low';
    if (score <= 12) return 'medium';
    if (score <= 16) return 'high';
    return 'very-high';
  };

  const calculateOverallRiskLevel = () => {
    if (assessment.risks.length === 0) {
      setAssessment(prev => ({ ...prev, overallRiskLevel: 'low' }));
      return;
    }

    const maxRiskScore = Math.max(...assessment.risks.map(risk => risk.riskScore));
    const overallLevel = getRiskLevelFromScore(maxRiskScore);
    setAssessment(prev => ({ ...prev, overallRiskLevel: overallLevel }));
  };

  const addRisk = () => {
    if (!newRisk.title || !newRisk.description) return;

    const riskScore = calculateRiskScore(newRisk.likelihood!, newRisk.impact!);
    const riskLevel = getRiskLevelFromScore(riskScore);

    const risk: Risk = {
      id: Date.now().toString(),
      title: newRisk.title!,
      description: newRisk.description!,
      category: newRisk.category!,
      likelihood: newRisk.likelihood!,
      impact: newRisk.impact!,
      riskScore,
      status: newRisk.status!,
      mitigationStrategy: newRisk.mitigationStrategy,
      mitigationActions: newRisk.mitigationActions || [],
      residualRisk: riskLevel,
      owner: newRisk.owner!,
      dueDate: newRisk.dueDate,
      evidence: newRisk.evidence || [],
      controls: newRisk.controls || [],
      cmmcPractices: newRisk.cmmcPractices || []
    };

    setAssessment(prev => ({
      ...prev,
      risks: [...prev.risks, risk],
      lastUpdated: new Date()
    }));

    setNewRisk({
      title: '',
      description: '',
      category: 'Technical',
      likelihood: 'medium',
      impact: 'medium',
      status: 'identified',
      owner: '',
      controls: [],
      cmmcPractices: []
    });
    setShowRiskForm(false);
  };

  const updateRisk = (riskId: string, updatedRisk: Partial<Risk>) => {
    setAssessment(prev => ({
      ...prev,
      risks: prev.risks.map(risk =>
        risk.id === riskId
          ? {
              ...risk,
              ...updatedRisk,
              riskScore: calculateRiskScore(updatedRisk.likelihood || risk.likelihood, updatedRisk.impact || risk.impact),
              residualRisk: getRiskLevelFromScore(calculateRiskScore(updatedRisk.likelihood || risk.likelihood, updatedRisk.impact || risk.impact))
            }
          : risk
      ),
      lastUpdated: new Date()
    }));
    setEditingRisk(null);
  };

  const deleteRisk = (riskId: string) => {
    setAssessment(prev => ({
      ...prev,
      risks: prev.risks.filter(risk => risk.id !== riskId),
      lastUpdated: new Date()
    }));
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'identified': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'assessed': return <Eye className="w-4 h-4 text-blue-500" />;
      case 'mitigated': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'accepted': return <XCircle className="w-4 h-4 text-gray-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const breadcrumbs = [
    { label: 'Risk Management', path: '/risk-assessment' },
    { label: 'Risk Assessment Generator', isActive: true }
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
                <Shield className="w-6 h-6 text-blue-600" />
                Risk Assessment Generator
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Create comprehensive risk assessments for CMMC compliance
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onSave?.(assessment)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Assessment
              </button>
              <button
                onClick={() => onExport?.(assessment)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Assessment Details */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assessment Title
              </label>
              <input
                type="text"
                value={assessment.title}
                onChange={(e) => setAssessment(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter assessment title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assessor
              </label>
              <input
                type="text"
                value={assessment.assessor}
                onChange={(e) => setAssessment(prev => ({ ...prev, assessor: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter assessor name"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={assessment.description}
                onChange={(e) => setAssessment(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter assessment description"
              />
            </div>
          </div>
        </div>

        {/* Risk Summary */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Risk Summary
            </h2>
            <button
              onClick={() => setShowRiskForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Risk
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {assessment.risks.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Risks</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {assessment.risks.filter(r => r.riskLevel === 'very-high' || r.riskLevel === 'high').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">High/Critical</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {assessment.risks.filter(r => r.riskLevel === 'medium').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Medium</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {assessment.risks.filter(r => r.riskLevel === 'low' || r.riskLevel === 'very-low').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Low</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Overall Risk Level:
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(assessment.overallRiskLevel)}`}>
              {assessment.overallRiskLevel.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Risk List */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Identified Risks
          </h2>

          {assessment.risks.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No risks identified yet. Click "Add Risk" to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {assessment.risks.map((risk) => (
                <div key={risk.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(risk.status)}
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {risk.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(risk.residualRisk)}`}>
                          {risk.residualRisk.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Score: {risk.riskScore}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">
                        {risk.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>Category: {risk.category}</span>
                        <span>Owner: {risk.owner}</span>
                        <span>Status: {risk.status}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingRisk(risk.id)}
                        className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteRisk(risk.id)}
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

        {/* Risk Form Modal */}
        {showRiskForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Add New Risk
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Risk Title
                    </label>
                    <input
                      type="text"
                      value={newRisk.title}
                      onChange={(e) => setNewRisk(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={newRisk.category}
                      onChange={(e) => setNewRisk(prev => ({ ...prev, category: e.target.value as RiskCategory }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      {RISK_CATEGORIES.map(category => (
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
                    value={newRisk.description}
                    onChange={(e) => setNewRisk(prev => ({ ...prev, description: e.target.value }))}
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
                      value={newRisk.likelihood}
                      onChange={(e) => setNewRisk(prev => ({ ...prev, likelihood: e.target.value as RiskLevel }))}
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
                      value={newRisk.impact}
                      onChange={(e) => setNewRisk(prev => ({ ...prev, impact: e.target.value as RiskLevel }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      {RISK_LEVELS.map(level => (
                        <option key={level} value={level}>{level.replace('-', ' ').toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Owner
                    </label>
                    <input
                      type="text"
                      value={newRisk.owner}
                      onChange={(e) => setNewRisk(prev => ({ ...prev, owner: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={newRisk.status}
                      onChange={(e) => setNewRisk(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="identified">Identified</option>
                      <option value="assessed">Assessed</option>
                      <option value="mitigated">Mitigated</option>
                      <option value="accepted">Accepted</option>
                      <option value="transferred">Transferred</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button
                  onClick={() => setShowRiskForm(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addRisk}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Risk
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskAssessmentGenerator;