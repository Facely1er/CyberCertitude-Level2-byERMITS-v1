import { supabase } from '../lib/supabase';

export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low';
export type IncidentCategory = 'data-breach' | 'malware' | 'ddos' | 'insider-threat' | 'physical-security' | 'system-compromise' | 'social-engineering' | 'supply-chain' | 'cloud-security' | 'cui-spillage' | 'unauthorized-access' | 'configuration-error';
export type IncidentStatus = 'new' | 'analyzing' | 'containing' | 'eradicating' | 'recovering' | 'closed';
export type ResponsePhase = 'preparation' | 'detection' | 'analysis' | 'containment' | 'eradication' | 'recovery' | 'post-incident';

export interface IncidentClassification {
  category: IncidentCategory;
  severity: IncidentSeverity;
  priority: number;
  responseTime: string;
  escalationRequired: boolean;
  cuiInvolved: boolean;
  externalReportingRequired: boolean;
  cmmcControls: string[];
}

export interface ResponseTeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  responsibility: 'R' | 'A' | 'C' | 'I';
  skills: string[];
  availability: string;
  escalationLevel: number;
}

export interface CommunicationTemplate {
  id: string;
  name: string;
  type: 'internal' | 'executive' | 'external' | 'regulatory' | 'customer';
  subject: string;
  body: string;
  recipients: string[];
  sendTiming: string;
  approvalRequired: boolean;
  cmmcRequirement?: string;
}

export interface EscalationProcedure {
  level: number;
  name: string;
  triggerConditions: string[];
  contacts: ResponseTeamMember[];
  notificationMethod: string[];
  timeframe: string;
  authority: string[];
  documentation: string[];
}

export interface IncidentResponsePhase {
  phase: ResponsePhase;
  name: string;
  description: string;
  objectives: string[];
  activities: ResponseActivity[];
  successCriteria: string[];
  cmmcControls: string[];
  estimatedDuration: string;
  prerequisites: string[];
}

export interface ResponseActivity {
  id: string;
  name: string;
  description: string;
  responsibleRole: string;
  steps: string[];
  tools: string[];
  documentation: string[];
  cmmcControl?: string;
  estimatedDuration: string;
}

export interface IncidentMetrics {
  detectionTime: number;
  analysisTime: number;
  containmentTime: number;
  recoveryTime: number;
  totalTime: number;
  mttr: number;
  mttd: number;
  cuiExposure: boolean;
  dataLoss: boolean;
  systemsAffected: number;
  costEstimate: number;
}

export interface IncidentResponsePlan {
  id: string;
  title: string;
  version: string;
  organization: string;
  effectiveDate: Date;
  reviewDate: Date;
  approvers: Array<{ name: string; role: string; date: Date }>;
  classifications: IncidentClassification[];
  responseTeam: ResponseTeamMember[];
  communicationTemplates: CommunicationTemplate[];
  escalationProcedures: EscalationProcedure[];
  responsePhases: IncidentResponsePhase[];
  cmmcMapping: CMMCIncidentMapping[];
  toolsAndResources: ToolResource[];
  trainingRequirements: TrainingRequirement[];
  testingSchedule: TestingSchedule[];
  metrics: MetricsTracking;
  created_at: Date;
  updated_at: Date;
}

export interface CMMCIncidentMapping {
  controlId: string;
  controlName: string;
  domain: string;
  requirement: string;
  incidentPhases: ResponsePhase[];
  implementationGuidance: string;
  evidenceRequirements: string[];
  validationMethod: string;
}

export interface ToolResource {
  id: string;
  name: string;
  type: 'hardware' | 'software' | 'service' | 'documentation';
  purpose: string;
  location: string;
  owner: string;
  accessInstructions: string;
  maintenanceSchedule?: string;
}

export interface TrainingRequirement {
  id: string;
  role: string;
  trainingType: string;
  frequency: string;
  duration: string;
  provider: string;
  competencyValidation: string;
  cmmcControl?: string;
}

export interface TestingSchedule {
  id: string;
  testType: 'tabletop' | 'simulation' | 'full-scale' | 'component';
  scenario: string;
  frequency: string;
  participants: string[];
  objectives: string[];
  successCriteria: string[];
  lastConducted?: Date;
  nextScheduled: Date;
  findings: string[];
}

export interface MetricsTracking {
  kpis: Array<{ name: string; target: number; current: number; unit: string }>;
  incidentTrends: Array<{ period: string; count: number; category: IncidentCategory }>;
  responseEffectiveness: Array<{ metric: string; value: number; benchmark: number }>;
  complianceMetrics: Array<{ control: string; status: string; lastValidated: Date }>;
}

class IncidentResponseService {
  private static instance: IncidentResponseService;

  private constructor() {}

  public static getInstance(): IncidentResponseService {
    if (!IncidentResponseService.instance) {
      IncidentResponseService.instance = new IncidentResponseService();
    }
    return IncidentResponseService.instance;
  }

  async createIncidentResponsePlan(plan: Partial<IncidentResponsePlan>): Promise<IncidentResponsePlan> {
    const newPlan: IncidentResponsePlan = {
      id: crypto.randomUUID(),
      title: plan.title || 'Incident Response Plan',
      version: plan.version || '1.0',
      organization: plan.organization || '',
      effectiveDate: plan.effectiveDate || new Date(),
      reviewDate: plan.reviewDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      approvers: plan.approvers || [],
      classifications: plan.classifications || this.getDefaultClassifications(),
      responseTeam: plan.responseTeam || [],
      communicationTemplates: plan.communicationTemplates || this.getDefaultCommunicationTemplates(),
      escalationProcedures: plan.escalationProcedures || this.getDefaultEscalationProcedures(),
      responsePhases: plan.responsePhases || this.getDefaultResponsePhases(),
      cmmcMapping: plan.cmmcMapping || this.getCMMCIncidentMappings(),
      toolsAndResources: plan.toolsAndResources || [],
      trainingRequirements: plan.trainingRequirements || this.getDefaultTrainingRequirements(),
      testingSchedule: plan.testingSchedule || this.getDefaultTestingSchedule(),
      metrics: plan.metrics || this.getDefaultMetrics(),
      created_at: new Date(),
      updated_at: new Date()
    };

    return newPlan;
  }

  getDefaultClassifications(): IncidentClassification[] {
    return [
      {
        category: 'cui-spillage',
        severity: 'critical',
        priority: 1,
        responseTime: '15 minutes',
        escalationRequired: true,
        cuiInvolved: true,
        externalReportingRequired: true,
        cmmcControls: ['IR.L2-3.6.1', 'IR.L2-3.6.2', 'MP.L2-3.8.3', 'AU.L2-3.3.1']
      },
      {
        category: 'data-breach',
        severity: 'critical',
        priority: 1,
        responseTime: '30 minutes',
        escalationRequired: true,
        cuiInvolved: true,
        externalReportingRequired: true,
        cmmcControls: ['IR.L2-3.6.1', 'IR.L2-3.6.2', 'IR.L2-3.6.3', 'AU.L2-3.3.1', 'AU.L2-3.3.2']
      },
      {
        category: 'system-compromise',
        severity: 'high',
        priority: 2,
        responseTime: '1 hour',
        escalationRequired: true,
        cuiInvolved: false,
        externalReportingRequired: false,
        cmmcControls: ['IR.L2-3.6.1', 'SI.L2-3.14.2', 'SI.L2-3.14.5']
      },
      {
        category: 'malware',
        severity: 'high',
        priority: 2,
        responseTime: '2 hours',
        escalationRequired: false,
        cuiInvolved: false,
        externalReportingRequired: false,
        cmmcControls: ['IR.L2-3.6.1', 'SI.L2-3.14.2', 'SI.L2-3.14.4']
      },
      {
        category: 'unauthorized-access',
        severity: 'high',
        priority: 2,
        responseTime: '1 hour',
        escalationRequired: true,
        cuiInvolved: false,
        externalReportingRequired: false,
        cmmcControls: ['AC.L2-3.1.1', 'AC.L2-3.1.2', 'AU.L2-3.3.1', 'IR.L2-3.6.1']
      },
      {
        category: 'ddos',
        severity: 'medium',
        priority: 3,
        responseTime: '4 hours',
        escalationRequired: false,
        cuiInvolved: false,
        externalReportingRequired: false,
        cmmcControls: ['IR.L2-3.6.1', 'SC.L2-3.13.1']
      },
      {
        category: 'social-engineering',
        severity: 'medium',
        priority: 3,
        responseTime: '4 hours',
        escalationRequired: false,
        cuiInvolved: false,
        externalReportingRequired: false,
        cmmcControls: ['AT.L2-3.2.1', 'AT.L2-3.2.2', 'IR.L2-3.6.1']
      },
      {
        category: 'configuration-error',
        severity: 'low',
        priority: 4,
        responseTime: '8 hours',
        escalationRequired: false,
        cuiInvolved: false,
        externalReportingRequired: false,
        cmmcControls: ['CM.L2-3.4.1', 'CM.L2-3.4.2', 'IR.L2-3.6.1']
      }
    ];
  }

  getDefaultCommunicationTemplates(): CommunicationTemplate[] {
    return [
      {
        id: crypto.randomUUID(),
        name: 'Initial Incident Notification',
        type: 'internal',
        subject: 'INCIDENT ALERT: [Category] - [Severity]',
        body: `An incident has been detected and classified as follows:

Incident ID: [ID]
Category: [Category]
Severity: [Severity]
Detection Time: [Time]
Current Status: [Status]

Immediate Actions:
- Response team has been activated
- Initial containment measures in progress
- Investigation underway

Response Team: [Team Members]
Incident Commander: [Name]

Next Update: [Time]

This is a CMMC IR.L2-3.6.1 required notification.`,
        recipients: ['response-team@organization.com', 'security-team@organization.com'],
        sendTiming: 'Immediate upon detection',
        approvalRequired: false,
        cmmcRequirement: 'IR.L2-3.6.1'
      },
      {
        id: crypto.randomUUID(),
        name: 'Executive Briefing',
        type: 'executive',
        subject: 'Executive Briefing: Security Incident [ID]',
        body: `Executive Summary:

Incident Overview:
- Classification: [Category] - [Severity]
- Business Impact: [Impact Description]
- CUI Involvement: [Yes/No]
- Systems Affected: [Systems]

Current Status:
- Detection: [Time]
- Response Actions: [Actions Taken]
- Containment: [Status]
- Estimated Resolution: [Time]

Regulatory Implications:
- CMMC Reporting: [Required/Not Required]
- External Notifications: [Required/Not Required]
- Compliance Impact: [Assessment]

Next Steps:
[Planned Actions]

Contact: [Incident Commander]
Phone: [Number]`,
        recipients: ['ceo@organization.com', 'ciso@organization.com', 'legal@organization.com'],
        sendTiming: 'Within 2 hours for Critical/High severity',
        approvalRequired: true,
        cmmcRequirement: 'IR.L2-3.6.2'
      },
      {
        id: crypto.randomUUID(),
        name: 'CUI Spillage Notification',
        type: 'regulatory',
        subject: 'REQUIRED: CUI Spillage Incident Report',
        body: `Controlled Unclassified Information (CUI) Spillage Report

Incident Details:
- Incident ID: [ID]
- Discovery Date/Time: [DateTime]
- CUI Markings: [Markings]
- Data Description: [Description]

Spillage Details:
- Location: [Systems/Media]
- Estimated Scope: [Scope]
- Unauthorized Recipients: [Count/Description]
- Duration of Exposure: [Duration]

Immediate Actions Taken:
- [Action 1]
- [Action 2]
- [Action 3]

Containment Status:
[Current Status]

72-Hour Reporting Requirement:
This incident requires notification to the DoD within 72 hours per DFARS 252.204-7012.

Point of Contact:
[Name, Title, Phone, Email]

This notification fulfills CMMC IR.L2-3.6.2 requirements.`,
        recipients: ['dod-reporting@organization.com', 'legal@organization.com', 'ciso@organization.com'],
        sendTiming: 'Within 72 hours',
        approvalRequired: true,
        cmmcRequirement: 'IR.L2-3.6.2'
      },
      {
        id: crypto.randomUUID(),
        name: 'Status Update',
        type: 'internal',
        subject: 'Incident [ID] Status Update - [Phase]',
        body: `Incident Status Update

Incident ID: [ID]
Current Phase: [Phase]
Time Elapsed: [Duration]

Progress Update:
- Completed Activities: [Activities]
- Current Activities: [Activities]
- Next Steps: [Steps]

Key Findings:
- [Finding 1]
- [Finding 2]

Resource Status:
- Team Members Active: [Count]
- Systems Status: [Status]
- External Support: [Status]

Next Update: [Time]

Incident Commander: [Name]`,
        recipients: ['response-team@organization.com'],
        sendTiming: 'Every 4 hours during active response',
        approvalRequired: false
      },
      {
        id: crypto.randomUUID(),
        name: 'Incident Closure Report',
        type: 'internal',
        subject: 'Incident [ID] - Closure Report',
        body: `Incident Closure Report

Incident Summary:
- ID: [ID]
- Category: [Category]
- Severity: [Severity]
- Duration: [Duration]

Timeline:
- Detection: [Time]
- Containment: [Time]
- Eradication: [Time]
- Recovery: [Time]
- Closure: [Time]

Root Cause:
[Root Cause Analysis]

Impact Assessment:
- Systems Affected: [Systems]
- Data Impact: [Impact]
- Business Impact: [Impact]
- CUI Exposure: [Yes/No]

Lessons Learned:
- [Lesson 1]
- [Lesson 2]
- [Lesson 3]

Improvement Actions:
- [Action 1] - Owner: [Name] - Due: [Date]
- [Action 2] - Owner: [Name] - Due: [Date]

CMMC Compliance:
All IR.L2-3.6.x requirements fulfilled.

Post-Incident Review Scheduled: [Date]`,
        recipients: ['response-team@organization.com', 'management@organization.com'],
        sendTiming: 'Upon incident closure',
        approvalRequired: true,
        cmmcRequirement: 'IR.L2-3.6.3'
      }
    ];
  }

  getDefaultEscalationProcedures(): EscalationProcedure[] {
    return [
      {
        level: 1,
        name: 'Initial Response',
        triggerConditions: [
          'Any detected security incident',
          'Automated alert from security tools',
          'User-reported security concern'
        ],
        contacts: [],
        notificationMethod: ['Email', 'SMS', 'Incident Management System'],
        timeframe: 'Immediate',
        authority: ['Acknowledge incident', 'Begin initial analysis', 'Activate response procedures'],
        documentation: ['Incident ticket creation', 'Initial classification', 'Timeline documentation']
      },
      {
        level: 2,
        name: 'Security Team Lead',
        triggerConditions: [
          'Medium severity or higher',
          'Multiple systems affected',
          'Incident duration exceeds 2 hours',
          'Initial containment unsuccessful'
        ],
        contacts: [],
        notificationMethod: ['Phone', 'SMS', 'Incident Management System'],
        timeframe: 'Within 30 minutes',
        authority: [
          'Authorize additional resources',
          'Coordinate with system owners',
          'Approve containment actions',
          'Engage external support'
        ],
        documentation: ['Escalation justification', 'Resource allocation', 'Decision log']
      },
      {
        level: 3,
        name: 'CISO/Executive Management',
        triggerConditions: [
          'Critical severity incident',
          'CUI data involved',
          'Potential regulatory reporting required',
          'Significant business impact',
          'Media attention likely'
        ],
        contacts: [],
        notificationMethod: ['Phone', 'In-person briefing'],
        timeframe: 'Within 1 hour',
        authority: [
          'Authorize business continuity measures',
          'Approve external communications',
          'Engage legal counsel',
          'Coordinate with government agencies',
          'Approve regulatory notifications'
        ],
        documentation: ['Executive briefing', 'Decision documentation', 'Communication approvals']
      },
      {
        level: 4,
        name: 'External Authorities',
        triggerConditions: [
          'CUI spillage confirmed',
          'Data breach affecting DoD information',
          'Cyber incident affecting defense operations',
          '72-hour reporting requirement triggered'
        ],
        contacts: [],
        notificationMethod: ['Official channels', 'DIBNET', 'DIB CS Program'],
        timeframe: 'Within 72 hours',
        authority: [
          'Report to DoD',
          'Coordinate with DIB CS Program',
          'Engage law enforcement if required'
        ],
        documentation: ['Official incident report', 'Regulatory notifications', 'Agency coordination logs']
      }
    ];
  }

  getDefaultResponsePhases(): IncidentResponsePhase[] {
    return [
      {
        phase: 'preparation',
        name: 'Preparation',
        description: 'Establish and maintain incident response capability',
        objectives: [
          'Maintain incident response plan',
          'Train response team',
          'Deploy and configure security tools',
          'Establish communication channels',
          'Document procedures'
        ],
        activities: [
          {
            id: crypto.randomUUID(),
            name: 'Plan Maintenance',
            description: 'Review and update incident response plan',
            responsibleRole: 'Incident Response Manager',
            steps: [
              'Review plan annually or after major incidents',
              'Update contact information',
              'Revise procedures based on lessons learned',
              'Obtain management approval',
              'Distribute updated plan'
            ],
            tools: ['Document management system', 'Collaboration platform'],
            documentation: ['Incident Response Plan', 'Change log', 'Approval records'],
            cmmcControl: 'IR.L2-3.6.1',
            estimatedDuration: 'Ongoing'
          },
          {
            id: crypto.randomUUID(),
            name: 'Team Training',
            description: 'Conduct incident response training and exercises',
            responsibleRole: 'Training Coordinator',
            steps: [
              'Schedule regular training sessions',
              'Conduct tabletop exercises',
              'Perform incident simulations',
              'Document training completion',
              'Track competency levels'
            ],
            tools: ['Learning management system', 'Simulation tools'],
            documentation: ['Training records', 'Exercise reports', 'Competency assessments'],
            cmmcControl: 'AT.L2-3.2.1',
            estimatedDuration: 'Quarterly'
          }
        ],
        successCriteria: [
          'Current incident response plan approved',
          'Response team trained and competent',
          'Tools deployed and operational',
          'Communication channels tested',
          'Annual exercises completed'
        ],
        cmmcControls: ['IR.L2-3.6.1', 'AT.L2-3.2.1', 'AT.L2-3.2.2'],
        estimatedDuration: 'Ongoing',
        prerequisites: ['Management support', 'Allocated budget', 'Designated team members']
      },
      {
        phase: 'detection',
        name: 'Detection and Analysis',
        description: 'Identify and validate security incidents',
        objectives: [
          'Monitor for potential incidents',
          'Validate incident indicators',
          'Perform initial classification',
          'Document initial findings',
          'Activate response team'
        ],
        activities: [
          {
            id: crypto.randomUUID(),
            name: 'Alert Triage',
            description: 'Review and prioritize security alerts',
            responsibleRole: 'Security Analyst',
            steps: [
              'Monitor security tool alerts',
              'Correlate alerts from multiple sources',
              'Filter false positives',
              'Prioritize based on severity',
              'Create incident ticket'
            ],
            tools: ['SIEM', 'IDS/IPS', 'EDR', 'Log management'],
            documentation: ['Alert log', 'Triage notes', 'Incident ticket'],
            cmmcControl: 'AU.L2-3.3.1',
            estimatedDuration: '15-30 minutes'
          },
          {
            id: crypto.randomUUID(),
            name: 'Initial Classification',
            description: 'Classify incident by category and severity',
            responsibleRole: 'Incident Coordinator',
            steps: [
              'Determine incident category',
              'Assess severity level',
              'Identify CUI involvement',
              'Determine response time requirement',
              'Assign incident priority',
              'Notify response team'
            ],
            tools: ['Incident management system', 'Classification matrix'],
            documentation: ['Classification record', 'Notification log'],
            cmmcControl: 'IR.L2-3.6.1',
            estimatedDuration: '15-30 minutes'
          }
        ],
        successCriteria: [
          'Incident validated and classified',
          'Response team notified',
          'Initial timeline documented',
          'Affected systems identified',
          'Containment strategy defined'
        ],
        cmmcControls: ['IR.L2-3.6.1', 'AU.L2-3.3.1', 'AU.L2-3.3.2', 'SI.L2-3.14.6'],
        estimatedDuration: '1-2 hours',
        prerequisites: ['Functioning monitoring tools', 'Trained analysts', 'Classification criteria']
      },
      {
        phase: 'containment',
        name: 'Containment',
        description: 'Limit incident scope and prevent further damage',
        objectives: [
          'Isolate affected systems',
          'Prevent lateral movement',
          'Protect critical assets',
          'Preserve evidence',
          'Implement short-term containment'
        ],
        activities: [
          {
            id: crypto.randomUUID(),
            name: 'System Isolation',
            description: 'Isolate compromised systems from network',
            responsibleRole: 'Network Administrator',
            steps: [
              'Identify affected systems',
              'Document network connections',
              'Implement network segmentation',
              'Block malicious traffic',
              'Preserve system state for forensics'
            ],
            tools: ['Firewall', 'Network switches', 'EDR', 'Network access control'],
            documentation: ['Isolation log', 'Network diagrams', 'System snapshots'],
            cmmcControl: 'IR.L2-3.6.1',
            estimatedDuration: '30 minutes - 2 hours'
          },
          {
            id: crypto.randomUUID(),
            name: 'Evidence Preservation',
            description: 'Preserve forensic evidence',
            responsibleRole: 'Forensics Specialist',
            steps: [
              'Create forensic images',
              'Document chain of custody',
              'Preserve log files',
              'Capture memory dumps',
              'Store evidence securely'
            ],
            tools: ['Forensic tools', 'Write blockers', 'Hash utilities'],
            documentation: ['Chain of custody', 'Evidence inventory', 'Hash values'],
            cmmcControl: 'AU.L2-3.3.4',
            estimatedDuration: '1-4 hours'
          }
        ],
        successCriteria: [
          'Affected systems isolated',
          'Spread prevented',
          'Evidence preserved',
          'Critical systems protected',
          'Containment verified'
        ],
        cmmcControls: ['IR.L2-3.6.1', 'AU.L2-3.3.4', 'SC.L2-3.13.1'],
        estimatedDuration: '2-8 hours',
        prerequisites: ['Identified affected systems', 'Network access', 'Forensic tools ready']
      },
      {
        phase: 'eradication',
        name: 'Eradication',
        description: 'Remove threat from environment',
        objectives: [
          'Eliminate root cause',
          'Remove malware',
          'Delete unauthorized access',
          'Patch vulnerabilities',
          'Harden systems'
        ],
        activities: [
          {
            id: crypto.randomUUID(),
            name: 'Threat Removal',
            description: 'Remove malicious code and unauthorized access',
            responsibleRole: 'Security Engineer',
            steps: [
              'Identify all affected systems',
              'Remove malware',
              'Delete unauthorized accounts',
              'Remove backdoors',
              'Verify complete removal'
            ],
            tools: ['Anti-malware tools', 'EDR', 'System administration tools'],
            documentation: ['Removal log', 'Verification results', 'System inventory'],
            cmmcControl: 'SI.L2-3.14.2',
            estimatedDuration: '2-8 hours'
          },
          {
            id: crypto.randomUUID(),
            name: 'Vulnerability Remediation',
            description: 'Patch exploited vulnerabilities',
            responsibleRole: 'System Administrator',
            steps: [
              'Identify exploited vulnerabilities',
              'Test patches in isolated environment',
              'Apply security patches',
              'Update system configurations',
              'Verify remediation'
            ],
            tools: ['Patch management', 'Vulnerability scanner', 'Configuration tools'],
            documentation: ['Patch log', 'Configuration changes', 'Validation results'],
            cmmcControl: 'SI.L2-3.14.1',
            estimatedDuration: '4-12 hours'
          }
        ],
        successCriteria: [
          'Threats completely removed',
          'Vulnerabilities patched',
          'Systems hardened',
          'No reinfection detected',
          'Security baselines restored'
        ],
        cmmcControls: ['SI.L2-3.14.1', 'SI.L2-3.14.2', 'CM.L2-3.4.7'],
        estimatedDuration: '1-3 days',
        prerequisites: ['Threats identified', 'Patches available', 'Test environment ready']
      },
      {
        phase: 'recovery',
        name: 'Recovery',
        description: 'Restore systems to normal operations',
        objectives: [
          'Restore systems from clean backups',
          'Verify system integrity',
          'Resume business operations',
          'Implement enhanced monitoring',
          'Validate security controls'
        ],
        activities: [
          {
            id: crypto.randomUUID(),
            name: 'System Restoration',
            description: 'Restore systems to operational status',
            responsibleRole: 'System Administrator',
            steps: [
              'Verify clean backups available',
              'Restore systems from backup',
              'Apply current patches',
              'Reconfigure security settings',
              'Reconnect to network',
              'Verify functionality'
            ],
            tools: ['Backup systems', 'Configuration management', 'Monitoring tools'],
            documentation: ['Restoration log', 'Validation tests', 'Change records'],
            cmmcControl: 'CP.L2-3.7.1',
            estimatedDuration: '4-24 hours'
          },
          {
            id: crypto.randomUUID(),
            name: 'Enhanced Monitoring',
            description: 'Implement increased monitoring',
            responsibleRole: 'Security Analyst',
            steps: [
              'Deploy additional monitoring',
              'Increase log collection',
              'Set up specific alerts',
              'Monitor for reinfection',
              'Watch for related activity'
            ],
            tools: ['SIEM', 'Log management', 'Network monitoring', 'EDR'],
            documentation: ['Monitoring plan', 'Alert configuration', 'Observation log'],
            cmmcControl: 'AU.L2-3.3.1',
            estimatedDuration: 'Ongoing for 30 days'
          }
        ],
        successCriteria: [
          'Systems fully operational',
          'No signs of compromise',
          'Business operations resumed',
          'Enhanced monitoring active',
          'Users notified'
        ],
        cmmcControls: ['CP.L2-3.7.1', 'CP.L2-3.7.2', 'AU.L2-3.3.1'],
        estimatedDuration: '1-5 days',
        prerequisites: ['Clean backups verified', 'Threats eradicated', 'Patches applied']
      },
      {
        phase: 'post-incident',
        name: 'Post-Incident Activity',
        description: 'Learn from incident and improve defenses',
        objectives: [
          'Conduct lessons learned review',
          'Document root cause',
          'Update incident response plan',
          'Implement improvements',
          'Complete regulatory reporting'
        ],
        activities: [
          {
            id: crypto.randomUUID(),
            name: 'Lessons Learned',
            description: 'Conduct post-incident review',
            responsibleRole: 'Incident Response Manager',
            steps: [
              'Schedule review meeting',
              'Gather incident documentation',
              'Review timeline and decisions',
              'Identify improvement opportunities',
              'Document lessons learned',
              'Assign improvement actions'
            ],
            tools: ['Meeting platform', 'Documentation system'],
            documentation: ['Lessons learned report', 'Action items', 'Timeline analysis'],
            cmmcControl: 'IR.L2-3.6.3',
            estimatedDuration: '2-4 hours'
          },
          {
            id: crypto.randomUUID(),
            name: 'Reporting',
            description: 'Complete required incident reporting',
            responsibleRole: 'Compliance Officer',
            steps: [
              'Compile incident details',
              'Prepare regulatory reports',
              'Submit to required agencies',
              'Document reporting',
              'Track follow-up requirements'
            ],
            tools: ['Reporting systems', 'DIBNET portal'],
            documentation: ['Incident report', 'Submission records', 'Agency correspondence'],
            cmmcControl: 'IR.L2-3.6.2',
            estimatedDuration: '4-8 hours'
          }
        ],
        successCriteria: [
          'Lessons learned documented',
          'Improvements identified',
          'Action items assigned',
          'Reports submitted',
          'Plan updated'
        ],
        cmmcControls: ['IR.L2-3.6.2', 'IR.L2-3.6.3'],
        estimatedDuration: '1-2 weeks',
        prerequisites: ['Incident closed', 'Documentation complete', 'Team available']
      }
    ];
  }

  getCMMCIncidentMappings(): CMMCIncidentMapping[] {
    return [
      {
        controlId: 'IR.L2-3.6.1',
        controlName: 'Incident Response Capability',
        domain: 'Incident Response',
        requirement: 'Establish an operational incident-handling capability for organizational systems that includes preparation, detection, analysis, containment, recovery, and user response activities.',
        incidentPhases: ['preparation', 'detection', 'analysis', 'containment', 'recovery'],
        implementationGuidance: 'Organizations must establish and maintain a comprehensive incident response capability covering all phases of incident handling.',
        evidenceRequirements: [
          'Documented incident response plan',
          'Trained response team',
          'Incident handling procedures',
          'Response tools and resources',
          'Testing and exercise records'
        ],
        validationMethod: 'Review plan, interview team, observe exercises'
      },
      {
        controlId: 'IR.L2-3.6.2',
        controlName: 'Incident Reporting',
        domain: 'Incident Response',
        requirement: 'Track, document, and report incidents to designated officials and/or authorities both internal and external to the organization.',
        incidentPhases: ['detection', 'analysis', 'post-incident'],
        implementationGuidance: 'CUI incidents must be reported to DoD within 72 hours per DFARS 252.204-7012.',
        evidenceRequirements: [
          'Incident tracking system',
          'Reporting procedures',
          'Report templates',
          'Submission records',
          'Timeline documentation'
        ],
        validationMethod: 'Review incident records and reporting documentation'
      },
      {
        controlId: 'IR.L2-3.6.3',
        controlName: 'Incident Response Testing',
        domain: 'Incident Response',
        requirement: 'Test the organizational incident response capability.',
        incidentPhases: ['preparation', 'post-incident'],
        implementationGuidance: 'Regular testing through tabletop exercises, simulations, or actual incident response validates capability.',
        evidenceRequirements: [
          'Test plan',
          'Exercise scenarios',
          'Test results',
          'Lessons learned',
          'Improvement actions'
        ],
        validationMethod: 'Review test documentation and improvement actions'
      },
      {
        controlId: 'AU.L2-3.3.1',
        controlName: 'Audit Events',
        domain: 'Audit and Accountability',
        requirement: 'Create, protect, and retain system audit records to the extent needed to enable monitoring, analysis, investigation, and reporting of unlawful, unauthorized, or inappropriate system activity.',
        incidentPhases: ['detection', 'analysis', 'containment', 'recovery'],
        implementationGuidance: 'Audit logs are critical for incident detection and forensic analysis.',
        evidenceRequirements: [
          'Audit log retention policy',
          'Log collection configuration',
          'Log storage and protection',
          'Log analysis capabilities',
          'Incident investigation records'
        ],
        validationMethod: 'Review logs and analysis capabilities'
      },
      {
        controlId: 'AU.L2-3.3.2',
        controlName: 'Audit Review and Analysis',
        domain: 'Audit and Accountability',
        requirement: 'Ensure that the actions of individual system users can be uniquely traced to those users so they can be held accountable for their actions.',
        incidentPhases: ['detection', 'analysis'],
        implementationGuidance: 'User activity traceability enables accountability and supports incident investigation.',
        evidenceRequirements: [
          'User activity logging',
          'Audit review procedures',
          'Correlation capabilities',
          'Investigation reports',
          'Accountability records'
        ],
        validationMethod: 'Test user traceability in logs'
      }
    ];
  }

  getDefaultTrainingRequirements(): TrainingRequirement[] {
    return [
      {
        id: crypto.randomUUID(),
        role: 'Incident Response Team Member',
        trainingType: 'Incident Response Fundamentals',
        frequency: 'Annual',
        duration: '8 hours',
        provider: 'Internal or certified external provider',
        competencyValidation: 'Tabletop exercise participation',
        cmmcControl: 'AT.L2-3.2.1'
      },
      {
        id: crypto.randomUUID(),
        role: 'Incident Commander',
        trainingType: 'Incident Command and Coordination',
        frequency: 'Annual',
        duration: '16 hours',
        provider: 'Certified incident response training',
        competencyValidation: 'Lead simulated incident',
        cmmcControl: 'AT.L2-3.2.2'
      },
      {
        id: crypto.randomUUID(),
        role: 'Forensics Specialist',
        trainingType: 'Digital Forensics and Evidence Handling',
        frequency: 'Annual with quarterly updates',
        duration: '40 hours initial, 8 hours annual',
        provider: 'Certified forensics training',
        competencyValidation: 'Forensic analysis exercise',
        cmmcControl: 'AT.L2-3.2.2'
      },
      {
        id: crypto.randomUUID(),
        role: 'All Personnel',
        trainingType: 'Security Awareness - Incident Reporting',
        frequency: 'Annual',
        duration: '1 hour',
        provider: 'Internal security team',
        competencyValidation: 'Completion quiz',
        cmmcControl: 'AT.L2-3.2.1'
      }
    ];
  }

  getDefaultTestingSchedule(): TestingSchedule[] {
    const now = new Date();
    return [
      {
        id: crypto.randomUUID(),
        testType: 'tabletop',
        scenario: 'CUI data spillage',
        frequency: 'Quarterly',
        participants: ['Response team', 'Management', 'Legal'],
        objectives: [
          'Test notification procedures',
          'Validate escalation paths',
          'Practice decision making',
          'Review reporting requirements'
        ],
        successCriteria: [
          'All participants engaged',
          'Procedures followed correctly',
          'Decisions documented',
          'Improvements identified'
        ],
        nextScheduled: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
        findings: []
      },
      {
        id: crypto.randomUUID(),
        testType: 'simulation',
        scenario: 'Ransomware attack',
        frequency: 'Semi-annual',
        participants: ['Response team', 'IT staff', 'System owners'],
        objectives: [
          'Test technical response',
          'Validate containment procedures',
          'Practice recovery process',
          'Assess backup restoration'
        ],
        successCriteria: [
          'Containment achieved',
          'Systems restored',
          'Data recovered',
          'Timeline documented'
        ],
        nextScheduled: new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000),
        findings: []
      }
    ];
  }

  getDefaultMetrics(): MetricsTracking {
    return {
      kpis: [
        { name: 'Mean Time to Detect (MTTD)', target: 15, current: 0, unit: 'minutes' },
        { name: 'Mean Time to Respond (MTTR)', target: 60, current: 0, unit: 'minutes' },
        { name: 'Mean Time to Contain', target: 4, current: 0, unit: 'hours' },
        { name: 'Mean Time to Recover', target: 24, current: 0, unit: 'hours' }
      ],
      incidentTrends: [],
      responseEffectiveness: [],
      complianceMetrics: []
    };
  }

  async exportToHTML(plan: IncidentResponsePlan): Promise<string> {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${plan.title}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 10px;
      margin-bottom: 30px;
    }
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 2em;
    }
    .metadata {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 10px;
      font-size: 0.9em;
    }
    .section {
      background: white;
      padding: 25px;
      margin-bottom: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .section h2 {
      color: #667eea;
      border-bottom: 2px solid #667eea;
      padding-bottom: 10px;
      margin-top: 0;
    }
    .section h3 {
      color: #764ba2;
      margin-top: 20px;
    }
    .classification-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 15px;
      margin-top: 15px;
    }
    .classification-card {
      border: 1px solid #ddd;
      border-radius: 6px;
      padding: 15px;
      background: #f9f9f9;
    }
    .severity-critical { border-left: 4px solid #dc2626; }
    .severity-high { border-left: 4px solid #ea580c; }
    .severity-medium { border-left: 4px solid #f59e0b; }
    .severity-low { border-left: 4px solid #10b981; }
    .phase-card {
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 20px;
      margin-bottom: 20px;
      background: #fafafa;
    }
    .activity {
      background: white;
      border-left: 3px solid #667eea;
      padding: 15px;
      margin: 10px 0;
      border-radius: 4px;
    }
    .cmmc-badge {
      display: inline-block;
      background: #10b981;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.85em;
      margin: 2px;
    }
    .team-member {
      background: #f0f4ff;
      border-radius: 6px;
      padding: 15px;
      margin: 10px 0;
    }
    .contact-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 15px;
      margin: 10px 0;
    }
    .priority-primary { border-left: 4px solid #dc2626; }
    .priority-secondary { border-left: 4px solid #f59e0b; }
    .priority-tertiary { border-left: 4px solid #3b82f6; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background: #667eea;
      color: white;
      font-weight: 600;
    }
    tr:hover {
      background: #f9f9f9;
    }
    ul, ol {
      padding-left: 25px;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #666;
      font-size: 0.9em;
      margin-top: 30px;
      border-top: 2px solid #ddd;
    }
    @media print {
      body { background: white; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${plan.title}</h1>
    <div class="metadata">
      <div><strong>Version:</strong> ${plan.version}</div>
      <div><strong>Organization:</strong> ${plan.organization}</div>
      <div><strong>Effective Date:</strong> ${plan.effectiveDate.toLocaleDateString()}</div>
      <div><strong>Review Date:</strong> ${plan.reviewDate.toLocaleDateString()}</div>
    </div>
  </div>

  <div class="section">
    <h2>Executive Summary</h2>
    <p>This Incident Response Plan establishes the organizational capability to respond effectively to cybersecurity incidents in compliance with CMMC Level 2 requirements, specifically addressing controls IR.L2-3.6.1, IR.L2-3.6.2, and IR.L2-3.6.3.</p>
    <p>The plan provides comprehensive procedures for incident preparation, detection, analysis, containment, eradication, recovery, and post-incident activities, with special emphasis on protecting Controlled Unclassified Information (CUI) and meeting DoD reporting requirements.</p>
  </div>

  <div class="section">
    <h2>Incident Classifications</h2>
    <p>All incidents are classified by category and severity to determine appropriate response actions and timelines.</p>
    <div class="classification-grid">
      ${plan.classifications.map(cls => `
        <div class="classification-card severity-${cls.severity}">
          <h4>${cls.category.replace(/-/g, ' ').toUpperCase()}</h4>
          <p><strong>Severity:</strong> ${cls.severity.toUpperCase()}</p>
          <p><strong>Priority:</strong> ${cls.priority}</p>
          <p><strong>Response Time:</strong> ${cls.responseTime}</p>
          <p><strong>CUI Involved:</strong> ${cls.cuiInvolved ? 'Yes' : 'No'}</p>
          <p><strong>External Reporting:</strong> ${cls.externalReportingRequired ? 'Required' : 'Not Required'}</p>
          <div>
            <strong>CMMC Controls:</strong><br>
            ${cls.cmmcControls.map(c => `<span class="cmmc-badge">${c}</span>`).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  </div>

  <div class="section">
    <h2>Response Team</h2>
    ${plan.responseTeam.length > 0 ? `
      ${plan.responseTeam.map(member => `
        <div class="team-member">
          <h4>${member.name} - ${member.role}</h4>
          <p><strong>Responsibility:</strong> ${member.responsibility === 'R' ? 'Responsible' : member.responsibility === 'A' ? 'Accountable' : member.responsibility === 'C' ? 'Consulted' : 'Informed'}</p>
          <p><strong>Contact:</strong> ${member.email} | ${member.phone}</p>
          <p><strong>Availability:</strong> ${member.availability}</p>
          <p><strong>Skills:</strong> ${member.skills.join(', ')}</p>
          <p><strong>Escalation Level:</strong> ${member.escalationLevel}</p>
        </div>
      `).join('')}
    ` : '<p>No team members defined yet.</p>'}
  </div>

  <div class="section">
    <h2>Incident Response Phases</h2>
    ${plan.responsePhases.map(phase => `
      <div class="phase-card">
        <h3>${phase.name}</h3>
        <p>${phase.description}</p>
        <p><strong>Estimated Duration:</strong> ${phase.estimatedDuration}</p>

        <h4>Objectives</h4>
        <ul>
          ${phase.objectives.map(obj => `<li>${obj}</li>`).join('')}
        </ul>

        <h4>Key Activities</h4>
        ${phase.activities.map(activity => `
          <div class="activity">
            <h5>${activity.name}</h5>
            <p>${activity.description}</p>
            <p><strong>Responsible Role:</strong> ${activity.responsibleRole}</p>
            <p><strong>Duration:</strong> ${activity.estimatedDuration}</p>
            ${activity.cmmcControl ? `<p><strong>CMMC Control:</strong> <span class="cmmc-badge">${activity.cmmcControl}</span></p>` : ''}
            <p><strong>Steps:</strong></p>
            <ol>
              ${activity.steps.map(step => `<li>${step}</li>`).join('')}
            </ol>
            <p><strong>Tools:</strong> ${activity.tools.join(', ')}</p>
            <p><strong>Documentation:</strong> ${activity.documentation.join(', ')}</p>
          </div>
        `).join('')}

        <h4>Success Criteria</h4>
        <ul>
          ${phase.successCriteria.map(criteria => `<li>${criteria}</li>`).join('')}
        </ul>

        <div>
          <strong>CMMC Controls:</strong>
          ${phase.cmmcControls.map(c => `<span class="cmmc-badge">${c}</span>`).join('')}
        </div>
      </div>
    `).join('')}
  </div>

  <div class="section">
    <h2>Escalation Procedures</h2>
    ${plan.escalationProcedures.map(proc => `
      <div class="phase-card">
        <h3>Level ${proc.level}: ${proc.name}</h3>
        <p><strong>Timeframe:</strong> ${proc.timeframe}</p>

        <h4>Trigger Conditions</h4>
        <ul>
          ${proc.triggerConditions.map(cond => `<li>${cond}</li>`).join('')}
        </ul>

        <h4>Notification Methods</h4>
        <p>${proc.notificationMethod.join(', ')}</p>

        <h4>Authority</h4>
        <ul>
          ${proc.authority.map(auth => `<li>${auth}</li>`).join('')}
        </ul>

        <h4>Required Documentation</h4>
        <ul>
          ${proc.documentation.map(doc => `<li>${doc}</li>`).join('')}
        </ul>
      </div>
    `).join('')}
  </div>

  <div class="section">
    <h2>Communication Templates</h2>
    ${plan.communicationTemplates.map(template => `
      <div class="activity">
        <h4>${template.name}</h4>
        <p><strong>Type:</strong> ${template.type}</p>
        <p><strong>Send Timing:</strong> ${template.sendTiming}</p>
        <p><strong>Approval Required:</strong> ${template.approvalRequired ? 'Yes' : 'No'}</p>
        ${template.cmmcRequirement ? `<p><strong>CMMC Requirement:</strong> <span class="cmmc-badge">${template.cmmcRequirement}</span></p>` : ''}
        <p><strong>Recipients:</strong> ${template.recipients.join(', ')}</p>
        <p><strong>Subject:</strong> ${template.subject}</p>
        <pre style="background: #f5f5f5; padding: 15px; border-radius: 4px; overflow-x: auto;">${template.body}</pre>
      </div>
    `).join('')}
  </div>

  <div class="section">
    <h2>CMMC Compliance Mapping</h2>
    <table>
      <thead>
        <tr>
          <th>Control ID</th>
          <th>Control Name</th>
          <th>Domain</th>
          <th>Incident Phases</th>
        </tr>
      </thead>
      <tbody>
        ${plan.cmmcMapping.map(mapping => `
          <tr>
            <td><span class="cmmc-badge">${mapping.controlId}</span></td>
            <td>${mapping.controlName}</td>
            <td>${mapping.domain}</td>
            <td>${mapping.incidentPhases.join(', ')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>Training Requirements</h2>
    <table>
      <thead>
        <tr>
          <th>Role</th>
          <th>Training Type</th>
          <th>Frequency</th>
          <th>Duration</th>
          <th>Validation</th>
        </tr>
      </thead>
      <tbody>
        ${plan.trainingRequirements.map(req => `
          <tr>
            <td>${req.role}</td>
            <td>${req.trainingType}</td>
            <td>${req.frequency}</td>
            <td>${req.duration}</td>
            <td>${req.competencyValidation}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>Testing Schedule</h2>
    <table>
      <thead>
        <tr>
          <th>Test Type</th>
          <th>Scenario</th>
          <th>Frequency</th>
          <th>Next Scheduled</th>
        </tr>
      </thead>
      <tbody>
        ${plan.testingSchedule.map(test => `
          <tr>
            <td>${test.testType}</td>
            <td>${test.scenario}</td>
            <td>${test.frequency}</td>
            <td>${test.nextScheduled.toLocaleDateString()}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="footer">
    <p><strong>${plan.title}</strong></p>
    <p>Version ${plan.version} | Generated: ${new Date().toLocaleDateString()}</p>
    <p>CMMC Level 2 Compliant Incident Response Plan</p>
  </div>
</body>
</html>
    `;

    return html;
  }
}

export default IncidentResponseService.getInstance();
