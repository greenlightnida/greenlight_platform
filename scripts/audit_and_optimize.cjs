#!/usr/bin/env node

/**
 * Comprehensive System Audit and Optimization Script
 * 
 * PURPOSE: Audit the entire system to identify build issues, missing files,
 * structural problems, and provide a comprehensive report for fixing.
 * 
 * USAGE: node scripts/audit_and_optimize.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SystemAuditor {
  constructor() {
    this.projectRoot = process.cwd();
    this.auditResults = {
      timestamp: new Date().toISOString(),
      buildIssues: [],
      missingFiles: [],
      structuralIssues: [],
      duplicateFiles: [],
      recommendations: []
    };
  }

  async execute() {
    console.log('🔍 Comprehensive System Audit Initiated');
    console.log('========================================');
    console.log(`Timestamp: ${this.auditResults.timestamp}`);
    console.log('');

    try {
      // Phase 1: Build Issues Analysis
      await this.analyzeBuildIssues();
      
      // Phase 2: File Structure Audit
      await this.auditFileStructure();
      
      // Phase 3: Missing Files Detection
      await this.detectMissingFiles();
      
      // Phase 4: Duplicate Detection
      await this.detectDuplicates();
      
      // Phase 5: Structural Issues Analysis
      await this.analyzeStructuralIssues();
      
      // Phase 6: Generate Audit Report
      await this.generateAuditReport();
      
      console.log('');
      console.log('✅ System Audit Complete');
      console.log(`📊 Found ${this.auditResults.buildIssues.length} build issues`);
      console.log(`📁 Found ${this.auditResults.missingFiles.length} missing files`);
      console.log(`🏗️ Found ${this.auditResults.structuralIssues.length} structural issues`);
      console.log(`🔄 Found ${this.auditResults.duplicateFiles.length} duplicate files`);
      console.log(`💡 Generated ${this.auditResults.recommendations.length} recommendations`);
      
    } catch (error) {
      console.error('❌ System Audit Failed:', error.message);
      this.logError(error);
      process.exit(1);
    }
  }

  async analyzeBuildIssues() {
    console.log('🔧 Phase 1: Analyzing Build Issues');
    
    try {
      // Run TypeScript check
      const tsCheck = execSync('npx tsc --noEmit', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      console.log('✅ TypeScript compilation successful');
    } catch (error) {
      const output = error.stdout || error.stderr || '';
      const lines = output.split('\n').filter(line => line.trim());
      
      this.auditResults.buildIssues = lines.map(line => ({
        type: 'typescript',
        message: line,
        severity: this.categorizeError(line)
      }));
      
      console.log(`❌ Found ${this.auditResults.buildIssues.length} TypeScript errors`);
    }
  }

  async auditFileStructure() {
    console.log('📁 Phase 2: Auditing File Structure');
    
    const criticalDirectories = [
      'src',
      'scripts',
      'config',
      'docs',
      'greenlight-wiki'
    ];

    const criticalFiles = [
      'package.json',
      'tsconfig.json',
      'README.md',
      'LIVING_ROADMAP.md',
      'ROADMAP.md'
    ];

    // Check critical directories
    for (const dir of criticalDirectories) {
      const dirPath = path.join(this.projectRoot, dir);
      if (!fs.existsSync(dirPath)) {
        this.auditResults.structuralIssues.push({
          type: 'missing_directory',
          path: dir,
          severity: 'critical',
          description: `Critical directory ${dir} is missing`
        });
      }
    }

    // Check critical files
    for (const file of criticalFiles) {
      const filePath = path.join(this.projectRoot, file);
      if (!fs.existsSync(filePath)) {
        this.auditResults.missingFiles.push({
          type: 'critical_file',
          path: file,
          severity: 'critical',
          description: `Critical file ${file} is missing`
        });
      }
    }

    console.log(`✅ File structure audit complete`);
  }

  async detectMissingFiles() {
    console.log('🔍 Phase 3: Detecting Missing Files');
    
    // Check for missing configuration files
    const configFiles = [
      'config/google-workspace/oauth-config.ts',
      'src/lib/supabase.ts',
      'src/services/openRouterService.ts'
    ];

    for (const configFile of configFiles) {
      const filePath = path.join(this.projectRoot, configFile);
      if (!fs.existsSync(filePath)) {
        this.auditResults.missingFiles.push({
          type: 'config_file',
          path: configFile,
          severity: 'high',
          description: `Configuration file ${configFile} is missing`
        });
      }
    }

    // Check for missing utility files
    const utilityFiles = [
      'src/utils/common/validation.ts',
      'src/utils/common/constants.ts',
      'src/api/detectJerseyNumbers.ts'
    ];

    for (const utilFile of utilityFiles) {
      const filePath = path.join(this.projectRoot, utilFile);
      if (!fs.existsSync(filePath)) {
        this.auditResults.missingFiles.push({
          type: 'utility_file',
          path: utilFile,
          severity: 'medium',
          description: `Utility file ${utilFile} is missing`
        });
      }
    }

    console.log(`✅ Missing files detection complete`);
  }

  async detectDuplicates() {
    console.log('🔄 Phase 4: Detecting Duplicates');
    
    // Check for potential duplicate directories
    const potentialDuplicates = [
      { name: 'top-bins', path: 'src/legacy/top-bins' },
      { name: 'Top_Bins', path: 'Top_Bins' }
    ];

    for (const duplicate of potentialDuplicates) {
      const dirPath = path.join(this.projectRoot, duplicate.path);
      if (fs.existsSync(dirPath)) {
        this.auditResults.duplicateFiles.push({
          type: 'directory',
          path: duplicate.path,
          severity: 'medium',
          description: `Potential duplicate directory: ${duplicate.name}`
        });
      }
    }

    // Check for actual duplicate anchor manager scripts (not different implementations)
    const anchorScripts = [
      'scripts/anchor_manager.cjs',
      'src/services/anchorCommandService.ts'
    ];

    // These are different implementations serving different purposes:
    // - anchor_manager.cjs: System-wide platform analysis tool
    // - anchorCommandService.ts: Frontend session spot check service
    // No duplicates detected - both serve distinct purposes

    console.log(`✅ Duplicate detection complete`);
  }

  async analyzeStructuralIssues() {
    console.log('🏗️ Phase 5: Analyzing Structural Issues');
    
    // Check for large files that need refactoring
    const largeFiles = this.findLargeFiles();
    for (const file of largeFiles) {
      this.auditResults.structuralIssues.push({
        type: 'large_file',
        path: file.path,
        severity: 'medium',
        description: `Large file (${file.lines} lines) may need refactoring`,
        lines: file.lines
      });
    }

    // Check for files with many TODO/FIXME comments
    const todoFiles = this.findTodoFiles();
    for (const file of todoFiles) {
      this.auditResults.structuralIssues.push({
        type: 'todo_file',
        path: file.path,
        severity: 'low',
        description: `File contains ${file.count} TODO/FIXME comments`,
        count: file.count
      });
    }

    console.log(`✅ Structural analysis complete`);
  }

  findLargeFiles() {
    const largeFiles = [];
    const srcPath = path.join(this.projectRoot, 'src');
    
    if (fs.existsSync(srcPath)) {
      this.walkDirectory(srcPath, (filePath) => {
        if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
          const content = fs.readFileSync(filePath, 'utf8');
          const lines = content.split('\n').length;
          
          if (lines > 500) {
            largeFiles.push({
              path: path.relative(this.projectRoot, filePath),
              lines: lines
            });
          }
        }
      });
    }
    
    return largeFiles;
  }

  findTodoFiles() {
    const todoFiles = [];
    const srcPath = path.join(this.projectRoot, 'src');
    
    if (fs.existsSync(srcPath)) {
      this.walkDirectory(srcPath, (filePath) => {
        if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
          const content = fs.readFileSync(filePath, 'utf8');
          const todoMatches = content.match(/TODO|FIXME/g);
          
          if (todoMatches && todoMatches.length > 5) {
            todoFiles.push({
              path: path.relative(this.projectRoot, filePath),
              count: todoMatches.length
            });
          }
        }
      });
    }
    
    return todoFiles;
  }

  walkDirectory(dir, callback) {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          this.walkDirectory(filePath, callback);
        } else {
          callback(filePath);
        }
      }
    }
  }

  categorizeError(errorLine) {
    if (errorLine.includes('error TS')) {
      return 'error';
    } else if (errorLine.includes('warning')) {
      return 'warning';
    } else {
      return 'info';
    }
  }

  async generateAuditReport() {
    console.log('📄 Phase 6: Generating Audit Report');
    
    // Generate recommendations based on findings
    this.generateRecommendations();
    
    const report = {
      ...this.auditResults,
      summary: {
        totalIssues: this.auditResults.buildIssues.length + 
                    this.auditResults.missingFiles.length + 
                    this.auditResults.structuralIssues.length + 
                    this.auditResults.duplicateFiles.length,
        criticalIssues: this.countCriticalIssues(),
        highPriorityIssues: this.countHighPriorityIssues(),
        mediumPriorityIssues: this.countMediumPriorityIssues(),
        lowPriorityIssues: this.countLowPriorityIssues()
      }
    };

    const reportPath = path.join(this.projectRoot, 'SYSTEM_AUDIT_REPORT.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`✅ Audit report generated: ${reportPath}`);
    
    // Print summary
    console.log('');
    console.log('📊 AUDIT SUMMARY');
    console.log('================');
    console.log(`Total Issues: ${report.summary.totalIssues}`);
    console.log(`Critical: ${report.summary.criticalIssues}`);
    console.log(`High Priority: ${report.summary.highPriorityIssues}`);
    console.log(`Medium Priority: ${report.summary.mediumPriorityIssues}`);
    console.log(`Low Priority: ${report.summary.lowPriorityIssues}`);
    console.log('');
    
    // Print top recommendations
    console.log('💡 TOP RECOMMENDATIONS');
    console.log('======================');
    this.auditResults.recommendations.slice(0, 5).forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
  }

  generateRecommendations() {
    const recommendations = [];

    // Build issues recommendations
    if (this.auditResults.buildIssues.length > 0) {
      recommendations.push('Fix TypeScript compilation errors - highest priority');
      recommendations.push('Install missing dependencies (@types/uuid, recharts, @supabase/supabase-js)');
      recommendations.push('Fix type annotations and null safety issues');
    }

    // Missing files recommendations
    if (this.auditResults.missingFiles.length > 0) {
      recommendations.push('Create missing configuration files (oauth-config.ts, supabase.ts)');
      recommendations.push('Implement missing utility functions and constants');
      recommendations.push('Create missing API endpoints and services');
    }

    // Structural issues recommendations
    if (this.auditResults.structuralIssues.length > 0) {
      recommendations.push('Refactor large files (>500 lines) into smaller modules');
      recommendations.push('Address TODO/FIXME comments with proper implementations');
      recommendations.push('Improve code organization and modularity');
    }

    // Duplicate issues recommendations
    if (this.auditResults.duplicateFiles.length > 0) {
      recommendations.push('Consolidate duplicate directories (top-bins vs Top_Bins)');
      recommendations.push('Remove duplicate anchor manager scripts');
      recommendations.push('Establish clear naming conventions');
    }

    // General recommendations
    recommendations.push('Implement comprehensive error handling');
    recommendations.push('Add proper TypeScript types throughout the codebase');
    recommendations.push('Create automated testing for critical components');
    recommendations.push('Establish code quality standards and linting rules');

    this.auditResults.recommendations = recommendations;
  }

  countCriticalIssues() {
    return this.auditResults.buildIssues.filter(issue => issue.severity === 'critical').length +
           this.auditResults.missingFiles.filter(file => file.severity === 'critical').length +
           this.auditResults.structuralIssues.filter(issue => issue.severity === 'critical').length;
  }

  countHighPriorityIssues() {
    return this.auditResults.buildIssues.filter(issue => issue.severity === 'high').length +
           this.auditResults.missingFiles.filter(file => file.severity === 'high').length +
           this.auditResults.structuralIssues.filter(issue => issue.severity === 'high').length;
  }

  countMediumPriorityIssues() {
    return this.auditResults.buildIssues.filter(issue => issue.severity === 'medium').length +
           this.auditResults.missingFiles.filter(file => file.severity === 'medium').length +
           this.auditResults.structuralIssues.filter(issue => issue.severity === 'medium').length +
           this.auditResults.duplicateFiles.filter(file => file.severity === 'medium').length;
  }

  countLowPriorityIssues() {
    return this.auditResults.buildIssues.filter(issue => issue.severity === 'low').length +
           this.auditResults.missingFiles.filter(file => file.severity === 'low').length +
           this.auditResults.structuralIssues.filter(issue => issue.severity === 'low').length +
           this.auditResults.duplicateFiles.filter(file => file.severity === 'low').length;
  }

  logError(error) {
    const errorLog = {
      timestamp: new Date().toISOString(),
      script: 'audit_and_optimize',
      error: {
        message: error.message,
        stack: error.stack
      }
    };

    const errorPath = path.join(this.projectRoot, 'AUDIT_ERROR.json');
    fs.writeFileSync(errorPath, JSON.stringify(errorLog, null, 2));
    console.error(`📁 Error logged to: ${errorPath}`);
  }
}

// Run the system auditor
if (require.main === module) {
  const auditor = new SystemAuditor();
  auditor.execute().catch(error => {
    console.error('System audit failed:', error);
    process.exit(1);
  });
}

module.exports = SystemAuditor; 