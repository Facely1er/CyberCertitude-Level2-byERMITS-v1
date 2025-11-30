import { 
  TeamCollaborationDashboard,
  TaskManagementDashboard,
  ComplianceCalendarView
} from '../components/LazyComponents';

export const teamRoutes = [
  {
    path: "/team",
    element: TeamCollaborationDashboard,
    title: "Team Dashboard"
  },
  {
    path: "/tasks",
    element: TaskManagementDashboard,
    title: "Task Management"
  },
  {
    path: "/calendar",
    element: ComplianceCalendarView,
    title: "Compliance Calendar"
  }
];
