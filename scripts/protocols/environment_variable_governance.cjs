#!/usr/bin/env node

/**
 * Environment Variable Governance Protocol
 * 
 * This protocol manages environment variables across the Greenlight Platform,
 * providing monitoring, validation, and policy enforcement to prevent
 * configuration errors and security issues.
 * 
 * Responsibilities:
 * - Monitor all environment variable usage
 * - Validate variable types and values
 * - Enforce security policies
 * - Generate compliance reports
 * - Provide recommendations for optimization
 * - Auto-fix common issues
 */

const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');

class EnvironmentVariableGovernanceProtocol extends EventEmitter {
  constructor() {
    super();
    this.name = 'Environment Variable Governance';
    this.version = '1.0.0';
    this.description = 'Manages environment variables across the platform';
    this.status = 'active';
    this.lastRun = null;
    this.stats = {
      totalScans: 0,
      totalErrors: 0,
      totalFixes: 0,
      totalAlerts: 0,
      lastScanDuration: 0
    };
    
    this.config = {
      scanInterval: 300000, // 5 minutes
      alertThreshold: 5,
      autoFix: true,
      monitoring: true,
      logLevel: 'info'
    };
    
    this.scanInterval = null;
    this.initialize();
  }

  async initialize() {
    try {
      console.log('🔧 Initializing Environment Variable Governance Protocol...');
      
      // Load configuration
      await this.loadConfiguration();
      
      // Initialize monitoring
      if (this.config.monitoring) {
        await this.startMonitoring();
      }
      
      // Perform initial scan
      await this.performScan();
      
      console.log('✅ Environment Variable Governance Protocol initialized');
      this.emit('initialized');
      
    } catch (error) {
      console.error('❌ Failed to initialize Environment Variable Governance Protocol:', error);
      this.emit('initialization_failed', error);
    }
  }

  async loadConfiguration() {
    const configPath = path.join(process.cwd(), 'config', 'environments', 'governance-config.json');
    
    try {
      if (fs.existsSync(configPath)) {
        const configData = fs.readFileSync(configPath, 'utf8');
        const config = JSON.parse(configData);
        this.config = { ...this.config, ...config };
      } else {
        // Create default configuration
        await this.saveConfiguration();
      }
    } catch (error) {
      console.warn('⚠️ Could not load configuration, using defaults:', error.message);
    }
  }

  async saveConfiguration() {
    const configPath = path.join(process.cwd(), 'config', 'environments', 'governance-config.json');
    const configDir = path.dirname(configPath);
    
    try {
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }
      
      fs.writeFileSync(configPath, JSON.stringify(this.config, null, 2));
    } catch (error) {
      console.error('❌ Failed to save configuration:', error);
    }
  }

  async startMonitoring() {
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
    }
    
    this.scanInterval = setInterval(async () => {
      await this.performScan();
    }, this.config.scanInterval);
    
    console.log(`🔍 Environment variable monitoring started (interval: ${this.config.scanInterval / 1000}s)`);
    this.emit('monitoring_started');
  }

  async stopMonitoring() {
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = null;
      console.log('🔍 Environment variable monitoring stopped');
      this.emit('monitoring_stopped');
    }
  }

  async performScan() {
    const startTime = Date.now();
    console.log('🔍 Starting environment variable scan...');
    
    try {
      this.stats.totalScans++;
      
      // Add timeout to prevent infinite scanning
      const scanPromise = this.performScanInternal();
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Scan timeout after 30 seconds')), 30000);
      });
      
      const { usage, errors, violations, recommendations } = await Promise.race([
        scanPromise,
        timeoutPromise
      ]);
      
      // Auto-fix if enabled
      if (this.config.autoFix) {
        await this.autoFixErrors(errors);
      }
      
      // Update statistics
      this.stats.lastScanDuration = Date.now() - startTime;
      this.stats.totalErrors += errors.length;
      this.stats.totalAlerts += violations.length;
      this.lastRun = new Date();
      
      // Log results
      this.logScanResults(usage, errors, violations, recommendations);
      
      // Emit events
      this.emit('scan_completed', {
        usage,
        errors,
        violations,
        recommendations,
        duration: this.stats.lastScanDuration
      });
      
      console.log(`✅ Environment variable scan completed in ${this.stats.lastScanDuration}ms`);
      
    } catch (error) {
      console.error('❌ Environment variable scan failed:', error);
      this.emit('scan_failed', error);
    }
  }

  async performScanInternal() {
    // Scan for variable usage
    const usage = await this.scanVariableUsage();
    
    // Validate variables
    const errors = await this.validateVariables();
    
    // Check policies
    const violations = await this.checkPolicies();
    
    // Generate recommendations
    const recommendations = await this.generateRecommendations();
    
    return { usage, errors, violations, recommendations };
  }

  async scanVariableUsage() {
    const usage = [];
    const sourceDirs = ['src', 'config', 'scripts'];
    const extensions = ['.ts', '.tsx', '.js', '.jsx', '.cjs'];
    
    for (const dir of sourceDirs) {
      const dirPath = path.join(process.cwd(), dir);
      if (fs.existsSync(dirPath)) {
        const files = this.findFiles(dirPath, extensions);
        for (const file of files) {
          const fileUsage = this.scanFileForVariables(file);
          usage.push(...fileUsage);
        }
      }
    }
    
    return usage;
  }

  findFiles(dir, extensions, depth = 0, maxDepth = 5) {
    const files = [];
    
    // Skip if we've reached max depth or hit excluded directories
    if (depth > maxDepth) return files;
    
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        // Skip excluded directories and files
        if (item.startsWith('.') || 
            item === 'node_modules' || 
            item === 'dist' || 
            item === 'build' || 
            item === '.git' ||
            item === 'coverage' ||
            item === '.next' ||
            item === '.nuxt') {
          continue;
        }
        
        const fullPath = path.join(dir, item);
        
        try {
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            files.push(...this.findFiles(fullPath, extensions, depth + 1, maxDepth));
          } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
            files.push(fullPath);
          }
        } catch (error) {
          // Skip files/directories we can't access
          continue;
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
    
    return files;
  }

  scanFileForVariables(filePath) {
    const usage = [];
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        // Look for process.env usage
        const envMatches = line.match(/process\.env\.([A-Z_][A-Z0-9_]*)/g);
        if (envMatches) {
          envMatches.forEach(match => {
            const varName = match.replace('process.env.', '');
            usage.push({
              variableName: varName,
              filePath,
              lineNumber: index + 1,
              context: line.trim(),
              timestamp: new Date(),
              operation: 'read'
            });
          });
        }
        
        // Look for environment variable references in comments
        const commentMatches = line.match(/\/\/.*\$([A-Z_][A-Z0-9_]*)/g);
        if (commentMatches) {
          commentMatches.forEach(match => {
            const varName = match.match(/\$([A-Z_][A-Z0-9_]*)/)?.[1];
            if (varName) {
              usage.push({
                variableName: varName,
                filePath,
                lineNumber: index + 1,
                context: line.trim(),
                timestamp: new Date(),
                operation: 'read'
              });
            }
          });
        }
      });
    } catch (error) {
      console.warn(`⚠️ Could not scan file ${filePath}:`, error.message);
    }
    
    return usage;
  }

  async validateVariables() {
    const errors = [];
    const envVars = process.env;
    
    // Define validation rules
    const validationRules = {
      'DATABASE_URL': {
        required: true,
        pattern: /^postgresql:\/\/.+/,
        message: 'DATABASE_URL must be a valid PostgreSQL connection string'
      },
      'JWT_SECRET': {
        required: true,
        minLength: 32,
        message: 'JWT_SECRET must be at least 32 characters long'
      },
      'PORT': {
        required: false,
        type: 'number',
        minValue: 1024,
        maxValue: 65535,
        message: 'PORT must be a number between 1024 and 65535'
      },
      'NODE_ENV': {
        required: false,
        allowedValues: ['development', 'production', 'test', 'staging'],
        message: 'NODE_ENV must be one of: development, production, test, staging'
      }
    };
    
    // Validate each rule
    for (const [varName, rule] of Object.entries(validationRules)) {
      const value = envVars[varName];
      
      if (rule.required && !value) {
        errors.push({
          variableName: varName,
          type: 'missing_required',
          severity: 'critical',
          message: rule.message,
          timestamp: new Date()
        });
        continue;
      }
      
      if (value) {
        // Pattern validation
        if (rule.pattern && !rule.pattern.test(value)) {
          errors.push({
            variableName: varName,
            type: 'validation_failed',
            severity: 'high',
            message: rule.message,
            timestamp: new Date()
          });
        }
        
        // Type validation
        if (rule.type === 'number') {
          const numValue = Number(value);
          if (isNaN(numValue)) {
            errors.push({
              variableName: varName,
              type: 'validation_failed',
              severity: 'high',
              message: `${varName} must be a valid number`,
              timestamp: new Date()
            });
          } else if (rule.minValue !== undefined && numValue < rule.minValue) {
            errors.push({
              variableName: varName,
              type: 'validation_failed',
              severity: 'high',
              message: `${varName} must be at least ${rule.minValue}`,
              timestamp: new Date()
            });
          } else if (rule.maxValue !== undefined && numValue > rule.maxValue) {
            errors.push({
              variableName: varName,
              type: 'validation_failed',
              severity: 'high',
              message: `${varName} must be at most ${rule.maxValue}`,
              timestamp: new Date()
            });
          }
        }
        
        // Length validation
        if (rule.minLength && value.length < rule.minLength) {
          errors.push({
            variableName: varName,
            type: 'validation_failed',
            severity: 'high',
            message: `${varName} must be at least ${rule.minLength} characters long`,
            timestamp: new Date()
          });
        }
        
        // Allowed values validation
        if (rule.allowedValues && !rule.allowedValues.includes(value)) {
          errors.push({
            variableName: varName,
            type: 'validation_failed',
            severity: 'high',
            message: `${varName} must be one of: ${rule.allowedValues.join(', ')}`,
            timestamp: new Date()
          });
        }
      }
    }
    
    return errors;
  }

  async checkPolicies() {
    const violations = [];
    const envVars = process.env;
    
    // Security policies
    const securityPolicies = [
      {
        name: 'Weak Secrets',
        check: (vars) => {
          const secrets = ['JWT_SECRET', 'API_SECRET', 'SESSION_SECRET'];
          return secrets.filter(secret => {
            const value = vars[secret];
            return value && value.length < 32;
          });
        },
        message: 'Secret variables should be at least 32 characters long',
        severity: 'high'
      },
      {
        name: 'Missing Required Variables',
        check: (vars) => {
          const required = ['DATABASE_URL', 'JWT_SECRET'];
          return required.filter(req => !vars[req]);
        },
        message: 'Required environment variables are missing',
        severity: 'critical'
      },
      {
        name: 'Development Variables in Production',
        check: (vars) => {
          if (vars.NODE_ENV === 'production') {
            const devVars = ['DEBUG', 'NODE_ENV_DEBUG'];
            return devVars.filter(devVar => vars[devVar]);
          }
          return [];
        },
        message: 'Development variables should not be set in production',
        severity: 'medium'
      }
    ];
    
    // Check each policy
    for (const policy of securityPolicies) {
      const violations = policy.check(envVars);
      if (violations.length > 0) {
        violations.forEach(variable => {
          violations.push({
            policyName: policy.name,
            variableName: variable,
            severity: policy.severity,
            message: policy.message,
            timestamp: new Date()
          });
        });
      }
    }
    
    return violations;
  }

  async generateRecommendations() {
    const recommendations = [];
    const envVars = process.env;
    
    // Performance recommendations
    if (!envVars.DB_POOL_SIZE && envVars.DATABASE_URL) {
      recommendations.push({
        type: 'performance',
        title: 'Add Database Connection Pool Configuration',
        description: 'Consider adding DB_POOL_SIZE to optimize database connections',
        impact: 'medium',
        effort: 'low',
        variables: ['DB_POOL_SIZE'],
        implementation: 'Set DB_POOL_SIZE=10 in your environment configuration'
      });
    }
    
    if (!envVars.CACHE_TTL) {
      recommendations.push({
        type: 'performance',
        title: 'Add Cache TTL Configuration',
        description: 'Consider adding CACHE_TTL to improve caching performance',
        impact: 'medium',
        effort: 'low',
        variables: ['CACHE_TTL'],
        implementation: 'Set CACHE_TTL=3600 in your environment configuration'
      });
    }
    
    // Security recommendations
    const secrets = ['JWT_SECRET', 'API_SECRET', 'SESSION_SECRET'];
    const weakSecrets = secrets.filter(secret => {
      const value = envVars[secret];
      return value && value.length < 32;
    });
    
    if (weakSecrets.length > 0) {
      recommendations.push({
        type: 'security',
        title: 'Strengthen Secret Variables',
        description: `The following secrets are too weak: ${weakSecrets.join(', ')}`,
        impact: 'high',
        effort: 'medium',
        variables: weakSecrets,
        implementation: 'Generate stronger secrets with at least 32 characters'
      });
    }
    
    // Maintenance recommendations
    const unusedVars = this.findUnusedVariables();
    if (unusedVars.length > 0) {
      recommendations.push({
        type: 'maintenance',
        title: 'Clean Up Unused Variables',
        description: `The following variables appear to be unused: ${unusedVars.join(', ')}`,
        impact: 'low',
        effort: 'low',
        variables: unusedVars,
        implementation: 'Remove unused environment variables to reduce configuration complexity'
      });
    }
    
    return recommendations;
  }

  findUnusedVariables() {
    // This is a simplified check - in a real implementation, you'd cross-reference
    // with the usage scan results
    const commonVars = ['DATABASE_URL', 'JWT_SECRET', 'PORT', 'NODE_ENV'];
    const envVars = process.env;
    
    return Object.keys(envVars).filter(varName => {
      // Skip common variables and variables that are likely used
      if (commonVars.includes(varName)) return false;
      if (varName.includes('TEST_') || varName.includes('DEBUG_')) return false;
      
      // This is a simplified check - in reality, you'd check against actual usage
      return false;
    });
  }

  async autoFixErrors(errors) {
    let fixedCount = 0;
    
    for (const error of errors) {
      if (error.type === 'missing_required') {
        // Set default values for missing required variables
        const defaults = {
          'PORT': '3000',
          'NODE_ENV': 'development',
          'LOG_LEVEL': 'info'
        };
        
        if (defaults[error.variableName]) {
          process.env[error.variableName] = defaults[error.variableName];
          console.log(`🔧 Auto-fixed: ${error.variableName} = ${defaults[error.variableName]}`);
          fixedCount++;
        }
      }
    }
    
    this.stats.totalFixes += fixedCount;
    return fixedCount;
  }

  logScanResults(usage, errors, violations, recommendations) {
    const logLevel = this.config.logLevel;
    
    if (logLevel === 'info' || logLevel === 'debug') {
      console.log(`📊 Scan Results:`);
      console.log(`   • Variables used: ${usage.length}`);
      console.log(`   • Errors found: ${errors.length}`);
      console.log(`   • Policy violations: ${violations.length}`);
      console.log(`   • Recommendations: ${recommendations.length}`);
    }
    
    if (logLevel === 'debug') {
      if (errors.length > 0) {
        console.log('   Errors:');
        errors.forEach(error => {
          console.log(`     • ${error.variableName}: ${error.message}`);
        });
      }
      
      if (violations.length > 0) {
        console.log('   Violations:');
        violations.forEach(violation => {
          console.log(`     • ${violation.policyName}: ${violation.message}`);
        });
      }
    }
    
    // Alert if too many errors
    if (errors.length > this.config.alertThreshold) {
      console.warn(`⚠️ High number of environment variable errors: ${errors.length}`);
      this.emit('high_error_count', errors.length);
    }
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      protocol: this.name,
      version: this.version,
      status: this.status,
      statistics: this.stats,
      lastRun: this.lastRun,
      configuration: this.config
    };
    
    return report;
  }

  async saveReport() {
    const report = await this.generateReport();
    const reportsDir = path.join(process.cwd(), 'data', 'audits');
    
    try {
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }
      
      const reportPath = path.join(reportsDir, `env_governance_report_${Date.now()}.json`);
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      
      console.log(`📄 Environment governance report saved: ${reportPath}`);
      return reportPath;
    } catch (error) {
      console.error('❌ Failed to save report:', error);
      return null;
    }
  }

  // Protocol lifecycle methods
  async start() {
    console.log('🚀 Starting Environment Variable Governance Protocol...');
    await this.initialize();
    this.emit('started');
  }

  async stop() {
    console.log('🛑 Stopping Environment Variable Governance Protocol...');
    await this.stopMonitoring();
    this.status = 'stopped';
    this.emit('stopped');
  }

  async restart() {
    console.log('🔄 Restarting Environment Variable Governance Protocol...');
    await this.stop();
    await this.start();
  }

  getStatus() {
    return {
      name: this.name,
      version: this.version,
      status: this.status,
      lastRun: this.lastRun,
      statistics: this.stats,
      configuration: this.config
    };
  }
}

// Export the protocol
module.exports = EnvironmentVariableGovernanceProtocol;

// If run directly, start the protocol
if (require.main === module) {
  const protocol = new EnvironmentVariableGovernanceProtocol();
  
  protocol.on('initialized', () => {
    console.log('✅ Protocol initialized successfully');
  });
  
  protocol.on('scan_completed', (results) => {
    console.log(`✅ Scan completed with ${results.errors.length} errors and ${results.violations.length} violations`);
  });
  
  protocol.on('high_error_count', (count) => {
    console.warn(`⚠️ High error count detected: ${count}`);
  });
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    await protocol.stop();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    await protocol.stop();
    process.exit(0);
  });
  
  // Start the protocol
  protocol.start().catch(error => {
    console.error('❌ Failed to start protocol:', error);
    process.exit(1);
  });
} 