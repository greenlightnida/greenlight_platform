/**
 * Configuration Utilities for Shared Utils Holon
 * 
 * PURPOSE: Consolidate configuration management across the platform
 * - Configuration loading and validation
 * - Environment-specific configs
 * - Configuration hot-reloading
 * - Schema validation
 */

import * as fs from 'fs';
import * as path from 'path';
import { FileUtils } from './file-utils';
import { LoggingUtils } from './logging-utils';

export interface ConfigSchema {
  [key: string]: {
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    required?: boolean;
    default?: any;
    validator?: (value: any) => boolean;
    description?: string;
  };
}

export interface ConfigOptions {
  configPath?: string;
  environment?: string;
  schema?: ConfigSchema;
  hotReload?: boolean;
  validateOnLoad?: boolean;
}

export interface ConfigValue {
  value: any;
  source: 'default' | 'file' | 'environment' | 'override';
  timestamp: Date;
}

export class ConfigUtils {
  private static instance: ConfigUtils;
  private logger: LoggingUtils;
  private fileUtils: FileUtils;
  private config: Map<string, ConfigValue> = new Map();
  private schema?: ConfigSchema;
  private options: ConfigOptions;
  private watchers: Map<string, fs.FSWatcher> = new Map();

  private constructor(options: ConfigOptions = {}) {
    this.options = {
      configPath: 'config',
      environment: process.env.NODE_ENV || 'development',
      hotReload: false,
      validateOnLoad: true,
      ...options
    };

    this.logger = LoggingUtils.getInstance();
    this.fileUtils = new FileUtils();
  }

  static getInstance(options?: ConfigOptions): ConfigUtils {
    if (!ConfigUtils.instance) {
      ConfigUtils.instance = new ConfigUtils(options);
    }
    return ConfigUtils.instance;
  }

  /**
   * Load configuration from file
   */
  async loadConfig(configName: string, schema?: ConfigSchema): Promise<void> {
    const configPath = path.join(this.options.configPath!, configName);
    
    try {
      const configData = await this.fileUtils.readJsonFile(configPath);
      this.schema = schema || this.schema;
      
      if (this.options.validateOnLoad && this.schema) {
        this.validateConfig(configData, this.schema);
      }
      
      // Store config values with metadata
      for (const [key, value] of Object.entries(configData)) {
        this.config.set(key, {
          value,
          source: 'file',
          timestamp: new Date()
        });
      }
      
      this.logger.info(`Configuration loaded: ${configName}`, 'ConfigUtils', { 
        path: configPath, 
        keys: Object.keys(configData) 
      });
      
      // Set up file watching for hot reload
      if (this.options.hotReload) {
        this.watchConfigFile(configPath, configName);
      }
      
    } catch (error) {
      this.logger.error(`Failed to load config: ${configName}`, 'ConfigUtils', { error });
      throw error;
    }
  }

  /**
   * Load environment-specific configuration
   */
  async loadEnvironmentConfig(environment?: string): Promise<void> {
    const env = environment || this.options.environment;
    const configName = `${env}.json`;
    
    try {
      await this.loadConfig(configName);
      this.logger.info(`Environment config loaded: ${env}`, 'ConfigUtils');
    } catch (error) {
      this.logger.warn(`Environment config not found: ${env}`, 'ConfigUtils', { error });
    }
  }

  /**
   * Get configuration value
   */
  get<T = any>(key: string, defaultValue?: T): T {
    const configValue = this.config.get(key);
    
    if (configValue) {
      return configValue.value as T;
    }
    
    // Check environment variable
    const envValue = process.env[key];
    if (envValue !== undefined) {
      const parsedValue = this.parseEnvValue(envValue);
      this.config.set(key, {
        value: parsedValue,
        source: 'environment',
        timestamp: new Date()
      });
      return parsedValue as T;
    }
    
    // Return default value
    if (defaultValue !== undefined) {
      this.config.set(key, {
        value: defaultValue,
        source: 'default',
        timestamp: new Date()
      });
      return defaultValue;
    }
    
    throw new Error(`Configuration key not found: ${key}`);
  }

  /**
   * Set configuration value
   */
  set<T = any>(key: string, value: T): void {
    this.config.set(key, {
      value,
      source: 'override',
      timestamp: new Date()
    });
    
    this.logger.debug(`Configuration set: ${key}`, 'ConfigUtils', { value });
  }

  /**
   * Check if configuration key exists
   */
  has(key: string): boolean {
    return this.config.has(key) || process.env[key] !== undefined;
  }

  /**
   * Get all configuration keys
   */
  keys(): string[] {
    const configKeys = Array.from(this.config.keys());
    const envKeys = Object.keys(process.env).filter(key => 
      key.startsWith('GREENLIGHT_') || key.startsWith('APP_')
    );
    
    const allKeys = [...configKeys, ...envKeys];
    return allKeys.filter((key, index) => allKeys.indexOf(key) === index);
  }

  /**
   * Get configuration metadata
   */
  getMetadata(key: string): ConfigValue | undefined {
    return this.config.get(key);
  }

  /**
   * Validate configuration against schema
   */
  validateConfig(config: any, schema: ConfigSchema): void {
    const errors: string[] = [];
    
    for (const [key, schemaDef] of Object.entries(schema)) {
      const value = config[key];
      
      // Check required fields
      if (schemaDef.required && value === undefined) {
        errors.push(`Required field missing: ${key}`);
        continue;
      }
      
      // Skip validation for undefined values
      if (value === undefined) {
        continue;
      }
      
      // Type validation
      if (!this.validateType(value, schemaDef.type)) {
        errors.push(`Invalid type for ${key}: expected ${schemaDef.type}, got ${typeof value}`);
        continue;
      }
      
      // Custom validator
      if (schemaDef.validator && !schemaDef.validator(value)) {
        errors.push(`Validation failed for ${key}`);
      }
    }
    
    if (errors.length > 0) {
      throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
    }
  }

  /**
   * Validate value type
   */
  private validateType(value: any, expectedType: string): boolean {
    switch (expectedType) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      case 'array':
        return Array.isArray(value);
      default:
        return false;
    }
  }

  /**
   * Parse environment variable value
   */
  private parseEnvValue(value: string): any {
    // Try to parse as JSON
    try {
      return JSON.parse(value);
    } catch {
      // Try to parse as number
      if (!isNaN(Number(value))) {
        return Number(value);
      }
      
      // Try to parse as boolean
      if (value.toLowerCase() === 'true') return true;
      if (value.toLowerCase() === 'false') return false;
      
      // Return as string
      return value;
    }
  }

  /**
   * Watch configuration file for changes
   */
  private watchConfigFile(filePath: string, configName: string): void {
    if (this.watchers.has(configName)) {
      this.watchers.get(configName)!.close();
    }
    
    const watcher = fs.watch(filePath, async (eventType) => {
      if (eventType === 'change') {
        this.logger.info(`Configuration file changed: ${configName}`, 'ConfigUtils');
        
        try {
          // Reload configuration
          await this.loadConfig(configName);
          this.emit('config:reloaded', configName);
        } catch (error) {
          this.logger.error(`Failed to reload config: ${configName}`, 'ConfigUtils', { error });
        }
      }
    });
    
    this.watchers.set(configName, watcher);
  }

  /**
   * Export configuration to file
   */
  async exportConfig(outputPath: string, includeMetadata = false): Promise<void> {
    const exportData: any = {};
    
    for (const [key, configValue] of Array.from(this.config.entries())) {
      if (includeMetadata) {
        exportData[key] = configValue;
      } else {
        exportData[key] = configValue.value;
      }
    }
    
    await this.fileUtils.writeJsonFile(outputPath, exportData);
    this.logger.info(`Configuration exported: ${outputPath}`, 'ConfigUtils');
  }

  /**
   * Get configuration statistics
   */
  getStats(): {
    totalKeys: number;
    sources: Record<string, number>;
    lastModified: Date;
  } {
    const sources: Record<string, number> = {};
    
    for (const configValue of Array.from(this.config.values())) {
      sources[configValue.source] = (sources[configValue.source] || 0) + 1;
    }
    
    const lastModified = new Date(Math.max(
      ...Array.from(this.config.values()).map(cv => cv.timestamp.getTime())
    ));
    
    return {
      totalKeys: this.config.size,
      sources,
      lastModified
    };
  }

  /**
   * Clear all configuration
   */
  clear(): void {
    this.config.clear();
    
    // Close all watchers
    for (const watcher of Array.from(this.watchers.values())) {
      watcher.close();
    }
    this.watchers.clear();
    
    this.logger.info('Configuration cleared', 'ConfigUtils');
  }

  /**
   * Emit event (for hot reload notifications)
   */
  private emit(event: string, ...args: any[]): void {
    // This would integrate with an event system if needed
    this.logger.debug(`Config event: ${event}`, 'ConfigUtils', { args });
  }
} 