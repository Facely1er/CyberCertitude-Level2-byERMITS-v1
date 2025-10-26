import { Target, GitBranch as GitBranchIcon, Activity, Calendar, CheckSquare, BookOpen } from 'lucide-react';
import { Breadcrumbs } from '../shared/components/layout/Breadcrumbs';
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
      <div className="container-responsive section-padding">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={[
            { label: 'CMMC 2.0 Platform', path: '/dashboard' },
            { label: 'Assets', path: '/assets' },
            { label: 'Asset Categories', isActive: true }
          ]} />
        </div>

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
                  <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Asset Categories</h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Organize and manage asset categories and classifications
                  </p>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg whitespace-nowrap">
                Coming Soon
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Coming Soon</h3>
              <p className="text-blue-700 dark:text-blue-200">
                Asset categorization functionality will be implemented here.
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    title: "Asset Categories"
  },
  {
    path: "/assets/dependencies",
    element: () => (
      <div className="container-responsive section-padding">
        <div className="mb-6">
          <Breadcrumbs items={[
            { label: 'CMMC 2.0 Platform', path: '/dashboard' },
            { label: 'Assets', path: '/assets' },
            { label: 'Asset Dependencies', isActive: true }
          ]} />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-xl">
                  <GitBranchIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Asset Dependencies</h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Map and manage relationships between assets
                  </p>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg whitespace-nowrap">
                Coming Soon
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-800 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">Coming Soon</h3>
              <p className="text-purple-700 dark:text-purple-200">
                Asset dependency mapping functionality will be implemented here.
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    title: "Asset Dependencies"
  },
  {
    path: "/assets/workflow",
    element: () => (
      <div className="container-responsive section-padding">
        <div className="mb-6">
          <Breadcrumbs items={[
            { label: 'CMMC 2.0 Platform', path: '/dashboard' },
            { label: 'Assets', path: '/assets' },
            { label: 'Asset Workflow', isActive: true }
          ]} />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl">
                  <Activity className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Asset Workflow</h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Manage asset lifecycle and workflow processes
                  </p>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg whitespace-nowrap">
                Coming Soon
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">Coming Soon</h3>
              <p className="text-green-700 dark:text-green-200">
                Asset workflow management functionality will be implemented here.
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    title: "Asset Workflow"
  },
  {
    path: "/assets/roadmap",
    element: () => (
      <div className="container-responsive section-padding">
        <div className="mb-6">
          <Breadcrumbs items={[
            { label: 'CMMC 2.0 Platform', path: '/dashboard' },
            { label: 'Assets', path: '/assets' },
            { label: 'Asset Roadmap', isActive: true }
          ]} />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-xl">
                  <Calendar className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Asset Roadmap</h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Plan and track asset implementation timeline and milestones
                  </p>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg whitespace-nowrap">
                Coming Soon
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl border border-orange-200 dark:border-orange-800 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <BookOpen className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100">Coming Soon</h3>
              <p className="text-orange-700 dark:text-orange-200">
                Asset roadmap planning functionality will be implemented here.
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    title: "Asset Roadmap"
  },
  {
    path: "/assets/action-plan",
    element: () => (
      <div className="container-responsive section-padding">
        <div className="mb-6">
          <Breadcrumbs items={[
            { label: 'CMMC 2.0 Platform', path: '/dashboard' },
            { label: 'Assets', path: '/assets' },
            { label: 'Asset Action Plan', isActive: true }
          ]} />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl">
                  <CheckSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Asset Action Plan</h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Create and manage detailed action plans for asset management
                  </p>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg whitespace-nowrap">
                Coming Soon
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Coming Soon</h3>
              <p className="text-blue-700 dark:text-blue-200">
                Asset action plan functionality will be implemented here.
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    title: "Asset Action Plan"
  }
];
