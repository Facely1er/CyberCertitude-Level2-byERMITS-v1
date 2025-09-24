import { dataService } from './dataService';
import { logger } from '../utils/logger';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'CISO' | 'Security Manager' | 'Compliance Officer' | 'IT Manager' | 'Implementation Team' | 'Domain Expert' | 'Auditor' | 'Executive' | 'Board Member' | 'External Consultant';
  department: string;
  organization: string;
  phone?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  permissions: string[];
  lastActive: Date;
  joinedDate: Date;
  skills: string[];
  certifications: string[];
  responsibilities: string[];
  assignedControls: string[];
  assignedPolicies: string[];
  assignedEvidence: string[];
  performanceMetrics: {
    tasksCompleted: number;
    tasksOverdue: number;
    collaborationScore: number;
    complianceScore: number;
    lastUpdated: Date;
  };
  notifications: TeamNotification[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamNotification {
  id: string;
  type: 'task-assigned' | 'deadline-approaching' | 'task-completed' | 'policy-updated' | 'control-changed' | 'evidence-required' | 'meeting-scheduled' | 'system-alert';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  isRead: boolean;
  actionRequired: boolean;
  actionUrl?: string;
  createdBy: string;
  createdAt: Date;
  expiresAt?: Date;
}

export interface TeamTask {
  id: string;
  title: string;
  description: string;
  type: 'control-implementation' | 'policy-review' | 'evidence-collection' | 'assessment' | 'training' | 'audit' | 'meeting' | 'documentation';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled';
  assignedTo: string[];
  createdBy: string;
  dueDate: Date;
  completedDate?: Date;
  progress: number;
  relatedControl?: string;
  relatedPolicy?: string;
  relatedEvidence?: string;
  tags: string[];
  comments: TaskComment[];
  attachments: string[];
  estimatedHours: number;
  actualHours: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskComment {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
  isInternal: boolean;
}

export interface TeamMeeting {
  id: string;
  title: string;
  description: string;
  type: 'standup' | 'review' | 'planning' | 'training' | 'audit' | 'emergency';
  attendees: string[];
  organizer: string;
  scheduledDate: Date;
  duration: number; // in minutes
  location: string;
  meetingUrl?: string;
  agenda: string[];
  notes?: string;
  actionItems: string[];
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamFilters {
  role?: string;
  department?: string;
  status?: string;
  search?: string;
}

export class TeamService {
  private static instance: TeamService;
  private readonly STORAGE_KEY = 'cybersecurity-team';

  static getInstance(): TeamService {
    if (!TeamService.instance) {
      TeamService.instance = new TeamService();
    }
    return TeamService.instance;
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    try {
      const data = dataService.getData();
      return data.teamMembers || [];
    } catch (error) {
      logger.error('Error fetching team members:', error);
      return [];
    }
  }

  async getTeamMember(id: string): Promise<TeamMember | null> {
    try {
      const teamMembers = await this.getTeamMembers();
      return teamMembers.find(member => member.id === id) || null;
    } catch (error) {
      logger.error('Error fetching team member:', error);
      return null;
    }
  }

  async saveTeamMember(member: Omit<TeamMember, 'createdAt' | 'updatedAt'>): Promise<TeamMember> {
    try {
      const teamMembers = await this.getTeamMembers();
      const now = new Date();
      
      const newMember: TeamMember = {
        ...member,
        createdAt: now,
        updatedAt: now
      };

      const existingIndex = teamMembers.findIndex(m => m.id === member.id);
      
      if (existingIndex >= 0) {
        teamMembers[existingIndex] = { ...newMember, createdAt: teamMembers[existingIndex].createdAt };
      } else {
        teamMembers.push(newMember);
      }

      await this.saveTeamMembers(teamMembers);
      return newMember;
    } catch (error) {
      logger.error('Error saving team member:', error);
      throw error;
    }
  }

  async updateTeamMember(id: string, updates: Partial<TeamMember>): Promise<TeamMember> {
    try {
      const teamMembers = await this.getTeamMembers();
      const index = teamMembers.findIndex(m => m.id === id);
      
      if (index === -1) {
        throw new Error('Team member not found');
      }

      teamMembers[index] = {
        ...teamMembers[index],
        ...updates,
        updatedAt: new Date()
      };

      await this.saveTeamMembers(teamMembers);
      return teamMembers[index];
    } catch (error) {
      logger.error('Error updating team member:', error);
      throw error;
    }
  }

  async deleteTeamMember(id: string): Promise<void> {
    try {
      const teamMembers = await this.getTeamMembers();
      const filteredMembers = teamMembers.filter(m => m.id !== id);
      await this.saveTeamMembers(filteredMembers);
    } catch (error) {
      logger.error('Error deleting team member:', error);
      throw error;
    }
  }

  async searchTeamMembers(filters: TeamFilters): Promise<TeamMember[]> {
    try {
      let teamMembers = await this.getTeamMembers();

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        teamMembers = teamMembers.filter(member =>
          member.name.toLowerCase().includes(searchTerm) ||
          member.email.toLowerCase().includes(searchTerm) ||
          member.department.toLowerCase().includes(searchTerm) ||
          member.organization.toLowerCase().includes(searchTerm) ||
          member.skills.some(skill => skill.toLowerCase().includes(searchTerm))
        );
      }

      if (filters.role && filters.role !== 'all') {
        teamMembers = teamMembers.filter(member => member.role === filters.role);
      }

      if (filters.department && filters.department !== 'all') {
        teamMembers = teamMembers.filter(member => member.department === filters.department);
      }

      if (filters.status && filters.status !== 'all') {
        teamMembers = teamMembers.filter(member => member.status === filters.status);
      }

      return teamMembers;
    } catch (error) {
      logger.error('Error searching team members:', error);
      return [];
    }
  }

  async getTeamTasks(): Promise<TeamTask[]> {
    try {
      const data = dataService.getData();
      return data.teamTasks || [];
    } catch (error) {
      logger.error('Error fetching team tasks:', error);
      return [];
    }
  }

  async getTeamTask(id: string): Promise<TeamTask | null> {
    try {
      const tasks = await this.getTeamTasks();
      return tasks.find(task => task.id === id) || null;
    } catch (error) {
      logger.error('Error fetching team task:', error);
      return null;
    }
  }

  async saveTeamTask(task: Omit<TeamTask, 'createdAt' | 'updatedAt'>): Promise<TeamTask> {
    try {
      const tasks = await this.getTeamTasks();
      const now = new Date();
      
      const newTask: TeamTask = {
        ...task,
        createdAt: now,
        updatedAt: now
      };

      const existingIndex = tasks.findIndex(t => t.id === task.id);
      
      if (existingIndex >= 0) {
        tasks[existingIndex] = { ...newTask, createdAt: tasks[existingIndex].createdAt };
      } else {
        tasks.push(newTask);
      }

      await this.saveTeamTasks(tasks);
      return newTask;
    } catch (error) {
      logger.error('Error saving team task:', error);
      throw error;
    }
  }

  async updateTeamTask(id: string, updates: Partial<TeamTask>): Promise<TeamTask> {
    try {
      const tasks = await this.getTeamTasks();
      const index = tasks.findIndex(t => t.id === id);
      
      if (index === -1) {
        throw new Error('Team task not found');
      }

      tasks[index] = {
        ...tasks[index],
        ...updates,
        updatedAt: new Date()
      };

      await this.saveTeamTasks(tasks);
      return tasks[index];
    } catch (error) {
      logger.error('Error updating team task:', error);
      throw error;
    }
  }

  async deleteTeamTask(id: string): Promise<void> {
    try {
      const tasks = await this.getTeamTasks();
      const filteredTasks = tasks.filter(t => t.id !== id);
      await this.saveTeamTasks(filteredTasks);
    } catch (error) {
      logger.error('Error deleting team task:', error);
      throw error;
    }
  }

  async getTeamMeetings(): Promise<TeamMeeting[]> {
    try {
      const data = dataService.getData();
      return data.teamMeetings || [];
    } catch (error) {
      logger.error('Error fetching team meetings:', error);
      return [];
    }
  }

  async getTeamMeeting(id: string): Promise<TeamMeeting | null> {
    try {
      const meetings = await this.getTeamMeetings();
      return meetings.find(meeting => meeting.id === id) || null;
    } catch (error) {
      logger.error('Error fetching team meeting:', error);
      return null;
    }
  }

  async saveTeamMeeting(meeting: Omit<TeamMeeting, 'createdAt' | 'updatedAt'>): Promise<TeamMeeting> {
    try {
      const meetings = await this.getTeamMeetings();
      const now = new Date();
      
      const newMeeting: TeamMeeting = {
        ...meeting,
        createdAt: now,
        updatedAt: now
      };

      const existingIndex = meetings.findIndex(m => m.id === meeting.id);
      
      if (existingIndex >= 0) {
        meetings[existingIndex] = { ...newMeeting, createdAt: meetings[existingIndex].createdAt };
      } else {
        meetings.push(newMeeting);
      }

      await this.saveTeamMeetings(meetings);
      return newMeeting;
    } catch (error) {
      logger.error('Error saving team meeting:', error);
      throw error;
    }
  }

  async updateTeamMeeting(id: string, updates: Partial<TeamMeeting>): Promise<TeamMeeting> {
    try {
      const meetings = await this.getTeamMeetings();
      const index = meetings.findIndex(m => m.id === id);
      
      if (index === -1) {
        throw new Error('Team meeting not found');
      }

      meetings[index] = {
        ...meetings[index],
        ...updates,
        updatedAt: new Date()
      };

      await this.saveTeamMeetings(meetings);
      return meetings[index];
    } catch (error) {
      logger.error('Error updating team meeting:', error);
      throw error;
    }
  }

  async deleteTeamMeeting(id: string): Promise<void> {
    try {
      const meetings = await this.getTeamMeetings();
      const filteredMeetings = meetings.filter(m => m.id !== id);
      await this.saveTeamMeetings(filteredMeetings);
    } catch (error) {
      logger.error('Error deleting team meeting:', error);
      throw error;
    }
  }

  async getTeamStatistics(): Promise<{
    totalMembers: number;
    activeMembers: number;
    byRole: Record<TeamMember['role'], number>;
    byDepartment: Record<string, number>;
    byStatus: Record<TeamMember['status'], number>;
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    totalMeetings: number;
    upcomingMeetings: number;
    averageCollaborationScore: number;
    averageComplianceScore: number;
  }> {
    try {
      const [teamMembers, tasks, meetings] = await Promise.all([
        this.getTeamMembers(),
        this.getTeamTasks(),
        this.getTeamMeetings()
      ]);
      
      const byRole = teamMembers.reduce((acc, member) => {
        acc[member.role] = (acc[member.role] || 0) + 1;
        return acc;
      }, {} as Record<TeamMember['role'], number>);

      const byDepartment = teamMembers.reduce((acc, member) => {
        acc[member.department] = (acc[member.department] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const byStatus = teamMembers.reduce((acc, member) => {
        acc[member.status] = (acc[member.status] || 0) + 1;
        return acc;
      }, {} as Record<TeamMember['status'], number>);

      const activeMembers = teamMembers.filter(m => m.status === 'active').length;
      const completedTasks = tasks.filter(t => t.status === 'completed').length;
      const overdueTasks = tasks.filter(t => t.status !== 'completed' && new Date(t.dueDate) < new Date()).length;
      const upcomingMeetings = meetings.filter(m => m.status === 'scheduled' && new Date(m.scheduledDate) > new Date()).length;

      const averageCollaborationScore = teamMembers.length > 0 
        ? teamMembers.reduce((sum, member) => sum + member.performanceMetrics.collaborationScore, 0) / teamMembers.length
        : 0;

      const averageComplianceScore = teamMembers.length > 0 
        ? teamMembers.reduce((sum, member) => sum + member.performanceMetrics.complianceScore, 0) / teamMembers.length
        : 0;

      return {
        totalMembers: teamMembers.length,
        activeMembers,
        byRole,
        byDepartment,
        byStatus,
        totalTasks: tasks.length,
        completedTasks,
        overdueTasks,
        totalMeetings: meetings.length,
        upcomingMeetings,
        averageCollaborationScore,
        averageComplianceScore
      };
    } catch (error) {
      logger.error('Error calculating team statistics:', error);
      return {
        totalMembers: 0,
        activeMembers: 0,
        byRole: {} as Record<TeamMember['role'], number>,
        byDepartment: {},
        byStatus: {} as Record<TeamMember['status'], number>,
        totalTasks: 0,
        completedTasks: 0,
        overdueTasks: 0,
        totalMeetings: 0,
        upcomingMeetings: 0,
        averageCollaborationScore: 0,
        averageComplianceScore: 0
      };
    }
  }

  async generateDefaultTeam(): Promise<TeamMember[]> {
    try {
      const now = new Date();
      const defaultMembers: TeamMember[] = [
        {
          id: 'member-001',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@company.com',
          role: 'CISO',
          department: 'Information Security',
          organization: 'Company Inc.',
          phone: '+1-555-0101',
          status: 'active',
          permissions: ['admin', 'read', 'write', 'delete', 'manage-users'],
          lastActive: now,
          joinedDate: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
          skills: ['Cybersecurity Strategy', 'Risk Management', 'Compliance', 'Leadership'],
          certifications: ['CISSP', 'CISM', 'CISA'],
          responsibilities: ['Overall security strategy', 'Risk management', 'Compliance oversight'],
          assignedControls: [],
          assignedPolicies: [],
          assignedEvidence: [],
          performanceMetrics: {
            tasksCompleted: 45,
            tasksOverdue: 2,
            collaborationScore: 95,
            complianceScore: 98,
            lastUpdated: now
          },
          notifications: [],
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'member-002',
          name: 'Mike Chen',
          email: 'mike.chen@company.com',
          role: 'Compliance Officer',
          department: 'Compliance',
          organization: 'Company Inc.',
          phone: '+1-555-0102',
          status: 'active',
          permissions: ['read', 'write', 'compliance'],
          lastActive: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
          joinedDate: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000), // 6 months ago
          skills: ['Compliance Management', 'Audit', 'Policy Development', 'CMMC'],
          certifications: ['CISA', 'CMMC-AB'],
          responsibilities: ['CMMC compliance', 'Policy management', 'Audit coordination'],
          assignedControls: [],
          assignedPolicies: [],
          assignedEvidence: [],
          performanceMetrics: {
            tasksCompleted: 38,
            tasksOverdue: 1,
            collaborationScore: 88,
            complianceScore: 92,
            lastUpdated: now
          },
          notifications: [],
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'member-003',
          name: 'Emily Rodriguez',
          email: 'emily.rodriguez@company.com',
          role: 'Implementation Team',
          department: 'IT Security',
          organization: 'Company Inc.',
          phone: '+1-555-0103',
          status: 'active',
          permissions: ['read', 'write', 'implement'],
          lastActive: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
          joinedDate: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000), // 3 months ago
          skills: ['Security Implementation', 'System Administration', 'Network Security'],
          certifications: ['Security+', 'CCNA'],
          responsibilities: ['Control implementation', 'System configuration', 'Security monitoring'],
          assignedControls: [],
          assignedPolicies: [],
          assignedEvidence: [],
          performanceMetrics: {
            tasksCompleted: 52,
            tasksOverdue: 3,
            collaborationScore: 91,
            complianceScore: 89,
            lastUpdated: now
          },
          notifications: [],
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'member-004',
          name: 'Alex Thompson',
          email: 'alex.thompson@company.com',
          role: 'Domain Expert',
          department: 'IT Operations',
          organization: 'Company Inc.',
          phone: '+1-555-0104',
          status: 'active',
          permissions: ['read', 'write', 'expert'],
          lastActive: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
          joinedDate: new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000), // 4 months ago
          skills: ['Network Architecture', 'Cloud Security', 'Incident Response'],
          certifications: ['CCSP', 'CISSP'],
          responsibilities: ['Technical expertise', 'Architecture review', 'Incident response'],
          assignedControls: [],
          assignedPolicies: [],
          assignedEvidence: [],
          performanceMetrics: {
            tasksCompleted: 41,
            tasksOverdue: 0,
            collaborationScore: 94,
            complianceScore: 95,
            lastUpdated: now
          },
          notifications: [],
          createdAt: now,
          updatedAt: now
        }
      ];

      // Save all members
      for (const member of defaultMembers) {
        await this.saveTeamMember(member);
      }

      return defaultMembers;
    } catch (error) {
      logger.error('Error generating default team:', error);
      return [];
    }
  }

  async sendNotification(memberId: string, notification: Omit<TeamNotification, 'id' | 'createdAt'>): Promise<TeamNotification> {
    try {
      const member = await this.getTeamMember(memberId);
      if (!member) {
        throw new Error('Team member not found');
      }

      const newNotification: TeamNotification = {
        ...notification,
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date()
      };

      member.notifications.push(newNotification);
      await this.updateTeamMember(memberId, { notifications: member.notifications });

      return newNotification;
    } catch (error) {
      logger.error('Error sending notification:', error);
      throw error;
    }
  }

  async markNotificationAsRead(memberId: string, notificationId: string): Promise<void> {
    try {
      const member = await this.getTeamMember(memberId);
      if (!member) {
        throw new Error('Team member not found');
      }

      const notification = member.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.isRead = true;
        await this.updateTeamMember(memberId, { notifications: member.notifications });
      }
    } catch (error) {
      logger.error('Error marking notification as read:', error);
      throw error;
    }
  }

  private async saveTeamMembers(members: TeamMember[]): Promise<void> {
    try {
      const data = dataService.getData();
      data.teamMembers = members;
      await dataService.saveData(data);
    } catch (error) {
      logger.error('Error saving team members:', error);
      throw error;
    }
  }

  private async saveTeamTasks(tasks: TeamTask[]): Promise<void> {
    try {
      const data = dataService.getData();
      data.teamTasks = tasks;
      await dataService.saveData(data);
    } catch (error) {
      logger.error('Error saving team tasks:', error);
      throw error;
    }
  }

  private async saveTeamMeetings(meetings: TeamMeeting[]): Promise<void> {
    try {
      const data = dataService.getData();
      data.teamMeetings = meetings;
      await dataService.saveData(data);
    } catch (error) {
      logger.error('Error saving team meetings:', error);
      throw error;
    }
  }
}

export const teamService = TeamService.getInstance();