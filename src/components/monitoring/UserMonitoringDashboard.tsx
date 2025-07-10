import React, { useState, useEffect, useRef } from 'react';

import { UserConstituencyManager } from '../../core/governance/UserConstituencyManager';

interface UserMonitoringDashboardProps {
  userManager: UserConstituencyManager;
  refreshInterval?: number;
}

interface RealTimeMetrics {
  activeUsers: Set<string>;
  concurrentSessions: number;
  averageResponseTime: number;
  errorRate: number;
  systemLoad: number;
}

interface PerformanceAnalytics {
  averagePageLoadTime: number;
  averageApiResponseTime: number;
  totalErrors: number;
  errorRate: number;
  slowPageLoads: number;
  slowApiCalls: number;
}

interface BehaviorAnalytics {
  totalInteractions: number;
  clickToMovementRatio: number;
  averageClicksPerSession: number;
  averageScrollsPerSession: number;
  averageKeyStrokesPerSession: number;
  engagementPatterns: {
    highEngagement: number;
    mediumEngagement: number;
    lowEngagement: number;
  };
}

export const UserMonitoringDashboard: React.FC<UserMonitoringDashboardProps> = ({
  userManager,
  refreshInterval = 5000
}) => {
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetrics | null>(null);
  const [performanceAnalytics, setPerformanceAnalytics] = useState<PerformanceAnalytics | null>(null);
  const [behaviorAnalytics, setBehaviorAnalytics] = useState<BehaviorAnalytics | null>(null);
  const [engagementAnalytics, setEngagementAnalytics] = useState<any>(null);
  const [isMonitoringEnabled, setIsMonitoringEnabled] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const updateMetrics = () => {
      if (!isMonitoringEnabled) return;

      setRealTimeMetrics(userManager.getRealTimeMetrics());
      setPerformanceAnalytics(userManager.getPerformanceAnalytics());
      setBehaviorAnalytics(userManager.getBehaviorAnalytics());
      setEngagementAnalytics(userManager.getEngagementAnalytics());
    };

    // Initial update
    updateMetrics();

    // Set up interval
    intervalRef.current = setInterval(updateMetrics, refreshInterval);

    // Set up event listeners
    userManager.on('realTimeMetricsUpdated', setRealTimeMetrics);
    userManager.on('userSessionStarted', updateMetrics);
    userManager.on('userSessionEnded', updateMetrics);
    userManager.on('userActivityRecorded', updateMetrics);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      userManager.removeAllListeners();
    };
  }, [userManager, refreshInterval, isMonitoringEnabled]);

  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const getPerformanceColor = (value: number, threshold: number): string => {
    if (value <= threshold * 0.5) return 'text-green-600';
    if (value <= threshold) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getEngagementColor = (score: number): string => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    subtitle?: string;
    color?: string;
    icon?: string;
  }> = ({ title, value, subtitle, color = 'text-gray-900', icon }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div className="text-3xl text-gray-400">
            <span className="material-icons">{icon}</span>
          </div>
        )}
      </div>
    </div>
  );

  const PerformanceChart: React.FC<{
    title: string;
    data: { label: string; value: number; color: string }[];
  }> = ({ title, data }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{item.label}</span>
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${item.color}`}
                  style={{ width: `${Math.min(100, (item.value / Math.max(...data.map(d => d.value))) * 100)}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-800">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (!realTimeMetrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-4 border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Monitoring Dashboard</h1>
          <p className="text-sm text-gray-600">Real-time user behavior and performance analytics</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Time Range:</label>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as any)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
          <button
            onClick={() => setIsMonitoringEnabled(!isMonitoringEnabled)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              isMonitoringEnabled
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isMonitoringEnabled ? 'Pause Monitoring' : 'Resume Monitoring'}
          </button>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Users"
          value={realTimeMetrics.activeUsers.size}
          subtitle="Currently online"
          color="text-blue-600"
          icon="group"
        />
        <MetricCard
          title="Concurrent Sessions"
          value={realTimeMetrics.concurrentSessions}
          subtitle="Active sessions"
          color="text-green-600"
          icon="session"
        />
        <MetricCard
          title="Avg Response Time"
          value={formatTime(realTimeMetrics.averageResponseTime)}
          subtitle="API performance"
          color={getPerformanceColor(realTimeMetrics.averageResponseTime, 1000)}
          icon="speed"
        />
        <MetricCard
          title="Error Rate"
          value={formatPercentage(realTimeMetrics.errorRate)}
          subtitle="System health"
          color={getPerformanceColor(realTimeMetrics.errorRate, 5)}
          icon="error"
        />
      </div>

      {/* Performance Analytics */}
      {performanceAnalytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Page Load Time</span>
                <span className={`font-medium ${getPerformanceColor(performanceAnalytics.averagePageLoadTime, 3000)}`}>
                  {formatTime(performanceAnalytics.averagePageLoadTime)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">API Response Time</span>
                <span className={`font-medium ${getPerformanceColor(performanceAnalytics.averageApiResponseTime, 1000)}`}>
                  {formatTime(performanceAnalytics.averageApiResponseTime)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Errors</span>
                <span className="font-medium text-red-600">{performanceAnalytics.totalErrors}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Slow Page Loads</span>
                <span className="font-medium text-yellow-600">{performanceAnalytics.slowPageLoads}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Slow API Calls</span>
                <span className="font-medium text-yellow-600">{performanceAnalytics.slowApiCalls}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">System Load</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current Load</span>
                <span className={`font-medium ${getPerformanceColor(realTimeMetrics.systemLoad, 80)}`}>
                  {formatPercentage(realTimeMetrics.systemLoad)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    realTimeMetrics.systemLoad > 80 ? 'bg-red-500' :
                    realTimeMetrics.systemLoad > 60 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${realTimeMetrics.systemLoad}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Behavior Analytics */}
      {behaviorAnalytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">User Behavior</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Interactions</span>
                <span className="font-medium text-blue-600">{behaviorAnalytics.totalInteractions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Clicks/Session</span>
                <span className="font-medium text-green-600">{behaviorAnalytics.averageClicksPerSession.toFixed(1)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Scrolls/Session</span>
                <span className="font-medium text-purple-600">{behaviorAnalytics.averageScrollsPerSession.toFixed(1)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Click/Movement Ratio</span>
                <span className="font-medium text-orange-600">{behaviorAnalytics.clickToMovementRatio.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Engagement Patterns</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">High Engagement</span>
                <span className="font-medium text-green-600">{behaviorAnalytics.engagementPatterns.highEngagement}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Medium Engagement</span>
                <span className="font-medium text-yellow-600">{behaviorAnalytics.engagementPatterns.mediumEngagement}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Low Engagement</span>
                <span className="font-medium text-red-600">{behaviorAnalytics.engagementPatterns.lowEngagement}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Engagement Analytics */}
      {engagementAnalytics && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Engagement Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{engagementAnalytics.userMetrics.totalUsers}</p>
              <p className="text-sm text-gray-600">Total Users</p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-bold ${getEngagementColor(engagementAnalytics.userMetrics.averageEngagementScore)}`}>
                {engagementAnalytics.userMetrics.averageEngagementScore}
              </p>
              <p className="text-sm text-gray-600">Avg Engagement Score</p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-bold ${getEngagementColor(engagementAnalytics.userMetrics.averageSatisfactionScore)}`}>
                {engagementAnalytics.userMetrics.averageSatisfactionScore}
              </p>
              <p className="text-sm text-gray-600">Avg Satisfaction Score</p>
            </div>
          </div>
        </div>
      )}

      {/* Live Activity Feed */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Live Activity Feed</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {userManager.getAllSessions().slice(-10).reverse().map((session) => (
            <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">User {session.userId}</p>
                  <p className="text-xs text-gray-600">
                    {session.activities.length} activities • {formatTime(session.duration)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{session.context.deviceType}</p>
                <p className="text-xs text-gray-500">{session.context.screenResolution}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 