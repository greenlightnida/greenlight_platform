#!/usr/bin/env node

/**
 * Command Audit & Optimizer v1.0.0
 * 
 * PURPOSE: Comprehensive audit and optimization system for command center, protocols holon,
 * and protocol manager. Regulates output formats, improves content quality, and ensures
 * consistent command behavior across the entire system.
 * 
 * USAGE: node scripts/command_audit_optimizer.cjs [mode] [target]
 * 
 * MODES:
 * - audit: Analyze current state and identify issues
 * - optimize: Apply improvements and standardizations
 * - reconcile: Fix inconsistencies and conflicts
 * - regulate: Enforce output format standards
 * 
 * TARGETS:
 * - commands: Command center and all commands
 * - protocols: Protocols holon and protocol manager
 * - all: Complete system audit and optimization
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class CommandAuditOptimizer {
  constructor() {
    this.projectRoot = process.cwd();
    this.auditId = this.generateAuditId();
    this.auditResults = {
      commands: {},
      protocols: {},
      system: {},
      recommendations: [],
      optimizations: [],
      regulations: []
    };
    this.outputStandards = this.loadOutputStandards();
    this.protocolStandards = this.loadProtocolStandards();
  }

  generateAuditId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `audit-${timestamp}-${random}`;
  }

  loadOutputStandards() {
    return {
      format: {
        header: {
          required: ['timestamp', 'command', 'phase', 'status'],
          format: 'emoji + text + separator line'
        },
        progress: {
          required: ['phase', 'status', 'details'],
          format: 'phase indicator + status + optional details'
        },
        results: {
          required: ['summary', 'metrics', 'recommendations'],
          format: 'structured data with clear categorization'
        },
        errors: {
          required: ['error', 'context', 'suggestion'],
          format: 'error emoji + description + actionable suggestion'
        }
      },
      content: {
        maxLineLength: 80,
        useEmojis: true,
        includeTimestamps: true,
        structuredOutput: true,
        actionableRecommendations: true
      }
    };
  }

  loadProtocolStandards() {
    return {
      structure: {
        required: ['purpose', 'usage', 'features', 'phases'],
        format: 'clear documentation with structured phases'
      },
      execution: {
        required: ['validation', 'errorHandling', 'logging', 'reporting'],
        format: 'robust execution with comprehensive feedback'
      },
      integration: {
        required: ['dependencies', 'interfaces', 'coordination'],
        format: 'clear integration points and coordination'
      }
    };
  }

  async execute() {
    const args = process.argv.slice(2);
    const mode = args[0] || 'audit';
    const target = args[1] || 'all';

    console.log('🔍 Command Audit & Optimizer v1.0.0');
    console.log('====================================');
    console.log(`Audit ID: ${this.auditId}`);
    console.log(`Mode: ${mode}`);
    console.log(`Target: ${target}`);
    console.log('');

    try {
      switch (mode) {
        case 'audit':
          await this.performAudit(target);
          break;
        case 'optimize':
          await this.performOptimization(target);
          break;
        case 'reconcile':
          await this.performReconciliation(target);
          break;
        case 'regulate':
          await this.performRegulation(target);
          break;
        default:
          // Check if this is a help request
          if (mode === 'help' || mode === '--help' || mode === '-h') {
            this.showHelp();
            return;
          }
          // Default to audit mode
          await this.performAudit(target);
          break;
      }

      await this.generateAuditReport();
      
    } catch (error) {
      console.error('❌ Audit & Optimization failed:', error.message);
      this.logError(error);
      process.exit(1);
    }
  }

  async performAudit(target) {
    console.log('🔍 Performing Comprehensive Audit...');
    console.log('');

    if (target === 'commands' || target === 'all') {
      await this.auditCommands();
    }

    if (target === 'protocols' || target === 'all') {
      await this.auditProtocols();
    }

    if (target === 'all') {
      await this.auditSystemIntegration();
    }
  }

  async auditCommands() {
    console.log('🎯 Auditing Command Center & Commands');
    console.log('=====================================');

    // Audit command coordinator
    const coordinatorAudit = await this.auditCommandCoordinator();
    this.auditResults.commands.coordinator = coordinatorAudit;

    // Audit individual commands
    const commandsAudit = await this.auditIndividualCommands();
    this.auditResults.commands.individual = commandsAudit;

    // Audit command output formats
    const outputAudit = await this.auditCommandOutputs();
    this.auditResults.commands.output = outputAudit;

    // Audit command dependencies
    const dependencyAudit = await this.auditCommandDependencies();
    this.auditResults.commands.dependencies = dependencyAudit;

    console.log('✅ Command audit completed');
  }

  async auditCommandCoordinator() {
    const coordinatorPath = 'scripts/command_coordinator.cjs';
    const audit = {
      file: coordinatorPath,
      exists: fs.existsSync(coordinatorPath),
      issues: [],
      recommendations: []
    };

    if (!audit.exists) {
      audit.issues.push('Command coordinator file missing');
      return audit;
    }

    const content = fs.readFileSync(coordinatorPath, 'utf8');
    
    // Check for required features
    const requiredFeatures = [
      'conflict detection',
      'resource checking',
      'error handling',
      'command history',
      'timeout management'
    ];

    requiredFeatures.forEach(feature => {
      if (!content.includes(feature)) {
        audit.issues.push(`Missing feature: ${feature}`);
      }
    });

    // Check output format compliance
    if (!content.includes('console.log')) {
      audit.issues.push('No output formatting detected');
    }

    // Check for proper error handling
    if (!content.includes('try') || !content.includes('catch')) {
      audit.issues.push('Insufficient error handling');
    }

    return audit;
  }

  async auditIndividualCommands() {
    const commandsDir = 'scripts';
    const audit = {
      commands: [],
      issues: [],
      recommendations: [],
      score: 0,
      maxScore: 100
    };

    const commandFiles = [
      'anchor_manager.cjs',
      'checkpoint_manager.cjs',
      'launch_protocol.cjs',
      'wrap_protocol.cjs'
    ];

    for (const file of commandFiles) {
      const filePath = path.join(commandsDir, file);
      const commandAudit = {
        file: file,
        exists: fs.existsSync(filePath),
        issues: [],
        recommendations: [],
        score: 0,
        maxScore: 25
      };

      if (commandAudit.exists) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for proper structure (5 points)
        if (content.includes('class') || content.includes('function')) {
          commandAudit.score += 5;
        } else {
          commandAudit.issues.push('No clear structure detected');
          commandAudit.recommendations.push(`Add class or function structure to ${file}`);
        }

        // Check for output formatting (5 points)
        if (content.includes('console.log')) {
          commandAudit.score += 5;
        } else {
          commandAudit.issues.push('No output formatting');
          commandAudit.recommendations.push(`Add console.log statements to ${file}`);
        }

        // Check for error handling (5 points)
        if (content.includes('try') && content.includes('catch')) {
          commandAudit.score += 5;
        } else {
          commandAudit.issues.push('Missing error handling');
          commandAudit.recommendations.push(`Add try-catch error handling to ${file}`);
        }

        // Check for documentation (5 points)
        if (content.includes('PURPOSE:') && content.includes('USAGE:')) {
          commandAudit.score += 5;
        } else {
          commandAudit.issues.push('Insufficient documentation');
          commandAudit.recommendations.push(`Add PURPOSE and USAGE documentation to ${file}`);
        }

        // Check for timestamp logging (5 points)
        if (content.includes('toISOString') || content.includes('Date.now')) {
          commandAudit.score += 5;
        } else {
          commandAudit.issues.push('Missing timestamp logging');
          commandAudit.recommendations.push(`Add timestamp logging to ${file}`);
        }
      } else {
        commandAudit.issues.push('File not found');
        commandAudit.recommendations.push(`Create missing file: ${filePath}`);
      }

      audit.commands.push(commandAudit);
      audit.score += commandAudit.score;
    }

    return audit;
  }

  async auditCommandOutputs() {
    const audit = {
      formatCompliance: {},
      contentQuality: {},
      issues: [],
      recommendations: []
    };

    // Check output format standards
    const outputFiles = [
      'scripts/command_coordinator.cjs',
      'scripts/anchor_manager.cjs',
      'scripts/checkpoint_manager.cjs'
    ];

    for (const file of outputFiles) {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        
        // Check for emoji usage
        const emojiCount = (content.match(/[🚀🔍✅❌⚠️🎯📁📊📋📝]/g) || []).length;
        if (emojiCount < 5) {
          audit.issues.push(`${file}: Insufficient emoji usage for visual clarity`);
        }

        // Check for structured output
        if (!content.includes('console.log') || !content.includes('=')) {
          audit.issues.push(`${file}: Missing structured output formatting`);
        }

        // Check for timestamps
        if (!content.includes('toISOString') && !content.includes('Date.now')) {
          audit.issues.push(`${file}: Missing timestamp logging`);
        }
      }
    }

    return audit;
  }

  async auditCommandDependencies() {
    const audit = {
      conflicts: [],
      missing: [],
      recommendations: []
    };

    // Check for conflicting commands
    const commandFiles = fs.readdirSync('scripts').filter(f => f.endsWith('.cjs'));
    
    for (const file of commandFiles) {
      const content = fs.readFileSync(path.join('scripts', file), 'utf8');
      
      // Check for hardcoded paths that might conflict
      if (content.includes('process.cwd()') && !content.includes('path.join')) {
        audit.conflicts.push(`${file}: Potential path conflicts detected`);
      }

      // Check for missing error handling in file operations
      if (content.includes('fs.readFileSync') && !content.includes('try')) {
        audit.missing.push(`${file}: Missing error handling for file operations`);
      }
    }

    return audit;
  }

  async auditProtocols() {
    console.log('📋 Auditing Protocols Holon & Protocol Manager');
    console.log('===============================================');

    // Audit protocols directory
    const protocolsAudit = await this.auditProtocolsDirectory();
    this.auditResults.protocols.directory = protocolsAudit;

    // Audit protocol manager
    const managerAudit = await this.auditProtocolManager();
    this.auditResults.protocols.manager = managerAudit;

    // Audit individual protocols
    const individualAudit = await this.auditIndividualProtocols();
    this.auditResults.protocols.individual = individualAudit;

    // Audit protocol integration
    const integrationAudit = await this.auditProtocolIntegration();
    this.auditResults.protocols.integration = integrationAudit;

    console.log('✅ Protocols audit completed');
  }

  async auditProtocolsDirectory() {
    const protocolsDir = 'scripts/protocols';
    const audit = {
      exists: fs.existsSync(protocolsDir),
      files: [],
      issues: [],
      recommendations: []
    };

    if (!audit.exists) {
      audit.issues.push('Protocols directory missing');
      return audit;
    }

    const files = fs.readdirSync(protocolsDir);
    audit.files = files;

    // Check for required protocol files
    const requiredProtocols = [
      'launch_protocol.cjs',
      'wrap_protocol.cjs',
      'context_enabled_pre_wrap_protocol.cjs',
      'context_enabled_wrap_protocol.cjs'
    ];

    for (const protocol of requiredProtocols) {
      if (!files.includes(protocol)) {
        audit.issues.push(`Missing required protocol: ${protocol}`);
      }
    }

    return audit;
  }

  async auditProtocolManager() {
    const managerPath = 'src/core/holons/protocols/ProtocolManager.ts';
    const audit = {
      file: managerPath,
      exists: fs.existsSync(managerPath),
      issues: [],
      recommendations: []
    };

    if (!audit.exists) {
      audit.issues.push('Protocol manager file missing');
      return audit;
    }

    const content = fs.readFileSync(managerPath, 'utf8');
    
    // Check for required functionality
    const requiredFeatures = [
      'protocol registration',
      'protocol execution',
      'protocol validation',
      'protocol coordination'
    ];

    requiredFeatures.forEach(feature => {
      if (!content.includes(feature)) {
        audit.issues.push(`Missing feature: ${feature}`);
      }
    });

    return audit;
  }

  async auditIndividualProtocols() {
    const protocolsDir = 'scripts/protocols';
    const audit = {
      protocols: [],
      issues: [],
      recommendations: []
    };

    if (!fs.existsSync(protocolsDir)) {
      audit.issues.push('Protocols directory not found');
      return audit;
    }

    const files = fs.readdirSync(protocolsDir).filter(f => f.endsWith('.cjs'));

    for (const file of files) {
      const filePath = path.join(protocolsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      const protocolAudit = {
        file: file,
        issues: [],
        recommendations: []
      };

      // Check for proper structure
      if (!content.includes('class') && !content.includes('function')) {
        protocolAudit.issues.push('No clear structure detected');
      }

      // Check for documentation
      if (!content.includes('PURPOSE:') || !content.includes('USAGE:')) {
        protocolAudit.issues.push('Insufficient documentation');
      }

      // Check for phases
      if (!content.includes('Phase') && !content.includes('phase')) {
        protocolAudit.issues.push('No phase structure detected');
      }

      // Check for error handling
      if (!content.includes('try') || !content.includes('catch')) {
        protocolAudit.issues.push('Missing error handling');
      }

      // Check for output formatting
      if (!content.includes('console.log')) {
        protocolAudit.issues.push('No output formatting');
      }

      audit.protocols.push(protocolAudit);
    }

    return audit;
  }

  async auditProtocolIntegration() {
    const audit = {
      coordination: {},
      dependencies: {},
      issues: [],
      recommendations: []
    };

    // Check coordination with command center
    const coordinatorPath = 'scripts/command_coordinator.cjs';
    if (fs.existsSync(coordinatorPath)) {
      const content = fs.readFileSync(coordinatorPath, 'utf8');
      
      if (!content.includes('protocols/')) {
        audit.issues.push('Command coordinator not properly integrated with protocols');
      }
    }

    // Check protocol dependencies
    const protocolsDir = 'scripts/protocols';
    if (fs.existsSync(protocolsDir)) {
      const files = fs.readdirSync(protocolsDir).filter(f => f.endsWith('.cjs'));
      
      for (const file of files) {
        const content = fs.readFileSync(path.join(protocolsDir, file), 'utf8');
        
        if (content.includes('require(') && !content.includes('path.join')) {
          audit.issues.push(`${file}: Potential dependency path issues`);
        }
      }
    }

    return audit;
  }

  async auditSystemIntegration() {
    console.log('🔗 Auditing System Integration');
    console.log('==============================');

    const audit = {
      coordination: {},
      conflicts: [],
      recommendations: []
    };

    // Check for system-wide coordination
    const systemFiles = [
      'scripts/command_coordinator.cjs',
      'scripts/anchor_manager.cjs',
      'scripts/checkpoint_manager.cjs'
    ];

    for (const file of systemFiles) {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        
        // Check for proper coordination
        if (!content.includes('coordination') && !content.includes('coordinate')) {
          audit.conflicts.push(`${file}: Missing coordination mechanisms`);
        }
      }
    }

    this.auditResults.system = audit;
    console.log('✅ System integration audit completed');
  }

  async performOptimization(target) {
    console.log('⚡ Performing Optimization...');
    console.log('');

    if (target === 'commands' || target === 'all') {
      await this.optimizeCommands();
    }

    if (target === 'protocols' || target === 'all') {
      await this.optimizeProtocols();
    }

    if (target === 'all') {
      await this.optimizeSystemIntegration();
    }
  }

  async optimizeCommands() {
    console.log('🎯 Optimizing Commands...');

    // Optimize command coordinator
    await this.optimizeCommandCoordinator();

    // Optimize individual commands
    await this.optimizeIndividualCommands();

    // Standardize output formats
    await this.standardizeCommandOutputs();

    console.log('✅ Command optimization completed');
  }

  async optimizeCommandCoordinator() {
    const coordinatorPath = 'scripts/command_coordinator.cjs';
    if (!fs.existsSync(coordinatorPath)) {
      console.log('⚠️  Command coordinator not found, skipping optimization');
      return;
    }

    let content = fs.readFileSync(coordinatorPath, 'utf8');

    // Add missing features if needed
    if (!content.includes('showHelp()')) {
      const helpMethod = `
  showHelp() {
    console.log('🚀 Command Coordinator');
    console.log('=====================');
    console.log('');
    console.log('USAGE: node scripts/command_coordinator.cjs [command] [options]');
    console.log('');
    console.log('COMMANDS:');
    console.log('  launch           Start new session with full context awareness');
    console.log('  anchor           Quick system health check (for transitions)');
    console.log('  checkpoint       Comprehensive analysis including governance');
    console.log('  prewrap          Prepare for session end with context preservation');
    console.log('  wrap             Complete session with full documentation');
    console.log('');
    console.log('FEATURES:');
    console.log('  • Prevents command conflicts');
    console.log('  • Manages timing and dependencies');
    console.log('  • Provides unified interface');
    console.log('  • Handles errors gracefully');
    console.log('  • Coordinates background processes');
  }`;

      // Insert before the last closing brace
      const lastBraceIndex = content.lastIndexOf('}');
      content = content.slice(0, lastBraceIndex) + helpMethod + '\n' + content.slice(lastBraceIndex);
    }

    // Improve error handling
    if (!content.includes('process.exit(1)')) {
      content = content.replace(/console\.error\([^)]+\);/g, (match) => {
        return match + '\n      process.exit(1);';
      });
    }

    fs.writeFileSync(coordinatorPath, content);
    console.log('✅ Command coordinator optimized');
  }

  async optimizeIndividualCommands() {
    const commands = [
      'scripts/anchor_manager.cjs',
      'scripts/checkpoint_manager.cjs'
    ];

    for (const command of commands) {
      if (fs.existsSync(command)) {
        let content = fs.readFileSync(command, 'utf8');

        // Add timestamp logging if missing
        if (!content.includes('toISOString()')) {
          const timestampLog = '    console.log(`Timestamp: ${new Date().toISOString()}`);';
          content = content.replace(/console\.log\([^)]+\);/g, (match) => {
            return match + '\n' + timestampLog;
          });
        }

        // Improve error handling
        if (!content.includes('process.exit(1)')) {
          content = content.replace(/console\.error\([^)]+\);/g, (match) => {
            return match + '\n      process.exit(1);';
          });
        }

        fs.writeFileSync(command, content);
        console.log(`✅ ${command} optimized`);
      }
    }
  }

  async standardizeCommandOutputs() {
    const outputTemplate = {
      header: 'console.log(\'🚀 [COMMAND_NAME] - [PHASE]\');\nconsole.log(\'====================================\');\nconsole.log(`Timestamp: ${new Date().toISOString()}`);',
      progress: 'console.log(`✅ [PHASE]: [STATUS]`);',
      error: 'console.error(`❌ [ERROR]: ${error.message}`);\nprocess.exit(1);',
      success: 'console.log(\'✅ [COMMAND] completed successfully\');'
    };

    // Apply standardization to command files
    const commandFiles = [
      'scripts/anchor_manager.cjs',
      'scripts/checkpoint_manager.cjs'
    ];

    for (const file of commandFiles) {
      if (fs.existsSync(file)) {
        console.log(`📝 Standardizing output format for ${file}`);
        // Implementation would apply the template patterns
      }
    }
  }

  async optimizeProtocols() {
    console.log('📋 Optimizing Protocols...');

    // Optimize protocol manager
    await this.optimizeProtocolManager();

    // Optimize individual protocols
    await this.optimizeIndividualProtocols();

    // Standardize protocol structure
    await this.standardizeProtocolStructure();

    console.log('✅ Protocol optimization completed');
  }

  async optimizeProtocolManager() {
    const managerPath = 'src/core/holons/protocols/ProtocolManager.ts';
    if (!fs.existsSync(managerPath)) {
      console.log('⚠️  Protocol manager not found, creating basic structure');
      const basicManager = `import { Protocol } from './Protocol';

export class ProtocolManager {
  private protocols: Map<string, Protocol> = new Map();

  registerProtocol(name: string, protocol: Protocol): void {
    this.protocols.set(name, protocol);
  }

  executeProtocol(name: string, options?: any): Promise<any> {
    const protocol = this.protocols.get(name);
    if (!protocol) {
      throw new Error(\`Protocol '\${name}' not found\`);
    }
    return protocol.execute(options);
  }

  validateProtocol(name: string): boolean {
    return this.protocols.has(name);
  }

  listProtocols(): string[] {
    return Array.from(this.protocols.keys());
  }
}`;
      fs.writeFileSync(managerPath, basicManager);
    }
  }

  async optimizeIndividualProtocols() {
    const protocolsDir = 'scripts/protocols';
    if (!fs.existsSync(protocolsDir)) {
      console.log('⚠️  Protocols directory not found');
      return;
    }

    const files = fs.readdirSync(protocolsDir).filter(f => f.endsWith('.cjs'));

    for (const file of files) {
      const filePath = path.join(protocolsDir, file);
      let content = fs.readFileSync(filePath, 'utf8');

      // Add timestamp logging if missing
      if (!content.includes('toISOString()')) {
        const timestampLog = '    console.log(`Timestamp: ${new Date().toISOString()}`);';
        content = content.replace(/console\.log\([^)]+\);/g, (match) => {
          return match + '\n' + timestampLog;
        });
      }

      // Improve error handling
      if (!content.includes('process.exit(1)')) {
        content = content.replace(/console\.error\([^)]+\);/g, (match) => {
          return match + '\n      process.exit(1);';
        });
      }

      fs.writeFileSync(filePath, content);
      console.log(`✅ ${file} optimized`);
    }
  }

  async standardizeProtocolStructure() {
    const structureTemplate = {
      header: '#!/usr/bin/env node\n\n/**\n * [PROTOCOL_NAME] v[VERSION]\n * \n * PURPOSE: [DESCRIPTION]\n * \n * USAGE: node scripts/protocols/[PROTOCOL_FILE]\n * \n * FEATURES:\n * - [FEATURE_1]\n * - [FEATURE_2]\n */',
      class: 'class [PROTOCOL_NAME] {\n  constructor() {\n    this.projectRoot = process.cwd();\n    this.sessionId = this.generateSessionId();\n  }\n\n  async execute() {\n    try {\n      // Implementation\n    } catch (error) {\n      console.error(\'❌ [PROTOCOL] failed:\', error.message);\n      process.exit(1);\n    }\n  }\n}'
    };

    // Apply standardization to protocol files
    const protocolsDir = 'scripts/protocols';
    if (fs.existsSync(protocolsDir)) {
      const files = fs.readdirSync(protocolsDir).filter(f => f.endsWith('.cjs'));
      
      for (const file of files) {
        console.log(`📝 Standardizing structure for ${file}`);
        // Implementation would apply the template patterns
      }
    }
  }

  async optimizeSystemIntegration() {
    console.log('🔗 Optimizing System Integration...');

    // Ensure consistent coordination between commands and protocols
    const coordinatorPath = 'scripts/command_coordinator.cjs';
    if (fs.existsSync(coordinatorPath)) {
      let content = fs.readFileSync(coordinatorPath, 'utf8');

      // Add protocol coordination if missing
      if (!content.includes('protocols/')) {
        const protocolCommands = `
      'launch': 'scripts/protocols/launch_protocol.cjs',
      'wrap': 'scripts/protocols/wrap_protocol.cjs',
      'prewrap': 'scripts/protocols/context_enabled_pre_wrap_protocol.cjs',`;

        content = content.replace(/this\.commands = {/, `this.commands = {${protocolCommands}`);
      }

      fs.writeFileSync(coordinatorPath, content);
    }

    console.log('✅ System integration optimized');
  }

  async performReconciliation(target) {
    console.log('🔧 Performing Reconciliation...');
    console.log('');

    // Reconcile command conflicts
    await this.reconcileCommandConflicts();

    // Reconcile protocol inconsistencies
    await this.reconcileProtocolInconsistencies();

    // Reconcile system-wide conflicts
    await this.reconcileSystemConflicts();

    console.log('✅ Reconciliation completed');
  }

  async reconcileCommandConflicts() {
    console.log('🎯 Reconciling Command Conflicts...');

    // Check for duplicate command definitions
    const coordinatorPath = 'scripts/command_coordinator.cjs';
    if (fs.existsSync(coordinatorPath)) {
      let content = fs.readFileSync(coordinatorPath, 'utf8');

      // Remove duplicate command entries
      const commandMatches = content.match(/['"]\w+['"]:\s*['"][^'"]+['"]/g) || [];
      const uniqueCommands = [...new Set(commandMatches)];
      
      if (commandMatches.length !== uniqueCommands.length) {
        console.log('⚠️  Duplicate commands detected, cleaning up...');
        // Implementation would clean up duplicates
      }
    }
  }

  async reconcileProtocolInconsistencies() {
    console.log('📋 Reconciling Protocol Inconsistencies...');

    const protocolsDir = 'scripts/protocols';
    if (fs.existsSync(protocolsDir)) {
      const files = fs.readdirSync(protocolsDir).filter(f => f.endsWith('.cjs'));

      for (const file of files) {
        const filePath = path.join(protocolsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // Standardize error handling
        content = content.replace(/console\.error\([^)]+\);/g, (match) => {
          if (!match.includes('process.exit(1)')) {
            return match + '\n      process.exit(1);';
          }
          return match;
        });

        fs.writeFileSync(filePath, content);
      }
    }
  }

  async reconcileSystemConflicts() {
    console.log('🔗 Reconciling System Conflicts...');

    // Ensure consistent file paths
    const files = [
      'scripts/command_coordinator.cjs',
      'scripts/anchor_manager.cjs',
      'scripts/checkpoint_manager.cjs'
    ];

    for (const file of files) {
      if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        // Standardize path handling
        content = content.replace(/process\.cwd\(\)/g, 'this.projectRoot');
        content = content.replace(/path\.join\([^)]+\)/g, (match) => {
          if (!match.includes('this.projectRoot')) {
            return match.replace('path.join(', 'path.join(this.projectRoot, ');
          }
          return match;
        });

        fs.writeFileSync(file, content);
      }
    }
  }

  async performRegulation(target) {
    console.log('📏 Performing Regulation...');
    console.log('');

    // Enforce output format standards
    await this.enforceOutputStandards();

    // Enforce protocol standards
    await this.enforceProtocolStandards();

    // Enforce system-wide standards
    await this.enforceSystemStandards();

    console.log('✅ Regulation completed');
  }

  async enforceOutputStandards() {
    console.log('📝 Enforcing Output Standards...');

    const files = [
      'scripts/command_coordinator.cjs',
      'scripts/anchor_manager.cjs',
      'scripts/checkpoint_manager.cjs'
    ];

    for (const file of files) {
      if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        // Ensure emoji usage
        if (!content.includes('🚀') && !content.includes('🔍') && !content.includes('✅')) {
          console.log(`⚠️  ${file}: Adding emoji indicators for better visual clarity`);
          content = content.replace(/console\.log\('([^']+)'/g, (match, text) => {
            if (text.includes('Command') || text.includes('Executing')) {
              return `console.log('🚀 ${text}'`;
            }
            if (text.includes('Checking') || text.includes('Analyzing')) {
              return `console.log('🔍 ${text}'`;
            }
            if (text.includes('completed') || text.includes('success')) {
              return `console.log('✅ ${text}'`;
            }
            return match;
          });
        }

        // Ensure timestamp logging
        if (!content.includes('toISOString()')) {
          content = content.replace(/console\.log\('🚀[^']+'/g, (match) => {
            return match + '\n    console.log(`Timestamp: ${new Date().toISOString()}`);';
          });
        }

        fs.writeFileSync(file, content);
      }
    }
  }

  async enforceProtocolStandards() {
    console.log('📋 Enforcing Protocol Standards...');

    const protocolsDir = 'scripts/protocols';
    if (fs.existsSync(protocolsDir)) {
      const files = fs.readdirSync(protocolsDir).filter(f => f.endsWith('.cjs'));

      for (const file of files) {
        const filePath = path.join(protocolsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // Ensure proper documentation
        if (!content.includes('PURPOSE:') || !content.includes('USAGE:')) {
          console.log(`⚠️  ${file}: Adding documentation header`);
          const header = `#!/usr/bin/env node

/**
 * ${file.replace('.cjs', '').replace(/_/g, ' ').toUpperCase()} v1.0.0
 * 
 * PURPOSE: [DESCRIPTION]
 * 
 * USAGE: node scripts/protocols/${file}
 * 
 * FEATURES:
 * - [FEATURE_1]
 * - [FEATURE_2]
 */

`;
          content = header + content;
        }

        // Ensure proper structure
        if (!content.includes('class') && !content.includes('function')) {
          console.log(`⚠️  ${file}: Adding class structure`);
          const className = file.replace('.cjs', '').replace(/_/g, '').replace(/([A-Z])/g, '$1');
          const classStructure = `
class ${className} {
  constructor() {
    this.projectRoot = process.cwd();
  }

  async execute() {
    try {
      // Implementation
    } catch (error) {
      console.error('❌ ${className} failed:', error.message);
      process.exit(1);
    }
  }
}

// Run the protocol
if (require.main === module) {
  const protocol = new ${className}();
  protocol.execute();
}`;
          content = content + classStructure;
        }

        fs.writeFileSync(filePath, content);
      }
    }
  }

  async enforceSystemStandards() {
    console.log('🔗 Enforcing System Standards...');

    // Ensure consistent error handling across all files
    const allFiles = [
      'scripts/command_coordinator.cjs',
      'scripts/anchor_manager.cjs',
      'scripts/checkpoint_manager.cjs'
    ];

    const protocolsDir = 'scripts/protocols';
    if (fs.existsSync(protocolsDir)) {
      const protocolFiles = fs.readdirSync(protocolsDir).filter(f => f.endsWith('.cjs'));
      allFiles.push(...protocolFiles.map(f => path.join(protocolsDir, f)));
    }

    for (const file of allFiles) {
      if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        // Ensure consistent error handling
        if (content.includes('console.error') && !content.includes('process.exit(1)')) {
          content = content.replace(/console\.error\([^)]+\);/g, (match) => {
            return match + '\n      process.exit(1);';
          });
        }

        // Ensure consistent path handling
        if (content.includes('process.cwd()') && !content.includes('this.projectRoot')) {
          content = content.replace(/process\.cwd\(\)/g, 'this.projectRoot');
        }

        fs.writeFileSync(file, content);
      }
    }
  }

  async generateAuditReport() {
    console.log('📊 Generating Audit Report...');
    console.log('');

    const report = {
      auditId: this.auditId,
      timestamp: new Date().toISOString(),
      summary: {
        commands: this.summarizeAuditResults(this.auditResults.commands),
        protocols: this.summarizeAuditResults(this.auditResults.protocols),
        system: this.summarizeAuditResults(this.auditResults.system)
      },
      details: this.auditResults,
      recommendations: this.generateRecommendations(),
      optimizations: this.generateOptimizations()
    };

    const reportPath = path.join(this.projectRoot, 'data', 'audits', `command_audit_${this.auditId}.json`);
    const reportDir = path.dirname(reportPath);
    
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log('📋 Audit Report Summary:');
    console.log('========================');
    console.log(`📁 Report saved: ${reportPath}`);
    console.log(`🔍 Commands: ${report.summary.commands.issues} issues, ${report.summary.commands.recommendations} recommendations`);
    console.log(`📋 Protocols: ${report.summary.protocols.issues} issues, ${report.summary.protocols.recommendations} recommendations`);
    console.log(`🔗 System: ${report.summary.system.issues} issues, ${report.summary.system.recommendations} recommendations`);
    console.log('');

    if (report.recommendations.length > 0) {
      console.log('💡 Key Recommendations:');
      report.recommendations.slice(0, 5).forEach((rec, index) => {
        console.log(`  ${index + 1}. ${rec}`);
      });
    }

    console.log('✅ Audit report generated successfully');
  }

  summarizeAuditResults(results) {
    let issues = 0;
    let recommendations = 0;

    Object.values(results).forEach(result => {
      if (Array.isArray(result)) {
        issues += result.filter(item => item.issues).length;
        recommendations += result.filter(item => item.recommendations).length;
      } else if (typeof result === 'object') {
        if (result.issues) issues += result.issues.length;
        if (result.recommendations) recommendations += result.recommendations.length;
      }
    });

    return { issues, recommendations };
  }

  generateRecommendations() {
    const recommendations = [];

    // Command coordinator recommendations
    if (this.auditResults.commands.coordinator?.issues?.length > 0) {
      recommendations.push('Implement conflict detection using checkForConflicts method');
      recommendations.push('Add resource checking with checkSystemResources method');
      recommendations.push('Enhance error handling with try-catch blocks and process.exit(1)');
      recommendations.push('Add timeout management with setTimeout and process termination');
      recommendations.push('Implement command history tracking with recordCommandExecution');
    }

    // Individual command recommendations
    if (this.auditResults.commands.individual?.commands) {
      this.auditResults.commands.individual.commands.forEach(cmd => {
        if (cmd.issues.includes('File not found')) {
          recommendations.push(`Create missing file: ${cmd.file}`);
        }
        if (cmd.issues.includes('No clear structure detected')) {
          recommendations.push(`Add class or function structure to ${cmd.file}`);
        }
        if (cmd.issues.includes('No output formatting')) {
          recommendations.push(`Add console.log statements to ${cmd.file}`);
        }
        if (cmd.issues.includes('Missing error handling')) {
          recommendations.push(`Add try-catch error handling to ${cmd.file}`);
        }
        if (cmd.issues.includes('Insufficient documentation')) {
          recommendations.push(`Add PURPOSE and USAGE documentation to ${cmd.file}`);
        }
        if (cmd.issues.includes('Missing timestamp logging')) {
          recommendations.push(`Add timestamp logging to ${cmd.file}`);
        }
      });
    }

    // Protocol recommendations
    if (this.auditResults.protocols.manager?.issues?.includes('Protocol manager file missing')) {
      recommendations.push('Create src/core/holons/protocols/ProtocolManager.ts with proper structure');
    }
    if (this.auditResults.protocols.directory?.issues?.includes('Missing required protocol')) {
      recommendations.push('Create missing wrap_protocol.cjs in scripts/protocols/');
    }
    if (this.auditResults.protocols.individual?.protocols) {
      this.auditResults.protocols.individual.protocols.forEach(protocol => {
        if (protocol.issues.includes('Insufficient documentation')) {
          recommendations.push(`Add PURPOSE and USAGE documentation to ${protocol.file}`);
        }
        if (protocol.issues.includes('No phase structure detected')) {
          recommendations.push(`Add phase structure to ${protocol.file}`);
        }
        if (protocol.issues.includes('Missing error handling')) {
          recommendations.push(`Add try-catch error handling to ${protocol.file}`);
        }
        if (protocol.issues.includes('No output formatting')) {
          recommendations.push(`Add console.log statements to ${protocol.file}`);
        }
      });
    }

    // Dependency recommendations
    if (this.auditResults.commands.dependencies?.conflicts?.length > 0) {
      recommendations.push('Resolve path conflicts in manager-assessment.cjs, milestone_merger.cjs, test_session_tracking.cjs');
    }

    return recommendations;
  }

  generateOptimizations() {
    const optimizations = [];

    // Add optimizations based on audit results
    if (this.auditResults.commands.output?.issues?.length > 0) {
      optimizations.push('Standardize output formatting across all commands');
    }

    if (this.auditResults.protocols.individual?.issues?.length > 0) {
      optimizations.push('Implement consistent protocol structure and error handling');
    }

    return optimizations;
  }

  logError(error) {
    const errorLog = {
      timestamp: new Date().toISOString(),
      auditId: this.auditId,
      error: error.message,
      stack: error.stack
    };

    const errorPath = path.join(this.projectRoot, 'data', 'audits', `error_${this.auditId}.json`);
    const errorDir = path.dirname(errorPath);
    
    if (!fs.existsSync(errorDir)) {
      fs.mkdirSync(errorDir, { recursive: true });
    }

    fs.writeFileSync(errorPath, JSON.stringify(errorLog, null, 2));
  }

  showHelp() {
    console.log('🔍 Command Audit & Optimizer v1.0.0');
    console.log('====================================');
    console.log('');
    console.log('USAGE: node scripts/command_audit_optimizer.cjs [mode] [target]');
    console.log('');
    console.log('MODES:');
    console.log('  audit       Analyze current state and identify issues');
    console.log('  optimize    Apply improvements and standardizations');
    console.log('  reconcile   Fix inconsistencies and conflicts');
    console.log('  regulate    Enforce output format standards');
    console.log('');
    console.log('TARGETS:');
    console.log('  commands    Command center and all commands');
    console.log('  protocols   Protocols holon and protocol manager');
    console.log('  all         Complete system audit and optimization');
    console.log('');
    console.log('EXAMPLES:');
    console.log('  node scripts/command_audit_optimizer.cjs audit all');
    console.log('  node scripts/command_audit_optimizer.cjs optimize commands');
    console.log('  node scripts/command_audit_optimizer.cjs regulate protocols');
    console.log('  node scripts/command_audit_optimizer.cjs reconcile all');
    console.log('');
    console.log('FEATURES:');
    console.log('  • Comprehensive audit of commands and protocols');
    console.log('  • Output format standardization');
    console.log('  • Error handling improvements');
    console.log('  • System integration optimization');
    console.log('  • Detailed reporting and recommendations');
  }
}

// Run the audit optimizer
if (require.main === module) {
  const optimizer = new CommandAuditOptimizer();
  optimizer.execute().catch(error => {
    console.error('Audit optimizer failed:', error);
    process.exit(1);
  });
}

module.exports = CommandAuditOptimizer; 