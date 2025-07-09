#!/usr/bin/env node

/**
 * Comprehensive Organizational Audit
 * 
 * This script conducts a thorough audit of all supporting content (docs, files, etc.)
 * and ensures proper organization before milestone operations begin.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(section, description) {
  log(`\n${colors.cyan}${colors.bright}🔍 ${section.toUpperCase()}:${colors.reset} ${description}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Audit results storage
const auditResults = {
  timestamp: new Date().toISOString(),
  summary: {
    totalFiles: 0,
    issuesFound: 0,
    recommendations: 0,
    criticalIssues: 0
  },
  categories: {},
  issues: [],
  recommendations: []
};

// File categorization
const fileCategories = {
  documentation: {
    patterns: ['.md', '.txt', '.pdf', '.rtf'],
    directories: ['docs/', 'README', 'CHANGELOG', 'LICENSE'],
    description: 'Documentation files'
  },
  configuration: {
    patterns: ['.json', '.yaml', '.yml', '.env', '.config', '.conf'],
    directories: ['config/', 'package.json', 'tsconfig.json'],
    description: 'Configuration files'
  },
  sourceCode: {
    patterns: ['.js', '.ts', '.tsx', '.jsx', '.cjs', '.mjs'],
    directories: ['src/', 'frontend/', 'backend/'],
    description: 'Source code files'
  },
  scripts: {
    patterns: ['.sh', '.bash', '.cjs', '.js'],
    directories: ['scripts/'],
    description: 'Script files'
  },
  data: {
    patterns: ['.json', '.csv', '.xml'],
    directories: ['data/'],
    description: 'Data files'
  },
  assets: {
    patterns: ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico'],
    directories: ['assets/', 'public/'],
    description: 'Asset files'
  }
};

// Check if file matches category
function categorizeFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const fileName = path.basename(filePath).toLowerCase();
  const dirName = path.dirname(filePath).toLowerCase();

  for (const [category, config] of Object.entries(fileCategories)) {
    // Check file extension patterns
    if (config.patterns.includes(ext)) {
      return category;
    }
    
    // Check directory patterns
    for (const dirPattern of config.directories) {
      if (dirName.includes(dirPattern.toLowerCase()) || fileName.includes(dirPattern.toLowerCase())) {
        return category;
      }
    }
  }
  
  return 'other';
}

// Scan directory recursively
function scanDirectory(dirPath, maxDepth = 10, currentDepth = 0) {
  const files = [];
  
  if (currentDepth >= maxDepth) {
    return files;
  }

  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules and .git
        if (item === 'node_modules' || item === '.git') {
          continue;
        }
        
        files.push(...scanDirectory(fullPath, maxDepth, currentDepth + 1));
      } else {
        files.push(fullPath);
      }
    }
  } catch (error) {
    logWarning(`Could not scan directory ${dirPath}: ${error.message}`);
  }
  
  return files;
}

// Audit file organization
function auditFileOrganization() {
  logSection('File Organization', 'Analyzing file structure and categorization');
  
  const allFiles = scanDirectory('.');
  auditResults.summary.totalFiles = allFiles.length;
  
  // Categorize files
  const fileCategories = {};
  for (const file of allFiles) {
    const category = categorizeFile(file);
    if (!fileCategories[category]) {
      fileCategories[category] = [];
    }
    fileCategories[category].push(file);
  }
  
  auditResults.categories = fileCategories;
  
  // Analyze each category
  for (const [category, files] of Object.entries(fileCategories)) {
    logInfo(`${category}: ${files.length} files`);
    
    // Check for organization issues
    if (category === 'other' && files.length > 10) {
      auditResults.issues.push({
        type: 'organization',
        severity: 'medium',
        message: `Too many uncategorized files (${files.length})`,
        files: files.slice(0, 5) // Show first 5
      });
    }
    
    // Check for scattered files
    if (files.length > 0) {
      const directories = new Set(files.map(f => path.dirname(f)));
      if (directories.size > 5) {
        auditResults.issues.push({
          type: 'organization',
          severity: 'low',
          message: `${category} files scattered across ${directories.size} directories`,
          directories: Array.from(directories).slice(0, 5)
        });
      }
    }
  }
  
  logSuccess(`File organization audit completed: ${allFiles.length} files analyzed`);
}

// Audit documentation structure
function auditDocumentation() {
  logSection('Documentation', 'Analyzing documentation structure and completeness');
  
  const docs = auditResults.categories.documentation || [];
  const docsDir = docs.filter(f => f.includes('docs/'));
  const rootDocs = docs.filter(f => !f.includes('docs/') && !f.includes('node_modules'));
  
  // Check documentation directory structure
  if (docsDir.length > 0) {
    const docSubdirs = new Set();
    for (const doc of docsDir) {
      const relativePath = path.relative('docs', doc);
      const subdir = relativePath.split(path.sep)[0];
      if (subdir && subdir !== '.') {
        docSubdirs.add(subdir);
      }
    }
    
    logInfo(`Documentation subdirectories: ${Array.from(docSubdirs).join(', ')}`);
    
    // Check for missing essential docs
    const essentialDocs = ['README.md', 'CHANGELOG.md', 'LICENSE'];
    for (const essential of essentialDocs) {
      if (!rootDocs.some(doc => path.basename(doc) === essential)) {
        auditResults.issues.push({
          type: 'documentation',
          severity: 'medium',
          message: `Missing essential documentation: ${essential}`,
          recommendation: `Create ${essential} in project root`
        });
      }
    }
  } else {
    auditResults.issues.push({
      type: 'documentation',
      severity: 'high',
      message: 'No documentation directory found',
      recommendation: 'Create docs/ directory for project documentation'
    });
  }
  
  // Check for large documentation files
  for (const doc of docs) {
    try {
      const stats = fs.statSync(doc);
      if (stats.size > 100000) { // 100KB
        auditResults.issues.push({
          type: 'documentation',
          severity: 'low',
          message: `Large documentation file: ${doc} (${Math.round(stats.size / 1024)}KB)`,
          recommendation: 'Consider splitting into smaller files'
        });
      }
    } catch (error) {
      // File might not exist or be accessible
    }
  }
  
  logSuccess(`Documentation audit completed: ${docs.length} documentation files analyzed`);
}

// Audit configuration files
function auditConfiguration() {
  logSection('Configuration', 'Analyzing configuration files and settings');
  
  const configs = auditResults.categories.configuration || [];
  
  // Check for essential configuration files
  const essentialConfigs = ['package.json', 'tsconfig.json'];
  for (const config of essentialConfigs) {
    if (!configs.some(c => path.basename(c) === config)) {
      auditResults.issues.push({
        type: 'configuration',
        severity: 'high',
        message: `Missing essential configuration: ${config}`,
        recommendation: `Create ${config} in project root`
      });
    }
  }
  
  // Check for environment configuration
  const envFiles = configs.filter(c => c.includes('.env'));
  if (envFiles.length === 0) {
    auditResults.issues.push({
      type: 'configuration',
      severity: 'medium',
      message: 'No environment configuration files found',
      recommendation: 'Create .env.example and .env.local files'
    });
  }
  
  // Check for duplicate configuration
  const configNames = configs.map(c => path.basename(c));
  const duplicates = configNames.filter((name, index) => configNames.indexOf(name) !== index);
  if (duplicates.length > 0) {
    auditResults.issues.push({
      type: 'configuration',
      severity: 'medium',
      message: `Duplicate configuration files found: ${duplicates.join(', ')}`,
      recommendation: 'Consolidate duplicate configuration files'
    });
  }
  
  logSuccess(`Configuration audit completed: ${configs.length} configuration files analyzed`);
}

// Audit source code structure
function auditSourceCode() {
  logSection('Source Code', 'Analyzing source code organization and structure');
  
  const sourceFiles = auditResults.categories.sourceCode || [];
  
  // Check for proper source directory structure
  const srcDirs = new Set();
  for (const file of sourceFiles) {
    const dir = path.dirname(file);
    if (dir.includes('src') || dir.includes('frontend') || dir.includes('backend')) {
      srcDirs.add(dir);
    }
  }
  
  if (srcDirs.size === 0) {
    auditResults.issues.push({
      type: 'sourceCode',
      severity: 'high',
      message: 'No proper source code directories found',
      recommendation: 'Organize source code into src/, frontend/, or backend/ directories'
    });
  } else {
    logInfo(`Source directories found: ${Array.from(srcDirs).join(', ')}`);
  }
  
  // Check for TypeScript configuration
  const tsFiles = sourceFiles.filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));
  if (tsFiles.length > 0) {
    const hasTsConfig = auditResults.categories.configuration?.some(c => c.includes('tsconfig'));
    if (!hasTsConfig) {
      auditResults.issues.push({
        type: 'sourceCode',
        severity: 'medium',
        message: 'TypeScript files found but no tsconfig.json',
        recommendation: 'Create tsconfig.json for TypeScript configuration'
      });
    }
  }
  
  // Check for large source files
  for (const file of sourceFiles) {
    try {
      const stats = fs.statSync(file);
      if (stats.size > 50000) { // 50KB
        auditResults.issues.push({
          type: 'sourceCode',
          severity: 'low',
          message: `Large source file: ${file} (${Math.round(stats.size / 1024)}KB)`,
          recommendation: 'Consider refactoring into smaller modules'
        });
      }
    } catch (error) {
      // File might not exist or be accessible
    }
  }
  
  logSuccess(`Source code audit completed: ${sourceFiles.length} source files analyzed`);
}

// Audit scripts and automation
function auditScripts() {
  logSection('Scripts', 'Analyzing scripts and automation');
  
  const scripts = auditResults.categories.scripts || [];
  
  // Check for essential scripts
  const essentialScripts = ['package.json'];
  for (const script of essentialScripts) {
    if (!scripts.some(s => path.basename(s) === script)) {
      auditResults.issues.push({
        type: 'scripts',
        severity: 'high',
        message: `Missing essential script configuration: ${script}`,
        recommendation: `Create ${script} with proper scripts section`
      });
    }
  }
  
  // Check for build and test scripts
  if (scripts.some(s => s.includes('package.json'))) {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const packageScripts = packageJson.scripts || {};
      
      const essentialPackageScripts = ['build', 'test', 'start'];
      for (const script of essentialPackageScripts) {
        if (!packageScripts[script]) {
          auditResults.issues.push({
            type: 'scripts',
            severity: 'medium',
            message: `Missing package.json script: ${script}`,
            recommendation: `Add "${script}" script to package.json`
          });
        }
      }
    } catch (error) {
      logWarning('Could not parse package.json for script analysis');
    }
  }
  
  logSuccess(`Scripts audit completed: ${scripts.length} script files analyzed`);
}

// Generate recommendations
function generateRecommendations() {
  logSection('Recommendations', 'Generating organizational recommendations');
  
  // Count issues by severity
  const criticalIssues = auditResults.issues.filter(i => i.severity === 'high');
  const mediumIssues = auditResults.issues.filter(i => i.severity === 'medium');
  const lowIssues = auditResults.issues.filter(i => i.severity === 'low');
  
  auditResults.summary.criticalIssues = criticalIssues.length;
  auditResults.summary.issuesFound = auditResults.issues.length;
  
  // Generate recommendations based on issues
  if (criticalIssues.length > 0) {
    auditResults.recommendations.push({
      priority: 'critical',
      action: 'Address critical issues before proceeding with milestone operations',
      issues: criticalIssues.map(i => i.message)
    });
  }
  
  if (mediumIssues.length > 0) {
    auditResults.recommendations.push({
      priority: 'medium',
      action: 'Address medium-priority issues during milestone operations',
      issues: mediumIssues.map(i => i.message)
    });
  }
  
  // General recommendations
  if (auditResults.categories.other && auditResults.categories.other.length > 0) {
    auditResults.recommendations.push({
      priority: 'low',
      action: 'Organize uncategorized files into appropriate directories',
      details: `Move ${auditResults.categories.other.length} files to proper categories`
    });
  }
  
  auditResults.summary.recommendations = auditResults.recommendations.length;
  
  logSuccess(`Recommendations generated: ${auditResults.recommendations.length} recommendations`);
}

// Save audit results
function saveAuditResults() {
  const auditDir = 'data/audits';
  if (!fs.existsSync(auditDir)) {
    fs.mkdirSync(auditDir, { recursive: true });
  }
  
  const auditFile = path.join(auditDir, `organizational_audit_${Date.now()}.json`);
  fs.writeFileSync(auditFile, JSON.stringify(auditResults, null, 2));
  
  logSuccess(`Audit results saved to: ${auditFile}`);
  return auditFile;
}

// Print audit summary
function printAuditSummary() {
  log(`\n${colors.bright}${colors.magenta}📊 COMPREHENSIVE ORGANIZATIONAL AUDIT SUMMARY${colors.reset}`);
  log(`Timestamp: ${auditResults.timestamp}`);
  log(`Total Files: ${auditResults.summary.totalFiles}`);
  log(`Issues Found: ${auditResults.summary.issuesFound}`);
  log(`Critical Issues: ${auditResults.summary.criticalIssues}`);
  log(`Recommendations: ${auditResults.summary.recommendations}`);
  
  // Print file categories
  log(`\n${colors.bright}📁 FILE CATEGORIES:${colors.reset}`);
  for (const [category, files] of Object.entries(auditResults.categories)) {
    log(`${category}: ${files.length} files`);
  }
  
  // Print critical issues
  if (auditResults.summary.criticalIssues > 0) {
    log(`\n${colors.bright}${colors.red}🚨 CRITICAL ISSUES:${colors.reset}`);
    const criticalIssues = auditResults.issues.filter(i => i.severity === 'high');
    criticalIssues.forEach((issue, index) => {
      log(`${index + 1}. ${issue.message}`, 'red');
      if (issue.recommendation) {
        log(`   Recommendation: ${issue.recommendation}`, 'yellow');
      }
    });
  }
  
  // Print recommendations
  if (auditResults.recommendations.length > 0) {
    log(`\n${colors.bright}💡 RECOMMENDATIONS:${colors.reset}`);
    auditResults.recommendations.forEach((rec, index) => {
      log(`${index + 1}. [${rec.priority.toUpperCase()}] ${rec.action}`, 'cyan');
      if (rec.details) {
        log(`   ${rec.details}`, 'blue');
      }
    });
  }
  
  // Overall assessment
  log(`\n${colors.bright}🎯 OVERALL ASSESSMENT:${colors.reset}`);
  if (auditResults.summary.criticalIssues === 0) {
    log('✅ Organization is ready for milestone operations', 'green');
  } else {
    log('⚠️  Critical issues must be addressed before milestone operations', 'yellow');
  }
}

// Main audit execution
async function runComprehensiveAudit() {
  log(`${colors.bright}${colors.magenta}🔍 COMPREHENSIVE ORGANIZATIONAL AUDIT${colors.reset}`);
  log(`${colors.yellow}Analyzing all supporting content before milestone operations...${colors.reset}\n`);
  
  try {
    auditFileOrganization();
    auditDocumentation();
    auditConfiguration();
    auditSourceCode();
    auditScripts();
    generateRecommendations();
    
    const auditFile = saveAuditResults();
    printAuditSummary();
    
    log(`\n${colors.bright}${colors.green}🎉 COMPREHENSIVE AUDIT COMPLETED!${colors.reset}`);
    log(`Results saved to: ${auditFile}`);
    
    return auditResults.summary.criticalIssues === 0;
    
  } catch (error) {
    logError(`Audit failed: ${error.message}`);
    return false;
  }
}

// Execute if run directly
if (require.main === module) {
  runComprehensiveAudit().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = {
  runComprehensiveAudit,
  auditResults
}; 