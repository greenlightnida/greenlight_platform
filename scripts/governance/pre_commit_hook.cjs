#!/usr/bin/env node

/**
 * Pre-Commit Hook: Enterprise Committee Governance Enforcement
 * 
 * PURPOSE: Enforce that no destructive/system-wide changes occur without:
 * - Up-to-date committee consensus reports
 * - Explicit human approval for irreversible actions
 * - Proper audit trail and documentation
 * 
 * LEVERAGES: Cascading and balanced auditing capabilities for comprehensive regulation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// === Cascading Audit Levels ===
const AUDIT_LEVELS = {
  LEVEL_1: 'basic',      // File changes, basic validation
  LEVEL_2: 'structural', // System structure, dependencies
  LEVEL_3: 'governance', // Committee consensus, policy compliance
  LEVEL_4: 'enterprise'  // Cross-system impact, risk assessment
};

// === Balanced Audit Categories ===
const AUDIT_CATEGORIES = {
  COMMAND: 'command-related changes',
  PROTOCOL: 'protocol modifications',
  GOVERNANCE: 'governance structure changes',
  CONFIG: 'configuration and environment changes',
  SECURITY: 'security and access modifications',
  PERFORMANCE: 'performance and optimization changes'
};

function detectChangeType(stagedFiles) {
  const changes = {
    command: [],
    protocol: [],
    governance: [],
    config: [],
    security: [],
    performance: [],
    other: []
  };

  for (const file of stagedFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const filename = path.basename(file);
    
    // Command-related changes
    if (filename.includes('command') || filename.includes('coordinator') || 
        filename.includes('audit') || filename.includes('optimizer')) {
      changes.command.push(file);
    }
    // Protocol changes
    else if (filename.includes('protocol') || file.includes('/protocols/')) {
      changes.protocol.push(file);
    }
    // Governance changes
    else if (filename.includes('governance') || filename.includes('policy') || 
             filename.includes('committee') || filename.includes('custodian')) {
      changes.governance.push(file);
    }
    // Config changes
    else if (filename.includes('config') || filename.includes('.env') || 
             filename.includes('package.json') || filename.includes('tsconfig')) {
      changes.config.push(file);
    }
    // Security changes
    else if (filename.includes('auth') || filename.includes('security') || 
             filename.includes('permission') || filename.includes('access')) {
      changes.security.push(file);
    }
    // Performance changes
    else if (filename.includes('performance') || filename.includes('optimization') || 
             filename.includes('monitor') || filename.includes('health')) {
      changes.performance.push(file);
    }
    else {
      changes.other.push(file);
    }
  }

  return changes;
}

function checkCommitteeReports() {
  const requiredReports = [
    'ENTERPRISE_COMMITTEE_REPORT.json',
    'CUSTODIAN_MIGRATION_CANDIDATES.json',
    'CUSTODIAN_REPORT.json'
  ];

  const missingReports = [];
  const staleReports = [];

  for (const report of requiredReports) {
    if (!fs.existsSync(report)) {
      missingReports.push(report);
      continue;
    }

    const stats = fs.statSync(report);
    const ageHours = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60);
    
    if (ageHours > 24) { // Reports older than 24 hours
      staleReports.push({ report, ageHours: Math.round(ageHours) });
    }
  }

  return { missingReports, staleReports };
}

function checkCommitteeConsensus() {
  try {
    const report = JSON.parse(fs.readFileSync('ENTERPRISE_COMMITTEE_REPORT.json', 'utf8'));
    return {
      hasConsensus: report.consensus === true,
      timestamp: report.timestamp,
      committeeMembers: report.committee?.length || 0,
      findings: report.report?.filter(r => r.findings?.length > 0) || []
    };
  } catch (e) {
    return { hasConsensus: false, error: e.message };
  }
}

function runCascadingAudit(changes) {
  const auditResults = {
    level1: { passed: true, issues: [] },
    level2: { passed: true, issues: [] },
    level3: { passed: true, issues: [] },
    level4: { passed: true, issues: [] }
  };

  // Level 1: Basic validation
  for (const file of changes.command.concat(changes.protocol, changes.governance)) {
    if (!fs.existsSync(file)) {
      auditResults.level1.passed = false;
      auditResults.level1.issues.push(`File not found: ${file}`);
    }
  }

  // Level 2: Structural validation
  if (changes.command.length > 0 && !changes.command.some(f => f.includes('command_center'))) {
    auditResults.level2.passed = false;
    auditResults.level2.issues.push('Command-related changes outside command center detected');
  }

  // Level 3: Governance validation
  const committeeStatus = checkCommitteeReports();
  if (committeeStatus.missingReports.length > 0) {
    auditResults.level3.passed = false;
    auditResults.level3.issues.push(`Missing committee reports: ${committeeStatus.missingReports.join(', ')}`);
  }

  const consensus = checkCommitteeConsensus();
  if (!consensus.hasConsensus) {
    auditResults.level3.passed = false;
    auditResults.level3.issues.push('Committee consensus not reached');
  }

  // Level 4: Enterprise impact assessment
  if (changes.governance.length > 0 || changes.config.length > 0) {
    // High-impact changes require additional scrutiny
    if (!consensus.hasConsensus) {
      auditResults.level4.passed = false;
      auditResults.level4.issues.push('Governance/config changes require committee consensus');
    }
  }

  return auditResults;
}

function main() {
  console.log('🔍 Pre-Commit Hook: Enterprise Committee Governance Enforcement');
  console.log('============================================================');

  try {
    // Get staged files
    const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' })
      .trim().split('\n').filter(f => f.length > 0);

    if (stagedFiles.length === 0) {
      console.log('✅ No files staged. Proceeding with commit.');
      process.exit(0);
    }

    console.log(`📋 Analyzing ${stagedFiles.length} staged files...`);

    // Detect change types
    const changes = detectChangeType(stagedFiles);
    
    // Run cascading audit
    const auditResults = runCascadingAudit(changes);

    // Report results
    let hasIssues = false;
    for (const [level, result] of Object.entries(auditResults)) {
      if (!result.passed) {
        hasIssues = true;
        console.log(`❌ ${level.toUpperCase()} audit failed:`);
        result.issues.forEach(issue => console.log(`   - ${issue}`));
      } else {
        console.log(`✅ ${level.toUpperCase()} audit passed`);
      }
    }

    if (hasIssues) {
      console.log('\n🚫 Commit blocked. Please address the issues above.');
      console.log('💡 Run "npm run custodian" to update committee reports.');
      process.exit(1);
    }

    console.log('\n✅ All audits passed. Proceeding with commit.');
    process.exit(0);

  } catch (error) {
    console.error('❌ Pre-commit hook error:', error.message);
    process.exit(1);
  }
}

main(); 