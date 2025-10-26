import { describe, it, expect, beforeEach, vi } from 'vitest';
import { dataService } from '../dataService';
import type { AssessmentData } from '../../shared/types';

describe('DataService', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    dataService.resetAllData();
  });

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = dataService;
      const instance2 = dataService;
      expect(instance1).toBe(instance2);
    });
  });

  describe('Assessment management', () => {
    it('should initialize with empty assessments', () => {
      const assessments = dataService.getAssessments();
      expect(assessments).toEqual([]);
    });

    it('should save and retrieve assessments', () => {
      const assessment: Partial<AssessmentData> = {
        id: 'test-1',
        frameworkId: 'cmmc',
        frameworkName: 'CMMC 2.0',
        responses: { 'ac.1.001': 2 },
        createdAt: new Date(),
        lastModified: new Date(),
        isComplete: false,
        version: '1.0.0'
      };

      dataService.saveAssessment(assessment as AssessmentData);
      const saved = dataService.getAssessment('test-1');
      expect(saved).toBeDefined();
      expect(saved?.frameworkId).toBe('cmmc');
    });

    it('should handle null/undefined assessments gracefully', () => {
      const assessment: Partial<AssessmentData> = {
        id: 'test-null',
        frameworkId: '',
        frameworkName: '',
        responses: {},
        createdAt: new Date(),
        lastModified: new Date(),
        isComplete: false,
        version: '1.0.0'
      };

      expect(() => dataService.saveAssessment(assessment as AssessmentData)).not.toThrow();
    });

    it('should delete assessment without errors', () => {
      const assessment: Partial<AssessmentData> = {
        id: 'test-2',
        frameworkId: 'cmmc',
        frameworkName: 'CMMC 2.0',
        responses: {},
        createdAt: new Date(),
        lastModified: new Date(),
        isComplete: false,
        version: '1.0.0'
      };

      dataService.saveAssessment(assessment as AssessmentData);
      expect(() => dataService.deleteAssessment('test-2')).not.toThrow();
      expect(dataService.getAssessment('test-2')).toBeNull();
    });

    it('should handle corrupted data gracefully', () => {
      localStorage.setItem('cybersecurity-assessments', 'invalid json');
      expect(() => dataService.getAssessments()).not.toThrow();
      expect(dataService.getAssessments()).toEqual([]);
    });

    it('should handle storage quota exceeded', () => {
      const largeAssessment = {
        responses: {} as Record<string, number>
      };
      
      // Simulate large data
      for (let i = 0; i < 10000; i++) {
        largeAssessment.responses[`control.${i}`] = 2;
      }

      const assessment: Partial<AssessmentData> = {
        id: 'test-large',
        frameworkId: 'cmmc',
        frameworkName: 'CMMC 2.0',
        responses: largeAssessment.responses,
        createdAt: new Date(),
        lastModified: new Date(),
        isComplete: false,
        version: '1.0.0'
      };

      // Mock localStorage to throw quota exceeded
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        const error = new Error();
        (error as any).code = 22; // QuotaExceededError
        throw error;
      });

      expect(() => dataService.saveAssessment(assessment as AssessmentData)).toThrow();
      localStorage.setItem = originalSetItem;
    });
  });

  describe('Asset management', () => {
    it('should return empty array when no assets exist', () => {
      const assets = dataService.getAssets();
      expect(Array.isArray(assets)).toBe(true);
      expect(assets.length).toBe(0);
    });

    it('should handle assets with missing optional fields', () => {
      const partialAsset = {
        id: 'asset-1',
        name: 'Test Asset',
        description: '',
        category: 'hardware',
        subcategory: '',
        type: '',
        owner: 'Test Owner',
        custodian: '',
        handlesCUI: false,
        cuiCategory: [],
        cmmcApplicability: {
          level: 0,
          domains: [],
          controls: [],
          maturityProcesses: [],
          assessmentScope: 'none'
        },
        cuiScope: {
          inScope: false,
          scopeJustification: '',
          boundaryDefinition: '',
          dataTypes: [],
          systems: [],
          networks: []
        },
        dataFlow: {
          inputSources: [],
          outputDestinations: [],
          dataAtRest: {
            storageLocation: '',
            encryptionMethod: '',
            accessControls: [],
            backupProcedures: [],
            retentionPeriod: ''
          },
          dataInTransit: {
            transportMethods: [],
            encryptionProtocols: [],
            networkSegmentation: false,
            authorizedPaths: []
          },
          dataInUse: {
            processingControls: [],
            userAccessControls: [],
            sessionManagement: [],
            dataHandlingProcedures: []
          }
        },
        location: {
          type: 'physical',
          building: '',
          room: '',
          address: ''
        },
        status: 'active',
        criticality: 'low',
        informationClassification: 'public',
        businessValue: 'low',
        dependencies: [],
        controls: [],
        vulnerabilities: [],
        riskAssessment: {
          overallRisk: 'low',
          riskFactors: [],
          threats: [],
          impact: {
            confidentiality: 'low',
            integrity: 'low',
            availability: 'low',
            financialImpact: '',
            operationalImpact: '',
            reputationalImpact: '',
            legalImpact: ''
          },
          likelihood: {
            threatLevel: 'low',
            vulnerabilityLevel: 'low',
            exposureLevel: 'low',
            historicalIncidents: 0,
            industryTrends: ''
          },
          riskTreatment: {
            strategy: 'accept',
            controls: [],
            residualRisk: 'low'
          },
          lastAssessment: new Date(),
          nextAssessment: new Date(),
          assessedBy: ''
        },
        compliance: [],
        lifecycle: {
          phase: 'operation',
          maintenanceSchedule: {
            frequency: 'as-needed',
            nextMaintenance: new Date(),
            maintenanceType: 'preventive',
            assignedTo: ''
          }
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        lastReviewed: new Date(),
        nextReview: new Date(),
        tags: []
      };

      expect(() => dataService.saveAsset(partialAsset as any)).not.toThrow();
    });

    it('should handle asset export without crashing', () => {
      expect(() => {
        const exported = dataService.exportAssetsWithClassification();
        expect(exported).toBeDefined();
        expect(typeof exported).toBe('string');
      }).not.toThrow();
    });

    it('should handle invalid import data gracefully', () => {
      const invalidData = 'not valid json';
      const result = dataService.importAssetsWithValidation(invalidData);
      
      expect(result.success).toBe(false);
      expect(result.imported).toBe(0);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate and import valid assets', () => {
      const validImportData = JSON.stringify({
        assets: [{
          id: 'imported-1',
          name: 'Imported Asset',
          owner: 'Test Owner',
          category: 'hardware',
          informationClassification: 'internal'
        }]
      });

      const result = dataService.importAssetsWithValidation(validImportData);
      expect(result.success).toBe(true);
      expect(result.imported).toBe(1);
      expect(result.errors.length).toBe(0);
    });
  });

  describe('Task management', () => {
    it('should return empty tasks array', () => {
      const tasks = dataService.getTasks();
      expect(Array.isArray(tasks)).toBe(true);
    });

    it('should handle task operations without errors', () => {
      const task = {
        id: 'task-1',
        title: 'Test Task',
        description: 'Test Description',
        type: 'cmmc-implementation',
        priority: 'medium',
        status: 'todo',
        cmmcDomain: 'AM',
        cmmcControl: 'AM.2.001',
        relatedControlId: 'am.2.001',
        assignedTo: ['user1'],
        assignedBy: 'manager',
        createdAt: new Date(),
        updatedAt: new Date(),
        dueDate: new Date(),
        estimatedHours: 8,
        progress: 0,
        dependencies: [],
        subtasks: [],
        attachments: [],
        comments: [],
        evidence: [],
        approvalRequired: false,
        producedEvidenceIds: [],
        requiredEvidenceIds: [],
        cuiImpact: 'low',
        deliverables: [],
        segregationOfDuties: false,
        sspSection: '',
        nistSP800171Mapping: [],
        tags: [],
        metadata: {
          cuiImpact: 'low',
          technicalComplexity: 'low',
          riskReduction: 0,
          cmmcImpact: [],
          successCriteria: [],
          deliverables: [],
          segregationOfDuties: false,
          c3paoRequired: false
        }
      };

      expect(() => dataService.saveTask(task as any)).not.toThrow();
      expect(() => dataService.deleteTask('task-1')).not.toThrow();
    });
  });

  describe('Settings management', () => {
    it('should return default settings', () => {
      const settings = dataService.getSettings();
      expect(settings).toBeDefined();
      expect(typeof settings).toBe('object');
    });

    it('should save and retrieve settings', () => {
      const newSettings = { theme: 'dark', notifications: true };
      expect(() => dataService.saveSettings(newSettings)).not.toThrow();
      
      const retrieved = dataService.getSettings();
      expect(retrieved.theme).toBe('dark');
    });
  });

  describe('Data export/import', () => {
    it('should export all data without crashing', () => {
      const exported = dataService.exportAllData();
      expect(exported).toBeDefined();
      expect(exported.assessments).toBeDefined();
      expect(exported.assets).toBeDefined();
      expect(exported.tasks).toBeDefined();
      expect(exported.settings).toBeDefined();
    });

    it('should handle import with missing fields gracefully', () => {
      const incompleteData = {
        version: '2.0.0',
        assessments: [],
        assets: [],
        tasks: [],
        settings: {},
        lastBackup: new Date(),
        userProfile: null
      };

      expect(() => {
        (dataService as any).importAllData(incompleteData);
      }).not.toThrow();
    });

    it('should handle corrupted import data', () => {
      const invalidData = {
        version: '1.0',
        assessments: 'invalid',
        assets: null
      };

      expect(() => {
        (dataService as any).importAllData(invalidData);
      }).not.toThrow();
    });
  });

  describe('Storage management', () => {
    it('should calculate storage usage', () => {
      const usage = dataService.getStorageUsage();
      expect(usage).toBeDefined();
      expect(usage.used).toBeGreaterThanOrEqual(0);
      expect(usage.total).toBeGreaterThan(0);
      expect(usage.percentage).toBeGreaterThanOrEqual(0);
    });

    it('should validate data without errors', () => {
      const validation = dataService.validateData();
      expect(validation).toBeDefined();
      expect(validation.isValid).toBeDefined();
      expect(Array.isArray(validation.errors)).toBe(true);
    });

    it('should handle data reset', () => {
      expect(() => dataService.resetAllData(false)).not.toThrow();
      
      // After reset, data should be empty
      expect(dataService.getAssessments().length).toBe(0);
      expect(dataService.getAssets().length).toBe(0);
      expect(dataService.getTasks().length).toBe(0);
    });

    it('should preserve profile when resetting data', () => {
      const profile = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        lastLogin: new Date()
      };

      dataService.saveUserProfile(profile as any);
      
      expect(() => dataService.resetAllData(true)).not.toThrow();
      
      const savedProfile = dataService.getUserProfile();
      // Should preserve profile
      expect(savedProfile?.email).toBe('test@example.com');
    });
  });

  describe('Backup and recovery', () => {
    it('should create backup without errors', () => {
      const backup = dataService.createBackup();
      expect(backup).toBeDefined();
      expect(typeof backup).toBe('string');
    });

    it('should handle restore with invalid backup', () => {
      const invalidBackup = 'not a valid backup';
      
      expect(() => {
        dataService.restoreFromBackup(invalidBackup);
      }).toThrow();
    });

    it('should restore from valid backup', () => {
      const backup = dataService.createBackup();
      
      expect(() => {
        dataService.restoreFromBackup(backup);
      }).not.toThrow();
    });
  });

  describe('Demo data management', () => {
    it('should load demo data without errors', () => {
      expect(() => dataService.loadDemoData()).not.toThrow();
    });

    it('should check if demo data is loaded', () => {
      expect(typeof dataService.isDemoDataLoaded()).toBe('boolean');
    });

    it('should clear demo data', () => {
      dataService.loadDemoData();
      expect(() => dataService.clearDemoData()).not.toThrow();
    });
  });

  describe('Error handling', () => {
    it('should handle JSON parse errors gracefully', () => {
      localStorage.setItem('cybersecurity-assessments', '{{{');
      
      expect(() => dataService.getAssessments()).not.toThrow();
      expect(dataService.getAssessments()).toEqual([]);
    });

    it('should handle null values in data', () => {
      const assessmentWithNulls = {
        id: 'test-null',
        frameworkId: null,
        frameworkName: null,
        responses: null,
        createdAt: null,
        lastModified: null,
        isComplete: false,
        version: '1.0'
      };

      expect(() => {
        dataService.saveAssessment(assessmentWithNulls as any);
      }).not.toThrow();
    });

    it('should handle undefined values in data', () => {
      const assessmentWithUndefined = {
        id: 'test-undefined',
        frameworkId: undefined,
        frameworkName: undefined,
        responses: undefined,
        createdAt: undefined,
        lastModified: undefined,
        isComplete: false,
        version: '1.0'
      };

      expect(() => {
        dataService.saveAssessment(assessmentWithUndefined as any);
      }).not.toThrow();
    });
  });

  describe('API integration fallback', () => {
    it('should handle API sync errors gracefully', async () => {
      await expect(dataService.syncWithAPI()).resolves.not.toThrow();
    });

    it('should get assessments via hybrid method', async () => {
      const assessments = await dataService.getAssessmentsHybrid();
      expect(Array.isArray(assessments)).toBe(true);
    });

    it('should get evidence via hybrid method', async () => {
      const evidence = await dataService.getEvidenceHybrid();
      expect(Array.isArray(evidence)).toBe(true);
    });
  });
});

