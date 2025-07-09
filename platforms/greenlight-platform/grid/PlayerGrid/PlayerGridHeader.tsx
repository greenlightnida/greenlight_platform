import React from 'react';
import { SortAsc, SortDesc, Users } from 'lucide-react';
import { PlayerGridState, SortField, SortDirection } from './types';

interface PlayerGridHeaderProps {
  gridState: PlayerGridState;
  onGridStateChange: (state: PlayerGridState) => void;
  totalPlayers: number;
  filteredPlayers: number;
}

export const PlayerGridHeader: React.FC<PlayerGridHeaderProps> = ({
  gridState,
  onGridStateChange,
  totalPlayers,
  filteredPlayers
}) => {
  const handleSortChange = (field: SortField) => {
    const newDirection: SortDirection = 
      gridState.sortBy === field && gridState.sortDirection === 'asc' ? 'desc' : 'asc';
    
    onGridStateChange({
      ...gridState,
      sortBy: field,
      sortDirection: newDirection
    });
  };

  const getSortIcon = (field: SortField) => {
    if (gridState.sortBy !== field) {
      return <SortAsc className="w-4 h-4 text-gray-400" />;
    }
    return gridState.sortDirection === 'asc' ? 
      <SortAsc className="w-4 h-4 text-blue-600 dark:text-blue-400" /> : 
      <SortDesc className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
  };

  const sortFields: Array<{ field: SortField; label: string }> = [
    { field: 'progress', label: 'Progress' },
    { field: 'name', label: 'Name' },
    { field: 'lastActivity', label: 'Last Activity' },
    { field: 'jerseyNumber', label: 'Jersey #' }
  ];

  return (
    <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4">
      {/* Title and Stats */}
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Player Grid</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Users className="w-4 h-4" />
          <span>
            {filteredPlayers} of {totalPlayers} players
          </span>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
        {sortFields.map(({ field, label }) => (
          <button
            key={field}
            onClick={() => handleSortChange(field)}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-colors ${
              gridState.sortBy === field
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {label}
            {getSortIcon(field)}
          </button>
        ))}
      </div>
    </div>
  );
}; 