import React from 'react';
import { User, Calendar, Target, TrendingUp, Clock } from 'lucide-react';
// import { Player, PlayerProgress, StatusBadge } from '../../types';
import { PlayerCardProps } from './types';

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  progress,
  statusBadge,
  onClick
}) => {
  const handleClick = () => {
    onClick(player);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (percentage >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getProgressBgColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100 dark:bg-green-900';
    if (percentage >= 60) return 'bg-yellow-100 dark:bg-yellow-900';
    if (percentage >= 40) return 'bg-orange-100 dark:bg-orange-900';
    return 'bg-red-100 dark:bg-red-900';
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      role="button"
      tabIndex={0}
      className="group relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 cursor-pointer hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
    >
      {/* Status Badge */}
      {statusBadge && (
        <div className="absolute top-2 right-2">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              statusBadge.color === 'red' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
              statusBadge.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
              statusBadge.color === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            {statusBadge.name}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
            {player.name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mt-1">
            <User className="w-3 h-3" />
            <span>#{player.jerseyNumber}</span>
            {player.primaryPosition && (
              <>
                <span>•</span>
                <span>{player.primaryPosition}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-gray-600 dark:text-gray-400">Progress</span>
          <span className={`font-medium ${getProgressColor(progress.completionLevel)}`}>
            {Math.round(progress.completionLevel)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getProgressBgColor(progress.completionLevel)}`}
            style={{ width: `${progress.completionLevel}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <Target className="w-3 h-3" />
          <span>{progress.milestones.length}/10 milestones</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <TrendingUp className="w-3 h-3" />
          <span>Level {Math.floor(progress.completionLevel / 20) + 1}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <Calendar className="w-3 h-3" />
          <span>{player.graduationYear || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <Clock className="w-3 h-3" />
          <span>{Math.floor((Date.now() - progress.lastActivity.getTime()) / (1000 * 60 * 60 * 24))} days ago</span>
        </div>
      </div>

      {/* Tags */}
      {player.tags && player.tags.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-1">
            {player.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {tag.name}
              </span>
            ))}
            {player.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{player.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-blue-500 bg-opacity-0 group-hover:bg-opacity-5 rounded-lg transition-all duration-200 pointer-events-none" />
    </div>
  );
}; 