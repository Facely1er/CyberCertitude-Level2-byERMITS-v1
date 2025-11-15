import React, { useState } from 'react';
import { 
  HelpCircle, 
  X, 
  Search, 
  BookOpen, 
  Play, 
  Users, 
  Shield, 
  Target,
  ChevronRight,
  Lightbulb,
  Zap,
  ArrowRight
} from 'lucide-react';

interface ContextualHelpProps {
  currentPage: string;
  userRole?: 'ciso' | 'compliance-officer' | 'domain-expert' | 'implementation-team' | 'auditor';
  onNavigate?: (path: string) => void;
  className?: string;
}

export const ContextualHelp: React.FC<ContextualHelpProps> = ({
  currentPage,
  userRole = 'compliance-officer',
  onNavigate,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const getPageGuidance = (page: string) => {
    const guidance: { [key: string]: any } = {
      '/dashboard': {
        title: 'Dashboard Overview',
        description: 'Your central hub for CMMC compliance management',
        quickActions: [
          { label: 'Start Assessment', path: '/assessment-intro', icon: Play },
          { label: 'View Compliance Status', path: '/compliance', icon: Shield },
          { label: 'Manage Evidence', path: '/evidence', icon: BookOpen },
          { label: 'Team Collaboration', path: '/team', icon: Users }
        ],
        tips: [
          'Check your compliance status regularly',
          'Start with a gap analysis to identify priorities',
          'Use the workflow guidance for step-by-step help',
          'Set up team roles early in the process'
        ]
      },
      '/assessment-intro': {
        title: 'Assessment Introduction',
        description: 'Begin your CMMC 2.0 Level 2 assessment',
        quickActions: [
          { label: 'Start Guided Assessment', path: '/assessment/new', icon: Play },
          { label: 'View Templates', path: '/templates', icon: BookOpen },
          { label: 'Review Previous Assessments', path: '/dashboard', icon: Target }
        ],
        tips: [
          'Choose the guided mode for first-time users',
          'Review assessment templates before starting',
          'Ensure all team members understand their roles',
          'Save your progress regularly'
        ]
      },
      '/compliance': {
        title: 'Compliance Status',
        description: 'Monitor your real-time compliance progress',
        quickActions: [
          { label: 'View Gap Analysis', path: '/gap-analysis', icon: Target },
          { label: 'Manage Evidence', path: '/evidence', icon: BookOpen },
          { label: 'Update Controls', path: '/controls', icon: Shield }
        ],
        tips: [
          'Address high-risk gaps first',
          'Document all evidence thoroughly',
          'Regularly update compliance status',
          'Use the POA&M manager for tracking'
        ]
      },
      '/evidence': {
        title: 'Evidence Collection',
        description: 'Collect and organize compliance evidence',
        quickActions: [
          { label: 'Upload Evidence', path: '/evidence/upload', icon: BookOpen },
          { label: 'Review Evidence', path: '/evidence/review', icon: Shield },
          { label: 'Generate Reports', path: '/reports', icon: Target }
        ],
        tips: [
          'Use consistent naming conventions',
          'Maintain version control for documents',
          'Validate evidence against control requirements',
          'Regularly review evidence completeness'
        ]
      },
      '/team': {
        title: 'Team Collaboration',
        description: 'Coordinate team activities and responsibilities',
        quickActions: [
          { label: 'Assign Roles', path: '/team-roles', icon: Users },
          { label: 'Manage Tasks', path: '/tasks', icon: Target },
          { label: 'Schedule Meetings', path: '/calendar', icon: Play }
        ],
        tips: [
          'Define clear RACI matrices',
          'Set up regular check-in meetings',
          'Use task management for accountability',
          'Ensure all team members are trained'
        ]
      }
    };

    return guidance[page] || {
      title: 'Page Help',
      description: 'Get help with this page',
      quickActions: [],
      tips: ['Use the navigation menu to explore features', 'Check the user manual for detailed guidance']
    };
  };

  const pageGuidance = getPageGuidance(currentPage);

  const roleBasedTips = {
    'ciso': [
      'Focus on strategic oversight and resource allocation',
      'Monitor executive dashboards for progress',
      'Ensure stakeholder buy-in and support',
      'Coordinate with external assessors'
    ],
    'compliance-officer': [
      'Lead assessment and gap analysis processes',
      'Coordinate evidence collection efforts',
      'Manage POA&M and implementation tracking',
      'Prepare for external assessments'
    ],
    'domain-expert': [
      'Provide technical expertise for implementations',
      'Validate technical controls and configurations',
      'Support evidence collection for technical domains',
      'Participate in validation activities'
    ],
    'implementation-team': [
      'Execute control implementation tasks',
      'Collect evidence and maintain documentation',
      'Participate in testing and validation',
      'Support ongoing compliance monitoring'
    ],
    'auditor': [
      'Review assessment results and gap analysis',
      'Validate evidence completeness and quality',
      'Conduct internal audits and testing',
      'Prepare for external assessment'
    ]
  };

  const filteredTips = pageGuidance.tips.filter(tip =>
    tip.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRoleTips = roleBasedTips[userRole]?.filter(tip =>
    tip.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <>
      {/* Help Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg transition-colors ${className}`}
        aria-label="Open help"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      {/* Help Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-support-light bg-opacity-75 transition-opacity"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <div className="inline-block align-bottom bg-surface-light dark:bg-surface-dark rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              {/* Header */}
              <div className="bg-surface-light dark:bg-surface-dark px-6 py-4 border-b border-support-light dark:border-support-dark">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                      <HelpCircle className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                        {pageGuidance.title}
                      </h3>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        {pageGuidance.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-text-muted-dark hover:text-text-secondary-light dark:hover:text-text-secondary-dark"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-4">
                {/* Search */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted-dark w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search help content..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Quick Actions */}
                  <div>
                    <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-3 flex items-center space-x-2">
                      <Zap className="w-5 h-5 text-primary-500" />
                      <span>Quick Actions</span>
                    </h4>
                    <div className="space-y-2">
                      {pageGuidance.quickActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            if (onNavigate) {
                              onNavigate(action.path);
                              setIsOpen(false);
                            }
                          }}
                          className="w-full flex items-center space-x-3 p-3 bg-background-light dark:bg-surface-dark rounded-lg hover:bg-support-light dark:hover:bg-primary-600 transition-colors text-left"
                        >
                          <action.icon className="w-5 h-5 text-primary-500" />
                          <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                            {action.label}
                          </span>
                          <ChevronRight className="w-4 h-4 text-text-muted-dark ml-auto" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Page-Specific Tips */}
                  <div>
                    <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-3 flex items-center space-x-2">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      <span>Page Tips</span>
                    </h4>
                    <div className="space-y-2">
                      {filteredTips.map((tip, index) => (
                        <div key={index} className="flex items-start space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-text-primary-light dark:text-text-secondary-dark">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Role-Based Tips */}
                <div className="mt-6">
                  <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-3 flex items-center space-x-2">
                    <Users className="w-5 h-5 text-success-500" />
                    <span>Role-Based Recommendations ({userRole.replace('-', ' ')})</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {filteredRoleTips.map((tip, index) => (
                      <div key={index} className="flex items-start space-x-2 p-3 bg-success-50 dark:bg-success-900/20 rounded-lg">
                        <div className="w-1.5 h-1.5 bg-success-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-text-primary-light dark:text-text-secondary-dark">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-background-light dark:bg-surface-dark/50 px-6 py-4 border-t border-support-light dark:border-support-dark">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-text-muted-light" />
                    <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Need more help?</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        if (onNavigate) {
                          onNavigate('/help');
                          setIsOpen(false);
                        }
                      }}
                      className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      Help Center
                    </button>
                    <span className="text-text-secondary-dark dark:text-text-secondary-light">|</span>
                    <button
                      onClick={() => {
                        if (onNavigate) {
                          onNavigate('/workflow-guidance');
                          setIsOpen(false);
                        }
                      }}
                      className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      Workflow Guide
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
