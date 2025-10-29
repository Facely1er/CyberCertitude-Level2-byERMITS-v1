import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAssetManagement } from '../useAssetManagement';
import { assetService } from '../../services/assetService';

vi.mock('../../services/assetService', () => ({
  assetService: {
    createAsset: vi.fn(),
    updateAsset: vi.fn(),
    deleteAsset: vi.fn()
  }
}));

describe('useAssetManagement', () => {
  const mockSetAssets = vi.fn();
  const mockAddNotification = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(assetService.createAsset).mockResolvedValue({
      id: 'new-asset',
      name: 'New Asset'
    } as any);
    vi.mocked(assetService.updateAsset).mockResolvedValue({
      id: 'updated-asset',
      name: 'Updated Asset'
    } as any);
  });

  it('should initialize hook', () => {
    const { result } = renderHook(() => 
      useAssetManagement(mockSetAssets, mockAddNotification)
    );
    
    expect(result.current).toBeDefined();
    expect(result.current.handleSaveAsset).toBeDefined();
    expect(result.current.handleDeleteAsset).toBeDefined();
  });

  it('should save new asset', async () => {
    const { result } = renderHook(() => 
      useAssetManagement(mockSetAssets, mockAddNotification)
    );
    
    const assetData = {
      id: '',
      name: 'Test Asset',
      description: 'Test',
      category: 'server' as any,
      owner: 'owner@example.com',
      location: 'Building A',
      criticality: 'medium' as any,
      informationClassification: 'internal' as any,
      businessValue: 'medium' as any,
      handlesCUI: false,
      cuiCategory: [],
      tags: []
    };
    
    await act(async () => {
      await result.current.handleSaveAsset(assetData as any);
    });
    
    expect(assetService.createAsset).toHaveBeenCalled();
    expect(mockAddNotification).toHaveBeenCalledWith('success', 'Asset created successfully');
  });

  it('should update existing asset', async () => {
    const { result } = renderHook(() => 
      useAssetManagement(mockSetAssets, mockAddNotification)
    );
    
    const assetData = {
      id: 'existing-asset',
      name: 'Updated Asset',
      description: 'Test',
      category: 'server' as any,
      owner: 'owner@example.com',
      location: 'Building B',
      criticality: 'high' as any,
      informationClassification: 'confidential' as any,
      businessValue: 'high' as any,
      handlesCUI: true,
      cuiCategory: ['cui'],
      tags: ['production']
    };
    
    await act(async () => {
      await result.current.handleSaveAsset(assetData as any);
    });
    
    expect(assetService.updateAsset).toHaveBeenCalled();
    expect(mockAddNotification).toHaveBeenCalledWith('success', 'Asset updated successfully');
  });

  it('should delete asset', async () => {
    const { result } = renderHook(() => 
      useAssetManagement(mockSetAssets, mockAddNotification)
    );
    
    await act(async () => {
      await result.current.handleDeleteAsset('asset-id');
    });
    
    expect(assetService.deleteAsset).toHaveBeenCalledWith('asset-id');
    expect(mockAddNotification).toHaveBeenCalledWith('success', 'Asset deleted successfully');
  });

  it('should handle save errors', async () => {
    vi.mocked(assetService.createAsset).mockRejectedValueOnce(new Error('Save failed'));
    
    const { result } = renderHook(() => 
      useAssetManagement(mockSetAssets, mockAddNotification)
    );
    
    const assetData = {
      id: '',
      name: 'Test',
      description: '',
      category: 'server' as any,
      owner: 'owner@example.com',
      location: 'Building A',
      criticality: 'medium' as any,
      informationClassification: 'internal' as any,
      businessValue: 'medium' as any,
      handlesCUI: false,
      cuiCategory: [],
      tags: []
    };
    
    await expect(
      act(async () => {
        await result.current.handleSaveAsset(assetData as any);
      })
    ).rejects.toThrow();
    
    expect(mockAddNotification).toHaveBeenCalledWith('error', 'Failed to save asset');
  });

  it('should handle delete errors', async () => {
    vi.mocked(assetService.deleteAsset).mockRejectedValueOnce(new Error('Delete failed'));
    
    const { result } = renderHook(() => 
      useAssetManagement(mockSetAssets, mockAddNotification)
    );
    
    await act(async () => {
      await result.current.handleDeleteAsset('asset-id');
    });
    
    expect(mockAddNotification).toHaveBeenCalledWith('error', 'Failed to delete asset');
  });
});
