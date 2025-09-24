/**
 * 📅 Calendar Service
 * Manages calendar events and scheduling for CMMC compliance
 */

import { logger } from '../utils/logger';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  type: 'assessment' | 'review' | 'training' | 'audit' | 'deadline' | 'meeting' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'overdue';
  assignedTo: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  reminder?: Date;
  location?: string;
  attendees?: string[];
  tags: string[];
  relatedAssessmentId?: string;
  relatedControlId?: string;
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  parentEventId?: string;
  notes?: string;
  attachments?: string[];
  color?: string;
  isAllDay: boolean;
  timezone: string;
}

export interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: Date;
  occurrences?: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  weekOfMonth?: number;
}

export interface CalendarFilters {
  startDate?: Date;
  endDate?: Date;
  type?: string[];
  priority?: string[];
  status?: string[];
  assignedTo?: string[];
  search?: string;
  tags?: string[];
}

export interface CalendarStatistics {
  totalEvents: number;
  upcomingEvents: number;
  overdueEvents: number;
  completedEvents: number;
  byType: Record<string, number>;
  byPriority: Record<string, number>;
  byStatus: Record<string, number>;
  thisWeek: number;
  thisMonth: number;
}

class CalendarService {
  private static instance: CalendarService;
  private events: CalendarEvent[] = [];

  private constructor() {
    this.loadEvents();
  }

  public static getInstance(): CalendarService {
    if (!CalendarService.instance) {
      CalendarService.instance = new CalendarService();
    }
    return CalendarService.instance;
  }

  private loadEvents(): void {
    try {
      const eventsData = localStorage.getItem('cmc_calendar_events');
      if (eventsData) {
        this.events = JSON.parse(eventsData).map((event: any) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
          reminder: event.reminder ? new Date(event.reminder) : undefined,
          endDate: event.endDate ? new Date(event.endDate) : undefined,
          createdAt: new Date(event.createdAt),
          updatedAt: new Date(event.updatedAt)
        }));
      } else {
        this.initializeDefaultEvents();
      }

      logger.debug('Calendar events loaded successfully', { count: this.events.length });
    } catch (error) {
      logger.error('Failed to load calendar events:', error);
      this.events = [];
      this.initializeDefaultEvents();
    }
  }

  private saveEvents(): void {
    try {
      localStorage.setItem('cmc_calendar_events', JSON.stringify(this.events));
      logger.debug('Calendar events saved successfully', { count: this.events.length });
    } catch (error) {
      logger.error('Failed to save calendar events:', error);
      throw new Error('Failed to save calendar events');
    }
  }

  private initializeDefaultEvents(): void {
    const now = new Date();
    const defaultEvents: CalendarEvent[] = [
      {
        id: 'event_assessment_001',
        title: 'CMMC Level 1 Assessment',
        description: 'Quarterly CMMC Level 1 compliance assessment',
        start: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        end: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours later
        type: 'assessment',
        priority: 'high',
        status: 'scheduled',
        assignedTo: ['IT Security Team'],
        createdBy: 'system',
        createdAt: now,
        updatedAt: now,
        reminder: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000), // 1 day before
        tags: ['cmmc', 'assessment', 'compliance'],
        isRecurring: true,
        recurrencePattern: {
          frequency: 'monthly',
          interval: 3,
          endDate: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
        },
        isAllDay: false,
        timezone: 'UTC'
      },
      {
        id: 'event_training_001',
        title: 'Security Awareness Training',
        description: 'Monthly security awareness training session',
        start: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        end: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 1 hour later
        type: 'training',
        priority: 'medium',
        status: 'scheduled',
        assignedTo: ['All Employees'],
        createdBy: 'system',
        createdAt: now,
        updatedAt: now,
        location: 'Conference Room A',
        attendees: ['hr@company.com', 'security@company.com'],
        tags: ['training', 'awareness', 'security'],
        isRecurring: true,
        recurrencePattern: {
          frequency: 'monthly',
          interval: 1
        },
        isAllDay: false,
        timezone: 'UTC'
      },
      {
        id: 'event_review_001',
        title: 'Control Review Meeting',
        description: 'Weekly review of security control implementations',
        start: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        end: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000), // 1.5 hours later
        type: 'review',
        priority: 'medium',
        status: 'scheduled',
        assignedTo: ['CISO', 'IT Security Team'],
        createdBy: 'system',
        createdAt: now,
        updatedAt: now,
        location: 'Meeting Room B',
        tags: ['review', 'controls', 'security'],
        isRecurring: true,
        recurrencePattern: {
          frequency: 'weekly',
          interval: 1,
          daysOfWeek: [1] // Monday
        },
        isAllDay: false,
        timezone: 'UTC'
      }
    ];

    this.events = defaultEvents;
    this.saveEvents();
  }

  public async getEvents(filters: CalendarFilters = {}): Promise<CalendarEvent[]> {
    let filteredEvents = [...this.events];

    if (filters.startDate) {
      filteredEvents = filteredEvents.filter(event => event.start >= filters.startDate!);
    }

    if (filters.endDate) {
      filteredEvents = filteredEvents.filter(event => event.end <= filters.endDate!);
    }

    if (filters.type && filters.type.length > 0) {
      filteredEvents = filteredEvents.filter(event => filters.type!.includes(event.type));
    }

    if (filters.priority && filters.priority.length > 0) {
      filteredEvents = filteredEvents.filter(event => filters.priority!.includes(event.priority));
    }

    if (filters.status && filters.status.length > 0) {
      filteredEvents = filteredEvents.filter(event => filters.status!.includes(event.status));
    }

    if (filters.assignedTo && filters.assignedTo.length > 0) {
      filteredEvents = filteredEvents.filter(event => 
        event.assignedTo.some(assignee => filters.assignedTo!.includes(assignee))
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredEvents = filteredEvents.filter(event => 
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      filteredEvents = filteredEvents.filter(event => 
        event.tags.some(tag => filters.tags!.includes(tag))
      );
    }

    return filteredEvents;
  }

  public async getEventById(id: string): Promise<CalendarEvent | null> {
    return this.events.find(event => event.id === id) || null;
  }

  public async getEventsByDateRange(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    return this.events.filter(event => 
      event.start >= startDate && event.end <= endDate
    );
  }

  public async getUpcomingEvents(days: number = 7): Promise<CalendarEvent[]> {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    
    return this.events.filter(event => 
      event.start >= now && event.start <= futureDate && event.status === 'scheduled'
    );
  }

  public async getOverdueEvents(): Promise<CalendarEvent[]> {
    const now = new Date();
    return this.events.filter(event => 
      event.end < now && event.status !== 'completed' && event.status !== 'cancelled'
    );
  }

  public async createEvent(eventData: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const now = new Date();
    const newEvent: CalendarEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: eventData.title || '',
      description: eventData.description || '',
      start: eventData.start || now,
      end: eventData.end || now,
      type: eventData.type || 'other',
      priority: eventData.priority || 'medium',
      status: eventData.status || 'scheduled',
      assignedTo: eventData.assignedTo || [],
      createdBy: eventData.createdBy || 'user',
      createdAt: now,
      updatedAt: now,
      reminder: eventData.reminder,
      location: eventData.location,
      attendees: eventData.attendees,
      tags: eventData.tags || [],
      relatedAssessmentId: eventData.relatedAssessmentId,
      relatedControlId: eventData.relatedControlId,
      isRecurring: eventData.isRecurring || false,
      recurrencePattern: eventData.recurrencePattern,
      parentEventId: eventData.parentEventId,
      notes: eventData.notes,
      attachments: eventData.attachments,
      color: eventData.color,
      isAllDay: eventData.isAllDay || false,
      timezone: eventData.timezone || 'UTC'
    };

    this.events.push(newEvent);
    this.saveEvents();

    logger.info('Calendar event created successfully', { 
      eventId: newEvent.id, 
      title: newEvent.title 
    });

    return newEvent;
  }

  public async updateEvent(id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const eventIndex = this.events.findIndex(event => event.id === id);
    if (eventIndex === -1) {
      throw new Error(`Event with id ${id} not found`);
    }

    const updatedEvent: CalendarEvent = {
      ...this.events[eventIndex],
      ...updates,
      updatedAt: new Date()
    };

    this.events[eventIndex] = updatedEvent;
    this.saveEvents();

    logger.info('Calendar event updated successfully', { 
      eventId: id, 
      title: updatedEvent.title 
    });

    return updatedEvent;
  }

  public async deleteEvent(id: string): Promise<void> {
    const eventIndex = this.events.findIndex(event => event.id === id);
    if (eventIndex === -1) {
      throw new Error(`Event with id ${id} not found`);
    }

    const deletedEvent = this.events[eventIndex];
    this.events.splice(eventIndex, 1);
    this.saveEvents();

    logger.info('Calendar event deleted successfully', { 
      eventId: id, 
      title: deletedEvent.title 
    });
  }

  public async getStatistics(): Promise<CalendarStatistics> {
    const now = new Date();
    const weekStart = new Date(now.getTime() - now.getDay() * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalEvents = this.events.length;
    const upcomingEvents = this.events.filter(e => e.start > now && e.status === 'scheduled').length;
    const overdueEvents = this.events.filter(e => e.end < now && e.status !== 'completed' && e.status !== 'cancelled').length;
    const completedEvents = this.events.filter(e => e.status === 'completed').length;

    const byType = this.events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byPriority = this.events.reduce((acc, event) => {
      acc[event.priority] = (acc[event.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byStatus = this.events.reduce((acc, event) => {
      acc[event.status] = (acc[event.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const thisWeek = this.events.filter(e => e.start >= weekStart && e.start <= now).length;
    const thisMonth = this.events.filter(e => e.start >= monthStart && e.start <= now).length;

    return {
      totalEvents,
      upcomingEvents,
      overdueEvents,
      completedEvents,
      byType,
      byPriority,
      byStatus,
      thisWeek,
      thisMonth
    };
  }

  public async exportEvents(): Promise<string> {
    try {
      const exportData = {
        events: this.events,
        exportedAt: new Date().toISOString(),
        version: '1.0.0'
      };
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      logger.error('Failed to export calendar events:', error);
      throw new Error('Failed to export calendar events');
    }
  }

  public async importEvents(data: string): Promise<{ success: number; errors: string[] }> {
    try {
      const importedData = JSON.parse(data);
      const results = { success: 0, errors: [] as string[] };

      if (importedData.events && Array.isArray(importedData.events)) {
        importedData.events.forEach((eventData: any) => {
          try {
            const event: CalendarEvent = {
              ...eventData,
              id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              start: new Date(eventData.start),
              end: new Date(eventData.end),
              reminder: eventData.reminder ? new Date(eventData.reminder) : undefined,
              endDate: eventData.endDate ? new Date(eventData.endDate) : undefined,
              createdAt: new Date(),
              updatedAt: new Date()
            };

            this.events.push(event);
            results.success++;
          } catch (error) {
            results.errors.push(`Event ${eventData.title}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        });

        this.saveEvents();
      }

      logger.info('Calendar events import completed', { 
        success: results.success, 
        errors: results.errors.length 
      });

      return results;
    } catch (error) {
      logger.error('Failed to import calendar events:', error);
      throw new Error(`Failed to import calendar events: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const calendarService = CalendarService.getInstance();