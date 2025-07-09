/**
 * MediaLibrary Type Definitions
 * Extracted from MediaLibrary.tsx for better organization
 */

import { Player, Photo } from '../../types';

export interface MediaLibraryProps {
  players: Player[];
  onPhotoClick?: (photo: Photo) => void;
  onDownloadPhoto?: (photo: Photo) => void;
  onDownloadMultiple?: (photos: Photo[]) => void;
  onUpdatePhotoTags?: (photoId: string, tags: string[]) => void;
}

export type ViewMode = 'grid' | 'list';
export type SortField = 'date' | 'name' | 'size' | 'player' | 'confidence';
export type SortOrder = 'asc' | 'desc';

export interface FilterState {
  searchTerm: string;
  selectedPlayers: string[];
  selectedJerseyNumbers: number[];
  dateRange: { start: Date | null; end: Date | null };
  confidenceRange: { min: number; max: number };
  fileSizeRange: { min: number; max: number };
  tags: string[];
}

export interface PhotoWithPlayer extends Photo {
  playerName: string;
  playerJersey: number;
}

export interface PhotoCardProps {
  photo: PhotoWithPlayer;
  isSelected: boolean;
  onSelect: (photoId: string, isSelected: boolean) => void;
  onClick?: (photo: Photo) => void;
  onDownload?: (photo: Photo) => void;
  onEditTags?: (photo: Photo) => void;
}

export interface PhotoListItemProps {
  photo: PhotoWithPlayer;
  isSelected: boolean;
  onSelect: (photoId: string, isSelected: boolean) => void;
  onClick?: (photo: Photo) => void;
  onDownload?: (photo: Photo) => void;
  onEditTags?: (photo: Photo) => void;
}

export interface MediaFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  players: Player[];
  allTags: string[];
  allJerseyNumbers: number[];
  showFilters: boolean;
  onToggleFilters: () => void;
}

export interface MediaActionsProps {
  selectedPhotos: Set<string>;
  totalPhotos: number;
  onDownloadSelected: () => void;
  onClearSelection: () => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export interface MediaGalleryProps {
  photos: PhotoWithPlayer[];
  viewMode: ViewMode;
  selectedPhotos: Set<string>;
  onPhotoSelect: (photoId: string, isSelected: boolean) => void;
  onPhotoClick?: (photo: Photo) => void;
  onPhotoDownload?: (photo: Photo) => void;
  onPhotoEditTags?: (photo: Photo) => void;
}

export interface MediaSortProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
} 