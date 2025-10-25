import React from 'react';
import { X, Download, FileText, File, FileSpreadsheet } from 'lucide-react';
import { TemplateData, DocumentFormat } from '../utils/downloadUtils';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: (format: DocumentFormat) => void;
  templateName: string;
  templateData: TemplateData;
  markdownContent: string;
  availableFormats: DocumentFormat[];
  isDownloading: boolean;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  onDownload,
  templateName,
  templateData,
  markdownContent,
  availableFormats,
  isDownloading
}) => {
  if (!isOpen) return null;

  const getFormatIcon = (format: DocumentFormat) => {
    switch (format) {
      case 'md': return FileText;
      case 'docx': return File;
      case 'pdf': return File;
      case 'xlsx': return FileSpreadsheet;
      default: return FileText;
    }
  };

  const getFormatColor = (format: DocumentFormat) => {
    switch (format) {
      case 'md': return 'text-gray-600';
      case 'docx': return 'text-blue-600';
      case 'pdf': return 'text-red-600';
      case 'xlsx': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{templateName}</h2>
              <p className="text-blue-100 mt-1">Document Preview</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Preview */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="prose max-w-none">
              <h1>{templateData.title}</h1>
              {templateData.subtitle && <h2>{templateData.subtitle}</h2>}
              {templateData.description && <p className="text-gray-600">{templateData.description}</p>}
              
              {templateData.controls && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-800 mb-2">CMMC Controls Covered:</h3>
                  <div className="flex flex-wrap gap-2">
                    {templateData.controls.map((control, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                        {control}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {templateData.includes && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-green-800 mb-2">Document Includes:</h3>
                  <ul className="list-disc list-inside text-green-700">
                    {templateData.includes.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="border-t pt-6">
                <h3>Document Content</h3>
                <div className="whitespace-pre-wrap text-sm text-gray-700">
                  {markdownContent}
                </div>
              </div>
            </div>
          </div>

          {/* Download Options */}
          <div className="w-80 border-l bg-gray-50 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Download Options</h3>
            <div className="space-y-3">
              {availableFormats.map(format => {
                const Icon = getFormatIcon(format);
                return (
                  <button
                    key={format}
                    onClick={() => onDownload(format)}
                    disabled={isDownloading}
                    className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center">
                      <Icon className={`w-5 h-5 mr-3 ${getFormatColor(format)}`} />
                      <span className="font-medium text-gray-900">
                        {format.toUpperCase()}
                      </span>
                    </div>
                    <Download className="w-4 h-4 text-gray-400" />
                  </button>
                );
              })}
            </div>

            {templateData.pages && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-800">
                  <strong>{templateData.pages} pages</strong> of comprehensive content
                </div>
              </div>
            )}

            <div className="mt-6 text-xs text-gray-500">
              <p>Generated by CyberCertitude™ CMMC 2.0 Toolkit by ERMITS</p>
              <p>Version: {templateData.version}</p>
              <p>Date: {templateData.date}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;
