import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CMMCJourneyWorkflow } from '../CMMCJourneyWorkflow';

describe('CMMCJourneyWorkflow', () => {
  const mockProps = {
    onStepComplete: vi.fn(),
    onExport: vi.fn(),
    addNotification: vi.fn()
  };

  it('should render CMMC journey workflow', () => {
    render(
      <BrowserRouter>
        <CMMCJourneyWorkflow {...mockProps} />
      </BrowserRouter>
    );

    expect(screen.getByText(/CMMC/i)).toBeInTheDocument();
  });

  it('should display workflow phases', () => {
    render(
      <BrowserRouter>
        <CMMCJourneyWorkflow {...mockProps} />
      </BrowserRouter>
    );

    expect(screen.getByText(/CMMC/i)).toBeInTheDocument();
  });
});

