import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RouteRenderer } from '../RouteRenderer';
import type { RouteConfig } from '../RouteRenderer';

// Mock the useAppState hook
vi.mock('../../hooks/useAppState', () => ({
  useAppState: () => ({
    userProfile: {
      id: '1',
      email: 'test@example.com',
      name: 'Test User'
    }
  })
}));

// Mock StartScreen component
const MockStartScreen = ({ onStartAssessment, onContinue, userProfile }: any) => (
  <div data-testid="start-screen">
    <button onClick={onStartAssessment}>Start Assessment</button>
    <button onClick={onContinue}>Continue</button>
    <div>{userProfile?.email}</div>
  </div>
);

// Mock Dashboard component
const MockDashboard = () => <div data-testid="dashboard">Dashboard</div>;

describe('RouteRenderer', () => {
  it('should render routes correctly', () => {
    const routes: RouteConfig[] = [
      {
        path: '/dashboard',
        element: MockDashboard
      }
    ];

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <RouteRenderer routes={routes} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
  });

  it('should handle StartScreen route with props', () => {
    const routes: RouteConfig[] = [
      {
        path: '/',
        element: MockStartScreen
      }
    ];

    const { getByText } = render(
      <MemoryRouter initialEntries={["/"]}>
        <RouteRenderer routes={routes} />
      </MemoryRouter>
    );

    expect(getByText('Start Assessment')).toBeInTheDocument();
    expect(getByText('Continue')).toBeInTheDocument();
    expect(getByText('test@example.com')).toBeInTheDocument();
  });

  it('should render routes with props', () => {
    const MockComponentWithProps = ({ customProp }: { customProp?: string }) => (
      <div data-testid="custom-component">{customProp}</div>
    );

    const routes: RouteConfig[] = [
      {
        path: '/custom',
        element: MockComponentWithProps,
        props: { customProp: 'test value' }
      }
    ];

    const { getByText } = render(
      <MemoryRouter initialEntries={["/custom"]}>
        <RouteRenderer routes={routes} />
      </MemoryRouter>
    );

    expect(getByText('test value')).toBeInTheDocument();
  });

  it('should render multiple routes', () => {
    const routes: RouteConfig[] = [
      {
        path: '/page1',
        element: () => <div data-testid="page1">Page 1</div>
      },
      {
        path: '/page2',
        element: () => <div data-testid="page2">Page 2</div>
      }
    ];

    render(
      <MemoryRouter initialEntries={["/page1"]}>
        <RouteRenderer routes={routes} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('page1')).toBeInTheDocument();
  });
});

