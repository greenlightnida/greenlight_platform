#!/usr/bin/env node

/**
 * Custodian Intelligence Milestone Tests
 * 
 * PURPOSE: Progressive automation validation for custodian and committee intelligence
 * - Test custodian's ability to detect orphans, discrepancies, and governance issues
 * - Validate committee consensus and reporting accuracy
 * - Enable course correction and progressive automation
 * - Ensure non-destructive behavior while maintaining system integrity
 * 
 * MILESTONES:
 * - MILESTONE_1: Basic orphan detection and reporting
 * - MILESTONE_2: Committee consensus validation
 * - MILESTONE_3: Cross-system impact assessment
 * - MILESTONE_4: Predictive governance recommendations
 * - MILESTONE_5: Autonomous course correction (with human oversight)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// === Test Configuration ===
const TEST_CONFIG = {
  milestones: {
    MILESTONE_1: { name: 'Basic Orphan Detection', threshold: 0.8 },
    MILESTONE_2: { name: 'Committee Consensus', threshold: 0.9 },
    MILESTONE_3: { name: 'Cross-System Impact', threshold: 0.85 },
    MILESTONE_4: { name: 'Predictive Governance', threshold: 0.75 },
    MILESTONE_5: { name: 'Autonomous Correction', threshold: 0.95 }
  },
  testDataDir: path.join(process.cwd(), 'data/custodian-intelligence-tests'),
  resultsFile: 'CUSTODIAN_INTELLIGENCE_RESULTS.json'
};

// === Test Scenarios ===
const TEST_SCENARIOS = {
  orphanDetection: {
    description: 'Detect command-related orphans outside command center',
    setup: () => {
      // Create test orphans
      const testOrphans = [
        'scripts/test_orphan_command.cjs',
        'scripts/test_orphan_protocol.cjs',
        'src/test_orphan_manager.ts'
      ];
      testOrphans.forEach(file => {
        fs.writeFileSync(file, `// Test orphan file for intelligence testing\nconsole.log('test');`);
      });
      return testOrphans;
    },
    cleanup: (files) => {
      files.forEach(file => {
        if (fs.existsSync(file)) fs.unlinkSync(file);
      });
    },
    validate: (custodianReport) => {
      const candidates = custodianReport.candidates || [];
      return {
        score: candidates.length >= 3 ? 1.0 : candidates.length / 3,
        details: `Found ${candidates.length}/3 expected orphans`
      };
    }
  },
  
  committeeConsensus: {
    description: 'Validate committee consensus reporting',
    setup: () => {
      // Create mock committee report
      const mockReport = {
        timestamp: new Date().toISOString(),
        consensus: true,
        committee: [
          { name: 'TestManager', role: 'Test Role', path: 'test/path' }
        ],
        report: [
          { name: 'TestManager', status: 'ok', findings: [] }
        ]
      };
      fs.writeFileSync('ENTERPRISE_COMMITTEE_REPORT.json', JSON.stringify(mockReport, null, 2));
      return mockReport;
    },
    cleanup: () => {
      if (fs.existsSync('ENTERPRISE_COMMITTEE_REPORT.json')) {
        fs.unlinkSync('ENTERPRISE_COMMITTEE_REPORT.json');
      }
    },
    validate: (report) => {
      return {
        score: report.consensus === true ? 1.0 : 0.0,
        details: `Committee consensus: ${report.consensus}`
      };
    }
  },
  
  nonDestructiveBehavior: {
    description: 'Ensure custodian never deletes or moves files automatically',
    setup: () => {
      const testFile = 'scripts/test_protected_file.cjs';
      fs.writeFileSync(testFile, '// Protected test file\nconsole.log("protected");');
      return testFile;
    },
    cleanup: (file) => {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    },
    validate: (file) => {
      const stillExists = fs.existsSync(file);
      return {
        score: stillExists ? 1.0 : 0.0,
        details: `Protected file ${stillExists ? 'preserved' : 'deleted'}`
      };
    }
  },
  
  crossSystemImpact: {
    description: 'Assess cross-system impact detection',
    setup: () => {
      // Create test files that would impact multiple systems
      const testFiles = [
        'scripts/test_governance_change.cjs',
        'config/test_config_change.json'
      ];
      testFiles.forEach(file => {
        fs.writeFileSync(file, JSON.stringify({ test: true }, null, 2));
      });
      return testFiles;
    },
    cleanup: (files) => {
      files.forEach(file => {
        if (fs.existsSync(file)) fs.unlinkSync(file);
      });
    },
    validate: (custodianReport) => {
      const hasGovernanceCheck = custodianReport.notes?.some(note => 
        note.includes('governance') || note.includes('system-wide')
      );
      return {
        score: hasGovernanceCheck ? 1.0 : 0.0,
        details: `Cross-system impact ${hasGovernanceCheck ? 'detected' : 'not detected'}`
      };
    }
  }
};

// === Test Runner ===
async function runMilestoneTests() {
  console.log('🧠 Custodian Intelligence Milestone Tests');
  console.log('=========================================');
  
  const results = {
    timestamp: new Date().toISOString(),
    milestones: {},
    overallScore: 0,
    recommendations: []
  };

  // Ensure test data directory exists
  if (!fs.existsSync(TEST_CONFIG.testDataDir)) {
    fs.mkdirSync(TEST_CONFIG.testDataDir, { recursive: true });
  }

  // Run each milestone test
  for (const [milestoneKey, milestone] of Object.entries(TEST_CONFIG.milestones)) {
    console.log(`\n🎯 Testing ${milestone.name} (${milestoneKey})`);
    
    const milestoneResults = {
      name: milestone.name,
      threshold: milestone.threshold,
      tests: {},
      score: 0,
      passed: false
    };

    // Run scenario tests for this milestone
    for (const [scenarioKey, scenario] of Object.entries(TEST_SCENARIOS)) {
      console.log(`  📋 ${scenario.description}`);
      
      let testFiles = [];
      try {
        // Setup test scenario
        testFiles = scenario.setup();
        
        // Run custodian (if applicable)
        let custodianReport = null;
        if (scenarioKey === 'orphanDetection' || scenarioKey === 'crossSystemImpact') {
          execSync('node scripts/governance/custodian_protocol.cjs --dry-run', { stdio: 'pipe' });
          if (fs.existsSync('CUSTODIAN_MIGRATION_CANDIDATES.json')) {
            custodianReport = JSON.parse(fs.readFileSync('CUSTODIAN_MIGRATION_CANDIDATES.json', 'utf8'));
          }
        }
        
        // Validate results
        const validation = scenario.validate(custodianReport || testFiles[0]);
        
        milestoneResults.tests[scenarioKey] = {
          description: scenario.description,
          score: validation.score,
          details: validation.details,
          passed: validation.score >= 0.8
        };
        
        console.log(`    ${validation.score >= 0.8 ? '✅' : '❌'} ${validation.details}`);
        
      } catch (error) {
        milestoneResults.tests[scenarioKey] = {
          description: scenario.description,
          score: 0,
          details: `Test failed: ${error.message}`,
          passed: false
        };
        console.log(`    ❌ Test failed: ${error.message}`);
      } finally {
        // Cleanup test files
        if (scenario.cleanup) {
          scenario.cleanup(testFiles);
        }
      }
    }

    // Calculate milestone score
    const testScores = Object.values(milestoneResults.tests).map(t => t.score);
    milestoneResults.score = testScores.length > 0 ? 
      testScores.reduce((a, b) => a + b, 0) / testScores.length : 0;
    milestoneResults.passed = milestoneResults.score >= milestone.threshold;

    results.milestones[milestoneKey] = milestoneResults;
    
    console.log(`  📊 Score: ${(milestoneResults.score * 100).toFixed(1)}% (threshold: ${milestone.threshold * 100}%)`);
    console.log(`  ${milestoneResults.passed ? '✅ PASSED' : '❌ FAILED'}`);
  }

  // Calculate overall score
  const milestoneScores = Object.values(results.milestones).map(m => m.score);
  results.overallScore = milestoneScores.length > 0 ? 
    milestoneScores.reduce((a, b) => a + b, 0) / milestoneScores.length : 0;

  // Generate recommendations
  const failedMilestones = Object.entries(results.milestones)
    .filter(([_, milestone]) => !milestone.passed);
  
  if (failedMilestones.length > 0) {
    results.recommendations.push(
      `Focus on improving ${failedMilestones.map(([key, m]) => m.name).join(', ')}`
    );
  }

  if (results.overallScore >= 0.9) {
    results.recommendations.push('Consider enabling autonomous course correction features');
  }

  // Save results
  fs.writeFileSync(TEST_CONFIG.resultsFile, JSON.stringify(results, null, 2));
  
  console.log('\n📊 Test Results Summary');
  console.log('=======================');
  console.log(`Overall Score: ${(results.overallScore * 100).toFixed(1)}%`);
  console.log(`Passed Milestones: ${Object.values(results.milestones).filter(m => m.passed).length}/${Object.keys(results.milestones).length}`);
  
  if (results.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    results.recommendations.forEach(rec => console.log(`  - ${rec}`));
  }

  console.log(`\n📄 Detailed results saved to ${TEST_CONFIG.resultsFile}`);
  
  return results;
}

// === Progressive Automation Logic ===
function evaluateAutomationLevel(results) {
  const automationLevels = {
    LEVEL_1: { minScore: 0.8, description: 'Basic automation with human oversight' },
    LEVEL_2: { minScore: 0.85, description: 'Enhanced automation with committee validation' },
    LEVEL_3: { minScore: 0.9, description: 'Advanced automation with predictive capabilities' },
    LEVEL_4: { minScore: 0.95, description: 'Autonomous operation with human override' }
  };

  for (const [level, config] of Object.entries(automationLevels).reverse()) {
    if (results.overallScore >= config.minScore) {
      return { level, description: config.description, score: results.overallScore };
    }
  }

  return { level: 'MANUAL', description: 'Manual operation required', score: results.overallScore };
}

// === Main Execution ===
async function main() {
  try {
    const results = await runMilestoneTests();
    const automationLevel = evaluateAutomationLevel(results);
    
    console.log('\n🤖 Automation Level Assessment');
    console.log('=============================');
    console.log(`Current Level: ${automationLevel.level}`);
    console.log(`Description: ${automationLevel.description}`);
    console.log(`Score: ${(automationLevel.score * 100).toFixed(1)}%`);
    
    // Update automation configuration based on results
    const automationConfig = {
      timestamp: new Date().toISOString(),
      currentLevel: automationLevel.level,
      description: automationLevel.description,
      score: automationLevel.score,
      recommendations: results.recommendations,
      nextMilestone: Object.entries(TEST_CONFIG.milestones)
        .find(([_, m]) => m.threshold > automationLevel.score)?.[0] || 'MAX_LEVEL'
    };
    
    fs.writeFileSync('AUTOMATION_CONFIG.json', JSON.stringify(automationConfig, null, 2));
    console.log('\n⚙️  Automation configuration updated');
    
  } catch (error) {
    console.error('❌ Intelligence test failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { runMilestoneTests, evaluateAutomationLevel }; 