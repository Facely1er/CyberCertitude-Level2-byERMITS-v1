import { describe, it, expect, beforeEach, vi } from 'vitest';
import { reportingService } from '../reportingService';
import { dataService } from '../dataService';

vi.mock('../dataService', () => ({
  dataService: {
    getData: vi.fn(() => ({ reports: [] })),
    saveData: vi.fn().mockResolvedValue(undefined)
  }
}));

vi.mock('../controlsService', () => ({
  controlsService: {
    getControlStatistics: vi.fn().mockResolvedValue({
      total: 10,
      complianceRate: 80
    })
  }
}));

vi.mock('../policyService', () => ({
  policyService: {
    getPolicyStatistics: vi.fn().mockResolvedValue({
      total: 5,
      complianceRate: 90
    })
  }
}));

vi.mock('../evidenceService', () => ({
  evidenceService: {
    getEvidenceStatistics: vi.fn().mockResolvedValue({
      totalItems: 20,
      complianceRate: 85
    })
  }
}));

vi.mock('../teamService', () => ({
  teamService: {
    getTeamStatistics: vi.fn().mockResolvedValue({
      totalMembers: 10,
      activeMembers: 8
    })
  }
}));

vi.mock('../calendarService', () => ({
  calendarService: {
    getCalendarStatistics: vi.fn().mockResolvedValue({
      upcomingEvents: 5,
      overdueEvents: 2
    })
  }
}));

vi.mock('../../utils/logger', () => ({
  logger: {
    error: vi.fn(),
    debug: vi.fn()
  }
}));

describe('ReportingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (dataService as any).getData = vi.fn(() => ({ reports: [] }));
  });

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = reportingService;
      const instance2 = reportingService;
      expect(instance1).toBe(instance2);
    });
  });

  describe('Report retrieval', () => {
    it('should get all reports', async () => {
      const mockReports = [
        { id: '1', title: 'Report 1', type: 'compliance' },
        { id: '2', title: 'Report 2', type: 'assessment' }
      ];
      (dataService as any).getData = vi.fn(() => ({ reports: mockReports }));

      const reports = await reportingService.getReports();
      expect(reports).toEqual(mockReports);
    });

    it('should get report by ID', async () => {
      const mockReports = [{ id: '1', title: 'Report 1' }];
      (dataService as any).getData = vi.fn(() => ({ reports: mockReports }));

      const report = await reportingService.getReport('1');
      expect(report).toBeDefined();
      expect(report?.title).toBe('Report 1');
    });

    it('should return null for non-existent report', async () => {
      (dataService as any).getData = vi.fn(() => ({ reports: [] }));
      const report = await reportingService.getReport('non-existent');
      expect(report).toBeNull();
    });
  });

  describe('Report creation', () => {
    it('should generate compliance report', async () => {
      const result = await reportingService.generateComplianceReport(
        'Test Report',
        'Test Description',
        { start: new Date(), end: new Date() },
        'user@example.com'
      );

      expect(result).toBeDefined();
      expect(result.title).toBe('Test Report');
      expect(result.type).toBe('compliance');
    });

    it('should save report', async () => {
      const reportData = {
        id: 'new-report',
        title: 'New Report',
        description: 'Test',
        type: 'compliance' as const,
        status: 'completed' as const,
        generatedBy: 'user@example.com',
        generatedAt: new Date(),
        dataRange: { start: new Date(), end: new Date() },
        filters: {},
        sections: [],
        summary: {} as any,
        recommendations: [],
        attachments: [],
        isConfidential: false,
        accessLevel: 'internal' as const
      };

      const report = await reportingService.saveReport(reportData);
      expect(report).toBeDefined();
      expect(report.id).toBe('new-report');
    });
  });

  describe('Report updates', () => {
    it('should update existing report', async () => {
      const existingReport = {
        id: 'existing',
        title: 'Old Title',
        type: 'compliance' as const,
        status: 'draft' as const,
        generatedBy: 'user@example.com',
        generatedAt: new Date(),
        dataRange: { start: new Date(), end: new Date() },
        filters: {},
        sections: [],
        summary: {} as any,
        recommendations: [],
        attachments: [],
        isConfidential: false,
        accessLevel: 'internal' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      (dataService as any).getData = vi.fn(() => ({ reports: [existingReport] }));

      const updated = await reportingService.updateReport('existing', { title: 'New Title' });
      expect(updated.title).toBe('New Title');
    });

    it('should throw error when updating non-existent report', async () => {
      (dataService as any).getData = vi.fn(() => ({ reports: [] }));

      await expect(
        reportingService.updateReport('non-existent', { title: 'New Title' })
      ).rejects.toThrow('Report not found');
    });
  });

  describe('Report deletion', () => {
    it('should delete report', async () => {
      const mockReports = [{ id: '1', title: 'Report 1' }];
      (dataService as any).getData = vi.fn(() => ({ reports: mockReports }));

      await reportingService.deleteReport('1');
      expect((dataService as any).saveData).toHaveBeenCalled();
    });
  });

  describe('Report filtering', () => {
    it('should search reports by filters', async () => {
      const mockReports = [
        { id: '1', title: 'Compliance Report', type: 'compliance' },
        { id: '2', title: 'Assessment Report', type: 'assessment' }
      ];
      (dataService as any).getData = vi.fn(() => ({ reports: mockReports }));

      const filtered = await reportingService.searchReports({ type: 'compliance' });
      expect(filtered.length).toBe(1);
      expect(filtered[0].type).toBe('compliance');
    });
  });

  describe('Error handling', () => {
    it('should handle errors gracefully', async () => {
      (dataService as any).getData = vi.fn(() => {
        throw new Error('Database error');
      });

      const reports = await reportingService.getReports();
      expect(reports).toEqual([]);
    });
  });
});
