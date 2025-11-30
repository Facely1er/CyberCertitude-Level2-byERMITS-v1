import { useState, useEffect, useCallback } from 'react';
import { AssessmentData } from '../types';
import { dataService } from '../../services/dataService';
import { auditLogger } from '../../lib/auditLog';
import { logger } from '@/utils/logger';


export const useAssessments = () => {
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load assessments from dataService
  const loadAssessments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const loadedAssessments = dataService.getAssessments();
      setAssessments(loadedAssessments);
    } catch (err) {
      logger.error('Failed to load assessments:', err);
      setError('Failed to load assessments');
      setAssessments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save assessment
  const saveAssessment = useCallback(async (assessment: AssessmentData): Promise<AssessmentData> => {
    try {
      // Update with current timestamp
      const updatedAssessment = {
        ...assessment,
        lastModified: new Date()
      };
      
      // Save using dataService
      dataService.saveAssessment(updatedAssessment);
      
      // Update local state
      setAssessments(prev => {
        const index = prev.findIndex(a => a.id === assessment.id);
        if (index >= 0) {
          const newAssessments = [...prev];
          newAssessments[index] = updatedAssessment;
          return newAssessments;
        } else {
          return [...prev, updatedAssessment];
        }
      });

      // Log the action
      await auditLogger.logAssessmentAction('update', assessment.id, 'current-user');
      
      return updatedAssessment;
    } catch (err) {
      logger.error('Failed to save assessment:', err);
      setError('Failed to save assessment');
      throw err;
    }
  }, []);

  // Remove/Delete assessment
  const removeAssessment = useCallback(async (assessmentId: string): Promise<void> => {
    try {
      // Delete using dataService
      dataService.deleteAssessment(assessmentId);
      
      // Update local state
      setAssessments(prev => prev.filter(a => a.id !== assessmentId));
      
      // Log the action
      await auditLogger.logAssessmentAction('delete', assessmentId, 'current-user');
      
    } catch (err) {
      logger.error('Failed to delete assessment:', err);
      setError('Failed to delete assessment');
      throw err;
    }
  }, []);

  // Reset all assessments
  const resetAssessments = useCallback(async (): Promise<void> => {
    try {
      // Clear all assessments using dataService
      dataService.saveAssessments([]);
      
      // Update local state
      setAssessments([]);
      
      // Log the action
      await auditLogger.logUserAction('reset_assessments', 'current-user');
      
    } catch (err) {
      logger.error('Failed to reset assessments:', err);
      setError('Failed to reset assessments');
      throw err;
    }
  }, []);

  // Load assessments on mount
  useEffect(() => {
    loadAssessments();
  }, [loadAssessments]);

  return {
    assessments,
    isLoading,
    error,
    saveAssessment,
    removeAssessment,
    loadAssessments,
    resetAssessments
  };
};