/**
 * Logging Utilities for Shared Utils Holon
 * 
 * PURPOSE: Consolidate common logging patterns used across the platform
 * - Structured logging
 * - Log levels and filtering
 * - Log persistence
 * - Performance monitoring
 */

import * as fs from 'fs';
import * as path from 'path';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: any;
  duration?: number;
  tags?: string[];
}

export interface LoggingOptions {
  level?: LogLevel;
  enableConsole?: boolean;
  enableFile?: boolean;
  logFile?: string;
  maxFileSize?: number;
  maxFiles?: number;
  format?: 'json' | 'text';
  includeTimestamp?: boolean;
  includeContext?: boolean;
}

export class LoggingUtils {
  private static instance: LoggingUtils;
  private options: LoggingOptions;
  private logBuffer: LogEntry[] = [];
  private bufferSize: number = 100;
  private flushInterval: number = 5000; // 5 seconds
  private flushTimer: NodeJS.Timeout | null = null;

  private constructor(options: LoggingOptions = {}) {
    this.options = {
      level: LogLevel.INFO,
      enableConsole: true,
      enableFile: false,
      logFile: 'logs/app.log',
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      format: 'json',
      includeTimestamp: true,
      includeContext: true,
      ...options
    };

    this.startFlushTimer();
  }

  static getInstance(options?: LoggingOptions): LoggingUtils {
    if (!LoggingUtils.instance) {
      LoggingUtils.instance = new LoggingUtils(options);
    }
    return LoggingUtils.instance;
  }

  /**
   * Log a debug message
   */
  debug(message: string, context?: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, context, data);
  }

  /**
   * Log an info message
   */
  info(message: string, context?: string, data?: any): void {
    this.log(LogLevel.INFO, message, context, data);
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: string, data?: any): void {
    this.log(LogLevel.WARN, message, context, data);
  }

  /**
   * Log an error message
   */
  error(message: string, context?: string, data?: any): void {
    this.log(LogLevel.ERROR, message, context, data);
  }

  /**
   * Log a fatal message
   */
  fatal(message: string, context?: string, data?: any): void {
    this.log(LogLevel.FATAL, message, context, data);
  }

  /**
   * Log with performance timing
   */
  time<T>(operation: () => T | Promise<T>, message: string, context?: string): T | Promise<T> {
    const startTime = Date.now();
    
    try {
      const result = operation();
      
      if (result instanceof Promise) {
        return result.finally(() => {
          const duration = Date.now() - startTime;
          this.log(LogLevel.INFO, `${message} completed`, context, { duration });
        });
      } else {
        const duration = Date.now() - startTime;
        this.log(LogLevel.INFO, `${message} completed`, context, { duration });
        return result;
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      this.log(LogLevel.ERROR, `${message} failed`, context, { duration, error });
      throw error;
    }
  }

  /**
   * Log with specific tags
   */
  logWithTags(level: LogLevel, message: string, tags: string[], context?: string, data?: any): void {
    this.log(level, message, context, data, tags);
  }

  /**
   * Internal logging method
   */
  private log(level: LogLevel, message: string, context?: string, data?: any, tags?: string[]): void {
    if (level < this.options.level!) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      data,
      tags
    };

    // Add to buffer
    this.logBuffer.push(entry);

    // Console output
    if (this.options.enableConsole) {
      this.writeToConsole(entry);
    }

    // Flush if buffer is full
    if (this.logBuffer.length >= this.bufferSize) {
      this.flush();
    }
  }

  /**
   * Write log entry to console
   */
  private writeToConsole(entry: LogEntry): void {
    const levelEmoji = this.getLevelEmoji(entry.level);
    const levelName = LogLevel[entry.level];
    const timestamp = this.options.includeTimestamp ? `[${entry.timestamp}]` : '';
    const context = this.options.includeContext && entry.context ? `[${entry.context}]` : '';
    
    const message = `${levelEmoji} ${timestamp} ${levelName} ${context} ${entry.message}`;
    
    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(message);
        break;
      case LogLevel.INFO:
        console.info(message);
        break;
      case LogLevel.WARN:
        console.warn(message);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(message);
        break;
    }

    if (entry.data) {
      console.log('Data:', entry.data);
    }
  }

  /**
   * Get emoji for log level
   */
  private getLevelEmoji(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG: return '🔍';
      case LogLevel.INFO: return 'ℹ️';
      case LogLevel.WARN: return '⚠️';
      case LogLevel.ERROR: return '❌';
      case LogLevel.FATAL: return '💀';
      default: return '📝';
    }
  }

  /**
   * Flush log buffer to file
   */
  private flush(): void {
    if (!this.options.enableFile || this.logBuffer.length === 0) {
      return;
    }

    try {
      this.ensureLogDirectory();
      this.rotateLogFileIfNeeded();

      const content = this.formatLogEntries(this.logBuffer);
      fs.appendFileSync(this.options.logFile!, content);

      this.logBuffer = [];
    } catch (error) {
      console.error('Failed to flush logs:', error);
    }
  }

  /**
   * Ensure log directory exists
   */
  private ensureLogDirectory(): void {
    const logDir = path.dirname(this.options.logFile!);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  /**
   * Rotate log file if it's too large
   */
  private rotateLogFileIfNeeded(): void {
    if (!fs.existsSync(this.options.logFile!)) {
      return;
    }

    const stats = fs.statSync(this.options.logFile!);
    if (stats.size < this.options.maxFileSize!) {
      return;
    }

    // Rotate existing log files
    for (let i = this.options.maxFiles! - 1; i > 0; i--) {
      const oldFile = `${this.options.logFile}.${i}`;
      const newFile = `${this.options.logFile}.${i + 1}`;
      
      if (fs.existsSync(oldFile)) {
        if (i === this.options.maxFiles! - 1) {
          fs.unlinkSync(oldFile);
        } else {
          fs.renameSync(oldFile, newFile);
        }
      }
    }

    // Move current log file
    fs.renameSync(this.options.logFile!, `${this.options.logFile}.1`);
  }

  /**
   * Format log entries for file output
   */
  private formatLogEntries(entries: LogEntry[]): string {
    if (this.options.format === 'json') {
      return entries.map(entry => JSON.stringify(entry)).join('\n') + '\n';
    } else {
      return entries.map(entry => this.formatTextEntry(entry)).join('\n') + '\n';
    }
  }

  /**
   * Format single log entry as text
   */
  private formatTextEntry(entry: LogEntry): string {
    const parts = [
      entry.timestamp,
      LogLevel[entry.level],
      entry.context || 'GLOBAL',
      entry.message
    ];

    if (entry.data) {
      parts.push(JSON.stringify(entry.data));
    }

    if (entry.tags && entry.tags.length > 0) {
      parts.push(`[${entry.tags.join(',')}]`);
    }

    return parts.join(' | ');
  }

  /**
   * Start flush timer
   */
  private startFlushTimer(): void {
    if (this.options.enableFile) {
      this.flushTimer = setInterval(() => {
        this.flush();
      }, this.flushInterval);
    }
  }

  /**
   * Stop flush timer
   */
  private stopFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  /**
   * Force flush logs
   */
  forceFlush(): void {
    this.flush();
  }

  /**
   * Get log statistics
   */
  getStats(): {
    totalEntries: number;
    entriesByLevel: Record<string, number>;
    bufferSize: number;
    lastFlush: Date;
  } {
    const entriesByLevel: Record<string, number> = {};
    
    for (const entry of this.logBuffer) {
      const levelName = LogLevel[entry.level];
      entriesByLevel[levelName] = (entriesByLevel[levelName] || 0) + 1;
    }

    return {
      totalEntries: this.logBuffer.length,
      entriesByLevel,
      bufferSize: this.bufferSize,
      lastFlush: new Date()
    };
  }

  /**
   * Update logging options
   */
  updateOptions(newOptions: Partial<LoggingOptions>): void {
    this.options = { ...this.options, ...newOptions };
    
    if (newOptions.enableFile !== undefined) {
      if (newOptions.enableFile) {
        this.startFlushTimer();
      } else {
        this.stopFlushTimer();
      }
    }
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.stopFlushTimer();
    this.forceFlush();
  }
}

// Export singleton instance
export const loggingUtils = LoggingUtils.getInstance();

// Convenience functions
export const debug = (message: string, context?: string, data?: any) => loggingUtils.debug(message, context, data);
export const info = (message: string, context?: string, data?: any) => loggingUtils.info(message, context, data);
export const warn = (message: string, context?: string, data?: any) => loggingUtils.warn(message, context, data);
export const error = (message: string, context?: string, data?: any) => loggingUtils.error(message, context, data);
export const fatal = (message: string, context?: string, data?: any) => loggingUtils.fatal(message, context, data);
export const time = <T>(operation: () => T | Promise<T>, message: string, context?: string) => loggingUtils.time(operation, message, context); 