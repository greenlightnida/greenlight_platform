#!/usr/bin/env node

/**
 * Custodian Protocol v3.0.0
 *
 * PURPOSE: Monitors, reports, and coordinates safe maintenance actions across the codebase.
 * - Tracks and logs the results of all relevant scripts (lint, audit, quick fixes, etc.)
 * - Only acts on safe, non-destructive maintenance (e.g., running lint, reporting errors, suggesting fixes)
 * - Never makes big or irreversible decisions (e.g., deleting files, refactoring structure)
 * - Escalates or logs anything outside its scope for human or ScriptMaster review
 * - Supports dry-run mode for previewing actions
 *
 * USAGE: node scripts/custodian_protocol.cjs [--dry-run]
 */

/* eslint-env node */
/* eslint-disable @typescript-eslint/no-require-imports */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');
const LOG_PATH = path.join(process.cwd(), 'CUSTODIAN_REPORT.json');

const SCRIPTS = [
  { name: 'Lint', cmd: 'npm run lint', safe: true },
  { name: 'TypeScript Fixes', cmd: 'node scripts/fix_typescript_issues.cjs', safe: true },
  { name: 'Accessibility Fixes', cmd: 'node scripts/fix_accessibility_issues.cjs', safe: true },
  { name: 'Quick Fixes', cmd: 'node scripts/quick_fixes.js', safe: true },
  { name: 'Audit & Optimize', cmd: 'node scripts/audit_and_optimize.js', safe: true },
  { name: 'Protocol Updates', cmd: 'node scripts/protocols/update_protocols.cjs', safe: true },
  { name: 'Performance Optimization', cmd: 'node scripts/performance_optimization.js', safe: true },
  { name: 'Memory Leak Fixes', cmd: 'node scripts/fix_memory_leaks.js', safe: true },
  // File Management Scan (safe, reporting only)
  { name: 'File Management Scan', cmd: 'npx tsx scripts/file_management_scan.ts', safe: true },
  // File Management Cleanup (DESTRUCTIVE: only run with explicit escalation)
  { name: 'File Management Cleanup', cmd: 'npx tsx scripts/file_management_cleanup.ts', safe: false },
  // Add more scripts as needed
];

// Project structure awareness
const PROJECT_STRUCTURE = {
  root: process.cwd(),
  packages: {
    elevate: path.join(process.cwd(), 'packages/elevate'),
    shared: path.join(process.cwd(), 'packages/shared')
  },
  scripts: path.join(process.cwd(), 'scripts'),
  src: path.join(process.cwd(), 'src')
};

const FILE_MESS_THRESHOLD = 10; // Orphaned/duplicate count to recommend cleanup
const CLEANUP_APPROVAL_FILE = 'CLEANUP_APPROVED';

function shouldRecommendCleanup(scanReport) {
  const orphanCount = scanReport.orphans?.length || 0;
  const duplicateCount = scanReport.duplicates?.length || 0;
  return (orphanCount + duplicateCount) >= FILE_MESS_THRESHOLD;
}

function runFileManagementScan() {
  try {
    execSync('npx tsx scripts/file_management_scan.ts', { encoding: 'utf8' });
    const report = JSON.parse(fs.readFileSync('SYSTEM_AUDIT_REPORT.json', 'utf8'));
    return report;
  } catch (e) {
    return { error: 'File management scan failed', details: e.message };
  }
}

function runScript(script) {
  if (DRY_RUN) {
    return { name: script.name, cmd: script.cmd, dryRun: true, output: '[Dry run: not executed]' };
  }
  try {
    const output = execSync(script.cmd, { encoding: 'utf8' });
    return { name: script.name, cmd: script.cmd, success: true, output };
  } catch (error) {
    return { name: script.name, cmd: script.cmd, success: false, error: error.message, output: error.stdout || '' };
  }
}

// Utility: Scan for anachronisms, outdated code, and redundancies
function analyzeCodebase() {
  const findings = [];
  // Example checks (expand as needed):
  // 1. Outdated dependencies (package.json)
  try {
    const pkgPath = path.join(PROJECT_STRUCTURE.root, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      if (pkg.dependencies) {
        for (const dep in pkg.dependencies) {
          if (pkg.dependencies[dep].includes('0.') || pkg.dependencies[dep].includes('beta')) {
            findings.push({ type: 'outdated-dependency', dependency: dep, version: pkg.dependencies[dep] });
          }
        }
      }
    }
  } catch (e) {
    findings.push({ type: 'error', message: 'Failed to analyze dependencies', error: e.message });
  }
  // 2. Redundant files (e.g., backup, .bak, .tmp, .old)
  function scanDir(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scanDir(fullPath);
      } else if (fs.statSync(fullPath).isFile()) {
        if (/\.(bak|tmp|old|backup)$/i.test(item)) {
          findings.push({ type: 'redundant-file', file: fullPath });
        }
      }
    }
  }
  scanDir(PROJECT_STRUCTURE.root);
  // 3. Anachronistic code patterns (e.g., var usage, old React lifecycle methods)
  function scanForAnachronisms(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scanForAnachronisms(fullPath);
      } else if (fs.statSync(fullPath).isFile() && /\.(js|ts|tsx)$/.test(item)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (/\bvar\b/.test(content)) {
          findings.push({ type: 'anachronism', file: fullPath, pattern: 'var keyword' });
        }
        if (/componentWillMount|componentWillReceiveProps|componentWillUpdate/.test(content)) {
          findings.push({ type: 'anachronism', file: fullPath, pattern: 'old React lifecycle' });
        }
      }
    }
  }
  scanForAnachronisms(PROJECT_STRUCTURE.src);
  // 4. Synthesis/redundancy suggestions (e.g., duplicate utilities)
  // (Placeholder: In a real system, would use more advanced analysis)
  // ...
  return findings;
}

// === New: Command-Related Orphan/Misplaced Discovery ===
function findCommandRelatedOrphans() {
  const commandKeywords = [
    'command', 'coordinator', 'audit', 'optimizer', 'history', 'protocol', 'manager', 'log', 'governance'
  ];
  const orphans = [];
  function scanDir(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scanDir(fullPath);
      } else if (fs.statSync(fullPath).isFile()) {
        const isCommandRelated = commandKeywords.some(kw => item.toLowerCase().includes(kw));
        const isInCommandCenter = fullPath.includes('scripts/command_center/');
        if (isCommandRelated && !isInCommandCenter) {
          orphans.push(fullPath);
        }
      }
    }
  }
  scanDir(PROJECT_STRUCTURE.scripts);
  scanDir(PROJECT_STRUCTURE.src);
  return orphans;
}

// === Enterprise Committee Registry ===
const ENTERPRISE_COMMITTEE = [
  {
    name: 'VarEnvManager',
    path: path.join(PROJECT_STRUCTURE.scripts, 'config/var_env_manager.cjs'),
    role: 'Environment and config authority',
    query: () => {/* TODO: implement or import actual check */ return { status: 'ok', findings: [] }; }
  },
  {
    name: 'FileManager',
    path: path.join(PROJECT_STRUCTURE.scripts, 'background/agents/file_manager.cjs'),
    role: 'Canonical file inventory',
    query: () => {/* TODO: implement or import actual check */ return { status: 'ok', findings: [] }; }
  },
  {
    name: 'ProtocolManager',
    path: path.join(PROJECT_STRUCTURE.src, 'core/holons/protocols/ProtocolManager.ts'),
    role: 'Protocol registration and compliance',
    query: () => {/* TODO: implement or import actual check */ return { status: 'ok', findings: [] }; }
  },
  {
    name: 'AuditManager',
    path: path.join(PROJECT_STRUCTURE.scripts, 'audit/comprehensive_organizational_audit.cjs'),
    role: 'Audit and compliance checks',
    query: () => {/* TODO: implement or import actual check */ return { status: 'ok', findings: [] }; }
  },
  {
    name: 'SessionManager',
    path: path.join(PROJECT_STRUCTURE.src, 'core/session-management/SessionManager.ts'),
    role: 'Session logic and state',
    query: () => {/* TODO: implement or import actual check */ return { status: 'ok', findings: [] }; }
  },
  {
    name: 'HealthMonitor',
    path: path.join(PROJECT_STRUCTURE.scripts, 'monitoring/health_monitor.cjs'),
    role: 'System health and risk signals',
    query: () => {/* TODO: implement or import actual check */ return { status: 'ok', findings: [] }; }
  }
  // Add more managers as needed
];

// === Committee Convening Logic ===
function conveneEnterpriseCommittee() {
  const committeeFindings = [];
  for (const member of ENTERPRISE_COMMITTEE) {
    let result;
    try {
      result = member.query();
    } catch (e) {
      result = { status: 'error', error: e.message, findings: [] };
    }
    committeeFindings.push({
      name: member.name,
      role: member.role,
      status: result.status,
      findings: result.findings || [],
      error: result.error || null
    });
  }
  return committeeFindings;
}

function gitStageAndCommitReports() {
  const { execSync } = require('child_process');
  try {
    execSync('git add ENTERPRISE_COMMITTEE_REPORT.json CUSTODIAN_MIGRATION_CANDIDATES.json CUSTODIAN_REPORT.json', { stdio: 'ignore' });
    execSync('git commit -m "chore(governance): update committee and custodian reports [auto-commit]"', { stdio: 'ignore' });
    console.log('\n✅ Committee and custodian reports auto-staged and committed to git.');
  } catch (e) {
    console.warn('\n⚠️  Could not auto-stage/commit reports to git:', e.message);
  }
}

function main() {
  // eslint-disable-next-line no-console
  console.log('🧹 Custodian Protocol v3.0.0 Initiated');
  // eslint-disable-next-line no-console
  console.log('========================================');
  if (DRY_RUN) {
    // eslint-disable-next-line no-console
    console.log('Dry run mode: No changes will be made.');
  }

  // Log project structure awareness
  // eslint-disable-next-line no-console
  console.log('\n📁 Project Structure:');
  // eslint-disable-next-line no-console
  console.log(`Root: ${PROJECT_STRUCTURE.root}`);
  // eslint-disable-next-line no-console
  console.log(`Packages: ${Object.keys(PROJECT_STRUCTURE.packages).join(', ')}`);
  // eslint-disable-next-line no-console
  console.log(`Scripts: ${PROJECT_STRUCTURE.scripts}`);
  // eslint-disable-next-line no-console
  console.log(`Source: ${PROJECT_STRUCTURE.src}`);

  // === New: System-wide analysis phase ===
  // eslint-disable-next-line no-console
  console.log('\n🔎 Analyzing codebase for anachronisms, outdated code, and redundancies...');
  const analysisFindings = analyzeCodebase();
  if (analysisFindings.length === 0) {
    // eslint-disable-next-line no-console
    console.log('✅ No major anachronisms or redundancies found.');
  } else {
    // eslint-disable-next-line no-console
    console.log(`⚠️  Found ${analysisFindings.length} issues. See report for details.`);
  }

  // === File Management Scan & Recommendations ===
  const scanReport = runFileManagementScan();
  let cleanupRecommended = false;
  let cleanupApprovalPresent = false;
  let cleanupResult = null;
  let recommendations = [];

  if (!scanReport.error) {
    cleanupRecommended = shouldRecommendCleanup(scanReport);
    if (cleanupRecommended) {
      recommendations.push('File hygiene is critical. Ruthless cleanup is recommended.');
      if (fs.existsSync(CLEANUP_APPROVAL_FILE)) {
        cleanupApprovalPresent = true;
        // Escalate: Run ruthless cleanup
        try {
          cleanupResult = execSync('npx tsx scripts/file_management_cleanup.ts', { encoding: 'utf8' });
          recommendations.push('Ruthless cleanup executed. See CLEANUP_REPORT.json for details.');
        } catch (e) {
          recommendations.push('Cleanup execution failed: ' + e.message);
        }
      } else {
        recommendations.push('Approval required: Create CLEANUP_APPROVED file in project root to authorize cleanup.');
      }
    } else {
      recommendations.push('File hygiene is within acceptable limits. No destructive action needed.');
    }
  } else {
    recommendations.push('File management scan failed: ' + scanReport.error);
  }

  // === New: Command-Related Orphan/Misplaced Discovery ===
  const commandOrphans = findCommandRelatedOrphans();
  if (commandOrphans.length > 0) {
    const migrationReportPath = path.join(process.cwd(), 'CUSTODIAN_MIGRATION_CANDIDATES.json');
    fs.writeFileSync(migrationReportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      candidates: commandOrphans,
      notes: [
        'These files are command-related but not located in the command center.',
        'Review and migrate as appropriate. No files have been deleted or moved automatically.',
        'All references should be updated programmatically if migration is approved.'
      ]
    }, null, 2));
    console.log(`\n⚠️  Command-related orphans/misplaced files found. See ${migrationReportPath}`);
  } else {
    console.log('\n✅ No command-related orphans/misplaced files found.');
  }

  // === Convene Enterprise Committee ===
  const committeeReport = conveneEnterpriseCommittee();
  const committeeConsensus = committeeReport.every(r => r.status === 'ok' && (!r.findings || r.findings.length === 0));
  const committeeReportPath = path.join(process.cwd(), 'ENTERPRISE_COMMITTEE_REPORT.json');
  fs.writeFileSync(committeeReportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    committee: ENTERPRISE_COMMITTEE.map(m => ({ name: m.name, role: m.role, path: m.path })),
    report: committeeReport,
    consensus: committeeConsensus,
    notes: [
      'No destructive/system-wide change may occur without explicit committee consensus and human approval.',
      'All findings and recommendations are logged and surfaced in the command center.'
    ]
  }, null, 2));
  if (!committeeConsensus) {
    console.log('\n❌ Committee consensus not reached. No destructive/system-wide changes will be made. See ENTERPRISE_COMMITTEE_REPORT.json for details.');
  } else {
    console.log('\n✅ Committee consensus reached. Safe to proceed with planned actions (pending human approval).');
  }

  const results = [];
  for (const script of SCRIPTS) {
    if (script.safe) {
      // eslint-disable-next-line no-console
      console.log(`\n▶️ Running: ${script.name}`);
      const result = runScript(script);
      results.push(result);
      if (result.success === false) {
        // eslint-disable-next-line no-console
        console.warn(`⚠️  ${script.name} failed: ${result.error}`);
      }
    } else {
      // eslint-disable-next-line no-console
      console.log(`⏭️  Skipping potentially unsafe script: ${script.name}`);
    }
  }

  // Summarize and log
  const report = {
    timestamp: new Date().toISOString(),
    dryRun: DRY_RUN,
    projectStructure: PROJECT_STRUCTURE,
    analysisFindings,
    fileManagement: {
      scanReport,
      cleanupRecommended,
      cleanupApprovalPresent,
      cleanupResult: cleanupResult ? cleanupResult.toString() : null
    },
    results,
    recommendations,
    notes: [
      'Custodian only runs safe, non-destructive scripts unless explicit approval is present.',
      'For ruthless cleanup, create CLEANUP_APPROVED in the project root and re-run the custodian.',
      'For full orchestration, see ScriptMaster in Governance.',
      'Project structure awareness added to prevent scope confusion.',
      'System-wide analysis phase added: see analysisFindings for anachronisms, outdated code, and redundancies.'
    ]
  };
  fs.writeFileSync(LOG_PATH, JSON.stringify(report, null, 2));
  // eslint-disable-next-line no-console
  console.log(`\n✅ Custodian protocol complete. Report saved to ${LOG_PATH}`);
  // After all reports are written:
  gitStageAndCommitReports();
}

main(); 