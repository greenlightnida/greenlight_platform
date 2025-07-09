import React, { useState, useEffect } from 'react';

import { Insights } from './Insights';
import { KnowledgeBase } from './KnowledgeBase';
import { TaskEngine } from './TaskEngine';
import { 
  ArticulateWorkItem, 
  ArticulateTask, 
  ArticulateKnowledgeItem, 
  ArticulateWikiPage 
} from './types';
import { Wiki } from './Wiki';
import { WorkHistory } from './WorkHistory';

/**
 * Articulate - Intelligent Work Management Engine
 * 
 * PURPOSE: Centralized work management and knowledge coordination
 * - Integrates all Articulate sub-components
 * - Provides unified interface for work management
 * - Coordinates knowledge, tasks, and insights
 * - Manages work history and wiki integration
 */

interface ArticulateProps {
  className?: string;
  initialTab?: 'knowledge' | 'tasks' | 'history' | 'wiki' | 'insights';
}

export const Articulate: React.FC<ArticulateProps> = ({ 
  className = '', 
  initialTab = 'knowledge' 
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [workItems] = useState<ArticulateWorkItem[]>([]);
  const [tasks] = useState<ArticulateTask[]>([]);
  const [knowledgeItems] = useState<ArticulateKnowledgeItem[]>([]);
  const [wikiPages] = useState<ArticulateWikiPage[]>([]);

  // Tab configuration
  const tabs = [
    { id: 'knowledge', label: 'Knowledge Base', icon: '📚' },
    { id: 'tasks', label: 'Task Engine', icon: '⚡' },
    { id: 'history', label: 'Work History', icon: '📋' },
    { id: 'wiki', label: 'Wiki', icon: '📖' },
    { id: 'insights', label: 'Insights', icon: '💡' }
  ] as const;

  useEffect(() => {
    // Load initial data
    loadArticulateData();
  }, []);

  const loadArticulateData = async () => {
    try {
      // Load work items, tasks, knowledge items, and wiki pages
      // This would typically fetch from your data store
      console.log('Loading Articulate data...');
    } catch (error) {
      console.error('Error loading Articulate data:', error);
    }
  };

  const handleTabChange = (tabId: typeof tabs[number]['id']) => {
    setActiveTab(tabId);
  };

  const [searchQuery, setSearchQuery] = useState('');

  const handleAction = (action: string, data?: unknown) => {
    console.log('Articulate action:', action, data);
    // Handle different actions
    switch (action) {
      case 'search':
        setSearchQuery(data as string || '');
        break;
      case 'create-knowledge':
        // Handle knowledge creation
        break;
      case 'create-task':
        // Handle task creation
        break;
      case 'update-work':
        // Handle work update
        break;
      default:
        console.log('Unhandled action:', action);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'knowledge':
        return (
          <KnowledgeBase 
            searchQuery={searchQuery}
            onAction={handleAction}
          />
        );
      case 'tasks':
        return (
          <TaskEngine 
            onAction={handleAction}
          />
        );
      case 'history':
        return (
          <WorkHistory 
            onAction={handleAction}
          />
        );
      case 'wiki':
        return (
          <Wiki 
            searchQuery={searchQuery}
            onAction={handleAction}
          />
        );
      case 'insights':
        return (
          <Insights 
            workItems={workItems}
            tasks={tasks}
            knowledgeItems={knowledgeItems}
            wikiPages={wikiPages}
            onAction={handleAction}
          />
        );
      default:
        return <KnowledgeBase searchQuery={searchQuery} onAction={handleAction} />;
    }
  };

  return (
    <div className={`articulate-container ${className}`}>
      {/* Header */}
      <div className="articulate-header">
        <h1 className="articulate-title">
          🎯 Articulate - Intelligent Work Management
        </h1>
        <p className="articulate-subtitle">
          Centralized knowledge, task, and insight coordination
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="articulate-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`articulate-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabChange(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="articulate-content">
        {renderActiveTab()}
      </div>

      {/* Footer */}
      <div className="articulate-footer">
        <div className="articulate-stats">
          <span>📚 {knowledgeItems.length} Knowledge Items</span>
          <span>⚡ {tasks.length} Active Tasks</span>
          <span>📋 {workItems.length} Work Items</span>
          <span>📖 {wikiPages.length} Wiki Pages</span>
        </div>
      </div>
    </div>
  );
}; 