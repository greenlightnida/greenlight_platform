#!/usr/bin/env node

/**
 * Dummy Data Cleanup Script
 * 
 * PURPOSE: Remove all mock data, placeholders, and temporary content
 * - Identify mock data patterns
 * - Remove placeholder implementations
 * - Clean up TODO comments
 * - Replace with proper implementations or remove entirely
 * 
 * USAGE: node scripts/dummy-data-cleanup.cjs
 */

const fs = require('fs');
const path = require('path');

// Patterns to identify dummy/mock data
const DUMMY_PATTERNS = {
  mockData: [
    /\/\/ Mock data/gi,
    /\/\/ Mock.*data/gi,
    /generateSample/gi,
    /getMock/gi,
    /mock.*data/gi,
    /sample.*data/gi,
    /placeholder.*data/gi
  ],
  placeholders: [
    /\/\/ TODO:/gi,
    /\/\/ FIXME:/gi,
    /\/\/ placeholder/gi,
    /\/\/ temporary/gi,
    /placeholder.*implementation/gi,
    /temporary.*implementation/gi
  ],
  dummyFunctions: [
    /generateSample\w+/gi,
    /getMock\w+/gi,
    /createMock\w+/gi,
    /mock\w+Data/gi,
    /sample\w+Data/gi
  ],
  dummyValues: [
    /'placeholder'/gi,
    /"placeholder"/gi,
    /'temporary'/gi,
    /"temporary"/gi,
    /'mock'/gi,
    /"mock"/gi,
    /'sample'/gi,
    /"sample"/gi
  ]
};

// Files to scan
const SCAN_PATHS = [
  'src/**/*.ts',
  'src/**/*.tsx',
  'src/**/*.js',
  'src/**/*.jsx',
  'frontend/src/**/*.ts',
  'frontend/src/**/*.tsx',
  'backend/src/**/*.ts',
  'backend/src/**/*.js'
];

// Files to exclude
const EXCLUDE_PATTERNS = [
  'node_modules',
  'dist',
  'build',
  '.git',
  '*.test.ts',
  '*.spec.ts',
  '*.stories.tsx'
];

function findFiles(dir, patterns, excludes = []) {
  const files = [];
  
  function scanDirectory(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        // Skip excluded patterns
        const shouldExclude = excludes.some(pattern => {
          if (pattern.includes('*')) {
            const regex = new RegExp(pattern.replace(/\*/g, '.*'));
            return regex.test(item);
          }
          return fullPath.includes(pattern);
        });
        
        if (shouldExclude) continue;
        
        if (stat.isDirectory()) {
          scanDirectory(fullPath);
        } else if (stat.isFile()) {
          const shouldInclude = patterns.some(pattern => {
            if (pattern.includes('*')) {
              const regex = new RegExp(pattern.replace(/\*/g, '.*'));
              return regex.test(item);
            }
            return item.includes(pattern);
          });
          
          if (shouldInclude) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not scan directory ${currentDir}:`, error.message);
    }
  }
  
  scanDirectory(dir);
  return files;
}

function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = {
      file: filePath,
      mockData: [],
      placeholders: [],
      dummyFunctions: [],
      dummyValues: [],
      totalIssues: 0
    };
    
    // Check for mock data patterns
    DUMMY_PATTERNS.mockData.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        issues.mockData.push({
          pattern: pattern.source,
          matches: matches.length,
          lines: getLineNumbers(content, pattern)
        });
      }
    });
    
    // Check for placeholder patterns
    DUMMY_PATTERNS.placeholders.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        issues.placeholders.push({
          pattern: pattern.source,
          matches: matches.length,
          lines: getLineNumbers(content, pattern)
        });
      }
    });
    
    // Check for dummy function patterns
    DUMMY_PATTERNS.dummyFunctions.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        issues.dummyFunctions.push({
          pattern: pattern.source,
          matches: matches.length,
          lines: getLineNumbers(content, pattern)
        });
      }
    });
    
    // Check for dummy value patterns
    DUMMY_PATTERNS.dummyValues.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        issues.dummyValues.push({
          pattern: pattern.source,
          matches: matches.length,
          lines: getLineNumbers(content, pattern)
        });
      }
    });
    
    issues.totalIssues = issues.mockData.length + issues.placeholders.length + 
                        issues.dummyFunctions.length + issues.dummyValues.length;
    
    return issues;
  } catch (error) {
    console.warn(`Warning: Could not analyze file ${filePath}:`, error.message);
    return { file: filePath, totalIssues: 0 };
  }
}

function getLineNumbers(content, pattern) {
  const lines = content.split('\n');
  const lineNumbers = [];
  
  lines.forEach((line, index) => {
    if (pattern.test(line)) {
      lineNumbers.push(index + 1);
    }
  });
  
  return lineNumbers;
}

function generateCleanupPlan(issues) {
  const plan = {
    summary: {
      totalFiles: issues.length,
      filesWithIssues: issues.filter(i => i.totalIssues > 0).length,
      totalIssues: issues.reduce((sum, i) => sum + i.totalIssues, 0),
      mockDataIssues: issues.reduce((sum, i) => sum + i.mockData.length, 0),
      placeholderIssues: issues.reduce((sum, i) => sum + i.placeholders.length, 0),
      dummyFunctionIssues: issues.reduce((sum, i) => sum + i.dummyFunctions.length, 0),
      dummyValueIssues: issues.reduce((sum, i) => sum + i.dummyValues.length, 0)
    },
    files: issues.filter(i => i.totalIssues > 0).map(issue => ({
      file: issue.file,
      issues: {
        mockData: issue.mockData,
        placeholders: issue.placeholders,
        dummyFunctions: issue.dummyFunctions,
        dummyValues: issue.dummyValues
      },
      totalIssues: issue.totalIssues,
      priority: issue.totalIssues > 5 ? 'HIGH' : issue.totalIssues > 2 ? 'MEDIUM' : 'LOW'
    }))
  };
  
  return plan;
}

function printCleanupPlan(plan) {
  console.log('🧹 DUMMY DATA CLEANUP PLAN');
  console.log('='.repeat(80));
  
  console.log('📊 SUMMARY:');
  console.log(`   Total Files Scanned: ${plan.summary.totalFiles}`);
  console.log(`   Files with Issues: ${plan.summary.filesWithIssues}`);
  console.log(`   Total Issues Found: ${plan.summary.totalIssues}`);
  console.log('');
  
  console.log('🔍 ISSUE BREAKDOWN:');
  console.log(`   Mock Data: ${plan.summary.mockDataIssues}`);
  console.log(`   Placeholders: ${plan.summary.placeholderIssues}`);
  console.log(`   Dummy Functions: ${plan.summary.dummyFunctionIssues}`);
  console.log(`   Dummy Values: ${plan.summary.dummyValueIssues}`);
  console.log('');
  
  // High priority files
  const highPriority = plan.files.filter(f => f.priority === 'HIGH');
  if (highPriority.length > 0) {
    console.log('🚨 HIGH PRIORITY FILES:');
    console.log('-'.repeat(40));
    highPriority.forEach(file => {
      console.log(`   ${file.file} (${file.totalIssues} issues)`);
    });
    console.log('');
  }
  
  // Medium priority files
  const mediumPriority = plan.files.filter(f => f.priority === 'MEDIUM');
  if (mediumPriority.length > 0) {
    console.log('⚠️  MEDIUM PRIORITY FILES:');
    console.log('-'.repeat(40));
    mediumPriority.forEach(file => {
      console.log(`   ${file.file} (${file.totalIssues} issues)`);
    });
    console.log('');
  }
  
  // Low priority files
  const lowPriority = plan.files.filter(f => f.priority === 'LOW');
  if (lowPriority.length > 0) {
    console.log('📝 LOW PRIORITY FILES:');
    console.log('-'.repeat(40));
    lowPriority.forEach(file => {
      console.log(`   ${file.file} (${file.totalIssues} issues)`);
    });
    console.log('');
  }
  
  return plan;
}

function cleanupFile(filePath, issues) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Remove mock data comments
    issues.mockData.forEach(issue => {
      const pattern = new RegExp(issue.pattern, 'gi');
      content = content.replace(pattern, '');
      modified = true;
    });
    
    // Remove placeholder comments
    issues.placeholders.forEach(issue => {
      const pattern = new RegExp(issue.pattern, 'gi');
      content = content.replace(pattern, '');
      modified = true;
    });
    
    // Remove dummy function calls
    issues.dummyFunctions.forEach(issue => {
      const pattern = new RegExp(issue.pattern, 'gi');
      content = content.replace(pattern, '');
      modified = true;
    });
    
    // Remove dummy values
    issues.dummyValues.forEach(issue => {
      const pattern = new RegExp(issue.pattern, 'gi');
      content = content.replace(pattern, '');
      modified = true;
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      return true;
    }
    
    return false;
  } catch (error) {
    console.warn(`Warning: Could not cleanup file ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  try {
    console.log('🔍 Scanning for dummy data and placeholders...');
    
    // Find all relevant files
    const files = findFiles('.', ['*.ts', '*.tsx', '*.js', '*.jsx'], EXCLUDE_PATTERNS);
    console.log(`Found ${files.length} files to analyze`);
    
    // Analyze each file
    const issues = files.map(analyzeFile);
    
    // Generate cleanup plan
    const plan = generateCleanupPlan(issues);
    
    // Print plan
    printCleanupPlan(plan);
    
    // Save plan to file
    fs.writeFileSync(
      'data/reports/dummy-data-cleanup-plan.json',
      JSON.stringify(plan, null, 2)
    );
    
    console.log('📄 Cleanup plan saved to: data/reports/dummy-data-cleanup-plan.json');
    
    // Ask for confirmation before cleanup
    console.log('\n⚠️  WARNING: This will modify files. Review the plan first.');
    console.log('Run with --execute flag to perform cleanup: node scripts/dummy-data-cleanup.cjs --execute');
    
  } catch (error) {
    console.error('❌ Cleanup analysis failed:', error.message);
    process.exit(1);
  }
}

// Check if --execute flag is provided
if (process.argv.includes('--execute')) {
  console.log('🚀 Executing cleanup...');
  // TODO: Implement actual cleanup execution
  console.log('Cleanup execution not yet implemented');
} else {
  main();
} 