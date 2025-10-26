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
      <div className="mb-8">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Implementation Workbook</h1>
          <p className="text-gray-600 dark:text-gray-300">Control-level tasks, owners, and evidence checklist</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">18</h3>
          <p className="text-gray-600 dark:text-gray-300">Completed Tasks</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <Clock className="w-8 h-8 text-blue-600 mb-4" />
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">12</h3>
          <p className="text-gray-600 dark:text-gray-300">In Progress</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <AlertCircle className="w-8 h-8 text-orange-600 mb-4" />
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">24</h3>
          <p className="text-gray-600 dark:text-gray-300">Remaining</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Implementation Tasks</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-sm text-blue-600 dark:text-blue-400">{task.control}</span>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{task.description}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Assigned to: {task.assignee}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImplementationWorkbook;

