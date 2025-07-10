/**
 * Protocol Manager for Protocol Holon
 * 
 * PURPOSE: Coordinate and manage all modular protocols
 * - Protocol registration and discovery
 * - Unified execution interface
 * - Protocol lifecycle management
 * - Performance monitoring and optimization
 */

import { BaseProtocol, ProtocolConfig, ProtocolResult } from './base-protocol';
import { LaunchProtocol } from './launch-protocol';
import { WrapProtocol } from './wrap-protocol';
import { CouncilProtocol } from './council-protocol';

export interface ProtocolRegistry {
  [key: string]: {
    protocol: new () => BaseProtocol;
    config: ProtocolConfig;
    description: string;
    version: string;
  };
}

export interface ProtocolExecutionResult {
  protocolName: string;
  success: boolean;
  duration: string;
  result: ProtocolResult;
  timestamp: string;
}

export class ProtocolManager {
  private registry: ProtocolRegistry = {};
  private executionHistory: ProtocolExecutionResult[] = [];

  constructor() {
    this.registerDefaultProtocols();
  }

  private registerDefaultProtocols(): void {
    // Register Launch Protocol
    this.registerProtocol('launch', {
      protocol: LaunchProtocol,
      config: {
        protocolName: 'Launch Protocol',
        protocolVersion: '2.0.0',
        sessionType: 'launch',
        sessionLabel: 'Greenlight Platform Launch Protocol',
        dataDirectory: 'data',
        reportsDirectory: 'data/reports',
        sessionsDirectory: 'data/sessions'
      },
      description: 'Comprehensive protocol for starting new chat sessions with full context preservation',
      version: '2.0.0'
    });

    // Register Wrap Protocol
    this.registerProtocol('wrap', {
      protocol: WrapProtocol,
      config: {
        protocolName: 'Wrap Protocol',
        protocolVersion: '1.0.0',
        sessionType: 'wrap',
        sessionLabel: 'Greenlight Platform Wrap Protocol',
        dataDirectory: 'data',
        reportsDirectory: 'data/reports',
        sessionsDirectory: 'data/sessions'
      },
      description: 'Comprehensive protocol for completing chat sessions with full documentation',
      version: '1.0.0'
    });

    // Register Council Protocol
    this.registerProtocol('council', {
      protocol: CouncilProtocol,
      config: {
        protocolName: 'Council Protocol',
        protocolVersion: '1.0.0',
        sessionType: 'council',
        sessionLabel: 'Greenlight Platform Council Protocol',
        dataDirectory: 'data/council',
        reportsDirectory: 'data/council/reports',
        sessionsDirectory: 'data/council/sessions'
      },
      description: 'Comprehensive protocol for council governance and decision-making',
      version: '1.0.0'
    });
  }

  registerProtocol(name: string, protocolInfo: ProtocolRegistry[string]): void {
    this.registry[name] = protocolInfo;
    console.log(`✅ Registered protocol: ${name} v${protocolInfo.version}`);
  }

  getProtocol(name: string): ProtocolRegistry[string] | null {
    return this.registry[name] || null;
  }

  listProtocols(): string[] {
    return Object.keys(this.registry);
  }

  async executeProtocol(name: string, args: string[] = []): Promise<ProtocolExecutionResult> {
    const protocolInfo = this.getProtocol(name);
    if (!protocolInfo) {
      throw new Error(`Protocol not found: ${name}`);
    }

    console.log(`🚀 Executing protocol: ${name} v${protocolInfo.version}`);
    console.log(`📝 Description: ${protocolInfo.description}`);

    const startTime = Date.now();
    let result: ProtocolResult;

    try {
      const ProtocolClass = protocolInfo.protocol;
      const protocolInstance = new ProtocolClass();
      
      // Set command line arguments for protocols that need them
      if (args.length > 0) {
        process.argv = [process.argv[0], process.argv[1], ...args];
      }

      result = await protocolInstance.execute();
      
    } catch (error: any) {
      result = {
        success: false,
        sessionId: `error-${Date.now()}`,
        timestamp: new Date().toISOString(),
        duration: '0s',
        results: {},
        errors: [error.message],
        warnings: [],
        metadata: {
          sessionId: `error-${Date.now()}`,
          sessionType: name,
          sessionLabel: `${protocolInfo.config.protocolName} Error`,
          timestamp: new Date().toISOString(),
          date: new Date().toISOString().split('T')[0],
          time: new Date().toISOString().split('T')[1].split('.')[0],
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          protocolVersion: protocolInfo.config.protocolVersion,
          environment: process.env.NODE_ENV || 'development',
          userAgent: process.env.USER || 'unknown',
          hostname: require('os').hostname(),
          platform: process.platform,
          nodeVersion: process.version,
          cwd: process.cwd()
        }
      };
    }

    const duration = Date.now() - startTime;
    const durationStr = this.formatDuration(duration);

    const executionResult: ProtocolExecutionResult = {
      protocolName: name,
      success: result.success,
      duration: durationStr,
      result,
      timestamp: new Date().toISOString()
    };

    this.executionHistory.push(executionResult);
    this.saveExecutionHistory();

    console.log(`✅ Protocol execution completed: ${name}`);
    console.log(`⏱️  Duration: ${durationStr}`);
    console.log(`📊 Success: ${result.success ? 'Yes' : 'No'}`);
    
    if (result.errors.length > 0) {
      console.log(`❌ Errors: ${result.errors.length}`);
    }
    
    if (result.warnings.length > 0) {
      console.log(`⚠️  Warnings: ${result.warnings.length}`);
    }

    return executionResult;
  }

  async executeProtocolSequence(sequence: Array<{ name: string; args?: string[] }>): Promise<ProtocolExecutionResult[]> {
    console.log(`🔄 Executing protocol sequence: ${sequence.length} protocols`);
    
    const results: ProtocolExecutionResult[] = [];
    
    for (const protocol of sequence) {
      try {
        const result = await this.executeProtocol(protocol.name, protocol.args || []);
        results.push(result);
        
        // If a protocol fails, we might want to stop the sequence
        if (!result.success) {
          console.log(`⚠️  Protocol ${protocol.name} failed, stopping sequence`);
          break;
        }
      } catch (error) {
        console.error(`❌ Failed to execute protocol ${protocol.name}:`, error);
        break;
      }
    }
    
    return results;
  }

  getExecutionHistory(): ProtocolExecutionResult[] {
    return [...this.executionHistory];
  }

  getProtocolStats(): {
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
    averageDuration: number;
    mostUsedProtocol: string;
  } {
    const totalExecutions = this.executionHistory.length;
    const successfulExecutions = this.executionHistory.filter(r => r.success).length;
    const failedExecutions = totalExecutions - successfulExecutions;
    
    const protocolCounts: { [key: string]: number } = {};
    let totalDuration = 0;
    
    this.executionHistory.forEach(result => {
      protocolCounts[result.protocolName] = (protocolCounts[result.protocolName] || 0) + 1;
      totalDuration += this.parseDuration(result.duration);
    });
    
    const mostUsedProtocol = Object.entries(protocolCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'none';
    
    return {
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      averageDuration: totalExecutions > 0 ? totalDuration / totalExecutions : 0,
      mostUsedProtocol
    };
  }

  private formatDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${seconds}s`;
  }

  private parseDuration(durationStr: string): number {
    const match = durationStr.match(/(\d+)m\s*(\d+)s/);
    if (match) {
      const minutes = parseInt(match[1]);
      const seconds = parseInt(match[2]);
      return (minutes * 60 + seconds) * 1000;
    }
    
    const secondsMatch = durationStr.match(/(\d+)s/);
    if (secondsMatch) {
      return parseInt(secondsMatch[1]) * 1000;
    }
    
    return 0;
  }

  private saveExecutionHistory(): void {
    try {
      const fs = require('fs');
      const path = require('path');
      
      const historyPath = path.join(process.cwd(), 'data/protocols/execution-history.json');
      const dir = path.dirname(historyPath);
      
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(historyPath, JSON.stringify(this.executionHistory, null, 2));
    } catch (error) {
      console.warn('Could not save execution history:', error);
    }
  }

  printProtocolInfo(): void {
    console.log('\n📋 PROTOCOL REGISTRY');
    console.log('='.repeat(80));
    
    Object.entries(this.registry).forEach(([name, info]) => {
      console.log(`\n🔧 ${name.toUpperCase()} PROTOCOL`);
      console.log(`   Version: ${info.version}`);
      console.log(`   Description: ${info.description}`);
      console.log(`   Session Type: ${info.config.sessionType}`);
    });
    
    const stats = this.getProtocolStats();
    console.log('\n📊 EXECUTION STATISTICS');
    console.log('='.repeat(40));
    console.log(`Total Executions: ${stats.totalExecutions}`);
    console.log(`Successful: ${stats.successfulExecutions}`);
    console.log(`Failed: ${stats.failedExecutions}`);
    console.log(`Average Duration: ${this.formatDuration(stats.averageDuration)}`);
    console.log(`Most Used: ${stats.mostUsedProtocol}`);
  }
}

// CLI interface for direct usage
if (require.main === module) {
  const manager = new ProtocolManager();
  const args = process.argv.slice(2);
  const command = args[0];
  
  (async () => {
    try {
      switch (command) {
        case 'list':
          manager.printProtocolInfo();
          break;
          
        case 'execute':
          const protocolName = args[1];
          const protocolArgs = args.slice(2);
          
          if (!protocolName) {
            console.log('Usage: node src/holons/protocols/protocol-manager.ts execute <protocol-name> [args...]');
            process.exit(1);
          }
          
          await manager.executeProtocol(protocolName, protocolArgs);
          break;
          
        case 'stats':
          const stats = manager.getProtocolStats();
          console.log('\n📊 PROTOCOL STATISTICS');
          console.log('='.repeat(40));
          console.log(`Total Executions: ${stats.totalExecutions}`);
          console.log(`Successful: ${stats.successfulExecutions}`);
          console.log(`Failed: ${stats.failedExecutions}`);
          console.log(`Average Duration: ${manager['formatDuration'](stats.averageDuration)}`);
          console.log(`Most Used: ${stats.mostUsedProtocol}`);
          break;
          
        default:
          console.log('Usage: node src/holons/protocols/protocol-manager.ts <command> [args...]');
          console.log('Commands:');
          console.log('  list                    - List all registered protocols');
          console.log('  execute <name> [args]   - Execute a specific protocol');
          console.log('  stats                   - Show execution statistics');
          process.exit(1);
      }
    } catch (error) {
      console.error('❌ Protocol manager failed:', error);
      process.exit(1);
    }
  })();
} 