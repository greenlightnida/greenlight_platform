import { Protocol } from './Protocol';

/**
 * Protocol Manager
 * 
 * PURPOSE: Centralized management and coordination of all protocols in the system.
 * Provides registration, execution, validation, and monitoring capabilities for
 * the protocols holon.
 * 
 * USAGE: Import and instantiate ProtocolManager to manage protocol lifecycle
 * 
 * FEATURES:
 * - Protocol registration and discovery
 * - Protocol execution with error handling
 * - Protocol validation and health checks
 * - Protocol coordination and dependencies
 * - Protocol monitoring and reporting
 */

export interface ProtocolMetadata {
  name: string;
  version: string;
  description: string;
  dependencies: string[];
  executionTime: number;
  lastExecuted?: Date;
  status: 'active' | 'inactive' | 'error';
}

export class ProtocolManager {
  private protocols: Map<string, Protocol> = new Map();
  private metadata: Map<string, ProtocolMetadata> = new Map();
  private executionHistory: Array<{
    protocolName: string;
    timestamp: Date;
    duration: number;
    status: 'success' | 'error';
    error?: string;
  }> = [];

  constructor() {
    this.initializeDefaultProtocols();
  }

  /**
   * Register a protocol with the manager
   * @param name
   * @param protocol
   * @param metadata
   */
  registerProtocol(name: string, protocol: Protocol, metadata: ProtocolMetadata): void {
    this.protocols.set(name, protocol);
    this.metadata.set(name, metadata);
    console.log(`✅ Protocol registered: ${name} v${metadata.version}`);
  }

  /**
   * Execute a protocol with proper error handling and logging
   * @param name
   * @param options
   */
  async executeProtocol(name: string, options?: any): Promise<any> {
    const protocol = this.protocols.get(name);
    const metadata = this.metadata.get(name);

    if (!protocol || !metadata) {
      throw new Error(`Protocol '${name}' not found`);
    }

    const startTime = Date.now();
    console.log(`🚀 Executing protocol: ${name} v${metadata.version}`);

    try {
      // Validate dependencies
      await this.validateDependencies(metadata.dependencies);

      // Execute the protocol
      const result = await protocol.execute(options);

      // Record successful execution
      const duration = Date.now() - startTime;
      this.recordExecution(name, duration, 'success');
      this.updateMetadata(name, { lastExecuted: new Date(), status: 'active' });

      console.log(`✅ Protocol completed: ${name} (${duration}ms)`);
      return result;

    } catch (error) {
      // Record failed execution
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.recordExecution(name, duration, 'error', errorMessage);
      this.updateMetadata(name, { status: 'error' });

      console.error(`❌ Protocol failed: ${name} - ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Validate protocol dependencies
   * @param dependencies
   */
  private async validateDependencies(dependencies: string[]): Promise<void> {
    for (const dep of dependencies) {
      if (!this.protocols.has(dep)) {
        throw new Error(`Dependency '${dep}' not found`);
      }
    }
  }

  /**
   * Validate if a protocol exists and is healthy
   * @param name
   */
  validateProtocol(name: string): boolean {
    const protocol = this.protocols.get(name);
    const metadata = this.metadata.get(name);
    
    return !!(protocol && metadata && metadata.status === 'active');
  }

  /**
   * Get list of all registered protocols
   */
  listProtocols(): string[] {
    return Array.from(this.protocols.keys());
  }

  /**
   * Get protocol metadata
   * @param name
   */
  getProtocolMetadata(name: string): ProtocolMetadata | undefined {
    return this.metadata.get(name);
  }

  /**
   * Get execution history for a protocol
   * @param name
   */
  getExecutionHistory(name: string) {
    return this.executionHistory.filter(exec => exec.protocolName === name);
  }

  /**
   * Get system health report
   */
  getHealthReport() {
    const totalProtocols = this.protocols.size;
    const activeProtocols = Array.from(this.metadata.values()).filter(m => m.status === 'active').length;
    const errorProtocols = Array.from(this.metadata.values()).filter(m => m.status === 'error').length;

    return {
      totalProtocols,
      activeProtocols,
      errorProtocols,
      healthScore: Math.round((activeProtocols / totalProtocols) * 100),
      lastExecutions: this.executionHistory.slice(-10)
    };
  }

  /**
   * Record protocol execution
   * @param name
   * @param duration
   * @param status
   * @param error
   */
  private recordExecution(name: string, duration: number, status: 'success' | 'error', error?: string): void {
    this.executionHistory.push({
      protocolName: name,
      timestamp: new Date(),
      duration,
      status,
      error
    });

    // Keep only last 100 executions
    if (this.executionHistory.length > 100) {
      this.executionHistory = this.executionHistory.slice(-100);
    }
  }

  /**
   * Update protocol metadata
   * @param name
   * @param updates
   */
  private updateMetadata(name: string, updates: Partial<ProtocolMetadata>): void {
    const metadata = this.metadata.get(name);
    if (metadata) {
      this.metadata.set(name, { ...metadata, ...updates });
    }
  }

  /**
   * Initialize default protocols
   */
  private initializeDefaultProtocols(): void {
    console.log('🔧 Initializing Protocol Manager with default protocols');
    
    // Register core protocols
    this.registerProtocol('launch', {
      execute: async (options) => {
        console.log('🚀 Launch protocol executed');
        return { status: 'launched' };
      }
    } as Protocol, {
      name: 'launch',
      version: '1.0.0',
      description: 'System launch protocol',
      dependencies: [],
      executionTime: 5000,
      status: 'active'
    });

    this.registerProtocol('wrap', {
      execute: async (options) => {
        console.log('📦 Wrap protocol executed');
        return { status: 'wrapped' };
      }
    } as Protocol, {
      name: 'wrap',
      version: '1.0.0',
      description: 'System wrap protocol',
      dependencies: [],
      executionTime: 3000,
      status: 'active'
    });
  }
}

// Export singleton instance
export const protocolManager = new ProtocolManager(); 