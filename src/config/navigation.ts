import { 
  Shield, 
  ChartBar as BarChart3, 
  CircleCheck as CheckCircle, 
  FileText, 
  Target, 
  Activity, 
  Database, 
  Users, 
  Play, 
  BookOpen, 
  TriangleAlert as AlertTriangle, 
  Wrench,
  Tag,
  GitBranch
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
    label: 'Assessment',
    icon: Target,
    children: [
      {
        label: 'Start Assessment',
        href: '/assessment-intro',
        icon: Play,
        description: 'Begin CMMC 2.0 Level 2 self-assessment'
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
        description: 'Interactive CMMC 2.0 compliance assessment'
      }
    ]
  },
  {
    label: 'Implementation',
    icon: Wrench,
    children: [
      {
        label: 'CMMC 2.0 Journey',
        href: '/cmmc-journey',
        icon: Activity,
        description: 'Guided step-by-step implementation workflow'
      },
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
      }
    ]
  },
  {
    label: 'Templates',
    icon: FileText,
    children: [
      {
        label: 'Template Library',
        href: '/templates/library',
        icon: FileText,
        description: 'Browse and customize CMMC 2.0 compliance templates'
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
  }
];
