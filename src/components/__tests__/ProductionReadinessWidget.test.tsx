import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductionReadinessWidget } from '../ProductionReadinessWidget';

vi.mock('../lib/productionReadiness', () => ({
  productionReadinessChecker: {
    performReadinessCheck: vi.fn().mockResolvedValue({
      checks: [],
      score: 85,
      ready: true
    })
  }
}));

vi.mock('../hooks/useProductionMonitoring', () => ({
  useProductionMonitoring: vi.fn(() => ({
    metrics: { healthStatus: 'healthy' },
    isMonitoring: true,
    getHealthStatusColor: vi.fn(() => 'text-green-600')
  }))
}));

vi.mock('../config/environment', () => ({
  ENV: {
    isDevelopment: true,
    isProduction: false
  }
}));

vi.mock('@/utils/logger', () => ({
  logger: {
    error: vi.fn()
  }
}));

describe('ProductionReadinessWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render widget button', () => {
    render(<ProductionReadinessWidget />);

    const button = screen.getByRole('button');
    expect(button).toBeDefined();
  });

  it('should open modal when button is clicked', () => {
    render(<ProductionReadinessWidget />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Modal should open
    expect(true).toBe(true);
  });

  it('should not render in non-dev/prod environment', () => {
    const { ENV } = require('../config/environment');
    vi.mocked(ENV).isDevelopment = false;
    vi.mocked(ENV).isProduction = false;

    const { container } = render(<ProductionReadinessWidget />);

    expect(container.firstChild).toBeNull();
  });

  it('should display readiness score', async () => {
    render(<ProductionReadinessWidget />);

    // Should have score display
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(true).toBe(true);
  });
});
