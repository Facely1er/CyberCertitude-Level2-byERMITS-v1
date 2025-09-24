import React from 'react';
import { X, CheckCircle, ArrowRight } from 'lucide-react';

interface CMMCOnboardingFlowProps {
  onComplete: () => void;
  onSkip: () => void;
  onNavigate: (path: string) => void;
}

export const CMMCOnboardingFlow: React.FC<CMMCOnboardingFlowProps> = ({
  onComplete,
  onSkip,
  onNavigate
}) => {
  const [currentStep, setCurrentStep] = React.useState(0);

  const steps = [
    {
      title: "Welcome to CMMC Compliance Assistant",
      description: "Let's get you started with your CMMC Level 1 compliance journey.",
      content: (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Welcome!</h3>
          <p className="text-gray-600">
            This tool will help you navigate CMMC Level 1 compliance requirements
            and track your progress.
          </p>
        </div>
      )
    },
    {
      title: "Key Features",
      description: "Discover the powerful features available to you.",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900">Assessment Tools</h4>
              <p className="text-sm text-blue-700">Comprehensive CMMC Level 1 assessments</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900">Progress Tracking</h4>
              <p className="text-sm text-green-700">Monitor your compliance journey</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900">Policy Generation</h4>
              <p className="text-sm text-purple-700">Automated policy and documentation</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-900">Asset Management</h4>
              <p className="text-sm text-orange-700">Track and manage your IT assets</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Getting Started",
      description: "Ready to begin your compliance journey?",
      content: (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <ArrowRight className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">You're All Set!</h3>
          <p className="text-gray-600">
            Start by taking the CMMC Level 1 assessment or explore the dashboard
            to see what's available.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                onNavigate('/assessment');
                onComplete();
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Assessment
            </button>
            <button
              onClick={() => {
                onNavigate('/dashboard');
                onComplete();
              }}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Explore Dashboard
            </button>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {currentStepData.title}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {currentStepData.description}
            </p>
          </div>
          <button
            onClick={onSkip}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Skip onboarding"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4">
          <div className="flex items-center space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded-full ${
                  index <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {currentStepData.content}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            Previous
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={onSkip}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Skip Tour
            </button>
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};