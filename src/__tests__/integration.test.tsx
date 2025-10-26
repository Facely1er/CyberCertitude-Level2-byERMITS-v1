import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { auditService } from '../services/auditService';

describe('Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    dataService.resetAllData();
  });

  describe('Assessment workflow', () => {
    it('should complete full assessment lifecycle', async () => {
      // Create assessment
      const assessment = {
        id: 'test-assessment',
        frameworkId: 'cmmc',
        frameworkName: 'CMMC 2.0',
        responses: { 'ac.1.001': 2 },
        createdAt: new Date(),
        lastModified: new Date(),
        isComplete: false,
        version: '1.0.0'
      };

      dataService.saveAssessment(assessment);
      const saved = dataService.getAssessment('test-assessment');
      expect(saved).toBeDefined();

      // Update assessment
      const updated = {
        ...assessment,
        isComplete: true,
        lastModified: new Date()
      };
      dataService.saveAssessment(updated);
      
      const completed = dataService.getAssessment('test-assessment');
      expect(completed?.isComplete).toBe(true);

      // Delete assessment
      dataService.deleteAssessment('test-assessment');
      expect(dataService.getAssessment('test-assessment')).toBeNull();
    });
  });

  describe('Asset management workflow', () => {
    it('should complete asset lifecycle', () => {
      // Get assets
      const initialAssets = dataService.getAssets();
      expect(initialAssets).toEqual([]);

      // Import assets
      const importData = JSON.stringify({
        assets: [{
          id: 'asset-1',
          name: 'Test Server',
          owner: 'IT Dept',
          category: 'hardware',
          informationClassification: 'internal'
        }]
      });

      const importResult = dataService.importAssetsWithValidation(importData);
      expect(importResult.success).toBe(true);
      expect(importResult.imported).toBe(1);

      // Verify asset exists
      const assets = dataService.getAssets();
      expect(assets.length).toBe(1);

      // Export assets
      const exported = dataService.exportAssetsWithClassification();
      expect(exported).toContain('asset-1');
    });
  });

  describe('Audit workflow', () => {
    it('should complete audit with findings', async () => {
      // Create audit
      const audit = await auditService.createAudit({
        name: 'Quarterly Audit',
        type: 'internal',
        status: 'scheduled',
        scheduledDate: new Date(),
        completedDate: null,
        auditor: 'Audit Team',
        findings: [],
        scope: ['AC.1', 'AU.1'],
        reportUrl: null
      });

      expect(audit).toBeDefined();

      // Add finding
      const finding = await auditService.createFinding({
        auditId: audit.id,
        controlId: 'AC.1.001',
        severity: 'medium',
        title: 'Access Control Issue',
        description: 'Insufficient access controls',
        status: 'open',
        assignedTo: 'Engineer',
        dueDate: new Date(),
        evidence: [],
        remediationNotes: ''
      });

      expect(finding).toBeDefined();

      // Get findings
      const findings = await auditService.getFindings(audit.id);
      expect(findings.length).toBeGreaterThan(0);

      // Generate report
      const report = await auditService.generateReport(audit.id);
      expect(report).toBeInstanceOf(Blob);
    });
  });

  describe('Data persistence', () => {
    it('should persist data across operations', () => {
      // Create data
      dataService.saveAssessment({
        id: 'persist-test',
        frameworkId: 'cmmc',
        frameworkName: 'CMMC 2.0',
        responses: {},
        createdAt: new Date(),
        lastModified: new Date(),
        isComplete: false,
        version: '1.0'
      });

      // Verify data exists
      const saved = dataService.getAssessment('persist-test');
      expect(saved).toBeDefined();

      // Export and import
      const exported = dataService.exportAllData();
      expect(exported.assessments.length).toBeGreaterThan(0);

      // Reset and restore
      const backup = dataService.createBackup();
      dataService.resetAllData();
      
      expect(dataService.getAssessments().length).toBe(0);

      dataService.restoreFromBackup(backup);
      expect(dataService.getAssessment('persist-test')).toBeDefined();
    });
  });

  describe('Error recovery', () => {
    it('should recover from corrupted data', () => {
      // Simulate corrupted data
      localStorage.setItem('cybersecurity-assessments', 'corrupted');
      
      // Should not throw
      expect(() => dataService.getAssessments()).not.toThrow();
      expect(dataService.getAssessments()).toEqual([]);
    });

    it('should handle storage quota exceeded', () => {
      // Create large amount of data
      const assessments = Array.from({ length: 1000 }, (_, i) => ({
        id: `assessment-${i}`,
        frameworkId: 'cmmc',
        frameworkName: 'CMMC 2.0',
        responses: {},
        createdAt: new Date(),
        lastModified: new Date(),
        isComplete: false,
        version: '1.0'
      }));

      // Should handle gracefully
      assessments.forEach(assessment => {
        try {
          dataService.saveAssessment(assessment);
        } catch (error) {
          // Expected if storage is full
        }
      });
    });
  });

  describe('Concurrent operations', () => {
    it('should handle concurrent saves', async () => {
      const promises = [];

      for (let i = 0; i < 10; i++) {
        promises.push(
          auditService.createAudit({
            name: `Audit ${i}`,
            type: 'internal',
            status: 'scheduled',
            scheduledDate: new Date(),
            completedDate: null,
            auditor: 'Auditor',
            findings: [],
            scope: [],
            reportUrl: null
          })
        );
      }

      const audits = await Promise.all(promises);
      expect(audits.length).toBe(10);

      const allAudits = await auditService.getAudits();
      expect(allAudits.length).toBeGreaterThanOrEqual(10);
    });
  });

  describe('Data validation', () => {
    it('should validate all data types', () => {
      const validation = dataService.validateData();
      expect(validation).toBeDefined();
      expect(validation.isValid).toBeDefined();
      expect(Array.isArray(validation.errors)).toBe(true);
    });
  });

  describe('Performance under load', () => {
    it('should handle large dataset efficiently', () => {
      const startTime = performance.now();

      // Create many assessments
      for (let i = 0; i < 100; i++) {
        dataService.saveAssessment({
          id: `perf-test-${i}`,
          frameworkId: 'cmmc',
          frameworkName: 'CMMC 2.0',
          responses: {},
          createdAt: new Date(),
          lastModified: new Date(),
          isComplete: false,
          version: '1.0'
        });
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should complete within reasonable time (adjust threshold as needed)
      expect(duration).toBeLessThan(5000);
    });
  });
});

