import React, { useState } from 'react';
import { TriangleAlert as AlertTriangle, Plus, CreditCard as Edit, Trash2, Save, Download, Clock, Users, FileText, CircleCheck as CheckCircle } from 'lucide-react';
import { Breadcrumbs } from '../../../shared/components/layout/Breadcrumbs';

interface IncidentResponsePlannerProps {
  onSave?: (plan: any) => void;
  onExport?: (plan: any) => void;
}

interface IncidentPhase {
  id: string;
  name: string;
  description: string;
  order: number;
  duration: string;
  activities: IncidentActivity[];
  deliverables: string[];
  successCriteria: string[];
}

interface IncidentActivity {
  id: string;
  title: string;
  description: string;
  responsible: string;
  duration: string;
  dependencies: string[];
  tools: string[];
  documentation: string[];
}

interface IncidentRole {
  id: string;
  name: string;
  description: string;
  responsibilities: string[];
  skills: string[];
  training: string[];
  escalation: string;
}

interface IncidentContact {
  id: string;
  name: string;
  role: string;
  organization: string;
  phone: string;
  email: string;
  availability: string;
  escalation: boolean;
  priority: 'primary' | 'secondary' | 'tertiary';
}

const INCIDENT_CATEGORIES = [
  'Data Breach', 'Malware', 'DDoS', 'Insider Threat', 'Physical Security',
  'System Compromise', 'Social Engineering', 'Supply Chain', 'Cloud Security', 'Other'
] as const;

const INCIDENT_SEVERITIES = ['critical', 'high', 'medium', 'low'] as const;

const IncidentResponsePlanner: React.FC<IncidentResponsePlannerProps> = ({
  onSave,
  onExport
}) => {
  const [plan, setPlan] = useState({
    id: '',
    title: '',
    description: '',
    organizationId: '',
    version: '1.0',
    phases: [] as IncidentPhase[],
    roles: [] as IncidentRole[],
    contacts: [] as IncidentContact[],
    procedures: [] as any[],
    templates: [] as any[],
    createdDate: new Date(),
    lastUpdated: new Date(),
    status: 'draft' as const,
    author: '',
    tags: [] as string[]
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'phases' | 'roles' | 'contacts' | 'procedures'>('overview');
  const [showPhaseForm, setShowPhaseForm] = useState(false);
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [editingPhase, setEditingPhase] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [editingContact, setEditingContact] = useState<string | null>(null);

  const [newPhase, setNewPhase] = useState<Partial<IncidentPhase>>({
    name: '',
    description: '',
    order: 0,
    duration: '',
    activities: [],
    deliverables: [],
    successCriteria: []
  });

  const [newRole, setNewRole] = useState<Partial<IncidentRole>>({
    name: '',
    description: '',
    responsibilities: [],
    skills: [],
    training: [],
    escalation: ''
  });

  const [newContact, setNewContact] = useState<Partial<IncidentContact>>({
    name: '',
    role: '',
    organization: '',
    phone: '',
    email: '',
    availability: '',
    escalation: false,
    priority: 'primary'
  });

  const [newTag, setNewTag] = useState('');

  const addPhase = () => {
    if (!newPhase.name || !newPhase.description) return;

    const phase: IncidentPhase = {
      id: Date.now().toString(),
      name: newPhase.name!,
      description: newPhase.description!,
      order: plan.phases.length + 1,
      duration: newPhase.duration || '',
      activities: [],
      deliverables: [],
      successCriteria: []
    };

    setPlan(prev => ({
      ...prev,
      phases: [...prev.phases, phase],
      lastUpdated: new Date()
    }));

    setNewPhase({
      name: '',
      description: '',
      order: 0,
      duration: '',
      activities: [],
      deliverables: [],
      successCriteria: []
    });
    setShowPhaseForm(false);
  };

  const addRole = () => {
    if (!newRole.name || !newRole.description) return;

    const role: IncidentRole = {
      id: Date.now().toString(),
      name: newRole.name!,
      description: newRole.description!,
      responsibilities: newRole.responsibilities || [],
      skills: newRole.skills || [],
      training: newRole.training || [],
      escalation: newRole.escalation || ''
    };

    setPlan(prev => ({
      ...prev,
      roles: [...prev.roles, role],
      lastUpdated: new Date()
    }));

    setNewRole({
      name: '',
      description: '',
      responsibilities: [],
      skills: [],
      training: [],
      escalation: ''
    });
    setShowRoleForm(false);
  };

  const addContact = () => {
    if (!newContact.name || !newContact.role || !newContact.email) return;

    const contact: IncidentContact = {
      id: Date.now().toString(),
      name: newContact.name!,
      role: newContact.role!,
      organization: newContact.organization || '',
      phone: newContact.phone || '',
      email: newContact.email!,
      availability: newContact.availability || '',
      escalation: newContact.escalation || false,
      priority: newContact.priority || 'primary'
    };

    setPlan(prev => ({
      ...prev,
      contacts: [...prev.contacts, contact],
      lastUpdated: new Date()
    }));

    setNewContact({
      name: '',
      role: '',
      organization: '',
      phone: '',
      email: '',
      availability: '',
      escalation: false,
      priority: 'primary'
    });
    setShowContactForm(false);
  };

  const addTag = () => {
    if (newTag.trim()) {
      setPlan(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setPlan(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'primary': return 'text-red-600 bg-red-100';
      case 'secondary': return 'text-yellow-600 bg-yellow-100';
      case 'tertiary': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Plan Title
          </label>
          <input
            type="text"
            value={plan.title}
            onChange={(e) => setPlan(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter plan title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Author
          </label>
          <input
            type="text"
            value={plan.author}
            onChange={(e) => setPlan(prev => ({ ...prev, author: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter author name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Version
          </label>
          <input
            type="text"
            value={plan.version}
            onChange={(e) => setPlan(prev => ({ ...prev, version: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter version"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            value={plan.status}
            onChange={(e) => setPlan(prev => ({ ...prev, status: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="draft">Draft</option>
            <option value="approved">Approved</option>
            <option value="active">Active</option>
            <option value="deprecated">Deprecated</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={plan.description}
            onChange={(e) => setPlan(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter plan description"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tags
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTag()}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter tag"
          />
          <button
            onClick={addTag}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {plan.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
            >
              {tag}
              <button
                onClick={() => removeTag(index)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                <XCircle className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Plan Statistics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Phases:</span>
            <p className="text-gray-600 dark:text-gray-400">{plan.phases.length}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Roles:</span>
            <p className="text-gray-600 dark:text-gray-400">{plan.roles.length}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Contacts:</span>
            <p className="text-gray-600 dark:text-gray-400">{plan.contacts.length}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Procedures:</span>
            <p className="text-gray-600 dark:text-gray-400">{plan.procedures.length}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPhases = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Incident Response Phases ({plan.phases.length})
        </h3>
        <button
          onClick={() => setShowPhaseForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Phase
        </button>
      </div>

      {plan.phases.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No phases added yet. Click "Add Phase" to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {plan.phases.map((phase) => (
            <div key={phase.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {phase.name}
                    </h4>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                      Phase {phase.order}
                    </span>
                    {phase.duration && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                        {phase.duration}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    {phase.description}
                  </p>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Activities: {phase.activities.length} | Deliverables: {phase.deliverables.length} | Success Criteria: {phase.successCriteria.length}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingPhase(phase.id)}
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPlan(prev => ({
                      ...prev,
                      phases: prev.phases.filter(p => p.id !== phase.id),
                      lastUpdated: new Date()
                    }))}
                    className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderRoles = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Incident Response Roles ({plan.roles.length})
        </h3>
        <button
          onClick={() => setShowRoleForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Role
        </button>
      </div>

      {plan.roles.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No roles added yet. Click "Add Role" to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {plan.roles.map((role) => (
            <div key={role.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-green-500" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {role.name}
                    </h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    {role.description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div>
                      <span className="font-medium">Responsibilities:</span> {role.responsibilities.length}
                    </div>
                    <div>
                      <span className="font-medium">Skills:</span> {role.skills.length}
                    </div>
                    <div>
                      <span className="font-medium">Training:</span> {role.training.length}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingRole(role.id)}
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPlan(prev => ({
                      ...prev,
                      roles: prev.roles.filter(r => r.id !== role.id),
                      lastUpdated: new Date()
                    }))}
                    className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderContacts = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Incident Response Contacts ({plan.contacts.length})
        </h3>
        <button
          onClick={() => setShowContactForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Contact
        </button>
      </div>

      {plan.contacts.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No contacts added yet. Click "Add Contact" to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {plan.contacts.map((contact) => (
            <div key={contact.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-purple-500" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {contact.name}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(contact.priority)}`}>
                      {contact.priority.toUpperCase()}
                    </span>
                    {contact.escalation && (
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded-full">
                        ESCALATION
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div>
                      <span className="font-medium">Role:</span> {contact.role}
                    </div>
                    <div>
                      <span className="font-medium">Organization:</span> {contact.organization}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span> {contact.phone}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {contact.email}
                    </div>
                    <div>
                      <span className="font-medium">Availability:</span> {contact.availability}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingContact(contact.id)}
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPlan(prev => ({
                      ...prev,
                      contacts: prev.contacts.filter(c => c.id !== contact.id),
                      lastUpdated: new Date()
                    }))}
                    className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const breadcrumbs = [
    { label: 'Technical Tools', path: '/incident-response' },
    { label: 'Incident Response Planner', isActive: true }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                Incident Response Planner
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Plan and manage incident response procedures for CMMC compliance
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onSave?.(plan)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Plan
              </button>
              <button
                onClick={() => onExport?.(plan)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: FileText },
              { id: 'phases', label: 'Phases', icon: Clock },
              { id: 'roles', label: 'Roles', icon: Users },
              { id: 'contacts', label: 'Contacts', icon: Users },
              { id: 'procedures', label: 'Procedures', icon: CheckCircle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'phases' && renderPhases()}
          {activeTab === 'roles' && renderRoles()}
          {activeTab === 'contacts' && renderContacts()}
          {activeTab === 'procedures' && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Procedures management coming soon.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentResponsePlanner;