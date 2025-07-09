#!/usr/bin/env node

/**
 * Pre-Wrap Audit Protocol
 * Checks for any issues that could impede a successful session wrap/close.
 * To be invoked by the SessionsManager before executing the wrap protocol.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class PreWrapAudit {
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
    this.log('Starting Pre-Wrap Audit Protocol...', 'info');
    console.log('='.repeat(60));

    // 1. Check for incomplete tasks
    await this.checkIncompleteTasks();

    // 2. Check for missing logs
    await this.checkLogs();

    // 3. Check for failed tests
    await this.checkTests();

    // 4. Check for unresolved errors
    await this.checkErrors();

    // 5. Check documentation completeness
    await this.checkDocumentation();

    // 6. Check organizational structure
    await this.checkOrganizationalStructure();

    // 7. Check for orphaned scripts and functions
    await this.checkOrphanedScripts();

    // 8. Check holon parent relationships
    await this.checkHolonRelationships();

    // 9. Check piping and connections
    await this.checkPipingAndConnections();

    // Summary
    this.generateSummary();

    // Extract next session context
    await this.extractNextSessionContext();
  }

  async checkProtocolUpdates() {
    this.log('Checking Protocol Updates...', 'info');
    
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
      } else {
        this.issues.push(`${protocolFile} missing`);
      }
    });
  }

  async extractNextSessionContext() {
    // After all wrap checks and before final wrap output:
    // Find the latest sessionId
    const sessionsDir = path.join(__dirname, '../work_sessions');
    const sessionFiles = fs.readdirSync(sessionsDir)
      .filter(f => f.startsWith('session-') && f.endsWith('.json') && !f.includes('comm-errors'))
      .sort();
    const latestSession = sessionFiles[sessionFiles.length - 1];
    const sessionId = latestSession ? latestSession.replace('.json', '') : null;

    if (sessionId) {
      console.log(`✅ [${new Date().toISOString()}] Preparing next session context as part of wrap protocol...`);
      try {
        execSync(`node scripts/extract_session_communication.js --next-session --sessionId ${sessionId} --output NEXT_SESSION_CONTEXT.md`, { stdio: 'inherit' });
        console.log(`✅ [${new Date().toISOString()}] Next session context updated.`);
      } catch (err) {
        console.error(`❌ [${new Date().toISOString()}] Failed to prepare next session context:`, err);
      }
    } else {
      console.warn(`⚠️ [${new Date().toISOString()}] No sessionId found for next session context extraction.`);
    }
  }

  async checkIncompleteTasks() {
    this.log('Checking for incomplete tasks...', 'info');
    const sessionDir = path.join(this.projectRoot, 'work_sessions');
    if (fs.existsSync(sessionDir)) {
      const sessions = fs.readdirSync(sessionDir).filter(f => f.endsWith('.json'));
      if (sessions.length > 0) {
        const latestSession = sessions.sort().reverse()[0];
        const sessionData = JSON.parse(fs.readFileSync(path.join(sessionDir, latestSession), 'utf8'));
        if (sessionData.pendingTasks && sessionData.pendingTasks.length > 0) {
          this.issues.push(`There are ${sessionData.pendingTasks.length} pending tasks in the latest session.`);
        } else {
          this.successes.push('No pending tasks in the latest session.');
        }
      }
    }
  }

  async checkLogs() {
    this.log('Checking for missing logs...', 'info');
    const requiredLogs = [
      'CHANGELOG.md',
      'DECISION_LOG.md',
      'LIVING_ROADMAP.md',
      'NEXT_SESSION_CONTEXT.md'
    ];
    requiredLogs.forEach(log => {
      const logPath = path.join(this.projectRoot, log);
      if (!fs.existsSync(logPath)) {
        this.issues.push(`${log} is missing.`);
      } else {
        this.successes.push(`${log} exists.`);
      }
    });
  }

  async checkTests() {
    this.log('Checking for failed tests...', 'info');
    try {
      execSync('npm test', { stdio: 'pipe' });
      this.successes.push('All tests pass.');
    } catch (error) {
      this.issues.push('Some tests are failing.');
      this.log(`Test error: ${error.message}`, 'error');
    }
  }

  async checkErrors() {
    this.log('Checking for unresolved errors...', 'info');
    try {
      execSync('npm run lint', { stdio: 'pipe' });
      this.successes.push('No lint errors.');
    } catch (error) {
      this.issues.push('Lint errors detected.');
      this.log(`Lint error: ${error.message}`, 'error');
    }
    try {
      execSync('npm run build', { stdio: 'pipe' });
      this.successes.push('Build successful.');
    } catch (error) {
      this.issues.push('Build failed.');
      this.log(`Build error: ${error.message}`, 'error');
    }
  }

  async checkDocumentation() {
    this.log('Checking documentation completeness...', 'info');
    const docs = [
      'README.md',
      'CONTRIBUTING.md',
      'END_OF_CHAT_PROTOCOL.md'
    ];
    docs.forEach(doc => {
      const docPath = path.join(this.projectRoot, doc);
      if (!fs.existsSync(docPath)) {
        this.warnings.push(`${doc} is missing.`);
      } else {
        this.successes.push(`${doc} exists.`);
      }
    });
  }

  async checkOrganizationalStructure() {
    this.log('Checking organizational structure...', 'info');
    
    // Check for proper directory structure
    const requiredDirs = [
      'src/components',
      'src/services',
      'src/utils',
      'scripts',
      'elevate',
      'administrate',
      'elaborate'
    ];

    requiredDirs.forEach(dir => {
      const dirPath = path.join(this.projectRoot, dir);
      if (!fs.existsSync(dirPath)) {
        this.issues.push(`Required directory ${dir} is missing.`);
      } else {
        this.successes.push(`Directory ${dir} exists.`);
      }
    });

    // Check for proper file organization
    const srcPath = path.join(this.projectRoot, 'src');
    if (fs.existsSync(srcPath)) {
      const srcFiles = fs.readdirSync(srcPath, { withFileTypes: true })
        .filter(dirent => dirent.isFile() && dirent.name.endsWith('.tsx'))
        .map(dirent => dirent.name);
      
      if (srcFiles.length > 0) {
        this.warnings.push(`Found ${srcFiles.length} TypeScript files in src root. Files should be organized in subdirectories.`);
        srcFiles.forEach(file => {
          this.log(`Orphaned file: src/${file}`, 'warning');
        });
      }
    }
  }

  async checkOrphanedScripts() {
    this.log('Checking for orphaned scripts and functions...', 'info');
    
    // Check scripts directory for proper organization
    const scriptsPath = path.join(this.projectRoot, 'scripts');
    if (fs.existsSync(scriptsPath)) {
      const scriptFiles = fs.readdirSync(scriptsPath, { withFileTypes: true })
        .filter(dirent => dirent.isFile() && (dirent.name.endsWith('.js') || dirent.name.endsWith('.cjs')))
        .map(dirent => dirent.name);

      // Check for scripts that don't follow naming conventions
      const orphanedScripts = scriptFiles.filter(script => {
        const validPrefixes = ['pre_', 'post_', 'audit_', 'launch_', 'end_', 'fix_', 'check_', 'deploy_', 'test_'];
        return !validPrefixes.some(prefix => script.startsWith(prefix));
      });

      if (orphanedScripts.length > 0) {
        this.warnings.push(`Found ${orphanedScripts.length} scripts without proper naming conventions.`);
        orphanedScripts.forEach(script => {
          this.log(`Orphaned script: scripts/${script}`, 'warning');
        });
      }
    }

    // Check for functions without proper exports
    const srcPath = path.join(this.projectRoot, 'src');
    if (fs.existsSync(srcPath)) {
      const tsFiles = this.findTypeScriptFiles(srcPath);
      const orphanedFunctions = [];

      tsFiles.forEach(file => {
        try {
          const content = fs.readFileSync(file, 'utf8');
          const functionMatches = content.match(/function\s+(\w+)/g);
          const exportMatches = content.match(/export\s+(function|const|class|interface|type)/g);
          
          if (functionMatches && functionMatches.length > 0 && (!exportMatches || exportMatches.length === 0)) {
            orphanedFunctions.push(file);
          }
        } catch {
          // Skip files that can't be read
        }
      });

      if (orphanedFunctions.length > 0) {
        this.warnings.push(`Found ${orphanedFunctions.length} files with functions that may not be properly exported.`);
        orphanedFunctions.forEach(file => {
          this.log(`Potential orphaned functions: ${file}`, 'warning');
        });
      }
    }
  }

  async checkHolonRelationships() {
    this.log('Checking holon parent relationships...', 'info');
    
    // Check holon system architecture
    const holonSystemPath = path.join(this.projectRoot, 'src/architecture/holonSystem.ts');
    if (fs.existsSync(holonSystemPath)) {
      try {
        const content = fs.readFileSync(holonSystemPath, 'utf8');
        
        // Check for holons without proper parent relationships
        const holonMatches = content.match(/holon:\s*['"`]([^'"`]+)['"`]/g);
        const parentMatches = content.match(/parent:\s*['"`]([^'"`]+)['"`]/g);
        
        if (holonMatches && parentMatches) {
          const holons = holonMatches.map(match => match.match(/['"`]([^'"`]+)['"`]/)[1]);
          const parents = parentMatches.map(match => match.match(/['"`]([^'"`]+)['"`]/)[1]);
          
          // Check for holons without parents (unless they're principles)
          const principles = ['elevate', 'administrate', 'elaborate', 'greenlight'];
          const orphanedHolons = holons.filter(holon => {
            const holonIndex = holons.indexOf(holon);
            const hasParent = parents[holonIndex] && parents[holonIndex] !== 'null' && parents[holonIndex] !== 'undefined';
            const isPrinciple = principles.includes(holon);
            return !hasParent && !isPrinciple;
          });

          if (orphanedHolons.length > 0) {
            this.issues.push(`Found ${orphanedHolons.length} holons without proper parent relationships.`);
            orphanedHolons.forEach(holon => {
              this.log(`Orphaned holon: ${holon}`, 'error');
            });
          } else {
            this.successes.push('All holons have proper parent relationships.');
          }
        }
      } catch {
        this.warnings.push('Could not parse holon system architecture file.');
      }
    } else {
      this.issues.push('Holon system architecture file is missing.');
    }

    // Check for holon directories without proper structure
    const holonDirs = ['elevate', 'administrate', 'elaborate'];
    holonDirs.forEach(holonDir => {
      const dirPath = path.join(this.projectRoot, holonDir);
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath, { withFileTypes: true })
          .filter(dirent => dirent.isFile())
          .map(dirent => dirent.name);
        
        if (files.length === 0) {
          this.warnings.push(`Holon directory ${holonDir} is empty.`);
        } else {
          this.successes.push(`Holon directory ${holonDir} has ${files.length} files.`);
        }
      }
    });
  }

  async checkPipingAndConnections() {
    this.log('Checking piping and connections...', 'info');
    
    // Check for proper service connections
    const servicesPath = path.join(this.projectRoot, 'src/services');
    if (fs.existsSync(servicesPath)) {
      const serviceFiles = fs.readdirSync(servicesPath, { withFileTypes: true })
        .filter(dirent => dirent.isFile() && dirent.name.endsWith('.ts'))
        .map(dirent => dirent.name);

      serviceFiles.forEach(serviceFile => {
        try {
          const content = fs.readFileSync(path.join(servicesPath, serviceFile), 'utf8');
          
          // Check for proper imports
          const importMatches = content.match(/import.*from/g);
          if (!importMatches || importMatches.length === 0) {
            this.warnings.push(`Service ${serviceFile} has no imports - may be disconnected.`);
          }
          
          // Check for proper exports
          const exportMatches = content.match(/export/g);
          if (!exportMatches || exportMatches.length === 0) {
            this.warnings.push(`Service ${serviceFile} has no exports - may not be properly connected.`);
          }
        } catch {
          this.warnings.push(`Could not analyze service ${serviceFile}.`);
        }
      });
    }

    // Check for proper component connections
    const componentsPath = path.join(this.projectRoot, 'src/components');
    if (fs.existsSync(componentsPath)) {
      const componentDirs = fs.readdirSync(componentsPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      componentDirs.forEach(componentDir => {
        const indexPath = path.join(componentsPath, componentDir, 'index.ts');
        if (!fs.existsSync(indexPath)) {
          this.warnings.push(`Component directory ${componentDir} missing index.ts for proper exports.`);
        }
      });
    }

    // Check for proper routing and navigation
    const appPath = path.join(this.projectRoot, 'src/App.tsx');
    if (fs.existsSync(appPath)) {
      try {
        const content = fs.readFileSync(appPath, 'utf8');
        
        // Check for proper component imports
        const importMatches = content.match(/import.*from.*components/g);
        if (!importMatches || importMatches.length === 0) {
          this.warnings.push('App.tsx has no component imports - may be disconnected from component system.');
        }
        
        // Check for proper routing
        const routingMatches = content.match(/Route|Router|Switch/g);
        if (!routingMatches || routingMatches.length === 0) {
          this.warnings.push('App.tsx has no routing configuration - may not be properly connected.');
        }
      } catch {
        this.warnings.push('Could not analyze App.tsx for connections.');
      }
    }
  }

  findTypeScriptFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    items.forEach(item => {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        files.push(...this.findTypeScriptFiles(fullPath));
      } else if (item.name.endsWith('.ts') || item.name.endsWith('.tsx')) {
        files.push(fullPath);
      }
    });
    
    return files;
  }

  generateSummary() {
    console.log('\n' + '='.repeat(60));
    if (this.issues.length > 0) {
      this.log('Pre-Wrap Audit FAILED. Issues found:', 'error');
      this.issues.forEach(issue => this.log(issue, 'error'));
      process.exit(1);
    } else {
      this.log('Pre-Wrap Audit PASSED. No blocking issues found.', 'info');
      this.successes.forEach(success => this.log(success, 'info'));
      if (this.warnings.length > 0) {
        this.warnings.forEach(warning => this.log(warning, 'warning'));
      }
      process.exit(0);
    }
  }
}

// CLI entry point
if (require.main === module) {
  const audit = new PreWrapAudit();
  audit.runAudit().catch(err => {
    console.error('Pre-Wrap Audit Protocol failed:', err);
    process.exit(1);
  });
} 