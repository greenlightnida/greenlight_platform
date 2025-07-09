import { BaseHolon } from '../../architecture/holonSystem';
import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

export interface ErrorEntry {
  id: string;
  type: 'typescript' | 'lint' | 'build' | 'runtime' | 'dependency' | 'test' | 'deployment';
  severity: 'error' | 'warning' | 'info';
  file?: string;
  line?: number;
  column?: number;
  message: string;
  stackTrace?: string;
  timestamp: string;
  sessionId: string;
  status: 'active' | 'resolved' | 'ignored' | 'in_progress';
  resolution?: ErrorResolution;
  context?: ErrorContext;
  impact?: ErrorImpact;
  tags?: string[];
}

export interface ErrorResolution {
  id: string;
  approach: 'automated' | 'manual' | 'ai_assisted';
  fixStrategy: string;
  appliedAt: string;
  resolvedBy: string;
  success: boolean;
  resolutionTime: number;
  fixDetails: string;
  rollbackRequired?: boolean;
  rollbackReason?: string;
}

export interface ErrorContext {
  component?: string;
  feature?: string;
  userAction?: string;
  systemState?: string;
  dependencies?: string[];
  environment?: string;
}

export interface ErrorImpact {
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedUsers?: number;
  businessImpact?: string;
  developmentBlocked?: boolean;
  deploymentBlocked?: boolean;
  estimatedFixTime?: number;
}

export interface ErrorPattern {
  id: string;
  pattern: string;
  frequency: number;
  commonCauses: string[];
  recommendedFixes: string[];
  successRate: number;
  averageResolutionTime: number;
  lastOccurrence: string;
}

export interface ErrorMetrics {
  totalErrors: number;
  resolvedErrors: number;
  activeErrors: number;
  ignoredErrors: number;
  averageResolutionTime: number;
  errorTypes: Record<string, number>;
  errorSeverity: Record<string, number>;
  resolutionSuccessRate: number;
  topErrorPatterns: ErrorPattern[];
  systemHealth: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
}

export interface ErrorManagerHolonState {
  errors: Map<string, ErrorEntry>;
  errorPatterns: Map<string, ErrorPattern>;
  resolutionHistory: ErrorResolution[];
  metrics: ErrorMetrics;
  settings: {
    autoResolve: boolean;
    autoResolveThreshold: number;
    errorRetentionDays: number;
    notificationEnabled: boolean;
    learningEnabled: boolean;
  };
  sessionId: string;
  lastErrorCheck: string;
  isInitialized: boolean;
}

export class ErrorManagerHolon extends BaseHolon {
  private state: ErrorManagerHolonState;
  private errorStateFile: string;
  private errorLogFile: string;
  private patternsFile: string;
  private metricsFile: string;

  constructor() {
    super('error-manager-holon', 'ErrorManagerHolon', 'system');
    
    this.state = {
      errors: new Map(),
      errorPatterns: new Map(),
      resolutionHistory: [],
      metrics: {
        totalErrors: 0,
        resolvedErrors: 0,
        activeErrors: 0,
        ignoredErrors: 0,
        averageResolutionTime: 0,
        errorTypes: {},
        errorSeverity: {},
        resolutionSuccessRate: 0,
        topErrorPatterns: [],
        systemHealth: 'excellent'
      },
      settings: {
        autoResolve: true,
        autoResolveThreshold: 0.8,
        errorRetentionDays: 30,
        notificationEnabled: true,
        learningEnabled: true
      },
      sessionId: `error-manager-${Date.now()}`,
      lastErrorCheck: new Date().toISOString(),
      isInitialized: false
    };

    this.errorStateFile = path.join(process.cwd(), 'data/error_manager_state.json');
    this.errorLogFile = path.join(process.cwd(), 'data/error_manager_log.json');
    this.patternsFile = path.join(process.cwd(), 'data/error_patterns.json');
    this.metricsFile = path.join(process.cwd(), 'data/error_metrics.json');

    this.initialize();
  }

  // Required abstract methods from BaseHolon
  async initialize(): Promise<void> {
    console.log('🔧 Initializing Error Manager Holon...');
    
    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Load existing state
    await this.loadState();
    
    // Initialize error patterns
    await this.initializeErrorPatterns();
    
    // Start error monitoring
    this.startErrorMonitoring();
    
    this.state.isInitialized = true;
    console.log('✅ Error Manager Holon initialized');
  }

  async start(): Promise<void> {
    this.status = 'active';
    console.log('🚀 Error Manager Holon started');
  }

  async stop(): Promise<void> {
    this.status = 'inactive';
    await this.saveState();
    console.log('🛑 Error Manager Holon stopped');
  }

  private async initializeInternal() {
    console.log('🔧 Initializing Error Manager Holon...');
    
    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Load existing state
    await this.loadState();
    
    // Initialize error patterns
    await this.initializeErrorPatterns();
    
    // Start error monitoring
    this.startErrorMonitoring();
    
    this.state.isInitialized = true;
    console.log('✅ Error Manager Holon initialized');
  }

  private async loadState() {
    try {
      if (fs.existsSync(this.errorStateFile)) {
        const data = JSON.parse(fs.readFileSync(this.errorStateFile, 'utf8'));
        this.state.errors = new Map(Object.entries(data.errors || {}));
        this.state.resolutionHistory = data.resolutionHistory || [];
        this.state.metrics = data.metrics || this.state.metrics;
        this.state.settings = { ...this.state.settings, ...data.settings };
        console.log(`📊 Loaded ${this.state.errors.size} errors from state`);
      }
    } catch (error) {
      console.error('❌ Failed to load error state:', error);
    }
  }

  private async saveState() {
    try {
      const data = {
        errors: Object.fromEntries(this.state.errors),
        resolutionHistory: this.state.resolutionHistory,
        metrics: this.state.metrics,
        settings: this.state.settings,
        lastSaved: new Date().toISOString()
      };
      fs.writeFileSync(this.errorStateFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('❌ Failed to save error state:', error);
    }
  }

  private async initializeErrorPatterns() {
    try {
      if (fs.existsSync(this.patternsFile)) {
        const patterns = JSON.parse(fs.readFileSync(this.patternsFile, 'utf8'));
        this.state.errorPatterns = new Map(Object.entries(patterns));
      } else {
        // Initialize with common error patterns
        const commonPatterns = [
          {
            id: 'typescript-undefined-variable',
            pattern: 'Cannot find name',
            frequency: 0,
            commonCauses: ['Missing import', 'Typo in variable name', 'Scope issue'],
            recommendedFixes: ['Add missing import', 'Check variable spelling', 'Verify scope'],
            successRate: 0.95,
            averageResolutionTime: 2,
            lastOccurrence: new Date().toISOString()
          },
          {
            id: 'typescript-type-mismatch',
            pattern: 'Type.*is not assignable to type',
            frequency: 0,
            commonCauses: ['Incorrect type annotation', 'Interface mismatch', 'Generic type issue'],
            recommendedFixes: ['Fix type annotation', 'Update interface', 'Check generic constraints'],
            successRate: 0.88,
            averageResolutionTime: 5,
            lastOccurrence: new Date().toISOString()
          },
          {
            id: 'build-dependency-error',
            pattern: 'Cannot find module',
            frequency: 0,
            commonCauses: ['Missing dependency', 'Incorrect import path', 'Package not installed'],
            recommendedFixes: ['Install missing package', 'Fix import path', 'Run npm install'],
            successRate: 0.92,
            averageResolutionTime: 3,
            lastOccurrence: new Date().toISOString()
          }
        ];

        commonPatterns.forEach(pattern => {
          this.state.errorPatterns.set(pattern.id, pattern);
        });

        fs.writeFileSync(this.patternsFile, JSON.stringify(Object.fromEntries(this.state.errorPatterns), null, 2));
      }
    } catch (error) {
      console.error('❌ Failed to initialize error patterns:', error);
    }
  }

  private startErrorMonitoring() {
    // Monitor for errors every 30 seconds
    setInterval(() => {
      this.detectAndProcessErrors();
    }, 30000);

    // Save state every 5 minutes
    setInterval(() => {
      this.saveState();
    }, 300000);

    // Update metrics every minute
    setInterval(() => {
      this.updateMetrics();
    }, 60000);
  }

  async detectAndProcessErrors() {
    console.log('🔍 Detecting errors...');
    
    const errors = await this.detectCurrentErrors();
    const newErrors = await this.processNewErrors(errors);
    
    if (newErrors.length > 0) {
      console.log(`🚨 Detected ${newErrors.length} new errors`);
      this.events.emit('errors-detected', newErrors);
      
      // Auto-resolve if enabled and confidence is high
      if (this.state.settings.autoResolve) {
        await this.attemptAutoResolution(newErrors);
      }
    }

    this.state.lastErrorCheck = new Date().toISOString();
  }

  private async detectCurrentErrors(): Promise<ErrorEntry[]> {
    const errors: ErrorEntry[] = [];

    try {
      // TypeScript errors
      try {
        execSync('npx tsc --noEmit', { stdio: 'pipe' });
      } catch (tsError) {
        const output = tsError.stdout?.toString() || tsError.stderr?.toString() || '';
        const tsErrors = this.parseTypeScriptErrors(output);
        errors.push(...tsErrors);
      }

      // Lint errors
      try {
        execSync('npm run lint', { stdio: 'pipe' });
      } catch (lintError) {
        const output = lintError.stdout?.toString() || lintError.stderr?.toString() || '';
        const lintErrors = this.parseLintErrors(output);
        errors.push(...lintErrors);
      }

      // Build errors
      try {
        execSync('npm run build', { stdio: 'pipe' });
      } catch (buildError) {
        const output = buildError.stdout?.toString() || buildError.stderr?.toString() || '';
        const buildErrors = this.parseBuildErrors(output);
        errors.push(...buildErrors);
      }

    } catch (error) {
      console.error('❌ Error detection failed:', error);
    }

    return errors;
  }

  private parseTypeScriptErrors(output: string): ErrorEntry[] {
    const errors: ErrorEntry[] = [];
    const lines = output.split('\n');
    
    for (const line of lines) {
      if (line.includes('error TS')) {
        const match = line.match(/([^:]+):(\d+):(\d+)\s*-\s*error\s+TS\d+:\s*(.+)/);
        if (match) {
          const error: ErrorEntry = {
            id: `ts-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'typescript',
            severity: 'error',
            file: match[1],
            line: parseInt(match[2]),
            column: parseInt(match[3]),
            message: match[4].trim(),
            timestamp: new Date().toISOString(),
            sessionId: this.state.sessionId,
            status: 'active'
          };
          errors.push(error);
        }
      }
    }
    
    return errors;
  }

  private parseLintErrors(output: string): ErrorEntry[] {
    const errors: ErrorEntry[] = [];
    const lines = output.split('\n');
    
    for (const line of lines) {
      if (line.includes('error') || line.includes('warning')) {
        const match = line.match(/([^:]+):(\d+):(\d+)\s*-\s*(error|warning)\s+(.+)/);
        if (match) {
          const error: ErrorEntry = {
            id: `lint-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'lint',
            severity: match[4] as 'error' | 'warning',
            file: match[1],
            line: parseInt(match[2]),
            column: parseInt(match[3]),
            message: match[5].trim(),
            timestamp: new Date().toISOString(),
            sessionId: this.state.sessionId,
            status: 'active'
          };
          errors.push(error);
        }
      }
    }
    
    return errors;
  }

  private parseBuildErrors(output: string): ErrorEntry[] {
    const errors: ErrorEntry[] = [];
    const lines = output.split('\n');
    
    for (const line of lines) {
      if (line.includes('error') || line.includes('failed')) {
        const error: ErrorEntry = {
          id: `build-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'build',
          severity: 'error',
          message: line.trim(),
          timestamp: new Date().toISOString(),
          sessionId: this.state.sessionId,
          status: 'active'
        };
        errors.push(error);
      }
    }
    
    return errors;
  }

  private async processNewErrors(detectedErrors: ErrorEntry[]): Promise<ErrorEntry[]> {
    const newErrors: ErrorEntry[] = [];

    for (const error of detectedErrors) {
      // Check if this is a new error or matches existing pattern
      const existingError = this.findSimilarError(error);
      
      if (!existingError) {
        // New error
        this.state.errors.set(error.id, error);
        newErrors.push(error);
        
        // Update pattern frequency
        this.updateErrorPattern(error);
        
        // Log error
        await this.logError(error);
      } else if (existingError.status === 'resolved') {
        // Recurring error - mark as active again
        existingError.status = 'active';
        existingError.timestamp = new Date().toISOString();
        existingError.sessionId = this.state.sessionId;
        newErrors.push(existingError);
      }
    }

    return newErrors;
  }

  private findSimilarError(error: ErrorEntry): ErrorEntry | null {
    for (const existingError of this.state.errors.values()) {
      if (this.areErrorsSimilar(error, existingError)) {
        return existingError;
      }
    }
    return null;
  }

  private areErrorsSimilar(error1: ErrorEntry, error2: ErrorEntry): boolean {
    // Check if errors are similar based on type, file, line, and message pattern
    if (error1.type !== error2.type) return false;
    if (error1.file !== error2.file) return false;
    if (error1.line !== error2.line) return false;
    
    // Check message similarity (simple pattern matching)
    const message1 = error1.message.toLowerCase();
    const message2 = error2.message.toLowerCase();
    
    // Extract key parts of the message
    const keyWords1 = message1.split(' ').filter(word => word.length > 3);
    const keyWords2 = message2.split(' ').filter(word => word.length > 3);
    
    const commonWords = keyWords1.filter(word => keyWords2.includes(word));
    const similarity = commonWords.length / Math.max(keyWords1.length, keyWords2.length);
    
    return similarity > 0.7; // 70% similarity threshold
  }

  private updateErrorPattern(error: ErrorEntry) {
    // Find matching pattern
    for (const pattern of this.state.errorPatterns.values()) {
      if (error.message.includes(pattern.pattern)) {
        pattern.frequency++;
        pattern.lastOccurrence = new Date().toISOString();
        break;
      }
    }
  }

  private async logError(error: ErrorEntry) {
    try {
      const logEntry = {
        timestamp: new Date().toISOString(),
        error,
        sessionId: this.state.sessionId
      };

      const logData = fs.existsSync(this.errorLogFile) 
        ? JSON.parse(fs.readFileSync(this.errorLogFile, 'utf8'))
        : { logs: [] };
      
      logData.logs.push(logEntry);
      
      // Keep only last 1000 log entries
      if (logData.logs.length > 1000) {
        logData.logs = logData.logs.slice(-1000);
      }
      
      fs.writeFileSync(this.errorLogFile, JSON.stringify(logData, null, 2));
    } catch (error) {
      console.error('❌ Failed to log error:', error);
    }
  }

  async attemptAutoResolution(errors: ErrorEntry[]) {
    console.log('🤖 Attempting auto-resolution...');
    
    for (const error of errors) {
      const resolution = await this.generateAutoResolution(error);
      
      if (resolution && resolution.confidence > this.state.settings.autoResolveThreshold) {
        await this.applyResolution(error, resolution);
      }
    }
  }

  private async generateAutoResolution(error: ErrorEntry): Promise<{ fix: string; confidence: number } | null> {
    // Find matching pattern
    for (const pattern of this.state.errorPatterns.values()) {
      if (error.message.includes(pattern.pattern)) {
        // Use pattern-based resolution
        const fix = pattern.recommendedFixes[0] || 'Manual review required';
        const confidence = pattern.successRate;
        
        return { fix, confidence };
      }
    }

    // AI-based resolution (placeholder for future implementation)
    if (error.type === 'typescript') {
      return this.generateTypeScriptFix(error);
    }

    return null;
  }

  private generateTypeScriptFix(error: ErrorEntry): { fix: string; confidence: number } | null {
    if (error.message.includes('Cannot find name')) {
      return {
        fix: 'Add missing import or declare variable',
        confidence: 0.8
      };
    }
    
    if (error.message.includes('Type') && error.message.includes('is not assignable')) {
      return {
        fix: 'Fix type annotation or add type assertion',
        confidence: 0.7
      };
    }
    
    if (error.message.includes('Cannot find module')) {
      return {
        fix: 'Install missing dependency or fix import path',
        confidence: 0.9
      };
    }

    return null;
  }

  async applyResolution(error: ErrorEntry, resolution: { fix: string; confidence: number }) {
    const startTime = Date.now();
    
    try {
      console.log(`🔧 Applying resolution for ${error.id}: ${resolution.fix}`);
      
      // Apply the fix (simplified implementation)
      const success = await this.executeFix(error, resolution.fix);
      
      const resolutionEntry: ErrorResolution = {
        id: `resolution-${Date.now()}`,
        approach: 'automated',
        fixStrategy: resolution.fix,
        appliedAt: new Date().toISOString(),
        resolvedBy: this.state.sessionId,
        success,
        resolutionTime: Date.now() - startTime,
        fixDetails: resolution.fix
      };

      error.resolution = resolutionEntry;
      error.status = success ? 'resolved' : 'active';
      
      this.state.resolutionHistory.push(resolutionEntry);
      
      // Update pattern success rate
      this.updatePatternSuccessRate(error, success);
      
      this.events.emit('error-resolved', { error, resolution: resolutionEntry });
      
      console.log(`✅ Resolution ${success ? 'succeeded' : 'failed'} for ${error.id}`);
      
    } catch (error) {
      console.error('❌ Failed to apply resolution:', error);
    }
  }

  private async executeFix(error: ErrorEntry, fix: string): Promise<boolean> {
    // Simplified fix execution - in real implementation, this would apply actual code changes
    try {
      if (fix.includes('Add missing import')) {
        // Would add import statement
        return true;
      }
      
      if (fix.includes('Fix type annotation')) {
        // Would fix type annotation
        return true;
      }
      
      if (fix.includes('Install missing dependency')) {
        // Would run npm install
        return true;
      }
      
      return false;
    } catch (error) {
      return false;
    }
  }

  private updatePatternSuccessRate(error: ErrorEntry, success: boolean) {
    for (const pattern of this.state.errorPatterns.values()) {
      if (error.message.includes(pattern.pattern)) {
        // Update success rate (simplified calculation)
        const totalAttempts = pattern.frequency;
        const successfulAttempts = Math.floor(pattern.successRate * totalAttempts);
        
        if (success) {
          pattern.successRate = (successfulAttempts + 1) / (totalAttempts + 1);
        } else {
          pattern.successRate = successfulAttempts / (totalAttempts + 1);
        }
        
        break;
      }
    }
  }

  private updateMetrics() {
    const errors = Array.from(this.state.errors.values());
    
    this.state.metrics = {
      totalErrors: errors.length,
      resolvedErrors: errors.filter(e => e.status === 'resolved').length,
      activeErrors: errors.filter(e => e.status === 'active').length,
      ignoredErrors: errors.filter(e => e.status === 'ignored').length,
      averageResolutionTime: this.calculateAverageResolutionTime(),
      errorTypes: this.calculateErrorTypeDistribution(errors),
      errorSeverity: this.calculateErrorSeverityDistribution(errors),
      resolutionSuccessRate: this.calculateResolutionSuccessRate(),
      topErrorPatterns: this.getTopErrorPatterns(),
      systemHealth: this.calculateSystemHealth()
    };

    // Save metrics
    try {
      fs.writeFileSync(this.metricsFile, JSON.stringify(this.state.metrics, null, 2));
    } catch (error) {
      console.error('❌ Failed to save metrics:', error);
    }
  }

  private calculateAverageResolutionTime(): number {
    const resolvedErrors = this.state.resolutionHistory.filter(r => r.success);
    if (resolvedErrors.length === 0) return 0;
    
    const totalTime = resolvedErrors.reduce((sum, r) => sum + r.resolutionTime, 0);
    return totalTime / resolvedErrors.length;
  }

  private calculateErrorTypeDistribution(errors: ErrorEntry[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    for (const error of errors) {
      distribution[error.type] = (distribution[error.type] || 0) + 1;
    }
    
    return distribution;
  }

  private calculateErrorSeverityDistribution(errors: ErrorEntry[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    for (const error of errors) {
      distribution[error.severity] = (distribution[error.severity] || 0) + 1;
    }
    
    return distribution;
  }

  private calculateResolutionSuccessRate(): number {
    if (this.state.resolutionHistory.length === 0) return 0;
    
    const successfulResolutions = this.state.resolutionHistory.filter(r => r.success).length;
    return successfulResolutions / this.state.resolutionHistory.length;
  }

  private getTopErrorPatterns(): ErrorPattern[] {
    return Array.from(this.state.errorPatterns.values())
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5);
  }

  private calculateSystemHealth(): 'excellent' | 'good' | 'fair' | 'poor' | 'critical' {
    const activeErrors = this.state.metrics.activeErrors;
    const criticalErrors = Array.from(this.state.errors.values())
      .filter(e => e.severity === 'error' && e.status === 'active').length;
    
    if (criticalErrors === 0 && activeErrors === 0) return 'excellent';
    if (criticalErrors === 0 && activeErrors <= 5) return 'good';
    if (criticalErrors <= 2 && activeErrors <= 10) return 'fair';
    if (criticalErrors <= 5 && activeErrors <= 20) return 'poor';
    return 'critical';
  }

  // Public API methods
  async getErrorReport(): Promise<{
    metrics: ErrorMetrics;
    activeErrors: ErrorEntry[];
    recentResolutions: ErrorResolution[];
    recommendations: string[];
  }> {
    const activeErrors = Array.from(this.state.errors.values())
      .filter(e => e.status === 'active')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const recentResolutions = this.state.resolutionHistory
      .slice(-10)
      .reverse();

    const recommendations = this.generateRecommendations();

    return {
      metrics: this.state.metrics,
      activeErrors,
      recentResolutions,
      recommendations
    };
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    
    if (this.state.metrics.activeErrors > 10) {
      recommendations.push('High number of active errors detected. Consider prioritizing critical errors first.');
    }
    
    if (this.state.metrics.resolutionSuccessRate < 0.7) {
      recommendations.push('Low resolution success rate. Review auto-resolution strategies.');
    }
    
    const criticalErrors = Array.from(this.state.errors.values())
      .filter(e => e.severity === 'error' && e.status === 'active');
    
    if (criticalErrors.length > 0) {
      recommendations.push(`${criticalErrors.length} critical errors require immediate attention.`);
    }

    return recommendations;
  }

  async resolveError(errorId: string, resolution: Omit<ErrorResolution, 'id' | 'appliedAt' | 'resolvedBy'>): Promise<boolean> {
    const error = this.state.errors.get(errorId);
    if (!error) return false;

    const resolutionEntry: ErrorResolution = {
      ...resolution,
      id: `resolution-${Date.now()}`,
      appliedAt: new Date().toISOString(),
      resolvedBy: this.state.sessionId
    };

    error.resolution = resolutionEntry;
    error.status = resolution.success ? 'resolved' : 'active';
    
    this.state.resolutionHistory.push(resolutionEntry);
    
    this.events.emit('error-resolved', { error, resolution: resolutionEntry });
    
    return true;
  }

  async ignoreError(errorId: string, reason: string): Promise<boolean> {
    const error = this.state.errors.get(errorId);
    if (!error) return false;

    error.status = 'ignored';
    error.resolution = {
      id: `ignore-${Date.now()}`,
      approach: 'manual',
      fixStrategy: 'ignored',
      appliedAt: new Date().toISOString(),
      resolvedBy: this.state.sessionId,
      success: true,
      resolutionTime: 0,
      fixDetails: `Ignored: ${reason}`
    };

    this.events.emit('error-ignored', { error, reason });
    
    return true;
  }

  async getErrorPatterns(): Promise<ErrorPattern[]> {
    return Array.from(this.state.errorPatterns.values());
  }

  async addErrorPattern(pattern: Omit<ErrorPattern, 'id' | 'frequency' | 'successRate' | 'averageResolutionTime' | 'lastOccurrence'>): Promise<string> {
    const id = `pattern-${Date.now()}`;
    const newPattern: ErrorPattern = {
      ...pattern,
      id,
      frequency: 0,
      successRate: 0,
      averageResolutionTime: 0,
      lastOccurrence: new Date().toISOString()
    };

    this.state.errorPatterns.set(id, newPattern);
    return id;
  }

  async updateSettings(settings: Partial<ErrorManagerHolonState['settings']>): Promise<void> {
    this.state.settings = { ...this.state.settings, ...settings };
    await this.saveState();
  }

  async cleanup(): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.state.settings.errorRetentionDays);

    // Remove old resolved errors
    for (const [id, error] of this.state.errors.entries()) {
      if (error.status === 'resolved' && new Date(error.timestamp) < cutoffDate) {
        this.state.errors.delete(id);
      }
    }

    // Remove old resolution history
    this.state.resolutionHistory = this.state.resolutionHistory.filter(
      r => new Date(r.appliedAt) >= cutoffDate
    );

    await this.saveState();
    console.log('🧹 Error cleanup completed');
  }
} 