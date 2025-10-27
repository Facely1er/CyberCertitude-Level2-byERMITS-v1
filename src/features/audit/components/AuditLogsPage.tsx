import React from 'react';
import { FileText, Search } from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';

const AuditLogsPage: React.FC = () => {
  const logs = [
    { id: '1', action: 'Policy Updated', user: 'admin@example.com', timestamp: '2024-01-15 10:30', status: 'Success' },
    { id: '2', action: 'Access Granted', user: 'user@example.com', timestamp: '2024-01-15 09:15', status: 'Success' },
    { id: '3', action: 'Failed Login Attempt', user: 'external@example.com', timestamp: '2024-01-14 14:22', status: 'Failed' }
  ];

  const breadcrumbs = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Audit Logs', isActive: true }
  ];

  return (
    <div className="container-responsive section-padding">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Audit Logs</h1>
          <p className="text-gray-600 dark:text-gray-300">Complete audit trail of system activities</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search audit logs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{log.action}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{log.user} • {log.timestamp}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    log.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogsPage;

