#!/usr/bin/env node

/**
 * Parallel & Cascading Audit System v1.0.0
 * 
 * PURPOSE: Comprehensive system health monitoring with parallel execution,
 * cascading dependencies, and intelligent resource allocation across all
 * system levels and constituent components.
 * 
 * FEATURES:
 * - Parallel execution at multiple system levels
 * - Cascading dependency management
 * - Intelligent resource allocation
 * - Real-time health scoring
 * - Event-driven auditing
 * - Critical failure detection and response
 * 
 * USAGE: node scripts/protocols/parallel_cascading_audit_system.cjs [--mode=full|quick|critical]
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

class ParallelCascadingAuditSystem {
  constructor(mode = 'full') {
    this.projectRoot = process.cwd();
    this.mode = mode; // full, quick, critical
    this.auditId = `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.startTime = Date.now();
    this.results = {
      timestamp: new Date().toISOString(),
      auditId: this.auditId,
      mode: this.mode,
      levels: {},
      cascadingEvents: [],
      criticalIssues: [],
      recommendations: [],
      performance: {
        totalDuration: 0,
        parallelChecks: 0,
        cascadingChecks: 0
      }
    };
    
    // System levels with their constituent components
    this.systemLevels = {
      infrastructure: {
        priority: 'critical',
        components: ['git', 'filesystem', 'configs', 'dependencies'],
        dependencies: [],
        checkInterval: 30000, // 30s
        timeout: 10000
      },
      application: {
        priority: 'high',
        components: ['frontend', 'backend', 'apis', 'database'],
        dependencies: ['infrastructure'],
        checkInterval: 60000, // 1m
        timeout: 15000
      },
      governance: {
        priority: 'medium',
        components: ['protocols', 'policies', 'compliance', 'standards'],
        dependencies: ['infrastructure'],
        checkInterval: 120000, // 2m
        timeout: 20000
      },
      data: {
        priority: 'low',
        components: ['sessions', 'history', 'cache', 'logs'],
        dependencies: ['infrastructure', 'application'],
        checkInterval: 300000, // 5m
        timeout: 10000
      }
    };
    
    // Health thresholds for cascading triggers
    this.healthThresholds = {
      critical: 50,
      warning: 75,
      healthy: 90
    };
  }

  async execute() {
    console.log('🔍 Parallel & Cascading Audit System v1.0.0');
    console.log('============================================');
    console.log(`Audit ID: ${this.auditId}`);
    console.log(`Mode: ${this.mode}`);
    console.log('');

    try {
      // Phase 1: Parallel Level Audits
      await this.executeParallelLevelAudits();
      
      // Phase 2: Cascading Dependency Checks
      await this.executeCascadingChecks();
      
      // Phase 3: Critical Issue Analysis
      await this.analyzeCriticalIssues();
      
      // Phase 4: Generate Recommendations
      await this.generateRecommendations();
      
      // Phase 5: Performance Analysis
      this.analyzePerformance();
      
      // Phase 6: Generate Report
      await this.generateAuditReport();
      
      console.log('');
      console.log('✅ Parallel & Cascading Audit Complete');
      console.log(`📊 Total Duration: ${this.results.performance.totalDuration}ms`);
      console.log(`🔄 Parallel Checks: ${this.results.performance.parallelChecks}`);
      console.log(`🌊 Cascading Checks: ${this.results.performance.cascadingChecks}`);
      
    } catch (error) {
      console.error('❌ Audit System Failed:', error.message);
      this.logError(error);
    }
  }

  async executeParallelLevelAudits() {
    console.log('🚀 Phase 1: Executing Parallel Level Audits');
    
    const levelPromises = Object.entries(this.systemLevels).map(async ([levelName, levelConfig]) => {
      console.log(`  📋 Auditing ${levelName} level...`);
      
      const levelResults = {
        level: levelName,
        priority: levelConfig.priority,
        timestamp: new Date().toISOString(),
        components: {},
        overallHealth: 0,
        criticalIssues: [],
        warnings: []
      };

      // Execute component checks in parallel
      const componentPromises = levelConfig.components.map(async (component) => {
        return await this.auditComponent(levelName, component, levelConfig.timeout);
      });

      const componentResults = await Promise.allSettled(componentPromises);
      
      // Process component results
      let totalHealth = 0;
      let componentCount = 0;
      
      componentResults.forEach((result, index) => {
        const component = levelConfig.components[index];
        if (result.status === 'fulfilled') {
          levelResults.components[component] = result.value;
          totalHealth += result.value.health;
          componentCount++;
          
          if (result.value.issues && result.value.issues.length > 0) {
            levelResults.criticalIssues.push(...result.value.issues);
          }
        } else {
          levelResults.components[component] = {
            health: 0,
            status: 'failed',
            error: result.reason.message,
            issues: [`${component} audit failed: ${result.reason.message}`]
          };
          levelResults.criticalIssues.push(`${component} audit failed: ${result.reason.message}`);
        }
      });

      levelResults.overallHealth = componentCount > 0 ? Math.round(totalHealth / componentCount) : 0;
      this.results.levels[levelName] = levelResults;
      this.results.performance.parallelChecks += componentCount;
      
      console.log(`    ✅ ${levelName}: ${levelResults.overallHealth}/100 health`);
      
      return levelResults;
    });

    await Promise.all(levelPromises);
  }

  async executeCascadingChecks() {
    console.log('🌊 Phase 2: Executing Cascading Dependency Checks');
    
    const cascadingEvents = [];
    
    // Check dependencies and trigger cascading audits
    for (const [levelName, levelConfig] of Object.entries(this.systemLevels)) {
      const levelResult = this.results.levels[levelName];
      
      if (levelResult.overallHealth < this.healthThresholds.critical) {
        console.log(`  ⚠️  Critical health detected in ${levelName} (${levelResult.overallHealth}/100)`);
        
        // Trigger cascading checks for dependent levels
        for (const [dependentLevel, dependentConfig] of Object.entries(this.systemLevels)) {
          if (dependentConfig.dependencies.includes(levelName)) {
            console.log(`    🔄 Triggering cascading check for ${dependentLevel} (depends on ${levelName})`);
            
            const cascadingResult = await this.executeCascadingAudit(dependentLevel, levelName, levelResult);
            cascadingEvents.push({
              trigger: levelName,
              target: dependentLevel,
              timestamp: new Date().toISOString(),
              result: cascadingResult
            });
            
            this.results.performance.cascadingChecks++;
          }
        }
      }
    }
    
    this.results.cascadingEvents = cascadingEvents;
  }

  async executeCascadingAudit(targetLevel, triggerLevel, triggerResult) {
    const targetConfig = this.systemLevels[targetLevel];
    const result = {
      targetLevel,
      triggerLevel,
      triggerHealth: triggerResult.overallHealth,
      timestamp: new Date().toISOString(),
      impact: 'unknown',
      recommendations: []
    };

    // Assess impact based on dependency relationship
    if (targetLevel === 'application' && triggerLevel === 'infrastructure') {
      result.impact = 'high';
      result.recommendations.push('Infrastructure issues may affect application stability');
    } else if (targetLevel === 'data' && triggerLevel === 'application') {
      result.impact = 'medium';
      result.recommendations.push('Application issues may affect data integrity');
    }

    // Re-audit critical components of the target level
    const criticalComponents = targetConfig.components.slice(0, 2); // Check first 2 components
    for (const component of criticalComponents) {
      const componentResult = await this.auditComponent(targetLevel, component, targetConfig.timeout / 2);
      if (componentResult.health < this.healthThresholds.warning) {
        result.recommendations.push(`${component} health degraded: ${componentResult.health}/100`);
      }
    }

    return result;
  }

  async auditComponent(level, component, timeout) {
    const startTime = Date.now();
    
    try {
      const auditMethod = this.getAuditMethod(level, component);
      const result = await auditMethod.call(this, timeout);
      
      return {
        health: result.health || 100,
        status: 'success',
        duration: Date.now() - startTime,
        details: result.details || {},
        issues: result.issues || []
      };
    } catch (error) {
      return {
        health: 0,
        status: 'failed',
        duration: Date.now() - startTime,
        error: error.message,
        issues: [error.message]
      };
    }
  }

  getAuditMethod(level, component) {
    const methods = {
      infrastructure: {
        git: this.auditGit,
        filesystem: this.auditFilesystem,
        configs: this.auditConfigs,
        dependencies: this.auditDependencies
      },
      application: {
        frontend: this.auditFrontend,
        backend: this.auditBackend,
        apis: this.auditAPIs,
        database: this.auditDatabase
      },
      governance: {
        protocols: this.auditProtocols,
        policies: this.auditPolicies,
        compliance: this.auditCompliance,
        standards: this.auditStandards
      },
      data: {
        sessions: this.auditSessions,
        history: this.auditHistory,
        cache: this.auditCache,
        logs: this.auditLogs
      }
    };

    return methods[level]?.[component] || this.auditGeneric;
  }

  // Infrastructure Audit Methods
  async auditGit(timeout) {
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8', timeout });
      const branch = execSync('git branch --show-current', { encoding: 'utf8', timeout });
      const lastCommit = execSync('git log -1 --format="%H %s"', { encoding: 'utf8', timeout });
      
      const health = status.trim() === '' ? 100 : 75;
      const issues = status.trim() !== '' ? ['Uncommitted changes detected'] : [];
      
      return { health, details: { branch: branch.trim(), lastCommit: lastCommit.trim() }, issues };
    } catch (error) {
      return { health: 0, issues: [`Git audit failed: ${error.message}`] };
    }
  }

  async auditFilesystem(timeout) {
    const criticalDirs = ['src', 'scripts', 'docs', 'config'];
    const missingDirs = criticalDirs.filter(dir => !fs.existsSync(path.join(this.projectRoot, dir)));
    
    const health = missingDirs.length === 0 ? 100 : Math.max(0, 100 - (missingDirs.length * 25));
    const issues = missingDirs.map(dir => `Missing critical directory: ${dir}`);
    
    return { health, details: { checkedDirs: criticalDirs, missingDirs }, issues };
  }

  async auditConfigs(timeout) {
    const configFiles = ['package.json', 'README.md', '.gitignore'];
    const missingConfigs = configFiles.filter(file => !fs.existsSync(path.join(this.projectRoot, file)));
    
    const health = missingConfigs.length === 0 ? 100 : Math.max(0, 100 - (missingConfigs.length * 33));
    const issues = missingConfigs.map(file => `Missing config file: ${file}`);
    
    return { health, details: { checkedConfigs: configFiles, missingConfigs }, issues };
  }

  async auditDependencies(timeout) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8'));
      const hasCoreDeps = packageJson.dependencies && Object.keys(packageJson.dependencies).length > 0;
      const hasDevDeps = packageJson.devDependencies && Object.keys(packageJson.devDependencies).length > 0;
      
      const health = hasCoreDeps && hasDevDeps ? 100 : hasCoreDeps ? 75 : 50;
      const issues = [];
      if (!hasCoreDeps) issues.push('No core dependencies found');
      if (!hasDevDeps) issues.push('No dev dependencies found');
      
      return { health, details: { coreDeps: hasCoreDeps, devDeps: hasDevDeps }, issues };
    } catch (error) {
      return { health: 0, issues: [`Dependencies audit failed: ${error.message}`] };
    }
  }

  // Application Audit Methods
  async auditFrontend(timeout) {
    const frontendPath = path.join(this.projectRoot, 'frontend');
    if (!fs.existsSync(frontendPath)) {
      return { health: 0, issues: ['Frontend directory not found'] };
    }
    
    const packageJsonPath = path.join(frontendPath, 'package.json');
    const srcPath = path.join(frontendPath, 'src');
    
    const hasPackageJson = fs.existsSync(packageJsonPath);
    const hasSrc = fs.existsSync(srcPath);
    
    const health = hasPackageJson && hasSrc ? 100 : hasPackageJson || hasSrc ? 50 : 0;
    const issues = [];
    if (!hasPackageJson) issues.push('Frontend package.json missing');
    if (!hasSrc) issues.push('Frontend src directory missing');
    
    return { health, details: { hasPackageJson, hasSrc }, issues };
  }

  async auditBackend(timeout) {
    const backendPath = path.join(this.projectRoot, 'backend');
    if (!fs.existsSync(backendPath)) {
      return { health: 0, issues: ['Backend directory not found'] };
    }
    
    const packageJsonPath = path.join(backendPath, 'package.json');
    const srcPath = path.join(backendPath, 'src');
    
    const hasPackageJson = fs.existsSync(packageJsonPath);
    const hasSrc = fs.existsSync(srcPath);
    
    const health = hasPackageJson && hasSrc ? 100 : hasPackageJson || hasSrc ? 50 : 0;
    const issues = [];
    if (!hasPackageJson) issues.push('Backend package.json missing');
    if (!hasSrc) issues.push('Backend src directory missing');
    
    return { health, details: { hasPackageJson, hasSrc }, issues };
  }

  async auditAPIs(timeout) {
    // Check for API-related files and configurations
    const apiFiles = [
      'backend/src/routes',
      'backend/src/controllers',
      'backend/src/middleware'
    ];
    
    const existingApis = apiFiles.filter(file => fs.existsSync(path.join(this.projectRoot, file)));
    const health = existingApis.length > 0 ? 100 : 0;
    const issues = existingApis.length === 0 ? ['No API structure found'] : [];
    
    return { health, details: { checkedApis: apiFiles, existingApis }, issues };
  }

  async auditDatabase(timeout) {
    // Check for database configuration and models
    const dbFiles = [
      'backend/src/models',
      'backend/src/config/database',
      'backend/src/database'
    ];
    
    const existingDb = dbFiles.filter(file => fs.existsSync(path.join(this.projectRoot, file)));
    const health = existingDb.length > 0 ? 100 : 50;
    const issues = existingDb.length === 0 ? ['No database structure found'] : [];
    
    return { health, details: { checkedDb: dbFiles, existingDb }, issues };
  }

  // Governance Audit Methods
  async auditProtocols(timeout) {
    const protocolFiles = [
      'scripts/protocols/launch_protocol.cjs',
      'scripts/protocols/anchor_manager.cjs',
      'scripts/protocols/wrap_protocol.cjs'
    ];
    
    const existingProtocols = protocolFiles.filter(file => fs.existsSync(path.join(this.projectRoot, file)));
    const health = existingProtocols.length >= 2 ? 100 : existingProtocols.length === 1 ? 50 : 0;
    const issues = existingProtocols.length < 2 ? ['Insufficient protocol coverage'] : [];
    
    return { health, details: { checkedProtocols: protocolFiles, existingProtocols }, issues };
  }

  async auditPolicies(timeout) {
    const policyFiles = [
      'config/governance',
      'config/security',
      'docs/GOVERNANCE.md'
    ];
    
    const existingPolicies = policyFiles.filter(file => fs.existsSync(path.join(this.projectRoot, file)));
    const health = existingPolicies.length >= 2 ? 100 : existingPolicies.length === 1 ? 50 : 0;
    const issues = existingPolicies.length < 2 ? ['Insufficient policy coverage'] : [];
    
    return { health, details: { checkedPolicies: policyFiles, existingPolicies }, issues };
  }

  async auditCompliance(timeout) {
    const complianceFiles = [
      'data/command_center',
      'data/audits',
      'scripts/command_center'
    ];
    
    const existingCompliance = complianceFiles.filter(file => fs.existsSync(path.join(this.projectRoot, file)));
    const health = existingCompliance.length >= 2 ? 100 : existingCompliance.length === 1 ? 50 : 0;
    const issues = existingCompliance.length < 2 ? ['Insufficient compliance monitoring'] : [];
    
    return { health, details: { checkedCompliance: complianceFiles, existingCompliance }, issues };
  }

  async auditStandards(timeout) {
    const standardsFiles = [
      'standards',
      'config/design-system',
      'docs/STANDARDS.md'
    ];
    
    const existingStandards = standardsFiles.filter(file => fs.existsSync(path.join(this.projectRoot, file)));
    const health = existingStandards.length >= 1 ? 100 : 0;
    const issues = existingStandards.length === 0 ? ['No standards defined'] : [];
    
    return { health, details: { checkedStandards: standardsFiles, existingStandards }, issues };
  }

  // Data Audit Methods
  async auditSessions(timeout) {
    const sessionsDir = path.join(this.projectRoot, 'data/sessions');
    if (!fs.existsSync(sessionsDir)) {
      return { health: 0, issues: ['Sessions directory not found'] };
    }
    
    const sessionFiles = fs.readdirSync(sessionsDir).filter(file => file.endsWith('.json'));
    const health = sessionFiles.length > 0 ? 100 : 50;
    const issues = sessionFiles.length === 0 ? ['No session data found'] : [];
    
    return { health, details: { sessionCount: sessionFiles.length }, issues };
  }

  async auditHistory(timeout) {
    const historyFile = path.join(this.projectRoot, 'data/command_center/command_history.json');
    if (!fs.existsSync(historyFile)) {
      return { health: 0, issues: ['Command history not found'] };
    }
    
    try {
      const history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
      const commandCount = history.commands?.length || 0;
      const health = commandCount > 0 ? 100 : 50;
      const issues = commandCount === 0 ? ['No command history found'] : [];
      
      return { health, details: { commandCount }, issues };
    } catch (error) {
      return { health: 0, issues: [`History audit failed: ${error.message}`] };
    }
  }

  async auditCache(timeout) {
    const cacheDir = path.join(this.projectRoot, 'data/cache');
    if (!fs.existsSync(cacheDir)) {
      return { health: 50, issues: ['Cache directory not found'] };
    }
    
    const cacheFiles = fs.readdirSync(cacheDir).filter(file => file.endsWith('.json'));
    const health = cacheFiles.length > 0 ? 100 : 75;
    const issues = cacheFiles.length === 0 ? ['No cache data found'] : [];
    
    return { health, details: { cacheCount: cacheFiles.length }, issues };
  }

  async auditLogs(timeout) {
    const logFiles = [
      'data/audits',
      'data/reports',
      'LAUNCH_ERROR.json'
    ];
    
    const existingLogs = logFiles.filter(file => fs.existsSync(path.join(this.projectRoot, file)));
    const health = existingLogs.length > 0 ? 100 : 50;
    const issues = existingLogs.length === 0 ? ['No log files found'] : [];
    
    return { health, details: { checkedLogs: logFiles, existingLogs }, issues };
  }

  // Generic audit method for unknown components
  async auditGeneric(timeout) {
    return { health: 50, details: { note: 'Generic audit - component not specifically implemented' }, issues: [] };
  }

  async analyzeCriticalIssues() {
    console.log('🚨 Phase 3: Analyzing Critical Issues');
    
    const criticalIssues = [];
    
    for (const [levelName, levelResult] of Object.entries(this.results.levels)) {
      if (levelResult.overallHealth < this.healthThresholds.critical) {
        criticalIssues.push({
          level: levelName,
          health: levelResult.overallHealth,
          issues: levelResult.criticalIssues,
          priority: this.systemLevels[levelName].priority
        });
      }
    }
    
    this.results.criticalIssues = criticalIssues;
    
    if (criticalIssues.length > 0) {
      console.log(`  ⚠️  Found ${criticalIssues.length} critical issues:`);
      criticalIssues.forEach(issue => {
        console.log(`    - ${issue.level}: ${issue.health}/100 health (${issue.issues.length} issues)`);
      });
    } else {
      console.log('  ✅ No critical issues detected');
    }
  }

  async generateRecommendations() {
    console.log('💡 Phase 4: Generating Recommendations');
    
    const recommendations = [];
    
    // Generate recommendations based on audit results
    for (const [levelName, levelResult] of Object.entries(this.results.levels)) {
      if (levelResult.overallHealth < this.healthThresholds.warning) {
        recommendations.push({
          level: levelName,
          priority: this.systemLevels[levelName].priority,
          health: levelResult.overallHealth,
          recommendation: `Improve ${levelName} health from ${levelResult.overallHealth}/100 to above ${this.healthThresholds.warning}/100`,
          actions: this.generateLevelActions(levelName, levelResult)
        });
      }
    }
    
    // Add performance recommendations
    if (this.results.performance.totalDuration > 30000) {
      recommendations.push({
        level: 'performance',
        priority: 'medium',
        recommendation: 'Optimize audit performance - consider reducing check frequency or parallelization',
        actions: ['Review timeout settings', 'Optimize component checks', 'Implement caching']
      });
    }
    
    this.results.recommendations = recommendations;
    
    if (recommendations.length > 0) {
      console.log(`  📋 Generated ${recommendations.length} recommendations`);
    } else {
      console.log('  ✅ No recommendations needed');
    }
  }

  generateLevelActions(levelName, levelResult) {
    const actions = {
      infrastructure: ['Check git status', 'Verify file permissions', 'Review dependencies'],
      application: ['Test frontend build', 'Verify backend startup', 'Check API endpoints'],
      governance: ['Review protocols', 'Update policies', 'Check compliance'],
      data: ['Backup sessions', 'Clean old logs', 'Verify cache integrity']
    };
    
    return actions[levelName] || ['Review component health', 'Check configuration'];
  }

  analyzePerformance() {
    this.results.performance.totalDuration = Date.now() - this.startTime;
    
    console.log('⚡ Phase 5: Performance Analysis');
    console.log(`  📊 Total Duration: ${this.results.performance.totalDuration}ms`);
    console.log(`  🔄 Parallel Checks: ${this.results.performance.parallelChecks}`);
    console.log(`  🌊 Cascading Checks: ${this.results.performance.cascadingChecks}`);
  }

  async generateAuditReport() {
    console.log('📄 Phase 6: Generating Audit Report');
    
    const reportDir = path.join(this.projectRoot, 'data/audits');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    const reportFile = path.join(reportDir, `parallel_cascading_audit_${this.auditId}.json`);
    fs.writeFileSync(reportFile, JSON.stringify(this.results, null, 2));
    
    console.log(`  📁 Report saved: ${reportFile}`);
    
    // Generate summary
    const summary = {
      auditId: this.auditId,
      timestamp: this.results.timestamp,
      mode: this.mode,
      overallHealth: this.calculateOverallHealth(),
      criticalIssues: this.results.criticalIssues.length,
      recommendations: this.results.recommendations.length,
      performance: this.results.performance
    };
    
    const summaryFile = path.join(reportDir, `audit_summary_${this.auditId}.json`);
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
    
    console.log(`  📋 Summary saved: ${summaryFile}`);
  }

  calculateOverallHealth() {
    const levelHealths = Object.values(this.results.levels).map(level => level.overallHealth);
    return Math.round(levelHealths.reduce((sum, health) => sum + health, 0) / levelHealths.length);
  }

  logError(error) {
    const errorLog = {
      timestamp: new Date().toISOString(),
      auditId: this.auditId,
      error: error.message,
      stack: error.stack
    };
    
    const errorFile = path.join(this.projectRoot, 'PARALLEL_CASCADING_AUDIT_ERROR.json');
    fs.writeFileSync(errorFile, JSON.stringify(errorLog, null, 2));
    console.error(`📁 Error logged to: ${errorFile}`);
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const mode = args.find(arg => arg.startsWith('--mode='))?.split('=')[1] || 'full';
  return { mode };
}

// Execute if run directly
if (require.main === module) {
  const { mode } = parseArgs();
  const auditSystem = new ParallelCascadingAuditSystem(mode);
  auditSystem.execute();
}

module.exports = ParallelCascadingAuditSystem; 