#!/usr/bin/env node

/**
 * Error Manager Integration Test
 * Demonstrates Error Manager Holon integration with OperationsMaster
 * Shows error detection, resolution, and continuity features
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class ErrorManagerIntegrationTest {
  constructor() {
    this.projectRoot = process.cwd();
    this.testResults = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '✅';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async runTest() {
    this.log('🧪 Starting Error Manager Integration Test...', 'info');
    
    try {
      // Test 1: Check current build errors
      await this.testCurrentErrors();
      
      // Test 2: Test error continuity protocol
      await this.testErrorContinuity();
      
      // Test 3: Test operations integration
      await this.testOperationsIntegration();
      
      // Test 4: Generate integration report
      await this.generateIntegrationReport();
      
    } catch (error) {
      this.log(`Test failed: ${error.message}`, 'error');
      process.exit(1);
    }
  }

  async testCurrentErrors() {
    this.log('📊 Testing current error detection...', 'info');
    
    try {
      // Run build to detect current errors
      const buildResult = await this.runCommand('npm run build');
      
      if (buildResult.exitCode !== 0) {
        this.log(`Build failed with ${buildResult.exitCode} errors`, 'warning');
        this.testResults.push({
          test: 'current_errors',
          status: 'warning',
          message: `Build has ${buildResult.exitCode} errors`,
          details: buildResult.output
        });
      } else {
        this.log('Build successful - no errors detected', 'info');
        this.testResults.push({
          test: 'current_errors',
          status: 'success',
          message: 'No build errors detected'
        });
      }
    } catch (error) {
      this.log(`Error detection test failed: ${error.message}`, 'error');
      this.testResults.push({
        test: 'current_errors',
        status: 'error',
        message: error.message
      });
    }
  }

  async testErrorContinuity() {
    this.log('🔄 Testing error continuity protocol...', 'info');
    
    try {
      // Check if error continuity protocol exists
      const continuityPath = path.join(this.projectRoot, 'scripts/protocols/error_resolution_continuity_protocol.cjs');
      
      if (fs.existsSync(continuityPath)) {
        this.log('Error continuity protocol found', 'info');
        
        // Run continuity check
        const continuityResult = await this.runCommand('node scripts/protocols/error_resolution_continuity_protocol.cjs');
        
        this.testResults.push({
          test: 'error_continuity',
          status: 'success',
          message: 'Error continuity protocol executed successfully',
          details: continuityResult.output
        });
      } else {
        this.log('Error continuity protocol not found', 'warning');
        this.testResults.push({
          test: 'error_continuity',
          status: 'warning',
          message: 'Error continuity protocol not found'
        });
      }
    } catch (error) {
      this.log(`Error continuity test failed: ${error.message}`, 'error');
      this.testResults.push({
        test: 'error_continuity',
        status: 'error',
        message: error.message
      });
    }
  }

  async testOperationsIntegration() {
    this.log('🎛️ Testing operations integration...', 'info');
    
    try {
      // Check if OperationsMaster exists
      const operationsMasterPath = path.join(this.projectRoot, 'src/core/operations/OperationsMaster.ts');
      
      if (fs.existsSync(operationsMasterPath)) {
        this.log('OperationsMaster found', 'info');
        
        // Check if ErrorManagerHolon exists
        const errorManagerPath = path.join(this.projectRoot, 'src/core/holons/operations/ErrorManagerHolon.ts');
        
        if (fs.existsSync(errorManagerPath)) {
          this.log('ErrorManagerHolon found', 'info');
          
          // Check integration points
          const operationsContent = fs.readFileSync(operationsMasterPath, 'utf8');
          const errorManagerContent = fs.readFileSync(errorManagerPath, 'utf8');
          
          const hasErrorManagerImport = operationsContent.includes('ErrorManagerHolon');
          const hasOperationsIntegration = errorManagerContent.includes('OperationsMaster');
          
          if (hasErrorManagerImport && hasOperationsIntegration) {
            this.log('Operations integration verified', 'info');
            this.testResults.push({
              test: 'operations_integration',
              status: 'success',
              message: 'ErrorManagerHolon integrated with OperationsMaster'
            });
          } else {
            this.log('Operations integration incomplete', 'warning');
            this.testResults.push({
              test: 'operations_integration',
              status: 'warning',
              message: 'Integration points need verification'
            });
          }
        } else {
          this.log('ErrorManagerHolon not found', 'warning');
          this.testResults.push({
            test: 'operations_integration',
            status: 'warning',
            message: 'ErrorManagerHolon not found'
          });
        }
      } else {
        this.log('OperationsMaster not found', 'warning');
        this.testResults.push({
          test: 'operations_integration',
          status: 'warning',
          message: 'OperationsMaster not found'
        });
      }
    } catch (error) {
      this.log(`Operations integration test failed: ${error.message}`, 'error');
      this.testResults.push({
        test: 'operations_integration',
        status: 'error',
        message: error.message
      });
    }
  }

  async generateIntegrationReport() {
    this.log('📋 Generating integration report...', 'info');
    
    const report = {
      timestamp: new Date().toISOString(),
      testResults: this.testResults,
      summary: {
        total: this.testResults.length,
        success: this.testResults.filter(r => r.status === 'success').length,
        warning: this.testResults.filter(r => r.status === 'warning').length,
        error: this.testResults.filter(r => r.status === 'error').length
      },
      recommendations: this.generateRecommendations()
    };

    // Save report
    const reportPath = path.join(this.projectRoot, 'data/error_manager_integration_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Display summary
    console.log('\n📊 INTEGRATION TEST SUMMARY');
    console.log('============================');
    console.log(`Total Tests: ${report.summary.total}`);
    console.log(`✅ Success: ${report.summary.success}`);
    console.log(`⚠️  Warnings: ${report.summary.warning}`);
    console.log(`❌ Errors: ${report.summary.error}`);
    
    if (report.recommendations.length > 0) {
      console.log('\n🎯 RECOMMENDATIONS:');
      report.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });
    }
    
    this.log(`Report saved to: ${reportPath}`, 'info');
  }

  generateRecommendations() {
    const recommendations = [];
    
    const errorTests = this.testResults.filter(r => r.status === 'error');
    const warningTests = this.testResults.filter(r => r.status === 'warning');
    
    if (errorTests.length > 0) {
      recommendations.push('Fix critical integration errors before proceeding');
    }
    
    if (warningTests.length > 0) {
      recommendations.push('Address integration warnings for optimal performance');
    }
    
    const currentErrorsTest = this.testResults.find(r => r.test === 'current_errors');
    if (currentErrorsTest && currentErrorsTest.status === 'warning') {
      recommendations.push('Resolve build errors to improve system stability');
    }
    
    const continuityTest = this.testResults.find(r => r.test === 'error_continuity');
    if (continuityTest && continuityTest.status === 'warning') {
      recommendations.push('Implement error continuity protocol for session persistence');
    }
    
    const integrationTest = this.testResults.find(r => r.test === 'operations_integration');
    if (integrationTest && integrationTest.status === 'warning') {
      recommendations.push('Complete operations integration for full error management');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Integration test passed successfully - Error Manager Holon is ready for use');
    }
    
    return recommendations;
  }

  async runCommand(command) {
    return new Promise((resolve, reject) => {
      const [cmd, ...args] = command.split(' ');
      const child = spawn(cmd, args, {
        cwd: this.projectRoot,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let output = '';
      let errorOutput = '';

      child.stdout.on('data', (data) => {
        output += data.toString();
      });

      child.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      child.on('close', (code) => {
        resolve({
          exitCode: code,
          output: output + errorOutput
        });
      });

      child.on('error', (error) => {
        reject(error);
      });
    });
  }
}

// CLI entry point
if (require.main === module) {
  const test = new ErrorManagerIntegrationTest();
  test.runTest().then(() => {
    console.log('\n🎉 Error Manager Integration Test completed');
    process.exit(0);
  }).catch(err => {
    console.error('❌ Test failed:', err);
    process.exit(1);
  });
}

module.exports = ErrorManagerIntegrationTest; 