import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Play, 
  BookOpen, 
  Users, 
  Settings, 
  Database, 
  FileText, 
  Target, 
  BarChart3, 
  Clock, 
  AlertTriangle,
  ExternalLink,
  Download,
  Eye,
  Edit,
  Save
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  isCompleted: boolean;
  isRequired: boolean;
  estimatedTime: string;
}

interface CMMCOnboardingFlowProps {
  onComplete: () => void;
  onSkip: () => void;
  onNavigate?: (path: string) => void;
}

export const CMMCOnboardingFlow: React.FC<CMMCOnboardingFlowProps> = ({
  onComplete,
  onSkip,
  onNavigate
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [organizationInfo, setOrganizationInfo] = useState({
    name: '',
    industry: '',
    size: '',
    complianceRequirements: [] as string[],
    currentSecurityLevel: '',
    hasCMMCExperience: false,
    primaryContact: '',
    email: '',
    phone: ''
  });

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to CyberCertitude™ CMMC Portal',
      description: 'Your complete solution for CMMC 2.0 Level 2 compliance',
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      isCompleted: completedSteps.has('welcome'),
      isRequired: true,
      estimatedTime: '2 minutes',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to CyberCertitude™
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">

              Your comprehensive CMMC 2.0 Level 2 compliance platform designed specifically for Government contractors
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              What You'll Accomplish
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Complete CMMC Assessment</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Assess all 110 CMMC 2.0 Level 2 controls</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Generate Compliance Reports</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Create detailed compliance documentation</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Collect Evidence</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Organize and manage compliance evidence</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Prepare for C3PAO</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Get ready for C3PAO assessment</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1" />
              <div>
                <h4 className="font-medium text-yellow-900 dark:text-yellow-100">Important Note</h4>
                <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">

                  CMMC 2.0 Level 2 compliance is mandatory for Government contractors handling Controlled Unclassified Information (CUI). 
                  This platform will guide you through the entire process.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'organization',
      title: 'Organization Information',
      description: 'Tell us about your organization and compliance needs',
      icon: <Users className="w-8 h-8 text-green-600" />,
      isCompleted: completedSteps.has('organization'),
      isRequired: true,
      estimatedTime: '3 minutes',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Organization Information
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Help us customize your CMMC compliance experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Organization Name *
              </label>
              <input
                type="text"
                value={organizationInfo.name}
                onChange={(e) => setOrganizationInfo(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter organization name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Industry *
              </label>
              <select
                value={organizationInfo.industry}
                onChange={(e) => setOrganizationInfo(prev => ({ ...prev, industry: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Industry</option>
                <option value="aerospace">Aerospace & Military</option>
                <option value="technology">Technology</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="consulting">Consulting</option>
                <option value="research">Research & Development</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Organization Size *
              </label>
              <select
                value={organizationInfo.size}
                onChange={(e) => setOrganizationInfo(prev => ({ ...prev, size: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Size</option>
                <option value="small">Small (1-50 employees)</option>
                <option value="medium">Medium (51-500 employees)</option>
                <option value="large">Large (500+ employees)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Security Level
              </label>
              <select
                value={organizationInfo.currentSecurityLevel}
                onChange={(e) => setOrganizationInfo(prev => ({ ...prev, currentSecurityLevel: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Level</option>
                <option value="basic">Basic Security</option>
                <option value="intermediate">Intermediate Security</option>
                <option value="advanced">Advanced Security</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Primary Contact *
              </label>
              <input
                type="text"
                value={organizationInfo.primaryContact}
                onChange={(e) => setOrganizationInfo(prev => ({ ...prev, primaryContact: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter contact name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={organizationInfo.email}
                onChange={(e) => setOrganizationInfo(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Compliance Requirements
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['CMMC 2.0 Level 2', 'NIST 800-171', 'DFARS', 'ITAR', 'FISMA', 'Other'].map((req) => (
                <label key={req} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={organizationInfo.complianceRequirements.includes(req)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setOrganizationInfo(prev => ({
                          ...prev,
                          complianceRequirements: [...prev.complianceRequirements, req]
                        }));
                      } else {
                        setOrganizationInfo(prev => ({
                          ...prev,
                          complianceRequirements: prev.complianceRequirements.filter(r => r !== req)
                        }));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{req}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="hasCMMCExperience"
              checked={organizationInfo.hasCMMCExperience}
              onChange={(e) => setOrganizationInfo(prev => ({ ...prev, hasCMMCExperience: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="hasCMMCExperience" className="text-sm text-gray-700 dark:text-gray-300">
              Our organization has previous CMMC compliance experience
            </label>
          </div>
        </div>
      )
    },
    {
      id: 'journey',
      title: 'CMMC Compliance Journey',
      description: 'Understand the CMMC 2.0 Level 2 compliance process',
      icon: <Target className="w-8 h-8 text-purple-600" />,
      isCompleted: completedSteps.has('journey'),
      isRequired: true,
      estimatedTime: '5 minutes',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              CMMC 2.0 Level 2 Compliance Journey
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your roadmap to CMMC 2.0 Level 2 certification
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                phase: 'Assessment & Discovery',
                description: 'Understand current security posture and identify gaps',
                duration: '2-4 weeks',
                icon: <BarChart3 className="w-5 h-5" />,
                color: 'blue'
              },
              {
                phase: 'Implementation & Remediation',
                description: 'Implement missing controls and remediate identified gaps',
                duration: '8-12 weeks',
                icon: <Settings className="w-5 h-5" />,
                color: 'green'
              },
              {
                phase: 'Validation & Testing',
                description: 'Validate implementation and conduct testing',
                duration: '2-4 weeks',
                icon: <CheckCircle className="w-5 h-5" />,
                color: 'yellow'
              },
              {
                phase: 'C3PAO Preparation',
                description: 'Prepare for C3PAO assessment and certification',
                duration: '2-4 weeks',
                icon: <Shield className="w-5 h-5" />,
                color: 'purple'
              }
            ].map((phase, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className={`w-10 h-10 bg-${phase.color}-100 dark:bg-${phase.color}-900/30 rounded-full flex items-center justify-center text-${phase.color}-600`}>
                  {phase.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{phase.phase}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{phase.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{phase.duration}</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-300 dark:text-gray-600">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Key Success Factors</h4>
            <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <li>• Executive leadership commitment and support</li>
              <li>• Dedicated compliance team and resources</li>
              <li>• Regular progress monitoring and reporting</li>
              <li>• Employee training and awareness programs</li>
              <li>• Continuous monitoring and improvement</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'tools',
      title: 'Platform Tools & Features',
      description: 'Explore the tools available in CyberCertitude™',
      icon: <Settings className="w-8 h-8 text-orange-600" />,
      isCompleted: completedSteps.has('tools'),
      isRequired: true,
      estimatedTime: '4 minutes',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Platform Tools & Features
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Discover the comprehensive tools available for your CMMC compliance journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: 'CMMC Journey Workflow',
                description: 'Step-by-step guidance through the entire compliance process',
                icon: <Target className="w-6 h-6" />,
                color: 'blue',
                path: '/cmmc-journey'
              },
              {
                name: 'Control Assessor',
                description: 'Assess and validate all 110 CMMC 2.0 Level 2 controls',
                icon: <CheckCircle className="w-6 h-6" />,
                color: 'green',
                path: '/control-assessor'
              },
              {
                name: 'Evidence Collector',
                description: 'Organize and manage compliance evidence and documentation',
                icon: <FileText className="w-6 h-6" />,
                color: 'purple',
                path: '/evidence'
              },
              {
                name: 'Security Control Mapper',
                description: 'Map controls across different frameworks and standards',
                icon: <Shield className="w-6 h-6" />,
                color: 'red',
                path: '/security-controls'
              },
              {
                name: 'Configuration Baselines',
                description: 'Generate secure configuration baselines for systems',
                icon: <Settings className="w-6 h-6" />,
                color: 'yellow',
                path: '/config-baselines'
              },
              {
                name: 'Incident Response Planner',
                description: 'Develop and manage incident response procedures',
                icon: <AlertTriangle className="w-6 h-6" />,
                color: 'orange',
                path: '/incident-response'
              }
            ].map((tool, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-gray-300 dark:hover:border-gray-500 transition-colors cursor-pointer"
                onClick={() => onNavigate?.(tool.path)}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 bg-${tool.color}-100 dark:bg-${tool.color}-900/30 rounded-lg text-${tool.color}-600`}>
                    {tool.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{tool.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{tool.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Getting Started</h4>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p>1. Complete your organization profile and requirements</p>
              <p>2. Start with the CMMC Journey Workflow for guided compliance</p>
              <p>3. Use the Control Assessor to evaluate your current state</p>
              <p>4. Collect and organize evidence using the Evidence Collector</p>
              <p>5. Generate reports and prepare for C3PAO assessment</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'resources',
      title: 'Resources & Support',
      description: 'Access helpful resources and support options',
      icon: <BookOpen className="w-8 h-8 text-indigo-600" />,
      isCompleted: completedSteps.has('resources'),
      isRequired: false,
      estimatedTime: '3 minutes',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Resources & Support
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Access helpful resources to support your CMMC compliance journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">Documentation</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white">CMMC 2.0 Level 2 Guide</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Complete reference guide</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <FileText className="w-5 h-5 text-green-500" />
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white">Implementation Templates</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Ready-to-use templates</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Download className="w-5 h-5 text-purple-500" />
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white">Checklists & Forms</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Assessment and audit forms</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">Support</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Users className="w-5 h-5 text-orange-500" />
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white">Expert Consultation</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Get help from CMMC experts</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <ExternalLink className="w-5 h-5 text-red-500" />
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white">Community Forum</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Connect with other users</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white">Emergency Support</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300">24/7 critical support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Pro Tips</h4>
            <ul className="space-y-1 text-sm text-green-800 dark:text-green-200">
              <li>• Bookmark the CMMC Journey Workflow for easy access</li>
              <li>• Set up regular progress reviews with your team</li>
              <li>• Use the evidence collector to maintain organized documentation</li>
              <li>• Leverage the control assessor for ongoing compliance monitoring</li>
              <li>• Take advantage of expert consultation for complex requirements</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  const handleStepComplete = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      handleStepComplete(steps[currentStep].id);
      setCurrentStep(currentStep + 1);
    } else {
      handleStepComplete(steps[currentStep].id);
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                CMMC Onboarding
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Step {currentStep + 1} of {steps.length}: {currentStepData.title}
              </p>
            </div>
            <button
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Skip
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStepData.content}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Estimated time: {currentStepData.estimatedTime}</span>
            </div>
            
            <div className="flex gap-3">
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>
              )}
              
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};