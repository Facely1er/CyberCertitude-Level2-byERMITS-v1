import React, { useState } from 'react';
import { Settings, Download, Save, FileText, Shield, Users, CircleCheck as CheckCircle, CircleAlert as AlertCircle, RefreshCw, ArrowLeft, Plus, X, Eye } from 'lucide-react';
import { AssessmentData } from '../../../shared/types';
import { configurationManagementService, ConfigurationManagementPlan } from '../../../services/configurationManagementService';
import { Breadcrumbs } from '../../../shared/components/layout/Breadcrumbs';

interface ConfigurationManagementPlanGeneratorProps {
  savedAssessments?: AssessmentData[];
  onSave?: (plan: ConfigurationManagementPlan) => void;
  onBack?: () => void;
  addNotification?: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

export const ConfigurationManagementPlanGenerator: React.FC<ConfigurationManagementPlanGeneratorProps> = ({
  savedAssessments = [],
  onSave,
  onBack,
  addNotification
}) => {
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentData | null>(null);
  const [organizationInfo, setOrganizationInfo] = useState({
    name: '',
    systemName: '',
    systemDescription: ''
  });
  const [approvers, setApprovers] = useState<Array<{
    name: string;
    role: string;
    level: 'executive' | 'management' | 'technical';
  }>>([
    { name: '', role: 'CISO', level: 'executive' },
    { name: '', role: 'Configuration Manager', level: 'management' },
    { name: '', role: 'Security Analyst', level: 'technical' }
  ]);
  const [generatedPlan, setGeneratedPlan] = useState<ConfigurationManagementPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerate = () => {
    if (!selectedAssessment) {
      addNotification?.('error', 'Please select an assessment');
      return;
    }

    if (!organizationInfo.name || !organizationInfo.systemName) {
      addNotification?.('error', 'Please fill in organization and system information');
      return;
    }

    const hasValidApprover = approvers.some(a => a.name && a.role);
    if (!hasValidApprover) {
      addNotification?.('error', 'Please add at least one approver');
      return;
    }

    setIsGenerating(true);
    try {
      const plan = configurationManagementService.generatePlan(selectedAssessment, {
        ...organizationInfo,
        approvers: approvers.filter(a => a.name && a.role)
      });
      setGeneratedPlan(plan);
      addNotification?.('success', 'Configuration Management Plan generated successfully!');
    } catch (error) {
      addNotification?.('error', `Failed to generate plan: ${(error as Error).message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = () => {
    if (!generatedPlan) {
      addNotification?.('error', 'No plan to export');
      return;
    }

    try {
      const html = configurationManagementService.generateHTML(generatedPlan);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CM-Plan-${organizationInfo.systemName}-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addNotification?.('success', 'Configuration Management Plan exported successfully!');
    } catch (error) {
      addNotification?.('error', `Failed to export plan: ${(error as Error).message}`);
    }
  };

  const handleSave = () => {
    if (!generatedPlan) {
      addNotification?.('error', 'No plan to save');
      return;
    }

    onSave?.(generatedPlan);
    addNotification?.('success', 'Configuration Management Plan saved successfully!');
  };

  const addApprover = () => {
    setApprovers([...approvers, { name: '', role: '', level: 'technical' }]);
  };

  const removeApprover = (index: number) => {
    setApprovers(approvers.filter((_, i) => i !== index));
  };

  const updateApprover = (index: number, field: string, value: string) => {
    const updated = [...approvers];
    updated[index] = { ...updated[index], [field]: value };
    setApprovers(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: 'Technical Tools', path: '/config-baselines' },
        { label: 'Configuration Management Plan', isActive: true }
      ]} />

      {/* Header */}
      <div className="card-standard mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-xl">
              <Settings className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                Configuration Management Plan Generator
              </h1>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                Generate comprehensive configuration management documentation for CMMC compliance
              </p>
            </div>
          </div>

          {generatedPlan && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>{showPreview ? 'Hide' : 'Preview'}</span>
              </button>
              <button
                onClick={handleExport}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button
                onClick={handleSave}
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card-standard">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
              CMMC Compliance
            </h3>
          </div>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Addresses CM.L2-3.4.1 through CM.L2-3.4.9 requirements for configuration management
          </p>
        </div>

        <div className="card-standard">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
              Comprehensive Documentation
            </h3>
          </div>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Complete plan with baselines, change control, and audit procedures
          </p>
        </div>

        <div className="card-standard">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
              Role-Based Process
            </h3>
          </div>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Clear roles, responsibilities, and approval workflows
          </p>
        </div>
      </div>

      {/* Configuration Form */}
      {!generatedPlan && (
        <div className="space-y-6">
          {/* Assessment Selection */}
          <div className="card-standard">
            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
              Select Assessment
            </h3>
            <select
              value={selectedAssessment?.id || ''}
              onChange={e => {
                const assessment = savedAssessments.find(a => a.id === e.target.value);
                setSelectedAssessment(assessment || null);
              }}
              className="input-standard w-full"
            >
              <option value="">Choose an assessment...</option>
              {savedAssessments.map(assessment => (
                <option key={assessment.id} value={assessment.id}>
                  {assessment.frameworkName} - {new Date(assessment.createdAt).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          {/* Organization Information */}
          <div className="card-standard">
            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
              Organization Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  Organization Name *
                </label>
                <input
                  type="text"
                  value={organizationInfo.name}
                  onChange={e => setOrganizationInfo({ ...organizationInfo, name: e.target.value })}
                  placeholder="Enter organization name"
                  className="input-standard w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  System Name *
                </label>
                <input
                  type="text"
                  value={organizationInfo.systemName}
                  onChange={e => setOrganizationInfo({ ...organizationInfo, systemName: e.target.value })}
                  placeholder="Enter system name"
                  className="input-standard w-full"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  System Description
                </label>
                <textarea
                  value={organizationInfo.systemDescription}
                  onChange={e => setOrganizationInfo({ ...organizationInfo, systemDescription: e.target.value })}
                  placeholder="Enter system description"
                  rows={3}
                  className="input-standard w-full"
                />
              </div>
            </div>
          </div>

          {/* Approvers */}
          <div className="card-standard">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                Approvers
              </h3>
              <button
                onClick={addApprover}
                className="btn-secondary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Approver</span>
              </button>
            </div>
            <div className="space-y-4">
              {approvers.map((approver, index) => (
                <div key={index} className="p-4 bg-surface-light dark:bg-surface-dark rounded-lg border border-support-light dark:border-support-dark">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                      Approver {index + 1}
                    </h4>
                    {approvers.length > 1 && (
                      <button
                        onClick={() => removeApprover(index)}
                        className="p-1 text-error-light dark:text-error-dark hover:bg-error-light/10 dark:hover:bg-error-dark/10 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={approver.name}
                      onChange={e => updateApprover(index, 'name', e.target.value)}
                      placeholder="Full Name"
                      className="input-standard"
                    />
                    <input
                      type="text"
                      value={approver.role}
                      onChange={e => updateApprover(index, 'role', e.target.value)}
                      placeholder="Role/Title"
                      className="input-standard"
                    />
                    <select
                      value={approver.level}
                      onChange={e => updateApprover(index, 'level', e.target.value)}
                      className="input-standard"
                    >
                      <option value="executive">Executive Level</option>
                      <option value="management">Management Level</option>
                      <option value="technical">Technical Level</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="btn-primary flex items-center space-x-2 px-8 py-3"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  <span>Generate Configuration Management Plan</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Preview */}
      {generatedPlan && showPreview && (
        <div className="space-y-6">
          {/* Plan Summary */}
          <div className="card-standard">
            <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
              {generatedPlan.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Version</div>
                <div className="font-semibold text-text-primary-light dark:text-text-primary-dark">{generatedPlan.version}</div>
              </div>
              <div>
                <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Organization</div>
                <div className="font-semibold text-text-primary-light dark:text-text-primary-dark">{generatedPlan.organization}</div>
              </div>
              <div>
                <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Generated</div>
                <div className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                  {generatedPlan.generatedDate.toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Sections</div>
                <div className="font-semibold text-text-primary-light dark:text-text-primary-dark">{generatedPlan.sections.length}</div>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-success-light dark:text-success-dark">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Configuration Management Plan generated successfully</span>
            </div>
          </div>

          {/* Sections Preview */}
          <div className="card-standard">
            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
              Plan Sections
            </h3>
            <div className="space-y-4">
              {generatedPlan.sections.map(section => (
                <div key={section.id} className="p-4 bg-surface-light dark:bg-surface-dark rounded-lg">
                  <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
                    {section.number}. {section.title}
                  </h4>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-3">
                    {section.content}
                  </p>
                  {section.subsections.length > 0 && (
                    <div className="ml-4 space-y-2">
                      {section.subsections.map(sub => (
                        <div key={sub.id} className="text-sm">
                          <span className="font-medium text-text-primary-light dark:text-text-primary-dark">
                            {sub.number}. {sub.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-standard">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                  Baseline Configurations
                </h3>
              </div>
              <div className="text-3xl font-bold text-primary-500 dark:text-primary-400">
                {generatedPlan.baselineConfigurations.length}
              </div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
                Security and system baselines defined
              </p>
            </div>

            <div className="card-standard">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <Settings className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                  Configuration Items
                </h3>
              </div>
              <div className="text-3xl font-bold text-primary-500 dark:text-primary-400">
                {generatedPlan.configurationItems.length}
              </div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
                Items tracked in CMDB
              </p>
            </div>

            <div className="card-standard">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                  Process Steps
                </h3>
              </div>
              <div className="text-3xl font-bold text-primary-500 dark:text-primary-400">
                {generatedPlan.changeControlProcess.steps.length}
              </div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
                Change control workflow steps
              </p>
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex justify-end">
            <button
              onClick={() => {
                setGeneratedPlan(null);
                setShowPreview(false);
              }}
              className="btn-secondary"
            >
              Generate New Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
