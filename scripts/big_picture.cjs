#!/usr/bin/env node

/**
 * Big Picture Command v1.0.0
 * 
 * PURPOSE: Provides a comprehensive overview of the Greenlight Platform system,
 * including holons, managers, modules, and administrative units. Supports system
 * ontology understanding and requirements improvement by showing the current
 * state and identifying gaps or areas for enhancement.
 * 
 * USAGE: node scripts/big_picture.cjs
 * 
 * FEATURES:
 * - Holon inventory with managers and modules
 * - Administrative unit summaries
 * - Protocol system overview
 * - System health indicators
 * - Gap analysis and recommendations
 * - Export capabilities for documentation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class BigPictureCommand {
  constructor() {
    this.projectRoot = process.cwd();
    this.timestamp = new Date().toISOString();
    this.sessionId = this.generateSessionId();
    this.report = {
      metadata: this.generateMetadata(),
      holons: {},
      managers: {},
      modules: {},
      administrativeUnits: {},
      protocols: {},
      systemHealth: {},
      gaps: [],
      recommendations: []
    };
  }

  generateSessionId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `big-picture-${timestamp}-${random}`;
  }

  generateMetadata() {
    return {
      sessionId: this.sessionId,
      timestamp: this.timestamp,
      command: 'big_picture',
      version: '1.0.0',
      projectRoot: this.projectRoot,
      environment: process.env.NODE_ENV || 'development'
    };
  }

  async execute() {
    console.log('🔍 Big Picture Analysis v1.0.0');
    console.log('================================');
    console.log(`Session ID: ${this.sessionId}`);
    console.log(`Timestamp: ${this.timestamp}`);
    console.log('');

    try {
      // Phase 1: Holon Inventory
      await this.analyzeHolons();
      
      // Phase 2: Manager Analysis
      await this.analyzeManagers();
      
      // Phase 3: Module Inventory
      await this.analyzeModules();
      
      // Phase 4: Administrative Units
      await this.analyzeAdministrativeUnits();
      
      // Phase 5: Protocol System
      await this.analyzeProtocols();
      
      // Phase 6: System Health Assessment
      await this.assessSystemHealth();
      
      // Phase 7: Gap Analysis
      await this.performGapAnalysis();
      
      // Phase 8: Generate Recommendations
      await this.generateRecommendations();
      
      // Phase 9: Display Results
      await this.displayResults();
      
      // Phase 10: Export Report
      await this.exportReport();
      
      console.log('');
      console.log('✅ Big Picture Analysis Complete');
      console.log('📊 System overview generated');
      console.log('🔍 Gaps and recommendations identified');
      console.log('📁 Report exported for documentation');
      
    } catch (error) {
      console.error('❌ Big Picture Analysis Failed:', error.message);
      this.logError(error);
      process.exit(1);
    }
  }

  async analyzeHolons() {
    console.log('🏗️ Phase 1: Analyzing Holons...');
    
    // Greenlight Platform Holons (system governance and architecture)
    const greenlightHolons = [
      'src/platforms/articulate',
      'src/platforms/elaborate', 
      'src/platforms/knowledge',
      'src/platforms/system-master',
      'src/platforms/work',
      'src/components/SystemMaster',
      'src/components/CoachingToolkit'
    ];

    // Top_Bins Holons (product-specific, should not be in Greenlight Platform)
    const topBinsHolons = [
      'src/components/Elevate',
      'src/components/Administrate'
    ];

    // Analyze Greenlight Platform Holons
    for (const holonPath of greenlightHolons) {
      const fullPath = path.join(this.projectRoot, holonPath);
      if (fs.existsSync(fullPath)) {
        const holonName = path.basename(holonPath);
        const holonType = path.dirname(holonPath).split('/').pop();
        
        this.report.holons[holonName] = {
          type: holonType,
          path: holonPath,
          exists: true,
          boundary: 'greenlight-platform',
          components: this.getHolonComponents(fullPath),
          managers: this.getHolonManagers(fullPath),
          modules: this.getHolonModules(fullPath),
          status: this.getHolonStatus(fullPath),
          lastModified: this.getLastModified(fullPath),
          violations: this.checkBoundaryViolations(holonPath)
        };
      }
    }

    // Check for Top_Bins violations in Greenlight Platform
    for (const holonPath of topBinsHolons) {
      const fullPath = path.join(this.projectRoot, holonPath);
      if (fs.existsSync(fullPath)) {
        const holonName = path.basename(holonPath);
        
        this.report.holons[holonName] = {
          type: 'components',
          path: holonPath,
          exists: true,
          boundary: 'top-bins-violation',
          components: this.getHolonComponents(fullPath),
          managers: this.getHolonManagers(fullPath),
          modules: this.getHolonModules(fullPath),
          status: 'boundary-violation',
          lastModified: this.getLastModified(fullPath),
          violations: ['Top_Bins holon found in Greenlight Platform'],
          recommendation: 'Move to Top_Bins repository or remove from Greenlight Platform'
        };
      }
    }
  }

  checkBoundaryViolations(holonPath) {
    const violations = [];
    const fullPath = path.join(this.projectRoot, holonPath);
    
    try {
      const files = fs.readdirSync(fullPath, { recursive: true });
      for (const file of files) {
        if (typeof file === 'string' && file.includes('.')) {
          const filePath = path.join(fullPath, file);
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Check for Top_Bins patterns in Greenlight Platform
          const topBinsPatterns = [
            'PlayerCard', 'PlayerGrid', 'MediaLibrary', 'TeamPortal',
            'playerData', 'playerStats', 'coachingSession', 'executiveDashboard'
          ];
          
          for (const pattern of topBinsPatterns) {
            if (content.includes(pattern)) {
              violations.push(`Contains Top_Bins pattern: ${pattern}`);
            }
          }
        }
      }
    } catch (error) {
      // File might not be readable
    }
    
    return violations;
  }

  getHolonComponents(holonPath) {
    const components = [];
    try {
      const files = fs.readdirSync(holonPath);
      for (const file of files) {
        if (file.endsWith('.tsx') || file.endsWith('.ts')) {
          components.push(file);
        }
      }
    } catch (error) {
      // Directory might not exist or be readable
    }
    return components;
  }

  getHolonManagers(holonPath) {
    const managers = [];
    try {
      const files = fs.readdirSync(holonPath);
      for (const file of files) {
        if (file.includes('Manager') || file.includes('manager')) {
          managers.push(file);
        }
      }
    } catch (error) {
      // Directory might not exist or be readable
    }
    return managers;
  }

  getHolonModules(holonPath) {
    const modules = [];
    try {
      const subdirs = fs.readdirSync(holonPath, { withFileTypes: true });
      for (const dirent of subdirs) {
        if (dirent.isDirectory()) {
          modules.push(dirent.name);
        }
      }
    } catch (error) {
      // Directory might not exist or be readable
    }
    return modules;
  }

  getHolonStatus(holonPath) {
    try {
      // Check if holon has main component file
      const mainFiles = ['index.ts', 'index.tsx', 'main.ts', 'main.tsx'];
      for (const file of mainFiles) {
        if (fs.existsSync(path.join(holonPath, file))) {
          return 'active';
        }
      }
      return 'incomplete';
    } catch (error) {
      return 'unknown';
    }
  }

  getLastModified(dirPath) {
    try {
      const stats = fs.statSync(dirPath);
      return stats.mtime.toISOString();
    } catch (error) {
      return 'unknown';
    }
  }

  async analyzeManagers() {
    console.log('👥 Phase 2: Analyzing Managers...');
    
    // Find all manager files in scripts directory
    const scriptsDir = path.join(this.projectRoot, 'scripts');
    const protocolsDir = path.join(this.projectRoot, 'scripts', 'protocols');
    
    const managerFiles = [];
    
    // Scan scripts directory for manager files
    if (fs.existsSync(scriptsDir)) {
      const scriptFiles = fs.readdirSync(scriptsDir);
      for (const file of scriptFiles) {
        if (file.endsWith('.cjs') || file.endsWith('.js') || file.endsWith('.ts')) {
          if (file.includes('manager') || file.includes('Manager')) {
            managerFiles.push(`scripts/${file}`);
          }
        }
      }
    }
    
    // Scan protocols directory for manager files
    if (fs.existsSync(protocolsDir)) {
      const protocolFiles = fs.readdirSync(protocolsDir);
      for (const file of protocolFiles) {
        if (file.endsWith('.cjs') || file.endsWith('.js') || file.endsWith('.ts')) {
          if (file.includes('manager') || file.includes('Manager')) {
            managerFiles.push(`scripts/protocols/${file}`);
          }
        }
      }
    }
    
    // Add specific known managers
    const knownManagers = [
      'scripts/anchor_manager.cjs',
      'scripts/protocols/boundary_enforcement_manager.cjs',
      'scripts/protocols/client_onboarding_manager.cjs',
      'scripts/protocols/database_manager.cjs',
      'scripts/protocols/prevention_system.cjs',
      'scripts/protocols/design-system-management.cjs',
      'scripts/protocols/protocol_monitor.cjs',
      'scripts/protocols/context_extraction_api.cjs',
      'scripts/protocols/documentation_health_check.cjs',
      'scripts/protocols/context_integration.cjs',
      'scripts/protocols/enhanced-update-protocols.cjs',
      'scripts/protocols/pre_execution_safety.cjs',
      'scripts/protocols/protocol_validation.cjs',
      'scripts/protocols/update_protocols.cjs',
      'scripts/protocols/roadmap_actuals_integration.cjs',
      'scripts/protocols/onboarding_criteria_validator.cjs',
      'scripts/protocols/boundary_monitor.cjs'
    ];
    
    // Combine and deduplicate
    const allManagers = [...new Set([...managerFiles, ...knownManagers])];
    
    for (const managerPath of allManagers) {
      const fullPath = path.join(this.projectRoot, managerPath);
      if (fs.existsSync(fullPath)) {
        const managerName = path.basename(managerPath, '.cjs').replace('.js', '').replace('.ts', '');
        
        this.report.managers[managerName] = {
          path: managerPath,
          exists: true,
          size: this.getFileSize(fullPath),
          lastModified: this.getLastModified(fullPath),
          purpose: this.extractManagerPurpose(fullPath),
          dependencies: this.extractManagerDependencies(fullPath),
          category: this.categorizeManager(managerPath)
        };
      }
    }
  }

  categorizeManager(managerPath) {
    if (managerPath.includes('protocols/')) {
      return 'protocol-manager';
    } else if (managerPath.includes('anchor')) {
      return 'system-manager';
    } else if (managerPath.includes('boundary')) {
      return 'governance-manager';
    } else if (managerPath.includes('client')) {
      return 'onboarding-manager';
    } else if (managerPath.includes('database')) {
      return 'data-manager';
    } else if (managerPath.includes('prevention')) {
      return 'safety-manager';
    } else if (managerPath.includes('design')) {
      return 'design-manager';
    } else if (managerPath.includes('context')) {
      return 'context-manager';
    } else if (managerPath.includes('documentation')) {
      return 'documentation-manager';
    } else if (managerPath.includes('roadmap')) {
      return 'roadmap-manager';
    } else if (managerPath.includes('onboarding')) {
      return 'onboarding-manager';
    } else {
      return 'utility-manager';
    }
  }

  getFileSize(filePath) {
    try {
      const stats = fs.statSync(filePath);
      return stats.size;
    } catch (error) {
      return 0;
    }
  }

  extractManagerPurpose(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const purposeMatch = content.match(/PURPOSE:\s*([^\n]+)/);
      return purposeMatch ? purposeMatch[1].trim() : 'Purpose not documented';
    } catch (error) {
      return 'Cannot read file';
    }
  }

  extractManagerDependencies(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const requires = [];
      const requireMatches = content.matchAll(/require\(['"]([^'"]+)['"]\)/g);
      for (const match of requireMatches) {
        requires.push(match[1]);
      }
      return requires;
    } catch (error) {
      return [];
    }
  }

  async analyzeModules() {
    console.log('📦 Phase 3: Analyzing Modules...');
    
    const moduleDirectories = [
      'src/core',
      'src/services',
      'src/utils',
      'src/hooks',
      'src/types',
      'src/config',
      'src/context-awareness',
      'src/session-management'
    ];

    for (const modulePath of moduleDirectories) {
      const fullPath = path.join(this.projectRoot, modulePath);
      if (fs.existsSync(fullPath)) {
        const moduleName = path.basename(modulePath);
        
        this.report.modules[moduleName] = {
          path: modulePath,
          exists: true,
          files: this.getModuleFiles(fullPath),
          submodules: this.getModuleSubmodules(fullPath),
          exports: this.getModuleExports(fullPath),
          lastModified: this.getLastModified(fullPath)
        };
      }
    }
  }

  getModuleFiles(modulePath) {
    const files = [];
    try {
      const items = fs.readdirSync(modulePath);
      for (const item of items) {
        const itemPath = path.join(modulePath, item);
        const stats = fs.statSync(itemPath);
        if (stats.isFile()) {
          files.push(item);
        }
      }
    } catch (error) {
      // Directory might not exist or be readable
    }
    return files;
  }

  getModuleSubmodules(modulePath) {
    const submodules = [];
    try {
      const items = fs.readdirSync(modulePath, { withFileTypes: true });
      for (const item of items) {
        if (item.isDirectory()) {
          submodules.push(item.name);
        }
      }
    } catch (error) {
      // Directory might not exist or be readable
    }
    return submodules;
  }

  getModuleExports(modulePath) {
    const exports = [];
    try {
      const indexFile = path.join(modulePath, 'index.ts');
      if (fs.existsSync(indexFile)) {
        const content = fs.readFileSync(indexFile, 'utf8');
        const exportMatches = content.matchAll(/export\s+(?:{([^}]+)}|(\w+))/g);
        for (const match of exportMatches) {
          if (match[1]) {
            exports.push(...match[1].split(',').map(e => e.trim()));
          } else if (match[2]) {
            exports.push(match[2]);
          }
        }
      }
    } catch (error) {
      // File might not exist or be readable
    }
    return exports;
  }

  async analyzeAdministrativeUnits() {
    console.log('🏛️ Phase 4: Analyzing Administrative Units...');
    
    const adminUnits = [
      { name: 'governance', path: 'src/core/governance' },
      { name: 'protocols', path: 'src/protocols' },
      { name: 'config', path: 'config' },
      { name: 'docs', path: 'docs' },
      { name: 'scripts', path: 'scripts' },
      { name: 'data', path: 'data' }
    ];

    for (const unit of adminUnits) {
      const fullPath = path.join(this.projectRoot, unit.path);
      if (fs.existsSync(fullPath)) {
        this.report.administrativeUnits[unit.name] = {
          path: unit.path,
          exists: true,
          structure: this.getAdminUnitStructure(fullPath),
          responsibilities: this.getAdminUnitResponsibilities(unit.name),
          lastModified: this.getLastModified(fullPath)
        };
      }
    }
  }

  getAdminUnitStructure(unitPath) {
    const structure = {};
    try {
      const items = fs.readdirSync(unitPath, { withFileTypes: true });
      for (const item of items) {
        if (item.isDirectory()) {
          structure[item.name] = 'directory';
        } else {
          structure[item.name] = 'file';
        }
      }
    } catch (error) {
      // Directory might not exist or be readable
    }
    return structure;
  }

  getAdminUnitResponsibilities(unitName) {
    const responsibilities = {
      governance: 'System governance, policies, and compliance',
      protocols: 'System protocols and procedures',
      config: 'Configuration management and environment setup',
      docs: 'Documentation and knowledge management',
      scripts: 'Automation and utility scripts',
      data: 'Data storage and session management'
    };
    return responsibilities[unitName] || 'Responsibilities not defined';
  }

  async analyzeProtocols() {
    console.log('📋 Phase 5: Analyzing Protocol System...');
    
    const protocolsDir = path.join(this.projectRoot, 'scripts', 'protocols');
    const protocolFiles = [];
    
    // Scan protocols directory for all protocol files
    if (fs.existsSync(protocolsDir)) {
      const files = fs.readdirSync(protocolsDir);
      for (const file of files) {
        if (file.endsWith('.cjs') || file.endsWith('.js') || file.endsWith('.ts')) {
          protocolFiles.push(`scripts/protocols/${file}`);
        }
      }
    }
    
    // Add specific known protocols that might be in other locations
    const knownProtocols = [
      'scripts/protocols/launch_protocol.cjs',
      'scripts/protocols/pre_wrap_audit_protocol.cjs',
      'scripts/protocols/boundary_enforcement_manager.cjs',
      'scripts/protocols/client_onboarding_manager.cjs',
      'scripts/protocols/database_manager.cjs',
      'scripts/protocols/prevention_system.cjs',
      'scripts/protocols/design-system-management.cjs',
      'scripts/protocols/protocol_monitor.cjs',
      'scripts/protocols/context_extraction_api.cjs',
      'scripts/protocols/documentation_health_check.cjs',
      'scripts/protocols/context_integration.cjs',
      'scripts/protocols/enhanced-update-protocols.cjs',
      'scripts/protocols/pre_execution_safety.cjs',
      'scripts/protocols/protocol_validation.cjs',
      'scripts/protocols/update_protocols.cjs',
      'scripts/protocols/roadmap_actuals_integration.cjs',
      'scripts/protocols/onboarding_criteria_validator.cjs',
      'scripts/protocols/boundary_monitor.cjs',
      'scripts/protocols/end_of_chat_protocol.cjs',
      'scripts/protocols/extract_session_communication.js',
      'scripts/protocols/planning_criteria_protocol.ts'
    ];
    
    // Combine and deduplicate
    const allProtocols = [...new Set([...protocolFiles, ...knownProtocols])];
    
    for (const protocolPath of allProtocols) {
      const fullPath = path.join(this.projectRoot, protocolPath);
      if (fs.existsSync(fullPath)) {
        const protocolName = path.basename(protocolPath, '.cjs').replace('.js', '').replace('.ts', '');
        
        this.report.protocols[protocolName] = {
          path: protocolPath,
          exists: true,
          version: this.extractProtocolVersion(fullPath),
          purpose: this.extractManagerPurpose(fullPath),
          status: this.getProtocolStatus(fullPath),
          lastModified: this.getLastModified(fullPath),
          category: this.categorizeProtocol(protocolPath),
          size: this.getFileSize(fullPath)
        };
      }
    }
  }

  categorizeProtocol(protocolPath) {
    if (protocolPath.includes('launch')) {
      return 'session-protocol';
    } else if (protocolPath.includes('audit') || protocolPath.includes('pre_wrap')) {
      return 'audit-protocol';
    } else if (protocolPath.includes('boundary')) {
      return 'governance-protocol';
    } else if (protocolPath.includes('client') || protocolPath.includes('onboarding')) {
      return 'onboarding-protocol';
    } else if (protocolPath.includes('database')) {
      return 'data-protocol';
    } else if (protocolPath.includes('prevention') || protocolPath.includes('safety')) {
      return 'safety-protocol';
    } else if (protocolPath.includes('design')) {
      return 'design-protocol';
    } else if (protocolPath.includes('context')) {
      return 'context-protocol';
    } else if (protocolPath.includes('documentation')) {
      return 'documentation-protocol';
    } else if (protocolPath.includes('roadmap')) {
      return 'roadmap-protocol';
    } else if (protocolPath.includes('update') || protocolPath.includes('enhanced')) {
      return 'update-protocol';
    } else if (protocolPath.includes('validation')) {
      return 'validation-protocol';
    } else if (protocolPath.includes('monitor')) {
      return 'monitoring-protocol';
    } else if (protocolPath.includes('end_of_chat') || protocolPath.includes('extract_session')) {
      return 'communication-protocol';
    } else if (protocolPath.includes('planning')) {
      return 'planning-protocol';
    } else {
      return 'utility-protocol';
    }
  }

  extractProtocolVersion(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const versionMatch = content.match(/v(\d+\.\d+\.\d+)/);
      return versionMatch ? versionMatch[1] : 'unknown';
    } catch (error) {
      return 'unknown';
    }
  }

  getProtocolStatus(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('TODO') || content.includes('FIXME')) {
        return 'needs_attention';
      } else if (content.includes('DEPRECATED') || content.includes('LEGACY')) {
        return 'deprecated';
      } else {
        return 'active';
      }
    } catch (error) {
      return 'unknown';
    }
  }

  async assessSystemHealth() {
    console.log('🏥 Phase 6: Assessing System Health...');
    
    // Check build status
    try {
      execSync('npm run build', { stdio: 'pipe' });
      this.report.systemHealth.buildStatus = 'success';
    } catch (error) {
      this.report.systemHealth.buildStatus = 'failed';
    }

    // Check git status
    try {
      const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
      this.report.systemHealth.gitStatus = {
        hasChanges: gitStatus.trim().length > 0,
        changeCount: gitStatus.trim().split('\n').filter(line => line.length > 0).length
      };
    } catch (error) {
      this.report.systemHealth.gitStatus = { hasChanges: false, changeCount: 0 };
    }

    // Check file structure integrity
    this.report.systemHealth.fileStructure = this.checkFileStructureIntegrity();
  }

  checkFileStructureIntegrity() {
    const requiredDirs = ['src', 'scripts', 'config', 'docs', 'data'];
    const integrity = {};
    
    for (const dir of requiredDirs) {
      const dirPath = path.join(this.projectRoot, dir);
      integrity[dir] = fs.existsSync(dirPath);
    }
    
    return integrity;
  }

  async performGapAnalysis() {
    console.log('🔍 Phase 7: Performing Gap Analysis...');
    
    // Check for missing holons
    const expectedHolons = ['articulate', 'elaborate', 'knowledge', 'system-master', 'work'];
    for (const holon of expectedHolons) {
      if (!this.report.holons[holon]) {
        this.report.gaps.push(`Missing holon: ${holon}`);
      }
    }

    // Check for incomplete holons
    for (const [holonName, holonData] of Object.entries(this.report.holons)) {
      if (holonData.boundary === 'greenlight-platform' && holonData.status === 'incomplete') {
        this.report.gaps.push(`Incomplete holon: ${holonName} - missing main component`);
      }
    }

    // Check for boundary violations
    for (const [holonName, holonData] of Object.entries(this.report.holons)) {
      if (holonData.boundary === 'top-bins-violation') {
        this.report.gaps.push(`CRITICAL: Boundary violation - ${holonName} should be in Top_Bins, not Greenlight Platform`);
      }
      if (holonData.violations && holonData.violations.length > 0) {
        this.report.gaps.push(`Boundary violations in ${holonName}: ${holonData.violations.length} issues found`);
      }
    }

    // Check for missing managers
    const expectedManagers = ['anchor_manager', 'boundary_enforcement_manager'];
    for (const manager of expectedManagers) {
      if (!this.report.managers[manager]) {
        this.report.gaps.push(`Missing manager: ${manager}`);
      }
    }

    // Check for missing protocols
    const expectedProtocols = ['launch_protocol', 'pre_wrap_audit_protocol'];
    for (const protocol of expectedProtocols) {
      if (!this.report.protocols[protocol]) {
        this.report.gaps.push(`Missing protocol: ${protocol}`);
      }
    }

    // Check for build issues
    if (this.report.systemHealth.buildStatus === 'failed') {
      this.report.gaps.push('Build system failing - requires immediate attention');
    }

    // Check for protocol documentation issues
    for (const [protocolName, protocolData] of Object.entries(this.report.protocols)) {
      if (protocolData.purpose === 'Purpose not documented') {
        this.report.gaps.push(`Protocol ${protocolName} missing purpose documentation`);
      }
    }
  }

  async generateRecommendations() {
    console.log('💡 Phase 8: Generating Recommendations...');
    
    // Recommendations based on gaps
    if (this.report.gaps.length > 0) {
      this.report.recommendations.push('Address identified gaps before proceeding with new features');
    }

    // Critical boundary violation recommendations
    const boundaryViolations = Object.entries(this.report.holons)
      .filter(([name, data]) => data.boundary === 'top-bins-violation')
      .map(([name]) => name);
    
    if (boundaryViolations.length > 0) {
      this.report.recommendations.push(`CRITICAL: Move Top_Bins holons to Top_Bins repository: ${boundaryViolations.join(', ')}`);
    }

    // Recommendations based on holon status
    const incompleteHolons = Object.entries(this.report.holons)
      .filter(([name, data]) => data.boundary === 'greenlight-platform' && data.status === 'incomplete')
      .map(([name]) => name);
    
    if (incompleteHolons.length > 0) {
      this.report.recommendations.push(`Complete development of Greenlight Platform holons: ${incompleteHolons.join(', ')}`);
    }

    // Recommendations based on system health
    if (this.report.systemHealth.buildStatus === 'failed') {
      this.report.recommendations.push('Fix build issues to ensure system stability');
    }

    // Protocol documentation recommendations
    const undocumentedProtocols = Object.entries(this.report.protocols)
      .filter(([name, data]) => data.purpose === 'Purpose not documented')
      .map(([name]) => name);
    
    if (undocumentedProtocols.length > 0) {
      this.report.recommendations.push(`Add purpose documentation to protocols: ${undocumentedProtocols.join(', ')}`);
    }

    // General recommendations
    this.report.recommendations.push('Implement comprehensive testing for all holons');
    this.report.recommendations.push('Establish monitoring and alerting for system health');
    this.report.recommendations.push('Create documentation for all administrative units');
    this.report.recommendations.push('Run boundary enforcement before all operations');
  }

  async displayResults() {
    console.log('📊 Phase 9: Displaying Results...');
    console.log('');

    // Display Holons
    console.log('🏗️ HOLONS:');
    console.log('==========');
    
    // Greenlight Platform Holons
    console.log('🟢 GREENLIGHT PLATFORM HOLONS:');
    for (const [name, data] of Object.entries(this.report.holons)) {
      if (data.boundary === 'greenlight-platform') {
        const status = data.status === 'active' ? '✅' : data.status === 'incomplete' ? '⚠️' : '❌';
        console.log(`${status} ${name} (${data.type})`);
        console.log(`   Path: ${data.path}`);
        console.log(`   Components: ${data.components.length}`);
        console.log(`   Managers: ${data.managers.length}`);
        console.log(`   Modules: ${data.modules.length}`);
        if (data.violations && data.violations.length > 0) {
          console.log(`   ⚠️  Boundary Violations: ${data.violations.length}`);
        }
        console.log('');
      }
    }
    
    // Top_Bins Violations
    const topBinsViolations = Object.entries(this.report.holons).filter(([name, data]) => data.boundary === 'top-bins-violation');
    if (topBinsViolations.length > 0) {
      console.log('🔴 TOP_BINS VIOLATIONS (Should be moved to Top_Bins):');
      for (const [name, data] of topBinsViolations) {
        console.log(`❌ ${name} (${data.type}) - BOUNDARY VIOLATION`);
        console.log(`   Path: ${data.path}`);
        console.log(`   Recommendation: ${data.recommendation}`);
        console.log('');
      }
    }

    // Display Managers by Category
    console.log('👥 MANAGERS:');
    console.log('============');
    
    const managerCategories = {};
    for (const [name, data] of Object.entries(this.report.managers)) {
      const category = data.category || 'uncategorized';
      if (!managerCategories[category]) {
        managerCategories[category] = [];
      }
      managerCategories[category].push({ name, data });
    }
    
    for (const [category, managers] of Object.entries(managerCategories)) {
      console.log(`📂 ${category.toUpperCase().replace('-', ' ')} (${managers.length}):`);
      for (const { name, data } of managers) {
        console.log(`   ✅ ${name}`);
        console.log(`      Purpose: ${data.purpose}`);
        console.log(`      Dependencies: ${data.dependencies.length}`);
        console.log(`      Size: ${Math.round(data.size / 1024)}KB`);
      }
      console.log('');
    }

    // Display Protocols by Category
    console.log('📋 PROTOCOLS:');
    console.log('=============');
    
    const protocolCategories = {};
    for (const [name, data] of Object.entries(this.report.protocols)) {
      const category = data.category || 'uncategorized';
      if (!protocolCategories[category]) {
        protocolCategories[category] = [];
      }
      protocolCategories[category].push({ name, data });
    }
    
    for (const [category, protocols] of Object.entries(protocolCategories)) {
      console.log(`📂 ${category.toUpperCase().replace('-', ' ')} (${protocols.length}):`);
      for (const { name, data } of protocols) {
        const status = data.status === 'active' ? '✅' : data.status === 'needs_attention' ? '⚠️' : '❌';
        console.log(`   ${status} ${name} v${data.version}`);
        console.log(`      Purpose: ${data.purpose}`);
        console.log(`      Size: ${Math.round(data.size / 1024)}KB`);
      }
      console.log('');
    }

    // Display Administrative Units
    console.log('🏛️ ADMINISTRATIVE UNITS:');
    console.log('========================');
    for (const [name, data] of Object.entries(this.report.administrativeUnits)) {
      console.log(`✅ ${name}`);
      console.log(`   Responsibilities: ${data.responsibilities}`);
      console.log(`   Structure: ${Object.keys(data.structure).length} items`);
      console.log('');
    }

    // Display System Health
    console.log('🏥 SYSTEM HEALTH:');
    console.log('=================');
    const buildStatus = this.report.systemHealth.buildStatus === 'success' ? '✅' : '❌';
    console.log(`${buildStatus} Build Status: ${this.report.systemHealth.buildStatus}`);
    console.log(`📁 File Structure: ${Object.values(this.report.systemHealth.fileStructure).filter(Boolean).length}/${Object.keys(this.report.systemHealth.fileStructure).length} directories present`);
    console.log('');

    // Display Gaps
    if (this.report.gaps.length > 0) {
      console.log('🔍 IDENTIFIED GAPS:');
      console.log('==================');
      for (const gap of this.report.gaps) {
        console.log(`⚠️  ${gap}`);
      }
      console.log('');
    }

    // Display Recommendations
    if (this.report.recommendations.length > 0) {
      console.log('💡 RECOMMENDATIONS:');
      console.log('==================');
      for (const recommendation of this.report.recommendations) {
        console.log(`💡 ${recommendation}`);
      }
      console.log('');
    }
  }

  async exportReport() {
    console.log('📁 Phase 10: Exporting Report...');
    
    const reportsDir = path.join(this.projectRoot, 'data', 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    const reportFile = path.join(reportsDir, `big-picture-${this.sessionId}.json`);
    fs.writeFileSync(reportFile, JSON.stringify(this.report, null, 2));
    
    console.log(`📁 Report exported to: ${reportFile}`);
  }

  logError(error) {
    const errorLog = {
      sessionId: this.sessionId,
      timestamp: this.timestamp,
      command: 'big_picture',
      error: {
        message: error.message,
        stack: error.stack
      }
    };

    const errorPath = path.join(this.projectRoot, 'BIG_PICTURE_ERROR.json');
    fs.writeFileSync(errorPath, JSON.stringify(errorLog, null, 2));
    console.error(`📁 Error logged to: ${errorPath}`);
  }
}

// Run the big picture command
if (require.main === module) {
  const bigPicture = new BigPictureCommand();
  bigPicture.execute().catch(error => {
    console.error('Big picture command failed:', error);
    process.exit(1);
  });
}

module.exports = BigPictureCommand; 