import React from 'react';
import { Users, Shield, ClipboardCheck, Key } from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';

const TeamRoles: React.FC = () => {
  const roles = [
    { id: '1', name: 'Security Officer', responsibility: 'Access Control, Security Monitoring', members: 2, icon: Shield },
    { id: '2', name: 'IT Administrator', responsibility: 'System Configuration, Network Management', members: 5, icon: Key },
    { id: '3', name: 'Compliance Officer', responsibility: 'Audit, Documentation, Reporting', members: 1, icon: ClipboardCheck }
  ];

  const breadcrumbs = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Implementation', path: '/implementation/overview' },
    { label: 'Team Roles', isActive: true }
  ];

  return (
    <div className="container-responsive section-padding">
      <div className="mb-8">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Team Roles</h1>
          <p className="text-gray-600 dark:text-gray-300">Designate compliance team roles and responsibilities</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {roles.map((role) => (
          <div key={role.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <role.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{role.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{role.members} members</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">{role.responsibility}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">RACI Matrix</h2>
          <p className="text-gray-600 dark:text-gray-300">Roles and responsibilities breakdown</p>
        </div>
      </div>
    </div>
  );
};

export default TeamRoles;

