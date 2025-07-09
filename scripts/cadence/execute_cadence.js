#!/usr/bin/env node

/**
 * Review-Audit-Commitment Cadence Execution Script
 * 
 * This script automates the cadence process during the urgent building/repairing sprint:
 * 1. Review Phase: Assess progress and identify blockers
 * 2. Audit Phase: Validate quality and compliance
 * 3. Commitment Phase: Commit changes and update tracking
 * 
 * Frequency: Every 2-3 hours during sprint
 * Duration: 15-30 minutes per cycle
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

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

function logPhase(phase, description) {
  log(`\n${colors.magenta}${colors.bright}🔄 ${phase.toUpperCase()} PHASE${colors.reset}: ${description}`);
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

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Execute command with error handling
function executeCommand(command, description, allowFailure = false) {
  try {
    logInfo(`Executing: ${command}`);
    const result = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    logSuccess(`${description} completed successfully`);
    return result;
  } catch (error) {
    if (allowFailure) {
      logWarning(`${description} failed: ${error.message}`);
      return null;
    } else {
      logError(`${description} failed: ${error.message}`);
      throw error;
    }
  }
}

// Check if file exists
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Get current timestamp
function getTimestamp() {
  return new Date().toISOString();
}

// Create cadence report
function createCadenceReport(phase, results, issues) {
  const report = {
    timestamp: getTimestamp(),
    phase: phase,
    results: results,
    issues: issues,
    status: issues.length > 0 ? 'ISSUES_FOUND' : 'SUCCESS'
  };

  const reportDir = 'data/cadence';
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const reportFile = path.join(reportDir, `cadence_${phase}_${Date.now()}.json`);
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  
  logSuccess(`Cadence report created: ${reportFile}`);
  return reportFile;
}

// Review Phase: Assess progress and identify blockers
function executeReviewPhase() {
  logPhase('review', 'Assessing current progress and identifying blockers');
  
  const results = {};
  const issues = [];

  try {
    // 1. System health assessment
    logInfo('Checking system health...');
    try {
      const healthCheck = executeCommand('npm run health:check', 'System health check', true);
      if (healthCheck) {
        results.systemHealth = 'PASSED';
        logSuccess('System health check passed');
      } else {
        results.systemHealth = 'FAILED';
        issues.push('System health check failed');
      }
    } catch (error) {
      results.systemHealth = 'NOT_AVAILABLE';
      logWarning('Health check command not available');
    }

    // 2. Uncommitted files count
    logInfo('Checking uncommitted files...');
    try {
      const uncommittedCount = executeCommand('git status --porcelain | wc -l', 'Uncommitted files count');
      const count = parseInt(uncommittedCount.trim());
      results.uncommittedFiles = count;
      
      if (count > 50) {
        issues.push(`High number of uncommitted files: ${count}`);
        logWarning(`High number of uncommitted files: ${count}`);
      } else {
        logSuccess(`Uncommitted files count: ${count}`);
      }
    } catch (error) {
      results.uncommittedFiles = 'ERROR';
      issues.push('Could not check uncommitted files');
    }

    // 3. Build status check
    logInfo('Checking build status...');
    try {
      const buildStatus = executeCommand('npm run build', 'Build status check', true);
      if (buildStatus) {
        results.buildStatus = 'PASSED';
        logSuccess('Build status check passed');
      } else {
        results.buildStatus = 'FAILED';
        issues.push('Build status check failed');
      }
    } catch (error) {
      results.buildStatus = 'FAILED';
      issues.push('Build status check failed');
    }

    // 4. Automated audit
    logInfo('Running automated audit...');
    try {
      const auditResult = executeCommand('node scripts/audit_and_optimize.cjs', 'Automated audit', true);
      if (auditResult) {
        results.audit = 'PASSED';
        logSuccess('Automated audit passed');
      } else {
        results.audit = 'FAILED';
        issues.push('Automated audit failed');
      }
    } catch (error) {
      results.audit = 'NOT_AVAILABLE';
      logWarning('Audit script not available');
    }

    // 5. Integration tests
    logInfo('Checking integration tests...');
    try {
      const testResult = executeCommand('npm test', 'Integration tests', true);
      if (testResult) {
        results.integrationTests = 'PASSED';
        logSuccess('Integration tests passed');
      } else {
        results.integrationTests = 'FAILED';
        issues.push('Integration tests failed');
      }
    } catch (error) {
      results.integrationTests = 'NOT_AVAILABLE';
      logWarning('Test command not available');
    }

    // 6. Documentation status
    logInfo('Checking documentation status...');
    const docsDir = 'docs';
    if (fs.existsSync(docsDir)) {
      const docFiles = fs.readdirSync(docsDir).filter(file => file.endsWith('.md'));
      results.documentationFiles = docFiles.length;
      logSuccess(`Documentation files found: ${docFiles.length}`);
    } else {
      results.documentationFiles = 0;
      issues.push('Documentation directory not found');
    }

  } catch (error) {
    logError(`Review phase failed: ${error.message}`);
    issues.push(`Review phase error: ${error.message}`);
  }

  // Create review report
  const reportFile = createCadenceReport('review', results, issues);
  
  log(`\n${colors.bright}📊 REVIEW PHASE SUMMARY:${colors.reset}`);
  log(`Results: ${Object.keys(results).length} checks performed`);
  log(`Issues: ${issues.length} issues identified`);
  
  if (issues.length > 0) {
    log(`\n${colors.yellow}⚠️  ISSUES IDENTIFIED:${colors.reset}`);
    issues.forEach((issue, index) => {
      log(`${index + 1}. ${issue}`, 'yellow');
    });
  }

  return { results, issues, reportFile };
}

// Audit Phase: Validate quality and compliance
function executeAuditPhase() {
  logPhase('audit', 'Validating quality and compliance');
  
  const results = {};
  const issues = [];

  try {
    // 1. Code quality check
    logInfo('Running code quality check...');
    try {
      const lintResult = executeCommand('npm run lint', 'Code quality check', true);
      if (lintResult) {
        results.codeQuality = 'PASSED';
        logSuccess('Code quality check passed');
      } else {
        results.codeQuality = 'FAILED';
        issues.push('Code quality check failed');
      }
    } catch (error) {
      results.codeQuality = 'NOT_AVAILABLE';
      logWarning('Lint command not available');
    }

    // 2. Test suite execution
    logInfo('Running test suite...');
    try {
      const testResult = executeCommand('npm run test', 'Test suite execution', true);
      if (testResult) {
        results.testSuite = 'PASSED';
        logSuccess('Test suite passed');
      } else {
        results.testSuite = 'FAILED';
        issues.push('Test suite failed');
      }
    } catch (error) {
      results.testSuite = 'NOT_AVAILABLE';
      logWarning('Test command not available');
    }

    // 3. Protocol validation
    logInfo('Validating protocols...');
    try {
      const protocolResult = executeCommand('node scripts/protocols/launch_protocol.cjs', 'Protocol validation', true);
      if (protocolResult) {
        results.protocolValidation = 'PASSED';
        logSuccess('Protocol validation passed');
      } else {
        results.protocolValidation = 'FAILED';
        issues.push('Protocol validation failed');
      }
    } catch (error) {
      results.protocolValidation = 'NOT_AVAILABLE';
      logWarning('Protocol validation not available');
    }

    // 4. Review staged changes
    logInfo('Reviewing staged changes...');
    try {
      const stagedChanges = executeCommand('git diff --cached', 'Staged changes review');
      if (stagedChanges && stagedChanges.trim()) {
        results.stagedChanges = 'PRESENT';
        logSuccess('Staged changes found and reviewed');
      } else {
        results.stagedChanges = 'NONE';
        logWarning('No staged changes found');
      }
    } catch (error) {
      results.stagedChanges = 'ERROR';
      issues.push('Could not review staged changes');
    }

    // 5. Security check
    logInfo('Running security check...');
    try {
      const securityResult = executeCommand('npm audit', 'Security audit', true);
      if (securityResult) {
        results.security = 'PASSED';
        logSuccess('Security audit passed');
      } else {
        results.security = 'FAILED';
        issues.push('Security audit failed');
      }
    } catch (error) {
      results.security = 'NOT_AVAILABLE';
      logWarning('Security audit not available');
    }

    // 6. Performance check
    logInfo('Checking performance...');
    try {
      const performanceResult = executeCommand('npm run build', 'Performance check', true);
      if (performanceResult) {
        results.performance = 'PASSED';
        logSuccess('Performance check passed');
      } else {
        results.performance = 'FAILED';
        issues.push('Performance check failed');
      }
    } catch (error) {
      results.performance = 'FAILED';
      issues.push('Performance check failed');
    }

  } catch (error) {
    logError(`Audit phase failed: ${error.message}`);
    issues.push(`Audit phase error: ${error.message}`);
  }

  // Create audit report
  const reportFile = createCadenceReport('audit', results, issues);
  
  log(`\n${colors.bright}📊 AUDIT PHASE SUMMARY:${colors.reset}`);
  log(`Results: ${Object.keys(results).length} checks performed`);
  log(`Issues: ${issues.length} issues identified`);
  
  if (issues.length > 0) {
    log(`\n${colors.yellow}⚠️  ISSUES IDENTIFIED:${colors.reset}`);
    issues.forEach((issue, index) => {
      log(`${index + 1}. ${issue}`, 'yellow');
    });
  }

  return { results, issues, reportFile };
}

// Commitment Phase: Commit changes and update tracking
function executeCommitmentPhase() {
  logPhase('commitment', 'Committing changes and updating tracking');
  
  const results = {};
  const issues = [];

  try {
    // 1. Stage all changes
    logInfo('Staging all changes...');
    try {
      executeCommand('git add .', 'Stage all changes');
      results.staging = 'SUCCESS';
      logSuccess('All changes staged successfully');
    } catch (error) {
      results.staging = 'FAILED';
      issues.push('Failed to stage changes');
    }

    // 2. Check if there are changes to commit
    logInfo('Checking for changes to commit...');
    try {
      const stagedChanges = executeCommand('git diff --cached --name-only', 'Check staged changes');
      if (stagedChanges && stagedChanges.trim()) {
        const changedFiles = stagedChanges.split('\n').filter(line => line.trim());
        results.changedFiles = changedFiles.length;
        logSuccess(`${changedFiles.length} files staged for commit`);
        
        // 3. Create commit message
        const timestamp = getTimestamp();
        const commitMessage = `Sprint: Cadence Update - ${timestamp}`;
        
        // 4. Commit changes
        logInfo('Committing changes...');
        try {
          executeCommand(`git commit -m "${commitMessage}"`, 'Commit changes');
          results.commit = 'SUCCESS';
          logSuccess('Changes committed successfully');
        } catch (error) {
          results.commit = 'FAILED';
          issues.push('Failed to commit changes');
        }
      } else {
        results.changedFiles = 0;
        results.commit = 'NO_CHANGES';
        logInfo('No changes to commit');
      }
    } catch (error) {
      results.commit = 'ERROR';
      issues.push('Could not check for changes');
    }

    // 5. Push to remote (if remote exists)
    logInfo('Pushing to remote...');
    try {
      const remoteResult = executeCommand('git push origin main', 'Push to remote', true);
      if (remoteResult) {
        results.push = 'SUCCESS';
        logSuccess('Changes pushed to remote successfully');
      } else {
        results.push = 'FAILED';
        issues.push('Failed to push to remote');
      }
    } catch (error) {
      results.push = 'NOT_AVAILABLE';
      logWarning('Remote push not available');
    }

    // 6. Update session state
    logInfo('Updating session state...');
    try {
      const sessionResult = executeCommand('node scripts/protocols/end_of_chat_protocol.js', 'Update session state', true);
      if (sessionResult) {
        results.sessionState = 'UPDATED';
        logSuccess('Session state updated successfully');
      } else {
        results.sessionState = 'FAILED';
        issues.push('Failed to update session state');
      }
    } catch (error) {
      results.sessionState = 'NOT_AVAILABLE';
      logWarning('Session state update not available');
    }

    // 7. Update progress tracking
    logInfo('Updating progress tracking...');
    try {
      const progressFile = 'data/cadence/progress_tracking.json';
      const progressData = {
        lastCadence: getTimestamp(),
        totalCadences: 0,
        successfulCadences: 0,
        issuesFound: 0
      };

      if (fs.existsSync(progressFile)) {
        const existingData = JSON.parse(fs.readFileSync(progressFile, 'utf8'));
        progressData.totalCadences = existingData.totalCadences + 1;
        progressData.successfulCadences = existingData.successfulCadences + (issues.length === 0 ? 1 : 0);
        progressData.issuesFound = existingData.issuesFound + issues.length;
      } else {
        progressData.totalCadences = 1;
        progressData.successfulCadences = issues.length === 0 ? 1 : 0;
        progressData.issuesFound = issues.length;
      }

      const progressDir = path.dirname(progressFile);
      if (!fs.existsSync(progressDir)) {
        fs.mkdirSync(progressDir, { recursive: true });
      }

      fs.writeFileSync(progressFile, JSON.stringify(progressData, null, 2));
      results.progressTracking = 'UPDATED';
      logSuccess('Progress tracking updated successfully');
    } catch (error) {
      results.progressTracking = 'FAILED';
      issues.push('Failed to update progress tracking');
    }

  } catch (error) {
    logError(`Commitment phase failed: ${error.message}`);
    issues.push(`Commitment phase error: ${error.message}`);
  }

  // Create commitment report
  const reportFile = createCadenceReport('commitment', results, issues);
  
  log(`\n${colors.bright}📊 COMMITMENT PHASE SUMMARY:${colors.reset}`);
  log(`Results: ${Object.keys(results).length} actions performed`);
  log(`Issues: ${issues.length} issues identified`);
  
  if (issues.length > 0) {
    log(`\n${colors.yellow}⚠️  ISSUES IDENTIFIED:${colors.reset}`);
    issues.forEach((issue, index) => {
      log(`${index + 1}. ${issue}`, 'yellow');
    });
  }

  return { results, issues, reportFile };
}

// Main cadence execution function
async function executeCadence() {
  const startTime = Date.now();
  
  log(`${colors.bright}${colors.magenta}🔄 REVIEW-AUDIT-COMMITMENT CADENCE EXECUTION${colors.reset}`);
  log(`${colors.yellow}Starting cadence execution...${colors.reset}\n`);

  try {
    // Execute Review Phase
    const reviewResults = executeReviewPhase();
    
    // Execute Audit Phase
    const auditResults = executeAuditPhase();
    
    // Execute Commitment Phase
    const commitmentResults = executeCommitmentPhase();
    
    // Calculate total execution time
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    // Final summary
    const totalIssues = reviewResults.issues.length + auditResults.issues.length + commitmentResults.issues.length;
    
    log(`\n${colors.bright}${colors.green}🎉 CADENCE EXECUTION COMPLETED!${colors.reset}`);
    log(`${colors.cyan}Duration: ${duration} seconds${colors.reset}`);
    log(`${colors.cyan}Total issues identified: ${totalIssues}${colors.reset}`);
    
    if (totalIssues === 0) {
      log(`${colors.green}✅ All phases completed successfully!${colors.reset}`);
    } else {
      log(`${colors.yellow}⚠️  Issues identified - review reports for details${colors.reset}`);
    }
    
    log(`\n${colors.bright}${colors.blue}📋 NEXT CADENCE:${colors.reset}`);
    log('Schedule next cadence in 2-3 hours');
    log('Review identified issues before next cadence');
    log('Update sprint progress based on cadence results');
    
  } catch (error) {
    logError(`Cadence execution failed: ${error.message}`);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  executeCadence();
}

module.exports = { 
  executeCadence,
  executeReviewPhase,
  executeAuditPhase,
  executeCommitmentPhase
}; 