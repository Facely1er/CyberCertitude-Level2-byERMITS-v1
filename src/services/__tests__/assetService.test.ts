import { describe, it, expect, beforeEach, vi } from 'vitest';
import { assetService } from '../assetService';
import { dataService } from '../dataService';

// Mock dependencies
vi.mock('../dataService', () => ({
  dataService: {
    getAssets: vi.fn(),
    saveAssets: vi.fn()
  }
}));

vi.mock('../fileService', () => ({
  fileService: {
    exportToCSV: vi.fn(),
    exportToXLSX: vi.fn()
  }
}));

vi.mock('../../utils/logger', () => ({
  logger: {
    debug: vi.fn(),
    error: vi.fn()
  }
}));

describe('AssetService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(dataService.getAssets).mockReturnValue([]);
    vi.mocked(dataService.saveAssets).mockImplementation(() => {});
  });

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = assetService;
      const instance2 = assetService;
      expect(instance1).toBe(instance2);
    });
  });

  describe('Asset retrieval', () => {
    it('should get all assets', () => {
      const mockAssets = [
        { id: '1', name: 'Asset 1', category: 'server' },
        { id: '2', name: 'Asset 2', category: 'workstation' }
      ];
      vi.mocked(dataService.getAssets).mockReturnValue(mockAssets as any);

      const assets = assetService.getAllAssets();
      expect(assets.length).toBeGreaterThan(0);
    });

    it('should get asset by ID', () => {
      const mockAssets = [
        { id: '1', name: 'Asset 1' },
        { id: '2', name: 'Asset 2' }
      ];
      vi.mocked(dataService.getAssets).mockReturnValue(mockAssets as any);

      const asset = assetService.getAssetById('1');
      expect(asset).toBeDefined();
      expect(asset?.name).toBe('Asset 1');
    });

    it('should return null for non-existent asset', () => {
      vi.mocked(dataService.getAssets).mockReturnValue([]);
      const asset = assetService.getAssetById('non-existent');
      expect(asset).toBeNull();
    });

    it('should filter assets correctly', () => {
      const mockAssets = [
        { id: '1', name: 'Server 1', category: 'server', criticality: 'high' },
        { id: '2', name: 'Workstation 1', category: 'workstation', criticality: 'medium' }
      ];
      vi.mocked(dataService.getAssets).mockReturnValue(mockAssets as any);

      const filtered = assetService.getAssetsByFilter({ category: 'server' });
      expect(filtered.length).toBe(1);
      expect(filtered[0].category).toBe('server');
    });
  });

  describe('Asset creation', () => {
    it('should create a new asset', () => {
      const assetData = {
        name: 'New Asset',
        description: 'Test Description',
        category: 'server' as any,
        subcategory: 'physical',
        type: 'server',
        owner: 'owner@example.com',
        custodian: 'custodian@example.com',
        location: { building: 'A', floor: '1', room: '101' },
        criticality: 'high' as any,
        informationClassification: 'confidential' as any,
        businessValue: 'high' as any,
        handlesCUI: true,
        cuiCategory: ['cui'],
        tags: ['production']
      };

      const asset = assetService.createAsset(assetData);
      expect(asset).toBeDefined();
      expect(asset.name).toBe('New Asset');
      expect(asset.id).toBeDefined();
    });

    it('should save asset after creation', () => {
      const assetData = {
        name: 'Test Asset',
        description: 'Test',
        category: 'server' as any,
        subcategory: 'physical',
        type: 'server',
        owner: 'owner@example.com',
        custodian: 'owner@example.com',
        location: { building: 'A', floor: '1', room: '101' },
        criticality: 'medium' as any,
        informationClassification: 'internal' as any,
        businessValue: 'medium' as any,
        handlesCUI: false,
        cuiCategory: [],
        tags: []
      };

      assetService.createAsset(assetData);
      expect(dataService.saveAssets).toHaveBeenCalled();
    });
  });

  describe('Asset updates', () => {
    it('should update existing asset', () => {
      const existingAsset = {
        id: '1',
        name: 'Old Name',
        category: 'server' as any,
        subcategory: 'physical',
        type: 'server',
        owner: 'owner@example.com',
        custodian: 'owner@example.com',
        location: { building: 'A', floor: '1', room: '101' },
        criticality: 'medium' as any,
        informationClassification: 'internal' as any,
        businessValue: 'medium' as any,
        handlesCUI: false,
        cuiCategory: [],
        tags: [],
        status: 'active' as any,
        dependencies: [],
        controls: [],
        vulnerabilities: [],
        compliance: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        lastReviewed: new Date(),
        nextReview: new Date(),
        metadata: {},
        cuiScope: { dataTypes: [], accessLevel: 'standard' as any, protectionLevel: 'baseline' as any }
      };

      vi.mocked(dataService.getAssets).mockReturnValue([existingAsset] as any);

      const updateData = { id: '1', name: 'New Name' };
      const updated = assetService.updateAsset(updateData);

      expect(updated).toBeDefined();
      expect(updated.name).toBe('New Name');
    });

    it('should throw error when updating non-existent asset', () => {
      vi.mocked(dataService.getAssets).mockReturnValue([]);

      const updateData = { id: 'non-existent', name: 'New Name' };
      expect(() => assetService.updateAsset(updateData)).toThrow('Asset not found');
    });
  });

  describe('Asset deletion', () => {
    it('should delete existing asset', () => {
      const mockAssets = [
        { id: '1', name: 'Asset 1' },
        { id: '2', name: 'Asset 2' }
      ];
      vi.mocked(dataService.getAssets).mockReturnValue(mockAssets as any);

      assetService.deleteAsset('1');
      expect(dataService.saveAssets).toHaveBeenCalled();
    });

    it('should handle deletion of non-existent asset', () => {
      vi.mocked(dataService.getAssets).mockReturnValue([]);
      expect(() => assetService.deleteAsset('non-existent')).toThrow('Asset not found');
    });
  });

  describe('Asset statistics', () => {
    it('should calculate asset statistics', () => {
      const mockAssets = [
        { id: '1', category: 'server', criticality: 'high' },
        { id: '2', category: 'workstation', criticality: 'medium' },
        { id: '3', category: 'server', criticality: 'high' }
      ];
      vi.mocked(dataService.getAssets).mockReturnValue(mockAssets as any);

      const stats = assetService.getAssetStatistics();
      expect(stats.totalAssets).toBe(3);
      expect(stats.byCategory.server).toBe(2);
    });
  });

  describe('Error handling', () => {
    it('should handle save errors gracefully', () => {
      vi.mocked(dataService.saveAssets).mockImplementation(() => {
        throw new Error('Save failed');
      });

      const assetData = {
        name: 'Test',
        description: 'Test',
        category: 'server' as any,
        subcategory: 'physical',
        type: 'server',
        owner: 'owner@example.com',
        custodian: 'owner@example.com',
        location: { building: 'A', floor: '1', room: '101' },
        criticality: 'medium' as any,
        informationClassification: 'internal' as any,
        businessValue: 'medium' as any,
        handlesCUI: false,
        cuiCategory: [],
        tags: []
      };

      expect(() => assetService.createAsset(assetData)).toThrow('Failed to save assets');
    });
  });
});
