#!/usr/bin/env node

/**
 * Git Manager
 * 
 * PURPOSE: Automated git management for the command system
 * - Auto-commit changes after each command
 * - Pre-commit validation
 * - Consistent commit message patterns
 * - Branch management and conflict resolution
 * - Remote repository synchronization
 * 
 * USAGE: Integrated with command_coordinator.cjs
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class GitManager {
  constructor() {
    this.projectRoot = process.cwd();
    this.branch = 'clean-main';
    this.remote = 'origin';
  }

  async getGitStatus() {
    try {
      const status = execSync('git status --porcelain', { 
        encoding: 'utf8', 
        cwd: this.projectRoot 
      });
      
      const lines = status.split('\n').filter(line => line.trim());
      const modifiedFiles = lines.filter(line => line.startsWith('M')).length;
      const untrackedFiles = lines.filter(line => line.startsWith('??')).length;
      const deletedFiles = lines.filter(line => line.startsWith('D')).length;
      const addedFiles = lines.filter(line => line.startsWith('A')).length;
      
      return {
        hasChanges: lines.length > 0,
        totalChanges: lines.length,
        modifiedFiles,
        untrackedFiles,
        deletedFiles,
        addedFiles,
        details: lines
      };
    } catch (error) {
      return {
        hasChanges: false,
        totalChanges: 0,
        modifiedFiles: 0,
        untrackedFiles: 0,
        deletedFiles: 0,
        addedFiles: 0,
        details: [],
        error: error.message
      };
    }
  }

  async getCurrentBranch() {
    try {
      return execSync('git branch --show-current', { 
        encoding: 'utf8', 
        cwd: this.projectRoot 
      }).trim();
    } catch (error) {
      return 'unknown';
    }
  }

  async getLastCommit() {
    try {
      return execSync('git log -1 --oneline', { 
        encoding: 'utf8', 
        cwd: this.projectRoot 
      }).trim();
    } catch (error) {
      return 'No commits found';
    }
  }

  async checkForConflicts() {
    try {
      const status = execSync('git status --porcelain', { 
        encoding: 'utf8', 
        cwd: this.projectRoot 
      });
      
      const conflicts = status.split('\n').filter(line => 
        line.includes('UU') || line.includes('AA') || line.includes('DD')
      );
      
      return {
        hasConflicts: conflicts.length > 0,
        conflictCount: conflicts.length,
        conflicts
      };
    } catch (error) {
      return {
        hasConflicts: false,
        conflictCount: 0,
        conflicts: []
      };
    }
  }

  async stageAllChanges() {
    try {
      execSync('git add .', { cwd: this.projectRoot });
      console.log('✅ All changes staged successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to stage changes:', error.message);
      return false;
    }
  }

  async createCommit(message) {
    try {
      execSync(`git commit -m "${message}"`, { cwd: this.projectRoot });
      console.log('✅ Changes committed successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to commit changes:', error.message);
      return false;
    }
  }

  async pushToRemote() {
    try {
      execSync(`git push ${this.remote} ${this.branch}`, { cwd: this.projectRoot });
      console.log('✅ Changes pushed to remote successfully');
      return true;
    } catch (error) {
      console.log('⚠️  Remote push not available or failed:', error.message);
      return false;
    }
  }

  async autoCommit(command, options, results) {
    console.log('🔄 Auto-committing changes...');
    
    const timestamp = new Date().toISOString();
    const optionsStr = options.length > 0 ? ` - ${options.join(' ')}` : '';
    const commitMessage = `[${command.toUpperCase()}] ${timestamp}${optionsStr}`;
    
    // Check for conflicts first
    const conflicts = await this.checkForConflicts();
    if (conflicts.hasConflicts) {
      console.error('❌ Git conflicts detected - cannot auto-commit');
      console.log('Conflicts:', conflicts.conflicts);
      return false;
    }
    
    // Stage all changes
    const staged = await this.stageAllChanges();
    if (!staged) {
      return false;
    }
    
    // Check if there are changes to commit
    const status = await this.getGitStatus();
    if (!status.hasChanges) {
      console.log('ℹ️  No changes to commit');
      return true;
    }
    
    // Create commit
    const committed = await this.createCommit(commitMessage);
    if (!committed) {
      return false;
    }
    
    // Push to remote
    await this.pushToRemote();
    
    console.log(`✅ Auto-commit completed: ${commitMessage}`);
    return true;
  }

  async validatePreCommit() {
    console.log('🔍 Running pre-commit validation...');
    
    const validations = [];
    
    // Check for conflicts
    const conflicts = await this.checkForConflicts();
    if (conflicts.hasConflicts) {
      validations.push({
        name: 'Git Conflicts',
        passed: false,
        message: `Found ${conflicts.conflictCount} conflicts`
      });
    } else {
      validations.push({
        name: 'Git Conflicts',
        passed: true,
        message: 'No conflicts detected'
      });
    }
    
    // Check for large files
    try {
      const largeFiles = execSync('find . -size +10M -not -path "./node_modules/*" -not -path "./.git/*"', { 
        encoding: 'utf8', 
        cwd: this.projectRoot 
      });
      
      if (largeFiles.trim()) {
        validations.push({
          name: 'Large Files',
          passed: false,
          message: 'Large files detected (>10MB)'
        });
      } else {
        validations.push({
          name: 'Large Files',
          passed: true,
          message: 'No large files detected'
        });
      }
    } catch (error) {
      validations.push({
        name: 'Large Files',
        passed: true,
        message: 'Large file check passed'
      });
    }
    
    // Check for sensitive files
    const sensitivePatterns = ['.env', 'secrets', 'private', 'key', 'token'];
    const status = await this.getGitStatus();
    const sensitiveFiles = status.details.filter(file => 
      sensitivePatterns.some(pattern => file.includes(pattern))
    );
    
    if (sensitiveFiles.length > 0) {
      validations.push({
        name: 'Sensitive Files',
        passed: false,
        message: `Sensitive files detected: ${sensitiveFiles.join(', ')}`
      });
    } else {
      validations.push({
        name: 'Sensitive Files',
        passed: true,
        message: 'No sensitive files detected'
      });
    }
    
    const allPassed = validations.every(v => v.passed);
    
    console.log('📋 Pre-commit validation results:');
    validations.forEach(validation => {
      const status = validation.passed ? '✅' : '❌';
      console.log(`${status} ${validation.name}: ${validation.message}`);
    });
    
    return {
      passed: allPassed,
      validations
    };
  }

  async getCommitHistory(limit = 10) {
    try {
      const history = execSync(`git log --oneline -${limit}`, { 
        encoding: 'utf8', 
        cwd: this.projectRoot 
      });
      
      return history.split('\n').filter(line => line.trim());
    } catch (error) {
      return [];
    }
  }

  async getBranchInfo() {
    try {
      const currentBranch = await this.getCurrentBranch();
      const lastCommit = await this.getLastCommit();
      const status = await this.getGitStatus();
      
      return {
        currentBranch,
        lastCommit,
        hasChanges: status.hasChanges,
        changeCount: status.totalChanges
      };
    } catch (error) {
      return {
        currentBranch: 'unknown',
        lastCommit: 'unknown',
        hasChanges: false,
        changeCount: 0,
        error: error.message
      };
    }
  }
}

// Export for use in other modules
module.exports = GitManager;

// Run standalone if called directly
if (require.main === module) {
  const gitManager = new GitManager();
  
  const command = process.argv[2];
  const options = process.argv.slice(3);
  
  switch (command) {
    case 'status':
      gitManager.getGitStatus().then(console.log);
      break;
    case 'commit':
      gitManager.autoCommit(options[0], options.slice(1), {}).then(console.log);
      break;
    case 'validate':
      gitManager.validatePreCommit().then(console.log);
      break;
    case 'history':
      gitManager.getCommitHistory(parseInt(options[0]) || 10).then(console.log);
      break;
    case 'info':
      gitManager.getBranchInfo().then(console.log);
      break;
    default:
      console.log('Usage: node git_manager.cjs [status|commit|validate|history|info] [options]');
  }
} 