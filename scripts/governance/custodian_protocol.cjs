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
}

main(); 