import { EventEmitter } from 'events';

import { IntegratedSessionManager } from '../session-management/IntegratedSessionManager';

import { SteeringManager } from './SteeringManager';

export interface ProcessState {
  activeProcesses: string[];
  lastProcess: string | null;
  processHistory: Array<{
    process: string;
    timestamp: Date;
    status: 'started' | 'completed' | 'failed';
    details?: any;
  }>;
  metrics: {
    totalProcesses: number;
    completed: number;
    failed: number;
    running: number;
  };
}

export class ProcessManager extends EventEmitter {
  private static instance: ProcessManager;
  private state: ProcessState;
  private integratedSessionManager: IntegratedSessionManager;
  private steeringManager: SteeringManager;

  private constructor() {
    super();
    this.state = this.initializeState();
    this.integratedSessionManager = new IntegratedSessionManager();
    this.steeringManager = SteeringManager.getInstance();
  }

  public static getInstance(): ProcessManager {
    if (!ProcessManager.instance) {
      ProcessManager.instance = new ProcessManager();
    }
    return ProcessManager.instance;
  }

  private initializeState(): ProcessState {
    return {
      activeProcesses: [],
      lastProcess: null,
      processHistory: [],
      metrics: {
        totalProcesses: 0,
        completed: 0,
        failed: 0,
        running: 0
      }
    };
  }

  public startProcess(process: string, details?: any): void {
    this.state.activeProcesses.push(process);
    this.state.lastProcess = process;
    this.state.metrics.totalProcesses++;
    this.state.metrics.running++;
    this.state.processHistory.push({
      process,
      timestamp: new Date(),
      status: 'started',
      details
    });
    this.emit('processStarted', { process, details });
  }

  public completeProcess(process: string, details?: any): void {
    this.state.activeProcesses = this.state.activeProcesses.filter(p => p !== process);
    this.state.metrics.completed++;
    this.state.metrics.running = Math.max(0, this.state.metrics.running - 1);
    this.state.processHistory.push({
      process,
      timestamp: new Date(),
      status: 'completed',
      details
    });
    this.emit('processCompleted', { process, details });
  }

  public failProcess(process: string, details?: any): void {
    this.state.activeProcesses = this.state.activeProcesses.filter(p => p !== process);
    this.state.metrics.failed++;
    this.state.metrics.running = Math.max(0, this.state.metrics.running - 1);
    this.state.processHistory.push({
      process,
      timestamp: new Date(),
      status: 'failed',
      details
    });
    this.emit('processFailed', { process, details });
  }

  public getState(): ProcessState {
    return this.state;
  }

  public getMetrics() {
    return this.state.metrics;
  }

  public getProcessHistory() {
    return this.state.processHistory;
  }

  // Committee Coordination
  public getCommitteeMembers() {
    return {
      processManager: this,
      integratedSessionManager: this.integratedSessionManager,
      steeringManager: this.steeringManager
    };
  }

  public async healthCheck(): Promise<any> {
    const sessionHealth = await this.integratedSessionManager.healthCheck();
    const steeringHealth = await this.steeringManager.healthCheck();
    return {
      processManager: this.getMetrics(),
      integratedSessionManager: sessionHealth,
      steeringManager: steeringHealth,
      timestamp: new Date().toISOString()
    };
  }
} 