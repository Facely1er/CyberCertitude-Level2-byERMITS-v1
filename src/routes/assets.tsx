import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, GitBranch as GitBranchIcon, Activity, Calendar, CheckSquare, BookOpen } from 'lucide-react';
import { Breadcrumbs } from '../shared/components/layout/Breadcrumbs';
import { 
  AssetDashboard,
  AssetInventoryView
} from '../components/LazyComponents';
import { assetService } from '../services/assetService';

// Wrapper components that provide necessary data
const AssetDashboardWrapper = () => {
  const navigate = useNavigate();
  const [assets] = React.useState(() => assetService.getAllAssets());
  
  return (
    <AssetDashboard
      assets={assets || []}
      onViewAsset={(asset) => console.log('View asset:', asset)}
      onCreateAsset={() => console.log('Create asset')}
      onViewInventory={() => navigate('/assets/inventory')}
      onViewCategories={() => navigate('/assets/categories')}
      onViewDependencies={() => navigate('/assets/dependencies')}
      onViewWorkflow={() => navigate('/assets/workflow')}
      onViewRoadmap={() => navigate('/assets/roadmap')}
      onViewActionPlan={() => navigate('/assets/action-plan')}
    />
  );
};

const AssetInventoryWrapper = () => {
  const [assets] = React.useState(() => assetService.getAllAssets());
  
  return (
    <AssetInventoryView
      assets={assets || []}
      onViewAsset={(asset) => console.log('View asset:', asset)}
      onEditAsset={(asset) => console.log('Edit asset:', asset)}
      onDeleteAsset={(assetId) => console.log('Delete asset:', assetId)}
      onCreateAsset={() => console.log('Create asset')}
      onExportAssets={() => console.log('Export assets')}
      onImportAssets={(file) => console.log('Import assets:', file)}
      onBack={() => window.history.back()}
    />
  );
};

export const assetRoutes = [
  {
    path: "/assets",
    element: AssetDashboardWrapper,
    title: "Asset Dashboard"
  },
  {
    path: "/assets/inventory",
    element: AssetInventoryWrapper,
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
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
                  <Target className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Asset Categories</h1>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark">
                    Organize and manage asset categories and classifications
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 border border-support-light dark:border-support-dark text-text-primary-light dark:text-text-secondary-dark px-4 py-2 rounded-lg hover:bg-background-light dark:hover:bg-surface-dark transition-colors">
                  <Target className="w-4 h-4" />
                  <span>Manage Categories</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Asset Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {['Hardware', 'Software', 'Data', 'Personnel', 'Facilities', 'Services'].map((category) => (
            <div key={category} className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-lg border border-support-light dark:border-support-dark hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <Target className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">{category}</h3>
              </div>
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mb-4">
                Manage {category.toLowerCase()} assets and their classifications
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-support-light dark:border-support-dark">
                <span className="text-sm text-text-muted-light dark:text-text-muted-dark">0 assets</span>
                <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm">
                  Manage →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-primary-200 dark:border-primary-800 p-6">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-2">Asset Categorization</h3>
              <p className="text-primary-700 dark:text-primary-200 mb-3">
                Organize your assets by category to improve compliance tracking and management.
              </p>
              <ul className="text-sm text-primary-700 dark:text-primary-200 space-y-1">
                <li>• Hardware: Physical devices and equipment</li>
                <li>• Software: Applications and systems</li>
                <li>• Data: Information assets and databases</li>
                <li>• Personnel: Staff and contractors</li>
                <li>• Facilities: Buildings and locations</li>
                <li>• Services: Cloud and outsourced functions</li>
              </ul>
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
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={[
            { label: 'CMMC 2.0 Platform', path: '/dashboard' },
            { label: 'Assets', path: '/assets' },
            { label: 'Asset Dependencies', isActive: true }
          ]} />
        </div>

        {/* Header */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-xl">
                  <GitBranchIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Asset Dependencies</h1>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark">
                    Map and manage relationships between assets
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 border border-support-light dark:border-support-dark text-text-primary-light dark:text-text-secondary-dark px-4 py-2 rounded-lg hover:bg-background-light dark:hover:bg-surface-dark transition-colors">
                  <GitBranchIcon className="w-4 h-4" />
                  <span>Add Dependency</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dependency Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {[
            { type: 'Critical', count: 12, bgClass: 'bg-error-100 dark:bg-error-900/30', iconClass: 'text-error-600 dark:text-error-400', badgeClass: 'bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-300', icon: GitBranchIcon },
            { type: 'High', count: 8, bgClass: 'bg-orange-100 dark:bg-orange-900/30', iconClass: 'text-orange-600 dark:text-orange-400', badgeClass: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300', icon: GitBranchIcon },
            { type: 'Medium', count: 15, bgClass: 'bg-yellow-100 dark:bg-yellow-900/30', iconClass: 'text-yellow-600 dark:text-yellow-400', badgeClass: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300', icon: GitBranchIcon },
            { type: 'Low', count: 5, bgClass: 'bg-success-100 dark:bg-success-900/30', iconClass: 'text-success-600 dark:text-success-400', badgeClass: 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300', icon: GitBranchIcon }
          ].map((dep) => (
            <div key={dep.type} className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-lg border border-support-light dark:border-support-dark">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 ${dep.bgClass} rounded-lg`}>
                    <dep.icon className={`w-6 h-6 ${dep.iconClass}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">{dep.type} Dependencies</h3>
                </div>
                <span className={`px-3 py-1 ${dep.badgeClass} rounded-full text-sm font-medium`}>
                  {dep.count}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary-light dark:text-text-secondary-dark">Impact Level</span>
                  <span className="font-medium text-text-primary-light dark:text-text-primary-dark capitalize">{dep.type.toLowerCase()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary-light dark:text-text-secondary-dark">Affected Assets</span>
                  <span className="font-medium text-text-primary-light dark:text-text-primary-dark">{dep.count}</span>
                </div>
                <button className="w-full mt-3 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm text-left">
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Dependencies */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
          <div className="p-6 border-b border-support-light dark:border-support-dark">
            <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">Recent Dependencies</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { from: 'Database Server', to: 'Web Application', type: 'Provides', criticality: 'Critical' },
                { from: 'Network Switch', to: 'Database Server', type: 'Connects', criticality: 'High' },
                { from: 'Security Gateway', to: 'All Assets', type: 'Protects', criticality: 'Critical' }
              ].map((dep, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-support-light dark:border-support-dark rounded-lg">
                  <div className="flex items-center space-x-4">
                    <GitBranchIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <div>
                      <p className="font-medium text-text-primary-light dark:text-text-primary-dark">{dep.from}</p>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{dep.type} → {dep.to}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-300 rounded-full text-xs font-medium`}>
                    {dep.criticality}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-800 p-6">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">Asset Dependencies</h3>
              <p className="text-purple-700 dark:text-purple-200 mb-3">
                Understanding asset dependencies is crucial for CMMC compliance. Track relationships between assets to identify critical paths and security dependencies.
              </p>
              <ul className="text-sm text-purple-700 dark:text-purple-200 space-y-1">
                <li>• Map critical asset relationships</li>
                <li>• Identify security dependencies</li>
                <li>• Track impact of asset changes</li>
                <li>• Support security incident response</li>
              </ul>
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
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={[
            { label: 'CMMC 2.0 Platform', path: '/dashboard' },
            { label: 'Assets', path: '/assets' },
            { label: 'Asset Workflow', isActive: true }
          ]} />
        </div>

        {/* Header */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl">
                  <Activity className="w-8 h-8 text-success-600 dark:text-success-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Asset Workflow</h1>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark">
                    Manage asset lifecycle and workflow processes
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 border border-support-light dark:border-support-dark text-text-primary-light dark:text-text-secondary-dark px-4 py-2 rounded-lg hover:bg-background-light dark:hover:bg-surface-dark transition-colors">
                  <Activity className="w-4 h-4" />
                  <span>New Workflow</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lifecycle Stages */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
          <div className="p-6 border-b border-support-light dark:border-support-dark">
            <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">Asset Lifecycle Stages</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { stage: 'Planning', count: 5, class: 'text-primary-600 dark:text-primary-400' },
                { stage: 'Deployment', count: 8, class: 'text-success-600 dark:text-success-400' },
                { stage: 'Operations', count: 24, class: 'text-purple-600 dark:text-purple-400' },
                { stage: 'Retirement', count: 3, class: 'text-orange-600 dark:text-orange-400' }
              ].map((lifecycle) => (
                <div key={lifecycle.stage} className="text-center p-4 bg-background-light dark:bg-surface-dark/50 rounded-lg">
                  <div className={`text-2xl font-bold ${lifecycle.class} mb-2`}>
                    {lifecycle.count}
                  </div>
                  <div className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">{lifecycle.stage}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Workflows */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {[
            { title: 'Security Review', status: 'In Progress', progress: 65, stage: 'Deployment', bgClass: 'bg-success-100 dark:bg-success-900/30', iconClass: 'text-success-600 dark:text-success-400', badgeClass: 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300', progressClass: 'bg-success-600', icon: Activity },
            { title: 'Hardware Refresh', status: 'Pending', progress: 30, stage: 'Planning', bgClass: 'bg-primary-100 dark:bg-primary-900/30', iconClass: 'text-primary-600 dark:text-primary-400', badgeClass: 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300', progressClass: 'bg-primary-600', icon: Activity },
            { title: 'Software Update', status: 'Active', progress: 85, stage: 'Operations', bgClass: 'bg-purple-100 dark:bg-purple-900/30', iconClass: 'text-purple-600 dark:text-purple-400', badgeClass: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300', progressClass: 'bg-purple-600', icon: Activity },
            { title: 'Decommission', status: 'Scheduled', progress: 10, stage: 'Retirement', bgClass: 'bg-orange-100 dark:bg-orange-900/30', iconClass: 'text-orange-600 dark:text-orange-400', badgeClass: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300', progressClass: 'bg-orange-600', icon: Activity }
          ].map((workflow, idx) => (
            <div key={idx} className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 ${workflow.bgClass} rounded-lg`}>
                    <workflow.icon className={`w-6 h-6 ${workflow.iconClass}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">{workflow.title}</h3>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{workflow.stage}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 ${workflow.badgeClass} rounded-full text-xs font-medium`}>
                  {workflow.status}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary-light dark:text-text-secondary-dark">Progress</span>
                  <span className="font-medium text-text-primary-light dark:text-text-primary-dark">{workflow.progress}%</span>
                </div>
                <div className="w-full bg-support-light dark:bg-surface-dark rounded-full h-2">
                  <div className={`${workflow.progressClass} h-2 rounded-full`} style={{ width: `${workflow.progress}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Workflow Timeline */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
          <div className="p-6 border-b border-support-light dark:border-support-dark">
            <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">Recent Workflow Activities</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { action: 'Asset deployed', asset: 'Web Server 01', user: 'John Doe', time: '2 hours ago', type: 'deployment' },
                { action: 'Security scan completed', asset: 'Database Server 02', user: 'Security Team', time: '5 hours ago', type: 'security' },
                { action: 'Update approved', asset: 'Application Server 03', user: 'Jane Smith', time: '1 day ago', type: 'update' }
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-support-light dark:border-support-dark rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Activity className="w-5 h-5 text-success-600 dark:text-success-400" />
                    <div>
                      <p className="font-medium text-text-primary-light dark:text-text-primary-dark">{activity.action}</p>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{activity.asset} • {activity.user} • {activity.time}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300 rounded-full text-xs font-medium capitalize">
                    {activity.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-success-200 dark:border-success-800 p-6">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-success-100 dark:bg-success-900/30 rounded-lg">
              <BookOpen className="w-6 h-6 text-success-600 dark:text-success-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-success-900 dark:text-success-100 mb-2">Asset Lifecycle Management</h3>
              <p className="text-success-700 dark:text-success-200 mb-3">
                Comprehensive workflow management ensures proper asset lifecycle tracking from planning through retirement, supporting CMMC compliance requirements.
              </p>
              <ul className="text-sm text-success-700 dark:text-success-200 space-y-1">
                <li>• Track assets through all lifecycle stages</li>
                <li>• Monitor workflow progress and approvals</li>
                <li>• Automate compliance checking at each stage</li>
                <li>• Maintain audit trail for all asset activities</li>
              </ul>
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
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={[
            { label: 'CMMC 2.0 Platform', path: '/dashboard' },
            { label: 'Assets', path: '/assets' },
            { label: 'Asset Roadmap', isActive: true }
          ]} />
        </div>

        {/* Header */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-xl">
                  <Calendar className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Asset Roadmap</h1>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark">
                    Plan and track asset implementation timeline and milestones
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 border border-support-light dark:border-support-dark text-text-primary-light dark:text-text-secondary-dark px-4 py-2 rounded-lg hover:bg-background-light dark:hover:bg-surface-dark transition-colors">
                  <Calendar className="w-4 h-4" />
                  <span>New Milestone</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Milestones */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
          <div className="p-6 border-b border-support-light dark:border-support-dark">
            <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">Upcoming Milestones</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { milestone: 'Security Hardening Complete', asset: 'Production Servers', date: 'Q1 2024', status: 'On Track', bgClass: 'bg-success-100 dark:bg-success-900/30', iconClass: 'text-success-600 dark:text-success-400', badgeClass: 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300' },
                { milestone: 'Compliance Audit', asset: 'All Assets', date: 'Q2 2024', status: 'Planned', bgClass: 'bg-primary-100 dark:bg-primary-900/30', iconClass: 'text-primary-600 dark:text-primary-400', badgeClass: 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300' },
                { milestone: 'Hardware Refresh', asset: 'Workstations', date: 'Q3 2024', status: 'Planning', bgClass: 'bg-orange-100 dark:bg-orange-900/30', iconClass: 'text-orange-600 dark:text-orange-400', badgeClass: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' },
                { milestone: 'Security Gateway Deployment', asset: 'Network Infrastructure', date: 'Q1 2024', status: 'Delayed', bgClass: 'bg-error-100 dark:bg-error-900/30', iconClass: 'text-error-600 dark:text-error-400', badgeClass: 'bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-300' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-support-light dark:border-support-dark rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 ${item.bgClass} rounded-lg`}>
                      <Calendar className={`w-5 h-5 ${item.iconClass}`} />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary-light dark:text-text-primary-dark">{item.milestone}</p>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{item.asset} • Target: {item.date}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 ${item.badgeClass} rounded-full text-xs font-medium`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {[
            { quarter: 'Q1 2024', projects: 5, completed: 3, bgClass: 'bg-orange-100 dark:bg-orange-900/30', iconClass: 'text-orange-600 dark:text-orange-400', progressClass: 'bg-orange-600', icon: Calendar },
            { quarter: 'Q2 2024', projects: 8, completed: 0, bgClass: 'bg-primary-100 dark:bg-primary-900/30', iconClass: 'text-primary-600 dark:text-primary-400', progressClass: 'bg-primary-600', icon: Calendar },
            { quarter: 'Q3 2024', projects: 6, completed: 0, bgClass: 'bg-success-100 dark:bg-success-900/30', iconClass: 'text-success-600 dark:text-success-400', progressClass: 'bg-success-600', icon: Calendar },
            { quarter: 'Q4 2024', projects: 4, completed: 0, bgClass: 'bg-purple-100 dark:bg-purple-900/30', iconClass: 'text-purple-600 dark:text-purple-400', progressClass: 'bg-purple-600', icon: Calendar }
          ].map((quarter, idx) => (
            <div key={idx} className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 ${quarter.bgClass} rounded-lg`}>
                    <quarter.icon className={`w-6 h-6 ${quarter.iconClass}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">{quarter.quarter}</h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">{quarter.completed}/{quarter.projects}</div>
                  <div className="text-xs text-text-secondary-light dark:text-text-muted-dark">completed</div>
                </div>
              </div>
              <div className="w-full bg-support-light dark:bg-surface-dark rounded-full h-2 mb-4">
                <div className={`${quarter.progressClass} h-2 rounded-full`} style={{ width: `${(quarter.completed / quarter.projects) * 100}%` }}></div>
              </div>
              <button className="w-full text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium text-sm text-left">
                View Timeline →
              </button>
            </div>
          ))}
        </div>

        {/* Project Priorities */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
          <div className="p-6 border-b border-support-light dark:border-support-dark">
            <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">Project Priorities</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {[
                { project: 'Security Enhancement Program', priority: 'Critical', progress: 75, progressClass: 'bg-error-600', badgeClass: 'bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-300' },
                { project: 'Infrastructure Modernization', priority: 'High', progress: 50, progressClass: 'bg-orange-600', badgeClass: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' },
                { project: 'Compliance Documentation', priority: 'High', progress: 90, progressClass: 'bg-yellow-600', badgeClass: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' },
                { project: 'Training Program', priority: 'Medium', progress: 30, progressClass: 'bg-primary-600', badgeClass: 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300' }
              ].map((project, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-support-light dark:border-support-dark rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-text-primary-light dark:text-text-primary-dark">{project.project}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-full bg-support-light dark:bg-surface-dark rounded-full h-2">
                        <div className={`${project.progressClass} h-2 rounded-full`} style={{ width: `${project.progress}%` }}></div>
                      </div>
                      <span className="text-sm text-text-secondary-light dark:text-text-muted-dark">{project.progress}%</span>
                    </div>
                  </div>
                  <span className={`ml-4 px-3 py-1 ${project.badgeClass} rounded-full text-xs font-medium`}>
                    {project.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl border border-orange-200 dark:border-orange-800 p-6">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <BookOpen className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-2">Asset Roadmap Planning</h3>
              <p className="text-orange-700 dark:text-orange-200 mb-3">
                Strategic roadmap planning ensures proper asset lifecycle management and compliance milestone tracking for CMMC requirements.
              </p>
              <ul className="text-sm text-orange-700 dark:text-orange-200 space-y-1">
                <li>• Plan asset deployments and milestones</li>
                <li>• Track project progress and completion</li>
                <li>• Manage resource allocation and priorities</li>
                <li>• Ensure compliance deadline adherence</li>
              </ul>
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
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={[
            { label: 'CMMC 2.0 Platform', path: '/dashboard' },
            { label: 'Assets', path: '/assets' },
            { label: 'Asset Action Plan', isActive: true }
          ]} />
        </div>

        {/* Header */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl">
                  <CheckSquare className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Asset Action Plan</h1>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark">
                    Create and manage detailed action plans for asset management
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 border border-support-light dark:border-support-dark text-text-primary-light dark:text-text-secondary-dark px-4 py-2 rounded-lg hover:bg-background-light dark:hover:bg-surface-dark transition-colors">
                  <CheckSquare className="w-4 h-4" />
                  <span>New Action</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Actions', value: 42, class: 'text-primary-600 dark:text-primary-400', icon: CheckSquare },
            { label: 'Active', value: 28, class: 'text-success-600 dark:text-success-400', icon: CheckSquare },
            { label: 'Pending', value: 8, class: 'text-orange-600 dark:text-orange-400', icon: CheckSquare },
            { label: 'Completed', value: 6, class: 'text-purple-600 dark:text-purple-400', icon: CheckSquare }
          ].map((stat, idx) => (
            <div key={idx} className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6 text-center">
              <div className={`text-3xl font-bold ${stat.class} mb-2`}>
                {stat.value}
              </div>
              <div className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Active Actions */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
          <div className="p-6 border-b border-support-light dark:border-support-dark">
            <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">Active Actions</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { action: 'Apply security patches', asset: 'Database Server 01', assignee: 'Admin Team', due: 'Jan 15, 2024', status: 'In Progress', priority: 'High', bgClass: 'bg-orange-100 dark:bg-orange-900/30', iconClass: 'text-orange-600 dark:text-orange-400', badgeClass: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300', icon: CheckSquare },
                { action: 'Update access controls', asset: 'Web Application', assignee: 'Security Team', due: 'Jan 20, 2024', status: 'Assigned', priority: 'Critical', bgClass: 'bg-error-100 dark:bg-error-900/30', iconClass: 'text-error-600 dark:text-error-400', badgeClass: 'bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-300', icon: CheckSquare },
                { action: 'Perform security audit', asset: 'Network Infrastructure', assignee: 'Audit Team', due: 'Jan 18, 2024', status: 'In Progress', priority: 'High', bgClass: 'bg-orange-100 dark:bg-orange-900/30', iconClass: 'text-orange-600 dark:text-orange-400', badgeClass: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300', icon: CheckSquare },
                { action: 'Review configuration', asset: 'All Servers', assignee: 'IT Team', due: 'Jan 25, 2024', status: 'Not Started', priority: 'Medium', bgClass: 'bg-primary-100 dark:bg-primary-900/30', iconClass: 'text-primary-600 dark:text-primary-400', badgeClass: 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300', icon: CheckSquare }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-support-light dark:border-support-dark rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 ${item.bgClass} rounded-lg`}>
                      <item.icon className={`w-5 h-5 ${item.iconClass}`} />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary-light dark:text-text-primary-dark">{item.action}</p>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{item.asset} • {item.assignee} • Due: {item.due}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 ${item.badgeClass} rounded-full text-xs font-medium`}>
                      {item.priority}
                    </span>
                    <span className="px-3 py-1 bg-support-light dark:bg-surface-dark text-text-primary-light dark:text-text-secondary-dark rounded-full text-xs font-medium">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Plans by Priority */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {[
            { priority: 'Critical', actions: 5, completed: 1, bgClass: 'bg-error-100 dark:bg-error-900/30', iconClass: 'text-error-600 dark:text-error-400', progressClass: 'bg-error-600', icon: CheckSquare },
            { priority: 'High', actions: 15, completed: 8, bgClass: 'bg-orange-100 dark:bg-orange-900/30', iconClass: 'text-orange-600 dark:text-orange-400', progressClass: 'bg-orange-600', icon: CheckSquare },
            { priority: 'Medium', actions: 18, completed: 12, bgClass: 'bg-yellow-100 dark:bg-yellow-900/30', iconClass: 'text-yellow-600 dark:text-yellow-400', progressClass: 'bg-yellow-600', icon: CheckSquare },
            { priority: 'Low', actions: 4, completed: 3, bgClass: 'bg-success-100 dark:bg-success-900/30', iconClass: 'text-success-600 dark:text-success-400', progressClass: 'bg-success-600', icon: CheckSquare }
          ].map((plan, idx) => (
            <div key={idx} className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 ${plan.bgClass} rounded-lg`}>
                    <plan.icon className={`w-6 h-6 ${plan.iconClass}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">{plan.priority} Priority</h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">{plan.completed}/{plan.actions}</div>
                  <div className="text-xs text-text-secondary-light dark:text-text-muted-dark">completed</div>
                </div>
              </div>
              <div className="w-full bg-support-light dark:bg-surface-dark rounded-full h-2">
                <div className={`${plan.progressClass} h-2 rounded-full`} style={{ width: `${(plan.completed / plan.actions) * 100}%` }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Completions */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark mb-8">
          <div className="p-6 border-b border-support-light dark:border-support-dark">
            <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">Recent Completions</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {[
                { action: 'Security hardening completed', asset: 'Web Server 01', completed: 'Jan 12, 2024', by: 'Security Team' },
                { action: 'Access review completed', asset: 'Database Systems', completed: 'Jan 10, 2024', by: 'Admin Team' },
                { action: 'Compliance documentation updated', asset: 'All Systems', completed: 'Jan 8, 2024', by: 'Compliance Team' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-support-light dark:border-support-dark rounded-lg">
                  <div className="flex items-center space-x-4">
                    <CheckSquare className="w-5 h-5 text-success-600 dark:text-success-400" />
                    <div>
                      <p className="font-medium text-text-primary-light dark:text-text-primary-dark">{item.action}</p>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{item.asset} • Completed: {item.completed} by {item.by}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300 rounded-full text-xs font-medium">
                    Completed
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-primary-200 dark:border-primary-800 p-6">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-2">Asset Action Plans</h3>
              <p className="text-primary-700 dark:text-primary-200 mb-3">
                Comprehensive action plan management ensures timely completion of asset-related tasks and compliance with CMMC requirements.
              </p>
              <ul className="text-sm text-primary-700 dark:text-primary-200 space-y-1">
                <li>• Track and manage asset-related actions</li>
                <li>• Assign tasks to responsible teams</li>
                <li>• Monitor progress and completion</li>
                <li>• Ensure compliance deadlines are met</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    ),
    title: "Asset Action Plan"
  }
];
