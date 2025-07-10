#!/usr/bin/env node

/**
 * Command Coordinator v2.0.0
 * 
 * PURPOSE: Central command routing system that delegates to specific protocols
 * without creating circular dependencies or overlapping responsibilities.
 * 
 * PROTOCOL RESPONSIBILITIES:
 * - anchor: System analysis and health checks only
 * - launch: Session initialization and context setup
 * - wrap: Session completion and context preservation
 * - council: Governance and decision-making
 * - audit: Content quality and format regulation
 * 
 * USAGE: node scripts/command_coordinator.cjs <command> [options]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Committee integration
// const { Committee } = require('../src/core/governance');
// const committee = new Committee();

// Import new streamlined components
const GitManager = require('./git/git_manager.cjs');
const SystemReportingManager = require('./reporting/system_reporting_manager.cjs');
const HealthMonitor = require('./monitoring/health_monitor.cjs');

const COMMAND_CENTER_LOG = path.join(process.cwd(), 'data/command_center/command_history.json');

// Command coordination to prevent conflicts
function checkCommandConflicts(command, options) {
  try {
    if (!fs.existsSync(COMMAND_CENTER_LOG)) {
      return null;
    }
    
    const history = JSON.parse(fs.readFileSync(COMMAND_CENTER_LOG, 'utf8'));
    const recentCommands = history.commands?.slice(-3) || [];
    
    // Check for conflicting commands
    const conflictingCommands = {
      'anchor': ['launch'],
      'launch': ['anchor']
    };
    
    const conflicts = conflictingCommands[command] || [];
    const recentConflict = recentCommands.find(cmd => 
      conflicts.includes(cmd.command) && 
      cmd.status === 'started' && 
      new Date(cmd.timestamp) > new Date(Date.now() - 120000) // Within last 2 minutes
    );
    
    if (recentConflict) {
      return {
        conflictingCommand: recentConflict.command,
        timestamp: recentConflict.timestamp,
        message: `⚠️  ${command} command conflicts with recent ${recentConflict.command} command. Please wait for ${recentConflict.command} to complete or use --force to override.`
      };
    }
    
    return null;
  } catch (error) {
    // If we can't check conflicts, allow execution
    return null;
  }
}

function logCommandCenter(command, options, status) {
  const entry = {
    timestamp: new Date().toISOString(),
    command,
    options,
    status
  };
  const dir = path.dirname(COMMAND_CENTER_LOG);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  let logData = {
    last_updated: new Date().toISOString(),
    session_id: `command_execution_${Date.now()}`,
    commands: []
  };
  
  if (fs.existsSync(COMMAND_CENTER_LOG)) {
    try { 
      logData = JSON.parse(fs.readFileSync(COMMAND_CENTER_LOG, 'utf8')); 
      if (!logData.commands) {
        logData.commands = [];
      }
    } catch (error) {
      console.warn('Warning: Could not parse existing command history, creating new one');
    }
  }
  
  logData.commands.push(entry);
  logData.last_updated = new Date().toISOString();
  
  fs.writeFileSync(COMMAND_CENTER_LOG, JSON.stringify(logData, null, 2));
}

class CommandCoordinator {
  constructor() {
    this.projectRoot = process.cwd();
    this.protocolsDir = path.join(this.projectRoot, 'scripts/protocols');
    this.commandCenterDir = path.join(this.projectRoot, 'scripts/command_center');
    
    // Initialize streamlined components
    this.gitManager = new GitManager();
    this.reportingManager = new SystemReportingManager();
    this.healthMonitor = new HealthMonitor();
    
    this.commands = {
      anchor: 'anchor_manager.cjs',
      launch: 'launch_protocol.cjs',
      wrap: 'wrap_protocol.cjs',
      council: 'convene_council_protocol.cjs',
      audit: 'audit_optimizer.cjs',
      precommit: 'precommit_audit.cjs',
      prewrap: 'context_enabled_pre_wrap_protocol.cjs',
      monitor: 'user_monitoring_integration.cjs',
      optimize: 'typescript_optimization_system.cjs',
      status: 'status_assessment_protocol.cjs',
      'run-it-back': 'run_it_back_protocol.cjs',
      'decision-log': 'decision_log_protocol.cjs',
      standards: 'StandardsManager.cjs'
    };
  }

  async execute() {
    const startTime = Date.now();
    const args = process.argv.slice(2);
    const command = args[0];
    const options = args.slice(1);

    if (!command) {
      this.showHelp();
      return;
    }

    // Check for command conflicts
    const conflict = checkCommandConflicts(command, options);
    if (conflict && !options.includes('--force')) {
      console.error(conflict.message);
      console.log(`Last ${conflict.conflictingCommand} command started at: ${conflict.timestamp}`);
      process.exit(1);
    }

    // Pre-execution checks
    await this.preExecutionChecks(command, options);

    logCommandCenter(command, options, 'started');
    console.log(`🚀 Command Coordinator v2.0.0`);
    console.log(`📋 Executing: ${command}`);
    console.log(`⚙️  Options: ${options.join(' ')}`);
    
    if (conflict && options.includes('--force')) {
      console.log('⚠️  Force mode: Overriding command conflict check');
    }
    
    console.log('');

    try {
      switch (command) {
        case 'anchor':
          await this.executeAnchor(options);
          break;
        case 'launch':
          await this.executeLaunch(options);
          break;
        case 'wrap':
          await this.executeWrap(options);
          break;
        case 'council':
          await this.executeCouncil(options);
          break;
        case 'audit':
          await this.executeAudit(options);
          break;
        case 'precommit':
          await this.executePrecommit(options);
          break;
        case 'prewrap':
          await this.executePrewrap(options);
          break;
        case 'monitor':
          await this.executeMonitor(options);
          break;
        case 'optimize':
          await this.executeOptimize(options);
          break;
        case 'status':
          await this.executeStatus(options);
          break;
        case 'code-czar':
          await this.executeCodeCzarIntegration(options);
          break;
        case 'error-custodian-file':
          await this.executeErrorCustodianFileIntegration(options);
          break;
        case 'run-it-back':
          await this.executeRunItBack(options);
          break;
        case 'decision-log':
          await this.executeDecisionLog(options);
          break;
        case 'standards':
          await this.executeStandards(options);
          break;
        default:
          console.error(`❌ Unknown command: ${command}`);
          this.showHelp();
          process.exit(1);
      }
      // Post-execution processing
      await this.postExecutionProcessing(command, options, startTime);

      logCommandCenter(command, options, 'success');
    } catch (error) {
      logCommandCenter(command, options, 'failed');
      console.error(`❌ Command execution failed: ${error.message}`);
      
      // Handle command error
      await this.handleCommandError(command, error, { options, startTime });
      
      process.exit(1);
    }
  }

  async preExecutionChecks(command, options) {
    console.log('🔍 Running pre-execution checks...');
    
    try {
      // Check system health
      const health = await this.healthMonitor.monitorSystemHealth();
      if (health.status === 'critical') {
        console.warn('⚠️  System health is critical - proceeding with caution');
      }
      
      // Check git status
      const gitStatus = await this.gitManager.getGitStatus();
      if (gitStatus.hasChanges && gitStatus.totalChanges > 100) {
        console.warn('⚠️  Large number of uncommitted changes detected');
      }
      
      console.log('✅ Pre-execution checks completed');
    } catch (error) {
      console.warn('⚠️  Pre-execution checks failed:', error.message);
    }
  }

  async postExecutionProcessing(command, options, startTime) {
    const endTime = Date.now();
    console.log('🔄 Running post-execution processing...');
    
    try {
      // Generate comprehensive report
      const results = { success: true, duration: endTime - startTime };
      const report = await this.reportingManager.generateCommandReport(command, options, results);
      
      // Auto-commit changes
      await this.gitManager.autoCommit(command, options, results);
      
      // Update system health
      await this.healthMonitor.monitorSystemHealth();
      
      console.log('✅ Post-execution processing completed');
    } catch (error) {
      console.warn('⚠️  Post-execution processing failed:', error.message);
    }
  }

  async handleCommandError(command, error, context) {
    console.log('🛠️  Handling command error...');
    
    try {
      const errorReport = {
        timestamp: new Date().toISOString(),
        command,
        error: error.message,
        stack: error.stack,
        context
      };
      
      // Log error to health monitor
      await this.healthMonitor.storeAlerts([{
        level: 'error',
        message: `Command ${command} failed: ${error.message}`,
        timestamp: errorReport.timestamp,
        details: errorReport
      }]);
      
      console.log('✅ Error handling completed');
    } catch (error) {
      console.warn('⚠️  Error handling failed:', error.message);
    }
  }

  async executeAnchor(options) {
    console.log('🔍 Executing Anchor Protocol (System Analysis)');
    const protocolPath = path.join(this.protocolsDir, this.commands.anchor);
    this.executeProtocol(protocolPath, options);
  }

  async executeLaunch(options) {
    console.log('🚀 Executing Launch Protocol (Session Initialization)');
    const protocolPath = path.join(this.protocolsDir, this.commands.launch);
    this.executeProtocol(protocolPath, options);
  }

  async executeWrap(options) {
    console.log('📦 Executing Wrap Protocol (Session Completion)');
    const protocolPath = path.join(this.protocolsDir, this.commands.wrap);
    this.executeProtocol(protocolPath, options);
  }

  async executeCouncil(options) {
    console.log('🏛️  Executing Council Protocol (Governance)');
    const protocolPath = path.join(this.protocolsDir, this.commands.council);
    this.executeProtocol(protocolPath, options);
  }

  async executeAudit(options) {
    console.log('🔍 Executing Audit Protocol (Content Regulation)');
    const protocolPath = path.join(this.protocolsDir, this.commands.audit);
    this.executeProtocol(protocolPath, options);
  }

  async executePrecommit(options) {
    console.log('✅ Executing Precommit Protocol (Pre-commit Checks)');
    const protocolPath = path.join(this.projectRoot, 'scripts/governance', this.commands.precommit);
    this.executeProtocol(protocolPath, options);
  }

  async executePrewrap(options) {
    console.log('📋 Executing Prewrap Protocol (Pre-wrap Preparation)');
    const protocolPath = path.join(this.protocolsDir, this.commands.prewrap);
    this.executeProtocol(protocolPath, options);
  }

  async executeMonitor(options) {
    console.log('🔍 Executing User Monitoring Protocol (Real-time User Analytics)');
    const protocolPath = path.join(this.projectRoot, 'scripts/monitoring', this.commands.monitor);
    this.executeProtocol(protocolPath, options);
  }

  async executeOptimize(options) {
    console.log('🔧 Executing TypeScript Optimization Protocol (Error Mitigation & Effectiveness Tracking)');
    const protocolPath = path.join(this.projectRoot, 'scripts/optimization', this.commands.optimize);
    this.executeProtocol(protocolPath, options);
  }

  async executeStatus(options) {
    console.log('🔍 Executing Status Assessment Protocol (Holon & Level Status Checking)');
    const protocolPath = path.join(this.protocolsDir, this.commands.status);
    
    // Handle status assessment command routing
    if (options[0] === 'assessment' && options[1]) {
      // Remove 'assessment' and pass the target directly
      const target = options[1];
      const remainingOptions = options.slice(2);
      this.executeProtocol(protocolPath, [target, ...remainingOptions]);
    } else {
      this.executeProtocol(protocolPath, options);
    }
  }

  async executeCodeCzarIntegration(options) {
    console.log('👑 Executing Code Czar and Executive Committee Integration (Language & Compilation Governance)');
    const integrationPath = path.join(this.projectRoot, 'scripts/integration/code_czar_executive_integration.cjs');
    this.executeProtocol(integrationPath, options);
  }

  async executeErrorCustodianFileIntegration(options) {
    console.log('🔗 Executing Error Manager, Custodian, and File Manager Integration (System Health Coordination)');
    const integrationPath = path.join(this.projectRoot, 'scripts/integration/error_custodian_file_integration.cjs');
    this.executeProtocol(integrationPath, options);
  }

  async executeRunItBack(options) {
    console.log('🔁 Executing Run It Back Protocol (Session & Task Summary)');
    const protocolPath = path.join(this.protocolsDir, this.commands['run-it-back']);
    this.executeProtocol(protocolPath, options);
  }

  async executeDecisionLog(options) {
    console.log('📋 Executing Decision Log Protocol (Decision Tracking & Agenda Management)');
    const protocolPath = path.join(this.protocolsDir, this.commands['decision-log']);
    this.executeProtocol(protocolPath, options);
  }

  async executeStandards(options) {
    console.log('📋 Executing Standards Manager (Standards Compliance & Harmonization)');
    const protocolPath = path.join(this.commandCenterDir, this.commands.standards);
    this.executeProtocol(protocolPath, options);
  }

  executeProtocol(protocolPath, options) {
    if (!fs.existsSync(protocolPath)) {
      throw new Error(`Protocol not found: ${protocolPath}`);
    }

    const command = `node "${protocolPath}" ${options.join(' ')}`;
    console.log(`📋 Executing: ${command}`);
    
    try {
      execSync(command, { 
        stdio: 'inherit', 
        cwd: this.projectRoot,
        env: { ...process.env, COMMAND_COORDINATOR: 'true' }
      });
    } catch (error) {
      throw new Error(`Protocol execution failed: ${error.message}`);
    }
  }

  showHelp() {
    console.log(`
📋 Command Coordinator v2.0.0
==============================

USAGE: node scripts/command_coordinator.cjs <command> [options]

COMMANDS:
  anchor     System analysis and health checks
  launch     Session initialization and context setup
  wrap       Session completion and context preservation
  council    Governance and decision-making
  audit      Content quality and format regulation
  precommit  Pre-commit validation and checks
  prewrap    Pre-wrap preparation and context preservation
  monitor    Real-time user monitoring and analytics
  optimize   TypeScript error mitigation and optimization
  code-czar  Code Czar and Executive Committee integration
  error-custodian-file Error Manager, Custodian, and File Manager integration
  run-it-back Session & Task Summary
  standards  Standards compliance and harmonization

EXAMPLES:
  node scripts/command_coordinator.cjs anchor
  node scripts/command_coordinator.cjs launch --annihilate
  node scripts/command_coordinator.cjs wrap --preserve-context
  node scripts/command_coordinator.cjs council --urgent
  node scripts/command_coordinator.cjs audit --comprehensive
  node scripts/command_coordinator.cjs precommit
  node scripts/command_coordinator.cjs prewrap
  node scripts/command_coordinator.cjs monitor start
  node scripts/command_coordinator.cjs monitor status
  node scripts/command_coordinator.cjs optimize start
  node scripts/command_coordinator.cjs optimize report
  node scripts/command_coordinator.cjs code-czar start
  node scripts/command_coordinator.cjs code-czar status
  node scripts/command_coordinator.cjs code-czar report
  node scripts/command_coordinator.cjs error-custodian-file --mode=monitor
  node scripts/command_coordinator.cjs error-custodian-file --mode=maintenance
  node scripts/command_coordinator.cjs error-custodian-file --mode=cleanup
  node scripts/command_coordinator.cjs run-it-back
  node scripts/command_coordinator.cjs standards status
  node scripts/command_coordinator.cjs standards check
  node scripts/command_coordinator.cjs standards harmonize

PROTOCOL RESPONSIBILITIES:
  • anchor: System analysis only - no session management
  • launch: Session initialization - creates new sessions
  • wrap: Session completion - preserves context and ends sessions
  • council: Governance - decision making and oversight
  • audit: Content regulation - quality and format control
  • precommit: Pre-commit validation
  • prewrap: Pre-wrap preparation
  • monitor: Real-time user monitoring and analytics
  • optimize: TypeScript error mitigation and effectiveness tracking
  • code-czar: Language and compilation governance with executive oversight
  • error-custodian-file: System health coordination between error management, custodial maintenance, and file management
  • standards: System-wide standards compliance, harmonization, and council integration
`);
  }
}

// Execute if run directly
if (require.main === module) {
  const coordinator = new CommandCoordinator();
  coordinator.execute().catch(error => {
    console.error('❌ Command Coordinator Error:', error.message);
    process.exit(1);
  });
}

module.exports = CommandCoordinator; 