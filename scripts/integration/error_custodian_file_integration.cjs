#!/usr/bin/env node

/**
 * Error Manager, Custodian, and File Manager Integration System
 * 
 * PURPOSE: Orchestrates coordination between error management, custodial maintenance,
 * and file management systems for optimal system health and performance.
 * 
 * FEATURES:
 * - Real-time error monitoring and resolution coordination
 * - Custodial maintenance with error-aware safety checks
 * - File management optimization with error context
 * - Cross-system learning and pattern recognition
 * - Automated escalation and resolution workflows
 * 
 * USAGE: node scripts/integration/error_custodian_file_integration.cjs [--mode=monitor|maintenance|cleanup]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

class ErrorCustodianFileIntegration extends EventEmitter {
  constructor() {
    super();
    this.projectRoot = process.cwd();
    this.mode = process.argv.find(arg => arg.startsWith('--mode='))?.split('=')[1] || 'monitor';
    this.isRunning = false;
    this.integrationState = {
      lastErrorCheck: null,
      lastCustodialRun: null,
      lastFileScan: null,
      activeErrors: [],
      pendingMaintenance: [],
      fileIssues: [],
      systemHealth: 'unknown',
      coordinationMetrics: {
        errorResolutions: 0,
        maintenanceActions: 0,
        fileOptimizations: 0,
        crossSystemLearning: 0
      }
    };
    
    this.stateFile = path.join(this.projectRoot, 'data/integration_state.json');
    this.logFile = path.join(this.projectRoot, 'data/integration_log.json');
    
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.on('error-detected', this.handleErrorDetected.bind(this));
    this.on('maintenance-required', this.handleMaintenanceRequired.bind(this));
    this.on('file-issue-detected', this.handleFileIssueDetected.bind(this));
    this.on('resolution-applied', this.handleResolutionApplied.bind(this));
    this.on('learning-opportunity', this.handleLearningOpportunity.bind(this));
  }

  async initialize() {
    console.log('🔗 Initializing Error-Custodian-File Integration System...');
    
    // Ensure data directory exists
    const dataDir = path.join(this.projectRoot, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Load existing state
    await this.loadState();
    
    // Initialize component connections
    await this.initializeComponentConnections();
    
    // Start monitoring based on mode
    await this.startModeSpecificOperations();
    
    console.log('✅ Integration system initialized');
    this.log('Integration system initialized', 'info');
  }

  async loadState() {
    try {
      if (fs.existsSync(this.stateFile)) {
        const stateData = fs.readFileSync(this.stateFile, 'utf8');
        this.integrationState = { ...this.integrationState, ...JSON.parse(stateData) };
      }
    } catch (error) {
      console.warn('⚠️ Could not load integration state:', error.message);
    }
  }

  async saveState() {
    try {
      fs.writeFileSync(this.stateFile, JSON.stringify(this.integrationState, null, 2));
    } catch (error) {
      console.error('❌ Failed to save integration state:', error.message);
    }
  }

  async initializeComponentConnections() {
    // Check ErrorManager availability
    const errorManagerPath = path.join(this.projectRoot, 'src/core/holons/operations/ErrorManagerHolon.ts');
    if (fs.existsSync(errorManagerPath)) {
      console.log('✅ ErrorManager found and available');
      this.integrationState.errorManagerAvailable = true;
    } else {
      console.warn('⚠️ ErrorManager not found');
      this.integrationState.errorManagerAvailable = false;
    }

    // Check Custodian availability
    const custodianPath = path.join(this.projectRoot, 'scripts/governance/custodian_protocol.cjs');
    if (fs.existsSync(custodianPath)) {
      console.log('✅ Custodian protocol found and available');
      this.integrationState.custodianAvailable = true;
    } else {
      console.warn('⚠️ Custodian protocol not found');
      this.integrationState.custodianAvailable = false;
    }

    // Check File Management availability
    const fileScanPath = path.join(this.projectRoot, 'scripts/file_management_scan.ts');
    if (fs.existsSync(fileScanPath)) {
      console.log('✅ File management scan found and available');
      this.integrationState.fileManagementAvailable = true;
    } else {
      console.warn('⚠️ File management scan not found');
      this.integrationState.fileManagementAvailable = false;
    }
  }

  async startModeSpecificOperations() {
    switch (this.mode) {
      case 'monitor':
        await this.startMonitoringMode();
        break;
      case 'maintenance':
        await this.startMaintenanceMode();
        break;
      case 'cleanup':
        await this.startCleanupMode();
        break;
      default:
        console.log('🔄 Starting continuous monitoring mode');
        await this.startContinuousMonitoring();
    }
  }

  async startMonitoringMode() {
    console.log('👁️ Starting monitoring mode...');
    this.isRunning = true;
    
    // Initial system assessment
    await this.performSystemAssessment();
    
    // Set up monitoring intervals
    this.monitoringIntervals = {
      errorCheck: setInterval(() => this.checkForErrors(), 30000), // 30 seconds
      maintenanceCheck: setInterval(() => this.checkMaintenanceNeeds(), 300000), // 5 minutes
      fileScan: setInterval(() => this.scanFileSystem(), 600000), // 10 minutes
      healthCheck: setInterval(() => this.performHealthCheck(), 120000) // 2 minutes
    };
    
    console.log('✅ Monitoring mode active');
  }

  async startMaintenanceMode() {
    console.log('🔧 Starting maintenance mode...');
    
    // Run comprehensive maintenance
    await this.performComprehensiveMaintenance();
    
    console.log('✅ Maintenance mode completed');
    process.exit(0);
  }

  async startCleanupMode() {
    console.log('🧹 Starting cleanup mode...');
    
    // Run file cleanup with error awareness
    await this.performErrorAwareCleanup();
    
    console.log('✅ Cleanup mode completed');
    process.exit(0);
  }

  async startContinuousMonitoring() {
    console.log('🔄 Starting continuous monitoring...');
    this.isRunning = true;
    
    // Initial assessment
    await this.performSystemAssessment();
    
    // Continuous monitoring loop
    this.monitoringLoop = setInterval(async () => {
      await this.performMonitoringCycle();
    }, 60000); // 1 minute cycles
  }

  async performSystemAssessment() {
    console.log('🔍 Performing system assessment...');
    
    const assessment = {
      timestamp: new Date().toISOString(),
      errorStatus: await this.assessErrorStatus(),
      maintenanceStatus: await this.assessMaintenanceStatus(),
      fileSystemStatus: await this.assessFileSystemStatus(),
      integrationHealth: this.calculateIntegrationHealth()
    };
    
    this.integrationState.lastAssessment = assessment;
    await this.saveState();
    
    console.log('📊 System assessment completed');
    this.log('System assessment completed', 'info', assessment);
    
    return assessment;
  }

  async assessErrorStatus() {
    if (!this.integrationState.errorManagerAvailable) {
      return { status: 'unavailable', message: 'ErrorManager not found' };
    }
    
    try {
      // Check for recent error reports
      const errorReportPath = path.join(this.projectRoot, 'data/error_manager_state.json');
      if (fs.existsSync(errorReportPath)) {
        const errorData = JSON.parse(fs.readFileSync(errorReportPath, 'utf8'));
        return {
          status: 'available',
          activeErrors: errorData.errors?.length || 0,
          lastCheck: errorData.lastErrorCheck
        };
      }
      return { status: 'no_data', message: 'No error data available' };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async assessMaintenanceStatus() {
    if (!this.integrationState.custodianAvailable) {
      return { status: 'unavailable', message: 'Custodian not found' };
    }
    
    try {
      // Check for recent custodian reports
      const custodianReportPath = path.join(this.projectRoot, 'CUSTODIAN_REPORT.json');
      if (fs.existsSync(custodianReportPath)) {
        const custodianData = JSON.parse(fs.readFileSync(custodianReportPath, 'utf8'));
        return {
          status: 'available',
          lastRun: custodianData.timestamp,
          recommendations: custodianData.recommendations?.length || 0
        };
      }
      return { status: 'no_data', message: 'No custodian data available' };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async assessFileSystemStatus() {
    if (!this.integrationState.fileManagementAvailable) {
      return { status: 'unavailable', message: 'File management not found' };
    }
    
    try {
      // Check for recent file scan reports
      const fileReportPath = path.join(this.projectRoot, 'SYSTEM_AUDIT_REPORT.json');
      if (fs.existsSync(fileReportPath)) {
        const fileData = JSON.parse(fs.readFileSync(fileReportPath, 'utf8'));
        return {
          status: 'available',
          lastScan: fileData.timestamp,
          orphanedFiles: fileData.orphans?.length || 0,
          duplicateGroups: fileData.duplicates?.length || 0
        };
      }
      return { status: 'no_data', message: 'No file scan data available' };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  calculateIntegrationHealth() {
    const components = [
      this.integrationState.errorManagerAvailable,
      this.integrationState.custodianAvailable,
      this.integrationState.fileManagementAvailable
    ];
    
    const availableCount = components.filter(Boolean).length;
    const healthPercentage = (availableCount / components.length) * 100;
    
    if (healthPercentage === 100) return 'excellent';
    if (healthPercentage >= 66) return 'good';
    if (healthPercentage >= 33) return 'fair';
    return 'poor';
  }

  async performMonitoringCycle() {
    console.log('🔄 Performing monitoring cycle...');
    
    // Check for errors
    await this.checkForErrors();
    
    // Check maintenance needs
    await this.checkMaintenanceNeeds();
    
    // Scan file system
    await this.scanFileSystem();
    
    // Update health status
    await this.performHealthCheck();
    
    // Save state
    await this.saveState();
    
    console.log('✅ Monitoring cycle completed');
  }

  async checkForErrors() {
    if (!this.integrationState.errorManagerAvailable) return;
    
    try {
      // Run TypeScript check for errors
      const tsCheck = execSync('npx tsc --noEmit', { encoding: 'utf8', stdio: 'pipe' });
      if (tsCheck) {
        this.emit('error-detected', {
          type: 'typescript',
          output: tsCheck,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      // TypeScript errors found
      this.emit('error-detected', {
        type: 'typescript',
        output: error.stdout || error.stderr || error.message,
        timestamp: new Date().toISOString()
      });
    }
    
    this.integrationState.lastErrorCheck = new Date().toISOString();
  }

  async checkMaintenanceNeeds() {
    if (!this.integrationState.custodianAvailable) return;
    
    try {
      // Run custodian in dry-run mode
      const custodianOutput = execSync('node scripts/governance/custodian_protocol.cjs --dry-run', { 
        encoding: 'utf8', 
        stdio: 'pipe' 
      });
      
      // Parse custodian output for maintenance needs
      if (custodianOutput.includes('recommendations') || custodianOutput.includes('issues')) {
        this.emit('maintenance-required', {
          source: 'custodian',
          output: custodianOutput,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.warn('⚠️ Custodian check failed:', error.message);
    }
    
    this.integrationState.lastCustodialRun = new Date().toISOString();
  }

  async scanFileSystem() {
    if (!this.integrationState.fileManagementAvailable) return;
    
    try {
      // Run file management scan
      const scanOutput = execSync('npx tsx scripts/file_management_scan.ts', { 
        encoding: 'utf8', 
        stdio: 'pipe' 
      });
      
      // Check for file issues
      const reportPath = path.join(this.projectRoot, 'SYSTEM_AUDIT_REPORT.json');
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        if (report.orphans?.length > 0 || report.duplicates?.length > 0) {
          this.emit('file-issue-detected', {
            source: 'file_scan',
            report: report,
            timestamp: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.warn('⚠️ File system scan failed:', error.message);
    }
    
    this.integrationState.lastFileScan = new Date().toISOString();
  }

  async performHealthCheck() {
    const health = {
      timestamp: new Date().toISOString(),
      errorManager: this.integrationState.errorManagerAvailable ? 'healthy' : 'unavailable',
      custodian: this.integrationState.custodianAvailable ? 'healthy' : 'unavailable',
      fileManagement: this.integrationState.fileManagementAvailable ? 'healthy' : 'unavailable',
      integrationHealth: this.calculateIntegrationHealth(),
      activeErrors: this.integrationState.activeErrors.length,
      pendingMaintenance: this.integrationState.pendingMaintenance.length,
      fileIssues: this.integrationState.fileIssues.length
    };
    
    this.integrationState.systemHealth = health.integrationHealth;
    this.integrationState.lastHealthCheck = health;
    
    // Emit health status
    this.emit('health-update', health);
    
    return health;
  }

  async performComprehensiveMaintenance() {
    console.log('🔧 Performing comprehensive maintenance...');
    
    // 1. Error resolution
    if (this.integrationState.errorManagerAvailable) {
      await this.performErrorResolution();
    }
    
    // 2. Custodial maintenance
    if (this.integrationState.custodianAvailable) {
      await this.performCustodialMaintenance();
    }
    
    // 3. File system optimization
    if (this.integrationState.fileManagementAvailable) {
      await this.performFileSystemOptimization();
    }
    
    // 4. Cross-system learning
    await this.performCrossSystemLearning();
    
    console.log('✅ Comprehensive maintenance completed');
  }

  async performErrorResolution() {
    console.log('🔧 Performing error resolution...');
    
    try {
      // Run TypeScript fixes
      execSync('node scripts/fix_typescript_issues.cjs', { encoding: 'utf8' });
      this.integrationState.coordinationMetrics.errorResolutions++;
      
      // Run lint fixes
      execSync('npm run lint -- --fix', { encoding: 'utf8' });
      this.integrationState.coordinationMetrics.errorResolutions++;
      
      console.log('✅ Error resolution completed');
    } catch (error) {
      console.warn('⚠️ Error resolution failed:', error.message);
    }
  }

  async performCustodialMaintenance() {
    console.log('🧹 Performing custodial maintenance...');
    
    try {
      // Run custodian protocol
      execSync('node scripts/governance/custodian_protocol.cjs', { encoding: 'utf8' });
      this.integrationState.coordinationMetrics.maintenanceActions++;
      
      console.log('✅ Custodial maintenance completed');
    } catch (error) {
      console.warn('⚠️ Custodial maintenance failed:', error.message);
    }
  }

  async performFileSystemOptimization() {
    console.log('📁 Performing file system optimization...');
    
    try {
      // Run file management scan
      execSync('npx tsx scripts/file_management_scan.ts', { encoding: 'utf8' });
      
      // Check if cleanup is needed
      const reportPath = path.join(this.projectRoot, 'SYSTEM_AUDIT_REPORT.json');
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        if (report.orphans?.length > 10 || report.duplicates?.length > 5) {
          console.log('⚠️ File cleanup recommended - run with CLEANUP_APPROVED file');
        }
      }
      
      this.integrationState.coordinationMetrics.fileOptimizations++;
      console.log('✅ File system optimization completed');
    } catch (error) {
      console.warn('⚠️ File system optimization failed:', error.message);
    }
  }

  async performErrorAwareCleanup() {
    console.log('🧹 Performing error-aware cleanup...');
    
    // Check for errors before cleanup
    await this.checkForErrors();
    
    if (this.integrationState.activeErrors.length > 0) {
      console.log('⚠️ Active errors detected - cleanup postponed');
      return;
    }
    
    // Perform file cleanup
    await this.performFileSystemOptimization();
    
    console.log('✅ Error-aware cleanup completed');
  }

  async performCrossSystemLearning() {
    console.log('🧠 Performing cross-system learning...');
    
    // Analyze patterns across systems
    const learningData = {
      errorPatterns: await this.analyzeErrorPatterns(),
      maintenancePatterns: await this.analyzeMaintenancePatterns(),
      filePatterns: await this.analyzeFilePatterns(),
      timestamp: new Date().toISOString()
    };
    
    // Save learning data
    const learningFile = path.join(this.projectRoot, 'data/cross_system_learning.json');
    fs.writeFileSync(learningFile, JSON.stringify(learningData, null, 2));
    
    this.integrationState.coordinationMetrics.crossSystemLearning++;
    this.emit('learning-opportunity', learningData);
    
    console.log('✅ Cross-system learning completed');
  }

  async analyzeErrorPatterns() {
    // Analyze error patterns for learning
    return {
      commonErrorTypes: [],
      resolutionSuccessRates: {},
      errorFrequency: {}
    };
  }

  async analyzeMaintenancePatterns() {
    // Analyze maintenance patterns for learning
    return {
      commonMaintenanceTasks: [],
      maintenanceFrequency: {},
      successRates: {}
    };
  }

  async analyzeFilePatterns() {
    // Analyze file patterns for learning
    return {
      commonFileIssues: [],
      cleanupFrequency: {},
      optimizationOpportunities: {}
    };
  }

  // Event handlers
  handleErrorDetected(errorData) {
    console.log('🚨 Error detected:', errorData.type);
    this.integrationState.activeErrors.push(errorData);
    this.log('Error detected', 'error', errorData);
  }

  handleMaintenanceRequired(maintenanceData) {
    console.log('🔧 Maintenance required:', maintenanceData.source);
    this.integrationState.pendingMaintenance.push(maintenanceData);
    this.log('Maintenance required', 'warning', maintenanceData);
  }

  handleFileIssueDetected(fileData) {
    console.log('📁 File issue detected');
    this.integrationState.fileIssues.push(fileData);
    this.log('File issue detected', 'warning', fileData);
  }

  handleResolutionApplied(resolutionData) {
    console.log('✅ Resolution applied');
    this.integrationState.coordinationMetrics.errorResolutions++;
    this.log('Resolution applied', 'info', resolutionData);
  }

  handleLearningOpportunity(learningData) {
    console.log('🧠 Learning opportunity identified');
    this.log('Learning opportunity', 'info', learningData);
  }

  log(message, level, data = null) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      mode: this.mode
    };
    
    // Append to log file
    const logData = fs.existsSync(this.logFile) 
      ? JSON.parse(fs.readFileSync(this.logFile, 'utf8')) 
      : [];
    logData.push(logEntry);
    fs.writeFileSync(this.logFile, JSON.stringify(logData, null, 2));
  }

  async stop() {
    console.log('🛑 Stopping integration system...');
    
    this.isRunning = false;
    
    // Clear intervals
    if (this.monitoringIntervals) {
      Object.values(this.monitoringIntervals).forEach(interval => clearInterval(interval));
    }
    
    if (this.monitoringLoop) {
      clearInterval(this.monitoringLoop);
    }
    
    // Save final state
    await this.saveState();
    
    console.log('✅ Integration system stopped');
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      mode: this.mode,
      systemHealth: this.integrationState.systemHealth,
      lastAssessment: this.integrationState.lastAssessment,
      coordinationMetrics: this.integrationState.coordinationMetrics,
      componentAvailability: {
        errorManager: this.integrationState.errorManagerAvailable,
        custodian: this.integrationState.custodianAvailable,
        fileManagement: this.integrationState.fileManagementAvailable
      }
    };
  }
}

// Main execution
async function main() {
  const integration = new ErrorCustodianFileIntegration();
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    await integration.stop();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    await integration.stop();
    process.exit(0);
  });
  
  try {
    await integration.initialize();
    
    // If not in continuous mode, exit after completion
    if (['maintenance', 'cleanup'].includes(integration.mode)) {
      await integration.stop();
      process.exit(0);
    }
    
    // Keep running for monitoring modes
    console.log('🔄 Integration system running. Press Ctrl+C to stop.');
  } catch (error) {
    console.error('❌ Integration system failed:', error.message);
    process.exit(1);
  }
}

// Export for use as module
module.exports = ErrorCustodianFileIntegration;

// Run if called directly
if (require.main === module) {
  main();
} 