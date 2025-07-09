import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  TrendingUpIcon, TrendingDownIcon, MinusIcon, ExclamationTriangleIcon,
  LightBulbIcon, CheckCircleIcon, XCircleIcon, ClockIcon, ChartBarIcon,
  CogIcon, UserGroupIcon, DocumentTextIcon
} from '@heroicons/react/24/outline';

interface OKRLevel {
  id: string;
  name: string;
  type: 'system' | 'global' | 'holon' | 'atomic';
  parentId?: string;
  children: string[];
  internalObjectives: Objective[];
  systemObjectives: Objective[];
  metrics: Metrics;
  status: 'active' | 'inactive' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

interface Objective {
  id: string;
  title: string;
  description: string;
  type: 'internal' | 'system';
  keyResults: KeyResult[];
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'not_started' | 'in_progress' | 'at_risk' | 'completed';
  progress: number;
  startDate: Date;
  endDate: Date;
  owner: string;
  dependencies: string[];
  impact: 'high' | 'medium' | 'low';
}

interface KeyResult {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  status: 'not_started' | 'in_progress' | 'at_risk' | 'completed';
  progress: number;
  lastUpdated: Date;
  trend: 'improving' | 'stable' | 'declining';
}

interface Metrics {
  reliability: { uptime: number; errorRate: number; dataIntegrity: number };
  performance: { responseTime: number; throughput: number; resourceUtilization: number };
  quality: { testCoverage: number; codeQuality: number; featureCompleteness: number };
  health: { systemHealth: number; operationalEfficiency: number; maintenanceStatus: number };
  integration: { crossSystemCollaboration: number; dependencyHealth: number; workflowEfficiency: number };
  value: { businessImpact: number; userSatisfaction: number; adoptionRate: number };
  contribution: { platformImprovements: number; supportReduction: number; issueResolution: number };
  impact: { measurableOutcomes: number; stakeholderValue: number; systemSuccess: number };
}

interface PerformanceReport {
  levelId: string;
  timestamp: Date;
  overallScore: number;
  internalScore: number;
  systemScore: number;
  trends: { internal: 'improving' | 'stable' | 'declining'; system: 'improving' | 'stable' | 'declining' };
  risks: Risk[];
  opportunities: Opportunity[];
  recommendations: Recommendation[];
}

interface Risk {
  id: string;
  title: string;
  description: string;
  level: 'critical' | 'high' | 'medium' | 'low';
  probability: number;
  impact: number;
  mitigation: string;
  owner: string;
  status: 'open' | 'mitigated' | 'closed';
}

interface Opportunity {
  id: string;
  title: string;
  description: string;
  potentialImpact: number;
  effort: number;
  priority: 'high' | 'medium' | 'low';
  owner: string;
  status: 'identified' | 'evaluating' | 'implementing' | 'realized';
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'performance' | 'optimization' | 'improvement' | 'risk_mitigation';
  priority: 'critical' | 'high' | 'medium' | 'low';
  effort: number;
  impact: number;
  owner: string;
  status: 'pending' | 'approved' | 'implementing' | 'completed';
}

interface ManagerCollaboration {
  managerId: string;
  managerType: string;
  collaborationAreas: string[];
  sharedObjectives: string[];
  dependencies: string[];
  communicationChannels: string[];
  reviewFrequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
}

const COLORS = {
  critical: '#DC2626',
  high: '#EA580C',
  medium: '#D97706',
  low: '#059669',
  improving: '#10B981',
  stable: '#6B7280',
  declining: '#EF4444',
  completed: '#10B981',
  in_progress: '#3B82F6',
  at_risk: '#F59E0B',
  not_started: '#6B7280'
};

export default function PerformanceManagerDashboard() {
  const [levels, setLevels] = useState<OKRLevel[]>([]);
  const [reports, setReports] = useState<PerformanceReport[]>([]);
  const [risks, setRisks] = useState<Risk[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [collaborations, setCollaborations] = useState<ManagerCollaboration[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'okrs' | 'metrics' | 'risks' | 'collaborations'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPerformanceData();
    const interval = setInterval(loadPerformanceData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const loadPerformanceData = async () => {
    try {
      // In a real implementation, this would fetch from the PerformanceManager API
      // For now, we'll simulate the data
      const mockLevels: OKRLevel[] = [
        {
          id: 'system',
          name: 'System Level',
          type: 'system',
          children: ['global'],
          internalObjectives: [
            {
              id: 'sys-int-1',
              title: 'Maintain robust platform infrastructure',
              description: 'Ensure platform reliability, performance, and security',
              type: 'internal',
              keyResults: [
                {
                  id: 'sys-int-1-kr1',
                  title: 'Platform uptime',
                  description: 'Achieve 99.9% platform uptime',
                  target: 99.9,
                  current: 98.5,
                  unit: '%',
                  status: 'in_progress',
                  progress: 75,
                  lastUpdated: new Date(),
                  trend: 'improving'
                }
              ],
              priority: 'critical',
              status: 'in_progress',
              progress: 75,
              startDate: new Date(),
              endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
              owner: 'platform-team',
              dependencies: [],
              impact: 'high'
            }
          ],
          systemObjectives: [
            {
              id: 'sys-sys-1',
              title: 'Deliver measurable business value',
              description: 'Increase user engagement and satisfaction',
              type: 'system',
              keyResults: [
                {
                  id: 'sys-sys-1-kr1',
                  title: 'User engagement',
                  description: 'Increase user engagement by 50%',
                  target: 50,
                  current: 25,
                  unit: '%',
                  status: 'in_progress',
                  progress: 50,
                  lastUpdated: new Date(),
                  trend: 'improving'
                }
              ],
              priority: 'high',
              status: 'in_progress',
              progress: 50,
              startDate: new Date(),
              endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
              owner: 'product-team',
              dependencies: [],
              impact: 'high'
            }
          ],
          metrics: {
            reliability: { uptime: 98.5, errorRate: 1.5, dataIntegrity: 99.8 },
            performance: { responseTime: 1.8, throughput: 1500, resourceUtilization: 65 },
            quality: { testCoverage: 85, codeQuality: 88, featureCompleteness: 92 },
            health: { systemHealth: 87, operationalEfficiency: 82, maintenanceStatus: 90 },
            integration: { crossSystemCollaboration: 78, dependencyHealth: 85, workflowEfficiency: 80 },
            value: { businessImpact: 75, userSatisfaction: 82, adoptionRate: 68 },
            contribution: { platformImprovements: 70, supportReduction: 65, issueResolution: 85 },
            impact: { measurableOutcomes: 72, stakeholderValue: 78, systemSuccess: 80 }
          },
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'governance',
          name: 'Governance Holon',
          type: 'holon',
          parentId: 'global',
          children: [],
          internalObjectives: [
            {
              id: 'gov-int-1',
              title: 'Maintain governance holon health',
              description: 'Ensure governance holon performance and reliability',
              type: 'internal',
              keyResults: [
                {
                  id: 'gov-int-1-kr1',
                  title: 'Holon uptime',
                  description: 'Achieve 95% holon uptime',
                  target: 95,
                  current: 93,
                  unit: '%',
                  status: 'in_progress',
                  progress: 80,
                  lastUpdated: new Date(),
                  trend: 'improving'
                }
              ],
              priority: 'high',
              status: 'in_progress',
              progress: 80,
              startDate: new Date(),
              endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              owner: 'governance-team',
              dependencies: [],
              impact: 'high'
            }
          ],
          systemObjectives: [
            {
              id: 'gov-sys-1',
              title: 'Deliver governance value',
              description: 'Provide measurable value through governance capabilities',
              type: 'system',
              keyResults: [
                {
                  id: 'gov-sys-1-kr1',
                  title: 'User adoption',
                  description: 'Achieve 80% user adoption',
                  target: 80,
                  current: 65,
                  unit: '%',
                  status: 'in_progress',
                  progress: 70,
                  lastUpdated: new Date(),
                  trend: 'improving'
                }
              ],
              priority: 'medium',
              status: 'in_progress',
              progress: 70,
              startDate: new Date(),
              endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              owner: 'governance-team',
              dependencies: [],
              impact: 'medium'
            }
          ],
          metrics: {
            reliability: { uptime: 93, errorRate: 2.1, dataIntegrity: 99.5 },
            performance: { responseTime: 2.2, throughput: 1200, resourceUtilization: 70 },
            quality: { testCoverage: 82, codeQuality: 85, featureCompleteness: 88 },
            health: { systemHealth: 85, operationalEfficiency: 78, maintenanceStatus: 87 },
            integration: { crossSystemCollaboration: 75, dependencyHealth: 82, workflowEfficiency: 78 },
            value: { businessImpact: 70, userSatisfaction: 78, adoptionRate: 65 },
            contribution: { platformImprovements: 65, supportReduction: 60, issueResolution: 80 },
            impact: { measurableOutcomes: 68, stakeholderValue: 72, systemSuccess: 75 }
          },
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const mockReports: PerformanceReport[] = mockLevels.map(level => ({
        levelId: level.id,
        timestamp: new Date(),
        overallScore: 75,
        internalScore: 80,
        systemScore: 70,
        trends: { internal: 'improving', system: 'improving' },
        risks: [],
        opportunities: [],
        recommendations: []
      }));

      const mockRisks: Risk[] = [
        {
          id: 'risk-1',
          title: 'Objective at risk: Maintain robust platform infrastructure',
          description: 'Objective is at risk with 75% progress',
          level: 'medium',
          probability: 0.7,
          impact: 0.6,
          mitigation: 'Review objective progress and adjust strategy',
          owner: 'platform-team',
          status: 'open'
        }
      ];

      const mockOpportunities: Opportunity[] = [
        {
          id: 'opp-1',
          title: 'Performance optimization opportunity',
          description: 'Response time is below target, opportunity to optimize further',
          potentialImpact: 0.8,
          effort: 0.4,
          priority: 'high',
          owner: 'performance-team',
          status: 'identified'
        }
      ];

      const mockRecommendations: Recommendation[] = [
        {
          id: 'rec-1',
          title: 'Optimize response time',
          description: 'Response time is above target, consider performance optimizations',
          type: 'performance',
          priority: 'high',
          effort: 0.6,
          impact: 0.8,
          owner: 'performance-team',
          status: 'pending'
        }
      ];

      const mockCollaborations: ManagerCollaboration[] = [
        {
          managerId: 'command-center-manager',
          managerType: 'CommandCenter',
          collaborationAreas: ['performance-monitoring', 'okr-tracking', 'coaching'],
          sharedObjectives: ['sys-int-1', 'global-int-1'],
          dependencies: ['governance-manager'],
          communicationChannels: ['slack', 'email', 'dashboard'],
          reviewFrequency: 'weekly'
        }
      ];

      setLevels(mockLevels);
      setReports(mockReports);
      setRisks(mockRisks);
      setOpportunities(mockOpportunities);
      setRecommendations(mockRecommendations);
      setCollaborations(mockCollaborations);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load performance data:', error);
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'in_progress': return <ClockIcon className="w-5 h-5 text-blue-500" />;
      case 'at_risk': return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'not_started': return <MinusIcon className="w-5 h-5 text-gray-500" />;
      default: return <MinusIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUpIcon className="w-5 h-5 text-green-500" />;
      case 'declining': return <TrendingDownIcon className="w-5 h-5 text-red-500" />;
      default: return <MinusIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    return COLORS[priority as keyof typeof COLORS] || COLORS.medium;
  };

  const formatPercentage = (value: number) => `${Math.round(value)}%`;

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
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
            <h1 className="text-2xl font-bold text-gray-900">Performance Manager</h1>
            <p className="text-gray-600">OKR framework and performance monitoring across all levels</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-500">Active Levels</div>
              <div className="text-2xl font-bold text-gray-900">{levels.length}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Active OKRs</div>
              <div className="text-2xl font-bold text-blue-600">
                {levels.reduce((sum, level) => 
                  sum + level.internalObjectives.length + level.systemObjectives.length, 0
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Open Risks</div>
              <div className="text-2xl font-bold text-red-600">
                {risks.filter(r => r.status === 'open').length}
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
              { id: 'okrs', name: 'OKRs', icon: DocumentTextIcon },
              { id: 'metrics', name: 'Metrics', icon: CogIcon },
              { id: 'risks', name: 'Risks & Opportunities', icon: ExclamationTriangleIcon },
              { id: 'collaborations', name: 'Collaborations', icon: UserGroupIcon }
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
              {/* Level Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {levels.map((level) => (
                  <div
                    key={level.id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                    onClick={() => setSelectedLevel(level.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{level.name}</h3>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {level.type}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Internal Score:</span>
                        <span className="font-medium">{formatPercentage(80)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">System Score:</span>
                        <span className="font-medium">{formatPercentage(70)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Overall Score:</span>
                        <span className="font-medium">{formatPercentage(75)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {level.internalObjectives.length + level.systemObjectives.length} OKRs
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getTrendIcon('improving')}
                        <span className="text-xs text-green-600">Improving</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Performance Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-8 h-8 text-green-500" />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-green-600">On Track</div>
                      <div className="text-2xl font-bold text-green-900">
                        {levels.reduce((sum, level) => 
                          sum + level.internalObjectives.filter(obj => obj.status === 'in_progress').length +
                          level.systemObjectives.filter(obj => obj.status === 'in_progress').length, 0
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="w-8 h-8 text-yellow-500" />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-yellow-600">At Risk</div>
                      <div className="text-2xl font-bold text-yellow-900">
                        {levels.reduce((sum, level) => 
                          sum + level.internalObjectives.filter(obj => obj.status === 'at_risk').length +
                          level.systemObjectives.filter(obj => obj.status === 'at_risk').length, 0
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <LightBulbIcon className="w-8 h-8 text-blue-500" />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-blue-600">Opportunities</div>
                      <div className="text-2xl font-bold text-blue-900">{opportunities.length}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-red-600">Open Risks</div>
                      <div className="text-2xl font-bold text-red-900">
                        {risks.filter(r => r.status === 'open').length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'okrs' && (
            <div className="space-y-6">
              {/* OKR Progress */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">OKR Progress</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Level
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Objective
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progress
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Priority
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {levels.map((level) => (
                        [...level.internalObjectives, ...level.systemObjectives].map((objective) => (
                          <tr key={objective.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {level.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{objective.title}</div>
                                <div className="text-sm text-gray-500">{objective.description}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                objective.type === 'internal' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {objective.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {getStatusIcon(objective.status)}
                                <span className="ml-2 text-sm text-gray-900 capitalize">
                                  {objective.status.replace('_', ' ')}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${objective.progress}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-900">{formatPercentage(objective.progress)}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className="px-2 py-1 text-xs font-medium rounded-full"
                                style={{ 
                                  backgroundColor: getPriorityColor(objective.priority) + '20', 
                                  color: getPriorityColor(objective.priority) 
                                }}
                              >
                                {objective.priority}
                              </span>
                            </td>
                          </tr>
                        ))
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="space-y-6">
              {/* Metrics Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {levels.map((level) => (
                  <div key={level.id} className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{level.name} Metrics</h3>
                    
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={[
                        { metric: 'Reliability', value: level.metrics.reliability.uptime },
                        { metric: 'Performance', value: level.metrics.performance.responseTime },
                        { metric: 'Quality', value: level.metrics.quality.testCoverage },
                        { metric: 'Health', value: level.metrics.health.systemHealth },
                        { metric: 'Integration', value: level.metrics.integration.crossSystemCollaboration },
                        { metric: 'Value', value: level.metrics.value.businessImpact },
                        { metric: 'Contribution', value: level.metrics.contribution.platformImprovements },
                        { metric: 'Impact', value: level.metrics.impact.measurableOutcomes }
                      ]}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" />
                        <PolarRadiusAxis />
                        <Radar name="Metrics" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'risks' && (
            <div className="space-y-6">
              {/* Risks */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Risks</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {risks.map((risk) => (
                      <div key={risk.id} className="bg-red-50 rounded-lg p-4 border border-red-200">
                        <div className="flex items-start">
                          <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mt-0.5" />
                          <div className="ml-3">
                            <h4 className="text-sm font-medium text-red-800">{risk.title}</h4>
                            <div className="mt-1 text-sm text-red-700">
                              <p>{risk.description}</p>
                              <div className="mt-2 flex items-center space-x-4">
                                <span>Level: {risk.level}</span>
                                <span>Probability: {Math.round(risk.probability * 100)}%</span>
                                <span>Impact: {Math.round(risk.impact * 100)}%</span>
                              </div>
                              <p className="mt-2"><strong>Mitigation:</strong> {risk.mitigation}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Opportunities */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Opportunities</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {opportunities.map((opportunity) => (
                      <div key={opportunity.id} className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-start">
                          <LightBulbIcon className="w-5 h-5 text-green-500 mt-0.5" />
                          <div className="ml-3">
                            <h4 className="text-sm font-medium text-green-800">{opportunity.title}</h4>
                            <div className="mt-1 text-sm text-green-700">
                              <p>{opportunity.description}</p>
                              <div className="mt-2 flex items-center space-x-4">
                                <span>Impact: {Math.round(opportunity.potentialImpact * 100)}%</span>
                                <span>Effort: {Math.round(opportunity.effort * 100)}%</span>
                                <span>Priority: {opportunity.priority}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'collaborations' && (
            <div className="space-y-6">
              {/* Manager Collaborations */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Manager Collaborations</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Manager
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Collaboration Areas
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Review Frequency
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {collaborations.map((collaboration) => (
                        <tr key={collaboration.managerId}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {collaboration.managerId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {collaboration.managerType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex flex-wrap gap-1">
                              {collaboration.collaborationAreas.map((area) => (
                                <span key={area} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                  {area}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {collaboration.reviewFrequency}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 