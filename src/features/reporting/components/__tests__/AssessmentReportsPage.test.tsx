import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AssessmentReportsPage from '../AssessmentReportsPage';
import { reportService } from '@/services/reportService';

// Mock the report service
vi.mock('@/services/reportService', () => ({
  reportService: {
    generateReport: vi.fn(() => Promise.resolve({ url: 'test-report.pdf', filename: 'test-report.pdf' })),
    exportReport: vi.fn(() => Promise.resolve({ success: true })),
    getReportTemplates: vi.fn(() => [
      { id: 'executive', name: 'Executive Summary', description: 'High-level compliance overview' },
      { id: 'detailed', name: 'Detailed Assessment', description: 'Comprehensive compliance report' },
      { id: 'gap-analysis', name: 'Gap Analysis', description: 'Compliance gaps and recommendations' }
    ])
  }
}));

// Mock the data service
vi.mock('@/services/dataService', () => ({
  dataService: {
    getAssessments: vi.fn(() => []),
    getAssessmentById: vi.fn(() => null)
  }
}));

const mockAssessments = [
  {
    id: '1',
    name: 'CMMC 2.0 Level 2 Assessment - Q1 2024',
    frameworkId: 'cmmc',
    status: 'completed',
    completionDate: '2024-01-15',
    overallScore: 85,
    totalControls: 110,
    implementedControls: 94,
    partiallyImplementedControls: 16,
    notImplementedControls: 0,
    criticalGaps: 2,
    highGaps: 5,
    mediumGaps: 8,
    lowGaps: 3
  },
  {
    id: '2',
    name: 'NIST SP 800-171 Assessment - Q1 2024',
    frameworkId: 'nist',
    status: 'in-progress',
    completionDate: null,
    overallScore: 72,
    totalControls: 110,
    implementedControls: 79,
    partiallyImplementedControls: 31,
    notImplementedControls: 0,
    criticalGaps: 1,
    highGaps: 3,
    mediumGaps: 12,
    lowGaps: 5
  }
];

const renderReportsPage = () => {
  return render(
    <BrowserRouter>
      <AssessmentReportsPage
        savedAssessments={mockAssessments}
        onGenerateReport={() => {}}
        onExportReport={() => {}}
        onStartAssessment={() => {}}
        userProfile={null}
        addNotification={() => {}}
      />
    </BrowserRouter>
  );
};

describe('AssessmentReportsPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderReportsPage();
    expect(screen.getByText(/Assessment Reports/i)).toBeInTheDocument();
  });

  it('displays page header and description', () => {
    renderReportsPage();
    
    expect(screen.getByText(/Generate and Export Compliance Reports/i)).toBeInTheDocument();
    expect(screen.getByText(/Create comprehensive reports for CMMC compliance/i)).toBeInTheDocument();
  });

  it('shows assessment list', () => {
    renderReportsPage();
    
    expect(screen.getByText(/CMMC 2.0 Level 2 Assessment - Q1 2024/i)).toBeInTheDocument();
    expect(screen.getByText(/NIST SP 800-171 Assessment - Q1 2024/i)).toBeInTheDocument();
  });

  it('displays assessment details', () => {
    renderReportsPage();
    
    // Check for assessment details
    expect(screen.getByText(/Overall Score: 85%/i)).toBeInTheDocument();
    expect(screen.getByText(/Overall Score: 72%/i)).toBeInTheDocument();
    expect(screen.getByText(/Status: Completed/i)).toBeInTheDocument();
    expect(screen.getByText(/Status: In Progress/i)).toBeInTheDocument();
  });

  it('shows assessment statistics', () => {
    renderReportsPage();
    
    // Check for statistics
    expect(screen.getByText(/Total Controls: 110/i)).toBeInTheDocument();
    expect(screen.getByText(/Implemented: 94/i)).toBeInTheDocument();
    expect(screen.getByText(/Partially Implemented: 16/i)).toBeInTheDocument();
    expect(screen.getByText(/Critical Gaps: 2/i)).toBeInTheDocument();
    expect(screen.getByText(/High Gaps: 5/i)).toBeInTheDocument();
  });

  it('handles report generation', async () => {
    renderReportsPage();
    
    // Find generate report button for first assessment
    const generateButtons = screen.getAllByRole('button', { name: /Generate Report/i });
    fireEvent.click(generateButtons[0]);
    
    // Should show report generation options
    expect(screen.getByText(/Select Report Template/i)).toBeInTheDocument();
    expect(screen.getByText(/Executive Summary/i)).toBeInTheDocument();
    expect(screen.getByText(/Detailed Assessment/i)).toBeInTheDocument();
    expect(screen.getByText(/Gap Analysis/i)).toBeInTheDocument();
  });

  it('generates executive summary report', async () => {
    renderReportsPage();
    
    // Click generate report
    const generateButtons = screen.getAllByRole('button', { name: /Generate Report/i });
    fireEvent.click(generateButtons[0]);
    
    // Select executive summary template
    const executiveOption = screen.getByText(/Executive Summary/i);
    fireEvent.click(executiveOption);
    
    // Click generate
    const generateButton = screen.getByRole('button', { name: /Generate/i });
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(reportService.generateReport).toHaveBeenCalledWith(
        '1',
        'executive'
      );
    });
  });

  it('generates detailed assessment report', async () => {
    renderReportsPage();
    
    // Click generate report
    const generateButtons = screen.getAllByRole('button', { name: /Generate Report/i });
    fireEvent.click(generateButtons[0]);
    
    // Select detailed assessment template
    const detailedOption = screen.getByText(/Detailed Assessment/i);
    fireEvent.click(detailedOption);
    
    // Click generate
    const generateButton = screen.getByRole('button', { name: /Generate/i });
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(reportService.generateReport).toHaveBeenCalledWith(
        '1',
        'detailed'
      );
    });
  });

  it('generates gap analysis report', async () => {
    renderReportsPage();
    
    // Click generate report
    const generateButtons = screen.getAllByRole('button', { name: /Generate Report/i });
    fireEvent.click(generateButtons[0]);
    
    // Select gap analysis template
    const gapOption = screen.getByText(/Gap Analysis/i);
    fireEvent.click(gapOption);
    
    // Click generate
    const generateButton = screen.getByRole('button', { name: /Generate/i });
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(reportService.generateReport).toHaveBeenCalledWith(
        '1',
        'gap-analysis'
      );
    });
  });

  it('handles report export', async () => {
    renderReportsPage();
    
    // Find export button for first assessment
    const exportButtons = screen.getAllByRole('button', { name: /Export/i });
    fireEvent.click(exportButtons[0]);
    
    // Should show export options
    expect(screen.getByText(/Export Format/i)).toBeInTheDocument();
    expect(screen.getByText(/PDF/i)).toBeInTheDocument();
    expect(screen.getByText(/Word/i)).toBeInTheDocument();
    expect(screen.getByText(/Excel/i)).toBeInTheDocument();
    expect(screen.getByText(/HTML/i)).toBeInTheDocument();
  });

  it('exports report to PDF', async () => {
    renderReportsPage();
    
    // Click export
    const exportButtons = screen.getAllByRole('button', { name: /Export/i });
    fireEvent.click(exportButtons[0]);
    
    // Select PDF format
    const pdfOption = screen.getByText(/PDF/i);
    fireEvent.click(pdfOption);
    
    // Click export
    const exportButton = screen.getByRole('button', { name: /Export/i });
    fireEvent.click(exportButton);
    
    await waitFor(() => {
      expect(reportService.exportReport).toHaveBeenCalledWith(
        '1',
        'pdf'
      );
    });
  });

  it('exports report to Word', async () => {
    renderReportsPage();
    
    // Click export
    const exportButtons = screen.getAllByRole('button', { name: /Export/i });
    fireEvent.click(exportButtons[0]);
    
    // Select Word format
    const wordOption = screen.getByText(/Word/i);
    fireEvent.click(wordOption);
    
    // Click export
    const exportButton = screen.getByRole('button', { name: /Export/i });
    fireEvent.click(exportButton);
    
    await waitFor(() => {
      expect(reportService.exportReport).toHaveBeenCalledWith(
        '1',
        'word'
      );
    });
  });

  it('exports report to Excel', async () => {
    renderReportsPage();
    
    // Click export
    const exportButtons = screen.getAllByRole('button', { name: /Export/i });
    fireEvent.click(exportButtons[0]);
    
    // Select Excel format
    const excelOption = screen.getByText(/Excel/i);
    fireEvent.click(excelOption);
    
    // Click export
    const exportButton = screen.getByRole('button', { name: /Export/i });
    fireEvent.click(exportButton);
    
    await waitFor(() => {
      expect(reportService.exportReport).toHaveBeenCalledWith(
        '1',
        'excel'
      );
    });
  });

  it('exports report to HTML', async () => {
    renderReportsPage();
    
    // Click export
    const exportButtons = screen.getAllByRole('button', { name: /Export/i });
    fireEvent.click(exportButtons[0]);
    
    // Select HTML format
    const htmlOption = screen.getByText(/HTML/i);
    fireEvent.click(htmlOption);
    
    // Click export
    const exportButton = screen.getByRole('button', { name: /Export/i });
    fireEvent.click(exportButton);
    
    await waitFor(() => {
      expect(reportService.exportReport).toHaveBeenCalledWith(
        '1',
        'html'
      );
    });
  });

  it('shows assessment filtering options', () => {
    renderReportsPage();
    
    expect(screen.getByText(/Filter Assessments/i)).toBeInTheDocument();
    
    // Check for filter options
    expect(screen.getByLabelText(/Framework/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date Range/i)).toBeInTheDocument();
  });

  it('filters assessments by framework', () => {
    renderReportsPage();
    
    const frameworkFilter = screen.getByLabelText(/Framework/i);
    fireEvent.change(frameworkFilter, { target: { value: 'cmmc' } });
    
    // Should only show CMMC assessments
    expect(screen.getByText(/CMMC 2.0 Level 2 Assessment - Q1 2024/i)).toBeInTheDocument();
    expect(screen.queryByText(/NIST SP 800-171 Assessment - Q1 2024/i)).not.toBeInTheDocument();
  });

  it('filters assessments by status', () => {
    renderReportsPage();
    
    const statusFilter = screen.getByLabelText(/Status/i);
    fireEvent.change(statusFilter, { target: { value: 'completed' } });
    
    // Should only show completed assessments
    expect(screen.getByText(/CMMC 2.0 Level 2 Assessment - Q1 2024/i)).toBeInTheDocument();
    expect(screen.queryByText(/NIST SP 800-171 Assessment - Q1 2024/i)).not.toBeInTheDocument();
  });

  it('handles assessment search', () => {
    renderReportsPage();
    
    const searchInput = screen.getByPlaceholderText(/Search assessments.../i);
    fireEvent.change(searchInput, { target: { value: 'CMMC' } });
    
    // Should only show assessments containing "CMMC"
    expect(screen.getByText(/CMMC 2.0 Level 2 Assessment - Q1 2024/i)).toBeInTheDocument();
    expect(screen.queryByText(/NIST SP 800-171 Assessment - Q1 2024/i)).not.toBeInTheDocument();
  });

  it('shows assessment comparison', () => {
    renderReportsPage();
    
    expect(screen.getByText(/Compare Assessments/i)).toBeInTheDocument();
    
    // Select assessments for comparison
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]); // Select first assessment
    fireEvent.click(checkboxes[2]); // Select second assessment
    
    // Should show comparison button
    expect(screen.getByRole('button', { name: /Compare Selected/i })).toBeInTheDocument();
  });

  it('handles assessment comparison', async () => {
    renderReportsPage();
    
    // Select assessments for comparison
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]); // Select first assessment
    fireEvent.click(checkboxes[2]); // Select second assessment
    
    // Click compare button
    const compareButton = screen.getByRole('button', { name: /Compare Selected/i });
    fireEvent.click(compareButton);
    
    // Should show comparison view
    expect(screen.getByText(/Assessment Comparison/i)).toBeInTheDocument();
    expect(screen.getByText(/CMMC 2.0 Level 2 Assessment - Q1 2024/i)).toBeInTheDocument();
    expect(screen.getByText(/NIST SP 800-171 Assessment - Q1 2024/i)).toBeInTheDocument();
  });

  it('shows assessment trends', () => {
    renderReportsPage();
    
    expect(screen.getByText(/Assessment Trends/i)).toBeInTheDocument();
    
    // Should show trend charts
    expect(screen.getByText(/Score Over Time/i)).toBeInTheDocument();
    expect(screen.getByText(/Gap Analysis Trends/i)).toBeInTheDocument();
  });

  it('handles new assessment creation', () => {
    const mockOnStartAssessment = vi.fn();
    
    render(
      <BrowserRouter>
        <AssessmentReportsPage
          savedAssessments={mockAssessments}
          onGenerateReport={() => {}}
          onExportReport={() => {}}
          onStartAssessment={mockOnStartAssessment}
          userProfile={null}
          addNotification={() => {}}
        />
      </BrowserRouter>
    );
    
    const newAssessmentButton = screen.getByRole('button', { name: /Start New Assessment/i });
    fireEvent.click(newAssessmentButton);
    
    expect(mockOnStartAssessment).toHaveBeenCalled();
  });

  it('shows report history', () => {
    renderReportsPage();
    
    expect(screen.getByText(/Report History/i)).toBeInTheDocument();
    
    // Should show previously generated reports
    expect(screen.getByText(/Generated Reports/i)).toBeInTheDocument();
  });

  it('handles report scheduling', () => {
    renderReportsPage();
    
    expect(screen.getByText(/Schedule Reports/i)).toBeInTheDocument();
    
    const scheduleButton = screen.getByRole('button', { name: /Schedule Report/i });
    fireEvent.click(scheduleButton);
    
    // Should show scheduling interface
    expect(screen.getByText(/Report Schedule/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Frequency/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Recipients/i)).toBeInTheDocument();
  });

  it('shows compliance dashboard link', () => {
    renderReportsPage();
    
    expect(screen.getByText(/View Compliance Dashboard/i)).toBeInTheDocument();
    
    const dashboardLink = screen.getByRole('link', { name: /View Compliance Dashboard/i });
    expect(dashboardLink).toHaveAttribute('href', '/compliance');
  });

  it('shows advanced reporting link', () => {
    renderReportsPage();
    
    expect(screen.getByText(/Advanced Reporting/i)).toBeInTheDocument();
    
    const advancedLink = screen.getByRole('link', { name: /Advanced Reporting/i });
    expect(advancedLink).toHaveAttribute('href', '/reports/advanced');
  });

  it('shows team tracking link', () => {
    renderReportsPage();
    
    expect(screen.getByText(/Team Tracking/i)).toBeInTheDocument();
    
    const teamLink = screen.getByRole('link', { name: /Team Tracking/i });
    expect(teamLink).toHaveAttribute('href', '/reports/team');
  });

  it('shows compliance gap analyzer link', () => {
    renderReportsPage();
    
    expect(screen.getByText(/Compliance Gap Analyzer/i)).toBeInTheDocument();
    
    const gapLink = screen.getByRole('link', { name: /Compliance Gap Analyzer/i });
    expect(gapLink).toHaveAttribute('href', '/reports/compliance');
  });

  it('handles empty assessment list', () => {
    render(
      <BrowserRouter>
        <AssessmentReportsPage
          savedAssessments={[]}
          onGenerateReport={() => {}}
          onExportReport={() => {}}
          onStartAssessment={() => {}}
          userProfile={null}
          addNotification={() => {}}
        />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/No assessments found/i)).toBeInTheDocument();
    expect(screen.getByText(/Start your first assessment to generate reports/i)).toBeInTheDocument();
  });

  it('shows assessment completion progress', () => {
    renderReportsPage();
    
    // Should show progress bars for each assessment
    expect(screen.getByText(/Progress/i)).toBeInTheDocument();
    
    // Check for progress indicators
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars).toHaveLength(2);
  });

  it('handles report template customization', () => {
    renderReportsPage();
    
    expect(screen.getByText(/Customize Templates/i)).toBeInTheDocument();
    
    const customizeButton = screen.getByRole('button', { name: /Customize Templates/i });
    fireEvent.click(customizeButton);
    
    // Should show customization interface
    expect(screen.getByText(/Template Customization/i)).toBeInTheDocument();
  });
});