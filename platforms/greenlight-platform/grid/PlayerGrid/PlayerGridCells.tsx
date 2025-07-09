import React from 'react';
import { PlayerCard } from './PlayerCard';
import { PlayerGridCellsProps } from './types';

export const PlayerGridCells: React.FC<PlayerGridCellsProps> = ({
  players,
  playerProgressMap,
  onPlayerClick,
  getStatusBadge
}) => {
  if (players.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">No players found</h3>
        <p className="text-sm">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {players.map((player) => {
        const progress = playerProgressMap.get(player.id);
        if (!progress) return null;

        const statusBadge = getStatusBadge(progress);

        return (
          <PlayerCard
            key={player.id}
            player={player}
            progress={progress}
            statusBadge={statusBadge}
            onClick={onPlayerClick}
          />
        );
      })}
    </div>
  );
}; 