#!/usr/bin/env node

/**
 * Boundary Monitor v1.0.0
 * 
 * PURPOSE: Continuous monitoring of repository boundaries
 * - Watches for file changes and boundary violations
 * - Real-time alerting and reporting
 * - Integration with existing monitoring systems
 * - Background operation with minimal resource usage
 * 
 * USAGE: node scripts/protocols/boundary_monitor.cjs [--daemon]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class BoundaryMonitor {
  constructor() {
    this.projectRoot = process.cwd();
    this.sessionId = `monitor-${Date.now()}`;
    this.isRunning = false;
    this.lastCheck = null;
    this.violationHistory = [];
    this.alertThreshold = 5; // Alert if more than 5 violations found
    
    // Monitoring configuration
    this.config = {
      checkInterval: 30000, // 30 seconds
      reportInterval: 300000, // 5 minutes
      maxHistory: 100,
      alertChannels: ['console', 'file']
    };
  }

  async startMonitoring() {
    console.log('👀 Boundary Monitor v1.0.0 Started');
    console.log('==================================');
    console.log(`Session ID: ${this.sessionId}`);
    console.log(`Check Interval: ${this.config.checkInterval / 1000}s`);
    console.log(`Report Interval: ${this.config.reportInterval / 1000}s`);
    console.log('');

    this.isRunning = true;
    this.lastCheck = new Date();

    // Start continuous monitoring
    this.monitoringLoop();
  }

  async monitoringLoop() {
    while (this.isRunning) {
      try {
        await this.performBoundaryCheck();
        await this.sleep(this.config.checkInterval);
      } catch (error) {
        console.error('❌ Boundary monitoring error:', error.message);
        await this.sleep(5000); // Wait 5 seconds before retrying
      }
    }
  }

  async performBoundaryCheck() {
    const startTime = Date.now();
    
    try {
      // Run boundary enforcement check
      const boundaryResult = execSync('node scripts/protocols/boundary_enforcement_manager.cjs', {
        encoding: 'utf8',
        cwd: this.projectRoot,
        timeout: 30000
      });

      // Parse the report
      const reportPath = path.join(this.projectRoot, 'BOUNDARY_ENFORCEMENT_REPORT.json');
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        
        // Record the check
        const checkResult = {
          timestamp: new Date().toISOString(),
          violations: report.violations.length,
          recommendations: report.recommendations.length,
          duration: Date.now() - startTime
        };

        this.violationHistory.push(checkResult);
        
        // Keep history within limits
        if (this.violationHistory.length > this.config.maxHistory) {
          this.violationHistory.shift();
        }

        // Check for alerts
        if (report.violations.length > this.alertThreshold) {
          await this.triggerAlert(report);
        }

        // Log status
        console.log(`🔍 Boundary Check: ${report.violations.length} violations, ${report.recommendations.length} recommendations (${checkResult.duration}ms)`);
        
        this.lastCheck = new Date();
      }

    } catch (error) {
      console.error('❌ Boundary check failed:', error.message);
    }
  }

  async triggerAlert(report) {
    const alert = {
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      type: 'boundary_violation_threshold',
      severity: 'high',
      violations: report.violations.length,
      threshold: this.alertThreshold,
      message: `Boundary violation threshold exceeded: ${report.violations.length} violations found`
    };

    // Console alert
    if (this.config.alertChannels.includes('console')) {
      console.log('🚨 BOUNDARY ALERT 🚨');
      console.log('===================');
      console.log(alert.message);
      console.log(`Severity: ${alert.severity}`);
      console.log(`Timestamp: ${alert.timestamp}`);
      console.log('');
    }

    // File alert
    if (this.config.alertChannels.includes('file')) {
      const alertPath = path.join(this.projectRoot, 'BOUNDARY_ALERT.json');
      fs.writeFileSync(alertPath, JSON.stringify(alert, null, 2));
    }

    // Integration with existing alert system
    try {
      const alertManager = require('../governance/alerts/AlertManager');
      if (alertManager) {
        alertManager.generateAlert('BOUNDARY_VIOLATION', alert.message);
      }
    } catch (error) {
      // AlertManager not available, continue without it
    }
  }

  async generateMonitoringReport() {
    const report = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      monitoring: {
        isRunning: this.isRunning,
        lastCheck: this.lastCheck,
        totalChecks: this.violationHistory.length,
        averageViolations: this.calculateAverageViolations(),
        trend: this.calculateTrend()
      },
      history: this.violationHistory.slice(-10), // Last 10 checks
      config: this.config
    };

    const reportPath = path.join(this.projectRoot, 'BOUNDARY_MONITORING_REPORT.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    return report;
  }

  calculateAverageViolations() {
    if (this.violationHistory.length === 0) return 0;
    
    const total = this.violationHistory.reduce((sum, check) => sum + check.violations, 0);
    return Math.round(total / this.violationHistory.length);
  }

  calculateTrend() {
    if (this.violationHistory.length < 2) return 'insufficient_data';
    
    const recent = this.violationHistory.slice(-5);
    const older = this.violationHistory.slice(-10, -5);
    
    if (older.length === 0) return 'insufficient_data';
    
    const recentAvg = recent.reduce((sum, check) => sum + check.violations, 0) / recent.length;
    const olderAvg = older.reduce((sum, check) => sum + check.violations, 0) / older.length;
    
    if (recentAvg > olderAvg * 1.1) return 'increasing';
    if (recentAvg < olderAvg * 0.9) return 'decreasing';
    return 'stable';
  }

  async stopMonitoring() {
    console.log('🛑 Stopping boundary monitoring...');
    this.isRunning = false;
    
    // Generate final report
    const finalReport = await this.generateMonitoringReport();
    console.log('📊 Final monitoring report generated');
    console.log(`Total checks: ${finalReport.monitoring.totalChecks}`);
    console.log(`Average violations: ${finalReport.monitoring.averageViolations}`);
    console.log(`Trend: ${finalReport.monitoring.trend}`);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Main execution
function main() {
  const monitor = new BoundaryMonitor();
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    await monitor.stopMonitoring();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    await monitor.stopMonitoring();
    process.exit(0);
  });

  // Start monitoring
  monitor.startMonitoring();
}

main(); 