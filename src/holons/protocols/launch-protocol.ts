/**
 * Modular Launch Protocol for Protocol Holon
 * 
 * PURPOSE: Comprehensive protocol for starting new chat sessions with full context preservation
 * - Context awareness testing
 * - Progressive layer testing
 * - System state validation
 * - Roadmap priority assessment
 * - Launch readiness assessment
 */

import { BaseProtocol, ProtocolConfig, ProtocolResult } from './base-protocol';
import * as fs from 'fs';
import * as path from 'path';

interface ContextAwarenessTest {
  name: string;
  description: string;
  passed: boolean;
  details: any;
  timestamp: string;
}

interface LayerTestResult {
  layer: string;
  health: number;
  issues: string[];
  recommendations: string[];
  timestamp: string;
}

interface LaunchReport {
  sessionId: string;
  timestamp: string;
  contextAwareness: {
    totalTests: number;
    passedTests: number;
    tests: ContextAwarenessTest[];
  };
  layerTesting: {
    layers: LayerTestResult[];
    overallHealth: number;
  };
  systemState: any;
  roadmapPriorities: string[];
  launchReadiness: {
    ready: boolean;
    score: number;
    issues: string[];
    recommendations: string[];
  };
  recommendations: string[];
}

export class LaunchProtocol extends BaseProtocol {
  private contextAwarenessResults: ContextAwarenessTest[] = [];
  private layerTestResults: LayerTestResult[] = [];
  private systemState: any = {};
  private roadmapPriorities: string[] = [];
  private launchReadiness: any = {};

  constructor() {
    const config: ProtocolConfig = {
      protocolName: 'Launch Protocol',
      protocolVersion: '2.0.0',
      sessionType: 'launch',
      sessionLabel: 'Greenlight Platform Launch Protocol',
      dataDirectory: 'data',
      reportsDirectory: 'data/reports',
      sessionsDirectory: 'data/sessions'
    };
    
    super(config);
  }

  async execute(): Promise<ProtocolResult> {
    this.printHeader();

    try {
      await this.executeWithErrorHandling(async () => {
        // Phase 0: Prevention System Check
        await this.executePhase('Prevention System Check', () => this.runPreventionSystem());
        
        // Phase 1: Context Awareness Testing
        await this.executePhase('Context Awareness Testing', () => this.performContextAwarenessTesting());
        
        // Phase 2: Progressive Layer Testing
        await this.executePhase('Progressive Layer Testing', () => this.performProgressiveLayerTesting());
        
        // Phase 3: System State Validation
        await this.executePhase('System State Validation', () => this.validateSystemState());
        
        // Phase 4: Roadmap Priority Assessment
        await this.executePhase('Roadmap Priority Assessment', () => this.assessRoadmapPriorities());
        
        // Phase 5: Context Preservation Verification
        await this.executePhase('Context Preservation Verification', () => this.verifyContextPreservation());
        
        // Phase 6: Launch Readiness Assessment
        await this.executePhase('Launch Readiness Assessment', () => this.assessLaunchReadiness());
        
        // Phase 7: Generate Enhanced Launch Report
        await this.executePhase('Generate Launch Report', () => this.generateLaunchReport());
        
        // Phase 8: Generate Transition Memo
        await this.executePhase('Generate Transition Memo', () => this.generateTransitionMemo());
      });

      this.printFooter();
      return this.generateResult();

    } catch (error) {
      this.logError('Launch Protocol execution failed', error);
      this.printFooter();
      return this.generateResult();
    }
  }

  private async runPreventionSystem(): Promise<void> {
    try {
      const preventionResult = this.executeCommand('node scripts/protocols/prevention_system.cjs');
      
      if (preventionResult.includes('CRITICAL ISSUES DETECTED')) {
        this.logWarning('Prevention system detected issues - proceeding with caution');
      } else if (preventionResult.includes('WARNINGS DETECTED')) {
        this.logWarning('Prevention system warnings detected - proceeding with caution');
      } else {
        this.logSuccess('Prevention system passed - all checks cleared');
      }
    } catch (error) {
      this.logWarning('Prevention system failed - proceeding with launch');
    }
  }

  private async performContextAwarenessTesting(): Promise<void> {
    const tests = [
      { name: 'Roadmap Awareness', test: () => this.testRoadmapAwareness() },
      { name: 'System Architecture Awareness', test: () => this.testArchitectureAwareness() },
      { name: 'Current State Awareness', test: () => this.testCurrentStateAwareness() },
      { name: 'Holon System Awareness', test: () => this.testHolonSystemAwareness() },
      { name: 'Recent Work Awareness', test: () => this.testRecentWorkAwareness() },
      { name: 'Priority Awareness', test: () => this.testPriorityAwareness() }
    ];

    for (const test of tests) {
      try {
        const result = await test.test();
        this.contextAwarenessResults.push(result);
      } catch (error: any) {
        this.contextAwarenessResults.push({
          name: test.name,
          description: 'Test failed due to error',
          passed: false,
          details: { error: error.message },
          timestamp: new Date().toISOString()
        });
      }
    }

    const passedTests = this.contextAwarenessResults.filter(test => test.passed).length;
    const totalTests = this.contextAwarenessResults.length;
    
    this.logInfo(`Context awareness testing completed: ${passedTests}/${totalTests} tests passed`);
  }

  private async testRoadmapAwareness(): Promise<ContextAwarenessTest> {
    const roadmapPath = path.join(this.projectRoot, 'ROADMAP.md');
    const roadmapExists = this.validateFileExists(roadmapPath, 'Roadmap file');
    
    return {
      name: 'Roadmap Awareness',
      description: 'Check if roadmap is accessible and current',
      passed: roadmapExists,
      details: { roadmapPath, exists: roadmapExists },
      timestamp: new Date().toISOString()
    };
  }

  private async testArchitectureAwareness(): Promise<ContextAwarenessTest> {
    const archPath = path.join(this.projectRoot, 'docs/architecture');
    const archExists = this.validateDirectoryExists(archPath, 'Architecture documentation');
    
    return {
      name: 'System Architecture Awareness',
      description: 'Check if architecture documentation is accessible',
      passed: archExists,
      details: { archPath, exists: archExists },
      timestamp: new Date().toISOString()
    };
  }

  private async testCurrentStateAwareness(): Promise<ContextAwarenessTest> {
    const statePath = path.join(this.projectRoot, 'data/system-state');
    const stateExists = this.validateDirectoryExists(statePath, 'System state directory');
    
    return {
      name: 'Current State Awareness',
      description: 'Check if current system state is accessible',
      passed: stateExists,
      details: { statePath, exists: stateExists },
      timestamp: new Date().toISOString()
    };
  }

  private async testHolonSystemAwareness(): Promise<ContextAwarenessTest> {
    const holonPath = path.join(this.projectRoot, 'src/holons');
    const holonExists = this.validateDirectoryExists(holonPath, 'Holon system directory');
    
    return {
      name: 'Holon System Awareness',
      description: 'Check if holon system is accessible',
      passed: holonExists,
      details: { holonPath, exists: holonExists },
      timestamp: new Date().toISOString()
    };
  }

  private async testRecentWorkAwareness(): Promise<ContextAwarenessTest> {
    const sessionsPath = path.join(this.projectRoot, 'data/sessions');
    const sessionsExist = this.validateDirectoryExists(sessionsPath, 'Sessions directory');
    
    return {
      name: 'Recent Work Awareness',
      description: 'Check if recent work sessions are accessible',
      passed: sessionsExist,
      details: { sessionsPath, exists: sessionsExist },
      timestamp: new Date().toISOString()
    };
  }

  private async testPriorityAwareness(): Promise<ContextAwarenessTest> {
    const prioritiesPath = path.join(this.projectRoot, 'data/roadmap-actuals');
    const prioritiesExist = this.validateDirectoryExists(prioritiesPath, 'Roadmap priorities directory');
    
    return {
      name: 'Priority Awareness',
      description: 'Check if priority information is accessible',
      passed: prioritiesExist,
      details: { prioritiesPath, exists: prioritiesExist },
      timestamp: new Date().toISOString()
    };
  }

  private async performProgressiveLayerTesting(): Promise<void> {
    const layers = [
      { name: 'Frontend', test: () => this.testFrontendLayer() },
      { name: 'Backend', test: () => this.testBackendLayer() },
      { name: 'Infrastructure', test: () => this.testInfrastructureLayer() },
      { name: 'Governance', test: () => this.testGovernanceLayer() }
    ];

    for (const layer of layers) {
      try {
        const result = await layer.test();
        this.layerTestResults.push(result);
      } catch (error: any) {
        this.layerTestResults.push({
          layer: layer.name,
          health: 0,
          issues: [error.message],
          recommendations: ['Fix layer-specific issues'],
          timestamp: new Date().toISOString()
        });
      }
    }

    const overallHealth = this.layerTestResults.reduce((sum, result) => sum + result.health, 0) / this.layerTestResults.length;
    this.logInfo(`Progressive layer testing completed: ${overallHealth.toFixed(1)}% overall health`);
  }

  private async testFrontendLayer(): Promise<LayerTestResult> {
    const frontendPath = path.join(this.projectRoot, 'frontend');
    const exists = this.validateDirectoryExists(frontendPath, 'Frontend directory');
    
    let health = 100;
    const issues: string[] = [];
    const recommendations: string[] = [];

    if (!exists) {
      health = 0;
      issues.push('Frontend directory not found');
      recommendations.push('Create frontend directory structure');
    } else {
      // Check for package.json
      const packageJsonPath = path.join(frontendPath, 'package.json');
      if (!this.validateFileExists(packageJsonPath, 'Frontend package.json')) {
        health -= 30;
        issues.push('Frontend package.json not found');
        recommendations.push('Initialize frontend package.json');
      }

      // Check for src directory
      const srcPath = path.join(frontendPath, 'src');
      if (!this.validateDirectoryExists(srcPath, 'Frontend src directory')) {
        health -= 20;
        issues.push('Frontend src directory not found');
        recommendations.push('Create frontend src directory');
      }
    }

    return {
      layer: 'Frontend',
      health,
      issues,
      recommendations,
      timestamp: new Date().toISOString()
    };
  }

  private async testBackendLayer(): Promise<LayerTestResult> {
    const backendPath = path.join(this.projectRoot, 'backend');
    const exists = this.validateDirectoryExists(backendPath, 'Backend directory');
    
    let health = 100;
    const issues: string[] = [];
    const recommendations: string[] = [];

    if (!exists) {
      health = 0;
      issues.push('Backend directory not found');
      recommendations.push('Create backend directory structure');
    } else {
      // Check for package.json
      const packageJsonPath = path.join(backendPath, 'package.json');
      if (!this.validateFileExists(packageJsonPath, 'Backend package.json')) {
        health -= 30;
        issues.push('Backend package.json not found');
        recommendations.push('Initialize backend package.json');
      }

      // Check for src directory
      const srcPath = path.join(backendPath, 'src');
      if (!this.validateDirectoryExists(srcPath, 'Backend src directory')) {
        health -= 20;
        issues.push('Backend src directory not found');
        recommendations.push('Create backend src directory');
      }
    }

    return {
      layer: 'Backend',
      health,
      issues,
      recommendations,
      timestamp: new Date().toISOString()
    };
  }

  private async testInfrastructureLayer(): Promise<LayerTestResult> {
    const infraPath = path.join(this.projectRoot, 'infrastructure');
    const exists = this.validateDirectoryExists(infraPath, 'Infrastructure directory');
    
    let health = 100;
    const issues: string[] = [];
    const recommendations: string[] = [];

    if (!exists) {
      health -= 50;
      issues.push('Infrastructure directory not found');
      recommendations.push('Create infrastructure directory for deployment configs');
    }

    // Check for config files
    const configPath = path.join(this.projectRoot, 'config');
    if (!this.validateDirectoryExists(configPath, 'Config directory')) {
      health -= 30;
      issues.push('Config directory not found');
      recommendations.push('Create config directory for environment configs');
    }

    return {
      layer: 'Infrastructure',
      health,
      issues,
      recommendations,
      timestamp: new Date().toISOString()
    };
  }

  private async testGovernanceLayer(): Promise<LayerTestResult> {
    const governancePath = path.join(this.projectRoot, 'data/governance');
    const exists = this.validateDirectoryExists(governancePath, 'Governance directory');
    
    let health = 100;
    const issues: string[] = [];
    const recommendations: string[] = [];

    if (!exists) {
      health -= 40;
      issues.push('Governance directory not found');
      recommendations.push('Create governance directory for system governance');
    }

    // Check for council data
    const councilPath = path.join(this.projectRoot, 'data/council');
    if (!this.validateDirectoryExists(councilPath, 'Council directory')) {
      health -= 30;
      issues.push('Council directory not found');
      recommendations.push('Create council directory for governance data');
    }

    return {
      layer: 'Governance',
      health,
      issues,
      recommendations,
      timestamp: new Date().toISOString()
    };
  }

  private async validateSystemState(): Promise<void> {
    this.systemState = {
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      contextAwarenessScore: this.contextAwarenessResults.filter(t => t.passed).length / this.contextAwarenessResults.length,
      layerHealth: this.layerTestResults.reduce((acc, layer) => {
        acc[layer.layer.toLowerCase()] = layer.health;
        return acc;
      }, {} as any),
      overallHealth: this.layerTestResults.reduce((sum, layer) => sum + layer.health, 0) / this.layerTestResults.length
    };

    await this.saveData(this.systemState, `system-state-${this.sessionId}.json`);
  }

  private async assessRoadmapPriorities(): Promise<void> {
    const roadmapPath = path.join(this.projectRoot, 'ROADMAP.md');
    if (this.validateFileExists(roadmapPath, 'Roadmap file')) {
      try {
        const roadmapContent = fs.readFileSync(roadmapPath, 'utf8');
        // Extract priorities from roadmap content
        this.roadmapPriorities = this.extractPrioritiesFromRoadmap(roadmapContent);
      } catch (error) {
        this.logWarning('Could not read roadmap file');
        this.roadmapPriorities = ['Continue development', 'Maintain system health'];
      }
    } else {
      this.roadmapPriorities = ['Create roadmap', 'Define priorities'];
    }
  }

  private extractPrioritiesFromRoadmap(content: string): string[] {
    const priorities: string[] = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      if (line.includes('PRIORITY') || line.includes('priority') || line.includes('TODO')) {
        priorities.push(line.trim());
      }
    }
    
    return priorities.slice(0, 5); // Return top 5 priorities
  }

  private async verifyContextPreservation(): Promise<void> {
    const contextPath = path.join(this.projectRoot, 'data/context-preservation');
    this.validateDirectoryExists(contextPath, 'Context preservation directory');
    
    // Create context preservation entry
    const contextData = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      systemState: this.systemState,
      roadmapPriorities: this.roadmapPriorities,
      layerTestResults: this.layerTestResults
    };

    await this.saveData(contextData, `context-${this.sessionId}.json`);
  }

  private async assessLaunchReadiness(): Promise<void> {
    const contextScore = this.contextAwarenessResults.filter(t => t.passed).length / this.contextAwarenessResults.length;
    const layerScore = this.layerTestResults.reduce((sum, layer) => sum + layer.health, 0) / this.layerTestResults.length;
    const overallScore = (contextScore + layerScore / 100) / 2;

    this.launchReadiness = {
      ready: overallScore >= 0.7,
      score: overallScore * 100,
      issues: this.layerTestResults.flatMap(layer => layer.issues),
      recommendations: this.layerTestResults.flatMap(layer => layer.recommendations)
    };
  }

  private async generateLaunchReport(): Promise<void> {
    const report: LaunchReport = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      contextAwareness: {
        totalTests: this.contextAwarenessResults.length,
        passedTests: this.contextAwarenessResults.filter(t => t.passed).length,
        tests: this.contextAwarenessResults
      },
      layerTesting: {
        layers: this.layerTestResults,
        overallHealth: this.layerTestResults.reduce((sum, layer) => sum + layer.health, 0) / this.layerTestResults.length
      },
      systemState: this.systemState,
      roadmapPriorities: this.roadmapPriorities,
      launchReadiness: this.launchReadiness,
      recommendations: this.layerTestResults.flatMap(layer => layer.recommendations)
    };

    await this.saveReport(report, `LAUNCH_REPORT-${this.sessionId}.json`);
    this.results.launchReport = report;
  }

  private async generateTransitionMemo(): Promise<void> {
    const memo = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      type: 'launch_transition',
      summary: {
        contextAwareness: `${this.contextAwarenessResults.filter(t => t.passed).length}/${this.contextAwarenessResults.length} tests passed`,
        layerHealth: `${this.layerTestResults.reduce((sum, layer) => sum + layer.health, 0) / this.layerTestResults.length}% overall health`,
        launchReadiness: this.launchReadiness.ready ? 'Ready' : 'Needs attention',
        score: `${this.launchReadiness.score.toFixed(1)}%`
      },
      nextSteps: this.roadmapPriorities.slice(0, 3),
      recommendations: this.launchReadiness.recommendations.slice(0, 5)
    };

    await this.saveReport(memo, `TRANSITION_MEMO-${this.sessionId}.json`);
    this.results.transitionMemo = memo;
  }
}

// CLI interface for direct usage
if (require.main === module) {
  const launchProtocol = new LaunchProtocol();
  
  launchProtocol.execute()
    .then(result => {
      if (result.success) {
        console.log('\n🎉 Launch protocol completed successfully!');
        process.exit(0);
      } else {
        console.log('\n⚠️  Launch protocol completed with issues');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ Launch protocol failed:', error);
      process.exit(1);
    });
} 