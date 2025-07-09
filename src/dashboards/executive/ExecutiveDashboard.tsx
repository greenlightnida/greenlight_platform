import { useState, useEffect } from 'react';

import { 
  ExecutiveDashboardProps, 
  BusinessMetrics, 
  SystemHealth, 
  ExecutiveView 
} from './types';

/**
 * ExecutiveDashboard - Executive-Level System Oversight Interface
 * 
 * PURPOSE: High-level system governance and strategic decision making
 * - Executive metrics and KPIs
 * - Strategic initiative tracking
 * - System health overview
 * - Resource allocation insights
 * - Risk assessment and mitigation
 */

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = () => {
  const [currentView, setCurrentView] = useState<ExecutiveView>('overview');
  const [metrics, setMetrics] = useState<BusinessMetrics>({
    totalRevenue: 450000,
    monthlyGrowth: 12.5,
    activeUsers: 1250,
    userGrowth: 8.3,
    programSuccess: 78.5,
    playerPlacement: 92.1,
    systemUptime: 99.8,
    performanceScore: 94.2
  });
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    overall: 'healthy',
    performance: 'good',
    security: 'secure',
    uptime: 99.8,
    lastIncident: null
  });
  const [initiatives] = useState([
    {
      id: '1',
      name: 'Platform Modernization',
      status: 'in-progress',
      progress: 65,
      budget: 500000,
      spent: 325000,
      timeline: 'Q2 2024',
      priority: 'high'
    },
    {
      id: '2', 
      name: 'AI Integration',
      status: 'planning',
      progress: 25,
      budget: 300000,
      spent: 75000,
      timeline: 'Q3 2024',
      priority: 'medium'
    }
  ]);
  const [alerts] = useState([
    {
      id: '1',
      type: 'performance',
      severity: 'medium',
      title: 'System Performance Degradation',
      description: 'Response times increased by 15% in the last 24 hours',
      timestamp: new Date(),
      resolved: false
    }
  ]);

  useEffect(() => {
    // Load executive dashboard data
    loadExecutiveData();
  }, []);

  const loadExecutiveData = async () => {
// Data loading implementation
  try {
    
    return [];
  } catch (error) {
    console.error('Data loading failed:', error);
    return [];
  }
};
    console.log('Loading executive dashboard data...');
  };

    // TODO: Implement initiative update logic
    console.log('Updating initiative:', initiativeId, updates);
  };

  const handleAlertResolution = (alertId: string) => {
    // TODO: Implement alert resolution logic
    console.log('Resolving alert:', alertId);
  };

  // Helper function for health color
  function getHealthColor(value: string) {
    switch (value) {
      case 'healthy': return 'bg-green-200 text-green-800';
      case 'warning': return 'bg-yellow-200 text-yellow-800';
      case 'critical': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  }

  // Helper function for priority color
  function getPriorityColor(priority: string) {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">System Uptime</h3>
          <p className="text-2xl font-bold text-green-600">{metrics.systemUptime}%</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</h3>
          <p className="text-2xl font-bold text-blue-600">{metrics.activeUsers.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Revenue</h3>
          <p className="text-2xl font-bold text-green-600">${metrics.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Performance Score</h3>
          <p className="text-2xl font-bold text-blue-600">{metrics.performanceScore}%</p>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">System Health</h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(systemHealth).map(([key, value]) => (
            <div key={key} className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{key}</p>
              <p className={`text-lg font-semibold ${getHealthColor(value)}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Alerts</h2>
        <div className="space-y-3">
          {alerts.filter(alert => !alert.resolved).slice(0, 3).map(alert => (
            <div key={alert.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div>
                <p className="font-medium text-red-800 dark:text-red-200">{alert.title}</p>
                <p className="text-sm text-red-600 dark:text-red-300">{alert.description}</p>
              </div>
              <button
                onClick={() => handleAlertResolution(alert.id)}
                className="text-sm text-red-600 hover:text-red-800 dark:text-red-300 dark:hover:text-red-100"
              >
                Resolve
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Program Success</p>
            <p className="text-2xl font-bold text-blue-600">{metrics.programSuccess}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Player Placement</p>
            <p className="text-2xl font-bold text-green-600">{metrics.playerPlacement}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Growth</p>
            <p className="text-2xl font-bold text-purple-600">{metrics.monthlyGrowth}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">User Growth</p>
            <p className="text-2xl font-bold text-orange-600">{metrics.userGrowth}%</p>
          </div>
        </div>
      </div>
    </div>
  );

    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Strategic Initiatives</h2>
        <div className="space-y-4">
          {initiatives.map(initiative => (
            <div key={initiative.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{initiative.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(initiative.priority)}`}>
                  {initiative.priority}
                </span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Progress</p>
                  <p className="font-medium">{initiative.progress}%</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Budget</p>
                  <p className="font-medium">${initiative.budget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Spent</p>
                  <p className="font-medium">${initiative.spent.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Timeline</p>
                  <p className="font-medium">{initiative.timeline}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Detailed System Health</h2>
        <div className="space-y-4">
          {Object.entries(systemHealth).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="capitalize font-medium">{key}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(value)}`}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Resource Allocation</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3">Budget Overview</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Budget</span>
                <span className="font-medium">$800,000</span>
              </div>
              <div className="flex justify-between">
                <span>Allocated</span>
                <span className="font-medium">$400,000</span>
              </div>
              <div className="flex justify-between">
                <span>Available</span>
                <span className="font-medium text-green-600">$400,000</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-3">Team Allocation</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Development</span>
                <span className="font-medium">12 engineers</span>
              </div>
              <div className="flex justify-between">
                <span>Design</span>
                <span className="font-medium">4 designers</span>
              </div>
              <div className="flex justify-between">
                <span>Product</span>
                <span className="font-medium">3 managers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveView = () => (
    <div>Active view placeholder</div>
  );

  return (
    <div className="executive-dashboard">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Executive Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">High-level system governance and strategic oversight</p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'analytics', label: 'Analytics' },
            { key: 'system', label: 'System' },
            { key: 'intelligence', label: 'Intelligence' },
            { key: 'optimization', label: 'Optimization' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setCurrentView(key as ExecutiveView)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                currentView === key
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {renderActiveView()}
      </div>
    </div>
  );
}; 