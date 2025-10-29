import { describe, it, expect, beforeEach, vi } from 'vitest';
import { controlsService } from '../controlsService';
import { dataService } from '../dataService';

// Extend the mock to include methods used by controlsService
const mockDataService = {
  getData: vi.fn(() => ({ controls: [] })),
  saveData: vi.fn().mockResolvedValue(undefined)
};

vi.mock('../dataService', () => ({
  dataService: mockDataService
}));

vi.mock('../../utils/logger', () => ({
  logger: {
    error: vi.fn(),
    debug: vi.fn()
  }
}));

describe('ControlsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (dataService as any).getData = vi.fn(() => ({ controls: [] }));
  });

  describe('Control retrieval', () => {
    it('should get all controls', async () => {
      const mockControls = [
        { id: 'AC.1.001', name: 'Control 1' },
        { id: 'AC.1.002', name: 'Control 2' }
      ];
      (dataService as any).getData = vi.fn(() => ({ controls: mockControls }));

      const controls = await controlsService.getControls();
      expect(controls).toEqual(mockControls);
    });

    it('should get control by ID', async () => {
      const mockControls = [{ id: 'AC.1.001', name: 'Control 1' }];
      (dataService as any).getData = vi.fn(() => ({ controls: mockControls }));

      const control = await controlsService.getControl('AC.1.001');
      expect(control).toBeDefined();
      expect(control?.name).toBe('Control 1');
    });

    it('should return null for non-existent control', async () => {
      (dataService as any).getData = vi.fn(() => ({ controls: [] }));
      const control = await controlsService.getControl('non-existent');
      expect(control).toBeNull();
    });
  });

  describe('Control filtering', () => {
    it('should filter controls by status', async () => {
      const mockControls = [
        { id: 'AC.1.001', status: 'implemented', name: 'Control 1' as any, nistFunction: 'AC' as any },
        { id: 'AC.1.002', status: 'in-progress', name: 'Control 2' as any, nistFunction: 'AC' as any }
      ];
      (dataService as any).getData = vi.fn(() => ({ controls: mockControls }));

      const filtered = await controlsService.searchControls({ status: 'implemented' });
      expect(filtered.length).toBe(1);
      expect(filtered[0].status).toBe('implemented');
    });

    it('should filter controls by function', async () => {
      const mockControls = [
        { id: 'AC.1.001', nistFunction: 'AC', name: 'Control 1' as any, status: 'implemented' as any },
        { id: 'AT.2.001', nistFunction: 'AT', name: 'Control 2' as any, status: 'implemented' as any }
      ];
      (dataService as any).getData = vi.fn(() => ({ controls: mockControls }));

      const filtered = await controlsService.searchControls({ function: 'AC' });
      expect(filtered.length).toBe(1);
      expect(filtered[0].nistFunction).toBe('AC');
    });
  });

  describe('Control statistics', () => {
    it('should calculate control statistics', async () => {
      const mockControls = [
        { id: 'AC.1.001', status: 'implemented' as any, priority: 'high' as any, owner: 'owner1', nistFunction: 'AC', effectiveness: 'fully-effective' as any, complianceStatus: 'compliant' as any },
        { id: 'AC.1.002', status: 'in-progress' as any, priority: 'medium' as any, owner: 'owner2', nistFunction: 'AT', effectiveness: 'partially-effective' as any, complianceStatus: 'partially-compliant' as any }
      ];
      (dataService as any).getData = vi.fn(() => ({ controls: mockControls }));

      const stats = await controlsService.getControlStatistics();
      expect(stats.total).toBe(2);
    });
  });

  describe('Error handling', () => {
    it('should handle errors gracefully', async () => {
      (dataService as any).getData = vi.fn(() => {
        throw new Error('Database error');
      });

      const controls = await controlsService.getControls();
      expect(controls).toEqual([]);
    });
  });
});
