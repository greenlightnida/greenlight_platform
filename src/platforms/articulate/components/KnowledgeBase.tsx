import { 
  BookOpen, 
  Plus, 
  SortAsc, 
  SortDesc,
  FileText,
  GitBranch,
  Database,
  Code,
  Users,
  Calendar,
  Edit,
  Eye,
  Download,
  Copy,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import React, { useState, useMemo } from 'react';

import { KnowledgeItem } from './types';

interface KnowledgeBaseProps {
  searchQuery: string;
  onAction: (action: string, data?: unknown) => void;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ 
  searchQuery, 
  onAction 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'date' | 'author' | 'type'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Mock knowledge items
  const [knowledgeItems] = useState<KnowledgeItem[]>([
    {
      id: 'doc-1',
      type: 'architecture',
      title: 'Elaborate System Architecture',
      content: 'Comprehensive documentation of the elaborate complex adaptive system...',
      author: 'nida@greenlight.live',
      created: new Date('2025-01-27'),
      updated: new Date('2025-01-27'),
      tags: ['architecture', 'elaborate', 'system'],
      version: '3.0.0',
      status: 'published'
    },
    {
      id: 'doc-2',
      type: 'changelog',
      title: 'System Evolution Intelligence Changelog',
      content: 'Complete changelog tracking system evolution and intelligence updates...',
      author: 'nida@greenlight.live',
      created: new Date('2025-01-27'),
      updated: new Date('2025-01-27'),
      tags: ['changelog', 'evolution', 'intelligence'],
      version: '3.0.0',
      status: 'published'
    },
    {
      id: 'doc-3',
      type: 'guide',
      title: 'Coaching Toolkit User Guide',
      content: 'Complete guide for using the elevate coaching toolkit...',
      author: 'nida@greenlight.live',
      created: new Date('2025-01-26'),
      updated: new Date('2025-01-26'),
      tags: ['guide', 'elevate', 'coaching'],
      version: '2.0.0',
      status: 'published'
    },
    {
      id: 'doc-4',
      type: 'reference',
      title: 'API Reference Documentation',
      content: 'Complete API reference for all system endpoints...',
      author: 'nida@greenlight.live',
      created: new Date('2025-01-25'),
      updated: new Date('2025-01-25'),
      tags: ['api', 'reference', 'technical'],
      version: '1.0.0',
      status: 'published'
    },
    {
      id: 'doc-5',
      type: 'documentation',
      title: 'System Master Interface Guide',
      content: 'Guide for using the elaborate system master interface...',
      author: 'nida@greenlight.live',
      created: new Date('2025-01-24'),
      updated: new Date('2025-01-24'),
      tags: ['documentation', 'elaborate', 'system-master'],
      version: '1.0.0',
      status: 'published'
    }
  ]);

  // Categories and types
  const categories = useMemo(() => [
    { id: 'all', name: 'All Categories', icon: BookOpen },
    { id: 'architecture', name: 'Architecture', icon: Database },
    { id: 'development', name: 'Development', icon: Code },
    { id: 'user-guides', name: 'User Guides', icon: Users },
    { id: 'api', name: 'API Reference', icon: GitBranch },
    { id: 'changelog', name: 'Changelog', icon: Calendar }
  ], []);

  const types = useMemo(() => [
    { id: 'all', name: 'All Types', icon: FileText },
    { id: 'documentation', name: 'Documentation', icon: FileText },
    { id: 'changelog', name: 'Changelog', icon: GitBranch },
    { id: 'architecture', name: 'Architecture', icon: Database },
    { id: 'guide', name: 'Guide', icon: Users },
    { id: 'reference', name: 'Reference', icon: Code }
  ], []);

  // Filtered and sorted items
  const filteredItems = useMemo(() => {
    let items = knowledgeItems;

    // Filter by search query
    if (searchQuery) {
      items = items.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      items = items.filter(item => item.tags.includes(selectedCategory));
    }

    // Filter by type
    if (selectedType !== 'all') {
      items = items.filter(item => item.type === selectedType);
    }

    // Sort items
    items.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'title': 
          comparison = a.title.localeCompare(b.title);
          break;
        case 'date': 
          comparison = b.updated.getTime() - a.updated.getTime();
          break;
        case 'author': 
          comparison = a.author.localeCompare(b.author);
          break;
        case 'type': 
          comparison = a.type.localeCompare(b.type);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return items;
  }, [knowledgeItems, searchQuery, selectedCategory, selectedType, sortBy, sortOrder]);

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
      case 'changelog': return GitBranch;
      case 'architecture': return Database;
      case 'guide': return Users;
      case 'reference': return Code;
      default: return FileText;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Knowledge Base</h2>
          <p className="text-gray-600 dark:text-gray-400">Centralized system documentation and knowledge</p>
        </div>
        <button
          onClick={() => onAction('create', { type: 'documentation' })}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Document</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="category">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              id="category"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="type">
              Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              id="type"
            >
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="sortBy">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'title' | 'date' | 'author' | 'type')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              id="sortBy"
            >
              <option value="title">Title</option>
              <option value="date">Date</option>
              <option value="author">Author</option>
              <option value="type">Type</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="sortOrder">
              Order
            </label>
            <div className="flex">
              <button
                onClick={() => setSortOrder('asc')}
                className={`flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm rounded-l-md ${
                  sortOrder === 'asc' 
                    ? 'bg-blue-500 text-white border-blue-500' 
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                }`}
              >
                <SortAsc className="h-4 w-4" />
              </button>
              <button
                onClick={() => setSortOrder('desc')}
                className={`flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm rounded-r-md ${
                  sortOrder === 'desc' 
                    ? 'bg-blue-500 text-white border-blue-500' 
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                }`}
              >
                <SortDesc className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Knowledge Items ({filteredItems.length})
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onAction('export', { type: 'knowledge' })}
                className="btn-secondary text-sm flex items-center space-x-1"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No knowledge items found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search criteria or create a new document.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => {
                const TypeIcon = getTypeIcon(item.type);
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
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                {item.status}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                v{item.version}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                              <span>By {item.author}</span>
                              <span>Updated {item.updated.toLocaleDateString()}</span>
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
                            onClick={() => onAction('view', { itemId: item.id })}
                            className="btn-secondary text-sm"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onAction('edit', { itemId: item.id })}
                            className="btn-secondary text-sm"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onAction('copy', { itemId: item.id })}
                            className="btn-secondary text-sm"
                            title="Copy"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Expanded content */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <p className="text-gray-600 dark:text-gray-400">
                              {item.content.length > 200 
                                ? `${item.content.substring(0, 200)}...` 
                                : item.content
                              }
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => onAction('view', { itemId: item.id })}
                                className="btn-primary text-sm"
                              >
                                Read Full Document
                              </button>
                              <button
                                onClick={() => onAction('download', { itemId: item.id })}
                                className="btn-secondary text-sm"
                              >
                                Download
                              </button>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                              <span>Created {item.created.toLocaleDateString()}</span>
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