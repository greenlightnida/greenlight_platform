#!/usr/bin/env node

/**
 * Precommit Audit Script
 * Validates system state before Phase 4 execution
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class PrecommitAudit {
  constructor() {
    this.projectRoot = process.cwd();
    this.issues = [];
    this.warnings = [];
    this.successes = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '✅';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async runAudit() {
    this.log('Starting Precommit Audit...', 'info');
    console.log('='.repeat(60));

    // 0. Security Holon State Validation
    await this.validateSecurityHolonState();

    // 1. System State Validation
    await this.validateSystemState();
    
    // 2. Phase 3 Completion Verification
    await this.verifyPhase3Completion();
    
    // 3. Code Quality Assessment
    await this.assessCodeQuality();
    
    // 4. Architecture Compliance
    await this.checkArchitectureCompliance();
    
    // 5. Documentation Completeness
    await this.verifyDocumentation();
    
    // 6. Protocol Update Requirements
    await this.checkProtocolUpdates();

    // Summary
    this.generateSummary();
  }

  async validateSecurityHolonState() {
    this.log('Validating Security Holon State...', 'info');
    try {
      const { SecurityHolonManager } = require('../../src/core/holons/security/SecurityHolonManager');
      const holon = SecurityHolonManager.getInstance();
      const state = holon.getState();
      const unresolved = state.vulnerabilities.filter(v => (v.severity === 'critical' || v.severity === 'high') && v.status === 'open');
      const complianceFail = state.metrics.securityScore < 80;
      if (unresolved.length > 0) {
        this.issues.push(`Unresolved critical/high vulnerabilities: ${unresolved.length}`);
        this.log(`Unresolved critical/high vulnerabilities: ${unresolved.length}`, 'error');
      }
      if (complianceFail) {
        this.issues.push(`Security score below compliance threshold: ${state.metrics.securityScore}%`);
        this.log(`Security score below compliance threshold: ${state.metrics.securityScore}%`, 'error');
      }
    } catch (error) {
      this.issues.push('Security Holon state check failed');
      this.log(`Security Holon state check failed: ${error.message}`, 'error');
    }
  }

  async validateSystemState() {
    this.log('Validating System State...', 'info');
    
    try {
      // Check build status
      this.log('Running build...', 'info');
      execSync('npm run build', { stdio: 'pipe' });
      this.successes.push('Build completed successfully');
    } catch (error) {
      this.issues.push('Build failed');
      this.log(`Build error: ${error.message}`, 'error');
    }

    try {
      // Check TypeScript compilation
      this.log('Checking TypeScript...', 'info');
      execSync('npx tsc --noEmit', { stdio: 'pipe' });
      this.successes.push('TypeScript compilation clean');
    } catch (error) {
      this.issues.push('TypeScript compilation errors');
      this.log(`TypeScript error: ${error.message}`, 'error');
    }

    try {
      // Check linting
      this.log('Checking linting...', 'info');
      execSync('npm run lint', { stdio: 'pipe' });
      this.successes.push('Linting passed');
    } catch (error) {
      this.warnings.push('Linting issues found');
      this.log(`Linting warning: ${error.message}`, 'warning');
    }
  }

  async verifyPhase3Completion() {
    this.log('Verifying Phase 3 Completion...', 'info');
    
    // Check Sessions Manager
    const sessionsManagerPath = path.join(this.projectRoot, 'src/components/SessionsManager');
    if (fs.existsSync(sessionsManagerPath)) {
      this.successes.push('Sessions Manager component exists');
    } else {
      this.issues.push('Sessions Manager component missing');
    }

    // Check Anchor Command Service
    const anchorServicePath = path.join(this.projectRoot, 'src/services/anchorCommandService.ts');
    if (fs.existsSync(anchorServicePath)) {
      this.successes.push('Anchor Command Service exists');
    } else {
      this.issues.push('Anchor Command Service missing');
    }

    // Check Developer Notes
    const devNotesPath = path.join(this.projectRoot, 'src/components/DeveloperNotes');
    if (fs.existsSync(devNotesPath)) {
      this.successes.push('Developer Notes component exists');
    } else {
      this.issues.push('Developer Notes component missing');
    }

    // Check documentation
    const roadmapPath = path.join(this.projectRoot, 'LIVING_ROADMAP.md');
    if (fs.existsSync(roadmapPath)) {
      const roadmapContent = fs.readFileSync(roadmapPath, 'utf8');
      if (roadmapContent.includes('Phase 3 Status: ✅ COMPLETED')) {
        this.successes.push('Phase 3 marked as completed in roadmap');
      } else {
        this.warnings.push('Phase 3 completion not documented in roadmap');
      }
    }
  }

  async assessCodeQuality() {
    this.log('Assessing Code Quality...', 'info');
    
    // Check for large files
    const srcPath = path.join(this.projectRoot, 'src');
    const largeFiles = this.findLargeFiles(srcPath, 500); // 500 lines
    if (largeFiles.length > 0) {
      this.warnings.push(`Large files found: ${largeFiles.length}`);
      largeFiles.forEach(file => {
        this.log(`Large file: ${file}`, 'warning');
      });
    }

    // Check for TypeScript files without proper typing
    const tsFiles = this.findTypeScriptFiles(srcPath);
    const untypedFiles = tsFiles.filter(file => {
      const content = fs.readFileSync(file, 'utf8');
      return content.includes(': any') || content.includes('any[]');
    });
    
    if (untypedFiles.length > 0) {
      this.warnings.push(`Files with 'any' types: ${untypedFiles.length}`);
    }

    // Check for unused imports
    const unusedImports = this.findUnusedImports(srcPath);
    if (unusedImports.length > 0) {
      this.warnings.push(`Files with unused imports: ${unusedImports.length}`);
    }
  }

  async checkArchitectureCompliance() {
    this.log('Checking Architecture Compliance...', 'info');
    
    // Check holon system
    const holonSystemPath = path.join(this.projectRoot, 'src/architecture/holonSystem.ts');
    if (fs.existsSync(holonSystemPath)) {
      this.successes.push('Holon system architecture exists');
    } else {
      this.issues.push('Holon system architecture missing');
    }

    // Check for holon directories
    const packagesPath = path.join(this.projectRoot, 'packages');
    if (fs.existsSync(packagesPath)) {
      this.warnings.push('Holons still in packages/ directory (needs migration)');
    }

    // Check component structure
    const componentsPath = path.join(this.projectRoot, 'src/components');
    if (fs.existsSync(componentsPath)) {
      const componentDirs = fs.readdirSync(componentsPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      
      this.successes.push(`Component structure: ${componentDirs.length} component directories`);
    }
  }

  async verifyDocumentation() {
    this.log('Verifying Documentation...', 'info');
    
    const requiredDocs = [
      'CHANGELOG.md',
      'DECISION_LOG.md',
      'LIVING_ROADMAP.md',
      'NEXT_SESSION_CONTEXT.md'
    ];

    requiredDocs.forEach(doc => {
      const docPath = path.join(this.projectRoot, doc);
      if (fs.existsSync(docPath)) {
        this.successes.push(`${doc} exists`);
      } else {
        this.issues.push(`${doc} missing`);
      }
    });

    // Check for recent updates
    const changelogPath = path.join(this.projectRoot, 'CHANGELOG.md');
    if (fs.existsSync(changelogPath)) {
      const changelogContent = fs.readFileSync(changelogPath, 'utf8');
      if (changelogContent.includes('PHASE 3 COMPLETION')) {
        this.successes.push('Phase 3 completion documented in changelog');
      } else {
        this.warnings.push('Phase 3 completion not documented in changelog');
      }
    }
  }

  findLargeFiles(dir, maxLines) {
    const largeFiles = [];
    
    const processDirectory = (currentDir) => {
      const items = fs.readdirSync(currentDir, { withFileTypes: true });
      
      items.forEach(item => {
        const fullPath = path.join(currentDir, item.name);
        
        if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
          processDirectory(fullPath);
        } else if (item.isFile() && (item.name.endsWith('.ts') || item.name.endsWith('.tsx'))) {
          const content = fs.readFileSync(fullPath, 'utf8');
          const lines = content.split('\n').length;
          
          if (lines > maxLines) {
            largeFiles.push({
              path: fullPath.replace(this.projectRoot, ''),
              lines
            });
          }
        }
      });
    };
    
    processDirectory(dir);
    return largeFiles;
  }

  findTypeScriptFiles(dir) {
    const tsFiles = [];
    
    const processDirectory = (currentDir) => {
      const items = fs.readdirSync(currentDir, { withFileTypes: true });
      
      items.forEach(item => {
        const fullPath = path.join(currentDir, item.name);
        
        if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
          processDirectory(fullPath);
        } else if (item.isFile() && (item.name.endsWith('.ts') || item.name.endsWith('.tsx'))) {
          tsFiles.push(fullPath);
        }
      });
    };
    
    processDirectory(dir);
    return tsFiles;
  }

  findUnusedImports(dir) {
    const filesWithUnusedImports = [];
    const tsFiles = this.findTypeScriptFiles(dir);
    
    tsFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const importLines = content.match(/import.*from.*['"]/g) || [];
      
      // Simple check for potentially unused imports
      importLines.forEach(importLine => {
        const importMatch = importLine.match(/import\s*{([^}]+)}\s*from/);
        if (importMatch) {
          const imports = importMatch[1].split(',').map(imp => imp.trim());
          imports.forEach(imp => {
            if (!content.includes(imp) && !content.includes(imp.split(' as ')[0])) {
              filesWithUnusedImports.push(file);
            }
          });
        }
      });
    });
    
    return [...new Set(filesWithUnusedImports)];
  }

  async checkProtocolUpdates() {
    this.log('Checking Protocol Update Requirements...', 'info');
    
    // Check for protocol files that need updates
    const protocolFiles = [
      'scripts/protocols/launch_protocol.cjs',
      'scripts/protocols/end_of_chat_protocol.js',
      'scripts/protocols/pre_wrap_audit_protocol.cjs',
      'scripts/governance/custodian_protocol.cjs'
    ];

    protocolFiles.forEach(protocolFile => {
      const protocolPath = path.join(this.projectRoot, protocolFile);
      if (fs.existsSync(protocolPath)) {
        this.successes.push(`${protocolFile} exists`);
        
        // Check for recent modifications (within last 7 days)
        const stats = fs.statSync(protocolPath);
        const daysSinceModified = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysSinceModified > 7) {
          this.warnings.push(`${protocolFile} hasn't been updated in ${Math.floor(daysSinceModified)} days`);
        }
      } else {
        this.issues.push(`${protocolFile} missing`);
      }
    });

    // Check for protocol integration in TypeScript
    const protocolManagerPath = path.join(this.projectRoot, 'src/core/protocols/ProtocolManager.ts');
    if (fs.existsSync(protocolManagerPath)) {
      const content = fs.readFileSync(protocolManagerPath, 'utf8');
      
      // Check if protocol manager has real script execution (not simulation)
      if (content.includes('executeExistingProtocol') && content.includes('child_process')) {
        this.successes.push('ProtocolManager has real script execution');
      } else {
        this.issues.push('ProtocolManager missing real script execution');
      }
      
      // Check for protocol validation
      if (content.includes('validateProtocolExecution')) {
        this.successes.push('Protocol validation exists');
      } else {
        this.warnings.push('Protocol validation missing');
      }
    } else {
      this.issues.push('ProtocolManager missing');
    }

    // Check for protocol catalog
    const scriptCatalogPath = path.join(this.projectRoot, 'scripts/script_catalog.json');
    if (fs.existsSync(scriptCatalogPath)) {
      const catalogContent = JSON.parse(fs.readFileSync(scriptCatalogPath, 'utf8'));
      const protocolScripts = catalogContent.scripts.filter(script => 
        script.category === 'protocol' || script.tags.includes('protocol')
      );
      
      if (protocolScripts.length >= 4) {
        this.successes.push(`Protocol catalog has ${protocolScripts.length} protocols`);
      } else {
        this.warnings.push(`Protocol catalog has only ${protocolScripts.length} protocols (expected 4+)`);
      }
    } else {
      this.issues.push('Script catalog missing');
    }

    // Check for protocol documentation
    const protocolDocs = [
      'greenlight-wiki/PROTOCOLS.md',
      'docs/protocols/',
      'DOCUMENTATION_CUSTODIAN_AND_SCRIPTMASTER.md'
    ];

    protocolDocs.forEach(doc => {
      const docPath = path.join(this.projectRoot, doc);
      if (fs.existsSync(docPath)) {
        this.successes.push(`Protocol documentation exists: ${doc}`);
      } else {
        this.warnings.push(`Protocol documentation missing: ${doc}`);
      }
    });

    // Check for protocol test coverage
    const testFiles = [
      'test-launch-protocol.cjs',
      'test-integration.js'
    ];

    testFiles.forEach(testFile => {
      const testPath = path.join(this.projectRoot, testFile);
      if (fs.existsSync(testPath)) {
        this.successes.push(`Protocol test exists: ${testFile}`);
      } else {
        this.warnings.push(`Protocol test missing: ${testFile}`);
      }
    });

    // Check for protocol update requirements in recent changes
    const gitStatus = this.getGitStatus();
    const protocolRelatedChanges = gitStatus.details.filter(file => 
      file.includes('protocol') || 
      file.includes('Protocol') || 
      file.includes('launch') ||
      file.includes('audit') ||
      file.includes('custodian')
    );

    if (protocolRelatedChanges.length > 0) {
      this.successes.push(`Protocol-related changes detected: ${protocolRelatedChanges.length} files`);
      protocolRelatedChanges.forEach(file => {
        this.log(`Protocol change: ${file}`, 'info');
      });
    } else {
      this.warnings.push('No protocol-related changes detected in recent commits');
    }
  }

  getGitStatus() {
    try {
      const gitOutput = execSync('git status --porcelain', { encoding: 'utf8' });
      const lines = gitOutput.split('\n').filter(line => line.trim());
      
      return {
        hasChanges: lines.length > 0,
        modifiedFiles: lines.length,
        details: lines.map(line => line.substring(3)) // Remove status prefix
      };
    } catch (error) {
      return {
        hasChanges: false,
        modifiedFiles: 0,
        details: []
      };
    }
  }

  generateSummary() {
    console.log('\n' + '='.repeat(60));
    this.log('AUDIT SUMMARY', 'info');
    console.log('='.repeat(60));
    
    this.log(`✅ Successes: ${this.successes.length}`, 'info');
    this.successes.forEach(success => {
      this.log(`  • ${success}`, 'info');
    });
    
    if (this.warnings.length > 0) {
      this.log(`⚠️  Warnings: ${this.warnings.length}`, 'warning');
      this.warnings.forEach(warning => {
        this.log(`  • ${warning}`, 'warning');
      });
    }
    
    if (this.issues.length > 0) {
      this.log(`❌ Issues: ${this.issues.length}`, 'error');
      this.issues.forEach(issue => {
        this.log(`  • ${issue}`, 'error');
      });
    }
    
    console.log('\n' + '='.repeat(60));
    
    if (this.issues.length === 0) {
      this.log('🎉 PRECOMMIT AUDIT PASSED - Ready for Phase 4!', 'info');
      this.log('Next: Execute Holon Directory Migration', 'info');
    } else {
      this.log('🚨 PRECOMMIT AUDIT FAILED - Fix issues before proceeding', 'error');
      this.log('Address critical issues before Phase 4 execution', 'error');
    }
    
    console.log('='.repeat(60));
  }
}

// Run the audit
const audit = new PrecommitAudit();
audit.runAudit().catch(error => {
  console.error('Audit failed:', error);
  process.exit(1);
}); 