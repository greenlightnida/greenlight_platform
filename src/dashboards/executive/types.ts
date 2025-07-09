export interface ExecutiveDashboardProps {
  currentUser?: {
    id: string;
    name: string;
    role: string;
  };
  onSystemAction?: (action: string, data?: unknown) => void;
}

export type ExecutiveView = 'overview' | 'analytics' | 'system' | 'intelligence' | 'optimization' | 'development';

export interface BusinessMetrics {
  totalRevenue: number;
  monthlyGrowth: number;
  activeUsers: number;
  userGrowth: number;
  programSuccess: number;
  playerPlacement: number;
  systemUptime: number;
  performanceScore: number;
}

export interface SystemHealth {
  overall: 'healthy' | 'warning' | 'critical';
  performance: 'good' | 'fair' | 'poor';
  security: 'secure' | 'warning' | 'breach';
  uptime: number;
  lastIncident: Date | null;
}

export interface SystemAction {
  type: 'export-report' | 'system-restart' | 'backup' | 'update' | 'monitor';
  data?: unknown;
} 