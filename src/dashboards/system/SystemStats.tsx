import { 
  DocumentTextIcon, 
  CogIcon, 
 
  BeakerIcon, 
  BookOpenIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';
import React from 'react';

import { SystemStatsProps } from './types';

export const SystemStats: React.FC<SystemStatsProps> = ({ fileStats, statusCounts }) => {
  const totalFiles = Object.values(fileStats).reduce((sum, count) => sum + count, 0);
  const totalFeatures = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);

  const stats = [
    {
      label: 'Components',
      value: fileStats.components,
      icon: DocumentTextIcon,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      label: 'Utilities',
      value: fileStats.utilities,
      icon: CogIcon,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900'
    },
    {
      label: 'Data Files',
      value: fileStats.data,
      icon: DocumentTextIcon,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900'
    },
    {
      label: 'Tests',
      value: fileStats.tests,
      icon: BeakerIcon,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900'
    },
    {
      label: 'Documentation',
      value: fileStats.docs,
      icon: BookOpenIcon,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900'
    },
    {
      label: 'Total Files',
      value: totalFiles,
      icon: ChartBarIcon,
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-100 dark:bg-gray-700'
    }
  ];

  return (
    <div className="space-y-6">
      {/* File Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">File Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map(({ label, value, icon: Icon, color, bgColor }) => (
            <div key={label} className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${bgColor} mb-2`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Feature Status Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(statusCounts).map(([status, count]) => {
            const percentage = totalFeatures > 0 ? Math.round((count / totalFeatures) * 100) : 0;
            const getStatusColor = (status: string) => {
              switch (status) {
                case 'online': return 'text-green-600 dark:text-green-400';
                case 'offline': return 'text-red-600 dark:text-red-400';
                case 'in development': return 'text-yellow-600 dark:text-yellow-400';
                case 'protected': return 'text-blue-600 dark:text-blue-400';
                default: return 'text-gray-600 dark:text-gray-400';
              }
            };

            return (
              <div key={status} className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{count}</div>
                <div className={`text-sm font-medium capitalize ${getStatusColor(status)}`}>
                  {status.replace('-', ' ')}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{percentage}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}; 