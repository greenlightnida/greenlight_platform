import { 
  CheckSquare, 
  Plus, 
  User,
  ChevronDown,
  ChevronRight,
  Star,
  AlertCircle,
  CheckCircle,
  Eye,
  Edit,
  Users,
  Clock
} from 'lucide-react';
import React, { useState, useMemo } from 'react';

import { TaskItem } from './types';

interface TaskEngineProps {
  onAction: (action: string, data?: unknown) => void;
}

export const TaskEngine: React.FC<TaskEngineProps> = ({ onAction }) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'board' | 'timeline'>('list');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Mock task data
  const [tasks] = useState<TaskItem[]>([
    {
      id: 'task-1',
      title: 'Mobile Optimization Implementation',
      description: 'Implement mobile-first design for elevate coaching toolkit to improve field operations',
      status: 'in-progress',
      priority: 'high',
      assignee: 'nida@greenlight.live',
      created: new Date('2025-01-27T08:00:00'),
      dueDate: new Date('2025-02-03T17:00:00'),
      tags: ['mobile', 'optimization', 'elevate'],
      estimatedHours: 16,
      actualHours: 8
    },
    {
      id: 'task-2',
      title: 'API Framework Development',
      description: 'Develop comprehensive API framework for elaborate system integration capabilities',
      status: 'todo',
      priority: 'medium',
      assignee: 'nida@greenlight.live',
      created: new Date('2025-01-26T14:30:00'),
      dueDate: new Date('2025-02-10T17:00:00'),
      tags: ['api', 'framework', 'integration'],
      estimatedHours: 24,
      dependencies: ['task-1']
    },
    {
      id: 'task-3',
      title: 'Security Audit Implementation',
      description: 'Implement comprehensive security audit system for elaborate platform',
      status: 'review',
      priority: 'high',
      assignee: 'nida@greenlight.live',
      created: new Date('2025-01-25T11:15:00'),
      dueDate: new Date('2025-01-30T17:00:00'),
      tags: ['security', 'audit', 'elaborate'],
      estimatedHours: 12,
      actualHours: 10
    },
    {
      id: 'task-4',
      title: 'Financial Tracking System',
      description: 'Develop financial tracking and reporting system for business oversight',
      status: 'todo',
      priority: 'medium',
      assignee: 'nida@greenlight.live',
      created: new Date('2025-01-24T16:45:00'),
      dueDate: new Date('2025-02-15T17:00:00'),
      tags: ['financial', 'tracking', 'business'],
      estimatedHours: 20
    },
    {
      id: 'task-5',
      title: 'Performance Optimization',
      description: 'Optimize system performance based on recent analysis and recommendations',
      status: 'completed',
      priority: 'high',
      assignee: 'nida@greenlight.live',
      created: new Date('2025-01-23T09:30:00'),
      completedDate: new Date('2025-01-26T17:00:00'),
      tags: ['performance', 'optimization'],
      estimatedHours: 8,
      actualHours: 6
    },
    {
      id: 'task-6',
      title: 'Documentation Update',
      description: 'Update all system documentation to reflect recent architectural changes',
      status: 'in-progress',
      priority: 'low',
      assignee: 'nida@greenlight.live',
      created: new Date('2025-01-22T13:20:00'),
      dueDate: new Date('2025-01-29T17:00:00'),
      tags: ['documentation', 'update'],
      estimatedHours: 6,
      actualHours: 3
    }
  ]);

  // Filter options
  const statuses = [
    { id: 'all', name: 'All Statuses', icon: CheckSquare },
    { id: 'todo', name: 'To Do', icon: AlertCircle },
    { id: 'in-progress', name: 'In Progress', icon: Clock },
    { id: 'review', name: 'Review', icon: Eye },
    { id: 'completed', name: 'Completed', icon: CheckCircle }
  ];

  const priorities = [
    { id: 'all', name: 'All Priorities', icon: Star },
    { id: 'high', name: 'High', icon: AlertCircle },
    { id: 'medium', name: 'Medium', icon: Clock },
    { id: 'low', name: 'Low', icon: CheckCircle }
  ];

  const assignees = [
    { id: 'all', name: 'All Assignees', icon: Users },
    { id: 'nida@greenlight.live', name: 'Nida', icon: User }
  ];

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    let items = tasks;

    // Filter by status
    if (selectedStatus !== 'all') {
      items = items.filter(item => item.status === selectedStatus);
    }

    // Filter by priority
    if (selectedPriority !== 'all') {
      items = items.filter(item => item.priority === selectedPriority);
    }

    // Filter by assignee
    if (selectedAssignee !== 'all') {
      items = items.filter(item => item.assignee === selectedAssignee);
    }

    // Sort by priority, then by due date
    return items.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      if (a.dueDate && b.dueDate) {
        return a.dueDate.getTime() - b.dueDate.getTime();
      }
      
      return 0;
    });
  }, [tasks, selectedStatus, selectedPriority, selectedAssignee]);

  // Toggle expanded state
  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  // Get status icon and color
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'todo':
        return { icon: AlertCircle, color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-700' };
      case 'in-progress':
        return { icon: Clock, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900' };
      case 'review':
        return { icon: Eye, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900' };
      case 'completed':
        return { icon: CheckCircle, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900' };
      default:
        return { icon: CheckSquare, color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-700' };
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  // Calculate progress
  const calculateProgress = (task: TaskItem) => {
    if (task.status === 'completed') return 100;
    if (task.estimatedHours && task.actualHours) {
      return Math.min((task.actualHours / task.estimatedHours) * 100, 100);
    }
    return 0;
  };

  // Format due date
  const formatDueDate = (dueDate?: Date) => {
    if (!dueDate) return 'No due date';
    
    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return `Overdue by ${Math.abs(days)} days`;
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    if (days <= 7) return `Due in ${days} days`;
    return `Due ${dueDate.toLocaleDateString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Task Engine</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage tasks, assignments, and work items</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onAction('create-task')}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Filters and View Options */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              {statuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priority
            </label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              {priorities.map((priority) => (
                <option key={priority.id} value={priority.id}>
                  {priority.name}
                </option>
              ))}
            </select>
          </div>

          {/* Assignee Filter */}
          <div>
            <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Assignee
            </label>
            <select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              {assignees.map((assignee) => (
                <option key={assignee.id} value={assignee.id}>
                  {assignee.name}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode */}
          <div>
            <label htmlFor="viewMode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              View Mode
            </label>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as 'list' | 'board' | 'timeline')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="list">List View</option>
              <option value="board">Board View</option>
              <option value="timeline">Timeline View</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedStatus('all');
                setSelectedPriority('all');
                setSelectedAssignee('all');
              }}
              className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{tasks.length}</p>
            </div>
            <CheckSquare className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {tasks.filter(t => t.status === 'in-progress').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {tasks.filter(t => t.status === 'completed').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">High Priority</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {tasks.filter(t => t.priority === 'high').length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Tasks ({filteredTasks.length})
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {tasks.filter(t => t.status === 'completed').length} of {tasks.length} completed
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No tasks found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your filters or create a new task.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => {
                const { icon: StatusIcon, color: statusColor } = getStatusInfo(task.status);
                const isExpanded = expandedItems.has(task.id);
                const progress = calculateProgress(task);
                
                return (
                  <div key={task.id} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <button
                            onClick={() => toggleExpanded(task.id)}
                            className="mt-1"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-gray-400" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <StatusIcon className={`h-5 w-5 ${statusColor}`} />
                              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                {task.title}
                              </h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                              <span>Assigned to {task.assignee}</span>
                              <span>{formatDueDate(task.dueDate)}</span>
                              {task.estimatedHours && (
                                <span>{task.estimatedHours}h estimated</span>
                              )}
                            </div>
                            
                            {/* Progress bar */}
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                              {progress}% complete
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {task.tags.map((tag) => (
                                <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onAction('edit-task', { taskId: task.id })}
                            className="btn-secondary text-sm"
                            title="Edit Task"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onAction('view-task', { taskId: task.id })}
                            className="btn-secondary text-sm"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Expanded content */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <p className="text-gray-600 dark:text-gray-400">
                              {task.description}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Task Details</h5>
                              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                <div>Created: {task.created.toLocaleDateString()}</div>
                                {task.dueDate && <div>Due: {task.dueDate.toLocaleDateString()}</div>}
                                {task.completedDate && <div>Completed: {task.completedDate.toLocaleDateString()}</div>}
                                {task.estimatedHours && <div>Estimated: {task.estimatedHours}h</div>}
                                {task.actualHours && <div>Actual: {task.actualHours}h</div>}
                              </div>
                            </div>
                            
                            {task.dependencies && task.dependencies.length > 0 && (
                              <div>
                                <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Dependencies</h5>
                                <div className="space-y-1">
                                  {task.dependencies.map((depId) => (
                                    <div key={depId} className="text-sm text-gray-600 dark:text-gray-400">
                                      Task {depId}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => onAction('update-status', { taskId: task.id, status: 'completed' })}
                                className="btn-primary text-sm"
                                disabled={task.status === 'completed'}
                              >
                                Mark Complete
                              </button>
                              <button
                                onClick={() => onAction('view-task', { taskId: task.id })}
                                className="btn-secondary text-sm"
                              >
                                View Full Details
                              </button>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              ID: {task.id}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 