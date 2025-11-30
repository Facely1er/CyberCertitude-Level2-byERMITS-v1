import { dataService } from './dataService';
import { logger } from '../utils/logger';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  type: 'assessment' | 'review' | 'training' | 'meeting' | 'audit' | 'deadline' | 'milestone' | 'compliance-check' | 'incident-response' | 'maintenance';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'postponed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  location?: string;
  attendees: string[];
  organizer: string;
  relatedControl?: string;
  relatedPolicy?: string;
  relatedEvidence?: string;
  tags: string[];
  reminders: EventReminder[];
  recurrence?: EventRecurrence;
  notes?: string;
  attachments: string[];
  isConfidential: boolean;
  accessLevel: 'public' | 'internal' | 'confidential' | 'restricted';
  createdAt: Date;
  updatedAt: Date;
}

interface EventReminder {
  id: string;
  type: 'email' | 'popup' | 'sms';
  minutesBefore: number;
  isEnabled: boolean;
}

interface EventRecurrence {
  pattern: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  daysOfWeek?: number[]; // 0 = Sunday, 1 = Monday, etc.
  dayOfMonth?: number;
  endDate?: Date;
  occurrences?: number;
}

export interface CalendarFilters {
  type?: string;
  status?: string;
  priority?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
  organizer?: string;
}

export class CalendarService {
  private static instance: CalendarService;
  private readonly STORAGE_KEY = 'cybersecurity-calendar';

  static getInstance(): CalendarService {
    if (!CalendarService.instance) {
      CalendarService.instance = new CalendarService();
    }
    return CalendarService.instance;
  }

  async getEvents(): Promise<CalendarEvent[]> {
    try {
      const data = dataService.getData();
      return data.calendarEvents || [];
    } catch (error) {
      logger.error('Error fetching calendar events:', error);
      return [];
    }
  }

  async getEvent(id: string): Promise<CalendarEvent | null> {
    try {
      const events = await this.getEvents();
      return events.find(event => event.id === id) || null;
    } catch (error) {
      logger.error('Error fetching calendar event:', error);
      return null;
    }
  }

  async saveEvent(event: Omit<CalendarEvent, 'createdAt' | 'updatedAt'>): Promise<CalendarEvent> {
    try {
      const events = await this.getEvents();
      const now = new Date();
      
      const newEvent: CalendarEvent = {
        ...event,
        createdAt: now,
        updatedAt: now
      };

      const existingIndex = events.findIndex(e => e.id === event.id);
      
      if (existingIndex >= 0) {
        events[existingIndex] = { ...newEvent, createdAt: events[existingIndex].createdAt };
      } else {
        events.push(newEvent);
      }

      await this.saveEvents(events);
      return newEvent;
    } catch (error) {
      logger.error('Error saving calendar event:', error);
      throw error;
    }
  }

  async updateEvent(id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> {
    try {
      const events = await this.getEvents();
      const index = events.findIndex(e => e.id === id);
      
      if (index === -1) {
        throw new Error('Calendar event not found');
      }

      events[index] = {
        ...events[index],
        ...updates,
        updatedAt: new Date()
      };

      await this.saveEvents(events);
      return events[index];
    } catch (error) {
      logger.error('Error updating calendar event:', error);
      throw error;
    }
  }

  async deleteEvent(id: string): Promise<void> {
    try {
      const events = await this.getEvents();
      const filteredEvents = events.filter(e => e.id !== id);
      await this.saveEvents(filteredEvents);
    } catch (error) {
      logger.error('Error deleting calendar event:', error);
      throw error;
    }
  }

  async searchEvents(filters: CalendarFilters): Promise<CalendarEvent[]> {
    try {
      let events = await this.getEvents();

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        events = events.filter(event =>
          event.title.toLowerCase().includes(searchTerm) ||
          event.description.toLowerCase().includes(searchTerm) ||
          event.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }

      if (filters.type && filters.type !== 'all') {
        events = events.filter(event => event.type === filters.type);
      }

      if (filters.status && filters.status !== 'all') {
        events = events.filter(event => event.status === filters.status);
      }

      if (filters.priority && filters.priority !== 'all') {
        events = events.filter(event => event.priority === filters.priority);
      }

      if (filters.organizer && filters.organizer !== 'all') {
        events = events.filter(event => event.organizer === filters.organizer);
      }

      if (filters.dateRange) {
        events = events.filter(event => 
          event.startDate >= filters.dateRange!.start && 
          event.startDate <= filters.dateRange!.end
        );
      }

      return events;
    } catch (error) {
      logger.error('Error searching calendar events:', error);
      return [];
    }
  }

  async getEventsByDateRange(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    try {
      const events = await this.getEvents();
      return events.filter(event => 
        event.startDate >= startDate && event.startDate <= endDate
      );
    } catch (error) {
      logger.error('Error fetching events by date range:', error);
      return [];
    }
  }

  async getEventsByType(type: CalendarEvent['type']): Promise<CalendarEvent[]> {
    try {
      const events = await this.getEvents();
      return events.filter(event => event.type === type);
    } catch (error) {
      logger.error('Error fetching events by type:', error);
      return [];
    }
  }

  async getUpcomingEvents(days: number = 7): Promise<CalendarEvent[]> {
    try {
      const events = await this.getEvents();
      const now = new Date();
      const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
      
      return events.filter(event => 
        event.startDate >= now && 
        event.startDate <= futureDate &&
        event.status === 'scheduled'
      ).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    } catch (error) {
      logger.error('Error fetching upcoming events:', error);
      return [];
    }
  }

  async getOverdueEvents(): Promise<CalendarEvent[]> {
    try {
      const events = await this.getEvents();
      const now = new Date();
      
      return events.filter(event => 
        event.endDate < now && 
        event.status !== 'completed' && 
        event.status !== 'cancelled'
      ).sort((a, b) => a.endDate.getTime() - b.endDate.getTime());
    } catch (error) {
      logger.error('Error fetching overdue events:', error);
      return [];
    }
  }

  async getCalendarStatistics(): Promise<{
    totalEvents: number;
    byType: Record<CalendarEvent['type'], number>;
    byStatus: Record<CalendarEvent['status'], number>;
    byPriority: Record<CalendarEvent['priority'], number>;
    upcomingEvents: number;
    overdueEvents: number;
    thisWeekEvents: number;
    thisMonthEvents: number;
  }> {
    try {
      const events = await this.getEvents();
      const now = new Date();
      
      const byType = events.reduce((acc, event) => {
        acc[event.type] = (acc[event.type] || 0) + 1;
        return acc;
      }, {} as Record<CalendarEvent['type'], number>);

      const byStatus = events.reduce((acc, event) => {
        acc[event.status] = (acc[event.status] || 0) + 1;
        return acc;
      }, {} as Record<CalendarEvent['status'], number>);

      const byPriority = events.reduce((acc, event) => {
        acc[event.priority] = (acc[event.priority] || 0) + 1;
        return acc;
      }, {} as Record<CalendarEvent['priority'], number>);

      const upcomingEvents = events.filter(event => 
        event.startDate >= now && event.status === 'scheduled'
      ).length;

      const overdueEvents = events.filter(event => 
        event.endDate < now && 
        event.status !== 'completed' && 
        event.status !== 'cancelled'
      ).length;

      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const thisWeekEvents = events.filter(event => 
        event.startDate >= weekStart && event.startDate <= weekEnd
      ).length;

      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const thisMonthEvents = events.filter(event => 
        event.startDate >= monthStart && event.startDate <= monthEnd
      ).length;

      return {
        totalEvents: events.length,
        byType,
        byStatus,
        byPriority,
        upcomingEvents,
        overdueEvents,
        thisWeekEvents,
        thisMonthEvents
      };
    } catch (error) {
      logger.error('Error calculating calendar statistics:', error);
      return {
        totalEvents: 0,
        byType: {} as Record<CalendarEvent['type'], number>,
        byStatus: {} as Record<CalendarEvent['status'], number>,
        byPriority: {} as Record<CalendarEvent['priority'], number>,
        upcomingEvents: 0,
        overdueEvents: 0,
        thisWeekEvents: 0,
        thisMonthEvents: 0
      };
    }
  }

  async generateDefaultEvents(): Promise<CalendarEvent[]> {
    try {
      const now = new Date();
      const defaultEvents: CalendarEvent[] = [
        {
          id: 'event-001',
          title: 'CMMC Assessment Review',
          description: 'Quarterly review of CMMC 2.0 Level 2 compliance status and control implementation progress',
          type: 'assessment',
          status: 'scheduled',
          priority: 'high',
          startDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
          endDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours duration
          allDay: false,
          location: 'Conference Room A',
          attendees: ['sarah.johnson@company.com', 'mike.chen@company.com'],
          organizer: 'sarah.johnson@company.com',
          relatedControl: 'AC.1.001',
          tags: ['assessment', 'compliance', 'quarterly'],
          reminders: [
            { id: 'rem-001', type: 'email', minutesBefore: 60, isEnabled: true },
            { id: 'rem-002', type: 'popup', minutesBefore: 15, isEnabled: true }
          ],
          attachments: [],
          isConfidential: true,
          accessLevel: 'confidential',
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'event-002',
          title: 'Security Awareness Training',
          description: 'Monthly security awareness training session for all employees',
          type: 'training',
          status: 'scheduled',
          priority: 'medium',
          startDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
          endDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 1 hour duration
          allDay: false,
          location: 'Training Room',
          attendees: ['all-employees@company.com'],
          organizer: 'emily.rodriguez@company.com',
          tags: ['training', 'awareness', 'monthly'],
          reminders: [
            { id: 'rem-003', type: 'email', minutesBefore: 1440, isEnabled: true }, // 1 day before
            { id: 'rem-004', type: 'popup', minutesBefore: 30, isEnabled: true }
          ],
          attachments: [],
          isConfidential: false,
          accessLevel: 'internal',
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'event-003',
          title: 'Policy Review Meeting',
          description: 'Review and update cybersecurity policies and procedures',
          type: 'review',
          status: 'scheduled',
          priority: 'high',
          startDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000), // 3 weeks from now
          endDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000), // 1.5 hours duration
          allDay: false,
          location: 'Board Room',
          attendees: ['sarah.johnson@company.com', 'mike.chen@company.com', 'alex.thompson@company.com'],
          organizer: 'mike.chen@company.com',
          relatedPolicy: 'pol-001',
          tags: ['policy', 'review', 'governance'],
          reminders: [
            { id: 'rem-005', type: 'email', minutesBefore: 60, isEnabled: true },
            { id: 'rem-006', type: 'popup', minutesBefore: 15, isEnabled: true }
          ],
          attachments: [],
          isConfidential: true,
          accessLevel: 'confidential',
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'event-004',
          title: 'Evidence Collection Deadline',
          description: 'Deadline for submitting evidence for AC.1.001 control implementation',
          type: 'deadline',
          status: 'scheduled',
          priority: 'critical',
          startDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 1 month from now
          endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
          allDay: true,
          attendees: ['emily.rodriguez@company.com'],
          organizer: 'mike.chen@company.com',
          relatedControl: 'AC.1.001',
          relatedEvidence: 'ev-001',
          tags: ['deadline', 'evidence', 'compliance'],
          reminders: [
            { id: 'rem-007', type: 'email', minutesBefore: 10080, isEnabled: true }, // 1 week before
            { id: 'rem-008', type: 'email', minutesBefore: 1440, isEnabled: true }, // 1 day before
            { id: 'rem-009', type: 'popup', minutesBefore: 60, isEnabled: true }
          ],
          attachments: [],
          isConfidential: false,
          accessLevel: 'internal',
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'event-005',
          title: 'Monthly Security Standup',
          description: 'Weekly security team standup meeting to discuss ongoing projects and issues',
          type: 'meeting',
          status: 'scheduled',
          priority: 'medium',
          startDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          endDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000), // 30 minutes duration
          allDay: false,
          location: 'Security Team Room',
          attendees: ['sarah.johnson@company.com', 'emily.rodriguez@company.com', 'alex.thompson@company.com'],
          organizer: 'sarah.johnson@company.com',
          tags: ['meeting', 'standup', 'weekly'],
          reminders: [
            { id: 'rem-010', type: 'popup', minutesBefore: 15, isEnabled: true }
          ],
          recurrence: {
            pattern: 'weekly',
            interval: 1,
            daysOfWeek: [1], // Monday
            endDate: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
          },
          attachments: [],
          isConfidential: false,
          accessLevel: 'internal',
          createdAt: now,
          updatedAt: now
        }
      ];

      // Save all events
      for (const event of defaultEvents) {
        await this.saveEvent(event);
      }

      return defaultEvents;
    } catch (error) {
      logger.error('Error generating default events:', error);
      return [];
    }
  }

  async exportEvents(events: CalendarEvent[], format: 'csv' | 'pdf' | 'xlsx'): Promise<string> {
    try {
      if (format === 'csv') {
        const headers = ['ID', 'Title', 'Type', 'Status', 'Priority', 'Start Date', 'End Date', 'Location', 'Organizer', 'Attendees'];
        const rows = events.map(event => [
          event.id,
          event.title,
          event.type,
          event.status,
          event.priority,
          event.startDate.toLocaleDateString(),
          event.endDate.toLocaleDateString(),
          event.location || 'N/A',
          event.organizer,
          event.attendees.join('; ')
        ]);
        
        return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
      }
      
      // For PDF and XLSX, return a placeholder
      return `Generated ${format.toUpperCase()} export for ${events.length} events`;
    } catch (error) {
      logger.error('Error exporting events:', error);
      throw error;
    }
  }

  private async saveEvents(events: CalendarEvent[]): Promise<void> {
    try {
      const data = dataService.getData();
      data.calendarEvents = events;
      await dataService.saveData(data);
    } catch (error) {
      logger.error('Error saving calendar events:', error);
      throw error;
    }
  }
}

export const calendarService = CalendarService.getInstance();