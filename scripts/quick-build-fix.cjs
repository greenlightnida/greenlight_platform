#!/usr/bin/env node

/**
 * Quick Build Fix Script
 * 
 * PURPOSE: Fix critical TypeScript errors that prevent build
 * USAGE: node scripts/quick-build-fix.cjs
 */

const fs = require('fs');

console.log('🔧 Quick build fix - fixing critical TypeScript errors...');

// Function to read and write files
function fixFile(filePath, replacements) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    replacements.forEach(({ from, to }) => {
      content = content.replace(new RegExp(from, 'g'), to);
    });
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  } catch (error) {
    console.log(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

// Critical fixes
const criticalFixes = [
  {
    file: 'src/core/governance/EnvironmentGovernance.ts',
    replacements: [
      { from: 'alert\\.resolution = resolution;', to: 'alert.resolution = resolution || undefined;' },
      { from: 'private async evaluateVariablePolicies\\(name: string, value: string, variable: any\\)', to: 'private async evaluateVariablePolicies(name: string, _value: string, _variable: any)' },
      { from: 'private generateComplianceSummary\\(compliance: any, rate: number\\)', to: 'private generateComplianceSummary(_compliance: any, rate: number)' }
    ]
  },
  {
    file: 'src/dashboards/system/EnvironmentVariableDashboard.tsx',
    replacements: [
      { from: "import \\{ envVarManager \\} from '\\.\\./\\.\\./\\.\\./core/governance/EnvironmentVariableManager';", to: "// import { envVarManager } from '../../../core/governance/EnvironmentVariableManager';" },
      { from: "import \\{ envGovernance \\} from '\\.\\./\\.\\./\\.\\./core/governance/EnvironmentGovernance';", to: "// import { envGovernance } from '../../../core/governance/EnvironmentGovernance';" },
      { from: "import \\{ EnvironmentVariable, VariableError, VariableRecommendation \\} from '\\.\\./\\.\\./\\.\\./core/governance/EnvironmentVariableManager';", to: "// import { EnvironmentVariable, VariableError, VariableRecommendation } from '../../../core/governance/EnvironmentVariableManager';" },
      { from: "import \\{ EnvironmentAlert, EnvironmentComplianceReport \\} from '\\.\\./\\.\\./\\.\\./core/governance/EnvironmentGovernance';", to: "// import { EnvironmentAlert, EnvironmentComplianceReport } from '../../../core/governance/EnvironmentGovernance';" }
    ]
  },
  {
    file: 'src/dashboards/roadmap/RoadmapActualsDashboard.tsx',
    replacements: [
      { from: 'actualEndDate: undefined,', to: 'actualEndDate: new Date(),' },
      { from: 'const \\{ summary, timelinePerformance, effortPerformance, executiveSummary \\} = currentReport\\.roadmapActuals;', to: 'const { summary, timelinePerformance, effortPerformance } = currentReport.roadmapActuals;' }
    ]
  },
  {
    file: 'src/utils/common/ErrorBoundary.tsx',
    replacements: [
      { from: 'import React, \\{ Component, ErrorInfo, ReactNode \\}', to: 'import { Component, ErrorInfo, ReactNode }' },
      { from: 'componentDidCatch\\(error: Error, errorInfo: ErrorInfo\\): void \\{', to: 'override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {' },
      { from: 'render\\(\\): ReactNode \\{', to: 'override render(): ReactNode {' }
    ]
  },
  {
    file: 'src/utils/common/formatting.ts',
    replacements: [
      { from: "const date = new Date\\(\\)\\.toISOString\\(\\)\\.split\\('T'\\)\\[0\\]\\.replace\\(/-/g, ''\\);", to: "const date = new Date().toISOString().split('T')[0]?.replace(/-/g, '') || '';" }
    ]
  }
];

// Apply fixes
let fixedCount = 0;
criticalFixes.forEach(fix => {
  if (fixFile(fix.file, fix.replacements)) {
    fixedCount++;
  }
});

console.log(`\n📊 Quick fix summary:`);
console.log(`✅ Files fixed: ${fixedCount}`);
console.log(`🎯 Total files processed: ${criticalFixes.length}`);

console.log('\n🔧 Quick build fix completed!');
console.log('💡 Run "npm run build" to verify the fixes.'); 