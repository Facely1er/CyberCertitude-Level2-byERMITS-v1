import React from 'react';
import { BookOpen, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';

const ImplementationWorkbook: React.FC = () => {
  const tasks = [
    { id: '1', control: 'AC.2.013', description: 'Implement access controls', status: 'Completed', assignee: 'Security Team' },
    { id: '2', control: 'AC.3.010', description: 'Configure session management', status: 'In Progress', assignee: 'IT Team' },
    { id: '3', control: 'IR.4.023', description: 'Develop incident response procedures', status: 'Planned', assignee: 'Compliance Team' }
  ];

  const breadcrumbs = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Implementation', path: '/implementation/overview' },
    { label: 'Implementation Workbook', isActive: true }
  ];

  return (
    <div className="container-responsive section-padding">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">Implementation Workbook</h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">Control-level tasks, owners, and evidence checklist</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
          <CheckCircle className="w-8 h-8 text-success-600 mb-4" />
          <h3 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">18</h3>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">Completed Tasks</p>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
          <Clock className="w-8 h-8 text-primary-600 mb-4" />
          <h3 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">12</h3>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">In Progress</p>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
          <AlertCircle className="w-8 h-8 text-orange-600 mb-4" />
          <h3 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">24</h3>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">Remaining</p>
        </div>
      </div>

      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark">
        <div className="p-6 border-b border-support-light dark:border-support-dark">
          <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">Implementation Tasks</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="border border-support-light dark:border-support-dark rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-sm text-primary-600 dark:text-primary-400">{task.control}</span>
                    <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">{task.description}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    task.status === 'Completed' ? 'bg-success-100 text-success-800' :
                    task.status === 'In Progress' ? 'bg-primary-100 text-primary-800' :
                    'bg-support-light text-text-primary-light'
                  }`}>
                    {task.status}
                  </span>
                </div>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Assigned to: {task.assignee}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImplementationWorkbook;

