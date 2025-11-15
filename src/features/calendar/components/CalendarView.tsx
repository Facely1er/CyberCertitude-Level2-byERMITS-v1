import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, ListFilter as Filter, Clock, Users, SquareCheck as CheckSquare, TriangleAlert as AlertTriangle } from 'lucide-react';
import { Task } from '../../tasks/types';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'task' | 'assessment' | 'review' | 'deadline';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
  assignees?: string[];
}

interface CalendarViewProps {
  tasks: Task[];
  onEventClick: (event: CalendarEvent) => void;
  onCreateEvent: () => void;
  className?: string;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  onEventClick,
  onCreateEvent,
  className = ''
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  // Convert tasks to calendar events
  const events: CalendarEvent[] = tasks.map(task => ({
    id: task.id,
    title: task.title,
    date: task.dueDate,
    type: 'task',
    priority: task.priority,
    description: task.description,
    assignees: [task.assignedTo]
  }));

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-error-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-success-500';
      default: return 'bg-support-light';
    }
  };

  const days = getDaysInMonth();
  const today = new Date();

  return (
    <div className={`bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark ${className}`}>
      <div className="p-6 border-b border-support-light dark:border-support-dark">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-primary-600 dark:text-primary-400" />
              Activity Calendar
            </h2>
            <div className="flex space-x-1 bg-support-light dark:bg-surface-dark rounded-lg p-1">
              {(['month', 'week', 'day'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors capitalize ${
                    viewMode === mode
                      ? 'bg-primary-600 text-white'
                      : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-support-light dark:hover:bg-primary-600'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={onCreateEvent}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-support-light dark:hover:bg-surface-dark rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-support-light dark:hover:bg-surface-dark rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {viewMode === 'month' && (
        <div className="p-6">
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-text-muted-light dark:text-text-muted-dark">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const dayEvents = getEventsForDate(day);
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isToday = day.toDateString() === today.toDateString();
              
              return (
                <div
                  key={index}
                  className={`min-h-[100px] p-2 border border-support-light dark:border-support-dark rounded-lg ${
                    isCurrentMonth 
                      ? 'bg-surface-light dark:bg-surface-dark' 
                      : 'bg-background-light dark:bg-surface-dark/50'
                  } ${
                    isToday ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className={`text-sm font-medium mb-2 ${
                    isCurrentMonth 
                      ? 'text-text-primary-light dark:text-text-primary-dark' 
                      : 'text-text-muted-dark dark:text-text-muted-light'
                  } ${
                    isToday ? 'text-primary-600 dark:text-primary-400' : ''
                  }`}>
                    {day.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        onClick={() => onEventClick(event)}
                        className={`p-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity ${getPriorityColor(event.priority)} text-white`}
                        title={event.title}
                      >
                        {event.title.length > 20 ? `${event.title.substring(0, 20)}...` : event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-text-muted-light dark:text-text-muted-dark">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;