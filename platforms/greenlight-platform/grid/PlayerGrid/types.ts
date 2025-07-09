/**
 * PlayerGrid Type Definitions
 * Extracted from PlayerGrid.tsx for better organization
 */

import { Player, PlayerProgress, PlayerGridState, CampCohort, StatusBadge } from '../../types';

export interface PlayerGridProps {
  players?: Player[];
  cohorts?: CampCohort[];
  onPlayerClick?: (player: Player, progress: PlayerProgress) => void;
  onToggleView?: (viewMode: 'all_players' | 'by_cohort') => void;
}

export interface PlayerGridFiltersProps {
  gridState: PlayerGridState;
  onGridStateChange: (state: PlayerGridState) => void;
  playerFilter: 'all' | 'active' | 'prospects';
  onPlayerFilterChange: (filter: 'all' | 'active' | 'prospects') => void;
  availableStatuses: string[];
  availablePositions: string[];
  availableGraduationYears: number[];
}

export interface PlayerGridCellsProps {
  players: Player[];
  playerProgressMap: Map<string, PlayerProgress>;
  onPlayerClick: (player: Player) => void;
  getStatusBadge: (progress: PlayerProgress) => StatusBadge | undefined;
}

export interface PlayerCardProps {
  player: Player;
  progress: PlayerProgress;
  statusBadge?: StatusBadge;
  onClick: (player: Player) => void;
}

export interface PlayerGridHeaderProps {
  gridState: PlayerGridState;
  onGridStateChange: (state: PlayerGridState) => void;
  totalPlayers: number;
  filteredPlayers: number;
}

export interface PlayerGridTooltipProps {
  player: Player;
  progress: PlayerProgress;
  position: { x: number; y: number };
  isVisible: boolean;
}

export interface PlayerGridControlsProps {
  viewMode: 'all_players' | 'by_cohort';
  onToggleView: (viewMode: 'all_players' | 'by_cohort') => void;
  cohorts: CampCohort[];
}

export interface TooltipPosition {
  x: number;
  y: number;
}

export interface PlayerFilterState {
  statuses: string[];
  tags: string[];
  positions: string[];
  graduationYears: number[];
  searchTerm: string;
}

export type SortField = 'progress' | 'name' | 'lastActivity' | 'jerseyNumber';
export type SortDirection = 'asc' | 'desc';
export type PlayerFilterType = 'all' | 'active' | 'prospects';
export type ViewMode = 'all_players' | 'by_cohort'; 