import React, { useState, useEffect } from 'react';
import { GraduationCap, Plus, Download, Edit, Trash2, Search, Filter, CheckCircle, Clock, AlertTriangle, Users, BookOpen, Calendar } from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';

interface Training {
  id: string;
  title: string;
  category: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'overdue';
  scheduledDate: Date;
  completionDate: Date | null;
  participants: number;
  completed: number;
  owner: string;
  description: string;
}

const TrainingTracker: React.FC = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    // Initialize with sample data
    const sampleTrainings: Training[] = [
      {
        id: '1',
        title: 'Security Awareness Training',
        category: 'Security',
        status: 'completed',
        scheduledDate: new Date('2024-01-15'),
        completionDate: new Date('2024-01-20'),
        participants: 45,
        completed: 45,
        owner: 'Training Team',
        description: 'Annual security awareness training for all employees'
      },
      {
        id: '2',
        title: 'CMMC Compliance Training',
        category: 'Compliance',
        status: 'in-progress',
        scheduledDate: new Date('2024-01-25'),
        completionDate: null,
        participants: 20,
        completed: 12,
        owner: 'Compliance Team',
        description: 'CMMC 2.0 Level 2 compliance training for security team'
      },
      {
        id: '3',
        title: 'Data Classification Workshop',
        category: 'Data Management',
        status: 'scheduled',
        scheduledDate: new Date('2024-02-01'),
        completionDate: null,
        participants: 15,
        completed: 0,
        owner: 'Data Team',
        description: 'Workshop on data classification and handling procedures'
      },
      {
        id: '4',
        title: 'Incident Response Training',
        category: 'Security',
        status: 'overdue',
        scheduledDate: new Date('2024-01-10'),
        completionDate: null,
        participants: 10,
        completed: 3,
        owner: 'Security Team',
        description: 'Incident response procedures and escalation training'
      }
    ];
    setTrainings(sampleTrainings);
  }, []);

  const filteredTrainings = trainings.filter(training => {
    const matchesSearch = training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          training.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || training.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || training.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'in-progress': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'scheduled': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'overdue': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
    }
  };

  const stats = {
    total: trainings.length,
    completed: trainings.filter(t => t.status === 'completed').length,
    inProgress: trainings.filter(t => t.status === 'in-progress').length,
    overdue: trainings.filter(t => t.status === 'overdue').length
  };

  const breadcrumbs = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Implementation', path: '/implementation/overview' },
    { label: 'Training Tracker', isActive: true }
  ];

  return (
    <div className="container-responsive section-padding">
      {/* Breadcrumbs */}
      <div className="mb-8">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-xl">
                <GraduationCap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Training Tracker</h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Track training completion and certifications
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <Plus className="w-4 h-4" />
                <span>New Training</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <GraduationCap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Trainings</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Completed</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">In Progress</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.inProgress}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Overdue</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.overdue}</p>
        </div>
      </div>

      {/* Training Catalog */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Training Catalog</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Security Awareness', 'CMMC Compliance', 'Data Protection', 'Incident Response', 'Access Control', 'Business Continuity'].map((training) => (
              <div key={training} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{training}</h3>
                </div>
                <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                  Enroll Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search trainings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Categories</option>
              <option value="Security">Security</option>
              <option value="Compliance">Compliance</option>
              <option value="Data Management">Data Management</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Training List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Training Sessions</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {filteredTrainings.length > 0 ? (
              filteredTrainings.map((training) => {
                const progress = training.participants > 0 ? (training.completed / training.participants) * 100 : 0;
                return (
                  <div key={training.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <GraduationCap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{training.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{training.category} • Owner: {training.owner}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(training.status)}`}>
                        {training.status}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-300">Progress: {training.completed}/{training.participants} participants</span>
                        <span className="text-gray-600 dark:text-gray-300">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{training.scheduledDate.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>{training.participants} enrolled</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <GraduationCap className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No training sessions found</h3>
                <p className="text-gray-600 dark:text-gray-300">Get started by creating your first training session</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingTracker;
