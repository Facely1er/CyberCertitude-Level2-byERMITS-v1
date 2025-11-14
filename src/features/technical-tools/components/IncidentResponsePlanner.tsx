import React, { useState, useEffect } from 'react';
import { TriangleAlert as AlertTriangle, Plus, Save, Download, Clock, Users, FileText, CircleCheck as CheckCircle, Shield, Target, AlertCircle, Phone, Mail, Calendar, BarChart3, ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';
import { Breadcrumbs } from '../../../shared/components/layout/Breadcrumbs';
import { LoadingSpinner } from '../../../shared/components/ui/LoadingSpinner';
import { ErrorState } from '../../../shared/components/ui/LoadingStates';
import incidentResponseService, { IncidentResponsePlan, ResponseTeamMember, CommunicationTemplate } from '../../../services/incidentResponseService';

interface IncidentResponsePlannerProps {
  onSave?: (plan: IncidentResponsePlan) => void;
  onExport?: (plan: IncidentResponsePlan) => void;
}

const IncidentResponsePlanner: React.FC<IncidentResponsePlannerProps> = ({
  onSave,
  onExport
}) => {
  const [plan, setPlan] = useState<IncidentResponsePlan | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'classifications' | 'team' | 'phases' | 'escalation' | 'communications' | 'testing' | 'training' | 'cmmc'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));
  const [showForm, setShowForm] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Form states
  const [newTeamMember, setNewTeamMember] = useState<Partial<ResponseTeamMember>>({
    name: '',
    role: '',
    email: '',
    phone: '',
    responsibility: 'R',
    skills: [],
    availability: '',
    escalationLevel: 1
  });

  const [newTemplate, setNewTemplate] = useState<Partial<CommunicationTemplate>>({
    name: '',
    type: 'internal',
    subject: '',
    body: '',
    recipients: [],
    sendTiming: '',
    approvalRequired: false
  });

  useEffect(() => {
    initializePlan();
  }, []);

  const initializePlan = async () => {
    try {
      setIsLoading(true);
      const newPlan = await incidentResponseService.createIncidentResponsePlan({
        title: 'CMMC Level 2 Incident Response Plan',
        organization: 'Your Organization',
        version: '1.0'
      });
      setPlan(newPlan);
    } catch (err) {
      setError('Failed to initialize incident response plan');
      console.error('Error initializing plan:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const addTeamMember = () => {
    if (!plan || !newTeamMember.name || !newTeamMember.email) return;

    const member: ResponseTeamMember = {
      id: crypto.randomUUID(),
      name: newTeamMember.name!,
      role: newTeamMember.role || '',
      email: newTeamMember.email!,
      phone: newTeamMember.phone || '',
      responsibility: newTeamMember.responsibility || 'R',
      skills: newTeamMember.skills || [],
      availability: newTeamMember.availability || '',
      escalationLevel: newTeamMember.escalationLevel || 1
    };

    setPlan(prev => prev ? {
      ...prev,
      responseTeam: [...prev.responseTeam, member],
      updated_at: new Date()
    } : null);

    setNewTeamMember({
      name: '',
      role: '',
      email: '',
      phone: '',
      responsibility: 'R',
      skills: [],
      availability: '',
      escalationLevel: 1
    });
    setShowForm(null);
  };

  const addCommunicationTemplate = () => {
    if (!plan || !newTemplate.name || !newTemplate.subject) return;

    const template: CommunicationTemplate = {
      id: crypto.randomUUID(),
      name: newTemplate.name!,
      type: newTemplate.type || 'internal',
      subject: newTemplate.subject!,
      body: newTemplate.body || '',
      recipients: newTemplate.recipients || [],
      sendTiming: newTemplate.sendTiming || '',
      approvalRequired: newTemplate.approvalRequired || false
    };

    setPlan(prev => prev ? {
      ...prev,
      communicationTemplates: [...prev.communicationTemplates, template],
      updated_at: new Date()
    } : null);

    setNewTemplate({
      name: '',
      type: 'internal',
      subject: '',
      body: '',
      recipients: [],
      sendTiming: '',
      approvalRequired: false
    });
    setShowForm(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900';
      case 'high': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900';
      case 'low': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
    }
  };

  const getResponsibilityColor = (responsibility: string) => {
    switch (responsibility) {
      case 'R': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900';
      case 'A': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900';
      case 'C': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900';
      case 'I': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
    }
  };

  const renderOverview = () => {
    if (!plan) return null;

    return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Plan Title
          </label>
          <input
            type="text"
            value={plan.title}
              onChange={(e) => setPlan(prev => prev ? { ...prev, title: e.target.value, updated_at: new Date() } : null)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter plan title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Organization
          </label>
          <input
            type="text"
              value={plan.organization}
              onChange={(e) => setPlan(prev => prev ? { ...prev, organization: e.target.value, updated_at: new Date() } : null)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter organization name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Version
          </label>
          <input
            type="text"
            value={plan.version}
              onChange={(e) => setPlan(prev => prev ? { ...prev, version: e.target.value, updated_at: new Date() } : null)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter version"
          />
        </div>
        <div>
          <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Effective Date
          </label>
            <input
              id="effectiveDate"
              type="date"
              value={plan.effectiveDate.toISOString().split('T')[0]}
              onChange={(e) => setPlan(prev => prev ? { ...prev, effectiveDate: new Date(e.target.value), updated_at: new Date() } : null)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">Plan Statistics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{plan.classifications.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Classifications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{plan.responseTeam.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Team Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{plan.responsePhases.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Response Phases</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{plan.communicationTemplates.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Templates</div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">CMMC Compliance Status</h4>
          <p className="text-blue-800 dark:text-blue-200 text-sm mb-4">
            This incident response plan addresses the following CMMC Level 2 controls:
          </p>
        <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-sm rounded-full">IR.L2-3.6.1</span>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-sm rounded-full">IR.L2-3.6.2</span>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-sm rounded-full">IR.L2-3.6.3</span>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-sm rounded-full">AU.L2-3.3.1</span>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-sm rounded-full">AU.L2-3.3.2</span>
          </div>
        </div>
      </div>
    );
  };

  const renderClassifications = () => {
    if (!plan) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Incident Classifications ({plan.classifications.length})
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Pre-configured CMMC-compliant classifications
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plan.classifications.map((classification) => (
            <div key={classification.category} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {classification.category.replace(/-/g, ' ').toUpperCase()}
                  </h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(classification.severity)}`}>
                      {classification.severity.toUpperCase()}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                      Priority {classification.priority}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Response Time:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{classification.responseTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">CUI Involved:</span>
                  <span className={`font-medium ${classification.cuiInvolved ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    {classification.cuiInvolved ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">External Reporting:</span>
                  <span className={`font-medium ${classification.externalReportingRequired ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    {classification.externalReportingRequired ? 'Required' : 'Not Required'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Escalation:</span>
                  <span className={`font-medium ${classification.escalationRequired ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    {classification.escalationRequired ? 'Required' : 'Not Required'}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">CMMC Controls:</div>
                <div className="flex flex-wrap gap-1">
                  {classification.cmmcControls.map((control) => (
                    <span key={control} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                      {control}
                    </span>
                  ))}
          </div>
          </div>
          </div>
          ))}
      </div>
    </div>
  );
  };

  const renderTeam = () => {
    if (!plan) return null;

    return (
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Response Team ({plan.responseTeam.length})
        </h3>
        <button
            onClick={() => setShowForm('team')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
            Add Team Member
        </button>
      </div>

        {showForm === 'team' && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Add Team Member</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={newTeamMember.name || ''}
                  onChange={(e) => setNewTeamMember(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
                <input
                  type="text"
                  value={newTeamMember.role || ''}
                  onChange={(e) => setNewTeamMember(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter role"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={newTeamMember.email || ''}
                  onChange={(e) => setNewTeamMember(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                <input
                  type="tel"
                  value={newTeamMember.phone || ''}
                  onChange={(e) => setNewTeamMember(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter phone"
                />
              </div>
              <div>
                <label htmlFor="responsibility" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Responsibility</label>
                <select
                  id="responsibility"
                  value={newTeamMember.responsibility || 'R'}
                  onChange={(e) => setNewTeamMember(prev => ({ ...prev, responsibility: e.target.value as 'R' | 'A' | 'C' | 'I' }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="R">Responsible</option>
                  <option value="A">Accountable</option>
                  <option value="C">Consulted</option>
                  <option value="I">Informed</option>
                </select>
              </div>
              <div>
                <label htmlFor="escalationLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Escalation Level</label>
                <select
                  id="escalationLevel"
                  value={newTeamMember.escalationLevel || 1}
                  onChange={(e) => setNewTeamMember(prev => ({ ...prev, escalationLevel: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value={1}>Level 1 - Initial Response</option>
                  <option value={2}>Level 2 - Security Team Lead</option>
                  <option value={3}>Level 3 - CISO/Executive</option>
                  <option value={4}>Level 4 - External Authorities</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={addTeamMember}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Member
              </button>
              <button
                onClick={() => setShowForm(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
        </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plan.responseTeam.map((member) => (
            <div key={member.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{member.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{member.role}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getResponsibilityColor(member.responsibility)}`}>
                      {member.responsibility === 'R' ? 'Responsible' : member.responsibility === 'A' ? 'Accountable' : member.responsibility === 'C' ? 'Consulted' : 'Informed'}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                      Level {member.escalationLevel}
                      </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">{member.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">{member.phone}</span>
                </div>
                {member.availability && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">{member.availability}</span>
                  </div>
                )}
              </div>

              {member.skills.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Skills:</div>
                  <div className="flex flex-wrap gap-1">
                    {member.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
    </div>
  );
  };

  const renderPhases = () => {
    if (!plan) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Response Phases ({plan.responsePhases.length})
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Pre-configured CMMC-compliant response phases
          </div>
        </div>

        <div className="space-y-4">
          {plan.responsePhases.map((phase) => (
            <div key={phase.phase} className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                      {phase.name}
                    </h4>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                      {phase.estimatedDuration}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    {phase.description}
                  </p>
                </div>
                <button
                  onClick={() => toggleSection(phase.phase)}
                  className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                >
                  {expandedSections.has(phase.phase) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              </div>

              {expandedSections.has(phase.phase) && (
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">Objectives</h5>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      {phase.objectives.map((objective, index) => (
                        <li key={index}>{objective}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">Key Activities</h5>
                    <div className="space-y-3">
                      {phase.activities.map((activity) => (
                        <div key={activity.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h6 className="font-medium text-gray-900 dark:text-white">{activity.name}</h6>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{activity.estimatedDuration}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{activity.description}</p>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            <span className="font-medium">Responsible:</span> {activity.responsibleRole}
                            {activity.cmmcControl && (
                              <span className="ml-2 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                                {activity.cmmcControl}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">Success Criteria</h5>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      {phase.successCriteria.map((criteria, index) => (
                        <li key={index}>{criteria}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">CMMC Controls</h5>
                    <div className="flex flex-wrap gap-2">
                      {phase.cmmcControls.map((control) => (
                        <span key={control} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                          {control}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCommunications = () => {
    if (!plan) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Communication Templates ({plan.communicationTemplates.length})
          </h3>
          <button
            onClick={() => setShowForm('template')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Template
          </button>
        </div>

        {showForm === 'template' && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Add Communication Template</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={newTemplate.name || ''}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter template name"
                />
              </div>
              <div>
                <label htmlFor="templateType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
                <select
                  id="templateType"
                  value={newTemplate.type || 'internal'}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="internal">Internal</option>
                  <option value="executive">Executive</option>
                  <option value="external">External</option>
                  <option value="regulatory">Regulatory</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                <input
                  type="text"
                  value={newTemplate.subject || ''}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter email subject"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Body</label>
                <textarea
                  value={newTemplate.body || ''}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, body: e.target.value }))}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter email body template"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Send Timing</label>
                <input
                  type="text"
                  value={newTemplate.sendTiming || ''}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, sendTiming: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Immediate, Within 1 hour"
                />
              </div>
              <div className="flex items-center">
                <input
                  id="approvalRequired"
                  type="checkbox"
                  checked={newTemplate.approvalRequired || false}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, approvalRequired: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="approvalRequired" className="text-sm font-medium text-gray-700 dark:text-gray-300">Approval Required</label>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={addCommunicationTemplate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Template
              </button>
              <button
                onClick={() => setShowForm(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {plan.communicationTemplates.map((template) => (
            <div key={template.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{template.name}</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                      {template.type.toUpperCase()}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                      {template.sendTiming}
                    </span>
                    {template.approvalRequired && (
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded-full">
                        APPROVAL REQUIRED
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(template.body)}
                  className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  title="Copy template"
                >
                  {copiedText === template.body ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Subject:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">{template.subject}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Recipients:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">{template.recipients.join(', ')}</span>
                </div>
                {template.cmmcRequirement && (
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">CMMC Requirement:</span>
                    <span className="ml-2 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded">
                      {template.cmmcRequirement}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Template Body:</div>
                <pre className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap overflow-x-auto">
                  {template.body}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const breadcrumbs = [
    { label: 'Technical Tools', path: '/incident-response' },
    { label: 'Incident Response Planner', isActive: true }
  ];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" message="Loading incident response plan..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState error={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No incident response plan available.
        </div>
      </div>
    );
  }

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
                Enhanced Incident Response Planner
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Comprehensive CMMC Level 2 compliant incident response planning and management
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
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: FileText },
              { id: 'classifications', label: 'Classifications', icon: Target },
              { id: 'team', label: 'Response Team', icon: Users },
              { id: 'phases', label: 'Response Phases', icon: Clock },
              { id: 'escalation', label: 'Escalation', icon: AlertCircle },
              { id: 'communications', label: 'Communications', icon: Mail },
              { id: 'testing', label: 'Testing', icon: CheckCircle },
              { id: 'training', label: 'Training', icon: Shield },
              { id: 'cmmc', label: 'CMMC Mapping', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
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
          {activeTab === 'classifications' && renderClassifications()}
          {activeTab === 'team' && renderTeam()}
          {activeTab === 'phases' && renderPhases()}
          {activeTab === 'escalation' && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Escalation procedures management coming soon.
            </div>
          )}
          {activeTab === 'communications' && renderCommunications()}
          {activeTab === 'testing' && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Testing schedule management coming soon.
            </div>
          )}
          {activeTab === 'training' && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Training requirements management coming soon.
            </div>
          )}
          {activeTab === 'cmmc' && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              CMMC compliance mapping coming soon.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentResponsePlanner;