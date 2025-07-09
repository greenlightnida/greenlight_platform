#!/usr/bin/env node

/**
 * Update References Script
 * 
 * Updates all import references throughout the codebase to reflect the new directory structure
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔄 Starting reference update process...');

// Define the mapping of old paths to new paths
const pathMappings = [
  // Frontend component imports
  {
    old: '../components/RoadmapDashboard',
    new: '../../src/dashboards/roadmap/RoadmapDashboard'
  },
  {
    old: '../components/FeaturesDashboard',
    new: '../../src/dashboards/features/FeaturesDashboard'
  },
  {
    old: '../components/ProductDashboard',
    new: '../../src/dashboards/product/ProductDashboard'
  },
  {
    old: '../components/ExecutiveDashboard',
    new: '../../src/dashboards/executive/ExecutiveDashboard'
  },
  {
    old: '../components/SystemDashboard',
    new: '../../src/dashboards/system/SystemDashboard'
  },
  {
    old: '../components/TestingDashboard',
    new: '../../src/dashboards/testing/TestingDashboard'
  },
  
  // Backend service imports
  {
    old: '../services/aiInsightsService',
    new: '../services/ai/aiInsightsService'
  },
  {
    old: '../services/githubIntegrationService',
    new: '../services/integrations/githubIntegrationService'
  },
  {
    old: '../services/performanceTrackingService',
    new: '../services/performance/performanceTrackingService'
  },
  {
    old: '../services/supabaseSchemaService',
    new: '../services/integrations/supabaseSchemaService'
  },
  
  // Utility imports
  {
    old: '../utils/logger',
    new: '../utils/logger/logger'
  },
  {
    old: '../utils/cache',
    new: '../utils/cache/cache'
  },
  {
    old: '../utils/cn',
    new: '../utils/common/cn'
  },
  {
    old: '../utils/fileStatus',
    new: '../utils/common/fileStatus'
  },
  {
    old: '../utils/windowManager',
    new: '../utils/common/windowManager'
  },
  
  // Core imports
  {
    old: '../core/holons/systemHolon',
    new: '../core/holons/system-holon/systemHolon'
  },
  {
    old: '../core/holons/userHolon',
    new: '../core/holons/user-holon/userHolon'
  },
  {
    old: '../core/holons/sessionHolon',
    new: '../core/holons/session-holon/sessionHolon'
  },
  
  // Design system imports
  {
    old: '../components/DesignSystemDashboard',
    new: '../design-system/components/DesignSystemDashboard/DesignSystemDashboard'
  },
  {
    old: '../components/IconSystem',
    new: '../design-system/components/IconSystem/IconSystem'
  },
  {
    old: '../components/theme',
    new: '../design-system/components/theme'
  },
  
  // Platform imports
  {
    old: '../components/Articulate',
    new: '../platforms/articulate'
  },
  {
    old: '../components/Elaborate',
    new: '../platforms/elaborate'
  },
  {
    old: '../components/SystemMaster',
    new: '../platforms/system-master'
  }
];

// Function to update a single file
function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    pathMappings.forEach(mapping => {
      const oldPattern = new RegExp(`from ['"]${mapping.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'g');
      if (oldPattern.test(content)) {
        content = content.replace(oldPattern, `from '${mapping.new}'`);
        updated = true;
        console.log(`  ✅ Updated import in ${filePath}: ${mapping.old} → ${mapping.new}`);
      }
    });
    
    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    console.error(`  ❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

// Function to recursively find and update files
function updateDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  let updatedCount = 0;
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and .git
      if (file !== 'node_modules' && file !== '.git' && !file.startsWith('.')) {
        updatedCount += updateDirectory(filePath);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
      if (updateFile(filePath)) {
        updatedCount++;
      }
    }
  });
  
  return updatedCount;
}

// Main execution
try {
  console.log('📁 Scanning for files to update...');
  
  const updatedCount = updateDirectory('.');
  
  console.log(`\n✅ Reference update complete!`);
  console.log(`📊 Updated ${updatedCount} files`);
  
  // Run linter to check for remaining issues
  console.log('\n🔍 Running linter to check for remaining issues...');
  try {
    execSync('npm run lint', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️  Linter found some issues that may need manual attention');
  }
  
} catch (error) {
  console.error('❌ Error during reference update:', error);
  process.exit(1);
} 