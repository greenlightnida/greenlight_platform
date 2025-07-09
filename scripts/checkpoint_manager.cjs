#!/usr/bin/env node

/**
 * Checkpoint Manager
 * 
 * PURPOSE: Provides comprehensive system-wide analysis including governance,
 * milestone tracking, and deep system audits. This is a level-up from the
 * basic anchor command for when you need full context awareness.
 * 
 * USAGE: node scripts/checkpoint_manager.cjs [--platform=all|specific] [--deep]
 * 
 * FEATURES:
 * - All anchor command functionality
 * - Environment variable governance analysis
 * - Milestone tracking and documentation
 * - Deep system audits
 * - Comprehensive reporting
 * - Context awareness building
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class CheckpointManager {
  constructor() {
    this.projectRoot = process.cwd();
    this.startTime = Date.now();
    this.results = {
      platforms: [],
      systemHealth: 'unknown',
      recommendations: [],
      executionTime: 0,
      success: false,
      governance: {},
      milestones: {},
      context: {}
    };
    
    // Parse command line arguments
    this.args = process.argv.slice(2);
    this.deepMode = this.args.includes('--deep');
    this.includeGovernance = !this.args.includes('--no-governance');
    this.includeMilestones = !this.args.includes('--no-milestones');
  }

  async executeCheckpoint() {
    console.log('🏁 Checkpoint Manager - Comprehensive System Analysis');
    console.log('====================================================');
    console.log(`Timestamp: ${new Date().toISOString()}`);
    if (this.deepMode) {
      console.log('🔍 Deep Mode: Extended analysis enabled');
    }
    console.log('');

    // Add global timeout to prevent hanging
    const globalTimeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Checkpoint timeout after 60 seconds')), 60000);
    });

    try {
      const checkpointPromise = this.executeCheckpointPhases();
      await Promise.race([checkpointPromise, globalTimeout]);
      
      this.results.success = true;
      this.results.executionTime = Date.now() - this.startTime;
      
      return this.results;
      
    } catch (error) {
      console.error('❌ Checkpoint failed:', error.message);
      this.results.success = false;
      this.results.executionTime = Date.now() - this.startTime;
      return this.results;
    }
  }

  async executeCheckpointPhases() {
    // Phase 1: Run basic anchor analysis (lightweight version)
    console.log('🔗 Phase 1: Running Anchor Analysis...');
    try {
      const AnchorManager = require('./anchor_manager.cjs');
      const anchorManager = new AnchorManager();
      anchorManager.quickMode = true; // Use quick mode to avoid conflicts
      anchorManager.coreMode = false;
      
      const anchorResults = await anchorManager.executeAnchorCommand();
      this.results = { ...this.results, ...anchorResults };
    } catch (error) {
      console.log(`  ⚠️  Anchor analysis failed: ${error.message}`);
      // Continue with other phases even if anchor fails
    }
    
    // Phase 2: Environment Variable Governance (if enabled)
    if (this.includeGovernance) {
      console.log('🔧 Phase 2: Environment Variable Governance Analysis...');
      await this.performGovernanceAnalysis();
    } else {
      console.log('⏭️  Phase 2: Environment Variable Governance Analysis (skipped)');
    }
    
    // Phase 3: Milestone Tracking (if enabled)
    if (this.includeMilestones) {
      console.log('📝 Phase 3: Milestone Tracking and Documentation...');
      await this.performMilestoneAnalysis();
    } else {
      console.log('⏭️  Phase 3: Milestone Tracking and Documentation (skipped)');
    }
    
    // Phase 4: Context Awareness Building
    console.log('🧠 Phase 4: Context Awareness Building...');
    await this.buildContextAwareness();
    
    // Phase 5: Deep System Audit (if deep mode)
    if (this.deepMode) {
      console.log('🔍 Phase 5: Deep System Audit...');
      await this.performDeepAudit();
    } else {
      console.log('⏭️  Phase 5: Deep System Audit (skipped - use --deep for extended analysis)');
    }
    
    // Phase 6: Display comprehensive results
    await this.displayComprehensiveResults();
    
    // Phase 7: Write checkpoint logs
    await this.writeCheckpointLogs();
  }

  async performGovernanceAnalysis() {
    try {
      const EnvironmentGovernanceProtocol = require('./protocols/environment_variable_governance.cjs');
      const envProtocol = new EnvironmentGovernanceProtocol();
      
      // Stop monitoring to prevent infinite loop
      await envProtocol.stopMonitoring();
      
      // Disable monitoring in config
      envProtocol.config.monitoring = false;
      
      // Perform scan with timeout
      const scanPromise = envProtocol.performScan();
      const scanTimeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Governance scan timeout after 5 seconds')), 5000);
      });
      
      await Promise.race([scanPromise, scanTimeout]);
      
      // Get statistics
      const stats = envProtocol.getStatus();
      this.results.governance = {
        status: stats.status,
        totalScans: stats.statistics.totalScans,
        totalErrors: stats.statistics.totalErrors,
        totalFixes: stats.statistics.totalFixes,
        totalAlerts: stats.statistics.totalAlerts,
        lastScanDuration: stats.statistics.lastScanDuration
      };
      
      // Generate and save report
      const reportPath = await envProtocol.saveReport();
      if (reportPath) {
        this.results.governance.reportPath = reportPath;
      }
      
      console.log(`  ✅ Environment governance analysis completed`);
      console.log(`    • Total scans: ${stats.statistics.totalScans}`);
      console.log(`    • Total errors: ${stats.statistics.totalErrors}`);
      console.log(`    • Total fixes: ${stats.statistics.totalFixes}`);
      console.log(`    • Total alerts: ${stats.statistics.totalAlerts}`);
      
    } catch (error) {
      console.log(`  ⚠️  Environment governance analysis failed: ${error.message}`);
      this.results.governance = {
        status: 'error',
        error: error.message
      };
    }
  }

  async performMilestoneAnalysis() {
    try {
      const MilestoneTracker = require('./milestone_tracker.cjs');
      const tracker = new MilestoneTracker();
      
      // Analyze current timeline
      const analysis = await tracker.analyzeTimeline();
      
      this.results.milestones = {
        analysis,
        totalMilestones: tracker.timeline.milestones.length,
        completionRate: analysis.completionRate,
        governanceMaturity: analysis.governanceMaturity
      };
      
      console.log(`  ✅ Milestone analysis completed`);
      console.log(`    • Total milestones: ${tracker.timeline.milestones.length}`);
      console.log(`    • Completion rate: ${analysis.completionRate}%`);
      console.log(`    • Governance maturity: ${analysis.governanceMaturity}`);
      
    } catch (error) {
      console.log(`  ⚠️  Milestone analysis failed: ${error.message}`);
      this.results.milestones = {
        status: 'error',
        error: error.message
      };
    }
  }

  async buildContextAwareness() {
    try {
      // Build context from recent activity
      const recentActivity = await this.getRecentActivity();
      const systemState = await this.getSystemState();
      const roadmapProgress = await this.getRoadmapProgress();
      
      this.results.context = {
        recentActivity,
        systemState,
        roadmapProgress,
        timestamp: new Date().toISOString()
      };
      
      console.log(`  ✅ Context awareness built`);
      console.log(`    • Recent activities: ${recentActivity.length}`);
      console.log(`    • System state captured`);
      console.log(`    • Roadmap progress: ${roadmapProgress.overall}%`);
      
    } catch (error) {
      console.log(`  ⚠️  Context awareness building failed: ${error.message}`);
      this.results.context = {
        status: 'error',
        error: error.message
      };
    }
  }

  async performDeepAudit() {
    try {
      // Perform deep system analysis
      const deepAudit = {
        fileSystem: await this.auditFileSystem(),
        dependencies: await this.auditDependencies(),
        security: await this.auditSecurity(),
        performance: await this.auditPerformance()
      };
      
      this.results.deepAudit = deepAudit;
      
      console.log(`  ✅ Deep audit completed`);
      console.log(`    • File system: ${deepAudit.fileSystem.issues} issues`);
      console.log(`    • Dependencies: ${deepAudit.dependencies.issues} issues`);
      console.log(`    • Security: ${deepAudit.security.issues} issues`);
      console.log(`    • Performance: ${deepAudit.performance.issues} issues`);
      
    } catch (error) {
      console.log(`  ⚠️  Deep audit failed: ${error.message}`);
      this.results.deepAudit = {
        status: 'error',
        error: error.message
      };
    }
  }

  async getRecentActivity() {
    const activities = [];
    
    try {
      // Check recent session files
      const sessionsDir = path.join(this.projectRoot, 'data', 'sessions');
      if (fs.existsSync(sessionsDir)) {
        const sessionFiles = fs.readdirSync(sessionsDir)
          .filter(file => file.endsWith('.json'))
          .sort()
          .slice(-5); // Last 5 sessions
        
        for (const file of sessionFiles) {
          try {
            const sessionData = JSON.parse(fs.readFileSync(path.join(sessionsDir, file), 'utf8'));
            activities.push({
              timestamp: sessionData.timestamp || file.replace('.json', ''),
              description: sessionData.summary || 'Session activity recorded'
            });
          } catch (error) {
            // Skip invalid session files
          }
        }
      }
      
      // Check recent git commits
      try {
        const gitLog = execSync('git log --oneline -5', { 
          cwd: this.projectRoot, 
          encoding: 'utf8',
          stdio: 'pipe'
        });
        
        const commits = gitLog.trim().split('\n');
        commits.forEach(commit => {
          if (commit) {
            const [hash, ...messageParts] = commit.split(' ');
            const message = messageParts.join(' ');
            activities.push({
              timestamp: 'Recent',
              description: `Git: ${message}`
            });
          }
        });
      } catch (error) {
        // Git not available or no commits
      }
      
    } catch (error) {
      console.log('  ⚠️  Could not retrieve recent activity');
    }
    
    return activities.slice(-10); // Return last 10 activities
  }

  async getSystemState() {
    return {
      timestamp: new Date().toISOString(),
      platforms: this.results.platforms?.length || 0,
      systemHealth: this.results.systemHealth || 'unknown',
      governanceStatus: this.results.governance?.status || 'unknown',
      milestoneCount: this.results.milestones?.totalMilestones || 0
    };
  }

  async getRoadmapProgress() {
    const totalPlatforms = this.results.platforms?.length || 1;
    const healthyPlatforms = this.results.platforms?.filter(p => p.status === 'analyzed').length || 0;
    const platformsWithHolon = this.results.platforms?.filter(p => p.analysis?.holonGovernance).length || 0;
    
    const overallProgress = Math.round(
      ((healthyPlatforms / totalPlatforms) * 0.6 + 
       (platformsWithHolon / totalPlatforms) * 0.4) * 100
    );
    
    return {
      overall: overallProgress,
      platformMaturity: Math.round((healthyPlatforms / totalPlatforms) * 100),
      governanceCompliance: Math.round((platformsWithHolon / totalPlatforms) * 100)
    };
  }

  async auditFileSystem() {
    const issues = [];
    
    try {
      // Check for large files
      const largeFiles = this.findLargeFiles(this.projectRoot, 10 * 1024 * 1024); // 10MB
      if (largeFiles.length > 0) {
        issues.push({
          type: 'large_files',
          count: largeFiles.length,
          files: largeFiles.slice(0, 5) // Show first 5
        });
      }
      
      // Check for temporary files
      const tempFiles = this.findTempFiles(this.projectRoot);
      if (tempFiles.length > 0) {
        issues.push({
          type: 'temp_files',
          count: tempFiles.length,
          files: tempFiles.slice(0, 5)
        });
      }
      
    } catch (error) {
      issues.push({
        type: 'error',
        message: error.message
      });
    }
    
    return { issues: issues.length, details: issues };
  }

  async auditDependencies() {
    const issues = [];
    
    try {
      // Check for outdated packages
      const npmOutdated = execSync('npm outdated --json', { 
        cwd: this.projectRoot, 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      const outdated = JSON.parse(npmOutdated);
      if (Object.keys(outdated).length > 0) {
        issues.push({
          type: 'outdated_packages',
          count: Object.keys(outdated).length,
          packages: Object.keys(outdated).slice(0, 5)
        });
      }
      
    } catch (error) {
      // No outdated packages
    }
    
    return { issues: issues.length, details: issues };
  }

  async auditSecurity() {
    const issues = [];
    
    try {
      // Check for security vulnerabilities
      const npmAudit = execSync('npm audit --json', { 
        cwd: this.projectRoot, 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      const audit = JSON.parse(npmAudit);
      if (audit.vulnerabilities) {
        const vulnCount = Object.keys(audit.vulnerabilities).length;
        if (vulnCount > 0) {
          issues.push({
            type: 'security_vulnerabilities',
            count: vulnCount,
            severity: 'high'
          });
        }
      }
      
    } catch (error) {
      // No vulnerabilities or npm not available
    }
    
    return { issues: issues.length, details: issues };
  }

  async auditPerformance() {
    const issues = [];
    
    try {
      // Check for performance issues
      const nodeModulesSize = this.getDirectorySize(path.join(this.projectRoot, 'node_modules'));
      if (nodeModulesSize > 500 * 1024 * 1024) { // 500MB
        issues.push({
          type: 'large_node_modules',
          size: Math.round(nodeModulesSize / (1024 * 1024)) + 'MB'
        });
      }
      
    } catch (error) {
      issues.push({
        type: 'error',
        message: error.message
      });
    }
    
    return { issues: issues.length, details: issues };
  }

  findLargeFiles(dir, maxSize) {
    const largeFiles = [];
    
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        if (item.startsWith('.') || item === 'node_modules') continue;
        
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isFile() && stat.size > maxSize) {
          largeFiles.push({
            path: fullPath.replace(this.projectRoot, ''),
            size: Math.round(stat.size / (1024 * 1024)) + 'MB'
          });
        } else if (stat.isDirectory()) {
          largeFiles.push(...this.findLargeFiles(fullPath, maxSize));
        }
      }
    } catch (error) {
      // Skip inaccessible directories
    }
    
    return largeFiles;
  }

  findTempFiles(dir) {
    const tempFiles = [];
    const tempPatterns = ['.tmp', '.temp', '.cache', '.log'];
    
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        if (item.startsWith('.') || item === 'node_modules') continue;
        
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isFile() && tempPatterns.some(pattern => item.includes(pattern))) {
          tempFiles.push({
            path: fullPath.replace(this.projectRoot, ''),
            size: Math.round(stat.size / 1024) + 'KB'
          });
        } else if (stat.isDirectory()) {
          tempFiles.push(...this.findTempFiles(fullPath));
        }
      }
    } catch (error) {
      // Skip inaccessible directories
    }
    
    return tempFiles;
  }

  getDirectorySize(dir) {
    let size = 0;
    
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isFile()) {
          size += stat.size;
        } else if (stat.isDirectory()) {
          size += this.getDirectorySize(fullPath);
        }
      }
    } catch (error) {
      // Skip inaccessible directories
    }
    
    return size;
  }

  async displayComprehensiveResults() {
    console.log('');
    console.log('📋 Checkpoint Results Summary');
    console.log('=============================');
    
    // Platform summary
    console.log('🏗️  PLATFORMS:');
    this.results.platforms?.forEach(platform => {
      console.log(`  ✅ ${platform.name} (${platform.type})`);
      if (platform.analysis) {
        console.log(`    📊 Features: ${platform.analysis.features}, Components: ${platform.analysis.components}, Services: ${platform.analysis.services}`);
        if (platform.analysis.holonGovernance) {
          console.log(`    🏛️  Holon Governance: ${platform.analysis.holonGovernance}`);
        }
      }
    });
    
    // System health
    console.log('');
    console.log('🏥 SYSTEM HEALTH:');
    console.log(`  Overall Status: ${this.results.systemHealth}`);
    console.log(`  Execution Time: ${this.results.executionTime}ms`);
    
    // Governance summary
    if (this.results.governance) {
      console.log('');
      console.log('🔧 GOVERNANCE:');
      console.log(`  Status: ${this.results.governance.status}`);
      if (this.results.governance.totalScans !== undefined) {
        console.log(`  Total Scans: ${this.results.governance.totalScans}`);
        console.log(`  Total Errors: ${this.results.governance.totalErrors}`);
        console.log(`  Total Fixes: ${this.results.governance.totalFixes}`);
      }
    }
    
    // Milestones summary
    if (this.results.milestones) {
      console.log('');
      console.log('📝 MILESTONES:');
      console.log(`  Total Milestones: ${this.results.milestones.totalMilestones}`);
      console.log(`  Completion Rate: ${this.results.milestones.completionRate}%`);
      console.log(`  Governance Maturity: ${this.results.milestones.governanceMaturity}`);
    }
    
    // Context summary
    if (this.results.context) {
      console.log('');
      console.log('🧠 CONTEXT:');
      console.log(`  Recent Activities: ${this.results.context.recentActivity?.length || 0}`);
      console.log(`  Roadmap Progress: ${this.results.context.roadmapProgress?.overall || 0}%`);
    }
    
    // Deep audit summary
    if (this.results.deepAudit) {
      console.log('');
      console.log('🔍 DEEP AUDIT:');
      const totalIssues = (
        (this.results.deepAudit.fileSystem?.issues || 0) +
        (this.results.deepAudit.dependencies?.issues || 0) +
        (this.results.deepAudit.security?.issues || 0) +
        (this.results.deepAudit.performance?.issues || 0)
      );
      console.log(`  Total Issues Found: ${totalIssues}`);
    }
    
    console.log('');
    console.log('✅ Checkpoint completed successfully!');
  }

  async writeCheckpointLogs() {
    try {
      // Write checkpoint session
      const sessionsDir = path.join(this.projectRoot, 'data', 'sessions');
      if (!fs.existsSync(sessionsDir)) fs.mkdirSync(sessionsDir, { recursive: true });
      
      const sessionFile = path.join(sessionsDir, `checkpoint-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
      const sessionData = {
        timestamp: new Date().toISOString(),
        summary: 'Comprehensive checkpoint analysis',
        results: this.results,
        deepMode: this.deepMode,
        includeGovernance: this.includeGovernance,
        includeMilestones: this.includeMilestones
      };
      
      fs.writeFileSync(sessionFile, JSON.stringify(sessionData, null, 2));
      
      // Write checkpoint report
      const reportsDir = path.join(this.projectRoot, 'data', 'reports');
      if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
      
      const reportFile = path.join(reportsDir, `checkpoint-report-${Date.now()}.json`);
      fs.writeFileSync(reportFile, JSON.stringify(this.results, null, 2));
      
      console.log(`📄 Checkpoint logs saved: ${sessionFile}`);
      console.log(`📄 Checkpoint report saved: ${reportFile}`);
      
    } catch (error) {
      console.error('Failed to write checkpoint logs:', error.message);
    }
  }
}

// Run the checkpoint manager
if (require.main === module) {
  const checkpointManager = new CheckpointManager();
  checkpointManager.executeCheckpoint().catch(error => {
    console.error('Checkpoint failed:', error);
    process.exit(1);
  });
}

module.exports = CheckpointManager; 