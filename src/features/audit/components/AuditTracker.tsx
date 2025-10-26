import React, { useState, useEffect } from 'react';
import { FileText, Calendar, AlertTriangle, CheckCircle, Clock, Plus, Download, Filter, Search } from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';
import { auditService, Audit, AuditFinding } from '@/services/auditService';

const AuditTracker: React.FC = () => {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [findings, setFindings] = useState<AuditFinding[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const loadedAudits = await auditService.getAudits();
    const loadedFindings = await auditService.getFindings();
    setAudits(loadedAudits);
    setFindings(loadedFindings);
  };

  const filteredAudits = audits.filter(audit => {
    if (selectedStatus !== 'all' && audit.status !== selectedStatus) return false;
    if (searchTerm && !audit.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'in-progress': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'scheduled': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'cancelled': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'high': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'low': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
    }
  };

  const handleGenerateReport = async (auditId: string) => {
    try {
      const blob = await auditService.generateReport(auditId);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `audit-report-${auditId}.txt`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to generate report', error);
    }
  };

  const breadcrumbs = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Audit Tracker', isActive: true }
  ];

  const stats = {
    total: audits.length,
    inProgress: audits.filter(a => a.status === 'in-progress').length,
    completed: audits.filter(a => a.status === 'completed').length,
    scheduled: audits.filter(a => a.status === 'scheduled').length
  };

  const findingsStats = {
    total: findings.length,
    open: findings.filter(f => f.status === 'open').length,
    inRemediation: findings.filter(f => f.status === 'in-remediation').length,
    closed: findings.filter(f => f.status === 'closed').length
  };

  return (
    <div className="container-responsive section-padding">
      {/* Breadcrumbs */}
      <div className="mb-8">
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Audit Tracker</h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Schedule audits, track findings, and manage remediation
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Plus className="w-4 h-4" />
                <span>New Audit</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Audits</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">In Progress</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.inProgress}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Completed</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Scheduled</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.scheduled}</p>
        </div>
      </div>

      {/* Findings Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Findings Summary</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{findingsStats.total}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Findings</p>
            </div>
            <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{findingsStats.open}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Open</p>
            </div>
            <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{findingsStats.inRemediation}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">In Remediation</p>
            </div>
            <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{findingsStats.closed}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Closed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search audits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Audits</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {filteredAudits.length > 0 ? (
              filteredAudits.map((audit) => (
                <div key={audit.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{audit.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Type: {audit.type} • Auditor: {audit.auditor}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(audit.status)}`}>
                      {audit.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(audit.scheduledDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{audit.findings.length} findings</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleGenerateReport(audit.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Generate Report</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No audits found</h3>
                <p className="text-gray-600 dark:text-gray-300">Get started by creating your first audit</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditTracker;

