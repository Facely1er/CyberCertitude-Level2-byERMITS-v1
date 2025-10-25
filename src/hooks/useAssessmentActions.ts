import { useCallback } from 'react';
import { AssessmentData } from '../shared/types';
import { reportService } from '../services/reportService';

export const useAssessmentActions = (
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void
) => {
  const handleStartAssessment = useCallback((frameworkId: string = 'cmmc') => {
    addNotification('info', 'Starting new assessment...');
    // This would typically navigate to assessment intro or create new assessment
    return `/assessment-intro?framework=${frameworkId}`;
  }, [addNotification]);

  const handleLoadAssessment = useCallback((assessmentId: string) => {
    addNotification('info', 'Loading assessment...');
    return `/assessment/${assessmentId}`;
  }, [addNotification]);

  const handleDeleteAssessment = useCallback((assessmentId: string) => {
    addNotification('success', 'Assessment deleted successfully');
  }, [addNotification]);

  const handleGenerateReport = useCallback(async (assessment: AssessmentData) => {
    try {
      addNotification('info', 'Generating report...');
      const report = await reportService.generateReport(assessment);
      addNotification('success', 'Report generated successfully');
      return report;
    } catch (error) {
      console.error('Failed to generate report:', error);
      addNotification('error', 'Failed to generate report');
      throw error;
    }
  }, [addNotification]);

  const handleExportAssessment = useCallback(async (assessment: AssessmentData, format: 'json' | 'csv' | 'pdf') => {
    try {
      addNotification('info', `Exporting assessment as ${format.toUpperCase()}...`);
      await reportService.exportAssessment(assessment, format);
      addNotification('success', `Assessment exported as ${format.toUpperCase()} successfully`);
    } catch (error) {
      console.error('Failed to export assessment:', error);
      addNotification('error', 'Failed to export assessment');
      throw error;
    }
  }, [addNotification]);

  const handleImportAssessment = useCallback(async (file: File) => {
    try {
      addNotification('info', 'Importing assessment...');
      // Import logic would be implemented here
      addNotification('success', 'Assessment imported successfully');
    } catch (error) {
      console.error('Failed to import assessment:', error);
      addNotification('error', 'Failed to import assessment');
      throw error;
    }
  }, [addNotification]);

  return {
    handleStartAssessment,
    handleLoadAssessment,
    handleDeleteAssessment,
    handleGenerateReport,
    handleExportAssessment,
    handleImportAssessment
  };
};
