import React from 'react';
import { 
  AssessmentReportsPage,
  AdvancedReportingDashboard,
  TeamTrackingReport,
  SecurityAssessmentReportGenerator
} from '../components/LazyComponents';
import { ReportRoute } from './ReportRoute';

export const reportingRoutes = [
  {
    path: "/reports",
    element: AssessmentReportsPage,
    title: "Reports Dashboard"
  },
  {
    path: "/reports/advanced",
    element: AdvancedReportingDashboard,
    title: "Advanced Reports"
  },
  {
    path: "/reports/team",
    element: TeamTrackingReport,
    title: "Team Reports"
  },
  {
    path: "/reports/compliance",
    element: () => (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card-standard p-8">
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">
            Compliance Reports
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            Compliance reporting functionality will be implemented here.
          </p>
        </div>
      </div>
    ),
    title: "Compliance Reports"
  },
  {
    path: "/reports/security-assessment",
    element: SecurityAssessmentReportGenerator,
    title: "Security Assessment Reports"
  },
  {
    path: "/report/:id",
    element: ReportRoute,
    title: "Report View"
  }
];
