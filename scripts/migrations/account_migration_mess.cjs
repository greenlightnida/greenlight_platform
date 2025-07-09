#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class MigrationMessAccountant {
  constructor() {
    this.projectRoot = process.cwd();
    this.reportPath = path.join(this.projectRoot, 'data', 'migrations', 'migration_mess_analysis.json');
    this.issues = [];
    this.recommendations = [];
    this.migrationPlan = null;
  }

  async analyzeMigrationMess() {
    console.log('🔍 Analyzing Migration Mess...');
    console.log('================================');

    // 1. Analyze current directory structure
    await this.analyzeDirectoryStructure();

    // 2. Check for symlinked directories
    await this.analyzeSymlinks();

    // 3. Check for duplicate documentation
    await this.analyzeDocumentationDuplication();

    // 4. Check for hardcoded references
    await this.analyzeHardcodedReferences();

    // 5. Check for mixed responsibilities
    await this.analyzeMixedResponsibilities();

    // 6. Check for missing context
    await this.analyzeMissingContext();

    // 7. Generate recommendations
    await this.generateRecommendations();

    // 8. Create migration plan
    await this.createMigrationPlan();

    // 9. Save analysis report
    await this.saveAnalysisReport();

    console.log('\n✅ Migration Mess Analysis Complete');
    console.log(`📄 Report saved to: ${this.reportPath}`);
  }

  async analyzeDirectoryStructure() {
    console.log('\n📁 Analyzing Directory Structure...');
    
    const currentStructure = {
      root: this.getDirectoryContents('.'),
      src: this.getDirectoryContents('src'),
      docs: this.getDirectoryContents('docs'),
      scripts: this.getDirectoryContents('scripts'),
      data: this.getDirectoryContents('data')
    };

    // Check for Top_Bins remnants
    const topBinsRemnants = [];
    Object.entries(currentStructure).forEach(([dir, contents]) => {
      contents.forEach(item => {
        if (item.includes('top_bins') || item.includes('Top_Bins')) {
          topBinsRemnants.push(`${dir}/${item}`);
        }
      });
    });

    if (topBinsRemnants.length > 0) {
      this.issues.push({
        type: 'top_bins_remnants',
        severity: 'high',
        description: 'Found Top_Bins remnants in directory structure',
        items: topBinsRemnants,
        impact: 'Confusion about ownership and responsibilities'
      });
    }

    // Check for missing expected directories
    const expectedDirs = ['src/core', 'src/protocols', 'data/sessions', 'data/migrations'];
    const missingDirs = expectedDirs.filter(dir => !fs.existsSync(path.join(this.projectRoot, dir)));
    
    if (missingDirs.length > 0) {
      this.issues.push({
        type: 'missing_directories',
        severity: 'medium',
        description: 'Missing expected directory structure',
        items: missingDirs,
        impact: 'Incomplete system organization'
      });
    }
  }

  async analyzeSymlinks() {
    console.log('\n🔗 Analyzing Symlinks...');
    
    const symlinks = [];
    const walkDir = (dir) => {
      try {
        const items = fs.readdirSync(dir);
        items.forEach(item => {
          const fullPath = path.join(dir, item);
          try {
            const stat = fs.lstatSync(fullPath);
            if (stat.isSymbolicLink()) {
              symlinks.push({
                path: fullPath,
                target: fs.readlinkSync(fullPath)
              });
            }
          } catch (err) {
            // Skip if can't read
          }
        });
      } catch (err) {
        // Skip if can't read directory
      }
    };

    walkDir(this.projectRoot);

    if (symlinks.length > 0) {
      this.issues.push({
        type: 'symlinks',
        severity: 'medium',
        description: 'Found symlinked directories',
        items: symlinks,
        impact: 'Confusion about file ownership and potential broken links'
      });
    }
  }

  async analyzeDocumentationDuplication() {
    console.log('\n📚 Analyzing Documentation Duplication...');
    
    const docsDir = path.join(this.projectRoot, 'docs');
    const docsTopBinsDir = path.join(this.projectRoot, 'docs_top_bins');
    
    const duplications = [];
    
    if (fs.existsSync(docsDir) && fs.existsSync(docsTopBinsDir)) {
      const docsFiles = this.getFilesRecursive(docsDir);
      const docsTopBinsFiles = this.getFilesRecursive(docsTopBinsDir);
      
      docsFiles.forEach(file => {
        const relativePath = path.relative(docsDir, file);
        const topBinsPath = path.join(docsTopBinsDir, relativePath);
        
        if (fs.existsSync(topBinsPath)) {
          duplications.push({
            greenlight: file,
            topBins: topBinsPath,
            relativePath
          });
        }
      });
    }

    if (duplications.length > 0) {
      this.issues.push({
        type: 'documentation_duplication',
        severity: 'medium',
        description: 'Found duplicate documentation files',
        items: duplications,
        impact: 'Confusion about which documentation is current'
      });
    }
  }

  async analyzeHardcodedReferences() {
    console.log('\n🔍 Analyzing Hardcoded References...');
    
    const hardcodedRefs = [];
    const searchPatterns = [
      'Top_Bins',
      'top_bins',
      'top-bins',
      'elevate-unified-sports-platform'
    ];

    const searchInFile = (filePath) => {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        searchPatterns.forEach(pattern => {
          if (content.includes(pattern)) {
            hardcodedRefs.push({
              file: filePath,
              pattern,
              context: content.substring(Math.max(0, content.indexOf(pattern) - 50), content.indexOf(pattern) + 50)
            });
          }
        });
      } catch (err) {
        // Skip if can't read file
      }
    };

    // Search in key files
    const keyFiles = [
      'package.json',
      'README.md',
      'tsconfig.json',
      'src/core/governance/RepositoryGovernor.ts',
      'src/core/governance/GovernanceOrchestrator.ts'
    ];

    keyFiles.forEach(file => {
      const filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        searchInFile(filePath);
      }
    });

    if (hardcodedRefs.length > 0) {
      this.issues.push({
        type: 'hardcoded_references',
        severity: 'high',
        description: 'Found hardcoded Top_Bins references',
        items: hardcodedRefs,
        impact: 'System not properly genericized for multiple repositories'
      });
    }
  }

  async analyzeMixedResponsibilities() {
    console.log('\n🏗️ Analyzing Mixed Responsibilities...');
    
    const mixedResponsibilities = [];
    
    // Check if system governance code is mixed with product code
    const systemComponents = [
      'src/core/governance',
      'src/core/protocols',
      'src/core/session-management'
    ];

    const productComponents = [
      'src/components/MediaLibrary',
      'src/components/PlayerGrid',
      'src/components/TeamPortal'
    ];

    // Check if both exist in same repository
    const hasSystemCode = systemComponents.some(comp => fs.existsSync(path.join(this.projectRoot, comp)));
    const hasProductCode = productComponents.some(comp => fs.existsSync(path.join(this.projectRoot, comp)));

    if (hasSystemCode && hasProductCode) {
      mixedResponsibilities.push({
        type: 'system_product_mix',
        description: 'System governance code mixed with product code',
        systemComponents: systemComponents.filter(comp => fs.existsSync(path.join(this.projectRoot, comp))),
        productComponents: productComponents.filter(comp => fs.existsSync(path.join(this.projectRoot, comp))),
        impact: 'Architectural confusion and unclear ownership'
      });
    }

    if (mixedResponsibilities.length > 0) {
      this.issues.push({
        type: 'mixed_responsibilities',
        severity: 'critical',
        description: 'Found mixed responsibilities in codebase',
        items: mixedResponsibilities,
        impact: 'Major architectural issues and confusion'
      });
    }
  }

  async analyzeMissingContext() {
    console.log('\n🧠 Analyzing Missing Context...');
    
    const missingContext = [];
    
    // Check for missing roadmap
    const roadmapPath = path.join(this.projectRoot, 'LIVING_ROADMAP.md');
    if (!fs.existsSync(roadmapPath)) {
      missingContext.push({
        type: 'missing_roadmap',
        description: 'Living roadmap not found in root directory',
        impact: 'No clear guidance on current priorities'
      });
    }

    // Check for missing session context
    const sessionsDir = path.join(this.projectRoot, 'data', 'sessions');
    if (!fs.existsSync(sessionsDir)) {
      missingContext.push({
        type: 'missing_sessions',
        description: 'Session management directory not found',
        impact: 'No session context preservation'
      });
    }

    // Check for missing changelog
    const changelogPath = path.join(this.projectRoot, 'CHANGELOG.md');
    if (!fs.existsSync(changelogPath)) {
      missingContext.push({
        type: 'missing_changelog',
        description: 'Main changelog not found',
        impact: 'No clear history of changes'
      });
    }

    if (missingContext.length > 0) {
      this.issues.push({
        type: 'missing_context',
        severity: 'high',
        description: 'Missing critical context files',
        items: missingContext,
        impact: 'Loss of context and history'
      });
    }
  }

  async generateRecommendations() {
    console.log('\n💡 Generating Recommendations...');
    
    this.issues.forEach(issue => {
      switch (issue.type) {
        case 'top_bins_remnants':
          this.recommendations.push({
            priority: 'critical',
            action: 'Remove all Top_Bins remnants',
            description: 'Clean up all Top_Bins references and symlinks',
            steps: [
              'Remove symlinked directories',
              'Update hardcoded references',
              'Consolidate duplicate documentation'
            ]
          });
          break;

        case 'mixed_responsibilities':
          this.recommendations.push({
            priority: 'critical',
            action: 'Separate system and product code',
            description: 'Create clear separation between governance and product code',
            steps: [
              'Move system governance to Greenlight Platform',
              'Keep product code in Top_Bins',
              'Establish clear API contracts'
            ]
          });
          break;

        case 'missing_context':
          this.recommendations.push({
            priority: 'high',
            action: 'Restore missing context',
            description: 'Recreate missing context files and directories',
            steps: [
              'Create proper session management',
              'Restore roadmap to root directory',
              'Consolidate changelogs'
            ]
          });
          break;

        case 'hardcoded_references':
          this.recommendations.push({
            priority: 'high',
            action: 'Genericize system',
            description: 'Remove hardcoded references to make system generic',
            steps: [
              'Update package.json names',
              'Genericize governance components',
              'Create configuration system'
            ]
          });
          break;
      }
    });
  }

  async createMigrationPlan() {
    console.log('\n📋 Creating Migration Plan...');
    
    this.migrationPlan = {
      name: 'Greenlight Platform Consolidation and Cleanup',
      description: 'Fix all migration mess and establish proper system architecture',
      type: 'consolidation',
      priority: 'critical',
      estimatedDuration: '2-3 weeks',
      phases: [
        {
          name: 'Phase 1: Context Restoration',
          description: 'Restore missing context and fix immediate issues',
          tasks: [
            'Create proper session management structure',
            'Restore roadmap to root directory',
            'Consolidate duplicate documentation',
            'Fix symlink issues'
          ],
          estimatedDuration: '3-5 days'
        },
        {
          name: 'Phase 2: System Genericization',
          description: 'Make system generic and remove hardcoded references',
          tasks: [
            'Update package.json and configuration',
            'Genericize governance components',
            'Create configuration system',
            'Remove Top_Bins hardcoding'
          ],
          estimatedDuration: '5-7 days'
        },
        {
          name: 'Phase 3: Architecture Cleanup',
          description: 'Establish proper separation of concerns',
          tasks: [
            'Separate system governance from product code',
            'Create clear API contracts',
            'Establish proper directory structure',
            'Update all import paths'
          ],
          estimatedDuration: '7-10 days'
        },
        {
          name: 'Phase 4: Validation and Testing',
          description: 'Ensure everything works correctly',
          tasks: [
            'Run comprehensive tests',
            'Validate all integrations',
            'Test session management',
            'Verify governance system'
          ],
          estimatedDuration: '3-5 days'
        }
      ],
      safetyChecks: [
        'roadmap-current',
        'session-manager-available',
        'git-clean',
        'tests-passing',
        'backup-available'
      ],
      rollbackPlan: 'Restore from git history and backup if issues occur'
    };
  }

  async saveAnalysisReport() {
    const report = {
      timestamp: new Date().toISOString(),
      sessionId: `analysis-${Date.now()}`,
      summary: {
        totalIssues: this.issues.length,
        criticalIssues: this.issues.filter(i => i.severity === 'critical').length,
        highIssues: this.issues.filter(i => i.severity === 'high').length,
        mediumIssues: this.issues.filter(i => i.severity === 'medium').length
      },
      issues: this.issues,
      recommendations: this.recommendations,
      migrationPlan: this.migrationPlan
    };

    // Ensure directory exists
    const reportDir = path.dirname(this.reportPath);
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    fs.writeFileSync(this.reportPath, JSON.stringify(report, null, 2));
  }

  getDirectoryContents(dir) {
    try {
      return fs.readdirSync(path.join(this.projectRoot, dir));
    } catch (err) {
      return [];
    }
  }

  getFilesRecursive(dir) {
    const files = [];
    try {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          files.push(...this.getFilesRecursive(fullPath));
        } else {
          files.push(fullPath);
        }
      });
    } catch (err) {
      // Skip if can't read
    }
    return files;
  }

  printSummary() {
    console.log('\n📊 Migration Mess Analysis Summary');
    console.log('==================================');
    
    console.log(`\n🚨 Issues Found: ${this.issues.length}`);
    this.issues.forEach(issue => {
      console.log(`  ${issue.severity.toUpperCase()}: ${issue.description} (${issue.items?.length || 0} items)`);
    });

    console.log(`\n💡 Recommendations: ${this.recommendations.length}`);
    this.recommendations.forEach(rec => {
      console.log(`  ${rec.priority.toUpperCase()}: ${rec.action}`);
    });

    if (this.migrationPlan) {
      console.log(`\n📋 Migration Plan: ${this.migrationPlan.name}`);
      console.log(`   Duration: ${this.migrationPlan.estimatedDuration}`);
      console.log(`   Phases: ${this.migrationPlan.phases.length}`);
    }
  }
}

// Run the analysis
async function main() {
  const accountant = new MigrationMessAccountant();
  await accountant.analyzeMigrationMess();
  accountant.printSummary();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = MigrationMessAccountant; 