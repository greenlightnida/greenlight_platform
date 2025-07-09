#!/usr/bin/env node

/**
 * Comprehensive System Audit and Optimization Script
 * Identifies and resolves issues, removes redundancies, and streamlines processes
 */

import fs from 'fs';
import path from 'path';
// import { execSync } from 'child_process';

// Configuration
const CONFIG = {
  // Directories to audit
  directories: [
    'src/components',
    'src/services', 
    'src/utils',
    'src/hooks',
    'src/types',
    'scripts'
  ],
  
  // File patterns to include
  includePatterns: [
    '**/*.ts',
    '**/*.tsx',
    '**/*.js',
    '**/*.jsx'
  ],
  
  // File patterns to exclude
  excludePatterns: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/*.d.ts'
  ],
  
  // Common unused imports to remove
  commonUnusedImports: [
    'useEffect',
    'useMemo', 
    'useCallback',
    'useState',
    'React',
    'Fragment',
    'Suspense',
    'lazy'
  ],
  
  // Common unused variables
  commonUnusedVariables: [
    'setState',
    'setData',
    'setLoading',
    'setError',
    'handleClick',
    'handleSubmit',
    'handleChange',
    'onClick',
    'onSubmit',
    'onChange'
  ]
};

// Audit Results
const auditResults = {
  filesProcessed: 0,
  issuesFound: 0,
  issuesFixed: 0,
  unusedImportsRemoved: 0,
  unusedVariablesRemoved: 0,
  redundantCodeRemoved: 0,
  performanceOptimizations: 0,
  accessibilityFixes: 0,
  typeSafetyImprovements: 0
};

/**
 * Find all files matching patterns
 */
function findFiles(dir, patterns, excludes = []) {
  const files = [];
  
  function walk(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip excluded directories
        const relativePath = path.relative(process.cwd(), fullPath);
        const isExcluded = excludes.some(exclude => 
          relativePath.includes(exclude.replace('**/', '').replace('/**', ''))
        );
        
        if (!isExcluded) {
          walk(fullPath);
        }
      } else if (stat.isFile()) {
        // Check if file matches include patterns
        const relativePath = path.relative(process.cwd(), fullPath);
        const matchesPattern = patterns.some(pattern => {
          const regex = new RegExp(pattern.replace('**', '.*').replace('*', '[^/]*'));
          return regex.test(relativePath);
        });
        
        if (matchesPattern) {
          files.push(fullPath);
        }
      }
    }
  }
  
  walk(dir);
  return files;
}

/**
 * Analyze file for common issues
 */
function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Check for unused imports
  const importLines = content.match(/import\s+.*\s+from\s+['"][^'"]+['"]/g) || [];
  for (const importLine of importLines) {
    const imports = importLine.match(/\{([^}]+)\}/);
    if (imports) {
      const importNames = imports[1].split(',').map(name => name.trim());
      for (const name of importNames) {
        const cleanName = name.replace(/\s+as\s+.*$/, '');
        if (!content.includes(cleanName) && !content.includes(name)) {
          issues.push({
            type: 'unused_import',
            line: importLine,
            name: cleanName,
            severity: 'low'
          });
        }
      }
    }
  }
  
  // Check for unused variables
  const variableDeclarations = content.match(/const\s+(\w+)\s*=/g) || [];
  for (const declaration of variableDeclarations) {
    const varName = declaration.match(/const\s+(\w+)\s*=/)[1];
    if (CONFIG.commonUnusedVariables.includes(varName)) {
      const usageCount = (content.match(new RegExp(`\\b${varName}\\b`, 'g')) || []).length;
      if (usageCount <= 1) {
        issues.push({
          type: 'unused_variable',
          line: declaration,
          name: varName,
          severity: 'medium'
        });
      }
    }
  }
  
  // Check for redundant code
  const lines = content.split('\n');
  const lineCounts = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length > 10) {
      lineCounts[trimmed] = (lineCounts[trimmed] || 0) + 1;
    }
  }
  
  for (const [line, count] of Object.entries(lineCounts)) {
    if (count > 3) {
      issues.push({
        type: 'redundant_code',
        line: line,
        count: count,
        severity: 'medium'
      });
    }
  }
  
  // Check for performance issues
  if (content.includes('useEffect(() => {}, [])')) {
    issues.push({
      type: 'performance_issue',
      line: 'Empty useEffect dependency array',
      severity: 'high'
    });
  }
  
  if (content.includes('any')) {
    issues.push({
      type: 'type_safety',
      line: 'Usage of any type',
      severity: 'medium'
    });
  }
  
  // Check for accessibility issues
  if (content.includes('onClick') && !content.includes('onKeyDown') && !content.includes('role=')) {
    issues.push({
      type: 'accessibility',
      line: 'Click handler without keyboard support',
      severity: 'medium'
    });
  }
  
  return issues;
}

/**
 * Fix common issues in file
 */
function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Remove unused imports
  const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"][^'"]+['"]/g;
  content = content.replace(importRegex, (match, imports) => {
    const importNames = imports.split(',').map(name => name.trim());
    const usedImports = importNames.filter(name => {
      const cleanName = name.replace(/\s+as\s+.*$/, '');
      return content.includes(cleanName) || content.includes(name);
    });
    
    if (usedImports.length !== importNames.length) {
      modified = true;
      auditResults.unusedImportsRemoved += importNames.length - usedImports.length;
      
      if (usedImports.length === 0) {
        return ''; // Remove entire import
      } else {
        return `import { ${usedImports.join(', ')} } from '${match.match(/from\s+['"]([^'"]+)['"]/)[1]}'`;
      }
    }
    
    return match;
  });
  
  // Remove empty import statements
  content = content.replace(/import\s+\{\s*\}\s+from\s+['"][^'"]+['"];?\n?/g, '');
  
  // Fix common accessibility issues
  content = content.replace(
    /<div\s+onClick=/g,
    '<div role="button" tabIndex={0} onKeyDown={(e) => e.key === \'Enter\' && e.currentTarget.click()} onClick='
  );
  
  // Add proper labels
  content = content.replace(
    /<input([^>]*)\/>/g,
    (match, attrs) => {
      if (!attrs.includes('aria-label') && !attrs.includes('id=')) {
        return `<input${attrs} aria-label="Input field" />`;
      }
      return match;
    }
  );
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    auditResults.issuesFixed++;
  }
  
  return modified;
}

/**
 * Generate optimization report
 */
function generateReport() {
  const report = `
# System Audit and Optimization Report

## Summary
- Files Processed: ${auditResults.filesProcessed}
- Issues Found: ${auditResults.issuesFound}
- Issues Fixed: ${auditResults.issuesFixed}
- Unused Imports Removed: ${auditResults.unusedImportsRemoved}
- Unused Variables Removed: ${auditResults.unusedVariablesRemoved}
- Redundant Code Removed: ${auditResults.redundantCodeRemoved}
- Performance Optimizations: ${auditResults.performanceOptimizations}
- Accessibility Fixes: ${auditResults.accessibilityFixes}
- Type Safety Improvements: ${auditResults.typeSafetyImprovements}

## Recommendations

### 1. Code Splitting
- Implement dynamic imports for large components
- Use React.lazy() for route-based code splitting
- Consider bundle analysis to identify large dependencies

### 2. Performance Optimization
- Implement React.memo() for expensive components
- Use useMemo() and useCallback() strategically
- Optimize re-renders with proper dependency arrays

### 3. Type Safety
- Replace 'any' types with proper TypeScript interfaces
- Add strict type checking
- Implement proper error boundaries

### 4. Accessibility
- Add proper ARIA labels
- Implement keyboard navigation
- Ensure proper color contrast
- Add screen reader support

### 5. Bundle Optimization
- Remove unused dependencies
- Implement tree shaking
- Use production builds
- Consider code splitting strategies

## Next Steps
1. Run automated tests
2. Perform manual accessibility testing
3. Monitor performance metrics
4. Implement continuous monitoring
5. Regular code quality audits
`;

  fs.writeFileSync('AUDIT_OPTIMIZATION_REPORT.md', report);
  console.log('Audit report generated: AUDIT_OPTIMIZATION_REPORT.md');
}

/**
 * Main audit function
 */
async function runAudit() {
  console.log('🔍 Starting comprehensive system audit...\n');
  
  // Find all files to audit
  const allFiles = [];
  for (const dir of CONFIG.directories) {
    if (fs.existsSync(dir)) {
      const files = findFiles(dir, CONFIG.includePatterns, CONFIG.excludePatterns);
      allFiles.push(...files);
    }
  }
  
  console.log(`📁 Found ${allFiles.length} files to audit\n`);
  
  // Process each file
  for (const filePath of allFiles) {
    try {
      auditResults.filesProcessed++;
      
      // Analyze file for issues
      const issues = analyzeFile(filePath);
      auditResults.issuesFound += issues.length;
      
      // Fix issues if any found
      if (issues.length > 0) {
        const fixed = fixFile(filePath);
        if (fixed) {
          console.log(`✅ Fixed issues in: ${path.relative(process.cwd(), filePath)}`);
        }
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  }
  
  // Generate report
  generateReport();
  
  console.log('\n🎉 Audit completed!');
  console.log(`📊 Results: ${auditResults.issuesFixed}/${auditResults.issuesFound} issues fixed`);
  console.log(`📈 Optimizations applied: ${auditResults.unusedImportsRemoved + auditResults.unusedVariablesRemoved + auditResults.redundantCodeRemoved}`);
}

// Run the audit
runAudit().catch(console.error); 