import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Play, 
  CheckCircle, 
  Clock, 
  Users, 
  FileText, 
  Shield,
  Target,
  AlertTriangle,
  BookOpen,
  HelpCircle,
  ArrowRight,
  Lightbulb,
  Zap
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  deliverables: string[];
  tips: string[];
  icon: React.ComponentType<any>;
  color: string;
}

interface WorkflowGuidanceProps {
  currentPage?: string;
  userRole?: 'ciso' | 'compliance-officer' | 'domain-expert' | 'implementation-team' | 'auditor';
  onNavigate?: (path: string) => void;
  className?: string;
}

export const WorkflowGuidance: React.FC<WorkflowGuidanceProps> = ({
  currentPage = '/dashboard',
  userRole = 'compliance-officer',
  onNavigate,
  className = ''
}) => {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [showAllSteps, setShowAllSteps] = useState(false);

  const workflowSteps: WorkflowStep[] = [
    {
      id: 'assessment',
      title: 'Initial Assessment',
      description: 'Conduct comprehensive CMMC 2.0 Level 2 assessment to understand current compliance posture',
      estimatedTime: '2-4 weeks',
      difficulty: 'beginner',
      prerequisites: ['Team assembled', 'CUI scope defined'],
      deliverables: ['Assessment report', 'Gap analysis', 'Risk register'],
      tips: [
        'Start with a pilot assessment on a small system',
        'Involve all domain experts in the process',
        'Document everything for evidence collection',
        'Use the guided assessment mode for first-time users'
      ],
      icon: Target,
      color: 'blue'
    },
    {
      id: 'project-setup',
      title: 'Project Setup & Planning',
      description: 'Establish project charter, define scope, and assign team roles for CMMC implementation',
      estimatedTime: '1-2 weeks',
      difficulty: 'beginner',
      prerequisites: ['Management approval', 'Budget allocated'],
      deliverables: ['Project charter', 'Team RACI matrix', 'Implementation timeline'],
      tips: [
        'Get executive sponsorship early',
        'Define clear success criteria',
        'Establish regular check-in meetings',
        'Create communication plan for stakeholders'
      ],
      icon: Users,
      color: 'green'
    },
    {
      id: 'cui-scope',
      title: 'CUI Scope Definition',
      description: 'Identify all systems, networks, and data that handle Controlled Unclassified Information',
      estimatedTime: '2-3 weeks',
      difficulty: 'intermediate',
      prerequisites: ['Data classification policy', 'System inventory'],
      deliverables: ['CUI scope document', 'System boundary diagram', 'Data flow maps'],
      tips: [
        'Start broad and narrow down systematically',
        'Include all systems that process, store, or transmit CUI',
        'Document data flows between systems',
        'Regularly review and update scope as systems change'
      ],
      icon: Shield,
      color: 'purple'
    },
    {
      id: 'gap-analysis',
      title: 'Gap Analysis & Prioritization',
      description: 'Identify compliance gaps and prioritize implementation based on risk and business impact',
      estimatedTime: '1-2 weeks',
      difficulty: 'intermediate',
      prerequisites: ['Assessment completed', 'CUI scope defined'],
      deliverables: ['Gap analysis report', 'POA&M', 'Implementation roadmap'],
      tips: [
        'Focus on high-risk gaps first',
        'Consider business impact when prioritizing',
        'Involve technical teams in gap analysis',
        'Document rationale for prioritization decisions'
      ],
      icon: AlertTriangle,
      color: 'orange'
    },
    {
      id: 'implementation',
      title: 'Control Implementation',
      description: 'Implement missing security controls and update existing ones to meet CMMC requirements',
      estimatedTime: '3-6 months',
      difficulty: 'advanced',
      prerequisites: ['Gap analysis completed', 'Implementation plan approved'],
      deliverables: ['Implemented controls', 'Evidence documentation', 'Test results'],
      tips: [
        'Implement controls in phases',
        'Test controls thoroughly before declaring compliance',
        'Document all implementation activities',
        'Train staff on new procedures and technologies'
      ],
      icon: CheckCircle,
      color: 'green'
    },
    {
      id: 'evidence-collection',
      title: 'Evidence Collection & Documentation',
      description: 'Systematically collect and organize evidence to demonstrate control implementation',
      estimatedTime: 'Ongoing',
      difficulty: 'intermediate',
      prerequisites: ['Controls implemented', 'Documentation standards defined'],
      deliverables: ['Evidence repository', 'Documentation library', 'Audit trail'],
      tips: [
        'Collect evidence as you implement controls',
        'Use consistent naming conventions',
        'Maintain version control for all documents',
        'Regularly validate evidence completeness'
      ],
      icon: FileText,
      color: 'blue'
    },
    {
      id: 'validation',
      title: 'Internal Validation & Testing',
      description: 'Conduct internal validation to ensure all controls are properly implemented and effective',
      estimatedTime: '2-4 weeks',
      difficulty: 'advanced',
      prerequisites: ['Controls implemented', 'Evidence collected'],
      deliverables: ['Validation report', 'Test results', 'Remediation plan'],
      tips: [
        'Use independent testers when possible',
        'Test both technical and administrative controls',
        'Document all test procedures and results',
        'Address any findings before external assessment'
      ],
      icon: Shield,
      color: 'purple'
    },
    {
      id: 'c3pao-prep',
      title: 'C3PAO Preparation',
      description: 'Prepare for external C3PAO assessment and certification process',
      estimatedTime: '2-4 weeks',
      difficulty: 'advanced',
      prerequisites: ['Internal validation completed', 'All evidence organized'],
      deliverables: ['Assessment package', 'SSP', 'POA&M', 'Readiness checklist'],
      tips: [
        'Engage C3PAO early in the process',
        'Prepare comprehensive assessment package',
        'Conduct mock assessments to identify issues',
        'Ensure all team members understand their roles'
      ],
      icon: Target,
      color: 'orange'
    }
  ];

  const roleBasedRecommendations = {
    'ciso': [
      'Focus on strategic oversight and resource allocation',
      'Ensure executive sponsorship and stakeholder buy-in',
      'Monitor progress through executive dashboards',
      'Coordinate with C3PAO and external stakeholders'
    ],
    'compliance-officer': [
      'Lead the assessment and gap analysis process',
      'Coordinate evidence collection and documentation',
      'Manage POA&M and implementation tracking',
      'Prepare for C3PAO assessment'
    ],
    'domain-expert': [
      'Provide technical expertise for control implementation',
      'Validate technical controls and configurations',
      'Support evidence collection for technical domains',
      'Participate in internal validation activities'
    ],
    'implementation-team': [
      'Execute control implementation tasks',
      'Collect evidence and maintain documentation',
      'Participate in testing and validation',
      'Support ongoing compliance monitoring'
    ],
    'auditor': [
      'Review assessment results and gap analysis',
      'Validate evidence completeness and quality',
      'Conduct internal audits and testing',
      'Prepare for external assessment'
    ]
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-success-600 dark:text-success-400 bg-success-100 dark:bg-success-900/30';
      case 'intermediate': return 'text-warning-600 dark:text-warning-400 bg-warning-100 dark:bg-warning-900/30';
      case 'advanced': return 'text-error-600 dark:text-error-400 bg-error-100 dark:bg-error-900/30';
      default: return 'text-text-secondary-light dark:text-text-secondary-dark bg-background-light dark:bg-background-dark border border-support-light dark:border-support-dark';
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-primary-50 dark:bg-primary-900/30 border-primary-200 dark:border-primary-800 text-primary-900 dark:text-primary-100';
      case 'green': return 'bg-success-50 dark:bg-success-900/30 border-success-200 dark:border-success-800 text-success-900 dark:text-success-100';
      case 'purple': return 'bg-secondary-50 dark:bg-secondary-900/30 border-secondary-200 dark:border-secondary-800 text-secondary-900 dark:text-secondary-100';
      case 'orange': return 'bg-warning-50 dark:bg-warning-900/30 border-warning-200 dark:border-warning-800 text-warning-900 dark:text-warning-100';
      default: return 'bg-background-light dark:bg-background-dark border-support-light dark:border-support-dark text-text-primary-light dark:text-text-primary-dark';
    }
  };

  const visibleSteps = showAllSteps ? workflowSteps : workflowSteps.slice(0, 4);

  return (
    <div className={`card-standard ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-support-light dark:border-support-dark">
        <div className="mb-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
          <p className="text-sm text-text-primary-light dark:text-text-primary-dark">
            💡 Need an overview? See our{' '}
            <button
              onClick={() => onNavigate ? onNavigate('/how-it-works') : window.location.href = '/how-it-works'}
              className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
            >
              How It Works
            </button>{' '}
            page for platform capabilities, benefits, and high-level journey overview.
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                CMMC Implementation Workflow
              </h2>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Step-by-step guidance for {userRole.replace('-', ' ')} role
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAllSteps(!showAllSteps)}
            className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            <span>{showAllSteps ? 'Show Less' : 'Show All Steps'}</span>
            {showAllSteps ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Role-based Recommendations */}
      <div className="p-6 border-b border-support-light dark:border-support-dark">
        <div className="flex items-center space-x-2 mb-3">
          <Lightbulb className="w-5 h-5 text-warning-500" />
          <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">Role-Based Recommendations</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {roleBasedRecommendations[userRole]?.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-2 text-sm">
              <Zap className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
              <span className="text-text-primary-light dark:text-text-primary-dark">{recommendation}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="p-6">
        <div className="space-y-4">
          {visibleSteps.map((step, index) => (
            <div
              key={step.id}
              className={`border rounded-xl transition-all duration-200 ${
                expandedStep === step.id 
                  ? 'border-primary-300 dark:border-primary-700 shadow-md' 
                  : 'border-support-light dark:border-support-dark hover:border-primary-300 dark:hover:border-primary-700'
              }`}
            >
              <button
                onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-background-light dark:hover:bg-background-dark rounded-xl"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${getColorClasses(step.color)}`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">
                        Step {index + 1}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(step.difficulty)}`}>
                        {step.difficulty}
                      </span>
                      <span className="text-sm text-text-muted-light dark:text-text-muted-dark">
                        {step.estimatedTime}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mt-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
                {expandedStep === step.id ? (
                  <ChevronDown className="w-5 h-5 text-text-muted-light dark:text-text-muted-dark" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-text-muted-light dark:text-text-muted-dark" />
                )}
              </button>

              {expandedStep === step.id && (
                <div className="px-4 pb-4 border-t border-support-light dark:border-support-dark">
                  <div className="pt-4 space-y-4">
                    {/* Prerequisites */}
                    <div>
                      <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-success-500" />
                        <span>Prerequisites</span>
                      </h4>
                      <ul className="space-y-1">
                        {step.prerequisites.map((prereq, idx) => (
                          <li key={idx} className="text-sm text-text-secondary-light dark:text-text-secondary-dark flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-text-muted-light dark:bg-text-muted-dark rounded-full"></div>
                            <span>{prereq}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Deliverables */}
                    <div>
                      <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-primary-500" />
                        <span>Deliverables</span>
                      </h4>
                      <ul className="space-y-1">
                        {step.deliverables.map((deliverable, idx) => (
                          <li key={idx} className="text-sm text-text-secondary-light dark:text-text-secondary-dark flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>
                            <span>{deliverable}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tips */}
                    <div>
                      <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 flex items-center space-x-2">
                        <Lightbulb className="w-4 h-4 text-warning-500" />
                        <span>Pro Tips</span>
                      </h4>
                      <ul className="space-y-1">
                        {step.tips.map((tip, idx) => (
                          <li key={idx} className="text-sm text-text-secondary-light dark:text-text-secondary-dark flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-warning-400 rounded-full"></div>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Button */}
                    {onNavigate && (
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            // Map step IDs to actual routes
                            const routeMap: { [key: string]: string } = {
                              'assessment': '/assessment-intro',
                              'project-setup': '/project-charter',
                              'cui-scope': '/cui-scope',
                              'gap-analysis': '/gap-analysis',
                              'implementation': '/implementation-workbook',
                              'evidence-collection': '/evidence',
                              'validation': '/control-validation',
                              'c3pao-prep': '/c3pao-prep'
                            };
                            const route = routeMap[step.id];
                            if (route) {
                              onNavigate(route);
                            }
                          }}
                          className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
                        >
                          <span>Start this step</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 border-t border-support-light dark:border-support-dark bg-background-light dark:bg-background-dark">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-text-muted-light dark:text-text-muted-dark" />
            <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Need help?</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onNavigate?.('/help')}
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              View Help Center
            </button>
            <span className="text-text-muted-light dark:text-text-muted-dark">|</span>
            <button
              onClick={() => onNavigate?.('/user-manual')}
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              User Manual
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
