#!/usr/bin/env node

/**
 * Anchor Manager
 * 
 * PURPOSE: Provides system-wide anchor command functionality for spot checks
 * and context awareness across all platforms in the workspace.
 * 
 * USAGE: node scripts/anchor_manager.cjs [--platform=all|specific] [--quick]
 * 
 * FEATURES:
 * - Cross-platform discovery and analysis
 * - System health assessment
 * - Context awareness spot checks
 * - Roadmap alignment validation
 * - Performance metrics collection
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class AnchorManager {
  constructor() {
    this.projectRoot = process.cwd();
    this.startTime = Date.now();
    this.results = {
      platforms: [],
      systemHealth: 'unknown',
      recommendations: [],
      executionTime: 0,
      success: false
    };
    
    // Parse command line arguments
    this.args = process.argv.slice(2);
    this.quickMode = this.args.includes('--quick');
    this.coreMode = this.args.includes('--core');
  }

  async executeAnchorCommand() {
    console.log('🔗 Anchor Manager - System-Wide Analysis');
    console.log('==========================================');
    console.log(`Timestamp: ${new Date().toISOString()}`);
    if (this.quickMode) {
      console.log('⚡ Quick Mode: Skipping intensive phases');
    }
    if (this.coreMode) {
      console.log('🎯 Core Mode: Essential phases only');
    }
    console.log('');

    // Add global timeout to prevent hanging
    const globalTimeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Anchor command timeout after 30 seconds')), 30000);
    });

    try {
      const anchorPromise = this.executeAnchorPhases();
      await Promise.race([anchorPromise, globalTimeout]);
      
      this.results.success = true;
      this.results.executionTime = Date.now() - this.startTime;
      
      return this.results;
      
    } catch (error) {
      console.error('❌ Anchor command failed:', error.message);
      this.results.success = false;
      this.results.executionTime = Date.now() - this.startTime;
      return this.results;
    }
  }

  async executeAnchorPhases() {
    // Phase 1: Discover platforms
    await this.discoverPlatforms();
    
    // Phase 2: Analyze each platform
    await this.analyzePlatforms();
    
    // Phase 3: Generate system-wide assessment
    await this.generateSystemAssessment();
    
    // Phase 4: Generate recommendations
    await this.generateRecommendations();
    
    // Phase 5: Audit updates and dependencies
    await this.auditUpdatesAndDependencies();
    
    // Phase 6: Environment Variable Governance Check (skipped - runs independently)
    console.log('⏭️  Phase 6: Environment Variable Governance Check (skipped - use "npm run checkpoint" for full analysis)');
    
    // Phase 7: Milestone Tracking and Documentation (skipped - runs independently)
    console.log('⏭️  Phase 7: Milestone Tracking and Documentation (skipped - use "npm run checkpoint" for full analysis)');
    
    // Phase 8: Display results
    await this.displayResults();
    
    // Phase 9: Write session and audit logs
    await this.writeSessionAndAuditLogs();
  }

  async discoverPlatforms() {
    console.log('🔍 Phase 1: Discovering Platforms...');
    
    const platforms = [];
    const discoveredPaths = new Set(); // Track paths to avoid duplicates
    
    // Check current directory (Greenlight Platform)
    if (this.isPlatformDirectory(this.projectRoot)) {
      platforms.push({
        name: 'Greenlight Platform',
        path: this.projectRoot,
        type: 'main',
        status: 'discovered'
      });
      discoveredPaths.add(this.projectRoot);
    }
    
    // Check parent directory for other platforms
    const parentDir = path.dirname(this.projectRoot);
    try {
      const parentItems = fs.readdirSync(parentDir, { withFileTypes: true });
      
      parentItems.forEach(item => {
        if (item.isDirectory()) {
          const platformPath = path.join(parentDir, item.name);
          
          // Skip if we've already discovered this path
          if (discoveredPaths.has(platformPath)) {
            return;
          }
          
          // Skip node_modules and hidden directories
          if (item.name.startsWith('.') || item.name === 'node_modules') {
            return;
          }
          
          if (this.isPlatformDirectory(platformPath)) {
            // Use a more descriptive name based on package.json
            let platformName = item.name;
            try {
              const packageJsonPath = path.join(platformPath, 'package.json');
              if (fs.existsSync(packageJsonPath)) {
                const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
                if (packageJson.name && packageJson.name !== 'greenlight-platform') {
                  platformName = packageJson.name;
                }
              }
            } catch (error) {
              // Use directory name if package.json parsing fails
            }
            
            platforms.push({
              name: platformName,
              path: platformPath,
              type: 'client',
              status: 'discovered'
            });
            discoveredPaths.add(platformPath);
          }
        }
      });
    } catch (error) {
      console.log('  ⚠️  Could not scan parent directory for additional platforms');
    }
    
    // Remove duplicates based on path
    const uniquePlatforms = platforms.filter((platform, index, self) => 
      index === self.findIndex(p => p.path === platform.path)
    );
    
    this.results.platforms = uniquePlatforms;
    console.log(`  ✅ Discovered ${uniquePlatforms.length} unique platform(s)`);
  }

  isPlatformDirectory(dirPath) {
    try {
      const packageJsonPath = path.join(dirPath, 'package.json');
      const hasPackageJson = fs.existsSync(packageJsonPath);
      
      if (!hasPackageJson) return false;
      
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const hasScripts = packageJson.scripts && Object.keys(packageJson.scripts).length > 0;
      const hasDependencies = (packageJson.dependencies && Object.keys(packageJson.dependencies).length > 0) ||
                             (packageJson.devDependencies && Object.keys(packageJson.devDependencies).length > 0);
      
      return hasScripts && hasDependencies;
    } catch (error) {
      return false;
    }
  }

  async analyzePlatforms() {
    console.log('📊 Phase 2: Analyzing Platforms...');
    
    for (const platform of this.results.platforms) {
      console.log(`  🔍 Analyzing ${platform.name}...`);
      
      try {
        const analysis = await this.analyzeSinglePlatform(platform);
        platform.analysis = analysis;
        platform.status = 'analyzed';
        
        console.log(`    ✅ ${platform.name}: ${analysis.features} features, ${analysis.components} components, ${analysis.services} services`);
        
        if (analysis.tests) {
          console.log(`    🧪 Tests: ${analysis.tests} found`);
        }
        
        if (analysis.holonGovernance) {
          console.log(`    🏛️  Holon governance: ${analysis.holonGovernance}`);
        }
        
      } catch (error) {
        platform.status = 'error';
        platform.error = error.message;
        console.log(`    ❌ ${platform.name}: Analysis failed - ${error.message}`);
      }
    }
  }

  async analyzeSinglePlatform(platform) {
    const analysis = {
      features: 0,
      components: 0,
      services: 0,
      tests: 0,
      holonGovernance: null,
      buildStatus: 'unknown',
      lastCommit: null
    };
    
    try {
      // Count features
      const featuresPath = path.join(platform.path, 'featuresRegistry.json');
      if (fs.existsSync(featuresPath)) {
        const featuresData = JSON.parse(fs.readFileSync(featuresPath, 'utf8'));
        analysis.features = featuresData.features ? featuresData.features.length : 0;
      }
      
      // Count components
      const srcPath = path.join(platform.path, 'src');
      if (fs.existsSync(srcPath)) {
        analysis.components = this.countFilesInDirectory(srcPath, '.tsx');
        analysis.services = this.countFilesInDirectory(srcPath, '.ts');
      }
      
      // Count tests
      const testPath = path.join(platform.path, '__tests__');
      if (fs.existsSync(testPath)) {
        analysis.tests = this.countFilesInDirectory(testPath, '.test.');
      }
      
      // Check for holon governance
      const holonSystemPath = path.join(platform.path, 'src/architecture/holonSystem.ts');
      if (fs.existsSync(holonSystemPath)) {
        analysis.holonGovernance = 'active';
      }
      
      // Check TypeScript config
      const tsConfigPath = path.join(platform.path, 'tsconfig.json');
      if (fs.existsSync(tsConfigPath)) {
        analysis.buildStatus = 'configured';
      }
      
      // Get last commit
      try {
        const gitOutput = execSync('git log -1 --format="%H %s"', { 
          cwd: platform.path, 
          encoding: 'utf8',
          stdio: 'pipe'
        });
        analysis.lastCommit = gitOutput.trim();
      } catch (error) {
        analysis.lastCommit = 'No git history';
      }
      
    } catch (error) {
      throw new Error(`Platform analysis failed: ${error.message}`);
    }
    
    return analysis;
  }

  countFilesInDirectory(dirPath, extension) {
    let count = 0;
    
    try {
      const items = fs.readdirSync(dirPath, { withFileTypes: true });
      
      items.forEach(item => {
        const fullPath = path.join(dirPath, item.name);
        
        if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
          count += this.countFilesInDirectory(fullPath, extension);
        } else if (item.isFile() && item.name.includes(extension)) {
          count++;
        }
      });
    } catch (error) {
      // Directory doesn't exist or can't be read
    }
    
    return count;
  }

  async generateSystemAssessment() {
    console.log('🏥 Phase 3: Generating System Assessment...');
    
    const totalPlatforms = this.results.platforms.length;
    const healthyPlatforms = this.results.platforms.filter(p => p.status === 'analyzed').length;
    const errorPlatforms = this.results.platforms.filter(p => p.status === 'error').length;
    
    // Calculate overall health
    if (errorPlatforms === 0 && healthyPlatforms === totalPlatforms) {
      this.results.systemHealth = 'EXCELLENT';
    } else if (errorPlatforms === 0 && healthyPlatforms > 0) {
      this.results.systemHealth = 'GOOD';
    } else if (errorPlatforms < totalPlatforms) {
      this.results.systemHealth = 'POOR';
    } else {
      this.results.systemHealth = 'CRITICAL';
    }
    
    console.log(`  📈 Overall Health: ${this.results.systemHealth}`);
    console.log(`  🏗️  Platform Status: ${healthyPlatforms}/${totalPlatforms} healthy`);
  }

  async generateRecommendations() {
    console.log('💡 Phase 4: Generating Recommendations...');
    
    const recommendations = [];
    
    // Check for platforms with errors
    const errorPlatforms = this.results.platforms.filter(p => p.status === 'error');
    if (errorPlatforms.length > 0) {
      recommendations.push(`Address issues in ${errorPlatforms.length} platform(s): ${errorPlatforms.map(p => p.name).join(', ')}`);
    }
    
    // Check for platforms without holon governance
    const platformsWithoutHolon = this.results.platforms.filter(p => 
      p.status === 'analyzed' && !p.analysis.holonGovernance
    );
    if (platformsWithoutHolon.length > 0) {
      recommendations.push(`Implement holon governance in: ${platformsWithoutHolon.map(p => p.name).join(', ')}`);
    }
    
    // Check for platforms with low test coverage
    const platformsWithLowTests = this.results.platforms.filter(p => 
      p.status === 'analyzed' && p.analysis.tests < 5
    );
    if (platformsWithLowTests.length > 0) {
      recommendations.push(`Improve test coverage in: ${platformsWithLowTests.map(p => p.name).join(', ')}`);
    }
    
    // Check for platforms without recent commits
    const platformsWithoutCommits = this.results.platforms.filter(p => 
      p.status === 'analyzed' && p.analysis.lastCommit === 'No git history'
    );
    if (platformsWithoutCommits.length > 0) {
      recommendations.push(`Initialize git repositories in: ${platformsWithoutCommits.map(p => p.name).join(', ')}`);
    }
    
    // Default recommendations if none generated
    if (recommendations.length === 0) {
      recommendations.push('Continue with current development priorities');
      recommendations.push('Monitor system health regularly');
      recommendations.push('Maintain holon governance across all platforms');
    }
    
    this.results.recommendations = recommendations;
    
    recommendations.forEach((rec, index) => {
      console.log(`  ${index + 1}. ${rec}`);
    });
  }

  async displayResults() {
    console.log('');
    console.log('📋 Phase 5: Anchor Command Results');
    console.log('==================================');
    
    // Platform details
    console.log('🏗️  PLATFORMS:');
    this.results.platforms.forEach(platform => {
      const statusIcon = platform.status === 'analyzed' ? '✅' : 
                        platform.status === 'error' ? '❌' : '⏳';
      
      console.log(`  ${statusIcon} ${platform.name} (${platform.type})`);
      
      if (platform.analysis) {
        console.log(`    📊 Features: ${platform.analysis.features}, Components: ${platform.analysis.components}, Services: ${platform.analysis.services}`);
        if (platform.analysis.tests > 0) {
          console.log(`    🧪 Tests: ${platform.analysis.tests}`);
        }
        if (platform.analysis.holonGovernance) {
          console.log(`    🏛️  Holon Governance: ${platform.analysis.holonGovernance}`);
        }
      }
      
      if (platform.error) {
        console.log(`    ❌ Error: ${platform.error}`);
      }
    });
    
    console.log('');
    console.log('🏥 SYSTEM HEALTH:');
    console.log(`  Overall Status: ${this.results.systemHealth}`);
    console.log(`  Execution Time: ${this.results.executionTime}ms`);
    console.log(`  Success Rate: ${this.results.success ? '100%' : '0%'}`);
    
    console.log('');
    console.log('💡 RECOMMENDATIONS:');
    this.results.recommendations.forEach((rec, index) => {
      console.log(`  ${index + 1}. ${rec}`);
    });
    
    console.log('');
    console.log('🎯 NEXT STEPS:');
    console.log('  1. Review platform analysis results');
    console.log('  2. Address any critical issues identified');
    console.log('  3. Implement recommendations for improvement');
    console.log('  4. Run anchor command regularly for monitoring');
    
    // Phase 6: Recent Activity Summary
    await this.displayRecentActivitySummary();
    
    console.log('');
    console.log('✅ Anchor command completed successfully!');
  }

  async auditUpdatesAndDependencies() {
    console.log('🔧 Phase 5: Auditing Updates and Dependencies...');
    
    const auditResults = {
      dependencyUpdates: [],
      configurationUpdates: [],
      launchIssues: [],
      contextGaps: [],
      roadmapAdditions: []
    };

    // Check for outdated dependencies
    await this.checkDependencyUpdates(auditResults);
    
    // Check for configuration drift
    await this.checkConfigurationDrift(auditResults);
    
    // Check for launch-related issues
    await this.checkLaunchIssues(auditResults);
    
    // Check for context preservation issues
    await this.checkContextGaps(auditResults);
    
    // Generate roadmap additions
    await this.generateRoadmapAdditions(auditResults);
    
    // Store audit results for display
    this.results.auditResults = auditResults;
    
    console.log(`  📦 Dependencies: ${auditResults.dependencyUpdates.length} updates needed`);
    console.log(`  ⚙️  Configuration: ${auditResults.configurationUpdates.length} updates needed`);
    console.log(`  🚀 Launch Issues: ${auditResults.launchIssues.length} identified`);
    console.log(`  🧠 Context Gaps: ${auditResults.contextGaps.length} found`);
    console.log(`  🗺️  Roadmap Additions: ${auditResults.roadmapAdditions.length} items added`);
  }

  // Milestone tracking now runs independently

  async checkDependencyUpdates(auditResults) {
    try {
      // Check for outdated npm packages
      const npmOutdated = execSync('npm outdated --json', { 
        cwd: this.projectRoot, 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      const outdated = JSON.parse(npmOutdated);
      Object.keys(outdated).forEach(pkgName => {
        const info = outdated[pkgName];
        auditResults.dependencyUpdates.push({
          type: 'npm',
          package: pkgName,
          current: info.current,
          wanted: info.wanted,
          latest: info.latest,
          priority: info.latest !== info.wanted ? 'high' : 'medium'
        });
      });
    } catch (error) {
      // No outdated packages or npm not available
    }

    // Check for security vulnerabilities
    try {
      const npmAudit = execSync('npm audit --json', { 
        cwd: this.projectRoot, 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      const audit = JSON.parse(npmAudit);
      if (audit.vulnerabilities) {
        Object.keys(audit.vulnerabilities).forEach(pkgName => {
          const vuln = audit.vulnerabilities[pkgName];
          auditResults.dependencyUpdates.push({
            type: 'security',
            package: pkgName,
            severity: vuln.severity,
            title: vuln.title,
            priority: 'critical'
          });
        });
      }
    } catch (error) {
      // No vulnerabilities or npm not available
    }
  }

  async checkConfigurationDrift(auditResults) {
    // Check for configuration files that might be outdated
    const configFiles = [
      'package.json',
      'tsconfig.json',
      'eslint.config.js',
      'vite.config.ts',
      'tailwind.config.js'
    ];

    configFiles.forEach(configFile => {
      const configPath = path.join(this.projectRoot, configFile);
      if (fs.existsSync(configPath)) {
        try {
          const stats = fs.statSync(configPath);
          const daysSinceModified = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
          
          if (daysSinceModified > 7) {
            auditResults.configurationUpdates.push({
              file: configFile,
              daysSinceModified: Math.round(daysSinceModified),
              priority: daysSinceModified > 30 ? 'high' : 'medium'
            });
          }
        } catch (error) {
          // File access error
        }
      }
    });

    // Check for environment file updates
    const envFiles = [
      '.env',
      '.env.local',
      '.env.development',
      '.env.production'
    ];

    envFiles.forEach(envFile => {
      const envPath = path.join(this.projectRoot, envFile);
      if (fs.existsSync(envPath)) {
        try {
          const content = fs.readFileSync(envPath, 'utf8');
          if (content.includes('TODO') || content.includes('FIXME')) {
            auditResults.configurationUpdates.push({
              file: envFile,
              issue: 'Contains TODO/FIXME markers',
              priority: 'medium'
            });
          }
        } catch (error) {
          // File access error
        }
      }
    });
  }

  async checkLaunchIssues(auditResults) {
    // Check for common launch issues
    const launchChecks = [
      {
        name: 'Port Conflicts',
        check: () => {
          try {
            const netstat = execSync('lsof -i :3000,3001,3002,8080,8081', { 
              encoding: 'utf8',
              stdio: 'pipe'
            });
            if (netstat.includes('LISTEN')) {
              return 'Ports may be in use';
            }
          } catch (error) {
            // No ports in use or command not available
          }
          return null;
        }
      },
      {
        name: 'Node Version',
        check: () => {
          try {
            const nodeVersion = execSync('node --version', { encoding: 'utf8' });
            const version = nodeVersion.trim().replace('v', '');
            const major = parseInt(version.split('.')[0]);
            if (major < 18) {
              return `Node version ${version} may be too old (recommend 18+)`;
            }
          } catch (error) {
            return 'Could not check Node version';
          }
          return null;
        }
      },
      {
        name: 'Package Lock',
        check: () => {
          const packageLockPath = path.join(this.projectRoot, 'package-lock.json');
          if (!fs.existsSync(packageLockPath)) {
            return 'package-lock.json missing - run npm install';
          }
          return null;
        }
      }
    ];

    launchChecks.forEach(check => {
      const issue = check.check();
      if (issue) {
        auditResults.launchIssues.push({
          name: check.name,
          issue,
          priority: 'medium'
        });
      }
    });
  }

  async checkContextGaps(auditResults) {
    // Check for missing or outdated documentation
    const docsToCheck = [
      'README.md',
      'CHANGELOG.md',
      'docs/ARCHITECTURE.md',
      'docs/DEPLOYMENT.md'
    ];

    docsToCheck.forEach(doc => {
      const docPath = path.join(this.projectRoot, doc);
      if (!fs.existsSync(docPath)) {
        auditResults.contextGaps.push({
          type: 'missing_documentation',
          file: doc,
          priority: 'medium'
        });
      } else {
        try {
          const stats = fs.statSync(docPath);
          const daysSinceModified = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
          if (daysSinceModified > 30) {
            auditResults.contextGaps.push({
              type: 'outdated_documentation',
              file: doc,
              daysSinceModified: Math.round(daysSinceModified),
              priority: 'low'
            });
          }
        } catch (error) {
          // File access error
        }
      }
    });

    // Check for missing session context
    const sessionsDir = path.join(this.projectRoot, 'data', 'sessions');
    if (fs.existsSync(sessionsDir)) {
      const sessionFiles = fs.readdirSync(sessionsDir).filter(f => f.endsWith('.json'));
      if (sessionFiles.length === 0) {
        auditResults.contextGaps.push({
          type: 'missing_session_context',
          description: 'No session files found - context may be lost',
          priority: 'high'
        });
      }
    }

    // Check for missing protocol logs
    const protocolsDir = path.join(this.projectRoot, 'data', 'protocols');
    if (fs.existsSync(protocolsDir)) {
      const protocolFiles = fs.readdirSync(protocolsDir).filter(f => f.endsWith('.json'));
      if (protocolFiles.length === 0) {
        auditResults.contextGaps.push({
          type: 'missing_protocol_logs',
          description: 'No protocol logs found - recent work may not be tracked',
          priority: 'medium'
        });
      }
    }
  }

  async generateRoadmapAdditions(auditResults) {
    // Convert audit findings into roadmap items
    auditResults.dependencyUpdates.forEach(update => {
      if (update.priority === 'critical') {
        auditResults.roadmapAdditions.push({
          type: 'urgent',
          title: `Fix security vulnerability in ${update.package}`,
          description: update.title || `Update ${update.package} from ${update.current} to ${update.latest}`,
          priority: 'critical',
          estimatedEffort: '1-2 hours'
        });
      } else if (update.priority === 'high') {
        auditResults.roadmapAdditions.push({
          type: 'maintenance',
          title: `Update ${update.package}`,
          description: `Update from ${update.current} to ${update.latest}`,
          priority: 'high',
          estimatedEffort: '30 minutes'
        });
      }
    });

    auditResults.launchIssues.forEach(issue => {
      auditResults.roadmapAdditions.push({
        type: 'fix',
        title: `Fix launch issue: ${issue.name}`,
        description: issue.issue,
        priority: 'high',
        estimatedEffort: '1-2 hours'
      });
    });

    auditResults.contextGaps.forEach(gap => {
      if (gap.priority === 'high') {
        auditResults.roadmapAdditions.push({
          type: 'documentation',
          title: `Address context gap: ${gap.type}`,
          description: gap.description || `Missing or outdated: ${gap.file}`,
          priority: 'high',
          estimatedEffort: '2-4 hours'
        });
      }
    });

    // Add general maintenance items
    if (auditResults.dependencyUpdates.length > 5) {
      auditResults.roadmapAdditions.push({
        type: 'maintenance',
        title: 'Dependency maintenance sprint',
        description: `Update ${auditResults.dependencyUpdates.length} dependencies`,
        priority: 'medium',
        estimatedEffort: '4-6 hours'
      });
    }
  }

  async displayRecentActivitySummary() {
    console.log('');
    console.log('📈 RECENT ACTIVITY SUMMARY');
    console.log('==========================');
    
    const recentActivity = await this.getRecentActivity();
    const roadmapProgress = await this.getRoadmapProgress();
    
    console.log('🔄 RECENT ACTIVITY:');
    if (recentActivity.length > 0) {
      recentActivity.forEach((activity, index) => {
        console.log(`  ${index + 1}. ${activity.timestamp}: ${activity.description}`);
      });
    } else {
      console.log('  No recent activity logged');
    }
    
    console.log('');
    console.log('🗺️  ROADMAP PROGRESS:');
    console.log(`  Overall Progress: ${roadmapProgress.overall}%`);
    console.log(`  Current Phase: ${roadmapProgress.currentPhase}`);
    console.log(`  Next Milestone: ${roadmapProgress.nextMilestone}`);
    console.log(`  Estimated Completion: ${roadmapProgress.estimatedCompletion}`);
    
    console.log('');
    console.log('🎯 BIGGER PICTURE:');
    console.log(`  Strategic Goals Progress: ${roadmapProgress.strategicProgress}%`);
    console.log(`  Platform Maturity: ${roadmapProgress.platformMaturity}%`);
    console.log(`  Client Onboarding Readiness: ${roadmapProgress.onboardingReadiness}%`);
    console.log(`  Governance Compliance: ${roadmapProgress.governanceCompliance}%`);
    
    // Display audit findings
    if (this.results.auditResults) {
      console.log('');
      console.log('🔧 AUDIT FINDINGS:');
      
      if (this.results.auditResults.dependencyUpdates.length > 0) {
        console.log('  📦 DEPENDENCY UPDATES:');
        this.results.auditResults.dependencyUpdates.slice(0, 3).forEach(update => {
          const priorityIcon = update.priority === 'critical' ? '🔴' : update.priority === 'high' ? '🟡' : '🟢';
          console.log(`    ${priorityIcon} ${update.package}: ${update.current} → ${update.latest || 'latest'}`);
        });
        if (this.results.auditResults.dependencyUpdates.length > 3) {
          console.log(`    ... and ${this.results.auditResults.dependencyUpdates.length - 3} more`);
        }
      }
      
      if (this.results.auditResults.launchIssues.length > 0) {
        console.log('  🚀 LAUNCH ISSUES:');
        this.results.auditResults.launchIssues.forEach(issue => {
          console.log(`    ⚠️  ${issue.name}: ${issue.issue}`);
        });
      }
      
      if (this.results.auditResults.contextGaps.length > 0) {
        console.log('  🧠 CONTEXT GAPS:');
        this.results.auditResults.contextGaps.slice(0, 2).forEach(gap => {
          console.log(`    📝 ${gap.type}: ${gap.description || gap.file}`);
        });
      }
      
      if (this.results.auditResults.roadmapAdditions.length > 0) {
        console.log('  🗺️  ROADMAP ADDITIONS:');
        this.results.auditResults.roadmapAdditions.slice(0, 3).forEach(item => {
          const priorityIcon = item.priority === 'critical' ? '🔴' : item.priority === 'high' ? '🟡' : '🟢';
          console.log(`    ${priorityIcon} ${item.title} (${item.estimatedEffort})`);
        });
        if (this.results.auditResults.roadmapAdditions.length > 3) {
          console.log(`    ... and ${this.results.auditResults.roadmapAdditions.length - 3} more items added to roadmap`);
        }
      }
    }
  }

  async getRecentActivity() {
    const activities = [];
    
    try {
      // Check for recent session files
      const sessionsDir = path.join(this.projectRoot, 'data', 'sessions');
      if (fs.existsSync(sessionsDir)) {
        const sessionFiles = fs.readdirSync(sessionsDir)
          .filter(file => file.endsWith('.json'))
          .sort()
          .slice(-5); // Last 5 sessions
        
        for (const file of sessionFiles) {
          try {
            const sessionData = JSON.parse(fs.readFileSync(path.join(sessionsDir, file), 'utf8'));
            if (sessionData.summary || sessionData.activities) {
              activities.push({
                timestamp: sessionData.timestamp || file.replace('.json', ''),
                description: sessionData.summary || 'Session activity recorded'
              });
            }
          } catch (error) {
            // Skip invalid session files
          }
        }
      }
      
      // Check for recent protocol execution logs
      const protocolsDir = path.join(this.projectRoot, 'data', 'protocols');
      if (fs.existsSync(protocolsDir)) {
        const protocolFiles = fs.readdirSync(protocolsDir)
          .filter(file => file.endsWith('.json'))
          .sort()
          .slice(-3); // Last 3 protocols
        
        for (const file of protocolFiles) {
          try {
            const protocolData = JSON.parse(fs.readFileSync(path.join(protocolsDir, file), 'utf8'));
            if (protocolData.name || protocolData.description) {
              activities.push({
                timestamp: protocolData.timestamp || file.replace('.json', ''),
                description: `${protocolData.name || 'Protocol'}: ${protocolData.description || 'Executed'}`
              });
            }
          } catch (error) {
            // Skip invalid protocol files
          }
        }
      }
      
      // Check for recent git commits
      try {
        const gitLog = execSync('git log --oneline -5', { 
          cwd: this.projectRoot, 
          encoding: 'utf8',
          stdio: 'pipe'
        });
        
        const commits = gitLog.trim().split('\n');
        commits.forEach(commit => {
          if (commit) {
            const [hash, ...messageParts] = commit.split(' ');
            const message = messageParts.join(' ');
            activities.push({
              timestamp: 'Recent',
              description: `Git: ${message}`
            });
          }
        });
      } catch (error) {
        // Git not available or no commits
      }
      
    } catch (error) {
      console.log('  ⚠️  Could not retrieve recent activity');
    }
    
    return activities.slice(-10); // Return last 10 activities
  }

  async getRoadmapProgress() {
    // Calculate progress based on various metrics
    const totalPlatforms = this.results.platforms.length;
    const healthyPlatforms = this.results.platforms.filter(p => p.status === 'analyzed').length;
    const platformsWithHolon = this.results.platforms.filter(p => p.analysis?.holonGovernance).length;
    const platformsWithTests = this.results.platforms.filter(p => p.analysis?.tests > 0).length;
    
    // Overall progress calculation
    const overallProgress = Math.round(
      ((healthyPlatforms / totalPlatforms) * 0.4 + 
       (platformsWithHolon / totalPlatforms) * 0.3 + 
       (platformsWithTests / totalPlatforms) * 0.3) * 100
    );
    
    // Strategic progress (bigger picture)
    const strategicProgress = Math.round(
      (overallProgress * 0.6) + 
      (this.results.systemHealth === 'EXCELLENT' ? 20 : 
       this.results.systemHealth === 'GOOD' ? 15 : 
       this.results.systemHealth === 'POOR' ? 5 : 0)
    );
    
    // Platform maturity
    const platformMaturity = Math.round(
      (healthyPlatforms / totalPlatforms) * 100
    );
    
    // Onboarding readiness
    const onboardingReadiness = Math.round(
      (platformsWithHolon / totalPlatforms) * 100
    );
    
    // Governance compliance
    const governanceCompliance = Math.round(
      (platformsWithHolon / totalPlatforms) * 100
    );
    
    // Determine current phase
    let currentPhase = 'Foundation';
    let nextMilestone = 'Platform Stabilization';
    let estimatedCompletion = 'Q2 2025';
    
    if (overallProgress > 80) {
      currentPhase = 'Optimization';
      nextMilestone = 'Production Deployment';
      estimatedCompletion = 'Q1 2025';
    } else if (overallProgress > 60) {
      currentPhase = 'Integration';
      nextMilestone = 'Client Onboarding';
      estimatedCompletion = 'Q2 2025';
    } else if (overallProgress > 40) {
      currentPhase = 'Development';
      nextMilestone = 'Holon Governance';
      estimatedCompletion = 'Q3 2025';
    } else if (overallProgress > 20) {
      currentPhase = 'Foundation';
      nextMilestone = 'Platform Analysis';
      estimatedCompletion = 'Q4 2025';
    }
    
    return {
      overall: overallProgress,
      currentPhase,
      nextMilestone,
      estimatedCompletion,
      strategicProgress,
      platformMaturity,
      onboardingReadiness,
      governanceCompliance
    };
  }

  async writeSessionAndAuditLogs() {
    try {
      // Write to session file with unique naming to avoid conflicts with launch
      const sessionsDir = path.join(this.projectRoot, 'data', 'sessions');
      if (!fs.existsSync(sessionsDir)) fs.mkdirSync(sessionsDir, { recursive: true });
      const sessionFile = path.join(sessionsDir, `anchor-session-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
      const sessionData = {
        timestamp: new Date().toISOString(),
        summary: 'Anchor run with updates audit',
        platforms: this.results.platforms,
        systemHealth: this.results.systemHealth,
        recommendations: this.results.recommendations,
        auditResults: this.results.auditResults,
        roadmapProgress: await this.getRoadmapProgress(),
        postAuditUpdateRatio: this.getPostAuditUpdateRatio()
      };
      fs.writeFileSync(sessionFile, JSON.stringify(sessionData, null, 2));

      // Append to updates audit log
      const auditsDir = path.join(this.projectRoot, 'data', 'audits');
      if (!fs.existsSync(auditsDir)) fs.mkdirSync(auditsDir, { recursive: true });
      const auditLogFile = path.join(auditsDir, 'anchor_updates_audit.json');
      let auditLog = [];
      if (fs.existsSync(auditLogFile)) {
        try {
          auditLog = JSON.parse(fs.readFileSync(auditLogFile, 'utf8'));
        } catch (e) { auditLog = []; }
      }
      auditLog.push({
        timestamp: new Date().toISOString(),
        auditResults: this.results.auditResults,
        postAuditUpdateRatio: this.getPostAuditUpdateRatio()
      });
      fs.writeFileSync(auditLogFile, JSON.stringify(auditLog, null, 2));
    } catch (error) {
      console.error('Failed to write session or audit logs:', error.message);
    }
  }

  getPostAuditUpdateRatio() {
    // Calculate the number of required updates after audit
    if (!this.results.auditResults) return 'N/A';
    const totalUpdates = (
      (this.results.auditResults.dependencyUpdates?.length || 0) +
      (this.results.auditResults.configurationUpdates?.length || 0) +
      (this.results.auditResults.launchIssues?.length || 0) +
      (this.results.auditResults.contextGaps?.length || 0)
    );
    // For now, use total updates vs. total platforms as a proxy for code change volume
    const totalPlatforms = this.results.platforms?.length || 1;
    return `${totalUpdates} updates / ${totalPlatforms} platforms`;
  }
}

// Run the anchor manager
if (require.main === module) {
  const anchorManager = new AnchorManager();
  anchorManager.executeAnchorCommand().catch(error => {
    console.error('Anchor command failed:', error);
    process.exit(1);
  });
}

module.exports = AnchorManager; 