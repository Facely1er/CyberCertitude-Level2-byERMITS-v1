import React, { useState, useEffect } from 'react';
import { 
  Shield, CheckCircle, AlertTriangle, Clock, Target, 
  Plus, Search, Eye, Edit3, RefreshCw, Download, Filter,
  Save, FileText, BarChart3, Users, Calendar
} from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';
import { useInternalLinking } from '@/shared/hooks/useInternalLinking';
import { controlsService, Control, ControlFilters } from '@/services/controlsService';
import { logger } from '@/utils/logger';

interface CMMCControlAssessorProps {
  onNavigate: (path: string) => void;
  onSave: (assessment: any) => void;
  onExport: (assessment: any) => void;
}

interface ControlAssessment {
  controlId: string;
  controlName: string;
  status: 'not-implemented' | 'planned' | 'in-progress' | 'implemented' | 'tested';
  compliance: 'compliant' | 'partially-compliant' | 'non-compliant' | 'not-assessed';
  evidence: string[];
  notes: string;
  assessor: string;
  assessmentDate: Date;
  nextReviewDate: Date;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  implementationNotes: string;
}

export const CMMCControlAssessor: React.FC<CMMCControlAssessorProps> = ({
  onNavigate,
  onSave,
  onExport
}) => {
  const { breadcrumbs } = useInternalLinking();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCompliance, setFilterCompliance] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [controls, setControls] = useState<Control[]>([]);
  const [filteredControls, setFilteredControls] = useState<Control[]>([]);
  const [assessments, setAssessments] = useState<ControlAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedControl, setSelectedControl] = useState<Control | null>(null);
  const [assessmentModalOpen, setAssessmentModalOpen] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState<ControlAssessment | null>(null);

  useEffect(() => {
    loadControls();
    loadAssessments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [controls, searchTerm, filterStatus, filterCompliance, filterRisk]);

  const loadControls = async () => {
    try {
      setLoading(true);
      const controlsData = await controlsService.getControls();
      setControls(controlsData);
    } catch (error) {
      logger.error('Error loading controls:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAssessments = async () => {
    try {
      // Load saved assessments from localStorage or API
      const savedAssessments = localStorage.getItem('cmmc-control-assessments');
      if (savedAssessments) {
        setAssessments(JSON.parse(savedAssessments));
      }
    } catch (error) {
      logger.error('Error loading assessments:', error);
    }
  };

  const applyFilters = async () => {
    try {
      const filters: ControlFilters = {
        search: searchTerm || undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
      };
      
      const filtered = await controlsService.searchControls(filters);
      
      // Apply additional filters
      let result = filtered;
      
      if (filterCompliance !== 'all') {
        result = result.filter(control => {
          const assessment = assessments.find(a => a.controlId === control.id);
          return assessment ? assessment.compliance === filterCompliance : filterCompliance === 'not-assessed';
        });
      }
      
      if (filterRisk !== 'all') {
        result = result.filter(control => {
          const assessment = assessments.find(a => a.controlId === control.id);
          return assessment ? assessment.riskLevel === filterRisk : control.riskLevel === filterRisk;
        });
      }
      
      setFilteredControls(result);
    } catch (error) {
      logger.error('Error applying filters:', error);
      setFilteredControls(controls);
    }
  };

  const startAssessment = (control: Control) => {
    setSelectedControl(control);
    const existingAssessment = assessments.find(a => a.controlId === control.id);
    
    if (existingAssessment) {
      setCurrentAssessment(existingAssessment);
    } else {
      setCurrentAssessment({
        controlId: control.id,
        controlName: control.name,
        status: control.status,
        compliance: 'not-assessed',
        evidence: [],
        notes: '',
        assessor: '',
        assessmentDate: new Date(),
        nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        riskLevel: control.riskLevel,
        implementationNotes: control.implementationNotes || ''
      });
    }
    
    setAssessmentModalOpen(true);
  };

  const saveAssessment = () => {
    if (!currentAssessment) return;
    
    const updatedAssessments = assessments.filter(a => a.controlId !== currentAssessment.controlId);
    updatedAssessments.push(currentAssessment);
    
    setAssessments(updatedAssessments);
    localStorage.setItem('cmmc-control-assessments', JSON.stringify(updatedAssessments));
    
    setAssessmentModalOpen(false);
    setCurrentAssessment(null);
    setSelectedControl(null);
    
    onSave(currentAssessment);
  };

  const exportAssessments = () => {
    const csvContent = generateCSV(assessments);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cmmc-control-assessments-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    onExport(assessments);
  };

  const generateCSV = (assessments: ControlAssessment[]): string => {
    const headers = ['Control ID', 'Control Name', 'Status', 'Compliance', 'Risk Level', 'Assessor', 'Assessment Date', 'Evidence Count', 'Notes'];
    const rows = assessments.map(assessment => [
      assessment.controlId,
      assessment.controlName,
      assessment.status,
      assessment.compliance,
      assessment.riskLevel,
      assessment.assessor,
      assessment.assessmentDate.toLocaleDateString(),
      assessment.evidence.length.toString(),
      assessment.notes
    ]);
    
    return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'in-progress': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'planned': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'not-implemented': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'tested': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
    }
  };

  const getComplianceColor = (compliance: string) => {
    switch (compliance) {
      case 'compliant': return 'text-green-600 dark:text-green-400';
      case 'partially-compliant': return 'text-yellow-600 dark:text-yellow-400';
      case 'non-compliant': return 'text-red-600 dark:text-red-400';
      case 'not-assessed': return 'text-gray-600 dark:text-gray-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-600 dark:text-red-400';
      case 'high': return 'text-orange-600 dark:text-orange-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getAssessmentStatus = (controlId: string) => {
    const assessment = assessments.find(a => a.controlId === controlId);
    return assessment ? assessment.compliance : 'not-assessed';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-300">Loading controls...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
                <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  CMMC Control Assessor
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Assess and evaluate CMMC Level 1 security controls for compliance
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={exportAssessments}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Assessments</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Controls</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{filteredControls.length}</p>
            </div>
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Assessed</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {assessments.length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Compliant</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {assessments.filter(a => a.compliance === 'compliant').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Non-Compliant</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                {assessments.filter(a => a.compliance === 'non-compliant').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search controls..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="not-implemented">Not Implemented</option>
              <option value="planned">Planned</option>
              <option value="in-progress">In Progress</option>
              <option value="implemented">Implemented</option>
              <option value="tested">Tested</option>
            </select>
            
            <select
              value={filterCompliance}
              onChange={(e) => setFilterCompliance(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Compliance</option>
              <option value="not-assessed">Not Assessed</option>
              <option value="compliant">Compliant</option>
              <option value="partially-compliant">Partially Compliant</option>
              <option value="non-compliant">Non-Compliant</option>
            </select>

            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Controls List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            CMMC Level 1 Controls ({filteredControls.length})
          </h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {filteredControls.map((control) => {
              const assessment = assessments.find(a => a.controlId === control.id);
              const complianceStatus = getAssessmentStatus(control.id);
              
              return (
                <div key={control.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {control.name}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(control.status)}`}>
                          {control.status.replace('-', ' ')}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getComplianceColor(complianceStatus)}`}>
                          {complianceStatus.replace('-', ' ')}
                        </span>
                        <span className={`font-medium ${getRiskColor(control.riskLevel)}`}>
                          {control.riskLevel}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {control.description}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Control ID:</span>
                          <div className="font-medium text-gray-900 dark:text-white">{control.id.toUpperCase()}</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Function:</span>
                          <div className="font-medium text-gray-900 dark:text-white">{control.nistFunction}</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Owner:</span>
                          <div className="font-medium text-gray-900 dark:text-white">{control.owner}</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Last Assessed:</span>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {assessment ? assessment.assessmentDate.toLocaleDateString() : 'Never'}
                          </div>
                        </div>
                      </div>

                      {assessment && (
                        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Assessment Details</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Assessor:</span>
                              <div className="font-medium text-gray-900 dark:text-white">{assessment.assessor}</div>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Evidence Items:</span>
                              <div className="font-medium text-gray-900 dark:text-white">{assessment.evidence.length}</div>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Next Review:</span>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {assessment.nextReviewDate.toLocaleDateString()}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Notes:</span>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {assessment.notes || 'No notes'}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => startAssessment(control)}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>{assessment ? 'Update Assessment' : 'Start Assessment'}</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        const controlDetails = `Control Details:

ID: ${control.id.toUpperCase()}
Name: ${control.name}
Description: ${control.description}
Framework: ${control.framework}
NIST Function: ${control.nistFunction}
Status: ${control.status.replace('-', ' ')}
Priority: ${control.priority}
Owner: ${control.owner}
Risk Level: ${control.riskLevel}
Compliance: ${complianceStatus.replace('-', ' ')}
Last Assessed: ${assessment ? assessment.assessmentDate.toLocaleDateString() : 'Never'}`;
                        
                        // This would typically show a modal or navigate to a detail view
                        logger.debug('Control details:', controlDetails);
                      }}
                      className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {filteredControls.length === 0 && (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Controls Found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {searchTerm || filterStatus !== 'all' || filterCompliance !== 'all' || filterRisk !== 'all'
                  ? 'No controls match your current search and filter criteria. Try adjusting your filters.'
                  : 'No security controls are available for assessment.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Assessment Modal */}
      {assessmentModalOpen && selectedControl && currentAssessment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Assess Control: {selectedControl.name}
                </h3>
                <button
                  onClick={() => setAssessmentModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Compliance Status
                  </label>
                  <select
                    value={currentAssessment.compliance}
                    onChange={(e) => setCurrentAssessment(prev => prev ? {
                      ...prev,
                      compliance: e.target.value as any
                    } : null)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="not-assessed">Not Assessed</option>
                    <option value="compliant">Compliant</option>
                    <option value="partially-compliant">Partially Compliant</option>
                    <option value="non-compliant">Non-Compliant</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Risk Level
                  </label>
                  <select
                    value={currentAssessment.riskLevel}
                    onChange={(e) => setCurrentAssessment(prev => prev ? {
                      ...prev,
                      riskLevel: e.target.value as any
                    } : null)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Assessor
                  </label>
                  <input
                    type="text"
                    value={currentAssessment.assessor}
                    onChange={(e) => setCurrentAssessment(prev => prev ? {
                      ...prev,
                      assessor: e.target.value
                    } : null)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter assessor name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Assessment Date
                  </label>
                  <input
                    type="date"
                    value={currentAssessment.assessmentDate.toISOString().split('T')[0]}
                    onChange={(e) => setCurrentAssessment(prev => prev ? {
                      ...prev,
                      assessmentDate: new Date(e.target.value)
                    } : null)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Evidence Items
                </label>
                <div className="space-y-2">
                  {currentAssessment.evidence.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newEvidence = [...currentAssessment.evidence];
                          newEvidence[index] = e.target.value;
                          setCurrentAssessment(prev => prev ? {
                            ...prev,
                            evidence: newEvidence
                          } : null);
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Evidence item"
                      />
                      <button
                        onClick={() => {
                          const newEvidence = currentAssessment.evidence.filter((_, i) => i !== index);
                          setCurrentAssessment(prev => prev ? {
                            ...prev,
                            evidence: newEvidence
                          } : null);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setCurrentAssessment(prev => prev ? {
                      ...prev,
                      evidence: [...prev.evidence, '']
                    } : null)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Evidence Item
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assessment Notes
                </label>
                <textarea
                  value={currentAssessment.notes}
                  onChange={(e) => setCurrentAssessment(prev => prev ? {
                    ...prev,
                    notes: e.target.value
                  } : null)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter assessment notes..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Implementation Notes
                </label>
                <textarea
                  value={currentAssessment.implementationNotes}
                  onChange={(e) => setCurrentAssessment(prev => prev ? {
                    ...prev,
                    implementationNotes: e.target.value
                  } : null)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter implementation notes..."
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => setAssessmentModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveAssessment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CMMCControlAssessor;