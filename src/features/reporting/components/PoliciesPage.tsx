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
      <div className="mb-8">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Policy Management</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage organization policies and procedures</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <FileText className="w-8 h-8 text-blue-600 mb-4" />
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">24</h3>
          <p className="text-gray-600 dark:text-gray-300">Active Policies</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">18</h3>
          <p className="text-gray-600 dark:text-gray-300">Approved</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <Clock className="w-8 h-8 text-yellow-600 mb-4" />
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">6</h3>
          <p className="text-gray-600 dark:text-gray-300">Under Review</p>
        </div>
      </div>
    </div>
  );
};

export default PoliciesPage;

