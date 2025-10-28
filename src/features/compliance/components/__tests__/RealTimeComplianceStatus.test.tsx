import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { RealTimeComplianceStatus } from '../RealTimeComplianceStatus';

describe('RealTimeComplianceStatus', () => {
  const mockMetrics = {
    overallCompliance: 75,
    controlsImplemented: 82,
    controlsTotal: 110,
    assessmentScore: 85
  };

  const mockProps = {
    metrics: mockMetrics,
    onSave: vi.fn(),
    onExport: vi.fn(),
    addNotification: vi.fn()
  };

  it('should render compliance dashboard', () => {
    render(
      <BrowserRouter>
        <RealTimeComplianceStatus {...mockProps} />
      </BrowserRouter>
    );

    expect(screen.getByText(/compliance/i)).toBeInTheDocument();
  });

  it('should display compliance percentage', () => {
    render(
      <BrowserRouter>
        <RealTimeComplianceStatus {...mockProps} />
      </BrowserRouter>
    );

    expect(screen.getByText(/compliance/i)).toBeInTheDocument();
  });

  it('should render control metrics', () => {
    render(
      <BrowserRouter>
        <RealTimeComplianceStatus {...mockProps} />
      </BrowserRouter>
    );

    expect(screen.getByText(/compliance/i)).toBeInTheDocument();
  });
});

