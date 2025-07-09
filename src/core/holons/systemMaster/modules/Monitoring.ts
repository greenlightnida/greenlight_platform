export interface HealthStatus {
  status: 'healthy' | 'warning' | 'error' | 'unknown';
  message: string;
  timestamp: Date;
  metrics?: Record<string, number>;
}

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  component?: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
}

export interface HealthReport {
  timestamp: Date;
  overall: HealthStatus;
  components: Map<string, HealthStatus>;
  alerts: Alert[];
  metrics: {
    totalComponents: number;
    healthy: number;
    warning: number;
    error: number;
    unknown: number;
  };
}

export interface PerformanceMetrics {
  componentId: string;
  renderTime: number;
  bundleSize: number;
  memoryUsage: number;
  timestamp: Date;
}

export class Monitoring {
  private health: HealthTracker;
  private alerts: AlertManager;
  private metrics: MetricsCollector;

  constructor() {
    this.health = new HealthTracker();
    this.alerts = new AlertManager();
    this.metrics = new MetricsCollector();
  }

  public trackHealth(component: string, status: HealthStatus): void {
    this.health.updateHealth(component, status);
    
    // Generate alerts for unhealthy components
    if (status.status === 'error') {
      this.alerts.addAlert({
        id: `health-${component}-${Date.now()}`,
        type: 'error',
        title: `Component Health Issue: ${component}`,
        message: status.message,
        timestamp: new Date(),
        component,
        acknowledged: false
      });
    }
  }

  public addAlert(alert: Alert): void {
    this.alerts.addAlert(alert);
  }

  public acknowledgeAlert(alertId: string, acknowledgedBy: string): void {
    this.alerts.acknowledgeAlert(alertId, acknowledgedBy);
  }

  public trackPerformance(metrics: PerformanceMetrics): void {
    this.metrics.recordMetrics(metrics);
  }

  public generateHealthReport(): HealthReport {
    const componentHealth = this.health.getAllHealth();
    const alerts = this.alerts.getActiveAlerts();
    
    // Calculate overall health
    const statuses = Array.from(componentHealth.values());
    const errorCount = statuses.filter(s => s.status === 'error').length;
    const warningCount = statuses.filter(s => s.status === 'warning').length;
    const healthyCount = statuses.filter(s => s.status === 'healthy').length;
    
    let overallStatus: 'healthy' | 'warning' | 'error' | 'unknown' = 'healthy';
    if (errorCount > 0) {
      overallStatus = 'error';
    } else if (warningCount > 0) {
      overallStatus = 'warning';
    } else if (healthyCount === 0) {
      overallStatus = 'unknown';
    }

    const overall: HealthStatus = {
      status: overallStatus,
      message: `System health: ${healthyCount} healthy, ${warningCount} warnings, ${errorCount} errors`,
      timestamp: new Date()
    };

    return {
      timestamp: new Date(),
      overall,
      components: componentHealth,
      alerts,
      metrics: {
        totalComponents: statuses.length,
        healthy: healthyCount,
        warning: warningCount,
        error: errorCount,
        unknown: statuses.filter(s => s.status === 'unknown').length
      }
    };
  }

  public getPerformanceMetrics(componentId?: string): PerformanceMetrics[] {
    return this.metrics.getMetrics(componentId);
  }

  public getActiveAlerts(): Alert[] {
    return this.alerts.getActiveAlerts();
  }

  public getComponentHealth(componentId: string): HealthStatus | undefined {
    return this.health.getHealth(componentId);
  }

  public getAllComponentHealth(): Map<string, HealthStatus> {
    return this.health.getAllHealth();
  }
}

class HealthTracker {
  private health: Map<string, HealthStatus> = new Map();

  public updateHealth(component: string, status: HealthStatus): void {
    this.health.set(component, status);
  }

  public getHealth(component: string): HealthStatus | undefined {
    return this.health.get(component);
  }

  public getAllHealth(): Map<string, HealthStatus> {
    return this.health;
  }

  public removeHealth(component: string): void {
    this.health.delete(component);
  }
}

class AlertManager {
  private alerts: Map<string, Alert> = new Map();

  public addAlert(alert: Alert): void {
    this.alerts.set(alert.id, alert);
  }

  public acknowledgeAlert(alertId: string, acknowledgedBy: string): void {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.acknowledged = true;
      alert.acknowledgedBy = acknowledgedBy;
      alert.acknowledgedAt = new Date();
    }
  }

  public getActiveAlerts(): Alert[] {
    return Array.from(this.alerts.values()).filter(alert => !alert.acknowledged);
  }

  public getAllAlerts(): Alert[] {
    return Array.from(this.alerts.values());
  }

  public removeAlert(alertId: string): void {
    this.alerts.delete(alertId);
  }

  public clearOldAlerts(olderThan: Date): void {
    this.alerts.forEach((alert, id) => {
      if (alert.timestamp < olderThan) {
        this.alerts.delete(id);
      }
    });
  }
}

class MetricsCollector {
  private metrics: PerformanceMetrics[] = [];

  public recordMetrics(metrics: PerformanceMetrics): void {
    this.metrics.push(metrics);
    
    // Keep only last 1000 metrics to prevent memory issues
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  public getMetrics(componentId?: string): PerformanceMetrics[] {
    if (componentId) {
      return this.metrics.filter(m => m.componentId === componentId);
    }
    return this.metrics;
  }

  public getAverageMetrics(componentId?: string): {
    averageRenderTime: number;
    averageBundleSize: number;
    averageMemoryUsage: number;
  } {
    const filteredMetrics = this.getMetrics(componentId);
    
    if (filteredMetrics.length === 0) {
      return {
        averageRenderTime: 0,
        averageBundleSize: 0,
        averageMemoryUsage: 0
      };
    }

    const totalRenderTime = filteredMetrics.reduce((sum, m) => sum + m.renderTime, 0);
    const totalBundleSize = filteredMetrics.reduce((sum, m) => sum + m.bundleSize, 0);
    const totalMemoryUsage = filteredMetrics.reduce((sum, m) => sum + m.memoryUsage, 0);

    return {
      averageRenderTime: totalRenderTime / filteredMetrics.length,
      averageBundleSize: totalBundleSize / filteredMetrics.length,
      averageMemoryUsage: totalMemoryUsage / filteredMetrics.length
    };
  }

  public clearMetrics(): void {
    this.metrics = [];
  }
} 