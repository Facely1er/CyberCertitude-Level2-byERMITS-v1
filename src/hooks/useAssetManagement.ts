import { useCallback } from 'react';
import { Asset } from '../shared/types/assets';
import { assetService } from '../services/assetService';

export const useAssetManagement = (
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>,
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void
) => {
  const handleSaveAsset = useCallback(async (asset: Asset) => {
    try {
      let savedAsset: Asset;
      
      if (asset.id) {
        // Update existing asset - convert Asset to AssetUpdateData format
        const updateData = {
          id: asset.id,
          name: asset.name,
          description: asset.description,
          category: asset.category,
          owner: asset.owner,
          criticality: asset.criticality,
          informationClassification: asset.informationClassification,
          businessValue: asset.businessValue,
          handlesCUI: asset.informationClassification === 'confidential' || asset.informationClassification === 'restricted',
          cuiCategory: asset.informationClassification === 'confidential' || asset.informationClassification === 'restricted' ? ['confidential'] : [],
          tags: asset.tags,
          location: {
            building: asset.location.split(',')[0] || '',
            floor: asset.location.split(',')[1] || '',
            room: asset.location.split(',')[2] || ''
          }
        };
        savedAsset = await assetService.updateAsset(updateData);
        addNotification('success', 'Asset updated successfully');
      } else {
        // Create new asset - convert Asset to AssetCreateData format
        const createData = {
          name: asset.name,
          description: asset.description,
          category: asset.category,
          subcategory: asset.category,
          type: asset.category,
          owner: asset.owner,
          custodian: asset.owner,
          criticality: asset.criticality,
          informationClassification: asset.informationClassification,
          businessValue: asset.businessValue,
          handlesCUI: asset.informationClassification === 'confidential' || asset.informationClassification === 'restricted',
          cuiCategory: asset.informationClassification === 'confidential' || asset.informationClassification === 'restricted' ? ['confidential'] : [],
          tags: asset.tags,
          location: {
            building: asset.location.split(',')[0] || '',
            floor: asset.location.split(',')[1] || '',
            room: asset.location.split(',')[2] || ''
          }
        };
        savedAsset = await assetService.createAsset(createData);
        addNotification('success', 'Asset created successfully');
      }
      
      return savedAsset;
    } catch (error) {
      console.error('Failed to save asset:', error);
      addNotification('error', 'Failed to save asset');
      throw error;
    }
  }, [addNotification]);

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
