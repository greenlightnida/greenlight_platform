import { EventEmitter } from 'events';

export interface UserSession {
  id: string;
  userId: string;
  startTime: Date;
  lastActivity: Date;
  endTime?: Date;
  duration: number;
  activities: UserActivity[];
  feedback: UserFeedback[];
  engagement: {
    score: number;
    interactions: number;
    timeSpent: number;
    featuresUsed: string[];
  };
  // Real monitoring additions
  performance: {
    pageLoadTimes: number[];
    apiResponseTimes: number[];
    errorCount: number;
    slowQueries: number;
    memoryUsage: number[];
    cpuUsage: number[];
  };
  behavior: {
    mouseMovements: number;
    clicks: number;
    scrolls: number;
    keyStrokes: number;
    idleTime: number;
    focusTime: number;
  };
  context: {
    userAgent: string;
    screenResolution: string;
    timezone: string;
    language: string;
    referrer: string;
    ipAddress: string;
  };
}

export interface UserActivity {
  id: string;
  type: 'login' | 'logout' | 'feature_use' | 'page_view' | 'action' | 'error' | 'performance' | 'behavior';
  timestamp: Date;
  details: Record<string, unknown>;
  sessionId: string;
  // Real monitoring additions
  performance?: {
    loadTime: number;
    responseTime: number;
    memoryUsage: number;
    cpuUsage: number;
  };
  behavior?: {
    element: string;
    action: string;
    coordinates?: { x: number; y: number };
    duration?: number;
  };
}

export interface UserFeedback {
  id: string;
  type: 'bug_report' | 'feature_request' | 'general_feedback' | 'complaint' | 'praise';
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'submitted' | 'reviewing' | 'in_progress' | 'resolved' | 'closed';
  title: string;
  description: string;
  userId: string;
  sessionId: string;
  timestamp: Date;
  assignedTo?: string;
  resolution?: string;
  tags: string[];
  // Real monitoring additions
  context?: {
    pageUrl: string;
    userAgent: string;
    screenResolution: string;
    performanceMetrics: {
      loadTime: number;
      responseTime: number;
      errorCount: number;
    };
  };
}

export interface UserEngagement {
  userId: string;
  totalSessions: number;
  totalTimeSpent: number;
  averageSessionDuration: number;
  lastActive: Date;
  engagementScore: number;
  feedbackCount: number;
  featureUsage: Record<string, number>;
  satisfactionScore: number;
  // Real monitoring additions
  performanceMetrics: {
    averagePageLoadTime: number;
    averageApiResponseTime: number;
    errorRate: number;
    slowQueryRate: number;
    averageMemoryUsage: number;
    averageCpuUsage: number;
  };
  behaviorMetrics: {
    averageClicksPerSession: number;
    averageScrollsPerSession: number;
    averageIdleTime: number;
    averageFocusTime: number;
    mouseMovementEfficiency: number;
  };
  deviceInfo: {
    userAgent: string;
    screenResolution: string;
    timezone: string;
    language: string;
    deviceType: 'desktop' | 'mobile' | 'tablet';
  };
}

export interface UserConstituencyState {
  users: Map<string, UserEngagement>;
  sessions: Map<string, UserSession>;
  feedback: Map<string, UserFeedback>;
  activities: UserActivity[];
  // Real monitoring additions
  realTimeMetrics: {
    activeUsers: Set<string>;
    concurrentSessions: number;
    averageResponseTime: number;
    errorRate: number;
    systemLoad: number;
  };
  monitoringConfig: {
    enabled: boolean;
    samplingRate: number;
    privacyMode: boolean;
    dataRetentionDays: number;
  };
  metrics: {
    totalUsers: number;
    activeUsers: number;
    totalSessions: number;
    totalFeedback: number;
    averageEngagementScore: number;
    averageSatisfactionScore: number;
  };
}

export class UserConstituencyManager extends EventEmitter {
  private state: UserConstituencyState;
  private monitoringInterval?: NodeJS.Timeout;
  private performanceObserver?: PerformanceObserver;

  constructor() {
    super();
    this.state = {
      users: new Map(),
      sessions: new Map(),
      feedback: new Map(),
      activities: [],
      realTimeMetrics: {
        activeUsers: new Set(),
        concurrentSessions: 0,
        averageResponseTime: 0,
        errorRate: 0,
        systemLoad: 0
      },
      monitoringConfig: {
        enabled: true,
        samplingRate: 1.0, // 100% sampling
        privacyMode: false,
        dataRetentionDays: 30
      },
      metrics: {
        totalUsers: 0,
        activeUsers: 0,
        totalSessions: 0,
        totalFeedback: 0,
        averageEngagementScore: 0,
        averageSatisfactionScore: 0
      }
    };
    this.initializeRealTimeMonitoring();
  }

  private initializeRealTimeMonitoring(): void {
    if (typeof window !== 'undefined') {
      // Browser environment - initialize client-side monitoring
      this.initializeClientSideMonitoring();
    }
    
    // Server-side monitoring
    this.monitoringInterval = setInterval(() => {
      this.updateRealTimeMetrics();
    }, 5000); // Update every 5 seconds
  }

  private initializeClientSideMonitoring(): void {
    // Performance monitoring
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordPerformanceMetric(entry);
        }
      });
      this.performanceObserver.observe({ entryTypes: ['navigation', 'resource', 'measure'] });
    }

    // User behavior monitoring
    this.setupBehaviorTracking();
    
    // Error monitoring
    this.setupErrorTracking();
  }

  private setupBehaviorTracking(): void {
    if (typeof window === 'undefined') return;

    let mouseMovements = 0;
    let clicks = 0;
    let scrolls = 0;
    let keyStrokes = 0;
    let lastActivity = Date.now();
    let idleStart = Date.now();

    // Mouse movement tracking
    document.addEventListener('mousemove', () => {
      mouseMovements++;
      lastActivity = Date.now();
      this.recordUserBehavior('mouse_movement', { count: mouseMovements });
    });

    // Click tracking
    document.addEventListener('click', (event) => {
      clicks++;
      this.recordUserBehavior('click', {
        element: (event.target as HTMLElement).tagName || 'unknown',
        coordinates: { x: event.clientX, y: event.clientY }
      });
    });

    // Scroll tracking
    document.addEventListener('scroll', () => {
      scrolls++;
      this.recordUserBehavior('scroll', { count: scrolls });
    });

    // Keyboard tracking
    document.addEventListener('keydown', () => {
      keyStrokes++;
      this.recordUserBehavior('keypress', { count: keyStrokes });
    });

    // Focus/blur tracking
    document.addEventListener('focusin', () => {
      const focusTime = Date.now() - idleStart;
      this.recordUserBehavior('focus', { duration: focusTime });
    });

    document.addEventListener('focusout', () => {
      idleStart = Date.now();
      this.recordUserBehavior('blur', { idleStart });
    });

    // Idle time tracking
    setInterval(() => {
      const now = Date.now();
      const idleTime = now - lastActivity;
      if (idleTime > 30000) { // 30 seconds
        this.recordUserBehavior('idle', { duration: idleTime });
      }
    }, 10000);
  }

  private setupErrorTracking(): void {
    if (typeof window === 'undefined') return;

    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.recordError('javascript', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack
      });
    });

    // Promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.recordError('promise', {
        reason: event.reason,
        promise: event.promise
      });
    });

    // Network errors
    window.addEventListener('offline', () => {
      this.recordError('network', { type: 'offline' });
    });

    window.addEventListener('online', () => {
      this.recordError('network', { type: 'online' });
    });
  }

  private recordPerformanceMetric(entry: PerformanceEntry): void {
    const activeSession = this.getActiveSessionForCurrentUser();
    if (!activeSession) return;

    const performanceData = {
      name: entry.name,
      duration: entry.duration,
      startTime: entry.startTime,
      entryType: entry.entryType
    };

    this.recordUserActivity(activeSession.id, 'performance', performanceData);
  }

  private recordUserBehavior(type: string, data: Record<string, unknown>): void {
    const activeSession = this.getActiveSessionForCurrentUser();
    if (!activeSession) return;

    this.recordUserActivity(activeSession.id, 'behavior', {
      type,
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  private recordError(type: string, data: Record<string, unknown>): void {
    const activeSession = this.getActiveSessionForCurrentUser();
    if (!activeSession) return;

    this.recordUserActivity(activeSession.id, 'error', {
      type,
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  private getActiveSessionForCurrentUser(): UserSession | undefined {
    // In a real implementation, this would get the current user's active session
    // For now, return the most recent active session
    const activeSessions = this.getActiveSessions();
    return activeSessions.length > 0 ? activeSessions[0] : undefined;
  }

  private updateRealTimeMetrics(): void {
    const activeSessions = this.getActiveSessions();
    const activeUsers = new Set(activeSessions.map(s => s.userId));
    
    this.state.realTimeMetrics = {
      activeUsers,
      concurrentSessions: activeSessions.length,
      averageResponseTime: this.calculateAverageResponseTime(),
      errorRate: this.calculateErrorRate(),
      systemLoad: this.calculateSystemLoad()
    };

    this.emit('realTimeMetricsUpdated', this.state.realTimeMetrics);
  }

  private calculateAverageResponseTime(): number {
    const recentActivities = this.state.activities
      .filter(a => a.type === 'performance' && a.details.duration)
      .slice(-100); // Last 100 performance entries

    if (recentActivities.length === 0) return 0;

    const totalTime = recentActivities.reduce((sum, a) => 
      sum + (a.details.duration as number), 0);
    return totalTime / recentActivities.length;
  }

  private calculateErrorRate(): number {
    const recentActivities = this.state.activities
      .filter(a => a.timestamp > new Date(Date.now() - 5 * 60 * 1000)); // Last 5 minutes

    if (recentActivities.length === 0) return 0;

    const errorCount = recentActivities.filter(a => a.type === 'error').length;
    return (errorCount / recentActivities.length) * 100;
  }

  private calculateSystemLoad(): number {
    // In a real implementation, this would get actual system metrics
    // For now, use a simple heuristic based on active sessions
    const activeSessions = this.getActiveSessions().length;
    return Math.min(100, (activeSessions / 100) * 100); // Assume 100 sessions = 100% load
  }

  // Enhanced session management with real monitoring
  public startUserSession(userId: string, context?: Partial<UserSession['context']>): UserSession {
    const sessionId = Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
    const now = new Date();
    
    const session: UserSession = {
      id: sessionId,
      userId,
      startTime: now,
      lastActivity: now,
      duration: 0,
      activities: [],
      feedback: [],
      engagement: {
        score: 0,
        interactions: 0,
        timeSpent: 0,
        featuresUsed: []
      },
      performance: {
        pageLoadTimes: [],
        apiResponseTimes: [],
        errorCount: 0,
        slowQueries: 0,
        memoryUsage: [],
        cpuUsage: []
      },
      behavior: {
        mouseMovements: 0,
        clicks: 0,
        scrolls: 0,
        keyStrokes: 0,
        idleTime: 0,
        focusTime: 0
      },
      context: {
        userAgent: context?.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : ''),
        screenResolution: context?.screenResolution || (typeof screen !== 'undefined' ? `${screen.width}x${screen.height}` : ''),
        timezone: context?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: context?.language || (typeof navigator !== 'undefined' ? navigator.language : ''),
        referrer: context?.referrer || (typeof document !== 'undefined' ? document.referrer : ''),
        ipAddress: context?.ipAddress || ''
      }
    };

    this.state.sessions.set(sessionId, session);
    this.state.realTimeMetrics.activeUsers.add(userId);
    this.updateUserEngagement(userId);
    this.emit('userSessionStarted', session);
    
    return session;
  }

  // Enhanced activity recording with real monitoring data
  public recordUserActivity(sessionId: string, type: UserActivity['type'], details: Record<string, unknown>): void {
    const session = this.state.sessions.get(sessionId);
    if (session) {
      const activity: UserActivity = {
        id: Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9),
        type,
        timestamp: new Date(),
        details,
        sessionId
      };

      // Add performance data if available
      if (type === 'performance' && details.duration) {
        activity.performance = {
          loadTime: details.duration as number,
          responseTime: details.duration as number,
          memoryUsage: details.memoryUsage as number || 0,
          cpuUsage: details.cpuUsage as number || 0
        };
      }

      // Add behavior data if available
      if (type === 'behavior') {
        activity.behavior = {
          element: details.element as string || '',
          action: details.type as string || '',
          coordinates: details.coordinates as { x: number; y: number } || undefined,
          duration: details.duration as number || undefined
        };
      }

      session.activities.push(activity);
      session.lastActivity = activity.timestamp;
      session.engagement.interactions++;
      
      // Update performance metrics
      if (type === 'performance' && details.duration) {
        session.performance.pageLoadTimes.push(details.duration as number);
        if (details.duration > 3000) { // 3 seconds threshold
          session.performance.slowQueries++;
        }
      }

      // Update behavior metrics
      if (type === 'behavior') {
        switch (details.type) {
          case 'mouse_movement':
            session.behavior.mouseMovements++;
            break;
          case 'click':
            session.behavior.clicks++;
            break;
          case 'scroll':
            session.behavior.scrolls++;
            break;
          case 'keypress':
            session.behavior.keyStrokes++;
            break;
          case 'idle':
            session.behavior.idleTime += details.duration as number || 0;
            break;
          case 'focus':
            session.behavior.focusTime += details.duration as number || 0;
            break;
        }
      }

      // Update error count
      if (type === 'error') {
        session.performance.errorCount++;
      }
      
      this.state.activities.push(activity);
      this.emit('userActivityRecorded', activity);
    }
  }

  // Enhanced feedback with real monitoring context
  public submitFeedback(feedback: Omit<UserFeedback, 'id' | 'timestamp'>, includeContext: boolean = true): UserFeedback {
    const newFeedback: UserFeedback = {
      ...feedback,
      id: Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };

    // Add real monitoring context if requested
    if (includeContext && typeof window !== 'undefined') {
      const activeSession = this.getActiveSessionForCurrentUser();
      if (activeSession) {
        newFeedback.context = {
          pageUrl: window.location.href,
          userAgent: navigator.userAgent,
          screenResolution: `${screen.width}x${screen.height}`,
          performanceMetrics: {
            loadTime: activeSession.performance.pageLoadTimes[activeSession.performance.pageLoadTimes.length - 1] || 0,
            responseTime: activeSession.performance.apiResponseTimes[activeSession.performance.apiResponseTimes.length - 1] || 0,
            errorCount: activeSession.performance.errorCount
          }
        };
      }
    }

    this.state.feedback.set(newFeedback.id, newFeedback);
    
    if (newFeedback.sessionId) {
      const session = this.state.sessions.get(newFeedback.sessionId);
      if (session) {
        session.feedback.push(newFeedback);
      }
    }

    this.updateMetrics();
    this.emit('feedbackSubmitted', newFeedback);
    
    return newFeedback;
  }

  // Enhanced user engagement with real monitoring metrics
  private updateUserEngagement(userId: string): void {
    const userSessions = Array.from(this.state.sessions.values())
      .filter(s => s.userId === userId);
    
    const userFeedback = Array.from(this.state.feedback.values())
      .filter(f => f.userId === userId);

    const totalSessions = userSessions.length;
    const totalTimeSpent = userSessions.reduce((sum, s) => sum + s.duration, 0);
    const averageSessionDuration = totalSessions > 0 ? totalTimeSpent / totalSessions : 0;
    const lastActive = userSessions.length > 0 
      ? new Date(Math.max(...userSessions.map(s => s.lastActivity.getTime())))
      : new Date();
    
    const averageEngagementScore = userSessions.length > 0
      ? userSessions.reduce((sum, s) => sum + s.engagement.score, 0) / userSessions.length
      : 0;

    const featureUsage: Record<string, number> = {};
    userSessions.forEach(session => {
      session.engagement.featuresUsed.forEach(feature => {
        featureUsage[feature] = (featureUsage[feature] || 0) + 1;
      });
    });

    // Calculate performance metrics
    const allPageLoadTimes = userSessions.flatMap(s => s.performance.pageLoadTimes);
    const allApiResponseTimes = userSessions.flatMap(s => s.performance.apiResponseTimes);
    const allMemoryUsage = userSessions.flatMap(s => s.performance.memoryUsage);
    const allCpuUsage = userSessions.flatMap(s => s.performance.cpuUsage);
    const totalErrors = userSessions.reduce((sum, s) => sum + s.performance.errorCount, 0);
    const totalSlowQueries = userSessions.reduce((sum, s) => sum + s.performance.slowQueries, 0);

    // Calculate behavior metrics
    const totalClicks = userSessions.reduce((sum, s) => sum + s.behavior.clicks, 0);
    const totalScrolls = userSessions.reduce((sum, s) => sum + s.behavior.scrolls, 0);
    const totalIdleTime = userSessions.reduce((sum, s) => sum + s.behavior.idleTime, 0);
    const totalFocusTime = userSessions.reduce((sum, s) => sum + s.behavior.focusTime, 0);
    const totalMouseMovements = userSessions.reduce((sum, s) => sum + s.behavior.mouseMovements, 0);

    const satisfactionScore = this.calculateSatisfactionScore(userFeedback);

    const userEngagement: UserEngagement = {
      userId,
      totalSessions,
      totalTimeSpent,
      averageSessionDuration,
      lastActive,
      engagementScore: Math.round(averageEngagementScore),
      feedbackCount: userFeedback.length,
      featureUsage,
      satisfactionScore,
      performanceMetrics: {
        averagePageLoadTime: allPageLoadTimes.length > 0 ? allPageLoadTimes.reduce((sum, time) => sum + time, 0) / allPageLoadTimes.length : 0,
        averageApiResponseTime: allApiResponseTimes.length > 0 ? allApiResponseTimes.reduce((sum, time) => sum + time, 0) / allApiResponseTimes.length : 0,
        errorRate: totalSessions > 0 ? (totalErrors / totalSessions) * 100 : 0,
        slowQueryRate: totalSessions > 0 ? (totalSlowQueries / totalSessions) * 100 : 0,
        averageMemoryUsage: allMemoryUsage.length > 0 ? allMemoryUsage.reduce((sum, usage) => sum + usage, 0) / allMemoryUsage.length : 0,
        averageCpuUsage: allCpuUsage.length > 0 ? allCpuUsage.reduce((sum, usage) => sum + usage, 0) / allCpuUsage.length : 0
      },
      behaviorMetrics: {
        averageClicksPerSession: totalSessions > 0 ? totalClicks / totalSessions : 0,
        averageScrollsPerSession: totalSessions > 0 ? totalScrolls / totalSessions : 0,
        averageIdleTime: totalSessions > 0 ? totalIdleTime / totalSessions : 0,
        averageFocusTime: totalSessions > 0 ? totalFocusTime / totalSessions : 0,
        mouseMovementEfficiency: totalClicks > 0 ? totalMouseMovements / totalClicks : 0
      },
      deviceInfo: {
        userAgent: userSessions[0]?.context.userAgent || '',
        screenResolution: userSessions[0]?.context.screenResolution || '',
        timezone: userSessions[0]?.context.timezone || '',
        language: userSessions[0]?.context.language || '',
        deviceType: this.detectDeviceType(userSessions[0]?.context.userAgent || '')
      }
    };

    this.state.users.set(userId, userEngagement);
  }

  private detectDeviceType(userAgent: string): 'desktop' | 'mobile' | 'tablet' {
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const tabletRegex = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i;
    
    if (tabletRegex.test(userAgent)) return 'tablet';
    if (mobileRegex.test(userAgent)) return 'mobile';
    return 'desktop';
  }

  // Real-time monitoring methods
  public getRealTimeMetrics() {
    return this.state.realTimeMetrics;
  }

  public getMonitoringConfig() {
    return this.state.monitoringConfig;
  }

  public updateMonitoringConfig(config: Partial<UserConstituencyState['monitoringConfig']>): void {
    this.state.monitoringConfig = { ...this.state.monitoringConfig, ...config };
    this.emit('monitoringConfigUpdated', this.state.monitoringConfig);
  }

  public getPerformanceAnalytics() {
    const sessions = this.getAllSessions();
    const allPageLoadTimes = sessions.flatMap(s => s.performance.pageLoadTimes);
    const allApiResponseTimes = sessions.flatMap(s => s.performance.apiResponseTimes);
    const allErrors = sessions.reduce((sum, s) => sum + s.performance.errorCount, 0);

    return {
      averagePageLoadTime: allPageLoadTimes.length > 0 ? allPageLoadTimes.reduce((sum, time) => sum + time, 0) / allPageLoadTimes.length : 0,
      averageApiResponseTime: allApiResponseTimes.length > 0 ? allApiResponseTimes.reduce((sum, time) => sum + time, 0) / allApiResponseTimes.length : 0,
      totalErrors: allErrors,
      errorRate: sessions.length > 0 ? (allErrors / sessions.length) * 100 : 0,
      slowPageLoads: allPageLoadTimes.filter(time => time > 3000).length,
      slowApiCalls: allApiResponseTimes.filter(time => time > 1000).length
    };
  }

  public getBehaviorAnalytics() {
    const sessions = this.getAllSessions();
    const totalClicks = sessions.reduce((sum, s) => sum + s.behavior.clicks, 0);
    const totalScrolls = sessions.reduce((sum, s) => sum + s.behavior.scrolls, 0);
    const totalMouseMovements = sessions.reduce((sum, s) => sum + s.behavior.mouseMovements, 0);
    const totalKeyStrokes = sessions.reduce((sum, s) => sum + s.behavior.keyStrokes, 0);

    return {
      totalInteractions: totalClicks + totalScrolls + totalKeyStrokes,
      clickToMovementRatio: totalMouseMovements > 0 ? totalClicks / totalMouseMovements : 0,
      averageClicksPerSession: sessions.length > 0 ? totalClicks / sessions.length : 0,
      averageScrollsPerSession: sessions.length > 0 ? totalScrolls / sessions.length : 0,
      averageKeyStrokesPerSession: sessions.length > 0 ? totalKeyStrokes / sessions.length : 0,
      engagementPatterns: {
        highEngagement: sessions.filter(s => s.engagement.score > 70).length,
        mediumEngagement: sessions.filter(s => s.engagement.score > 40 && s.engagement.score <= 70).length,
        lowEngagement: sessions.filter(s => s.engagement.score <= 40).length
      }
    };
  }

  // Existing methods remain the same...
  public endUserSession(sessionId: string): boolean {
    const session = this.state.sessions.get(sessionId);
    if (session) {
      const now = new Date();
      session.endTime = now;
      session.duration = now.getTime() - session.startTime.getTime();
      
      this.updateSessionEngagement(session);
      this.updateUserEngagement(session.userId);
      this.state.realTimeMetrics.activeUsers.delete(session.userId);
      this.emit('userSessionEnded', session);
      
      return true;
    }
    return false;
  }

  public updateFeedbackStatus(feedbackId: string, status: UserFeedback['status'], resolution?: string): boolean {
    const feedback = this.state.feedback.get(feedbackId);
    if (feedback) {
      feedback.status = status;
      if (resolution) {
        feedback.resolution = resolution;
      }
      this.emit('feedbackStatusUpdated', { feedbackId, status, resolution });
      return true;
    }
    return false;
  }

  public assignFeedback(feedbackId: string, assignedTo: string): boolean {
    const feedback = this.state.feedback.get(feedbackId);
    if (feedback) {
      feedback.assignedTo = assignedTo;
      this.emit('feedbackAssigned', { feedbackId, assignedTo });
      return true;
    }
    return false;
  }

  private updateSessionEngagement(session: UserSession): void {
    const activityCount = session.activities.length;
    const timeSpent = session.duration;
    const featureCount = new Set(session.activities
      .filter(a => a.type === 'feature_use')
      .map(a => a.details.feature as string)
    ).size;

    // Enhanced engagement calculation with real monitoring data
    const timeScore = Math.min(100, (timeSpent / (30 * 60 * 1000)) * 30); // 30 minutes = 30 points
    const activityScore = Math.min(25, activityCount * 1.5); // 17 activities = 25 points
    const featureScore = Math.min(15, featureCount * 3); // 5 features = 15 points
    const performanceScore = Math.min(20, Math.max(0, 20 - (session.performance.errorCount * 2))); // Error penalty
    const behaviorScore = Math.min(10, Math.min(session.behavior.clicks, 10)); // Click engagement

    session.engagement.score = Math.round(timeScore + activityScore + featureScore + performanceScore + behaviorScore);
    session.engagement.timeSpent = timeSpent;
    session.engagement.featuresUsed = Array.from(new Set(session.activities
      .filter(a => a.type === 'feature_use')
      .map(a => a.details.feature as string)
    ));
  }

  private calculateSatisfactionScore(feedback: UserFeedback[]): number {
    if (feedback.length === 0) return 0;

    const scores = feedback.map(f => {
      switch (f.type) {
        case 'praise': return 5;
        case 'feature_request': return 3;
        case 'general_feedback': return 2;
        case 'complaint': return 1;
        case 'bug_report': return 0;
        default: return 2;
      }
    });

    return Math.round(scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length);
  }

  private updateMetrics(): void {
    const users = Array.from(this.state.users.values());
    const sessions = Array.from(this.state.sessions.values());
    const feedback = Array.from(this.state.feedback.values());

    const now = new Date();
    const activeThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours

    this.state.metrics = {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.lastActive > activeThreshold).length,
      totalSessions: sessions.length,
      totalFeedback: feedback.length,
      averageEngagementScore: users.length > 0 
        ? Math.round(users.reduce((sum, u) => sum + u.engagementScore, 0) / users.length)
        : 0,
      averageSatisfactionScore: users.length > 0
        ? Math.round(users.reduce((sum, u) => sum + u.satisfactionScore, 0) / users.length)
        : 0
    };
  }

  // Query Methods
  public getUserSession(sessionId: string): UserSession | undefined {
    return this.state.sessions.get(sessionId);
  }

  public getUserEngagement(userId: string): UserEngagement | undefined {
    return this.state.users.get(userId);
  }

  public getFeedback(feedbackId: string): UserFeedback | undefined {
    return this.state.feedback.get(feedbackId);
  }

  public getAllUsers(): UserEngagement[] {
    return Array.from(this.state.users.values());
  }

  public getAllSessions(): UserSession[] {
    return Array.from(this.state.sessions.values());
  }

  public getAllFeedback(): UserFeedback[] {
    return Array.from(this.state.feedback.values());
  }

  public getFeedbackByStatus(status: UserFeedback['status']): UserFeedback[] {
    return this.getAllFeedback().filter(f => f.status === status);
  }

  public getFeedbackByPriority(priority: UserFeedback['priority']): UserFeedback[] {
    return this.getAllFeedback().filter(f => f.priority === priority);
  }

  public getActiveSessions(): UserSession[] {
    return this.getAllSessions().filter(s => !s.endTime);
  }

  // Analytics
  public getEngagementAnalytics() {
    const users = this.getAllUsers();
    const sessions = this.getAllSessions();
    const feedback = this.getAllFeedback();

    return {
      userMetrics: {
        totalUsers: users.length,
        activeUsers: this.state.metrics.activeUsers,
        averageEngagementScore: this.state.metrics.averageEngagementScore,
        averageSatisfactionScore: this.state.metrics.averageSatisfactionScore
      },
      sessionMetrics: {
        totalSessions: sessions.length,
        activeSessions: this.getActiveSessions().length,
        averageSessionDuration: sessions.length > 0 
          ? sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length
          : 0
      },
      feedbackMetrics: {
        totalFeedback: feedback.length,
        feedbackByType: this.groupFeedbackByType(feedback),
        feedbackByStatus: this.groupFeedbackByStatus(feedback),
        averageResolutionTime: this.calculateAverageResolutionTime(feedback)
      },
      performanceMetrics: this.getPerformanceAnalytics(),
      behaviorMetrics: this.getBehaviorAnalytics()
    };
  }

  private groupFeedbackByType(feedback: UserFeedback[]): Record<string, number> {
    return feedback.reduce((acc, f) => {
      acc[f.type] = (acc[f.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private groupFeedbackByStatus(feedback: UserFeedback[]): Record<string, number> {
    return feedback.reduce((acc, f) => {
      acc[f.status] = (acc[f.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private calculateAverageResolutionTime(feedback: UserFeedback[]): number {
    const resolvedFeedback = feedback.filter(f => f.status === 'resolved');
    if (resolvedFeedback.length === 0) return 0;

    const totalTime = resolvedFeedback.reduce((sum, f) => {
      // This would need actual resolution timestamps in a real implementation
      return sum + 24 * 60 * 60 * 1000; // Placeholder: 24 hours average
    }, 0);

    return totalTime / resolvedFeedback.length;
  }

  public getState(): UserConstituencyState {
    return this.state;
  }

  public async healthCheck(): Promise<any> {
    this.updateMetrics();
    this.updateRealTimeMetrics();
    
    return {
      totalUsers: this.state.metrics.totalUsers,
      activeUsers: this.state.metrics.activeUsers,
      totalSessions: this.state.metrics.totalSessions,
      totalFeedback: this.state.metrics.totalFeedback,
      averageEngagementScore: this.state.metrics.averageEngagementScore,
      averageSatisfactionScore: this.state.metrics.averageSatisfactionScore,
      realTimeMetrics: this.state.realTimeMetrics,
      monitoringConfig: this.state.monitoringConfig,
      performanceAnalytics: this.getPerformanceAnalytics(),
      behaviorAnalytics: this.getBehaviorAnalytics(),
      timestamp: new Date().toISOString()
    };
  }

  public stop(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
  }
} 