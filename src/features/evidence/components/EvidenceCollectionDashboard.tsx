import React, { useState, useEffect } from 'react';
import { 
  FileText, Upload, CheckCircle, Clock, AlertTriangle, 
  Download, Eye, Search, Users, RefreshCw,
  Target, Shield, Activity, Plus, Trash2, Award, Settings
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
      const [evidenceData, , stats] = await Promise.all([
        evidenceService.getEvidenceItems(),
        evidenceService.getEvidenceCollections(), // Collections data fetched but not currently used in UI
        evidenceService.getEvidenceStatistics()
      ]);
      
      setEvidenceItems(evidenceData);
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
      
      await evidenceService.uploadFile(selectedFile, {
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
          <RefreshCw className="w-8 h-8 animate-spin text-primary-600 dark:text-primary-400" />
          <span className="ml-2 text-text-secondary-light dark:text-text-secondary-dark">Loading evidence data...</span>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300';
      case 'pending-review': return 'bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-300';
      case 'draft': return 'bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark border border-support-light dark:border-support-dark';
      case 'rejected': return 'bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-300';
      case 'archived': return 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-300';
      default: return 'bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark border border-support-light dark:border-support-dark';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'document': return 'text-primary-600 dark:text-primary-400';
      case 'screenshot': return 'text-success-600 dark:text-success-400';
      case 'configuration': return 'text-secondary-600 dark:text-secondary-400';
      case 'log': return 'text-warning-600 dark:text-warning-400';
      case 'test-result': return 'text-error-600 dark:text-error-400';
      case 'certificate': return 'text-primary-600 dark:text-primary-400';
      case 'policy': return 'text-accent-600 dark:text-accent-400';
      case 'procedure': return 'text-warning-600 dark:text-warning-400';
      case 'training-record': return 'text-success-600 dark:text-success-400';
      case 'audit-report': return 'text-primary-600 dark:text-primary-400';
      default: return 'text-text-secondary-light dark:text-text-secondary-dark';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical': return 'text-primary-600 dark:text-primary-400';
      case 'administrative': return 'text-success-600 dark:text-success-400';
      case 'physical': return 'text-secondary-600 dark:text-secondary-400';
      case 'compliance': return 'text-warning-600 dark:text-warning-400';
      case 'operational': return 'text-error-600 dark:text-error-400';
      default: return 'text-text-secondary-light dark:text-text-secondary-dark';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-error-600 dark:text-error-400';
      case 'high': return 'text-warning-600 dark:text-warning-400';
      case 'medium': return 'text-warning-600 dark:text-warning-400';
      case 'low': return 'text-success-600 dark:text-success-400';
      default: return 'text-text-secondary-light dark:text-text-secondary-dark';
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
      <div className="card-standard mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-xl">
                <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  Evidence Collection
                </h1>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  Manage and organize compliance evidence
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleGenerateEvidence}
                className="btn-secondary px-4 py-2 rounded-xl transition flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Generate from Assessment</span>
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="btn-primary px-4 py-2 rounded-xl transition flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Evidence</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Evidence Categories */}
      <div className="card-standard mb-8">
        <div className="p-6 border-b border-support-light dark:border-support-dark">
          <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
            Evidence Categories
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            Organized by compliance framework domains and evidence types
          </p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Access Control */}
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg p-6 border border-primary-200 dark:border-primary-800">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <Shield className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-100">Access Control</h3>
                  <p className="text-sm text-primary-700 dark:text-primary-300">Identity & Access Management</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-primary-700 dark:text-primary-300">Collections:</span>
                  <span className="font-medium text-primary-900 dark:text-primary-100">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-700 dark:text-primary-300">Evidence Types:</span>
                  <span className="font-medium text-primary-900 dark:text-primary-100">Policy, Procedure, Screenshot</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-700 dark:text-primary-300">Progress:</span>
                  <span className="font-medium text-primary-900 dark:text-primary-100">65%</span>
                </div>
              </div>
            </div>

            {/* Incident Response */}
            <div className="bg-gradient-to-br from-error-50 to-error-50 dark:from-error-900/20 dark:to-error-900/20 rounded-lg p-6 border border-error-200 dark:border-error-800">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-error-100 dark:bg-error-900/30 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-error-600 dark:text-error-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-error-900 dark:text-error-100">Incident Response</h3>
                  <p className="text-sm text-error-700 dark:text-error-300">Security Incident Management</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-error-700 dark:text-error-300">Collections:</span>
                  <span className="font-medium text-error-900 dark:text-error-100">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-error-700 dark:text-error-300">Evidence Types:</span>
                  <span className="font-medium text-error-900 dark:text-error-100">Procedure, Audit Report</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-error-700 dark:text-error-300">Progress:</span>
                  <span className="font-medium text-error-900 dark:text-error-100">100%</span>
                </div>
              </div>
            </div>

            {/* Risk Management */}
            <div className="bg-gradient-to-br from-warning-50 to-warning-50 dark:from-warning-900/20 dark:to-warning-900/20 rounded-lg p-6 border border-warning-200 dark:border-warning-800">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-warning-100 dark:bg-warning-900/30 rounded-lg">
                  <Target className="w-6 h-6 text-warning-600 dark:text-warning-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-warning-900 dark:text-warning-100">Risk Management</h3>
                  <p className="text-sm text-warning-700 dark:text-warning-300">Risk Assessment & Mitigation</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-warning-700 dark:text-warning-300">Collections:</span>
                  <span className="font-medium text-warning-900 dark:text-warning-100">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warning-700 dark:text-warning-300">Evidence Types:</span>
                  <span className="font-medium text-warning-900 dark:text-warning-100">Assessment Report, Policy</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warning-700 dark:text-warning-300">Progress:</span>
                  <span className="font-medium text-warning-900 dark:text-warning-100">0%</span>
                </div>
              </div>
            </div>

            {/* Training & Awareness */}
            <div className="bg-gradient-to-br from-success-50 to-success-50 dark:from-success-900/20 dark:to-success-900/20 rounded-lg p-6 border border-success-200 dark:border-success-800">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-success-100 dark:bg-success-900/30 rounded-lg">
                  <Users className="w-6 h-6 text-success-600 dark:text-success-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-success-900 dark:text-success-100">Training & Awareness</h3>
                  <p className="text-sm text-success-700 dark:text-success-300">Security Education & Training</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-success-700 dark:text-success-300">Collections:</span>
                  <span className="font-medium text-success-900 dark:text-success-100">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-success-700 dark:text-success-300">Evidence Types:</span>
                  <span className="font-medium text-success-900 dark:text-success-100">Training Record, Certificate</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-success-700 dark:text-success-300">Progress:</span>
                  <span className="font-medium text-success-900 dark:text-success-100">40%</span>
                </div>
              </div>
            </div>

            {/* Configuration Management */}
            <div className="bg-gradient-to-br from-secondary-50 to-secondary-50 dark:from-secondary-900/20 dark:to-secondary-900/20 rounded-lg p-6 border border-secondary-200 dark:border-secondary-800">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg">
                  <Settings className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">Configuration Management</h3>
                  <p className="text-sm text-secondary-700 dark:text-secondary-300">System Configuration & Change Control</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary-700 dark:text-secondary-300">Collections:</span>
                  <span className="font-medium text-secondary-900 dark:text-secondary-100">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-700 dark:text-secondary-300">Evidence Types:</span>
                  <span className="font-medium text-secondary-900 dark:text-secondary-100">Configuration, Procedure</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-700 dark:text-secondary-300">Progress:</span>
                  <span className="font-medium text-secondary-900 dark:text-secondary-100">25%</span>
                </div>
              </div>
            </div>

            {/* Audit & Monitoring */}
            <div className="bg-gradient-to-br from-background-light to-background-dark dark:from-background-dark dark:to-background-dark rounded-lg p-6 border border-support-light dark:border-support-dark">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-background-light dark:bg-background-dark rounded-lg border border-support-light dark:border-support-dark">
                  <Activity className="w-6 h-6 text-text-secondary-light dark:text-text-secondary-dark" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">Audit & Monitoring</h3>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Continuous Monitoring & Auditing</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary-light dark:text-text-secondary-dark">Collections:</span>
                  <span className="font-medium text-text-primary-light dark:text-text-primary-dark">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary-light dark:text-text-secondary-dark">Evidence Types:</span>
                  <span className="font-medium text-text-primary-light dark:text-text-primary-dark">Log File, Audit Report</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary-light dark:text-text-secondary-dark">Progress:</span>
                  <span className="font-medium text-text-primary-light dark:text-text-primary-dark">0%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card-standard p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Total Evidence</p>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{statistics.totalItems}</p>
              </div>
              <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
          </div>

          <div className="card-standard p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Approved</p>
                <p className="text-3xl font-bold text-success-600 dark:text-success-400">{statistics.byStatus.approved || 0}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success-600 dark:text-success-400" />
            </div>
          </div>

          <div className="card-standard p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Pending Review</p>
                <p className="text-3xl font-bold text-warning-600 dark:text-warning-400">{statistics.byStatus['pending-review'] || 0}</p>
              </div>
              <Clock className="w-8 h-8 text-warning-600 dark:text-warning-400" />
            </div>
          </div>

          <div className="card-standard p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Total Size</p>
                <p className="text-3xl font-bold text-secondary-600 dark:text-secondary-400">{formatFileSize(statistics.totalSize)}</p>
              </div>
              <Activity className="w-8 h-8 text-secondary-600 dark:text-secondary-400" />
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions & Templates */}
      <div className="card-standard mb-8">
        <div className="p-6 border-b border-support-light dark:border-support-dark">
          <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
            Quick Actions & Templates
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            Get started quickly with pre-built evidence collection templates
          </p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* NIST CSF Template */}
            <button
              onClick={() => addNotification('info', 'NIST CSF v2.0 template would be applied')}
              className="p-4 border-2 border-dashed border-primary-300 dark:border-primary-600 rounded-xl hover:border-primary-500 dark:hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 text-left group"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors">
                  <Shield className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark group-hover:text-primary-700 dark:group-hover:text-primary-300">NIST CSF v2.0</h3>
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Complete Framework</p>
                </div>
              </div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Comprehensive evidence collection for all NIST CSF v2.0 functions and categories
              </p>
            </button>

            {/* CMMC 2.0 Level 2 Template */}
            <button
              onClick={() => addNotification('info', 'CMMC 2.0 Level 2 template would be applied')}
              className="p-4 border-2 border-dashed border-success-300 dark:border-success-600 rounded-xl hover:border-success-500 dark:hover:border-success-400 hover:bg-success-50 dark:hover:bg-success-900/20 transition-all duration-200 text-left group"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-success-100 dark:bg-success-900/30 rounded-lg group-hover:bg-success-200 dark:group-hover:bg-success-900/50 transition-colors">
                  <Award className="w-5 h-5 text-success-600 dark:text-success-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark group-hover:text-success-700 dark:group-hover:text-success-300">CMMC 2.0 Level 2</h3>
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Government Contractors</p>
                </div>
              </div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Evidence collection template for CMMC 2.0 Level 2 compliance requirements
              </p>
            </button>

            {/* ISO 27001 Template */}
            <button
              onClick={() => addNotification('info', 'ISO 27001 template would be applied')}
              className="p-4 border-2 border-dashed border-secondary-300 dark:border-secondary-600 rounded-xl hover:border-secondary-500 dark:hover:border-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-900/20 transition-all duration-200 text-left group"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg group-hover:bg-secondary-200 dark:group-hover:bg-secondary-900/50 transition-colors">
                  <FileText className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark group-hover:text-secondary-700 dark:group-hover:text-secondary-300">ISO 27001</h3>
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">International Standard</p>
                </div>
              </div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Information security management system evidence collection template
              </p>
            </button>

            {/* Custom Template */}
            <button
              onClick={() => setShowUploadModal(true)}
              className="p-4 border-2 border-dashed border-support-light dark:border-support-dark rounded-xl hover:border-primary-300 dark:hover:border-primary-700 hover:bg-background-light dark:hover:bg-background-dark transition-all duration-200 text-left group"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-background-light dark:bg-background-dark rounded-lg border border-support-light dark:border-support-dark group-hover:bg-surface-light dark:group-hover:bg-surface-dark transition-colors">
                  <Plus className="w-5 h-5 text-text-secondary-light dark:text-text-secondary-dark" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark group-hover:text-primary-600 dark:group-hover:text-primary-400">Custom Template</h3>
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Create New</p>
                </div>
              </div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Create a custom evidence collection template for your specific needs
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card-standard mb-8 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark w-5 h-5" />
              <input
                type="text"
                placeholder="Search evidence..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-standard w-full pl-10 pr-4 py-3"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-standard"
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
              className="input-standard"
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
              className="input-standard"
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
              className="input-standard"
            >
              <option value="all">All Controls</option>
              {statistics && statistics.byControl && Object.keys(statistics.byControl).map(controlId => (
                <option key={controlId} value={controlId}>{controlId}</option>
              ))}
            </select>

            <button
              onClick={handleExportEvidence}
              className="btn-secondary px-4 py-3 rounded-xl transition flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Evidence Items List */}
      <div className="card-standard">
        <div className="p-6 border-b border-support-light dark:border-support-dark">
          <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
            Evidence Items ({filteredEvidenceItems.length})
          </h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {filteredEvidenceItems.map((item) => (
              <div key={item.id} className="border border-support-light dark:border-support-dark rounded-xl p-6 bg-background-light dark:bg-background-dark hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
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
                    
                    <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
                      {item.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Control ID:</span>
                        <div className="font-medium text-text-primary-light dark:text-text-primary-dark">{item.controlId}</div>
                      </div>
                      <div>
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Framework:</span>
                        <div className="font-medium text-text-primary-light dark:text-text-primary-dark">{item.framework}</div>
                      </div>
                      <div>
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Uploaded By:</span>
                        <div className="font-medium text-text-primary-light dark:text-text-primary-dark">{item.uploadedBy}</div>
                      </div>
                      <div>
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">File Size:</span>
                        <div className="font-medium text-text-primary-light dark:text-text-primary-dark">{formatFileSize(item.fileSize)}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Compliance:</span>
                        <div className={`font-medium ${getRiskColor(item.complianceStatus)}`}>
                          {item.complianceStatus.replace('-', ' ')}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Risk Level:</span>
                        <div className={`font-medium ${getRiskColor(item.riskLevel)}`}>
                          {item.riskLevel}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Access Level:</span>
                        <div className="font-medium text-text-primary-light dark:text-text-primary-dark">{item.accessLevel}</div>
                      </div>
                      <div>
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Upload Date:</span>
                        <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                          {item.uploadDate.toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {item.tags && item.tags.length > 0 && (
                      <div className="mb-4">
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Tags:</span>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {item.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 text-xs rounded-full">
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
                    className="btn-primary px-4 py-2 rounded-xl transition flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value as EvidenceItem['status'])}
                    className="input-standard"
                  >
                    <option value="draft">Draft</option>
                    <option value="pending-review">Pending Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="archived">Archived</option>
                  </select>
                  
                  <button
                    onClick={() => addNotification('info', 'Evidence editing is available through the evidence editor')}
                    className="btn-secondary px-4 py-2 rounded-xl transition flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="px-4 py-2 bg-error-500 text-white rounded-xl hover:bg-error-600 dark:hover:bg-error-400 transition-colors flex items-center space-x-2"
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
              <FileText className="w-16 h-16 text-text-muted-light dark:text-text-muted-dark mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                No Evidence Found
              </h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
                {searchTerm || filterStatus !== 'all' || filterType !== 'all' || filterCategory !== 'all' || filterControl !== 'all'
                  ? 'No evidence items match your current search and filter criteria. Try adjusting your filters.'
                  : 'No evidence items have been uploaded yet. Upload evidence or generate from assessment.'}
              </p>
              {!searchTerm && filterStatus === 'all' && filterType === 'all' && filterCategory === 'all' && filterControl === 'all' && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleGenerateEvidence}
                    className="btn-primary px-6 py-3 rounded-xl transition"
                  >
                    Generate from Assessment
                  </button>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="btn-secondary px-6 py-3 rounded-xl transition"
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
          <div className="card-standard p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">Upload Evidence</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  File
                </label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="input-standard w-full px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={uploadFormData.name}
                  onChange={(e) => setUploadFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="input-standard w-full px-3 py-2"
                  placeholder="Evidence item name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  Description
                </label>
                <textarea
                  value={uploadFormData.description}
                  onChange={(e) => setUploadFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="input-standard w-full px-3 py-2"
                  rows={3}
                  placeholder="Evidence description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                    Type
                  </label>
                  <select
                    value={uploadFormData.type}
                    onChange={(e) => setUploadFormData(prev => ({ ...prev, type: e.target.value as EvidenceItem['type'] }))}
                    className="input-standard w-full px-3 py-2"
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
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                    Category
                  </label>
                  <select
                    value={uploadFormData.category}
                    onChange={(e) => setUploadFormData(prev => ({ ...prev, category: e.target.value as EvidenceItem['category'] }))}
                    className="input-standard w-full px-3 py-2"
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
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  Control ID *
                </label>
                <input
                  type="text"
                  value={uploadFormData.controlId}
                  onChange={(e) => setUploadFormData(prev => ({ ...prev, controlId: e.target.value }))}
                  className="input-standard w-full px-3 py-2"
                  placeholder="e.g., AC.1.001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  Control Name
                </label>
                <input
                  type="text"
                  value={uploadFormData.controlName}
                  onChange={(e) => setUploadFormData(prev => ({ ...prev, controlName: e.target.value }))}
                  className="input-standard w-full px-3 py-2"
                  placeholder="Control name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={uploadFormData.tags}
                  onChange={(e) => setUploadFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="input-standard w-full px-3 py-2"
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
                  <span className="text-sm text-text-primary-light dark:text-text-primary-dark">Confidential</span>
                </label>

                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                    Access Level
                  </label>
                  <select
                    value={uploadFormData.accessLevel}
                    onChange={(e) => setUploadFormData(prev => ({ ...prev, accessLevel: e.target.value as EvidenceItem['accessLevel'] }))}
                    className="input-standard px-3 py-2"
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
                className="btn-secondary px-4 py-2 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="btn-primary px-4 py-2 rounded-xl transition"
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