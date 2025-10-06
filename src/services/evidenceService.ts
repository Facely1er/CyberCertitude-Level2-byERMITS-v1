import { dataService } from './dataService';
import { logger } from '../utils/logger';

export interface EvidenceItem {
  id: string;
  name: string;
  description: string;
  type: 'document' | 'screenshot' | 'configuration' | 'log' | 'test-result' | 'certificate' | 'policy' | 'procedure' | 'training-record' | 'audit-report';
  category: 'technical' | 'administrative' | 'physical' | 'compliance' | 'operational';
  controlId: string;
  controlName: string;
  framework: string;
  status: 'draft' | 'pending-review' | 'approved' | 'rejected' | 'archived';
  filePath?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  uploadDate: Date;
  lastModified: Date;
  uploadedBy: string;
  reviewedBy?: string;
  reviewDate?: Date;
  reviewNotes?: string;
  tags: string[];
  version: string;
  relatedEvidence: string[];
  complianceStatus: 'compliant' | 'partially-compliant' | 'non-compliant' | 'not-assessed';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  businessValue: 'low' | 'medium' | 'high' | 'critical';
  retentionPeriod: number; // in days
  retentionDate: Date;
  isConfidential: boolean;
  accessLevel: 'public' | 'internal' | 'confidential' | 'restricted';
  createdAt: Date;
  updatedAt: Date;
}

export interface EvidenceCollection {
  id: string;
  name: string;
  description: string;
  controlId: string;
  controlName: string;
  framework: string;
  status: 'in-progress' | 'completed' | 'reviewed' | 'approved';
  evidenceItems: EvidenceItem[];
  totalItems: number;
  completedItems: number;
  progress: number;
  dueDate: Date;
  assignedTo: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EvidenceFilters {
  type?: string;
  category?: string;
  status?: string;
  controlId?: string;
  framework?: string;
  uploadedBy?: string;
  search?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export class EvidenceService {
  private static instance: EvidenceService;
  private readonly STORAGE_KEY = 'cybersecurity-evidence';

  static getInstance(): EvidenceService {
    if (!EvidenceService.instance) {
      EvidenceService.instance = new EvidenceService();
    }
    return EvidenceService.instance;
  }

  async getEvidenceItems(): Promise<EvidenceItem[]> {
    try {
      const data = dataService.getData();
      return data.evidenceItems || [];
    } catch (error) {
      logger.error('Error fetching evidence items:', error);
      return [];
    }
  }

  async getEvidenceItem(id: string): Promise<EvidenceItem | null> {
    try {
      const evidenceItems = await this.getEvidenceItems();
      return evidenceItems.find(item => item.id === id) || null;
    } catch (error) {
      logger.error('Error fetching evidence item:', error);
      return null;
    }
  }

  async saveEvidenceItem(evidenceItem: Omit<EvidenceItem, 'createdAt' | 'updatedAt'>): Promise<EvidenceItem> {
    try {
      const evidenceItems = await this.getEvidenceItems();
      const now = new Date();
      
      const newEvidenceItem: EvidenceItem = {
        ...evidenceItem,
        createdAt: now,
        updatedAt: now
      };

      const existingIndex = evidenceItems.findIndex(item => item.id === evidenceItem.id);
      
      if (existingIndex >= 0) {
        evidenceItems[existingIndex] = { ...newEvidenceItem, createdAt: evidenceItems[existingIndex].createdAt };
      } else {
        evidenceItems.push(newEvidenceItem);
      }

      await this.saveEvidenceItems(evidenceItems);
      return newEvidenceItem;
    } catch (error) {
      logger.error('Error saving evidence item:', error);
      throw error;
    }
  }

  async updateEvidenceItem(id: string, updates: Partial<EvidenceItem>): Promise<EvidenceItem> {
    try {
      const evidenceItems = await this.getEvidenceItems();
      const index = evidenceItems.findIndex(item => item.id === id);
      
      if (index === -1) {
        throw new Error('Evidence item not found');
      }

      evidenceItems[index] = {
        ...evidenceItems[index],
        ...updates,
        updatedAt: new Date()
      };

      await this.saveEvidenceItems(evidenceItems);
      return evidenceItems[index];
    } catch (error) {
      logger.error('Error updating evidence item:', error);
      throw error;
    }
  }

  async deleteEvidenceItem(id: string): Promise<void> {
    try {
      const evidenceItems = await this.getEvidenceItems();
      const filteredItems = evidenceItems.filter(item => item.id !== id);
      await this.saveEvidenceItems(filteredItems);
    } catch (error) {
      logger.error('Error deleting evidence item:', error);
      throw error;
    }
  }

  async searchEvidenceItems(filters: EvidenceFilters): Promise<EvidenceItem[]> {
    try {
      let evidenceItems = await this.getEvidenceItems();

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        evidenceItems = evidenceItems.filter(item =>
          item.name.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm) ||
          item.controlName.toLowerCase().includes(searchTerm) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }

      if (filters.type && filters.type !== 'all') {
        evidenceItems = evidenceItems.filter(item => item.type === filters.type);
      }

      if (filters.category && filters.category !== 'all') {
        evidenceItems = evidenceItems.filter(item => item.category === filters.category);
      }

      if (filters.status && filters.status !== 'all') {
        evidenceItems = evidenceItems.filter(item => item.status === filters.status);
      }

      if (filters.controlId && filters.controlId !== 'all') {
        evidenceItems = evidenceItems.filter(item => item.controlId === filters.controlId);
      }

      if (filters.framework && filters.framework !== 'all') {
        evidenceItems = evidenceItems.filter(item => item.framework === filters.framework);
      }

      if (filters.uploadedBy && filters.uploadedBy !== 'all') {
        evidenceItems = evidenceItems.filter(item => item.uploadedBy === filters.uploadedBy);
      }

      if (filters.dateRange) {
        evidenceItems = evidenceItems.filter(item => 
          item.uploadDate >= filters.dateRange!.start && 
          item.uploadDate <= filters.dateRange!.end
        );
      }

      return evidenceItems;
    } catch (error) {
      logger.error('Error searching evidence items:', error);
      return [];
    }
  }

  async getEvidenceCollections(): Promise<EvidenceCollection[]> {
    try {
      const data = dataService.getData();
      return data.evidenceCollections || [];
    } catch (error) {
      logger.error('Error fetching evidence collections:', error);
      return [];
    }
  }

  async getEvidenceCollection(id: string): Promise<EvidenceCollection | null> {
    try {
      const collections = await this.getEvidenceCollections();
      return collections.find(collection => collection.id === id) || null;
    } catch (error) {
      logger.error('Error fetching evidence collection:', error);
      return null;
    }
  }

  async saveEvidenceCollection(collection: Omit<EvidenceCollection, 'createdAt' | 'updatedAt'>): Promise<EvidenceCollection> {
    try {
      const collections = await this.getEvidenceCollections();
      const now = new Date();
      
      const newCollection: EvidenceCollection = {
        ...collection,
        createdAt: now,
        updatedAt: now
      };

      const existingIndex = collections.findIndex(c => c.id === collection.id);
      
      if (existingIndex >= 0) {
        collections[existingIndex] = { ...newCollection, createdAt: collections[existingIndex].createdAt };
      } else {
        collections.push(newCollection);
      }

      await this.saveEvidenceCollections(collections);
      return newCollection;
    } catch (error) {
      logger.error('Error saving evidence collection:', error);
      throw error;
    }
  }

  async updateEvidenceCollection(id: string, updates: Partial<EvidenceCollection>): Promise<EvidenceCollection> {
    try {
      const collections = await this.getEvidenceCollections();
      const index = collections.findIndex(c => c.id === id);
      
      if (index === -1) {
        throw new Error('Evidence collection not found');
      }

      collections[index] = {
        ...collections[index],
        ...updates,
        updatedAt: new Date()
      };

      await this.saveEvidenceCollections(collections);
      return collections[index];
    } catch (error) {
      logger.error('Error updating evidence collection:', error);
      throw error;
    }
  }

  async deleteEvidenceCollection(id: string): Promise<void> {
    try {
      const collections = await this.getEvidenceCollections();
      const filteredCollections = collections.filter(c => c.id !== id);
      await this.saveEvidenceCollections(filteredCollections);
    } catch (error) {
      logger.error('Error deleting evidence collection:', error);
      throw error;
    }
  }

  async getEvidenceStatistics(): Promise<{
    totalItems: number;
    byType: Record<EvidenceItem['type'], number>;
    byCategory: Record<EvidenceItem['category'], number>;
    byStatus: Record<EvidenceItem['status'], number>;
    byControl: Record<string, number>;
    byFramework: Record<string, number>;
    byUploader: Record<string, number>;
    complianceRate: number;
    averageRiskLevel: number;
    totalSize: number;
  }> {
    try {
      const evidenceItems = await this.getEvidenceItems();
      
      const byType = evidenceItems.reduce((acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
      }, {} as Record<EvidenceItem['type'], number>);

      const byCategory = evidenceItems.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {} as Record<EvidenceItem['category'], number>);

      const byStatus = evidenceItems.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {} as Record<EvidenceItem['status'], number>);

      const byControl = evidenceItems.reduce((acc, item) => {
        acc[item.controlId] = (acc[item.controlId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const byFramework = evidenceItems.reduce((acc, item) => {
        acc[item.framework] = (acc[item.framework] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const byUploader = evidenceItems.reduce((acc, item) => {
        acc[item.uploadedBy] = (acc[item.uploadedBy] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const approvedItems = evidenceItems.filter(item => item.status === 'approved').length;
      const complianceRate = evidenceItems.length > 0 ? (approvedItems / evidenceItems.length) * 100 : 0;

      const riskScores = {
        'low': 1,
        'medium': 2,
        'high': 3,
        'critical': 4
      };

      const averageRiskLevel = evidenceItems.length > 0 
        ? evidenceItems.reduce((sum, item) => sum + riskScores[item.riskLevel], 0) / evidenceItems.length
        : 0;

      const totalSize = evidenceItems.reduce((sum, item) => sum + (item.fileSize || 0), 0);

      return {
        totalItems: evidenceItems.length,
        byType,
        byCategory,
        byStatus,
        byControl,
        byFramework,
        byUploader,
        complianceRate,
        averageRiskLevel,
        totalSize
      };
    } catch (error) {
      logger.error('Error calculating evidence statistics:', error);
      return {
        totalItems: 0,
        byType: {} as Record<EvidenceItem['type'], number>,
        byCategory: {} as Record<EvidenceItem['category'], number>,
        byStatus: {} as Record<EvidenceItem['status'], number>,
        byControl: {},
        byFramework: {},
        byUploader: {},
        complianceRate: 0,
        averageRiskLevel: 0,
        totalSize: 0
      };
    }
  }

  async uploadFile(file: File, evidenceItem: Omit<EvidenceItem, 'id' | 'createdAt' | 'updatedAt' | 'uploadDate' | 'lastModified'>): Promise<EvidenceItem> {
    try {
      // In a real application, this would upload to a file storage service
      // For now, we'll simulate the upload and store metadata
      const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const filePath = `/uploads/${fileId}_${file.name}`;
      
      const newEvidenceItem: EvidenceItem = {
        ...evidenceItem,
        id: `ev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        filePath,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        uploadDate: new Date(),
        lastModified: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await this.saveEvidenceItem(newEvidenceItem);
      return newEvidenceItem;
    } catch (error) {
      logger.error('Error uploading file:', error);
      throw error;
    }
  }

  async generateEvidenceFromAssessment(assessmentData: any): Promise<EvidenceItem[]> {
    try {
      const evidenceItems: EvidenceItem[] = [];
      const now = new Date();
      
      // Generate evidence requirements based on CMMC framework
      const cmmcFramework = await import('../data/frameworks/cmmc');
      
      cmmcFramework.cmmcFramework.sections.forEach(section => {
        section.categories.forEach(category => {
          category.questions.forEach(question => {
            const response = assessmentData.responses[question.id] || 0;
            
            if (response > 0) { // Only generate evidence for implemented controls
              const evidenceTypes = this.getEvidenceTypesForControl(question.id, response);
              
              evidenceTypes.forEach((evidenceType, index) => {
                evidenceItems.push({
                  id: `ev_${question.id}_${index}_${Date.now()}`,
                  name: `${question.text} - ${evidenceType.name}`,
                  description: evidenceType.description,
                  type: evidenceType.type,
                  category: evidenceType.category,
                  controlId: question.id,
                  controlName: question.text,
                  framework: 'CMMC 2.0 Level 2',
                  status: 'draft',
                  uploadDate: now,
                  lastModified: now,
                  uploadedBy: 'System Generated',
                  tags: evidenceType.tags,
                  version: '1.0',
                  relatedEvidence: [],
                  complianceStatus: response >= 3 ? 'compliant' : 'partially-compliant',
                  riskLevel: this.determineRiskLevel(question.priority, response),
                  businessValue: this.determineBusinessValue(question.priority),
                  retentionPeriod: evidenceType.retentionPeriod,
                  retentionDate: new Date(now.getTime() + evidenceType.retentionPeriod * 24 * 60 * 60 * 1000),
                  isConfidential: evidenceType.isConfidential,
                  accessLevel: evidenceType.accessLevel,
                  createdAt: now,
                  updatedAt: now
                });
              });
            }
          });
        });
      });

      return evidenceItems;
    } catch (error) {
      logger.error('Error generating evidence from assessment:', error);
      return [];
    }
  }

  private getEvidenceTypesForControl(controlId: string, response: number): Array<{
    name: string;
    description: string;
    type: EvidenceItem['type'];
    category: EvidenceItem['category'];
    tags: string[];
    retentionPeriod: number;
    isConfidential: boolean;
    accessLevel: EvidenceItem['accessLevel'];
  }> {
    const evidenceTypes: Array<{
      name: string;
      description: string;
      type: EvidenceItem['type'];
      category: EvidenceItem['category'];
      tags: string[];
      retentionPeriod: number;
      isConfidential: boolean;
      accessLevel: EvidenceItem['accessLevel'];
    }> = [];

    // Add standard evidence types based on control category
    if (controlId.includes('AC') || controlId.includes('access')) {
      evidenceTypes.push(
        {
          name: 'Access Control Configuration',
          description: 'Screenshots or documentation of access control settings',
          type: 'configuration',
          category: 'technical',
          tags: ['access-control', 'configuration', 'security'],
          retentionPeriod: 2555, // 7 years
          isConfidential: true,
          accessLevel: 'restricted'
        },
        {
          name: 'User Access Review',
          description: 'Documentation of user access reviews and approvals',
          type: 'document',
          category: 'administrative',
          tags: ['access-review', 'governance', 'compliance'],
          retentionPeriod: 2555,
          isConfidential: true,
          accessLevel: 'confidential'
        }
      );
    }

    if (controlId.includes('AU') || controlId.includes('audit')) {
      evidenceTypes.push(
        {
          name: 'Audit Log Configuration',
          description: 'Configuration of audit logging systems',
          type: 'configuration',
          category: 'technical',
          tags: ['audit', 'logging', 'configuration'],
          retentionPeriod: 1095, // 3 years
          isConfidential: false,
          accessLevel: 'internal'
        },
        {
          name: 'Audit Log Sample',
          description: 'Sample of audit logs showing proper logging',
          type: 'log',
          category: 'technical',
          tags: ['audit', 'logs', 'monitoring'],
          retentionPeriod: 1095,
          isConfidential: true,
          accessLevel: 'restricted'
        }
      );
    }

    if (controlId.includes('AT') || controlId.includes('training')) {
      evidenceTypes.push(
        {
          name: 'Training Records',
          description: 'Records of security awareness training completion',
          type: 'training-record',
          category: 'administrative',
          tags: ['training', 'awareness', 'personnel'],
          retentionPeriod: 1095,
          isConfidential: false,
          accessLevel: 'internal'
        },
        {
          name: 'Training Materials',
          description: 'Security awareness training materials and presentations',
          type: 'document',
          category: 'administrative',
          tags: ['training', 'materials', 'education'],
          retentionPeriod: 1095,
          isConfidential: false,
          accessLevel: 'public'
        }
      );
    }

    // Add generic evidence types for all controls
    evidenceTypes.push(
      {
        name: 'Implementation Documentation',
        description: 'Documentation describing how the control is implemented',
        type: 'document',
        category: 'administrative',
        tags: ['documentation', 'implementation', 'compliance'],
        retentionPeriod: 2555,
        isConfidential: false,
        accessLevel: 'internal'
      },
      {
        name: 'Test Results',
        description: 'Results of testing the control implementation',
        type: 'test-result',
        category: 'technical',
        tags: ['testing', 'validation', 'verification'],
        retentionPeriod: 1095,
        isConfidential: false,
        accessLevel: 'internal'
      }
    );

    return evidenceTypes;
  }

  private determineRiskLevel(priority: string, response: number): EvidenceItem['riskLevel'] {
    if (priority === 'high' || response < 2) return 'high';
    if (priority === 'medium' || response < 3) return 'medium';
    return 'low';
  }

  private determineBusinessValue(priority: string): EvidenceItem['businessValue'] {
    if (priority === 'high') return 'high';
    if (priority === 'medium') return 'medium';
    return 'low';
  }

  async exportEvidenceItems(evidenceItems: EvidenceItem[], format: 'csv' | 'pdf' | 'xlsx'): Promise<string> {
    try {
      if (format === 'csv') {
        const headers = ['ID', 'Name', 'Type', 'Category', 'Control ID', 'Status', 'Uploaded By', 'Upload Date', 'File Size', 'Compliance Status', 'Risk Level'];
        const rows = evidenceItems.map(item => [
          item.id,
          item.name,
          item.type,
          item.category,
          item.controlId,
          item.status,
          item.uploadedBy,
          item.uploadDate.toLocaleDateString(),
          item.fileSize ? `${(item.fileSize / 1024).toFixed(2)} KB` : 'N/A',
          item.complianceStatus,
          item.riskLevel
        ]);
        
        return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
      }
      
      // For PDF and XLSX, return a placeholder
      return `Generated ${format.toUpperCase()} export for ${evidenceItems.length} evidence items`;
    } catch (error) {
      logger.error('Error exporting evidence items:', error);
      throw error;
    }
  }

  private async saveEvidenceItems(evidenceItems: EvidenceItem[]): Promise<void> {
    try {
      const data = dataService.getData();
      data.evidenceItems = evidenceItems;
      await dataService.saveData(data);
    } catch (error) {
      logger.error('Error saving evidence items:', error);
      throw error;
    }
  }

  private async saveEvidenceCollections(collections: EvidenceCollection[]): Promise<void> {
    try {
      const data = dataService.getData();
      data.evidenceCollections = collections;
      await dataService.saveData(data);
    } catch (error) {
      logger.error('Error saving evidence collections:', error);
      throw error;
    }
  }
}

export const evidenceService = EvidenceService.getInstance();