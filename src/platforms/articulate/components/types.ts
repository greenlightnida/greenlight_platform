export interface ArticulateWorkItem {
  id: string;
  type: 'feature' | 'bugfix' | 'documentation' | 'analysis' | 'task' | 'meeting' | 'decision';
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  assignee: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  metadata: {
    files?: string[];
    commits?: string[];
    timeSpent?: string;
  };
}

export interface ArticulateTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'review' | 'completed';
  priority: 'high' | 'medium' | 'low';
  assignee: string;
  dueDate?: Date;
  createdAt: Date;
  tags: string[];
  subtasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

export interface ArticulateKnowledgeItem {
  id: string;
  type: 'documentation' | 'changelog' | 'architecture' | 'guide' | 'reference';
  title: string;
  content: string;
  tags: string[];
  author: string;
  createdAt: Date;
  updatedAt: Date;
  version: string;
  status: 'draft' | 'published' | 'archived';
}

export interface ArticulateWikiPage {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  createdAt: Date;
  updatedAt: Date;
  version: string;
  status: 'draft' | 'published' | 'archived';
}

export type ArticulateView = 'dashboard' | 'knowledge' | 'history' | 'tasks' | 'wiki' | 'insights';

export interface SearchResult {
  id: string;
  type: 'documentation' | 'changelog' | 'code' | 'wiki' | 'task' | 'insight';
  title: string;
  description: string;
  url: string;
  relevance: number;
  timestamp: Date;
  tags: string[];
}

export interface SystemInsight {
  id: string;
  type: 'performance' | 'feature' | 'security' | 'business' | 'technical';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  timestamp: Date;
  data: Record<string, unknown>;
}

export interface WorkItem {
  id: string;
  type: 'documentation' | 'development' | 'analysis' | 'task' | 'meeting' | 'decision';
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending' | 'cancelled';
  author: string;
  timestamp: Date;
  tags: string[];
  assignees?: string[];
  dueDate?: Date;
  priority?: 'high' | 'medium' | 'low';
}

export interface KnowledgeItem {
  id: string;
  type: 'documentation' | 'changelog' | 'architecture' | 'guide' | 'reference';
  title: string;
  content: string;
  author: string;
  created: Date;
  updated: Date;
  tags: string[];
  version: string;
  status: 'draft' | 'published' | 'archived';
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'high' | 'medium' | 'low';
  assignee: string;
  created: Date;
  dueDate?: Date;
  completedDate?: Date;
  tags: string[];
  dependencies?: string[];
  estimatedHours?: number;
  actualHours?: number;
}

export interface WikiPage {
  id: string;
  title: string;
  content: string;
  author: string;
  created: Date;
  updated: Date;
  tags: string[];
  category: string;
  isPublic: boolean;
  views: number;
  lastViewed?: Date;
}

export interface WorkAction {
  type: 'create-document' | 'create-task' | 'view-insight' | 'view-work' | 'export-knowledge' | 'search-knowledge';
  data?: unknown;
}

export interface KnowledgeAction {
  type: 'navigate' | 'create' | 'update' | 'delete' | 'search' | 'export';
  data?: unknown;
} 