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

      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">Certification Tracking</h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">Track certification progress and compliance status</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
          <CheckCircle className="w-8 h-8 text-success-600 mb-4" />
          <h3 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">1</h3>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">Active Certifications</p>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
          <Clock className="w-8 h-8 text-primary-600 mb-4" />
          <h3 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">1</h3>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">In Progress</p>
        </div>
      </div>

      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark">
        <div className="p-6 border-b border-support-light dark:border-support-dark">
          <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">Certification Status</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {certifications.map((cert, index) => (
              <div key={index} className="border border-support-light dark:border-support-dark rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">{cert.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    cert.status === 'Active' ? 'bg-success-100 text-success-800' : 'bg-primary-100 text-primary-800'
                  }`}>
                    {cert.status}
                  </span>
                </div>
                <div className="w-full bg-support-light dark:bg-surface-dark rounded-full h-2 mb-2">
                  <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${cert.progress}%` }}></div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
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

