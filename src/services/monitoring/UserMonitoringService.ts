import { EventEmitter } from 'events';

import { UserConstituencyManager } from '../../core/governance/UserConstituencyManager';

export interface MonitoringAlert {
  id: string;
  type: 'performance' | 'error' | 'engagement' | 'security' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  metadata: Record<string, unknown>;
  resolved: boolean;
  resolvedAt?: Date;
}

export interface MonitoringConfig {
  enabled: boolean;
  samplingRate: number;
  privacyMode: boolean;
  dataRetentionDays: number;
  alertThresholds: {
    errorRate: number;
    responseTime: number;
    systemLoad: number;
    engagementDrop: number;
  };
  realTimeStreaming: boolean;
  analyticsEnabled: boolean;
}

export interface MonitoringData {
  realTimeMetrics: any;
  performanceAnalytics: any;
  behaviorAnalytics: any;
  engagementAnalytics: any;
  alerts: MonitoringAlert[];
  timestamp: Date;
}

export class UserMonitoringService extends EventEmitter {
  private userManager: UserConstituencyManager;
  private config: MonitoringConfig;
  private alerts: Map<string, MonitoringAlert> = new Map();
  private streamingInterval?: NodeJS.Timeout;
  private alertCheckInterval?: NodeJS.Timeout;

  constructor(userManager: UserConstituencyManager, config?: Partial<MonitoringConfig>) {
    super();
    this.userManager = userManager;
    this.config = {
      enabled: true,
      samplingRate: 1.0,
      privacyMode: false,
      dataRetentionDays: 30,
      alertThresholds: {
        errorRate: 5.0, // 5%
        responseTime: 2000, // 2 seconds
        systemLoad: 80, // 80%
        engagementDrop: 20 // 20% drop
      },
      realTimeStreaming: true,
      analyticsEnabled: true,
      ...config
    };

    this.initializeMonitoring();
  }

  private initializeMonitoring(): void {
    if (!this.config.enabled) return;

    // Set up real-time data streaming
    if (this.config.realTimeStreaming) {
      this.streamingInterval = setInterval(() => {
        this.streamMonitoringData();
      }, 5000); // Stream every 5 seconds
    }

    // Set up alert checking
    this.alertCheckInterval = setInterval(() => {
      this.checkAlertConditions();
    }, 10000); // Check every 10 seconds

    // Set up user manager event listeners
    this.userManager.on('realTimeMetricsUpdated', (metrics) => {
      this.emit('metricsUpdated', metrics);
      this.checkPerformanceAlerts(metrics);
    });

    this.userManager.on('userActivityRecorded', (activity) => {
      this.emit('activityRecorded', activity);
      this.checkBehaviorAlerts(activity);
    });

    this.userManager.on('feedbackSubmitted', (feedback) => {
      this.emit('feedbackSubmitted', feedback);
      this.checkEngagementAlerts(feedback);
    });
  }

  private streamMonitoringData(): void {
    const monitoringData: MonitoringData = {
      realTimeMetrics: this.userManager.getRealTimeMetrics(),
      performanceAnalytics: this.userManager.getPerformanceAnalytics(),
      behaviorAnalytics: this.userManager.getBehaviorAnalytics(),
      engagementAnalytics: this.userManager.getEngagementAnalytics(),
      alerts: Array.from(this.alerts.values()).filter(alert => !alert.resolved),
      timestamp: new Date()
    };

    this.emit('monitoringDataStream', monitoringData);
  }

  private checkPerformanceAlerts(metrics: any): void {
    const { alertThresholds } = this.config;

    // Check error rate
    if (metrics.errorRate > alertThresholds.errorRate) {
      this.createAlert('performance', 'high', 'High Error Rate Detected', 
        `Error rate is ${metrics.errorRate.toFixed(1)}%, exceeding threshold of ${alertThresholds.errorRate}%`, {
          currentErrorRate: metrics.errorRate,
          threshold: alertThresholds.errorRate,
          activeUsers: metrics.activeUsers.size,
          concurrentSessions: metrics.concurrentSessions
        });
    }

    // Check response time
    if (metrics.averageResponseTime > alertThresholds.responseTime) {
      this.createAlert('performance', 'medium', 'Slow Response Time', 
        `Average response time is ${metrics.averageResponseTime}ms, exceeding threshold of ${alertThresholds.responseTime}ms`, {
          currentResponseTime: metrics.averageResponseTime,
          threshold: alertThresholds.responseTime
        });
    }

    // Check system load
    if (metrics.systemLoad > alertThresholds.systemLoad) {
      this.createAlert('system', 'high', 'High System Load', 
        `System load is ${metrics.systemLoad.toFixed(1)}%, exceeding threshold of ${alertThresholds.systemLoad}%`, {
          currentLoad: metrics.systemLoad,
          threshold: alertThresholds.systemLoad
        });
    }
  }

  private checkBehaviorAlerts(activity: any): void {
    // Check for unusual behavior patterns
    if (activity.type === 'error' && activity.details.type === 'javascript') {
      this.createAlert('error', 'medium', 'JavaScript Error Detected', 
        `JavaScript error: ${activity.details.message}`, {
          errorType: activity.details.type,
          message: activity.details.message,
          filename: activity.details.filename,
          lineNumber: activity.details.lineno
        });
    }
  }

  private checkEngagementAlerts(feedback: any): void {
    // Check for negative feedback patterns
    if (feedback.type === 'complaint' || feedback.type === 'bug_report') {
      this.createAlert('engagement', 'medium', 'User Feedback Alert', 
        `User submitted ${feedback.type}: ${feedback.title}`, {
          feedbackType: feedback.type,
          priority: feedback.priority,
          category: feedback.category,
          userId: feedback.userId
        });
    }
  }

  private createAlert(
    type: MonitoringAlert['type'],
    severity: MonitoringAlert['severity'],
    title: string,
    message: string,
    metadata: Record<string, unknown>
  ): void {
    const alert: MonitoringAlert = {
      id: Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9),
      type,
      severity,
      title,
      message,
      timestamp: new Date(),
      metadata,
      resolved: false
    };

    this.alerts.set(alert.id, alert);
    this.emit('alertCreated', alert);
  }

  private checkAlertConditions(): void {
    // Check for engagement drops
    const engagementAnalytics = this.userManager.getEngagementAnalytics();
    const currentEngagement = engagementAnalytics.userMetrics.averageEngagementScore;
    
    // This would need historical data to detect drops
    // For now, just check if engagement is very low
    if (currentEngagement < 30) {
      this.createAlert('engagement', 'high', 'Low User Engagement', 
        `Average engagement score is ${currentEngagement}, indicating potential issues`, {
          currentEngagement,
          threshold: 30,
          totalUsers: engagementAnalytics.userMetrics.totalUsers
        });
    }
  }

  // Public API methods
  public getMonitoringData(): MonitoringData {
    return {
      realTimeMetrics: this.userManager.getRealTimeMetrics(),
      performanceAnalytics: this.userManager.getPerformanceAnalytics(),
      behaviorAnalytics: this.userManager.getBehaviorAnalytics(),
      engagementAnalytics: this.userManager.getEngagementAnalytics(),
      alerts: Array.from(this.alerts.values()),
      timestamp: new Date()
    };
  }

  public getAlerts(includeResolved: boolean = false): MonitoringAlert[] {
    const alerts = Array.from(this.alerts.values());
    return includeResolved ? alerts : alerts.filter(alert => !alert.resolved);
  }

  public getAlertsByType(type: MonitoringAlert['type']): MonitoringAlert[] {
    return this.getAlerts().filter(alert => alert.type === type);
  }

  public getAlertsBySeverity(severity: MonitoringAlert['severity']): MonitoringAlert[] {
    return this.getAlerts().filter(alert => alert.severity === severity);
  }

  public resolveAlert(alertId: string, resolution?: string): boolean {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.resolved = true;
      alert.resolvedAt = new Date();
      if (resolution) {
        alert.metadata.resolution = resolution;
      }
      this.emit('alertResolved', alert);
      return true;
    }
    return false;
  }

  public updateConfig(newConfig: Partial<MonitoringConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.emit('configUpdated', this.config);
  }

  public getConfig(): MonitoringConfig {
    return this.config;
  }

  public startUserSession(userId: string, context?: any): any {
    return this.userManager.startUserSession(userId, context);
  }

  public endUserSession(sessionId: string): boolean {
    return this.userManager.endUserSession(sessionId);
  }

  public recordUserActivity(sessionId: string, type: string, details: Record<string, unknown>): void {
    this.userManager.recordUserActivity(sessionId, type as any, details);
  }

  public submitFeedback(feedback: any, includeContext: boolean = true): any {
    return this.userManager.submitFeedback(feedback, includeContext);
  }

  public getRealTimeMetrics(): any {
    return this.userManager.getRealTimeMetrics();
  }

  public getPerformanceAnalytics(): any {
    return this.userManager.getPerformanceAnalytics();
  }

  public getBehaviorAnalytics(): any {
    return this.userManager.getBehaviorAnalytics();
  }

  public getEngagementAnalytics(): any {
    return this.userManager.getEngagementAnalytics();
  }

  public getUserSession(sessionId: string): any {
    return this.userManager.getUserSession(sessionId);
  }

  public getUserEngagement(userId: string): any {
    return this.userManager.getUserEngagement(userId);
  }

  public getAllUsers(): any[] {
    return this.userManager.getAllUsers();
  }

  public getAllSessions(): any[] {
    return this.userManager.getAllSessions();
  }

  public getActiveSessions(): any[] {
    return this.userManager.getActiveSessions();
  }

  public async healthCheck(): Promise<any> {
    const userManagerHealth = await this.userManager.healthCheck();
    
    return {
      ...userManagerHealth,
      monitoringService: {
        enabled: this.config.enabled,
        alertsCount: this.getAlerts().length,
        activeAlerts: this.getAlerts().filter(a => a.severity === 'critical' || a.severity === 'high').length,
        streamingEnabled: this.config.realTimeStreaming,
        analyticsEnabled: this.config.analyticsEnabled
      },
      timestamp: new Date().toISOString()
    };
  }

  public stop(): void {
    if (this.streamingInterval) {
      clearInterval(this.streamingInterval);
    }
    if (this.alertCheckInterval) {
      clearInterval(this.alertCheckInterval);
    }
    this.userManager.stop();
    this.removeAllListeners();
  }
} 