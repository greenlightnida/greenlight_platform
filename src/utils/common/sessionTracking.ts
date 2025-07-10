/**
 * Session Tracking Utilities
 * Enhanced session management with unique IDs and comprehensive labeling
 */

import { generateSessionId, generateLaunchSessionId, generateWorkSessionId, generateAuditSessionId, generateProtocolSessionId, validateSessionId, extractSessionType, extractSessionTimestamp } from './formatting';

export interface SessionInfo {
  id: string;
  type: string;
  label: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  startTime: Date;
  endTime?: Date;
  duration?: string;
  status: 'active' | 'completed' | 'failed' | 'cancelled';
  metadata: Record<string, unknown>;
}

export interface SessionSummary {
  totalSessions: number;
  activeSessions: number;
  completedSessions: number;
  failedSessions: number;
  averageDuration: string;
  sessionTypes: Record<string, number>;
  recentSessions: SessionInfo[];
}

export class SessionTracker {
  private sessions: Map<string, SessionInfo> = new Map();

  /**
   * Create a new session with enhanced tracking
   * @param type
   * @param label
   * @param category
   * @param priority
   * @param tags
   * @param metadata
   */
  createSession(
    type: string,
    label: string,
    category: string,
    priority: SessionInfo['priority'] = 'medium',
    tags: string[] = [],
    metadata: Record<string, unknown> = {}
  ): SessionInfo {
    const sessionId = generateSessionId(type);
    const startTime = new Date();
    
    const session: SessionInfo = {
      id: sessionId,
      type,
      label,
      category,
      priority,
      tags,
      startTime,
      status: 'active',
      metadata: {
        sessionType: type,
        sessionLabel: label,
        category,
        priority,
        tags,
        estimatedDuration: metadata.estimatedDuration || 'unknown',
        ...metadata
      }
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Create a launch session
   * @param metadata
   */
  createLaunchSession(metadata: Record<string, unknown> = {}): SessionInfo {
    const sessionId = generateLaunchSessionId();
    const startTime = new Date();
    
    const session: SessionInfo = {
      id: sessionId,
      type: 'launch',
      label: 'Greenlight Platform Launch Protocol',
      category: 'system-launch',
      priority: 'high',
      tags: ['launch', 'protocol', 'system-health', 'context-awareness'],
      startTime,
      status: 'active',
      metadata: {
        sessionType: 'launch',
        sessionLabel: 'Greenlight Platform Launch Protocol',
        category: 'system-launch',
        priority: 'high',
        tags: ['launch', 'protocol', 'system-health', 'context-awareness'],
        estimatedDuration: '2-5 minutes',
        protocolVersion: '2.0.0',
        ...metadata
      }
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Create a work session
   * @param context
   * @param metadata
   */
  createWorkSession(context: string, metadata: Record<string, unknown> = {}): SessionInfo {
    const sessionId = generateWorkSessionId(context);
    const startTime = new Date();
    
    const session: SessionInfo = {
      id: sessionId,
      type: 'work',
      label: `Work Session - ${context}`,
      category: 'work-collaboration',
      priority: 'medium',
      tags: ['work', 'collaboration', context.toLowerCase()],
      startTime,
      status: 'active',
      metadata: {
        sessionType: 'work',
        sessionLabel: `Work Session - ${context}`,
        category: 'work-collaboration',
        priority: 'medium',
        tags: ['work', 'collaboration', context.toLowerCase()],
        context,
        estimatedDuration: 'variable',
        ...metadata
      }
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Create an audit session
   * @param metadata
   */
  createAuditSession(metadata: Record<string, unknown> = {}): SessionInfo {
    const sessionId = generateAuditSessionId();
    const startTime = new Date();
    
    const session: SessionInfo = {
      id: sessionId,
      type: 'audit',
      label: 'System Audit Session',
      category: 'system-audit',
      priority: 'high',
      tags: ['audit', 'system-health', 'compliance'],
      startTime,
      status: 'active',
      metadata: {
        sessionType: 'audit',
        sessionLabel: 'System Audit Session',
        category: 'system-audit',
        priority: 'high',
        tags: ['audit', 'system-health', 'compliance'],
        estimatedDuration: '5-15 minutes',
        ...metadata
      }
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Complete a session
   * @param sessionId
   * @param status
   */
  completeSession(sessionId: string, status: 'completed' | 'failed' | 'cancelled' = 'completed'): SessionInfo | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    session.endTime = new Date();
    session.status = status;
    session.duration = this.calculateDuration(session.startTime, session.endTime);
    
    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Get session by ID
   * @param sessionId
   */
  getSession(sessionId: string): SessionInfo | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * Get all sessions
   */
  getAllSessions(): SessionInfo[] {
    return Array.from(this.sessions.values());
  }

  /**
   * Get active sessions
   */
  getActiveSessions(): SessionInfo[] {
    return Array.from(this.sessions.values()).filter(s => s.status === 'active');
  }

  /**
   * Get sessions by type
   * @param type
   */
  getSessionsByType(type: string): SessionInfo[] {
    return Array.from(this.sessions.values()).filter(s => s.type === type);
  }

  /**
   * Get sessions by category
   * @param category
   */
  getSessionsByCategory(category: string): SessionInfo[] {
    return Array.from(this.sessions.values()).filter(s => s.category === category);
  }

  /**
   * Get session summary
   */
  getSessionSummary(): SessionSummary {
    const sessions = Array.from(this.sessions.values());
    const activeSessions = sessions.filter(s => s.status === 'active');
    const completedSessions = sessions.filter(s => s.status === 'completed');
    const failedSessions = sessions.filter(s => s.status === 'failed');

    // Calculate average duration
    const sessionsWithDuration = sessions.filter(s => s.duration);
    const totalDurationMs = sessionsWithDuration.reduce((total, s) => {
      return total + this.parseDuration(s.duration!);
    }, 0);
    const averageDurationMs = sessionsWithDuration.length > 0 ? totalDurationMs / sessionsWithDuration.length : 0;

    // Count session types
    const sessionTypes: Record<string, number> = {};
    sessions.forEach(s => {
      sessionTypes[s.type] = (sessionTypes[s.type] || 0) + 1;
    });

    return {
      totalSessions: sessions.length,
      activeSessions: activeSessions.length,
      completedSessions: completedSessions.length,
      failedSessions: failedSessions.length,
      averageDuration: this.formatDuration(averageDurationMs),
      sessionTypes,
      recentSessions: sessions.slice(-10).reverse() // Last 10 sessions
    };
  }

  /**
   * Validate session ID
   * @param sessionId
   */
  validateSessionId(sessionId: string): boolean {
    return validateSessionId(sessionId);
  }

  /**
   * Extract session type from ID
   * @param sessionId
   */
  extractSessionType(sessionId: string): string {
    return extractSessionType(sessionId);
  }

  /**
   * Extract timestamp from session ID
   * @param sessionId
   */
  extractSessionTimestamp(sessionId: string): number | null {
    return extractSessionTimestamp(sessionId);
  }

  /**
   * Calculate duration between two dates
   * @param startTime
   * @param endTime
   */
  private calculateDuration(startTime: Date, endTime: Date): string {
    const duration = endTime.getTime() - startTime.getTime();
    return this.formatDuration(duration);
  }

  /**
   * Format duration in milliseconds to human readable string
   * @param ms
   */
  private formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${seconds}s`;
    }
  }

  /**
   * Parse duration string back to milliseconds
   * @param duration
   */
  private parseDuration(duration: string): number {
    const parts = duration.split(' ');
    let totalMs = 0;

    for (const part of parts) {
      if (part.endsWith('h')) {
        totalMs += parseInt(part.slice(0, -1)) * 60 * 60 * 1000;
      } else if (part.endsWith('m')) {
        totalMs += parseInt(part.slice(0, -1)) * 60 * 1000;
      } else if (part.endsWith('s')) {
        totalMs += parseInt(part.slice(0, -1)) * 1000;
      }
    }

    return totalMs;
  }

  /**
   * Generate session report
   */
  generateSessionReport(): string {
    const summary = this.getSessionSummary();
    const sessions = this.getAllSessions();

    let report = `# Session Tracking Report\n\n`;
    report += `## Summary\n`;
    report += `- Total Sessions: ${summary.totalSessions}\n`;
    report += `- Active Sessions: ${summary.activeSessions}\n`;
    report += `- Completed Sessions: ${summary.completedSessions}\n`;
    report += `- Failed Sessions: ${summary.failedSessions}\n`;
    report += `- Average Duration: ${summary.averageDuration}\n\n`;

    report += `## Session Types\n`;
    Object.entries(summary.sessionTypes).forEach(([type, count]) => {
      report += `- ${type}: ${count}\n`;
    });
    report += `\n`;

    report += `## Recent Sessions\n`;
    summary.recentSessions.forEach(session => {
      const status = session.status === 'active' ? '🟢' : 
                    session.status === 'completed' ? '✅' : 
                    session.status === 'failed' ? '❌' : '⚠️';
      report += `${status} **${session.label}** (${session.id})\n`;
      report += `   - Type: ${session.type}\n`;
      report += `   - Category: ${session.category}\n`;
      report += `   - Priority: ${session.priority}\n`;
      report += `   - Duration: ${session.duration || 'ongoing'}\n`;
      report += `   - Tags: ${session.tags.join(', ')}\n\n`;
    });

    return report;
  }
}

// Export singleton instance