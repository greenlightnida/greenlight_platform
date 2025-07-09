import { 
  History, 
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  FileText,
  Code,
  Settings,
  Users,
  Target,
  BarChart3
} from 'lucide-react';
import React, { useState, useMemo } from 'react';

import { WorkItem } from './types';

interface WorkHistoryProps {
  onAction: (action: string, data?: unknown) => void;
}

export const WorkHistory: React.FC<WorkHistoryProps> = ({ onAction }) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Mock work history data
  const [workHistory] = useState<WorkItem[]>([
    {
      id: 'work-1',
      type: 'documentation',
      title: 'System Architecture Update',
      description: 'Updated elaborate system architecture documentation with complex systems theory implementation',
      status: 'completed',
      author: 'nida@greenlight.live',
      timestamp: new Date('2025-01-27T10:30:00'),
      tags: ['architecture', 'documentation', 'elaborate'],
      priority: 'high'
    },
    {
      id: 'work-2',
      type: 'development',
      title: 'elevate Product Optimization',
      description: 'Enhanced coaching toolkit for Utica operations with unified interface',
      status: 'in-progress',
      author: 'nida@greenlight.live',
      timestamp: new Date('2025-01-27T09:15:00'),
      tags: ['elevate', 'coaching', 'optimization'],
      priority: 'high'
    },
    {
      id: 'work-3',
      type: 'analysis',
      title: 'Performance Analysis Report',
      description: 'Comprehensive system performance analysis and optimization recommendations',
      status: 'completed',
      author: 'nida@greenlight.live',
      timestamp: new Date('2025-01-26T16:45:00'),
      tags: ['performance', 'analysis', 'report'],
      priority: 'medium'
    },
    {
      id: 'work-4',
      type: 'decision',
      title: 'System Restructuring Decision',
      description: 'Decision to implement complex systems theory architecture with elaborate/elevate hierarchy',
      status: 'completed',
      author: 'nida@greenlight.live',
      timestamp: new Date('2025-01-25T14:20:00'),
      tags: ['decision', 'architecture', 'restructuring'],
      priority: 'high'
    },
    {
      id: 'work-5',
      type: 'meeting',
      title: 'System Architecture Review',
      description: 'Review meeting for system architecture and future development plans',
      status: 'completed',
      author: 'nida@greenlight.live',
      timestamp: new Date('2025-01-24T11:00:00'),
      tags: ['meeting', 'architecture', 'planning'],
      priority: 'medium'
    },
    {
      id: 'work-6',
      type: 'task',
      title: 'Mobile Optimization Planning',
      description: 'Planning phase for mobile optimization of elevate coaching toolkit',
      status: 'pending',
      author: 'nida@greenlight.live',
      timestamp: new Date('2025-01-23T15:30:00'),
      tags: ['task', 'mobile', 'optimization'],
      priority: 'medium'
    }
  ]);

  // Filter options
  const types = [
    { id: 'all', name: 'All Types', icon: History },
    { id: 'documentation', name: 'Documentation', icon: FileText },
    { id: 'development', name: 'Development', icon: Code },
    { id: 'analysis', name: 'Analysis', icon: BarChart3 },
    { id: 'task', name: 'Task', icon: Target },
    { id: 'meeting', name: 'Meeting', icon: Users },
    { id: 'decision', name: 'Decision', icon: Settings }
  ];

  const statuses = [
    { id: 'all', name: 'All Statuses', icon: Clock },
    { id: 'completed', name: 'Completed', icon: CheckCircle },
    { id: 'in-progress', name: 'In Progress', icon: RefreshCw },
    { id: 'pending', name: 'Pending', icon: AlertCircle },
    { id: 'cancelled', name: 'Cancelled', icon: XCircle }
  ];

  const authors = [
    { id: 'all', name: 'All Authors', icon: User },
    { id: 'nida@greenlight.live', name: 'Nida', icon: User }
  ];

  const dateRanges = [
    { id: 'all', name: 'All Time', icon: Calendar },
    { id: 'today', name: 'Today', icon: Clock },
    { id: 'week', name: 'This Week', icon: Calendar },
    { id: 'month', name: 'This Month', icon: Calendar }
  ];

  // Filtered work history
  const filteredHistory = useMemo(() => {
    let items = workHistory;

    // Filter by type
    if (selectedType !== 'all') {
      items = items.filter(item => item.type === selectedType);
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      items = items.filter(item => item.status === selectedStatus);
    }

    // Filter by author
    if (selectedAuthor !== 'all') {
      items = items.filter(item => item.author === selectedAuthor);
    }

    // Filter by date range
    const now = new Date();
    switch (dateRange) {
      case 'today': {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        items = items.filter(item => item.timestamp >= today);
        break;
      }
      case 'week': {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        items = items.filter(item => item.timestamp >= weekAgo);
        break;
      }
      case 'month': {
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        items = items.filter(item => item.timestamp >= monthAgo);
        break;
      }
    }

    // Sort by timestamp (newest first)
    return items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [workHistory, selectedType, selectedStatus, selectedAuthor, dateRange]);

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

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'documentation': return FileText;
      case 'development': return Code;
      case 'analysis': return BarChart3;
      case 'task': return Target;
      case 'meeting': return Users;
      case 'decision': return Settings;
      default: return History;
    }
  };

  // Get status icon and color
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { icon: CheckCircle, color: 'text-green-600 dark:text-green-400' };
      case 'in-progress':
        return { icon: RefreshCw, color: 'text-blue-600 dark:text-blue-400' };
      case 'pending':
        return { icon: AlertCircle, color: 'text-yellow-600 dark:text-yellow-400' };
      case 'cancelled':
        return { icon: XCircle, color: 'text-red-600 dark:text-red-400' };
      default:
        return { icon: Clock, color: 'text-gray-600 dark:text-gray-400' };
    }
  };

  // Get priority color
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Work History</h2>
          <p className="text-gray-600 dark:text-gray-400">Complete history of system work and changes</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onAction('export-history')}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export History</span>
          </button>
          <button
            onClick={() => onAction('refresh-history')}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Type Filter */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type
            </label>
            <select
              id="type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              id="status"
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

          {/* Author Filter */}
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Author
            </label>
            <select
              id="author"
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date Range
            </label>
            <select
              id="dateRange"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as 'all' | 'today' | 'week' | 'month')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              {dateRanges.map((range) => (
                <option key={range.id} value={range.id}>
                  {range.name}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedType('all');
                setSelectedStatus('all');
                setSelectedAuthor('all');
                setDateRange('all');
              }}
              className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Work History Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Work Timeline ({filteredHistory.length} items)
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No work history found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your filters or check back later for updates.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((item) => {
                const TypeIcon = getTypeIcon(item.type);
                const { icon: StatusIcon, color: statusColor } = getStatusInfo(item.status);
                const isExpanded = expandedItems.has(item.id);
                
                return (
                  <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <button
                            onClick={() => toggleExpanded(item.id)}
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
                              <TypeIcon className="h-5 w-5 text-blue-500" />
                              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                {item.title}
                              </h4>
                              <StatusIcon className={`h-4 w-4 ${statusColor}`} />
                              {item.priority && (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                                  {item.priority}
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                              <span>By {item.author}</span>
                              <span>{formatTimestamp(item.timestamp)}</span>
                              <span>{item.timestamp.toLocaleDateString()}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {item.tags.map((tag) => (
                                <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onAction('view-work', { workId: item.id })}
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
                              {item.description}
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => onAction('view-work', { workId: item.id })}
                                className="btn-primary text-sm"
                              >
                                View Full Details
                              </button>
                              <button
                                onClick={() => onAction('export-work', { workId: item.id })}
                                className="btn-secondary text-sm"
                              >
                                Export
                              </button>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              ID: {item.id}
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