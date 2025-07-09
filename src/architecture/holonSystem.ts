/**
 * Holon System Architecture
 * 
 * PURPOSE: Defines the core holon system architecture and governance structure
 * for the Greenlight Platform. This file establishes the foundational
 * architecture that all holons must follow.
 * 
 * ARCHITECTURE PRINCIPLES:
 * - Holons are self-contained but interconnected
 * - Each holon has governance, operations, and monitoring
 * - Holons communicate through standardized protocols
 * - System-wide coordination through SystemMaster
 */

import { EventEmitter } from 'events';

// Core Holon Interface
export interface IHolon {
  id: string;
  name: string;
  type: 'system' | 'feature' | 'product' | 'session' | 'user';
  status: 'active' | 'inactive' | 'error';
  governance: IHolonGovernance;
  operations: IHolonOperations;
  monitoring: IHolonMonitoring;
  events: EventEmitter;
  
  initialize(): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void>;
  getHealth(): Promise<IHolonHealth>;
}

// Holon Governance Interface
export interface IHolonGovernance {
  policies: Map<string, any>;
  protocols: Map<string, any>;
  compliance: IComplianceStatus;
  
  addPolicy(name: string, policy: any): void;
  addProtocol(name: string, protocol: any): void;
  checkCompliance(): Promise<IComplianceStatus>;
}

// Holon Operations Interface
export interface IHolonOperations {
  services: Map<string, any>;
  workflows: Map<string, any>;
  data: Map<string, any>;
  
  registerService(name: string, service: any): void;
  registerWorkflow(name: string, workflow: any): void;
  executeWorkflow(name: string, data: any): Promise<any>;
}

// Holon Monitoring Interface
export interface IHolonMonitoring {
  metrics: Map<string, number>;
  alerts: Array<IAlert>;
  logs: Array<ILogEntry>;
  
  recordMetric(name: string, value: number): void;
  addAlert(alert: IAlert): void;
  addLog(entry: ILogEntry): void;
  getHealthMetrics(): Promise<IHolonHealth>;
}

// Supporting Interfaces
export interface IComplianceStatus {
  compliant: boolean;
  violations: Array<string>;
  lastCheck: Date;
}

export interface IHolonHealth {
  status: 'healthy' | 'warning' | 'critical';
  score: number;
  metrics: Map<string, number>;
  lastUpdate: Date;
}

export interface IAlert {
  id: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  timestamp: Date;
  source: string;
}

export interface ILogEntry {
  id: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: Date;
  context: Record<string, any>;
}

// SystemMaster Interface
export interface ISystemMaster {
  holons: Map<string, IHolon>;
  governance: ISystemGovernance;
  coordination: ISystemCoordination;
  
  registerHolon(holon: IHolon): void;
  unregisterHolon(holonId: string): void;
  getHolon(holonId: string): IHolon | undefined;
  getAllHolons(): Array<IHolon>;
  getSystemHealth(): Promise<ISystemHealth>;
}

// System Governance Interface
export interface ISystemGovernance {
  policies: Map<string, any>;
  protocols: Map<string, any>;
  compliance: ISystemCompliance;
  
  addSystemPolicy(name: string, policy: any): void;
  addSystemProtocol(name: string, protocol: any): void;
  checkSystemCompliance(): Promise<ISystemCompliance>;
}

// System Coordination Interface
export interface ISystemCoordination {
  events: EventEmitter;
  workflows: Map<string, any>;
  communication: ICommunicationManager;
  
  registerWorkflow(name: string, workflow: any): void;
  executeSystemWorkflow(name: string, data: any): Promise<any>;
  broadcastEvent(event: string, data: any): void;
}

// Supporting System Interfaces
export interface ISystemCompliance {
  compliant: boolean;
  violations: Array<string>;
  holonCompliance: Map<string, IComplianceStatus>;
  lastCheck: Date;
}

export interface ISystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  score: number;
  holonHealth: Map<string, IHolonHealth>;
  systemMetrics: Map<string, number>;
  lastUpdate: Date;
}

export interface ICommunicationManager {
  channels: Map<string, EventEmitter>;
  
  createChannel(name: string): EventEmitter;
  getChannel(name: string): EventEmitter | undefined;
  broadcastToChannel(channelName: string, event: string, data: any): void;
}

// Base Holon Implementation
export abstract class BaseHolon implements IHolon {
  public id: string;
  public name: string;
  public type: 'system' | 'feature' | 'product' | 'session' | 'user';
  public status: 'active' | 'inactive' | 'error' = 'inactive';
  public governance: IHolonGovernance;
  public operations: IHolonOperations;
  public monitoring: IHolonMonitoring;
  public events: EventEmitter;

  constructor(id: string, name: string, type: 'system' | 'feature' | 'product' | 'session' | 'user') {
    this.id = id;
    this.name = name;
    this.type = type;
    this.events = new EventEmitter();
    
    this.governance = {
      policies: new Map(),
      protocols: new Map(),
      compliance: { compliant: true, violations: [], lastCheck: new Date() },
      addPolicy: (name: string, policy: any) => this.governance.policies.set(name, policy),
      addProtocol: (name: string, protocol: any) => this.governance.protocols.set(name, protocol),
      checkCompliance: async () => this.governance.compliance
    };
    
    this.operations = {
      services: new Map(),
      workflows: new Map(),
      data: new Map(),
      registerService: (name: string, service: any) => this.operations.services.set(name, service),
      registerWorkflow: (name: string, workflow: any) => this.operations.workflows.set(name, workflow),
      executeWorkflow: async (name: string, data: any) => {
        const workflow = this.operations.workflows.get(name);
        if (!workflow) throw new Error(`Workflow ${name} not found`);
        return await workflow(data);
      }
    };
    
    this.monitoring = {
      metrics: new Map(),
      alerts: [],
      logs: [],
      recordMetric: (name: string, value: number) => this.monitoring.metrics.set(name, value),
      addAlert: (alert: IAlert) => this.monitoring.alerts.push(alert),
      addLog: (entry: ILogEntry) => this.monitoring.logs.push(entry),
      getHealthMetrics: async () => this.getHealth()
    };
  }

  abstract initialize(): Promise<void>;
  abstract start(): Promise<void>;
  abstract stop(): Promise<void>;
  
  async getHealth(): Promise<IHolonHealth> {
    const score = this.calculateHealthScore();
    return {
      status: score >= 80 ? 'healthy' : score >= 60 ? 'warning' : 'critical',
      score,
      metrics: this.monitoring.metrics,
      lastUpdate: new Date()
    };
  }

  private calculateHealthScore(): number {
    // Basic health calculation based on status and metrics
    let score = 100;
    
    if (this.status === 'error') score -= 50;
    if (this.status === 'inactive') score -= 20;
    
    // Reduce score based on number of alerts
    const criticalAlerts = this.monitoring.alerts.filter(a => a.level === 'critical').length;
    const errorAlerts = this.monitoring.alerts.filter(a => a.level === 'error').length;
    
    score -= criticalAlerts * 20;
    score -= errorAlerts * 10;
    
    return Math.max(0, score);
  }
}

// Holon System Class
export class HolonSystem {
  private static instance: HolonSystem;
  private systemMaster: ISystemMaster;

  private constructor() {
    this.systemMaster = {
      holons: new Map(),
      governance: {
        policies: new Map(),
        protocols: new Map(),
        compliance: { compliant: true, violations: [], holonCompliance: new Map(), lastCheck: new Date() },
        addSystemPolicy: (name: string, policy: any) => this.systemMaster.governance.policies.set(name, policy),
        addSystemProtocol: (name: string, protocol: any) => this.systemMaster.governance.protocols.set(name, protocol),
        checkSystemCompliance: async () => this.systemMaster.governance.compliance
      },
      coordination: {
        events: new EventEmitter(),
        workflows: new Map(),
        communication: {
          channels: new Map(),
          createChannel: (name: string) => {
            const channel = new EventEmitter();
            this.systemMaster.coordination.communication.channels.set(name, channel);
            return channel;
          },
          getChannel: (name: string) => this.systemMaster.coordination.communication.channels.get(name),
          broadcastToChannel: (channelName: string, event: string, data: any) => {
            const channel = this.systemMaster.coordination.communication.channels.get(channelName);
            if (channel) channel.emit(event, data);
          }
        },
        registerWorkflow: (name: string, workflow: any) => this.systemMaster.coordination.workflows.set(name, workflow),
        executeSystemWorkflow: async (name: string, data: any) => {
          const workflow = this.systemMaster.coordination.workflows.get(name);
          if (!workflow) throw new Error(`System workflow ${name} not found`);
          return await workflow(data);
        },
        broadcastEvent: (event: string, data: any) => this.systemMaster.coordination.events.emit(event, data)
      },
      registerHolon: (holon: IHolon) => this.systemMaster.holons.set(holon.id, holon),
      unregisterHolon: (holonId: string) => this.systemMaster.holons.delete(holonId),
      getHolon: (holonId: string) => this.systemMaster.holons.get(holonId),
      getAllHolons: () => Array.from(this.systemMaster.holons.values()),
      getSystemHealth: async () => this.getSystemHealth()
    };
  }

  public static getInstance(): HolonSystem {
    if (!HolonSystem.instance) {
      HolonSystem.instance = new HolonSystem();
    }
    return HolonSystem.instance;
  }

  public getSystemMaster(): ISystemMaster {
    return this.systemMaster;
  }

  private async getSystemHealth(): Promise<ISystemHealth> {
    const holonHealth = new Map<string, IHolonHealth>();
    let totalScore = 0;
    let holonCount = 0;

    for (const holon of this.systemMaster.holons.values()) {
      const health = await holon.getHealth();
      holonHealth.set(holon.id, health);
      totalScore += health.score;
      holonCount++;
    }

    const averageScore = holonCount > 0 ? totalScore / holonCount : 0;
    const systemMetrics = new Map<string, number>();
    systemMetrics.set('totalHolons', holonCount);
    systemMetrics.set('activeHolons', Array.from(holonHealth.values()).filter(h => h.status === 'healthy').length);

    return {
      status: averageScore >= 80 ? 'healthy' : averageScore >= 60 ? 'warning' : 'critical',
      score: averageScore,
      holonHealth,
      systemMetrics,
      lastUpdate: new Date()
    };
  }
}

// Export the main holon system instance
export const holonSystem = HolonSystem.getInstance();
export const systemMaster = holonSystem.getSystemMaster(); 