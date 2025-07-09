import { 
  FileText, 
  Plus, 
  Edit,
  Eye,
  Share,
  ChevronDown,
  ChevronRight,
  GitCommit,
  Code,
  Users,
  BookOpen,
  Database,
  BarChart3,
  SortAsc,
  SortDesc
} from 'lucide-react';
import React, { useState, useMemo } from 'react';

import { WikiPage } from './types';

interface WikiProps {
  searchQuery: string;
  onAction: (action: string, data?: unknown) => void;
}

export const Wiki: React.FC<WikiProps> = ({ 
  searchQuery, 
  onAction 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'title' | 'date' | 'views' | 'author'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Mock wiki pages
  const [wikiPages] = useState<WikiPage[]>([
    {
      id: 'wiki-1',
      title: 'System Architecture Overview',
      content: `# System Architecture Overview

## Introduction
The elaborate system is built on complex systems theory principles, creating a scalable and resilient platform for sports business intelligence.

## Core Components
- **elaborate**: System master platform
- **elevate**: Protected coaching product
- **articulate**: Intelligent work management engine

## Architecture Principles
1. **Emergence**: Self-organizing components
2. **Self-Organization**: Autonomous holons
3. **Adaptation**: AI-driven optimization
4. **Resilience**: Fault tolerance and recovery

## Data Flow
Real-time synchronization across all components with controlled isolation for protected products.`,
      author: 'nida@greenlight.live',
      created: new Date('2025-01-27T10:00:00'),
      updated: new Date('2025-01-27T15:30:00'),
      tags: ['architecture', 'overview', 'system'],
      category: 'architecture',
      isPublic: true,
      views: 45,
      lastViewed: new Date('2025-01-27T16:00:00')
    },
    {
      id: 'wiki-2',
      title: 'Coaching Toolkit User Guide',
      content: `# Coaching Toolkit User Guide

## Overview
The elevate coaching toolkit provides a unified interface for all coaching operations.

## Features
- Player management
- Media intelligence
- Progress tracking
- Program operations

## Getting Started
1. Access the coaching toolkit
2. Navigate to player management
3. Upload media and track progress
4. Manage programs and cohorts

## Best Practices
- Regular data updates
- Media organization
- Progress documentation`,
      author: 'nida@greenlight.live',
      created: new Date('2025-01-26T14:00:00'),
      updated: new Date('2025-01-27T12:00:00'),
      tags: ['guide', 'coaching', 'elevate'],
      category: 'user-guides',
      isPublic: true,
      views: 32,
      lastViewed: new Date('2025-01-27T14:30:00')
    },
    {
      id: 'wiki-3',
      title: 'API Reference Documentation',
      content: `# API Reference Documentation

## Authentication
All API calls require authentication using JWT tokens.

## Endpoints

### Players
- GET /api/players - List all players
- POST /api/players - Create new player
- PUT /api/players/:id - Update player
- DELETE /api/players/:id - Delete player

### Media
- GET /api/media - List media files
- POST /api/media - Upload media
- PUT /api/media/:id - Update media metadata

### Programs
- GET /api/programs - List programs
- POST /api/programs - Create program`,
      author: 'nida@greenlight.live',
      created: new Date('2025-01-25T11:00:00'),
      updated: new Date('2025-01-26T16:00:00'),
      tags: ['api', 'reference', 'technical'],
      category: 'technical',
      isPublic: false,
      views: 18,
      lastViewed: new Date('2025-01-27T10:15:00')
    },
    {
      id: 'wiki-4',
      title: 'Development Workflow',
      content: `# Development Workflow

## Git Workflow
1. Create feature branch
2. Develop and test
3. Create pull request
4. Code review
5. Merge to main

## Testing Strategy
- Unit tests for components
- Integration tests for APIs
- End-to-end tests for workflows

## Deployment Process
- Automated testing
- Staging deployment
- Production deployment
- Monitoring and rollback`,
      author: 'nida@greenlight.live',
      created: new Date('2025-01-24T09:00:00'),
      updated: new Date('2025-01-25T17:00:00'),
      tags: ['development', 'workflow', 'process'],
      category: 'development',
      isPublic: false,
      views: 12,
      lastViewed: new Date('2025-01-26T15:45:00')
    },
    {
      id: 'wiki-5',
      title: 'Business Intelligence Dashboard',
      content: `# Business Intelligence Dashboard

## Overview
The executive dashboard provides comprehensive business intelligence and system oversight.

## Key Metrics
- System performance
- User activity
- Business metrics
- Revenue tracking

## Features
- Real-time monitoring
- Custom reports
- Data visualization
- Export capabilities

## Access Control
- Executive level access
- Role-based permissions
- Audit logging`,
      author: 'nida@greenlight.live',
      created: new Date('2025-01-23T13:00:00'),
      updated: new Date('2025-01-24T11:00:00'),
      tags: ['business', 'intelligence', 'dashboard'],
      category: 'business',
      isPublic: false,
      views: 8,
      lastViewed: new Date('2025-01-25T14:20:00')
    }
  ]);

  // Categories and available tags
  const categories = useMemo(() => [
    { id: 'all', name: 'All Categories', icon: BookOpen },
    { id: 'architecture', name: 'Architecture', icon: Database },
    { id: 'user-guides', name: 'User Guides', icon: Users },
    { id: 'technical', name: 'Technical', icon: Code },
    { id: 'development', name: 'Development', icon: GitCommit },
    { id: 'business', name: 'Business', icon: BarChart3 }
  ], []);

  const availableTags = useMemo(() => {
    const allTags = new Set<string>();
    wikiPages.forEach(page => {
      page.tags.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags).sort();
  }, [wikiPages]);

  // Filtered wiki pages
  const filteredPages = useMemo(() => {
    let items = wikiPages;

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
      items = items.filter(item => item.category === selectedCategory);
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      items = items.filter(item => 
        selectedTags.every(tag => item.tags.includes(tag))
      );
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
        case 'views': 
          comparison = b.views - a.views;
          break;
        case 'author': 
          comparison = a.author.localeCompare(b.author);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return items;
  }, [wikiPages, searchQuery, selectedCategory, selectedTags, sortBy, sortOrder]);

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

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : BookOpen;
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Living Wiki</h2>
          <p className="text-gray-600 dark:text-gray-400">Searchable, editable, AI-augmented documentation</p>
        </div>
        <button
          onClick={() => onAction('create-wiki-page')}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Page</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'title' | 'date' | 'views' | 'author')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="title">Title</option>
              <option value="date">Date</option>
              <option value="views">Views</option>
              <option value="author">Author</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedTags([]);
              }}
              className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Tag Filters */}
        {availableTags.length > 0 && (
          <div className="mt-4">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Wiki Pages */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Wiki Pages ({filteredPages.length})
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {wikiPages.filter(p => p.isPublic).length} public, {wikiPages.filter(p => !p.isPublic).length} private
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {filteredPages.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No wiki pages found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search criteria or create a new page.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPages.map((page) => {
                const CategoryIcon = getCategoryIcon(page.category);
                const isExpanded = expandedItems.has(page.id);
                
                return (
                  <div key={page.id} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <button
                            onClick={() => toggleExpanded(page.id)}
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
                              <CategoryIcon className="h-5 w-5 text-blue-500" />
                              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                {page.title}
                              </h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                page.isPublic 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                              }`}>
                                {page.isPublic ? 'Public' : 'Private'}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                              <span>By {page.author}</span>
                              <span>Updated {formatTimestamp(page.updated)}</span>
                              <span>{page.views} views</span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {page.tags.map((tag) => (
                                <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onAction('view-wiki', { pageId: page.id })}
                            className="btn-secondary text-sm"
                            title="View Page"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onAction('edit-wiki', { pageId: page.id })}
                            className="btn-secondary text-sm"
                            title="Edit Page"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onAction('share-wiki', { pageId: page.id })}
                            className="btn-secondary text-sm"
                            title="Share Page"
                          >
                            <Share className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Expanded content */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <div className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                              {page.content.length > 300 
                                ? `${page.content.substring(0, 300)}...` 
                                : page.content
                              }
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => onAction('view-wiki', { pageId: page.id })}
                                className="btn-primary text-sm"
                              >
                                Read Full Page
                              </button>
                              <button
                                onClick={() => onAction('edit-wiki', { pageId: page.id })}
                                className="btn-secondary text-sm"
                              >
                                Edit Page
                              </button>
                              <button
                                onClick={() => onAction('download-wiki', { pageId: page.id })}
                                className="btn-secondary text-sm"
                              >
                                Download
                              </button>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Created {page.created.toLocaleDateString()}
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