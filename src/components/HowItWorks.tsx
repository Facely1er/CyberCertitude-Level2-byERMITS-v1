import React, { useState } from 'react';
import { 
  Play, Target, FileText, Shield, CheckCircle, BarChart3, 
  Users, Database, Calendar, Award, ArrowRight, ChevronDown,
  ChevronUp, Zap, Clock, Eye,
  TrendingUp, AlertCircle, BookOpen, Settings
} from 'lucide-react';
import { Breadcrumbs } from '../shared/components/layout/Breadcrumbs';
import { Link } from 'react-router-dom';

export const HowItWorks: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const processSteps = [
    {
      id: 'assessment',
      title: 'Initial Assessment',
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      duration: '2-4 weeks',
      summary: 'Evaluate your current CMMC 2.0 Level 2 compliance posture across all 110 controls with automated gap analysis and scoring.',
      link: '/workflow-guidance#assessment'
    },
    {
      id: 'planning',
      title: 'Implementation Planning',
      icon: Calendar,
      color: 'from-purple-500 to-pink-500',
      duration: '1-2 weeks',
      summary: 'Establish your project charter, define scope, allocate resources, and assign team roles with RACI matrix and timeline planning.',
      link: '/workflow-guidance#project-setup'
    },
    {
      id: 'cui-scope',
      title: 'CUI Scope Definition',
      icon: Shield,
      color: 'from-red-500 to-orange-500',
      duration: '2-3 weeks',
      summary: 'Identify all systems, assets, and data flows that handle Controlled Unclassified Information and define your security boundaries.',
      link: '/workflow-guidance#cui-scope'
    },
    {
      id: 'implementation',
      title: 'Control Implementation',
      icon: Settings,
      color: 'from-green-500 to-emerald-500',
      duration: '3-6 months',
      summary: 'Systematically implement required security controls across 14 CMMC domains using our implementation workbook and policy templates.',
      link: '/workflow-guidance#implementation'
    },
    {
      id: 'evidence',
      title: 'Evidence Collection',
      icon: FileText,
      color: 'from-indigo-500 to-blue-500',
      duration: 'Ongoing',
      summary: 'Collect, organize, and validate compliance evidence with intelligent linking to controls and automated evidence packages.',
      link: '/workflow-guidance#evidence-collection'
    },
    {
      id: 'validation',
      title: 'Control Validation',
      icon: CheckCircle,
      color: 'from-teal-500 to-cyan-500',
      duration: '2-4 weeks',
      summary: 'Test and validate implemented controls to ensure they effectively protect CUI and meet CMMC requirements before external assessment.',
      link: '/workflow-guidance#validation'
    },
    {
      id: 'preparation',
      title: 'C3PAO Preparation',
      icon: Award,
      color: 'from-yellow-500 to-amber-500',
      duration: '4-6 weeks',
      summary: 'Compile your complete audit package, conduct mock assessments, and coordinate with C3PAO for official certification assessment.',
      link: '/workflow-guidance#c3pao-prep'
    },
    {
      id: 'certification',
      title: 'Certification & Maintenance',
      icon: TrendingUp,
      color: 'from-violet-500 to-purple-500',
      duration: 'Ongoing',
      summary: 'Achieve CMMC 2.0 Level 2 certification and maintain ongoing compliance with continuous monitoring and periodic assessments.',
      link: '/dashboard'
    }
  ];

  const keyFeatures = [
    {
      icon: Zap,
      title: 'Automated Assessment',
      description: 'AI-powered assessment engine guides you through 110 CMMC controls with context-aware recommendations'
    },
    {
      icon: Database,
      title: 'Evidence Management',
      description: 'Centralized repository for all compliance evidence with intelligent linking to controls'
    },
    {
      icon: BarChart3,
      title: 'Real-Time Compliance Tracking',
      description: 'Live dashboards showing your compliance posture with predictive analytics'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Role-based access control with team collaboration tools and task assignment'
    },
    {
      icon: FileText,
      title: 'Document Generation',
      description: 'Automatically generate SSP, POAM, and other required documentation from templates'
    },
    {
      icon: Shield,
      title: 'C3PAO Readiness',
      description: 'Comprehensive preparation tools and mock assessments to ensure certification success'
    }
  ];

  const benefits = [
    {
      title: 'Reduced Time to Compliance',
      description: 'Streamlined workflows and automation reduce implementation time by up to 60%',
      icon: Clock,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Lower Cost of Certification',
      description: 'Self-service platform eliminates need for expensive consultants while maintaining quality',
      icon: TrendingUp,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Reduced Risk',
      description: 'Comprehensive gap analysis and continuous monitoring identify risks early',
      icon: AlertCircle,
      color: 'text-red-600 dark:text-red-400'
    },
    {
      title: 'Better Documentation',
      description: 'Automated document generation ensures consistent, audit-ready documentation',
      icon: BookOpen,
      color: 'text-purple-600 dark:text-purple-400'
    }
  ];

  const quickStartGuide = [
    {
      step: 1,
      title: 'Create Your Account',
      description: 'Sign up with your organization email. Our platform is designed specifically for Government contractors handling CUI.',
      action: 'Sign Up Now',
      link: '/auth'
    },
    {
      step: 2,
      title: 'Start Your First Assessment',
      description: 'Begin with our guided CMMC 2.0 Level 2 assessment. No prior expertise required—we guide you through every step.',
      action: 'Start Assessment',
      link: '/assessment-intro'
    },
    {
      step: 3,
      title: 'Review Your Compliance Posture',
      description: 'Instantly see your compliance score, identify gaps, and get prioritized recommendations for improvement.',
      action: 'View Dashboard',
      link: '/dashboard'
    },
    {
      step: 4,
      title: 'Follow Implementation Guidance',
      description: 'Use our step-by-step workflow guidance tailored to your role to systematically achieve compliance.',
      action: 'View Workflow',
      link: '/workflow-guidance'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container-responsive section-padding">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs items={[
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'How It Works', isActive: true }
          ]} />
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 mb-12 text-center text-white shadow-2xl">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Play className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              How CyberCertitude Works
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Your complete guide to achieving CMMC 2.0 Level 2 certification with our comprehensive platform
            </p>
            <div className="mt-6 text-sm text-blue-200">
              <p>For detailed implementation guidance, see <Link to="/workflow-guidance" className="underline font-semibold hover:text-white">Workflow Guidance</Link></p>
              <p className="mt-2">For complete documentation, see <Link to="/user-manual" className="underline font-semibold hover:text-white">User Manual</Link></p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/assessment-intro"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Start Your Assessment</span>
              </Link>
              <Link
                to="/dashboard"
                className="bg-blue-700/50 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700/70 transition-all duration-200 border-2 border-white/30 flex items-center justify-center space-x-2"
              >
                <BarChart3 className="w-5 h-5" />
                <span>View Dashboard</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center space-x-3">
            <Zap className="w-8 h-8 text-yellow-500" />
            <span>Quick Start Guide</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
            Get started in four simple steps
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStartGuide.map((item) => (
              <div
                key={item.step}
                className="relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-blue-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 mt-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                  {item.description}
                </p>
                <Link
                  to={item.link}
                  className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  <span>{item.action}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Process Overview */}
        <div className="mb-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              The Complete CMMC 2.0 Journey
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From initial assessment to certification and beyond, our platform guides you through every step
            </p>
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg inline-block">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                💡 <strong>Need detailed guidance?</strong> See our{' '}
                <Link to="/workflow-guidance" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                  step-by-step Workflow Guidance
                </Link>{' '}
                with role-based recommendations, prerequisites, and implementation tips.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              const isExpanded = expandedSection === step.id;
              
              return (
                <div
                  key={step.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Step Header */}
                  <button
                    onClick={() => toggleSection(step.id)}
                    className="w-full p-6 md:p-8 flex items-start justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-start space-x-6 flex-1">
                      {/* Step Number and Icon */}
                      <div className="flex-shrink-0">
                        <div className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                          <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                        </div>
                        <div className="mt-3 text-center">
                          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            Step {index + 1}
                          </span>
                        </div>
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 text-left">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                            {step.title}
                          </h3>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                            {step.duration}
                          </span>
                        </div>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                          {step.summary}
                        </p>
                      </div>
                    </div>

                    {/* Expand/Collapse Button */}
                    <div className="flex-shrink-0 ml-4">
                      {isExpanded ? (
                        <ChevronUp className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-6 md:px-8 pb-6 md:pb-8 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                      <div className="mt-6">
                        <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
                          {step.summary}
                        </p>
                        <Link
                          to={step.link}
                          className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                        >
                          <span>View detailed implementation guide</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 rounded-2xl p-8 md:p-12 mb-12 text-white">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-4">Platform Capabilities</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Powerful features designed to streamline your CMMC 2.0 compliance journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-800 dark:bg-gray-900 rounded-xl p-6 hover:bg-gray-700 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105"
                >
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl w-fit mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-12">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose CyberCertitude?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get better results faster with our comprehensive platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 bg-gray-100 dark:bg-gray-700 rounded-xl ${benefit.color}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-8 md:p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Begin your CMMC 2.0 Level 2 compliance journey today with a comprehensive assessment
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/assessment-intro"
              className="bg-white text-teal-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Target className="w-5 h-5" />
              <span>Start Assessment</span>
            </Link>
            <Link
              to="/dashboard"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Eye className="w-5 h-5" />
              <span>Explore Platform</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;

