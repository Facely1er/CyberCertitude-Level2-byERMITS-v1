import React from 'react';
import { FileText, Users, Target, Activity, Database, CheckSquare, Shield, BookOpen, Calendar, BarChart3 } from 'lucide-react';
import { Breadcrumbs } from '../shared/components/layout/Breadcrumbs';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  features?: string[];
  nextSteps?: string[];
  className?: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  description,
  icon: Icon,
  features = [],
  nextSteps = [],
  className = ''
}) => {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
      <div className="mb-6">
        <Breadcrumbs items={[
          { label: 'CMMC Platform', path: '/dashboard' },
          { label: title, isActive: true }
        ]} />
      </div>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
                <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
                <p className="text-gray-600 dark:text-gray-300">{description}</p>
              </div>
            </div>
            
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg whitespace-nowrap">
              Coming Soon
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6 mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Coming Soon</h3>
            <p className="text-blue-700 dark:text-blue-200">
              This feature is currently under development. We're working hard to bring you a comprehensive solution.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      {features.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Feature {index + 1}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{feature}</p>
            </div>
          ))}
        </div>
      )}

      {/* Next Steps */}
      {nextSteps.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-500" />
            <span>What's Coming Next</span>
          </h3>
          <div className="space-y-3">
            {nextSteps.map((step, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{index + 1}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alternative Actions */}
      <div className="mt-8 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Alternative Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
            <FileText className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">View Documentation</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
            <Users className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Contact Support</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">View Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Specific placeholder components for common pages
export const ProjectCharterPage: React.FC = () => (
  <PlaceholderPage
    title="Project Charter"
    description="Define scope, team, and objectives for CMMC 2.0 implementation"
    icon={FileText}
    features={[
      'Project scope definition and boundaries',
      'Team roles and responsibilities matrix',
      'Timeline and milestone planning',
      'Resource allocation and budget planning',
      'Risk assessment and mitigation strategies',
      'Success criteria and metrics definition'
    ]}
    nextSteps={[
      'Complete project charter template',
      'Get executive approval and sign-off',
      'Establish project governance structure',
      'Set up project tracking and reporting'
    ]}
  />
);

export const CUIScopePage: React.FC = () => (
  <PlaceholderPage
    title="CUI Scope Definition"
    description="Identify systems and assets under Controlled Unclassified Information scope"
    icon={Target}
    features={[
      'System inventory and classification',
      'Data flow mapping and analysis',
      'Network boundary definition',
      'Asset categorization and tagging',
      'CUI handling procedures',
      'Scope validation and approval'
    ]}
    nextSteps={[
      'Conduct comprehensive system inventory',
      'Map data flows and system boundaries',
      'Classify systems based on CUI handling',
      'Document scope in official charter'
    ]}
  />
);

export const DataFlowPage: React.FC = () => (
  <PlaceholderPage
    title="Data Flow Diagram"
    description="Map CUI data flows and system boundaries"
    icon={Activity}
    features={[
      'Interactive data flow visualization',
      'System boundary mapping',
      'CUI data path tracking',
      'Security control placement',
      'Network topology diagrams',
      'Data classification overlays'
    ]}
    nextSteps={[
      'Create initial data flow diagrams',
      'Identify all CUI touchpoints',
      'Map security control locations',
      'Validate with technical teams'
    ]}
  />
);

export const TeamRolesPage: React.FC = () => (
  <PlaceholderPage
    title="Team Roles Assignment"
    description="Designate compliance team roles and responsibilities"
    icon={Users}
    features={[
      'Role-based access control setup',
      'RACI matrix creation and management',
      'Team member onboarding workflows',
      'Responsibility assignment tracking',
      'Training and certification tracking',
      'Performance monitoring and reporting'
    ]}
    nextSteps={[
      'Define team structure and roles',
      'Create RACI matrix for all activities',
      'Assign team members to specific roles',
      'Set up access controls and permissions'
    ]}
  />
);

export const ImplementationWorkbookPage: React.FC = () => (
  <PlaceholderPage
    title="Implementation Workbook"
    description="Control-level tasks, owners, and evidence checklist"
    icon={BookOpen}
    features={[
      'Control implementation tracking',
      'Task assignment and management',
      'Evidence collection workflows',
      'Progress monitoring dashboards',
      'Milestone tracking and reporting',
      'Team collaboration tools'
    ]}
    nextSteps={[
      'Import control requirements',
      'Assign implementation tasks',
      'Set up evidence collection workflows',
      'Begin implementation tracking'
    ]}
  />
);

export const PolicyTemplatesPage: React.FC = () => (
  <PlaceholderPage
    title="Policy Templates"
    description="Pre-formatted policies aligned with NIST SP 800-171"
    icon={FileText}
    features={[
      'NIST SP 800-171 aligned templates',
      'Customizable policy frameworks',
      'Version control and change tracking',
      'Approval workflows',
      'Distribution and training tracking',
      'Compliance mapping and validation'
    ]}
    nextSteps={[
      'Review available policy templates',
      'Customize templates for organization',
      'Set up approval workflows',
      'Begin policy implementation'
    ]}
  />
);

export const DocumentRepositoryPage: React.FC = () => (
  <PlaceholderPage
    title="Document Repository"
    description="Centralized storage for all compliance documents"
    icon={Database}
    features={[
      'Centralized document storage',
      'Version control and change tracking',
      'Document classification and tagging',
      'Search and retrieval capabilities',
      'Access control and permissions',
      'Audit trail and compliance reporting'
    ]}
    nextSteps={[
      'Set up document repository structure',
      'Define classification and tagging schemes',
      'Configure access controls',
      'Begin document migration'
    ]}
  />
);

export const ControlValidationPage: React.FC = () => (
  <PlaceholderPage
    title="Control Validation"
    description="Verify implemented controls and test results"
    icon={Shield}
    features={[
      'Control testing and validation',
      'Test result documentation',
      'Remediation tracking',
      'Evidence validation',
      'Compliance verification',
      'Audit preparation support'
    ]}
    nextSteps={[
      'Develop validation test plans',
      'Execute control testing',
      'Document test results',
      'Address any findings'
    ]}
  />
);

export const ComplianceTrackingPage: React.FC = () => (
  <PlaceholderPage
    title="Compliance Tracking"
    description="Monitor progress and compliance status"
    icon={BarChart3}
    features={[
      'Real-time compliance monitoring',
      'Progress tracking dashboards',
      'Milestone and deadline management',
      'Risk and issue tracking',
      'Executive reporting',
      'Trend analysis and forecasting'
    ]}
    nextSteps={[
      'Set up compliance tracking metrics',
      'Configure monitoring dashboards',
      'Establish reporting cadence',
      'Begin progress monitoring'
    ]}
  />
);

export const AuditPackagePage: React.FC = () => (
  <PlaceholderPage
    title="Audit Readiness Package"
    description="Final submission-ready package for C3PAO"
    icon={FileText}
    features={[
      'Comprehensive audit package generation',
      'Document organization and indexing',
      'Evidence compilation and validation',
      'C3PAO submission preparation',
      'Quality assurance checks',
      'Submission tracking and follow-up'
    ]}
    nextSteps={[
      'Compile all required documentation',
      'Validate evidence completeness',
      'Conduct quality assurance review',
      'Prepare for C3PAO submission'
    ]}
  />
);

export const C3PAOPrepPage: React.FC = () => (
  <PlaceholderPage
    title="C3PAO Preparation"
    description="Final review before C3PAO engagement"
    icon={CheckSquare}
    features={[
      'Pre-assessment readiness review',
      'C3PAO coordination and scheduling',
      'Team preparation and training',
      'Documentation final review',
      'Mock assessment support',
      'Post-assessment follow-up'
    ]}
    nextSteps={[
      'Schedule C3PAO assessment',
      'Conduct final readiness review',
      'Prepare assessment team',
      'Execute assessment activities'
    ]}
  />
);

export const MetricsDashboardPage: React.FC = () => (
  <PlaceholderPage
    title="Metrics Dashboard"
    description="Executive summary of compliance posture"
    icon={BarChart3}
    features={[
      'Executive-level compliance metrics',
      'Key performance indicators',
      'Trend analysis and forecasting',
      'Risk and issue summaries',
      'Resource utilization tracking',
      'Strategic planning support'
    ]}
    nextSteps={[
      'Define executive metrics and KPIs',
      'Set up dashboard configurations',
      'Establish reporting cadence',
      'Begin executive reporting'
    ]}
  />
);

export const CertificationTrackingPage: React.FC = () => (
  <PlaceholderPage
    title="Certification Tracking"
    description="Track certification progress and milestones"
    icon={Calendar}
    features={[
      'Certification timeline tracking',
      'Milestone and deadline management',
      'C3PAO coordination',
      'Documentation status tracking',
      'Remediation monitoring',
      'Certification maintenance planning'
    ]}
    nextSteps={[
      'Set up certification timeline',
      'Track key milestones',
      'Monitor documentation status',
      'Plan for certification maintenance'
    ]}
  />
);

export const PoliciesPage: React.FC = () => (
  <PlaceholderPage
    title="Policy Management"
    description="Manage organizational security policies and procedures"
    icon={FileText}
    features={[
      'Policy creation and editing',
      'Version control and change tracking',
      'Approval workflows',
      'Policy distribution and training',
      'Compliance mapping',
      'Review and renewal tracking'
    ]}
    nextSteps={[
      'Review existing policies',
      'Create new policies as needed',
      'Set up approval workflows',
      'Distribute and train staff'
    ]}
  />
);

export const AuditLogsPage: React.FC = () => (
  <PlaceholderPage
    title="Audit Logs"
    description="View and analyze system audit logs"
    icon={BarChart3}
    features={[
      'System activity logging',
      'User action tracking',
      'Security event monitoring',
      'Compliance reporting',
      'Log analysis and forensics',
      'Automated alerting'
    ]}
    nextSteps={[
      'Configure audit logging policies',
      'Set up log retention policies',
      'Enable automated monitoring',
      'Review and analyze logs regularly'
    ]}
  />
);

export const CMMCAssessmentPage: React.FC = () => (
  <PlaceholderPage
    title="CMMC 2.0 Assessment"
    description="Conduct comprehensive CMMC 2.0 Level 2 assessments"
    icon={Shield}
    features={[
      'CMMC 2.0 Level 2 control assessment',
      'Gap analysis and compliance scoring',
      'Evidence collection and validation',
      'Assessment reporting',
      'Remediation planning',
      'C3PAO preparation'
    ]}
    nextSteps={[
      'Complete control assessments',
      'Review assessment results',
      'Address identified gaps',
      'Prepare for C3PAO assessment'
    ]}
  />
);

export const PrivacyAssessmentPage: React.FC = () => (
  <PlaceholderPage
    title="Privacy Assessment"
    description="Assess privacy controls and compliance"
    icon={Shield}
    features={[
      'Privacy impact assessments',
      'Data protection analysis',
      'Privacy policy compliance',
      'GDPR/CCPA readiness',
      'Privacy risk assessment',
      'Incident response planning'
    ]}
    nextSteps={[
      'Complete privacy impact assessment',
      'Review privacy controls',
      'Address privacy gaps',
      'Implement privacy safeguards'
    ]}
  />
);

export const ControlsManagementPage: React.FC = () => (
  <PlaceholderPage
    title="Controls Management"
    description="Manage and track security controls"
    icon={Shield}
    features={[
      'Control inventory management',
      'Control mapping and assessment',
      'Compliance validation',
      'Remediation tracking',
      'Control effectiveness monitoring',
      'Audit preparation'
    ]}
    nextSteps={[
      'Review control inventory',
      'Assess control effectiveness',
      'Identify control gaps',
      'Implement remediation plans'
    ]}
  />
);