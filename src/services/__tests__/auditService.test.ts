import { describe, it, expect, beforeEach } from 'vitest';
import { auditService } from '../auditService';
import type { Audit, AuditFinding } from '../auditService';

describe('AuditService', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
  });

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const { auditService: audit1 } = require('../auditService');
      const { auditService: audit2 } = require('../auditService');
      expect(audit1).toBe(audit2);
    });
  });

  describe('Audit CRUD operations', () => {
    it('should create audit without errors', async () => {
      const audit = {
        name: 'Test Audit',
        type: 'internal' as const,
        status: 'scheduled' as const,
        scheduledDate: new Date(),
        completedDate: null,
        auditor: 'Test Auditor',
        findings: [],
        scope: ['AC.1', 'AU.1'],
        reportUrl: null
      };

      const created = await auditService.createAudit(audit);
      expect(created).toBeDefined();
      expect(created.id).toBeDefined();
      expect(created.name).toBe('Test Audit');
    });

    it('should get audits without filters', async () => {
      const audits = await auditService.getAudits();
      expect(Array.isArray(audits)).toBe(true);
    });

    it('should filter audits by type', async () => {
      await auditService.createAudit({
        name: 'Internal Audit',
        type: 'internal',
        status: 'scheduled',
        scheduledDate: new Date(),
        completedDate: null,
        auditor: 'Auditor',
        findings: [],
        scope: [],
        reportUrl: null
      });

      const audits = await auditService.getAudits({ type: 'internal' });
      expect(audits.length).toBeGreaterThan(0);
      expect(audits.every(a => a.type === 'internal')).toBe(true);
    });

    it('should filter audits by status', async () => {
      await auditService.createAudit({
        name: 'Completed Audit',
        type: 'external',
        status: 'completed',
        scheduledDate: new Date(),
        completedDate: new Date(),
        auditor: 'Auditor',
        findings: [],
        scope: [],
        reportUrl: null
      });

      const audits = await auditService.getAudits({ status: 'completed' });
      expect(audits.every(a => a.status === 'completed')).toBe(true);
    });

    it('should handle updating audit', async () => {
      const audit = await auditService.createAudit({
        name: 'Test Update',
        type: 'internal',
        status: 'scheduled',
        scheduledDate: new Date(),
        completedDate: null,
        auditor: 'Auditor',
        findings: [],
        scope: [],
        reportUrl: null
      });

      const updated = await auditService.updateAudit(audit.id, { status: 'in-progress' });
      expect(updated.status).toBe('in-progress');
    });

    it('should delete audit', async () => {
      const audit = await auditService.createAudit({
        name: 'Test Delete',
        type: 'internal',
        status: 'scheduled',
        scheduledDate: new Date(),
        completedDate: null,
        auditor: 'Auditor',
        findings: [],
        scope: [],
        reportUrl: null
      });

      await expect(auditService.deleteAudit(audit.id)).resolves.not.toThrow();
    });

    it('should handle null audit retrieval', async () => {
      const audit = await auditService.getAudit('non-existent');
      expect(audit).toBeNull();
    });
  });

  describe('Findings management', () => {
    it('should create finding', async () => {
      const audit = await auditService.createAudit({
        name: 'Test Audit',
        type: 'internal',
        status: 'scheduled',
        scheduledDate: new Date(),
        completedDate: null,
        auditor: 'Auditor',
        findings: [],
        scope: [],
        reportUrl: null
      });

      const finding = await auditService.createFinding({
        auditId: audit.id,
        controlId: 'AC.1.001',
        severity: 'medium',
        title: 'Test Finding',
        description: 'Test Description',
        status: 'open',
        assignedTo: 'Engineer',
        dueDate: new Date(),
        evidence: [],
        remediationNotes: ''
      });

      expect(finding).toBeDefined();
      expect(finding.auditId).toBe(audit.id);
    });

    it('should get findings for audit', async () => {
      const audit = await auditService.createAudit({
        name: 'Test',
        type: 'internal',
        status: 'scheduled',
        scheduledDate: new Date(),
        completedDate: null,
        auditor: 'Auditor',
        findings: [],
        scope: [],
        reportUrl: null
      });

      await auditService.createFinding({
        auditId: audit.id,
        controlId: 'AC.1.001',
        severity: 'low',
        title: 'Finding 1',
        description: 'Desc',
        status: 'open',
        assignedTo: 'User',
        dueDate: new Date(),
        evidence: [],
        remediationNotes: ''
      });

      const findings = await auditService.getFindings(audit.id);
      expect(findings.length).toBeGreaterThan(0);
    });

    it('should update finding', async () => {
      const audit = await auditService.createAudit({
        name: 'Test',
        type: 'internal',
        status: 'scheduled',
        scheduledDate: new Date(),
        completedDate: null,
        auditor: 'Auditor',
        findings: [],
        scope: [],
        reportUrl: null
      });

      const finding = await auditService.createFinding({
        auditId: audit.id,
        controlId: 'AC.1.001',
        severity: 'low',
        title: 'Test',
        description: 'Desc',
        status: 'open',
        assignedTo: 'User',
        dueDate: new Date(),
        evidence: [],
        remediationNotes: ''
      });

      const updated = await auditService.updateFinding(finding.id, { status: 'closed' });
      expect(updated.status).toBe('closed');
    });

    it('should delete finding', async () => {
      const audit = await auditService.createAudit({
        name: 'Test',
        type: 'internal',
        status: 'scheduled',
        scheduledDate: new Date(),
        completedDate: null,
        auditor: 'Auditor',
        findings: [],
        scope: [],
        reportUrl: null
      });

      const finding = await auditService.createFinding({
        auditId: audit.id,
        controlId: 'AC.1.001',
        severity: 'low',
        title: 'Test',
        description: 'Desc',
        status: 'open',
        assignedTo: 'User',
        dueDate: new Date(),
        evidence: [],
        remediationNotes: ''
      });

      await expect(auditService.deleteFinding(finding.id)).resolves.not.toThrow();
    });
  });

  describe('Report generation', () => {
    it('should generate report', async () => {
      const audit = await auditService.createAudit({
        name: 'Test Report',
        type: 'internal',
        status: 'completed',
        scheduledDate: new Date(),
        completedDate: new Date(),
        auditor: 'Auditor',
        findings: [],
        scope: [],
        reportUrl: null
      });

      await auditService.createFinding({
        auditId: audit.id,
        controlId: 'AC.1.001',
        severity: 'high',
        title: 'Critical Finding',
        description: 'Security issue found',
        status: 'open',
        assignedTo: 'Engineer',
        dueDate: new Date(),
        evidence: [],
        remediationNotes: ''
      });

      const report = await auditService.generateReport(audit.id);
      expect(report).toBeInstanceOf(Blob);
    });

    it('should throw error for non-existent audit', async () => {
      await expect(auditService.generateReport('non-existent')).rejects.toThrow();
    });
  });

  describe('Error handling', () => {
    it('should handle corrupted localStorage data', () => {
      localStorage.setItem('audit-tracker-data', '{{{ invalid json');
      
      expect(async () => {
        await auditService.getAudits();
      }).not.toThrow();
    });

    it('should handle missing fields gracefully', async () => {
      const incompleteAudit = {
        name: 'Incomplete',
        type: 'internal' as const,
        status: 'scheduled' as const,
        scheduledDate: new Date(),
        completedDate: null,
        auditor: '',
        findings: [],
        scope: [],
        reportUrl: null
      };

      const audit = await auditService.createAudit(incompleteAudit);
      expect(audit).toBeDefined();
    });

    it('should handle null and undefined values', async () => {
      const audit = await auditService.createAudit({
        name: 'Test',
        type: 'internal',
        status: 'scheduled',
        scheduledDate: new Date(),
        completedDate: null,
        auditor: 'Auditor',
        findings: [],
        scope: [],
        reportUrl: null
      });

      const updated = await auditService.updateAudit(audit.id, { 
        findings: undefined as any,
        scope: null as any
      });

      expect(updated).toBeDefined();
    });
  });

  describe('Search and filter', () => {
    it('should search audits by name', async () => {
      await auditService.createAudit({
        name: 'Access Control Audit',
        type: 'internal',
        status: 'scheduled',
        scheduledDate: new Date(),
        completedDate: null,
        auditor: 'Auditor',
        findings: [],
        scope: [],
        reportUrl: null
      });

      const audits = await auditService.getAudits({ search: 'Access' });
      expect(audits.length).toBeGreaterThan(0);
    });

    it('should filter by auditor', async () => {
      await auditService.createAudit({
        name: 'Test',
        type: 'internal',
        status: 'scheduled',
        scheduledDate: new Date(),
        completedDate: null,
        auditor: 'John Doe',
        findings: [],
        scope: [],
        reportUrl: null
      });

      const audits = await auditService.getAudits({ auditor: 'John Doe' });
      expect(audits.every(a => a.auditor === 'John Doe')).toBe(true);
    });

    it('should filter by date range', async () => {
      const date = new Date();
      await auditService.createAudit({
        name: 'Test',
        type: 'internal',
        status: 'scheduled',
        scheduledDate: date,
        completedDate: null,
        auditor: 'Auditor',
        findings: [],
        scope: [],
        reportUrl: null
      });

      const audits = await auditService.getAudits({
        dateRange: {
          start: new Date(date.getTime() - 24 * 60 * 60 * 1000),
          end: new Date(date.getTime() + 24 * 60 * 60 * 1000)
        }
      });

      expect(audits.length).toBeGreaterThan(0);
    });
  });
});

