import React from 'react';
import { FileText, CheckCircle, Clock } from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';

const PoliciesPage: React.FC = () => {
  const breadcrumbs = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Policy Management', isActive: true }
  ];

  return (
    <div className="container-responsive section-padding">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">Policy Management</h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">Manage organization policies and procedures</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
          <FileText className="w-8 h-8 text-primary-600 mb-4" />
          <h3 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">24</h3>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">Active Policies</p>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
          <CheckCircle className="w-8 h-8 text-success-600 mb-4" />
          <h3 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">18</h3>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">Approved</p>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
          <Clock className="w-8 h-8 text-yellow-600 mb-4" />
          <h3 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">6</h3>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">Under Review</p>
        </div>
      </div>
    </div>
  );
};

export default PoliciesPage;

