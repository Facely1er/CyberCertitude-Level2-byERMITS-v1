import { describe, it, expect, vi } from 'vitest';
import { implementationRoutes } from '../implementation';
import { PolicyManagementView, ControlsManagementView } from '../../components/LazyComponents';

// Mock LazyComponents
vi.mock('../../components/LazyComponents', () => ({
  PolicyManagementView: () => <div data-testid="policy-management">Policy Management</div>,
  ControlsManagementView: () => <div data-testid="controls-management">Controls Management</div>
}));

describe('Implementation Routes', () => {
  it('should have all required routes configured', () => {
    expect(implementationRoutes).toBeInstanceOf(Array);
    expect(implementationRoutes.length).toBeGreaterThan(0);
  });

  it('should include overview route', () => {
    const overviewRoute = implementationRoutes.find(r => r.path === '/overview');
    expect(overviewRoute).toBeDefined();
    expect(overviewRoute?.title).toBe('Implementation Overview');
  });

  it('should include project charter route', () => {
    const charterRoute = implementationRoutes.find(r => r.path === '/project-charter');
    expect(charterRoute).toBeDefined();
    expect(charterRoute?.title).toBe('Project Charter');
  });

  it('should include policies route with correct component', () => {
    const policiesRoute = implementationRoutes.find(r => r.path === '/policies');
    expect(policiesRoute).toBeDefined();
    expect(policiesRoute?.title).toBe('Policy Management');
    expect(policiesRoute?.element).toBe(PolicyManagementView);
  });

  it('should include controls route with correct component', () => {
    const controlsRoute = implementationRoutes.find(r => r.path === '/controls');
    expect(controlsRoute).toBeDefined();
    expect(controlsRoute?.title).toBe('Controls Management');
    expect(controlsRoute?.element).toBe(ControlsManagementView);
  });

  it('should include compliance workflow route', () => {
    const workflowRoute = implementationRoutes.find(r => r.path === '/audit-tracker');
    expect(workflowRoute).toBeDefined();
    expect(workflowRoute?.title).toBe('Audit Tracker');
  });

  it('should include C3PAO prep route', () => {
    const c3paoRoute = implementationRoutes.find(r => r.path === '/c3pao-prep');
    expect(c3paoRoute).toBeDefined();
    expect(c3paoRoute?.title).toBe('C3PAO Preparation');
  });

  it('should include SSP generator route', () => {
    const sspRoute = implementationRoutes.find(r => r.path === '/ssp-generator');
    expect(sspRoute).toBeDefined();
    expect(sspRoute?.title).toBe('SSP Generator');
  });

  it('should include POAM manager route', () => {
    const poamRoute = implementationRoutes.find(r => r.path === '/poam-manager');
    expect(poamRoute).toBeDefined();
    expect(poamRoute?.title).toBe('POAM Manager');
  });

  it('should have unique paths', () => {
    const paths = implementationRoutes.map(r => r.path);
    const uniquePaths = new Set(paths);
    expect(paths.length).toBe(uniquePaths.size);
  });
});

