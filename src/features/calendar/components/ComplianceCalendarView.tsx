import React, { useState, useEffect } from 'react';
import { Calendar, Clock, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Plus, Search, ListFilter as Filter, RefreshCw, Download, Target, Users, FileText, Shield, Activity } from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { useInternalLinking } from '@/shared/hooks/useInternalLinking';
import { calendarService, CalendarEvent, CalendarFilters } from '@/services/calendarService';
import { logger } from '@/utils/logger';

interface ComplianceCalendarViewProps {
  onBack: () => void;
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

const ComplianceCalendarView: React.FC<ComplianceCalendarViewProps> = ({
  onBack: _onBack,
  addNotification
}) => {
  const { breadcrumbs } = useInternalLinking();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'list'>('month');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [events, searchTerm, filterType, filterStatus, filterPriority]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [eventsData, stats] = await Promise.all([
        calendarService.getEvents(),
        calendarService.getCalendarStatistics()
      ]);
      
      setEvents(eventsData);
      setStatistics(stats);
    } catch (error) {
      addNotification('error', 'Failed to load calendar data');
      logger.error('Error loading calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      const filters: CalendarFilters = {
        search: searchTerm || undefined,
        type: filterType !== 'all' ? filterType as CalendarEvent['type'] : undefined,
        status: filterStatus !== 'all' ? filterStatus as CalendarEvent['status'] : undefined,
        priority: filterPriority !== 'all' ? filterPriority as CalendarEvent['priority'] : undefined
      };
      
      const filtered = await calendarService.searchEvents(filters);
      setFilteredEvents(filtered);
    } catch (error) {
      logger.error('Error applying filters:', error);
      setFilteredEvents(events);
    }
  };

  const handleGenerateDefaultEvents = async () => {
    try {
      const defaultEvents = await calendarService.generateDefaultEvents();
      await loadData();
      addNotification('success', `Generated ${defaultEvents.length} default calendar events`);
    } catch (error) {
      addNotification('error', 'Failed to generate default events');
      logger.error('Error generating default events:', error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await calendarService.deleteEvent(eventId);
        await loadData();
        addNotification('success', 'Event deleted successfully');
      } catch (error) {
        addNotification('error', 'Failed to delete event');
        logger.error('Error deleting event:', error);
      }
    }
  };

  const handleStatusChange = async (eventId: string, newStatus: CalendarEvent['status']) => {
    try {
      await calendarService.updateEvent(eventId, { status: newStatus });
      await loadData();
      addNotification('success', 'Event status updated successfully');
    } catch (error) {
      addNotification('error', 'Failed to update event status');
      logger.error('Error updating event status:', error);
    }
  };

  const handleExportEvents = async () => {
    try {
      const csvContent = await calendarService.exportEvents(filteredEvents, 'csv');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `calendar-events-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addNotification('success', 'Events exported successfully');
    } catch (error) {
      addNotification('error', 'Failed to export events');
      logger.error('Error exporting events:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" message="Loading calendar data..." />
        </div>
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'assessment': return 'text-primary-600 dark:text-primary-400';
      case 'review': return 'text-success-600 dark:text-success-400';
      case 'training': return 'text-purple-600 dark:text-purple-400';
      case 'meeting': return 'text-orange-600 dark:text-orange-400';
      case 'audit': return 'text-error-600 dark:text-error-400';
      case 'deadline': return 'text-yellow-600 dark:text-yellow-400';
      case 'milestone': return 'text-indigo-600 dark:text-indigo-400';
      case 'compliance-check': return 'text-pink-600 dark:text-pink-400';
      case 'incident-response': return 'text-cyan-600 dark:text-cyan-400';
      case 'maintenance': return 'text-teal-600 dark:text-teal-400';
      default: return 'text-text-secondary-light dark:text-text-muted-dark';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300';
      case 'in-progress': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'completed': return 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300';
      case 'cancelled': return 'bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-300';
      case 'postponed': return 'bg-support-light dark:bg-background-dark/30 text-text-primary-light dark:text-text-secondary-dark';
      default: return 'bg-support-light dark:bg-background-dark/30 text-text-primary-light dark:text-text-secondary-dark';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-error-600 dark:text-error-400';
      case 'high': return 'text-orange-600 dark:text-orange-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-success-600 dark:text-success-400';
      default: return 'text-text-secondary-light dark:text-text-muted-dark';
    }
  };

  const formatEventTime = (event: CalendarEvent) => {
    if (event.allDay) {
      return 'All Day';
    }
    
    const startTime = event.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTime = event.endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return `${startTime} - ${endTime}`;
  };

  const getUpcomingEvents = () => {
    return filteredEvents
      .filter(event => event.startDate >= new Date() && event.status === 'scheduled')
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
      .slice(0, 5);
  };

  const getOverdueEvents = () => {
    return filteredEvents
      .filter(event => event.endDate < new Date() && event.status !== 'completed' && event.status !== 'cancelled')
      .sort((a, b) => a.endDate.getTime() - b.endDate.getTime());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Header */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
                <Calendar className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  Calendar
                </h1>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  Manage compliance events, deadlines, and activities
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleGenerateDefaultEvents}
                className="flex items-center space-x-2 bg-success-600 text-white px-4 py-2 rounded-lg hover:bg-success-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Generate Default Events</span>
              </button>
              <button
                onClick={() => addNotification('info', 'Event creation is available through the event editor')}
                className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Event</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-lg border border-support-light dark:border-support-dark">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary-light dark:text-text-muted-dark">Total Events</p>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{statistics.totalEvents}</p>
              </div>
              <Calendar className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
          </div>

          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-lg border border-support-light dark:border-support-dark">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary-light dark:text-text-muted-dark">Upcoming Events</p>
                <p className="text-3xl font-bold text-success-600 dark:text-success-400">{statistics.upcomingEvents}</p>
              </div>
              <Clock className="w-8 h-8 text-success-600 dark:text-success-400" />
            </div>
          </div>

          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-lg border border-support-light dark:border-support-dark">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary-light dark:text-text-muted-dark">Overdue Events</p>
                <p className="text-3xl font-bold text-error-600 dark:text-error-400">{statistics.overdueEvents}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-error-600 dark:text-error-400" />
            </div>
          </div>

          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-lg border border-support-light dark:border-support-dark">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary-light dark:text-text-muted-dark">This Week</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{statistics.thisWeekEvents}</p>
              </div>
              <Activity className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Upcoming Events */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-lg border border-support-light dark:border-support-dark">
          <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-success-600 dark:text-success-400" />
            Upcoming Events
          </h3>
          <div className="space-y-3">
            {getUpcomingEvents().map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-background-light dark:bg-surface-dark rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-text-primary-light dark:text-text-primary-dark">{event.title}</p>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    {event.startDate.toLocaleDateString()} • {formatEventTime(event)}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
              </div>
            ))}
            {getUpcomingEvents().length === 0 && (
              <p className="text-text-muted-light dark:text-text-muted-dark text-center py-4">No upcoming events</p>
            )}
          </div>
        </div>

        {/* Overdue Events */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-lg border border-support-light dark:border-support-dark">
          <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-error-600 dark:text-error-400" />
            Overdue Events
          </h3>
          <div className="space-y-3">
            {getOverdueEvents().map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-error-50 dark:bg-error-900/20 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-text-primary-light dark:text-text-primary-dark">{event.title}</p>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    Due: {event.endDate.toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
              </div>
            ))}
            {getOverdueEvents().length === 0 && (
              <p className="text-text-muted-light dark:text-text-muted-dark text-center py-4">No overdue events</p>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted-dark w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              aria-label="Filter by event type"
              className="px-4 py-3 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="assessment">Assessment</option>
              <option value="review">Review</option>
              <option value="training">Training</option>
              <option value="meeting">Meeting</option>
              <option value="audit">Audit</option>
              <option value="deadline">Deadline</option>
              <option value="milestone">Milestone</option>
              <option value="compliance-check">Compliance Check</option>
              <option value="incident-response">Incident Response</option>
              <option value="maintenance">Maintenance</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              aria-label="Filter by event status"
              className="px-4 py-3 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="postponed">Postponed</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              aria-label="Filter by event priority"
              className="px-4 py-3 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>

            <button
              onClick={handleExportEvents}
              className="flex items-center space-x-2 px-4 py-3 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark">
        <div className="p-6 border-b border-support-light dark:border-support-dark">
          <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
            Calendar Events ({filteredEvents.length})
          </h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="border border-support-light dark:border-support-dark rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                        {event.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status.replace('-', ' ')}
                      </span>
                      <span className={`font-medium ${getTypeColor(event.type)}`}>
                        {event.type.replace('-', ' ')}
                      </span>
                      <span className={`font-medium ${getPriorityColor(event.priority)}`}>
                        {event.priority}
                      </span>
                    </div>
                    
                    <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
                      {event.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Start Date:</span>
                        <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                          {event.startDate.toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Time:</span>
                        <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                          {formatEventTime(event)}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Location:</span>
                        <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                          {event.location || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Organizer:</span>
                        <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                          {event.organizer}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Attendees:</span>
                        <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                          {event.attendees.length} member(s)
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Access Level:</span>
                        <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                          {event.accessLevel}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Confidential:</span>
                        <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                          {event.isConfidential ? 'Yes' : 'No'}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Recurring:</span>
                        <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                          {event.recurrence ? 'Yes' : 'No'}
                        </div>
                      </div>
                    </div>

                    {event.tags && event.tags.length > 0 && (
                      <div className="mb-4">
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Tags:</span>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {event.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {event.relatedControl && (
                      <div className="mb-4">
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Related Control:</span>
                        <div className="font-medium text-text-primary-light dark:text-text-primary-dark">{event.relatedControl}</div>
                      </div>
                    )}

                    {event.relatedPolicy && (
                      <div className="mb-4">
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Related Policy:</span>
                        <div className="font-medium text-text-primary-light dark:text-text-primary-dark">{event.relatedPolicy}</div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      const eventDetails = `Event Details:

Title: ${event.title}
Description: ${event.description}
Type: ${event.type.replace('-', ' ')}
Status: ${event.status.replace('-', ' ')}
Priority: ${event.priority}
Start Date: ${event.startDate.toLocaleDateString()}
End Date: ${event.endDate.toLocaleDateString()}
Time: ${formatEventTime(event)}
Location: ${event.location || 'N/A'}
Organizer: ${event.organizer}
Attendees: ${event.attendees.join(', ')}
Access Level: ${event.accessLevel}
Confidential: ${event.isConfidential ? 'Yes' : 'No'}
Recurring: ${event.recurrence ? 'Yes' : 'No'}
Tags: ${event.tags.join(', ')}`;
                      
                      addNotification('info', eventDetails);
                    }}
                    className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  
                  <select
                    value={event.status}
                    onChange={(e) => handleStatusChange(event.id, e.target.value as CalendarEvent['status'])}
                    aria-label={`Change status for ${event.title}`}
                    className="px-4 py-2 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="postponed">Postponed</option>
                  </select>
                  
                  <button
                    onClick={() => addNotification('info', 'Event editing is available through the event editor')}
                    className="flex items-center space-x-2 bg-success-600 text-white px-4 py-2 rounded-lg hover:bg-success-700 transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="flex items-center space-x-2 bg-error-600 text-white px-4 py-2 rounded-lg hover:bg-error-700 transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-text-muted-dark mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                No Events Found
              </h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
                {searchTerm || filterType !== 'all' || filterStatus !== 'all' || filterPriority !== 'all'
                  ? 'No events match your current search and filter criteria. Try adjusting your filters.'
                  : 'No events have been created yet. Generate default events or create them manually.'}
              </p>
              {!searchTerm && filterType === 'all' && filterStatus === 'all' && filterPriority === 'all' && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleGenerateDefaultEvents}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Generate Default Events
                  </button>
                  <button
                    onClick={() => addNotification('info', 'Event creation is available through the event editor')}
                    className="border border-support-light dark:border-support-dark text-text-primary-light dark:text-text-secondary-dark px-6 py-3 rounded-lg hover:bg-background-light dark:hover:bg-surface-dark transition-colors"
                  >
                    Create Event
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplianceCalendarView;