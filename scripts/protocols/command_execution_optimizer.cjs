#!/usr/bin/env node

/**
 * Command Execution Optimizer
 * 
 * PURPOSE: Replace blocking execSync calls with non-blocking spawn execution
 * to prevent command stalling and improve user experience.
 * 
 * FEATURES:
 * - Non-blocking command execution
 * - Configurable timeouts
 * - Progress indicators
 * - Error handling with recovery
 * - Background execution support
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class CommandExecutionOptimizer {
  constructor() {
    this.projectRoot = process.cwd();
    this.defaultTimeout = 30000; // 30 seconds
    this.verbose = process.env.VERBOSE === 'true';
  }

  /**
   * Execute command with spawn (non-blocking) instead of execSync
   */
  async executeCommand(command, options = {}) {
    const {
      args = [],
      cwd = this.projectRoot,
      timeout = this.defaultTimeout,
      silent = false,
      captureOutput = true,
      showProgress = true
    } = options;

    return new Promise((resolve, reject) => {
      if (showProgress && !silent) {
        console.log(`🔄 Executing: ${command} ${args.join(' ')}`);
      }

      const child = spawn(command, args, {
        cwd,
        stdio: captureOutput ? 'pipe' : 'inherit',
        shell: true
      });

      let stdout = '';
      let stderr = '';
      let timeoutId;

      // Set timeout
      if (timeout > 0) {
        timeoutId = setTimeout(() => {
          child.kill('SIGTERM');
          reject(new Error(`Command timed out after ${timeout}ms: ${command}`));
        }, timeout);
      }

      // Capture output
      if (captureOutput) {
        child.stdout?.on('data', (data) => {
          stdout += data.toString();
          if (showProgress && !silent) {
            process.stdout.write('.');
          }
        });

        child.stderr?.on('data', (data) => {
          stderr += data.toString();
        });
      }

      // Handle completion
      child.on('close', (code) => {
        if (timeoutId) clearTimeout(timeoutId);
        
        if (showProgress && !silent) {
          console.log(''); // New line after progress dots
        }

        if (code === 0) {
          resolve({
            success: true,
            code,
            stdout: stdout.trim(),
            stderr: stderr.trim()
          });
        } else {
          reject(new Error(`Command failed with code ${code}: ${stderr || 'Unknown error'}`));
        }
      });

      // Handle errors
      child.on('error', (error) => {
        if (timeoutId) clearTimeout(timeoutId);
        reject(error);
      });
    });
  }

  /**
   * Execute command with fallback to execSync for critical operations
   */
  async executeWithFallback(command, options = {}) {
    const {
      fallbackToExecSync = true,
      critical = false,
      ...spawnOptions
    } = options;

    try {
      return await this.executeCommand(command, spawnOptions);
    } catch (error) {
      if (fallbackToExecSync && !critical) {
        console.log(`⚠️  Spawn failed, falling back to execSync: ${command}`);
        return this.executeWithExecSync(command, spawnOptions);
      }
      throw error;
    }
  }

  /**
   * Fallback to execSync for critical operations
   */
  executeWithExecSync(command, options = {}) {
    const { execSync } = require('child_process');
    const { args = [], cwd = this.projectRoot, silent = false } = options;
    
    const fullCommand = args.length > 0 ? `${command} ${args.join(' ')}` : command;
    
    if (!silent) {
      console.log(`⚡ ExecSync fallback: ${fullCommand}`);
    }

    try {
      const result = execSync(fullCommand, {
        encoding: 'utf8',
        cwd,
        stdio: silent ? 'pipe' : 'inherit'
      });

      return {
        success: true,
        code: 0,
        stdout: result,
        stderr: ''
      };
    } catch (error) {
      throw new Error(`ExecSync failed: ${error.message}`);
    }
  }

  /**
   * Execute multiple commands in parallel
   */
  async executeParallel(commands, options = {}) {
    const { maxConcurrent = 3, ...commandOptions } = options;
    
    const results = [];
    const executing = new Set();

    for (const command of commands) {
      if (executing.size >= maxConcurrent) {
        await Promise.race(executing);
      }

      const promise = this.executeCommand(command.command, {
        ...commandOptions,
        ...command.options
      }).then(result => {
        executing.delete(promise);
        return { command: command.command, result };
      }).catch(error => {
        executing.delete(promise);
        return { command: command.command, error };
      });

      executing.add(promise);
      results.push(promise);
    }

    return Promise.all(results);
  }

  /**
   * Check if a command is available
   */
  async isCommandAvailable(command) {
    try {
      await this.executeCommand(command, { 
        args: ['--version'], 
        silent: true, 
        timeout: 5000 
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get command version
   */
  async getCommandVersion(command) {
    try {
      const result = await this.executeCommand(command, {
        args: ['--version'],
        silent: true,
        timeout: 5000
      });
      return result.stdout.trim();
    } catch {
      return 'Unknown';
    }
  }
}

module.exports = CommandExecutionOptimizer; 