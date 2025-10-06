import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, CheckCircle, Target, BarChart3, Shield, 
  FileText, Users, Settings, HelpCircle, Play, ArrowRight, Star, 
  Clock, Zap, Lock, Database, Globe, BookOpen, Video, ExternalLink,
  AlertTriangle, Info, X, SkipForward, RotateCcw, Building, User,
  GraduationCap, Wrench, Search, Filter, Download, Upload
} from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onComplete,
  onSkip
}) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [userProfile, setUserProfile] = useState({
    role: '',
    organization: '',
    experience: '',
    goals: []
  });
  const [isVisible, setIsVisible] = useState(true);

  const phases = [
    {
      id: 'welcome',
      title: 'Welcome to CyberCertitude™ CMMC',
      description: 'Let\'s get you started with CMMC 2.0 Level 2 compliance',
      icon: Shield,
      color: 'blue',
      steps: [
        {
          id: 'intro',
          title: 'Platform Overview',
          description: 'Learn about the comprehensive CMMC 2.0 Level 2 compliance platform',
          icon: Globe,
          content: {
            features: [
              'Complete CMMC 2.0 Level 2 assessment (110 controls)',
              'Real-time compliance monitoring',
              'Team collaboration and role management',
              'Automated SSP and POAM generation',
              'C3PAO preparation tools',
              'Evidence collection and management'
            ],
            benefits: [
              'Streamlined CMMC compliance process',
              'Reduced assessment time by 60%',
              'Automated documentation generation',
              'Team collaboration features',
              'C3PAO assessment readiness'
            ]
          }
        }
      ]
    },
    {
      id: 'profile-setup',
      title: 'Profile Setup',
      description: 'Configure your profile for personalized CMMC compliance experience',
      icon: User,
      color: 'green',
      steps: [
        {
          id: 'role-selection',
          title: 'Select Your Role',
          description: 'Choose your primary role in CMMC compliance',
          icon: Users,
          content: {
            roles: [
              {
                id: 'ciso',
                title: 'CISO/Compliance Officer',
                description: 'Strategic oversight and compliance management',
                icon: Shield,
                features: ['Executive dashboard', 'Team management', 'Strategic planning', 'C3PAO coordination']
              },
              {
                id: 'compliance-officer',
                title: 'Compliance Officer',
                description: 'Day-to-day compliance management and assessment',
                icon: Target,
                features: ['Assessment management', 'Evidence collection', 'Document generation', 'Progress tracking']
              },
              {
                id: 'domain-expert',
                title: 'Domain Expert',
                description: 'Technical implementation of specific CMMC domains',
                icon: Settings,
                features: ['Domain-specific assessments', 'Technical guidance', 'Implementation support', 'Evidence validation']
              },
              {
                id: 'implementation-team',
                title: 'Implementation Team',
                description: 'Hands-on control implementation and evidence collection',
                icon: Wrench,
                features: ['Control implementation', 'Evidence collection', 'Progress tracking', 'Team collaboration']
              },
              {
                id: 'auditor',
                title: 'Auditor/Reviewer',
                description: 'Compliance verification and quality assurance',
                icon: CheckCircle,
                features: ['Assessment review', 'Evidence validation', 'Gap analysis', 'Audit documentation']
              }
            ]
          }
        },
        {
          id: 'organization-setup',
          title: 'Organization Information',
          description: 'Configure your organization details for CMMC compliance',
          icon: Building,
          content: {
            fields: [
              { name: 'organizationName', label: 'Organization Name', type: 'text', required: true },
              { name: 'industry', label: 'Industry', type: 'select', options: ['Military', 'Aerospace', 'Technology', 'Manufacturing', 'Other'], required: true },
              { name: 'organizationSize', label: 'Organization Size', type: 'select', options: ['Small (< 50)', 'Medium (50-500)', 'Large (500+)'], required: true },
              { name: 'cuiScope', label: 'CUI Scope Description', type: 'textarea', required: true },
              { name: 'complianceGoals', label: 'Compliance Goals', type: 'multiselect', options: ['CMMC 2.0 Level 2', 'C3PAO Assessment', 'Continuous Compliance', 'Team Training'], required: true }
            ]
          }
        }
      ]
    },
    {
      id: 'feature-tour',
      title: 'Feature Tour',
      description: 'Explore key features of the CMMC compliance platform',
      icon: BookOpen,
      color: 'purple',
      steps: [
        {
          id: 'dashboard-tour',
          title: 'Dashboard Overview',
          description: 'Navigate the main dashboard and understand key metrics',
          icon: BarChart3,
          content: {
            sections: [
              {
                name: 'Compliance Overview',
                description: 'Real-time CMMC compliance status and scoring',
                features: ['Overall compliance percentage', 'Domain progress tracking', 'Gap analysis', 'C3PAO readiness']
              },
              {
                name: 'Recent Activity',
                description: 'Latest assessment and implementation activities',
                features: ['Assessment updates', 'Evidence submissions', 'Team activities', 'Progress notifications']
              },
              {
                name: 'Quick Actions',
                description: 'Fast access to common CMMC compliance tasks',
                features: ['Start new assessment', 'Generate reports', 'Manage evidence', 'Team collaboration']
              }
            ]
          }
        },
        {
          id: 'assessment-tour',
          title: 'CMMC Assessment Process',
          description: 'Learn how to conduct comprehensive CMMC 2.0 Level 2 assessments',
          icon: Target,
          content: {
            process: [
              {
                step: 1,
                title: 'CUI Scope Definition',
                description: 'Define systems and data that process, store, or transmit CUI',
                duration: '30-60 min'
              },
              {
                step: 2,
                title: 'Control Assessment',
                description: 'Evaluate implementation of 110 CMMC 2.0 Level 2 controls',
                duration: '4-6 hours'
              },
              {
                step: 3,
                title: 'Gap Analysis',
                description: 'Identify missing controls and implementation requirements',
                duration: '1-2 hours'
              },
              {
                step: 4,
                title: 'Documentation Generation',
                description: 'Create SSP, POAM, and C3PAO preparation materials',
                duration: '1-2 hours'
              }
            ]
          }
        },
        {
          id: 'team-collaboration',
          title: 'Team Collaboration',
          description: 'Set up team collaboration for CMMC compliance',
          icon: Users,
          content: {
            features: [
              {
                name: 'Role-Based Access',
                description: 'Assign appropriate permissions based on team roles',
                icon: Users
              },
              {
                name: 'RACI Matrix',
                description: 'Clear responsibility assignment for CMMC controls',
                icon: Target
              },
              {
                name: 'Workflow Management',
                description: 'Streamlined processes for assessment and implementation',
                icon: Settings
              },
              {
                name: 'Progress Tracking',
                description: 'Real-time monitoring of team progress and activities',
                icon: BarChart3
              }
            ]
          }
        }
      ]
    },
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Take your first steps with CMMC compliance',
      icon: Play,
      color: 'orange',
      steps: [
        {
          id: 'first-assessment',
          title: 'Start Your First Assessment',
          description: 'Begin with a CMMC 2.0 Level 2 assessment to evaluate your current posture',
          icon: Target,
          content: {
            recommendations: [
              'Use the guided assessment mode for first-time users',
              'Start with CUI scope definition',
              'Assign domain experts to specific sections',
              'Enable auto-save for progress protection'
            ],
            templates: [
              'Small Business CMMC Template',
              'Military Contractor Template',
              'Aerospace Industry Template',
              'Custom Organization Template'
            ]
          }
        },
        {
          id: 'evidence-collection',
          title: 'Evidence Collection Setup',
          description: 'Configure evidence collection and management for CMMC compliance',
          icon: FileText,
          content: {
            setup: [
              'Configure evidence storage and organization',
              'Set up evidence mapping to CMMC controls',
              'Enable version control and change tracking',
              'Configure C3PAO preparation workflows'
            ],
            bestPractices: [
              'Collect evidence as you implement controls',
              'Use consistent naming conventions',
              'Maintain audit trails for all changes',
              'Regular evidence validation and review'
            ]
          }
        }
      ]
    }
  ];

  const currentPhaseData = phases[currentPhase];
  const currentStepData = currentPhaseData?.steps[currentStep];

  const nextStep = () => {
    if (currentStep < currentPhaseData.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (currentPhase < phases.length - 1) {
      setCurrentPhase(currentPhase + 1);
      setCurrentStep(0);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (currentPhase > 0) {
      setCurrentPhase(currentPhase - 1);
      setCurrentStep(phases[currentPhase - 1].steps.length - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem('onboarding-completed', 'true');
    localStorage.setItem('user-profile', JSON.stringify(userProfile));
    onComplete();
  };

  const handleSkip = () => {
    setIsVisible(false);
    localStorage.setItem('onboarding-skipped', 'true');
    onSkip();
  };

  const updateUserProfile = (field: string, value: any) => {
    setUserProfile(prev => ({ ...prev, [field]: value }));
  };

  if (!isVisible) return null;

  const totalSteps = phases.reduce((acc, phase) => acc + phase.steps.length, 0);
  const currentStepNumber = phases.slice(0, currentPhase).reduce((acc, phase) => acc + phase.steps.length, 0) + currentStep + 1;
  const progress = (currentStepNumber / totalSteps) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-${currentPhaseData.color}-100 dark:bg-${currentPhaseData.color}-900/30 rounded-full flex items-center justify-center`}>
              <currentPhaseData.icon className={`w-6 h-6 text-${currentPhaseData.color}-600 dark:text-${currentPhaseData.color}-400`} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentPhaseData.title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Step {currentStepNumber} of {totalSteps}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSkip}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Skip onboarding"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`bg-${currentPhaseData.color}-600 h-2 rounded-full transition-all duration-300`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Phase Navigation */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          {phases.map((phase, index) => (
            <div
              key={phase.id}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                index === currentPhase
                  ? `bg-${phase.color}-100 text-${phase.color}-700 dark:bg-${phase.color}-900/30 dark:text-${phase.color}-300`
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <phase.icon className="w-4 h-4" />
              <span>{phase.title}</span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {currentStepData.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {currentStepData.description}
            </p>
          </div>

          {/* Role Selection */}
          {currentStepData.id === 'role-selection' && (
            <div className="grid md:grid-cols-2 gap-4">
              {currentStepData.content.roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => updateUserProfile('role', role.id)}
                  className={`p-6 border-2 rounded-lg text-left transition-all ${
                    userProfile.role === role.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <role.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">{role.title}</h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{role.description}</p>
                  <div className="space-y-2">
                    {role.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Organization Setup */}
          {currentStepData.id === 'organization-setup' && (
            <div className="space-y-6">
              {currentStepData.content.fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === 'text' && (
                    <input
                      type="text"
                      value={userProfile[field.name as keyof typeof userProfile] || ''}
                      onChange={(e) => updateUserProfile(field.name, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  )}
                  {field.type === 'select' && (
                    <select
                      value={userProfile[field.name as keyof typeof userProfile] || ''}
                      onChange={(e) => updateUserProfile(field.name, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select {field.label}</option>
                      {field.options?.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  )}
                  {field.type === 'textarea' && (
                    <textarea
                      value={userProfile[field.name as keyof typeof userProfile] || ''}
                      onChange={(e) => updateUserProfile(field.name, e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  )}
                  {field.type === 'multiselect' && (
                    <div className="space-y-2">
                      {field.options?.map((option) => (
                        <label key={option} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={userProfile.goals?.includes(option) || false}
                            onChange={(e) => {
                              const goals = userProfile.goals || [];
                              if (e.target.checked) {
                                updateUserProfile('goals', [...goals, option]);
                              } else {
                                updateUserProfile('goals', goals.filter(g => g !== option));
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Features List */}
          {currentStepData.content.features && (
            <div className="grid md:grid-cols-2 gap-4">
              {currentStepData.content.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          )}

          {/* Process Steps */}
          {currentStepData.content.process && (
            <div className="space-y-4">
              {currentStepData.content.process.map((step, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">{step.step}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">{step.description}</p>
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">{step.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Dashboard Sections */}
          {currentStepData.content.sections && (
            <div className="space-y-4">
              {currentStepData.content.sections.map((section, index) => (
                <div key={index} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{section.name}</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">{section.description}</p>
                  <div className="grid md:grid-cols-2 gap-2">
                    {section.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentPhase === 0 && currentStep === 0}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Skip tour
            </button>
            
            <button
              onClick={nextStep}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStepNumber === totalSteps
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : `bg-${currentPhaseData.color}-600 text-white hover:bg-${currentPhaseData.color}-700`
              }`}
            >
              <span>{currentStepNumber === totalSteps ? 'Complete Setup' : 'Next'}</span>
              {currentStepNumber === totalSteps ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

