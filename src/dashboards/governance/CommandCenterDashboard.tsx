import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  PlayIcon, ClockIcon, CheckCircleIcon, ExclamationTriangleIcon, 
  XCircleIcon, ChartBarIcon, CogIcon, LightBulbIcon 
} from '@heroicons/react/24/outline';

interface CommandDefinition {
  id: string;
  name: string;
  description: string;
  category: 'system' | 'development' | 'governance' | 'analysis' | 'session';
  path: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  dependencies: string[];
  conflicts: string[];
  timeout: number;
  retryCount: number;
  healthStatus: 'healthy' | 'warning' | 'error' | 'unknown';
  lastExecuted?: Date;
  executionCount: number;
  averageExecutionTime: number;
  successRate: number;
  metadata: Record<string, any>;
}

interface CommandAnalytics {
  totalExecutions: number;
  successRate: number;
  averageExecutionTime: number;
  peakUsageTimes: string[];
  commonOptions: string[];
  failurePatterns: string[];
  performanceTrends: {
    trend: 'improving' | 'stable' | 'declining';
    change: number;
  };
  recommendations: string[];
}

interface CommandExecution {
  id: string;
  commandId: string;
  timestamp: Date;
  duration: number;
  success: boolean;
  error?: string;
  options: string[];
  systemResources: {
    memoryUsage: number;
    cpuUsage: number;
    diskUsage: number;
  };
  context: Record<string, any>;
}

const COLORS = {
  healthy: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  unknown: '#6B7280',
  critical: '#DC2626',
  high: '#EA580C',
  medium: '#D97706',
  low: '#059669'
};

const CATEGORY_COLORS = {
  system: '#3B82F6',
  development: '#8B5CF6',
  governance: '#06B6D4',
  analysis: '#10B981',
  session: '#F59E0B'
};

export default function CommandCenterDashboard() {
  const [commands, setCommands] = useState<CommandDefinition[]>([]);
  const [analytics, setAnalytics] = useState<Map<string, CommandAnalytics>>(new Map());
  const [recentExecutions, setRecentExecutions] = useState<CommandExecution[]>([]);
  const [selectedCommand, setSelectedCommand] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'health' | 'optimization'>('overview');

  useEffect(() => {
    loadCommandCenterData();
    const interval = setInterval(loadCommandCenterData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadCommandCenterData = async () => {
    try {
      // In a real implementation, this would fetch from the CommandCenter API
      // For now, we'll simulate the data
      const mockCommands: CommandDefinition[] = [
        {
          id: 'launch',
          name: 'Launch Protocol',
          description: 'Start new session with full context awareness',
          category: 'session',
          path: 'scripts/protocols/launch_protocol.cjs',
          priority: 'critical',
          dependencies: [],
          conflicts: ['checkpoint', 'prewrap', 'wrap'],
          timeout: 120000,
          retryCount: 2,
          healthStatus: 'healthy',
          lastExecuted: new Date(Date.now() - 300000),
          executionCount: 45,
          averageExecutionTime: 85000,
          successRate: 0.96,
          metadata: { contextAwareness: true, sessionManagement: true }
        },
        {
          id: 'anchor',
          name: 'Anchor Manager',
          description: 'Quick system health check for transitions',
          category: 'system',
          path: 'scripts/anchor_manager.cjs',
          priority: 'high',
          dependencies: [],
          conflicts: [],
          timeout: 30000,
          retryCount: 1,
          healthStatus: 'healthy',
          lastExecuted: new Date(Date.now() - 60000),
          executionCount: 128,
          averageExecutionTime: 12000,
          successRate: 0.98,
          metadata: { quickMode: true, transitionOptimized: true }
        },
        {
          id: 'checkpoint',
          name: 'Checkpoint Manager',
          description: 'Comprehensive analysis including governance',
          category: 'analysis',
          path: 'scripts/checkpoint_manager.cjs',
          priority: 'high',
          dependencies: ['anchor'],
          conflicts: ['launch'],
          timeout: 60000,
          retryCount: 1,
          healthStatus: 'warning',
          lastExecuted: new Date(Date.now() - 1800000),
          executionCount: 23,
          averageExecutionTime: 52000,
          successRate: 0.87,
          metadata: { comprehensive: true, governanceIncluded: true }
        },
        {
          id: 'prewrap',
          name: 'Pre-Wrap Protocol',
          description: 'Prepare for session end with context preservation',
          category: 'session',
          path: 'scripts/protocols/context_enabled_pre_wrap_protocol.cjs',
          priority: 'high',
          dependencies: [],
          conflicts: ['launch', 'checkpoint'],
          timeout: 45000,
          retryCount: 2,
          healthStatus: 'healthy',
          lastExecuted: new Date(Date.now() - 900000),
          executionCount: 67,
          averageExecutionTime: 32000,
          successRate: 0.94,
          metadata: { contextPreservation: true, sessionEnd: true }
        },
        {
          id: 'wrap',
          name: 'Wrap Protocol',
          description: 'Complete session with full documentation',
          category: 'session',
          path: 'scripts/protocols/context_enabled_wrap_protocol.cjs',
          priority: 'critical',
          dependencies: ['prewrap'],
          conflicts: ['launch', 'checkpoint', 'prewrap'],
          timeout: 60000,
          retryCount: 2,
          healthStatus: 'healthy',
          lastExecuted: new Date(Date.now() - 1200000),
          executionCount: 34,
          averageExecutionTime: 48000,
          successRate: 0.91,
          metadata: { sessionCompletion: true, documentation: true }
        }
      ];

      const mockAnalytics = new Map<string, CommandAnalytics>();
      mockCommands.forEach(command => {
        mockAnalytics.set(command.id, {
          totalExecutions: command.executionCount,
          successRate: command.successRate,
          averageExecutionTime: command.averageExecutionTime,
          peakUsageTimes: ['09:00', '14:00', '18:00'],
          commonOptions: ['--quick', '--deep', '--verbose'],
          failurePatterns: ['Timeout', 'Memory limit', 'Permission denied'],
          performanceTrends: {
            trend: 'improving' as const,
            change: -5.2
          },
          recommendations: ['Consider increasing timeout', 'Optimize memory usage']
        });
      });

      const mockExecutions: CommandExecution[] = mockCommands.map(command => ({
        id: `${command.id}-${Date.now()}`,
        commandId: command.id,
        timestamp: command.lastExecuted || new Date(),
        duration: command.averageExecutionTime,
        success: command.successRate > 0.9,
        options: ['--quick'],
        systemResources: {
          memoryUsage: 65,
          cpuUsage: 45,
          diskUsage: 23
        },
        context: { executionMode: 'coordinated' }
      }));

      setCommands(mockCommands);
      setAnalytics(mockAnalytics);
      setRecentExecutions(mockExecutions);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load command center data:', error);
      setLoading(false);
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'warning': return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'error': return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default: return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    return COLORS[priority as keyof typeof COLORS] || COLORS.medium;
  };

  const getCategoryColor = (category: string) => {
    return CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || '#6B7280';
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Command Center</h1>
            <p className="text-gray-600">Holon-based command management and optimization</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-500">Total Commands</div>
              <div className="text-2xl font-bold text-gray-900">{commands.length}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Healthy</div>
              <div className="text-2xl font-bold text-green-600">
                {commands.filter(c => c.healthStatus === 'healthy').length}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Total Executions</div>
              <div className="text-2xl font-bold text-blue-600">
                {commands.reduce((sum, c) => sum + c.executionCount, 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: ChartBarIcon },
              { id: 'analytics', name: 'Analytics', icon: CogIcon },
              { id: 'health', name: 'Health', icon: CheckCircleIcon },
              { id: 'optimization', name: 'Optimization', icon: LightBulbIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Command Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {commands.map((command) => (
                  <div
                    key={command.id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                    onClick={() => setSelectedCommand(command.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getHealthIcon(command.healthStatus)}
                        <h3 className="font-semibold text-gray-900">{command.name}</h3>
                      </div>
                      <span
                        className="px-2 py-1 text-xs font-medium rounded-full"
                        style={{ backgroundColor: getPriorityColor(command.priority) + '20', color: getPriorityColor(command.priority) }}
                      >
                        {command.priority}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{command.description}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {command.executionCount} executions
                      </span>
                      <span className="text-gray-500">
                        {formatTimeAgo(command.lastExecuted || new Date())}
                      </span>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getCategoryColor(command.category) }}
                        ></span>
                        <span className="text-xs text-gray-500 capitalize">{command.category}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDuration(command.averageExecutionTime)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <PlayIcon className="w-8 h-8 text-blue-500" />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-blue-600">Total Executions</div>
                      <div className="text-2xl font-bold text-blue-900">
                        {commands.reduce((sum, c) => sum + c.executionCount, 0)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-8 h-8 text-green-500" />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-green-600">Success Rate</div>
                      <div className="text-2xl font-bold text-green-900">
                        {Math.round(commands.reduce((sum, c) => sum + c.successRate, 0) / commands.length * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <ClockIcon className="w-8 h-8 text-yellow-500" />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-yellow-600">Avg Execution</div>
                      <div className="text-2xl font-bold text-yellow-900">
                        {formatDuration(commands.reduce((sum, c) => sum + c.averageExecutionTime, 0) / commands.length)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <CogIcon className="w-8 h-8 text-purple-500" />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-purple-600">Active Commands</div>
                      <div className="text-2xl font-bold text-purple-900">
                        {commands.filter(c => c.healthStatus === 'healthy').length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Success Rate Chart */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Success Rates</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={commands.map(c => ({ name: c.name, successRate: c.successRate * 100 }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Success Rate']} />
                    <Bar dataKey="successRate" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Execution Time Chart */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Execution Times</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={commands.map(c => ({ name: c.name, time: c.averageExecutionTime / 1000 }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}s`, 'Execution Time']} />
                    <Bar dataKey="time" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Category Distribution */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Command Categories</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={Array.from(new Set(commands.map(c => c.category))).map(category => ({
                        name: category,
                        value: commands.filter(c => c.category === category).length
                      }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {Array.from(new Set(commands.map(c => c.category))).map((category, index) => (
                        <Cell key={`cell-${index}`} fill={getCategoryColor(category)} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'health' && (
            <div className="space-y-6">
              {/* Health Status Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-8 h-8 text-green-500" />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-green-600">Healthy</div>
                      <div className="text-2xl font-bold text-green-900">
                        {commands.filter(c => c.healthStatus === 'healthy').length}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="w-8 h-8 text-yellow-500" />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-yellow-600">Warning</div>
                      <div className="text-2xl font-bold text-yellow-900">
                        {commands.filter(c => c.healthStatus === 'warning').length}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-center">
                    <XCircleIcon className="w-8 h-8 text-red-500" />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-red-600">Error</div>
                      <div className="text-2xl font-bold text-red-900">
                        {commands.filter(c => c.healthStatus === 'error').length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Details */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Command Health Details</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Command
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Success Rate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Execution
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {commands.map((command) => (
                        <tr key={command.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-700">
                                    {command.name.charAt(0)}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{command.name}</div>
                                <div className="text-sm text-gray-500">{command.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getHealthIcon(command.healthStatus)}
                              <span className="ml-2 text-sm text-gray-900 capitalize">
                                {command.healthStatus}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {Math.round(command.successRate * 100)}%
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatTimeAgo(command.lastExecuted || new Date())}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'optimization' && (
            <div className="space-y-6">
              {/* Optimization Recommendations */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimization Recommendations</h3>
                <div className="space-y-4">
                  {commands
                    .filter(c => c.healthStatus === 'warning' || c.healthStatus === 'error')
                    .map((command) => (
                      <div key={command.id} className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <div className="flex items-start">
                          <LightBulbIcon className="w-5 h-5 text-yellow-500 mt-0.5" />
                          <div className="ml-3">
                            <h4 className="text-sm font-medium text-yellow-800">{command.name}</h4>
                            <div className="mt-1 text-sm text-yellow-700">
                              <ul className="list-disc list-inside space-y-1">
                                <li>Consider increasing timeout from {formatDuration(command.timeout)}</li>
                                <li>Optimize memory usage for better performance</li>
                                <li>Review error patterns and implement retry logic</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  
                  {commands.filter(c => c.healthStatus === 'warning' || c.healthStatus === 'error').length === 0 && (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-green-800">All commands are optimized</h4>
                          <p className="text-sm text-green-700">No optimization recommendations at this time.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Performance Trends */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={commands.map(c => ({
                    name: c.name,
                    executionTime: c.averageExecutionTime / 1000,
                    successRate: c.successRate * 100
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Area yAxisId="left" type="monotone" dataKey="executionTime" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                    <Area yAxisId="right" type="monotone" dataKey="successRate" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 