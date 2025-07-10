#!/usr/bin/env node

/**
 * Unified Command System v1.0.0
 * 
 * PURPOSE: Consolidates all command-related functionality into a single unified system:
 * - Command coordination and routing
 * - Command execution optimization
 * - Command auditing and regulation
 * - Command history and monitoring
 * - System health assessment
 * 
 * CONSOLIDATES:
 * - scripts/command_coordinator.cjs (v3.0.0)
 * - scripts/command_center/command_coordinator.cjs (v2.0.0)
 * - scripts/command_audit_optimizer.cjs (v1.0.0)
 * - scripts/protocols/command_execution_optimizer.cjs
 * 
 * USAGE: node scripts/command_center/UnifiedCommandSystem.cjs <command> [options]
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

class UnifiedCommandSystem {
  constructor() {
    this.projectRoot = process.cwd();
    this.sessionId = this.generateSessionId();
    this.version = '1.0.0';
    
    // Configuration
    this.config = {
      defaultTimeout: 30000,
      maxRetries: 3,
      maxHistorySize: 1000,
      healthCheckInterval: 60000
    };
    
    // File paths
    this.paths = {
      historyFile: path.join(this.projectRoot, 'data/command_center/command_history.json'),
      healthFile: path.join(this.projectRoot, 'data/command_center/system_health.json'),
      auditFile: path.join(this.projectRoot, 'data/command_center/audit_results.json'),
      protocolsDir: path.join(this.projectRoot, 'scripts/protocols'),
      commandCenterDir: path.join(this.projectRoot, 'scripts/command_center')
    };
    
    // State management
    this.state = {
      activeCommands: new Map(),
      commandHistory: [],
      systemHealth: {},
      auditResults: {},
      lastHealthCheck: 0
    };
    
    // Initialize system
    this.initialize();
  }

  generateSessionId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `unified-command-${timestamp}-${random}`;
  }

  initialize() {
    // Ensure directories exist
    const dirs = [
      path.dirname(this.paths.historyFile),
      path.dirname(this.paths.healthFile),
      path.dirname(this.paths.auditFile)
    ];
    
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
    
    // Load existing data
    this.loadState();
  }

  loadState() {
    // Load command history
    if (fs.existsSync(this.paths.historyFile)) {
      try {
        const content = fs.readFileSync(this.paths.historyFile, 'utf8');
        this.state.commandHistory = JSON.parse(content);
      } catch (error) {
        logWarning(`Failed to load command history: ${error.message}`);
        this.state.commandHistory = [];
      }
    }
    
    // Load system health
    if (fs.existsSync(this.paths.healthFile)) {
      try {
        const content = fs.readFileSync(this.paths.healthFile, 'utf8');
        this.state.systemHealth = JSON.parse(content);
      } catch (error) {
        logWarning(`Failed to load system health: ${error.message}`);
        this.state.systemHealth = {};
      }
    }
    
    // Load audit results
    if (fs.existsSync(this.paths.auditFile)) {
      try {
        const content = fs.readFileSync(this.paths.auditFile, 'utf8');
        this.state.auditResults = JSON.parse(content);
      } catch (error) {
        logWarning(`Failed to load audit results: ${error.message}`);
        this.state.auditResults = {};
      }
    }
  }

  saveState() {
    // Save command history
    try {
      fs.writeFileSync(this.paths.historyFile, JSON.stringify(this.state.commandHistory, null, 2));
    } catch (error) {
      logWarning(`Failed to save command history: ${error.message}`);
    }
    
    // Save system health
    try {
      fs.writeFileSync(this.paths.healthFile, JSON.stringify(this.state.systemHealth, null, 2));
    } catch (error) {
      logWarning(`Failed to save system health: ${error.message}`);
    }
    
    // Save audit results
    try {
      fs.writeFileSync(this.paths.auditFile, JSON.stringify(this.state.auditResults, null, 2));
    } catch (error) {
      logWarning(`Failed to save audit results: ${error.message}`);
    }
  }

  // === COMMAND EXECUTION ===
  
  async executeCommand(command, options = {}) {
    const {
      timeout = this.config.defaultTimeout,
      retries = this.config.maxRetries,
      description = command,
      allowFailure = false,
      silent = false,
      captureOutput = true
    } = options;

    const commandId = `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    if (!silent) {
      logInfo(`Executing: ${description}`);
      logInfo(`Command: ${command}`);
      logInfo(`Timeout: ${timeout}ms`);
    }
    
    // Record command start
    this.recordCommand(command, options, 'started');
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        if (!silent) {
          logInfo(`Attempt ${attempt}/${retries}`);
        }
        
        const result = execSync(command, {
          encoding: 'utf8',
          timeout: timeout,
          stdio: captureOutput ? 'pipe' : 'inherit',
          cwd: this.projectRoot
        });
        
        // Record successful execution
        this.recordCommand(command, options, 'success');
        
        if (!silent) {
          logSuccess(`${description} completed successfully`);
        }
        
        return result;
        
      } catch (error) {
        const isTimeout = error.signal === 'SIGTERM';
        const errorMessage = isTimeout 
          ? `Command timed out after ${timeout}ms: ${command}`
          : error.message;
        
        if (!silent) {
          logWarning(`Attempt ${attempt} failed: ${errorMessage}`);
        }
        
        if (attempt === retries) {
          // Record failed execution
          this.recordCommand(command, options, 'failed', errorMessage);
          
          if (allowFailure) {
            if (!silent) {
              logWarning(`${description} failed but continuing: ${errorMessage}`);
            }
            return null;
          } else {
            if (!silent) {
              logError(`${description} failed after ${retries} attempts: ${errorMessage}`);
            }
            throw new Error(errorMessage);
          }
        }
        
        // Wait before retry
        if (attempt < retries) {
          const waitTime = Math.min(1000 * attempt, 5000);
          if (!silent) {
            logInfo(`Waiting ${waitTime}ms before retry...`);
          }
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }
  }

  async executeProtocol(protocolName, options = {}) {
    const protocolPath = path.join(this.paths.protocolsDir, `${protocolName}.cjs`);
    
    if (!fs.existsSync(protocolPath)) {
      throw new Error(`Protocol not found: ${protocolPath}`);
    }
    
    const command = `node "${protocolPath}" ${options.args ? options.args.join(' ') : ''}`;
    return this.executeCommand(command, {
      description: `${protocolName} Protocol`,
      timeout: options.timeout || 120000, // 2 minutes default for protocols
      ...options
    });
  }

  // === COMMAND ROUTING ===
  
  async routeCommand(command, args = []) {
    const commandMap = {
      anchor: { protocol: 'anchor_manager', timeout: 60000 },
      launch: { protocol: 'launch_protocol', timeout: 120000 },
      wrap: { protocol: 'wrap_protocol', timeout: 60000 },
      council: { protocol: 'convene_council_protocol', timeout: 180000 },
      audit: { protocol: 'audit_optimizer', timeout: 120000 },
      'parallel-audit': { protocol: 'parallel_cascading_audit_system', timeout: 300000 },
      precommit: { protocol: 'precommit_audit', timeout: 60000 },
      prewrap: { protocol: 'context_enabled_pre_wrap_protocol', timeout: 60000 },
      monitor: { protocol: 'user_monitoring_integration', timeout: 60000 },
      optimize: { protocol: 'typescript_optimization_system', timeout: 180000 },
      status: { protocol: 'status_assessment_protocol', timeout: 60000 },
      'run-it-back': { protocol: 'run_it_back_protocol', timeout: 60000 },
      'decision-log': { protocol: 'decision_log_protocol', timeout: 60000 },
      standards: { protocol: 'StandardsManager', timeout: 60000 }
    };
    
    const commandConfig = commandMap[command];
    if (!commandConfig) {
      throw new Error(`Unknown command: ${command}`);
    }
    
    return this.executeProtocol(commandConfig.protocol, {
      args,
      timeout: commandConfig.timeout
    });
  }

  // === COMMAND HISTORY ===
  
  recordCommand(command, options, status, error = null) {
    const record = {
      timestamp: new Date().toISOString(),
      command: command,
      options: options,
      status: status,
      error: error,
      sessionId: this.sessionId
    };
    
    this.state.commandHistory.push(record);
    
    // Keep only last N records
    if (this.state.commandHistory.length > this.config.maxHistorySize) {
      this.state.commandHistory = this.state.commandHistory.slice(-this.config.maxHistorySize);
    }
    
    this.saveState();
  }

  getCommandHistory(limit = 50) {
    return this.state.commandHistory.slice(-limit);
  }

  // === SYSTEM HEALTH ===
  
  async checkSystemHealth() {
    const now = Date.now();
    if (now - this.state.lastHealthCheck < this.config.healthCheckInterval) {
      return this.state.systemHealth;
    }
    
    logInfo('Checking system health...');
    
    const health = {
      timestamp: new Date().toISOString(),
      unifiedCommandSystem: 'healthy',
      commandCenter: 'unknown',
      protocols: 'unknown',
      fileSystem: 'unknown',
      memory: 'unknown',
      backgroundAgents: 'unknown'
    };
    
    // Check command center
    try {
      const commandCenterFiles = [
        'scripts/command_center/command_coordinator.cjs',
        'scripts/command_center/log_checker.cjs',
        'scripts/command_center/StandardsManager.cjs'
      ];
      
      const existingFiles = commandCenterFiles.filter(file => fs.existsSync(file));
      health.commandCenter = existingFiles.length === commandCenterFiles.length ? 'healthy' : 'warning';
    } catch (error) {
      health.commandCenter = 'error';
    }
    
    // Check protocols
    try {
      const protocolFiles = [
        'scripts/protocols/launch_protocol.cjs',
        'scripts/protocols/anchor_manager.cjs',
        'scripts/protocols/wrap_protocol.cjs'
      ];
      
      const existingProtocols = protocolFiles.filter(file => fs.existsSync(file));
      health.protocols = existingProtocols.length === protocolFiles.length ? 'healthy' : 'warning';
    } catch (error) {
      health.protocols = 'error';
    }
    
    // Check file system
    try {
      const testFile = path.join(this.projectRoot, '.unified_command_test');
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);
      health.fileSystem = 'healthy';
    } catch (error) {
      health.fileSystem = 'error';
    }
    
    // Check memory usage
    const memUsage = process.memoryUsage();
    const memUsageMB = Math.round(memUsage.heapUsed / 1024 / 1024);
    health.memory = memUsageMB < 500 ? 'healthy' : 'warning';
    
    // Check background agents
    try {
      const agentStatusFile = path.join(this.projectRoot, 'data/background/agent_status.json');
      if (fs.existsSync(agentStatusFile)) {
        const content = fs.readFileSync(agentStatusFile, 'utf8');
        const agentStatus = JSON.parse(content);
        const runningAgents = Object.values(agentStatus.agents || {}).filter(agent => agent.status === 'running').length;
        health.backgroundAgents = runningAgents > 0 ? 'healthy' : 'warning';
      } else {
        health.backgroundAgents = 'unknown';
      }
    } catch (error) {
      health.backgroundAgents = 'error';
    }
    
    this.state.systemHealth = health;
    this.state.lastHealthCheck = now;
    this.saveState();
    
    return health;
  }

  // === AUDIT SYSTEM ===
  
  async performAudit(target = 'all') {
    logInfo('Performing comprehensive audit...');
    
    const audit = {
      timestamp: new Date().toISOString(),
      target: target,
      results: {
        commands: {},
        protocols: {},
        system: {},
        recommendations: []
      }
    };
    
    if (target === 'commands' || target === 'all') {
      audit.results.commands = await this.auditCommands();
    }
    
    if (target === 'protocols' || target === 'all') {
      audit.results.protocols = await this.auditProtocols();
    }
    
    if (target === 'all') {
      audit.results.system = await this.auditSystemIntegration();
    }
    
    this.state.auditResults = audit;
    this.saveState();
    
    return audit;
  }

  async auditCommands() {
    const audit = {
      coordinator: {},
      individual: {},
      output: {},
      dependencies: {}
    };
    
    // Audit command coordinator
    const coordinatorPath = 'scripts/command_coordinator.cjs';
    audit.coordinator = {
      exists: fs.existsSync(coordinatorPath),
      issues: [],
      recommendations: []
    };
    
    if (!audit.coordinator.exists) {
      audit.coordinator.issues.push('Main command coordinator missing');
      audit.coordinator.recommendations.push('Consolidate command coordination into unified system');
    }
    
    // Audit individual commands
    const commandFiles = [
      'scripts/command_center/command_coordinator.cjs',
      'scripts/command_audit_optimizer.cjs',
      'scripts/protocols/command_execution_optimizer.cjs'
    ];
    
    audit.individual = {
      files: commandFiles.map(file => ({
        file,
        exists: fs.existsSync(file),
        size: fs.existsSync(file) ? fs.statSync(file).size : 0
      })),
      issues: [],
      recommendations: []
    };
    
    const missingFiles = audit.individual.files.filter(f => !f.exists);
    if (missingFiles.length > 0) {
      audit.individual.issues.push(`${missingFiles.length} command files missing`);
    }
    
    return audit;
  }

  async auditProtocols() {
    const audit = {
      protocols: [],
      issues: [],
      recommendations: []
    };
    
    if (!fs.existsSync(this.paths.protocolsDir)) {
      audit.issues.push('Protocols directory missing');
      return audit;
    }
    
    const protocolFiles = fs.readdirSync(this.paths.protocolsDir)
      .filter(file => file.endsWith('.cjs'))
      .map(file => ({
        file,
        path: path.join(this.paths.protocolsDir, file),
        size: fs.statSync(path.join(this.paths.protocolsDir, file)).size
      }));
    
    audit.protocols = protocolFiles;
    
    if (protocolFiles.length === 0) {
      audit.issues.push('No protocol files found');
    }
    
    return audit;
  }

  async auditSystemIntegration() {
    const audit = {
      integration: {},
      issues: [],
      recommendations: []
    };
    
    // Check integration points
    const integrationPoints = [
      'data/command_center/command_history.json',
      'data/command_center/system_health.json',
      'scripts/command_coordinator.cjs'
    ];
    
    audit.integration = {
      points: integrationPoints.map(point => ({
        point,
        exists: fs.existsSync(point),
        accessible: fs.existsSync(point) ? fs.accessSync(point, fs.constants.R_OK) : false
      }))
    };
    
    const missingPoints = audit.integration.points.filter(p => !p.exists);
    if (missingPoints.length > 0) {
      audit.issues.push(`${missingPoints.length} integration points missing`);
    }
    
    return audit;
  }

  // === MAIN EXECUTION ===
  
  async execute() {
    const args = process.argv.slice(2);
    const command = args[0];
    const options = args.slice(1);
    
    log(`${colors.bright}${colors.magenta}🚀 Unified Command System v${this.version}${colors.reset}`);
    log(`${colors.yellow}Session ID: ${this.sessionId}${colors.reset}`);
    log(`${colors.yellow}Timestamp: ${new Date().toISOString()}${colors.reset}\n`);
    
    try {
      switch (command) {
        case 'health':
          const health = await this.checkSystemHealth();
          log('\n📊 System Health Report:');
          Object.entries(health).forEach(([component, status]) => {
            if (component === 'timestamp') return;
            const statusIcon = status === 'healthy' ? '✅' : status === 'warning' ? '⚠️' : '❌';
            log(`${statusIcon} ${component}: ${status}`);
          });
          break;
          
        case 'history':
          const limit = parseInt(options[0]) || 20;
          const history = this.getCommandHistory(limit);
          log(`\n📋 Command History (last ${history.length}):`);
          history.forEach(record => {
            const statusIcon = record.status === 'success' ? '✅' : record.status === 'failed' ? '❌' : '⏳';
            const time = new Date(record.timestamp).toLocaleTimeString();
            log(`${statusIcon} [${time}] ${record.command} (${record.status})`);
          });
          break;
          
        case 'audit':
          const target = options[0] || 'all';
          const auditResult = await this.performAudit(target);
          log('\n🔍 Audit Results:');
          log(`Target: ${auditResult.target}`);
          log(`Timestamp: ${auditResult.timestamp}`);
          
          if (auditResult.results.commands) {
            const cmdIssues = auditResult.results.commands.coordinator?.issues?.length || 0;
            const indIssues = auditResult.results.commands.individual?.issues?.length || 0;
            log(`Command Issues: ${cmdIssues + indIssues}`);
          }
          
          if (auditResult.results.protocols) {
            const protoIssues = auditResult.results.protocols.issues?.length || 0;
            log(`Protocol Issues: ${protoIssues}`);
          }
          break;
          
        case 'launch':
          logInfo('Executing launch protocol...');
          await this.routeCommand('launch', options);
          break;
          
        case 'anchor':
          logInfo('Executing anchor protocol...');
          await this.routeCommand('anchor', options);
          break;
          
        case 'wrap':
          logInfo('Executing wrap protocol...');
          await this.routeCommand('wrap', options);
          break;
          
        case 'council':
          logInfo('Executing council protocol...');
          await this.routeCommand('council', options);
          break;
          
        case 'audit-protocol':
          logInfo('Executing audit protocol...');
          await this.routeCommand('audit', options);
          break;
          
        default:
          if (command) {
            // Try to route as a protocol command
            try {
              await this.routeCommand(command, options);
            } catch (error) {
              // If routing fails, execute as custom command
              logInfo(`Executing custom command: ${command}`);
              await this.executeCommand(command, {
                description: `Custom command: ${command}`,
                timeout: 60000,
                allowFailure: false
              });
            }
          } else {
            this.showHelp();
            process.exit(1);
          }
      }
      
      logSuccess('Unified command system execution completed');
      
    } catch (error) {
      logError(`Unified command system failed: ${error.message}`);
      process.exit(1);
    }
  }

  showHelp() {
    log(`${colors.bright}📋 Unified Command System v${this.version}${colors.reset}`);
    log('=====================================\n');
    log('USAGE: node scripts/command_center/UnifiedCommandSystem.cjs <command> [options]\n');
    log('COMMANDS:');
    log('  health              - Check system health');
    log('  history [limit]     - Show command history');
    log('  audit [target]      - Perform system audit');
    log('  launch [options]    - Execute launch protocol');
    log('  anchor [options]    - Execute anchor protocol');
    log('  wrap [options]      - Execute wrap protocol');
    log('  council [options]   - Execute council protocol');
    log('  audit-protocol      - Execute audit protocol');
    log('  <protocol> [options] - Execute any protocol directly\n');
    log('EXAMPLES:');
    log('  node scripts/command_center/UnifiedCommandSystem.cjs health');
    log('  node scripts/command_center/UnifiedCommandSystem.cjs history 50');
    log('  node scripts/command_center/UnifiedCommandSystem.cjs audit all');
    log('  node scripts/command_center/UnifiedCommandSystem.cjs launch --fast');
    log('  node scripts/command_center/UnifiedCommandSystem.cjs anchor');
  }
}

// Main execution
if (require.main === module) {
  const system = new UnifiedCommandSystem();
  system.execute().catch(error => {
    logError(`Unified Command System Error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = UnifiedCommandSystem; 