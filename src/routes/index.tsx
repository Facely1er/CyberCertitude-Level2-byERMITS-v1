import React from 'react';
import { Link } from 'react-router-dom';
import { StartScreen } from '../shared/components/layout/StartScreen';
import AdvancedDashboard from '../features/assessment/components/AdvancedDashboard';
import { WorkflowGuidance } from '../components/WorkflowGuidance';
import MasterDashboard from '../components/MasterDashboard';
import EnhancedDashboard from '../components/EnhancedDashboard';
import ComplianceAssessmentWizard from '../components/ComplianceAssessmentWizard';
import HowItWorks from '../components/HowItWorks';
import { authRoutes } from './auth';
import { assessmentRoutes } from './assessment';
import { complianceRoutes } from './compliance';
import { assetRoutes } from './assets';
import { teamRoutes } from './team';
import { reportingRoutes } from './reporting';
import { toolsRoutes } from './tools';
import { implementationRoutes } from './implementation';
import { accountRoutes } from './account';
import { templateRoutes } from './templates';
import { legalRoutes } from './legal';

// 404 Not Found Component
const NotFoundPage: React.FC = () => (
  <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center px-4">
    <div className="max-w-md w-full bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-8 text-center">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <img 
            src="/cybercertitude.png" 
            alt="CyberCertitude" 
            className="w-12 h-12 flex-shrink-0" 
          />
          <div className="flex flex-col text-left">
            <span className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
              CyberCertitude™
            </span>
            <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
              CMMC 2.0 Compliance • by ERMITS
            </span>
          </div>
        </Link>
      </div>
      <div className="w-16 h-16 mx-auto mb-4 bg-error-100 dark:bg-error-900/30 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-error-600 dark:text-error-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
        Page Not Found
      </h1>
      <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
        The page you're looking for doesn't exist.
      </p>
      <button
        onClick={() => window.history.back()}
        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 dark:hover:bg-primary-400 transition-colors"
      >
        Go Back
      </button>
    </div>
  </div>
);

// Main routes that don't fit into specific categories
export const mainRoutes = [
  {
    path: "/",
    element: StartScreen,
    title: "Start Screen"
  },
  {
    path: "/dashboard",
    element: AdvancedDashboard,
    title: "Dashboard"
  },
  {
    path: "/dashboard/master",
    element: MasterDashboard,
    title: "Master Dashboard"
  },
  {
    path: "/dashboard/enhanced",
    element: EnhancedDashboard,
    title: "Enhanced Dashboard"
  },
  {
    path: "/assessment/wizard",
    element: ComplianceAssessmentWizard,
    title: "Compliance Assessment Wizard"
  },
  {
    path: "/workflow-guidance",
    element: WorkflowGuidance,
    title: "Workflow Guidance"
  },
  {
    path: "/how-it-works",
    element: HowItWorks,
    title: "How It Works"
  }
];

// Combine all routes
export const allRoutes = [
  ...mainRoutes,
  ...authRoutes,
  ...assessmentRoutes,
  ...complianceRoutes,
  ...assetRoutes,
  ...teamRoutes,
  ...reportingRoutes,
  ...toolsRoutes,
  ...implementationRoutes,
  ...accountRoutes,
  ...templateRoutes,
  ...legalRoutes,
  // Catch-all route for 404
  {
    path: "*",
    element: NotFoundPage,
    title: "404 Not Found"
  }
];
