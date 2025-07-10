#!/usr/bin/env node

/**
 * Command Coordinator v2.0.0
 * 
 * PURPOSE: Central command routing and execution with timeout management
 * - Prevents command stalling with configurable timeouts
 * - Manages command conflicts and resource allocation
 * - Tracks command history and execution status
 * - Provides error handling and retry mechanisms
 * 
 * USAGE: node scripts/command_center/command_coordinator.cjs [command] [options]
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

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

class CommandCoordinator {
  constructor() {
    this.timeout = 30000; // 30 second default timeout
    this.maxRetries = 3;
    this.commandHistory = [];
    this.activeCommands = new Map();
    this.projectRoot = process.cwd();
    this.historyFile = path.join(this.projectRoot, 'data', 'command_center', 'command_history.json');
    
    // Ensure command history directory exists
    const historyDir = path.dirname(this.historyFile);
    if (!fs.existsSync(historyDir)) {
      fs.mkdirSync(historyDir, { recursive: true });
    }
  }

  /**
   * Execute a command with timeout and error handling
   */
  executeCommand(command, options = {}) {
    const timeout = options.timeout || this.timeout;
    const retries = options.retries || this.maxRetries;
    const description = options.description || command;
    const allowFailure = options.allowFailure || false;
    
    const commandId = `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logInfo(`Executing: ${description}`);
    logInfo(`Command: ${command}`);
    logInfo(`Timeout: ${timeout}ms`);
    
    // Record command start
    this.recordCommand(command, options, 'started');
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        logInfo(`Attempt ${attempt}/${retries}`);
        
        const result = execSync(command, {
          encoding: 'utf8',
          timeout: timeout,
          stdio: 'pipe',
          cwd: this.projectRoot
        });
        
        // Record successful execution
        this.recordCommand(command, options, 'success');
        logSuccess(`${description} completed successfully`);
        
        return result;
        
      } catch (error) {
        const isTimeout = error.signal === 'SIGTERM';
        const errorMessage = isTimeout 
          ? `Command timed out after ${timeout}ms: ${command}`
          : error.message;
        
        logWarning(`Attempt ${attempt} failed: ${errorMessage}`);
        
        if (attempt === retries) {
          // Record failed execution
          this.recordCommand(command, options, 'failed', errorMessage);
          
          if (allowFailure) {
            logWarning(`${description} failed but continuing: ${errorMessage}`);
            return null;
          } else {
            logError(`${description} failed after ${retries} attempts: ${errorMessage}`);
            throw new Error(errorMessage);
          }
        }
        
        // Wait before retry
        if (attempt < retries) {
          const waitTime = Math.min(1000 * attempt, 5000); // Exponential backoff, max 5s
          logInfo(`Waiting ${waitTime}ms before retry...`);
          setTimeout(() => {}, waitTime);
        }
      }
    }
  }

  /**
   * Execute a command in background with monitoring
   */
  executeBackgroundCommand(command, options = {}) {
    const timeout = options.timeout || this.timeout;
    const description = options.description || command;
    
    logInfo(`Starting background command: ${description}`);
    
    return new Promise((resolve, reject) => {
      const process = spawn(command, [], {
        stdio: ['pipe', 'pipe', 'pipe'],
        detached: true,
        cwd: this.projectRoot
      });
      
      let output = '';
      let errorOutput = '';
      
      // Set timeout
      const timeoutId = setTimeout(() => {
        process.kill('SIGTERM');
        reject(new Error(`Background command timed out after ${timeout}ms: ${command}`));
      }, timeout);
      
      process.stdout.on('data', (data) => {
        output += data.toString();
        logInfo(`[${description}] ${data.toString().trim()}`);
      });
      
      process.stderr.on('data', (data) => {
        errorOutput += data.toString();
        logWarning(`[${description}] ${data.toString().trim()}`);
      });
      
      process.on('close', (code) => {
        clearTimeout(timeoutId);
        
        if (code === 0) {
          logSuccess(`Background command completed: ${description}`);
          resolve({ output, errorOutput, code });
        } else {
          const error = new Error(`Background command failed with code ${code}: ${command}`);
          logError(`Background command failed: ${description}`);
          reject(error);
        }
      });
      
      process.on('error', (error) => {
        clearTimeout(timeoutId);
        logError(`Background command error: ${description} - ${error.message}`);
        reject(error);
      });
    });
  }

  /**
   * Record command execution in history
   */
  recordCommand(command, options, status, error = null) {
    const record = {
      timestamp: new Date().toISOString(),
      command: command,
      options: options,
      status: status,
      error: error
    };
    
    this.commandHistory.push(record);
    
    // Save to file
    try {
      let history = [];
      if (fs.existsSync(this.historyFile)) {
        const content = fs.readFileSync(this.historyFile, 'utf8');
        history = JSON.parse(content);
      }
      
      history.push(record);
      
      // Keep only last 1000 records
      if (history.length > 1000) {
        history = history.slice(-1000);
      }
      
      fs.writeFileSync(this.historyFile, JSON.stringify(history, null, 2));
    } catch (error) {
      logWarning(`Failed to save command history: ${error.message}`);
    }
  }

  /**
   * Get command history
   */
  getCommandHistory(limit = 50) {
    try {
      if (fs.existsSync(this.historyFile)) {
        const content = fs.readFileSync(this.historyFile, 'utf8');
        const history = JSON.parse(content);
        return history.slice(-limit);
      }
    } catch (error) {
      logWarning(`Failed to load command history: ${error.message}`);
    }
    return [];
  }

  /**
   * Check system health
   */
  checkSystemHealth() {
    logInfo('Checking system health...');
    
    const health = {
      commandCoordinator: 'healthy',
      backgroundAgents: 'unknown',
      fileSystem: 'unknown',
      memory: 'unknown'
    };
    
    // Check background agents
    try {
      const agentStatusFile = path.join(this.projectRoot, 'data', 'background', 'agent_status.json');
      if (fs.existsSync(agentStatusFile)) {
        const content = fs.readFileSync(agentStatusFile, 'utf8');
        const agentStatus = JSON.parse(content);
        const runningAgents = Object.values(agentStatus.agents).filter(agent => agent.status === 'running').length;
        health.backgroundAgents = runningAgents > 0 ? 'healthy' : 'warning';
      }
    } catch (error) {
      health.backgroundAgents = 'error';
    }
    
    // Check file system
    try {
      const testFile = path.join(this.projectRoot, '.command_coordinator_test');
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
    
    return health;
  }
}

// Main execution
async function main() {
  const coordinator = new CommandCoordinator();
  const command = process.argv[2];
  const options = process.argv.slice(3);
  
  // Check for force flag
  const forceMode = options.includes('--force');
  
  log(`${colors.bright}${colors.magenta}🚀 Command Coordinator v2.0.0${colors.reset}`);
  log(`${colors.yellow}Timestamp: ${new Date().toISOString()}${colors.reset}\n`);
  
  try {
    switch (command) {
      case 'audit':
        logInfo('Running command center audit...');
        const health = coordinator.checkSystemHealth();
        log('\n📊 System Health Report:');
        Object.entries(health).forEach(([component, status]) => {
          const statusIcon = status === 'healthy' ? '✅' : status === 'warning' ? '⚠️' : '❌';
          log(`${statusIcon} ${component}: ${status}`);
        });
        
        const history = coordinator.getCommandHistory(10);
        log(`\n📋 Recent Commands: ${history.length}`);
        history.forEach(record => {
          const statusIcon = record.status === 'success' ? '✅' : record.status === 'failed' ? '❌' : '⏳';
          log(`${statusIcon} ${record.command} (${record.status})`);
        });
        break;
        
      case 'health':
        const systemHealth = coordinator.checkSystemHealth();
        log('\n📊 System Health:');
        Object.entries(systemHealth).forEach(([component, status]) => {
          const statusIcon = status === 'healthy' ? '✅' : status === 'warning' ? '⚠️' : '❌';
          log(`${statusIcon} ${component}: ${status}`);
        });
        break;
        
      case 'history':
        const limit = parseInt(options[0]) || 20;
        const commandHistory = coordinator.getCommandHistory(limit);
        log(`\n📋 Command History (last ${commandHistory.length}):`);
        commandHistory.forEach(record => {
          const statusIcon = record.status === 'success' ? '✅' : record.status === 'failed' ? '❌' : '⏳';
          const time = new Date(record.timestamp).toLocaleTimeString();
          log(`${statusIcon} [${time}] ${record.command} (${record.status})`);
        });
        break;
        
      case 'anchor':
        logInfo('Executing anchor command...');
        try {
          const AnchorManager = require('../protocols/anchor_manager.cjs');
          const anchorManager = new AnchorManager();
          const result = await anchorManager.executeAnchorCommand();
          
          if (result.success) {
            logSuccess(`Anchor command completed successfully in ${result.executionTime}ms`);
          } else {
            logError(`Anchor command failed after ${result.executionTime}ms`);
          }
        } catch (error) {
          logError(`Failed to execute anchor command: ${error.message}`);
        }
        break;
        
      case 'launch':
        logInfo('Executing launch protocol...');
        try {
          // Pass force flag to launch protocol if specified
          const launchCommand = forceMode 
            ? 'node scripts/protocols/launch_protocol.cjs --force'
            : 'node scripts/protocols/launch_protocol.cjs';
            
          const result = coordinator.executeCommand(launchCommand, {
            description: 'Launch Protocol',
            timeout: 120000, // 2 minutes for launch protocol
            allowFailure: false
          });
          
          if (result) {
            logSuccess('Launch protocol completed successfully');
          }
        } catch (error) {
          logError(`Launch protocol failed: ${error.message}`);
        }
        break;
        
      case 'logs':
        logInfo('Running comprehensive log check...');
        try {
          const LogChecker = require('./log_checker.cjs');
          const logChecker = new LogChecker();
          const logResult = logChecker.run();
          
          if (logResult.success) {
            logSuccess(`Log check completed with ${logResult.healthScore}% health score`);
          } else {
            logError(`Log check failed: ${logResult.error}`);
          }
        } catch (error) {
          logError(`Failed to run log check: ${error.message}`);
        }
        break;
        
      default:
        if (command) {
          // Execute custom command
          await coordinator.executeCommand(command, {
            description: `Custom command: ${command}`,
            timeout: 60000, // 60 seconds for custom commands
            allowFailure: false
          });
        } else {
          logError('No command specified');
          logInfo('Available commands: audit, health, history, logs, or custom command');
          logInfo('Usage: node scripts/command_center/command_coordinator.cjs [command] [options]');
          process.exit(1);
        }
    }
    
    logSuccess('Command coordinator execution completed');
    
  } catch (error) {
    logError(`Command coordinator failed: ${error.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = CommandCoordinator; 