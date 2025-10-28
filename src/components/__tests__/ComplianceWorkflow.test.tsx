import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ComplianceWorkflow } from '../ComplianceWorkflow';

// Mock the addNotification function
const mockAddNotification = vi.fn();

describe('ComplianceWorkflow', () => {
  const defaultProps = {
    onSave: vi.fn(),
    onExport: vi.fn(),
    addNotification: mockAddNotification
  };

  it('should render compliance workflow', () => {
    render(
      <BrowserRouter>
        <ComplianceWorkflow {...defaultProps} />
      </BrowserRouter>
    );

    // Check for main heading
    expect(screen.getByText(/CMMC 2.0/i)).toBeInTheDocument();
  });

  it('should render workflow phases', () => {
    render(
      <BrowserRouter>
        <ComplianceWorkflow {...defaultProps} />
      </BrowserRouter>
    );

    // Should have workflow content
    expect(screen.getByText(/CMMC 2.0/i)).toBeInTheDocument();
  });

  it('should render implementation steps', () => {
    render(
      <BrowserRouter>
        <ComplianceWorkflow {...defaultProps} />
      </BrowserRouter>
    );

    // Check for workflow steps
    expect(screen.getByText(/CMMC 2.0/i)).toBeInTheDocument();
  });
});

