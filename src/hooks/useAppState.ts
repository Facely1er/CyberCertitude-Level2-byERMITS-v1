import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { NotificationMessage, UserProfile } from '../shared/types';
import { Asset } from '../shared/types/assets';
import { dataService } from '../services/dataService';

export const useAppState = () => {
  const location = useLocation();
  
  // Notification state
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  
  // User profile state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // UI state
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Asset management state
  const [assets, setAssets] = useState<Asset[]>([]);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  
  // Template management state
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState<string>('cmmc');
  const [selectedCMMCLevel] = useState<number>(2);

  // Load user profile on mount
  useEffect(() => {
    const profile = dataService.getUserProfile();
    setUserProfile(profile);
    
    // Check if first visit
    const hasVisited = localStorage.getItem('has-visited');
    if (!hasVisited) {
      setIsFirstVisit(true);
      localStorage.setItem('has-visited', 'true');
    }
  }, []);

  return {
    // Notification state
    notifications,
    setNotifications,
    
    // User profile state
    userProfile,
    setUserProfile,
    
    // UI state
    isFirstVisit,
    setIsFirstVisit,
    showMobileMenu,
    setShowMobileMenu,
    
    // Asset management state
    assets,
    setAssets,
    showAssetModal,
    setShowAssetModal,
    editingAsset,
    setEditingAsset,
    
    // Template management state
    showTemplateModal,
    setShowTemplateModal,
    selectedFramework,
    setSelectedFramework,
    selectedCMMCLevel
  };
};
