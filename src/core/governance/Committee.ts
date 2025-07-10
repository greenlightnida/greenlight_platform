import { IntegratedSessionManager } from '../session-management/IntegratedSessionManager';

import { ProcessManager } from './ProcessManager';
import { SteeringManager } from './SteeringManager';

export class Committee {
  public readonly processManager: ProcessManager;
  public readonly integratedSessionManager: IntegratedSessionManager;
  public readonly steeringManager: SteeringManager;

  constructor() {
    this.processManager = ProcessManager.getInstance();
    this.integratedSessionManager = this.processManager.getCommitteeMembers().integratedSessionManager;
    this.steeringManager = this.processManager.getCommitteeMembers().steeringManager;
  }

  getCommitteeMembers() {
    return {
      processManager: this.processManager,
      integratedSessionManager: this.integratedSessionManager,
      steeringManager: this.steeringManager
    };
  }

  async healthCheck() {
    return {
      committee: 'Greenlight Platform Governance Committee',
      ...await this.processManager.healthCheck()
    };
  }

  getCommitteeReport() {
    return {
      process: this.processManager.getMetrics(),
      session: this.integratedSessionManager.getSessionStats(),
      steering: this.steeringManager.getMetrics(),
      timestamp: new Date().toISOString()
    };
  }
} 