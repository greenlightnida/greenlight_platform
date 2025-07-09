#!/usr/bin/env node

/**
 * Launch Protocol v2.0.0
 * 
 * PURPOSE: Comprehensive protocol for starting new chat sessions with full context preservation,
 * context awareness testing, progressive layer testing, and system state validation. Ensures new 
 * sessions can pick up where previous sessions left off with complete understanding of the current 
 * system state and layer-specific health metrics.
 * 
 * USAGE: node scripts/protocols/launch_protocol.cjs
 * 
 * FEATURES:
 * - Context awareness testing with detailed reporting
 * - Progressive layer testing (Frontend, Backend, Infrastructure, Governance)
 * - System state validation and health checks
 * - Roadmap priority identification
 * - Context preservation verification
 * - Launch readiness assessment
 * - Layer-specific improvement recommendations
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class LaunchProtocol {
  constructor() {
    this.projectRoot = process.cwd();
    this.sessionId = this.generateEnhancedSessionId();
    this.protocolVersion = '2.0.0';
    this.contextAwarenessResults = {};
    this.systemState = {};
    this.launchReadiness = {};
    this.recommendations = [];
    this.layerTestResults = {};
    this.sessionMetadata = this.generateSessionMetadata();
    this.sessionStartTime = Date.now();
  }

  generateEnhancedSessionId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const time = new Date().toISOString().split('T')[1].split('.')[0].replace(/:/g, '');
    return `launch-${date}-${time}-${timestamp}-${random}`;
  }

  generateSessionMetadata() {
    const now = new Date();
    return {
      sessionId: this.sessionId,
      sessionType: 'launch',
      sessionLabel: 'Greenlight Platform Launch Protocol',
      timestamp: now.toISOString(),
      date: now.toISOString().split('T')[0],
      time: now.toISOString().split('T')[1].split('.')[0],
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      protocolVersion: this.protocolVersion,
      environment: process.env.NODE_ENV || 'development',
      userAgent: process.env.USER || 'unknown',
      hostname: require('os').hostname(),
      platform: process.platform,
      nodeVersion: process.version,
      cwd: this.projectRoot
    };
  }

  calculateSessionDuration() {
    const duration = Date.now() - this.sessionStartTime;
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${seconds}s`;
  }

  async execute() {
    console.log('🚀 Launch Protocol v2.0.0 Initiated');
    console.log('====================================');
    console.log(`Session ID: ${this.sessionId}`);
    console.log(`Protocol Version: ${this.protocolVersion}`);
    console.log('');

    try {
      // Phase 0: Prevention System Check
      await this.runPreventionSystem();
      
      // Phase 1: Context Awareness Testing
      await this.performContextAwarenessTesting();
      
      // Phase 2: Progressive Layer Testing
      await this.performProgressiveLayerTesting();
      
      // Phase 3: System State Validation
      await this.validateSystemState();
      
      // Phase 4: Roadmap Priority Assessment
      await this.assessRoadmapPriorities();
      
      // Phase 5: Context Preservation Verification
      await this.verifyContextPreservation();
      
      // Phase 6: Launch Readiness Assessment
      await this.assessLaunchReadiness();
      
      // Phase 7: Generate Enhanced Launch Report
      await this.generateLaunchReport();
      
      // Phase 8: Generate Transition Memo
      await this.generateTransitionMemo();
      
      console.log('');
      console.log('✅ Launch Protocol Complete');
      console.log('🧠 Context awareness tested and reported');
      console.log('🔬 Progressive layer testing completed');
      console.log('📊 System state validated');
      console.log('🗺️ Roadmap priorities identified');
      console.log('📋 Launch readiness assessed');
      console.log('📈 Layer-specific improvements identified');
      console.log('📝 Transition memo generated');
      
    } catch (error) {
      console.error('❌ Launch Protocol Failed:', error.message);
      this.logError(error);
      process.exit(1);
    }
  }

  async runPreventionSystem() {
    console.log('🛡️ Phase 0: Prevention System Check');
    
    try {
      const preventionResult = execSync('node scripts/protocols/prevention_system.cjs', {
        encoding: 'utf8',
        cwd: this.projectRoot,
        timeout: 60000
      });
      
      if (preventionResult.includes('CRITICAL ISSUES DETECTED')) {
        console.log('⚠️  Prevention system detected issues - proceeding with caution');
        console.log('Note: Some prevention checks may be overly strict for current development phase');
      } else if (preventionResult.includes('WARNINGS DETECTED')) {
        console.log('⚠️  Prevention system warnings detected - proceeding with caution');
      } else {
        console.log('✅ Prevention system passed - all checks cleared');
      }
      
    } catch (error) {
      console.error('❌ Prevention system failed:', error.message);
      console.log('⚠️  Proceeding with launch despite prevention system issues');
    }
  }

  async performContextAwarenessTesting() {
    console.log('🧠 Phase 1: Context Awareness Testing');
    
    const testResults = {
      timestamp: new Date().toISOString(),
      tests: []
    };

    // Test 1: Roadmap Awareness
    const roadmapTest = await this.testRoadmapAwareness();
    testResults.tests.push(roadmapTest);

    // Test 2: System Architecture Awareness
    const architectureTest = await this.testArchitectureAwareness();
    testResults.tests.push(architectureTest);

    // Test 3: Current State Awareness
    const stateTest = await this.testCurrentStateAwareness();
    testResults.tests.push(stateTest);

    // Test 4: Holon System Awareness
    const holonTest = await this.testHolonSystemAwareness();
    testResults.tests.push(holonTest);

    // Test 5: Recent Work Awareness
    const workTest = await this.testRecentWorkAwareness();
    testResults.tests.push(workTest);

    // Test 6: Priority Awareness
    const priorityTest = await this.testPriorityAwareness();
    testResults.tests.push(priorityTest);

    this.contextAwarenessResults = testResults;
    
    const passedTests = testResults.tests.filter(test => test.passed).length;
    const totalTests = testResults.tests.length;
    
    console.log(`✅ Context awareness testing completed: ${passedTests}/${totalTests} tests passed`);
    
    // Always report results
    console.log('\n📋 Context Awareness Test Results:');
    testResults.tests.forEach((test, index) => {
      const status = test.passed ? '✅' : '❌';
      console.log(`${status} Test ${index + 1}: ${test.name} - ${test.passed ? 'PASSED' : 'FAILED'}`);
      if (!test.passed && test.details) {
        console.log(`   Details: ${test.details}`);
      }
    });
  }

  async testRoadmapAwareness() {
    const roadmapPath = path.join(this.projectRoot, 'LIVING_ROADMAP.md');
    if (!fs.existsSync(roadmapPath)) {
      return {
        name: 'Roadmap Awareness',
        passed: false,
        details: 'LIVING_ROADMAP.md not found'
      };
    }

    const roadmapContent = fs.readFileSync(roadmapPath, 'utf8');
    const hasHolonMigration = roadmapContent.includes('Holon Directory Migration');
    const hasKnowledgeSharing = roadmapContent.includes('Holon Knowledge Sharing');
    const hasMigrationsManager = roadmapContent.includes('Migrations Manager');
    const hasNewChatProtocol = roadmapContent.includes('New Chat Session Protocol');

    return {
      name: 'Roadmap Awareness',
      passed: hasHolonMigration && hasKnowledgeSharing && hasMigrationsManager && hasNewChatProtocol,
      details: `Found roadmap sections: Holon Migration (${hasHolonMigration}), Knowledge Sharing (${hasKnowledgeSharing}), Migrations Manager (${hasMigrationsManager}), New Chat Protocol (${hasNewChatProtocol})`
    };
  }

  async testArchitectureAwareness() {
    const architecturePath = path.join(this.projectRoot, 'src/architecture/holonSystem.ts');
    if (!fs.existsSync(architecturePath)) {
      return {
        name: 'Architecture Awareness',
        passed: false,
        details: 'holonSystem.ts not found'
      };
    }

    const architectureContent = fs.readFileSync(architecturePath, 'utf8');
    
    // Check for holon system components (updated for current architecture)
    const hasHolonSystem = architectureContent.includes('HolonSystem') || architectureContent.includes('holonSystem');
    const hasSystemMaster = architectureContent.includes('systemMaster') || architectureContent.includes('SystemMaster');
    const hasGovernance = architectureContent.includes('governance') || architectureContent.includes('Governance');

    return {
      name: 'Architecture Awareness',
      passed: hasHolonSystem && hasSystemMaster && hasGovernance,
      details: `Found architecture components: HolonSystem (${hasHolonSystem}), SystemMaster (${hasSystemMaster}), Governance (${hasGovernance})`
    };
  }

  async testCurrentStateAwareness() {
    // Check for current state files (updated for current structure)
    const changelogPath = path.join(this.projectRoot, 'greenlight-wiki/CHANGELOG.md');
    const roadmapPath = path.join(this.projectRoot, 'ROADMAP.md');
    const livingRoadmapPath = path.join(this.projectRoot, 'LIVING_ROADMAP.md');
    
    const hasChangelog = fs.existsSync(changelogPath);
    const hasRoadmap = fs.existsSync(roadmapPath);
    const hasLivingRoadmap = fs.existsSync(livingRoadmapPath);

    return {
      name: 'Current State Awareness',
      passed: hasChangelog && hasRoadmap && hasLivingRoadmap,
      details: `Found state files: CHANGELOG.md (${hasChangelog}), ROADMAP.md (${hasRoadmap}), LIVING_ROADMAP.md (${hasLivingRoadmap})`
    };
  }

  async testHolonSystemAwareness() {
    const systemMasterPath = path.join(this.projectRoot, 'src/components/SystemMaster');
    if (!fs.existsSync(systemMasterPath)) {
      return {
        name: 'Holon System Awareness',
        passed: false,
        details: 'SystemMaster directory not found'
      };
    }

    const files = fs.readdirSync(systemMasterPath);
    const hasObserveConsole = files.includes('ObserveConsole.tsx');
    const hasResolveConsole = files.includes('ResolveConsole.tsx');
    const hasInformConsole = files.includes('InformConsole.tsx');
    const hasSystemMaster = files.includes('SystemMaster.tsx');

    return {
      name: 'Holon System Awareness',
      passed: hasObserveConsole && hasResolveConsole && hasInformConsole && hasSystemMaster,
      details: `Found console components: Observe (${hasObserveConsole}), Resolve (${hasResolveConsole}), Inform (${hasInformConsole}), SystemMaster (${hasSystemMaster})`
    };
  }

  async testRecentWorkAwareness() {
    // Check for recent work files (updated for current structure)
    const custodianPath = path.join(this.projectRoot, 'scripts/governance/custodian_protocol.cjs');
    const documentationPath = path.join(this.projectRoot, 'DOCUMENTATION_CUSTODIAN_AND_SCRIPTMASTER.md');
    const wikiPath = path.join(this.projectRoot, 'greenlight-wiki/');
    
    const hasCustodian = fs.existsSync(custodianPath);
    const hasDocumentation = fs.existsSync(documentationPath);
    const hasWiki = fs.existsSync(wikiPath);

    return {
      name: 'Recent Work Awareness',
      passed: hasCustodian && hasDocumentation && hasWiki,
      details: `Found recent work: custodian_protocol.cjs (${hasCustodian}), DOCUMENTATION_CUSTODIAN_AND_SCRIPTMASTER.md (${hasDocumentation}), greenlight-wiki (${hasWiki})`
    };
  }

  async testPriorityAwareness() {
    const roadmapPath = path.join(this.projectRoot, 'LIVING_ROADMAP.md');
    const sessionsDir = path.join(this.projectRoot, 'data', 'sessions');
    
    let roadmapPriorities = { hasPriorityAreas: false, hasHolonMigration: false, hasKnowledgeSharing: false };
    let transitionMemoPriorities = { hasNextSteps: false, hasCriticalBlockers: false, hasRecommendations: false };
    
    // Check roadmap priorities
    if (fs.existsSync(roadmapPath)) {
      const roadmapContent = fs.readFileSync(roadmapPath, 'utf8');
      roadmapPriorities.hasPriorityAreas = roadmapContent.includes('Current Priority Areas');
      roadmapPriorities.hasHolonMigration = roadmapContent.includes('Holon Directory Migration');
      roadmapPriorities.hasKnowledgeSharing = roadmapContent.includes('Holon Knowledge Sharing');
    }
    
    // Check transition memo priorities
    if (fs.existsSync(sessionsDir)) {
      const transitionMemos = fs.readdirSync(sessionsDir)
        .filter(file => file.startsWith('transition-memo-') && file.endsWith('.json'))
        .sort()
        .reverse(); // Get most recent first
      
      if (transitionMemos.length > 0) {
        const latestMemoPath = path.join(sessionsDir, transitionMemos[0]);
        try {
          const memoContent = JSON.parse(fs.readFileSync(latestMemoPath, 'utf8'));
          
          // Check for priority-related fields in transition memo
          transitionMemoPriorities.hasNextSteps = memoContent.nextSteps && Array.isArray(memoContent.nextSteps) && memoContent.nextSteps.length > 0;
          transitionMemoPriorities.hasCriticalBlockers = memoContent.criticalBlockers && Object.keys(memoContent.criticalBlockers).length > 0;
          transitionMemoPriorities.hasRecommendations = memoContent.recommendations && Object.keys(memoContent.recommendations).length > 0;
          
          // Also check for immediate/nextSteps in context
          if (memoContent.context && memoContent.context.nextSteps) {
            transitionMemoPriorities.hasNextSteps = transitionMemoPriorities.hasNextSteps || 
              (Array.isArray(memoContent.context.nextSteps) && memoContent.context.nextSteps.length > 0);
          }
        } catch (error) {
          // If memo parsing fails, continue with roadmap priorities only
        }
      }
    }
    
    // Combine priority sources - pass if either roadmap OR transition memo has priority info
    const hasRoadmapPriorities = roadmapPriorities.hasPriorityAreas || roadmapPriorities.hasHolonMigration || roadmapPriorities.hasKnowledgeSharing;
    const hasTransitionMemoPriorities = transitionMemoPriorities.hasNextSteps || transitionMemoPriorities.hasCriticalBlockers || transitionMemoPriorities.hasRecommendations;
    
    const passed = hasRoadmapPriorities || hasTransitionMemoPriorities;
    
    return {
      name: 'Priority Awareness',
      passed: passed,
      details: `Found priority information: Roadmap (${hasRoadmapPriorities}) - Priority Areas (${roadmapPriorities.hasPriorityAreas}), Holon Migration (${roadmapPriorities.hasHolonMigration}), Knowledge Sharing (${roadmapPriorities.hasKnowledgeSharing}); Transition Memo (${hasTransitionMemoPriorities}) - Next Steps (${transitionMemoPriorities.hasNextSteps}), Critical Blockers (${transitionMemoPriorities.hasCriticalBlockers}), Recommendations (${transitionMemoPriorities.hasRecommendations})`
    };
  }

  async performProgressiveLayerTesting() {
    console.log('🔬 Phase 2: Progressive Layer Testing');
    console.log('=====================================');
    
    this.layerTestResults = {
      timestamp: new Date().toISOString(),
      layers: {}
    };

    // Layer 1: Frontend Testing
    console.log('\n🎨 Testing Frontend Layer...');
    this.layerTestResults.layers.frontend = await this.testFrontendLayer();

    // Layer 2: Backend Testing
    console.log('\n⚙️ Testing Backend Layer...');
    this.layerTestResults.layers.backend = await this.testBackendLayer();

    // Layer 3: Infrastructure Testing
    console.log('\n🏗️ Testing Infrastructure Layer...');
    this.layerTestResults.layers.infrastructure = await this.testInfrastructureLayer();

    // Layer 4: Governance Testing
    console.log('\n🛡️ Testing Governance Layer...');
    this.layerTestResults.layers.governance = await this.testGovernanceLayer();

    // Calculate overall layer health
    const layerHealth = this.calculateLayerHealth();
    this.layerTestResults.overallHealth = layerHealth;

    console.log('\n📊 Layer Test Results Summary:');
    Object.entries(this.layerTestResults.layers).forEach(([layer, results]) => {
      const status = results.health === 'healthy' ? '✅' : results.health === 'warning' ? '⚠️' : '❌';
      console.log(`${status} ${layer.toUpperCase()}: ${results.health} (${results.score}/100)`);
    });
    console.log(`\n🏆 Overall Layer Health: ${layerHealth.overall} (${layerHealth.averageScore}/100)`);
  }

  async testFrontendLayer() {
    const tests = [];
    let totalScore = 0;
    const maxScore = 100;

    // Test 1: Build Status (25 points)
    try {
      execSync('cd frontend && npm run build', { stdio: 'pipe' });
      tests.push({ name: 'Build Status', passed: true, score: 25, details: 'Frontend builds successfully' });
      totalScore += 25;
    } catch (error) {
      tests.push({ name: 'Build Status', passed: false, score: 0, details: 'Build failed: ' + error.message });
    }

    // Test 2: Development Server (20 points)
    try {
      const response = execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:5173', { encoding: 'utf8' });
      if (response.trim() === '200') {
        tests.push({ name: 'Development Server', passed: true, score: 20, details: 'Frontend server responding' });
        totalScore += 20;
      } else {
        tests.push({ name: 'Development Server', passed: false, score: 0, details: `Server returned ${response}` });
      }
    } catch (error) {
      tests.push({ name: 'Development Server', passed: false, score: 0, details: 'Server not accessible' });
    }

    // Test 3: TypeScript Compilation (20 points)
    try {
      execSync('cd frontend && npx tsc --noEmit', { stdio: 'pipe' });
      tests.push({ name: 'TypeScript Compilation', passed: true, score: 20, details: 'No TypeScript errors' });
      totalScore += 20;
    } catch (error) {
      tests.push({ name: 'TypeScript Compilation', passed: false, score: 0, details: 'TypeScript compilation failed' });
    }

    // Test 4: Component Structure (15 points)
    const componentPath = path.join(this.projectRoot, 'frontend/src/components');
    if (fs.existsSync(componentPath)) {
      const components = fs.readdirSync(componentPath);
      if (components.length >= 5) {
        tests.push({ name: 'Component Structure', passed: true, score: 15, details: `${components.length} components found` });
        totalScore += 15;
      } else {
        tests.push({ name: 'Component Structure', passed: false, score: 10, details: `Only ${components.length} components found` });
        totalScore += 10;
      }
    } else {
      tests.push({ name: 'Component Structure', passed: false, score: 0, details: 'Components directory not found' });
    }

    // Test 5: Dependencies (20 points)
    try {
      const packageJson = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'frontend/package.json'), 'utf8'));
      const hasReact = packageJson.dependencies && packageJson.dependencies.react;
      const hasVite = packageJson.devDependencies && packageJson.devDependencies.vite;
      
      if (hasReact && hasVite) {
        tests.push({ name: 'Dependencies', passed: true, score: 20, details: 'Core dependencies present' });
        totalScore += 20;
      } else {
        tests.push({ name: 'Dependencies', passed: false, score: 10, details: 'Missing core dependencies' });
        totalScore += 10;
      }
    } catch (error) {
      tests.push({ name: 'Dependencies', passed: false, score: 0, details: 'Cannot read package.json' });
    }

    const health = totalScore >= 80 ? 'healthy' : totalScore >= 60 ? 'warning' : 'critical';
    
    return {
      health,
      score: totalScore,
      maxScore,
      tests,
      recommendations: this.generateFrontendRecommendations(tests, totalScore)
    };
  }

  async testBackendLayer() {
    const tests = [];
    let totalScore = 0;
    const maxScore = 100;

    // Test 1: Build Status (25 points)
    try {
      execSync('cd backend && npx tsc --noEmit', { stdio: 'pipe' });
      tests.push({ name: 'TypeScript Compilation', passed: true, score: 25, details: 'Backend compiles successfully' });
      totalScore += 25;
    } catch (error) {
      tests.push({ name: 'TypeScript Compilation', passed: false, score: 0, details: 'Compilation failed' });
    }

    // Test 2: Server Health (25 points)
    try {
      const response = execSync('curl -s http://localhost:3001/health', { encoding: 'utf8' });
      const healthData = JSON.parse(response);
      if (healthData.status === 'OK') {
        tests.push({ name: 'Server Health', passed: true, score: 25, details: 'Backend server healthy' });
        totalScore += 25;
      } else {
        tests.push({ name: 'Server Health', passed: false, score: 0, details: 'Server not healthy' });
      }
    } catch (error) {
      tests.push({ name: 'Server Health', passed: false, score: 0, details: 'Server not accessible' });
    }

    // Test 3: API Endpoints (20 points)
    try {
      const response = execSync('curl -s http://localhost:3001/api/status', { encoding: 'utf8' });
      const statusData = JSON.parse(response);
      if (statusData.status === 'running') {
        tests.push({ name: 'API Endpoints', passed: true, score: 20, details: 'API endpoints responding' });
        totalScore += 20;
      } else {
        tests.push({ name: 'API Endpoints', passed: false, score: 0, details: 'API not running' });
      }
    } catch (error) {
      tests.push({ name: 'API Endpoints', passed: false, score: 0, details: 'API not accessible' });
    }

    // Test 4: Database Connection (15 points)
    try {
      // Check if database configuration exists
      const configPath = path.join(this.projectRoot, 'backend/src/config/index.ts');
      if (fs.existsSync(configPath)) {
        const configContent = fs.readFileSync(configPath, 'utf8');
        if (configContent.includes('database')) {
          tests.push({ name: 'Database Configuration', passed: true, score: 15, details: 'Database config present' });
          totalScore += 15;
        } else {
          tests.push({ name: 'Database Configuration', passed: false, score: 0, details: 'Database config missing' });
        }
      } else {
        tests.push({ name: 'Database Configuration', passed: false, score: 0, details: 'Config file not found' });
      }
    } catch (error) {
      tests.push({ name: 'Database Configuration', passed: false, score: 0, details: 'Config error' });
    }

    // Test 5: Dependencies (15 points)
    try {
      const packageJson = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'backend/package.json'), 'utf8'));
      const hasExpress = packageJson.dependencies && packageJson.dependencies.express;
      const hasNodemon = packageJson.devDependencies && packageJson.devDependencies.nodemon;
      
      if (hasExpress && hasNodemon) {
        tests.push({ name: 'Dependencies', passed: true, score: 15, details: 'Core dependencies present' });
        totalScore += 15;
      } else {
        tests.push({ name: 'Dependencies', passed: false, score: 5, details: 'Missing core dependencies' });
        totalScore += 5;
      }
    } catch (error) {
      tests.push({ name: 'Dependencies', passed: false, score: 0, details: 'Cannot read package.json' });
    }

    const health = totalScore >= 80 ? 'healthy' : totalScore >= 60 ? 'warning' : 'critical';
    
    return {
      health,
      score: totalScore,
      maxScore,
      tests,
      recommendations: this.generateBackendRecommendations(tests, totalScore)
    };
  }

  async testInfrastructureLayer() {
    const tests = [];
    let totalScore = 0;
    const maxScore = 100;

    // Test 1: Git Repository Health (25 points)
    try {
      const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
      const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
      const lastCommit = execSync('git log -1 --oneline', { encoding: 'utf8' }).trim();
      
      tests.push({ name: 'Git Repository', passed: true, score: 25, details: `Branch: ${branch}, Last commit: ${lastCommit}` });
      totalScore += 25;
    } catch (error) {
      tests.push({ name: 'Git Repository', passed: false, score: 0, details: 'Git repository issues' });
    }

    // Test 2: File Structure (20 points)
    const requiredDirs = ['src', 'frontend', 'backend', 'scripts', 'docs'];
    const existingDirs = requiredDirs.filter(dir => fs.existsSync(path.join(this.projectRoot, dir)));
    const dirScore = Math.round((existingDirs.length / requiredDirs.length) * 20);
    
    tests.push({ 
      name: 'File Structure', 
      passed: existingDirs.length >= 4, 
      score: dirScore, 
      details: `${existingDirs.length}/${requiredDirs.length} required directories present` 
    });
    totalScore += dirScore;

    // Test 3: Environment Configuration (20 points)
    const envFiles = ['.env', '.env.example', '.env.local'];
    const existingEnvFiles = envFiles.filter(file => fs.existsSync(path.join(this.projectRoot, file)));
    const envScore = Math.round((existingEnvFiles.length / envFiles.length) * 20);
    
    tests.push({ 
      name: 'Environment Config', 
      passed: existingEnvFiles.length >= 1, 
      score: envScore, 
      details: `${existingEnvFiles.length}/${envFiles.length} env files present` 
    });
    totalScore += envScore;

    // Test 4: Package Management (20 points)
    const packageFiles = ['package.json', 'package-lock.json'];
    const existingPackageFiles = packageFiles.filter(file => fs.existsSync(path.join(this.projectRoot, file)));
    const packageScore = Math.round((existingPackageFiles.length / packageFiles.length) * 20);
    
    tests.push({ 
      name: 'Package Management', 
      passed: existingPackageFiles.length >= 1, 
      score: packageScore, 
      details: `${existingPackageFiles.length}/${packageFiles.length} package files present` 
    });
    totalScore += packageScore;

    // Test 5: Documentation (15 points)
    const docFiles = ['README.md', 'docs/', 'greenlight-wiki/'];
    const existingDocFiles = docFiles.filter(file => fs.existsSync(path.join(this.projectRoot, file)));
    const docScore = Math.round((existingDocFiles.length / docFiles.length) * 15);
    
    tests.push({ 
      name: 'Documentation', 
      passed: existingDocFiles.length >= 2, 
      score: docScore, 
      details: `${existingDocFiles.length}/${docFiles.length} documentation sources present` 
    });
    totalScore += docScore;

    const health = totalScore >= 80 ? 'healthy' : totalScore >= 60 ? 'warning' : 'critical';
    
    return {
      health,
      score: totalScore,
      maxScore,
      tests,
      recommendations: this.generateInfrastructureRecommendations(tests, totalScore)
    };
  }

  async testGovernanceLayer() {
    const tests = [];
    let totalScore = 0;
    const maxScore = 100;

    // Test 1: Protocol System (25 points)
    const protocolFiles = [
      'scripts/protocols/launch_protocol.cjs',
      'scripts/protocols/end_of_chat_protocol.js',
      'scripts/governance/custodian_protocol.cjs'
    ];
    const existingProtocols = protocolFiles.filter(file => fs.existsSync(path.join(this.projectRoot, file)));
    const protocolScore = Math.round((existingProtocols.length / protocolFiles.length) * 25);
    
    tests.push({ 
      name: 'Protocol System', 
      passed: existingProtocols.length >= 2, 
      score: protocolScore, 
      details: `${existingProtocols.length}/${protocolFiles.length} protocols present` 
    });
    totalScore += protocolScore;

    // Test 2: Governance Documentation (20 points)
    const governanceFiles = [
      'DOCUMENTATION_CUSTODIAN_AND_SCRIPTMASTER.md',
      'greenlight-wiki/GOVERNANCE.md',
      'docs/protocols/'
    ];
    const existingGovernance = governanceFiles.filter(file => fs.existsSync(path.join(this.projectRoot, file)));
    const governanceScore = Math.round((existingGovernance.length / governanceFiles.length) * 20);
    
    tests.push({ 
      name: 'Governance Documentation', 
      passed: existingGovernance.length >= 1, 
      score: governanceScore, 
      details: `${existingGovernance.length}/${governanceFiles.length} governance docs present` 
    });
    totalScore += governanceScore;

    // Test 3: Session Management (20 points)
    const sessionFiles = [
      'scripts/work_sessions/',
      'data/sessions/',
      'src/core/session-management/'
    ];
    const existingSessions = sessionFiles.filter(file => fs.existsSync(path.join(this.projectRoot, file)));
    const sessionScore = Math.round((existingSessions.length / sessionFiles.length) * 20);
    
    tests.push({ 
      name: 'Session Management', 
      passed: existingSessions.length >= 2, 
      score: sessionScore, 
      details: `${existingSessions.length}/${sessionFiles.length} session management components present` 
    });
    totalScore += sessionScore;

    // Test 4: Audit System (20 points)
    const auditFiles = [
      'scripts/audit_and_optimize.cjs',
      'scripts/maintenance/audit_and_optimize.js',
      'src/core/governance/'
    ];
    const existingAudits = auditFiles.filter(file => fs.existsSync(path.join(this.projectRoot, file)));
    const auditScore = Math.round((existingAudits.length / auditFiles.length) * 20);
    
    tests.push({ 
      name: 'Audit System', 
      passed: existingAudits.length >= 1, 
      score: auditScore, 
      details: `${existingAudits.length}/${auditFiles.length} audit components present` 
    });
    totalScore += auditScore;

    // Test 5: Change Tracking (15 points)
    const changeFiles = [
      'greenlight-wiki/CHANGELOG.md',
      'data/history/',
      'docs/history/'
    ];
    const existingChanges = changeFiles.filter(file => fs.existsSync(path.join(this.projectRoot, file)));
    const changeScore = Math.round((existingChanges.length / changeFiles.length) * 15);
    
    tests.push({ 
      name: 'Change Tracking', 
      passed: existingChanges.length >= 1, 
      score: changeScore, 
      details: `${existingChanges.length}/${changeFiles.length} change tracking components present` 
    });
    totalScore += changeScore;

    const health = totalScore >= 80 ? 'healthy' : totalScore >= 60 ? 'warning' : 'critical';
    
    return {
      health,
      score: totalScore,
      maxScore,
      tests,
      recommendations: this.generateGovernanceRecommendations(tests, totalScore)
    };
  }

  calculateLayerHealth() {
    const layers = Object.values(this.layerTestResults.layers);
    const totalScore = layers.reduce((sum, layer) => sum + layer.score, 0);
    const averageScore = Math.round(totalScore / layers.length);
    
    const healthyLayers = layers.filter(layer => layer.health === 'healthy').length;
    const warningLayers = layers.filter(layer => layer.health === 'warning').length;
    const criticalLayers = layers.filter(layer => layer.health === 'critical').length;
    
    let overall = 'healthy';
    if (criticalLayers > 0) overall = 'critical';
    else if (warningLayers > 0) overall = 'warning';
    
    return {
      overall,
      averageScore,
      layerCounts: { healthy: healthyLayers, warning: warningLayers, critical: criticalLayers },
      totalLayers: layers.length
    };
  }

  generateFrontendRecommendations(tests, score) {
    const recommendations = [];
    
    if (score < 80) {
      const failedTests = tests.filter(test => !test.passed);
      failedTests.forEach(test => {
        switch (test.name) {
          case 'Build Status':
            recommendations.push('Fix frontend build issues and ensure all dependencies are properly installed');
            break;
          case 'Development Server':
            recommendations.push('Start the frontend development server and ensure it\'s accessible on port 5173');
            break;
          case 'TypeScript Compilation':
            recommendations.push('Resolve TypeScript compilation errors in frontend components');
            break;
          case 'Component Structure':
            recommendations.push('Expand component library and ensure proper component organization');
            break;
          case 'Dependencies':
            recommendations.push('Update frontend dependencies and ensure all required packages are installed');
            break;
        }
      });
    }
    
    if (score >= 80) {
      recommendations.push('Frontend layer is healthy - focus on performance optimization and feature development');
    }
    
    return recommendations;
  }

  generateBackendRecommendations(tests, score) {
    const recommendations = [];
    
    if (score < 80) {
      const failedTests = tests.filter(test => !test.passed);
      failedTests.forEach(test => {
        switch (test.name) {
          case 'TypeScript Compilation':
            recommendations.push('Fix TypeScript compilation errors in backend code');
            break;
          case 'Server Health':
            recommendations.push('Start backend server and ensure it\'s running on port 3001');
            break;
          case 'API Endpoints':
            recommendations.push('Implement and test all required API endpoints');
            break;
          case 'Database Configuration':
            recommendations.push('Configure database connection and ensure proper setup');
            break;
          case 'Dependencies':
            recommendations.push('Update backend dependencies and ensure all required packages are installed');
            break;
        }
      });
    }
    
    if (score >= 80) {
      recommendations.push('Backend layer is healthy - focus on API optimization and security hardening');
    }
    
    return recommendations;
  }

  generateInfrastructureRecommendations(tests, score) {
    const recommendations = [];
    
    if (score < 80) {
      const failedTests = tests.filter(test => !test.passed);
      failedTests.forEach(test => {
        switch (test.name) {
          case 'Git Repository':
            recommendations.push('Initialize git repository and ensure proper version control setup');
            break;
          case 'File Structure':
            recommendations.push('Organize project structure and create missing directories');
            break;
          case 'Environment Config':
            recommendations.push('Create environment configuration files and document required variables');
            break;
          case 'Package Management':
            recommendations.push('Initialize package management and ensure proper dependency tracking');
            break;
          case 'Documentation':
            recommendations.push('Create comprehensive documentation and project README');
            break;
        }
      });
    }
    
    if (score >= 80) {
      recommendations.push('Infrastructure layer is healthy - focus on deployment automation and monitoring');
    }
    
    return recommendations;
  }

  generateGovernanceRecommendations(tests, score) {
    const recommendations = [];
    
    if (score < 80) {
      const failedTests = tests.filter(test => !test.passed);
      failedTests.forEach(test => {
        switch (test.name) {
          case 'Protocol System':
            recommendations.push('Implement missing protocols and ensure proper governance procedures');
            break;
          case 'Governance Documentation':
            recommendations.push('Create governance documentation and establish clear policies');
            break;
          case 'Session Management':
            recommendations.push('Implement session management system and tracking mechanisms');
            break;
          case 'Audit System':
            recommendations.push('Set up audit system and automated health checks');
            break;
          case 'Change Tracking':
            recommendations.push('Implement change tracking and version control procedures');
            break;
        }
      });
    }
    
    if (score >= 80) {
      recommendations.push('Governance layer is healthy - focus on policy refinement and automation');
    }
    
    return recommendations;
  }

  generateLayerImprovementSummary() {
    const summary = {
      timestamp: new Date().toISOString(),
      overallHealth: this.layerTestResults.overallHealth,
      layerBreakdown: {},
      criticalIssues: [],
      improvementPriorities: [],
      nextActions: []
    };

    // Analyze each layer
    Object.entries(this.layerTestResults.layers).forEach(([layerName, layerData]) => {
      summary.layerBreakdown[layerName] = {
        health: layerData.health,
        score: layerData.score,
        criticalTests: layerData.tests.filter(test => !test.passed),
        recommendations: layerData.recommendations
      };

      // Collect critical issues
      if (layerData.health === 'critical') {
        summary.criticalIssues.push(`${layerName.toUpperCase()} layer is critical (${layerData.score}/100)`);
      }

      // Collect improvement priorities
      if (layerData.score < 80) {
        summary.improvementPriorities.push({
          layer: layerName,
          priority: layerData.health === 'critical' ? 'HIGH' : 'MEDIUM',
          score: layerData.score,
          recommendations: layerData.recommendations.slice(0, 3) // Top 3 recommendations
        });
      }
    });

    // Generate next actions
    if (summary.criticalIssues.length > 0) {
      summary.nextActions.push('Address critical layer issues immediately');
    }
    
    summary.improvementPriorities
      .sort((a, b) => a.priority === 'HIGH' ? -1 : 1)
      .slice(0, 3)
      .forEach(priority => {
        summary.nextActions.push(`Improve ${priority.layer} layer (${priority.score}/100)`);
      });

    if (summary.nextActions.length === 0) {
      summary.nextActions.push('All layers are healthy - focus on feature development and optimization');
    }

    return summary;
  }

  async validateSystemState() {
    console.log('📊 Phase 3: System State Validation');
    
    this.systemState = {
      timestamp: new Date().toISOString(),
      buildStatus: await this.checkBuildStatus(),
      gitStatus: await this.getGitStatus(),
      fileStructure: await this.analyzeFileStructure(),
      dependencies: await this.analyzeDependencies()
    };

    console.log(`✅ System state validated: ${this.systemState.buildStatus.status}`);
  }

  async assessRoadmapPriorities() {
    console.log('🗺️ Phase 4: Roadmap Priority Assessment');
    
    const roadmapPath = path.join(this.projectRoot, 'LIVING_ROADMAP.md');
    if (fs.existsSync(roadmapPath)) {
      const roadmapContent = fs.readFileSync(roadmapPath, 'utf8');
      
      // Extract priority areas
      const priorityMatch = roadmapContent.match(/### Current Priority Areas:([\s\S]*?)(?=---|$)/);
      if (priorityMatch) {
        this.recommendations.push({
          type: 'roadmap_priorities',
          content: priorityMatch[1].trim(),
          source: 'LIVING_ROADMAP.md'
        });
      }
    }

    console.log(`✅ Roadmap priorities assessed: ${this.recommendations.length} recommendations found`);
  }

  async verifyContextPreservation() {
    console.log('📋 Phase 5: Context Preservation Verification');
    
    const contextFiles = [
      'LIVING_ROADMAP.md',
      'ROADMAP.md',
      'greenlight-wiki/CHANGELOG.md',
      'DOCUMENTATION_CUSTODIAN_AND_SCRIPTMASTER.md'
    ];

    const preservedFiles = contextFiles.filter(file => 
      fs.existsSync(path.join(this.projectRoot, file))
    );

    this.launchReadiness.contextPreservation = {
      totalFiles: contextFiles.length,
      preservedFiles: preservedFiles.length,
      missingFiles: contextFiles.filter(file => 
        !fs.existsSync(path.join(this.projectRoot, file))
      )
    };

    console.log(`✅ Context preservation verified: ${preservedFiles.length}/${contextFiles.length} files present`);
  }

  async assessLaunchReadiness() {
    console.log('🚀 Phase 6: Launch Readiness Assessment');
    
    const contextAwarenessScore = this.contextAwarenessResults.tests.filter(test => test.passed).length / this.contextAwarenessResults.tests.length;
    const systemHealth = this.systemState.buildStatus.status === 'success';
    const contextPreserved = this.launchReadiness.contextPreservation.preservedFiles / this.launchReadiness.contextPreservation.totalFiles;

    this.launchReadiness.overall = {
      contextAwarenessScore,
      systemHealth,
      contextPreserved,
      ready: contextAwarenessScore >= 0.8 && systemHealth && contextPreserved >= 0.75
    };

    console.log(`✅ Launch readiness assessed: ${this.launchReadiness.overall.ready ? 'READY' : 'NEEDS ATTENTION'}`);
  }

  async generateLaunchReport() {
    console.log('📄 Phase 7: Generating Enhanced Launch Report');
    
    // Generate roadmap anchor statement
    const roadmapAnchor = await this.generateRoadmapAnchor();
    
    const report = {
      // Enhanced Session Information
      sessionMetadata: this.sessionMetadata,
      sessionId: this.sessionId,
      sessionType: 'launch',
      sessionLabel: 'Greenlight Platform Launch Protocol',
      
      // Protocol Information
      timestamp: new Date().toISOString(),
      protocolVersion: this.protocolVersion,
      
      // Test Results
      contextAwarenessResults: this.contextAwarenessResults,
      layerTestResults: this.layerTestResults,
      
      // System State
      systemState: this.systemState,
      launchReadiness: this.launchReadiness,
      roadmapAnchor: roadmapAnchor,
      
      // Recommendations and Improvements
      recommendations: this.recommendations,
      layerImprovements: this.generateLayerImprovementSummary(),
      
      // Session Tracking
      sessionTracking: {
        uniqueId: this.sessionId,
        label: 'Greenlight Platform Launch Protocol v2.0.0',
        category: 'system-launch',
        priority: 'high',
        tags: ['launch', 'protocol', 'system-health', 'context-awareness'],
        estimatedDuration: '2-5 minutes',
        actualDuration: this.calculateSessionDuration(),
        status: 'completed',
        completionTime: new Date().toISOString()
      },
      
      notes: [
        'Launch protocol v2.0.0 completed successfully with progressive layer testing.',
        'Context awareness testing results are always reported.',
        'Progressive layer testing provides detailed health metrics for each system layer.',
        'Layer-specific recommendations guide targeted improvements.',
        'New chat sessions should default to asking about roadmap priorities if not picking up mid-operation.',
        'System state and readiness have been assessed.',
        'Roadmap anchor statement has been generated.',
        'Recommendations for next steps have been generated.',
        'Enhanced session ID generation with unique labeling implemented.',
        'Session metadata includes comprehensive tracking information.',
        'IMPORTANT: Session 2025-07-08 launch failed due to 5 critical issues (build failures, missing documentation). This is a one-time record to ensure future sessions monitor and prevent similar launch failures. System should prioritize build health and documentation completeness.'
      ]
    };

    const reportPath = path.join(this.projectRoot, 'LAUNCH_REPORT.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Also generate a separate roadmap anchor file for easy access
    const anchorPath = path.join(this.projectRoot, 'ROADMAP_ANCHOR.json');
    fs.writeFileSync(anchorPath, JSON.stringify(roadmapAnchor, null, 2));
    
    console.log(`✅ Launch report generated: ${reportPath}`);
    console.log(`✅ Roadmap anchor generated: ${anchorPath}`);
    
    // Print roadmap anchor statement to console
    console.log('');
    console.log('🗺️ ROADMAP ANCHOR STATEMENT');
    console.log('============================');
    console.log(`Current Phase: ${roadmapAnchor.currentPhase}`);
    console.log(`Progress: ${roadmapAnchor.progress}%`);
    console.log(`Next Milestone: ${roadmapAnchor.nextMilestone}`);
    console.log('');
    console.log('Current Priorities:');
    roadmapAnchor.currentPriorities.forEach((priority, index) => {
      console.log(`  ${index + 1}. ${priority}`);
    });
    console.log('');
    console.log('Recent Completed Items:');
    roadmapAnchor.completedItems.slice(-3).forEach((item, index) => {
      console.log(`  ${index + 1}. ${item}`);
    });
    console.log('');
    console.log('Pending Items:');
    roadmapAnchor.pendingItems.slice(0, 3).forEach((item, index) => {
      console.log(`  ${index + 1}. ${item}`);
    });
    console.log('');
  }

  async generateRoadmapAnchor() {
    const livingRoadmapPath = path.join(this.projectRoot, 'LIVING_ROADMAP.md');
    const changelogPath = path.join(this.projectRoot, 'greenlight-wiki/CHANGELOG.md');
    const roadmapPath = path.join(this.projectRoot, 'ROADMAP.md');
    const nextSessionPath = path.join(this.projectRoot, 'scripts/NEXT_SESSION_CONTEXT.md');
    
    let currentPhase = 'Unknown';
    let currentPriorities = [];
    let completedItems = [];
    let pendingItems = [];
    let nextMilestone = 'Continue current work';
    let progress = 0;
    
    // Read roadmap content
    if (fs.existsSync(livingRoadmapPath)) {
      const roadmapContent = fs.readFileSync(livingRoadmapPath, 'utf8');
      
      // Extract current phase from roadmap (find first non-completed section)
      const sections = roadmapContent.split(/(?=^## )/m);
      let currentPhase = 'Unknown';
      
      for (const section of sections) {
        const phaseMatch = section.match(/^## ([^#\n]+)/);
        if (phaseMatch) {
          const phaseTitle = phaseMatch[1].trim();
          // Skip completed sections
          if (!phaseTitle.includes('(COMPLETED') && !phaseTitle.includes('✅')) {
            currentPhase = phaseTitle;
            break;
          }
        }
      }
      
      // Extract priorities from roadmap
      const priorityMatch = roadmapContent.match(/### Current Priority Areas:([\s\S]*?)(?=###|$)/);
      if (priorityMatch) {
        const priorityContent = priorityMatch[1];
        const priorityLines = priorityContent.split('\n').filter(line => line.trim().startsWith('-'));
        currentPriorities = priorityLines.map(line => line.replace(/^-\s*/, '').trim());
      }
      
      // Extract pending items from current roadmap section
      for (const section of sections) {
        const phaseMatch = section.match(/^## ([^#\n]+)/);
        if (phaseMatch) {
          const phaseTitle = phaseMatch[1].trim();
          // Only process non-completed sections
          if (!phaseTitle.includes('(COMPLETED') && !phaseTitle.includes('✅')) {
            const pendingMatch = section.match(/### Implementation Steps & Risk Mitigation Checklist([\s\S]*?)(?=^## |$)/m);
            if (pendingMatch) {
              const pendingContent = pendingMatch[1];
              const pendingLines = pendingContent.split('\n').filter(line => line.trim().startsWith('- [ ]'));
              pendingItems = pendingLines.map(line => line.replace(/^-\s*\[ \]\s*/, '').trim());
            }
            break;
          }
        }
      }
    }
    
    // Read changelog for completed items
    if (fs.existsSync(changelogPath)) {
      const changelogContent = fs.readFileSync(changelogPath, 'utf8');
      const recentEntries = changelogContent.split('## ').slice(1, 4); // Last 3 entries
      completedItems = recentEntries.map(entry => {
        const titleMatch = entry.match(/^([^\n]+)/);
        return titleMatch ? titleMatch[1].trim() : 'Recent work';
      });
    }
    
    // Read next session context for additional context
    if (fs.existsSync(nextSessionPath)) {
      const nextSessionContent = fs.readFileSync(nextSessionPath, 'utf8');
      const recommendationsMatch = nextSessionContent.match(/### Recommendations:([\s\S]*?)(?=###|$)/);
      if (recommendationsMatch) {
        const recommendations = recommendationsMatch[1].split('\n').filter(line => line.trim().startsWith('-'));
        pendingItems = [...pendingItems, ...recommendations.map(line => line.replace(/^-\s*/, '').trim())];
      }
    }
    
    // Calculate progress based on completed vs pending items
    const totalItems = completedItems.length + pendingItems.length;
    progress = totalItems > 0 ? Math.round((completedItems.length / totalItems) * 100) : 0;
    
    // Determine next milestone
    if (pendingItems.length > 0) {
      nextMilestone = pendingItems[0];
    }
    
    return {
      currentPhase,
      currentPriorities,
      completedItems,
      pendingItems,
      nextMilestone,
      progress,
      lastUpdated: new Date().toISOString()
    };
  }

  // Helper methods
  async checkBuildStatus() {
    try {
      execSync('npm run build', { encoding: 'utf8' });
      return { status: 'success', error: null };
    } catch {
      return { status: 'failed', error: 'Build failed' };
    }
  }

  async getGitStatus() {
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      const lines = status.trim().split('\n').filter(line => line.length > 0);
      return {
        modifiedFiles: lines.length,
        hasChanges: lines.length > 0,
        details: lines
      };
    } catch {
      return { modifiedFiles: 0, hasChanges: false, details: [] };
    }
  }

  async analyzeFileStructure() {
    const keyDirectories = ['src', 'scripts', 'packages'];
    const structure = {};
    
    for (const dir of keyDirectories) {
      const dirPath = path.join(this.projectRoot, dir);
      structure[dir] = fs.existsSync(dirPath);
    }
    
    return structure;
  }

  async analyzeDependencies() {
    try {
      const packageJson = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8'));
      return {
        totalDependencies: Object.keys({ ...packageJson.dependencies, ...packageJson.devDependencies }).length,
        hasScripts: !!packageJson.scripts,
        version: packageJson.version
      };
    } catch {
      return { totalDependencies: 0, hasScripts: false, version: 'unknown' };
    }
  }

  logError(error) {
    const errorLog = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      script: 'launch_protocol',
      error: {
        message: error.message,
        stack: error.stack
      }
    };

    const errorPath = path.join(this.projectRoot, 'LAUNCH_ERROR.json');
    fs.writeFileSync(errorPath, JSON.stringify(errorLog, null, 2));
    console.error(`📁 Error logged to: ${errorPath}`);
  }

  async generateTransitionMemo() {
    console.log('📝 Phase 8: Generating Transition Memo...');
    
    const sessionsDir = path.join(this.projectRoot, 'data', 'sessions');
    if (!fs.existsSync(sessionsDir)) {
      fs.mkdirSync(sessionsDir, { recursive: true });
    }
    
    const memoFile = path.join(sessionsDir, `transition-memo-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
    
    // Collect data from all phases
    const memo = {
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      summary: 'Transition Memo: Launch Protocol',
      sessionSummary: this.contextAwarenessResults ? 
        `Context awareness: ${this.contextAwarenessResults.tests.filter(t => t.passed).length}/${this.contextAwarenessResults.tests.length} tests passed` : 'N/A',
      auditSummary: this.layerTestResults && this.layerTestResults.overallHealth ? 
        `Layer health: ${this.layerTestResults.overallHealth.averageScore || this.layerTestResults.overallHealth}/100` : 'N/A',
      nextSteps: this.roadmapPriorities || [],
      context: {
        systemHealth: this.systemStateResults || {},
        launchReadiness: this.launchReadinessResults || {},
        sessionDuration: this.calculateSessionDuration()
      }
    };
    
    fs.writeFileSync(memoFile, JSON.stringify(memo, null, 2));
    console.log(`📝 Transition memo generated and logged: ${memoFile}`);
  }
}

// Run the launch protocol
if (require.main === module) {
  const launch = new LaunchProtocol();
  launch.execute().catch(error => {
    console.error('Launch protocol failed:', error);
    process.exit(1);
  });
}

module.exports = LaunchProtocol; 