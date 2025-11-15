import React, { useState, useEffect } from 'react';
import { 
  Shield, CheckCircle, AlertTriangle, Clock, Target, 
  Plus, Search, Eye, Edit3, RefreshCw, Download, Filter
} from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';
import { useInternalLinking } from '@/shared/hooks/useInternalLinking';
import { controlsService, Control, ControlFilters } from '@/services/controlsService';
import { logger } from '@/utils/logger';

interface ControlsManagementViewProps {
  onBack: () => void;
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

const ControlsManagementView: React.FC<ControlsManagementViewProps> = ({
  onBack: _onBack,
  addNotification
}) => {
  const { breadcrumbs } = useInternalLinking();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFunction, setFilterFunction] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterOwner, setFilterOwner] = useState('all');
  const [controls, setControls] = useState<Control[]>([]);
  const [filteredControls, setFilteredControls] = useState<Control[]>([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<any>(null);

  useEffect(() => {
    loadControls();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [controls, searchTerm, filterStatus, filterFunction, filterPriority, filterOwner]);

  const loadControls = async () => {
    try {
      setLoading(true);
      const controlsData = await controlsService.getControls();
      setControls(controlsData);
      
      const stats = await controlsService.getControlStatistics();
      setStatistics(stats);
    } catch (error) {
      addNotification('error', 'Failed to load controls');
      logger.error('Error loading controls:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      const filters: ControlFilters = {
        search: searchTerm || undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        function: filterFunction !== 'all' ? filterFunction : undefined,
        priority: filterPriority !== 'all' ? filterPriority : undefined,
        owner: filterOwner !== 'all' ? filterOwner : undefined
      };
      
      const filtered = await controlsService.searchControls(filters);
      setFilteredControls(filtered);
    } catch (error) {
      logger.error('Error applying filters:', error);
      setFilteredControls(controls);
    }
  };

  const handleStatusChange = async (controlId: string, newStatus: Control['status']) => {
    try {
      await controlsService.updateControl(controlId, { status: newStatus });
      await loadControls();
      addNotification('success', 'Control status updated successfully');
    } catch (error) {
      addNotification('error', 'Failed to update control status');
      logger.error('Error updating control status:', error);
    }
  };

  const handlePriorityChange = async (controlId: string, newPriority: Control['priority']) => {
    try {
      await controlsService.updateControl(controlId, { priority: newPriority });
      await loadControls();
      addNotification('success', 'Control priority updated successfully');
    } catch (error) {
      addNotification('error', 'Failed to update control priority');
      logger.error('Error updating control priority:', error);
    }
  };

  const handleOwnerChange = async (controlId: string, newOwner: string) => {
    try {
      await controlsService.updateControl(controlId, { owner: newOwner });
      await loadControls();
      addNotification('success', 'Control owner updated successfully');
    } catch (error) {
      addNotification('error', 'Failed to update control owner');
      logger.error('Error updating control owner:', error);
    }
  };

  const handleDeleteControl = async (controlId: string) => {
    if (window.confirm('Are you sure you want to delete this control?')) {
      try {
        await controlsService.deleteControl(controlId);
        await loadControls();
        addNotification('success', 'Control deleted successfully');
      } catch (error) {
        addNotification('error', 'Failed to delete control');
        logger.error('Error deleting control:', error);
      }
    }
  };

  const handleExportControls = () => {
    try {
      const csvContent = generateCSV(filteredControls);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `controls-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addNotification('success', 'Controls exported successfully');
    } catch (error) {
      addNotification('error', 'Failed to export controls');
      logger.error('Error exporting controls:', error);
    }
  };

  const generateCSV = (controls: Control[]): string => {
    const headers = ['ID', 'Name', 'Description', 'Framework', 'NIST Function', 'Status', 'Priority', 'Owner', 'Last Assessed', 'Next Assessment', 'Effectiveness', 'Compliance Status', 'Risk Level', 'Cost', 'Effort'];
    const rows = controls.map(control => [
      control.id,
      control.name,
      control.description,
      control.framework,
      control.nistFunction,
      control.status,
      control.priority,
      control.owner,
      control.lastAssessed.toLocaleDateString(),
      control.nextAssessment.toLocaleDateString(),
      control.effectiveness,
      control.complianceStatus,
      control.riskLevel,
      control.cost.toString(),
      control.effort
    ]);
    
    return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-primary-600" />
          <span className="ml-2 text-text-secondary-light dark:text-text-secondary-dark">Loading controls...</span>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented': return 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300';
      case 'in-progress': return 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300';
      case 'planned': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'not-implemented': return 'bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-300';
      case 'tested': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
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

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-error-600 dark:text-error-400';
      case 'high': return 'text-orange-600 dark:text-orange-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-success-600 dark:text-success-400';
      default: return 'text-text-secondary-light dark:text-text-muted-dark';
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-success-600 dark:text-success-400';
      case 'partially-compliant': return 'text-yellow-600 dark:text-yellow-400';
      case 'non-compliant': return 'text-error-600 dark:text-error-400';
      case 'not-assessed': return 'text-text-secondary-light dark:text-text-muted-dark';
      default: return 'text-text-secondary-light dark:text-text-muted-dark';
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
                <Shield className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  Controls Management
                </h1>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  Manage and monitor NIST CSF v2.0 security controls implementation
                </p>
              </div>
            </div>
            
            <button
              onClick={() => addNotification('info', 'Control creation is available through the assessment workflow')}
              className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Control</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-lg border border-support-light dark:border-support-dark">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary-light dark:text-text-muted-dark">Total Controls</p>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{statistics.total}</p>
              </div>
              <Shield className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
          </div>

          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-lg border border-support-light dark:border-support-dark">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary-light dark:text-text-muted-dark">Implemented</p>
                <p className="text-3xl font-bold text-success-600 dark:text-success-400">{statistics.byStatus.implemented || 0}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success-600 dark:text-success-400" />
            </div>
          </div>

          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-lg border border-support-light dark:border-support-dark">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary-light dark:text-text-muted-dark">In Progress</p>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{statistics.byStatus['in-progress'] || 0}</p>
              </div>
              <Clock className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
          </div>

          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-lg border border-support-light dark:border-support-dark">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary-light dark:text-text-muted-dark">Not Implemented</p>
                <p className="text-3xl font-bold text-error-600 dark:text-error-400">{statistics.byStatus['not-implemented'] || 0}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-error-600 dark:text-error-400" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted-dark w-5 h-5" />
              <input
                type="text"
                placeholder="Search controls..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <select
              value={filterFunction}
              onChange={(e) => setFilterFunction(e.target.value)}
              className="px-4 py-3 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Functions</option>
              <option value="Govern">Govern</option>
              <option value="Identify">Identify</option>
              <option value="Protect">Protect</option>
              <option value="Detect">Detect</option>
              <option value="Respond">Respond</option>
              <option value="Recover">Recover</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="not-implemented">Not Implemented</option>
              <option value="planned">Planned</option>
              <option value="in-progress">In Progress</option>
              <option value="implemented">Implemented</option>
              <option value="tested">Tested</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-3 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>

            <select
              value={filterOwner}
              onChange={(e) => setFilterOwner(e.target.value)}
              className="px-4 py-3 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Owners</option>
              {statistics && statistics.byOwner && Object.keys(statistics.byOwner).map(owner => (
                <option key={owner} value={owner}>{owner}</option>
              ))}
            </select>

            <button
              onClick={handleExportControls}
              className="flex items-center space-x-2 px-4 py-3 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Controls List */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark">
        <div className="p-6 border-b border-support-light dark:border-support-dark">
          <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
            NIST CSF v2.0 Security Controls ({filteredControls.length})
          </h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {filteredControls.map((control) => (
              <div key={control.id} className="border border-support-light dark:border-support-dark rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                        {control.name}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(control.status)}`}>
                        {control.status.replace('-', ' ')}
                      </span>
                      <span className={`font-medium ${getPriorityColor(control.priority)}`}>
                        {control.priority}
                      </span>
                    </div>
                    
                    <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
                      {control.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Control ID:</span>
                        <div className="font-medium text-text-primary-light dark:text-text-primary-dark">{control.id.toUpperCase()}</div>
                      </div>
                      <div>
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Function:</span>
                        <div className="font-medium text-text-primary-light dark:text-text-primary-dark">{control.nistFunction}</div>
                      </div>
                      <div>
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Owner:</span>
                        <select
                          value={control.owner}
                          onChange={(e) => handleOwnerChange(control.id, e.target.value)}
                          className="mt-1 px-2 py-1 text-sm border border-support-light dark:border-support-dark rounded bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="CISO">CISO</option>
                          <option value="IT Security Team">IT Security Team</option>
                          <option value="IT Operations">IT Operations</option>
                          <option value="HR Team">HR Team</option>
                          <option value="Facilities Team">Facilities Team</option>
                          <option value="Risk Management">Risk Management</option>
                          <option value="Security Operations">Security Operations</option>
                          <option value="Network Team">Network Team</option>
                        </select>
                      </div>
                      <div>
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Effectiveness:</span>
                        <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                          {control.effectiveness.replace('-', ' ')}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Compliance:</span>
                        <div className={`font-medium ${getComplianceColor(control.complianceStatus)}`}>
                          {control.complianceStatus.replace('-', ' ')}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Risk Level:</span>
                        <div className={`font-medium ${getRiskColor(control.riskLevel)}`}>
                          {control.riskLevel}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Cost:</span>
                        <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                          ${control.cost.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Effort:</span>
                        <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                          {control.effort}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Timeline:</span>
                        <div className="font-medium text-text-primary-light dark:text-text-primary-dark">{control.timeline}</div>
                      </div>
                      <div>
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Last Assessed:</span>
                        <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                          {control.lastAssessed.toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {control.implementationNotes && (
                      <div className="mb-4">
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Implementation Notes:</span>
                        <div className="mt-1 p-3 bg-background-light dark:bg-surface-dark rounded-lg">
                          <p className="text-sm text-text-primary-light dark:text-text-secondary-dark">{control.implementationNotes}</p>
                        </div>
                      </div>
                    )}

                    {control.evidence && control.evidence.length > 0 && (
                      <div className="mb-4">
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Evidence Required:</span>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {control.evidence.map((evidence, index) => (
                            <span key={index} className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 text-xs rounded-full">
                              {evidence}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      const controlDetails = `Control Details:

ID: ${control.id.toUpperCase()}
Name: ${control.name}
Description: ${control.description}
Framework: ${control.framework}
NIST Function: ${control.nistFunction}
Category: ${control.nistCategory}
Status: ${control.status.replace('-', ' ')}
Priority: ${control.priority}
Owner: ${control.owner}
Effectiveness: ${control.effectiveness.replace('-', ' ')}
Compliance: ${control.complianceStatus.replace('-', ' ')}
Risk Level: ${control.riskLevel}
Cost: $${control.cost.toLocaleString()}
Effort: ${control.effort}
Timeline: ${control.timeline}
Last Assessed: ${control.lastAssessed.toLocaleDateString()}
Next Assessment: ${control.nextAssessment.toLocaleDateString()}`;
                      
                      addNotification('info', controlDetails);
                    }}
                    className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  
                  <select
                    value={control.status}
                    onChange={(e) => handleStatusChange(control.id, e.target.value as Control['status'])}
                    className="px-4 py-2 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="not-implemented">Not Implemented</option>
                    <option value="planned">Planned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="implemented">Implemented</option>
                    <option value="tested">Tested</option>
                  </select>

                  <select
                    value={control.priority}
                    onChange={(e) => handlePriorityChange(control.id, e.target.value as Control['priority'])}
                    className="px-4 py-2 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="critical">Critical Priority</option>
                  </select>
                  
                  <button
                    onClick={() => handleDeleteControl(control.id)}
                    className="flex items-center space-x-2 bg-error-600 text-white px-4 py-2 rounded-lg hover:bg-error-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredControls.length === 0 && (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-text-muted-dark mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                No Controls Found
              </h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
                {searchTerm || filterStatus !== 'all' || filterFunction !== 'all' || filterPriority !== 'all' || filterOwner !== 'all'
                  ? 'No controls match your current search and filter criteria. Try adjusting your filters.'
                  : 'No security controls have been configured yet. Generate controls from your CMMC assessment or create them manually.'}
              </p>
              {!searchTerm && filterStatus === 'all' && filterFunction === 'all' && filterPriority === 'all' && filterOwner === 'all' && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={async () => {
                      try {
                        // This would typically get assessment data from a service
                        addNotification('info', 'To generate controls from assessment, complete a CMMC assessment first');
                      } catch (error) {
                        addNotification('error', 'Failed to generate controls from assessment');
                      }
                    }}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Generate from Assessment
                  </button>
                  <button
                    onClick={() => addNotification('info', 'Manual control creation is available through the assessment workflow')}
                    className="border border-support-light dark:border-support-dark text-text-primary-light dark:text-text-secondary-dark px-6 py-3 rounded-lg hover:bg-background-light dark:hover:bg-surface-dark transition-colors"
                  >
                    Create Manually
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

export default ControlsManagementView;