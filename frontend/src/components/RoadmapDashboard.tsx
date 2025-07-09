import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Types
export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  type: 'epic' | 'story' | 'bug' | 'feature';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'planned' | 'in-progress' | 'completed' | 'blocked';
  progress: number;
  effort: number;
  businessValue: number;
  technicalUrgency: number;
  userImpact: number;
  manager: string;
  category: string;
  startDate: Date;
  estimatedCompletion: Date;
  actualCompletion?: Date;
  dependencies: string[];
  assignee?: string;
  tags: string[];
}

export interface RoadmapMetrics {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  plannedTasks: number;
  blockedTasks: number;
  completionRate: number;
  averageProgress: number;
  criticalTasks: number;
  highPriorityTasks: number;
  mediumPriorityTasks: number;
  lowPriorityTasks: number;
}

const COLORS = {
  critical: '#dc2626',
  high: '#ea580c',
  medium: '#d97706',
  low: '#65a30d',
  completed: '#059669',
  inProgress: '#2563eb',
  planned: '#7c3aed',
  blocked: '#dc2626'
};

const MANAGER_COLORS = [
  '#3b82f6', '#8b5cf6', '#06b6d4', '#10b981',
  '#f59e0b', '#ef4444', '#84cc16', '#f97316'
];

export const RoadmapDashboard = () => {
  const [tasks, setTasks] = useState<RoadmapTask[]>([]);
  const [metrics, setMetrics] = useState<RoadmapMetrics | null>(null);
  const [currentView, setCurrentView] = useState<string>('timeline');
  const [selectedManager, setSelectedManager] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Sample data
  const sampleTasks: RoadmapTask[] = [
    {
      id: 'task-1',
      title: 'Implement API Authentication',
      description: 'Add OAuth2 authentication to all API endpoints',
      type: 'epic',
      priority: 'critical',
      status: 'in-progress',
      progress: 75,
      effort: 40,
      businessValue: 90,
      technicalUrgency: 95,
      userImpact: 85,
      manager: 'APIManager',
      category: 'security',
      startDate: new Date('2025-01-01'),
      estimatedCompletion: new Date('2025-01-15'),
      dependencies: [],
      tags: ['security', 'authentication', 'api']
    },
    {
      id: 'task-2',
      title: 'Database Performance Optimization',
      description: 'Optimize database queries and add indexing',
      type: 'story',
      priority: 'high',
      status: 'planned',
      progress: 0,
      effort: 24,
      businessValue: 80,
      technicalUrgency: 85,
      userImpact: 70,
      manager: 'IntegrationManager',
      category: 'performance',
      startDate: new Date('2025-01-10'),
      estimatedCompletion: new Date('2025-01-20'),
      dependencies: ['task-1'],
      tags: ['database', 'performance', 'optimization']
    },
    {
      id: 'task-3',
      title: 'Fix User Authentication Bug',
      description: 'Users unable to login with Google SSO',
      type: 'bug',
      priority: 'critical',
      status: 'blocked',
      progress: 30,
      effort: 8,
      businessValue: 100,
      technicalUrgency: 100,
      userImpact: 100,
      manager: 'APIManager',
      category: 'bug-fix',
      startDate: new Date('2025-01-05'),
      estimatedCompletion: new Date('2025-01-08'),
      dependencies: [],
      tags: ['bug', 'authentication', 'sso']
    },
    {
      id: 'task-4',
      title: 'Add Real-time Notifications',
      description: 'Implement WebSocket-based real-time notifications',
      type: 'feature',
      priority: 'medium',
      status: 'completed',
      progress: 100,
      effort: 32,
      businessValue: 70,
      technicalUrgency: 60,
      userImpact: 80,
      manager: 'IntegrationManager',
      category: 'feature',
      startDate: new Date('2024-12-20'),
      estimatedCompletion: new Date('2025-01-05'),
      actualCompletion: new Date('2025-01-03'),
      dependencies: [],
      tags: ['websocket', 'notifications', 'real-time']
    },
    {
      id: 'task-5',
      title: 'API Rate Limiting Implementation',
      description: 'Add rate limiting to prevent API abuse',
      type: 'story',
      priority: 'high',
      status: 'in-progress',
      progress: 45,
      effort: 16,
      businessValue: 85,
      technicalUrgency: 80,
      userImpact: 75,
      manager: 'APIManager',
      category: 'security',
      startDate: new Date('2025-01-03'),
      estimatedCompletion: new Date('2025-01-12'),
      dependencies: ['task-1'],
      tags: ['rate-limiting', 'security', 'api']
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTasks(sampleTasks);
      setMetrics(calculateMetrics(sampleTasks));
      setLoading(false);
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculateMetrics = (taskList: RoadmapTask[]): RoadmapMetrics => {
    const total = taskList.length;
    const completed = taskList.filter(t => t.status === 'completed').length;
    const inProgress = taskList.filter(t => t.status === 'in-progress').length;
    const planned = taskList.filter(t => t.status === 'planned').length;
    const blocked = taskList.filter(t => t.status === 'blocked').length;
    const averageProgress = taskList.reduce((sum, t) => sum + t.progress, 0) / total;
    const critical = taskList.filter(t => t.priority === 'critical').length;
    const high = taskList.filter(t => t.priority === 'high').length;
    const medium = taskList.filter(t => t.priority === 'medium').length;
    const low = taskList.filter(t => t.priority === 'low').length;

    return {
      totalTasks: total,
      completedTasks: completed,
      inProgressTasks: inProgress,
      plannedTasks: planned,
      blockedTasks: blocked,
      completionRate: (completed / total) * 100,
      averageProgress,
      criticalTasks: critical,
      highPriorityTasks: high,
      mediumPriorityTasks: medium,
      lowPriorityTasks: low
    };
  };

  const filteredTasks = tasks.filter(task => {
    if (selectedManager !== 'all' && task.manager !== selectedManager) return false;
    if (selectedPriority !== 'all' && task.priority !== selectedPriority) return false;
    if (selectedStatus !== 'all' && task.status !== selectedStatus) return false;
    return true;
  });

  const priorityData = [
    { name: 'Critical', value: metrics?.criticalTasks || 0, color: COLORS.critical },
    { name: 'High', value: metrics?.highPriorityTasks || 0, color: COLORS.high },
    { name: 'Medium', value: metrics?.mediumPriorityTasks || 0, color: COLORS.medium },
    { name: 'Low', value: metrics?.lowPriorityTasks || 0, color: COLORS.low }
  ];

  const statusData = [
    { name: 'Completed', value: metrics?.completedTasks || 0, color: COLORS.completed },
    { name: 'In Progress', value: metrics?.inProgressTasks || 0, color: COLORS.inProgress },
    { name: 'Planned', value: metrics?.plannedTasks || 0, color: COLORS.planned },
    { name: 'Blocked', value: metrics?.blockedTasks || 0, color: COLORS.blocked }
  ];

  const progressData = filteredTasks.map(task => ({
    name: task.title.substring(0, 20) + '...',
    progress: task.progress,
    priority: task.priority,
    status: task.status
  }));

  const managerData = Array.from(new Set(tasks.map(t => t.manager))).map((manager, index) => ({
    name: manager,
    tasks: tasks.filter(t => t.manager === manager).length,
    completed: tasks.filter(t => t.manager === manager && t.status === 'completed').length,
    inProgress: tasks.filter(t => t.manager === manager && t.status === 'in-progress').length,
    color: MANAGER_COLORS[index % MANAGER_COLORS.length]
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading roadmap data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Product Roadmap Dashboard</h1>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Add Task
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex space-x-4">
          <select 
            value={selectedManager} 
            onChange={(e) => setSelectedManager(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Managers</option>
            <option value="APIManager">API Manager</option>
            <option value="IntegrationManager">Integration Manager</option>
            <option value="SystemMasterManager">System Master Manager</option>
          </select>

          <select 
            value={selectedPriority} 
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="planned">Planned</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex space-x-2">
        <button 
          onClick={() => setCurrentView('timeline')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentView === 'timeline' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Timeline
        </button>
        <button 
          onClick={() => setCurrentView('kanban')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentView === 'kanban' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Kanban
        </button>
        <button 
          onClick={() => setCurrentView('analytics')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentView === 'analytics' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Analytics
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-3xl font-bold text-gray-900">{metrics?.totalTasks}</div>
          <div className="text-sm text-gray-600">Total Tasks</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-3xl font-bold text-gray-900">{metrics?.completionRate.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">Completion Rate</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-3xl font-bold text-gray-900">{metrics?.averageProgress.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">Average Progress</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-3xl font-bold text-gray-900">{metrics?.criticalTasks}</div>
          <div className="text-sm text-gray-600">Critical Tasks</div>
        </div>
      </div>

      {/* Main Content */}
      {currentView === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Priority Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Status Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Task Progress */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Progress</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="progress" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Manager Performance */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Manager Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={managerData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#059669" name="Completed" />
                <Bar dataKey="inProgress" fill="#2563eb" name="In Progress" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {currentView === 'timeline' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline View</h3>
          <div className="space-y-4">
            {filteredTasks.map(task => (
              <div key={task.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div 
                  className="w-3 h-3 rounded-full mt-2"
                  style={{ backgroundColor: COLORS[task.priority] }}
                ></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900">{task.title}</h4>
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.priority === 'critical' ? 'bg-red-100 text-red-800' :
                        task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                  <div className="flex space-x-4 text-sm text-gray-500">
                    <span>{task.manager}</span>
                    <span>Progress: {task.progress}%</span>
                    <span className="capitalize">{task.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentView === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {['planned', 'in-progress', 'completed', 'blocked'].map(status => (
            <div key={status} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4 capitalize">
                {status.replace('-', ' ')} ({filteredTasks.filter(t => t.status === status).length})
              </h3>
              <div className="space-y-3">
                {filteredTasks
                  .filter(task => task.status === status)
                  .map(task => (
                    <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                      {task.status === 'in-progress' && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-sm">
                        <span 
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            task.priority === 'critical' ? 'bg-red-100 text-red-800' :
                            task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}
                        >
                          {task.priority}
                        </span>
                        <span className="text-gray-500">{task.manager}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 