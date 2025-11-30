import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAppState } from '../hooks/useAppState';

export interface RouteConfig {
  path: string;
  element: React.ComponentType<any> | (() => JSX.Element);
  title?: string;
  props?: any;
}

export interface RouteRendererProps {
  routes: RouteConfig[];
}

export const RouteRenderer: React.FC<RouteRendererProps> = ({ routes }) => {
  const navigate = useNavigate();
  const appState = useAppState();

  // Handle Start Assessment button click - navigate to assessment intro
  const handleStartAssessment = () => {
    navigate('/assessment-intro');
  };

  // Handle Continue to Dashboard
  const handleContinue = () => {
    navigate('/dashboard');
  };

  return (
    <Routes>
      {routes.map((route) => {
        // For StartScreen, pass the required props including userProfile
        if (route.path === '/') {
          return (
            <Route
              key={route.path}
              path={route.path}
              element={React.createElement(route.element, {
                onStartAssessment: handleStartAssessment,
                onContinue: handleContinue,
                userProfile: appState.userProfile,
              })}
            />
          );
        }
        
        // For other routes, render normally
        return (
          <Route
            key={route.path}
            path={route.path}
            element={React.createElement(route.element, route.props || {})}
          />
        );
      })}
    </Routes>
  );
};
