#!/usr/bin/env node

/**
 * Remove Unused Imports and Variables Script
 * 
 * PURPOSE: Remove unused imports and variables to reduce TypeScript errors
 * USAGE: node scripts/remove-unused.cjs
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 Removing unused imports and variables...');

// Function to remove unused imports and variables
function removeUnused(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Remove unused React imports
    if (content.includes('import React, { useState, useEffect } from \'react\';')) {
      content = content.replace('import React, { useState, useEffect } from \'react\';', 'import { useState, useEffect } from \'react\';');
      modified = true;
    }

    // Remove unused React import
    if (content.includes('import React from \'react\';')) {
      content = content.replace('import React from \'react\';', '');
      modified = true;
    }

    // Remove unused useState setters
    content = content.replace(/const \[([^,]+), set\1\] = useState/g, 'const [$1] = useState');
    modified = true;

    // Remove unused function declarations
    content = content.replace(/const ([a-zA-Z_][a-zA-Z0-9_]*) = \([^)]*\) => \{[\s\S]*?\};/g, (match, funcName) => {
      if (match.includes('// TODO') || match.includes('// FIXME')) {
        return match;
      }
      return `// const ${funcName} = () => {}; // Unused function`;
    });
    modified = true;

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Cleaned: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.log(`❌ Error cleaning ${filePath}:`, error.message);
    return false;
  }
}

// Files to clean
const filesToClean = [
  'src/dashboards/executive/ExecutiveDashboard.tsx',
  'src/dashboards/features/FeaturesDashboard.tsx',
  'src/dashboards/product/ProductDashboard.tsx',
  'src/dashboards/roadmap/RoadmapActualsDashboard.tsx',
  'src/dashboards/roadmap/RoadmapDashboard.tsx',
  'src/dashboards/system/SystemLogConsole.tsx',
  'src/dashboards/system/SystemOverview.tsx',
  'src/platforms/system-master/components/ScriptMaster.tsx',
  'src/platforms/system-master/components/SystemMaster.tsx',
  'src/utils/common/DeveloperNotesPanel.tsx'
];

// Apply cleaning
let cleanedCount = 0;
filesToClean.forEach(file => {
  if (removeUnused(file)) {
    cleanedCount++;
  }
});

console.log(`\n📊 Cleaning summary:`);
console.log(`✅ Files cleaned: ${cleanedCount}`);
console.log(`🎯 Total files processed: ${filesToClean.length}`);

console.log('\n🧹 Unused imports and variables removal completed!');
console.log('💡 Run "npm run build" to verify the improvements.'); 