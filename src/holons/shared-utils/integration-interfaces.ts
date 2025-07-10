/**
 * Integration Interfaces for Shared Utils Holon
 * 
 * PURPOSE: Define standard communication patterns between holons and systems
 * - Event-driven communication
 * - Message passing
 * - Service discovery
 * - Health monitoring
 */

export interface IntegrationMessage {
  id: string;
  timestamp: string;
  source: string;
  target: string;
  type: string;
  payload: any;
  metadata?: Record<string, any>;
  priority?: 'low' | 'normal' | 'high' | 'critical';
  ttl?: number; // Time to live in milliseconds
}

export interface IntegrationEvent {
  name: string;
  data: any;
  source: string;
  timestamp: string;
  correlationId?: string;
}

export interface ServiceEndpoint {
  id: string;
  name: string;
  url: string;
  health: 'healthy' | 'degraded' | 'unhealthy';
  lastCheck: string;
  metadata?: Record<string, any>;
}

export interface IntegrationConfig {
  serviceId: string;
  serviceName: string;
  endpoints: ServiceEndpoint[];
  messageQueue: {
    maxSize: number;
    timeout: number;
    retryAttempts: number;
  };
  healthCheck: {
    interval: number;
    timeout: number;
    failureThreshold: number;
  };
}

export interface MessageHandler {
  (message: IntegrationMessage): Promise<void>;
}

export interface EventHandler {
  (event: IntegrationEvent): Promise<void>;
}

export interface HealthCheckResult {
  serviceId: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  responseTime: number;
  details?: Record<string, any>;
}

/**
 * Integration Manager for cross-system communication
 */
export class IntegrationManager {
  private static instance: IntegrationManager;
  private config: IntegrationConfig;
  private messageHandlers: Map<string, MessageHandler[]> = new Map();
  private eventHandlers: Map<string, EventHandler[]> = new Map();
  private messageQueue: IntegrationMessage[] = [];
  private endpoints: Map<string, ServiceEndpoint> = new Map();
  private healthCheckTimer: NodeJS.Timeout | null = null;

  private constructor(config: IntegrationConfig) {
    this.config = config;
    this.initializeEndpoints();
    this.startHealthChecks();
  }

  static getInstance(config?: IntegrationConfig): IntegrationManager {
    if (!IntegrationManager.instance && config) {
      IntegrationManager.instance = new IntegrationManager(config);
    }
    return IntegrationManager.instance;
  }

  /**
   * Initialize service endpoints
   */
  private initializeEndpoints(): void {
    for (const endpoint of this.config.endpoints) {
      this.endpoints.set(endpoint.id, endpoint);
    }
  }

  /**
   * Start health check monitoring
   */
  private startHealthChecks(): void {
    this.healthCheckTimer = setInterval(() => {
      this.performHealthChecks();
    }, this.config.healthCheck.interval);
  }

  /**
   * Perform health checks on all endpoints
   */
  private async performHealthChecks(): Promise<void> {
    const checks: Promise<HealthCheckResult>[] = [];

    for (const endpoint of Array.from(this.endpoints.values())) {
      checks.push(this.checkEndpointHealth(endpoint));
    }

    const results = await Promise.allSettled(checks);
    
    for (const result of results) {
      if (result.status === 'fulfilled') {
        const healthResult = result.value;
        const endpoint = this.endpoints.get(healthResult.serviceId);
        if (endpoint) {
          endpoint.health = healthResult.status;
          endpoint.lastCheck = healthResult.timestamp;
        }
      }
    }
  }

  /**
   * Check health of a specific endpoint
   */
  private async checkEndpointHealth(endpoint: ServiceEndpoint): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.healthCheck.timeout);
      
      const response = await fetch(`${endpoint.url}/health`, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      const responseTime = Date.now() - startTime;
      const status = response.ok ? 'healthy' : 'degraded';

      return {
        serviceId: endpoint.id,
        status,
        timestamp: new Date().toISOString(),
        responseTime,
        details: {
          statusCode: response.status,
          responseTime
        }
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        serviceId: endpoint.id,
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        responseTime,
        details: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  /**
   * Send message to target service
   */
  async sendMessage(message: Omit<IntegrationMessage, 'id' | 'timestamp'>): Promise<string> {
    const fullMessage: IntegrationMessage = {
      ...message,
      id: this.generateMessageId(),
      timestamp: new Date().toISOString()
    };

    // Add to queue
    this.messageQueue.push(fullMessage);

    // Process queue if not at capacity
    if (this.messageQueue.length <= this.config.messageQueue.maxSize) {
      await this.processMessageQueue();
    }

    return fullMessage.id;
  }

  /**
   * Process message queue
   */
  private async processMessageQueue(): Promise<void> {
    const messages = [...this.messageQueue];
    this.messageQueue = [];

    for (const message of messages) {
      try {
        await this.deliverMessage(message);
      } catch (error) {
        // Re-queue with retry logic
        const retryCount = message.metadata?.retryCount || 0;
        if (retryCount < this.config.messageQueue.retryAttempts) {
          message.metadata = {
            ...message.metadata,
            retryCount: retryCount + 1
          };
          this.messageQueue.push(message);
        }
      }
    }
  }

  /**
   * Deliver message to target
   */
  private async deliverMessage(message: IntegrationMessage): Promise<void> {
    const target = this.endpoints.get(message.target);
    if (!target) {
      throw new Error(`Target service not found: ${message.target}`);
    }

    if (target.health === 'unhealthy') {
      throw new Error(`Target service unhealthy: ${message.target}`);
    }

    // Send via HTTP POST
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.messageQueue.timeout);
    
    const response = await fetch(`${target.url}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to deliver message: ${response.statusText}`);
    }
  }

  /**
   * Register message handler
   */
  registerMessageHandler(type: string, handler: MessageHandler): void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    this.messageHandlers.get(type)!.push(handler);
  }

  /**
   * Register event handler
   */
  registerEventHandler(eventName: string, handler: EventHandler): void {
    if (!this.eventHandlers.has(eventName)) {
      this.eventHandlers.set(eventName, []);
    }
    this.eventHandlers.get(eventName)!.push(handler);
  }

  /**
   * Handle incoming message
   */
  async handleIncomingMessage(message: IntegrationMessage): Promise<void> {
    const handlers = this.messageHandlers.get(message.type) || [];
    
    for (const handler of handlers) {
      try {
        await handler(message);
      } catch (error) {
        console.error(`Error in message handler for type ${message.type}:`, error);
      }
    }
  }

  /**
   * Emit event
   */
  async emitEvent(event: Omit<IntegrationEvent, 'timestamp'>): Promise<void> {
    const fullEvent: IntegrationEvent = {
      ...event,
      timestamp: new Date().toISOString()
    };

    const handlers = this.eventHandlers.get(event.name) || [];
    
    for (const handler of handlers) {
      try {
        await handler(fullEvent);
      } catch (error) {
        console.error(`Error in event handler for ${event.name}:`, error);
      }
    }
  }

  /**
   * Get service endpoints
   */
  getEndpoints(): ServiceEndpoint[] {
    return Array.from(this.endpoints.values());
  }

  /**
   * Get endpoint by ID
   */
  getEndpoint(id: string): ServiceEndpoint | undefined {
    return this.endpoints.get(id);
  }

  /**
   * Add endpoint
   */
  addEndpoint(endpoint: ServiceEndpoint): void {
    this.endpoints.set(endpoint.id, endpoint);
  }

  /**
   * Remove endpoint
   */
  removeEndpoint(id: string): boolean {
    return this.endpoints.delete(id);
  }

  /**
   * Get integration statistics
   */
  getStats(): {
    messageQueueSize: number;
    endpointCount: number;
    healthyEndpoints: number;
    messageHandlers: number;
    eventHandlers: number;
  } {
    const healthyEndpoints = Array.from(this.endpoints.values())
      .filter(endpoint => endpoint.health === 'healthy').length;

    const messageHandlers = Array.from(this.messageHandlers.values())
      .reduce((total, handlers) => total + handlers.length, 0);

    const eventHandlers = Array.from(this.eventHandlers.values())
      .reduce((total, handlers) => total + handlers.length, 0);

    return {
      messageQueueSize: this.messageQueue.length,
      endpointCount: this.endpoints.size,
      healthyEndpoints,
      messageHandlers,
      eventHandlers
    };
  }

  /**
   * Generate unique message ID
   */
  private generateMessageId(): string {
    return `${this.config.serviceId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = null;
    }
  }
}

/**
 * Standard message types for platform communication
 */
export const MessageTypes = {
  // System messages
  SYSTEM_HEALTH_CHECK: 'system.health.check',
  SYSTEM_SHUTDOWN: 'system.shutdown',
  SYSTEM_STARTUP: 'system.startup',
  
  // Protocol messages
  PROTOCOL_EXECUTE: 'protocol.execute',
  PROTOCOL_COMPLETE: 'protocol.complete',
  PROTOCOL_ERROR: 'protocol.error',
  
  // Data messages
  DATA_SYNC: 'data.sync',
  DATA_BACKUP: 'data.backup',
  DATA_RESTORE: 'data.restore',
  
  // Governance messages
  GOVERNANCE_DECISION: 'governance.decision',
  GOVERNANCE_VOTE: 'governance.vote',
  GOVERNANCE_ESCALATION: 'governance.escalation'
} as const;

/**
 * Standard event names for platform communication
 */
export const EventNames = {
  // System events
  SYSTEM_READY: 'system.ready',
  SYSTEM_ERROR: 'system.error',
  
  // Protocol events
  PROTOCOL_STARTED: 'protocol.started',
  PROTOCOL_COMPLETED: 'protocol.completed',
  PROTOCOL_FAILED: 'protocol.failed',
  
  // Data events
  DATA_CHANGED: 'data.changed',
  DATA_DELETED: 'data.deleted',
  
  // User events
  USER_LOGIN: 'user.login',
  USER_LOGOUT: 'user.logout',
  USER_ACTION: 'user.action'
} as const; 