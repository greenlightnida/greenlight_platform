/**
 * Embedded Performance Manager
 * 
 * This manager operates as an embedded, organic part of the system design
 * rather than a commanding force. It provides gentle guidance and insights
 * while allowing each holon to pursue their north star metrics progressively.
 */

import { Logger } from '../../utils/logger/logger';
import { EventBus } from '../events/EventBus';
import { Holon, HolonType } from '../holons/HolonSystem';

export interface PerformanceInsight {
    id: string;
    type: 'suggestion' | 'observation' | 'optimization' | 'alignment';
    message: string;
    confidence: number;
    impact: 'low' | 'medium' | 'high' | 'positive' | 'negative';
    actionable: boolean;
    holonId?: string;
    context?: any;
    timestamp: Date;
}

export interface HolonPerformanceConfig {
    holonType: HolonType;
    trackingFrequency: number; // milliseconds
    metrics: string[];
    insights: string[];
    northStarAlignment: boolean;
    adaptiveThresholds: boolean;
}

export interface EmbeddedTrackingData {
    holonId: string;
    holonType: HolonType;
    metric: string;
    value: number;
    context?: any;
    timestamp: Date;
}

export class EmbeddedPerformanceManager {
    private holonConfigs: Map<string, HolonPerformanceConfig> = new Map();
    private insights: PerformanceInsight[] = [];
    private trackingData: EmbeddedTrackingData[] = [];
    private eventBus: EventBus;
    private logger: Logger;

    constructor(eventBus: EventBus, logger: Logger) {
        this.eventBus = eventBus;
        this.logger = logger;
        this.initializeEmbeddedTracking();
    }

    /**
     * Initialize embedded tracking without disrupting existing workflows
     */
    private async initializeEmbeddedTracking(): Promise<void> {
        this.logger.info('Initializing embedded performance tracking');
        
        // Subscribe to existing events to gather data seamlessly
        await this.eventBus.subscribe('holon_activity', this.handleHolonActivity.bind(this));
        await this.eventBus.subscribe('command_execution', this.handleCommandExecution.bind(this));
        await this.eventBus.subscribe('workflow_completion', this.handleWorkflowCompletion.bind(this));
        await this.eventBus.subscribe('user_interaction', this.handleUserInteraction.bind(this));
        
        this.logger.info('Embedded performance tracking initialized');
    }

    /**
     * Adapt to a specific holon's characteristics and needs
     * @param holon
     */
    async adaptToHolon(holon: Holon): Promise<void> {
        const config = this.getHolonConfig(holon.type);
        
        this.logger.info(`Adapting performance management to holon: ${holon.id} (${holon.type})`);
        
        // Customize tracking based on holon characteristics
        await this.setupHolonSpecificTracking(holon, config);
        
        // Adjust monitoring frequency based on holon activity patterns
        await this.setMonitoringFrequency(holon, config.trackingFrequency);
        
        // Provide domain-specific insights
        await this.setupDomainInsights(holon, config.insights);
        
        this.logger.info(`Successfully adapted to holon: ${holon.id}`);
    }

    /**
     * Get holon-specific configuration
     * @param holonType
     */
    private getHolonConfig(holonType: HolonType): HolonPerformanceConfig {
        const configs: Record<HolonType, HolonPerformanceConfig> = {
            'TestingHolon': {
                holonType: 'TestingHolon',
                trackingFrequency: 30000, // 30 seconds
                metrics: ['test_coverage', 'bug_detection_time', 'test_automation_rate'],
                insights: ['quality_gates', 'test_optimization', 'coverage_gaps'],
                northStarAlignment: true,
                adaptiveThresholds: true
            },
            'CommandCenterHolon': {
                holonType: 'CommandCenterHolon',
                trackingFrequency: 15000, // 15 seconds
                metrics: ['command_response_time', 'execution_success_rate', 'user_satisfaction'],
                insights: ['command_optimization', 'user_experience', 'efficiency_gains'],
                northStarAlignment: true,
                adaptiveThresholds: true
            },
            'GovernanceHolon': {
                holonType: 'GovernanceHolon',
                trackingFrequency: 60000, // 1 minute
                metrics: ['policy_compliance', 'risk_assessment', 'governance_effectiveness'],
                insights: ['compliance_gaps', 'risk_mitigation', 'policy_optimization'],
                northStarAlignment: true,
                adaptiveThresholds: true
            },
            'WorkHolon': {
                holonType: 'WorkHolon',
                trackingFrequency: 45000, // 45 seconds
                metrics: ['workflow_efficiency', 'task_completion_rate', 'resource_utilization'],
                insights: ['workflow_optimization', 'resource_allocation', 'productivity_gains'],
                northStarAlignment: true,
                adaptiveThresholds: true
            },
            'KnowledgeHolon': {
                holonType: 'KnowledgeHolon',
                trackingFrequency: 90000, // 1.5 minutes
                metrics: ['learning_progress', 'knowledge_sharing', 'documentation_quality'],
                insights: ['learning_optimization', 'knowledge_gaps', 'content_improvement'],
                northStarAlignment: true,
                adaptiveThresholds: true
            },
            'PerformanceHolon': {
                holonType: 'PerformanceHolon',
                trackingFrequency: 20000, // 20 seconds
                metrics: ['okr_progress', 'cross_holon_alignment', 'system_performance'],
                insights: ['okr_optimization', 'alignment_gaps', 'performance_improvements'],
                northStarAlignment: true,
                adaptiveThresholds: true
            }
        };

        return configs[holonType] || this.getDefaultConfig(holonType);
    }

    /**
     * Get default configuration for unknown holon types
     * @param holonType
     */
    private getDefaultConfig(holonType: HolonType): HolonPerformanceConfig {
        return {
            holonType,
            trackingFrequency: 60000, // 1 minute default
            metrics: ['activity_level', 'success_rate', 'user_satisfaction'],
            insights: ['general_optimization', 'performance_improvement'],
            northStarAlignment: true,
            adaptiveThresholds: true
        };
    }

    /**
     * Setup holon-specific tracking
     * @param holon
     * @param config
     */
    private async setupHolonSpecificTracking(holon: Holon, config: HolonPerformanceConfig): Promise<void> {
        // Store configuration for this holon
        this.holonConfigs.set(holon.id, config);
        
        // Setup domain-specific event listeners
        for (const metric of config.metrics) {
            await this.setupMetricTracking(holon, metric);
        }
        
        this.logger.debug(`Setup tracking for holon ${holon.id} with ${config.metrics.length} metrics`);
    }

    /**
     * Setup metric tracking for a specific holon and metric
     * @param holon
     * @param metric
     */
    private async setupMetricTracking(holon: Holon, metric: string): Promise<void> {
        const eventName = `${holon.type.toLowerCase()}_${metric}`;
        
        await this.eventBus.subscribe(eventName, (data: any) => {
            this.recordMetric(holon.id, holon.type, metric, data.value, data.context);
        });
    }

    /**
     * Set monitoring frequency based on holon activity patterns
     * @param holon
     * @param frequency
     */
    private async setMonitoringFrequency(holon: Holon, frequency: number): Promise<void> {
        // Adjust monitoring frequency based on holon activity
        const activityLevel = await this.getHolonActivityLevel(holon);
        
        let adjustedFrequency = frequency;
        if (activityLevel === 'high') {
            adjustedFrequency = Math.max(frequency / 2, 5000); // More frequent for high activity
        } else if (activityLevel === 'low') {
            adjustedFrequency = frequency * 2; // Less frequent for low activity
        }
        
        this.logger.debug(`Set monitoring frequency for ${holon.id} to ${adjustedFrequency}ms (activity: ${activityLevel})`);
    }

    /**
     * Get holon activity level
     * @param holon
     */
    private async getHolonActivityLevel(holon: Holon): Promise<'low' | 'medium' | 'high'> {
        // Analyze recent activity data for this holon
        const recentData = this.trackingData
            .filter(data => data.holonId === holon.id)
            .filter(data => Date.now() - data.timestamp.getTime() < 3600000) // Last hour
            .length;
        
        if (recentData > 100) return 'high';
        if (recentData > 20) return 'medium';
        return 'low';
    }

    /**
     * Setup domain-specific insights
     * @param holon
     * @param insightTypes
     */
    private async setupDomainInsights(holon: Holon, insightTypes: string[]): Promise<void> {
        for (const insightType of insightTypes) {
            await this.setupInsightGeneration(holon, insightType);
        }
    }

    /**
     * Setup insight generation for a specific type
     * @param holon
     * @param insightType
     */
    private async setupInsightGeneration(holon: Holon, insightType: string): Promise<void> {
        // Setup periodic insight generation based on holon activity
        setInterval(async () => {
            const insight = await this.generateInsight(holon, insightType);
            if (insight) {
                this.insights.push(insight);
                await this.eventBus.publish('performance_insight_generated', insight);
            }
        }, this.holonConfigs.get(holon.id)?.trackingFrequency || 60000);
    }

    /**
     * Generate insight for a specific holon and type
     * @param holon
     * @param insightType
     */
    private async generateInsight(holon: Holon, insightType: string): Promise<PerformanceInsight | null> {
        const holonData = this.trackingData
            .filter(data => data.holonId === holon.id)
            .filter(data => Date.now() - data.timestamp.getTime() < 3600000); // Last hour
        
        if (holonData.length === 0) return null;
        
        const insight = await this.analyzeHolonData(holon, insightType, holonData);
        return insight;
    }

    /**
     * Analyze holon data to generate insights
     * @param holon
     * @param insightType
     * @param data
     */
    private async analyzeHolonData(holon: Holon, insightType: string, data: EmbeddedTrackingData[]): Promise<PerformanceInsight> {
        const insight: PerformanceInsight = {
            id: `insight_${holon.id}_${insightType}_${Date.now()}`,
            type: 'suggestion',
            message: '',
            confidence: 0.8,
            impact: 'medium',
            actionable: true,
            holonId: holon.id,
            context: { insightType, dataPoints: data.length },
            timestamp: new Date()
        };

        // Generate insight based on type and data
        switch (insightType) {
            case 'quality_gates':
                insight.message = `Consider optimizing quality gates based on recent test patterns`;
                insight.confidence = 0.85;
                break;
            case 'command_optimization':
                insight.message = `Command execution patterns suggest optimization opportunities`;
                insight.confidence = 0.9;
                break;
            case 'workflow_optimization':
                insight.message = `Workflow efficiency could be improved based on recent data`;
                insight.confidence = 0.8;
                break;
            case 'learning_optimization':
                insight.message = `Learning patterns indicate opportunities for optimization`;
                insight.confidence = 0.75;
                break;
            default:
                insight.message = `Consider reviewing ${insightType} based on recent activity`;
                insight.confidence = 0.7;
        }

        return insight;
    }

    /**
     * Record metric data seamlessly
     * @param holonId
     * @param holonType
     * @param metric
     * @param value
     * @param context
     */
    private recordMetric(holonId: string, holonType: HolonType, metric: string, value: number, context?: any): void {
        const trackingData: EmbeddedTrackingData = {
            holonId,
            holonType,
            metric,
            value,
            context,
            timestamp: new Date()
        };
        
        this.trackingData.push(trackingData);
        
        // Keep only recent data (last 24 hours)
        const cutoff = Date.now() - 86400000; // 24 hours
        this.trackingData = this.trackingData.filter(data => 
            data.timestamp.getTime() > cutoff
        );
    }

    /**
     * Handle holon activity events
     * @param data
     */
    private async handleHolonActivity(data: any): Promise<void> {
        const { holonId, holonType, activity, context } = data;
        
        // Record activity level
        this.recordMetric(holonId, holonType, 'activity_level', 1, { activity, context });
        
        // Generate gentle insights if needed
        await this.checkForInsights(holonId, holonType, 'activity', context);
    }

    /**
     * Handle command execution events
     * @param data
     */
    private async handleCommandExecution(data: any): Promise<void> {
        const { holonId, holonType, command, duration, success, context } = data;
        
        // Record command metrics
        this.recordMetric(holonId, holonType, 'command_response_time', duration, { command, success });
        this.recordMetric(holonId, holonType, 'execution_success_rate', success ? 1 : 0, { command });
        
        // Generate gentle insights if needed
        await this.checkForInsights(holonId, holonType, 'command', { command, duration, success });
    }

    /**
     * Handle workflow completion events
     * @param data
     */
    private async handleWorkflowCompletion(data: any): Promise<void> {
        const { holonId, holonType, workflow, duration, success, context } = data;
        
        // Record workflow metrics
        this.recordMetric(holonId, holonType, 'workflow_efficiency', duration, { workflow, success });
        this.recordMetric(holonId, holonType, 'task_completion_rate', success ? 1 : 0, { workflow });
        
        // Generate gentle insights if needed
        await this.checkForInsights(holonId, holonType, 'workflow', { workflow, duration, success });
    }

    /**
     * Handle user interaction events
     * @param data
     */
    private async handleUserInteraction(data: any): Promise<void> {
        const { holonId, holonType, interaction, satisfaction, context } = data;
        
        // Record user interaction metrics
        this.recordMetric(holonId, holonType, 'user_satisfaction', satisfaction, { interaction });
        
        // Generate gentle insights if needed
        await this.checkForInsights(holonId, holonType, 'user_interaction', { interaction, satisfaction });
    }

    /**
     * Check for insights based on recent activity
     * @param holonId
     * @param holonType
     * @param activityType
     * @param context
     */
    private async checkForInsights(holonId: string, holonType: HolonType, activityType: string, context: any): Promise<void> {
        const config = this.holonConfigs.get(holonId);
        if (!config) return;
        
        // Only generate insights occasionally to avoid overwhelming
        if (Math.random() > 0.1) return; // 10% chance
        
        const insight = await this.generateInsight({ id: holonId, type: holonType } as Holon, 'general_optimization');
        if (insight) {
            insight.context = { ...insight.context, activityType, ...context };
            this.insights.push(insight);
            await this.eventBus.publish('performance_insight_generated', insight);
        }
    }

    /**
     * Get insights for a specific holon
     * @param holonId
     */
    async getInsightsForHolon(holonId: string): Promise<PerformanceInsight[]> {
        return this.insights
            .filter(insight => insight.holonId === holonId)
            .filter(insight => Date.now() - insight.timestamp.getTime() < 86400000) // Last 24 hours
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }

    /**
     * Get all recent insights
     */
    async getAllInsights(): Promise<PerformanceInsight[]> {
        return this.insights
            .filter(insight => Date.now() - insight.timestamp.getTime() < 86400000) // Last 24 hours
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }

    /**
     * Get performance data for a specific holon
     * @param holonId
     * @param timeRange
     */
    async getHolonPerformanceData(holonId: string, timeRange: number = 3600000): Promise<EmbeddedTrackingData[]> {
        const cutoff = Date.now() - timeRange;
        return this.trackingData
            .filter(data => data.holonId === holonId)
            .filter(data => data.timestamp.getTime() > cutoff)
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }

    /**
     * Get system-wide performance summary
     */
    async getSystemPerformanceSummary(): Promise<any> {
        const summary = {
            totalHolons: this.holonConfigs.size,
            totalInsights: this.insights.length,
            totalDataPoints: this.trackingData.length,
            recentActivity: this.trackingData
                .filter(data => Date.now() - data.timestamp.getTime() < 3600000) // Last hour
                .length,
            holonActivity: {} as Record<string, number>
        };
        
        // Calculate activity per holon
        for (const [holonId] of this.holonConfigs) {
            summary.holonActivity[holonId] = this.trackingData
                .filter(data => data.holonId === holonId)
                .filter(data => Date.now() - data.timestamp.getTime() < 3600000)
                .length;
        }
        
        return summary;
    }
}

export default EmbeddedPerformanceManager; 