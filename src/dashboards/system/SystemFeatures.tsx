import { DocumentTextIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import React from 'react';

import { SystemFeaturesProps } from './types';
export const SystemFeatures: React.FC<SystemFeaturesProps> = ({
  features,
  onFileClick,
  onRepoClick
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 dark:text-green-400';
      case 'offline': return 'text-red-600 dark:text-red-400';
      case 'in development': return 'text-yellow-600 dark:text-yellow-400';
      case 'protected': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 dark:bg-green-900';
      case 'offline': return 'bg-red-100 dark:bg-red-900';
      case 'in development': return 'bg-yellow-100 dark:bg-yellow-900';
      case 'protected': return 'bg-blue-100 dark:bg-blue-900';
      default: return 'bg-gray-100 dark:bg-gray-700';
    }
  };

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'component': return DocumentTextIcon;
      case 'utility': return CodeBracketIcon;
      case 'config': return CodeBracketIcon;
      case 'data': return DocumentTextIcon;
      default: return DocumentTextIcon;
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Features</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {features.map((feature) => (
          <div key={feature.name} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {feature.name}
                </h4>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBgColor(feature.status)} ${getStatusColor(feature.status)}`}>
                    {feature.status}
                  </span>
                  {feature.version && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      v{feature.version}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => onRepoClick(feature.repoRef)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="View Repository"
              >
                <DocumentTextIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {feature.description}
            </p>

            {/* Location */}
            <div className="mb-4">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Location:
              </span>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                {feature.location}
              </p>
            </div>

            {/* State Summary */}
            <div className="mb-4">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                State:
              </span>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                {feature.stateSummary}
              </p>
            </div>

            {/* Tags */}
            {feature.tags && feature.tags.length > 0 && (
              <div className="mb-4">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Tags:
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {feature.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* File Links */}
            {feature.fileLinks && feature.fileLinks.length > 0 && (
              <div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Files:
                </span>
                <div className="mt-2 space-y-1">
                  {feature.fileLinks.map((file) => {
                    const Icon = getFileTypeIcon(file.type);
                    return (
                      <button
                        key={file.path}
                        onClick={() => onFileClick(file.path)}
                        className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors w-full text-left"
                      >
                        <Icon className="w-3 h-3" />
                        <span className="truncate">{file.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Metrics */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                {feature.lastDeployed && (
                  <span>Deployed: {new Date(feature.lastDeployed).toLocaleDateString()}</span>
                )}
                {feature.uptime && (
                  <span>Uptime: {feature.uptime}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 