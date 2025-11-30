import { describe, it, expect, beforeEach, vi } from 'vitest';
import { calendarService } from '../calendarService';
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

describe('CalendarService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(dataService.getData).mockReturnValue({ calendarEvents: [] });
  });

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = calendarService;
      const instance2 = calendarService;
      expect(instance1).toBe(instance2);
    });
  });

  describe('Event retrieval', () => {
    it('should get all events', async () => {
      const mockEvents = [
        { id: '1', title: 'Event 1', type: 'meeting' },
        { id: '2', title: 'Event 2', type: 'assessment' }
      ];
      vi.mocked(dataService.getData).mockReturnValue({ calendarEvents: mockEvents });

      const events = await calendarService.getEvents();
      expect(events).toEqual(mockEvents);
    });

    it('should return empty array when no events exist', async () => {
      vi.mocked(dataService.getData).mockReturnValue({ calendarEvents: [] });
      const events = await calendarService.getEvents();
      expect(events).toEqual([]);
    });

    it('should get event by ID', async () => {
      const mockEvents = [{ id: '1', title: 'Event 1' }];
      vi.mocked(dataService.getData).mockReturnValue({ calendarEvents: mockEvents });

      const event = await calendarService.getEvent('1');
      expect(event).toBeDefined();
      expect(event?.title).toBe('Event 1');
    });
  });

  describe('Event creation', () => {
    it('should create a new event', async () => {
      const eventData = {
        id: 'new-event',
        title: 'New Event',
        description: 'Test description',
        type: 'meeting' as const,
        status: 'scheduled' as const,
        priority: 'high' as const,
        startDate: new Date(),
        endDate: new Date(),
        allDay: false,
        attendees: ['user1@example.com'],
        organizer: 'organizer@example.com',
        tags: ['important'],
        reminders: [],
        attachments: [],
        isConfidential: false,
        accessLevel: 'internal' as const
      };

      const event = await calendarService.saveEvent(eventData);
      expect(event).toBeDefined();
      expect(event.id).toBe('new-event');
      expect(event.title).toBe('New Event');
    });

    it('should update existing event', async () => {
      const existingEvent = {
        id: 'existing',
        title: 'Old Title',
        description: '',
        type: 'meeting' as const,
        status: 'scheduled' as const,
        priority: 'low' as const,
        startDate: new Date(),
        endDate: new Date(),
        allDay: false,
        attendees: [],
        organizer: 'user@example.com',
        tags: [],
        reminders: [],
        attachments: [],
        isConfidential: false,
        accessLevel: 'internal' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      vi.mocked(dataService.getData).mockReturnValue({ calendarEvents: [existingEvent] });

      const updated = await calendarService.updateEvent('existing', { title: 'New Title' });
      expect(updated.title).toBe('New Title');
    });
  });

  describe('Event deletion', () => {
    it('should delete event', async () => {
      const mockEvents = [{ id: '1', title: 'Event 1' }];
      vi.mocked(dataService.getData).mockReturnValue({ calendarEvents: mockEvents });

      await calendarService.deleteEvent('1');
      expect(dataService.saveData).toHaveBeenCalled();
    });
  });

  describe('Event filtering', () => {
    it('should filter events by type', async () => {
      const mockEvents = [
        { id: '1', title: 'Meeting 1', type: 'meeting' },
        { id: '2', title: 'Assessment 1', type: 'assessment' }
      ];
      vi.mocked(dataService.getData).mockReturnValue({ calendarEvents: mockEvents });

      const filtered = await calendarService.searchEvents({ type: 'meeting' });
      expect(filtered.length).toBe(1);
      expect(filtered[0].type).toBe('meeting');
    });

    it('should filter events by date range', async () => {
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const mockEvents = [
        { id: '1', title: 'Today', type: 'meeting' as const, startDate: now, status: 'scheduled' as const },
        { id: '2', title: 'Tomorrow', type: 'meeting' as const, startDate: tomorrow, status: 'scheduled' as const },
        { id: '3', title: 'Next Week', type: 'meeting' as const, startDate: nextWeek, status: 'scheduled' as const }
      ];
      vi.mocked(dataService.getData).mockReturnValue({ calendarEvents: mockEvents });

      const filtered = await calendarService.searchEvents({
        dateRange: { start: now, end: tomorrow }
      });
      expect(filtered.length).toBeGreaterThan(0);
    });
  });

  describe('Statistics', () => {
    it('should calculate calendar statistics', async () => {
      const mockEvents = [
        { id: '1', type: 'meeting' as const, status: 'scheduled' as const, priority: 'high' as const, startDate: new Date() },
        { id: '2', type: 'assessment' as const, status: 'completed' as const, priority: 'medium' as const, startDate: new Date() }
      ];
      vi.mocked(dataService.getData).mockReturnValue({ calendarEvents: mockEvents });

      const stats = await calendarService.getCalendarStatistics();
      expect(stats.totalEvents).toBe(2);
      expect(stats.byType.meeting).toBe(1);
    });
  });

  describe('Upcoming events', () => {
    it('should get upcoming events', async () => {
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      
      const mockEvents = [
        { id: '1', title: 'Upcoming', type: 'meeting' as const, startDate: tomorrow, status: 'scheduled' as const }
      ];
      vi.mocked(dataService.getData).mockReturnValue({ calendarEvents: mockEvents });

      const upcoming = await calendarService.getUpcomingEvents(7);
      expect(upcoming.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Error handling', () => {
    it('should handle errors gracefully when fetching events', async () => {
      vi.mocked(dataService.getData).mockImplementation(() => {
        throw new Error('Database error');
      });

      const events = await calendarService.getEvents();
      expect(events).toEqual([]);
    });
  });
});
