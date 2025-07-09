export interface SessionsManagerProps {
  className?: string;
}

export interface SessionState {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  startTime: Date;
  endTime?: Date;
  participants: string[];
  host: string;
  type: 'development' | 'planning' | 'review' | 'debugging' | 'meeting';
  tags: string[];
  notes: string[];
  files: string[];
}

export interface SessionMetrics {
  totalSessions: number;
  activeSessions: number;
  averageDuration: number;
  participantEngagement: number;
  completionRate: number;
  productivityScore: number;
} 