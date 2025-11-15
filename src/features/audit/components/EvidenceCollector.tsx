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
      case 'document': return <FileText className="w-4 h-4 text-primary-500" />;
      case 'screenshot': return <Eye className="w-4 h-4 text-success-500" />;
      case 'configuration': return <Settings className="w-4 h-4 text-purple-500" />;
      case 'test-result': return <CheckCircle className="w-4 h-4 text-orange-500" />;
      case 'interview': return <Users className="w-4 h-4 text-indigo-500" />;
      case 'observation': return <Eye className="w-4 h-4 text-text-muted-light" />;
      default: return <FileText className="w-4 h-4 text-text-muted-light" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-success-600 bg-success-100';
      case 'collected': return 'text-primary-600 bg-primary-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-error-600 bg-error-100';
      default: return 'text-text-secondary-light bg-support-light';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4 text-success-500" />;
      case 'collected': return <FileText className="w-4 h-4 text-primary-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-error-500" />;
      default: return <FileText className="w-4 h-4 text-text-muted-light" />;
    }
  };

  const breadcrumbs = [
    { label: 'Audit', path: '/evidence-collector' },
    { label: 'Evidence Collector', isActive: true }
  ];

  return (
    <div className="container-responsive section-padding">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Header */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
              <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                Evidence Collector
              </h1>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                Collect and manage compliance evidence for CMMC assessments
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Evidence Categories Overview */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg mb-8">
        <div className="p-6 border-b border-support-light dark:border-support-dark">
          <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
            Evidence Categories
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            Evidence organized by CMMC practice areas and compliance domains
          </p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Access Control */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-primary-200 dark:border-primary-800">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <Shield className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-900 dark:text-primary-100">Access Control</h3>
                  <p className="text-sm text-primary-700 dark:text-primary-300">Identity & Access Management</p>
                </div>
              </div>
              <div className="text-sm text-primary-700 dark:text-primary-300">
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
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-success-200 dark:border-success-800">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-success-100 dark:bg-success-900/30 rounded-lg">
                  <Users className="w-5 h-5 text-success-600 dark:text-success-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-success-900 dark:text-success-100">Awareness & Training</h3>
                  <p className="text-sm text-success-700 dark:text-success-300">Security Education</p>
                </div>
              </div>
              <div className="text-sm text-success-700 dark:text-success-300">
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
            <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-error-200 dark:border-error-800">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-error-100 dark:bg-error-900/30 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-error-600 dark:text-error-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-error-900 dark:text-error-100">Incident Response</h3>
                  <p className="text-sm text-error-700 dark:text-error-300">Security Incidents</p>
                </div>
              </div>
              <div className="text-sm text-error-700 dark:text-error-300">
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
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted-dark w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                placeholder="Search evidence items..."
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
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
              className="px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
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
              className="px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="collected">Collected</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Evidence
            </button>
          </div>
        </div>
      </div>

      {/* Evidence Items */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg">
        <div className="p-6 border-b border-support-light dark:border-support-dark">
          <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
            Evidence Items ({filteredItems.length})
          </h2>
        </div>
        <div className="p-6">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-text-muted-light dark:text-text-muted-dark">
              No evidence items found matching your criteria.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div key={item.id} className="border border-support-light dark:border-support-dark rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getTypeIcon(item.type)}
                        <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                          {item.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status.toUpperCase()}
                        </span>
                        <span className="px-2 py-1 bg-support-light dark:bg-surface-dark text-text-primary-light dark:text-text-secondary-dark text-xs rounded">
                          {item.type.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-text-secondary-light dark:text-text-secondary-dark mb-2">
                        {item.description}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-text-muted-light dark:text-text-muted-dark">
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
                          <span className="text-sm font-medium text-text-primary-light dark:text-text-secondary-dark">Notes:</span>
                          <p className="text-sm text-text-secondary-light dark:text-text-muted-dark mt-1">{item.notes}</p>
                        </div>
                      )}
                      {item.tags.length > 0 && (
                        <div className="mt-2">
                          <span className="text-sm font-medium text-text-primary-light dark:text-text-secondary-dark">Tags:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.tags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs rounded">
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
                        className="p-2 text-text-muted-light hover:text-primary-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteEvidenceItem(item.id)}
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
      </div>

      {/* Add Evidence Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-support-light dark:border-support-dark">
              <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                Add Evidence Item
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
                    Type
                  </label>
                  <select
                    value={newItem.type}
                    onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
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
                    Category *
                  </label>
                  <input
                    type="text"
                    value={newItem.category}
                    onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                    CMMC Practice *
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
                  {newItem.tags?.map((tag, index) => (
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
            </div>
            <div className="p-6 border-t border-support-light dark:border-support-dark flex justify-end gap-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addEvidenceItem}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
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