import { 
  Shield, 
  ChartBar as BarChart3, 
  CircleCheck as CheckCircle, 
  FileText, 
  SquareCheck as CheckSquare, 
  Target, 
  Activity, 
  Database, 
  Users, 
  Settings, 
  Circle as HelpCircle, 
  Lock, 
  Menu, 
  Play, 
  BookOpen, 
  ExternalLink, 
  TriangleAlert as AlertTriangle, 
  FileBarChart,
  Wrench,
  Tag,
  GitBranch,
  Workflow,
  Calendar,
  ArrowRight
} from 'lucide-react';

export interface NavigationItem {
  label: string;
  href?: string;
  icon: any;
  description?: string;
  children?: NavigationItem[];
}

export const navigationItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
    description: 'Overview and quick access to key features'
  },
  {
    label: 'Master Dashboard',
    href: '/dashboard/master',
    icon: BarChart3,
    description: 'Complete implementation tracking and toolkit management'
  },
  {
    label: 'Enhanced Dashboard',
    href: '/dashboard/enhanced',
    icon: BarChart3,
    description: 'Advanced progress tracking with smart recommendations'
  },
  {
    label: 'Assessment',
    icon: Target,
    children: [
      {
        label: 'Start Assessment',
        href: '/assessment-intro',
        icon: Play,
        description: 'Begin CMMC 2.0 Level 2 assessment'
      },
      {
        label: 'Gap Analysis',
        href: '/gap-analysis',
        icon: AlertTriangle,
        description: 'Identify compliance gaps and requirements'
      },
      {
        label: 'Risk Assessment',
        href: '/risk-assessment',
        icon: Shield,
        description: 'Assess security risks and vulnerabilities'
      },
      {
        label: 'Control Assessor',
        href: '/control-assessor',
        icon: CheckCircle,
        description: 'Review all 110 security controls'
      },
      {
        label: 'Compliance Wizard',
        href: '/assessment/wizard',
        icon: Target,
        description: 'Interactive CMMC compliance assessment'
      }
    ]
  },
  {
    label: 'Implementation',
    icon: Wrench,
    children: [
      {
        label: 'Project Setup',
        href: '/project-charter',
        icon: FileText,
        description: 'Define scope, team, and objectives'
      },
      {
        label: 'CUI Scope',
        href: '/cui-scope',
        icon: Target,
        description: 'Identify systems and assets under CUI scope'
      },
      {
        label: 'Data Flow Mapping',
        href: '/data-flow',
        icon: Activity,
        description: 'Map CUI data flows and system boundaries'
      },
      {
        label: 'Team Roles',
        href: '/team-roles',
        icon: Users,
        description: 'Designate compliance team roles'
      },
      {
        label: 'Implementation Workbook',
        href: '/implementation-workbook',
        icon: BookOpen,
        description: 'Control-level tasks and evidence checklist'
      },
      {
        label: 'CMMC Journey',
        href: '/cmmc-journey',
        icon: Activity,
        description: 'Guided step-by-step implementation workflow'
      },
      {
        label: 'Template Library',
        href: '/templates/library',
        icon: FileText,
        description: 'Browse and customize CMMC compliance templates'
      },
      {
        label: 'Compliance Toolkit',
        href: '/templates/compliance-toolkit',
        icon: Shield,
        description: 'Complete CMMC 2.0 toolkit with all templates'
      },
      {
        label: 'Scenario Templates',
        href: '/templates/scenarios',
        icon: BookOpen,
        description: 'Enterprise-grade comprehensive documents'
      }
    ]
  },
  {
    label: 'Compliance',
    icon: Shield,
    children: [
      {
        label: 'Compliance Dashboard',
        href: '/compliance',
        icon: BarChart3,
        description: 'Real-time compliance status and monitoring'
      },
      {
        label: 'CMMC Compliance',
        href: '/compliance/cmmc',
        icon: Shield,
        description: 'CMMC 2.0 Level 2 compliance tracking'
      },
      {
        label: 'Compliance Workflow',
        href: '/compliance-workflow',
        icon: Workflow,
        description: 'Guided compliance implementation workflow'
      },
      {
        label: 'Evidence Collection',
        href: '/evidence',
        icon: Database,
        description: 'Collect and manage compliance evidence'
      },
      {
        label: 'Audit Preparation',
        href: '/audit-package',
        icon: CheckSquare,
        description: 'Prepare for C3PAO assessment'
      }
    ]
  },
  {
    label: 'Assets',
    icon: Database,
    children: [
      {
        label: 'Asset Dashboard',
        href: '/assets',
        icon: BarChart3,
        description: 'Overview of all organizational assets'
      },
      {
        label: 'Asset Inventory',
        href: '/assets/inventory',
        icon: Database,
        description: 'Complete asset inventory and categorization'
      },
      {
        label: 'Asset Categories',
        href: '/assets/categories',
        icon: Tag,
        description: 'Organize assets by categories and classifications'
      },
      {
        label: 'Asset Dependencies',
        href: '/assets/dependencies',
        icon: GitBranch,
        description: 'Map asset relationships and dependencies'
      },
      {
        label: 'Asset Workflow',
        href: '/assets/workflow',
        icon: Workflow,
        description: 'Asset management workflow and processes'
      },
      {
        label: 'Asset Roadmap',
        href: '/assets/roadmap',
        icon: ArrowRight,
        description: 'Asset development and improvement roadmap'
      },
      {
        label: 'Action Plan',
        href: '/assets/action-plan',
        icon: CheckSquare,
        description: 'Asset-specific action plans and tasks'
      }
    ]
  },
  {
    label: 'Team & Collaboration',
    icon: Users,
    children: [
      {
        label: 'Team Dashboard',
        href: '/team',
        icon: Users,
        description: 'Team collaboration and role management'
      },
      {
        label: 'Task Management',
        href: '/tasks',
        icon: CheckSquare,
        description: 'Track compliance tasks and assignments'
      },
      {
        label: 'Calendar',
        href: '/calendar',
        icon: Calendar,
        description: 'Compliance calendar and milestone tracking'
      }
    ]
  },
  {
    label: 'Reporting',
    icon: FileBarChart,
    children: [
      {
        label: 'Reports Dashboard',
        href: '/reports',
        icon: BarChart3,
        description: 'Access all compliance reports'
      },
      {
        label: 'Advanced Reports',
        href: '/reports/advanced',
        icon: FileBarChart,
        description: 'Advanced reporting and analytics'
      },
      {
        label: 'Team Reports',
        href: '/reports/team',
        icon: Users,
        description: 'Team performance and progress reports'
      },
      {
        label: 'Compliance Reports',
        href: '/reports/compliance',
        icon: Shield,
        description: 'Compliance status and gap reports'
      },
      {
        label: 'Security Assessment',
        href: '/reports/security-assessment',
        icon: Shield,
        description: 'Security assessment reports'
      }
    ]
  },
  {
    label: 'Tools',
    icon: Wrench,
    children: [
      {
        label: 'Risk Assessment',
        href: '/risk-assessment',
        icon: Shield,
        description: 'Risk assessment and analysis tools'
      },
      {
        label: 'Threat Modeling',
        href: '/threat-modeling',
        icon: Target,
        description: 'Threat modeling and analysis'
      },
      {
        label: 'Vulnerability Scanner',
        href: '/vulnerability-scanner',
        icon: AlertTriangle,
        description: 'Vulnerability scanning and assessment'
      },
      {
        label: 'Training Modules',
        href: '/training-modules',
        icon: BookOpen,
        description: 'Security awareness training modules'
      },
      {
        label: 'Awareness Campaigns',
        href: '/awareness-campaigns',
        icon: Users,
        description: 'Security awareness campaign planning'
      },
      {
        label: 'Audit Checklists',
        href: '/audit-checklists',
        icon: CheckSquare,
        description: 'Audit checklist generation'
      },
      {
        label: 'Security Controls',
        href: '/security-controls',
        icon: Shield,
        description: 'Security control mapping and management'
      },
      {
        label: 'Config Baselines',
        href: '/config-baselines',
        icon: Settings,
        description: 'Configuration baseline management'
      },
      {
        label: 'Incident Response',
        href: '/incident-response',
        icon: AlertTriangle,
        description: 'Incident response planning and management'
      }
    ]
  },
  {
    label: 'Account',
    icon: Settings,
    children: [
      {
        label: 'Profile',
        href: '/profile',
        icon: Users,
        description: 'User profile and preferences'
      },
      {
        label: 'Settings',
        href: '/settings',
        icon: Settings,
        description: 'Application settings and configuration'
      },
      {
        label: 'Help',
        href: '/help',
        icon: HelpCircle,
        description: 'Help documentation and support'
      }
    ]
  }
];
