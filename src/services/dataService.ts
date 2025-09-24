/**
 * 📊 Data Service
 * Centralized data management service for all application data
 */

import { Asset } from '../shared/types/assets';
import { AssessmentData } from '../shared/types/assessment';
import { logger } from '../utils/logger';

class DataService {
  private static instance: DataService;
  private assets: Asset[] = [];
  private assessments: AssessmentData[] = [];

  private constructor() {
    this.loadData();
  }

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  private loadData(): void {
    try {
      // Load assets from localStorage
      const assetsData = localStorage.getItem('cmc_assets');
      if (assetsData) {
        this.assets = JSON.parse(assetsData).map((asset: any) => ({
          ...asset,
          createdAt: new Date(asset.createdAt),
          updatedAt: new Date(asset.updatedAt),
          lastReviewed: new Date(asset.lastReviewed),
          nextReview: new Date(asset.nextReview),
          lifecycle: {
            ...asset.lifecycle,
            acquisitionDate: new Date(asset.lifecycle.acquisitionDate),
            warrantyExpiry: asset.lifecycle.warrantyExpiry ? new Date(asset.lifecycle.warrantyExpiry) : null,
            disposalDate: asset.lifecycle.disposalDate ? new Date(asset.lifecycle.disposalDate) : null
          },
          riskAssessment: {
            ...asset.riskAssessment,
            lastAssessed: new Date(asset.riskAssessment.lastAssessed)
          }
        }));
      }

      // Load assessments from localStorage
      const assessmentsData = localStorage.getItem('cmc_assessments');
      if (assessmentsData) {
        this.assessments = JSON.parse(assessmentsData).map((assessment: any) => ({
          ...assessment,
          createdAt: new Date(assessment.createdAt),
          updatedAt: new Date(assessment.updatedAt),
          responses: assessment.responses || {}
        }));
      }

      logger.debug('Data loaded successfully', { 
        assets: this.assets.length, 
        assessments: this.assessments.length 
      });
    } catch (error) {
      logger.error('Failed to load data:', error);
      this.assets = [];
      this.assessments = [];
    }
  }

  private saveAssetsToStorage(): void {
    try {
      localStorage.setItem('cmc_assets', JSON.stringify(this.assets));
      logger.debug('Assets saved successfully', { count: this.assets.length });
    } catch (error) {
      logger.error('Failed to save assets:', error);
      throw new Error('Failed to save assets');
    }
  }

  private saveAssessmentsToStorage(): void {
    try {
      localStorage.setItem('cmc_assessments', JSON.stringify(this.assessments));
      logger.debug('Assessments saved successfully', { count: this.assessments.length });
    } catch (error) {
      logger.error('Failed to save assessments:', error);
      throw new Error('Failed to save assessments');
    }
  }

  // Asset management methods
  public getAssets(): Asset[] {
    return [...this.assets];
  }

  public saveAssets(assets: Asset[]): void {
    this.assets = [...assets];
    this.saveAssetsToStorage();
  }

  public addAsset(asset: Asset): void {
    this.assets.push(asset);
    this.saveAssetsToStorage();
  }

  public updateAsset(asset: Asset): void {
    const index = this.assets.findIndex(a => a.id === asset.id);
    if (index !== -1) {
      this.assets[index] = asset;
      this.saveAssetsToStorage();
    }
  }

  public deleteAsset(assetId: string): void {
    this.assets = this.assets.filter(a => a.id !== assetId);
    this.saveAssetsToStorage();
  }

  // Assessment management methods
  public getAssessments(): AssessmentData[] {
    return [...this.assessments];
  }

  public saveAssessments(assessments: AssessmentData[]): void {
    this.assessments = [...assessments];
    this.saveAssessmentsToStorage();
  }

  public addAssessment(assessment: AssessmentData): void {
    this.assessments.push(assessment);
    this.saveAssessmentsToStorage();
  }

  public updateAssessment(assessment: AssessmentData): void {
    const index = this.assessments.findIndex(a => a.id === assessment.id);
    if (index !== -1) {
      this.assessments[index] = assessment;
      this.saveAssessmentsToStorage();
    }
  }

  public saveAssessment(assessment: AssessmentData): void {
    const index = this.assessments.findIndex(a => a.id === assessment.id);
    if (index !== -1) {
      this.assessments[index] = assessment;
    } else {
      this.assessments.push(assessment);
    }
    this.saveAssessmentsToStorage();
  }

  public deleteAssessment(assessmentId: string): void {
    this.assessments = this.assessments.filter(a => a.id !== assessmentId);
    this.saveAssessmentsToStorage();
  }

  // Generic data management
  public getData<T>(key: string): T[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      logger.error(`Failed to get data for key ${key}:`, error);
      return [];
    }
  }

  public saveData<T>(key: string, data: T[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      logger.debug(`Data saved for key ${key}`, { count: data.length });
    } catch (error) {
      logger.error(`Failed to save data for key ${key}:`, error);
      throw new Error(`Failed to save data for key ${key}`);
    }
  }

  public clearAllData(): void {
    try {
      localStorage.removeItem('cmc_assets');
      localStorage.removeItem('cmc_assessments');
      this.assets = [];
      this.assessments = [];
      logger.info('All data cleared successfully');
    } catch (error) {
      logger.error('Failed to clear data:', error);
      throw new Error('Failed to clear data');
    }
  }

  public exportData(): string {
    try {
      const exportData = {
        assets: this.assets,
        assessments: this.assessments,
        exportedAt: new Date().toISOString(),
        version: '1.0.0'
      };
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      logger.error('Failed to export data:', error);
      throw new Error('Failed to export data');
    }
  }

  public importData(data: string): { success: number; errors: string[] } {
    try {
      const importedData = JSON.parse(data);
      const results = { success: 0, errors: [] as string[] };

      // Import assets
      if (importedData.assets && Array.isArray(importedData.assets)) {
        try {
          this.assets = importedData.assets.map((asset: any) => ({
            ...asset,
            createdAt: new Date(asset.createdAt),
            updatedAt: new Date(asset.updatedAt),
            lastReviewed: new Date(asset.lastReviewed),
            nextReview: new Date(asset.nextReview),
            lifecycle: {
              ...asset.lifecycle,
              acquisitionDate: new Date(asset.lifecycle.acquisitionDate),
              warrantyExpiry: asset.lifecycle.warrantyExpiry ? new Date(asset.lifecycle.warrantyExpiry) : null,
              disposalDate: asset.lifecycle.disposalDate ? new Date(asset.lifecycle.disposalDate) : null
            },
            riskAssessment: {
              ...asset.riskAssessment,
              lastAssessed: new Date(asset.riskAssessment.lastAssessed)
            }
          }));
          this.saveAssetsToStorage();
          results.success++;
        } catch (error) {
          results.errors.push(`Assets: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      // Import assessments
      if (importedData.assessments && Array.isArray(importedData.assessments)) {
        try {
          this.assessments = importedData.assessments.map((assessment: any) => ({
            ...assessment,
            createdAt: new Date(assessment.createdAt),
            updatedAt: new Date(assessment.updatedAt),
            responses: assessment.responses || {}
          }));
          this.saveAssessmentsToStorage();
          results.success++;
        } catch (error) {
          results.errors.push(`Assessments: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      logger.info('Data import completed', { 
        success: results.success, 
        errors: results.errors.length 
      });

      return results;
    } catch (error) {
      logger.error('Failed to import data:', error);
      throw new Error(`Failed to import data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Settings management methods
  public getSettings(): any {
    try {
      const settings = localStorage.getItem('cmc_settings');
      if (settings) {
        return JSON.parse(settings);
      }
      // Return default settings if none exist
      return {
        autoSave: true,
        emailNotifications: false,
        reportFormat: 'detailed',
        dataRetention: '12',
        autoBackup: false,
        backupFrequency: 'weekly'
      };
    } catch (error) {
      logger.error('Failed to get settings:', error);
      return {
        autoSave: true,
        emailNotifications: false,
        reportFormat: 'detailed',
        dataRetention: '12',
        autoBackup: false,
        backupFrequency: 'weekly'
      };
    }
  }

  public saveSettings(settings: any): void {
    try {
      localStorage.setItem('cmc_settings', JSON.stringify(settings));
      logger.debug('Settings saved successfully');
    } catch (error) {
      logger.error('Failed to save settings:', error);
      throw new Error('Failed to save settings');
    }
  }

  // Storage usage methods
  public getStorageUsage(): { used: number; total: number; percentage: number } {
    try {
      let totalUsed = 0;
      
      // Calculate used space for each localStorage key
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          const value = localStorage.getItem(key);
          if (value) {
            totalUsed += value.length;
          }
        }
      }
      
      // Estimate total available space (typically 5-10MB for localStorage)
      const totalSpace = 5 * 1024 * 1024; // 5MB
      const percentage = (totalUsed / totalSpace) * 100;
      
      return {
        used: totalUsed,
        total: totalSpace,
        percentage: Math.min(percentage, 100)
      };
    } catch (error) {
      logger.error('Failed to calculate storage usage:', error);
      return { used: 0, total: 5 * 1024 * 1024, percentage: 0 };
    }
  }

  // Backup and restore methods
  public createBackup(): string {
    try {
      const backupData = {
        version: 2,
        backupDate: new Date().toISOString(),
        backupId: `backup_${Date.now()}`,
        assets: this.assets,
        assessments: this.assessments,
        settings: this.getSettings(),
        tasks: this.getData('cmc_tasks'),
        evidence: this.getData('cmc_evidence'),
        policies: this.getData('cmc_policies'),
        risks: this.getData('cmc_risks'),
        compliance: this.getData('cmc_compliance')
      };
      
      logger.info('Backup created successfully', { 
        assets: this.assets.length, 
        assessments: this.assessments.length 
      });
      
      return JSON.stringify(backupData, null, 2);
    } catch (error) {
      logger.error('Failed to create backup:', error);
      throw new Error('Failed to create backup');
    }
  }

  public restoreFromBackup(backupData: string): void {
    try {
      const backup = JSON.parse(backupData);
      
      // Restore assets
      if (backup.assets && Array.isArray(backup.assets)) {
        this.assets = backup.assets.map((asset: any) => ({
          ...asset,
          createdAt: new Date(asset.createdAt),
          updatedAt: new Date(asset.updatedAt),
          lastReviewed: new Date(asset.lastReviewed),
          nextReview: new Date(asset.nextReview),
          lifecycle: {
            ...asset.lifecycle,
            acquisitionDate: new Date(asset.lifecycle.acquisitionDate),
            warrantyExpiry: asset.lifecycle.warrantyExpiry ? new Date(asset.lifecycle.warrantyExpiry) : null,
            disposalDate: asset.lifecycle.disposalDate ? new Date(asset.lifecycle.disposalDate) : null
          },
          riskAssessment: {
            ...asset.riskAssessment,
            lastAssessed: new Date(asset.riskAssessment.lastAssessed)
          }
        }));
        this.saveAssetsToStorage();
      }
      
      // Restore assessments
      if (backup.assessments && Array.isArray(backup.assessments)) {
        this.assessments = backup.assessments.map((assessment: any) => ({
          ...assessment,
          createdAt: new Date(assessment.createdAt),
          updatedAt: new Date(assessment.updatedAt),
          responses: assessment.responses || {}
        }));
        this.saveAssessmentsToStorage();
      }
      
      // Restore settings
      if (backup.settings) {
        this.saveSettings(backup.settings);
      }
      
      // Restore other data types
      const dataTypes = ['tasks', 'evidence', 'policies', 'risks', 'compliance'];
      dataTypes.forEach(type => {
        if (backup[type] && Array.isArray(backup[type])) {
          this.saveData(`cmc_${type}`, backup[type]);
        }
      });
      
      logger.info('Backup restored successfully', { 
        assets: this.assets.length, 
        assessments: this.assessments.length 
      });
    } catch (error) {
      logger.error('Failed to restore backup:', error);
      throw new Error('Failed to restore backup');
    }
  }

  public importAllData(data: any): void {
    try {
      // Import assets
      if (data.assets && Array.isArray(data.assets)) {
        this.assets = data.assets.map((asset: any) => ({
          ...asset,
          createdAt: new Date(asset.createdAt),
          updatedAt: new Date(asset.updatedAt),
          lastReviewed: new Date(asset.lastReviewed),
          nextReview: new Date(asset.nextReview),
          lifecycle: {
            ...asset.lifecycle,
            acquisitionDate: new Date(asset.lifecycle.acquisitionDate),
            warrantyExpiry: asset.lifecycle.warrantyExpiry ? new Date(asset.lifecycle.warrantyExpiry) : null,
            disposalDate: asset.lifecycle.disposalDate ? new Date(asset.lifecycle.disposalDate) : null
          },
          riskAssessment: {
            ...asset.riskAssessment,
            lastAssessed: new Date(asset.riskAssessment.lastAssessed)
          }
        }));
        this.saveAssetsToStorage();
      }
      
      // Import assessments
      if (data.assessments && Array.isArray(data.assessments)) {
        this.assessments = data.assessments.map((assessment: any) => ({
          ...assessment,
          createdAt: new Date(assessment.createdAt),
          updatedAt: new Date(assessment.updatedAt),
          responses: assessment.responses || {}
        }));
        this.saveAssessmentsToStorage();
      }
      
      // Import other data types
      const dataTypes = ['tasks', 'evidence', 'policies', 'risks', 'compliance'];
      dataTypes.forEach(type => {
        if (data[type] && Array.isArray(data[type])) {
          this.saveData(`cmc_${type}`, data[type]);
        }
      });
      
      logger.info('All data imported successfully');
    } catch (error) {
      logger.error('Failed to import all data:', error);
      throw new Error('Failed to import all data');
    }
  }

  public resetAllData(preserveProfile: boolean = false): void {
    try {
      // Clear all data
      localStorage.removeItem('cmc_assets');
      localStorage.removeItem('cmc_assessments');
      localStorage.removeItem('cmc_tasks');
      localStorage.removeItem('cmc_evidence');
      localStorage.removeItem('cmc_policies');
      localStorage.removeItem('cmc_risks');
      localStorage.removeItem('cmc_compliance');
      
      // Clear internal state
      this.assets = [];
      this.assessments = [];
      
      // Preserve settings and profile if requested
      if (!preserveProfile) {
        localStorage.removeItem('cmc_settings');
        localStorage.removeItem('cmc_user_profile');
      }
      
      logger.info('All data reset successfully', { preserveProfile });
    } catch (error) {
      logger.error('Failed to reset all data:', error);
      throw new Error('Failed to reset all data');
    }
  }

  // Demo data management methods
  public isDemoDataLoaded(): boolean {
    try {
      // Check if demo data exists by looking for specific demo assets or assessments
      const hasDemoAssets = this.assets.some(asset => 
        asset.name.toLowerCase().includes('demo') || 
        asset.name.toLowerCase().includes('sample') ||
        asset.description?.toLowerCase().includes('demo')
      );
      
      const hasDemoAssessments = this.assessments.some(assessment => 
        assessment.frameworkName.toLowerCase().includes('demo') || 
        assessment.frameworkName.toLowerCase().includes('sample')
      );
      
      return hasDemoAssets || hasDemoAssessments;
    } catch (error) {
      logger.error('Failed to check demo data status:', error);
      return false;
    }
  }

  public clearDemoData(): void {
    try {
      // Remove demo assets
      this.assets = this.assets.filter(asset => 
        !asset.name.toLowerCase().includes('demo') && 
        !asset.name.toLowerCase().includes('sample') &&
        !asset.description?.toLowerCase().includes('demo')
      );
      
      // Remove demo assessments
      this.assessments = this.assessments.filter(assessment => 
        !assessment.frameworkName.toLowerCase().includes('demo') && 
        !assessment.frameworkName.toLowerCase().includes('sample')
      );
      
      // Save the cleaned data
      this.saveAssetsToStorage();
      this.saveAssessmentsToStorage();
      
      logger.info('Demo data cleared successfully', { 
        remainingAssets: this.assets.length, 
        remainingAssessments: this.assessments.length 
      });
    } catch (error) {
      logger.error('Failed to clear demo data:', error);
      throw new Error('Failed to clear demo data');
    }
  }

  // Task management methods
  public getTasks(): any[] {
    return this.getData('cmc_tasks');
  }

  public saveTask(task: any): void {
    try {
      const tasks = this.getTasks();
      const existingIndex = tasks.findIndex(t => t.id === task.id);
      
      if (existingIndex !== -1) {
        tasks[existingIndex] = task;
      } else {
        tasks.push(task);
      }
      
      this.saveData('cmc_tasks', tasks);
      logger.debug('Task saved successfully', { taskId: task.id });
    } catch (error) {
      logger.error('Failed to save task:', error);
      throw new Error('Failed to save task');
    }
  }

  public deleteTask(taskId: string): void {
    try {
      const tasks = this.getTasks();
      const filteredTasks = tasks.filter(t => t.id !== taskId);
      this.saveData('cmc_tasks', filteredTasks);
      logger.debug('Task deleted successfully', { taskId });
    } catch (error) {
      logger.error('Failed to delete task:', error);
      throw new Error('Failed to delete task');
    }
  }

  // Evidence management methods
  public getEvidence(): any[] {
    return this.getData('cmc_evidence');
  }

  public saveEvidence(evidence: any): void {
    try {
      const evidenceList = this.getEvidence();
      const existingIndex = evidenceList.findIndex(e => e.id === evidence.id);
      
      if (existingIndex !== -1) {
        evidenceList[existingIndex] = evidence;
      } else {
        evidenceList.push(evidence);
      }
      
      this.saveData('cmc_evidence', evidenceList);
      logger.debug('Evidence saved successfully', { evidenceId: evidence.id });
    } catch (error) {
      logger.error('Failed to save evidence:', error);
      throw new Error('Failed to save evidence');
    }
  }

  public deleteEvidence(evidenceId: string): void {
    try {
      const evidenceList = this.getEvidence();
      const filteredEvidence = evidenceList.filter(e => e.id !== evidenceId);
      this.saveData('cmc_evidence', filteredEvidence);
      logger.debug('Evidence deleted successfully', { evidenceId });
    } catch (error) {
      logger.error('Failed to delete evidence:', error);
      throw new Error('Failed to delete evidence');
    }
  }

  // Policy management methods
  public getPolicies(): any[] {
    return this.getData('cmc_policies');
  }

  public savePolicy(policy: any): void {
    try {
      const policies = this.getPolicies();
      const existingIndex = policies.findIndex(p => p.id === policy.id);
      
      if (existingIndex !== -1) {
        policies[existingIndex] = policy;
      } else {
        policies.push(policy);
      }
      
      this.saveData('cmc_policies', policies);
      logger.debug('Policy saved successfully', { policyId: policy.id });
    } catch (error) {
      logger.error('Failed to save policy:', error);
      throw new Error('Failed to save policy');
    }
  }

  public deletePolicy(policyId: string): void {
    try {
      const policies = this.getPolicies();
      const filteredPolicies = policies.filter(p => p.id !== policyId);
      this.saveData('cmc_policies', filteredPolicies);
      logger.debug('Policy deleted successfully', { policyId });
    } catch (error) {
      logger.error('Failed to delete policy:', error);
      throw new Error('Failed to delete policy');
    }
  }

  // Risk management methods
  public getRisks(): any[] {
    return this.getData('cmc_risks');
  }

  public saveRisk(risk: any): void {
    try {
      const risks = this.getRisks();
      const existingIndex = risks.findIndex(r => r.id === risk.id);
      
      if (existingIndex !== -1) {
        risks[existingIndex] = risk;
      } else {
        risks.push(risk);
      }
      
      this.saveData('cmc_risks', risks);
      logger.debug('Risk saved successfully', { riskId: risk.id });
    } catch (error) {
      logger.error('Failed to save risk:', error);
      throw new Error('Failed to save risk');
    }
  }

  public deleteRisk(riskId: string): void {
    try {
      const risks = this.getRisks();
      const filteredRisks = risks.filter(r => r.id !== riskId);
      this.saveData('cmc_risks', filteredRisks);
      logger.debug('Risk deleted successfully', { riskId });
    } catch (error) {
      logger.error('Failed to delete risk:', error);
      throw new Error('Failed to delete risk');
    }
  }

  // Compliance management methods
  public getCompliance(): any[] {
    return this.getData('cmc_compliance');
  }

  public saveCompliance(compliance: any): void {
    try {
      const complianceList = this.getCompliance();
      const existingIndex = complianceList.findIndex(c => c.id === compliance.id);
      
      if (existingIndex !== -1) {
        complianceList[existingIndex] = compliance;
      } else {
        complianceList.push(compliance);
      }
      
      this.saveData('cmc_compliance', complianceList);
      logger.debug('Compliance record saved successfully', { complianceId: compliance.id });
    } catch (error) {
      logger.error('Failed to save compliance record:', error);
      throw new Error('Failed to save compliance record');
    }
  }

  public deleteCompliance(complianceId: string): void {
    try {
      const complianceList = this.getCompliance();
      const filteredCompliance = complianceList.filter(c => c.id !== complianceId);
      this.saveData('cmc_compliance', filteredCompliance);
      logger.debug('Compliance record deleted successfully', { complianceId });
    } catch (error) {
      logger.error('Failed to delete compliance record:', error);
      throw new Error('Failed to delete compliance record');
    }
  }
}

export const dataService = DataService.getInstance();