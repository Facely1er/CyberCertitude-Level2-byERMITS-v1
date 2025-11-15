import React, { useState } from 'react';
import { Database, Upload, Download, Search, FileText, Image, File } from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';

const DocumentRepository: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const documents = [
    { id: '1', name: 'Security Policy', type: 'Policy', size: '2.3 MB', uploaded: '2024-01-15', category: 'Security' },
    { id: '2', name: 'Incident Response Plan', type: 'Plan', size: '1.8 MB', uploaded: '2024-01-10', category: 'Security' },
    { id: '3', name: 'Network Diagram', type: 'Diagram', size: '456 KB', uploaded: '2024-01-08', category: 'Infrastructure' }
  ];

  const breadcrumbs = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Implementation', path: '/implementation/overview' },
    { label: 'Document Repository', isActive: true }
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
              <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">Document Repository</h1>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">Centralized storage for all compliance documents</p>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              <Upload className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
        <div className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted-dark" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark"
            />
          </div>
        </div>
      </div>

      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark">
        <div className="p-6">
          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="border border-support-light dark:border-support-dark rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <FileText className="w-8 h-8 text-primary-600" />
                    <div>
                      <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">{doc.name}</h3>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{doc.type} • {doc.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-support-light dark:hover:bg-surface-dark rounded-lg">
                      <Download className="w-5 h-5 text-text-secondary-light dark:text-text-secondary-dark" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentRepository;

