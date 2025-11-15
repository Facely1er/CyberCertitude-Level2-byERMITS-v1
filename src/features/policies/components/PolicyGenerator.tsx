import React, { useState, useEffect } from 'react';
import { FileText, Plus, Download, Edit, Trash2, Search, Filter, CheckCircle, Clock, AlertTriangle, BookOpen, Settings } from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';

interface Policy {
  id: string;
  title: string;
  type: string;
  status: 'draft' | 'review' | 'approved' | 'archived';
  version: string;
  lastModified: Date;
  owner: string;
  category: string;
}

const PolicyGenerator: React.FC = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    // Initialize with sample data
    const samplePolicies: Policy[] = [
      {
        id: '1',
        title: 'Information Security Policy',
        type: 'Organization',
        status: 'approved',
        version: '1.2',
        lastModified: new Date('2024-01-15'),
        owner: 'Security Team',
        category: 'Security'
      },
      {
        id: '2',
        title: 'Acceptable Use Policy',
        type: 'User Conduct',
        status: 'review',
        version: '2.0',
        lastModified: new Date('2024-01-20'),
        owner: 'IT Team',
        category: 'User Management'
      },
      {
        id: '3',
        title: 'Incident Response Policy',
        type: 'Operations',
        status: 'approved',
        version: '1.5',
        lastModified: new Date('2024-01-10'),
        owner: 'Security Team',
        category: 'Security'
      },
      {
        id: '4',
        title: 'Data Classification Policy',
        type: 'Data Protection',
        status: 'draft',
        version: '1.0',
        lastModified: new Date('2024-01-25'),
        owner: 'Compliance Team',
        category: 'Data Management'
      }
    ];
    setPolicies(samplePolicies);
  }, []);

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          policy.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || policy.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || policy.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300';
      case 'review': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'draft': return 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300';
      case 'archived': return 'bg-support-light dark:bg-background-dark/30 text-text-primary-light dark:text-text-secondary-dark';
      default: return 'bg-support-light dark:bg-background-dark/30 text-text-primary-light dark:text-text-secondary-dark';
    }
  };

  const stats = {
    total: policies.length,
    approved: policies.filter(p => p.status === 'approved').length,
    inReview: policies.filter(p => p.status === 'review').length,
    draft: policies.filter(p => p.status === 'draft').length
  };

  const breadcrumbs = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Implementation', path: '/implementation/overview' },
    { label: 'Policy Generator', isActive: true }
  ];

  return (
    <div className="container-responsive section-padding">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Header */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
                <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Policy Generator</h1>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  Generate and manage compliance policies and procedures
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                <Plus className="w-4 h-4" />
                <span>Create Policy</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-1">Total Policies</h3>
          <p className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">{stats.total}</p>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-success-100 dark:bg-success-900/30 rounded-lg">
              <CheckCircle className="w-6 h-6 text-success-600 dark:text-success-400" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-1">Approved</h3>
          <p className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">{stats.approved}</p>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-1">In Review</h3>
          <p className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">{stats.inReview}</p>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-1">Draft</h3>
          <p className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">{stats.draft}</p>
        </div>
      </div>

      {/* Policy Templates */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
        <div className="p-6 border-b border-support-light dark:border-support-dark">
          <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">Policy Templates</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Information Security', 'Acceptable Use', 'Incident Response', 'Data Classification', 'Access Control', 'Business Continuity'].map((template) => (
              <div key={template} className="border border-support-light dark:border-support-dark rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <BookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">{template}</h3>
                </div>
                <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm">
                  Use Template
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted-dark" />
              <input
                type="text"
                placeholder="Search policies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark"
            >
              <option value="all">All Categories</option>
              <option value="Security">Security</option>
              <option value="Data Management">Data Management</option>
              <option value="User Management">User Management</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="review">In Review</option>
              <option value="approved">Approved</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Policies List */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
        <div className="p-6 border-b border-support-light dark:border-support-dark">
          <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">Policies</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {filteredPolicies.length > 0 ? (
              filteredPolicies.map((policy) => (
                <div key={policy.id} className="border border-support-light dark:border-support-dark rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                        <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">{policy.title}</h3>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{policy.type} • Owner: {policy.owner}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(policy.status)}`}>
                      {policy.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span>Version {policy.version}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{policy.lastModified.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-text-secondary-light dark:text-text-secondary-dark hover:bg-support-light dark:hover:bg-surface-dark rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-text-secondary-light dark:text-text-secondary-dark hover:bg-support-light dark:hover:bg-surface-dark rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto text-text-muted-dark mb-4" />
                <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark mb-2">No policies found</h3>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">Get started by creating your first policy</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyGenerator;
