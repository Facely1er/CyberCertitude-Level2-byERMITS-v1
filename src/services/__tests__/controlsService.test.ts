import { describe, it, expect, beforeEach, vi } from 'vitest';
import { controlsService } from '../controlsService';
import { dataService } from '../dataService';

vi.mock('../dataService', () => ({
  dataService: {
    getData: vi.fn()
  }
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
    vi.mocked(dataService.getData).mockReturnValue({ controls: [] });
  });

  describe('Control retrieval', () => {
    it('should get all controls', () => {
      const mockControls = [
        { id: 'AC.1.001', name: 'Control 1' },
        { id: 'AC.1.002', name: 'Control 2' }
      ];
      vi.mocked(dataService.getData).mockReturnValue({ controls: mockControls });

      const controls = controlsService.getAllControls();
      expect(controls).toEqual(mockControls);
    });

    it('should get control by ID', () => {
      const mockControls = [{ id: 'AC.1.001', name: 'Control 1' }];
      vi.mocked(dataService.getData).mockReturnValue({ controls: mockControls });

      const control = controlsService.getControlById('AC.1.001');
      expect(control).toBeDefined();
      expect(control?.name).toBe('Control 1');
    });

    it('should return null for non-existent control', () => {
      vi.mocked(dataService.getData).mockReturnValue({ controls: [] });
      const control = controlsService.getControlById('non-existent');
      expect(control).toBeNull();
    });
  });

  describe('Control filtering', () => {
    it('should filter controls by status', () => {
      const mockControls = [
        { id: 'AC.1.001', status: 'implemented' },
        { id: 'AC.1.002', status: 'in-progress' }
      ];
      vi.mocked(dataService.getData).mockReturnValue({ controls: mockControls });

      const filtered = controlsService.getControlsByFilter({ status: 'implemented' });
      expect(filtered.length).toBe(1);
      expect(filtered[0].status).toBe('implemented');
    });

    it('should filter controls by function', () => {
      const mockControls = [
        { id: 'AC.1.001', nistFunction: 'AC' },
        { id: 'AT.2.001', nistFunction: 'AT' }
      ];
      vi.mocked(dataService.getData).mockReturnValue({ controls: mockControls });

      const filtered = controlsService.getControlsByFilter({ function: 'AC' });
      expect(filtered.length).toBe(1);
      expect(filtered[0].nistFunction).toBe('AC');
    });
  });

  describe('Control statistics', () => {
    it('should calculate control statistics', () => {
      const mockControls = [
        { id: 'AC.1.001', status: 'implemented', framework: 'CMMC' },
        { id: 'AC.1.002', status: 'in-progress', framework: 'CMMC' }
      ];
      vi.mocked(dataService.getData).mockReturnValue({ controls: mockControls });

      const stats = controlsService.getControlStatistics();
      expect(stats.totalControls).toBe(2);
    });
  });

  describe('Error handling', () => {
    it('should handle errors gracefully', () => {
      vi.mocked(dataService.getData).mockImplementation(() => {
        throw new Error('Database error');
      });

      const controls = controlsService.getAllControls();
      expect(controls).toEqual([]);
    });
  });
});
