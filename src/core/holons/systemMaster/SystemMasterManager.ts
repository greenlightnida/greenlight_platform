#!/usr/bin/env tsx

/**
 * SystemMasterManager - Central System Coordination and Governance
 * 
 * PURPOSE: Serve as the central coordination hub for all system operations
 * - Coordinate all managers across holons
 * - Manage system-wide governance and policies
 * - Handle cross-holon communication and dependencies
 * - Monitor system health and performance
 * - Orchestrate system-wide events and operations
 * 
 * USAGE: import { SystemMasterManager } from './core/holons/systemMaster/SystemMasterManager';
 */

import { EventEmitter } from 'events';
import fs from 'fs';
import path from 'path';

// Types
export interface SystemManager {
  name: string;
  status: 'active' | 'inactive' | 'error';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  health: number; // 0-100
  lastUpdated: Date;
  dependencies: string[];
  capabilities: string[];
}

export interface SystemHolon {
  name: string;
  managers: Map<string, SystemManager>;
  status: 'healthy' | 'degraded' | 'critical';
  health: number; // 0-100
  lastUpdated: Date;
}

export interface SystemEvent {
  id: string;
  type: 'manager_status_change' | 'holon_health_change' | 'system_alert' | 'coordination_event';
  source: string;
  target?: string;
  data: any;
  timestamp: Date;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface SystemHealth {
  overall: number; // 0-100
  holons: Record<string, number>;
  managers: Record<string, number>;
  alerts: SystemEvent[];
  lastUpdated: Date;
}

export interface SystemMasterManagerState {
  systemCoordination: {
    activeManagers: Map<string, SystemManager>;
    activeHolons: Map<string, SystemHolon>;
    coordinationStatus: 'ACTIVE' | 'DEGRADED' | 'FAILED';
    lastCoordination: Date;
  };
  systemGovernance: {
    policies: Map<string, any>;
    compliance: Record<string, boolean>;
    auditTrail: SystemEvent[];
    governanceStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'UNKNOWN';
  };
  systemHealth: {
    current: SystemHealth;
    history: SystemHealth[];
    monitoring: {
      enabled: boolean;
      interval: number;
      thresholds: {
        critical: number;
        warning: number;
        healthy: number;
      };
    };
  };
  systemEvents: {
    eventQueue: SystemEvent[];
    eventHistory: SystemEvent[];
    eventHandlers: Map<string, Function>;
    processingStatus: 'IDLE' | 'PROCESSING' | 'ERROR';
  };
  systemCommunication: {
    channels: Map<string, EventEmitter>;
    protocols: Map<string, any>;
    routing: Map<string, string[]>;
    communicationStatus: 'ACTIVE' | 'DEGRADED' | 'FAILED';
  };
}

export class SystemMasterManager extends EventEmitter {
  private static instance: SystemMasterManager;
  private state: SystemMasterManagerState;
  private configPath: string;
  private monitoringInterval: NodeJS.Timeout | null = null;

  private constructor() {
    super();
    this.configPath = path.resolve(process.cwd(), 'config', 'system-master');
    this.state = this.initializeState();
    this.initializeSystemMasterManager();
  }

  public static getInstance(): SystemMasterManager {
    if (!SystemMasterManager.instance) {
      SystemMasterManager.instance = new SystemMasterManager();
    }
    return SystemMasterManager.instance;
  }

  private initializeState(): SystemMasterManagerState {
    return {
      systemCoordination: {
        activeManagers: new Map(),
        activeHolons: new Map(),
        coordinationStatus: 'ACTIVE',
        lastCoordination: new Date()
      },
      systemGovernance: {
        policies: new Map(),
        compliance: {},
        auditTrail: [],
        governanceStatus: 'UNKNOWN'
      },
      systemHealth: {
        current: {
          overall: 100,
          holons: {},
          managers: {},
          alerts: [],
          lastUpdated: new Date()
        },
        history: [],
        monitoring: {
          enabled: true,
          interval: 30000, // 30 seconds
          thresholds: {
            critical: 50,
            warning: 75,
            healthy: 90
          }
        }
      },
      systemEvents: {
        eventQueue: [],
        eventHistory: [],
        eventHandlers: new Map(),
        processingStatus: 'IDLE'
      },
      systemCommunication: {
        channels: new Map(),
        protocols: new Map(),
        routing: new Map(),
        communicationStatus: 'ACTIVE'
      }
    };
  }

  private async initializeSystemMasterManager(): Promise<void> {
    try {
      console.log('🚀 Initializing SystemMasterManager...');
      
      // Load configuration
      await this.loadConfiguration();
      
      // Initialize system holons
      await this.initializeSystemHolons();
      
      // Setup event handlers
      await this.setupEventHandlers();
      
      // Start monitoring
      await this.startMonitoring();
      
      // Setup communication channels
      await this.setupCommunicationChannels();
      
      console.log('✅ SystemMasterManager initialized successfully');
      this.emit('initialized', { timestamp: new Date() });
      
    } catch (error) {
      console.error('❌ Failed to initialize SystemMasterManager:', error);
      this.emit('initialization_error', { error, timestamp: new Date() });
      throw error;
    }
  }

  private async loadConfiguration(): Promise<void> {
    try {
      const configFile = path.join(this.configPath, 'system-master-config.json');
      
      if (fs.existsSync(configFile)) {
        const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
        
        // Load policies
        if (config.policies) {
          for (const [key, value] of Object.entries(config.policies)) {
            this.state.systemGovernance.policies.set(key, value);
          }
        }
        
        // Load monitoring configuration
        if (config.monitoring) {
          this.state.systemHealth.monitoring = {
            ...this.state.systemHealth.monitoring,
            ...config.monitoring
          };
        }
        
        console.log('📋 Configuration loaded successfully');
      } else {
        console.log('⚠️  No configuration file found, using defaults');
      }
    } catch (error) {
      console.warn('⚠️  Failed to load configuration:', error.message);
    }
  }

  private async initializeSystemHolons(): Promise<void> {
    // Initialize System Holon
    const systemHolon: SystemHolon = {
      name: 'System Holon',
      managers: new Map(),
      status: 'healthy',
      health: 100,
      lastUpdated: new Date()
    };
    
    // Initialize Product Holon
    const productHolon: SystemHolon = {
      name: 'Product Holon',
      managers: new Map(),
      status: 'healthy',
      health: 100,
      lastUpdated: new Date()
    };
    
    this.state.systemCoordination.activeHolons.set('system', systemHolon);
    this.state.systemCoordination.activeHolons.set('product', productHolon);
    
    console.log('🏗️  System holons initialized');
  }

  private async setupEventHandlers(): Promise<void> {
    // Register event handlers
    this.state.systemEvents.eventHandlers.set('manager_status_change', this.handleManagerStatusChange.bind(this));
    this.state.systemEvents.eventHandlers.set('holon_health_change', this.handleHolonHealthChange.bind(this));
    this.state.systemEvents.eventHandlers.set('system_alert', this.handleSystemAlert.bind(this));
    this.state.systemEvents.eventHandlers.set('coordination_event', this.handleCoordinationEvent.bind(this));
    
    console.log('🎯 Event handlers registered');
  }

  private async startMonitoring(): Promise<void> {
    if (this.state.systemHealth.monitoring.enabled) {
      this.monitoringInterval = setInterval(() => {
        this.performHealthCheck();
      }, this.state.systemHealth.monitoring.interval);
      
      console.log('📊 Health monitoring started');
    }
  }

  private async setupCommunicationChannels(): Promise<void> {
    // Setup communication channels for each holon
    for (const [holonName, holon] of this.state.systemCoordination.activeHolons) {
      const channel = new EventEmitter();
      this.state.systemCommunication.channels.set(holonName, channel);
      
      // Setup routing
      this.state.systemCommunication.routing.set(holonName, []);
    }
    
    console.log('📡 Communication channels established');
  }

  // Public API Methods

  /**
   * Register a manager with the system
   */
  public async registerManager(manager: SystemManager): Promise<void> {
    try {
      this.state.systemCoordination.activeManagers.set(manager.name, manager);
      
      // Add to appropriate holon
      const holon = this.determineHolonForManager(manager.name);
      if (holon) {
        holon.managers.set(manager.name, manager);
      }
      
      // Emit event
      this.emit('manager_registered', { manager, timestamp: new Date() });
      
      console.log(`✅ Manager registered: ${manager.name}`);
    } catch (error) {
      console.error(`❌ Failed to register manager ${manager.name}:`, error);
      throw error;
    }
  }

  /**
   * Unregister a manager from the system
   */
  public async unregisterManager(managerName: string): Promise<void> {
    try {
      this.state.systemCoordination.activeManagers.delete(managerName);
      
      // Remove from holons
      for (const holon of this.state.systemCoordination.activeHolons.values()) {
        holon.managers.delete(managerName);
      }
      
      // Emit event
      this.emit('manager_unregistered', { managerName, timestamp: new Date() });
      
      console.log(`✅ Manager unregistered: ${managerName}`);
    } catch (error) {
      console.error(`❌ Failed to unregister manager ${managerName}:`, error);
      throw error;
    }
  }

  /**
   * Get system health status
   */
  public getSystemHealth(): SystemHealth {
    return this.state.systemHealth.current;
  }

  /**
   * Get all active managers
   */
  public getActiveManagers(): Map<string, SystemManager> {
    return this.state.systemCoordination.activeManagers;
  }

  /**
   * Get all active holons
   */
  public getActiveHolons(): Map<string, SystemHolon> {
    return this.state.systemCoordination.activeHolons;
  }

  /**
   * Emit a system event
   */
  public async emitSystemEvent(event: Omit<SystemEvent, 'id' | 'timestamp'>): Promise<void> {
    const systemEvent: SystemEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: new Date()
    };
    
    this.state.systemEvents.eventQueue.push(systemEvent);
    this.state.systemEvents.eventHistory.push(systemEvent);
    
    // Process event
    await this.processEvent(systemEvent);
    
    // Emit to listeners
    this.emit('system_event', systemEvent);
  }

  /**
   * Coordinate all managers
   */
  public async coordinateManagers(): Promise<void> {
    try {
      console.log('🔄 Starting manager coordination...');
      
      // Update coordination status
      this.state.systemCoordination.coordinationStatus = 'ACTIVE';
      this.state.systemCoordination.lastCoordination = new Date();
      
      // Coordinate each holon
      for (const [holonName, holon] of this.state.systemCoordination.activeHolons) {
        await this.coordinateHolon(holonName, holon);
      }
      
      // Update system health
      await this.updateSystemHealth();
      
      console.log('✅ Manager coordination completed');
      
    } catch (error) {
      console.error('❌ Manager coordination failed:', error);
      this.state.systemCoordination.coordinationStatus = 'FAILED';
      throw error;
    }
  }

  // Private helper methods

  private determineHolonForManager(managerName: string): SystemHolon | null {
    // Logic to determine which holon a manager belongs to
    if (managerName.includes('System') || managerName.includes('Governance') || 
        managerName.includes('Repository') || managerName.includes('Policy')) {
      return this.state.systemCoordination.activeHolons.get('system') || null;
    } else if (managerName.includes('Product') || managerName.includes('Elevate') || 
               managerName.includes('Coaching') || managerName.includes('Player')) {
      return this.state.systemCoordination.activeHolons.get('product') || null;
    }
    
    return this.state.systemCoordination.activeHolons.get('system') || null;
  }

  private async coordinateHolon(holonName: string, holon: SystemHolon): Promise<void> {
    // Coordinate managers within the holon
    for (const [managerName, manager] of holon.managers) {
      // Update manager status
      manager.lastUpdated = new Date();
      
      // Check dependencies
      await this.checkManagerDependencies(manager);
      
      // Update holon health based on manager health
      holon.health = this.calculateHolonHealth(holon);
      holon.lastUpdated = new Date();
    }
    
    // Update holon status
    holon.status = this.determineHolonStatus(holon.health);
  }

  private async checkManagerDependencies(manager: SystemManager): Promise<void> {
    for (const dependency of manager.dependencies) {
      const dependentManager = this.state.systemCoordination.activeManagers.get(dependency);
      if (!dependentManager || dependentManager.status === 'error') {
        manager.status = 'error';
        manager.health = 0;
        break;
      }
    }
  }

  private calculateHolonHealth(holon: SystemHolon): number {
    if (holon.managers.size === 0) return 100;
    
    let totalHealth = 0;
    let managerCount = 0;
    
    for (const manager of holon.managers.values()) {
      totalHealth += manager.health;
      managerCount++;
    }
    
    return Math.round(totalHealth / managerCount);
  }

  private determineHolonStatus(health: number): 'healthy' | 'degraded' | 'critical' {
    if (health >= this.state.systemHealth.monitoring.thresholds.healthy) {
      return 'healthy';
    } else if (health >= this.state.systemHealth.monitoring.thresholds.warning) {
      return 'degraded';
    } else {
      return 'critical';
    }
  }

  private async updateSystemHealth(): Promise<void> {
    // Calculate overall system health
    let totalHealth = 0;
    let holonCount = 0;
    
    for (const [holonName, holon] of this.state.systemCoordination.activeHolons) {
      this.state.systemHealth.current.holons[holonName] = holon.health;
      totalHealth += holon.health;
      holonCount++;
    }
    
    // Calculate manager health
    for (const [managerName, manager] of this.state.systemCoordination.activeManagers) {
      this.state.systemHealth.current.managers[managerName] = manager.health;
    }
    
    // Update overall health
    this.state.systemHealth.current.overall = Math.round(totalHealth / holonCount);
    this.state.systemHealth.current.lastUpdated = new Date();
    
    // Add to history
    this.state.systemHealth.history.push({ ...this.state.systemHealth.current });
    
    // Keep only last 100 entries
    if (this.state.systemHealth.history.length > 100) {
      this.state.systemHealth.history.shift();
    }
  }

  private async performHealthCheck(): Promise<void> {
    try {
      await this.coordinateManagers();
      
      // Check for critical issues
      if (this.state.systemHealth.current.overall < this.state.systemHealth.monitoring.thresholds.critical) {
        await this.emitSystemEvent({
          type: 'system_alert',
          source: 'SystemMasterManager',
          data: {
            message: 'System health critical',
            health: this.state.systemHealth.current.overall
          },
          priority: 'CRITICAL'
        });
      }
      
    } catch (error) {
      console.error('❌ Health check failed:', error);
    }
  }

  private async processEvent(event: SystemEvent): Promise<void> {
    try {
      this.state.systemEvents.processingStatus = 'PROCESSING';
      
      const handler = this.state.systemEvents.eventHandlers.get(event.type);
      if (handler) {
        await handler(event);
      }
      
      this.state.systemEvents.processingStatus = 'IDLE';
    } catch (error) {
      console.error('❌ Event processing failed:', error);
      this.state.systemEvents.processingStatus = 'ERROR';
    }
  }

  private async handleManagerStatusChange(event: SystemEvent): Promise<void> {
    console.log(`📊 Manager status change: ${event.source} -> ${event.data.status}`);
  }

  private async handleHolonHealthChange(event: SystemEvent): Promise<void> {
    console.log(`🏗️  Holon health change: ${event.source} -> ${event.data.health}`);
  }

  private async handleSystemAlert(event: SystemEvent): Promise<void> {
    console.log(`🚨 System alert: ${event.data.message}`);
    this.state.systemHealth.current.alerts.push(event);
  }

  private async handleCoordinationEvent(event: SystemEvent): Promise<void> {
    console.log(`🔄 Coordination event: ${event.data.message}`);
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Shutdown the SystemMasterManager
   */
  public async shutdown(): Promise<void> {
    try {
      console.log('🛑 Shutting down SystemMasterManager...');
      
      // Stop monitoring
      if (this.monitoringInterval) {
        clearInterval(this.monitoringInterval);
        this.monitoringInterval = null;
      }
      
      // Clear all managers
      this.state.systemCoordination.activeManagers.clear();
      
      // Clear all holons
      this.state.systemCoordination.activeHolons.clear();
      
      // Clear event handlers
      this.state.systemEvents.eventHandlers.clear();
      
      console.log('✅ SystemMasterManager shutdown complete');
      this.emit('shutdown', { timestamp: new Date() });
      
    } catch (error) {
      console.error('❌ SystemMasterManager shutdown failed:', error);
      throw error;
    }
  }
}

export default SystemMasterManager; 