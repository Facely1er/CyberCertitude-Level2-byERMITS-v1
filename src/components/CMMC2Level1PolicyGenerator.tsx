import React, { useState } from 'react';
import { Download, FileText, CheckCircle, AlertCircle, Settings, User, Calendar, Shield } from 'lucide-react';
import { cmmc2Level1PolicyTemplates, PolicyTemplate } from '../data/templates/cmmc-2.0-level1-policies';

interface PolicyFormData {
  [key: string]: string;
}

const CMMC2Level1PolicyGenerator: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<PolicyTemplate | null>(null);
  const [formData, setFormData] = useState<PolicyFormData>({});
  const [generatedPolicy, setGeneratedPolicy] = useState<string>('');
  const [showForm, setShowForm] = useState(false);

  const handleTemplateSelect = (template: PolicyTemplate) => {
    setSelectedTemplate(template);
    setFormData({});
    setGeneratedPolicy('');
    setShowForm(true);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generatePolicy = () => {
    if (!selectedTemplate) return;

    let policy = selectedTemplate.template;
    
    // Replace placeholders with form data
    selectedTemplate.requiredFields.forEach(field => {
      const placeholder = `{{${field}}}`;
      const value = formData[field] || `[${field.toUpperCase()}]`;
      policy = policy.replace(new RegExp(placeholder, 'g'), value);
    });

    selectedTemplate.optionalFields.forEach(field => {
      const placeholder = `{{${field}}}`;
      const value = formData[field] || '';
      policy = policy.replace(new RegExp(placeholder, 'g'), value);
    });

    setGeneratedPolicy(policy);
  };

  const downloadPolicy = () => {
    if (!generatedPolicy || !selectedTemplate) return;

    const blob = new Blob([generatedPolicy], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderTemplateList = () => (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">CMMC 2.0 Level 1 Policy Generator</h1>
        <p className="text-gray-600 mb-6">
          Generate comprehensive policies for all 17 CMMC 2.0 Level 1 practices. Select a policy template below to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cmmc2Level1PolicyTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleTemplateSelect(template)}
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-500">{template.domain}</p>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{template.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Practice: {template.practiceId}</span>
                <span className="text-xs text-gray-500">v{template.version}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <Shield className="w-6 h-6 text-blue-600 mr-3 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Policy Generator Features</h3>
            <ul className="text-blue-700 space-y-1">
              <li>• Complete policy templates for all 17 CMMC 2.0 Level 1 practices</li>
              <li>• Customizable fields for organization-specific information</li>
              <li>• Professional formatting and structure</li>
              <li>• Download policies as text files for easy integration</li>
              <li>• Compliance-ready documentation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPolicyForm = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={() => setShowForm(false)}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back to Policy Templates
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedTemplate?.name}</h1>
        <p className="text-gray-600 mb-4">{selectedTemplate?.description}</p>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>Domain: {selectedTemplate?.domain}</span>
          <span>Practice: {selectedTemplate?.practiceId}</span>
          <span>Version: {selectedTemplate?.version}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Policy Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedTemplate?.requiredFields.map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} *
              </label>
              <input
                type="text"
                value={formData[field] || ''}
                onChange={(e) => handleFormChange(field, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
              />
            </div>
          ))}
          {selectedTemplate?.optionalFields.map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </label>
              <input
                type="text"
                value={formData[field] || ''}
                onChange={(e) => handleFormChange(field, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
              />
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <button
            onClick={generatePolicy}
            disabled={!selectedTemplate?.requiredFields.every(field => formData[field])}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Policy
          </button>
        </div>
      </div>

      {generatedPolicy && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Generated Policy</h2>
            <button
              onClick={downloadPolicy}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap">{generatedPolicy}</pre>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {!showForm ? renderTemplateList() : renderPolicyForm()}
    </div>
  );
};

export default CMMC2Level1PolicyGenerator;