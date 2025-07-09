import { 
  BarChart3, 
  AlertTriangle, 
  AlertCircle,
  Lightbulb, 
  MessageSquare, 
  Settings, 
  Upload, 
  FileText, 
  BookOpen, 
  CheckSquare
} from 'lucide-react';
import React, { useState, useMemo } from 'react';

import { ArticulateWorkItem, ArticulateTask, ArticulateKnowledgeItem, ArticulateWikiPage } from './types';

interface InsightsProps {
  workItems: ArticulateWorkItem[];
  tasks: ArticulateTask[];
  knowledgeItems: ArticulateKnowledgeItem[];
  wikiPages: ArticulateWikiPage[];
  onAction: (action: string, data?: unknown) => void;
}

export const Insights: React.FC<InsightsProps> = ({ workItems, tasks, knowledgeItems, wikiPages, onAction }) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'timeline'>('list');

  // Calculate insights statistics
  const stats = useMemo(() => ({
    total: workItems.length + tasks.length + knowledgeItems.length + wikiPages.length,
    workItems: workItems.length,
    tasks: tasks.length,
    knowledgeItems: knowledgeItems.length,
    wikiPages: wikiPages.length,
    highPriority: workItems.filter(item => item.priority === 'high').length + 
                  tasks.filter(task => task.priority === 'high').length
  }), [workItems, tasks, knowledgeItems, wikiPages]);

  // Filtered work items
  const filteredWorkItems = useMemo(() => {
    let items = workItems;

    // Filter by type
    if (selectedType !== 'all') {
      items = items.filter(item => item.type === selectedType);
    }

    // Filter by priority
    if (selectedPriority !== 'all') {
      items = items.filter(item => item.priority === selectedPriority);
    }

    // Sort by priority, then by date
    return items.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });
  }, [workItems, selectedType, selectedPriority]);

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'feature': return FileText;
      case 'bugfix': return AlertCircle;
      case 'documentation': return BookOpen;
      case 'analysis': return BarChart3;
      case 'task': return CheckSquare;
      case 'meeting': return MessageSquare;
      case 'decision': return Settings;
      default: return Lightbulb;
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">System Insights</h2>
          <p className="text-gray-600 dark:text-gray-400">AI-powered recommendations and data science insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onAction('generate-insights')}
            className="btn-primary flex items-center space-x-2"
          >
            <Lightbulb className="h-4 w-4" />
            <span>Generate Insights</span>
          </button>
          <button
            onClick={() => onAction('export-insights')}
            className="btn-secondary flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Items</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
            </div>
            <Lightbulb className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">High Priority</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.highPriority}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Work Items</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.workItems}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tasks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.tasks}</p>
            </div>
            <CheckSquare className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Knowledge</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.knowledgeItems}</p>
            </div>
            <BookOpen className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Type Filter */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="all">All Types</option>
              <option value="feature">Feature</option>
              <option value="bugfix">Bug Fix</option>
              <option value="documentation">Documentation</option>
              <option value="analysis">Analysis</option>
              <option value="task">Task</option>
              <option value="meeting">Meeting</option>
              <option value="decision">Decision</option>
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
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* View Mode */}
          <div>
            <label htmlFor="viewMode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              View Mode
            </label>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as 'list' | 'grid' | 'timeline')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="list">List View</option>
              <option value="grid">Grid View</option>
              <option value="timeline">Timeline View</option>
            </select>
          </div>
        </div>
      </div>

      {/* Work Items List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Recent Work Items ({filteredWorkItems.length})
          </h3>
        </div>
        <div className="p-6">
          {filteredWorkItems.length === 0 ? (
            <div className="text-center py-8">
              <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No work items found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your filters or create new work items.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredWorkItems.map((item) => {
                const TypeIcon = getTypeIcon(item.type);
                
                return (
                  <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <TypeIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                {item.title}
                              </h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                                {item.priority}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                item.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                              }`}>
                                {item.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {item.description}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                              <span>{item.type}</span>
                              <span>{formatTimestamp(item.updatedAt)}</span>
                              <span>{item.assignee}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onAction('view-work-item', { itemId: item.id })}
                            className="btn-secondary text-sm"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
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