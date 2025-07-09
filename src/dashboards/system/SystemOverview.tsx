import { DocumentTextIcon, CogIcon, ServerIcon, BeakerIcon } from '@heroicons/react/24/outline';


import { SystemOverviewProps } from './types';

export const SystemOverview: React.FC<SystemOverviewProps> = ({
  currentTime,
  fileStats,
  statusCounts,
  features,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onFileClick,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onRepoClick
}) => {
  // const getStatusColor = () => {}; // Unused function

  // const getStatusBgColor = () => {}; // Unused function

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">System Overview</h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Last updated: {currentTime.toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <DocumentTextIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Components</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{fileStats.components}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <CogIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Utilities</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{fileStats.utilities}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <ServerIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Data Files</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{fileStats.data}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <BeakerIcon className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{fileStats.tests}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${getStatusBgColor(status)}`} />
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {status.replace('-', ' ')}
                </span>
              </div>
              <span className={`text-lg font-bold ${getStatusColor(status)}`}>
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Features Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Active Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.slice(0, 4).map((feature) => (
            <div key={feature.name} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">{feature.name}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBgColor(feature.status)} ${getStatusColor(feature.status)}`}>
                  {feature.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{feature.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{feature.location}</span>
                {feature.uptime && <span>Uptime: {feature.uptime}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 