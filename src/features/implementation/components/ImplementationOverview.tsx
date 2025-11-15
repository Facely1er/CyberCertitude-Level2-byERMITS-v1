import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, Clock, AlertTriangle, Users, Target, TrendingUp, FileText } from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';
import { useInternalLinking } from '@/shared/hooks/useInternalLinking';

interface Milestone {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'pending';
  dueDate: Date;
  progress: number;
  owner: string;
}

interface DomainProgress {
  domain: string;
  totalControls: number;
  completedControls: number;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed';
}

const ImplementationOverview: React.FC = () => {
  const { breadcrumbs } = useInternalLinking();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [domainProgress, setDomainProgress] = useState<DomainProgress[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<Milestone[]>([]);

  useEffect(() => {
    // Initialize with sample data
    const sampleMilestones: Milestone[] = [
      {
        id: '1',
        name: 'Security Control Implementation - AC.2',
        status: 'in-progress',
        dueDate: new Date('2024-02-15'),
        progress: 65,
        owner: 'Security Team'
      },
      {
        id: '2',
        name: 'Policy Review and Update',
        status: 'in-progress',
        dueDate: new Date('2024-02-28'),
        progress: 40,
        owner: 'Compliance Team'
      },
      {
        id: '3',
        name: 'Security Awareness Training',
        status: 'pending',
        dueDate: new Date('2024-03-10'),
        progress: 0,
        owner: 'Training Team'
      },
      {
        id: '4',
        name: 'Incident Response Testing',
        status: 'completed',
        dueDate: new Date('2024-01-20'),
        progress: 100,
        owner: 'Security Team'
      }
    ];

    const sampleDomains: DomainProgress[] = [
      { domain: 'Access Control', totalControls: 24, completedControls: 18, progress: 75, status: 'in-progress' },
      { domain: 'System & Communications Protection', totalControls: 15, completedControls: 12, progress: 80, status: 'in-progress' },
      { domain: 'System & Information Integrity', totalControls: 9, completedControls: 7, progress: 78, status: 'in-progress' },
      { domain: 'Configuration Management', totalControls: 11, completedControls: 5, progress: 45, status: 'in-progress' },
      { domain: 'Incident Response', totalControls: 6, completedControls: 6, progress: 100, status: 'completed' },
      { domain: 'Maintenance', totalControls: 5, completedControls: 3, progress: 60, status: 'in-progress' }
    ];

    setMilestones(sampleMilestones);
    setDomainProgress(sampleDomains);
    setUpcomingDeadlines(sampleMilestones.filter(m => m.status === 'in-progress' || m.status === 'pending'));
  }, []);

  const totalControls = domainProgress.reduce((sum, d) => sum + d.totalControls, 0);
  const completedControls = domainProgress.reduce((sum, d) => sum + d.completedControls, 0);
  const overallProgress = totalControls > 0 ? (completedControls / totalControls) * 100 : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300';
      case 'in-progress': return 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300';
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      default: return 'bg-support-light dark:bg-background-dark/30 text-text-primary-light dark:text-text-secondary-dark';
    }
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
                <Activity className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">CMMC 2.0 Implementation Overview</h1>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  Track overall progress, milestones, and compliance status
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                <FileText className="w-4 h-4" />
                <span>Generate Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">{Math.round(overallProgress)}%</span>
          </div>
          <h3 className="text-sm font-medium text-text-primary-light dark:text-text-secondary-dark">Overall Progress</h3>
          <p className="text-xs text-text-secondary-light dark:text-text-muted-dark mt-1">{completedControls} of {totalControls} controls complete</p>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-success-100 dark:bg-success-900/30 rounded-lg">
              <CheckCircle className="w-6 h-6 text-success-600 dark:text-success-400" />
            </div>
            <span className="text-3xl font-bold text-success-600 dark:text-success-400">4</span>
          </div>
          <h3 className="text-sm font-medium text-text-primary-light dark:text-text-secondary-dark">Completed Domains</h3>
          <p className="text-xs text-text-secondary-light dark:text-text-muted-dark mt-1">Out of 14 total domains</p>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">7</span>
          </div>
          <h3 className="text-sm font-medium text-text-primary-light dark:text-text-secondary-dark">In Progress</h3>
          <p className="text-xs text-text-secondary-light dark:text-text-muted-dark mt-1">Active implementation tasks</p>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-error-100 dark:bg-error-900/30 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-error-600 dark:text-error-400" />
            </div>
            <span className="text-3xl font-bold text-error-600 dark:text-error-400">3</span>
          </div>
          <h3 className="text-sm font-medium text-text-primary-light dark:text-text-secondary-dark">At Risk</h3>
          <p className="text-xs text-text-secondary-light dark:text-text-muted-dark mt-1">Tasks needing attention</p>
        </div>
      </div>

      {/* Domain Progress */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
        <div className="p-6 border-b border-support-light dark:border-support-dark">
          <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">Domain Progress</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {domainProgress.map((domain, idx) => (
              <div key={idx} className="border border-support-light dark:border-support-dark rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">{domain.domain}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(domain.status)}`}>
                      {domain.status}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">{domain.completedControls}/{domain.totalControls}</span>
                </div>
                <div className="w-full bg-support-light dark:bg-surface-dark rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ width: `${domain.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
        <div className="p-6 border-b border-support-light dark:border-support-dark">
          <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">Upcoming Deadlines</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {upcomingDeadlines.map((milestone) => (
              <div key={milestone.id} className="border border-support-light dark:border-support-dark rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                      <Target className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">{milestone.name}</h3>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Owner: {milestone.owner}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}>
                    {milestone.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary-light dark:text-text-secondary-dark">Due Date</span>
                    <span className="font-medium text-text-primary-light dark:text-text-primary-dark">{milestone.dueDate.toLocaleDateString()}</span>
                  </div>
                  <div className="w-full bg-support-light dark:bg-surface-dark rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${milestone.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
        <div className="p-6 border-b border-support-light dark:border-support-dark">
          <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {[
              { action: 'AC.2.013 control implemented', user: 'Security Team', time: '2 hours ago', icon: CheckCircle, color: 'green' },
              { action: 'Policy document updated', user: 'Compliance Team', time: '5 hours ago', icon: FileText, color: 'blue' },
              { action: 'Security training completed', user: 'Training Team', time: '1 day ago', icon: Users, color: 'purple' },
              { action: 'Risk assessment submitted', user: 'Risk Team', time: '2 days ago', icon: AlertTriangle, color: 'orange' }
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center space-x-4 p-3 border border-support-light dark:border-support-dark rounded-lg">
                <div className={`p-2 bg-${activity.color}-100 dark:bg-${activity.color}-900/30 rounded-lg`}>
                  <activity.icon className={`w-5 h-5 text-${activity.color}-600 dark:text-${activity.color}-400`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">{activity.action}</p>
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImplementationOverview;

