import React from 'react';
import { Shield, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';

const ControlValidation: React.FC = () => {
  const controls = [
    { id: '1', name: 'AC.2.013 - Access Control', status: 'Passed', tested: '2024-01-10', tester: 'Security Team' },
    { id: '2', name: 'IR.4.023 - Incident Response', status: 'Passed', tested: '2024-01-08', tester: 'IT Team' },
    { id: '3', name: 'SC.7.043 - Network Separation', status: 'Failed', tested: '2024-01-05', tester: 'Network Team' }
  ];

  const breadcrumbs = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Implementation', path: '/implementation/overview' },
    { label: 'Control Validation', isActive: true }
  ];

  return (
    <div className="container-responsive section-padding">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Control Validation</h1>
          <p className="text-gray-600 dark:text-gray-300">Verify implemented controls and document test results</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">42</h3>
          <p className="text-gray-600 dark:text-gray-300">Validated Controls</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <Clock className="w-8 h-8 text-blue-600 mb-4" />
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">15</h3>
          <p className="text-gray-600 dark:text-gray-300">Pending Tests</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <XCircle className="w-8 h-8 text-red-600 mb-4" />
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">3</h3>
          <p className="text-gray-600 dark:text-gray-300">Failed Tests</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Validation Results</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {controls.map((control) => (
              <div key={control.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{control.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs flex items-center space-x-1 ${
                    control.status === 'Passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {control.status === 'Passed' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    <span>{control.status}</span>
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                  <span>Tested: {control.tested}</span>
                  <span>By: {control.tester}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlValidation;

