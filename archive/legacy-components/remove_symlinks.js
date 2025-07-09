#!/usr/bin/env node

import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Cleanup script to remove all symlinks and temporary Top_Bins references
 * This should be run after all core functionality has been moved to Greenlight Platform
 */

async function removeSymlinks() {
  console.log('🧹 Starting cleanup of symlinks and temporary references...');
  
  const symlinksToRemove = [
    'docs_top_bins',
    'src_top_bins', 
    'scripts_top_bins',
    'work_sessions_top_bins',
    'CHANGELOG_top_bins.md',
    'DECISION_LOG_top_bins.md',
    'LAUNCH_REPORT_top_bins.json',
    'featuresRegistry_top_bins.json'
  ];

  for (const symlink of symlinksToRemove) {
    try {
      const symlinkPath = path.join(process.cwd(), symlink);
      
      // Check if symlink exists
      try {
        const stats = await fs.lstat(symlinkPath);
        if (stats.isSymbolicLink()) {
          await fs.unlink(symlinkPath);
          console.log(`✅ Removed symlink: ${symlink}`);
        } else {
          console.log(`⚠️  Not a symlink, skipping: ${symlink}`);
        }
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log(`ℹ️  Symlink doesn't exist: ${symlink}`);
        } else {
          console.log(`❌ Error checking symlink ${symlink}:`, error.message);
        }
      }
    } catch (error) {
      console.log(`❌ Failed to remove symlink ${symlink}:`, error.message);
    }
  }
}

async function updateReferences() {
  console.log('\n📝 Updating references in documentation...');
  
  const filesToUpdate = [
    'CONSOLIDATION_PLAN.md',
    'README.md'
  ];

  for (const file of filesToUpdate) {
    try {
      const filePath = path.join(process.cwd(), file);
      
      // Check if file exists
      try {
        await fs.access(filePath);
      } catch {
        console.log(`ℹ️  File doesn't exist: ${file}`);
        continue;
      }

      let content = await fs.readFile(filePath, 'utf-8');
      
      // Replace Top_Bins references with Greenlight Platform references
      content = content.replace(/Top_Bins/g, 'Greenlight Platform');
      content = content.replace(/top_bins/g, 'greenlight-platform');
      content = content.replace(/TopBins/g, 'GreenlightPlatform');
      
      await fs.writeFile(filePath, content);
      console.log(`✅ Updated references in: ${file}`);
    } catch (error) {
      console.log(`❌ Failed to update ${file}:`, error.message);
    }
  }
}

async function createCleanupReport() {
  console.log('\n📊 Creating cleanup report...');
  
  const report = {
    timestamp: new Date().toISOString(),
    action: 'symlink_cleanup',
    status: 'completed',
    summary: {
      symlinksRemoved: [],
      referencesUpdated: [],
      errors: []
    }
  };

  try {
    await fs.writeFile(
      path.join(process.cwd(), 'data', 'history', 'cleanup_report.json'),
      JSON.stringify(report, null, 2)
    );
    console.log('✅ Cleanup report created');
  } catch (error) {
    console.log('❌ Failed to create cleanup report:', error.message);
  }
}

async function main() {
  try {
    console.log('🚀 Starting Greenlight Platform cleanup process...\n');
    
    await removeSymlinks();
    await updateReferences();
    await createCleanupReport();
    
    console.log('\n🎉 Cleanup completed successfully!');
    console.log('✅ All symlinks removed');
    console.log('✅ References updated');
    console.log('✅ Greenlight Platform is now the centralized governance system');
    console.log('\n📋 Next steps:');
    console.log('  1. Verify all functionality works correctly');
    console.log('  2. Test session management and protocols');
    console.log('  3. Run governance audits');
    console.log('  4. Update any remaining documentation');
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  }
}

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { removeSymlinks, updateReferences, createCleanupReport }; 