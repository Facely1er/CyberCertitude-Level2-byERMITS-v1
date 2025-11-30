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
                <strong>Author</strong>
                <span>${metadata.author}</span>
            </div>
            <div class="metadata-item">
                <strong>Organization</strong>
                <span>${metadata.organization}</span>
            </div>
            <div class="metadata-item">
                <strong>Version</strong>
                <span>${metadata.version}</span>
            </div>
            <div class="metadata-item">
                <strong>Generated</strong>
                <span>${metadata.generatedDate.toLocaleDateString()}</span>
            </div>
            <div class="metadata-item">
                <strong>Template</strong>
                <span>${metadata.templateUsed}</span>
            </div>
        </div>
    </div>
    `;
  }

  private getHTMLStyles(options: DocumentGenerationOptions): string {
    return `
        * {
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.7;
            color: #1a202c;
            max-width: 960px;
            margin: 0 auto;
            padding: 40px 24px;
            background: #ffffff;
        }
        
        .document-metadata {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 32px;
            border-radius: 12px;
            margin-bottom: 32px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .document-metadata h1 {
            margin: 0 0 16px 0;
            font-size: 2.25rem;
            font-weight: 700;
            color: white;
        }
        
        .metadata-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 12px;
            margin-top: 20px;
        }
        
        .metadata-item {
            background: rgba(255, 255, 255, 0.15);
            padding: 12px 16px;
            border-radius: 8px;
            backdrop-filter: blur(10px);
        }
        
        .metadata-item strong {
            display: block;
            font-size: 0.875rem;
            opacity: 0.9;
            margin-bottom: 6px;
            font-weight: 500;
        }
        
        .metadata-item span {
            display: block;
            font-size: 0.95rem;
            font-weight: 500;
        }
        
        .table-of-contents {
            background: linear-gradient(to right, #f8fafc, #e0e7ff);
            border-left: 4px solid #667eea;
            border-radius: 8px;
            padding: 24px;
            margin: 32px 0;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .table-of-contents h2 {
            margin-top: 0;
            color: #1e293b;
            font-size: 1.125rem;
            font-weight: 600;
        }
        
        .table-of-contents ul {
            list-style: none;
            padding-left: 0;
        }
        
        .table-of-contents li {
            padding: 6px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .table-of-contents li:last-child {
            border-bottom: none;
        }
        
        .content {
            margin-top: 24px;
        }
        
        h1, h2, h3, h4, h5, h6 {
            color: #0f172a;
            margin-top: 32px;
            margin-bottom: 16px;
            font-weight: 700;
            line-height: 1.3;
        }
        
        h1 { 
            font-size: 2.25rem;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
            margin-top: 0;
        }
        
        h2 { 
            font-size: 1.75rem;
            border-bottom: 2px solid #cbd5e1;
            padding-bottom: 8px;
        }
        
        h3 { 
            font-size: 1.375rem;
            color: #334155;
        }
        
        h4 {
            font-size: 1.125rem;
            color: #475569;
        }
        
        p {
            margin-bottom: 18px;
            color: #334155;
        }
        
        strong {
            color: #0f172a;
            font-weight: 600;
        }
        
        em {
            color: #475569;
        }
        
        code {
            background: #f1f5f9;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            color: #dc2626;
        }
        
        pre {
            background: #1e293b;
            color: #e2e8f0;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 20px 0;
        }
        
        pre code {
            background: transparent;
            color: inherit;
        }
        
        ul, ol {
            margin-bottom: 18px;
            padding-left: 32px;
        }
        
        li {
            margin-bottom: 8px;
            line-height: 1.6;
        }
        
        ul li {
            list-style-type: disc;
        }
        
        ol li {
            list-style-type: decimal;
        }
        
        blockquote {
            border-left: 4px solid #667eea;
            padding: 16px 20px;
            margin: 24px 0;
            background: #f8fafc;
            border-radius: 0 8px 8px 0;
            color: #475569;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 24px 0;
            background: white;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
        }
        
        th, td {
            border: 1px solid #e2e8f0;
            padding: 14px 16px;
            text-align: left;
        }
        
        th {
            background: linear-gradient(to bottom, #667eea, #764ba2);
            color: white;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.875rem;
            letter-spacing: 0.5px;
        }
        
        tr:nth-child(even) {
            background: #f8fafc;
        }
        
        tr:hover {
            background: #f1f5f9;
        }
        
        hr {
            border: none;
            border-top: 2px solid #e5e7eb;
            margin: 32px 0;
        }
        
        a {
            color: #667eea;
            text-decoration: none;
            border-bottom: 1px solid transparent;
            transition: border-color 0.2s;
        }
        
        a:hover {
            border-bottom-color: #667eea;
        }
        
        .watermark {
            position: fixed;
            bottom: 20px;
            right: 20px;
            opacity: 0.15;
            font-size: 11px;
            color: #6b7280;
            font-weight: 500;
        }
        
        .page-numbers {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 11px;
            color: #6b7280;
            font-weight: 500;
        }
        
        .highlight-box {
            background: linear-gradient(135deg, #fef3c7, #fde68a);
            border-left: 4px solid #f59e0b;
            padding: 16px 20px;
            margin: 24px 0;
            border-radius: 0 8px 8px 0;
        }
        
        .info-box {
            background: linear-gradient(135deg, #dbeafe, #bfdbfe);
            border-left: 4px solid #3b82f6;
            padding: 16px 20px;
            margin: 24px 0;
            border-radius: 0 8px 8px 0;
        }
        
        .warning-box {
            background: linear-gradient(135deg, #fef2f2, #fee2e2);
            border-left: 4px solid #ef4444;
            padding: 16px 20px;
            margin: 24px 0;
            border-radius: 0 8px 8px 0;
        }
        
        .success-box {
            background: linear-gradient(135deg, #dcfce7, #bbf7d0);
            border-left: 4px solid #22c55e;
            padding: 16px 20px;
            margin: 24px 0;
            border-radius: 0 8px 8px 0;
        }
        
        @media print {
            body {
                margin: 0;
                padding: 15mm;
                max-width: 100%;
            }
            
            .document-metadata {
                page-break-inside: avoid;
            }
            
            h1, h2, h3 {
                page-break-after: avoid;
            }
            
            table {
                page-break-inside: avoid;
            }
            
            .watermark, .page-numbers {
                position: fixed;
            }
        }
    `;
  }

  private markdownToHTML(markdown: string): string {
    // Enhanced markdown to HTML conversion with better formatting
    let html = markdown;
    
    // Handle code blocks (must be before other replacements)
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // Handle inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Handle headers
    html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
    html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Handle bold and italic
    html = html.replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    
    // Handle horizontal rules
    html = html.replace(/^---$/gim, '<hr>');
    html = html.replace(/^\*\*\*$/gim, '<hr>');
    
    // Handle blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
    
    // Handle lists
    html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
    
    // Wrap consecutive list items in ul/ol
    html = html.replace(/(<li>.*<\/li>)/gims, (match) => {
      // Check if it's an ordered list (number pattern)
      if (/^<li>.*<\/li>$/.test(match)) {
        return '<ul>' + match + '</ul>';
      }
      return match;
    });
    
    // Handle tables (basic)
    html = html.replace(/^\|(.+)\|$/gim, '<tr>' + 
      '<td>' + '$1'.split('|').slice(1, -1).join('</td><td>') + '</td>' + 
    '</tr>');
    
    // Handle emphasis
    html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>');
    
    // Handle links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    
    // Convert line breaks
    html = html.replace(/\n\n\n/g, '</p><p>');
    html = html.replace(/\n\n/g, '</p><p>');
    
    // Wrap remaining content in paragraphs (but not already wrapped content)
    if (!html.includes('</p>') && !html.includes('</h')) {
      html = '<p>' + html + '</p>';
    }
    
    // Clean up empty paragraphs and extra breaks
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/(<\/p>)\n*(<p>)/g, '$1$2');
    
    return html;
  }
}

export const enhancedDocumentGenerator = EnhancedDocumentGenerator.getInstance();
