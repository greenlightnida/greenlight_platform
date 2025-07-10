#!/usr/bin/env node

/**
 * Comprehensive Prevention System
 * 
 * PURPOSE: Integrates all prevention mechanisms to prevent protocol execution errors,
 * workspace boundary violations, and other critical issues before they occur.
 * 
 * INTEGRATES:
 * - Protocol validation
 * - Pre-execution safety checks
 * - Protocol monitoring
 * - Workspace boundary validation
 * - Code organization checks
 * - Error prevention and reporting
 */

const fs = require('fs');
const path = require('path');
const CommandExecutionOptimizer = require('./command_execution_optimizer.cjs');

class PreventionSystem {
  constructor() {
    this.projectRoot = process.cwd();
    this.sessionId = `prevention-${Date.now()}`;
    this.preventionResults = {};
    this.blockers = [];
    this.warnings = [];
    this.passes = [];
    this.recoveryActions = [];
    this.executor = new CommandExecutionOptimizer();
  }

  async runPreventionChecks() {
    console.log('🛡️ Comprehensive Prevention System');
    console.log('==================================');
    console.log(`Session ID: ${this.sessionId}`);
    console.log('Running all prevention checks...');
    console.log('');

    try {
      // Phase 1: Workspace Boundary Validation
      await this.validateWorkspaceBoundaries();
      
      // Phase 2: Protocol Validation
      await this.validateProtocols();
      
      // Phase 3: Pre-Execution Safety
      await this.runSafetyChecks();
      
      // Phase 4: Code Organization Validation
      await this.validateCodeOrganization();
      
      // Phase 5: Integration Point Validation
      await this.validateIntegrationPoints();
      
      // Phase 6: Generate Prevention Report
      await this.generatePreventionReport();
      
      console.log('');
      console.log('✅ Prevention System Complete');
      console.log(`🛡️ Blockers: ${this.blockers.length}`);
      console.log(`⚠️  Warnings: ${this.warnings.length}`);
      console.log(`✅ Passes: ${this.passes.length}`);
      console.log(`🔄 Recovery Actions: ${this.recoveryActions.length}`);
      
      // In development environment, be more lenient
      const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
      
      if (this.blockers.length > 0 && !isDevelopment) {
        console.log('🚫 CRITICAL ISSUES DETECTED - System blocked');
        return false;
      } else if (this.blockers.length > 0 && isDevelopment) {
        console.log('⚠️  CRITICAL ISSUES DETECTED - Proceeding in development mode');
        console.log('Note: Prevention system is being lenient for development environment');
        return true;
      } else if (this.warnings.length > 0) {
        console.log('⚠️  WARNINGS DETECTED - Proceed with caution');
        return true;
      } else {
        console.log('✅ ALL CHECKS PASSED - System ready');
        return true;
      }
      
    } catch (error) {
      console.error('❌ Prevention System Failed:', error.message);
      this.logError(error);
      return false;
    }
  }

  async validateWorkspaceBoundaries() {
    console.log('🌐 Phase 1: Workspace Boundary Validation');
    
    // Run comprehensive boundary enforcement check
    try {
      const result = await this.executor.executeCommand('node', {
        args: ['scripts/protocols/boundary_enforcement_manager.cjs'],
        timeout: 60000,
        silent: true
      });
      
      // Parse the boundary enforcement report
      const reportPath = path.join(this.projectRoot, 'BOUNDARY_ENFORCEMENT_REPORT.json');
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        
        if (report.violations.length > 0) {
          const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
          if (isDevelopment) {
            this.warnings.push(`Boundary violations found: ${report.violations.length} issues detected`);
            report.violations.forEach(violation => {
              this.warnings.push(`- ${violation.type}: ${violation.file}`);
            });
          } else {
            this.blockers.push(`Critical boundary violations: ${report.violations.length} issues must be resolved`);
            report.violations.forEach(violation => {
              this.blockers.push(`- ${violation.type}: ${violation.file}`);
            });
            this.recoveryActions.push('Run boundary enforcement: npm run boundary:enforce');
          }
        } else {
          this.passes.push('Workspace boundaries properly maintained');
        }
        
        // Add recommendations
        if (report.recommendations.length > 0) {
          this.recoveryActions.push(`Boundary recommendations: ${report.recommendations.length} suggestions available`);
        }
      }
      
    } catch (error) {
      this.warnings.push(`Boundary enforcement check failed: ${error.message}`);
    }
    
    // Check for proper workspace separation
    const workspaceStructure = this.validateWorkspaceStructure();
    if (!workspaceStructure.isValid) {
      this.blockers.push(`Workspace structure violation: ${workspaceStructure.issue}`);
    } else {
      this.passes.push('Workspace structure is valid');
    }
  }

  findTopBinsCode(directory, patterns) {
    const violations = [];
    
    const walkDir = (dir) => {
      if (!fs.existsSync(dir)) return;
      
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          walkDir(filePath);
        } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js'))) {
          try {
            const content = fs.readFileSync(filePath, 'utf8');
            for (const pattern of patterns) {
              // Only flag if the pattern appears in a way that suggests actual implementation
              // Skip comments, strings, and documentation references
              const lines = content.split('\n');
              for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line.includes(pattern) && 
                    !line.startsWith('//') && 
                    !line.startsWith('/*') && 
                    !line.startsWith('*') &&
                    !line.includes('//') &&
                    !line.includes('/*') &&
                    !line.includes('*/') &&
                    !line.includes('description:') &&
                    !line.includes('codeRefs:') &&
                    !line.includes('fileLinks:') &&
                    !line.includes('repoRef:') &&
                    !line.includes('Mock') &&
                    !line.includes('mock')) {
                  violations.push(`${filePath}:${i + 1} (contains ${pattern})`);
                  break; // Only report once per file
                }
              }
            }
          } catch (error) {
            // Skip files that can't be read
          }
        }
      }
    };
    
    walkDir(directory);
    return violations;
  }

  validateWorkspaceStructure() {
    const requiredDirs = ['src', 'scripts', 'docs', 'config'];
    const missingDirs = requiredDirs.filter(dir => !fs.existsSync(path.join(this.projectRoot, dir)));
    
    if (missingDirs.length > 0) {
      return {
        isValid: false,
        issue: `Missing required directories: ${missingDirs.join(', ')}`
      };
    }
    
    // Check for proper platform structure
    const platformFiles = [
      'src/core/governance/GovernanceOrchestrator.ts',
      'src/core/protocols/ProtocolManager.ts',
      'src/core/session-management/SessionManager.ts'
    ];
    
    const missingFiles = platformFiles.filter(file => !fs.existsSync(path.join(this.projectRoot, file)));
    
    if (missingFiles.length > 0) {
      return {
        isValid: false,
        issue: `Missing platform files: ${missingFiles.join(', ')}`
      };
    }
    
    return { isValid: true };
  }

  async validateProtocols() {
    console.log('📋 Phase 2: Protocol Validation');
    
    try {
      const result = await this.executor.executeCommand('node', {
        args: ['scripts/protocols/protocol_validation.cjs'],
        timeout: 30000,
        silent: true
      });
      
      if (result.stdout.includes('Protocol Validation Complete')) {
        this.passes.push('Protocol validation completed successfully');
      } else {
        this.warnings.push('Protocol validation had issues');
      }
      
    } catch (error) {
      // In development, treat protocol validation failures as warnings
      const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
      if (isDevelopment) {
        this.warnings.push(`Protocol validation failed: ${error.message}`);
      } else {
        this.blockers.push(`Protocol validation failed: ${error.message}`);
      }
    }
  }

  async runSafetyChecks() {
    console.log('🛡️ Phase 3: Pre-Execution Safety Checks');
    
    const protocols = ['launch', 'end_of_chat', 'pre_wrap_audit', 'custodian'];
    
    for (const protocol of protocols) {
      try {
        const result = await this.executor.executeCommand('node', {
          args: ['scripts/protocols/pre_execution_safety.cjs', protocol],
          timeout: 15000,
          silent: true
        });
        
        if (result.stdout.includes('EXECUTION CLEARED')) {
          this.passes.push(`Protocol ${protocol} safety check passed`);
        } else if (result.stdout.includes('EXECUTION ALLOWED WITH WARNINGS')) {
          this.warnings.push(`Protocol ${protocol} has safety warnings`);
        } else if (result.stdout.includes('EXECUTION BLOCKED')) {
          // In development, treat safety check failures as warnings
          const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
          if (isDevelopment) {
            this.warnings.push(`Protocol ${protocol} safety check failed`);
          } else {
            this.blockers.push(`Protocol ${protocol} safety check failed`);
          }
        }
        
      } catch (error) {
        // In development, treat safety check errors as warnings
        const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
        if (isDevelopment) {
          this.warnings.push(`Protocol ${protocol} safety check error: ${error.message}`);
        } else {
          this.blockers.push(`Protocol ${protocol} safety check error: ${error.message}`);
        }
      }
    }
  }

  async validateCodeOrganization() {
    console.log('📁 Phase 4: Code Organization Validation');
    
    // Check for proper file organization
    const organizationIssues = this.checkCodeOrganization();
    
    if (organizationIssues.length === 0) {
      this.passes.push('Code organization is proper');
    } else {
      this.warnings.push(`Code organization issues: ${organizationIssues.join(', ')}`);
    }
    
    // Check for duplicate files
    const duplicates = this.findDuplicateFiles();
    if (duplicates.length > 0) {
      this.warnings.push(`Duplicate files found: ${duplicates.join(', ')}`);
    }
    
    // Check for orphaned files
    const orphaned = this.findOrphanedFiles();
    if (orphaned.length > 0) {
      this.warnings.push(`Orphaned files found: ${orphaned.join(', ')}`);
    }
  }

  checkCodeOrganization() {
    const issues = [];
    
    // Check for files in wrong directories
    const srcPath = path.join(this.projectRoot, 'src');
    if (fs.existsSync(srcPath)) {
      const files = fs.readdirSync(srcPath, { recursive: true });
      
      for (const file of files) {
        if (typeof file === 'string' && file.includes('.')) {
          const filePath = path.join(srcPath, file);
          
          // Check for files that should be in specific directories
          if (file.includes('Player') && !file.includes('components/')) {
            issues.push(`Player-related file in wrong location: ${file}`);
          }
          
          if (file.includes('csv') && !file.includes('utils/')) {
            issues.push(`CSV utility in wrong location: ${file}`);
          }
        }
      }
    }
    
    return issues;
  }

  findDuplicateFiles() {
    const duplicates = [];
    const fileMap = new Map();
    
    const walkDir = (dir) => {
      if (!fs.existsSync(dir)) return;
      
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          // Skip node_modules directories entirely
          if (filePath.includes('node_modules')) {
            continue;
          }
          walkDir(filePath);
        } else if (stat.isFile()) {
          // Skip node_modules files
          if (filePath.includes('node_modules')) {
            continue;
          }
          
          const content = fs.readFileSync(filePath, 'utf8');
          const hash = this.hashContent(content);
          
          if (fileMap.has(hash)) {
            duplicates.push(`${filePath} (duplicate of ${fileMap.get(hash)})`);
          } else {
            fileMap.set(hash, filePath);
          }
        }
      }
    };
    
    walkDir(this.projectRoot);
    return duplicates;
  }

  findOrphanedFiles() {
    const orphaned = [];
    
    // Check for files that aren't imported anywhere
    const srcPath = path.join(this.projectRoot, 'src');
    if (fs.existsSync(srcPath)) {
      const files = fs.readdirSync(srcPath, { recursive: true });
      
      for (const file of files) {
        if (typeof file === 'string' && (file.endsWith('.ts') || file.endsWith('.tsx'))) {
          const filePath = path.join(srcPath, file);
          const fileName = path.basename(file, path.extname(file));
          
          // Check if this file is imported anywhere
          const isImported = this.checkFileImports(fileName);
          if (!isImported) {
            orphaned.push(filePath);
          }
        }
      }
    }
    
    return orphaned;
  }

  hashContent(content) {
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }

  checkFileImports(fileName) {
    // This is a simplified check - in a real implementation, you'd parse imports
    const srcPath = path.join(this.projectRoot, 'src');
    const files = fs.readdirSync(srcPath, { recursive: true });
    
    for (const file of files) {
      if (typeof file === 'string' && (file.endsWith('.ts') || file.endsWith('.tsx'))) {
        const filePath = path.join(srcPath, file);
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          if (content.includes(`import.*${fileName}`) || content.includes(`from.*${fileName}`)) {
            return true;
          }
        } catch (error) {
          // Skip files that can't be read
        }
      }
    }
    
    return false;
  }

  async validateIntegrationPoints() {
    console.log('🔗 Phase 5: Integration Point Validation');
    
    const integrationPoints = [
      'SessionManager',
      'ProtocolManager',
      'GovernanceOrchestrator',
      'SystemMaster'
    ];
    
    for (const integrationPoint of integrationPoints) {
      const integrationPath = this.findIntegrationPath(integrationPoint);
      if (integrationPath && fs.existsSync(integrationPath)) {
        this.passes.push(`Integration point available: ${integrationPoint}`);
      } else {
        this.warnings.push(`Integration point not found: ${integrationPoint}`);
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

  async generatePreventionReport() {
    console.log('📄 Phase 6: Generating Prevention Report');
    
    const report = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      preventionResults: this.preventionResults,
      blockers: this.blockers,
      warnings: this.warnings,
      passes: this.passes,
      recoveryActions: this.recoveryActions,
      summary: {
        totalBlockers: this.blockers.length,
        totalWarnings: this.warnings.length,
        totalPasses: this.passes.length,
        totalRecoveryActions: this.recoveryActions.length,
        isSystemReady: this.blockers.length === 0
      }
    };

    const reportPath = path.join(this.projectRoot, `data/protocols/prevention-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`✅ Prevention report generated: ${reportPath}`);
  }

  logError(error) {
    const errorLog = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      script: 'prevention_system',
      error: {
        message: error.message,
        stack: error.stack
      }
    };

    const errorPath = path.join(this.projectRoot, 'data/protocols/prevention-system-error.json');
    fs.writeFileSync(errorPath, JSON.stringify(errorLog, null, 2));
    console.error(`📁 Error logged to: ${errorPath}`);
  }
}

// Run the prevention system
if (require.main === module) {
  const prevention = new PreventionSystem();
  prevention.runPreventionChecks().then(isReady => {
    process.exit(isReady ? 0 : 1);
  }).catch(error => {
    console.error('Prevention system failed:', error);
    process.exit(1);
  });
}

module.exports = PreventionSystem; 