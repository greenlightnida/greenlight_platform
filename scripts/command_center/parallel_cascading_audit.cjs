#!/usr/bin/env node

/**
 * Command Center Integration for Parallel & Cascading Audit System
 * 
 * PURPOSE: Provides easy access to the parallel cascading audit system
 * through the command center and anchor CLI.
 * 
 * USAGE: 
 * - npm run anchor audit [--mode=full|quick|critical]
 * - node scripts/command_center/parallel_cascading_audit.cjs [--mode=full|quick|critical]
 */

const fs = require('fs');
const path = require('path');
const { ParallelCascadingAuditSystem } = require('../protocols/parallel_cascading_audit_system.cjs');

class CommandCenterAuditIntegration {
  constructor() {
    this.projectRoot = process.cwd();
    this.commandCenterDir = path.join(this.projectRoot, 'data/command_center');
    this.auditDir = path.join(this.projectRoot, 'data/audits');
  }

  async execute(args = []) {
    console.log('🔍 Command Center - Parallel & Cascading Audit Integration');
    console.log('==========================================================');
    
    try {
      // Parse arguments
      const { mode, options } = this.parseArguments(args);
      
      // Log command to command center
      await this.logCommand(mode, options);
      
      // Execute audit
      const auditSystem = new ParallelCascadingAuditSystem(mode);
      await auditSystem.execute();
      
      // Update command center with results
      await this.updateCommandCenter(auditSystem.results);
      
      // Generate summary for anchor CLI
      this.generateAnchorSummary(auditSystem.results);
      
    } catch (error) {
      console.error('❌ Command Center Audit Integration Failed:', error.message);
      await this.logError(error);
    }
  }

  parseArguments(args) {
    const mode = args.find(arg => arg.startsWith('--mode='))?.split('=')[1] || 'full';
    const options = {
      verbose: args.includes('--verbose') || args.includes('-v'),
      silent: args.includes('--silent') || args.includes('-s'),
      background: args.includes('--background') || args.includes('-b')
    };
    
    return { mode, options };
  }

  async logCommand(mode, options) {
    const commandLog = {
      timestamp: new Date().toISOString(),
      command: 'parallel_cascading_audit',
      mode,
      options,
      status: 'started'
    };
    
    const historyFile = path.join(this.commandCenterDir, 'command_history.json');
    let history = { commands: [] };
    
    if (fs.existsSync(historyFile)) {
      try {
        history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
      } catch (error) {
        console.warn('⚠️  Could not read command history, creating new one');
      }
    }
    
    history.commands.push(commandLog);
    fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
  }

  async updateCommandCenter(results) {
    // Update command history with completion
    const historyFile = path.join(this.commandCenterDir, 'command_history.json');
    if (fs.existsSync(historyFile)) {
      const history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
      const lastCommand = history.commands[history.commands.length - 1];
      if (lastCommand && lastCommand.command === 'parallel_cascading_audit') {
        lastCommand.status = 'completed';
        lastCommand.completedAt = new Date().toISOString();
        lastCommand.results = {
          auditId: results.auditId,
          overallHealth: this.calculateOverallHealth(results),
          criticalIssues: results.criticalIssues.length,
          recommendations: results.recommendations.length,
          performance: results.performance
        };
        fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
      }
    }
    
    // Create audit summary for command center
    const summary = {
      timestamp: new Date().toISOString(),
      auditId: results.auditId,
      mode: results.mode,
      overallHealth: this.calculateOverallHealth(results),
      levelHealth: Object.fromEntries(
        Object.entries(results.levels).map(([level, data]) => [level, data.overallHealth])
      ),
      criticalIssues: results.criticalIssues.length,
      recommendations: results.recommendations.length,
      performance: results.performance,
      cascadingEvents: results.cascadingEvents.length
    };
    
    const summaryFile = path.join(this.commandCenterDir, 'latest_audit_summary.json');
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
  }

  calculateOverallHealth(results) {
    const levelHealths = Object.values(results.levels).map(level => level.overallHealth);
    return Math.round(levelHealths.reduce((sum, health) => sum + health, 0) / levelHealths.length);
  }

  generateAnchorSummary(results) {
    const overallHealth = this.calculateOverallHealth(results);
    const healthEmoji = overallHealth >= 90 ? '🟢' : overallHealth >= 75 ? '🟡' : '🔴';
    
    console.log('');
    console.log('📊 Anchor CLI Summary');
    console.log('=====================');
    console.log(`${healthEmoji} Overall Health: ${overallHealth}/100`);
    console.log(`🔍 Audit ID: ${results.auditId}`);
    console.log(`⚡ Duration: ${results.performance.totalDuration}ms`);
    console.log(`🔄 Parallel Checks: ${results.performance.parallelChecks}`);
    console.log(`🌊 Cascading Checks: ${results.performance.cascadingChecks}`);
    
    if (results.criticalIssues.length > 0) {
      console.log(`🚨 Critical Issues: ${results.criticalIssues.length}`);
      results.criticalIssues.forEach(issue => {
        console.log(`   - ${issue.level}: ${issue.health}/100 health`);
      });
    }
    
    if (results.recommendations.length > 0) {
      console.log(`💡 Recommendations: ${results.recommendations.length}`);
      results.recommendations.slice(0, 3).forEach(rec => {
        console.log(`   - ${rec.recommendation}`);
      });
    }
    
    console.log('');
    console.log('📁 Reports saved to: data/audits/');
    console.log('📋 Summary saved to: data/command_center/latest_audit_summary.json');
  }

  async logError(error) {
    const errorLog = {
      timestamp: new Date().toISOString(),
      command: 'parallel_cascading_audit',
      error: error.message,
      stack: error.stack
    };
    
    const errorFile = path.join(this.commandCenterDir, 'PARALLEL_CASCADING_AUDIT_ERROR.json');
    fs.writeFileSync(errorFile, JSON.stringify(errorLog, null, 2));
    console.error(`📁 Error logged to: ${errorFile}`);
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  return args;
}

// Execute if run directly
if (require.main === module) {
  const args = parseArgs();
  const integration = new CommandCenterAuditIntegration();
  integration.execute(args);
}

module.exports = CommandCenterAuditIntegration; 