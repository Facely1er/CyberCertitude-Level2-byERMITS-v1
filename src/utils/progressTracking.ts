export interface EvidenceItem {
  controlId: string;
  templateName: string;
  evidenceType: 'policy' | 'screenshot' | 'log' | 'configuration' | 'test-result' | 'document';
  uploadedAt: Date;
  filePath: string;
  status: 'pending' | 'approved' | 'rejected';
  description: string;
}

export interface TemplateProgress {
  templateId: string;
  templateName: string;
  domainId: string;
  status: 'not-started' | 'downloaded' | 'in-progress' | 'completed';
  progress: number;
  evidenceItems: EvidenceItem[];
  lastUpdated: Date;
}

export interface DomainProgress {
  domainId: string;
  domainName: string;
  percentage: number;
  completedControls: number;
  totalControls: number;
  completedTemplates: number;
  totalTemplates: number;
  lastUpdated: Date;
  nextMilestone?: string;
}

export interface DownloadTrackingData {
  templateId: string;
  templateName: string;
  domainId: string;
  format: string;
  downloadedAt: Date;
  controls: string[];
}

export interface EnhancedProgress {
  domainProgress: Record<string, DomainProgress>;
  templateProgress: Record<string, TemplateProgress>;
  downloadHistory: DownloadTrackingData[];
}

export interface SmartRecommendation {
  type: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  impact: string;
  estimatedTime: string;
  templateId?: string;
  domainId?: string;
}

class ProgressTrackingService {
  private static instance: ProgressTrackingService;
  private progress: EnhancedProgress;

  private constructor() {
    this.progress = {
      domainProgress: this.initializeDomainProgress(),
      templateProgress: {},
      downloadHistory: []
    };
  }

  public static getInstance(): ProgressTrackingService {
    if (!ProgressTrackingService.instance) {
      ProgressTrackingService.instance = new ProgressTrackingService();
    }
    return ProgressTrackingService.instance;
  }

  private initializeDomainProgress(): Record<string, DomainProgress> {
    const domains = [
      { id: 'AC', name: 'Access Control', controls: 22, templates: 3 },
      { id: 'AU', name: 'Audit & Accountability', controls: 9, templates: 3 },
      { id: 'AT', name: 'Awareness & Training', controls: 3, templates: 3 },
      { id: 'CM', name: 'Configuration Management', controls: 9, templates: 3 },
      { id: 'IA', name: 'Identification & Authentication', controls: 11, templates: 3 },
      { id: 'IR', name: 'Incident Response', controls: 3, templates: 3 },
      { id: 'MA', name: 'Maintenance', controls: 6, templates: 3 },
      { id: 'MP', name: 'Media Protection', controls: 8, templates: 3 },
      { id: 'PS', name: 'Personnel Security', controls: 2, templates: 3 },
      { id: 'PE', name: 'Physical Protection', controls: 6, templates: 3 },
      { id: 'RA', name: 'Risk Assessment', controls: 3, templates: 3 },
      { id: 'CA', name: 'Security Assessment', controls: 2, templates: 3 },
      { id: 'SC', name: 'System & Communications Protection', controls: 20, templates: 3 },
      { id: 'SI', name: 'System & Information Integrity', controls: 6, templates: 3 }
    ];

    const domainProgress: Record<string, DomainProgress> = {};
    domains.forEach(domain => {
      domainProgress[domain.id] = {
        domainId: domain.id,
        domainName: domain.name,
        percentage: Math.floor(Math.random() * 30), // Random initial progress
        completedControls: Math.floor(Math.random() * domain.controls),
        totalControls: domain.controls,
        completedTemplates: Math.floor(Math.random() * domain.templates),
        totalTemplates: domain.templates,
        lastUpdated: new Date(),
        nextMilestone: `Complete ${domain.name} implementation`
      };
    });

    return domainProgress;
  }

  public getProgress(): EnhancedProgress {
    return this.progress;
  }

  public updateTemplateProgress(templateId: string, status: TemplateProgress['status'], progress: number): void {
    if (!this.progress.templateProgress[templateId]) {
      this.progress.templateProgress[templateId] = {
        templateId,
        templateName: `Template ${templateId}`,
        domainId: 'AC',
        status: 'not-started',
        progress: 0,
        evidenceItems: [],
        lastUpdated: new Date()
      };
    }

    this.progress.templateProgress[templateId].status = status;
    this.progress.templateProgress[templateId].progress = progress;
    this.progress.templateProgress[templateId].lastUpdated = new Date();
  }

  public addEvidence(
    templateId: string,
    controlId: string,
    evidenceType: EvidenceItem['evidenceType'],
    filePath: string,
    description: string
  ): void {
    if (!this.progress.templateProgress[templateId]) {
      this.updateTemplateProgress(templateId, 'downloaded', 0);
    }

    const evidence: EvidenceItem = {
      controlId,
      templateName: this.progress.templateProgress[templateId].templateName,
      evidenceType,
      uploadedAt: new Date(),
      filePath,
      status: 'pending',
      description
    };

    this.progress.templateProgress[templateId].evidenceItems.push(evidence);
    this.progress.templateProgress[templateId].lastUpdated = new Date();
  }

  public addDownload(templateId: string, templateName: string, domainId: string, format: string, controls: string[]): void {
    const download: DownloadTrackingData = {
      templateId,
      templateName,
      domainId,
      format,
      downloadedAt: new Date(),
      controls
    };

    this.progress.downloadHistory.unshift(download);
    
    // Keep only last 50 downloads
    if (this.progress.downloadHistory.length > 50) {
      this.progress.downloadHistory = this.progress.downloadHistory.slice(0, 50);
    }

    // Update template progress
    this.updateTemplateProgress(templateId, 'downloaded', 10);
  }

  public generateRecommendations(): SmartRecommendation[] {
    const recommendations: SmartRecommendation[] = [];

    // Generate recommendations based on progress
    Object.values(this.progress.domainProgress).forEach(domain => {
      if (domain.percentage < 30) {
        recommendations.push({
          type: 'domain',
          priority: 'high',
          reason: `Start implementing ${domain.domainName} controls`,
          impact: `Will improve overall compliance by ${Math.min(20, domain.totalControls)}%`,
          estimatedTime: '2-4 weeks',
          domainId: domain.domainId
        });
      } else if (domain.percentage < 70) {
        recommendations.push({
          type: 'domain',
          priority: 'medium',
          reason: `Continue ${domain.domainName} implementation`,
          impact: `Will complete ${domain.totalControls - domain.completedControls} remaining controls`,
          estimatedTime: '1-2 weeks',
          domainId: domain.domainId
        });
      }
    });

    // Generate template-specific recommendations
    Object.values(this.progress.templateProgress).forEach(template => {
      if (template.status === 'downloaded' && template.evidenceItems.length === 0) {
        recommendations.push({
          type: 'template',
          priority: 'medium',
          reason: `Start collecting evidence for ${template.templateName}`,
          impact: 'Will demonstrate control implementation',
          estimatedTime: '1 week',
          templateId: template.templateId,
          domainId: template.domainId
        });
      }
    });

    return recommendations.slice(0, 10); // Return top 10 recommendations
  }
}

export { ProgressTrackingService };
