import { EventEmitter } from 'events';

import { SecurityHolonManager, SecurityPolicy as HolonSecurityPolicy } from './SecurityHolonManager';

export interface ComplianceRequirement {
  id: string;
  name: string;
  description: string;
  standard: string;
  requirements: string[];
  status: 'compliant' | 'non-compliant' | 'pending';
}

export interface SecurityIncident {
  id: string;
  type: 'policy_violation' | 'data_breach' | 'network_attack' | 'compliance_failure';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  description: string;
  status: 'open' | 'investigating' | 'resolved';
  details: Record<string, unknown>;
}

export interface SecurityComplianceState {
  complianceRequirements: Map<string, ComplianceRequirement>;
  incidents: SecurityIncident[];
  auditLog: Array<{
    timestamp: Date;
    action: string;
    user: string;
    details: Record<string, unknown>;
  }>;
  lastIncident?: SecurityIncident;
}

export class SecurityComplianceManager extends EventEmitter {
  private state: SecurityComplianceState;
  private securityHolonManager: SecurityHolonManager;

  constructor() {
    super();
    this.state = {
      complianceRequirements: new Map(),
      incidents: [],
      auditLog: []
    };
    this.securityHolonManager = SecurityHolonManager.getInstance();
  }

  public addComplianceRequirement(requirement: ComplianceRequirement): void {
    this.state.complianceRequirements.set(requirement.id, requirement);
    this.emit('complianceRequirementAdded', requirement);
  }

  public updateComplianceStatus(requirementId: string, status: 'compliant' | 'non-compliant' | 'pending'): void {
    const requirement = this.state.complianceRequirements.get(requirementId);
    if (requirement) {
      requirement.status = status;
      this.emit('complianceStatusUpdated', { requirementId, status });
    }
  }

  public createIncident(type: SecurityIncident['type'], severity: SecurityIncident['severity'], description: string, details: Record<string, unknown>): void {
    const incident: SecurityIncident = {
      id: Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9),
      type,
      severity,
      timestamp: new Date(),
      description,
      status: 'open',
      details
    };
    this.state.incidents.push(incident);
    this.state.lastIncident = incident;
    this.emit('incidentCreated', incident);
  }

  public updateIncidentStatus(incidentId: string, status: 'open' | 'investigating' | 'resolved'): void {
    const incident = this.state.incidents.find(i => i.id === incidentId);
    if (incident) {
      incident.status = status;
      this.emit('incidentStatusUpdated', { incidentId, status });
    }
  }

  public logAudit(action: string, user: string, details: Record<string, unknown>): void {
    const auditEntry = {
      timestamp: new Date(),
      action,
      user,
      details
    };
    this.state.auditLog.push(auditEntry);
    this.emit('auditLogged', auditEntry);
  }

  public enforcePolicy(context: any): boolean {
    const holonPolicies = this.securityHolonManager.getPolicies();
    let allowed = true;

    for (const policy of holonPolicies) {
      if (policy.enabled) {
        for (const rule of policy.rules) {
          // Convert holon policy rules to compliance checks
          if (this.evaluateRule(rule, context)) {
            if (rule.action === 'block') {
              allowed = false;
              this.createIncident('policy_violation', 'medium', `Policy ${policy.name} rule ${rule.name} denied access`, context);
            } else if (rule.action === 'alert') {
              this.createIncident('policy_violation', 'low', `Policy ${policy.name} rule ${rule.name} triggered alert`, context);
            }
            this.logAudit('policy_enforcement', 'system', { policy: policy.name, rule: rule.name, action: rule.action });
          }
        }
      }
    }

    return allowed;
  }

  private evaluateRule(rule: any, context: any): boolean {
    // Basic rule evaluation - can be enhanced based on rule types
    switch (rule.type) {
      case 'pattern':
        return rule.pattern && context.toString().match(new RegExp(rule.pattern));
      case 'threshold':
        return rule.threshold && context >= rule.threshold;
      case 'blacklist':
        return rule.blacklist?.includes(context);
      case 'whitelist':
        return rule.whitelist?.includes(context);
      default:
        return false;
    }
  }

  public getComplianceRequirements(): ComplianceRequirement[] {
    return Array.from(this.state.complianceRequirements.values());
  }

  public getIncidents(): SecurityIncident[] {
    return this.state.incidents;
  }

  public getAuditLog(): Array<{ timestamp: Date; action: string; user: string; details: Record<string, unknown> }> {
    return this.state.auditLog;
  }

  public getState(): SecurityComplianceState {
    return this.state;
  }

  public getSecurityHolonManager(): SecurityHolonManager {
    return this.securityHolonManager;
  }

  public async healthCheck(): Promise<any> {
    const holonHealth = this.securityHolonManager.getMetrics();
    return {
      totalComplianceRequirements: this.state.complianceRequirements.size,
      totalIncidents: this.state.incidents.length,
      totalAuditEntries: this.state.auditLog.length,
      lastIncident: this.state.lastIncident,
      securityHolonMetrics: holonHealth,
      timestamp: new Date().toISOString()
    };
  }
} 