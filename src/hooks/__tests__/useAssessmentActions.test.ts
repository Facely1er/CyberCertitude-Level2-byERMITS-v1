import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAssessmentActions } from '../useAssessmentActions';
import { reportService } from '../../services/reportService';

vi.mock('../../services/reportService', () => ({
  reportService: {
    exportReport: vi.fn().mockResolvedValue(undefined)
  }
}));

vi.mock('../../utils/logger', () => ({
  logger: {
    error: vi.fn()
  }
}));

describe('useAssessmentActions', () => {
  const mockAddNotification = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize hook', () => {
    const { result } = renderHook(() => useAssessmentActions(mockAddNotification));
    
    expect(result.current).toBeDefined();
    expect(result.current.handleStartAssessment).toBeDefined();
    expect(result.current.handleLoadAssessment).toBeDefined();
    expect(result.current.handleDeleteAssessment).toBeDefined();
    expect(result.current.handleGenerateReport).toBeDefined();
  });

  it('should handle start assessment', () => {
    const { result } = renderHook(() => useAssessmentActions(mockAddNotification));
    
    const url = result.current.handleStartAssessment('cmmc');
    expect(url).toBeDefined();
    expect(mockAddNotification).toHaveBeenCalledWith('info', 'Starting new assessment...');
  });

  it('should handle load assessment', () => {
    const { result } = renderHook(() => useAssessmentActions(mockAddNotification));
    
    const url = result.current.handleLoadAssessment('assessment-1');
    expect(url).toContain('assessment-1');
    expect(mockAddNotification).toHaveBeenCalledWith('info', 'Loading assessment...');
  });

  it('should handle delete assessment', () => {
    const { result } = renderHook(() => useAssessmentActions(mockAddNotification));
    
    result.current.handleDeleteAssessment('assessment-1');
    expect(mockAddNotification).toHaveBeenCalledWith('success', 'Assessment deleted successfully');
  });

  it('should generate report', async () => {
    const { result } = renderHook(() => useAssessmentActions(mockAddNotification));
    
    const mockAssessment = {
      id: 'test-1',
      frameworkId: 'cmmc',
      responses: {},
      createdAt: new Date(),
      lastModified: new Date()
    };
    
    await expect(result.current.handleGenerateReport(mockAssessment as any)).resolves.toBeDefined();
    expect(reportService.exportReport).toHaveBeenCalled();
  });

  it('should handle report generation errors', async () => {
    vi.mocked(reportService.exportReport).mockRejectedValueOnce(new Error('Report failed'));
    
    const { result } = renderHook(() => useAssessmentActions(mockAddNotification));
    
    const mockAssessment = { id: 'test-1', frameworkId: 'cmmc', responses: {} };
    
    await expect(
      result.current.handleGenerateReport(mockAssessment as any)
    ).rejects.toThrow();
  });

  it('should export assessment', async () => {
    const { result } = renderHook(() => useAssessmentActions(mockAddNotification));
    
    const mockAssessment = {
      id: 'test-1',
      frameworkId: 'cmmc',
      responses: {},
      createdAt: new Date(),
      lastModified: new Date()
    };
    
    await expect(
      result.current.handleExportAssessment(mockAssessment as any, 'csv')
    ).resolves.not.toThrow();
  });

  it('should import assessment', async () => {
    const { result } = renderHook(() => useAssessmentActions(mockAddNotification));
    
    const file = new File(['test'], 'test.json', { type: 'application/json' });
    
    await expect(result.current.handleImportAssessment(file)).resolves.not.toThrow();
    expect(mockAddNotification).toHaveBeenCalledWith('info', 'Importing assessment...');
  });
});
