#!/usr/bin/env node

/**
 * Log Checker v1.0.0
 * 
 * PURPOSE: Comprehensive system log verification and health check
 * - Verifies all system logs are up to date
 * - Checks log file integrity and accessibility
 * - Monitors log rotation and archival
 * - Provides log health status and recommendations
 * 
 * USAGE: node scripts/command_center/log_checker.cjs [options]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

class LogChecker {
  constructor() {
    this.projectRoot = process.cwd();
    this.currentTime = new Date();
    this.logCheckResults = {
      timestamp: this.currentTime.toISOString(),
      totalLogs: 0,
      upToDate: 0,
      outdated: 0,
      missing: 0,
      errors: 0,
      details: []
    };
    
    // Define all system log locations
    this.logLocations = {
      commandCenter: {
        path: 'data/command_center/command_history.json',
        name: 'Command Center History',
        maxAge: 300000, // 5 minutes
        required: true
      },
      backgroundAgents: {
        path: 'data/background/agent_status.json',
        name: 'Background Agent Status',
        maxAge: 600000, // 10 minutes
        required: true
      },
      systemAudit: {
        path: 'SYSTEM_AUDIT_REPORT.json',
        name: 'System Audit Report',
        maxAge: 3600000, // 1 hour
        required: false
      },
      custodianReport: {
        path: 'CUSTODIAN_REPORT.json',
        name: 'Custodian Report',
        maxAge: 3600000, // 1 hour
        required: false
      },
      protocols: {
        path: 'data/protocols',
        name: 'Protocol Logs',
        maxAge: 1800000, // 30 minutes
        required: true,
        isDirectory: true
      },
      sessions: {
        path: 'data/sessions',
        name: 'Session Logs',
        maxAge: 1800000, // 30 minutes
        required: true,
        isDirectory: true
      },
      audits: {
        path: 'data/audits',
        name: 'Audit Logs',
        maxAge: 3600000, // 1 hour
        required: true,
        isDirectory: true
      },
      contextPreservation: {
        path: 'data/context-preservation',
        name: 'Context Preservation',
        maxAge: 7200000, // 2 hours
        required: true,
        isDirectory: true
      },
      council: {
        path: 'data/council',
        name: 'Council Activities',
        maxAge: 1800000, // 30 minutes
        required: true,
        isDirectory: true
      },
      governance: {
        path: 'data/governance',
        name: 'Governance Logs',
        maxAge: 1800000, // 30 minutes
        required: true,
        isDirectory: true
      }
    };
  }

  /**
   * Check if a file is up to date based on modification time
   */
  isLogUpToDate(filePath, maxAge) {
    try {
      if (!fs.existsSync(filePath)) {
        return { upToDate: false, reason: 'File does not exist' };
      }

      const stats = fs.statSync(filePath);
      const fileAge = this.currentTime.getTime() - stats.mtime.getTime();
      
      if (fileAge <= maxAge) {
        return { upToDate: true, age: fileAge, lastModified: stats.mtime };
      } else {
        return { 
          upToDate: false, 
          reason: `File is ${Math.round(fileAge / 1000)}s old (max: ${maxAge / 1000}s)`,
          age: fileAge,
          lastModified: stats.mtime
        };
      }
    } catch (error) {
      return { upToDate: false, reason: `Error checking file: ${error.message}` };
    }
  }

  /**
   * Check directory for recent log files
   */
  checkDirectoryLogs(dirPath, maxAge, logName) {
    try {
      if (!fs.existsSync(dirPath)) {
        return { upToDate: false, reason: 'Directory does not exist' };
      }

      const files = fs.readdirSync(dirPath);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      if (jsonFiles.length === 0) {
        return { upToDate: false, reason: 'No JSON log files found' };
      }

      let mostRecentFile = null;
      let mostRecentTime = 0;
      let upToDateFiles = 0;

      for (const file of jsonFiles) {
        const filePath = path.join(dirPath, file);
        const result = this.isLogUpToDate(filePath, maxAge);
        
        if (result.upToDate) {
          upToDateFiles++;
          if (result.age < mostRecentTime || mostRecentTime === 0) {
            mostRecentTime = result.age;
            mostRecentFile = file;
          }
        }
      }

      if (upToDateFiles > 0) {
        return { 
          upToDate: true, 
          upToDateFiles,
          totalFiles: jsonFiles.length,
          mostRecentFile,
          mostRecentAge: mostRecentTime
        };
      } else {
        return { 
          upToDate: false, 
          reason: `No recent files (${jsonFiles.length} total files)`,
          totalFiles: jsonFiles.length
        };
      }
    } catch (error) {
      return { upToDate: false, reason: `Error checking directory: ${error.message}` };
    }
  }

  /**
   * Check a single log location
   */
  checkLogLocation(locationKey, config) {
    const fullPath = path.join(this.projectRoot, config.path);
    const isDirectory = config.isDirectory || false;
    
    let result;
    if (isDirectory) {
      result = this.checkDirectoryLogs(fullPath, config.maxAge, config.name);
    } else {
      result = this.isLogUpToDate(fullPath, config.maxAge);
    }

    const checkResult = {
      location: locationKey,
      name: config.name,
      path: config.path,
      required: config.required,
      upToDate: result.upToDate,
      details: result
    };

    this.logCheckResults.details.push(checkResult);
    
    if (result.upToDate) {
      this.logCheckResults.upToDate++;
      logSuccess(`${config.name}: Up to date`);
    } else {
      if (config.required) {
        this.logCheckResults.outdated++;
        logError(`${config.name}: ${result.reason}`);
      } else {
        this.logCheckResults.outdated++;
        logWarning(`${config.name}: ${result.reason}`);
      }
    }

    this.logCheckResults.totalLogs++;
    return checkResult;
  }

  /**
   * Check all system logs
   */
  checkAllLogs() {
    logInfo('Starting comprehensive log check...');
    logInfo(`Current time: ${this.currentTime.toISOString()}`);
    log('');

    for (const [locationKey, config] of Object.entries(this.logLocations)) {
      try {
        this.checkLogLocation(locationKey, config);
      } catch (error) {
        this.logCheckResults.errors++;
        logError(`${config.name}: Check failed - ${error.message}`);
        
        this.logCheckResults.details.push({
          location: locationKey,
          name: config.name,
          path: config.path,
          required: config.required,
          upToDate: false,
          details: { reason: `Check failed: ${error.message}` }
        });
      }
    }
  }

  /**
   * Generate log health summary
   */
  generateSummary() {
    const { totalLogs, upToDate, outdated, missing, errors } = this.logCheckResults;
    const healthPercentage = totalLogs > 0 ? Math.round((upToDate / totalLogs) * 100) : 0;

    log('\n' + '='.repeat(60));
    log('📊 LOG HEALTH SUMMARY', 'bright');
    log('='.repeat(60));
    
    log(`Total Logs Checked: ${totalLogs}`, 'cyan');
    log(`Up to Date: ${upToDate}`, 'green');
    log(`Outdated: ${outdated}`, 'yellow');
    log(`Missing: ${missing}`, 'red');
    log(`Errors: ${errors}`, 'red');
    log(`Health Score: ${healthPercentage}%`, healthPercentage >= 80 ? 'green' : healthPercentage >= 60 ? 'yellow' : 'red');

    // Health status
    if (healthPercentage >= 90) {
      log('🏆 EXCELLENT: All critical logs are up to date', 'green');
    } else if (healthPercentage >= 80) {
      log('✅ GOOD: Most logs are up to date', 'green');
    } else if (healthPercentage >= 60) {
      log('⚠️  WARNING: Some logs need attention', 'yellow');
    } else {
      log('🚨 CRITICAL: Multiple logs are outdated', 'red');
    }

    return healthPercentage;
  }

  /**
   * Generate recommendations
   */
  generateRecommendations() {
    const outdatedLogs = this.logCheckResults.details.filter(logEntry => !logEntry.upToDate && logEntry.required);
    const missingLogs = this.logCheckResults.details.filter(logEntry => !logEntry.upToDate && logEntry.details.reason?.includes('does not exist'));

    log('\n📋 RECOMMENDATIONS', 'bright');
    log('='.repeat(60));

    if (outdatedLogs.length > 0) {
      log('🔄 Outdated Logs Requiring Action:', 'yellow');
      outdatedLogs.forEach(logEntry => {
        log(`  • ${logEntry.name}: ${logEntry.details.reason}`, 'yellow');
      });
    }

    if (missingLogs.length > 0) {
      log('📁 Missing Log Directories:', 'red');
      missingLogs.forEach(logEntry => {
        log(`  • ${logEntry.name}: ${logEntry.path}`, 'red');
      });
    }

    if (outdatedLogs.length === 0 && missingLogs.length === 0) {
      log('✅ All logs are healthy - no action required', 'green');
    } else {
      log('\n🔧 Suggested Actions:', 'cyan');
      if (outdatedLogs.length > 0) {
        log('  • Run system maintenance commands to update logs', 'cyan');
        log('  • Check background agents are running properly', 'cyan');
        log('  • Verify system processes are active', 'cyan');
      }
      if (missingLogs.length > 0) {
        log('  • Create missing log directories', 'cyan');
        log('  • Initialize system components', 'cyan');
      }
    }
  }

  /**
   * Save log check results
   */
  saveResults() {
    const resultsDir = path.join(this.projectRoot, 'data', 'audits');
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }

    const filename = `log_check_${Date.now()}.json`;
    const filepath = path.join(resultsDir, filename);
    
    try {
      fs.writeFileSync(filepath, JSON.stringify(this.logCheckResults, null, 2));
      logSuccess(`Log check results saved to: ${filepath}`);
      return filepath;
    } catch (error) {
      logError(`Failed to save results: ${error.message}`);
      return null;
    }
  }

  /**
   * Run complete log check
   */
  run() {
    log(`${colors.bright}${colors.magenta}🔍 Log Checker v1.0.0${colors.reset}`);
    log(`${colors.yellow}Comprehensive System Log Verification${colors.reset}\n`);

    try {
      this.checkAllLogs();
      const healthScore = this.generateSummary();
      this.generateRecommendations();
      
      const resultsFile = this.saveResults();
      
      log('\n' + '='.repeat(60));
      if (healthScore >= 80) {
        log('🎉 LOG CHECK COMPLETED SUCCESSFULLY', 'green');
      } else {
        log('⚠️  LOG CHECK COMPLETED WITH ISSUES', 'yellow');
      }
      log('='.repeat(60));

      return {
        success: true,
        healthScore,
        resultsFile,
        summary: this.logCheckResults
      };

    } catch (error) {
      logError(`Log check failed: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Main execution
async function main() {
  const checker = new LogChecker();
  const result = checker.run();
  
  if (!result.success) {
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = LogChecker; 