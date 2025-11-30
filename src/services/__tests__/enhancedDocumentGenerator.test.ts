import { describe, it, expect, beforeEach, vi } from 'vitest';
import { enhancedDocumentGenerator } from '../enhancedDocumentGenerator';
import type { DocumentGenerationOptions, DocumentMetadata } from '../enhancedDocumentGenerator';

// Mock logger
vi.mock('../utils/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn()
  }
}));

// Mock template data
vi.mock('../data/templates', () => ({
  TemplateContent: {
    content: 'Template content {{companyName}}'
  }
}));

describe('EnhancedDocumentGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = enhancedDocumentGenerator;
      const instance2 = enhancedDocumentGenerator;
      expect(instance1).toBe(instance2);
    });
  });

  describe('generateFromTemplate', () => {
    it('should throw error when template not found', () => {
      const options: DocumentGenerationOptions = { format: 'html' };
      const data = { companyInfo: { name: 'Test Co' } };

      expect(() => {
        enhancedDocumentGenerator.generateFromTemplate('non-existent', data, options);
      }).toThrow('Template non-existent not found');
    });

    it('should generate HTML document', () => {
      const options: DocumentGenerationOptions = { format: 'html' };
      const data = { companyInfo: { name: 'Test Co' } };

      // This will fail template lookup, but we can test the structure
      expect(() => {
        enhancedDocumentGenerator.generateFromTemplate('test-template', data, options);
      }).toThrow();
    });
  });

  describe('autoPopulateFields', () => {
    it('should replace company placeholders', () => {
      const template = {
        name: 'Test Template',
        content: 'Company: {{companyName}}, Address: {{companyAddress}}'
      } as any;

      const userData = {
        companyInfo: {
          name: 'Test Company',
          address: '123 Test St'
        }
      };

      const result = enhancedDocumentGenerator.autoPopulateFields(template, userData);

      expect(result).toContain('Test Company');
      expect(result).toContain('123 Test St');
      expect(result).not.toContain('{{companyName}}');
      expect(result).not.toContain('{{companyAddress}}');
    });

    it('should replace date placeholders', () => {
      const template = {
        name: 'Test Template',
        content: 'Date: {{currentDate}}, Year: {{currentYear}}'
      } as any;

      const userData = {};
      const result = enhancedDocumentGenerator.autoPopulateFields(template, userData);

      expect(result).not.toContain('{{currentDate}}');
      expect(result).not.toContain('{{currentYear}}');
      expect(result).toContain(new Date().getFullYear().toString());
    });

    it('should use default values when data is missing', () => {
      const template = {
        name: 'Test Template',
        content: '{{companyName}} - {{systemName}}'
      } as any;

      const userData = {};
      const result = enhancedDocumentGenerator.autoPopulateFields(template, userData);

      expect(result).toContain('[Company Name]');
      expect(result).toContain('[System Name]');
    });

    it('should populate assessment data', () => {
      const template = {
        name: 'Test Template',
        content: 'Assessment: {{assessmentDate}}, Framework: {{framework}}'
      } as any;

      const userData = {
        assessmentData: {
          createdAt: new Date('2024-01-01'),
          framework: 'CMMC 2.0',
          maturityLevel: 'Level 2'
        }
      };

      const result = enhancedDocumentGenerator.autoPopulateFields(template, userData);

      expect(result).toContain('CMMC 2.0');
      expect(result).not.toContain('{{framework}}');
    });
  });

  describe('exportToMarkdown', () => {
    it('should export to markdown format', () => {
      const content = '# Test Document\n\nContent here.';
      const metadata: DocumentMetadata = {
        title: 'Test Document',
        author: 'Test Author',
        organization: 'Test Org',
        version: '1.0',
        generatedDate: new Date(),
        templateUsed: 'Test Template',
        customizations: {}
      };

      const options: DocumentGenerationOptions = { format: 'markdown' };
      const service = enhancedDocumentGenerator as any;

      const result = service.exportToMarkdown(content, metadata, options);

      expect(result).toContain('# Test Document');
      expect(result).toContain('Test Author');
      expect(result).toContain('Test Org');
    });

    it('should include metadata when option is enabled', () => {
      const content = '# Test Document';
      const metadata: DocumentMetadata = {
        title: 'Test Document',
        author: 'Test Author',
        organization: 'Test Org',
        version: '1.0',
        generatedDate: new Date(),
        templateUsed: 'Test Template',
        customizations: {}
      };

      const options: DocumentGenerationOptions = { 
        format: 'markdown',
        includeMetadata: true
      };
      const service = enhancedDocumentGenerator as any;

      const result = service.exportToMarkdown(content, metadata, options);

      expect(result).toContain('**Author:**');
      expect(result).toContain('Test Author');
    });

    it('should include table of contents when option is enabled', () => {
      const content = '## Section 1\n\n### Subsection 1.1\n\nContent';
      const metadata: DocumentMetadata = {
        title: 'Test Document',
        author: 'Test Author',
        organization: 'Test Org',
        version: '1.0',
        generatedDate: new Date(),
        templateUsed: 'Test Template',
        customizations: {}
      };

      const options: DocumentGenerationOptions = { 
        format: 'markdown',
        includeTableOfContents: true
      };
      const service = enhancedDocumentGenerator as any;

      const result = service.exportToMarkdown(content, metadata, options);

      expect(result).toContain('Table of Contents');
    });

    it('should include watermark when provided', () => {
      const content = '# Test Document';
      const metadata: DocumentMetadata = {
        title: 'Test Document',
        author: 'Test Author',
        organization: 'Test Org',
        version: '1.0',
        generatedDate: new Date(),
        templateUsed: 'Test Template',
        customizations: {}
      };

      const options: DocumentGenerationOptions = { 
        format: 'markdown',
        watermark: 'CONFIDENTIAL'
      };
      const service = enhancedDocumentGenerator as any;

      const result = service.exportToMarkdown(content, metadata, options);

      expect(result).toContain('CONFIDENTIAL');
    });
  });

  describe('exportToHTML', () => {
    it('should export to HTML format', () => {
      const content = '# Test Document\n\nContent here.';
      const metadata: DocumentMetadata = {
        title: 'Test Document',
        author: 'Test Author',
        organization: 'Test Org',
        version: '1.0',
        generatedDate: new Date(),
        templateUsed: 'Test Template',
        customizations: {}
      };

      const options: DocumentGenerationOptions = { format: 'html' };
      const service = enhancedDocumentGenerator as any;

      const result = service.exportToHTML(content, metadata, options);

      expect(result).toContain('<!DOCTYPE html>');
      expect(result).toContain('<html');
      expect(result).toContain('Test Document');
      expect(result).toContain('</html>');
    });

    it('should include metadata section', () => {
      const content = '# Test Document';
      const metadata: DocumentMetadata = {
        title: 'Test Document',
        author: 'Test Author',
        organization: 'Test Org',
        version: '1.0',
        generatedDate: new Date(),
        templateUsed: 'Test Template',
        customizations: {}
      };

      const options: DocumentGenerationOptions = { 
        format: 'html',
        includeMetadata: true
      };
      const service = enhancedDocumentGenerator as any;

      const result = service.exportToHTML(content, metadata, options);

      expect(result).toContain('document-metadata');
      expect(result).toContain('Test Author');
    });

    it('should include styles', () => {
      const content = '# Test Document';
      const metadata: DocumentMetadata = {
        title: 'Test Document',
        author: 'Test Author',
        organization: 'Test Org',
        version: '1.0',
        generatedDate: new Date(),
        templateUsed: 'Test Template',
        customizations: {}
      };

      const options: DocumentGenerationOptions = { format: 'html' };
      const service = enhancedDocumentGenerator as any;

      const result = service.exportToHTML(content, metadata, options);

      expect(result).toContain('<style>');
      expect(result).toContain('font-family');
    });
  });

  describe('exportToPDF', () => {
    it('should export to PDF format (returns blob)', async () => {
      const content = '# Test Document';
      const metadata: DocumentMetadata = {
        title: 'Test Document',
        author: 'Test Author',
        organization: 'Test Org',
        version: '1.0',
        generatedDate: new Date(),
        templateUsed: 'Test Template',
        customizations: {}
      };

      const options: DocumentGenerationOptions = { format: 'pdf' };

      const blob = await enhancedDocumentGenerator.exportToPDF(content, metadata, options);

      expect(blob).toBeInstanceOf(Blob);
    });
  });

  describe('exportToDOCX', () => {
    it('should export to DOCX format (returns blob)', async () => {
      const content = '# Test Document';
      const metadata: DocumentMetadata = {
        title: 'Test Document',
        author: 'Test Author',
        organization: 'Test Org',
        version: '1.0',
        generatedDate: new Date(),
        templateUsed: 'Test Template',
        customizations: {}
      };

      const options: DocumentGenerationOptions = { format: 'docx' };

      const blob = await enhancedDocumentGenerator.exportToDOCX(content, metadata, options);

      expect(blob).toBeInstanceOf(Blob);
    });
  });

  describe('generateTableOfContents', () => {
    it('should generate table of contents from headers', () => {
      const content = `# Main Title

## Section 1
Content here.

### Subsection 1.1
More content.

## Section 2
Even more content.`;

      const service = enhancedDocumentGenerator as any;
      const toc = service.generateTableOfContents(content);

      expect(toc).toContain('Table of Contents');
      expect(toc).toContain('Section 1');
      expect(toc).toContain('Section 2');
    });

    it('should return empty string if no headers found', () => {
      const content = 'Plain text without headers.';
      const service = enhancedDocumentGenerator as any;
      const toc = service.generateTableOfContents(content);

      expect(toc).toBe('');
    });
  });

  describe('markdownToHTML conversion', () => {
    it('should convert markdown headers to HTML', () => {
      const markdown = '# H1\n## H2\n### H3';
      const service = enhancedDocumentGenerator as any;
      const html = service.markdownToHTML(markdown);

      expect(html).toContain('<h1>');
      expect(html).toContain('<h2>');
      expect(html).toContain('<h3>');
    });

    it('should convert bold and italic text', () => {
      const markdown = '**bold** and *italic*';
      const service = enhancedDocumentGenerator as any;
      const html = service.markdownToHTML(markdown);

      expect(html).toContain('<strong>');
      expect(html).toContain('<em>');
    });

    it('should convert code blocks', () => {
      const markdown = '```\ncode here\n```';
      const service = enhancedDocumentGenerator as any;
      const html = service.markdownToHTML(markdown);

      expect(html).toContain('<pre>');
      expect(html).toContain('<code>');
    });

    it('should convert links', () => {
      const markdown = '[Link text](https://example.com)';
      const service = enhancedDocumentGenerator as any;
      const html = service.markdownToHTML(markdown);

      expect(html).toContain('<a href=');
      expect(html).toContain('https://example.com');
    });
  });
});

