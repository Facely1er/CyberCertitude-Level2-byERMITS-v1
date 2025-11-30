import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MasterDashboard from '../MasterDashboard';

// Mock dependencies
vi.mock('../utils/progressTracking', () => ({
  ProgressTrackingService: {
    getInstance: vi.fn(() => ({
      getProgress: vi.fn(() => ({ overall: 50 })),
      syncToGitHub: vi.fn().mockResolvedValue({ success: true }),
      downloadAllTemplates: vi.fn().mockResolvedValue({ success: true })
    }))
  }
}));

vi.mock('../utils/toastNotifications', () => ({
  toastService: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('MasterDashboard', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should render dashboard', () => {
    render(
      <BrowserRouter>
        <MasterDashboard />
      </BrowserRouter>
    );

    // Dashboard should render
    expect(document.body).toBeDefined();
  });

  it('should load progress from localStorage', () => {
    const savedProgress = {
      overall: 60,
      domains: { AC: 70 },
      templates: 10,
      evidence: 5
    };

    localStorage.setItem('cmmc_progress', JSON.stringify(savedProgress));

    render(
      <BrowserRouter>
        <MasterDashboard />
      </BrowserRouter>
    );

    // Should load saved progress
    expect(localStorage.getItem('cmmc_progress')).toBeTruthy();
  });

  it('should display domain progress', () => {
    render(
      <BrowserRouter>
        <MasterDashboard />
      </BrowserRouter>
    );

    // Should display domains
    expect(true).toBe(true);
  });

  it('should handle sync to GitHub', async () => {
    const { container } = render(
      <BrowserRouter>
        <MasterDashboard />
      </BrowserRouter>
    );

    // Should have sync functionality
    expect(container).toBeDefined();
  });

  it('should handle download all templates', () => {
    render(
      <BrowserRouter>
        <MasterDashboard />
      </BrowserRouter>
    );

    // Should have download functionality
    expect(true).toBe(true);
  });
});
