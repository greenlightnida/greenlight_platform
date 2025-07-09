#!/usr/bin/env node

/**
 * Session Optimization Study Protocol
 * 
 * This protocol studies whether ending sessions before context elapses 
 * results in better outcomes compared to letting sessions run to full context expiration.
 * 
 * The study tracks:
 * - Session duration vs context expiration
 * - Task completion rates
 * - Quality of outcomes
 * - User satisfaction
 * - System performance impact
 * - Context preservation effectiveness
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SessionOptimizationStudy {
    constructor() {
        this.studyData = {
            studyId: `session_optimization_${Date.now()}`,
            startTime: new Date().toISOString(),
            sessions: [],
            recommendations: [],
            metrics: {
                totalSessions: 0,
                earlyEndSessions: 0,
                fullContextSessions: 0,
                completedTasks: 0,
                successfulOutcomes: 0,
                contextPreservationSuccess: 0
            }
        };
        
        this.dataDir = path.join(__dirname, '../../data/session-optimization');
        this.ensureDataDirectory();
    }

    ensureDataDirectory() {
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
        }
    }

    /**
     * Start a new session study
     */
    startSessionStudy(sessionConfig = {}) {
        const sessionId = `session_${Date.now()}`;
        const session = {
            sessionId,
            startTime: new Date().toISOString(),
            config: {
                maxDuration: sessionConfig.maxDuration || 3600000, // 1 hour default
                contextExpiration: sessionConfig.contextExpiration || 7200000, // 2 hours default
                earlyEndThreshold: sessionConfig.earlyEndThreshold || 0.7, // 70% of context time
                taskType: sessionConfig.taskType || 'general',
                complexity: sessionConfig.complexity || 'medium'
            },
            events: [],
            metrics: {
                duration: 0,
                tasksCompleted: 0,
                contextUtilization: 0,
                outcomeQuality: 0,
                userSatisfaction: 0,
                systemPerformance: 0
            },
            status: 'active'
        };

        this.studyData.sessions.push(session);
        this.studyData.metrics.totalSessions++;
        
        console.log(`🔬 Session Optimization Study: Started session ${sessionId}`);
        console.log(`   Max Duration: ${session.config.maxDuration / 60000} minutes`);
        console.log(`   Context Expiration: ${session.config.contextExpiration / 60000} minutes`);
        console.log(`   Early End Threshold: ${session.config.earlyEndThreshold * 100}%`);
        
        return sessionId;
    }

    /**
     * Record an event during the session
     */
    recordEvent(sessionId, eventType, data = {}) {
        const session = this.findSession(sessionId);
        if (!session) {
            console.error(`❌ Session ${sessionId} not found`);
            return;
        }

        const event = {
            timestamp: new Date().toISOString(),
            type: eventType,
            data
        };

        session.events.push(event);
        
        // Analyze event for optimization opportunities
        this.analyzeEvent(session, event);
    }

    /**
     * Analyze event for optimization insights
     */
    analyzeEvent(session, event) {
        const elapsed = Date.now() - new Date(session.startTime).getTime();
        const contextUtilization = elapsed / session.config.contextExpiration;
        
        switch (event.type) {
            case 'task_completed':
                session.metrics.tasksCompleted++;
                this.analyzeTaskCompletion(session, event);
                break;
                
            case 'context_heavy':
                this.analyzeContextUsage(session, event);
                break;
                
            case 'performance_degradation':
                this.analyzePerformance(session, event);
                break;
                
            case 'user_frustration':
                this.analyzeUserExperience(session, event);
                break;
        }
    }

    /**
     * Analyze task completion patterns
     */
    analyzeTaskCompletion(session, event) {
        const elapsed = Date.now() - new Date(session.startTime).getTime();
        const contextUtilization = elapsed / session.config.contextExpiration;
        
        if (contextUtilization > session.config.earlyEndThreshold) {
            this.addRecommendation(session.sessionId, 'early_end', {
                reason: 'High task completion rate with significant context utilization',
                contextUtilization,
                tasksCompleted: session.metrics.tasksCompleted
            });
        }
    }

    /**
     * Analyze context usage patterns
     */
    analyzeContextUsage(session, event) {
        const elapsed = Date.now() - new Date(session.startTime).getTime();
        const contextUtilization = elapsed / session.config.contextExpiration;
        
        if (contextUtilization > 0.8) {
            this.addRecommendation(session.sessionId, 'context_preservation', {
                reason: 'High context utilization detected',
                contextUtilization,
                recommendation: 'Consider ending session and preserving context'
            });
        }
    }

    /**
     * Analyze performance patterns
     */
    analyzePerformance(session, event) {
        this.addRecommendation(session.sessionId, 'performance_optimization', {
            reason: 'Performance degradation detected',
            recommendation: 'Consider ending session to improve system performance'
        });
    }

    /**
     * Analyze user experience patterns
     */
    analyzeUserExperience(session, event) {
        this.addRecommendation(session.sessionId, 'user_experience', {
            reason: 'User frustration detected',
            recommendation: 'Consider ending session to improve user experience'
        });
    }

    /**
     * End session and analyze outcomes
     */
    endSession(sessionId, endReason = 'manual') {
        const session = this.findSession(sessionId);
        if (!session) {
            console.error(`❌ Session ${sessionId} not found`);
            return;
        }

        const endTime = new Date();
        const startTime = new Date(session.startTime);
        const duration = endTime.getTime() - startTime.getTime();
        const contextUtilization = duration / session.config.contextExpiration;
        
        session.endTime = endTime.toISOString();
        session.duration = duration;
        session.endReason = endReason;
        session.status = 'completed';
        session.metrics.contextUtilization = contextUtilization;

        // Determine if this was an early end
        const wasEarlyEnd = contextUtilization < session.config.earlyEndThreshold;
        if (wasEarlyEnd) {
            this.studyData.metrics.earlyEndSessions++;
        } else {
            this.studyData.metrics.fullContextSessions++;
        }

        // Calculate outcome quality
        session.metrics.outcomeQuality = this.calculateOutcomeQuality(session);
        
        // Update study metrics
        this.studyData.metrics.completedTasks += session.metrics.tasksCompleted;
        if (session.metrics.outcomeQuality > 0.7) {
            this.studyData.metrics.successfulOutcomes++;
        }

        console.log(`🔬 Session Optimization Study: Ended session ${sessionId}`);
        console.log(`   Duration: ${duration / 60000} minutes`);
        console.log(`   Context Utilization: ${(contextUtilization * 100).toFixed(1)}%`);
        console.log(`   Early End: ${wasEarlyEnd ? 'Yes' : 'No'}`);
        console.log(`   Outcome Quality: ${(session.metrics.outcomeQuality * 100).toFixed(1)}%`);
        
        this.analyzeSessionOutcome(session);
        this.saveStudyData();
    }

    /**
     * Calculate outcome quality based on session metrics
     */
    calculateOutcomeQuality(session) {
        const factors = {
            taskCompletion: Math.min(session.metrics.tasksCompleted / 5, 1), // Normalize to 5 tasks
            contextEfficiency: 1 - Math.abs(session.metrics.contextUtilization - 0.7), // Optimal at 70%
            performance: session.metrics.systemPerformance,
            userSatisfaction: session.metrics.userSatisfaction
        };

        const weights = {
            taskCompletion: 0.4,
            contextEfficiency: 0.3,
            performance: 0.2,
            userSatisfaction: 0.1
        };

        return Object.keys(factors).reduce((score, factor) => {
            return score + (factors[factor] * weights[factor]);
        }, 0);
    }

    /**
     * Analyze session outcome and generate insights
     */
    analyzeSessionOutcome(session) {
        const wasEarlyEnd = session.metrics.contextUtilization < session.config.earlyEndThreshold;
        
        if (wasEarlyEnd && session.metrics.outcomeQuality > 0.8) {
            this.addStudyInsight('early_end_success', {
                sessionId: session.sessionId,
                contextUtilization: session.metrics.contextUtilization,
                outcomeQuality: session.metrics.outcomeQuality,
                insight: 'Early session end resulted in high-quality outcomes'
            });
        }
        
        if (!wasEarlyEnd && session.metrics.outcomeQuality < 0.6) {
            this.addStudyInsight('full_context_poor_outcome', {
                sessionId: session.sessionId,
                contextUtilization: session.metrics.contextUtilization,
                outcomeQuality: session.metrics.outcomeQuality,
                insight: 'Full context utilization resulted in poor outcomes'
            });
        }
    }

    /**
     * Add recommendation for session optimization
     */
    addRecommendation(sessionId, type, data) {
        const recommendation = {
            sessionId,
            type,
            timestamp: new Date().toISOString(),
            data
        };
        
        this.studyData.recommendations.push(recommendation);
    }

    /**
     * Add study insight
     */
    addStudyInsight(type, data) {
        const insight = {
            type,
            timestamp: new Date().toISOString(),
            data
        };
        
        if (!this.studyData.insights) {
            this.studyData.insights = [];
        }
        
        this.studyData.insights.push(insight);
    }

    /**
     * Get optimization recommendations for current session
     */
    getOptimizationRecommendations(sessionId) {
        const session = this.findSession(sessionId);
        if (!session) return [];

        const elapsed = Date.now() - new Date(session.startTime).getTime();
        const contextUtilization = elapsed / session.config.contextExpiration;
        
        const recommendations = [];

        // Check for early end recommendation
        if (contextUtilization > session.config.earlyEndThreshold) {
            recommendations.push({
                type: 'early_end',
                priority: 'high',
                reason: 'Context utilization threshold exceeded',
                contextUtilization: contextUtilization,
                threshold: session.config.earlyEndThreshold
            });
        }

        // Check for performance optimization
        if (session.metrics.systemPerformance < 0.6) {
            recommendations.push({
                type: 'performance_optimization',
                priority: 'medium',
                reason: 'System performance degradation detected'
            });
        }

        // Check for user experience optimization
        if (session.metrics.userSatisfaction < 0.7) {
            recommendations.push({
                type: 'user_experience',
                priority: 'medium',
                reason: 'User satisfaction below threshold'
            });
        }

        return recommendations;
    }

    /**
     * Generate experimental phase recommendations
     */
    generateExperimentalRecommendations() {
        const earlyEndSessions = this.studyData.sessions.filter(s => 
            s.status === 'completed' && 
            s.metrics.contextUtilization < s.config.earlyEndThreshold
        );
        
        const fullContextSessions = this.studyData.sessions.filter(s => 
            s.status === 'completed' && 
            s.metrics.contextUtilization >= s.config.earlyEndThreshold
        );

        const earlyEndSuccessRate = earlyEndSessions.length > 0 ? 
            earlyEndSessions.filter(s => s.metrics.outcomeQuality > 0.7).length / earlyEndSessions.length : 0;
            
        const fullContextSuccessRate = fullContextSessions.length > 0 ? 
            fullContextSessions.filter(s => s.metrics.outcomeQuality > 0.7).length / fullContextSessions.length : 0;

        const recommendations = {
            experimentalPhase: {
                recommendedEarlyEndThreshold: 0.65, // 65% of context time
                recommendedMaxDuration: 2700000, // 45 minutes
                confidenceLevel: this.calculateConfidenceLevel(),
                sampleSize: this.studyData.sessions.length
            },
            insights: {
                earlyEndSuccessRate,
                fullContextSuccessRate,
                recommendedStrategy: earlyEndSuccessRate > fullContextSuccessRate ? 'early_end' : 'full_context',
                keyFinding: earlyEndSuccessRate > fullContextSuccessRate ? 
                    'Early session ends show better outcomes' : 
                    'Full context utilization shows better outcomes'
            }
        };

        return recommendations;
    }

    /**
     * Calculate confidence level based on sample size
     */
    calculateConfidenceLevel() {
        const sampleSize = this.studyData.sessions.length;
        if (sampleSize < 10) return 'low';
        if (sampleSize < 30) return 'medium';
        if (sampleSize < 100) return 'high';
        return 'very_high';
    }

    /**
     * Find session by ID
     */
    findSession(sessionId) {
        return this.studyData.sessions.find(s => s.sessionId === sessionId);
    }

    /**
     * Save study data to file
     */
    saveStudyData() {
        const filename = `session_optimization_study_${this.studyData.studyId}.json`;
        const filepath = path.join(this.dataDir, filename);
        
        fs.writeFileSync(filepath, JSON.stringify(this.studyData, null, 2));
        console.log(`💾 Study data saved to ${filepath}`);
    }

    /**
     * Generate study report
     */
    generateReport() {
        const report = {
            studyId: this.studyData.studyId,
            generatedAt: new Date().toISOString(),
            summary: {
                totalSessions: this.studyData.metrics.totalSessions,
                earlyEndSessions: this.studyData.metrics.earlyEndSessions,
                fullContextSessions: this.studyData.metrics.fullContextSessions,
                successfulOutcomes: this.studyData.metrics.successfulOutcomes,
                overallSuccessRate: this.studyData.metrics.totalSessions > 0 ? 
                    this.studyData.metrics.successfulOutcomes / this.studyData.metrics.totalSessions : 0
            },
            recommendations: this.generateExperimentalRecommendations(),
            insights: this.studyData.insights || [],
            detailedSessions: this.studyData.sessions.map(s => ({
                sessionId: s.sessionId,
                duration: s.duration,
                contextUtilization: s.metrics.contextUtilization,
                outcomeQuality: s.metrics.outcomeQuality,
                tasksCompleted: s.metrics.tasksCompleted,
                wasEarlyEnd: s.metrics.contextUtilization < s.config.earlyEndThreshold
            }))
        };

        const filename = `session_optimization_report_${this.studyData.studyId}.json`;
        const filepath = path.join(this.dataDir, filename);
        
        fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
        console.log(`📊 Study report generated: ${filepath}`);
        
        return report;
    }

    /**
     * Run the session optimization study
     */
    async runStudy(studyConfig = {}) {
        console.log('🔬 Starting Session Optimization Study...');
        
        const {
            sessionCount = 10,
            sessionDuration = 3600000, // 1 hour
            contextExpiration = 7200000, // 2 hours
            earlyEndThreshold = 0.7 // 70%
        } = studyConfig;

        for (let i = 0; i < sessionCount; i++) {
            const sessionId = this.startSessionStudy({
                maxDuration: sessionDuration,
                contextExpiration,
                earlyEndThreshold,
                taskType: 'experimental',
                complexity: 'medium'
            });

            // Simulate session events
            await this.simulateSessionEvents(sessionId);
            
            // End session based on optimization recommendations
            const recommendations = this.getOptimizationRecommendations(sessionId);
            const shouldEndEarly = recommendations.some(r => r.type === 'early_end' && r.priority === 'high');
            
            if (shouldEndEarly) {
                this.endSession(sessionId, 'optimization_recommendation');
            } else {
                // Let session run to completion
                setTimeout(() => {
                    this.endSession(sessionId, 'natural_completion');
                }, sessionDuration);
            }
        }

        // Generate final report
        const report = this.generateReport();
        console.log('🔬 Session Optimization Study completed!');
        console.log('📊 Key Findings:');
        console.log(`   Early End Success Rate: ${(report.recommendations.insights.earlyEndSuccessRate * 100).toFixed(1)}%`);
        console.log(`   Full Context Success Rate: ${(report.recommendations.insights.fullContextSuccessRate * 100).toFixed(1)}%`);
        console.log(`   Recommended Strategy: ${report.recommendations.insights.recommendedStrategy}`);
        
        return report;
    }

    /**
     * Simulate session events for testing
     */
    async simulateSessionEvents(sessionId) {
        const events = [
            { type: 'task_completed', delay: 300000 }, // 5 minutes
            { type: 'context_heavy', delay: 600000 }, // 10 minutes
            { type: 'task_completed', delay: 900000 }, // 15 minutes
            { type: 'performance_degradation', delay: 1200000 }, // 20 minutes
            { type: 'user_frustration', delay: 1500000 } // 25 minutes
        ];

        for (const event of events) {
            setTimeout(() => {
                this.recordEvent(sessionId, event.type, {
                    simulated: true,
                    timestamp: new Date().toISOString()
                });
            }, event.delay);
        }
    }
}

// CLI Interface
if (require.main === module) {
    const study = new SessionOptimizationStudy();
    
    const command = process.argv[2];
    const options = process.argv.slice(3);
    
    switch (command) {
        case 'start':
            const sessionId = study.startSessionStudy({
                maxDuration: parseInt(options[0]) || 3600000,
                contextExpiration: parseInt(options[1]) || 7200000,
                earlyEndThreshold: parseFloat(options[2]) || 0.7
            });
            console.log(`Session started: ${sessionId}`);
            break;
            
        case 'event':
            if (options.length < 2) {
                console.error('Usage: node session_optimization_study.cjs event <sessionId> <eventType> [data]');
                process.exit(1);
            }
            study.recordEvent(options[0], options[1], options[2] ? JSON.parse(options[2]) : {});
            break;
            
        case 'end':
            if (options.length < 1) {
                console.error('Usage: node session_optimization_study.cjs end <sessionId> [reason]');
                process.exit(1);
            }
            study.endSession(options[0], options[1] || 'manual');
            break;
            
        case 'recommendations':
            if (options.length < 1) {
                console.error('Usage: node session_optimization_study.cjs recommendations <sessionId>');
                process.exit(1);
            }
            const recommendations = study.getOptimizationRecommendations(options[0]);
            console.log('Optimization Recommendations:');
            console.log(JSON.stringify(recommendations, null, 2));
            break;
            
        case 'run-study':
            const sessionCount = parseInt(options[0]) || 10;
            study.runStudy({ sessionCount });
            break;
            
        case 'report':
            const report = study.generateReport();
            console.log('Study Report:');
            console.log(JSON.stringify(report, null, 2));
            break;
            
        default:
            console.log('Session Optimization Study CLI');
            console.log('');
            console.log('Commands:');
            console.log('  start [maxDuration] [contextExpiration] [earlyEndThreshold] - Start a new session');
            console.log('  event <sessionId> <eventType> [data] - Record an event');
            console.log('  end <sessionId> [reason] - End a session');
            console.log('  recommendations <sessionId> - Get optimization recommendations');
            console.log('  run-study [sessionCount] - Run experimental study');
            console.log('  report - Generate study report');
            break;
    }
}

module.exports = SessionOptimizationStudy; 