import React from 'react';
import { Target, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';

const C3PAOPrep: React.FC = () => {
  const checklist = [
    { id: '1', item: 'Complete all control implementations', status: true },
    { id: '2', item: 'Gather all evidence documentation', status: true },
    { id: '3', item: 'Conduct internal assessment', status: false },
    { id: '4', item: 'Prepare System Security Plan (SSP)', status: false }
  ];

  const breadcrumbs = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Implementation', path: '/implementation/overview' },
    { label: 'C3PAO Preparation', isActive: true }
  ];

  return (
    <div className="container-responsive section-padding">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">C3PAO Preparation</h1>
          <p className="text-gray-600 dark:text-gray-300">Prepare for third-party assessment</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Assessment Readiness Checklist</h2>
          <div className="space-y-3">
            {checklist.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                {item.status ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                )}
                <span className={item.status ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}>
                  {item.item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Estimated Readiness</h3>
          <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">75%</div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recommended Assessment Date</h3>
          <div className="flex items-center space-x-2 text-xl text-gray-900 dark:text-white">
            <Calendar className="w-6 h-6" />
            <span>Q2 2024</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default C3PAOPrep;

