/**
 * 📊 Reporting Service
 * Manages reports and analytics for CMMC compliance
 */

import { AssessmentData } from '../shared/types/assessment';
import { logger } from '../utils/logger';

export interface ReportData {
  id: string;
  name: string;
  type: 'compliance' | 'assessment' | 'progress' | 'risk' | 'custom';
  description: string;
  framework: string;
  status: 'draft' | 'generating' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  generatedAt?: Date;
  generatedBy: string;
  data: any;
  filters: ReportFilters;
  format: 'html' | 'pdf' | 'excel' | 'json';
  size: number;
  downloadCount: number;
  isPublic: boolean;
  tags: string[];
  organizationId?: string;
  assessmentId?: string;
  version: string;
}

export interface ReportFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  frameworks?: string[];
  categories?: string[];
  status?: string[];
  owners?: string[];
  priority?: string[];
  riskLevel?: string[];
  search?: string;
}

export interface ComplianceReportData {
  totalControls: number;
  implementedControls: number;
  partiallyImplementedControls: number;
  notImplementedControls: number;
  compliancePercentage: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  categoryBreakdown: Array<{
    category: string;
    total: number;
    implemented: number;
    percentage: number;
  }>;
  priorityBreakdown: Array<{
    priority: string;
    total: number;
    implemented: number;
    percentage: number;
  }>;
  recentActivity: Array<{
    date: Date;
    action: string;
    description: string;
    user: string;
  }>;
  recommendations: Array<{
    priority: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    description: string;
    estimatedEffort: number;
    impact: string;
  }>;
}

export interface AssessmentReportData {
  assessmentId: string;
  assessmentName: string;
  framework: string;
  completedAt: Date;
  overallScore: number;
  categoryScores: Array<{
    category: string;
    score: number;
    maxScore: number;
    percentage: number;
  }>;
  questionBreakdown: Array<{
    questionId: string;
    question: string;
    answer: number;
    category: string;
    notes?: string;
  }>;
  strengths: string[];
  weaknesses: string[];
  recommendations: Array<{
    priority: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    description: string;
    actionItems: string[];
  }>;
}

export interface ProgressReportData {
  period: {
    start: Date;
    end: Date;
  };
  totalAssessments: number;
  completedAssessments: number;
  inProgressAssessments: number;
  overdueAssessments: number;
  averageCompletionTime: number;
  teamPerformance: Array<{
    team: string;
    assessmentsCompleted: number;
    averageScore: number;
    completionRate: number;
  }>;
  categoryProgress: Array<{
    category: string;
    baselineScore: number;
    currentScore: number;
    improvement: number;
    trend: 'improving' | 'declining' | 'stable';
  }>;
  upcomingDeadlines: Array<{
    assessment: string;
    dueDate: Date;
    priority: string;
    assignedTo: string;
  }>;
}

class ReportingService {
  private static instance: ReportingService;
  private reports: ReportData[] = [];

  private constructor() {
    this.loadReports();
  }

  public static getInstance(): ReportingService {
    if (!ReportingService.instance) {
      ReportingService.instance = new ReportingService();
    }
    return ReportingService.instance;
  }

  private loadReports(): void {
    try {
      const reportsData = localStorage.getItem('cmc_reports');
      if (reportsData) {
        this.reports = JSON.parse(reportsData).map((report: any) => ({
          ...report,
          createdAt: new Date(report.createdAt),
          updatedAt: new Date(report.updatedAt),
          generatedAt: report.generatedAt ? new Date(report.generatedAt) : undefined,
          data: report.data || {}
        }));
      }

      logger.debug('Reports loaded successfully', { count: this.reports.length });
    } catch (error) {
      logger.error('Failed to load reports:', error);
      this.reports = [];
    }
  }

  private saveReports(): void {
    try {
      localStorage.setItem('cmc_reports', JSON.stringify(this.reports));
      logger.debug('Reports saved successfully', { count: this.reports.length });
    } catch (error) {
      logger.error('Failed to save reports:', error);
      throw new Error('Failed to save reports');
    }
  }

  public async getReports(): Promise<ReportData[]> {
    return [...this.reports];
  }

  public async getReportById(id: string): Promise<ReportData | null> {
    return this.reports.find(report => report.id === id) || null;
  }

  public async searchReports(filters: ReportFilters): Promise<ReportData[]> {
    return this.reports.filter(report => {
      if (filters.frameworks && filters.frameworks.length > 0) {
        if (!filters.frameworks.includes(report.framework)) return false;
      }
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(report.status)) return false;
      }
      if (filters.dateRange) {
        if (report.createdAt < filters.dateRange.start || report.createdAt > filters.dateRange.end) return false;
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = report.name.toLowerCase().includes(searchLower) ||
                             report.description.toLowerCase().includes(searchLower) ||
                             report.tags.some(tag => tag.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }
      return true;
    });
  }

  public async generateComplianceReport(
    assessment: AssessmentData,
    filters: ReportFilters = {}
  ): Promise<ReportData> {
    const now = new Date();
    const reportId = `report_compliance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Generate compliance report data
    const responses = assessment.responses || {};
    const totalControls = Object.keys(responses).length;
    const implementedControls = Object.values(responses).filter(r => r === 3).length;
    const partiallyImplementedControls = Object.values(responses).filter(r => r === 2).length;
    const notImplementedControls = totalControls - implementedControls - partiallyImplementedControls;
    const compliancePercentage = totalControls > 0 ? (implementedControls / totalControls) * 100 : 0;

    const complianceData: ComplianceReportData = {
      totalControls,
      implementedControls,
      partiallyImplementedControls,
      notImplementedControls,
      compliancePercentage,
      riskLevel: compliancePercentage >= 80 ? 'low' : compliancePercentage >= 60 ? 'medium' : compliancePercentage >= 40 ? 'high' : 'critical',
      categoryBreakdown: this.generateCategoryBreakdown(responses),
      priorityBreakdown: this.generatePriorityBreakdown(responses),
      recentActivity: this.generateRecentActivity(assessment),
      recommendations: this.generateRecommendations(responses)
    };

    const report: ReportData = {
      id: reportId,
      name: `Compliance Report - ${assessment.frameworkName}`,
      type: 'compliance',
      description: `Compliance report for ${assessment.frameworkName} assessment`,
      framework: assessment.frameworkName,
      status: 'completed',
      createdAt: now,
      updatedAt: now,
      generatedAt: now,
      generatedBy: 'system',
      data: complianceData,
      filters,
      format: 'html',
      size: JSON.stringify(complianceData).length,
      downloadCount: 0,
      isPublic: false,
      tags: ['compliance', 'assessment', assessment.frameworkName.toLowerCase()],
      assessmentId: assessment.id,
      version: '1.0'
    };

    this.reports.push(report);
    this.saveReports();

    logger.info('Compliance report generated successfully', { 
      reportId, 
      assessmentId: assessment.id 
    });

    return report;
  }

  public async generateAssessmentReport(
    assessment: AssessmentData,
    filters: ReportFilters = {}
  ): Promise<ReportData> {
    const now = new Date();
    const reportId = `report_assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const responses = assessment.responses || {};
    const totalQuestions = Object.keys(responses).length;
    const totalScore = Object.values(responses).reduce((sum, score) => sum + score, 0);
    const maxScore = totalQuestions * 3;
    const overallScore = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

    const assessmentData: AssessmentReportData = {
      assessmentId: assessment.id,
      assessmentName: assessment.frameworkName,
      framework: assessment.frameworkName,
      completedAt: assessment.lastModified,
      overallScore,
      categoryScores: this.generateCategoryScores(responses),
      questionBreakdown: this.generateQuestionBreakdown(responses),
      strengths: this.generateStrengths(responses),
      weaknesses: this.generateWeaknesses(responses),
      recommendations: this.generateAssessmentRecommendations(responses)
    };

    const report: ReportData = {
      id: reportId,
      name: `Assessment Report - ${assessment.frameworkName}`,
      type: 'assessment',
      description: `Detailed assessment report for ${assessment.frameworkName}`,
      framework: assessment.frameworkName,
      status: 'completed',
      createdAt: now,
      updatedAt: now,
      generatedAt: now,
      generatedBy: 'system',
      data: assessmentData,
      filters,
      format: 'html',
      size: JSON.stringify(assessmentData).length,
      downloadCount: 0,
      isPublic: false,
      tags: ['assessment', 'detailed', assessment.frameworkName.toLowerCase()],
      assessmentId: assessment.id,
      version: '1.0'
    };

    this.reports.push(report);
    this.saveReports();

    logger.info('Assessment report generated successfully', { 
      reportId, 
      assessmentId: assessment.id 
    });

    return report;
  }

  public async generateProgressReport(
    assessments: AssessmentData[],
    filters: ReportFilters = {}
  ): Promise<ReportData> {
    const now = new Date();
    const reportId = `report_progress_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const periodAssessments = assessments.filter(a => a.lastModified >= thirtyDaysAgo);

    const progressData: ProgressReportData = {
      period: {
        start: thirtyDaysAgo,
        end: now
      },
      totalAssessments: assessments.length,
      completedAssessments: assessments.filter(a => a.isComplete).length,
      inProgressAssessments: assessments.filter(a => !a.isComplete).length,
      overdueAssessments: assessments.filter(a => {
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        return !a.isComplete && a.lastModified < thirtyDaysFromNow;
      }).length,
      averageCompletionTime: this.calculateAverageCompletionTime(assessments),
      teamPerformance: this.generateTeamPerformance(assessments),
      categoryProgress: this.generateCategoryProgress(assessments),
      upcomingDeadlines: this.generateUpcomingDeadlines(assessments)
    };

    const report: ReportData = {
      id: reportId,
      name: 'Progress Report - Last 30 Days',
      type: 'progress',
      description: 'Progress report covering the last 30 days of assessment activity',
      framework: 'CMMC Level 1',
      status: 'completed',
      createdAt: now,
      updatedAt: now,
      generatedAt: now,
      generatedBy: 'system',
      data: progressData,
      filters,
      format: 'html',
      size: JSON.stringify(progressData).length,
      downloadCount: 0,
      isPublic: false,
      tags: ['progress', 'monthly', 'analytics'],
      version: '1.0'
    };

    this.reports.push(report);
    this.saveReports();

    logger.info('Progress report generated successfully', { reportId });

    return report;
  }

  public async deleteReport(id: string): Promise<void> {
    const reportIndex = this.reports.findIndex(report => report.id === id);
    if (reportIndex === -1) {
      throw new Error(`Report with id ${id} not found`);
    }

    const deletedReport = this.reports[reportIndex];
    this.reports.splice(reportIndex, 1);
    this.saveReports();

    logger.info('Report deleted successfully', { 
      reportId: id, 
      name: deletedReport.name 
    });
  }

  public async exportReport(report: ReportData, format: 'html' | 'pdf' | 'excel' | 'json'): Promise<string> {
    try {
      report.downloadCount++;
      this.saveReports();

      switch (format) {
        case 'html':
          return this.generateHTMLReport(report);
        case 'json':
          return JSON.stringify(report.data, null, 2);
        case 'pdf':
        case 'excel':
          // For now, return HTML format
          return this.generateHTMLReport(report);
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }
    } catch (error) {
      logger.error('Failed to export report:', error);
      throw new Error(`Failed to export report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private generateCategoryBreakdown(responses: Record<string, number>): Array<{ category: string; total: number; implemented: number; percentage: number }> {
    // Simplified category breakdown - in real implementation, this would be more comprehensive
    const categories = ['Access Control', 'Awareness and Training', 'Audit and Accountability', 'Configuration Management'];
    return categories.map(category => {
      const categoryControls = Object.keys(responses).filter(id => id.includes(category.substring(0, 2).toUpperCase()));
      const total = categoryControls.length;
      const implemented = categoryControls.filter(id => responses[id] === 3).length;
      return {
        category,
        total,
        implemented,
        percentage: total > 0 ? (implemented / total) * 100 : 0
      };
    });
  }

  private generatePriorityBreakdown(responses: Record<string, number>): Array<{ priority: string; total: number; implemented: number; percentage: number }> {
    // Simplified priority breakdown
    const priorities = ['Critical', 'High', 'Medium', 'Low'];
    return priorities.map(priority => {
      const priorityControls = Object.keys(responses).filter(id => id.includes(priority.toLowerCase()));
      const total = priorityControls.length;
      const implemented = priorityControls.filter(id => responses[id] === 3).length;
      return {
        priority,
        total,
        implemented,
        percentage: total > 0 ? (implemented / total) * 100 : 0
      };
    });
  }

  private generateRecentActivity(assessment: AssessmentData): Array<{ date: Date; action: string; description: string; user: string }> {
    return [
      {
        date: assessment.lastModified,
        action: 'Assessment Updated',
        description: 'Assessment responses were updated',
        user: 'System'
      },
      {
        date: assessment.createdAt,
        action: 'Assessment Created',
        description: 'New assessment was created',
        user: 'System'
      }
    ];
  }

  private generateRecommendations(responses: Record<string, number>): Array<{ priority: 'low' | 'medium' | 'high' | 'critical'; category: string; description: string; estimatedEffort: number; impact: string }> {
    const notImplemented = Object.entries(responses).filter(([_, score]) => score < 2);
    return notImplemented.slice(0, 5).map(([controlId, _]) => ({
      priority: 'high' as const,
      category: 'General',
      description: `Implement control ${controlId}`,
      estimatedEffort: 20,
      impact: 'High'
    }));
  }

  private generateCategoryScores(responses: Record<string, number>): Array<{ category: string; score: number; maxScore: number; percentage: number }> {
    return this.generateCategoryBreakdown(responses);
  }

  private generateQuestionBreakdown(responses: Record<string, number>): Array<{ questionId: string; question: string; answer: number; category: string; notes?: string }> {
    return Object.entries(responses).map(([questionId, answer]) => ({
      questionId,
      question: `Control ${questionId}`,
      answer,
      category: 'General'
    }));
  }

  private generateStrengths(responses: Record<string, number>): string[] {
    const implemented = Object.entries(responses).filter(([_, score]) => score === 3);
    return implemented.slice(0, 3).map(([controlId, _]) => `Control ${controlId} is fully implemented`);
  }

  private generateWeaknesses(responses: Record<string, number>): string[] {
    const notImplemented = Object.entries(responses).filter(([_, score]) => score < 2);
    return notImplemented.slice(0, 3).map(([controlId, _]) => `Control ${controlId} needs implementation`);
  }

  private generateAssessmentRecommendations(responses: Record<string, number>): Array<{ priority: 'low' | 'medium' | 'high' | 'critical'; category: string; description: string; actionItems: string[] }> {
    return this.generateRecommendations(responses).map(rec => ({
      ...rec,
      actionItems: [`Implement ${rec.description}`, 'Test implementation', 'Document evidence']
    }));
  }

  private calculateAverageCompletionTime(assessments: AssessmentData[]): number {
    const completed = assessments.filter(a => a.isComplete);
    if (completed.length === 0) return 0;
    
    const totalTime = completed.reduce((sum, assessment) => {
      const timeDiff = assessment.lastModified.getTime() - assessment.createdAt.getTime();
      return sum + (timeDiff / (1000 * 60 * 60)); // Convert to hours
    }, 0);
    
    return totalTime / completed.length;
  }

  private generateTeamPerformance(assessments: AssessmentData[]): Array<{ team: string; assessmentsCompleted: number; averageScore: number; completionRate: number }> {
    // Simplified team performance - in real implementation, this would be more comprehensive
    return [
      {
        team: 'IT Security Team',
        assessmentsCompleted: assessments.filter(a => a.isComplete).length,
        averageScore: 85,
        completionRate: 90
      }
    ];
  }

  private generateCategoryProgress(assessments: AssessmentData[]): Array<{ category: string; baselineScore: number; currentScore: number; improvement: number; trend: 'improving' | 'declining' | 'stable' }> {
    return [
      {
        category: 'Access Control',
        baselineScore: 70,
        currentScore: 85,
        improvement: 15,
        trend: 'improving'
      }
    ];
  }

  private generateUpcomingDeadlines(assessments: AssessmentData[]): Array<{ assessment: string; dueDate: Date; priority: string; assignedTo: string }> {
    return assessments.filter(a => !a.isComplete).slice(0, 5).map(assessment => ({
      assessment: assessment.frameworkName,
      dueDate: new Date(assessment.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000),
      priority: 'Medium',
      assignedTo: 'IT Security Team'
    }));
  }

  private generateHTMLReport(report: ReportData): string {
    const data = report.data;
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${report.name}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; color: #333; }
        .header { border-bottom: 2px solid #0066cc; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #0066cc; margin: 0; }
        .header .meta { color: #666; font-size: 14px; margin-top: 10px; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .summary h3 { margin-top: 0; }
        .summary-item { margin: 10px 0; }
        .section { margin: 30px 0; }
        .section h2 { color: #0066cc; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
        .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${report.name}</h1>
        <div class="meta">
            <strong>Generated:</strong> ${report.generatedAt?.toLocaleDateString()}<br>
            <strong>Framework:</strong> ${report.framework}<br>
            <strong>Type:</strong> ${report.type}
        </div>
    </div>

    <div class="summary">
        <h3>Report Summary</h3>
        <div class="summary-item"><strong>Status:</strong> ${report.status}</div>
        <div class="summary-item"><strong>Format:</strong> ${report.format}</div>
        <div class="summary-item"><strong>Size:</strong> ${(report.size / 1024).toFixed(2)} KB</div>
    </div>

    <div class="section">
        <h2>Report Data</h2>
        <pre>${JSON.stringify(data, null, 2)}</pre>
    </div>

    <div class="footer">
        <p>This report was generated by the CMMC Assessment Tool on ${new Date().toLocaleString()}.</p>
    </div>
</body>
</html>`;

    return html;
  }
}

export const reportingService = ReportingService.getInstance();