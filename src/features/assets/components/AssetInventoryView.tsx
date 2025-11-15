import React, { useState } from 'react';
import { Search, ListFilter as Filter, Plus, Download, Upload, Eye, CreditCard as Edit3, Trash2, Shield, Server, Database, Users, Building, FileText, Cloud, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, Target, Settings, ChevronDown, ChevronRight, ChartBar as BarChart3, Tag, MapPin } from 'lucide-react';
import { Asset, AssetInventoryFilter, AssetCategory, CriticalityLevel, AssetStatus, InformationClassification } from '@/shared/types/assets';
import { SearchAndFilter, EmptyState, LoadingTable } from '@/shared/components/ui';
import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';
import { useInternalLinking } from '@/shared/hooks/useInternalLinking';

interface AssetInventoryViewProps {
  assets: Asset[];
  onViewAsset: (asset: Asset) => void;
  onEditAsset: (asset: Asset) => void;
  onDeleteAsset: (assetId: string) => void;
  onCreateAsset: () => void;
  onExportAssets: () => void;
  onImportAssets: (file: File) => void;
  onBack: () => void;
}

const AssetInventoryView: React.FC<AssetInventoryViewProps> = ({
  assets,
  onViewAsset,
  onEditAsset,
  onDeleteAsset,
  onCreateAsset,
  onExportAssets,
  onImportAssets,
  onBack
}) => {
  const { breadcrumbs } = useInternalLinking();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<AssetInventoryFilter>({});
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'criticality' | 'status' | 'lastReviewed'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Filter and sort assets
  const filteredAssets = React.useMemo(() => {
    if (!assets || !Array.isArray(assets)) {
      return [];
    }
    const filtered = assets.filter(asset => {
      // Defensive checks for asset properties
      if (!asset || typeof asset !== 'object') {
        return false;
      }
      
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const tags = Array.isArray(asset.tags) ? asset.tags : [];
      const assetName = asset.name || '';
      const assetDescription = asset.description || '';
      const assetOwner = asset.owner || '';
      
      const matchesSearch = assetName.toLowerCase().includes(searchLower) ||
                           assetDescription.toLowerCase().includes(searchLower) ||
                           assetOwner.toLowerCase().includes(searchLower) ||
                           tags.some(tag => tag && tag.toLowerCase().includes(searchLower));

      if (searchTerm && !matchesSearch) return false;

      // Category filter
      if (filters.categories && Array.isArray(filters.categories) && filters.categories.length > 0) {
        if (!asset.category || !filters.categories.includes(asset.category)) return false;
      }

      // Criticality filter
      if (filters.criticality && Array.isArray(filters.criticality) && filters.criticality.length > 0) {
        if (!asset.criticality || !filters.criticality.includes(asset.criticality)) return false;
      }

      // Status filter
      if (filters.status && Array.isArray(filters.status) && filters.status.length > 0) {
        if (!asset.status || !filters.status.includes(asset.status)) return false;
      }

      // Classification filter
      if (filters.classification && Array.isArray(filters.classification) && filters.classification.length > 0) {
        if (!asset.informationClassification || !filters.classification.includes(asset.informationClassification)) return false;
      }

      return true;
    });

    // Sort assets
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '');
          break;
        case 'category':
          comparison = (a.category || '').localeCompare(b.category || '');
          break;
        case 'criticality':
          const criticalityOrder: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
          const aOrder = criticalityOrder[a.criticality || 'low'] || 0;
          const bOrder = criticalityOrder[b.criticality || 'low'] || 0;
          comparison = bOrder - aOrder;
          break;
        case 'status':
          comparison = (a.status || '').localeCompare(b.status || '');
          break;
        case 'lastReviewed':
          const aTime = a.lastReviewed ? new Date(a.lastReviewed).getTime() : 0;
          const bTime = b.lastReviewed ? new Date(b.lastReviewed).getTime() : 0;
          comparison = bTime - aTime;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [assets, searchTerm, filters, sortBy, sortOrder]);

  const getCategoryIcon = (category: AssetCategory) => {
    switch (category) {
      case 'hardware': return Server;
      case 'software': return Database;
      case 'data': return FileText;
      case 'personnel': return Users;
      case 'facilities': return Building;
      case 'services': return Cloud;
      default: return Shield;
    }
  };

  const getCriticalityColor = (level: CriticalityLevel) => {
    switch (level) {
      case 'critical': return 'bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-300';
      case 'high': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'low': return 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300';
    }
  };

  const getStatusColor = (status: AssetStatus) => {
    switch (status) {
      case 'active': return 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300';
      case 'inactive': return 'bg-support-light dark:bg-background-dark/30 text-text-primary-light dark:text-text-secondary-dark';
      case 'maintenance': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'quarantined': return 'bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-300';
      case 'disposed': return 'bg-support-light dark:bg-background-dark/30 text-text-primary-light dark:text-text-secondary-dark';
      case 'decommissioned': return 'bg-support-light dark:bg-background-dark/30 text-text-primary-light dark:text-text-secondary-dark';
    }
  };

  const getClassificationColor = (classification: InformationClassification) => {
    switch (classification) {
      case 'public': return 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300';
      case 'internal': return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300';
      case 'confidential': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
      case 'restricted': return 'bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-300';
      case 'top-secret': return 'bg-black text-white';
    }
  };

  const handleFilterChange = (filterType: keyof AssetInventoryFilter, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportAssets(file);
      event.target.value = '';
    }
  };

  const toggleAssetSelection = (assetId: string) => {
    setSelectedAssets(prev => 
      prev.includes(assetId)
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const selectAllAssets = () => {
    if (selectedAssets.length === filteredAssets.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(filteredAssets.map(a => a.id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Header */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                Asset Inventory
              </h1>
              <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
                Manage and track all organizational assets
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2 px-4 py-2 border border-support-light dark:border-support-dark text-text-primary-light dark:text-text-secondary-dark rounded-lg hover:bg-background-light dark:hover:bg-surface-dark transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Import</span>
                <input
                  type="file"
                  accept=".csv,.json,.xlsx"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
              
              <button
                onClick={onExportAssets}
                className="flex items-center space-x-2 px-4 py-2 border border-support-light dark:border-support-dark text-text-primary-light dark:text-text-secondary-dark rounded-lg hover:bg-background-light dark:hover:bg-surface-dark transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              
              <button
                onClick={onCreateAsset}
                className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Asset</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchAndFilter
        searchPlaceholder="Search assets..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filterGroups={[
          {
            id: 'categories',
            label: 'Categories',
            multiple: true,
            options: [
              { id: 'hardware', label: 'Hardware', value: 'hardware' },
              { id: 'software', label: 'Software', value: 'software' },
              { id: 'data', label: 'Data', value: 'data' },
              { id: 'personnel', label: 'Personnel', value: 'personnel' },
              { id: 'facilities', label: 'Facilities', value: 'facilities' },
              { id: 'services', label: 'Services', value: 'services' },
              { id: 'documents', label: 'Documents', value: 'documents' },
              { id: 'intellectual-property', label: 'Intellectual Property', value: 'intellectual-property' }
            ]
          },
          {
            id: 'businessValue',
            label: 'Business Value',
            multiple: true,
            options: [
              { id: 'mission-critical', label: 'Mission Critical', value: 'mission-critical' },
              { id: 'business-important', label: 'Business Important', value: 'business-important' },
              { id: 'operational', label: 'Operational', value: 'operational' },
              { id: 'developmental', label: 'Developmental', value: 'developmental' },
              { id: 'administrative', label: 'Administrative', value: 'administrative' }
            ]
          },
          {
            id: 'criticality',
            label: 'Criticality',
            multiple: true,
            options: [
              { id: 'critical', label: 'Critical', value: 'critical' },
              { id: 'high', label: 'High', value: 'high' },
              { id: 'medium', label: 'Medium', value: 'medium' },
              { id: 'low', label: 'Low', value: 'low' }
            ]
          },
          {
            id: 'status',
            label: 'Status',
            multiple: true,
            options: [
              { id: 'active', label: 'Active', value: 'active' },
              { id: 'inactive', label: 'Inactive', value: 'inactive' },
              { id: 'maintenance', label: 'Maintenance', value: 'maintenance' },
              { id: 'quarantined', label: 'Quarantined', value: 'quarantined' },
              { id: 'disposed', label: 'Disposed', value: 'disposed' },
              { id: 'decommissioned', label: 'Decommissioned', value: 'decommissioned' }
            ]
          },
          {
            id: 'classification',
            label: 'Classification',
            multiple: true,
            options: [
              { id: 'public', label: 'Public', value: 'public' },
              { id: 'internal', label: 'Internal', value: 'internal' },
              { id: 'confidential', label: 'Confidential', value: 'confidential' },
              { id: 'restricted', label: 'Restricted', value: 'restricted' },
              { id: 'top-secret', label: 'Top Secret', value: 'top-secret' }
            ]
          }
        ]}
        selectedFilters={{
          categories: filters.categories || [],
          criticality: filters.criticality || [],
          status: filters.status || [],
          classification: filters.classification || []
        }}
        onFilterChange={(filterId, value) => {
          setFilters(prev => ({
            ...prev,
            [filterId]: value
          }));
        }}
        onClearFilters={() => setFilters({})}
        className="mb-8"
      />
      
      {/* Sort and View Controls */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="category">Sort by Category</option>
              <option value="criticality">Sort by Criticality</option>
              <option value="status">Sort by Status</option>
              <option value="lastReviewed">Sort by Last Reviewed</option>
            </select>
            
            <button
              onClick={() => {
                // Generate sample CSV template
                const csvTemplate = [
                  'name,description,category,type,owner,criticality,classification,status,building,room,tags',
                  'Example Server,Production web server,hardware,server,IT Manager,high,confidential,active,Data Center,Server Room 1,production;critical;web',
                  'Customer Database,Main customer database,software,database,Database Admin,critical,restricted,active,Data Center,Server Room 1,database;customer-data;production',
                  'HR Files,Employee records,data,personal-data,HR Manager,medium,confidential,active,Office Building,HR Office,hr;personnel;confidential'
                ].join('\n');
                
                const blob = new Blob([csvTemplate], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'asset-import-template.csv';
                link.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Template</span>
            </button>
          </div>
          
          <div className="flex border border-support-light dark:border-support-dark rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-3 ${viewMode === 'table' ? 'bg-primary-600 text-white' : 'bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark'} transition-colors`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-3 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark'} transition-colors`}
            >
              <Shield className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-text-primary-light dark:text-text-primary-dark font-medium">
              {filteredAssets.length} of {assets.length} assets
            </span>
            {selectedAssets.length > 0 && (
              <span className="text-primary-600 dark:text-primary-400 font-medium">
                {selectedAssets.length} selected
              </span>
            )}
          </div>
          
          {selectedAssets.length > 0 && (
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  selectedAssets.forEach(id => onDeleteAsset(id));
                  setSelectedAssets([]);
                }}
                className="px-4 py-2 bg-error-600 text-white rounded-lg hover:bg-error-700 transition-colors text-sm"
              >
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedAssets([])}
                className="px-4 py-2 border border-support-light dark:border-support-dark text-text-primary-light dark:text-text-secondary-dark rounded-lg hover:bg-background-light dark:hover:bg-surface-dark transition-colors text-sm"
              >
                Clear Selection
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Asset Display */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark">
        {loading ? (
          <div className="p-6">
            <LoadingTable rows={5} columns={6} />
          </div>
        ) : filteredAssets.length === 0 ? (
          <EmptyState
            title={assets.length === 0 ? 'No Assets Found' : 'No Matching Assets'}
            description={assets.length === 0 
              ? 'Start building your asset inventory by adding your first asset'
              : 'Try adjusting your search criteria or filters'
            }
            action={assets.length === 0 ? {
              label: 'Add First Asset',
              onClick: onCreateAsset
            } : undefined}
            icon={Shield}
          />
        ) : viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-light dark:bg-surface-dark">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedAssets.length === filteredAssets.length}
                      onChange={selectAllAssets}
                      className="rounded border-support-light text-primary-600 focus:ring-primary-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
                    Asset
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
                    Criticality
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
                    Classification
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAssets.map((asset) => {
                  const IconComponent = getCategoryIcon(asset.category);
                  return (
                    <tr key={asset.id} className="hover:bg-background-light dark:hover:bg-surface-dark/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedAssets.includes(asset.id)}
                          onChange={() => toggleAssetSelection(asset.id)}
                          className="rounded border-support-light text-primary-600 focus:ring-primary-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                            <IconComponent className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                              {asset.name}
                            </div>
                            <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                              {asset.description.length > 50 ? `${asset.description.substring(0, 50)}...` : asset.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="capitalize text-text-primary-light dark:text-text-primary-dark">
                          {asset.category.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCriticalityColor(asset.criticality)}`}>
                          {asset.criticality}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(asset.status)}`}>
                          {asset.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getClassificationColor(asset.informationClassification)}`}>
                          {asset.informationClassification}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-text-primary-light dark:text-text-primary-dark">
                        {asset.owner}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => onViewAsset(asset)}
                            className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                            title="View Asset"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditAsset(asset)}
                            className="p-2 text-success-600 dark:text-success-400 hover:bg-success-100 dark:hover:bg-success-900/30 rounded-lg transition-colors"
                            title="Edit Asset"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete "${asset.name}"?\n\nThis action cannot be undone.`)) {
                                onDeleteAsset(asset.id);
                              }
                            }}
                            className="p-2 text-error-600 dark:text-error-400 hover:bg-error-100 dark:hover:bg-error-900/30 rounded-lg transition-colors"
                            title="Delete Asset"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map((asset) => {
              const IconComponent = getCategoryIcon(asset.category);
              return (
                <div key={asset.id} className="border border-support-light dark:border-support-dark rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedAssets.includes(asset.id)}
                        onChange={() => toggleAssetSelection(asset.id)}
                        className="rounded border-support-light text-primary-600 focus:ring-primary-500"
                      />
                      <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                        <IconComponent className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => onViewAsset(asset)}
                        className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditAsset(asset)}
                        className="p-2 text-success-600 dark:text-success-400 hover:bg-success-100 dark:hover:bg-success-900/30 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteAsset(asset.id)}
                        className="p-2 text-error-600 dark:text-error-400 hover:bg-error-100 dark:hover:bg-error-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
                    {asset.name}
                  </h3>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
                    {asset.description.length > 100 ? `${asset.description.substring(0, 100)}...` : asset.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Category</span>
                      <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark capitalize">
                        {asset.category.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Criticality</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCriticalityColor(asset.criticality)}`}>
                        {asset.criticality}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Status</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(asset.status)}`}>
                        {asset.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Classification</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getClassificationColor(asset.informationClassification)}`}>
                        {asset.informationClassification}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Owner</span>
                      <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                        {asset.owner}
                      </span>
                    </div>
                  </div>
                  
                  {asset.tags && asset.tags.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-support-light dark:border-support-dark">
                      <div className="flex flex-wrap gap-2">
                        {asset.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-support-light dark:bg-surface-dark text-text-secondary-light dark:text-text-secondary-dark text-xs rounded">
                            #{tag}
                          </span>
                        ))}
                        {asset.tags.length > 3 && (
                          <span className="px-2 py-1 bg-support-light dark:bg-surface-dark text-text-secondary-light dark:text-text-secondary-dark text-xs rounded">
                            +{asset.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetInventoryView;