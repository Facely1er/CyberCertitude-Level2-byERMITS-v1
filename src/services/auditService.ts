import { logger } from '../utils/logger';

export interface AuditFinding {
  id: string;
  auditId: string;
  controlId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  status: 'open' | 'in-remediation' | 'closed';
  assignedTo: string;
  dueDate: Date;
  evidence: string[];
  remediationNotes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Audit {
  id: string;
  name: string;
  type: 'internal' | 'external' | 'cmmc';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  scheduledDate: Date;
  completedDate: Date | null;
  auditor: string;
  findings: AuditFinding[];
  scope: string[];
  reportUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditFilters {
  type?: string;
  status?: string;
  auditor?: string;
  dateRange?: { start: Date; end: Date };
  search?: string;
}

export class AuditService {
  private static instance: AuditService;
  private readonly STORAGE_KEY = 'audit-tracker-data';

  static getInstance(): AuditService {
    if (!AuditService.instance) {
      AuditService.instance = new AuditService();
    }
    return AuditService.instance;
  }

  private constructor() {
    this.initializeStorage();
  }

  private initializeStorage(): void {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) {
        const initialData = {
          audits: [],
          findings: [],
          version: '1.0.0'
        };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialData));
      }
    } catch (error) {
      logger.error('Failed to initialize audit storage', error);
    }
  }

  private getStoredData(): { audits: Audit[]; findings: AuditFinding[] } {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return { audits: [], findings: [] };
      const parsed = JSON.parse(data);
      return {
        audits: parsed.audits || [],
        findings: parsed.findings || []
      };
    } catch (error) {
      logger.error('Failed to get stored audit data', error);
      return { audits: [], findings: [] };
    }
  }

  private saveData(audits: Audit[], findings: AuditFinding[]): void {
    try {
      const data = {
        audits,
        findings,
        version: '1.0.0',
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      logger.error('Failed to save audit data', error);
    }
  }

  async getAudits(filters?: AuditFilters): Promise<Audit[]> {
    try {
      const { audits } = this.getStoredData();
      let filtered = [...audits];

      if (filters?.type) {
        filtered = filtered.filter(a => a.type === filters.type);
      }

      if (filters?.status) {
        filtered = filtered.filter(a => a.status === filters.status);
      }

      if (filters?.auditor) {
        filtered = filtered.filter(a => a.auditor === filters.auditor);
      }

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(a =>
          a.name.toLowerCase().includes(searchLower) ||
          a.type.toLowerCase().includes(searchLower)
        );
      }

      if (filters?.dateRange) {
        filtered = filtered.filter(a => {
          const scheduledDate = new Date(a.scheduledDate);
          return scheduledDate >= filters.dateRange!.start && scheduledDate <= filters.dateRange!.end;
        });
      }

      return filtered.sort((a, b) => 
        new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
      );
    } catch (error) {
      logger.error('Failed to get audits', error);
      return [];
    }
  }

  async getAudit(auditId: string): Promise<Audit | null> {
    try {
      const { audits } = this.getStoredData();
      return audits.find(a => a.id === auditId) || null;
    } catch (error) {
      logger.error('Failed to get audit', error);
      return null;
    }
  }

  async createAudit(audit: Omit<Audit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Audit> {
    try {
      const { audits } = this.getStoredData();
      const newAudit: Audit = {
        ...audit,
        id: `audit-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const updatedAudits = [...audits, newAudit];
      const { findings } = this.getStoredData();
      this.saveData(updatedAudits, findings);
      
      logger.info('Audit created', { auditId: newAudit.id });
      return newAudit;
    } catch (error) {
      logger.error('Failed to create audit', error);
      throw error;
    }
  }

  async updateAudit(auditId: string, updates: Partial<Audit>): Promise<Audit> {
    try {
      const { audits } = this.getStoredData();
      const updatedAudits = audits.map(a =>
        a.id === auditId ? { ...a, ...updates, updatedAt: new Date() } : a
      );
      
      const { findings } = this.getStoredData();
      this.saveData(updatedAudits, findings);
      
      logger.info('Audit updated', { auditId });
      return updatedAudits.find(a => a.id === auditId)!;
    } catch (error) {
      logger.error('Failed to update audit', error);
      throw error;
    }
  }

  async deleteAudit(auditId: string): Promise<void> {
    try {
      const { audits, findings } = this.getStoredData();
      const filteredAudits = audits.filter(a => a.id !== auditId);
      const filteredFindings = findings.filter(f => f.auditId !== auditId);
      
      this.saveData(filteredAudits, filteredFindings);
      logger.info('Audit deleted', { auditId });
    } catch (error) {
      logger.error('Failed to delete audit', error);
      throw error;
    }
  }

  async getFindings(auditId?: string): Promise<AuditFinding[]> {
    try {
      const { findings } = this.getStoredData();
      let filtered = [...findings];

      if (auditId) {
        filtered = filtered.filter(f => f.auditId === auditId);
      }

      return filtered.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      logger.error('Failed to get findings', error);
      return [];
    }
  }

  async createFinding(finding: Omit<AuditFinding, 'id' | 'createdAt' | 'updatedAt'>): Promise<AuditFinding> {
    try {
      const { audits, findings } = this.getStoredData();
      const newFinding: AuditFinding = {
        ...finding,
        id: `finding-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const updatedFindings = [...findings, newFinding];
      this.saveData(audits, updatedFindings);
      
      logger.info('Finding created', { findingId: newFinding.id });
      return newFinding;
    } catch (error) {
      logger.error('Failed to create finding', error);
      throw error;
    }
  }

  async updateFinding(findingId: string, updates: Partial<AuditFinding>): Promise<AuditFinding> {
    try {
      const { audits, findings } = this.getStoredData();
      const updatedFindings = findings.map(f =>
        f.id === findingId ? { ...f, ...updates, updatedAt: new Date() } : f
      );
      
      this.saveData(audits, updatedFindings);
      
      logger.info('Finding updated', { findingId });
      return updatedFindings.find(f => f.id === findingId)!;
    } catch (error) {
      logger.error('Failed to update finding', error);
      throw error;
    }
  }

  async deleteFinding(findingId: string): Promise<void> {
    try {
      const { audits, findings } = this.getStoredData();
      const filteredFindings = findings.filter(f => f.id !== findingId);
      
      this.saveData(audits, filteredFindings);
      logger.info('Finding deleted', { findingId });
    } catch (error) {
      logger.error('Failed to delete finding', error);
      throw error;
    }
  }

  async generateReport(auditId: string): Promise<Blob> {
    try {
      const audit = await this.getAudit(auditId);
      if (!audit) throw new Error('Audit not found');

      const findings = await this.getFindings(auditId);
      
      // Generate PDF report
      const reportData = {
        audit,
        findings,
        generatedAt: new Date().toISOString(),
        summary: {
          totalFindings: findings.length,
          openFindings: findings.filter(f => f.status === 'open').length,
          inRemediation: findings.filter(f => f.status === 'in-remediation').length,
          closedFindings: findings.filter(f => f.status === 'closed').length
        }
      };

      // Create a simple text report for now
      const scheduled = audit.scheduledDate instanceof Date ? audit.scheduledDate : new Date(audit.scheduledDate);
      const reportText = `
AUDIT REPORT
${'='.repeat(50)}

Audit: ${audit.name}
Type: ${audit.type}
Status: ${audit.status}
Scheduled: ${scheduled.toLocaleDateString()}

SUMMARY
${'='.repeat(50)}
Total Findings: ${reportData.summary.totalFindings}
Open: ${reportData.summary.openFindings}
In Remediation: ${reportData.summary.inRemediation}
Closed: ${reportData.summary.closedFindings}

FINDINGS
${'='.repeat(50)}
${findings.map(f => `\n[${f.severity.toUpperCase()}] ${f.title}\n${f.description}\n`).join('\n')}
      `;

      return new Blob([reportText], { type: 'text/plain' });
    } catch (error) {
      logger.error('Failed to generate report', error);
      throw error;
    }
  }
}

export const auditService = AuditService.getInstance();

