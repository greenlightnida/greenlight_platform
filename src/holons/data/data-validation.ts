/**
 * Data Validation Utility for Data Holon
 * 
 * PURPOSE: Validate data integrity, structure, and quality
 * - Schema validation
 * - Data type checking
 * - Consistency verification
 * - Quality metrics
 */

import * as fs from 'fs';
import * as path from 'path';

interface ValidationRule {
  name: string;
  description: string;
  validator: (data: any) => boolean;
  severity: 'ERROR' | 'WARNING' | 'INFO';
}

interface ValidationResult {
  rule: string;
  passed: boolean;
  message: string;
  severity: 'ERROR' | 'WARNING' | 'INFO';
  details?: any;
}

interface ValidationReport {
  timestamp: string;
  totalRules: number;
  passed: number;
  failed: number;
  errors: ValidationResult[];
  warnings: ValidationResult[];
  info: ValidationResult[];
  summary: {
    overall: 'PASS' | 'FAIL' | 'WARNING';
    errorCount: number;
    warningCount: number;
    infoCount: number;
  };
}

export class DataValidationManager {
  private validationRules: ValidationRule[] = [];

  constructor() {
    this.initializeValidationRules();
  }

  private initializeValidationRules(): void {
    // JSON Structure Validation
    this.validationRules.push({
      name: 'json_structure_valid',
      description: 'Validate JSON structure integrity',
      validator: (data: any) => {
        try {
          if (typeof data === 'string') {
            JSON.parse(data);
          } else {
            JSON.stringify(data);
          }
          return true;
        } catch {
          return false;
        }
      },
      severity: 'ERROR'
    });

    // Required Fields Validation
    this.validationRules.push({
      name: 'required_fields_present',
      description: 'Check for required fields in data structures',
      validator: (data: any) => {
        if (typeof data !== 'object' || data === null) return false;
        
        // Check for common required fields
        const requiredFields = ['id', 'timestamp', 'type'];
        return requiredFields.some(field => data.hasOwnProperty(field));
      },
      severity: 'WARNING'
    });

    // Data Type Validation
    this.validationRules.push({
      name: 'data_types_valid',
      description: 'Validate data types match expected schema',
      validator: (data: any) => {
        if (typeof data !== 'object' || data === null) return true;
        
        // Check common field types
        if (data.id && typeof data.id !== 'string' && typeof data.id !== 'number') return false;
        if (data.timestamp && typeof data.timestamp !== 'string') return false;
        if (data.type && typeof data.type !== 'string') return false;
        
        return true;
      },
      severity: 'ERROR'
    });

    // Timestamp Format Validation
    this.validationRules.push({
      name: 'timestamp_format_valid',
      description: 'Validate timestamp format (ISO 8601)',
      validator: (data: any) => {
        if (!data.timestamp) return true;
        
        const timestamp = data.timestamp;
        const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
        return isoRegex.test(timestamp);
      },
      severity: 'WARNING'
    });

    // Data Consistency Validation
    this.validationRules.push({
      name: 'data_consistency_valid',
      description: 'Check for data consistency across related fields',
      validator: (data: any) => {
        if (typeof data !== 'object' || data === null) return true;
        
        // Check for logical consistency
        if (data.startDate && data.endDate) {
          const start = new Date(data.startDate);
          const end = new Date(data.endDate);
          return start <= end;
        }
        
        return true;
      },
      severity: 'WARNING'
    });

    // File Size Validation
    this.validationRules.push({
      name: 'file_size_reasonable',
      description: 'Check if file sizes are within reasonable limits',
      validator: (data: any) => {
        if (data.fileSize) {
          const sizeInMB = data.fileSize / (1024 * 1024);
          return sizeInMB <= 100; // 100MB limit
        }
        return true;
      },
      severity: 'INFO'
    });

    // Data Completeness Validation
    this.validationRules.push({
      name: 'data_completeness_valid',
      description: 'Check for data completeness and non-empty values',
      validator: (data: any) => {
        if (typeof data !== 'object' || data === null) return true;
        
        // Check for empty or null values in important fields
        const importantFields = ['id', 'name', 'title', 'description'];
        for (const field of importantFields) {
          if (data.hasOwnProperty(field) && (data[field] === null || data[field] === undefined || data[field] === '')) {
            return false;
          }
        }
        
        return true;
      },
      severity: 'WARNING'
    });
  }

  async validateDataFile(filePath: string): Promise<ValidationReport> {
    console.log(`🔍 Validating data file: ${filePath}`);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);
      
      return this.validateData(data, filePath);
    } catch (error) {
      console.error(`❌ Failed to read/parse file ${filePath}:`, error);
      
      return {
        timestamp: new Date().toISOString(),
        totalRules: 0,
        passed: 0,
        failed: 1,
        errors: [{
          rule: 'file_readable',
          passed: false,
          message: `Failed to read or parse file: ${error}`,
          severity: 'ERROR'
        }],
        warnings: [],
        info: [],
        summary: {
          overall: 'FAIL',
          errorCount: 1,
          warningCount: 0,
          infoCount: 0
        }
      };
    }
  }

  validateData(data: any, context: string = 'unknown'): ValidationReport {
    const results: ValidationResult[] = [];
    
    console.log(`🔍 Running ${this.validationRules.length} validation rules...`);
    
    for (const rule of this.validationRules) {
      try {
        const passed = rule.validator(data);
        results.push({
          rule: rule.name,
          passed,
          message: passed ? 'Validation passed' : `Validation failed: ${rule.description}`,
          severity: rule.severity
        });
      } catch (error) {
        results.push({
          rule: rule.name,
          passed: false,
          message: `Validation error: ${error}`,
          severity: rule.severity,
          details: error
        });
      }
    }
    
    const errors = results.filter(r => r.severity === 'ERROR' && !r.passed);
    const warnings = results.filter(r => r.severity === 'WARNING' && !r.passed);
    const info = results.filter(r => r.severity === 'INFO' && !r.passed);
    const passed = results.filter(r => r.passed).length;
    
    const report: ValidationReport = {
      timestamp: new Date().toISOString(),
      totalRules: this.validationRules.length,
      passed,
      failed: results.length - passed,
      errors,
      warnings,
      info,
      summary: {
        overall: errors.length > 0 ? 'FAIL' : warnings.length > 0 ? 'WARNING' : 'PASS',
        errorCount: errors.length,
        warningCount: warnings.length,
        infoCount: info.length
      }
    };
    
    this.printValidationReport(report, context);
    return report;
  }

  async validateDataDirectory(dirPath: string): Promise<ValidationReport[]> {
    console.log(`🔍 Validating data directory: ${dirPath}`);
    
    const reports: ValidationReport[] = [];
    const files = this.findJsonFiles(dirPath);
    
    console.log(`Found ${files.length} JSON files to validate`);
    
    for (const file of files) {
      const report = await this.validateDataFile(file);
      reports.push(report);
    }
    
    return reports;
  }

  private findJsonFiles(dirPath: string): string[] {
    const files: string[] = [];
    
    const scanDirectory = (currentDir: string) => {
      try {
        const items = fs.readdirSync(currentDir);
        
        for (const item of items) {
          const fullPath = path.join(currentDir, item);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            scanDirectory(fullPath);
          } else if (stat.isFile() && item.endsWith('.json')) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        console.warn(`Warning: Could not scan directory ${currentDir}:`, error);
      }
    };
    
    scanDirectory(dirPath);
    return files;
  }

  printValidationReport(report: ValidationReport, context: string = 'unknown'): void {
    console.log(`\n📊 VALIDATION REPORT: ${context}`);
    console.log('='.repeat(80));
    
    console.log(`📈 SUMMARY:`);
    console.log(`   Overall Status: ${report.summary.overall}`);
    console.log(`   Total Rules: ${report.totalRules}`);
    console.log(`   Passed: ${report.passed}`);
    console.log(`   Failed: ${report.failed}`);
    console.log('');
    
    console.log(`📋 BREAKDOWN:`);
    console.log(`   Errors: ${report.summary.errorCount}`);
    console.log(`   Warnings: ${report.summary.warningCount}`);
    console.log(`   Info: ${report.summary.infoCount}`);
    console.log('');
    
    if (report.errors.length > 0) {
      console.log('❌ ERRORS:');
      console.log('-'.repeat(40));
      report.errors.forEach(error => {
        console.log(`   ${error.rule}: ${error.message}`);
      });
      console.log('');
    }
    
    if (report.warnings.length > 0) {
      console.log('⚠️  WARNINGS:');
      console.log('-'.repeat(40));
      report.warnings.forEach(warning => {
        console.log(`   ${warning.rule}: ${warning.message}`);
      });
      console.log('');
    }
    
    if (report.info.length > 0) {
      console.log('ℹ️  INFO:');
      console.log('-'.repeat(40));
      report.info.forEach(info => {
        console.log(`   ${info.rule}: ${info.message}`);
      });
      console.log('');
    }
  }

  async saveValidationReport(report: ValidationReport, outputPath: string): Promise<void> {
    try {
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
      console.log(`📄 Validation report saved to: ${outputPath}`);
    } catch (error) {
      console.error('❌ Failed to save validation report:', error);
    }
  }

  addCustomRule(rule: ValidationRule): void {
    this.validationRules.push(rule);
    console.log(`✅ Added custom validation rule: ${rule.name}`);
  }

  getValidationRules(): ValidationRule[] {
    return [...this.validationRules];
  }
}

// CLI interface for direct usage
if (require.main === module) {
  const validationManager = new DataValidationManager();
  
  const args = process.argv.slice(2);
  const target = args[0];
  const isDirectory = args.includes('--directory');
  
  if (!target) {
    console.log('Usage: node src/holons/data/data-validation.ts <file|directory> [--directory]');
    process.exit(1);
  }
  
  (async () => {
    try {
      if (isDirectory) {
        const reports = await validationManager.validateDataDirectory(target);
        console.log(`\n✅ Validated ${reports.length} files`);
        
        const overallStatus = reports.every(r => r.summary.overall === 'PASS') ? 'PASS' : 'FAIL';
        console.log(`Overall validation status: ${overallStatus}`);
      } else {
        const report = await validationManager.validateDataFile(target);
        await validationManager.saveValidationReport(report, `data/reports/validation-${Date.now()}.json`);
      }
    } catch (error) {
      console.error('❌ Validation failed:', error);
      process.exit(1);
    }
  })();
} 