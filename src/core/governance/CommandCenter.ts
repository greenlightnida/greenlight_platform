/**
 * Command Center Holon
 * 
 * PURPOSE: Centralized command management and optimization system within the governance framework.
 * Provides intelligent command routing, usage analytics, performance optimization, and automated
 * enhancement recommendations.
 * 
 * FEATURES:
 * - Command indexing and discovery
 * - Usage monitoring and analytics
 * - Performance optimization
 * - Automated enhancement recommendations
 * - Conflict resolution and coordination
 * - Command health monitoring
 * - Usage pattern analysis
 * - Predictive command suggestions
 */

import { execSync } from 'child_process';
import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as path from 'path';

export interface CommandDefinition {
  id: string;
  name: string;
  description: string;
  category: 'system' | 'development' | 'governance' | 'analysis' | 'session';
  path: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  dependencies: string[];
  conflicts: string[];
  timeout: number;
  retryCount: number;
  healthStatus: 'healthy' | 'warning' | 'error' | 'unknown';
  lastExecuted?: Date;
  executionCount: number;
  averageExecutionTime: number;
  successRate: number;
  metadata: Record<string, any>;
}

export interface CommandExecution {
  id: string;
  commandId: string;
  timestamp: Date;
  duration: number;
  success: boolean;
  error?: string;
  options: string[];
  systemResources: {
    memoryUsage: number;
    cpuUsage: number;
    diskUsage: number;
  };
  context: Record<string, any>;
}

export interface CommandAnalytics {
  totalExecutions: number;
  successRate: number;
  averageExecutionTime: number;
  peakUsageTimes: string[];
  commonOptions: string[];
  failurePatterns: string[];
  performanceTrends: {
    trend: 'improving' | 'stable' | 'declining';
    change: number;
  };
  recommendations: string[];
}

export class CommandCenter extends EventEmitter {
  private commands: Map<string, CommandDefinition> = new Map();
  private executions: CommandExecution[] = [];
  private analytics: Map<string, CommandAnalytics> = new Map();
  private healthMonitor: NodeJS.Timeout | null = null;
  private optimizationInterval: NodeJS.Timeout | null = null;
  private projectRoot: string;

  constructor(projectRoot: string) {
    super();
    this.projectRoot = projectRoot;
    this.initialize();
  }

  private async initialize() {
    console.log('🏛️  Initializing Command Center Holon...');
    
    // Index all available commands
    await this.indexCommands();
    
    // Load historical data
    await this.loadHistoricalData();
    
    // Start monitoring
    this.startHealthMonitoring();
    this.startOptimizationCycle();
    
    // Register event handlers
    this.registerEventHandlers();
    
    console.log('✅ Command Center Holon initialized');
    this.emit('initialized');
  }

  private async indexCommands() {
    console.log('📚 Indexing commands...');
    
    // System commands
    this.registerCommand({
      id: 'launch',
      name: 'Launch Protocol',
      description: 'Start new session with full context awareness',
      category: 'session',
      path: 'scripts/protocols/launch_protocol.cjs',
      priority: 'critical',
      dependencies: [],
      conflicts: ['checkpoint', 'prewrap', 'wrap'],
      timeout: 120000,
      retryCount: 2,
      healthStatus: 'unknown',
      executionCount: 0,
      averageExecutionTime: 0,
      successRate: 0,
      metadata: {
        contextAwareness: true,
        sessionManagement: true,
        systemValidation: true
      }
    });

    this.registerCommand({
      id: 'anchor',
      name: 'Anchor Manager',
      description: 'Quick system health check for transitions',
      category: 'system',
      path: 'scripts/anchor_manager.cjs',
      priority: 'high',
      dependencies: [],
      conflicts: [],
      timeout: 30000,
      retryCount: 1,
      healthStatus: 'unknown',
      executionCount: 0,
      averageExecutionTime: 0,
      successRate: 0,
      metadata: {
        quickMode: true,
        transitionOptimized: true,
        lightweight: true
      }
    });

    this.registerCommand({
      id: 'checkpoint',
      name: 'Checkpoint Manager',
      description: 'Comprehensive analysis including governance',
      category: 'analysis',
      path: 'scripts/checkpoint_manager.cjs',
      priority: 'high',
      dependencies: ['anchor'],
      conflicts: ['launch'],
      timeout: 60000,
      retryCount: 1,
      healthStatus: 'unknown',
      executionCount: 0,
      averageExecutionTime: 0,
      successRate: 0,
      metadata: {
        comprehensive: true,
        governanceIncluded: true,
        deepAnalysis: true
      }
    });

    this.registerCommand({
      id: 'prewrap',
      name: 'Pre-Wrap Protocol',
      description: 'Prepare for session end with context preservation',
      category: 'session',
      path: 'scripts/protocols/context_enabled_pre_wrap_protocol.cjs',
      priority: 'high',
      dependencies: [],
      conflicts: ['launch', 'checkpoint'],
      timeout: 45000,
      retryCount: 2,
      healthStatus: 'unknown',
      executionCount: 0,
      averageExecutionTime: 0,
      successRate: 0,
      metadata: {
        contextPreservation: true,
        sessionEnd: true,
        stateCapture: true
      }
    });

    this.registerCommand({
      id: 'wrap',
      name: 'Wrap Protocol',
      description: 'Complete session with full documentation',
      category: 'session',
      path: 'scripts/protocols/context_enabled_wrap_protocol.cjs',
      priority: 'critical',
      dependencies: ['prewrap'],
      conflicts: ['launch', 'checkpoint', 'prewrap'],
      timeout: 60000,
      retryCount: 2,
      healthStatus: 'unknown',
      executionCount: 0,
      averageExecutionTime: 0,
      successRate: 0,
      metadata: {
        sessionCompletion: true,
        documentation: true,
        contextTransfer: true
      }
    });

    // Discover additional commands from scripts directory
    await this.discoverCommands();
    
    console.log(`✅ Indexed ${this.commands.size} commands`);
  }

  private async discoverCommands() {
    const scriptsDir = path.join(this.projectRoot, 'scripts');
    const protocolsDir = path.join(this.projectRoot, 'scripts', 'protocols');
    
    // Discover scripts
    if (fs.existsSync(scriptsDir)) {
      const files = fs.readdirSync(scriptsDir);
      for (const file of files) {
        if (file.endsWith('.cjs') && file !== 'command_coordinator.cjs') {
          const commandId = file.replace('.cjs', '');
          if (!this.commands.has(commandId)) {
            this.registerCommand({
              id: commandId,
              name: this.formatCommandName(commandId),
              description: `Discovered command: ${commandId}`,
              category: 'system',
              path: `scripts/${file}`,
              priority: 'medium',
              dependencies: [],
              conflicts: [],
              timeout: 30000,
              retryCount: 1,
              healthStatus: 'unknown',
              executionCount: 0,
              averageExecutionTime: 0,
              successRate: 0,
              metadata: {
                discovered: true,
                autoIndexed: true
              }
            });
          }
        }
      }
    }

    // Discover protocols
    if (fs.existsSync(protocolsDir)) {
      const files = fs.readdirSync(protocolsDir);
      for (const file of files) {
        if (file.endsWith('.cjs')) {
          const commandId = file.replace('.cjs', '');
          if (!this.commands.has(commandId)) {
            this.registerCommand({
              id: commandId,
              name: this.formatCommandName(commandId),
              description: `Discovered protocol: ${commandId}`,
              category: 'governance',
              path: `scripts/protocols/${file}`,
              priority: 'medium',
              dependencies: [],
              conflicts: [],
              timeout: 45000,
              retryCount: 2,
              healthStatus: 'unknown',
              executionCount: 0,
              averageExecutionTime: 0,
              successRate: 0,
              metadata: {
                discovered: true,
                autoIndexed: true,
                protocol: true
              }
            });
          }
        }
      }
    }
  }

  private formatCommandName(commandId: string): string {
    return commandId
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private registerCommand(command: CommandDefinition) {
    this.commands.set(command.id, command);
    this.emit('commandRegistered', command);
  }

  private async loadHistoricalData() {
    const historyFile = path.join(this.projectRoot, 'data', 'command_history.json');
    
    if (fs.existsSync(historyFile)) {
      try {
        const history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
        
        // Process historical executions
        for (const execution of history) {
          if (execution.command && execution.timestamp) {
            const commandExecution: CommandExecution = {
              id: `${execution.command}-${execution.timestamp}`,
              commandId: execution.command,
              timestamp: new Date(execution.timestamp),
              duration: execution.duration || 0,
              success: execution.success !== false,
              error: execution.error,
              options: execution.options || [],
              systemResources: execution.systemResources || {
                memoryUsage: 0,
                cpuUsage: 0,
                diskUsage: 0
              },
              context: execution.context || {}
            };
            
            this.executions.push(commandExecution);
          }
        }
        
        // Update command analytics
        this.updateAnalytics();
        
        console.log(`📊 Loaded ${this.executions.length} historical executions`);
      } catch (error) {
        console.log('⚠️  Could not load historical command data');
      }
    }
  }

  private startHealthMonitoring() {
    this.healthMonitor = setInterval(() => {
      this.checkCommandHealth();
    }, 300000); // Every 5 minutes
  }

  private startOptimizationCycle() {
    this.optimizationInterval = setInterval(() => {
      this.optimizeCommands();
    }, 600000); // Every 10 minutes
  }

  private async checkCommandHealth() {
    console.log('🏥 Checking command health...');
    
    for (const [commandId, command] of this.commands) {
      const healthStatus = await this.assessCommandHealth(command);
      command.healthStatus = healthStatus;
      
      if (healthStatus === 'error') {
        this.emit('commandHealthAlert', { commandId, status: healthStatus });
      }
    }
  }

  private async assessCommandHealth(command: CommandDefinition): Promise<'healthy' | 'warning' | 'error' | 'unknown'> {
    try {
      // Check if command file exists
      const commandPath = path.join(this.projectRoot, command.path);
      if (!fs.existsSync(commandPath)) {
        return 'error';
      }

      // Check recent execution success rate
      const recentExecutions = this.executions
        .filter(e => e.commandId === command.id)
        .filter(e => e.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)); // Last 24 hours

      if (recentExecutions.length === 0) {
        return 'unknown';
      }

      const successRate = recentExecutions.filter(e => e.success).length / recentExecutions.length;
      
      if (successRate >= 0.9) return 'healthy';
      if (successRate >= 0.7) return 'warning';
      return 'error';
      
    } catch (error) {
      return 'error';
    }
  }

  private async optimizeCommands() {
    console.log('⚡ Optimizing commands...');
    
    for (const [commandId, command] of this.commands) {
      const analytics = this.analytics.get(commandId);
      if (analytics) {
        const recommendations = this.generateOptimizationRecommendations(command, analytics);
        
        if (recommendations.length > 0) {
          this.emit('optimizationRecommendations', { commandId, recommendations });
        }
      }
    }
  }

  private generateOptimizationRecommendations(command: CommandDefinition, analytics: CommandAnalytics): string[] {
    const recommendations: string[] = [];
    
    // Check success rate
    if (analytics.successRate < 0.8) {
      recommendations.push('Consider increasing retry count or timeout');
    }
    
    // Check execution time
    if (analytics.averageExecutionTime > command.timeout * 0.8) {
      recommendations.push('Consider increasing timeout or optimizing performance');
    }
    
    // Check usage patterns
    if (analytics.totalExecutions > 100 && analytics.successRate > 0.95) {
      recommendations.push('Command is stable - consider reducing retry count');
    }
    
    return recommendations;
  }

  private updateAnalytics() {
    for (const [commandId, command] of this.commands) {
      const commandExecutions = this.executions.filter(e => e.commandId === commandId);
      
      if (commandExecutions.length === 0) continue;
      
      const totalExecutions = commandExecutions.length;
      const successfulExecutions = commandExecutions.filter(e => e.success).length;
      const successRate = successfulExecutions / totalExecutions;
      const averageExecutionTime = commandExecutions.reduce((sum, e) => sum + e.duration, 0) / totalExecutions;
      
      // Analyze peak usage times
      const hourCounts = new Array(24).fill(0);
      commandExecutions.forEach(e => {
        const hour = e.timestamp.getHours();
        hourCounts[hour]++;
      });
      
      const peakHours = hourCounts
        .map((count, hour) => ({ hour, count }))
        .filter(({ count }) => count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 3)
        .map(({ hour }) => `${hour}:00`);
      
      // Analyze common options
      const optionCounts = new Map<string, number>();
      commandExecutions.forEach(e => {
        e.options.forEach(option => {
          optionCounts.set(option, (optionCounts.get(option) || 0) + 1);
        });
      });
      
      const commonOptions = Array.from(optionCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([option]) => option);
      
      // Analyze failure patterns
      const failurePatterns = commandExecutions
        .filter(e => !e.success)
        .map(e => e.error)
        .filter(error => error)
        .slice(0, 5);
      
      // Calculate performance trends
      const recentExecutions = commandExecutions
        .filter(e => e.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) // Last week
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      
      let trend: 'improving' | 'stable' | 'declining' = 'stable';
      let change = 0;
      
      if (recentExecutions.length >= 10) {
        const firstHalf = recentExecutions.slice(0, Math.floor(recentExecutions.length / 2));
        const secondHalf = recentExecutions.slice(Math.floor(recentExecutions.length / 2));
        
        const firstHalfAvg = firstHalf.reduce((sum, e) => sum + e.duration, 0) / firstHalf.length;
        const secondHalfAvg = secondHalf.reduce((sum, e) => sum + e.duration, 0) / secondHalf.length;
        
        change = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
        
        if (change < -10) trend = 'improving';
        else if (change > 10) trend = 'declining';
      }
      
      this.analytics.set(commandId, {
        totalExecutions,
        successRate,
        averageExecutionTime,
        peakUsageTimes: peakHours,
        commonOptions,
        failurePatterns,
        performanceTrends: { trend, change },
        recommendations: []
      });
      
      // Update command metadata
      command.executionCount = totalExecutions;
      command.averageExecutionTime = averageExecutionTime;
      command.successRate = successRate;
      command.lastExecuted = commandExecutions[commandExecutions.length - 1]?.timestamp;
    }
  }

  private registerEventHandlers() {
    this.on('commandExecuted', (execution: CommandExecution) => {
      this.executions.push(execution);
      this.updateAnalytics();
      this.saveHistoricalData();
    });
  }

  private async saveHistoricalData() {
    const historyFile = path.join(this.projectRoot, 'data', 'command_history.json');
    const historyDir = path.dirname(historyFile);
    
    if (!fs.existsSync(historyDir)) {
      fs.mkdirSync(historyDir, { recursive: true });
    }
    
    const history = this.executions.map(e => ({
      command: e.commandId,
      timestamp: e.timestamp.toISOString(),
      duration: e.duration,
      success: e.success,
      error: e.error,
      options: e.options,
      systemResources: e.systemResources,
      context: e.context
    }));
    
    fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
  }

  // Public API methods

  public async executeCommand(commandId: string, options: string[] = []): Promise<CommandExecution> {
    const command = this.commands.get(commandId);
    if (!command) {
      throw new Error(`Command not found: ${commandId}`);
    }

    // Check for conflicts
    await this.checkConflicts(command);
    
    // Check system resources
    await this.checkSystemResources();
    
    const startTime = Date.now();
    const executionId = `${commandId}-${Date.now()}`;
    
    try {
      console.log(`🚀 Executing command: ${command.name}`);
      
      // Execute the command
      
      const duration = Date.now() - startTime;
      
      const execution: CommandExecution = {
        id: executionId,
        commandId,
        timestamp: new Date(),
        duration,
        success: true,
        options,
        systemResources: await this.getSystemResources(),
        context: {
          commandVersion: command.metadata.version,
          executionMode: 'coordinated'
        }
      };
      
      this.emit('commandExecuted', execution);
      return execution;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      
      const execution: CommandExecution = {
        id: executionId,
        commandId,
        timestamp: new Date(),
        duration,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        options,
        systemResources: await this.getSystemResources(),
        context: {
          commandVersion: command.metadata.version,
          executionMode: 'coordinated'
        }
      };
      
      this.emit('commandExecuted', execution);
      throw error;
    }
  }

  private async runCommand(command: CommandDefinition, options: string[]): Promise<any> {
    return new Promise((resolve, reject) => {
      const { spawn } = require('child_process');
      
      const commandPath = path.join(this.projectRoot, command.path);
      const child = spawn('node', [commandPath, ...options], {
        cwd: this.projectRoot,
        stdio: 'inherit',
        env: { ...process.env, COMMAND_CENTER: 'true' }
      });
      
      const timeout = setTimeout(() => {
        child.kill('SIGTERM');
        reject(new Error(`Command timed out after ${command.timeout}ms`));
      }, command.timeout);
      
      child.on('close', (code: number) => {
        clearTimeout(timeout);
        if (code === 0) {
          resolve({ success: true, code });
        } else {
          reject(new Error(`Command exited with code ${code}`));
        }
      });
      
      child.on('error', (error: Error) => {
        clearTimeout(timeout);
        reject(new Error(`Command failed: ${error.message}`));
      });
    });
  }

  private async checkConflicts(command: CommandDefinition) {
    for (const conflictId of command.conflicts) {
      const conflictingCommand = this.commands.get(conflictId);
      if (conflictingCommand?.lastExecuted) {
        const timeSinceLastExecution = Date.now() - conflictingCommand.lastExecuted.getTime();
        if (timeSinceLastExecution < 60000) { // Within last minute
          throw new Error(`Command conflict: ${conflictId} was recently executed`);
        }
      }
    }
  }

  private async checkSystemResources() {
    const resources = await this.getSystemResources();
    
    if (resources.memoryUsage > 90) {
      throw new Error('Insufficient memory available');
    }
    
    if (resources.cpuUsage > 80) {
      throw new Error('High CPU usage detected');
    }
  }

  private async getSystemResources() {
    const os = require('os');
    
    return {
      memoryUsage: ((os.totalmem() - os.freemem()) / os.totalmem()) * 100,
      cpuUsage: os.loadavg()[0] * 100,
      diskUsage: 0 // Would need additional logic to calculate disk usage
    };
  }

  public getCommands(): CommandDefinition[] {
    return Array.from(this.commands.values());
  }

  public getCommand(commandId: string): CommandDefinition | undefined {
    return this.commands.get(commandId);
  }

  public getAnalytics(commandId: string): CommandAnalytics | undefined {
    return this.analytics.get(commandId);
  }

  public getAllAnalytics(): Map<string, CommandAnalytics> {
    return new Map(this.analytics);
  }

  public getExecutions(limit: number = 100): CommandExecution[] {
    return this.executions
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  public getCommandExecutions(commandId: string, limit: number = 50): CommandExecution[] {
    return this.executions
      .filter(e => e.commandId === commandId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  public async shutdown() {
    if (this.healthMonitor) {
      clearInterval(this.healthMonitor);
    }
    
    if (this.optimizationInterval) {
      clearInterval(this.optimizationInterval);
    }
    
    await this.saveHistoricalData();
    
    console.log('🛑 Command Center Holon shutdown complete');
  }
}

export default CommandCenter; 