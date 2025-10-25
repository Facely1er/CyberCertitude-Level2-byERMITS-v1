export type DocumentFormat = 'md' | 'docx' | 'pdf' | 'xlsx';

export interface TemplateData {
  title: string;
  subtitle?: string;
  version: string;
  date: string;
  domain?: string;
  pages?: number;
  includes?: string[];
  controls?: string[];
  description?: string;
  content: string;
}

export interface DownloadResult {
  success: boolean;
  filename?: string;
  format?: string;
  error?: string;
}

// Mock implementation - in production, these would use actual libraries
export const downloadMarkdown = (content: string, filename: string): DownloadResult => {
  try {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return { success: true, filename: `${filename}.md`, format: 'md' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const downloadWord = async (templateData: TemplateData, filename: string): Promise<DownloadResult> => {
  try {
    // Mock Word document generation
    const content = `# ${templateData.title}\n\n${templateData.subtitle || ''}\n\n${templateData.content}`;
    const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return { success: true, filename: `${filename}.docx`, format: 'docx' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const downloadPDF = (templateData: TemplateData, filename: string): DownloadResult => {
  try {
    // Mock PDF generation
    const content = `# ${templateData.title}\n\n${templateData.subtitle || ''}\n\n${templateData.content}`;
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return { success: true, filename: `${filename}.pdf`, format: 'pdf' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const downloadExcel = async (templateData: TemplateData, filename: string): Promise<DownloadResult> => {
  try {
    // Mock Excel generation
    const content = `${templateData.title}\t${templateData.subtitle || ''}\t${templateData.content}`;
    const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return { success: true, filename: `${filename}.xlsx`, format: 'xlsx' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const downloadWithFallback = async (
  templateData: TemplateData, 
  filename: string, 
  format: DocumentFormat, 
  markdownContent: string
): Promise<DownloadResult> => {
  // Try the requested format first, then fallback to markdown
  let result: DownloadResult;
  
  switch (format) {
    case 'docx':
      result = await downloadWord(templateData, filename);
      break;
    case 'pdf':
      result = downloadPDF(templateData, filename);
      break;
    case 'xlsx':
      result = await downloadExcel(templateData, filename);
      break;
    default:
      result = downloadMarkdown(markdownContent, filename);
  }
  
  if (!result.success) {
    // Fallback to markdown
    result = downloadMarkdown(markdownContent, filename);
  }
  
  return result;
};

export const convertMarkdownToTemplateData = (
  title: string,
  markdownContent: string,
  metadata: Partial<TemplateData>
): TemplateData => {
  return {
    title,
    content: markdownContent,
    version: metadata.version || '1.0',
    date: metadata.date || new Date().toLocaleDateString(),
    domain: metadata.domain,
    pages: metadata.pages,
    includes: metadata.includes,
    controls: metadata.controls,
    description: metadata.description,
    subtitle: metadata.subtitle
  };
};
