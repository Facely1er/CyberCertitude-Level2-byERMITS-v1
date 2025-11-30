import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';
import { createRef } from 'react';

// Component that throws an error
const ThrowingComponent = ({ shouldThrow }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  it('should render children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Child content</div>
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('should display error message when error occurs', () => {
    // Mock console.error to suppress error logging
    const originalError = console.error;
    console.error = vi.fn();

    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    // Error boundary should catch and display error
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

    console.error = originalError;
  });

  it('should handle null children', () => {
    const { container } = render(
      <ErrorBoundary>
        {null}
      </ErrorBoundary>
    );
    
    expect(container).toBeDefined();
  });

  it('should handle undefined children', () => {
    const { container } = render(
      <ErrorBoundary>
        {undefined}
      </ErrorBoundary>
    );
    
    expect(container).toBeDefined();
  });

  it('should handle multiple children', () => {
    render(
      <ErrorBoundary>
        <div>Child 1</div>
        <div>Child 2</div>
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });
});

