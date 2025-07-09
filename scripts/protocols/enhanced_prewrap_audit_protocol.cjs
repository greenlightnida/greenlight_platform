#!/usr/bin/env node

/**
 * Enhanced Pre-Wrap Audit Protocol
 * Comprehensive audit with detailed session reporting and protocol analysis
 * Identifies issues with convoluted launch, wrap, and anchor protocols
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class EnhancedPreWrapAudit {
  constructor() {
    this.projectRoot = process.cwd();
    this.issues = [];
    this.warnings = [];
    this.successes = [];
    this.sessionReport = {
      timestamp: new Date().toISOString(),
      protocolAnalysis: {},
      sessionMetrics: {},
      systemHealth: {},
      recommendations: []
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '✅';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async runAudit() {
    this.log('🚀 Starting Enhanced Pre-Wrap Audit Protocol...', 'info');
    console.log('='.repeat(80));

    // Phase 1: Protocol Complexity Analysis
    await this.analyzeProtocolComplexity();

    // Phase 2: Session State Analysis
    await this.analyzeSessionState();

    // Phase 3: System Health Check
    await this.checkSystemHealth();

    // Phase 4: Protocol Dependencies Analysis
    await this.analyzeProtocolDependencies();

    // Phase 5: Performance Metrics
    await this.analyzePerformanceMetrics();

    // Phase 6: Generate Detailed Report
    await this.generateDetailedReport();

    // Phase 7: Generate Recommendations
    await this.generateRecommendations();

    // Final Summary
    this.generateSummary();
  }

  async analyzeProtocolComplexity() {
    this.log('🔍 Phase 1: Protocol Complexity Analysis', 'info');
    
    const protocols = [
      'scripts/protocols/launch_protocol.cjs',
      'scripts/protocols/end_of_chat_protocol.js',
      'scripts/protocols/pre_wrap_audit_protocol.cjs',
      'scripts/anchor_manager.cjs',
      'scripts/command_coordinator.cjs'
    ];

    this.sessionReport.protocolAnalysis = {
      complexity: {},
      dependencies: {},
      issues: []
    };

    for (const protocol of protocols) {
      const protocolPath = path.join(this.projectRoot, protocol);
      if (fs.existsSync(protocolPath)) {
        const stats = fs.statSync(protocolPath);
        const content = fs.readFileSync(protocolPath, 'utf8');
        
        const complexity = this.calculateComplexity(content);
        const dependencies = this.extractDependencies(content);
        
        this.sessionReport.protocolAnalysis.complexity[protocol] = {
          size: stats.size,
          lines: content.split('\n').length,
          functions: (content.match(/function\s+\w+/g) || []).length,
          classes: (content.match(/class\s+\w+/g) || []).length,
          complexityScore: complexity
        };

        this.sessionReport.protocolAnalysis.dependencies[protocol] = dependencies;

        // Check for complexity issues
        if (complexity > 50) {
          this.warnings.push(`${protocol} has high complexity (${complexity})`);
          this.sessionReport.protocolAnalysis.issues.push({
            protocol,
            type: 'high_complexity',
            severity: 'warning',
            value: complexity
          });
        }

        if (stats.size > 50000) {
          this.warnings.push(`${protocol} is very large (${Math.round(stats.size/1024)}KB)`);
          this.sessionReport.protocolAnalysis.issues.push({
            protocol,
            type: 'large_size',
            severity: 'warning',
            value: stats.size
          });
        }
      } else {
        this.issues.push(`${protocol} missing`);
        this.sessionReport.protocolAnalysis.issues.push({
          protocol,
          type: 'missing',
          severity: 'error'
        });
      }
    }
  }

  calculateComplexity(content) {
    let complexity = 0;
    
    // Count control flow statements
    const controlFlow = content.match(/(if|else|for|while|switch|case|catch|finally)/g) || [];
    complexity += controlFlow.length;
    
    // Count nested structures
    const nestedLevels = this.countNestedLevels(content);
    complexity += nestedLevels * 2;
    
    // Count function calls
    const functionCalls = content.match(/\w+\(/g) || [];
    complexity += functionCalls.length * 0.5;
    
    return Math.round(complexity);
  }

  countNestedLevels(content) {
    const lines = content.split('\n');
    let maxNesting = 0;
    let currentNesting = 0;
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.includes('{')) {
        currentNesting++;
        maxNesting = Math.max(maxNesting, currentNesting);
      }
      if (trimmed.includes('}')) {
        currentNesting = Math.max(0, currentNesting - 1);
      }
    }
    
    return maxNesting;
  }

  extractDependencies(content) {
    const dependencies = {
      requires: [],
      imports: [],
      execSync: [],
      fileSystem: []
    };
    
    // Extract require statements
    const requires = content.match(/require\(['"`]([^'"`]+)['"`]\)/g) || [];
    dependencies.requires = requires.map(r => r.match(/['"`]([^'"`]+)['"`]/)[1]);
    
    // Extract import statements
    const imports = content.match(/import.*from\s+['"`]([^'"`]+)['"`]/g) || [];
    dependencies.imports = imports.map(i => i.match(/['"`]([^'"`]+)['"`]/)[1]);
    
    // Extract execSync calls
    const execSync = content.match(/execSync\([^)]+\)/g) || [];
    dependencies.execSync = execSync;
    
    // Extract file system operations
    const fsOps = content.match(/fs\.(readFile|writeFile|existsSync|readdirSync)/g) || [];
    dependencies.fileSystem = fsOps;
    
    return dependencies;
  }

  async analyzeSessionState() {
    this.log('📊 Phase 2: Session State Analysis', 'info');
    
    this.sessionReport.sessionMetrics = {
      totalSessions: 0,
      activeSessions: 0,
      sessionHistory: [],
      contextPreservation: {},
      stateTransitions: []
    };

    // Analyze session files
    const sessionsDir = path.join(this.projectRoot, 'data/sessions');
    if (fs.existsSync(sessionsDir)) {
      const sessionFiles = fs.readdirSync(sessionsDir)
        .filter(f => f.endsWith('.json'))
        .sort();
      
      this.sessionReport.sessionMetrics.totalSessions = sessionFiles.length;
      
      for (const sessionFile of sessionFiles.slice(-10)) { // Last 10 sessions
        try {
          const sessionData = JSON.parse(fs.readFileSync(path.join(sessionsDir, sessionFile), 'utf8'));
          this.sessionReport.sessionMetrics.sessionHistory.push({
            file: sessionFile,
            timestamp: sessionData.timestamp || 'unknown',
            status: sessionData.status || 'unknown',
            size: JSON.stringify(sessionData).length
          });
        } catch (err) {
          this.warnings.push(`Failed to parse session file: ${sessionFile}`);
        }
      }
    }

    // Check context preservation
    const contextFiles = [
      'data/context-preservation',
      'data/system-state',
      'data/transitions'
    ];

    for (const contextDir of contextFiles) {
      const contextPath = path.join(this.projectRoot, contextDir);
      if (fs.existsSync(contextPath)) {
        const files = fs.readdirSync(contextPath).filter(f => f.endsWith('.json'));
        this.sessionReport.sessionMetrics.contextPreservation[contextDir] = {
          files: files.length,
          latest: files[files.length - 1] || null
        };
      }
    }
  }

  async checkSystemHealth() {
    this.log('🏥 Phase 3: System Health Check', 'info');
    
    this.sessionReport.systemHealth = {
      buildStatus: 'unknown',
      gitStatus: 'unknown',
      fileIntegrity: {},
      performance: {}
    };

    // Check build status
    try {
      execSync('npm run build', { stdio: 'pipe', timeout: 30000 });
      this.sessionReport.systemHealth.buildStatus = 'healthy';
      this.successes.push('Build successful');
    } catch (error) {
      this.sessionReport.systemHealth.buildStatus = 'failed';
      this.issues.push('Build failed');
    }

    // Check git status
    try {
      const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
      this.sessionReport.systemHealth.gitStatus = gitStatus.trim() ? 'dirty' : 'clean';
      if (gitStatus.trim()) {
        this.warnings.push('Git repository has uncommitted changes');
      }
    } catch (error) {
      this.sessionReport.systemHealth.gitStatus = 'error';
      this.warnings.push('Git status check failed');
    }

    // Check file integrity
    const criticalFiles = [
      'package.json',
      'scripts/anchor_manager.cjs',
      'scripts/command_coordinator.cjs',
      'LIVING_ROADMAP.md'
    ];

    for (const file of criticalFiles) {
      const filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        this.sessionReport.systemHealth.fileIntegrity[file] = {
          exists: true,
          size: stats.size,
          modified: stats.mtime
        };
      } else {
        this.sessionReport.systemHealth.fileIntegrity[file] = { exists: false };
        this.issues.push(`Critical file missing: ${file}`);
      }
    }
  }

  async analyzeProtocolDependencies() {
    this.log('🔗 Phase 4: Protocol Dependencies Analysis', 'info');
    
    const dependencyGraph = {};
    const circularDependencies = [];
    
    // Analyze protocol dependencies
    const protocols = [
      'scripts/protocols/launch_protocol.cjs',
      'scripts/protocols/end_of_chat_protocol.js',
      'scripts/protocols/pre_wrap_audit_protocol.cjs',
      'scripts/anchor_manager.cjs',
      'scripts/command_coordinator.cjs'
    ];

    for (const protocol of protocols) {
      const protocolPath = path.join(this.projectRoot, protocol);
      if (fs.existsSync(protocolPath)) {
        const content = fs.readFileSync(protocolPath, 'utf8');
        const dependencies = this.extractDependencies(content);
        
        dependencyGraph[protocol] = {
          requires: dependencies.requires,
          execSync: dependencies.execSync,
          fileSystem: dependencies.fileSystem
        };

        // Check for potential circular dependencies
        for (const req of dependencies.requires) {
          if (req.includes('protocol') && protocols.includes(req)) {
            circularDependencies.push(`${protocol} -> ${req}`);
          }
        }
      }
    }

    this.sessionReport.protocolAnalysis.dependencyGraph = dependencyGraph;
    
    if (circularDependencies.length > 0) {
      this.issues.push(`Circular dependencies detected: ${circularDependencies.join(', ')}`);
      this.sessionReport.protocolAnalysis.issues.push({
        type: 'circular_dependency',
        severity: 'error',
        dependencies: circularDependencies
      });
    }
  }

  async analyzePerformanceMetrics() {
    this.log('⚡ Phase 5: Performance Metrics', 'info');
    
    this.sessionReport.systemHealth.performance = {
      cpuUsage: 0,
      memoryUsage: 0,
      fileCount: 0,
      directoryDepth: 0
    };

    // Count files and directories
    const countFiles = (dir, depth = 0) => {
      let count = 0;
      let maxDepth = depth;
      
      try {
        const items = fs.readdirSync(dir);
        for (const item of items) {
          const itemPath = path.join(dir, item);
          const stats = fs.statSync(itemPath);
          
          if (stats.isDirectory()) {
            const subCount = countFiles(itemPath, depth + 1);
            count += subCount.count;
            maxDepth = Math.max(maxDepth, subCount.maxDepth);
          } else {
            count++;
          }
        }
      } catch (error) {
        // Skip inaccessible directories
      }
      
      return { count, maxDepth };
    };

    const fileCount = countFiles(this.projectRoot);
    this.sessionReport.systemHealth.performance.fileCount = fileCount.count;
    this.sessionReport.systemHealth.performance.directoryDepth = fileCount.maxDepth;

    // Check for performance issues
    if (fileCount.count > 10000) {
      this.warnings.push(`Large number of files (${fileCount.count}) may impact performance`);
    }

    if (fileCount.maxDepth > 10) {
      this.warnings.push(`Deep directory structure (${fileCount.maxDepth} levels) may cause issues`);
    }
  }

  async generateDetailedReport() {
    this.log('📋 Phase 6: Generating Detailed Report', 'info');
    
    const reportPath = path.join(this.projectRoot, 'data/reports');
    if (!fs.existsSync(reportPath)) {
      fs.mkdirSync(reportPath, { recursive: true });
    }

    const reportFile = `enhanced_prewrap_audit_${Date.now()}.json`;
    const reportFilePath = path.join(reportPath, reportFile);
    
    fs.writeFileSync(reportFilePath, JSON.stringify(this.sessionReport, null, 2));
    
    this.successes.push(`Detailed report generated: ${reportFile}`);
    
    // Generate summary report
    const summaryReport = {
      timestamp: this.sessionReport.timestamp,
      summary: {
        totalIssues: this.issues.length,
        totalWarnings: this.warnings.length,
        totalSuccesses: this.successes.length,
        protocolComplexity: Object.values(this.sessionReport.protocolAnalysis.complexity || {})
          .reduce((sum, p) => sum + (p.complexityScore || 0), 0),
        systemHealth: this.sessionReport.systemHealth.buildStatus
      },
      criticalIssues: this.issues.filter(issue => 
        issue.includes('missing') || issue.includes('failed') || issue.includes('circular')
      ),
      recommendations: this.sessionReport.recommendations
    };

    const summaryFile = `enhanced_prewrap_summary_${Date.now()}.json`;
    const summaryFilePath = path.join(reportPath, summaryFile);
    fs.writeFileSync(summaryFilePath, JSON.stringify(summaryReport, null, 2));
  }

  async generateRecommendations() {
    this.log('💡 Phase 7: Generating Recommendations', 'info');
    
    const recommendations = [];

    // Protocol complexity recommendations
    const highComplexityProtocols = Object.entries(this.sessionReport.protocolAnalysis.complexity || {})
      .filter(([_, data]) => data.complexityScore > 50);
    
    if (highComplexityProtocols.length > 0) {
      recommendations.push({
        type: 'protocol_refactoring',
        priority: 'high',
        description: 'Refactor high-complexity protocols',
        protocols: highComplexityProtocols.map(([name, _]) => name),
        action: 'Break down complex protocols into smaller, focused modules'
      });
    }

    // Dependency recommendations
    if (this.sessionReport.protocolAnalysis.issues.some(i => i.type === 'circular_dependency')) {
      recommendations.push({
        type: 'dependency_management',
        priority: 'critical',
        description: 'Resolve circular dependencies',
        action: 'Restructure protocol dependencies to eliminate cycles'
      });
    }

    // Performance recommendations
    if (this.sessionReport.systemHealth.performance.fileCount > 10000) {
      recommendations.push({
        type: 'performance_optimization',
        priority: 'medium',
        description: 'Optimize file structure',
        action: 'Consider consolidating or archiving unused files'
      });
    }

    // Session management recommendations
    if (this.sessionReport.sessionMetrics.totalSessions > 100) {
      recommendations.push({
        type: 'session_cleanup',
        priority: 'medium',
        description: 'Clean up old sessions',
        action: 'Implement session retention policy and cleanup procedures'
      });
    }

    this.sessionReport.recommendations = recommendations;
  }

  generateSummary() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 ENHANCED PRE-WRAP AUDIT SUMMARY');
    console.log('='.repeat(80));
    
    console.log(`\n🔍 Protocol Analysis:`);
    console.log(`   • Total Protocols Analyzed: ${Object.keys(this.sessionReport.protocolAnalysis.complexity || {}).length}`);
    console.log(`   • High Complexity Protocols: ${Object.values(this.sessionReport.protocolAnalysis.complexity || {}).filter(p => p.complexityScore > 50).length}`);
    console.log(`   • Circular Dependencies: ${this.sessionReport.protocolAnalysis.issues.filter(i => i.type === 'circular_dependency').length}`);
    
    console.log(`\n📊 Session Metrics:`);
    console.log(`   • Total Sessions: ${this.sessionReport.sessionMetrics.totalSessions}`);
    console.log(`   • Context Preservation: ${Object.keys(this.sessionReport.sessionMetrics.contextPreservation).length} systems`);
    
    console.log(`\n🏥 System Health:`);
    console.log(`   • Build Status: ${this.sessionReport.systemHealth.buildStatus}`);
    console.log(`   • Git Status: ${this.sessionReport.systemHealth.gitStatus}`);
    console.log(`   • File Count: ${this.sessionReport.systemHealth.performance.fileCount}`);
    
    console.log(`\n💡 Recommendations: ${this.sessionReport.recommendations.length}`);
    this.sessionReport.recommendations.forEach((rec, i) => {
      console.log(`   ${i + 1}. ${rec.description} (${rec.priority})`);
    });
    
    console.log(`\n📋 Issues: ${this.issues.length}`);
    this.issues.forEach(issue => console.log(`   ❌ ${issue}`));
    
    console.log(`\n⚠️ Warnings: ${this.warnings.length}`);
    this.warnings.forEach(warning => console.log(`   ⚠️ ${warning}`));
    
    console.log(`\n✅ Successes: ${this.successes.length}`);
    this.successes.forEach(success => console.log(`   ✅ ${success}`));
    
    console.log('\n' + '='.repeat(80));
    
    if (this.issues.length > 0) {
      this.log('Enhanced Pre-Wrap Audit FAILED. Critical issues found.', 'error');
      process.exit(1);
    } else {
      this.log('Enhanced Pre-Wrap Audit PASSED. System ready for wrap.', 'info');
      process.exit(0);
    }
  }
}

// CLI entry point
if (require.main === module) {
  const audit = new EnhancedPreWrapAudit();
  audit.runAudit().catch(err => {
    console.error('Enhanced Pre-Wrap Audit Protocol failed:', err);
    process.exit(1);
  });
}

module.exports = EnhancedPreWrapAudit; 