#!/usr/bin/env node

/**
 * Protocol Validation System
 * 
 * PURPOSE: Prevents protocol execution errors by validating syntax, dependencies, 
 * and integration points before execution. Ensures protocols are safe to run.
 * 
 * FEATURES:
 * - Syntax validation for all protocol files
 * - Dependency checking
 * - Integration point validation
 * - Variable scoping validation
 * - Pre-execution safety checks
 * - Error prevention and reporting
 */

const fs = require('fs');
const path = require('path');
const CommandExecutionOptimizer = require('./command_execution_optimizer.cjs');

class ProtocolValidator {
  constructor() {
    this.projectRoot = process.cwd();
    this.sessionId = `validation-${Date.now()}`;
    this.validationResults = {};
    this.errors = [];
    this.warnings = [];
    this.successes = [];
    this.executor = new CommandExecutionOptimizer();
  }

  async validateAllProtocols() {
    console.log('🔍 Protocol Validation System');
    console.log('============================');
    console.log(`Session ID: ${this.sessionId}`);
    console.log('');

    try {
      // Phase 1: Validate Protocol Files
      await this.validateProtocolFiles();
      
      // Phase 2: Validate Syntax
      await this.validateSyntax();
      
      // Phase 3: Validate Dependencies
      await this.validateDependencies();
      
      // Phase 4: Validate Integration Points
      await this.validateIntegrationPoints();
      
      // Phase 5: Validate Variable Scoping
      await this.validateVariableScoping();
      
      // Phase 6: Generate Validation Report
      await this.generateValidationReport();
      
      console.log('');
      console.log('✅ Protocol Validation Complete');
      console.log(`🔍 Validated: ${Object.keys(this.validationResults).length} protocols`);
      console.log(`❌ Errors: ${this.errors.length}`);
      console.log(`⚠️  Warnings: ${this.warnings.length}`);
      console.log(`✅ Successes: ${this.successes.length}`);
      
      return this.errors.length === 0;
      
    } catch (error) {
      console.error('❌ Protocol Validation Failed:', error.message);
      this.logError(error);
      return false;
    }
  }

  async validateProtocolFiles() {
    console.log('📁 Phase 1: Validating Protocol Files');
    
    const protocolFiles = [
      'scripts/protocols/launch_protocol.cjs',
      'scripts/protocols/end_of_chat_protocol.js',
      'scripts/protocols/pre_wrap_audit_protocol.cjs',
      'scripts/governance/custodian_protocol.cjs'
    ];

    for (const protocolFile of protocolFiles) {
      const protocolPath = path.join(this.projectRoot, protocolFile);
      
      if (fs.existsSync(protocolPath)) {
        this.successes.push(`${protocolFile} exists`);
        
        // Check file size
        const stats = fs.statSync(protocolPath);
        if (stats.size > 0) {
          this.successes.push(`${protocolFile} has content`);
        } else {
          this.errors.push(`${protocolFile} is empty`);
        }
        
        // Check file permissions
        try {
          fs.accessSync(protocolPath, fs.constants.R_OK);
          this.successes.push(`${protocolFile} is readable`);
        } catch (error) {
          this.errors.push(`${protocolFile} is not readable`);
        }
        
        this.validationResults[protocolFile] = {
          exists: true,
          size: stats.size,
          readable: true,
          content: fs.readFileSync(protocolPath, 'utf8')
        };
      } else {
        this.errors.push(`${protocolFile} missing`);
        this.validationResults[protocolFile] = {
          exists: false,
          size: 0,
          readable: false,
          content: null
        };
      }
    }
  }

  async validateSyntax() {
    console.log('🔤 Phase 2: Validating Syntax');
    
    for (const [protocolFile, result] of Object.entries(this.validationResults)) {
      if (!result.exists || !result.content) continue;
      
      try {
        // For .cjs files, validate with Node.js
        if (protocolFile.endsWith('.cjs')) {
          // Check for basic syntax errors
          const syntaxErrors = this.checkCJSSyntax(result.content);
          if (syntaxErrors.length === 0) {
            this.successes.push(`${protocolFile} syntax is valid`);
          } else {
            this.errors.push(`${protocolFile} has syntax errors: ${syntaxErrors.join(', ')}`);
          }
        }
        
        // For .js files, validate with Node.js
        if (protocolFile.endsWith('.js')) {
          const syntaxErrors = this.checkJSSyntax(result.content);
          if (syntaxErrors.length === 0) {
            this.successes.push(`${protocolFile} syntax is valid`);
          } else {
            this.errors.push(`${protocolFile} has syntax errors: ${syntaxErrors.join(', ')}`);
          }
        }
        
      } catch (error) {
        this.errors.push(`${protocolFile} syntax validation failed: ${error.message}`);
      }
    }
  }

  checkCJSSyntax(content) {
    const errors = [];
    
    // Check for undefined variables
    const undefinedVars = this.findUndefinedVariables(content);
    if (undefinedVars.length > 0) {
      errors.push(`Undefined variables: ${undefinedVars.join(', ')}`);
    }
    
    // Check for missing semicolons in critical places
    const missingSemicolons = this.findMissingSemicolons(content);
    if (missingSemicolons.length > 0) {
      errors.push(`Missing semicolons: ${missingSemicolons.join(', ')}`);
    }
    
    // Check for unclosed brackets/parentheses
    const unclosedBrackets = this.findUnclosedBrackets(content);
    if (unclosedBrackets.length > 0) {
      errors.push(`Unclosed brackets: ${unclosedBrackets.join(', ')}`);
    }
    
    return errors;
  }

  checkJSSyntax(content) {
    const errors = [];
    
    // Check for ES6 module syntax issues
    const moduleErrors = this.findModuleErrors(content);
    if (moduleErrors.length > 0) {
      errors.push(`Module errors: ${moduleErrors.join(', ')}`);
    }
    
    // Check for async/await syntax
    const asyncErrors = this.findAsyncErrors(content);
    if (asyncErrors.length > 0) {
      errors.push(`Async errors: ${asyncErrors.join(', ')}`);
    }
    
    return errors;
  }

  findUndefinedVariables(content) {
    const undefinedVars = [];
    
    // Look for variable references that might be undefined
    const varPattern = /\b(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g;
    const declaredVars = new Set();
    let match;
    
    while ((match = varPattern.exec(content)) !== null) {
      declaredVars.add(match[1]);
    }
    
    // Look for variable usage
    const usagePattern = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*[=;,\[\]]/g;
    while ((match = usagePattern.exec(content)) !== null) {
      const varName = match[1];
      if (!declaredVars.has(varName) && 
          !['require', 'module', 'exports', 'console', 'process', 'fs', 'path', 'execSync'].includes(varName)) {
        undefinedVars.push(varName);
      }
    }
    
    return [...new Set(undefinedVars)];
  }

  findMissingSemicolons(content) {
    const missingSemicolons = [];
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && !line.endsWith(';') && !line.endsWith('{') && !line.endsWith('}') && 
          !line.startsWith('//') && !line.startsWith('/*') && !line.startsWith('*')) {
        // Check if this looks like a statement that should end with semicolon
        if (line.includes('=') || line.includes('return') || line.includes('throw')) {
          missingSemicolons.push(`Line ${i + 1}: ${line.substring(0, 50)}...`);
        }
      }
    }
    
    return missingSemicolons;
  }

  findUnclosedBrackets(content) {
    const unclosedBrackets = [];
    const stack = [];
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '{' || char === '(' || char === '[') {
          stack.push({ char, line: i + 1, col: j + 1 });
        } else if (char === '}' || char === ')' || char === ']') {
          const expected = char === '}' ? '{' : char === ')' ? '(' : '[';
          if (stack.length === 0 || stack.pop().char !== expected) {
            unclosedBrackets.push(`Line ${i + 1}: Mismatched ${char}`);
          }
        }
      }
    }
    
    if (stack.length > 0) {
      stack.forEach(item => {
        unclosedBrackets.push(`Line ${item.line}: Unclosed ${item.char}`);
      });
    }
    
    return unclosedBrackets;
  }

  findModuleErrors(content) {
    const errors = [];
    
    // Check for import/export syntax in .js files
    if (content.includes('import ') || content.includes('export ')) {
      if (!content.includes('"type": "module"')) {
        errors.push('ES6 modules detected but package.json missing "type": "module"');
      }
    }
    
    return errors;
  }

  findAsyncErrors(content) {
    const errors = [];
    
    // Check for await without async
    const awaitPattern = /\bawait\s+/g;
    const asyncPattern = /\basync\s+/g;
    const awaitMatches = content.match(awaitPattern) || [];
    const asyncMatches = content.match(asyncPattern) || [];
    
    if (awaitMatches.length > asyncMatches.length) {
      errors.push('More await statements than async functions');
    }
    
    return errors;
  }

  async validateDependencies() {
    console.log('📦 Phase 3: Validating Dependencies');
    
    for (const [protocolFile, result] of Object.entries(this.validationResults)) {
      if (!result.exists || !result.content) continue;
      
      const dependencies = this.extractDependencies(result.content);
      
      for (const dep of dependencies) {
        if (dep.type === 'require') {
          // Check if required module exists
          const modulePath = this.resolveModulePath(dep.name, protocolFile);
          if (modulePath && fs.existsSync(modulePath)) {
            this.successes.push(`${protocolFile} dependency ${dep.name} exists`);
          } else {
            this.errors.push(`${protocolFile} missing dependency: ${dep.name}`);
          }
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
    
    // Extract import statements
    const importPattern = /import\s+.*from\s+['"`]([^'"`]+)['"`]/g;
    while ((match = importPattern.exec(content)) !== null) {
      dependencies.push({
        type: 'import',
        name: match[1],
        line: content.substring(0, match.index).split('\n').length
      });
    }
    
    return dependencies;
  }

  resolveModulePath(moduleName, protocolFile) {
    // Handle relative paths
    if (moduleName.startsWith('./') || moduleName.startsWith('../')) {
      const protocolDir = path.dirname(path.join(this.projectRoot, protocolFile));
      return path.resolve(protocolDir, moduleName);
    }
    
    // Handle built-in modules
    if (['fs', 'path', 'child_process', 'events'].includes(moduleName)) {
      return 'built-in';
    }
    
    // Handle node_modules
    const nodeModulesPath = path.join(this.projectRoot, 'node_modules', moduleName);
    if (fs.existsSync(nodeModulesPath)) {
      return nodeModulesPath;
    }
    
    return null;
  }

  async validateIntegrationPoints() {
    console.log('🔗 Phase 4: Validating Integration Points');
    
    const integrationPoints = [
      'SessionManager',
      'ProtocolManager',
      'GovernanceOrchestrator',
      'SystemMaster'
    ];
    
    for (const [protocolFile, result] of Object.entries(this.validationResults)) {
      if (!result.exists || !result.content) continue;
      
      for (const integrationPoint of integrationPoints) {
        if (result.content.includes(integrationPoint)) {
          // Check if the integration point actually exists
          const integrationPath = this.findIntegrationPath(integrationPoint);
          if (integrationPath && fs.existsSync(integrationPath)) {
            this.successes.push(`${protocolFile} integration point ${integrationPoint} exists`);
          } else {
            this.warnings.push(`${protocolFile} references ${integrationPoint} but file not found`);
          }
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

  async validateVariableScoping() {
    console.log('🔍 Phase 5: Validating Variable Scoping');
    
    for (const [protocolFile, result] of Object.entries(this.validationResults)) {
      if (!result.exists || !result.content) continue;
      
      const scopingErrors = this.checkVariableScoping(result.content);
      if (scopingErrors.length === 0) {
        this.successes.push(`${protocolFile} variable scoping is valid`);
      } else {
        this.errors.push(`${protocolFile} scoping errors: ${scopingErrors.join(', ')}`);
      }
    }
  }

  checkVariableScoping(content) {
    const errors = [];
    const lines = content.split('\n');
    
    // Check for variables used before declaration
    const declaredVars = new Set();
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Find variable declarations
      const declPattern = /\b(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g;
      let match;
      while ((match = declPattern.exec(line)) !== null) {
        declaredVars.add(match[1]);
      }
      
      // Check for variable usage before declaration
      const usagePattern = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*[=;,\[\]]/g;
      while ((match = usagePattern.exec(line)) !== null) {
        const varName = match[1];
        if (!declaredVars.has(varName) && 
            !['require', 'module', 'exports', 'console', 'process', 'fs', 'path', 'execSync', 'this'].includes(varName)) {
          errors.push(`Line ${i + 1}: Variable ${varName} used before declaration`);
        }
      }
    }
    
    return errors;
  }

  async generateValidationReport() {
    console.log('📄 Phase 6: Generating Validation Report');
    
    const report = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      validationResults: this.validationResults,
      errors: this.errors,
      warnings: this.warnings,
      successes: this.successes,
      summary: {
        totalProtocols: Object.keys(this.validationResults).length,
        totalErrors: this.errors.length,
        totalWarnings: this.warnings.length,
        totalSuccesses: this.successes.length,
        isValid: this.errors.length === 0
      }
    };

    const reportPath = path.join(this.projectRoot, 'data/protocols/protocol-validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`✅ Validation report generated: ${reportPath}`);
  }

  logError(error) {
    const errorLog = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      script: 'protocol_validation',
      error: {
        message: error.message,
        stack: error.stack
      }
    };

    const errorPath = path.join(this.projectRoot, 'data/protocols/protocol-validation-error.json');
    fs.writeFileSync(errorPath, JSON.stringify(errorLog, null, 2));
    console.error(`📁 Error logged to: ${errorPath}`);
  }
}

// Run the protocol validator
if (require.main === module) {
  const validator = new ProtocolValidator();
  validator.validateAllProtocols().then(isValid => {
    process.exit(isValid ? 0 : 1);
  }).catch(error => {
    console.error('Protocol validation failed:', error);
    process.exit(1);
  });
}

module.exports = ProtocolValidator; 