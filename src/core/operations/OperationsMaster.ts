#!/usr/bin/env tsx

/**
 * Operations Master - Operations Orchestration Component
 * 
 * PURPOSE: Orchestrate all operations components and provide unified operations interface
 * - Error Manager Holon integration and coordination
 * - Server Manager and Governor coordination
 * - Unified operations dashboard and API
 * - Cross-component operations intelligence
 * - Operations health monitoring and optimization
 * 
 * USAGE: import { OperationsMaster } from './core/operations/OperationsMaster';
 */

import { EventEmitter } from 'events';
import { ServerManager, ServerConfig } from './ServerManager';
import { ServerGovernor } from './ServerGovernor';
import { ErrorManagerHolon } from '../holons/operations/ErrorManagerHolon';

export interface OperationsStatus {
  systemHealth: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  components: {
    errorManager: 'healthy' | 'warning' | 'error' | 'offline';
    serverManager: 'healthy' | 'warning' | 'error' | 'offline';
    serverGovernor: 'healthy' | 'warning' | 'error' | 'offline';
  };
  metrics: {
    totalServers: number;
    runningServers: number;
    activeErrors: number;
    resolvedErrors: number;
    complianceScore: number;
    costOptimization: number;
  };
  alerts: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  lastUpdated: string;
}

export interface OperationsMetrics {
  performance: {
    responseTime: number;
    throughput: number;
    errorRate: number;
    availability: number;
  };
  resources: {
    cpuUtilization: number;
    memoryUtilization: number;
    diskUtilization: number;
    networkUtilization: number;
  };
  costs: {
    currentCost: number;
    projectedCost: number;
    optimizationPotential: number;
    savings: number;
  };
  compliance: {
    overallScore: number;
    policyViolations: number;
    securityScore: number;
    auditScore: number;
  };
}

export interface OperationsAlert {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: 'errorManager' | 'serverManager' | 'serverGovernor' | 'system';
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  resolved: boolean;
  metadata?: Record<string, any>;
}

export interface OperationsMasterState {
  isInitialized: boolean;
  status: OperationsStatus;
  metrics: OperationsMetrics;
  alerts: Map<string, OperationsAlert>;
  settings: {
    autoResolve: boolean;
    monitoringInterval: number;
    alertRetentionDays: number;
    costOptimizationEnabled: boolean;
    complianceMonitoringEnabled: boolean;
  };
  sessionId: string;
  lastHealthCheck: string;
}

export class OperationsMaster extends EventEmitter {
  private static instance: OperationsMaster;
  private state: OperationsMasterState;
  private errorManager: ErrorManagerHolon;
  private serverManager: ServerManager;
  private serverGovernor: ServerGovernor;
  private monitoringInterval: NodeJS.Timeout | null = null;

  private constructor() {
    super();
    this.state = this.initializeState();
    this.errorManager = new ErrorManagerHolon();
    this.serverManager = ServerManager.getInstance();
    this.serverGovernor = ServerGovernor.getInstance();
    this.initialize();
  }

  public static getInstance(): OperationsMaster {
    if (!OperationsMaster.instance) {
      OperationsMaster.instance = new OperationsMaster();
    }
    return OperationsMaster.instance;
  }

  private initializeState(): OperationsMasterState {
    return {
      isInitialized: false,
      status: {
        systemHealth: 'excellent',
        components: {
          errorManager: 'offline',
          serverManager: 'offline',
          serverGovernor: 'offline'
        },
        metrics: {
          totalServers: 0,
          runningServers: 0,
          activeErrors: 0,
          resolvedErrors: 0,
          complianceScore: 100,
          costOptimization: 0
        },
        alerts: {
          critical: 0,
          high: 0,
          medium: 0,
          low: 0
        },
        lastUpdated: new Date().toISOString()
      },
      metrics: {
        performance: {
          responseTime: 0,
          throughput: 0,
          errorRate: 0,
          availability: 100
        },
        resources: {
          cpuUtilization: 0,
          memoryUtilization: 0,
          diskUtilization: 0,
          networkUtilization: 0
        },
        costs: {
          currentCost: 0,
          projectedCost: 0,
          optimizationPotential: 0,
          savings: 0
        },
        compliance: {
          overallScore: 100,
          policyViolations: 0,
          securityScore: 100,
          auditScore: 100
        }
      },
      alerts: new Map(),
      settings: {
        autoResolve: true,
        monitoringInterval: 30000,
        alertRetentionDays: 30,
        costOptimizationEnabled: true,
        complianceMonitoringEnabled: true
      },
      sessionId: `operations-master-${Date.now()}`,
      lastHealthCheck: new Date().toISOString()
    };
  }

  private async initialize(): Promise<void> {
    try {
      console.log('🎛️ Initializing Operations Master...');

      // Initialize error manager
      await this.initializeErrorManager();

      // Initialize server components
      await this.initializeServerComponents();

      // Setup cross-component event listeners
      this.setupEventListeners();

      // Start monitoring
      this.startMonitoring();

      this.state.isInitialized = true;
      this.emit('initialized');
      
      console.log('✅ Operations Master initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Operations Master:', error);
      throw error;
    }
  }

  private async initializeErrorManager(): Promise<void> {
    try {
      // Wait for error manager to initialize
      await new Promise(resolve => {
        if (this.errorManager.state.isInitialized) {
          resolve(undefined);
        } else {
          this.errorManager.once('initialized', resolve);
        }
      });

      this.state.status.components.errorManager = 'healthy';
      console.log('✅ Error Manager integrated');
    } catch (error) {
      this.state.status.components.errorManager = 'error';
      console.error('❌ Error Manager integration failed:', error);
    }
  }

  private async initializeServerComponents(): Promise<void> {
    try {
      // Server Manager and Governor are singletons, so they should already be initialized
      this.state.status.components.serverManager = 'healthy';
      this.state.status.components.serverGovernor = 'healthy';
      console.log('✅ Server components integrated');
    } catch (error) {
      this.state.status.components.serverManager = 'error';
      this.state.status.components.serverGovernor = 'error';
      console.error('❌ Server components integration failed:', error);
    }
  }

  private setupEventListeners(): void {
    // Error Manager events
    this.errorManager.on('errors-detected', (errors) => {
      this.handleErrorManagerEvent('errors-detected', errors);
    });

    this.errorManager.on('error-resolved', (data) => {
      this.handleErrorManagerEvent('error-resolved', data);
    });

    this.errorManager.on('error-ignored', (data) => {
      this.handleErrorManagerEvent('error-ignored', data);
    });

    // Server Manager events
    this.serverManager.on('server: provisioned', (data) => {
      this.handleServerManagerEvent('server: provisioned', data);
    });

    this.serverManager.on('server: health_check_failed', (data) => {
      this.handleServerManagerEvent('server: health_check_failed', data);
    });

    // Server Governor events
    this.serverGovernor.on('compliance: checked', (data) => {
      this.handleServerGovernorEvent('compliance: checked', data);
    });

    this.serverGovernor.on('policy: violated', (data) => {
      this.handleServerGovernorEvent('policy: violated', data);
    });
  }

  private handleErrorManagerEvent(event: string, data: any): void {
    console.log(`🔧 Error Manager Event: ${event}`, data);
    
    switch (event) {
      case 'errors-detected':
        this.updateErrorMetrics(data);
        this.createAlert('errorManager', 'warning', 'New errors detected', `Detected ${data.length} new errors`);
        break;
      case 'error-resolved':
        this.updateErrorMetrics(data);
        this.createAlert('errorManager', 'success', 'Error resolved', `Resolved error: ${data.error.message}`);
        break;
      case 'error-ignored':
        this.updateErrorMetrics(data);
        this.createAlert('errorManager', 'info', 'Error ignored', `Ignored error: ${data.error.message}`);
        break;
    }

    this.updateOperationsStatus();
  }

  private handleServerManagerEvent(event: string, data: any): void {
    console.log(`🔧 Server Manager Event: ${event}`, data);
    
    switch (event) {
      case 'server: provisioned':
        this.updateServerMetrics();
        this.createAlert('serverManager', 'success', 'Server provisioned', `Server ${data.server.name} provisioned successfully`);
        break;
      case 'server: health_check_failed':
        this.updateServerMetrics();
        this.createAlert('serverManager', 'warning', 'Server health check failed', `Server ${data.serverId} health check failed`);
        break;
    }

    this.updateOperationsStatus();
  }

  private handleServerGovernorEvent(event: string, data: any): void {
    console.log(`🔧 Server Governor Event: ${event}`, data);
    
    switch (event) {
      case 'compliance: checked':
        this.updateComplianceMetrics(data);
        break;
      case 'policy: violated':
        this.updateComplianceMetrics(data);
        this.createAlert('serverGovernor', 'warning', 'Policy violation', `Policy violation detected: ${data.policy.name}`);
        break;
    }

    this.updateOperationsStatus();
  }

  private startMonitoring(): void {
    this.monitoringInterval = setInterval(() => {
      this.performHealthCheck();
    }, this.state.settings.monitoringInterval);

    console.log(`🔍 Operations monitoring started (${this.state.settings.monitoringInterval}ms interval)`);
  }

  private async performHealthCheck(): Promise<void> {
    try {
      // Update error metrics
      const errorReport = await this.errorManager.getErrorReport();
      this.state.status.metrics.activeErrors = errorReport.activeErrors.length;
      this.state.status.metrics.resolvedErrors = errorReport.recentResolutions.length;

      // Update server metrics
      this.updateServerMetrics();

      // Update compliance metrics
      this.updateComplianceMetrics();

      // Update overall system health
      this.updateSystemHealth();

      this.state.lastHealthCheck = new Date().toISOString();
      this.state.status.lastUpdated = new Date().toISOString();

      this.emit('health-check-completed', this.state.status);
    } catch (error) {
      console.error('❌ Health check failed:', error);
      this.createAlert('system', 'error', 'Health check failed', 'Operations health check failed');
    }
  }

  private updateErrorMetrics(data?: any): void {
    // Error metrics are updated via event handlers
    this.state.metrics.performance.errorRate = this.calculateErrorRate();
  }

  private updateServerMetrics(): void {
    const servers = this.serverManager.getAllServers();
    this.state.status.metrics.totalServers = servers.length;
    this.state.status.metrics.runningServers = servers.filter(s => s.status === 'running').length;
  }

  private updateComplianceMetrics(data?: any): void {
    // Compliance metrics are updated via event handlers
    // In a real implementation, this would aggregate compliance scores from ServerGovernor
    this.state.metrics.compliance.overallScore = 95; // Placeholder
  }

  private updateSystemHealth(): void {
    const componentHealth = Object.values(this.state.status.components);
    const healthyComponents = componentHealth.filter(h => h === 'healthy').length;
    const totalComponents = componentHealth.length;
    const healthPercentage = (healthyComponents / totalComponents) * 100;

    if (healthPercentage >= 90) {
      this.state.status.systemHealth = 'excellent';
    } else if (healthPercentage >= 75) {
      this.state.status.systemHealth = 'good';
    } else if (healthPercentage >= 50) {
      this.state.status.systemHealth = 'fair';
    } else if (healthPercentage >= 25) {
      this.state.status.systemHealth = 'poor';
    } else {
      this.state.status.systemHealth = 'critical';
    }
  }

  private calculateErrorRate(): number {
    const totalErrors = this.state.status.metrics.activeErrors + this.state.status.metrics.resolvedErrors;
    if (totalErrors === 0) return 0;
    return (this.state.status.metrics.activeErrors / totalErrors) * 100;
  }

  private createAlert(source: string, type: OperationsAlert['type'], title: string, message: string, metadata?: Record<string, any>): void {
    const alert: OperationsAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      severity: this.determineSeverity(type, source),
      source: source as OperationsAlert['source'],
      title,
      message,
      timestamp: new Date().toISOString(),
      acknowledged: false,
      resolved: false,
      metadata
    };

    this.state.alerts.set(alert.id, alert);
    this.updateAlertCounts();
    this.emit('alert-created', alert);
  }

  private determineSeverity(type: OperationsAlert['type'], source: string): OperationsAlert['severity'] {
    switch (type) {
      case 'error':
        return 'critical';
      case 'warning':
        return 'high';
      case 'info':
        return 'medium';
      case 'success':
        return 'low';
      default:
        return 'medium';
    }
  }

  private updateAlertCounts(): void {
    const alerts = Array.from(this.state.alerts.values());
    this.state.status.alerts = {
      critical: alerts.filter(a => a.severity === 'critical').length,
      high: alerts.filter(a => a.severity === 'high').length,
      medium: alerts.filter(a => a.severity === 'medium').length,
      low: alerts.filter(a => a.severity === 'low').length
    };
  }

  private updateOperationsStatus(): void {
    this.emit('status-updated', this.state.status);
  }

  // Public API Methods

  public getOperationsStatus(): OperationsStatus {
    return this.state.status;
  }

  public getOperationsMetrics(): OperationsMetrics {
    return this.state.metrics;
  }

  public getAlerts(): OperationsAlert[] {
    return Array.from(this.state.alerts.values()).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  public async acknowledgeAlert(alertId: string): Promise<boolean> {
    const alert = this.state.alerts.get(alertId);
    if (!alert) return false;

    alert.acknowledged = true;
    this.emit('alert-acknowledged', alert);
    return true;
  }

  public async resolveAlert(alertId: string, resolution?: string): Promise<boolean> {
    const alert = this.state.alerts.get(alertId);
    if (!alert) return false;

    alert.resolved = true;
    if (resolution) {
      alert.metadata = { ...alert.metadata, resolution };
    }
    this.emit('alert-resolved', alert);
    return true;
  }

  public async getErrorReport(): Promise<any> {
    return await this.errorManager.getErrorReport();
  }

  public async resolveError(errorId: string, resolution: any): Promise<boolean> {
    return await this.errorManager.resolveError(errorId, resolution);
  }

  public async ignoreError(errorId: string, reason: string): Promise<boolean> {
    return await this.errorManager.ignoreError(errorId, reason);
  }

  public async provisionServer(config: Omit<ServerConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServerConfig> {
    return await this.serverManager.provisionServer(config);
  }

  public async startServer(serverId: string): Promise<void> {
    await this.serverManager.startServer(serverId);
  }

  public async stopServer(serverId: string): Promise<void> {
    await this.serverManager.stopServer(serverId);
  }

  public async scaleServer(serverId: string, scaling: any): Promise<void> {
    await this.serverManager.scaleServer(serverId, scaling);
  }

  public async runComplianceCheck(serverId: string): Promise<any> {
    return await this.serverGovernor.runComplianceCheck(serverId);
  }

  public async updateSettings(settings: Partial<OperationsMasterState['settings']>): Promise<void> {
    this.state.settings = { ...this.state.settings, ...settings };
    
    // Update monitoring interval if changed
    if (settings.monitoringInterval && this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = setInterval(() => {
        this.performHealthCheck();
      }, this.state.settings.monitoringInterval);
    }

    this.emit('settings-updated', this.state.settings);
  }

  public async cleanup(): Promise<void> {
    // Cleanup old alerts
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.state.settings.alertRetentionDays);

    for (const [id, alert] of this.state.alerts.entries()) {
      if (new Date(alert.timestamp) < cutoffDate) {
        this.state.alerts.delete(id);
      }
    }

    this.updateAlertCounts();
    console.log('🧹 Operations cleanup completed');
  }

  public async shutdown(): Promise<void> {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    await this.cleanup();
    this.state.isInitialized = false;
    this.emit('shutdown');
    console.log('🛑 Operations Master shutdown complete');
  }
}

// Export singleton instance