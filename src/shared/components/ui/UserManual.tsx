import React, { useState } from 'react';
import { 
  ChevronLeft, BookOpen, Play, Target, BarChart3, FileText, 
  ChevronDown, ChevronRight, Shield, Users, Settings, HelpCircle,
  Download, Upload, Eye, Edit3, Trash2, Filter, Search
} from 'lucide-react';
import { Breadcrumbs } from '../layout/Breadcrumbs';
import { useInternalLinking } from '../../hooks/useInternalLinking';

interface UserManualProps {
  onBack: () => void;
  onNavigate?: (path: string) => void;
  onShowTemplates?: () => void;
}

export const UserManual: React.FC<UserManualProps> = ({ onBack, onNavigate, onShowTemplates }) => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const { breadcrumbs } = useInternalLinking();

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Play,
      content: [
        {

          title: 'Welcome to the CMMC 2.0 Level 2 Compliance Platform',
          content: `This comprehensive platform helps Government contractors achieve CMMC 2.0 Level 2 certification by identifying gaps, implementing required controls, and preparing for C3PAO assessment. Whether you're a CISO, compliance officer, or implementation team member, this tool provides everything needed for CMMC compliance.`
        },
        {
          title: 'System Requirements',
          content: `
            • Modern web browser (Chrome, Firefox, Safari, Edge)
            • Internet connection for initial setup and documentation downloads
            • JavaScript enabled
            • Minimum screen resolution: 1024x768
            • Local storage enabled for CUI-compliant data persistence
          `
        },
        {
          title: 'First Time Setup',
          content: `
            1. **Create Your Profile**: Set up your profile with Military contractor organization details
            2. **Define CUI Scope**: Identify systems and data that process, store, or transmit CUI
            3. **Review CMMC Templates**: Utilize SSP and policy templates for faster implementation
            4. **Start CMMC Assessment**: Begin evaluating Level 2 controls with built-in guidance
          `
        }
      ]
    },
    {
      id: 'frameworks',
      title: 'Supported Frameworks',
      icon: Shield,
      content: [
        {
          title: 'CMMC 2.0 Level 2 (Cybersecurity Maturity Model Certification)',
          content: `
            **Overview**: Military cybersecurity standard for contractors handling Controlled Unclassified Information (CUI).
            
            **Best For**: Government contractors and suppliers in the government supply chain
            **Estimated Time**: 240 minutes
            **Domains**: 14 security domains with 110 controls
            
            **Key Features**:
            • CUI protection requirements
            • NIST SP 800-171 compliance foundation
            • Third-party assessment ready
            • C3PAO assessment preparation
            • Military supply chain focus
          `
        }
      ]
    },
    {
      id: 'assessment-process',
      title: 'Assessment Process',
      icon: Target,
      content: [
        {
          title: 'Starting a CMMC Assessment',
          content: `
            **Step 1: CUI Scope Definition**
            Define the scope of your CMMC assessment:
            • Identify all systems that process, store, or transmit CUI
            • Document CUI data flows and system boundaries
            • Assess current security controls and gaps
            
            **Step 2: Team Assignment (Team Mode)**
            Assign domain experts to specific CMMC domains:
            • Map organizational roles to CMMC domain responsibilities
            • Establish segregation of duties for control implementation
            • Define review and approval workflows
            
            **Step 3: Assessment Execution**
            Complete the comprehensive CMMC 2.0 Level 2 evaluation:
            • Answer questions for all 110 required controls
            • Document current implementation status
            • Identify gaps and implementation requirements
          `
        },
        {
          title: 'Answering Questions',
          content: `
            **Question Types**:
            • **Control Implementation**: Assess current state of CMMC controls
            • **Maturity Questions**: Evaluate process maturity for Level 2 requirements
            • **CUI Questions**: Specific questions about CUI protection measures
            
            **Response Options**:
            • **Not Implemented** (0 points): Control not in place
            • **Partially Implemented** (1 point): Basic implementation, gaps exist
            • **Largely Implemented** (2 points): Good implementation, minor gaps
            • **Fully Implemented** (3 points): Complete CMMC 2.0 Level 2 implementation
            
            **Using Guidance**:
            • Click "Show Guidance" for detailed explanations
            • Review CMMC control examples and implementation guidance
            • Reference NIST SP 800-171 requirements and best practices
          `
        },
        {
          title: 'Navigation and Progress',
          content: `
            **Navigation Features**:
            • **Quick Navigation**: Jump between sections and categories
            • **Progress Tracking**: Monitor completion percentage
            • **Auto-save**: Automatic progress saving every 5 seconds
            • **Manual Save**: Save progress at any time
            
            **Progress Indicators**:
            • Overall completion percentage
            • Section-level progress
            • Question completion status
            • Time estimates for remaining work
          `
        }
      ]
    },
    {
      id: 'dashboard',
      title: 'Dashboard Features',
      icon: BarChart3,
      content: [
        {
          title: 'Assessment Management',
          content: `
            **Saved CMMC Assessments**:
            • View all saved assessments
            • Filter by status, domain, or completion date
            • Search by organization or assessor name
            • Sort by completion, score, or modification date
            
            **Assessment Actions**:
            • **Continue**: Resume incomplete assessments
            • **View Report**: Generate CMMC compliance reports and gap analysis
            • **Generate SSP**: Create System Security Plan documentation
            • **Export POAM**: Generate Plan of Actions and Milestones
            • **Delete**: Remove assessments (with confirmation)
            
            **Quick Statistics**:
            • Total number of assessments
            • Completed vs. in-progress counts
            • Average maturity scores
            • Recent activity summary
          `
        },
        {
          title: 'Templates and Comparison',
          content: `
            **Template Library**:
            • Browse Military contractor-specific templates
            • Filter by organization size and contract type
            • Preview template details and pre-filled responses
            • Start CMMC assessments from contractor templates
            
            **Progress Tracking**:
            • Compare multiple assessments side-by-side
            • Track CMMC implementation progress over time
            • Monitor control maturation and certification readiness
            • Generate C3PAO preparation reports
          `
        }
      ]
    },
    {
      id: 'reports',
      title: 'Reports and Analytics',
      icon: FileText,
      content: [
        {
          title: 'Report Generation',
          content: `
            **Report Types**:
            • **CMMC Gap Analysis**: Detailed analysis of control implementation gaps
            • **SSP Generation**: Automated System Security Plan creation
            • **POAM Report**: Plan of Actions and Milestones for remediation
            • **C3PAO Readiness**: Assessment preparation for third-party evaluation
            • **Executive Summary**: High-level CMMC compliance status for leadership
            
            **Report Sections**:
            • **Executive Summary**: CMMC compliance status and certification readiness
            • **Domain Analysis**: Control implementation status by CMMC domain
            • **Gap Analysis**: Missing controls and implementation requirements
            • **Implementation Plan**: Prioritized remediation roadmap with timelines
            • **Evidence Requirements**: Documentation needed for C3PAO assessment
            • **CUI Scope**: Controlled Unclassified Information protection status
            • **Audit Trail**: Complete documentation trail for certification
          `
        },
        {
          title: 'Export Options',
          content: `
            **Export Formats**:
            • **PDF**: Professional CMMC reports for stakeholders and C3PAO assessors
            • **JSON**: Raw data for integration with other tools
            • **Word**: Editable SSP and policy documents
            • **Excel**: POAM and control tracking spreadsheets
            
            **Export Features**:
            • Military contractor branding options
            • Selective section inclusion
            • C3PAO assessment formatting
            • Automated SSP and POAM generation
          `
        },
        {
          title: 'Analytics and Insights',
          content: `
            **Maturity Scoring**:
            • Overall CMMC readiness percentage
            • Domain-level implementation status
            • Control maturity analysis by domain
            • Certification readiness trending over time
            
            **C3PAO Preparation**:
            • Priority-ranked control implementation gaps
            • CUI risk-based recommendations
            • Implementation resource allocation guidance
            • C3PAO assessment timeline recommendations
          `
        }
      ]
    },
    {
      id: 'user-management',
      title: 'User Management',
      icon: Users,
      content: [
        {
          title: 'User Profiles',
          content: `
            **Profile Information**:
            • Personal details (name, email, role)
            • Military contractor organization information
            • CMMC-related certifications (CCP, CCA, etc.)
            • Security clearance level (if applicable)
            • Contact preferences
            
            **Profile Benefits**:
            • Personalized CMMC dashboard experience
            • Role-based control assignment recommendations
            • Military contractor-specific guidance and best practices
            • Progress tracking across CMMC implementation phases
            • Team collaboration features for multi-user organizations
          `
        },
        {
          title: 'Preferences and Settings',
          content: `
            **Assessment Preferences**:
            • Default CMMC domain assignment (for team users)
            • Auto-save frequency
            • C3PAO preparation notifications
            • SSP and POAM report format preferences
            • Team collaboration preferences
            
            **Display Settings**:
            • Theme selection (light/dark)
            • CMMC domain organization preferences
            • Dashboard layout customization
            • Accessibility options
          `
        }
      ]
    },
    {
      id: 'data-management',
      title: 'Data Management',
      icon: Settings,
      content: [
        {
          title: 'Data Storage and Security',
          content: `
            **Local Storage**:
            • All CMMC assessment data stored locally for CUI protection
            • No data transmitted to external servers
            • Complete data control for Military contractor requirements
            • Offline capability for secure CMMC assessments
            • CUI-appropriate data handling and protection
            
            **Data Security**:
            • Client-side encryption for CUI protection
            • Secure data handling per CMMC requirements
            • No third-party data sharing or transmission
            • CMMC and NIST SP 800-171 compliant design
            • Audit logging for C3PAO assessment requirements
          `
        },
        {
          title: 'Import and Export',
          content: `
            **Data Export**:
            • Export all CMMC assessment and implementation data
            • Backup for disaster recovery
            • Migration to other CMMC compliance tools
            • C3PAO assessment documentation packages
            • SSP and POAM document generation
            
            **Data Import**:
            • Import previous CMMC assessments
            • Restore from backups
            • Migrate from other CMMC compliance tools
            • Bulk evidence and documentation import
          `
        },
        {
          title: 'Data Retention',
          content: `
            **Retention Policies**:
            • Configurable retention periods
            • CMMC-compliant data retention schedules
            • Automatic cleanup with audit trail preservation
            • Manual data management
            • Military contractor compliance with retention requirements
            
            **Data Cleanup**:
            • Archive completed CMMC assessments
            • Clear temporary data
            • Reset for new certification cycles
            • Secure data deletion per CMMC requirements
          `
        }
      ]
    }
  ];

  const faqs = [
    {
      question: 'How long does a CMMC 2.0 Level 2 assessment take?',
      answer: 'A complete CMMC 2.0 Level 2 assessment typically takes 240 minutes (4 hours), covering all 110 controls across 14 domains. Using contractor-specific templates can reduce time by 30-40%.'
    },
    {
      question: 'Can I save my progress and continue later?',
      answer: 'Yes, the platform automatically saves your CMMC assessment progress every 5 seconds with CUI-appropriate security. You can resume your assessment at any time.'
    },
    {
      question: 'How are CMMC readiness scores calculated?',
      answer: 'Scores are calculated based on control implementation: Not Implemented (0%), Partially (25%), Largely (50%), Fully Implemented (75%). Domain scores are weighted by control criticality for CUI protection.'
    },
    {
      question: 'Can I track CMMC implementation progress over time?',
      answer: 'Yes, the platform tracks your CMMC implementation progress over multiple assessments, showing control maturation and certification readiness improvements toward C3PAO evaluation.'
    },
    {
      question: 'What CMMC documentation can I generate?',
      answer: 'You can generate SSP documents, POAM spreadsheets, gap analysis reports, C3PAO preparation packages, and complete audit documentation in PDF, Word, and Excel formats.'
    },
    {
      question: 'Is my CMMC data secure and compliant?',
      answer: 'Yes, all CMMC assessment data is stored locally with CUI-appropriate protections. No information is transmitted to external servers, ensuring Military contractor compliance requirements.'
    },
    {
      question: 'Can I customize the CMMC controls for my organization?',

      answer: 'While CMMC 2.0 Level 2 controls are standardized, you can use Military contractor templates with pre-filled responses and customize implementation approaches for your specific environment.'
    },
    {
      question: 'What if I need help with CMMC implementation?',
      answer: 'The platform includes comprehensive implementation guidance, SSP templates, policy templates, and C3PAO preparation materials. For additional support, consult with a qualified CMMC consultant or C3PAO.'
    }
  ];

  const shortcuts = [
    { key: 'Ctrl + S', action: 'Save progress' },
    { key: 'Ctrl + N', action: 'Start new assessment' },
    { key: 'Ctrl + R', action: 'Generate report' },
    { key: 'Ctrl + F', action: 'Search assessments' },
    { key: 'Ctrl + E', action: 'Export data' },
    { key: 'Ctrl + H', action: 'Show/hide help' }
  ];

  const currentSection = sections.find(s => s.id === activeSection);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <div className="flex items-center space-x-3">
                <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  User Manual
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 sticky top-24">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Table of Contents
              </h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors flex items-center space-x-3 ${
                      activeSection === section.id
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <section.icon className="w-5 h-5" />
                    <span className="font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Current Section Content */}
          {currentSection && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <currentSection.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {currentSection.title}
                </h2>
              </div>
              
              <div className="space-y-8">
                {currentSection.content.map((item, index) => (
                  <div key={index}>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      {item.title}
                    </h3>
                    <div className="prose prose-gray dark:prose-invert max-w-none">
                      <div className="whitespace-pre-line text-gray-600 dark:text-gray-300 leading-relaxed">
                        {item.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Reference Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Keyboard Shortcuts */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Settings className="w-6 h-6 mr-3 text-blue-600 dark:text-blue-400" />
                Keyboard Shortcuts
              </h3>
              <div className="space-y-3">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">{shortcut.action}</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-sm font-mono">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Target className="w-6 h-6 mr-3 text-green-600 dark:text-green-400" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button 
                  onClick={() => onNavigate?.('/assessment-intro')}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3"
                >
                  <Play className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-700 dark:text-gray-300">Start New Assessment</span>
                </button>
                <button 
                  onClick={() => onShowTemplates?.()}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3"
                >
                  <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-gray-700 dark:text-gray-300">View Templates</span>
                </button>
                <button 
                  onClick={() => onNavigate?.('/reports')}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3"
                >
                  <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-gray-700 dark:text-gray-300">Compare Assessments</span>
                </button>
                <button 
                  onClick={() => onNavigate?.('/reports')}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3"
                >
                  <Download className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  <span className="text-gray-700 dark:text-gray-300">Export Data</span>
                </button>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <HelpCircle className="w-8 h-8 mr-3 text-blue-600 dark:text-blue-400" />
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <span className="font-medium text-gray-900 dark:text-white">
                      {faq.question}
                    </span>
                    {expandedFaq === index ? (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  
                  {expandedFaq === index && (
                    <div className="px-4 pb-4">
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Support Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Need Additional Help?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Our support team is here to help you get the most out of your cybersecurity assessment experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium" disabled>
                Contact your administrator for support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManual;