import { describe, it, expect, beforeEach, vi } from 'vitest';
import { reportService } from '../reportService';
import { errorMonitoring } from '../../lib/errorMonitoring';

vi.mock('../../lib/errorMonitoring', () => ({
  errorMonitoring: {
    captureException: vi.fn()
  }
}));

vi.mock('@/utils/logger', () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn()
  }
}));

describe('ReportService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window methods
    global.window = {
      ...global.window,
      showSaveFilePicker: undefined,
      print: vi.fn()
    } as any;
    // Mock URL.createObjectURL for jsdom
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();
    if (window.URL) {
      window.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
      window.URL.revokeObjectURL = vi.fn();
    }
  });

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = reportService;
      const instance2 = reportService;
      expect(instance1).toBe(instance2);
    });
  });

  describe('Report export', () => {
    it('should export report to JSON', async () => {
      const mockAssessment = {
        id: 'test-1',
        frameworkId: 'cmmc',
        frameworkName: 'CMMC 2.0',
        responses: { 'AC.1.001': 3 },
        createdAt: new Date(),
        lastModified: new Date()
      };

      const mockFramework = {
        id: 'cmmc',
        name: 'CMMC 2.0',
        version: '2.0',
        sections: []
      };

      const options = {
        format: 'json' as const
      };

      await expect(
        reportService.exportReport(mockAssessment as any, mockFramework as any, options)
      ).resolves.not.toThrow();
    });

    it('should export report to CSV', async () => {
      const mockAssessment = {
        id: 'test-1',
        frameworkId: 'cmmc',
        responses: { 'AC.1.001': 3 },
        createdAt: new Date(),
        lastModified: new Date()
      };

      const mockFramework = {
        id: 'cmmc',
        name: 'CMMC 2.0',
        sections: []
      };

      const options = {
        format: 'csv' as const
      };

      await expect(
        reportService.exportReport(mockAssessment as any, mockFramework as any, options)
      ).resolves.not.toThrow();
    });

    it('should export report to PDF', async () => {
      const mockAssessment = {
        id: 'test-1',
        frameworkId: 'cmmc',
        responses: {},
        createdAt: new Date(),
        lastModified: new Date()
      };

      const mockFramework = {
        id: 'cmmc',
        name: 'CMMC 2.0',
        sections: []
      };

      const options = {
        format: 'pdf' as const
      };

      // Mock print method
      global.window.print = vi.fn();

      await expect(
        reportService.exportReport(mockAssessment as any, mockFramework as any, options)
      ).resolves.not.toThrow();
    });

    it('should handle unsupported format', async () => {
      const mockAssessment = {
        id: 'test-1',
        frameworkId: 'cmmc',
        responses: {},
        createdAt: new Date(),
        lastModified: new Date()
      };

      const mockFramework = {
        id: 'cmmc',
        name: 'CMMC 2.0',
        sections: []
      };

      const options = {
        format: 'unsupported' as any
      };

      await expect(
        reportService.exportReport(mockAssessment as any, mockFramework as any, options)
      ).rejects.toThrow('Unsupported format');
    });

    it('should handle export errors', async () => {
      const mockAssessment = {
        id: 'test-1',
        frameworkId: 'cmmc',
        responses: {},
        createdAt: new Date(),
        lastModified: new Date()
      };

      const mockFramework = {
        id: 'cmmc',
        name: 'CMMC 2.0',
        sections: []
      };

      const options = {
        format: 'json' as const
      };

      // Force an error
      const originalError = console.error;
      console.error = vi.fn();

      try {
        await reportService.exportReport(mockAssessment as any, mockFramework as any, options);
      } catch (error) {
        expect(errorMonitoring.captureException).toHaveBeenCalled();
      }

      console.error = originalError;
    });

    it('should include branding in PDF export', async () => {
      const mockAssessment = {
        id: 'test-1',
        frameworkId: 'cmmc',
        organizationInfo: { name: 'Test Org' },
        responses: {},
        createdAt: new Date(),
        lastModified: new Date()
      };

      const mockFramework = {
        id: 'cmmc',
        name: 'CMMC 2.0',
        sections: []
      };

      const options = {
        format: 'pdf' as const,
        branding: {
          organizationName: 'Custom Org',
          logo: '/logo.png'
        }
      };

      global.window.print = vi.fn();

      await expect(
        reportService.exportReport(mockAssessment as any, mockFramework as any, options)
      ).resolves.not.toThrow();
    });
  });
});
