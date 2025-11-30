import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, CheckCircle, Clock, Target, Award, Play, ArrowRight, Shield, FileText, Users, Calendar, Settings, BarChart3, Activity, Zap, Building, Eye, Download, Plus, UserCheck, Briefcase, PenTool as Tool, Database, Search, AlertTriangle } from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';
import { useInternalLinking } from '@/shared/hooks/useInternalLinking';

interface WorkflowPhase {
  id: string;
  title: string;
  description: string;
  duration: string;
  status: 'completed' | 'in-progress' | 'pending';
  keyActivities: string[];
  deliverables: string[];
  platformTools: string[];
  dependencies: string[];
  assignedRoles: string[];
}

interface TeamRole {
  id: string;
  title: string;
  keyResponsibilities: string[];
  requiredSkills: string[];
  timeCommitment: string;
  phase: string[];
}

const ComplianceWorkflow: React.FC = () => {
  const { breadcrumbs } = useInternalLinking();
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'phases' | 'roles' | 'planning'>('phases');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const workflowPhases: WorkflowPhase[] = [
    {
      id: 'phase-1',
      title: 'Assessment & Gap Analysis',
      description: 'Evaluate current compliance posture and identify implementation gaps',
      duration: '0-2 weeks',
      status: 'completed',
      keyActivities: [
        'Complete CMMC assessment using our platform',
        'Identify compliance gaps and priorities',
        'Estimate implementation effort and timeline',
        'Create initial project roadmap'
      ],
      deliverables: [
        'Assessment report',
        'Gap analysis',
        'Implementation roadmap'
      ],
      platformTools: [
        'CMMC Assessment Engine',
        'Gap Analysis Tool'
      ],
      dependencies: [],
      assignedRoles: ['Project Manager', 'ISSO']
    },
    {
      id: 'phase-2',
      title: 'Team Setup & Planning',
      description: 'Establish implementation team and define roles and responsibilities',
      duration: '0-1-2 weeks',
      status: 'in-progress',
      keyActivities: [
        'Define team structure and roles',
        'Create RACI matrix for control implementation',
        'Set up project management workflows',
        'Establish communication protocols'
      ],
      deliverables: [
        'Team charter',
        'RACI matrix',
        'Project plan'
      ],
      platformTools: [
        'Team Management',
        'RACI Matrix Generator',
        'Project Roadmap'
      ],
      dependencies: ['phase-1'],
      assignedRoles: ['Project Manager', 'ISSO', 'All Team Members']
    },
    {
      id: 'phase-3',
      title: 'Control Implementation',
      description: 'Systematically implement CMMC security controls',
      duration: '0-12-24 weeks',
      status: 'pending',
      keyActivities: [
        'Implement Level 1 foundational controls',
        'Implement Level 2 advanced controls',
        'Configure technical security measures',
        'Develop policies and procedures'
      ],
      deliverables: [
        'Implemented controls',
        'Security configurations',
        'Policy documents'
      ],
      platformTools: [
        'Control Implementation Tracker',
        'Policy Generator',
        'Evidence Vault'
      ],
      dependencies: ['phase-2'],
      assignedRoles: ['Control Implementers', 'ISSO']
    },
    {
      id: 'phase-4',
      title: 'Documentation & Evidence',
      description: 'Create required CMMC documentation and collect evidence',
      duration: '0-4 weeks',
      status: 'pending',
      keyActivities: [
        'Generate System Security Plan (SSP)',
        'Create Plans of Action & Milestones (POAM)',
        'Collect and organize implementation evidence',
        'Prepare assessment artifacts'
      ],
      deliverables: [
        'SSP document',
        'POAM document',
        'Evidence collection'
      ],
      platformTools: [
        'SSP Generator',
        'POAM Generator',
        'Evidence Management'
      ],
      dependencies: ['phase-3'],
      assignedRoles: ['Evidence Manager', 'ISSO']
    },
    {
      id: 'phase-5',
      title: 'Assessment Preparation',
      description: 'Prepare for CMMC assessment and certification',
      duration: '0-2 weeks',
      status: 'pending',
      keyActivities: [
        'Conduct internal readiness review',
        'Address any remaining gaps',
        'Schedule third-party assessment',
        'Final evidence organization'
      ],
      deliverables: [
        'Readiness report',
        'Assessment schedule',
        'Final documentation'
      ],
      platformTools: [
        'Assessment Readiness Check',
        'Final Review Tools'
      ],
      dependencies: ['phase-4'],
      assignedRoles: ['Project Manager', 'ISSO', 'Evidence Manager']
    }
  ];

  const teamRoles: TeamRole[] = [
    {
      id: 'project-manager',
      title: 'Project Manager',
      keyResponsibilities: [
        'Overall project coordination',
        'Timeline and milestone management',
        'Resource allocation',
        'Stakeholder communication'
      ],
      requiredSkills: [
        'Project management',
        'CMMC knowledge',
        'Communication'
      ],
      timeCommitment: '25-30% during implementation',
      phase: ['phase-1', 'phase-2', 'phase-5']
    },
    {
      id: 'isso',
      title: 'Information Systems Security Officer (ISSO)',
      keyResponsibilities: [
        'Security control assessment',
        'Implementation validation',
        'Security policy development',
        'Risk management oversight'
      ],
      requiredSkills: [
        'Security expertise',
        'NIST frameworks',
        'Risk assessment'
      ],
      timeCommitment: '50-75% during implementation',
      phase: ['phase-1', 'phase-2', 'phase-3', 'phase-4', 'phase-5']
    },
    {
      id: 'control-implementers',
      title: 'Control Implementers',
      keyResponsibilities: [
        'Technical control implementation',
        'System configuration',
        'Evidence collection',
        'Testing and validation'
      ],
      requiredSkills: [
        'Technical expertise',
        'System administration',
        'Security tools'
      ],
      timeCommitment: '75-100% during active implementation',
      phase: ['phase-3', 'phase-4']
    },
    {
      id: 'evidence-manager',
      title: 'Evidence Manager',
      keyResponsibilities: [
        'Evidence collection coordination',
        'Document organization',
        'Audit trail organization',
        'Compliance tracking'
      ],
      requiredSkills: [
        'Document management',
        'Compliance procedures',
        'Attention to detail'
      ],
      timeCommitment: '25-50% throughout project',
      phase: ['phase-3', 'phase-4', 'phase-5']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'status-success';
      case 'in-progress': return 'status-info';
      case 'pending': return 'status-warning';
      default: return 'status-warning';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-success-500" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-primary-500" />;
      case 'pending': return <Target className="w-5 h-5 text-text-muted-dark" />;
      default: return <Target className="w-5 h-5 text-text-muted-dark" />;
    }
  };

  const getRoleIcon = (roleId: string) => {
    switch (roleId) {
      case 'project-manager': return UserCheck;
      case 'isso': return Shield;
      case 'control-implementers': return Tool;
      case 'evidence-manager': return Database;
      default: return Users;
    }
  };

  const stats = {
    totalPhases: workflowPhases.length,
    completedPhases: workflowPhases.filter(p => p.status === 'completed').length,
    totalActivities: workflowPhases.reduce((sum, phase) => sum + phase.keyActivities.length, 0),
    completedActivities: workflowPhases.filter(p => p.status === 'completed').reduce((sum, phase) => sum + phase.keyActivities.length, 0),
    overallProgress: Math.round(
      (workflowPhases.filter(p => p.status === 'completed').length / workflowPhases.length) * 100
    )
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Header */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-support-light dark:bg-support-dark" />
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl">
                  <Activity className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    Implementation Plan
                  </h1>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark">
                    Step-by-step guide for implementing CMMC 2.0 requirements in your organization
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-1 bg-support-light dark:bg-support-dark rounded-lg p-1">
              {(['phases', 'roles', 'planning'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                    viewMode === mode
                      ? 'bg-primary-500 text-white'
                      : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-support-light dark:hover:bg-support-dark'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="card-standard p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Overall Progress</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.overallProgress}%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>

        <div className="card-standard p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Completed Phases</p>
              <p className="text-3xl font-bold text-success-600 dark:text-success-400">
                {stats.completedPhases}/{stats.totalPhases}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-success-600 dark:text-success-400" />
          </div>
        </div>

        <div className="card-standard p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Activities</p>
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {stats.completedActivities}/{stats.totalActivities}
              </p>
            </div>
            <Target className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
        </div>

        <div className="card-standard p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Team Roles</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{teamRoles.length}</p>
            </div>
            <Users className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
        </div>

        <div className="card-standard p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Platform Tools</p>
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {workflowPhases.reduce((sum, phase) => sum + phase.platformTools.length, 0)}
              </p>
            </div>
            <Zap className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
      </div>

      {/* Implementation Phases View */}
      {viewMode === 'phases' && (
        <div className="card-standard p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
              CMMC Implementation Phases
            </h2>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              Step-by-step guide for implementing CMMC 2.0 requirements
            </p>
          </div>
          
          <div className="space-y-6">
            {workflowPhases.map((phase, index) => (
              <div key={phase.id} className="relative">
                {/* Phase Card */}
                <div className="border border-support-light dark:border-support-dark rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-2">
                          {index + 1}
                        </div>
                        {index < workflowPhases.length - 1 && (
                          <div className="w-0.5 h-16 bg-support-light dark:bg-primary-600"></div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                            {phase.title}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(phase.status)}`}>
                            {phase.status.replace('-', ' ')}
                          </span>
                          {getStatusIcon(phase.status)}
                        </div>
                        
                        <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
                          {phase.description}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Duration:</span>
                            <div className="font-medium text-text-primary-light dark:text-text-primary-dark">{phase.duration}</div>
                          </div>
                          <div>
                            <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Activities:</span>
                            <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                              {phase.keyActivities.length} items
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Deliverables:</span>
                            <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                              {phase.deliverables.length} items
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Tools:</span>
                            <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                              {phase.platformTools.length} tools
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setSelectedPhase(selectedPhase === phase.id ? null : phase.id)}
                      className="flex items-center space-x-2 btn-secondary px-4 py-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>{selectedPhase === phase.id ? 'Hide' : 'View'} Details</span>
                    </button>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-support-light dark:bg-support-dark rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        phase.status === 'completed' ? 'bg-success-500' :
                        phase.status === 'in-progress' ? 'bg-primary-500' : 'bg-support-light dark:bg-support-dark'
                      }`}
                      style={{ 
                        width: `${
                          phase.status === 'completed' ? 100 :
                          phase.status === 'in-progress' ? 50 : 0
                        }%` 
                      }}
                    />
                  </div>
                  
                  {/* Assigned Roles */}
                  <div className="mt-4 flex items-center space-x-2">
                    <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Assigned Roles:</span>
                    <div className="flex flex-wrap gap-2">
                      {phase.assignedRoles.map((role, roleIndex) => (
                        <span
                          key={roleIndex}
                          className="px-2 py-1 status-info text-xs rounded"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Expanded Details */}
                  {selectedPhase === phase.id && (
                    <div className="mt-6 pt-6 border-t border-support-light dark:border-support-dark">
                      <div className="grid md:grid-cols-3 gap-6">
                        {/* Key Activities */}
                        <div>
                          <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-4 flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2 text-success-600" />
                            Key Activities
                          </h4>
                          <div className="space-y-2">
                            {phase.keyActivities.map((activity, actIndex) => (
                              <div key={actIndex} className="flex items-start space-x-2 text-sm">
                                <div className="w-1.5 h-1.5 bg-success-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-text-primary-light dark:text-text-primary-dark">{activity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Deliverables */}
                        <div>
                          <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-4 flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-primary-600" />
                            Deliverables
                          </h4>
                          <div className="space-y-2">
                            {phase.deliverables.map((deliverable, delIndex) => (
                              <div key={delIndex} className="flex items-center space-x-3 p-3 status-info rounded-lg">
                                <FileText className="w-4 h-4 text-primary-500" />
                                <span className="text-text-primary-light dark:text-text-primary-dark text-sm">{deliverable}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Platform Tools */}
                        <div>
                          <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-4 flex items-center">
                            <Zap className="w-5 h-5 mr-2 text-purple-600" />
                            Platform Tools
                          </h4>
                          <div className="space-y-2">
                            {phase.platformTools.map((tool, toolIndex) => (
                              <div key={toolIndex} className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                <Tool className="w-4 h-4 text-purple-500" />
                                <span className="text-text-primary-light dark:text-text-secondary-dark text-sm">{tool}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Roles View */}
      {viewMode === 'roles' && (
        <div className="card-standard p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
              CMMC Implementation Team Roles
            </h2>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              Key roles and responsibilities for successful CMMC implementation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teamRoles.map((role) => {
              const RoleIcon = getRoleIcon(role.id);
              return (
                <div key={role.id} className="border border-support-light dark:border-support-dark rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                      <RoleIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
                        {role.title}
                      </h3>
                      <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-3">
                        <strong>Time Commitment:</strong> {role.timeCommitment}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Key Responsibilities */}
                    <div>
                      <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-success-600" />
                        Key Responsibilities
                      </h4>
                      <ul className="space-y-1">
                        {role.keyResponsibilities.map((responsibility, respIndex) => (
                          <li key={respIndex} className="flex items-start space-x-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-success-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-text-primary-light dark:text-text-secondary-dark">{responsibility}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Required Skills */}
                    <div>
                      <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 flex items-center">
                        <Award className="w-4 h-4 mr-2 text-purple-600" />
                        Required Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {role.requiredSkills.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Assigned Phases */}
                    <div>
                      <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-orange-600" />
                        Active in Phases
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {role.phase.map((phaseId, phaseIndex) => {
                          const phaseName = workflowPhases.find(p => p.id === phaseId)?.title || phaseId;
                          const phaseNumber = workflowPhases.findIndex(p => p.id === phaseId) + 1;
                          return (
                            <span
                              key={phaseIndex}
                              className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 text-xs rounded"
                            >
                              Phase {phaseNumber}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedRole(selectedRole === role.id ? null : role.id)}
                    className="w-full mt-4 btn-primary py-2 px-4 font-medium"
                  >
                    {selectedRole === role.id ? 'Hide' : 'View'} Role Details
                  </button>
                  
                  {/* Expanded Role Details */}
                  {selectedRole === role.id && (
                    <div className="mt-4 pt-4 border-t border-support-light dark:border-support-dark space-y-3">
                      <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
                        <h5 className="font-medium text-primary-900 dark:text-primary-100 mb-2">
                          Phase Participation
                        </h5>
                        <div className="grid grid-cols-5 gap-2">
                          {workflowPhases.map((phase, pIndex) => (
                            <div
                              key={pIndex}
                              className={`text-center p-2 rounded text-xs ${
                                role.phase.includes(phase.id)
                                  ? 'bg-primary-600 text-white'
                                  : 'bg-support-light dark:bg-surface-dark text-text-secondary-light dark:text-text-secondary-dark'
                              }`}
                            >
                              Phase {pIndex + 1}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                        <h5 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                          Success Criteria
                        </h5>
                        <ul className="space-y-1 text-yellow-800 dark:text-yellow-200 text-sm">
                          <li>• Complete assigned activities on schedule</li>
                          <li>• Meet quality standards for deliverables</li>
                          <li>• Effective collaboration with other roles</li>
                          <li>• Adherence to CMMC implementation guidelines</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Project Planning View */}
      {viewMode === 'planning' && (
        <div className="space-y-8">
          {/* RACI Matrix */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
            <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-6 flex items-center">
              <Users className="w-6 h-6 mr-3 text-primary-600 dark:text-primary-400" />
              RACI Matrix - Role Assignment
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-support-light dark:border-support-dark">
                    <th className="text-left py-3 px-4 font-medium text-text-muted-light dark:text-text-muted-dark">
                      Phase / Activity
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-text-muted-light dark:text-text-muted-dark">
                      Project Manager
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-text-muted-light dark:text-text-muted-dark">
                      ISSO
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-text-muted-light dark:text-text-muted-dark">
                      Control Implementers
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-text-muted-light dark:text-text-muted-dark">
                      Evidence Manager
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {workflowPhases.map((phase, index) => (
                    <tr key={phase.id}>
                      <td className="py-4 px-4 font-medium text-text-primary-light dark:text-text-primary-dark">
                        {phase.title}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-block w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center ${
                          phase.assignedRoles.includes('Project Manager') 
                            ? 'bg-primary-500' : 'bg-support-light dark:bg-support-dark'
                        }`}>
                          {phase.assignedRoles.includes('Project Manager') ? 'R' : 'I'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-block w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center ${
                          phase.assignedRoles.includes('ISSO') 
                            ? 'bg-success-600' : 'bg-support-light dark:bg-primary-600'
                        }`}>
                          {phase.assignedRoles.includes('ISSO') ? 'A' : 'C'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-block w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center ${
                          phase.assignedRoles.includes('Control Implementers') 
                            ? 'bg-purple-600' : 'bg-support-light dark:bg-primary-600'
                        }`}>
                          {phase.assignedRoles.includes('Control Implementers') ? 'R' : 'I'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-block w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center ${
                          phase.assignedRoles.includes('Evidence Manager') 
                            ? 'bg-orange-600' : 'bg-support-light dark:bg-primary-600'
                        }`}>
                          {phase.assignedRoles.includes('Evidence Manager') ? 'R' : 'C'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 p-4 bg-background-light dark:bg-surface-dark/50 rounded-lg">
              <h4 className="font-medium text-text-primary-light dark:text-text-primary-dark mb-2">RACI Legend</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="inline-block w-6 h-6 bg-primary-600 text-white rounded-full text-xs font-bold flex items-center justify-center">R</span>
                  <span className="text-text-primary-light dark:text-text-secondary-dark">Responsible</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-block w-6 h-6 bg-success-600 text-white rounded-full text-xs font-bold flex items-center justify-center">A</span>
                  <span className="text-text-primary-light dark:text-text-secondary-dark">Accountable</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-block w-6 h-6 bg-primary-600 text-white rounded-full text-xs font-bold flex items-center justify-center">C</span>
                  <span className="text-text-primary-light dark:text-text-secondary-dark">Consulted</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-block w-6 h-6 bg-primary-600 text-white rounded-full text-xs font-bold flex items-center justify-center">I</span>
                  <span className="text-text-primary-light dark:text-text-secondary-dark">Informed</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Resource Planning */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
            <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-6 flex items-center">
              <Briefcase className="w-6 h-6 mr-3 text-success-600 dark:text-success-400" />
              Resource Planning & Time Allocation
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-text-primary-light dark:text-text-primary-dark mb-4">Phase-Based Resource Allocation</h3>
                <div className="space-y-3">
                  {workflowPhases.map((phase, index) => (
                    <div key={phase.id} className="border border-support-light dark:border-support-dark rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-text-primary-light dark:text-text-primary-dark">
                          Phase {index + 1}: {phase.title}
                        </span>
                        <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          {phase.duration}
                        </span>
                      </div>
                      <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        Roles: {phase.assignedRoles.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-text-primary-light dark:text-text-primary-dark mb-4">Role Utilization Timeline</h3>
                <div className="space-y-3">
                  {teamRoles.map((role) => (
                    <div key={role.id} className="border border-support-light dark:border-support-dark rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-text-primary-light dark:text-text-primary-dark">
                          {role.title}
                        </span>
                        <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          {role.timeCommitment}
                        </span>
                      </div>
                      <div className="grid grid-cols-5 gap-1">
                        {workflowPhases.map((phase, pIndex) => (
                          <div
                            key={pIndex}
                            className={`h-2 rounded ${
                              role.phase.includes(phase.id)
                                ? 'bg-primary-500'
                                : 'bg-support-light dark:bg-surface-dark'
                            }`}
                            title={`Phase ${pIndex + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Planning Integration */}
      {viewMode === 'planning' && (
        <div className="space-y-8">
          {/* Milestone Timeline */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
            <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-primary-600 dark:text-primary-400" />
              Project Milestones & Timeline
            </h2>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-support-light dark:bg-primary-600"></div>
              
              <div className="space-y-8">
                {workflowPhases.map((phase, index) => (
                  <div key={phase.id} className="relative flex items-start space-x-4">
                    {/* Timeline Dot */}
                    <div className={`w-4 h-4 rounded-full border-2 border-white dark:border-support-dark ${
                      phase.status === 'completed' ? 'bg-success-500' :
                      phase.status === 'in-progress' ? 'bg-primary-500' : 'bg-support-light'
                    } z-10`}></div>
                    
                    <div className="flex-1 bg-background-light dark:bg-surface-dark/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-text-primary-light dark:text-text-primary-dark">
                          Milestone {index + 1}: {phase.title}
                        </h3>
                        <div className="text-right">
                          <div className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                            {phase.duration}
                          </div>
                          <div className="text-xs text-text-muted-light dark:text-text-muted-dark">
                            Duration
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-text-secondary-light dark:text-text-secondary-dark mb-3">
                        {phase.description}
                      </p>
                      
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">Key Milestones</h4>
                          <ul className="space-y-1 text-sm">
                            {phase.deliverables.map((deliverable, delIndex) => (
                              <li key={delIndex} className="flex items-center space-x-2">
                                <CheckCircle className="w-3 h-3 text-success-500" />
                                <span className="text-text-secondary-light dark:text-text-muted-dark">{deliverable}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">Platform Integration</h4>
                          <ul className="space-y-1 text-sm">
                            {phase.platformTools.map((tool, toolIndex) => (
                              <li key={toolIndex} className="flex items-center space-x-2">
                                <Zap className="w-3 h-3 text-purple-500" />
                                <span className="text-text-secondary-light dark:text-text-muted-dark">{tool}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">Responsible Roles</h4>
                          <div className="flex flex-wrap gap-1">
                            {phase.assignedRoles.map((role, roleIndex) => (
                              <span
                                key={roleIndex}
                                className="px-2 py-1 status-info text-xs rounded"
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Risk Management */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
            <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-6 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-3 text-orange-600 dark:text-orange-400" />
              Implementation Risk Management
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-text-primary-light dark:text-text-primary-dark mb-4">Identified Risks</h3>
                <div className="space-y-3">
                  <div className="border border-error-200 dark:border-error-800 rounded-lg p-4 bg-error-50 dark:bg-error-900/20">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-error-600 dark:text-error-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-error-800 dark:text-error-300">Resource Availability</h4>
                        <p className="text-error-700 dark:text-error-400 text-sm">
                          Key personnel may not be available during critical implementation phases
                        </p>
                        <div className="text-error-600 dark:text-error-400 text-xs mt-1">
                          Mitigation: Cross-train team members and maintain resource buffer
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 bg-yellow-50 dark:bg-yellow-900/20">
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800 dark:text-yellow-300">Timeline Delays</h4>
                        <p className="text-yellow-700 dark:text-yellow-400 text-sm">
                          Complex control implementations may exceed estimated timelines
                        </p>
                        <div className="text-yellow-600 dark:text-yellow-400 text-xs mt-1">
                          Mitigation: Build 20% buffer time into each phase
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-text-primary-light dark:text-text-primary-dark mb-4">Success Factors</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-success-50 dark:bg-success-900/20 rounded-lg border border-success-200 dark:border-success-800">
                    <CheckCircle className="w-5 h-5 text-success-600 dark:text-success-400" />
                    <span className="text-success-800 dark:text-success-300 text-sm">Executive leadership support and commitment</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-success-50 dark:bg-success-900/20 rounded-lg border border-success-200 dark:border-success-800">
                    <Users className="w-5 h-5 text-success-600 dark:text-success-400" />
                    <span className="text-success-800 dark:text-success-300 text-sm">Clear role definitions and accountability</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-success-50 dark:bg-success-900/20 rounded-lg border border-success-200 dark:border-success-800">
                    <Target className="w-5 h-5 text-success-600 dark:text-success-400" />
                    <span className="text-success-800 dark:text-success-300 text-sm">Regular progress monitoring and course correction</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-success-50 dark:bg-success-900/20 rounded-lg border border-success-200 dark:border-success-800">
                    <Award className="w-5 h-5 text-success-600 dark:text-success-400" />
                    <span className="text-success-800 dark:text-success-300 text-sm">Continuous stakeholder communication</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
        <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-6">
          Quick Actions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/assessment-intro"
            className="flex items-center space-x-3 p-4 border border-support-light dark:border-support-dark rounded-lg hover:bg-background-light dark:hover:bg-surface-dark/50 transition-colors text-left"
          >
            <Target className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <div>
              <div className="font-medium text-text-primary-light dark:text-text-primary-dark">Start Assessment</div>
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Begin CMMC evaluation</div>
            </div>
          </Link>
          
          <Link
            to="/evidence"
            className="flex items-center space-x-3 p-4 border border-support-light dark:border-support-dark rounded-lg hover:bg-background-light dark:hover:bg-surface-dark/50 transition-colors text-left"
          >
            <FileText className="w-6 h-6 text-success-600 dark:text-success-400" />
            <div>
              <div className="font-medium text-text-primary-light dark:text-text-primary-dark">Collect Evidence</div>
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Upload documentation</div>
            </div>
          </Link>
          
          <Link
            to="/tasks"
            className="flex items-center space-x-3 p-4 border border-support-light dark:border-support-dark rounded-lg hover:bg-background-light dark:hover:bg-surface-dark/50 transition-colors text-left"
          >
            <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <div>
              <div className="font-medium text-text-primary-light dark:text-text-primary-dark">Manage Tasks</div>
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Track implementation</div>
            </div>
          </Link>
          
          <Link
            to="/team"
            className="flex items-center space-x-3 p-4 border border-support-light dark:border-support-dark rounded-lg hover:bg-background-light dark:hover:bg-surface-dark/50 transition-colors text-left"
          >
            <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            <div>
              <div className="font-medium text-text-primary-light dark:text-text-primary-dark">Team Collaboration</div>
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Coordinate efforts</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Ready to Start Implementation */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-6">
          Ready to Start Implementation?
        </h2>
        <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
          Follow our structured 5-phase approach to achieve CMMC 2.0 certification with defined roles and responsibilities
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/assessment-intro"
            className="bg-surface-light text-primary-600 px-8 py-4 rounded-xl font-bold hover:bg-background-light transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <Play className="w-5 h-5" />
            <span>Start Phase 1: Assessment</span>
          </Link>
          
          <Link
            to="/team"
            className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-surface-light/10 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Users className="w-5 h-5" />
            <span>Setup Implementation Team</span>
          </Link>
        </div>
        
        <div className="mt-6 text-primary-100 text-sm">
          <p>
            <strong>Total Timeline:</strong> 12-30 weeks • <strong>Team Size:</strong> 4-8 members • <strong>Platform Support:</strong> Integrated tools and automation
          </p>
        </div>
      </div>

      {/* Implementation Best Practices */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 border border-primary-200 dark:border-primary-800">
        <h3 className="text-2xl font-bold text-primary-900 dark:text-primary-100 mb-4">
          CMMC Implementation Best Practices
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-primary-800 dark:text-primary-200 mb-3">Project Success Factors</h4>
            <ul className="space-y-2 text-primary-700 dark:text-primary-300">
              <li>• Secure executive sponsorship and dedicated budget</li>
              <li>• Establish clear project governance and decision rights</li>
              <li>• Implement phased approach with regular milestone reviews</li>
              <li>• Maintain continuous stakeholder communication</li>
              <li>• Use integrated platform tools for efficiency</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-primary-800 dark:text-primary-200 mb-3">Key Implementation Milestones</h4>
            <ul className="space-y-2 text-primary-700 dark:text-primary-300">
              <li>• Baseline assessment and gap analysis completion</li>
              <li>• Team roles and RACI matrix establishment</li>
              <li>• Technical and process controls implementation</li>
              <li>• SSP and evidence collection finalization</li>
              <li>• Third-party assessment readiness validation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceWorkflow;