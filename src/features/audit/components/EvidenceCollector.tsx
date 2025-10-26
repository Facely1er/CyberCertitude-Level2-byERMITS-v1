import React, { useState } from 'react';
import { FileText, Upload, Download, Search, ListFilter as Filter, Plus, CreditCard as Edit, Trash2, CircleCheck as CheckCircle, Circle as XCircle, Eye, Shield, Users, Settings, TriangleAlert as AlertTriangle } from 'lucide-react';
import { Breadcrumbs } from '../../../shared/components/layout/Breadcrumbs';

interface EvidenceCollectorProps {
  onBack: () => void;
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

interface EvidenceItem {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'screenshot' | 'configuration' | 'test-result' | 'interview' | 'observation';
  category: string;
  cmmcPractice: string;
  status: 'pending' | 'collected' | 'verified' | 'rejected';
  filePath?: string;
  uploadedDate?: Date;
  uploadedBy?: string;
  verifiedBy?: string;
  verifiedDate?: Date;
  notes: string;
  tags: string[];
}

const EVIDENCE_TYPES = [
  'document', 'screenshot', 'configuration', 'test-result', 'interview', 'observation'
] as const;

const CMMC_PRACTICES = [
  'AC.1.001', 'AC.1.002', 'AC.2.001', 'AC.2.002', 'AC.2.003',
  'AT.1.001', 'AT.1.002', 'AT.2.001', 'AT.2.002', 'AT.2.003',
  'AU.1.001', 'AU.1.002', 'AU.2.001', 'AU.2.002', 'AU.2.003',
  'CA.1.001', 'CA.1.002', 'CA.2.001', 'CA.2.002', 'CA.2.003',
  'CM.1.001', 'CM.1.002', 'CM.2.001', 'CM.2.002', 'CM.2.003'
];

const EvidenceCollector: React.FC<EvidenceCollectorProps> = ({
  onBack,
  addNotification
}) => {
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([
    {
      id: '1',
      title: 'Information Security Policy',
      description: 'Comprehensive information security policy document covering all organizational security requirements and governance framework',
      type: 'document',
      category: 'Access Control',
      cmmcPractice: 'AC.1.001',
      status: 'verified',
      filePath: '/documents/information-security-policy.pdf',
      uploadedDate: new Date('2024-01-15'),
      uploadedBy: 'Security Team',
      verifiedBy: 'CISO',
      verifiedDate: new Date('2024-01-16'),
      notes: 'Policy reviewed and approved by CISO and Board of Directors. Covers all access control requirements.',
      tags: ['policy', 'security', 'governance', 'approved']
    },
    {
      id: '2',
      title: 'User Access Review Screenshot',
      description: 'Screenshot showing quarterly user access review process and privileged account management',
      type: 'screenshot',
      category: 'Access Control',
      cmmcPractice: 'AC.2.001',
      status: 'collected',
      filePath: '/screenshots/user-access-review-q1-2024.png',
      uploadedDate: new Date('2024-01-20'),
      uploadedBy: 'IT Admin',
      notes: 'Q1 2024 quarterly review completed. All privileged accounts reviewed and validated.',
      tags: ['screenshot', 'access-review', 'quarterly', 'privileged-accounts']
    },
    {
      id: '3',
      title: 'Security Awareness Training Completion Report',
      description: 'Comprehensive report showing completion of security awareness training for all employees',
      type: 'document',
      category: 'Awareness and Training',
      cmmcPractice: 'AT.1.001',
      status: 'verified',
      filePath: '/documents/security-training-completion-q4-2023.pdf',
      uploadedDate: new Date('2024-01-05'),
      uploadedBy: 'HR Team',
      verifiedBy: 'Security Team',
      verifiedDate: new Date('2024-01-06'),
      notes: 'Q4 2023 training completed by 98% of employees. Remaining 2% scheduled for make-up sessions.',
      tags: ['training', 'completion', 'hr', 'awareness', 'verified']
    },
    {
      id: '4',
      title: 'System Configuration Baseline',
      description: 'Hardened configuration baseline for Windows Server systems and network devices',
      type: 'configuration',
      category: 'Configuration Management',
      cmmcPractice: 'CM.1.001',
      status: 'verified',
      filePath: '/configurations/windows-server-baseline-v3.2.xml',
      uploadedDate: new Date('2024-01-10'),
      uploadedBy: 'Security Engineering',
      verifiedBy: 'IT Operations',
      verifiedDate: new Date('2024-01-11'),
      notes: 'Configuration baseline validated and approved. All systems hardened according to CIS benchmarks.',
      tags: ['configuration', 'windows', 'baseline', 'hardening', 'verified']
    },
    {
      id: '5',
      title: 'Incident Response Plan',
      description: 'Comprehensive incident response plan and procedures for security incidents',
      type: 'document',
      category: 'Incident Response',
      cmmcPractice: 'IR.1.001',
      status: 'verified',
      filePath: '/documents/incident-response-plan-v4.1.pdf',
      uploadedDate: new Date('2024-01-03'),
      uploadedBy: 'Security Team',
      verifiedBy: 'Legal Team',
      verifiedDate: new Date('2024-01-04'),
      notes: 'Updated following tabletop exercise in December 2023. All procedures tested and validated.',
      tags: ['incident-response', 'procedure', 'security', 'emergency', 'verified']
    },
    {
      id: '6',
      title: 'Vulnerability Assessment Results',
      description: 'Results from quarterly vulnerability assessments and penetration testing',
      type: 'test-result',
      category: 'Security Assessment',
      cmmcPractice: 'CA.1.001',
      status: 'collected',
      filePath: '/reports/vulnerability-assessment-q4-2023.pdf',
      uploadedDate: new Date('2024-01-16'),
      uploadedBy: 'Security Team',
      notes: 'All critical vulnerabilities remediated within SLA. Medium and low priority items scheduled for next quarter.',
      tags: ['vulnerability', 'assessment', 'penetration-test', 'security', 'quarterly']
    },
    {
      id: '7',
      title: 'Risk Assessment Interview Notes',
      description: 'Interview notes from annual risk assessment with key stakeholders',
      type: 'interview',
      category: 'Risk Management',
      cmmcPractice: 'RM.1.001',
      status: 'pending',
      notes: 'Interviews scheduled with department heads and key personnel. Risk assessment in progress.',
      tags: ['risk-assessment', 'interview', 'stakeholders', 'annual']
    },
    {
      id: '8',
      title: 'System Monitoring Dashboard',
      description: 'Screenshot of security monitoring dashboard showing real-time threat detection',
      type: 'screenshot',
      category: 'Audit and Accountability',
      cmmcPractice: 'AU.1.001',
      status: 'collected',
      filePath: '/screenshots/security-dashboard-jan-2024.png',
      uploadedDate: new Date('2024-01-18'),
      uploadedBy: 'SOC Team',
      notes: 'Dashboard shows active monitoring of all critical systems. No security events detected.',
      tags: ['screenshot', 'monitoring', 'dashboard', 'soc', 'real-time']
    }
  ]);

  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const [newItem, setNewItem] = useState<Partial<EvidenceItem>>({
    title: '',
    description: '',
    type: 'document',
    category: '',
    cmmcPractice: '',
    status: 'pending',
    notes: '',
    tags: []
  });

  const [newTag, setNewTag] = useState('');

  const filteredItems = evidenceItems.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesType && matchesStatus && matchesCategory && matchesSearch;
  });

  const addEvidenceItem = () => {
    if (!newItem.title || !newItem.description || !newItem.category || !newItem.cmmcPractice) {
      addNotification('error', 'Please fill in all required fields');
      return;
    }

    const item: EvidenceItem = {
      id: Date.now().toString(),
      title: newItem.title!,
      description: newItem.description!,
      type: newItem.type!,
      category: newItem.category!,
      cmmcPractice: newItem.cmmcPractice!,
      status: newItem.status!,
      notes: newItem.notes || '',
      tags: newItem.tags || [],
      uploadedDate: new Date()
    };

    setEvidenceItems(prev => [...prev, item]);
    setNewItem({
      title: '',
      description: '',
      type: 'document',
      category: '',
      cmmcPractice: '',
      status: 'pending',
      notes: '',
      tags: []
    });
    setShowAddForm(false);
    addNotification('success', 'Evidence item added successfully');
  };

  const updateEvidenceItem = (id: string, updates: Partial<EvidenceItem>) => {
    setEvidenceItems(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
    setEditingItem(null);
    addNotification('success', 'Evidence item updated successfully');
  };

  const deleteEvidenceItem = (id: string) => {
    setEvidenceItems(prev => prev.filter(item => item.id !== id));
    addNotification('success', 'Evidence item deleted successfully');
  };

  const addTag = () => {
    if (newTag.trim()) {
      setNewItem(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setNewItem(prev => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index) || []
    }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'screenshot': return <Eye className="w-4 h-4 text-green-500" />;
      case 'configuration': return <Settings className="w-4 h-4 text-purple-500" />;
      case 'test-result': return <CheckCircle className="w-4 h-4 text-orange-500" />;
      case 'interview': return <Users className="w-4 h-4 text-indigo-500" />;
      case 'observation': return <Eye className="w-4 h-4 text-gray-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-100';
      case 'collected': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'collected': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const breadcrumbs = [
    { label: 'Audit', path: '/evidence-collector' },
    { label: 'Evidence Collector', isActive: true }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-600" />
          Evidence Collector
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Collect and manage compliance evidence for CMMC assessments
        </p>
      </div>

      {/* Evidence Categories Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Evidence Categories
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Evidence organized by CMMC practice areas and compliance domains
          </p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Access Control */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">Access Control</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Identity & Access Management</p>
                </div>
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span className="font-medium">{evidenceItems.filter(item => item.category === 'Access Control').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Verified:</span>
                  <span className="font-medium">{evidenceItems.filter(item => item.category === 'Access Control' && item.status === 'verified').length}</span>
                </div>
              </div>
            </div>

            {/* Awareness and Training */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 dark:text-green-100">Awareness & Training</h3>
                  <p className="text-sm text-green-700 dark:text-green-300">Security Education</p>
                </div>
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span className="font-medium">{evidenceItems.filter(item => item.category === 'Awareness and Training').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Verified:</span>
                  <span className="font-medium">{evidenceItems.filter(item => item.category === 'Awareness and Training' && item.status === 'verified').length}</span>
                </div>
              </div>
            </div>

            {/* Configuration Management */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-purple-900 dark:text-purple-100">Configuration Mgmt</h3>
                  <p className="text-sm text-purple-700 dark:text-purple-300">System Configuration</p>
                </div>
              </div>
              <div className="text-sm text-purple-700 dark:text-purple-300">
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span className="font-medium">{evidenceItems.filter(item => item.category === 'Configuration Management').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Verified:</span>
                  <span className="font-medium">{evidenceItems.filter(item => item.category === 'Configuration Management' && item.status === 'verified').length}</span>
                </div>
              </div>
            </div>

            {/* Incident Response */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-100">Incident Response</h3>
                  <p className="text-sm text-red-700 dark:text-red-300">Security Incidents</p>
                </div>
              </div>
              <div className="text-sm text-red-700 dark:text-red-300">
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span className="font-medium">{evidenceItems.filter(item => item.category === 'Incident Response').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Verified:</span>
                  <span className="font-medium">{evidenceItems.filter(item => item.category === 'Incident Response' && item.status === 'verified').length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Search evidence items..."
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Categories</option>
              <option value="Access Control">Access Control</option>
              <option value="Awareness and Training">Awareness and Training</option>
              <option value="Configuration Management">Configuration Management</option>
              <option value="Incident Response">Incident Response</option>
              <option value="Security Assessment">Security Assessment</option>
              <option value="Risk Management">Risk Management</option>
              <option value="Audit and Accountability">Audit and Accountability</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Types</option>
              {EVIDENCE_TYPES.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="collected">Collected</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Evidence
            </button>
          </div>
        </div>
      </div>

      {/* Evidence Items */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Evidence Items ({filteredItems.length})
          </h2>
        </div>
        <div className="p-6">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No evidence items found matching your criteria.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div key={item.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getTypeIcon(item.type)}
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {item.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status.toUpperCase()}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                          {item.type.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">
                        {item.description}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div>
                          <span className="font-medium">Category:</span> {item.category}
                        </div>
                        <div>
                          <span className="font-medium">CMMC Practice:</span> {item.cmmcPractice}
                        </div>
                        <div>
                          <span className="font-medium">Uploaded:</span> {item.uploadedDate?.toLocaleDateString() || 'Not uploaded'}
                        </div>
                      </div>
                      {item.notes && (
                        <div className="mt-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes:</span>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.notes}</p>
                        </div>
                      )}
                      {item.tags.length > 0 && (
                        <div className="mt-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.tags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingItem(item.id)}
                        className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteEvidenceItem(item.id)}
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
      </div>

      {/* Add Evidence Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add Evidence Item
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newItem.title}
                    onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    value={newItem.type}
                    onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {EVIDENCE_TYPES.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
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
                  value={newItem.description}
                  onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={newItem.category}
                    onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CMMC Practice *
                  </label>
                  <select
                    value={newItem.cmmcPractice}
                    onChange={(e) => setNewItem(prev => ({ ...prev, cmmcPractice: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Practice</option>
                    {CMMC_PRACTICES.map(practice => (
                      <option key={practice} value={practice}>{practice}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={newItem.notes}
                  onChange={(e) => setNewItem(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter tag"
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newItem.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(index)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <XCircle className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
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
                onClick={addEvidenceItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Evidence
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidenceCollector;