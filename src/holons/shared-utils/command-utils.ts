/**
 * Command Utilities for Shared Utils Holon
 * 
 * PURPOSE: Consolidate common command execution patterns used across the platform
 * - Command execution with error handling
 * - Process management
 * - Output parsing
 * - Cross-platform compatibility
 */

import { execSync, spawn, ChildProcess } from 'child_process';

export interface CommandOptions {
  cwd?: string;
  timeout?: number;
  encoding?: BufferEncoding;
  stdio?: 'pipe' | 'inherit' | 'ignore';
  env?: NodeJS.ProcessEnv;
  shell?: boolean;
}

export interface CommandResult {
  success: boolean;
  stdout: string;
  stderr: string;
  exitCode: number;
  duration: number;
  command: string;
}

export interface ProcessInfo {
  pid: number;
  command: string;
  startTime: Date;
  status: 'running' | 'completed' | 'failed' | 'killed';
}

export class CommandUtils {
  private static instance: CommandUtils;
  private runningProcesses: Map<number, ProcessInfo> = new Map();

  static getInstance(): CommandUtils {
    if (!CommandUtils.instance) {
      CommandUtils.instance = new CommandUtils();
    }
    return CommandUtils.instance;
  }

  /**
   * Execute command synchronously with full error handling
   */
  executeCommand(command: string, options: CommandOptions = {}): CommandResult {
    const startTime = Date.now();
    const {
      cwd = process.cwd(),
      timeout = 60000,
      encoding = 'utf8',
      stdio = 'pipe',
      env = process.env,
      shell = true
    } = options;

    try {
      const stdout = execSync(command, {
        cwd,
        timeout,
        encoding,
        stdio: stdio === 'pipe' ? 'pipe' : stdio === 'inherit' ? 'inherit' : 'ignore',
        env,
        shell: shell ? '/bin/bash' : undefined
      });

      const duration = Date.now() - startTime;

      return {
        success: true,
        stdout: stdout || '',
        stderr: '',
        exitCode: 0,
        duration,
        command
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      return {
        success: false,
        stdout: error.stdout || '',
        stderr: error.stderr || error.message || '',
        exitCode: error.status || 1,
        duration,
        command
      };
    }
  }

  /**
   * Execute command asynchronously
   */
  async executeCommandAsync(command: string, options: CommandOptions = {}): Promise<CommandResult> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const {
        cwd = process.cwd(),
        timeout = 60000,
        stdio = 'pipe',
        env = process.env,
        shell = true
      } = options;

      let stdout = '';
      let stderr = '';
      let killed = false;

      const child = spawn(command, [], {
        cwd,
        stdio,
        env,
        shell
      });

      const processInfo: ProcessInfo = {
        pid: child.pid!,
        command,
        startTime: new Date(),
        status: 'running'
      };

      this.runningProcesses.set(child.pid!, processInfo);

      // Set timeout
      const timeoutId = setTimeout(() => {
        if (child.pid) {
          this.killProcess(child.pid);
          killed = true;
        }
      }, timeout);

      // Capture output
      if (child.stdout) {
        child.stdout.on('data', (data) => {
          stdout += data.toString();
        });
      }

      if (child.stderr) {
        child.stderr.on('data', (data) => {
          stderr += data.toString();
        });
      }

      // Handle completion
      child.on('close', (code) => {
        clearTimeout(timeoutId);
        const duration = Date.now() - startTime;
        
        if (child.pid) {
          this.runningProcesses.delete(child.pid);
        }

        processInfo.status = killed ? 'killed' : (code === 0 ? 'completed' : 'failed');

        resolve({
          success: code === 0 && !killed,
          stdout,
          stderr,
          exitCode: code || 0,
          duration,
          command
        });
      });

      child.on('error', (error) => {
        clearTimeout(timeoutId);
        const duration = Date.now() - startTime;
        
        if (child.pid) {
          this.runningProcesses.delete(child.pid);
        }

        processInfo.status = 'failed';

        resolve({
          success: false,
          stdout,
          stderr: error.message,
          exitCode: 1,
          duration,
          command
        });
      });
    });
  }

  /**
   * Execute multiple commands in sequence
   */
  async executeCommands(commands: string[], options: CommandOptions = {}): Promise<CommandResult[]> {
    const results: CommandResult[] = [];
    
    for (const command of commands) {
      const result = this.executeCommand(command, options);
      results.push(result);
      
      // Stop on first failure unless configured otherwise
      if (!result.success) {
        break;
      }
    }
    
    return results;
  }

  /**
   * Execute multiple commands in parallel
   */
  async executeCommandsParallel(commands: string[], options: CommandOptions = {}): Promise<CommandResult[]> {
    const promises = commands.map(command => this.executeCommandAsync(command, options));
    return Promise.all(promises);
  }

  /**
   * Kill a running process
   */
  killProcess(pid: number): boolean {
    try {
      process.kill(pid, 'SIGTERM');
      
      const processInfo = this.runningProcesses.get(pid);
      if (processInfo) {
        processInfo.status = 'killed';
      }
      
      return true;
    } catch (error) {
      console.warn(`Warning: Could not kill process ${pid}:`, error);
      return false;
    }
  }

  /**
   * Kill all running processes
   */
  killAllProcesses(): void {
    for (const [pid] of Array.from(this.runningProcesses.entries())) {
      this.killProcess(pid);
    }
  }

  /**
   * Get list of running processes
   */
  getRunningProcesses(): ProcessInfo[] {
    return Array.from(this.runningProcesses.values());
  }

  /**
   * Check if command exists
   */
  commandExists(command: string): boolean {
    try {
      const result = this.executeCommand(`which ${command}`, { stdio: 'ignore' });
      return result.success;
    } catch {
      return false;
    }
  }

  /**
   * Get command version
   */
  getCommandVersion(command: string): string | null {
    try {
      const result = this.executeCommand(`${command} --version`);
      if (result.success) {
        return result.stdout.trim();
      }
    } catch {
      // Try alternative version flags
      const alternatives = ['-v', '-V', 'version'];
      
      for (const flag of alternatives) {
        try {
          const result = this.executeCommand(`${command} ${flag}`);
          if (result.success) {
            return result.stdout.trim();
          }
        } catch {
          continue;
        }
      }
    }
    
    return null;
  }

  /**
   * Execute command with retry logic
   */
  async executeCommandWithRetry(
    command: string, 
    options: CommandOptions & { 
      maxRetries?: number; 
      retryDelay?: number; 
      retryCondition?: (result: CommandResult) => boolean;
    } = {}
  ): Promise<CommandResult> {
    const {
      maxRetries = 3,
      retryDelay = 1000,
      retryCondition = (result) => !result.success,
      ...commandOptions
    } = options;

    let lastResult: CommandResult;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      lastResult = this.executeCommand(command, commandOptions);
      
      if (!retryCondition(lastResult)) {
        return lastResult;
      }
      
      if (attempt < maxRetries) {
        console.log(`Command failed, retrying in ${retryDelay}ms (attempt ${attempt}/${maxRetries})`);
        await this.sleep(retryDelay);
      }
    }
    
    return lastResult!;
  }

  /**
   * Execute command and parse JSON output
   */
  executeCommandJson<T = any>(command: string, options: CommandOptions = {}): T | null {
    const result = this.executeCommand(command, options);
    
    if (!result.success) {
      return null;
    }
    
    try {
      return JSON.parse(result.stdout);
    } catch {
      return null;
    }
  }

  /**
   * Execute command and parse lines
   */
  executeCommandLines(command: string, options: CommandOptions = {}): string[] {
    const result = this.executeCommand(command, options);
    
    if (!result.success) {
      return [];
    }
    
    return result.stdout
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Format command result for logging
   */
  formatCommandResult(result: CommandResult): string {
    const status = result.success ? '✅' : '❌';
    const duration = `${result.duration}ms`;
    
    return `${status} ${result.command} (${duration})`;
  }

  /**
   * Validate command before execution
   */
  validateCommand(command: string): { valid: boolean; issues: string[] } {
    const issues: string[] = [];
    
    if (!command || command.trim().length === 0) {
      issues.push('Command is empty');
    }
    
    if (command.includes(';') || command.includes('&&') || command.includes('||')) {
      issues.push('Command contains shell operators - use executeCommands for multiple commands');
    }
    
    // Check for potentially dangerous commands
    const dangerousPatterns = [
      /rm\s+-rf/,
      /dd\s+if=/,
      /mkfs/,
      /fdisk/
    ];
    
    for (const pattern of dangerousPatterns) {
      if (pattern.test(command)) {
        issues.push('Command contains potentially dangerous operations');
        break;
      }
    }
    
    return {
      valid: issues.length === 0,
      issues
    };
  }
}

// Export singleton instance
export const commandUtils = CommandUtils.getInstance(); 