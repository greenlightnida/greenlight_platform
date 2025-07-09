import React from 'react';
import { Eye } from 'lucide-react';
// import { Photo } from '../../types';
import { MediaGalleryProps } from './types';
import { PhotoCard } from './PhotoCard';
import { PhotoListItem } from './PhotoListItem';

export const MediaGallery: React.FC<MediaGalleryProps> = ({
  photos,
  viewMode,
  selectedPhotos,
  onPhotoSelect,
  onPhotoClick,
  onPhotoDownload,
  onPhotoEditTags
}) => {
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <Eye className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-medium mb-2">No photos found</h3>
        <p className="text-sm">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            isSelected={selectedPhotos.has(photo.id)}
            onSelect={onPhotoSelect}
            onClick={onPhotoClick}
            onDownload={onPhotoDownload}
            onEditTags={onPhotoEditTags}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {photos.map((photo) => (
        <PhotoListItem
          key={photo.id}
          photo={photo}
          isSelected={selectedPhotos.has(photo.id)}
          onSelect={onPhotoSelect}
          onClick={onPhotoClick}
          onDownload={onPhotoDownload}
          onEditTags={onPhotoEditTags}
        />
      ))}
    </div>
  );
}; 