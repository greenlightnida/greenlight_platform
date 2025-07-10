/**
 * Shared Utils Holon - Main Index
 * 
 * PURPOSE: Central export point for all shared utilities
 * Consolidates common functionality used across the platform
 */

// File utilities for file system operations
export { FileUtils } from './file-utils';

// Command utilities for process execution and management
export { CommandUtils } from './command-utils';

// Logging utilities for structured logging
export { LoggingUtils } from './logging-utils';

// Configuration utilities for config management
export { ConfigUtils } from './config-utils';

// Validation utilities for data validation
export { ValidationUtils } from './validation-utils';

// Test utilities for shared utils testing
export { SharedUtilsTester, runSharedUtilsTests } from './test-utils';

// Integration interfaces for holon communication
export * from './integration-interfaces';

/**
 * Shared Utils Holon Manager
 * 
 * Manages the lifecycle and configuration of all shared utilities
 */
export class SharedUtilsManager {
  private static instance: SharedUtilsManager;

  static getInstance(): SharedUtilsManager {
    if (!SharedUtilsManager.instance) {
      SharedUtilsManager.instance = new SharedUtilsManager();
    }
    return SharedUtilsManager.instance;
  }

  /**
   * Initialize all shared utilities with default configuration
   */
  initialize(): void {
    // Initialize logging with file output for the platform
    const { loggingUtils } = require('./logging-utils');
    loggingUtils.updateOptions({
      enableFile: true,
      logFile: 'logs/greenlight-platform.log',
      level: 1, // INFO
      format: 'json'
    });

    console.log('✅ Shared Utils Holon initialized');
  }

  /**
   * Get utility statistics
   */
  getStats(): {
    fileUtils: any;
    commandUtils: any;
    loggingUtils: any;
  } {
    const { fileUtils } = require('./file-utils');
    const { commandUtils } = require('./command-utils');
    const { loggingUtils } = require('./logging-utils');

    return {
      fileUtils: {
        runningProcesses: commandUtils.getRunningProcesses().length
      },
      commandUtils: {
        runningProcesses: commandUtils.getRunningProcesses()
      },
      loggingUtils: loggingUtils.getStats()
    };
  }

  /**
   * Cleanup all utilities
   */
  cleanup(): void {
    const { commandUtils } = require('./command-utils');
    const { loggingUtils } = require('./logging-utils');

    commandUtils.killAllProcesses();
    loggingUtils.destroy();

    console.log('🧹 Shared Utils Holon cleaned up');
  }
}

// Export singleton instance
export const sharedUtilsManager = SharedUtilsManager.getInstance(); 