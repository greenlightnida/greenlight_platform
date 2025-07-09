#!/usr/bin/env node

/**
 * Command Coordinator
 * 
 * PURPOSE: Unified management of all system commands to ensure they work together
 * without conflicts. Provides proper timing and coordination for launch, anchor,
 * checkpoint, prewrap, and wrap operations.
 * 
 * USAGE: node scripts/command_coordinator.cjs [command] [options]
 * 
 * COMMANDS:
 * - launch: Start new session with full context awareness
 * - anchor: Quick system health check (for transitions)
 * - checkpoint: Comprehensive analysis including governance
 * - prewrap: Prepare for session end with context preservation
 * - wrap: Complete session with full documentation
 * 
 * FEATURES:
 * - Prevents command conflicts
 * - Manages timing and dependencies
 * - Provides unified interface
 * - Handles errors gracefully
 * - Coordinates background processes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class CommandCoordinator {
  constructor() {
    this.projectRoot = process.cwd();
    this.commands = {
      launch: 'scripts/protocols/launch_protocol.cjs',
      'launch-annihilate': 'scripts/protocols/launch_annihilate_protocol.cjs',
      anchor: 'scripts/anchor_manager.cjs',
      checkpoint: 'scripts/checkpoint_manager.cjs',
      prewrap: 'scripts/protocols/context_enabled_pre_wrap_protocol.cjs',
      wrap: 'scripts/protocols/context_enabled_wrap_protocol.cjs',
      'wrap-annihilate': 'scripts/protocols/wrap_annihilate_protocol.cjs'
    };
    
    this.runningProcesses = new Map();
    this.commandHistory = [];
  }

  async execute() {
    const args = process.argv.slice(2);
    const command = args[0];
    const options = args.slice(1);

    if (!command) {
      this.showHelp();
      return;
    }

    if (!this.commands[command]) {
      console.error(`❌ Unknown command: ${command}`);
      this.showHelp();
      process.exit(1);
    }

    console.log(`🚀 Command Coordinator - Executing: ${command.toUpperCase()}`);
    console.log('==================================================');
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log(`Command: ${command}`);
    console.log(`Options: ${options.join(' ')}`);
    console.log('');

    try {
      // Check for conflicts
      await this.checkForConflicts(command);
      
      // Execute the command
      await this.executeCommand(command, options);
      
      // Record command execution
      this.recordCommandExecution(command, options);
      
    } catch (error) {
      console.error(`❌ Command execution failed: ${error.message}`);
      process.exit(1);
    }
  }

  async checkForConflicts(command) {
    console.log('🔍 Checking for command conflicts...');
    
    // Check if any conflicting processes are running
    const conflictingCommands = this.getConflictingCommands(command);
    
    for (const conflictingCommand of conflictingCommands) {
      if (this.runningProcesses.has(conflictingCommand)) {
        console.log(`⚠️  ${conflictingCommand} is already running`);
        console.log('   Waiting for it to complete...');
        
        // Wait for conflicting command to complete
        await this.waitForCommandCompletion(conflictingCommand);
      }
    }
    
    // Check for system resource conflicts
    await this.checkSystemResources();
    
    console.log('✅ No conflicts detected');
  }

  getConflictingCommands(command) {
    const conflicts = {
      launch: ['checkpoint', 'prewrap', 'wrap', 'wrap-annihilate'],
      'launch-annihilate': ['checkpoint', 'prewrap', 'wrap', 'wrap-annihilate'],
      anchor: [], // Anchor doesn't conflict with anything
      checkpoint: ['launch', 'launch-annihilate'],
      prewrap: ['launch', 'launch-annihilate', 'checkpoint'],
      wrap: ['launch', 'launch-annihilate', 'checkpoint', 'prewrap'],
      'wrap-annihilate': ['launch', 'launch-annihilate', 'checkpoint', 'prewrap', 'wrap']
    };
    
    return conflicts[command] || [];
  }

  async waitForCommandCompletion(command) {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (!this.runningProcesses.has(command)) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 1000);
      
      // Timeout after 60 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        console.log(`⚠️  Timeout waiting for ${command} to complete`);
        resolve();
      }, 60000);
    });
  }

  async checkSystemResources() {
    try {
      // Check available memory
      const memInfo = require('os').freemem();
      const memGB = Math.round(memInfo / (1024 * 1024 * 1024) * 100) / 100;
      
      if (memGB < 1) {
        console.log(`⚠️  Low memory available: ${memGB}GB`);
      }
      
      // Check CPU usage
      const cpuUsage = require('os').loadavg()[0];
      if (cpuUsage > 2) {
        console.log(`⚠️  High CPU load: ${cpuUsage}`);
      }
      
    } catch (error) {
      console.log('⚠️  Could not check system resources');
    }
  }

  async executeCommand(command, options) {
    const commandPath = this.commands[command];
    const fullPath = path.join(this.projectRoot, commandPath);
    
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Command file not found: ${commandPath}`);
    }
    
    console.log(`🎯 Executing: ${commandPath}`);
    console.log(`📁 Path: ${fullPath}`);
    console.log('');
    
    // Mark command as running
    this.runningProcesses.set(command, {
      startTime: Date.now(),
      options: options
    });
    
    try {
      // Execute the command
      const result = await this.runCommand(fullPath, options);
      
      // Mark command as completed
      this.runningProcesses.delete(command);
      
      console.log(`✅ ${command} completed successfully`);
      return result;
      
    } catch (error) {
      // Mark command as failed
      this.runningProcesses.delete(command);
      throw error;
    }
  }

  async runCommand(commandPath, options) {
    return new Promise((resolve, reject) => {
      const { spawn } = require('child_process');
      
      // Build command arguments
      const args = options.length > 0 ? options : [];
      
      // Spawn the process
      const child = spawn('node', [commandPath, ...args], {
        cwd: this.projectRoot,
        stdio: 'inherit',
        env: { ...process.env, COMMAND_COORDINATOR: 'true' }
      });
      
      // Handle process events
      child.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, code });
        } else {
          reject(new Error(`Command exited with code ${code}`));
        }
      });
      
      child.on('error', (error) => {
        reject(new Error(`Command failed: ${error.message}`));
      });
      
      // Set timeout for long-running commands
      const timeout = this.getCommandTimeout(commandPath);
      if (timeout) {
        setTimeout(() => {
          child.kill('SIGTERM');
          reject(new Error(`Command timed out after ${timeout}ms`));
        }, timeout);
      }
    });
  }

  getCommandTimeout(commandPath) {
    const timeouts = {
      'scripts/protocols/launch_protocol.cjs': 120000, // 2 minutes
      'scripts/protocols/launch_annihilate_protocol.cjs': 120000, // 2 minutes
      'scripts/anchor_manager.cjs': 60000, // 1 minute (increased from 30s)
      'scripts/checkpoint_manager.cjs': 90000, // 1.5 minutes (increased from 1m)
      'scripts/protocols/context_enabled_pre_wrap_protocol.cjs': 90000, // 1.5 minutes (increased from 1m)
      'scripts/protocols/context_enabled_wrap_protocol.cjs': 90000, // 1.5 minutes (increased from 1m)
      'scripts/protocols/wrap_annihilate_protocol.cjs': 90000 // 1.5 minutes
    };
    
    return timeouts[commandPath] || 60000; // Default 1 minute (increased from 30s)
  }

  recordCommandExecution(command, options) {
    const execution = {
      timestamp: new Date().toISOString(),
      command: command,
      options: options,
      success: true
    };
    
    this.commandHistory.push(execution);
    
    // Keep only last 10 executions
    if (this.commandHistory.length > 10) {
      this.commandHistory = this.commandHistory.slice(-10);
    }
    
    // Save to file
    try {
      const historyFile = path.join(this.projectRoot, 'data', 'command_history.json');
      const historyDir = path.dirname(historyFile);
      
      if (!fs.existsSync(historyDir)) {
        fs.mkdirSync(historyDir, { recursive: true });
      }
      
      fs.writeFileSync(historyFile, JSON.stringify(this.commandHistory, null, 2));
    } catch (error) {
      console.log('⚠️  Could not save command history');
    }
  }

  showHelp() {
    console.log('🚀 Command Coordinator');
    console.log('=====================');
    console.log('');
    console.log('USAGE: node scripts/command_coordinator.cjs [command] [options]');
    console.log('');
    console.log('COMMANDS:');
    console.log('  launch           Start new session with full context awareness');
    console.log('  launch-annihilate Start new session with context restoration');
    console.log('  anchor           Quick system health check (for transitions)');
    console.log('  checkpoint       Comprehensive analysis including governance');
    console.log('  prewrap          Prepare for session end with context preservation');
    console.log('  wrap             Complete session with full documentation');
    console.log('  wrap-annihilate  Complete session with seamless handoff preparation');
    console.log('');
    console.log('EXAMPLES:');
    console.log('  node scripts/command_coordinator.cjs launch');
    console.log('  node scripts/command_coordinator.cjs launch-annihilate');
    console.log('  node scripts/command_coordinator.cjs anchor --quick');
    console.log('  node scripts/command_coordinator.cjs checkpoint --deep');
    console.log('  node scripts/command_coordinator.cjs prewrap');
    console.log('  node scripts/command_coordinator.cjs wrap');
    console.log('  node scripts/command_coordinator.cjs wrap-annihilate');
    console.log('');
    console.log('FEATURES:');
    console.log('  • Prevents command conflicts');
    console.log('  • Manages timing and dependencies');
    console.log('  • Provides unified interface');
    console.log('  • Handles errors gracefully');
    console.log('  • Coordinates background processes');
    console.log('  • Seamless context preservation and restoration');
  }

  getStatus() {
    return {
      runningProcesses: Array.from(this.runningProcesses.keys()),
      commandHistory: this.commandHistory.slice(-5),
      timestamp: new Date().toISOString()
    };
  }
}

// Run the command coordinator
if (require.main === module) {
  const coordinator = new CommandCoordinator();
  coordinator.execute().catch(error => {
    console.error('Command coordinator failed:', error);
    process.exit(1);
  });
}

module.exports = CommandCoordinator; 