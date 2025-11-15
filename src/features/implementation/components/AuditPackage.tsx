import React from 'react';
import { Package, FileText, Download } from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';

const AuditPackage: React.FC = () => {
  const documents = [
    { name: 'System Security Plan (SSP)', version: '2.1', size: '4.2 MB' },
    { name: 'Risk Assessment Report', version: '1.5', size: '2.8 MB' },
    { name: 'Evidence Collection Log', version: '3.0', size: '1.1 MB' }
  ];

  const breadcrumbs = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Implementation', path: '/implementation/overview' },
    { label: 'Audit Package', isActive: true }
  ];

  return (
    <div className="container-responsive section-padding">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">Audit Package</h1>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">Prepare documentation for assessment</p>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              <Download className="w-4 h-4" />
              <span>Export Package</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark">
        <div className="p-6 border-b border-support-light dark:border-support-dark">
          <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">Audit Documentation</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {documents.map((doc, index) => (
              <div key={index} className="border border-support-light dark:border-support-dark rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <FileText className="w-8 h-8 text-primary-600" />
                    <div>
                      <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">{doc.name}</h3>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">v{doc.version} • {doc.size}</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-support-light dark:hover:bg-surface-dark rounded-lg">
                    <Download className="w-5 h-5 text-text-secondary-light dark:text-text-secondary-dark" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditPackage;

