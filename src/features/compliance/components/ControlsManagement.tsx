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

      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">Controls Management</h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">Manage security controls implementation and maturity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
          <CheckCircle className="w-8 h-8 text-success-600 mb-4" />
          <h3 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">42</h3>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">Implemented Controls</p>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
          <Shield className="w-8 h-8 text-primary-600 mb-4" />
          <h3 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">15</h3>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">In Progress</p>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
          <AlertTriangle className="w-8 h-8 text-error-600 mb-4" />
          <h3 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">53</h3>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">Total Controls</p>
        </div>
      </div>

      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark">
        <div className="p-6 border-b border-support-light dark:border-support-dark">
          <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">Control Status</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {controls.map((control) => (
              <div key={control.id} className="border border-support-light dark:border-support-dark rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">{control.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    control.status === 'Implemented' ? 'bg-success-100 text-success-800' :
                    control.status === 'In Progress' ? 'bg-primary-100 text-primary-800' :
                    'bg-support-light text-text-primary-light'
                  }`}>
                    {control.status}
                  </span>
                </div>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{control.domain} • Maturity: {control.maturity}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlsManagement;

