/**
 * SystemDashboard Type Definitions
 * Extracted from SystemDashboard.tsx for better organization
 */

export interface SystemFeature {
  name: string;
  status: 'online' | 'offline' | 'in development' | 'protected';
  location: string;
  description: string;
  repoRef: string;
  codeRefs: string[];
  stateSummary: string;
  tags: string[];
  lastDeployed?: string;
  uptime?: string;
  version?: string;
  fileLinks?: { name: string; path: string; type: 'component' | 'utility' | 'config' | 'data' }[];
}

export interface SystemDashboardProps {
  // Main props for the dashboard
  className?: string;
}

export interface SystemOverviewProps {
  currentTime: Date;
  fileStats: {
    components: number;
    utilities: number;
    config: number;
    data: number;
    tests: number;
    docs: number;
  };
  statusCounts: Record<string, number>;
  features: SystemFeature[];
  onFileClick: (filePath: string) => void;
  onRepoClick: (repoUrl: string) => void;
}

export interface SystemTabProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export interface SystemStatsProps {
  fileStats: {
    components: number;
    utilities: number;
    config: number;
    data: number;
    tests: number;
    docs: number;
  };
  statusCounts: Record<string, number>;
}

export interface SystemFeaturesProps {
  features: SystemFeature[];
  onFileClick: (filePath: string) => void;
  onRepoClick: (repoUrl: string) => void;
}

export interface SystemFeatureCardProps {
  feature: SystemFeature;
  onFileClick: (filePath: string) => void;
  onRepoClick: (repoUrl: string) => void;
}

export interface SystemNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export type DashboardTab = 'overview' | 'source-of-truth' | 'system-audit' | 'features-map' | 'changelog' | 'intelligence' | 'dev-notes' | 'ai-optimization' | 'system-logs';

export interface FileMetadata {
  type: 'component' | 'utility' | 'config' | 'data' | 'test' | 'documentation';
  path: string;
  name: string;
  lastModified?: string;
}

export interface SystemStatus {
  online: number;
  offline: number;
  'in development': number;
  protected: number;
} 