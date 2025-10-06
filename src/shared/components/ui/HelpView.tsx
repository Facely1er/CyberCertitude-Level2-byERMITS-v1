import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Search, BookOpen, MessageCircle, Mail, 
  Phone, ExternalLink, ChevronDown, ChevronRight, FileText,
  Play, Target, Users, Settings
} from 'lucide-react';
import { Breadcrumbs } from '../layout/Breadcrumbs';
import { useInternalLinking } from '../../hooks/useInternalLinking';
import { UserManual } from './UserManual';
import { InteractiveUserManual } from '../../../components/InteractiveUserManual';
import { OnboardingFlow } from '../../../components/OnboardingFlow';

interface HelpViewProps {
  onBack: () => void;
  addNotification?: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
  onShowTemplates?: () => void;
}

const HelpView: React.FC<HelpViewProps> = ({ onBack, addNotification, onShowTemplates }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showUserManual, setShowUserManual] = useState(false);
  const [showInteractiveManual, setShowInteractiveManual] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { breadcrumbs } = useInternalLinking();
  const navigate = useNavigate();

  if (showUserManual) {
    return <UserManual onBack={() => setShowUserManual(false)} onNavigate={navigate} onShowTemplates={onShowTemplates} />;
  }

  if (showInteractiveManual) {
    return <InteractiveUserManual onBack={() => setShowInteractiveManual(false)} onNavigate={navigate} onShowTemplates={onShowTemplates} />;
  }

  if (showOnboarding) {
    return <OnboardingFlow onComplete={() => setShowOnboarding(false)} onSkip={() => setShowOnboarding(false)} />;
  }

  const faqs = [
    {
      question: 'How do I start a CMMC 2.0 Level 2 assessment?',
      answer: 'Click on "Start CMMC Assessment" from the dashboard to begin evaluating your organization\'s CUI protection controls across all 14 CMMC domains. Your progress is automatically saved.'
    },
    {
      question: 'What CMMC level does this platform support?',
      answer: 'This platform is specifically designed for CMMC 2.0 Level 2 certification, covering all 110 required controls across 14 domains for protecting Controlled Unclassified Information (CUI).'
    },
    {
      question: 'How is my CMMC readiness score calculated?',
      answer: 'Scores are calculated based on your control implementation responses across all 14 CMMC domains. Each control is evaluated for implementation and maturity, with scores indicating C3PAO assessment readiness.'
    },
    {
      question: 'Can I save and resume my CMMC assessment?',
      answer: 'Yes, your CMMC assessment progress is automatically saved as you evaluate controls. You can return to continue your assessment at any time from the dashboard.'
    },
    {
      question: 'How do I generate CMMC compliance reports?',
      answer: 'Once you\'ve completed your CMMC assessment, click "Generate Report" to view detailed C3PAO-ready documentation. Reports include gap analysis, SSP sections, and POAM generation.'
    },
    {
      question: 'Is my CMMC data secure and compliant?',
      answer: 'Yes, all CMMC assessment data is stored locally in your browser with CUI-appropriate security measures. No data is transmitted to external servers, ensuring Military contractor compliance requirements.'
    },
    {
      question: 'Can I track CMMC implementation progress over time?',
      answer: 'Yes, the platform tracks your CMMC implementation progress over time, showing control maturation and certification readiness improvements.'
    },
    {
      question: 'What CMMC templates are available?',
      answer: 'The platform includes SSP templates, policy templates for all 14 CMMC domains, POAM templates, and C3PAO assessment preparation templates.'
    }
  ];

  const guides = [
    {
      title: 'Getting Started Guide',
      description: 'Learn the basics of using the Maturity Assessment Tool',
      icon: Play,
      topics: ['Creating your first assessment', 'Understanding the interface', 'Navigating questions'],
      action: () => setShowUserManual(true)
    },
    {
      title: 'Framework Selection Guide',
      description: 'Choose the right cybersecurity framework for your organization',
      icon: Target,
      topics: ['NIST CSF overview', 'ISO 27001 benefits', 'CMMC requirements'],
      action: () => setShowUserManual(true)
    },
    {
      title: 'Report Interpretation',
      description: 'Understand your assessment results and recommendations',
      icon: FileText,
      topics: ['Reading maturity scores', 'Gap analysis', 'Action planning'],
      action: () => setShowUserManual(true)
    },
    {
      title: 'Best Practices',
      description: 'Tips for conducting effective cybersecurity assessments',
      icon: Users,
      topics: ['Preparation checklist', 'Stakeholder involvement', 'Follow-up actions'],
      action: () => setShowUserManual(true)
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <span>Back to Dashboard</span>
              </button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Help & Support
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowOnboarding(true)}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>Get Started</span>
              </button>
              <button
                onClick={() => setShowInteractiveManual(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Interactive Manual</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Search */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search help articles and FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Quick Start Guides */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-blue-600 dark:text-blue-400" />
              Quick Start Guides
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guides.map((guide, index) => (
                <button
                  key={index}
                  onClick={guide.action}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                      <guide.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {guide.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {guide.description}
                  </p>
                  <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    {guide.topics.map((topic, topicIndex) => (
                      <li key={topicIndex} className="flex items-center">
                        <div className="w-1 h-1 bg-blue-500 rounded-full mr-2" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
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
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Support */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Contact Support
            </h3>
            
            <div className="space-y-4">
              <button
                onClick={() => window.open('mailto:support@ermits.com?subject=CMMC Platform Support&body=Please describe your issue:', '_blank')}
                className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full text-left"
              >
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Email Support</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">support@ermits.com</div>
                </div>
              </button>
              
              <button
                onClick={() => window.open('tel:+1-555-0123', '_blank')}
                className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full text-left"
              >
                <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Phone Support</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">+1 (555) 012-3456</div>
                </div>
              </button>
              
              <button
                onClick={() => addNotification?.('info', 'Live chat feature coming soon! Please use email support for immediate assistance.')}
                className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full text-left"
              >
                <MessageCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Live Chat</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Coming soon</div>
                </div>
              </button>
            </div>
          </div>

          {/* Resources */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Additional Resources
            </h3>
            
            <div className="space-y-3">
              <button
                onClick={() => setShowOnboarding(true)}
                className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Play className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400">
                    Interactive Onboarding
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400" />
              </button>
              <button
                onClick={() => setShowInteractiveManual(true)}
                className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    Interactive User Manual
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </button>
              <button
                onClick={() => setShowUserManual(true)}
                className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-600 dark:group-hover:text-gray-400">
                    Complete User Manual
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-400" />
              </button>
              
              <button
                onClick={() => addNotification?.('info', 'Video tutorials are coming soon! Check back for comprehensive training videos.')}
                className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
              >
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Video Tutorials
                </span>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </button>
              
              <button
                onClick={() => window.open('https://www.cmmcab.org/frameworks', '_blank')}
                className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
              >
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Framework Documentation
                </span>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </button>
              
              <button
                onClick={() => window.open('https://www.nist.gov/cyberframework', '_blank')}
                className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
              >
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Best Practices Guide
                </span>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </button>
              
              <button
                onClick={() => addNotification?.('info', 'API documentation is available for enterprise customers. Contact support for access.')}
                className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
              >
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  API Documentation
                </span>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              System Status
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Application</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-green-600 dark:text-green-400">Operational</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Data Storage</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-green-600 dark:text-green-400">Operational</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Report Generation</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-green-600 dark:text-green-400">Operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpView;