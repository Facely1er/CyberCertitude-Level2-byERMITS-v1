import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

interface LinkSuggestion {
  title: string;
  description: string;
  href: string;
  category: 'next-step' | 'related' | 'prerequisite' | 'resource';
  priority: 'high' | 'medium' | 'low';
  anchorText: string[];
}

interface BreadcrumbItem {
  label: string;
  path: string | undefined;
  isActive: boolean;
}

export const useInternalLinking = () => {
  const location = useLocation();
  
  // Define the internal linking map
  const linkingMap: Record<string, LinkSuggestion[]> = {
    '/dashboard': [
      {
        title: 'Start CMMC 2.0 Assessment',
        description: 'Begin comprehensive CMMC 2.0 Level 2 evaluation',
        href: '/assessment-intro',
        category: 'next-step',
        priority: 'high',
        anchorText: ['start cmmc assessment', 'new evaluation', 'begin CMMC 2.0 Level 2 assessment']
      },
      {
        title: 'CMMC 2.0 Implementation Workflow',
        description: 'Follow structured CMMC 2.0 Level 2 implementation roadmap',
        href: '/compliance-workflow',
        category: 'next-step',
        priority: 'high',
        anchorText: ['cmmc workflow', 'implementation roadmap', 'cmmc implementation']
      },
      {
        title: 'CMMC 2.0 Compliance Status',
        description: 'Check real-time CMMC 2.0 control implementation progress',
        href: '/compliance',
        category: 'related',
        priority: 'high',
        anchorText: ['cmmc status', 'control implementation', 'certification readiness']
      },
      {
        title: 'CUI Asset Management',
        description: 'CUI inventory and scope management',
        href: '/assets',
        category: 'related',
        priority: 'medium',
        anchorText: ['cui assets', 'asset inventory', 'cui scope']
      }
    ],
    '/assessment-intro': [
      {
        title: 'CMMC 2.0 Dashboard',
        description: 'Return to CMMC 2.0 compliance dashboard',
        href: '/dashboard',
        category: 'prerequisite',
        priority: 'medium',
        anchorText: ['cmmc dashboard', 'compliance overview', 'implementation dashboard']
      },
      {
        title: 'CMMC 2.0 Implementation Workflow',
        description: 'Follow structured CMMC 2.0 implementation process',
        href: '/compliance-workflow',
        category: 'next-step',
        priority: 'high',
        anchorText: ['cmmc workflow', 'implementation process', 'compliance workflow']
      },
      {
        title: 'CUI Asset Inventory',
        description: 'Prepare CUI asset list before CMMC assessment',
        href: '/assets/inventory',
        category: 'prerequisite',
        priority: 'high',
        anchorText: ['cui inventory', 'cui assets', 'cmmc scope']
      }
    ],
    '/compliance': [
      {
        title: 'CMMC 2.0 Evidence Collection',
        description: 'Collect CMMC 2.0 compliance documentation',
        href: '/evidence',
        category: 'next-step',
        priority: 'high',
        anchorText: ['cmmc evidence', 'compliance documentation', 'c3pao evidence']
      },
      {
        title: 'CMMC Implementation Workflow',
        description: 'Follow structured CMMC implementation roadmap',
        href: '/compliance-workflow',
        category: 'related',
        priority: 'high',
        anchorText: ['cmmc workflow', 'implementation roadmap', 'control implementation']
      },
      {
        title: 'CMMC 2.0 Gap Analysis Report',
        description: 'Generate detailed CMMC 2.0 control gaps',
        href: '/reports',
        category: 'next-step',
        priority: 'medium',
        anchorText: ['cmmc gaps', 'control analysis', 'implementation gaps']
      },
      {
        title: 'CMMC 2.0 Controls Management',
        description: 'Implement missing CMMC 2.0 controls',
        href: '/controls',
        category: 'related',
        priority: 'high',
        anchorText: ['cmmc controls', 'control implementation', 'cui protection']
      }
    ],
    '/evidence': [
      {
        title: 'Compliance Monitoring',
        description: 'Track evidence collection progress',
        href: '/compliance',
        category: 'related',
        priority: 'medium',
        anchorText: ['compliance monitoring', 'track progress', 'implementation status']
      },
      {
        title: 'Policy Management',
        description: 'Link policies to evidence',
        href: '/policies',
        category: 'related',
        priority: 'medium',
        anchorText: ['policy management', 'link policies', 'governance documentation']
      }
    ],
    '/assets': [
      {
        title: 'Asset Inventory',
        description: 'Complete asset listing and details',
        href: '/assets/inventory',
        category: 'next-step',
        priority: 'high',
        anchorText: ['view inventory', 'complete asset list', 'detailed inventory']
      },
      {
        title: 'Risk Assessment',
        description: 'Assess asset-related risks',
        href: '/compliance',
        category: 'next-step',
        priority: 'medium',
        anchorText: ['risk assessment', 'asset risks', 'evaluate risks']
      }
    ],
    '/team': [
      {
        title: 'Task Management',
        description: 'Assign and track implementation tasks',
        href: '/tasks',
        category: 'next-step',
        priority: 'high',
        anchorText: ['task management', 'assign tasks', 'track tasks']
      },
      {
        title: 'Team Performance Reports',
        description: 'Analyze team productivity and progress',
        href: '/reports',
        category: 'related',
        priority: 'medium',
        anchorText: ['team reports', 'performance analysis', 'productivity tracking']
      }
    ],
    '/tasks': [
      {
        title: 'Team Collaboration',
        description: 'Coordinate with team members',
        href: '/team',
        category: 'prerequisite',
        priority: 'medium',
        anchorText: ['team collaboration', 'coordinate efforts', 'team coordination']
      },
      {
        title: 'Implementation Workflow',
        description: 'Reference structured implementation process',
        href: '/compliance-workflow',
        category: 'prerequisite',
        priority: 'high',
        anchorText: ['implementation workflow', 'compliance roadmap', 'process guidance']
      },
      {
        title: 'Activity Calendar',
        description: 'Schedule task deadlines and milestones',
        href: '/calendar',
        category: 'related',
        priority: 'high',
        anchorText: ['activity calendar', 'schedule activities', 'plan deadlines']
      }
    ],
    '/calendar': [
      {
        title: 'Task Management',
        description: 'Manage tasks and assignments',
        href: '/tasks',
        category: 'related',
        priority: 'high',
        anchorText: ['task management', 'manage assignments', 'track deliverables']
      }
    ],
    '/policies': [
      {
        title: 'Controls Implementation',
        description: 'Implement security controls from policies',
        href: '/controls',
        category: 'next-step',
        priority: 'high',
        anchorText: ['implement controls', 'security controls', 'control implementation']
      },
      {
        title: 'Evidence Documentation',
        description: 'Collect policy compliance evidence',
        href: '/evidence',
        category: 'next-step',
        priority: 'medium',
        anchorText: ['policy evidence', 'compliance documentation', 'collect evidence']
      }
    ],
    '/controls': [
      {
        title: 'Policy Framework',
        description: 'Review underlying policy requirements',
        href: '/policies',
        category: 'prerequisite',
        priority: 'medium',
        anchorText: ['policy framework', 'policy requirements', 'governance policies']
      },
      {
        title: 'Evidence Validation',
        description: 'Validate control implementation evidence',
        href: '/evidence',
        category: 'next-step',
        priority: 'high',
        anchorText: ['validate evidence', 'control evidence', 'implementation proof']
      }
    ]
  };

  const getRelatedLinks = (currentPath: string): LinkSuggestion[] => {
    return linkingMap[currentPath] || [];
  };

  const getBreadcrumbsForPath = (pathname: string): BreadcrumbItem[] => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Define path to label mapping (must match navigation.ts labels)
    const pathLabels: Record<string, string> = {
      dashboard: 'Dashboard',
      'assessment-intro': 'Start Assessment',
      assessment: 'Assessment',
      'assessment/wizard': 'Compliance Wizard',
      'gap-analysis': 'Gap Analysis',
      'risk-assessment': 'Risk Assessment',
      'control-assessor': 'Control Assessor',
      compliance: 'Compliance Status',
      'compliance-workflow': 'Implementation Plan',
      'cmmc-journey': 'CMMC 2.0 Journey',
      'project-charter': 'Project Setup',
      'cui-scope': 'CUI Scope',
      'data-flow': 'Data Flow Mapping',
      'team-roles': 'Team Roles',
      evidence: 'Evidence Collection',
      assets: 'Assets',
      'assets/inventory': 'Asset Inventory',
      'assets/categories': 'Asset Categories',
      'assets/dependencies': 'Asset Dependencies',
      team: 'Team Collaboration',
      tasks: 'Task Management',
      calendar: 'Calendar',
      policies: 'Policy Management',
      controls: 'Controls Management',
      'report/:id': 'Assessment Report',
      reports: 'Assessment Reports',
      'reports/advanced': 'Advanced Analytics',
      'reports/compliance': 'Compliance Reports',
      'reports/team': 'Team Performance',
      audit: 'Audit Tools',
      'audit-checklists': 'Audit Checklists',
      'audit-checklist-generator': 'Audit Checklist Generator',
      training: 'Training',
      'training-modules': 'Training Modules',
      'training-module-generator': 'Training Module Generator',
      analytics: 'Analytics Dashboard',
      'risk-management': 'Risk Management',
      'technical-tools': 'Technical Tools',
      collaboration: 'Team Collaboration',
      profile: 'User Profile',
      settings: 'Settings',
      help: 'Help & Support',
      home: 'Home'
    };

    // Build breadcrumb trail
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      // Try to find label in order: full path > segment
      const fullPath = pathSegments.slice(0, index + 1).join('/');
      const label = pathLabels[fullPath] || 
                    pathLabels[currentPath.substring(1)] || 
                    pathLabels[segment] || 
                    segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      
      // Special handling for assessment routes
      if (segment === 'assessment' && !isLast) {
        // For /assessment/:id routes, link "Assessment" to dashboard instead of non-existent /assessment
        breadcrumbs.push({
          label: 'Assessment',
          path: '/dashboard',
          isActive: false
        });
        return;
      }
      
      breadcrumbs.push({
        label,
        path: isLast ? undefined : currentPath,
        isActive: isLast
      });
    });

    return breadcrumbs;
  };

  const contextualLinks = useMemo(() => {
    return getRelatedLinks(location.pathname);
  }, [location.pathname]);

  const breadcrumbs = useMemo(() => {
    return getBreadcrumbsForPath(location.pathname);
  }, [location.pathname]);

  return {
    contextualLinks,
    breadcrumbs,
    getRelatedLinks,
    getBreadcrumbsForPath
  };
};