import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, Target, ChartBar as BarChart3, Shield, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Info, BookOpen, Users, Building, Globe, Zap, Award, Star, ArrowRight, Activity, FileText, Lightbulb, TrendingUp, Lock, Eye } from 'lucide-react';
import { Framework, OrganizationInfo } from '../../../shared/types';
import { Breadcrumbs } from '../../../shared/components/layout/Breadcrumbs';
import { useInternalLinking } from '../../../shared/hooks/useInternalLinking';
import LevelSelector from '../../../components/LevelSelector';

interface AssessmentIntroScreenProps {
  selectedLevel?: number;
  frameworks?: Framework[];
  onStartAssessment?: (organizationInfo?: OrganizationInfo, selectedFramework?: string, selectedLevel?: number) => void;
  onShowTemplates?: (frameworkId?: string) => void;
  onBack?: () => void;
}

const AssessmentIntroScreen: React.FC<AssessmentIntroScreenProps> = ({ // Renamed to AssessmentIntroScreen
  frameworks,
  selectedLevel = 2,
  onStartAssessment,
  onShowTemplates,
  onBack: _onBack
}) => {
  const { breadcrumbs } = useInternalLinking();
  const [showOrganizationForm, setShowOrganizationForm] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState<string>(frameworks?.[0]?.id || 'cmmc');
  const [organizationInfo, setOrganizationInfo] = useState<Partial<OrganizationInfo>>({
    name: '', // Default to empty string
    industry: '',
    size: '',
    location: '',
    assessor: ''
  });

  // Get the currently selected framework
  const currentFramework = (frameworks || [{ id: 'cmmc', name: 'CMMC 2.0 Level 2', description: 'Cybersecurity Maturity Model Certification Level 2', version: '2.0', sections: [], complexity: 'advanced' } as any]).find(f => f.id === selectedFramework) || (frameworks?.[0] as any);

  const getFrameworkIcon = (frameworkId: string) => {
    // CMMC-only platform
    return Building;
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'basic':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'intermediate':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'advanced':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
    }
  };

  const totalQuestions = currentFramework?.sections?.reduce((sum, section) => 
    sum + section.categories.reduce((catSum, category) => 
      catSum + (category.questions?.length || 0), 0), 0) || 0;

  const highPriorityQuestions = currentFramework?.sections?.reduce((sum, section) => 
    sum + section.categories.reduce((catSum, category) => 
      catSum + (category.questions?.filter(q => q.priority === 'high')?.length || 0), 0), 0) || 0;

  const getFrameworkBenefits = (frameworkId: string) => {
    // CMMC-only benefits
    return [
      'Required for Government contractors and suppliers',
      'Protects Controlled Unclassified Information (CUI)',
      'Ensures military supply chain cybersecurity',
      'Maintains eligibility for military contracts',
      'C3PAO assessment preparation',
      'NIST SP 800-171 compliance foundation'
    ];
  };

  const getPreparationChecklist = (frameworkId: string) => {
    // CMMC-only preparation checklist
    return [
      'System Security Plan (SSP) documentation',
      'CUI handling procedures and policies',
      'Technical security control implementations',
      'Personnel security and training records',
      'Incident Response Plan (IRP)',
      'Configuration Management Plan',
      'Risk Assessment Report',
      'Security Assessment Report',
      'Continuous Monitoring Plan',
      'Physical Security Plan',
      'Media Protection Plan',
      'Supply Chain Risk Management Plan',
      'Awareness and Training Records',
      'Audit Logs and Review Records',
      'Vulnerability Scan Reports and Penetration Test Reports',
      'CUI Registry and data flow documentation',
      'Network architecture diagrams with CUI boundaries',
      'Access control matrix and user account documentation',
      'Encryption implementation and key management documentation'
    ];
  };

  const handleOrganizationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartAssessment(organizationInfo as OrganizationInfo, selectedFramework, selectedLevel);
  };

  const FrameworkIcon = getFrameworkIcon(currentFramework.id);

  return (
    <div className="container-responsive section-padding">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Header */}
      <div className="card-standard mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-xl">
                <FrameworkIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  Cybersecurity Framework Assessment
                </h1>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  Choose Your Framework & Begin Assessment
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Framework Selection */}
          <div className="card-standard p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Target className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                Assessment Setup
              </h2>
            </div>
            
            {/* Single Framework Display */}
            <div className="mb-8">
              <div className={`p-6 border-2 rounded-xl shadow-lg ${
                'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              }`}>
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                    <Building className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-primary-900 dark:text-primary-100">
                        {currentFramework.name}
                      </h3>
                      <span className="px-3 py-1 bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-300 text-xs font-medium rounded-full">
                        Military Required
                      </span>
                      <span className="px-3 py-1 bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-300 text-xs font-medium rounded-full">
                        Level 2 - CUI Protection
                      </span>
                    </div>
                    
                    <p className="text-sm mb-4 text-primary-700 dark:text-primary-300">
                      {currentFramework.description}
                    </p>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-primary-600 dark:text-primary-400">
                          240min
                        </div>
                        <div className="text-xs text-text-muted-light dark:text-text-muted-dark">Duration</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-primary-600 dark:text-primary-400">
                          110
                        </div>
                        <div className="text-xs text-text-muted-light dark:text-text-muted-dark">Controls</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-primary-600 dark:text-primary-400">
                          Level 2
                        </div>
                        <div className="text-xs text-text-muted-light dark:text-text-muted-dark">CMMC</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid gap-6 mb-8">
              {/* CMMC framework is pre-selected as this is a CMMC-only platform */}
            </div>
          </div>

          {/* CMMC Framework Overview */}
          <div className="card-standard p-8">
            <div className="flex items-center space-x-3 mb-6">
              <FrameworkIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                CMMC 2.0 Level 2 Overview
              </h2>
            </div>
            
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-lg leading-relaxed mb-8">
              {currentFramework.description}
            </p>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-800">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  240
                </div>
                <div className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                  Minutes
                </div>
              </div>
              
              <div className="text-center p-4 bg-success-50 dark:bg-success-900/20 rounded-xl border border-success-200 dark:border-success-800">
                <div className="text-2xl font-bold text-success-600 dark:text-success-400 mb-2">
                  110
                </div>
                <div className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                  Controls
                </div>
              </div>
              
              <div className="text-center p-4 bg-secondary-50 dark:bg-secondary-900/20 rounded-xl border border-secondary-200 dark:border-secondary-800">
                <div className="text-2xl font-bold text-secondary-600 dark:text-secondary-400 mb-2">
                  14
                </div>
                <div className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                  Domains
                </div>
              </div>
              
              <div className="text-center p-4 bg-warning-50 dark:bg-warning-900/20 rounded-xl border border-warning-200 dark:border-warning-800">
                <div className="text-2xl font-bold text-warning-600 dark:text-warning-400 mb-2">
                  Level 2
                </div>
                <div className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                  CMMC Level
                </div>
              </div>
            </div>

            {/* Complexity Badge */}
            <div className="flex items-center justify-center mb-8">
              <div className={`px-6 py-3 rounded-full border-2 font-bold text-lg ${getComplexityColor(currentFramework.complexity)}`}>
                Military Contractor Assessment - Advanced Complexity
              </div>
            </div>

            {/* Framework Benefits */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-4 flex items-center">
                <Star className="w-6 h-6 mr-3 text-warning-500" />
                CMMC 2.0 Level 2 Benefits
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {getFrameworkBenefits('cmmc').map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-background-light dark:bg-background-dark rounded-lg border border-support-light dark:border-support-dark">
                    <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                    <span className="text-text-primary-light dark:text-text-primary-dark">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Industry Applicability */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-4 flex items-center">
                <Building className="w-6 h-6 mr-3 text-primary-500" />
                Applicable Organizations
              </h3>
              <div className="flex flex-wrap gap-3">
                {['Military Prime Contractors', 'Military Subcontractors', 'Military Supply Chain', 'CUI Handlers'].map((org, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 rounded-full text-sm font-medium border border-primary-200 dark:border-primary-800"
                  >
                    {org}
                  </span>
                ))}
              </div>
            </div>

            {/* CMMC Domains Overview */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-4 flex items-center">
                  <Shield className="w-6 h-6 mr-3 text-success-500" />
                  CMMC Domains (14)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    'Access Control (AC)', 'Audit and Accountability (AU)',
                    'Awareness and Training (AT)', 'Configuration Management (CM)', 'Identification and Authentication (IA)',
                    'Incident Response (IR)', 'Maintenance (MA)', 'Media Protection (MP)',
                    'Personnel Security (PS)', 'Physical Protection (PE)',
                    'Risk Assessment (RA)', 'Security Assessment (CA)', 'System and Communications Protection (SC)',
                    'System and Information Integrity (SI)'
                  ].map((domain, index) => (
                    <div key={index} className="p-3 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg">
                      <span className="text-sm font-medium text-success-800 dark:text-success-300">{domain}</span>
                    </div>
                  ))}
                </div>
              </div>
          </div>

          {/* Preparation Checklist */}
          <div className="card-standard p-8">
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6 flex items-center">
              <Lightbulb className="w-8 h-8 mr-3 text-warning-500" />
              CMMC Assessment Preparation
            </h2>
            
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
              Gather these materials before starting your CMMC assessment to ensure accurate evaluation and C3PAO readiness:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {getPreparationChecklist('cmmc').map((item, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-warning-50 dark:bg-warning-900/20 rounded-lg border border-warning-200 dark:border-warning-800">
                  <div className="w-6 h-6 border-2 border-warning-500 rounded flex-shrink-0 mt-0.5"></div>
                  <span className="text-text-primary-light dark:text-text-primary-dark">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Facts */}
          <div className="card-standard p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
              Quick Facts
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary-light dark:text-text-secondary-dark">Version</span>
                <span className="font-medium text-text-primary-light dark:text-text-primary-dark">
                  {currentFramework.version}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-text-secondary-light dark:text-text-secondary-dark">Estimated Time</span>
                <span className="font-medium text-text-primary-light dark:text-text-primary-dark">
                  {currentFramework?.estimatedTime || 'N/A'} minutes
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-text-secondary-light dark:text-text-secondary-dark">Total Controls</span>
                <span className="font-medium text-text-primary-light dark:text-text-primary-dark">
                  110
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-text-secondary-light dark:text-text-secondary-dark">Domains</span>
                <span className="font-medium text-text-primary-light dark:text-text-primary-dark">
                  14
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-text-secondary-light dark:text-text-secondary-dark">CMMC Level</span>
                <span className="font-medium text-text-primary-light dark:text-text-primary-dark">
                  Level 2 (CUI Protection)
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-text-secondary-light dark:text-text-secondary-dark">Assessment Type</span>
                <span className="font-medium text-text-primary-light dark:text-text-primary-dark capitalize">
                  Military Contractor Compliance
                </span>
              </div>
            </div>
          </div>

          {/* Assessment Tips */}
          <div className="bg-gradient-to-br from-success-50 to-success-50 dark:from-success-900/20 dark:to-success-900/20 rounded-xl p-6 border border-success-200 dark:border-success-800">
            <h3 className="text-lg font-semibold text-success-900 dark:text-success-100 mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2" />
              CMMC Assessment Tips
            </h3>
            
            <ul className="space-y-3 text-sm text-success-800 dark:text-success-200">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 mt-0.5 text-success-600" />
                <span>This CMMC 2.0 Level 2 assessment covers all 110 required controls - take your time for accurate evaluation</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 mt-0.5 text-success-600" />
                <span>Use the CMMC implementation guidance and CUI protection examples provided</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 mt-0.5 text-success-600" />
                <span>Your progress is automatically saved</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 mt-0.5 text-success-600" />
                <span>You can pause and resume at any time</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 mt-0.5 text-success-600" />
                <span>Estimated completion time: 240 minutes for complete CMMC evaluation</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 mt-0.5 text-success-600" />
                <span>Generate SSP and POAM documents upon completion</span>
              </li>
            </ul>
          </div>

          {/* Maturity Levels */}
          <div className="card-standard p-6">
            <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              CMMC 2.0 Level 2 Requirements
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-error-500 rounded-full" />
                <div>
                  <div className="font-medium text-text-primary-light dark:text-text-primary-dark text-sm">
                    Process Institutionalization
                  </div>
                  <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                    Documented policies and procedures
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-warning-500 rounded-full" />
                <div>
                  <div className="font-medium text-text-primary-light dark:text-text-primary-dark text-sm">
                    CUI Protection
                  </div>
                  <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                    All 110 controls implemented
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-success-500 rounded-full" />
                <div>
                  <div className="font-medium text-text-primary-light dark:text-text-primary-dark text-sm">
                    C3PAO Assessment Ready
                  </div>
                  <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                    Third-party assessment preparation
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Level Selector */}
          <div className="mb-8">
            <LevelSelector
              selectedLevel={selectedLevel}
              onLevelChange={(level) => {
                // This would need to be passed up to parent component
                console.log('Level changed to:', level);
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
           <Link
             to="/compliance-workflow"
             className="w-full bg-gradient-to-r from-secondary-400 to-accent-500 text-white py-4 px-6 rounded-2xl font-bold text-xl hover:from-secondary-500 hover:to-accent-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 flex items-center space-x-3 mx-auto"
           >
             <Activity className="w-6 h-6" />
             <span>Start Implementation Workflow</span>
           </Link>
           
            <button
              onClick={() => setShowOrganizationForm(!showOrganizationForm)}
              className="w-full bg-gradient-to-r from-primary-500 to-secondary-400 text-white py-4 px-6 rounded-xl font-bold hover:from-primary-600 hover:to-secondary-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Start CMMC Level {selectedLevel} Assessment</span>
            </button>
            
            <button
              onClick={() => onStartAssessment(undefined, selectedFramework)}
              className="w-full border-2 border-primary-500 text-primary-500 dark:text-primary-400 py-3 px-6 rounded-xl font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Quick CMMC Level {selectedLevel} Start</span>
            </button>
            
            {onShowTemplates && (
              <button
                onClick={() => onShowTemplates(selectedFramework)}
                className="w-full border-2 border-success-500 text-success-500 dark:text-success-400 py-3 px-6 rounded-xl font-medium hover:bg-success-50 dark:hover:bg-success-900/20 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Browse Templates</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Organization Information Modal */}
      {showOrganizationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="card-standard p-8 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">
              Military Contractor Information (Optional)
            </h3>
            
            <form onSubmit={handleOrganizationSubmit} className="space-y-4">
              <div>
                <label htmlFor="org-name" className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  Contractor Organization Name
                </label>
                <input
                  type="text"
                  id="org-name"
                  value={organizationInfo.name || ''}
                  onChange={(e) => setOrganizationInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="input-standard w-full px-4 py-2"
                  placeholder="Enter contractor organization name"
                />
              </div>
              
              <div>
                <label htmlFor="org-industry" className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  Industry
                </label>
                <select
                  id="org-industry"
                  value={organizationInfo.industry || ''}
                  onChange={(e) => setOrganizationInfo(prev => ({ ...prev, industry: e.target.value }))}
                  className="input-standard w-full px-4 py-2"
                >
                  <option value="">Select military industry</option>
                  <option value="Aerospace & Military">Aerospace & Military</option>
                  <option value="Military Manufacturing">Military Manufacturing</option>
                  <option value="Military Technology">Military Technology</option>
                  <option value="Military Services">Military Services</option>
                  <option value="Military Logistics">Military Logistics</option>
                  <option value="Military Research">Military Research & Development</option>
                  <option value="System Integration">System Integration</option>
                  <option value="Other Military">Other Military Industry</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="org-size" className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  Organization Size
                </label>
                <select
                  id="org-size"
                  value={organizationInfo.size || ''}
                  onChange={(e) => setOrganizationInfo(prev => ({ ...prev, size: e.target.value }))}
                  className="input-standard w-full px-4 py-2"
                >
                  <option value="">Select size</option>
                  <option value="Small (1-50 employees)">Small (1-50 employees)</option>
                  <option value="Medium (51-500 employees)">Medium (51-500 employees)</option>
                  <option value="Large (501-5000 employees)">Large (501-5000 employees)</option>
                  <option value="Large Enterprise (5000+ employees)">Large Enterprise (5000+ employees)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="org-assessor" className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  CMMC Assessor/Lead Name
                </label>
                <input
                  type="text"
                  id="org-assessor"
                  value={organizationInfo.assessor || ''}
                  onChange={(e) => setOrganizationInfo(prev => ({ ...prev, assessor: e.target.value }))}
                  className="input-standard w-full px-4 py-2"
                  placeholder="Assessment lead or CMMC coordinator name"
                />
              </div>
              
              <div className="flex space-x-4 mt-8">
                <button
                  type="button"
                  onClick={() => setShowOrganizationForm(false)}
                  className="btn-secondary flex-1 px-6 py-3 rounded-xl transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 px-6 py-3 rounded-xl transition font-medium"
                >
                  Start CMMC Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentIntroScreen;