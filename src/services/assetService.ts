/**
 * 🏢 Asset Management Service
 * Handles all asset-related operations including CRUD, import/export, and validation
 */

import { Asset, AssetCategory, CriticalityLevel, AssetStatus, InformationClassification } from '../shared/types/assets';
import { dataService } from './dataService';
import { logger } from '../utils/logger';
import { fileService } from './fileService';

export interface AssetCreateData {
  name: string;
  description: string;
  category: AssetCategory;
  subcategory: string;
  type: string;
  owner: string;
  custodian: string;
  location: {
    building: string;
    floor: string;
    room: string;
    rack?: string;
    slot?: string;
  };
  criticality: CriticalityLevel;
  informationClassification: InformationClassification;
  businessValue: 'low' | 'medium' | 'high' | 'critical';
  handlesCUI: boolean;
  cuiCategory: string[];
  tags: string[];
}

export interface AssetUpdateData extends Partial<AssetCreateData> {
  id: string;
}

export interface AssetFilter {
  category?: AssetCategory;
  criticality?: CriticalityLevel;
  status?: AssetStatus;
  handlesCUI?: boolean;
  owner?: string;
  tags?: string[];
  search?: string;
}

export interface AssetExportOptions {
  format: 'csv' | 'xlsx' | 'json';
  includeMetadata?: boolean;
  filter?: AssetFilter;
}

class AssetService {
  private static instance: AssetService;
  private assets: Asset[] = [];

  private constructor() {
    this.loadAssets();
  }

  public static getInstance(): AssetService {
    if (!AssetService.instance) {
      AssetService.instance = new AssetService();
    }
    return AssetService.instance;
  }

  private loadAssets(): void {
    try {
      this.assets = dataService.getAssets();
      logger.debug('Assets loaded successfully', { count: this.assets.length });
    } catch (error) {
      logger.error('Failed to load assets:', error);
      this.assets = [];
    }
  }

  private saveAssets(): void {
    try {
      dataService.saveAssets(this.assets);
      logger.debug('Assets saved successfully', { count: this.assets.length });
    } catch (error) {
      logger.error('Failed to save assets:', error);
      throw new Error('Failed to save assets');
    }
  }

  public getAllAssets(): Asset[] {
    return [...this.assets];
  }

  public getAssetById(id: string): Asset | null {
    return this.assets.find(asset => asset.id === id) || null;
  }

  public getAssetsByFilter(filter: AssetFilter): Asset[] {
    return this.assets.filter(asset => {
      if (filter.category && asset.category !== filter.category) return false;
      if (filter.criticality && asset.criticality !== filter.criticality) return false;
      if (filter.status && asset.status !== filter.status) return false;
      if (filter.handlesCUI !== undefined && asset.handlesCUI !== filter.handlesCUI) return false;
      if (filter.owner && !asset.owner.toLowerCase().includes(filter.owner.toLowerCase())) return false;
      if (filter.tags && filter.tags.length > 0) {
        const hasMatchingTag = filter.tags.some(tag => asset.tags.includes(tag));
        if (!hasMatchingTag) return false;
      }
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        const matchesSearch = asset.name.toLowerCase().includes(searchLower) ||
                             asset.description.toLowerCase().includes(searchLower) ||
                             asset.owner.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      return true;
    });
  }

  public createAsset(assetData: AssetCreateData): Asset {
    const now = new Date();
    const newAsset: Asset = {
      id: `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...assetData,
      status: 'active' as AssetStatus,
      dependencies: [],
      controls: [],
      vulnerabilities: [],
      riskAssessment: {
        riskLevel: 'medium',
        lastAssessed: now,
        assessedBy: assetData.owner,
        riskFactors: [],
        mitigationStrategies: []
      },
      compliance: [],
      lifecycle: {
        phase: 'operational',
        acquisitionDate: now,
        warrantyExpiry: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        disposalDate: null,
        disposalMethod: null
      },
      createdAt: now,
      updatedAt: now,
      lastReviewed: now,
      nextReview: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      metadata: {},
      cuiScope: {
        dataTypes: assetData.cuiCategory,
        accessLevel: 'standard',
        sharingRestrictions: [],
        retentionPeriod: 7 * 365 // 7 years in days
      },
      cmmcApplicability: {
        level: assetData.handlesCUI ? 2 : 1,
        applicableControls: [],
        implementationStatus: 'not-implemented'
      },
      dataFlow: {
        sources: [],
        destinations: [],
        transmissionMethods: [],
        encryptionInTransit: false,
        encryptionAtRest: false
      }
    };

    this.assets.push(newAsset);
    this.saveAssets();
    
    logger.info('Asset created successfully', { 
      assetId: newAsset.id, 
      name: newAsset.name,
      category: newAsset.category 
    });

    return newAsset;
  }

  public updateAsset(assetData: AssetUpdateData): Asset {
    const assetIndex = this.assets.findIndex(asset => asset.id === assetData.id);
    if (assetIndex === -1) {
      throw new Error(`Asset with id ${assetData.id} not found`);
    }

    const updatedAsset: Asset = {
      ...this.assets[assetIndex],
      ...assetData,
      updatedAt: new Date()
    };

    this.assets[assetIndex] = updatedAsset;
    this.saveAssets();

    logger.info('Asset updated successfully', { 
      assetId: updatedAsset.id, 
      name: updatedAsset.name 
    });

    return updatedAsset;
  }

  public deleteAsset(assetId: string): void {
    const assetIndex = this.assets.findIndex(asset => asset.id === assetId);
    if (assetIndex === -1) {
      throw new Error(`Asset with id ${assetId} not found`);
    }

    const deletedAsset = this.assets[assetIndex];
    this.assets.splice(assetIndex, 1);
    this.saveAssets();

    logger.info('Asset deleted successfully', { 
      assetId: deletedAsset.id, 
      name: deletedAsset.name 
    });
  }

  public exportAssets(options: AssetExportOptions): Promise<Blob> {
    return new Promise((resolve, reject) => {
      try {
        let assetsToExport = this.assets;
        
        if (options.filter) {
          assetsToExport = this.getAssetsByFilter(options.filter);
        }

        const exportData = assetsToExport.map(asset => {
          const baseData = {
            id: asset.id,
            name: asset.name,
            description: asset.description,
            category: asset.category,
            subcategory: asset.subcategory,
            type: asset.type,
            owner: asset.owner,
            custodian: asset.custodian,
            location: `${asset.location.building} - ${asset.location.floor} - ${asset.location.room}`,
            status: asset.status,
            criticality: asset.criticality,
            informationClassification: asset.informationClassification,
            businessValue: asset.businessValue,
            handlesCUI: asset.handlesCUI,
            cuiCategory: asset.cuiCategory.join(', '),
            tags: asset.tags.join(', '),
            createdAt: asset.createdAt.toISOString(),
            updatedAt: asset.updatedAt.toISOString(),
            lastReviewed: asset.lastReviewed.toISOString(),
            nextReview: asset.nextReview.toISOString()
          };

          if (options.includeMetadata) {
            return {
              ...baseData,
              metadata: JSON.stringify(asset.metadata),
              riskAssessment: JSON.stringify(asset.riskAssessment),
              lifecycle: JSON.stringify(asset.lifecycle),
              compliance: JSON.stringify(asset.compliance)
            };
          }

          return baseData;
        });

        let blob: Blob;
        const timestamp = new Date().toISOString().split('T')[0];

        switch (options.format) {
          case 'csv':
            blob = this.convertToCSV(exportData);
            break;
          case 'xlsx':
            blob = this.convertToXLSX(exportData);
            break;
          case 'json':
            blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            break;
          default:
            throw new Error(`Unsupported export format: ${options.format}`);
        }

        logger.info('Assets exported successfully', { 
          format: options.format, 
          count: exportData.length 
        });

        resolve(blob);
      } catch (error) {
        logger.error('Failed to export assets:', error);
        reject(error);
      }
    });
  }

  public async importAssets(file: File): Promise<{ success: number; errors: string[] }> {
    try {
      const fileContent = await fileService.readFileAsText(file);
      let importedData: any[];

      if (file.name.endsWith('.json')) {
        importedData = JSON.parse(fileContent);
      } else if (file.name.endsWith('.csv')) {
        importedData = this.parseCSV(fileContent);
      } else {
        throw new Error('Unsupported file format. Please use CSV or JSON.');
      }

      const results = { success: 0, errors: [] as string[] };

      for (const [index, assetData] of importedData.entries()) {
        try {
          const validatedData = this.validateImportData(assetData);
          this.createAsset(validatedData);
          results.success++;
        } catch (error) {
          const errorMessage = `Row ${index + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          results.errors.push(errorMessage);
          logger.warn('Failed to import asset row', { row: index + 1, error: errorMessage });
        }
      }

      logger.info('Asset import completed', { 
        success: results.success, 
        errors: results.errors.length 
      });

      return results;
    } catch (error) {
      logger.error('Failed to import assets:', error);
      throw new Error(`Failed to import assets: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private convertToCSV(data: any[]): Blob {
    if (data.length === 0) {
      return new Blob([''], { type: 'text/csv' });
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(','))
    ].join('\n');

    return new Blob([csvContent], { type: 'text/csv' });
  }

  private convertToXLSX(data: any[]): Blob {
    // For now, return CSV format. In a real implementation, you'd use a library like xlsx
    return this.convertToCSV(data);
  }

  private parseCSV(csvContent: string): any[] {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).filter(line => line.trim()).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      return obj;
    });
  }

  private validateImportData(data: any): AssetCreateData {
    const requiredFields = ['name', 'description', 'category', 'owner', 'custodian', 'criticality', 'informationClassification'];
    
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    return {
      name: data.name,
      description: data.description,
      category: data.category as AssetCategory,
      subcategory: data.subcategory || '',
      type: data.type || 'unknown',
      owner: data.owner,
      custodian: data.custodian,
      location: {
        building: data.building || 'Unknown',
        floor: data.floor || 'Unknown',
        room: data.room || 'Unknown',
        rack: data.rack,
        slot: data.slot
      },
      criticality: data.criticality as CriticalityLevel,
      informationClassification: data.informationClassification as InformationClassification,
      businessValue: data.businessValue || 'medium',
      handlesCUI: data.handlesCUI === 'true' || data.handlesCUI === true,
      cuiCategory: data.cuiCategory ? data.cuiCategory.split(',').map((c: string) => c.trim()) : [],
      tags: data.tags ? data.tags.split(',').map((t: string) => t.trim()) : []
    };
  }
}

export const assetService = AssetService.getInstance();