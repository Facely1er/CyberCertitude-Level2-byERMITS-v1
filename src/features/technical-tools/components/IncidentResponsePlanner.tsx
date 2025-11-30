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
      case 'critical': return 'text-error-600 bg-error-100 dark:text-error-400 dark:bg-error-900';
      case 'high': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900';
      case 'low': return 'text-success-600 bg-success-100 dark:text-success-400 dark:bg-success-900';
      default: return 'text-text-secondary-light bg-support-light dark:text-text-muted-dark dark:bg-surface-dark';
    }
  };

  const getResponsibilityColor = (responsibility: string) => {
    switch (responsibility) {
      case 'R': return 'text-primary-600 bg-primary-100 dark:text-primary-400 dark:bg-primary-900';
      case 'A': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900';
      case 'C': return 'text-success-600 bg-success-100 dark:text-success-400 dark:bg-success-900';
      case 'I': return 'text-text-secondary-light bg-support-light dark:text-text-muted-dark dark:bg-surface-dark';
      default: return 'text-text-secondary-light bg-support-light dark:text-text-muted-dark dark:bg-surface-dark';
    }
  };

  const renderOverview = () => {
    if (!plan) return null;

    return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
            Plan Title
          </label>
          <input
            type="text"
            value={plan.title}
              onChange={(e) => setPlan(prev => prev ? { ...prev, title: e.target.value, updated_at: new Date() } : null)}
            className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
            placeholder="Enter plan title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
              Organization
          </label>
          <input
            type="text"
              value={plan.organization}
              onChange={(e) => setPlan(prev => prev ? { ...prev, organization: e.target.value, updated_at: new Date() } : null)}
            className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
              placeholder="Enter organization name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
            Version
          </label>
          <input
            type="text"
            value={plan.version}
              onChange={(e) => setPlan(prev => prev ? { ...prev, version: e.target.value, updated_at: new Date() } : null)}
            className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
            placeholder="Enter version"
          />
        </div>
        <div>
          <label htmlFor="effectiveDate" className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
              Effective Date
          </label>
            <input
              id="effectiveDate"
              type="date"
              value={plan.effectiveDate.toISOString().split('T')[0]}
              onChange={(e) => setPlan(prev => prev ? { ...prev, effectiveDate: new Date(e.target.value), updated_at: new Date() } : null)}
            className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
          />
        </div>
      </div>

        <div className="bg-background-light dark:bg-surface-dark rounded-lg p-6">
          <h4 className="font-medium text-text-primary-light dark:text-text-primary-dark mb-4">Plan Statistics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{plan.classifications.length}</div>
              <div className="text-sm text-text-secondary-light dark:text-text-muted-dark">Classifications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600 dark:text-success-400">{plan.responseTeam.length}</div>
              <div className="text-sm text-text-secondary-light dark:text-text-muted-dark">Team Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{plan.responsePhases.length}</div>
              <div className="text-sm text-text-secondary-light dark:text-text-muted-dark">Response Phases</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{plan.communicationTemplates.length}</div>
              <div className="text-sm text-text-secondary-light dark:text-text-muted-dark">Templates</div>
            </div>
          </div>
        </div>

        <div className="bg-primary-50 dark:bg-primary-900 rounded-lg p-6">
          <h4 className="font-medium text-primary-900 dark:text-primary-100 mb-2">CMMC Compliance Status</h4>
          <p className="text-primary-800 dark:text-primary-200 text-sm mb-4">
            This incident response plan addresses the following CMMC Level 2 controls:
          </p>
        <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200 text-sm rounded-full">IR.L2-3.6.1</span>
            <span className="px-3 py-1 bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200 text-sm rounded-full">IR.L2-3.6.2</span>
            <span className="px-3 py-1 bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200 text-sm rounded-full">IR.L2-3.6.3</span>
            <span className="px-3 py-1 bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200 text-sm rounded-full">AU.L2-3.3.1</span>
            <span className="px-3 py-1 bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200 text-sm rounded-full">AU.L2-3.3.2</span>
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
          <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
            Incident Classifications ({plan.classifications.length})
          </h3>
          <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
            Pre-configured CMMC-compliant classifications
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plan.classifications.map((classification) => (
            <div key={classification.category} className="border border-support-light dark:border-support-dark rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-1">
                    {classification.category.replace(/-/g, ' ').toUpperCase()}
                  </h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(classification.severity)}`}>
                      {classification.severity.toUpperCase()}
                    </span>
                    <span className="px-2 py-1 bg-support-light dark:bg-surface-dark text-text-primary-light dark:text-text-secondary-dark text-xs rounded-full">
                      Priority {classification.priority}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary-light dark:text-text-muted-dark">Response Time:</span>
                  <span className="font-medium text-text-primary-light dark:text-text-primary-dark">{classification.responseTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary-light dark:text-text-muted-dark">CUI Involved:</span>
                  <span className={`font-medium ${classification.cuiInvolved ? 'text-error-600 dark:text-error-400' : 'text-success-600 dark:text-success-400'}`}>
                    {classification.cuiInvolved ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary-light dark:text-text-muted-dark">External Reporting:</span>
                  <span className={`font-medium ${classification.externalReportingRequired ? 'text-error-600 dark:text-error-400' : 'text-success-600 dark:text-success-400'}`}>
                    {classification.externalReportingRequired ? 'Required' : 'Not Required'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary-light dark:text-text-muted-dark">Escalation:</span>
                  <span className={`font-medium ${classification.escalationRequired ? 'text-error-600 dark:text-error-400' : 'text-success-600 dark:text-success-400'}`}>
                    {classification.escalationRequired ? 'Required' : 'Not Required'}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-support-light dark:border-support-dark">
                <div className="text-xs text-text-muted-light dark:text-text-muted-dark mb-2">CMMC Controls:</div>
                <div className="flex flex-wrap gap-1">
                  {classification.cmmcControls.map((control) => (
                    <span key={control} className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs rounded">
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
        <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
            Response Team ({plan.responseTeam.length})
        </h3>
        <button
            onClick={() => setShowForm('team')}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
            Add Team Member
        </button>
      </div>

        {showForm === 'team' && (
          <div className="bg-background-light dark:bg-surface-dark rounded-lg p-6">
            <h4 className="font-medium text-text-primary-light dark:text-text-primary-dark mb-4">Add Team Member</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">Name</label>
                <input
                  type="text"
                  value={newTeamMember.name || ''}
                  onChange={(e) => setNewTeamMember(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">Role</label>
                <input
                  type="text"
                  value={newTeamMember.role || ''}
                  onChange={(e) => setNewTeamMember(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                  placeholder="Enter role"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">Email</label>
                <input
                  type="email"
                  value={newTeamMember.email || ''}
                  onChange={(e) => setNewTeamMember(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">Phone</label>
                <input
                  type="tel"
                  value={newTeamMember.phone || ''}
                  onChange={(e) => setNewTeamMember(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                  placeholder="Enter phone"
                />
              </div>
              <div>
                <label htmlFor="responsibility" className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">Responsibility</label>
                <select
                  id="responsibility"
                  value={newTeamMember.responsibility || 'R'}
                  onChange={(e) => setNewTeamMember(prev => ({ ...prev, responsibility: e.target.value as 'R' | 'A' | 'C' | 'I' }))}
                  className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                >
                  <option value="R">Responsible</option>
                  <option value="A">Accountable</option>
                  <option value="C">Consulted</option>
                  <option value="I">Informed</option>
                </select>
              </div>
              <div>
                <label htmlFor="escalationLevel" className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">Escalation Level</label>
                <select
                  id="escalationLevel"
                  value={newTeamMember.escalationLevel || 1}
                  onChange={(e) => setNewTeamMember(prev => ({ ...prev, escalationLevel: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
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
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add Member
              </button>
              <button
                onClick={() => setShowForm(null)}
                className="px-4 py-2 bg-support-light text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Cancel
              </button>
            </div>
        </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plan.responseTeam.map((member) => (
            <div key={member.id} className="border border-support-light dark:border-support-dark rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-1">{member.name}</h4>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2">{member.role}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getResponsibilityColor(member.responsibility)}`}>
                      {member.responsibility === 'R' ? 'Responsible' : member.responsibility === 'A' ? 'Accountable' : member.responsibility === 'C' ? 'Consulted' : 'Informed'}
                    </span>
                    <span className="px-2 py-1 bg-support-light dark:bg-surface-dark text-text-primary-light dark:text-text-secondary-dark text-xs rounded-full">
                      Level {member.escalationLevel}
                      </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-text-muted-dark" />
                  <span className="text-text-secondary-light dark:text-text-muted-dark">{member.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-text-muted-dark" />
                  <span className="text-text-secondary-light dark:text-text-muted-dark">{member.phone}</span>
                </div>
                {member.availability && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-text-muted-dark" />
                    <span className="text-text-secondary-light dark:text-text-muted-dark">{member.availability}</span>
                  </div>
                )}
              </div>

              {member.skills.length > 0 && (
                <div className="mt-3 pt-3 border-t border-support-light dark:border-support-dark">
                  <div className="text-xs text-text-muted-light dark:text-text-muted-dark mb-2">Skills:</div>
                  <div className="flex flex-wrap gap-1">
                    {member.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-success-100 dark:bg-success-900 text-success-800 dark:text-success-200 text-xs rounded">
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
          <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
            Response Phases ({plan.responsePhases.length})
          </h3>
          <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
            Pre-configured CMMC-compliant response phases
          </div>
        </div>

        <div className="space-y-4">
          {plan.responsePhases.map((phase) => (
            <div key={phase.phase} className="border border-support-light dark:border-support-dark rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-primary-500" />
                    <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark text-lg">
                      {phase.name}
                    </h4>
                    <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs rounded-full">
                      {phase.estimatedDuration}
                    </span>
                  </div>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark mb-3">
                    {phase.description}
                  </p>
                </div>
                <button
                  onClick={() => toggleSection(phase.phase)}
                  className="p-2 text-text-muted-light hover:text-primary-600 transition-colors"
                >
                  {expandedSections.has(phase.phase) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              </div>

              {expandedSections.has(phase.phase) && (
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-text-primary-light dark:text-text-primary-dark mb-2">Objectives</h5>
                    <ul className="list-disc list-inside text-sm text-text-secondary-light dark:text-text-secondary-dark space-y-1">
                      {phase.objectives.map((objective, index) => (
                        <li key={index}>{objective}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium text-text-primary-light dark:text-text-primary-dark mb-2">Key Activities</h5>
                    <div className="space-y-3">
                      {phase.activities.map((activity) => (
                        <div key={activity.id} className="bg-background-light dark:bg-surface-dark rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h6 className="font-medium text-text-primary-light dark:text-text-primary-dark">{activity.name}</h6>
                            <span className="text-xs text-text-muted-light dark:text-text-muted-dark">{activity.estimatedDuration}</span>
                          </div>
                          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2">{activity.description}</p>
                          <div className="text-xs text-text-muted-light dark:text-text-muted-dark">
                            <span className="font-medium">Responsible:</span> {activity.responsibleRole}
                            {activity.cmmcControl && (
                              <span className="ml-2 px-2 py-1 bg-success-100 dark:bg-success-900 text-success-800 dark:text-success-200 rounded">
                                {activity.cmmcControl}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-text-primary-light dark:text-text-primary-dark mb-2">Success Criteria</h5>
                    <ul className="list-disc list-inside text-sm text-text-secondary-light dark:text-text-secondary-dark space-y-1">
                      {phase.successCriteria.map((criteria, index) => (
                        <li key={index}>{criteria}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium text-text-primary-light dark:text-text-primary-dark mb-2">CMMC Controls</h5>
                    <div className="flex flex-wrap gap-2">
                      {phase.cmmcControls.map((control) => (
                        <span key={control} className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs rounded">
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
          <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
            Communication Templates ({plan.communicationTemplates.length})
          </h3>
          <button
            onClick={() => setShowForm('template')}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Template
          </button>
        </div>

        {showForm === 'template' && (
          <div className="bg-background-light dark:bg-surface-dark rounded-lg p-6">
            <h4 className="font-medium text-text-primary-light dark:text-text-primary-dark mb-4">Add Communication Template</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">Name</label>
                <input
                  type="text"
                  value={newTemplate.name || ''}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                  placeholder="Enter template name"
                />
              </div>
              <div>
                <label htmlFor="templateType" className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">Type</label>
                <select
                  id="templateType"
                  value={newTemplate.type || 'internal'}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                >
                  <option value="internal">Internal</option>
                  <option value="executive">Executive</option>
                  <option value="external">External</option>
                  <option value="regulatory">Regulatory</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">Subject</label>
                <input
                  type="text"
                  value={newTemplate.subject || ''}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                  placeholder="Enter email subject"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">Body</label>
                <textarea
                  value={newTemplate.body || ''}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, body: e.target.value }))}
                  rows={6}
                  className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
                  placeholder="Enter email body template"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">Send Timing</label>
                <input
                  type="text"
                  value={newTemplate.sendTiming || ''}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, sendTiming: e.target.value }))}
                  className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-surface-dark dark:text-text-primary-dark"
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
                <label htmlFor="approvalRequired" className="text-sm font-medium text-text-primary-light dark:text-text-secondary-dark">Approval Required</label>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={addCommunicationTemplate}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add Template
              </button>
              <button
                onClick={() => setShowForm(null)}
                className="px-4 py-2 bg-support-light text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {plan.communicationTemplates.map((template) => (
            <div key={template.id} className="border border-support-light dark:border-support-dark rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-1">{template.name}</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs rounded-full">
                      {template.type.toUpperCase()}
                    </span>
                    <span className="px-2 py-1 bg-support-light dark:bg-surface-dark text-text-primary-light dark:text-text-secondary-dark text-xs rounded-full">
                      {template.sendTiming}
                    </span>
                    {template.approvalRequired && (
                      <span className="px-2 py-1 bg-error-100 dark:bg-error-900 text-error-800 dark:text-error-200 text-xs rounded-full">
                        APPROVAL REQUIRED
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(template.body)}
                  className="p-2 text-text-muted-light hover:text-primary-600 transition-colors"
                  title="Copy template"
                >
                  {copiedText === template.body ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-text-primary-light dark:text-text-secondary-dark">Subject:</span>
                  <span className="ml-2 text-text-secondary-light dark:text-text-muted-dark">{template.subject}</span>
                </div>
                <div>
                  <span className="font-medium text-text-primary-light dark:text-text-secondary-dark">Recipients:</span>
                  <span className="ml-2 text-text-secondary-light dark:text-text-muted-dark">{template.recipients.join(', ')}</span>
                </div>
                {template.cmmcRequirement && (
                  <div>
                    <span className="font-medium text-text-primary-light dark:text-text-secondary-dark">CMMC Requirement:</span>
                    <span className="ml-2 px-2 py-1 bg-success-100 dark:bg-success-900 text-success-800 dark:text-success-200 text-xs rounded">
                      {template.cmmcRequirement}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-support-light dark:border-support-dark">
                <div className="text-xs text-text-muted-light dark:text-text-muted-dark mb-2">Template Body:</div>
                <pre className="bg-background-light dark:bg-surface-dark p-3 rounded text-xs text-text-primary-light dark:text-text-secondary-dark whitespace-pre-wrap overflow-x-auto">
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
        <div className="text-center py-8 text-text-muted-light dark:text-text-muted-dark">
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
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-support-light dark:border-support-dark">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-error-600" />
                Enhanced Incident Response Planner
              </h1>
              <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
                Comprehensive CMMC Level 2 compliant incident response planning and management
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onSave?.(plan)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Plan
              </button>
              <button
                onClick={() => onExport?.(plan)}
                className="flex items-center gap-2 px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-support-light dark:border-support-dark">
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
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-text-muted-light hover:text-text-primary-light hover:border-support-light dark:text-text-muted-dark dark:hover:text-text-secondary-dark'
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
            <div className="text-center py-8 text-text-muted-light dark:text-text-muted-dark">
              Escalation procedures management coming soon.
            </div>
          )}
          {activeTab === 'communications' && renderCommunications()}
          {activeTab === 'testing' && (
            <div className="text-center py-8 text-text-muted-light dark:text-text-muted-dark">
              Testing schedule management coming soon.
            </div>
          )}
          {activeTab === 'training' && (
            <div className="text-center py-8 text-text-muted-light dark:text-text-muted-dark">
              Training requirements management coming soon.
            </div>
          )}
          {activeTab === 'cmmc' && (
            <div className="text-center py-8 text-text-muted-light dark:text-text-muted-dark">
              CMMC compliance mapping coming soon.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentResponsePlanner;