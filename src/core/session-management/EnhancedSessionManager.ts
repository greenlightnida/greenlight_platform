import { EventEmitter } from 'events';

import { Session, SessionEvent, SessionConfig } from './SessionManager';

// Import SessionManager class directly since it's not exported
const { SessionManager } = require('./SessionManager');

// Generate unique ID function
const generateId = (): string => {
  return Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
};

export interface SessionHistory {
  id: string;
  sessionId: string;
  timestamp: Date;
  action: string;
  data: Record<string, unknown>;
  metadata: Record<string, unknown>;
}

export interface ProtocolCadence {
  precommit: boolean;
  prewrap: boolean;
  launch: boolean;
  wrap: boolean;
  council: boolean;
  audit: boolean;
}

export interface EnhancedSession extends Session {
  history: SessionHistory[];
  cadence: ProtocolCadence;
  contextPreserved: boolean;
  nextSessionReady: boolean;
  protocolState: Record<string, unknown>;
}

class EnhancedSessionManager extends EventEmitter {
  private sessionManager: any; // Using any since SessionManager is not properly exported
  private history: Map<string, SessionHistory[]> = new Map();
  private cadenceState: Map<string, ProtocolCadence> = new Map();
  private protocolState: Map<string, Record<string, unknown>> = new Map();

  constructor() {
    super();
    this.sessionManager = new SessionManager();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.sessionManager.on('session-created', (session: Session) => {
      this.initializeEnhancedSession(session);
    });

    this.sessionManager.on('session-ended', (session: Session) => {
      this.finalizeEnhancedSession(session);
    });

    this.sessionManager.on('session-event', ({ session, event }) => {
      this.recordSessionEvent(session.id, event);
    });
  }

  private initializeEnhancedSession(session: Session) {
    const cadence: ProtocolCadence = {
      precommit: false,
      prewrap: false,
      launch: true, // Launch is always true when session is created
      wrap: false,
      council: false,
      audit: false
    };

    this.cadenceState.set(session.id, cadence);
    this.protocolState.set(session.id, {});
    this.history.set(session.id, []);

    this.recordHistory(session.id, 'session-initialized', {
      sessionType: session.metadata.sessionType,
      cadence: cadence
    });

    this.emit('enhanced-session-created', this.getEnhancedSession(session.id));
  }

  private finalizeEnhancedSession(session: Session) {
    const enhancedSession = this.getEnhancedSession(session.id);
    if (enhancedSession) {
      this.recordHistory(session.id, 'session-finalized', {
        duration: session.duration,
        eventsCount: session.events.length,
        contextPreserved: enhancedSession.contextPreserved
      });

      this.emit('enhanced-session-ended', enhancedSession);
    }
  }

  createLaunchSession(metadata?: Record<string, unknown>): EnhancedSession {
    const session = this.sessionManager.createLaunchSession(metadata);
    return this.getEnhancedSession(session.id)!;
  }

  createWorkSession(context: string, metadata?: Record<string, unknown>): EnhancedSession {
    const session = this.sessionManager.createWorkSession(context, metadata);
    return this.getEnhancedSession(session.id)!;
  }

  createUserSession(userId: string, metadata?: Record<string, unknown>): EnhancedSession {
    const session = this.sessionManager.createSession(userId, metadata);
    return this.getEnhancedSession(session.id)!;
  }

  getEnhancedSession(sessionId: string): EnhancedSession | undefined {
    const session = this.sessionManager.getSession(sessionId);
    if (!session) return undefined;

    const cadence = this.cadenceState.get(sessionId) || this.getDefaultCadence();
    const history = this.history.get(sessionId) || [];
    const protocolState = this.protocolState.get(sessionId) || {};

    return {
      ...session,
      history,
      cadence,
      contextPreserved: this.isContextPreserved(sessionId),
      nextSessionReady: this.isNextSessionReady(sessionId),
      protocolState
    };
  }

  private getDefaultCadence(): ProtocolCadence {
    return {
      precommit: false,
      prewrap: false,
      launch: false,
      wrap: false,
      council: false,
      audit: false
    };
  }

  private isContextPreserved(sessionId: string): boolean {
    const history = this.history.get(sessionId) || [];
    const contextEvents = history.filter(h => 
      h.action === 'context-preserved' || h.action === 'prewrap-completed'
    );
    return contextEvents.length > 0;
  }

  private isNextSessionReady(sessionId: string): boolean {
    const history = this.history.get(sessionId) || [];
    const readyEvents = history.filter(h => 
      h.action === 'next-session-ready' || h.action === 'wrap-completed'
    );
    return readyEvents.length > 0;
  }

  recordHistory(sessionId: string, action: string, data: Record<string, unknown> = {}) {
    const historyEntry: SessionHistory = {
      id: generateId(),
      sessionId,
      timestamp: new Date(),
      action,
      data,
      metadata: {
        sessionType: 'history-entry',
        category: 'session-management',
        priority: 'medium'
      }
    };

    const sessionHistory = this.history.get(sessionId) || [];
    sessionHistory.push(historyEntry);
    this.history.set(sessionId, sessionHistory);

    this.emit('history-recorded', { sessionId, historyEntry });
  }

  private recordSessionEvent(sessionId: string, event: any) {
    this.recordHistory(sessionId, 'session-event', {
      eventType: event.type,
      eventData: event.data
    });
  }

  updateCadence(sessionId: string, protocol: keyof ProtocolCadence, status: boolean) {
    const cadence = this.cadenceState.get(sessionId);
    if (cadence) {
      cadence[protocol] = status;
      this.cadenceState.set(sessionId, cadence);

      this.recordHistory(sessionId, 'cadence-updated', {
        protocol,
        status,
        cadence
      });

      this.emit('cadence-updated', { sessionId, protocol, status, cadence });
    }
  }

  updateProtocolState(sessionId: string, protocol: string, state: Record<string, unknown>) {
    const currentState = this.protocolState.get(sessionId) || {};
    currentState[protocol] = state;
    this.protocolState.set(sessionId, currentState);

    this.recordHistory(sessionId, 'protocol-state-updated', {
      protocol,
      state
    });
  }

  getSessionHistory(sessionId: string): SessionHistory[] {
    return this.history.get(sessionId) || [];
  }

  getActiveSessions(): EnhancedSession[] {
    const activeSessions = this.sessionManager.getActiveSessions();
    return activeSessions
      .map(session => this.getEnhancedSession(session.id))
      .filter((session): session is EnhancedSession => session !== undefined);
  }

  endSession(sessionId: string): boolean {
    const success = this.sessionManager.endSession(sessionId);
    if (success) {
      this.recordHistory(sessionId, 'session-ended', {
        endTime: new Date().toISOString()
      });
    }
    return success;
  }

  preserveContext(sessionId: string): boolean {
    const session = this.getEnhancedSession(sessionId);
    if (session) {
      this.recordHistory(sessionId, 'context-preserved', {
        timestamp: new Date().toISOString(),
        sessionState: {
          events: session.events.length,
          duration: session.duration,
          cadence: session.cadence
        }
      });

      this.emit('context-preserved', { sessionId, session });
      return true;
    }
    return false;
  }

  prepareNextSession(sessionId: string): boolean {
    const session = this.getEnhancedSession(sessionId);
    if (session) {
      this.recordHistory(sessionId, 'next-session-ready', {
        timestamp: new Date().toISOString(),
        contextPreserved: session.contextPreserved
      });

      this.emit('next-session-ready', { sessionId, session });
      return true;
    }
    return false;
  }

  getSessionStats() {
    const stats = this.sessionManager.getSessionStats();
    const enhancedStats = {
      ...stats,
      sessionsWithHistory: this.history.size,
      totalHistoryEntries: Array.from(this.history.values())
        .reduce((total, entries) => total + entries.length, 0),
      averageHistoryPerSession: this.history.size > 0 
        ? Array.from(this.history.values())
            .reduce((total, entries) => total + entries.length, 0) / this.history.size
        : 0
    };

    return enhancedStats;
  }

  // Protocol coordination methods
  async executePrecommit(sessionId: string): Promise<boolean> {
    const session = this.getEnhancedSession(sessionId);
    if (!session) return false;

    try {
      this.recordHistory(sessionId, 'precommit-started');
      
      // Simulate precommit execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.updateCadence(sessionId, 'precommit', true);
      this.recordHistory(sessionId, 'precommit-completed');
      
      return true;
    } catch (error) {
      this.recordHistory(sessionId, 'precommit-failed', { error: (error as Error).message });
      return false;
    }
  }

  async executePrewrap(sessionId: string): Promise<boolean> {
    const session = this.getEnhancedSession(sessionId);
    if (!session) return false;

    try {
      this.recordHistory(sessionId, 'prewrap-started');
      
      // Preserve context
      this.preserveContext(sessionId);
      
      // Simulate prewrap execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.updateCadence(sessionId, 'prewrap', true);
      this.recordHistory(sessionId, 'prewrap-completed');
      
      return true;
    } catch (error) {
      this.recordHistory(sessionId, 'prewrap-failed', { error: (error as Error).message });
      return false;
    }
  }

  async executeWrap(sessionId: string): Promise<boolean> {
    const session = this.getEnhancedSession(sessionId);
    if (!session) return false;

    try {
      this.recordHistory(sessionId, 'wrap-started');
      
      // Prepare next session
      this.prepareNextSession(sessionId);
      
      // End the session
      this.endSession(sessionId);
      
      this.updateCadence(sessionId, 'wrap', true);
      this.recordHistory(sessionId, 'wrap-completed');
      
      return true;
    } catch (error) {
      this.recordHistory(sessionId, 'wrap-failed', { error: (error as Error).message });
      return false;
    }
  }

  // Historian methods
  getSessionTimeline(sessionId: string): SessionHistory[] {
    const history = this.getSessionHistory(sessionId);
    return history.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  getSessionSummary(sessionId: string) {
    const session = this.getEnhancedSession(sessionId);
    const history = this.getSessionHistory(sessionId);
    
    if (!session) return null;

    const summary = {
      sessionId,
      sessionType: session.metadata.sessionType,
      startTime: session.startTime,
      endTime: session.endTime,
      duration: session.duration,
      totalEvents: session.events.length,
      totalHistoryEntries: history.length,
      cadence: session.cadence,
      contextPreserved: session.contextPreserved,
      nextSessionReady: session.nextSessionReady,
      keyEvents: history
        .filter(h => ['session-initialized', 'context-preserved', 'next-session-ready', 'session-finalized'].includes(h.action))
        .map(h => ({
          action: h.action,
          timestamp: h.timestamp,
          data: h.data
        }))
    };

    return summary;
  }

  exportSessionData(sessionId: string) {
    const session = this.getEnhancedSession(sessionId);
    const history = this.getSessionHistory(sessionId);
    
    if (!session) return null;

    return {
      session,
      history,
      summary: this.getSessionSummary(sessionId),
      exportTimestamp: new Date().toISOString()
    };
  }
}

export { EnhancedSessionManager };
export type { Session, SessionEvent, SessionConfig } from './SessionManager'; 