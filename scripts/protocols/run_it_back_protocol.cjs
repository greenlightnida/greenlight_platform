#!/usr/bin/env node

/**
 * Run It Back Protocol v2.0.0
 * 
 * PURPOSE: Deliver a summary of the current chat session and tasks accomplished so far.
 * 
 * Reads from logs, session files, and assessment reports to print a concise summary.
 * Saves comprehensive reports to data/sessions/ directory for consistency with system logging.
 *
 * USAGE: node scripts/protocols/run_it_back_protocol.cjs
 */

const fs = require('fs');
const path = require('path');

function readJSON(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (e) {}
  return null;
}

function printSection(title) {
  console.log('\n' + title);
  console.log('='.repeat(title.length));
}

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function saveRunItBackReport(reportData) {
  const sessionsDir = path.join(process.cwd(), 'data/sessions');
  ensureDirectoryExists(sessionsDir);
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportFile = path.join(sessionsDir, `run-it-back-${timestamp}.json`);
  
  fs.writeFileSync(reportFile, JSON.stringify(reportData, null, 2));
  console.log(`\n📄 Run It Back report saved: ${reportFile}`);
  
  return reportFile;
}

function summarizeSession() {
  const projectRoot = process.cwd();
  
  // Session metadata
  const sessionFile = path.join(projectRoot, 'scripts/NEXT_SESSION_CONTEXT.md');
  const sessionMeta = fs.existsSync(sessionFile) ? fs.readFileSync(sessionFile, 'utf8') : null;

  // Last assessment
  const assessmentFile = path.join(projectRoot, 'data/assessments/latest_assessment.json');
  const assessment = readJSON(assessmentFile);

  // Command history
  const commandHistoryFile = path.join(projectRoot, 'data/command_center/command_history.json');
  const commandHistory = readJSON(commandHistoryFile);

  // Next steps plan
  const planFile = path.join(projectRoot, 'docs/NEXT_STEPS_EXECUTION_PLAN.md');
  const plan = fs.existsSync(planFile) ? fs.readFileSync(planFile, 'utf8') : null;

  // System state
  const systemStateFile = path.join(projectRoot, 'data/system-state/latest_system_state.json');
  const systemState = readJSON(systemStateFile);

  // Standards registry
  const standardsFile = path.join(projectRoot, 'data/standards/standards_registry.json');
  const standards = readJSON(standardsFile);

  // Build comprehensive report data
  const reportData = {
    timestamp: new Date().toISOString(),
    protocol: 'run-it-back',
    version: '2.0.0',
    sessionMetadata: sessionMeta ? sessionMeta.split('\n').slice(0, 20).join('\n') : null,
    commandHistory: commandHistory && Array.isArray(commandHistory) ? commandHistory.slice(-10) : [],
    latestAssessment: assessment,
    nextStepsPlan: plan ? plan.split('\n').slice(0, 20).join('\n') : null,
    systemState: systemState,
    standardsRegistry: standards,
    summary: {
      totalCommands: commandHistory ? commandHistory.length : 0,
      recentCommands: commandHistory ? commandHistory.slice(-10).length : 0,
      systemStatus: assessment ? assessment.status : 'unknown',
      hasNextSteps: !!plan,
      hasStandards: !!standards
    }
  };

  // Print summary to console
  printSection('📝 SESSION SUMMARY');
  if (sessionMeta) {
    const lines = sessionMeta.split('\n').slice(0, 20).join('\n');
    console.log(lines);
  } else {
    console.log('No session metadata found.');
  }

  printSection('✅ TASKS & COMMANDS ACCOMPLISHED');
  if (commandHistory && Array.isArray(commandHistory)) {
    commandHistory.slice(-10).forEach(cmd => {
      console.log(`- ${cmd.timestamp} ${cmd.command} ${cmd.options ? cmd.options.join(' ') : ''} [${cmd.status}]`);
    });
  } else {
    console.log('No command history found.');
  }

  printSection('📊 LATEST STATUS ASSESSMENT');
  if (assessment) {
    console.log(`Assessment ID: ${assessment.assessmentId}`);
    console.log(`Target: ${assessment.target}`);
    console.log(`Status: ${assessment.status}`);
    console.log(`Duration: ${assessment.duration}ms`);
    if (assessment.issues && assessment.issues.length) {
      console.log('Issues:');
      assessment.issues.forEach(i => console.log(`  - ${i}`));
    }
    if (assessment.misplacedFiles && assessment.misplacedFiles.length) {
      console.log('Misplaced Files:');
      assessment.misplacedFiles.forEach(f => console.log(`  - ${f}`));
    }
  } else {
    console.log('No recent assessment found.');
  }

  printSection('🚀 NEXT STEPS PLAN');
  if (plan) {
    const lines = plan.split('\n').slice(0, 20).join('\n');
    console.log(lines);
  } else {
    console.log('No next steps plan found.');
  }

  // Save comprehensive report to file
  const savedFile = saveRunItBackReport(reportData);
  
  return {
    consoleOutput: true,
    fileSaved: savedFile,
    reportData: reportData
  };
}

if (require.main === module) {
  summarizeSession();
} 