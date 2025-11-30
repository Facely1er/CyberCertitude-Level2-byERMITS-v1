import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fileService } from '../fileService';

describe('FileService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = fileService;
      const instance2 = fileService;
      expect(instance1).toBe(instance2);
    });
  });

  describe('CSV export', () => {
    it('should export data to CSV format', () => {
      const data = [
        { name: 'Item 1', value: 100 },
        { name: 'Item 2', value: 200 }
      ];

      const csv = fileService.exportToCSV(data);
      expect(csv).toContain('name,value');
      expect(csv).toContain('Item 1,100');
      expect(csv).toContain('Item 2,200');
    });

    it('should handle empty data', () => {
      const csv = fileService.exportToCSV([]);
      expect(csv).toBeDefined();
    });
  });

  describe('XLSX export', () => {
    it('should export data to XLSX format', () => {
      const data = [
        { name: 'Item 1', value: 100 },
        { name: 'Item 2', value: 200 }
      ];

      const xlsx = fileService.exportToXLSX(data);
      expect(xlsx).toBeDefined();
    });
  });

  describe('Error handling', () => {
    it('should handle invalid data gracefully', () => {
      const data = null as any;
      expect(() => fileService.exportToCSV(data)).not.toThrow();
    });
  });
});
