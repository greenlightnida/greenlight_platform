#!/usr/bin/env node

/**
 * Boundary Enforcement Manager v1.0.0
 * 
 * PURPOSE: Constantly monitors and enforces boundaries between Top_Bins and greenlight-platform
 * - Real-time scanning for boundary violations
 * - Automatic flagging and reporting of misplaced code
 * - Proactive enforcement of repository separation
 * - Integration with existing prevention systems
 * - Continuous monitoring and alerting
 * 
 * USAGE: node scripts/protocols/boundary_enforcement_manager.cjs [--watch] [--enforce]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PRODUCT_HOLONS = ['elevate', 'anotherproduct', 'sampleproduct']; // Add all product holon names here
function isProductHolonViolation(filePath) {
  const allowedDirs = [
    path.join(process.cwd(), 'src', 'components'),
    path.join(process.cwd(), 'src', 'dashboards', 'product'),
    path.join(process.cwd(), 'src', 'platforms', 'greenlight-platform', 'team'),
    path.join(process.cwd(), 'Top_Bins'),
    path.join(process.cwd(), 'top_bins', 'product')
  ];
  const lowerPath = filePath.toLowerCase();
  return PRODUCT_HOLONS.some(holon => lowerPath.includes(holon)) && !allowedDirs.some(dir => filePath.startsWith(dir));
}

class BoundaryEnforcementManager {
  constructor() {
    this.projectRoot = process.cwd();
    this.sessionId = `boundary-${Date.now()}`;
    this.violations = [];
    this.recommendations = [];
    this.actions = [];
    
    // Boundary definitions
    this.boundaries = {
      greenlightPlatform: {
        allowed: [
          'system governance',
          'holon architecture', 
          'monitoring',
          'protocols',
          'session management',
          'migrations',
          'api gateway',
          'documentation',
          'knowledge management',
          'workflow management',
          'system evolution',
          'governance orchestration',
          'repository governance',
          'policy enforcement',
          'alerting'
        ],
        forbidden: [
          'player data',
          'coaching workflows',
          'business intelligence',
          'executive oversight',
          'product features',
          'client-specific functionality',
          'Top_Bins specific code'
        ]
      },
      topBins: {
        allowed: [
          'player data',
          'coaching workflows', 
          'business intelligence',
          'executive oversight',
          'product features',
          'client-specific functionality',
          'elevate holon',
          'administrate holon'
        ],
        forbidden: [
          'system governance',
          'holon architecture',
          'monitoring',
          'protocols',
          'session management',
          'migrations',
          'api gateway',
          'documentation',
          'knowledge management',
          'workflow management',
          'system evolution',
          'governance orchestration',
          'repository governance',
          'policy enforcement',
          'alerting'
        ]
      }
    };

    // Top Bins code patterns (more specific than prevention system)
    this.topBinsPatterns = [
      // Component patterns
      'PlayerCard',
      'PlayerGrid', 
      'MediaLibrary',
      'TeamPortal',
      'PlayerProfile',
      'PlayerStats',
      'PlayerProgress',
      'PlayerAssessment',
      'PlayerReport',
      'PlayerDashboard',
      
      // Data patterns
      'playerData',
      'playerStats',
      'playerProgress',
      'playerAssessment',
      'playerReport',
      'playerProfile',
      'playerHistory',
      'playerMetrics',
      'playerAnalytics',
      'playerInsights',
      
      // Business patterns
      'coachingSession',
      'coachingWorkflow',
      'coachingAssessment',
      'coachingReport',
      'coachingProgress',
      'coachingMetrics',
      'coachingAnalytics',
      'coachingInsights',
      'coachingRecommendations',
      'coachingGoals',
      
      // Executive patterns
      'executiveDashboard',
      'executiveReport',
      'executiveMetrics',
      'executiveAnalytics',
      'executiveInsights',
      'executiveOverview',
      'executiveSummary',
      'executiveTrends',
      'executiveForecast',
      'executiveRecommendations',
      
      // File patterns
      'csv',
      'player',
      'jersey',
      'detection',
      'coaching',
      'assessment',
      'progress',
      'metrics',
      'analytics',
      'insights'
    ];

    // Greenlight Platform patterns
    this.greenlightPatterns = [
      // System patterns
      'SystemMaster',
      'GovernanceOrchestrator',
      'RepositoryGovernor',
      'PolicyEngine',
      'AlertManager',
      'SessionManager',
      'MigrationsManager',
      'ProtocolManager',
      'APIGraphManager',
      'SystemEvolutionManager',
      'ElaborateManager',
      'ArticulateManager',
      'KnowledgeManager',
      'WorkManager',
      
      // Governance patterns
      'governance',
      'policy',
      'compliance',
      'audit',
      'monitoring',
      'orchestration',
      'coordination',
      'enforcement',
      'validation',
      'verification',
      
      // System patterns
      'protocol',
      'session',
      'migration',
      'api',
      'graph',
      'evolution',
      'elaborate',
      'articulate',
      'knowledge',
      'workflow',
      
      // File patterns
      'system',
      'governance',
      'protocol',
      'session',
      'migration',
      'api',
      'graph',
      'evolution',
      'elaborate',
      'articulate',
      'knowledge',
      'workflow'
    ];
  }

  async runBoundaryEnforcement() {
    console.log('🛡️ Boundary Enforcement Manager v1.0.0');
    console.log('=====================================');
    console.log(`Session ID: ${this.sessionId}`);
    console.log('Running comprehensive boundary enforcement...');
    console.log('');

    try {
      // Phase 1: Scan for Top Bins code in greenlight-platform
      await this.scanForTopBinsCode();
      
      // Phase 2: Scan for greenlight-platform code in Top_Bins
      await this.scanForGreenlightCode();
      
      // Phase 3: Analyze file organization
      await this.analyzeFileOrganization();
      
      // Phase 4: Generate enforcement report
      await this.generateEnforcementReport();
      
      // Phase 5: Take enforcement actions (if --enforce flag)
      if (process.argv.includes('--enforce')) {
        await this.takeEnforcementActions();
      }
      
      console.log('');
      console.log('✅ Boundary Enforcement Complete');
      console.log(`📊 Violations Found: ${this.violations.length}`);
      console.log(`💡 Recommendations: ${this.recommendations.length}`);
      console.log(`⚡ Actions Taken: ${this.actions.length}`);
      
    } catch (error) {
      console.error('❌ Boundary Enforcement Failed:', error.message);
      this.logError(error);
      return false;
    }
  }

  async scanForTopBinsCode() {
    console.log('🔍 Phase 1: Scanning for Top Bins code in greenlight-platform');
    
    const srcPath = path.join(this.projectRoot, 'src');
    const platformsPath = path.join(this.projectRoot, 'platforms');
    
    if (fs.existsSync(srcPath)) {
      const violations = this.findTopBinsCode(srcPath, this.topBinsPatterns);
      
      for (const violation of violations) {
        this.violations.push({
          type: 'top_bins_in_greenlight',
          file: violation,
          severity: 'high',
          description: 'Top Bins code found in greenlight-platform',
          recommendation: 'Move to Top_Bins repository or refactor to system governance'
        });
        
        this.recommendations.push({
          type: 'move_file',
          file: violation,
          destination: 'Top_Bins repository',
          reason: 'Product-specific code should be in Top_Bins'
        });
      }
    }
    
    if (fs.existsSync(platformsPath)) {
      const violations = this.findTopBinsCode(platformsPath, this.topBinsPatterns);
      
      for (const violation of violations) {
        this.violations.push({
          type: 'top_bins_in_platforms',
          file: violation,
          severity: 'medium',
          description: 'Top Bins code found in platforms directory',
          recommendation: 'Review if this should be in Top_Bins or refactored'
        });
      }
    }
  }

  async scanForGreenlightCode() {
    console.log('🔍 Phase 2: Scanning for greenlight-platform code in Top_Bins');
    
    // This would scan the Top_Bins repository if it exists
    // For now, we'll check if there are any references to greenlight patterns
    const srcPath = path.join(this.projectRoot, 'src');
    
    if (fs.existsSync(srcPath)) {
      const violations = this.findGreenlightCode(srcPath, this.greenlightPatterns);
      
      for (const violation of violations) {
        this.violations.push({
          type: 'greenlight_in_top_bins',
          file: violation,
          severity: 'medium',
          description: 'Greenlight platform code found in Top_Bins',
          recommendation: 'Review if this should be in greenlight-platform'
        });
      }
    }
  }

  async analyzeFileOrganization() {
    console.log('📁 Phase 3: Analyzing file organization');
    
    // Check for proper directory structure
    const expectedDirs = [
      'src/core/holons/systemMaster',
      'src/core/holons/elaborate', 
      'src/core/holons/articulate',
      'src/core/governance',
      'src/core/protocols',
      'src/core/session-management',
      'src/core/migrations',
      'src/api-gateway'
    ];
    
    for (const dir of expectedDirs) {
      const dirPath = path.join(this.projectRoot, dir);
      if (!fs.existsSync(dirPath)) {
        this.recommendations.push({
          type: 'create_directory',
          path: dir,
          reason: 'Expected system governance directory structure'
        });
      }
    }
    
    // Check for misplaced files
    const misplacedFiles = this.findMisplacedFiles();
    for (const file of misplacedFiles) {
      this.violations.push({
        type: 'misplaced_file',
        file: file.path,
        severity: 'low',
        description: 'File appears to be in wrong location',
        recommendation: file.recommendation
      });
    }
  }

  findTopBinsCode(directory, patterns) {
    const violations = [];
    
    function scanDir(dir) {
      if (!fs.existsSync(dir)) return;
      
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          scanDir(fullPath);
        } else if (stat.isFile() && /\.(js|ts|tsx)$/.test(item)) {
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            
            for (const pattern of patterns) {
              if (content.includes(pattern)) {
                violations.push(fullPath);
                break;
              }
            }
          } catch (error) {
            // Skip files that can't be read
          }
        }
      }
    }
    
    scanDir(directory);
    return violations;
  }

  findGreenlightCode(directory, patterns) {
    const violations = [];
    
    function scanDir(dir) {
      if (!fs.existsSync(dir)) return;
      
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          scanDir(fullPath);
        } else if (stat.isFile() && /\.(js|ts|tsx)$/.test(item)) {
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            
            for (const pattern of patterns) {
              if (content.includes(pattern)) {
                violations.push(fullPath);
                break;
              }
            }
          } catch (error) {
            // Skip files that can't be read
          }
        }
      }
    }
    
    scanDir(directory);
    return violations;
  }

  findMisplacedFiles() {
    const misplaced = [];
    
    // Check for Top Bins components in wrong locations
    const topBinsComponents = [
      'PlayerCard',
      'PlayerGrid',
      'MediaLibrary',
      'TeamPortal'
    ];
    
    const srcPath = path.join(this.projectRoot, 'src');
    if (fs.existsSync(srcPath)) {
      function scanDir(dir) {
        const items = fs.readdirSync(dir);
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            scanDir(fullPath);
          } else if (stat.isFile() && /\.(tsx|ts)$/.test(item)) {
            try {
              const content = fs.readFileSync(fullPath, 'utf8');
              
              for (const component of topBinsComponents) {
                if (content.includes(component) && !fullPath.includes('platforms')) {
                  misplaced.push({
                    path: fullPath,
                    recommendation: `Move ${component} component to Top_Bins repository`
                  });
                }
              }
            } catch (error) {
              // Skip files that can't be read
            }
          }
        }
      }
      
      scanDir(srcPath);
    }
    
    return misplaced;
  }

  async generateEnforcementReport() {
    console.log('📊 Phase 4: Generating enforcement report');
    
    const report = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      summary: {
        violations: this.violations.length,
        recommendations: this.recommendations.length,
        actions: this.actions.length
      },
      violations: this.violations,
      recommendations: this.recommendations,
      actions: this.actions,
      boundaries: this.boundaries,
      patterns: {
        topBins: this.topBinsPatterns,
        greenlight: this.greenlightPatterns
      }
    };
    
    const reportPath = path.join(this.projectRoot, 'BOUNDARY_ENFORCEMENT_REPORT.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📄 Report saved to: ${reportPath}`);
  }

  async takeEnforcementActions() {
    console.log('⚡ Phase 5: Taking enforcement actions');
    
    for (const recommendation of this.recommendations) {
      if (recommendation.type === 'move_file') {
        try {
          // Create backup
          const backupPath = recommendation.file + '.boundary-backup';
          fs.copyFileSync(recommendation.file, backupPath);
          
          // Log the action
          this.actions.push({
            type: 'file_backup',
            file: recommendation.file,
            backup: backupPath,
            timestamp: new Date().toISOString()
          });
          
          console.log(`💾 Backed up: ${recommendation.file}`);
        } catch (error) {
          console.error(`❌ Failed to backup ${recommendation.file}:`, error.message);
        }
      }
    }
  }

  logError(error) {
    const errorLog = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack
    };
    
    const errorPath = path.join(this.projectRoot, 'BOUNDARY_ENFORCEMENT_ERROR.json');
    fs.writeFileSync(errorPath, JSON.stringify(errorLog, null, 2));
  }
}

// Main execution
function main() {
  const manager = new BoundaryEnforcementManager();
  
  if (process.argv.includes('--watch')) {
    console.log('👀 Starting continuous boundary monitoring...');
    // Set up file watching for continuous monitoring
    setInterval(() => {
      manager.runBoundaryEnforcement();
    }, 30000); // Check every 30 seconds
  } else {
    manager.runBoundaryEnforcement();
  }
}

main(); 