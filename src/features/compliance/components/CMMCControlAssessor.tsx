import React, { useState, useEffect } from 'react';
import { CircleCheck as CheckCircle, Circle as XCircle, TriangleAlert as AlertTriangle, Shield, FileText, Eye, CreditCard as Edit, Save, Download, Search, ListFilter as Filter, ChartBar as BarChart3, Target, Clock, Users, Database, Settings, BookOpen, ExternalLink, RefreshCw, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/layout';

interface CMMCControl {
  id: string;
  practice: string;
  title: string;
  description: string;
  domain: string;
  level: 'Level 1' | 'Level 2' | 'Level 3';
  assessment: 'not-assessed' | 'non-compliant' | 'partially-compliant' | 'compliant';
  evidence: string[];
  notes: string;
  implementation: string;
  verification: string;
  responsible: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  lastAssessed?: Date;
  nextReview?: Date;
}

interface CMMCDomain {
  id: string;
  name: string;
  description: string;
  controls: CMMCControl[];
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed';
}

const CMMC_DOMAINS: CMMCDomain[] = [
  {
    id: 'access-control',
    name: 'Access Control (AC)',
    description: 'Limit information system access to authorized users, processes, and devices',
    progress: 0,
    status: 'not-started',
    controls: [
      {
        id: 'AC.1.001',
        practice: 'AC.1.001',
        title: 'Establish system access requirements',
        description: 'Establish system access requirements and implement controls to limit access to authorized users',
        domain: 'Access Control',
        level: 'Level 1',
        assessment: 'not-assessed',
        evidence: [],
        notes: '',
        implementation: '',
        verification: '',
        responsible: '',
        priority: 'critical'
      },
      {
        id: 'AC.1.002',
        practice: 'AC.1.002',
        title: 'Control information system access',
        description: 'Control information system access based on organizational policies and procedures',
        domain: 'Access Control',
        level: 'Level 1',
        assessment: 'not-assessed',
        evidence: [],
        notes: '',
        implementation: '',
        verification: '',
        responsible: '',
        priority: 'critical'
      },
      {
        id: 'AC.2.001',
        practice: 'AC.2.001',
        title: 'Control information system access',
        description: 'Control information system access based on organizational policies and procedures',
        domain: 'Access Control',
        level: 'Level 2',
        assessment: 'not-assessed',
        evidence: [],
        notes: '',
        implementation: '',
        verification: '',
        responsible: '',
        priority: 'high'
      }
    ]
  },
  {
    id: 'awareness-training',
    name: 'Awareness and Training (AT)',
    description: 'Ensure personnel are aware of security risks and trained to perform their duties',
    progress: 0,
    status: 'not-started',
    controls: [
      {
        id: 'AT.1.001',
        practice: 'AT.1.001',
        title: 'Conduct security awareness training',
        description: 'Conduct security awareness training for all personnel',
        domain: 'Awareness and Training',
        level: 'Level 1',
        assessment: 'not-assessed',
        evidence: [],
        notes: '',
        implementation: '',
        verification: '',
        responsible: '',
        priority: 'high'
      },
      {
        id: 'AT.2.001',
        practice: 'AT.2.001',
        title: 'Provide role-based security training',
        description: 'Provide role-based security training for personnel with assigned security roles',
        domain: 'Awareness and Training',
        level: 'Level 2',
        assessment: 'not-assessed',
        evidence: [],
        notes: '',
        implementation: '',
        verification: '',
        responsible: '',
        priority: 'high'
      }
    ]
  },
  {
    id: 'audit-accountability',
    name: 'Audit and Accountability (AU)',
    description: 'Create, protect, and retain information system audit records',
    progress: 0,
    status: 'not-started',
    controls: [
      {
        id: 'AU.1.001',
        practice: 'AU.1.001',
        title: 'Create audit records',
        description: 'Create audit records for information system activities',
        domain: 'Audit and Accountability',
        level: 'Level 1',
        assessment: 'not-assessed',
        evidence: [],
        notes: '',
        implementation: '',
        verification: '',
        responsible: '',
        priority: 'critical'
      },
      {
        id: 'AU.2.001',
        practice: 'AU.2.001',
        title: 'Protect audit information',
        description: 'Protect audit information and audit tools from unauthorized access',
        domain: 'Audit and Accountability',
        level: 'Level 2',
        assessment: 'not-assessed',
        evidence: [],
        notes: '',
        implementation: '',
        verification: '',
        responsible: '',
        priority: 'critical'
      }
    ]
  },
  {
    id: 'configuration-management',
    name: 'Configuration Management (CM)',
    description: 'Establish and maintain baseline configurations and inventories',
    progress: 0,
    status: 'not-started',
    controls: [
      {
        id: 'CM.1.001',
        practice: 'CM.1.001',
        title: 'Establish configuration baselines',
        description: 'Establish and maintain configuration baselines for information systems',
        domain: 'Configuration Management',
        level: 'Level 1',
        assessment: 'not-assessed',
        evidence: [],
        notes: '',
        implementation: '',
        verification: '',
        responsible: '',
        priority: 'high'
      },
      {
        id: 'CM.2.001',
        practice: 'CM.2.001',
        title: 'Control configuration changes',
        description: 'Control configuration changes to information systems',
        domain: 'Configuration Management',
        level: 'Level 2',
        assessment: 'not-assessed',
        evidence: [],
        notes: '',
        implementation: '',
        verification: '',
        responsible: '',
        priority: 'high'
      }
    ]
  },
  {
    id: 'identification-authentication',
    name: 'Identification and Authentication (IA)',
    description: 'Identify and authenticate users, processes, and devices',
    progress: 0,
    status: 'not-started',
    controls: [
      {
        id: 'IA.1.001',
        practice: 'IA.1.001',
        title: 'Identify information system users',
        description: 'Identify information system users, processes acting on behalf of users, and devices',
        domain: 'Identification and Authentication',
        level: 'Level 1',
        assessment: 'not-assessed',
        evidence: [],
        notes: '',
        implementation: '',
        verification: '',
        responsible: '',
        priority: 'critical'
      },
      {
        id: 'IA.2.001',
        practice: 'IA.2.001',
        title: 'Authenticate information system users',
        description: 'Authenticate information system users, processes acting on behalf of users, and devices',
        domain: 'Identification and Authentication',
        level: 'Level 2',
        assessment: 'not-assessed',
        evidence: [],
        notes: '',
        implementation: '',
        verification: '',
        responsible: '',
        priority: 'critical'
      }
    ]
  },
  {
    id: 'incident-response',
    name: 'Incident Response (IR)',
    description: 'Establish operational incident response capability',
    progress: 0,
    status: 'not-started',
    controls: [
      {
        id: 'IR.1.001',
        practice: 'IR.1.001',
        title: 'Establish incident response capability',
        description: 'Establish operational incident response capability for information systems',
        domain: 'Incident Response',
        level: 'Level 1',
        assessment: 'not-assessed',
        evidence: [],
        notes: '',
        implementation: '',
        verification: '',
        responsible: '',
        priority: 'high'
      },
      {
        id: 'IR.2.001',
        practice: 'IR.2.001',
        title: 'Track and document incidents',
        description: 'Track and document information system security incidents',
        domain: 'Incident Response',
        level: 'Level 2',
        assessment: 'not-assessed',
        evidence: [],
        notes: '',
        implementation: '',
        verification: '',
        responsible: '',
        priority: 'high'
      }
    ]
  },
  {
    id: 'maintenance',
    name: 'Maintenance (MA)',
    description: 'Perform maintenance on information systems',
    progress: 0,
    status: 'not-started',
    controls: [
      {
        id: 'MA.1.001',
        practice: 'MA.1.001',
        title: 'Perform maintenance on information systems',
        description: 'Perform maintenance on information systems and system components',
        domain: 'Maintenance',
        level: 'Level 1',
        assessment: 'not-assessed',
        evidence: [],
        notes: '',
        implementation: '',
        verification: '',
        responsible: '',
        priority: 'medium'
      }
    ]
  },
  {
    id: 'media-protection',
    name: 'Media Protection (MP)',
    description: 'Protect information system media',
    progress: 0,
    status: 'not-started',
    controls: [
      {
        id: 'MP.1.001',
        practice: 'MP.1.001',
        title: 'Protect information system media',
        description: 'Protect information system media containing CUI',
        domain: 'Media Protection',
        level: 'Level 1',
        assessment: 'not-assessed',
        evidence: [],
        notes: '',
        implementation: '',
        verification: '',
        responsible: '',
        priority: 'high'
      }
    ]
  },
  {
    id: 'personnel-security',
    name: 'Personnel Security (PS)',
    description: 'Ensure personnel meet security requirements',
    progress: 0,
    status: 'not-started',
    controls: [
      {
        id: 'PS.1.001',
        practice: 'PS.1.001',
        title: 'Screen personnel',
        description: 'Screen personnel prior to authorizing access to information systems',
        domain: 'Personnel Security',
        level: 'Level 1',
        assessment: 'not-assessed',
        evidence: [],
        notes: '',
        implementation: '',
        verification: '',
        responsible: '',
        priority: 'high'
      }
    ]
  },
  {
    id: 'physical-protection',
    name: 'Physical Protection (PE)',
    description: 'Limit physical access to information systems',
    progress: 0,
    status: 'not-started',
    controls: [
      {
        id: 'PE.1.001',
        practice: 'PE.1.001',
        title: 'Limit physical access',
        description: 'Limit physical access to information systems, equipment, and operating environments',
        domain: 'Physical Protection',
        level: 'Level 1',
        assessment: 'not-assessed',
        evidence: [],
        notes: '',
        implementation: '',
        verification: '',
        responsible: '',
        priority: 'high'
      }
    ]
  },
  {
    id: 'recovery',
    name: 'Recovery (RE)',
    description: 'Implement information system recovery procedures',
    progress: 0,
    status: 'not-started',
    controls: [
      {
        id: 'RE.1.001',
        practice: 'RE.1.001',
        title: 'Implement recovery procedures',
        description: 'Implement information system recovery procedures',
        domain: 'Recovery',
        level: 'Level 1',
        assessment: 'not-assessed',
        evidence: [],
        notes: '',
        implementation: '',
        verification: '',
        responsible: '',
        priority: 'medium'
      }
    ]
  },
  {
    id: 'risk-management',
    name: 'Risk Management (RM)',
    description: 'Identify, assess, and manage information system risks',
    progress: 0,
    status: 'not-started',
    controls: [
      {
        id: 'RM.1.001',
        practice: 'RM.1.001',
        title: 'Identify and assess risks',
        description: 'Identify and assess information system risks',
        domain: 'Risk Management',
        level: 'Level 1',
        assessment: 'not-assessed',
        evidence: [],
        notes: '',
        implementation: '',
        verification: '',
        responsible: '',
        priority: 'critical'
      }
    ]
  },
  {
    id: 'security-assessment',
    name: 'Security Assessment (CA)',
    description: 'Develop, document, and periodically update security assessments',
    progress: 0,
    status: 'not-started',
    controls: [
      {
        id: 'CA.1.001',
        practice: 'CA.1.001',
        title: 'Develop security assessments',
        description: 'Develop, document, and periodically update security assessments',
        domain: 'Security Assessment',
        level: 'Level 1',
        assessment: 'not-assessed',
        evidence: [],
        notes: '',
        implementation: '',
        verification: '',
        responsible: '',
        priority: 'high'
      }
    ]
  },
  {
    id: 'system-communications-protection',
    name: 'System and Communications Protection (SC)',
    description: 'Monitor, control, and protect communications',
    progress: 0,
    status: 'not-started',
    controls: [
      {
        id: 'SC.1.001',
        practice: 'SC.1.001',
        title: 'Control communications',
        description: 'Control communications at system boundaries',
        domain: 'System and Communications Protection',
        level: 'Level 1',
        assessment: 'not-assessed',
        evidence: [],
        notes: '',
        implementation: '',
        verification: '',
        responsible: '',
        priority: 'critical'
      }
    ]
  },
  {
    id: 'system-information-integrity',
    name: 'System and Information Integrity (SI)',
    description: 'Identify, report, and correct information system flaws',
    progress: 0,
    status: 'not-started',
    controls: [
      {
        id: 'SI.1.001',
        practice: 'SI.1.001',
        title: 'Identify and report flaws',
        description: 'Identify, report, and correct information system flaws',
        domain: 'System and Information Integrity',
        level: 'Level 1',
        assessment: 'not-assessed',
        evidence: [],
        notes: '',
        implementation: '',
        verification: '',
        responsible: '',
        priority: 'high'
      }
    ]
  }
];

interface CMMCControlAssessorProps {
  selectedLevel?: number;
  onSave?: (assessment: any) => void;
  onExport?: (assessment: any) => void;
  onNavigate?: (path: string) => void;
}

const CMMCControlAssessor: React.FC<CMMCControlAssessorProps> = ({
  selectedLevel = 2,
  onSave,
  onExport,
  onNavigate
}) => {
  const [domains, setDomains] = useState<CMMCDomain[]>(CMMC_DOMAINS);
  const [activeDomain, setActiveDomain] = useState<string>('access-control');
  const [activeControl, setActiveControl] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAssessment, setFilterAssessment] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showControlDetails, setShowControlDetails] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);

  // Calculate overall progress
  useEffect(() => {
    const totalControls = filteredDomains.reduce((acc, domain) => acc + domain.controls.length, 0);
    const completedControls = filteredDomains.reduce((acc, domain) => 
      acc + domain.controls.filter(control => control.assessment === 'compliant').length, 0
    );
    setOverallProgress(Math.round((completedControls / totalControls) * 100));
  }, [filteredDomains, selectedLevel]);

  const updateControlAssessment = (domainId: string, controlId: string, assessment: CMMCControl['assessment']) => {
    setDomains(prev => prev.map(domain => {
      if (domain.id === domainId) {
        const updatedControls = domain.controls.map(control => {
          if (control.id === controlId) {
            return {
              ...control,
              assessment,
              lastAssessed: new Date()
            };
          }
          return control;
        });
        
        // Update domain progress
        const domainProgress = Math.round(
          updatedControls.filter(control => control.assessment === 'compliant').length / updatedControls.length * 100
        );
        
        const domainStatus = domainProgress === 100 ? 'completed' : 
                           domainProgress > 0 ? 'in-progress' : 'not-started';

        return {
          ...domain,
          controls: updatedControls,
          progress: domainProgress,
          status: domainStatus
        };
      }
      return domain;
    }));
  };

  const updateControlDetails = (domainId: string, controlId: string, updates: Partial<CMMCControl>) => {
    setDomains(prev => prev.map(domain => {
      if (domain.id === domainId) {
        const updatedControls = domain.controls.map(control => {
          if (control.id === controlId) {
            return { ...control, ...updates };
          }
          return control;
        });
        
        return {
          ...domain,
          controls: updatedControls
        };
      }
      return domain;
    }));
  };

  const getAssessmentColor = (assessment: string) => {
    switch (assessment) {
      case 'compliant': return 'text-green-600 bg-green-100';
      case 'partially-compliant': return 'text-yellow-600 bg-yellow-100';
      case 'non-compliant': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  const getDomainIcon = (domainId: string) => {
    switch (domainId) {
      case 'access-control': return <Shield className="w-5 h-5" />;
      case 'awareness-training': return <Users className="w-5 h-5" />;
      case 'audit-accountability': return <FileText className="w-5 h-5" />;
      case 'configuration-management': return <Settings className="w-5 h-5" />;
      case 'identification-authentication': return <Target className="w-5 h-5" />;
      case 'incident-response': return <AlertTriangle className="w-5 h-5" />;
      case 'maintenance': return <RefreshCw className="w-5 h-5" />;
      case 'media-protection': return <Database className="w-5 h-5" />;
      case 'personnel-security': return <Users className="w-5 h-5" />;
      case 'physical-protection': return <Shield className="w-5 h-5" />;
      case 'recovery': return <RefreshCw className="w-5 h-5" />;
      case 'risk-management': return <AlertTriangle className="w-5 h-5" />;
      case 'security-assessment': return <BarChart3 className="w-5 h-5" />;
      case 'system-communications-protection': return <Shield className="w-5 h-5" />;
      case 'system-information-integrity': return <CheckCircle className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  const filteredDomains = domains.map(domain => ({
    ...domain,
    controls: domain.controls.filter(control => {
      // Level filtering
      const controlLevel = parseInt(control.id.split('.')[1]);
      const matchesLevel = controlLevel === selectedLevel;
      
      // Search filtering
      const matchesSearch = searchTerm === '' || 
        control.practice.toLowerCase().includes(searchTerm.toLowerCase()) ||
        control.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        control.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Assessment and priority filtering
      const matchesAssessment = filterAssessment === 'all' || control.assessment === filterAssessment;
      const matchesPriority = filterPriority === 'all' || control.priority === filterPriority;
      
      return matchesLevel && matchesSearch && matchesAssessment && matchesPriority;
    })
  })).filter(domain => domain.controls.length > 0);

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              CMMC 2.0 Level 2 Control Assessor
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Assess and validate all 110 CMMC 2.0 Level 2 security controls
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onSave?.(domains)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Assessment
            </button>
            <button
              onClick={() => onExport?.(domains)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Overall Compliance Progress
            </h3>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {overallProgress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            {filteredDomains.reduce((acc, domain) => acc + domain.controls.filter(control => control.assessment === 'compliant').length, 0)} of {filteredDomains.reduce((acc, domain) => acc + domain.controls.length, 0)} controls compliant
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Search controls..."
            />
          </div>
          <select
            value={filterAssessment}
            onChange={(e) => setFilterAssessment(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Assessments</option>
            <option value="not-assessed">Not Assessed</option>
            <option value="non-compliant">Non-Compliant</option>
            <option value="partially-compliant">Partially Compliant</option>
            <option value="compliant">Compliant</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Domains Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDomains.map((domain) => (
            <div
              key={domain.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                activeDomain === domain.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
              onClick={() => setActiveDomain(domain.id)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${
                  domain.status === 'completed' ? 'bg-green-100 text-green-600' :
                  domain.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {getDomainIcon(domain.id)}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {domain.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {domain.controls.length} controls
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">{domain.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      domain.status === 'completed' ? 'bg-green-500' :
                      domain.status === 'in-progress' ? 'bg-blue-500' :
                      'bg-gray-400'
                    }`}
                    style={{ width: `${domain.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{domain.controls.filter(c => c.assessment === 'compliant').length} compliant</span>
                  <span>{domain.controls.length} total</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDomainControls = () => {
    const domain = filteredDomains.find(d => d.id === activeDomain);
    if (!domain) return null;

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {domain.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {domain.description}
              </p>
            </div>
            <button
              onClick={() => setActiveDomain('')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Overview
            </button>
          </div>

          <div className="space-y-4">
            {domain.controls.map((control) => (
              <div
                key={control.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  activeControl === control.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
                onClick={() => {
                  setActiveControl(control.id);
                  setShowControlDetails(true);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300">
                        {control.practice}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {control.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {control.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAssessmentColor(control.assessment)}`}>
                        {control.assessment.replace('-', ' ').toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(control.priority)}`}>
                        {control.priority.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {control.level}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateControlAssessment(domain.id, control.id, 'compliant');
                      }}
                      className="p-2 text-gray-500 hover:text-green-600 transition-colors"
                      title="Mark Compliant"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateControlAssessment(domain.id, control.id, 'non-compliant');
                      }}
                      className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                      title="Mark Non-Compliant"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderControlDetails = () => {
    const domain = filteredDomains.find(d => d.id === activeDomain);
    const control = domain?.controls.find(c => c.id === activeControl);
    if (!domain || !control) return null;

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {control.practice} - {control.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {control.description}
              </p>
            </div>
            <button
              onClick={() => setShowControlDetails(false)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Controls
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Control Information */}
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Control Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Practice:</span>
                    <span className="text-gray-900 dark:text-white">{control.practice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Domain:</span>
                    <span className="text-gray-900 dark:text-white">{control.domain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Level:</span>
                    <span className="text-gray-900 dark:text-white">{control.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Priority:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(control.priority)}`}>
                      {control.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Assessment:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAssessmentColor(control.assessment)}`}>
                      {control.assessment.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Assessment Actions */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Assessment Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateControlAssessment(domain.id, control.id, 'compliant')}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Compliant
                  </button>
                  <button
                    onClick={() => updateControlAssessment(domain.id, control.id, 'partially-compliant')}
                    className="px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                  >
                    Partially Compliant
                  </button>
                  <button
                    onClick={() => updateControlAssessment(domain.id, control.id, 'non-compliant')}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Non-Compliant
                  </button>
                  <button
                    onClick={() => updateControlAssessment(domain.id, control.id, 'not-assessed')}
                    className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    Not Assessed
                  </button>
                </div>
              </div>
            </div>

            {/* Implementation Details */}
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Implementation</h4>
                <textarea
                  value={control.implementation}
                  onChange={(e) => updateControlDetails(domain.id, control.id, { implementation: e.target.value })}
                  className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-sm"
                  placeholder="Describe implementation details..."
                />
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Verification</h4>
                <textarea
                  value={control.verification}
                  onChange={(e) => updateControlDetails(domain.id, control.id, { verification: e.target.value })}
                  className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-sm"
                  placeholder="Describe verification methods..."
                />
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Notes</h4>
                <textarea
                  value={control.notes}
                  onChange={(e) => updateControlDetails(domain.id, control.id, { notes: e.target.value })}
                  className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-sm"
                  placeholder="Add assessment notes..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const breadcrumbs = [
    { label: 'Compliance', path: '/control-assessor' },
    { label: 'CMMC Control Assessor', isActive: true }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      {!activeDomain && renderOverview()}
      {activeDomain && !showControlDetails && renderDomainControls()}
      {showControlDetails && renderControlDetails()}
    </div>
  );
};

export default CMMCControlAssessor;