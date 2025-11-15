import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  AlertTriangle, 
  Clock,
  Users,
  Phone,
  Mail,
  Shield,
  Zap,
  CheckCircle,
  XCircle,
  Info,
  ExternalLink
} from 'lucide-react';

interface IncidentResponsePlanProps {
  assessmentData?: any;
  onExport?: (format: 'html' | 'pdf') => void;
  onNavigate?: (path: string) => void;
}

interface IncidentType {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  responseTime: string;
  escalationPath: string[];
  procedures: string[];
  contacts: string[];
}

interface ResponseTeam {
  id: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  backup: string;
  responsibilities: string[];
}

export const EnhancedIncidentResponsePlanGenerator: React.FC<IncidentResponsePlanProps> = ({
  assessmentData,
  onExport,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'procedures' | 'contacts' | 'templates'>('overview');
  const [organizationName, setOrganizationName] = useState('Your Organization');
  const [planTitle, setPlanTitle] = useState('CMMC 2.0 Level 2 Incident Response Plan');
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [reviewDate, setReviewDate] = useState(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  const incidentTypes: IncidentType[] = useMemo(() => [
    {
      id: 'data-breach',
      name: 'Data Breach',
      description: 'Unauthorized access to or disclosure of CUI',
      severity: 'critical',
      responseTime: '1 hour',
      escalationPath: ['Security Team', 'CISO', 'Legal', 'Executive Team'],
      procedures: [
        'Immediately isolate affected systems',
        'Preserve evidence and logs',
        'Notify incident response team',
        'Assess scope and impact',
        'Notify appropriate authorities if required',
        'Implement containment measures',
        'Document all actions taken'
      ],
      contacts: ['Security Team Lead', 'CISO', 'Legal Counsel', 'CEO']
    },
    {
      id: 'malware',
      name: 'Malware Infection',
      description: 'Detection of malicious software on organizational systems',
      severity: 'high',
      responseTime: '2 hours',
      escalationPath: ['IT Security', 'Security Team', 'CISO'],
      procedures: [
        'Isolate infected systems from network',
        'Identify malware type and scope',
        'Collect forensic evidence',
        'Implement containment measures',
        'Clean and restore affected systems',
        'Update security controls',
        'Conduct post-incident review'
      ],
      contacts: ['IT Security Lead', 'Security Team', 'CISO']
    },
    {
      id: 'phishing',
      name: 'Phishing Attack',
      description: 'Suspicious emails or social engineering attempts',
      severity: 'medium',
      responseTime: '4 hours',
      escalationPath: ['Security Team', 'IT Support'],
      procedures: [
        'Report suspicious email to security team',
        'Block malicious domains/IPs',
        'Notify affected users',
        'Conduct security awareness reminder',
        'Update email security filters',
        'Monitor for additional attempts'
      ],
      contacts: ['Security Team', 'IT Support']
    },
    {
      id: 'system-compromise',
      name: 'System Compromise',
      description: 'Unauthorized access to organizational systems',
      severity: 'critical',
      responseTime: '30 minutes',
      escalationPath: ['Security Team', 'CISO', 'Executive Team'],
      procedures: [
        'Immediately disconnect compromised systems',
        'Preserve all logs and evidence',
        'Assess extent of compromise',
        'Implement emergency containment',
        'Notify law enforcement if required',
        'Begin forensic investigation',
        'Plan system restoration'
      ],
      contacts: ['Security Team Lead', 'CISO', 'Legal Counsel', 'CEO']
    },
    {
      id: 'insider-threat',
      name: 'Insider Threat',
      description: 'Suspicious or malicious activity by internal personnel',
      severity: 'high',
      responseTime: '2 hours',
      escalationPath: ['HR', 'Security Team', 'Legal', 'Executive Team'],
      procedures: [
        'Document suspicious behavior',
        'Preserve evidence discreetly',
        'Coordinate with HR and Legal',
        'Implement monitoring measures',
        'Consider temporary access restrictions',
        'Conduct investigation',
        'Take appropriate disciplinary action'
      ],
      contacts: ['HR Director', 'Security Team', 'Legal Counsel', 'CEO']
    }
  ], []);

  const responseTeam: ResponseTeam[] = useMemo(() => [
    {
      id: 'ciso',
      name: 'John Smith',
      role: 'Chief Information Security Officer',
      department: 'Information Security',
      phone: '+1 (555) 123-4567',
      email: 'john.smith@company.com',
      backup: 'Jane Doe (Deputy CISO)',
      responsibilities: [
        'Overall incident response coordination',
        'Executive communication',
        'Regulatory compliance oversight',
        'Resource allocation decisions'
      ]
    },
    {
      id: 'security-lead',
      name: 'Mike Johnson',
      role: 'Security Team Lead',
      department: 'Information Security',
      phone: '+1 (555) 234-5678',
      email: 'mike.johnson@company.com',
      backup: 'Sarah Wilson (Senior Security Analyst)',
      responsibilities: [
        'Technical incident response',
        'Forensic analysis coordination',
        'Security tool management',
        'Team coordination'
      ]
    },
    {
      id: 'it-director',
      name: 'Lisa Brown',
      role: 'IT Director',
      department: 'Information Technology',
      phone: '+1 (555) 345-6789',
      email: 'lisa.brown@company.com',
      backup: 'Tom Davis (IT Manager)',
      responsibilities: [
        'System restoration',
        'Infrastructure support',
        'Backup and recovery',
        'Technical resource coordination'
      ]
    },
    {
      id: 'legal-counsel',
      name: 'Robert Wilson',
      role: 'Legal Counsel',
      department: 'Legal',
      phone: '+1 (555) 456-7890',
      email: 'robert.wilson@company.com',
      backup: 'Jennifer Lee (Associate Legal Counsel)',
      responsibilities: [
        'Legal compliance review',
        'Regulatory notification',
        'Evidence preservation guidance',
        'External communication oversight'
      ]
    },
    {
      id: 'hr-director',
      name: 'Amanda Taylor',
      role: 'HR Director',
      department: 'Human Resources',
      phone: '+1 (555) 567-8901',
      email: 'amanda.taylor@company.com',
      backup: 'David Miller (HR Manager)',
      responsibilities: [
        'Personnel-related incidents',
        'Employee communication',
        'Disciplinary actions',
        'Workplace safety coordination'
      ]
    },
    {
      id: 'communications',
      name: 'Maria Garcia',
      role: 'Communications Director',
      department: 'Marketing & Communications',
      phone: '+1 (555) 678-9012',
      email: 'maria.garcia@company.com',
      backup: 'Kevin Chen (Communications Manager)',
      responsibilities: [
        'External communication',
        'Media relations',
        'Stakeholder notification',
        'Public statement coordination'
      ]
    }
  ], []);

  const generateHTMLReport = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${planTitle}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #dc2626; padding-bottom: 20px; }
        .header h1 { color: #dc2626; margin: 0; font-size: 28px; }
        .header p { color: #666; margin: 5px 0; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; }
        .incident-type { background: white; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; margin-bottom: 15px; }
        .incident-header { display: flex; justify-content: between; align-items: center; margin-bottom: 15px; }
        .incident-name { font-size: 18px; font-weight: bold; color: #1f2937; }
        .severity-badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .severity-critical { background: #fef2f2; color: #dc2626; }
        .severity-high { background: #fff7ed; color: #ea580c; }
        .severity-medium { background: #fffbeb; color: #d97706; }
        .severity-low { background: #f0fdf4; color: #059669; }
        .team-member { background: white; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; margin-bottom: 15px; }
        .team-header { display: flex; justify-content: between; align-items: center; margin-bottom: 15px; }
        .team-name { font-size: 16px; font-weight: bold; color: #1f2937; }
        .team-role { color: #6b7280; font-size: 14px; }
        .contact-info { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; }
        .contact-item { display: flex; align-items: center; gap: 8px; }
        .procedures { background: #f8fafc; padding: 20px; border-radius: 6px; margin-bottom: 20px; }
        .procedure-list { list-style: none; padding: 0; }
        .procedure-list li { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .procedure-list li:last-child { border-bottom: none; }
        .procedure-list li::before { content: "▶"; color: #dc2626; margin-right: 8px; }
        .escalation-path { background: #fef2f2; padding: 15px; border-radius: 6px; margin-bottom: 15px; }
        .escalation-path h4 { color: #dc2626; margin: 0 0 10px 0; }
        .escalation-steps { display: flex; gap: 10px; flex-wrap: wrap; }
        .escalation-step { background: white; padding: 8px 12px; border-radius: 4px; border: 1px solid #fecaca; font-size: 14px; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${planTitle}</h1>
            <p><strong>Organization:</strong> ${organizationName}</p>
            <p><strong>Effective Date:</strong> ${effectiveDate}</p>
            <p><strong>Next Review Date:</strong> ${reviewDate}</p>
        </div>

        <div class="section">
            <h2>1. Purpose and Scope</h2>
            <p>This Incident Response Plan establishes procedures for detecting, responding to, and recovering from security incidents that may affect ${organizationName}'s information systems and Controlled Unclassified Information (CUI). This plan complies with CMMC 2.0 Level 2 requirements and NIST SP 800-171 controls.</p>
            
            <h3>1.1 Objectives</h3>
            <ul>
                <li>Minimize the impact of security incidents on organizational operations</li>
                <li>Preserve evidence for forensic analysis and legal proceedings</li>
                <li>Restore normal operations as quickly as possible</li>
                <li>Prevent similar incidents from occurring in the future</li>
                <li>Maintain compliance with CMMC 2.0 Level 2 requirements</li>
            </ul>

            <h3>1.2 Scope</h3>
            <p>This plan applies to all security incidents involving:</p>
            <ul>
                <li>Controlled Unclassified Information (CUI)</li>
                <li>Organizational information systems</li>
                <li>Network infrastructure</li>
                <li>End-user devices</li>
                <li>Third-party systems processing CUI</li>
            </ul>
        </div>

        <div class="section">
            <h2>2. Incident Response Team</h2>
            ${responseTeam.map(member => `
                <div class="team-member">
                    <div class="team-header">
                        <div>
                            <div class="team-name">${member.name}</div>
                            <div class="team-role">${member.role} - ${member.department}</div>
                        </div>
                    </div>
                    <div class="contact-info">
                        <div class="contact-item">
                            <strong>Phone:</strong> ${member.phone}
                        </div>
                        <div class="contact-item">
                            <strong>Email:</strong> ${member.email}
                        </div>
                        <div class="contact-item">
                            <strong>Backup:</strong> ${member.backup}
                        </div>
                    </div>
                    <div>
                        <strong>Responsibilities:</strong>
                        <ul>
                            ${member.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="section">
            <h2>3. Incident Types and Response Procedures</h2>
            ${incidentTypes.map(incident => `
                <div class="incident-type">
                    <div class="incident-header">
                        <div class="incident-name">${incident.name}</div>
                        <span class="severity-badge severity-${incident.severity}">${incident.severity.toUpperCase()}</span>
                    </div>
                    <p><strong>Description:</strong> ${incident.description}</p>
                    <p><strong>Response Time:</strong> ${incident.responseTime}</p>
                    
                    <div class="escalation-path">
                        <h4>Escalation Path</h4>
                        <div class="escalation-steps">
                            ${incident.escalationPath.map(step => `<span class="escalation-step">${step}</span>`).join('')}
                        </div>
                    </div>

                    <div class="procedures">
                        <h4>Response Procedures</h4>
                        <ol class="procedure-list">
                            ${incident.procedures.map(procedure => `<li>${procedure}</li>`).join('')}
                        </ol>
                    </div>

                    <div>
                        <strong>Key Contacts:</strong> ${incident.contacts.join(', ')}
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="section">
            <h2>4. Communication Procedures</h2>
            <h3>4.1 Internal Communication</h3>
            <ul>
                <li>All incidents must be reported to the Security Team Lead immediately</li>
                <li>Use designated communication channels (phone, secure email, incident management system)</li>
                <li>Document all communications and decisions</li>
                <li>Maintain confidentiality of sensitive information</li>
            </ul>

            <h3>4.2 External Communication</h3>
            <ul>
                <li>Coordinate all external communications through the Communications Director</li>
                <li>Notify law enforcement agencies when required by law</li>
                <li>Report to regulatory authorities as mandated</li>
                <li>Communicate with customers and partners as appropriate</li>
            </ul>
        </div>

        <div class="section">
            <h2>5. Recovery and Lessons Learned</h2>
            <h3>5.1 Recovery Procedures</h3>
            <ul>
                <li>Restore systems from clean backups</li>
                <li>Implement additional security controls</li>
                <li>Monitor systems for signs of re-compromise</li>
                <li>Gradually restore normal operations</li>
            </ul>

            <h3>5.2 Post-Incident Review</h3>
            <ul>
                <li>Conduct lessons learned session within 72 hours</li>
                <li>Document findings and recommendations</li>
                <li>Update incident response procedures</li>
                <li>Provide training on lessons learned</li>
            </ul>
        </div>

        <div class="footer">
            <p>This plan is confidential and for internal use only. Distribution is restricted to authorized personnel.</p>
            <p>Document Version 1.0 | Generated on ${new Date().toLocaleDateString()}</p>
        </div>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${organizationName.replace(/\s+/g, '_')}_Incident_Response_Plan_${effectiveDate}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-error-600 bg-error-50 border-error-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-success-600 bg-success-50 border-success-200';
      default: return 'text-text-secondary-light bg-background-light border-support-light';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-text-primary-light flex items-center gap-3">
              <Shield className="w-8 h-8 text-error-600" />
              Enhanced Incident Response Plan Generator
            </h1>
            <p className="text-text-secondary-light mt-2">
              Generate comprehensive CMMC 2.0 Level 2 compliant incident response plans
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onNavigate?.('/incident-response')}
              className="px-4 py-2 text-text-secondary-light border border-support-light rounded-lg hover:bg-background-light flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Plans
            </button>
            <button
              onClick={generateHTMLReport}
              className="px-4 py-2 bg-error-600 text-white rounded-lg hover:bg-error-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Plan
            </button>
          </div>
        </div>

        {/* Plan Configuration */}
        <div className="bg-surface-light rounded-lg border border-support-light p-6 mb-6">
          <h2 className="text-xl font-semibold text-text-primary-light mb-4">Plan Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary-light mb-2">Plan Title</label>
              <input
                type="text"
                value={planTitle}
                onChange={(e) => setPlanTitle(e.target.value)}
                className="w-full px-3 py-2 border border-support-light rounded-lg focus:ring-2 focus:ring-red-500 focus:border-error-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary-light mb-2">Organization Name</label>
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full px-3 py-2 border border-support-light rounded-lg focus:ring-2 focus:ring-red-500 focus:border-error-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary-light mb-2">Effective Date</label>
              <input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="w-full px-3 py-2 border border-support-light rounded-lg focus:ring-2 focus:ring-red-500 focus:border-error-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary-light mb-2">Review Date</label>
              <input
                type="date"
                value={reviewDate}
                onChange={(e) => setReviewDate(e.target.value)}
                className="w-full px-3 py-2 border border-support-light rounded-lg focus:ring-2 focus:ring-red-500 focus:border-error-500"
              />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-support-light mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: FileText },
              { id: 'team', label: 'Response Team', icon: Users },
              { id: 'procedures', label: 'Procedures', icon: Zap },
              { id: 'contacts', label: 'Contacts', icon: Phone },
              { id: 'templates', label: 'Templates', icon: ExternalLink }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-error-500 text-error-600'
                    : 'border-transparent text-text-muted-light hover:text-text-primary-light hover:border-support-light'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-surface-light rounded-lg border border-support-light p-6">
              <h3 className="text-lg font-semibold text-text-primary-light mb-4">Plan Overview</h3>
              <div className="prose max-w-none">
                <p className="text-text-primary-light mb-4">
                  This comprehensive incident response plan provides structured procedures for detecting, responding to, 
                  and recovering from security incidents that may affect {organizationName}'s information systems and 
                  Controlled Unclassified Information (CUI).
                </p>
                
                <div className="bg-error-50 border border-error-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-error-900 mb-2">CMMC 2.0 Level 2 Compliance</h4>
                  <p className="text-error-800">
                    This plan addresses CMMC 2.0 Level 2 requirements including IR.3.6.1 (Establish incident response capability), 
                    IR.3.6.2 (Track and document incidents), and IR.3.6.3 (Test incident response capability).
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-text-primary-light mb-2">Key Features</h4>
                    <ul className="text-text-primary-light space-y-1">
                      <li>• Comprehensive incident type coverage</li>
                      <li>• Defined response team roles and responsibilities</li>
                      <li>• Escalation procedures and timelines</li>
                      <li>• Communication protocols</li>
                      <li>• Recovery and lessons learned processes</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary-light mb-2">Incident Types Covered</h4>
                    <ul className="text-text-primary-light space-y-1">
                      <li>• Data breaches and CUI exposure</li>
                      <li>• Malware infections</li>
                      <li>• Phishing attacks</li>
                      <li>• System compromises</li>
                      <li>• Insider threats</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface-light rounded-lg border border-support-light p-6">
              <h3 className="text-lg font-semibold text-text-primary-light mb-4">Incident Severity Levels</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { level: 'Critical', color: 'red', description: 'Immediate threat to CUI or critical systems', time: '30 minutes' },
                  { level: 'High', color: 'orange', description: 'Significant security impact', time: '2 hours' },
                  { level: 'Medium', color: 'yellow', description: 'Moderate security concern', time: '4 hours' },
                  { level: 'Low', color: 'green', description: 'Minor security issue', time: '24 hours' }
                ].map((severity) => (
                  <div key={severity.level} className={`border rounded-lg p-4 ${getSeverityColor(severity.color)}`}>
                    <h4 className="font-semibold mb-2">{severity.level}</h4>
                    <p className="text-sm mb-2">{severity.description}</p>
                    <p className="text-sm font-medium">Response Time: {severity.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="bg-surface-light rounded-lg border border-support-light p-6">
              <h3 className="text-lg font-semibold text-text-primary-light mb-4">Incident Response Team</h3>
              <div className="space-y-4">
                {responseTeam.map((member, index) => (
                  <div key={index} className="border border-support-light rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-text-primary-light">{member.name}</h4>
                        <p className="text-sm text-text-secondary-light">{member.role}</p>
                        <p className="text-sm text-text-muted-light">{member.department}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-text-muted-light" />
                        <span className="text-sm">{member.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-text-muted-light" />
                        <span className="text-sm">{member.email}</span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm font-medium text-text-primary-light mb-1">Backup Contact:</p>
                      <p className="text-sm text-text-secondary-light">{member.backup}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary-light mb-1">Responsibilities:</p>
                      <ul className="text-sm text-text-secondary-light list-disc list-inside">
                        {member.responsibilities.map((resp, i) => (
                          <li key={i}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'procedures' && (
          <div className="space-y-6">
            <div className="bg-surface-light rounded-lg border border-support-light p-6">
              <h3 className="text-lg font-semibold text-text-primary-light mb-4">Incident Response Procedures</h3>
              <div className="space-y-6">
                {incidentTypes.map((incident, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${getSeverityColor(incident.severity)}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-text-primary-light">{incident.name}</h4>
                        <p className="text-sm text-text-secondary-light">{incident.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                          {incident.severity.toUpperCase()}
                        </span>
                        <span className="text-sm font-medium text-text-secondary-light">
                          {incident.responseTime}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm font-medium text-text-primary-light mb-1">Escalation Path:</p>
                      <div className="flex flex-wrap gap-2">
                        {incident.escalationPath.map((step, i) => (
                          <span key={i} className="px-2 py-1 bg-surface-light border border-support-light rounded text-xs">
                            {step}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm font-medium text-text-primary-light mb-1">Response Procedures:</p>
                      <ol className="text-sm text-text-secondary-light list-decimal list-inside space-y-1">
                        {incident.procedures.map((procedure, i) => (
                          <li key={i}>{procedure}</li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-text-primary-light mb-1">Key Contacts:</p>
                      <p className="text-sm text-text-secondary-light">{incident.contacts.join(', ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="space-y-6">
            <div className="bg-surface-light rounded-lg border border-support-light p-6">
              <h3 className="text-lg font-semibold text-text-primary-light mb-4">Emergency Contacts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {responseTeam.map((member, index) => (
                  <div key={index} className="border border-support-light rounded-lg p-4">
                    <h4 className="font-medium text-text-primary-light mb-2">{member.name}</h4>
                    <p className="text-sm text-text-secondary-light mb-2">{member.role}</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-text-muted-light" />
                        <span className="text-sm">{member.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-text-muted-light" />
                        <span className="text-sm">{member.email}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface-light rounded-lg border border-support-light p-6">
              <h3 className="text-lg font-semibold text-text-primary-light mb-4">External Contacts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-support-light rounded-lg p-4">
                  <h4 className="font-medium text-text-primary-light mb-2">Law Enforcement</h4>
                  <p className="text-sm text-text-secondary-light mb-2">FBI Cyber Crime Unit</p>
                  <p className="text-sm text-text-muted-light">+1 (202) 324-3000</p>
                </div>
                <div className="border border-support-light rounded-lg p-4">
                  <h4 className="font-medium text-text-primary-light mb-2">Legal Counsel</h4>
                  <p className="text-sm text-text-secondary-light mb-2">External Legal Firm</p>
                  <p className="text-sm text-text-muted-light">+1 (555) 999-0000</p>
                </div>
                <div className="border border-support-light rounded-lg p-4">
                  <h4 className="font-medium text-text-primary-light mb-2">Cyber Insurance</h4>
                  <p className="text-sm text-text-secondary-light mb-2">Insurance Provider</p>
                  <p className="text-sm text-text-muted-light">+1 (555) 888-0000</p>
                </div>
                <div className="border border-support-light rounded-lg p-4">
                  <h4 className="font-medium text-text-primary-light mb-2">Forensic Services</h4>
                  <p className="text-sm text-text-secondary-light mb-2">Digital Forensics Firm</p>
                  <p className="text-sm text-text-muted-light">+1 (555) 777-0000</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="bg-surface-light rounded-lg border border-support-light p-6">
              <h3 className="text-lg font-semibold text-text-primary-light mb-4">Incident Response Templates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-support-light rounded-lg p-4">
                  <h4 className="font-medium text-text-primary-light mb-2">Incident Report Template</h4>
                  <p className="text-sm text-text-secondary-light mb-3">Standard template for documenting security incidents</p>
                  <button className="text-primary-600 text-sm hover:underline">Download Template</button>
                </div>
                <div className="border border-support-light rounded-lg p-4">
                  <h4 className="font-medium text-text-primary-light mb-2">Communication Templates</h4>
                  <p className="text-sm text-text-secondary-light mb-3">Pre-approved communication templates for different audiences</p>
                  <button className="text-primary-600 text-sm hover:underline">Download Templates</button>
                </div>
                <div className="border border-support-light rounded-lg p-4">
                  <h4 className="font-medium text-text-primary-light mb-2">Evidence Collection Checklist</h4>
                  <p className="text-sm text-text-secondary-light mb-3">Checklist for preserving evidence during incident response</p>
                  <button className="text-primary-600 text-sm hover:underline">Download Checklist</button>
                </div>
                <div className="border border-support-light rounded-lg p-4">
                  <h4 className="font-medium text-text-primary-light mb-2">Post-Incident Review Form</h4>
                  <p className="text-sm text-text-secondary-light mb-3">Form for conducting lessons learned sessions</p>
                  <button className="text-primary-600 text-sm hover:underline">Download Form</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
