import React, { useState } from 'react';
import { FileText, Calendar, Users, Target, CheckCircle, Plus } from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';

interface Milestone {
  id: string;
  name: string;
  dueDate: Date;
  status: 'planned' | 'in-progress' | 'completed';
}

const ProjectCharter: React.FC = () => {
  const [scope, setScope] = useState('');
  const [objectives, setObjectives] = useState('');
  const [budget, setBudget] = useState('');

  const milestones: Milestone[] = [
    { id: '1', name: 'Project Kickoff', dueDate: new Date('2024-02-01'), status: 'completed' },
    { id: '2', name: 'CUI Scope Definition', dueDate: new Date('2024-02-15'), status: 'in-progress' },
    { id: '3', name: 'Control Implementation', dueDate: new Date('2024-03-30'), status: 'planned' },
    { id: '4', name: 'Assessment Readiness', dueDate: new Date('2024-04-30'), status: 'planned' }
  ];

  const breadcrumbs = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Implementation', path: '/implementation/overview' },
    { label: 'Project Charter', isActive: true }
  ];

  return (
    <div className="container-responsive section-padding">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Project Charter</h1>
          <p className="text-gray-600 dark:text-gray-300">Define scope, objectives, and timeline for CMMC 2.0 implementation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Project Scope</h2>
            <textarea
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              placeholder="Define the scope of the CMMC 2.0 implementation project..."
              className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Objectives</h2>
            <textarea
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              placeholder="Define key objectives and success criteria..."
              className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Project Timeline</h2>
            <div className="space-y-4">
              {milestones.map((milestone) => (
                <div key={milestone.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{milestone.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                      milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {milestone.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {milestone.dueDate.toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Project Budget</h2>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Enter budget amount"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCharter;

