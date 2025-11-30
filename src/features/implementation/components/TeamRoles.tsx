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
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">Team Roles</h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">Designate compliance team roles and responsibilities</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {roles.map((role) => (
          <div key={role.id} className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                <role.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">{role.name}</h3>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{role.members} members</p>
              </div>
            </div>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{role.responsibility}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">RACI Matrix</h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">Roles and responsibilities breakdown</p>
        </div>
      </div>
    </div>
  );
};

export default TeamRoles;

