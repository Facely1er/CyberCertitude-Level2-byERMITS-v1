import React from 'react';
import { Award, CheckCircle, Clock, Calendar } from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';

const CertificationTracking: React.FC = () => {
  const certifications = [
    { name: 'CMMC Level 2', status: 'In Progress', progress: 75, target: 'Q2 2024' },
    { name: 'NIST SP 800-171', status: 'Active', progress: 100, target: 'Completed' }
  ];

  const breadcrumbs = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Implementation', path: '/implementation/overview' },
    { label: 'Certification Tracking', isActive: true }
  ];

  return (
    <div className="container-responsive section-padding">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Certification Tracking</h1>
          <p className="text-gray-600 dark:text-gray-300">Track certification progress and compliance status</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">1</h3>
          <p className="text-gray-600 dark:text-gray-300">Active Certifications</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <Clock className="w-8 h-8 text-blue-600 mb-4" />
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">1</h3>
          <p className="text-gray-600 dark:text-gray-300">In Progress</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Certification Status</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {certifications.map((cert, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{cert.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    cert.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {cert.status}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${cert.progress}%` }}></div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span>Target: {cert.target}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificationTracking;

