import { TemplateContent } from '../data/templates';
import { logger } from '../utils/logger';

export interface DocumentGenerationOptions {
  format: 'markdown' | 'html' | 'pdf' | 'docx';
  includeMetadata?: boolean;
  includeTableOfContents?: boolean;
  includePageNumbers?: boolean;
  customStyling?: boolean;
  watermark?: string;
}

export interface DocumentMetadata {
  title: string;
  author: string;
  organization: string;
  version: string;
  generatedDate: Date;
  templateUsed: string;
  customizations: Record<string, any>;
}

export class EnhancedDocumentGenerator {
  private static instance: EnhancedDocumentGenerator;

  static getInstance(): EnhancedDocumentGenerator {
    if (!EnhancedDocumentGenerator.instance) {
      EnhancedDocumentGenerator.instance = new EnhancedDocumentGenerator();
    }
    return EnhancedDocumentGenerator.instance;
  }

  /**
   * Generate document from template with auto-population
   */
  generateFromTemplate(templateId: string, data: any, options: DocumentGenerationOptions = { format: 'html' }): string {
    try {
      // This would integrate with templateService to get the template and customize it
      const template = this.getTemplateById(templateId);
      if (!template) {
        throw new Error(`Template ${templateId} not found`);
      }

      const customizedContent = this.customizeTemplate(template, data);
      const metadata = this.generateMetadata(template, data);
      
      switch (options.format) {
        case 'markdown':
          return this.exportToMarkdown(customizedContent, metadata, options);
        case 'html':
          return this.exportToHTML(customizedContent, metadata, options);
        case 'pdf':
          return this.exportToPDF(customizedContent, metadata, options);
        case 'docx':
          return this.exportToDOCX(customizedContent, metadata, options);
        default:
          throw new Error(`Unsupported format: ${options.format}`);
      }
    } catch (error) {
      logger.error('Error generating document from template:', error);
      throw error;
    }
  }

  /**
   * Auto-populate fields from user data
   */
  autoPopulateFields(template: TemplateContent, userData: any): string {
    try {
      let content = template.content;

      // Replace common placeholders
      const replacements = {
        '{{companyName}}': userData.companyInfo?.name || '[Company Name]',
        '{{companyAddress}}': userData.companyInfo?.address || '[Company Address]',
        '{{companyContact}}': userData.companyInfo?.contact || '[Company Contact]',
        '{{systemName}}': userData.systemInfo?.name || '[System Name]',
        '{{systemDescription}}': userData.systemInfo?.description || '[System Description]',
        '{{currentDate}}': new Date().toLocaleDateString(),
        '{{currentYear}}': new Date().getFullYear().toString(),
        '{{organizationSize}}': userData.companyInfo?.size || '[Organization Size]',
        '{{industry}}': userData.companyInfo?.industry || '[Industry]',
        '{{complianceOfficer}}': userData.companyInfo?.complianceOfficer || '[Compliance Officer]',
        '{{ciso}}': userData.companyInfo?.ciso || '[CISO]',
        '{{itManager}}': userData.companyInfo?.itManager || '[IT Manager]'
      };

      // Apply replacements
      Object.entries(replacements).forEach(([placeholder, value]) => {
        content = content.replace(new RegExp(placeholder, 'g'), value);
      });

      // Handle dynamic content based on assessment data
      if (userData.assessmentData) {
        content = this.populateAssessmentData(content, userData.assessmentData);
      }

      return content;
    } catch (error) {
      logger.error('Error auto-populating template fields:', error);
      return template.content;
    }
  }

  /**
   * Export to Markdown format
   */
  exportToMarkdown(content: string, metadata: DocumentMetadata, options: DocumentGenerationOptions): string {
    let markdown = '';

    if (options.includeMetadata) {
      markdown += `# ${metadata.title}\n\n`;
      markdown += `**Author:** ${metadata.author}\n`;
      markdown += `**Organization:** ${metadata.organization}\n`;
      markdown += `**Version:** ${metadata.version}\n`;
      markdown += `**Generated:** ${metadata.generatedDate.toLocaleDateString()}\n`;
      markdown += `**Template:** ${metadata.templateUsed}\n\n`;
      markdown += '---\n\n';
    }

    if (options.includeTableOfContents) {
      markdown += this.generateTableOfContents(content) + '\n\n';
    }

    markdown += content;

    if (options.watermark) {
      markdown += `\n\n---\n*${options.watermark}*\n`;
    }

    return markdown;
  }

  /**
   * Export to HTML format
   */
  exportToHTML(content: string, metadata: DocumentMetadata, options: DocumentGenerationOptions): string {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metadata.title}</title>
    <style>
        ${this.getHTMLStyles(options)}
    </style>
</head>
<body>
    ${options.includeMetadata ? this.generateHTMLMetadata(metadata) : ''}
    ${options.includeTableOfContents ? this.generateHTMLTableOfContents(content) : ''}
    <div class="content">
        ${this.markdownToHTML(content)}
    </div>
    ${options.watermark ? `<div class="watermark">${options.watermark}</div>` : ''}
    ${options.includePageNumbers ? '<div class="page-numbers"></div>' : ''}
</body>
</html>`;

    return html;
  }

  /**
   * Export to PDF format
   */
  async exportToPDF(content: string, metadata: DocumentMetadata, options: DocumentGenerationOptions): Promise<Blob> {
    try {
      const html = this.exportToHTML(content, metadata, { ...options, format: 'html' });
      
      // This would use a PDF generation library like jsPDF or Puppeteer
      // For now, return a placeholder
      const blob = new Blob([html], { type: 'text/html' });
      return blob;
    } catch (error) {
      logger.error('Error generating PDF:', error);
      throw error;
    }
  }

  /**
   * Export to DOCX format
   */
  async exportToDOCX(content: string, metadata: DocumentMetadata, options: DocumentGenerationOptions): Promise<Blob> {
    try {
      // This would use a DOCX generation library like docx
      // For now, return a placeholder
      const blob = new Blob([content], { type: 'text/plain' });
      return blob;
    } catch (error) {
      logger.error('Error generating DOCX:', error);
      throw error;
    }
  }

  private getTemplateById(templateId: string): TemplateContent | null {
    // This would integrate with templateService
    return null;
  }

  private customizeTemplate(template: TemplateContent, data: any): string {
    return this.autoPopulateFields(template, data);
  }

  private generateMetadata(template: TemplateContent, data: any): DocumentMetadata {
    return {
      title: template.name,
      author: data.companyInfo?.contact || 'Document Author',
      organization: data.companyInfo?.name || 'Organization',
      version: '1.0',
      generatedDate: new Date(),
      templateUsed: template.name,
      customizations: data
    };
  }

  private populateAssessmentData(content: string, assessmentData: any): string {
    // Add assessment-specific content population
    let populatedContent = content;

    // Replace assessment-specific placeholders
    const assessmentReplacements = {
      '{{assessmentDate}}': assessmentData.createdAt ? new Date(assessmentData.createdAt).toLocaleDateString() : '[Assessment Date]',
      '{{framework}}': assessmentData.framework || '[Framework]',
      '{{maturityLevel}}': assessmentData.maturityLevel || '[Maturity Level]',
      '{{totalControls}}': assessmentData.totalControls || '[Total Controls]',
      '{{implementedControls}}': assessmentData.implementedControls || '[Implemented Controls]'
    };

    Object.entries(assessmentReplacements).forEach(([placeholder, value]) => {
      populatedContent = populatedContent.replace(new RegExp(placeholder, 'g'), value);
    });

    return populatedContent;
  }

  private generateTableOfContents(content: string): string {
    const lines = content.split('\n');
    const toc: string[] = [];
    let tocLevel = 0;

    lines.forEach(line => {
      if (line.startsWith('## ')) {
        tocLevel = 1;
        const title = line.substring(3);
        toc.push(`${'  '.repeat(tocLevel - 1)}- [${title}](#${title.toLowerCase().replace(/\s+/g, '-')})`);
      } else if (line.startsWith('### ')) {
        tocLevel = 2;
        const title = line.substring(4);
        toc.push(`${'  '.repeat(tocLevel - 1)}- [${title}](#${title.toLowerCase().replace(/\s+/g, '-')})`);
      }
    });

    return toc.length > 0 ? `## Table of Contents\n\n${toc.join('\n')}` : '';
  }

  private generateHTMLTableOfContents(content: string): string {
    const toc = this.generateTableOfContents(content);
    return toc ? `<div class="table-of-contents">${this.markdownToHTML(toc)}</div>` : '';
  }

  private generateHTMLMetadata(metadata: DocumentMetadata): string {
    return `
    <div class="document-metadata">
        <h1>${metadata.title}</h1>
        <div class="metadata-grid">
            <div class="metadata-item">
                <strong>Author:</strong> ${metadata.author}
            </div>
            <div class="metadata-item">
                <strong>Organization:</strong> ${metadata.organization}
            </div>
            <div class="metadata-item">
                <strong>Version:</strong> ${metadata.version}
            </div>
            <div class="metadata-item">
                <strong>Generated:</strong> ${metadata.generatedDate.toLocaleDateString()}
            </div>
            <div class="metadata-item">
                <strong>Template:</strong> ${metadata.templateUsed}
            </div>
        </div>
    </div>
    `;
  }

  private getHTMLStyles(options: DocumentGenerationOptions): string {
    return `
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: white;
        }
        
        .document-metadata {
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .metadata-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
            margin-top: 15px;
        }
        
        .metadata-item {
            padding: 8px;
            background: #f9fafb;
            border-radius: 4px;
        }
        
        .table-of-contents {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
        }
        
        .content {
            margin-top: 20px;
        }
        
        h1, h2, h3, h4, h5, h6 {
            color: #1f2937;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        
        h1 { font-size: 2rem; }
        h2 { font-size: 1.5rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
        h3 { font-size: 1.25rem; }
        
        p {
            margin-bottom: 15px;
        }
        
        ul, ol {
            margin-bottom: 15px;
            padding-left: 25px;
        }
        
        li {
            margin-bottom: 5px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        
        th, td {
            border: 1px solid #d1d5db;
            padding: 12px;
            text-align: left;
        }
        
        th {
            background: #f3f4f6;
            font-weight: 600;
        }
        
        .watermark {
            position: fixed;
            bottom: 20px;
            right: 20px;
            opacity: 0.3;
            font-size: 12px;
            color: #6b7280;
        }
        
        .page-numbers {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 12px;
            color: #6b7280;
        }
        
        @media print {
            body {
                margin: 0;
                padding: 15mm;
            }
            
            .watermark, .page-numbers {
                position: fixed;
            }
        }
    `;
  }

  private markdownToHTML(markdown: string): string {
    // Basic markdown to HTML conversion
    let html = markdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
      .replace(/\n\n/gim, '</p><p>')
      .replace(/\n/gim, '<br>');

    // Wrap list items
    html = html.replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>');
    html = html.replace(/<\/ul><ul>/gim, '');

    // Wrap paragraphs
    html = '<p>' + html + '</p>';
    html = html.replace(/<p><\/p>/gim, '');

    return html;
  }
}

export const enhancedDocumentGenerator = EnhancedDocumentGenerator.getInstance();
