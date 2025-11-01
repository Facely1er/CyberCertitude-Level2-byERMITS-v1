import React, { useState, useEffect } from 'react';
import { CircleCheck as CheckCircle, Circle as XCircle, TriangleAlert as AlertTriangle, Clock, Shield, FileText, Users, Calendar, Download, Upload, Eye, CreditCard as Edit, Save, RefreshCw, ExternalLink, BookOpen, Target, ChartBar as BarChart3, Settings, Database, Archive, Send, SquareCheck as CheckSquare, Play, Pause, Store as Stop, ArrowLeft, ChevronRight } from 'lucide-react';
import { Breadcrumbs } from '../../../shared/components/layout/Breadcrumbs';


interface C3PAORequirement {
  id: string;
  title: string;
  description: string;
  category: 'documentation' | 'technical' | 'process' | 'personnel' | 'evidence';
  status: 'not-started' | 'in-progress' | 'completed' | 'reviewed';
  priority: 'critical' | 'high' | 'medium' | 'low';
  dueDate: Date;
  assignedTo: string;
  evidence: string[];
  notes: string;
  lastUpdated: Date;
  isRequired: boolean;
}

interface C3PAOAssessment {
  id: string;
  title: string;
  description: string;
  scheduledDate: Date;
  duration: string;
  assessor: string;
  organization: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  requirements: C3PAORequirement[];
  overallReadiness: number;
  lastUpdated: Date;
}

interface C3PAOPreparationToolProps {
  onSave?: (preparation: any) => void;
  onExport?: (preparation: any) => void;
  onNavigate?: (path: string) => void;
}

const C3PAO_REQUIREMENTS: C3PAORequirement[] = [
  {
    id: 'req-001',
    title: 'System Security Plan (SSP)',
    description: 'Comprehensive SSP documenting all security controls and implementations',
    category: 'documentation',
    status: 'in-progress',
    priority: 'critical',
    dueDate: new Date('2024-02-15'),
    assignedTo: 'Security Team',
    evidence: ['SSP Template', 'Control Implementation Guide'],
    notes: 'Need to complete sections 3.1 and 3.2',
    lastUpdated: new Date('2024-01-20'),
    isRequired: true
  },
  {
    id: 'req-002',
    title: 'Evidence Portfolio',
    description: 'Complete evidence collection for all 110 CMMC 2.0 Level 2 controls',
    category: 'evidence',
    status: 'in-progress',
    priority: 'critical',
    dueDate: new Date('2024-02-20'),
    assignedTo: 'Compliance Team',
    evidence: ['Evidence Collection Guide', 'Control Mapping'],
    notes: 'Currently at 78% completion',
    lastUpdated: new Date('2024-01-22'),
    isRequired: true
  },
  {
    id: 'req-003',
    title: 'Technical Implementation',
    description: 'All technical controls must be fully implemented and operational',
    category: 'technical',
    status: 'in-progress',
    priority: 'critical',
    dueDate: new Date('2024-02-10'),
    assignedTo: 'IT Team',
    evidence: ['Configuration Baselines', 'System Hardening Guide'],
    notes: 'Firewall rules need updating',
    lastUpdated: new Date('2024-01-21'),
    isRequired: true
  },
  {
    id: 'req-004',
    title: 'Personnel Training Records',
    description: 'Documentation of security awareness training for all personnel',
    category: 'personnel',
    status: 'completed',
    priority: 'high',
    dueDate: new Date('2024-01-30'),
    assignedTo: 'HR Team',
    evidence: ['Training Records', 'Completion Certificates'],
    notes: 'All personnel completed training',
    lastUpdated: new Date('2024-01-25'),
    isRequired: true
  },
  {
    id: 'req-005',
    title: 'Incident Response Plan',
    description: 'Documented and tested incident response procedures',
    category: 'process',
    status: 'completed',
    priority: 'high',
    dueDate: new Date('2024-01-25'),
    assignedTo: 'Security Team',
    evidence: ['IRP Document', 'Test Results'],
    notes: 'Plan tested successfully',
    lastUpdated: new Date('2024-01-24'),
    isRequired: true
  },
  {
    id: 'req-006',
    title: 'Risk Assessment',
    description: 'Current risk assessment and mitigation strategies',
    category: 'documentation',
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date('2024-02-05'),
    assignedTo: 'Risk Management',
    evidence: ['Risk Register', 'Mitigation Plans'],
    notes: 'Need to update risk register',
    lastUpdated: new Date('2024-01-23'),
    isRequired: true
  },
  {
    id: 'req-007',
    title: 'Audit Logs',
    description: 'Comprehensive audit logging and monitoring capabilities',
    category: 'technical',
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date('2024-02-12'),
    assignedTo: 'IT Team',
    evidence: ['Log Configuration', 'Monitoring Setup'],
    notes: 'Log retention needs adjustment',
    lastUpdated: new Date('2024-01-22'),
    isRequired: true
  },
  {
    id: 'req-008',
    title: 'Physical Security',
    description: 'Physical security controls and access management',
    category: 'technical',
    status: 'completed',
    priority: 'medium',
    dueDate: new Date('2024-01-28'),
    assignedTo: 'Facilities Team',
    evidence: ['Access Control Records', 'Security Cameras'],
    notes: 'All physical controls in place',
    lastUpdated: new Date('2024-01-26'),
    isRequired: true
  }
];

const C3PAO_ASSESSMENTS: C3PAOAssessment[] = [
  {
    id: 'assessment-001',
    title: 'CMMC 2.0 Level 2 Assessment',
    description: 'Initial C3PAO assessment for CMMC 2.0 Level 2 certification',
    scheduledDate: new Date('2024-03-15'),
    duration: '5 days',
    assessor: 'C3PAO Organization ABC',
    organization: 'Your Organization',
    status: 'scheduled',
    requirements: C3PAO_REQUIREMENTS,
    overallReadiness: 78,
    lastUpdated: new Date('2024-01-22')
  }
];

const C3PAOPreparationTool: React.FC<C3PAOPreparationToolProps> = ({
  onSave,
  onExport,
  onNavigate
}) => {
  const [assessments, setAssessments] = useState<C3PAOAssessment[]>(C3PAO_ASSESSMENTS);
  const [activeAssessment, setActiveAssessment] = useState<string>('assessment-001');
  const [activeRequirement, setActiveRequirement] = useState<string | null>(null);
  const [showRequirementDetails, setShowRequirementDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const currentAssessment = assessments.find(a => a.id === activeAssessment);

  const updateRequirementStatus = (requirementId: string, status: C3PAORequirement['status']) => {
    setAssessments(prev => prev.map(assessment => {
      if (assessment.id === activeAssessment) {
        const updatedRequirements = assessment.requirements.map(req => 
          req.id === requirementId ? { ...req, status, lastUpdated: new Date() } : req
        );
        
        // Calculate overall readiness
        const completedRequirements = updatedRequirements.filter(req => req.status === 'completed').length;
        const overallReadiness = Math.round((completedRequirements / updatedRequirements.length) * 100);
        
        return {
          ...assessment,
          requirements: updatedRequirements,
          overallReadiness,
          lastUpdated: new Date()
        };
      }
      return assessment;
    }));
  };

  const updateRequirementDetails = (requirementId: string, updates: Partial<C3PAORequirement>) => {
    setAssessments(prev => prev.map(assessment => {
      if (assessment.id === activeAssessment) {
        return {
          ...assessment,
          requirements: assessment.requirements.map(req => 
            req.id === requirementId ? { ...req, ...updates, lastUpdated: new Date() } : req
          ),
          lastUpdated: new Date()
        };
      }
      return assessment;
    }));
  };

  const handleNavigation = (path: string) => {
    onNavigate?.(path);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'reviewed': return 'text-purple-600 bg-purple-100';
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'documentation': return <FileText className="w-5 h-5" />;
      case 'technical': return <Settings className="w-5 h-5" />;
      case 'process': return <Target className="w-5 h-5" />;
      case 'personnel': return <Users className="w-5 h-5" />;
      case 'evidence': return <Database className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'reviewed': return <Eye className="w-5 h-5 text-purple-500" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const filteredRequirements = currentAssessment?.requirements.filter(req => {
    const matchesSearch = searchTerm === '' || 
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || req.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || req.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  }) || [];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              C3PAO Preparation Tool
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Prepare for C3PAO assessment and CMMC 2.0 Level 2 certification
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onSave?.(assessments)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={() => onExport?.(assessments)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => handleNavigation('/compliance')}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Shield className="w-4 h-4" />
              Compliance Status
            </button>
            <button
              onClick={() => handleNavigation('/reports')}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Generate Reports
            </button>
          </div>
        </div>

        {/* Assessment Overview */}
        {currentAssessment && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {currentAssessment.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Scheduled: {currentAssessment.scheduledDate.toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Assessor: {currentAssessment.assessor}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {currentAssessment.overallReadiness}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Overall Readiness
                </div>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${currentAssessment.overallReadiness}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mt-2">
              <span>
                {currentAssessment.requirements.filter(req => req.status === 'completed').length} of {currentAssessment.requirements.length} requirements completed
              </span>
              <span>
                {(() => {
                  if (!currentAssessment.scheduledDate) return 'N/A';
                  const scheduledDate = currentAssessment.scheduledDate instanceof Date 
                    ? currentAssessment.scheduledDate 
                    : new Date(currentAssessment.scheduledDate);
                  const scheduledTime = scheduledDate.getTime();
                  if (isNaN(scheduledTime)) return 'Invalid date';
                  const daysRemaining = Math.ceil((scheduledTime - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  return `${daysRemaining} days remaining`;
                })()}
              </span>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            {
              title: 'Critical Requirements',
              value: currentAssessment?.requirements.filter(req => req.priority === 'critical').length || 0,
              total: currentAssessment?.requirements.filter(req => req.priority === 'critical').length || 0,
              color: 'red'
            },
            {
              title: 'Completed',
              value: currentAssessment?.requirements.filter(req => req.status === 'completed').length || 0,
              total: currentAssessment?.requirements.length || 0,
              color: 'green'
            },
            {
              title: 'In Progress',
              value: currentAssessment?.requirements.filter(req => req.status === 'in-progress').length || 0,
              total: currentAssessment?.requirements.length || 0,
              color: 'blue'
            },
            {
              title: 'Overdue',
              value: currentAssessment?.requirements.filter(req => 
                req.dueDate < new Date() && req.status !== 'completed'
              ).length || 0,
              total: currentAssessment?.requirements.length || 0,
              color: 'orange'
            }
          ].map((stat, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">{stat.title}</h4>
                <span className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div 
                  className={`bg-${stat.color}-500 h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${stat.total > 0 ? (stat.value / stat.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Search requirements..."
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="reviewed">Reviewed</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Categories</option>
            <option value="documentation">Documentation</option>
            <option value="technical">Technical</option>
            <option value="process">Process</option>
            <option value="personnel">Personnel</option>
            <option value="evidence">Evidence</option>
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

        {/* Requirements List */}
        <div className="space-y-4">
          {filteredRequirements.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No requirements found matching your filters.
            </div>
          ) : (
            filteredRequirements.map((requirement) => (
              <div
                key={requirement.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  activeRequirement === requirement.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
                onClick={() => {
                  setActiveRequirement(requirement.id);
                  setShowRequirementDetails(true);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        {getCategoryIcon(requirement.category)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {requirement.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {requirement.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(requirement.status)}`}>
                        {requirement.status.replace('-', ' ').toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(requirement.priority)}`}>
                        {requirement.priority.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Due: {requirement.dueDate.toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Assigned: {requirement.assignedTo}
                      </span>
                    </div>

                    {requirement.evidence.length > 0 && (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {requirement.evidence.map((evidence, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded"
                            >
                              {evidence}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {requirement.notes && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <strong>Notes:</strong> {requirement.notes}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {getStatusIcon(requirement.status)}
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderRequirementDetails = () => {
    const requirement = currentAssessment?.requirements.find(req => req.id === activeRequirement);
    if (!requirement) return null;

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {requirement.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {requirement.description}
              </p>
            </div>
            <button
              onClick={() => setShowRequirementDetails(false)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Requirements
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Requirement Information */}
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Requirement Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(requirement.status)}`}>
                      {requirement.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Priority:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(requirement.priority)}`}>
                      {requirement.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Category:</span>
                    <span className="text-gray-900 dark:text-white">{requirement.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Due Date:</span>
                    <span className="text-gray-900 dark:text-white">{requirement.dueDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Assigned To:</span>
                    <span className="text-gray-900 dark:text-white">{requirement.assignedTo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Required:</span>
                    <span className="text-gray-900 dark:text-white">{requirement.isRequired ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              {/* Status Actions */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Update Status</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateRequirementStatus(requirement.id, 'not-started')}
                    className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    Not Started
                  </button>
                  <button
                    onClick={() => updateRequirementStatus(requirement.id, 'in-progress')}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => updateRequirementStatus(requirement.id, 'completed')}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Completed
                  </button>
                  <button
                    onClick={() => updateRequirementStatus(requirement.id, 'reviewed')}
                    className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    Reviewed
                  </button>
                </div>
              </div>
            </div>

            {/* Evidence and Notes */}
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Evidence</h4>
                <div className="space-y-2">
                  {requirement.evidence.map((evidence, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg"
                    >
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-900 dark:text-white">{evidence}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Notes</h4>
                <textarea
                  value={requirement.notes}
                  onChange={(e) => updateRequirementDetails(requirement.id, { notes: e.target.value })}
                  className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-sm"
                  placeholder="Add notes about this requirement..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const breadcrumbs = [
    { label: 'Audit', path: '/audit-tracker' },
    { label: 'C3PAO Preparation Tool', isActive: true }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      {!showRequirementDetails && renderOverview()}
      {showRequirementDetails && renderRequirementDetails()}
    </div>
  );
};

export default C3PAOPreparationTool;