import React from 'react';
import { Download, Eye, Edit3 } from 'lucide-react';
// import { Photo } from '../../types';
import { formatDate, formatFileSize } from '../../utils/helpers';
import { PhotoListItemProps } from './types';

export const PhotoListItem: React.FC<PhotoListItemProps> = ({
  photo,
  isSelected,
  onSelect,
  onClick,
  onDownload,
  onEditTags
}) => {
  const handleRowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick(photo);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onSelect(photo.id, e.target.checked);
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDownload) {
      onDownload(photo);
    }
  };

  const handleEditTagsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEditTags) {
      onEditTags(photo);
    }
  };

  return (
    <div
      className={`flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-sm ${
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
      onClick={handleRowClick}
      onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.click()}
      role="button"
      tabIndex={0}
    >
      {/* Selection Checkbox */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={handleCheckboxChange}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
       aria-label="Input field" />

      {/* Thumbnail */}
      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={photo.url}
          alt={photo.originalName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-medium text-gray-900 dark:text-white text-sm truncate">
            {photo.originalName}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRowClick}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="View photo"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownloadClick}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Download photo"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handleEditTagsClick}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Edit tags"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <div className="flex items-center gap-4">
            <span>{photo.playerName} (#{photo.playerJersey})</span>
            <span>{formatDate(photo.uploadDate)}</span>
            <span>{formatFileSize(photo.size)}</span>
          </div>

          {/* Jersey Numbers */}
          {photo.jerseyNumbers.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xs">Jerseys:</span>
              {photo.jerseyNumbers.map((num) => (
                <span
                  key={num}
                  className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  #{num}
                </span>
              ))}
            </div>
          )}

          {/* AI Confidence */}
          {photo.aiConfidence !== undefined && (
            <div className="flex items-center gap-2">
              <span>AI Confidence:</span>
              <span className={`font-medium ${
                photo.aiConfidence > 0.8 ? 'text-green-600 dark:text-green-400' :
                photo.aiConfidence > 0.6 ? 'text-yellow-600 dark:text-yellow-400' :
                'text-red-600 dark:text-red-400'
              }`}>
                {Math.round(photo.aiConfidence * 100)}%
              </span>
            </div>
          )}

          {/* Tags */}
          {photo.tags && photo.tags.length > 0 && (
            <div className="flex items-center gap-1">
              <TagIcon className="w-3 h-3 text-gray-400" />
              <div className="flex flex-wrap gap-1">
                {photo.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  >
                    {tag}
                  </span>
                ))}
                {photo.tags.length > 3 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    +{photo.tags.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 