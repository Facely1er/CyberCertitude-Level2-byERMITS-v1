import { describe, it, expect, beforeEach, vi } from 'vitest';
import { supabaseApiService } from '../supabaseApiService';

// Mock supabase
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => ({
              then: vi.fn()
            }))
          }))
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn()
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn()
      })),
      delete: vi.fn(() => ({
        eq: vi.fn()
      }))
    }))
  },
  isSupabaseReady: false
}));

vi.mock('../utils/logger', () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn()
  }
}));

describe('SupabaseApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = supabaseApiService;
      const instance2 = supabaseApiService;
      expect(instance1).toBe(instance2);
    });
  });

  describe('Compliance data', () => {
    it('should get real-time compliance data with fallback', async () => {
      const data = await supabaseApiService.getRealTimeComplianceData();
      
      expect(data).toBeDefined();
      expect(data).toHaveProperty('overallCompliance');
    });

    it('should use fallback when Supabase not ready', async () => {
      const data = await supabaseApiService.getRealTimeComplianceData();
      
      // Should return fallback data
      expect(data).toBeDefined();
    });

    it('should get compliance metrics', async () => {
      const metrics = await supabaseApiService.getComplianceMetrics();
      
      expect(metrics).toBeDefined();
      expect(metrics).toHaveProperty('overallCompliance');
    });

    it('should get compliance alerts', async () => {
      const alerts = await supabaseApiService.getComplianceAlerts();
      
      expect(alerts).toBeInstanceOf(Array);
    });
  });

  describe('Assessment operations', () => {
    it('should save assessment', async () => {
      const mockAssessment = {
        id: 'test-1',
        frameworkId: 'cmmc',
        responses: {},
        createdAt: new Date(),
        lastModified: new Date()
      };

      const result = await supabaseApiService.saveAssessment(mockAssessment as any);
      
      expect(result).toBeDefined();
    });

    it('should get assessments', async () => {
      const assessments = await supabaseApiService.getAssessments();
      
      expect(assessments).toBeInstanceOf(Array);
    });
  });

  describe('Evidence operations', () => {
    it('should upload evidence', async () => {
      const formData = new FormData();
      formData.append('file', new Blob(['test']), 'test.pdf');

      const result = await supabaseApiService.uploadEvidence(formData);
      
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
    });

    it('should get evidence', async () => {
      const evidence = await supabaseApiService.getEvidence();
      
      expect(evidence).toBeInstanceOf(Array);
    });
  });

  describe('Authentication', () => {
    it('should authenticate user', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      const result = await supabaseApiService.authenticate(credentials);
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('token');
    });

    it('should logout user', async () => {
      await expect(supabaseApiService.logout()).resolves.not.toThrow();
    });
  });

  describe('Error handling', () => {
    it('should handle Supabase errors gracefully', async () => {
      const data = await supabaseApiService.getRealTimeComplianceData();
      
      // Should return fallback even on error
      expect(data).toBeDefined();
    });
  });
});
