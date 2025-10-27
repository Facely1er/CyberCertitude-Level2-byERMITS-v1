import React from 'react';
import { Target, Shield, Database, Network } from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';

const CUIScope: React.FC = () => {
  const systems = [
    { id: '1', name: 'Email Server', classification: 'High', status: 'Scoped', icon: Database },
    { id: '2', name: 'File Server', classification: 'High', status: 'Scoped', icon: Database },
    { id: '3', name: 'Development Network', classification: 'Medium', status: 'Out of Scope', icon: Network }
  ];

  const breadcrumbs = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Implementation', path: '/implementation/overview' },
    { label: 'CUI Scope', isActive: true }
  ];

  return (
    <div className="container-responsive section-padding">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">CUI Scope Definition</h1>
          <p className="text-gray-600 dark:text-gray-300">Identify systems and assets under Controlled Unclassified Information scope</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">12</h3>
          <p className="text-gray-600 dark:text-gray-300">Systems in Scope</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">45</h3>
          <p className="text-gray-600 dark:text-gray-300">Assets Identified</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <Database className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">3</h3>
          <p className="text-gray-600 dark:text-gray-300">Network Boundaries</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Scoped Systems</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {systems.map((system) => (
              <div key={system.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <system.icon className="w-8 h-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{system.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Classification: {system.classification}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    system.status === 'Scoped' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {system.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CUIScope;

