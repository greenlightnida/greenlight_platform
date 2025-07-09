import React from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { PlayerGridState, PlayerFilterType } from './types';

interface PlayerGridFiltersProps {
  gridState: PlayerGridState;
  onGridStateChange: (state: PlayerGridState) => void;
  playerFilter: PlayerFilterType;
  onPlayerFilterChange: (filter: PlayerFilterType) => void;
  availableStatuses: string[];
  availablePositions: string[];
  availableGraduationYears: number[];
  showFilters: boolean;
  onToggleFilters: () => void;
}

export const PlayerGridFilters: React.FC<PlayerGridFiltersProps> = ({
  gridState,
  onGridStateChange,
  playerFilter,
  onPlayerFilterChange,
  availableStatuses,
  availablePositions,
  availableGraduationYears,
  showFilters,
  onToggleFilters
}) => {
  const handleFilterChange = (updates: Partial<PlayerGridState['filters']>) => {
    onGridStateChange({
      ...gridState,
      filters: { ...gridState.filters, ...updates }
    });
  };

  const clearFilters = () => {
    onGridStateChange({
      ...gridState,
      filters: {
        statuses: [],
        tags: [],
        positions: [],
        graduationYears: [],
        searchTerm: ''
      }
    });
  };

  const hasActiveFilters = 
    gridState.filters.searchTerm ||
    gridState.filters.statuses.length > 0 ||
    gridState.filters.positions.length > 0 ||
    gridState.filters.graduationYears.length > 0 ||
    gridState.filters.tags.length > 0 ||
    playerFilter !== 'all';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
      {/* Search and Filter Toggle */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search players by name or position..."
            value={gridState.filters.searchTerm}
            onChange={(e) => handleFilterChange({ searchTerm: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Player Type Filter */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {(['all', 'active', 'prospects'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => onPlayerFilterChange(filter)}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                playerFilter === filter
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
        
        <button
          onClick={onToggleFilters}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            showFilters
              ? 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300'
              : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
          {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="status-">Status
            </label>
            <select
              multiple
              value={gridState.filters.statuses}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                handleFilterChange({ statuses: selected });
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              size={4}
            >
              {availableStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Position Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="position-">Position
            </label>
            <select
              multiple
              value={gridState.filters.positions}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                handleFilterChange({ positions: selected });
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              size={4}
            >
              {availablePositions.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          </div>

          {/* Graduation Year Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="graduation-year-">Graduation Year
            </label>
            <select
              multiple
              value={gridState.filters.graduationYears.map(String)}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                handleFilterChange({ graduationYears: selected });
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              size={4}
            >
              {availableGraduationYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}; 