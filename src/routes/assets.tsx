import React from 'react';
import { 
  AssetDashboard,
  AssetInventoryView
} from '../components/LazyComponents';

export const assetRoutes = [
  {
    path: "/assets",
    element: AssetDashboard,
    title: "Asset Dashboard"
  },
  {
    path: "/assets/inventory",
    element: AssetInventoryView,
    title: "Asset Inventory"
  },
  {
    path: "/assets/categories",
    element: () => (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card-standard p-8">
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">
            Asset Categories
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            Asset categorization functionality will be implemented here.
          </p>
        </div>
      </div>
    ),
    title: "Asset Categories"
  },
  {
    path: "/assets/dependencies",
    element: () => (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card-standard p-8">
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">
            Asset Dependencies
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            Asset dependency mapping functionality will be implemented here.
          </p>
        </div>
      </div>
    ),
    title: "Asset Dependencies"
  },
  {
    path: "/assets/workflow",
    element: () => (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card-standard p-8">
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">
            Asset Workflow
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            Asset workflow management functionality will be implemented here.
          </p>
        </div>
      </div>
    ),
    title: "Asset Workflow"
  },
  {
    path: "/assets/roadmap",
    element: () => (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card-standard p-8">
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">
            Asset Roadmap
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            Asset roadmap planning functionality will be implemented here.
          </p>
        </div>
      </div>
    ),
    title: "Asset Roadmap"
  },
  {
    path: "/assets/action-plan",
    element: () => (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card-standard p-8">
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">
            Asset Action Plan
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            Asset action plan functionality will be implemented here.
          </p>
        </div>
      </div>
    ),
    title: "Asset Action Plan"
  }
];
