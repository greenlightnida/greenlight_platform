#!/usr/bin/env node

/**
 * TypeScript Excellence Protocol - Simplified Version
 * 
 * PURPOSE: Enforce TypeScript excellence practices across the codebase
 * - Strict type checking and validation
 * - Error pattern detection and prevention
 * - Code quality enforcement
 * 
 * Based on TypeScript Excellence Guide and Zipy Error Handling Patterns
 * 
 * USAGE: node scripts/typescript-excellence-simple.cjs
 */

const fs = require('fs');
const path = require('path');

// TypeScript Excellence Rules
const EXCELLENCE_RULES = {
  STRICT_TYPING: {
    name: 'Strict Typing',
    patterns: [
      { bad: /const\s+\w+\s*=\s*[^:]+$/, good: 'const variable: Type = value' },
      { bad: /function\s+\w+\s*\([^)]*\)\s*\{/, good: 'function name(param: Type): ReturnType {' },
      { bad: /:\s*any\b/, good: 'Use specific types instead of any' }
    ],
    priority: 'critical'
  },
  NULL_SAFETY: {
    name: 'Null Safety',
    patterns: [
      { bad: /\.\w+\s*\(/, good: 'Use optional chaining (?.) and nullish coalescing (??)' },
      { bad: /if\s*\(\s*\w+\s*\)/, good: 'if (variable !== null && variable !== undefined)' }
    ],
    priority: 'high'
  },
  INTERFACE_USAGE: {
    name: 'Interface Usage',
    patterns: [
      { bad: /\{\s*[^}]*\s*:\s*any/, good: 'interface ObjectShape { property: Type }' },
      { bad: /Record<string, any>/, good: 'Use specific interface instead' }
    ],
    priority: 'high'
  }
};

// Error Categories from Zipy Guide
const ERROR_CATEGORIES = {
  SYNTAX_ERRORS: {
    name: 'Syntax Errors',
    patterns: [
      /Unexpected token/,
      /Missing semicolon/,
      /Unterminated string literal/
    ],
    severity: 'critical'
  },
  TYPE_ERRORS: {
    name: 'Type Errors',
    patterns: [
      /Type.*is not assignable to type/,
      /Property.*does not exist on type/,
      /Object is possibly.*null/
    ],
    severity: 'high'
  },
  REFERENCE_ERRORS: {
    name: 'Reference Errors',
    patterns: [
      /Cannot find name/,
      /Cannot find module/,
      /Module.*has no exported member/
    ],
    severity: 'high'
  }
};

function analyzeTypeScriptFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  const suggestions = [];
  
  // Check for strict typing violations
  EXCELLENCE_RULES.STRICT_TYPING.patterns.forEach(pattern => {
    const matches = content.match(pattern.bad);
    if (matches) {
      issues.push({
        type: 'strict_typing',
        severity: 'high',
        message: `Found untyped variable/function. Use: ${pattern.good}`,
        line: findLineNumber(content, pattern.bad),
        file: filePath
      });
    }
  });
  
  // Check for null safety violations
  EXCELLENCE_RULES.NULL_SAFETY.patterns.forEach(pattern => {
    const matches = content.match(pattern.bad);
    if (matches) {
      issues.push({
        type: 'null_safety',
        severity: 'medium',
        message: `Potential null/undefined access. Use: ${pattern.good}`,
        line: findLineNumber(content, pattern.bad),
        file: filePath
      });
    }
  });
  
  // Check for interface usage violations
  EXCELLENCE_RULES.INTERFACE_USAGE.patterns.forEach(pattern => {
    const matches = content.match(pattern.bad);
    if (matches) {
      suggestions.push({
        type: 'interface_usage',
        priority: 'medium',
        message: `Consider using interface: ${pattern.good}`,
        line: findLineNumber(content, pattern.bad),
        file: filePath
      });
    }
  });
  
  return {
    file: filePath,
    issues,
    suggestions,
    score: calculateScore(issues, suggestions)
  };
}

function findLineNumber(content, pattern) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (pattern.test(lines[i])) {
      return i + 1;
    }
  }
  return 0;
}

function calculateScore(issues, suggestions) {
  let score = 100;
  
  issues.forEach(issue => {
    switch (issue.severity) {
      case 'critical':
        score -= 10;
        break;
      case 'high':
        score -= 5;
        break;
      case 'medium':
        score -= 3;
        break;
      case 'low':
        score -= 1;
        break;
    }
  });
  
  suggestions.forEach(suggestion => {
    switch (suggestion.priority) {
      case 'high':
        score -= 2;
        break;
      case 'medium':
        score -= 1;
        break;
      case 'low':
        score -= 0.5;
        break;
    }
  });
  
  return Math.max(0, score);
}

function findTypeScriptFiles(dir) {
  const files = [];
  
  function scanDirectory(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          scanDirectory(fullPath);
        } else if (stat.isFile() && /\.(ts|tsx)$/.test(item)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not scan directory ${currentDir}:`, error.message);
    }
  }
  
  scanDirectory(dir);
  return files;
}

function generateReport(analysisResults) {
  const totalFiles = analysisResults.length;
  const totalIssues = analysisResults.reduce((sum, result) => sum + result.issues.length, 0);
  const totalSuggestions = analysisResults.reduce((sum, result) => sum + result.suggestions.length, 0);
  const averageScore = analysisResults.reduce((sum, result) => sum + result.score, 0) / totalFiles;
  
  let report = `# TypeScript Excellence Protocol Report\n\n`;
  report += `**Generated**: ${new Date().toISOString()}\n`;
  report += `**Total Files Analyzed**: ${totalFiles}\n`;
  report += `**Total Issues Found**: ${totalIssues}\n`;
  report += `**Total Suggestions**: ${totalSuggestions}\n`;
  report += `**Average Excellence Score**: ${averageScore.toFixed(1)}/100\n\n`;
  
  // Summary by severity
  const severityCounts = {};
  analysisResults.forEach(result => {
    result.issues.forEach(issue => {
      severityCounts[issue.severity] = (severityCounts[issue.severity] || 0) + 1;
    });
  });
  
  report += `## Issues by Severity\n\n`;
  Object.entries(severityCounts).forEach(([severity, count]) => {
    report += `- **${severity.toUpperCase()}**: ${count} issues\n`;
  });
  report += `\n`;
  
  // Top issues
  const issueTypes = {};
  analysisResults.forEach(result => {
    result.issues.forEach(issue => {
      issueTypes[issue.type] = (issueTypes[issue.type] || 0) + 1;
    });
  });
  
  report += `## Top Issue Types\n\n`;
  Object.entries(issueTypes)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .forEach(([type, count]) => {
      report += `- **${type.replace('_', ' ')}**: ${count} instances\n`;
    });
  report += `\n`;
  
  // Files with issues
  const filesWithIssues = analysisResults.filter(result => result.issues.length > 0);
  if (filesWithIssues.length > 0) {
    report += `## Files Requiring Attention\n\n`;
    filesWithIssues
      .sort((a, b) => b.issues.length - a.issues.length)
      .slice(0, 10)
      .forEach(result => {
        report += `- **${result.file}**: ${result.issues.length} issues (Score: ${result.score.toFixed(1)})\n`;
      });
  }
  
  return report;
}

function main() {
  try {
    console.log('🚀 TypeScript Excellence Protocol - Starting Analysis');
    console.log('='.repeat(60));
    
    // Find all TypeScript files
    const tsFiles = findTypeScriptFiles('.');
    console.log(`📁 Found ${tsFiles.length} TypeScript files to analyze`);
    
    // Analyze each file
    const analysisResults = [];
    tsFiles.forEach(file => {
      try {
        const result = analyzeTypeScriptFile(file);
        analysisResults.push(result);
      } catch (error) {
        console.warn(`⚠️  Could not analyze ${file}:`, error.message);
      }
    });
    
    // Generate report
    const report = generateReport(analysisResults);
    
    // Save report
    const reportPath = 'data/reports/typescript-excellence-report.md';
    fs.writeFileSync(reportPath, report);
    
    // Print summary
    const totalIssues = analysisResults.reduce((sum, result) => sum + result.issues.length, 0);
    const averageScore = analysisResults.reduce((sum, result) => sum + result.score, 0) / analysisResults.length;
    
    console.log('\n📊 ANALYSIS COMPLETE');
    console.log('='.repeat(60));
    console.log(`📁 Files Analyzed: ${analysisResults.length}`);
    console.log(`❌ Total Issues: ${totalIssues}`);
    console.log(`💡 Average Score: ${averageScore.toFixed(1)}/100`);
    console.log(`📋 Report saved to: ${reportPath}`);
    
    if (totalIssues > 0) {
      console.log('\n🚨 ISSUES FOUND');
      console.log('Review the report and implement fixes to improve TypeScript excellence.');
    } else {
      console.log('\n✅ EXCELLENT! No issues found.');
    }
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}

module.exports = {
  analyzeTypeScriptFile,
  generateReport,
  findTypeScriptFiles
}; 