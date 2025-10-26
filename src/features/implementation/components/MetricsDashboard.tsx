import React from 'react';
import { BarChart3, TrendingUp, Target, Award } from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';

const MetricsDashboard: React.FC = () => {
  const metrics = [
    { name: 'Control Implementation Rate', value: 85, trend: '+5%' },
    { name: 'Assessment Pass Rate', value: 92, trend: '+3%' },
    { name: 'Policy Compliance', value: 88, trend: '+2%' }
  ];

  const breadcrumbs = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Implementation', path: '/implementation/overview' },
    { label: 'Metrics Dashboard', isActive: true }
  ];

  return (
    <div className="container-responsive section-padding">
      <div className="mb-8">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Metrics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Key performance indicators and compliance metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <BarChart3 className="w-8 h-8 text-blue-600 mb-4" />
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">85%</h3>
          <p className="text-gray-600 dark:text-gray-300">Implementation Rate</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <TrendingUp className="w-8 h-8 text-green-600 mb-4" />
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">92%</h3>
          <p className="text-gray-600 dark:text-gray-300">Pass Rate</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <Target className="w-8 h-8 text-purple-600 mb-4" />
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">88%</h3>
          <p className="text-gray-600 dark:text-gray-300">Compliance</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <Award className="w-8 h-8 text-orange-600 mb-4" />
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">7</h3>
          <p className="text-gray-600 dark:text-gray-300">Domains Complete</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Performance Metrics</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {metrics.map((metric, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{metric.name}</h3>
                  <span className="text-green-600">{metric.trend}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${metric.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsDashboard;

