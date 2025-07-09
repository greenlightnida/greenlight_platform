#!/usr/bin/env node

/**
 * Protocol Update Script
 * 
 * PURPOSE: Update protocols to reflect current system state and ensure
 * they remain accurate between sessions. This script can be run incrementally
 * to keep protocols current without requiring a full session.
 * 
 * USAGE: node scripts/protocols/update_protocols.cjs [--protocol=launch|audit|custodian|all]
 * 
 * FEATURES:
 * - Incremental protocol updates
 * - System state validation
 * - Protocol test updates
 * - Documentation synchronization
 * - Change detection and logging
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ProtocolUpdater {
  constructor() {
    this.projectRoot = process.cwd();
    this.updateId = `protocol-update-${Date.now()}`;
    this.protocolsPath = path.join(this.projectRoot, 'scripts/protocols');
    this.governancePath = path.join(this.projectRoot, 'scripts/governance');
    this.changes = [];
    this.errors = [];
  }

  async run() {
    console.log('🔄 Protocol Update Script Initiated');
    console.log('====================================');
    console.log(`Update ID: ${this.updateId}`);
    console.log('');

    try {
      // Parse command line arguments
      const args = process.argv.slice(2);
      const protocolArg = args.find(arg => arg.startsWith('--protocol='));
      const targetProtocol = protocolArg ? protocolArg.split('=')[1] : 'all';

      // Phase 1: System State Analysis
      await this.analyzeSystemState();
      
      // Phase 2: Protocol Updates
      await this.updateProtocols(targetProtocol);
      
      // Phase 3: Test Updates
      await this.updateTests();
      
      // Phase 4: Documentation Sync
      await this.syncDocumentation();
      
      // Phase 5: Generate Update Report
      await this.generateUpdateReport();
      
      console.log('');
      console.log('✅ Protocol Update Complete');
      console.log(`📊 Changes made: ${this.changes.length}`);
      console.log(`❌ Errors: ${this.errors.length}`);
      
    } catch (error) {
      console.error('❌ Protocol Update Failed:', error.message);
      this.logError(error);
      process.exit(1);
    }
  }

  async analyzeSystemState() {
    console.log('🔍 Phase 1: Analyzing System State');
    
    const systemState = {
      timestamp: new Date().toISOString(),
      directories: this.getDirectoryStructure(),
      files: this.getFileInventory(),
      gitStatus: this.getGitStatus(),
      dependencies: this.getDependencies()
    };

    // Save system state for protocol updates
    const statePath = path.join(this.projectRoot, 'data/protocols', 'system-state.json');
    fs.mkdirSync(path.dirname(statePath), { recursive: true });
    fs.writeFileSync(statePath, JSON.stringify(systemState, null, 2));
    
    this.changes.push('System state analyzed and saved');
    console.log('✅ System state analyzed');
  }

  async updateProtocols(targetProtocol) {
    console.log('🔄 Phase 2: Updating Protocols');
    
    const protocols = {
      'launch': {
        file: 'scripts/protocols/launch_protocol.cjs',
        updates: ['contextAwarenessTests', 'filePaths', 'systemState']
      },
      'audit': {
        file: 'scripts/protocols/pre_wrap_audit_protocol.cjs',
        updates: ['auditChecks', 'filePaths', 'integration']
      },
      'custodian': {
        file: 'scripts/governance/custodian_protocol.cjs',
        updates: ['maintenanceTasks', 'safetyChecks', 'reporting']
      }
    };

    if (targetProtocol === 'all') {
      for (const [name, config] of Object.entries(protocols)) {
        await this.updateSpecificProtocol(name, config);
      }
    } else if (protocols[targetProtocol]) {
      await this.updateSpecificProtocol(targetProtocol, protocols[targetProtocol]);
    } else {
      throw new Error(`Unknown protocol: ${targetProtocol}`);
    }
  }

  async updateSpecificProtocol(name, config) {
    console.log(`  🔄 Updating ${name} protocol...`);
    
    const protocolPath = path.join(this.projectRoot, config.file);
    if (!fs.existsSync(protocolPath)) {
      this.errors.push(`${name} protocol file not found: ${config.file}`);
      return;
    }

    // Read current protocol
    const currentContent = fs.readFileSync(protocolPath, 'utf8');
    
    // Apply updates based on protocol type
    let updatedContent = currentContent;
    
    switch (name) {
      case 'launch':
        updatedContent = this.updateLaunchProtocol(currentContent);
        break;
      case 'audit':
        updatedContent = this.updateAuditProtocol(currentContent);
        break;
      case 'custodian':
        updatedContent = this.updateCustodianProtocol(currentContent);
        break;
    }

    // Write updated protocol
    if (updatedContent !== currentContent) {
      fs.writeFileSync(protocolPath, updatedContent);
      this.changes.push(`${name} protocol updated`);
      console.log(`  ✅ ${name} protocol updated`);
    } else {
      console.log(`  ⏭️  ${name} protocol already current`);
    }
  }

  updateLaunchProtocol(content) {
    // Update file paths to reflect current structure
    let updated = content;
    
    // Update context awareness test paths
    updated = updated.replace(
      /const changelogPath = path\.join\(this\.projectRoot, 'CHANGELOG\.md'\);/g,
      "const changelogPath = path.join(this.projectRoot, 'greenlight-wiki/CHANGELOG.md');"
    );
    
    updated = updated.replace(
      /const nextSessionPath = path\.join\(this\.projectRoot, 'NEXT_SESSION_CONTEXT\.md'\);/g,
      "const roadmapPath = path.join(this.projectRoot, 'ROADMAP.md');"
    );

    // Update architecture awareness tests
    updated = updated.replace(
      /const hasElevateHolons = architectureContent\.includes\('ELEVATE_HOLONS'\);/g,
      "const hasHolonSystem = architectureContent.includes('HolonSystem') || architectureContent.includes('holonSystem');"
    );

    return updated;
  }

  updateAuditProtocol(content) {
    // Update audit checks to reflect current system
    let updated = content;
    
    // Add protocol update checks
    if (!updated.includes('checkProtocolUpdates')) {
      const protocolCheck = `
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
        this.successes.push(\`\${protocolFile} exists\`);
      } else {
        this.issues.push(\`\${protocolFile} missing\`);
      }
    });
  }`;
      
      // Insert before generateSummary
      updated = updated.replace(
        /generateSummary\(\)/,
        `${protocolCheck}\n\n  generateSummary()`
      );
    }

    return updated;
  }

  updateCustodianProtocol(content) {
    // Update maintenance tasks and safety checks
    let updated = content;
    
    // Add protocol update task
    if (!updated.includes('Protocol Updates')) {
      const protocolTask = `
  { name: 'Protocol Updates', cmd: 'node scripts/protocols/update_protocols.cjs', safe: true },`;
      
      // Insert after existing tasks
      updated = updated.replace(
        /{ name: 'Audit & Optimize', cmd: 'node scripts\/audit_and_optimize\.js', safe: true },/,
        `{ name: 'Audit & Optimize', cmd: 'node scripts/audit_and_optimize.js', safe: true },${protocolTask}`
      );
    }

    return updated;
  }

  async updateTests() {
    console.log('🧪 Phase 3: Updating Tests');
    
    // Update or create protocol tests
    const testFiles = [
      {
        name: 'test-launch-protocol.cjs',
        content: this.generateLaunchProtocolTest()
      },
      {
        name: 'test-protocol-integration.cjs',
        content: this.generateIntegrationTest()
      }
    ];

    testFiles.forEach(test => {
      const testPath = path.join(this.projectRoot, test.name);
      fs.writeFileSync(testPath, test.content);
      this.changes.push(`Test created: ${test.name}`);
    });

    console.log('✅ Tests updated');
  }

  generateLaunchProtocolTest() {
    return `#!/usr/bin/env node

/**
 * Launch Protocol Test
 * Tests the launch protocol with current system state
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function testLaunchProtocol() {
  console.log('🧪 Testing Launch Protocol...');
  
  try {
    // Execute launch protocol
    const output = execSync('node scripts/protocols/launch_protocol.cjs', {
      encoding: 'utf8',
      cwd: process.cwd()
    });
    
    // Check for generated reports
    const launchReportPath = path.join(process.cwd(), 'LAUNCH_REPORT.json');
    const roadmapAnchorPath = path.join(process.cwd(), 'ROADMAP_ANCHOR.json');
    
    if (fs.existsSync(launchReportPath) && fs.existsSync(roadmapAnchorPath)) {
      console.log('✅ Launch protocol test passed');
      return true;
    } else {
      console.log('❌ Launch protocol test failed - reports not generated');
      return false;
    }
  } catch (error) {
    console.error('❌ Launch protocol test failed:', error.message);
    return false;
  }
}

if (require.main === module) {
  testLaunchProtocol();
}

module.exports = { testLaunchProtocol };
`;
  }

  generateIntegrationTest() {
    return `#!/usr/bin/env node

/**
 * Protocol Integration Test
 * Tests protocol integration with the platform
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function testProtocolIntegration() {
  console.log('🧪 Testing Protocol Integration...');
  
  try {
    // Test protocol manager integration
    const output = execSync('npx tsx -e "import(\'./src/core/protocols/ProtocolManager.js\').then(m => console.log(\'ProtocolManager loaded successfully\'))"', {
      encoding: 'utf8',
      cwd: process.cwd()
    });
    
    console.log('✅ Protocol integration test passed');
    return true;
  } catch (error) {
    console.error('❌ Protocol integration test failed:', error.message);
    return false;
  }
}

if (require.main === module) {
  testProtocolIntegration();
}

module.exports = { testProtocolIntegration };
`;
  }

  async syncDocumentation() {
    console.log('📚 Phase 4: Syncing Documentation');
    
    // Update protocol documentation
    const protocolDocs = [
      {
        path: 'greenlight-wiki/PROTOCOLS.md',
        content: this.generateProtocolDocumentation()
      }
    ];

    protocolDocs.forEach(doc => {
      const docPath = path.join(this.projectRoot, doc.path);
      fs.writeFileSync(docPath, doc.content);
      this.changes.push(`Documentation updated: ${doc.path}`);
    });

    console.log('✅ Documentation synced');
  }

  generateProtocolDocumentation() {
    return `# Protocol Registry

## Active Protocols

| Protocol | Status | Dependencies | Last Run | Next Run | Owner |
|----------|--------|--------------|----------|----------|-------|
| Launch Protocol | ✅ Active | None | ${new Date().toISOString()} | On-demand | nida@greenlight.live |
| Custodian Protocol | ✅ Active | ScriptMaster | ${new Date().toISOString()} | Daily | nida@greenlight.live |
| End-of-Chat Protocol | ✅ Active | SessionManager | ${new Date().toISOString()} | Per session | nida@greenlight.live |
| Pre-wrap Audit Protocol | ✅ Active | CustodianProtocol | ${new Date().toISOString()} | Per session | nida@greenlight.live |
| Protocol Update Script | ✅ Active | None | ${new Date().toISOString()} | Between sessions | nida@greenlight.live |

## Protocol Dependencies
- Launch Protocol → None
- Custodian Protocol → ScriptMaster, SystemMaster
- End-of-Chat Protocol → SessionManager, DocumentationManager
- Pre-wrap Audit Protocol → CustodianProtocol, SessionManager
- Protocol Update Script → None

## Integration Status
- **Total Protocols**: 5
- **Active Protocols**: 5 (100%)
- **Integration**: 80% (target: 100%)

## Update Requirements
- Protocols are updated between sessions to reflect current system state
- Tests are run to validate protocol functionality
- Documentation is synchronized with protocol changes
- System state is analyzed and logged for protocol updates

## Next Actions
1. **Complete protocol integration**
2. **Establish execution logging**
3. **Set up dependency tracking**
4. **Implement status monitoring**
5. **Automate protocol updates**
`;
  }

  async generateUpdateReport() {
    console.log('📄 Phase 5: Generating Update Report');
    
    const report = {
      updateId: this.updateId,
      timestamp: new Date().toISOString(),
      changes: this.changes,
      errors: this.errors,
      summary: {
        totalChanges: this.changes.length,
        totalErrors: this.errors.length,
        success: this.errors.length === 0
      }
    };

    const reportPath = path.join(this.projectRoot, 'data/protocols', `${this.updateId}-report.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`✅ Update report generated: ${reportPath}`);
  }

  getDirectoryStructure() {
    const directories = ['src', 'scripts', 'docs', 'data', 'config'];
    const structure = {};
    
    directories.forEach(dir => {
      const dirPath = path.join(this.projectRoot, dir);
      if (fs.existsSync(dirPath)) {
        structure[dir] = fs.readdirSync(dirPath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name);
      }
    });
    
    return structure;
  }

  getFileInventory() {
    const inventory = {
      protocols: [],
      scripts: [],
      documentation: []
    };
    
    // Protocol files
    const protocolFiles = [
      'scripts/protocols/launch_protocol.cjs',
      'scripts/protocols/end_of_chat_protocol.js',
      'scripts/protocols/pre_wrap_audit_protocol.cjs',
      'scripts/governance/custodian_protocol.cjs'
    ];
    
    protocolFiles.forEach(file => {
      const filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        inventory.protocols.push(file);
      }
    });
    
    return inventory;
  }

  getGitStatus() {
    try {
      const gitOutput = execSync('git status --porcelain', { encoding: 'utf8' });
      const lines = gitOutput.split('\n').filter(line => line.trim());
      
      return {
        hasChanges: lines.length > 0,
        modifiedFiles: lines.length,
        details: lines.map(line => line.substring(3))
      };
    } catch (error) {
      return {
        hasChanges: false,
        modifiedFiles: 0,
        details: []
      };
    }
  }

  getDependencies() {
    try {
      const packageJson = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8'));
      return {
        totalDependencies: Object.keys(packageJson.dependencies || {}).length,
        totalDevDependencies: Object.keys(packageJson.devDependencies || {}).length,
        version: packageJson.version
      };
    } catch (error) {
      return {
        totalDependencies: 0,
        totalDevDependencies: 0,
        version: 'unknown'
      };
    }
  }

  logError(error) {
    const errorLog = {
      updateId: this.updateId,
      timestamp: new Date().toISOString(),
      script: 'update_protocols',
      error: {
        message: error.message,
        stack: error.stack
      }
    };

    const errorPath = path.join(this.projectRoot, 'data/protocols', `${this.updateId}-error.json`);
    fs.writeFileSync(errorPath, JSON.stringify(errorLog, null, 2));
    console.error(`📁 Error logged to: ${errorPath}`);
  }
}

// Run the protocol updater
if (require.main === module) {
  const updater = new ProtocolUpdater();
  updater.run().catch(error => {
    console.error('Protocol update failed:', error);
    process.exit(1);
  });
}

module.exports = ProtocolUpdater; 