import React from 'react';
import { BarChart3, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';

const ComplianceTracking: React.FC = () => {
  const domains = [
    { name: 'Access Control', progress: 85, controls: 24 },
    { name: 'System & Communications Protection', progress: 78, controls: 15 },
    { name: 'Incident Response', progress: 92, controls: 6 },
    { name: 'Audit & Accountability', progress: 67, controls: 9 }
  ];

  const breadcrumbs = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Implementation', path: '/implementation/overview' },
    { label: 'Compliance Tracking', isActive: true }
  ];

  return (
    <div className="container-responsive section-padding">
      <div className="mb-8">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Compliance Tracking</h1>
          <p className="text-gray-600 dark:text-gray-300">Monitor progress and compliance status across all domains</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-4 mb-4">
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">78%</h3>
          <p className="text-gray-600 dark:text-gray-300">Overall Progress</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">42</h3>
          <p className="text-gray-600 dark:text-gray-300">Controls Implemented</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <BarChart3 className="w-8 h-8 text-yellow-600 mb-4" />
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">18</h3>
          <p className="text-gray-600 dark:text-gray-300">In Progress</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <AlertTriangle className="w-8 h-8 text-red-600 mb-4" />
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">6</h3>
          <p className="text-gray-600 dark:text-gray-300">Needs Attention</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Domain Progress</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {domains.map((domain, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{domain.name}</h3>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{domain.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${domain.progress}%` }}></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{domain.controls} controls</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceTracking;

