/**
 * System Master Component Types
 * Common interfaces and types for system-master components
 */

export interface SystemStatus {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'error' | 'offline';
  lastUpdated: Date;
  details?: string;
}

export interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  uptime: number;
}

export interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  timestamp: Date;
  source: string;
  resolved?: boolean;
}

export interface ConsoleProps {
  className?: string;
  onAction?: (action: string, data?: any) => void;
} 