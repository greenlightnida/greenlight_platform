import { EventEmitter } from 'events';

import { SteeringManager, SessionContext, IDERule, ContextEnhancement, DriftPrevention } from '../governance/SteeringManager';

import { EnhancedSessionManager, EnhancedSession, SessionHistory, ProtocolCadence } from './EnhancedSessionManager';

export interface IntegratedSession extends EnhancedSession {
  steeringContext: SessionContext | null;
  ideRules: IDERule[];
  contextEnhancements: ContextEnhancement[];
  driftPreventions: DriftPrevention[];
  steeringMetrics: {
    rulesApplied: number;
    enhancementsApplied: number;
    driftDetections: number;
    contextPreservations: number;
    sessionContinuity: number;
  };
}

export interface ProtocolCoordination {
  precommit: {
    enabled: boolean;
    lastExecuted: Date | null;
    success: boolean;
  };
  prewrap: {
    enabled: boolean;
    lastExecuted: Date | null;
    success: boolean;
  };
  launch: {
    enabled: boolean;
    lastExecuted: Date | null;
    success: boolean;
  };
  wrap: {
    enabled: boolean;
    lastExecuted: Date | null;
    success: boolean;
  };
  council: {
    enabled: boolean;
    lastExecuted: Date | null;
    success: boolean;
  };
  audit: {
    enabled: boolean;
    lastExecuted: Date | null;
    success: boolean;
  };
}

class IntegratedSessionManager extends EventEmitter {
  private enhancedSessionManager: EnhancedSessionManager;
  private steeringManager: SteeringManager;
  private protocolCoordination: Map<string, ProtocolCoordination> = new Map();
  private integratedSessions: Map<string, IntegratedSession> = new Map();

  constructor() {
    super();
    this.enhancedSessionManager = new EnhancedSessionManager();
    this.steeringManager = SteeringManager.getInstance();
    
    // Connect steering manager to enhanced session manager
    this.steeringManager.setSessionManager(this.enhancedSessionManager);
    
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Enhanced Session Manager events
    this.enhancedSessionManager.on('enhanced-session-created', (session: EnhancedSession) => {
      this.initializeIntegratedSession(session);
    });

    this.enhancedSessionManager.on('enhanced-session-ended', (session: EnhancedSession) => {
      this.finalizeIntegratedSession(session);
    });

    this.enhancedSessionManager.on('context-preserved', ({ sessionId, session }) => {
      this.handleContextPreservation(sessionId, session);
    });

    this.enhancedSessionManager.on('next-session-ready', ({ sessionId, session }) => {
      this.handleNextSessionReady(sessionId, session);
    });

    // Steering Manager events
    this.steeringManager.on('contextPreserved', (sessionContext: SessionContext) => {
      this.handleSteeringContextPreserved(sessionContext);
    });

    this.steeringManager.on('contextRestored', (sessionContext: SessionContext) => {
      this.handleSteeringContextRestored(sessionContext);
    });

    this.steeringManager.on('ruleApplied', ({ rule, context }) => {
      this.handleRuleApplied(rule, context);
    });

    this.steeringManager.on('contextEnhanced', (enhancedContext) => {
      this.handleContextEnhanced(enhancedContext);
    });
  }

  private initializeIntegratedSession(session: EnhancedSession) {
    const protocolCoordination: ProtocolCoordination = {
      precommit: { enabled: true, lastExecuted: null, success: false },
      prewrap: { enabled: true, lastExecuted: null, success: false },
      launch: { enabled: true, lastExecuted: new Date(), success: true },
      wrap: { enabled: true, lastExecuted: null, success: false },
      council: { enabled: true, lastExecuted: null, success: false },
      audit: { enabled: true, lastExecuted: null, success: false }
    };

    this.protocolCoordination.set(session.id, protocolCoordination);

    const integratedSession: IntegratedSession = {
      ...session,
      steeringContext: null,
      ideRules: this.steeringManager.getIDERules(),
      contextEnhancements: Array.from(this.steeringManager.getState().contextEnhancements.values()),
      driftPreventions: Array.from(this.steeringManager.getState().driftPreventions.values()),
      steeringMetrics: {
        rulesApplied: 0,
        enhancementsApplied: 0,
        driftDetections: 0,
        contextPreservations: 0,
        sessionContinuity: 0
      }
    };

    this.integratedSessions.set(session.id, integratedSession);
    this.emit('integrated-session-created', integratedSession);
  }

  private finalizeIntegratedSession(session: EnhancedSession) {
    const integratedSession = this.getIntegratedSession(session.id);
    if (integratedSession) {
      this.emit('integrated-session-ended', integratedSession);
    }
  }

  private handleContextPreservation(sessionId: string, session: EnhancedSession) {
    const integratedSession = this.getIntegratedSession(sessionId);
    if (integratedSession) {
      integratedSession.steeringMetrics.contextPreservations++;
      this.emit('context-preserved', { sessionId, integratedSession });
    }
  }

  private handleNextSessionReady(sessionId: string, session: EnhancedSession) {
    const integratedSession = this.getIntegratedSession(sessionId);
    if (integratedSession) {
      integratedSession.steeringMetrics.sessionContinuity++;
      this.emit('next-session-ready', { sessionId, integratedSession });
    }
  }

  private handleSteeringContextPreserved(sessionContext: SessionContext) {
    const integratedSession = this.getIntegratedSession(sessionContext.sessionId);
    if (integratedSession) {
      integratedSession.steeringContext = sessionContext;
      integratedSession.steeringMetrics.contextPreservations++;
      this.emit('steering-context-preserved', { sessionContext, integratedSession });
    }
  }

  private handleSteeringContextRestored(sessionContext: SessionContext) {
    const integratedSession = this.getIntegratedSession(sessionContext.sessionId);
    if (integratedSession) {
      integratedSession.steeringContext = sessionContext;
      integratedSession.steeringMetrics.sessionContinuity++;
      this.emit('steering-context-restored', { sessionContext, integratedSession });
    }
  }

  private handleRuleApplied(rule: IDERule, context: any) {
    const activeSession = this.steeringManager.getActiveSessionContext();
    if (activeSession) {
      const integratedSession = this.getIntegratedSession(activeSession.sessionId);
      if (integratedSession) {
        integratedSession.steeringMetrics.rulesApplied++;
        this.emit('rule-applied', { rule, context, integratedSession });
      }
    }
  }

  private handleContextEnhanced(enhancedContext: any) {
    const activeSession = this.steeringManager.getActiveSessionContext();
    if (activeSession) {
      const integratedSession = this.getIntegratedSession(activeSession.sessionId);
      if (integratedSession) {
        integratedSession.steeringMetrics.enhancementsApplied++;
        this.emit('context-enhanced', { enhancedContext, integratedSession });
      }
    }
  }

  // Session Management Methods
  createLaunchSession(metadata?: Record<string, unknown>): IntegratedSession {
    const enhancedSession = this.enhancedSessionManager.createLaunchSession(metadata);
    return this.getIntegratedSession(enhancedSession.id)!;
  }

  createWorkSession(context: string, metadata?: Record<string, unknown>): IntegratedSession {
    const enhancedSession = this.enhancedSessionManager.createWorkSession(context, metadata);
    return this.getIntegratedSession(enhancedSession.id)!;
  }

  createUserSession(userId: string, metadata?: Record<string, unknown>): IntegratedSession {
    const enhancedSession = this.enhancedSessionManager.createUserSession(userId, metadata);
    return this.getIntegratedSession(enhancedSession.id)!;
  }

  getIntegratedSession(sessionId: string): IntegratedSession | undefined {
    return this.integratedSessions.get(sessionId);
  }

  getActiveSessions(): IntegratedSession[] {
    return this.enhancedSessionManager.getActiveSessions()
      .map(session => this.getIntegratedSession(session.id))
      .filter((session): session is IntegratedSession => session !== undefined);
  }

  endSession(sessionId: string): boolean {
    return this.enhancedSessionManager.endSession(sessionId);
  }

  // Protocol Coordination Methods
  async executePrecommit(sessionId: string): Promise<boolean> {
    const coordination = this.protocolCoordination.get(sessionId);
    if (!coordination) return false;

    try {
      coordination.precommit.lastExecuted = new Date();
      const success = await this.enhancedSessionManager.executePrecommit(sessionId);
      coordination.precommit.success = success;
      
      this.emit('protocol-executed', { sessionId, protocol: 'precommit', success });
      return success;
    } catch (error) {
      coordination.precommit.success = false;
      this.emit('protocol-failed', { sessionId, protocol: 'precommit', error: (error as Error).message });
      return false;
    }
  }

  async executePrewrap(sessionId: string): Promise<boolean> {
    const coordination = this.protocolCoordination.get(sessionId);
    if (!coordination) return false;

    try {
      coordination.prewrap.lastExecuted = new Date();
      const success = await this.enhancedSessionManager.executePrewrap(sessionId);
      coordination.prewrap.success = success;
      
      this.emit('protocol-executed', { sessionId, protocol: 'prewrap', success });
      return success;
    } catch (error) {
      coordination.prewrap.success = false;
      this.emit('protocol-failed', { sessionId, protocol: 'prewrap', error: (error as Error).message });
      return false;
    }
  }

  async executeWrap(sessionId: string): Promise<boolean> {
    const coordination = this.protocolCoordination.get(sessionId);
    if (!coordination) return false;

    try {
      coordination.wrap.lastExecuted = new Date();
      const success = await this.enhancedSessionManager.executeWrap(sessionId);
      coordination.wrap.success = success;
      
      this.emit('protocol-executed', { sessionId, protocol: 'wrap', success });
      return success;
    } catch (error) {
      coordination.wrap.success = false;
      this.emit('protocol-failed', { sessionId, protocol: 'wrap', error: (error as Error).message });
      return false;
    }
  }

  // Steering Manager Integration Methods
  preserveSessionContext(sessionId: string, context: any, ide: 'cursor' | 'vscode'): void {
    this.steeringManager.preserveSessionContext(sessionId, context, ide);
  }

  restoreSessionContext(sessionId: string): SessionContext | null {
    return this.steeringManager.restoreSessionContext(sessionId);
  }

  getActiveSessionContext(): SessionContext | null {
    return this.steeringManager.getActiveSessionContext();
  }

  addIDERule(rule: IDERule): void {
    this.steeringManager.addIDERule(rule);
    // Update all integrated sessions with new rule
    this.integratedSessions.forEach(session => {
      session.ideRules = this.steeringManager.getIDERules();
    });
  }

  removeIDERule(ruleId: string): boolean {
    const success = this.steeringManager.removeIDERule(ruleId);
    if (success) {
      // Update all integrated sessions with updated rules
      this.integratedSessions.forEach(session => {
        session.ideRules = this.steeringManager.getIDERules();
      });
    }
    return success;
  }

  applyIDERules(context: any, ide: 'cursor' | 'vscode'): void {
    this.steeringManager.applyIDERules(context, ide);
  }

  addContextEnhancement(enhancement: ContextEnhancement): void {
    this.steeringManager.addContextEnhancement(enhancement);
    // Update all integrated sessions with new enhancement
    this.integratedSessions.forEach(session => {
      session.contextEnhancements = Array.from(this.steeringManager.getState().contextEnhancements.values());
    });
  }

  removeContextEnhancement(enhancementId: string): boolean {
    const success = this.steeringManager.removeContextEnhancement(enhancementId);
    if (success) {
      // Update all integrated sessions with updated enhancements
      this.integratedSessions.forEach(session => {
        session.contextEnhancements = Array.from(this.steeringManager.getState().contextEnhancements.values());
      });
    }
    return success;
  }

  enhanceContext(context: any): any {
    return this.steeringManager.enhanceContext(context);
  }

  addDriftPrevention(prevention: DriftPrevention): void {
    this.steeringManager.addDriftPrevention(prevention);
    // Update all integrated sessions with new prevention
    this.integratedSessions.forEach(session => {
      session.driftPreventions = Array.from(this.steeringManager.getState().driftPreventions.values());
    });
  }

  removeDriftPrevention(preventionId: string): boolean {
    const success = this.steeringManager.removeDriftPrevention(preventionId);
    if (success) {
      // Update all integrated sessions with updated preventions
      this.integratedSessions.forEach(session => {
        session.driftPreventions = Array.from(this.steeringManager.getState().driftPreventions.values());
      });
    }
    return success;
  }

  detectAndPreventDrift(context: any): boolean {
    const activeSession = this.steeringManager.getActiveSessionContext();
    if (activeSession) {
      const integratedSession = this.getIntegratedSession(activeSession.sessionId);
      if (integratedSession) {
        const driftDetected = this.steeringManager.detectAndPreventDrift(context);
        if (driftDetected) {
          integratedSession.steeringMetrics.driftDetections++;
        }
        return driftDetected;
      }
    }
    return this.steeringManager.detectAndPreventDrift(context);
  }

  // Analytics and Reporting Methods
  getSessionStats() {
    const enhancedStats = this.enhancedSessionManager.getSessionStats();
    const steeringStats = this.steeringManager.getMetrics();
    
    return {
      ...enhancedStats,
      steering: steeringStats,
      integratedSessions: this.integratedSessions.size,
      protocolCoordination: this.protocolCoordination.size
    };
  }

  getSessionSummary(sessionId: string) {
    const enhancedSummary = this.enhancedSessionManager.getSessionSummary(sessionId);
    const integratedSession = this.getIntegratedSession(sessionId);
    const coordination = this.protocolCoordination.get(sessionId);
    
    if (!enhancedSummary || !integratedSession || !coordination) return null;

    return {
      ...enhancedSummary,
      steeringContext: integratedSession.steeringContext,
      steeringMetrics: integratedSession.steeringMetrics,
      protocolCoordination: coordination,
      ideRules: integratedSession.ideRules.length,
      contextEnhancements: integratedSession.contextEnhancements.length,
      driftPreventions: integratedSession.driftPreventions.length
    };
  }

  exportSessionData(sessionId: string) {
    const enhancedData = this.enhancedSessionManager.exportSessionData(sessionId);
    const integratedSession = this.getIntegratedSession(sessionId);
    const coordination = this.protocolCoordination.get(sessionId);
    
    if (!enhancedData || !integratedSession || !coordination) return null;

    return {
      ...enhancedData,
      integratedSession,
      protocolCoordination: coordination,
      steeringState: this.steeringManager.getState(),
      exportTimestamp: new Date().toISOString()
    };
  }

  // Health Check
  async healthCheck(): Promise<any> {
    const enhancedHealth = await this.enhancedSessionManager.getSessionStats();
    const steeringHealth = await this.steeringManager.healthCheck();
    
    return {
      enhancedSessionManager: enhancedHealth,
      steeringManager: steeringHealth,
      integratedSessions: this.integratedSessions.size,
      protocolCoordination: this.protocolCoordination.size,
      timestamp: new Date().toISOString()
    };
  }
}

export { IntegratedSessionManager }; 