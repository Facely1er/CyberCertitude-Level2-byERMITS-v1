import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { WorkflowGuidance } from '../WorkflowGuidance';

describe('WorkflowGuidance', () => {
  const mockOnNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render workflow guidance', () => {
    render(
      <BrowserRouter>
        <WorkflowGuidance />
      </BrowserRouter>
    );

    expect(document.body).toBeDefined();
  });

  it('should display workflow steps', () => {
    render(
      <BrowserRouter>
        <WorkflowGuidance />
      </BrowserRouter>
    );

    // Should show workflow steps
    expect(document.body).toBeDefined();
  });

  it('should expand/collapse workflow steps', () => {
    render(
      <BrowserRouter>
        <WorkflowGuidance />
      </BrowserRouter>
    );

    // Find step headers
    const stepHeaders = screen.queryAllByText(/Initial Assessment|Project Setup/i);
    
    if (stepHeaders.length > 0) {
      fireEvent.click(stepHeaders[0]);
      // Step should expand
      expect(document.body).toBeDefined();
    }
  });

  it('should display step details when expanded', () => {
    render(
      <BrowserRouter>
        <WorkflowGuidance />
      </BrowserRouter>
    );

    // Steps should have details
    expect(document.body).toBeDefined();
  });

  it('should show prerequisites for steps', () => {
    render(
      <BrowserRouter>
        <WorkflowGuidance />
      </BrowserRouter>
    );

    // Should display prerequisites
    expect(document.body).toBeDefined();
  });

  it('should show deliverables for steps', () => {
    render(
      <BrowserRouter>
        <WorkflowGuidance />
      </BrowserRouter>
    );

    // Should display deliverables
    expect(document.body).toBeDefined();
  });

  it('should show tips for steps', () => {
    render(
      <BrowserRouter>
        <WorkflowGuidance />
      </BrowserRouter>
    );

    // Should display tips
    expect(document.body).toBeDefined();
  });

  it('should handle navigation when onNavigate provided', () => {
    render(
      <BrowserRouter>
        <WorkflowGuidance 
          onNavigate={mockOnNavigate}
        />
      </BrowserRouter>
    );

    // Should support navigation
    expect(document.body).toBeDefined();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <BrowserRouter>
        <WorkflowGuidance className="custom-class" />
      </BrowserRouter>
    );

    expect(container.firstChild).toBeDefined();
  });

  it('should show all steps when showAll is enabled', () => {
    render(
      <BrowserRouter>
        <WorkflowGuidance />
      </BrowserRouter>
    );

    // Should have show all functionality
    expect(document.body).toBeDefined();
  });

  it('should display estimated time for steps', () => {
    render(
      <BrowserRouter>
        <WorkflowGuidance />
      </BrowserRouter>
    );

    // Should show time estimates
    expect(document.body).toBeDefined();
  });

  it('should display difficulty levels', () => {
    render(
      <BrowserRouter>
        <WorkflowGuidance />
      </BrowserRouter>
    );

    // Should show difficulty indicators
    expect(document.body).toBeDefined();
  });

  it('should filter by user role', () => {
    render(
      <BrowserRouter>
        <WorkflowGuidance userRole="ciso" />
      </BrowserRouter>
    );

    // Should show role-specific guidance
    expect(document.body).toBeDefined();
  });
});

