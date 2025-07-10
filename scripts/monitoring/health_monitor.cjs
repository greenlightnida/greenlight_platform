#!/usr/bin/env node

/**
 * Health Monitor
 * 
 * PURPOSE: Real-time system health monitoring
 * - Monitor system health continuously
 * - Track performance metrics
 * - Detect and alert on issues
 * - Provide health recommendations
 * - Generate health reports
 * 
 * USAGE: Integrated with command_coordinator.cjs
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class HealthMonitor {
  constructor() {
    this.projectRoot = process.cwd();
    this.healthDataDir = path.join(this.projectRoot, 'data/health');
    this.ensureDirectories();
    this.healthHistory = [];
    this.maxHistorySize = 100;
  }

  ensureDirectories() {
    if (!fs.existsSync(this.healthDataDir)) {
      fs.mkdirSync(this.healthDataDir, { recursive: true });
    }
  }

  async monitorSystemHealth() {
    const startTime = Date.now();
    
    try {
      const metrics = {
        gitStatus: await this.getGitStatus(),
        buildStatus: await this.getBuildStatus(),
        testCoverage: await this.getTestCoverage(),
        performance: await this.getPerformanceMetrics(),
        errors: await this.getErrorLog(),
        warnings: await this.getWarningLog(),
        diskUsage: await this.getDiskUsage(),
        memoryUsage: await this.getMemoryUsage(),
        processInfo: await this.getProcessInfo()
      };

      const healthScore = this.calculateHealthScore(metrics);
      const status = this.getHealthStatus(healthScore);
      const recommendations = this.generateRecommendations(metrics, healthScore);
      
      const healthData = {
        score: healthScore,
        status,
        metrics,
        recommendations,
        timestamp: new Date().toISOString(),
        monitoringDuration: Date.now() - startTime
      };

      // Store health data
      await this.storeHealthData(healthData);
      
      // Update history
      this.updateHealthHistory(healthData);
      
      // Check for alerts
      await this.checkForAlerts(healthData);
      
      return healthData;
    } catch (error) {
      const errorHealthData = {
        score: 0,
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString(),
        monitoringDuration: Date.now() - startTime
      };
      
      await this.storeHealthData(errorHealthData);
      return errorHealthData;
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
        totalChanges: lines.length,
        status: lines.length === 0 ? 'clean' : lines.length > 50 ? 'critical' : 'dirty'
      };
    } catch (error) {
      return {
        hasChanges: false,
        modifiedFiles: 0,
        untrackedFiles: 0,
        deletedFiles: 0,
        addedFiles: 0,
        totalChanges: 0,
        status: 'error',
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
      
      const overall = frontendBuild.success && backendBuild.success ? 'success' : 'failed';
      
      return {
        frontend: frontendBuild,
        backend: backendBuild,
        overall,
        status: overall === 'success' ? 'healthy' : 'critical'
      };
    } catch (error) {
      return {
        frontend: { success: false, error: error.message },
        backend: { success: false, error: error.message },
        overall: 'error',
        status: 'critical',
        error: error.message
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

  async getTestCoverage() {
    try {
      const testFiles = this.findTestFiles();
      const testResults = await this.runTests();
      
      return {
        testFiles: testFiles.length,
        testResults,
        coverage: testFiles.length > 0 ? 'available' : 'none',
        status: testFiles.length > 0 && testResults.success ? 'healthy' : 'warning'
      };
    } catch (error) {
      return {
        testFiles: 0,
        testResults: { success: false, error: error.message },
        coverage: 'error',
        status: 'critical',
        error: error.message
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
      
      // Calculate memory usage percentage
      const memoryUsagePercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
      
      return {
        memory: {
          rss: memoryUsage.rss,
          heapUsed: memoryUsage.heapUsed,
          heapTotal: memoryUsage.heapTotal,
          external: memoryUsage.external,
          usagePercent: Math.round(memoryUsagePercent)
        },
        cpu: {
          user: cpuUsage.user,
          system: cpuUsage.system
        },
        uptime: process.uptime(),
        status: memoryUsagePercent > 80 ? 'warning' : memoryUsagePercent > 95 ? 'critical' : 'healthy'
      };
    } catch (error) {
      return {
        memory: {},
        cpu: {},
        uptime: 0,
        status: 'error',
        error: error.message
      };
    }
  }

  async getErrorLog() {
    const errorLogPath = path.join(this.projectRoot, 'data/logs/errors.json');
    
    if (fs.existsSync(errorLogPath)) {
      try {
        const errorLog = JSON.parse(fs.readFileSync(errorLogPath, 'utf8'));
        const recentErrors = errorLog.slice(-5); // Last 5 errors
        
        return {
          count: errorLog.length,
          recentErrors,
          status: errorLog.length === 0 ? 'healthy' : errorLog.length > 10 ? 'critical' : 'warning'
        };
      } catch (error) {
        return {
          count: 0,
          recentErrors: [],
          status: 'error',
          error: error.message
        };
      }
    }
    
    return {
      count: 0,
      recentErrors: [],
      status: 'healthy'
    };
  }

  async getWarningLog() {
    const warningLogPath = path.join(this.projectRoot, 'data/logs/warnings.json');
    
    if (fs.existsSync(warningLogPath)) {
      try {
        const warningLog = JSON.parse(fs.readFileSync(warningLogPath, 'utf8'));
        const recentWarnings = warningLog.slice(-5); // Last 5 warnings
        
        return {
          count: warningLog.length,
          recentWarnings,
          status: warningLog.length === 0 ? 'healthy' : warningLog.length > 20 ? 'critical' : 'warning'
        };
      } catch (error) {
        return {
          count: 0,
          recentWarnings: [],
          status: 'error',
          error: error.message
        };
      }
    }
    
    return {
      count: 0,
      recentWarnings: [],
      status: 'healthy'
    };
  }

  async getDiskUsage() {
    try {
      const stats = fs.statSync(this.projectRoot);
      const totalSpace = stats.size;
      
      // Calculate directory size
      const dirSize = this.calculateDirectorySize(this.projectRoot);
      const usagePercent = (dirSize / totalSpace) * 100;
      
      return {
        totalSpace,
        usedSpace: dirSize,
        usagePercent: Math.round(usagePercent),
        status: usagePercent > 90 ? 'critical' : usagePercent > 80 ? 'warning' : 'healthy'
      };
    } catch (error) {
      return {
        totalSpace: 0,
        usedSpace: 0,
        usagePercent: 0,
        status: 'error',
        error: error.message
      };
    }
  }

  calculateDirectorySize(dirPath) {
    let totalSize = 0;
    
    try {
      const items = fs.readdirSync(dirPath);
      
      items.forEach(item => {
        const itemPath = path.join(dirPath, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          totalSize += this.calculateDirectorySize(itemPath);
        } else {
          totalSize += stats.size;
        }
      });
    } catch (error) {
      // Skip if cannot read directory
    }
    
    return totalSize;
  }

  async getMemoryUsage() {
    try {
      const memUsage = process.memoryUsage();
      const usagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
      
      return {
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal,
        usagePercent: Math.round(usagePercent),
        status: usagePercent > 80 ? 'warning' : usagePercent > 95 ? 'critical' : 'healthy'
      };
    } catch (error) {
      return {
        heapUsed: 0,
        heapTotal: 0,
        usagePercent: 0,
        status: 'error',
        error: error.message
      };
    }
  }

  async getProcessInfo() {
    try {
      return {
        pid: process.pid,
        platform: process.platform,
        nodeVersion: process.version,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
      };
    } catch (error) {
      return {
        pid: 0,
        platform: 'unknown',
        nodeVersion: 'unknown',
        uptime: 0,
        error: error.message
      };
    }
  }

  calculateHealthScore(metrics) {
    let score = 100;
    
    // Git status impact
    if (metrics.gitStatus.status === 'critical') {
      score -= 25;
    } else if (metrics.gitStatus.status === 'dirty') {
      score -= 10;
    }
    
    // Build status impact
    if (metrics.buildStatus.status === 'critical') {
      score -= 30;
    }
    
    // Test coverage impact
    if (metrics.testCoverage.status === 'critical') {
      score -= 20;
    } else if (metrics.testCoverage.status === 'warning') {
      score -= 10;
    }
    
    // Performance impact
    if (metrics.performance.status === 'critical') {
      score -= 20;
    } else if (metrics.performance.status === 'warning') {
      score -= 10;
    }
    
    // Error log impact
    if (metrics.errors.status === 'critical') {
      score -= 15;
    } else if (metrics.errors.status === 'warning') {
      score -= 5;
    }
    
    // Warning log impact
    if (metrics.warnings.status === 'critical') {
      score -= 10;
    } else if (metrics.warnings.status === 'warning') {
      score -= 3;
    }
    
    // Disk usage impact
    if (metrics.diskUsage.status === 'critical') {
      score -= 15;
    } else if (metrics.diskUsage.status === 'warning') {
      score -= 5;
    }
    
    return Math.max(0, score);
  }

  getHealthStatus(score) {
    if (score >= 80) return 'healthy';
    if (score >= 60) return 'warning';
    return 'critical';
  }

  generateRecommendations(metrics, healthScore) {
    const recommendations = [];
    
    // Git recommendations
    if (metrics.gitStatus.status === 'critical') {
      recommendations.push('Commit or stash uncommitted changes immediately');
    } else if (metrics.gitStatus.status === 'dirty') {
      recommendations.push('Consider committing changes to maintain clean state');
    }
    
    // Build recommendations
    if (metrics.buildStatus.status === 'critical') {
      recommendations.push('Fix build errors to restore system functionality');
    }
    
    // Test recommendations
    if (metrics.testCoverage.status === 'critical') {
      recommendations.push('Add test coverage to improve system reliability');
    } else if (metrics.testCoverage.status === 'warning') {
      recommendations.push('Consider adding more test coverage');
    }
    
    // Performance recommendations
    if (metrics.performance.status === 'critical') {
      recommendations.push('Investigate high memory usage and optimize performance');
    } else if (metrics.performance.status === 'warning') {
      recommendations.push('Monitor memory usage and consider optimization');
    }
    
    // Error recommendations
    if (metrics.errors.status === 'critical') {
      recommendations.push('Address error logs to prevent system instability');
    } else if (metrics.errors.status === 'warning') {
      recommendations.push('Review error logs and fix issues');
    }
    
    // Disk recommendations
    if (metrics.diskUsage.status === 'critical') {
      recommendations.push('Free up disk space immediately');
    } else if (metrics.diskUsage.status === 'warning') {
      recommendations.push('Consider cleaning up disk space');
    }
    
    // General recommendations
    if (healthScore < 60) {
      recommendations.push('System health is critical - immediate attention required');
    } else if (healthScore < 80) {
      recommendations.push('System health needs improvement - address warnings');
    }
    
    return recommendations;
  }

  async storeHealthData(healthData) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const healthFilePath = path.join(this.healthDataDir, `health-${timestamp}.json`);
    
    try {
      fs.writeFileSync(healthFilePath, JSON.stringify(healthData, null, 2));
    } catch (error) {
      console.error('Failed to store health data:', error.message);
    }
  }

  updateHealthHistory(healthData) {
    this.healthHistory.push(healthData);
    
    // Keep only the last maxHistorySize entries
    if (this.healthHistory.length > this.maxHistorySize) {
      this.healthHistory = this.healthHistory.slice(-this.maxHistorySize);
    }
  }

  async checkForAlerts(healthData) {
    const alerts = [];
    
    // Critical health alerts
    if (healthData.status === 'critical') {
      alerts.push({
        level: 'critical',
        message: 'System health is critical',
        timestamp: healthData.timestamp,
        score: healthData.score
      });
    }
    
    // Performance alerts
    if (healthData.metrics?.performance?.status === 'critical') {
      alerts.push({
        level: 'warning',
        message: 'High memory usage detected',
        timestamp: healthData.timestamp,
        details: healthData.metrics.performance
      });
    }
    
    // Build failure alerts
    if (healthData.metrics?.buildStatus?.status === 'critical') {
      alerts.push({
        level: 'critical',
        message: 'Build failures detected',
        timestamp: healthData.timestamp,
        details: healthData.metrics.buildStatus
      });
    }
    
    // Store alerts if any
    if (alerts.length > 0) {
      await this.storeAlerts(alerts);
    }
    
    return alerts;
  }

  async storeAlerts(alerts) {
    const alertsPath = path.join(this.healthDataDir, 'alerts.json');
    let existingAlerts = [];
    
    if (fs.existsSync(alertsPath)) {
      try {
        existingAlerts = JSON.parse(fs.readFileSync(alertsPath, 'utf8'));
      } catch (error) {
        // Start fresh if file is corrupted
      }
    }
    
    const allAlerts = [...existingAlerts, ...alerts];
    
    // Keep only the last 50 alerts
    const recentAlerts = allAlerts.slice(-50);
    
    try {
      fs.writeFileSync(alertsPath, JSON.stringify(recentAlerts, null, 2));
    } catch (error) {
      console.error('Failed to store alerts:', error.message);
    }
  }

  async getHealthHistory(limit = 10) {
    return this.healthHistory.slice(-limit);
  }

  async getHealthTrend() {
    if (this.healthHistory.length < 2) {
      return { trend: 'insufficient_data', change: 0 };
    }
    
    const recent = this.healthHistory.slice(-5);
    const older = this.healthHistory.slice(-10, -5);
    
    const recentAvg = recent.reduce((sum, h) => sum + h.score, 0) / recent.length;
    const olderAvg = older.reduce((sum, h) => sum + h.score, 0) / older.length;
    
    const change = recentAvg - olderAvg;
    
    let trend = 'stable';
    if (change > 10) trend = 'improving';
    else if (change < -10) trend = 'declining';
    
    return { trend, change: Math.round(change) };
  }
}

// Export for use in other modules
module.exports = HealthMonitor;

// Run standalone if called directly
if (require.main === module) {
  const healthMonitor = new HealthMonitor();
  
  const command = process.argv[2];
  const options = process.argv.slice(3);
  
  switch (command) {
    case 'monitor':
      healthMonitor.monitorSystemHealth().then(console.log);
      break;
    case 'history':
      healthMonitor.getHealthHistory(parseInt(options[0]) || 10).then(console.log);
      break;
    case 'trend':
      healthMonitor.getHealthTrend().then(console.log);
      break;
    default:
      console.log('Usage: node health_monitor.cjs [monitor|history|trend] [options]');
  }
} 