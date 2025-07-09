import React from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp, User, Calendar, Tag } from 'lucide-react';
// import { Player } from '../../types';
import { FilterState, MediaFiltersProps } from './types';

export const MediaFilters: React.FC<MediaFiltersProps> = ({
  filters,
  onFiltersChange,
  players,
  allTags,
  allJerseyNumbers,
  showFilters,
  onToggleFilters
}) => {
  const handleFilterChange = (updates: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchTerm: '',
      selectedPlayers: [],
      selectedJerseyNumbers: [],
      dateRange: { start: null, end: null },
      confidenceRange: { min: 0, max: 100 },
      fileSizeRange: { min: 0, max: 100 },
      tags: []
    });
  };

  const hasActiveFilters = 
    filters.searchTerm ||
    filters.selectedPlayers.length > 0 ||
    filters.selectedJerseyNumbers.length > 0 ||
    filters.dateRange.start ||
    filters.dateRange.end ||
    filters.confidenceRange.min > 0 ||
    filters.confidenceRange.max < 100 ||
    filters.fileSizeRange.min > 0 ||
    filters.fileSizeRange.max < 100 ||
    filters.tags.length > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
      {/* Search and Filter Toggle */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search photos by name, player, jersey number, or tags..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange({ searchTerm: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
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
          {/* Player Filter */}
          <div>
            <label htmlFor="player-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              Players
            </label>
            <select
              id="player-filter"
              multiple
              value={filters.selectedPlayers}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                handleFilterChange({ selectedPlayers: selected });
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              size={4}
            >
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name} (#{player.jerseyNumber})
                </option>
              ))}
            </select>
          </div>

          {/* Jersey Number Filter */}
          <div>
            <label htmlFor="jersey-numbers-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jersey Numbers
            </label>
            <select
              id="jersey-numbers-filter"
              multiple
              value={filters.selectedJerseyNumbers.map(String)}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                handleFilterChange({ selectedJerseyNumbers: selected });
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              size={4}
            >
              {allJerseyNumbers.map((number) => (
                <option key={number} value={number}>
                  #{number}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <label htmlFor="date-range-start" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date Range
            </label>
            <div className="space-y-2">
              <input
                id="date-range-start"
                type="date"
                value={filters.dateRange.start ? filters.dateRange.start.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const start = e.target.value ? new Date(e.target.value) : null;
                  handleFilterChange({ dateRange: { ...filters.dateRange, start } });
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <input
                id="date-range-end"
                type="date"
                value={filters.dateRange.end ? filters.dateRange.end.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const end = e.target.value ? new Date(e.target.value) : null;
                  handleFilterChange({ dateRange: { ...filters.dateRange, end } });
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Confidence Range Filter */}
          <div>
            <label htmlFor="ai-confidence-min" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">AI Confidence (%)
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  id="ai-confidence-min"
                  type="range"
                  min="0"
                  max="100"
                  value={filters.confidenceRange.min}
                  onChange={(e) => handleFilterChange({ 
                    confidenceRange: { ...filters.confidenceRange, min: parseInt(e.target.value) }
                  })}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
                  {filters.confidenceRange.min}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="ai-confidence-max"
                  type="range"
                  min="0"
                  max="100"
                  value={filters.confidenceRange.max}
                  onChange={(e) => handleFilterChange({ 
                    confidenceRange: { ...filters.confidenceRange, max: parseInt(e.target.value) }
                  })}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
                  {filters.confidenceRange.max}%
                </span>
              </div>
            </div>
          </div>

          {/* File Size Range Filter */}
          <div>
            <label htmlFor="file-size-min" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">File Size (MB)
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  id="file-size-min"
                  type="range"
                  min="0"
                  max="50"
                  value={filters.fileSizeRange.min}
                  onChange={(e) => handleFilterChange({ 
                    fileSizeRange: { ...filters.fileSizeRange, min: parseInt(e.target.value) }
                  })}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
                  {filters.fileSizeRange.min}MB
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="file-size-max"
                  type="range"
                  min="0"
                  max="50"
                  value={filters.fileSizeRange.max}
                  onChange={(e) => handleFilterChange({ 
                    fileSizeRange: { ...filters.fileSizeRange, max: parseInt(e.target.value) }
                  })}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
                  {filters.fileSizeRange.max}MB
                </span>
              </div>
            </div>
          </div>

          {/* Tags Filter */}
          <div>
            <label htmlFor="tags-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Tags
            </label>
            <select
              id="tags-filter"
              multiple
              value={filters.tags}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                handleFilterChange({ tags: selected });
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              size={4}
            >
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}; 