import { EventEmitter } from 'events';

// Type definitions for IDE governance
export type IDERule = {
  id: string;
  description: string;
  ide: 'cursor' | 'vscode' | 'both';
  condition: (context: any) => boolean;
  action: (context: any) => void;
  priority: 'critical' | 'high' | 'medium' | 'low';
};

export type ContextEnhancement = {
  id: string;
  type: 'preservation' | 'enhancement' | 'recovery';
  description: string;
  apply: (context: any) => any;
};

export type DriftPrevention = {
  id: string;
  pattern: string;
  description: string;
  detect: (context: any) => boolean;
  correct: (context: any) => void;
};

export type SessionContext = {
  sessionId: string;
  ide: 'cursor' | 'vscode';
  timestamp: Date;
  context: any;
  metadata: {
    files: string[];
    focus: string;
    lastAction: string;
  };
};

export interface SteeringManagerState {
  isInitialized: boolean;
  ideRules: Map<string, IDERule>;
  contextEnhancements: Map<string, ContextEnhancement>;
  driftPreventions: Map<string, DriftPrevention>;
  sessionContexts: Map<string, SessionContext>;
  activeSession: string | null;
  lastSync: Date;
  metrics: {
    totalRules: number;
    activeEnhancements: number;
    driftDetections: number;
    contextPreservations: number;
    sessionContinuity: number;
  };
}

export class SteeringManager extends EventEmitter {
  private static instance: SteeringManager;
  private state: SteeringManagerState;
  private sessionManager: any; // Will be injected from SessionsManager

  private constructor() {
    super();
    this.state = this.initializeState();
  }

  public static getInstance(): SteeringManager {
    if (!SteeringManager.instance) {
      SteeringManager.instance = new SteeringManager();
    }
    return SteeringManager.instance;
  }

  private initializeState(): SteeringManagerState {
    return {
      isInitialized: false,
      ideRules: new Map(),
      contextEnhancements: new Map(),
      driftPreventions: new Map(),
      sessionContexts: new Map(),
      activeSession: null,
      lastSync: new Date(),
      metrics: {
        totalRules: 0,
        activeEnhancements: 0,
        driftDetections: 0,
        contextPreservations: 0,
        sessionContinuity: 0
      }
    };
  }

  // Session Manager Integration
  public setSessionManager(sessionManager: any): void {
    this.sessionManager = sessionManager;
    this.emit('sessionManagerConnected', sessionManager);
  }

  public getSessionManager(): any {
    return this.sessionManager;
  }

  // Session Context Management
  public preserveSessionContext(sessionId: string, context: any, ide: 'cursor' | 'vscode'): void {
    const sessionContext: SessionContext = {
      sessionId,
      ide,
      timestamp: new Date(),
      context,
      metadata: {
        files: this.extractFileContext(context),
        focus: this.extractFocusContext(context),
        lastAction: this.extractLastAction(context)
      }
    };

    this.state.sessionContexts.set(sessionId, sessionContext);
    this.state.activeSession = sessionId;
    this.state.metrics.contextPreservations++;
    
    this.emit('contextPreserved', sessionContext);
  }

  public restoreSessionContext(sessionId: string): SessionContext | null {
    const context = this.state.sessionContexts.get(sessionId);
    if (context) {
      this.state.activeSession = sessionId;
      this.state.metrics.sessionContinuity++;
      this.emit('contextRestored', context);
    }
    return context || null;
  }

  public getActiveSessionContext(): SessionContext | null {
    if (!this.state.activeSession) return null;
    return this.state.sessionContexts.get(this.state.activeSession) || null;
  }

  // IDE Rule Management
  public addIDERule(rule: IDERule): void {
    this.state.ideRules.set(rule.id, rule);
    this.state.metrics.totalRules++;
    this.emit('ruleAdded', rule);
  }

  public removeIDERule(ruleId: string): boolean {
    const removed = this.state.ideRules.delete(ruleId);
    if (removed) {
      this.state.metrics.totalRules--;
      this.emit('ruleRemoved', ruleId);
    }
    return removed;
  }

  public getIDERules(ide?: 'cursor' | 'vscode' | 'both'): IDERule[] {
    const rules = Array.from(this.state.ideRules.values());
    if (ide && ide !== 'both') {
      return rules.filter(rule => rule.ide === ide || rule.ide === 'both');
    }
    return rules;
  }

  public applyIDERules(context: any, ide: 'cursor' | 'vscode'): void {
    const applicableRules = this.getIDERules(ide);
    applicableRules
      .sort((a, b) => this.getPriorityWeight(b.priority) - this.getPriorityWeight(a.priority))
      .forEach(rule => {
        if (rule.condition(context)) {
          rule.action(context);
          this.emit('ruleApplied', { rule, context });
        }
      });
  }

  // Context Enhancement Management
  public addContextEnhancement(enhancement: ContextEnhancement): void {
    this.state.contextEnhancements.set(enhancement.id, enhancement);
    this.state.metrics.activeEnhancements++;
    this.emit('enhancementAdded', enhancement);
  }

  public removeContextEnhancement(enhancementId: string): boolean {
    const removed = this.state.contextEnhancements.delete(enhancementId);
    if (removed) {
      this.state.metrics.activeEnhancements--;
      this.emit('enhancementRemoved', enhancementId);
    }
    return removed;
  }

  public enhanceContext(context: any): any {
    let enhancedContext = context;
    this.state.contextEnhancements.forEach(enhancement => {
      enhancedContext = enhancement.apply(enhancedContext);
    });
    this.emit('contextEnhanced', enhancedContext);
    return enhancedContext;
  }

  // Drift Prevention Management
  public addDriftPrevention(prevention: DriftPrevention): void {
    this.state.driftPreventions.set(prevention.id, prevention);
    this.emit('preventionAdded', prevention);
  }

  public removeDriftPrevention(preventionId: string): boolean {
    const removed = this.state.driftPreventions.delete(preventionId);
    if (removed) {
      this.emit('preventionRemoved', preventionId);
    }
    return removed;
  }

  public detectAndPreventDrift(context: any): boolean {
    let driftDetected = false;
    this.state.driftPreventions.forEach(prevention => {
      if (prevention.detect(context)) {
        prevention.correct(context);
        driftDetected = true;
        this.state.metrics.driftDetections++;
        this.emit('driftPrevented', { prevention, context });
      }
    });
    return driftDetected;
  }

  // Utility Methods
  private getPriorityWeight(priority: string): number {
    switch (priority) {
      case 'critical': return 4;
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 0;
    }
  }

  private extractFileContext(context: any): string[] {
    // Extract file paths from context
    return context?.files || context?.openFiles || [];
  }

  private extractFocusContext(context: any): string {
    // Extract current focus from context
    return context?.focus || context?.currentFile || '';
  }

  private extractLastAction(context: any): string {
    // Extract last action from context
    return context?.lastAction || context?.action || '';
  }

  // Public API Methods
  public getState(): SteeringManagerState {
    return { ...this.state };
  }

  public getMetrics(): any {
    return { ...this.state.metrics };
  }

  public async healthCheck(): Promise<any> {
    return {
      status: 'healthy',
      metrics: this.getMetrics(),
      activeSession: this.state.activeSession,
      totalRules: this.state.ideRules.size,
      totalEnhancements: this.state.contextEnhancements.size,
      totalPreventions: this.state.driftPreventions.size,
      lastSync: this.state.lastSync
    };
  }

  public reset(): void {
    this.state = this.initializeState();
    this.emit('reset');
  }
}

export default SteeringManager; 