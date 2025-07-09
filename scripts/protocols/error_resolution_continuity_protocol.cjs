#!/usr/bin/env node

/**
 * Error Resolution Continuity Protocol
 * Handles chat context expiration during ongoing error resolution
 * Ensures seamless continuation of error fixing across sessions
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ErrorResolutionContinuity {
  constructor() {
    this.projectRoot = process.cwd();
    this.errorStateFile = path.join(this.projectRoot, 'data/error_resolution_state.json');
    this.continuityLogFile = path.join(this.projectRoot, 'data/error_continuity_log.json');
    this.sessionId = `error-continuity-${Date.now()}`;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '✅';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async initialize() {
    this.log('Initializing Error Resolution Continuity Protocol...', 'info');
    
    // Ensure data directory exists
    const dataDir = path.join(this.projectRoot, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Initialize error state if it doesn't exist
    if (!fs.existsSync(this.errorStateFile)) {
      await this.createInitialErrorState();
    }

    // Initialize continuity log if it doesn't exist
    if (!fs.existsSync(this.continuityLogFile)) {
      await this.createInitialContinuityLog();
    }
  }

  async createInitialErrorState() {
    const initialState = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      status: 'idle',
      currentErrors: [],
      resolvedErrors: [],
      pendingFixes: [],
      errorCategories: {
        typescript: [],
        lint: [],
        build: [],
        runtime: [],
        dependency: []
      },
      resolutionProgress: {
        totalErrors: 0,
        resolvedCount: 0,
        inProgressCount: 0,
        failedCount: 0
      },
      lastBuildStatus: null,
      lastErrorCheck: null,
      continuitySession: null
    };

    fs.writeFileSync(this.errorStateFile, JSON.stringify(initialState, null, 2));
    this.log('Initial error state created', 'info');
  }

  async createInitialContinuityLog() {
    const initialLog = {
      sessions: [],
      lastSessionId: null,
      continuityCount: 0,
      totalErrorsResolved: 0,
      averageResolutionTime: 0
    };

    fs.writeFileSync(this.continuityLogFile, JSON.stringify(initialLog, null, 2));
    this.log('Initial continuity log created', 'info');
  }

  async detectCurrentErrors() {
    this.log('Detecting current errors...', 'info');
    
    const errors = {
      typescript: [],
      lint: [],
      build: [],
      runtime: [],
      dependency: []
    };

    try {
      // Check TypeScript errors
      try {
        execSync('npx tsc --noEmit', { stdio: 'pipe' });
        this.log('No TypeScript errors detected', 'info');
      } catch (tsError) {
        const tsOutput = tsError.stdout?.toString() || tsError.stderr?.toString() || '';
        errors.typescript = this.parseTypeScriptErrors(tsOutput);
        this.log(`Detected ${errors.typescript.length} TypeScript errors`, 'warning');
      }

      // Check lint errors
      try {
        execSync('npm run lint', { stdio: 'pipe' });
        this.log('No lint errors detected', 'info');
      } catch (lintError) {
        const lintOutput = lintError.stdout?.toString() || lintError.stderr?.toString() || '';
        errors.lint = this.parseLintErrors(lintOutput);
        this.log(`Detected ${errors.lint.length} lint errors`, 'warning');
      }

      // Check build errors
      try {
        execSync('npm run build', { stdio: 'pipe' });
        this.log('No build errors detected', 'info');
      } catch (buildError) {
        const buildOutput = buildError.stdout?.toString() || buildError.stderr?.toString() || '';
        errors.build = this.parseBuildErrors(buildOutput);
        this.log(`Detected ${errors.build.length} build errors`, 'warning');
      }

    } catch (error) {
      this.log(`Error detection failed: ${error.message}`, 'error');
    }

    return errors;
  }

  parseTypeScriptErrors(output) {
    const errors = [];
    const lines = output.split('\n');
    
    for (const line of lines) {
      if (line.includes('error TS')) {
        const match = line.match(/([^:]+):(\d+):(\d+)\s*-\s*error\s+TS\d+:\s*(.+)/);
        if (match) {
          errors.push({
            file: match[1],
            line: parseInt(match[2]),
            column: parseInt(match[3]),
            message: match[4].trim(),
            type: 'typescript',
            severity: 'error'
          });
        }
      }
    }
    
    return errors;
  }

  parseLintErrors(output) {
    const errors = [];
    const lines = output.split('\n');
    
    for (const line of lines) {
      if (line.includes('error') || line.includes('warning')) {
        const match = line.match(/([^:]+):(\d+):(\d+)\s*-\s*(error|warning)\s+(.+)/);
        if (match) {
          errors.push({
            file: match[1],
            line: parseInt(match[2]),
            column: parseInt(match[3]),
            message: match[5].trim(),
            type: 'lint',
            severity: match[4]
          });
        }
      }
    }
    
    return errors;
  }

  parseBuildErrors(output) {
    const errors = [];
    const lines = output.split('\n');
    
    for (const line of lines) {
      if (line.includes('error') || line.includes('failed')) {
        errors.push({
          message: line.trim(),
          type: 'build',
          severity: 'error',
          timestamp: new Date().toISOString()
        });
      }
    }
    
    return errors;
  }

  async updateErrorState(currentErrors) {
    const state = JSON.parse(fs.readFileSync(this.errorStateFile, 'utf8'));
    
    // Update current errors
    state.currentErrors = [
      ...currentErrors.typescript,
      ...currentErrors.lint,
      ...currentErrors.build,
      ...currentErrors.runtime,
      ...currentErrors.dependency
    ];

    // Update error categories
    state.errorCategories = currentErrors;

    // Update progress
    state.resolutionProgress = {
      totalErrors: state.currentErrors.length,
      resolvedCount: state.resolvedErrors.length,
      inProgressCount: state.pendingFixes.length,
      failedCount: 0
    };

    state.lastErrorCheck = new Date().toISOString();
    state.sessionId = this.sessionId;

    fs.writeFileSync(this.errorStateFile, JSON.stringify(state, null, 2));
    this.log(`Error state updated: ${state.currentErrors.length} current errors`, 'info');
  }

  async checkForContinuity() {
    this.log('Checking for error resolution continuity...', 'info');
    
    const state = JSON.parse(fs.readFileSync(this.errorStateFile, 'utf8'));
    const continuityLog = JSON.parse(fs.readFileSync(this.continuityLogFile, 'utf8'));

    // Check if there's an ongoing error resolution session
    if (state.status === 'in_progress' && state.pendingFixes.length > 0) {
      this.log('Found ongoing error resolution session', 'warning');
      
      // Create continuity session
      const continuitySession = {
        sessionId: this.sessionId,
        previousSessionId: state.sessionId,
        timestamp: new Date().toISOString(),
        pendingFixes: state.pendingFixes,
        currentErrors: state.currentErrors,
        resolvedErrors: state.resolvedErrors
      };

      state.continuitySession = continuitySession;
      state.status = 'continuity_required';
      
      fs.writeFileSync(this.errorStateFile, JSON.stringify(state, null, 2));
      
      // Update continuity log
      continuityLog.sessions.push(continuitySession);
      continuityLog.lastSessionId = this.sessionId;
      continuityLog.continuityCount++;
      
      fs.writeFileSync(this.continuityLogFile, JSON.stringify(continuityLog, null, 2));
      
      return continuitySession;
    }

    return null;
  }

  async generateContinuityReport() {
    const state = JSON.parse(fs.readFileSync(this.errorStateFile, 'utf8'));
    const continuityLog = JSON.parse(fs.readFileSync(this.continuityLogFile, 'utf8'));

    const report = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      currentStatus: state.status,
      errorSummary: {
        total: state.currentErrors.length,
        byType: {
          typescript: state.errorCategories.typescript.length,
          lint: state.errorCategories.lint.length,
          build: state.errorCategories.build.length,
          runtime: state.errorCategories.runtime.length,
          dependency: state.errorCategories.dependency.length
        }
      },
      progress: state.resolutionProgress,
      continuity: {
        hasContinuitySession: !!state.continuitySession,
        previousSessionId: state.continuitySession?.previousSessionId,
        pendingFixes: state.pendingFixes.length,
        resolvedInPreviousSession: state.resolvedErrors.length
      },
      recommendations: this.generateRecommendations(state, continuityLog)
    };

    return report;
  }

  generateRecommendations(state, continuityLog) {
    const recommendations = [];

    if (state.currentErrors.length > 0) {
      recommendations.push({
        priority: 'high',
        action: 'resume_error_resolution',
        description: `Resume fixing ${state.currentErrors.length} current errors`,
        details: {
          typescript: state.errorCategories.typescript.length,
          lint: state.errorCategories.lint.length,
          build: state.errorCategories.build.length
        }
      });
    }

    if (state.continuitySession) {
      recommendations.push({
        priority: 'high',
        action: 'continue_previous_session',
        description: 'Continue error resolution from previous session',
        details: {
          pendingFixes: state.pendingFixes.length,
          previousSessionId: state.continuitySession.previousSessionId
        }
      });
    }

    if (state.errorCategories.typescript.length > 10) {
      recommendations.push({
        priority: 'medium',
        action: 'focus_typescript_errors',
        description: 'Focus on TypeScript errors first as they block compilation',
        details: {
          count: state.errorCategories.typescript.length
        }
      });
    }

    if (state.errorCategories.build.length > 0) {
      recommendations.push({
        priority: 'high',
        action: 'fix_build_errors',
        description: 'Fix build errors to enable development',
        details: {
          count: state.errorCategories.build.length
        }
      });
    }

    return recommendations;
  }

  async startErrorResolution() {
    this.log('Starting error resolution process...', 'info');
    
    const state = JSON.parse(fs.readFileSync(this.errorStateFile, 'utf8'));
    state.status = 'in_progress';
    state.sessionId = this.sessionId;
    
    fs.writeFileSync(this.errorStateFile, JSON.stringify(state, null, 2));
    
    this.log('Error resolution started', 'info');
  }

  async markErrorResolved(errorId, resolution) {
    const state = JSON.parse(fs.readFileSync(this.errorStateFile, 'utf8'));
    
    // Find and remove error from current errors
    const errorIndex = state.currentErrors.findIndex(e => e.id === errorId);
    if (errorIndex !== -1) {
      const resolvedError = state.currentErrors.splice(errorIndex, 1)[0];
      resolvedError.resolvedAt = new Date().toISOString();
      resolvedError.resolution = resolution;
      resolvedError.resolvedBy = this.sessionId;
      
      state.resolvedErrors.push(resolvedError);
      state.resolutionProgress.resolvedCount++;
      state.resolutionProgress.totalErrors = state.currentErrors.length;
      
      fs.writeFileSync(this.errorStateFile, JSON.stringify(state, null, 2));
      
      this.log(`Error resolved: ${resolvedError.message}`, 'info');
      return resolvedError;
    }
    
    return null;
  }

  async addPendingFix(errorId, fixPlan) {
    const state = JSON.parse(fs.readFileSync(this.errorStateFile, 'utf8'));
    
    const pendingFix = {
      id: `fix-${Date.now()}`,
      errorId,
      fixPlan,
      status: 'pending',
      createdAt: new Date().toISOString(),
      sessionId: this.sessionId
    };
    
    state.pendingFixes.push(pendingFix);
    state.resolutionProgress.inProgressCount++;
    
    fs.writeFileSync(this.errorStateFile, JSON.stringify(state, null, 2));
    
    this.log(`Pending fix added: ${fixPlan}`, 'info');
    return pendingFix;
  }

  async completeErrorResolution() {
    this.log('Completing error resolution process...', 'info');
    
    const state = JSON.parse(fs.readFileSync(this.errorStateFile, 'utf8'));
    state.status = 'completed';
    state.completedAt = new Date().toISOString();
    
    // Update continuity log
    const continuityLog = JSON.parse(fs.readFileSync(this.continuityLogFile, 'utf8'));
    continuityLog.totalErrorsResolved += state.resolvedErrors.length;
    
    fs.writeFileSync(this.errorStateFile, JSON.stringify(state, null, 2));
    fs.writeFileSync(this.continuityLogFile, JSON.stringify(continuityLog, null, 2));
    
    this.log('Error resolution completed', 'info');
  }

  async runContinuityCheck() {
    await this.initialize();
    
    // Check for ongoing error resolution
    const continuitySession = await this.checkForContinuity();
    
    // Detect current errors
    const currentErrors = await this.detectCurrentErrors();
    
    // Update error state
    await this.updateErrorState(currentErrors);
    
    // Generate continuity report
    const report = await this.generateContinuityReport();
    
    // If there are errors and no continuity session, start resolution
    if (currentErrors.typescript.length > 0 || currentErrors.build.length > 0) {
      if (!continuitySession) {
        await this.startErrorResolution();
      }
    }
    
    return {
      continuitySession,
      currentErrors,
      report
    };
  }
}

// CLI entry point
if (require.main === module) {
  const continuity = new ErrorResolutionContinuity();
  continuity.runContinuityCheck().then(result => {
    console.log('\n=== ERROR RESOLUTION CONTINUITY REPORT ===');
    console.log(JSON.stringify(result.report, null, 2));
    
    if (result.continuitySession) {
      console.log('\n🚨 CONTINUITY SESSION DETECTED');
      console.log('Previous session was interrupted during error resolution');
      console.log('Resume error fixing with the pending fixes from the previous session');
    }
    
    if (result.currentErrors.typescript.length > 0 || result.currentErrors.build.length > 0) {
      console.log('\n🔧 ERRORS DETECTED - RESOLUTION REQUIRED');
      console.log(`TypeScript: ${result.currentErrors.typescript.length}`);
      console.log(`Build: ${result.currentErrors.build.length}`);
      console.log(`Lint: ${result.currentErrors.lint.length}`);
    }
    
    process.exit(0);
  }).catch(err => {
    console.error('Error Resolution Continuity Protocol failed:', err);
    process.exit(1);
  });
}

module.exports = ErrorResolutionContinuity; 