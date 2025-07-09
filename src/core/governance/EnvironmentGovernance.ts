#!/usr/bin/env tsx

/**
 * Environment Governance - Policy Enforcement System
 * 
 * PURPOSE: Enforce environment variable policies and compliance
 * - Policy-based environment variable governance
 * - Compliance monitoring and reporting
 * - Automated violation detection and resolution
 * - Integration with EnvironmentVariableManager
 * 
 * Based on TypeScript Excellence Guide and Governance Patterns
 */

import { EventEmitter } from 'events';
import { EnvironmentVariableManager, VariableError, VariableRecommendation } from './EnvironmentVariableManager';

// ============================================================================
// INTERFACES - Policy and Governance Types
// ============================================================================

export interface EnvironmentPolicy {
  _id: string;
  _name: string;
  _description: string;
  _category: 'security' | 'performance' | 'compliance' | 'maintenance';
  _severity: 'low' | 'medium' | 'high' | 'critical';
  _rules: EnvironmentPolicyRule[];
  _enabled: boolean;
  _autoEnforce: boolean;
  _createdAt: Date;
  _updatedAt: Date;
}

export interface EnvironmentPolicyRule {
  _id: string;
  _name: string;
  _condition: string;
  _action: 'alert' | 'block' | 'fix' | 'notify';
  _parameters: Record<string, any>;
}

export interface EnvironmentAlert {
  _id: string;
  _policyId: string;
  _policyName: string;
  _severity: 'low' | 'medium' | 'high' | 'critical';
  _message: string;
  _variables: string[];
  _timestamp: Date;
  _acknowledged: boolean;
  _resolved: boolean;
  _resolution?: string;
}

export interface EnvironmentComplianceReport {
  _id: string;
  _timestamp: Date;
  _policies: EnvironmentPolicy[];
  _compliance: {
    _compliant: number;
    _nonCompliant: number;
    _warnings: number;
    _total: number;
  };
  _violations: EnvironmentAlert[];
  _recommendations: VariableRecommendation[];
  _summary: string;
}

export interface EnvironmentGovernanceState {
  _policies: Map<string, EnvironmentPolicy>;
  _alerts: EnvironmentAlert[];
  _complianceReports: EnvironmentComplianceReport[];
  _monitoring: {
    _enabled: boolean;
    _scanInterval: number;
    _alertThreshold: number;
    _autoEnforcement: boolean;
  };
  _statistics: {
    _totalPolicies: number;
    _activePolicies: number;
    _totalAlerts: number;
    _activeAlerts: number;
    _complianceRate: number;
    _lastReport: Date;
  };
}

// ============================================================================
// MAIN GOVERNANCE CLASS - TypeScript Excellence Implementation
// ============================================================================

export class EnvironmentGovernance extends EventEmitter {
  private static _instance: EnvironmentGovernance;
  private _state: EnvironmentGovernanceState;
  private _envVarManager: EnvironmentVariableManager;
  private _monitoringInterval: NodeJS.Timeout | null = null;

  private constructor() {
    super();
    this._envVarManager = EnvironmentVariableManager.getInstance();
    this._state = this._initializeState();
    this._setupEventListeners();
    this._loadDefaultPolicies();
  }

  public static getInstance(): EnvironmentGovernance {
    if (!EnvironmentGovernance._instance) {
      EnvironmentGovernance._instance = new EnvironmentGovernance();
    }
    return EnvironmentGovernance._instance;
  }

  private _initializeState(): EnvironmentGovernanceState {
    return {
      _policies: new Map(),
      _alerts: [],
      _complianceReports: [],
      _monitoring: {
        _enabled: true,
        _scanInterval: 600000, // 10 minutes
        _alertThreshold: 3,
        _autoEnforcement: false
      },
      _statistics: {
        _totalPolicies: 0,
        _activePolicies: 0,
        _totalAlerts: 0,
        _activeAlerts: 0,
        _complianceRate: 100,
        _lastReport: new Date()
      }
    };
  }

  private _setupEventListeners(): void {
    // Listen to environment variable manager events
    this._envVarManager.on('_scan: completed', () => {
      this._evaluatePolicies();
    });

    this._envVarManager.on('_errors: critical', (_errors: VariableError[]) => {
      this._handleCriticalErrors(_errors);
    });

    this._envVarManager.on('_errors: threshold_exceeded', (_count: number) => {
      this._handleErrorThresholdExceeded(_count);
    });

    this._envVarManager.on('_variable: updated', ({ name, value, variable }) => {
      this._evaluateVariablePolicies(name, value, variable);
    });
  }

  private _loadDefaultPolicies(): void {
    const _defaultPolicies: EnvironmentPolicy[] = [
      {
        _id: 'security-secrets-policy',
        _name: 'Security Secrets Policy',
        _description: 'Enforce secure practices for secret environment variables',
        _category: 'security',
        _severity: 'critical',
        _rules: [
          {
            _id: 'weak-secret-length',
            _name: 'Weak Secret Length',
            _condition: 'secret_length < 32',
            _action: 'alert',
            _parameters: { minLength: 32 }
          },
          {
            _id: 'secret-in-plaintext',
            _name: 'Secret in Plaintext',
            _condition: 'secret_in_logs',
            _action: 'block',
            _parameters: {}
          }
        ],
        _enabled: true,
        _autoEnforce: true,
        _createdAt: new Date(),
        _updatedAt: new Date()
      },
      {
        _id: 'performance-database-policy',
        _name: 'Database Performance Policy',
        _description: 'Ensure optimal database configuration',
        _category: 'performance',
        _severity: 'medium',
        _rules: [
          {
            _id: 'db-connection-pool',
            _name: 'Database Connection Pool',
            _condition: 'missing_db_pool_config',
            _action: 'alert',
            _parameters: { recommendedPoolSize: 10 }
          },
          {
            _id: 'db-timeout-config',
            _name: 'Database Timeout Configuration',
            _condition: 'missing_db_timeout',
            _action: 'alert',
            _parameters: { recommendedTimeout: 30000 }
          }
        ],
        _enabled: true,
        _autoEnforce: false,
        _createdAt: new Date(),
        _updatedAt: new Date()
      },
      {
        _id: 'compliance-required-vars-policy',
        _name: 'Required Variables Compliance',
        _description: 'Ensure all required environment variables are set',
        _category: 'compliance',
        _severity: 'high',
        _rules: [
          {
            _id: 'missing-required-vars',
            _name: 'Missing Required Variables',
            _condition: 'required_var_missing',
            _action: 'alert',
            _parameters: {}
          }
        ],
        _enabled: true,
        _autoEnforce: true,
        _createdAt: new Date(),
        _updatedAt: new Date()
      }
    ];

    _defaultPolicies.forEach(policy => {
      this._state._policies.set(policy._id, policy);
    });

    this._updateStatistics();
  }

  // ============================================================================
  // MONITORING AND ENFORCEMENT
  // ============================================================================

  public async startMonitoring(): Promise<void> {
    if (this._state._monitoring._enabled && !this._monitoringInterval) {
      this._monitoringInterval = setInterval(() => {
        this._performGovernanceCheck();
      }, this._state._monitoring._scanInterval);

      console.log('🔍 Environment Governance monitoring started');
      this.emit('_monitoring: started', { timestamp: new Date() });
    }
  }

  public async stopMonitoring(): Promise<void> {
    if (this._monitoringInterval) {
      clearInterval(this._monitoringInterval);
      this._monitoringInterval = null;
      console.log('⏹️ Environment Governance monitoring stopped');
      this.emit('_monitoring: stopped', { timestamp: new Date() });
    }
  }

  private async _performGovernanceCheck(): Promise<void> {
    try {
      await this._evaluatePolicies();
      await this._generateComplianceReport();
      this._checkAlertThresholds();
      this._updateStatistics();
    } catch (error) {
      console.error('❌ Governance check failed:', error);
      this.emit('_governance: check_failed', { error, timestamp: new Date() });
    }
  }

  private async _evaluatePolicies(): Promise<void> {
    const _activePolicies = Array.from(this._state._policies.values())
      .filter(policy => policy._enabled);

    for (const policy of _activePolicies) {
      await this._evaluatePolicy(policy);
    }
  }

  private async _evaluatePolicy(_policy: EnvironmentPolicy): Promise<void> {
    for (const rule of _policy._rules) {
      const _violations = await this._evaluateRule(rule, _policy);
      for (const violation of _violations) {
        await this._handlePolicyViolation(_policy, rule, violation);
      }
    }
  }

  private async _evaluateRule(_rule: EnvironmentPolicyRule, _policy: EnvironmentPolicy): Promise<any[]> {
    const _violations: any[] = [];

    try {
      switch (_rule._condition) {
        case 'secret_length < 32':
          // Check for weak secrets
          const _secrets = this._envVarManager.getAllVariables()
            .filter(v => v.name.toLowerCase().includes('secret') || 
                        v.name.toLowerCase().includes('password') || 
                        v.name.toLowerCase().includes('key'));
          
          for (const secret of _secrets) {
            if (secret.value && secret.value.length < 32) {
              _violations.push({
                variable: secret.name,
                currentLength: secret.value.length,
                requiredLength: 32
              });
            }
          }
          break;

        case 'required_var_missing':
          // Check for missing required variables
          const _requiredVars = this._envVarManager.getAllVariables()
            .filter(v => v.required && !v.value);
          
          for (const variable of _requiredVars) {
            _violations.push({
              variable: variable.name,
              type: 'missing'
            });
          }
          break;

        case 'missing_db_pool_config':
          // Check for missing database pool configuration
          const _dbVars = this._envVarManager.getAllVariables()
            .filter(v => v.name.toLowerCase().includes('database') || 
                        v.name.toLowerCase().includes('db'));
          
          const _hasPoolConfig = _dbVars.some(v => 
            v.name.toLowerCase().includes('pool') || 
            v.name.toLowerCase().includes('connection')
          );
          
          if (!_hasPoolConfig) {
            _violations.push({
              type: 'missing_pool_config',
              recommendation: 'Add database connection pool configuration'
            });
          }
          break;

        default:
          // Handle custom conditions
          console.warn(`Unknown rule condition: ${_rule._condition}`);
      }
    } catch (error) {
      console.error(`Error evaluating rule ${_rule._name}:`, error);
    }

    return _violations;
  }

  private async _handlePolicyViolation(_policy: EnvironmentPolicy, _rule: EnvironmentPolicyRule, _violation: any): Promise<void> {
    const _alert: EnvironmentAlert = {
      _id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      _policyId: _policy._id,
      _policyName: _policy._name,
      _severity: _policy._severity,
      _message: this._generateViolationMessage(_policy, _rule, _violation),
      _variables: [_violation.variable || 'unknown'],
      _timestamp: new Date(),
      _acknowledged: false,
      _resolved: false
    };

    this._state._alerts.push(_alert);
    this.emit('_alert: created', _alert);

    // Auto-fix if enabled
    if (_policy._autoEnforce && _rule._action === 'fix') {
      await this._autoFixViolation(_policy, _rule, _violation);
    }

    // Log critical violations
    if (_policy._severity === 'critical') {
      console.error(`🚨 CRITICAL POLICY VIOLATION [${_policy._name}]: ${_alert._message}`);
    }
  }

  private _generateViolationMessage(_policy: EnvironmentPolicy, _rule: EnvironmentPolicyRule, _violation: any): string {
    switch (_rule._condition) {
      case 'secret_length < 32':
        return `Weak secret length for ${_violation.variable}: ${_violation.currentLength} chars (minimum 32 required)`;
      case 'required_var_missing':
        return `Required environment variable missing: ${_violation.variable}`;
      case 'missing_db_pool_config':
        return `Database connection pool configuration missing`;
      default:
        return `Policy violation: ${_policy._name} - ${_rule._name}`;
    }
  }

  private async _autoFixViolation(_policy: EnvironmentPolicy, _rule: EnvironmentPolicyRule, _violation: any): Promise<void> {
    try {
      switch (_rule._condition) {
        case 'required_var_missing':
          const _variable = this._envVarManager.getVariable(_violation.variable);
          if (_variable && _variable.defaultValue) {
            await this._envVarManager.setVariable(_violation.variable, _variable.defaultValue);
            console.log(`🔧 Auto-fixed missing required variable: ${_violation.variable}`);
          }
          break;
        
        // Add more auto-fix logic as needed
      }
    } catch (error) {
      console.error(`Failed to auto-fix violation: ${error}`);
    }
  }

  private async _evaluateVariablePolicies(_name: string, _value: string, _variable: any): Promise<void> {
    // Evaluate policies for specific variable changes
    const _activePolicies = Array.from(this._state._policies.values())
      .filter(policy => policy._enabled);

    for (const policy of _activePolicies) {
      for (const rule of policy._rules) {
        if (rule._condition.includes('secret') && 
            ((_name ?? '').includes('SECRET') || (_name ?? '').includes('PASSWORD') || (_name ?? '').includes('KEY'))) {
          const _violations = await this._evaluateRule(rule, policy);
          for (const violation of _violations) {
            await this._handlePolicyViolation(policy, rule, violation);
          }
        }
      }
    }
  }

  private _handleCriticalErrors(_errors: VariableError[]): void {
    _errors.forEach(error => {
      const _alert: EnvironmentAlert = {
        _id: `critical-error-${error.id}`,
        _policyId: 'system-critical',
        _policyName: 'System Critical Errors',
        _severity: 'critical',
        _message: `Critical environment variable error: ${error.message}`,
        _variables: [error.variableName],
        _timestamp: new Date(),
        _acknowledged: false,
        _resolved: false
      };

      this._state._alerts.push(_alert);
      this.emit('_alert: critical', _alert);
    });

    this._updateStatistics();
  }

  private _handleErrorThresholdExceeded(_count: number): void {
    const _alert: EnvironmentAlert = {
      _id: `threshold-exceeded-${Date.now()}`,
      _policyId: 'error-threshold',
      _policyName: 'Error Threshold Exceeded',
      _severity: 'high',
      _message: `Environment variable error count (${_count}) exceeds threshold`,
      _variables: [],
      _timestamp: new Date(),
      _acknowledged: false,
      _resolved: false
    };

    this._state._alerts.push(_alert);
    this.emit('_alert: threshold_exceeded', _alert);
    this._updateStatistics();
  }

  private _checkAlertThresholds(): void {
    const _activeAlerts = this._state._alerts.filter(alert => !alert._resolved);
    
    if (_activeAlerts.length > this._state._monitoring._alertThreshold) {
      this.emit('_alerts: threshold_exceeded', {
        _count: _activeAlerts.length,
        _threshold: this._state._monitoring._alertThreshold,
        _alerts: _activeAlerts
      });
    }
  }

  private async _generateComplianceReport(): Promise<void> {
    const _activePolicies = Array.from(this._state._policies.values())
      .filter(policy => policy._enabled);

    const _totalPolicies = _activePolicies.length;
    const _violations = this._state._alerts.filter(alert => !alert._resolved);
    const _recommendations = [...this._envVarManager.getRecommendations()];

    const _compliance: EnvironmentComplianceReport['_compliance'] = {
      _compliant: _totalPolicies - _violations.length,
      _nonCompliant: _violations.filter(v => v._severity === 'high' || v._severity === 'critical').length,
      _warnings: _violations.filter(v => v._severity === 'low' || v._severity === 'medium').length,
      _total: _totalPolicies
    };

    const _complianceRate = _totalPolicies > 0 ? (_compliance._compliant / _totalPolicies) * 100 : 100;

    const _report: EnvironmentComplianceReport = {
      _id: `compliance-${Date.now()}`,
      _timestamp: new Date(),
      _policies: _activePolicies,
      _compliance,
      _violations,
      _recommendations,
      _summary: this._generateComplianceSummary(_compliance, _complianceRate)
    };

    this._state._complianceReports.push(_report);
    this._state._statistics._complianceRate = _complianceRate;
    this._state._statistics._lastReport = new Date();

    this.emit('_compliance: report_generated', _report);
  }

  private _generateComplianceSummary(_compliance: any, _rate: number): string {
    if (_rate === 100) {
      return 'All environment policies are compliant';
    } else if (_rate >= 90) {
      return `High compliance rate (${_rate.toFixed(1)}%) with minor issues`;
    } else if (_rate >= 75) {
      return `Moderate compliance rate (${_rate.toFixed(1)}%) with some violations`;
    } else {
      return `Low compliance rate (${_rate.toFixed(1)}%) with significant violations`;
    }
  }

  private _updateStatistics(): void {
    const _activePolicies = Array.from(this._state._policies.values())
      .filter(policy => policy._enabled);
    
    const _activeAlerts = this._state._alerts.filter(alert => !alert._resolved);

    this._state._statistics._totalPolicies = this._state._policies.size;
    this._state._statistics._activePolicies = _activePolicies.length;
    this._state._statistics._totalAlerts = this._state._alerts.length;
    this._state._statistics._activeAlerts = _activeAlerts.length;
  }

  // ============================================================================
  // PUBLIC API METHODS
  // ============================================================================

  public async createPolicy(_policy: Omit<EnvironmentPolicy, '_id' | '_createdAt' | '_updatedAt'>): Promise<EnvironmentPolicy> {
    const _newPolicy: EnvironmentPolicy = {
      ..._policy,
      _id: `policy-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      _createdAt: new Date(),
      _updatedAt: new Date()
    };

    this._state._policies.set(_newPolicy._id, _newPolicy);
    this._updateStatistics();
    this.emit('_policy: created', _newPolicy);

    return _newPolicy;
  }

  public async updatePolicy(_policyId: string, _updates: Partial<EnvironmentPolicy>): Promise<EnvironmentPolicy> {
    const _policy = this._state._policies.get(_policyId);
    if (!_policy) {
      throw new Error(`Policy not found: ${_policyId}`);
    }

    const _updatedPolicy: EnvironmentPolicy = {
      ..._policy,
      ..._updates,
      _updatedAt: new Date()
    };

    this._state._policies.set(_policyId, _updatedPolicy);
    this._updateStatistics();
    this.emit('_policy: updated', _updatedPolicy);

    return _updatedPolicy;
  }

  public async deletePolicy(_policyId: string): Promise<void> {
    const _policy = this._state._policies.get(_policyId);
    if (_policy) {
      this._state._policies.delete(_policyId);
      this._updateStatistics();
      this.emit('_policy: deleted', _policy);
    }
  }

  public getPolicies(): EnvironmentPolicy[] {
    return Array.from(this._state._policies.values());
  }

  public getPolicy(_policyId: string): EnvironmentPolicy | undefined {
    return this._state._policies.get(_policyId);
  }

  public getAlerts(): EnvironmentAlert[] {
    return Array.from(this._state._alerts);
  }

  public async acknowledgeAlert(_alertId: string): Promise<void> {
    const _alert = this._state._alerts.find(a => a._id === _alertId);
    if (_alert) {
      _alert._acknowledged = true;
      this.emit('_alert: acknowledged', _alert);
    }
  }

  public async resolveAlert(_alertId: string, resolution?: string): Promise<void> {
    const _alert = this._state._alerts.find(a => a._id === _alertId);
    if (_alert) {
      _alert._resolved = true;
      if (resolution) {
        _alert._resolution = resolution;
      }
      this.emit('_alert: resolved', _alert);
    }
  }

  public getComplianceReports(_limit: number = 10): EnvironmentComplianceReport[] {
    return this._state._complianceReports.slice(-_limit);
  }

  public getStatistics(): EnvironmentGovernanceState['_statistics'] {
    return { ...this._state._statistics };
  }

  public getState(): EnvironmentGovernanceState {
    return {
      _policies: new Map(this._state._policies),
      _alerts: [...this._state._alerts],
      _complianceReports: [...this._state._complianceReports],
      _monitoring: { ...this._state._monitoring },
      _statistics: { ...this._state._statistics }
    };
  }

  public async exportGovernanceState(): Promise<string> {
    const state = {
      policies: Array.from(this._state._policies.entries()),
      alerts: this._state._alerts,
      complianceReports: this._state._complianceReports,
      monitoring: this._state._monitoring,
      statistics: this._state._statistics
    };

    return JSON.stringify(state, null, 2);
  }

  public async importGovernanceState(_stateJson: string): Promise<void> {
    try {
      const state = JSON.parse(_stateJson);

      if (state.policies) {
        this._state._policies.clear();
        state.policies.forEach(([id, policy]: [string, EnvironmentPolicy]) => {
          this._state._policies.set(id, policy);
        });
      }

      if (state.alerts) {
        this._state._alerts = state.alerts;
      }

      if (state.complianceReports) {
        this._state._complianceReports = state.complianceReports;
      }

      if (state.monitoring) {
        this._state._monitoring = state.monitoring;
      }

      if (state.statistics) {
        this._state._statistics = state.statistics;
      }

      this._updateStatistics();
      this.emit('_state: imported', { timestamp: new Date() });
    } catch (error) {
      throw new Error(`Failed to import governance state: ${error}`);
    }
  }
}

// Export singleton instance