import { describe, it, expect, beforeEach, vi } from 'vitest';
import { evidenceService } from '../evidenceService';
import { dataService } from '../dataService';

vi.mock('../dataService', () => ({
  dataService: {
    getData: vi.fn(),
    saveData: vi.fn()
  }
}));

vi.mock('../../utils/logger', () => ({
  logger: {
    error: vi.fn(),
    debug: vi.fn()
  }
}));

describe('EvidenceService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(dataService.getData).mockReturnValue({ evidenceItems: [] });
  });

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = evidenceService;
      const instance2 = evidenceService;
      expect(instance1).toBe(instance2);
    });
  });

  describe('Evidence retrieval', () => {
    it('should get all evidence items', async () => {
      const mockEvidence = [
        { id: '1', name: 'Evidence 1', type: 'document' },
        { id: '2', name: 'Evidence 2', type: 'screenshot' }
      ];
      vi.mocked(dataService.getData).mockReturnValue({ evidenceItems: mockEvidence });

      const items = await evidenceService.getEvidenceItems();
      expect(items).toEqual(mockEvidence);
    });

    it('should get evidence item by ID', async () => {
      const mockEvidence = [{ id: '1', name: 'Evidence 1', type: 'document' }];
      vi.mocked(dataService.getData).mockReturnValue({ evidenceItems: mockEvidence });

      const item = await evidenceService.getEvidenceItem('1');
      expect(item).toBeDefined();
      expect(item?.name).toBe('Evidence 1');
    });
  });

  describe('Evidence creation', () => {
    it('should save evidence item', async () => {
      const evidenceData = {
        id: 'new-evidence',
        name: 'New Evidence',
        description: 'Test description',
        type: 'document' as const,
        category: 'technical' as const,
        controlId: 'AC.1.001',
        controlName: 'Control Name',
        framework: 'CMMC 2.0',
        status: 'draft' as const,
        uploadDate: new Date(),
        lastModified: new Date(),
        uploadedBy: 'user@example.com',
        tags: [],
        version: '1.0',
        relatedEvidence: [],
        complianceStatus: 'compliant' as const,
        riskLevel: 'low' as const,
        businessValue: 'medium' as const,
        retentionPeriod: 365,
        retentionDate: new Date(),
        isConfidential: false,
        accessLevel: 'internal' as const
      };

      const item = await evidenceService.saveEvidenceItem(evidenceData);
      expect(item).toBeDefined();
      expect(item.id).toBe('new-evidence');
    });

    it('should update existing evidence item', async () => {
      const existingEvidence = {
        id: 'existing',
        name: 'Old Name',
        description: '',
        type: 'document' as const,
        category: 'technical' as const,
        controlId: 'AC.1.001',
        controlName: 'Control',
        framework: 'CMMC',
        status: 'draft' as const,
        uploadDate: new Date(),
        lastModified: new Date(),
        uploadedBy: 'user@example.com',
        tags: [],
        version: '1.0',
        relatedEvidence: [],
        complianceStatus: 'compliant' as const,
        riskLevel: 'low' as const,
        businessValue: 'low' as const,
        retentionPeriod: 365,
        retentionDate: new Date(),
        isConfidential: false,
        accessLevel: 'internal' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      vi.mocked(dataService.getData).mockReturnValue({ evidenceItems: [existingEvidence] });

      const updated = await evidenceService.updateEvidenceItem('existing', { name: 'New Name' });
      expect(updated.name).toBe('New Name');
    });
  });

  describe('Evidence deletion', () => {
    it('should delete evidence item', async () => {
      const mockEvidence = [{ id: '1', name: 'Evidence 1' }];
      vi.mocked(dataService.getData).mockReturnValue({ evidenceItems: mockEvidence });

      await evidenceService.deleteEvidenceItem('1');
      expect(dataService.saveData).toHaveBeenCalled();
    });
  });

  describe('Evidence filtering', () => {
    it('should filter evidence by type', async () => {
      const mockEvidence = [
        { id: '1', name: 'Doc 1', type: 'document' },
        { id: '2', name: 'Screenshot 1', type: 'screenshot' }
      ];
      vi.mocked(dataService.getData).mockReturnValue({ evidenceItems: mockEvidence });

      const filtered = await evidenceService.searchEvidenceItems({ type: 'document' });
      expect(filtered.length).toBe(1);
      expect(filtered[0].type).toBe('document');
    });

    it('should filter evidence by status', async () => {
      const mockEvidence = [
        { id: '1', name: 'Draft', type: 'document' as const, status: 'draft' as const },
        { id: '2', name: 'Approved', type: 'document' as const, status: 'approved' as const }
      ];
      vi.mocked(dataService.getData).mockReturnValue({ evidenceItems: mockEvidence });

      const filtered = await evidenceService.searchEvidenceItems({ status: 'approved' });
      expect(filtered.length).toBe(1);
      expect(filtered[0].status).toBe('approved');
    });
  });

  describe('Statistics', () => {
    it('should calculate evidence statistics', async () => {
      const mockEvidence = [
        { id: '1', type: 'document' as const, category: 'technical' as const, status: 'approved' as const, riskLevel: 'low' as const, fileSize: 1000, uploadedBy: 'user1' },
        { id: '2', type: 'screenshot' as const, category: 'technical' as const, status: 'approved' as const, riskLevel: 'high' as const, fileSize: 2000, uploadedBy: 'user2' }
      ];
      vi.mocked(dataService.getData).mockReturnValue({ evidenceItems: mockEvidence });

      const stats = await evidenceService.getEvidenceStatistics();
      expect(stats.totalItems).toBe(2);
      expect(stats.byType.document).toBe(1);
    });
  });

  describe('Error handling', () => {
    it('should handle errors gracefully', async () => {
      vi.mocked(dataService.getData).mockImplementation(() => {
        throw new Error('Database error');
      });

      const items = await evidenceService.getEvidenceItems();
      expect(items).toEqual([]);
    });
  });
});
