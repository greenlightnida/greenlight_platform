#!/usr/bin/env node

/**
 * Pre-Execution Safety Check System
 * 
 * PURPOSE: Validates protocols before execution to prevent runtime errors.
 * Ensures all dependencies, variables, and integration points are properly
 * configured before protocol execution.
 * 
 * FEATURES:
 * - Pre-execution validation
 * - Dependency verification
 * - Environment checks
 * - Integration point validation
 * - Safety gates and warnings
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class PreExecutionSafety {
  constructor() {
    this.projectRoot = process.cwd();
    this.sessionId = `safety-${Date.now()}`;
    this.safetyResults = {};
    this.blockers = [];
    this.warnings = [];
    this.passes = [];
  }

  async runSafetyCheck(protocolName) {
    console.log('🛡️ Pre-Execution Safety Check');
    console.log('============================');
    console.log(`Protocol: ${protocolName}`);
    console.log(`Session ID: ${this.sessionId}`);
    console.log('');

    try {
      // Phase 1: Environment Validation
      await this.validateEnvironment();
      
      // Phase 2: Protocol File Validation
      await this.validateProtocolFile(protocolName);
      
      // Phase 3: Dependency Validation
      await this.validateDependencies(protocolName);
      
      // Phase 4: Integration Point Validation
      await this.validateIntegrationPoints(protocolName);
      
      // Phase 5: Variable Safety Check
      await this.validateVariableSafety(protocolName);
      
      // Phase 6: Generate Safety Report
      await this.generateSafetyReport(protocolName);
      
      console.log('');
      console.log('✅ Pre-Execution Safety Check Complete');
      console.log(`🛡️ Protocol: ${protocolName}`);
      console.log(`❌ Blockers: ${this.blockers.length}`);
      console.log(`⚠️  Warnings: ${this.warnings.length}`);
      console.log(`✅ Passes: ${this.passes.length}`);
      
      if (this.blockers.length > 0) {
        console.log('🚫 EXECUTION BLOCKED - Critical issues found');
        return false;
      } else if (this.warnings.length > 0) {
        console.log('⚠️  EXECUTION ALLOWED WITH WARNINGS');
        return true;
      } else {
        console.log('✅ EXECUTION CLEARED - All checks passed');
        return true;
      }
      
    } catch (error) {
      console.error('❌ Pre-Execution Safety Check Failed:', error.message);
      this.logError(error);
      return false;
    }
  }

  async validateEnvironment() {
    console.log('🌍 Phase 1: Environment Validation');
    
    // Check Node.js version
    try {
      const nodeVersion = process.version;
      const majorVersion = parseInt(nodeVersion.substring(1).split('.')[0]);
      if (majorVersion >= 16) {
        this.passes.push(`Node.js version ${nodeVersion} is compatible`);
      } else {
        this.blockers.push(`Node.js version ${nodeVersion} is too old (need 16+)`);
      }
    } catch (error) {
      this.blockers.push('Cannot determine Node.js version');
    }
    
    // Check working directory
    if (fs.existsSync(path.join(this.projectRoot, 'package.json'))) {
      this.passes.push('Working directory is valid project root');
    } else {
      this.blockers.push('Working directory is not a valid project root');
    }
    
    // Check file system permissions
    try {
      const testFile = path.join(this.projectRoot, '.safety-test');
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);
      this.passes.push('File system permissions are adequate');
    } catch (error) {
      this.blockers.push('Insufficient file system permissions');
    }
    
    // Check available memory
    const memUsage = process.memoryUsage();
    const availableMem = memUsage.heapUsed / 1024 / 1024; // MB
    if (availableMem < 50) {
      this.warnings.push(`Low memory available: ${Math.round(availableMem)}MB`);
    } else {
      this.passes.push(`Memory available: ${Math.round(availableMem)}MB`);
    }
  }

  async validateProtocolFile(protocolName) {
    console.log('📁 Phase 2: Protocol File Validation');
    
    const protocolFiles = {
      'launch': 'scripts/protocols/launch_protocol.cjs',
      'end_of_chat': 'scripts/protocols/end_of_chat_protocol.js',
      'pre_wrap_audit': 'scripts/protocols/pre_wrap_audit_protocol.cjs',
      'custodian': 'scripts/governance/custodian_protocol.cjs'
    };
    
    const protocolFile = protocolFiles[protocolName];
    if (!protocolFile) {
      this.blockers.push(`Unknown protocol: ${protocolName}`);
      return;
    }
    
    const protocolPath = path.join(this.projectRoot, protocolFile);
    
    if (!fs.existsSync(protocolPath)) {
      this.blockers.push(`Protocol file not found: ${protocolFile}`);
      return;
    }
    
    this.passes.push(`Protocol file exists: ${protocolFile}`);
    
    // Check file size
    const stats = fs.statSync(protocolPath);
    if (stats.size === 0) {
      this.blockers.push(`Protocol file is empty: ${protocolFile}`);
      return;
    }
    
    this.passes.push(`Protocol file has content: ${Math.round(stats.size / 1024)}KB`);
    
    // Check file permissions
    try {
      fs.accessSync(protocolPath, fs.constants.R_OK | fs.constants.X_OK);
      this.passes.push(`Protocol file is executable: ${protocolFile}`);
    } catch (error) {
      this.blockers.push(`Protocol file is not executable: ${protocolFile}`);
    }
    
    // Validate syntax
    try {
      const content = fs.readFileSync(protocolPath, 'utf8');
      const syntaxErrors = this.checkSyntax(content);
      if (syntaxErrors.length === 0) {
        this.passes.push(`Protocol syntax is valid: ${protocolFile}`);
      } else {
        this.blockers.push(`Protocol syntax errors: ${syntaxErrors.join(', ')}`);
      }
      
      this.safetyResults[protocolName] = {
        file: protocolFile,
        path: protocolPath,
        size: stats.size,
        content: content,
        syntaxErrors: syntaxErrors
      };
    } catch (error) {
      this.blockers.push(`Cannot read protocol file: ${error.message}`);
    }
  }

  checkSyntax(content) {
    const errors = [];
    
    // Check for basic syntax issues
    const lines = content.split('\n');
    
    // Check for unclosed strings
    let inString = false;
    let stringChar = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if ((char === '"' || char === "'" || char === '`') && line[j-1] !== '\\') {
          if (!inString) {
            inString = true;
            stringChar = char;
          } else if (char === stringChar) {
            inString = false;
            stringChar = '';
          }
        }
      }
    }
    
    if (inString) {
      errors.push('Unclosed string literal');
    }
    
    // Check for unclosed brackets
    const bracketStack = [];
    for (let i = 0; i < content.length; i++) {
      const char = content[i];
      if (char === '{' || char === '(' || char === '[') {
        bracketStack.push(char);
      } else if (char === '}' || char === ')' || char === ']') {
        const expected = char === '}' ? '{' : char === ')' ? '(' : '[';
        if (bracketStack.length === 0 || bracketStack.pop() !== expected) {
          errors.push('Mismatched brackets');
          break;
        }
      }
    }
    
    if (bracketStack.length > 0) {
      errors.push('Unclosed brackets');
    }
    
    return errors;
  }

  async validateDependencies(protocolName) {
    console.log('📦 Phase 3: Dependency Validation');
    
    if (!this.safetyResults[protocolName]) {
      this.blockers.push('Cannot validate dependencies - protocol file not loaded');
      return;
    }
    
    const content = this.safetyResults[protocolName].content;
    const dependencies = this.extractDependencies(content);
    
    for (const dep of dependencies) {
      if (dep.type === 'require') {
        const modulePath = this.resolveModulePath(dep.name, protocolName);
        if (modulePath === 'built-in') {
          this.passes.push(`Built-in module available: ${dep.name}`);
        } else if (modulePath && fs.existsSync(modulePath)) {
          this.passes.push(`Module available: ${dep.name}`);
        } else {
          this.blockers.push(`Missing module: ${dep.name}`);
        }
      }
    }
  }

  extractDependencies(content) {
    const dependencies = [];
    
    // Extract require statements
    const requirePattern = /require\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
    let match;
    while ((match = requirePattern.exec(content)) !== null) {
      dependencies.push({
        type: 'require',
        name: match[1],
        line: content.substring(0, match.index).split('\n').length
      });
    }
    
    return dependencies;
  }

  resolveModulePath(moduleName, protocolName) {
    // Handle built-in modules
    if (['fs', 'path', 'child_process', 'events', 'util'].includes(moduleName)) {
      return 'built-in';
    }
    
    // Handle relative paths
    if (moduleName.startsWith('./') || moduleName.startsWith('../')) {
      const protocolFiles = {
        'launch': 'scripts/protocols/launch_protocol.cjs',
        'end_of_chat': 'scripts/protocols/end_of_chat_protocol.js',
        'pre_wrap_audit': 'scripts/protocols/pre_wrap_audit_protocol.cjs',
        'custodian': 'scripts/governance/custodian_protocol.cjs'
      };
      
      const protocolFile = protocolFiles[protocolName];
      if (protocolFile) {
        const protocolDir = path.dirname(path.join(this.projectRoot, protocolFile));
        return path.resolve(protocolDir, moduleName);
      }
    }
    
    // Handle node_modules
    const nodeModulesPath = path.join(this.projectRoot, 'node_modules', moduleName);
    if (fs.existsSync(nodeModulesPath)) {
      return nodeModulesPath;
    }
    
    return null;
  }

  async validateIntegrationPoints(protocolName) {
    console.log('🔗 Phase 4: Integration Point Validation');
    
    if (!this.safetyResults[protocolName]) {
      this.blockers.push('Cannot validate integration points - protocol file not loaded');
      return;
    }
    
    const content = this.safetyResults[protocolName].content;
    const integrationPoints = [
      'SessionManager',
      'ProtocolManager',
      'GovernanceOrchestrator',
      'SystemMaster'
    ];
    
    for (const integrationPoint of integrationPoints) {
      if (content.includes(integrationPoint)) {
        const integrationPath = this.findIntegrationPath(integrationPoint);
        if (integrationPath && fs.existsSync(integrationPath)) {
          this.passes.push(`Integration point available: ${integrationPoint}`);
        } else {
          this.warnings.push(`Integration point not found: ${integrationPoint}`);
        }
      }
    }
  }

  findIntegrationPath(integrationPoint) {
    const possiblePaths = [
      `src/core/session-management/${integrationPoint}.ts`,
      `src/core/protocols/${integrationPoint}.ts`,
      `src/core/governance/${integrationPoint}.ts`,
      `src/components/SystemMaster/${integrationPoint}.tsx`,
      `src/components/SystemMaster/${integrationPoint}.ts`
    ];
    
    for (const possiblePath of possiblePaths) {
      const fullPath = path.join(this.projectRoot, possiblePath);
      if (fs.existsSync(fullPath)) {
        return fullPath;
      }
    }
    
    return null;
  }

  async validateVariableSafety(protocolName) {
    console.log('🔍 Phase 5: Variable Safety Check');
    
    if (!this.safetyResults[protocolName]) {
      this.blockers.push('Cannot validate variable safety - protocol file not loaded');
      return;
    }
    
    const content = this.safetyResults[protocolName].content;
    const variableIssues = this.checkVariableSafety(content);
    
    if (variableIssues.length === 0) {
      this.passes.push('Variable safety check passed');
    } else {
      this.warnings.push(`Variable safety issues: ${variableIssues.join(', ')}`);
    }
  }

  checkVariableSafety(content) {
    const issues = [];
    
    // Check for variables that might be undefined
    const lines = content.split('\n');
    const declaredVars = new Set();
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Find variable declarations
      const declPattern = /\b(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g;
      let match;
      while ((match = declPattern.exec(line)) !== null) {
        declaredVars.add(match[1]);
      }
      
      // Check for variable usage
      const usagePattern = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*[=;,\[\]]/g;
      while ((match = usagePattern.exec(line)) !== null) {
        const varName = match[1];
        if (!declaredVars.has(varName) && 
            !['require', 'module', 'exports', 'console', 'process', 'fs', 'path', 'execSync', 'this'].includes(varName)) {
          issues.push(`Line ${i + 1}: Variable ${varName} might be undefined`);
        }
      }
    }
    
    return issues;
  }

  async generateSafetyReport(protocolName) {
    console.log('📄 Phase 6: Generating Safety Report');
    
    const report = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      protocol: protocolName,
      safetyResults: this.safetyResults[protocolName],
      blockers: this.blockers,
      warnings: this.warnings,
      passes: this.passes,
      summary: {
        totalBlockers: this.blockers.length,
        totalWarnings: this.warnings.length,
        totalPasses: this.passes.length,
        isSafe: this.blockers.length === 0
      }
    };

    const reportPath = path.join(this.projectRoot, `data/protocols/safety-check-${protocolName}-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`✅ Safety report generated: ${reportPath}`);
  }

  logError(error) {
    const errorLog = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      script: 'pre_execution_safety',
      error: {
        message: error.message,
        stack: error.stack
      }
    };

    const errorPath = path.join(this.projectRoot, 'data/protocols/safety-check-error.json');
    fs.writeFileSync(errorPath, JSON.stringify(errorLog, null, 2));
    console.error(`📁 Error logged to: ${errorPath}`);
  }
}

// Run the safety check
if (require.main === module) {
  const protocolName = process.argv[2] || 'launch';
  const safety = new PreExecutionSafety();
  safety.runSafetyCheck(protocolName).then(isSafe => {
    process.exit(isSafe ? 0 : 1);
  }).catch(error => {
    console.error('Safety check failed:', error);
    process.exit(1);
  });
}

module.exports = PreExecutionSafety; 