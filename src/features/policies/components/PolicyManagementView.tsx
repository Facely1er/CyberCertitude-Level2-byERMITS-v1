import React, { useState, useEffect } from 'react';
import { FileText, Clock, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Plus, Search, Eye, CreditCard as Edit3, Download, RefreshCw, ListFilter as Filter } from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';
import { useInternalLinking } from '@/shared/hooks/useInternalLinking';
import { policyService, Policy, PolicyFilters } from '@/services/policyService';
import { logger } from '@/utils/logger';

interface PolicyManagementViewProps {
  onBack: () => void;
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

const PolicyManagementView: React.FC<PolicyManagementViewProps> = ({
  onBack: _onBack,
  addNotification
}) => {
  const { breadcrumbs } = useInternalLinking();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterFunction, setFilterFunction] = useState<string>('all');
  const [filterOwner, setFilterOwner] = useState<string>('all');
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [filteredPolicies, setFilteredPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<any>(null);

  useEffect(() => {
    loadPolicies();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [policies, searchTerm, filterStatus, filterType, filterFunction, filterOwner]);

  const loadPolicies = async () => {
    try {
      setLoading(true);
      const policiesData = await policyService.getPolicies();
      setPolicies(policiesData);
      
      const stats = await policyService.getPolicyStatistics();
      setStatistics(stats);
    } catch (error) {
      addNotification('error', 'Failed to load policies');
      logger.error('Error loading policies:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      const filters: PolicyFilters = {
        search: searchTerm || undefined,
        status: filterStatus !== 'all' ? filterStatus as Policy['status'] : undefined,
        type: filterType !== 'all' ? filterType as Policy['type'] : undefined,
        function: filterFunction !== 'all' ? filterFunction : undefined,
        owner: filterOwner !== 'all' ? filterOwner : undefined
      };
      
      const filtered = await policyService.searchPolicies(filters);
      setFilteredPolicies(filtered);
    } catch (error) {
      logger.error('Error applying filters:', error);
      setFilteredPolicies(policies);
    }
  };

  const handleStatusChange = async (policyId: string, newStatus: Policy['status']) => {
    try {
      await policyService.updatePolicy(policyId, { status: newStatus });
      await loadPolicies();
      addNotification('success', 'Policy status updated successfully');
    } catch (error) {
      addNotification('error', 'Failed to update policy status');
      logger.error('Error updating policy status:', error);
    }
  };

  const handleOwnerChange = async (policyId: string, newOwner: string) => {
    try {
      await policyService.updatePolicy(policyId, { owner: newOwner });
      await loadPolicies();
      addNotification('success', 'Policy owner updated successfully');
    } catch (error) {
      addNotification('error', 'Failed to update policy owner');
      logger.error('Error updating policy owner:', error);
    }
  };

  const handleDeletePolicy = async (policyId: string) => {
    if (window.confirm('Are you sure you want to delete this policy?')) {
      try {
        await policyService.deletePolicy(policyId);
        await loadPolicies();
        addNotification('success', 'Policy deleted successfully');
      } catch (error) {
        addNotification('error', 'Failed to delete policy');
        logger.error('Error deleting policy:', error);
      }
    }
  };

  const handleGeneratePolicies = async () => {
    try {
      const generatedPolicies = await policyService.generatePoliciesFromFramework();
      for (const policy of generatedPolicies) {
        await policyService.savePolicy(policy);
      }
      await loadPolicies();
      addNotification('success', `Generated ${generatedPolicies.length} policies from framework`);
    } catch (error) {
      addNotification('error', 'Failed to generate policies from framework');
      logger.error('Error generating policies:', error);
    }
  };

  const handleExportPolicies = async () => {
    try {
      const csvContent = await policyService.exportPolicies(filteredPolicies, 'csv');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `policies-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addNotification('success', 'Policies exported successfully');
    } catch (error) {
      addNotification('error', 'Failed to export policies');
      logger.error('Error exporting policies:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-300">Loading policies...</span>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'effective': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'approved': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'review': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'draft': return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
      case 'archived': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'superseded': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'governance': return 'text-blue-600 dark:text-blue-400';
      case 'operational': return 'text-green-600 dark:text-green-400';
      case 'technical': return 'text-purple-600 dark:text-purple-400';
      case 'compliance': return 'text-orange-600 dark:text-orange-400';
      case 'incident-response': return 'text-red-600 dark:text-red-400';
      case 'data-protection': return 'text-indigo-600 dark:text-indigo-400';
      case 'access-control': return 'text-pink-600 dark:text-pink-400';
      case 'risk-management': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-600 dark:text-red-400';
      case 'high': return 'text-orange-600 dark:text-orange-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Policy Management
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Manage cybersecurity policies and procedures
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleGeneratePolicies}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Generate from Framework</span>
              </button>
              <button
                onClick={() => addNotification('info', 'Manual policy creation is available through the policy editor')}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Policy</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Policies</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{statistics.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Effective</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{statistics.byStatus.effective || 0}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Under Review</p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{statistics.byStatus.review || 0}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Draft</p>
                <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">{statistics.byStatus.draft || 0}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search policies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <select
              value={filterFunction}
              onChange={(e) => setFilterFunction(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="governance">Governance</option>
              <option value="operational">Operational</option>
              <option value="technical">Technical</option>
              <option value="compliance">Compliance</option>
              <option value="incident-response">Incident Response</option>
              <option value="data-protection">Data Protection</option>
              <option value="access-control">Access Control</option>
              <option value="risk-management">Risk Management</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="effective">Effective</option>
              <option value="archived">Archived</option>
              <option value="superseded">Superseded</option>
            </select>

            <select
              value={filterOwner}
              onChange={(e) => setFilterOwner(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Owners</option>
              {statistics && Object.keys(statistics.byOwner).map(owner => (
                <option key={owner} value={owner}>{owner}</option>
              ))}
            </select>

            <button
              onClick={handleExportPolicies}
              className="flex items-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Policies List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Cybersecurity Policies ({filteredPolicies.length})
          </h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {filteredPolicies.map((policy) => (
              <div key={policy.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {policy.name}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(policy.status)}`}>
                        {policy.status.replace('-', ' ')}
                      </span>
                      <span className={`font-medium ${getTypeColor(policy.type)}`}>
                        {policy.type.replace('-', ' ')}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {policy.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Policy ID:</span>
                        <div className="font-medium text-gray-900 dark:text-white">{policy.id.toUpperCase()}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Version:</span>
                        <div className="font-medium text-gray-900 dark:text-white">{policy.version}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Owner:</span>
                        <select
                          value={policy.owner}
                          onChange={(e) => handleOwnerChange(policy.id, e.target.value)}
                          className="mt-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="CISO">CISO</option>
                          <option value="IT Security Team">IT Security Team</option>
                          <option value="Data Protection Officer">Data Protection Officer</option>
                          <option value="Risk Management">Risk Management</option>
                          <option value="Security Operations">Security Operations</option>
                          <option value="IT Manager">IT Manager</option>
                          <option value="Security Manager">Security Manager</option>
                        </select>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Framework:</span>
                        <div className="font-medium text-gray-900 dark:text-white">{policy.framework}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Risk Level:</span>
                        <div className={`font-medium ${getRiskColor(policy.riskLevel)}`}>
                          {policy.riskLevel}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Business Impact:</span>
                        <div className={`font-medium ${getRiskColor(policy.businessImpact)}`}>
                          {policy.businessImpact}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Effective Date:</span>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {policy.effectiveDate.toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Next Review:</span>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {policy.nextReview.toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {policy.stakeholders && policy.stakeholders.length > 0 && (
                      <div className="mb-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Stakeholders:</span>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {policy.stakeholders.map((stakeholder, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                              {stakeholder}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {policy.complianceRequirements && policy.complianceRequirements.length > 0 && (
                      <div className="mb-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Compliance Requirements:</span>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {policy.complianceRequirements.map((requirement, index) => (
                            <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">
                              {requirement}
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
                      const policyDetails = `Policy Details:

ID: ${policy.id.toUpperCase()}
Name: ${policy.name}
Description: ${policy.description}
Type: ${policy.type.replace('-', ' ')}
Status: ${policy.status.replace('-', ' ')}
Version: ${policy.version}
Owner: ${policy.owner}
Framework: ${policy.framework}
NIST Function: ${policy.nistFunction}
Risk Level: ${policy.riskLevel}
Business Impact: ${policy.businessImpact}
Effective Date: ${policy.effectiveDate.toLocaleDateString()}
Last Reviewed: ${policy.lastReviewed.toLocaleDateString()}
Next Review: ${policy.nextReview.toLocaleDateString()}
Review Cycle: ${policy.reviewCycle}`;
                      
                      addNotification('info', policyDetails);
                    }}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  
                  <select
                    value={policy.status}
                    onChange={(e) => handleStatusChange(policy.id, e.target.value as Policy['status'])}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="effective">Effective</option>
                    <option value="archived">Archived</option>
                    <option value="superseded">Superseded</option>
                  </select>
                  
                  <button
                    onClick={() => addNotification('info', 'Policy editing is available through the policy editor')}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  
                  <button
                    onClick={() => handleDeletePolicy(policy.id)}
                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredPolicies.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Policies Found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {searchTerm || filterStatus !== 'all' || filterType !== 'all' || filterFunction !== 'all' || filterOwner !== 'all'
                  ? 'No policies match your current search and filter criteria. Try adjusting your filters.'
                  : 'No policies have been created yet. Generate policies from the framework or create them manually.'}
              </p>
              {!searchTerm && filterStatus === 'all' && filterType === 'all' && filterFunction === 'all' && filterOwner === 'all' && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleGeneratePolicies}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Generate from Framework
                  </button>
                  <button
                    onClick={() => addNotification('info', 'Manual policy creation is available through the policy editor')}
                    className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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

export default PolicyManagementView;