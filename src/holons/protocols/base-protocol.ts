/**
 * Base Protocol Class for Protocol Holon
 * 
 * PURPOSE: Provide common functionality for all protocols
 * - Session management
 * - Metadata generation
 * - File operations
 * - Error handling
 * - Logging and reporting
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

export interface SessionMetadata {
  sessionId: string;
  sessionType: string;
  sessionLabel: string;
  timestamp: string;
  date: string;
  time: string;
  timezone: string;
  protocolVersion: string;
  environment: string;
  userAgent: string;
  hostname: string;
  platform: string;
  nodeVersion: string;
  cwd: string;
}

export interface ProtocolConfig {
  protocolName: string;
  protocolVersion: string;
  sessionType: string;
  sessionLabel: string;
  dataDirectory: string;
  reportsDirectory: string;
  sessionsDirectory: string;
}

export interface ProtocolResult {
  success: boolean;
  sessionId: string;
  timestamp: string;
  duration: string;
  results: any;
  errors: string[];
  warnings: string[];
  metadata: SessionMetadata;
}

export abstract class BaseProtocol {
  protected projectRoot: string;
  protected sessionId: string;
  protected protocolVersion: string;
  protected sessionStartTime: number;
  protected sessionMetadata: SessionMetadata;
  protected config: ProtocolConfig;
  protected results: any = {};
  protected errors: string[] = [];
  protected warnings: string[] = [];

  constructor(config: ProtocolConfig) {
    this.projectRoot = process.cwd();
    this.config = config;
    this.protocolVersion = config.protocolVersion;
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = Date.now();
    this.sessionMetadata = this.generateSessionMetadata();
  }

  protected generateSessionId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const time = new Date().toISOString().split('T')[1].split('.')[0].replace(/:/g, '');
    return `${this.config.sessionType}-${date}-${time}-${timestamp}-${random}`;
  }

  protected generateSessionMetadata(): SessionMetadata {
    const now = new Date();
    return {
      sessionId: this.sessionId,
      sessionType: this.config.sessionType,
      sessionLabel: this.config.sessionLabel,
      timestamp: now.toISOString(),
      date: now.toISOString().split('T')[0],
      time: now.toISOString().split('T')[1].split('.')[0],
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      protocolVersion: this.protocolVersion,
      environment: process.env.NODE_ENV || 'development',
      userAgent: process.env.USER || 'unknown',
      hostname: require('os').hostname(),
      platform: process.platform,
      nodeVersion: process.version,
      cwd: this.projectRoot
    };
  }

  protected calculateSessionDuration(): string {
    const duration = Date.now() - this.sessionStartTime;
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${seconds}s`;
  }

  protected ensureDirectory(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  protected writeJsonFile(filePath: string, data: any): void {
    this.ensureDirectory(path.dirname(filePath));
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  protected readJsonFile(filePath: string): any {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  }

  protected executeCommand(command: string, options: any = {}): string {
    try {
      const defaultOptions = {
        encoding: 'utf8',
        cwd: this.projectRoot,
        timeout: 60000,
        ...options
      };
      return execSync(command, defaultOptions);
    } catch (error) {
      this.logError(`Command execution failed: ${command}`, error);
      throw error;
    }
  }

  protected logError(message: string, error?: any): void {
    const errorMessage = error ? `${message}: ${error.message || error}` : message;
    this.errors.push(errorMessage);
    console.error(`❌ ${errorMessage}`);
  }

  protected logWarning(message: string): void {
    this.warnings.push(message);
    console.warn(`⚠️  ${message}`);
  }

  protected logInfo(message: string): void {
    console.log(`ℹ️  ${message}`);
  }

  protected logSuccess(message: string): void {
    console.log(`✅ ${message}`);
  }

  protected async saveSessionData(data: any, filename: string): Promise<string> {
    const sessionPath = path.join(this.projectRoot, this.config.sessionsDirectory, filename);
    this.writeJsonFile(sessionPath, data);
    return sessionPath;
  }

  protected async saveReport(data: any, filename: string): Promise<string> {
    const reportPath = path.join(this.projectRoot, this.config.reportsDirectory, filename);
    this.writeJsonFile(reportPath, data);
    return reportPath;
  }

  protected async saveData(data: any, filename: string): Promise<string> {
    const dataPath = path.join(this.projectRoot, this.config.dataDirectory, filename);
    this.writeJsonFile(dataPath, data);
    return dataPath;
  }

  protected generateResult(): ProtocolResult {
    return {
      success: this.errors.length === 0,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      duration: this.calculateSessionDuration(),
      results: this.results,
      errors: this.errors,
      warnings: this.warnings,
      metadata: this.sessionMetadata
    };
  }

  protected printHeader(): void {
    console.log(`🚀 ${this.config.protocolName} v${this.protocolVersion} Initiated`);
    console.log('='.repeat(50));
    console.log(`Session ID: ${this.sessionId}`);
    console.log(`Protocol Version: ${this.protocolVersion}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log('');
  }

  protected printFooter(): void {
    console.log('');
    console.log(`✅ ${this.config.protocolName} Complete`);
    console.log(`⏱️  Total duration: ${this.calculateSessionDuration()}`);
    
    if (this.errors.length > 0) {
      console.log(`❌ Errors: ${this.errors.length}`);
    }
    
    if (this.warnings.length > 0) {
      console.log(`⚠️  Warnings: ${this.warnings.length}`);
    }
  }

  protected async executePhase(phaseName: string, phaseFunction: () => Promise<void>): Promise<void> {
    console.log(`🔄 ${phaseName}...`);
    try {
      await phaseFunction();
      this.logSuccess(`${phaseName} completed`);
    } catch (error) {
      this.logError(`${phaseName} failed`, error);
      throw error;
    }
  }

  protected async executeWithErrorHandling(operation: () => Promise<void>): Promise<void> {
    try {
      await operation();
    } catch (error) {
      this.logError('Operation failed', error);
      throw error;
    }
  }

  protected validateFileExists(filePath: string, description: string): boolean {
    if (!fs.existsSync(filePath)) {
      this.logWarning(`${description} not found: ${filePath}`);
      return false;
    }
    return true;
  }

  protected validateDirectoryExists(dirPath: string, description: string): boolean {
    if (!fs.existsSync(dirPath)) {
      this.logWarning(`${description} not found: ${dirPath}`);
      return false;
    }
    return true;
  }

  protected async findFiles(directory: string, patterns: string[], excludePatterns: string[] = []): Promise<string[]> {
    const files: string[] = [];
    
    const scanDirectory = (currentDir: string) => {
      try {
        const items = fs.readdirSync(currentDir);
        
        for (const item of items) {
          const fullPath = path.join(currentDir, item);
          const stat = fs.statSync(fullPath);
          
          // Check exclude patterns
          const shouldExclude = excludePatterns.some(pattern => {
            if (pattern.includes('*')) {
              const regex = new RegExp(pattern.replace(/\*/g, '.*'));
              return regex.test(item);
            }
            return fullPath.includes(pattern);
          });
          
          if (shouldExclude) continue;
          
          if (stat.isDirectory()) {
            scanDirectory(fullPath);
          } else if (stat.isFile()) {
            const shouldInclude = patterns.some(pattern => {
              if (pattern.includes('*')) {
                const regex = new RegExp(pattern.replace(/\*/g, '.*'));
                return regex.test(item);
              }
              return item.includes(pattern);
            });
            
            if (shouldInclude) {
              files.push(fullPath);
            }
          }
        }
      } catch (error) {
        this.logWarning(`Could not scan directory ${currentDir}: ${error}`);
      }
    };
    
    scanDirectory(directory);
    return files;
  }

  protected formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  protected generateId(prefix: string = 'id'): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Abstract method that must be implemented by subclasses
  abstract execute(): Promise<ProtocolResult>;
} 