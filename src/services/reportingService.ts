import { dataService } from './dataService';
import { controlsService } from './controlsService';
import { policyService } from './policyService';
import { evidenceService } from './evidenceService';
import { teamService } from './teamService';
import { calendarService } from './calendarService';
import { logger } from '../utils/logger';

export interface ReportData {
  id: string;
  title: string;
  description: string;
  type: 'compliance' | 'assessment' | 'progress' | 'risk' | 'team' | 'evidence' | 'calendar' | 'executive' | 'audit' | 'custom';
  status: 'draft' | 'generating' | 'completed' | 'failed';
  generatedBy: string;
  generatedAt: Date;
  dataRange: {
    start: Date;
    end: Date;
  };
  filters: Record<string, any>;
  sections: ReportSection[];
  summary: ReportSummary;
  recommendations: string[];
  attachments: string[];
  isConfidential: boolean;
  accessLevel: 'public' | 'internal' | 'confidential' | 'restricted';
  createdAt: Date;
  updatedAt: Date;
}

interface ReportSection {
  id: string;
  title: string;
  type: 'text' | 'chart' | 'table' | 'metric' | 'list' | 'timeline';
  data: any;
  order: number;
  isVisible: boolean;
}

interface ReportSummary {
  totalControls: number;
  implementedControls: number;
  complianceRate: number;
  totalPolicies: number;
  effectivePolicies: number;
  totalEvidence: number;
  approvedEvidence: number;
  teamMembers: number;
  activeMembers: number;
  upcomingEvents: number;
  overdueEvents: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  overallScore: number;
  lastUpdated: Date;
}

export interface ReportFilters {
  type?: string;
  status?: string;
  generatedBy?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

export class ReportingService {
  private static instance: ReportingService;
  private readonly STORAGE_KEY = 'cybersecurity-reports';

  static getInstance(): ReportingService {
    if (!ReportingService.instance) {
      ReportingService.instance = new ReportingService();
    }
    return ReportingService.instance;
  }

  async getReports(): Promise<ReportData[]> {
    try {
      const data = dataService.getData();
      return data.reports || [];
    } catch (error) {
      logger.error('Error fetching reports:', error);
      return [];
    }
  }

  async getReport(id: string): Promise<ReportData | null> {
    try {
      const reports = await this.getReports();
      return reports.find(report => report.id === id) || null;
    } catch (error) {
      logger.error('Error fetching report:', error);
      return null;
    }
  }

  async saveReport(report: Omit<ReportData, 'createdAt' | 'updatedAt'>): Promise<ReportData> {
    try {
      const reports = await this.getReports();
      const now = new Date();
      
      const newReport: ReportData = {
        ...report,
        createdAt: now,
        updatedAt: now
      };

      const existingIndex = reports.findIndex(r => r.id === report.id);
      
      if (existingIndex >= 0) {
        reports[existingIndex] = { ...newReport, createdAt: reports[existingIndex].createdAt };
      } else {
        reports.push(newReport);
      }

      await this.saveReports(reports);
      return newReport;
    } catch (error) {
      logger.error('Error saving report:', error);
      throw error;
    }
  }

  async updateReport(id: string, updates: Partial<ReportData>): Promise<ReportData> {
    try {
      const reports = await this.getReports();
      const index = reports.findIndex(r => r.id === id);
      
      if (index === -1) {
        throw new Error('Report not found');
      }

      reports[index] = {
        ...reports[index],
        ...updates,
        updatedAt: new Date()
      };

      await this.saveReports(reports);
      return reports[index];
    } catch (error) {
      logger.error('Error updating report:', error);
      throw error;
    }
  }

  async deleteReport(id: string): Promise<void> {
    try {
      const reports = await this.getReports();
      const filteredReports = reports.filter(r => r.id !== id);
      await this.saveReports(filteredReports);
    } catch (error) {
      logger.error('Error deleting report:', error);
      throw error;
    }
  }

  async searchReports(filters: ReportFilters): Promise<ReportData[]> {
    try {
      let reports = await this.getReports();

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        reports = reports.filter(report =>
          report.title.toLowerCase().includes(searchTerm) ||
          report.description.toLowerCase().includes(searchTerm)
        );
      }

      if (filters.type && filters.type !== 'all') {
        reports = reports.filter(report => report.type === filters.type);
      }

      if (filters.status && filters.status !== 'all') {
        reports = reports.filter(report => report.status === filters.status);
      }

      if (filters.generatedBy && filters.generatedBy !== 'all') {
        reports = reports.filter(report => report.generatedBy === filters.generatedBy);
      }

      if (filters.dateRange) {
        reports = reports.filter(report => 
          report.generatedAt >= filters.dateRange!.start && 
          report.generatedAt <= filters.dateRange!.end
        );
      }

      return reports;
    } catch (error) {
      logger.error('Error searching reports:', error);
      return [];
    }
  }

  async generateComplianceReport(
    title: string,
    description: string,
    dataRange: { start: Date; end: Date },
    generatedBy: string
  ): Promise<ReportData> {
    try {
      const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Gather data from all services
      const [
        controlsStats,
        policiesStats,
        evidenceStats,
        teamStats,
        calendarStats
      ] = await Promise.all([
        controlsService.getControlStatistics(),
        policyService.getPolicyStatistics(),
        evidenceService.getEvidenceStatistics(),
        teamService.getTeamStatistics(),
        calendarService.getCalendarStatistics()
      ]);

      // Calculate overall compliance score
      const complianceRate = controlsStats.complianceRate;
      const policyComplianceRate = policiesStats.complianceRate;
      const evidenceComplianceRate = evidenceStats.complianceRate;
      const overallScore = Math.round((complianceRate + policyComplianceRate + evidenceComplianceRate) / 3);

      // Determine risk level
      let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
      if (overallScore < 50) riskLevel = 'critical';
      else if (overallScore < 70) riskLevel = 'high';
      else if (overallScore < 85) riskLevel = 'medium';

      const summary: ReportSummary = {
        totalControls: controlsStats.total,
        implementedControls: controlsStats.byStatus.implemented || 0,
        complianceRate,
        totalPolicies: policiesStats.total,
        effectivePolicies: policiesStats.byStatus.effective || 0,
        totalEvidence: evidenceStats.totalItems,
        approvedEvidence: evidenceStats.byStatus.approved || 0,
        teamMembers: teamStats.totalMembers,
        activeMembers: teamStats.activeMembers,
        upcomingEvents: calendarStats.upcomingEvents,
        overdueEvents: calendarStats.overdueEvents,
        riskLevel,
        overallScore,
        lastUpdated: new Date()
      };

      const sections: ReportSection[] = [
        {
          id: 'executive-summary',
          title: 'Executive Summary',
          type: 'text',
          data: {
            content: `This compliance report covers the period from ${dataRange.start.toLocaleDateString()} to ${dataRange.end.toLocaleDateString()}. 
            Overall compliance score is ${overallScore}% with ${controlsStats.total} controls assessed. 
            ${controlsStats.byStatus.implemented || 0} controls are fully implemented, 
            ${policiesStats.byStatus.effective || 0} policies are effective, 
            and ${evidenceStats.byStatus.approved || 0} evidence items are approved.`
          },
          order: 1,
          isVisible: true
        },
        {
          id: 'controls-overview',
          title: 'Controls Implementation Status',
          type: 'chart',
          data: {
            type: 'doughnut',
            labels: ['Implemented', 'In Progress', 'Not Implemented', 'Planned'],
            datasets: [{
              data: [
                controlsStats.byStatus.implemented || 0,
                controlsStats.byStatus['in-progress'] || 0,
                controlsStats.byStatus['not-implemented'] || 0,
                controlsStats.byStatus.planned || 0
              ],
              backgroundColor: ['#10B981', '#3B82F6', '#EF4444', '#F59E0B']
            }]
          },
          order: 2,
          isVisible: true
        },
        {
          id: 'policies-status',
          title: 'Policies Status',
          type: 'table',
          data: {
            headers: ['Status', 'Count', 'Percentage'],
            rows: Object.entries(policiesStats.byStatus).map(([status, count]) => [
              status,
              count,
              `${Math.round((count / policiesStats.total) * 100)}%`
            ])
          },
          order: 3,
          isVisible: true
        },
        {
          id: 'evidence-collection',
          title: 'Evidence Collection Progress',
          type: 'metric',
          data: {
            metrics: [
              { label: 'Total Evidence Items', value: evidenceStats.totalItems },
              { label: 'Approved Evidence', value: evidenceStats.byStatus.approved || 0 },
              { label: 'Pending Review', value: evidenceStats.byStatus['pending-review'] || 0 },
              { label: 'Compliance Rate', value: `${evidenceStats.complianceRate.toFixed(1)}%` }
            ]
          },
          order: 4,
          isVisible: true
        },
        {
          id: 'team-performance',
          title: 'Team Performance',
          type: 'metric',
          data: {
            metrics: [
              { label: 'Total Team Members', value: teamStats.totalMembers },
              { label: 'Active Members', value: teamStats.activeMembers },
              { label: 'Average Collaboration Score', value: `${teamStats.averageCollaborationScore.toFixed(1)}%` },
              { label: 'Average Compliance Score', value: `${teamStats.averageComplianceScore.toFixed(1)}%` }
            ]
          },
          order: 5,
          isVisible: true
        },
        {
          id: 'calendar-events',
          title: 'Upcoming Events',
          type: 'list',
          data: {
            items: [
              { label: 'Upcoming Events', value: calendarStats.upcomingEvents },
              { label: 'Overdue Events', value: calendarStats.overdueEvents },
              { label: 'This Week', value: calendarStats.thisWeekEvents },
              { label: 'This Month', value: calendarStats.thisMonthEvents }
            ]
          },
          order: 6,
          isVisible: true
        }
      ];

      const recommendations = this.generateRecommendations(summary, controlsStats, policiesStats, evidenceStats);

      const report: ReportData = {
        id: reportId,
        title,
        description,
        type: 'compliance',
        status: 'completed',
        generatedBy,
        generatedAt: new Date(),
        dataRange,
        filters: {},
        sections,
        summary,
        recommendations,
        attachments: [],
        isConfidential: true,
        accessLevel: 'confidential',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await this.saveReport(report);
      return report;
    } catch (error) {
      logger.error('Error generating compliance report:', error);
      throw error;
    }
  }

  async generateAssessmentReport(
    title: string,
    description: string,
    assessmentId: string,
    generatedBy: string
  ): Promise<ReportData> {
    try {
      const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // This would typically get assessment data from a service
      // For now, we'll create a mock assessment report
      const summary: ReportSummary = {
        totalControls: 110,
        implementedControls: 85,
        complianceRate: 77.3,
        totalPolicies: 15,
        effectivePolicies: 12,
        totalEvidence: 45,
        approvedEvidence: 38,
        teamMembers: 8,
        activeMembers: 7,
        upcomingEvents: 3,
        overdueEvents: 1,
        riskLevel: 'medium',
        overallScore: 77,
        lastUpdated: new Date()
      };

      const sections: ReportSection[] = [
        {
          id: 'assessment-overview',
          title: 'Assessment Overview',
          type: 'text',
          data: {
            content: `Assessment ID: ${assessmentId}\n\nThis assessment was conducted to evaluate CMMC 2.0 Level 2 compliance. 
            The assessment covered all 110 required controls across 14 domains. 
            Overall compliance score is ${summary.overallScore}% with ${summary.implementedControls} controls fully implemented.`
          },
          order: 1,
          isVisible: true
        },
        {
          id: 'domain-breakdown',
          title: 'Domain Performance',
          type: 'chart',
          data: {
            type: 'bar',
            labels: ['Access Control', 'Audit', 'Awareness', 'Configuration', 'Identification', 'Incident Response', 'Maintenance', 'Media Protection', 'Personnel', 'Physical', 'Risk Assessment', 'Security Assessment', 'System Protection', 'Information Integrity'],
            datasets: [{
              label: 'Implementation Rate (%)',
              data: [85, 90, 75, 80, 88, 70, 82, 78, 85, 90, 75, 80, 85, 88],
              backgroundColor: '#3B82F6'
            }]
          },
          order: 2,
          isVisible: true
        }
      ];

      const recommendations = [
        'Focus on implementing remaining controls in Incident Response domain',
        'Strengthen awareness training programs',
        'Improve media protection controls',
        'Enhance risk assessment processes'
      ];

      const report: ReportData = {
        id: reportId,
        title,
        description,
        type: 'assessment',
        status: 'completed',
        generatedBy,
        generatedAt: new Date(),
        dataRange: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          end: new Date()
        },
        filters: { assessmentId },
        sections,
        summary,
        recommendations,
        attachments: [],
        isConfidential: true,
        accessLevel: 'confidential',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await this.saveReport(report);
      return report;
    } catch (error) {
      logger.error('Error generating assessment report:', error);
      throw error;
    }
  }

  async generateProgressReport(
    title: string,
    description: string,
    dataRange: { start: Date; end: Date },
    generatedBy: string
  ): Promise<ReportData> {
    try {
      const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const [
        controlsStats,
        policiesStats,
        evidenceStats,
        teamStats
      ] = await Promise.all([
        controlsService.getControlStatistics(),
        policyService.getPolicyStatistics(),
        evidenceService.getEvidenceStatistics(),
        teamService.getTeamStatistics()
      ]);

      const summary: ReportSummary = {
        totalControls: controlsStats.total,
        implementedControls: controlsStats.byStatus.implemented || 0,
        complianceRate: controlsStats.complianceRate,
        totalPolicies: policiesStats.total,
        effectivePolicies: policiesStats.byStatus.effective || 0,
        totalEvidence: evidenceStats.totalItems,
        approvedEvidence: evidenceStats.byStatus.approved || 0,
        teamMembers: teamStats.totalMembers,
        activeMembers: teamStats.activeMembers,
        upcomingEvents: 0,
        overdueEvents: 0,
        riskLevel: controlsStats.complianceRate > 80 ? 'low' : controlsStats.complianceRate > 60 ? 'medium' : 'high',
        overallScore: Math.round(controlsStats.complianceRate),
        lastUpdated: new Date()
      };

      const sections: ReportSection[] = [
        {
          id: 'progress-summary',
          title: 'Progress Summary',
          type: 'text',
          data: {
            content: `Progress report for the period ${dataRange.start.toLocaleDateString()} to ${dataRange.end.toLocaleDateString()}. 
            Implementation progress shows ${summary.implementedControls} out of ${summary.totalControls} controls completed (${summary.complianceRate.toFixed(1)}%). 
            Team performance indicates ${summary.activeMembers} active members with strong collaboration scores.`
          },
          order: 1,
          isVisible: true
        },
        {
          id: 'progress-timeline',
          title: 'Implementation Timeline',
          type: 'timeline',
          data: {
            events: [
              { date: 'Week 1', event: 'Initial assessment completed', status: 'completed' },
              { date: 'Week 2', event: 'Policy review initiated', status: 'completed' },
              { date: 'Week 3', event: 'Control implementation started', status: 'in-progress' },
              { date: 'Week 4', event: 'Evidence collection phase', status: 'pending' }
            ]
          },
          order: 2,
          isVisible: true
        }
      ];

      const recommendations = [
        'Continue current implementation pace',
        'Focus on high-priority controls',
        'Maintain team collaboration levels',
        'Schedule regular progress reviews'
      ];

      const report: ReportData = {
        id: reportId,
        title,
        description,
        type: 'progress',
        status: 'completed',
        generatedBy,
        generatedAt: new Date(),
        dataRange,
        filters: {},
        sections,
        summary,
        recommendations,
        attachments: [],
        isConfidential: false,
        accessLevel: 'internal',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await this.saveReport(report);
      return report;
    } catch (error) {
      logger.error('Error generating progress report:', error);
      throw error;
    }
  }

  private generateRecommendations(
    summary: ReportSummary,
    controlsStats: any,
    policiesStats: any,
    evidenceStats: any
  ): string[] {
    const recommendations: string[] = [];

    if (summary.complianceRate < 80) {
      recommendations.push('Focus on implementing remaining controls to improve compliance rate');
    }

    if (summary.overdueEvents > 0) {
      recommendations.push('Address overdue events and deadlines to maintain compliance schedule');
    }

    if (evidenceStats.complianceRate < 90) {
      recommendations.push('Improve evidence collection and approval processes');
    }

    if (summary.riskLevel === 'high' || summary.riskLevel === 'critical') {
      recommendations.push('Implement immediate risk mitigation measures');
    }

    if (summary.activeMembers < summary.teamMembers * 0.8) {
      recommendations.push('Increase team engagement and participation');
    }

    if (recommendations.length === 0) {
      recommendations.push('Maintain current compliance levels and continue monitoring');
    }

    return recommendations;
  }

  async exportReport(report: ReportData, format: 'pdf' | 'html' | 'csv' | 'xlsx'): Promise<string> {
    try {
      if (format === 'csv') {
        const headers = ['Section', 'Type', 'Data'];
        const rows = report.sections.map(section => [
          section.title,
          section.type,
          JSON.stringify(section.data)
        ]);
        
        return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
      }
      
      if (format === 'html') {
        return this.generateHTMLReport(report);
      }
      
      // For PDF and XLSX, return a placeholder
      return `Generated ${format.toUpperCase()} export for report: ${report.title}`;
    } catch (error) {
      logger.error('Error exporting report:', error);
      throw error;
    }
  }

  private generateHTMLReport(report: ReportData): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>${report.title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
        .metric { display: inline-block; margin: 10px; padding: 15px; background: #f5f5f5; border-radius: 5px; }
        .recommendations { background: #e8f4fd; padding: 20px; border-radius: 5px; }
        .recommendations ul { margin: 0; padding-left: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${report.title}</h1>
        <p>${report.description}</p>
        <p><strong>Generated:</strong> ${report.generatedAt.toLocaleDateString()}</p>
        <p><strong>Period:</strong> ${report.dataRange.start.toLocaleDateString()} - ${report.dataRange.end.toLocaleDateString()}</p>
    </div>
    
    <div class="section">
        <h2>Executive Summary</h2>
        <p>Overall compliance score: <strong>${report.summary.overallScore}%</strong></p>
        <p>Total controls: ${report.summary.totalControls} (${report.summary.implementedControls} implemented)</p>
        <p>Risk level: <strong>${report.summary.riskLevel}</strong></p>
    </div>
    
    ${report.sections.map(section => `
        <div class="section">
            <h2>${section.title}</h2>
            ${section.type === 'text' ? `<p>${section.data.content}</p>` : ''}
            ${section.type === 'metric' ? `
                <div>
                    ${section.data.metrics.map((metric: any) => 
                        `<div class="metric"><strong>${metric.label}:</strong> ${metric.value}</div>`
                    ).join('')}
                </div>
            ` : ''}
        </div>
    `).join('')}
    
    <div class="section">
        <h2>Recommendations</h2>
        <div class="recommendations">
            <ul>
                ${report.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>
    </div>
</body>
</html>`;
  }

  private async saveReports(reports: ReportData[]): Promise<void> {
    try {
      const data = dataService.getData();
      data.reports = reports;
      await dataService.saveData(data);
    } catch (error) {
      logger.error('Error saving reports:', error);
      throw error;
    }
  }
}

export const reportingService = ReportingService.getInstance();