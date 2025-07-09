import React from 'react';
import { Download, Grid, List, SortAsc, SortDesc } from 'lucide-react';
import { MediaActionsProps, MediaSortProps, ViewMode, SortField, SortOrder } from './types';

export const MediaActions: React.FC<MediaActionsProps> = ({
  selectedPhotos,
  totalPhotos,
  onDownloadSelected,
  onClearSelection,
  onSelectAll,
  onDeselectAll
}) => {
  const selectedCount = selectedPhotos.size;
  const isAllSelected = selectedCount === totalPhotos;
  const hasSelection = selectedCount > 0;

  return (
    <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4">
      <div className="flex items-center gap-4">
        {/* Selection Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={isAllSelected ? onDeselectAll : onSelectAll}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
          >
            {isAllSelected ? 'Deselect All' : 'Select All'}
          </button>
          
          {hasSelection && (
            <>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {selectedCount} of {totalPhotos} selected
              </span>
              <button
                onClick={onClearSelection}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
              >
                Clear
              </button>
            </>
          )}
        </div>

        {/* Download Selected */}
        {hasSelection && (
          <button
            onClick={onDownloadSelected}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Selected ({selectedCount})
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {totalPhotos} photo{totalPhotos !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export const MediaSort: React.FC<MediaSortProps> = ({
  sortField,
  sortOrder,
  onSortChange
}) => {
  const handleSortClick = (field: SortField) => {
    const newOrder: SortOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    onSortChange(field, newOrder);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <SortAsc className="w-4 h-4 text-gray-400" />;
    }
    return sortOrder === 'asc' ? 
      <SortAsc className="w-4 h-4 text-blue-600 dark:text-blue-400" /> : 
      <SortDesc className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
  };

  const sortFields: Array<{ field: SortField; label: string }> = [
    { field: 'date', label: 'Date' },
    { field: 'name', label: 'Name' },
    { field: 'size', label: 'Size' },
    { field: 'player', label: 'Player' },
    { field: 'confidence', label: 'AI Confidence' }
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
      {sortFields.map(({ field, label }) => (
        <button
          key={field}
          onClick={() => handleSortClick(field)}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-colors ${
            sortField === field
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {label}
          {getSortIcon(field)}
        </button>
      ))}
    </div>
  );
};

export const ViewModeToggle: React.FC<{
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}> = ({ viewMode, onViewModeChange }) => {
  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
      <button
        onClick={() => onViewModeChange('grid')}
        className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm transition-colors ${
          viewMode === 'grid'
            ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        <Grid className="w-4 h-4" />
        Grid
      </button>
      <button
        onClick={() => onViewModeChange('list')}
        className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm transition-colors ${
          viewMode === 'list'
            ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        <List className="w-4 h-4" />
        List
      </button>
    </div>
  );
}; 