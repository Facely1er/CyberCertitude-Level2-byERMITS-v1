import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAssessments } from '../useAssessments';

// Mock dependencies
vi.mock('../../services/dataService', () => ({
  dataService: {
    getAssessments: vi.fn(() => []),
    saveAssessment: vi.fn(),
    deleteAssessment: vi.fn(),
    saveAssessments: vi.fn()
  }
}));

vi.mock('../../lib/auditLog', () => ({
  auditLogger: {
    logAssessmentAction: vi.fn().mockResolvedValue(undefined),
    logUserAction: vi.fn().mockResolvedValue(undefined)
  }
}));

vi.mock('@/utils/logger', () => ({
  logger: {
    error: vi.fn()
  }
}));

describe('useAssessments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with empty assessments', async () => {
    const { result } = renderHook(() => useAssessments());
    
    await waitFor(() => {
      expect(result.current.assessments).toEqual([]);
    });
  });

  it('should load assessments on mount', async () => {
    const mockAssessments = [
      { id: '1', frameworkId: 'cmmc', responses: {} },
      { id: '2', frameworkId: 'nist', responses: {} }
    ];

    const { dataService } = await import('../../services/dataService');
    vi.mocked(dataService.getAssessments).mockReturnValue(mockAssessments as any);

    const { result } = renderHook(() => useAssessments());
    
    await waitFor(() => {
      expect(result.current.assessments.length).toBeGreaterThan(0);
    });
  });

  it('should save assessment', async () => {
    const { result } = renderHook(() => useAssessments());
    
    const assessment = {
      id: 'new-assessment',
      frameworkId: 'cmmc',
      frameworkName: 'CMMC 2.0',
      responses: { 'AC.1.001': 3 },
      createdAt: new Date(),
      lastModified: new Date(),
      isComplete: false,
      version: '1.0.0'
    };

    await act(async () => {
      await result.current.saveAssessment(assessment as any);
    });

    expect(result.current.assessments.length).toBeGreaterThan(0);
  });

  it('should update existing assessment', async () => {
    const existingAssessment = {
      id: 'existing',
      frameworkId: 'cmmc',
      responses: { 'AC.1.001': 2 },
      createdAt: new Date(),
      lastModified: new Date(),
      isComplete: false,
      version: '1.0.0'
    };

    const { dataService } = await import('../../services/dataService');
    vi.mocked(dataService.getAssessments).mockReturnValue([existingAssessment as any]);

    const { result } = renderHook(() => useAssessments());
    
    await waitFor(() => {
      expect(result.current.assessments.length).toBe(1);
    });

    const updated = {
      ...existingAssessment,
      responses: { 'AC.1.001': 4 }
    };

    await act(async () => {
      await result.current.saveAssessment(updated as any);
    });

    expect(result.current.assessments[0].responses['AC.1.001']).toBe(4);
  });

  it('should remove assessment', async () => {
    const mockAssessments = [
      { id: '1', frameworkId: 'cmmc', responses: {} },
      { id: '2', frameworkId: 'nist', responses: {} }
    ];

    const { dataService } = await import('../../services/dataService');
    vi.mocked(dataService.getAssessments).mockReturnValue(mockAssessments as any);

    const { result } = renderHook(() => useAssessments());
    
    await waitFor(() => {
      expect(result.current.assessments.length).toBe(2);
    });

    await act(async () => {
      await result.current.removeAssessment('1');
    });

    expect(result.current.assessments.length).toBe(1);
    expect(result.current.assessments[0].id).toBe('2');
  });

  it('should reset assessments', async () => {
    const mockAssessments = [
      { id: '1', frameworkId: 'cmmc', responses: {} },
      { id: '2', frameworkId: 'nist', responses: {} }
    ];

    const { dataService } = await import('../../services/dataService');
    vi.mocked(dataService.getAssessments).mockReturnValue(mockAssessments as any);

    const { result } = renderHook(() => useAssessments());
    
    await waitFor(() => {
      expect(result.current.assessments.length).toBe(2);
    });

    await act(async () => {
      await result.current.resetAssessments();
    });

    expect(result.current.assessments).toEqual([]);
  });

  it('should handle loading state', async () => {
    const { dataService } = await import('../../services/dataService');
    vi.mocked(dataService.getAssessments).mockImplementation(() => {
      return new Promise(resolve => setTimeout(() => resolve([]), 100));
    });

    const { result } = renderHook(() => useAssessments());
    
    // Loading should be false after mount
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should handle errors gracefully', async () => {
    const { dataService } = await import('../../services/dataService');
    vi.mocked(dataService.getAssessments).mockImplementation(() => {
      throw new Error('Load failed');
    });

    const { result } = renderHook(() => useAssessments());
    
    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });
  });

  it('should handle save errors', async () => {
    const { dataService } = await import('../../services/dataService');
    vi.mocked(dataService.saveAssessment).mockImplementation(() => {
      throw new Error('Save failed');
    });

    const { result } = renderHook(() => useAssessments());
    
    const assessment = {
      id: 'test',
      frameworkId: 'cmmc',
      responses: {},
      createdAt: new Date(),
      lastModified: new Date(),
      isComplete: false,
      version: '1.0.0'
    };

    await expect(
      act(async () => {
        await result.current.saveAssessment(assessment as any);
      })
    ).rejects.toThrow();
  });
});
