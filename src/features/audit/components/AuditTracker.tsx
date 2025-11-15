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
      case 'completed': return 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300';
      case 'in-progress': return 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300';
      case 'scheduled': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'cancelled': return 'bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-300';
      default: return 'bg-support-light dark:bg-background-dark/30 text-text-primary-light dark:text-text-secondary-dark';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-300';
      case 'high': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'low': return 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300';
      default: return 'bg-support-light dark:bg-background-dark/30 text-text-primary-light dark:text-text-secondary-dark';
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
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Header */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
                <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Audit Tracker</h1>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  Schedule audits, track findings, and manage remediation
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 border border-support-light dark:border-support-dark text-text-primary-light dark:text-text-secondary-dark rounded-lg hover:bg-background-light dark:hover:bg-surface-dark transition-colors">
                <Plus className="w-4 h-4" />
                <span>New Audit</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-1">Total Audits</h3>
          <p className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">{stats.total}</p>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-1">In Progress</h3>
          <p className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">{stats.inProgress}</p>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-success-100 dark:bg-success-900/30 rounded-lg">
              <CheckCircle className="w-6 h-6 text-success-600 dark:text-success-400" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-1">Completed</h3>
          <p className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">{stats.completed}</p>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-1">Scheduled</h3>
          <p className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">{stats.scheduled}</p>
        </div>
      </div>

      {/* Findings Summary */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
        <div className="p-6 border-b border-support-light dark:border-support-dark">
          <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">Findings Summary</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border border-support-light dark:border-support-dark rounded-lg">
              <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">{findingsStats.total}</p>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Total Findings</p>
            </div>
            <div className="text-center p-4 border border-support-light dark:border-support-dark rounded-lg">
              <p className="text-2xl font-bold text-error-600 dark:text-error-400">{findingsStats.open}</p>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Open</p>
            </div>
            <div className="text-center p-4 border border-support-light dark:border-support-dark rounded-lg">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{findingsStats.inRemediation}</p>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">In Remediation</p>
            </div>
            <div className="text-center p-4 border border-support-light dark:border-support-dark rounded-lg">
              <p className="text-2xl font-bold text-success-600 dark:text-success-400">{findingsStats.closed}</p>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Closed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted-dark" />
              <input
                type="text"
                placeholder="Search audits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark"
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
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
        <div className="p-6 border-b border-support-light dark:border-support-dark">
          <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">Audits</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {filteredAudits.length > 0 ? (
              filteredAudits.map((audit) => (
                <div key={audit.id} className="border border-support-light dark:border-support-dark rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                        <Calendar className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">{audit.name}</h3>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Type: {audit.type} • Auditor: {audit.auditor}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(audit.status)}`}>
                      {audit.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm text-text-secondary-light dark:text-text-secondary-dark">
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
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Generate Report</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto text-text-muted-dark mb-4" />
                <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark mb-2">No audits found</h3>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">Get started by creating your first audit</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditTracker;

