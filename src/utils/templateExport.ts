import { enhancedDocumentGenerator } from './enhancedDocumentGenerator';
import { logger } from '../utils/logger';

export interface ExportOptions {
  filename?: string;
  includeMetadata?: boolean;
  includeTableOfContents?: boolean;
  includePageNumbers?: boolean;
  customStyling?: boolean;
  watermark?: string;
}

/**
 * Export content to Markdown format
 */
export function exportMarkdown(content: string, filename: string = 'document.md', options: ExportOptions = {}): void {
  try {
    const metadata = {
      title: filename.replace('.md', ''),
      author: 'Document Author',
      organization: 'Organization',
      version: '1.0',
      generatedDate: new Date(),
      templateUsed: 'Custom Template',
      customizations: {}
    };

    const markdown = enhancedDocumentGenerator.exportToMarkdown(content, metadata, {
      format: 'markdown',
      includeMetadata: options.includeMetadata,
      includeTableOfContents: options.includeTableOfContents,
      watermark: options.watermark
    });

    downloadContent(markdown, filename, 'text/markdown');
  } catch (error) {
    logger.error('Error exporting to Markdown:', error);
    throw error;
  }
}

/**
 * Export content to HTML format
 */
export function exportHTML(content: string, filename: string = 'document.html', options: ExportOptions = {}): void {
  try {
    const metadata = {
      title: filename.replace('.html', ''),
      author: 'Document Author',
      organization: 'Organization',
      version: '1.0',
      generatedDate: new Date(),
      templateUsed: 'Custom Template',
      customizations: {}
    };

    const html = enhancedDocumentGenerator.exportToHTML(content, metadata, {
      format: 'html',
      includeMetadata: options.includeMetadata,
      includeTableOfContents: options.includeTableOfContents,
      includePageNumbers: options.includePageNumbers,
      customStyling: options.customStyling,
      watermark: options.watermark
    });

    downloadContent(html, filename, 'text/html');
  } catch (error) {
    logger.error('Error exporting to HTML:', error);
    throw error;
  }
}

/**
 * Export content to PDF format
 */
export async function exportPDF(content: string, filename: string = 'document.pdf', options: ExportOptions = {}): Promise<void> {
  try {
    const metadata = {
      title: filename.replace('.pdf', ''),
      author: 'Document Author',
      organization: 'Organization',
      version: '1.0',
      generatedDate: new Date(),
      templateUsed: 'Custom Template',
      customizations: {}
    };

    const pdfBlob = await enhancedDocumentGenerator.exportToPDF(content, metadata, {
      format: 'pdf',
      includeMetadata: options.includeMetadata,
      includeTableOfContents: options.includeTableOfContents,
      includePageNumbers: options.includePageNumbers,
      customStyling: options.customStyling,
      watermark: options.watermark
    });

    downloadBlob(pdfBlob, filename, 'application/pdf');
  } catch (error) {
    logger.error('Error exporting to PDF:', error);
    throw error;
  }
}

/**
 * Export content to DOCX format
 */
export async function exportDOCX(content: string, filename: string = 'document.docx', options: ExportOptions = {}): Promise<void> {
  try {
    const metadata = {
      title: filename.replace('.docx', ''),
      author: 'Document Author',
      organization: 'Organization',
      version: '1.0',
      generatedDate: new Date(),
      templateUsed: 'Custom Template',
      customizations: {}
    };

    const docxBlob = await enhancedDocumentGenerator.exportToDOCX(content, metadata, {
      format: 'docx',
      includeMetadata: options.includeMetadata,
      includeTableOfContents: options.includeTableOfContents,
      includePageNumbers: options.includePageNumbers,
      customStyling: options.customStyling,
      watermark: options.watermark
    });

    downloadBlob(docxBlob, filename, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  } catch (error) {
    logger.error('Error exporting to DOCX:', error);
    throw error;
  }
}

/**
 * Export template content with customizations
 */
export async function exportTemplate(
  templateId: string,
  customizations: any,
  format: 'markdown' | 'html' | 'pdf' | 'docx',
  filename?: string,
  options: ExportOptions = {}
): Promise<void> {
  try {
    const content = enhancedDocumentGenerator.generateFromTemplate(templateId, customizations, { format });
    
    const defaultFilename = `${templateId}-${new Date().toISOString().split('T')[0]}.${format}`;
    const finalFilename = filename || defaultFilename;

    switch (format) {
      case 'markdown':
        exportMarkdown(content as string, finalFilename, options);
        break;
      case 'html':
        exportHTML(content as string, finalFilename, options);
        break;
      case 'pdf':
        await exportPDF(content as string, finalFilename, options);
        break;
      case 'docx':
        await exportDOCX(content as string, finalFilename, options);
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  } catch (error) {
    logger.error('Error exporting template:', error);
    throw error;
  }
}

/**
 * Batch export multiple templates
 */
export async function batchExportTemplates(
  templates: Array<{
    templateId: string;
    customizations: any;
    format: 'markdown' | 'html' | 'pdf' | 'docx';
    filename?: string;
    options?: ExportOptions;
  }>
): Promise<void> {
  try {
    const exportPromises = templates.map(template => 
      exportTemplate(
        template.templateId,
        template.customizations,
        template.format,
        template.filename,
        template.options
      )
    );

    await Promise.all(exportPromises);
  } catch (error) {
    logger.error('Error in batch export:', error);
    throw error;
  }
}

/**
 * Generate export preview
 */
export function generateExportPreview(
  content: string,
  format: 'markdown' | 'html' | 'pdf' | 'docx',
  options: ExportOptions = {}
): string {
  try {
    const metadata = {
      title: 'Document Preview',
      author: 'Document Author',
      organization: 'Organization',
      version: '1.0',
      generatedDate: new Date(),
      templateUsed: 'Custom Template',
      customizations: {}
    };

    switch (format) {
      case 'markdown':
        return enhancedDocumentGenerator.exportToMarkdown(content, metadata, {
          format: 'markdown',
          includeMetadata: options.includeMetadata,
          includeTableOfContents: options.includeTableOfContents,
          watermark: options.watermark
        });
      case 'html':
        return enhancedDocumentGenerator.exportToHTML(content, metadata, {
          format: 'html',
          includeMetadata: options.includeMetadata,
          includeTableOfContents: options.includeTableOfContents,
          includePageNumbers: options.includePageNumbers,
          customStyling: options.customStyling,
          watermark: options.watermark
        });
      default:
        return content;
    }
  } catch (error) {
    logger.error('Error generating export preview:', error);
    return content;
  }
}

/**
 * Download content as file
 */
function downloadContent(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  downloadBlob(blob, filename, mimeType);
}

/**
 * Download blob as file
 */
function downloadBlob(blob: Blob, filename: string, mimeType: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Get supported export formats
 */
export function getSupportedFormats(): Array<{
  format: 'markdown' | 'html' | 'pdf' | 'docx';
  label: string;
  description: string;
  mimeType: string;
  extension: string;
}> {
  return [
    {
      format: 'markdown',
      label: 'Markdown',
      description: 'Plain text format with markdown syntax',
      mimeType: 'text/markdown',
      extension: '.md'
    },
    {
      format: 'html',
      label: 'HTML',
      description: 'Web page format with styling',
      mimeType: 'text/html',
      extension: '.html'
    },
    {
      format: 'pdf',
      label: 'PDF',
      description: 'Portable Document Format',
      mimeType: 'application/pdf',
      extension: '.pdf'
    },
    {
      format: 'docx',
      label: 'Word Document',
      description: 'Microsoft Word document format',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      extension: '.docx'
    }
  ];
}

/**
 * Validate export options
 */
export function validateExportOptions(options: ExportOptions): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (options.filename && !options.filename.match(/^[a-zA-Z0-9._-]+$/)) {
    errors.push('Filename contains invalid characters');
  }

  if (options.watermark && options.watermark.length > 100) {
    errors.push('Watermark text is too long (max 100 characters)');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Get file size estimate for export
 */
export function getFileSizeEstimate(content: string, format: 'markdown' | 'html' | 'pdf' | 'docx'): number {
  const baseSize = new Blob([content]).size;
  
  switch (format) {
    case 'markdown':
      return baseSize;
    case 'html':
      return baseSize * 1.5; // HTML includes styling
    case 'pdf':
      return baseSize * 2; // PDF includes formatting overhead
    case 'docx':
      return baseSize * 3; // DOCX includes document structure
    default:
      return baseSize;
  }
}
