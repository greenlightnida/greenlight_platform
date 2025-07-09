import { HomeIcon, DocumentTextIcon, ClipboardDocumentListIcon, MapIcon, ClockIcon, CpuChipIcon, CodeBracketIcon, CogIcon } from '@heroicons/react/24/outline';
import { Activity } from 'lucide-react';
import React from 'react';

import { SystemNavigationProps, DashboardTab } from './types';

export const SystemNavigation: React.FC<SystemNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  const tabs: Array<{ id: DashboardTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'overview', label: 'Overview', icon: HomeIcon },
    { id: 'source-of-truth', label: 'Source of Truth', icon: DocumentTextIcon },
    { id: 'system-audit', label: 'System Audit', icon: ClipboardDocumentListIcon },
    { id: 'features-map', label: 'Features Map', icon: MapIcon },
    { id: 'changelog', label: 'Changelog', icon: ClockIcon },
    { id: 'intelligence', label: 'Intelligence', icon: CpuChipIcon },
    { id: 'dev-notes', label: 'Dev Notes', icon: CodeBracketIcon },
    { id: 'ai-optimization', label: 'AI Optimization', icon: CogIcon },
    { id: 'system-logs', label: 'System Logs', icon: Activity }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <nav className="flex space-x-1 overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}; 