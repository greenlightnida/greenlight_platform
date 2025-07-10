import { EventEmitter } from 'events';

export interface ServiceConnection {
  id: string;
  name: string;
  type: 'api' | 'database' | 'message_queue' | 'file_system' | 'external_service';
  endpoint: string;
  status: 'connected' | 'disconnected' | 'degraded' | 'error';
  health: {
    responseTime: number;
    availability: number;
    lastCheck: Date;
    errorCount: number;
  };
  metadata: Record<string, unknown>;
}

export interface IntegrationEndpoint {
  id: string;
  name: string;
  serviceId: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  status: 'active' | 'inactive' | 'deprecated';
  rateLimit?: number;
  authentication: 'none' | 'api_key' | 'oauth' | 'jwt';
  documentation?: string;
}

export interface ServiceMesh {
  id: string;
  name: string;
  services: ServiceConnection[];
  routing: {
    loadBalancing: 'round_robin' | 'least_connections' | 'weighted';
    circuitBreaker: boolean;
    retryPolicy: {
      maxRetries: number;
      backoffDelay: number;
    };
  };
  monitoring: {
    metrics: boolean;
    tracing: boolean;
    logging: boolean;
  };
}

export interface ConnectivityIntegrationState {
  connections: Map<string, ServiceConnection>;
  endpoints: Map<string, IntegrationEndpoint>;
  serviceMeshes: Map<string, ServiceMesh>;
  healthChecks: Array<{
    id: string;
    serviceId: string;
    timestamp: Date;
    status: 'success' | 'failure';
    responseTime: number;
    error?: string;
  }>;
  lastHealthCheck: Date;
}

export class ConnectivityIntegrationManager extends EventEmitter {
  private state: ConnectivityIntegrationState;
  private healthCheckInterval?: NodeJS.Timeout;

  constructor() {
    super();
    this.state = {
      connections: new Map(),
      endpoints: new Map(),
      serviceMeshes: new Map(),
      healthChecks: [],
      lastHealthCheck: new Date()
    };
    this.startHealthMonitoring();
  }

  // Service Connection Management
  public addServiceConnection(connection: ServiceConnection): void {
    this.state.connections.set(connection.id, connection);
    this.emit('serviceConnectionAdded', connection);
  }

  public removeServiceConnection(connectionId: string): boolean {
    const removed = this.state.connections.delete(connectionId);
    if (removed) {
      this.emit('serviceConnectionRemoved', connectionId);
    }
    return removed;
  }

  public updateServiceStatus(connectionId: string, status: ServiceConnection['status']): void {
    const connection = this.state.connections.get(connectionId);
    if (connection) {
      connection.status = status;
      this.emit('serviceStatusUpdated', { connectionId, status });
    }
  }

  public getServiceConnection(connectionId: string): ServiceConnection | undefined {
    return this.state.connections.get(connectionId);
  }

  public getAllConnections(): ServiceConnection[] {
    return Array.from(this.state.connections.values());
  }

  // Integration Endpoint Management
  public addIntegrationEndpoint(endpoint: IntegrationEndpoint): void {
    this.state.endpoints.set(endpoint.id, endpoint);
    this.emit('integrationEndpointAdded', endpoint);
  }

  public removeIntegrationEndpoint(endpointId: string): boolean {
    const removed = this.state.endpoints.delete(endpointId);
    if (removed) {
      this.emit('integrationEndpointRemoved', endpointId);
    }
    return removed;
  }

  public updateEndpointStatus(endpointId: string, status: IntegrationEndpoint['status']): void {
    const endpoint = this.state.endpoints.get(endpointId);
    if (endpoint) {
      endpoint.status = status;
      this.emit('endpointStatusUpdated', { endpointId, status });
    }
  }

  public getIntegrationEndpoint(endpointId: string): IntegrationEndpoint | undefined {
    return this.state.endpoints.get(endpointId);
  }

  public getAllEndpoints(): IntegrationEndpoint[] {
    return Array.from(this.state.endpoints.values());
  }

  // Service Mesh Management
  public createServiceMesh(mesh: ServiceMesh): void {
    this.state.serviceMeshes.set(mesh.id, mesh);
    this.emit('serviceMeshCreated', mesh);
  }

  public removeServiceMesh(meshId: string): boolean {
    const removed = this.state.serviceMeshes.delete(meshId);
    if (removed) {
      this.emit('serviceMeshRemoved', meshId);
    }
    return removed;
  }

  public getServiceMesh(meshId: string): ServiceMesh | undefined {
    return this.state.serviceMeshes.get(meshId);
  }

  public getAllServiceMeshes(): ServiceMesh[] {
    return Array.from(this.state.serviceMeshes.values());
  }

  // Health Monitoring
  private startHealthMonitoring(): void {
    this.healthCheckInterval = setInterval(() => {
      this.performHealthChecks();
    }, 30000); // Check every 30 seconds
  }

  private async performHealthChecks(): Promise<void> {
    const connections = this.getAllConnections();
    
    for (const connection of connections) {
      try {
        const startTime = Date.now();
        const response = await this.checkConnectionHealth(connection);
        const responseTime = Date.now() - startTime;

        const healthCheck = {
          id: Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9),
          serviceId: connection.id,
          timestamp: new Date(),
          status: response ? ('success' as const) : ('failure' as const),
          responseTime,
          error: response ? undefined : 'Connection failed'
        };

        this.state.healthChecks.push(healthCheck);
        
        // Update connection health
        connection.health.responseTime = responseTime;
        connection.health.lastCheck = new Date();
        if (response) {
          connection.health.availability = Math.min(100, connection.health.availability + 1);
          connection.health.errorCount = 0;
        } else {
          connection.health.errorCount++;
          connection.health.availability = Math.max(0, connection.health.availability - 5);
        }

        this.emit('healthCheckCompleted', healthCheck);
      } catch (error) {
        console.error(`Health check failed for ${connection.name}:`, error);
      }
    }

    this.state.lastHealthCheck = new Date();
  }

  private async checkConnectionHealth(connection: ServiceConnection): Promise<boolean> {
    try {
      // Basic health check - can be enhanced based on connection type
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(connection.endpoint, {
        method: 'HEAD',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  public getHealthChecks(): Array<{ id: string; serviceId: string; timestamp: Date; status: 'success' | 'failure'; responseTime: number; error?: string }> {
    return this.state.healthChecks;
  }

  // Service Discovery
  public discoverServices(): ServiceConnection[] {
    // This would integrate with service discovery mechanisms
    // For now, return all known connections
    return this.getAllConnections();
  }

  public findServiceByName(name: string): ServiceConnection | undefined {
    return this.getAllConnections().find(conn => conn.name === name);
  }

  public findServiceByType(type: ServiceConnection['type']): ServiceConnection[] {
    return this.getAllConnections().filter(conn => conn.type === type);
  }

  // Integration Analytics
  public getIntegrationMetrics() {
    const connections = this.getAllConnections();
    const endpoints = this.getAllEndpoints();
    const meshes = this.getAllServiceMeshes();

    return {
      totalConnections: connections.length,
      activeConnections: connections.filter(c => c.status === 'connected').length,
      totalEndpoints: endpoints.length,
      activeEndpoints: endpoints.filter(e => e.status === 'active').length,
      totalServiceMeshes: meshes.length,
      averageResponseTime: connections.reduce((sum, c) => sum + c.health.responseTime, 0) / connections.length || 0,
      averageAvailability: connections.reduce((sum, c) => sum + c.health.availability, 0) / connections.length || 0,
      lastHealthCheck: this.state.lastHealthCheck
    };
  }

  public getState(): ConnectivityIntegrationState {
    return this.state;
  }

  public async healthCheck(): Promise<any> {
    return {
      totalConnections: this.state.connections.size,
      totalEndpoints: this.state.endpoints.size,
      totalServiceMeshes: this.state.serviceMeshes.size,
      totalHealthChecks: this.state.healthChecks.length,
      lastHealthCheck: this.state.lastHealthCheck,
      metrics: this.getIntegrationMetrics(),
      timestamp: new Date().toISOString()
    };
  }

  public stop(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
  }
} 