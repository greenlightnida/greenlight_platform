/**
 * Data Cleanup Utility for Data Holon
 * 
 * PURPOSE: Remove all mock data, placeholders, and temporary content
 * - Identify mock data patterns
 * - Remove placeholder implementations
 * - Clean up TODO comments
 * - Replace with proper implementations or remove entirely
 */

import * as fs from 'fs';
import * as path from 'path';

interface CleanupIssue {
  pattern: string;
  matches: number;
  lines: number[];
}

interface FileIssues {
  file: string;
  mockData: CleanupIssue[];
  placeholders: CleanupIssue[];
  dummyFunctions: CleanupIssue[];
  dummyValues: CleanupIssue[];
  totalIssues: number;
}

interface CleanupPlan {
  summary: {
    totalFiles: number;
    filesWithIssues: number;
    totalIssues: number;
    mockDataIssues: number;
    placeholderIssues: number;
    dummyFunctionIssues: number;
    dummyValueIssues: number;
  };
  files: Array<{
    file: string;
    issues: {
      mockData: CleanupIssue[];
      placeholders: CleanupIssue[];
      dummyFunctions: CleanupIssue[];
      dummyValues: CleanupIssue[];
    };
    totalIssues: number;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
  }>;
}

export class DataCleanupManager {
  private readonly dummyPatterns = {
    mockData: [
      /\/\/ Mock data/gi,
      /\/\/ Mock.*data/gi,
      /generateSample/gi,
      /getMock/gi,
      /mock.*data/gi,
      /sample.*data/gi,
      /placeholder.*data/gi
    ],
    placeholders: [
      /\/\/ TODO:/gi,
      /\/\/ FIXME:/gi,
      /\/\/ placeholder/gi,
      /\/\/ temporary/gi,
      /placeholder.*implementation/gi,
      /temporary.*implementation/gi
    ],
    dummyFunctions: [
      /generateSample\w+/gi,
      /getMock\w+/gi,
      /createMock\w+/gi,
      /mock\w+Data/gi,
      /sample\w+Data/gi
    ],
    dummyValues: [
      /'placeholder'/gi,
      /"placeholder"/gi,
      /'temporary'/gi,
      /"temporary"/gi,
      /'mock'/gi,
      /"mock"/gi,
      /'sample'/gi,
      /"sample"/gi
    ]
  };

  private readonly scanPaths = [
    'src/**/*.ts',
    'src/**/*.tsx',
    'src/**/*.js',
    'src/**/*.jsx',
    'frontend/src/**/*.ts',
    'frontend/src/**/*.tsx',
    'backend/src/**/*.ts',
    'backend/src/**/*.js'
  ];

  private readonly excludePatterns = [
    'node_modules',
    'dist',
    'build',
    '.git',
    '*.test.ts',
    '*.spec.ts',
    '*.stories.tsx'
  ];

  async analyzeCodebase(): Promise<CleanupPlan> {
    console.log('🔍 Scanning for dummy data and placeholders...');
    
    const files = this.findFiles('.', ['*.ts', '*.tsx', '*.js', '*.jsx'], this.excludePatterns);
    console.log(`Found ${files.length} files to analyze`);
    
    const issues = files.map(file => this.analyzeFile(file));
    return this.generateCleanupPlan(issues);
  }

  private findFiles(dir: string, patterns: string[], excludes: string[]): string[] {
    const files: string[] = [];
    
    const scanDirectory = (currentDir: string) => {
      try {
        const items = fs.readdirSync(currentDir);
        
        for (const item of items) {
          const fullPath = path.join(currentDir, item);
          const stat = fs.statSync(fullPath);
          
          // Skip excluded patterns
          const shouldExclude = excludes.some(pattern => {
            if (pattern.includes('*')) {
              const regex = new RegExp(pattern.replace(/\*/g, '.*'));
              return regex.test(item);
            }
            return fullPath.includes(pattern);
          });
          
          if (shouldExclude) continue;
          
          if (stat.isDirectory()) {
            scanDirectory(fullPath);
          } else if (stat.isFile()) {
            const shouldInclude = patterns.some(pattern => {
              if (pattern.includes('*')) {
                const regex = new RegExp(pattern.replace(/\*/g, '.*'));
                return regex.test(item);
              }
              return item.includes(pattern);
            });
            
            if (shouldInclude) {
              files.push(fullPath);
            }
          }
        }
      } catch (error) {
        console.warn(`Warning: Could not scan directory ${currentDir}:`, error);
      }
    };
    
    scanDirectory(dir);
    return files;
  }

  private analyzeFile(filePath: string): FileIssues {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const issues: FileIssues = {
        file: filePath,
        mockData: [],
        placeholders: [],
        dummyFunctions: [],
        dummyValues: [],
        totalIssues: 0
      };
      
      // Check for mock data patterns
      this.dummyPatterns.mockData.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
          issues.mockData.push({
            pattern: pattern.source,
            matches: matches.length,
            lines: this.getLineNumbers(content, pattern)
          });
        }
      });
      
      // Check for placeholder patterns
      this.dummyPatterns.placeholders.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
          issues.placeholders.push({
            pattern: pattern.source,
            matches: matches.length,
            lines: this.getLineNumbers(content, pattern)
          });
        }
      });
      
      // Check for dummy function patterns
      this.dummyPatterns.dummyFunctions.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
          issues.dummyFunctions.push({
            pattern: pattern.source,
            matches: matches.length,
            lines: this.getLineNumbers(content, pattern)
          });
        }
      });
      
      // Check for dummy value patterns
      this.dummyPatterns.dummyValues.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
          issues.dummyValues.push({
            pattern: pattern.source,
            matches: matches.length,
            lines: this.getLineNumbers(content, pattern)
          });
        }
      });
      
      issues.totalIssues = issues.mockData.length + issues.placeholders.length + 
                          issues.dummyFunctions.length + issues.dummyValues.length;
      
      return issues;
    } catch (error) {
      console.warn(`Warning: Could not analyze file ${filePath}:`, error);
      return { file: filePath, mockData: [], placeholders: [], dummyFunctions: [], dummyValues: [], totalIssues: 0 };
    }
  }

  private getLineNumbers(content: string, pattern: RegExp): number[] {
    const lines = content.split('\n');
    const lineNumbers: number[] = [];
    
    lines.forEach((line, index) => {
      if (pattern.test(line)) {
        lineNumbers.push(index + 1);
      }
    });
    
    return lineNumbers;
  }

  private generateCleanupPlan(issues: FileIssues[]): CleanupPlan {
    const plan: CleanupPlan = {
      summary: {
        totalFiles: issues.length,
        filesWithIssues: issues.filter(i => i.totalIssues > 0).length,
        totalIssues: issues.reduce((sum, i) => sum + i.totalIssues, 0),
        mockDataIssues: issues.reduce((sum, i) => sum + i.mockData.length, 0),
        placeholderIssues: issues.reduce((sum, i) => sum + i.placeholders.length, 0),
        dummyFunctionIssues: issues.reduce((sum, i) => sum + i.dummyFunctions.length, 0),
        dummyValueIssues: issues.reduce((sum, i) => sum + i.dummyValues.length, 0)
      },
      files: issues.filter(i => i.totalIssues > 0).map(issue => ({
        file: issue.file,
        issues: {
          mockData: issue.mockData,
          placeholders: issue.placeholders,
          dummyFunctions: issue.dummyFunctions,
          dummyValues: issue.dummyValues
        },
        totalIssues: issue.totalIssues,
        priority: issue.totalIssues > 5 ? 'HIGH' : issue.totalIssues > 2 ? 'MEDIUM' : 'LOW'
      }))
    };
    
    return plan;
  }

  printCleanupPlan(plan: CleanupPlan): void {
    console.log('🧹 DUMMY DATA CLEANUP PLAN');
    console.log('='.repeat(80));
    
    console.log('📊 SUMMARY:');
    console.log(`   Total Files Scanned: ${plan.summary.totalFiles}`);
    console.log(`   Files with Issues: ${plan.summary.filesWithIssues}`);
    console.log(`   Total Issues Found: ${plan.summary.totalIssues}`);
    console.log('');
    
    console.log('🔍 ISSUE BREAKDOWN:');
    console.log(`   Mock Data: ${plan.summary.mockDataIssues}`);
    console.log(`   Placeholders: ${plan.summary.placeholderIssues}`);
    console.log(`   Dummy Functions: ${plan.summary.dummyFunctionIssues}`);
    console.log(`   Dummy Values: ${plan.summary.dummyValueIssues}`);
    console.log('');
    
    // High priority files
    const highPriority = plan.files.filter(f => f.priority === 'HIGH');
    if (highPriority.length > 0) {
      console.log('🚨 HIGH PRIORITY FILES:');
      console.log('-'.repeat(40));
      highPriority.forEach(file => {
        console.log(`   ${file.file} (${file.totalIssues} issues)`);
      });
      console.log('');
    }
    
    // Medium priority files
    const mediumPriority = plan.files.filter(f => f.priority === 'MEDIUM');
    if (mediumPriority.length > 0) {
      console.log('⚠️  MEDIUM PRIORITY FILES:');
      console.log('-'.repeat(40));
      mediumPriority.forEach(file => {
        console.log(`   ${file.file} (${file.totalIssues} issues)`);
      });
      console.log('');
    }
    
    // Low priority files
    const lowPriority = plan.files.filter(f => f.priority === 'LOW');
    if (lowPriority.length > 0) {
      console.log('📝 LOW PRIORITY FILES:');
      console.log('-'.repeat(40));
      lowPriority.forEach(file => {
        console.log(`   ${file.file} (${file.totalIssues} issues)`);
      });
      console.log('');
    }
  }

  async executeCleanup(plan: CleanupPlan): Promise<number> {
    console.log('🚀 Executing cleanup...');
    let cleanedFiles = 0;
    
    for (const file of plan.files) {
      if (await this.cleanupFile(file.file, file.issues)) {
        cleanedFiles++;
      }
    }
    
    console.log(`✅ Cleanup completed: ${cleanedFiles} files cleaned`);
    return cleanedFiles;
  }

  private async cleanupFile(filePath: string, issues: any): Promise<boolean> {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;
      
      // Remove mock data comments
      issues.mockData.forEach((issue: CleanupIssue) => {
        const pattern = new RegExp(issue.pattern, 'gi');
        content = content.replace(pattern, '');
        modified = true;
      });
      
      // Remove placeholder comments
      issues.placeholders.forEach((issue: CleanupIssue) => {
        const pattern = new RegExp(issue.pattern, 'gi');
        content = content.replace(pattern, '');
        modified = true;
      });
      
      // Remove dummy function calls
      issues.dummyFunctions.forEach((issue: CleanupIssue) => {
        const pattern = new RegExp(issue.pattern, 'gi');
        content = content.replace(pattern, '');
        modified = true;
      });
      
      // Remove dummy values
      issues.dummyValues.forEach((issue: CleanupIssue) => {
        const pattern = new RegExp(issue.pattern, 'gi');
        content = content.replace(pattern, '');
        modified = true;
      });
      
      if (modified) {
        fs.writeFileSync(filePath, content);
        console.log(`✅ Cleaned: ${filePath}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.warn(`Warning: Could not cleanup file ${filePath}:`, error);
      return false;
    }
  }

  async savePlan(plan: CleanupPlan, outputPath: string = 'data/reports/dummy-data-cleanup-plan.json'): Promise<void> {
    try {
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(outputPath, JSON.stringify(plan, null, 2));
      console.log(`📄 Cleanup plan saved to: ${outputPath}`);
    } catch (error) {
      console.error('❌ Failed to save cleanup plan:', error);
    }
  }
}

// CLI interface for direct usage
if (require.main === module) {
  const cleanupManager = new DataCleanupManager();
  
  const args = process.argv.slice(2);
  const isExecute = args.includes('--execute');
  const isDryRun = args.includes('--dry-run');
  
  (async () => {
    try {
      const plan = await cleanupManager.analyzeCodebase();
      cleanupManager.printCleanupPlan(plan);
      await cleanupManager.savePlan(plan);
      
      if (isExecute) {
        await cleanupManager.executeCleanup(plan);
      } else if (!isDryRun) {
        console.log('\n⚠️  WARNING: This will modify files. Review the plan first.');
        console.log('Run with --execute flag to perform cleanup: node src/holons/data/data-cleanup.ts --execute');
      }
    } catch (error) {
      console.error('❌ Cleanup analysis failed:', error);
      process.exit(1);
    }
  })();
} 