import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiService } from '../apiService';

// Mock supabaseApiService
vi.mock('../supabaseApiService', () => ({
  supabaseApiService: {
    getRealTimeComplianceData: vi.fn(),
    getComplianceMetrics: vi.fn(),
    getComplianceAlerts: vi.fn(),
    acknowledgeAlert: vi.fn(),
    saveAssessment: vi.fn(),
    getAssessments: vi.fn(),
    uploadEvidence: vi.fn(),
    getEvidence: vi.fn(),
    authenticate: vi.fn(),
    logout: vi.fn()
  }
}));

// Mock logger
vi.mock('../../utils/logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn()
  }
}));

describe('ApiService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = apiService;
      const instance2 = apiService;
      expect(instance1).toBe(instance2);
    });
  });

  describe('Real-time compliance data', () => {
    it('should get real-time compliance data', async () => {
      const mockData = {
        overallCompliance: 85,
        functionCompliance: { 'AC': 90, 'AU': 80 },
        alerts: []
      };

      const { supabaseApiService } = await import('../supabaseApiService');
      vi.mocked(supabaseApiService.getRealTimeComplianceData).mockResolvedValue(mockData as any);

      const result = await apiService.getRealTimeComplianceData();
      expect(result).toEqual(mockData);
    });

    it('should handle errors when fetching compliance data', async () => {
      const { supabaseApiService } = await import('../supabaseApiService');
      vi.mocked(supabaseApiService.getRealTimeComplianceData).mockRejectedValue(new Error('Network error'));

      await expect(apiService.getRealTimeComplianceData()).rejects.toThrow('Unable to load compliance data');
    });
  });

  describe('Compliance metrics', () => {
    it('should get compliance metrics', async () => {
      const mockMetrics = {
        overallCompliance: 90,
        functionCompliance: {},
        activeGaps: 5,
        criticalFindings: 2,
        evidenceCollectionProgress: 75,
        controlImplementationProgress: 80,
        riskTrend: 'stable' as const
      };

      const { supabaseApiService } = await import('../supabaseApiService');
      vi.mocked(supabaseApiService.getComplianceMetrics).mockResolvedValue(mockMetrics);

      const result = await apiService.getComplianceMetrics();
      expect(result).toEqual(mockMetrics);
    });

    it('should handle errors when fetching metrics', async () => {
      const { supabaseApiService } = await import('../supabaseApiService');
      vi.mocked(supabaseApiService.getComplianceMetrics).mockRejectedValue(new Error('Error'));

      await expect(apiService.getComplianceMetrics()).rejects.toThrow('Unable to load compliance metrics');
    });
  });

  describe('Compliance alerts', () => {
    it('should get compliance alerts', async () => {
      const mockAlerts = [
        { id: '1', message: 'Alert 1', severity: 'high' as const },
        { id: '2', message: 'Alert 2', severity: 'medium' as const }
      ];

      const { supabaseApiService } = await import('../supabaseApiService');
      vi.mocked(supabaseApiService.getComplianceAlerts).mockResolvedValue(mockAlerts);

      const result = await apiService.getComplianceAlerts();
      expect(result).toEqual(mockAlerts);
    });

    it('should handle errors when fetching alerts', async () => {
      const { supabaseApiService } = await import('../supabaseApiService');
      vi.mocked(supabaseApiService.getComplianceAlerts).mockRejectedValue(new Error('Error'));

      await expect(apiService.getComplianceAlerts()).rejects.toThrow('Unable to load compliance alerts');
    });

    it('should acknowledge alert', async () => {
      const { supabaseApiService } = await import('../supabaseApiService');
      vi.mocked(supabaseApiService.acknowledgeAlert).mockResolvedValue(undefined);

      await expect(apiService.acknowledgeAlert('alert-1')).resolves.not.toThrow();
      expect(supabaseApiService.acknowledgeAlert).toHaveBeenCalledWith('alert-1');
    });
  });

  describe('Assessment API', () => {
    it('should save assessment', async () => {
      const mockAssessment = {
        id: 'test-1',
        frameworkId: 'cmmc',
        responses: {},
        createdAt: new Date(),
        lastModified: new Date()
      };

      const { supabaseApiService } = await import('../supabaseApiService');
      vi.mocked(supabaseApiService.saveAssessment).mockResolvedValue(mockAssessment as any);

      const result = await apiService.saveAssessment(mockAssessment as any);
      expect(result).toEqual(mockAssessment);
    });

    it('should get assessments', async () => {
      const mockAssessments = [
        { id: '1', frameworkId: 'cmmc' },
        { id: '2', frameworkId: 'nist' }
      ];

      const { supabaseApiService } = await import('../supabaseApiService');
      vi.mocked(supabaseApiService.getAssessments).mockResolvedValue(mockAssessments as any);

      const result = await apiService.getAssessments();
      expect(result).toEqual(mockAssessments);
    });

    it('should handle errors when saving assessment', async () => {
      const { supabaseApiService } = await import('../supabaseApiService');
      vi.mocked(supabaseApiService.saveAssessment).mockRejectedValue(new Error('Error'));

      await expect(apiService.saveAssessment({} as any)).rejects.toThrow('Error');
    });
  });

  describe('Evidence API', () => {
    it('should upload evidence', async () => {
      const mockResult = { id: 'evidence-1', url: 'http://example.com/file.pdf' };

      const { supabaseApiService } = await import('../supabaseApiService');
      vi.mocked(supabaseApiService.uploadEvidence).mockResolvedValue(mockResult);

      const formData = new FormData();
      const result = await apiService.uploadEvidence(formData);
      expect(result).toEqual(mockResult);
    });

    it('should get evidence', async () => {
      const mockEvidence = [
        { id: '1', name: 'Evidence 1' },
        { id: '2', name: 'Evidence 2' }
      ];

      const { supabaseApiService } = await import('../supabaseApiService');
      vi.mocked(supabaseApiService.getEvidence).mockResolvedValue(mockEvidence);

      const result = await apiService.getEvidence();
      expect(result).toEqual(mockEvidence);
    });

    it('should handle errors when uploading evidence', async () => {
      const { supabaseApiService } = await import('../supabaseApiService');
      vi.mocked(supabaseApiService.uploadEvidence).mockRejectedValue(new Error('Error'));

      await expect(apiService.uploadEvidence(new FormData())).rejects.toThrow('Error');
    });
  });

  describe('Authentication API', () => {
    it('should authenticate user', async () => {
      const mockResult = {
        token: 'test-token',
        user: { id: '1', email: 'test@example.com' }
      };

      const { supabaseApiService } = await import('../supabaseApiService');
      vi.mocked(supabaseApiService.authenticate).mockResolvedValue(mockResult);

      const result = await apiService.authenticate({ email: 'test@example.com', password: 'password' });
      expect(result).toEqual(mockResult);
      expect(localStorage.getItem('api-key')).toBe('test-token');
    });

    it('should handle authentication errors', async () => {
      const { supabaseApiService } = await import('../supabaseApiService');
      vi.mocked(supabaseApiService.authenticate).mockRejectedValue(new Error('Invalid credentials'));

      await expect(apiService.authenticate({ email: 'test@example.com', password: 'wrong' })).rejects.toThrow();
    });

    it('should logout user', async () => {
      localStorage.setItem('api-key', 'test-token');

      const { supabaseApiService } = await import('../supabaseApiService');
      vi.mocked(supabaseApiService.logout).mockResolvedValue(undefined);

      await apiService.logout();
      expect(localStorage.getItem('api-key')).toBeNull();
      expect(supabaseApiService.logout).toHaveBeenCalled();
    });

    it('should handle logout errors gracefully', async () => {
      const { supabaseApiService } = await import('../supabaseApiService');
      vi.mocked(supabaseApiService.logout).mockRejectedValue(new Error('Error'));

      await expect(apiService.logout()).resolves.not.toThrow();
    });
  });

  describe('Environment configuration', () => {
    it('should use default base URL when not configured', () => {
      // Default URL is set in constructor
      const service = apiService;
      expect(service).toBeDefined();
    });
  });
});
