import React, { useState } from 'react';
import { X, Upload, Camera, FileText, Image, File, CheckCircle, AlertCircle, Database, Trash2 } from 'lucide-react';
import { ProgressTrackingService } from '../utils/progressTracking';
import { toastService } from '../utils/toastNotifications';

interface Control {
  id: string;
  name: string;
  description: string;
}

interface EvidenceCollectionProps {
  isOpen: boolean;
  onClose: () => void;
  onEvidenceAdded?: (evidence: any) => void;
  controls?: Control[];
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  preview?: string;
}

const EvidenceCollection: React.FC<EvidenceCollectionProps> = ({
  isOpen,
  onClose,
  onEvidenceAdded,
  controls = []
}) => {
  const [selectedControl, setSelectedControl] = useState<string>('');
  const [evidenceType, setEvidenceType] = useState<'policy' | 'screenshot' | 'log' | 'configuration' | 'test-result' | 'document'>('document');
  const [description, setDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const trackingService = ProgressTrackingService.getInstance();

  const evidenceTypes = [
    {
      type: 'policy' as const,
      label: 'Policy Document',
      icon: FileText,
      color: 'blue',
      description: 'Security policies, procedures, and guidelines'
    },
    {
      type: 'screenshot' as const,
      label: 'Screenshot',
      icon: Image,
      color: 'green',
      description: 'System configuration screenshots and interfaces'
    },
    {
      type: 'log' as const,
      label: 'Log File',
      icon: Database,
      color: 'purple',
      description: 'System logs, audit trails, and monitoring data'
    },
    {
      type: 'configuration' as const,
      label: 'Configuration',
      icon: File,
      color: 'orange',
      description: 'System configuration files and settings'
    },
    {
      type: 'test-result' as const,
      label: 'Test Result',
      icon: CheckCircle,
      color: 'red',
      description: 'Security test results and vulnerability assessments'
    },
    {
      type: 'document' as const,
      label: 'Document',
      icon: FileText,
      color: 'gray',
      description: 'General compliance documentation'
    }
  ];

  const defaultControls: Control[] = [
    { id: 'AC.1.001', name: 'Access Control Policy', description: 'User access management procedures' },
    { id: 'AC.1.002', name: 'Account Management', description: 'User account lifecycle management' },
    { id: 'AU.1.076', name: 'Audit Logging', description: 'System activity logging and monitoring' },
    { id: 'AT.2.056', name: 'Security Training', description: 'Security awareness and training program' },
    { id: 'CM.2.061', name: 'Configuration Management', description: 'System configuration control' },
    { id: 'IA.2.081', name: 'Authentication', description: 'User identification and authentication' },
    { id: 'IR.1.076', name: 'Incident Response', description: 'Security incident handling procedures' },
    { id: 'SC.1.175', name: 'Network Security', description: 'Network protection and monitoring' }
  ];

  const availableControls = controls.length > 0 ? controls : defaultControls;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      const newFiles: UploadedFile[] = Array.from(files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      }));

      setUploadedFiles(prev => [...prev, ...newFiles]);
      setIsUploading(false);
      
      toastService.success(
        'Files Uploaded',
        `${newFiles.length} file(s) uploaded successfully`
      );
    }, 1000);
  };

  const handleCameraCapture = () => {
    // Simulate camera capture
    setIsUploading(true);
    
    setTimeout(() => {
      const cameraFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: `camera_capture_${new Date().toISOString().split('T')[0]}.jpg`,
        size: 1024000, // 1MB
        type: 'image/jpeg',
        preview: '/cybercertitude.png' // Mock preview
      };

      setUploadedFiles(prev => [...prev, cameraFile]);
      setIsUploading(false);
      
      toastService.success(
        'Photo Captured',
        'Photo captured successfully'
      );
    }, 1500);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleSubmitEvidence = () => {
    if (!selectedControl || uploadedFiles.length === 0) {
      toastService.warning(
        'Missing Information',
        'Please select a control and upload at least one file'
      );
      return;
    }

    const control = availableControls.find(c => c.id === selectedControl);
    if (!control) return;

    // Add evidence to tracking service
    uploadedFiles.forEach(file => {
      trackingService.addEvidence(
        `${selectedControl}_template`,
        selectedControl,
        evidenceType,
        file.name,
        description || `Evidence for ${control.name}`
      );
    });

    const evidenceData = {
      controlId: selectedControl,
      controlName: control.name,
      evidenceType,
      description,
      files: uploadedFiles,
      submittedAt: new Date()
    };

    if (onEvidenceAdded) {
      onEvidenceAdded(evidenceData);
    }

    toastService.success(
      'Evidence Submitted',
      `Evidence for ${control.name} has been submitted successfully`
    );

    // Reset form
    setSelectedControl('');
    setEvidenceType('document');
    setDescription('');
    setUploadedFiles([]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface-light rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Evidence Collection</h2>
              <p className="text-primary-100 mt-1">Submit evidence for CMMC controls</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-text-primary-light transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Form */}
            <div className="space-y-6">
              {/* Control Selection */}
              <div>
                <label className="block text-sm font-medium text-text-primary-light mb-2">
                  Select Control *
                </label>
                <select
                  value={selectedControl}
                  onChange={(e) => setSelectedControl(e.target.value)}
                  className="w-full px-3 py-2 border border-support-light rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Choose a control...</option>
                  {availableControls.map(control => (
                    <option key={control.id} value={control.id}>
                      {control.id} - {control.name}
                    </option>
                  ))}
                </select>
                {selectedControl && (
                  <p className="text-sm text-text-secondary-light mt-2">
                    {availableControls.find(c => c.id === selectedControl)?.description}
                  </p>
                )}
              </div>

              {/* Evidence Type */}
              <div>
                <label className="block text-sm font-medium text-text-primary-light mb-2">
                  Evidence Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {evidenceTypes.map(type => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.type}
                        onClick={() => setEvidenceType(type.type)}
                        className={`p-3 border-2 rounded-lg text-left transition-all ${
                          evidenceType === type.type
                            ? `border-${type.color}-500 bg-${type.color}-50`
                            : 'border-support-light hover:border-support-light'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mb-2 text-${type.color}-600`} />
                        <div className="text-sm font-medium text-text-primary-light">{type.label}</div>
                        <div className="text-xs text-text-secondary-light">{type.description}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-text-primary-light mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the evidence being submitted..."
                  className="w-full px-3 py-2 border border-support-light rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  rows={3}
                />
              </div>
            </div>

            {/* Right Column - File Upload */}
            <div className="space-y-6">
              {/* Upload Area */}
              <div>
                <label className="block text-sm font-medium text-text-primary-light mb-2">
                  Upload Files *
                </label>
                <div className="border-2 border-dashed border-support-light rounded-lg p-6 text-center hover:border-support-light transition-colors">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.xlsx,.xls,.csv"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-text-muted-dark mx-auto mb-4" />
                    <div className="text-lg font-medium text-text-secondary-light mb-2">
                      Click to upload files
                    </div>
                    <div className="text-sm text-text-muted-light">
                      PDF, DOC, DOCX, TXT, JPG, PNG, XLSX, CSV
                    </div>
                  </label>
                </div>

                {/* Camera Capture */}
                <div className="mt-4">
                  <button
                    onClick={handleCameraCapture}
                    disabled={isUploading}
                    className="w-full px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 transition flex items-center justify-center disabled:opacity-50"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {isUploading ? 'Capturing...' : 'Take Photo'}
                  </button>
                </div>
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-text-primary-light mb-3">
                    Uploaded Files ({uploadedFiles.length})
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {uploadedFiles.map(file => (
                      <div key={file.id} className="flex items-center p-3 bg-background-light rounded-lg">
                        <div className="flex-shrink-0 mr-3">
                          {file.preview ? (
                            <img src={file.preview} alt="Preview" className="w-8 h-8 object-cover rounded" />
                          ) : (
                            <File className="w-8 h-8 text-text-muted-dark" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-text-primary-light truncate">
                            {file.name}
                          </div>
                          <div className="text-xs text-text-muted-light">
                            {formatFileSize(file.size)} • {file.type}
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="flex-shrink-0 ml-2 text-error-500 hover:text-error-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-background-light px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-text-secondary-light hover:text-text-primary-light transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitEvidence}
            disabled={!selectedControl || uploadedFiles.length === 0}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Submit Evidence
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvidenceCollection;
