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
      <div className="mb-8">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Audit Package</h1>
              <p className="text-gray-600 dark:text-gray-300">Prepare documentation for assessment</p>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="w-4 h-4" />
              <span>Export Package</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Audit Documentation</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {documents.map((doc, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{doc.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">v{doc.version} • {doc.size}</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <Download className="w-5 h-5 text-gray-600 dark:text-gray-300" />
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

