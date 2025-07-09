#!/usr/bin/env node

/**
 * Wrap Annihilate Protocol
 * Companion to launch_annihilate_protocol.cjs
 * 
 * Captures current execution state and prepares for seamless transition
 * to new chat session with full context restoration
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const PROTOCOL_NAME = 'wrap_annihilate';
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-');
const SESSION_ID = `wrap-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Paths
const DATA_DIR = path.join(__dirname, '../../data');
const SESSIONS_DIR = path.join(DATA_DIR, 'sessions');
const TRANSITIONS_DIR = path.join(DATA_DIR, 'transitions');
const SYSTEM_STATE_DIR = path.join(DATA_DIR, 'system-state');
const CONTEXT_DIR = path.join(DATA_DIR, 'context-preservation');

// Ensure directories exist
[TRANSITIONS_DIR, SYSTEM_STATE_DIR, CONTEXT_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/**
 * Capture current system state
 */
function captureSystemState() {
  console.log('🔍 Capturing system state...');
  
  const state = {
    timestamp: new Date().toISOString(),
    sessionId: SESSION_ID,
    protocol: PROTOCOL_NAME,
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      cwd: process.cwd()
    },
    system: {
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      pid: process.pid
    }
  };

  // Capture git state
  try {
    state.git = {
      branch: execSync('git branch --show-current', { encoding: 'utf8' }).trim(),
      commit: execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim(),
      status: execSync('git status --porcelain', { encoding: 'utf8' }).trim()
    };
  } catch (error) {
    state.git = { error: error.message };
  }

  // Capture package states
  try {
    const rootPackage = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf8'));
    const backendPackage = JSON.parse(fs.readFileSync(path.join(__dirname, '../../backend/package.json'), 'utf8'));
    const frontendPackage = JSON.parse(fs.readFileSync(path.join(__dirname, '../../frontend/package.json'), 'utf8'));
    
    state.packages = {
      root: { name: rootPackage.name, version: rootPackage.version },
      backend: { name: backendPackage.name, version: backendPackage.version },
      frontend: { name: frontendPackage.name, version: frontendPackage.version }
    };
  } catch (error) {
    state.packages = { error: error.message };
  }

  return state;
}

/**
 * Capture execution context and plan state
 */
function captureExecutionContext() {
  console.log('📋 Capturing execution context...');
  
  const context = {
    timestamp: new Date().toISOString(),
    sessionId: SESSION_ID,
    protocol: PROTOCOL_NAME,
    execution: {
      currentPhase: null,
      currentStep: null,
      completedSteps: [],
      pendingSteps: [],
      errors: [],
      warnings: [],
      lastAction: null
    },
    plans: {
      active: null,
      completed: [],
      pending: []
    },
    holons: {
      status: {},
      performance: {},
      errors: []
    }
  };

  // Try to read current plan state
  try {
    const planFiles = fs.readdirSync(path.join(DATA_DIR, 'roadmap-actuals'))
      .filter(file => file.endsWith('.json'))
      .sort((a, b) => {
        const aStat = fs.statSync(path.join(DATA_DIR, 'roadmap-actuals', a));
        const bStat = fs.statSync(path.join(DATA_DIR, 'roadmap-actuals', b));
        return bStat.mtime.getTime() - aStat.mtime.getTime();
      });

    if (planFiles.length > 0) {
      const latestPlan = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'roadmap-actuals', planFiles[0]), 'utf8'));
      context.plans.active = latestPlan;
    }
  } catch (error) {
    context.execution.errors.push(`Failed to read plan state: ${error.message}`);
  }

  // Try to read recent command history
  try {
    const commandHistory = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'command_history.json'), 'utf8'));
    context.execution.lastAction = commandHistory.recent?.[0] || null;
  } catch (error) {
    context.execution.errors.push(`Failed to read command history: ${error.message}`);
  }

  // Try to read error continuity log
  try {
    const errorLog = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'error_continuity_log.json'), 'utf8'));
    context.execution.errors = errorLog.recent || [];
  } catch (error) {
    // Error log might not exist, that's okay
  }

  return context;
}

/**
 * Capture holon states and performance data
 */
function captureHolonStates() {
  console.log('🤖 Capturing holon states...');
  
  const holonStates = {
    timestamp: new Date().toISOString(),
    sessionId: SESSION_ID,
    protocol: PROTOCOL_NAME,
    holons: {}
  };

  // Check for holon state files
  const holonDirs = [
    path.join(__dirname, '../../src/core'),
    path.join(__dirname, '../../backend/src/core'),
    path.join(__dirname, '../../frontend/src/core')
  ];

  holonDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      try {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        files.forEach(file => {
          if (file.isDirectory()) {
            const holonName = file.name;
            const holonPath = path.join(dir, holonName);
            
            holonStates.holons[holonName] = {
              path: holonPath,
              exists: true,
              hasIndex: fs.existsSync(path.join(holonPath, 'index.ts')),
              hasManager: fs.existsSync(path.join(holonPath, 'manager.ts')),
              hasTypes: fs.existsSync(path.join(holonPath, 'types.ts')),
              lastModified: fs.statSync(holonPath).mtime.toISOString()
            };
          }
        });
      } catch (error) {
        holonStates.holons[dir] = { error: error.message };
      }
    }
  });

  return holonStates;
}

/**
 * Generate transition summary
 */
function generateTransitionSummary(systemState, executionContext, holonStates) {
  console.log('📊 Generating transition summary...');
  
  const summary = {
    timestamp: new Date().toISOString(),
    sessionId: SESSION_ID,
    protocol: PROTOCOL_NAME,
    transition: {
      type: 'wrap_to_launch',
      status: 'prepared',
      nextProtocol: 'launch_annihilate'
    },
    summary: {
      systemHealth: 'unknown',
      activePlans: executionContext.plans.active ? 1 : 0,
      holonCount: Object.keys(holonStates.holons).length,
      errorCount: executionContext.execution.errors.length,
      warningCount: executionContext.execution.warnings.length
    },
    recommendations: []
  };

  // Analyze system health
  if (executionContext.execution.errors.length > 0) {
    summary.summary.systemHealth = 'needs_attention';
    summary.recommendations.push('Address execution errors before continuing');
  } else if (executionContext.plans.active) {
    summary.summary.systemHealth = 'active_plan';
    summary.recommendations.push('Continue with active plan execution');
  } else {
    summary.summary.systemHealth = 'ready';
    summary.recommendations.push('System ready for new plan execution');
  }

  return summary;
}

/**
 * Save all captured data
 */
function saveTransitionData(systemState, executionContext, holonStates, summary) {
  console.log('💾 Saving transition data...');
  
  const transitionData = {
    systemState,
    executionContext,
    holonStates,
    summary
  };

  // Save transition file
  const transitionFile = path.join(TRANSITIONS_DIR, `${SESSION_ID}-transition.json`);
  fs.writeFileSync(transitionFile, JSON.stringify(transitionData, null, 2));
  console.log(`✅ Transition data saved: ${transitionFile}`);

  // Save system state
  const systemStateFile = path.join(SYSTEM_STATE_DIR, `${SESSION_ID}-system-state.json`);
  fs.writeFileSync(systemStateFile, JSON.stringify(systemState, null, 2));
  console.log(`✅ System state saved: ${systemStateFile}`);

  // Save context for next session
  const contextFile = path.join(CONTEXT_DIR, `${SESSION_ID}-context.json`);
  fs.writeFileSync(contextFile, JSON.stringify(executionContext, null, 2));
  console.log(`✅ Context saved: ${contextFile}`);

  return {
    transitionFile,
    systemStateFile,
    contextFile
  };
}

/**
 * Generate handoff instructions
 */
function generateHandoffInstructions(files) {
  console.log('📝 Generating handoff instructions...');
  
  const instructions = {
    timestamp: new Date().toISOString(),
    sessionId: SESSION_ID,
    protocol: PROTOCOL_NAME,
    handoff: {
      nextProtocol: 'launch_annihilate',
      files: files,
      command: `npm run anchor launch-annihilate --session-id=${SESSION_ID}`,
      instructions: [
        '1. Start new chat session',
        '2. Run: npm run anchor launch-annihilate',
        '3. System will automatically restore context',
        '4. Continue with plan execution',
        '5. Monitor system health and performance'
      ]
    },
    quickStart: {
      command: `npm run anchor launch-annihilate --session-id=${SESSION_ID}`,
      description: 'Launch with context restoration'
    }
  };

  const instructionsFile = path.join(TRANSITIONS_DIR, `${SESSION_ID}-handoff-instructions.json`);
  fs.writeFileSync(instructionsFile, JSON.stringify(instructions, null, 2));
  console.log(`✅ Handoff instructions saved: ${instructionsFile}`);

  return instructions;
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Starting Wrap Annihilate Protocol');
  console.log(`📅 Timestamp: ${new Date().toISOString()}`);
  console.log(`🆔 Session ID: ${SESSION_ID}`);
  console.log('');

  try {
    // Capture all state data
    const systemState = captureSystemState();
    const executionContext = captureExecutionContext();
    const holonStates = captureHolonStates();
    const summary = generateTransitionSummary(systemState, executionContext, holonStates);

    // Save all data
    const files = saveTransitionData(systemState, executionContext, holonStates, summary);

    // Generate handoff instructions
    const instructions = generateHandoffInstructions(files);

    // Final summary
    console.log('');
    console.log('🎯 Wrap Annihilate Protocol Complete');
    console.log('=====================================');
    console.log(`📊 System Health: ${summary.summary.systemHealth}`);
    console.log(`📋 Active Plans: ${summary.summary.activePlans}`);
    console.log(`🤖 Holons: ${summary.summary.holonCount}`);
    console.log(`❌ Errors: ${summary.summary.errorCount}`);
    console.log(`⚠️  Warnings: ${summary.summary.warningCount}`);
    console.log('');
    console.log('🔄 Next Steps:');
    console.log(`   Run: ${instructions.quickStart.command}`);
    console.log('');
    console.log('📁 Files Created:');
    console.log(`   Transition: ${files.transitionFile}`);
    console.log(`   System State: ${files.systemStateFile}`);
    console.log(`   Context: ${files.contextFile}`);
    console.log('');

    // Log recommendations
    if (summary.recommendations.length > 0) {
      console.log('💡 Recommendations:');
      summary.recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. ${rec}`);
      });
      console.log('');
    }

    console.log('✅ Wrap protocol completed successfully');
    console.log('🔄 Ready for seamless handoff to launch protocol');

  } catch (error) {
    console.error('❌ Wrap protocol failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  main,
  captureSystemState,
  captureExecutionContext,
  captureHolonStates,
  generateTransitionSummary,
  saveTransitionData,
  generateHandoffInstructions
}; 