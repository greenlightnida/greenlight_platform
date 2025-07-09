#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

const ORPHANED_FILES = [
  // API Layer - Unused
  "src/api/detectJerseyNumbers.ts",
  "src/api-gateway/graph-manager/APIGraphManager.ts",
  "src/api-gateway/graph-manager/types.ts",
  
  // Architecture - Unused
  "src/architecture/holonSystem.ts",
  
  // Components - Massive cleanup needed
  "src/components/AIDetectionSettings.tsx",
  "src/components/AIOptimizationPanel.tsx",
  "src/components/AccessibilityProvider.tsx",
  "src/components/Articulate/Articulate.tsx",
  "src/components/BatchUpload.tsx",
  "src/components/BatchUploadSettings.tsx",
  "src/components/ChangelogPanel.tsx",
  "src/components/CoachingToolkit/CoachingToolkit.tsx",
  "src/components/CoachingToolkit.tsx",
  "src/components/CohortManagement.tsx",
  "src/components/ConnectionStatus.tsx",
  "src/components/DataImport.tsx",
  "src/components/DataManagement.tsx",
  "src/components/DeveloperNotes/DeveloperNotesPanel.tsx",
  "src/components/ErrorBoundary.tsx",
  "src/components/ExecutiveDashboard/ExecutiveDashboard.tsx",
  "src/components/FeaturesMapPanel.tsx",
  "src/components/KeyboardNav.tsx",
  "src/components/MediaLibrary.tsx",
  "src/components/OutreachTracker.tsx",
  "src/components/PhotoDetectionVisualizer.tsx",
  "src/components/PhotoGallery.tsx",
  "src/components/PhotoUpload.tsx",
  "src/components/PlayerCRM.tsx",
  "src/components/PlayerCard.tsx",
  "src/components/PlayerGrid.tsx",
  "src/components/RoadmapDashboard/RoadmapDashboard.tsx",
  "src/components/SessionsManager/SessionsManager.tsx",
  "src/components/SessionsManager/types.ts",
  "src/components/SourceOfTruthConsole.tsx",
  "src/components/StatsCard.tsx",
  "src/components/StorageDashboard.tsx",
  "src/components/SystemAuditPanel.tsx",
  "src/components/SystemDashboard.tsx",
  "src/components/SystemEvolutionIntelligence.tsx",
  "src/components/SystemLogConsole/SystemLogConsole.tsx",
  "src/components/SystemMaster/InformConsole.tsx",
  "src/components/SystemMaster/ObserveConsole.tsx",
  "src/components/SystemMaster/ResolveConsole.tsx",
  "src/components/SystemMaster/SystemMaster.tsx",
  "src/components/SystemMaster/types.ts",
  "src/components/SystemRedirect.tsx",
  "src/components/TagManager.tsx",
  "src/components/TeamPortal.tsx",
  "src/components/ThemeProvider.tsx",
  "src/components/ThemeToggle.tsx",
  "src/components/design-system/atoms/Button/Button.stories.tsx",
  "src/components/design-system/atoms/Input/Input.tsx",
  "src/components/shared/Button/Button.tsx",
  "src/components/shared/Card/Card.tsx",
  
  // Config - Unused
  "src/config/ConfigManager.ts",
  "src/config/aiDetection.ts",
  "src/config/google-credentials.ts",
  "src/config/system.config.ts",
  
  // Contracts - Unused
  "src/contracts/repository-contracts.ts",
  
  // Core - Massive governance cleanup
  "src/core/governance/GovernanceOrchestrator.ts",
  "src/core/governance/RepositoryGovernor.ts",
  "src/core/governance/alerts/AlertManager.ts",
  "src/core/governance/documentation/DocumentationManager.ts",
  "src/core/governance/monitors/RepositoryMonitor.ts",
  "src/core/governance/policies/PolicyEngine.ts",
  "src/core/governance/types.ts",
  "src/core/holons/_test/ManagerTestUtils.ts",
  "src/core/holons/articulate/ArticulateManager.ts",
  "src/core/holons/articulate/KnowledgeManager.ts",
  "src/core/holons/articulate/WorkManager.ts",
  "src/core/holons/elaborate/ElaborateManager.ts",
  "src/core/holons/elaborate/SystemEvolutionManager.ts",
  "src/core/holons/systemMaster/APIManager.ts",
  "src/core/holons/systemMaster/IntegrationManager.ts",
  "src/core/holons/systemMaster/SystemMasterManager.ts",
  "src/core/migrations/MigrationsManager.ts",
  "src/core/operations/OperationsMaster.ts",
  "src/core/protocols/ProtocolManager.ts",
  "src/core/session-management/SessionManager.ts",
  
  // Hooks - Unused
  "src/hooks/useAccessibility.ts",
  "src/hooks/usePhotoUpload.ts",
  "src/hooks/useSupabaseData.ts",
  
  // Integrations - Unused
  "src/integrations/google-workspace/product-platforms-integration.ts",
  "src/integrations/google-workspace/system-governance-integration.ts",
  "src/integrations/google-workspace/wiki-holon-integration.ts",
  
  // Lib - Unused
  "src/lib/supabase.ts",
  
  // Server - Unused
  "src/server/google-sso-server.ts",
  "src/server/operations-dashboard.ts",
  
  // Services - Massive cleanup
  "src/services/anchorCommandService.ts",
  "src/services/auditService.ts",
  "src/services/auth/google-audit-service.ts",
  "src/services/auth/system-auth-manager.ts",
  "src/services/dataImportService.ts",
  "src/services/developerNotesService.ts",
  "src/services/featureReferenceService.ts",
  "src/services/featureSyncService.ts",
  "src/services/nlpService.ts",
  "src/services/openRouterService.ts",
  "src/services/playerService.ts",
  "src/services/systemLogService.ts",
  
  // Utils - Massive cleanup
  "src/utils/advancedDataEnrichment.ts",
  "src/utils/aiDetection.ts",
  "src/utils/aiOptimization.ts",
  "src/utils/aiSimulator.ts",
  "src/utils/batchProcessor.ts",
  "src/utils/cleanup.ts",
  "src/utils/cn.ts",
  "src/utils/common/constants.ts",
  "src/utils/common/types.ts",
  "src/utils/csv/fieldMapping.ts",
  "src/utils/csvImport.ts",
  "src/utils/dataEnrichment.ts",
  "src/utils/deploymentTracker.ts",
  "src/utils/fileStatus.ts",
  "src/utils/helpers.ts",
  "src/utils/intelligentCsvImport.ts",
  "src/utils/mattDataLoader.ts",
  "src/utils/performance.ts",
  "src/utils/windowManager.ts",
  
  // Duplicates - Keep frontend version, remove src version
  "src/vite-env.d.ts",
  
  // Frontend - Unused
  "frontend/src/App.tsx",
  "frontend/src/vite-env.d.ts"
];

const EMPTY_DIRECTORIES_TO_REMOVE = [
  "src/api",
  "src/api-gateway",
  "src/architecture",
  "src/contracts",
  "src/core/governance/alerts",
  "src/core/governance/documentation", 
  "src/core/governance/monitors",
  "src/core/governance/policies",
  "src/core/holons/_test",
  "src/core/holons/articulate",
  "src/core/holons/elaborate",
  "src/core/holons/systemMaster",
  "src/core/migrations",
  "src/core/operations",
  "src/core/protocols",
  "src/core/session-management",
  "src/integrations/google-workspace",
  "src/server",
  "src/utils/common",
  "src/utils/csv"
];

function removeFile(filePath: string): boolean {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`✓ REMOVED: ${filePath}`);
      return true;
    } else {
      console.log(`⚠ NOT FOUND: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`✗ ERROR removing ${filePath}:`, error);
    return false;
  }
}

function removeEmptyDirectory(dirPath: string): boolean {
  try {
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      if (files.length === 0) {
        fs.rmdirSync(dirPath);
        console.log(`✓ REMOVED EMPTY DIR: ${dirPath}`);
        return true;
      } else {
        console.log(`⚠ DIR NOT EMPTY: ${dirPath} (${files.length} files)`);
        return false;
      }
    } else {
      console.log(`⚠ DIR NOT FOUND: ${dirPath}`);
      return false;
    }
  } catch (error) {
    console.error(`✗ ERROR removing directory ${dirPath}:`, error);
    return false;
  }
}

function main() {
  console.log('=== RUTHLESS FILE CLEANUP EXECUTION ===\n');
  
  let removedCount = 0;
  let errorCount = 0;
  
  // Remove orphaned files
  console.log('REMOVING ORPHANED FILES:');
  console.log('='.repeat(50));
  
  for (const file of ORPHANED_FILES) {
    if (removeFile(file)) {
      removedCount++;
    } else {
      errorCount++;
    }
  }
  
  console.log('\nREMOVING EMPTY DIRECTORIES:');
  console.log('='.repeat(50));
  
  // Remove empty directories (in reverse order to handle nested dirs)
  for (const dir of EMPTY_DIRECTORIES_TO_REMOVE.reverse()) {
    removeEmptyDirectory(dir);
  }
  
  console.log('\n=== CLEANUP SUMMARY ===');
  console.log(`Files removed: ${removedCount}`);
  console.log(`Errors encountered: ${errorCount}`);
  console.log(`Total orphaned files processed: ${ORPHANED_FILES.length}`);
  
  // Create cleanup report
  const report = {
    timestamp: new Date().toISOString(),
    action: 'ruthless_cleanup',
    filesRemoved: removedCount,
    errors: errorCount,
    totalProcessed: ORPHANED_FILES.length,
    removedFiles: ORPHANED_FILES.filter(file => fs.existsSync(file) === false)
  };
  
  fs.writeFileSync('CLEANUP_REPORT.json', JSON.stringify(report, null, 2));
  console.log('\n✓ Cleanup report written to CLEANUP_REPORT.json');
}

main(); 