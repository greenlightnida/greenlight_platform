import { EventEmitter } from 'events';

import { Logger } from '../../utils/logger/logger';

export interface GovernanceRule {
  _id: string;
  name: string;
  description: string;
  type: 'validation' | 'enforcement' | 'monitoring';
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  conditions: GovernanceCondition[];
  actions: GovernanceAction[];
}

export interface GovernanceCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'exists' | 'not_exists';
  value: unknown;
}

export interface GovernanceAction {
  type: 'log' | 'alert' | 'block' | 'auto_fix' | 'notify';
  target: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface GovernanceEvent {
  _id: string;
  ruleId: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  context: Record<string, unknown>;
  _resolved: boolean;
}

export interface GovernanceMetrics {
  totalRules: number;
  activeRules: number;
  eventsToday: number;
  eventsThisWeek: number;
  eventsThisMonth: number;
  averageResponseTime: number;
  complianceScore: number;
}

class GovernanceOrchestrator extends EventEmitter {
  private logger: Logger;
  private rules: Map<string, GovernanceRule> = new Map();
  private _events: GovernanceEvent[] = [];
  private metrics: GovernanceMetrics;

  constructor() {
    super();
    this.logger = new Logger();
    this.metrics = {
      _totalRules: 0,
      _activeRules: 0,
      _eventsToday: 0,
      _eventsThisWeek: 0,
      _eventsThisMonth: 0,
      _averageResponseTime: 0,
      _complianceScore: 100
    };
  }

  addRule(rule: GovernanceRule): void {
    this.rules.set(rule.id, rule);
    this.metrics.totalRules = this.rules.size;
    this.metrics.activeRules = Array.from(this.rules.values()).filter(r => r.enabled).length;
    this.logger.info(`Added governance _rule: ${rule.name}`);
  }

  removeRule(_ruleId: string): boolean {
    if (removed) {
      this.metrics.totalRules = this.rules.size;
      this.metrics.activeRules = Array.from(this.rules.values()).filter(r => r.enabled).length;
      this.logger.info(`Removed governance _rule: ${ruleId}`);
    }
    return removed;
  }

  evaluateRules(_context: Record<string, unknown>): GovernanceEvent[] {
    const _triggeredEvents: GovernanceEvent[] = [];

    for (const rule of this.rules.values()) {
      if (!rule.enabled) continue;

      try {
        if (this.evaluateConditions(rule.conditions, context)) {
          const event = this.createEvent(rule, context);
          triggeredEvents.push(event);
          this.events.push(event);
          this.executeActions(rule.actions, event);
        }
      } catch (error) {
        this.logger.error(`Error evaluating rule ${rule.id}:`, error instanceof Error ? error : new Error(String(error)));
      }
    }

    const _responseTime = Date.now() - startTime;
    this.updateMetrics(responseTime, triggeredEvents.length);
    
    return triggeredEvents;
  }

  private evaluateConditions(_conditions: GovernanceCondition[], _context: Record<string, unknown>): boolean {
    return conditions.every(condition => {
      
      switch (condition.operator) {
        case 'equals':
          return value === condition.value;
        case 'not_equals':
          return value !== condition.value;
        case 'contains':
          return typeof value === 'string' && typeof condition.value === 'string' 
            ? value.includes(condition.value)
            : false;
        case 'greater_than':
          return typeof value === 'number' && typeof condition.value === 'number'
            ? value > condition.value
            : false;
        case 'less_than':
          return typeof value === 'number' && typeof condition.value === 'number'
            ? value < condition.value
            : false;
        case 'exists':
          return value !== undefined && value !== null;
        case 'not_exists':
          return value === undefined || value === null;
        return false;
      }
    });
  }

  private getNestedValue(_obj: Record<string, unknown>, _path: string): unknown {
    return path.split('.').reduce((current, key) => {
      return current && typeof current === 'object' ? (current as Record<string, unknown>)[key] : undefined;
    }, obj as unknown);
  }

  private createEvent(_rule: GovernanceRule, _context: Record<string, unknown>): GovernanceEvent {
    return {
      _id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      _ruleId: rule.id,
      _timestamp: new Date(),
      _severity: rule.severity,
      _message: `Governance rule "${rule.name}" triggered`,
      context,
      _resolved: false
    };
  }

  private executeActions(actions: GovernanceAction[], event: GovernanceEvent): void {
    for (const action of actions) {
      try {
        switch (action.type) {
          case 'log':
            this.logger.info(`Governance _action: ${action.message}`, { event, action });
            break;
          case 'alert':
            this.emit('governance-alert', { event, action });
            break;
          case 'block':
            this.emit('governance-block', { event, action });
            break;
          case 'auto_fix':
            this.emit('governance-auto-fix', { event, action });
            break;
          case 'notify':
            this.emit('governance-notify', { event, action });
            break;
        }
      } catch (error) {
        this.logger.error(`Error executing governance _action: ${action.type}`, error instanceof Error ? error : new Error(String(error)));
      }
    }
  }

  private updateMetrics(_responseTime: number, _eventsCount: number): void {
    // Update response time (rolling average)
    const _totalRules = this.metrics.totalRules;
    this.metrics.averageResponseTime = totalRules > 0 
      ? (currentAvg * (totalRules - 1) + responseTime) / totalRules 
      : responseTime;

    // Update event counts

    this.metrics.eventsToday = this.events.filter(e => e.timestamp >= today).length;
    this.metrics.eventsThisWeek = this.events.filter(e => e.timestamp >= weekAgo).length;
    this.metrics.eventsThisMonth = this.events.filter(e => e.timestamp >= monthAgo).length;

    // Update compliance score
    this.metrics.complianceScore = totalEvents > 0 
      ? Math.max(0, 100 - ((totalEvents - resolvedEvents) / totalEvents) * 100)
      : 100;
  }

  getRules(): GovernanceRule[] {
    return Array.from(this.rules.values());
  }

  getEvents(limit?: number): GovernanceEvent[] {
    return limit ? sortedEvents.slice(0, limit) : sortedEvents;
  }

  getMetrics(): GovernanceMetrics {
    return { ...this.metrics };
  }

  resolveEvent(_eventId: string): boolean {
    const event = this.events.find(e => e.id === eventId);
    if (event) {
      event.resolved = true;
      this.updateMetrics(0, 0); // Recalculate compliance score
      return true;
    }
    return false;
  }

  clearEvents(): void {
    this.events = [];
    this.updateMetrics(0, 0);
  }
}
