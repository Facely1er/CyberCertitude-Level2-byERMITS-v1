import React, { useState, useEffect } from 'react';
import { 
  FileText, Upload, CheckCircle, Clock, AlertTriangle, 
  Download, Eye, Search, Calendar, Users, RefreshCw,
  Target, Shield, Activity, Plus, Filter, Trash2, Award, Settings
} from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';
import { useInternalLinking } from '@/shared/hooks/useInternalLinking';
import { evidenceService, EvidenceItem, EvidenceCollection, EvidenceFilters } from '@/services/evidenceService';
import { logger } from '@/utils/logger';

interface EvidenceCollectionDashboardProps {
  onBack: () => void;
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

const EvidenceCollectionDashboard: React.FC<EvidenceCollectionDashboardProps> = ({
  onBack: _onBack,
  addNotification
}) => {
  const { breadcrumbs } = useInternalLinking();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterControl, setFilterControl] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([]);
  const [filteredEvidenceItems, setFilteredEvidenceItems] = useState<EvidenceItem[]>([]);
  const [collections, setCollections] = useState<EvidenceCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadFormData, setUploadFormData] = useState({
    name: '',
    description: '',
    type: 'document' as EvidenceItem['type'],
    category: 'technical' as EvidenceItem['category'],
    controlId: '',
    controlName: '',
    framework: 'CMMC 2.0 Level 2',
    tags: '',
    isConfidential: false,
    accessLevel: 'internal' as EvidenceItem['accessLevel']
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [evidenceItems, searchTerm, filterStatus, filterType, filterCategory, filterControl]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [evidenceData, collectionsData, stats] = await Promise.all([
        evidenceService.getEvidenceItems(),
        evidenceService.getEvidenceCollections(),
        evidenceService.getEvidenceStatistics()
      ]);
      
      setEvidenceItems(evidenceData);
      setCollections(collectionsData);
      setStatistics(stats);
    } catch (error) {
      addNotification('error', 'Failed to load evidence data');
      logger.error('Error loading evidence data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      const filters: EvidenceFilters = {
        search: searchTerm || undefined,
        type: filterType !== 'all' ? filterType as EvidenceItem['type'] : undefined,
        category: filterCategory !== 'all' ? filterCategory as EvidenceItem['category'] : undefined,
        status: filterStatus !== 'all' ? filterStatus as EvidenceItem['status'] : undefined,
        controlId: filterControl !== 'all' ? filterControl : undefined
      };
      
      const filtered = await evidenceService.searchEvidenceItems(filters);
      setFilteredEvidenceItems(filtered);
    } catch (error) {
      logger.error('Error applying filters:', error);
      setFilteredEvidenceItems(evidenceItems);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadFormData(prev => ({
        ...prev,
        name: file.name.split('.')[0],
        description: `Uploaded file: ${file.name}`
      }));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      addNotification('error', 'Please select a file to upload');
      return;
    }

    if (!uploadFormData.name || !uploadFormData.controlId) {
      addNotification('error', 'Please fill in all required fields');
      return;
    }

    try {
      const tags = uploadFormData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const evidenceItem = await evidenceService.uploadFile(selectedFile, {
        name: uploadFormData.name,
        description: uploadFormData.description,
        type: uploadFormData.type,
        category: uploadFormData.category,
        controlId: uploadFormData.controlId,
        controlName: uploadFormData.controlName,
        framework: uploadFormData.framework,
        status: 'draft',
        uploadedBy: 'Current User', // In real app, get from auth context
        tags,
        version: '1.0',
        relatedEvidence: [],
        complianceStatus: 'not-assessed',
        riskLevel: 'medium',
        businessValue: 'medium',
        retentionPeriod: 1095, // 3 years default
        retentionDate: new Date(Date.now() + 1095 * 24 * 60 * 60 * 1000),
        isConfidential: uploadFormData.isConfidential,
        accessLevel: uploadFormData.accessLevel
      });

      await loadData();
      setShowUploadModal(false);
      setSelectedFile(null);
      setUploadFormData({
        name: '',
        description: '',
        type: 'document',
        category: 'technical',
        controlId: '',
        controlName: '',
        framework: 'CMMC 2.0 Level 2',
        tags: '',
        isConfidential: false,
        accessLevel: 'internal'
      });
      addNotification('success', 'Evidence item uploaded successfully');
    } catch (error) {
      addNotification('error', 'Failed to upload evidence item');
      logger.error('Error uploading evidence item:', error);
    }
  };

  const handleStatusChange = async (itemId: string, newStatus: EvidenceItem['status']) => {
    try {
      await evidenceService.updateEvidenceItem(itemId, { status: newStatus });
      await loadData();
      addNotification('success', 'Evidence item status updated successfully');
    } catch (error) {
      addNotification('error', 'Failed to update evidence item status');
      logger.error('Error updating evidence item status:', error);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this evidence item?')) {
      try {
        await evidenceService.deleteEvidenceItem(itemId);
        await loadData();
        addNotification('success', 'Evidence item deleted successfully');
      } catch (error) {
        addNotification('error', 'Failed to delete evidence item');
        logger.error('Error deleting evidence item:', error);
      }
    }
  };

  const handleExportEvidence = async () => {
    try {
      const csvContent = await evidenceService.exportEvidenceItems(filteredEvidenceItems, 'csv');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `evidence-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addNotification('success', 'Evidence exported successfully');
    } catch (error) {
      addNotification('error', 'Failed to export evidence');
      logger.error('Error exporting evidence:', error);
    }
  };

  const handleGenerateEvidence = async () => {
    try {
      // This would typically get assessment data from a service
      addNotification('info', 'To generate evidence from assessment, complete a CMMC assessment first');
    } catch (error) {
      addNotification('error', 'Failed to generate evidence from assessment');
      logger.error('Error generating evidence:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-300">Loading evidence data...</span>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'pending-review': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'draft': return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
      case 'rejected': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'archived': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'document': return 'text-blue-600 dark:text-blue-400';
      case 'screenshot': return 'text-green-600 dark:text-green-400';
      case 'configuration': return 'text-purple-600 dark:text-purple-400';
      case 'log': return 'text-orange-600 dark:text-orange-400';
      case 'test-result': return 'text-red-600 dark:text-red-400';
      case 'certificate': return 'text-indigo-600 dark:text-indigo-400';
      case 'policy': return 'text-pink-600 dark:text-pink-400';
      case 'procedure': return 'text-yellow-600 dark:text-yellow-400';
      case 'training-record': return 'text-teal-600 dark:text-teal-400';
      case 'audit-report': return 'text-cyan-600 dark:text-cyan-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical': return 'text-blue-600 dark:text-blue-400';
      case 'administrative': return 'text-green-600 dark:text-green-400';
      case 'physical': return 'text-purple-600 dark:text-purple-400';
      case 'compliance': return 'text-orange-600 dark:text-orange-400';
      case 'operational': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-600 dark:text-red-400';
      case 'high': return 'text-orange-600 dark:text-orange-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const formatFileSize = (bytes: number | undefined) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Evidence Collection
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Manage and organize compliance evidence
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleGenerateEvidence}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Generate from Assessment</span>
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Evidence</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Evidence Categories */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Evidence Categories
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Organized by compliance framework domains and evidence types
          </p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Access Control */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Access Control</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Identity & Access Management</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-300">Collections:</span>
                  <span className="font-medium text-blue-900 dark:text-blue-100">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-300">Evidence Types:</span>
                  <span className="font-medium text-blue-900 dark:text-blue-100">Policy, Procedure, Screenshot</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-300">Progress:</span>
                  <span className="font-medium text-blue-900 dark:text-blue-100">65%</span>
                </div>
              </div>
            </div>

            {/* Incident Response */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">Incident Response</h3>
                  <p className="text-sm text-red-700 dark:text-red-300">Security Incident Management</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-red-700 dark:text-red-300">Collections:</span>
                  <span className="font-medium text-red-900 dark:text-red-100">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-700 dark:text-red-300">Evidence Types:</span>
                  <span className="font-medium text-red-900 dark:text-red-100">Procedure, Audit Report</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-700 dark:text-red-300">Progress:</span>
                  <span className="font-medium text-red-900 dark:text-red-100">100%</span>
                </div>
              </div>
            </div>

            {/* Risk Management */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg p-6 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100">Risk Management</h3>
                  <p className="text-sm text-orange-700 dark:text-orange-300">Risk Assessment & Mitigation</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-orange-700 dark:text-orange-300">Collections:</span>
                  <span className="font-medium text-orange-900 dark:text-orange-100">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700 dark:text-orange-300">Evidence Types:</span>
                  <span className="font-medium text-orange-900 dark:text-orange-100">Assessment Report, Policy</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700 dark:text-orange-300">Progress:</span>
                  <span className="font-medium text-orange-900 dark:text-orange-100">0%</span>
                </div>
              </div>
            </div>

            {/* Training & Awareness */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">Training & Awareness</h3>
                  <p className="text-sm text-green-700 dark:text-green-300">Security Education & Training</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-700 dark:text-green-300">Collections:</span>
                  <span className="font-medium text-green-900 dark:text-green-100">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700 dark:text-green-300">Evidence Types:</span>
                  <span className="font-medium text-green-900 dark:text-green-100">Training Record, Certificate</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700 dark:text-green-300">Progress:</span>
                  <span className="font-medium text-green-900 dark:text-green-100">40%</span>
                </div>
              </div>
            </div>

            {/* Configuration Management */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Settings className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">Configuration Management</h3>
                  <p className="text-sm text-purple-700 dark:text-purple-300">System Configuration & Change Control</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-700 dark:text-purple-300">Collections:</span>
                  <span className="font-medium text-purple-900 dark:text-purple-100">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700 dark:text-purple-300">Evidence Types:</span>
                  <span className="font-medium text-purple-900 dark:text-purple-100">Configuration, Procedure</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700 dark:text-purple-300">Progress:</span>
                  <span className="font-medium text-purple-900 dark:text-purple-100">25%</span>
                </div>
              </div>
            </div>

            {/* Audit & Monitoring */}
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <Activity className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Audit & Monitoring</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Continuous Monitoring & Auditing</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Collections:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Evidence Types:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">Log File, Audit Report</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Progress:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">0%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Evidence</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{statistics.totalItems}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{statistics.byStatus.approved || 0}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{statistics.byStatus['pending-review'] || 0}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Size</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{formatFileSize(statistics.totalSize)}</p>
              </div>
              <Activity className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions & Templates */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Quick Actions & Templates
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Get started quickly with pre-built evidence collection templates
          </p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* NIST CSF Template */}
            <button
              onClick={() => addNotification('info', 'NIST CSF v2.0 template would be applied')}
              className="p-4 border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 text-left group"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800/30 transition-colors">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300">NIST CSF v2.0</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Complete Framework</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Comprehensive evidence collection for all NIST CSF v2.0 functions and categories
              </p>
            </button>

            {/* CMMC 2.0 Level 2 Template */}
            <button
              onClick={() => addNotification('info', 'CMMC 2.0 Level 2 template would be applied')}
              className="p-4 border-2 border-dashed border-green-300 dark:border-green-600 rounded-lg hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 text-left group"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-800/30 transition-colors">
                  <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>

                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-300">CMMC 2.0 Level 2</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Military Contractors</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Evidence collection template for CMMC 2.0 Level 2 compliance requirements
              </p>
            </button>

            {/* ISO 27001 Template */}
            <button
              onClick={() => addNotification('info', 'ISO 27001 template would be applied')}
              className="p-4 border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-lg hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 text-left group"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-800/30 transition-colors">
                  <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300">ISO 27001</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">International Standard</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Information security management system evidence collection template
              </p>
            </button>

            {/* Custom Template */}
            <button
              onClick={() => setShowUploadModal(true)}
              className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-500 dark:hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-all duration-200 text-left group"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                  <Plus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300">Custom Template</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Create New</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Create a custom evidence collection template for your specific needs
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search evidence..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="document">Document</option>
              <option value="screenshot">Screenshot</option>
              <option value="configuration">Configuration</option>
              <option value="log">Log</option>
              <option value="test-result">Test Result</option>
              <option value="certificate">Certificate</option>
              <option value="policy">Policy</option>
              <option value="procedure">Procedure</option>
              <option value="training-record">Training Record</option>
              <option value="audit-report">Audit Report</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="technical">Technical</option>
              <option value="administrative">Administrative</option>
              <option value="physical">Physical</option>
              <option value="compliance">Compliance</option>
              <option value="operational">Operational</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending-review">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="archived">Archived</option>
            </select>

            <select
              value={filterControl}
              onChange={(e) => setFilterControl(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Controls</option>
              {statistics && Object.keys(statistics.byControl).map(controlId => (
                <option key={controlId} value={controlId}>{controlId}</option>
              ))}
            </select>

            <button
              onClick={handleExportEvidence}
              className="flex items-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Evidence Items List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Evidence Items ({filteredEvidenceItems.length})
          </h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {filteredEvidenceItems.map((item) => (
              <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {item.name}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status.replace('-', ' ')}
                      </span>
                      <span className={`font-medium ${getTypeColor(item.type)}`}>
                        {item.type.replace('-', ' ')}
                      </span>
                      <span className={`font-medium ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {item.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Control ID:</span>
                        <div className="font-medium text-gray-900 dark:text-white">{item.controlId}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Framework:</span>
                        <div className="font-medium text-gray-900 dark:text-white">{item.framework}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Uploaded By:</span>
                        <div className="font-medium text-gray-900 dark:text-white">{item.uploadedBy}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">File Size:</span>
                        <div className="font-medium text-gray-900 dark:text-white">{formatFileSize(item.fileSize)}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Compliance:</span>
                        <div className={`font-medium ${getRiskColor(item.complianceStatus)}`}>
                          {item.complianceStatus.replace('-', ' ')}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Risk Level:</span>
                        <div className={`font-medium ${getRiskColor(item.riskLevel)}`}>
                          {item.riskLevel}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Access Level:</span>
                        <div className="font-medium text-gray-900 dark:text-white">{item.accessLevel}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Upload Date:</span>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {item.uploadDate.toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {item.tags && item.tags.length > 0 && (
                      <div className="mb-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Tags:</span>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {item.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      const itemDetails = `Evidence Details:

ID: ${item.id}
Name: ${item.name}
Description: ${item.description}
Type: ${item.type.replace('-', ' ')}
Category: ${item.category}
Control ID: ${item.controlId}
Control Name: ${item.controlName}
Framework: ${item.framework}
Status: ${item.status.replace('-', ' ')}
Uploaded By: ${item.uploadedBy}
Upload Date: ${item.uploadDate.toLocaleDateString()}
File Size: ${formatFileSize(item.fileSize)}
Compliance Status: ${item.complianceStatus.replace('-', ' ')}
Risk Level: ${item.riskLevel}
Access Level: ${item.accessLevel}
Version: ${item.version}`;
                      
                      addNotification('info', itemDetails);
                    }}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value as EvidenceItem['status'])}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="pending-review">Pending Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="archived">Archived</option>
                  </select>
                  
                  <button
                    onClick={() => addNotification('info', 'Evidence editing is available through the evidence editor')}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredEvidenceItems.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Evidence Found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {searchTerm || filterStatus !== 'all' || filterType !== 'all' || filterCategory !== 'all' || filterControl !== 'all'
                  ? 'No evidence items match your current search and filter criteria. Try adjusting your filters.'
                  : 'No evidence items have been uploaded yet. Upload evidence or generate from assessment.'}
              </p>
              {!searchTerm && filterStatus === 'all' && filterType === 'all' && filterCategory === 'all' && filterControl === 'all' && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleGenerateEvidence}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Generate from Assessment
                  </button>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Upload Evidence
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload Evidence</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  File
                </label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={uploadFormData.name}
                  onChange={(e) => setUploadFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Evidence item name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={uploadFormData.description}
                  onChange={(e) => setUploadFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Evidence description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    value={uploadFormData.type}
                    onChange={(e) => setUploadFormData(prev => ({ ...prev, type: e.target.value as EvidenceItem['type'] }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="document">Document</option>
                    <option value="screenshot">Screenshot</option>
                    <option value="configuration">Configuration</option>
                    <option value="log">Log</option>
                    <option value="test-result">Test Result</option>
                    <option value="certificate">Certificate</option>
                    <option value="policy">Policy</option>
                    <option value="procedure">Procedure</option>
                    <option value="training-record">Training Record</option>
                    <option value="audit-report">Audit Report</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={uploadFormData.category}
                    onChange={(e) => setUploadFormData(prev => ({ ...prev, category: e.target.value as EvidenceItem['category'] }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="technical">Technical</option>
                    <option value="administrative">Administrative</option>
                    <option value="physical">Physical</option>
                    <option value="compliance">Compliance</option>
                    <option value="operational">Operational</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Control ID *
                </label>
                <input
                  type="text"
                  value={uploadFormData.controlId}
                  onChange={(e) => setUploadFormData(prev => ({ ...prev, controlId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., AC.1.001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Control Name
                </label>
                <input
                  type="text"
                  value={uploadFormData.controlName}
                  onChange={(e) => setUploadFormData(prev => ({ ...prev, controlName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Control name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={uploadFormData.tags}
                  onChange={(e) => setUploadFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., access-control, configuration, security"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={uploadFormData.isConfidential}
                    onChange={(e) => setUploadFormData(prev => ({ ...prev, isConfidential: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Confidential</span>
                </label>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Access Level
                  </label>
                  <select
                    value={uploadFormData.accessLevel}
                    onChange={(e) => setUploadFormData(prev => ({ ...prev, accessLevel: e.target.value as EvidenceItem['accessLevel'] }))}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="public">Public</option>
                    <option value="internal">Internal</option>
                    <option value="confidential">Confidential</option>
                    <option value="restricted">Restricted</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidenceCollectionDashboard;