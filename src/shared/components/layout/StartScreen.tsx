import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, Play, BarChart3, Target, Award, CheckCircle, 
  Building, Users, Eye, Activity, Clock, Star, Info, FileText,
  ArrowRight, TrendingUp, Globe, Lock, BookOpen, Zap, Calendar,
  Database, CheckSquare, ClipboardCheck
} from 'lucide-react';
import { TextCarousel } from '../../../components/TextCarousel';
import { UserProfile } from '../../types';

interface StartScreenProps {
  userProfile: UserProfile | null;
  onStartAssessment: () => void;
  onContinue: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  userProfile,
  onStartAssessment,
  onContinue
}) => {

  
  const platformFeatures = [
    {
      icon: Building,
      title: 'CMMC Level 1 Readiness',
      description: 'DoD contractor certification preparation and compliance tracking',
      color: 'from-red-500 to-orange-500',
      link: '/compliance-workflow'
    },
    {
      icon: Shield,
      title: 'FCI Protection',
      description: 'Federal Contract Information security controls implementation',
      color: 'from-blue-500 to-indigo-500',
      link: '/assets'
    },
    {
      icon: FileText,
      title: 'Documentation & Evidence',
      description: 'System Security Plans and compliance evidence management',
      color: 'from-purple-500 to-pink-500',
      link: '/evidence'
    },
    {
      icon: Activity,
      title: 'Assessment Preparation',
      description: 'Self-assessment readiness and preparation',
      color: 'from-green-500 to-emerald-500',
      link: '/assessment-intro'
    }
  ];

  const quickStats = [
    { label: 'CMMC Level', value: '1', icon: Shield },
    { label: 'Security Practices', value: '17', icon: Target },
    { label: 'Maturity Level', value: '1', icon: Award },
    { label: 'Framework', value: 'NIST', icon: CheckCircle }
  ];

  const complianceCapabilities = [
    {
      icon: Target,
      title: 'Smart Assessments',
      description: 'Role-based security assessments aligned with SP 800-171 and CMMC requirements for comprehensive gap analysis',
      link: '/assessment-intro'
    },
    {
      icon: FileText,
      title: 'Evidence Management',
      description: 'Centralized collection and organization of compliance documentation for audit readiness',
      link: '/evidence'
    },
    {
      icon: BarChart3,
      title: 'Compliance Tracking',
      description: 'Real-time visibility into implementation progress and security control maturity levels',
      link: '/dashboard'
    },
    {
      icon: Calendar,
      title: 'Implementation Planning',
      description: 'Structured timeline management for compliance activities and milestone tracking',
      link: '/calendar'
    },
    {
      icon: Database,
      title: 'Asset & Scope Management',
      description: 'Comprehensive inventory management for systems processing FCI and related assets',
      link: '/assets'
    },
    {
      icon: ClipboardCheck,
      title: 'Policy Templates',
      description: 'Ready-to-implement security policies and procedures aligned with CMMC requirements',
      link: '/policies'
    }
  ];

  if (userProfile) {
    return (
      <div className="flex-grow bg-gradient-brand-subtle dark:bg-gradient-dark-brand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Welcome Back Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome back, {userProfile.name}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Continue your CMMC Level 1 compliance journey
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onContinue}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-3"
              >
                <BarChart3 className="w-5 h-5" />
                <span>Go to Dashboard</span>
              </button>
              
              <button
                onClick={onStartAssessment}
                className="border-2 border-blue-600 text-blue-600 dark:text-blue-400 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 flex items-center justify-center space-x-3"
              >
                <Play className="w-5 h-5" />
                <span>Start New Assessment</span>
              </button>
            </div>
          </div>

          {/* Platform Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformFeatures.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 block cursor-pointer group"
              >
                <div className={`p-3 bg-gradient-to-br ${feature.color} rounded-xl mb-4 w-fit group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-gradient-brand-subtle dark:bg-gradient-dark-brand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Enhanced Hero Section */}
        <div className="text-center mb-20">
          <div className="mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-primary-gold to-secondary-gold bg-clip-text text-transparent">
                Streamline Your
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                CMMC Compliance
              </span>
            </h1>
            
            {/* Better positioned carousel */}
            <div className="max-w-4xl mx-auto mb-10">
              <div className="text-2xl font-medium text-gray-700 dark:text-gray-200 mb-6">
                <TextCarousel
                  texts={[
                    "Comprehensive CMMC Level 1 implementation platform",
                    "Streamlined evidence collection and documentation",
                    "Expert-guided assessment preparation",
                    "Complete FCI protection framework",
                    "Self-assessment certification readiness"
                  ]}
                  interval={3500}
                  className="min-h-[4rem] flex items-center justify-center"
                />
              </div>
            </div>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              The complete solution for DoD contractors to achieve and maintain CMMC Level 1 certification 
              with integrated SP 800-171 alignment and comprehensive compliance management.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={onStartAssessment}
              className="bg-gradient-brand text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gradient-primary transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 flex items-center justify-center space-x-3"
            >
              <Play className="w-6 h-6" />
              <span>Start Assessment</span>
            </button>
            
            <Link
              to="/compliance-workflow"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 flex items-center justify-center space-x-3"
            >
              <Activity className="w-6 h-6" />
              <span>View Workflow</span>
            </Link>
            
            <Link
              to="/dashboard"
              className="border-3 border-primary-gold text-primary-gold dark:text-dark-primary px-10 py-5 rounded-2xl font-bold text-lg hover:bg-primary-gold/10 dark:hover:bg-dark-primary/20 transition-all duration-200 flex items-center justify-center space-x-3"
            >
              <BarChart3 className="w-6 h-6" />
              <span>Platform Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <stat.icon className="w-8 h-8 text-primary-gold dark:text-dark-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Compliance Capabilities */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Complete Compliance Platform
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
              Everything you need for CMMC Level 1 compliance from initial assessment to ongoing monitoring
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {complianceCapabilities.map((capability, index) => (
              <Link
                key={index}
                to={capability.link}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 block text-center cursor-pointer group"
              >
                <div className="p-3 bg-gradient-brand rounded-xl mb-6 w-fit mx-auto group-hover:scale-110 transition-transform duration-300">
                  <capability.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {capability.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {capability.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Platform Features Overview */}
        <div className="mb-20 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 rounded-3xl p-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-6">
              CMMC Level 1 Solution
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive platform designed specifically for DoD contractors seeking CMMC certification
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {platformFeatures.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="bg-gray-800 dark:bg-gray-900 rounded-xl p-6 hover:bg-gray-700 dark:hover:bg-gray-800 transition-all duration-300 text-center block cursor-pointer group"
              >
                <div className={`p-4 bg-gradient-to-br ${feature.color} rounded-xl mb-6 w-fit mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-brand rounded-3xl p-12 text-center shadow-2xl">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your CMMC Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Take the first step toward CMMC Level 1 certification with our comprehensive assessment and implementation platform
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onStartAssessment}
              className="bg-white text-primary-gold px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Target className="w-5 h-5" />
              <span>Begin Assessment</span>
            </button>
            
            <Link
              to="/dashboard"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <ArrowRight className="w-5 h-5" />
              <span>Explore Platform</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};