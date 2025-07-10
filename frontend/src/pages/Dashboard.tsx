import { 
  ChartBarIcon, 
  CogIcon, 
  UserGroupIcon, 
  BookOpenIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

interface PlatformStatus {
  initialized: boolean;
  governanceActive: boolean;
  governedRepositories: string[];
}

interface DashboardMetrics {
  totalRepositories: number;
  totalPolicies: number;
  compliantPolicies: number;
  violations: number;
  criticalIssues: number;
  totalSessions: number;
  averageSessionDuration: string;
}

export const Dashboard = () => {
  const [platformStatus, setPlatformStatus] = useState<PlatformStatus | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch platform status
        const statusResponse = await fetch('http://localhost:3001/api/status');
        const statusData = await statusResponse.json();
        setPlatformStatus(statusData);

        // Fetch dashboard metrics
        const metricsResponse = await fetch('http://localhost:3001/api/dashboard');
        const metricsData = await metricsResponse.json();
        setMetrics(metricsData.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const quickActions = [
    {
      name: 'Run Governance Audit',
      description: 'Check all repositories for compliance',
      icon: ShieldCheckIcon,
      href: '/governance/audit',
      color: 'bg-blue-500'
    },
    {
      name: 'View Roadmap',
      description: 'Product roadmap and task management',
      icon: ArrowTrendingUpIcon,
      href: '/roadmap',
      color: 'bg-green-500'
    },
    {
      name: 'System Master',
      description: 'System control and monitoring',
      icon: CogIcon,
      href: '/systemmaster',
      color: 'bg-purple-500'
    },
    {
      name: 'Team Portal',
      description: 'Team collaboration and management',
      icon: UserGroupIcon,
      href: '/teamportal',
      color: 'bg-orange-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading platform data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Greenlight Platform Dashboard</h1>
          <p className="text-gray-600 mt-2">Central governance and monitoring system</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${platformStatus?.initialized ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600">
            {platformStatus?.initialized ? 'Platform Active' : 'Platform Initializing'}
          </span>
        </div>
      </div>

      {/* Platform Status */}
      {platformStatus && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${platformStatus.initialized ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                Initialized: {platformStatus.initialized ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${platformStatus.governanceActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                Governance: {platformStatus.governanceActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600">
                Repositories: {platformStatus.governedRepositories.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{metrics.totalRepositories}</div>
                <div className="text-sm text-gray-600">Repositories</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <ShieldCheckIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{metrics.compliantPolicies}</div>
                <div className="text-sm text-gray-600">Compliant Policies</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <CogIcon className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{metrics.violations}</div>
                <div className="text-sm text-gray-600">Violations</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <UserGroupIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{metrics.totalSessions}</div>
                <div className="text-sm text-gray-600">Total Sessions</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <a
              key={action.name}
              href={action.href}
              className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${action.color}`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{action.name}</div>
                  <div className="text-sm text-gray-600">{action.description}</div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Platform Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Sections</h2>
          <div className="space-y-3">
            <a href="/articulate" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <BookOpenIcon className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium text-gray-900">Articulate</div>
                <div className="text-sm text-gray-600">Intelligent Work Management Engine</div>
              </div>
            </a>
            
                         <a href="/elevate" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
               <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium text-gray-900">Elevate</div>
                <div className="text-sm text-gray-600">Coaching Excellence & Performance Enhancement</div>
              </div>
            </a>
            
            <a href="/administrate" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <CogIcon className="w-5 h-5 text-purple-600" />
              <div>
                <div className="font-medium text-gray-900">Administrate</div>
                <div className="text-sm text-gray-600">Business Management & Administration Tools</div>
              </div>
            </a>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Health</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Governance System</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                platformStatus?.governanceActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {platformStatus?.governanceActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Session Management</span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Protocol Management</span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 