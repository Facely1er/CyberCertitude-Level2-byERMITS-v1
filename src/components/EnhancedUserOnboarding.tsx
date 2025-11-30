import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, ChevronLeft, CheckCircle, Target, BarChart3, Shield, 
  FileText, Users, Settings, HelpCircle, Play, ArrowRight, Star, 
  Clock, Zap, Lock, Database, Globe, BookOpen, Video, ExternalLink,
  AlertTriangle, Info, X, SkipForward, RotateCcw
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  estimatedTime?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  features?: string[];
  tips?: string[];
}

interface EnhancedUserOnboardingProps {
  isFirstVisit: boolean;
  onComplete: () => void;
  onSkip: () => void;
  userRole?: 'ciso' | 'compliance-officer' | 'domain-expert' | 'implementation-team' | 'auditor';
}

export const EnhancedUserOnboarding: React.FC<EnhancedUserOnboardingProps> = ({
  isFirstVisit,
  onComplete,
  onSkip,
  userRole = 'compliance-officer'
}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(isFirstVisit);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showTips, setShowTips] = useState(true);
  const [onboardingMode, setOnboardingMode] = useState<'quick' | 'comprehensive'>('quick');

  const roleBasedSteps = {
    'ciso': [
      {
        id: 'welcome',
        title: 'Welcome to CyberCertitude™ CMMC',

        description: 'Your comprehensive CMMC 2.0 Level 2 compliance platform for Government contractors protecting Controlled Unclassified Information.',
        icon: Shield,
        color: 'blue',
        features: [
          'Complete CMMC 2.0 Level 2 assessment (110 controls)',
          'Real-time compliance monitoring dashboard',
          'Team collaboration and role management',
          'C3PAO preparation and documentation',
          'Executive reporting and analytics'
        ]
      },
      {
        id: 'strategic-overview',
        title: 'Strategic CMMC Compliance Overview',
        description: 'Understand the strategic importance of CMMC 2.0 Level 2 certification for your organization.',
        icon: Target,
        color: 'green',
        estimatedTime: '5 min',
        features: [
          'CMMC 2.0 Level 2 business impact analysis',
          'CUI scope definition and risk assessment',
          'Compliance timeline and resource planning',
          'C3PAO assessment preparation strategy',
          'Executive dashboard and reporting'
        ]
      },
      {
        id: 'team-setup',
        title: 'Set Up Your CMMC Team',
        description: 'Configure team roles, responsibilities, and collaboration workflows for CMMC compliance.',
        icon: Users,
        color: 'purple',
        estimatedTime: '10 min',
        action: {
          label: 'Configure Team Roles',
          onClick: () => navigate('/settings'),
          variant: 'primary'
        },
        tips: [
          'Assign domain experts to specific CMMC domains',
          'Set up RACI matrix for clear responsibilities',
          'Configure review and approval workflows',
          'Enable team collaboration features'
        ]
      },
      {
        id: 'compliance-dashboard',
        title: 'CMMC Compliance Dashboard',
        description: 'Monitor real-time compliance status, progress tracking, and C3PAO readiness.',
        icon: BarChart3,
        color: 'indigo',
        estimatedTime: '3 min',
        action: {
          label: 'View Dashboard',
          onClick: () => navigate('/dashboard'),
          variant: 'primary'
        },
        features: [
          'Real-time compliance scoring',
          'Domain progress tracking',
          'Gap analysis and prioritization',
          'C3PAO readiness assessment',
          'Executive summary reports'
        ]
      }
    ],
    'compliance-officer': [
      {
        id: 'welcome',
        title: 'Welcome to CyberCertitude™ CMMC',

        description: 'Your comprehensive CMMC 2.0 Level 2 compliance platform for Government contractors protecting Controlled Unclassified Information.',
        icon: Shield,
        color: 'blue',
        features: [
          'Complete CMMC 2.0 Level 2 assessment (110 controls)',
          'Evidence collection and management',
          'SSP and POAM generation',
          'C3PAO preparation tools',
          'Compliance monitoring and reporting'
        ]
      },
      {
        id: 'assessment-start',
        title: 'Start Your CMMC Assessment',
        description: 'Begin with a comprehensive CMMC 2.0 Level 2 assessment to evaluate your current CUI protection posture.',
        icon: Target,
        color: 'green',
        estimatedTime: '4-6 hours',
        action: {
          label: 'Start CMMC Assessment',
          onClick: () => navigate('/assessment-intro'),
          variant: 'primary'
        },
        tips: [
          'Define CUI scope before starting assessment',
          'Gather existing security documentation',
          'Assign domain experts to specific sections',
          'Use templates for faster completion'
        ]
      },
      {
        id: 'evidence-collection',
        title: 'Evidence Collection & Management',
        description: 'Systematically collect and manage compliance evidence for C3PAO assessment and audit documentation.',
        icon: FileText,
        color: 'orange',
        estimatedTime: '2-3 hours',
        action: {
          label: 'Manage Evidence',
          onClick: () => navigate('/evidence'),
          variant: 'primary'
        },
        features: [
          'Document upload and organization',
          'Evidence mapping to CMMC controls',
          'Version control and change tracking',
          'C3PAO assessment preparation',
          'Audit trail maintenance'
        ]
      },
      {
        id: 'documentation-generation',
        title: 'Generate CMMC Documentation',
        description: 'Create comprehensive SSP, POAM, and C3PAO preparation documents.',
        icon: FileText,
        color: 'red',
        estimatedTime: '1-2 hours',
        action: {
          label: 'Generate Documents',
          onClick: () => navigate('/reports'),
          variant: 'primary'
        },
        features: [
          'Automated SSP generation',
          'POAM creation and tracking',
          'Policy template library',
          'C3PAO preparation packages',
          'Audit documentation'
        ]
      }
    ],
    'domain-expert': [
      {
        id: 'welcome',
        title: 'Welcome to CyberCertitude™ CMMC',
        description: 'Your specialized CMMC 2.0 Level 2 compliance platform for domain experts and technical implementation teams.',
        icon: Shield,
        color: 'blue',
        features: [
          'Domain-specific CMMC assessments',
          'Technical control implementation guidance',
          'Evidence collection and validation',
          'Team collaboration tools',
          'Progress tracking and reporting'
        ]
      },
      {
        id: 'domain-assignment',
        title: 'Your CMMC Domain Assignments',
        description: 'Review your assigned CMMC domains and begin technical control implementation.',
        icon: Target,
        color: 'green',
        estimatedTime: '2-4 hours',
        action: {
          label: 'View My Domains',
          onClick: () => navigate('/dashboard'),
          variant: 'primary'
        },
        tips: [
          'Focus on your assigned domains first',
          'Use technical implementation guidance',
          'Document control implementation details',
          'Collaborate with other domain experts'
        ]
      },
      {
        id: 'control-implementation',
        title: 'Control Implementation Guide',
        description: 'Step-by-step guidance for implementing CMMC controls in your domain.',
        icon: Settings,
        color: 'purple',
        estimatedTime: '1-2 hours',
        action: {
          label: 'Start Implementation',
          onClick: () => navigate('/compliance-workflow'),
          variant: 'primary'
        },
        features: [
          'Technical implementation guidance',
          'Configuration templates and baselines',
          'Testing and validation procedures',
          'Evidence collection requirements',
          'Progress tracking and reporting'
        ]
      }
    ],
    'implementation-team': [
      {
        id: 'welcome',
        title: 'Welcome to CyberCertitude™ CMMC',
        description: 'Your CMMC 2.0 Level 2 implementation platform for hands-on control implementation and evidence collection.',
        icon: Shield,
        color: 'blue',
        features: [
          'Control implementation guidance',
          'Evidence collection tools',
          'Progress tracking and reporting',
          'Team collaboration features',
          'CMMC compliance monitoring'
        ]
      },
      {
        id: 'implementation-tasks',
        title: 'Your Implementation Tasks',
        description: 'Review assigned CMMC control implementation tasks and begin work.',
        icon: Target,
        color: 'green',
        estimatedTime: 'Varies by task',
        action: {
          label: 'View My Tasks',
          onClick: () => navigate('/tasks'),
          variant: 'primary'
        },
        tips: [
          'Prioritize tasks by CMMC domain importance',
          'Follow implementation guidance carefully',
          'Document all implementation steps',
          'Collect evidence as you implement'
        ]
      },
      {
        id: 'evidence-collection',
        title: 'Evidence Collection Process',
        description: 'Learn how to collect and document evidence for CMMC controls.',
        icon: FileText,
        color: 'orange',
        estimatedTime: '30 min',
        action: {
          label: 'Start Evidence Collection',
          onClick: () => navigate('/evidence'),
          variant: 'primary'
        },
        features: [
          'Evidence collection checklists',
          'Document upload and organization',
          'Evidence validation and review',
          'Progress tracking and reporting',
          'C3PAO preparation support'
        ]
      }
    ],
    'auditor': [
      {
        id: 'welcome',
        title: 'Welcome to CyberCertitude™ CMMC',
        description: 'Your CMMC 2.0 Level 2 audit and review platform for compliance verification and quality assurance.',
        icon: Shield,
        color: 'blue',
        features: [
          'Assessment review and validation',
          'Evidence verification tools',
          'Compliance gap analysis',
          'Audit documentation',
          'Quality assurance workflows'
        ]
      },
      {
        id: 'audit-review',
        title: 'Assessment Review Process',
        description: 'Review CMMC assessments and validate evidence for compliance.',
        icon: Target,
        color: 'green',
        estimatedTime: '2-3 hours',
        action: {
          label: 'Start Review Process',
          onClick: () => navigate('/audit-logs'),
          variant: 'primary'
        },
        tips: [
          'Review assessments systematically by domain',
          'Validate evidence against CMMC requirements',
          'Document findings and recommendations',
          'Ensure C3PAO readiness'
        ]
      },
      {
        id: 'compliance-verification',
        title: 'Compliance Verification',
        description: 'Verify CMMC control implementation and compliance status.',
        icon: CheckCircle,
        color: 'purple',
        estimatedTime: '1-2 hours',
        action: {
          label: 'Verify Compliance',
          onClick: () => navigate('/compliance'),
          variant: 'primary'
        },
        features: [
          'Control implementation verification',
          'Evidence validation and review',
          'Compliance gap identification',
          'Audit report generation',
          'C3PAO preparation validation'
        ]
      }
    ]
  };

  const steps = roleBasedSteps[userRole] || roleBasedSteps['compliance-officer'];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem('onboarding-completed', 'true');
    localStorage.setItem('onboarding-role', userRole);
    localStorage.setItem('onboarding-mode', onboardingMode);
    onComplete();
  };

  const handleSkip = () => {
    setIsVisible(false);
    localStorage.setItem('onboarding-skipped', 'true');
    onSkip();
  };

  const markStepComplete = (stepIndex: number) => {
    setCompletedSteps(prev => new Set([...prev, stepIndex]));
  };

  const resetOnboarding = () => {
    localStorage.removeItem('onboarding-completed');
    localStorage.removeItem('onboarding-skipped');
    setCurrentStep(0);
    setCompletedSteps(new Set());
  };

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-support-light dark:border-support-dark">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-${currentStepData.color}-100 dark:bg-${currentStepData.color}-900/30 rounded-full flex items-center justify-center`}>
              <IconComponent className={`w-6 h-6 text-${currentStepData.color}-600 dark:text-${currentStepData.color}-400`} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                CMMC Onboarding
              </h2>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowTips(!showTips)}
              className="p-2 text-text-muted-dark hover:text-text-secondary-light dark:hover:text-text-secondary-dark transition-colors"
              title="Toggle tips"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button
              onClick={handleSkip}
              className="p-2 text-text-muted-dark hover:text-text-secondary-light dark:hover:text-text-secondary-dark transition-colors"
              title="Skip onboarding"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary-light dark:text-text-secondary-dark">Progress</span>
            <span className="text-sm text-text-muted-light dark:text-text-muted-dark">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-support-light dark:bg-surface-dark rounded-full h-2">
            <div 
              className={`bg-${currentStepData.color}-600 h-2 rounded-full transition-all duration-300`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-3">
              {currentStepData.title}
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-4">
              {currentStepData.description}
            </p>
            {currentStepData.estimatedTime && (
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-support-light dark:bg-surface-dark rounded-full text-sm text-text-secondary-light dark:text-text-secondary-dark">
                <Clock className="w-4 h-4" />
                <span>Estimated time: {currentStepData.estimatedTime}</span>
              </div>
            )}
          </div>

          {/* Features */}
          {currentStepData.features && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
                What you'll learn:
              </h4>
              <div className="grid md:grid-cols-2 gap-3">
                {currentStepData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-background-light dark:bg-surface-dark rounded-lg">
                    <CheckCircle className="w-5 h-5 text-success-500 flex-shrink-0" />
                    <span className="text-text-primary-light dark:text-text-secondary-dark text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          {showTips && currentStepData.tips && (
            <div className="mb-6 p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Info className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h4 className="font-semibold text-primary-900 dark:text-primary-300">Pro Tips</h4>
              </div>
              <ul className="space-y-2">
                {currentStepData.tips.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-2 text-primary-800 dark:text-primary-200 text-sm">
                    <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Button */}
          {currentStepData.action && (
            <div className="mb-6">
              <button
                onClick={() => {
                  currentStepData.action?.onClick();
                  markStepComplete(currentStep);
                }}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  currentStepData.action.variant === 'primary'
                    ? `bg-${currentStepData.color}-600 text-white hover:bg-${currentStepData.color}-700`
                    : currentStepData.action.variant === 'secondary'
                    ? `bg-${currentStepData.color}-100 text-${currentStepData.color}-700 hover:bg-${currentStepData.color}-200 dark:bg-${currentStepData.color}-900/30 dark:text-${currentStepData.color}-300 dark:hover:bg-${currentStepData.color}-900/50`
                    : `border border-${currentStepData.color}-300 text-${currentStepData.color}-700 hover:bg-${currentStepData.color}-50 dark:border-${currentStepData.color}-600 dark:text-${currentStepData.color}-300 dark:hover:bg-${currentStepData.color}-900/20`
                }`}
              >
                {currentStepData.action.label}
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 px-4 py-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            
            {currentStep > 0 && (
              <button
                onClick={resetOnboarding}
                className="flex items-center space-x-2 px-4 py-2 text-text-muted-light dark:text-text-muted-dark hover:text-text-primary-light dark:hover:text-text-secondary-dark transition-colors"
                title="Restart onboarding"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restart</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSkip}
              className="text-sm text-text-muted-light dark:text-text-muted-dark hover:text-text-primary-light dark:hover:text-text-secondary-dark transition-colors"
            >
              Skip tour
            </button>
            
            <button
              onClick={nextStep}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === steps.length - 1
                  ? 'bg-success-600 text-white hover:bg-success-700'
                  : `bg-${currentStepData.color}-600 text-white hover:bg-${currentStepData.color}-700`
              }`}
            >
              <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
              {currentStep === steps.length - 1 ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="mt-6 flex justify-center space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index <= currentStep 
                  ? `bg-${currentStepData.color}-600` 
                  : 'bg-support-light dark:bg-primary-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

