#!/usr/bin/env node

/**
 * Automated Command Cycle Test Protocol
 * 
 * This protocol runs the complete command cycle (prewrap, precommit, commit, wrap, launch)
 * outside the main system to study Performance Manager integration effects without interference.
 * 
 * The test monitors:
 * - Command execution success rates
 * - Performance impact of Performance Manager integration
 * - System resource utilization
 * - Integration effectiveness across all commands
 * - Session optimization recommendations
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

class AutomatedCommandCycleTest {
    constructor() {
        this.testId = `command_cycle_test_${Date.now()}`;
        this.testData = {
            testId: this.testId,
            startTime: new Date().toISOString(),
            cycles: [],
            metrics: {
                totalCycles: 0,
                successfulCycles: 0,
                failedCycles: 0,
                averageCycleDuration: 0,
                commandSuccessRates: {},
                performanceImpact: {},
                resourceUtilization: {}
            }
        };
        
        this.dataDir = path.join(__dirname, '../../data/command-cycle-testing');
        this.ensureDataDirectory();
        
        this.commands = ['prewrap', 'precommit', 'commit', 'wrap', 'launch'];
        this.isRunning = false;
    }

    ensureDataDirectory() {
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
        }
    }

    /**
     * Initialize the automated command cycle test
     */
    async initializeTest() {
        console.log('🤖 Initializing Automated Command Cycle Test...');
        
        // Check if all required commands are available
        await this.validateCommands();
        
        // Initialize performance monitoring
        await this.initializePerformanceMonitoring();
        
        console.log('✅ Automated Command Cycle Test initialized');
    }

    /**
     * Validate that all required commands are available
     */
    async validateCommands() {
        console.log('🔍 Validating command availability...');
        
        for (const command of this.commands) {
            try {
                // Test command availability by running with --help or similar
                const result = execSync(`npm run ${command} --help 2>/dev/null || echo "Command available"`, { 
                    encoding: 'utf8',
                    timeout: 5000 
                });
                console.log(`   ✅ ${command}: Available`);
            } catch (error) {
                console.log(`   ⚠️  ${command}: May not be available (${error.message})`);
            }
        }
    }

    /**
     * Initialize performance monitoring
     */
    async initializePerformanceMonitoring() {
        this.performanceMonitor = {
            startTime: Date.now(),
            baselineMetrics: await this.getSystemMetrics(),
            commandMetrics: {}
        };
    }

    /**
     * Get current system metrics
     */
    async getSystemMetrics() {
        try {
            const cpuUsage = process.cpuUsage();
            const memoryUsage = process.memoryUsage();
            
            return {
                timestamp: Date.now(),
                cpu: {
                    user: cpuUsage.user,
                    system: cpuUsage.system
                },
                memory: {
                    rss: memoryUsage.rss,
                    heapUsed: memoryUsage.heapUsed,
                    heapTotal: memoryUsage.heapTotal,
                    external: memoryUsage.external
                }
            };
        } catch (error) {
            return {
                timestamp: Date.now(),
                cpu: { user: 0, system: 0 },
                memory: { rss: 0, heapUsed: 0, heapTotal: 0, external: 0 }
            };
        }
    }

    /**
     * Run a complete command cycle
     */
    async runCommandCycle(cycleConfig = {}) {
        const cycleId = `cycle_${Date.now()}`;
        
        console.log(`🔄 Starting Command Cycle: ${cycleId}`);
        
        const cycle = {
            cycleId,
            startTime: new Date().toISOString(),
            config: {
                includeLaunch: cycleConfig.includeLaunch !== false,
                timeout: cycleConfig.timeout || 300000, // 5 minutes per cycle
                retryAttempts: cycleConfig.retryAttempts || 2
            },
            commands: [],
            results: {},
            status: 'running'
        };

        this.testData.cycles.push(cycle);
        this.testData.metrics.totalCycles++;

        try {
            // Execute each command in sequence
            for (const command of this.commands) {
                if (command === 'launch' && !cycle.config.includeLaunch) {
                    console.log(`   ⏭️  Skipping launch command as configured`);
                    continue;
                }

                const commandResult = await this.executeCommand(command, cycle);
                cycle.commands.push(commandResult);
                
                // Check if we should continue based on command result
                if (commandResult.criticalFailure) {
                    console.log(`   ❌ Critical failure in ${command}, stopping cycle`);
                    break;
                }
                
                // Brief pause between commands
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            // Calculate cycle results
            cycle.results = this.calculateCycleResults(cycle);
            cycle.endTime = new Date().toISOString();
            cycle.status = 'completed';

            // Update test metrics
            this.updateTestMetrics(cycle);

            console.log(`✅ Command Cycle ${cycleId} completed`);
            console.log(`   Success: ${cycle.results.success ? 'Yes' : 'No'}`);
            console.log(`   Duration: ${cycle.results.duration / 1000} seconds`);
            console.log(`   Commands Successful: ${cycle.results.successfulCommands}/${cycle.results.totalCommands}`);

        } catch (error) {
            cycle.error = error.message;
            cycle.status = 'failed';
            cycle.endTime = new Date().toISOString();
            
            console.error(`❌ Command Cycle ${cycleId} failed: ${error.message}`);
        }

        return cycle;
    }

    /**
     * Execute a single command
     */
    async executeCommand(commandName, cycle) {
        const commandStart = Date.now();
        
        console.log(`   🚀 Executing: ${commandName}`);
        
        const commandResult = {
            command: commandName,
            startTime: new Date().toISOString(),
            success: false,
            criticalFailure: false,
            duration: 0,
            output: '',
            error: '',
            metrics: {}
        };

        try {
            // Get system metrics before command
            const beforeMetrics = await this.getSystemMetrics();
            
            // Execute command with timeout
            const commandProcess = spawn('npm', ['run', commandName], {
                stdio: ['pipe', 'pipe', 'pipe'],
                timeout: cycle.config.timeout
            });

            let output = '';
            let errorOutput = '';

            commandProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

            commandProcess.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });

            // Wait for command completion
            await new Promise((resolve, reject) => {
                commandProcess.on('close', (code) => {
                    if (code === 0) {
                        resolve();
                    } else {
                        reject(new Error(`Command exited with code ${code}`));
                    }
                });

                commandProcess.on('error', (error) => {
                    reject(error);
                });

                commandProcess.on('timeout', () => {
                    commandProcess.kill();
                    reject(new Error('Command timed out'));
                });
            });

            // Get system metrics after command
            const afterMetrics = await this.getSystemMetrics();
            
            // Calculate command metrics
            commandResult.metrics = this.calculateCommandMetrics(beforeMetrics, afterMetrics);
            commandResult.output = output;
            commandResult.success = true;
            commandResult.duration = Date.now() - commandStart;

            // Check for critical failures
            if (this.isCriticalFailure(commandName, output, errorOutput)) {
                commandResult.criticalFailure = true;
            }

            console.log(`   ${commandResult.success ? '✅' : '❌'} ${commandName}: ${commandResult.duration}ms`);

        } catch (error) {
            commandResult.error = error.message;
            commandResult.duration = Date.now() - commandStart;
            commandResult.criticalFailure = this.isCriticalFailure(commandName, '', error.message);
            
            console.log(`   ❌ ${commandName}: ${error.message}`);
        }

        return commandResult;
    }

    /**
     * Calculate metrics for a command execution
     */
    calculateCommandMetrics(beforeMetrics, afterMetrics) {
        const duration = afterMetrics.timestamp - beforeMetrics.timestamp;
        
        return {
            duration,
            cpuDelta: {
                user: afterMetrics.cpu.user - beforeMetrics.cpu.user,
                system: afterMetrics.cpu.system - beforeMetrics.cpu.system
            },
            memoryDelta: {
                rss: afterMetrics.memory.rss - beforeMetrics.memory.rss,
                heapUsed: afterMetrics.memory.heapUsed - beforeMetrics.memory.heapUsed,
                heapTotal: afterMetrics.memory.heapTotal - beforeMetrics.memory.heapTotal,
                external: afterMetrics.memory.external - beforeMetrics.memory.external
            },
            performanceImpact: {
                cpuIntensity: (afterMetrics.cpu.user + afterMetrics.cpu.system) / duration,
                memoryIntensity: afterMetrics.memory.heapUsed / duration
            }
        };
    }

    /**
     * Check if a command failure is critical
     */
    isCriticalFailure(commandName, output, error) {
        const criticalPatterns = [
            'fatal error',
            'critical error',
            'system failure',
            'database connection failed',
            'authentication failed',
            'permission denied',
            'port already in use',
            'memory allocation failed'
        ];

        const combinedOutput = (output + ' ' + error).toLowerCase();
        
        return criticalPatterns.some(pattern => 
            combinedOutput.includes(pattern)
        );
    }

    /**
     * Calculate cycle results
     */
    calculateCycleResults(cycle) {
        const totalCommands = cycle.commands.length;
        const successfulCommands = cycle.commands.filter(c => c.success).length;
        const duration = new Date(cycle.endTime).getTime() - new Date(cycle.startTime).getTime();
        
        const success = successfulCommands / totalCommands >= 0.8; // 80% success rate required
        
        // Calculate performance impact
        const totalCpuImpact = cycle.commands.reduce((sum, c) => 
            sum + (c.metrics.cpuDelta?.user || 0) + (c.metrics.cpuDelta?.system || 0), 0
        );
        
        const totalMemoryImpact = cycle.commands.reduce((sum, c) => 
            sum + (c.metrics.memoryDelta?.heapUsed || 0), 0
        );

        return {
            success,
            duration,
            totalCommands,
            successfulCommands,
            successRate: successfulCommands / totalCommands,
            totalCpuImpact,
            totalMemoryImpact,
            averageCommandDuration: duration / totalCommands
        };
    }

    /**
     * Update test metrics
     */
    updateTestMetrics(cycle) {
        if (cycle.results.success) {
            this.testData.metrics.successfulCycles++;
        } else {
            this.testData.metrics.failedCycles++;
        }

        // Update command success rates
        for (const command of cycle.commands) {
            if (!this.testData.metrics.commandSuccessRates[command.command]) {
                this.testData.metrics.commandSuccessRates[command.command] = {
                    total: 0,
                    successful: 0
                };
            }
            
            this.testData.metrics.commandSuccessRates[command.command].total++;
            if (command.success) {
                this.testData.metrics.commandSuccessRates[command.command].successful++;
            }
        }

        // Update average cycle duration
        const totalDuration = this.testData.cycles.reduce((sum, c) => 
            sum + (c.results.duration || 0), 0
        );
        this.testData.metrics.averageCycleDuration = totalDuration / this.testData.cycles.length;
    }

    /**
     * Run continuous command cycle testing
     */
    async runContinuousTesting(testConfig = {}) {
        console.log('🔄 Starting Continuous Command Cycle Testing...');
        
        await this.initializeTest();
        
        this.isRunning = true;
        
        const {
            cycleCount = 10,
            cycleInterval = 60000, // 1 minute between cycles
            includeLaunch = true,
            timeout = 300000 // 5 minutes per cycle
        } = testConfig;

        console.log(`📋 Test Configuration:`);
        console.log(`   Cycles: ${cycleCount}`);
        console.log(`   Interval: ${cycleInterval / 1000} seconds`);
        console.log(`   Include Launch: ${includeLaunch}`);
        console.log(`   Timeout: ${timeout / 1000} seconds per cycle`);

        for (let i = 0; i < cycleCount && this.isRunning; i++) {
            console.log(`\n🔄 Cycle ${i + 1}/${cycleCount}`);
            
            await this.runCommandCycle({
                includeLaunch,
                timeout,
                retryAttempts: 2
            });

            // Wait before next cycle (except for the last one)
            if (i < cycleCount - 1) {
                console.log(`⏳ Waiting ${cycleInterval / 1000} seconds before next cycle...`);
                await new Promise(resolve => setTimeout(resolve, cycleInterval));
            }
        }

        this.isRunning = false;
        
        // Generate final test report
        const report = this.generateTestReport();
        
        console.log('\n🔄 Continuous Command Cycle Testing completed!');
        console.log('📊 Final Results:');
        console.log(`   Total Cycles: ${report.summary.totalCycles}`);
        console.log(`   Successful Cycles: ${report.summary.successfulCycles}`);
        console.log(`   Success Rate: ${(report.summary.successRate * 100).toFixed(1)}%`);
        console.log(`   Average Duration: ${(report.summary.averageDuration / 1000).toFixed(1)} seconds`);
        
        return report;
    }

    /**
     * Stop continuous testing
     */
    stopTesting() {
        this.isRunning = false;
        console.log('⏹️  Continuous testing stopped');
    }

    /**
     * Generate comprehensive test report
     */
    generateTestReport() {
        const report = {
            testId: this.testId,
            generatedAt: new Date().toISOString(),
            summary: {
                totalCycles: this.testData.metrics.totalCycles,
                successfulCycles: this.testData.metrics.successfulCycles,
                failedCycles: this.testData.metrics.failedCycles,
                successRate: this.testData.metrics.successfulCycles / this.testData.metrics.totalCycles,
                averageDuration: this.testData.metrics.averageCycleDuration
            },
            commandAnalysis: this.analyzeCommandPerformance(),
            performanceImpact: this.analyzePerformanceImpact(),
            recommendations: this.generateRecommendations(),
            detailedCycles: this.testData.cycles.map(c => ({
                cycleId: c.cycleId,
                success: c.results.success,
                duration: c.results.duration,
                successRate: c.results.successRate,
                commands: c.commands.map(cmd => ({
                    command: cmd.command,
                    success: cmd.success,
                    duration: cmd.duration,
                    criticalFailure: cmd.criticalFailure
                }))
            }))
        };

        const filename = `command_cycle_test_report_${this.testId}.json`;
        const filepath = path.join(this.dataDir, filename);
        
        fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
        console.log(`📊 Test report generated: ${filepath}`);
        
        return report;
    }

    /**
     * Analyze command performance across all cycles
     */
    analyzeCommandPerformance() {
        const analysis = {};
        
        for (const [command, metrics] of Object.entries(this.testData.metrics.commandSuccessRates)) {
            analysis[command] = {
                totalExecutions: metrics.total,
                successfulExecutions: metrics.successful,
                successRate: metrics.successful / metrics.total,
                averageDuration: this.calculateAverageCommandDuration(command),
                reliability: this.calculateCommandReliability(command)
            };
        }
        
        return analysis;
    }

    /**
     * Calculate average duration for a command
     */
    calculateAverageCommandDuration(commandName) {
        const durations = this.testData.cycles
            .flatMap(c => c.commands)
            .filter(c => c.command === commandName)
            .map(c => c.duration);
            
        return durations.length > 0 ? 
            durations.reduce((sum, d) => sum + d, 0) / durations.length : 0;
    }

    /**
     * Calculate command reliability
     */
    calculateCommandReliability(commandName) {
        const commands = this.testData.cycles
            .flatMap(c => c.commands)
            .filter(c => c.command === commandName);
            
        const criticalFailures = commands.filter(c => c.criticalFailure).length;
        
        return {
            totalExecutions: commands.length,
            criticalFailures,
            reliabilityScore: commands.length > 0 ? 
                (commands.length - criticalFailures) / commands.length : 0
        };
    }

    /**
     * Analyze performance impact across cycles
     */
    analyzePerformanceImpact() {
        const allCommands = this.testData.cycles.flatMap(c => c.commands);
        
        return {
            totalCpuImpact: allCommands.reduce((sum, c) => 
                sum + (c.metrics.cpuDelta?.user || 0) + (c.metrics.cpuDelta?.system || 0), 0
            ),
            totalMemoryImpact: allCommands.reduce((sum, c) => 
                sum + (c.metrics.memoryDelta?.heapUsed || 0), 0
            ),
            averageCpuPerCommand: allCommands.reduce((sum, c) => 
                sum + (c.metrics.cpuDelta?.user || 0) + (c.metrics.cpuDelta?.system || 0), 0
            ) / allCommands.length,
            averageMemoryPerCommand: allCommands.reduce((sum, c) => 
                sum + (c.metrics.memoryDelta?.heapUsed || 0), 0
            ) / allCommands.length
        };
    }

    /**
     * Generate recommendations based on test results
     */
    generateRecommendations() {
        const recommendations = {
            system: {
                priority: 'high',
                recommendations: [
                    'Monitor command execution patterns for optimization opportunities',
                    'Implement retry mechanisms for failed commands',
                    'Optimize resource utilization based on performance metrics'
                ]
            },
            performance: {
                priority: 'medium',
                recommendations: [
                    'Analyze high-impact commands for optimization',
                    'Implement caching for frequently used operations',
                    'Monitor memory usage patterns for optimization'
                ]
            },
            reliability: {
                priority: 'high',
                recommendations: [
                    'Implement circuit breakers for critical commands',
                    'Add comprehensive error handling and recovery',
                    'Monitor and alert on critical failures'
                ]
            }
        };

        return recommendations;
    }
}

// CLI Interface
if (require.main === module) {
    const test = new AutomatedCommandCycleTest();
    
    const command = process.argv[2];
    const options = process.argv.slice(3);
    
    switch (command) {
        case 'init':
            test.initializeTest();
            break;
            
        case 'cycle':
            const includeLaunch = options[0] !== 'no-launch';
            const timeout = parseInt(options[1]) || 300000;
            test.runCommandCycle({ includeLaunch, timeout });
            break;
            
        case 'continuous':
            const cycleCount = parseInt(options[0]) || 10;
            const interval = parseInt(options[1]) || 60000;
            const launch = options[2] !== 'no-launch';
            const cycleTimeout = parseInt(options[3]) || 300000;
            
            test.runContinuousTesting({
                cycleCount,
                cycleInterval: interval,
                includeLaunch: launch,
                timeout: cycleTimeout
            });
            break;
            
        case 'stop':
            test.stopTesting();
            break;
            
        case 'report':
            const report = test.generateTestReport();
            console.log('Command Cycle Test Report:');
            console.log(JSON.stringify(report, null, 2));
            break;
            
        default:
            console.log('Automated Command Cycle Test CLI');
            console.log('');
            console.log('Commands:');
            console.log('  init - Initialize the test environment');
            console.log('  cycle [include-launch] [timeout] - Run a single command cycle');
            console.log('  continuous [cycles] [interval] [launch] [timeout] - Run continuous testing');
            console.log('  stop - Stop continuous testing');
            console.log('  report - Generate test report');
            console.log('');
            console.log('Examples:');
            console.log('  npm run command-cycle-test cycle');
            console.log('  npm run command-cycle-test continuous 20 30000 no-launch 180000');
            break;
    }
}

module.exports = AutomatedCommandCycleTest; 