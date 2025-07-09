#!/usr/bin/env node

/**
 * TypeScript Excellence Protocol
 * 
 * PURPOSE: Enforce TypeScript excellence practices across the codebase
 * - Strict type checking and validation
 * - Error pattern detection and prevention
 * - Code quality enforcement
 * - Training and improvement tracking
 * 
 * Based on TypeScript Excellence Guide and Zipy Error Handling Patterns
 * 
 * USAGE: node scripts/typescript-excellence-protocol.cjs
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// TYPE DEFINITIONS - TypeScript Excellence Standards
// ============================================================================

/**
 * TypeScript Error Categories from Zipy Guide
 */
const ERROR_CATEGORIES = {
  SYNTAX_ERRORS: {
    name: 'Syntax Errors',
    patterns: [
      /Unexpected token/,
      /Missing semicolon/,
      /Unterminated string literal/,
      /Invalid or unexpected token/
    ],
    severity: 'critical',
    autoFix: true
  },
  TYPE_ERRORS: {
    name: 'Type Errors',
    patterns: [
      /Type.*is not assignable to type/,
      /Property.*does not exist on type/,
      /Object is possibly.*null/,
      /Type.*has no properties in common with type/
    ],
    severity: 'high',
    autoFix: false
  },
  REFERENCE_ERRORS: {
    name: 'Reference Errors',
    patterns: [
      /Cannot find name/,
      /Cannot find module/,
      /Module.*has no exported member/,
      /Could not find a declaration file/
    ],
    severity: 'high',
    autoFix: false
  },
  RANGE_ERRORS: {
    name: 'Range Errors',
    patterns: [
      /Maximum call stack size exceeded/,
      /Invalid array length/,
      /Index out of range/
    ],
    severity: 'medium',
    autoFix: false
  }
};

/**
 * TypeScript Excellence Rules
 */
const EXCELLENCE_RULES = {
  STRICT_TYPING: {
    name: 'Strict Typing',
    description: 'All variables, parameters, and return types must be explicitly typed',
    patterns: [
      { bad: /const\s+\w+\s*=\s*[^:]+$/, good: 'const variable: Type = value' },
      { bad: /function\s+\w+\s*\([^)]*\)\s*\{/, good: 'function name(param: Type): ReturnType {' },
      { bad: /:\s*any\b/, good: 'Use specific types instead of any' }
    ],
    priority: 'critical'
  },
  NULL_SAFETY: {
    name: 'Null Safety',
    description: 'Handle null/undefined cases properly',
    patterns: [
      { bad: /\.\w+\s*\(/, good: 'Use optional chaining (?.) and nullish coalescing (??)' },
      { bad: /if\s*\(\s*\w+\s*\)/, good: 'if (variable !== null && variable !== undefined)' }
    ],
    priority: 'high'
  },
  INTERFACE_USAGE: {
    name: 'Interface Usage',
    description: 'Use interfaces for object shapes',
    patterns: [
      { bad: /\{\s*[^}]*\s*:\s*any/, good: 'interface ObjectShape { property: Type }' },
      { bad: /Record<string, any>/, good: 'Use specific interface instead' }
    ],
    priority: 'high'
  },
  TYPE_GUARDS: {
    name: 'Type Guards',
    description: 'Use type guards for runtime type checking',
    patterns: [
      { bad: /as\s+\w+/, good: 'Use type guards instead of type assertions' },
      { bad: /typeof\s+\w+\s*===/, good: 'function isType(value: unknown): value is Type' }
    ],
    priority: 'medium'
  },
  GENERICS: {
    name: 'Generics',
    description: 'Use generics for reusable code',
    patterns: [
      { bad: /Array<any>/, good: 'Array<Type>' },
      { bad: /Promise<any>/, good: 'Promise<Type>' }
    ],
    priority: 'medium'
  }
};

// ============================================================================
// ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Analyze TypeScript file for excellence compliance
 */
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
  
  // Check for type guard violations
  EXCELLENCE_RULES.TYPE_GUARDS.patterns.forEach(pattern => {
    const matches = content.match(pattern.bad);
    if (matches) {
      suggestions.push({
        type: 'type_guards',
        priority: 'low',
        message: `Consider using type guard: ${pattern.good}`,
        line: findLineNumber(content, pattern.bad),
        file: filePath
      });
    }
  });
  
  // Check for generic usage violations
  EXCELLENCE_RULES.GENERICS.patterns.forEach(pattern => {
    const matches = content.match(pattern.bad);
    if (matches) {
      suggestions.push({
        type: 'generics',
        priority: 'medium',
        message: `Consider using generics: ${pattern.good}`,
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

/**
 * Find line number for a pattern match
 */
function findLineNumber(content, pattern) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (pattern.test(lines[i])) {
      return i + 1;
    }
  }
  return 0;
}

/**
 * Calculate excellence score
 */
function calculateScore(issues, suggestions) {
  let score = 100;
  
  // Deduct points for issues
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
  
  // Deduct points for suggestions
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

// ============================================================================
// TRAINING AND IMPROVEMENT
// ============================================================================

/**
 * Generate training recommendations
 */
function generateTrainingRecommendations(analysisResults: AnalysisResult[]): TrainingRecommendation[] {
  const recommendations: TrainingRecommendation[] = [];
  
  // Analyze common issues
  const issueCounts = new Map<string, number>();
  const suggestionCounts = new Map<string, number>();
  
  analysisResults.forEach(result => {
    result.issues.forEach(issue => {
      issueCounts.set(issue.type, (issueCounts.get(issue.type) || 0) + 1);
    });
    
    result.suggestions.forEach(suggestion => {
      suggestionCounts.set(suggestion.type, (suggestionCounts.get(suggestion.type) || 0) + 1);
    });
  });
  
  // Generate recommendations based on frequency
  issueCounts.forEach((count, type) => {
    if (count > 5) {
      recommendations.push({
        type: 'issue_focus',
        title: `Focus on ${type.replace('_', ' ')}`,
        description: `Found ${count} instances of ${type} issues. Review TypeScript Excellence Guide section on ${type}.`,
        priority: 'high',
        resources: [
          'TypeScript Excellence Guide - Strict Typing',
          'Zipy Error Handling - Type Safety'
        ]
      });
    }
  });
  
  suggestionCounts.forEach((count, type) => {
    if (count > 10) {
      recommendations.push({
        type: 'improvement_focus',
        title: `Improve ${type.replace('_', ' ')}`,
        description: `Found ${count} opportunities to improve ${type}. Consider implementing best practices.`,
        priority: 'medium',
        resources: [
          'TypeScript Excellence Guide - Advanced Patterns',
          'TypeScript Handbook - Generics'
        ]
      });
    }
  });
  
  return recommendations;
}

// ============================================================================
// REPORTING
// ============================================================================

/**
 * Generate comprehensive report
 */
function generateReport(analysisResults: AnalysisResult[], recommendations: TrainingRecommendation[]): string {
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
  const severityCounts = new Map<string, number>();
  analysisResults.forEach(result => {
    result.issues.forEach(issue => {
      severityCounts.set(issue.severity, (severityCounts.get(issue.severity) || 0) + 1);
    });
  });
  
  report += `## Issues by Severity\n\n`;
  severityCounts.forEach((count, severity) => {
    report += `- **${severity.toUpperCase()}**: ${count} issues\n`;
  });
  report += `\n`;
  
  // Top issues
  const issueTypes = new Map<string, number>();
  analysisResults.forEach(result => {
    result.issues.forEach(issue => {
      issueTypes.set(issue.type, (issueTypes.get(issue.type) || 0) + 1);
    });
  });
  
  report += `## Top Issue Types\n\n`;
  Array.from(issueTypes.entries())
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .forEach(([type, count]) => {
      report += `- **${type.replace('_', ' ')}**: ${count} instances\n`;
    });
  report += `\n`;
  
  // Training recommendations
  report += `## Training Recommendations\n\n`;
  recommendations.forEach(rec => {
    report += `### ${rec.title}\n`;
    report += `${rec.description}\n`;
    report += `**Priority**: ${rec.priority}\n`;
    report += `**Resources**:\n`;
    rec.resources.forEach(resource => {
      report += `- ${resource}\n`;
    });
    report += `\n`;
  });
  
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

// ============================================================================
// MAIN EXECUTION
// ============================================================================

/**
 * Main execution function
 */
function main(): void {
  try {
    console.log('🚀 TypeScript Excellence Protocol - Starting Analysis');
    console.log('='.repeat(60));
    
    // Find all TypeScript files
    const tsFiles = findTypeScriptFiles('.');
    console.log(`📁 Found ${tsFiles.length} TypeScript files to analyze`);
    
    // Analyze each file
    const analysisResults: AnalysisResult[] = [];
    tsFiles.forEach(file => {
      try {
        const result = analyzeTypeScriptFile(file);
        analysisResults.push(result);
      } catch (error) {
        console.warn(`⚠️  Could not analyze ${file}:`, error.message);
      }
    });
    
    // Generate recommendations
    const recommendations = generateTrainingRecommendations(analysisResults);
    
    // Generate report
    const report = generateReport(analysisResults, recommendations);
    
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
      console.log('\n🚨 CRITICAL ISSUES FOUND');
      console.log('Review the report and implement fixes to improve TypeScript excellence.');
    } else {
      console.log('\n✅ EXCELLENT! No critical issues found.');
    }
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    process.exit(1);
  }
}

/**
 * Find TypeScript files recursively
 */
function findTypeScriptFiles(dir: string): string[] {
  const files: string[] = [];
  
  function scanDirectory(currentDir: string): void {
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

// ============================================================================
// TYPE DEFINITIONS FOR ANALYSIS
// ============================================================================

interface Issue {
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  line: number;
  file: string;
}

interface Suggestion {
  type: string;
  priority: 'high' | 'medium' | 'low';
  message: string;
  line: number;
  file: string;
}

interface AnalysisResult {
  file: string;
  issues: Issue[];
  suggestions: Suggestion[];
  score: number;
}

interface TrainingRecommendation {
  type: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  resources: string[];
}

// Execute if run directly
if (require.main === module) {
  main();
}

module.exports = {
  analyzeTypeScriptFile,
  generateTrainingRecommendations,
  generateReport,
  findTypeScriptFiles
}; 