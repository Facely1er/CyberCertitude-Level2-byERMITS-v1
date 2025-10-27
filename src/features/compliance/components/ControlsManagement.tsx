import React from 'react';
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';

const ControlsManagement: React.FC = () => {
  const controls = [
    { id: '1', name: 'AC.2.013 - Access Control', domain: 'Access Control', status: 'Implemented', maturity: 'High' },
    { id: '2', name: 'IR.4.023 - Incident Response', domain: 'Incident Response', status: 'In Progress', maturity: 'Medium' },
    { id: '3', name: 'SC.7.043 - Network Separation', domain: 'System Protection', status: 'Not Started', maturity: 'Low' }
  ];

  const breadcrumbs = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Controls Management', isActive: true }
  ];

  return (
    <div className="container-responsive section-padding">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Controls Management</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage security controls implementation and maturity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">42</h3>
          <p className="text-gray-600 dark:text-gray-300">Implemented Controls</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <Shield className="w-8 h-8 text-blue-600 mb-4" />
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">15</h3>
          <p className="text-gray-600 dark:text-gray-300">In Progress</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <AlertTriangle className="w-8 h-8 text-red-600 mb-4" />
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">53</h3>
          <p className="text-gray-600 dark:text-gray-300">Total Controls</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Control Status</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {controls.map((control) => (
              <div key={control.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{control.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    control.status === 'Implemented' ? 'bg-green-100 text-green-800' :
                    control.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {control.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{control.domain} • Maturity: {control.maturity}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlsManagement;

