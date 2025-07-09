/**
 * SystemDashboard Component
 * Main component using modular sub-components
 * Reduced from 481 lines to ~150 lines (69% reduction)
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';

import { referenceManager, ReferenceEntry } from '../../core/governance/ReferenceManager';
import { ThemeToggle } from '../../design-system/components/theme/ThemeToggle';
import { AIOptimizationPanel } from '../../utils/common/AIOptimizationPanel';
import { ChangelogPanel } from '../../utils/common/ChangelogPanel';
import { DeveloperNotesPanel } from '../../utils/common/DeveloperNotesPanel';
import { FeaturesMapPanel } from '../../utils/common/FeaturesMapPanel';
import { FILE_METADATA } from '../../utils/common/fileStatus';
import { SourceOfTruthConsole } from '../../utils/common/SourceOfTruthConsole';
import { SystemAuditPanel } from '../../utils/common/SystemAuditPanel';
import { SystemEvolutionIntelligence } from '../../utils/common/SystemEvolutionIntelligence';
import { openWindow, closeAllWindows } from '../../utils/common/windowManager';

import { SystemLogConsole } from './SystemLogConsole';
import { SystemNavigation } from './SystemNavigation';
import { SystemOverview } from './SystemOverview';
import { SystemFeature, DashboardTab } from './types';


// Convert ReferenceEntry to SystemFeature for compatibility
const convertReferenceToSystemFeature = (ref: ReferenceEntry): SystemFeature => ({
  name: ref.title,
  status: ref.type === 'external' ? 'online' : 'in development',
  location: `External Platform: ${ref.path}`,
  description: ref.description || `${ref.title} from external platform`,
  repoRef: ref.path || '',
  codeRefs: [],
  stateSummary: `External feature from ${ref.path}`,
  tags: ref.tags || [],
  lastDeployed: ref.lastModified.toISOString(),
  uptime: '99.9%', // Default for external features
  version: '1.0.0', // Default version
  fileLinks: []
});

export const SystemDashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [externalFeatures, setExternalFeatures] = useState<SystemFeature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 5000); // Reduced from 1 second to 5 seconds to improve performance

    return () => clearInterval(timer);
  }, []);

  // Load external features from ReferenceManager
  useEffect(() => {
    const loadExternalFeatures = async () => {
      try {
        // Get external features from registry
        const references = referenceManager.getReferencesByType('external');
        const features = references.map(convertReferenceToSystemFeature);
        setExternalFeatures(features);
      } catch (error) {
        console.error('Failed to load external features:', error);
        setExternalFeatures([]);
      } finally {
        setLoading(false);
      }
    };

    loadExternalFeatures();
  }, []);

  // Memoized file statistics
  const fileStats = useMemo(() => {
    const files = Object.values(FILE_METADATA);
    return {
      components: files.filter((f) => f.type === 'component').length,
      utilities: files.filter((f) => f.type === 'utility').length,
      config: files.filter((f) => f.type === 'config').length,
      data: files.filter((f) => f.type === 'data').length,
      tests: files.filter((f) => f.type === 'test').length,
      docs: files.filter((f) => f.type === 'documentation').length,
    };
  }, []);

  // Memoized feature status counts
  const statusCounts = useMemo(() => {
    return externalFeatures.reduce((acc, feature) => {
      acc[feature.status] = (acc[feature.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [externalFeatures]);

  // Memoized handlers
  const handleFileClick = useCallback((filePath: string) => {
    // For external features, this might be a different action
    const githubUrl = `https://github.com/greenlightnida/top_bins/blob/main/${filePath}`;
    openWindow(githubUrl, '_blank');
  }, []);

  const handleRepoClick = useCallback((repoUrl: string) => {
    openWindow(repoUrl, '_blank');
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab as DashboardTab);
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <SystemOverview
            currentTime={currentTime}
            fileStats={fileStats}
            statusCounts={statusCounts}
            features={externalFeatures}
            onFileClick={handleFileClick}
            onRepoClick={handleRepoClick}
          />
        );
      case 'source-of-truth':
        return <SourceOfTruthConsole />;
      case 'system-audit':
        return <SystemAuditPanel />;
      case 'features-map':
        return <FeaturesMapPanel />;
      case 'changelog':
        return <ChangelogPanel />;
      case 'intelligence':
        return <SystemEvolutionIntelligence />;
      case 'dev-notes':
        return <DeveloperNotesPanel />;
      case 'ai-optimization':
        return <AIOptimizationPanel />;
      case 'system-logs':
        return <SystemLogConsole />;
      default:
        return (
          <SystemOverview
            currentTime={currentTime}
            fileStats={fileStats}
            statusCounts={statusCounts}
            features={externalFeatures}
            onFileClick={handleFileClick}
            onRepoClick={handleRepoClick}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading system dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <SystemNavigation
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  System Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Last updated: {currentTime.toLocaleTimeString()}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <button
                  onClick={closeAllWindows}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Close All Windows
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {renderActiveTab()}
          </div>
        </div>
      </div>
    </div>
  );
}; 