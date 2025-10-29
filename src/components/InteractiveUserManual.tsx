import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, BookOpen, Play, Target, BarChart3, FileText, 
  ChevronDown, ChevronRight, Shield, Users, Settings, HelpCircle,
  Download, Upload, Eye, Edit3, Trash2, Filter, Search, 
  CheckCircle, AlertTriangle, Info, ExternalLink, Video,
  ArrowRight, Star, Clock, Zap, Lock, Database, Globe
} from 'lucide-react';
import { Breadcrumbs } from '../shared/components/layout/Breadcrumbs';
import { useInternalLinking } from '../shared/hooks/useInternalLinking';

interface InteractiveUserManualProps {
  onBack: () => void;
  onNavigate?: (path: string) => void;
  onShowTemplates?: () => void;
}

export const InteractiveUserManual: React.FC<InteractiveUserManualProps> = ({ onBack, onNavigate, onShowTemplates }) => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showVideoTutorials, setShowVideoTutorials] = useState(false);
  const { breadcrumbs } = useInternalLinking();

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Play,
      color: 'blue',
      content: [
        {
          title: 'Welcome to CyberCertitude™ CMMC Platform',

          content: `This comprehensive platform helps Government contractors achieve CMMC 2.0 Level 2 certification by identifying gaps, implementing required controls, and preparing for C3PAO assessment. Whether you're a CISO, compliance officer, or implementation team member, this tool provides everything needed for CMMC compliance.`,
          features: [
            'Complete CMMC 2.0 Level 2 assessment (110 controls)',
            'Automated SSP and POAM generation',
            'Real-time compliance monitoring',
            'Team collaboration with role-based access',
            'C3PAO preparation tools',
            'CUI protection compliance'
          ]
        },
        {
          title: 'Quick Start Guide',
          content: `Get up and running with CMMC compliance in 4 simple steps:`,
          steps: [
            {
              step: 1,
              title: 'Set Up Your Profile',
              description: 'Configure your organization details and CUI scope',
              icon: Users,
              action: 'Go to Profile Settings'
            },
            {
              step: 2,
              title: 'Start CMMC Assessment',
              description: 'Begin evaluating your current security posture',
              icon: Target,
              action: 'Start Assessment'
            },
            {
              step: 3,
              title: 'Review Gap Analysis',
              description: 'Identify missing controls and implementation needs',
              icon: BarChart3,
              action: 'View Gap Analysis'
            },
            {
              step: 4,
              title: 'Generate Documentation',
              description: 'Create SSP, POAM, and C3PAO preparation materials',
              icon: FileText,
              action: 'Generate Reports'
            }
          ]
        },
        {
          title: 'System Requirements',
          content: `Ensure your system meets the requirements for optimal CMMC compliance assessment:`,
          requirements: [
            { category: 'Browser', items: ['Chrome 90+', 'Firefox 88+', 'Safari 14+', 'Edge 90+'] },
            { category: 'Screen Resolution', items: ['Minimum: 1024x768', 'Recommended: 1920x1080'] },
            { category: 'Internet Connection', items: ['Required for initial setup', 'Offline mode available'] },
            { category: 'Storage', items: ['Local storage enabled', 'Minimum 100MB free space'] },
            { category: 'Security', items: ['JavaScript enabled', 'Cookies enabled', 'HTTPS support'] }
          ]
        }
      ]
    },
    {
      id: 'cmmc-overview',
      title: 'CMMC 2.0 Level 2 Overview',
      icon: Shield,
      color: 'green',
      content: [
        {

          title: 'What is CMMC 2.0 Level 2?',
          content: `The Cybersecurity Maturity Model Certification (CMMC) 2.0 Level 2 is a Military standard for contractors handling Controlled Unclassified Information (CUI). It requires implementation of 110 security controls across 14 domains based on NIST SP 800-171.`,
          domains: [
            { name: 'Access Control (AC)', controls: 7, description: 'User access management and authentication' },
            { name: 'Asset Management (AM)', controls: 4, description: 'Identification and management of organizational assets' },
            { name: 'Audit and Accountability (AU)', controls: 8, description: 'System auditing and logging capabilities' },
            { name: 'Awareness and Training (AT)', controls: 3, description: 'Security awareness and training programs' },
            { name: 'Configuration Management (CM)', controls: 6, description: 'System configuration and change control' },
            { name: 'Identification and Authentication (IA)', controls: 11, description: 'User identification and authentication' },
            { name: 'Incident Response (IR)', controls: 6, description: 'Incident detection, response, and recovery' },
            { name: 'Maintenance (MA)', controls: 3, description: 'System maintenance and updates' },
            { name: 'Media Protection (MP)', controls: 8, description: 'Protection of system media and information' },
            { name: 'Personnel Security (PS)', controls: 2, description: 'Personnel screening and access management' },
            { name: 'Physical Protection (PE)', controls: 6, description: 'Physical access and environmental controls' },
            { name: 'Recovery (RE)', controls: 3, description: 'System recovery and backup procedures' },
            { name: 'Risk Assessment (RA)', controls: 3, description: 'Risk identification and assessment processes' },
            { name: 'Security Assessment (CA)', controls: 4, description: 'Security control assessment and testing' },
            { name: 'System and Communications Protection (SC)', controls: 12, description: 'System and network protection' },
            { name: 'System and Information Integrity (SI)', controls: 7, description: 'Information and system integrity' },
            { name: 'Supply Chain Risk Management (SR)', controls: 3, description: 'Supply chain security management' }
          ]
        },
        {
          title: 'CUI Protection Requirements',
          content: `CMMC 2.0 Level 2 focuses on protecting Controlled Unclassified Information (CUI) through:`,
          cuiRequirements: [
            'Data encryption at rest and in transit',
            'Access controls and authentication',
            'Audit logging and monitoring',
            'Incident response procedures',
            'Personnel security measures',
            'Physical and environmental controls',
            'System and network protection',
            'Supply chain security management'
          ]
        },
        {
          title: 'C3PAO Assessment Process',
          content: `Third-party assessment by a C3PAO (CMMC Third-Party Assessment Organization) is required for CMMC 2.0 Level 2 certification:`,
          c3paoProcess: [
            'Pre-assessment preparation and documentation',
            'On-site assessment by certified C3PAO assessors',
            'Control implementation verification',
            'Evidence review and validation',
            'Assessment report and certification decision',
            'Annual surveillance assessments',
            'Triennial re-certification'
          ]
        }
      ]
    },
    {
      id: 'assessment-guide',
      title: 'Assessment Guide',
      icon: Target,
      color: 'purple',
      content: [
        {
          title: 'Starting Your CMMC Assessment',
          content: `Follow this step-by-step process to complete your CMMC 2.0 Level 2 assessment:`,
          assessmentSteps: [
            {
              phase: 'Preparation',
              steps: [
                'Define CUI scope and system boundaries',
                'Identify all systems processing CUI',
                'Gather existing security documentation',
                'Assemble assessment team with domain expertise'
              ]
            },
            {
              phase: 'Assessment',
              steps: [
                'Complete control implementation evaluation',
                'Document current security posture',
                'Identify gaps and implementation needs',
                'Collect supporting evidence'
              ]
            },
            {
              phase: 'Analysis',
              steps: [
                'Review assessment results',
                'Prioritize control implementation',
                'Develop remediation plan',
                'Generate gap analysis report'
              ]
            },
            {
              phase: 'Documentation',
              steps: [
                'Create System Security Plan (SSP)',
                'Generate Plan of Actions and Milestones (POAM)',
                'Prepare C3PAO assessment materials',
                'Document evidence collection'
              ]
            }
          ]
        },
        {
          title: 'Answering Assessment Questions',
          content: `Each CMMC control is evaluated using a 4-point maturity scale:`,
          maturityScale: [
            {
              level: 'Not Implemented (0)',
              description: 'Control not in place or not applicable',
              color: 'red',
              examples: ['No access controls', 'Missing policies', 'No monitoring']
            },
            {
              level: 'Partially Implemented (1)',
              description: 'Basic implementation with significant gaps',
              color: 'orange',
              examples: ['Some access controls', 'Draft policies', 'Basic monitoring']
            },
            {
              level: 'Largely Implemented (2)',
              description: 'Good implementation with minor gaps',
              color: 'yellow',
              examples: ['Most controls in place', 'Approved policies', 'Regular monitoring']
            },
            {
              level: 'Fully Implemented (3)',
              description: 'Complete CMMC 2.0 Level 2 implementation',
              color: 'green',
              examples: ['All controls implemented', 'Comprehensive policies', 'Continuous monitoring']
            }
          ]
        },
        {
          title: 'Evidence Collection',
          content: `Support your assessment responses with appropriate evidence:`,
          evidenceTypes: [
            {
              type: 'Documentation',
              examples: ['Policies and procedures', 'System configurations', 'Training records'],
              importance: 'High'
            },
            {
              type: 'Technical Evidence',
              examples: ['Screenshots of configurations', 'Log files', 'System reports'],
              importance: 'High'
            },
            {
              type: 'Process Evidence',
              examples: ['Workflow diagrams', 'Process maps', 'Procedure documentation'],
              importance: 'Medium'
            },
            {
              type: 'Training Evidence',
              examples: ['Training completion certificates', 'Awareness program records', 'Test results'],
              importance: 'Medium'
            }
          ]
        }
      ]
    },
    {
      id: 'dashboard-features',
      title: 'Dashboard Features',
      icon: BarChart3,
      color: 'indigo',
      content: [
        {
          title: 'Real-Time Compliance Monitoring',
          content: `Monitor your CMMC compliance status in real-time with comprehensive dashboards:`,
          features: [
            {
              name: 'Overall Compliance Score',
              description: 'Real-time percentage of CMMC controls implemented',
              icon: Target
            },
            {
              name: 'Domain Progress Tracking',
              description: 'Progress by CMMC domain with detailed breakdowns',
              icon: BarChart3
            },
            {
              name: 'Gap Analysis Dashboard',
              description: 'Visual identification of missing controls and priorities',
              icon: AlertTriangle
            },
            {
              name: 'Evidence Collection Status',
              description: 'Track evidence gathering progress for each control',
              icon: FileText
            },
            {
              name: 'Implementation Timeline',
              description: 'Timeline view of control implementation progress',
              icon: Clock
            },
            {
              name: 'C3PAO Readiness Score',
              description: 'Assessment of readiness for third-party evaluation',
              icon: Shield
            }
          ]
        },
        {
          title: 'Team Collaboration Features',
          content: `Work together with your team to achieve CMMC compliance:`,
          collaborationFeatures: [
            'Role-based access control for different team members',
            'RACI matrix for clear responsibility assignment',
            'Real-time collaboration on assessment responses',
            'Review and approval workflows',
            'Comment and discussion threads',
            'Progress notifications and alerts',
            'Team performance dashboards'
          ]
        },
        {
          title: 'Reporting and Analytics',
          content: `Generate comprehensive reports for stakeholders and C3PAO preparation:`,
          reportTypes: [
            {
              name: 'Executive Summary',
              description: 'High-level CMMC compliance status for leadership',
              format: 'PDF, PowerPoint'
            },
            {
              name: 'Gap Analysis Report',
              description: 'Detailed analysis of missing controls and implementation needs',
              format: 'PDF, Excel'
            },
            {
              name: 'System Security Plan (SSP)',
              description: 'Comprehensive SSP document for C3PAO assessment',
              format: 'Word, PDF'
            },
            {
              name: 'Plan of Actions and Milestones (POAM)',
              description: 'Detailed remediation plan with timelines and resources',
              format: 'Excel, PDF'
            },
            {
              name: 'C3PAO Preparation Package',
              description: 'Complete documentation package for third-party assessment',
              format: 'ZIP, PDF'
            }
          ]
        }
      ]
    },
    {
      id: 'documentation',
      title: 'Documentation & Templates',
      icon: FileText,
      color: 'orange',
      content: [
        {
          title: 'System Security Plan (SSP) Generation',
          content: `Automatically generate comprehensive SSP documents:`,
          sspFeatures: [
            'NIST SP 800-171 control mapping',
            'CUI scope and system boundaries',
            'Security control implementation details',
            'Risk assessment and mitigation strategies',
            'Incident response procedures',
            'Personnel security measures',
            'Physical and environmental controls',
            'System and network architecture',
            'Monitoring and logging procedures',
            'C3PAO assessment preparation'
          ]
        },
        {
          title: 'Policy Templates',
          content: `Access comprehensive policy templates for CMMC compliance:`,
          policyTemplates: [
            {
              name: 'Access Control Policy',
              description: 'User access management and authentication requirements',
              controls: ['AC-1', 'AC-2', 'AC-3', 'AC-4', 'AC-5', 'AC-6', 'AC-7']
            },
            {
              name: 'Incident Response Policy',
              description: 'Security incident detection and response procedures',
              controls: ['IR-1', 'IR-2', 'IR-3', 'IR-4', 'IR-5', 'IR-6']
            },
            {
              name: 'Personnel Security Policy',
              description: 'Background screening and access management',
              controls: ['PS-1', 'PS-2']
            },
            {
              name: 'Media Protection Policy',
              description: 'CUI media handling and sanitization procedures',
              controls: ['MP-1', 'MP-2', 'MP-3', 'MP-4', 'MP-5', 'MP-6', 'MP-7', 'MP-8']
            },
            {
              name: 'Configuration Management Policy',
              description: 'System configuration and change control procedures',
              controls: ['CM-1', 'CM-2', 'CM-3', 'CM-4', 'CM-5', 'CM-6']
            }
          ]
        },
        {
          title: 'Evidence Management',
          content: `Systematically collect and manage compliance evidence:`,
          evidenceManagement: [
            'Document upload and organization',
            'Evidence mapping to CMMC controls',
            'Version control and change tracking',
            'Evidence validation and review',
            'C3PAO assessment preparation',
            'Audit trail maintenance',
            'Secure storage and access control'
          ]
        }
      ]
    },
    {
      id: 'team-collaboration',
      title: 'Team Collaboration',
      icon: Users,
      color: 'teal',
      content: [
        {
          title: 'Role-Based Access Control',
          content: `Assign appropriate roles and permissions for team collaboration:`,
          roles: [
            {
              name: 'CISO/Compliance Officer',
              permissions: ['Full platform access', 'Assessment management', 'Report generation', 'Team management'],
              responsibilities: ['Overall CMMC compliance oversight', 'Strategic planning', 'C3PAO coordination']
            },
            {
              name: 'Domain Expert',
              permissions: ['Domain-specific assessments', 'Evidence collection', 'Control implementation'],
              responsibilities: ['Technical control implementation', 'Evidence gathering', 'Domain expertise']
            },
            {
              name: 'Implementation Team Member',
              permissions: ['Control implementation', 'Evidence collection', 'Progress tracking'],
              responsibilities: ['Control implementation', 'Documentation', 'Progress updates']
            },
            {
              name: 'Auditor/Reviewer',
              permissions: ['Assessment review', 'Evidence validation', 'Report review'],
              responsibilities: ['Quality assurance', 'Evidence validation', 'Compliance verification']
            }
          ]
        },
        {
          title: 'RACI Matrix',
          content: `Clear responsibility assignment for CMMC control implementation:`,
          raciMatrix: [
            { control: 'Access Control (AC)', responsible: 'IT Security Team', accountable: 'CISO', consulted: 'HR', informed: 'All Users' },
            { control: 'Asset Management (AM)', responsible: 'IT Operations', accountable: 'CISO', consulted: 'Procurement', informed: 'Management' },
            { control: 'Audit and Accountability (AU)', responsible: 'IT Security', accountable: 'CISO', consulted: 'Compliance', informed: 'Management' },
            { control: 'Incident Response (IR)', responsible: 'Security Team', accountable: 'CISO', consulted: 'Legal', informed: 'All Staff' },
            { control: 'Personnel Security (PS)', responsible: 'HR', accountable: 'CISO', consulted: 'Legal', informed: 'Management' }
          ]
        },
        {
          title: 'Workflow Management',
          content: `Streamlined workflows for CMMC compliance activities:`,
          workflows: [
            {
              name: 'Assessment Workflow',
              steps: ['Assign domains to experts', 'Complete assessments', 'Review responses', 'Approve final assessment']
            },
            {
              name: 'Evidence Collection Workflow',
              steps: ['Identify evidence needs', 'Collect documentation', 'Validate evidence', 'Approve for C3PAO']
            },
            {
              name: 'Control Implementation Workflow',
              steps: ['Prioritize controls', 'Implement controls', 'Test implementation', 'Document completion']
            },
            {
              name: 'C3PAO Preparation Workflow',
              steps: ['Prepare documentation', 'Review completeness', 'Final validation', 'Submit for assessment']
            }
          ]
        }
      ]
    },
    {
      id: 'security-compliance',
      title: 'Security & Compliance',
      icon: Lock,
      color: 'red',
      content: [
        {
          title: 'CUI Protection',
          content: `Comprehensive protection for Controlled Unclassified Information:`,
          cuiProtection: [
            'Data encryption at rest and in transit',
            'Access controls and authentication',
            'Audit logging and monitoring',
            'Secure data handling procedures',
            'Media protection and sanitization',
            'Personnel security measures',
            'Physical and environmental controls',
            'Incident response procedures'
          ]
        },
        {
          title: 'Data Security',
          content: `Enterprise-grade security for your CMMC compliance data:`,
          dataSecurity: [
            'Local storage with encryption',
            'No external data transmission',
            'Secure authentication and authorization',
            'Audit logging and monitoring',
            'Data backup and recovery',
            'Access control and permissions',
            'Secure data deletion',
            'Compliance with CMMC requirements'
          ]
        },
        {
          title: 'Compliance Monitoring',
          content: `Continuous monitoring of CMMC compliance status:`,
          monitoringFeatures: [
            'Real-time compliance scoring',
            'Control implementation tracking',
            'Gap analysis and alerts',
            'Progress monitoring and reporting',
            'C3PAO readiness assessment',
            'Audit trail maintenance',
            'Performance metrics and KPIs',
            'Automated compliance reporting'
          ]
        }
      ]
    }
  ];

  const faqs = [
    {
      question: 'How long does a complete CMMC 2.0 Level 2 assessment take?',
      answer: 'A comprehensive CMMC 2.0 Level 2 assessment typically takes 4-6 hours for a single assessor, covering all 110 controls across 14 domains. Team-based assessments can be completed faster with domain experts working in parallel.',
      category: 'Assessment'
    },
    {
      question: 'Can I save my progress and continue later?',
      answer: 'Yes, the platform automatically saves your assessment progress every 5 seconds. You can pause and resume your assessment at any time without losing your work.',
      category: 'Assessment'
    },
    {
      question: 'How are CMMC readiness scores calculated?',
      answer: 'Scores are calculated using a weighted maturity model: Not Implemented (0%), Partially Implemented (25%), Largely Implemented (50%), Fully Implemented (75%). Domain scores are weighted by control criticality for CUI protection.',
      category: 'Scoring'
    },
    {
      question: 'What documentation can I generate for C3PAO assessment?',
      answer: 'You can generate comprehensive SSP documents, POAM spreadsheets, gap analysis reports, evidence packages, and complete audit documentation in PDF, Word, and Excel formats.',
      category: 'Documentation'
    },
    {
      question: 'Is my CMMC data secure and compliant?',
      answer: 'Yes, all data is stored locally with CUI-appropriate protections. No information is transmitted to external servers, ensuring full compliance with Military contractor requirements.',
      category: 'Security'
    },
    {
      question: 'Can multiple team members work on the same assessment?',
      answer: 'Yes, the platform supports team collaboration with role-based access control, allowing domain experts to work on specific sections while maintaining data integrity and audit trails.',
      category: 'Collaboration'
    },
    {
      question: 'What if I need help with CMMC implementation?',
      answer: 'The platform includes comprehensive implementation guidance, policy templates, and C3PAO preparation materials. For additional support, consult with a qualified CMMC consultant or C3PAO.',
      category: 'Support'
    },
    {
      question: 'How do I prepare for C3PAO assessment?',
      answer: 'Use the C3PAO preparation tools to generate complete documentation packages, evidence collections, and readiness assessments. The platform provides step-by-step guidance for third-party assessment preparation.',
      category: 'C3PAO'
    }
  ];

  const videoTutorials = [
    {
      title: 'Getting Started with CMMC Assessment',
      duration: '5:30',
      description: 'Learn how to start your first CMMC 2.0 Level 2 assessment',
      thumbnail: '/api/placeholder/300/200'
    },
    {
      title: 'Understanding CMMC Controls and Scoring',
      duration: '8:15',
      description: 'Deep dive into CMMC control evaluation and maturity scoring',
      thumbnail: '/api/placeholder/300/200'
    },
    {
      title: 'Team Collaboration and Role Management',
      duration: '6:45',
      description: 'Set up team collaboration and assign roles for CMMC compliance',
      thumbnail: '/api/placeholder/300/200'
    },
    {
      title: 'Generating SSP and POAM Documents',
      duration: '7:20',
      description: 'Create comprehensive System Security Plans and remediation plans',
      thumbnail: '/api/placeholder/300/200'
    },
    {
      title: 'C3PAO Assessment Preparation',
      duration: '9:10',
      description: 'Prepare for third-party CMMC assessment with complete documentation',
      thumbnail: '/api/placeholder/300/200'
    }
  ];

  const shortcuts = [
    { key: 'Ctrl + S', action: 'Save progress', category: 'General' },
    { key: 'Ctrl + N', action: 'Start new assessment', category: 'Assessment' },
    { key: 'Ctrl + R', action: 'Generate report', category: 'Reports' },
    { key: 'Ctrl + F', action: 'Search assessments', category: 'Search' },
    { key: 'Ctrl + E', action: 'Export data', category: 'Export' },
    { key: 'Ctrl + H', action: 'Show/hide help', category: 'Help' },
    { key: 'Ctrl + T', action: 'Toggle theme', category: 'Display' },
    { key: 'Ctrl + D', action: 'Go to dashboard', category: 'Navigation' }
  ];

  const currentSection = sections.find(s => s.id === activeSection);
  const filteredFaqs = searchQuery 
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

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
                  Interactive User Manual
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowVideoTutorials(!showVideoTutorials)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Video className="w-4 h-4" />
                <span>Video Tutorials</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search the manual..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
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
                {sections.map((section) => {
                  // Define proper color classes based on section.color
                  const getActiveColors = (color: string) => {
                    switch(color) {
                      case 'blue': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
                      case 'green': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
                      case 'indigo': return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300';
                      case 'orange': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
                      case 'purple': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
                      default: return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
                    }
                  };

                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors flex items-center space-x-3 ${
                        activeSection === section.id
                          ? getActiveColors(section.color)
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <section.icon className="w-5 h-5" />
                      <span className="font-medium">{section.title}</span>
                    </button>
                  );
                })}
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
                {(() => {
                  const getIconColor = (color: string) => {
                    switch(color) {
                      case 'blue': return 'text-blue-600 dark:text-blue-400';
                      case 'green': return 'text-green-600 dark:text-green-400';
                      case 'indigo': return 'text-indigo-600 dark:text-indigo-400';
                      case 'orange': return 'text-orange-600 dark:text-orange-400';
                      case 'purple': return 'text-purple-600 dark:text-purple-400';
                      default: return 'text-blue-600 dark:text-blue-400';
                    }
                  };
                  const Icon = currentSection.icon;
                  return <Icon className={`w-8 h-8 ${getIconColor(currentSection.color)}`} />;
                })()}
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {currentSection.title}
                </h2>
              </div>
              
              <div className="space-y-8">
                {currentSection.content.map((item, index) => (
                  <div key={index} className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    
                    <div className="prose prose-gray dark:prose-invert max-w-none">
                      <div className="whitespace-pre-line text-gray-600 dark:text-gray-300 leading-relaxed">
                        {item.content}
                      </div>
                    </div>

                    {/* Features List */}
                    {item.features && (
                      <div className="grid md:grid-cols-2 gap-4">
                        {item.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Steps */}
                    {item.steps && (
                      <div className="space-y-4">
                        {item.steps.map((step, idx) => (
                          <div key={idx} className="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 dark:text-blue-400 font-semibold">{step.step}</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h4>
                              <p className="text-gray-600 dark:text-gray-300 mb-3">{step.description}</p>
                              <button 
                                onClick={() => {
                                  if (step.action === 'Go to Profile Settings') onNavigate?.('/profile');
                                  else if (step.action === 'Start Assessment') onNavigate?.('/assessment-intro');
                                  else if (step.action === 'View Gap Analysis') onNavigate?.('/reports');
                                  else if (step.action === 'Generate Reports') onNavigate?.('/reports');
                                }}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center space-x-1"
                              >
                                <span>{step.action}</span>
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Requirements */}
                    {item.requirements && (
                      <div className="grid md:grid-cols-2 gap-6">
                        {item.requirements.map((req, idx) => (
                          <div key={idx} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{req.category}</h4>
                            <ul className="space-y-2">
                              {req.items.map((item, itemIdx) => (
                                <li key={itemIdx} className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Domains */}
                    {item.domains && (
                      <div className="grid md:grid-cols-2 gap-4">
                        {item.domains.map((domain, idx) => (
                          <div key={idx} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900 dark:text-white">{domain.name}</h4>
                              <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">{domain.controls} controls</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">{domain.description}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Maturity Scale */}
                    {item.maturityScale && (
                      <div className="space-y-4">
                        {item.maturityScale.map((level, idx) => (
                          <div key={idx} className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                            <div className={`w-4 h-4 rounded-full bg-${level.color}-500`} />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white">{level.level}</h4>
                              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{level.description}</p>
                              <div className="flex flex-wrap gap-2">
                                {level.examples.map((example, exIdx) => (
                                  <span key={exIdx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                                    {example}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video Tutorials */}
          {showVideoTutorials && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Video className="w-8 h-8 mr-3 text-blue-600 dark:text-blue-400" />
                Video Tutorials
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {videoTutorials.map((tutorial, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <Play className="w-12 h-12 text-gray-400" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{tutorial.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{tutorial.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{tutorial.duration}</span>
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                          Watch Now
                        </button>
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
                    <div>
                      <span className="text-gray-600 dark:text-gray-300">{shortcut.action}</span>
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">({shortcut.category})</span>
                    </div>
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
              {filteredFaqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {faq.question}
                      </span>
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">({faq.category})</span>
                    </div>
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
              Our comprehensive support resources are designed to help you achieve CMMC 2.0 Level 2 compliance successfully.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Browse Documentation</span>
              </button>
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2">
                <Video className="w-5 h-5" />
                <span>Watch Tutorials</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

