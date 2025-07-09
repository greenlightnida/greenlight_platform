import { Player, PlayerProgress, CampCohort } from '../../types';

export interface ElevateConsoleProps {
  className?: string;
  initialView?: ToolkitView;
  currentUser?: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
    status?: string;
    lastActive?: Date;
    permissions?: string[];
  };
  onPlayerUpdate?: (playerId: string, updates: Partial<Player>) => void;
  onPhotoUpload?: (photos: File[]) => void;
  onCohortUpdate?: (cohortId: string, updates: Partial<CampCohort>) => void;
}

export type ToolkitView = 'dashboard' | 'players' | 'cohorts' | 'media' | 'analytics';

export interface PlayerWithProgress extends Player {
  progress: PlayerProgress;
  status: 'active' | 'inactive';
  jerseyNumber: number;
  cohort: string;
  lastSession: Date;
  totalSessions: number;
  mediaCount: number;
}

export interface CohortWithPlayers extends CampCohort {
  players: Player[];
  activePlayers: number;
  playerCount: number;
  focusAreas: string[];
  programStatus: 'active' | 'completed' | 'cancelled';
  description?: string;
}

export interface CoachingStats {
  totalPlayers: number;
  activeCohorts: number;
  totalSessions: number;
  averageProgress: number;
  mediaUploads: number;
  recentActivity: Array<{
    type: string;
    player: string;
    time: string;
  }>;
  activePlayers?: number;
  totalCohorts?: number;
}

export interface PlayerFilterState {
  status: string;
  position: string;
  cohort: string;
  searchQuery?: string;
  graduationYear?: string;
} 