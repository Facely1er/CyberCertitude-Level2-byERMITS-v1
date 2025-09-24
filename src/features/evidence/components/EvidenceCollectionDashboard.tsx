import React, { useState, useEffect } from 'react';
import { FileText, Upload, Search, Download, Plus, Eye } from 'lucide-react';

interface EvidenceItem {
  id: string;
  title: string;
  type: 'document' | 'screenshot' | 'procedure' | 'policy';
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: Date;
  controlId: string;
  description: string;
  fileSize?: number;
  fileName?: string;
}

interface EvidenceCollectionDashboardProps {
  controlId?: string;
  onEvidenceSelect?: (evidence: EvidenceItem) => void;
}

export const EvidenceCollectionDashboard: React.FC<EvidenceCollectionDashboardProps> = ({
  controlId,
  onEvidenceSelect
}) => {
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [filteredEvidence, setFilteredEvidence] = useState<EvidenceItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Mock evidence data
    const mockEvidence: EvidenceItem[] = [
      {
        id: '1',
        title: 'Access Control Policy',
        type: 'policy',
        status: 'approved',
        uploadedAt: new Date('2024-01-15'),
        controlId: 'AC.3.1.1',
        description: 'Documented policy for user access controls',
        fileSize: 245760,
        fileName: 'access-control-policy.pdf'
      },
      {
        id: '2',
        title: 'User Account Management Screenshot',
        type: 'screenshot',
        status: 'pending',
        uploadedAt: new Date('2024-01-16'),
        controlId: 'AC.3.1.1',
        description: 'Screenshot of user management interface',
        fileSize: 1024000,
        fileName: 'user-management-screenshot.png'
      },
      {
        id: '3',
        title: 'Account Provisioning Procedure',
        type: 'procedure',
        status: 'approved',
        uploadedAt: new Date('2024-01-14'),
        controlId: 'AC.3.1.1',
        description: 'Step-by-step procedure for user account creation',
        fileSize: 189440,
        fileName: 'account-provisioning-procedure.docx'
      }
    ];

    setEvidence(mockEvidence);
    setFilteredEvidence(mockEvidence);
  }, []);

  useEffect(() => {
    let filtered = evidence;

    // Filter by control ID if specified
    if (controlId) {
      filtered = filtered.filter(item => item.controlId === controlId);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.type === filterType);
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => item.status === filterStatus);
    }

    setFilteredEvidence(filtered);
  }, [evidence, searchTerm, filterType, filterStatus, controlId]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      // Mock file upload
      const newEvidence: EvidenceItem = {
        id: Date.now().toString(),
        title: file.name.split('.')[0],
        type: 'document',
        status: 'pending',
        uploadedAt: new Date(),
        controlId: controlId || 'AC.3.1.1',
        description: `Uploaded file: ${file.name}`,
        fileSize: file.size,
        fileName: file.name
      };

      setEvidence(prev => [newEvidence, ...prev]);
    } catch (error) {
      console.error('File upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'policy': return '📋';
      case 'procedure': return '📝';
      case 'screenshot': return '📸';
      case 'document': return '📄';
      default: return '📄';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Evidence Collection Dashboard
        </h1>
        <p className="text-gray-600">
          Manage and organize evidence for CMMC compliance assessments
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search evidence..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="policy">Policy</option>
              <option value="procedure">Procedure</option>
              <option value="screenshot">Screenshot</option>
              <option value="document">Document</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Upload Button */}
          <div className="relative">
            <input
              type="file"
              id="file-upload"
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt"
            />
            <label
              htmlFor="file-upload"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                isUploading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Upload className="w-5 h-5" />
              {isUploading ? 'Uploading...' : 'Upload Evidence'}
            </label>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Evidence</p>
              <p className="text-2xl font-bold text-gray-900">{evidence.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold">✓</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {evidence.filter(e => e.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 font-bold">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {evidence.filter(e => e.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold">✗</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">
                {evidence.filter(e => e.status === 'rejected').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Evidence List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Evidence Items</h2>
        </div>

        {filteredEvidence.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No evidence found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Upload your first piece of evidence to get started'}
            </p>
            {!searchTerm && filterType === 'all' && filterStatus === 'all' && (
              <label
                htmlFor="file-upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
              >
                <Plus className="w-5 h-5" />
                Upload Evidence
              </label>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredEvidence.map((item) => (
              <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getTypeIcon(item.type)}</span>
                      <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-2">{item.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Control: {item.controlId}</span>
                      <span>Type: {item.type}</span>
                      {item.fileSize && <span>Size: {formatFileSize(item.fileSize)}</span>}
                      <span>Uploaded: {item.uploadedAt.toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEvidenceSelect?.(item)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Download"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EvidenceCollectionDashboard;