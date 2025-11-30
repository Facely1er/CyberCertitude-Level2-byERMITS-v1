import React, { useState, useEffect } from 'react';
import { FileText, Upload, Download, Eye, CreditCard as Edit, Trash2, Plus, Save, Search, ListFilter as Filter, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Clock, Shield, Database, Users, Settings, BookOpen, ExternalLink, RefreshCw, Calendar, Tag, Archive, Share2, ArrowLeft, Award, Target } from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';

interface EvidenceItem {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'screenshot' | 'configuration' | 'policy' | 'procedure' | 'training' | 'audit' | 'other';
  category: string;
  controlId: string;
  controlTitle: string;
  domain: string;
  status: 'draft' | 'review' | 'approved' | 'rejected';
  priority: 'critical' | 'high' | 'medium' | 'low';
  file?: File;
  fileUrl?: string;
  fileSize?: number;
  mimeType?: string;
  tags: string[];
  notes: string;
  uploadedBy: string;
  uploadedDate: Date;
  lastModified: Date;
  reviewDate?: Date;
  reviewer?: string;
  version: string;
  isRequired: boolean;
  expirationDate?: Date;
  relatedControls: string[];
}

interface EvidenceCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: React.ReactNode;
  items: EvidenceItem[];
}

interface CMMCEvidenceCollectorProps {
  selectedLevel?: number;
  onSave?: (evidence: any) => void;
  onExport?: (evidence: any) => void;
  onNavigate?: (path: string) => void;
}

const EVIDENCE_CATEGORIES: EvidenceCategory[] = [
  {
    id: 'policies-procedures',
    name: 'Policies & Procedures',
    description: 'Security policies, procedures, and governance documents',
    color: 'blue',
    icon: <FileText className="w-5 h-5" />,
    items: [
      {
        id: '1',
        title: 'Information Security Policy',
        description: 'Comprehensive information security policy document covering all organizational security requirements',
        type: 'policy',
        category: 'policies-procedures',
        controlId: 'AC.1.001',
        controlTitle: 'Establish system access requirements',
        domain: 'Access Control',
        status: 'approved',
        priority: 'critical',
        tags: ['policy', 'security', 'governance'],
        notes: 'Approved by CISO and Board of Directors',
        uploadedBy: 'Security Team',
        uploadedDate: new Date('2024-01-15'),
        lastModified: new Date('2024-01-15'),
        version: '2.1',
        isRequired: true,
        relatedControls: ['AC.1.002', 'AC.2.001']
      },
      {
        id: '2',
        title: 'Access Control Procedures',
        description: 'Detailed procedures for user access management, provisioning, and deprovisioning',
        type: 'procedure',
        category: 'policies-procedures',
        controlId: 'AC.2.001',
        controlTitle: 'Control information system access',
        domain: 'Access Control',
        status: 'review',
        priority: 'high',
        tags: ['procedure', 'access-control', 'user-management'],
        notes: 'Under review by IT Operations team',
        uploadedBy: 'IT Operations',
        uploadedDate: new Date('2024-01-20'),
        lastModified: new Date('2024-01-20'),
        version: '1.3',
        isRequired: true,
        relatedControls: ['AC.1.001', 'AC.2.002']
      }
    ]
  },
  {
    id: 'technical-configurations',
    name: 'Technical Configurations',
    description: 'System configurations, baselines, and technical settings',
    color: 'green',
    icon: <Settings className="w-5 h-5" />,
    items: [
      {
        id: '3',
        title: 'Windows Server Security Baseline',
        description: 'Hardened configuration baseline for Windows Server systems',
        type: 'configuration',
        category: 'technical-configurations',
        controlId: 'CM.1.001',
        controlTitle: 'Establish configuration baselines',
        domain: 'Configuration Management',
        status: 'approved',
        priority: 'high',
        tags: ['configuration', 'windows', 'baseline', 'hardening'],
        notes: 'Validated by Security Engineering team',
        uploadedBy: 'Security Engineering',
        uploadedDate: new Date('2024-01-10'),
        lastModified: new Date('2024-01-10'),
        version: '3.2',
        isRequired: true,
        relatedControls: ['CM.1.002', 'CM.2.001']
      },
      {
        id: '4',
        title: 'Network Firewall Rules',
        description: 'Current firewall configuration and rule sets for network security',
        type: 'configuration',
        category: 'technical-configurations',
        controlId: 'SC.1.001',
        controlTitle: 'Control communications',
        domain: 'System and Communications Protection',
        status: 'approved',
        priority: 'critical',
        tags: ['configuration', 'firewall', 'network', 'security'],
        notes: 'Reviewed and approved by Network Security team',
        uploadedBy: 'Network Security',
        uploadedDate: new Date('2024-01-12'),
        lastModified: new Date('2024-01-12'),
        version: '2.0',
        isRequired: true,
        relatedControls: ['SC.1.002', 'SC.2.001']
      }
    ]
  },
  {
    id: 'training-records',
    name: 'Training Records',
    description: 'Security awareness training and certification records',
    color: 'yellow',
    icon: <Users className="w-5 h-5" />,
    items: [
      {
        id: '5',
        title: 'Security Awareness Training Completion Report',
        description: 'Quarterly security awareness training completion report for all employees',
        type: 'training',
        category: 'training-records',
        controlId: 'AT.1.001',
        controlTitle: 'Conduct security awareness training',
        domain: 'Awareness and Training',
        status: 'approved',
        priority: 'high',
        tags: ['training', 'awareness', 'completion', 'quarterly'],
        notes: 'Q4 2023 training completed by 98% of employees',
        uploadedBy: 'HR Team',
        uploadedDate: new Date('2024-01-05'),
        lastModified: new Date('2024-01-05'),
        version: '1.0',
        isRequired: true,
        relatedControls: ['AT.1.002', 'AT.2.001']
      },
      {
        id: '6',
        title: 'CISSP Certification Records',
        description: 'Certification records for security team members holding CISSP credentials',
        type: 'certificate',
        category: 'training-records',
        controlId: 'AT.2.001',
        controlTitle: 'Provide security training',
        domain: 'Awareness and Training',
        status: 'approved',
        priority: 'medium',
        tags: ['certification', 'cissp', 'security-team', 'professional'],
        notes: '3 team members currently hold active CISSP certifications',
        uploadedBy: 'Security Team',
        uploadedDate: new Date('2024-01-08'),
        lastModified: new Date('2024-01-08'),
        version: '1.0',
        isRequired: false,
        relatedControls: ['AT.1.001', 'AT.2.002']
      }
    ]
  },
  {
    id: 'audit-logs',
    name: 'Audit Logs',
    description: 'System logs, audit trails, and monitoring records',
    color: 'purple',
    icon: <Database className="w-5 h-5" />,
    items: [
      {
        id: '7',
        title: 'System Access Audit Logs',
        description: 'Comprehensive audit logs showing system access attempts and user activities',
        type: 'log-file',
        category: 'audit-logs',
        controlId: 'AU.1.001',
        controlTitle: 'Create audit records',
        domain: 'Audit and Accountability',
        status: 'approved',
        priority: 'critical',
        tags: ['audit', 'logs', 'access', 'monitoring'],
        notes: 'Logs cover 90-day retention period as required',
        uploadedBy: 'IT Operations',
        uploadedDate: new Date('2024-01-18'),
        lastModified: new Date('2024-01-18'),
        version: '1.0',
        isRequired: true,
        relatedControls: ['AU.1.002', 'AU.2.001']
      }
    ]
  },
  {
    id: 'incident-response',
    name: 'Incident Response',
    description: 'Incident reports, response procedures, and lessons learned',
    color: 'red',
    icon: <AlertTriangle className="w-5 h-5" />,
    items: [
      {
        id: '8',
        title: 'Incident Response Plan',
        description: 'Comprehensive incident response plan and procedures for security incidents',
        type: 'procedure',
        category: 'incident-response',
        controlId: 'IR.1.001',
        controlTitle: 'Establish incident response capability',
        domain: 'Incident Response',
        status: 'approved',
        priority: 'critical',
        tags: ['incident-response', 'procedure', 'security', 'emergency'],
        notes: 'Updated following tabletop exercise in December 2023',
        uploadedBy: 'Security Team',
        uploadedDate: new Date('2024-01-03'),
        lastModified: new Date('2024-01-03'),
        version: '4.1',
        isRequired: true,
        relatedControls: ['IR.1.002', 'IR.2.001']
      },
      {
        id: '9',
        title: 'Q4 2023 Incident Summary Report',
        description: 'Summary report of security incidents handled in Q4 2023',
        type: 'audit-report',
        category: 'incident-response',
        controlId: 'IR.2.001',
        controlTitle: 'Track and document incidents',
        domain: 'Incident Response',
        status: 'approved',
        priority: 'medium',
        tags: ['incident-report', 'quarterly', 'summary', 'lessons-learned'],
        notes: '3 minor incidents resolved, 0 major incidents',
        uploadedBy: 'Security Team',
        uploadedDate: new Date('2024-01-02'),
        lastModified: new Date('2024-01-02'),
        version: '1.0',
        isRequired: true,
        relatedControls: ['IR.1.001', 'IR.2.002']
      }
    ]
  },
  {
    id: 'risk-assessments',
    name: 'Risk Assessments',
    description: 'Risk assessments, threat models, and vulnerability reports',
    color: 'orange',
    icon: <Shield className="w-5 h-5" />,
    items: [
      {
        id: '10',
        title: 'Annual Risk Assessment Report',
        description: 'Comprehensive annual risk assessment covering all organizational assets and threats',
        type: 'assessment-report',
        category: 'risk-assessments',
        controlId: 'RM.1.001',
        controlTitle: 'Identify and assess risks',
        domain: 'Risk Management',
        status: 'review',
        priority: 'high',
        tags: ['risk-assessment', 'annual', 'threats', 'vulnerabilities'],
        notes: 'Under review by Risk Management Committee',
        uploadedBy: 'Risk Management',
        uploadedDate: new Date('2024-01-14'),
        lastModified: new Date('2024-01-14'),
        version: '1.0',
        isRequired: true,
        relatedControls: ['RM.1.002', 'RM.2.001']
      },
      {
        id: '11',
        title: 'Vulnerability Assessment Results',
        description: 'Results from quarterly vulnerability assessments and penetration testing',
        type: 'vulnerability-scan',
        category: 'risk-assessments',
        controlId: 'CA.1.001',
        controlTitle: 'Develop security assessments',
        domain: 'Security Assessment',
        status: 'approved',
        priority: 'high',
        tags: ['vulnerability', 'assessment', 'penetration-test', 'security'],
        notes: 'All critical vulnerabilities remediated within SLA',
        uploadedBy: 'Security Team',
        uploadedDate: new Date('2024-01-16'),
        lastModified: new Date('2024-01-16'),
        version: '1.0',
        isRequired: true,
        relatedControls: ['CA.1.002', 'CA.2.001']
      }
    ]
  }
];

const EVIDENCE_TYPES = [
  { value: 'document', label: 'Document', icon: <FileText className="w-4 h-4" /> },
  { value: 'screenshot', label: 'Screenshot', icon: <Eye className="w-4 h-4" /> },
  { value: 'configuration', label: 'Configuration', icon: <Settings className="w-4 h-4" /> },
  { value: 'policy', label: 'Policy', icon: <BookOpen className="w-4 h-4" /> },
  { value: 'procedure', label: 'Procedure', icon: <FileText className="w-4 h-4" /> },
  { value: 'training', label: 'Training', icon: <Users className="w-4 h-4" /> },
  { value: 'audit', label: 'Audit', icon: <CheckCircle className="w-4 h-4" /> },
  { value: 'certificate', label: 'Certificate', icon: <Award className="w-4 h-4" /> },
  { value: 'log-file', label: 'Log File', icon: <Database className="w-4 h-4" /> },
  { value: 'assessment-report', label: 'Assessment Report', icon: <Shield className="w-4 h-4" /> },
  { value: 'vulnerability-scan', label: 'Vulnerability Scan', icon: <AlertTriangle className="w-4 h-4" /> },
  { value: 'penetration-test', label: 'Penetration Test', icon: <Target className="w-4 h-4" /> },
  { value: 'other', label: 'Other', icon: <Archive className="w-4 h-4" /> }
];

const CMMC_CONTROLS = [
  { id: 'AC.1.001', title: 'Establish system access requirements', domain: 'Access Control' },
  { id: 'AC.1.002', title: 'Control information system access', domain: 'Access Control' },
  { id: 'AT.1.001', title: 'Conduct security awareness training', domain: 'Awareness and Training' },
  { id: 'AU.1.001', title: 'Create audit records', domain: 'Audit and Accountability' },
  { id: 'CM.1.001', title: 'Establish configuration baselines', domain: 'Configuration Management' },
  { id: 'IA.1.001', title: 'Identify information system users', domain: 'Identification and Authentication' },
  { id: 'IR.1.001', title: 'Establish incident response capability', domain: 'Incident Response' },
  { id: 'MA.1.001', title: 'Perform maintenance on information systems', domain: 'Maintenance' },
  { id: 'MP.1.001', title: 'Protect information system media', domain: 'Media Protection' },
  { id: 'PS.1.001', title: 'Screen personnel', domain: 'Personnel Security' },
  { id: 'PE.1.001', title: 'Limit physical access', domain: 'Physical Protection' },
  { id: 'RE.1.001', title: 'Implement recovery procedures', domain: 'Recovery' },
  { id: 'RM.1.001', title: 'Identify and assess risks', domain: 'Risk Management' },
  { id: 'CA.1.001', title: 'Develop security assessments', domain: 'Security Assessment' },
  { id: 'SC.1.001', title: 'Control communications', domain: 'System and Communications Protection' },
  { id: 'SI.1.001', title: 'Identify and report flaws', domain: 'System and Information Integrity' }
];

const CMMCEvidenceCollector: React.FC<CMMCEvidenceCollectorProps> = ({
  selectedLevel = 2,
  onSave,
  onExport,
  onNavigate
}) => {
  const [categories, setCategories] = useState<EvidenceCategory[]>(EVIDENCE_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState<string>('policies-procedures');
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [overallProgress, setOverallProgress] = useState(0);

  // Filter controls based on selected level
  const filteredControls = CMMC_CONTROLS.filter(control => {
    const controlLevel = parseInt(control.id.split('.')[1]);
    return controlLevel === selectedLevel;
  });

  const [newItem, setNewItem] = useState<Partial<EvidenceItem>>({
    title: '',
    description: '',
    type: 'document',
    category: 'policies-procedures',
    controlId: '',
    controlTitle: '',
    domain: '',
    status: 'draft',
    priority: 'medium',
    tags: [],
    notes: '',
    uploadedBy: 'Current User',
    uploadedDate: new Date(),
    lastModified: new Date(),
    version: '1.0',
    isRequired: false,
    relatedControls: []
  });

  const [newTag, setNewTag] = useState('');

  // Calculate overall progress
  useEffect(() => {
    const totalItems = categories.reduce((acc, category) => acc + category.items.length, 0);
    const approvedItems = categories.reduce((acc, category) => 
      acc + category.items.filter(item => item.status === 'approved').length, 0
    );
    setOverallProgress(totalItems > 0 ? Math.round((approvedItems / totalItems) * 100) : 0);
  }, [categories]);

  const addEvidenceItem = () => {
    if (!newItem.title || !newItem.description || !newItem.controlId) {
      return;
    }

    const item: EvidenceItem = {
      id: Date.now().toString(),
      title: newItem.title!,
      description: newItem.description!,
      type: newItem.type!,
      category: newItem.category!,
      controlId: newItem.controlId!,
      controlTitle: newItem.controlTitle!,
      domain: newItem.domain!,
      status: newItem.status!,
      priority: newItem.priority!,
      file: newItem.file,
      fileUrl: newItem.fileUrl,
      fileSize: newItem.fileSize,
      mimeType: newItem.mimeType,
      tags: newItem.tags || [],
      notes: newItem.notes || '',
      uploadedBy: newItem.uploadedBy!,
      uploadedDate: newItem.uploadedDate!,
      lastModified: newItem.lastModified!,
      version: newItem.version!,
      isRequired: newItem.isRequired || false,
      expirationDate: newItem.expirationDate,
      relatedControls: newItem.relatedControls || []
    };

    setCategories(prev => prev.map(category => {
      if (category.id === newItem.category) {
        return {
          ...category,
          items: [...category.items, item]
        };
      }
      return category;
    }));

    setNewItem({
      title: '',
      description: '',
      type: 'document',
      category: 'policies-procedures',
      controlId: '',
      controlTitle: '',
      domain: '',
      status: 'draft',
      priority: 'medium',
      tags: [],
      notes: '',
      uploadedBy: 'Current User',
      uploadedDate: new Date(),
      lastModified: new Date(),
      version: '1.0',
      isRequired: false,
      relatedControls: []
    });
    setShowAddForm(false);
  };

  const updateEvidenceItem = (categoryId: string, itemId: string, updates: Partial<EvidenceItem>) => {
    setCategories(prev => prev.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.map(item => 
            item.id === itemId ? { ...item, ...updates, lastModified: new Date() } : item
          )
        };
      }
      return category;
    }));
  };

  const deleteEvidenceItem = (categoryId: string, itemId: string) => {
    setCategories(prev => prev.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.filter(item => item.id !== itemId)
        };
      }
      return category;
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !newItem.tags?.includes(newTag.trim())) {
      setNewItem(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setNewItem(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }));
  };

  const handleFileUpload = (file: File) => {
    setNewItem(prev => ({
      ...prev,
      file,
      fileUrl: URL.createObjectURL(file),
      fileSize: file.size,
      mimeType: file.type
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-success-600 bg-success-100';
      case 'review': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-error-600 bg-error-100';
      default: return 'text-text-secondary-light bg-support-light';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-error-600 bg-error-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-success-600 bg-success-100';
    }
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = EVIDENCE_TYPES.find(t => t.value === type);
    return typeConfig?.icon || <FileText className="w-4 h-4" />;
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    items: category.items.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.controlId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
      const matchesType = filterType === 'all' || item.type === filterType;
      const matchesPriority = filterPriority === 'all' || item.priority === filterPriority;
      
      return matchesSearch && matchesStatus && matchesType && matchesPriority;
    })
  }));

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
              CMMC Evidence Collection
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
              Collect, organize, and manage evidence for CMMC 2.0 Level 2 compliance
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Evidence
            </button>
            <button
              onClick={() => onSave?.(categories)}
              className="flex items-center gap-2 px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={() => onExport?.(categories)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
              Evidence Collection Progress
            </h3>
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {overallProgress}%
            </span>
          </div>
          <div className="w-full bg-support-light dark:bg-surface-dark rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-2">
            {categories.reduce((acc, category) => acc + category.items.filter(item => item.status === 'approved').length, 0)} of {categories.reduce((acc, category) => acc + category.items.length, 0)} evidence items approved
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted-dark w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
              placeholder="Search evidence..."
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
          >
            <option value="all">All Types</option>
            {EVIDENCE_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                activeCategory === category.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-support-light dark:border-support-dark hover:border-support-light dark:hover:border-support-light'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-${category.color}-100 text-${category.color}-600`}>
                  {category.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                    {category.name}
                  </h4>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    {category.items.length} items
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary-light dark:text-text-secondary-dark">Approved</span>
                  <span className="font-medium text-text-primary-light dark:text-text-primary-dark">
                    {category.items.filter(item => item.status === 'approved').length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary-light dark:text-text-secondary-dark">In Review</span>
                  <span className="font-medium text-text-primary-light dark:text-text-primary-dark">
                    {category.items.filter(item => item.status === 'review').length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary-light dark:text-text-secondary-dark">Draft</span>
                  <span className="font-medium text-text-primary-light dark:text-text-primary-dark">
                    {category.items.filter(item => item.status === 'draft').length}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCategoryItems = () => {
    const category = categories.find(c => c.id === activeCategory);
    if (!category) return null;

    return (
      <div className="space-y-6">
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                {category.name}
              </h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
                {category.description}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Evidence
              </button>
              <button
                onClick={() => setActiveCategory('')}
                className="flex items-center gap-2 px-4 py-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Overview
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {category.items.length === 0 ? (
              <div className="text-center py-8 text-text-muted-light dark:text-text-muted-dark">
                No evidence items found. Click "Add Evidence" to get started.
              </div>
            ) : (
              category.items.map((item) => (
                <div
                  key={item.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    activeItem === item.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-support-light dark:border-support-dark hover:border-support-light dark:hover:border-support-light'
                  }`}
                  onClick={() => {
                    setActiveItem(item.id);
                    setShowItemDetails(true);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-support-light dark:bg-surface-dark rounded-lg">
                          {getTypeIcon(item.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                            {item.title}
                          </h4>
                          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                          {item.priority.toUpperCase()}
                        </span>
                        <span className="text-xs text-text-muted-light dark:text-text-muted-dark">
                          {item.controlId}
                        </span>
                        {item.isRequired && (
                          <span className="px-2 py-1 bg-error-100 dark:bg-error-900 text-error-800 dark:text-error-200 text-xs rounded-full">
                            REQUIRED
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 mt-2 text-xs text-text-muted-light dark:text-text-muted-dark">
                        <span>Uploaded: {item.uploadedDate.toLocaleDateString()}</span>
                        <span>Version: {item.version}</span>
                        {item.fileSize && (
                          <span>Size: {(item.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                        )}
                      </div>

                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateEvidenceItem(category.id, item.id, { status: 'approved' });
                        }}
                        className="p-2 text-text-muted-light hover:text-success-600 transition-colors"
                        title="Approve"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateEvidenceItem(category.id, item.id, { status: 'review' });
                        }}
                        className="p-2 text-text-muted-light hover:text-yellow-600 transition-colors"
                        title="Mark for Review"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteEvidenceItem(category.id, item.id);
                        }}
                        className="p-2 text-text-muted-light hover:text-error-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderAddForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
                placeholder="Enter evidence title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                Type *
              </label>
              <select
                value={newItem.type}
                onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
              >
                {EVIDENCE_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
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
              placeholder="Enter evidence description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                CMMC Control *
              </label>
              <select
                value={newItem.controlId}
                onChange={(e) => {
                  const control = filteredControls.find(c => c.id === e.target.value);
                  setNewItem(prev => ({
                    ...prev,
                    controlId: e.target.value,
                    controlTitle: control?.title || '',
                    domain: control?.domain || ''
                  }));
                }}
                className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
              >
                <option value="">Select Control</option>
                {filteredControls.map(control => (
                  <option key={control.id} value={control.id}>
                    {control.id} - {control.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                Category *
              </label>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                Priority
              </label>
              <select
                value={newItem.priority}
                onChange={(e) => setNewItem(prev => ({ ...prev, priority: e.target.value as any }))}
                className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                Status
              </label>
              <select
                value={newItem.status}
                onChange={(e) => setNewItem(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
              >
                <option value="draft">Draft</option>
                <option value="review">Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newItem.isRequired}
                  onChange={(e) => setNewItem(prev => ({ ...prev, isRequired: e.target.checked }))}
                  className="rounded border-support-light text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-text-primary-light dark:text-text-secondary-dark">Required</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
              File Upload
            </label>
            <input
              type="file"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
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
              {(newItem.tags || []).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-sm rounded-full"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-primary-600 hover:text-primary-800"
                  >
                    <XCircle className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
              Notes
            </label>
            <textarea
              value={newItem.notes}
              onChange={(e) => setNewItem(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
              placeholder="Enter additional notes"
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
            onClick={addEvidenceItem}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Add Evidence
          </button>
        </div>
      </div>
    </div>
  );

  const breadcrumbs = [
    { label: 'Evidence', path: '/evidence' },
    { label: 'CMMC Evidence Collector', isActive: true }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      {!activeCategory && renderOverview()}
      {activeCategory && renderCategoryItems()}
      {showAddForm && renderAddForm()}
    </div>
  );
};

export default CMMCEvidenceCollector;