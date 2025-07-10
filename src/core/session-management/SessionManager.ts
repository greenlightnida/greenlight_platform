import { EventEmitter } from 'events';

import { generateId, generateSessionId, generateLaunchSessionId, generateWorkSessionId } from '../../utils/common/formatting';

export interface Session {
  id: string;
  userId: string;
  startTime: Date;
  lastActivity: Date;
  endTime?: Date;
  duration: number; // in milliseconds
  metadata: Record<string, unknown>;
  events: SessionEvent[];
  status: 'active' | 'ended' | 'expired';
}

export interface SessionEvent {
  id: string;
  timestamp: Date;
  type: string;
  data: Record<string, unknown>;
}

export interface SessionConfig {
  maxDuration: number; // in milliseconds
  idleTimeout: number; // in milliseconds
  maxSessionsPerUser: number;
  cleanupInterval: number; // in milliseconds
}

class SessionManager extends EventEmitter {
  private sessions: Map<string, Session> = new Map();
  private config: SessionConfig;
  private cleanupInterval?: NodeJS.Timeout;

  constructor(config?: Partial<SessionConfig>) {
    super();
    this.config = {
      maxDuration: 24 * 60 * 60 * 1000, // 24 hours
      idleTimeout: 30 * 60 * 1000, // 30 minutes
      maxSessionsPerUser: 5,
      cleanupInterval: 5 * 60 * 1000, // 5 minutes
      ...config
    };
    this.startCleanup();
  }

  createSession(userId: string, metadata?: Record<string, unknown>): Session {
    const sessionId = generateSessionId('user', userId);
    const now = new Date();
    
    const session: Session = {
      id: sessionId,
      userId,
      startTime: now,
      lastActivity: now,
      duration: 0,
      metadata: {
        sessionType: 'user-session',
        sessionLabel: `User Session - ${userId}`,
        category: 'user-interaction',
        priority: 'medium',
        tags: ['user', 'interactive', 'session'],
        ...metadata
      },
      events: [],
      status: 'active'
    };

    this.sessions.set(sessionId, session);
    this.emit('session-created', session);
    
    return session;
  }

  createLaunchSession(metadata?: Record<string, unknown>): Session {
    const sessionId = generateLaunchSessionId();
    const now = new Date();
    
    const session: Session = {
      id: sessionId,
      userId: 'system',
      startTime: now,
      lastActivity: now,
      duration: 0,
      metadata: {
        sessionType: 'launch-session',
        sessionLabel: 'Greenlight Platform Launch Protocol',
        category: 'system-launch',
        priority: 'high',
        tags: ['launch', 'protocol', 'system-health', 'context-awareness'],
        estimatedDuration: '2-5 minutes',
        ...metadata
      },
      events: [],
      status: 'active'
    };

    this.sessions.set(sessionId, session);
    this.emit('session-created', session);
    
    return session;
  }

  createWorkSession(context: string, metadata?: Record<string, unknown>): Session {
    const sessionId = generateWorkSessionId(context);
    const now = new Date();
    
    const session: Session = {
      id: sessionId,
      userId: 'system',
      startTime: now,
      lastActivity: now,
      duration: 0,
      metadata: {
        sessionType: 'work-session',
        sessionLabel: `Work Session - ${context}`,
        category: 'work-collaboration',
        priority: 'medium',
        tags: ['work', 'collaboration', context.toLowerCase()],
        context: context,
        ...metadata
      },
      events: [],
      status: 'active'
    };

    this.sessions.set(sessionId, session);
    this.emit('session-created', session);
    
    return session;
  }

  getSession(sessionId: string): Session | undefined {
    const session = this.sessions.get(sessionId);
    if (session && session.status === 'active') {
      this.updateActivity(sessionId);
      return session;
    }
    return undefined;
  }

  updateActivity(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (session && session.status === 'active') {
      const now = new Date();
      session.lastActivity = now;
      session.duration = now.getTime() - session.startTime.getTime();
      this.emit('session-activity', session);
      return true;
    }
    return false;
  }

  addEvent(sessionId: string, eventType: string, eventData?: Record<string, unknown>): boolean {
    const session = this.sessions.get(sessionId);
    if (session && session.status === 'active') {
      const event: SessionEvent = {
        id: generateId(),
        timestamp: new Date(),
        type: eventType,
        data: eventData || {}
      };
      
      session.events.push(event);
      this.updateActivity(sessionId);
      this.emit('session-event', { session, event });
      return true;
    }
    return false;
  }

  endSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (session && session.status === 'active') {
      const now = new Date();
      session.endTime = now;
      session.duration = now.getTime() - session.startTime.getTime();
      session.status = 'ended';
      
      this.emit('session-ended', session);
      return true;
    }
    return false;
  }

  getUserSessions(userId: string): Session[] {
    return Array.from(this.sessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
  }

  getActiveSessions(): Session[] {
    return Array.from(this.sessions.values())
      .filter(session => session.status === 'active')
      .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
  }

  getSessionStats(): {
    total: number;
    active: number;
    ended: number;
    expired: number;
    averageDuration: number;
  } {
    const sessions = Array.from(this.sessions.values());
    const active = sessions.filter(s => s.status === 'active').length;
    const ended = sessions.filter(s => s.status === 'ended').length;
    const expired = sessions.filter(s => s.status === 'expired').length;
    
    const completedSessions = sessions.filter(s => s.status !== 'active');
    const averageDuration = completedSessions.length > 0
      ? completedSessions.reduce((sum, s) => sum + s.duration, 0) / completedSessions.length
      : 0;

    return {
      total: sessions.length,
      active,
      ended,
      expired,
      averageDuration
    };
  }

  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  private cleanup(): void {
    const now = new Date();
    const sessionsToExpire: Session[] = [];

    for (const session of this.sessions.values()) {
      if (session.status !== 'active') continue;

      const timeSinceActivity = now.getTime() - session.lastActivity.getTime();
      const totalDuration = now.getTime() - session.startTime.getTime();

      // Check for idle timeout
      if (timeSinceActivity > this.config.idleTimeout) {
        session.status = 'expired';
        session.endTime = now;
        session.duration = totalDuration;
        sessionsToExpire.push(session);
        this.emit('session-expired', session);
      }
      // Check for max duration
      else if (totalDuration > this.config.maxDuration) {
        session.status = 'expired';
        session.endTime = now;
        session.duration = totalDuration;
        sessionsToExpire.push(session);
        this.emit('session-expired', session);
      }
    }

    // Clean up old sessions (keep last 1000 sessions)
    const allSessions = Array.from(this.sessions.values())
      .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
    
    if (allSessions.length > 1000) {
      const sessionsToRemove = allSessions.slice(1000);
      for (const session of sessionsToRemove) {
        this.sessions.delete(session.id);
      }
    }
  }

  stop(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}
