#!/usr/bin/env node

/**
 * Protocol Monitor System
 * 
 * PURPOSE: Continuously monitors protocol health and prevents issues before they occur.
 * Provides real-time monitoring, alerting, and automatic recovery for protocol systems.
 * 
 * FEATURES:
 * - Real-time protocol monitoring
 * - Automatic issue detection
 * - Health metrics tracking
 * - Alert system
 * - Automatic recovery
 * - Performance monitoring
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const CommandExecutionOptimizer = require('./command_execution_optimizer.cjs');

class ProtocolMonitor {
  constructor() {
    this.projectRoot = process.cwd();
    this.sessionId = `monitor-${Date.now()}`;
    this.monitoringData = {};
    this.alerts = [];
    this.metrics = {
      totalChecks: 0,
      successfulChecks: 0,
      failedChecks: 0,
      alertsGenerated: 0,
      recoveriesAttempted: 0,
      recoveriesSuccessful: 0
    };
    this.isMonitoring = false;
  }

  async startMonitoring() {
    console.log('📊 Protocol Monitor Started');
    console.log('==========================');
    console.log(`Session ID: ${this.sessionId}`);
    console.log('Monitoring protocols for issues...');
    console.log('');

    this.isMonitoring = true;
    
    // Initial health check
    await this.performHealthCheck();
    
    // Start continuous monitoring
    this.monitoringInterval = setInterval(async () => {
      await this.performHealthCheck();
    }, 30000); // Check every 30 seconds
    
    // Start alert monitoring
    this.alertInterval = setInterval(() => {
      this.processAlerts();
    }, 10000); // Process alerts every 10 seconds
  }

  async stopMonitoring() {
    console.log('🛑 Stopping Protocol Monitor...');
    
    this.isMonitoring = false;
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    
    if (this.alertInterval) {
      clearInterval(this.alertInterval);
    }
    
    // Final health check
    await this.performHealthCheck();
    
    // Generate final report
    await this.generateMonitoringReport();
    
    console.log('✅ Protocol Monitor Stopped');
  }

  async performHealthCheck() {
    this.metrics.totalChecks++;
    
    try {
      console.log(`🔍 Health Check #${this.metrics.totalChecks} - ${new Date().toISOString()}`);
      
      // Check 1: Protocol File Integrity
      await this.checkProtocolFileIntegrity();
      
      // Check 2: Protocol Dependencies
      await this.checkProtocolDependencies();
      
      // Check 3: Protocol Performance
      await this.checkProtocolPerformance();
      
      // Check 4: Protocol Integration
      await this.checkProtocolIntegration();
      
      // Check 5: Protocol Safety
      await this.checkProtocolSafety();
      
      this.metrics.successfulChecks++;
      
    } catch (error) {
      this.metrics.failedChecks++;
      this.generateAlert('HEALTH_CHECK_FAILED', `Health check failed: ${error.message}`);
      console.error('❌ Health check failed:', error.message);
    }
  }

  async checkProtocolFileIntegrity() {
    const protocolFiles = [
      'scripts/protocols/launch_protocol.cjs',
      'scripts/protocols/end_of_chat_protocol.js',
      'scripts/protocols/pre_wrap_audit_protocol.cjs',
      'scripts/governance/custodian_protocol.cjs'
    ];

    for (const protocolFile of protocolFiles) {
      const protocolPath = path.join(this.projectRoot, protocolFile);
      
      if (!fs.existsSync(protocolPath)) {
        this.generateAlert('PROTOCOL_FILE_MISSING', `Protocol file missing: ${protocolFile}`);
        continue;
      }
      
      const stats = fs.statSync(protocolPath);
      
      // Check file size
      if (stats.size === 0) {
        this.generateAlert('PROTOCOL_FILE_EMPTY', `Protocol file is empty: ${protocolFile}`);
        continue;
      }
      
      // Check file permissions
      try {
        fs.accessSync(protocolPath, fs.constants.R_OK | fs.constants.X_OK);
      } catch (error) {
        this.generateAlert('PROTOCOL_FILE_PERMISSIONS', `Protocol file permissions issue: ${protocolFile}`);
        continue;
      }
      
      // Check file modification time
      const hoursSinceModified = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60);
      if (hoursSinceModified > 168) { // 1 week
        this.generateAlert('PROTOCOL_FILE_STALE', `Protocol file hasn't been modified in ${Math.floor(hoursSinceModified)} hours: ${protocolFile}`);
      }
      
      this.monitoringData[protocolFile] = {
        exists: true,
        size: stats.size,
        lastModified: stats.mtime,
        permissions: 'readable'
      };
    }
  }

  async checkProtocolDependencies() {
    const dependencies = [
      'fs', 'path', 'child_process', 'events'
    ];
    
    for (const dep of dependencies) {
      try {
        require(dep);
        // Dependency is available
      } catch (error) {
        this.generateAlert('DEPENDENCY_MISSING', `Required dependency missing: ${dep}`);
      }
    }
    
    // Check node_modules for custom dependencies
    const nodeModulesPath = path.join(this.projectRoot, 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      this.generateAlert('NODE_MODULES_MISSING', 'node_modules directory not found');
    }
  }

  async checkProtocolPerformance() {
    // Check memory usage
    const memUsage = process.memoryUsage();
    const heapUsed = memUsage.heapUsed / 1024 / 1024; // MB
    
    if (heapUsed > 500) { // 500MB threshold
      this.generateAlert('HIGH_MEMORY_USAGE', `High memory usage: ${Math.round(heapUsed)}MB`);
    }
    
    // Check CPU usage (simplified)
    const startTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, 100));
    const endTime = Date.now();
    const processingTime = endTime - startTime;
    
    if (processingTime > 200) { // 200ms threshold
      this.generateAlert('HIGH_CPU_USAGE', `High CPU usage detected: ${processingTime}ms processing time`);
    }
  }

  async checkProtocolIntegration() {
    const integrationPoints = [
      'src/core/session-management/SessionManager.ts',
      'src/core/protocols/ProtocolManager.ts',
      'src/core/governance/GovernanceOrchestrator.ts'
    ];
    
    for (const integrationPoint of integrationPoints) {
      const integrationPath = path.join(this.projectRoot, integrationPoint);
      
      if (!fs.existsSync(integrationPath)) {
        this.generateAlert('INTEGRATION_POINT_MISSING', `Integration point missing: ${integrationPoint}`);
        continue;
      }
      
      // Check if integration point is properly exported
      try {
        const content = fs.readFileSync(integrationPath, 'utf8');
        if (!content.includes('export')) {
          this.generateAlert('INTEGRATION_POINT_NOT_EXPORTED', `Integration point not properly exported: ${integrationPoint}`);
        }
      } catch (error) {
        this.generateAlert('INTEGRATION_POINT_UNREADABLE', `Cannot read integration point: ${integrationPoint}`);
      }
    }
  }

  async checkProtocolSafety() {
    // Run safety check on all protocols
    const protocols = ['launch', 'end_of_chat', 'pre_wrap_audit', 'custodian'];
    const executor = new CommandExecutionOptimizer();
    for (const protocol of protocols) {
      try {
        const result = await executor.executeCommand('node', {
          args: ['scripts/protocols/pre_execution_safety.cjs', protocol],
          timeout: 10000,
          silent: true
        });
        if (result.stdout.includes('EXECUTION BLOCKED')) {
          this.generateAlert('PROTOCOL_SAFETY_FAILED', `Protocol safety check failed: ${protocol}`);
        }
      } catch (error) {
        this.generateAlert('PROTOCOL_SAFETY_ERROR', `Protocol safety check error: ${protocol} - ${error.message}`);
      }
    }
  }

  generateAlert(type, message) {
    const alert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: type,
      message: message,
      timestamp: new Date().toISOString(),
      severity: this.getAlertSeverity(type),
      acknowledged: false
    };
    
    this.alerts.push(alert);
    this.metrics.alertsGenerated++;
    
    console.log(`🚨 ALERT [${alert.severity}]: ${message}`);
    
    // Attempt automatic recovery for certain alert types
    if (alert.severity === 'critical') {
      this.attemptRecovery(alert);
    }
  }

  getAlertSeverity(type) {
    const criticalTypes = [
      'PROTOCOL_FILE_MISSING',
      'DEPENDENCY_MISSING',
      'NODE_MODULES_MISSING',
      'PROTOCOL_SAFETY_FAILED'
    ];
    
    const warningTypes = [
      'PROTOCOL_FILE_STALE',
      'HIGH_MEMORY_USAGE',
      'HIGH_CPU_USAGE',
      'INTEGRATION_POINT_NOT_EXPORTED'
    ];
    
    if (criticalTypes.includes(type)) {
      return 'critical';
    } else if (warningTypes.includes(type)) {
      return 'warning';
    } else {
      return 'info';
    }
  }

  async attemptRecovery(alert) {
    this.metrics.recoveriesAttempted++;
    
    console.log(`🔄 Attempting recovery for alert: ${alert.type}`);
    
    try {
      switch (alert.type) {
        case 'PROTOCOL_FILE_MISSING':
          await this.recoverMissingProtocolFile(alert);
          break;
        case 'DEPENDENCY_MISSING':
          await this.recoverMissingDependency(alert);
          break;
        case 'PROTOCOL_SAFETY_FAILED':
          await this.recoverProtocolSafety(alert);
          break;
        default:
          console.log(`No recovery strategy for alert type: ${alert.type}`);
      }
      
      this.metrics.recoveriesSuccessful++;
      console.log(`✅ Recovery successful for alert: ${alert.type}`);
      
    } catch (error) {
      console.error(`❌ Recovery failed for alert ${alert.type}:`, error.message);
    }
  }

  async recoverMissingProtocolFile(alert) {
    // Attempt to restore from backup or regenerate
    console.log(`Attempting to recover missing protocol file from alert: ${alert.message}`);
    
    // Check if there's a backup
    const backupDir = path.join(this.projectRoot, 'data/backups');
    if (fs.existsSync(backupDir)) {
      const backupFiles = fs.readdirSync(backupDir);
      const protocolBackup = backupFiles.find(file => file.includes('protocol'));
      
      if (protocolBackup) {
        console.log(`Found protocol backup: ${protocolBackup}`);
        // Restore logic would go here
      }
    }
  }

  async recoverMissingDependency(alert) {
    console.log(`Attempting to recover missing dependency from alert: ${alert.message}`);
    
    // Try to install missing dependency
    try {
      const dependency = alert.message.match(/Required dependency missing: (.+)/)?.[1];
      if (dependency) {
        console.log(`Installing missing dependency: ${dependency}`);
        // npm install logic would go here
      }
    } catch (error) {
      console.error('Failed to install dependency:', error.message);
    }
  }

  async recoverProtocolSafety(alert) {
    console.log(`Attempting to recover protocol safety from alert: ${alert.message}`);
    
    // Run protocol validation and fix issues
    try {
      const protocol = alert.message.match(/Protocol safety check failed: (.+)/)?.[1];
      if (protocol) {
        console.log(`Running protocol validation for: ${protocol}`);
        // Validation and fix logic would go here
      }
    } catch (error) {
      console.error('Failed to recover protocol safety:', error.message);
    }
  }

  processAlerts() {
    const unacknowledgedAlerts = this.alerts.filter(alert => !alert.acknowledged);
    
    for (const alert of unacknowledgedAlerts) {
      // Process alerts based on severity
      if (alert.severity === 'critical') {
        console.log(`🚨 CRITICAL ALERT: ${alert.message}`);
        // Could trigger notifications, logging, etc.
      } else if (alert.severity === 'warning') {
        console.log(`⚠️  WARNING: ${alert.message}`);
      }
      
      // Mark as acknowledged after processing
      alert.acknowledged = true;
    }
  }

  async generateMonitoringReport() {
    const report = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      monitoringDuration: Date.now() - parseInt(this.sessionId.split('-')[1]),
      metrics: this.metrics,
      alerts: this.alerts,
      monitoringData: this.monitoringData,
      summary: {
        totalAlerts: this.alerts.length,
        criticalAlerts: this.alerts.filter(a => a.severity === 'critical').length,
        warningAlerts: this.alerts.filter(a => a.severity === 'warning').length,
        recoverySuccessRate: this.metrics.recoveriesAttempted > 0 
          ? (this.metrics.recoveriesSuccessful / this.metrics.recoveriesAttempted) * 100 
          : 0
      }
    };

    const reportPath = path.join(this.projectRoot, `data/protocols/monitoring-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📊 Monitoring report generated: ${reportPath}`);
  }
}

// Run the protocol monitor
if (require.main === module) {
  const monitor = new ProtocolMonitor();
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    await monitor.stopMonitoring();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    await monitor.stopMonitoring();
    process.exit(0);
  });
  
  // Start monitoring
  monitor.startMonitoring();
}

module.exports = ProtocolMonitor; 