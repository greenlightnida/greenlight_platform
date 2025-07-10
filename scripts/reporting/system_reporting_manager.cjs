#!/usr/bin/env node

/**
 * System Reporting Manager
 * 
 * PURPOSE: Centralized reporting hub for all commands
 * - Generate comprehensive command reports
 * - Real-time system health monitoring
 * - Automated report aggregation
 * - Coverage metrics and analytics
 * - Performance tracking and optimization
 * 
 * USAGE: Integrated with command_coordinator.cjs
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SystemReportingManager {
  constructor() {
    this.projectRoot = process.cwd();
    this.reportsDir = path.join(this.projectRoot, 'data/reports');
    this.centralHub = path.join(this.projectRoot, 'data/system-hub');
    this.ensureDirectories();
  }

  ensureDirectories() {
    const dirs = [this.reportsDir, this.centralHub];
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  async getSystemHealth() {
    try {
      // Check build status
      const buildStatus = await this.getBuildStatus();
      
      // Check git status
      const gitStatus = await this.getGitStatus();
      
      // Check test coverage
      const testCoverage = await this.getTestCoverage();
      
      // Check performance metrics
      const performance = await this.getPerformanceMetrics();
      
      // Calculate health score
      const healthScore = this.calculateHealthScore({
        buildStatus,
        gitStatus,
        testCoverage,
        performance
      });
      
      return {
        score: healthScore,
        status: healthScore >= 80 ? 'healthy' : healthScore >= 60 ? 'warning' : 'critical',
        timestamp: new Date().toISOString(),
        metrics: {
          buildStatus,
          gitStatus,
          testCoverage,
          performance
        }
      };
    } catch (error) {
      return {
        score: 0,
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error.message
      };
    }
  }

  async getBuildStatus() {
    try {
      // Check frontend build
      const frontendBuild = await this.checkFrontendBuild();
      
      // Check backend build
      const backendBuild = await this.checkBackendBuild();
      
      return {
        frontend: frontendBuild,
        backend: backendBuild,
        overall: frontendBuild.success && backendBuild.success ? 'success' : 'failed'
      };
    } catch (error) {
      return {
        frontend: { success: false, error: error.message },
        backend: { success: false, error: error.message },
        overall: 'error'
      };
    }
  }

  async checkFrontendBuild() {
    try {
      execSync('cd frontend && npm run build', { stdio: 'pipe' });
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async checkBackendBuild() {
    try {
      execSync('cd backend && npx tsc --noEmit', { stdio: 'pipe' });
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getGitStatus() {
    try {
      const status = execSync('git status --porcelain', { 
        encoding: 'utf8', 
        cwd: this.projectRoot 
      });
      
      const lines = status.split('\n').filter(line => line.trim());
      
      return {
        hasChanges: lines.length > 0,
        modifiedFiles: lines.filter(line => line.startsWith('M')).length,
        untrackedFiles: lines.filter(line => line.startsWith('??')).length,
        deletedFiles: lines.filter(line => line.startsWith('D')).length,
        addedFiles: lines.filter(line => line.startsWith('A')).length,
        totalChanges: lines.length
      };
    } catch (error) {
      return {
        hasChanges: false,
        modifiedFiles: 0,
        untrackedFiles: 0,
        deletedFiles: 0,
        addedFiles: 0,
        totalChanges: 0,
        error: error.message
      };
    }
  }

  async getTestCoverage() {
    try {
      // Check if test files exist
      const testFiles = this.findTestFiles();
      
      // Check if tests pass
      const testResults = await this.runTests();
      
      return {
        testFiles: testFiles.length,
        testResults,
        coverage: testFiles.length > 0 ? 'available' : 'none'
      };
    } catch (error) {
      return {
        testFiles: 0,
        testResults: { success: false, error: error.message },
        coverage: 'error'
      };
    }
  }

  findTestFiles() {
    const testPatterns = ['**/*.test.js', '**/*.test.ts', '**/*.spec.js', '**/*.spec.ts'];
    const testFiles = [];
    
    testPatterns.forEach(pattern => {
      try {
        const files = execSync(`find . -name "${pattern}" -not -path "./node_modules/*"`, {
          encoding: 'utf8',
          cwd: this.projectRoot
        });
        
        if (files.trim()) {
          testFiles.push(...files.split('\n').filter(f => f.trim()));
        }
      } catch (error) {
        // Pattern not found, continue
      }
    });
    
    return testFiles;
  }

  async runTests() {
    try {
      execSync('npm test', { stdio: 'pipe', cwd: this.projectRoot });
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getPerformanceMetrics() {
    try {
      const memoryUsage = process.memoryUsage();
      const cpuUsage = process.cpuUsage();
      
      return {
        memory: {
          rss: memoryUsage.rss,
          heapUsed: memoryUsage.heapUsed,
          heapTotal: memoryUsage.heapTotal,
          external: memoryUsage.external
        },
        cpu: {
          user: cpuUsage.user,
          system: cpuUsage.system
        },
        uptime: process.uptime()
      };
    } catch (error) {
      return {
        memory: {},
        cpu: {},
        uptime: 0,
        error: error.message
      };
    }
  }

  calculateHealthScore(metrics) {
    let score = 100;
    
    // Build status impact
    if (metrics.buildStatus.overall === 'failed') {
      score -= 30;
    } else if (metrics.buildStatus.overall === 'error') {
      score -= 40;
    }
    
    // Git status impact
    if (metrics.gitStatus.hasChanges) {
      if (metrics.gitStatus.totalChanges > 50) {
        score -= 20;
      } else if (metrics.gitStatus.totalChanges > 20) {
        score -= 10;
      }
    }
    
    // Test coverage impact
    if (metrics.testCoverage.coverage === 'none') {
      score -= 15;
    } else if (metrics.testCoverage.testResults.success === false) {
      score -= 20;
    }
    
    return Math.max(0, score);
  }

  async getCoverageMetrics() {
    const commandCoverage = {
      anchor: {
        gitManagement: true,
        systemReporting: true,
        errorHandling: true,
        performanceMonitoring: true,
        sessionTracking: true
      },
      launch: {
        gitManagement: true,
        systemReporting: true,
        errorHandling: true,
        performanceMonitoring: true,
        sessionTracking: true
      },
      wrap: {
        gitManagement: false,
        systemReporting: true,
        errorHandling: true,
        performanceMonitoring: false,
        sessionTracking: true
      },
      audit: {
        gitManagement: false,
        systemReporting: false,
        errorHandling: true,
        performanceMonitoring: false,
        sessionTracking: false
      },
      status: {
        gitManagement: false,
        systemReporting: true,
        errorHandling: true,
        performanceMonitoring: false,
        sessionTracking: false
      }
    };
    
    const totalCommands = Object.keys(commandCoverage).length;
    const totalFeatures = totalCommands * 5; // 5 features per command
    let coveredFeatures = 0;
    
    Object.values(commandCoverage).forEach(command => {
      Object.values(command).forEach(feature => {
        if (feature) coveredFeatures++;
      });
    });
    
    return {
      commandCoverage,
      totalCommands,
      totalFeatures,
      coveredFeatures,
      coveragePercentage: Math.round((coveredFeatures / totalFeatures) * 100)
    };
  }

  async generateCommandReport(command, options, results) {
    const timestamp = new Date().toISOString();
    
    const report = {
      timestamp,
      command,
      options,
      results,
      systemHealth: await this.getSystemHealth(),
      gitStatus: await this.getGitStatus(),
      performance: await this.getPerformanceMetrics(),
      coverage: await this.getCoverageMetrics(),
      metadata: {
        nodeVersion: process.version,
        platform: process.platform,
        cwd: this.projectRoot,
        pid: process.pid
      }
    };

    // Save individual report
    const reportPath = path.join(this.reportsDir, `${command}-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Update central hub
    await this.updateCentralHub(report);

    console.log(`📊 Command report generated: ${reportPath}`);
    return report;
  }

  async updateCentralHub(report) {
    const hubPath = path.join(this.centralHub, 'system-hub.json');
    let hub = { 
      reports: [], 
      summary: {},
      lastUpdated: new Date().toISOString()
    };
    
    if (fs.existsSync(hubPath)) {
      try {
        hub = JSON.parse(fs.readFileSync(hubPath, 'utf8'));
      } catch (error) {
        console.warn('Could not parse existing hub, creating new one');
      }
    }

    hub.reports.push(report);
    hub.lastUpdated = new Date().toISOString();
    hub.summary = await this.generateSummary(hub.reports);

    fs.writeFileSync(hubPath, JSON.stringify(hub, null, 2));
    console.log(`📊 Central hub updated: ${hubPath}`);
  }

  async generateSummary(reports) {
    if (reports.length === 0) {
      return {
        totalReports: 0,
        averageHealthScore: 0,
        mostUsedCommand: 'none',
        systemStatus: 'unknown'
      };
    }
    
    // Calculate average health score
    const healthScores = reports.map(r => r.systemHealth?.score || 0);
    const averageHealthScore = Math.round(
      healthScores.reduce((sum, score) => sum + score, 0) / healthScores.length
    );
    
    // Find most used command
    const commandCounts = {};
    reports.forEach(report => {
      const cmd = report.command;
      commandCounts[cmd] = (commandCounts[cmd] || 0) + 1;
    });
    
    const mostUsedCommand = Object.entries(commandCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'none';
    
    // Determine system status
    let systemStatus = 'unknown';
    if (averageHealthScore >= 80) {
      systemStatus = 'healthy';
    } else if (averageHealthScore >= 60) {
      systemStatus = 'warning';
    } else {
      systemStatus = 'critical';
    }
    
    return {
      totalReports: reports.length,
      averageHealthScore,
      mostUsedCommand,
      systemStatus,
      lastReport: reports[reports.length - 1]?.timestamp
    };
  }

  async getErrorLog() {
    const errorLogPath = path.join(this.projectRoot, 'data/logs/errors.json');
    
    if (fs.existsSync(errorLogPath)) {
      try {
        const errorLog = JSON.parse(fs.readFileSync(errorLogPath, 'utf8'));
        return errorLog.slice(-10); // Last 10 errors
      } catch (error) {
        return [];
      }
    }
    
    return [];
  }

  async getWarningLog() {
    const warningLogPath = path.join(this.projectRoot, 'data/logs/warnings.json');
    
    if (fs.existsSync(warningLogPath)) {
      try {
        const warningLog = JSON.parse(fs.readFileSync(warningLogPath, 'utf8'));
        return warningLog.slice(-10); // Last 10 warnings
      } catch (error) {
        return [];
      }
    }
    
    return [];
  }
}

// Export for use in other modules
module.exports = SystemReportingManager;

// Run standalone if called directly
if (require.main === module) {
  const reportingManager = new SystemReportingManager();
  
  const command = process.argv[2];
  const options = process.argv.slice(3);
  
  switch (command) {
    case 'health':
      reportingManager.getSystemHealth().then(console.log);
      break;
    case 'report':
      reportingManager.generateCommandReport(options[0], options.slice(1), {}).then(console.log);
      break;
    case 'coverage':
      reportingManager.getCoverageMetrics().then(console.log);
      break;
    case 'summary':
      const hubPath = path.join(reportingManager.centralHub, 'system-hub.json');
      if (fs.existsSync(hubPath)) {
        const hub = JSON.parse(fs.readFileSync(hubPath, 'utf8'));
        console.log(hub.summary);
      } else {
        console.log('No system hub found');
      }
      break;
    default:
      console.log('Usage: node system_reporting_manager.cjs [health|report|coverage|summary] [options]');
  }
} 