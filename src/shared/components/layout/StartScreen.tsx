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

      title: 'CMMC 2.0 Level 2 Readiness',
      description: 'DoD contractor certification preparation and compliance tracking',
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: Shield,
      title: 'CUI Protection',
      description: 'Controlled Unclassified Information security controls implementation',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: FileText,
      title: 'Documentation & Evidence',
      description: 'System Security Plans and compliance evidence management',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Activity,
      title: 'Assessment Preparation',
      description: 'Third-party assessment organization (C3PAO) readiness evaluation',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const quickStats = [
    { label: 'CMMC Level', value: '2', icon: Shield },
    { label: 'Security Domains', value: '14', icon: Target },
    { label: 'Maturity Level', value: '2', icon: Award },
    { label: 'Framework', value: 'NIST', icon: CheckCircle }
  ];

  const complianceCapabilities = [
    {
      icon: Target,
      title: 'Smart Assessments',
      description: 'Comprehensive security assessments aligned with NIST SP 800-171 and CMMC 2.0 Level 2 requirements',
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
      description: 'Comprehensive inventory management for systems processing CUI and related assets',
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
      <div className="flex-grow bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          {/* Welcome Back Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Welcome back, {userProfile.name}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8">
              Continue your CMMC 2.0 Level 2 compliance journey
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <button
                onClick={onContinue}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2 sm:space-x-3"
              >
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Go to Dashboard</span>
              </button>
              
              <button
                onClick={onStartAssessment}
                className="border-2 border-blue-600 text-blue-600 dark:text-blue-400 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 flex items-center justify-center space-x-2 sm:space-x-3"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Start New Assessment</span>
              </button>
            </div>
          </div>

          {/* Platform Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {platformFeatures.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className={`p-2 sm:p-3 bg-gradient-to-br ${feature.color} rounded-xl mb-3 sm:mb-4 w-fit`}>
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-gradient-to-br from-slate-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-teal-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Enhanced Hero Section */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
              <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Streamline Your
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                CMMC 2.0 Compliance
              </span>
            </h1>
            
            {/* Better positioned carousel */}
            <div className="max-w-4xl mx-auto mb-8 sm:mb-10">
              <div className="text-lg sm:text-xl md:text-2xl font-medium text-gray-700 dark:text-gray-200 mb-4 sm:mb-6">
                <TextCarousel
                  texts={[
                    "Comprehensive CMMC 2.0 Level 2 implementation platform",
                    "Streamlined evidence collection and documentation",
                    "Expert-guided assessment preparation",
                    "Complete CUI protection framework",
                    "C3PAO certification readiness"
                  ]}
                  interval={3500}
                  className="min-h-[3rem] sm:min-h-[4rem] flex items-center justify-center"
                />
              </div>
            </div>
            
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
              The complete solution for military contractors to achieve and maintain CMMC 2.0 Level 2 certification 
              with integrated NIST CSF alignment and comprehensive compliance management.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
            <button
              onClick={onStartAssessment}
              className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:from-teal-700 hover:to-blue-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 sm:hover:-translate-y-2 flex items-center justify-center space-x-2 sm:space-x-3"
            >
              <Play className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Start Assessment</span>
            </button>
            
            <Link
              to="/compliance-workflow"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 sm:hover:-translate-y-2 flex items-center justify-center space-x-2 sm:space-x-3"
            >
              <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>View Workflow</span>
            </Link>
            
            <Link
              to="/dashboard"
              className="border-2 sm:border-3 border-teal-600 text-teal-600 dark:text-teal-400 px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-200 flex items-center justify-center space-x-2 sm:space-x-3"
            >
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Platform Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16 lg:mb-20">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600 dark:text-teal-400 mx-auto mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Compliance Capabilities */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Complete Compliance Platform
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto px-4">
              Everything you need for CMMC 2.0 Level 2 compliance from initial assessment to ongoing monitoring
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {complianceCapabilities.map((capability, index) => (
              <Link
                key={index}
                to={capability.link}
                className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 block text-center cursor-pointer group"
              >
                <div className="p-2 sm:p-3 bg-gradient-to-br from-teal-500 to-blue-500 rounded-xl mb-4 sm:mb-6 w-fit mx-auto group-hover:scale-110 transition-transform duration-300">
                  <capability.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  {capability.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                  {capability.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Platform Features Overview */}
        <div className="mb-12 sm:mb-16 lg:mb-20 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
              CMMC 2.0 Level 2 Solution
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Comprehensive platform designed specifically for Military contractors seeking CMMC certification
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {platformFeatures.map((feature, index) => (
              <div key={index} className="bg-gray-800 dark:bg-gray-900 rounded-xl p-4 sm:p-6 hover:bg-gray-700 dark:hover:bg-gray-800 transition-all duration-300 text-center">
                <div className={`p-3 sm:p-4 bg-gradient-to-br ${feature.color} rounded-xl mb-4 sm:mb-6 w-fit mx-auto`}>
                  <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-center shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Start Your CMMC 2.0 Journey? 
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
            Take the first step toward CMMC 2.0 Level 2 certification with our comprehensive assessment and implementation platform
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onStartAssessment}
              className="bg-white text-teal-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Target className="w-5 h-5" />
              <span>Begin Assessment</span>
            </button>
            
            <Link
              to="/dashboard"
              className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-white/10 transition-all duration-200 flex items-center justify-center space-x-2"
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