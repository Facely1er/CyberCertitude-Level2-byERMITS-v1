import { downloadTemplateWithTracking } from './downloadUtils';
import { ProgressTrackingService } from './progressTracking';

class EnhancedDownloadService {
  private static instance: EnhancedDownloadService;
  private trackingService: ProgressTrackingService;

  private constructor() {
    this.trackingService = ProgressTrackingService.getInstance();
  }

  public static getInstance(): EnhancedDownloadService {
    if (!EnhancedDownloadService.instance) {
      EnhancedDownloadService.instance = new EnhancedDownloadService();
    }
    return EnhancedDownloadService.instance;
  }

  public async downloadTemplateWithTracking(
    templateName: string,
    domainId: string,
    format: 'md' | 'docx' | 'pdf' | 'xlsx',
    category: string
  ): Promise<{ success: boolean; filename?: string; error?: string }> {
    try {
      // Mock download - in production this would actually download the file
      const templateId = `${domainId}-${templateName.replace(/\s+/g, '-').toLowerCase()}`;
      const filename = `${templateName.replace(/\s+/g, '_')}_${domainId}_${new Date().toISOString().split('T')[0]}`;
      
      // Track the download
      this.trackingService.addDownload(
        templateId,
        templateName,
        domainId,
        format,
        [`${domainId}.1.001`, `${domainId}.1.002`, `${domainId}.2.007`] // Mock controls
      );

      // Simulate download delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        filename: `${filename}.${format}`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const enhancedDownloadService = EnhancedDownloadService.getInstance();
