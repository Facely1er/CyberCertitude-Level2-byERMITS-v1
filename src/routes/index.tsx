import React from 'react';
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

// 404 Not Found Component
const NotFoundPage: React.FC = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
    <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Page Not Found
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        The page you're looking for doesn't exist.
      </p>
      <button
        onClick={() => window.history.back()}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
  // Catch-all route for 404
  {
    path: "*",
    element: NotFoundPage,
    title: "404 Not Found"
  }
];
