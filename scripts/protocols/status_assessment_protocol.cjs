#!/usr/bin/env node

/**
 * Status Assessment Protocol v1.0.0
 * 
 * PURPOSE: Comprehensive status checking for holons, system levels, and overall system health
 * with misplaced file detection and effectiveness tracking over time.
 * 
 * USAGE: 
 * - status assessment elevate (holon-specific)
 * - status assessment frontend (level-specific)
 * - status assessment system (system-wide)
 * - status assessment all (comprehensive)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class StatusAssessmentProtocol {
  constructor() {
    this.projectRoot = process.cwd();
    this.assessmentId = this.generateAssessmentId();
    this.startTime = Date.now();
    this.results = {
      assessmentId: this.assessmentId,
      timestamp: new Date().toISOString(),
      target: null,
      duration: 0,
      status: 'unknown',
      metrics: {},
      issues: [],
      recommendations: [],
      misplacedFiles: [],
      effectiveness: {}
    };

    // Define holons and their expected locations
    this.holons = {
      elevate: {
        description: 'Coaching product governance',
        expectedPaths: ['src/core/holons/elevate/', 'src/components/elevate/'],
        managers: ['ElevateManager', 'CoachingManager', 'PlayerManager'],
        components: ['CoachingToolkit', 'PlayerGrid', 'MediaLibrary'],
        services: ['playerService', 'coachingService']
      },
      administrate: {
        description: 'Business intelligence governance',
        expectedPaths: ['src/core/holons/administrate/', 'src/components/administrate/'],
        managers: ['AdministrateManager', 'ExecutiveManager', 'BusinessIntelligenceManager'],
        components: ['ExecutiveDashboard', 'SystemAuditPanel', 'StorageDashboard'],
        services: ['auditService', 'businessIntelligenceService']
      },
      articulate: {
        description: 'Knowledge management governance',
        expectedPaths: ['src/core/holons/articulate/', 'src/components/articulate/'],
        managers: ['ArticulateManager', 'KnowledgeManager', 'WorkManager'],
        components: ['KnowledgeBase', 'WorkflowManager', 'ContentEditor'],
        services: ['knowledgeService', 'workService']
      },
      elaborate: {
        description: 'System master governance',
        expectedPaths: ['src/core/holons/elaborate/', 'src/components/elaborate/'],
        managers: ['SystemMasterManager', 'GovernanceOrchestrator', 'RepositoryGovernor'],
        components: ['SystemDashboard', 'GovernancePanel', 'RepositoryManager'],
        services: ['systemService', 'governanceService']
      }
    };

    // Define system levels and their expected locations
    this.levels = {
      frontend: {
        description: 'Frontend application layer',
        expectedPaths: ['frontend/src/', 'src/components/', 'src/hooks/'],
        files: ['*.tsx', '*.ts', '*.css', '*.json'],
        health: 0
      },
      backend: {
        description: 'Backend API layer',
        expectedPaths: ['backend/src/', 'src/api/', 'src/services/'],
        files: ['*.ts', '*.js', '*.json'],
        health: 0
      },
      infrastructure: {
        description: 'Infrastructure and deployment',
        expectedPaths: ['infrastructure/', 'scripts/', 'config/'],
        files: ['*.cjs', '*.js', '*.json', '*.yaml'],
        health: 0
      },
      governance: {
        description: 'Governance and protocols',
        expectedPaths: ['scripts/governance/', 'scripts/protocols/', 'data/council/'],
        files: ['*.cjs', '*.json', '*.md'],
        health: 0
      }
    };
  }

  generateAssessmentId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `assessment-${timestamp}-${random}`;
  }

  async execute() {
    const args = process.argv.slice(2);
    const target = args[0] || 'system';

    console.log('🔍 Status Assessment Protocol v1.0.0');
    console.log('====================================');
    console.log(`Assessment ID: ${this.assessmentId}`);
    console.log(`Target: ${target}`);
    console.log('');

    this.results.target = target;

    try {
      switch (target) {
        case 'system':
          await this.assessSystem();
          break;
        case 'all':
          await this.assessAll();
          break;
        default:
          if (this.holons[target]) {
            await this.assessHolon(target);
          } else if (this.levels[target]) {
            await this.assessLevel(target);
          } else {
            console.error(`❌ Unknown target: ${target}`);
            console.log('Available targets:');
            console.log('  Holons:', Object.keys(this.holons).join(', '));
            console.log('  Levels:', Object.keys(this.levels).join(', '));
            console.log('  System: system, all');
            process.exit(1);
          }
      }

      this.results.duration = Date.now() - this.startTime;
      await this.generateReport();
      await this.saveResults();

    } catch (error) {
      console.error('❌ Status Assessment Failed:', error.message);
      this.results.status = 'failed';
      this.results.issues.push(error.message);
      await this.saveResults();
      process.exit(1);
    }
  }

  async assessSystem() {
    console.log('🏗️  Assessing System-Wide Status...');
    
    const systemMetrics = {
      buildStatus: await this.checkBuildStatus(),
      gitStatus: await this.checkGitStatus(),
      fileCounts: await this.getFileCounts(),
      performance: await this.checkPerformance(),
      security: await this.checkSecurity(),
      documentation: await this.checkDocumentation()
    };

    this.results.metrics = systemMetrics;
    this.results.status = this.calculateSystemStatus(systemMetrics);
    
    console.log(`✅ System Status: ${this.results.status}`);
  }

  async assessHolon(holonName) {
    console.log(`🏛️  Assessing Holon: ${holonName}`);
    
    const holon = this.holons[holonName];
    const holonMetrics = {
      files: await this.findHolonFiles(holonName, holon),
      managers: await this.checkManagers(holon.managers),
      components: await this.checkComponents(holon.components),
      services: await this.checkServices(holon.services),
      misplacedFiles: await this.findMisplacedFiles(holonName, holon)
    };

    this.results.metrics = holonMetrics;
    this.results.status = this.calculateHolonStatus(holonMetrics);
    
    console.log(`✅ ${holonName} Status: ${this.results.status}`);
  }

  async assessLevel(levelName) {
    console.log(`📊 Assessing Level: ${levelName}`);
    
    const level = this.levels[levelName];
    const levelMetrics = {
      files: await this.findLevelFiles(levelName, level),
      health: await this.calculateLevelHealth(levelName, level),
      performance: await this.checkLevelPerformance(levelName),
      issues: await this.findLevelIssues(levelName, level)
    };

    this.results.metrics = levelMetrics;
    this.results.status = this.calculateLevelStatus(levelMetrics);
    
    console.log(`✅ ${levelName} Status: ${this.results.status}`);
  }

  async assessAll() {
    console.log('🌐 Assessing All Targets...');
    
    const allResults = {
      system: {},
      holons: {},
      levels: {}
    };

    // Assess system
    console.log('\n🏗️  System Assessment...');
    await this.assessSystem();
    allResults.system = { ...this.results.metrics };

    // Assess all holons
    console.log('\n🏛️  Holon Assessments...');
    for (const holonName of Object.keys(this.holons)) {
      console.log(`  Assessing ${holonName}...`);
      await this.assessHolon(holonName);
      allResults.holons[holonName] = { ...this.results.metrics };
    }

    // Assess all levels
    console.log('\n📊 Level Assessments...');
    for (const levelName of Object.keys(this.levels)) {
      console.log(`  Assessing ${levelName}...`);
      await this.assessLevel(levelName);
      allResults.levels[levelName] = { ...this.results.metrics };
    }

    this.results.metrics = allResults;
    this.results.status = this.calculateOverallStatus(allResults);
    
    console.log(`✅ Overall Status: ${this.results.status}`);
  }

  async checkBuildStatus() {
    try {
      const result = execSync('npm run build', { 
        encoding: 'utf8', 
        cwd: this.projectRoot,
        timeout: 60000 
      });
      return { status: 'success', output: result };
    } catch (error) {
      return { status: 'failed', error: error.message };
    }
  }

  async checkGitStatus() {
    try {
      const status = execSync('git status --porcelain', { 
        encoding: 'utf8', 
        cwd: this.projectRoot 
      });
      const files = status.trim().split('\n').filter(line => line.length > 0);
      return {
        clean: files.length === 0,
        modifiedFiles: files.length,
        files: files
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async getFileCounts() {
    const counts = {};
    for (const level of Object.keys(this.levels)) {
      counts[level] = await this.countFilesInLevel(level);
    }
    return counts;
  }

  async countFilesInLevel(levelName) {
    const level = this.levels[levelName];
    let total = 0;
    
    for (const expectedPath of level.expectedPaths) {
      const fullPath = path.join(this.projectRoot, expectedPath);
      if (fs.existsSync(fullPath)) {
        total += this.countFilesRecursive(fullPath, level.files);
      }
    }
    
    return total;
  }

  countFilesRecursive(dir, patterns) {
    let count = 0;
    
    try {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          count += this.countFilesRecursive(fullPath, patterns);
        } else if (stat.isFile()) {
          for (const pattern of patterns) {
            if (this.matchesPattern(item, pattern)) {
              count++;
              break;
            }
          }
        }
      }
    } catch (error) {
      // Directory doesn't exist or can't be read
    }
    
    return count;
  }

  matchesPattern(filename, pattern) {
    if (pattern.startsWith('*.')) {
      const ext = pattern.substring(1);
      return filename.endsWith(ext);
    }
    return filename === pattern;
  }

  async findHolonFiles(holonName, holon) {
    const files = {
      found: [],
      missing: [],
      misplaced: []
    };

    for (const expectedPath of holon.expectedPaths) {
      const fullPath = path.join(this.projectRoot, expectedPath);
      if (fs.existsSync(fullPath)) {
        const foundFiles = this.findFilesRecursive(fullPath);
        files.found.push(...foundFiles);
      } else {
        files.missing.push(expectedPath);
      }
    }

    // Check for misplaced files
    files.misplaced = await this.findMisplacedFiles(holonName, holon);

    return files;
  }

  async findMisplacedFiles(holonName, holon) {
    const misplaced = [];
    const searchPaths = [
      'src/',
      'frontend/src/',
      'backend/src/',
      'scripts/',
      'data/'
    ];

    for (const searchPath of searchPaths) {
      const fullPath = path.join(this.projectRoot, searchPath);
      if (fs.existsSync(fullPath)) {
        const files = this.findFilesRecursive(fullPath);
        for (const file of files) {
          if (this.isMisplacedFile(file, holonName, holon)) {
            misplaced.push(file);
          }
        }
      }
    }

    return misplaced;
  }

  isMisplacedFile(filePath, holonName, holon) {
    const filename = path.basename(filePath);
    const dirname = path.dirname(filePath);
    
    // Check if file contains holon-specific content
    const holonKeywords = [
      holonName,
      ...holon.managers.map(m => m.toLowerCase()),
      ...holon.components.map(c => c.toLowerCase())
    ];

    const hasHolonContent = holonKeywords.some(keyword => 
      filename.toLowerCase().includes(keyword) ||
      filePath.toLowerCase().includes(keyword)
    );

    // Check if it's in the wrong location
    const isInWrongLocation = !holon.expectedPaths.some(expectedPath => 
      filePath.includes(expectedPath)
    );

    return hasHolonContent && isInWrongLocation;
  }

  findFilesRecursive(dir) {
    const files = [];
    
    try {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          files.push(...this.findFilesRecursive(fullPath));
        } else if (stat.isFile()) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Directory doesn't exist or can't be read
    }
    
    return files;
  }

  async checkManagers(managers) {
    const results = {};
    for (const manager of managers) {
      results[manager] = await this.findManagerFile(manager);
    }
    return results;
  }

  async findManagerFile(managerName) {
    const searchPaths = [
      'src/core/holons/',
      'src/core/managers/',
      'src/managers/'
    ];

    for (const searchPath of searchPaths) {
      const fullPath = path.join(this.projectRoot, searchPath);
      if (fs.existsSync(fullPath)) {
        const files = this.findFilesRecursive(fullPath);
        for (const file of files) {
          if (path.basename(file).includes(managerName)) {
            return { found: true, path: file };
          }
        }
      }
    }

    return { found: false, path: null };
  }

  async checkComponents(components) {
    const results = {};
    for (const component of components) {
      results[component] = await this.findComponentFile(component);
    }
    return results;
  }

  async findComponentFile(componentName) {
    const searchPaths = [
      'src/components/',
      'frontend/src/components/',
      'src/core/components/'
    ];

    for (const searchPath of searchPaths) {
      const fullPath = path.join(this.projectRoot, searchPath);
      if (fs.existsSync(fullPath)) {
        const files = this.findFilesRecursive(fullPath);
        for (const file of files) {
          if (path.basename(file).includes(componentName)) {
            return { found: true, path: file };
          }
        }
      }
    }

    return { found: false, path: null };
  }

  async checkServices(services) {
    const results = {};
    for (const service of services) {
      results[service] = await this.findServiceFile(service);
    }
    return results;
  }

  async findServiceFile(serviceName) {
    const searchPaths = [
      'src/services/',
      'backend/src/services/',
      'src/core/services/'
    ];

    for (const searchPath of searchPaths) {
      const fullPath = path.join(this.projectRoot, searchPath);
      if (fs.existsSync(fullPath)) {
        const files = this.findFilesRecursive(fullPath);
        for (const file of files) {
          if (path.basename(file).includes(serviceName)) {
            return { found: true, path: file };
          }
        }
      }
    }

    return { found: false, path: null };
  }

  async findLevelFiles(levelName, level) {
    const files = {
      found: [],
      missing: [],
      total: 0
    };

    for (const expectedPath of level.expectedPaths) {
      const fullPath = path.join(this.projectRoot, expectedPath);
      if (fs.existsSync(fullPath)) {
        const foundFiles = this.findFilesRecursive(fullPath);
        files.found.push(...foundFiles);
        files.total += foundFiles.length;
      } else {
        files.missing.push(expectedPath);
      }
    }

    return files;
  }

  async calculateLevelHealth(levelName, level) {
    // This would implement level-specific health calculations
    // For now, return a basic score based on file presence
    let score = 100;
    
    for (const expectedPath of level.expectedPaths) {
      const fullPath = path.join(this.projectRoot, expectedPath);
      if (!fs.existsSync(fullPath)) {
        score -= 25;
      }
    }
    
    return Math.max(0, score);
  }

  async checkLevelPerformance(levelName) {
    // This would implement level-specific performance checks
    return { status: 'unknown', metrics: {} };
  }

  async findLevelIssues(levelName, level) {
    const issues = [];
    
    for (const expectedPath of level.expectedPaths) {
      const fullPath = path.join(this.projectRoot, expectedPath);
      if (!fs.existsSync(fullPath)) {
        issues.push(`Missing expected path: ${expectedPath}`);
      }
    }
    
    return issues;
  }

  async checkPerformance() {
    // Basic performance checks
    return { status: 'unknown', metrics: {} };
  }

  async checkSecurity() {
    // Basic security checks
    return { status: 'unknown', metrics: {} };
  }

  async checkDocumentation() {
    // Basic documentation checks
    return { status: 'unknown', metrics: {} };
  }

  calculateSystemStatus(metrics) {
    if (metrics.buildStatus.status === 'failed') return 'critical';
    if (metrics.gitStatus.modifiedFiles > 50) return 'warning';
    return 'healthy';
  }

  calculateHolonStatus(metrics) {
    const missingManagers = Object.values(metrics.managers).filter(m => !m.found).length;
    const missingComponents = Object.values(metrics.components).filter(c => !c.found).length;
    
    if (missingManagers > 0 || missingComponents > 0) return 'incomplete';
    if (metrics.misplacedFiles.length > 0) return 'warning';
    return 'healthy';
  }

  calculateLevelStatus(metrics) {
    if (metrics.health < 50) return 'critical';
    if (metrics.health < 80) return 'warning';
    return 'healthy';
  }

  calculateOverallStatus(allResults) {
    const statuses = [];
    
    if (allResults.system) {
      statuses.push(this.calculateSystemStatus(allResults.system));
    }
    
    for (const holonStatus of Object.values(allResults.holons)) {
      statuses.push(this.calculateHolonStatus(holonStatus));
    }
    
    for (const levelStatus of Object.values(allResults.levels)) {
      statuses.push(this.calculateLevelStatus(levelStatus));
    }
    
    if (statuses.includes('critical')) return 'critical';
    if (statuses.includes('warning')) return 'warning';
    return 'healthy';
  }

  async generateReport() {
    console.log('\n📊 STATUS ASSESSMENT REPORT');
    console.log('============================');
    console.log(`Assessment ID: ${this.assessmentId}`);
    console.log(`Target: ${this.results.target}`);
    console.log(`Status: ${this.results.status}`);
    console.log(`Duration: ${this.results.duration}ms`);
    
    if (this.results.misplacedFiles.length > 0) {
      console.log('\n🚨 MISPLACED FILES:');
      for (const file of this.results.misplacedFiles) {
        console.log(`  - ${file}`);
      }
    }
    
    if (this.results.issues.length > 0) {
      console.log('\n⚠️  ISSUES:');
      for (const issue of this.results.issues) {
        console.log(`  - ${issue}`);
      }
    }
    
    if (this.results.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:');
      for (const rec of this.results.recommendations) {
        console.log(`  - ${rec}`);
      }
    }
  }

  async saveResults() {
    const reportPath = path.join(this.projectRoot, 'data/assessments', `${this.assessmentId}.json`);
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    
    // Update latest assessment
    const latestPath = path.join(this.projectRoot, 'data/assessments', 'latest_assessment.json');
    fs.writeFileSync(latestPath, JSON.stringify(this.results, null, 2));
  }
}

// Execute if run directly
if (require.main === module) {
  const protocol = new StatusAssessmentProtocol();
  protocol.execute().catch(console.error);
}

module.exports = StatusAssessmentProtocol; 