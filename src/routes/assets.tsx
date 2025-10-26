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
        <div className="mb-8">
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
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
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
            <div key={category} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Manage {category.toLowerCase()} assets and their classifications
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">0 assets</span>
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm">
                  Manage →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Asset Categorization</h3>
              <p className="text-blue-700 dark:text-blue-200 mb-3">
                Organize your assets by category to improve compliance tracking and management.
              </p>
              <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
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
        <div className="mb-8">
          <Breadcrumbs items={[
            { label: 'CMMC 2.0 Platform', path: '/dashboard' },
            { label: 'Assets', path: '/assets' },
            { label: 'Asset Dependencies', isActive: true }
          ]} />
        </div>

        {/* Header */}
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
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
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
            { type: 'Critical', count: 12, color: 'red', icon: GitBranchIcon },
            { type: 'High', count: 8, color: 'orange', icon: GitBranchIcon },
            { type: 'Medium', count: 15, color: 'yellow', icon: GitBranchIcon },
            { type: 'Low', count: 5, color: 'green', icon: GitBranchIcon }
          ].map((dep) => (
            <div key={dep.type} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 bg-${dep.color}-100 dark:bg-${dep.color}-900/30 rounded-lg`}>
                    <dep.icon className={`w-6 h-6 text-${dep.color}-600 dark:text-${dep.color}-400`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{dep.type} Dependencies</h3>
                </div>
                <span className={`px-3 py-1 bg-${dep.color}-100 dark:bg-${dep.color}-900/30 text-${dep.color}-800 dark:text-${dep.color}-300 rounded-full text-sm font-medium`}>
                  {dep.count}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Impact Level</span>
                  <span className="font-medium text-gray-900 dark:text-white capitalize">{dep.type.toLowerCase()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Affected Assets</span>
                  <span className="font-medium text-gray-900 dark:text-white">{dep.count}</span>
                </div>
                <button className="w-full mt-3 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm text-left">
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Dependencies */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Dependencies</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { from: 'Database Server', to: 'Web Application', type: 'Provides', criticality: 'Critical' },
                { from: 'Network Switch', to: 'Database Server', type: 'Connects', criticality: 'High' },
                { from: 'Security Gateway', to: 'All Assets', type: 'Protects', criticality: 'Critical' }
              ].map((dep, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <GitBranchIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{dep.from}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{dep.type} → {dep.to}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-xs font-medium`}>
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
        <div className="mb-8">
          <Breadcrumbs items={[
            { label: 'CMMC 2.0 Platform', path: '/dashboard' },
            { label: 'Assets', path: '/assets' },
            { label: 'Asset Workflow', isActive: true }
          ]} />
        </div>

        {/* Header */}
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
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Activity className="w-4 h-4" />
                  <span>New Workflow</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lifecycle Stages */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Asset Lifecycle Stages</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { stage: 'Planning', count: 5, color: 'blue' },
                { stage: 'Deployment', count: 8, color: 'green' },
                { stage: 'Operations', count: 24, color: 'purple' },
                { stage: 'Retirement', count: 3, color: 'orange' }
              ].map((lifecycle) => (
                <div key={lifecycle.stage} className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className={`text-2xl font-bold text-${lifecycle.color}-600 dark:text-${lifecycle.color}-400 mb-2`}>
                    {lifecycle.count}
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{lifecycle.stage}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Workflows */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {[
            { title: 'Security Review', status: 'In Progress', progress: 65, stage: 'Deployment', color: 'green', icon: Activity },
            { title: 'Hardware Refresh', status: 'Pending', progress: 30, stage: 'Planning', color: 'blue', icon: Activity },
            { title: 'Software Update', status: 'Active', progress: 85, stage: 'Operations', color: 'purple', icon: Activity },
            { title: 'Decommission', status: 'Scheduled', progress: 10, stage: 'Retirement', color: 'orange', icon: Activity }
          ].map((workflow, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 bg-${workflow.color}-100 dark:bg-${workflow.color}-900/30 rounded-lg`}>
                    <workflow.icon className={`w-6 h-6 text-${workflow.color}-600 dark:text-${workflow.color}-400`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{workflow.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{workflow.stage}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 bg-${workflow.color}-100 dark:bg-${workflow.color}-900/30 text-${workflow.color}-800 dark:text-${workflow.color}-300 rounded-full text-xs font-medium`}>
                  {workflow.status}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">{workflow.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className={`bg-${workflow.color}-600 h-2 rounded-full`} style={{ width: `${workflow.progress}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Workflow Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Workflow Activities</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { action: 'Asset deployed', asset: 'Web Server 01', user: 'John Doe', time: '2 hours ago', type: 'deployment' },
                { action: 'Security scan completed', asset: 'Database Server 02', user: 'Security Team', time: '5 hours ago', type: 'security' },
                { action: 'Update approved', asset: 'Application Server 03', user: 'Jane Smith', time: '1 day ago', type: 'update' }
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{activity.action}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{activity.asset} • {activity.user} • {activity.time}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-medium capitalize">
                    {activity.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800 p-6">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">Asset Lifecycle Management</h3>
              <p className="text-green-700 dark:text-green-200 mb-3">
                Comprehensive workflow management ensures proper asset lifecycle tracking from planning through retirement, supporting CMMC compliance requirements.
              </p>
              <ul className="text-sm text-green-700 dark:text-green-200 space-y-1">
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
        <div className="mb-8">
          <Breadcrumbs items={[
            { label: 'CMMC 2.0 Platform', path: '/dashboard' },
            { label: 'Assets', path: '/assets' },
            { label: 'Asset Roadmap', isActive: true }
          ]} />
        </div>

        {/* Header */}
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
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Calendar className="w-4 h-4" />
                  <span>New Milestone</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Milestones */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Upcoming Milestones</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { milestone: 'Security Hardening Complete', asset: 'Production Servers', date: 'Q1 2024', status: 'On Track', color: 'green' },
                { milestone: 'Compliance Audit', asset: 'All Assets', date: 'Q2 2024', status: 'Planned', color: 'blue' },
                { milestone: 'Hardware Refresh', asset: 'Workstations', date: 'Q3 2024', status: 'Planning', color: 'orange' },
                { milestone: 'Security Gateway Deployment', asset: 'Network Infrastructure', date: 'Q1 2024', status: 'Delayed', color: 'red' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded-lg`}>
                      <Calendar className={`w-5 h-5 text-${item.color}-600 dark:text-${item.color}-400`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{item.milestone}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{item.asset} • Target: {item.date}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 bg-${item.color}-100 dark:bg-${item.color}-900/30 text-${item.color}-800 dark:text-${item.color}-300 rounded-full text-xs font-medium`}>
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
            { quarter: 'Q1 2024', projects: 5, completed: 3, color: 'orange', icon: Calendar },
            { quarter: 'Q2 2024', projects: 8, completed: 0, color: 'blue', icon: Calendar },
            { quarter: 'Q3 2024', projects: 6, completed: 0, color: 'green', icon: Calendar },
            { quarter: 'Q4 2024', projects: 4, completed: 0, color: 'purple', icon: Calendar }
          ].map((quarter, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 bg-${quarter.color}-100 dark:bg-${quarter.color}-900/30 rounded-lg`}>
                    <quarter.icon className={`w-6 h-6 text-${quarter.color}-600 dark:text-${quarter.color}-400`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{quarter.quarter}</h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{quarter.completed}/{quarter.projects}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">completed</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                <div className={`bg-${quarter.color}-600 h-2 rounded-full`} style={{ width: `${(quarter.completed / quarter.projects) * 100}%` }}></div>
              </div>
              <button className="w-full text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium text-sm text-left">
                View Timeline →
              </button>
            </div>
          ))}
        </div>

        {/* Project Priorities */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Project Priorities</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {[
                { project: 'Security Enhancement Program', priority: 'Critical', progress: 75, color: 'red' },
                { project: 'Infrastructure Modernization', priority: 'High', progress: 50, color: 'orange' },
                { project: 'Compliance Documentation', priority: 'High', progress: 90, color: 'yellow' },
                { project: 'Training Program', priority: 'Medium', progress: 30, color: 'blue' }
              ].map((project, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{project.project}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className={`bg-${project.color}-600 h-2 rounded-full`} style={{ width: `${project.progress}%` }}></div>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{project.progress}%</span>
                    </div>
                  </div>
                  <span className={`ml-4 px-3 py-1 bg-${project.color}-100 dark:bg-${project.color}-900/30 text-${project.color}-800 dark:text-${project.color}-300 rounded-full text-xs font-medium`}>
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
        <div className="mb-8">
          <Breadcrumbs items={[
            { label: 'CMMC 2.0 Platform', path: '/dashboard' },
            { label: 'Assets', path: '/assets' },
            { label: 'Asset Action Plan', isActive: true }
          ]} />
        </div>

        {/* Header */}
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
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
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
            { label: 'Total Actions', value: 42, color: 'blue', icon: CheckSquare },
            { label: 'Active', value: 28, color: 'green', icon: CheckSquare },
            { label: 'Pending', value: 8, color: 'orange', icon: CheckSquare },
            { label: 'Completed', value: 6, color: 'purple', icon: CheckSquare }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
              <div className={`text-3xl font-bold text-${stat.color}-600 dark:text-${stat.color}-400 mb-2`}>
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Active Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Active Actions</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { action: 'Apply security patches', asset: 'Database Server 01', assignee: 'Admin Team', due: 'Jan 15, 2024', status: 'In Progress', priority: 'High', color: 'orange', icon: CheckSquare },
                { action: 'Update access controls', asset: 'Web Application', assignee: 'Security Team', due: 'Jan 20, 2024', status: 'Assigned', priority: 'Critical', color: 'red', icon: CheckSquare },
                { action: 'Perform security audit', asset: 'Network Infrastructure', assignee: 'Audit Team', due: 'Jan 18, 2024', status: 'In Progress', priority: 'High', color: 'orange', icon: CheckSquare },
                { action: 'Review configuration', asset: 'All Servers', assignee: 'IT Team', due: 'Jan 25, 2024', status: 'Not Started', priority: 'Medium', color: 'blue', icon: CheckSquare }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded-lg`}>
                      <item.icon className={`w-5 h-5 text-${item.color}-600 dark:text-${item.color}-400`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{item.action}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{item.asset} • {item.assignee} • Due: {item.due}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 bg-${item.color}-100 dark:bg-${item.color}-900/30 text-${item.color}-800 dark:text-${item.color}-300 rounded-full text-xs font-medium`}>
                      {item.priority}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full text-xs font-medium">
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
            { priority: 'Critical', actions: 5, completed: 1, color: 'red', icon: CheckSquare },
            { priority: 'High', actions: 15, completed: 8, color: 'orange', icon: CheckSquare },
            { priority: 'Medium', actions: 18, completed: 12, color: 'yellow', icon: CheckSquare },
            { priority: 'Low', actions: 4, completed: 3, color: 'green', icon: CheckSquare }
          ].map((plan, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 bg-${plan.color}-100 dark:bg-${plan.color}-900/30 rounded-lg`}>
                    <plan.icon className={`w-6 h-6 text-${plan.color}-600 dark:text-${plan.color}-400`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{plan.priority} Priority</h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{plan.completed}/{plan.actions}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">completed</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className={`bg-${plan.color}-600 h-2 rounded-full`} style={{ width: `${(plan.completed / plan.actions) * 100}%` }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Completions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Completions</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {[
                { action: 'Security hardening completed', asset: 'Web Server 01', completed: 'Jan 12, 2024', by: 'Security Team' },
                { action: 'Access review completed', asset: 'Database Systems', completed: 'Jan 10, 2024', by: 'Admin Team' },
                { action: 'Compliance documentation updated', asset: 'All Systems', completed: 'Jan 8, 2024', by: 'Compliance Team' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <CheckSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{item.action}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{item.asset} • Completed: {item.completed} by {item.by}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-medium">
                    Completed
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Asset Action Plans</h3>
              <p className="text-blue-700 dark:text-blue-200 mb-3">
                Comprehensive action plan management ensures timely completion of asset-related tasks and compliance with CMMC requirements.
              </p>
              <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
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
