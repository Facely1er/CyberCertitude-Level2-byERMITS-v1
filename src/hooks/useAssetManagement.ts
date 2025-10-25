import { useCallback } from 'react';
import { Asset } from '../shared/types/assets';
import { assetService } from '../services/assetService';

export const useAssetManagement = (
  assets: Asset[],
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>,
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void
) => {
  const handleSaveAsset = useCallback(async (asset: Asset) => {
    try {
      const savedAsset = await assetService.saveAsset(asset);
      
      if (asset.id) {
        // Update existing asset
        setAssets(prev => prev.map(a => a.id === asset.id ? savedAsset : a));
        addNotification('success', 'Asset updated successfully');
      } else {
        // Add new asset
        setAssets(prev => [...prev, savedAsset]);
        addNotification('success', 'Asset created successfully');
      }
      
      return savedAsset;
    } catch (error) {
      console.error('Failed to save asset:', error);
      addNotification('error', 'Failed to save asset');
      throw error;
    }
  }, [setAssets, addNotification]);

  const handleDeleteAsset = useCallback(async (assetId: string) => {
    try {
      await assetService.deleteAsset(assetId);
      setAssets(prev => prev.filter(a => a.id !== assetId));
      addNotification('success', 'Asset deleted successfully');
    } catch (error) {
      console.error('Failed to delete asset:', error);
      addNotification('error', 'Failed to delete asset');
    }
  }, [setAssets, addNotification]);

  return {
    handleSaveAsset,
    handleDeleteAsset
  };
};
