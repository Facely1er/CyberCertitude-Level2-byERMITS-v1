import { describe, it, expect, beforeEach, vi } from 'vitest';
import { teamService } from '../teamService';
import { dataService } from '../dataService';

vi.mock('../dataService', () => ({
  dataService: {
    getData: vi.fn(),
    saveData: vi.fn()
  }
}));

vi.mock('../../utils/logger', () => ({
  logger: {
    error: vi.fn(),
    debug: vi.fn()
  }
}));

describe('TeamService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(dataService.getData).mockReturnValue({ teamMembers: [] });
  });

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = teamService;
      const instance2 = teamService;
      expect(instance1).toBe(instance2);
    });
  });

  describe('Team member retrieval', () => {
    it('should get all team members', async () => {
      const mockMembers = [
        { id: '1', name: 'Member 1', role: 'CISO' },
        { id: '2', name: 'Member 2', role: 'admin' }
      ];
      vi.mocked(dataService.getData).mockReturnValue({ teamMembers: mockMembers });

      const members = await teamService.getTeamMembers();
      expect(members).toEqual(mockMembers);
    });

    it('should get team member by ID', async () => {
      const mockMembers = [{ id: '1', name: 'Member 1' }];
      vi.mocked(dataService.getData).mockReturnValue({ teamMembers: mockMembers });

      const member = await teamService.getTeamMember('1');
      expect(member).toBeDefined();
      expect(member?.name).toBe('Member 1');
    });
  });

  describe('Team member creation', () => {
    it('should save team member', async () => {
      const memberData = {
        id: 'new-member',
        name: 'New Member',
        email: 'member@example.com',
        role: 'Implementation Team' as const,
        department: 'IT',
        organization: 'Company',
        status: 'active' as const,
        permissions: ['read', 'write'],
        lastActive: new Date(),
        joinedDate: new Date(),
        skills: ['JavaScript'],
        certifications: [],
        responsibilities: [],
        assignedControls: [],
        assignedPolicies: [],
        assignedEvidence: [],
        performanceMetrics: {
          tasksCompleted: 0,
          tasksOverdue: 0,
          collaborationScore: 0,
          complianceScore: 0,
          lastUpdated: new Date()
        },
        notifications: []
      };

      const member = await teamService.saveTeamMember(memberData);
      expect(member).toBeDefined();
      expect(member.id).toBe('new-member');
    });
  });

  describe('Team tasks', () => {
    it('should get team tasks', async () => {
      vi.mocked(dataService.getData).mockReturnValue({ teamTasks: [] });
      const tasks = await teamService.getTeamTasks();
      expect(tasks).toEqual([]);
    });

    it('should save team task', async () => {
      const taskData = {
        id: 'task-1',
        title: 'New Task',
        description: 'Task description',
        type: 'control-implementation' as const,
        priority: 'high' as const,
        status: 'in-progress' as const,
        assignedTo: ['member-1'],
        createdBy: 'admin',
        dueDate: new Date(),
        progress: 50,
        tags: [],
        comments: [],
        attachments: [],
        estimatedHours: 10,
        actualHours: 5
      };

      const task = await teamService.saveTeamTask(taskData);
      expect(task).toBeDefined();
      expect(task.id).toBe('task-1');
    });
  });

  describe('Team meetings', () => {
    it('should get team meetings', async () => {
      vi.mocked(dataService.getData).mockReturnValue({ teamMeetings: [] });
      const meetings = await teamService.getTeamMeetings();
      expect(meetings).toEqual([]);
    });

    it('should save team meeting', async () => {
      const meetingData = {
        id: 'meeting-1',
        title: 'Team Meeting',
        description: 'Monthly standup',
        type: 'standup' as const,
        attendees: ['member-1'],
        organizer: 'admin',
        scheduledDate: new Date(),
        duration: 30,
        location: 'Room A',
        agenda: ['Item 1'],
        status: 'scheduled' as const,
        actionItems: []
      };

      const meeting = await teamService.saveTeamMeeting(meetingData);
      expect(meeting).toBeDefined();
      expect(meeting.id).toBe('meeting-1');
    });
  });

  describe('Statistics', () => {
    it('should calculate team statistics', async () => {
      vi.mocked(dataService.getData).mockReturnValue({
        teamMembers: [{ id: '1', status: 'active' }],
        teamTasks: [{ id: '1', status: 'completed' }],
        teamMeetings: []
      });

      const stats = await teamService.getTeamStatistics();
      expect(stats.totalMembers).toBe(1);
      expect(stats.activeMembers).toBe(1);
    });
  });

  describe('Error handling', () => {
    it('should handle errors gracefully', async () => {
      vi.mocked(dataService.getData).mockImplementation(() => {
        throw new Error('Database error');
      });

      const members = await teamService.getTeamMembers();
      expect(members).toEqual([]);
    });
  });
});
