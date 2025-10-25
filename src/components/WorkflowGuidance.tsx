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
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-50 border-blue-200 text-blue-900';
      case 'green': return 'bg-green-50 border-green-200 text-green-900';
      case 'purple': return 'bg-purple-50 border-purple-200 text-purple-900';
      case 'orange': return 'bg-orange-50 border-orange-200 text-orange-900';
      default: return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  const visibleSteps = showAllSteps ? workflowSteps : workflowSteps.slice(0, 4);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                CMMC Implementation Workflow
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Step-by-step guidance for {userRole.replace('-', ' ')} role
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAllSteps(!showAllSteps)}
            className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <span>{showAllSteps ? 'Show Less' : 'Show All Steps'}</span>
            {showAllSteps ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Role-based Recommendations */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 mb-3">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Role-Based Recommendations</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {roleBasedRecommendations[userRole]?.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-2 text-sm">
              <Zap className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{recommendation}</span>
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
              className={`border rounded-lg transition-all duration-200 ${
                expandedStep === step.id 
                  ? 'border-blue-300 shadow-md' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <button
                onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${getColorClasses(step.color)}`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Step {index + 1}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(step.difficulty)}`}>
                        {step.difficulty}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {step.estimatedTime}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
                {expandedStep === step.id ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {expandedStep === step.id && (
                <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="pt-4 space-y-4">
                    {/* Prerequisites */}
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Prerequisites</span>
                      </h4>
                      <ul className="space-y-1">
                        {step.prerequisites.map((prereq, idx) => (
                          <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                            <span>{prereq}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Deliverables */}
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span>Deliverables</span>
                      </h4>
                      <ul className="space-y-1">
                        {step.deliverables.map((deliverable, idx) => (
                          <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                            <span>{deliverable}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tips */}
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
                        <Lightbulb className="w-4 h-4 text-yellow-500" />
                        <span>Pro Tips</span>
                      </h4>
                      <ul className="space-y-1">
                        {step.tips.map((tip, idx) => (
                          <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
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
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
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
      <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Need help?</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onNavigate?.('/help')}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View Help Center
            </button>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <button
              onClick={() => onNavigate?.('/user-manual')}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              User Manual
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
