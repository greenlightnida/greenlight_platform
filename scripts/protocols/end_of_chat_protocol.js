#!/usr/bin/env node

/**
 * End of Chat Protocol
 * Handles session cleanup, context preservation, and graceful termination
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class EndOfChatProtocol {
  constructor() {
    this.projectRoot = process.cwd();
    this.sessionId = this.generateSessionId();
    this.timestamp = new Date().toISOString();
  }

  generateSessionId() {
    return `eoc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async execute() {
    console.log('🔄 [End of Chat Protocol] Starting session cleanup...');
    
    try {
      // Phase 1: Context Preservation
      await this.preserveContext();
      
      // Phase 2: Session Cleanup
      await this.cleanupSession();
      
      // Phase 3: System State Update
      await this.updateSystemState();
      
      // Phase 4: Generate Handoff Instructions
      await this.generateHandoffInstructions();
      
      console.log('✅ [End of Chat Protocol] Session cleanup completed successfully');
      return { success: true, sessionId: this.sessionId };
      
    } catch (error) {
      console.error('❌ [End of Chat Protocol] Error during cleanup:', error.message);
      return { success: false, error: error.message };
    }
  }

  async preserveContext() {
    console.log('📦 Preserving session context...');
    
    const contextData = {
      sessionId: this.sessionId,
      timestamp: this.timestamp,
      projectRoot: this.projectRoot,
      gitStatus: this.getGitStatus(),
      buildStatus: this.getBuildStatus(),
      activeProcesses: this.getActiveProcesses(),
      systemHealth: this.getSystemHealth()
    };

    const contextDir = path.join(this.projectRoot, 'data', 'context-preservation');
    if (!fs.existsSync(contextDir)) {
      fs.mkdirSync(contextDir, { recursive: true });
    }

    const contextFile = path.join(contextDir, `${this.sessionId}-context.json`);
    fs.writeFileSync(contextFile, JSON.stringify(contextData, null, 2));
    
    console.log(`✅ Context preserved: ${contextFile}`);
  }

  async cleanupSession() {
    console.log('🧹 Cleaning up session artifacts...');
    
    // Clean up temporary files
    const tempDirs = ['temp', 'tmp', '.temp'];
    for (const dir of tempDirs) {
      const tempPath = path.join(this.projectRoot, dir);
      if (fs.existsSync(tempPath)) {
        try {
          fs.rmSync(tempPath, { recursive: true, force: true });
          console.log(`✅ Cleaned: ${dir}`);
        } catch (error) {
          console.log(`⚠️ Could not clean ${dir}: ${error.message}`);
        }
      }
    }

    // Clean up log files older than 7 days
    await this.cleanupOldLogs();
  }

  async updateSystemState() {
    console.log('🔄 Updating system state...');
    
    const systemState = {
      sessionId: this.sessionId,
      timestamp: this.timestamp,
      lastCleanup: this.timestamp,
      buildStatus: this.getBuildStatus(),
      gitStatus: this.getGitStatus(),
      fileCount: this.getFileCount(),
      diskUsage: this.getDiskUsage()
    };

    const stateDir = path.join(this.projectRoot, 'data', 'system-state');
    if (!fs.existsSync(stateDir)) {
      fs.mkdirSync(stateDir, { recursive: true });
    }

    const stateFile = path.join(stateDir, `${this.sessionId}-system-state.json`);
    fs.writeFileSync(stateFile, JSON.stringify(systemState, null, 2));
    
    console.log(`✅ System state updated: ${stateFile}`);
  }

  async generateHandoffInstructions() {
    console.log('📋 Generating handoff instructions...');
    
    const instructions = {
      sessionId: this.sessionId,
      timestamp: this.timestamp,
      nextSteps: [
        'Review system state and context preservation',
        'Address any build or git issues',
        'Continue with development or deployment',
        'Run system assessment if needed'
      ],
      criticalIssues: this.getCriticalIssues(),
      recommendations: this.getRecommendations()
    };

    const transitionsDir = path.join(this.projectRoot, 'data', 'transitions');
    if (!fs.existsSync(transitionsDir)) {
      fs.mkdirSync(transitionsDir, { recursive: true });
    }

    const instructionsFile = path.join(transitionsDir, `${this.sessionId}-handoff-instructions.json`);
    fs.writeFileSync(instructionsFile, JSON.stringify(instructions, null, 2));
    
    console.log(`✅ Handoff instructions generated: ${instructionsFile}`);
  }

  getGitStatus() {
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8', cwd: this.projectRoot });
      const branch = execSync('git branch --show-current', { encoding: 'utf8', cwd: this.projectRoot });
      const lastCommit = execSync('git log -1 --oneline', { encoding: 'utf8', cwd: this.projectRoot });
      
      return {
        isClean: status.trim() === '',
        branch: branch.trim(),
        lastCommit: lastCommit.trim(),
        uncommittedChanges: status.trim().split('\n').filter(line => line.trim() !== '')
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  getBuildStatus() {
    try {
      execSync('npm run build', { stdio: 'pipe', cwd: this.projectRoot });
      return { status: 'success', timestamp: this.timestamp };
    } catch (error) {
      return { 
        status: 'failed', 
        error: error.message,
        timestamp: this.timestamp 
      };
    }
  }

  getActiveProcesses() {
    try {
      const processes = execSync('ps aux | grep -E "(node|npm|vite|tsc)" | grep -v grep', { encoding: 'utf8' });
      return processes.trim().split('\n').filter(line => line.trim() !== '');
    } catch (error) {
      return [];
    }
  }

  getSystemHealth() {
    return {
      timestamp: this.timestamp,
      fileCount: this.getFileCount(),
      diskUsage: this.getDiskUsage(),
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime()
    };
  }

  getFileCount() {
    try {
      const result = execSync('find . -type f | wc -l', { encoding: 'utf8', cwd: this.projectRoot });
      return parseInt(result.trim());
    } catch (error) {
      return 0;
    }
  }

  getDiskUsage() {
    try {
      const result = execSync('du -sh .', { encoding: 'utf8', cwd: this.projectRoot });
      return result.trim();
    } catch (error) {
      return 'unknown';
    }
  }

  async cleanupOldLogs() {
    const logDirs = ['logs', 'data/logs', '.logs'];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7);

    for (const logDir of logDirs) {
      const logPath = path.join(this.projectRoot, logDir);
      if (fs.existsSync(logPath)) {
        try {
          const files = fs.readdirSync(logPath);
          for (const file of files) {
            const filePath = path.join(logPath, file);
            const stats = fs.statSync(filePath);
            if (stats.mtime < cutoffDate) {
              fs.unlinkSync(filePath);
              console.log(`🗑️ Cleaned old log: ${file}`);
            }
          }
        } catch (error) {
          console.log(`⚠️ Could not clean logs in ${logDir}: ${error.message}`);
        }
      }
    }
  }

  getCriticalIssues() {
    const issues = [];
    
    // Check for build failures
    const buildStatus = this.getBuildStatus();
    if (buildStatus.status === 'failed') {
      issues.push('Build system is failing');
    }

    // Check for uncommitted changes
    const gitStatus = this.getGitStatus();
    if (!gitStatus.isClean) {
      issues.push('Uncommitted changes detected');
    }

    // Check for excessive file count
    const fileCount = this.getFileCount();
    if (fileCount > 50000) {
      issues.push(`Excessive file count: ${fileCount}`);
    }

    return issues;
  }

  getRecommendations() {
    const recommendations = [];
    
    const buildStatus = this.getBuildStatus();
    if (buildStatus.status === 'failed') {
      recommendations.push('Fix TypeScript compilation errors');
      recommendations.push('Resolve dependency conflicts');
    }

    const gitStatus = this.getGitStatus();
    if (!gitStatus.isClean) {
      recommendations.push('Commit or stash uncommitted changes');
    }

    const fileCount = this.getFileCount();
    if (fileCount > 50000) {
      recommendations.push('Implement file cleanup strategy');
      recommendations.push('Review and remove unnecessary files');
    }

    recommendations.push('Run system assessment for comprehensive health check');
    recommendations.push('Consider protocol refactoring to reduce complexity');

    return recommendations;
  }
}

// Execute if run directly
if (require.main === module) {
  const protocol = new EndOfChatProtocol();
  protocol.execute()
    .then(result => {
      if (result.success) {
        console.log('🎉 End of Chat Protocol completed successfully');
        process.exit(0);
      } else {
        console.error('💥 End of Chat Protocol failed');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = EndOfChatProtocol; 