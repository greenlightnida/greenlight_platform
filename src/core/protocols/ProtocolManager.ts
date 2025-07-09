import { EventEmitter } from 'events';
import fs from 'fs';
import path from 'path';

export interface Protocol {
  _id: string;
  name: string;
  description: string;
  version: string;
  category: 'governance' | 'development' | 'deployment' | 'maintenance' | 'security';
  enabled: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  triggers: ProtocolTrigger[];
  steps: ProtocolStep[];
  metadata: Record<string, unknown>;
  _createdAt: Date;
  updatedAt: Date;
}

export interface ProtocolTrigger {
  type: 'manual' | 'scheduled' | 'event' | 'condition';
  config: Record<string, unknown>;
}

export interface ProtocolStep {
  _id: string;
  name: string;
  description: string;
  type: 'action' | 'validation' | 'notification' | 'decision';
  config: Record<string, unknown>;
  _required: boolean;
  order: number;
}

export interface ProtocolExecution {
  id: string;
  protocolId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startTime: Date;
  endTime?: Date;
  currentStep?: string;
  results: ProtocolStepResult[];
  metadata: Record<string, unknown>;
}

export interface ProtocolStepResult {
  _stepId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startTime: Date;
  endTime?: Date;
  output?: Record<string, unknown>;
  error?: string;
}

class ProtocolManager extends EventEmitter {
  private _protocols: Map<string, Protocol> = new Map();
  private _executions: Map<string, ProtocolExecution> = new Map();
  private _protocolsPath!: string;

  constructor(protocolsPath?: string) {
    super();
    this._protocolsPath = protocolsPath || path.join(process.cwd(), 'scripts', 'protocols');
    this.loadProtocols();
  }

  private loadProtocols(): void {
    try {
      if (fs.existsSync(this._protocolsPath)) {
        const files = fs.readdirSync(this._protocolsPath);
        for (const file of files) {
          if (file.endsWith('.cjs') || file.endsWith('.js')) {
            this.loadProtocolFromFile(file);
          }
        }
      }
    } catch (error) {
      console.error('Error loading _protocols: ', error);
    }
  }

  private loadProtocolFromFile(filename: string): void {
    try {
      const protocolId = path.basename(filename, path.extname(filename));
      // Create a basic protocol definition for the file
      const protocol: Protocol = {
        _id: protocolId,
        name: protocolId.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase()),
        description: `Protocol loaded from ${filename}`,
        version: '1.0.0',
        category: 'maintenance',
        enabled: true,
        priority: 'medium',
        triggers: [{ type: 'manual', config: {} }],
        steps: [{
          _id: 'execute',
          name: 'Execute Protocol',
          description: `Execute the ${protocolId} protocol`,
          type: 'action',
          config: { file: filename },
          _required: true,
          order: 1
        }],
        metadata: { sourceFile: filename },
        _createdAt: new Date(),
        updatedAt: new Date()
      };
      this._protocols.set(protocolId, protocol);
    } catch (error) {
      console.error(`Error loading protocol from ${filename}:`, error);
    }
  }

  addProtocol(protocol: Protocol): void {
    this._protocols.set(protocol._id, protocol);
    this.emit('protocol-added', protocol);
  }

  removeProtocol(protocolId: string): boolean {
    const removed = this._protocols.delete(protocolId);
    if (removed) {
      this.emit('protocol-removed', protocolId);
    }
    return removed;
  }

  getProtocol(protocolId: string): Protocol | undefined {
    return this._protocols.get(protocolId);
  }

  getProtocols(category?: string): Protocol[] {
    const protocols = Array.from(this._protocols.values());
    return category 
      ? protocols.filter((p: any) => p.category === category)
      : protocols;
  }

  async executeProtocol(protocolId: string, metadata?: Record<string, unknown>): Promise<ProtocolExecution> {
    const protocol = this._protocols.get(protocolId);
    if (!protocol) {
      throw new Error(`Protocol ${protocolId} not found`);
    }

    if (!protocol.enabled) {
      throw new Error(`Protocol ${protocolId} is disabled`);
    }

    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const execution: ProtocolExecution = {
      id: executionId,
      protocolId,
      status: 'pending',
      startTime: new Date(),
      results: [],
      metadata: metadata || {}
    };

    this._executions.set(executionId, execution);
    this.emit('execution-started', execution);

    try {
      execution.status = 'running';
      
      // Execute protocol steps in order
      const sortedSteps = protocol.steps.sort((a, b) => a.order - b.order);
      
      for (const step of sortedSteps) {
        execution.currentStep = step._id;
        const stepResult = await this.executeStep(step, execution);
        execution.results.push(stepResult);
        
        if (stepResult.status === 'failed' && step._required) {
          execution.status = 'failed';
          execution.endTime = new Date();
          this.emit('execution-failed', execution);
          return execution;
        }
      }

      execution.status = 'completed';
      execution.endTime = new Date();
      this.emit('execution-completed', execution);
      
    } catch (error) {
      execution.status = 'failed';
      execution.endTime = new Date();
      this.emit('execution-failed', execution);
    }

    return execution;
  }

  private async executeStep(step: ProtocolStep, _execution: ProtocolExecution): Promise<ProtocolStepResult> {
    const stepResult: ProtocolStepResult = {
      _stepId: step._id,
      status: 'running',
      startTime: new Date()
    };

    try {
      switch (step.type) {
        case 'action':
          stepResult.output = await this.executeAction(step, _execution);
          break;
        case 'validation':
          stepResult.output = await this.executeValidation(step, _execution);
          break;
        case 'notification':
          stepResult.output = await this.executeNotification(step, _execution);
          break;
        case 'decision':
          stepResult.output = await this.executeDecision(step, _execution);
          break;
      }

      stepResult.status = 'completed';
      stepResult.endTime = new Date();
      
    } catch (error) {
      stepResult.status = 'failed';
      stepResult.endTime = new Date();
      stepResult.error = error instanceof Error ? error.message : String(error);
    }

    return stepResult;
  }

  private async executeAction(step: ProtocolStep, _execution: ProtocolExecution): Promise<Record<string, unknown>> {
    // For now, just return a success response
    // In a real implementation, this would execute the actual action
    return { _success: true, _message: `Action executed successfully` };
  }

  private async executeValidation(step: ProtocolStep, _execution: ProtocolExecution): Promise<Record<string, unknown>> {
    // For now, just return a validation success
    return { _valid: true, _message: `Validation passed` };
  }

  private async executeNotification(step: ProtocolStep, _execution: ProtocolExecution): Promise<Record<string, unknown>> {
    // For now, just return a notification sent response
    return { _sent: true, _message: `Notification sent` };
  }

  private async executeDecision(step: ProtocolStep, _execution: ProtocolExecution): Promise<Record<string, unknown>> {
    // For now, just return a decision made response
    return { _decision: 'proceed', _message: `Decision made` };
  }

  getExecution(executionId: string): ProtocolExecution | undefined {
    return this._executions.get(executionId);
  }

  getExecutions(protocolId?: string): ProtocolExecution[] {
    const executions = Array.from(this._executions.values());
    return protocolId 
      ? executions.filter((e: any) => e.protocolId === protocolId)
      : executions;
  }

  cancelExecution(executionId: string): boolean {
    const execution = this._executions.get(executionId);
    if (execution && execution.status === 'running') {
      execution.status = 'cancelled';
      execution.endTime = new Date();
      this.emit('execution-cancelled', execution);
      return true;
    }
    return false;
  }

  getStats(): {
    _totalProtocols: number;
    enabledProtocols: number;
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
  } {
    const protocols = Array.from(this._protocols.values());
    const executions = Array.from(this._executions.values());
    
    return {
      _totalProtocols: protocols.length,
      enabledProtocols: protocols.filter((p: any) => p.enabled).length,
      totalExecutions: executions.length,
      successfulExecutions: executions.filter((e: any) => e.status === 'completed').length,
      failedExecutions: executions.filter((e: any) => e.status === 'failed').length
    };
  }
}
