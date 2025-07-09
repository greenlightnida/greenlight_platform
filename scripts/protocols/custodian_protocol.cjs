#!/usr/bin/env node

/**
 * Custodian Protocol
 * System Governance and Maintenance Protocol
 * 
 * Enhanced with continuous reconciliation module for legacy code cleanup
 */

const fs = require('fs');
const path = require('path');
const CustodianReconciliationModule = require('./custodian_reconciliation_module.cjs');

// Configuration
const CONFIG = {
  // System health thresholds
  healthThresholds: {
    critical: 30,
    warning: 70,
    healthy: 90
  },
  
  // Monitoring intervals
  monitoringIntervals: {
    reconciliation: 300000, // 5 minutes
    healthCheck: 60000,     // 1 minute
    audit: 3600000         // 1 hour
  },
  
  // Logging
  logFile: 'data/audits/custodian_log.json',
  
  // Archive directories
  archiveDirectories: [
    'archive/legacy-code',
    'archive/boundary-backups',
    'archive/todo-items',
    'archive/legacy-components'
  ]
};

// Custodian Protocol Class
class CustodianProtocol {
  constructor() {
    this.reconciliationModule = new CustodianReconciliationModule();
    this.projectRoot = process.cwd();
    this.isRunning = false;
    this.monitoringInterval = null;
    this.healthCheckInterval = null;
    this.auditInterval = null;
  }
  
  async execute() {
    console.log('🛡️ Custodian Protocol - System Governance');
    console.log('==========================================');
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log('');
    
    try {
      // Initialize custodian
      await this.initialize();
      
      // Perform initial system assessment
      const assessment = await this.assessSystem();
      
      // Execute reconciliation if needed
      if (assessment.needsReconciliation) {
        await this.executeReconciliation();
      }
      
      // Start continuous monitoring
      await this.startContinuousMonitoring();
      
      console.log('✅ Custodian protocol initialized successfully');
      return {
        status: 'success',
        assessment,
        monitoring: 'active'
      };
      
    } catch (error) {
      console.error('❌ Custodian protocol failed:', error.message);
      throw error;
    }
  }
  
  async initialize() {
    console.log('🔧 Initializing Custodian Protocol...');
    
    // Create necessary directories
    this.ensureDirectories();
    
    // Initialize reconciliation module
    await this.reconciliationModule.ensureDirectories();
    
    // Load previous state
    this.loadPreviousState();
    
    console.log('✅ Custodian protocol initialized');
  }
  
  async assessSystem() {
    console.log('📊 Assessing System Health...');
    
    const assessment = {
      timestamp: new Date().toISOString(),
      healthScore: 0,
      issues: [],
      needsReconciliation: false,
      recommendations: []
    };
    
    // Check for boundary backup files
    const backupFiles = this.reconciliationModule.findBackupFiles();
    if (backupFiles.length > 0) {
      assessment.issues.push({
        type: 'boundary_backup_files',
        count: backupFiles.length,
        severity: 'medium',
        description: `${backupFiles.length} boundary backup files found`
      });
      assessment.needsReconciliation = true;
    }
    
    // Check for TODO/FIXME items
    const todoItems = this.reconciliationModule.findTODOItems();
    if (todoItems.length > 0) {
      assessment.issues.push({
        type: 'todo_items',
        count: todoItems.length,
        severity: 'low',
        description: `${todoItems.length} TODO/FIXME items found`
      });
      if (todoItems.length > 10) {
        assessment.needsReconciliation = true;
      }
    }
    
    // Check for unused code
    const unusedCode = this.reconciliationModule.findUnusedCode();
    if (unusedCode.length > 0) {
      assessment.issues.push({
        type: 'unused_code',
        count: unusedCode.length,
        severity: 'medium',
        description: `${unusedCode.length} unused code items found`
      });
      if (unusedCode.length > 50) {
        assessment.needsReconciliation = true;
      }
    }
    
    // Check for legacy components
    const legacyComponents = this.reconciliationModule.findLegacyComponents();
    if (legacyComponents.length > 0) {
      assessment.issues.push({
        type: 'legacy_components',
        count: legacyComponents.length,
        severity: 'high',
        description: `${legacyComponents.length} legacy components found`
      });
      assessment.needsReconciliation = true;
    }
    
    // Calculate health score
    assessment.healthScore = this.calculateHealthScore(assessment.issues);
    
    // Generate recommendations
    assessment.recommendations = this.generateRecommendations(assessment.issues);
    
    console.log(`✅ System assessment complete - Health Score: ${assessment.healthScore}/100`);
    
    return assessment;
  }
  
  calculateHealthScore(issues) {
    let score = 100;
    
    for (const issue of issues) {
      switch (issue.severity) {
        case 'critical':
          score -= 20;
          break;
        case 'high':
          score -= 15;
          break;
        case 'medium':
          score -= 10;
          break;
        case 'low':
          score -= 5;
          break;
      }
    }
    
    return Math.max(0, score);
  }
  
  generateRecommendations(issues) {
    const recommendations = [];
    
    for (const issue of issues) {
      switch (issue.type) {
        case 'boundary_backup_files':
          recommendations.push('Execute boundary backup cleanup to remove duplicate files');
          break;
        case 'todo_items':
          recommendations.push('Resolve TODO/FIXME items to improve code quality');
          break;
        case 'unused_code':
          recommendations.push('Remove unused code to optimize performance');
          break;
        case 'legacy_components':
          recommendations.push('Reconcile legacy components to align with current architecture');
          break;
      }
    }
    
    return recommendations;
  }
  
  async executeReconciliation() {
    console.log('🧹 Executing System Reconciliation...');
    
    try {
      const results = await this.reconciliationModule.execute('full');
      
      // Log reconciliation results
      this.logReconciliationResults(results);
      
      // Update system health
      await this.updateSystemHealth(results);
      
      console.log('✅ System reconciliation completed');
      return results;
      
    } catch (error) {
      console.error('❌ System reconciliation failed:', error.message);
      throw error;
    }
  }
  
  async startContinuousMonitoring() {
    console.log('🔄 Starting Continuous Monitoring...');
    
    this.isRunning = true;
    
    // Start reconciliation monitoring
    this.monitoringInterval = setInterval(async () => {
      if (this.isRunning) {
        try {
          await this.monitorReconciliation();
        } catch (error) {
          console.error('Monitoring error:', error.message);
        }
      }
    }, CONFIG.monitoringIntervals.reconciliation);
    
    // Start health check monitoring
    this.healthCheckInterval = setInterval(async () => {
      if (this.isRunning) {
        try {
          await this.monitorHealth();
        } catch (error) {
          console.error('Health check error:', error.message);
        }
      }
    }, CONFIG.monitoringIntervals.healthCheck);
    
    // Start audit monitoring
    this.auditInterval = setInterval(async () => {
      if (this.isRunning) {
        try {
          await this.performAudit();
        } catch (error) {
          console.error('Audit error:', error.message);
        }
      }
    }, CONFIG.monitoringIntervals.audit);
    
    console.log('✅ Continuous monitoring started');
  }
  
  async monitorReconciliation() {
    // Quick check for new issues
    const assessment = await this.assessSystem();
    
    if (assessment.needsReconciliation) {
      console.log('🔄 Reconciliation needed - executing quick cleanup...');
      await this.reconciliationModule.quickCleanup();
    }
  }
  
  async monitorHealth() {
    // Monitor system health metrics
    const healthMetrics = await this.getHealthMetrics();
    
    if (healthMetrics.healthScore < CONFIG.healthThresholds.critical) {
      console.log('🚨 Critical system health detected - initiating emergency reconciliation');
      await this.executeReconciliation();
    } else if (healthMetrics.healthScore < CONFIG.healthThresholds.warning) {
      console.log('⚠️ System health warning - scheduling reconciliation');
      // Schedule reconciliation for next cycle
    }
  }
  
  async performAudit() {
    console.log('📋 Performing System Audit...');
    
    const audit = {
      timestamp: new Date().toISOString(),
      healthMetrics: await this.getHealthMetrics(),
      reconciliationHistory: this.getReconciliationHistory(),
      recommendations: this.generateAuditRecommendations()
    };
    
    // Log audit results
    this.logAuditResults(audit);
    
    console.log('✅ System audit completed');
  }
  
  async getHealthMetrics() {
    const assessment = await this.assessSystem();
    
    return {
      healthScore: assessment.healthScore,
      issueCount: assessment.issues.length,
      lastReconciliation: this.getLastReconciliationTime(),
      systemStatus: assessment.healthScore >= CONFIG.healthThresholds.healthy ? 'healthy' : 
                   assessment.healthScore >= CONFIG.healthThresholds.warning ? 'warning' : 'critical'
    };
  }
  
  getReconciliationHistory() {
    const logFile = CONFIG.logFile;
    if (fs.existsSync(logFile)) {
      try {
        const logData = JSON.parse(fs.readFileSync(logFile, 'utf8'));
        return logData.reconciliationHistory || [];
      } catch (error) {
        return [];
      }
    }
    return [];
  }
  
  getLastReconciliationTime() {
    const history = this.getReconciliationHistory();
    return history.length > 0 ? history[history.length - 1].timestamp : null;
  }
  
  generateAuditRecommendations() {
    const recommendations = [];
    const history = this.getReconciliationHistory();
    
    if (history.length === 0) {
      recommendations.push('Perform initial system reconciliation');
    } else {
      const lastReconciliation = new Date(history[history.length - 1].timestamp);
      const daysSince = (Date.now() - lastReconciliation.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysSince > 7) {
        recommendations.push('Schedule comprehensive reconciliation (last reconciliation was over a week ago)');
      }
    }
    
    return recommendations;
  }
  
  logReconciliationResults(results) {
    const logFile = CONFIG.logFile;
    const logDir = path.dirname(logFile);
    fs.mkdirSync(logDir, { recursive: true });
    
    let logData = {};
    if (fs.existsSync(logFile)) {
      try {
        logData = JSON.parse(fs.readFileSync(logFile, 'utf8'));
      } catch (error) {
        logData = {};
      }
    }
    
    if (!logData.reconciliationHistory) {
      logData.reconciliationHistory = [];
    }
    
    logData.reconciliationHistory.push({
      timestamp: new Date().toISOString(),
      results: results
    });
    
    // Keep only last 100 entries
    if (logData.reconciliationHistory.length > 100) {
      logData.reconciliationHistory = logData.reconciliationHistory.slice(-100);
    }
    
    fs.writeFileSync(logFile, JSON.stringify(logData, null, 2));
  }
  
  logAuditResults(audit) {
    const auditFile = 'data/audits/custodian_audit_log.json';
    const auditDir = path.dirname(auditFile);
    fs.mkdirSync(auditDir, { recursive: true });
    
    let auditData = {};
    if (fs.existsSync(auditFile)) {
      try {
        auditData = JSON.parse(fs.readFileSync(auditFile, 'utf8'));
      } catch (error) {
        auditData = {};
      }
    }
    
    if (!auditData.auditHistory) {
      auditData.auditHistory = [];
    }
    
    auditData.auditHistory.push(audit);
    
    // Keep only last 50 entries
    if (auditData.auditHistory.length > 50) {
      auditData.auditHistory = auditData.auditHistory.slice(-50);
    }
    
    fs.writeFileSync(auditFile, JSON.stringify(auditData, null, 2));
  }
  
  async updateSystemHealth(results) {
    // Update system health based on reconciliation results
    const summary = results.generateSummary();
    
    if (summary.status === 'success') {
      console.log('✅ System health improved after reconciliation');
    } else if (summary.status === 'warning') {
      console.log('⚠️ System health has warnings after reconciliation');
    } else {
      console.log('❌ System health has errors after reconciliation');
    }
  }
  
  ensureDirectories() {
    // Create archive directories
    for (const archiveDir of CONFIG.archiveDirectories) {
      const fullPath = path.join(this.projectRoot, archiveDir);
      fs.mkdirSync(fullPath, { recursive: true });
    }
    
    // Create log directories
    const logDir = path.dirname(CONFIG.logFile);
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  loadPreviousState() {
    // Load previous custodian state if available
    const stateFile = 'data/system-state/custodian_state.json';
    if (fs.existsSync(stateFile)) {
      try {
        const state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
        // Restore previous state if needed
        console.log('📋 Loaded previous custodian state');
      } catch (error) {
        console.log('📋 No previous state to load');
      }
    }
  }
  
  async stop() {
    console.log('🛑 Stopping Custodian Protocol...');
    
    this.isRunning = false;
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    
    if (this.auditInterval) {
      clearInterval(this.auditInterval);
    }
    
    console.log('✅ Custodian protocol stopped');
  }
  
  // Public API Methods
  async getStatus() {
    return {
      isRunning: this.isRunning,
      healthMetrics: await this.getHealthMetrics(),
      lastReconciliation: this.getLastReconciliationTime(),
      monitoringIntervals: CONFIG.monitoringIntervals
    };
  }
  
  async forceReconciliation() {
    console.log('🔧 Force Reconciliation Requested...');
    return await this.executeReconciliation();
  }
  
  async quickCleanup() {
    console.log('⚡ Quick Cleanup Requested...');
    return await this.reconciliationModule.quickCleanup();
  }
}

// Export the protocol
module.exports = CustodianProtocol; 