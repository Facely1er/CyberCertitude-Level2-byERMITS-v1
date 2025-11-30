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
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">Metrics Dashboard</h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">Key performance indicators and compliance metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
          <BarChart3 className="w-8 h-8 text-primary-600 mb-4" />
          <h3 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">85%</h3>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">Implementation Rate</p>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
          <TrendingUp className="w-8 h-8 text-success-600 mb-4" />
          <h3 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">92%</h3>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">Pass Rate</p>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
          <Target className="w-8 h-8 text-purple-600 mb-4" />
          <h3 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">88%</h3>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">Compliance</p>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
          <Award className="w-8 h-8 text-orange-600 mb-4" />
          <h3 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">7</h3>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">Domains Complete</p>
        </div>
      </div>

      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark">
        <div className="p-6 border-b border-support-light dark:border-support-dark">
          <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">Performance Metrics</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {metrics.map((metric, index) => (
              <div key={index} className="border border-support-light dark:border-support-dark rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">{metric.name}</h3>
                  <span className="text-success-600">{metric.trend}</span>
                </div>
                <div className="w-full bg-support-light dark:bg-surface-dark rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${metric.value}%` }}></div>
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

