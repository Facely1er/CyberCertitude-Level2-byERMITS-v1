import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Calendar, SquareCheck as CheckSquare, Settings, Search, Plus, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle } from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { useInternalLinking } from '@/shared/hooks/useInternalLinking';
import { teamService, TeamMember, TeamTask, TeamMeeting, TeamFilters } from '@/services/teamService';
import { logger } from '@/utils/logger';

interface TeamCollaborationDashboardProps {
  onBack: () => void;
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

const TeamCollaborationDashboard: React.FC<TeamCollaborationDashboardProps> = ({
  onBack: _onBack,
  addNotification
}) => {
  const { breadcrumbs } = useInternalLinking();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'members' | 'tasks' | 'meetings'>('members');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<TeamTask[]>([]);
  const [meetings, setMeetings] = useState<TeamMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [teamMembers, searchTerm, filterRole, filterDepartment, filterStatus]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [membersData, tasksData, meetingsData, stats] = await Promise.all([
        teamService.getTeamMembers(),
        teamService.getTeamTasks(),
        teamService.getTeamMeetings(),
        teamService.getTeamStatistics()
      ]);
      
      setTeamMembers(membersData);
      setTasks(tasksData);
      setMeetings(meetingsData);
      setStatistics(stats);
    } catch (error) {
      addNotification('error', 'Failed to load team data');
      logger.error('Error loading team data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      const filters: TeamFilters = {
        search: searchTerm || undefined,
        role: filterRole !== 'all' ? filterRole as TeamMember['role'] : undefined,
        department: filterDepartment !== 'all' ? filterDepartment : undefined,
        status: filterStatus !== 'all' ? filterStatus as TeamMember['status'] : undefined
      };
      
      const filtered = await teamService.searchTeamMembers(filters);
      setFilteredMembers(filtered);
    } catch (error) {
      logger.error('Error applying filters:', error);
      setFilteredMembers(teamMembers);
    }
  };

  const handleGenerateDefaultTeam = async () => {
    try {
      const defaultMembers = await teamService.generateDefaultTeam();
      await loadData();
      addNotification('success', `Generated ${defaultMembers.length} default team members`);
    } catch (error) {
      addNotification('error', 'Failed to generate default team');
      logger.error('Error generating default team:', error);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await teamService.deleteTeamMember(memberId);
        await loadData();
        addNotification('success', 'Team member deleted successfully');
      } catch (error) {
        addNotification('error', 'Failed to delete team member');
        logger.error('Error deleting team member:', error);
      }
    }
  };

  const handleStatusChange = async (memberId: string, newStatus: TeamMember['status']) => {
    try {
      await teamService.updateTeamMember(memberId, { status: newStatus });
      await loadData();
      addNotification('success', 'Team member status updated successfully');
    } catch (error) {
      addNotification('error', 'Failed to update team member status');
      logger.error('Error updating team member status:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" message="Loading team data..." />
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'inactive': return 'bg-support-light dark:bg-support-dark text-text-primary-light dark:text-text-primary-dark';
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'suspended': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default: return 'bg-support-light dark:bg-support-dark text-text-primary-light dark:text-text-primary-dark';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'CISO': return 'text-purple-600 dark:text-purple-400';
      case 'Security Manager': return 'text-primary-600 dark:text-primary-400';
      case 'Compliance Officer': return 'text-green-600 dark:text-green-400';
      case 'IT Manager': return 'text-orange-600 dark:text-orange-400';
      case 'Implementation Team': return 'text-red-600 dark:text-red-400';
      case 'Domain Expert': return 'text-indigo-600 dark:text-indigo-400';
      case 'Auditor': return 'text-pink-600 dark:text-pink-400';
      case 'Executive': return 'text-yellow-600 dark:text-yellow-400';
      case 'Board Member': return 'text-cyan-600 dark:text-cyan-400';
      case 'External Consultant': return 'text-teal-600 dark:text-teal-400';
      default: return 'text-text-secondary-light dark:text-text-secondary-dark';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'in-progress': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'not-started': return 'bg-support-light dark:bg-support-dark text-text-primary-light dark:text-text-primary-dark';
      case 'on-hold': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'cancelled': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default: return 'bg-support-light dark:bg-support-dark text-text-primary-light dark:text-text-primary-dark';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 dark:text-red-400';
      case 'high': return 'text-orange-600 dark:text-orange-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-text-secondary-light dark:text-text-secondary-dark';
    }
  };

  const getMeetingStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'in-progress': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'cancelled': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default: return 'bg-support-light dark:bg-support-dark text-text-primary-light dark:text-text-primary-dark';
    }
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
                <Users className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  Team Collaboration
                </h1>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  Manage team members, tasks, and collaboration
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleGenerateDefaultTeam}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Generate Default Team</span>
              </button>
              <button
                onClick={() => addNotification('info', 'Add member functionality coming soon')}
                className="flex items-center space-x-2 btn-primary px-4 py-2 rounded-lg transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Member</span>
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
                <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Total Members</p>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{statistics.totalMembers}</p>
              </div>
              <Users className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
          </div>

          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-lg border border-support-light dark:border-support-dark">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Active Members</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{statistics.activeMembers}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-lg border border-support-light dark:border-support-dark">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Total Tasks</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{statistics.totalTasks}</p>
              </div>
              <CheckSquare className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>

          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-lg border border-support-light dark:border-support-dark">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Overdue Tasks</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">{statistics.overdueTasks}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
        <div className="border-b border-support-light dark:border-support-dark">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('members')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'members'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Team Members ({filteredMembers.length})
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tasks'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Tasks ({tasks.length})
            </button>
            <button
              onClick={() => setActiveTab('meetings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'meetings'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Meetings ({meetings.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Filters */}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search team members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  aria-label="Filter by role"
                  className="px-4 py-3 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="CISO">CISO</option>
                  <option value="Security Manager">Security Manager</option>
                  <option value="Compliance Officer">Compliance Officer</option>
                  <option value="IT Manager">IT Manager</option>
                  <option value="Implementation Team">Implementation Team</option>
                  <option value="Domain Expert">Domain Expert</option>
                  <option value="Auditor">Auditor</option>
                  <option value="Executive">Executive</option>
                  <option value="Board Member">Board Member</option>
                  <option value="External Consultant">External Consultant</option>
                </select>

                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  aria-label="Filter by department"
                  className="px-4 py-3 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Departments</option>
                  {statistics && statistics.byDepartment && Object.keys(statistics.byDepartment).map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  aria-label="Filter by status"
                  className="px-4 py-3 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'members' && (
            <div className="space-y-6">
              {filteredMembers.map((member) => (
                <div key={member.id} className="border border-support-light dark:border-support-dark rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                            {member.name}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                            {member.status}
                          </span>
                          <span className={`font-medium ${getRoleColor(member.role)}`}>
                            {member.role}
                          </span>
                        </div>
                        
                        <p className="text-text-secondary-light dark:text-text-secondary-dark mb-2">
                          {member.email} • {member.department}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div>
                            <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Last Active:</span>
                            <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                              {member.lastActive.toLocaleDateString()}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Tasks Completed:</span>
                            <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                              {member.performanceMetrics.tasksCompleted}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Collaboration Score:</span>
                            <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                              {member.performanceMetrics.collaborationScore}%
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Compliance Score:</span>
                            <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                              {member.performanceMetrics.complianceScore}%
                            </div>
                          </div>
                        </div>

                        {member.skills && member.skills.length > 0 && (
                          <div className="mb-4">
                            <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Skills:</span>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {member.skills.map((skill, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {member.certifications && member.certifications.length > 0 && (
                          <div className="mb-4">
                            <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Certifications:</span>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {member.certifications.map((cert, index) => (
                                <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">
                                  {cert}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        const memberDetails = `Member Details:

Name: ${member.name}
Email: ${member.email}
Role: ${member.role}
Department: ${member.department}
Organization: ${member.organization}
Phone: ${member.phone || 'N/A'}
Status: ${member.status}
Last Active: ${member.lastActive.toLocaleDateString()}
Joined Date: ${member.joinedDate.toLocaleDateString()}
Skills: ${member.skills.join(', ')}
Certifications: ${member.certifications.join(', ')}
Tasks Completed: ${member.performanceMetrics.tasksCompleted}
Tasks Overdue: ${member.performanceMetrics.tasksOverdue}
Collaboration Score: ${member.performanceMetrics.collaborationScore}%
Compliance Score: ${member.performanceMetrics.complianceScore}%`;
                        
                        addNotification('info', memberDetails);
                      }}
                      className="flex items-center space-x-2 btn-primary px-4 py-2 rounded-lg transition-colors"
                    >
                      <Users className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                    
                    <select
                      value={member.status}
                      onChange={(e) => handleStatusChange(member.id, e.target.value as TeamMember['status'])}
                      aria-label={`Change status for ${member.name}`}
                      className="px-4 py-2 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                      <option value="suspended">Suspended</option>
                    </select>
                    
                    <button
                      onClick={() => addNotification('info', 'Member editing is available through the member editor')}
                      className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    
                    <button
                      onClick={() => handleDeleteMember(member.id)}
                      className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Users className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
              
              {filteredMembers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                    No Team Members Found
                  </h3>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
                    {searchTerm || filterRole !== 'all' || filterDepartment !== 'all' || filterStatus !== 'all'
                      ? 'No team members match your current search and filter criteria. Try adjusting your filters.'
                      : 'No team members have been added yet. Generate a default team or add members manually.'}
                  </p>
                  {!searchTerm && filterRole === 'all' && filterDepartment === 'all' && filterStatus === 'all' && (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={handleGenerateDefaultTeam}
                        className="btn-primary px-6 py-3 rounded-lg transition-colors"
                      >
                        Generate Default Team
                      </button>
                      <button
                        onClick={() => addNotification('info', 'Add member functionality coming soon')}
                        className="border border-support-light dark:border-support-dark text-text-secondary-light dark:text-text-secondary-dark px-6 py-3 rounded-lg hover:bg-support-light dark:hover:bg-support-dark transition-colors"
                      >
                        Add Member
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-6">
              {tasks.map((task) => (
                <div key={task.id} className="border border-support-light dark:border-support-dark rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                          {task.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                          {task.status.replace('-', ' ')}
                        </span>
                        <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      
                      <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
                        {task.description}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Type:</span>
                          <div className="font-medium text-text-primary-light dark:text-text-primary-dark">{task.type.replace('-', ' ')}</div>
                        </div>
                        <div>
                          <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Due Date:</span>
                          <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                            {task.dueDate.toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Progress:</span>
                          <div className="font-medium text-text-primary-light dark:text-text-primary-dark">{task.progress}%</div>
                        </div>
                        <div>
                          <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Assigned To:</span>
                          <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                            {task.assignedTo.length} member(s)
                          </div>
                        </div>
                      </div>

                      {task.tags && task.tags.length > 0 && (
                        <div className="mb-4">
                          <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Tags:</span>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {task.tags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => addNotification('info', 'Task details and management is available through the task editor')}
                      className="flex items-center space-x-2 btn-primary px-4 py-2 rounded-lg transition-colors"
                    >
                      <CheckSquare className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                    
                    <button
                      onClick={() => addNotification('info', 'Task editing is available through the task editor')}
                      className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              ))}
              
              {tasks.length === 0 && (
                <div className="text-center py-12">
                  <CheckSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                    No Tasks Found
                  </h3>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
                    No tasks have been created yet. Create tasks to track team activities and assignments.
                  </p>
                  <button
                    onClick={() => addNotification('info', 'Create task functionality coming soon')}
                    className="btn-primary px-6 py-3 rounded-lg transition-colors"
                  >
                    Create Task
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'meetings' && (
            <div className="space-y-6">
              {meetings.map((meeting) => (
                <div key={meeting.id} className="border border-support-light dark:border-support-dark rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                          {meeting.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMeetingStatusColor(meeting.status)}`}>
                          {meeting.status.replace('-', ' ')}
                        </span>
                        <span className="font-medium text-text-secondary-light dark:text-text-secondary-dark">
                          {meeting.type.replace('-', ' ')}
                        </span>
                      </div>
                      
                      <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
                        {meeting.description}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Scheduled Date:</span>
                          <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                            {meeting.scheduledDate.toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Duration:</span>
                          <div className="font-medium text-text-primary-light dark:text-text-primary-dark">{meeting.duration} min</div>
                        </div>
                        <div>
                          <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Location:</span>
                          <div className="font-medium text-text-primary-light dark:text-text-primary-dark">{meeting.location}</div>
                        </div>
                        <div>
                          <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Attendees:</span>
                          <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                            {meeting.attendees.length} member(s)
                          </div>
                        </div>
                      </div>

                      {meeting.agenda && meeting.agenda.length > 0 && (
                        <div className="mb-4">
                          <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Agenda:</span>
                          <ul className="mt-1 list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                            {meeting.agenda.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => addNotification('info', 'Meeting details and management is available through the meeting editor')}
                      className="flex items-center space-x-2 btn-primary px-4 py-2 rounded-lg transition-colors"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                    
                    <button
                      onClick={() => addNotification('info', 'Meeting editing is available through the meeting editor')}
                      className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              ))}
              
              {meetings.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                    No Meetings Found
                  </h3>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
                    No meetings have been scheduled yet. Schedule meetings to coordinate team activities.
                  </p>
                  <button
                    onClick={() => addNotification('info', 'Schedule meeting functionality coming soon')}
                    className="btn-primary px-6 py-3 rounded-lg transition-colors"
                  >
                    Schedule Meeting
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

export default TeamCollaborationDashboard;