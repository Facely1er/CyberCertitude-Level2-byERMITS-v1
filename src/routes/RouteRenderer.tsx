import React from 'react';
import { Routes, Route } from 'react-router-dom';

export interface RouteConfig {
  path: string;
  element: React.ComponentType<any> | (() => JSX.Element);
  title?: string;
}

export interface RouteRendererProps {
  routes: RouteConfig[];
}

export const RouteRenderer: React.FC<RouteRendererProps> = ({ routes }) => {
  return (
    <Routes>
      {routes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={React.createElement(route.element)}
        />
      ))}
    </Routes>
  );
};
