/**
 * Test Utilities for Shared Utils Holon
 * 
 * PURPOSE: Test all shared utilities to ensure they work correctly
 * - File utilities testing
 * - Command utilities testing
 * - Logging utilities testing
 * - Configuration utilities testing
 * - Validation utilities testing
 */

import { FileUtils } from './file-utils';
import { CommandUtils } from './command-utils';
import { LoggingUtils } from './logging-utils';
import { ConfigUtils } from './config-utils';
import { ValidationUtils } from './validation-utils';
import * as path from 'path';
import * as fs from 'fs';

export class SharedUtilsTester {
  private logger: LoggingUtils;
  private testResults: Array<{
    utility: string;
    test: string;
    passed: boolean;
    error?: string;
    duration: number;
  }> = [];

  constructor() {
    this.logger = LoggingUtils.getInstance();
  }

  /**
   * Run all tests
   */
  async runAllTests(): Promise<void> {
    this.logger.info('Starting shared utils tests', 'SharedUtilsTester');
    
    const startTime = Date.now();
    
    try {
      await this.testFileUtils();
      await this.testCommandUtils();
      await this.testLoggingUtils();
      await this.testConfigUtils();
      await this.testValidationUtils();
      
      const totalDuration = Date.now() - startTime;
      this.logger.info('All shared utils tests completed', 'SharedUtilsTester', {
        totalDuration,
        passed: this.testResults.filter(r => r.passed).length,
        failed: this.testResults.filter(r => !r.passed).length
      });
      
      this.printTestResults();
      
    } catch (error) {
      this.logger.error('Test suite failed', 'SharedUtilsTester', { error });
      throw error;
    }
  }

  /**
   * Test file utilities
   */
  private async testFileUtils(): Promise<void> {
    const fileUtils = new FileUtils();
    const testDir = path.join(process.cwd(), 'test-shared-utils');
    const testFile = path.join(testDir, 'test.json');
    const testData = { test: 'data', number: 42, array: [1, 2, 3] };

    try {
      // Test directory creation
      const startTime = Date.now();
      await fileUtils.ensureDirectory(testDir);
      this.recordTest('FileUtils', 'ensureDirectory', true, Date.now() - startTime);

      // Test file writing
      const writeStart = Date.now();
      await fileUtils.writeJsonFile(testFile, testData);
      this.recordTest('FileUtils', 'writeJsonFile', true, Date.now() - writeStart);

      // Test file reading
      const readStart = Date.now();
      const readData = await fileUtils.readJsonFile(testFile);
      this.recordTest('FileUtils', 'readJsonFile', true, Date.now() - readStart);

      // Test data comparison
      const compareStart = Date.now();
      const dataMatches = JSON.stringify(readData) === JSON.stringify(testData);
      this.recordTest('FileUtils', 'dataIntegrity', dataMatches, Date.now() - compareStart);

      // Test file scanning
      const scanStart = Date.now();
      const files = await fileUtils.scanDirectory(testDir, { patterns: ['*.json'] });
      this.recordTest('FileUtils', 'scanDirectory', files.length > 0, Date.now() - scanStart);

      // Test file backup
      const backupStart = Date.now();
      const backupPath = await fileUtils.createBackup({ source: testFile, destination: testDir });
      this.recordTest('FileUtils', 'createBackup', fs.existsSync(backupPath), Date.now() - backupStart);

      // Cleanup
      await fileUtils.removeDirectory(testDir);
      this.recordTest('FileUtils', 'removeDirectory', true, 0);

    } catch (error) {
      this.recordTest('FileUtils', 'overall', false, 0, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Test command utilities
   */
  private async testCommandUtils(): Promise<void> {
    const commandUtils = new CommandUtils();

    try {
      // Test echo command
      const echoStart = Date.now();
      const echoResult = await commandUtils.executeCommand('echo "test"');
      this.recordTest('CommandUtils', 'executeCommand', echoResult.success, Date.now() - echoStart);

      // Test command with timeout
      const timeoutStart = Date.now();
      const timeoutResult = await commandUtils.executeCommand('sleep 1', { timeout: 2000 });
      this.recordTest('CommandUtils', 'executeWithTimeout', timeoutResult.success, Date.now() - timeoutStart);

      // Test command timeout failure
      const failStart = Date.now();
      const failResult = await commandUtils.executeCommand('sleep 5', { timeout: 1000 });
      this.recordTest('CommandUtils', 'timeoutFailure', !failResult.success, Date.now() - failStart);

      // Test retry mechanism
      const retryStart = Date.now();
      const retryResult = await commandUtils.executeCommandWithRetry('echo "retry test"', { maxRetries: 3 });
      this.recordTest('CommandUtils', 'executeCommandWithRetry', retryResult.success, Date.now() - retryStart);

    } catch (error) {
      this.recordTest('CommandUtils', 'overall', false, 0, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Test logging utilities
   */
  private async testLoggingUtils(): Promise<void> {
    const loggingUtils = LoggingUtils.getInstance();

    try {
      // Test basic logging
      const basicStart = Date.now();
      loggingUtils.info('Test info message', 'TestContext');
      loggingUtils.warn('Test warning message', 'TestContext');
      loggingUtils.error('Test error message', 'TestContext');
      this.recordTest('LoggingUtils', 'basicLogging', true, undefined, Date.now() - basicStart);

      // Test structured logging
      const structuredStart = Date.now();
      loggingUtils.info('Structured test', 'TestContext', { test: 'data', number: 42 });
      this.recordTest('LoggingUtils', 'structuredLogging', true, undefined, Date.now() - structuredStart);

      // Test timing
      const timingStart = Date.now();
      const result = loggingUtils.time(() => {
        // Simulate some work
        return new Promise(resolve => setTimeout(() => resolve('done'), 10));
      }, 'Test operation', 'TestContext');
      await result;
      this.recordTest('LoggingUtils', 'timing', true, undefined, Date.now() - timingStart);

      // Test stats
      const statsStart = Date.now();
      const stats = loggingUtils.getStats();
      this.recordTest('LoggingUtils', 'getStats', stats.totalEntries > 0, undefined, Date.now() - statsStart);

    } catch (error) {
      this.recordTest('LoggingUtils', 'overall', false, error instanceof Error ? error.message : 'Unknown error', 0);
    }
  }

  /**
   * Test configuration utilities
   */
  private async testConfigUtils(): Promise<void> {
    const configUtils = ConfigUtils.getInstance();
    const testConfigPath = path.join(process.cwd(), 'test-config.json');
    const testConfig = { testKey: 'testValue', numberKey: 42, boolKey: true };

    try {
      // Test configuration setting
      const setStart = Date.now();
      configUtils.set('testKey', 'testValue');
      this.recordTest('ConfigUtils', 'set', true, undefined, Date.now() - setStart);

      // Test configuration getting
      const getStart = Date.now();
      const value = configUtils.get('testKey');
      this.recordTest('ConfigUtils', 'get', value === 'testValue', undefined, Date.now() - getStart);

      // Test configuration has
      const hasStart = Date.now();
      const hasKey = configUtils.has('testKey');
      this.recordTest('ConfigUtils', 'has', hasKey, undefined, Date.now() - hasStart);

      // Test configuration export
      const exportStart = Date.now();
      await configUtils.exportConfig(testConfigPath);
      this.recordTest('ConfigUtils', 'exportConfig', fs.existsSync(testConfigPath), undefined, Date.now() - exportStart);

      // Test configuration stats
      const statsStart = Date.now();
      const stats = configUtils.getStats();
      this.recordTest('ConfigUtils', 'getStats', stats.totalKeys > 0, undefined, Date.now() - statsStart);

      // Cleanup
      if (fs.existsSync(testConfigPath)) {
        fs.unlinkSync(testConfigPath);
      }

    } catch (error) {
      this.recordTest('ConfigUtils', 'overall', false, error instanceof Error ? error.message : 'Unknown error', 0);
    }
  }

  /**
   * Test validation utilities
   */
  private async testValidationUtils(): Promise<void> {
    const validationUtils = ValidationUtils.getInstance();

    try {
      // Test email validation
      const emailStart = Date.now();
      const emailSchema = { email: ValidationUtils.getCommonSchemas().email };
      const emailResult = validationUtils.validate({ email: 'test@example.com' }, emailSchema);
      this.recordTest('ValidationUtils', 'emailValidation', emailResult.isValid, undefined, Date.now() - emailStart);

      // Test password validation
      const passwordStart = Date.now();
      const passwordSchema = { password: ValidationUtils.getCommonSchemas().password };
      const passwordResult = validationUtils.validate({ password: 'TestPass123' }, passwordSchema);
      this.recordTest('ValidationUtils', 'passwordValidation', passwordResult.isValid, undefined, Date.now() - passwordStart);

      // Test URL validation
      const urlStart = Date.now();
      const urlSchema = { url: ValidationUtils.getCommonSchemas().url };
      const urlResult = validationUtils.validate({ url: 'https://example.com' }, urlSchema);
      this.recordTest('ValidationUtils', 'urlValidation', urlResult.isValid, undefined, Date.now() - urlStart);

      // Test data sanitization
      const sanitizeStart = Date.now();
      const sanitized = validationUtils.sanitize({ 
        text: '  test text  ', 
        html: '<script>alert("xss")</script>' 
      }, { trimStrings: true, escapeHtml: true });
      this.recordTest('ValidationUtils', 'sanitization', 
        sanitized.text === 'test text' && sanitized.html.includes('&lt;'), 
        undefined, Date.now() - sanitizeStart);

    } catch (error) {
      this.recordTest('ValidationUtils', 'overall', false, error instanceof Error ? error.message : 'Unknown error', 0);
    }
  }

  /**
   * Record test result
   */
  private recordTest(utility: string, test: string, passed: boolean, duration: number, error?: string): void {
    this.testResults.push({
      utility,
      test,
      passed,
      error,
      duration
    });

    const status = passed ? 'PASS' : 'FAIL';
    this.logger.info(`${status} ${utility}.${test}`, 'SharedUtilsTester', { duration, error });
  }

  /**
   * Print test results summary
   */
  private printTestResults(): void {
    const passed = this.testResults.filter(r => r.passed).length;
    const failed = this.testResults.filter(r => !r.passed).length;
    const total = this.testResults.length;

    console.log('\n=== Shared Utils Test Results ===');
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

    if (failed > 0) {
      console.log('\nFailed Tests:');
      this.testResults
        .filter(r => !r.passed)
        .forEach(r => {
          console.log(`  ${r.utility}.${r.test}: ${r.error || 'Unknown error'}`);
        });
    }

    console.log('\nTest Details:');
    this.testResults.forEach(r => {
      const status = r.passed ? '✓' : '✗';
      console.log(`  ${status} ${r.utility}.${r.test} (${r.duration}ms)`);
    });
  }

  /**
   * Get test results
   */
  getTestResults() {
    return this.testResults;
  }
}

// Export for use in other modules
export const runSharedUtilsTests = async () => {
  const tester = new SharedUtilsTester();
  await tester.runAllTests();
  return tester.getTestResults();
}; 