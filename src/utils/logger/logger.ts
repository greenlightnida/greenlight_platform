export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

// Utility to safely detect environment
function getLogLevel(): LogLevel {
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && typeof import.meta.env.DEV !== 'undefined') {
      // @ts-ignore
      return import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.INFO;
    }
  } catch (e) {}
  // Default to INFO in Node.js or unknown environments
  return LogLevel.INFO;
}

function isProdEnv(): boolean {
  try {
    // @ts-ignore
    return typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PROD;
  } catch (e) {}
  return false;
}

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: number
  context?: Record<string, unknown> | undefined
  error?: Error | undefined
  userId?: string | undefined
  sessionId?: string | undefined
}

export class Logger {
  private logs: LogEntry[] = []
  private maxLogs = 1000
  private currentLevel = LogLevel.INFO
  private sessionId = this.generateSessionId()

  constructor(level: LogLevel = LogLevel.INFO) {
    this.currentLevel = level
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.currentLevel
  }

  private addLog(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error) {
    if (!this.shouldLog(level)) return

    const entry: LogEntry = {
      level,
      message,
      timestamp: Date.now(),
      context,
      error,
      sessionId: this.sessionId
    }

    this.logs.push(entry)

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Console output for development (only if DEBUG level)
    if (getLogLevel() === LogLevel.DEBUG) {
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(message, context)
          break
        case LogLevel.INFO:
          console.info(message, context)
          break
        case LogLevel.WARN:
          console.warn(message, context)
          break
        case LogLevel.ERROR:
        case LogLevel.FATAL:
          console.error(message, error, context)
          break
      }
    }

    // Remote logging for errors and fatal issues
    if (level >= LogLevel.ERROR) {
      void this.sendToRemoteLogger()
    }
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.addLog(LogLevel.DEBUG, message, context)
  }

  info(message: string, context?: Record<string, unknown>) {
    this.addLog(LogLevel.INFO, message, context)
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.addLog(LogLevel.WARN, message, context)
  }

  error(message: string, error?: Error, context?: Record<string, unknown>) {
    this.addLog(LogLevel.ERROR, message, context, error)
  }

  fatal(message: string, error?: Error, context?: Record<string, unknown>) {
    this.addLog(LogLevel.FATAL, message, context, error)
  }

  // Performance logging
  time() {
    // Performance timing disabled
  }

  timeEnd() {
    // Performance timing disabled
  }

  // User action logging
  trackUserAction(action: string, details?: Record<string, unknown>) {
    this.info(`User Action: ${action}`, details)
  }

  // API call logging
  trackAPICall(endpoint: string, method: string, duration: number, success: boolean, error?: Error) {
    const level = success ? LogLevel.INFO : LogLevel.ERROR
    const message = `API Call: ${method} ${endpoint} (${duration}ms)`
    const context = { endpoint, method, duration, success }
    
    this.addLog(level, message, context, error)
  }

  // Get logs for a specific time range
  getLogs(timeRangeMs: number = 60000): LogEntry[] {
    const cutoff = Date.now() - timeRangeMs
    return this.logs.filter(log => log.timestamp > cutoff)
  }

  // Get logs by level
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level)
  }

  // Export logs for debugging
  exportLogs(): LogEntry[] {
    return [...this.logs]
  }

  // Clear logs
  clearLogs() {
    this.logs = []
  }

  // Set log level
  setLevel(level: LogLevel) {
    this.currentLevel = level
  }

  // Remote logging (placeholder for production)
  private async sendToRemoteLogger(): Promise<void> {
    if (isProdEnv()) {
      try {
        // Example: Send to your logging endpoint
        // await fetch('/api/logs', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(entry)
        // })
        await Promise.resolve(); // Placeholder await to satisfy linting
      } catch (error) {
        // Remote logging failed silently
      }
    }
  }
}

export const logger = new Logger(getLogLevel());

// Convenience functions
export const debug = (message: string, context?: Record<string, unknown>) => logger.debug(message, context)
export const info = (message: string, context?: Record<string, unknown>) => logger.info(message, context)
export const warn = (message: string, context?: Record<string, unknown>) => logger.warn(message, context)
export const error = (message: string, error?: Error, context?: Record<string, unknown>) => logger.error(message, error, context)
export const fatal = (message: string, error?: Error, context?: Record<string, unknown>) => logger.fatal(message, error, context) 