import React, { useState, useEffect } from 'react';
import { TriangleAlert as AlertTriangle, Plus, Download, Save, FileText, Users, Shield, Clock, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Mail, Phone, Circle as XCircle } from 'lucide-react';
import { Breadcrumbs } from '../../../shared/components/layout/Breadcrumbs';
import incidentResponseService, {
  IncidentResponsePlan,
  IncidentClassification,
  ResponseTeamMember,
  CommunicationTemplate,
  EscalationProcedure
} from '../../../services/incidentResponseService';

const EnhancedIncidentResponsePlanGenerator: React.FC = () => {
  const [plan, setPlan] = useState<IncidentResponsePlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'classifications' | 'team' | 'communications' | 'escalation' | 'phases' | 'cmmc'
  >('overview');
  const [organizationName, setOrganizationName] = useState('');
  const [version, setVersion] = useState('1.0');

  const [editingClassification, setEditingClassification] = useState<IncidentClassification | null>(
    null
  );
  const [editingTeamMember, setEditingTeamMember] = useState<ResponseTeamMember | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<CommunicationTemplate | null>(null);

  useEffect(() => {
    initializePlan();
  }, []);

  const initializePlan = async () => {
    setLoading(true);
    try {
      const newPlan = await incidentResponseService.createIncidentResponsePlan({
        title: 'Incident Response Plan',
        organization: '',
        version: '1.0'
      });
      setPlan(newPlan);
    } catch (error) {
      console.error('Failed to initialize plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCompletePlan = async () => {
    if (!plan) return;

    setLoading(true);
    try {
      const updatedPlan = await incidentResponseService.createIncidentResponsePlan({
        ...plan,
        organization: organizationName,
        version: version
      });
      setPlan(updatedPlan);
    } catch (error) {
      console.error('Failed to generate plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportHTML = async () => {
    if (!plan) return;

    setLoading(true);
    try {
      const html = await incidentResponseService.exportToHTML(plan);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${plan.title.replace(/\s+/g, '_')}_v${plan.version}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeamMember = () => {
    if (!plan || !editingTeamMember) return;

    const newMember: ResponseTeamMember = {
      id: crypto.randomUUID(),
      ...editingTeamMember
    };

    setPlan({
      ...plan,
      responseTeam: [...plan.responseTeam, newMember],
      updated_at: new Date()
    });

    setEditingTeamMember(null);
  };

  const handleRemoveTeamMember = (id: string) => {
    if (!plan) return;
    setPlan({
      ...plan,
      responseTeam: plan.responseTeam.filter((m) => m.id !== id),
      updated_at: new Date()
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'high':
        return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low':
        return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      default:
        return 'border-gray-300 bg-gray-50 dark:bg-gray-700';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
              CMMC Level 2 Compliance
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              This Incident Response Plan addresses CMMC controls IR.L2-3.6.1, IR.L2-3.6.2, and
              IR.L2-3.6.3, providing comprehensive procedures for incident handling, reporting,
              and testing.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Organization Name
          </label>
          <input
            type="text"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter organization name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Plan Version
          </label>
          <input
            type="text"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="1.0"
          />
        </div>
      </div>

      {plan && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {plan.classifications.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Incident Classifications
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {plan.responseTeam.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Response Team Members</div>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {plan.communicationTemplates.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Communication Templates</div>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {plan.responsePhases.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Response Phases</div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleGenerateCompletePlan}
          disabled={loading || !organizationName}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? 'Generating...' : 'Generate Complete Plan'}
        </button>
      </div>
    </div>
  );

  const renderClassifications = () => {
    if (!plan) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Incident Classifications
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Predefined classifications with CMMC control mappings
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plan.classifications.map((classification, index) => (
            <div
              key={index}
              className={`border-l-4 rounded-lg p-4 ${getSeverityColor(classification.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white capitalize mb-2">
                    {classification.category.replace(/-/g, ' ')}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Severity:</span>
                      <span className="font-medium text-gray-900 dark:text-white uppercase">
                        {classification.severity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Priority:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {classification.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Response Time:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {classification.responseTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">CUI Involved:</span>
                      <span
                        className={`font-medium ${classification.cuiInvolved ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}
                      >
                        {classification.cuiInvolved ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        External Reporting:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {classification.externalReportingRequired ? 'Required' : 'Not Required'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                      CMMC Controls:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {classification.cmmcControls.map((control, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded"
                        >
                          {control}
                        </span>
                      ))}
                    </div>
                  </div>
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
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Response Team ({plan.responseTeam.length} members)
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Configure incident response team with RACI responsibilities
            </p>
          </div>
          <button
            onClick={() =>
              setEditingTeamMember({
                id: '',
                name: '',
                role: '',
                email: '',
                phone: '',
                responsibility: 'R',
                skills: [],
                availability: '',
                escalationLevel: 1
              })
            }
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Team Member
          </button>
        </div>

        {editingTeamMember && (
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
              Add Team Member
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={editingTeamMember.name}
                  onChange={(e) =>
                    setEditingTeamMember({ ...editingTeamMember, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={editingTeamMember.role}
                  onChange={(e) =>
                    setEditingTeamMember({ ...editingTeamMember, role: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={editingTeamMember.email}
                  onChange={(e) =>
                    setEditingTeamMember({ ...editingTeamMember, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={editingTeamMember.phone}
                  onChange={(e) =>
                    setEditingTeamMember({ ...editingTeamMember, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  RACI Responsibility
                </label>
                <select
                  value={editingTeamMember.responsibility}
                  onChange={(e) =>
                    setEditingTeamMember({
                      ...editingTeamMember,
                      responsibility: e.target.value as 'R' | 'A' | 'C' | 'I'
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="R">Responsible (R) - Does the work</option>
                  <option value="A">Accountable (A) - Makes decisions</option>
                  <option value="C">Consulted (C) - Provides input</option>
                  <option value="I">Informed (I) - Kept updated</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Escalation Level
                </label>
                <select
                  value={editingTeamMember.escalationLevel}
                  onChange={(e) =>
                    setEditingTeamMember({
                      ...editingTeamMember,
                      escalationLevel: Number(e.target.value)
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="1">Level 1 - Initial Response</option>
                  <option value="2">Level 2 - Security Team Lead</option>
                  <option value="3">Level 3 - CISO/Executive</option>
                  <option value="4">Level 4 - External Authorities</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setEditingTeamMember(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTeamMember}
                disabled={!editingTeamMember.name || !editingTeamMember.email}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Member
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {plan.responseTeam.map((member) => (
            <div
              key={member.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">{member.name}</h4>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded">
                      {member.role}
                    </span>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded font-mono">
                      RACI: {member.responsibility}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {member.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {member.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Escalation Level {member.escalationLevel}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveTeamMember(member.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
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
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Communication Templates ({plan.communicationTemplates.length})
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Pre-defined templates for incident notifications and reporting
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {plan.communicationTemplates.map((template, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{template.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded capitalize">
                      {template.type}
                    </span>
                    {template.cmmcRequirement && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded">
                        {template.cmmcRequirement}
                      </span>
                    )}
                    {template.approvalRequired && (
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs rounded">
                        Approval Required
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <span className="font-medium">Send Timing:</span> {template.sendTiming}
                </div>
                <div>
                  <span className="font-medium">Recipients:</span> {template.recipients.join(', ')}
                </div>
                <div>
                  <span className="font-medium">Subject:</span> {template.subject}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEscalation = () => {
    if (!plan) return null;

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Escalation Procedures
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Four-level escalation path for incident severity and scope
          </p>
        </div>

        <div className="space-y-4">
          {plan.escalationProcedures.map((procedure, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    L{procedure.level}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {procedure.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Timeframe: {procedure.timeframe}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Trigger Conditions:
                  </h5>
                  <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {procedure.triggerConditions.map((condition, idx) => (
                      <li key={idx}>{condition}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Authority:
                  </h5>
                  <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {procedure.authority.map((auth, idx) => (
                      <li key={idx}>{auth}</li>
                    ))}
                  </ul>
                </div>
              </div>
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
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Response Phases ({plan.responsePhases.length})
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Complete incident response lifecycle with CMMC control mappings
          </p>
        </div>

        <div className="space-y-4">
          {plan.responsePhases.map((phase, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{phase.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {phase.description}
                  </p>
                </div>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded">
                  {phase.estimatedDuration}
                </span>
              </div>

              <div className="space-y-2 mb-3">
                <h5 className="text-sm font-medium text-gray-900 dark:text-white">Objectives:</h5>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {phase.objectives.map((obj, idx) => (
                    <li key={idx}>{obj}</li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-1">
                {phase.cmmcControls.map((control, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded"
                  >
                    {control}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCMMCMapping = () => {
    if (!plan) return null;

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            CMMC Control Mapping
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Complete mapping of incident response activities to CMMC Level 2 controls
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {plan.cmmcMapping.map((mapping, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-start gap-3 mb-3">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-sm font-mono rounded">
                      {mapping.controlId}
                    </span>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {mapping.controlName}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {mapping.requirement}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Applies to:
                    </span>
                    {mapping.incidentPhases.map((phase, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded capitalize"
                      >
                        {phase}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const breadcrumbs = [
    { label: 'Technical Tools', path: '/technical-tools' },
    { label: 'Incident Response Plan Generator', isActive: true }
  ];

  if (!plan) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
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
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                Incident Response Plan Generator
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                CMMC Level 2 compliant incident response planning with classifications, escalation, and templates
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExportHTML}
                disabled={loading || !organizationName}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Download className="w-4 h-4" />
                Export HTML
              </button>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: FileText },
              { id: 'classifications', label: 'Classifications', icon: AlertTriangle },
              { id: 'team', label: 'Response Team', icon: Users },
              { id: 'communications', label: 'Communications', icon: Mail },
              { id: 'escalation', label: 'Escalation', icon: AlertCircle },
              { id: 'phases', label: 'Response Phases', icon: Clock },
              { id: 'cmmc', label: 'CMMC Mapping', icon: Shield }
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

        <div className="p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'classifications' && renderClassifications()}
          {activeTab === 'team' && renderTeam()}
          {activeTab === 'communications' && renderCommunications()}
          {activeTab === 'escalation' && renderEscalation()}
          {activeTab === 'phases' && renderPhases()}
          {activeTab === 'cmmc' && renderCMMCMapping()}
        </div>
      </div>
    </div>
  );
};

export default EnhancedIncidentResponsePlanGenerator;
