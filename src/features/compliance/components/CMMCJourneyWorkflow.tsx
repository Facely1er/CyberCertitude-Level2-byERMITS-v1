import React, { useState, useEffect } from 'react';
import { CircleCheck as CheckCircle, Shield, FileText, Settings, Target, Play, ArrowRight, ArrowLeft, Download, BookOpen, SquareCheck as CheckSquare, Save } from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';
import LevelSelector from '@/components/LevelSelector';

interface CMMCJourneyStep {
  id: string;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedTime: string;
  dependencies: string[];
  deliverables: string[];
  tools: string[];
  resources: string[];
  progress: number;
  completedDate?: Date;
  notes?: string;
}

interface CMMCJourneyPhase {
  id: string;
  title: string;
  description: string;
  steps: CMMCJourneyStep[];
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  estimatedDuration: string;
}

interface CMMCJourneyWorkflowProps {
  selectedLevel?: number;
  onNavigate?: (path: string) => void;
  onSave?: (workflow: any) => void;
  onExport?: (workflow: any) => void;
}

const CMMC_PHASES: CMMCJourneyPhase[] = [
  {
    id: 'assessment',
    title: 'Assessment & Discovery',
    description: 'Understand your current security posture and identify gaps',
    estimatedDuration: '2-4 weeks',
    progress: 0,
    status: 'not-started',
    steps: [
      {
        id: 'initial-assessment',
        title: 'Initial Security Assessment',
        description: 'Conduct comprehensive assessment of current security controls',
        status: 'not-started',
        priority: 'critical',
        estimatedTime: '1-2 weeks',
        dependencies: [],
        deliverables: ['Assessment Report', 'Gap Analysis', 'Risk Register'],
        tools: ['CMMC Assessment Tool', 'Risk Assessment Generator'],
        resources: ['CMMC 2.0 Level 2 Assessment Guide', 'NIST 800-171 Reference'],
        progress: 0
      },
      {
        id: 'asset-inventory',
        title: 'Asset Inventory & Classification',
        description: 'Identify and classify all information systems and data',
        status: 'not-started',
        priority: 'critical',
        estimatedTime: '1 week',
        dependencies: ['initial-assessment'],
        deliverables: ['Asset Inventory', 'Data Classification Matrix', 'System Architecture'],
        tools: ['Asset Management Dashboard', 'Data Classification Tool'],
        resources: ['Asset Management Guide', 'Data Classification Policy Template'],
        progress: 0
      },
      {
        id: 'gap-analysis',
        title: 'Gap Analysis',
        description: 'Compare current state against CMMC 2.0 Level 2 requirements',
        status: 'not-started',
        priority: 'critical',
        estimatedTime: '1 week',
        dependencies: ['initial-assessment', 'asset-inventory'],
        deliverables: ['Gap Analysis Report', 'POA&M', 'Implementation Roadmap'],
        tools: ['Gap Analysis Tool', 'POA&M Manager'],
        resources: ['CMMC Gap Analysis Template', 'POA&M Template'],
        progress: 0
      }
    ]
  },
  {
    id: 'implementation',
    title: 'Implementation & Remediation',
    description: 'Implement missing controls and remediate identified gaps',
    estimatedDuration: '8-12 weeks',
    progress: 0,
    status: 'not-started',
    steps: [
      {
        id: 'policy-development',
        title: 'Policy & Procedure Development',
        description: 'Create comprehensive security policies and procedures',
        status: 'not-started',
        priority: 'high',
        estimatedTime: '2-3 weeks',
        dependencies: ['gap-analysis'],
        deliverables: ['Security Policies', 'Procedures Manual', 'Acceptable Use Policy'],
        tools: ['Policy Generator', 'Document Management'],
        resources: ['Policy Templates', 'Procedure Guidelines'],
        progress: 0
      },
      {
        id: 'technical-controls',
        title: 'Technical Controls Implementation',
        description: 'Implement technical security controls and configurations',
        status: 'not-started',
        priority: 'critical',
        estimatedTime: '4-6 weeks',
        dependencies: ['policy-development'],
        deliverables: ['Security Configurations', 'Baseline Configurations', 'Control Implementation'],
        tools: ['Configuration Baseline Generator', 'Security Control Mapper'],
        resources: ['Technical Control Guide', 'Configuration Templates'],
        progress: 0
      },
      {
        id: 'training-program',
        title: 'Security Awareness Training',
        description: 'Develop and deliver security awareness training program',
        status: 'not-started',
        priority: 'high',
        estimatedTime: '2-3 weeks',
        dependencies: ['policy-development'],
        deliverables: ['Training Materials', 'Training Records', 'Awareness Campaign'],
        tools: ['Training Module Generator', 'Awareness Campaign Planner'],
        resources: ['Training Templates', 'Awareness Materials'],
        progress: 0
      },
      {
        id: 'incident-response',
        title: 'Incident Response Planning',
        description: 'Develop incident response procedures and capabilities',
        status: 'not-started',
        priority: 'high',
        estimatedTime: '2-3 weeks',
        dependencies: ['policy-development'],
        deliverables: ['Incident Response Plan', 'Response Procedures', 'Contact Lists'],
        tools: ['Incident Response Planner', 'Emergency Contact Manager'],
        resources: ['Incident Response Template', 'Emergency Procedures'],
        progress: 0
      }
    ]
  },
  {
    id: 'validation',
    title: 'Validation & Testing',
    description: 'Validate implementation and conduct testing',
    estimatedDuration: '2-4 weeks',
    progress: 0,
    status: 'not-started',
    steps: [
      {
        id: 'control-testing',
        title: 'Control Testing & Validation',
        description: 'Test and validate all implemented controls',
        status: 'not-started',
        priority: 'critical',
        estimatedTime: '2-3 weeks',
        dependencies: ['technical-controls', 'training-program', 'incident-response'],
        deliverables: ['Test Results', 'Validation Report', 'Evidence Collection'],
        tools: ['Control Assessor', 'Evidence Collector'],
        resources: ['Testing Procedures', 'Validation Checklist'],
        progress: 0
      },
      {
        id: 'evidence-collection',
        title: 'Evidence Collection & Documentation',
        description: 'Collect and organize evidence of compliance',
        status: 'not-started',
        priority: 'high',
        estimatedTime: '1-2 weeks',
        dependencies: ['control-testing'],
        deliverables: ['Evidence Portfolio', 'Documentation Package', 'Compliance Report'],
        tools: ['Evidence Collection Dashboard', 'Document Manager'],
        resources: ['Evidence Collection Guide', 'Documentation Templates'],
        progress: 0
      }
    ]
  },
  {
    id: 'preparation',
    title: 'C3PAO Preparation',
    description: 'Prepare for C3PAO assessment and certification',
    estimatedDuration: '2-4 weeks',
    progress: 0,
    status: 'not-started',
    steps: [
      {
        id: 'readiness-assessment',
        title: 'Readiness Assessment',
        description: 'Conduct final readiness assessment for C3PAO evaluation',
        status: 'not-started',
        priority: 'critical',
        estimatedTime: '1-2 weeks',
        dependencies: ['evidence-collection'],
        deliverables: ['Readiness Report', 'Self-Assessment', 'C3PAO Application'],
        tools: ['Audit Tracker', 'Readiness Assessment Tool'],
        resources: ['C3PAO Preparation Guide', 'Assessment Checklist'],
        progress: 0
      },
      {
        id: 'final-documentation',
        title: 'Final Documentation & Submission',
        description: 'Prepare and submit final documentation package',
        status: 'not-started',
        priority: 'critical',
        estimatedTime: '1-2 weeks',
        dependencies: ['readiness-assessment'],
        deliverables: ['Final Documentation Package', 'C3PAO Submission', 'Certification Application'],
        tools: ['Document Generator', 'Submission Manager'],
        resources: ['Documentation Checklist', 'Submission Guidelines'],
        progress: 0
      }
    ]
  }
];

const CMMCJourneyWorkflow: React.FC<CMMCJourneyWorkflowProps> = ({
  selectedLevel = 2,
  onNavigate,
  onSave,
  onExport
}) => {
  const [phases, setPhases] = useState<CMMCJourneyPhase[]>(CMMC_PHASES);
  const [activePhase, setActivePhase] = useState<string>('assessment');
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [showStepDetails, setShowStepDetails] = useState(false);
  const [workflowProgress, setWorkflowProgress] = useState(0);

  // Calculate overall progress
  useEffect(() => {
    const totalSteps = phases.reduce((acc, phase) => acc + phase.steps.length, 0);
    const completedSteps = phases.reduce((acc, phase) => 
      acc + phase.steps.filter(step => step.status === 'completed').length, 0
    );
    setWorkflowProgress(Math.round((completedSteps / totalSteps) * 100));
  }, [phases]);

  // Update phases based on selected level
  useEffect(() => {
    const updatedPhases = CMMC_PHASES.map(phase => ({
      ...phase,
      steps: phase.steps.map(step => ({
        ...step,
        // Update step descriptions based on level
        description: selectedLevel === 1 
          ? step.description.replace('CMMC 2.0 Level 2', 'CMMC 2.0 Level 1')
          : step.description,
        tools: selectedLevel === 1 
          ? step.tools.filter(tool => !tool.includes('C3PAO'))
          : step.tools,
        resources: selectedLevel === 1
          ? step.resources.map(resource => 
              resource.replace('Level 2', 'Level 1').replace('110 controls', '17 controls')
            )
          : step.resources
      }))
    }));
    setPhases(updatedPhases);
  }, [selectedLevel]);

  const updateStepStatus = (phaseId: string, stepId: string, status: CMMCJourneyStep['status']) => {
    setPhases(prev => prev.map(phase => {
      if (phase.id === phaseId) {
        const updatedSteps = phase.steps.map(step => {
          if (step.id === stepId) {
            return {
              ...step,
              status,
              completedDate: status === 'completed' ? new Date() : undefined,
              progress: status === 'completed' ? 100 : step.progress
            };
          }
          return step;
        });
        
        // Update phase status based on steps
        const phaseStatus = updatedSteps.every(step => step.status === 'completed') 
          ? 'completed' 
          : updatedSteps.some(step => step.status === 'in-progress' || step.status === 'completed')
          ? 'in-progress'
          : 'not-started';
        
        const phaseProgress = Math.round(
          updatedSteps.reduce((acc, step) => acc + step.progress, 0) / updatedSteps.length
        );

        return {
          ...phase,
          steps: updatedSteps,
          status: phaseStatus,
          progress: phaseProgress
        };
      }
      return phase;
    }));
  };

  const updateStepProgress = (phaseId: string, stepId: string, progress: number) => {
    setPhases(prev => prev.map(phase => {
      if (phase.id === phaseId) {
        const updatedSteps = phase.steps.map(step => {
          if (step.id === stepId) {
            const newProgress = Math.min(100, Math.max(0, progress));
            const newStatus: CMMCJourneyStep['status'] = 
              newProgress === 100 ? 'completed' : 
              newProgress > 0 ? 'in-progress' : 
              'not-started';
            
            return {
              ...step,
              progress: newProgress,
              status: newStatus
            };
          }
          return step;
        });
        
        const phaseProgress = Math.round(
          updatedSteps.reduce((acc, step) => acc + step.progress, 0) / updatedSteps.length
        );

        return {
          ...phase,
          steps: updatedSteps,
          progress: phaseProgress
        };
      }
      return phase;
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'blocked': return 'text-red-600 bg-red-100';
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

  const getPhaseIcon = (phaseId: string) => {
    switch (phaseId) {
      case 'assessment': return <Target className="w-5 h-5" />;
      case 'implementation': return <Settings className="w-5 h-5" />;
      case 'validation': return <CheckCircle className="w-5 h-5" />;
      case 'preparation': return <Shield className="w-5 h-5" />;
      default: return <CheckSquare className="w-5 h-5" />;
    }
  };

  const handleToolClick = (tool: string) => {
    const toolRoutes: { [key: string]: string } = {
      'Project Charter': '/project-charter',
      'CUI Scope Definition': '/cui-scope',
      'Data Flow Diagram': '/data-flow',
      'Team Roles Assignment': '/team-roles',
      'CMMC Assessment Tool': '/assessment-intro',
      'Risk Assessment Generator': '/risk-assessment',
      'Asset Management Dashboard': '/assets',
      'Gap Analysis Tool': '/gap-analysis',
      'Implementation Workbook': '/implementation-workbook',
      'Policy Templates': '/policy-templates',
      'Document Repository': '/document-repository',
      'POA&M Manager': '/poam-manager',
      'Policy Generator': '/policy-generator',
      'Configuration Baseline Generator': '/config-baselines',
      'Security Control Mapper': '/security-controls',
      'Training Module Generator': '/training-modules',
      'Awareness Campaign Planner': '/awareness-campaigns',
      'Incident Response Planner': '/incident-response',
      'Enhanced Incident Response Plan': '/incident-response-plan-generator',
      'Security Assessment Report': '/reports/security-assessment',
      'Control Assessor': '/control-assessor',
      'Evidence Collection Dashboard': '/evidence-collector',
      'Audit Tracker': '/audit-tracker',
      'Audit Readiness Package': '/audit-package',
      'C3PAO Preparation': '/c3pao-prep',
      'Metrics Dashboard': '/metrics-dashboard',
      'Certification Tracking': '/certification-tracking'
    };

    const route = toolRoutes[tool];
    if (route && onNavigate) {
      onNavigate(route);
    }
  };

  const renderPhaseOverview = () => (
    <div className="space-y-6">
      {/* Add Level Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <LevelSelector
          selectedLevel={selectedLevel}
          onLevelChange={(level) => {
            // This would need to be passed up to parent component
            // For now, we'll just update local state
            console.log('Level changed to:', level);
          }}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              CMMC 2.0 Level {selectedLevel} Journey
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Complete workflow for CMMC 2.0 Level {selectedLevel} compliance
              {selectedLevel === 2 ? ' and C3PAO certification' : ' and self-assessment'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onSave?.(phases)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Progress
            </button>
            <button
              onClick={() => onExport?.(phases)}
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
              Overall Progress
            </h3>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {workflowProgress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${workflowProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            {phases.reduce((acc, phase) => acc + phase.steps.filter(step => step.status === 'completed').length, 0)} of {phases.reduce((acc, phase) => acc + phase.steps.length, 0)} steps completed
          </p>
        </div>

        {/* Phases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {phases.map((phase) => (
            <div
              key={phase.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                activePhase === phase.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
              onClick={() => setActivePhase(phase.id)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${
                  phase.status === 'completed' ? 'bg-green-100 text-green-600' :
                  phase.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {getPhaseIcon(phase.id)}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {phase.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {phase.estimatedDuration}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">{phase.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      phase.status === 'completed' ? 'bg-green-500' :
                      phase.status === 'in-progress' ? 'bg-blue-500' :
                      'bg-gray-400'
                    }`}
                    style={{ width: `${phase.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{phase.steps.filter(s => s.status === 'completed').length} completed</span>
                  <span>{phase.steps.length} total</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPhaseSteps = () => {
    const phase = phases.find(p => p.id === activePhase);
    if (!phase) return null;

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {phase.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {phase.description}
              </p>
            </div>
            <button
              onClick={() => setActivePhase('')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Overview
            </button>
          </div>

          <div className="space-y-4">
            {phase.steps.map((step, index) => (
              <div
                key={step.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  activeStep === step.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
                onClick={() => {
                  setActiveStep(step.id);
                  setShowStepDetails(true);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {step.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(step.status)}`}>
                        {step.status.replace('-', ' ').toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(step.priority)}`}>
                        {step.priority.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {step.estimatedTime}
                      </span>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-300">Progress</span>
                        <span className="font-medium text-gray-900 dark:text-white">{step.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            step.status === 'completed' ? 'bg-green-500' :
                            step.status === 'in-progress' ? 'bg-blue-500' :
                            'bg-gray-400'
                          }`}
                          style={{ width: `${step.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStepStatus(phase.id, step.id, 'in-progress');
                      }}
                      className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                      title="Start Step"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStepStatus(phase.id, step.id, 'completed');
                      }}
                      className="p-2 text-gray-500 hover:text-green-600 transition-colors"
                      title="Complete Step"
                    >
                      <CheckCircle className="w-4 h-4" />
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

  const renderStepDetails = () => {
    const phase = phases.find(p => p.id === activePhase);
    const step = phase?.steps.find(s => s.id === activeStep);
    if (!phase || !step) return null;

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {step.description}
              </p>
            </div>
            <button
              onClick={() => setShowStepDetails(false)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Steps
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Step Information */}
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Step Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(step.status)}`}>
                      {step.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Priority:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(step.priority)}`}>
                      {step.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Estimated Time:</span>
                    <span className="text-gray-900 dark:text-white">{step.estimatedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Progress:</span>
                    <span className="text-gray-900 dark:text-white">{step.progress}%</span>
                  </div>
                </div>
              </div>

              {/* Progress Control */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Update Progress</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Progress: {step.progress}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={step.progress}
                      onChange={(e) => updateStepProgress(phase.id, step.id, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStepStatus(phase.id, step.id, 'in-progress')}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Start
                    </button>
                    <button
                      onClick={() => updateStepStatus(phase.id, step.id, 'completed')}
                      className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Complete
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tools and Resources */}
            <div className="space-y-6">
              {/* Tools */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Available Tools</h4>
                <div className="space-y-2">
                  {step.tools.map((tool, index) => (
                    <button
                      key={index}
                      onClick={() => handleToolClick(tool)}
                      className="w-full text-left p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-900 dark:text-white">{tool}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Resources</h4>
                <div className="space-y-2">
                  {step.resources.map((resource, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg"
                    >
                      <BookOpen className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-900 dark:text-white">{resource}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverables */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Deliverables</h4>
                <div className="space-y-2">
                  {step.deliverables.map((deliverable, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg"
                    >
                      <FileText className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-gray-900 dark:text-white">{deliverable}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const breadcrumbs = [
    { label: 'Compliance', path: '/cmmc-journey' },
    { label: 'CMMC Journey Workflow', isActive: true }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      {!activePhase && renderPhaseOverview()}
      {activePhase && !showStepDetails && renderPhaseSteps()}
      {showStepDetails && renderStepDetails()}
    </div>
  );
};

export default CMMCJourneyWorkflow;